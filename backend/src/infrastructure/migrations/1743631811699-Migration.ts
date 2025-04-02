import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743631811699 implements MigrationInterface {
    name = 'Migration1743631811699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."follow_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "follow" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."follow_status_enum" NOT NULL DEFAULT 'PENDING', "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "followerId" uuid, "followingId" uuid, CONSTRAINT "UQ_2952595a5bec0052c5da0751cca" UNIQUE ("followerId", "followingId"), CONSTRAINT "PK_63758bfebf906807e0bcdc3c73a" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "like" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "postId" uuid, "commentId" uuid, CONSTRAINT "UQ_f4c286f0f4913d4624dd8c1e2dc" UNIQUE ("userId", "postId", "commentId"), CONSTRAINT "CHK_e52be040a82bb8e99a0ef422e9" CHECK (("postId" IS NOT NULL AND "commentId" IS NULL) OR ("postId" IS NULL AND "commentId" IS NOT NULL)), CONSTRAINT "PK_dd4fb9a2501fd579e295e018757" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TYPE "public"."comment_status_enum" AS ENUM('REGULAR', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "comment" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CONTENT" character varying NOT NULL, "IMAGE" character varying, "EDITED" boolean NOT NULL DEFAULT false, "status" "public"."comment_status_enum" NOT NULL DEFAULT 'REGULAR', "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "postId" uuid, CONSTRAINT "PK_16203e4e49f9c99ac05e7f84767" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TYPE "public"."authentication_users_usertype_enum" AS ENUM('REGULAR', 'BOT', 'ADMIN', 'SPECTATOR')`);
        await queryRunner.query(`CREATE TYPE "public"."authentication_users_accountstatus_enum" AS ENUM('ACTIVE', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "authentication_users" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "EMAIL" character varying NOT NULL, "PASSWORD" character varying NOT NULL, "NAME" character varying NOT NULL, "PROFILE_PICTURE" character varying, "BIO" character varying, "LOCATION" character varying, "userType" "public"."authentication_users_usertype_enum" NOT NULL DEFAULT 'REGULAR', "accountStatus" "public"."authentication_users_accountstatus_enum" NOT NULL DEFAULT 'ACTIVE', "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c69ee9f298b52a3b0b14442977f" UNIQUE ("EMAIL"), CONSTRAINT "PK_fcc7cd02dfde0e47c4d09d44f2c" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "post" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CONTENT" character varying NOT NULL, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_af18320e9afe6b6ed3326145da3" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_e9f68503556c5d72a161ce38513" FOREIGN KEY ("followingId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES "post"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a" FOREIGN KEY ("commentId") REFERENCES "comment"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_3acf7c55c319c4000e8056c1279"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_e9f68503556c5d72a161ce38513"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "authentication_users"`);
        await queryRunner.query(`DROP TYPE "public"."authentication_users_accountstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."authentication_users_usertype_enum"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TYPE "public"."comment_status_enum"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`DROP TYPE "public"."follow_status_enum"`);
    }

}
