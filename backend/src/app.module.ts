import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Ticket } from './tickets/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'helpdesk',
      entities: [User, Ticket],
      synchronize: process.env.TYPEORM_SYNC === 'true' || true,
      logging: process.env.TYPEORM_LOGGING === 'true' || true,
    }),
    UsersModule,
    TicketsModule,
    AuthModule,
  ],
})
export class AppModule {}