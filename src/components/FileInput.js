import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getDataTransfer, preventDefault } from '../helpers/event';

class FileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDraggingOnDocument: 0,
      isDraggingOver: 0,
      value: null,
    };

    this.onDocumentDragEnter = this.onDocumentDragEnter.bind(this);
    this.onDocumentDragLeave = this.onDocumentDragLeave.bind(this);
    this.onDocumentDrop = this.onDocumentDrop.bind(this);

    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }
  componentDidMount() {
    const { dragOnDocument, dropOnDocument } = this.props;

    if (dragOnDocument) {
      document.addEventListener('dragenter', this.onDocumentDragEnter, false);
      document.addEventListener('dragleave', this.onDocumentDragLeave, false);
      document.addEventListener('drop', this.onDocumentDrop, false);
    }

    if (!dropOnDocument) {
      document.addEventListener('dragover', preventDefault, false);
      document.addEventListener('drop', preventDefault, false);
    }
  }

  componentWillUnmount() {
    const { dragOnDocument, dropOnDocument } = this.props;

    if (dragOnDocument) {
      document.removeEventListener('dragenter', this.onDocumentDragEnter);
      document.removeEventListener('dragleave', this.onDocumentDragLeave);
      document.removeEventListener('drop', this.onDocumentDrop);
    }

    if (!dropOnDocument) {
      document.removeEventListener('dragover', preventDefault);
      document.removeEventListener('drop', preventDefault);
    }
  }

  onDocumentDragEnter(event) {
    this.setState(state => ({ ...state, isDraggingOnDocument: state.isDraggingOnDocument + 1 }));
  }
  onDocumentDragLeave(event) {
    this.setState(state => ({ ...state, isDraggingOnDocument: state.isDraggingOnDocument - 1 }));
  }
  onDocumentDrop(event) {
    this.setState(state => ({ ...state, isDraggingOnDocument: 0 }));
  }

  onDragEnter(event) {
    const { onDragEnterCallback } = this.props;
    const { isDraggingOver: prevIsDraggingOver } = this.state;

    this.setState(state => ({ ...state, isDraggingOver: state.isDraggingOver + 1 }), () => {
      if (onDragEnterCallback && prevIsDraggingOver === 0) {
        onDragEnterCallback(this.state);
      }
    });
  }
  onDragLeave(event) {
    const { onDragLeaveCallback } = this.props;
    const { isDraggingOver: prevIsDraggingOver } = this.state;

    this.setState(state => ({ ...state, isDraggingOver: state.isDraggingOver - 1 }), () => {
      if (onDragLeaveCallback && prevIsDraggingOver > 0) {
        onDragLeaveCallback(this.state);
      }
    });
  }
  onDrop(event) {
    const { onDropCallback } = this.props;
    event.preventDefault();

    const file = getDataTransfer(event);

    this.setState(state => ({
      ...state,
      isDraggingOnDocument: 0,
      isDraggingOver: 0,
      value: file,
    }), () => {
      if (onDropCallback) {
        onDropCallback(this.state);
      }
    });
  }
  render() {
    const { isDraggingOnDocument } = this.state;
    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {isDraggingOnDocument
          ?(<p>drop here to select file</p>)
          : null
        }
      </div>
    );
  }
}

FileInput.defaultProps = {
  dragOnDocument: true,
  dropOnDocument: false,
  onDragEnterCallback: null,
  onDragLeaveCallback: null,
  onDropCallback: null,
};

FileInput.propTypes = {
  dragOnDocument: PropTypes.bool,
  dropOnDocument: PropTypes.bool,
  onDragEnterCallback: PropTypes.func,
  onDragLeaveCallback: PropTypes.func,
  onDropCallback: PropTypes.func,
};

export default FileInput;
