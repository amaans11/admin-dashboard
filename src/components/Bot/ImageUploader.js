import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Upload, Modal, Icon, Typography } from 'antd';
import * as storageActions from '../../actions/storageActions';
import axios from 'axios';
import { INT_API_URL } from '../../shared/actionTypes';
import { convertByteToSize } from '../../shared/util';

const { Paragraph } = Typography;

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      loading: false,
      fileList: [],
      imageSize: null
    };
    this.isLoading = this.isLoading.bind(this);
  }
  componentDidMount() {
    if (this.props.previewImage && this.props.fileList) {
      this.setState({
        previewImage: this.props.previewImage,
        fileList: [...this.props.fileList]
      });
      axios
        .post(INT_API_URL + 'api/storage/image-size-by-url', {
          url: this.props.previewImage
        })
        .then(res => {
          if (res.data.payload && res.data.payload.imageSize) {
            this.setState({
              imageSize: res.data.payload.imageSize
            });
          }
        })
        .catch(e => console.error(e));
    }
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleRemove = ({ fileList }) => {
    this.setState({ imageObject: null, imageSize: null }, () =>
      this.returnToParent()
    );
  };

  returnToParent = () => {
    this.props.callbackFromParent(this.state.imageObject);
  };

  isLoading(param) {
    this.props.isLoading(param);
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const beforeUpload = file => {
      this.isLoading(true);
      let imageData = {
        contentType: file.type,
        extension:
          '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      this.setState({
        imageSize: convertByteToSize(file.size)
      });
      this.props.actions.getBotUploadImageUrl(imageData).then(() => {
        fetch(this.props.getBotImageUploadUrlResponse.uploadUrl, {
          body: file,
          method: 'PUT'
        }).then(result => {
          if (result.status === 200) {
            this.setState({
              imageObject: this.props.getBotImageUploadUrlResponse.object,
              loading: false,
              file
            });
            this.isLoading(false);
            this.returnToParent();
          }
        });
      });
      return false;
    };
    return (
      <React.Fragment>
        <Row>
          {this.props.isMandatory && (
            <span
              style={{
                fontSize: '14px',
                color: '#f5222d',
                marginRight: '4px',
                fontFamily: 'SimSun, sans-serif'
              }}
            >
              *
            </span>
          )}
          <strong>{this.props.header}</strong>
          <Upload
            multiple={false}
            beforeUpload={beforeUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.handleRemove}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
              </div>
            )}
          </Upload>
          {this.state.imageSize ? (
            <Typography>
              <Paragraph>size: {this.state.imageSize}</Paragraph>
            </Typography>
          ) : (
            ''
          )}
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    getBotImageUploadUrlResponse:
      state.notification.getBotImageUploadUrlResponse
  };
}
//
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...storageActions }, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader);
