import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739565942024 implements MigrationInterface {
    name = 'Migration1739565942024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_3acf7c55c319c4000e8056c1279"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "IMAGE" character varying`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "EDITED" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."comment_status_enum" AS ENUM('REGULAR', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "status" "public"."comment_status_enum" NOT NULL DEFAULT 'REGULAR'`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "CHK_e52be040a82bb8e99a0ef422e9" CHECK (("postId" IS NOT NULL AND "commentId" IS NULL) OR ("postId" IS NULL AND "commentId" IS NOT NULL))`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES "post"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a" FOREIGN KEY ("commentId") REFERENCES "comment"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_3acf7c55c319c4000e8056c1279"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "CHK_e52be040a82bb8e99a0ef422e9"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."comment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "EDITED"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "IMAGE"`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a" FOREIGN KEY ("commentId") REFERENCES "comment"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES "post"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
