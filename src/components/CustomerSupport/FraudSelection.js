import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Card,
  Form,
  message,
  Button,
  Spin,
  Row,
  Col,
  Select,
  Table,
  DatePicker,
  Modal
} from 'antd';
import * as crmActions from '../../actions/crmActions';
import * as gameActions from '../../actions/gameActions';
import * as fraudActions from '../../actions/fraudActions';

const { Option } = Select;
const { RangePicker } = DatePicker;
class FraudSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getRequestType: null,
      gameId: null,
      fraudActivityData: [],
      fraudActivityDataFetched: false,
      blockingInfoData: [],
      blockingInfoDataFetched: false,
      showContentModal: false,
      blockingInfoV2DataFetched: false,
      deviceIdBlockingInfoFetched: false,
      mlFraudDetails: {},
      contentType: '',
      isMlResponse: false
    };
  }

  componentDidMount() {
    this.getGamesList();
    this.setState({ userId: this.props.userId });
  }

  getGamesList() {
    var gamesList = [];
    this.props.actions.fetchGames().then(() => {
      gamesList.push(
        <Option key={'game' + 0} value={0}>
          All
        </Option>
      );
      if (this.props.gamesList) {
        this.props.gamesList.map(game => {
          gamesList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
      }
    });
    this.setState({
      gamesList
    });
  }

  selectFraudActivityInfo() {
    this.setState({
      getRequestType: 'FRAUD_ACTIVITY_INFO'
    });
  }

  selectBlockingInfo() {
    this.setState({
      getRequestType: 'BLOCKING_INFO'
    });
  }

  selectBlockingInfoV2() {
    this.setState({
      getRequestType: 'BLOCKING_INFO_V2'
    });
    let data = {
      userId: this.state.userId
    };
    this.props.actions.getUserBlockingInfoV2(data).then(() => {
      if (this.props.getUserBlockingInfoV2Response) {
        if (this.props.getUserBlockingInfoV2Response.error) {
          message.error(
            this.props.getUserBlockingInfoV2Response.error.message
              ? this.props.getUserBlockingInfoV2Response.error
              : 'Could not fetch the details'
          );
        } else {
          this.setState({
            blockingInfoV2: { ...this.props.getUserBlockingInfoV2Response },
            blockingInfoDataFetched: false,
            fraudActivityDataFetched: false,
            blockingInfoV2DataFetched: true,
            deviceIdBlockingInfoFetched: false
          });
        }
      }
    });
  }

  selectDeviceInfoBlock() {
    this.setState({
      getRequestType: 'DEVICE_INFO_BLOCK'
    });
    let data = {
      userId: this.state.userId
    };
    this.props.actions.getDeviceBlockingInfo(data).then(() => {
      if (this.props.getDeviceBlockingInfoResponse) {
        console.log(this.props.getDeviceBlockingInfoResponse);
        if (this.props.getDeviceBlockingInfoResponse.error) {
          message.error(
            this.props.getDeviceBlockingInfoResponse.error.message
              ? this.props.getDeviceBlockingInfoResponse.error
              : 'Could not fetch the details'
          );
        } else {
          this.setState({
            deviceIdBlockingInfo: {
              ...this.props.getDeviceBlockingInfoResponse
            },
            blockingInfoDataFetched: false,
            fraudActivityDataFetched: false,
            blockingInfoV2DataFetched: false,
            deviceIdBlockingInfoFetched: true
          });
        }
      }
    });
  }

  gameSelected(gameId) {
    this.setState({
      gameId: gameId
    });
  }

  selectDates(dates) {
    this.setState({
      startDate: moment(dates[0]).toISOString(true),
      endDate: moment(dates[1]).toISOString(true)
    });
  }

  getInformation() {
    let data = {
      userId: this.state.userId,
      gameId: this.state.gameId,
      startDate: this.state.startDate ? this.state.startDate : null,
      endDate: this.state.endDate ? this.state.endDate : null
    };
    if (this.state.getRequestType === 'FRAUD_ACTIVITY_INFO') {
      this.props.actions.getFraudActivityInfo(data).then(() => {
        if (this.props.getFraudActivityInfoResponse) {
          this.props.actions
            .getMlFraudActivityInfo({
              ...data,
              countryId: this.props.countryCode
            })
            .then(() => {
              if (
                this.props.mlFraudActivity &&
                this.props.mlFraudActivity.fraudInfoList &&
                this.props.mlFraudActivity.fraudInfoList.length > 0
              ) {
                let res = [];
                this.props.mlFraudActivity.fraudInfoList.map(mlFraud => {
                  res.push({
                    createdOn: mlFraud.createdOn,
                    actionTaken: mlFraud.actionTaken,
                    extraInfo: mlFraud.extraInfo,
                    gamePlayId: mlFraud.battleId,
                    gameId: mlFraud.gameId,
                    reason: '',
                    userId: this.props.userId,
                    scoreJson: mlFraud.scoreJson,
                    minProbabilityFraud: mlFraud.minProbabilityFraud,
                    mlResponse: mlFraud.mlResponse,
                    fraudCheckCategory: mlFraud.fraudCheckCategory,
                    isMlResponse: true
                  });
                });
                let activityData = [];
                if (
                  this.props.getFraudActivityInfoResponse.fraudInfoList &&
                  this.props.getFraudActivityInfoResponse.fraudInfoList.length >
                    0
                ) {
                  activityData = [
                    ...res,
                    ...this.props.getFraudActivityInfoResponse.fraudInfoList
                  ];
                } else {
                  activityData = [...res];
                }
                const sortedData = activityData.sort(
                  (a, b) =>
                    new moment(b.createdOn).format('x') -
                    new moment(a.createdOn).format('x')
                );

                this.setState({
                  fraudActivityData: sortedData,
                  fraudActivityDataFetched: true,
                  blockingInfoDataFetched: false,
                  blockingInfoV2DataFetched: false
                });
              } else {
                this.setState({
                  fraudActivityData: this.props.getFraudActivityInfoResponse
                    .fraudInfoList,
                  fraudActivityDataFetched: true,
                  blockingInfoDataFetched: false,
                  blockingInfoV2DataFetched: false
                });
              }
            });
        }
      });
    } else {
      this.props.actions.getUserBlockingInfo(data).then(() => {
        if (this.props.getUserBlockingInfoResponse) {
          let blockingInfoData =
            this.props.getUserBlockingInfoResponse.gameWiseBlockingInfoList &&
            this.props.getUserBlockingInfoResponse.gameWiseBlockingInfoList
              .length > 0
              ? [
                  ...this.props.getUserBlockingInfoResponse
                    .gameWiseBlockingInfoList
                ]
              : [];
          this.setState({
            blockingInfoData,
            blockingInfoDataFetched: true,
            fraudActivityDataFetched: false,
            blockingInfoV2DataFetched: false,
            deviceIdBlockingInfoFetched: false
          });
        }
      });
    }
  }
  getFraudMlDetails = record => {
    const mlDetails = {
      z_score: JSON.stringify(record.z_score)
        ? JSON.stringify(record.z_score)
        : 0,
      final_score: JSON.stringify(record.final_score)
        ? JSON.stringify(record.final_score)
        : 0,
      minProbabilityFraud: record.minProbabilityFraud,
      fraudCheckCategory: record.fraudCheckCategory
    };
    return mlDetails;
  };

  showContent(record, type) {
    let modalString = '';
    let mlDetails = {};
    switch (type) {
      case 'SCORE':
        mlDetails = {};
        modalString = JSON.stringify(JSON.parse(record.scoreJson));
        break;
      case 'REASON':
        mlDetails = this.getFraudMlDetails(record);
        modalString = record.reason;
        break;
      case 'EXTRA':
        mlDetails = {};
        modalString = record.extraInfo;
        break;
      case 'FOUL_PLAY':
        mlDetails = {};
        modalString = record.foulPlayTIds;
      default:
        break;
    }
    this.setState({
      modalString,
      showContentModal: true,
      contentType: type,
      mlFraudDetails: mlDetails,
      isMlResponse: record.isMlResponse ? record.isMlResponse : false
    });
  }

  closeContentModal() {
    this.setState({ modalString: '', showContentModal: false });
  }

  render() {
    const {
      mlFraudDetails,
      fraudActivityData,
      contentType,
      isMlResponse
    } = this.state;
    const fraudTableColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Game Id',
        dataIndex: 'gameId',
        key: 'gameId'
      },
      {
        title: 'Game Play Id',
        dataIndex: 'gamePlayId',
        key: 'gamePlayId'
      },
      {
        title: 'Action Taken',
        dataIndex: 'actionTaken',
        key: 'actionTaken'
      },
      {
        title: 'Created On',
        key: 'createdOn',
        render: (text, record) => (
          <span>
            {record.createdOn
              ? moment(record.createdOn).format('DD/MM/YY hh:mm A')
              : ''}
          </span>
        )
      },
      {
        title: 'Reason',
        key: 'reason',
        render: (text, record) => (
          <Button
            size="small"
            onClick={() => this.showContent(record, 'REASON')}
          >
            Show Reason
          </Button>
        )
      },
      {
        title: 'Score Json',
        key: 'scoreJson',
        render: (text, record) => (
          <Button
            size="small"
            onClick={() => this.showContent(record, 'SCORE')}
          >
            Show Score Json
          </Button>
        )
      },
      {
        title: 'extraInfo',
        key: 'extraInfo',
        render: (text, record) => (
          <span>
            {record.extraInfo.length < 21 ? (
              <span>{record.extraInfo}</span>
            ) : (
              <Button
                size="small"
                onClick={() => this.showContent(record, 'EXTRA')}
              >
                Show Extra Info
              </Button>
            )}
          </span>
        )
      }
    ];

    const blockingTableColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
        width: '9%'
      },
      {
        title: 'Game Id',
        dataIndex: 'gameId',
        key: 'gameId',
        width: '5%'
      },
      {
        title: 'Block Start Date',
        key: 'blockStartDate',
        width: '10%',
        render: (text, record) => (
          <span>
            {record.blockStartDate
              ? moment(record.blockStartDate).format('DD/MM/YY hh:mm A')
              : ''}
          </span>
        )
      },
      {
        title: 'Block End Date',
        key: 'blockEndDate',
        width: '10%',
        render: (text, record) => (
          <span>
            {record.blockEndDate
              ? moment(record.blockEndDate).format('DD/MM/YY hh:mm A')
              : ''}
          </span>
        )
      },
      {
        title: 'Reason',
        key: 'reason',
        width: '12%',
        render: (text, record) => (
          <Button
            size="small"
            onClick={() => this.showContent(record, 'REASON')}
          >
            Show Reason
          </Button>
        )
      },
      {
        title: 'UnBlocked By',
        dataIndex: 'unBlockedBy',
        key: 'unBlockedBy',
        width: '14%'
      },
      {
        title: 'Blocked By',
        dataIndex: 'blockedBy',
        key: 'blockedBy',
        width: '14%'
      },
      {
        title: 'foulPlayTIds',
        key: 'foulPlayTIds',
        width: '18%',
        render: (text, record) => (
          <Button
            size="small"
            onClick={() => this.showContent(record, 'FOUL_PLAY')}
          >
            Show Foul Play TIds
          </Button>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '8%'
      }
    ];

    return (
      <React.Fragment>
        <Card>
          <Button
            onClick={() => this.selectFraudActivityInfo()}
            type={
              this.state.getRequestType === 'FRAUD_ACTIVITY_INFO'
                ? 'primary'
                : 'default'
            }
          >
            Fraud Activity Info
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => this.selectBlockingInfo()}
            type={
              this.state.getRequestType === 'BLOCKING_INFO'
                ? 'primary'
                : 'default'
            }
          >
            Blocking Info
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => this.selectBlockingInfoV2()}
            type={
              this.state.getRequestType === 'BLOCKING_INFO_V2'
                ? 'primary'
                : 'default'
            }
          >
            Blocking Info V2
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => this.selectDeviceInfoBlock()}
            type={
              this.state.getRequestType === 'DEVICE_INFO_BLOCK'
                ? 'primary'
                : 'default'
            }
          >
            Device Block Info
          </Button>
        </Card>
        {this.state.getRequestType &&
          this.state.getRequestType !== 'BLOCKING_INFO_V2' &&
          this.state.getRequestType !== 'DEVICE_INFO_BLOCK' && (
            <Card>
              <Row>
                <Col span={24}>
                  <Col
                    span={8}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Game:
                  </Col>
                  <Col span={16}>
                    <Select
                      showSearch
                      onSelect={e => this.gameSelected(e)}
                      style={{ width: 500, marginTop: '12px' }}
                      placeholder="Select a Game"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.gamesList}
                    </Select>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col
                    span={8}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Time Period:
                  </Col>
                  <Col span={16}>
                    <RangePicker
                      style={{ marginTop: '12px', width: 500 }}
                      allowClear="true"
                      showTime={{ format: 'hh:mm A', use12Hours: true }}
                      format="YYYY-MM-DD hh:mm A"
                      onChange={e => this.selectDates(e)}
                      placeholder={['Start Time', 'End Time']}
                    />
                  </Col>
                </Col>
                <Col span={24}>
                  <Col
                    offset={12}
                    style={{
                      lineHeight: '30px',
                      marginTop: '12px'
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={() => this.getInformation()}
                    >
                      Submit
                    </Button>
                  </Col>
                </Col>
              </Row>
              {this.state.fraudActivityDataFetched && (
                <Table
                  style={{ marginTop: '20px' }}
                  rowKey="gamePlayId"
                  bordered
                  dataSource={this.state.fraudActivityData}
                  pagination={{ pageSize: 20 }}
                  columns={fraudTableColumns}
                  scroll={{ x: '100%' }}
                />
              )}
              {this.state.blockingInfoDataFetched && (
                <Table
                  style={{ marginTop: '20px' }}
                  rowKey="blockStartDate"
                  bordered
                  dataSource={this.state.blockingInfoData}
                  pagination={{ pageSize: 20 }}
                  columns={blockingTableColumns}
                  scroll={{ x: '100%' }}
                />
              )}
            </Card>
          )}
        {this.state.blockingInfoV2DataFetched &&
          this.state.getRequestType === 'BLOCKING_INFO_V2' && (
            <Card>
              <Row>
                <Col span={12}>
                  {' '}
                  <strong>User Id: </strong> {this.state.blockingInfoV2.userId}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Mobile Number: </strong>{' '}
                  {this.state.blockingInfoV2.mobileNumber}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Device Id:</strong>{' '}
                  {this.state.blockingInfoV2.deviceId}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Start Time: </strong>{' '}
                  {this.state.blockingInfoV2.blockStartTime
                    ? moment(this.state.blockingInfoV2.blockStartTime).format(
                        'DD/MM/YY hh:mm A'
                      )
                    : ''}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block End Time: </strong>{' '}
                  {this.state.blockingInfoV2.blockEndTime
                    ? moment(this.state.blockingInfoV2.blockEndTime).format(
                        'DD/MM/YY hh:mm A'
                      )
                    : ''}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Offence Count: </strong>{' '}
                  {this.state.blockingInfoV2.offenceCount
                    ? this.state.blockingInfoV2.offenceCount
                    : 0}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Duration: </strong>{' '}
                  {this.state.blockingInfoV2.blockDuration
                    ? this.state.blockingInfoV2.blockDuration
                    : 0}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Type: </strong>{' '}
                  {this.state.blockingInfoV2.blockType}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Reason: </strong> {this.state.blockingInfoV2.reason}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Last Fraud Detected GameId: </strong>{' '}
                  {this.state.blockingInfoV2.lastFraudDetectedGameId}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Last Fraud Detected Game Name: </strong>{' '}
                  {this.state.blockingInfoV2.lastFraudDetectedGameName}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Blocked By: </strong>{' '}
                  {this.state.blockingInfoV2.blockedBy}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Unblocked By: </strong>{' '}
                  {this.state.blockingInfoV2.unblockedBy}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Unblock Reason: </strong>{' '}
                  {this.state.blockingInfoV2.unBlockReason}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Unblock Doc: </strong>{' '}
                  {this.state.blockingInfoV2.unBlockDoc}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Description: </strong>{' '}
                  {this.state.blockingInfoV2.description}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Other Reason: </strong>{' '}
                  {this.state.blockingInfoV2.otherReason
                    ? this.state.blockingInfoV2.otherReason
                    : 'NA'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Reported By: </strong>{' '}
                  {this.state.blockingInfoV2.reportedBy}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Doc: </strong>{' '}
                  <a href={this.state.blockingInfoV2.blockDoc}>
                    {this.state.blockingInfoV2.blockDoc}
                  </a>
                </Col>
                <Col span={24}>
                  {' '}
                  <strong>Extra Info: </strong>{' '}
                  {this.state.blockingInfoV2.extraInfo}
                </Col>
              </Row>
            </Card>
          )}
        {this.state.deviceIdBlockingInfoFetched &&
          this.state.getRequestType === 'DEVICE_INFO_BLOCK' && (
            <Card>
              <Row>
                <Col span={12}>
                  {' '}
                  <strong>User Id: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.userId}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Mobile Number: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.mobileNumber}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Device Id:</strong>{' '}
                  {this.state.deviceIdBlockingInfo.deviceId}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Start Time: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.blockStartTime
                    ? moment(
                        this.state.deviceIdBlockingInfo.blockStartTime
                      ).format('DD/MM/YY hh:mm A')
                    : ''}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block End Time: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.blockEndTime
                    ? moment(
                        this.state.deviceIdBlockingInfo.blockEndTime
                      ).format('DD/MM/YY hh:mm A')
                    : ''}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Offence Count: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.offenceCount
                    ? this.state.deviceIdBlockingInfo.offenceCount
                    : 0}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Duration: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.blockDuration
                    ? this.state.deviceIdBlockingInfo.blockDuration
                    : 0}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Type: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.blockType}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Reason: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.reason}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Last Fraud Detected GameId: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.lastFraudDetectedGameId}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Last Fraud Detected Game Name: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.lastFraudDetectedGameName}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Blocked By: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.blockedBy}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Unblocked By: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.unblockedBy}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Unblock Reason: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.unBlockReason}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Unblock Doc: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.unBlockDoc}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Block Doc: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.blockDoc}
                </Col>
                <Col span={24}>
                  {' '}
                  <strong>Extra Info: </strong>{' '}
                  {this.state.deviceIdBlockingInfo.extraInfo}
                </Col>
              </Row>
            </Card>
          )}
        <Modal
          title={'Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeContentModal()}
          onCancel={() => this.closeContentModal()}
          visible={this.state.showContentModal}
          footer={[
            <Button onClick={() => this.closeContentModal()}>Close</Button>
          ]}
        >
          <Card>
            {this.state.modalString}
            {this.state.getRequestType === 'FRAUD_ACTIVITY_INFO' &&
              contentType == 'REASON' &&
              isMlResponse &&
              Object.keys(this.state.mlFraudDetails).length > 0 && (
                <React.Fragment>
                  <div>
                    Fraud Check Category : {mlFraudDetails.fraudCheckCategory}
                  </div>
                  <div>Z Score : {mlFraudDetails.z_score}</div>
                  <div>Final Score : {mlFraudDetails.final_score}</div>
                  <div>
                    Min Probability Fraud : {mlFraudDetails.minProbabilityFraud}
                  </div>
                </React.Fragment>
              )}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames,
    getFraudActivityInfoResponse: state.crm.getFraudActivityInfoResponse,
    getUserBlockingInfoResponse: state.crm.getUserBlockingInfoResponse,
    getUserBlockingInfoV2Response: state.crm.getUserBlockingInfoV2Response,
    getDeviceBlockingInfoResponse: state.crm.getDeviceBlockingInfoResponse,
    mlFraud: state.fraud.mlFraud,
    mlFraudActivity: state.fraud.mlFraudActivity
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...crmActions, ...gameActions, ...fraudActions },
      dispatch
    )
  };
}

const FraudSelectionForm = Form.create()(FraudSelection);
export default connect(mapStateToProps, mapDispatchToProps)(FraudSelectionForm);
