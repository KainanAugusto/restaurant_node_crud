// src/menu/menu.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { AuthGuard } from 'src/infra/providers/auth-guard.providers';


@UseGuards(AuthGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
