import React, { Component } from 'react';
import { CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import cloudinaryConfig from './cloudinary-config.js';
const cloudinaryCore = new cloudinary.Cloudinary(cloudinaryConfig);
import Uploader from './uploader/Uploader';
import FileViewer from './fileviewer/FileViewer'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.userId = 1;

    this.uploaderReference = React.createRef();
    this.fileviewerReference = React.createRef();
  }

  updateFileViewer() {
    this.fileviewerReference.current.getAudios();
    console.log('ran');
  }


  render() {

    return (
      <body>
        <CloudinaryContext cloudName={cloudinaryConfig.cloud_name}>
          <Uploader userId={this.userId} ref={this.uploaderReference} parent={this}/>
        </CloudinaryContext>
        <FileViewer ref={this.fileviewerReference} parent={this}/>
      </body>
    );
  }
}
