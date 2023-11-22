import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporte o PrismaService para torná-lo acessível em outros módulos
})
export class PrismaModule {}
