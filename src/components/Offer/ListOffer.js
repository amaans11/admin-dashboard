import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as offerActions from '../../actions/offerActions';
import {
  Card,
  Table,
  Button,
  message,
  DatePicker,
  Popconfirm,
  Icon,
  Radio
} from 'antd';
import moment from 'moment';

class ListOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      pageNumber: 1,
      pageLimit: 1000,
      totalPage: null,
      tableData: [],
      countryCode: 'IN'
    };
    this.udpateRecord = this.udpateRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
  }
  componentDidMount() {
    this.getAllOffers();
  }

  countryChanged(value) {
    this.setState({ countryCode: value }, () => {
      this.getAllOffers();
    });
  }

  getAllOffers() {
    let data = {
      pageNumber: this.state.pageNumber,
      pageLimit: this.state.pageLimit,
      countryCode: this.state.countryCode
    };
    this.props.actions.getGlobalCouponList(data).then(() => {
      if (this.props.offers && this.props.offers.getGlobalCouponListResponse) {
        if (this.props.offers.getGlobalCouponListResponse.error) {
          message.error(
            this.props.offers.getGlobalCouponListResponse.error.message
          );
        } else {
          this.setState({
            tableData:
              this.props.offers.getGlobalCouponListResponse.globalCoupons &&
              this.props.offers.getGlobalCouponListResponse.globalCoupons
                .length > 0
                ? [
                    ...this.props.offers.getGlobalCouponListResponse
                      .globalCoupons
                  ]
                : [],
            totalPage:
              this.props.offers.getGlobalCouponListResponse.totalPage &&
              this.props.offers.getGlobalCouponListResponse.totalPage.low
                ? this.props.offers.getGlobalCouponListResponse.totalPage.low
                : 0
          });
        }
      }
      this.setState({
        showTable: true
      });
    });
  }

  udpateRecord(record, flag) {
    let data = {
      isActive: flag,
      minTransactionAmount: record.minTransactionAmount,
      toBalance: record.toBalance,
      couponType: record.couponType,
      theme: record.theme,
      expireAt: moment(record.expireAt, 'x').unix(),
      maxCashback: record.maxCashback,
      couponCode: record.couponCode,
      countryCode: record.countryCode
    };
    this.props.actions.updateGlobalCoupon(data).then(() => {
      if (this.props.offers && this.props.offers.updateGlobalCouponResponse) {
        if (this.props.offers.updateGlobalCouponResponse.error) {
          message.error(
            this.props.offers.updateGlobalCouponResponse.error.message
          );
        } else {
          message.success('Updated Successfully');
          window.location.reload();
        }
      }
    });
  }

  editRecord(record) {
    this.props.actions.editOffers(record);
    this.props.history.push('/offers/create');
  }

  render() {
    const columns = [
      {
        title: 'Offer Name',
        key: 'offerName',
        dataIndex: 'offerName'
      },
      {
        title: 'Minimum Transaction Amount',
        key: 'minTransactionAmount',
        dataIndex: 'minTransactionAmount'
      },
      {
        title: 'Discount Percentage',
        key: 'discountPercentage',
        dataIndex: 'discountPercentage'
      },
      {
        title: 'Is Active',
        key: 'isActive',
        render: record => <span>{record.isActive ? 'True' : 'False'}</span>
      },
      {
        title: 'Expire At',
        key: 'expireAt',
        render: record => (
          <span>
            {moment(record.expireAt, 'x').format('DD MMM YYYY hh:mm a')}
          </span>
          // <span>{moment(record.expireAt).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'Total Redeem Count',
        key: 'totalRedeemCount',
        dataIndex: 'totalRedeemCount'
      },
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
        title: 'Coupon Type',
        key: 'couponType',
        dataIndex: 'couponType'
      },
      {
        title: 'To balance',
        key: 'toBalance',
        dataIndex: 'toBalance'
      },
      {
        title: 'Theme',
        key: 'theme',
        dataIndex: 'theme'
      },
      {
        title: 'Country Code',
        key: 'countryCode',
        dataIndex: 'countryCode'
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            <Button
              shape="circle"
              icon="edit"
              onClick={() => this.editRecord(record)}
              type="primary"
            />
            {!record.isActive ? (
              <Button
                shape="circle"
                style={{ backgroundColor: '#32CD32' }}
                onClick={() => this.udpateRecord(record, true)}
              >
                <Icon type="check-circle" />
              </Button>
            ) : (
              <Popconfirm
                title="Sure to deactivate this offer?"
                onConfirm={() => this.udpateRecord(record, false)}
              >
                <Button
                  shape="circle"
                  style={{
                    backgroundColor: '#d62a2a',
                    color: 'white'
                  }}
                >
                  <Icon type="close-circle" />
                </Button>
              </Popconfirm>
            )}
          </span>
        )
      }
    ];
    return (
      <React.Fragment>
        <Card>
          <Radio.Group
            value={this.state.countryCode}
            onChange={e => this.countryChanged(e.target.value)}
          >
            <Radio value="IN">India</Radio>
            <Radio value="ID">Indonesia</Radio>
            <Radio value="US">US</Radio>
          </Radio.Group>
        </Card>
        {this.state.showTable ? (
          <Card>
            <Table
              rowKey="id"
              pagination={false}
              bordered
              dataSource={this.state.tableData}
              columns={columns}
            />
          </Card>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    offers: state.offers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...offerActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListOffer);
