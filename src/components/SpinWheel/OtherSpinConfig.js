import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as spinWheelActions from '../../actions/SpinWheelActions';
import {
  Card,
  Form,
  Button,
  Input,
  InputNumber,
  Radio,
  message,
  Row,
  Col,
  Select
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class OtherSpinConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      goldenWheelFinishPayoutCheck: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState({ loaded: false, countryCode: value }, () => {
      this.getMainSpinWheelConfigs();
    });
  }

  getMainSpinWheelConfigs() {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions
      .getMainSpinWheelConfigs(data)
      .then(() => {
        if (this.props.mainSpinWheelConfigResponse) {
          let config = JSON.parse(this.props.mainSpinWheelConfigResponse);
          this.setState({
            config: { ...config },
            loaded: true
          });
        } else {
          message.error('Could not load data. Please refresh the page');
        }
      })
      .catch(() => {
        message.error('Could not load data. Please refresh the page');
      });
  }

  jsonCheck(value) {
    if (value) {
      try {
        JSON.parse(value);
        this.setState({ goldenWheelFinishPayoutCheck: true });
        return true;
      } catch (error) {
        this.setState({ goldenWheelFinishPayoutCheck: false });
        return false;
      }
    } else {
      this.setState({ goldenWheelFinishPayoutCheck: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.state.goldenWheelFinishPayoutCheck) {
          message.error('Please enter a valid JSON');
          return;
        }
        let data = {
          countryCode: this.state.countryCode,
          timezone: values.timezone,
          segmentProviderOn: values.segmentProviderOn,
          trxnDescription: values.trxnDescription,
          trxnReferenceType: values.trxnReferenceType,
          goldenWheelEnabled: values.goldenWheelEnabled,
          loginStreakResetValue: values.loginStreakResetValue,
          goldenWheelWinAmount: values.goldenWheelWinAmount,
          periodInMinutes: values.periodInMinutes,
          payOutEnabled: values.payOutEnabled,
          goldenWheelFinishPayout: JSON.parse(values.goldenWheelFinishPayout)
        };
        this.props.actions.setMainSpinWheelConfig(data).then(() => {
          window.location.reload();
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      timezone: isFieldTouched('timezone') && getFieldError('timezone'),
      trxnDescription:
        isFieldTouched('trxnDescription') && getFieldError('trxnDescription'),
      trxnReferenceType:
        isFieldTouched('trxnReferenceType') &&
        getFieldError('trxnReferenceType'),
      periodInMinutes:
        isFieldTouched('periodInMinutes') && getFieldError('periodInMinutes'),
      loginStreakResetValue:
        isFieldTouched('loginStreakResetValue') &&
        getFieldError('loginStreakResetValue'),
      goldenWheelWinAmount:
        isFieldTouched('goldenWheelWinAmount') &&
        getFieldError('goldenWheelWinAmount'),
      goldenWheelFinishPayout:
        isFieldTouched('goldenWheelFinishPayout') &&
        getFieldError('goldenWheelFinishPayout')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card type="inner">
            <Row>
              <Col span={6}>Country</Col>
              <Col span={18}>
                <Select
                  showSearch
                  onSelect={e => this.selectCountry(e)}
                  style={{ width: 200 }}
                  placeholder="Select a country"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {CountryList}
                </Select>
              </Col>
            </Row>
          </Card>
          {this.state.loaded && (
            <Card title="Other Spinwheel Configurations">
              <FormItem
                validateStatus={errors.timezone ? 'error' : ''}
                help={errors.timezone || ''}
                {...formItemLayout}
                label={'Timezone'}
              >
                {getFieldDecorator('timezone', {
                  initialValue: this.state.config.timezone,
                  rules: [
                    {
                      required: true,
                      message: 'Please input number!'
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label={'Segment Provider On'}>
                {getFieldDecorator('segmentProviderOn', {
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select an option',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.config.segmentProviderOn
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>False</Radio.Button>
                    <Radio.Button value={true}>True</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.trxnDescription ? 'error' : ''}
                help={errors.trxnDescription || ''}
                {...formItemLayout}
                label={'trxnDescription'}
              >
                {getFieldDecorator('trxnDescription', {
                  initialValue: this.state.config.trxnDescription,
                  rules: [
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={errors.trxnReferenceType ? 'error' : ''}
                help={errors.trxnReferenceType || ''}
                {...formItemLayout}
                label={'trxnReferenceType'}
              >
                {getFieldDecorator('trxnReferenceType', {
                  initialValue: this.state.config.trxnReferenceType,
                  rules: [
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label={'Golden Wheel Enabled'}>
                {getFieldDecorator('goldenWheelEnabled', {
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select an option',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.config.goldenWheelEnabled
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>False</Radio.Button>
                    <Radio.Button value={true}>True</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.loginStreakResetValue ? 'error' : ''}
                help={errors.loginStreakResetValue || ''}
                {...formItemLayout}
                label={'Login Streak Reset Value'}
              >
                {getFieldDecorator('loginStreakResetValue', {
                  initialValue: this.state.config.loginStreakResetValue,
                  rules: [
                    {
                      required: true,
                      message: 'Please input number!',
                      type: 'number'
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.goldenWheelWinAmount ? 'error' : ''}
                help={errors.goldenWheelWinAmount || ''}
                {...formItemLayout}
                label={'Golden Wheel Win Amount'}
              >
                {getFieldDecorator('goldenWheelWinAmount', {
                  initialValue: this.state.config.goldenWheelWinAmount,
                  rules: [
                    {
                      required: true,
                      message: 'Please input number!',
                      type: 'number'
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.periodInMinutes ? 'error' : ''}
                help={errors.periodInMinutes || ''}
                {...formItemLayout}
                label={'Period In Minutes'}
              >
                {getFieldDecorator('periodInMinutes', {
                  initialValue: this.state.config.periodInMinutes,
                  rules: [
                    {
                      required: true,
                      message: 'Please input number!',
                      type: 'number'
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={'Pay Out Enabled'}>
                {getFieldDecorator('payOutEnabled', {
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select an option',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.config.payOutEnabled
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>False</Radio.Button>
                    <Radio.Button value={true}>True</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.goldenWheelFinishPayout ||
                  !this.state.goldenWheelFinishPayoutCheck
                    ? 'error'
                    : ''
                }
                help={errors.goldenWheelFinishPayout || ''}
                {...formItemLayout}
                label={'Golden Wheel Finish Payout'}
              >
                {getFieldDecorator('goldenWheelFinishPayout', {
                  initialValue: JSON.stringify(
                    this.state.config.goldenWheelFinishPayout,
                    null,
                    2
                  ),
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={20}
                    onBlur={e => this.jsonCheck(e.target.value)}
                  />
                )}
              </FormItem>
              <Row>
                <Col span={12} offset={12}>
                  <Button
                    style={{ float: 'none' }}
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    mainSpinWheelConfigResponse: state.spinWheel.mainSpinWheelConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...spinWheelActions }, dispatch)
  };
}
const OtherSpinConfigForm = Form.create()(OtherSpinConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OtherSpinConfigForm);
