import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { get } from 'lodash';
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
  Tabs,
  Checkbox
} from 'antd';
import * as crmActions from '../../actions/crmActions';
import * as gameActions from '../../actions/gameActions';
import * as accountActions from '../../actions/accountsActions';

const { TabPane } = Tabs;

const userBattleStateList = ['WAITING', 'FINISHED', 'CANCELLED'];
const winningStateList = ['WINNER', 'LOSER', 'TIED', 'PENDING', 'REFUNDED'];
class CallbreakSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      battleList: [],
      loading: false,
      battleStart: 0,
      showTransactionModal: false,
      transactionDetailsFetched: false,
      transactionDetails: [],
      selectedTransactionRefundCount: 0,
      transactionIdsForRefund: {},
      isAdmin: false,
      showGameDataModal: false,
      showGameDataDetials: false,
      cardData: [],
      cardDataAvailable: false,
      totalScoreCalculated: false,
      currentTab: '1',
      refundDetails: [],
      gameName: '',
      gameId: '',
      isRefundDisable: false
    };
    this.getBattleState = this.getBattleState.bind(this);
    this.getWinningState = this.getWinningState.bind(this);
  }

  componentDidMount() {
    this.props.actions.getRefundConfig().then(() => {
      this.setState({
        isRefundDisable: this.props.refundConfig
      });
    });
    if (
      this.props.currentUser.user_role.includes('SUPER_ADMIN') ||
      this.props.currentUser.user_role.includes('CRM_ADMIN') ||
      this.props.currentUser.user_role.includes('CRM_WRITE') ||
      this.props.currentUser.user_role.includes('L1') ||
      this.props.currentUser.user_role.includes('L2')
    ) {
      this.setState({ isAdmin: true });
    } else {
      this.setState({ isAdmin: false });
    }
    this.setState({ userId: this.props.userId }, () => {
      this.getBattleHistory();
    });
  }
  onTabChangeHandler = key => {
    this.setState(
      {
        currentTab: key,
        refundDetails: []
      },
      () => {
        if (key == '2') {
          this.getRefundDetails();
        }
      }
    );
  };
  getRefundDetails = () => {};

  getBattleHistory() {
    this.setState({ getRequestType: 'BATTLE', loading: true });
    let data = {
      userId: this.state.userId,
      start: this.state.battleStart,
      count: 30
    };
    this.props.actions.getPlayerLobbyHistory(data).then(() => {
      if (this.props.getPlayerLobbyHistoryResponse) {
        let battleList = [];
        if (
          this.props.getPlayerLobbyHistoryResponse.finishedBattles &&
          this.props.getPlayerLobbyHistoryResponse.finishedBattles.length > 0
        ) {
          battleList = [
            ...this.props.getPlayerLobbyHistoryResponse.finishedBattles
          ];
          let count = battleList.length;
          if (count > 29) {
            this.setState({ battleFetchNext: true });
          } else {
            this.setState({ battleFetchNext: false });
          }
        } else {
          message.info('No records found');
        }
        this.setState({ battleList: [...battleList], loading: false });
      } else {
        this.setState({ battleList: [], loading: false });
      }
    });
  }

  getReferenceIdBattle(item) {
    let data = {
      userId: this.state.userId,
      tournamentId: item.lobbyId,
      battleId: item.battleId
    };
    this.props.actions.getReferenceId(data).then(() => {
      if (
        this.props.getReferenceIdResponse &&
        this.props.getReferenceIdResponse.referenceId
      ) {
        let transactionFetchData = {
          userId: this.state.userId,
          referenceId: this.props.getReferenceIdResponse.referenceId,
          countryCode: this.props.countryCode
        };
        this.props.actions
          .getUserTransactionDetails(transactionFetchData)
          .then(() => {
            if (this.props.getUserTransactionDetailsResponse) {
              let transactionDetails = [
                ...this.props.getUserTransactionDetailsResponse
                  .transactionHistory
              ];
              this.setState({
                showTransactionModal: true,
                transactionDetails: [...transactionDetails],
                transactionDetailsFetched: true,
                gameName: item.gameName,
                gameId: item.battleId
              });
            }
          });
      } else {
        message.error('Could not fetch reference Id');
      }
    });
  }

  closeTransactionModal() {
    this.setState({
      showTransactionModal: false,
      transactionDetailsFetched: false,
      transactionIdsForRefund: {},
      currentTab: '1',
      refundDetails: []
    });
  }

  getBattleState(value) {
    return userBattleStateList[value];
  }

  getWinningState(value) {
    return winningStateList[value];
  }

  fetchMoreBattles() {
    let battleStart = this.state.battleStart + 30;
    this.setState({ battleStart: battleStart }, () => this.getBattleHistory());
  }

  fetchPreviousBattles() {
    let battleStart = this.state.battleStart - 30;
    this.setState({ battleStart: battleStart }, () => this.getBattleHistory());
  }
  processRefunds = async () => {
    const { transactionIdsForRefund } = this.state;
    const { disabledAgents, refundRole } = this.props;
    const email = get(this.props.currentUser, 'email', '');

    if (
      disabledAgents &&
      disabledAgents.length > 0 &&
      disabledAgents.includes(email)
    ) {
      const data = {
        email,
        role: refundRole
      };
      message.error('You are restricted to do refunds from CRM dashboard!');
      setTimeout(() => {
        this.props.actions.sendRefundFlockAlerts(data);
      }, 3000);
      return;
    }
    if (
      transactionIdsForRefund &&
      Object.keys(transactionIdsForRefund).length > 0
    ) {
      this.props.actions
        .processTransactionRefund(transactionIdsForRefund)
        .then(() => {
          if (this.props.refundResponse && this.props.refundResponse.error) {
            let error = this.props.refundResponse.error
              ? this.props.refundResponse.error.message
              : 'Refund cannot be  processed ! Please try again';
            message.error(error, 5);
            this.setState({
              showTransactionModal: false,
              transactionIdsForRefund: {},
              transactionDetailsFetched: false,
              currentTab: '1',
              refundDetails: []
            });
          } else {
            this.setState(
              {
                showTransactionModal: false,
                transactionIdsForRefund: {},
                transactionDetailsFetched: false,
                currentTab: '1',
                refundDetails: []
              },
              () => {
                message.success('Refund Successful!', 5);
              }
            );
          }
        });
    }
  };

  getBattleGameData(record) {
    let data = {
      battleId: record.battleId
    };
    this.props.actions.getBattleGameData(data).then(() => {
      if (
        this.props.getBattleGameDataResponse &&
        this.props.getBattleGameDataResponse.userBattleGameData
      ) {
        let gameDataList = [];
        let gameDataListKeys = Object.keys(
          this.props.getBattleGameDataResponse.userBattleGameData
        );
        let gameDataListValues = Object.values(
          this.props.getBattleGameDataResponse.userBattleGameData
        );
        gameDataListKeys.forEach((element, index) => {
          let cursor = {};
          cursor['userId'] = element;
          cursor['battleData'] = gameDataListValues[index]
            ? JSON.parse(gameDataListValues[index])
            : {};
          gameDataList.push(cursor);
        });
        this.setState({
          gameDataList: [...gameDataList]
        });
        let cardData = [];
        if (
          gameDataList[0] &&
          gameDataList[0]['battleData'] &&
          gameDataList[0]['battleData']['LOG']
        ) {
          cardData = [...gameDataList[0]['battleData']['LOG']];
          this.setState({
            cardData,
            cardDataAvailable: true,
            showGameDataModal: true
          });
        } else {
          this.setState({
            cardData: [],
            cardDataAvailable: false,
            showGameDataModal: true
          });
        }
      } else {
        message.info('Battle game data could not be fetched');
      }
    });
  }

  showGameDataDetials(record) {
    this.setState({
      gameDataDetials: { ...record },
      showGameDataDetials: true
    });
  }

  closeGameDataModal() {
    this.setState({
      gameDataList: [],
      showGameDataModal: false,
      gameDataDetials: {},
      showGameDataDetials: false
    });
  }
  onCheckboxHandler = (record, value) => {
    const {
      selectedTransactionRefundCount,
      transactionIdsForRefund,
      gameName,
      gameId
    } = this.state;

    const email = get(this.props.currentUser, 'email', '');

    if (value) {
      let transactionIds = [];

      if (
        transactionIdsForRefund.transactionIds &&
        transactionIdsForRefund.transactionIds.length > 0
      ) {
        transactionIds = [
          ...transactionIdsForRefund.transactionIds,
          record.transactionId
        ];
      } else {
        transactionIds.push(record.transactionId);
      }

      this.setState({
        selectedTransactionRefundCount: selectedTransactionRefundCount + 1,
        transactionIdsForRefund: {
          transactionIds: [...transactionIds],
          userId: this.props.userId,
          referenceId: '',
          referenceType: record.referenceType,
          refundReferenceType:
            this.state.getRequestType === 'BATTLE'
              ? 'BATTLE_WINNINGS_CS_REFUND'
              : 'TOURNAMENT_WINNINGS_CS_REFUND',
          refundDescription: `Refund done for reference id ${record.referenceId}`,
          updateBalanceRequest: [],
          refundType: 'games',
          emailId: email,
          gameName: gameName,
          gameId: gameId,
          refundSource: 'CRM Dashboard',
          countryCode: this.props.countryCode
        }
      });
    } else {
      let transactionRefunds = this.state.transactionIdsForRefund;
      let transactionIds = [...transactionRefunds.transactionIds];
      let refundIds = transactionIds.filter(id => record.transactionId !== id);
      if (refundIds.length > 0) {
        transactionRefunds.transactionIds = [...refundIds];
      } else {
        transactionRefunds = {};
      }
      this.setState({
        selectedTransactionRefundCount: selectedTransactionRefundCount - 1,
        transactionIdsForRefund: transactionRefunds
      });
    }
  };
  getRefundDetails = () => {
    const { transactionDetails } = this.state;
    let result = [];
    let data = {
      userId: this.props.userId
    };
    if (transactionDetails && transactionDetails.length > 0) {
      transactionDetails.map(transaction => {
        if (transaction.transactionType === 'DEBIT') {
          data = {
            ...data,
            referenceId: `TRID_${transaction.transactionId}`,
            countryCode: this.props.countryCode
          };
          this.props.actions.getUserTransactionDetails(data).then(() => {
            if (
              this.props.getUserTransactionDetailsResponse &&
              this.props.getUserTransactionDetailsResponse.transactionHistory &&
              this.props.getUserTransactionDetailsResponse.transactionHistory
                .length > 0
            ) {
              result.push(
                this.props.getUserTransactionDetailsResponse.transactionHistory
              );
              this.setState({
                refundDetails: [
                  ...this.state.refundDetails,
                  ...this.props.getUserTransactionDetailsResponse
                    .transactionHistory
                ]
              });
            } else {
              this.setState({
                refundDetails: []
              });
            }
          });
        }
      });
    }
  };
  getTransactionColumns = () => {
    const transactionColumns = [
      {
        title: '',
        dataIndex: 'select',
        key: 'select',
        render: (text, record) => (
          <Checkbox
            onChange={e => this.onCheckboxHandler(record, e.target.checked)}
            disabled={record && record.transactionType === 'CREDIT'}
          />
        )
      },
      {
        title: 'Transaction Id',
        dataIndex: 'transactionId',
        key: 'transactionId'
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount'
      },
      {
        title: 'Transaction Type',
        dataIndex: 'transactionType',
        key: 'transactionType'
      },
      {
        title: 'Money Type',
        dataIndex: 'moneyType',
        key: 'moneyType'
      },
      {
        title: 'Reference Type',
        dataIndex: 'referenceType',
        key: 'referenceType'
      },
      {
        title: 'Reference Id',
        key: 'referenceId',
        render: (text, record) => (
          <div
            style={{
              width: '200px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.referenceId}
          </div>
        )
      },
      {
        title: 'Date',
        key: 'date',
        render: (text, record) => (
          <span>{moment(record.date, 'x').format('DD/MM/YY hh:mm A')}</span>
        )
      }
    ];
    return transactionColumns;
  };

  render() {
    const {
      refundDetails,
      transactionIdsForRefund,
      isRefundDisable
    } = this.state;
    const transactionColumns = this.getTransactionColumns();

    const cardTableColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
        width: '9%'
      },
      {
        title: 'Bid',
        dataIndex: 'bid',
        key: 'bid',
        width: '6%'
      },
      {
        title: 'Hands Made',
        dataIndex: 'handsMade',
        key: 'handsMade',
        width: '6%'
      },
      {
        title: 'Score',
        key: 'score',
        width: '9%',
        render: (text, record) => <span>{record.score ? record.score : 0}</span>
      },
      {
        title: 'Cards',
        key: 'cards',
        render: (text, record) => (
          <Row type="flex">
            {record.cards &&
              record.cards.length > 0 &&
              record.cards.map((cardObj, index) => {
                let image = '';
                let card = cardObj.card.trim().split('-');
                switch (card[0]) {
                  case 'L':
                    image = card[1] != 14 ? 'Hearts_' + card[1] : 'Hearts_1';
                    break;
                  case 'F':
                    image = card[1] != 14 ? 'Clubs_' + card[1] : 'Clubs_1';
                    break;
                  case 'K':
                    image = card[1] != 14 ? 'Spades_' + card[1] : 'Spades_1';
                    break;
                  case 'S':
                    image =
                      card[1] != 14 ? 'Diamonds_' + card[1] : 'Diamonds_1';
                    break;
                  default:
                    break;
                }
                return (
                  <Col key={cardObj + index} style={{ width: '7%' }}>
                    {cardObj.isFirst && (
                      <div
                        style={{
                          fontSize: '8px',
                          color: '#3e9442',
                          fontWeight: 'bold'
                        }}
                      >
                        FIRST
                      </div>
                    )}
                    <img
                      height="50"
                      src={require(`../../assets/rummy/${image}.png`)}
                      alt=""
                    />
                    {cardObj.isBot && (
                      <div
                        style={{
                          fontSize: '8px',
                          color: '#bf7d3b',
                          fontWeight: 'bold'
                        }}
                      >
                        BOT
                      </div>
                    )}
                  </Col>
                );
              })}
          </Row>
        )
      }
    ];

    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          {this.state.battleList.length > 0 && (
            <div>
              {this.state.battleList.map(item => (
                <Card
                  title={
                    <Button onClick={() => this.getBattleGameData(item)}>
                      Battle Game Data
                    </Button>
                  }
                  key={item.battleId}
                  type="inner"
                  style={{ marginTop: '5px', border: '2px solid #677378' }}
                  extra={
                    <Button onClick={() => this.getReferenceIdBattle(item)}>
                      Transaction Details
                    </Button>
                  }
                >
                  <Row>
                    <Col span={12}>
                      <strong>Battle Id:</strong> {item.battleId}
                    </Col>
                    <Col span={12}>
                      <strong>Start Time:</strong>{' '}
                      {moment(item.battleStartTime).format('DD/MM/YY hh:mm A')}
                    </Col>
                    <Col span={12}>
                      <strong>Game Id:</strong> {item.gameId}
                    </Col>
                    <Col span={12}>
                      <strong>Game Name:</strong> {item.gameName}
                    </Col>
                    <Col span={12}>
                      <strong>Lobby Id:</strong> {item.lobbyId}
                    </Col>
                    <Col span={12}>
                      <strong>Lobby Name:</strong> {item.lobbyName}
                    </Col>
                    <Col span={12}>
                      <strong>User Battle State:</strong>{' '}
                      {this.getBattleState(
                        item.userBattleState ? item.userBattleState : 0
                      )}
                    </Col>
                    <Col span={24}>
                      {item.battlePlayers.map(user => {
                        let moneyEntryFee = user.moneyEntryFee;
                        if (user.extraInfo) {
                          try {
                            const extraInfo = JSON.parse(user.extraInfo);
                            if (extraInfo.noOfRejoins > 0) {
                              moneyEntryFee = `${moneyEntryFee *
                                (extraInfo.noOfRejoins + 1)} ( ${
                                extraInfo.noOfRejoins
                              } Rejoins )`;
                            }
                          } catch (e) {}
                        }
                        return (
                          <Card key={item.battleId + user.userId} type="inner">
                            <Row>
                              <Col span={6}>
                                <strong>User Id: </strong>
                                {user.userId}
                              </Col>
                              <Col span={6}>
                                <strong>User Name: </strong>
                                {user.userName}
                              </Col>
                              <Col span={6}>
                                <strong>Score: </strong>
                                {user.score}
                              </Col>
                              <Col span={6}>
                                <strong>Rank: </strong>
                                {user.rank}
                              </Col>
                              <Col span={6}>
                                <strong>Entry Currency: </strong>
                                {user.entryCurrency}
                              </Col>
                              <Col span={6}>
                                <strong>Entry Fee: </strong>
                                {moneyEntryFee}
                              </Col>
                              <Col span={6}>
                                <strong>Winning State: </strong>
                                {this.getWinningState(
                                  user.winningState ? user.winningState : 0
                                )}
                              </Col>
                              <Col span={6}>
                                <strong>Winnings: </strong>
                                {user.cashWinningsDecimal
                                  ? user.cashWinningsDecimal + ' Cash'
                                  : user.tokenWinnings
                                  ? user.tokenWinnings + ' Token'
                                  : 0}
                              </Col>
                            </Row>
                          </Card>
                        );
                      })}
                    </Col>
                  </Row>
                </Card>
              ))}
              {this.state.battleStart > 0 && (
                <Button onClick={() => this.fetchPreviousBattles()}>
                  Previous
                </Button>
              )}
              {this.state.battleFetchNext && (
                <Button onClick={() => this.fetchMoreBattles()} type="primary">
                  Next
                </Button>
              )}
            </div>
          )}
        </Spin>
        <Modal
          title={'Transaction Details'}
          closable={true}
          maskClosable={true}
          width={1200}
          onOk={() => this.closeTransactionModal()}
          onCancel={() => this.closeTransactionModal()}
          visible={this.state.showTransactionModal}
          footer={[
            <Button onClick={() => this.closeTransactionModal()}>Close</Button>
          ]}
        >
          <Tabs
            defaultActiveKey={this.state.currentTab}
            activeKey={this.state.currentTab}
            onChange={this.onTabChangeHandler}
          >
            <TabPane tab="Transaction Details" key="1">
              <Card
                bordered={false}
                extra={
                  this.state.isAdmin && (
                    <Popconfirm
                      disabled={
                        Object.keys(transactionIdsForRefund).length === 0 ||
                        isRefundDisable
                      }
                      title="Sure to refund the selected transactions?"
                      onConfirm={() => this.processRefunds()}
                    >
                      <Button
                        disabled={
                          Object.keys(transactionIdsForRefund).length === 0 ||
                          isRefundDisable
                        }
                        type="primary"
                        size="small"
                      >
                        Process Refunds
                      </Button>
                    </Popconfirm>
                  )
                }
              >
                {this.state.transactionDetailsFetched && (
                  <Table
                    rowKey="transactionId"
                    bordered
                    pagination={false}
                    dataSource={this.state.transactionDetails}
                    columns={transactionColumns}
                  />
                )}
              </Card>
            </TabPane>

            <TabPane tab="Refund Details" key="2">
              {refundDetails.length > 0 && (
                <Table
                  rowKey="transactionId"
                  bordered
                  pagination={false}
                  dataSource={refundDetails}
                  columns={transactionColumns}
                />
              )}
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          title={'Battle  Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeGameDataModal()}
          onCancel={() => this.closeGameDataModal()}
          visible={this.state.showGameDataModal}
          footer={[
            <Button
              key="footer-button"
              onClick={() => this.closeGameDataModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card title="Battle End Reason">
            {this.state.gameDataList &&
              this.state.gameDataList.length > 0 &&
              this.state.gameDataList.map(data => (
                <Row>
                  <Col sm={6}>
                    <strong>{data.userId}</strong>
                  </Col>
                  <Col sm={6}>
                    {data.battleData && data.battleData.GameEndReason
                      ? data.battleData.GameEndReason
                      : 'NA'}
                  </Col>
                </Row>
              ))}
          </Card>
          {this.state.cardDataAvailable &&
            this.state.cardData &&
            this.state.cardData.length > 0 &&
            this.state.cardData.map((element, index) => (
              <Card
                key={index}
                type="inner"
                style={{ marginTop: 10, border: '1px solid rgb(221,221,221)' }}
              >
                <Row>
                  <Col span={24}>
                    <strong> TOTAL SCORES: </strong>
                  </Col>
                  {element &&
                    element.length > 0 &&
                    element.map(row => (
                      <Col span={12}>
                        <strong>{row.userId}: </strong>
                        {row.totalScore ? row.totalScore : 0}
                      </Col>
                    ))}
                  <Col span={24}>
                    <Table
                      rowKey="userId"
                      bordered
                      pagination={false}
                      dataSource={element}
                      columns={cardTableColumns}
                    />
                  </Col>
                </Row>
              </Card>
            ))}
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames,
    getUserActiveTournamentDataResponse:
      state.crm.getUserActiveTournamentDataResponse,
    getUserTournamentHistoryResponse:
      state.crm.getUserTournamentHistoryResponse,
    getPlayerLobbyHistoryResponse: state.crm.getPlayerLobbyHistoryResponse,
    getUserLeaderboardResponse: state.crm.getUserLeaderboardResponse,
    getUserTransactionDetailsResponse:
      state.crm.getUserTransactionDetailsResponse,
    getReferenceIdResponse: state.crm.getReferenceIdResponse,
    processBulkTransactionRefundResponse:
      state.crm.processBulkTransactionRefundResponse,
    currentUser: state.auth.currentUser,
    getBattleGameDataResponse: state.crm.getBattleGameDataResponse,
    refundCount: state.accounts.refundCount,
    currentUser: state.auth.currentUser,
    refundResponse: state.accounts.refundResponse,
    refundConfig: state.accounts.refundConfig
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...crmActions, ...gameActions, ...accountActions },
      dispatch
    )
  };
}

const CallbreakSelectionForm = Form.create()(CallbreakSelection);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallbreakSelectionForm);
