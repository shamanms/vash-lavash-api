import db from '../models';
import { OrderService } from './order';
import { ProductsService } from './products';
import { VacancyService } from './vacancies';
import { UsersService } from './users';
import { AdditivesService } from './additives';
import { SalesService } from './sales';

export default {
  order: new OrderService(db.orders, db.products, db.additives),
  products: new ProductsService(db.products),
  vacancies: new VacancyService(db.vacancies),
  users: new UsersService(db.users),
  sales: new SalesService(db.sales),
  additives: new AdditivesService(db.additives)
};
