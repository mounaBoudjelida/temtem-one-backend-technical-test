import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Resource } from 'src/enums/resource.enum';
import { AuthorizationGuard } from 'src/guards/auth.guard';
import { ProductsService } from './products.service';
import { PredefinedPermissions } from 'src/enums/predefined-permissions.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(
    AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.CREATE),
  )
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.READ))
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.READ))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(
    AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.UPDATE),
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(
    AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.REMOVE),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
