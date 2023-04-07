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
import * as userProfileActions from '../../actions/UserProfileActions';
import * as gameActions from '../../actions/gameActions';
import * as segmentationActions from '../../actions/segmentationActions';
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
  'UPLOAD_KYC',
  'DEPOSIT',
  'WITHDRAWAL',
  'PRIME'
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
const appType = ['CASH', 'PLAY_STORE', 'IOS', 'PWA_NDTV'].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
const location = [
  'HOME',
  'FANTASY_HOME',
  'RUMMY',
  'GAMES',
  'DISCOVERY_WIDGET',
  'SUPPORT',
  'DEPOSIT',
  'WITHDRAWAL'
].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));
class CreateBanner extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    loading: false,
    fileList: [],
    buttonType: 'Create',
    isLocationGames: false,
    selectedSegmentIds: []
  };
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    this.getTierList();
    this.getAllGames();
    this.getCustomSegments();
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
            case 'tier':
              if (
                this.props.banner.bannerData.actionType === 'edit' ||
                this.props.banner.bannerData.actionType === 'copy'
              ) {
                let temp = this.props.banner.bannerData.record.tier.split(',');
                this.props.form.setFieldsValue({
                  tier: temp
                });
              }
              break;
            case 'location':
              if (
                this.props.banner.bannerData.actionType === 'edit' ||
                this.props.banner.bannerData.actionType === 'copy'
              ) {
                let temp = this.props.banner.bannerData.record.location.split(
                  ','
                );
                this.props.form.setFieldsValue({
                  location: temp
                });
              }
              break;
            case 'gameId':
              if (
                this.props.banner.bannerData.actionType === 'edit' ||
                this.props.banner.bannerData.actionType === 'copy'
              ) {
                this.setState(
                  {
                    isLocationGames: true
                  },
                  () => {
                    this.props.form.setFieldsValue({
                      gameId: Number(this.props.banner.bannerData.record.gameId)
                    });
                  }
                );
              }
              break;
            case 'segmentId':
              if (
                this.props.banner.bannerData.actionType === 'edit' ||
                this.props.banner.bannerData.actionType === 'copy'
              ) {
                let temp = this.props.banner.bannerData.record.segmentId.split(
                  ','
                );
                this.props.form.setFieldsValue({
                  segmentId: temp
                });
                this.setState({ selectedSegmentIds: [...temp] });
              }
              break;
            case 'countryCode':
              if (
                this.props.banner.bannerData.actionType === 'edit' ||
                this.props.banner.bannerData.actionType === 'copy'
              ) {
                this.props.form.setFieldsValue({
                  countryCode: this.props.banner.bannerData.record.countryCode
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

  getTierList() {
    this.props.actions.getTierList().then(() => {
      let tierList = [];
      tierList.push(
        <Option key={99} value={'DEFAULT'}>
          {'Default'}
        </Option>
      );
      tierList.push(
        <Option key={98} value={'ALL'}>
          {'All'}
        </Option>
      );
      this.props.tierList.tiers.map((tier, index) => {
        tierList.push(
          <Option key={tier.tier} value={tier.tier}>
            {tier.tier}
          </Option>
        );
      });
      this.setState({
        tierList
      });
    });
  }

  getAllGames() {
    var gameList = [];
    this.props.actions.fetchGames().then(() => {
      this.props.gamesList.map(game => {
        gameList.push(
          <Option key={'game' + game.id} value={game.id}>
            {game.name}
          </Option>
        );
      });
    });
    this.setState({
      gameList
    });
  }

  getCustomSegments() {
    let customSegmentList = [];
    let segmentList = [];
    segmentList.push('DEFAULT##DEFAULT');
    customSegmentList.push(
      <Option key={'DEFAULT##DEFAULT'} value={'DEFAULT##DEFAULT'}>
        DEFAULT
      </Option>
    );
    this.setState({
      customSegmentList,
      segmentList
    });

    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment
      ) {
        segmentList = [];
        customSegmentList = [];
        this.props.getCustomSegmentListResponse.segment.map(segment => {
          segmentList.push(segment.segmentId);
          customSegmentList.push(
            <Option key={segment.segmentId} value={segment.segmentId}>
              {segment.segmentName}
            </Option>
          );
        });
      }
      this.setState({
        customSegmentList,
        segmentList
      });
    });
  }

  selectSegments(value) {
    this.props.form.setFieldsValue({ segmentId: [...value] });
    this.setState({ selectedSegmentIds: [...value] });
  }

  selectAllSegments() {
    this.props.form.setFieldsValue({ segmentId: [...this.state.segmentList] });
    this.setState({ selectedSegmentIds: [...this.state.segmentList] });
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

  locationSelected(value) {
    if (value.includes('GAMES')) {
      this.setState({
        isLocationGames: true
      });
    } else {
      this.setState({
        isLocationGames: false
      });
    }
  }

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
        values.location = values.location.join(',');
        values.tier = values.tier.join(',');
        values.gameId = values.gameId ? values.gameId.toString() : '';
        values.segmentId = values.segmentId.join(',');
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
    const timeArrayError =
      isFieldTouched('timeArray') && getFieldError('timeArray');
    const tierError = isFieldTouched('tier') && getFieldError('tier');
    const minAppVersionError =
      isFieldTouched('minAppVersion') && getFieldError('minAppVersion');
    const maxAppVersionError =
      isFieldTouched('maxAppVersion') && getFieldError('maxAppVersion');
    const gameIdError = isFieldTouched('gameId') && getFieldError('gameId');
    const segmentIdError =
      isFieldTouched('segmentId') && getFieldError('segmentId');
    const countryCodeError =
      isFieldTouched('countryCode') && getFieldError('countryCode');
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Form onSubmit={this.handleSubmit}>
            <Card bordered={false} title="Basic Details">
              <Row>
                <Col span={24}>
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
                <Col span={24}>
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
                <Col span={24}>
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
                          type: 'array',
                          required: true,
                          message: 'Please select location for banner!'
                        }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        showSearch
                        onChange={e => this.locationSelected(e)}
                        style={{ width: '90%' }}
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
                {this.state.isLocationGames && (
                  <Col span={24}>
                    <FormItem
                      validateStatus={gameIdError ? 'error' : ''}
                      help={gameIdError || ''}
                      {...formItemLayout}
                      label={
                        <span>
                          Select game for banner
                          <Tooltip title="Select game for banner">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('gameId', {
                        rules: [
                          {
                            type: 'number',
                            required: true,
                            message: 'Please select game!'
                          }
                        ]
                      })(
                        <Select
                          showSearch
                          style={{ width: 300 }}
                          placeholder="Select game"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.gameList}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                )}
                <Col span={24}>
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
                <Col span={24}>
                  <FormItem
                    validateStatus={tierError ? 'error' : ''}
                    help={tierError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Apply To Tier
                        <Tooltip title="Applicable to these tiers">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('tier', {
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          message: 'Tier field is mandatory',
                          whitespace: false
                        }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Tier"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.tierList}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
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
                <Col span={24}>
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
                <Col span={24}>
                  <FormItem
                    validateStatus={minAppVersionError ? 'error' : ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Min App Version
                        <Tooltip title="Minimum App Version for banner to reflect">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('minAppVersion', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input min app version!',
                          whitespace: true,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    validateStatus={maxAppVersionError ? 'error' : ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Max App Version
                        <Tooltip title="Maximum App Version for banner to reflect">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('maxAppVersion', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input max app version!',
                          whitespace: true,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    validateStatus={segmentIdError ? 'error' : ''}
                    help={segmentIdError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Select segment for banner
                        <Tooltip title="Select segment for banner">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('segmentId', {
                      rules: [
                        {
                          type: 'array',
                          required: true,
                          message: 'Please select segment!'
                        }
                      ]
                    })(
                      <>
                        <Select
                          allowClear={true}
                          showSearch
                          mode="multiple"
                          onChange={e => this.selectSegments(e)}
                          value={this.state.selectedSegmentIds}
                          style={{ width: '80%' }}
                          placeholder="Select applicable segments"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.customSegmentList}
                        </Select>
                        <Button
                          style={{ marginLeft: '5px' }}
                          size="small"
                          onClick={() => this.selectAllSegments()}
                        >
                          Select All
                        </Button>
                      </>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
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
                <Col span={24}>
                  <FormItem
                    validateStatus={countryCodeError ? 'error' : ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Country Code
                        <Tooltip title="Example values: IN for India, ID for Indonesia">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('countryCode', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input country code!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select country"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {CountryList}
                      </Select>
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
    banner: state.banner,
    tierList: state.userProfile.tierList,
    gamesList: state.games.allGames,
    getCustomSegmentListResponse:
      state.segmentation.getCustomSegmentListResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...bannerActions,
        ...storageActions,
        ...userProfileActions,
        ...gameActions,
        ...segmentationActions
      },
      dispatch
    )
  };
}

const CreateBannerForm = Form.create()(CreateBanner);
export default connect(mapStateToProps, mapDispatchToProps)(CreateBannerForm);
