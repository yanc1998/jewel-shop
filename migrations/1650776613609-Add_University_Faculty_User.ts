import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniversityFacultyUser1650776613609 implements MigrationInterface {
    name = 'AddUniversityFacultyUser1650776613609';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "university" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "shortName" text NOT NULL, "fullName" text NOT NULL, "description" text NOT NULL, "priority" integer NOT NULL, CONSTRAINT "PK_d14e5687dbd51fd7a915c22ac13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d14e5687dbd51fd7a915c22ac1" ON "university" ("id") `);
        await queryRunner.query(`CREATE TABLE "faculty" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "shortName" text NOT NULL, "fullName" text NOT NULL, "description" text NOT NULL, "priority" integer NOT NULL, "university_id" character varying NOT NULL, CONSTRAINT "PK_635ca3484f9c747b6635a494ad9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_635ca3484f9c747b6635a494ad" ON "faculty" ("id") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "roles" text NOT NULL, "status" "user_status_enum" NOT NULL DEFAULT 'Pending', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `);
        await queryRunner.query(`ALTER TABLE "faculty" ADD CONSTRAINT "FK_dd143513e8e517ee17c0798d63b" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faculty" DROP CONSTRAINT "FK_dd143513e8e517ee17c0798d63b"`);
        await queryRunner.query(`DROP INDEX "IDX_cace4a159ff9f2512dd4237376"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "IDX_635ca3484f9c747b6635a494ad"`);
        await queryRunner.query(`DROP TABLE "faculty"`);
        await queryRunner.query(`DROP INDEX "IDX_d14e5687dbd51fd7a915c22ac1"`);
        await queryRunner.query(`DROP TABLE "university"`);
    }

}
