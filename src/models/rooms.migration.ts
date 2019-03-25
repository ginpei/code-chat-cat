import migrate, { Migrations } from '../misc';
import { RoomStatus } from '../reducers/rooms';

const migrations: Migrations = {
  // example
  20190222214600: (v) => ({
    ...v,
    migrated: true,
    modelVersion: '20190222214609',
  }),
  20190222214609: (v) => ({
    createdAt: v.createdAt,
    modelVersion: '20190322232435',
    name: v.name,
    status: v.active ? RoomStatus.active : RoomStatus.draft,
    textbookContent: v.textbookContent,
    updatedAt: v.updatedAt,
    userId: v.userId,
  }),
  20190322232435: (v) => v,
};

export const roomVersion = '20190322232435';

export default function migrateRoom (room: any): any {
  return migrate(migrations, room);
}
