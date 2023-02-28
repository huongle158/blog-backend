import { DataSourceOptions } from 'typeorm';
import { TagEntity } from '@app/modules/tag/tag.entity';

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'easylogin',
  password: '123456',
  database: 'sharingblog',
  entities: [
    'src/modules/**/*.entity.ts',
    'src/**/*.entity.{ts,js}',
    'dist/modules/**/*.entity.js',
  ],
  migrations: [
    __dirname + '/migrations/**/*.{ts,js}',
    'dist/{migrations,seeds}/*.js',
  ],
  synchronize: true,
  logging: true,
  migrationsRun: true,
  // dropSchema: false,
};

export default config;
