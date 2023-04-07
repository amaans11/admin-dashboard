import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { result } from 'lodash';
import moment from 'moment';
import {
  Card,
  message,
  Button,
  Spin,
  Row,
  Col,
  Select,
  Table,
  Modal,
  Popconfirm,
  Tag,
  Checkbox,
  Tabs
} from 'antd';
import { get } from 'lodash';
import * as crmActions from '../../actions/crmActions';
import * as gameActions from '../../actions/gameActions';
import * as fraudActions from '../../actions/fraudActions';
import * as accountActions from '../../actions/accountsActions';

const { Option } = Select;
const { TabPane } = Tabs;

const userBattleStateList = ['WAITING', 'FINISHED', 'CANCELLED'];
const winningStateList = ['WINNER', 'LOSER', 'TIED', 'PENDING', 'REFUNDED'];

class SearchBattle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameDataList: [],
      showGameDataModal: false,
      isModalDetails: false,
      modalData: {},
      fraudModal: false,
      disconnectionModal: false,
      transactionModal: false,
      currentTab: '1',
      transactionDetails: [],
      refundDetails: [],
      transactionUserId: '',
      gameName: '',
      gameId: '',
      transactionIdsForRefund: [],
      isRefundDisable: false,
      type: 'GAME_DATA',
      isWinner: false
    };
  }
  componentDidMount = () => {
    this.props.actions.getRefundConfig().then(() => {
      this.setState({
        isRefundDisable: this.props.refundConfig
      });
    });
  };
  closeModal = () => {
    const { type } = this.state;
    if (type === 'GAME_DATA') {
      this.setState({
        gameDataList: [],
        showGameDataModal: false,
        isModalDetails: false,
        modalData: {}
      });
    } else if (type === 'FRAUD') {
      this.setState({
        fraudModal: false,
        isModalDetails: false,
        modalData: {}
      });
    } else if (type === 'DISCONNECTION') {
      this.setState({
        disconnectionModal: false,
        isModalDetails: false,
        modalData: {}
      });
    } else {
      this.setState({
        transactionModal: false,
        isModalDetails: false,
        transactionDetails: [],
        transactionIdsForRefund: {}
      });
    }
  };
  getUserWinningStatus = (record, userId) => {
    let isWinner = false;
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
    return isWinner;
  };
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
    const { transactionDetails, transactionUserId } = this.state;
    let result = [];
    let data = {
      userId: transactionUserId
    };
    if (transactionDetails && transactionDetails.length > 0) {
      transactionDetails.map(transaction => {
        if (transaction.transactionType === 'DEBIT') {
          data = {
            ...data,
            referenceId: `TRID_${transaction.transactionId}`,
            countryCode: get(this.props, 'countryCode', 'IN')
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

  checkFraud = record => {
    const { selectedRecord } = this.state;
    this.setState({ loading: true });
    const data = {
      callerUserId: record.userId,
      gameId: selectedRecord.gameId,
      gameSessionId: selectedRecord.battleId
    };
    this.props.actions.checkGameFraud(data).then(() => {
      if (this.props.gameFraud.fraudServiceError) {
        message.error(this.props.gameFraud.fraudServiceError.message);
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
        this.setState({
          modalData: { ...fraudResponse },
          isModalDetails: true
        });
      }
    });
  };
  processRefunds = async () => {
    const { transactionIdsForRefund, isWinner } = this.state;
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
        .processTransactionRefund(transactionIdsForRefund)
        .then(() => {
          if (this.props.refundResponse && this.props.refundResponse.error) {
            message.error(this.props.refundResponse.error.message, 5);
            this.closeModal();
          } else {
            this.closeModal();
            message.success('Refund Successful!', 5);
          }
        });
    }
  };

  getDisconnectionData(record) {
    const { selectedRecord } = this.state;
    let data = {
      userId: record.userId,
      gameId: selectedRecord.gameId,
      battleId: selectedRecord.battleId
    };
    this.props.actions.getDisconnectionData(data).then(() => {
      this.setState({
        modalData: { ...this.props.getDisconnectionDataResponse },
        isModalDetails: true
      });
    });
  }

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
          gameDataList: [...gameDataList],
          showGameDataModal: true,
          type: 'GAME_DATA'
        });
      } else {
        message.info('Battle game data could not be fetched');
      }
    });
  }
  getBattleState = value => {
    return userBattleStateList[value];
  };
  getWinningState(value) {
    return winningStateList[value];
  }
  showGameDataDetials(record) {
    this.setState({
      modalData: { ...record },
      isModalDetails: true
    });
  }
  getBattlePlayers = record => {
    const players = record.battlePlayers;
    let result = [];
    if (players && players.length > 0) {
      players.map(player => {
        result.push({
          userId: player.userId
        });
      });
    }
    return result;
  };
  onFraudHandler = record => {
    const players = this.getBattlePlayers(record);
    this.setState({
      fraudModal: true,
      selectedRecord: { ...record },
      type: 'FRAUD',
      battlePlayers: players
    });
  };
  getDisconnectionDataHandler = record => {
    const players = this.getBattlePlayers(record);

    this.setState({
      disconnectionModal: true,
      selectedRecord: { ...record },
      type: 'DISCONNECTION',
      battlePlayers: players
    });
  };
  transactionDetailHandler = record => {
    const players = this.getBattlePlayers(record);

    this.setState({
      transactionModal: true,
      selectedRecord: { ...record },
      type: 'TRANSACTION_DETAILS',
      battlePlayers: players
    });
  };

  getReferenceIdBattle(item) {
    const { selectedRecord } = this.state;
    let data = {
      userId: item.userId,
      tournamentId: selectedRecord.lobbyId,
      battleId: selectedRecord.battleId
    };
    this.props.actions.getReferenceId(data).then(() => {
      if (
        this.props.getReferenceIdResponse &&
        this.props.getReferenceIdResponse.referenceId
      ) {
        let transactionFetchData = {
          userId: item.userId,
          referenceId: this.props.getReferenceIdResponse.referenceId,
          countryCode: get(this.props, 'countryCode', 'IN')
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
              const isWinner = this.getUserWinningStatus(
                selectedRecord,
                item.userId
              );
              this.setState({
                transactionDetails: [...transactionDetails],
                isModalDetails: true,
                transactionUserId: item.userId,
                currentTab: '1',
                gameName: selectedRecord.gameName,
                gameId: selectedRecord.battleId,
                transactionIdsForRefund: {},
                isWinner: isWinner
              });
            }
          });
      } else {
        message.error('Could not fetch reference Id');
      }
    });
  }
  onCheckboxHandler = (record, value) => {
    const {
      transactionIdsForRefund,
      gameName,
      gameId,
      transactionUserId
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
        transactionIdsForRefund: {
          transactionIds: [...transactionIds],
          userId: transactionUserId,
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
          countryCode: get(this.props, 'countryCode', 'IN')
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
        transactionIdsForRefund: transactionRefunds
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
  renderFraudContent = () => {
    const { modalData } = this.state;
    return (
      <React.Fragment>
        <Row style={{ marginTop: 20 }}>
          <Col sm={12}>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Request Status
              </span>
              <span>
                {Object.keys(modalData).length > 0 &&
                modalData.requestStatus === 'Failure' ? (
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
                {Object.keys(modalData).length > 0 &&
                modalData.fraudConfirmed == 'No' ? (
                  <Tag color="#f50">No</Tag>
                ) : modalData.fraudConfirmed == 'May-Be' ? (
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
                {Object.keys(modalData).length > 0 &&
                modalData.isCallerVictim == true ? (
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
              <span>
                {Object.keys(modalData).length > 0 && modalData.fraudReason}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Action Taken:
              </span>
              <span>
                {Object.keys(modalData).length > 0 && modalData.actionTaken}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Refund Status :
              </span>
              <span>
                {Object.keys(modalData).length > 0 && modalData.refundStatus}
              </span>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  };
  getGameDataColumns = () => {
    const { type } = this.state;
    const gameDataColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => {
          if (type === 'GAME_DATA') {
            return (
              <span>
                <Button onClick={() => this.showGameDataDetials(record)}>
                  Show Details
                </Button>
              </span>
            );
          } else if (type === 'FRAUD') {
            return (
              <span>
                <Button onClick={() => this.checkFraud(record)}>
                  Show Details
                </Button>
              </span>
            );
          } else if (type === 'DISCONNECTION') {
            return (
              <span>
                <Button onClick={() => this.getDisconnectionData(record)}>
                  Show Details
                </Button>
              </span>
            );
          } else {
            return (
              <span>
                <Button onClick={() => this.getReferenceIdBattle(record)}>
                  Show Details
                </Button>
              </span>
            );
          }
        }
      }
    ];
    return gameDataColumns;
  };
  getDisconnectionModalContent = () => {
    const { modalData } = this.state;
    return (
      <Card>
        <Row>
          <Col span={12}>
            <strong> Is Connection Mode Switched: </strong>
            {modalData.isConnectionModeSwitched ? 'Yes' : 'No'}
          </Col>
          <Col span={12}>
            <strong> Extra Disconnection Reason: </strong>
            {modalData.ExtraDisconnectionReason
              ? modalData.ExtraDisconnectionReason
              : 'N/A'}
          </Col>
          <Col span={12}>
            <strong> Last Five Ping Durations: </strong>
            {modalData.lastFivePingDurations
              ? modalData.lastFivePingDurations
              : 'N/A'}
          </Col>
          <Col span={12}>
            <strong> Is Connected To Internet: </strong>
            {modalData.isConnectedToInternet ? 'Yes' : 'No'}
          </Col>
          <Col span={12}>
            <strong> Is Connected To Smart Fox: </strong>
            {modalData.isConnectedToSmartFox ? 'Yes' : 'No'}
          </Col>
          <Col span={12}>
            <strong> Game End Reason: </strong>
            {modalData.gameEndReason ? modalData.gameEndReason : 'N/A'}
          </Col>
          <Col span={12}>
            <strong>Eligible For Disconnection Refund: </strong>
            {modalData.eligibleForDisconnectionRefund ? 'Yes' : 'No'}
          </Col>
          <Col span={12}>
            <strong> Disconnection: </strong>
            {modalData.Disconnection ? 'Yes' : 'No'}
          </Col>
          <Col span={12}>
            <strong> Error Message: </strong>
            {modalData.errorMessage ? modalData.errorMessage : 'N/A'}
          </Col>
          <Col span={24}>
            {this.state.showExtraInfo ? (
              <React.Fragment>
                <strong> ExtraInfo: </strong>
                {modalData.extraInfo ? modalData.extraInfo : 'N/A'}
              </React.Fragment>
            ) : (
              <Button onClick={() => this.setState({ showExtraInfo: true })}>
                Show Extra Info
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    );
  };

  render() {
    const { item } = this.props;
    const gameDataColumns = this.getGameDataColumns();
    const fraudModalContent = this.renderFraudContent();
    const disconnectionModalContent = this.getDisconnectionModalContent();
    const transactionColumns = this.getTransactionColumns();
    const {
      isModalDetails,
      modalData,
      battlePlayers,
      currentTab,
      transactionDetails,
      refundDetails,
      transactionIdsForRefund,
      isRefundDisable
    } = this.state;

    return (
      <React.Fragment>
        <Card
          title={
            <React.Fragment>
              <Button onClick={() => this.getBattleGameData(item)}>
                Battle Game Data
              </Button>
              <Button
                onClick={() => this.getDisconnectionDataHandler(item)}
                style={{ marginLeft: '5px' }}
              >
                Disconnection Data
              </Button>
            </React.Fragment>
          }
          key={item.battleId}
          type="inner"
          style={{
            marginTop: 10,
            border: '1px solid rgb(221,221,221)',
            margin: 20
          }}
          extra={
            <React.Fragment>
              <Button
                type="danger"
                onClick={() => {
                  this.onFraudHandler(item);
                }}
              >
                Fraud Check
              </Button>
              <Button onClick={() => this.transactionDetailHandler(item)}>
                Transaction Details
              </Button>
              {/* <Popconfirm
								title="Are you sure to finish this battle?"
								disabled={
									this.getBattleState(item.userBattleState ? item.userBattleState : 0) !==
										userBattleStateList[0] || finishBattleConfig
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
								</Button> */}
              {/* </Popconfirm> */}
            </React.Fragment>
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
                        {Number(user.moneyEntryFee).toFixed(2)}
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
        <Modal
          title={'Game Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          visible={this.state.showGameDataModal}
          footer={[<Button onClick={this.closeModal}>Close</Button>]}
        >
          <Table
            rowKey="userId"
            bordered
            pagination={false}
            dataSource={this.state.gameDataList}
            columns={gameDataColumns}
          />
          {isModalDetails && <Card>{JSON.stringify(modalData)}</Card>}
        </Modal>
        <Modal
          title="Fraud Details"
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          visible={this.state.fraudModal}
          footer={[<Button onClick={this.closeModal}>Close</Button>]}
        >
          <Table
            rowKey="userId"
            bordered
            pagination={false}
            dataSource={battlePlayers}
            columns={gameDataColumns}
          />
          {isModalDetails && fraudModalContent}
        </Modal>
        <Modal
          title={'Disconnection Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          visible={this.state.disconnectionModal}
          footer={[
            <Button key="disconnection-close" onClick={this.closeModal}>
              Close
            </Button>
          ]}
        >
          <Table
            rowKey="userId"
            bordered
            pagination={false}
            dataSource={battlePlayers}
            columns={gameDataColumns}
          />
          {isModalDetails && disconnectionModalContent}
        </Modal>
        <Modal
          title="Transaction Details"
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          visible={this.state.transactionModal}
          footer={[<Button onClick={this.closeModal}>Close</Button>]}
        >
          <Table
            rowKey="userId"
            bordered
            pagination={false}
            dataSource={battlePlayers}
            columns={gameDataColumns}
          />
          {isModalDetails && (
            <Tabs
              defaultActiveKey={currentTab}
              activeKey={currentTab}
              onChange={this.onTabChangeHandler}
            >
              <TabPane tab="Transaction Details" key="1">
                <Card
                  bordered={false}
                  extra={
                    <Popconfirm
                      disabled={
                        Object.keys(transactionIdsForRefund).length === 0 ||
                        isRefundDisable
                      }
                      title="Sure to refund the selected transactions?"
                      onConfirm={this.processRefunds}
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
                  }
                >
                  <Table
                    rowKey="transactionId"
                    bordered
                    pagination={false}
                    dataSource={transactionDetails}
                    columns={transactionColumns}
                  />
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
          )}
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
    getBattleByIdResponse: state.crm.getBattleByIdResponse
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
export default connect(mapStateToProps, mapDispatchToProps)(SearchBattle);
