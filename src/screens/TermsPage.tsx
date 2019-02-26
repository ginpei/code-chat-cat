import React from 'react';
import { Link } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';

export default function TermsPage () {
  return (
    <DefaultLayout>
      <h1>Terms of service</h1>
      <p><Link to="/">Back to home</Link></p>
      <p>This is currently beta. You have to understand whatever would happen.</p>
    </DefaultLayout>
  );
}
