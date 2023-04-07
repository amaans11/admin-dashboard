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
  Divider,
  Modal,
  Popconfirm,
  DatePicker,
  InputNumber,
  Badge
} from 'antd';
import TOKEN from '../../assets/ic_coins.png';
import CASH from '../../assets/ic_cash.png';
import * as crmActions from '../../actions/crmActions';
import * as gameActions from '../../actions/gameActions';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
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
  <Option key={4} value={4}>
    Hockey
  </Option>,
  <Option key={3} value={3}>
    Baseball
  </Option>
];

class FantasySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      gameSelectedFlag: false,
      loading: false,
      sportId: null,
      showModal: false,
      matchList: [],
      matchListFetched: false,
      customerDetailsFetched: false,
      teamDetailsFetched: false,
      showLeaderboardModal: false,
      contestLeaderboardDetails: [],
      showTransactionModal: false,
      contestTransactionDetails: [],
      showPlayerScoreModal: false,
      showPlayerPointsModal: false,
      firstRankDetails: {},
      showRewardsModal: false,
      rewardDetails: {}
    };
    this.getContestTeams = this.getContestTeams.bind(this);
  }

  componentDidMount() {
    this.setState({ userId: this.props.userId });
  }

  sportSelected(value) {
    this.setState({ sportId: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          sportId: values.sportId,
          customerDetailsFetched: false,
          teamDetailsFetched: false
        });
        if (values.matchId) {
          let data = {
            sportId: values.sportId,
            matchId: values.matchId
          };
          this.props.actions.getFantasySearchMatchId(data).then(() => {
            if (this.props.getFantasySearchMatchIdResponse) {
              let record = {
                seasonGameUid: this.props.getFantasySearchMatchIdResponse
                  .seasonGameUid
                  ? this.props.getFantasySearchMatchIdResponse.seasonGameUid
                  : null,
                title: this.props.getFantasySearchMatchIdResponse.title
                  ? this.props.getFantasySearchMatchIdResponse.title
                  : null,
                subTitle: this.props.getFantasySearchMatchIdResponse.subTitle
                  ? this.props.getFantasySearchMatchIdResponse.subTitle
                  : null,
                leagueName: this.props.getFantasySearchMatchIdResponse
                  .leagueName
                  ? this.props.getFantasySearchMatchIdResponse.leagueName
                  : null,
                team1Name: this.props.getFantasySearchMatchIdResponse.team1Name
                  ? this.props.getFantasySearchMatchIdResponse.team1Name
                  : null,
                team2Name: this.props.getFantasySearchMatchIdResponse.team2Name
                  ? this.props.getFantasySearchMatchIdResponse.team2Name
                  : null,
                matchFinalStatus: this.props.getFantasySearchMatchIdResponse
                  .matchFinalStatus
                  ? this.props.getFantasySearchMatchIdResponse.matchFinalStatus
                  : null,
                startTime: this.props.getFantasySearchMatchIdResponse.startTime
                  ? this.props.getFantasySearchMatchIdResponse.startTime
                  : null
              };
              let tableData = [];
              tableData.push(record);
              this.setState({
                matchList: [...tableData],
                matchListFetched: true
              });
            } else {
              message.info('No records found');
              this.setState({ matchList: [], matchListFetched: true });
            }
          });
        } else {
          if (values.timeArray[0] && values.timeArray[1]) {
            let data = {
              fromDate: moment(values.timeArray[0]).format('YYYY-MM-DD'),
              endDate: moment(values.timeArray[1]).format('YYYY-MM-DD'),
              sportId: values.sportId
            };
            this.props.actions.getMatchDetails(data).then(() => {
              if (
                this.props.getMatchDetailsResponse &&
                this.props.getMatchDetailsResponse.matchDetailsList &&
                this.props.getMatchDetailsResponse.matchDetailsList.length > 0
              ) {
                this.setState({
                  matchList: [
                    ...this.props.getMatchDetailsResponse.matchDetailsList
                  ],
                  matchListFetched: true
                });
              } else {
                message.info('No records found');
                this.setState({ matchList: [], matchListFetched: true });
              }
            });
          } else {
            message.error('Please enter either duration or search by match Id');
          }
        }
      }
    });
  }

  getCustomerDetails(matchId) {
    this.setState({ matchId: matchId });
    let data = {
      userId: this.state.userId,
      sportId: this.state.sportId,
      matchId: matchId
    };
    this.props.actions.getCutomerDetails(data).then(() => {
      if (this.props.getCustomerDetailsResponse) {
        let contestDetails =
          this.props.getCustomerDetailsResponse.contestDetails &&
          this.props.getCustomerDetailsResponse.contestDetails.length > 0
            ? [...this.props.getCustomerDetailsResponse.contestDetails]
            : [];
        let leaderBoardDetails =
          this.props.getCustomerDetailsResponse.leaderBoardDetails &&
          this.props.getCustomerDetailsResponse.leaderBoardDetails.length > 0
            ? [...this.props.getCustomerDetailsResponse.leaderBoardDetails]
            : [];
        let transactionDetails =
          this.props.getCustomerDetailsResponse.transactionDetails &&
          this.props.getCustomerDetailsResponse.transactionDetails.length > 0
            ? [...this.props.getCustomerDetailsResponse.transactionDetails]
            : [];
        let userTeamsDetails =
          this.props.getCustomerDetailsResponse.userTeamsDetails &&
          this.props.getCustomerDetailsResponse.userTeamsDetails.length > 0
            ? [...this.props.getCustomerDetailsResponse.userTeamsDetails]
            : [];
        console.log(
          '--> ',
          contestDetails[0] && contestDetails[0].rewards
            ? JSON.parse(contestDetails[0].rewards)
            : 'NA'
        );
        this.setState({
          contestDetails: contestDetails,
          leaderBoardDetails: leaderBoardDetails,
          transactionDetails: transactionDetails,
          userTeamsDetails: userTeamsDetails,
          customerDetailsFetched: true
        });
      }
    });
  }

  getContestTeams(contestId) {
    let userTeamsDetails = [...this.state.userTeamsDetails];
    let teamArray = [];
    userTeamsDetails.forEach(element => {
      if (element.contestIds && element.contestIds.includes(contestId)) {
        teamArray.push(element.teamId);
      }
    });
    let teamString = teamArray.join(' ,');
    return teamString;
  }

  getUserTeams() {
    let data = {
      userId: this.state.userId,
      sportId: this.state.sportId,
      matchId: this.state.matchId
    };
    this.props.actions.getUserTeams(data).then(() => {
      if (
        this.props.getUserTeamsResponse &&
        this.props.getUserTeamsResponse.teamDetails &&
        this.props.getUserTeamsResponse.teamDetails.length > 0 &&
        this.props.getUserTeamsResponse.playerDetails
      ) {
        let teamDetails = [...this.props.getUserTeamsResponse.teamDetails];
        let playerDetails = {
          ...this.props.getUserTeamsResponse.playerDetails
        };
        this.setState({
          teamDetails: [...teamDetails],
          playerDetails: { ...playerDetails },
          teamDetailsFetched: true
        });
      } else {
        message.error('Could not fetch user team details');
      }
    });
  }

  showLeaderboardInfo(contestId) {
    let data = {
      contestId: contestId,
      sportId: this.state.sportId,
      matchId: this.state.matchId
    };
    this.props.actions.getFirstRankDetails(data).then(() => {
      if (
        this.props.getFirstRankDetailsResponse &&
        this.props.getFirstRankDetailsResponse
          .getFullLeaderBoardDetailsDashbaord &&
        this.props.getFirstRankDetailsResponse
          .getFullLeaderBoardDetailsDashbaord.length > 0
      ) {
        let firstRankDetails = {
          ...this.props.getFirstRankDetailsResponse
            .getFullLeaderBoardDetailsDashbaord[0]
        };
        this.setState({
          firstRankDetails: { ...firstRankDetails }
        });
      } else {
        this.setState({ firstRankDetails: {} });
        message.error('Could not fetch details of first rank');
      }
      let leaderboardDetails = [...this.state.leaderBoardDetails];
      let contestLeaderboardDetails = _.filter(leaderboardDetails, function(
        item
      ) {
        return item.contestId === contestId;
      });
      this.setState({
        contestLeaderboardDetails: [...contestLeaderboardDetails],
        showLeaderboardModal: true
      });
    });
  }

  showTransactionDetails(contestId) {
    let transactionDetails = [...this.state.transactionDetails];
    let contestTransactionDetails = _.filter(transactionDetails, function(
      item
    ) {
      return item.contestId === contestId;
    });
    this.setState({
      contestTransactionDetails: [...contestTransactionDetails],
      showTransactionModal: true
    });
  }

  closeLeaderboardModal() {
    this.setState({
      showLeaderboardModal: false,
      contestLeaderboardDetails: []
    });
  }

  closeTransactionModal() {
    this.setState({
      showTransactionModal: false,
      contestTransactionDetails: []
    });
  }

  getScore() {
    let data = {
      seasonGameUid: this.state.matchId,
      sportId: this.state.sportId
    };
    this.props.actions.getPlayerScores(data).then(() => {
      if (
        this.props.getPlayerScoreResponse &&
        this.props.getPlayerScoreResponse.matchPlayerScores
      ) {
        this.setState({
          playerScoreList: [
            ...this.props.getPlayerScoreResponse.matchPlayerScores
          ],
          showPlayerScoreModal: true
        });
      } else {
        if (
          this.props.getPlayerScoreResponse &&
          this.props.getPlayerScoreResponse.error
        ) {
          message.error(this.props.getPlayerScoreResponse.error.message);
        } else {
          message.info('Player score list is empty');
        }
      }
    });
  }

  closePlayerScoreModal() {
    this.setState({
      showPlayerScoreModal: false
    });
  }

  showPlayerScorePoints(record) {
    let pointsPlayerName = record.name;
    let playerScorePointsList =
      record.playerScorePointDetails &&
      record.playerScorePointDetails.length > 0
        ? [...record.playerScorePointDetails]
        : [];
    this.setState({
      playerScorePointsList: [...playerScorePointsList],
      showPlayerPointsModal: true,
      pointsPlayerName: pointsPlayerName,
      editPlayerScoreDetailPlayerId: record.playerUid
    });
  }

  closePlayerPointsModal() {
    this.setState({
      playerScorePointsList: [],
      pointsPlayerName: '',
      showPlayerPointsModal: false,
      editPlayerScoreDetailPlayerId: null
    });
  }

  openRewardModal(contestId) {
    let contestDetails = [...this.state.contestDetails];
    let selectedContestDetail = _.find(contestDetails, function(item) {
      return item.contestId === contestId;
    });
    let rewardDetails = selectedContestDetail.rewards
      ? JSON.parse(selectedContestDetail.rewards)
      : 'Not Avaialable';
    this.setState({
      rewardDetails,
      showRewardsModal: true
    });
  }

  closeRewardModal() {
    this.setState({
      rewardDetails: {},
      showRewardsModal: false
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
        key: 'seasonGameUid',
        render: (text, record) => (
          <a onClick={() => this.getCustomerDetails(record.seasonGameUid)}>
            {record.seasonGameUid}
          </a>
        )
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Sub Title',
        dataIndex: 'subTitle',
        key: 'subTitle'
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
      },
      // {
      //   title: 'Teams Allowed',
      //   dataIndex: 'teamsAllowed',
      //   key: 'teamsAllowed'
      // },
      {
        title: 'Match Final Status',
        dataIndex: 'matchFinalStatus',
        key: 'matchFinalStatus',
        sorter: (a, b) => {
          var countA = a.matchFinalStatus.toUpperCase(); // ignore upper and lowercase
          var countB = b.matchFinalStatus.toUpperCase(); // ignore upper and lowercase
          if (countA < countB) {
            return -1;
          }
          if (countA > countB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Start Time',
        key: 'startTime',
        sorter: (a, b) => {
          var dateA = moment(a.startTime);
          var dateB = moment(b.startTime);
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        },
        render: (text, record) => (
          <span>{moment(record.startTime).format('DD/MM/YYYY HH:mm')}</span>
        )
      }
      // {
      //   title: 'Activation Time',
      //   key: 'activationTime',
      //   render: (text, record) => (
      //     <span>
      //       {moment(record.activationTime).format('DD/MM/YYYY HH:mm')}
      //     </span>
      //   )
      // },
      // {
      //   title: 'Match End Time',
      //   key: 'matchEndTime',
      //   render: (text, record) => (
      //     <span>{moment(record.matchEndTime).format('DD/MM/YYYY HH:mm')}</span>
      //   )
      // }
    ];

    const contestColumns = [
      {
        title: 'Contest Id',
        key: 'contestId',
        render: (text, record) => (
          <span>
            <>
              <Badge
                count={'A'}
                status={record.isActive ? 'processing' : 'error'}
              />
              <Divider type="vertical" />
            </>
            {record.contestId}
          </span>
        )
      },
      {
        title: 'Contest Name',
        dataIndex: 'contestName',
        key: 'contestName'
      },
      {
        title: 'Contest Type',
        dataIndex: 'contestType',
        key: 'contestType'
      },
      {
        title: 'Entry Fee',
        key: 'entryCurrency',
        render: (text, record) => (
          <span>
            <span>{record.entryFee ? record.entryFee : 0}</span>
            <span>
              <img
                style={{ width: '15px', marginLeft: 5 }}
                src={
                  record.entryCurrency.toLowerCase() === 'token' ? TOKEN : CASH
                }
                alt=""
              />
            </span>
          </span>
        )
      },
      {
        title: 'Team Ids',
        key: 'teams',
        render: (text, record) => (
          <span>{this.getContestTeams(record.contestId)}</span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.showLeaderboardInfo(record.contestId)}
              type="primary"
              size="small"
            >
              Leaderboard Info
            </Button>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <Button
              onClick={() => this.showTransactionDetails(record.contestId)}
              size="small"
            >
              Transaction Details
            </Button>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <Button
              onClick={() => this.openRewardModal(record.contestId)}
              size="small"
            >
              Reward Details
            </Button>
          </span>
        )
      }
    ];

    const leaderboardColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'User Tier',
        dataIndex: 'userTier',
        key: 'userTier'
      },
      {
        title: 'Contest Id',
        dataIndex: 'contestId',
        key: 'contestId'
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
        key: 'score',
        render: (text, record) => <span>{record.score ? record.score : 0}</span>
      },
      {
        title: 'Rank',
        key: 'rank',
        render: (text, record) => <span>{record.rank ? record.rank : 0}</span>
      },
      {
        title: 'Prize',
        key: 'prize',
        render: (text, record) => (
          <span>
            <span>{record.cashPrize ? record.cashPrize : 0}</span>
            <span>
              <img style={{ width: '15px', marginLeft: 5 }} src={CASH} alt="" />
            </span>
            <Divider style={{ margin: 2 }} type="vertical" />
            <span>{record.tokenPrize ? record.tokenPrize : 0}</span>
            <span>
              <img
                style={{ width: '15px', marginLeft: 5 }}
                src={TOKEN}
                alt=""
              />
            </span>
            <Divider style={{ margin: 2 }} type="vertical" />
            <span>{record.bonusCashPrize ? record.bonusCashPrize : 0}</span>
            <span> Bonus </span>
            <span>
              <img style={{ width: '15px', marginLeft: 5 }} src={CASH} alt="" />
            </span>
          </span>
        )
      },
      {
        title: 'Tie Count',
        key: 'tieCount',
        render: (text, record) => (
          <span>{record.tieCount ? record.tieCount : 0}</span>
        )
      }
    ];

    const transactionColumns = [
      {
        title: 'Transaction Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Amount',
        key: 'amount',
        render: (text, record) => (
          <span>{record.amount ? record.amount : 0}</span>
        )
      },
      {
        title: 'Transaction Type',
        key: 'transactionType',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '200px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.transactionType}
          </div>
        )
      },
      {
        title: 'Money Type',
        dataIndex: 'moneyType',
        key: 'moneyType'
      },
      {
        title: 'Reference Id',
        key: 'referenceId',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '200px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.referenceId}
          </div>
        )
      },
      {
        title: 'Reference Type',
        key: 'referenceType',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '200px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.referenceType}
          </div>
        )
      },
      {
        title: 'Created At',
        key: 'createdAt',
        render: (text, record) => (
          <span>{moment(record.createdAt).format('DD/MM/YYYY HH:mm')}</span>
        )
      },
      {
        title: 'Contest Id',
        dataIndex: 'contestId',
        key: 'contestId'
      }
    ];

    const playerScoreColumns = [
      {
        title: 'Player Uid',
        dataIndex: 'playerUid',
        key: 'playerUid'
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName'
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName'
      },
      {
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score'
      },
      {
        title: 'Player Team Id',
        dataIndex: 'playerTeamId',
        key: 'playerTeamId'
      },
      {
        title: 'Team',
        dataIndex: 'playerTeamName',
        key: 'playerTeamName',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.playerTeamId - b.playerTeamId
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button onClick={() => this.showPlayerScorePoints(record)}>
              Details
            </Button>
          </span>
        )
      }
    ];

    const playerScorePointsColumns = [
      {
        title: 'Event Name',
        dataIndex: 'eventName',
        key: 'eventName'
      },
      {
        title: 'Recurrence',
        key: 'recurrence',
        dataIndex: 'recurrence'
      },
      {
        title: 'Points',
        key: 'points',
        render: (text, record) => (
          <span>{record.points ? record.points : 0} </span>
        )
      }
    ];

    const rewardTableColumns = [
      {
        title: 'Start Rank',
        dataIndex: 'startRank',
        key: 'startRank'
      },
      {
        title: 'End Rank',
        dataIndex: 'endRank',
        key: 'endRank'
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
        title: 'Bonus Cash Prize',
        dataIndex: 'bonusCashPrize',
        key: 'bonusCashPrize'
      },
      {
        title: 'Special Prize',
        dataIndex: 'specialPrize',
        key: 'specialPrize'
      }
    ];

    const errors = {
      sportId: isFieldTouched('sportId') && getFieldError('sportId'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray'),
      matchId: isFieldTouched('matchId') && getFieldError('matchId')
    };

    return (
      <React.Fragment>
        <Card>
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormItem
              validateStatus={errors.sportId ? 'error' : ''}
              help={errors.sportId || ''}
              {...formItemLayout}
              label={<span>Sports Id</span>}
            >
              {getFieldDecorator('sportId', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please select a sport',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder="Select a fantasy sport"
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
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.timeArray ? 'error' : ''}
              help={errors.timeArray || ''}
              {...formItemLayout}
              label={'Duration'}
            >
              {getFieldDecorator('timeArray', {
                rules: [
                  {
                    required: false,
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
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              - OR -
            </div>
            <FormItem
              validateStatus={errors.matchId ? 'error' : ''}
              help={errors.matchId || ''}
              {...formItemLayout}
              label={'Match ID'}
            >
              {getFieldDecorator('matchId', {
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'Please input match id!',
                    whitespace: false
                  }
                ]
              })(
                <InputNumber
                  style={{ width: '300px' }}
                  min={0}
                  placeholder="Search by Match Id"
                />
              )}
            </FormItem>
            <Button type="primary" htmlType="submit">
              Get Matches
            </Button>
          </Form>
        </Card>
        {this.state.matchListFetched && (
          <Card type="inner">
            <Table
              rowKey="seasonGameUid"
              bordered
              pagination={false}
              dataSource={this.state.matchList}
              columns={columns}
              scroll={{ x: '100%' }}
            />
          </Card>
        )}
        {this.state.customerDetailsFetched && (
          <Card>
            <Card type="inner">
              <span>
                <span>
                  <strong>Match Id: </strong> {this.state.matchId}
                </span>
                <Button
                  style={{ marginLeft: '5px' }}
                  type="primary"
                  onClick={() => this.getUserTeams()}
                >
                  Get Team Details
                </Button>
              </span>
            </Card>
            <Table
              rowKey="contestId"
              bordered
              pagination={false}
              dataSource={this.state.contestDetails}
              columns={contestColumns}
              scroll={{ x: '100%' }}
            />
          </Card>
        )}
        {this.state.teamDetailsFetched && (
          <Card
            title={
              <span>
                <strong>Match Id:</strong> {this.state.matchId}
                <Button
                  style={{ marginLeft: '10px' }}
                  type="primary"
                  onClick={() => this.getScore()}
                >
                  Get Player Scores
                </Button>
              </span>
            }
          >
            <Row>
              {this.state.teamDetails.map(item => (
                <Col span={12}>
                  <Card type="inner">
                    <Col span={24}>
                      <strong>Team ID:</strong> {item.teamId}
                    </Col>
                    <Col span={24}>
                      <strong>Team Name:</strong> {item.teamName}
                    </Col>
                    <Col span={24}>
                      <strong>Captain:</strong>{' '}
                      {item.captainPlayerTeamId
                        ? this.state.playerDetails[item.captainPlayerTeamId]
                            .name
                        : 'N/A'}
                    </Col>
                    <Col span={24}>
                      <strong>Vice Captain:</strong>{' '}
                      {item.viceCaptainPlayerTeamId
                        ? this.state.playerDetails[item.viceCaptainPlayerTeamId]
                            .name
                        : 'N/A'}
                    </Col>
                    <Col span={24}>
                      <strong>Team Players:</strong>
                    </Col>
                    {item.playerTeamIds.map(player => (
                      <Col span={24}>
                        {this.state.playerDetails[player].name}
                      </Col>
                    ))}
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
        <Modal
          title={'Leaderboard Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeLeaderboardModal()}
          onCancel={() => this.closeLeaderboardModal()}
          visible={this.state.showLeaderboardModal}
          footer={[
            <Button onClick={() => this.closeLeaderboardModal()}>Close</Button>
          ]}
        >
          <Card bordered={false}>
            {this.state.customerDetailsFetched && (
              <>
                {this.state.firstRankDetails.userId && (
                  <Row>
                    <Col span={24}>First Rank Details</Col>
                    <Col span={12}>
                      <strong>User Id: </strong>
                      {this.state.firstRankDetails.userId
                        ? this.state.firstRankDetails.userId
                        : 'N/A'}
                    </Col>
                    <Col span={12}>
                      <strong>Team Id: </strong>
                      {this.state.firstRankDetails.teamId
                        ? this.state.firstRankDetails.teamId
                        : 'N/A'}
                    </Col>
                    <Col span={12}>
                      <strong>Team Name: </strong>
                      {this.state.firstRankDetails.teamName
                        ? this.state.firstRankDetails.teamName
                        : 'N/A'}
                    </Col>
                    <Col span={12}>
                      <strong>Score: </strong>
                      {this.state.firstRankDetails.score
                        ? this.state.firstRankDetails.score
                        : 'N/A'}
                    </Col>
                    <Col span={12}>
                      <strong>Prize: </strong>
                      <span>
                        <span>
                          {this.state.firstRankDetails.cashPrize
                            ? this.state.firstRankDetails.cashPrize
                            : 0}
                        </span>
                        <span>
                          <img
                            style={{ width: '15px', marginLeft: 5 }}
                            src={CASH}
                            alt=""
                          />
                        </span>
                        <span>
                          {this.state.firstRankDetails.tokenPrize
                            ? this.state.firstRankDetails.tokenPrize
                            : 0}
                        </span>
                        <span>
                          <img
                            style={{ width: '15px', marginLeft: 5 }}
                            src={TOKEN}
                            alt=""
                          />
                        </span>
                        <span>
                          {this.state.firstRankDetails.bonusCashPrize
                            ? this.state.firstRankDetails.bonusCashPrize
                            : 0}
                        </span>
                        <span> Bonus </span>
                        <span>
                          <img
                            style={{ width: '15px', marginLeft: 5 }}
                            src={CASH}
                            alt=""
                          />
                        </span>
                      </span>
                    </Col>
                  </Row>
                )}
                <Table
                  style={{ marginTop: '10px' }}
                  rowKey="teamId"
                  bordered
                  pagination={false}
                  dataSource={this.state.contestLeaderboardDetails}
                  columns={leaderboardColumns}
                />
              </>
            )}
          </Card>
        </Modal>
        <Modal
          title={'Transaction Details'}
          closable={true}
          maskClosable={true}
          width={1100}
          onOk={() => this.closeTransactionModal()}
          onCancel={() => this.closeTransactionModal()}
          visible={this.state.showTransactionModal}
          footer={[
            <Button onClick={() => this.closeTransactionModal()}>Close</Button>
          ]}
        >
          <Card bordered={false}>
            {this.state.customerDetailsFetched && (
              <Table
                rowKey="teamId"
                bordered
                pagination={false}
                dataSource={this.state.contestTransactionDetails}
                columns={transactionColumns}
              />
            )}
          </Card>
        </Modal>
        <Modal
          title={'Player Score Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closePlayerScoreModal()}
          onCancel={() => this.closePlayerScoreModal()}
          visible={this.state.showPlayerScoreModal}
          footer={[
            <Button onClick={() => this.closePlayerScoreModal()}>Close</Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="playerUid"
              bordered
              pagination={false}
              dataSource={this.state.playerScoreList}
              columns={playerScoreColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={this.state.pointsPlayerName}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closePlayerPointsModal()}
          onOk={() => this.closePlayerPointsModal()}
          visible={this.state.showPlayerPointsModal}
          footer={[
            <Button onClick={() => this.closePlayerPointsModal()}>Close</Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="eventName"
              bordered
              pagination={false}
              dataSource={this.state.playerScorePointsList}
              columns={playerScorePointsColumns}
            />
          </Card>
        </Modal>
        <Modal
          title="Reward Details"
          closable={true}
          maskClosable={true}
          width={1100}
          onCancel={() => this.closeRewardModal()}
          onOk={() => this.closeRewardModal()}
          visible={this.state.showRewardsModal}
          footer={[
            <Button onClick={() => this.closeRewardModal()}>Close</Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Row>
              <Col span={12}>
                bonusCashWinnerPercentage:{' '}
                {this.state.rewardDetails &&
                  this.state.rewardDetails.bonusCashWinnerPercentage}
              </Col>
              <Col span={12}>
                cashWinnerPercentage:{' '}
                {this.state.rewardDetails &&
                  this.state.rewardDetails.cashWinnerPercentage}
              </Col>
              <Col span={12}>
                tokenWinnerPercentage:{' '}
                {this.state.rewardDetails &&
                  this.state.rewardDetails.tokenWinnerPercentage}
              </Col>
              <Col span={12}>
                totalBonusCash:{' '}
                {this.state.rewardDetails &&
                  this.state.rewardDetails.totalBonusCash}
              </Col>
              <Col span={12}>
                totalCash:{' '}
                {this.state.rewardDetails && this.state.rewardDetails.totalCash}
              </Col>
              <Col span={12}>
                totalTokens:{' '}
                {this.state.rewardDetails &&
                  this.state.rewardDetails.totalTokens}
              </Col>
              <Col span={12}>
                totalWinners:{' '}
                {this.state.rewardDetails &&
                  this.state.rewardDetails.totalWinners}
              </Col>
              <Col span={24}>
                <Table
                  bordered
                  pagination={false}
                  dataSource={
                    this.state.rewardDetails &&
                    this.state.rewardDetails.prizeBreakups &&
                    this.state.rewardDetails.prizeBreakups.length > 0
                      ? this.state.rewardDetails.prizeBreakups
                      : []
                  }
                  columns={rewardTableColumns}
                />
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
    getUserTransactionDetailsResponse:
      state.crm.getUserTransactionDetailsResponse,
    getReferenceIdResponse: state.crm.getReferenceIdResponse,
    processBulkTransactionRefundResponse:
      state.crm.processBulkTransactionRefundResponse,
    getMatchDetailsResponse: state.crm.getMatchDetailsResponse,
    getCustomerDetailsResponse: state.crm.getCustomerDetailsResponse,
    getUserTeamsResponse: state.crm.getUserTeamsResponse,
    getPlayerScoreResponse: state.crm.getPlayerScoreResponse,
    getFirstRankDetailsResponse: state.crm.getFirstRankDetailsResponse,
    getFantasySearchMatchIdResponse: state.crm.getFantasySearchMatchIdResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...crmActions, ...gameActions }, dispatch)
  };
}

const FantasySelectionForm = Form.create()(FantasySelection);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FantasySelectionForm);
