import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735831526190 implements MigrationInterface {
    name = 'Migration1735831526190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CONTENT" character varying NOT NULL, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_af18320e9afe6b6ed3326145da3" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "PROFILE_PICTURE" character varying`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "BIO" character varying`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "LOCATION" character varying`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "ACCOUNT_STATUS" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "USER_TYPE" SET DEFAULT 'regular'`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "USER_TYPE" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "ACCOUNT_STATUS"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "LOCATION"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "BIO"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "PROFILE_PICTURE"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
