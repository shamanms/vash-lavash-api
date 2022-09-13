import { Model } from '../models';
import { Product, OrderModel, OrderRequest } from '../types';

export class OrderService {
  constructor(
    private readonly orderModel: Model<OrderModel>,
    private readonly productModel: Model<Product>,
    private readonly orderRequest: Omit<OrderRequest, 'timestamp'>
  ) {}

  public buildOrder() {
    return {
      phone: this.orderRequest.phone,
      totalPrice: 0,
      isConfirmed: false,
      isCompleted: false,
      items: [],
      timestamp: Date.now()
    };
  }

  private async composeOrderItems(order: OrderModel) {
    for (const productId in this.orderRequest.items) {
      const product = await this.productModel.findOne(productId);

      if (product) {
        order.items.push({
          id: productId,
          name: product.name,
          price: product.price,
          count: this.orderRequest.items[productId]
        });
      } else {
        throw new Error(`Product with id: ${productId} not found`);
      }
    }
  }

  private countOrderPrice(order: OrderModel) {
    order.totalPrice = order.items.reduce(
      (sum, { price, count }) => sum + price * count,
      order.totalPrice
    );
  }

  public async addOrder(): Promise<string> {
    const order = this.buildOrder();
    await this.composeOrderItems(order);
    this.countOrderPrice(order);

    const { id } = await this.orderModel.insertOne(order);

    return id;
  }
}
