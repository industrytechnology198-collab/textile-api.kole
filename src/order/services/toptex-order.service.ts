import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ToptexApiService } from 'src/toptex/services/toptex-api.service';
import {
  CreateToptexOrderDto,
  CreateToptexOrderResponse,
  GetToptexOrderResponse,
  GetToptexOrdersResponse,
} from '../dto/toptex-order.dto';

const TOPTEX_ORDERS_URL = 'https://api.toptex.io/v3/orders';

@Injectable()
export class ToptexOrderService {
  private readonly logger = new Logger(ToptexOrderService.name);

  constructor(private readonly toptexApi: ToptexApiService) {}

  async createOrder(
    payload: CreateToptexOrderDto,
  ): Promise<CreateToptexOrderResponse> {
    try {
      return await this.toptexApi.post<CreateToptexOrderResponse>(
        TOPTEX_ORDERS_URL,
        payload,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown Toptex error';
      const responseData = (error as any)?.response?.data;
      this.logger.error(
        `Failed to create order in Toptex: ${message}`,
        responseData ? JSON.stringify(responseData) : undefined,
      );
      throw new HttpException(
        `Failed to forward order to Toptex: ${message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getOrder(toptexOrderId: string): Promise<GetToptexOrderResponse> {
    try {
      return await this.toptexApi.get<GetToptexOrderResponse>(
        `${TOPTEX_ORDERS_URL}/${toptexOrderId}`,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown Toptex error';
      this.logger.error(`Failed to fetch order from Toptex: ${message}`);
      throw new HttpException(
        `Failed to fetch order from Toptex: ${message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getAllOrders(): Promise<GetToptexOrdersResponse> {
    try {
      return await this.toptexApi.get<GetToptexOrdersResponse>(
        TOPTEX_ORDERS_URL,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown Toptex error';
      this.logger.error(`Failed to fetch orders from Toptex: ${message}`);
      throw new HttpException(
        `Failed to fetch orders from Toptex: ${message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async uploadPackingList(
    _toptexOrderId: string,
    _pdfBuffer: Buffer,
  ): Promise<void> {
    // TODO: uploadPackingList - PUT /v3/orders/{id}/pdfpacking
    return Promise.resolve();
  }
}
