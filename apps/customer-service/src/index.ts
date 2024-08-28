import express from 'express';
import morgan from 'morgan';
import { faker } from '@faker-js/faker';

const app = express();

app.use(morgan('dev'));

app.get('/customers', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;

  const customers = [];

  for (let i = 0; i < limit; i++) {
    const customer = {
      id: (page - 1) * limit + i + 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      isVerified: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
    };
    customers.push(customer);
  }
  res.send(customers);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
