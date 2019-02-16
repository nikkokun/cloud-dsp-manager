import React, { Component } from 'react';
import { CloudinaryContext, Image, Transformation } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import cloudinaryConfig from './cloudinary-config.js';
const cloudinaryCore = new cloudinary.Cloudinary(cloudinaryConfig);
import Uploader from './uploader/Uploader';
import Header from '../common/Header';
import {
  Typography,
} from '@material-ui/core';

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   let formReference = React.createRef();
  //   const userId = parseInt(this.props.match.params.id);
  //
  //   this.setState({
  //     form: <Form
  //       parent={this}
  //       ref={formReference}
  //     />,
  //     formRef: formReference,
  //     userId: userId
  //   });
  //
  //   if (userId > -1) {
  //     this.executeQuery(userId);
  //   }
  // }

  render() {
    return (
      <body>
        <Header/>
        <Typography variant="display1">Welcome Home!</Typography>
        <CloudinaryContext cloudName={cloudinaryConfig.cloud_name}>
          <Uploader />
        </CloudinaryContext>
      </body>
    );
  }
}
