import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest'); // Uso do require para compatibilidade total
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { TicketsModule } from '../src/tickets/tickets.module';
import { User } from '../src/users/entities/user.entity';
import { Ticket } from '../src/tickets/entities/ticket.entity';

describe('Fluxo Avançado (Listar e Atualizar)', () => {
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

  it('deve registrar, autenticar, criar, listar e atualizar um ticket', async () => {
    const server = app.getHttpServer();
    const email = `flow_test_${Date.now()}@example.com`;

    // Registro e Login
    await request(server)
      .post('/auth/register')
      .send({ name: 'Teste', email, password: 'password' })
      .expect(201);

    const loginRes = await request(server)
      .post('/auth/login')
      .send({ email, password: 'password' })
      .expect(201);

    const token = loginRes.body.access_token;

    // Criar
    const createRes = await request(server)
      .post('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Meu Chamado', description: 'Detalhes' })
      .expect(201);

    const ticketId = createRes.body.id;

    // Listar
    const listRes = await request(server)
      .get('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);

    // Atualizar
    await request(server)
      .patch(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Título Atualizado', status: 'IN_PROGRESS' })
      .expect(200);
  });
});