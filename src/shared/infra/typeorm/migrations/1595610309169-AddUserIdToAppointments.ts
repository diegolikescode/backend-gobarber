import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export default class AddUserIdToAppointments1595610309169 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('appointments', new TableColumn({
      name: 'user_id',
      type: 'uuid',
      isNullable: true
    }))

    await queryRunner.createForeignKey('appointments', new TableForeignKey({
      name: 'appointmentUser',
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('appointents', 'appointmentProvider')

    await queryRunner.dropColumn('appointments', 'user_id')
  }
}
