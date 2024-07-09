import { IsEnum } from "class-validator"
import { OrderStatus, OrderStatusList } from "../enum/order.enum"


export class ChangeOrderStatusDto {

  @IsEnum( OrderStatusList, {
    message : `Valid status are ${ OrderStatusList }`
  })
  status : OrderStatus

}