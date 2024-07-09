import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { CurrentUser } from './interfaces/current-user.interface';
import { Token } from './decorators/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client : ClientProxy) {}

  @Post('login')
  loginUser( @Body() loginUserDto : LoginUserDto ) {  
    return this.client.send('auth.login.user', loginUserDto )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }

  @Post('register')
  registerUser( @Body() registerUserDto : RegisterUserDto ) {  
    return this.client.send('auth.register.user', registerUserDto )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verifyToken(@User() user : CurrentUser, @Token() token : string  ) { 

    return {user, token}

    return this.client.send('auth.verify.user', { } )
      .pipe(
        catchError( error => { throw new RpcException( error )})
      );
  }

}
