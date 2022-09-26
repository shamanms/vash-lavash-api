import db from '../models';
import { OrderService } from './order';
import { ProductsService } from './products';
import { VacancyService } from './vacancies';
import { UsersService } from './users';

export default {
  order: new OrderService(db.orders, db.products),
  products: new ProductsService(db.products),
  vacancies: new VacancyService(db.vacancies),
  users: new UsersService(db.users)
};
