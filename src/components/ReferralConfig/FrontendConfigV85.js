import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as referralConfigActions from '../../actions/referralConfigActions';
import * as websiteActions from '../../actions/websiteActions';
import {
  Card,
  Select,
  Form,
  Button,
  Input,
  message,
  Row,
  Col,
  Radio,
  Table,
  Divider,
  Popconfirm,
  Modal
} from 'antd';
import ImageUploader from './ImageUploader';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const appTypeList = [
  <Option key="CASH" value="cash">
    Cash
  </Option>,
  <Option key="PS" value="play-store">
    Play Store
  </Option>,
  <Option key="IOS" value="ios">
    IOS
  </Option>
];

class FrontendConfigV85 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      loadReferralV85BannerConfigUrl: false,
      loadReferralV85CardConfigImage: false,
      referralV85BannerConfigDeeplinkJsonCheck: true,
      referralRewardList: [],
      showAddEditEventModal: false,
      selectedRewardListObject: {},
      showModalImageUploader: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.appTypeSelect = this.appTypeSelect.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  appTypeSelect(e) {
    let data = {
      appType: e
    };
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
    this.props.actions.getReferralFrontendConfig(data).then(() => {
      if (this.props.getReferralFrontendResponse) {
        let config = JSON.parse(this.props.getReferralFrontendResponse).config;
        this.setState({
          referralV85HelpUrl: config['referralV85.help.url'],
          referralV85TermsUrl: config['referralV85.terms.url'],
          referralV85BannerConfigDeeplink: _.isEmpty(
            config['referralV85.banner.config']['deeplink']
          )
            ? ''
            : JSON.stringify(config['referralV85.banner.config']['deeplink']),
          referralV85MultiShareEnabled:
            config['referralV85.multiShare.enabled'],
          referralV85CardConfigTitle:
            config['referralV85.card.config']['title'],
          referralV85CardConfigBody: config['referralV85.card.config']['body'],
          referralV85GeneralShareMessage:
            config['referralV85.general.share.message'],
          referralV85GeneralShareMessageHindi:
            config['referralV85.general.share.message.hindi'],
          fetched: true
        });
        let referralRewardList = [];
        _.forEach(config['referralV85.rewards.list'], function(item, index) {
          let cursor = {};
          cursor['id'] = index + 1;
          cursor['image'] = item.image;
          cursor['title'] = item.title;
          cursor['body'] = item.body;
          referralRewardList.push(cursor);
        });
        this.setState({
          referralRewardList: [...referralRewardList]
        });

        this.copyReferralV85BannerConfigUrl(
          config['referralV85.banner.config']['url']
        );

        this.copyReferralV85CardConfigImage(
          config['referralV85.card.config']['image']
        );
      }
    });
  }

  copyReferralV85BannerConfigUrl(imageUrl) {
    let url = '';
    this.setState({
      previewReferralV85BannerConfigUrl: imageUrl,
      referralV85BannerConfigUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    if (_.includes(imageUrl, '""')) {
      url = imageUrl.split('""/').pop();
    } else {
      url = imageUrl;
    }
    this.setState({
      referralV85BannerConfigUrl: url,
      loadReferralV85BannerConfigUrl: true
    });
  }

  copyReferralV85CardConfigImage(imageUrl) {
    let url = '';
    this.setState({
      previewReferralV85CardConfigUrl: imageUrl,
      referralV85CardConfigUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    if (_.includes(imageUrl, '""')) {
      url = imageUrl.split('""/').pop();
    } else {
      url = imageUrl;
    }

    this.setState({
      referralV85CardConfigImage: url,
      loadReferralV85CardConfigImage: true
    });
  }

  getReferralV85BannerConfigUrl = data => {
    this.setState({
      referralV85BannerConfigUrl: data && data.id ? data.id : ''
    });
  };

  getReferralV85CardConfigImage = data => {
    this.setState({
      referralV85CardConfigImage: data && data.id ? data.id : ''
    });
  };

  jsonCheck(value) {
    if (value) {
      try {
        JSON.parse(value);
        this.setState({ referralV85BannerConfigDeeplinkJsonCheck: true });
        return true;
      } catch (error) {
        this.setState({ referralV85BannerConfigDeeplinkJsonCheck: false });
        return false;
      }
    } else {
      this.setState({ referralV85BannerConfigDeeplinkJsonCheck: true });
    }
  }

  deleteRow(record) {
    let tableData =
      this.state.referralRewardList.length > 0
        ? [...this.state.referralRewardList]
        : [];
    let objIndex = _.findIndex(tableData, function(item) {
      return item.id === record.id;
    });
    if (objIndex > -1) {
      tableData.splice(objIndex, 1);
    }
    let referralRewardList = [];
    _.forEach(tableData, function(item, index) {
      let cursor = {};
      cursor['id'] = index + 1;
      cursor['image'] = item.image;
      cursor['title'] = item.title;
      cursor['body'] = item.body;
      referralRewardList.push(cursor);
    });
    this.setState({
      referralRewardList: [...referralRewardList]
    });
  }

  openAddEditEventModal(actionType, record) {
    if (actionType === 'EDIT') {
      this.setState({
        actionType: actionType,
        selectedRewardListObject: { ...record },
        selectedRewardListObjectFileList: [
          {
            uid: -1,
            name: 'image.png',
            status: 'done',
            url: record.image
          }
        ],
        showAddEditEventModal: true
      });
    } else {
      this.setState({
        actionType: actionType,
        showAddEditEventModal: true,
        showModalImageUploader: true
      });
    }
  }

  resetFields() {
    this.setState({
      selectedRewardListObject: {},
      showModalImageUploader: false
    });
  }

  closeAddEditEventModal() {
    this.resetFields();
    this.setState({ showAddEditEventModal: false });
  }

  updateValues(value, valueType) {
    let selectedRewardListObject = { ...this.state.selectedRewardListObject };
    switch (valueType) {
      case 'TITLE':
        selectedRewardListObject.title = value;
        break;
      case 'BODY':
        selectedRewardListObject.body = value;
        break;
      default:
        break;
    }
    this.setState({
      selectedRewardListObject: { ...selectedRewardListObject }
    });
  }

  getSelectedRewardObjectImage = data => {
    if (data && data.id) {
      let image = this.state.cdnPath + data.id;
      let selectedRewardListObject = { ...this.state.selectedRewardListObject };
      selectedRewardListObject.image = image;
      this.setState({
        selectedRewardListObject: { ...selectedRewardListObject }
      });
    }
  };

  saveChanges() {
    let selectedRewardListObject = { ...this.state.selectedRewardListObject };
    let tableData =
      this.state.referralRewardList.length > 0
        ? [...this.state.referralRewardList]
        : [];
    if (this.state.actionType === 'EDIT') {
      let objIndex = _.findIndex(tableData, function(item) {
        return item.id === selectedRewardListObject.id;
      });
      if (objIndex > -1) {
        tableData[objIndex]['image'] = selectedRewardListObject.image;
        tableData[objIndex]['title'] = selectedRewardListObject.title;
        tableData[objIndex]['body'] = selectedRewardListObject.body;
      }
    } else {
      let newRecord = {
        id: tableData.length + 1,
        image: selectedRewardListObject.image,
        title: selectedRewardListObject.title,
        body: selectedRewardListObject.body
      };
      tableData.push(newRecord);
    }
    this.setState({
      referralRewardList: [...tableData],
      showAddEditEventModal: false
    });
    this.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (
          this.state.referralRewardList &&
          this.state.referralRewardList.length < 1
        ) {
          message.error('Rewards List can not be less than 1');
          return;
        }
        let referralRewardList = [];
        let tableData = [...this.state.referralRewardList];
        _.forEach(tableData, function(item) {
          let cursor = {};
          cursor['image'] = item.image;
          cursor['title'] = item.title;
          cursor['body'] = item.body;
          referralRewardList.push(cursor);
        });
        let referralV85CardConfig = {
          image: this.state.cdnPath + this.state.referralV85CardConfigImage,
          title: values.referralV85CardConfigTitle,
          body: values.referralV85CardConfigBody
        };
        let data = {
          applyToApps: values.applyToApps,
          referralV85HelpUrl: values.referralV85HelpUrl,
          referralV85TermsUrl: values.referralV85TermsUrl,
          referralV85BannerConfigUrl:
            this.state.cdnPath + this.state.referralV85BannerConfigUrl,
          referralV85BannerConfigDeeplink: _.isEmpty(
            values.referralV85BannerConfigDeeplink
          )
            ? null
            : JSON.parse(values.referralV85BannerConfigDeeplink),
          referralRewardList: [...referralRewardList],
          referralV85MultiShareEnabled: values.referralV85MultiShareEnabled,
          referralV85CardConfig: { ...referralV85CardConfig },
          referralV85GeneralShareMessage: values.referralV85GeneralShareMessage,
          referralV85GeneralShareMessageHindi:
            values.referralV85GeneralShareMessageHindi
        };
        this.props.actions.setReferralFrontendConfigV85(data).then(() => {
          if (this.props.setReferralFrontendV85Response) {
            if (this.props.setReferralFrontendV85Response.error) {
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
      applyToApps: getFieldError('applyToApps'),
      referralV85HelpUrl:
        isFieldTouched('referralV85HelpUrl') &&
        getFieldError('referralV85HelpUrl'),
      referralV85TermsUrl:
        isFieldTouched('referralV85HelpUrl') &&
        getFieldError('referralV85HelpUrl'),
      referralV85BannerConfigDeeplink:
        isFieldTouched('referralV85BannerConfigDeeplink') &&
        getFieldError('referralV85BannerConfigDeeplink'),
      referralV85MultiShareEnabled:
        isFieldTouched('referralV85MultiShareEnabled') &&
        getFieldError('referralV85MultiShareEnabled'),
      referralV85CardConfigTitle:
        isFieldTouched('referralV85CardConfigTitle') &&
        getFieldError('referralV85CardConfigTitle'),
      referralV85CardConfigBody:
        isFieldTouched('referralV85CardConfigBody') &&
        getFieldError('referralV85CardConfigBody'),
      referralV85GeneralShareMessage:
        isFieldTouched('referralV85GeneralShareMessage') &&
        getFieldError('referralV85GeneralShareMessage'),
      referralV85GeneralShareMessageHindi:
        isFieldTouched('referralV85GeneralShareMessageHindi') &&
        getFieldError('referralV85GeneralShareMessageHindi')
    };

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Body',
        dataIndex: 'body',
        key: 'body'
      },
      {
        title: 'Preview',
        key: 'imageUrl',
        render: (text, record) => (
          <span>
            <img className="baner-list-img" src={record.image} alt="" />
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              icon="edit"
              type="primary"
              onClick={() => this.openAddEditEventModal('EDIT', record)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete this record?"
              onConfirm={() => this.deleteRow(record)}
            >
              <Button icon="delete" type="danger" />
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Referral Frontend Config">
            <Card title="Select App to Fetch Current Config" type="inner">
              <Row>
                <Col span={6}>App Type</Col>
                <Col span={18}>
                  <Select
                    showSearch
                    onSelect={this.appTypeSelect}
                    style={{ width: 200 }}
                    placeholder="Select a App Type"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {appTypeList}
                  </Select>
                </Col>
              </Row>
            </Card>
            {this.state.fetched && (
              <Card title="Frontend Configs" type="inner">
                <FormItem
                  validateStatus={errors.applyToApps ? 'error' : ''}
                  help={errors.applyToApps || ''}
                  {...formItemLayout}
                  label={'Apply To Apps'}
                >
                  {getFieldDecorator('applyToApps', {
                    rules: [
                      {
                        required: true,
                        type: 'array',
                        message: 'Apps field is mandatory',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      showSearch
                      style={{ width: '70%' }}
                      placeholder="Applicable apps ( Select multiple )"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {appTypeList}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.referralV85HelpUrl ? 'error' : ''}
                  help={errors.referralV85HelpUrl || ''}
                  {...formItemLayout}
                  label={'referralV85.help.url'}
                >
                  {getFieldDecorator('referralV85HelpUrl', {
                    initialValue: this.state.referralV85HelpUrl,
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
                  validateStatus={errors.referralV85TermsUrl ? 'error' : ''}
                  help={errors.referralV85TermsUrl || ''}
                  {...formItemLayout}
                  label={'referralV85.terms.url'}
                >
                  {getFieldDecorator('referralV85TermsUrl', {
                    initialValue: this.state.referralV85TermsUrl,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <Card type="inner" title="referralV85.banner.config">
                  {this.state.loadReferralV85BannerConfigUrl && (
                    <ImageUploader
                      callbackFromParent={this.getReferralV85BannerConfigUrl}
                      header={'referralV85.banner.config.url'}
                      previewImage={
                        this.state.previewReferralV85BannerConfigUrl
                      }
                      fileList={this.state.referralV85BannerConfigUrlFileList}
                      isMandatory={true}
                    />
                  )}
                  <FormItem
                    validateStatus={
                      errors.referralV85BannerConfigDeeplink ||
                      !this.state.referralV85BannerConfigDeeplinkJsonCheck
                        ? 'error'
                        : ''
                    }
                    help={errors.referralV85BannerConfigDeeplink || ''}
                    {...formItemLayout}
                    label={'referralV85.banner.config.deeplink'}
                  >
                    {getFieldDecorator('referralV85BannerConfigDeeplink', {
                      initialValue: this.state.referralV85BannerConfigDeeplink,
                      rules: [
                        {
                          required: false,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(
                      <TextArea
                        rows={3}
                        onBlur={e => this.jsonCheck(e.target.value)}
                      />
                    )}
                  </FormItem>
                </Card>
                <FormItem
                  {...formItemLayout}
                  label={'referralV85.multiShare.enabled'}
                >
                  {getFieldDecorator('referralV85MultiShareEnabled', {
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        message: 'Please select an option',
                        whitespace: false
                      }
                    ],
                    initialValue: this.state.referralV85MultiShareEnabled
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={false}>False</Radio.Button>
                      <Radio.Button value={true}>True</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <Card type="inner" title="referralV85.card.config">
                  {this.state.loadReferralV85CardConfigImage && (
                    <ImageUploader
                      callbackFromParent={this.getReferralV85CardConfigImage}
                      header={'referralV85.banner.config.url'}
                      previewImage={this.state.previewReferralV85CardConfigUrl}
                      fileList={this.state.referralV85CardConfigUrlFileList}
                      isMandatory={true}
                    />
                  )}

                  <FormItem
                    validateStatus={
                      errors.referralV85CardConfigTitle ? 'error' : ''
                    }
                    help={errors.referralV85CardConfigTitle || ''}
                    {...formItemLayout}
                    label={'referralV85.card.config.title'}
                  >
                    {getFieldDecorator('referralV85CardConfigTitle', {
                      initialValue: this.state.referralV85CardConfigTitle,
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
                    validateStatus={
                      errors.referralV85CardConfigBody ? 'error' : ''
                    }
                    help={errors.referralV85CardConfigBody || ''}
                    {...formItemLayout}
                    label={'referralV85.card.config.body'}
                  >
                    {getFieldDecorator('referralV85CardConfigBody', {
                      initialValue: this.state.referralV85CardConfigBody,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Card>
                <FormItem
                  validateStatus={
                    errors.referralV85GeneralShareMessage ? 'error' : ''
                  }
                  help={errors.referralV85GeneralShareMessage || ''}
                  {...formItemLayout}
                  label={'referralV85.general.share.message'}
                >
                  {getFieldDecorator('referralV85GeneralShareMessage', {
                    initialValue: this.state.referralV85GeneralShareMessage,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<TextArea rows={4} />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.referralV85GeneralShareMessageHindi ? 'error' : ''
                  }
                  help={errors.referralV85GeneralShareMessageHindi || ''}
                  {...formItemLayout}
                  label={'referralV85.general.share.message.hindi'}
                >
                  {getFieldDecorator('referralV85GeneralShareMessageHindi', {
                    initialValue: this.state
                      .referralV85GeneralShareMessageHindi,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<TextArea rows={4} />)}
                </FormItem>
                <Card type="inner" title="referralV85.rewards.list">
                  <Table
                    rowKey="id"
                    bordered
                    pagination={false}
                    dataSource={this.state.referralRewardList}
                    columns={columns}
                  />
                  <Button
                    style={{ marginTop: '20px' }}
                    onClick={() => this.openAddEditEventModal('NEW')}
                    type="primary"
                  >
                    {' '}
                    Add Reward
                  </Button>
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
            )}
          </Card>
        </Form>
        <Modal
          title={'Reward change modal'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeAddEditEventModal()}
          onOk={() => this.saveChanges()}
          okText="Save"
          visible={this.state.showAddEditEventModal}
        >
          <Card>
            <Row>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '12px'
                }}
              >
                Title:
              </Col>
              <Col span={14}>
                <Input
                  style={{ marginTop: '12px', width: '80%' }}
                  value={
                    this.state.selectedRewardListObject &&
                    this.state.selectedRewardListObject.title
                      ? this.state.selectedRewardListObject.title
                      : null
                  }
                  onChange={e => this.updateValues(e.target.value, 'TITLE')}
                />
              </Col>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '12px'
                }}
              >
                Body:
              </Col>
              <Col span={14}>
                <Input
                  style={{ marginTop: '12px', width: '80%' }}
                  value={
                    this.state.selectedRewardListObject &&
                    this.state.selectedRewardListObject.body
                      ? this.state.selectedRewardListObject.body
                      : null
                  }
                  onChange={e => this.updateValues(e.target.value, 'BODY')}
                />
              </Col>
              <Col span={24}>
                {((this.state.selectedRewardListObject &&
                  this.state.selectedRewardListObject.image) ||
                  this.state.showModalImageUploader) && (
                  <ImageUploader
                    callbackFromParent={this.getSelectedRewardObjectImage}
                    header={'IMAGE'}
                    previewImage={this.state.selectedRewardListObject.image}
                    fileList={this.state.selectedRewardListObjectFileList}
                    isMandatory={true}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getReferralFrontendResponse:
      state.referralConfig.getReferralFrontendResponse,
    setReferralFrontendV85Response:
      state.referralConfig.setReferralFrontendV85Response,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...referralConfigActions, ...websiteActions },
      dispatch
    )
  };
}
const FrontendConfigV85Form = Form.create()(FrontendConfigV85);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontendConfigV85Form);
