import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  message,
  Table,
  Pagination,
  Card,
  Button,
  Modal,
  Row,
  Col
} from 'antd';
import moment from 'moment';
import * as crmActions from '../../actions/crmActions';
import * as offerActions from '../../actions/offerActions';

class PrimeSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageLimit: 10,
      totalCount: 9,
      tableData: [],
      requestType: 'SUBSCRIPTION',
      tickets: [],
      primeGameDetails: {},
      primeModal: false,
      primeSavings: {},
      primeSavingModal: false,
      type: 'GAMES'
    };
  }
  componentDidMount = () => {
    const { pageNumber } = this.state;
    this.fetchSubscriptionDetails(pageNumber);
  };

  onChangePage = page => {
    const { requestType } = this.state;
    this.setState(
      {
        pageNumber: page
      },
      () => {
        if (requestType == 'SUBSCRIPTION') {
          this.fetchSubscriptionDetails(page);
        } else {
          this.getTicketHistory(page);
        }
      }
    );
  };
  getSubscriptionDetails = () => {
    this.fetchSubscriptionDetails(1);
  };

  getTicketHistory = page => {
    const { pageLimit } = this.state;
    const { userId } = this.props;

    const data = {
      userId: userId,
      pageNumber: page,
      pageLimit: pageLimit
    };

    this.setState({
      requestType: 'TICKET'
    });
    this.props.actions.getUserPrimeTicketHistory(data).then(() => {
      if (
        this.props.primeTicketHistory &&
        this.props.primeTicketHistory.error
      ) {
        message.error(this.props.primeTicketHistory.error);
      } else {
        this.setState({
          tickets: this.props.primeTicketHistory.tickets,
          totalCount: this.props.primeTicketHistory.ticketsCount
        });
      }
    });
  };
  fetchSubscriptionDetails = pageNumber => {
    const { pageLimit } = this.state;
    const data = {
      userId: this.props.userId,
      pageNumber: pageNumber,
      pageLimit: pageLimit
    };
    this.setState({
      requestType: 'SUBSCRIPTION'
    });
    this.props.actions.getUserPrimeSubscription(data).then(() => {
      if (
        this.props.userPrimeSubscriptionRes &&
        this.props.userPrimeSubscriptionRes.error
      ) {
        message.error(this.props.userPrimeSubscriptionRes.error);
      } else {
        this.setState({
          tableData: this.props.userPrimeSubscriptionRes
            .primeSubscriptionHistory,
          totalCount: this.props.userPrimeSubscriptionRes.subscriptionCount
        });
      }
    });
  };
  getGameDetails = record => {
    const data = {
      userId: this.props.userId,
      referenceId: record.redemptionReferenceId
    };
    console.log(record.redemptionReferenceId);
    if (/^[[S]\d/i.test(record.redemptionReferenceId)) {
      const id = record.redemptionReferenceId.split(':');
      const sportId = record.redemptionReferenceId.charAt(1);
      const matchId = id[1] ? id[1] : '';
      const contestId = id[2] ? id[2] : '';

      const data = {
        sportId,
        matchId,
        contestId,
        userId: this.props.userId
      };
      console.log('data>>>', data);
      this.props.actions.getPrimeContestDetails(data).then(() => {
        if (
          this.props.primeContest &&
          Object.keys(this.props.primeContest.length > 0)
        ) {
          this.setState({
            primeGameDetails: { ...this.props.primeContest, ...data },
            type: 'FANTASY',
            primeModal: true
          });
        } else {
          this.setState(
            {
              type: 'FANTASY'
            },
            () => {
              message.error('Cannot fetch Game Details');
            }
          );
        }
        console.log('props.', this.props.primeContest);
      });
    } else {
      this.props.actions.getPrimeGameDetails(data).then(() => {
        if (this.props.primeGameDetails && this.props.primeGameDetails.error) {
          this.setState(
            {
              type: 'GAMES'
            },
            () => {
              message.error('Cannot fetch Game Details');
            }
          );
        } else {
          this.setState({
            primeGameDetails: this.props.primeGameDetails,
            primeModal: true,
            type: 'GAMES'
          });
        }
      });
    }
  };
  getTicketColumns = () => {
    const columns = [
      {
        title: 'Ticket Code',
        key: 'tournamentTicketCode',
        dataIndex: 'tournamentTicketCode'
      },
      {
        title: 'Ticket Value',
        key: 'ticketValue',
        dataIndex: 'ticketValue'
      },
      {
        title: 'Redeemed Value',
        key: 'redeemedValue',
        dataIndex: 'redeemedValue'
      },
      {
        title: 'Business Domain',
        key: 'businessDomain',
        dataIndex: 'businessDomain'
      },
      {
        title: 'Redeemed Reference Id',
        key: 'redemptionReferenceId',
        dataIndex: 'redemptionReferenceId'
      },
      {
        title: 'Ticket Expiry',
        key: 'ticketExpireAt',
        dataIndex: 'ticketExpireAt',
        render: (text, record) => (
          <div>
            {moment(record.ticketExpireAt, 'x').format(
              'DD MMM YYYY hh:mm:ss A'
            )}
          </div>
        )
      },

      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            {record.redemptionReferenceId && (
              <Button size="small" onClick={() => this.getGameDetails(record)}>
                Game Details
              </Button>
            )}
          </span>
        )
      }
    ];
    return columns;
  };
  getPrimeSavings = record => {
    const data = {
      userId: this.props.userId,
      countryCode: this.props.countryCode,
      subscriptionId: record.subscriptionId
    };
    this.props.actions.getPrimeUserSavings(data).then(() => {
      if (this.props.primeUserSavings) {
        this.setState({
          primeSavings: this.props.primeUserSavings,
          primeSavingModal: true
        });
      } else {
        this.setState(
          {
            primeSavings: {}
          },
          () => {
            message.error('Cannot fetch user prime saving details');
          }
        );
      }
    });
  };
  closePrimeModal = () => {
    this.setState({
      primeModal: false
    });
  };

  getColumns = () => {
    const columns = [
      {
        title: 'Subscription Type',
        key: 'subscriptionType',
        dataIndex: 'subscriptionType'
      },
      {
        title: 'Amount',
        key: 'subscriptionAmount',
        dataIndex: 'subscriptionAmount'
      },
      {
        title: 'Subscription Start Date',
        key: 'subscriptionStarts',
        dataIndex: 'subscriptionStarts',
        render: (text, record) => (
          <div>
            {moment(record.subscriptionStarts, 'x').format(
              'DD MMM YYYY hh:mm:ss A'
            )}
          </div>
        )
      },
      {
        title: 'Subscription Expiry',
        key: 'subscriptionExpire',
        dataIndex: 'subscriptionExpire',
        render: (text, record) => (
          <div>
            {moment(record.subscriptionExpire, 'x').format(
              'DD MMM YYYY hh:mm:ss A'
            )}
          </div>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button size="small" onClick={() => this.getPrimeSavings(record)}>
              View Savings Details
            </Button>
          </span>
        )
      }
    ];
    return columns;
  };
  render() {
    const columns = this.getColumns();
    const ticketColumns = this.getTicketColumns();

    const {
      pageNumber,
      pageLimit,
      totalCount,
      tableData,
      requestType,
      tickets,
      primeGameDetails,
      primeSavings,
      type
    } = this.state;

    return (
      <React.Fragment>
        <Card>
          <Button
            onClick={() => {
              this.setState({ pageNumber: 1 }, () => {
                this.getSubscriptionDetails();
              });
            }}
            type={requestType === 'SUBSCRIPTION' ? 'primary' : 'default'}
          >
            Subscription
          </Button>
          <Button
            onClick={() => {
              this.setState({ pageNumber: 1 }, () => {
                this.getTicketHistory(1);
              });
            }}
            type={requestType === 'TICKET' ? 'primary' : 'default'}
          >
            Ticket History
          </Button>
        </Card>
        {requestType == 'SUBSCRIPTION' ? (
          <React.Fragment>
            <Table
              rowKey="teamId"
              bordered
              dataSource={tableData}
              columns={columns}
              pagination={false}
              scroll={{ x: '100%' }}
              style={{ margin: 10 }}
            />
            <Pagination
              current={pageNumber}
              defaultCurrent={pageNumber}
              onChange={page => this.onChangePage(page)}
              total={totalCount ? totalCount : 9}
              pageSize={pageLimit}
              style={{ marginTop: 10 }}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Table
              rowKey="teamId"
              bordered
              dataSource={tickets}
              columns={ticketColumns}
              pagination={false}
              scroll={{ x: '100%' }}
              style={{ margin: 10 }}
            />
            <Pagination
              current={pageNumber}
              defaultCurrent={pageNumber}
              onChange={page => this.onChangePage(page)}
              total={totalCount ? totalCount : 9}
              pageSize={pageLimit}
              style={{ marginTop: 10 }}
            />
          </React.Fragment>
        )}
        <Modal
          title={'Game Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          visible={this.state.primeModal}
          onCancel={this.closePrimeModal}
          footer={[
            <Button key="ko-user-close" onClick={this.closePrimeModal}>
              Close
            </Button>
          ]}
        >
          {type == 'FANTASY' ? (
            <Row>
              <Col span={12}>
                <div>
                  Sport Id:
                  <strong>
                    {primeGameDetails && primeGameDetails.sportId
                      ? primeGameDetails.sportId
                      : 'NA'}
                  </strong>
                </div>
                <div>
                  Match Id:
                  <strong>
                    {primeGameDetails && primeGameDetails.matchId
                      ? primeGameDetails.matchId
                      : 'NA'}
                  </strong>
                </div>
                <div>
                  Contest Id:
                  <strong>
                    {primeGameDetails && primeGameDetails.contestId
                      ? primeGameDetails.contestId
                      : 'NA'}
                  </strong>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  Entry Fee:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.registrationFees
                      ? primeGameDetails.registrationFees
                      : 'NA'}
                  </strong>
                </div>
                <div>
                  Start Time:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.startTime
                      ? moment(primeGameDetails.startTime).format(
                          'DD-MM-YYYY hh:mm:ss A'
                        )
                      : 'NA'}
                  </strong>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={12}>
                <div>
                  Game Id:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.gameId
                      ? primeGameDetails.gameId
                      : 'NA'}
                  </strong>
                </div>
                <div>
                  Lobby Id:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.lobbyId
                      ? primeGameDetails.lobbyId
                      : 'NA'}
                  </strong>
                </div>
                <div>
                  Tournament Id:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.tournamentId
                      ? primeGameDetails.tournamentId
                      : 'NA'}
                  </strong>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  Entry Fee:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.entryFee
                      ? primeGameDetails.entryFee
                      : 'NA'}
                  </strong>
                </div>
                <div>
                  Start Time:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.startTime
                      ? moment(primeGameDetails.startTime).format(
                          'DD-MM-YYYY hh:mm:ss A'
                        )
                      : 'NA'}
                  </strong>
                </div>
                <div>
                  End Time:
                  <strong>
                    {primeGameDetails &&
                    Object.keys(primeGameDetails).length > 0 &&
                    primeGameDetails.endTime
                      ? moment(primeGameDetails.endTime).format(
                          'DD-MM-YYYY hh:mm:ss A'
                        )
                      : 'NA'}
                  </strong>
                </div>
              </Col>
            </Row>
          )}
        </Modal>
        <Modal
          title={'Saving Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          visible={this.state.primeSavingModal}
          onCancel={() => this.setState({ primeSavingModal: false })}
          footer={[
            <Button
              key="ko-user-close"
              onClick={() => this.setState({ primeSavingModal: false })}
            >
              Close
            </Button>
          ]}
        >
          <Row>
            <Col span={12}>
              <div>
                Total Benefit Amount:
                <strong>
                  {primeSavings.totalBenefitAmount
                    ? primeSavings.totalBenefitAmount.toFixed(2)
                    : 0}
                </strong>
              </div>
              <div>
                Extra Winnings:{' '}
                <strong>
                  {primeSavings.benefitTypeAmount
                    ? primeSavings.benefitTypeAmount.EXTRA_WINNING.toFixed(2)
                    : 0}
                </strong>
              </div>

              <div>
                Ticket Savings:{' '}
                <strong>
                  {primeSavings.benefitTypeAmount
                    ? primeSavings.benefitTypeAmount.TICKET_ENTRY.toFixed(2)
                    : 0}
                </strong>
              </div>
            </Col>
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    primeGameDetails: state.crm.primeGameDetails,
    userPrimeSubscriptionRes: state.crm.userPrimeSubscriptionRes,
    primeTicketHistory: state.offers.primeTicketHistory,
    primeUserSavings: state.crm.primeUserSavings,
    primeContest: state.crm.primeContest
  };
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...crmActions, ...offerActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrimeSelection);
