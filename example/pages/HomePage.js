import React, { Component } from 'react';
import FileInput from '../../src';

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>React File Input</h1>
        <h2>By Brainhub</h2>
        <div style={{ padding: '5px' }}>
          <FileInput scaleImageOptions={{ width: 150, height: 150, ratio: '3:2' }} label="File Input"/>
        </div>
      </div>
    );
  }
}
