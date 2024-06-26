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

  async create(createProductDto: CreateProductDto) {
    const productExists = !!(await this.productModel.exists({
      name: createProductDto.name,
    }));
    if (productExists) {
      throw new ConflictException('NAME_ALREADY_EXISTS');
    }
    const product = await this.productModel.create(createProductDto);
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto.name) {
      const productExists = !!(await this.productModel.exists({
        _id: { $ne: id },
        name: updateProductDto.name,
      }));
      if (productExists) {
        throw new ConflictException('NAME_ALREADY_EXISTS');
      }
    }
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  async remove(id: string) {
    /* if Hard Delete */
    //const product = await this.productModel.findByIdAndDelete(id);

    /* if Soft Delete */
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isArchived: true,
      },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }
    return product;
  }
}
