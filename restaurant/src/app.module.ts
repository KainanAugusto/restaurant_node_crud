import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CustomerModule } from './customer/customer.module';

import { PrismaModule } from '../prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, PrismaModule, CustomerModule, OrderModule, MenuModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
