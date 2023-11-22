import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [PrismaModule, AuthModule,
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }
