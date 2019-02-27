import React from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { HomeLink } from '../path';

export default function NotFoundPage () {
  return (
    <DefaultLayout>
      <h1>Not found</h1>
      <p><HomeLink/></p>
    </DefaultLayout>
  );
}
