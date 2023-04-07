import React from 'react';
import { get, map } from 'lodash';
import { connect } from 'react-redux';
import {
  message,
  Table,
  Button,
  Modal,
  Pagination,
  Card,
  Checkbox,
  Popconfirm,
  DatePicker
} from 'antd';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as collectiblesActions from '../../actions/CollectiblesActions';

class CollectibleSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userCards: [],
      transactionModal: false,
      totalCount: 10,
      transactionDetails: [],
      pageNumber: 1,
      pageSize: 10,
      creditCollectibleModal: false,
      userTasks: [],
      taskIdsForCredit: '',
      totalTransactions: 0
    };
  }

  componentDidMount = () => {
    const userId = get(this.props, 'userId', null);

    if (userId) {
      const data = {
        userId: userId
      };
      this.props.actions.getCollectibleUserCards(data).then(() => {
        if (this.props.userCards && this.props.userCards.error) {
          message.error('Unable To Fetch user Card Data!');
        } else {
          this.setState({
            userCards: [...this.props.userCards.userCollectibleCards]
          });
        }
      });
    }
  };
  onChangePage = page => {
    const { pageSize } = this.state;
    this.setState({ pageNumber: page }, () => {
      this.fetchTransactionDetailsHandler(page, pageSize);
    });
  };
  closeTransactionModalHandler = () => {
    this.setState({ transactionModal: false });
  };
  closeCollectibleModalHandler = () => {
    this.setState({ creditCollectibleModal: false });
  };
  handleDateChange = value => {
    const { totalTransactions } = this.state;
    this.fetchTransactionDetailsHandler(1, totalTransactions, true);
  };
  filterByDate = transactions => {
    const { selectedDate } = this.state;
    let results = [];
    map(transactions, transaction => {
      if (
        moment(transaction.createdAt, 'x').format('DD MM YYYY') ===
        moment(selectedDate).format('DD MM YYYY')
      ) {
        results.push(transaction);
      }
    });
    return results;
  };

  fetchTransactionDetailsHandler = (pageNumber, pageSize, isFilter = false) => {
    const userId = get(this.props, 'userId', null);
    const data = {
      userId,
      pageNumber,
      pageSize
    };
    this.props.actions.getUserCollectibleTransaction(data).then(() => {
      if (
        this.props.userCollectibleTransactions &&
        this.props.userCollectibleTransactions.error
      ) {
        message.error('Cannot Fetch Details!');
      } else if (
        this.props.userCollectibleTransactions.totalTransactions == 0
      ) {
        message.info('No Records Found!');
        this.setState({
          transactionDetails: [],
          totalCount: 1
        });
      } else {
        let filteredTransactions = [];
        if (isFilter) {
          filteredTransactions = this.filterByDate(
            this.props.userCollectibleTransactions.collectibleTransactions
          );
        }
        this.setState({
          transactionModal: true,
          transactionDetails: isFilter
            ? filteredTransactions
            : this.props.userCollectibleTransactions.collectibleTransactions,
          totalCount: isFilter
            ? filteredTransactions.length
            : this.props.userCollectibleTransactions.totalTransactions,
          totalTransactions: this.props.userCollectibleTransactions
            .totalTransactions
        });
      }
    });
  };
  onCreditCollectible = () => {
    const userId = get(this.props, 'userId', null);
    const email = get(this.props.currentUser, 'email', null);
    const { taskIdsForCredit } = this.state;
    const data = {
      userId: userId,
      collectibleTaskId: taskIdsForCredit,
      creditRequester: email
    };

    this.props.actions.creditUserCard(data).then(() => {
      if (
        this.props.creditCollectibleResponse &&
        this.props.creditCollectibleResponse.error
      ) {
        message.error('Cannot Credit A Collectible Card!');
      } else {
        message.success('Successfully Credit A Collectible Card!');
        this.setState({
          creditCollectibleModal: false
        });
      }
    });
  };

  getCardNameById = cardId => {
    const { userCards } = this.state;
    let cardName = '';
    userCards.map(card => {
      if (card.cardId === cardId) {
        cardName = card.cardName;
      }
    });
    return cardName;
  };
  creditCollectibleCard = () => {
    const userId = get(this.props, 'userId', null);

    this.props.actions.getUserCollectibleTask({ userId: userId }).then(() => {
      if (
        this.props.userCollectibleTasks &&
        this.props.userCollectibleTasks.error
      ) {
        message.error('Cannot Fetch Details!');
      } else {
        this.setState({
          creditCollectibleModal: true,
          userTasks: this.props.userCollectibleTasks.tasks
        });
      }
    });
  };
  onCheckboxHandler = (taskId, checked) => {
    if (checked) {
      this.setState({
        taskIdsForCredit: taskId
      });
    } else {
      this.setState({
        taskIdsForCredit: ''
      });
    }
  };
  removeFilterHandler = () => {
    const { pageSize } = this.state;
    this.setState({ selectedDate: '', pageNumber: 1 }, () => {
      this.fetchTransactionDetailsHandler(1, pageSize);
    });
  };
  getTaskColumns = () => {
    const { taskIdsForCredit } = this.state;

    const columns = [
      {
        title: '',
        dataIndex: 'select',
        key: 'select',
        render: (text, record) => (
          <Checkbox
            onChange={e =>
              this.onCheckboxHandler(record.taskId, e.target.checked)
            }
            checked={taskIdsForCredit == record.taskId ? true : false}
          />
        )
      },
      {
        title: 'Task Id',
        key: 'taskId',
        dataIndex: 'taskId'
      },
      {
        title: 'Task Name',
        key: 'title',
        dataIndex: 'title'
      },
      {
        title: 'Task Type',
        key: 'taskType',
        dataIndex: 'taskType'
      },
      {
        title: 'Max. Collected Cards Allowed',
        key: 'maxCardCollected',
        dataIndex: 'maxCardCollected'
      },
      {
        title: 'Cards Collected',
        key: 'actualCardCollected',
        dataIndex: 'actualCardCollected',
        render: (text, record) => (
          <div>
            {record.actualCardCollected ? record.actualCardCollected : 0}
          </div>
        )
      }
    ];
    return columns;
  };
  getCollectibleColumns = () => {
    const columns = [
      {
        title: 'Card Id',
        key: 'cardId',
        dataIndex: 'cardId'
      },
      {
        title: 'Card Name',
        key: 'cardName',
        dataIndex: 'cardName'
      },
      {
        title: ' Total Number Of Cards',
        key: 'count',
        dataIndex: 'count',
        render: (text, record) => <div>{record.count ? record.count : 0}</div>
      }
    ];
    return columns;
  };
  getTransactionColumns = () => {
    const columns = [
      {
        title: 'Card Id',
        key: 'collectibleCardId',
        dataIndex: 'collectibleCardId'
      },
      {
        title: 'Card Name',
        key: 'cardName',
        dataIndex: 'cardName',
        render: (text, record) => {
          const cardName = this.getCardNameById(record.collectibleCardId);
          return <div>{cardName}</div>;
        }
      },
      {
        title: 'Transaction Id',
        key: 'transactionId',
        dataIndex: 'transactionId',
        render: (text, record) => {
          return (
            <div>
              {record.transactionId && record.transactionId.low
                ? record.transactionId.low
                : ''}
            </div>
          );
        }
      },
      {
        title: 'Reference Id',
        key: 'referenceId',
        dataIndex: 'referenceId'
      },
      {
        title: 'Transaction Type',
        key: 'transactionType',
        dataIndex: 'transactionType'
      },
      {
        title: 'Transaction Date',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (text, record) => (
          <div>
            {moment(record.createdAt, 'x').format('DD MMMM YYYY hh:mm:ss A')}
          </div>
        )
      }
    ];
    return columns;
  };

  render() {
    const {
      userCards,
      transactionDetails,
      transactionModal,
      pageNumber,
      pageSize,
      totalCount,
      creditCollectibleModal,
      userTasks,
      taskIdsForCredit
    } = this.state;
    const columns = this.getCollectibleColumns();
    const transactionColumns = this.getTransactionColumns();
    const taskColumns = this.getTaskColumns();
    return (
      <React.Fragment>
        <div>
          {userCards.length > 0 && (
            <Card
              extra={
                <React.Fragment>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() =>
                      this.fetchTransactionDetailsHandler(pageNumber, pageSize)
                    }
                    style={{ marginRight: 10 }}
                  >
                    View Collectible Transactions
                  </Button>
                  <Button size="small" onClick={this.creditCollectibleCard}>
                    Credit Collectible Card
                  </Button>
                </React.Fragment>
              }
            >
              <Table
                bordered
                pagination={false}
                dataSource={userCards}
                columns={columns}
              />
            </Card>
          )}
        </div>
        <Modal
          title="Collectible Transaction Details"
          closable={true}
          maskClosable={true}
          width={800}
          visible={transactionModal}
          onCancel={this.closeTransactionModalHandler}
          onOk={this.closeTransactionModalHandler}
        >
          <div>
            <h3>Filter By</h3>
            <div>
              <label style={{ margin: 10 }}>Date:</label>
              <DatePicker
                allowClear="true"
                showTime={{ format: 'hh:mm A', use12Hours: true }}
                format="YYYY-MM-DD"
                onChange={value => {
                  this.setState({ selectedDate: value });
                }}
                onOk={this.handleDateChange}
                allowClear={false}
                value={this.state.selectedDate}
                style={{ marginBottom: 10, marginRight: 25 }}
              />
              <Button type="danger" onClick={this.removeFilterHandler}>
                Remove Filter
              </Button>
            </div>
          </div>
          <React.Fragment>
            <Table
              rowKey="teamId"
              bordered
              dataSource={transactionDetails}
              columns={transactionColumns}
              pagination={false}
              scroll={{ x: '100%' }}
            />
            <Pagination
              current={pageNumber}
              defaultCurrent={pageNumber}
              onChange={page => this.onChangePage(page)}
              total={totalCount}
              pageSize={pageSize}
              style={{ marginTop: 10 }}
            />
          </React.Fragment>
        </Modal>
        <Modal
          title="Credit Collectible Card"
          closable={true}
          maskClosable={true}
          width={800}
          okText="Credit Collectible Card"
          visible={creditCollectibleModal}
          footer={[
            <React.Fragment>
              <Button
                type="default"
                onClick={this.closeCollectibleModalHandler}
                style={{ marginRight: 10 }}
              >
                Cancel
              </Button>
              <Popconfirm
                title="Are you sure want to Credit A Card?"
                onConfirm={this.onCreditCollectible}
                disabled={!taskIdsForCredit}
              >
                <Button type="primary" disabled={!taskIdsForCredit}>
                  Credit Collectible Card
                </Button>
              </Popconfirm>
            </React.Fragment>
          ]}
        >
          <React.Fragment>
            <Table
              rowKey="teamId"
              bordered
              dataSource={userTasks}
              columns={taskColumns}
              pagination={false}
              scroll={{ x: '100%' }}
            />
          </React.Fragment>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  const {
    userCollectibleCard,
    userCollectibleTasks,
    userCollectibleTransactions,
    creditCollectibleResponse
  } = state.collectibles;
  return {
    userCards: userCollectibleCard,
    userCollectibleTasks: userCollectibleTasks,
    userCollectibleTransactions: userCollectibleTransactions,
    creditCollectibleResponse: creditCollectibleResponse,
    currentUser: state.auth.currentUser
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...collectiblesActions }, dispatch)
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectibleSelection);
