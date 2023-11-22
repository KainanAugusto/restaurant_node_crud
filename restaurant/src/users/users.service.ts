import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO } from './dto/createuser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(data: CreateUserDTO) {
        return await this.prisma.user.create({
            data,
        });
    }

    async updateUser(id: number, data: UpdateUserDTO) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id }
        })
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

}
