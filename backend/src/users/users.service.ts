import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'name', 'email', 'password'] 
    });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }
}