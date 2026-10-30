import { MigrationInterface, QueryRunner } from "typeorm";
import { adminBio, adminPinnedPost } from "../../utils/admin-profile";

export class Migration1793300000000 implements MigrationInterface {
    name = 'Migration1793300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "PINNED" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "post" ADD "DELETED" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "post" ADD "EDITED_BY" character varying`);

        await queryRunner.query(
            `UPDATE "authentication_users" SET "BIO" = $1, "PROFILE_PICTURE" = REPLACE("PROFILE_PICTURE", 'adminavatar.jpg', 'adminavatar.png') WHERE "userType" = 'ADMIN'`,
            [adminBio],
        );
        await queryRunner.query(
            `INSERT INTO "post" ("CONTENT", "PINNED", "authorId")
             SELECT $1, true, "ID" FROM "authentication_users" admin
             WHERE admin."userType" = 'ADMIN'
               AND NOT EXISTS (SELECT 1 FROM "post" WHERE "authorId" = admin."ID" AND "PINNED")`,
            [adminPinnedPost],
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "EDITED_BY"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "DELETED"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "PINNED"`);
    }

}
