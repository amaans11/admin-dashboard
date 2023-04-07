import React, { Component } from 'react';
import {
  Form,
  Input,
  Icon,
  Button,
  Row,
  Col,
  Tooltip,
  Modal,
  Card
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  METHOD_MAP,
  RESPONSE_MAP,
  KEYS_MAP,
  RESPONSE_KEYS_MAP,
  getArrFromObj
} from './constants';
import * as userProfileActions from '../../actions/UserProfileActions';
import * as userDataActions from '../../actions/userDataActions';
import * as asnActions from '../../actions/asnActions';
import * as audioActions from '../../actions/AudioRoomActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const formLabelMap = {
  users: 'Selected Users',
  channels: 'Selected Channels',
  audioRooms: 'Selected Audio Rooms',
  liveStreams: 'Selected Live Streams',
  recommendationChannels: 'Select Recommended Channels'
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : '',
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 400
});

export class DynamicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numbersFetched: false,
      newAdded: false,
      data: [],
      mobileNumberData: {},
      activeStatusData: {},
      dataMap: {},
      itemToShow: {},
      showModal: false
    };
  }
  onDragEnd = result => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const { form, fieldKey } = this.props;
    form.setFieldsValue({
      [fieldKey]: reorder(
        form.getFieldValue(fieldKey),
        source.index,
        destination.index
      )
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { fieldKey, form } = this.props;
    const prevValues = prevProps.form.getFieldValue(fieldKey);
    const values = form.getFieldValue(fieldKey);

    const isLengthMisMatch = prevState.numbersFetched
      ? prevValues.length !== values.length
        ? true
        : false
      : false;
    if (!this.state.numbersFetched || isLengthMisMatch) {
      if (values) {
        this.setState(
          {
            numbersFetched: true,
            data: values
          },
          () => {
            const methodToCall = METHOD_MAP[fieldKey];
            const responseToMap = RESPONSE_MAP[fieldKey];
            const key = KEYS_MAP[fieldKey];
            this.props.actions[methodToCall]({
              [key]: form.getFieldValue(fieldKey)
            }).then(() => {
              this.processNetworkResponse(
                this.props[responseToMap],
                RESPONSE_KEYS_MAP[fieldKey]
              );
            });
          }
        );
      }
    }
  }

  openModal = dataItem => {
    const { dataMap } = this.state;
    const { dataMap: propsDataMap } = this.props;
    if (dataMap.hasOwnProperty(dataItem)) {
      this.setState({
        itemToShow: dataMap[dataItem],
        showModal: true
      });
    } else if (propsDataMap.hasOwnProperty(dataItem)) {
      this.setState({
        itemToShow: propsDataMap[dataItem],
        showModal: true
      });
    }
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  processNetworkResponse = (response, responseKey) => {
    if (response && response[responseKey]) {
      let data = getArrFromObj(response[responseKey]);
      const mobileNumberData = {};
      const activeStatusData = {};
      const dataMap = {};
      if (responseKey.includes('profiles')) {
        data.map(item => {
          mobileNumberData[item.id.low] = item.mobileNumber;
          dataMap[item.id.low] = item;
        });
      } else if (responseKey.includes('groups')) {
        data.map(item => {
          mobileNumberData[item.channelUrl] = item.creator.mobileNumber;
          dataMap[item.channelUrl] = item;
        });
      } else if (
        responseKey.includes('liveStreams') ||
        responseKey.includes('rooms')
      ) {
        data.map(item => {
          dataMap[item.id] = item;
          mobileNumberData[item.id] = item.host.profile.mobileNumber;
          activeStatusData[item.id] =
            item.state === 0 || !item.hasOwnProperty('state') ? true : false;
        });
      }
      this.setState({ mobileNumberData, activeStatusData, dataMap });
      if (
        this.props.sendActiveStatusData &&
        Object.keys(activeStatusData).length
      )
        this.props.sendActiveStatusData(activeStatusData);
    }
  };
  render() {
    const {
      form = {},
      formItemLayout = {},
      className,
      fieldKey,
      fieldError,
      formItemLayoutWithOutLabel,
      removeDataItem
    } = this.props;
    const { labelCol, wrapperCol } = formItemLayout;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator(fieldKey, { initialValue: [] });
    const values = getFieldValue(fieldKey);
    if (!values) return null;
    return (
      <React.Fragment>
        <Row className={className}>
          <Col
            xs={labelCol.xs}
            sm={labelCol.sm}
            lg={labelCol.lg}
            style={{
              color: 'rgba(0, 0, 0, 0.85)',
              padding: grid,
              textAlign: 'right'
            }}
          >
            <span>
              {formLabelMap[fieldKey]}&nbsp;
              <Tooltip title={`List of ${formLabelMap[fieldKey]}`}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
            &nbsp;
            {':'}
          </Col>
          <Col xs={wrapperCol.xs} sm={wrapperCol.sm} lg={wrapperCol.lg}>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="dynamicFormDroppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {values.map((value, index) => (
                      <Draggable
                        key={String('dforder' + value + ' ' + index)}
                        draggableId={value}
                        index={index}
                      >
                        {(provided, snapshot) => {
                          const isActiveStatusAvailable =
                            this.props.activeStatusData.hasOwnProperty(value) ||
                            this.state.activeStatusData.hasOwnProperty(value);
                          const activeStatus = isActiveStatusAvailable
                            ? this.props.activeStatusData[value] ||
                              this.state.activeStatusData[value]
                            : null;

                          return (
                            <div
                              className={
                                isActiveStatusAvailable
                                  ? activeStatus
                                    ? 'drag-item active-card'
                                    : 'drag-item inactive-card'
                                  : 'drag-item'
                              }
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <Form.Item
                                className="hide"
                                validateStatus={fieldError ? 'error' : ''}
                                {...(index === 0
                                  ? formItemLayout
                                  : formItemLayoutWithOutLabel)}
                                label={
                                  index === 0 ? formLabelMap[fieldKey] : ''
                                }
                                key={value + ' ' + index}
                              >
                                {getFieldDecorator(`${fieldKey}-${value}`, {
                                  rules: [
                                    {
                                      required: true,
                                      whitespace: false,
                                      message: 'Please input value'
                                    }
                                  ],
                                  initialValue: value
                                })(
                                  <Input
                                    placeholder="enter value"
                                    disabled={true}
                                    style={{ width: '90%' }}
                                  />
                                )}
                                <Icon
                                  className="dynamic-delete-button-1"
                                  type="minus-circle-o"
                                  disabled={values.length === 1}
                                  onClick={() =>
                                    removeDataItem(fieldKey, value)
                                  }
                                />
                              </Form.Item>
                              <Row
                                type="flex"
                                justify="space-between"
                                align="middle"
                                style={{ width: '100%' }}
                              >
                                <div>
                                  <div>
                                    <b>{value}</b>
                                  </div>
                                  {this.props.mobileNumbersData.hasOwnProperty(
                                    value
                                  ) ||
                                  this.state.mobileNumberData.hasOwnProperty(
                                    value
                                  ) ? (
                                    <div>
                                      Mobile:{' '}
                                      {this.props.mobileNumbersData[value] ||
                                        this.state.mobileNumberData[value]}
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                  {isActiveStatusAvailable ? (
                                    <div>
                                      Status: {activeStatus ? 'Live' : 'Closed'}
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </div>
                                <Row
                                  type="flex"
                                  align="middle"
                                  justify="center"
                                >
                                  <Button
                                    onClick={() => this.openModal(value)}
                                    icon="info"
                                    type="primary"
                                    size="small"
                                    shape="circle"
                                    style={{ marginRight: 8 }}
                                  />
                                  <Button
                                    onClick={() =>
                                      removeDataItem(fieldKey, value)
                                    }
                                    type="danger"
                                    icon="close"
                                    shape="circle"
                                  />
                                </Row>
                              </Row>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Col>
        </Row>
        <Modal
          title={'Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={this.closeModal}
          onOk={this.closeModal}
          visible={this.state.showModal}
        >
          <Card bordered={false}>
            {JSON.stringify(this.state.itemToShow, null, 4)}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  getProfileByMobileResponse: state.userProfile.getProfileByMobileResponse,
  getProfileByIdResponse: state.userProfile.getProfileByIdResponse,
  getBasicUserDetailListResponse: state.userData.getBasicUserDetailListResponse,
  getChannelsByUserResponse: state.asn.getChannelsByUserResponse,
  getLiveStreamsByUserResponse: state.asn.getLiveStreamsByUserResponse,
  getAudioRoomListResponse: state.audioRoom.getAudioRoomListResponse,
  verifyBulkLiveStreamsResponse: state.asn.verifyBulkLiveStreamsResponse,
  verifyBulkAudioRoomsResponse: state.asn.verifyBulkAudioRoomsResponse,
  verifyBulkChannelUrlsResponse: state.asn.verifyBulkChannelUrlsResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...userProfileActions,
      ...userDataActions,
      ...asnActions,
      ...audioActions
    },
    dispatch
  )
});
export default connect(mapStateToProps, mapDispatchToProps)(DynamicForm);
