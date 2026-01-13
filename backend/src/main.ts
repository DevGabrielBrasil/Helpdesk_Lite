import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita a validação automática (IsEmail, MinLength, etc)
  app.useGlobalPipes(new ValidationPipe());

  // Habilita o CORS para o frontend conseguir acessar a API
  app.enableCors();

  await app.listen(3000);

  // Seed opcional: cria um usuário admin se variável estiver ativada
  if (process.env.SEED_ADMIN === 'true') {
    try {
      const usersService = app.get(UsersService);
      const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
      const password = process.env.SEED_ADMIN_PASSWORD || 'password';
      await usersService.create({ name: 'Admin', email, password });
      // eslint-disable-next-line no-console
      console.log('Usuário admin seed criado:', email);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.log('Seed admin pulado (já existe?):', err?.message || err);
    }
  }
}

bootstrap();