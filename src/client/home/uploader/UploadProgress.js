import React from 'react';

export default (props) => (
  <div className="progress-bar" id="progress-bar">
    <div className="progress" id="progress" style={{width: `${props.progress}%`}}></div>
  </div>);
