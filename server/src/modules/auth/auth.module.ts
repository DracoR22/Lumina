import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [AuthService, PrismaService, JwtService, ConfigService],
    exports: [JwtService, AuthService],
})
export class AuthModule {}
