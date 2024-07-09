import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { ORDER_SERVICE } from 'src/config/services';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [
    NatsModule
  ],
  controllers: [OrdersController]
})
export class OrdersModule {

}
