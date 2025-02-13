import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736198947427 implements MigrationInterface {
    name = 'Migration1736198947427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follow" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "followerId" uuid, "followingId" uuid, CONSTRAINT "PK_63758bfebf906807e0bcdc3c73a" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CONTENT" character varying NOT NULL, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "postId" uuid, CONSTRAINT "PK_16203e4e49f9c99ac05e7f84767" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "like" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "postId" uuid, "commentId" uuid, CONSTRAINT "PK_dd4fb9a2501fd579e295e018757" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_e9f68503556c5d72a161ce38513" FOREIGN KEY ("followingId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "authentication_users"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES "post"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a" FOREIGN KEY ("commentId") REFERENCES "comment"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_d86e0a3eeecc21faa0da415a18a"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_3acf7c55c319c4000e8056c1279"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_e9f68503556c5d72a161ce38513"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "follow"`);
    }

}
