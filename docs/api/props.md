## Props

### Required
* ```label: string```: Label for the input.

### Others
* ```className: string```: Custom className
* ```dropAreaClassName: string```: Custom className for the DropArea<br/>
* ```fileInfoClassName: string```: Custom className for the FileInfo<br/>
* ```imageEditorClassName: string```: Custom className for the ImageEditor
* ```dragOnDocument: boolean```: Listen for drag events in the whole document
* ```dropOnDocument: boolean```: Allow to drop on document
* ```metadataComponent: React Component```: Custom component for the metadata. Props: `name`, `size`, `extension`, `type`
* ```thumbnailComponent: React Component```: Custom component for the image thumbnail. Props: `children` (`<img>` node with the thumbnail)
* ```displayImageThumbnail: boolean```: Whether to generate a thumbnail for image files
* ```cropAspectRatio: number```: If cropTool is enabled, the aspect ratio for the selection. 0 means the selection is free
* ```cropTool: boolean```: Whether to render a crop tool for image files
* ```scaleOptions: {width: number, height: number: keepAspectRatio: boolean}```: Scale option for file images. `keepAspectRatio` refers to if the original aspect ratio should be kept when applying scaling
* ```onChangeCallback: function```: Callback invoked when a file is selected. It is called with the current state of the component
* ```onDragEnterCallback: function```: Callback invoked when drag enters. It is called with the current state of the component
* ```onDragLeaveCallback: function```: Callback invoked when drag leaves. It is called with the current state of the component
