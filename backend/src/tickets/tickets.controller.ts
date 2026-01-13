import { Controller, Post, Body, Get, Delete, Param, UseGuards, Request, Patch, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    // O req.user.userId é preenchido pelo Passport JWT
    return this.ticketsService.create(createTicketDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: string, @Query('q') q?: string) {
    return this.ticketsService.findAll(req.user.userId, status, q);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ticketsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @Request() req,
  ) {
    return this.ticketsService.update(id, updateTicketDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ticketsService.remove(id, req.user.userId);
  }
}