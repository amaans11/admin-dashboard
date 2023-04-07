import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  notification,
  Row,
  Table,
  Tag,
  Tooltip,
  Typography,
  Popconfirm,
  Avatar
} from 'antd';
import { SendBirdProvider, OpenChannel } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';
import '../../styles/components/broadcast.css';
import {
  getZKConfigForGB,
  getBroadcastDetails,
  getSendbirdToken,
  startBroadcastGB,
  stopBroadcastGB
} from '../../actions/broadcastActions';
import moment from 'moment';
import { isEmpty } from 'lodash';
const { Paragraph } = Typography;
const GB_DETAILS_POLLING_IN_MS = 5000;

class GBLivePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gbConfig: {},
      broadcastDetails: {},
      battles: [],
      accessToken: '',
      gameBroadcastId: null,
      isLoading: false
    };
    this.pollingRef = null;
  }

  componentDidMount() {
    this.getGBConfigs();
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  stopPolling = () => {
    clearTimeout(this.pollingRef);
    this.pollingRef = null;
  };

  getGbDetails = () => {
    const params = new URLSearchParams(this.props.location.search);
    const gbId = params.get('gbId');
    const { gbConfig } = this.state;
    const pollingTimeInterval =
      gbConfig.gbDetailsPollingTimeInMs || GB_DETAILS_POLLING_IN_MS;

    if (!!gbId) {
      this.setState({ gameBroadcastId: gbId, pollingTimeInterval }, () => {
        this.getBroadcast();
      });
    } else {
      notification.warn({
        message: 'Invalid broadcast!',
        description: 'Please go to schedule page and select a broadcast',
        duration: 4
      });
    }
  };

  getGBConfigs = () => {
    this.props.actions.getZKConfigForGB().then(() => {
      const { config } = this.props.getZKConfigForGBResponse;
      this.setState({ gbConfig: config }, () => {
        this.getGbDetails();
      });
    });
  };

  getBroadcast = () => {
    const { gameBroadcastId, pollingTimeInterval } = this.state;
    this.setState({ isLoading: true });

    this.props.actions
      .getBroadcastDetails({ gameBroadcastId })
      .then(() => {
        const { gameBroadcast = {}, battleDetails = [] } =
          this.props.getBroadcastDetailsResponse || {};
        const { broadcasterSendBirdUserId } = gameBroadcast;

        if (!isEmpty(battleDetails)) {
          clearTimeout(this.poolingRef);
          this.pollingRef = null;
        } else {
          this.pollingRef = setTimeout(this.getBroadcast, pollingTimeInterval);
        }

        this.setState({
          broadcastDetails: gameBroadcast,
          battles: battleDetails,
          userId: broadcasterSendBirdUserId,
          isLoading: false
        });

        // Get sendbird access token
        this.getToken(broadcasterSendBirdUserId); // MOve this somewhere else
      })
      .catch(err => {
        message.error('Unable to refresh data, please refresh page!', err);
        clearTimeout(this.poolingRef);
        this.pollingRef = null;
      });
  };

  getToken = sendbirdUserId => {
    this.props.actions.getSendbirdToken({ sendbirdUserId }).then(() => {
      const { accessToken = {} } = this.props.getSendbirdTokenResponse || {};

      this.setState({ accessToken });
    });
  };

  goLive = () => {
    const { gameBroadcastId } = this.state.broadcastDetails;
    this.props.actions.startBroadcastGB({ gameBroadcastId }).then(() => {
      // console.log(this.props.startBroadcastGBResponse);
      this.getBroadcast();
      this.stopPolling();
    });
  };

  endLive = () => {
    const { gameBroadcastId } = this.state.broadcastDetails;
    this.props.actions.stopBroadcastGB({ gameBroadcastId }).then(() => {
      // console.log(this.props.stopBroadcastGBResponse);
      this.getBroadcast();
      this.stopPolling();
    });
  };

  showInfoModal = () => {
    this.setState({
      isInfoModalVisible: true
    });
  };

  hideInfoModal = () => {
    this.setState({
      isInfoModalVisible: false
    });
  };

  render() {
    const {
      gbConfig,
      broadcastDetails,
      battles,
      userId,
      accessToken,
      isInfoModalVisible,
      isLoading
    } = this.state;

    const columns = [
      {
        title: 'Battle ID',
        dataIndex: 'battleId',
        key: 'battleId',
        render: text => <Paragraph ellipsis={{ rows: 1 }}>{text}</Paragraph>
      },
      {
        title: 'Start',
        dataIndex: 'battleStartTime',
        key: 'battleStartTime',
        render: text => (
          <span>{moment(parseInt(text, 10)).format('HH:mm A')}</span>
        )
      },
      {
        title: 'End',
        dataIndex: 'battleEndTime',
        key: 'battleEndTime',
        render: text => (
          <span>{moment(parseInt(text, 10)).format('HH:mm A')}</span>
        )
      },
      {
        title: 'Status',
        dataIndex: 'battleStatus',
        key: 'battleStatus'
      },
      {
        title: 'Auth Token',
        dataIndex: 'authToken',
        key: 'authToken',
        render: text =>
          !!text ? (
            <Paragraph copyable={true} ellipsis={{ rows: 1 }}>
              {text}
            </Paragraph>
          ) : (
            <em>not-assigned</em>
          )
      },
      {
        title: 'Players',
        dataIndex: 'playerProfiles',
        key: 'playerProfiles',
        render: text =>
          !!text ? (
            <div ellipsis={{ rows: 1 }}>
              {text.map((profData, ind) => (
                <div
                  style={{
                    border: '2px solid grey',
                    borderRadius: '8px',
                    width: '150px',
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: '#EEEEEE',
                    alignItems: 'center',
                    margin: '3px'
                  }}
                  key={ind}
                >
                  <div>
                    {profData.profilePic ? (
                      <Avatar src={profData.profilePic} alt="profile_pic" />
                    ) : (
                      <Avatar icon="user" />
                    )}
                  </div>
                  <div
                    style={{
                      width: '120px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft: '8px'
                    }}
                  >
                    <Tooltip title={`User ID : ${profData.userId}`}>
                      {profData.name ? profData.name : profData.userName}
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <em>not-assigned</em>
          )
      }
    ];

    return (
      <Card
        className="page-container"
        title={
          <div>
            <strong>{broadcastDetails.title}: </strong>
            <span>{broadcastDetails.displayTournamentName} - </span>
            <span>{broadcastDetails.displayRoundName}</span>:{' '}
            <em>{broadcastDetails.gameBroadcastId}</em>
          </div>
        }
      >
        <Row>
          <Col span={15}>
            <Table
              bordered
              columns={columns}
              rowKey={record => record.battleId}
              dataSource={battles}
              loading={isLoading}
              pagination={false}
              scroll={{ x: true }}
            />

            <div style={{ marginTop: '1rem' }}>
              <strong>Start Time:</strong>
              {broadcastDetails.startTime ? (
                <>
                  <span>
                    {moment(parseInt(broadcastDetails.startTime, 10)).format(
                      'YYYY MMM DD hh:mm:ss A'
                    )}
                  </span>
                  <span>
                    (
                    <em>
                      {moment(
                        parseInt(broadcastDetails.startTime, 10)
                      ).fromNow()}
                    </em>
                    )
                  </span>
                </>
              ) : (
                'not assigned'
              )}
            </div>

            <div>
              <strong>End Time:</strong>
              {broadcastDetails.endTime ? (
                <>
                  <span>
                    {moment(parseInt(broadcastDetails.endTime, 10)).format(
                      'YYYY MMM DD hh:mm:ss A'
                    )}
                  </span>
                  (
                  <span>
                    <em>
                      {moment(parseInt(broadcastDetails.endTime, 10)).fromNow()}
                    </em>
                  </span>
                  )
                </>
              ) : (
                'not assigned'
              )}
            </div>

            <Typography style={{ margin: '1rem auto', wordBreak: 'break-all' }}>
              <strong>RTMP URL:</strong>
              {broadcastDetails.rtmpUrl ? (
                <Paragraph copyable={true}>
                  {broadcastDetails.rtmpUrl}
                </Paragraph>
              ) : (
                'not assigned'
              )}
            </Typography>
            <Tag color="red">
              NOTE: Please start streaming from OBS to the given RTMP URL before
              clicking on the Go Live button
            </Tag>

            <div style={{ marginTop: '1rem' }}>
              <Tooltip
                placement="topLeft"
                title="Show more details"
                arrowPointAtCenter
              >
                <Button
                  icon="info-circle"
                  type="primary"
                  ghost
                  onClick={() => this.showInfoModal()}
                >
                  More Info
                </Button>
              </Tooltip>
            </div>

            <Divider />

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              {broadcastDetails.status === 'UPCOMING' ? (
                <Popconfirm
                  title="Have you started streaming to the given RTMP URL?"
                  onConfirm={this.goLive}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" style={{ fontSize: '1.1rem' }}>
                    Go Live
                  </Button>
                </Popconfirm>
              ) : broadcastDetails.status === 'LIVE' ? (
                <Button
                  type="danger"
                  onClick={this.endLive}
                  style={{ fontSize: '1.1rem' }}
                >
                  End Live
                </Button>
              ) : (
                ''
              )}
            </div>
          </Col>

          <Col span={9} style={{ paddingLeft: '1rem' }}>
            {gbConfig.sbAppId && userId && accessToken ? (
              <SendBirdProvider
                appId={gbConfig.sbAppId}
                userId={userId}
                accessToken={accessToken}
              >
                <div
                  style={{
                    height: 'calc(100vh - 180px)',
                    border: '1px solid #999'
                  }}
                >
                  <OpenChannel
                    useMessageGrouping={true}
                    disableUserProfile={true}
                    channelUrl={broadcastDetails.sendBirdChannelUrl}
                    renderMessageInput={() => <span></span>}
                  />
                </div>
              </SendBirdProvider>
            ) : (
              <div>Loading...</div>
            )}
          </Col>
        </Row>

        <Modal
          title="Broadcast Info"
          visible={isInfoModalVisible}
          onOk={this.hideInfoModal}
          onCancel={this.hideInfoModal}
          footer={null}
          wrapClassName="create-broadcast-pop"
          destroyOnClose={true}
        >
          <pre>
            <code>
              broadcastDetails: {JSON.stringify(broadcastDetails, null, 2)}
            </code>
          </pre>

          <pre>
            <code>battles: {JSON.stringify(battles, null, 2)}</code>
          </pre>
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getZKConfigForGBResponse: state.broadcast.getZKConfigForGBResponse,
  getBroadcastDetailsResponse: state.broadcast.getBroadcastDetailsResponse,
  liveBroadcast: state.broadcast.liveBroadcast,
  getSendbirdTokenResponse: state.broadcast.getSendbirdTokenResponse,
  startBroadcastGBResponse: state.broadcast.startBroadcastGBResponse,
  stopBroadcastGBResponse: state.broadcast.stopBroadcastGBResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getZKConfigForGB,
      getBroadcastDetails,
      getSendbirdToken,
      startBroadcastGB,
      stopBroadcastGB
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GBLivePage);
