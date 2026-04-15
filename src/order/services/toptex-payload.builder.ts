import { Address } from '@prisma/client';
import { CartWithSku, OrderWithItems, UserToptexInfo } from '../repositories/order.repository';
import {
  CreateToptexOrderDto,
  ToptexDeliveryAddressDto,
  ToptexOrderLineDto,
} from '../dto/toptex-order.dto';

const COUNTRY_TO_ISO: Record<string, string> = {
  morocco: 'MA',
  maroc: 'MA',
  france: 'FR',
  belgium: 'BE',
  belgique: 'BE',
  germany: 'DE',
  allemagne: 'DE',
  spain: 'ES',
  espagne: 'ES',
  italy: 'IT',
  italie: 'IT',
  netherlands: 'NL',
  'pays-bas': 'NL',
  portugal: 'PT',
  'united kingdom': 'GB',
  'royaume-uni': 'GB',
  'united states': 'US',
  'états-unis': 'US',
  tunisia: 'TN',
  tunisie: 'TN',
  algeria: 'DZ',
  algérie: 'DZ',
  canada: 'CA',
  switzerland: 'CH',
  suisse: 'CH',
};

function toIsoCountry(country: string): string {
  const trimmed = country.trim();
  // Already a 2-letter ISO code
  if (/^[A-Z]{2}$/.test(trimmed)) return trimmed;
  return COUNTRY_TO_ISO[trimmed.toLowerCase()] ?? trimmed.toUpperCase().slice(0, 2);
}

function buildDeliveryDate(): string {
  const expectedDeliveryDate = new Date();
  expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);
  return expectedDeliveryDate.toISOString().split('T')[0];
}

function buildDeliveryAddress(
  address: Address,
  user: UserToptexInfo,
): ToptexDeliveryAddressDto {
  return {
    addressTitle: 'Home',
    street1: address.addressLine1,
    street2: address.addressLine2 ?? '',
    postCode: address.postalCode,
    city: address.city,
    country: toIsoCountry(address.country),
    contactName: address.fullName,
    contactPhone: address.phoneNumber,
    contactEmail: user.email,
  };
}

function buildOrderLinesFromCart(cart: CartWithSku): ToptexOrderLineDto[] {
  return cart.cartItems.map((item, index) => ({
    sku: item.sku.sku,
    quantity: item.quantity,
    lineNumber: (index + 1).toString(),
    comment: '',
  }));
}

function buildOrderLinesFromOrder(order: OrderWithItems): ToptexOrderLineDto[] {
  return order.orderItems.map((item, index) => ({
    sku: item.sku.sku,
    quantity: item.quantity,
    lineNumber: (index + 1).toString(),
    comment: '',
  }));
}

export function buildToptexPayloadFromCart(
  myOrderId: string,
  cart: CartWithSku,
  address: Address,
  user: UserToptexInfo,
  testMode: boolean,
): CreateToptexOrderDto {
  return {
    orderID: myOrderId,
    orderReference: myOrderId,
    orderStatus: 'New',
    expectedDeliveryDate: buildDeliveryDate(),
    myOrderID: myOrderId,
    orderManagement: 1,
    waitForFreeShipping: 0,
    expressShipping: '',
    neutralDeliveryNote: 0,
    testMode,
    comment: '',
    deliveryAddress: buildDeliveryAddress(address, user),
    orderLines: buildOrderLinesFromCart(cart),
  };
}

export function buildToptexPayloadFromOrder(
  order: OrderWithItems,
  address: Address,
  user: UserToptexInfo,
  testMode: boolean,
): CreateToptexOrderDto {
  const orderReference = order.myOrderId ?? order.id;

  return {
    orderID: orderReference,
    orderReference,
    orderStatus: 'New',
    expectedDeliveryDate: buildDeliveryDate(),
    myOrderID: orderReference,
    orderManagement: 1,
    waitForFreeShipping: 0,
    expressShipping: '',
    neutralDeliveryNote: 0,
    testMode,
    comment: '',
    deliveryAddress: buildDeliveryAddress(address, user),
    orderLines: buildOrderLinesFromOrder(order),
  };
}
