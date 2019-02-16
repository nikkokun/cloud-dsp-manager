import React from 'react';
import { Image, Transformation } from 'cloudinary-react';

export default (props) => (
  <div id="gallery">
    {props.images.map(publicId => (
      <Image
        publicId={publicId}
        responsive
        secure
      >
        <Transformation
          crop="scale"
          width="150"
        />
      </Image>
    ))}
  </div>
);
