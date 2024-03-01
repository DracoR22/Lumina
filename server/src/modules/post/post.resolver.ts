import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { UseGuards } from "@nestjs/common";
import { GraphqlAuthGuard } from "../auth/graphql-auth.guard";
import { PostDetails, PostType } from "src/models/post.model";
import { Request } from "express";
import * as GraphQLUpload from "graphql-upload/graphqlUploadExpress.js"

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation((returns) => PostType)
  async createPost(
    @Context() context: { req: Request },
    @Args({ name: 'video', type: () => GraphQLUpload }) video: any,
    @Args('text') text: string,
  ) {
    const userId = context.req.user.sub;
    console.log('userId!', userId);
    // Save the video and get its path
    const videoPath = await this.postService.saveVideo(video);

    // Create the post
    const postData = {
      text,
      video: videoPath,
      user: { connect: { id: userId } },
    };

    return await this.postService.createPost(postData);
  }

  @Query((returns) => PostDetails)
  async getPostById(@Args('id') id: string) {
    return await this.postService.getPostById(id);
  }
  @Query((returns) => [PostType])
  async getPosts(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 1 }) take: number,
  ): Promise<PostType[]> {
    console.log('skip!', skip, 'take!', take);
    return await this.postService.getPosts(skip, take);
  }

  @Mutation((returns) => PostType)
  async deletePost(@Args('id') id: string) {
    return await this.postService.deletePost(id);
  }

  // get all the posts of a user
  @Query((returns) => [PostType])
  async getPostsByUserId(@Args('userId') userId: string) {
    return await this.postService.getPostsByUserId(userId);
  }
}