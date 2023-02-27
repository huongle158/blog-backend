import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({
    default: '',
  })
  avatar: string;

  @Column({
    default:
      'https://khoinguonsangtao.vn/wp-content/uploads/2021/09/anh-bia-facebook-cute-nhat-780x289.jpg',
  })
  cover: string;

  // Ko trả về trường này trong mọi response
  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
