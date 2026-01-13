import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: string) {
    // Criamos o ticket garantindo que o ownerId seja um UUID válido
    const ticket = this.ticketRepository.create({
      title: createTicketDto.title,
      description: createTicketDto.description,
      owner: { id: userId } as any, // Vincula ao usuário logado
    });

    try {
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      console.error("Erro ao salvar no Banco:", error);
      throw error;
    }
  }

  async findAll(userId: string, status?: string, q?: string) {
    const qb = this.ticketRepository.createQueryBuilder('ticket')
      .where('ticket.ownerId = :userId', { userId });

    if (status) {
      qb.andWhere('ticket.status = :status', { status });
    }

    if (q) {
      qb.andWhere('(ticket.title ILIKE :q OR ticket.description ILIKE :q)', { q: `%${q}%` });
    }

    qb.orderBy('ticket.createdAt', 'DESC');

    return qb.getMany();
  }

  async findOne(id: string, userId: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id, owner: { id: userId } },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket não encontrado');
    }
    return ticket;
  }

  async remove(id: string, userId: string) {
    const ticket = await this.findOne(id, userId);
    return this.ticketRepository.remove(ticket);
  }

  async update(id: string, updateDto: any, userId: string) {
    const ticket = await this.findOne(id, userId);

    if (updateDto.title !== undefined) ticket.title = updateDto.title;
    if (updateDto.description !== undefined) ticket.description = updateDto.description;
    if (updateDto.status !== undefined) ticket.status = updateDto.status;

    try {
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error);
      throw error;
    }
  }
}