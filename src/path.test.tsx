import { shallow, ShallowWrapper } from 'enzyme';
import firebase from 'firebase';
import React from 'react';
import { Link } from 'react-router-dom';
import * as Rooms from './models/Rooms';
import path, { HomeLink, RoomLink } from './path';

describe('path', () => {
  describe('path()', () => {
    it('simple paths', () => {
      expect(path('home')).toBe('/');
      expect(path('login')).toBe('/login');
      expect(path('logout')).toBe('/logout');
      expect(path('settings')).toBe('/settings');
      expect(() => path('undefined-path' as any)).toThrow('undefined-path');
    });

    describe('room', () => {
      it('default', () => {
        expect(path('room', { id: 'roomId123' })).toBe('/rooms/roomId123');
      });

      it('new', () => {
        expect(path('room-new')).toBe('/rooms/new');
      });

      it('list', () => {
        expect(path('room-list')).toBe('/rooms');
      });

      it('write', () => {
        expect(path('room-write', { id: 'roomId123' }))
          .toBe('/rooms/roomId123/write');
      });

      it('settings', () => {
        expect(path('room-settings', { id: 'roomId123' })).
          toBe('/rooms/roomId123/settings');
      });
    });
  });

  describe('<HomeLink>', () => {
    it('renders', () => {
      const wrapper = shallow(<HomeLink/>);
      expect(wrapper.find(Link)).toHaveLength(1);
      expect(wrapper.find(Link).prop('to')).toBe('/');
      expect(wrapper.find(Link).prop('children')).toBe('Home');
    });
  });

  describe('<RoomLink>', () => {
    let wrapper: ShallowWrapper;

    const room: Rooms.IRoom = {
      createdAt: firebase.firestore.Timestamp.now(),
      id: 'roomId123',
      name: 'Room Name',
      status: Rooms.RoomStatus.draft,
      textbookContent: '',
      updatedAt: firebase.firestore.Timestamp.now(),
      userId: 'userId123',
    };

    describe('default', () => {
      beforeEach(() => {
        wrapper = shallow(<RoomLink room={room}/>);
      });

      it('sets room home path', () => {
        expect(wrapper.find(Link).prop('to')).toBe('/rooms/roomId123');
      });

      it('sets room name as link text', () => {
        expect(wrapper.find(Link).prop('children')).toBe('Room Name');
      });
    });

    describe('write', () => {
      beforeEach(() => {
        wrapper = shallow(<RoomLink room={room} type="write"/>);
      });

      it('sets room home path', () => {
        expect(wrapper.find(Link).prop('to')).toBe('/rooms/roomId123/write');
      });

      it('sets room name as link text', () => {
        expect(wrapper.find(Link).prop('children')).toBe('Room Name');
      });
    });

    describe('settings', () => {
      beforeEach(() => {
        wrapper = shallow(<RoomLink room={room} type="settings"/>);
      });

      it('sets room home path', () => {
        expect(wrapper.find(Link).prop('to')).toBe('/rooms/roomId123/settings');
      });

      it('sets room name as link text', () => {
        expect(wrapper.find(Link).prop('children')).toBe('Room Name');
      });
    });

    describe('children', () => {
      beforeEach(() => {
        wrapper = shallow(<RoomLink room={room}>Hello!</RoomLink>);
      });

      it('sets room home path', () => {
        expect(wrapper.find(Link).prop('to')).toBe('/rooms/roomId123');
      });

      it('sets room name as link text', () => {
        expect(wrapper.find(Link).prop('children')).toBe('Hello!');
      });
    });
  });
});
