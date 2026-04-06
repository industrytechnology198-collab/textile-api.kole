import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

interface AuthResponse {
  username: string;
  token: string;
  expiry_time: string;
  expiry_time_timezone: string;
}

@Injectable()
export class ToptexStatusHandler {
  private readonly logger = new Logger(ToptexStatusHandler.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async execute(): Promise<{ status: string; message: string; data?: any }> {
    try {
      this.logger.log('Checking Toptex API status...');

      const username =
        this.configService.get<string>('TOPTEX_USERNAME') || 'tobe_benit';
      const password =
        this.configService.get<string>('TOPTEX_PASSWORD') || 'Noura1990_1';
      const apiKey =
        this.configService.get<string>('TOPTEX_API_KEY') ||
        'zg8a17hWXg6OzYfVIksyA503IoXC5fidahh3h0yk';

      const response = await lastValueFrom(
        this.httpService.post<AuthResponse>(
          'https://api.toptex.io/v3/authenticate',
          { username, password },
          {
            headers: {
              accept: 'application/json',
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response && response.data && response.data.token) {
        return {
          status: 'success',
          message: 'Successfully connected and authenticated with Toptex API',
          data: response.data,
        };
      }

      return {
        status: 'error',
        message: 'Connected but received invalid response format',
      };
    } catch (error) {
      this.logger.error('Toptex status check failed', error);
      return {
        status: 'error',
        message: error.message || 'Failed to connect to Toptex API',
      };
    }
  }
}
