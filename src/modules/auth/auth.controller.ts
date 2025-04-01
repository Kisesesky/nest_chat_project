import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUser } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { RequestOrigin } from '../../decorators/request-origin.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorize User')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User Register',
    description: 'User Register Api'
  })
  @ApiBody({
    type: RegisterUser
  })
  @Post('signup')
  async create(@Body() registerUser: RegisterUser) {
    return this.authService.register(registerUser);
  }

  @ApiOperation({
    summary: 'User Sign-In',
    description: 'User Sign-In Api'
  })
  @ApiBody({
    type: LoginDto
  })
  @Post('signin')
  async singIn(@Body() loginDto: LoginDto, @RequestOrigin() origin, @Res() res: Response) {
    const { accessToken, accessOption, refreshToken, refreshOption } = await this.authService.logIn(loginDto, origin)

    res.cookie('Authentication', accessToken, accessOption)
    res.cookie('Refresh', refreshToken, refreshOption)

    return res.json({
      message: 'sign-In Success',
      accessToken: accessToken,
      refreshToken: refreshToken
    })

  }

  @ApiOperation({
    summary: 'User Sign-Out',
    description: 'User Sign-Out Api'
  })
  @ApiBody({
    type: LoginDto
  })
  @Post('signout')
  signOut(@Res() res: Response, @RequestOrigin() origin: string) {
    const { accessOption, refreshOption } = this.authService.expireJwtToken(origin)
    res.cookie('Authentication', '', accessOption)
    res.cookie('Refresh', '', refreshOption)

    res.json({
      message: 'sign-Out GoobBye'
    })
  }

  
  @ApiOperation({
    summary: 'All-User',
    description: 'All-User Api'
  })
  @Get()
  findAll() {
    return this.authService.findAllUser();
  }

  @ApiOperation({
    summary: 'Find-User',
    description: 'User-Find Api'
  })
  @Get(':id')
  findOne(@Param('email') email: string) {
    return this.authService.findOneUser(email);
  }

  @ApiOperation({
    summary: 'Update-User',
    description: 'User-Update Api'
  })
  @Patch(':id')
  update(@Param('email') email: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.updateUser(email, updateAuthDto);
  }

  @ApiOperation({
    summary: 'Delete-User',
    description: 'DeleteUser Api'
  })
  @Delete('/')
  remove(@Param('email') email: string) {
    return this.authService.removeUser(email);
  }
}
