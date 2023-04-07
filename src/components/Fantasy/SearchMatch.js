// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as fantasyActions from '../../actions/FantasyActions';
import * as superteamCricketFeedActions from '../../actions/SuperteamCricketFeedActions';
import {
  Card,
  Form,
  InputNumber,
  Badge,
  Popconfirm,
  Button,
  message,
  Row,
  Col,
  Radio,
  Modal,
  Spin,
  Input,
  Tag,
  Table,
  Select
} from 'antd';
import moment from 'moment';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;

const CricketPositionOptions = [
  <Option key={'WK'} value={'WK'}>
    WK
  </Option>,
  <Option key={'BAT'} value={'BAT'}>
    BAT
  </Option>,
  <Option key={'BOW'} value={'BOW'}>
    BOW
  </Option>,
  <Option key={'AR'} value={'AR'}>
    AR
  </Option>
];
class SearchMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      searchType: 'MATCH_ID',
      matchDetail: {},
      showPlayerModal: false,
      playerDetailsFetched: false,
      selectedRowKeys: [],
      playerScoreDetails: [],
      loading: false,
      activeCount: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.form.validateFields();
  }

  isLastPlayedMatch = player => {
    if (player.extraInfo && JSON.parse(player.extraInfo).playedLastMatch) {
      return true;
    } else {
      return false;
    }
  };

  getMatchRoster() {
    let data = {
      matchId: this.state.matchDetail.seasonGameUid
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

  updatePlayingEleven() {
    let data = {
      feedMatchId: this.state.matchDetail.feedGameUid,
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
      matchId: this.state.matchDetail.seasonGameUid,
      leagueId: this.state.matchDetail.leagueId,
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

  openScoreModal() {
    let data = {
      matchId: this.state.matchDetail.seasonGameUid
    };
    this.props.actions.getFullMatchDetail(data).then(() => {
      if (this.props.getFeedsFullMatchDetailResponse) {
        this.setState({
          fullMatchDetail: {
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

  closeScoreModal() {
    this.setState({
      showScoreModal: false,
      fullMatchDetail: {}
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
      matchId: this.state.fullMatchDetail.id,
      sportId: 7,
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

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          matchId: values.searchType === 'MATCH_ID' ? values.matchId : null,
          feedMatchId:
            values.searchType === 'FEED_MATCH_ID' ? values.matchId : null,
          isSearchByMatchId: values.searchType === 'MATCH_ID' ? true : false,
          isSearchByFeedMatchId:
            values.searchType === 'FEED_MATCH_ID' ? true : false
        };
        this.props.actions.getMatchDetailById(data).then(() => {
          if (this.props.getMatchDetailByIdResponse) {
            if (_.isEmpty(this.props.getMatchDetailByIdResponse)) {
              message.error('No record found');
              this.setState({
                matchDetail: {},
                fetched: false
              });
            } else {
              this.setState({
                matchDetail: { ...this.props.getMatchDetailByIdResponse },
                fetched: true
              });
            }
          }
        });
      }
    });
  }

  updateMatchDetails() {
    let matchTime = moment(this.state.matchDetail.startTime);
    let startTime = matchTime.subtract(3, 'd').toDate();
    let endTime = matchTime.add(6, 'd').toDate();
    let data = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      leagueId: this.state.matchDetail.leagueId
        ? this.state.matchDetail.leagueId
        : '',
      matchId: this.state.matchDetail.seasonGameUid
    };
    this.props.actions.updateMatchDetails(data).then(() => {
      if (this.props.fantasy && this.props.fantasy.updateMatchDetailsResponse) {
        if (this.props.fantasy.updateMatchDetailsResponse.error) {
          message.error('Unable to update the match details');
        } else {
          message.success('Updated Successfully');
        }
      }
    });
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        lg: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };

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
            {CricketPositionOptions}
          </Select>
        ),
        filters: [
          {
            text: 'WK',
            value: 'WK'
          },
          {
            text: 'BAT',
            value: 'BAT'
          },
          {
            text: 'BOW',
            value: 'BOW'
          },
          {
            text: 'AR',
            value: 'AR'
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
      matchId: isFieldTouched('matchId') && getFieldError('matchId')
    };

    const matchDetail = this.state.matchDetail;

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection
    };

    return (
      <React.Fragment>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label={'Search Type'}>
              {getFieldDecorator('searchType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: this.state.searchType
              })(
                <RadioGroup name="type">
                  <Radio value={'MATCH_ID'}>MATCH ID</Radio>
                  <Radio value={'FEED_MATCH_ID'}>FEED MATCH ID</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.matchId ? 'error' : ''}
              help={errors.matchId || ''}
              {...formItemLayout}
              label={'Match Id'}
            >
              {getFieldDecorator('matchId', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please provide match id!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} style={{ width: '50%' }} />)}
            </FormItem>
            <Button
              type="primary"
              disabled={hasErrors(getFieldsError())}
              htmlType="submit"
            >
              Search
            </Button>
          </Form>
        </Card>
        {this.state.fetched && (
          <Card
            type="inner"
            title={
              <span>
                {' '}
                <Badge
                  count={'A'}
                  status={matchDetail.isActive ? 'processing' : 'error'}
                />
                {matchDetail.title} ({matchDetail.seasonGameUid})
              </span>
            }
            extra={
              <>
                <Button onClick={() => this.getMatchRoster()} type="primary">
                  Match Roster
                </Button>
                <Button
                  style={{ marginLeft: '5px' }}
                  onClick={() => this.openScoreModal()}
                >
                  Get Score
                </Button>
                <Popconfirm
                  title="Sure to update the match details with data from vinfo?"
                  onConfirm={() => this.updateMatchDetails()}
                >
                  <Button style={{ marginLeft: '5px' }}>Update Match</Button>
                </Popconfirm>
              </>
            }
          >
            <Row>
              <Col span={12} style={{}}>
                Match Id: <strong>{matchDetail.seasonGameUid}</strong>
              </Col>
              <Col span={12} style={{}}>
                Feed Match Id: <strong>{matchDetail.feedGameUid}</strong>
              </Col>
              <Col span={12}>
                Match Registration Live Time:
                <strong
                  style={{
                    backgroundColor: moment(matchDetail.startTime).isSame(
                      moment(matchDetail.hardstopTime)
                    )
                      ? 'white'
                      : 'yellow'
                  }}
                >
                  {' '}
                  {moment(matchDetail.startTime).format('YYYY-MM-DD HH:mm')}
                </strong>
              </Col>
              <Col span={12}>
                Sub Title: <strong>{matchDetail.subTitle}</strong>
              </Col>
              <Col span={12}>
                Match Registration Start Time:{' '}
                <strong>
                  {' '}
                  {moment(matchDetail.foreshadowTime).format(
                    'YYYY-MM-DD HH:mm'
                  )}
                </strong>
              </Col>
              <Col span={12}>
                Match Venue: <strong>{matchDetail.matchVenue}</strong>
              </Col>
              <Col span={12}>
                Match Registration End Time:
                <strong
                  style={{
                    backgroundColor: moment(matchDetail.startTime).isSame(
                      moment(matchDetail.hardstopTime)
                    )
                      ? 'white'
                      : 'yellow'
                  }}
                >
                  {' '}
                  {moment(matchDetail.hardstopTime).format('YYYY-MM-DD HH:mm')}
                </strong>
              </Col>
              <Col span={12}>
                Teams Allowed: <strong>{matchDetail.teamsAllowed}</strong>
              </Col>
              <Col span={12}>
                Match Final Status:{' '}
                <strong>{matchDetail.matchFinalStatus}</strong>
              </Col>
              <Col span={12}>
                League Name: <strong>{matchDetail.leagueName}</strong>
              </Col>
              <Col span={12}>
                Order Id: <strong>{matchDetail.orderId}</strong>
              </Col>
            </Row>
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
          {!_.isEmpty(this.state.fullMatchDetail) && (
            <Card
              title={
                this.state.fullMatchDetail.title
                  ? this.state.fullMatchDetail.title
                  : this.state.fullMatchDetail.id
              }
            >
              <Table
                rowKey="playerId"
                bordered
                pagination={false}
                dataSource={this.state.fullMatchDetail.playerFantasyPoint}
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
    fantasy: state.fantasy,
    getMatchDetailByIdResponse: state.fantasy.getMatchDetailByIdResponse,
    getFeedsMatchRosterResponse:
      state.superteamCricketFeed.getFeedsMatchRosterResponse,
    updateFeedsMatchRosterResponse:
      state.superteamCricketFeed.updateFeedsMatchRosterResponse,
    getFeedsFullMatchDetailResponse:
      state.superteamCricketFeed.getFeedsFullMatchDetailResponse,
    updateFeedPlayerPointResponse:
      state.superteamCricketFeed.updateFeedPlayerPointResponse,
    updateFeedPlayingElevenResponse:
      state.superteamCricketFeed.updateFeedPlayingElevenResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...fantasyActions, ...superteamCricketFeedActions },
      dispatch
    )
  };
}
const SearchMatchForm = Form.create()(SearchMatch);
export default connect(mapStateToProps, mapDispatchToProps)(SearchMatchForm);
