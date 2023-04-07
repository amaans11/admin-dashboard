import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as asnActions from '../../actions/asnActions';
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
  CARD_TYPES,
  FIELD_KEY_MAP,
  NAME_MAP,
  spreadKeys,
  getZkArray,
  FORM_ITEM_LAYOUT,
  D_FORM_ITEM_LAYOUT,
  FORM_ITEM_LAYOUT_WITHOUT_LABEL,
  hasErrorsInForm,
  containsInactiveData,
  getMobileNumberFromData,
  getActiveStatusFromData
} from './constants';
import { CONFIG_HOME_DISCOVERY_WIDGET_READ } from '../../auth/userPermission';

export class HomeWidgetConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeData: {},
      isLoaded: false,
      updatedNodeData: {},
      dynamicFormFieldKey: '',
      mobileNumbersData: {},
      activeStatusData: {},
      dataMap: {}
    };
  }
  componentDidMount() {
    this.getNodeData();
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
          dynamicFormFieldKey: FIELD_KEY_MAP[nodeData.homeWidget.cardType]
        });
        const users = get(nodeData.homeWidget, 'users', []).map(user =>
          String(user.userId)
        );
        const channels = get(nodeData.homeWidget, 'channels', []).map(
          channel => channel.channelUrl
        );
        this.props.form.setFieldsValue({
          ...nodeData.homeWidget,
          users,
          ...spreadKeys('users', users),
          ...spreadKeys('channels', channels),
          ...spreadKeys(
            'audioRooms',
            get(nodeData.homeWidget, 'audioRooms', [])
          ),
          ...spreadKeys(
            'liveStreams',
            get(nodeData.homeWidget, 'liveStreams', [])
          ),
          channels
        });

        this.props.form.validateFields();
      }
    });
  };

  updateSelectedCardType = e => {
    this.setState({
      dynamicFormFieldKey: FIELD_KEY_MAP[e]
    });
  };

  removeDataItem = (fieldKey, data) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    let dataArr = getFieldValue(fieldKey);
    setFieldsValue({
      [fieldKey]: dataArr.filter(item => item !== data)
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error('Error in form, please verify again.');
        return;
      }
      const {
        updatedNodeData,
        dynamicFormFieldKey,
        activeStatusData
      } = this.state;
      if (containsInactiveData(values, activeStatusData, dynamicFormFieldKey)) {
        message.error(
          `Kindly remove all the closed ${
            dynamicFormFieldKey.includes('audioRooms')
              ? 'Audio Rooms'
              : 'Live Streams'
          }`
        );
        return;
      }
      const { homeWidget } = updatedNodeData;
      homeWidget.title = values.title;
      homeWidget.subTitle = values.subTitle;
      homeWidget.cardType = values.cardType;
      let key = FIELD_KEY_MAP[values.cardType];
      if (key === 'users' || key === 'channels') {
        homeWidget[key] = getZkArray(
          homeWidget[key],
          values[key],
          key === 'users' ? 'userId' : 'channelUrl'
        );
      } else {
        homeWidget[key] = values[key];
      }
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

    const titleError = isFieldTouched('title') && getFieldError('title');
    const subTitleError =
      isFieldTouched('subTitle') && getFieldError('subTitle');
    const cardTypeError =
      isFieldTouched('cardType') && getFieldError('cardType');
    const usersError = isFieldTouched('users') && getFieldError('users');
    const channelsError =
      isFieldTouched('channels') && getFieldError('channels');
    const audioRoomsError =
      isFieldTouched('audioRooms') && getFieldError('audioRooms');
    const liveStreamsError =
      isFieldTouched('liveStreams') && getFieldError('liveStreams');

    const { nodeData, isLoaded, dynamicFormFieldKey } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Home Widget Config |  Dashboard</title>
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
              <Card title="Home Widget Zookeeper Config">
                <Row>
                  <Col span={24}>
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={titleError ? 'error' : ''}
                      help={titleError || ''}
                      label={
                        <span>
                          Title
                          <Tooltip title="Title for Home Widget">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('title', {
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
                      validateStatus={subTitleError ? 'error' : ''}
                      help={subTitleError || ''}
                      label={
                        <span>
                          Sub Title
                          <Tooltip title="Sub Title for Home Widget">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('subTitle', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please enter the subtitle'
                          }
                        ],
                        initialValue: ''
                      })(<Input placeholder="Enter subtitle" />)}
                    </Form.Item>
                    <Form.Item
                      {...FORM_ITEM_LAYOUT}
                      validateStatus={cardTypeError ? 'error' : ''}
                      help={cardTypeError || ''}
                      label={
                        <span>
                          Card Type
                          <Tooltip title="Select Card Type for Home Widget">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('cardType', {
                        rules: [
                          {
                            type: 'string',
                            required: true,
                            message: 'Please select card type'
                          }
                        ],
                        initialValue: get(nodeData, 'homeWidget.cardType', '')
                      })(
                        <Select
                          showSearch
                          onSelect={e => this.updateSelectedCardType(e)}
                          placeholder="Select a card type"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {CARD_TYPES.map((cardType, index) => {
                            return (
                              <Select.Option key={cardType} value={cardType}>
                                {cardType}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      )}
                    </Form.Item>
                    <DynamicForm
                      className={dynamicFormFieldKey !== 'users' ? 'hide' : ''}
                      form={this.props.form}
                      fieldError={usersError}
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
                    <DynamicForm
                      className={
                        dynamicFormFieldKey !== 'channels' ? 'hide' : ''
                      }
                      form={this.props.form}
                      fieldError={channelsError}
                      fieldKey={'channels'}
                      removeDataItem={this.removeDataItem}
                      mobileNumbersData={this.state.mobileNumbersData}
                      dataMap={this.state.dataMap}
                      activeStatusData={this.state.activeStatusData}
                      sendActiveStatusData={this.appendActiveStatusData}
                      formItemLayout={D_FORM_ITEM_LAYOUT}
                      formItemLayoutWithOutLabel={
                        FORM_ITEM_LAYOUT_WITHOUT_LABEL
                      }
                    />
                    <DynamicForm
                      className={
                        dynamicFormFieldKey !== 'audioRooms' ? 'hide' : ''
                      }
                      form={this.props.form}
                      fieldError={audioRoomsError}
                      fieldKey={'audioRooms'}
                      removeDataItem={this.removeDataItem}
                      mobileNumbersData={this.state.mobileNumbersData}
                      dataMap={this.state.dataMap}
                      activeStatusData={this.state.activeStatusData}
                      sendActiveStatusData={this.appendActiveStatusData}
                      formItemLayout={D_FORM_ITEM_LAYOUT}
                      formItemLayoutWithOutLabel={
                        FORM_ITEM_LAYOUT_WITHOUT_LABEL
                      }
                    />
                    <DynamicForm
                      className={
                        dynamicFormFieldKey !== 'liveStreams' ? 'hide' : ''
                      }
                      form={this.props.form}
                      fieldError={liveStreamsError}
                      fieldKey={'liveStreams'}
                      removeDataItem={this.removeDataItem}
                      mobileNumbersData={this.state.mobileNumbersData}
                      dataMap={this.state.dataMap}
                      activeStatusData={this.state.activeStatusData}
                      sendActiveStatusData={this.appendActiveStatusData}
                      formItemLayout={D_FORM_ITEM_LAYOUT}
                      formItemLayoutWithOutLabel={
                        FORM_ITEM_LAYOUT_WITHOUT_LABEL
                      }
                    />
                    <Row type="flex" justify="center">
                      <Typography>
                        <Row type="flex" justify="start">
                          <Col>
                            <Typography.Paragraph>
                              * Note:&nbsp;
                            </Typography.Paragraph>
                          </Col>
                          <Col>
                            <Typography.Paragraph>
                              1. You can drag and drop the items above to manage
                              their order.
                              <br />
                              2. Use the below search option to add&nbsp;
                              {NAME_MAP[dynamicFormFieldKey]}
                            </Typography.Paragraph>
                          </Col>
                        </Row>
                      </Typography>
                    </Row>
                    <SearchComponent
                      searchType={dynamicFormFieldKey}
                      cardTitle={NAME_MAP[dynamicFormFieldKey]}
                      addData={this.addSearchData}
                    />
                    <Row type="flex" justify="center">
                      <Button
                        type="primary"
                        disabled={
                          hasErrorsInForm(getFieldsError()) ||
                          this.isReadOnlyUser() ||
                          containsInactiveData(
                            this.props.form.getFieldsValue(),
                            this.state.activeStatusData,
                            this.state.dynamicFormFieldKey
                          )
                        }
                        htmlType="submit"
                      >
                        Update Home Widget Config
                      </Button>
                    </Row>
                    {containsInactiveData(
                      this.props.form.getFieldsValue(),
                      this.state.activeStatusData,
                      this.state.dynamicFormFieldKey
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
                  </Col>
                </Row>
              </Card>
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
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...asnActions }, dispatch)
});
const HomeWidgetForm = Form.create()(HomeWidgetConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeWidgetForm);
