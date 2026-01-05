import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
  controllers: [GatewayController],
  providers: [GatewayService, JwtAuthGuard],
  exports: [GatewayService],
})
export class GatewayModule {}

