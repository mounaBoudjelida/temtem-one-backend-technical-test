import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(currentUser: any,createProductDto: CreateProductDto, productImage: string) {
    const productExists = !!(await this.productModel.exists({
      name: createProductDto.name,
          }));
    if (productExists) {
      throw new ConflictException('NAME_ALREADY_EXISTS');
    }
    const product = await this.productModel.create({
      ...createProductDto,
      image: productImage,
      createdBy: currentUser._id
    });
    return product;
  }

  async findAll() {
    const products = await this.productModel.find();
    return products;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  async update(
    currentUser: any,
    id: string,
    updateProductDto: UpdateProductDto,
    productImage?: string,
  ) {
    if (updateProductDto.name) {
      const productExists = !!(await this.productModel.exists({
        _id: { $ne: id },
        name: updateProductDto.name,
      }));
      if (productExists) {
        throw new ConflictException('NAME_ALREADY_EXISTS');
      }
    }
    const data: any = updateProductDto;
    data.updatedBy = currentUser._id;
    data.image = productImage;
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  async remove(currentUser: any, id: string) {
    /* if Hard Delete */
    //const product = await this.productModel.findByIdAndDelete(id);

    /* if Soft Delete */
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isArchived: true,
        updatedBy: currentUser._id,
      },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }
    return product;
  }
}
