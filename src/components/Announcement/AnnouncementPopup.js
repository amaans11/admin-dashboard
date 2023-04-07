import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as announcementActions from '../../actions/announcementActions';
import * as websiteActions from '../../actions/websiteActions';
import {
  Card,
  Form,
  Button,
  Input,
  InputNumber,
  Radio,
  message,
  Row,
  Col,
  notification,
  DatePicker
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import ImageUploader from './ImageUploader';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AnnouncementNewDepositor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      popupAnnouncementConfig: {},
      previewCoverImage: null,
      coverImageFileList: [],
      loadCoverImage: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
    this.props.actions.getAnnouncementConfig().then(() => {
      if (this.props.getAnnouncementConfigResponse) {
        let config = JSON.parse(this.props.getAnnouncementConfigResponse)
          .config;
        let popupAnnouncementConfig = { ...config['popup.announcementConfig'] };
        console.log(popupAnnouncementConfig);
        this.setState({
          popupAnnouncementConfig
        });
        if (popupAnnouncementConfig.coverImage) {
          this.copyCoverImage(popupAnnouncementConfig.coverImage);
        } else {
          this.setState({ loadCoverImage: true });
        }
        this.setState({ loaded: true });
      } else {
        this.setState({
          loaded: true,
          loadCoverImage: true
        });
      }
    });
  }

  copyCoverImage(imageUrl) {
    let url = '';
    this.setState({
      previewCoverImage: imageUrl,
      coverImageFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });
  }

  getCoverImage = data => {
    this.setState({
      coverImage: data && data.id ? data.id : ''
    });
  };

  validateJson(e) {
    let val = e.target.value;
    if (val !== '') {
      try {
        JSON.parse(val);
        this.setState({ actionParamsJsonError: false });
        return;
      } catch (error) {
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topRight',
          top: 100
        });
        this.setState({ actionParamsJsonError: true });
        return;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.coverImage === '') {
          message.error('Please upload the cover image');
          return;
        }
        let data = {
          popupAnnouncementConfig: {
            show: values.show,
            id: values.id,
            expiryTime: (moment(values.expiryTime).unix() * 1000).toString(),
            title: values.title,
            message: values.message,
            coverImage: this.state.cdnPath + this.state.coverImage,
            CTA: values.CTA,
            action: values.action,
            actionParams: JSON.parse(values.actionParams)
          }
        };
        this.props.actions.setPopupAnnouncement(data).then(() => {
          if (this.props.setPopupAnnouncementConfigResponse) {
            if (this.props.setPopupAnnouncementConfigResponse.error) {
              message.error('Could not update');
            } else {
              message.success('Data Uploaded Successfully', 1.5).then(() => {
                window.location.reload();
              });
            }
          }
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      id: isFieldTouched('id') && getFieldError('id'),
      expiryTime: isFieldTouched('expiryTime') && getFieldError('expiryTime'),
      title: isFieldTouched('title') && getFieldError('title'),
      message: isFieldTouched('message') && getFieldError('message'),
      CTA: isFieldTouched('CTA') && getFieldError('CTA'),
      action: isFieldTouched('action') && getFieldError('action'),
      actionParams:
        (isFieldTouched('actionParams') && getFieldError('actionParams')) ||
        this.state.actionParamsJsonError
    };

    return (
      <React.Fragment>
        {this.state.loaded && (
          <Form onSubmit={this.handleSubmit}>
            <Card title={'Announcement Popup'}>
              <Card type="inner">
                <FormItem {...formItemLayout} label={'Show'}>
                  {getFieldDecorator('show', {
                    initialValue: this.state.popupAnnouncementConfig.show,
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ]
                  })(
                    <RadioGroup size="small" buttonStyle="solid">
                      <RadioButton value={true}>Yes</RadioButton>
                      <RadioButton value={false}>No</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.id ? 'error' : ''}
                  help={errors.id || ''}
                  {...formItemLayout}
                  label={'Id'}
                >
                  {getFieldDecorator('id', {
                    initialValue: this.state.popupAnnouncementConfig.id,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.expiryTime ? 'error' : ''}
                  help={errors.expiryTime || ''}
                  {...formItemLayout}
                  label={'Expiry Time'}
                >
                  {getFieldDecorator('expiryTime', {
                    initialValue: moment(
                      this.state.popupAnnouncementConfig.expiryTime,
                      'x'
                    ),
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'object'
                      }
                    ]
                  })(
                    <DatePicker
                      style={{ width: '50%' }}
                      showTime
                      allowClear="true"
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={'Select Date and time'}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.title ? 'error' : ''}
                  help={errors.title || ''}
                  {...formItemLayout}
                  label={'Title'}
                >
                  {getFieldDecorator('title', {
                    initialValue: this.state.popupAnnouncementConfig.title,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.message ? 'error' : ''}
                  help={errors.message || ''}
                  {...formItemLayout}
                  label={'Message'}
                >
                  {getFieldDecorator('message', {
                    initialValue: this.state.popupAnnouncementConfig.message,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.CTA ? 'error' : ''}
                  help={errors.CTA || ''}
                  {...formItemLayout}
                  label={'CTA'}
                >
                  {getFieldDecorator('CTA', {
                    initialValue: this.state.popupAnnouncementConfig.CTA,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.action ? 'error' : ''}
                  help={errors.action || ''}
                  {...formItemLayout}
                  label={'Action'}
                >
                  {getFieldDecorator('action', {
                    initialValue: this.state.popupAnnouncementConfig.action,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.actionParams ? 'error' : ''}
                  help={errors.actionParams || ''}
                  {...formItemLayout}
                  label={'Action Params'}
                >
                  {getFieldDecorator('actionParams', {
                    initialValue: JSON.stringify(
                      this.state.popupAnnouncementConfig.actionParams
                    ),
                    rules: [
                      {
                        required: true,
                        message:
                          'This is a mandatory field and should be in JSON!',
                        whitespace: true
                      }
                    ]
                  })(<TextArea onBlur={e => this.validateJson(e)} rows={3} />)}
                </FormItem>
                {this.state.loadCoverImage && (
                  <ImageUploader
                    callbackFromParent={this.getCoverImage}
                    header={'Cover Image'}
                    previewImage={this.state.previewCoverImage}
                    fileList={this.state.coverImageFileList}
                    isMandatory={true}
                  />
                )}
              </Card>
              <Row>
                <Col span={12} offset={12}>
                  <Button
                    style={{ float: 'none' }}
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAnnouncementConfigResponse:
      state.announcement.getAnnouncementConfigResponse,
    setPopupAnnouncementConfigResponse:
      state.announcement.setPopupAnnouncementConfigResponse,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...announcementActions, ...websiteActions },
      dispatch
    )
  };
}
const AnnouncementNewDepositorForm = Form.create()(AnnouncementNewDepositor);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementNewDepositorForm);
