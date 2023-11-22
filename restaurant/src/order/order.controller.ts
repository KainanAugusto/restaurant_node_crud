// order.controller.ts
import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe,UseGuards  } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { AuthGuard } from 'src/infra/providers/auth-guard.providers';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  findAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  findOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  updateOrder(@Param('id', ParseIntPipe) id: number, @Body() createOrderDto: CreateOrderDto) {
    console.log(id, createOrderDto);

    return this.orderService.updateOrder(id, createOrderDto);
  }

  @Delete(':id')
  removeOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }


  @Get('customer/:customerId')
  findOrdersByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.orderService.getOrdersByCustomerId(customerId);
  }
}