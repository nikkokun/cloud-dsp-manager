import React, { Component } from 'react';
import axios from 'axios';
import cloudinaryConfig from '../cloudinary-config';
import UploadProgress from './UploadProgress';
import Thumbnails from './Thumbnails';
import Results from '../../users/users';

const cloudName = cloudinaryConfig.cloud_name;
const unsignedUploadPreset = cloudinaryConfig.unsigned_upload_preset;

console.log('cloudName', cloudName, 'unsignedUploadPreset', unsignedUploadPreset);
class Uploader extends Component {
  constructor(props) {
    super(props);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.state = {
      progress: 0,
      images: []
    };
  }

  handleUploadFile(event) {
    console.log(this);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = new FormData();
    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('file', event.target.files[0]);
    fd.append('resource_type', 'auto');
    const me = this;
    const config = {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      onUploadProgress(progressEvent) {
        const progress = Math.round((progressEvent.loaded * 100.0) / progressEvent.total);
        console.log(progress);
        me.setState({ progress });
        console.log(me.state);
      }
    };
    axios.post(url, fd, config)
      .then((res) => {
        console.log('res', res);
        // File uploaded successfully
        const response = res.data;
        console.log(response);
        me.setState({progress:0, images: [...me.state.images, response.public_id]});
      })
      .catch((err) => {
        console.error('err', err);
      });
  }

  render() {
    return (
      <div>
        <div className="upload-btn-wrapper">
          <button className="btn">Upload a file</button>
          <input type="file" onChange={this.handleUploadFile.bind(this)} />
        </div>
        {this.state.progress ? <UploadProgress progress={this.state.progress} /> : null}
        <Thumbnails images={this.state.images} />
      </div>
    );
  }
}

export default Uploader;
