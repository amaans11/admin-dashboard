// @flow

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
  message,
  Typography
} from 'antd';
import * as superteamCricketFeedActions from '../../actions/SuperteamCricketFeedActions';
import UploadSegment from './UploadSegment';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Paragraph } = Typography;

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaded: false,
      uploadedCS: false,
      fileList1: true,
      fileList2: true
    };
  }

  segmentUrlCallback = data => {
    this.setState({ customSegmentFilePath: data.id, uploaded: true });
  };
  segmentCSUrlCallback = data => {
    this.setState({ customSegmentCSFilePath: data.id, uploadedCS: true });
  };

  handleSubmitC1(e) {
    e.preventDefault();

    this.props.actions
      .processC1FileForAsssistant({
        filePath: this.state.customSegmentFilePath
      })
      .then(() => {
        message.success('Uploaded');
        this.setState({ fileList1: false, uploaded: false });
        this.setState({ fileList1: true });
      });
  }
  handleSubmitC40(e) {
    e.preventDefault();
    this.props.actions
      .processC40FileForAsssistant({
        filePath: this.state.customSegmentCSFilePath
      })
      .then(() => {
        message.success('Uploaded');
        this.setState({ fileList2: false, uploadedCS: false });
        this.setState({ fileList2: true });
      });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    return (
      <React.Fragment>
        <Form onSubmit={e => this.handleSubmitC1(e)}>
          <Card bordered={false} title="C1 File Asssistant">
            <FormItem {...formItemLayout} label={' Type'}>
              {getFieldDecorator('uploadType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: this.state.uploadType
              })(
                <RadioGroup name="uploadType">
                  <span>Upload C1 File Asssistant</span>
                </RadioGroup>
              )}
            </FormItem>

            <Row>
              <Col span={24} offset={8}>
                {this.state.fileList1 == true ? (
                  <UploadSegment callbackFromParent={this.segmentUrlCallback} />
                ) : (
                  ''
                )}
              </Col>
            </Row>

            {this.state.uploaded && (
              <Paragraph
                style={{
                  marginTop: '10px',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
                copyable
              >
                {this.state.customSegmentFilePath}
              </Paragraph>
            )}
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Card>
        </Form>
        <Form onSubmit={e => this.handleSubmitC40(e)}>
          <Card bordered={false} title="CS40 File Asssistant">
            <FormItem {...formItemLayout} label={'Type'}>
              {getFieldDecorator('uploadType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: this.state.uploadType
              })(
                <RadioGroup name="uploadType">
                  <span>Upload CS40 File Asssistant</span>
                </RadioGroup>
              )}
            </FormItem>

            <Row>
              <Col span={24} offset={8}>
                {this.state.fileList2 == true ? (
                  <UploadSegment
                    callbackFromParent={this.segmentCSUrlCallback}
                  />
                ) : (
                  ''
                )}
              </Col>
            </Row>

            {this.state.uploadedCS && (
              <Paragraph
                style={{
                  marginTop: '10px',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
                copyable
              >
                {this.state.customSegmentCSFilePath}
              </Paragraph>
            )}
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    suggestUsersResponse: state.userProfile.suggestUsersResponse,
    searchUsersResponse: state.userProfile.searchUsersResponse,
    closeAudioRoomResponse: state.audioRoom.closeAudioRoomResponse,
    processC1FileForAsssistantResponse:
      state.superteamCricketFeed.processC1FileForAsssistantResponse,
    processC40FileForAsssistantResponse:
      state.superteamCricketFeed.processC40FileForAsssistantResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamCricketFeedActions }, dispatch)
  };
}

const FileUploaderForm = Form.create()(FileUploader);
export default connect(mapStateToProps, mapDispatchToProps)(FileUploaderForm);
