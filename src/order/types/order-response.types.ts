import { OrderStatus } from '@prisma/client';
import { AdminOrderWithItems, OrderWithItems } from '../repositories/order.repository';

export interface OrderItemResponse {
  id: string;
  quantity: number;
  price: number;
  sku: {
    id: string;
    sku: string;
    sizeLabel: string | null;
    price: number;
    color: {
      id: string;
      colorCode: string;
      hexColor: string | null;
    };
    product: {
      id: string;
      catalogReference: string;
      brand: string;
    };
  };
}

export interface OrderResponse {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  isPaid: boolean;
  toptexOrderId: string | null;
  myOrderId: string | null;
  createdAt: Date;
  orderItems: OrderItemResponse[];
}

export interface AdminOrderResponse extends OrderResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export function mapOrder(order: OrderWithItems): OrderResponse {
  return {
    id: order.id,
    status: order.status,
    totalPrice: Number(order.totalPrice),
    isPaid: order.isPaid,
    toptexOrderId: order.toptexOrderId,
    myOrderId: order.myOrderId,
    createdAt: order.createdAt,
    orderItems: order.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      sku: {
        id: item.sku.id,
        sku: item.sku.sku,
        sizeLabel: item.sku.sizeLabel,
        price: Number(item.sku.price),
        color: {
          id: item.sku.color.id,
          colorCode: item.sku.color.colorCode,
          hexColor: item.sku.color.hexColor,
        },
        product: {
          id: item.sku.color.product.id,
          catalogReference: item.sku.color.product.catalogReference,
          brand: item.sku.color.product.brand,
        },
      },
    })),
  };
}

export function mapAdminOrder(order: AdminOrderWithItems): AdminOrderResponse {
  return {
    ...mapOrder(order),
    user: {
      id: order.user.id,
      email: order.user.email,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
    },
  };
}
