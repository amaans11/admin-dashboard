import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as offerActions from '../../actions/offerActions';
import { Helmet } from 'react-helmet';
import {
  Card,
  Select,
  Form,
  Input,
  Button,
  InputNumber,
  Row,
  Col,
  Radio,
  message,
  DatePicker
} from 'antd';
import moment from 'moment';
// import moment from 'moment-timezone';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const couponTypeList = [
  <Option key="hot" value="hot">
    Hot
  </Option>,
  <Option key="normal" value="normal">
    Normal
  </Option>
];

const toBalanceList = [
  <Option key="Deposit" value="Deposit">
    Deposit
  </Option>,
  <Option key="Bonus" value="Bonus">
    Bonus
  </Option>
];

const themeList = [
  <Option key="blue" value="blue">
    Blue
  </Option>,
  <Option key="green" value="green">
    Green
  </Option>,
  <Option key="orange" value="orange">
    Orange
  </Option>,
  <Option key="red" value="red">
    Red
  </Option>,
  <Option key="none" value="none">
    None
  </Option>
];

const expireDurationList = [
  0.5,
  1,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  4.5,
  5,
  5.5,
  6,
  6.5,
  7,
  7.5,
  8,
  8.5,
  9,
  9.5,
  10,
  10.5,
  11,
  11.5,
  12,
  12.5,
  13,
  13.5,
  14,
  14.5,
  15,
  15.5,
  16,
  16.5,
  17,
  17.5,
  18,
  18.5,
  19,
  19.5,
  20,
  20.5,
  21,
  21.5,
  22,
  22.5,
  23,
  23.5,
  24
].map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offerName: '',
      minTransactionAmount: 1,
      discountPercentage: 5,
      isActive: false,
      expireAt: null, //
      totalRedeemCount: 1,
      couponCode: '',
      maxCashback: 50,
      couponType: '',
      toBalance: '',
      theme: '',
      isEdit: false,
      showDateSelector: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    if (this.props.offers && this.props.offers.offersData) {
      this.setState({ isEdit: true });
      this.setState({
        expireAt: moment(this.props.offers.offersData.expireAt, 'x')
      });
      this.props.form.setFieldsValue({
        offerName: this.props.offers.offersData.offerName,
        minTransactionAmount: this.props.offers.offersData.minTransactionAmount,
        discountPercentage: this.props.offers.offersData.discountPercentage,
        isActive: false,
        expireAt: moment(this.props.offers.offersData.expireAt, 'x'),
        totalRedeemCount: this.props.offers.offersData.totalRedeemCount,
        couponCode: this.props.offers.offersData.couponCode,
        maxCashback: this.props.offers.offersData.maxCashback,
        couponType: this.props.offers.offersData.couponType,
        toBalance: this.props.offers.offersData.toBalance,
        theme: this.props.offers.offersData.theme,
        countryCode: this.props.offers.offersData.countryCode
      });
    }
  }

  dateTimeSelected(value) {
    this.setState({
      expireAt: moment(value.toISOString()).unix()
    });
  }

  durationSelected(value) {
    let currentTime = moment();
    let expireAt = currentTime.add(value, 'h');
    this.setState({
      expireAt: moment(expireAt.toISOString()).unix()
    });
  }

  expireOptionSelect(value) {
    this.setState({ showDateSelector: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.couponCode.toString().length > 10) {
          message.error('Coupon code can be of max 10 length!');
          return;
        }
        let data = {
          offerName: values.offerName,
          minTransactionAmount: values.minTransactionAmount,
          discountPercentage: values.discountPercentage,
          isActive: values.isActive,
          expireAt: this.state.expireAt,
          totalRedeemCount: values.totalRedeemCount,
          couponCode: values.couponCode,
          maxCashback: values.maxCashback,
          couponType: values.couponType,
          toBalance: values.toBalance,
          theme: values.theme,
          countryCode: values.countryCode
        };

        if (this.state.isEdit) {
          this.props.actions.updateGlobalCoupon(data).then(() => {
            if (
              this.props.offers &&
              this.props.offers.updateGlobalCouponResponse
            ) {
              if (this.props.offers.updateGlobalCouponResponse.error) {
                message.error(
                  this.props.offers.updateGlobalCouponResponse.error.message
                );
              } else {
                message.success('Updated Successfully');
                this.props.history.push('/offers/list');
              }
            }
          });
        } else {
          this.props.actions.createGlobalCoupon(data).then(() => {
            if (
              this.props.offers &&
              this.props.offers.createGlobalCouponResponse
            ) {
              if (this.props.offers.createGlobalCouponResponse.error) {
                message.error(
                  this.props.offers.createGlobalCouponResponse.error.message
                );
              } else {
                message.success('Created Successfully');
                this.props.history.push('/offers/list');
              }
            }
          });
        }
      }
    });
  }

  render() {
    const fixedFeildLayoutHalf = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      offerName: isFieldTouched('offerName') && getFieldError('offerName'),
      minTransactionAmount:
        isFieldTouched('minTransactionAmount') &&
        getFieldError('minTransactionAmount'),
      discountPercentage:
        isFieldTouched('discountPercentage') &&
        getFieldError('discountPercentage'),
      isActive: isFieldTouched('isActive') && getFieldError('isActive'),
      expireAt: isFieldTouched('expireAt') && getFieldError('expireAt'),
      expiryDuration:
        isFieldTouched('expiryDuration') && getFieldError('expiryDuration'),
      totalRedeemCount:
        isFieldTouched('totalRedeemCount') && getFieldError('totalRedeemCount'),
      couponCode: isFieldTouched('couponCode') && getFieldError('couponCode'),
      maxCashback:
        isFieldTouched('maxCashback') && getFieldError('maxCashback'),
      couponType: isFieldTouched('couponType') && getFieldError('couponType'),
      toBalance: isFieldTouched('toBalance') && getFieldError('toBalance'),
      theme: isFieldTouched('theme') && getFieldError('theme'),
      countryCode: isFieldTouched('countryCode') && getFieldError('countryCode')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Offers | Admin Dashboard</title>
        </Helmet>
        <Card title="Offers">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.offerName ? 'error' : ''}
                  help={errors.offerName || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Offer Name</span>}
                >
                  {getFieldDecorator('offerName', {
                    initialValue: this.state.offerName,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field',
                        whitespace: true
                      }
                    ]
                  })(<Input disabled={this.state.isEdit} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.minTransactionAmount ? 'error' : ''}
                  help={errors.minTransactionAmount || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Min Transaction Amount</span>}
                >
                  {getFieldDecorator('minTransactionAmount', {
                    initialValue: this.state.minTransactionAmount,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        whitespace: true
                      }
                    ]
                  })(<InputNumber disabled={this.state.isEdit} min={0} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.discountPercentage ? 'error' : ''}
                  help={errors.discountPercentage || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Discount Percentage</span>}
                >
                  {getFieldDecorator('discountPercentage', {
                    initialValue: this.state.discountPercentage,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        whitespace: true
                      }
                    ]
                  })(<InputNumber disabled={this.state.isEdit} min={0} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...fixedFeildLayoutHalf}
                  label={<span>Is Active</span>}
                >
                  {getFieldDecorator('isActive', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ],
                    initialValue: this.state.isActive
                  })(
                    <RadioGroup size="small" buttonStyle="solid">
                      <Radio.Button value={true}>YES</Radio.Button>
                      <Radio.Button value={false}>NO</Radio.Button>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...fixedFeildLayoutHalf}
                  label={<span>Toggle Expiry Duration/Date</span>}
                >
                  {getFieldDecorator('showDateSelector', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ],
                    initialValue: this.state.showDateSelector
                  })(
                    <RadioGroup
                      onChange={e => this.expireOptionSelect(e.target.value)}
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button value={false}>Enter Duration</Radio.Button>
                      <Radio.Button value={true}>Enter Date</Radio.Button>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              {this.state.showDateSelector ? (
                <Col span={12}>
                  <FormItem
                    validateStatus={errors.expireAt ? 'error' : ''}
                    help={errors.expireAt || ''}
                    {...fixedFeildLayoutHalf}
                    label={<span>Expire At</span>}
                  >
                    {getFieldDecorator('expireAt', {
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
                        onChange={e => this.dateTimeSelected(e)}
                        showTime={{ format: 'hh:mm A', use12Hours: true }}
                        format="YYYY-MM-DD hh:mm A"
                      />
                    )}
                  </FormItem>
                </Col>
              ) : (
                <Col span={12}>
                  <FormItem
                    validateStatus={errors.expiryDuration ? 'error' : ''}
                    help={errors.expiryDuration || ''}
                    {...fixedFeildLayoutHalf}
                    label={<span>Expire In ( in hours )</span>}
                  >
                    {getFieldDecorator('expiryDuration', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message: 'Please select one!',
                          whitespace: false
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        onSelect={e => this.durationSelected(e)}
                        style={{ width: 200 }}
                        placeholder="Select expire duration"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toString
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {expireDurationList}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              )}

              <Col span={12}>
                <FormItem
                  validateStatus={errors.totalRedeemCount ? 'error' : ''}
                  help={errors.totalRedeemCount || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Total Redeem Count</span>}
                >
                  {getFieldDecorator('totalRedeemCount', {
                    initialValue: this.state.totalRedeemCount,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        whitespace: true
                      }
                    ]
                  })(<InputNumber disabled={this.state.isEdit} min={0} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.couponCode ? 'error' : ''}
                  help={errors.couponCode || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Coupon Code</span>}
                >
                  {getFieldDecorator('couponCode', {
                    initialValue: this.state.couponCode,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field',
                        whitespace: true
                      }
                    ]
                  })(<Input disabled={this.state.isEdit} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.maxCashback ? 'error' : ''}
                  help={errors.maxCashback || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Max Cashback</span>}
                >
                  {getFieldDecorator('maxCashback', {
                    initialValue: this.state.maxCashback,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        whitespace: true
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.couponType ? 'error' : ''}
                  help={errors.couponType || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Coupon Type</span>}
                >
                  {getFieldDecorator('couponType', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select one!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Coupon Type"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {couponTypeList}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.toBalance ? 'error' : ''}
                  help={errors.toBalance || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>To Balance</span>}
                >
                  {getFieldDecorator('toBalance', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select one!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="To Balance"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {toBalanceList}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.theme ? 'error' : ''}
                  help={errors.theme || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Theme</span>}
                >
                  {getFieldDecorator('theme', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select one!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Theme"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {themeList}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.countryCode ? 'error' : ''}
                  help={errors.countryCode || ''}
                  {...fixedFeildLayoutHalf}
                  label={<span>Country Code</span>}
                >
                  {getFieldDecorator('countryCode', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select one!',
                        whitespace: false
                      }
                    ]
                  })(
                    <RadioGroup>
                      <Radio value="IN">India</Radio>
                      <Radio value="ID">Indonesia</Radio>
                      <Radio value="US">US</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={6} offset={6}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
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
const CreateOfferForm = Form.create()(CreateOffer);
export default connect(mapStateToProps, mapDispatchToProps)(CreateOfferForm);
