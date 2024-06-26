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
} from '@nestjs/common';
import { Resource } from 'src/enums/resource.enum';
import { AuthorizationGuard } from 'src/guards/auth.guard';
import { ProductsService } from './products.service';
import { PredefinedPermissions } from 'src/enums/predefined-permissions.enum';
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
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.READ))
  @Get('/')
  @ApiOperation({ summary: 'Get all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(
    AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.CREATE),
  )
  @Post('/')
  @ApiOperation({ summary: 'Create new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
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
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
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

  @UseGuards(AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.READ))
  @Get('/:id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(
    AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.UPDATE),
  )
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
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

  @UseGuards(
    AuthorizationGuard(Resource.PRODUCTS, PredefinedPermissions.REMOVE),
  )
  @Delete('/:id')
  @ApiOperation({ summary: 'Remove a product' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.productsService.remove(req.user, id);
  }
}
