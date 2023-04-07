// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import {
  Card,
  Form,
  message,
  Button,
  InputNumber,
  Radio,
  Table,
  Modal,
  Row,
  Col,
  DatePicker
} from 'antd';
import * as rummyCustomerActions from '../../actions/RummyCustomerActions';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class RummyCustomerSupport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCriteria: 'MOBILE_NUMBER',
      allRoundsFetched: false,
      turnDetailsFetched: false,
      showTableModal: false,
      showAllPlayersModal: false,
      allRoundsList: [],
      currentUserMobileNumber: null,
      allPlayers: [],
      closeStateModal: false
    };
    this.updateSearchCriteria = this.updateSearchCriteria.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openTableModal = this.openTableModal.bind(this);
    this.openAllPlayersModal = this.openAllPlayersModal.bind(this);
    this.getTurnDetails = this.getTurnDetails.bind(this);
    this.openStateModal = this.openStateModal.bind(this);
    this.getPointsLost = this.getPointsLost.bind(this);
    this.getMoneyLost = this.getMoneyLost.bind(this);
    this.getMoneyWon = this.getMoneyWon.bind(this);
  }
  componentDidMount() {
    this.props.form.validateFields();
    window.scrollTo(0, 0);
  }

  updateSearchCriteria(e) {
    this.props.form.setFieldsValue({
      searchFor: null
    });
    this.setState({
      searchCriteria: e.target.value,
      userDetailsFetched: false,
      turnDetailsFetched: false,
      allRoundsFetched: false
    });
  }

  openTableModal(tableDetails) {
    this.setState({
      tableDetails: { ...tableDetails },
      showTableModal: true
    });
  }

  openAllPlayersModal(allPlayers) {
    this.setState({
      allPlayers: [...allPlayers],
      showAllPlayersModal: true
    });
  }

  getTurnDetails(roundId, joker) {
    this.setState({ currentRoundId: roundId, joker: joker });
    let data = {
      roundId: roundId
    };
    this.props.actions.getTurnDetails(data).then(() => {
      if (this.props.getTurnDetailsResponse) {
        if (this.props.getTurnDetailsResponse.turns) {
          this.setState({
            turnDetailList: [...this.props.getTurnDetailsResponse.turns],
            turnDetailsFetched: true,
            currentRoundId: roundId
          });
        } else {
          message.error('Could not fetch turn details for the round');
        }
      } else {
        message.error('Could not fetch turn details for the round');
      }
    });
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

  getPointsLost(record) {
    let sum = 0;
    for (var i = 0; i < record.players.length; i++) {
      if (record.winner.id !== record.players[i].id) {
        sum = sum + record.players[i].points;
      }
    }
    return sum;
  }

  getMoneyLost(record) {
    let pointsLoss = 0;
    for (var i = 0; i < record.players.length; i++) {
      if (record.winner && record.winner.id !== record.players[i].id) {
        pointsLoss = pointsLoss + record.players[i].points;
      }
    }
    return parseInt(pointsLoss * record.tableDetails.pointValue);
  }

  getMoneyWon(record) {
    let pointsLoss = 0;
    for (var i = 0; i < record.players.length; i++) {
      if (record.winner.id !== record.players[i].id) {
        pointsLoss = pointsLoss + record.players[i].points;
      }
    }
    let moneyLost = pointsLoss * record.tableDetails.pointValue;
    return ((100 - record.tableDetails.rakeRate) * moneyLost) / 100;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ userDetailsFetched: false });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.searchCriteria === 'MOBILE_NUMBER') {
          this.setState({ currentUserMobileNumber: values.searchFor });
          let data = {
            mobileNumber: values.searchFor,
            startTime: moment(
              values.timeArray[0].set({ hour: 0, minute: 1 })
            ).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(
              values.timeArray[1].set({ hour: 23, minute: 59 })
            ).format('YYYY-MM-DD HH:mm:ss')
          };
          this.props.actions.getRummyRoundsByUser(data).then(() => {
            if (
              this.props.getRummyRoundsByUserResponse &&
              this.props.getRummyRoundsByUserResponse.rounds
            ) {
              this.setState({
                allRoundsList: [
                  ...this.props.getRummyRoundsByUserResponse.rounds
                ],
                allRoundsFetched: true
              });
            }
          });
        } else {
          let lobbyData = {
            lobbyId: values.searchFor
          };
          this.props.actions.getRummyRoundsByTable(lobbyData).then(() => {
            if (
              this.props.getRummyRoundsByTableResponse &&
              this.props.getRummyRoundsByTableResponse.rounds
            ) {
              this.setState({
                allRoundsList: [
                  ...this.props.getRummyRoundsByTableResponse.rounds
                ],
                allRoundsFetched: true
              });
            }
          });
        }
      }
    });
  };

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

    const errors = {
      searchFor: isFieldTouched('searchFor') && getFieldError('searchFor'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray')
    };

    const allRoundsColumns = [
      {
        title: 'ID',
        key: 'roundId',
        render: (text, record) => (
          <a onClick={() => this.getTurnDetails(record.roundId, record.joker)}>
            {record.roundId}
          </a>
        )
      },
      {
        title: 'Timestamp',
        key: 'id',
        render: (text, record) => (
          <span>
            {moment(record.modifiedOn)
              .format('DD-MM-YY HH:mm:ss')
              .toString()}
          </span>
        ),
        sorter: (a, b) => {
          var dateA = moment(a.modifiedOn);
          var dateB = moment(b.modifiedOn);
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
        title: 'Number of opponents',
        key: 'tableDetails',
        render: (text, record) => <span>{record.players.length - 1}</span>
      },
      {
        title: 'Table Details',
        key: 'numberOfOpponents',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.openTableModal(record.tableDetails)}
            >
              View
            </Button>
          </span>
        )
      },
      {
        title: 'List of players',
        key: 'players',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.openAllPlayersModal(record.players)}
            >
              View
            </Button>
          </span>
        )
      },
      {
        title: 'Result',
        key: 'winner',
        render: (text, record) => (
          <span>
            {record.winner &&
            record.winner.mobileNumber ===
              `+91${this.state.currentUserMobileNumber}`
              ? 'WON'
              : 'LOST'}
          </span>
        )
      },
      {
        title: 'Money Lost In Round',
        key: 'moneyLost',
        render: (text, record) => <span>{this.getMoneyLost(record)}</span>
      },
      {
        title: 'Point Value',
        key: 'pointsLost',
        render: (text, record) => <span>{record.tableDetails.pointValue}</span>
      }
    ];

    const turnDetailsColumns = [
      {
        title: 'User Id',
        key: 'userId',
        dataIndex: 'userId'
      },
      {
        title: 'Mobile',
        key: 'mobile',
        dataIndex: 'mobile'
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
        key: 'status',
        dataIndex: 'status'
      },
      {
        title: 'Points',
        key: 'points',
        dataIndex: 'points'
      }
    ];

    const allPlayersColumns = [
      {
        title: 'User Id',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: 'Points',
        key: 'points',
        dataIndex: 'points'
      },
      {
        title: 'Start Balance',
        key: 'id',
        render: (text, record) => (
          <span>
            Bonus:{' '}
            <strong>
              {record.startBalance.bonus ? record.startBalance.bonus : 0}
            </strong>{' '}
            {'  '}
            Deposit:{' '}
            <strong>
              {record.startBalance.deposit ? record.startBalance.deposit : 0}
            </strong>{' '}
            {'  '}
            Winning:{' '}
            <strong>
              {record.startBalance.deposit ? record.startBalance.winning : 0}
            </strong>{' '}
            {'  '}
          </span>
        )
      },
      {
        title: 'End Balance',
        key: 'id',
        render: (text, record) => (
          <span>
            Bonus:{' '}
            <strong>
              {record.endBalance.bonus ? record.endBalance.bonus : 0}
            </strong>{' '}
            {'  '}
            Deposit:{' '}
            <strong>
              {record.endBalance.deposit ? record.endBalance.deposit : 0}
            </strong>{' '}
            {'  '}
            Winning:{' '}
            <strong>
              {record.endBalance.deposit ? record.endBalance.winning : 0}
            </strong>{' '}
            {'  '}
          </span>
        )
      },
      {
        title: 'Mobile Number',
        key: 'mobileNumber',
        dataIndex: 'mobileNumber'
      }
    ];

    const closeAllPlayersModal = () => {
      this.setState({
        allPlayers: [],
        showAllPlayersModal: false
      });
    };

    const closeTableModal = () => {
      this.setState({
        tableDetails: {},
        showTableModal: false
      });
    };

    const closeStateModal = () => {
      this.setState({
        stateDetails: null,
        showStateModal: false
      });
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="User Details">
            <FormItem {...formItemLayout} label={'Search Criteria'}>
              {getFieldDecorator('searchCriteria', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: 'MOBILE_NUMBER'
              })(
                <Radio.Group
                  onChange={e => this.updateSearchCriteria(e)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={'MOBILE_NUMBER'}>
                    Mobile Number
                  </Radio.Button>
                  <Radio.Button value={'TABLE_ID'}>Table ID</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.searchFor ? 'error' : ''}
              {...formItemLayout}
              label={<span>Search For</span>}
            >
              {getFieldDecorator('searchFor', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                    whitespace: false,
                    type: 'number'
                  }
                ]
              })(<InputNumber min={0} style={{ width: 300 }} />)}
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
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Search
            </Button>
          </Card>
        </Form>
        {this.state.allRoundsFetched && (
          <Card style={{ margin: '20px' }} title="All Rounds Details">
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.allRoundsList}
              columns={allRoundsColumns}
            />
          </Card>
        )}
        {this.state.turnDetailsFetched && (
          <Card
            style={{ margin: '20px' }}
            title={<span>Round Id: {this.state.currentRoundId}</span>}
            extra={<span>{this.state.joker}</span>}
          >
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.turnDetailList}
              columns={turnDetailsColumns}
            />
          </Card>
        )}
        <Modal
          title={'All Players'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={closeAllPlayersModal}
          onOk={closeAllPlayersModal}
          visible={this.state.showAllPlayersModal}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.allPlayers}
              columns={allPlayersColumns}
              // rowSelection={rowSelection}
            />
          </Card>
        </Modal>
        <Modal
          title={'Table Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={closeTableModal}
          onOk={closeTableModal}
          visible={this.state.showTableModal}
        >
          {this.state.tableDetails && this.state.tableDetails.lobbyId && (
            <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
              <Row>
                <Col span={24}>
                  ID: <strong>{this.state.tableDetails.lobbyId}</strong>
                </Col>
                <Col span={24}>
                  Buy In: <strong>{this.state.tableDetails.buyIn}</strong>
                </Col>
                <Col span={24}>
                  Point Value:{' '}
                  <strong>{this.state.tableDetails.pointValue}</strong>
                </Col>
                <Col span={24}>
                  Max Bonus Percentage:{' '}
                  <strong>{this.state.tableDetails.maxBonusPercentage}</strong>
                </Col>
                <Col span={24}>
                  Rake Rate: <strong>{this.state.tableDetails.rakeRate}</strong>
                </Col>
                <Col span={24}>
                  Max Players:{' '}
                  <strong>
                    {this.state.tableDetails.maxPlayers
                      ? this.state.tableDetails.maxPlayers
                      : 0}
                  </strong>
                </Col>
              </Row>
            </Card>
          )}
        </Modal>
        <Modal
          title={'State Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={closeStateModal}
          onOk={closeStateModal}
          visible={this.state.showStateModal}
        >
          {this.state.turnDetailsFetched && (
            <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
              <div style={{ marginBottom: '10px' }}>
                Joker: <strong>{this.state.joker}</strong>
              </div>
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
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getRummyRoundsByUserResponse:
      state.rummyCustomer.getRummyRoundsByUserResponse,
    getRummyRoundsByTableResponse:
      state.rummyCustomer.getRummyRoundsByTableResponse,
    getTurnDetailsResponse: state.rummyCustomer.getTurnDetailsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...rummyCustomerActions }, dispatch)
  };
}

const RummyCustomerSupportForm = Form.create()(RummyCustomerSupport);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RummyCustomerSupportForm);
