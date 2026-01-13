import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest'); // Importação compatível com Jest
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { TicketsModule } from '../src/tickets/tickets.module';
import { User } from '../src/users/entities/user.entity';
import { Ticket } from '../src/tickets/entities/ticket.entity';

describe('Fluxo Completo Helpdesk (E2E)', () => {
  let app: INestApplication;

  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Ticket],
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
        TicketsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('Cenário: Registro -> Login -> Criar Ticket', async () => {
    const server = app.getHttpServer();
    const testEmail = `dev_test_${Date.now()}@example.com`;

    // 1. Registro
    await request(server)
      .post('/auth/register')
      .send({ name: 'Dev Test', email: testEmail, password: 'password123' })
      .expect(201);

    // 2. Login
    const loginRes = await request(server)
      .post('/auth/login')
      .send({ email: testEmail, password: 'password123' })
      .expect(201);

    const token = loginRes.body.access_token;
    expect(token).toBeDefined();

    // 3. Criar Ticket
    const ticketRes = await request(server)
      .post('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ticket de Teste', description: 'Descrição E2E' })
      .expect(201);

    expect(ticketRes.body.title).toBe('Ticket de Teste');
  });
});