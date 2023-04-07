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
  Tag,
  Input,
  Checkbox,
  Tabs,
  Radio,
  DatePicker,
  Pagination
} from 'antd';
import TOKEN from '../../assets/ic_coins.png';
import CASH from '../../assets/money-icon.png';
import { get } from 'lodash';
import * as crmActions from '../../actions/crmActions';
import * as gameActions from '../../actions/gameActions';
import * as fraudActions from '../../actions/fraudActions';
import * as accountActions from '../../actions/accountsActions';

const { Option } = Select;
const userBattleStateList = ['WAITING', 'FINISHED', 'CANCELLED'];
const winningStateList = ['WINNER', 'LOSER', 'TIED', 'PENDING', 'REFUNDED'];

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const refundReasonOptions = [
  'Cancelled gameplay',
  'Server disconnection',
  'Game stuck',
  'Unable to submit score',
  'Game couldn’t connect',
  'White screen',
  'Collusion detected',
  'Fraud detected'
];

class GameSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      gameSelectedFlag: false,
      getRequestType: 'DEFAULT',
      selectedGameId: null,
      tournamentList: [],
      battleList: [],
      loading: false,
      showModal: false,
      leaderboardDetailsFetched: false,
      battleStart: 0,
      tournamentStart: 0,
      tournamentFetchNext: false,
      showTransactionModal: false,
      transactionDetailsFetched: false,
      transactionDetails: [],
      selectedTransactionRefundCount: 0,
      transactionIdsForRefund: {},
      isRefundAllowed: false,
      gameDataList: [],
      showGameDataModal: false,
      showGameDataDetials: false,
      showPubgModal: false,
      fraudDetails: {},
      fraudModal: false,
      selectedRecord: {},
      previousRefundDetails: [],
      fraudTransactionDetails: [],
      refundConfirmationModal: false,
      currentTab: '1',
      refundDetails: [],
      gameName: '',
      gameId: '',
      moneyType: '',
      isRefundDisable: false,
      finishBattleDetails: {},
      isFinishModal: false,
      disconnectionDetails: {},
      showDisconnectionModal: false,
      showExtraInfo: false,
      finishBattleConfig: false,
      fraudRefundType: 'full-refund',
      fullRefund: [],
      partialRefund: [],
      isFraudRefund: false,
      rummyData: {},
      showRummyModal: false,
      battleId: '',
      tournamentId: 0,
      isSubmitted: false,
      selectedGameForBattle: '',
      selectedTimeRange: [],
      isWinner: false,
      mlFraudDetails: {},
      showScoreJSON: false,
      userKoTournamentHistory: [],
      koStart: 0,
      invoiceErrorMsg: false,
      invoiceUrl: '',
      refundModal: false,
      ticketId: '',
      refundReason: '',
      start: 0,
      count: 20,
      totalCount: 1,
      pageNumber: 1,
      isKoScoreJson: false,
      koScoreJSON: {}
    };
  }

  componentDidMount() {
    this.getGamesList();
    this.props.actions.getRefundConfig().then(() => {
      this.setState({
        isRefundDisable: this.props.refundConfig,
        userId: this.props.userId
      });
    });
    const userRole = this.props.currentUser.user_role;
    const { countryCode } = this.props;
    if (
      userRole.includes('SUPER_ADMIN') ||
      userRole.includes('CRM_ADMIN') ||
      userRole.includes('CRM_WRITE') ||
      userRole.includes('L1') ||
      userRole.includes('L2') ||
      userRole.includes('US_L1') ||
      userRole.includes('US_L2')
    ) {
      if (
        (userRole.includes('US_L1') || userRole.includes('US_L2')) &&
        countryCode !== 'US'
      ) {
        this.setState({ isRefundAllowed: false });
      } else if (
        (userRole.includes('L1') || userRole.includes('L2')) &&
        countryCode === 'US'
      ) {
        this.setState({ isRefundAllowed: false });
      } else {
        this.setState({ isRefundAllowed: true });
      }
    } else {
      this.setState({ isRefundAllowed: false });
    }

    this.props.actions.finishBattleConfig().then(() => {
      const value = this.props.finishBattleConfigResponse
        ? this.props.finishBattleConfigResponse
        : false;
      this.setState({
        finishBattleConfig: value
      });
    });
  }

  getGamesList = () => {
    var gamesList = [];
    this.props.actions.fetchGames().then(() => {
      if (this.props.gamesList) {
        this.props.gamesList.map(game => {
          gamesList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
      }
    });
    this.setState({
      gamesList
    });
  };

  gameSelected(gameId) {
    this.setState(
      {
        selectedGameId: gameId,
        gameSelectedFlag: true,
        tournamentStart: 0
      },
      () => {
        switch (this.state.getRequestType) {
          case 'LIVE':
            this.getLiveTournaments();
            break;
          default:
            break;
        }
      }
    );
  }
  handleTimeChange = event => {
    this.setState({
      selectedTimeRange: event,
      battleStart: 0
    });
  };
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
          referenceId: record.referenceId,
          referenceType: record.referenceType,
          refundReferenceType:
            gameName === 'Pool Rummy' ||
            gameName === 'Pool Rummy Node' ||
            gameName === 'Point Rummy' ||
            gameName === 'Point Rummy Node' ||
            gameName === 'Rummy' ||
            gameName === 'Deals Rummy' ||
            gameName === 'Deals Rummy Node' ||
            gameName === 'Deals Rummy N2' ||
            gameName === 'Pool Rummy N2' ||
            gameName === 'Point Rummy N2'
              ? 'RUMMY_CS_REFUND'
              : this.state.getRequestType === 'BATTLE'
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

  getLiveTournaments = () => {
    this.setState({ loading: true });
    let data = {
      userId: this.state.userId,
      start: this.state.tournamentStart,
      count: 30,
      gameId: this.state.selectedGameId
    };
    this.props.actions.getUserActiveTournamentData(data).then(() => {
      if (this.props.getUserActiveTournamentDataResponse) {
        let tournamentList = [];
        if (
          this.props.getUserActiveTournamentDataResponse.history &&
          this.props.getUserActiveTournamentDataResponse.history.length > 0
        ) {
          tournamentList = [
            ...this.props.getUserActiveTournamentDataResponse.history
          ];
          let count = tournamentList.length;
          if (count > 29) {
            this.setState({ tournamentFetchNext: true });
          } else {
            this.setState({ tournamentFetchNext: false });
          }
        } else {
          message.info('No records found');
        }
        this.setState({
          tournamentList: [...tournamentList],
          loading: false,
          isSubmitted: true
        });
      } else {
        this.setState({
          tournamentList: [],
          loading: false,
          isSubmitted: true
        });
      }
    });
  };

  getTournamentHistory = () => {
    this.setState({ loading: true });
    let data = {
      userId: this.state.userId,
      start: this.state.tournamentStart,
      count: 30,
      gameId: this.state.selectedGameId,
      tournamentId: this.state.tournamentId
    };
    this.props.actions.getUserTournamentHistory(data).then(() => {
      if (this.props.getUserTournamentHistoryResponse) {
        let tournamentList = [];
        if (
          this.props.getUserTournamentHistoryResponse.history &&
          this.props.getUserTournamentHistoryResponse.history.length > 0
        ) {
          tournamentList = [
            ...this.props.getUserTournamentHistoryResponse.history
          ];
          let count = tournamentList.length;
          if (count > 29) {
            this.setState({ tournamentFetchNext: true });
          } else {
            this.setState({ tournamentFetchNext: false });
          }
        } else {
          message.info('No records found');
        }
        this.setState({
          tournamentList: [...tournamentList],
          loading: false,
          isSubmitted: true
        });
      } else {
        this.setState({
          tournamentList: [],
          loading: false,
          isSubmitted: true
        });
      }
    });
  };

  getBattleHistory = (isFilter = false, req = {}) => {
    this.setState({ getRequestType: 'BATTLE', loading: true });
    let data = {};
    if (isFilter) {
      data = { ...req };
    } else {
      data = {
        userId: this.state.userId,
        start: this.state.battleStart,
        count: 30,
        gameId: ''
      };
    }
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
          if (
            this.props.getPlayerLobbyHistoryResponse.pendingBattles &&
            this.props.getPlayerLobbyHistoryResponse.pendingBattles.length > 0
          ) {
            battleList = [
              ...this.props.getPlayerLobbyHistoryResponse.pendingBattles,
              ...battleList
            ];
          }

          let count = battleList.length;
          if (count > 29) {
            this.setState({ battleFetchNext: true });
          } else {
            this.setState({ battleFetchNext: false });
          }
        } else {
          message.info('No records found');
        }
        this.setState({
          battleList: [...battleList],
          loading: false,
          isSubmitted: true
        });
      } else {
        this.setState({ battleList: [], loading: false, isSubmitted: true });
      }
    });
  };

  selectLiveTournaments() {
    this.setState({ getRequestType: 'LIVE', tournamentStart: 0 });
    if (this.state.selectedGameId) {
      this.getLiveTournaments();
    }
  }

  selectTournamentHistory() {
    this.setState({
      getRequestType: 'HISTORY',
      tournamentStart: 0,
      isSubmitted: false
    });
    if (this.state.selectedGameId) {
      this.getTournamentHistory();
    }
  }
  handleRefundAmount = e => {
    this.setState({ refundAmount: e.target.value });
  };

  openLeaderboardInfo(record) {
    let data = {
      userId: this.state.userId,
      tournamentId: record.tournamentId
    };
    this.props.actions.getUserLeaderboard(data).then(() => {
      if (this.props.getUserLeaderboardResponse) {
        let leaderboardDetails = {
          rank:
            this.props.getUserLeaderboardResponse.userRank &&
            this.props.getUserLeaderboardResponse.userRank.rank
              ? this.props.getUserLeaderboardResponse.userRank.rank
              : 0,
          score:
            this.props.getUserLeaderboardResponse.userRank &&
            this.props.getUserLeaderboardResponse.userRank.score
              ? this.props.getUserLeaderboardResponse.userRank.score
              : 0
        };
        this.setState({
          leaderboardDetailsFetched: true,
          leaderboardDetails: { ...leaderboardDetails },
          showModal: true
        });
      }
    });
  }

  getReferenceId(record) {
    let data = {
      userId: this.state.userId,
      tournamentId: record.tournamentId
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
              const isWinner = this.getUserWinningStatus(record, 'tournament');

              this.setState(
                {
                  showTransactionModal: true,
                  transactionDetails: [...transactionDetails],
                  transactionDetailsFetched: true,
                  gameName: record.gameName,
                  gameId: record.tournamentId,
                  isWinner: isWinner
                },
                () => {
                  this.checkFraud(record, 'game', true);
                  this.getInvoiceDetails(
                    this.props.getReferenceIdResponse.referenceId
                  );
                }
              );
            }
          });
      } else {
        message.error('could not fetch reference id');
      }
    });
  }
  getUserWinningStatus = (record, type) => {
    let isWinner = false;
    const { userId } = this.state;
    if (type === 'battle') {
      let players = record.battlePlayers;
      if (players.length > 0) {
        players.map(player => {
          if (player.userId == userId) {
            if (player.rank == 1) {
              isWinner = true;
            } else {
              isWinner = false;
            }
          }
        });
      }
    } else {
      if (record.rank == 1) {
        isWinner = true;
      } else {
        isWinner = false;
      }
    }
    return isWinner;
  };

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
            if (
              this.props.getUserTransactionDetailsResponse &&
              this.props.getUserTransactionDetailsResponse.transactionHistory
            ) {
              let transactionDetails = [
                ...this.props.getUserTransactionDetailsResponse
                  .transactionHistory
              ];
              const isWinner = this.getUserWinningStatus(item, 'battle');

              this.setState(
                {
                  showTransactionModal: true,
                  transactionDetails: [...transactionDetails],
                  transactionDetailsFetched: true,
                  gameName: item.gameName,
                  gameId: item.battleId,
                  isWinner: isWinner
                },
                () => {
                  this.checkFraud(item, 'battle', true);
                  this.getInvoiceDetails(
                    this.props.getReferenceIdResponse.referenceId
                  );
                }
              );
            }
          });
      } else {
        message.error('Could not fetch reference Id');
      }
    });
  }

  closeModal() {
    this.setState({ showModal: false, leaderboardDetailsFetched: false });
  }
  onChangeTournamentId = e => {
    this.setState({
      tournamentId: e.target.value
    });
  };
  onGameChange = value => {
    this.setState({
      selectedGameForBattle: value,
      battleStart: 0
    });
  };

  closeTransactionModal() {
    this.setState({
      showTransactionModal: false,
      transactionDetailsFetched: false,
      transactionIdsForRefund: {},
      currentTab: '1',
      refundDetails: [],
      ticketId: '',
      refundReason: '',
      refundModal: false,
      isInvoiceAvailable: false,
      invoiceUrl: ''
    });
  }

  getBattleState = value => {
    return userBattleStateList[value];
  };

  getWinningState = value => {
    return winningStateList[value];
  };

  fetchMoreBattles() {
    const { selectedGameForBattle, selectedTimeRange } = this.state;
    let battleStart = this.state.battleStart + 30;
    this.setState({ battleStart: battleStart }, () => {
      if (selectedGameForBattle || selectedTimeRange.length > 0) {
        this.onBattleSearchHandler(false);
      } else {
        this.getBattleHistory();
      }
    });
  }

  fetchPreviousBattles() {
    const { selectedGameForBattle, selectedTimeRange } = this.state;

    let battleStart = this.state.battleStart - 30;
    this.setState({ battleStart: battleStart }, () => {
      if (selectedGameForBattle || selectedTimeRange.length > 0) {
        this.onBattleSearchHandler(false);
      } else {
        this.getBattleHistory();
      }
    });
  }
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
        key: 'amount',
        render: (text, record) => <div>{Number(record.amount).toFixed(2)}</div>
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
        title: 'Date',
        key: 'date',
        render: (text, record) => (
          <span>{moment(record.date, 'x').format('DD/MM/YY hh:mm A')}</span>
        )
      }
    ];
    return transactionColumns;
  };

  fetchMoreTournaments() {
    let tournamentStart = this.state.tournamentStart + 30;
    let type = this.state.getRequestType;
    this.setState({ tournamentStart: tournamentStart }, () => {
      if (type === 'LIVE') {
        this.getLiveTournaments();
      } else {
        this.getTournamentHistory();
      }
    });
  }

  fetchPreviousTournaments() {
    let tournamentStart = this.state.tournamentStart - 30;
    let type = this.state.getRequestType;
    this.setState({ tournamentStart: tournamentStart }, () => {
      if (type === 'LIVE') {
        this.getLiveTournaments();
      } else {
        this.getTournamentHistory();
      }
    });
  }

  processRefunds = async () => {
    const {
      transactionIdsForRefund,
      isWinner,
      ticketId,
      refundReason
    } = this.state;
    const { disabledAgents, refundRole } = this.props;
    const email = get(this.props.currentUser, 'email', '');

    if (!ticketId) {
      message.error('Please input ticket Id!');
      return;
    }
    if (!refundReason) {
      message.error('Please select any one refund reason!');
      return;
    }

    if (isWinner) {
      message.error(
        'Refund not applicable as winnings have already been processed'
      );
      return;
    }
    if (
      transactionIdsForRefund &&
      Object.keys(transactionIdsForRefund).length > 0
    ) {
      this.props.actions
        .processTransactionRefund({
          ...transactionIdsForRefund,
          refundReason: refundReason,
          ticketId: ticketId
        })
        .then(() => {
          if (this.props.refundResponse && this.props.refundResponse.error) {
            message.error(this.props.refundResponse.error.message, 5);
            this.setState({
              showTransactionModal: false,
              transactionIdsForRefund: {},
              transactionDetailsFetched: false,
              currentTab: '1',
              refundDetails: [],
              refundModal: '',
              ticketId: '',
              refundReason: ''
            });
          } else {
            this.setState(
              {
                showTransactionModal: false,
                transactionIdsForRefund: {},
                transactionDetailsFetched: false,
                currentTab: '1',
                refundDetails: [],
                refundModal: false,
                ticketId: '',
                refundReason: ''
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
    let gameType = '';
    if (record.gameName.includes('Rummy')) {
      gameType = 'NODE_RUMMY';
    } else {
      gameType = '';
    }
    this.setState({ gameType });
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
          gameDataList: [...gameDataList],
          showGameDataModal: true
        });
      } else {
        message.info('Battle game data could not be fetched');
      }
    });
  }

  getDisconnectionData(record) {
    let data = {
      userId: this.props.userId,
      gameId: record.gameId,
      battleId: record.battleId
    };
    this.props.actions.getDisconnectionData(data).then(() => {
      this.setState({
        disconnectionDetails: { ...this.props.getDisconnectionDataResponse },
        showDisconnectionModal: true
      });
    });
  }
  onChangeBattleId = e => {
    this.setState({
      battleId: e.target.value
    });
  };
  onBattleSearchHandler = searchById => {
    const {
      battleId,
      selectedGameForBattle,
      selectedTimeRange,
      userId,
      battleStart
    } = this.state;

    let data = {};
    if (searchById) {
      if (!battleId) {
        message.error('Please enter a valid Battle Id');
        return;
      } else {
        data = {
          start: 0,
          count: 30,
          gameId: 0,
          battleId: battleId,
          startTimeStamp: 0,
          endTimeStamp: 0
        };
      }
    } else {
      this.setState({ battleId: '' });

      if (!selectedGameForBattle && selectedTimeRange.length === 0) {
        this.getBattleHistory(false);
        return;
      } else {
        if (selectedTimeRange.length === 0 && selectedGameForBattle) {
          data = {
            userId: userId,
            start: battleStart,
            count: 30,
            gameId: selectedGameForBattle === 'NA' ? '' : selectedGameForBattle,
            battleId: ''
          };
        } else if (selectedTimeRange.length > 0 && !selectedGameForBattle) {
          data = {
            userId: userId,
            start: battleStart,
            count: 30,
            gameId: '',
            battleId: '',
            startTimeStamp: selectedTimeRange[0]
              ? moment(selectedTimeRange[0]).format('x')
              : '',
            endTimeStamp: selectedTimeRange[1]
              ? moment(selectedTimeRange[1]).format('x')
              : ''
          };
        } else {
          data = {
            userId: userId,
            start: battleStart,
            count: 30,
            gameId: selectedGameForBattle === 'NA' ? '' : selectedGameForBattle,
            battleId: '',
            startTimeStamp: selectedTimeRange[0]
              ? moment(selectedTimeRange[0]).format('x')
              : '',
            endTimeStamp: selectedTimeRange[1]
              ? moment(selectedTimeRange[1]).format('x')
              : ''
          };
        }
      }
    }
    this.getBattleHistory(true, data);
  };

  closeDisconnectionDataModal() {
    this.setState({
      disconnectionDetails: {},
      showDisconnectionModal: false,
      showExtraInfo: false
    });
  }

  showGameDataDetials(record) {
    this.setState({
      gameDataDetials: { ...record },
      showGameDataDetials: true
    });
  }

  openRummyModal(record) {
    this.setState({ rummyData: { ...record }, showRummyModal: true });
  }

  closeRummyModal() {
    this.setState({ rummyData: {}, showRummyModal: false });
  }

  openStateModal(state) {
    let truncatedState = state.replace('[', '');
    truncatedState = truncatedState.replace(']', '');
    let stateArray = [];
    if (truncatedState !== '') {
      stateArray = truncatedState.split(',');
    } else {
      stateArray = [];
    }
    this.setState({
      stateDetails: [...stateArray],
      showStateModal: true
    });
  }

  closeStateModal() {
    this.setState({
      stateDetails: null,
      showStateModal: false
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

  closeGameDataModal() {
    this.setState({
      gameDataList: [],
      showGameDataModal: false,
      gameDataDetials: {},
      showGameDataDetials: false
    });
  }

  openPubgDetails(record) {
    let data = {
      userId: this.state.userId,
      tournamentId: record.tournamentId
    };
    this.props.actions.getUserPubgDetails(data).then(() => {
      if (this.props.getUserPubgDetailsResponse) {
        let extraInfo = this.props.getUserPubgDetailsResponse.extraInfo
          ? JSON.parse(this.props.getUserPubgDetailsResponse.extraInfo)
          : {};
        let pubgDetails = {
          userName: this.props.getUserPubgDetailsResponse.username
            ? this.props.getUserPubgDetailsResponse.username
            : 'N/A',
          gameUserId: this.props.getUserPubgDetailsResponse.gameUserId
            ? this.props.getUserPubgDetailsResponse.gameUserId
            : 'N/A',
          imageUrl: extraInfo.topResultImageURL
            ? extraInfo.topResultImageURL
            : ''
        };
        this.setState({ pubgDetails, showPubgModal: true });
      }
    });
  }

  closePubgModal() {
    this.setState({ pubgDetails: {}, showPubgModal: false });
  }
  validateFraudHandler = () => {
    const { fraudDetails, transactionDetails } = this.state;
    if (
      fraudDetails.fraudConfirmed === 'Yes' &&
      fraudDetails.isCallerVictim == true
    ) {
      if (transactionDetails && transactionDetails.length > 0) {
        const response = [];
        transactionDetails.map(transaction => {
          if (
            transaction.referenceType &&
            (transaction.referenceType === 'TOURNAMENT_WINNINGS_CS_REFUND' ||
              transaction.referenceType === 'BATTLE_WINNINGS_CS_REFUND' ||
              transaction.referenceType === 'BATTLE_ENTRY_FEE_CS_REFUND') &&
            transaction.transactionType === 'CREDIT'
          ) {
            response.push(transaction);
          }
        });
        if (response.length > 0) {
          this.setState({
            isFraudRefund: true,
            loading: false
          });
        } else {
          this.setState({
            isFraudRefund: false,
            loading: false
          });
        }
      } else {
        this.setState({
          isFraudRefund: false,
          loading: false
        });
      }
    } else {
      this.setState({
        isFraudRefund: false,
        loading: false
      });
    }
  };
  getFraudMlDetails = (record, type) => {
    const data = {
      userId: this.props.userId,
      countryId: this.props.countryCode,
      gameId: record.gameId,
      battleId: type == 'game' ? record.tournamentId : record.battleId
    };
    this.props.actions.getMlFraudInfo(data).then(() => {
      if (this.props.mlFraud && this.props.mlFraud.error) {
        return;
      } else {
        this.setState({
          mlFraudDetails: this.props.mlFraud
        });
      }
    });
  };
  checkFraud = (record, type, isFraud = false) => {
    const userId = get(this.props, 'userId', null);

    this.setState({ loading: true, selectedRecord: record });
    let data = {};
    if (type === 'game') {
      data = {
        callerUserId: userId,
        gameId: record.gameId,
        gameSessionId: record.tournamentId
      };
    } else {
      data = {
        callerUserId: userId,
        gameId: record.gameId,
        gameSessionId: record.battleId
      };
    }

    this.getFraudMlDetails(record, type);
    this.props.actions.checkGameFraud(data).then(() => {
      if (this.props.gameFraud.fraudServiceError && !isFraud) {
        this.setState({ loading: false });
        message.error(this.props.gameFraud.fraudServiceError.message);
      } else if (this.props.gameFraud.fraudServiceError && isFraud) {
        this.setState({
          isFraudRefund: false,
          loading: false
        });
      } else {
        const response = this.props.gameFraud;
        const fraudConfirmed = get(response, 'fraudConfirmed', false);
        let status = '';
        if (fraudConfirmed == 1) {
          status = 'No';
        } else if (fraudConfirmed == 2) {
          status = 'May-Be';
        } else {
          status = 'Yes';
        }
        const fraudResponse = {
          requestStatus:
            response.requestStatus && response.requestStatus === 1
              ? 'Failure'
              : 'Success',
          fraudConfirmed: status,
          isCallerVictim: response.isCallerVictim
            ? response.isCallerVictim
            : 'false',
          fraudReason: response.fraudReason,
          actionTaken: response.actionTaken,
          refundStatus: response.refundStatus
        };
        this.setState(
          {
            fraudDetails: { ...fraudResponse },
            gameId: record.battleId,
            gameName: record.gameName
          },
          () => {
            if (isFraud) {
              this.validateFraudHandler();
            } else {
              this.getPreviousRefundDetails(type);
            }
          }
        );
      }
    });
  };

  openPrizeBreakUp(record) {
    let data = {
      tournamentId: record.tournamentId,
      userId: this.state.userId
    };
    this.props.actions.getTournamentDetailsById(data).then(() => {
      if (this.props.getTournamentDetailsByIdResponse) {
        let rewards =
          this.props.getTournamentDetailsByIdResponse &&
          this.props.getTournamentDetailsByIdResponse.order &&
          this.props.getTournamentDetailsByIdResponse.order.rewards
            ? { ...this.props.getTournamentDetailsByIdResponse.order.rewards }
            : {};
        let rankRanges =
          rewards.rankRanges && rewards.rankRanges.length > 0
            ? [...rewards.rankRanges]
            : [];
        this.setState({
          rewards,
          rankRanges,
          showPrizeBreakupModal: true
        });
      }
    });
  }

  closePrizeBreakUp() {
    this.setState({
      rewards: {},
      rankRanges: [],
      showPrizeBreakupModal: false
    });
  }

  onRefundTypeHandler = e => {
    this.setState({
      fraudRefundType: e.target.value
    });
  };
  getRefundAmount = () => {
    const { fraudTransactionDetails } = this.state;
    let fullRefund = [];
    let partialRefund = [];
    let creditAmount = 0;
    let bonusAmount = 0;
    let debitAmount = 0;
    let debitMoneyType = [];

    if (fraudTransactionDetails && fraudTransactionDetails.length > 0) {
      fraudTransactionDetails.map(transaction => {
        if (transaction.transactionType) {
          const type = transaction.transactionType;
          if (type === 'CREDIT') {
            creditAmount += parseInt(transaction.amount);
          } else {
            fullRefund.push({
              amount: transaction.amount,
              moneyType: transaction.moneyType
            });
            debitAmount += parseInt(transaction.amount);
            bonusAmount =
              transaction.moneyType === 'Bonus' ? transaction.amount : 0;
            debitMoneyType.push({
              moneyType: transaction.moneyType,
              txnAmount: transaction.amount
            });
          }
        }
      });
    }
    if (debitAmount > creditAmount) {
      let diffAmount = debitAmount - creditAmount;

      if (debitMoneyType.length === 1) {
        partialRefund.push({
          amount: diffAmount.toString(),
          moneyType: debitMoneyType[0].moneyType
        });
      } else {
        let res = [];
        if (bonusAmount > diffAmount) {
          res.push({
            moneyType: 'Bonus',
            amount: diffAmount.toString()
          });
        } else {
          res = [
            {
              moneyType: 'Bonus',
              amount: bonusAmount
            }
          ];
          debitMoneyType.map(type => {
            if (type.moneyType !== 'Bonus') {
              res.push({
                moneyType: type.moneyType,
                amount: (diffAmount - bonusAmount).toString()
              });
            }
          });
        }
        partialRefund = [...res];
      }
    }
    return { fullRefund, partialRefund };
  };
  getPreviousRefundDetails = (type = null) => {
    const { selectedRecord } = this.state;
    const userId = get(this.props, 'userId', null);

    let tournamentData = {
      userId: userId,
      tournamentId: selectedRecord.tournamentId
    };
    let battleData = {
      userId: userId,
      tournamentId: selectedRecord.lobbyId,
      battleId: selectedRecord.battleId
    };
    const data = type && type === 'battle' ? battleData : tournamentData;
    this.props.actions.getReferenceId(data).then(() => {
      if (
        this.props.getReferenceIdResponse &&
        this.props.getReferenceIdResponse.referenceId
      ) {
        let transactionFetchData = {
          userId: userId,
          referenceId: this.props.getReferenceIdResponse.referenceId,
          countryCode: this.props.countryCode
        };
        this.props.actions
          .getUserTransactionDetails(transactionFetchData)
          .then(() => {
            if (
              this.props.getUserTransactionDetailsResponse &&
              this.props.getUserTransactionDetailsResponse.transactionHistory &&
              this.props.getUserTransactionDetailsResponse.transactionHistory
                .length > 0
            ) {
              let transactionDetails = [
                ...this.props.getUserTransactionDetailsResponse
                  .transactionHistory
              ];
              if (transactionDetails && transactionDetails.length > 0) {
                const response = [];
                transactionDetails.map(transaction => {
                  if (
                    transaction.referenceType &&
                    (transaction.referenceType ===
                      'TOURNAMENT_WINNINGS_CS_REFUND' ||
                      transaction.referenceType ===
                        'BATTLE_WINNINGS_CS_REFUND' ||
                      transaction.referenceType ===
                        'BATTLE_ENTRY_FEE_CS_REFUND') &&
                    transaction.transactionType === 'CREDIT'
                  ) {
                    response.push(transaction);
                  }
                });
                this.setState({
                  loading: false,
                  fraudModal: true,
                  previousRefundDetails: response,
                  fraudTransactionDetails: [...transactionDetails]
                });
              } else {
                this.setState({
                  loading: false,
                  fraudModal: true,
                  previousRefundDetails: []
                });
              }
            } else {
              this.setState({
                loading: false,
                fraudModal: true,
                previousRefundDetails: [],
                fraudTransactionDetails: []
              });
            }
          });
      }
    });
  };
  onRefundAgainstFraudHandler = () => {
    const {
      fraudTransactionDetails,
      refundAmount,
      moneyType,
      gameId,
      gameName,
      fullRefund,
      partialRefund,
      fraudRefundType
    } = this.state;

    const email = get(this.props.currentUser, 'email', '');
    const userId = get(this.props, 'userId', null);
    const { disabledAgents, refundRole } = this.props;

    const response =
      fraudRefundType === 'full-refund' ? fullRefund : partialRefund;
    let refundTransaction = {};
    if (fraudTransactionDetails && fraudTransactionDetails.length > 0) {
      fraudTransactionDetails.map(transaction => {
        if (transaction.transactionType === 'DEBIT') {
          refundTransaction = { ...transaction };
        }
      });
    }

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
    if (response.length == 0) {
      message.error('Cannot process the refund!');
    } else {
      const updateRequest = [];
      response.map(res => {
        updateRequest.push({
          userAmount: { [userId]: res.amount.toString() },
          moneyType: res.moneyType,
          transactionType: 'CREDIT',
          referenceId: refundTransaction.referenceId,
          referenceType:
            this.state.getRequestType === 'BATTLE'
              ? 'BATTLE_WINNINGS_CS_REFUND'
              : 'TOURNAMENT_WINNINGS_CS_REFUND',
          description: `Refund done for reference id ${refundTransaction.referenceId}`,
          actualWinnings: ''
        });
      });
      const data = {
        transactionIds: [],
        userId: userId,
        referenceId: refundTransaction.referenceId,
        referenceType: '',
        refundReferenceType: 'FRAUD_CS_REFUND',
        refundDescription: `Refund done for reference id ${refundTransaction.referenceId}`,
        updateBalanceRequest: [...updateRequest],
        refundType: 'fraud',
        emailId: email,
        gameName: gameName,
        gameId: gameId,
        refundSource: 'CRM Dashboard',
        countryCode: this.props.countryCode
      };
      this.props.actions.processTransactionRefund(data).then(() => {
        if (this.props.refundResponse && this.props.refundResponse.error) {
          let error = this.props.refundResponse.error
            ? this.props.refundResponse.error.message
            : 'Refund cannot be  processed ! Please try again';
          message.error(error);
        } else {
          this.setState({
            refundConfirmationModal: false,
            fraudModal: false
          });
          message.success('Refund Successful!');
        }
      });
    }
  };
  fraudRefund = () => {
    const { fullRefund, partialRefund } = this.getRefundAmount();
    this.setState({
      refundConfirmationModal: true,
      fullRefund: fullRefund,
      partialRefund: partialRefund
    });
  };

  finishBattleHandler = record => {
    const { userId } = this.state;
    const data = {
      userId: userId,
      battleId: record.battleId
    };
    this.props.actions.finishBattle(data).then(() => {
      const {
        userStatus,
        isSuccess,
        isFirstTime,
        battleStatus
      } = this.props.finishBattleResponse;

      if (isSuccess) {
        this.setState({
          isFinishModal: true,
          finishBattleDetails: {
            transactionAmount: this.props.finishBattleResponse.transactionAmount
              ? this.props.finishBattleResponse.transactionAmount
              : 0,
            userStatus: userStatus,
            isFirstTime: isFirstTime ? isFirstTime : false,
            battleStatus: battleStatus
          }
        });
      } else {
        message.error('Something went wrong!Try Again!');
      }
    });
  };
  cancelFinishBattle = () => {
    this.setState(
      {
        isFinishModal: false
      },
      () => {
        this.getBattleHistory();
      }
    );
  };

  renderFraudContent = () => {
    const {
      fraudDetails,
      previousRefundDetails,
      mlFraudDetails,
      showScoreJSON
    } = this.state;
    const transactionColumns = this.getTransactionColumns();
    return (
      <React.Fragment>
        <Row>
          <Col sm={12}>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Request Status
              </span>
              <span>
                {fraudDetails.requestStatus === 'Failure' ? (
                  <Tag color="#f50">Failure</Tag>
                ) : (
                  <Tag color="#87d068">Success</Tag>
                )}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Fraud Status:
              </span>
              <span>
                {fraudDetails.fraudConfirmed == 'No' ? (
                  <Tag color="#f50">No</Tag>
                ) : fraudDetails.fraudConfirmed == 'May-Be' ? (
                  <Tag color="#2db7f5">May-Be</Tag>
                ) : (
                  <Tag color="#87d068">Yes</Tag>
                )}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                isCallerVictim:
              </span>
              <span>
                {fraudDetails.isCallerVictim == true ? (
                  <Tag color="#87d068">True</Tag>
                ) : (
                  <Tag color="#f50">False</Tag>
                )}
              </span>
            </div>
          </Col>
          <Col sm={12}>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Reason For Fraud:
              </span>
              <span>{fraudDetails.fraudReason}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Action Taken:
              </span>
              <span>{fraudDetails.actionTaken}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Refund Status:
              </span>
              <span>
                {previousRefundDetails && previousRefundDetails.length > 0
                  ? `Refund Done`
                  : 'NA'}
              </span>
            </div>
          </Col>
        </Row>
        {mlFraudDetails && Object.keys(mlFraudDetails).length > 0 && (
          <Row>
            <h2 style={{ textAlign: 'center', paddingTop: 10 }}>
              ML Fraud Response
            </h2>
            <Col sm={12}>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Fraud Check Category
                </span>
                <span>
                  {mlFraudDetails.fraudCheckCategory
                    ? mlFraudDetails.fraudCheckCategory
                    : 'NA'}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Fraud Detected By Fs1 Category
                </span>
                <span>
                  {fraudDetails.fraudDetectedByFs1 == true ? (
                    <Tag color="#87d068">True</Tag>
                  ) : (
                    <Tag color="#f50">False</Tag>
                  )}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  ML Fraud Status:
                </span>
                <span>
                  <Tag color="#87d068">Yes</Tag>
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Is Caller Victim:
                </span>
                <span>
                  {mlFraudDetails.userId != this.props.userId ? (
                    <Tag color="#87d068">True</Tag>
                  ) : (
                    <Tag color="#f50">False</Tag>
                  )}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  User Id
                </span>
                <span>{mlFraudDetails.userId}</span>
              </div>
            </Col>
            <Col sm={12}>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Min Probability Fraud
                </span>
                <span>
                  {mlFraudDetails.minProbabilityFraud
                    ? mlFraudDetails.minProbabilityFraud
                    : 'NA'}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Z Score
                </span>
                <span>
                  {mlFraudDetails.mlResponse &&
                  JSON.stringify(mlFraudDetails.mlResponse).z_score
                    ? JSON.stringify(mlFraudDetails.mlResponse).z_score
                    : 0}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Final Score
                </span>
                <span>
                  {mlFraudDetails.mlResponse &&
                  JSON.stringify(mlFraudDetails.mlResponse).final_score
                    ? JSON.stringify(mlFraudDetails.mlResponse).final_score
                    : 0}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Score Json
                </span>
                <span>
                  {showScoreJSON ? (
                    mlFraudDetails.scoreJson ? (
                      JSON.stringify(mlFraudDetails.scoreJson)
                    ) : (
                      'NA'
                    )
                  ) : (
                    <Button
                      onClick={() => {
                        this.setState({ showScoreJSON: true });
                      }}
                    >
                      Show Score JSON
                    </Button>
                  )}
                </span>
              </div>
            </Col>
          </Row>
        )}
        {previousRefundDetails && previousRefundDetails.length > 0 && (
          <Table
            rowKey="transactionId"
            bordered
            pagination={false}
            dataSource={previousRefundDetails}
            columns={transactionColumns}
            size="small"
            style={{ marginTop: 20 }}
          />
        )}
      </React.Fragment>
    );
  };

  getUserKOTournamentHistoryList = () => {
    this.setState({
      getRequestType: 'KO_TOURNAMENT',
      loading: true,
      koFetched: false
    });
    let data = {
      userId: this.state.userId,
      start: this.state.start,
      count: this.state.count
    };

    this.props.actions.getUserKoTournamentHistoryList(data).then(() => {
      if (
        this.props.getUserKoTournamentHistoryListResponse &&
        this.props.getUserKoTournamentHistoryListResponse.history &&
        this.props.getUserKoTournamentHistoryListResponse.history.length > 0
      ) {
        let userKoTournamentHistory = [
          ...this.props.getUserKoTournamentHistoryListResponse.history
        ];
        this.setState({
          userKoTournamentHistory,
          totalCount: this.props.getUserKoTournamentHistoryListResponse
            .totalCount,
          loading: false,
          koFetched: true
        });
      } else {
        message.info('No record found');
        this.setState({
          userKoTournamentHistory: [],
          totalCount: 19,
          loading: false,
          koFetched: true
        });
      }
    });
  };

  onChangePage = page => {
    this.setState(
      {
        pageNumber: page,
        start: page * 20 - 20,
        count: 20
      },
      () => {
        this.getUserKOTournamentHistoryList(page * 20 - 20, 20);
      }
    );
  };

  handleUserKOTournamentHistoryList = () => {
    const { start, count } = this.state;

    this.getUserKOTournamentHistoryList(start, count);
  };

  openRoundProgressModal = record => {
    let data = {
      userId: this.state.userId,
      tournamentId: record.tournamentId
    };
    this.props.actions.getUserKoTournamentRoundHistory(data).then(() => {
      if (
        this.props.getUserKoTournamentRoundHistoryResponse &&
        this.props.getUserKoTournamentRoundHistoryResponse.roundHistory &&
        this.props.getUserKoTournamentRoundHistoryResponse.roundHistory.length >
          0
      ) {
        let userKoTournamentRoundHistory = [
          ...this.props.getUserKoTournamentRoundHistoryResponse.roundHistory
        ];
        this.setState({
          userKoTournamentRoundHistory,
          showRoundProgressModal: true
        });
      } else {
        message.info('No record found');
        this.setState({
          userKoTournamentRoundHistory: [],
          showRoundProgressModal: false
        });
      }
    });
  };
  getInvoiceDetails = refId => {
    const { transactionIdsForRefund } = this.state;
    const data = {
      userId: this.props.userId,
      referenceId: refId
    };
    this.props.actions.getUserInvoice(data).then(() => {
      if (this.props.userInvoice && this.props.userInvoice.error) {
        this.setState({
          invoiceUrl: '',
          invoiceErrorMsg: this.props.userInvoice.error.message
        });
      } else {
        this.setState({
          invoiceUrl: this.props.userInvoice.publicUrl,
          invoiceErrorMsg: ''
        });
      }
    });
  };

  closeRoundProgressModal = () => {
    this.setState({
      userKoTournamentRoundHistory: [],
      showRoundProgressModal: false
    });
  };

  showKoUser = user => {
    let koUserArray = [];
    koUserArray.push(user);
    this.setState({
      koUserArray: [...koUserArray],
      showKoUserModal: true
    });
  };

  showKoOpponents = opponents => {
    if (opponents && opponents.length > 0) {
      this.setState({
        koUserArray: [...opponents],
        showKoUserModal: true
      });
    } else {
      message.info('Opponents data not found');
    }
  };

  closeKoUserModal = () => {
    this.setState({
      showKoUserModal: false,
      koUserArray: [],
      isKoScoreJson: false,
      koScoreJSON: {}
    });
  };

  getUserCplHistory = () => {
    this.setState({
      getRequestType: 'CPL',
      loading: true,
      cplFetched: false
    });
    let data = {
      userId: this.state.userId
    };
    this.props.actions.getUserCplHistory(data).then(() => {
      if (this.props.getUserCplHistoryResponse) {
        let cplHistory = { ...this.props.getUserCplHistoryResponse };
        this.setState({
          cplHistory,
          cplFetched: true,
          loading: false
        });
      } else {
        message.info('No record found');
        this.setState({
          cplHistory: {},
          cplFetched: true,
          loading: false
        });
      }
    });
  };

  getCplTournamentHistory = gameId => {
    this.setState(
      {
        cplHistoryFetched: false,
        cplTournamentHistory: []
      },
      () => {
        let data = {
          userId: this.state.userId,
          gameId: gameId
        };
        this.props.actions.getUserCplTournamentHistory(data).then(() => {
          if (
            this.props.getUserCplTournamentHistoryResponse &&
            this.props.getUserCplTournamentHistoryResponse.history &&
            this.props.getUserCplTournamentHistoryResponse.history.length > 0
          ) {
            let cplTournamentHistory = [
              ...this.props.getUserCplTournamentHistoryResponse.history
            ];
            this.setState({
              cplTournamentHistory,
              cplHistoryFetched: true
            });
          } else {
            message.info('No record found');
            this.setState({
              cplTournamentHistory: [],
              cplHistoryFetched: true
            });
          }
        });
      }
    );
  };

  render() {
    const {
      fraudDetails,
      refundAmount,
      refundConfirmationModal,
      previousRefundDetails,
      transactionIdsForRefund,
      refundDetails,
      isRefundDisable,
      finishBattleDetails,
      finishBattleConfig,
      fraudRefundType,
      fullRefund,
      partialRefund,
      isFraudRefund,
      getRequestType,
      isSubmitted,
      mlFraudDetails,
      invoiceUrl,
      invoiceErrorMsg,
      isKoScoreJson,
      koScoreJson
    } = this.state;
    const fraudModalContent = this.renderFraudContent();
    const transactionColumns = this.getTransactionColumns();

    let refundValidation = false;
    if (
      fraudDetails.fraudConfirmed === 'Yes' &&
      fraudDetails.isCallerVictim == true &&
      previousRefundDetails.length == 0
    ) {
      refundValidation = true;
    }

    const columns = [
      {
        title: 'Tournament Id',
        dataIndex: 'tournamentId',
        key: 'tournamentId'
      },
      {
        title: 'Tournament Name',
        dataIndex: 'tournamentName',
        key: 'tournamentName'
      },
      {
        title: 'Entry Fee',
        key: 'moneyEntryFee',
        render: (text, record) => (
          <span>
            <span>
              {record.moneyEntryFee
                ? Number(record.moneyEntryFee).toFixed(2)
                : 0}
            </span>
            <span>
              <img
                style={{ width: 20, marginLeft: 5 }}
                src={record.currencyType === 'TOKEN' ? TOKEN : CASH}
                alt=""
              />
            </span>
          </span>
        )
      },
      {
        title: 'Start and End Time',
        key: 'time',
        render: (text, record) => (
          <span>
            <div>{moment(record.startTime).format('DD/MM/YY hh:mm A')}</div>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <div>{moment(record.endTime).format('DD/MM/YY hh:mm A')}</div>
          </span>
        )
      },
      {
        title: 'VIP Exclusive',
        key: 'prime',
        render: (text, record) => {
          const isPrime =
            record.extraInfo &&
            Object.keys(JSON.parse(record.extraInfo)).length > 0 &&
            JSON.parse(record.extraInfo).isExclusivePrime
              ? JSON.parse(record.extraInfo).isExclusivePrime
              : false;
          return isPrime ? (
            <Tag color="#87d068"> true </Tag>
          ) : (
            <Tag color="#f50">false</Tag>
          );
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Winnings Prize/ Cash & Token',
        key: 'winnings',
        render: (text, record) => (
          <span>
            <span>
              {record.moneyWinningPrize
                ? Number(record.moneyWinningPrize).toFixed(2)
                : 0}
            </span>
            <span>
              <img
                style={{ width: 20, marginLeft: 5 }}
                src={record.winningCurrencyType === 'TOKEN' ? TOKEN : CASH}
                alt=""
              />
            </span>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <span>
              {record.moneyWinningCash
                ? Number(record.moneyWinningCash).toFixed(2)
                : 0}
            </span>
            <span>
              <img style={{ width: 20, marginLeft: 5 }} src={CASH} alt="" />
            </span>
            <Divider style={{ margin: 2 }} type="vertical" />
            <span>{record.winningTokens ? record.winningTokens : 0}</span>
            <span>
              <img style={{ width: 20, marginLeft: 5 }} src={TOKEN} alt="" />
            </span>
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.openLeaderboardInfo(record)}
              type="primary"
              size="small"
            >
              Leaderboard Info
            </Button>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <Button onClick={() => this.getReferenceId(record)} size="small">
              Transaction Details
            </Button>
            {this.state.selectedGameId == 64 && (
              <span>
                <Divider style={{ margin: 2 }} type="horizontal" />
                <Button
                  style={{ backgroundColor: '#3e9c6b' }}
                  onClick={() => this.openPubgDetails(record)}
                  size="small"
                >
                  Get Pubg Details
                </Button>
              </span>
            )}
            <Divider style={{ margin: 2 }} type="horizontal" />
            <Button
              type="danger"
              size="small"
              disabled={record.style === 'LEADERBOARD' ? true : false}
              onClick={() => {
                this.checkFraud(record, 'game');
              }}
            >
              Fraud Check
            </Button>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <Button
              size="small"
              onClick={() => {
                this.openPrizeBreakUp(record);
              }}
            >
              Prize Breakup
            </Button>
          </span>
        )
      }
    ];

    const gameDataColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button
              onClick={() =>
                this.state.gameType !== 'NODE_RUMMY'
                  ? this.showGameDataDetials(record)
                  : this.openRummyModal(record)
              }
            >
              Show Details
            </Button>
          </span>
        )
      }
    ];

    const koColumns = [
      {
        title: 'Tournament Id',
        dataIndex: 'tournamentId',
        key: 'tournamentId'
      },
      {
        title: 'Tournament Name',
        dataIndex: 'tournamentName',
        key: 'tournamentName'
      },
      {
        title: 'Entry Fee',
        key: 'moneyEntryFee',
        render: (text, record) => (
          <span>
            <span>
              {record.moneyEntryFee
                ? Number(record.moneyEntryFee).toFixed(2)
                : 0}
            </span>
            <span>
              <img
                style={{ width: '15px', marginLeft: 5 }}
                src={record.currencyType === 'TOKEN' ? TOKEN : CASH}
                alt=""
              />
            </span>
          </span>
        )
      },
      {
        title: 'Start and End Time',
        key: 'time',
        render: (text, record) => (
          <span>
            <div>{moment(record.startTime).format('DD/MM/YY hh:mm A')}</div>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <div>{moment(record.endTime).format('DD/MM/YY hh:mm A')}</div>
          </span>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => {
                this.openRoundProgressModal(record);
              }}
            >
              Round Progress
            </Button>
          </span>
        )
      }
    ];

    const koRoundHistoryColumns = [
      {
        title: 'Round Id',
        dataIndex: 'roundId',
        key: 'roundId'
      },
      {
        title: 'Round Name',
        dataIndex: 'roundName',
        key: 'roundName'
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
      },
      {
        title: 'Start,End and Last Join Time',
        key: 'time',
        render: (text, record) => (
          <span>
            <div>{moment(record.startTime).format('DD/MM/YY hh:mm A')}</div>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <div>{moment(record.endTime).format('DD/MM/YY hh:mm A')}</div>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <div>{moment(record.lastJoinTime).format('DD/MM/YY hh:mm A')}</div>
          </span>
        )
      },
      {
        title: 'User',
        key: 'user',
        render: (text, record) => (
          <Button onClick={() => this.showKoUser(record.user)}>
            Show User Details
          </Button>
        )
      },
      {
        title: 'Opponents',
        key: 'opponents',
        render: (text, record) => (
          <Button onClick={() => this.showKoOpponents(record.opponents)}>
            Show Opponent Details
          </Button>
        )
      }
    ];

    const koUserColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score'
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason'
      },
      {
        title: 'Won',
        key: 'won',
        render: (text, record) => <span>{record.won ? 'TRUE' : 'FALSE'}</span>
      },
      {
        title: 'Reward',
        key: 'reward',
        render: (text, record) => <span>{JSON.stringify(record.reward)}</span>
      },
      {
        title: 'Score JSON',
        key: 'scoreJson',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => {
                this.setState({
                  isKoScoreJson: true,
                  koScoreJSON: record.gameData || {}
                });
              }}
            >
              Show Score Json
            </Button>
          </span>
        )
      }
    ];

    const cplTournamentColumns = [
      {
        title: 'Tournament Id',
        dataIndex: 'tournamentId',
        key: 'tournamentId'
      },
      {
        title: 'Tournament Name',
        dataIndex: 'tournamentName',
        key: 'tournamentName'
      },
      {
        title: 'Entry Fee',
        key: 'moneyEntryFee',
        render: (text, record) => (
          <span>
            <span>
              {record.moneyEntryFee
                ? Number(record.moneyEntryFee).toFixed(2)
                : 0}
            </span>
            <span>
              <img
                style={{ width: '15px', marginLeft: 5 }}
                src={record.currencyType === 'TOKEN' ? TOKEN : CASH}
                alt=""
              />
            </span>
          </span>
        )
      },
      {
        title: 'Start and End Time',
        key: 'time',
        render: (text, record) => (
          <span>
            <div>{moment(record.startTime).format('DD/MM/YY hh:mm A')}</div>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <div>{moment(record.endTime).format('DD/MM/YY hh:mm A')}</div>
          </span>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => {
                this.openRoundProgressModal(record);
              }}
            >
              Round Progress
            </Button>
          </span>
        )
      }
    ];

    const refundConfirmationModalContent = (
      <React.Fragment>
        <Radio.Group
          onChange={this.onRefundTypeHandler}
          value={fraudRefundType}
        >
          <Radio value="full-refund">Full Refund</Radio>
          {fraudRefundType === 'full-refund' ? (
            fullRefund.length > 0 ? (
              fullRefund.map(refund => (
                <div>{`${refund.moneyType}:${Math.round(
                  refund.amount,
                  0
                )}`}</div>
              ))
            ) : (
              <div>Refund Amount : 0</div>
            )
          ) : (
            ''
          )}
          <Radio value="partial-refund">
            Partial Refund(Differential Amount)
          </Radio>
          {fraudRefundType === 'partial-refund' ? (
            partialRefund.length > 0 ? (
              partialRefund.map(refund => (
                <div>{`${refund.moneyType}:${Math.round(
                  refund.amount,
                  0
                )}`}</div>
              ))
            ) : (
              <div>Refund Amount : 0</div>
            )
          ) : (
            ''
          )}
        </Radio.Group>
      </React.Fragment>
    );

    const turnDetailsColumns = [
      {
        title: 'Turn #',
        key: 'turnNo',
        dataIndex: 'turnNo'
      },
      {
        title: 'User Id',
        key: 'userId',
        dataIndex: 'userId'
      },
      {
        title: 'Start State',
        key: 'startState',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.openStateModal(record.startState)}
            >
              View
            </Button>
          </span>
        )
      },
      {
        title: 'Card Picked',
        key: 'cardPicked',
        dataIndex: 'cardPicked'
      },
      {
        title: 'Card Pick Source',
        key: 'cardPickSource',
        dataIndex: 'cardPickSource'
      },
      {
        title: 'Card Discarded',
        key: 'cardDiscarded',
        dataIndex: 'cardDiscarded'
      },
      {
        title: 'End State',
        key: 'endState',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.openStateModal(record.endState)}
            >
              View
            </Button>
          </span>
        )
      },
      {
        title: 'Status',
        key: 'turnStatus',
        dataIndex: 'turnStatus'
      },
      {
        title: 'Points',
        key: 'points',
        dataIndex: 'points'
      }
    ];

    const rankRangesColumns = [
      {
        title: 'Start',
        key: 'start',
        dataIndex: 'start'
      },
      {
        title: 'End',
        key: 'end',
        dataIndex: 'end'
      },
      {
        title: 'Cash',
        key: 'moneyCash',
        dataIndex: 'moneyCash'
      },
      {
        title: 'Tokens',
        key: 'tokens',
        dataIndex: 'tokens'
      },
      {
        title: 'Ext Reward',
        key: 'extReward',
        dataIndex: 'extReward'
      }
    ];

    return (
      <React.Fragment>
        <Card>
          <Button
            onClick={() => this.selectLiveTournaments()}
            type={this.state.getRequestType === 'LIVE' ? 'primary' : 'default'}
          >
            Live Tournaments
          </Button>
          <Button
            onClick={() => this.selectTournamentHistory()}
            type={
              this.state.getRequestType === 'HISTORY' ? 'primary' : 'default'
            }
          >
            Ended Tournaments
          </Button>
          <Button
            onClick={() => this.getBattleHistory()}
            type={
              this.state.getRequestType === 'BATTLE' ? 'primary' : 'default'
            }
          >
            Battle History
          </Button>
          <Button
            onClick={this.handleUserKOTournamentHistoryList}
            type={
              this.state.getRequestType === 'KO_TOURNAMENT'
                ? 'primary'
                : 'default'
            }
          >
            KO Tournament
          </Button>
          <Button
            onClick={() => this.getUserCplHistory()}
            type={this.state.getRequestType === 'CPL' ? 'primary' : 'default'}
          >
            CPL
          </Button>
        </Card>
        {getRequestType === 'BATTLE' && (
          <React.Fragment>
            <Row style={{ marginTop: 20 }}>
              <Col span={8}>
                <RangePicker
                  style={{ width: '80%' }}
                  allowClear={true}
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['Start Date', 'End Date']}
                  onChange={this.handleTimeChange}
                />
              </Col>
              <Col span={8} style={{ marginLeft: 10 }}>
                <Select
                  showSearch
                  onSelect={e => this.onGameChange(e)}
                  style={{ width: 300 }}
                  placeholder="Select a Game"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  value={this.state.selectedGameForBattle}
                >
                  <Option value="NA">NA</Option>
                  {this.state.gamesList}
                </Select>
              </Col>

              <Col span={2} style={{ marginLeft: 10 }}>
                <Button
                  type="primary"
                  onClick={() => this.onBattleSearchHandler(false)}
                >
                  Search
                </Button>
              </Col>
            </Row>
            <div
              style={{ textAlign: 'center', marginBottom: 12, marginTop: 12 }}
            >
              - OR -
            </div>
            <Row>
              <Col span={2}>
                <label>Battle Id</label>
              </Col>
              <Col span={6}>
                <Input
                  onChange={this.onChangeBattleId}
                  value={this.state.battleId}
                />
              </Col>
              <Col span={2} style={{ marginLeft: 10 }}>
                <Button
                  type="primary"
                  onClick={() => this.onBattleSearchHandler(true)}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        )}

        {this.state.getRequestType === 'HISTORY' && (
          <Card>
            <Row>
              <Col sm={8}>
                <Select
                  showSearch
                  onSelect={e => this.gameSelected(e)}
                  style={{ width: 300 }}
                  placeholder="Select a Game"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.gamesList}
                </Select>
              </Col>
              <Col sm={6}>
                <Input
                  placeholder="Tournament Id"
                  onChange={this.onChangeTournamentId}
                />
              </Col>
              <Col sm={6}>
                <Button
                  onClick={this.getTournamentHistory}
                  type="primary"
                  style={{ marginLeft: 20 }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Card>
        )}
        {this.state.getRequestType === 'LIVE' && (
          <Card>
            <Row>
              <Col sm={8}>
                <Select
                  showSearch
                  onSelect={e => this.gameSelected(e)}
                  style={{ width: 300 }}
                  placeholder="Select a Game"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.gamesList}
                </Select>
              </Col>
            </Row>
          </Card>
        )}

        {this.state.getRequestType === 'KO_TOURNAMENT' && this.state.koFetched && (
          <Spin spinning={this.state.loading}>
            <Table
              rowKey="transactionId"
              bordered
              pagination={false}
              dataSource={this.state.userKoTournamentHistory}
              columns={koColumns}
              size="small"
              style={{ marginTop: 20 }}
            />

            <Pagination
              current={this.state.pageNumber}
              defaultCurrent={this.state.pageNumber}
              onChange={page => this.onChangePage(page)}
              total={this.state.totalCount ? this.state.totalCount : 20}
              pageSize={20}
              style={{ marginTop: 20 }}
            />
          </Spin>
        )}
        {this.state.getRequestType === 'CPL' && this.state.cplFetched && (
          <Spin spinning={this.state.loading}>
            <Card>
              <Row>
                <Col span={8}>
                  <strong>League Id: </strong>
                  {this.state.cplHistory && this.state.cplHistory.leagueId}
                </Col>
                <Col span={8}>
                  <strong>League Game Id: </strong>
                  {this.state.cplHistory && this.state.cplHistory.leagueGameId}
                </Col>
                <Col span={8}>
                  <strong>League Name: </strong>
                  {this.state.cplHistory && this.state.cplHistory.leagueName}
                </Col>
                <Col span={8}>
                  <strong>League State: </strong>
                  {this.state.cplHistory && this.state.cplHistory.leagueState}
                </Col>
                <Col span={8}>
                  <strong>Registration Start Time: </strong>
                  {this.state.cplHistory &&
                  this.state.cplHistory.registrationStartTime
                    ? moment(
                        this.state.cplHistory.registrationStartTime
                      ).format('DD/MMM/YY hh:mm A')
                    : ''}
                </Col>
                <Col span={8}>
                  <strong>Registration End Time: </strong>
                  {this.state.cplHistory &&
                  this.state.cplHistory.registrationEndTime
                    ? moment(this.state.cplHistory.registrationEndTime).format(
                        'DD/MM/YY hh:mm A'
                      )
                    : ''}
                </Col>
                <Col span={8}>
                  <strong>College Id: </strong>
                  {this.state.cplHistory && this.state.cplHistory.collegeId}
                </Col>
                <Col span={8}>
                  <strong>College Name: </strong>
                  {this.state.cplHistory && this.state.cplHistory.collegeName}
                </Col>
                <Col span={8}>
                  <strong>College City: </strong>
                  {this.state.cplHistory && this.state.cplHistory.collegeCity}
                </Col>
                <Col span={8}>
                  <strong>Zone: </strong>
                  {this.state.cplHistory && this.state.cplHistory.zone}
                </Col>
                <Col span={8}>
                  <strong>Mobile Number: </strong>
                  {this.state.cplHistory && this.state.cplHistory.mobileNumber}
                </Col>
                <Col span={8}>
                  <strong>Email Id: </strong>
                  {this.state.cplHistory && this.state.cplHistory.emailId}
                </Col>
                <Col span={8}>
                  <strong>Authentication Type: </strong>
                  {this.state.cplHistory &&
                    this.state.cplHistory.authenticationType}
                </Col>
                <Col span={8}>
                  <strong>Verification Info: </strong>
                  {this.state.cplHistory &&
                    this.state.cplHistory.verificationInfo}
                </Col>
                {this.state.cplHistory &&
                  this.state.cplHistory.gameIds &&
                  this.state.cplHistory.gameIds.length > 0 && (
                    <Col span={24}>
                      <strong>Get CPL Tournament History for Game Ids: </strong>
                      {this.state.cplHistory.gameIds.map(gameId => (
                        <Button
                          key={'but-' + gameId}
                          size="small"
                          style={{ margin: '4px' }}
                          onClick={() => this.getCplTournamentHistory(gameId)}
                        >
                          {gameId}
                        </Button>
                      ))}
                    </Col>
                  )}
                {this.state.cplHistoryFetched && (
                  <Col span={24}>
                    <Table
                      rowKey="transactionId"
                      bordered
                      pagination={false}
                      dataSource={this.state.cplTournamentHistory}
                      columns={cplTournamentColumns}
                      size="small"
                      style={{ marginTop: 20 }}
                    />
                  </Col>
                )}
              </Row>
            </Card>
          </Spin>
        )}

        {isSubmitted && this.state.getRequestType !== 'BATTLE' && (
          <Spin spinning={this.state.loading}>
            <Card type="inner">
              <Table
                rowKey="tournamentId"
                bordered
                pagination={false}
                dataSource={this.state.tournamentList}
                columns={columns}
              />
              {this.state.tournamentStart > 0 &&
                this.state.tournamentId !== 0 && (
                  <Button onClick={() => this.fetchPreviousTournaments()}>
                    Previous
                  </Button>
                )}
              {this.state.tournamentFetchNext && this.state.tournamentId !== 0 && (
                <Button
                  onClick={() => this.fetchMoreTournaments()}
                  type="primary"
                >
                  Next
                </Button>
              )}
            </Card>
          </Spin>
        )}
        {this.state.getRequestType === 'BATTLE' &&
          this.state.battleList.length > 0 && (
            <Spin spinning={this.state.loading}>
              <div>
                {this.state.battleList.map(item => (
                  <Card
                    title={
                      <React.Fragment>
                        <Button onClick={() => this.getBattleGameData(item)}>
                          Battle Game Data
                        </Button>
                        <Button
                          onClick={() => this.getDisconnectionData(item)}
                          style={{ marginLeft: '5px' }}
                        >
                          Disconnection Data
                        </Button>
                      </React.Fragment>
                    }
                    key={item.battleId}
                    type="inner"
                    style={{ marginTop: '5px', border: '2px solid #677378' }}
                    extra={
                      <React.Fragment>
                        <Button
                          type="danger"
                          onClick={() => this.checkFraud(item, 'battle')}
                        >
                          Fraud Check
                        </Button>
                        <Button onClick={() => this.getReferenceIdBattle(item)}>
                          Transaction Details
                        </Button>
                        <Popconfirm
                          title="Are you sure to finish this battle?"
                          disabled={
                            this.getBattleState(
                              item.userBattleState ? item.userBattleState : 0
                            ) !== userBattleStateList[0] || finishBattleConfig
                          }
                          onConfirm={() => {
                            this.finishBattleHandler(item);
                          }}
                        >
                          <Button
                            disabled={
                              this.getBattleState(
                                item.userBattleState ? item.userBattleState : 0
                              ) !== userBattleStateList[0] || finishBattleConfig
                            }
                            type="primary"
                          >
                            Finish Battle
                          </Button>
                        </Popconfirm>
                      </React.Fragment>
                    }
                  >
                    <Row>
                      <Col span={12}>
                        <strong>Battle Id:</strong> {item.battleId}
                      </Col>
                      <Col span={12}>
                        <strong>Start Time:</strong>{' '}
                        {moment(item.battleStartTime).format(
                          'DD/MM/YY hh:mm A'
                        )}
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
                      <Col span={12}>
                        <strong>VIP Exclusive</strong>
                        {item.isExclusiveVIP ? (
                          <Tag color="#87d068"> true </Tag>
                        ) : (
                          <Tag color="#f50">false</Tag>
                        )}
                      </Col>
                      <Col span={24}>
                        {item.battlePlayers.map(user => {
                          let moneyEntryFee = user.moneyEntryFee;
                          let playerType = '';
                          if (user.extraInfo) {
                            try {
                              const extraInfo = JSON.parse(user.extraInfo);
                              console.log('extraInfo', extraInfo);
                              if (extraInfo.noOfRejoins > 0) {
                                moneyEntryFee = `${moneyEntryFee *
                                  (extraInfo.noOfRejoins + 1)} ( ${
                                  extraInfo.noOfRejoins
                                } Rejoins )`;
                              }
                              if (extraInfo.playerType) {
                                playerType = extraInfo.playerType;
                              }
                            } catch (e) {}
                          }
                          return (
                            <Card
                              key={item.battleId + user.userId}
                              type="inner"
                            >
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
                                  {user.score ? user.score : 0}
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
                                  {Number(moneyEntryFee).toFixed(2)}
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
                                    ? Number(user.cashWinningsDecimal).toFixed(
                                        2
                                      ) + ' Cash'
                                    : user.tokenWinnings
                                    ? user.tokenWinnings + ' Token'
                                    : 0}
                                </Col>
                                <Col span={6}>
                                  <strong>Player Type: </strong>
                                  {playerType ? playerType : 'NA'}
                                </Col>
                              </Row>
                            </Card>
                          );
                        })}
                      </Col>
                    </Row>
                  </Card>
                ))}
                {this.state.battleStart > 0 && !this.state.battleId && (
                  <Button onClick={() => this.fetchPreviousBattles()}>
                    Previous
                  </Button>
                )}
                {this.state.battleFetchNext && !this.state.battleId && (
                  <Button
                    onClick={() => this.fetchMoreBattles()}
                    type="primary"
                  >
                    Next
                  </Button>
                )}
              </div>
            </Spin>
          )}

        <Modal
          title={'Leaderboard Information'}
          closable={true}
          maskClosable={true}
          width={800}
          onOk={() => this.closeModal()}
          onCancel={() => this.closeModal()}
          visible={this.state.showModal}
          footer={[<Button onClick={() => this.closeModal()}>Close</Button>]}
        >
          <Card bordered={false}>
            {this.state.leaderboardDetailsFetched && (
              <Row>
                <Col span={24}>Rank: {this.state.leaderboardDetails.rank}</Col>
                <Col span={24}>
                  Score: {this.state.leaderboardDetails.score}
                </Col>
              </Row>
            )}
          </Card>
        </Modal>
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
                  this.state.isRefundAllowed && (
                    <React.Fragment>
                      <Button
                        disabled={
                          Object.keys(transactionIdsForRefund).length === 0 ||
                          isRefundDisable ||
                          isFraudRefund
                        }
                        type="primary"
                        size="small"
                        onClick={() => {
                          this.setState({ refundModal: true });
                        }}
                      >
                        Process Refunds
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          if (invoiceErrorMsg) {
                            message.error(invoiceErrorMsg);
                          }
                        }}
                      >
                        {invoiceUrl ? (
                          <a href={invoiceUrl}>Get Invoice</a>
                        ) : (
                          'Get Invoice'
                        )}
                      </Button>
                    </React.Fragment>
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
          title={'Game Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeGameDataModal()}
          onCancel={() => this.closeGameDataModal()}
          visible={this.state.showGameDataModal}
          footer={[
            <Button
              key={'GameDataClose'}
              onClick={() => this.closeGameDataModal()}
            >
              Close
            </Button>
          ]}
        >
          {this.state.showGameDataModal && (
            <Table
              rowKey="userId"
              bordered
              pagination={false}
              dataSource={this.state.gameDataList}
              columns={gameDataColumns}
            />
          )}
          {this.state.showGameDataDetials && (
            <Card>{JSON.stringify(this.state.gameDataDetials)}</Card>
          )}
        </Modal>
        <Modal
          title={'PUBG Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closePubgModal()}
          onCancel={() => this.closePubgModal()}
          visible={this.state.showPubgModal}
          footer={[
            <Button key="close_button" onClick={() => this.closePubgModal()}>
              Close
            </Button>
          ]}
        >
          {this.state.showPubgModal && (
            <Card type="inner" title="Pubg Details">
              <Row>
                <Col span={12}>
                  <strong>User Name: </strong>
                  {this.state.pubgDetails.userName}{' '}
                </Col>
                <Col span={12}>
                  <strong>Game User Id: </strong>
                  {this.state.pubgDetails.gameUserId}{' '}
                </Col>
                {this.state.pubgDetails &&
                  this.state.pubgDetails.imageUrl !== '' && (
                    <Col
                      span={24}
                      style={{ marginTop: '20px', width: '450px' }}
                    >
                      <img
                        alt="sample_pubg_image"
                        src={this.state.pubgDetails.imageUrl}
                      />
                    </Col>
                  )}
              </Row>
            </Card>
          )}
          {this.state.showGameDataDetials && (
            <Card>{JSON.stringify(this.state.gameDataDetials)}</Card>
          )}
        </Modal>
        <Modal
          title="Fraud Details"
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() =>
            this.setState({
              fraudModal: false,
              mlFraudDetails: {},
              showScoreJSON: false
            })
          }
          footer={[
            <React.Fragment>
              <Button
                type="primary"
                onClick={this.fraudRefund}
                disabled={!refundValidation || isRefundDisable}
              >
                Refund
              </Button>

              <Button
                onClick={() =>
                  this.setState({
                    fraudModal: false,
                    mlFraudDetails: {},
                    showScoreJSON: false
                  })
                }
              >
                Cancel
              </Button>
            </React.Fragment>
          ]}
          visible={this.state.fraudModal}
        >
          {fraudModalContent}
        </Modal>
        <Modal
          title="Confirm Refund"
          closable={true}
          maskClosable={true}
          width={400}
          onCancel={() => this.setState({ refundConfirmationModal: false })}
          onOk={this.onRefundAgainstFraudHandler}
          visible={refundConfirmationModal}
        >
          {refundConfirmationModalContent}
        </Modal>
        <Modal
          title="Finish Battle Response"
          closable={true}
          maskClosable={true}
          width={400}
          onCancel={this.cancelFinishBattle}
          onOk={this.cancelFinishBattle}
          visible={this.state.isFinishModal}
        >
          <div>Battle Status: {finishBattleDetails.battleStatus}</div>
          <div>User Status: {finishBattleDetails.userStatus}</div>
          <div>Refund Amount: {finishBattleDetails.transactionAmount}</div>
        </Modal>
        <Modal
          title={'Disconnection Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeDisconnectionDataModal()}
          onCancel={() => this.closeDisconnectionDataModal()}
          visible={this.state.showDisconnectionModal}
          footer={[
            <Button
              key="disconnection-close"
              onClick={() => this.closeDisconnectionDataModal()}
            >
              Close
            </Button>
          ]}
        >
          {this.state.showDisconnectionModal && (
            <Card>
              <Row>
                <Col span={12}>
                  {' '}
                  <strong> Is Connection Mode Switched: </strong>{' '}
                  {this.state.disconnectionDetails.isConnectionModeSwitched
                    ? 'Yes'
                    : 'No'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong> Extra Disconnection Reason: </strong>{' '}
                  {this.state.disconnectionDetails.ExtraDisconnectionReason
                    ? this.state.disconnectionDetails.ExtraDisconnectionReason
                    : 'N/A'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong> Last Five Ping Durations: </strong>{' '}
                  {this.state.disconnectionDetails.lastFivePingDurations
                    ? this.state.disconnectionDetails.lastFivePingDurations
                    : 'N/A'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong> Is Connected To Internet: </strong>{' '}
                  {this.state.disconnectionDetails.isConnectedToInternet
                    ? 'Yes'
                    : 'No'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong> Is Connected To Smart Fox: </strong>{' '}
                  {this.state.disconnectionDetails.isConnectedToSmartFox
                    ? 'Yes'
                    : 'No'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong> Game End Reason: </strong>{' '}
                  {this.state.disconnectionDetails.gameEndReason
                    ? this.state.disconnectionDetails.gameEndReason
                    : 'N/A'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong> Eligible For Disconnection Refund: </strong>{' '}
                  {this.state.disconnectionDetails
                    .eligibleForDisconnectionRefund
                    ? 'Yes'
                    : 'No'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong>Disconnection: </strong>{' '}
                  {this.state.disconnectionDetails.Disconnection
                    ? 'Yes'
                    : 'No'}
                </Col>
                <Col span={12}>
                  {' '}
                  <strong> Error Message: </strong>{' '}
                  {this.state.disconnectionDetails.errorMessage
                    ? this.state.disconnectionDetails.errorMessage
                    : 'N/A'}
                </Col>
                <Col span={24}>
                  {' '}
                  {this.state.showExtraInfo ? (
                    <>
                      <strong> ExtraInfo: </strong>{' '}
                      {this.state.disconnectionDetails.extraInfo
                        ? this.state.disconnectionDetails.extraInfo
                        : 'N/A'}
                    </>
                  ) : (
                    <Button
                      onClick={() => this.setState({ showExtraInfo: true })}
                    >
                      Show Extra Info
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
          )}
        </Modal>
        <Modal
          title={'Rummy Details'}
          closable={true}
          maskClosable={true}
          width={1100}
          onOk={() => this.closeRummyModal()}
          onCancel={() => this.closeRummyModal()}
          visible={this.state.showRummyModal}
          footer={[
            <Button key="rummy-close" onClick={() => this.closeRummyModal()}>
              Close
            </Button>
          ]}
        >
          {this.state.showRummyModal && (
            <Card>
              <Row>
                <Col span={12}>
                  Rummy Type: {this.state.rummyData.battleData.rummyType}
                </Col>
                <Col span={12}>
                  Game End Reason:{' '}
                  {this.state.rummyData.battleData.gameEndReason}
                </Col>
                <Col span={12}>
                  Starting Users Count:{' '}
                  {this.state.rummyData.battleData.startingUsersCount}
                </Col>
                <Col span={12}>
                  Unique Id: {this.state.rummyData.battleData.uniqueId}
                </Col>
                <Col span={12}>
                  Lobby Id: {this.state.rummyData.battleData.lobbyId}
                </Col>
                <Col span={12}>User Id: {this.state.rummyData.userId}</Col>
                <Col span={24}>
                  {this.state.rummyData.battleData &&
                    this.state.rummyData.battleData.gameDetails.length > 0 &&
                    this.state.rummyData.battleData.gameDetails.map(
                      (roundData, index) => (
                        <Card
                          key={roundData.roundId + index}
                          type="inner"
                          title={roundData.roundId}
                          extra={roundData.extra_info}
                        >
                          <Table
                            rowKey="turnNo"
                            bordered
                            pagination={false}
                            dataSource={roundData.turnsDetails}
                            columns={turnDetailsColumns}
                          />
                        </Card>
                      )
                    )}
                </Col>
              </Row>
            </Card>
          )}
        </Modal>
        <Modal
          title={'State Details'}
          closable={true}
          maskClosable={true}
          width={700}
          onCancel={() => this.closeStateModal()}
          onOk={() => this.closeStateModal()}
          visible={this.state.showStateModal}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            {this.state.stateDetails && this.state.stateDetails.length > 0 ? (
              this.state.stateDetails.map((item, index) => {
                item = item.trim().split('-');
                let image = '';
                switch (item[0]) {
                  case 'H':
                    image = 'Hearts_' + item[1];
                    break;
                  case 'C':
                    image = 'Clubs_' + item[1];
                    break;
                  case 'S':
                    image = 'Spades_' + item[1];
                    break;
                  case 'D':
                    image = 'Diamonds_' + item[1];
                    break;
                  case 'J':
                    image = 'Joker';
                    break;
                  default:
                    break;
                }
                return (
                  <span key={index} style={{ marginRight: '5px' }}>
                    <img
                      height="50"
                      src={require(`../../assets/rummy/${image}.png`)}
                      alt=""
                    />
                  </span>
                );
              })
            ) : (
              <div>No Cards details provided</div>
            )}
            {/* <img
              height="50"
              src={require(`../../assets/rummy/${a}.png`)}
              alt=""
            /> */}
          </Card>
        </Modal>
        <Modal
          title={'State Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closePrizeBreakUp()}
          onOk={() => this.closePrizeBreakUp()}
          visible={this.state.showPrizeBreakupModal}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="start"
              bordered
              pagination={false}
              dataSource={this.state.rankRanges}
              columns={rankRangesColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={'Round Progress Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          visible={this.state.showRoundProgressModal}
          onCancel={() => this.closeRoundProgressModal()}
          footer={[
            <Button
              key="round-progress-close"
              onClick={() => this.closeRoundProgressModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="roundId"
              bordered
              pagination={false}
              dataSource={this.state.userKoTournamentRoundHistory}
              columns={koRoundHistoryColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={'User/Opponenst Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          visible={this.state.showKoUserModal}
          onCancel={() => this.closeKoUserModal()}
          footer={[
            <Button key="ko-user-close" onClick={() => this.closeKoUserModal()}>
              Close
            </Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="userId"
              bordered
              pagination={false}
              dataSource={this.state.koUserArray}
              columns={koUserColumns}
            />{' '}
            {this.state.isKoScoreJson &&
              Object.keys(this.state.koScoreJSON).length > 0 &&
              this.state.koScoreJSON}
          </Card>
        </Modal>
        <Modal
          title="Refund"
          closable={true}
          maskClosable={true}
          width={800}
          visible={this.state.refundModal}
          onOk={this.processRefunds}
          onCancel={() => {
            this.setState({
              refundModal: false,
              ticketId: '',
              refundReason: ''
            });
          }}
        >
          <React.Fragment>
            <div style={{ marginBottom: 20 }}>
              {'Are you sure that you want to initiate the refund ?'}
            </div>
          </React.Fragment>
          <Row style={{ marginBottom: 15 }}>
            <Col sm={4}>Ticket Id</Col>
            <Col sm={8}>
              <Input
                type="number"
                placeholder="Ticket ID"
                value={this.state.ticketId}
                onChange={e => this.setState({ ticketId: e.target.value })}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={4}>Refund Reason</Col>
            <Col sm={8}>
              <Select
                onSelect={e => this.setState({ refundReason: e })}
                style={{ width: 300 }}
                placeholder="Select Refund Reason"
                value={this.state.refundReason}
              >
                {refundReasonOptions.map(option => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Modal>
        {/*  */}
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
    getUserPubgDetailsResponse: state.crm.getUserPubgDetailsResponse,
    gameFraud: state.fraud.gameFraud,
    fraudRefund: state.accounts.fraudRefund,
    processRummyRefundResponse: state.crm.processRummyRefundResponse,
    refundResponse: state.accounts.refundResponse,
    refundCount: state.accounts.refundCount,
    cancelUserBattleResponse: state.crm.cancelUserBattleResponse,
    finishBattleResponse: state.crm.finishBattleResponse,
    refundConfig: state.accounts.refundConfig,
    getDisconnectionDataResponse: state.crm.getDisconnectionDataResponse,
    finishBattleConfigResponse: state.crm.finishBattleConfigResponse,
    getBattleByIdResponse: state.crm.getBattleByIdResponse,
    getTournamentDetailsByIdResponse:
      state.crm.getTournamentDetailsByIdResponse,
    mlFraud: state.fraud.mlFraud,
    getUserKoTournamentHistoryListResponse:
      state.crm.getUserKoTournamentHistoryListResponse,
    getUserKoTournamentRoundHistoryResponse:
      state.crm.getUserKoTournamentRoundHistoryResponse,
    getUserCplHistoryResponse: state.crm.getUserCplHistoryResponse,
    getUserCplTournamentHistoryResponse:
      state.crm.getUserCplTournamentHistoryResponse,
    userInvoice: state.crm.userInvoice
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...crmActions, ...gameActions, ...fraudActions, ...accountActions },
      dispatch
    )
  };
}

const GameSelectionForm = Form.create()(GameSelection);
export default connect(mapStateToProps, mapDispatchToProps)(GameSelectionForm);
