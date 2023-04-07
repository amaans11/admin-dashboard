import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Card,
  Col,
  Divider,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Tooltip
} from 'antd';
import '../../styles/components/broadcast.css';
import * as broadcastActions from '../../actions/broadcastActions';
import moment from 'moment';
import { stringSort } from '../../shared/util';

const { Option } = Select;

class GBVod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameBroadcasts: [],
      start: 1,
      count: 100,
      isLoading: false,
      isInfoModalVisible: false,
      infoRecord: {},
      tournaments: [],
      tournamentId: null
    };
  }

  componentDidMount() {
    this.getTournaments();
  }

  getTournaments = () => {
    this.props.actions.getTournamentsGB().then(() => {
      const { tournament = [] } = this.props.getTournamentsGBResponse || {};
      this.setState({ tournaments: tournament });
    });
  };

  getVods = () => {
    const { tournamentId, start, count } = this.state;
    this.setState({ isLoading: true });
    this.props.actions
      .getTournamentVod({
        tournamentId,
        start,
        count
      })
      .then(() => {
        const { gameBroadcasts = [] } =
          this.props.getTournamentVodResponse || {};
        this.setState({ gameBroadcasts, isLoading: false });
      });
  };

  handleTournamentChange = tournamentId => {
    this.setState({ tournamentId }, () => {
      this.getVods();
    });
  };

  handlestartChange = start => {
    this.setState({ start });
  };

  handlecountChange = count => {
    this.setState({ count });
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

  hideVodReq = (gameBroadcastId, hideVod) => {
    const params = {
      gameBroadcastId,
      hideVod
    };
    this.props.actions.hideTournamentVod(params).then(() => {
      this.getVods();
    });
  };

  render() {
    const {
      gameBroadcasts,
      start,
      count,
      isLoading,
      isInfoModalVisible,
      infoRecord,
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
        dataIndex: 'publishedAt',
        key: 'publishedAt',
        render: text => (
          <span>
            {moment(parseInt(text, 10)).format('YYYY-MMM-Do hh:mm:ss A')}
          </span>
        ),
        sorter: (a, b) => stringSort(a.publishAt, b.publishAt)
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
            <Divider type="vertical" />
            <Tooltip placement="topLeft" title="Hide VOD" arrowPointAtCenter>
              {record.hideStatus ? (
                <Button
                  icon="eye"
                  type="primary"
                  onClick={() => this.hideVodReq(record.gameBroadcastId, false)}
                >
                  Un-Hide
                </Button>
              ) : (
                <Button
                  icon="eye-invisible"
                  type="danger"
                  onClick={() => this.hideVodReq(record.gameBroadcastId, true)}
                >
                  Hide
                </Button>
              )}
            </Tooltip>
          </span>
        )
      }
    ];

    return (
      <Card
        className="page-container"
        title="VOD List"
        extra={<em>Apply filters from below</em>}
      >
        <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ padding: '.5rem' }}>
            <span>Tournament: </span>
            <Select
              style={{ minWidth: '300px' }}
              onChange={this.handleTournamentChange}
              showSearch
              placeholder="Select a status"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {tournaments.map(tour => (
                <Option key={tour.id} value={tour.id}>
                  {tour.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col style={{ padding: '.5rem' }}>
            <span> Start: </span>
            <InputNumber value={start} onChange={this.handlestartChange} />
          </Col>

          <Col style={{ padding: '.5rem' }}>
            <span> Count: </span>
            <InputNumber value={count} onChange={this.handlecountChange} />
          </Col>

          <Col style={{ padding: '.5rem' }}>
            <Button onClick={this.getVods} type="primary" ghost>
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
  getBroadcastersResponse: state.broadcast.getBroadcastersResponse,
  getTournamentsGBResponse: state.broadcast.getTournamentsGBResponse,
  getTournamentVodResponse: state.broadcast.getTournamentVodResponse,
  hideTournamentVodResponse: state.broadcast.hideTournamentVodResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...broadcastActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GBVod);
