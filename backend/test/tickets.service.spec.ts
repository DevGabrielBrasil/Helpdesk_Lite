import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from '../src/tickets/tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from '../src/tickets/entities/ticket.entity';

describe('TicketsService (Serviço de Tickets)', () => {
  let service: TicketsService;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Ticket), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('deve criar um ticket e associar o proprietário', async () => {
    const dto = { title: 'Teste', description: 'Desc' } as any;
    const userId = 'user-uuid';

    const created = { id: '1', ...dto, owner: { id: userId } };
    mockRepository.create.mockReturnValue(created);
    mockRepository.save.mockResolvedValue({ ...created, ownerId: userId });

    const result = await service.create(dto, userId);

    expect(mockRepository.create).toHaveBeenCalledWith({
      title: dto.title,
      description: dto.description,
      owner: { id: userId },
    });
    expect(mockRepository.save).toHaveBeenCalledWith(created);
    expect(result).toHaveProperty('ownerId', userId);
  });
});
