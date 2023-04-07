import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Tooltip
} from 'antd';
import '../../styles/components/broadcast.css';
import { getBroadcasterStreamsForGB } from '../../actions/broadcastActions';
import moment from 'moment';
import { GB_BROADCAST_STATUS, stringSort } from '../../shared/util';

const { RangePicker } = DatePicker;
const { Option } = Select;

const START_TIME_OFFSET = 0;
const END_TIME_OFFSET = 7;
class GBSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameBroadcasts: [],
      startTime: '',
      endTime: '',
      statuses: [0, 1],
      pageNum: 1,
      perPage: 100,
      isLoading: false,
      broadcastStatus: GB_BROADCAST_STATUS,
      isInfoModalVisible: false,
      infoRecord: {}
    };
  }

  componentDidMount() {
    // Set default startTime and endTime
    const startTime = moment()
      .subtract(START_TIME_OFFSET, 'day')
      .startOf('day')
      .format('x')
      .toString();
    const endTime = moment()
      .add(END_TIME_OFFSET, 'day')
      .endOf('day')
      .format('x')
      .toString();

    this.setState({ startTime, endTime }, () => {
      this.getAllStreams();
    });
  }

  getAllStreams = () => {
    const { currentUser } = this.props;
    const emailId = currentUser.email;
    const { startTime, endTime, statuses, pageNum, perPage } = this.state;

    this.setState({ isLoading: true });

    this.props.actions
      .getBroadcasterStreamsForGB({
        emailId,
        startTime,
        endTime,
        statuses,
        pageNum,
        perPage
      })
      .then(() => {
        const { gameBroadcasts = [] } =
          this.props.getBroadcasterStreamsForGBResponse || {};
        this.setState({ gameBroadcasts, isLoading: false });
      });
  };

  handleStatusChange = statuses => {
    this.setState({ statuses }, () => {
      this.getAllStreams();
    });
  };

  handlePageNumChange = pageNum => {
    this.setState({ pageNum });
  };

  handlePerPageChange = perPage => {
    this.setState({ perPage });
  };

  setBroadcastData = data => {
    this.props.history.push(
      `/game-broadcast/live?gbId=${data.gameBroadcastId}`
    );
  };

  showInfoModal = infoRecord => {
    this.setState({
      isInfoModalVisible: true,
      infoRecord
    });
  };

  hideInfoModal = () => {
    this.setState({
      isInfoModalVisible: false
    });
  };

  onDateChange = date => {
    let [startTime, endTime] = date;
    if (startTime && endTime) {
      startTime = startTime.format('x').toString();
      endTime = endTime.format('x').toString();
    }
    this.setState({ startTime, endTime });
  };

  render() {
    const {
      gameBroadcasts,
      startTime,
      endTime,
      statuses,
      pageNum,
      perPage,
      isLoading,
      broadcastStatus,
      isInfoModalVisible,
      infoRecord
    } = this.state;

    const columns = [
      {
        title: 'Broadcast ID',
        dataIndex: 'gameBroadcastId',
        key: 'gameBroadcastId',
        sorter: (a, b) => stringSort(a.gameBroadcastId, b.gameBroadcastId)
      },
      {
        title: 'Broadcast Name',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => stringSort(a.title, b.title)
      },
      {
        title: 'Broadcaster',
        dataIndex: 'hostedBy',
        key: 'hostedBy',
        sorter: (a, b) => stringSort(a.hostedBy, b.hostedBy)
      },
      {
        title: 'Tournaments',
        dataIndex: 'displayTournamentName',
        key: 'displayTournamentName',
        sorter: (a, b) =>
          stringSort(a.displayTournamentName, b.displayTournamentName)
      },
      {
        title: 'Round',
        dataIndex: 'displayRoundName',
        key: 'displayRoundName',
        sorter: (a, b) => stringSort(a.displayRoundName, b.displayRoundName)
      },
      {
        title: 'Pushishd At',
        dataIndex: 'publishAt',
        key: 'publishAt',
        render: text => (
          <span>
            {moment(parseInt(text, 10)).format('MMM Do YY HH:mm:ss A')}
          </span>
        ),
        sorter: (a, b) => stringSort(a.publishAt, b.publishAt)
      },
      {
        title: 'Start At',
        dataIndex: 'startTime',
        key: 'startTime',
        render: text => (
          <span>
            {moment(parseInt(text, 10)).format('MMM Do YY HH:mm:ss A')}
          </span>
        ),
        sorter: (a, b) => stringSort(a.startTime, b.startTime)
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span style={{ whiteSpace: 'pre' }}>
            <Tooltip
              placement="topLeft"
              title="Show more details"
              arrowPointAtCenter
            >
              <Button
                icon="info-circle"
                type="primary"
                ghost
                onClick={() => this.showInfoModal(record)}
              />
            </Tooltip>

            {record.status === 'UPCOMING' || record.status === 'LIVE' ? (
              <span>
                <Divider type="vertical" />
                <Button
                  icon="play-circle"
                  type="primary"
                  onClick={() => this.setBroadcastData(record)}
                >
                  {record.status === 'LIVE' ? 'View' : 'Start'}
                </Button>
              </span>
            ) : (
              ''
            )}
          </span>
        )
      }
    ];

    return (
      <Card
        className="page-container"
        title="Schedule"
        extra={<em>Apply filters from below</em>}
      >
        <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ padding: '.5rem' }}>
            <span>Status: </span>
            <Select
              style={{ minWidth: '200px' }}
              mode="multiple"
              value={statuses}
              onChange={this.handleStatusChange}
              showSearch
              placeholder="Select a status"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              // getPopupContainer={trigger => trigger.parentNode}
            >
              {broadcastStatus.map((status, idx) => (
                <Option key={'statusOpt-' + idx} value={idx}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>

          <Col style={{ padding: '.5rem' }}>
            <span> Date: </span>
            <RangePicker
              showTime
              allowClear="true"
              format="YYYY-MMM-DD HH:mm:ss A"
              placeholder={['Start Date/Time', 'End Date/Time']}
              onChange={this.onDateChange}
              style={{ width: '450px' }}
              value={
                startTime && endTime
                  ? [
                      moment(parseInt(startTime, 10)),
                      moment(parseInt(endTime, 10))
                    ]
                  : []
              }
              onOk={this.getAllStreams}
            />
          </Col>

          <Col style={{ padding: '.5rem' }}>
            <span> Page No: </span>
            <InputNumber value={pageNum} onChange={this.handlePageNumChange} />
          </Col>

          <Col style={{ padding: '.5rem' }}>
            <span> Count: </span>
            <InputNumber value={perPage} onChange={this.handlePerPageChange} />
          </Col>

          <Col style={{ padding: '.5rem' }}>
            <Button onClick={this.getAllStreams} type="primary" ghost>
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          bordered
          columns={columns}
          rowKey={record => record.gameBroadcastId}
          dataSource={gameBroadcasts}
          scroll={{ x: true }}
          loading={isLoading}
        />

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
            <code>{JSON.stringify(infoRecord, null, 2)}</code>
          </pre>
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  getBroadcasterStreamsForGBResponse:
    state.broadcast.getBroadcasterStreamsForGBResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ getBroadcasterStreamsForGB }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GBSchedule);
