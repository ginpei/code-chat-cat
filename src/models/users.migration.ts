import migrate, { Migrations } from '../misc';

const migrations: Migrations = {
  20190222214609: (v) => v,
};

export const userVersion = '20190222214609';

export default function migrateUser (data: any): any {
  return migrate(migrations, data);
}
