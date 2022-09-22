import { Model } from '../models';
import { Product, OrderModel, OrderRequest } from '../types';

export class OrderService {
  constructor(
    private readonly orderModel: Model<OrderModel>,
    private readonly productModel: Model<Product>
  ) {}

  public buildOrder(orderRequest: Omit<OrderRequest, 'timestamp'>) {
    return {
      phone: orderRequest.phone,
      totalPrice: 0,
      isConfirmed: false,
      isCompleted: false,
      items: [],
      timestamp: Date.now()
    };
  }

  private async composeOrderItems(
    order: OrderModel,
    orderRequest: Omit<OrderRequest, 'timestamp'>
  ) {
    for (const productId in orderRequest.items) {
      const product = await this.productModel.findOne(productId);

      if (product) {
        order.items.push({
          id: productId,
          name: product.name,
          price: product.price,
          count: orderRequest.items[productId]
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
}
