import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Ticket } from './tickets/entities/ticket.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'helpdesk',
  entities: [User, Ticket],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});

export default AppDataSource;
