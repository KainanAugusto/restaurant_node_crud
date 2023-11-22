import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(data: CreateCustomerDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        username: data.username,
        password: hashedPassword,
      },
    });
  }

  async findAllCustomers() {
    return this.prisma.customer.findMany();
  }

  async findCustomerById(id: string) {
    const customerId = parseInt(id, 10);
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async updateCustomer(id: string, data: UpdateCustomerDto) {
    const customerId = parseInt(id, 10); 
 
    return this.prisma.customer.update({
      where: { id: customerId },
      data,
    });
  }

  async deleteCustomer(id: string) {
    const customerId = parseInt(id, 10); 
    return this.prisma.customer.delete({
      where: { id: customerId },
    });
  }
}
