// order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {

  constructor(private prisma: PrismaService) {}

  async createOrder(data: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        customerId: data.customerId,
        address: data.address,
        dateTime: new Date(), 
        OrderItems: {
          create: data.items.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        OrderItems: true, 
      },
    });
  }


  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        OrderItems: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        OrderItems: true,
      },
    });
  }

  async updateOrder(id: number, data: CreateOrderDto) {
    console.log(`entrei em updateOrder, id: ${id}`);
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });
    return this.prisma.order.update({
      where: { id },
      data: {
        customerId: data.customerId,
        address: data.address, 
        OrderItems: {
          create: data.items.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        OrderItems: true,
      },
    });
  }
  

  async deleteOrder(id: number) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });
  
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { deleted: true },
    });
  
    return updatedOrder;
  }


  async getOrdersByCustomerId(customerId: number) {
    return this.prisma.order.findMany({
      where: {
        customerId: customerId,
        deleted: false,
      },
      include: {
        OrderItems: {
          include: {
              Menu: true,
          },
      },
      },
    });
  }

}