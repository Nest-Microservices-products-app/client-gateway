import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { RpcCustomExceptionFilter } from 'src/common/exceptions/rpc-exception.filter';
import { PaginationDto } from 'src/common/pagination/dtos/pagination-dto';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  
  constructor(
    @Inject(NATS_SERVICE) private readonly client : ClientProxy
  ) {}


  @Post()
  createProduct( @Body() createProductDto: CreateProductDto ){

    return this.client.send({ cmd: 'create_product' }, createProductDto )
      .pipe(
        catchError(err => { throw new RpcException(err)})
      );
  }

  @Get()
  findAllProduct(@Query() paginationDto : PaginationDto ){
    return this.client.send({ cmd: 'find_all_products' }, paginationDto )
  }

  @Get(':id')
  async findProduct(@Param('id', ParseIntPipe) id : number){


    return this.client
      .send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err) })
      )

    // try {
    //   const product = await firstValueFrom(
    //     this.client.send({ cmd: 'find_one_product' }, { id })
    //   );
    //   return product;

    // } catch (error) {
    //   throw new RpcException(error)
    // }

  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id : number,
    @Body() updatedProductDto : UpdateProductDto
  ){
    return this.client.send({ cmd: 'update_product' }, { id, ...updatedProductDto } )
      .pipe(
        catchError(err => { throw new RpcException(err)})
      )

  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id : number){
    return this.client.send({ cmd: 'delete_product' }, { id } )
      .pipe(
        catchError( err => { throw new RpcException(err)})
      )
  }



}
