import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { handleChangeEvent, handleDropEvent, preventDefault } from '../helpers/event';
import { getImageThumbnail, updateFileFromBlob } from '../helpers/file';
import { selectIsDragging, selectIsDraggingOver } from '../helpers/fileInputSelectors';
import { IMAGE_MIME_TYPE } from '../helpers/mime';

import DropArea from './DropArea';
import ImageEditor from './ImageEditor';
import FileInfo from './FileInfo';

import '../styles/FileInput.scss';

class FileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredInDocument: 0,
      isOver: 0,
      value: null,
      tempValue: null,
      image: null,
    };

    this.input = null;

    this.handleFile = this.handleFile.bind(this);
    this.handleImageFile = this.handleImageFile.bind(this);
    this.handleEditedFile = this.handleEditedFile.bind(this);

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

  async handleEditedFile(blob) {
    const { displayImageThumbnail, onChangeCallback } = this.props;
    const { tempValue: file } = this.state;

    const editedFile = updateFileFromBlob(blob, file);
    const editedThumbnail = displayImageThumbnail
      ? await getImageThumbnail(editedFile)
      : null;


    return this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      value: editedFile,
      tempValue: null,
      image: editedThumbnail,
    }), () => {
      if (onChangeCallback) {
        onChangeCallback(this.state);
      }
    });
  }

  handleFile(file) {
    const { onChangeCallback } = this.props;

    this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      value: file,
      image: null,
    }), () => {
      if (onChangeCallback) {
        onChangeCallback(this.state);
      }
    });
  }

  async handleImageFile(file) {
    const image = await getImageThumbnail(file);

    return this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      value: null,
      tempValue: file,
      image,
    }));
  }

  selectFile(event) {
    const files = handleChangeEvent(event);

    if (files.length) {
      const file = files[0];

      if (IMAGE_MIME_TYPE.test(file.mimeType)) {
        return this.handleImageFile(file);
      } else {
        return this.handleFile(file);
      }
    }
  }

  onDocumentDragEnter() {
    this.setState(state => ({ ...state, enteredInDocument: state.enteredInDocument + 1 }));
  }
  onDocumentDragLeave() {
    this.setState(state => ({ ...state, enteredInDocument: state.enteredInDocument - 1 }));
  }
  onDocumentDrop() {
    this.setState(state => ({ ...state, enteredInDocument: 0 }));
  }

  onDragEnter() {
    const { onDragEnterCallback } = this.props;
    const wasDraggingOver = selectIsDraggingOver(this.state);

    this.setState(state => ({ ...state, isOver: state.isOver + 1 }), () => {
      if (onDragEnterCallback && !wasDraggingOver) {
        onDragEnterCallback(this.state);
      }
    });
  }
  onDragLeave() {
    const { onDragLeaveCallback } = this.props;
    const wasDraggingOver = selectIsDraggingOver(this.state);

    this.setState(state => ({ ...state, isOver: state.isOver - 1 }), () => {
      if (onDragLeaveCallback && wasDraggingOver) {
        onDragLeaveCallback(this.state);
      }
    });
  }
  onDrop(event) {
    const files = handleDropEvent(event);

    if (files.length) {
      const file = files[0];

      if (IMAGE_MIME_TYPE.test(file.mimeType)) {
        this.handleImageFile(file);
      } else {
        this.handleFile(file);
      }
    }
  }

  render() {
    const { value, image } = this.state;
    const {
      className,
      dropAreaClassName,
      fileInfoClassName,
      imageEditorClassName,
      cropAspectRatio,
      metadataComponent,
      thumbnailComponent,
      label,
      cropTool,
      scaleOptions,
    } = this.props;
    const isDragging = selectIsDragging(this.state);

    const baseClassName = (className && `brainhub-file-input__wrapper ${className}`) || 'brainhub-file-input__wrapper';

    return (
      <div className={baseClassName}>
        <div className="brainhub-file-input__label">{label}</div>
        <input
          className="brainhub-file-input__input--hidden"
          type="file"
          ref={ref => {
            this.input = ref;
          }}
          onChange={this.selectFile}
        />
        { (value
          && (
            <FileInfo
              className={fileInfoClassName}
              file={value}
              image={image}
              metadataComponent={metadataComponent}
              thumbnailComponent={thumbnailComponent}
            />
          ))
          || null
        }
        { ((!image || value) // it means image not being edited
          && (
            <DropArea
              className={dropAreaClassName}
              dragging={isDragging}
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
              openFileDialog={this.openFileDialog}
            />
          ))
          || null
        }
        { ((image && !value) // it means image being edited
          && (
            <ImageEditor
              className={imageEditorClassName}
              cropAspectRatio={cropAspectRatio}
              cropTool={cropTool}
              image={image}
              scaleOptions={scaleOptions}
              onEditionFinished={this.handleEditedFile}

            />
          ))
          || null
        }
      </div>
    );
  }
}

FileInput.defaultProps = {
  className: '',
  dropAreaClassName: '',
  fileInfoClassName: '',
  imageEditorClassName: '',
  dragOnDocument: true,
  dropOnDocument: false,
  metadataComponent: null,
  thumbnailComponent: null,
  displayImageThumbnail: true,
  cropAspectRatio: 0,
  cropTool: false,
  scaleOptions: null,
  onChangeCallback: null,
  onDragEnterCallback: null,
  onDragLeaveCallback: null,
};

FileInput.propTypes = {
  className: PropTypes.string,
  dropAreaClassName: PropTypes.string,
  fileInfoClassName: PropTypes.string,
  imageEditorClassName: PropTypes.string,
  dragOnDocument: PropTypes.bool,
  dropOnDocument: PropTypes.bool,
  label: PropTypes.string.isRequired,
  metadataComponent: PropTypes.func,
  thumbnailComponent: PropTypes.func,
  displayImageThumbnail: PropTypes.bool,
  cropAspectRatio: PropTypes.number,
  cropTool: PropTypes.bool,
  scaleOptions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    keepAspectRatio: PropTypes.bool,
  }),
  onChangeCallback: PropTypes.func,
  onDragEnterCallback: PropTypes.func,
  onDragLeaveCallback: PropTypes.func,
};

export default FileInput;
