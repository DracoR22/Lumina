import { InputType, Field } from '@nestjs/graphql';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload';


@InputType()
export class CreatePostDto {
  @Field()
  text: string;

  @Field(() => GraphQLUpload, { nullable: true })
  video: string;
}