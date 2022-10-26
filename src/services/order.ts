import { Model } from '../models';
import {
  Product,
  OrderModel,
  OrderRequest,
  OrderStatus,
  AdditivesModel
} from '../types';

export class OrderService {
  constructor(
    private readonly orderModel: Model<OrderModel>,
    private readonly productModel: Model<Product>,
    private readonly additiveModel: Model<AdditivesModel>
  ) {}

  public buildOrder(orderRequest: Omit<OrderRequest, 'timestamp'>): OrderModel {
    return {
      phone: orderRequest.phone,
      totalPrice: 0,
      orderStatus: OrderStatus.NOT_CONFIRMED,
      items: [],
      timestamp: Date.now(),
      receivingTime: orderRequest.receivingTime
    };
  }

  private async composeOrderItems(
    order: OrderModel,
    orderRequest: Omit<OrderRequest, 'timestamp'>
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
          throw new Error(`Additive with id: ${additiveId} not found`);
        }
      }

      if (product) {
        order.items.push({
          id: orderItem.productId,
          name: product.name,
          price: product.price,
          count: orderItem.count,
          additives: additives
        });
      } else {
        throw new Error(`Product with id: ${orderItem.productId} not found`);
      }
    }
  }

  private countOrderPrice(order: OrderModel) {
    order.totalPrice = order.items.reduce(
      (sum, { price, count, additives }) => {
        const additivesTotalPrice = additives.reduce(
          (sum, { count, price }) => {
            return sum + price * count;
          },
          0
        );
        return sum + price * count + additivesTotalPrice;
      },
      order.totalPrice
    );
  }

  public async addOrder(
    orderRequest: Omit<OrderRequest, 'timestamp'>
  ): Promise<string> {
    const order = this.buildOrder(orderRequest);
    await this.composeOrderItems(order, orderRequest);
    this.countOrderPrice(order);

    const { id } = await this.orderModel.insertOne(order);

    return id;
  }

  public async getOrder() {
    return this.orderModel.findMany();
  }

  public async changeOrderStatus(orderId: string, orderStatus: OrderStatus) {
    await this.orderModel.updateOne(orderId, { orderStatus });

    return orderId;
  }
}
