import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { google } from 'googleapis';
import { authEnvs } from '../config';

@Injectable()
export class GoogleCredentialAuth implements CanActivate {
  private readonly logger = new Logger(GoogleCredentialAuth.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private oAuth2Client = new google.auth.OAuth2(
    authEnvs.oauth.clientId,
    authEnvs.oauth.clientSecret,
    `${authEnvs.oauth.urlCallback}/auth/google/callback`,
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const payload: User = request.user;

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user?.googleTokens) {
      response.clearCookie('authGoogle');
      throw new UnauthorizedException('Invalid token');
    }

    const isExpired = Date.now() >= user.googleTokens.expiry_date;

    if (isExpired) {
      this.logger.debug('Token expired. Attempting to refresh...');

      try {
        const newAccessToken = await this.refreshAccessToken(user);

        this.oAuth2Client.setCredentials({
          access_token: newAccessToken,
        });

        user.googleTokens.access_token = newAccessToken;
        await this.userRepository.save(user);

        this.logger.debug('Token refreshed successfully');
      } catch (error) {
        this.logger.error('Failed to refresh token:', error);
        response.clearCookie('authGoogle');
        throw new UnauthorizedException('Failed to refresh token');
      }
    } else {
      this.oAuth2Client.setCredentials({
        access_token: user.googleTokens.access_token,
      });
    }

    return true;
  }

  private async refreshAccessToken(user: User): Promise<string> {
    this.oAuth2Client.setCredentials({
      refresh_token: user.googleTokens.refresh_token,
    });

    const { credentials } = await this.oAuth2Client.refreshAccessToken();
    user.googleTokens.access_token = credentials.access_token;
    user.googleTokens.expiry_date = credentials.expiry_date;

    await this.userRepository.save(user);

    return credentials.access_token;
  }
}
