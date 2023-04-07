import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message, Table, Modal, Pagination, Button, Tag } from 'antd';
import { get, map } from 'lodash';
import moment from 'moment';
import * as referralActions from '../../actions/ReferralActions';
import * as supportPaymentActions from '../../actions/SupportPaymentActions';

class ReferralSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referralDetails: [],
      pageNumber: 1,
      pageLimit: 10,
      totalCount: 10,
      selectedRecord: [],
      modal: false
    };
  }
  componentDidMount = () => {
    this.fetchList();
  };
  showDetails = record => {
    const rewardStages = get(record, 'rewardStages', []);

    if (rewardStages.length > 0) {
      const duplicateArray = [...this.state.selectedRecord];
      map(rewardStages, (currentReward, index) => {
        const record = {
          reward: currentReward.reward,
          isCompleted: currentReward.isCompleted
            ? currentReward.isCompleted
            : false,
          createdOn: currentReward.createdOn ? currentReward.createdOn : null,
          referenceId: currentReward.referenceId
            ? JSON.parse(currentReward.referenceId)[0]
            : {}
        };
        duplicateArray[index] = record;
      });
      this.setState({
        selectedRecord: duplicateArray,
        modal: true
      });
    }
  };
  onChangePage = page => {
    this.setState({ pageNumber: page }, () => {
      this.fetchList();
    });
  };
  fetchList = () => {
    const { userId } = this.props;
    const { pageNumber } = this.state;

    const data = {
      userId: userId,
      start: pageNumber * 10 - 10,
      count: 10
    };
    this.props.actions.getReferralDetails(data).then(() => {
      if (this.props.referral.error) {
        message.error(this.props.referral.error.message);
      } else if (
        this.props.referral.referralDetails &&
        this.props.referral.referralDetails.length > 0
      ) {
        this.setState({
          referralDetails: this.props.referral.referralDetails
        });

        message.success('Records Fetched SuccessFully');
      } else {
        this.setState({
          referralDetails: []
        });
        message.info('No records Found');
      }
    });
  };

  getColumns = () => {
    const columns = [
      {
        title: 'User Id',
        key: 'userId',
        render: (text, record) => {
          const userId = get(record.basicUserProfile.id, 'low', null);
          return <div>{userId}</div>;
        }
      },
      {
        title: 'Mobile Number',
        key: 'mobileNumber',
        render: (text, record) => {
          const mobileNumber = get(record.basicUserProfile, 'mobileNumber', '');
          return <div>{mobileNumber}</div>;
        }
      },
      {
        title: 'Verify Status',
        key: 'verifyStatus',
        render: (text, record) => {
          const verifyStatus = get(record.basicUserProfile, 'verifyStatus', '');
          return <div>{verifyStatus}</div>;
        }
      },
      {
        title: 'Tier',
        key: 'tier',
        render: (text, record) => {
          const tier = get(record.basicUserProfile, 'tier', '');
          return <div>{tier}</div>;
        }
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <Button
            size="small"
            onClick={() => this.showDetails(record)}
            type="primary"
          >
            View Reward Stages
          </Button>
        )
      }
    ];
    return columns;
  };

  getRewardColumns = () => {
    const rewardColumns = [
      {
        title: 'Reward Name',
        key: 'reward',
        dataIndex: 'reward'
      },
      {
        title: 'Status',
        key: 'status',
        render: (text, record) =>
          record.isCompleted ? (
            <Tag color="#108ee9">true</Tag>
          ) : (
            <Tag color="#f50">false</Tag>
          )
      },
      {
        title: 'Reward Date',
        key: 'createdOn',
        render: (text, record) => (
          <div>
            {record.createdOn &&
              moment(record.createdOn, 'x').format('DD MMM YYYY hh:mm:ss')}
          </div>
        )
      },

      {
        title: 'Referance Id',
        key: 'referenceId',
        render: (text, record) => {
          const referanceId = get(record.referenceId, 'rsTxnId', '');
          return <div>{referanceId}</div>;
        }
      },
      {
        title: 'Transaction Id',
        key: 'transactionId',
        render: (text, record) => {
          const transactionId = get(record.referenceId, 'asTxnId', '');
          return <div>{transactionId}</div>;
        }
      },
      {
        title: 'Money Type',
        key: 'moneyType',
        render: (text, record) => {
          const currency = get(record.referenceId, 'currency', '');
          return <div>{currency}</div>;
        }
      },
      {
        title: 'Amount',
        key: 'amount',
        render: (text, record) => {
          const amount = get(record.referenceId, 'amount', {});
          return <div>{amount ? amount[Object.keys(amount)[0]] : 0}</div>;
        }
      }
    ];
    return rewardColumns;
  };
  render() {
    const {
      referralDetails,
      pageNumber,
      totalCount,
      pageLimit,
      selectedRecord
    } = this.state;
    const columns = this.getColumns();
    const rewardColumns = this.getRewardColumns();
    return (
      <React.Fragment>
        {referralDetails.length > 0 && (
          <React.Fragment>
            <Table
              rowKey="teamId"
              bordered
              dataSource={referralDetails}
              columns={columns}
              pagination={false}
              scroll={{ x: '100%' }}
            />
            <Pagination
              current={pageNumber}
              defaultCurrent={pageNumber}
              onChange={page => this.onChangePage(page)}
              total={totalCount ? totalCount : 1}
              pageSize={pageLimit}
            />
          </React.Fragment>
        )}

        <Modal
          title="User Reward Details"
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.setState({ modal: false })}
          onCancel={() => this.setState({ modal: false })}
          visible={this.state.modal}
        >
          <Table
            rowKey="rewardId"
            bordered
            dataSource={selectedRecord}
            columns={rewardColumns}
            scroll={{ x: '100%' }}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    referral: state.referral.referralDetails,
    transactionDetail: state.supportPayment.transactionDetail
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...referralActions, supportPaymentActions },
      dispatch
    )
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ReferralSelection);
