
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { JwtService } from '@nestjs/jwt';
import { authEnvs } from './config';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private oAuth2Client = new google.auth.OAuth2(
    authEnvs.oauth.clientId,
    authEnvs.oauth.clientSecret,
    `${authEnvs.oauth.urlCallback}/auth/google/callback`,
  );

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      prompt: 'consent',
    });
  }

  async handleGoogleCallback(code: string) {
    try {
      // 1. Get tokens from code
      const { tokens } = await this.oAuth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new Error('No access token received');
      }

      // 2. Set credentials immediately after receiving them
      this.oAuth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      });

      // 3. Create a new OAuth2 instance specifically for this request
      const oauth2Client = new google.auth.OAuth2(
        authEnvs.oauth.clientId,
        authEnvs.oauth.clientSecret,
        `${authEnvs.oauth.urlCallback}/auth/google/callback`,
      );
      oauth2Client.setCredentials(tokens);

      // 4. Get user information using the new OAuth2 instance
      const userInfoResponse = await google.oauth2('v2').userinfo.get({
        auth: oauth2Client,
      });

      const userData = userInfoResponse.data;
      console.log('userData:', userData);

      if (!userData.email) {
        throw new Error('No email received from Google');
      }

      console.log(JSON.stringify(userData, null, 2));

      // 5. Find or create user
      let user = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!user) {
        user = this.userRepository.create({
          email: userData.email,
          name: userData.name,
          googleTokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type,
            expiry_date: tokens.expiry_date,
          },
          picture: userData.picture,
        });
      } else {
        user.googleTokens = {
          access_token: tokens.access_token,
          refresh_token:
            tokens.refresh_token || user.googleTokens?.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type,
          expiry_date: tokens.expiry_date,
        };
      }

      await this.userRepository.save(user);

      // 6. Generate JWT
      const payload = { userId: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
      };
    } catch (error) {
      console.error('Error en handleGoogleCallback:', error);
      throw new Error(`Error al autenticar con Google: ${error.message}`);
    }
  }
}
