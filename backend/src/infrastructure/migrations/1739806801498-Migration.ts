import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739806801498 implements MigrationInterface {
    name = 'Migration1739806801498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" ADD "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."follow_status_enum" RENAME TO "follow_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."follow_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "status" TYPE "public"."follow_status_enum" USING "status"::"text"::"public"."follow_status_enum"`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."follow_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."follow_status_enum_old" AS ENUM('PENDING', 'ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "status" TYPE "public"."follow_status_enum_old" USING "status"::"text"::"public"."follow_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."follow_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."follow_status_enum_old" RENAME TO "follow_status_enum"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "UPDATED_AT"`);
    }

}
