// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Row,
  Input,
  Tooltip,
  InputNumber,
  Select,
  Upload,
  Spin,
  Modal,
  DatePicker,
  notification,
  Col,
  message,
  Icon,
  Button
} from 'antd';
import moment from 'moment';
import * as bannerActions from '../../actions/bannerActions';
import * as storageActions from '../../actions/storageActions';
const { RangePicker } = DatePicker;
const Option = Select.Option;
const { TextArea } = Input;
// type CreateBanner ={}
const FormItem = Form.Item;

const bannerType = [
  'REFERRAL',
  'MEGA_TOURNAMENT',
  'TOURNAMENT_WINNER',
  'TOTAL_PRIZES_CASH',
  'TOTAL_PRIZES_TOKEN',
  'UPGRADE_TO_PRO',
  'UPLOAD_KYC'
].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
const actionType = ['OPEN_DEEP_LINK', 'OPEN_WEB_LINK'].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
const appType = ['WEBSITE'].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
const location = ['HOME', 'HERO_NEWS'].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class CreateBannerWebsite extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    loading: false,
    fileList: [],
    buttonType: 'Create'
  };
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    if (this.props.banner.bannerData) {
      if (this.props.banner) {
        this.setState({
          buttonType:
            this.props.banner.bannerData.actionType === 'edit'
              ? 'Update'
              : 'Create'
        });
        for (let key in this.props.banner.bannerData.record) {
          switch (key) {
            case 'index':
              this.props.form.setFieldsValue({
                index: this.props.banner.bannerData.record.index
                  ? this.props.banner.bannerData.record.index
                  : 0
              });
              break;
            case 'actionParams':
              this.props.form.setFieldsValue({
                [key]: this.props.banner.bannerData.record[key]
              });
              break;
            case 'imageUrl':
              if (
                this.props.banner.bannerData.actionType === 'edit' ||
                this.props.banner.bannerData.actionType === 'copy'
              ) {
                this.setState({
                  previewImage: this.props.banner.bannerData.record[key],
                  fileList: [
                    {
                      uid: -1,
                      name: 'xxx.png',
                      status: 'done',
                      url: this.props.banner.bannerData.record.imageUrl
                    }
                  ]
                });
              }
              break;
            case 'startTime' || 'endTime':
              if (this.props.banner.bannerData.actionType === 'edit') {
                this.props.form.setFieldsValue({
                  timeArray: [
                    moment(this.props.banner.bannerData.record.startTime),
                    moment(this.props.banner.bannerData.record.endTime)
                  ]
                });
              }

              break;
            case 'appType':
              if (
                this.props.banner.bannerData.actionType === 'edit' ||
                this.props.banner.bannerData.actionType === 'copy'
              ) {
                let temp = this.props.banner.bannerData.record.appType.split(
                  ','
                );
                this.props.form.setFieldsValue({
                  appType: temp
                });
              }
              break;
            default:
              this.props.form.setFieldsValue({
                [key]: this.props.banner.bannerData.record[key]
              });
              break;
          }
        }
      }
    }
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });
  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleSubmit = e => {
    e.preventDefault();
    var vm = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && this.state.fileList.length > 0) {
        message.loading('Creating Banner config and uploading file');
        if (values.timeArray) {
          values.startTime = moment(values.timeArray[0]).toISOString(true);
          values.endTime = moment(values.timeArray[1]).toISOString(true);
          delete values.timeArray;
        }

        values.isActive = false;
        values.appType = values.appType.join(',');
        if (this.state.imageObject) {
          values.imageObject = this.state.imageObject;
        }
        if (
          this.props.banner.bannerData &&
          this.props.banner.bannerData.actionType === 'edit'
        ) {
          values.id = this.props.banner.bannerData.record.id;
          this.props.actions.updateBanner(values).then(() => {
            message.destroy();
            vm.props.history.push('/banner/all');
          });
        } else {
          this.props.actions.createBanner(values).then(() => {
            message.destroy();
            vm.props.history.push('/banner/all');
          });
        }
      } else {
        if (this.state.fileList.length === 0)
          message.error('Upload image for the banner');
      }
    });
  };

  render() {
    const beforeUpload = file => {
      message.loading('Please wait while files get uploaded ', 0);
      this.setState({
        loading: true
      });

      let imageData = {
        contentType: file.type,
        extension:
          '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      this.props.actions.getBannerUploadAssetsUrl(imageData).then(() => {
        fetch(this.props.banner.assetUrl.uploadUrl, {
          body: file,
          method: 'PUT'
        }).then(result => {
          if (result.status === 200) {
            message.destroy();

            this.setState({
              imageObject: this.props.banner.assetUrl.object,
              loading: false,
              file
            });
          }
        });
      });

      return false;
    };
    const { previewVisible, previewImage, fileList } = this.state;
    const validateJson = e => {
      if (e.target.value !== '') {
        try {
          JSON.parse(e.target.value);
          // notification["success"]({
          //   message: "Valid Json",
          //   description: "Json you entered is valid",
          //   placement: "topLeft"
          // });
        } catch (error) {
          e.target.value = '';
          this.props.form.resetFields(['actionParams']);
          notification['error']({
            message: 'Invalid Json',
            description: 'Json you entered is invalid',
            placement: 'topLeft'
          });
        }
      }
    };
    function disabledDate(current) {
      // Can not select days before today
      return current && current < moment().startOf('day');
    }
    function range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }

      return result;
    }

    function disabledRangeTime(dates, type) {
      if (type === 'start') {
        if (dates !== undefined && dates.length) {
          return {
            disabledHours:
              dates[0].format('DDMMYY') === moment().format('DDMMYY')
                ? disabledHours
                : () => [],
            disabledMinutes:
              dates[0].format('DDMMYY') === moment().format('DDMMYY')
                ? disabledMinutes
                : () => []
          };
        }
      }
    }
    function disabledHours() {
      return range(0, 24).splice(0, moment().hour());
    }
    function disabledMinutes(h) {
      if (h === moment().hour()) {
        return range(0, moment().minute());
      } else {
        return [];
      }
    }
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
    // Only show error after a field is touched.
    const tagError = isFieldTouched('tag') && getFieldError('tag');
    const typeError = isFieldTouched('type') && getFieldError('type');
    const locationError =
      isFieldTouched('location') && getFieldError('location');
    const appTypeError = isFieldTouched('appType') && getFieldError('appType');
    const actionError = isFieldTouched('action') && getFieldError('action');
    const actionParamsError =
      isFieldTouched('actionParams') && getFieldError('actionParams');
    // const activeError = isFieldTouched("active") && getFieldError("active");
    const indexError = isFieldTouched('index') && getFieldError('index');
    const timeArrayError =
      isFieldTouched('timeArray') && getFieldError('timeArray');
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Form onSubmit={this.handleSubmit}>
            <Card bordered={false} title="Create Website Banner">
              <Row>
                <Col span={12}>
                  <FormItem
                    validateStatus={tagError ? 'error' : ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Banner Tag Name
                        <Tooltip title="Some Name tooltip">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('tag', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input name!',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    validateStatus={typeError ? 'error' : ''}
                    help={typeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Select type for banner
                        <Tooltip title="Select type for banner">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('type', {
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          message: 'Please select banner type!'
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select type of banner"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {bannerType}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    validateStatus={locationError ? 'error' : ''}
                    help={locationError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Select location for banner
                        <Tooltip title="Select location for banner">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('location', {
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          message: 'Please select location for banner!'
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select location of banner"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {location}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    validateStatus={appTypeError ? 'error' : ''}
                    help={appTypeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Select App type for banner
                        <Tooltip title="Select type for banner">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('appType', {
                      rules: [
                        {
                          type: 'array',
                          required: true,
                          message: 'Please select app type!'
                        }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select type of app"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {appType}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    validateStatus={actionError ? 'error' : ''}
                    help={actionError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Action Type
                        <Tooltip title="Select action type for banner">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('action', {
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          message: 'Please select action banner!'
                        }
                      ],
                      initialValue: 'OPEN_DEEP_LINK'
                    })(
                      <Select
                        showSearch
                        disabled={true}
                        style={{ width: 200 }}
                        placeholder="Select type of banner"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {actionType}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    validateStatus={actionParamsError ? 'error' : ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Action Params
                        <Tooltip title="Action params for banner">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('actionParams', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input action params!',
                          whitespace: true
                        }
                      ]
                    })(<TextArea onBlur={validateJson} rows={3} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    validateStatus={indexError ? 'error' : ''}
                    help={indexError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Index
                        <Tooltip title="Index to decide priority">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('index', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message: 'index in numbers!',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                </Col>
                {/* <Col span={6}>
                <FormItem
                  validateStatus={activeError ? "error" : ""}
                  help={activeError || ""}
                  {...formItemLayout}
                  label={
                    <span>
                      Active
                      <Tooltip title="Mark banner as ativated">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator("active", {
                    rules: [
                      {
                        required: true,
                        type: "boolean",
                        message: "Mark Banner as active or disabled!",
                        whitespace: false,
                        initialValue: false
                      }
                    ],
                    initialValue: true
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      defaultChecked={true}
                      unCheckedChildren={<Icon type="cross" />}
                    />
                  )}
                </FormItem>
              </Col> */}
                <Col span={12}>
                  {' '}
                  <FormItem
                    validateStatus={timeArrayError ? 'error' : ''}
                    help={timeArrayError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Duration For Banner
                        <Tooltip title="Date and time for Tournament Duration">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('timeArray', {
                      rules: [
                        {
                          required: false,
                          type: 'array',
                          message: 'Please input time duration!',
                          whitespace: false
                        }
                      ]
                    })(
                      <RangePicker
                        disabledDate={disabledDate}
                        disabledTime={disabledRangeTime}
                        allowClear="true"
                        showTime={{ format: 'hh:mm A', use12Hours: true }}
                        format="YYYY-MM-DD hh:mm A"
                        placeholder={['Start Time', 'End Time']}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Upload
                  multiple={false}
                  beforeUpload={beforeUpload}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  )}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                </Modal>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                {this.state.buttonType}
              </Button>
            </Card>
          </Form>
        </Spin>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    banner: state.banner
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...bannerActions, ...storageActions },
      dispatch
    )
  };
}

const CreateBannerWebsiteForm = Form.create()(CreateBannerWebsite);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBannerWebsiteForm);
