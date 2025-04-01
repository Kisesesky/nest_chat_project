import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUser } from '../auth/dto/create-auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>) {}

  async userCreate(registerUser: RegisterUser) {
    const user = this.userRepository.create(registerUser)
    await this.userRepository.save(user)

    const { password, ...rest} = user
    return rest
  }

  async findUserEmail(email: string) {
    const user = await this.userRepository.findOne({ where: {email} })
    if(!user) {
      throw new UnauthorizedException('이메일 또는 패스워드를 잘 못 입력하였습니다.')
    }
    return user
  }

  async findAllUsers() {
    return await this.userRepository.find()
  }

  async findUserByemail(email: string) {
    const user = await this.userRepository.findOne({ where: {email} })
    if(!user) {
      throw new UnauthorizedException('Not Founded User')
    }
    return user
  }

  async updateUser(email: string, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: {email} })
    if(!user) {
      throw new UnauthorizedException('Not Founded User')
    }
    Object.assign(user, updateData)
    await this.userRepository.save(user)
    return user
  }

  async removeUser(email: string) {
    const user = await this.userRepository.findOne({ where: {email} })
    if(!user) {
      throw new UnauthorizedException('Not Founded User')
    }
    await this.userRepository.remove(user)
    return {
      message: 'Delete User'
    }
  }

  findUserById(id: string) {
    return this.userRepository.findOne({ where: {id} })
  }
}
