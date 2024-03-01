import { Module } from '@nestjs/common';
import { PrismaService } from './common/db/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UserResolver } from './modules/user/user.resolver';
import { UserService } from './modules/user/user.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res })
    }),
    ConfigModule.forRoot({}),
    AuthModule,
    UserModule
  ],
  providers: [PrismaService, UserResolver, UserService],
})
export class AppModule {}
