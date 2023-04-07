import React, { Component } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Row,
  Col,
  Icon,
  Radio,
  Button,
  Avatar,
  Typography,
  message,
  Divider,
  Modal,
  Select,
  Input
} from 'antd';
import * as userProfileActions from '../../actions/UserProfileActions';
import * as userDataActions from '../../actions/userDataActions';
import * as asnActions from '../../actions/asnActions';
import * as audioActions from '../../actions/AudioRoomActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CSVReader from 'react-csv-reader';
import IC_CASH from '../../assets/ic_cash.png';
import {
  METHOD_MAP,
  RESPONSE_MAP,
  KEYS_MAP,
  RESPONSE_KEYS_MAP,
  getArrFromObj
} from './constants';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

export class SearchComponent extends Component {
  state = {
    searchMode: 'mobile',
    isCsvRead: false,
    csvData: [],
    pageSize: 10,
    pageNum: 1,
    showprofilesList: false,
    profilesList: [],
    showgroupsList: false,
    groupsList: [],
    showliveStreamsList: false,
    liveStreamsList: [],
    showroomsList: false,
    roomsList: [],
    fetchMoreFlag: false,
    selectedItemForInfo: {},
    responseKey: 'users'
  };

  setSearchMode = searchMode => {
    this.setState({
      searchMode,
      showprofilesList: false,
      profilesList: []
    });
  };

