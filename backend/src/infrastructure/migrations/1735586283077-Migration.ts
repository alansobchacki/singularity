import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735586283077 implements MigrationInterface {
    name = 'Migration1735586283077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authentication_users" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "EMAIL" character varying NOT NULL, "PASSWORD" character varying NOT NULL, "NAME" character varying NOT NULL, "USER_TYPE" character varying NOT NULL, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c69ee9f298b52a3b0b14442977f" UNIQUE ("EMAIL"), CONSTRAINT "PK_fcc7cd02dfde0e47c4d09d44f2c" PRIMARY KEY ("ID"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "authentication_users"`);
    }

}
