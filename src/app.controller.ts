import { Controller, Get } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';

@Controller()
export class AppController {
  @Get('/morning')
  @Auth('DOCTOR')
  goodMorning() {
    return 'Good Morning!';
  }

  @Get('/afternoon')
  @Auth('PATIENT')
  goodAfternoon() {
    return 'Good Afternoon!';
  }

  @Get('/evening')
  @Auth('PATIENT', 'DOCTOR')
  goodEvening() {
    return 'Good Evening!';
  }

  @Get()
  sayHello() {
    console.log(typeof process.env.DB_HOST);
    console.log(typeof process.env.DB_PORT);
    console.log(typeof process.env.DB_USERNAME);
    console.log(typeof process.env.DB_PASSWORD);
    console.log(typeof process.env.DB_NAME);
    return 'Hello!';
  }
}
