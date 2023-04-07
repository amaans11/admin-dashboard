import React from 'react';
import { Row, Upload, Icon, Button, Modal } from 'antd';
import Axios from 'axios';

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: []
    };
  }

  componentDidMount() {
    if (this.props.fileUrl) {
      const fileList = [
        {
          uid: -1,
          status: 'done',
          url: this.props.fileUrl,
          name: this.props.fileUrl
        }
      ];
      this.setState({ fileList });
    }
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url,
      previewVisible: true
    });
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  returnToParent = (fileUrl, objectId, fileName) => {
    // objectId for S3 file key
    this.props.callbackFromParent(fileUrl, objectId, fileName);
  };

  beforeUpload = file => {
    const fileData = {
      contentType: file.type,
      extension:
        '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
    };

    const uploadReqUrl = this.props.uploadReqUrl;

    Axios.post(uploadReqUrl, fileData)
      .then(res => {
        const { uploadUrl, object } = res.data.payload;
        // Update file status to show loading
        const loadingFileList = this.state.fileList.map(fl => {
          if (fl.uid === file.uid) {
            fl.status = 'uploading';
          }
          return fl;
        });
        this.setState({ fileList: loadingFileList });

        // Upload file on upload URL
        fetch(uploadUrl, {
          body: file,
          method: 'PUT'
        })
          .then(result => {
            if (result.status === 200) {
              const fileURL = `${this.props.cdnPath}${object.id}`;
              const doneFileList = this.state.fileList.map(fl => {
                if (fl.uid === file.uid) {
                  fl.status = 'done';
                  fl.url = fileURL;
                  fl.name = file.name;
                }
                return fl;
              });

              this.setState({ fileList: doneFileList });
              this.returnToParent(fileURL, object.id, file.name);
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });

    return false;
  };

  handleRemove = file => {
    const fileList = this.state.fileList.filter(fl => fl.uid !== file.uid);
    this.setState({ fileList });
    this.returnToParent('', null, file.name);
    return true;
  };

  resetFileList = () => {
    this.setState({
      previewImage: '',
      fileList: []
    });
  };

  render() {
    const { fileType, accept } = this.props;
    let { previewImage, fileList } = this.state;
    const multiple = this.props.multiple || false;

    // If no files in state and a file url is coming from props
    // if (!fileList.length && this.props.fileUrl) {
    //   fileList = [
    //     {
    //       uid: -1,
    //       status: 'done',
    //       url: this.props.fileUrl,
    //       name: this.props.fileUrl
    //     }
    //   ];
    // }

    return (
      <Row>
        <Upload
          multiple={multiple}
          beforeUpload={this.beforeUpload}
          listType={fileType === 'image' ? 'picture-card' : ''}
          fileList={fileList}
          onPreview={fileType === 'image' ? this.handlePreview : null}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          accept={accept}
        >
          {/* {fileType !== 'image' ? (
            <Button icon="upload">Upload</Button>
          ) : !fileList.length || multiple ? (
            <div>
              <Icon type="upload" />
              <div className="ant-upload-text">Upload</div>
            </div>
          ) : null} */}
          {!fileList.length || multiple ? (
            fileType !== 'image' ? (
              <Button icon="upload">Upload</Button>
            ) : (
              <div>
                <Icon type="upload" />
                <div className="ant-upload-text">Upload</div>
              </div>
            )
          ) : null}
        </Upload>
        {fileType === 'image' ? (
          <Modal
            visible={this.state.previewVisible}
            footer={null}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            centered
          >
            <img
              alt="Image file preview"
              style={{ width: '100%' }}
              src={previewImage}
            />
          </Modal>
        ) : null}
      </Row>
    );
  }
}
