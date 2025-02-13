import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739479357186 implements MigrationInterface {
    name = 'Migration1739479357186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "UQ_78a9f4a1b09b6d2bf7ed85f252f"`);
        await queryRunner.query(`CREATE TYPE "public"."follow_status_enum" AS ENUM('PENDING', 'ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "follow" ADD "status" "public"."follow_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TYPE "public"."authentication_users_usertype_enum" RENAME TO "authentication_users_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."authentication_users_usertype_enum" AS ENUM('REGULAR', 'ADMIN', 'SPECTATOR')`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "userType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "userType" TYPE "public"."authentication_users_usertype_enum" USING "userType"::"text"::"public"."authentication_users_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "userType" SET DEFAULT 'REGULAR'`);
        await queryRunner.query(`DROP TYPE "public"."authentication_users_usertype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "UQ_2952595a5bec0052c5da0751cca" UNIQUE ("followerId", "followingId")`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "UQ_f4c286f0f4913d4624dd8c1e2dc" UNIQUE ("userId", "postId", "commentId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "UQ_f4c286f0f4913d4624dd8c1e2dc"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "UQ_2952595a5bec0052c5da0751cca"`);
        await queryRunner.query(`CREATE TYPE "public"."authentication_users_usertype_enum_old" AS ENUM('REGULAR', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "userType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "userType" TYPE "public"."authentication_users_usertype_enum_old" USING "userType"::"text"::"public"."authentication_users_usertype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "authentication_users" ALTER COLUMN "userType" SET DEFAULT 'REGULAR'`);
        await queryRunner.query(`DROP TYPE "public"."authentication_users_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."authentication_users_usertype_enum_old" RENAME TO "authentication_users_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."follow_status_enum"`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "UQ_78a9f4a1b09b6d2bf7ed85f252f" UNIQUE ("userId", "postId")`);
    }

}
