import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as superteamLeaderboardActions from '../../actions/SuperteamLeaderboardActions';
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  Badge,
  message,
  Divider,
  Select
} from 'antd';
import moment from 'moment';
import _ from 'lodash';

const Option = Select.Option;

const FantasyGameOptions = [
  <Option key={7} value={7}>
    Cricket
  </Option>,
  <Option key={5} value={5}>
    Football
  </Option>,
  <Option key={8} value={8}>
    Kabaddi
  </Option>,
  <Option key={101} value={101}>
    Stock
  </Option>,
  <Option key={6} value={6}>
    Basketball
  </Option>,
  <Option key={3} value={3}>
    Baseball
  </Option>,
  <Option key={4} value={4}>
    Hockey
  </Option>
];

class ListLeaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      sportId: null,
      matchDetailsList: [],
      showMatchDetailsModal: false,
      showInitiateWinningsModal: false,
      password: '',
      leaderboardData: []
    };
    this.fetchList = this.fetchList.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // this.fetchList();
  }

  selectSport(value) {
    this.setState(
      {
        sportId: value
      },
      () => {
        this.fetchList();
      }
    );
  }

  fetchList() {
    let data = {
      sportId: this.state.sportId
    };
    this.props.actions.getAllLeaderboard(data).then(() => {
      if (
        this.props.getAllLeaderboardResponse &&
        this.props.getAllLeaderboardResponse.leaderBoards &&
        this.props.getAllLeaderboardResponse.leaderBoards.length > 0
      ) {
        this.setState(
          {
            tableData: [...this.props.getAllLeaderboardResponse.leaderBoards]
          },
          () => this.setState({ showTable: true })
        );
      } else {
        message.info('No records found');
        this.setState({ showTable: true });
      }
    });
  }

  editLeaderboard(record, actionType) {
    this.props.actions.editLeaderboardDetials(record, actionType);
    this.props.history.push('/superteam-leaderboard/create-leaderboard');
  }

  toggleState(record, newStatus) {
    let data = {
      leaderBoardId: record.leaderBoardId,
      leaderBoardStatus: newStatus
    };
    this.props.actions.updateLeaderboardStatus(data).then(() => {
      if (this.props.updateLeaderboardStatusResponse) {
        if (this.props.updateLeaderboardStatusResponse.error) {
          message.error(
            this.props.updateLeaderboardStatusResponse.error.message
              ? this.props.updateLeaderboardStatusResponse.error.message
              : 'Could not update the status'
          );
        } else {
          message.success('Successfully updated the status', 1).then(() => {
            window.location.reload();
          });
        }
      }
    });
  }

  openMatchDetailsModal(record) {
    this.setState({ leaderBoardId: record.leaderBoardId, title: record.title });
    let data = {
      leaderBoardId: record.leaderBoardId
    };
    this.props.actions.getLeaderboardMatchDetail(data).then(() => {
      if (
        this.props.getLeaderboardMatchDetailResponse &&
        this.props.getLeaderboardMatchDetailResponse.includedMatches &&
        this.props.getLeaderboardMatchDetailResponse.includedMatches.length > 0
      ) {
        let matchDetailsList = [
          ...this.props.getLeaderboardMatchDetailResponse.includedMatches
        ];
        this.setState({
          matchDetailsList: [...matchDetailsList],
          showMatchDetailsModal: true
        });
      } else {
        this.setState({
          matchDetailsList: [],
          showMatchDetailsModal: true
        });
      }
    });
  }

  closeMatchDetailsModal() {
    this.setState({
      matchDetailsList: [],
      showMatchDetailsModal: false,
      leaderBoardId: '',
      title: ''
    });
  }

  openInitiateWinningsModal(record) {
    this.setState({
      leaderBoardId: record.leaderBoardId,
      title: record.title,
      showInitiateWinningsModal: true
    });
  }

  closeInitiateWinningsModal() {
    this.setState({
      showInitiateWinningsModal: false,
      leaderBoardId: '',
      title: ''
    });
  }

  changePassword(value) {
    this.setState({ password: value });
  }

  initiateWinnings() {
    let data = {
      leaderBoardId: this.state.leaderBoardId,
      password: this.state.password
    };
    this.props.actions.initiateWinnings(data).then(() => {
      if (this.props.slInitiateWinningsResponse) {
        if (this.props.slInitiateWinningsResponse.error) {
          message.error(
            this.props.slInitiateWinningsResponse.error.message
              ? this.props.slInitiateWinningsResponse.error.message
              : 'Could not initiate winnings'
          );
        } else {
          message
            .success('Successfully initiated the winnings', 1.5)
            .then(() => {
              this.setState({
                showInitiateWinningsModal: false,
                leaderBoardId: '',
                title: ''
              });
            });
        }
      }
    });
  }

  openLeaderboardModal(record) {
    this.setState({
      leaderboardId: record.leaderBoardId,
      showLeaderboardModal: true
    });
  }

  closeLeaderboardModal() {
    this.setState({ leaderboardId: null, showLeaderboardModal: false });
  }

  changeLimit(value) {
    this.setState({
      limit: value
    });
  }

  fetchLeaderboard() {
    let data = {
      leaderboardId: this.state.leaderboardId,
      limit: this.state.limit ? this.state.limit : 10
    };
    this.props.actions.getFullLeaderboard(data).then(() => {
      if (
        this.props.getFullLeaderboardDetailsResponse &&
        this.props.getFullLeaderboardDetailsResponse
          .getFullLeaderBoardDetailsDashbaord
      ) {
        this.setState({
          leaderboardData: [
            ...this.props.getFullLeaderboardDetailsResponse
              .getFullLeaderBoardDetailsDashbaord
          ]
        });
      }
    });
  }

  render() {
    const columns = [
      {
        title: 'Id',
        key: 'leaderBoardId',
        dataIndex: 'leaderBoardId'
      },
      {
        title: 'Title',
        key: 'title',
        render: (text, record) => (
          <div>
            <span>
              <Badge
                count={'A'}
                status={record.isActive ? 'processing' : 'error'}
              />
            </span>
            <span>{record.title}</span>
          </div>
        )
      },
      {
        title: 'Sub Title',
        key: 'subtitle',
        dataIndex: 'subtitle'
      },
      {
        title: 'Sport Id',
        key: 'sportId',
        dataIndex: 'sportId'
      },
      {
        title: 'Start Date',
        key: 'startDate',
        render: (text, record) => (
          <span>{moment(record.startDate).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'End Date',
        key: 'endDate',
        render: (text, record) => (
          <span>{moment(record.endDate).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'Preview',
        dataIndex: 'image',
        key: 'image',
        render: (text, record) => (
          <span>
            <img
              className="baner-list-img"
              src={record.image}
              alt={record.image ? 'Could not load image' : 'No image uploaded'}
            />
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <div style={{ minWidth: '150px' }}>
            <Button
              icon="edit"
              type="primary"
              size="small"
              onClick={() => this.editLeaderboard(record, 'EDIT')}
            />
            <Divider type="vertical" />
            {!record.isActive && (
              <Button
                size="small"
                onClick={() => this.toggleState(record, true)}
              >
                Activate
              </Button>
            )}
            {record.isActive && (
              <Button
                type="danger"
                size="small"
                onClick={() => this.toggleState(record, false)}
              >
                Deactivate
              </Button>
            )}
            <Divider type="horizontal" />
            <Button
              size="small"
              onClick={() => this.openMatchDetailsModal(record)}
            >
              Get Match Details
            </Button>
            <Divider type="vertical" />
            <Button
              size="small"
              onClick={() => this.openInitiateWinningsModal(record)}
            >
              Initiate Winnings
            </Button>
            <Divider type="vertical" />
            <Button
              size="small"
              onClick={() => this.openLeaderboardModal(record)}
            >
              Leaderboard
            </Button>
          </div>
        )
      }
    ];

    const matchColumns = [
      {
        title: 'Match Id',
        key: 'seasonGameUid',
        dataIndex: 'seasonGameUid'
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Start Time',
        key: 'startTime',
        render: (text, record) => (
          <span>{moment(record.startTime).format('DD/MM/YYYY HH:mm')}</span>
        )
      },
      {
        title: 'League Name',
        dataIndex: 'leagueName',
        key: 'leagueName'
      },
      {
        title: 'Team1 Name',
        dataIndex: 'team1Name',
        key: 'team1Name'
      },
      {
        title: 'Team2 Name',
        dataIndex: 'team2Name',
        key: 'team2Name'
      }
    ];

    const leaderboardColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Team Id',
        dataIndex: 'teamId',
        key: 'teamId'
      },
      {
        title: 'Team Name',
        dataIndex: 'teamName',
        key: 'teamName'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score'
      },
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank'
      },
      {
        title: 'Cash Prize',
        dataIndex: 'cashPrize',
        key: 'cashPrize'
      },
      {
        title: 'Token Prize',
        dataIndex: 'tokenPrize',
        key: 'tokenPrize'
      },
      {
        title: 'Special Prize',
        dataIndex: 'specialPrize',
        key: 'specialPrize'
      },
      {
        title: 'Tie Count',
        dataIndex: 'tieCount',
        key: 'tieCount'
      },
      {
        title: 'Tier',
        dataIndex: 'userTier',
        key: 'userTier'
      },
      {
        title: 'Is Pro',
        dataIndex: 'isPro',
        key: 'isPro'
      }
    ];

    return (
      <React.Fragment>
        <Card>
          <Select
            showSearch
            onSelect={e => this.selectSport(e)}
            style={{ width: 300 }}
            placeholder="Select a sport"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {FantasyGameOptions}
          </Select>
        </Card>
        {this.state.showTable && (
          <Card title={'List Leaderboards'}>
            <Table
              rowKey="title"
              bordered
              dataSource={this.state.tableData}
              pagination={false}
              columns={columns}
            />
          </Card>
        )}
        <Modal
          title={'Match Details for leaderboard: ' + this.state.title}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeMatchDetailsModal()}
          onOk={() => this.closeMatchDetailsModal()}
          visible={this.state.showMatchDetailsModal}
          footer={[
            <Button key="back" onClick={() => this.closeMatchDetailsModal()}>
              Close
            </Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="seasonGameUid"
              bordered
              pagination={false}
              dataSource={this.state.matchDetailsList}
              columns={matchColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={'Initiate winnings for leaderboard: ' + this.state.title}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeInitiateWinningsModal()}
          onOk={() => this.initiateWinnings()}
          okText="Initiate"
          visible={this.state.showInitiateWinningsModal}
        >
          <Card>
            Enter Password
            <Input.Password
              value={this.state.password}
              onChange={e => this.changePassword(e.target.value)}
              placeholder="input password"
            />
          </Card>
        </Modal>
        <Modal
          title={'Leaderboard'}
          closable={true}
          maskClosable={true}
          width={900}
          visible={this.state.showLeaderboardModal}
          onCancel={() => this.closeLeaderboardModal()}
          onOk={() => this.closeLeaderboardModal()}
          footer={[
            <Button key="lb-back" onClick={() => this.closeLeaderboardModal()}>
              Close
            </Button>
          ]}
        >
          <Card bordered={false}>
            Limit:{' '}
            <Input
              style={{ width: 200 }}
              onChange={e => this.changeLimit(e.target.value)}
              placeholder={'Enter limit'}
            />
            <Button onClick={() => this.fetchLeaderboard()}>Submit</Button>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.leaderboardData}
              columns={leaderboardColumns}
            />
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAllLeaderboardResponse:
      state.superteamLeaderboard.getAllLeaderboardResponse,
    getLeaderboardMatchDetailResponse:
      state.superteamLeaderboard.getLeaderboardMatchDetailResponse,
    slInitiateWinningsResponse:
      state.superteamLeaderboard.slInitiateWinningsResponse,
    updateLeaderboardStatusResponse:
      state.superteamLeaderboard.updateLeaderboardStatusResponse,
    getFullLeaderboardDetailsResponse:
      state.superteamLeaderboard.getFullLeaderboardDetailsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamLeaderboardActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListLeaderboard);
