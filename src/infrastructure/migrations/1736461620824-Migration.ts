import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736461620824 implements MigrationInterface {
    name = 'Migration1736461620824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "UQ_78a9f4a1b09b6d2bf7ed85f252f" UNIQUE ("userId", "postId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "UQ_78a9f4a1b09b6d2bf7ed85f252f"`);
    }

}
