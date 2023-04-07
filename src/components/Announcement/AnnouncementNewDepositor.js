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
      newDepositorAnnouncementConfig: {},
      previewImageUrl: null,
      imageUrlFileList: [],
      loadImageUrl: false
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
        let newDepositorAnnouncementConfig = {
          ...config['newDepositor.announcementConfig']
        };
        console.log(newDepositorAnnouncementConfig);
        this.setState({
          newDepositorAnnouncementConfig
        });
        if (newDepositorAnnouncementConfig.imageUrl) {
          this.copyImageUrl(newDepositorAnnouncementConfig.imageUrl);
        } else {
          this.setState({ loadImageUrl: true });
        }
        this.setState({ loaded: true });
      } else {
        this.setState({
          loaded: true,
          loadImageUrl: true
        });
      }
    });
  }

  copyImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewImageUrl: imageUrl,
      imageUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });
  }

  getImageUrl = data => {
    this.setState({
      imageUrl: data && data.id ? data.id : ''
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
        if (this.state.imageUrl === '') {
          message.error('Please upload the cover image');
          return;
        }
        let data = {
          newDepositorAnnouncementConfig: {
            show: values.show,
            headerText: values.headerText,
            bodyText: values.bodyText,
            buttonText: values.buttonText,
            imageUrl: this.state.cdnPath + this.state.imageUrl,
            validForMinutes: values.validForMinutes,
            cashbackPercentage: values.cashbackPercentage,
            maximumCashback: values.maximumCashback,
            referenceId: values.referenceId,
            description: values.description,
            offerName: values.offerName,
            minAmount: values.minAmount,
            toBalance: values.toBalance,
            source: values.source,
            noOfTimesToShow: values.noOfTimesToShow
          }
        };
        this.props.actions.setNewDepositAnnouncement(data).then(() => {
          if (this.props.setNewDepositorAnnouncementConfigResponse) {
            if (this.props.setNewDepositorAnnouncementConfigResponse.error) {
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
      headerText: isFieldTouched('headerText') && getFieldError('headerText'),
      bodyText: isFieldTouched('bodyText') && getFieldError('bodyText'),
      buttonText: isFieldTouched('buttonText') && getFieldError('buttonText'),
      imageUrl: isFieldTouched('imageUrl') && getFieldError('imageUrl'),
      validForMinutes:
        isFieldTouched('validForMinutes') && getFieldError('validForMinutes'),
      cashbackPercentage:
        isFieldTouched('cashbackPercentage') &&
        getFieldError('cashbackPercentage'),
      maximumCashback:
        isFieldTouched('maximumCashback') && getFieldError('maximumCashback'),
      referenceId:
        isFieldTouched('referenceId') && getFieldError('referenceId'),
      description:
        isFieldTouched('description') && getFieldError('description'),
      offerName: isFieldTouched('offerName') && getFieldError('offerName'),
      minAmount: isFieldTouched('minAmount') && getFieldError('minAmount'),
      toBalance: isFieldTouched('toBalance') && getFieldError('toBalance'),
      source: isFieldTouched('source') && getFieldError('source'),
      noOfTimesToShow:
        isFieldTouched('noOfTimesToShow') && getFieldError('noOfTimesToShow')
    };

    return (
      <React.Fragment>
        {this.state.loaded && (
          <Form onSubmit={this.handleSubmit}>
            <Card title={'Announcement Popup'}>
              <Card type="inner">
                <FormItem {...formItemLayout} label={'Show'}>
                  {getFieldDecorator('show', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .show,
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
                  validateStatus={errors.headerText ? 'error' : ''}
                  help={errors.headerText || ''}
                  {...formItemLayout}
                  label={'Header Text'}
                >
                  {getFieldDecorator('headerText', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .headerText,
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
                  validateStatus={errors.bodyText ? 'error' : ''}
                  help={errors.bodyText || ''}
                  {...formItemLayout}
                  label={'Body Text'}
                >
                  {getFieldDecorator('bodyText', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .bodyText,
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
                  validateStatus={errors.buttonText ? 'error' : ''}
                  help={errors.buttonText || ''}
                  {...formItemLayout}
                  label={'Button Text'}
                >
                  {getFieldDecorator('buttonText', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .buttonText,
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
                  validateStatus={errors.validForMinutes ? 'error' : ''}
                  help={errors.validForMinutes || ''}
                  {...formItemLayout}
                  label={'validForMinutes'}
                >
                  {getFieldDecorator('validForMinutes', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .validForMinutes,
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
                  validateStatus={errors.cashbackPercentage ? 'error' : ''}
                  help={errors.cashbackPercentage || ''}
                  {...formItemLayout}
                  label={'cashbackPercentage'}
                >
                  {getFieldDecorator('cashbackPercentage', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .cashbackPercentage,
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
                  validateStatus={errors.maximumCashback ? 'error' : ''}
                  help={errors.maximumCashback || ''}
                  {...formItemLayout}
                  label={'maximumCashback'}
                >
                  {getFieldDecorator('maximumCashback', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .maximumCashback,
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
                  validateStatus={errors.referenceId ? 'error' : ''}
                  help={errors.referenceId || ''}
                  {...formItemLayout}
                  label={'referenceId'}
                >
                  {getFieldDecorator('referenceId', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .referenceId,
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
                  validateStatus={errors.description ? 'error' : ''}
                  help={errors.description || ''}
                  {...formItemLayout}
                  label={'description'}
                >
                  {getFieldDecorator('description', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .description,
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
                  validateStatus={errors.offerName ? 'error' : ''}
                  help={errors.offerName || ''}
                  {...formItemLayout}
                  label={'offerName'}
                >
                  {getFieldDecorator('offerName', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .offerName,
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
                  validateStatus={errors.minAmount ? 'error' : ''}
                  help={errors.minAmount || ''}
                  {...formItemLayout}
                  label={'minAmount'}
                >
                  {getFieldDecorator('minAmount', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .minAmount,
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
                  validateStatus={errors.toBalance ? 'error' : ''}
                  help={errors.toBalance || ''}
                  {...formItemLayout}
                  label={'toBalance'}
                >
                  {getFieldDecorator('toBalance', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .toBalance,
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
                  validateStatus={errors.source ? 'error' : ''}
                  help={errors.source || ''}
                  {...formItemLayout}
                  label={'source'}
                >
                  {getFieldDecorator('source', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .source,
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
                  validateStatus={errors.noOfTimesToShow ? 'error' : ''}
                  help={errors.noOfTimesToShow || ''}
                  {...formItemLayout}
                  label={'noOfTimesToShow'}
                >
                  {getFieldDecorator('noOfTimesToShow', {
                    initialValue: this.state.newDepositorAnnouncementConfig
                      .noOfTimesToShow,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>

                {this.state.loadImageUrl && (
                  <ImageUploader
                    callbackFromParent={this.getImageUrl}
                    header={'Image URL'}
                    previewImage={this.state.previewImageUrl}
                    fileList={this.state.imageUrlFileList}
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
    setNewDepositorAnnouncementConfigResponse:
      state.announcement.setNewDepositorAnnouncementConfigResponse,
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
