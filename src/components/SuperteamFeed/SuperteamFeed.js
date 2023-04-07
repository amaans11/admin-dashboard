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
  Radio,
  Select,
  Table,
  Modal,
  DatePicker,
  Input,
  InputNumber,
  Popconfirm,
  Tag
} from 'antd';
import * as superteamFeedActions from '../../actions/SuperteamFeedActions';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const FootballPositionOptions = [
  <Option key={'GK'} value={'GK'}>
    GK
  </Option>,
  <Option key={'DF'} value={'DF'}>
    DF
  </Option>,
  <Option key={'MF'} value={'MF'}>
    MF
  </Option>,
  <Option key={'FW'} value={'FW'}>
    FW
  </Option>
];

class SuperteamFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      matchList: [],
      matchListFetched: false,
      playerDetailsFetched: false,
      showPlayerModal: false,
      playerDetailList: [],
      playerDisplayList: [],
      searchString: '',
      matchDisplayList: [],
      searchLeagueString: '',
      isAdmin: false,
      matchDetail: {},
      showScoreDetailModal: false,
      playerScoreDetails: [],
      selectedRowKeys: [],
      activeCount: 0
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (
      this.props.currentUser.user_role.includes('SUPER_ADMIN') ||
      this.props.currentUser.user_role.includes('FANTASY_ADMIN')
    ) {
      this.setState({ isAdmin: true });
    } else {
      this.setState({ isAdmin: false });
    }
  }

  isLastPlayedMatch = player => {
    if (player.extraInfo && JSON.parse(player.extraInfo).playedLastMatch) {
      return true;
    } else {
      return false;
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState(
          {
            startTime: values.timeArray[0],
            endTime: values.timeArray[1]
          },
          () => {
            this.getMatches();
          }
        );
      }
    });
  }

  getMatches() {
    let data = {
      startTime: moment(this.state.startTime).format('YYYY-MM-DD'),
      endTime: moment(this.state.endTime).format('YYYY-MM-DD')
    };
    this.props.actions.getAllMatches(data).then(() => {
      if (
        this.props.getFeedsAllMatchesResponse &&
        this.props.getFeedsAllMatchesResponse.matchDetails &&
        this.props.getFeedsAllMatchesResponse.matchDetails.length > 0
      ) {
        this.setState({
          matchList: [...this.props.getFeedsAllMatchesResponse.matchDetails],
          matchDisplayList: [
            ...this.props.getFeedsAllMatchesResponse.matchDetails
          ],
          matchListFetched: true
        });
      } else {
        message.info('No records found');
        this.setState({
          matchList: [],
          matchListFetched: true,
          matchDisplayList: []
        });
      }
    });
  }

  getMatchRoster(record) {
    this.setState({
      matchId: record.id,
      feedMatchId: record.feedMatchId,
      leagueId: record.leagueId
    });
    let data = {
      matchId: record.id
    };
    let playingList = [];
    let activeCount = 0;
    this.props.actions.getMatchRoster(data).then(() => {
      if (
        this.props.getFeedsMatchRosterResponse &&
        this.props.getFeedsMatchRosterResponse.playerDetails &&
        this.props.getFeedsMatchRosterResponse.playerDetails.length > 0
      ) {
        let playerDetailList = [
          ...this.props.getFeedsMatchRosterResponse.playerDetails
        ];
        this.props.getFeedsMatchRosterResponse.playerDetails.forEach(item => {
          if (item.isPlaying) {
            playingList.push(item.feedPlayerUid);
          }
          if (item.isActive) {
            activeCount = activeCount + 1;
          }
        });

        this.setState({
          playerDetailList: [...playerDetailList],
          totalPlayersInRoster: playerDetailList.length,
          playerDetailsFetched: true,
          showPlayerModal: true,
          playerDisplayList: [...playerDetailList],
          selectedRowKeys: playingList,
          activeCount: activeCount
        });
      } else {
        message.info('No records fetched');
        this.setState({
          playerDetailList: [],
          totalPlayersInRoster: 0,
          playerDetailsFetched: true,
          playerDisplayList: []
        });
      }
    });
  }

  deleteAndUpdateRoster(record) {
    let data = {
      matchId: record.id
    };
    this.props.actions.deleteUpdateRoster(data).then(() => {
      if (this.props.deleteUpdateRosterResponse) {
        if (this.props.deleteUpdateRosterResponse.error) {
          message.error(
            this.props.deleteUpdateRosterResponse.error.message
              ? this.props.deleteUpdateRosterResponse.error.message
              : 'Could not delete and update match roster'
          );
        } else {
          message.success('Successfully deleted and updated match roster');
        }
      }
    });
  }

  closePlayerModal() {
    this.setState(
      {
        playerDetailList: [],
        searchString: '',
        playerDisplayList: []
      },
      () => {
        this.setState({
          showPlayerModal: false
        });
      }
    );
  }

  updateRoster() {
    let verified = true;
    this.setState({ loading: true });
    let playerDetailList = [...this.state.playerDetailList];
    let updatePlayerDetails = [];
    playerDetailList.forEach(element => {
      let cursor = {
        playerId: element.id,
        position: element.position,
        salary: element.salary,
        isActive: element.isActive ? element.isActive : false,
        fullName: element.fullName,
        firstName: element.firstName,
        lastName: element.lastName,
        extraInfo: element.extraInfo
      };
      if (element.isActive) {
        if (element.salary < 1 || element.salary > 19) {
          verified = false;
        }
      }
      updatePlayerDetails.push(cursor);
    });
    if (!verified) {
      message.error(
        'Active player salary should be greater than 0 and less than 20'
      );
      this.setState({ loading: false });
      return;
    }

    let data = {
      matchId: this.state.matchId,
      leagueId: this.state.leagueId,
      updatePlayerDetails: [...updatePlayerDetails]
    };
    this.props.actions.updateMatchRoster(data).then(() => {
      this.setState({ loading: false });
      if (this.props.updateFeedsMatchRosterResponse) {
        if (this.props.updateFeedsMatchRosterResponse.error) {
          message.error(
            this.props.updateFeedsMatchRosterResponse.error.message
              ? this.props.updateFeedsMatchRosterResponse.error.message
              : 'Could not update the roster'
          );
        } else {
          message
            .success('Successfully updated the roster', 1.5)
            .then(() => this.setState({ showPlayerModal: false }));
        }
      }
    });
  }

  salaryChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].salary = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  positionChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].position = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  playerStatusChanged(newValue, record) {
    let { activeCount } = this.state;
    if (!newValue) {
      activeCount = activeCount - 1;
    } else {
      activeCount = activeCount + 1;
    }
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].isActive = newValue;
    this.setState({ playerDetailList: [...playerDetailList], activeCount });
  }

  firstNameChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].firstName = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  lastNameChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].lastName = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  nameChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].fullName = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  lastPlayedMatchChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    let extraInfo = playerDetailList[editIndex].extraInfo
      ? JSON.parse(playerDetailList[editIndex].extraInfo)
      : {};
    extraInfo['playedLastMatch'] = newValue;
    playerDetailList[editIndex].extraInfo = JSON.stringify(extraInfo);
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  searchPlayer(value) {
    let searchString = value;
    let playerDetailList = [...this.state.playerDetailList];
    let playerDisplayList = [];
    _.forEach(playerDetailList, function(item) {
      if (
        item.fullName &&
        item.fullName.toLowerCase().includes(searchString.toLowerCase())
      ) {
        playerDisplayList.push(item);
      }
    });
    this.setState({
      playerDisplayList: [...playerDisplayList],
      searchString: searchString
    });
  }

  searchLeague(value) {
    let searchLeagueString = value;
    let matchList = [...this.state.matchList];
    let matchDisplayList = [];
    _.forEach(matchList, function(item) {
      if (
        item.leagueName &&
        item.leagueName.toLowerCase().includes(searchLeagueString.toLowerCase())
      ) {
        matchDisplayList.push(item);
      }
    });
    this.setState({
      matchDisplayList: [...matchDisplayList],
      searchLeagueString: searchLeagueString
    });
  }

  openScoreModal(record) {
    let data = {
      matchId: record.id
    };
    this.props.actions.getFullMatchDetail(data).then(() => {
      if (this.props.getFeedsFullMatchDetailResponse) {
        this.setState({
          matchDetail: {
            ...this.props.getFeedsFullMatchDetailResponse
          },
          showScoreModal: true
        });
      } else {
        message.info('Could not fetch match details');
        this.setState({
          matchDetail: {}
        });
      }
    });
  }

  createNewMatchId(record) {
    let data = {
      matchId: record.id
    };
    this.props.actions.createNewMatchId(data).then(() => {
      if (this.props.feedsCreateNewMatchIdResponse) {
        if (this.props.feedsCreateNewMatchIdResponse.error) {
          message.error(
            this.props.feedsCreateNewMatchIdResponse.error.message
              ? this.props.feedsCreateNewMatchIdResponse.error.message
              : 'Could not create new match id'
          );
        } else {
          message.success('Successfully created new match id');
          this.getMatches();
        }
      }
    });
  }

  moveMatchToLive(record) {
    let data = {
      matchId: record.id
    };
    this.props.actions.moveMatchFromFinishedToLive(data).then(() => {
      if (this.props.moveMatchFromFinishedToLiveResponse) {
        if (
          this.props.moveMatchFromFinishedToLiveResponse &&
          this.props.moveMatchFromFinishedToLiveResponse.error
        ) {
          message.error(
            this.props.moveMatchFromFinishedToLiveResponse.error.message
              ? this.props.moveMatchFromFinishedToLiveResponse.error.message
              : 'Could not move the match to live'
          );
        } else {
          message.success('Successfully moved the match to live');
        }
      }
    });
  }

  closeScoreModal() {
    this.setState({
      showScoreModal: false,
      matchDetail: {}
    });
  }

  openScoreDetailsModal(record, actionType) {
    let playerScoreDetails = [];
    if (actionType === 'POINTS_DETAILS') {
      playerScoreDetails = _.isEmpty(record.playerScorePointDetails)
        ? []
        : [...record.playerScorePointDetails.playerScorePointDetails];
    } else {
      playerScoreDetails = _.isEmpty(record.dreamPlayerScorePointDetails)
        ? []
        : [...record.dreamPlayerScorePointDetails.playerScorePointDetails];
    }
    this.setState({
      playerScoreDetails: [...playerScoreDetails],
      showScoreDetailModal: true,
      editPlayerId: record.playerId,
      editPlayerName: record.playerName
    });
  }

  closeScoreDetailsModal() {
    this.setState({
      showScoreDetailModal: false,
      playerScoreDetails: [],
      editPlayerId: null,
      editPlayerName: null
    });
  }

  savePlayerScores() {
    let playerScorePointDetails = [...this.state.playerScoreDetails];

    let data = {
      matchId: this.state.matchDetail.id,
      sportId: 5,
      playerId: this.state.editPlayerId,
      playerScorePointDetails: [...playerScorePointDetails]
    };

    this.props.actions.updateFeedPlayerPoints(data).then(() => {
      if (
        this.props.updateFeedPlayerPointResponse &&
        this.props.updateFeedPlayerPointResponse.error
      ) {
        message.error(
          this.props.updateFeedPlayerPointResponse.error.message
            ? this.props.updateFeedPlayerPointResponse.error.message
            : 'could not update the player points'
        );
      } else {
        this.closeScoreDetailsModal();
        this.closeScoreModal();
      }
    });
  }

  recurrenceChanged(newValue, record) {
    let playerScoreDetails = [...this.state.playerScoreDetails];
    let editIndex = _.findIndex(playerScoreDetails, function(item) {
      return item.eventName === record.eventName;
    });
    playerScoreDetails[editIndex].recurrence = newValue;
    this.setState({ playerScoreDetails: [...playerScoreDetails] });
  }

  pointsChanged(newValue, record) {
    let playerScoreDetails = [...this.state.playerScoreDetails];
    let editIndex = _.findIndex(playerScoreDetails, function(item) {
      return item.eventName === record.eventName;
    });
    playerScoreDetails[editIndex].points = newValue;
    this.setState({ playerScoreDetails: [...playerScoreDetails] });
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  updatePlayingEleven() {
    let data = {
      feedMatchId: this.state.feedMatchId,
      feedPlayerId: [...this.state.selectedRowKeys]
    };
    this.props.actions.updateFeedPlayingEleven(data).then(() => {
      if (
        this.props.updateFeedPlayingElevenResponse &&
        this.props.updateFeedPlayingElevenResponse.error
      ) {
        message.error(
          this.props.updateFeedPlayingElevenResponse.error.message
            ? this.props.updateFeedPlayingElevenResponse.error.message
            : 'could not update the playing eleven'
        );
      } else {
        this.closePlayerModal();
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const columns = [
      {
        title: 'Match Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Feed Match Id',
        dataIndex: 'feedMatchId',
        key: 'feedMatchId'
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Season Scheduled Date',
        key: 'seasonScheduledDate',
        render: (text, record) => (
          <span>
            {moment(record.seasonScheduledDate).format('DD/MM/YYYY HH:mm')}
          </span>
        ),
        sorter: (a, b) => {
          var dateA = moment(a.seasonScheduledDate);
          var dateB = moment(b.seasonScheduledDate);
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'League Name',
        dataIndex: 'leagueName',
        key: 'leagueName'
      },
      {
        title: 'Home',
        dataIndex: 'home',
        key: 'home'
      },
      {
        title: 'Away',
        dataIndex: 'away',
        key: 'away'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Status Overview',
        dataIndex: 'statusOverview',
        key: 'statusOverview'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.getMatchRoster(record)}
              type="primary"
              size="small"
            >
              Match Roster
            </Button>
            {/* {this.state.isAdmin && (
              <Popconfirm
                title='Are you sure to delete and update the roster for this match?'
                onConfirm={() => this.deleteAndUpdateRoster(record)}
              >
                <Button style={{ margin: '2px' }} size='small' type='danger'>
                  Delete and Update Roster
                </Button>
              </Popconfirm>
            )} */}
            <Button
              style={{ margin: '2px' }}
              size="small"
              onClick={() => this.openScoreModal(record)}
            >
              Get Score
            </Button>
            <Popconfirm
              title="Do you want to proceed with creating new match id?"
              onConfirm={() => this.createNewMatchId(record)}
            >
              <Button style={{ margin: '2px' }} size="small" type="dashed">
                Create New Match Id
              </Button>
            </Popconfirm>
            {record.status === 2 && [2, 3, 4].includes(record.statusOverview) && (
              <Popconfirm
                title="Sure to move match to live?"
                onConfirm={() => this.moveMatchToLive(record)}
              >
                <Button style={{ margin: '2px' }} size="small">
                  Move Match To Live
                </Button>
              </Popconfirm>
            )}
          </span>
        )
      }
    ];

    const playerColumns = [
      {
        title: 'Player Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Feed Player Id',
        dataIndex: 'feedPlayerUid',
        key: 'feedPlayerUid'
      },
      {
        title: 'First Name',
        key: 'firstName',
        render: (text, record) => (
          <Input
            onChange={e => this.firstNameChanged(e.target.value, record)}
            value={record.firstName}
          />
        ),
        sorter: (a, b) => {
          var nameA = a.firstName.toLowerCase();
          var nameB = b.firstName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Last Name',
        key: 'lastName',
        render: (text, record) => (
          <Input
            onChange={e => this.lastNameChanged(e.target.value, record)}
            value={record.lastName}
          />
        ),
        sorter: (a, b) => {
          var nameA = a.lastName.toLowerCase();
          var nameB = b.lastName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Full Name',
        key: 'fullName',
        render: (text, record) => (
          <Input
            onChange={e => this.nameChanged(e.target.value, record)}
            value={record.fullName}
          />
        ),
        sorter: (a, b) => {
          var nameA = a.fullName.toLowerCase();
          var nameB = b.fullName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Is Active',
        key: 'isActive',
        render: (text, record) => (
          <RadioGroup
            style={{ minWidth: '120px' }}
            value={record.isActive ? true : false}
            onChange={e => this.playerStatusChanged(e.target.value, record)}
          >
            <RadioButton value={false}>No</RadioButton>
            <RadioButton value={true}>Yes</RadioButton>
          </RadioGroup>
        )
      },
      {
        title: 'Position',
        key: 'position',
        render: (text, record) => (
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="Select a position"
            optionFilterProp="children"
            value={record.position}
            onChange={e => this.positionChanged(e, record)}
            filterOption={(input, option) =>
              option.props.children
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {FootballPositionOptions}
          </Select>
        ),
        filters: [
          {
            text: 'GK',
            value: 'GK'
          },
          {
            text: 'DF',
            value: 'DF'
          },
          {
            text: 'MF',
            value: 'MF'
          },
          {
            text: 'FW',
            value: 'FW'
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.position.indexOf(value) === 0
      },
      {
        title: 'Salary',
        key: 'salary',
        render: (text, record) => (
          <Input
            onChange={e => this.salaryChanged(e.target.value, record)}
            value={record.salary}
            max={19}
          />
        ),
        sorter: (a, b) => a.salary - b.salary
      },
      {
        title: 'Is Last Match Played',
        key: 'isLastMatchPlayed',
        render: (text, record) => (
          <RadioGroup
            buttonStyle="solid"
            style={{ minWidth: '120px' }}
            value={this.isLastPlayedMatch(record)}
            onChange={e => this.lastPlayedMatchChanged(e.target.value, record)}
          >
            <RadioButton value={false}>No</RadioButton>
            <RadioButton value={true}>Yes</RadioButton>
          </RadioGroup>
        )
      },
      {
        title: 'Team Name',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => {
          var nameA = a.teamName.toLowerCase();
          var nameB = b.teamName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      }
    ];

    const scoreTableColumns = [
      {
        title: 'Player Id',
        dataIndex: 'playerId',
        key: 'playerId'
      },
      {
        title: 'Feed Player Id',
        dataIndex: 'feedPlayerId',
        key: 'feedPlayerId'
      },
      {
        title: 'Player Name',
        dataIndex: 'playerName',
        key: 'playerName'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        sorter: (a, b) => a.score - b.score
      },
      {
        title: 'Dream Score',
        dataIndex: 'dreamScore',
        key: 'dreamScore',
        sorter: (a, b) => a.dreamScore - b.dreamScore
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <div>
            <Button
              type="primary"
              size="small"
              onClick={() =>
                this.openScoreDetailsModal(record, 'POINTS_DETAILS')
              }
            >
              Points Detail
            </Button>
            <Button
              style={{ margin: '3px' }}
              size="small"
              onClick={() =>
                this.openScoreDetailsModal(record, 'DREAM_POINTS_DETAILS')
              }
            >
              Dream Points Detail
            </Button>
          </div>
        )
      }
    ];

    const scoreDetailsTableColumns = [
      {
        title: 'Event Name',
        dataIndex: 'eventName',
        key: 'eventName'
      },
      {
        title: 'Recurrence',
        key: 'recurrence',
        render: (text, record) => (
          <Input
            onChange={e => this.recurrenceChanged(e.target.value, record)}
            value={record.recurrence}
          />
        )
      },
      {
        title: 'Points',
        key: 'points',
        render: (text, record) => (
          <InputNumber
            onChange={e => this.pointsChanged(e, record)}
            value={record.points}
            precision={1}
          />
        )
      }
    ];

    const errors = {
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray')
    };

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection
    };

    return (
      <React.Fragment>
        <Card title="Football Feeds">
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormItem
              validateStatus={errors.timeArray ? 'error' : ''}
              help={errors.timeArray || ''}
              {...formItemLayout}
              label={'Duration'}
            >
              {getFieldDecorator('timeArray', {
                rules: [
                  {
                    required: true,
                    type: 'array',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(
                <RangePicker
                  allowClear="true"
                  format="YYYY-MM-DD"
                  placeholder={['Start Date', 'End Date']}
                />
              )}
            </FormItem>
            <Button type="primary" htmlType="submit">
              Get Matches
            </Button>
          </Form>
        </Card>
        {this.state.matchListFetched && (
          <Card title={'Match List'}>
            <Card type="inner">
              <Input
                value={this.state.searchLeagueString}
                placeholder={'Search by league name'}
                onChange={e => this.searchLeague(e.target.value)}
              />
            </Card>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.matchDisplayList}
              columns={columns}
              rowClassName={(record, index) =>
                record.isVerified && record.verificationLevel === 2
                  ? 'highlight-contest-row'
                  : ''
              }
              scroll={{ x: '100%' }}
            />
          </Card>
        )}
        <Modal
          title={'Player Details'}
          closable={true}
          maskClosable={true}
          width={1300}
          onOk={() => this.updateRoster()}
          onCancel={() => this.closePlayerModal()}
          visible={this.state.showPlayerModal}
          okText="Update Roster"
          cancelText="Close"
          footer={[
            <Button
              type="danger"
              key="close"
              onClick={() => this.closePlayerModal()}
            >
              Close
            </Button>,
            <Button
              type="default"
              key="update_playing_eleven"
              onClick={() => this.updatePlayingEleven()}
            >
              Update Playing Eleven
            </Button>,
            <Button
              type="primary"
              key="update_roster"
              onClick={() => this.updateRoster()}
            >
              Update Roster
            </Button>
          ]}
        >
          <Spin spinning={this.state.loading}>
            <Card bordered={false}>
              {this.state.playerDetailsFetched && (
                <Card>
                  <Card type="inner">
                    <Input
                      value={this.state.searchString}
                      placeholder={'Search by player name'}
                      onChange={e => this.searchPlayer(e.target.value)}
                    />
                  </Card>
                  <div style={{ marginTop: '5px' }}>
                    <span>
                      <Tag color="purple">
                        TOTAL NUMBER OF PLAYERS:{' '}
                        {this.state.totalPlayersInRoster}
                      </Tag>
                      {this.state.selectedRowKeys &&
                        this.state.selectedRowKeys.length > 0 && (
                          <Tag color="green">
                            NUMBER OF SELECTED PLAYERS:{' '}
                            {this.state.selectedRowKeys.length}
                          </Tag>
                        )}
                      <Tag color="magenta">
                        PLAYERS MARKED ACTIVE: {this.state.activeCount}
                      </Tag>
                    </span>
                  </div>
                  <Table
                    rowKey="feedPlayerUid"
                    bordered
                    pagination={false}
                    dataSource={this.state.playerDisplayList}
                    columns={playerColumns}
                    rowSelection={rowSelection}
                  />
                </Card>
              )}
            </Card>
          </Spin>
        </Modal>
        <Modal
          title={'Score'}
          closable={true}
          maskClosable={true}
          width={1100}
          onOk={() => this.closeScoreModal()}
          onCancel={() => this.closeScoreModal()}
          visible={this.state.showScoreModal}
          footer={[
            <Button key="back" onClick={() => this.closeScoreModal()}>
              Close
            </Button>
          ]}
        >
          {!_.isEmpty(this.state.matchDetail) && (
            <Card
              title={
                this.state.matchDetail.title
                  ? this.state.matchDetail.title
                  : this.state.matchDetail.id
              }
            >
              <Table
                rowKey="playerId"
                bordered
                pagination={false}
                dataSource={this.state.matchDetail.playerFantasyPoint}
                columns={scoreTableColumns}
              />
            </Card>
          )}
        </Modal>
        <Modal
          title={'Score Details: ' + this.state.editPlayerName}
          closable={true}
          maskClosable={true}
          width={1100}
          onOk={() => this.savePlayerScores()}
          onCancel={() => this.closeScoreDetailsModal()}
          visible={this.state.showScoreDetailModal}
          okText="Save"
        >
          {this.state.playerScoreDetails.length > 0 && (
            <Table
              rowKey="eventName"
              bordered
              pagination={false}
              dataSource={this.state.playerScoreDetails}
              columns={scoreDetailsTableColumns}
            />
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getFeedsAllMatchesResponse: state.superteamFeed.getFeedsAllMatchesResponse,
    getFeedsMatchRosterResponse:
      state.superteamFeed.getFeedsMatchRosterResponse,
    updateFeedsMatchRosterResponse:
      state.superteamFeed.updateFeedsMatchRosterResponse,
    deleteUpdateRosterResponse: state.superteamFeed.deleteUpdateRosterResponse,
    currentUser: state.auth.currentUser,
    getFeedsFullMatchDetailResponse:
      state.superteamFeed.getFeedsFullMatchDetailResponse,
    updateFeedPlayerPointResponse:
      state.superteamFeed.updateFeedPlayerPointResponse,
    updateFeedPlayingElevenResponse:
      state.superteamFeed.updateFeedPlayingElevenResponse,
    feedsCreateNewMatchIdResponse:
      state.superteamFeed.feedsCreateNewMatchIdResponse,
    moveMatchFromFinishedToLiveResponse:
      state.superteamFeed.moveMatchFromFinishedToLiveResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamFeedActions }, dispatch)
  };
}

const SuperteamFeedForm = Form.create()(SuperteamFeed);
export default connect(mapStateToProps, mapDispatchToProps)(SuperteamFeedForm);
