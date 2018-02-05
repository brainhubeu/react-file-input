import React, { Component } from 'react';
import { element } from 'prop-types';
import FileInputMetadata from './FileInputMetadata';
export default class FileInput extends Component {
  static propTypes = {
    children: element,
  }
  constructor(props) {
    super(props);
    this.state = {
      filename: null,
      size: null,
    };
  }

  // Do we handle multiple inputs??
  getInputMetadata = arg => {
    const { target } = arg;

    if (target.files[0]) {
      const filename = target.files[0].name;
      const size = target.files[0].size;

      return this.setState({
        filename, size,
      });
    }
  }

  render() {
    // TODO: add posibility to passing custom component as props.
    const { filename, size } = this.state;
    const childrenWithExtraProp = React.Children.map(this.props.children, child => React.cloneElement(child, {
      filename, size,
    }));

    let renderMetadata = null;

    if (filename && size) {
      renderMetadata = childrenWithExtraProp
        ? childrenWithExtraProp
        : <FileInputMetadata filename={filename} size={size}/>;
    }

    return (<div>
      <input onChange={this.getInputMetadata} type="file" />
      {renderMetadata}
    </div>);
  }
}
