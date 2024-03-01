import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GraphQLErrorFilter } from './filters/custom-exception.filter';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['Access-Control-Allow-Methods']
  })
 
  app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }));
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints).join(
            ', '
          )
          return accumulator
        }, {})
        console.log(formattedErrors)

        throw new BadRequestException(formattedErrors)
      }
    })
  )

  app.useGlobalFilters(new GraphQLErrorFilter())
  await app.listen(3333);
}
bootstrap();
