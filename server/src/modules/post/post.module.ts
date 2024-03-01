import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/db/prisma.service';
import { PostResolver } from './post.resolver';

@Module({
  providers: [PrismaService, PostService, PostResolver, ConfigService],
})
export class PostModule {}