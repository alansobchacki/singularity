import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739384422892 implements MigrationInterface {
    name = 'Migration1739384422892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."follow_request_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED')`);
        await queryRunner.query(`CREATE TABLE "follow_request" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."follow_request_status_enum" NOT NULL DEFAULT 'PENDING', "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "requesterId" uuid, "receiverId" uuid, CONSTRAINT "UQ_3d2f4e8c47f0b006e50d8d27139" UNIQUE ("requesterId", "receiverId"), CONSTRAINT "PK_a178da7ca27f9c7cbdd453a016d" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "USER_TYPE"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "ACCOUNT_STATUS"`);
        await queryRunner.query(`CREATE TYPE "public"."authentication_users_usertype_enum" AS ENUM('REGULAR', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "userType" "public"."authentication_users_usertype_enum" NOT NULL DEFAULT 'REGULAR'`);
        await queryRunner.query(`CREATE TYPE "public"."authentication_users_accountstatus_enum" AS ENUM('ACTIVE', 'SUSPENDED')`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "accountStatus" "public"."authentication_users_accountstatus_enum" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "follow_request" ADD CONSTRAINT "FK_9286f407096084071c8de077bb9" FOREIGN KEY ("requesterId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow_request" ADD CONSTRAINT "FK_300dff8c17adb8c19ea5f425123" FOREIGN KEY ("receiverId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow_request" DROP CONSTRAINT "FK_300dff8c17adb8c19ea5f425123"`);
        await queryRunner.query(`ALTER TABLE "follow_request" DROP CONSTRAINT "FK_9286f407096084071c8de077bb9"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "accountStatus"`);
        await queryRunner.query(`DROP TYPE "public"."authentication_users_accountstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" DROP COLUMN "userType"`);
        await queryRunner.query(`DROP TYPE "public"."authentication_users_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "ACCOUNT_STATUS" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ADD "USER_TYPE" character varying NOT NULL DEFAULT 'regular'`);
        await queryRunner.query(`DROP TABLE "follow_request"`);
        await queryRunner.query(`DROP TYPE "public"."follow_request_status_enum"`);
    }

}
