import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/db/prisma.service';

@Module({
    providers: [AuthService, PrismaService]
})
export class AuthModule {}
