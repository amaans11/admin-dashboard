// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as lobbyLeaderboardActions from '../../actions/lobbyLeaderboardActions';
import * as leaderboardActions from '../../actions/leaderboardActions';
import {
  Card,
  Table,
  Tooltip,
  Popconfirm,
  Button,
  Avatar,
  message,
  Modal,
  Divider,
  Row,
  Col,
  Tag,
  Input,
  Select
} from 'antd';
import humanizeDuration from 'humanize-duration';
import * as user_role from '../../auth/userPermission';
// type index ={}
const { Meta } = Card;
const { Option } = Select;

const permitted_roles = [
  user_role.LEADERBOARD_ADMIN,
  user_role.LEADERBOARD_WRITE,
  user_role.LEADERBOARD_READ,
  user_role.SUPER_ADMIN
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
class LobbyLeaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lb: [],
      gameOrder: [],
      gameIndex: 0,
      previewVisible: false,
      startCount: 0,
      endCount: 10,
      fetchMoreFlag: true,
      blockReason: '',
      showBlockUserModal: false
    };
    this.markForVerification = this.markForVerification.bind(this);
    this.goBack = this.goBack.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
  }
  componentDidMount() {
    var vm = this;

    this.props.actions.getLobbyLeaderboardHome().then(() => {
      if (vm.props.leaderboard.lb.length === 0) {
        message.info('No Tournaments are runing in this game. Try next one');
      } else {
        this.setState({
          gameOrder: this.props.leaderboard.gameOrder,
          lb: vm.props.leaderboard.lb,
          game: this.props.leaderboard.gameOrder[0],
          gameIndex: 0
        });
        if (
          this.props.leaderboard.gameOrder[0] &&
          this.props.leaderboard.gameOrder[0].groups &&
          this.props.leaderboard.gameOrder[0].groups.length > 10
        ) {
          this.setState({ fetchMoreFlag: true });
        } else {
          this.setState({ fetchMoreFlag: false });
        }
        // let lb = vm.props.leaderboard.lb.slice();
        // this.passUserInfo(lb);
      }
    });
  }

  markForVerification(id) {
    let data = {
      id: id
    };
    this.props.actions.markTournament(data).then(() => {
      if (
        this.props.markTournamentResponse &&
        this.props.markTournamentResponse.status
      ) {
        message.info('Tournament has been mark for verification');
      } else {
        message.error('Could not mark for verification');
      }
      this.setState({ tournamentId: null });
    });
  }

  passUserInfo = lb => {
    lb.map(tournament =>
      tournament.map(el =>
        el.leaderBoard
          ? el.leaderBoard.map(user => (user.tournament = el.tournamentInfo))
          : ''
      )
    );

    this.setState({
      lb: lb
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

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
        1,
        'LOBBY',
        vm.state.blockReason,
        vm.state.game.gameId
      )
      .then(() => {
        this.setState({ blockUserId: null, blockReason: '' });
        message.info('Request sent to block the user');
        this.markForVerification(vm.state.tournamentId);
      });
  }

  blockUser(user) {
    this.setState({
      blockUserId: user.userId,
      showBlockUserModal: true
    });
  }

  getGamePlay(e, record) {
    var vm = this;
    this.props.actions.getUserGamePlay(record).then(() => {
      vm.setState({
        // userProfile: vm.props.leaderboard.userProfile,
        previewVisible: true,
        showUser: false,
        showGamePlay: true
      });
    });
  }
  getUser(user) {
    this.props.actions.getUserProfile(user.userId).then(() => {
      if (this.props.userProfile) {
        this.setState({
          previewVisible: true,
          showUser: true,
          showGamePlay: false
        });
      }
    });
  }
  gameChanged(game, gameIndex, resetValueFlag) {
    console.log('2 --------> ', game, gameIndex, resetValueFlag);
    var vm = this;
    let startCount = this.state.startCount;
    let endCount = this.state.endCount;
    let fetchMore = false;
    if (resetValueFlag) {
      this.setState({
        startCount: 0,
        endCount: 10
      });
      if (game.groups && game.groups.length > 10) {
        fetchMore = true;
      }
      startCount = 0;
      endCount = 10;
      this.setState({
        fetchMoreFlag: fetchMore
      });
    }

    if (game.groups) {
      let groups = game.groups.filter(function(group, index) {
        return index >= startCount && index < endCount;
      });
      this.props.actions
        .getLobbyLeaderboardByGame(groups, gameIndex)
        .then(() => {
          vm.setState({
            gameIndex: gameIndex,
            lb: vm.props.leaderboard.lb,
            game: game
          });
        });
    } else {
      message.info('No Tournaments are runing in this game. Try next one');
    }
  }

  goBack() {
    let startCount = this.state.startCount - 10;
    let endCount = this.state.endCount - 10;

    this.setState(
      { startCount: startCount, endCount: endCount, fetchMoreFlag: true },
      () => this.gameChanged(this.state.game, this.state.gameIndex, false)
    );
  }

  fetchMore() {
    let startCount = this.state.startCount + 10;
    let endCount = this.state.endCount + 10;
    let fetchMore = true;
    if (this.state.game.groups && this.state.game.groups.length > 0) {
      if (endCount < this.state.game.groups.length) {
        fetchMore = true;
      } else {
        fetchMore = false;
      }
    }
    this.setState(
      { startCount: startCount, endCount: endCount, fetchMoreFlag: fetchMore },
      () => this.gameChanged(this.state.game, this.state.gameIndex, false)
    );
  }

  render() {
    const columns = [
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
        title: 'Wins',
        dataIndex: 'wins'
      },
      // {
      //   title: "Prize",
      //   render: (text, record) => (
      //     <React.Fragment>
      //       {record.reward.cash ? (
      //         <span>
      //           C:
      //           {record.reward.cash}
      //         </span>
      //       ) : (
      //         ""
      //       )}
      //       {record.reward.tokens ? (
      //         <span>
      //           T:
      //           {record.reward.tokens}
      //         </span>
      //       ) : (
      //         ""
      //       )}
      //     </React.Fragment>
      //   )
      // },
      {
        title: 'Actions',
        dataIndex: 'action',
        width: 120,
        key: 'action',
        render: (text, record) =>
          permitted_roles.filter(e =>
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
              <Button
                style={{ marginLeft: 5 }}
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
    return (
      <React.Fragment>
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
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {this.props.userProfile && this.state.showUser ? (
            <div>
              <Avatar
                src={
                  this.props.userProfile
                    ? this.props.userProfile.profile.avatars.small
                    : ''
                }
              />
              <span style={{ marginLeft: 10 }}>
                {this.props.userProfile
                  ? this.props.userProfile.profile.displayName
                  : ''}
              </span>
              <div>
                Mobile:{' '}
                {this.props.userProfile
                  ? this.props.userProfile.profile.mobileNumber
                  : ''}
              </div>
              {/* <div>{JSON.stringify(this.state.userProfile.profile)}</div> */}
            </div>
          ) : (
            ''
          )}
          {this.props.leaderboard.userGamePlay && this.state.showGamePlay ? (
            <React.Fragment>
              <Card bordered={false} style={{ fontSize: 15 }}>
                <div>
                  App Verion :
                  {
                    JSON.parse(this.props.leaderboard.userGamePlay)
                      .AppVersionCode
                  }
                </div>
                <div>
                  Game Play Duration :
                  {humanizeDuration(
                    JSON.parse(this.props.leaderboard.userGamePlay)
                      .GameplayDuration,
                    { delimiter: ' and ' }
                  )}
                </div>
                <div>
                  Game Play Duration SDK :
                  {humanizeDuration(
                    parseInt(
                      JSON.parse(this.props.leaderboard.userGamePlay)
                        .GameplayDurationSDK * 1000
                    ),
                    { delimiter: ' and ' }
                  )}
                </div>
                <div>
                  Game Pause Duration :
                  {
                    JSON.parse(this.props.leaderboard.userGamePlay)
                      .GamePauseDuration
                  }
                </div>
                <div>
                  Game Pause Count :
                  {
                    JSON.parse(this.props.leaderboard.userGamePlay)
                      .GamePauseCount
                  }
                </div>
                <div>
                  Game End Reason :
                  {
                    JSON.parse(this.props.leaderboard.userGamePlay)
                      .GameEndReason
                  }
                </div>
                <div>
                  Flag :
                  {JSON.parse(this.props.leaderboard.userGamePlay).Flags
                    ? JSON.parse(this.props.leaderboard.userGamePlay).Flags
                    : 'NA'}
                </div>
                <div>
                  FFlag :
                  {JSON.parse(this.props.leaderboard.userGamePlay).FFlags
                    ? JSON.parse(this.props.leaderboard.userGamePlay).FFlags
                    : 'NA'}
                </div>
              </Card>
              <div>{this.props.leaderboard.userGamePlay}</div>
            </React.Fragment>
          ) : (
            ''
          )}
        </Modal>
        {this.state.lb.length ? (
          <React.Fragment>
            <Card title="Games">
              <div id="game-list-wraper">
                <div style={{ width: this.state.gameOrder.length * 120 }}>
                  {this.state.gameOrder.map((el, index) => {
                    if (el.groups && el.groups.length > 0) {
                      return (
                        <Card
                          key={index}
                          className={
                            index === this.state.gameIndex
                              ? 'active-game games'
                              : 'games'
                          }
                          onClick={() => {
                            this.gameChanged(el, index, true);
                          }}
                          hoverable
                          cover={<img alt="example" src={el.game.thumbnail} />}
                        >
                          <Meta title={el.game.name} />
                        </Card>
                      );
                    }
                  })}
                </div>
              </div>
            </Card>
            <div className="tournament-lb">
              {this.state.lb.length
                ? this.state.lb[this.state.gameIndex].map((el, index) => (
                    <Card
                      key={index}
                      // extra={
                      //   <span>
                      //     <span>
                      //       {moment(el.tournamentInfo.endTime).format(
                      //         'DD/MM/YY hh:mm A'
                      //       )}
                      //     </span>
                      //     {/* {!JSON.parse(el.tournamentInfo.extraInfo)
                      //       .showLeaderboardVerficationStatus ? (
                      //       <span>
                      //         <Button
                      //           size="small"
                      //           type="primary"
                      //           style={{ marginLeft: '5px' }}
                      //           onClick={() =>
                      //             this.markForVerification(
                      //               el.tournamentInfo.tournamentId
                      //             )
                      //           }
                      //         >
                      //           Mark for Verification
                      //         </Button>
                      //       </span>
                      //     ) : (
                      //       <Tag color="red" style={{ marginLeft: '5px' }}>
                      //         Marked for Verification
                      //       </Tag>
                      //     )} */}
                      //   </span>
                      // }
                      title={
                        <span>
                          <span>{el.tournamentInfo.name}</span>
                        </span>
                      }
                    >
                      <Row>
                        <Col span={12}>
                          ID: <strong>{el.tournamentInfo.id}</strong>
                        </Col>
                        <Col span={12}>
                          Start Time:{' '}
                          <strong>
                            {moment(el.tournamentInfo.startTime).format(
                              'DD/MM/YY hh:mm A'
                            )}
                          </strong>
                        </Col>
                        <Col span={12}>
                          End Time:{' '}
                          <strong>
                            {moment(el.tournamentInfo.endTime).format(
                              'DD/MM/YY hh:mm A'
                            )}
                          </strong>
                        </Col>
                        <Col span={12}>
                          Entry Fee:{' '}
                          <strong>
                            {el.tournamentInfo.moneyEntryFee
                              ? el.tournamentInfo.moneyEntryFee
                              : 0}
                          </strong>
                        </Col>
                        <Col span={12}>
                          Currency:{' '}
                          <strong>{el.tournamentInfo.currencyType}</strong>
                        </Col>
                      </Row>
                      <Table
                        style={{ marginTop: '16px' }}
                        rowKey="userId"
                        bordered
                        dataSource={el.leaderBoard ? el.leaderBoard : []}
                        columns={columns}
                      />

                      {/* {el.leaderBoard.map(
                          (user, num) =>
                            num < 20 ? (
                              <div key={num}>
                                <span>
                                  UserId:
                                  {user.userId}
                                </span>
                                <span>
                                  Name:
                                  {user.name}
                                </span>
                                <span>
                                  Score:
                                  {user.score}
                                </span>
                                <span>Rank: {user.rank}</span>
                              </div>
                            ) : (
                              ""
                            )
                        )} */}
                    </Card>
                  ))
                : ''}
            </div>
            <Row>
              <Col style={{ margin: '16px' }} span={24}>
                {this.state.startCount > 1 && (
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
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    leaderboard: state.lobbyLeaderboard,
    currentUser: state.auth.currentUser,
    userProfile: state.leaderboard.userProfile
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...lobbyLeaderboardActions, ...leaderboardActions },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyLeaderboard);
