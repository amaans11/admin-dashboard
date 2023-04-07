import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as liveKoActions from '../../actions/liveKoActions';
import {
  Card,
  Table,
  Form,
  InputNumber,
  Popconfirm,
  Button,
  Tag,
  message,
  Modal,
  Divider,
  Input,
  Row,
  Col
} from 'antd';
import ReplaceUserForm from './ReplaceUsersForm';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const FormItem = Form.Item;

class KoTournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rounds: [],
      showPlayersModal: false,
      players: [],
      selectedPlayers: [],
      battleDetailsFetched: false,
      battlePlayers: [],
      showGameDataModal: false,
      battleGameData: '',
      notificationText: '',
      fraudUserIds: null,
      showReleaseWinningModal: false,
      showDeclareBattleWinnerModal: false,
      showRemovePlayerModal: false,
      removePlayerRecord: {},
      disqualifyReason: '',
      tournamentId: null,
      showReplaceUsersModal: false,
      replaceUsers: [],
      roundId: null
    };
  }
  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { tournamentId } = values;
        this.setState({ tournamentId }, () => {
          this.getTournamentDetails();
        });
      }
    });
  };

  getTournamentDetails = () => {
    const { tournamentId } = this.state;
    const data = { tournamentId };
    this.props.actions.getKoPlayerListByTournament(data).then(() => {
      if (
        this.props.getKoPlayerListByTournamentResponse &&
        this.props.getKoPlayerListByTournamentResponse.rounds &&
        this.props.getKoPlayerListByTournamentResponse.rounds.length > 0
      ) {
        this.setState({
          rounds: [...this.props.getKoPlayerListByTournamentResponse.rounds],
          roundDetailsFetched: true
        });
      } else {
        message.info('No rounds details found for the mentioned tournament');
        this.setState({
          rounds: [],
          roundDetailsFetched: true
        });
      }
    });
  };

  showBattleDetails() {
    let data = {
      tournamentId: this.state.tournamentId
    };
    this.props.actions.getKoBattleDetails(data).then(() => {
      if (
        this.props.getKoBattleDetailsResponse &&
        this.props.getKoBattleDetailsResponse.roundMatches &&
        this.props.getKoBattleDetailsResponse.roundMatches.length > 0
      ) {
        this.setState({
          roundMatches: [...this.props.getKoBattleDetailsResponse.roundMatches],
          showBattleDetailModal: true
        });
      } else {
        message.info(
          'No roundMatches details found for the mentioned tournament'
        );
        this.setState({
          roundMatches: [],
          showBattleDetailModal: false
        });
      }
    });
  }

  closeBattleDetailModal() {
    this.setState({
      roundMatches: [],
      showBattleDetailModal: false
    });
  }

  showBattleData(battles) {
    this.setState({
      battles: battles && battles.length > 0 ? [...battles] : [],
      showBattleDataModal: true
    });
  }

  closeBattleDataModal() {
    this.setState({
      battles: [],
      showBattleDataModal: false
    });
  }

  changeMatchWinner(battleId) {
    let data = {
      battleId: battleId
    };
    this.props.actions.changeKoMatchWinner(data).then(() => {
      if (
        this.props.changeKoMatchWinnerResponse &&
        this.props.changeKoMatchWinnerResponse.isSuccess
      ) {
        message.success('Match winner change successful');
      } else {
        message.error('Could not process the request');
      }
    });
  }

  showPlayerBattleData(players) {
    this.setState({
      battlePlayers: players && players.length > 0 ? [...players] : [],
      showBattlePlayerDataModal: true
    });
  }

  closePlayerBattleData() {
    this.setState({
      battlePlayers: [],
      showBattlePlayerDataModal: false
    });
  }

  showGameData(gameData) {
    this.setState({
      battleGameData: gameData ? gameData : '',
      showGameDataModal: true
    });
  }

  closeGameDataModal() {
    this.setState({
      battleGameData: '',
      showGameDataModal: false
    });
  }

  pauseResumeTournament(record, type) {
    let data = {
      tournamentId: this.state.tournamentId,
      roundId: record.id,
      resume: type === 'RESUME' ? true : false
    };
    this.props.actions.pauseKoTournament(data).then(() => {
      if (
        this.props.pauseKoTournamentResponse &&
        this.props.pauseKoTournamentResponse.isSuccess
      ) {
        let messageText = 'Tournament ' + type + ' successful';
        message.success(messageText);
      } else {
        message.error('Could not process the request');
      }
    });
  }

  openPlayersModal(record) {
    if (record.players && record.players.length > 0) {
      this.setState({
        players: [...record.players],
        showPlayersModal: true
      });
    } else {
      message.info('No players details found for the round');
      this.setState({
        players: [],
        showPlayersModal: false
      });
    }
  }

  closePlayersModal() {
    this.setState({
      players: [],
      showPlayersModal: false
    });
  }

  removePlayer = () => {
    const { tournamentId, disqualifyReason, removePlayerRecord } = this.state;
    const data = {
      tournamentId,
      userId: removePlayerRecord.id,
      disqualifyReason
    };

    this.props.actions.removeKoUserFromTournament(data).then(() => {
      if (
        this.props.removeKoUserFromTournamentResponse &&
        this.props.removeKoUserFromTournamentResponse.isSuccess
      ) {
        message.success('User removed successfully');
        this.closeRemovePlayerModal();
        this.getTournamentDetails();
      } else {
        message.error('Could not remove user');
      }
    });
  };

  rowSelection = {
    onChange: selectedRowKeys => this.selectPlayers(selectedRowKeys)
  };

  selectPlayers = selectedRowKeys => {
    this.setState({
      selectedPlayers: [...selectedRowKeys]
    });
  };

  openSendNotificationModal() {
    this.setState({
      notificationText: '',
      showSendNotificationModal: true
    });
  }

  closeSendNotificationModal() {
    this.setState({
      notificationText: '',
      showSendNotificationModal: false
    });
  }

  updateNotificationText(value) {
    this.setState({
      notificationText: value
    });
  }

  sendNotification() {
    let data = {
      userIds: [...this.state.selectedPlayers],
      message: this.state.notificationText
    };
    this.props.actions.sendKoUserNotification(data).then(() => {
      if (
        this.props.sendKoUserNotificationResponse &&
        this.props.sendKoUserNotificationResponse.isSuccess
      ) {
        message.success('Notification sent successfully');
        this.setState({
          notificationText: '',
          showSendNotificationModal: false
        });
      } else {
        message.error('Could not send the notifications');
      }
    });
  }

  openReleaseWinningModal() {
    this.setState({
      showReleaseWinningModal: true,
      fraudUserIds: null
    });
  }

  closeReleaseWinningModal() {
    this.setState({
      showReleaseWinningModal: false,
      fraudUserIds: null
    });
  }

  updateFraudUserIds(value) {
    this.setState({
      fraudUserIds: value
    });
  }

  releaseWinningApiCall() {
    let fraudUserIdArray = [];
    let finalFraudIdArray = [];
    let nanFlag = false;
    if (this.state.fraudUserIds) {
      fraudUserIdArray = this.state.fraudUserIds.split(',');
      fraudUserIdArray.forEach(userId => {
        if (isNaN(userId)) {
          nanFlag = true;
        } else {
          userId = userId.trim();
          finalFraudIdArray.push(Number(userId));
        }
      });
    }
    if (nanFlag) {
      message.error('UserIds should be number');
      return;
    }

    let data = {
      tournamentId: this.state.tournamentId,
      fraudUserIds: finalFraudIdArray
    };
    this.props.actions.releaseWinningForKoTournament(data).then(() => {
      if (
        this.props.releaseWinningForKoTournamentResponse &&
        this.props.releaseWinningForKoTournamentResponse.isSuccess
      ) {
        message.success('Winnings released for KO tournament');
        this.setState({
          fraudUserIds: null,
          showReleaseWinningModal: false
        });
      } else {
        message.error(
          this.props.releaseWinningForKoTournamentResponse &&
            this.props.releaseWinningForKoTournamentResponse.errorMessage
            ? this.props.releaseWinningForKoTournamentResponse.errorMessage
            : 'Could not release winnings for the KO tournament'
        );
      }
    });
  }

  openDeclareBattleWinnerModal(battleId) {
    this.setState({
      battleId: battleId,
      showDeclareBattleWinnerModal: true
    });
  }

  closeDeclareBattleWinnerModal() {
    this.setState({
      battleId: null,
      showDeclareBattleWinnerModal: false
    });
  }

  updateDeclareFormData(value, type) {
    switch (type) {
      case 'WINNER_USER_ID':
        this.setState({ winnerUserId: value });
        break;
      case 'LOSER_USER_ID':
        this.setState({ loserUserId: value });
        break;
      case 'WINNER_SCORE':
        this.setState({ winnerScore: value });
        break;
      case 'LOSER_SCORE':
        this.setState({ loserScore: value });
        break;
      default:
        break;
    }
  }

  declareBattleWinnerApiCall() {
    let data = {
      battleId: this.state.battleId,
      winnerUserId: this.state.winnerUserId,
      loserUserId: this.state.loserUserId,
      winnerScore: this.state.winnerScore,
      loserScore: this.state.loserScore
    };
    this.props.actions.declareLiveBattleWinner(data).then(() => {
      if (
        this.props.declareLiveBattleWinnerResponse &&
        this.props.declareLiveBattleWinnerResponse.isSuccess
      ) {
        message.success(
          'Declare Live Battle Winner Request successfully submitted'
        );
        this.setState({
          battleId: null,
          winnerUserId: null,
          loserUserId: null,
          winnerScore: null,
          loserScore: null,
          showDeclareBattleWinnerModal: false
        });
      } else {
        message.error('Could not declare live battle winner');
      }
    });
  }

  openRemovePlayerModal = record => {
    this.setState({ showRemovePlayerModal: true, removePlayerRecord: record });
  };

  closeRemovePlayerModal = () => {
    this.setState({ showRemovePlayerModal: false });
  };

  updatedisqualifyReason = e => {
    this.setState({ disqualifyReason: e.target.value });
  };

  openReplaceUsersModal = round => {
    let replaceUsers = round.players ? [...round.players] : [];
    this.setState({
      showReplaceUsersModal: true,
      replaceUsers,
      roundId: round.id
    });
  };

  closeReplaceUsersModal = () => {
    this.setState({ showReplaceUsersModal: false });
  };

  handleReplaceUserSubmit = roundUsers => {
    const { tournamentId, roundId } = this.state;
    const data = {
      tournamentId,
      roundId,
      roundUsers
    };
    this.props.actions.replaceUsersinKoRound(data).then(() => {
      if (
        this.props.replaceUsersinKoRoundResponse &&
        this.props.replaceUsersinKoRoundResponse.isSuccess
      ) {
        message.success('Player replacement success!');
        this.closeReplaceUsersModal();
      } else {
        const { errorMessage } = this.props.replaceUsersinKoRoundResponse;
        message.error('Error: ' + errorMessage);
      }
    });
  };

  render() {
    const roundColumns = [
      {
        title: 'Round Id',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: 'State',
        key: 'state',
        dataIndex: 'state'
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
        title: 'Players',
        key: 'players',
        render: (text, record) => (
          <span>
            <Button onClick={() => this.openPlayersModal(record)}>
              Show Players
            </Button>
          </span>
        )
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.pauseResumeTournament(record, 'PAUSE')}
              type="danger"
            >
              Pause
            </Button>
            <Divider type="vertical" />
            <Button
              onClick={() => this.pauseResumeTournament(record, 'RESUME')}
              type="primary"
            >
              Resume
            </Button>
            <Divider type="vertical" />
            <Button
              onClick={() => this.openReplaceUsersModal(record)}
              type="danger"
            >
              Replace Users
            </Button>
          </span>
        )
      }
    ];

    const playerColumns = [
      {
        title: 'Player Id',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: 'Mobile Number',
        key: 'mobileNumber',
        dataIndex: 'mobileNumber'
      },
      {
        title: 'Display Name',
        key: 'displayName',
        dataIndex: 'displayName'
      },
      {
        title: 'Tier',
        key: 'tier',
        dataIndex: 'tier'
      },
      {
        title: 'Country Code',
        key: 'countryCode',
        dataIndex: 'countryCode'
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Sure to remove the user from the tournament?"
              onConfirm={() => this.openRemovePlayerModal(record)}
            >
              <Button type="danger" size="small">
                Remove Player
              </Button>
            </Popconfirm>
          </span>
        )
      }
    ];

    const playerBattleColumns = [
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
        title: 'Seed',
        key: 'seed',
        render: (text, record) => <span>{record.seed ? record.seed : 0}</span>
      },
      {
        title: 'Reward',
        key: 'reward',
        render: (text, record) => <span>{JSON.stringify(record.reward)}</span>
      },
      {
        title: 'Game Data',
        key: 'gameData',
        render: (text, record) => (
          <Button onClick={() => this.showGameData(record.gameData)}>
            Game Data
          </Button>
        )
      }
    ];

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      tournamentId:
        isFieldTouched('tournamentId') && getFieldError('tournamentId')
    };

    const {
      roundDetailsFetched,
      rounds,
      showRemovePlayerModal,
      disqualifyReason,
      tournamentId,
      showReplaceUsersModal
    } = this.state;

    return (
      <div className="page-container">
        <Card>
          <Form onSubmit={this.handleSubmit} layout="inline">
            <FormItem
              validateStatus={errors.tournamentId ? 'error' : ''}
              help={errors.tournamentId || ''}
              // {...formItemLayout}
              label={'Enter Tournament Id'}
            >
              {getFieldDecorator('tournamentId', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input a valid tournament id!'
                  }
                ],
                initialValue: tournamentId
              })(
                <InputNumber
                  placeholder="Enter tournament id"
                  style={{ width: '400px' }}
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                disabled={hasErrors(getFieldsError())}
                htmlType="submit"
              >
                Search
              </Button>
            </FormItem>
          </Form>
        </Card>

        {roundDetailsFetched && rounds.length ? (
          <Card
            title={
              <Button
                type="primary"
                onClick={() => this.openReleaseWinningModal()}
              >
                Release Winnings
              </Button>
            }
            style={{ marginTop: '1rem' }}
            extra={
              <Button onClick={() => this.showBattleDetails()}>
                Battle Details
              </Button>
            }
          >
            <Table
              rowKey="id"
              bordered
              dataSource={this.state.rounds}
              columns={roundColumns}
              scroll={{ x: true }}
            />
          </Card>
        ) : (
          ''
        )}

        <Modal
          title={'Player Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closePlayersModal()}
          onOk={() => this.closePlayersModal()}
          visible={this.state.showPlayersModal}
          footer={[
            <Button
              key="close-players-modal"
              onClick={() => this.closePlayersModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card
            extra={
              <Button
                disabled={
                  !(
                    this.state.selectedPlayers &&
                    this.state.selectedPlayers.length > 0
                  )
                }
                onClick={() => this.openSendNotificationModal()}
              >
                Send Notification
              </Button>
            }
          >
            <Table
              rowKey="id"
              bordered
              dataSource={this.state.players}
              columns={playerColumns}
              scroll={{ x: '100%' }}
              rowSelection={this.rowSelection}
            />
          </Card>
        </Modal>

        <Modal
          title={'Round Match Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeBattleDetailModal()}
          onOk={() => this.closeBattleDetailModal()}
          visible={this.state.showBattleDetailModal}
          footer={[
            <Button
              key="close-battle-modal"
              onClick={() => this.closeBattleDetailModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card>
            {this.state.roundMatches &&
              this.state.roundMatches.length > 0 &&
              this.state.roundMatches.map(roundMatch => (
                <Card
                  key={'roundMatch' + roundMatch.id}
                  style={{ margin: '10px' }}
                >
                  <Col span={12}>
                    KO Round Id: <strong>{roundMatch.id}</strong>
                  </Col>
                  <Col span={12}>
                    Name: <strong>{roundMatch.name}</strong>
                  </Col>
                  <Col span={12}>
                    Start Time:{' '}
                    <strong>
                      {moment(roundMatch.startTime).format('DD/MM/YY hh:mm A')}
                    </strong>
                  </Col>
                  <Col span={12}>
                    End Time:{' '}
                    <strong>
                      {moment(roundMatch.endTime).format('DD/MM/YY hh:mm A')}
                    </strong>
                  </Col>
                  <Col span={12}>
                    State: <strong>{roundMatch.state}</strong>
                  </Col>
                  <Col span={12}>
                    <Button
                      onClick={() => this.showBattleData(roundMatch.battles)}
                    >
                      Show Battle Data
                    </Button>
                  </Col>
                </Card>
              ))}
          </Card>
        </Modal>

        <Modal
          title={'Battle Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeBattleDataModal()}
          onOk={() => this.closeBattleDataModal()}
          visible={this.state.showBattleDataModal}
          footer={[
            <Button
              key="close-battle-data-modal"
              onClick={() => this.closeBattleDataModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card>
            {this.state.battles &&
              this.state.battles.length > 0 &&
              this.state.battles.map(battle => (
                <Card
                  key={'BattleId' + battle.battleId}
                  style={{ margin: '10px' }}
                >
                  <Col span={24}>
                    Battle Id: <strong>{battle.battleId}</strong>
                  </Col>
                  <Col span={8}>
                    <Button
                      style={{ margin: '8px' }}
                      size="small"
                      onClick={() => this.showPlayerBattleData(battle.players)}
                    >
                      Player Battle Data
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Button
                      style={{ margin: '8px' }}
                      size="small"
                      type="danger"
                      onClick={() => this.changeMatchWinner(battle.battleId)}
                    >
                      Change Match Winner
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Button
                      style={{ margin: '8px' }}
                      size="small"
                      type="primary"
                      onClick={() =>
                        this.openDeclareBattleWinnerModal(battle.battleId)
                      }
                    >
                      Declare Live Battle Winner
                    </Button>
                  </Col>
                </Card>
              ))}
          </Card>
        </Modal>

        <Modal
          title={'Player Battle Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closePlayerBattleData()}
          onOk={() => this.closePlayerBattleData()}
          visible={this.state.showBattlePlayerDataModal}
          footer={[
            <Button
              key="close-player-battle-modal"
              onClick={() => this.closePlayerBattleData()}
            >
              Close
            </Button>
          ]}
        >
          <Card>
            <Table
              rowKey="userId"
              bordered
              dataSource={this.state.battlePlayers}
              columns={playerBattleColumns}
              scroll={{ x: '100%' }}
            />
          </Card>
        </Modal>
        <Modal
          title={'Game Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeGameDataModal()}
          onOk={() => this.closeGameDataModal()}
          visible={this.state.showGameDataModal}
          footer={[
            <Button
              key="close-game-data-modal"
              onClick={() => this.closeGameDataModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card>{JSON.stringify(this.state.battleGameData)}</Card>
        </Modal>
        <Modal
          title={'Send Notification'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeSendNotificationModal()}
          onOk={() => this.sendNotification()}
          okText={'Send Notification'}
          visible={this.state.showSendNotificationModal}
        >
          <Card>
            <Input
              value={this.state.notificationText}
              onChange={e => this.updateNotificationText(e.target.value)}
            />
          </Card>
        </Modal>
        <Modal
          title={'Release Winning'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeReleaseWinningModal()}
          onOk={() => this.releaseWinningApiCall()}
          okText={'Release Winning'}
          visible={this.state.showReleaseWinningModal}
        >
          <Card>
            <Input
              placeholder="Enter fraud userIds separated by commas"
              value={this.state.fraudUserIds}
              onChange={e => this.updateFraudUserIds(e.target.value)}
            />
            <Tag color="blue">Enter fraud userIds separated by commas</Tag>
          </Card>
        </Modal>
        <Modal
          title={
            'Declare Live Battle Winner of battle Id: ' + this.state.battleId
          }
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeDeclareBattleWinnerModal()}
          onOk={() => this.declareBattleWinnerApiCall()}
          okText={'Submit'}
          visible={this.state.showDeclareBattleWinnerModal}
        >
          <Card>
            <Row>
              <Col span={6}>Winner User ID:</Col>
              <Col span={14}>
                <InputNumber
                  style={{ width: '200px' }}
                  value={this.state.winnerUserId}
                  onChange={e =>
                    this.updateDeclareFormData(e, 'WINNER_USER_ID')
                  }
                />
              </Col>
              <Col span={6}>Loser User ID:</Col>
              <Col span={14}>
                <InputNumber
                  style={{ width: '200px' }}
                  value={this.state.loserUserId}
                  onChange={e => this.updateDeclareFormData(e, 'LOSER_USER_ID')}
                />
              </Col>
              <Col span={6}>Winner Score:</Col>
              <Col span={14}>
                <InputNumber
                  style={{ width: '200px' }}
                  value={this.state.winnerScore}
                  onChange={e => this.updateDeclareFormData(e, 'WINNER_SCORE')}
                />
              </Col>
              <Col span={6}>Loser Score:</Col>
              <Col span={14}>
                <InputNumber
                  style={{ width: '200px' }}
                  value={this.state.loserScore}
                  onChange={e => this.updateDeclareFormData(e, 'LOSER_SCORE')}
                />
              </Col>
            </Row>
          </Card>
        </Modal>

        <Modal
          title="Remove Player"
          closable={true}
          maskClosable={true}
          width={600}
          onCancel={() => this.closeRemovePlayerModal()}
          onOk={() => this.closeRemovePlayerModal()}
          okText="Confirm"
          visible={showRemovePlayerModal}
          footer={null}
        >
          <div style={{ marginBottom: '1rem' }}>
            <Input
              placeholder="Enter player remove reason"
              value={disqualifyReason}
              onChange={this.updatedisqualifyReason}
            />
            <Tag color="red">
              Describe why player is removed (min 10 character)
            </Tag>
          </div>
          <div>
            <Button
              type="danger"
              disabled={disqualifyReason.length < 10}
              onClick={this.removePlayer}
            >
              Confirm
            </Button>
          </div>
        </Modal>

        <Modal
          title="Replace Users"
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeReplaceUsersModal()}
          onOk={() => this.closeReplaceUsersModal()}
          okText="Confirm"
          visible={showReplaceUsersModal}
          footer={null}
          destroyOnClose={true}
        >
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <Tag color="red">Add player id and their seed value</Tag>
          </div>

          <ReplaceUserForm handleSubmit={this.handleReplaceUserSubmit} />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getKoPlayerListByTournamentResponse:
      state.liveKo.getKoPlayerListByTournamentResponse,
    sendKoUserNotificationResponse: state.liveKo.sendKoUserNotificationResponse,
    removeKoUserFromTournamentResponse:
      state.liveKo.removeKoUserFromTournamentResponse,
    pauseKoTournamentResponse: state.liveKo.pauseKoTournamentResponse,
    getKoBattleDetailsResponse: state.liveKo.getKoBattleDetailsResponse,
    changeKoMatchWinnerResponse: state.liveKo.changeKoMatchWinnerResponse,
    declareLiveBattleWinnerResponse:
      state.liveKo.declareLiveBattleWinnerResponse,
    releaseWinningForKoTournamentResponse:
      state.liveKo.releaseWinningForKoTournamentResponse,
    replaceUsersinKoRoundResponse: state.liveKo.replaceUsersinKoRoundResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(liveKoActions, dispatch)
  };
}
const KoTournamentForm = Form.create()(KoTournament);
export default connect(mapStateToProps, mapDispatchToProps)(KoTournamentForm);
