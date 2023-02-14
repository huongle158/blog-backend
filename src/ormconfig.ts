import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'easylogin',
  password: '123456',
  database: 'sharingblog',
  // dirname sẽ trong src
  entities: [__dirname + '/../**/*.entity{ .js,.ts}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*.{js,ts}'],
};

export default config;
