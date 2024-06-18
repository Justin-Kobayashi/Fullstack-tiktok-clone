import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CommentCreateInput {
  @Field()
  text: string;


  @Field(() => Int)
  postId: number;

  @Field(() => Int)
  userId: number;
}