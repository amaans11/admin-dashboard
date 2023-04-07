import React from 'react';
import {
  Card,
  Table,
  Pagination,
  Button,
  message,
  Tag,
  Select,
  Row,
  Col
} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as offerActions from '../../actions/offerActions';

const couponTypes = [
  {
    label: 'Tournament Ticket Coupon',
    value: 'TOURNAMENT_TICKET_COUPON'
  },
  {
    label: 'Tournament Ticket Voucher',
    value: 'TOURNAMENT_TICKET_VOUCHER'
  },
  {
    label: 'Season Pass',
    value: 'SEASON_PASS'
  },
  {
    label: 'Prime Tournament Ticket',
    value: 'PRIME_TOURNAMENT_TICKET_COUPON'
  }
];
const Option = Select.Option;

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));
class ListTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      pageNumber: 1,
      pageLimit: 10,
      totalCount: 1,
      offerType: '',
      selectedCouponType: '',
      countryCode: 'ID'
    };
  }
  onPageChange = page => {
    this.setState(
      {
        pageNumber: page
      },
      () => {
        this.fetchTickets();
      }
    );
  };
  fetchTickets = () => {
    const {
      pageNumber,
      pageLimit,
      selectedCouponType,
      countryCode
    } = this.state;

    const data = {
      pageNumber,
      pageLimit,
      offerType: selectedCouponType,
      countryCode
    };
    this.props.actions.fetchTickets(data).then(() => {
      if (
        this.props.tournamentTickets &&
        Object.keys(this.props.tournamentTickets).length > 0
      ) {
        if (this.props.tournamentTickets.error) {
          const message = this.props.tournamentTickets.error
            ? this.props.tournamentTickets.error.message
            : 'Unable to fetch tickets';
          message.error(message);
        } else {
          if (this.props.tournamentTickets.tournamentTicketOffers.length > 0) {
            this.setState({
              tickets: this.props.tournamentTickets.tournamentTicketOffers
            });
          } else {
            this.setState({
              tickets: []
            });
          }
        }
      } else {
        this.setState(
          {
            tickets: []
          },
          () => {
            message.error('Unable to fetch ticketc');
          }
        );
      }
    });
  };
  selectCountry(value) {
    const { selectedCouponType } = this.state;
    this.setState(
      {
        countryCode: value
      },
      () => {
        if (selectedCouponType) {
          this.fetchTickets();
        } else {
          message.error('Please select Coupon Type');
        }
      }
    );
  }
  onUpdateStatusHandler = record => {
    const { countryCode } = this.state;
    let data = {
      couponCode: record.offerCode,
      couponType: record.offerType,
      couponExpiry: record.offerExpiry,
      couponDetails: record.offerDetails,
      isActive: !record.isActive,
      countryCode: countryCode
    };
    this.props.actions.createTicket(data).then(() => {
      if (this.props.createTicketResponse.error) {
        message.error('Unable to update!');
      } else {
        message.success('Status Updated Successfully');
        this.fetchTickets();
      }
    });
  };
  onCouponTypeChange = value => {
    this.setState(
      {
        selectedCouponType: value
      },
      () => {
        this.fetchTickets();
      }
    );
  };
  getColumns = () => {
    const columns = [
      {
        title: 'Coupon Code',
        key: 'offerCode',
        dataIndex: 'offerCode'
      },
      {
        title: 'Coupon Type',
        key: 'offerType',
        render: record => <span>TOURNAMENT_TICKET_COUPON</span>
      },
      {
        title: 'Coupon Expiry',
        key: 'offerExpiry',
        render: record => (
          <span>
            {moment(record.offerExpiry, 'x').format('DD MMM YYYY hh:mm:ss A')}
          </span>
        )
      },
      {
        title: 'Min Deposit Amount',
        key: 'minDepositAmount',
        render: record => <span>{record.offerDetails.minDepositAmount}</span>
      },
      {
        title: 'Business Domain',
        key: 'businessDomain',
        render: record => <span>{record.offerDetails.businessDomain}</span>
      },
      {
        title: 'Ticket Value',
        key: 'ticketValue',
        render: record => <span>{record.offerDetails.ticketValue}</span>
      },
      {
        title: 'Expiry(in minutes)',
        key: 'expiryInMinutes',
        render: record => <span>{record.offerDetails.expiryInMinutes}</span>
      },
      {
        title: 'Total Redeem Count',
        key: 'totalRedeemCount',
        render: record => <span>{record.offerDetails.totalRedeemCount}</span>
      },
      {
        title: 'Status',
        key: 'status',
        render: record => (
          <span>
            {record.isActive ? (
              <Tag color="#2db7f5">active</Tag>
            ) : (
              <Tag color="#f50">inactive</Tag>
            )}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            <Button
              size="small"
              type="primary"
              style={{ marginBottom: 2 }}
              onClick={() => {
                this.props.history.push({
                  pathname: '/tournament-ticket/create',
                  state: { record }
                });
              }}
            >
              Edit Ticket
            </Button>
            <Button
              size="small"
              onClick={() => this.onUpdateStatusHandler(record)}
            >
              {!record.isActive ? 'Activate Ticket' : 'Deactivate Ticket'}
            </Button>
          </span>
        )
      }
    ];
    return columns;
  };
  getPrimeColumns = () => {
    const columns = [
      {
        title: 'Coupon Code',
        key: 'offerCode',
        dataIndex: 'offerCode'
      },
      {
        title: 'Coupon Type',
        key: 'offerType',
        render: record => <span>PRIME_TOURNAMENT_TICKET_COUPON</span>
      },
      {
        title: 'Coupon Expiry',
        key: 'offerExpiry',
        render: record => (
          <span>
            {moment(record.offerExpiry, 'x').format('DD MMM YYYY hh:mm:ss A')}
          </span>
        )
      },
      {
        title: 'Min Deposit Amount',
        key: 'minDepositAmount',
        render: record => <span>{record.offerDetails.minDepositAmount}</span>
      },
      {
        title: 'Business Domain',
        key: 'businessDomain',
        render: record => <span>{record.offerDetails.businessDomain}</span>
      },
      {
        title: 'Ticket Value',
        key: 'ticketValue',
        render: record => <span>{record.offerDetails.ticketValue}</span>
      },
      {
        title: 'Expiry(in minutes)',
        key: 'expiryInMinutes',
        render: record => (
          <span>
            {record.offerDetails.expiryInMinutes
              ? record.offerDetails.expiryInMinutes
              : 'NA'}
          </span>
        )
      },
      {
        title: 'Total Redeem Count',
        key: 'totalRedeemCount',
        render: record => (
          <span>
            {record.offerDetails.totalRedeemCount
              ? record.offerDetails.totalRedeemCount
              : 'NA'}
          </span>
        )
      },
      {
        title: 'Status',
        key: 'status',
        render: record => (
          <span>
            {record.isActive ? (
              <Tag color="#2db7f5">active</Tag>
            ) : (
              <Tag color="#f50">inactive</Tag>
            )}
          </span>
        )
      },
      {
        title: 'Visible At',
        key: 'visibleAt',
        render: record => (
          <span>
            {record.visibleAt
              ? moment(record.visibleAt, 'x').format('DD MMM YYYY hh:mm:ss A')
              : 'NA'}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            <Button
              size="small"
              type="primary"
              style={{ marginBottom: 2 }}
              onClick={() => {
                this.props.history.push({
                  pathname: '/tournament-ticket/create',
                  state: { record }
                });
              }}
            >
              Edit Ticket
            </Button>
            <Button
              size="small"
              onClick={() => this.onUpdateStatusHandler(record)}
            >
              {!record.isActive ? 'Activate Ticket' : 'Deactivate Ticket'}
            </Button>
          </span>
        )
      }
    ];
    return columns;
  };
  getTournamentVoucherColumns = () => {
    const columns = [
      {
        title: 'Coupon Code',
        key: 'offerCode',
        dataIndex: 'offerCode'
      },
      {
        title: 'Coupon Type',
        key: 'offerType',
        render: record => <span>TOURNAMENT_TICKET_VOUCHER</span>
      },
      {
        title: 'Coupon Expiry',
        key: 'offerExpiry',
        render: record => (
          <span>
            {moment(record.offerExpiry, 'x').format('DD MMM YYYY hh:mm:ss A')}
          </span>
        )
      },
      {
        title: 'Business Domain',
        key: 'businessDomain',
        render: record => <span>{record.offerDetails.businessDomain}</span>
      },
      {
        title: 'Actual Price',
        key: 'price',
        render: record => <span>{record.offerDetails.actualPrice}</span>
      },
      {
        title: 'Discounted Price',
        key: 'discountedPrice',
        render: record => (
          <span>
            {record.offerDetails.discountedPrice
              ? record.offerDetails.discountedPrice
              : 'NA'}
          </span>
        )
      },
      {
        title: 'Ticket Value',
        key: 'ticketValue',
        render: record => <span>{record.offerDetails.ticketValue}</span>
      },
      {
        title: 'Expiry(in minutes)',
        key: 'expiryInMinutes',
        render: record => <span>{record.offerDetails.expiryInMinutes}</span>
      },
      {
        title: 'Total Redeem Count',
        key: 'totalRedeemCount',
        render: record => <span>{record.offerDetails.totalRedeemCount}</span>
      },
      {
        title: 'Status',
        key: 'status',
        render: record => (
          <span>
            {record.isActive ? (
              <Tag color="#2db7f5">active</Tag>
            ) : (
              <Tag color="#f50">inactive</Tag>
            )}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            <Button
              size="small"
              type="primary"
              style={{ marginBottom: 2 }}
              onClick={() => {
                this.props.history.push({
                  pathname: '/tournament-ticket/create',
                  state: { record }
                });
              }}
            >
              Edit Ticket
            </Button>
            <Button
              size="small"
              onClick={() => this.onUpdateStatusHandler(record)}
            >
              {!record.isActive ? 'Activate Ticket' : 'Deactivate Ticket'}
            </Button>
          </span>
        )
      }
    ];
    return columns;
  };
  getSeasonPassColumns = () => {
    const columns = [
      {
        title: 'Coupon Code',
        key: 'offerCode',
        dataIndex: 'offerCode'
      },
      {
        title: 'Coupon Type',
        key: 'offerType',
        render: record => <span>SEASON_PASS</span>
      },
      {
        title: 'Coupon Expiry',
        key: 'offerExpiry',
        render: record => (
          <span>
            {moment(record.offerExpiry, 'x').format('DD MMM YYYY hh:mm:ss A')}
          </span>
        )
      },
      {
        title: 'Business Domain',
        key: 'businessDomain',
        render: record => <span>{record.offerDetails.businessDomain}</span>
      },
      {
        title: 'Title',
        key: 'title',
        render: record => <span>{record.offerDetails.title}</span>
      },
      {
        title: 'Sub Title',
        key: 'subTitle',
        render: record => <span>{record.offerDetails.subtitle}</span>
      },
      {
        title: 'Description',
        key: 'description',
        render: record => <span>{record.offerDetails.description}</span>
      },
      {
        title: 'Modal Description',
        key: 'modal_description',
        render: record => <span>{record.offerDetails.modalDescription}</span>
      },
      {
        title: 'Sport Id',
        key: 'sportId',
        render: record => (
          <span>
            {record.offerDetails.sportId ? record.offerDetails.sportId : 'NA'}
          </span>
        )
      },
      {
        title: 'League Id',
        key: 'leagueId',
        render: record => (
          <span>
            {record.offerDetails.leagueId ? record.offerDetails.leagueId : 'NA'}
          </span>
        )
      },

      {
        title: 'Actual Price',
        key: 'price',
        render: record => <span>{record.offerDetails.price}</span>
      },
      {
        title: 'Discounted Price',
        key: 'discountedPrice',
        render: record => (
          <span>
            {record.offerDetails.discountedPrice
              ? record.offerDetails.discountedPrice
              : 'NA'}
          </span>
        )
      },
      {
        title: 'Status',
        key: 'status',
        render: record => (
          <span>
            {record.isActive ? (
              <Tag color="#2db7f5">active</Tag>
            ) : (
              <Tag color="#f50">inactive</Tag>
            )}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            <Button
              size="small"
              type="primary"
              style={{ marginBottom: 2 }}
              onClick={() => {
                this.props.history.push({
                  pathname: '/tournament-ticket/create',
                  state: { record, countryCode: this.state.countryCode }
                });
              }}
            >
              Edit Ticket
            </Button>
            <Button
              size="small"
              onClick={() => this.onUpdateStatusHandler(record)}
            >
              {!record.isActive ? 'Activate Ticket' : 'Deactivate Ticket'}
            </Button>
          </span>
        )
      }
    ];
    return columns;
  };
  render() {
    const columns = this.getColumns();
    const seasonPassColumns = this.getSeasonPassColumns();
    const voucherColumns = this.getTournamentVoucherColumns();
    const primeColumns = this.getPrimeColumns();

    const {
      pageNumber,
      pageLimit,
      totalCount,
      tickets,
      selectedCouponType,
      countryCode
    } = this.state;
    return (
      <div>
        <Row style={{ margin: 20 }}>
          <Col sm={6}>
            <label>Select Coupon Type : </label>
            <Select
              style={{ width: 200 }}
              defaultValue="Tournament_Ticket_Coupon"
              onChange={this.onCouponTypeChange}
              value={this.state.selectedCouponType}
            >
              {couponTypes.map(type => (
                <Option value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Col>
          <Col sm={6}>
            <label>Select Country : </label>
            <Select
              showSearch
              onSelect={e => this.selectCountry(e)}
              style={{ width: 200 }}
              placeholder="Select country"
              value={countryCode}
            >
              {CountryList}
            </Select>
          </Col>
        </Row>
        {this.state.selectedCouponType && (
          <Card title={'Tournament Ticket List'}>
            <Table
              rowKey="id"
              bordered
              dataSource={tickets}
              columns={
                selectedCouponType === 'PRIME_TOURNAMENT_TICKET_COUPON'
                  ? primeColumns
                  : selectedCouponType === 'TOURNAMENT_TICKET_COUPON'
                  ? columns
                  : selectedCouponType === 'TOURNAMENT_TICKET_VOUCHER'
                  ? voucherColumns
                  : seasonPassColumns
              }
              pagination={false}
              scroll={{ x: '100%' }}
            />
            <Pagination
              current={pageNumber}
              defaultCurrent={pageNumber}
              onChange={page => this.onPageChange(page)}
              total={totalCount}
              pageSize={pageLimit}
              style={{ marginTop: 20 }}
            />
          </Card>
        )}
      </div>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    tournamentTickets: state.offers.tournamentTickets,
    createTicketResponse: state.offers.createTicketResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(offerActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ListTicket);
