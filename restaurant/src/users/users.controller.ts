import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from './dto/createuser.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async createUser(@Body() CreateUserDTO: CreateUserDTO) {
        return await this.usersService.createUser(CreateUserDTO);
    }

    @Put(':id')
    async updateUser(@Param('id') id: String, @Body() UpdateUserDTO: UpdateUserDTO) {
        return this.usersService.updateUser(+id, UpdateUserDTO);
    }

    @Delete('id')
    async deleteUser(@Param('id') id:string): Promise<void>{
        await this.usersService.deleteUser(+id);
    }

    @Get()
    async findAll(): Promise<User[]>{
        return this.usersService.findAll();
    }
}
