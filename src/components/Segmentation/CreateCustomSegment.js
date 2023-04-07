// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  message,
  Upload
} from 'antd';
import moment from 'moment';
import * as segmentationActions from '../../actions/segmentationActions';
import UploadCustomSegment from './UploadCustomSegment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const UploadStatus = [
  'FILE_NOT_UPLOADED',
  'FILE_UPLOADED',
  'FILE_UPLOAD_FAILED',
  'FILE_UPLOAD_NOT_SUPPORTED'
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class CreateCustomSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      segmentName: '',
      description: '',
      startTime: null,
      endTime: null,
      showUploadSection: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    window.scrollTo(0, 0);
    if (this.props.customSegmentDetails) {
      console.log(this.props.customSegmentDetails);
      if (this.props.customSegmentDetails.actionType === 'UPLOAD') {
        this.setState(
          {
            segmentId: this.props.customSegmentDetails.record.segmentId,
            segmentName: this.props.customSegmentDetails.record.segmentName
          },
          () => {
            this.setState({ showUploadSection: true });
          }
        );
      } else if (this.props.customSegmentDetails.actionType === 'EDIT') {
        this.setState(
          {
            segmentId: this.props.customSegmentDetails.record.segmentId,
            fileUploadStatus: this.props.customSegmentDetails.record
              .fileUploadStatus
              ? UploadStatus[
                  this.props.customSegmentDetails.record.fileUploadStatus
                ]
              : UploadStatus[0],
            priority: this.props.customSegmentDetails.record.priority
              ? this.props.customSegmentDetails.record.priority
              : 0,
            isActive: this.props.customSegmentDetails.record.isActive
              ? this.props.customSegmentDetails.record.isActive
              : false
          },
          () => {
            this.props.form.setFieldsValue({
              segmentName: this.props.customSegmentDetails.record.segmentName,
              description: this.props.customSegmentDetails.record.description,
              timeArray: [
                moment(this.props.customSegmentDetails.record.startTime, 'x'),
                moment(this.props.customSegmentDetails.record.endTime, 'x')
              ]
            });
          }
        );
      } else {
        this.setState({ showUploadSection: false });
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.clearForm();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (
          this.props.customSegmentDetails &&
          this.props.customSegmentDetails.actionType === 'EDIT'
        ) {
          let editData = {
            segmentId: this.state.segmentId,
            segmentName: values.segmentName,
            description: values.description,
            priority: this.state.priority,
            fileUploadStatus: this.state.fileUploadStatus,
            isActive: this.state.isActive,
            startTime: moment(values.timeArray[0]).unix() * 1000,
            endTime: moment(values.timeArray[1]).unix() * 1000
          };
          this.props.actions.updateCustomSegment(editData).then(() => {
            if (this.props.updateCustomSegmentResponse) {
              if (this.props.updateCustomSegmentResponse.error) {
                message.error(
                  this.props.updateCustomSegmentResponse.error.message
                    ? this.props.updateCustomSegmentResponse.error.message
                    : 'Could not update custom segment'
                );
              } else {
                message
                  .success('Segment updated successfully', 1.5)
                  .then(() => {
                    this.props.history.push('list');
                  });
              }
            }
          });
        } else {
          let data = {
            segmentName: values.segmentName,
            description: values.description,
            startTime: moment(values.timeArray[0]).unix() * 1000,
            endTime: moment(values.timeArray[1]).unix() * 1000
          };
          this.props.actions.createCustomSegment(data).then(() => {
            if (this.props.createCustomSegmentResponse) {
              if (this.props.createCustomSegmentResponse.error) {
                message.error(
                  this.props.createCustomSegmentResponse.error.message
                    ? this.props.createCustomSegmentResponse.error.message
                    : 'Could not create custom segment'
                );
              } else {
                this.setState(
                  {
                    segmentId: this.props.createCustomSegmentResponse.segmentId,
                    segmentName: this.props.createCustomSegmentResponse
                      .segmentName
                  },
                  () => {
                    this.setState({ showUploadSection: true });
                  }
                );
              }
            }
          });
        }
      }
    });
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
      segmentName:
        isFieldTouched('segmentName') && getFieldError('segmentName'),
      description:
        isFieldTouched('description') && getFieldError('description'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray')
    };

    return (
      <React.Fragment>
        {!this.state.showUploadSection && (
          <Form onSubmit={this.handleSubmit}>
            <Card title="Create Custom Segment">
              <FormItem
                validateStatus={errors.segmentName ? 'error' : ''}
                help={errors.segmentName || ''}
                {...formItemLayout}
                label={'Segment Name'}
              >
                {getFieldDecorator('segmentName', {
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message:
                        'Name should not contain space or special characters. Only _ is allowed',
                      pattern: /^\w+$/
                    }
                  ]
                })(<Input style={{ width: '70%' }} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.description ? 'error' : ''}
                help={errors.description || ''}
                {...formItemLayout}
                label={<span>Description</span>}
              >
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      whitespace: true
                    }
                  ]
                })(<TextArea style={{ width: '70%' }} rows={3} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.timeArray ? 'error' : ''}
                help={errors.timeArray || ''}
                {...formItemLayout}
                label={<span>Duration For Segment</span>}
              >
                {getFieldDecorator('timeArray', {
                  rules: [
                    {
                      required: true,
                      type: 'array',
                      message: 'Please input time duration!',
                      whitespace: false
                    }
                  ]
                })(
                  <RangePicker
                    style={{ width: '70%' }}
                    allowClear="true"
                    showTime={{ format: 'hh:mm A', use12Hours: true }}
                    format="YYYY-MM-DD hh:mm:ss A"
                    placeholder={['Start Time', 'End Time']}
                  />
                )}
              </FormItem>
              <Row type="flex" justify="center">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Card>
          </Form>
        )}

        {this.state.showUploadSection && (
          <Card>
            <UploadCustomSegment
              segmentId={this.state.segmentId}
              segmentName={this.state.segmentName}
            />
          </Card>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    createCustomSegmentResponse: state.segmentation.createCustomSegmentResponse,
    customSegmentDetails: state.segmentation.customSegmentDetails,
    updateCustomSegmentResponse: state.segmentation.updateCustomSegmentResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...segmentationActions }, dispatch)
  };
}

const CreateCustomSegmentForm = Form.create()(CreateCustomSegment);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCustomSegmentForm);
