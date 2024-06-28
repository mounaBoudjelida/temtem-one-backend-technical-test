import {
  Body,
  Request,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/guards/auth.guard';
import { ProductsService } from './products.service';
import { Action } from 'src/enums/actions.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  PRODUCT_IMAGE_MAX_SIZE,
  PRODUCT_IMAGE_PATH,
} from 'src/utils/constants.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/utils/file-upload.utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../users/schemas/user.schema';
import { Category } from 'src/enums/category.enum';
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthorizationGuard(Action.READ_PRODUCT))
  @Get('/')
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'sortBy', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: 'string' })
  @ApiQuery({ name: 'filter', required: false, type: 'string' })
  findAll(
    @Request() req: any,
    @Query('sortBy') sortBy: string,
    @Query('order') order: string,
    @Query('filter') filter: string,
  ) {
    return this.productsService.findAll(
      req.user as User,
      sortBy,
      order,
      filter,
    );
  }

  @UseGuards(AuthorizationGuard(Action.CREATE_PRODUCT))
  @Post('/')
  @ApiOperation({ summary: 'Create new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'category', 'price', 'image'],
      properties: {
        name: { type: 'string', example: 'Lunette' },
        description: { type: 'string', example: 'Protège les yeux' },
        category: {
          type: 'string',
          enum: Object.values(Category),
          example: Category.CATEGORY_1,
        },
        price: { type: 'number', example: 567 },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `./files/${PRODUCT_IMAGE_PATH}`,
        filename: editFileName,
      }),
    }),
  )
  create(
    @Request() req: any,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/ })
        .addMaxSizeValidator({
          maxSize: PRODUCT_IMAGE_MAX_SIZE,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    productImage: Express.Multer.File,
  ) {
    return this.productsService.create(
      req.user,
      createProductDto,
      productImage.filename,
    );
  }

  @UseGuards(AuthorizationGuard(Action.READ_PRODUCT))
  @Get('/:id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthorizationGuard(Action.UPDATE_PRODUCT))
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'category', 'price', 'image'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: {
          type: 'string',
          enum: Object.values(Category),
          example: Category.CATEGORY_1,
        },
        price: { type: 'number' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `./files/${PRODUCT_IMAGE_PATH}`,
        filename: editFileName,
      }),
    }),
  )
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/ })
        .addMaxSizeValidator({
          maxSize: PRODUCT_IMAGE_MAX_SIZE,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    productImage?: Express.Multer.File,
  ) {
    return this.productsService.update(
      req.user,
      id,
      updateProductDto,
      productImage?.filename,
    );
  }

  @UseGuards(AuthorizationGuard(Action.REMOVE_PRODUCT))
  @Delete('/:id')
  @ApiOperation({ summary: 'Remove a product' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.productsService.remove(req.user, id);
  }
}
