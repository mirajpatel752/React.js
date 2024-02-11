// MyComponent.js
import React from 'react';
import withLogging from './withLogging';

const MyComponent = () => {
  return (
    <div>
      <p>This is MyComponent</p>
    </div>
  );
};

export default withLogging(MyComponent);
