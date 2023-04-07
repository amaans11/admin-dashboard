// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Table,
  Card,
  Modal,
  message,
  Tooltip,
  Divider,
  Popconfirm,
  Avatar,
  Pagination,
  Row,
  Col,
  Input,
  Select
} from 'antd';
import moment from 'moment';
import * as leaderboardActions from '../../actions/leaderboardActions';
import * as tounamentActions from '../../actions/tournamentActions';
import * as userRole from '../../auth/userPermission';

const { Option } = Select;

const permittedRoles = [
  userRole.LEADERBOARD_ADMIN,
  userRole.LEADERBOARD_WRITE,
  userRole.LEADERBOARD_READ,
  userRole.SUPER_ADMIN
];

const FraudCheckCategories = [
  'GENERIC',
  'GAME SCORE MODIFICATION',
  'GAME FIELD MODIFICATION',
  'TIME MODIFICATION',
  'SCORE SEQUENCE MODIFICATION',
  'RESULT MODIFICATION',
  'DASHBOARD_BLOCKED'
].map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));

class UnfinishedTournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      tournamentList: [],
      pageNum: 1,
      pageSize: 20,
      showLeaderboardModal: false,
      leaderboardData: [],
      totalCount: 100,
      blockReason: '',
      showBlockUserModal: false
    };
    this.getLeaderboardInfo = this.getLeaderboardInfo.bind(this);
    this.endTournament = this.endTournament.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  componentDidMount() {
    this.getTournaments();
  }

  getTournaments() {
    let startCount = 0;
    startCount = (this.state.pageNum - 1) * this.state.pageSize;
    let data = {
      isEnded: false,
      start: startCount,
      count: this.state.pageSize
    };
    console.log(data);
    this.props.actions.getAllFinishableTournaments(data).then(() => {
      if (
        this.props.getAllFinishableTournamentResponse &&
        this.props.getAllFinishableTournamentResponse.tournaments
      ) {
        this.setState({
          tournamentList: [
            ...this.props.getAllFinishableTournamentResponse.tournaments
          ],
          totalCount: !this.props.getAllFinishableTournamentResponse.totalCount
            ? 100
            : this.props.getAllFinishableTournamentResponse.totalCount === 0
            ? 100
            : this.props.getAllFinishableTournamentResponse.totalCount
        });
      }
      this.setState({
        showTable: true
      });
    });
  }

  getLeaderboardInfo(record) {
    this.props.actions.getLeaderboardById(record.id).then(() => {
      if (
        this.props.leaderboard &&
        this.props.leaderboard.lbById &&
        this.props.leaderboard.lbById.length > 0
      ) {
        this.setState({
          leaderboardData: [...this.props.leaderboard.lbById],
          showLeaderboardModal: true
        });
      } else {
        message.info(
          'Tournaments leader is not available this time, Try next one'
        );
      }
    });
  }

  endTournament(record) {
    console.log(record.id);
    this.props.actions.finishTournament(record.id).then(() => {
      message
        .success('Tournament Verified Successfully', 2.5)
        .then(() => window.location.reload());
    });
  }

  onPageChange(page) {
    this.setState(
      {
        pageNum: page
      },
      () => {
        this.getTournaments();
      }
    );
  }

  getGamePlay(e, record) {
    var vm = this;
    this.props.actions.getUserGamePlay(record).then(() => {
      vm.setState({
        userProfile: vm.props.leaderboard.userProfile,
        previewVisible: true,
        showUser: false,
        showGamePlay: true
      });
    });
  }
  getUser(user) {
    var vm = this;
    this.props.actions.getUserProfile(user.userId).then(() => {
      vm.setState({
        gamePlayInfo: vm.props.leaderboard.userGamePlay,
        previewVisible: true,
        showUser: true,
        showGamePlay: false
      });
    });
  }

  updateBlockReason(value) {
    this.setState({ blockReason: value });
  }

  closeBlockUserModal() {
    this.setState({ blockReason: '', showBlockUserModal: false });
  }

  makeBlockUserCall() {
    let vm = this;
    if (vm.state.blockReason === '') {
      message.error('Block Reason cannot be empty');
      return;
    }
    this.props.actions
      .blockUser(
        vm.state.blockUserId,
        vm.state.tournamentId,
        'TOURNAMENT',
        vm.state.blockReason
      )
      .then(() => {
        this.setState({
          blockUserId: null,
          blockReason: '',
          showBlockUserModal: false,
          tournamentId: null
        });
        message.info('Request Sent');
      });
  }

  blockUser(user) {
    this.setState({
      blockUserId: user.userId,
      tournamentId: user.tournament.tournamentId,
      showBlockUserModal: true
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (text, record) => (
          <span>{moment(record.startTime).format('DD-MMM-YY hh:mm A')}</span>
        )
      },
      {
        title: 'End Time',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (text, record) => (
          <span>{moment(record.endTime).format('DD-MMM-YY hh:mm A')}</span>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.getLeaderboardInfo(record)}
            >
              Get leaderboard Information
            </Button>

            <Popconfirm
              title="Are you sure to end the tournament?"
              onConfirm={() => this.endTournament(record)}
            >
              <Button size="small" type="primary" style={{ marginLeft: '5px' }}>
                End Tournament
              </Button>
            </Popconfirm>
          </span>
        )
      }
    ];

    const leaderboardColumns = [
      {
        title: 'R',
        dataIndex: 'rank',
        width: 70
      },
      {
        title: 'User Id',
        dataIndex: 'userId'
      },

      {
        title: 'Name',
        dataIndex: 'name',
        width: 100
      },
      {
        title: 'Score',
        dataIndex: 'score'
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        width: 180,
        key: 'action',
        render: (text, record) =>
          permittedRoles.filter(e =>
            this.props.currentUser.user_role.includes(e)
          ).length ? (
            <span>
              <Tooltip
                placement="topLeft"
                title="Get User Details"
                arrowPointAtCenter
              >
                <Button
                  style={{ marginLeft: 5 }}
                  shape="circle"
                  icon="user"
                  onClick={() => this.getUser(record)}
                  type="primary"
                />
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip
                placement="topLeft"
                title="Get Score Details"
                arrowPointAtCenter
              >
                <Button
                  style={{ marginLeft: 5 }}
                  shape="circle"
                  icon="book"
                  onClick={e => this.getGamePlay(e, record)}
                  type="primary"
                />
              </Tooltip>
              <Divider type="vertical" />
              <Button
                onClick={() => this.blockUser(record)}
                shape="circle"
                icon="user-delete"
                type="danger"
              />
            </span>
          ) : (
            ''
          )
      }
    ];

    const hideModal = () => {
      this.setState({
        leaderboardData: [],
        showLeaderboardModal: false
      });
    };
    const handleOk = () => {
      this.setState({
        leaderboardData: [],
        showLeaderboardModal: false
      });
    };
    return (
      <React.Fragment>
        {this.state.showTable && (
          <Card>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.tournamentList}
              columns={columns}
            />
            <Pagination
              current={this.state.pageNum}
              defaultCurrent={this.state.pageNum}
              onChange={(page, pageSize) => this.onPageChange(page, pageSize)}
              total={this.state.totalCount ? this.state.totalCount : 100}
              pageSize={this.state.pageSize}
            />
          </Card>
        )}
        <Modal
          title={'Leaderboard Details'}
          closable={true}
          maskClosable={true}
          width={900}
          onCancel={hideModal}
          onOk={handleOk}
          visible={this.state.showLeaderboardModal}
        >
          <Card bordered={false}>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.leaderboardData}
              columns={leaderboardColumns}
            />
          </Card>
        </Modal>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {this.props.leaderboard.userProfile && this.state.showUser ? (
            <div>
              <Avatar
                src={
                  this.props.leaderboard.userProfile &&
                  this.props.leaderboard.userProfile.profile &&
                  this.props.leaderboard.userProfile.profile.avatars &&
                  this.props.leaderboard.userProfile.profile.avatars.small
                    ? this.props.leaderboard.userProfile.profile.avatars.small
                    : ''
                }
              />
              <span style={{ marginLeft: 10 }}>
                {this.props.leaderboard.userProfile
                  ? this.props.leaderboard.userProfile.profile.displayName
                  : ''}
              </span>
              <div>
                Mobile:{' '}
                {this.props.leaderboard.userProfile
                  ? this.props.leaderboard.userProfile.profile.mobileNumber
                  : ''}
              </div>
              {/* <div>{JSON.stringify(this.state.userProfile.profile)}</div> */}
            </div>
          ) : (
            ''
          )}
          {this.props.leaderboard.userGamePlay && this.state.showGamePlay ? (
            <div>{this.props.leaderboard.userGamePlay}</div>
          ) : (
            ''
          )}
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={800}
          onOk={() => this.makeBlockUserCall()}
          onCancel={() => this.closeBlockUserModal()}
          okText="Block"
          visible={this.state.showBlockUserModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={6}>
                <strong>Block Reason:</strong>
              </Col>
              <Col span={18}>
                <Select
                  showSearch
                  style={{ width: 500 }}
                  placeholder="Please enter block reason"
                  optionFilterProp="children"
                  onSelect={e => this.updateBlockReason(e)}
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {FraudCheckCategories}
                </Select>
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAllFinishableTournamentResponse:
      state.leaderboard.getAllFinishableTournamentResponse,
    leaderboard: state.leaderboard,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...leaderboardActions, ...tounamentActions },
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnfinishedTournament);
