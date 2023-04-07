import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as asnActions from '../../actions/asnActions';
import * as websiteActions from '../../actions/websiteActions';
import {
  Card,
  message,
  Spin,
  Row,
  Select,
  Form,
  Button,
  Col,
  Icon,
  Tooltip,
  Input,
  Typography
} from 'antd';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import DynamicForm from './DynamicForm';
import SearchComponent from './SearchComponent';
import {
  NAME_MAP,
  spreadKeys,
  FORM_ITEM_LAYOUT,
  D_FORM_ITEM_LAYOUT,
  FORM_ITEM_LAYOUT_WITHOUT_LABEL,
  hasErrorsInForm,
  getZkArray,
  containsInactiveData,
  getMobileNumberFromData,
  getActiveStatusFromData
} from './constants';
import ImageUploader from './ImageUploader';
import { CONFIG_HOME_DISCOVERY_WIDGET_READ } from '../../auth/userPermission';

const { Title } = Typography;
export class DiscoveryWidgetConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeData: {},
      isLoaded: false,
      updatedNodeData: {},
      cdnPath: '',
      mobileNumbersData: {},
      activeStatusData: {},
      previewImage: null,
      fileList: [],
      dataMap: {}
    };
  }

  componentDidMount() {
    this.getNodeData();
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
  }

  appendActiveStatusData = newData => {
    this.setState({
      activeStatusData: {
        ...this.state.activeStatusData,
        ...newData
      }
    });
  };

  getNodeData = () => {
    this.setState({ isLoaded: false });
    this.props.actions.getAsnZkConfig().then(() => {
      if (this.props.getAsnPcZkResponse) {
        let nodeData =
          this.props.getAsnPcZkResponse.nodeData &&
          this.props.getAsnPcZkResponse.nodeData !== ''
            ? JSON.parse(this.props.getAsnPcZkResponse.nodeData)
            : {};
        this.setState({
          nodeData: cloneDeep(nodeData),
          isLoaded: true,
          updatedNodeData: cloneDeep(nodeData),
          previewImage: nodeData.discoveryWidget.mainBanner,
          fileList: [
            {
              uid: -1,
              name: 'main-banner.png',
              status: 'done',
              url: nodeData.discoveryWidget.mainBanner
            }
          ]
        });
        const users = get(
          nodeData.discoveryWidget,
          'starUsers.users',
          []
        ).map(user => String(user.userId));
        const channels = get(
          nodeData.discoveryWidget,
          'starChannels.channels',
          []
        ).map(channel => channel.channelUrl);
        this.props.form.setFieldsValue({
          ...nodeData.discoveryWidget,
          starUsers: {
            ...nodeData.discoveryWidget.starUsers
          },
          users,
          ...spreadKeys('users', users),
          starChannels: {
            ...nodeData.discoveryWidget.starChannels
          },
          channels,
          ...spreadKeys('channels', channels),
          starShows: {
            ...nodeData.discoveryWidget.starShows
          },
          audioRooms: get(nodeData.discoveryWidget.starShows, 'audioRooms', []),
          ...spreadKeys(
            'audioRooms',
            get(nodeData.discoveryWidget.starShows, 'audioRooms', [])
          ),
          liveStreams: get(
            nodeData.discoveryWidget.starLiveStreams,
            'liveStreams',
            []
          ),
          starLiveStreams: {
            ...nodeData.discoveryWidget.starLiveStreams
          },
          ...spreadKeys(
            'liveStreams',
            get(nodeData.discoveryWidget.starLiveStreams, 'liveStreams', [])
          )
        });

        this.props.form.validateFields();
      }
    });
  };

  mainBannerUploadCallback = data => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const imageUrl =
      data && data.id
        ? this.state.cdnPath.concat(data.id)
        : getFieldValue('mainBanner');
    setFieldsValue({
      mainBanner: imageUrl
    });
    this.setState({
      previewImage: imageUrl,
      fileList: [
        {
          uid: -1,
          name: 'main-banner.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });
  };

  getNoteText = type => {
    return (
      <Row type="flex" justify="center">
        <Typography>
          <Row type="flex" justify="start">
            <Col>
              <Typography.Paragraph>* Note:&nbsp;</Typography.Paragraph>
            </Col>
            <Col>
              <Typography.Paragraph>
                1. You can drag and drop the items above to manage their order.
                <br />
                2. Use the below search option to add&nbsp;
                {NAME_MAP[type]}
              </Typography.Paragraph>
            </Col>
          </Row>
        </Typography>
      </Row>
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error('Error in form, please verify again.');
        return;
      }
      const { updatedNodeData, activeStatusData } = this.state;
      if (
        containsInactiveData(values, activeStatusData, 'audioRooms') ||
        containsInactiveData(values, activeStatusData, 'liveStreams')
      ) {
        message.error('Kindly remove all the closed Audio Rooms/Live Streams');
        return;
      }
      const { discoveryWidget } = updatedNodeData;
      discoveryWidget.mainBanner = values.mainBanner;
      discoveryWidget.starUsers = {
        ...values.starUsers,
        users: getZkArray(
          discoveryWidget.starUsers.users,
          values.users,
          'userId'
        )
      };
      discoveryWidget.starChannels = {
        ...values.starChannels,
        channels: getZkArray(
          discoveryWidget.starChannels.channels,
          values.channels,
          'channelUrl'
        )
      };
      discoveryWidget.starShows = {
        ...values.starShows,
        audioRooms: values.audioRooms
      };
      discoveryWidget.starLiveStreams = {
        ...values.starLiveStreams,
        liveStreams: values.liveStreams
      };
      // console.log('UPDATED NODE DATA: ', updatedNodeData);
      this.props.actions.postAsnZkConfig(updatedNodeData).then(() => {
        if (
          this.props.postAsnPcZkResponse &&
          this.props.postAsnPcZkResponse.success
        ) {
          this.props.form.resetFields();
          this.setState({
            nodeData: { ...this.state.updatedNodeData }
          });
          message.success('Successfully updated the data');
          this.getNodeData();
        }
      });
    });
  };

  addSearchData = (searchType, data, extraData) => {
    const { form } = this.props;
    const values = form.getFieldValue(searchType);
    if (values.includes(data)) return;
    let mobile = getMobileNumberFromData(searchType, extraData);
    let { addActiveStatus, activeStatus } = getActiveStatusFromData(
      searchType,
      extraData
    );
    this.props.form.setFieldsValue({
      [searchType]: [...values, data],
      [`${searchType}-${data}`]: data
    });
    this.setState({
      mobileNumbersData: {
        ...this.state.mobileNumbersData,
        [data]: mobile
      },
      dataMap: {
        ...this.state.dataMap,
        [data]: extraData
      }
    });
    if (addActiveStatus)
      this.setState({
        activeStatusData: {
          ...this.state.activeStatusData,
          [data]: activeStatus
        }
      });
  };

  removeDataItem = (fieldKey, data) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    let dataArr = getFieldValue(fieldKey);
    setFieldsValue({
      [fieldKey]: dataArr.filter(item => item !== data)
    });
  };

  isReadOnlyUser = () => {
    return this.props.currentUser.user_role.includes(
      CONFIG_HOME_DISCOVERY_WIDGET_READ
    );
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      mainBanner: isFieldTouched('mainBanner') && getFieldError('mainBanner'),
      starUsers: {
        title:
          isFieldTouched('starUsers.title') && getFieldError('starUsers.title'),
        cardType:
          isFieldTouched('starUsers.cardType') &&
          getFieldError('starUsers.cardType'),
        users:
          isFieldTouched('starUsers.users') && getFieldError('starUsers.users')
      },
      starChannels: {
        title:
          isFieldTouched('starChannels.title') &&
          getFieldError('starChannels.title'),
        cardType:
          isFieldTouched('starChannels.cardType') &&
          getFieldError('starChannels.cardType'),
        channels:
          isFieldTouched('starChannels.channels') &&
          getFieldError('starChannels.channels')
      },
      starShows: {
        title:
          isFieldTouched('starShows.title') && getFieldError('starShows.title'),
        audioRooms:
          isFieldTouched('starShows.audioRooms') &&
          getFieldError('starShows.audioRooms')
      },
      starLiveStreams: {
        title:
          isFieldTouched('starLiveStreams.title') &&
          getFieldError('starLiveStreams.title'),
        liveStreams:
          isFieldTouched('starLiveStreams.liveStreams') &&
          getFieldError('starLiveStreams.liveStreams')
      }
    };
    const { nodeData, isLoaded } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Discovery Widget Config | Admin Dashboard</title>
        </Helmet>
        {!isLoaded ? (
          <Row type="flex" justify="center">
            <Card>
              <Spin />
            </Card>
          </Row>
        ) : (
          <Row>
            <Form onSubmit={this.handleSubmit}>
              <Card>
                <Title level={2} className="mb0">
                  Discover Widget Zookeeper Config
                </Title>
              </Card>
              <Row>
                <Col span={24}>
                  <Card title="Main Banner">
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={errors.mainBanner ? 'error' : ''}
                      help={errors.mainBanner || ''}
                      label={
                        <span>
                          Main Banner
                          <Tooltip title="Url for main banner, use below uploader to change image">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('mainBanner', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please Select Main Banner'
                          }
                        ],
                        initialValue: ''
                      })(
                        <Input
                          placeholder="Enter Main Banner Url"
                          disabled={true}
                        />
                      )}
                    </Form.Item>
                    <Row type="flex" justify="center">
                      <ImageUploader
                        callbackFromParent={this.mainBannerUploadCallback}
                        header={'Upload Banner Image'}
                        isMandatory={true}
                        previewImage={this.state.previewImage}
                        fileList={this.state.fileList}
                      />
                    </Row>
                  </Card>
                  <Card title="Star Users">
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={errors.starUsers.title ? 'error' : ''}
                      help={errors.starUsers.title || ''}
                      label={
                        <span>
                          Title
                          <Tooltip title="Title for Star Users">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('starUsers.title', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please enter the title'
                          }
                        ],
                        initialValue: ''
                      })(<Input placeholder="Enter title" />)}
                    </Form.Item>
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={errors.starUsers.cardType ? 'error' : ''}
                      help={errors.starUsers.cardType || ''}
                      label={
                        <span>
                          Users Card Type
                          <Tooltip title="Select Card Type for Star Users">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('starUsers.cardType', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please select card type'
                          }
                        ],
                        initialValue: get(
                          nodeData.discoveryWidget,
                          'starUsers.cardType',
                          ''
                        )
                      })(
                        <Select
                          showSearch
                          placeholder="Select a card type"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {['USER_CHANNEL_EARNING', 'USER_FOLLOWERS'].map(
                            cardType => {
                              return (
                                <Select.Option key={cardType} value={cardType}>
                                  {cardType}
                                </Select.Option>
                              );
                            }
                          )}
                        </Select>
                      )}
                    </Form.Item>
                    <DynamicForm
                      form={this.props.form}
                      fieldError={errors.starUsers.users}
                      fieldKey={'users'}
                      removeDataItem={this.removeDataItem}
                      mobileNumbersData={this.state.mobileNumbersData}
                      dataMap={this.state.dataMap}
                      sendActiveStatusData={this.appendActiveStatusData}
                      activeStatusData={this.state.activeStatusData}
                      formItemLayout={D_FORM_ITEM_LAYOUT}
                      formItemLayoutWithOutLabel={
                        FORM_ITEM_LAYOUT_WITHOUT_LABEL
                      }
                    />
                    {this.getNoteText('users')}
                    <SearchComponent
                      searchType={'users'}
                      cardTitle={NAME_MAP['users']}
                      addData={this.addSearchData}
                    />
                  </Card>
                  <Card title="Star Channels">
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={errors.starChannels.title ? 'error' : ''}
                      help={errors.starChannels.title || ''}
                      label={
                        <span>
                          Title
                          <Tooltip title="Title for Star Channel">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('starChannels.title', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please enter the title'
                          }
                        ],
                        initialValue: ''
                      })(<Input placeholder="Enter title" />)}
                    </Form.Item>
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={
                        errors.starChannels.cardType ? 'error' : ''
                      }
                      help={errors.starChannels.cardType || ''}
                      label={
                        <span>
                          Channels Card Type
                          <Tooltip title="Select Card Type for Star Channels">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('starChannels.cardType', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please select card type'
                          }
                        ],
                        initialValue: get(
                          nodeData.discoveryWidget,
                          'starChannels.cardType',
                          ''
                        )
                      })(
                        <Select
                          showSearch
                          placeholder="Select a card type"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {['CHANNEL_EARNING', 'CHANNEL_MEMBERS'].map(
                            cardType => {
                              return (
                                <Select.Option key={cardType} value={cardType}>
                                  {cardType}
                                </Select.Option>
                              );
                            }
                          )}
                        </Select>
                      )}
                    </Form.Item>
                    <DynamicForm
                      form={this.props.form}
                      fieldError={errors.starChannels.channels}
                      fieldKey={'channels'}
                      removeDataItem={this.removeDataItem}
                      mobileNumbersData={this.state.mobileNumbersData}
                      dataMap={this.state.dataMap}
                      sendActiveStatusData={this.appendActiveStatusData}
                      activeStatusData={this.state.activeStatusData}
                      formItemLayout={D_FORM_ITEM_LAYOUT}
                      formItemLayoutWithOutLabel={
                        FORM_ITEM_LAYOUT_WITHOUT_LABEL
                      }
                    />
                    {this.getNoteText('channels')}
                    <SearchComponent
                      searchType={'channels'}
                      cardTitle={NAME_MAP['channels']}
                      addData={this.addSearchData}
                    />
                  </Card>
                  <Card title="Star Audio Rooms / Shows">
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={errors.starShows.title ? 'error' : ''}
                      help={errors.starShows.title || ''}
                      label={
                        <span>
                          Title
                          <Tooltip title="Title for Star Shows">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('starShows.title', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please enter the title'
                          }
                        ],
                        initialValue: ''
                      })(<Input placeholder="Enter title" />)}
                    </Form.Item>
                    <DynamicForm
                      form={this.props.form}
                      fieldError={errors.starShows.audioRooms}
                      fieldKey={'audioRooms'}
                      removeDataItem={this.removeDataItem}
                      mobileNumbersData={this.state.mobileNumbersData}
                      dataMap={this.state.dataMap}
                      sendActiveStatusData={this.appendActiveStatusData}
                      activeStatusData={this.state.activeStatusData}
                      formItemLayout={D_FORM_ITEM_LAYOUT}
                      formItemLayoutWithOutLabel={
                        FORM_ITEM_LAYOUT_WITHOUT_LABEL
                      }
                    />
                    {this.getNoteText('audioRooms')}
                    <SearchComponent
                      searchType={'audioRooms'}
                      cardTitle={NAME_MAP['audioRooms']}
                      addData={this.addSearchData}
                    />
                  </Card>
                  <Card title="Star Live Streams">
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={
                        errors.starLiveStreams.title ? 'error' : ''
                      }
                      help={errors.starLiveStreams.title || ''}
                      label={
                        <span>
                          Title
                          <Tooltip title="Title for Star Live Streams">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('starLiveStreams.title', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please enter the title'
                          }
                        ],
                        initialValue: ''
                      })(<Input placeholder="Enter title" />)}
                    </Form.Item>
                    <DynamicForm
                      form={this.props.form}
                      fieldError={errors.starLiveStreams.liveStreams}
                      fieldKey={'liveStreams'}
                      removeDataItem={this.removeDataItem}
                      mobileNumbersData={this.state.mobileNumbersData}
                      dataMap={this.state.dataMap}
                      sendActiveStatusData={this.appendActiveStatusData}
                      activeStatusData={this.state.activeStatusData}
                      formItemLayout={D_FORM_ITEM_LAYOUT}
                      formItemLayoutWithOutLabel={
                        FORM_ITEM_LAYOUT_WITHOUT_LABEL
                      }
                    />
                    {this.getNoteText('liveStreams')}
                    <SearchComponent
                      searchType={'liveStreams'}
                      cardTitle={NAME_MAP['liveStreams']}
                      addData={this.addSearchData}
                    />
                  </Card>
                  <Card>
                    <Row type="flex" justify="center">
                      <Button
                        type="primary"
                        disabled={
                          hasErrorsInForm(getFieldsError()) ||
                          this.isReadOnlyUser() ||
                          containsInactiveData(
                            this.props.form.getFieldsValue(),
                            this.state.activeStatusData,
                            'audioRooms'
                          ) ||
                          containsInactiveData(
                            this.props.form.getFieldsValue(),
                            this.state.activeStatusData,
                            'liveStreams'
                          )
                        }
                        htmlType="submit"
                      >
                        Update Discovery Widget Config
                      </Button>
                    </Row>
                    {containsInactiveData(
                      this.props.form.getFieldsValue(),
                      this.state.activeStatusData,
                      'audioRooms'
                    ) ||
                    containsInactiveData(
                      this.props.form.getFieldsValue(),
                      this.state.activeStatusData,
                      'liveStreams'
                    ) ? (
                      <Row
                        type="flex"
                        justify="center"
                        style={{ marginTop: 10 }}
                      >
                        <Typography>
                          <Row type="flex" justify="start">
                            <Col>
                              <Typography.Paragraph>
                                * Note:&nbsp;
                              </Typography.Paragraph>
                            </Col>
                            <Col>
                              <Typography.Paragraph>
                                You need to remove all the closed status Live
                                Streams/audio rooms to enable the update button.
                              </Typography.Paragraph>
                            </Col>
                          </Row>
                        </Typography>
                      </Row>
                    ) : null}
                  </Card>
                </Col>
              </Row>
            </Form>
          </Row>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  getAsnPcZkResponse: state.asn.getAsnPcZkResponse,
  postAsnPcZkResponse: state.asn.postAsnPcZkResponse,
  currentUser: state.auth.currentUser,
  getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...asnActions, ...websiteActions }, dispatch)
});
const DiscoveryWidgetConfigForm = Form.create()(DiscoveryWidgetConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoveryWidgetConfigForm);
