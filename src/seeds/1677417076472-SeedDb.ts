import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1677417076472 implements MigrationInterface {
  name = 'SeedDb1677417076472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('Front-end'),('Back-end'),('Devops'),('UI/UX/Design'),('Mobile-app'),('Games'),('Life'),('Others')`,
    );

    // await queryRunner.query(
    //   // Password is 123456 default
    //   `INSERT INTO users (username,email,password) VALUES ('sally','sally@gmail.com','$2b$10$yltFpVtjSfGD9pmJgyqhM.3zxjZ3u9fcJuP5BUTeG72cCh9g5UUxS'),('easylogin','easylogin@gmail.com','$2b$10$Wjj5yROAPMHw4kbGofsAxOZlMOVYk2JFA3LEMmf2101yUdGp87e1G')`,
    // );

    // await queryRunner.query(
    //   // taglist is string nhung có thể bao trong ngoặc kép để coi nó như 1 column thì nó mới hoạt động
    //   `INSERT INTO articles (slug,title,description,body,"tagList","authorId") VALUES ('first-article','First articles','First articles so you should to read','First articles so you should to read and this is content of this','Front-end,Devops',1),('second-article','Second articles','Second articles so you should to read','Second articles so you should to read and this is content of this','Devops',2)`,
    // );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
