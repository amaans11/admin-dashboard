// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Form, Input, Tooltip, Icon, Button } from 'antd';
import moment from 'moment';
import * as couponActions from '../../actions/couponActions';
// type SearchCoupon ={}
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class SearchCoupon extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  state = {
    showDetails: false
  };

  // "id":206031,"code":"TSBNASD","description":"aslkfdn","validFrom":"2018-11-14T12:45:31.482Z","validTill":"2018-11-23T10:45:14.739Z","maxRedemptions":10,"redeemableOn":"ALL","rewardCurrency":"CASH","rewardAmount":10,"createdOn":"2018-11-14T10:50:07.158Z"}
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.actions.getCouponDetails(values.couponCode).then(() => {
          if (this.props.coupon.couponDetails) {
            this.setState({
              showDetails: true
            });
          }
        });
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
    // Only show error after a field is touched.
    const couponCodeError =
      isFieldTouched('couponCode') && getFieldError('couponCode');
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Search Coupon Details">
            <FormItem
              validateStatus={couponCodeError ? 'error' : ''}
              {...formItemLayout}
              label={
                <span>
                  Coupon Code
                  <Tooltip title="Some Name tooltip">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('couponCode', {
                rules: [
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Search
            </Button>
          </Card>
          {this.state.showDetails ? (
            <Card className="coupon-details" title="Coupon Details">
              <div>
                <label htmlFor="">Campaign:</label>
                <span>{this.props.coupon.couponDetails.campaign}</span>
              </div>
              <div>
                <label htmlFor="">Code:</label>
                <span>{this.props.coupon.couponDetails.code}</span>
              </div>
              <div>
                <label htmlFor="">Description:</label>
                <span>{this.props.coupon.couponDetails.description}</span>
              </div>
              <div>
                <label htmlFor="">Valid From:</label>
                <span>
                  {moment(this.props.coupon.couponDetails.validFrom).format(
                    'DD-MM-YYYY hh:mm:ss A'
                  )}
                </span>
              </div>
              <div>
                <label htmlFor="">Valid Till:</label>
                <span>
                  {moment(this.props.coupon.couponDetails.validTill).format(
                    'DD-MM-YYYY hh:mm:ss A'
                  )}
                </span>
              </div>
              <div>
                <label htmlFor="">Max Redemptions:</label>
                <span>{this.props.coupon.couponDetails.maxRedemptions}</span>
              </div>

              <div>
                <label htmlFor="">Current Redemptions:</label>
                <span>
                  {this.props.coupon.couponDetails.currentRedemptions}
                </span>
              </div>
              <div>
                <label htmlFor="">Redeemable On:</label>
                <span>{this.props.coupon.couponDetails.redeemableOn}</span>
              </div>
              <div>
                <label htmlFor="">Reward Currency:</label>
                <span>{this.props.coupon.couponDetails.rewardCurrency}</span>
              </div>
              <div>
                <label htmlFor="">Reward Amount:</label>
                <span>
                  {Number(
                    this.props.coupon.couponDetails.rewardAmountv2
                  ).toFixed(2)}
                </span>
              </div>
              <div>
                <label htmlFor="">Created On:</label>
                <span>
                  {moment(this.props.coupon.couponDetails.createdOn).format(
                    'DD-MM-YYYY hh:mm:ss A'
                  )}
                </span>
              </div>
            </Card>
          ) : (
            ''
          )}
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    coupon: state.coupon
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(couponActions, dispatch)
  };
}

const SearchCouponForm = Form.create()(SearchCoupon);
export default connect(mapStateToProps, mapDispatchToProps)(SearchCouponForm);
