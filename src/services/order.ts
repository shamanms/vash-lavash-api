import { Model } from '../models';
import {
  Product,
  OrderModel,
  OrderRequest,
  OrderStatus,
  AdditiveModel
} from '../types';
import { ValidationError } from '../models/errors';

export class OrderService {
  constructor(
    private readonly orderModel: Model<OrderModel>,
    private readonly productModel: Model<Product>,
    private readonly additiveModel: Model<AdditiveModel>
  ) {}

  public buildOrder(orderRequest: OrderRequest): OrderModel {
    return {
      phone: orderRequest.phone,
      totalPrice: 0,
      orderStatus: OrderStatus.NOT_CONFIRMED,
      items: [],
      timestamp: Date.now(),
      receivingTime: orderRequest.receivingTime,
      delivery: orderRequest.delivery
    };
  }

  private async composeOrderItems(
    order: OrderModel,
    orderRequest: OrderRequest
  ) {
    for (const orderItem of orderRequest.items) {
      const product = await this.productModel.findOneById(orderItem.productId);

      const additives = [];

      for (const additiveId in orderItem.additives) {
        const additive = await this.additiveModel.findOneById(additiveId);
        if (additive) {
          additives.push({
            id: additiveId,
            name: additive.name,
            price: additive.price,
            count: orderItem.additives[additiveId]
          });
        } else {
          throw new ValidationError(
            `Additive with id: ${additiveId} not found`
          );
        }
      }

      if (product) {
        order.items.push({
          id: orderItem.productId,
          name: product.name,
          price: product.price,
          additives: additives
        });
      } else {
        throw new ValidationError(
          `Product with id: ${orderItem.productId} not found`
        );
      }
    }
  }

  private countOrderPrice(order: OrderModel) {
    order.totalPrice = order.items.reduce((sum, { price, additives }) => {
      const additivesTotalPrice = additives.reduce((sum, { count, price }) => {
        return sum + price * count;
      }, 0);
      return sum + price + additivesTotalPrice;
    }, order.totalPrice);
  }

  public async addOrder(orderRequest: OrderRequest): Promise<string> {
    const order = this.buildOrder(orderRequest);
    await this.composeOrderItems(order, orderRequest);
    this.countOrderPrice(order);

    const { id } = await this.orderModel.insertOne(order);

    return id;
  }

  public async getOrder() {
    return this.orderModel.findMany();
  }

  public async changeOrderStatus(
    orderId: string,
    orderStatus: OrderStatus,
    userId?: string
  ) {
    await this.orderModel.updateOne(orderId, { orderStatus }, userId);

    return orderId;
  }
}
