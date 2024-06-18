import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, JwtService, PrismaService, ConfigService]
})
export class AuthModule {}