  resetState = () => {
    this.setState({
      showprofilesList: false,
      profilesList: [],
      showgroupsList: false,
      groupsList: [],
      showliveStreamsList: false,
      liveStreamsList: [],
      showroomsList: false,
      roomsList: []
    });
  };
  handleLocalSubmit = (e, searchType) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.resetState();
        if (searchType === 'users') {
          const isUserIdSearch = this.state.searchMode === 'userId';
          const d = {
            method: isUserIdSearch ? 'getProfileById' : 'getProfileByMobile',
            data: isUserIdSearch
              ? { userId: values.userId }
              : { mobileNumber: values.countryCode + values.mobile },
            responseType: isUserIdSearch
              ? 'getProfileByIdResponse'
              : 'getProfileByMobileResponse',
            responseKey: 'profile',
            stateKey: 'profiles'
          };

          // Validate for different country
          // if (!isUserIdSearch && !/^\d{10}$/.test(values.mobile)) {
          //   message.info('Invalid Mobile Number');
          //   return;
          // }

          this.props.actions[d.method](d.data).then(() => {
            this.processNetworkResponse(
              this.props[d.responseType],
              d.responseKey,
              d.stateKey
            );
          });
          return;
        } else {
          let d = {};
          switch (searchType) {
            case 'liveStreams':
              d.method = 'getLiveStreamsByUser';
              d.responseType = 'getLiveStreamsByUserResponse';
              d.responseKey = 'liveStreams';
              break;
            case 'audioRooms':
              d.method = 'getAudioRoomsByUser';
              d.responseType = 'getAudioRoomsByUserResponse';
              d.responseKey = 'rooms';
              break;
            case 'channels':
            case 'recommendationChannels':
              d.method = 'getChannelsByUser';
              d.responseType = 'getChannelsByUserResponse';
              d.responseKey = 'groups';
              break;
            default:
              return;
          }
          d.data =
            this.state.searchMode === 'userId'
              ? { userId: values.userId }
              : { mobileNumber: values.countryCode + values.mobile };

          // Validate numbers for different country
          // if (
          //   this.state.searchMode !== 'userId' &&
          //   !/^\d{10}$/.test(values.mobile)
          // ) {
          //   message.info('Invalid Mobile Number');
          //   return;
          // }

          this.props.actions[d.method](d.data).then(() => {
            this.processNetworkResponse(
              this.props[d.responseType],
              d.responseKey
            );
          });
        }
      }
    });
  };

  processNetworkResponse = (response, responseKey, stateKey = '') => {
    let isSingleUserFlow = stateKey !== '' ? true : false;
    if (stateKey === '') {
      isSingleUserFlow = false;
      stateKey = responseKey;
    }
    if (response) {
      if (response[responseKey]) {
        let data = isSingleUserFlow
          ? [response[responseKey]]
          : getArrFromObj(response[responseKey]);
        if (
          responseKey.includes('liveStreams') ||
          responseKey.includes('rooms')
        ) {
          data = data.filter(
            item => item.state === 0 || !item.hasOwnProperty('state')
          );
        }
        this.setState({
          [`show${stateKey}List`]: true,
          [`${stateKey}List`]: data
        });
      } else {
        this.setState({
          [`show${stateKey}List`]: true,
          [`${stateKey}List`]: []
        });
      }
    }
  };

  getAudioRoomList = e => {
    if (e) e.preventDefault();
    let data = {
      userId: 1000000,
      start: (this.state.pageNum - 1) * this.state.pageSize,
      count: this.state.pageSize,
      type: 'ALL'
    };
    this.props.actions.getAudioRoomList(data).then(() => {
      if (this.props.getAudioRoomListResponse.rooms) {
        this.setState({
          roomsList: [...this.props.getAudioRoomListResponse.rooms],
          showroomsList: true
        });

        if (this.props.getAudioRoomListResponse.rooms.length >= 10) {
          this.setState({ fetchMoreFlag: true });
        } else {
          this.setState({ fetchMoreFlag: false });
        }
      }
    });
  };

  fetchMoreAudioRooms = () => {
    let currentCount = this.state.pageNum;
    // const { searchMode } = this.state;
    this.setState(
      {
        pageNum: currentCount + 1
      },
      () => {
        this.getAudioRoomList();
      }
    );
  };

  goBack() {
    let currentCount = this.state.pageNum;
    this.setState(
      {
        pageNum: currentCount - 1
      },
      () => {
        this.getAudioRoomList();
      }
    );
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  componentDidMount() {
    this.props.form.validateFields();
  }

  processCsvData = () => {
    const { csvData } = this.state;
    const { searchType = 'users' } = this.props;
    if (csvData && csvData.length) {
      const methodToCall = METHOD_MAP[searchType];
      const responseToMap = RESPONSE_MAP[searchType];
      const key = KEYS_MAP[searchType];
      this.props.actions[methodToCall]({ [key]: csvData }).then(() => {
        this.processNetworkResponse(
          this.props[responseToMap],
          RESPONSE_KEYS_MAP[searchType]
        );
      });
    }
  };

  handleFileUpload(data = []) {
    if (data && data.length) {
      let csvData = [];
      for (let i = 0; i < data.length; i++) {
        csvData.push(...data[i]);
      }
      this.setState({
        isCsvRead: true,
        csvData
      });
    }
  }

  showInfoModal = item => {
    this.setState({ selectedItemForInfo: { ...item }, showModal: true });
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cardTitle !== this.props.cardTitle) {
      this.resetState();
    }
  }

  addAll = (type, key) => {
    const { searchType } = this.props;
    const list = this.state[type];
    for (let i = 0; i < list.length; i++) {
      let data =
        key === 'userId'
          ? typeof list[i].id === 'object'
            ? list[i].id.low
            : list[i].id
          : list[i][key];
      this.props.addData(searchType, String(data), list[i]);
    }
  };

  render() {
    const { searchType, cardTitle } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const { searchMode } = this.state;

    const errors = {
      [searchMode]: isFieldTouched(searchMode) && getFieldError(searchMode),
      [searchType]: isFieldTouched(searchType) && getFieldError(searchType),
      searchType: isFieldTouched('searchType') && getFieldError('searchType')
    };

    const isAudioRoomSearch = searchType === 'audioRooms';

    // Country code options
    const prefixSelector = getFieldDecorator('countryCode', {
      initialValue: '+91'
    })(
      <Select style={{ width: 85 }}>
        <Option value="+91">+91 🇮🇳 </Option>
        <Option value="+62">+62 🇮🇩 </Option>
        <Option value="+1">+1 🇺🇸 </Option>
      </Select>
    );

    return (
      <React.Fragment>
        <Card title={'Search for ' + cardTitle} bordered={true}>
          <Form
            onSubmit={e => this.handleLocalSubmit(e, searchType)}
            layout="inline"
          >
            {' '}
            <FormItem
              label={'By'}
              validateStatus={errors.searchType ? 'error' : ''}
            >
              {getFieldDecorator('searchType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: 'mobile'
              })(
                <RadioGroup
                  name="type"
                  onChange={e => this.setSearchMode(e.target.value)}
                >
                  <Radio.Button value={'userId'}>User Id</Radio.Button>
                  <Radio.Button value={'mobile'}>Mobile</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            {this.state.searchMode === 'userId' ? (
              <FormItem
                validateStatus={errors[searchMode] ? 'error' : ''}
                help={errors[searchMode] || ''}
                label="User ID"
              >
                {getFieldDecorator(this.state.searchMode, {
                  rules: [
                    {
                      required: true,
                      message: 'Please input user id!',
                      whitespace: false,
                      type: 'number'
                    }
                  ]
                })(<InputNumber min={0} style={{ width: 250 }} />)}
              </FormItem>
            ) : (
              <FormItem
                validateStatus={errors[searchMode] ? 'error' : ''}
                help={errors[searchMode] || ''}
                label="Mobile"
              >
                {getFieldDecorator(this.state.searchMode, {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter mobile no!',
                      whitespace: false,
                      type: 'string'
                    },
                    {
                      min: 9,
                      max: 14,
                      message: 'Please enter a valid mobile no!'
                    }
                  ]
                })(
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: 250 }}
                    placeholder="Enter mobile no"
                  />
                )}
              </FormItem>
            )}
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.hasErrors(getFieldsError())}
                style={{ float: 'unset' }}
              >
                Search
              </Button>
            </FormItem>
            {isAudioRoomSearch ? (
              <>
                <Row type="flex" justify="center" className="mt10">
                  <Paragraph>&nbsp;&nbsp;OR&nbsp;&nbsp;</Paragraph>
                </Row>
                <Row type="flex" justify="center">
                  <FormItem>
                    <Button type="primary" onClick={this.getAudioRoomList}>
                      {'Search ' + cardTitle}
                    </Button>
                  </FormItem>
                </Row>
              </>
            ) : null}
          </Form>
          {!this.props.hideCsv ? (
            <React.Fragment>
              <Row type="flex" justify="center" className="mt10">
                <Paragraph>&nbsp;&nbsp;OR&nbsp;&nbsp;</Paragraph>
              </Row>
              <Row
                type="flex"
                justify="start"
                align="middle"
                style={{ alignItems: 'center' }}
              >
                <CSVReader
                  cssClass="csv-reader-input"
                  label={`Upload ${cardTitle} file`}
                  onFileLoaded={e => this.handleFileUpload(e)}
                />
                {this.state.isCsvRead ? (
                  <React.Fragment>
                    <Button
                      type="default"
                      onClick={this.processCsvData}
                      className="ml10"
                    >
                      Process Data
                    </Button>
                  </React.Fragment>
                ) : (
                  ''
                )}
              </Row>{' '}
            </React.Fragment>
          ) : null}
          {this.state.showprofilesList ? (
            <>
              <Divider />
              {this.state.profilesList.length > 1 ? (
                <Row type="flex" justify="end">
                  <Button
                    type="primary"
                    onClick={() => this.addAll('profilesList', 'userId')}
                  >
                    Add All
                  </Button>
                </Row>
              ) : null}
              <Row type="flex">
                {this.state.profilesList.length ? (
                  this.state.profilesList.map(user => {
                    const userId =
                      typeof user.id === 'object' ? user.id.low : user.id;
                    return (
                      <Card
                        style={{ width: 290 }}
                        key={userId}
                        actions={[
                          <Button
                            onClick={() =>
                              this.props.addData(
                                searchType,
                                String(userId),
                                user
                              )
                            }
                            size="small"
                          >
                            {this.props.searchUserActionCta || 'Add User'}
                          </Button>
                        ]}
                      >
                        <Meta
                          avatar={
                            <Avatar
                              src={
                                user.avatarUrl
                                  ? user.avatarUrl
                                  : typeof user.avatars === 'object' &&
                                    Object.keys(user.avatars).length
                                  ? user.avatars.regular || user.avatars.small
                                  : ''
                              }
                              size="large"
                            />
                          }
                          title={
                            <span>
                              <Row type="flex" justify="space-between">
                                <div>{user.displayName}</div>
                                <div>
                                  <Icon
                                    style={{ fontSize: '20px' }}
                                    type="info-circle"
                                    theme="twoTone"
                                    onClick={() => this.showInfoModal(user)}
                                  />
                                </div>
                              </Row>
                            </span>
                          }
                          description={
                            <span>
                              <div>
                                <b>User ID: </b>
                                {userId}
                              </div>
                              <div>
                                <b>Mobile: </b>
                                {user.mobileNumber}
                              </div>
                              <div>
                                <b>Is Pro: </b>
                                {String(user.isPro)}
                              </div>
                            </span>
                          }
                        />
                      </Card>
                    );
                  })
                ) : (
                  <Typography>
                    <Paragraph>No User Found</Paragraph>
                  </Typography>
                )}
              </Row>
            </>
          ) : null}
          {this.state.showgroupsList ? (
            <>
              <Divider />
              {this.state.groupsList.length > 1 ? (
                <Row type="flex" justify="end">
                  <Button
                    type="primary"
                    onClick={() => this.addAll('groupsList', 'channelUrl')}
                  >
                    Add All
                  </Button>
                </Row>
              ) : null}
              <Row type="flex">
                {this.state.groupsList.length ? (
                  this.state.groupsList.map(channel => {
                    return (
                      <Col
                        key={channel.channelUrl}
                        style={{ width: 330 }}
                        span={6}
                      >
                        <Card
                          title={<span>{channel.groupName}</span>}
                          actions={[
                            <Button
                              size="small"
                              onClick={() => {
                                this.props.addData(
                                  searchType,
                                  String(channel.channelUrl),
                                  channel
                                );
                              }}
                            >
                              Add Channel
                            </Button>
                          ]}
                          extra={
                            <Icon
                              style={{ fontSize: '20px' }}
                              type="info-circle"
                              theme="twoTone"
                              onClick={() => this.showInfoModal(channel)}
                            />
                          }
                        >
                          <Meta
                            avatar={<Avatar src={channel.groupImage} />}
                            title={
                              <span>
                                <b>Creator:</b>&nbsp;
                                {channel.creator.displayName}
                              </span>
                            }
                            description={
                              <span>
                                <span>
                                  <b>Channel Url:</b>&nbsp;
                                  {channel.channelUrl}
                                </span>
                                <br />
                                <span>
                                  <b>Mobile:</b>&nbsp;
                                  {channel.creator.mobileNumber}
                                </span>
                                <br />
                                <span>
                                  <b>Member Count:</b>&nbsp;
                                  {channel.memberCount
                                    ? channel.memberCount
                                    : 0}
                                </span>
                              </span>
                            }
                          />
                        </Card>
                      </Col>
                    );
                  })
                ) : (
                  <Typography>
                    <Paragraph>
                      No Channel found or user does not have enough permissions
                      to create a channel
                    </Paragraph>
                  </Typography>
                )}
              </Row>
            </>
          ) : null}
          {this.state.showroomsList ? (
            <>
              <Divider />
              {this.state.roomsList.length > 1 ? (
                <Row type="flex" justify="end">
                  <Button
                    type="primary"
                    onClick={() => this.addAll('roomsList', 'id')}
                  >
                    Add All
                  </Button>
                </Row>
              ) : null}
              <Row type="flex">
                {this.state.roomsList.length ? (
                  this.state.roomsList.map(item => (
                    <Col key={item.id} style={{ width: 290 }} span={6}>
                      <Card
                        title={
                          <span>
                            <span>{item.displayName}</span>
                            <span
                              style={{
                                background: item.theme,
                                width: '16px',
                                height: '16px',
                                color: '#fff',
                                marginLeft: 10
                              }}
                            >
                              {item.theme}
                            </span>
                          </span>
                        }
                        actions={[
                          <Button
                            size="small"
                            onClick={() => {
                              this.props.addData(
                                searchType,
                                String(item.id),
                                item
                              );
                            }}
                          >
                            Add Room
                          </Button>
                        ]}
                        extra={
                          <Icon
                            style={{ fontSize: '20px' }}
                            type="info-circle"
                            theme="twoTone"
                            onClick={() => this.showInfoModal(item)}
                          />
                        }
                      >
                        <Meta
                          avatar={<Avatar src={item.host.profile.avatarUrl} />}
                          title={item.host.profile.displayName}
                          description={
                            <span>
                              {' '}
                              <img
                                style={{ width: '24px' }}
                                src={IC_CASH}
                                alt=""
                              />{' '}
                              <span>
                                {item.host.cashEarned
                                  ? item.host.cashEarned
                                  : 0}{' '}
                                Earned
                              </span>{' '}
                            </span>
                          }
                        />
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Typography>
                    <Paragraph>No Active Audio Room Found</Paragraph>
                  </Typography>
                )}
                <Col style={{ marginTop: '16px' }} span={24}>
                  <Row type="flex" justify="end">
                    {this.state.pageNum > 1 && (
                      <Button
                        style={{
                          backgroundColor: '#323334',
                          color: 'white'
                        }}
                        onClick={() => this.goBack()}
                      >
                        Last
                      </Button>
                    )}
                    {this.state.fetchMoreFlag && (
                      <Button
                        style={{ marginLeft: 10 }}
                        onClick={() => this.fetchMoreAudioRooms()}
                      >
                        Next
                      </Button>
                    )}
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            ''
          )}
          {this.state.showliveStreamsList ? (
            <>
              <Divider />
              {this.state.liveStreamsList.length > 1 ? (
                <Row type="flex" justify="end">
                  <Button
                    type="primary"
                    onClick={() => this.addAll('liveStreamsList', 'id')}
                  >
                    Add All
                  </Button>
                </Row>
              ) : null}
              <Row type="flex">
                {this.state.liveStreamsList.length ? (
                  this.state.liveStreamsList.map(item => (
                    <Col key={item.id} style={{ width: 290 }} span={6}>
                      <Card
                        title={
                          <span>
                            <span>{item.displayName}</span>
                          </span>
                        }
                        actions={[
                          <Button
                            size="small"
                            onClick={() => {
                              this.props.addData(
                                searchType,
                                String(item.id),
                                item
                              );
                            }}
                          >
                            Add Live Stream
                          </Button>
                        ]}
                        extra={
                          <Icon
                            style={{ fontSize: '20px' }}
                            type="info-circle"
                            theme="twoTone"
                            onClick={() => this.showInfoModal(item)}
                          />
                        }
                      >
                        <Meta
                          avatar={<Avatar src={item.host.profile.avatarUrl} />}
                          title={item.host.profile.displayName}
                          description={
                            <span>
                              {' '}
                              <img
                                style={{ width: '24px' }}
                                src={IC_CASH}
                                alt=""
                              />{' '}
                              <span>
                                {item.totalMoneyEarned
                                  ? item.totalMoneyEarned
                                  : 0}{' '}
                                Earned
                              </span>{' '}
                            </span>
                          }
                        />
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Typography>
                    <Paragraph>No Active Live Stream Found</Paragraph>
                  </Typography>
                )}
              </Row>
            </>
          ) : (
            ''
          )}
          <Modal
            title={'Details'}
            closable={true}
            maskClosable={true}
            width={800}
            onCancel={this.hideModal}
            onOk={this.hideModal}
            visible={this.state.showModal}
          >
            <Card bordered={false}>
              {JSON.stringify(this.state.selectedItemForInfo, null, 4)}
            </Card>
          </Modal>
        </Card>
      </React.Fragment>
    );
  }
}

const SearchComponentForm = Form.create({ name: 'Search Component ' })(
  SearchComponent
);

const mapStateToProps = state => ({
  getProfileByMobileResponse: state.userProfile.getProfileByMobileResponse,
  getProfileByIdResponse: state.userProfile.getProfileByIdResponse,
  getBasicUserDetailListResponse: state.userData.getBasicUserDetailListResponse,
  getChannelsByUserResponse: state.asn.getChannelsByUserResponse,
  getLiveStreamsByUserResponse: state.asn.getLiveStreamsByUserResponse,
  getAudioRoomsByUserResponse: state.asn.getAudioRoomsByUserResponse,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchComponentForm);
