import React from 'react';
import firebase from '../middleware/firebase';
import { Room, useRoomStudents } from '../models/Rooms';

const RoomStudentsConsole: React.FC<{ room: Room }> = ({ room }) => {
  const [students] = useRoomStudents(firebase.firestore(), room);
  return (
    <>
      <p>{students.length} students</p>
      <ul className="RoomStudentsConsole">
        {students.map((student) => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </>
  );
};

export default RoomStudentsConsole;
