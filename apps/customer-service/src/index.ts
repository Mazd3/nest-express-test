import express from 'express';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const app = express();

app.use(morgan('dev'));

app.get('/customers', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const customers = await prisma.customer.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  res.send(customers);
});

app.get('/fake', (req, res) => {
  const count = Number(req.query.count) || 100;

  if (count > 1000) {
    res.status(400).send('Count cannot be greater than 1000');
    return;
  }

  const customers = [];

  for (let i = 0; i < count; i++) {
    const customer = {
      id: i + 1,
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

  prisma.customer
    .createMany({
      data: customers,
    })
    .then(() => {
      res.send('Customers created successfully');
    })
    .catch((error) => {
      console.error('Error creating customers:', error);
      res.status(500).send('Error creating customers');
    });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
