import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [PrismaModule, AuthModule,
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '60m' },
    }),],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule { }
