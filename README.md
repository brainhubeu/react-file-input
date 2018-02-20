# react-file-input
[![CircleCI](https://circleci.com/gh/brainhubeu/react-file-input.svg?style=svg)](https://circleci.com/gh/brainhubeu/react-file-input)
A File Input, width drag'n'drop and image editor.

## Why?
And image is worth thousand words
![Screenshot](./screenshot.gif)

## Installation
```sh
npm i @brainhubeu/react-file-input
```
Or if you prefer
```sh
yarn add @brainhubeu/react-file-input
```

## Reference
### FileInput
propName | type | required | default | description
---------|------|----------|---------|------------
className|`string`|no|''|Custom className
dropAreaClassName|`string`|no|''|Custom className for the DropArea
fileInfoClassName|`string`|no|''|Custom className for the FileInfo
imageEditorClassName|`string`|no|''|Custom className for the ImageEditor
dragOnDocument|`boolean`|no|true|Listen for drag events in the whole document
dropOnDocument|`boolean`|no|false|Allow to drop on document
label|`string`|yes||Label for the input
metadataComponent|`React Component`|no|null|Custom component for the metadata. Props: `name`, `size`, `extension`, `type`
thumbnailComponent|`React Component`|no|null|Custom component for the image thumbnail. Props: `children` (`<img>` node with the thumbnail)
displayImageThumbnail|boolean|no|true|Whether to generate a thumbnail for image files
cropAspectRatio|`number`|no|0|If cropTool is enabled, the aspect ratio for the selection. 0 means the selection is free
cropTool|boolean|no|false|Wheter to render a crop tool for image files
scaleOptions| ``` {width: number, height: number: keepAspectRatio: boolean}```| no|null|Scale option for file images. `keepAspectRatio` refers to if the original aspect ratio should be kept when appliyin scaling
onChangeCallback|`function`|no|null|Callback invoked when a file is selected. It is called with the current state of the component
onDragEnterCallback|`function`|no|null|Callback invoked when drag enters. It is called with the current state of the component
onDragLeaveCallback|`function`|no|null|Callback invoked when drag leaves. It is called with the current state of the component

## License

react-carousel is copyright © 2014-2018 [Brainhub](https://brainhub.eu/) It is free software, and may be redistributed under the terms specified in the [license](LICENSE.md).

## About

react-carousel is maintained by the Brainhub development team. It is funded by Brainhub and the names and logos for Brainhub are trademarks of Brainhub Sp. z o.o.. You can check other open-source projects supported/developed by our teammates here. 

[![Brainhub](https://avatars0.githubusercontent.com/u/20307185?s=200&v=4)](https://brainhub.eu/?utm_source=github)

We love open-source JavaScript software! See our other projects or hire us to build your next web, desktop and mobile application with JavaScript.
