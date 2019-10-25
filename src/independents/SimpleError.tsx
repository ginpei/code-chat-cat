import React from 'react';

const SimpleError: React.FC<{
  error: Error | firebase.auth.Error
}> = ({ error }) => (
  <div className="SimpleError">Error: {error.message || '(Unknown)'}</div>
);

export default SimpleError;
