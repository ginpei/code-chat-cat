import React from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';

export default function NotFoundPage () {
  return (
    <DefaultLayout>
      <h1>Not found</h1>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </DefaultLayout>
  );
}
