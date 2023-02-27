import ormconfig from '@app/ormconfig';

const ormseedconfig = {
  ...ormconfig,
  migrations: [__dirname + '/seeds/*.ts'],
  seeds: ['src/seeds/*.ts'],
};

export default ormseedconfig;
