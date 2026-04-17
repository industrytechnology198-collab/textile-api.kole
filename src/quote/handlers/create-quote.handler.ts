import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { EmailService } from 'src/auth/services/email.service';

@Injectable()
export class CreateQuoteHandler {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(userId: string, userEmail: string, dto: CreateQuoteDto) {
    // 1 — Validate address belongs to requester
    const address = await this.quoteRepository.findAddressByIdAndUserId(
      dto.addressId,
      userId,
    );

    if (!address) {
      throw new ForbiddenException('Address not found or does not belong to you');
    }

    if (!address.phoneNumber) {
      throw new BadRequestException('A phone number is required on your address');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    // 2 — Validate each SKU & compute total (price ×2)
    const resolvedItems: Array<{
      skuId: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const item of dto.items) {
      const sku = await this.quoteRepository.findSkuById(item.skuId);

      if (!sku) {
        throw new NotFoundException(`SKU ${item.skuId} not found`);
      }

      if (sku.saleState !== 'active' || sku.isDiscontinued) {
        throw new BadRequestException(`SKU ${item.skuId} is not available`);
      }

      const unitPrice = Number(sku.price) * 2; // ×2 pricing rule
      resolvedItems.push({ skuId: item.skuId, quantity: item.quantity, unitPrice });
    }

    const totalPrice = resolvedItems.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0,
    );

    // 3 — Persist
    const quote = await this.quoteRepository.createQuote({
      userId,
      addressId: dto.addressId,
      totalPrice,
      note: dto.note,
      items: resolvedItems,
    });

    // 4 — Send confirmation emails (fire-and-forget, don't block response)
    this.quoteRepository
      .findUserLanguage(userId)
      .then((lang) =>
        this.emailService.sendQuoteConfirmationToUser(userEmail, quote, lang),
      )
      .catch(() => null);
    this.emailService.sendQuoteNotificationToAdmin(quote).catch(() => null);

    return quote;
  }
}
