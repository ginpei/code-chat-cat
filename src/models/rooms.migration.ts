import migrate, { Migrations } from '../misc';

const migrations: Migrations = {
  // example
  20190222214600: (v) => ({
    ...v,
    migrated: true,
    modelVersion: '20190222214609',
  }),
  20190222214609: (v) => v,
};

export const roomVersion = '20190222214609';

export default function migrateRoom (room: any): any {
  return migrate(migrations, room);
}
