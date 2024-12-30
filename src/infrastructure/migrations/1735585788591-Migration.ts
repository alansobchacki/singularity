import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735585788591 implements MigrationInterface {
    name = 'Migration1735585788591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authentication_user" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "EMAIL" character varying NOT NULL, "PASSWORD" character varying NOT NULL, "NAME" character varying NOT NULL, "USER_TYPE" character varying NOT NULL, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2e57e0bd20c9c5809d0d2c091ad" UNIQUE ("EMAIL"), CONSTRAINT "PK_9271a5ae1845a37c54d449d717c" PRIMARY KEY ("ID"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "authentication_user"`);
    }

}
