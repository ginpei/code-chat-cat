import React from 'react';

const SimpleError: React.FC<{ error: Error }> = ({ error }) => (
  <div className="SimpleError">Error: {error.message}</div>
);

export default SimpleError;
