import React, { Component } from 'react';
import {
  DatePicker,
  Select,
  Button,
  Table,
  message,
  Form,
  Pagination,
  Row,
  Col,
  Modal,
  Tag,
  Popconfirm,
  Spin,
  Input,
  Checkbox,
  InputNumber
} from 'antd';
import { connect } from 'react-redux';
import { CSVLink } from 'react-csv';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { get } from 'lodash';
import * as supportPaymentActions from '../../actions/SupportPaymentActions';
import * as accountActions from '../../actions/accountsActions';
import * as crmActions from '../../actions/crmActions';

const { Option } = Select;
const FormItem = Form.Item;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  label: {
    marginRight: 10
  }
};
const transactionType = [
  { label: 'All', value: 'all' },
  { label: 'Deposit', value: 'deposit' },
  { label: 'Withdraw', value: 'withdraw' }
];

const getDaysSinceDeposit = date => {
  const totalHours = Math.round(
    moment
      .duration(moment().diff(moment(date, 'YYYY-MM-DD hh:mm:ss')))
      .asHours(),
    0
  );
  const days = Math.trunc(totalHours / 24);
  const hours = totalHours % 24;

  return `${days} days ${hours} hours`;
};
const convertgmtTime = recordDate => {
  const date = moment(recordDate, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');
  const time = moment(recordDate, 'YYYY-MM-DD hh:mm:ss')
    .add(270, 'minutes')
    .format('hh:mm:ss A');

  const dateTime = date + ' ' + time;
  return dateTime;
};

class PaymentSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 20,
      tableData: [],
      startTime: '',
      endTime: '',
      totalCount: 1,
      dataFetched: false,
      moneyType: 'all',
      withdrawModal: false,
      depositModal: false,
      selectedRecord: {},
      cashbackDetails: [],
      transactionHistory: [],
      loading: false,
      isSubmitted: false,
      gatewayPaymentStatus: '',
      inputModal: false,
      email: '',
      isEmailValid: true,
      isMoneyTypeValid: '',
      csvData: [],
      isReferenceIdSubmitted: false,
      isRefundDisable: false,
      currencyCode: '',
      refundDeposit: false,
      depositRecord: {},
      applyCharges: false,
      newAmount: '',
      depositBtn: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.fetchList = this.fetchList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }
  componentDidMount() {
    const type = get(this.props, 'searchCriteria', '');
    if (type)
      if (type == 'TRANSACTION_ID') {
        this.props.actions.getRefundConfig().then(() => {
          this.setState({
            isRefundDisable: this.props.refundConfig
          });
        });
        const data = {
          transactionId: this.props.transactionId
        };
        this.props.actions.getTransactionDetails(data).then(() => {
          if (this.props.transactionDetail.error) {
            message.error(this.props.transactionDetail.error.message);
          } else if (
            this.props.transactionDetail.hasOwnProperty('transactionHistory')
          ) {
            this.setState({
              tableData: [...this.props.transactionDetail.transactionHistory],
              totalCount: this.props.transactionDetail.transactionHistory.length
            });
            message.info('Records Fetched Successfully!');
          } else {
            this.setState({
              transactionDetail: [],
              totalCount: 1
            });
            message.info('No Records found!');
          }
        });
      } else {
        const userId = get(this.props, 'userId', '');

        if (userId) {
          const data = {
            startTime: moment()
              .subtract(7, 'days')
              .format('x')
              .slice(0, 10),
            endTime: moment()
              .format('x')
              .slice(0, 10),
            pageNumber: 1,
            pageSize: this.state.pageSize,
            userId: userId,
            countryCode: this.props.countryCode
          };
          this.props.actions.getUserTransactionList(data).then(() => {
            if (
              this.props.transactionList.transactionHistory &&
              this.props.transactionList.transactionHistory.length > 0
            ) {
              this.setState({
                tableData: this.props.transactionList.transactionHistory,
                totalCount: 10,
                dataFetched: true,
                loading: false
              });
              message.success('Records Fetched Successfully');
            } else {
              this.setState({
                tableData: [],
                totalCount: 1,
                dataFetched: true,
                loading: false
              });
              message.info('No Records Found!');
            }
          });
        }
      }
  }
  getTransactionStatus = status =>
    this.state.moneyType === 'deposit' ? (
      status === 'PENDING' ? (
        <Tag color="#2db7f5">{status}</Tag>
      ) : status === 'SUCCESS' ? (
        <Tag color="#87d068">{status}</Tag>
      ) : status === 'PAYMENT_FAILURE' ? (
        <Tag color="#f50">{status}</Tag>
      ) : (
        <Tag color="#2db7f5">{status}</Tag>
      )
    ) : status === 'SUCCESS' ? (
      <Tag color="#87d068">{status}</Tag>
    ) : status === 'FAILED' ? (
      <Tag color="#f50">{status}</Tag>
    ) : (
      <Tag color="#2db7f5">{status}</Tag>
    );

  handleChange(value) {
    const { startTime, endTime, isSubmitted } = this.state;
    if (startTime && endTime) {
      const diff = moment(this.state.endTime, 'x').diff(
        moment(this.state.startTime, 'x'),
        'days'
      );
      if (diff <= 15) {
        this.setState(
          { moneyType: value, pageNumber: 1, isMoneyTypeValid: true },
          () => {
            this.fetchList();
          }
        );
      } else {
        message.error('Date Range must be less than or equal to 15 days');
      }
    } else {
      this.setState({ isMoneyTypeValid: false });
    }
  }
  onChangePage(page) {
    this.setState({ pageNumber: page }, () => {
      this.fetchList();
    });
  }
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.startTime && values.endTime) {
        const startTime = values.startTime
          .format('x')
          .substring(0, values.startTime.valueOf());

        const endTime = values.endTime
          .format('x')
          .substring(0, values.endTime.valueOf());

        this.setState(
          {
            startTime: startTime,
            endTime: endTime,
            isSubmitted: true,
            isMoneyTypeValid: true
          },
          () => {
            const diff = moment(this.state.endTime, 'x').diff(
              moment(this.state.startTime, 'x'),
              'days'
            );
            if (diff <= 15) {
              this.fetchList();
            } else {
              message.error('Date Range must be less than or equal to 15 days');
            }
          }
        );
      }
    });
  }

  fetchList() {
    const { pageNumber, pageSize, startTime, endTime, moneyType } = this.state;
    const { mobileNumber } = this.props;
    const userId = get(this.props, 'userId', '');

    this.setState({ loading: true });
    let data = {
      userId: userId,
      mobileNumber: '',
      startTime: moneyType !== 'all' ? startTime : startTime.substring(0, 10),
      endTime: moneyType !== 'all' ? endTime : endTime.substring(0, 10),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
    if (moneyType === 'deposit') {
      this.props.actions.getDepositList(data).then(() => {
        if (this.props.paymentList && this.props.paymentList.error) {
          this.setState({ loading: false });
          message.error('Cannot Fetch data!Something went wrong');
        } else if (
          this.props.paymentList.userDepositHistoryList &&
          this.props.paymentList.userDepositHistoryList.length > 0
        ) {
          this.setState({
            tableData: this.props.paymentList.userDepositHistoryList,
            totalCount: this.props.paymentList.totalEntries,
            dataFetched: false,
            loading: false,
            currencyCode: this.props.paymentList.currencyCode
          });
          message.success('Records Fetched Successfully');
        } else {
          this.setState({
            tableData: [],
            totalCount: 1,
            dataFetched: false,
            loading: false
          });
          message.info('No Records Found!');
        }
      });
    } else if (moneyType === 'withdraw') {
      this.props.actions.getWithdrawalList(data).then(() => {
        if (this.props.paymentList && this.props.paymentList.error) {
          this.setState({ loading: false });
          message.error('Cannot Fetch data!Something went wrong');
        } else if (
          this.props.paymentList.userWithdrawalHistory &&
          this.props.paymentList.userWithdrawalHistory.length > 0
        ) {
          this.setState({
            tableData: this.props.paymentList.userWithdrawalHistory,
            totalCount: this.props.paymentList.totalEntries,
            dataFetched: false,
            loading: false,
            currencyCode: this.props.paymentList.currencyCode
          });
          message.success('Records Fetched Successfully');
        } else {
          this.setState({
            tableData: [],
            totalCount: 1,
            dataFetched: false,
            loading: false
          });
          message.info('No Records Found!');
        }
      });
    } else {
      data = {
        ...data,
        // phoneNumber: '+' + mobileNumber,
        countryCode: this.props.countryCode
      };
      this.props.actions.getUserTransactionList(data).then(() => {
        if (this.props.transactionList && this.props.transactionList.error) {
          this.setState({ loading: false });
          message.error('Cannot Fetch data!Something went wrong');
        } else if (
          this.props.transactionList.transactionHistory &&
          this.props.transactionList.transactionHistory.length > 0
        ) {
          this.setState(
            {
              tableData: this.props.transactionList.transactionHistory,
              totalCount: this.props.transactionList.totalPages * 10,
              dataFetched: true,
              loading: false,
              currencyCode: this.props.countryCode == 'US' ? 'USD' : 'INR'
            },
            () => {
              this.getData();
            }
          );
          message.success('Records Fetched Successfully');
        } else {
          this.setState({
            tableData: [],
            totalCount: 1,
            dataFetched: true,
            loading: false
          });
          message.info('No Records Found!');
        }
      });
    }
  }
  showDetailsHandler = record => {
    const { moneyType } = this.state;
    if (moneyType === 'deposit') {
      const data = {
        transactionId: record.transactionId,
        countryCode: this.props.countryCode
      };
      this.props.actions.getDepositDetails(data).then(() => {
        this.props.actions.getTransaction(data).then(() => {
          this.props.actions.getCashBackByTransactionId(data).then(() => {
            const cashback =
              Object.keys(this.props.cashbackDetails).length > 0
                ? [{ ...this.props.cashbackDetails }]
                : [];
            // if (
            //   this.props.paymentDetails.error
            // ) {
            //   this.setState({
            //     selectedRecord: {
            //       ...record,
            //       transactionMode: '-',
            //       gatewayName: '-'
            //     },
            //     depositModal: true,
            //     cashbackDetails: cashback
            //   });
            // } else {
            this.setState({
              selectedRecord: {
                ...record,
                transactionMode:
                  this.props.paymentDetails &&
                  Object.keys(this.props.paymentDetails).length > 0 &&
                  this.props.paymentDetails.transactionMode
                    ? this.props.paymentDetails.transactionMode
                    : '-',
                gatewayName:
                  this.props.paymentDetails &&
                  Object.keys(this.props.paymentDetails).length > 0 &&
                  this.props.paymentDetails.plugin
                    ? this.props.paymentDetails.plugin
                    : '-'
              },
              depositModal: true,
              cashbackDetails: cashback
            });
            // }
          });
        });
      });
    } else {
      const data = {
        transactionId: record.transactionId,
        countryCode: this.props.countryCode
      };
      this.props.actions.getWithdrawalDetails(data).then(() => {
        this.props.actions
          .getTransactionDetails({
            referenceId: record.transactionId,
            transactionId: ''
          })
          .then(() => {
            if (
              !this.props.paymentDetails.error &&
              !this.props.transactionbyReference.error
            ) {
              this.setState({
                selectedRecord: {
                  ...record,
                  withdrawalType: this.props.paymentDetails.isInstantWithdrawal
                    ? 'Instant Withdrawal'
                    : '3 days Verification',
                  gatewayPaymentStatus: this.props.paymentDetails
                    .gatewayPaymentStatus,
                  utrNumber: this.props.paymentDetails.utrNumber
                    ? this.props.paymentDetails.utrNumber
                    : '',
                  plugin: this.props.paymentDetails.plugin
                    ? this.props.paymentDetails.plugin
                    : '',
                  pgTransactionId: this.props.paymentDetails.pgTransactionId
                    ? this.props.paymentDetails.pgTransactionId
                    : ''
                },
                transactionHistory: this.props.transactionbyReference
                  .transactionHistory,
                withdrawModal: true
              });
            } else {
              if (this.props.paymentDetails.error) {
                this.setState({
                  selectedRecord: {
                    ...record,
                    withdrawalType: '-',
                    gatewayPaymentStatus: '',
                    utrNumber: '',
                    plugin: '',
                    pgTransactionId: ''
                  },
                  withdrawModal: true,
                  transactionHistory: this.props.transactionbyReference
                    .transactionHistory
                });
              } else {
                this.setState({
                  selectedRecord: {
                    ...record,
                    withdrawalType: this.props.paymentDetails
                      .isInstantWithdrawal
                      ? 'Instant Withdrawal'
                      : '3 days Verification',
                    gatewayPaymentStatus: this.props.paymentDetails
                      .gatewayPaymentStatus,
                    utrNumber: this.props.paymentDetails.utrNumber
                      ? this.props.paymentDetails.utrNumber
                      : '',
                    plugin: this.props.paymentDetails.plugin
                      ? this.props.paymentDetails.plugin
                      : '',
                    pgTransactionId: this.props.paymentDetails.pgTransactionId
                      ? this.props.paymentDetails.pgTransactionId
                      : ''
                  },
                  withdrawModal: true,
                  transactionHistory: []
                });
              }
            }
          });
      });
    }
  };
  getData = () => {
    const { mobileNumber, startTime, endTime } = this.state;
    let data = {
      mobileNumber: '+' + mobileNumber,
      startTime: startTime.substring(0, 10),
      endTime: endTime.substring(0, 10),
      pageNumber: 1,
      pageSize: this.state.totalCount,
      countryCode: this.props.countryCode
    };
    this.props.actions.getUserTransactionList(data).then(() => {
      if (
        this.props.transactionList.transactionHistory &&
        this.props.transactionList.transactionHistory.length > 0
      ) {
        this.setState({
          csvData: [...this.props.transactionList.transactionHistory]
        });
      } else {
        this.setState({
          csvData: []
        });
      }
    });
  };
  depositModalHandler = () => {
    this.setState({ depositModal: false });
  };
  withdrawModalHandler = () => {
    this.setState({ withdrawModal: false });
  };
  creditWalletHandler = record => {
    const userId = get(this.props, 'userId', '');
    const data = {
      userId,
      referenceId: record.transactionId
    };
    this.props.actions.processPendingDeposit(data).then(() => {
      if (this.props.pendingDepositRes && this.props.pendingDepositRes.error) {
        message.error(this.props.pendingDepositRes.error.message);
      } else {
        this.fetchList();
        message.success('Money credited successfully!');
      }
    });
  };
  onRefundAmountHandler = () => {
    const { selectedRecord } = this.state;
    const userId = get(this.props, 'userId', '');
    const data = {
      amount: selectedRecord.amount,
      transactionId: selectedRecord.transactionId,
      userId: userId,
      transactionMode: selectedRecord.transactionMode,
      timestamp: moment(
        selectedRecord.createdDate,
        'YYYY-MM-DD hh:mm:ss'
      ).valueOf()
    };
    this.props.actions.refundWithdrawalAmount(data).then(() => {
      if (this.props.refundWithdraw && this.props.refundWithdraw.isSuccess) {
        this.setState({ withdrawModal: false });
        message.success('Refund Successful');
      } else {
        message.error('Refund Unsuccessful!Try Agin');
      }
    });
  };
  onPushToGoogleSheetHandler = () => {
    const { selectedRecord } = this.state;
    const userId = get(this.props, 'userId', '');
    const mobileNumber = get(this.props, 'mobileNumber', '');

    const data = {
      amount: selectedRecord.amount,
      transactionId: selectedRecord.transactionId,
      userId: userId,
      mobileNo: mobileNumber,
      timestamp: moment(
        selectedRecord.createdDate,
        'YYYY-MM-DD hh:mm:ss'
      ).format('DD-MM-YYYY hh:mm:ss A'),
      transactionStatus: selectedRecord.transactionStatus,
      paymentMode: selectedRecord.transactionMode
    };
    this.props.actions.pushToGoogleSheet(data).then(() => {
      if (this.props.withdrawalSheet && this.props.withdrawalSheet.isSuccess) {
        this.setState({ withdrawModal: false });
        message.success('Transaction Pushed to Google Sheet');
      } else {
        message.error('Please Try Agin');
      }
    });
  };
  processDepositRefund = () => {
    const { applyCharges, depositRecord, newAmount } = this.state;

    this.setState({ depositBtn: true });
    console.log('trest');
    if (newAmount > depositRecord.amount) {
      message.error('Please enter a valid transaction amount!');
      return;
    }
    const data = {
      amount: newAmount,
      userId: this.props.userId,
      countryCode: this.props.countryCode,
      paymentId: depositRecord.transactionId,
      applyCharges: applyCharges
    };

    this.props.actions.refundDepositMoney(data).then(() => {
      if (this.props.refundMoneyRes && this.props.refundMoneyRes.success) {
        this.setState(
          {
            refundDeposit: false,
            newAmount: '',
            applyCharges: false,
            depositBtn: false
          },
          () => {
            message.success('Refund successful!');
          }
        );
      } else {
        this.setState({ depositBtn: false }, () => {
          message.error(this.props.refundMoneyRes.reason);
        });
      }
    });
  };
  sendEmailHandler = () => {
    const { email, selectedRecord } = this.state;

    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!regex.test(email)) {
      this.setState({ isEmailValid: false });
    } else {
      this.setState({ isEmailValid: true });
      const data = {
        userEmailId: email,
        txnAmount: selectedRecord.amount,
        txnReferenceId: selectedRecord.transactionId,
        date: convertgmtTime(selectedRecord.createdDate)
      };
      this.props.actions.sendEmail(data).then(() => {
        if (
          this.props.sendEmailResponse &&
          this.props.sendEmailResponse.isSuccess
        ) {
          this.setState({ depositModal: false, inputModal: false, email: '' });
          message.success('Email send successfully!');
        } else {
          message.error('Please Try Agin');
        }
      });
    }
  };
  onChangeReferenceId = e => {
    this.setState({
      referenceId: e.target.value
    });
  };
  onShowSizeChange = (current, pageSize) => {
    this.setState(
      {
        pageNumber: current,
        pageSize: pageSize
      },
      () => {
        this.fetchList();
      }
    );
  };
  getTransactionInfo = () => {
    let { referenceId, transactionId } = this.state;
    this.setState({ isReferenceIdSubmitted: true });

    if (!referenceId && !transactionId) {
      message.error('Please enter transaction id or reference id!');
      return;
    }
    if (referenceId) {
      this.setState({ loading: true });
      let transactionFetchData = {
        userId: this.props.userId,
        referenceId,
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
              ...this.props.getUserTransactionDetailsResponse.transactionHistory
            ];
            this.setState({
              tableData: transactionDetails,
              totalCount: transactionDetails.length,
              dataFetched: true,
              loading: false,
              moneyType: 'all'
            });
          } else {
            message.error('Unable to find transactions by this reference Id');
            this.setState({
              loading: false,
              isReferenceIdSubmitted: false,
              tableData: [],
              totalCount: 1,
              moneyType: 'all'
            });
          }
        });
    } else {
      const data = {
        transactionId: transactionId,
        countryCode: this.props.countryCode
      };
      this.props.actions.getTransactionDetails(data).then(() => {
        if (
          this.props.transactionbyReference &&
          this.props.transactionbyReference.transactionHistory &&
          this.props.transactionbyReference.transactionHistory.length > 0
        ) {
          let transactionDetails = [
            ...this.props.transactionbyReference.transactionHistory
          ];
          const transaction = transactionDetails.filter(transaction =>
            transaction.transactionId.includes(transactionId)
          );
          this.setState({
            tableData: transaction,
            totalCount: 1,
            dataFetched: true,
            loading: false,
            moneyType: 'all'
          });
        } else {
          message.error('Unable to find transactions by this transaction Id');
          this.setState({
            loading: false,
            isReferenceIdSubmitted: false,
            tableData: [],
            totalCount: 1,
            moneyType: 'all'
          });
        }
      });
    }
  };
  getCashbackColumns = () => {
    const columns = [
      {
        title: 'Coupon Code',
        key: 'couponCode',
        dataIndex: 'couponCode'
      },
      {
        title: 'Max Cashback',
        key: 'maxCashback',
        dataIndex: 'maxCashback'
      },
      {
        title: 'Amount To Be Received',
        key: 'discountAmount',
        dataIndex: 'discountAmount'
      },
      {
        title: 'Status',
        key: 'isSuccess',
        dataIndex: 'isSuccess',
        render: (text, record) =>
          record.isSuccess ? (
            <Tag color="#2db7f5">Success</Tag>
          ) : (
            <Tag color="#f50">Failed</Tag>
          )
      }
    ];
    return columns;
  };
  getTransactionDetailsColumns() {
    const columns = [
      {
        title: 'Transaction Id',
        key: 'transactionId',
        dataIndex: 'transactionId'
      },
      {
        title: 'Transaction type',
        key: 'transactionType',
        dataIndex: 'transactionType'
      },
      {
        title: 'Reference Id',
        key: 'referenceId',
        dataIndex: 'referenceId'
      },
      {
        title: 'Reference type',
        key: 'referenceType',
        dataIndex: 'referenceType'
      },
      {
        title: 'Currency Code',
        key: 'currencyCode',
        dataIndex: 'currencyCode',
        render: (text, record) => <div>{this.state.currencyCode}</div>
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        render: (text, record) => <div>{record.amount}</div>
      },
      {
        title: 'Money Type',
        key: 'moneyType',
        dataIndex: 'moneyType'
      },
      {
        title: 'Transaction Date',
        key: 'date',
        dataIndex: 'date',
        render: (text, record) =>
          this.state.moneyType === 'all' ? (
            <div>
              {moment(record.date, 'x').format('DD MMM YYYY hh:mm:ss A')}
            </div>
          ) : (
            <div>{moment(record.date).format('DD MMM YYYY hh:mm:ss A')}</div>
          )
      },
      {
        title: 'Description',
        key: 'description',
        dataIndex: 'description'
      }
    ];
    return columns;
  }
  getModalContent = () => {
    const { selectedRecord, moneyType, transactionHistory } = this.state;
    const cashbackColumns = this.getCashbackColumns();
    const transactionDetailsColumns = this.getTransactionDetailsColumns();
    return (
      <React.Fragment>
        <Row>
          <Col sm={12}>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Referance Id:
              </span>
              <span>{selectedRecord.transactionId}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Amount:
              </span>
              <span>{selectedRecord.amount} </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Transaction Date:
              </span>
              <span>{convertgmtTime(selectedRecord.createdDate)}</span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Payment Mode:
              </span>
              <span>{selectedRecord.transactionMode}</span>
            </div>
          </Col>
          <Col sm={12}>
            {this.state.moneyType === 'deposit' ? (
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Gateway Name:
                </span>
                <span>{selectedRecord.gatewayName}</span>
              </div>
            ) : (
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Withdrawal Type:
                </span>
                <span>{selectedRecord.withdrawalType}</span>
              </div>
            )}
            {this.state.moneyType === 'withdraw' && (
              <div>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                  Gateway Payment Status:
                </span>
                <span>{selectedRecord.gatewayPaymentStatus}</span>
              </div>
            )}
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Transaction Status:
              </span>
              <span>
                {this.getTransactionStatus(selectedRecord.transactionStatus)}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                UTR Number:
              </span>
              <span>
                {selectedRecord.utrNumber ? selectedRecord.utrNumber : 'NA'}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Payment Gateway(Plugin) :
              </span>
              <span>
                {selectedRecord.plugin ? selectedRecord.plugin : 'NA'}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Payment Gateway Transaction ID :
              </span>
              <span>
                {selectedRecord.pgTransactionId
                  ? selectedRecord.pgTransactionId
                  : 'NA'}
              </span>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          {this.state.cashbackDetails.length > 0 && moneyType === 'deposit' && (
            <Table
              rowKey="couponId"
              bordered
              dataSource={this.state.cashbackDetails}
              columns={cashbackColumns}
              pagination={false}
              scroll={{ x: '100%' }}
            />
          )}
          {moneyType === 'withdraw' &&
            transactionHistory &&
            transactionHistory.length > 0 && (
              <Table
                id="user-transaction-id"
                rowKey="id"
                bordered
                dataSource={transactionHistory}
                columns={transactionDetailsColumns}
                scroll={{ x: '100%' }}
                style={{ margin: 20 }}
              />
            )}
        </Row>
      </React.Fragment>
    );
  };

  getColumns() {
    const { moneyType } = this.state;
    console.log('depositBtn', this.state.depositBtn);
    const columns = [
      {
        title: 'Referance Id',
        key: 'transactionId',
        dataIndex: 'transactionId'
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        render: (text, record) => <div>{record.amount}</div>
      },
      {
        title: 'Currency Code',
        key: 'currencyCode',
        dataIndex: 'currencyCode',
        render: (text, record) => <div>{this.state.currencyCode}</div>
      },
      {
        title: 'Transaction Status',
        key: 'transactionStatus',
        dataIndex: 'transactionStatus',
        render: (text, record) =>
          this.getTransactionStatus(record.transactionStatus)
      },
      {
        title: 'Transaction Date',
        key: 'createdDate',
        dataIndex: 'createdDate',
        render: (text, record) => (
          <div>{convertgmtTime(record.createdDate)}</div>
        )
      },
      {
        title:
          moneyType == 'deposit'
            ? 'Days Since Deposit'
            : 'Days Since Withdrawal',
        key: 'daysSinceDeposit',
        dataIndex: 'daysSinceDeposit',
        render: (text, record) => (
          <div>{getDaysSinceDeposit(record.createdDate)}</div>
        )
      },

      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <React.Fragment>
            <Button
              type="primary"
              size="small"
              onClick={() => this.showDetailsHandler(record)}
            >
              View Details
            </Button>
            {this.state.moneyType === 'deposit' &&
              this.props.countryCode == 'US' &&
              record.transactionStatus == 'SUCCESS' && (
                <Button
                  type="primary"
                  size="small"
                  style={{ marginTop: 10 }}
                  onClick={() =>
                    this.setState({
                      refundDeposit: true,
                      depositRecord: record,
                      newAmount: record.amount
                    })
                  }
                >
                  Refund Deposit
                </Button>
              )}
            {record.transactionStatus === 'PENDING' &&
              this.state.moneyType === 'deposit' &&
              this.props.currentUser.user_role.includes(
                'PAYMENT_WALLET_ADMIN'
              ) && (
                <Popconfirm
                  title="Are you sure want to credit user wallet?"
                  onConfirm={() => this.creditWalletHandler(record)}
                >
                  <Button size="small" style={{ marginTop: 10 }}>
                    Credit Wallet
                  </Button>
                </Popconfirm>
              )}
          </React.Fragment>
        )
      }
    ];
    return columns;
  }
  getAllTransactionColumns = () => {
    const columns = [
      {
        title: 'Transaction Id',
        key: 'transactionId',
        dataIndex: 'transactionId'
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        render: (text, record) => <div>{record.amount}</div>
      },
      {
        title: 'Transaction type',
        key: 'transactionType',
        dataIndex: 'transactionType'
      },
      {
        title: 'Money Type',
        key: 'moneyType',
        dataIndex: 'moneyType'
      },
      {
        title: 'Reference Type',
        key: 'referenceType',
        dataIndex: 'referenceType',
        render: (text, record) => (
          <div>{record.referenceType.replace(/_/g, ' ')}</div>
        )
      },
      {
        title: 'Date',
        key: 'date',
        dataIndex: 'date',
        render: (text, record) => (
          <div>{moment(record.date, 'x').format('DD MMM YYYY hh:mm:ss A')}</div>
        )
      },
      {
        title: 'Reference Id',
        key: 'referenceId',
        dataIndex: 'referenceId'
      },
      {
        title: 'Description',
        key: 'description',
        dataIndex: 'description'
      }
    ];
    return columns;
  };

  render() {
    const {
      tableData,
      pageNumber,
      pageSize,
      totalCount,
      moneyType,
      depositModal,
      withdrawModal,
      selectedRecord,
      dataFetched,
      isEmailValid,
      inputModal,
      email,
      csvData,
      isSubmitted,
      referenceId,
      isReferenceIdSubmitted,
      isRefundDisable
    } = this.state;

    const columns = this.getColumns();
    const modalContent = this.getModalContent();

    const formItemLayout = {
      labelCol: {
        xs: { span: 32 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 28 },
        sm: { span: 16 }
      }
    };
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      matchStartTime:
        isFieldTouched('matchStartTime') && getFieldError('matchStartTime')
    };
    const type = get(this.props, 'searchCriteria', '');
    const transactionColumns = this.getTransactionDetailsColumns();
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          {type !== 'TRANSACTION_ID' && (
            <Form onSubmit={this.handleSubmit}>
              <div style={styles.container}>
                <FormItem
                  validateStatus={errors.startTime ? 'error' : ''}
                  {...formItemLayout}
                  label={<span>Start Time</span>}
                >
                  {getFieldDecorator('startTime', {
                    rules: [
                      {
                        type: 'object',
                        required: true,
                        message: 'Please select start time!'
                      }
                    ]
                  })(
                    <DatePicker
                      allowClear="true"
                      showTime={{ format: 'hh:mm A', use12Hours: true }}
                      format="YYYY-MM-DD hh:mm A"
                      onChange={value => {
                        this.setState({
                          startTime: value
                            .format('x')
                            .substring(0, value.valueOf())
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.endTime ? 'error' : ''}
                  {...formItemLayout}
                  label={<span>End Time</span>}
                >
                  {getFieldDecorator('endTime', {
                    rules: [
                      {
                        type: 'object',
                        required: true,
                        message: 'Please select end time!'
                      }
                    ]
                  })(
                    <DatePicker
                      allowClear="true"
                      showTime={{ format: 'hh:mm A', use12Hours: true }}
                      format="YYYY-MM-DD hh:mm A"
                      onChange={value => {
                        this.setState({
                          endTime: value
                            .format('x')
                            .substring(0, value.valueOf())
                        });
                      }}
                    />
                  )}
                </FormItem>

                <div>
                  <label style={{ paddingRight: 10 }}>Money Type:</label>
                  <Select
                    style={{ width: 160 }}
                    onChange={this.handleChange}
                    value={moneyType}
                    defaultValue="all"
                  >
                    {transactionType.map(item => (
                      <Option value={item.value}>{item.label}</Option>
                    ))}
                  </Select>
                  {!this.state.isMoneyTypeValid &&
                    this.state.isMoneyTypeValid !== '' && (
                      <div style={{ color: 'red' }}>
                        {' '}
                        Please Select Start Date and End Date
                      </div>
                    )}
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            - OR -
          </div>
          <Form>
            <Row>
              <Col span={3}>
                <label>Reference Id</label>
              </Col>
              <Col span={6}>
                <Input
                  onChange={this.onChangeReferenceId}
                  style={{ marginBottom: 10 }}
                />
              </Col>
              <Col span={2}></Col>
              <Col span={3}>
                <label>Transaction Id</label>
              </Col>
              <Col span={6}>
                <Input
                  onChange={e =>
                    this.setState({ transactionId: e.target.value })
                  }
                  style={{ marginBottom: 10 }}
                />
              </Col>
              <Col span={2} style={{ marginLeft: 20 }}>
                <Button type="primary" onClick={this.getTransactionInfo}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
          {moneyType === 'all' && dataFetched && tableData.length > 0 && (
            <React.Fragment>
              <Table
                rowKey="teamId"
                bordered
                dataSource={tableData}
                columns={transactionColumns}
                pagination={false}
                scroll={{ x: '100%' }}
              />
              <Pagination
                current={pageNumber}
                defaultCurrent={pageNumber}
                onChange={page => this.onChangePage(page)}
                total={totalCount ? totalCount : 9}
                pageSize={pageSize}
                style={{ marginTop: 10 }}
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
                pageSizeOptions={[10, 15, 20]}
              />
            </React.Fragment>
          )}
          {moneyType !== 'all' && tableData.length > 0 && (
            <React.Fragment>
              <Table
                rowKey="teamId"
                bordered
                dataSource={tableData}
                columns={columns}
                pagination={false}
                scroll={{ x: '100%' }}
              />
              <Pagination
                current={pageNumber}
                defaultCurrent={pageNumber}
                onChange={page => this.onChangePage(page)}
                total={totalCount ? totalCount : 9}
                pageSize={pageSize}
                style={{ marginTop: 10 }}
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
                pageSizeOptions={[10, 15, 20]}
              />
            </React.Fragment>
          )}

          <Modal
            title="Transaction Details"
            closable={true}
            maskClosable={true}
            width={800}
            visible={depositModal}
            onCancel={this.depositModalHandler}
            footer={[
              <React.Fragment>
                <Button
                  type="primary"
                  disabled={
                    selectedRecord.transactionStatus !== 'PENDING' ||
                    Math.round(
                      moment
                        .duration(
                          moment().diff(
                            moment(
                              selectedRecord.createdDate,
                              'YYYY-MM-DD hh:mm:ss'
                            )
                          )
                        )
                        .asHours(),
                      0
                    ) < 72
                  }
                  onClick={() => this.setState({ inputModal: true })}
                >
                  Send Email
                </Button>
                <Button type="default" onClick={this.depositModalHandler}>
                  Cancel
                </Button>
              </React.Fragment>
            ]}
          >
            {modalContent}
          </Modal>
          <Modal
            title="Transaction Details"
            closable={true}
            maskClosable={true}
            width={800}
            visible={withdrawModal}
            onCancel={this.withdrawModalHandler}
            footer={[
              <React.Fragment>
                <Popconfirm
                  title="Are you sure want to push to sheets?"
                  onConfirm={this.onPushToGoogleSheetHandler}
                >
                  <Button
                    disabled={
                      selectedRecord.transactionStatus !== 'PENDING' ||
                      Math.round(
                        moment
                          .duration(
                            moment().diff(
                              moment(
                                selectedRecord.createdDate,
                                'YYYY-MM-DD hh:mm:ss'
                              )
                            )
                          )
                          .asHours(),
                        0
                      ) < 72
                    }
                  >
                    Push to Sheets
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Are you sure want to refund amount?"
                  onConfirm={this.onRefundAmountHandler}
                >
                  <Button
                    type="danger"
                    // disabled={true}
                    disabled={
                      selectedRecord.amount > 2000 ||
                      selectedRecord.transactionStatus !== 'PENDING' ||
                      Math.round(
                        moment
                          .duration(
                            moment().diff(
                              moment(
                                selectedRecord.createdDate,
                                'YYYY-MM-DD hh:mm:ss'
                              )
                            )
                          )
                          .asHours(),
                        0
                      ) < 72 ||
                      isRefundDisable
                    }
                  >
                    Refund Amount
                  </Button>
                </Popconfirm>
                <Button type="primary" onClick={this.withdrawModalHandler}>
                  Cancel
                </Button>
              </React.Fragment>
            ]}
          >
            {modalContent}
          </Modal>

          <Modal
            title="Send Email"
            closable={true}
            maskClosable={true}
            width={400}
            visible={inputModal}
            onCancel={() => {
              this.setState({ inputModal: false });
            }}
            onOk={this.sendEmailHandler}
          >
            <h3>Please enter Email</h3>
            <Input onChange={this.handleEmailChange} value={email} />
            {!isEmailValid && (
              <div style={{ color: 'red', fontSize: 10 }}>
                Please enter a valid email
              </div>
            )}
          </Modal>
          <Modal
            title={'Refund Depsoit Money'}
            closable={true}
            maskClosable={true}
            width={1000}
            visible={this.state.refundDeposit}
            onCancel={() => this.setState({ refundDeposit: false })}
            footer={[
              <Button
                onClick={this.processDepositRefund}
                disabled={this.state.depositBtn}
              >
                Refund
              </Button>
            ]}
          >
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                Referance Id:
              </span>
              <span>{this.state.depositRecord.transactionId}</span>
            </div>
            <Row style={{ marginTop: 10 }}>
              <Col
                span={2}
                style={{ fontWeight: 'bold', marginRight: 5, marginTop: 5 }}
              >
                Amount:
              </Col>
              <Col span={6}>
                <InputNumber
                  onChange={value => {
                    this.setState({ newAmount: value });
                  }}
                  value={this.state.newAmount}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 10 }}>
              <Checkbox
                onChange={e => {
                  this.setState({ applyCharges: e.target.checked });
                }}
              >
                Do you want to Apply Charges
              </Checkbox>
            </div>
          </Modal>
        </Spin>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  const {
    paymentDetails,
    paymentList,
    transactionDetail,
    refundWithdraw,
    withdrawalSheet,
    cashbackDetails,
    transactionbyReference,
    sendEmailResponse,
    pendingDepositRes
  } = state.supportPayment;
  return {
    paymentDetails: paymentDetails,
    paymentList: paymentList,
    transactionDetail: transactionDetail,
    refundWithdraw: refundWithdraw,
    withdrawalSheet: withdrawalSheet,
    cashbackDetails: cashbackDetails,
    transactionList: state.accounts.transactionList,
    transactionbyReference: transactionbyReference,
    sendEmailResponse: sendEmailResponse,
    getUserTransactionDetailsResponse:
      state.crm.getUserTransactionDetailsResponse,
    refundConfig: state.accounts.refundConfig,
    pendingDepositRes: pendingDepositRes,
    currentUser: state.auth.currentUser,
    refundMoneyRes: state.crm.refundMoneyRes
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...supportPaymentActions, ...accountActions, ...crmActions },
      dispatch
    )
  };
}
const PaymentSelectionForm = Form.create()(PaymentSelection);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentSelectionForm);
