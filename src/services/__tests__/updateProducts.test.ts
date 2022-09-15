import db from '../../models';
import { updateProducts } from '..';

jest.mock('../../models', () => ({
  products: {
    updateOne: jest.fn()
  }
}));

describe( 'updateProducts function', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when called with products = [] call updateProducts with products', async () => {
    const products = [
      {
        id: 'd3dsff4',
        name: 'bulka',
        price: 15,
        description: '',
        img: '',
        type: 'hleb'
      }
    ];
    const product = db.products.updateOne;
    const updatedProducts = products[0]

    await updateProducts(products)
  
    expect(product).toHaveBeenCalledWith(products[0].id, products[0]);
    expect(Promise.allSettled).toHaveBeenCalledWith(updatedProducts)
  })
})