// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationActions from '../../actions/notificationActions';
import {
  Card,
  Form,
  Button,
  message,
  Select,
  Input,
  Row,
  Col,
  InputNumber
} from 'antd';
import ImageUploader from './ImageUploader';
import CSVReader from 'react-csv-reader';
import * as websiteActions from '../../actions/websiteActions';
import * as userProfileActions from '../../actions/UserProfileActions';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Meta } = Card;

const templateList = [
  <Option key="TEXT" value="TEXT">
    TEXT
  </Option>,
  <Option key="IMAGE" value="IMAGE">
    IMAGE
  </Option>,
  <Option key="IMAGE_TEXT" value="IMAGE_TEXT">
    IMAGE_TEXT
  </Option>,
  <Option key="ANNOUNCEMENT_SMALL" value="ANNOUNCEMENT_SMALL">
    ANNOUNCEMENT_SMALL
  </Option>,
  <Option key="ANNOUNCEMENT_BIG_TWO_BUTTON" value="ANNOUNCEMENT_BIG_TWO_BUTTON">
    ANNOUNCEMENT_BIG_TWO_BUTTON
  </Option>,
  <Option key="ANNOUNCEMENT_BIG_ONE_BUTTON" value="ANNOUNCEMENT_BIG_ONE_BUTTON">
    ANNOUNCEMENT_BIG_ONE_BUTTON
  </Option>
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class BotMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      botType: null,
      messageType: null,
      template: null,
      isPrimaryButtonDeeplinkVerified: true,
      isSecondaryButtonDeeplinkVerified: true,
      imageLoading: false,
      fileRead: false,
      fileList: [],
      imageUrl: ''
    };
  }
  componentDidMount() {
    this.props.form.validateFields();
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
    this.props.actions.getBotTypes().then(() => {
      if (this.props.getBotTypesResponse) {
        let botTypeObj = JSON.parse(this.props.getBotTypesResponse).bots;
        let botTypes = Object.keys(botTypeObj);
        let botTypeOptions = [];
        botTypes.map(item => {
          botTypeOptions.push(
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        });
        this.setState({ botTypeOptions, botTypeObj });
      }
    });
  }

  setTemplate(value) {
    if (value === 'TEXT') {
      this.setState({
        messageType: 'BOT_MESSAGE',
        template: value
      });
    } else {
      this.setState({
        messageType: 'BOT_MESSAGE_CARD',
        template: value
      });
    }
  }

  jsonCheck(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      message.error('Invalid JSON object', 1);
      return false;
    }
  }

  verifyJsonInput(value, buttonType) {
    let isJsonFlag = this.jsonCheck(value);
    switch (buttonType) {
      case 'PRIMARY_BUTTON':
        this.setState({ isPrimaryButtonDeeplinkVerified: isJsonFlag });
        break;
      case 'SECONDARY_BUTTON':
        this.setState({ isSecondaryButtonDeeplinkVerified: isJsonFlag });
        break;
      default:
        break;
    }
  }

  getImageUrl = data => {
    this.setState({
      imageUrl: data && data.id ? data.id : ''
    });
  };

  isImageLoading = data => {
    this.setState({
      imageLoading: data
    });
  };

  handleFileUpload(data) {
    let phoneNumbers = [];
    data.forEach(element => {
      if (element && element[0] && element[0] !== '') {
        phoneNumbers.push('+' + element[0]);
      }
    });
    let inputData = {
      numbers: [...phoneNumbers]
    };
    this.props.actions.getLinkedAccounts(inputData).then(() => {
      if (
        this.props.getLinkedAccountsResponse &&
        this.props.getLinkedAccountsResponse.linkedAccountDetails &&
        this.props.getLinkedAccountsResponse.linkedAccountDetails.length > 0
      ) {
        let userIds = this.props.getLinkedAccountsResponse.linkedAccountDetails.map(
          item => item.id
        );
        this.setState({ userIds: [...userIds] });
      } else {
        message.error('No valid phone numbers');
      }
    });

    this.setState({
      fileRead: true,
      phoneNumbers: [...phoneNumbers]
    });
  }

  sendToSingleUser() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!values.userId) {
          message.error(
            'User Id needs to be entered for sending notification to single user'
          );
          return;
        }
        let userIds = [];
        userIds.push(values.userId);
        if (values.template !== 'TEXT' && this.state.imageUrl === '') {
          message.error(
            'Please upload image before proceeding for any template except for TEXT'
          );
          return;
        }
        let primaryButton = {};
        let secondaryButton = {};
        if (
          values.template === 'ANNOUNCEMENT_SMALL' ||
          values.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON' ||
          values.template === 'ANNOUNCEMENT_BIG_ONE_BUTTON'
        ) {
          primaryButton = {
            label: values.primaryButtonLabel,
            deeplink: JSON.parse(values.primaryButtonDeeplink)
          };
        }
        if (values.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON') {
          secondaryButton = {
            label: values.secondaryButtonLabel,
            deeplink: JSON.parse(values.secondaryButtonDeeplink)
          };
        }

        let data = {
          imageUrl: this.state.imageUrl ? this.state.imageUrl : '',
          template: values.template,
          botId: values.botType,
          botName: this.state.botTypeObj[values.botType]['botName'],
          messageType: this.state.messageType,
          title: values.title ? values.title : '',
          message: values.message ? values.message : '',
          userIds: userIds,
          primaryButton: { ...primaryButton },
          secondaryButton: { ...secondaryButton }
        };
        this.props.actions.sendBotNotification(data).then(() => {
          if (
            this.props.sendBotMessageResponse &&
            this.props.sendBotMessageResponse.success
          ) {
            message.success('Successfully sent notification');
          } else {
            message.error('Could not send notification');
          }
        });
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.state.fileRead) {
          message.error('Please upload file with list of userId');
          return;
        }
        if (this.state.userIds.length < 1) {
          message.error('Please upload file with at least one user');
          return;
        }
        if (values.template !== 'TEXT' && this.state.imageUrl === '') {
          message.error(
            'Please upload image before proceeding for any template except for TEXT'
          );
          return;
        }
        let primaryButton = {};
        let secondaryButton = {};
        if (
          values.template === 'ANNOUNCEMENT_SMALL' ||
          values.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON' ||
          values.template === 'ANNOUNCEMENT_BIG_ONE_BUTTON'
        ) {
          primaryButton = {
            label: values.primaryButtonLabel,
            deeplink: JSON.parse(values.primaryButtonDeeplink)
          };
        }
        if (values.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON') {
          secondaryButton = {
            label: values.secondaryButtonLabel,
            deeplink: JSON.parse(values.secondaryButtonDeeplink)
          };
        }
        let userIds = [...this.state.userIds];
        let data = {
          imageUrl: this.state.imageUrl ? this.state.imageUrl : '',
          template: values.template,
          botId: values.botType,
          botName: this.state.botTypeObj[values.botType]['botName'],
          messageType: this.state.messageType,
          title: values.title ? values.title : '',
          message: values.message ? values.message : '',
          userIds: userIds,
          primaryButton: { ...primaryButton },
          secondaryButton: { ...secondaryButton }
        };

        this.props.actions.sendBotNotification(data).then(() => {
          if (
            this.props.sendBotMessageResponse &&
            this.props.sendBotMessageResponse.success
          ) {
            message.success('Successfully sent notification');
          } else {
            message.error('Could not send notification');
          }
        });
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const errors = {
      botType: isFieldTouched('botType') && getFieldError('botType'),
      template: isFieldTouched('template') && getFieldError('template'),
      // actionParams:
      //   isFieldTouched('actionParams') && getFieldError('actionParams'),
      title: isFieldTouched('title') && getFieldError('title'),
      message: isFieldTouched('message') && getFieldError('message'),
      primaryButtonLabel:
        isFieldTouched('primaryButtonLabel') &&
        getFieldError('primaryButtonLabel'),
      primaryButtonDeeplink:
        isFieldTouched('primaryButtonDeeplink') &&
        getFieldError('primaryButtonDeeplink'),
      secondaryButton:
        isFieldTouched('secondaryButton') && getFieldError('secondaryButton'),
      userId: isFieldTouched('userId') && getFieldError('userId')
    };
    return (
      <React.Fragment>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Card type="inner">
              <Row>
                <Col span={12}>
                  <FormItem
                    validateStatus={errors.botType ? 'error' : ''}
                    help={errors.botType || ''}
                    {...formItemLayout}
                    label={'Bot Type'}
                  >
                    {getFieldDecorator('botType', {
                      rules: [
                        {
                          required: true,
                          message: 'Mandatory field!',
                          whitespace: false
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        style={{ width: '70%' }}
                        placeholder="Select a bot type"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.botTypeOptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.template ? 'error' : ''}
                    help={errors.template || ''}
                    {...formItemLayout}
                    label={'Template'}
                  >
                    {getFieldDecorator('template', {
                      rules: [
                        {
                          required: true,
                          message: 'Mandatory field!',
                          whitespace: false
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        onSelect={e => this.setTemplate(e)}
                        style={{ width: '70%' }}
                        placeholder="Select a template"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {templateList}
                      </Select>
                    )}
                  </FormItem>
                  {(this.state.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON' ||
                    this.state.template === 'ANNOUNCEMENT_BIG_ONE_BUTTON') && (
                    <FormItem
                      validateStatus={errors.title ? 'error' : ''}
                      help={errors.title || ''}
                      {...formItemLayout}
                      label={'Title'}
                    >
                      {getFieldDecorator('title', {
                        rules: [
                          {
                            required: true,
                            message: 'Mandatory field!',
                            whitespace: true
                          }
                        ]
                      })(<Input style={{ width: '70%' }} />)}
                    </FormItem>
                  )}
                  {this.state.template && this.state.template !== 'IMAGE' && (
                    <FormItem
                      validateStatus={errors.message ? 'error' : ''}
                      help={errors.message || ''}
                      {...formItemLayout}
                      label={'Message'}
                    >
                      {getFieldDecorator('message', {
                        rules: [
                          {
                            required: true,
                            message: 'Mandatory field!',
                            whitespace: true
                          }
                        ]
                      })(<Input style={{ width: '70%' }} />)}
                    </FormItem>
                  )}
                </Col>
                <Col span={12}>
                  {this.state.template === 'TEXT' && (
                    <Card type="inner">
                      <div>
                        {' '}
                        {getFieldValue('message')
                          ? getFieldValue('message')
                          : 'Small Text Example'}
                      </div>
                    </Card>
                  )}
                  {this.state.template === 'IMAGE' && (
                    <Card
                      type="inner"
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        <img
                          alt="example"
                          src={
                            this.state.imageUrl !== ''
                              ? this.state.cdnPath + this.state.imageUrl
                              : 'https://akedge.""/pb/static/referral/refer_earn_screen_banner.png'
                          }
                        />
                      }
                    ></Card>
                  )}
                  {this.state.template === 'IMAGE_TEXT' && (
                    <Card
                      type="inner"
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        <img
                          alt="example"
                          src={
                            this.state.imageUrl !== ''
                              ? this.state.cdnPath + this.state.imageUrl
                              : 'https://akedge.""/pb/static/referral/refer_earn_screen_banner.png'
                          }
                        />
                      }
                    >
                      <Meta
                        description={
                          getFieldValue('message')
                            ? getFieldValue('message')
                            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
                        }
                      />
                    </Card>
                  )}
                  {this.state.template === 'ANNOUNCEMENT_SMALL' && (
                    <Card>
                      <Col span={8} style={{ maxHeight: '200px' }}>
                        <img
                          alt="example"
                          width="100%"
                          src={
                            this.state.imageUrl !== ''
                              ? this.state.cdnPath + this.state.imageUrl
                              : 'https://dcdn.""/pb/te/st/3deec83470f74af7a1d3defe23f9ee1f.png'
                          }
                        />
                      </Col>
                      <Col
                        span={16}
                        style={{
                          textAlign: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ marginTop: '20px' }}>
                          {getFieldValue('message')
                            ? getFieldValue('message')
                            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'}
                        </div>
                        <div style={{ marginTop: '20px' }}>
                          <Button>
                            {getFieldValue('primaryButtonLabel')
                              ? getFieldValue('primaryButtonLabel')
                              : 'Copy Room Id'}{' '}
                          </Button>
                        </div>
                      </Col>
                    </Card>
                  )}
                  {this.state.template === 'ANNOUNCEMENT_BIG_ONE_BUTTON' && (
                    <Card
                      type="inner"
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        <img
                          alt="example"
                          src={
                            this.state.imageUrl !== ''
                              ? this.state.cdnPath + this.state.imageUrl
                              : 'https://dcdn.""/pb/te/st/3deec83470f74af7a1d3defe23f9ee1f.png'
                          }
                        />
                      }
                    >
                      <Meta
                        title={
                          getFieldValue('title')
                            ? getFieldValue('title')
                            : 'Card title'
                        }
                        description={
                          getFieldValue('message')
                            ? getFieldValue('message')
                            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
                        }
                      />
                      <Button style={{ width: '80%', margin: '20px' }}>
                        {getFieldValue('primaryButtonLabel')
                          ? getFieldValue('primaryButtonLabel')
                          : 'Join Audio Show'}
                      </Button>
                    </Card>
                  )}
                  {this.state.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON' && (
                    <Card
                      type="inner"
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        <img
                          alt="example"
                          src={
                            this.state.imageUrl !== ''
                              ? this.state.cdnPath + this.state.imageUrl
                              : 'https://dcdn.""/pb/te/st/3deec83470f74af7a1d3defe23f9ee1f.png'
                          }
                        />
                      }
                    >
                      <Meta
                        title={
                          getFieldValue('title')
                            ? getFieldValue('title')
                            : 'Card title'
                        }
                        description={
                          getFieldValue('message')
                            ? getFieldValue('message')
                            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
                        }
                      />
                      <Button style={{ width: '80%', margin: '20px' }}>
                        {getFieldValue('primaryButtonLabel')
                          ? getFieldValue('primaryButtonLabel')
                          : 'Learn More'}
                      </Button>
                      <Button
                        style={{
                          width: '80%',
                          margin: '0 20px 20px 20px',
                          backgroundColor: 'red'
                        }}
                      >
                        {getFieldValue('secondaryButtonLabel')
                          ? getFieldValue('secondaryButtonLabel')
                          : 'Join Audio Show'}
                      </Button>
                    </Card>
                  )}
                </Col>
              </Row>
            </Card>

            {(this.state.template === 'ANNOUNCEMENT_SMALL' ||
              this.state.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON' ||
              this.state.template === 'ANNOUNCEMENT_BIG_ONE_BUTTON') && (
              <Card title={'Primary Button'} type="inner">
                <FormItem
                  validateStatus={errors.primaryButtonLabel ? 'error' : ''}
                  help={errors.primaryButtonLabel || ''}
                  {...formItemLayout}
                  label={'primaryButtonLabel'}
                >
                  {getFieldDecorator('primaryButtonLabel', {
                    rules: [
                      {
                        required: true,
                        message: 'Mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input style={{ width: '70%' }} />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.primaryButtonDeeplink ||
                    !this.state.isPrimaryButtonDeeplinkVerified
                      ? 'error'
                      : ''
                  }
                  help={errors.primaryButtonDeeplink || ''}
                  {...formItemLayout}
                  label={'Primary Button'}
                >
                  {getFieldDecorator('primaryButtonDeeplink', {
                    rules: [
                      {
                        required: true,
                        message: 'Mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      style={{ width: '70%' }}
                      rows={3}
                      placeholder="Deeplink JSON object for primary button"
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'PRIMARY_BUTTON')
                      }
                    />
                  )}
                </FormItem>
              </Card>
            )}
            {this.state.template === 'ANNOUNCEMENT_BIG_TWO_BUTTON' && (
              <Card title={'Secondary Button'} type="inner">
                <FormItem
                  validateStatus={errors.secondaryButtonLabel ? 'error' : ''}
                  help={errors.secondaryButtonLabel || ''}
                  {...formItemLayout}
                  label={'secondaryButtonLabel'}
                >
                  {getFieldDecorator('secondaryButtonLabel', {
                    rules: [
                      {
                        required: true,
                        message: 'Mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input style={{ width: '70%' }} />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.secondaryButtonDeeplink ||
                    !this.state.isSecondaryButtonDeeplinkVerified
                      ? 'error'
                      : ''
                  }
                  help={errors.secondaryButtonDeeplink || ''}
                  {...formItemLayout}
                  label={'secondary Button'}
                >
                  {getFieldDecorator('secondaryButtonDeeplink', {
                    rules: [
                      {
                        required: true,
                        message: 'Mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      style={{ width: '70%' }}
                      rows={3}
                      placeholder="Deeplink JSON object for secondary button"
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'SECONDARY_BUTTON')
                      }
                    />
                  )}
                </FormItem>
              </Card>
            )}
            {this.state.template && this.state.template !== 'TEXT' && (
              <Row>
                <Col span={24} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.getImageUrl}
                    header={'Image URL'}
                    actions={this.props.actions}
                    previewImage={this.state.previewImage}
                    fileList={this.state.fileList}
                    isMandatory={true}
                    isLoading={this.isImageLoading}
                  />
                </Col>
              </Row>
            )}
            <Card title={'List of UserIds'} type="inner">
              <CSVReader
                cssClass="csv-reader-input"
                label="Upload Users file"
                onFileLoaded={e => this.handleFileUpload(e)}
              />
            </Card>
            <Card title={'Send To One User'} type="inner">
              <FormItem
                validateStatus={errors.userId ? 'error' : ''}
                help={errors.userId || ''}
                {...formItemLayout}
                label={'User Id'}
              >
                {getFieldDecorator('userId', {
                  rules: [
                    {
                      required: false,
                      type: 'number',
                      message: 'Mandatory field!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <Col span={12}>
                <Button
                  type="primary"
                  disabled={
                    this.state.imageLoading || hasErrors(getFieldsError())
                  }
                  onClick={() => this.sendToSingleUser()}
                >
                  Send Notification to Single User
                </Button>
              </Col>
            </Card>
            <Row>
              <Col span={12}>
                <Button
                  type="primary"
                  disabled={
                    this.state.imageLoading || hasErrors(getFieldsError())
                  }
                  htmlType="submit"
                >
                  Send Notification
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getBotTypesResponse: state.notification.getBotTypesResponse,
    sendBotMessageResponse: state.notification.sendBotMessageResponse,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse,
    getLinkedAccountsResponse: state.userProfile.getLinkedAccountsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...notificationActions, ...websiteActions, ...userProfileActions },
      dispatch
    )
  };
}
const BotMessageForm = Form.create()(BotMessage);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BotMessageForm);
