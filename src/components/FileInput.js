import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { handleChangeEvent, handleDropEvent, preventDefault } from '../helpers/event';
import { selectIsDragging, selectIsDraggingOver } from '../helpers/fileInputSelectors';

import Droparea from './Droparea';
import TextField from './TextField';

import '../styles/FileInput.scss';

class FileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredInDocument: 0,
      isOver: 0,
      textValue: '',
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

    this.onTextInputChange = this.onTextInputChange.bind(this);
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

  onTextInputChange(event) {
    if (event.target && event.target.value) {
      const textValue = event.target.value;

      this.setState(state => ({ ...state, textValue }));
    }
  }

  render() {
    const { label, placeholder } = this.props;
    const { textValue } = this.state;
    const isDragging = selectIsDragging(this.state);

    return (
      <div className="brainhub-file-input__wrapper">
        <input
          className="brainhub-file-input__input--hidden"
          type="file"
          ref={ref => {
            this.input = ref;
          }}
          onChange={this.selectFile}
        />
        <TextField
          label={label}
          placeholder={placeholder}
          value={textValue}
          onChange={this.onTextInputChange}
        />
        <Droparea
          dragging={isDragging}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          openFileDialog={this.openFileDialog}
        />
        <code>{JSON.stringify(this.state, null, 2)}</code>
      </div>
    );
  }
}

FileInput.defaultProps = {
  dragOnDocument: true,
  dropOnDocument: false,
  placeholder: 'Placeholder',
  onChangeCallback: null,
  onDragEnterCallback: null,
  onDragLeaveCallback: null,
  onDropCallback: null,
};

FileInput.propTypes = {
  dragOnDocument: PropTypes.bool,
  dropOnDocument: PropTypes.bool,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChangeCallback: PropTypes.func,
  onDragEnterCallback: PropTypes.func,
  onDragLeaveCallback: PropTypes.func,
  onDropCallback: PropTypes.func,
};

export default FileInput;
