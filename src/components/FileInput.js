import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { handleChangeEvent, handleDropEvent, preventDefault } from '../helpers/event';
import { getImageThumbnail, createImageFromSource, updateFileFromBlob } from '../helpers/file';
import { selectIsDragging, selectIsDraggingOver } from '../helpers/fileInputSelectors';
import { IMAGE_MIME_TYPE } from '../helpers/mime';

import DropArea from './DropArea';
import FileInputMetadata from './FileInputMetadata';
import ImageThumbnail from './ImageThumbnail';
import ImageEditor from './ImageEditor';


import '../styles/FileInput.scss';

class FileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredInDocument: 0,
      isOver: 0,
      value: null,
      image: null,
      rotation: 0,
      hasBeenRotated: false,
      hasBeenEdited: !props.cropTool,
    };

    this.input = null;
    this.canvasPrinter = null;

    this.handleFile = this.handleFile.bind(this);
    this.handleImageFile = this.handleImageFile.bind(this);
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

  async cancelEdition(image) {
    const { scaleOptions } = this.props;
    if (!scaleOptions) {
      return this.setState({ hasBeenEdited: true });
    }

    const { displayImageThumbnail } = this.props;
    const { value: file } = this.state;

    const resizedImageBlob = await this.canvasPrinter.resizeImage(image, scaleOptions);

    const resizedFile = updateFileFromBlob(resizedImageBlob, file);
    const resizedThumbnail = displayImageThumbnail
      ? await getImageThumbnail(resizedFile)
      : null;


    return this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      value: resizedFile,
      image: resizedThumbnail,
      hasBeenEdited: true,
    }));
  }

  async saveEdition(image, area) {
    const { displayImageThumbnail, scaleOptions } = this.props;
    const { value: file } = this.state;

    const croppedImageBlob = await this.canvasPrinter.cropAndResizeImage(image, area, scaleOptions);

    const croppedFile = updateFileFromBlob(croppedImageBlob, file);
    const croppedThumbnail = displayImageThumbnail
      ? await getImageThumbnail(croppedFile)
      : null;


    return this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      value: croppedFile,
      image: croppedThumbnail,
      hasBeenEdited: true,
    }));
  }

  handleFile(file, callback = null) {
    this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      value: file,
      image: null,
      hasBeenEdited: true,
    }), () => {
      if (callback) {
        callback(this.state);
      }
    });
  }

  async handleImageFile(file) {
    const { cropTool } = this.props;
    const image = await getImageThumbnail(file);

    this.setState(state => ({
      ...state,
      enteredInDocument: 0,
      isOver: 0,
      file,
      image,
      hasBeenRotated: false,
      hasBeenEdited: !cropTool,
    }));
  }

  selectFile(event) {
    const { onChangeCallback } = this.props;

    const files = handleChangeEvent(event);

    if (files.length) {
      const file = files[0];

      if (IMAGE_MIME_TYPE.test(file.mimeType)) {
        this.handleImageFile(file);
      } else {
        this.handleFile(file, onChangeCallback);
      }
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
      const file = files[0];

      if (IMAGE_MIME_TYPE.test(file.mimeType)) {
        this.handleImageFile(file);
      } else {
        this.handleFile(file, onDropCallback);
      }
    }
  }

  render() {
    const { value, image, hasBeenEdited, hasBeenRotated } = this.state;
    const {
      cropAspectRatio,
      customMetadata: CustomMetadata,
      customImageThumbnail: CustomImageThumbnail,
      label,
      cropTool,
      scaleOptions,
    } = this.props;

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
        {image
          ? (
            <ImageEditor
              cropAspectRatio={cropAspectRatio}
              cropTool={cropTool}
              image={image}
              scaleOptions={scaleOptions}
              onEditionFinished={console.log}

            />
          )
          : null}


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
  scaleOptions: null,
  cropAspectRatio: 0,
  cropTool: false,
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
  scaleOptions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    keepAspectRatio: PropTypes.boolean,
  }),
  cropAspectRatio: PropTypes.number,
  cropTool: PropTypes.bool,
};

export default FileInput;
