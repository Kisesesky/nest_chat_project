import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUser } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { comparetPassword } from 'src/utils/password.util';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from './../../config/app/config.service';

@Injectable()
export class AuthService {
  constructor(
    private userService :UsersService,
    private jwtService : JwtService,
    private appConfigService : AppConfigService
  ) {}
  async register(registerUser: RegisterUser) {
    return this.userService.userCreate(registerUser)
  }

  async logIn(loginDto: LoginDto, origin : string) {
    const user = await this.userService.findUserEmail(loginDto.email)

    if(!await comparetPassword(loginDto.password, user.password)){
      throw new UnauthorizedException('이메일 또는 패스워드가 잘못 되었습니다.')
    }
    const { accessToken, accessOption } = this.setAccessToken(loginDto.email, origin)
    const { refreshToken, refreshOption } = this.setJwtRefreshToken(loginDto.email, origin)

    return {
      accessToken,
      accessOption,
      refreshToken,
      refreshOption
    }

  }

  setCookieOption(maxAge: number, requestDomain: string) {
    let domain : string;
    if(
      requestDomain.includes('127.0.0.1') || requestDomain.includes('localhost')
    )
    domain = 'localhost'
    else {
      domain = 'requestDomain'
    }
    return {
      domain,
      path: '/',
      httpOnly: true,
      maxAge,
      samSite: 'lax'
    }
  }

  setAccessToken(email: string, requestDomain: string) {
    const payload = { sub : email }
    const maxAge = 3600 * 1000
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: maxAge
    })
    return {
      accessToken: token,
      accessOption: this.setCookieOption(maxAge, requestDomain)
    }
  }

  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email }
    const maxAge = 30 * 24 * 3600
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: maxAge
    })
    return {
      refreshToken : token,
      refreshOption: this.setCookieOption(maxAge, requestDomain)
    }
  }

  expireJwtToken(requestDomain : string) {
    return {
      accessOption: this.setCookieOption(0, requestDomain),
      refreshOption: this.setCookieOption(0, requestDomain)

    }
  }

  async findAllUser() {
    return await this.userService.findAllUsers()
  }

  async findOneUser(email: string) {
    return await this.userService.findUserByemail(email)
  }

  async updateUser(email: string, updateAuthDto: UpdateAuthDto) {
    return await this.userService.updateUser(email, updateAuthDto)
  }

  async removeUser(email: string) {
    return await this.userService.removeUser(email)
  }
}
