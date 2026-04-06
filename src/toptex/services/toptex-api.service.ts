import {
  Injectable,
  OnModuleInit,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
export class ToptexApiService implements OnModuleInit {
  private readonly logger = new Logger(ToptexApiService.name);
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    // Add request interceptor to append the token to all outgoing requests via this HttpService
    this.httpService.axiosRef.interceptors.request.use(
      async (config) => {
        // Do not intercept the authentication request itself!
        if (config.url?.includes('api.toptex.io/v3/authenticate')) {
          return config;
        }

        // Only append tokens for api.toptex.io requests
        if (config.url?.includes('api.toptex.io')) {
          const accessToken = await this.getToken();
          if (accessToken) {
            config.headers['x-toptex-authorization'] = accessToken;

            // Also add the x-api-key if needed by other API endpoints
            const apiKey =
              this.configService.get<string>('TOPTEX_API_KEY') ||
              'zg8a17hWXg6OzYfVIksyA503IoXC5fidahh3h0yk';
            if (!config.headers['x-api-key']) {
              config.headers['x-api-key'] = apiKey;
            }
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  private async getToken(): Promise<string> {
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token;
    }

    return await this.authenticate();
  }

  private async authenticate(): Promise<string> {
    this.logger.log('Authenticating with Toptex API...');

    // Read from ConfigService with fallback to provided credentials
    const username =
      this.configService.get<string>('TOPTEX_USERNAME') || 'tobe_benit';
    const password =
      this.configService.get<string>('TOPTEX_PASSWORD') || 'Noura1990_1';
    const apiKey =
      this.configService.get<string>('TOPTEX_API_KEY') ||
      'zg8a17hWXg6OzYfVIksyA503IoXC5fidahh3h0yk';

    if (!username || !password || !apiKey) {
      this.logger.error('Missing Toptex credentials');
      throw new UnauthorizedException('Missing Toptex credentials');
    }

    try {
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

      const data = response.data;
      this.token = data.token;

      // Calculate expiry slightly earlier (1 minute) to avoid edge cases
      const expiryDate = new Date(data.expiry_time);
      this.tokenExpiry = new Date(expiryDate.getTime() - 60000);

      this.logger.log('Successfully authenticated with Toptex API');
      return this.token;
    } catch (error) {
      this.logger.error(
        'Failed to authenticate with Toptex API',
        error instanceof Error ? error.message : error,
      );
      throw new UnauthorizedException('Failed to authenticate with Toptex API');
    }
  }

  // Example generic call function
  // Other services can inject ToptexApiService and use this method or directly use HttpService
  async get<T>(url: string, config?: any): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url, config));
    return response.data;
  }
}
