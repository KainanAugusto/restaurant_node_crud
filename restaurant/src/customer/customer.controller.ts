import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get()
  async findAll() {
    return this.customerService.findAllCustomers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerService.findCustomerById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }
}
