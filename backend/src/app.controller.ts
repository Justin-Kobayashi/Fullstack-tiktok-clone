import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller("App")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("Main")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("Address2")
  getHeello(): string {
    return "Your at address 2";
  }
}
