import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Row,
  Col,
  Modal,
  Card,
  Button,
  Icon,
  Typography,
  Avatar,
  Popconfirm,
  message
} from 'antd';
import * as asnActions from '../../actions/asnActions';
import IC_CASH from '../../assets/ic_cash.png';
const { Meta } = Card;
const { Title } = Typography;
class LiveStreamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      pageSize: 10,
      pageNum: 1,
      liveStreamList: [],
      fetchMoreFlag: true,
      showModal: false,
      selectedStream: {}
    };
  }

  componentDidMount() {
    this.getLiveStreamList();
  }

  closeStream = id => {};

  fetchMore = () => {
    let currentCount = this.state.pageNum;
    this.setState({ pageNum: currentCount + 1 }, () => {
      this.getLiveStreamList();
    });
  };

  getLiveStreamList = () => {
    let data = {
      offset: (this.state.pageNum - 1) * this.state.pageSize,
      count: 10
    };
    this.props.actions.getLiveStreamList(data).then(() => {
      if (this.props.getLiveStreamListResponse.liveStreams) {
        this.setState({
          liveStreamList: [...this.props.getLiveStreamListResponse.liveStreams],
          showList: true
        });
        if (this.props.getLiveStreamListResponse.liveStreams.length >= 10) {
          this.setState({ fetchMoreFlag: true });
        } else {
          this.setState({ fetchMoreFlag: false });
        }
      } else {
        this.setState({
          liveStreamList: [],
          showList: true,
          fetchMoreFlag: false
        });
      }
    });
  };
  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  showModal = item => {
    this.setState({
      showModal: true,
      selectedStream: item
    });
  };

  closeLiveStream = (streamId, userId) => {
    this.props.actions
      .endLiveStream({
        streamId,
        userId,
        isChannelDataRequired: false
      })
      .then(() => {
        if (this.props.endLiveStreamResponse.liveStream) {
          message
            .success('Closed Successfulluy', 1.5)
            .then(() => window.location.reload());
        }
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.showList ? (
          <Card title="Active Live Streams" style={{ margin: 20 }}>
            <Row>
              <Col span={24}>
                <Row type="flex">
                  {this.state.liveStreamList.length ? (
                    this.state.liveStreamList.map(item => (
                      <Col
                        key={item.id}
                        style={{ width: 290, margin: 10 }}
                        span={6}
                      >
                        <Card
                          title={
                            <span>
                              <span>{item.displayName}</span>
                            </span>
                          }
                          actions={[
                            <Popconfirm
                              title="Are you sure that you want to close the live stream?"
                              onConfirm={() =>
                                this.closeLiveStream(
                                  item.id,
                                  item.host.userId.low
                                )
                              }
                            >
                              <Button size="small" type="danger">
                                Close Stream
                              </Button>
                            </Popconfirm>
                          ]}
                          extra={
                            <Icon
                              style={{ fontSize: '20px' }}
                              type="info-circle"
                              theme="twoTone"
                              onClick={() => this.showModal(item)}
                            />
                          }
                        >
                          <Meta
                            avatar={
                              <Avatar src={item.host.profile.avatarUrl} />
                            }
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
                    <Row type="flex" justify="center">
                      <Col span={24}>
                        <Typography>
                          <Title level={3}>
                            No Active Live Stream is Available.
                          </Title>
                        </Typography>
                      </Col>
                    </Row>
                  )}
                </Row>
                <Row type="flex" justify="end" style={{ margin: '16px' }}>
                  {this.state.pageNum > 1 && (
                    <Button
                      style={{ backgroundColor: '#323334', color: 'white' }}
                      onClick={() => this.goBack()}
                    >
                      Last
                    </Button>
                  )}
                  {this.state.fetchMoreFlag && (
                    <Button onClick={() => this.fetchMore()}>Next</Button>
                  )}
                </Row>
              </Col>
            </Row>
          </Card>
        ) : (
          ''
        )}
        <Modal
          title={'Live Stream Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          visible={this.state.showModal}
        >
          <Card bordered={false}>
            {JSON.stringify(this.state.selectedStream, null, 4)}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  getLiveStreamListResponse: state.asn.getLiveStreamListResponse,
  endLiveStreamResponse: state.asn.endLiveStreamResponse,
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...asnActions }, dispatch)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveStreamList);
