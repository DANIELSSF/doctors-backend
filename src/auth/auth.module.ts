import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { authEnvs } from './config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: authEnvs.jwtSecret,
      signOptions: { expiresIn: authEnvs.jwtExpiresIn },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, TypeOrmModule, JwtModule],
})
export class AuthModule {}
