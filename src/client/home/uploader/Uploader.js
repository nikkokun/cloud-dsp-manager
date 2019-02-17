import React, { Component } from 'react';
import axios from 'axios';
import cloudinaryConfig from '../cloudinary-config';
import Modal from 'react-modal';
import CircularProgressbar from 'react-circular-progressbar';

const cloudName = cloudinaryConfig.cloud_name;
const unsignedUploadPreset = cloudinaryConfig.unsigned_upload_preset;

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    border                : '0px',
  }
};

export default class Uploader extends Component {
  constructor(props) {
    super(props);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.state = {
      isLoading: false,
      file: null,
      filename: '',
      fileLabel: 'Please choose a file...',
      progress: null,
      modalIsOpen: false
    };
    this.userId = this.props.userId;
    this.parent = this.props.parent;
  }
  upload() {
    if(this.state.file !== null && this.state.filename !== ''){
      this.setState({modalIsOpen: true});
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const fd = new FormData();
      fd.append('upload_preset', unsignedUploadPreset);
      fd.append('file', this.state.file);
      fd.append('resource_type', 'auto');
      const me = this;
      const config = {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        onUploadProgress(progressEvent) {
          const progress = Math.round((progressEvent.loaded * 100.0) / progressEvent.total);
          me.setState({ progress });
        }
      };
      axios.post(url, fd, config)
        .then((res) => {
          console.log('res', res);
          // File uploaded successfully
          const response = res.data;
          fetch('/api/new_audio', {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              'filename': me.state.filename,
              'url': response.url,
              'user_id': 1
            })
          })
            .then(response => response.json())
            .then((data) => {
              this.parent.updateFileViewer();
            })
            .catch((err) => {
              console.error('err', err);
              me.setState({modalIsOpen: false, progress:0});
            });
          me.setState({progress: 0, modalIsOpen: false});
        })
        .catch((err) => {
          console.error('err', err);
          me.setState({modalIsOpen: false, progress:0});
        });
    }
  }

  handleUploadFile(event) {
    this.setState({file: event.target.files[0], fileLabel: event.target.files[0].name, filename: event.target.files[0].name});
    console.log(event.target.files);
  }
  handleFilename(event) {
    // this.setState({file: event.target.files[0], fileLabel: event.target.files[0].name});
    this.setState({fileLabel: event.target.value, filename: event.target.value})
    console.log(event.target.value);
  }

  render() {
    return (
      <div>
        <h1>Cloud DSP</h1>
        <div className={'col-4 my-2'}>
          <div className="custom-file my-2">
            <input type="file" className="custom-file-input" id="validatedCustomFile" onChange={this.handleUploadFile.bind(this)} required/>
            <label className="custom-file-label" htmlFor="validatedCustomFile">{this.state.fileLabel}</label>
            <div className="invalid-feedback">Example invalid custom file feedback</div>
          </div>
          <input className='form-control text-lg' onChange={this.handleFilename.bind(this)} placeholder={'filename'}/>
        </div>
        <button className={'btn btn-primary btn-dark mx-3'} onClick={this.upload.bind(this)}>Upload File</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
          contentLabel="Loading Modal"
          shouldCloseOnOverlayClick={false}
        >
          <div className={'text-center'} style={{ width: '200px' }}>
            {this.state.progress ? <CircularProgressbar
              percentage={this.state.progress}
              strokeWidth={2}/> : null
            }
          </div>
        </Modal>
      </div>
    );
  }
}
