import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.model';
import { LikeType } from './like.model';


@ObjectType()
export class PostType {
  @Field(() => Int)
  id: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  video: string;
  @Field(() => User)
  user?: User;

  @Field(() => [LikeType], { nullable: true })
  likes?: LikeType[];
}

@ObjectType()
export class PostDetails extends PostType {
  @Field(() => [String], { nullable: true })
  otherPostIds?: string[];
}