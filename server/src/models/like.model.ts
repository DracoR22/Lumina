import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LikeType {
  @Field(() => Int)
  id: string;

  @Field(() => Int)
  userId: string;

  @Field(() => Int)
  postId: string;
}