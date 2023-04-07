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
import ImageUploader from './ImageUploader';
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
      uploadType: 'IMAGE' // Or SEGMENT FiLE
    };
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

  segmentUrlCallback = data => {
    this.setState({ customSegmentFilePath: data.id, uploaded: true });
  };

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

    const errors = {
      uploadType: isFieldTouched('uploadType') && getFieldError('uploadType')
    };

    return (
      <React.Fragment>
        <Form>
          <Card bordered={false} title="User Details">
            <FormItem {...formItemLayout} label={'Upload Type'}>
              {getFieldDecorator('uploadType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: this.state.uploadType
              })(
                <RadioGroup
                  name="uploadType"
                  onChange={e => this.uploadTypeSelected(e.target.value)}
                >
                  <Radio value={'IMAGE'}>Upload Image</Radio>
                  <Radio value={'SEGMENT'}>Upload Custom Segment File</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {this.state.uploadType === 'IMAGE' && (
              <Row>
                <Col span={24} offset={8}>
                  <ImageUploader
                    callbackFromParent={this.imageCallback}
                    header={'Upload Image'}
                    actions={this.props.actions}
                    isMandatory={true}
                  />
                </Col>
              </Row>
            )}
            {this.state.uploadType === 'SEGMENT' && (
              <Row>
                <Col span={24} offset={8}>
                  <UploadSegment callbackFromParent={this.segmentUrlCallback} />
                </Col>
              </Row>
            )}
            {this.state.uploaded && (
              <Paragraph
                style={{
                  marginTop: '10px',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
                copyable
              >
                {this.state.uploadType === 'SEGMENT'
                  ? this.state.customSegmentFilePath
                  : this.state.imageUrl}
              </Paragraph>
            )}
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
    closeAudioRoomResponse: state.audioRoom.closeAudioRoomResponse
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(
//       { ...userProfileActions, ...audioActions },
//       dispatch
//     )
//   };
// }

const FileUploaderForm = Form.create()(FileUploader);
export default connect(
  mapStateToProps
  // mapDispatchToProps
)(FileUploaderForm);
