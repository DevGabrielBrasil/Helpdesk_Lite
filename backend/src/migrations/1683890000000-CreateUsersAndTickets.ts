import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUsersAndTickets1683890000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', isGenerated: true },
          { name: 'name', type: 'varchar' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'tickets',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', isGenerated: true },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'status', type: 'varchar', default: "'OPEN'" },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
          { name: 'ownerId', type: 'uuid' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['ownerId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tickets');
    const fk = table?.foreignKeys.find((f) => f.columnNames.indexOf('ownerId') !== -1);
    if (fk) {
      await queryRunner.dropForeignKey('tickets', fk);
    }
    await queryRunner.dropTable('tickets');
    await queryRunner.dropTable('users');
  }
}
