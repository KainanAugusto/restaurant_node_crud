// src/menu/menu.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createMenuDto: CreateMenuDto) {
        return this.prisma.menu.create({
            data: createMenuDto,
        });
    }

    async findAll() {
        return this.prisma.menu.findMany();
    }

    async findOne(id: string) {
        const itemId = parseInt(id, 10);
        return this.prisma.menu.findUnique({
            where: { id: itemId },
        });
    }

    async update(id: string, updateMenuDto: UpdateMenuDto) {
        const itemId = parseInt(id, 10);
        return this.prisma.menu.update({
            where: { id: itemId },
            data: updateMenuDto,
        });
    }

    async remove(id: string) {
        const itemId = parseInt(id, 10);
        return this.prisma.menu.delete({
            where: { id: itemId },
        });
    }
}
