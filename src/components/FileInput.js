import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { handleChangeEvent, handleDropEvent, preventDefault } from '../helpers/event';
import { selectIsDragging, selectIsDraggingOver } from '../helpers/fileInputSelectors';
import FileInputMetadata from './FileInputMetadata';

import '../styles/FileInput.scss';

class FileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredInDocument: 0,
      isOver: 0,
      value: null,
    };

    this.input = null;

    this.openFileDialog = this.openFileDialog.bind(this);
    this.selectFile = this.selectFile.bind(this);

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

  openFileDialog() {
    if (this.input) {
      this.input.click();
    }
  }
  selectFile(event) {
    const { onChangeCallback } = this.props;

    const files = handleChangeEvent(event);

    if (files) {
      const file = files[0]; // get only one

      this.setState(state => ({
        ...state,
        enteredInDocument: 0,
        isOver: 0,
        value: file,
      }), () => {
        if (onChangeCallback) {
          onChangeCallback(this.state);
        }
      });
    }
  }

  onDocumentDragEnter(event) {
    this.setState(state => ({ ...state, enteredInDocument: state.enteredInDocument + 1 }));
  }
  onDocumentDragLeave(event) {
    this.setState(state => ({ ...state, enteredInDocument: state.enteredInDocument - 1 }));
  }
  onDocumentDrop(event) {
    this.setState(state => ({ ...state, enteredInDocument: 0 }));
  }

  onDragEnter(event) {
    const { onDragEnterCallback } = this.props;
    const wasDraggingOver = selectIsDraggingOver(this.state);

    this.setState(state => ({ ...state, isOver: state.isOver + 1 }), () => {
      if (onDragEnterCallback && !wasDraggingOver) {
        onDragEnterCallback(this.state);
      }
    });
  }
  onDragLeave(event) {
    const { onDragLeaveCallback } = this.props;
    const wasDraggingOver = selectIsDraggingOver(this.state);

    this.setState(state => ({ ...state, isOver: state.isOver - 1 }), () => {
      if (onDragLeaveCallback && wasDraggingOver) {
        onDragLeaveCallback(this.state);
      }
    });
  }
  onDrop(event) {
    const { onDropCallback } = this.props;

    const files = handleDropEvent(event);

    if (files) {
      const file = files[0]; // get only one

      this.setState(state => ({
        ...state,
        enteredInDocument: 0,
        isOver: 0,
        value: file,
      }), () => {
        if (onDropCallback) {
          onDropCallback(this.state);
        }
      });
    }
  }

  render() {
    const { name, size } = this.state.value || '';
    const childrenWithExtraProp = this.props.customMetadata({ name, size });

    const isDragging = selectIsDragging(this.state);
    const wrapperClassname = isDragging
      ? 'BrainhubFileInput__wrapper BrainhubFileInput__wrapper--selected'
      : 'BrainhubFileInput__wrapper';

    let renderMetadata = null;

    if (name && size) {
      renderMetadata = childrenWithExtraProp
        ? childrenWithExtraProp
        : <FileInputMetadata name={name} size={size}/>;
    }

    return (
      <div
        className={wrapperClassname}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        <input
          className="BrainhubFileInput__input--hidden"
          type="file"
          ref={ref => {
            this.input = ref;
          }}
          onChange={this.selectFile}
        />
        <button onClick={this.openFileDialog}>Select File</button>
        <div className={!isDragging && 'BrainhubFileInput__dropInfo--hidden' || ''}>
          <p>Drop here to select file</p>
        </div>
        {this.props.displayMetadata && renderMetadata}
      </div>
    );
  }
}

FileInput.defaultProps = {
  dragOnDocument: true,
  dropOnDocument: false,
  onChangeCallback: null,
  onDragEnterCallback: null,
  onDragLeaveCallback: null,
  onDropCallback: null,
  displayMetadata: true,
  customMetadata: () => null,
};

FileInput.propTypes = {
  dragOnDocument: PropTypes.bool,
  dropOnDocument: PropTypes.bool,
  onChangeCallback: PropTypes.func,
  onDragEnterCallback: PropTypes.func,
  onDragLeaveCallback: PropTypes.func,
  onDropCallback: PropTypes.func,
  displayMetadata: PropTypes.bool,
  customMetadata: PropTypes.func,
};

export default FileInput;
