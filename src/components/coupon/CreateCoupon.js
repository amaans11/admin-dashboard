// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Input,
  Tooltip,
  DatePicker,
  Icon,
  Select,
  Button,
  Radio,
  InputNumber,
  message
} from 'antd';
import moment from 'moment';
import * as couponActions from '../../actions/couponActions';
// type CreateCoupon ={}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Option = Select.Option;
// const format = "hh:mm A";
const appType = ['ALL', 'CASH', 'PLAY_STORE', 'PWA_NDTV', 'IOS'].map(
  (val, index) => (
    <Option value={val} key={val}>
      {val}
    </Option>
  )
);
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class CreateCoupon extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  state = { selectedTime: {} };
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.code.length < 8) {
          message.error('Coupon Code should be at least of 8 characters');
          return;
        }
        values.rewardAmountv2 = values.rewardAmount;
        values.validFrom = moment(values.validFrom).toISOString();
        values.validTill = moment(values.validTill).toISOString();
        delete values.rewardAmount;
        this.props.actions.createCoupon(values).then(() => {
          this.props.history.push('/coupon/search');
        });
      }
    });
  };
  render() {
    const onDateChange = e => {
      let startDate = e;
      this.setState({
        selectedDate: startDate
      });
    };

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
    const campaignError =
      isFieldTouched('campaign') && getFieldError('campaign');
    const codeError = isFieldTouched('code') && getFieldError('code');
    const descriptionError =
      isFieldTouched('description') && getFieldError('description');
    const rewardAmountError =
      isFieldTouched('rewardAmount') && getFieldError('rewardAmount');
    const rewardCurrencyError =
      isFieldTouched('rewardCurrency') && getFieldError('rewardCurrency');
    const redeemableOnError =
      isFieldTouched('redeemableOn') && getFieldError('redeemableOn');
    const maxRedemptionsError =
      isFieldTouched('maxRedemptions') && getFieldError('maxRedemptions');
    const validTillError =
      isFieldTouched('validTill') && getFieldError('validTill');
    const validFromError =
      isFieldTouched('validFrom') && getFieldError('validFrom');
    const countryCodeError =
      isFieldTouched('countryCode') && getFieldError('countryCode');
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Basic Details">
            <FormItem
              validateStatus={campaignError ? 'error' : ''}
              help={campaignError || ''}
              {...formItemLayout}
              label={
                <span>
                  Campaign Code
                  <Tooltip title="Campaign group for coupon code">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('campaign', {
                rules: [
                  {
                    required: false,
                    message: 'Please input valid campaign code!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={codeError ? 'error' : ''}
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
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: 'Please input Coupon Code!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={descriptionError ? 'error' : ''}
              help={descriptionError || ''}
              {...formItemLayout}
              label={
                <span>
                  Coupon Description
                  <Tooltip title="Description for Coupon, internal purposes only">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: false,
                    message: 'Please input group description!',
                    whitespace: true
                  }
                ],
                initialValue: ''
              })(<TextArea rows={3} />)}
            </FormItem>
            <FormItem
              validateStatus={rewardCurrencyError ? 'error' : ''}
              help={rewardCurrencyError || ''}
              {...formItemLayout}
              label={
                <span>
                  Reward Currency
                  <Tooltip title="Cash or Token">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('rewardCurrency', {
                rules: [
                  {
                    required: true,
                    type: 'string',
                    message: 'Please select the Currency!',
                    whitespace: false
                  }
                ]
              })(
                <RadioGroup>
                  <Radio value="CASH">Cash</Radio>
                  <Radio value="TOKEN">Token</Radio>
                  <Radio value="DEPOSIT_CASH">Deposit Cash</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={rewardAmountError ? 'error' : ''}
              help={rewardAmountError || ''}
              {...formItemLayout}
              label={
                <span>
                  Reward Amount
                  <Tooltip title="Reward amountv to be redeemable">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('rewardAmount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input Reward Amountn!',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled={this.state.disableField} min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={maxRedemptionsError ? 'error' : ''}
              help={maxRedemptionsError || ''}
              {...formItemLayout}
              label={
                <span>
                  Maximum Redemptions
                  <Tooltip title="Time in minutes before Tournament End Time when users can start registering">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('maxRedemptions', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled={this.state.disableField} min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={validFromError ? 'error' : ''}
              help={validFromError || ''}
              {...formItemLayout}
              label={
                <span>
                  Valid From
                  <Tooltip title="Date for Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('validFrom', {
                rules: [
                  {
                    required: true,
                    type: 'object',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ],
                initialValue: moment()
                  .subtract(moment().hours(), 'hours')
                  .subtract(moment().minutes(), 'minutes')
              })(
                <DatePicker
                  allowClear="true"
                  showTime
                  format="YYYY-MM-DD hh:mm A"
                  disabled={this.state.disableField}
                  onChange={onDateChange}
                  placeholder={'Select Date'}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={validTillError ? 'error' : ''}
              help={validTillError || ''}
              {...formItemLayout}
              label={
                <span>
                  Valid Till
                  <Tooltip title="Date for Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('validTill', {
                rules: [
                  {
                    required: true,
                    type: 'object',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ],
                initialValue: moment()
                  .subtract(moment().hours(), 'hours')
                  .subtract(moment().minutes(), 'minutes')
                  .add(1, 'day')
              })(
                <DatePicker
                  allowClear="true"
                  showTime
                  format="YYYY-MM-DD hh:mm A"
                  disabled={this.state.disableField}
                  onChange={onDateChange}
                  placeholder={'Select Date'}
                />
              )}
            </FormItem>

            <FormItem
              validateStatus={redeemableOnError ? 'error' : ''}
              help={redeemableOnError || ''}
              {...formItemLayout}
              label={
                <span>
                  Select App type for Coupon
                  <Tooltip title="Select type for App">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('redeemableOn', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: 'Please select app type!'
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select type of app"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {appType}
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={countryCodeError ? 'error' : ''}
              help={countryCodeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Country Code
                  <Tooltip title="India or Indonesia">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: true,
                    type: 'string',
                    message: 'Please select the Country!',
                    whitespace: false
                  }
                ]
              })(
                <RadioGroup>
                  <Radio value="IN">India</Radio>
                  <Radio value="ID">Indonesia</Radio>
                  <Radio value="US">United States</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Register
            </Button>
          </Card>
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

const CreateCouponForm = Form.create()(CreateCoupon);
export default connect(mapStateToProps, mapDispatchToProps)(CreateCouponForm);
