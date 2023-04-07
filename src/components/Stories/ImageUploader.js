import React from 'react';
import { Row, Upload, Modal, Icon } from 'antd';
import axios from 'axios';
import { INT_API_URL } from '../../shared/actionTypes';

export default class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      loading: false,
      fileList: []
    };
  }

  componentDidMount() {
    if (this.props.previewImage) {
      this.setState({
        previewImage: this.props.previewImage,
        fileList: [
          {
            uid: -1,
            status: 'done',
            url: this.props.previewImage
          }
        ]
      });
    }
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  returnToParent = () => {
    this.props.callbackFromParent(this.state.imageObject);
  };

  beforeUpload = file => {
    // File type/extention validation
    // if (file.type !== `image/${this.props.imageType}`) {
    //   message.error(`Please upload a image/${this.props.imageType} file!`);
    //   return false;
    // }

    // File size validation
    // if (file.size > this.props.sizeInBytes) {
    //   message.error(
    //     `Image size is too big! Allowed:
    //     ${Math.ceil(this.props.sizeInBytes / 1024)}KB`
    //   );
    //   return false;
    // }

    // TODO: Image resolution (width*height) validation
    // let img = new Image();
    // img.src = window.URL.createObjectURL(file);
    // img.onload = () => {
    //   if (img.width === this.props.width && img.height === this.props.height) {
    //     // zTODO: upload logic here
    //   } else {
    //     message.error(
    //       `Invalid resolution. It's ${img.width} x ${img.height} but
    //       we require ${this.props.width} x ${this.props.height} size image.`
    //     );
    //     return false;
    //   }
    // };

    const fileData = {
      contentType: file.type,
      extension:
        '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
    };

    // TODO: refactor below if possible
    axios
      .post(INT_API_URL + `api/asn/stories/music-category-icon-url`, fileData)
      .then(res => {
        const { uploadUrl, object } = res.data.payload;

        // Upload file on upload URL
        fetch(uploadUrl, {
          body: file,
          method: 'PUT'
        })
          .then(result => {
            if (result.status === 200) {
              const fileURL = `${this.props.cdnPath}${object.id}`;
              let fileName = object.id.split('/');
              fileName = fileName[fileName.length - 1];
              this.setState({
                imageObject: object,
                loading: false,
                file,
                fileList: [
                  {
                    size: file.size,
                    uid: file.uid,
                    name: fileName,
                    status: 'done',
                    url: fileURL
                  }
                ]
              });
              this.returnToParent();
            }
            this.setState({ loading: false });
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      });

    return false;
  };

  render() {
    return (
      <Row>
        <strong>{this.props.header}</strong>
        <Upload
          multiple={false}
          beforeUpload={this.beforeUpload}
          listType="picture-card"
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {this.state.fileList.length >= 1 ? null : (
            <div>
              <Icon type="upload" />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={this.state.previewImage}
          />
        </Modal>
      </Row>
    );
  }
}
