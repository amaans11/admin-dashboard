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
  InputNumber,
  message,
  Switch,
  Radio
} from 'antd';
import moment from 'moment';
import { get } from 'lodash';
import UploadSegment from '../../components/FileUploader/UploadSegment';
import * as offerActions from '../../actions/offerActions';

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

const FormItem = Form.Item;
const Option = Select.Option;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const styles = {
  notif: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20
  }
};
class BulkUserCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvFilePath: '',
      criteria: 'USER_COUPON',
      sendNotif: false,
      country: 'IN'
    };
  }

  handleNotifChange = value => {
    this.setState({
      sendNotification: value,
      sendNotif: false
    });
  };
  segmentUrlCallback = data => {
    this.setState({ csvFilePath: data.id, csvUploaded: true });
  };
  handleCriteriaChange = e => {
    this.props.form.setFieldsValue({
      offerName: '',
      minDepositAmount: '',
      cashbackPercentage: '',
      maxCashbackAmount: '',
      toBalance: '',
      couponExpiry: '',
      startTime: '',
      sendNotification: false,
      numberOfGlobalCoupon: '',
      color: '',
      maxRedeemCount: '',
      couponInitials: ''
    });
    this.setState({
      criteria: e.target.value
    });
  };
  handleSubmit = e => {
    const { csvFilePath, sendNotif, criteria, globalLimit } = this.state;
    const email = get(this.props.currentUser, 'email', '');
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!csvFilePath && criteria === 'USER_COUPON') {
          message.error('Please upload user csv file!');
          return;
        }
        if (moment().diff(moment(values.couponExpiry), 'minutes') >= 0) {
          message.error('Please enter valid coupon expiry date!');
          return;
        }
        if (moment().diff(moment(values.startTime), 'minutes') >= 0) {
          message.error('Please enter valid coupon start time!');
          return;
        }
        if (
          criteria !== 'USER_COUPON' &&
          values.couponInitials.toString().length > 5
        ) {
          message.error('Coupon Initials can be of max 5 length !');
          return;
        }
        if (
          moment(values.startTime).diff(
            moment(values.couponExpiry),
            'minutes'
          ) > 0
        ) {
          message.error('Start time cannot be greater than expiry date!');
          return;
        }

        const data = {
          csvFilePath: criteria === 'USER_COUPON' ? csvFilePath : '',
          offerName: values.offerName,
          minDepositAmount: values.minDepositAmount,
          cashbackPercentage: values.cashbackPercentage,
          maxCashbackAmount: values.maxCashbackAmount,
          toBalance: values.toBalance,
          couponExpiry: moment(values.couponExpiry).format('x'),
          startTime: moment(values.startTime).format('x'),
          sendNotification: criteria === 'USER_COUPON' ? sendNotif : false,
          createGlobalCoupon: criteria === 'USER_COUPON' ? false : true,
          numberOfGlobalCoupon:
            criteria !== 'USER_COUPON' ? values.numberOfGlobalCoupon : '',
          color: criteria !== 'USER_COUPON' ? values.color : '',
          maxRedeemCount:
            criteria !== 'USER_COUPON' ? values.maxRedeemCount : '',
          couponInitials:
            criteria !== 'USER_COUPON' ? values.couponInitials : '',
          creatorEmailId: email,
          countryCode: values.countryCode
        };
        this.props.actions.createBulkCoupon(data).then(() => {
          if (this.props.createBulkCouponResponse.error) {
            message.error(this.props.createBulkCouponResponse.error.message);
          } else {
            window.location.reload();
            message.success('Coupon uploaded successfully!', 10);
          }
        });
      }
    });
  };
  render() {
    const { criteria } = this.state;
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
    const offerNameError =
      isFieldTouched('offerName') && getFieldError('offerName');
    const minDepositAmountError =
      isFieldTouched('minDepositAmount') && getFieldError('minDepositAmount');
    const cashbackPercentageError =
      isFieldTouched('cashbackPercentage') &&
      getFieldError('cashbackPercentage');
    const maxCashbackAmountError =
      isFieldTouched('maxCashbackAmount') && getFieldError('maxCashbackAmount');
    const toBalanceError =
      isFieldTouched('toBalance') && getFieldError('toBalance');
    const couponExpiryError =
      isFieldTouched('couponExpiry') && getFieldError('couponExpiry');
    const startTimeError =
      isFieldTouched('startTime') && getFieldError('startTime');
    const sendNotificationError =
      isFieldTouched('sendNotification') && getFieldError('sendNotification');
    const numberOfGlobalCouponError =
      isFieldTouched('numberOfGlobalCoupon') &&
      getFieldError('numberOfGlobalCoupon');
    const colorError = isFieldTouched('color') && getFieldError('color');
    const maxRedeemCountError =
      isFieldTouched('maxRedeemCount') && getFieldError('maxRedeemCount');
    const couponInitialsError =
      isFieldTouched('couponInitials') && getFieldError('couponInitials');

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Add Coupon">
            <FormItem {...formItemLayout} label={'Criteria'}>
              {getFieldDecorator('criteria', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: criteria
              })(
                <Radio.Group
                  onChange={e => this.handleCriteriaChange(e)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={'USER_COUPON'}>
                    User Specific Coupon
                  </Radio.Button>
                  <Radio.Button value={'GLOBAL_COUPON'}>
                    Global Coupon
                  </Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={'Country Code'}>
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  style={{ width: 200 }}
                  onChange={value => {
                    this.setState({ country: value });
                  }}
                  value={this.state.country}
                >
                  <Option value="ID">ID</Option>
                  <Option value="IN">IN</Option>
                  <Option value="US">US</Option>
                </Select>
              )}
            </FormItem>
            {criteria === 'USER_COUPON' && (
              <FormItem {...formItemLayout} label={'User File'}>
                {getFieldDecorator('csvFile')(
                  <UploadSegment callbackFromParent={this.segmentUrlCallback} />
                )}
              </FormItem>
            )}
            <FormItem
              validateStatus={offerNameError ? 'error' : ''}
              help={offerNameError || ''}
              {...formItemLayout}
              label={<span>Offer Name</span>}
            >
              {getFieldDecorator('offerName', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: 'Please select offer name!'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={minDepositAmountError ? 'error' : ''}
              help={minDepositAmountError || ''}
              {...formItemLayout}
              label={<span>Min Deposit Amount</span>}
            >
              {getFieldDecorator('minDepositAmount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input min deposit amount!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={1} />)}
            </FormItem>

            <FormItem
              validateStatus={cashbackPercentageError ? 'error' : ''}
              help={cashbackPercentageError || ''}
              {...formItemLayout}
              label={<span>Cashback Percentage</span>}
            >
              {getFieldDecorator('cashbackPercentage', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input cashback percentage!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} max={100} />)}
            </FormItem>
            <FormItem
              validateStatus={maxCashbackAmountError ? 'error' : ''}
              help={maxCashbackAmountError || ''}
              {...formItemLayout}
              label={<span>Max Cashback Amount</span>}
            >
              {getFieldDecorator('maxCashbackAmount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input max cashback amount!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={1} />)}
            </FormItem>
            <FormItem
              validateStatus={toBalanceError ? 'error' : ''}
              help={toBalanceError || ''}
              {...formItemLayout}
              label={<span>Money Type</span>}
            >
              {getFieldDecorator('toBalance', {
                rules: [
                  {
                    required: true,
                    message: 'Please select money type!',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {['Deposit', 'Bonus'].map(type => (
                    <Option value={type}>{type}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={couponExpiryError ? 'error' : ''}
              help={couponExpiryError || ''}
              {...formItemLayout}
              label={<span>Coupon Expiry</span>}
            >
              {getFieldDecorator('couponExpiry', {
                rules: [
                  {
                    required: true,
                    type: 'object',
                    message: 'Please input coupon expiry!',
                    whitespace: false
                  }
                ]
              })(
                <DatePicker
                  allowClear="true"
                  showTime
                  format="YYYY-MM-DD hh:mm A"
                  placeholder={'Select Coupon Expiry'}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={startTimeError ? 'error' : ''}
              help={startTimeError || ''}
              {...formItemLayout}
              label={<span>Start Time</span>}
            >
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    type: 'object',
                    message: 'Please input startTime!',
                    whitespace: false
                  }
                ]
              })(
                <DatePicker
                  allowClear="true"
                  showTime
                  format="YYYY-MM-DD hh:mm A"
                  placeholder={'Select Start Time'}
                />
              )}
            </FormItem>
            {criteria === 'USER_COUPON' && (
              <FormItem
                validateStatus={sendNotificationError ? 'error' : ''}
                help={sendNotificationError || ''}
                {...formItemLayout}
                label={<span>Send Notification</span>}
              >
                {getFieldDecorator(
                  'sendNotification',
                  {}
                )(
                  <Switch
                    onChange={value => {
                      this.setState({ sendNotif: value });
                    }}
                    value={this.state.sendNotif}
                  />
                )}
              </FormItem>
            )}
            {criteria !== 'USER_COUPON' && (
              <FormItem
                validateStatus={numberOfGlobalCouponError ? 'error' : ''}
                help={numberOfGlobalCouponError || ''}
                {...formItemLayout}
                label={<span>Number Of Global Coupon</span>}
              >
                {getFieldDecorator('numberOfGlobalCoupon', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input number of global coupon!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            )}
            {criteria !== 'USER_COUPON' && (
              <FormItem
                validateStatus={colorError ? 'error' : ''}
                help={colorError || ''}
                {...formItemLayout}
                label={<span>Color</span>}
              >
                {getFieldDecorator('color', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input color!',
                      whitespace: false
                    }
                  ]
                })(
                  <Select
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {[
                      { label: 'Blue', value: 'blue' },
                      { label: 'Green', value: 'green' },
                      { label: 'Orange', value: 'orange' },
                      { label: 'Red', value: 'red' },
                      { label: 'None', value: 'none' }
                    ].map(type => (
                      <Option value={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
            {criteria !== 'USER_COUPON' && (
              <FormItem
                validateStatus={maxRedeemCountError ? 'error' : ''}
                help={maxRedeemCountError || ''}
                {...formItemLayout}
                label={<span>Max Redeem Count</span>}
              >
                {getFieldDecorator('maxRedeemCount', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input Max Redeem Count!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
            )}
            {criteria !== 'USER_COUPON' && (
              <FormItem
                validateStatus={couponInitialsError ? 'error' : ''}
                help={couponInitialsError || ''}
                {...formItemLayout}
                label={<span>Coupon Initials</span>}
              >
                {getFieldDecorator('couponInitials', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input coupon initials!',
                      whitespace: false
                    }
                  ]
                })(<Input />)}
              </FormItem>
            )}

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
    currentUser: state.auth.currentUser,
    createBulkCouponResponse: state.offers.createBulkCouponResponse,
    globalLimitConfig: state.offers.globalLimitConfig
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(offerActions, dispatch)
  };
}

const BulkUserCouponForm = Form.create()(BulkUserCoupon);
export default connect(mapStateToProps, mapDispatchToProps)(BulkUserCouponForm);
