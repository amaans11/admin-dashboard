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
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip
} from 'antd';
import '../../styles/components/broadcast.css';
import * as broadcastActions from '../../actions/broadcastActions';
import moment from 'moment';
import { GB_BROADCAST_STATUS, stringSort } from '../../shared/util';
import CreateBroadcastForm from './CreateBroadcastForm';
import { getCdnPathForUpload } from '../../actions/storageActions';

const { RangePicker } = DatePicker;
const { Option } = Select;

// TODO: change offset values to 0, 15 later
const START_TIME_OFFSET = 7;
const END_TIME_OFFSET = 7;

class GBBroadcasts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameBroadcasts: [],
      status: '',
      startTime: '',
      endTime: '',
      broadcasters: [],
      broadcasterIds: [],
      statuses: [0, 1],
      pageNum: 1,
      perPage: 100,
      isLoading: false,
      broadcastStatus: GB_BROADCAST_STATUS,
      isInfoModalVisible: false,
      isEditModalVisible: false,
      activeRecord: {},
      tournaments: []
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
      this.getCdnLink();
      this.getAllStreams();
      this.getBroadcastersList();
      this.getTournaments();
    });
  }

  getCdnLink = () => {
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        const cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
  };

  getAllStreams = () => {
    const {
      startTime,
      endTime,
      broadcasterIds,
      statuses,
      pageNum,
      perPage
    } = this.state;

    this.setState({ isLoading: true });

    this.props.actions
      .getAllStreamsForGB({
        startTime,
        endTime,
        broadcasterIds,
        statuses,
        pageNum,
        perPage
      })
      .then(() => {
        const { gameBroadcasts = [] } =
          this.props.getAllStreamsForGBResponse || {};
        this.setState({ gameBroadcasts, isLoading: false });
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

  getBroadcastersList = () => {
    this.props.actions.getBroadcasters().then(() => {
      const { broadcasters = [] } = this.props.getBroadcastersResponse || {};
      this.setState({ broadcasters });
    });
  };

  handleStatusChange = statuses => {
    this.setState({ statuses }, () => {
      this.getAllStreams();
    });
  };

  handleBroadcasterChange = broadcasterIds => {
    this.setState({ broadcasterIds }, () => {
      this.getAllStreams();
    });
  };

  handlePageNumChange = pageNum => {
    this.setState({ pageNum });
  };

  handlePerPageChange = perPage => {
    this.setState({ perPage });
  };

  showInfoModal = activeRecord => {
    this.setState({
      isInfoModalVisible: true,
      activeRecord
    });
  };

  hideInfoModal = () => {
    this.setState({
      isInfoModalVisible: false
    });
  };

  showEditModal = activeRecord => {
    this.setState({
      isEditModalVisible: true,
      activeRecord
    });
  };

  hideEditModal = () => {
    this.setState({
      isEditModalVisible: false
    });
  };

  getTournaments = () => {
    this.props.actions.getTournamentsGB().then(() => {
      const { tournament = [] } = this.props.getTournamentsGBResponse || {};
      this.setState({ tournaments: tournament });
    });
  };

  handleSubmit = (broadcastDetails, idValues) => {
    const { broadcasters } = this.state;
    const foundBrod = broadcasters.find(
      bd => bd.id === broadcastDetails.broadcasterId
    );
    const broadcaster = {
      broadcasterId: foundBrod.id,
      broadcasterName: foundBrod.name,
      broadcasterEmailId: foundBrod.emailId
    };
    broadcastDetails.broadcaster = broadcaster;
    broadcastDetails.thumbnailUrl = idValues.thumbnailUrlId;
    broadcastDetails.tileUrl = idValues.tileUrlID;
    if (idValues.thumbnailUrlId !== null && idValues.tileUrlID !== null) {
      // console.log(broadcastDetails)
      this.updateBroadcast(broadcastDetails);
    } else {
      if (idValues.thumbnailUrlId === null) {
        message.error(
          'Thumbnail Image was not properly updated, re-upload again'
        );
      } else if (idValues.tileUrlID === null) {
        message.error('Tile image was not properly updated, re-upload again');
      }
    }
  };

  updateBroadcast = broadcastDetails => {
    this.props.actions.updateBroadcast({ broadcastDetails }).then(() => {
      if (
        this.props.updateBroadcastResponse.status &&
        this.props.updateBroadcastResponse.status.code === 200
      ) {
        message.success('Broadcast Updated!');
        this.hideEditModal();
        this.getAllStreams();
      } else {
        message.error('Broadcast Update failed!');
      }
    });
  };

  render() {
    const {
      gameBroadcasts,
      startTime,
      endTime,
      statuses,
      broadcasterIds,
      broadcasters,
      pageNum,
      perPage,
      isLoading,
      broadcastStatus,
      isInfoModalVisible,
      activeRecord,
      isEditModalVisible,
      cdnPath,
      tournaments
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
            {moment(parseInt(text, 10)).format('YYYY-MMM-Do hh:mm:ss A')}
          </span>
        ),
        sorter: (a, b) => stringSort(a.publishAt, b.publishAt)
      },
      // {
      //   title: 'Players',
      //   dataIndex: 'players',
      //   key: 'players'
      // },
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

            {record.status === 'UPCOMING' ? (
              <>
                <Divider type="vertical" />
                <Tooltip
                  placement="topLeft"
                  title="Edit Broadcast Details"
                  arrowPointAtCenter
                >
                  <Button
                    icon="edit"
                    type="primary"
                    onClick={() => this.showEditModal(record)}
                  >
                    Edit
                  </Button>
                </Tooltip>
              </>
            ) : null}
          </span>
        )
      }
    ];

    return (
      <Card
        className="page-container"
        title="Broadcasts"
        extra={<em>Apply filters from below</em>}
      >
        <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ padding: '.5rem' }}>
            <span>Broadcaster: </span>
            <Select
              mode="multiple"
              value={broadcasterIds}
              onChange={this.handleBroadcasterChange}
              showSearch
              placeholder="Select a broadcaster"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              // getPopupContainer={trigger => trigger.parentNode}
              style={{ minWidth: '200px' }}
            >
              {broadcasters.map((item, idx) => (
                <Option key={'broadcasterOpt-' + idx} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Col>

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
            <code>{JSON.stringify(activeRecord, null, 2)}</code>
          </pre>
        </Modal>

        <Modal
          title="Edit Broadcast Details"
          visible={isEditModalVisible}
          onOk={this.hideEditModal}
          onCancel={this.hideEditModal}
          footer={null}
          wrapClassName="create-broadcast-pop"
          destroyOnClose={true}
        >
          <CreateBroadcastForm
            isEditing={true}
            cdnPath={cdnPath}
            broadcastDetails={activeRecord}
            broadcasters={broadcasters}
            tournaments={tournaments}
            handleSubmit={this.handleSubmit}
          />
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getAllStreamsForGBResponse: state.broadcast.getAllStreamsForGBResponse,
  getBroadcastersResponse: state.broadcast.getBroadcastersResponse,
  getCdnPathForUploadResponse: state.storage.getCdnPathForUploadResponse,
  getTournamentsGBResponse: state.broadcast.getTournamentsGBResponse,
  updateBroadcastResponse: state.broadcast.updateBroadcastResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...broadcastActions, getCdnPathForUpload },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GBBroadcasts);
