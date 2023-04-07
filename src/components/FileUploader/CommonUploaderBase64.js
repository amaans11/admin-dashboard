import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Row,
  Col,
  Select,
  Radio,
  Button,
  Upload,
  Typography,
  Icon,
  message,
  Spin,
  notification
} from 'antd';
import * as websiteActions from '../../actions/websiteActions';
import * as storageActions from '../../actions/storageActions';

const Option = Select.Option;
const FormItem = Form.Item;
const { Dragger } = Upload;
const RadioGroup = Radio.Group;
const { Paragraph } = Typography;

const getFileSize = bytes => {
  if (String(bytes).length >= 10) {
    return `${Number(bytes / 1000000000).toFixed(2)} GB`;
  } else if (String(bytes).length >= 7) {
    return `${Number(bytes / 1000000).toFixed(2)} MB`;
  } else if (String(bytes).length >= 4) {
    return `${Number(bytes / 1000).toFixed(2)} KB`;
  } else {
    return `${bytes} bytes`;
  }
};
class CommonUploaderBase64 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaded: false,
      uploading: false,
      cdnPath: '',
      fileList: []
    };
  }

  componentDidMount() {
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        cdnPath = cdnPath.endsWith('/') ? cdnPath : cdnPath.concat('/');
        this.setState({ cdnPath });
      }
    });
  }
  uploadTypeSelected(value) {
    this.setState({ uploadType: value, uploaded: false });
  }

  imageCallback = data => {
    this.setState({
      imageUrl: data && data.id ? data.id : '',
      uploaded: true
    });
  };

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log('Error: ', error);
    };
  }

  handleBeforeUpload = file => {
    this.setState({
      uploaded: false,
      uploading: true
    });
    const extension =
      '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);
    let fileName = file.name.split(' ').join('-');
    fileName = fileName.substring(0, fileName.length - extension.length);
    let displayName = file.name.concat(` ( ${getFileSize(file.size)} ) `);
    if (file.size >= 1000000000) {
      this.setState({
        uploading: false,
        fileList: [
          {
            name: displayName,
            size: file.size,
            uid: file.uid,
            status: 'error'
          }
        ]
      });
      notification['error']({
        message: 'File Size Exceeded',
        description: `Can not upload file size greater than 1 GB.\n Current file Size: ${Number(
          Number(file.size) / 1000000000
        ).toFixed(2)} GB`,
        placement: 'topLeft'
      });
      return false;
    }
    this.setState({
      fileList: [
        {
          name: displayName,
          size: file.size,
          uid: file.uid,
          status: 'uploading'
        }
      ]
    });

    let base64 = '';

    this.getBase64(file, result => {
      base64 = result;
      console.log(result);
      let data = {
        fileName: fileName,
        base64: base64
      };
      console.log(data);
      this.props.actions.getCommonUploadBase64Url(data).then(() => {
        if (this.props.getCommonUploadBase64UrlResponse) {
          const { error, object } = this.props.getCommonUploadBase64UrlResponse;
          if (!error) {
            this.setState({
              uploadedObj: object,
              uploaded: true,
              uploading: false,
              fileList: [
                {
                  name: displayName,
                  size: file.size,
                  uid: file.uid,
                  status: 'done'
                }
              ]
            });
          }
        }
      });
    });

    return false;
  };

  onChange = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
      message.loading('uploading file');
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  render() {
    const props = {
      name: 'file',
      multiple: false,
      beforeUpload: this.handleBeforeUpload,
      fileList: this.state.fileList,
      showUploadList: {
        showRemoveIcon: false
      }
    };
    return (
      <React.Fragment>
        <Card style={{ margin: 40 }} title={'Upload the files here'}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Card>
        {this.state.uploaded ? (
          <Card
            style={{ margin: 40, marginTop: 20 }}
            title={'Uploaded File Info'}
          >
            <Typography>
              <p>Key:</p>
              <Paragraph copyable={true}>{this.state.uploadedObj.id}</Paragraph>
              <p style={{ marginTop: 8 }}>Full URL:</p>
              <Paragraph copyable={true}>
                {this.state.cdnPath.concat(this.state.uploadedObj.id)}
              </Paragraph>
            </Typography>
          </Card>
        ) : this.state.uploading ? (
          <Row type="flex" justify="center">
            <Card>
              <Spin />
            </Card>
          </Row>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCommonUploadBase64UrlResponse:
      state.tournaments.getCommonUploadBase64UrlResponse,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...websiteActions, ...storageActions },
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonUploaderBase64);
