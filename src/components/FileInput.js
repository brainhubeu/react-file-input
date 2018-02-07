import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { handleChangeEvent, handleDropEvent, preventDefault } from '../helpers/event';
import { selectIsDragging, selectIsDraggingOver } from '../helpers/fileInputSelectors';

import DropArea from './DropArea';
import FileInputMetadata from './FileInputMetadata';
import ImageThumbnail from './ImageThumbnail';

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
    this.getImageThumbnail = this.getImageThumbnail.bind(this);

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

  getImageThumbnail(file) {
    const reader = new FileReader();
    if (file && file.type.match('image.*')) {
      reader.readAsDataURL(file);
    }
    reader.onload = e => this.setState({ image: e.target.result });
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
        this.getImageThumbnail(file);
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
        this.getImageThumbnail(file);
      });
    }
  }

  render() {
    const { value, image } = this.state;
    const { customMetadata: CustomMetadata, customImageThumbnail: CustomImageThumbnail, label } = this.props;

    const MetadataClass = CustomMetadata || FileInputMetadata;
    const ImageThumbnailClass = CustomImageThumbnail || ImageThumbnail;

    const isDragging = selectIsDragging(this.state);

    const metadataComponent = value
      && <MetadataClass name={value.filename} size={value.size} extension={value.extension} type={value.mimeType}/>;
    const imageThumbnailComponent = image && <ImageThumbnailClass image={image}/>;

    return (
      <div className="brainhub-file-input__wrapper">
        <div className="brainhub-file-input__label">{label}</div>
        <input
          className="brainhub-file-input__input--hidden"
          type="file"
          ref={ref => {
            this.input = ref;
          }}
          onChange={this.selectFile}
        />
        <button onClick={this.openFileDialog}>Select File</button>
        <div className={!isDragging && 'brainhub-file-input__dropInfo--hidden' || ''}>
          <p>Drop here to select file</p>
        </div>
        <div className="brainhub-file-input__fileInfo">
          {this.props.displayImageThumbnail && imageThumbnailComponent}
          {this.props.displayMetadata && metadataComponent}
        </div>
        <DropArea
          dragging={isDragging}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          openFileDialog={this.openFileDialog}
        />
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
  displayImageThumbnail: true,
};

FileInput.propTypes = {
  dragOnDocument: PropTypes.bool,
  dropOnDocument: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChangeCallback: PropTypes.func,
  onDragEnterCallback: PropTypes.func,
  onDragLeaveCallback: PropTypes.func,
  onDropCallback: PropTypes.func,
  displayMetadata: PropTypes.bool,
  displayImageThumbnail: PropTypes.bool,
  customMetadata: PropTypes.func,
  customImageThumbnail: PropTypes.func,
};

export default FileInput;
