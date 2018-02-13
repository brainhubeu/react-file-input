import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { handleChangeEvent, handleDropEvent, preventDefault } from '../helpers/event';
import { getImageThumbnail } from '../helpers/file';
import { selectIsDragging, selectIsDraggingOver } from '../helpers/fileInputSelectors';

import DropArea from './DropArea';
import FileInputMetadata from './FileInputMetadata';
import ImageThumbnail from './ImageThumbnail';
import ImageEditor from './ImageEditor';

import CanvasPrinter from './CanvasPrinter';

import '../styles/FileInput.scss';

class FileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredInDocument: 0,
      isOver: 0,
      value: null,
      image: null,
      hasBeenEdited: false,
    };

    this.input = null;
    this.canvasPrinter = null;

    this.handleFile = this.handleFile.bind(this);
    this.updateEditedImage = this.updateEditedImage.bind(this);
    this.cancelEdition = this.cancelEdition.bind(this);
    this.saveEdition = this.saveEdition.bind(this);

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

  async updateEditedImage(blob) {
    const { value } = this.state;
    const file = new File([blob], value.name, { type: blob.type });

    const image = await getImageThumbnail(file);

    file.filename = value.filename;
    file.extension = value.extension;
    file.mimeType = blob.mimeType;


    this.setState(state => ({ ...state, value: file, image, hasBeenEdited: true }));
  }

  cancelEdition() {
    this.setState({ hasBeenEdited: true });
  }

  saveEdition(image, area) {
    if (this.canvasPrinter) {
      this.canvasPrinter.drawImage(image, area);
    }
  }

  async handleFile(file, callback = null) {
    const { displayImageThumbnail } = this.props;

    const image = displayImageThumbnail && file && file.mimeType.match('image.*')
      ? await getImageThumbnail(file)
      : null;

    this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      value: file,
      image,
      hasBeenEdited: false,
    }), () => {
      if (callback) {
        callback(this.state);
      }
    });
  }

  selectFile(event) {
    const { onChangeCallback } = this.props;

    const files = handleChangeEvent(event);

    if (files.length) {
      this.handleFile(files[0], onChangeCallback);
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

    if (files.length) {
      this.handleFile(files[0], onDropCallback);
    }
  }

  render() {
    const { value, image, hasBeenEdited } = this.state;
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
        {image && !hasBeenEdited
          ? (
            <ImageEditor
              image={image}
              onCancelEdition={this.cancelEdition}
              onSaveEdition={this.saveEdition}
            />
          )
          : null}
        {image && !hasBeenEdited
          && <CanvasPrinter
            ref={ref => {
              this.canvasPrinter = ref;
            }}
            onCanvasDraw={this.updateEditedImage}
          />
        }
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
