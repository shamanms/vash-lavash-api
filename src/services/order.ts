import { Model } from '../models';
import {
  Product,
  OrderModel,
  OrderRequest,
  OrderStatus,
  GlovoOrderRequest
} from '../types';

export class OrderService {
  constructor(
    private readonly orderModel: Model<OrderModel>,
    private readonly productModel: Model<Product>
  ) {}

  public buildOrder(orderRequest: Omit<OrderRequest, 'timestamp'>) {
    return {
      phone: orderRequest.phone,
      totalPrice: 0,
      orderStatus: OrderStatus.NOT_CONFIRMED,
      items: [],
      timestamp: Date.now()
    };
  }

  private async composeOrderItems(
    order: OrderModel,
    orderRequest: Omit<OrderRequest, 'timestamp'>
  ) {
    for (const productId in orderRequest.items) {
      const product = await this.productModel.findOneById(productId);

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

  public async changeOrderStatus(orderId: string, orderStatus: OrderStatus) {
    await this.orderModel.updateOne(orderId, { orderStatus });

    return orderId;
  }

  public async addGlovoOrder(glovoOrderRequest: GlovoOrderRequest) {
    const productGlovo = glovoOrderRequest.products.map((product) => ({
      name: product.name,
      price: product.price,
      count: product.quantity
    }));
    const order: OrderModel = {
      phone: glovoOrderRequest.customer.phone_number,
      orderStatus: OrderStatus.CONFIRMED,
      items: productGlovo,
      timestamp: Date.parse(glovoOrderRequest.order_time),
      glovoOrderId: glovoOrderRequest.order_id,
      pickUpCode: glovoOrderRequest.pick_up_code,
      totalPrice: 0
    };
    this.countOrderPrice(order);
    const { id } = await this.orderModel.insertOne(order);

    return id;
  }
}
