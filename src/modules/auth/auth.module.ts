import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.stategy';
import { AppConfigModule } from '../../config/app/config.module';
import { UsersModule } from '../users/users.module';
import { AppConfigService } from '../../config/app/config.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[AppConfigModule,UsersModule,JwtModule.registerAsync({
    imports: [AppConfigModule],
    useFactory: (appconfigService: AppConfigService) => ({
      secret: appconfigService.jwtSecret,
      signOptions: { expiresIn: '1h' }
    }),
    inject: [AppConfigService]
  }),
  PassportModule.register({ defaultStrategy: 'jwt' })
],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}
