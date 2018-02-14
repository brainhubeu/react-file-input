import React, { Component } from 'react';
import FileInput from '../../src';

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>React File Input</h1>
        <h2>By Brainhub</h2>
        <div style={{ padding: '5px' }}>
          <FileInput label="File Input" scaleOptions={{ width: 300, height: 300, keepAspectRatio: true }} cropTool/>
        </div>
      </div>
    );
  }
}
