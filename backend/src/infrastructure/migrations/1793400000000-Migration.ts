import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1793400000000 implements MigrationInterface {
    name = 'Migration1793400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "COMMENTS_DISABLED" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(
            `UPDATE "post" SET "COMMENTS_DISABLED" = true
             WHERE "PINNED" AND "authorId" IN (SELECT "ID" FROM "authentication_users" WHERE "userType" = 'ADMIN')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "COMMENTS_DISABLED"`);
    }

}
