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
import { PRODUCT_IMAGE_PATH } from 'src/utils/constants.utils';
import { removeFileFromStorage } from 'src/utils/helpers.utils';
import { User } from '../users/schemas/user.schema';
import { Role } from 'src/enums/role.enum';
import { Category } from 'src/enums/category.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(
    currentUser: any,
    createProductDto: CreateProductDto,
    productImage: string,
  ) {
    const productExists = !!(await this.productModel.exists({
      name: createProductDto.name,
    }));
    if (productExists) {
      throw new ConflictException('NAME_ALREADY_EXISTS');
    }
    const product = await this.productModel.create({
      ...createProductDto,
      image: productImage,
      createdBy: currentUser._id,
    });
    return product;
  }

  async findAll(
    currentUser: User,
    sortBy: string,
    order: string,
    filter: string,
  ) {
    if (currentUser.role === Role.ADMIN) {
      const products = await this.productModel.find();
      return products;
    } else {
      let filterQuery: any = {};
      if (filter) {
        filterQuery = { category: { $eq: filter } };
      }

      const sortOptions = {};
      if (sortBy || order) {
        const sortField = sortBy || 'price';
        const sortOrder = order === 'desc' ? -1 : 1;
        sortOptions[sortField] = sortOrder;
      }

      const products = await this.productModel
        .find(filterQuery)
        .sort(sortOptions);
      return products;
    }
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

    const _product = await this.productModel.findById(id);
    if (!_product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }
    if (productImage && _product.image) {
      removeFileFromStorage(`${PRODUCT_IMAGE_PATH}/${_product.image}`);
    }

    const data: any = updateProductDto;
    data.updatedBy = currentUser._id;

    if (productImage) {
      data.image = productImage;
    }
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });

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
