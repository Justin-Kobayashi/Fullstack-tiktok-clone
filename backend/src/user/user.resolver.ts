import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { LoginResponse, RegisterResponse } from 'src/auth/types';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { GraphQLErrorFilter } from 'src/filters.ts/custom.exception.filter';
import { User } from './user.model';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { createWriteStream } from 'fs';

@UseFilters(GraphQLErrorFilter)
@Resolver()
export class UserResolver {

    constructor (
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }


    
    @Mutation(() => RegisterResponse)
    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() context: { res: Response },
    
    ): Promise<RegisterResponse> {
        if (registerDto.password !== registerDto.confirmPassword) {
            throw new BadRequestException({
            confirmPassword: 'Password and confirm password are not the same.',
            });
        
        } 
        
          const { user } = await this.authService.register(
            registerDto,
            context.res,
          );

          return { user };


       
    }

    @Mutation(() => LoginResponse) 
    async login(
      @Args('loginInput') loginDto: LoginDto,
      @Context() context: { res: Response },
    ) {
      return this.authService.login(loginDto, context.res);
    }

    @Mutation(() => String)
    async logout(@Context() context: { res: Response }) {
      return this.authService.logout(context.res);
    }

    @Mutation(() => String)
    async refreshToken(@Context() context: { req: Request; res: Response }) {
      try {
        return this.authService.refreshToken(context.req, context.res);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    @Query(() => String)
    async hello() {
      return "Hello World";
    }


    @Query(() => [User])
    async getUsers() {
      return this.userService.getUsers();
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => User)
    async updateUserProfile(
      @Context()
      context: { req: Request },
      @Args('fullname', { type: () => String, nullable: true }) fullname?: string,
      @Args('bio', { type: () => String, nullable: true }) bio?: string,
      @Args('image', { type: () => GraphQLUpload, nullable: true })
      image?: GraphQLUpload,
    ) {
      let imageUrl;
      if (image) {
        imageUrl = await this.storeImageAndGetURL(image);
      }
      return this.userService.updateProfile(context.req.user.sub, {
        fullname,
        bio,
        image: imageUrl,
      });
    }

    private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
      const { createReadStream, filename } = await file;
      const fileData = await file;
      console.log('fileData!', fileData);
  
      const uniqueFilename = `${uuidv4()}_${filename}`;
      const imagePath = join(process.cwd(), 'public', uniqueFilename);
      const imageUrl = `${process.env.APP_URL}/${uniqueFilename}`;
      const readStream = createReadStream();
      readStream.pipe(createWriteStream(imagePath));
  
      return imageUrl;
    }

}