import { Controller, Get, Post, Body,  Param, Inject,  ParseUUIDPipe,  Query, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto/order-paginatnion.dto';
import { PaginationDto } from 'src/common/pagination/dtos/pagination-dto';
import { StatusDto } from './dto/status.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Controller('orders')
export class OrdersController {
  
  constructor(
    @Inject(NATS_SERVICE) private readonly client : ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }

  @Get()
  findAll(@Query() paginationDto : OrderPaginationDto ) {  
    return this.client.send('findAllOrders', paginationDto )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }

  @Get('/id/:id')
  findOne(@Param('id', ParseUUIDPipe ) id: string ) {
    return this.client.send('findOneOrder', { id } )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }

  @Get('/status/:status')
  findbyStatus(
    @Param() statusDto : StatusDto,
    @Query() paginationDto : PaginationDto
  ) {
    return this.client.send('findAllOrders', { ...paginationDto,  status : statusDto.status  } )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }

  
  @Patch('/:id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id : string,
    @Body() statusDto: ChangeOrderStatusDto
  ) {
    return this.client.send('changeOrderStatus', { id, status : statusDto.status} )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }
 
}
