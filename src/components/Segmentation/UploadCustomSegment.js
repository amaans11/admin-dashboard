// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Card, Form, Button, Upload, Icon, message, Spin } from 'antd';
import moment from 'moment';
import * as segmentationActions from '../../actions/segmentationActions';

const { Dragger } = Upload;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class UploadCustomSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      segmentId: '',
      fileUploading: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({
      segmentId: this.props.segmentId,
      segmentName: this.props.segmentName
    });
  }

  beforeUpload = file => {
    this.setState({ fileUploading: true });
    var datetime = moment().format('YYYYMMDDHHmm');
    let segmentName = this.state.segmentName.replace(/ /g, '_');
    let fileName = segmentName + '_' + datetime;
    let extension =
      '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);
    let data = {
      fileName: fileName,
      extension: extension,
      contentType: file.type
    };
    this.props.actions.getCustomSegmentUploadUrl(data).then(() => {
      fetch(this.props.getCustomSegmentUploadUrlResponse.uploadUrl, {
        method: 'PUT',
        body: file
      })
        .then(result => {
          if (result.status === 200) {
            this.setState({
              uploadObj: this.props.getCustomSegmentUploadUrlResponse.object,
              fileUploading: false,
              file: file,
              fileUploaded: true
            });
          } else {
            message.error('Error while uploading the file in S3');
            this.setState({ fileUploading: false });
          }
        })
        .catch(error => {
          console.log(error);
          message.error('Could not upload the file in S3');
        });
    });
    return false;
  };

  sendUploadSegmentRequest() {
    let data = {
      segmentId: this.state.segmentId,
      segmentUploadUrl: this.state.uploadObj.id
    };
    this.props.actions.uploadCustomSegment(data).then(() => {
      if (this.props.uploadCustomSegmentResponse) {
        if (this.props.uploadCustomSegmentResponse.error) {
          message.error(
            this.props.uploadCustomSegmentResponse.error.message
              ? this.props.uploadCustomSegmentResponse.error.message
              : 'Could not upload file'
          );
        } else {
          message.success('Successfully uploaded csv file', 1.5).then(() => {
            this.props.history.push('list');
          });
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Spin spinning={this.state.fileUploading}>
          <Card title={this.state.segmentId}>
            <Dragger
              multiple={false}
              accept={'text/csv'}
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag Game Config to this area to upload
              </p>
            </Dragger>
            {this.state.fileUploaded && (
              <Button
                onClick={() => this.sendUploadSegmentRequest()}
                type="primary"
              >
                Save and Publish
              </Button>
            )}
          </Card>
        </Spin>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    uploadCustomSegmentResponse: state.segmentation.uploadCustomSegmentResponse,
    getCustomSegmentUploadUrlResponse:
      state.segmentation.getCustomSegmentUploadUrlResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...segmentationActions }, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadCustomSegment)
);
