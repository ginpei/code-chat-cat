import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1>Hello Home World!</h1>
      <p><Link to="/login">Login</Link></p>
    </div>
  );
};
