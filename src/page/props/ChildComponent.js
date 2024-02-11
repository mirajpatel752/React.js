// ChildComponent.js
import React from 'react';
import GrandChildComponent from './GrandChildComponent';

function ChildComponent(props) {
  return (
    <div>
      <GrandChildComponent message={props.message} />
    </div>
  );
}

export default ChildComponent;
