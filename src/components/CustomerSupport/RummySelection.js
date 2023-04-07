import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Card,
  Form,
  message,
  Spin,
  Button,
  DatePicker,
  Table,
  Modal,
  Row,
  Col,
  Tag,
  Popconfirm,
  Divider,
  Select
} from 'antd';
import { get } from 'lodash';
import * as crmActions from '../../actions/crmActions';
import * as fraudActions from '../../actions/fraudActions';
import * as supportPaymentActions from '../../actions/SupportPaymentActions';
import * as accountActions from '../../actions/accountsActions';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

const refundReasonOptions = [
  'Disconnected from the Game',
  'Game Froze',
  'Cards not visible',
  'Unable to pick/Discard the cards',
  'Collusion detected'
];
class RummySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      loading: false,
      transactionListFetched: false,
      transactionList: [],
      showDisconnectionModal: false,
      fraudDetailsFetched: false,
      loadingTransaction: false,
      refundEligible: false,
      isRefundDisable: false,
      refundModal: false,
      record: {},
      refundReason: ''
    };
    this.checkForRefundEligibility = this.checkForRefundEligibility.bind(this);
    // this.getUserTransactionDetails = this.getUserTransactionDetails.bind(this);
  }

  componentDidMount() {
    this.props.actions.getRefundConfig().then(() => {
      this.setState({
        isRefundDisable: this.props.refundConfig,
        userId: this.props.userId
      });
    });
  }

  getRummyDisconnectionDetails(text) {
    let data = {
      userId: this.state.userId,
      searchId: text
    };
    this.props.actions.getRummyDisconnectionDetails(data).then(() => {
      if (
        this.props.getRummyDisconnectionDetailsResponse &&
        this.props.getRummyDisconnectionDetailsResponse.disconnectionData &&
        this.props.getRummyDisconnectionDetailsResponse.disconnectionData
          .user_id
      ) {
        this.setState(
          {
            disconnectionData: {
              ...this.props.getRummyDisconnectionDetailsResponse
                .disconnectionData
            },
            showDisconnectionModal: true
          },
          () => {
            this.checkForRefundEligibility();
          }
        );
      } else {
        this.setState({
          disconnectionData: {},
          showDisconnectionModal: true
        });
      }
    });
  }

  closeDisconnectionModal() {
    this.setState({
      disconnectionData: {},
      showDisconnectionModal: false
    });
  }

  refundTransaction(record) {
    const { refundReason } = this.state;
    const { disabledAgents, refundRole } = this.props;
    const email = get(this.props.currentUser, 'email', '');
    let bonusRefundAmount = record.bonus ? Number(record.bonus) : 0;
    let depositRefundAmount = record.deposit ? Number(record.deposit) : 0;
    let winningRefundAmount = record.winning ? Number(record.winning) : 0;

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

    const data = {
      transactionIds: [],
      userId: this.state.userId,
      referenceId: this.state.userId + '_' + record.unique_id,
      referenceType: '',
      refundReferenceType: 'RUMMY_CS_REFUND',
      refundDescription: `Refund done for unique id ${record.unique_id}`,
      updateBalanceRequest: [],
      refundType: 'rummy',
      emailId: email,
      gameName: 'rummy',
      gameId: record.roundId,
      refundSource: 'CRM Dashboard',
      countryCode: this.props.countryCode,
      refundReason: refundReason
    };
    if (bonusRefundAmount > 0) {
      let userAmount = {};
      userAmount[this.state.userId] = bonusRefundAmount;
      data.updateBalanceRequest = [
        ...data.updateBalanceRequest,
        {
          userAmount: { ...userAmount },
          transactionType: 'CREDIT',
          moneyType: 'Bonus',
          referenceId: this.state.userId + '_' + record.unique_id,
          referenceType: 'RUMMY_CS_REFUND',
          description: `Refund done for unique id ${record.unique_id}`,
          actualWinnings: ''
        }
      ];
    }

    if (depositRefundAmount > 0) {
      let userAmount = {};
      userAmount[this.state.userId] = depositRefundAmount;
      data.updateBalanceRequest = [
        ...data.updateBalanceRequest,
        {
          userAmount: { ...userAmount },
          transactionType: 'CREDIT',
          moneyType: 'Deposit',
          referenceId: this.state.userId + '_' + record.unique_id,
          referenceType: 'RUMMY_CS_REFUND',
          description: `Refund done for unique id ${record.unique_id}`,
          actualWinnings: ''
        }
      ];
    }

    if (winningRefundAmount > 0) {
      let userAmount = {};
      userAmount[this.state.userId] = winningRefundAmount;
      data.updateBalanceRequest = [
        ...data.updateBalanceRequest,
        {
          userAmount: { ...userAmount },
          transactionType: 'CREDIT',
          moneyType: 'Winning',
          referenceId: this.state.userId + '_' + record.unique_id,
          referenceType: 'RUMMY_CS_REFUND',
          description: `Refund done for unique id ${record.unique_id}`,
          actualWinnings: ''
        }
      ];
    }

    this.props.actions.processTransactionRefund(data).then(() => {
      if (this.props.refundResponse && this.props.refundResponse.error) {
        let error = this.props.refundResponse.error
          ? this.props.refundResponse.error.message
          : 'Refund cannot be  processed ! Please try again';
        message.error(error);
      } else {
        this.setState(
          {
            refundReason: '',
            refundModal: false
          },
          () => {
            message.success('Refund Successful!');
          }
        );
      }
    });
  }

  checkForRefundEligibility() {
    let disconnectionData = { ...this.state.disconnectionData };
    let reason = disconnectionData.reason ? disconnectionData.reason : 'N/A';
    if (
      reason == 'BACKEND_POTENTIAL_ISSUE' ||
      reason == 'CLIENT_RECONNECTION_NOT_INITIATED' ||
      reason == 'CLIENT_RECONNECTION_FAILED_INTERNET_OK'
    ) {
      this.setState({ refundEligible: true });
      // return false;
    } else {
      this.setState({ refundEligible: false });
      // return true;
    }
  }

  checkFraud(record) {
    let data = {
      callerUserId: this.state.userId,
      gameId: 1000077,
      gameSessionId: record.round_id
    };
    this.props.actions.checkGameFraud(data).then(() => {
      if (this.props.gameFraud) {
        if (this.props.gameFraud.fraudServiceError) {
          message.error(
            this.props.gameFraud.fraudServiceError.message
              ? this.props.gameFraud.fraudServiceError.message
              : 'Could not fetch details'
          );
        } else {
          let response = this.props.gameFraud;
          let fraudConfirmed = _.get(response, 'fraudConfirmed', false);
          let status = '';
          if (fraudConfirmed == 1) {
            status = 'No';
          } else if (fraudConfirmed == 2) {
            status = 'May-Be';
          } else {
            status = 'Yes';
          }
          let fraudDetails = {
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
            fraudDetails,
            showFraudModal: true,
            fraudDetailsFetched: true
          });
        }
      }
    });
  }

  closeFraudModal() {
    this.setState({
      showFraudModal: false,
      fraudResponse: {},
      fraudDetailsFetched: false
    });
  }
  handleRefundModal = record => {
    this.setState({
      refundModal: true,
      record: record
    });
  };

  checkForRefund = () => {
    const { record, refundReason } = this.state;

    if (!refundReason) {
      message.error('Please select any one refund reason!');
      return;
    }
    let referenceIds = [];
    let referenceId = record.user_id + '_' + record.unique_id;
    referenceIds.push(referenceId);
    let data = {
      referenceIds: [...referenceIds]
    };
    this.props.actions.getNonRefundedReferenceIds(data).then(() => {
      if (
        this.props.nonRefundedRefIds &&
        this.props.nonRefundedRefIds.unavailableReferenceIds &&
        this.props.nonRefundedRefIds.unavailableReferenceIds.length > 0
      ) {
        this.refundTransaction(record);
      } else if (
        this.props.nonRefundedRefIds &&
        this.props.nonRefundedRefIds.availableReferenceIds &&
        this.props.nonRefundedRefIds.availableReferenceIds.length > 0
      ) {
        message.info('Refund is already processed for this unique id');
      } else {
        message.error(
          'Could not check if the refund is processed. Please try after sometime'
        );
      }
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          userId: this.state.userId,
          startTime: moment(values.timeArray[0]).format(
            'YYYY-MM-DD HH:mm:ss.SSS'
          ),
          endTime: moment(values.timeArray[1]).format('YYYY-MM-DD HH:mm:ss.SSS')
        };
        this.props.actions.getRummyDetails(data).then(() => {
          if (
            this.props.getRummyDetailsResponse &&
            this.props.getRummyDetailsResponse.rummyData &&
            this.props.getRummyDetailsResponse.rummyData.transactions &&
            this.props.getRummyDetailsResponse.rummyData.transactions.length > 0
          ) {
            this.setState({
              transactionList: [
                ...this.props.getRummyDetailsResponse.rummyData.transactions
              ],
              transactionListFetched: true
            });
          } else {
            this.setState({
              transactionList: [],
              transactionListFetched: true
            });
          }
        });
      }
    });
  }

  render() {
    const { isRefundDisable, record } = this.state;
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
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray')
    };

    const columns = [
      {
        title: 'Session Id',
        key: 'session_id',
        dataIndex: 'session_id',
        width: '15%',
        render: text => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {text}
          </span>
        )
      },
      {
        title: 'Round Id',
        key: 'round_id',
        dataIndex: 'round_id',
        width: '15%',
        render: text => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {text}
          </span>
        )
      },
      {
        title: 'Unique Id',
        key: 'unique_id',
        dataIndex: 'unique_id',
        width: '15%',
        render: text => (
          <a
            style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
            onClick={() => this.getRummyDisconnectionDetails(text)}
          >
            {text}
          </a>
        )
      },
      {
        title: 'Rake',
        key: 'rake',
        width: '7%',
        render: (text, record) => (
          <span>{record.rake ? Number(record.rake).toFixed(2) : 0}</span>
        )
      },
      {
        title: 'Game Type',
        key: 'game_type',
        dataIndex: 'game_type',
        width: '7%',
        sorter: (a, b) => {
          if (a.game_type < b.game_type) {
            return -1;
          }
          if (a.game_type > b.game_type) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
        width: '7%',
        sorter: (a, b) => {
          if (a.type < b.type) {
            return -1;
          }
          if (a.type > b.type) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Created On',
        key: 'created_on',
        width: '10%',
        render: (text, record) => (
          <span>{moment(record.created_on).format('YYYY-MM-DD HH:mm:ss')}</span>
        )
      },
      {
        title: 'Balance Details',
        key: 'balances',
        width: '10%',
        render: (text, record) => (
          <span>
            Bonus: <strong>{record.bonus ? record.bonus : 0}</strong> {'  '}
            Deposit: <strong>{record.deposit ? record.deposit : 0}</strong>{' '}
            {'  '}
            Winning: <strong>{record.winning ? record.winning : 0}</strong>{' '}
            {'  '}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '12%',
        render: (text, record) => (
          <div>
            <Button
              type="danger"
              size="small"
              onClick={() => {
                this.checkFraud(record);
              }}
            >
              Fraud Check
            </Button>
            <Divider type="horizontal" />
            {record.type === 'DEBIT' && (
              <Button
                size="small"
                type="primary"
                disabled={isRefundDisable}
                onClick={() => this.handleRefundModal(record)}
              >
                Refund
              </Button>
            )}
          </div>
        )
      }
    ];

    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Card>
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
                    style={{ width: '80%' }}
                    allowClear={true}
                    showTime={true}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['Start Date', 'End Date']}
                  />
                )}
              </FormItem>
              <Button type="primary" htmlType="submit">
                Get Rummy Details
              </Button>
            </Form>
          </Card>
          {this.state.transactionListFetched && (
            <Card
              style={{ marginTop: '20px' }}
              type="inner"
              title={
                <span>
                  <strong>USER ID: </strong>
                  {this.state.userId}
                </span>
              }
            >
              <Table
                rowKey="id"
                bordered
                pagination={false}
                dataSource={this.state.transactionList}
                columns={columns}
                scroll={{ x: '100%' }}
              />
            </Card>
          )}
        </Spin>
        <Modal
          title={'Disconnection Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeDisconnectionModal()}
          onCancel={() => this.closeDisconnectionModal()}
          visible={this.state.showDisconnectionModal}
          footer={[
            <Button
              key="close-button"
              onClick={() => this.closeDisconnectionModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            {this.state.disconnectionData &&
            this.state.disconnectionData.user_id ? (
              <Row>
                <Col span={24}></Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>User Id:</strong>
                  {this.state.userId}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Session Id:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.session_id
                    ? this.state.disconnectionData.session_id
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Round Id:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.round_id
                    ? this.state.disconnectionData.round_id
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Unique Id:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.unique_id
                    ? this.state.disconnectionData.unique_id
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Game Id:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.game_id
                    ? this.state.disconnectionData.game_id
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Point Value:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.point_value
                    ? this.state.disconnectionData.point_value
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Max Players:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.max_players
                    ? this.state.disconnectionData.max_players
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Min Players:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.min_players
                    ? this.state.disconnectionData.min_players
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Reason:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.reason
                    ? this.state.disconnectionData.reason
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Created On:</strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.created_on
                    ? moment(this.state.disconnectionData.created_on).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={24}>
                  <strong>Entry Fee: </strong>
                  {this.state.disconnectionData &&
                  this.state.disconnectionData.entry_fee
                    ? this.state.disconnectionData.entry_fee
                    : 'N/A'}
                </Col>
                <Col style={{ margin: '8px' }} span={8}>
                  {this.state.refundEligible ? (
                    <Tag color="green">
                      {this.state.loadingTransaction ? (
                        <Spin size="small" />
                      ) : (
                        <span>Refund Eligible</span>
                      )}
                    </Tag>
                  ) : (
                    <Tag color="red">
                      {this.state.loadingTransaction ? (
                        <Spin size="small" />
                      ) : (
                        <span>Refund Not Eligible</span>
                      )}
                    </Tag>
                  )}
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <Tag color="red">No Disconnection Data Found</Tag>
                </Col>
              </Row>
            )}
          </Card>
        </Modal>
        <Modal
          title="Fraud Details"
          closable={true}
          maskClosable={true}
          width={800}
          visible={this.state.showFraudModal}
          onCancel={() => this.closeFraudModal()}
          footer={[
            <Button onClick={() => this.closeFraudModal()}>Close</Button>
          ]}
        >
          {this.state.fraudDetailsFetched && (
            <Row>
              <Col sm={12}>
                <div>
                  <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                    Request Status
                  </span>
                  <span>
                    {this.state.fraudDetails.requestStatus === 'Failure' ? (
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
                    {this.state.fraudDetails.fraudConfirmed == 'No' ? (
                      <Tag color="#f50">No</Tag>
                    ) : this.state.fraudDetails.fraudConfirmed == 'May-Be' ? (
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
                    {this.state.fraudDetails.isCallerVictim == true ? (
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
                  <span>{this.state.fraudDetails.fraudReason}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                    Action Taken:
                  </span>
                  <span>{this.state.fraudDetails.actionTaken}</span>
                </div>
              </Col>
            </Row>
          )}
        </Modal>
        <Modal
          title="Rummy Refund"
          closable={true}
          maskClosable={true}
          width={800}
          visible={this.state.refundModal}
          onOk={this.checkForRefund}
          onCancel={() => {
            this.setState({ refundModal: false, refundReason: '' });
          }}
        >
          <React.Fragment>
            <div style={{ marginBottom: 20 }}>
              {'Are you sure that you want to initiate the refund for unique_id ' +
                record.unique_id +
                '?'}
            </div>
          </React.Fragment>
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getRummyDetailsResponse: state.crm.getRummyDetailsResponse,
    getRummyDisconnectionDetailsResponse:
      state.crm.getRummyDisconnectionDetailsResponse,
    processRummyRefundResponse: state.crm.processRummyRefundResponse,
    gameFraud: state.fraud.gameFraud,
    getUserTransactionDetailsResponse:
      state.crm.getUserTransactionDetailsResponse,
    nonRefundedRefIds: state.supportPayment.nonRefundedRefIds,
    refundResponse: state.accounts.refundResponse,
    currentUser: state.auth.currentUser,
    refundConfig: state.accounts.refundConfig
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...crmActions,
        ...fraudActions,
        ...supportPaymentActions,
        ...accountActions
      },
      dispatch
    )
  };
}

const RummySelectionForm = Form.create()(RummySelection);
export default connect(mapStateToProps, mapDispatchToProps)(RummySelectionForm);
