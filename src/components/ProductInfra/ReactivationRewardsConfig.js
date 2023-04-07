import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Card,
  Form,
  message,
  Input,
  Radio,
  InputNumber,
  Row,
  Col,
  Button,
  Spin,
  Select
} from 'antd';
import * as reactivationRewardsConfigActions from '../../actions/reactivationRewardsConfigActions';
import { isEmpty } from 'lodash';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class ReactivationRewardsConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      config: {}
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState(
      {
        loaded: false,
        countryCode: value
      },
      () => {
        this.getConfig();
      }
    );
  }

  getConfig = () => {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getActivationRewardsConfig(data).then(() => {
      if (
        this.props.getActivationRewardsConfigResponse &&
        this.props.getActivationRewardsConfigResponse.config
      ) {
        const { config } = this.props.getActivationRewardsConfigResponse;
        this.setState({ config, loaded: true });
      }
    });
  };

  updateConfig = values => {
    this.props.actions.updateActivationRewardsConfig(values).then(() => {
      if (
        this.props.updateActivationRewardsConfigResponse &&
        this.props.updateActivationRewardsConfigResponse.success
      ) {
        message.success('Config Updated!');
      } else {
        message.error('Unable to update config!');
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const reactivationRewards = values.reactivationRewards.map(reward => {
          // Convert String to Object
          reward.couponData = JSON.parse(reward.couponData);
          reward.extraData = JSON.parse(reward.extraData);
          return reward;
        });
        values.countryCode = this.state.countryCode;
        values.reactivationRewards = [...reactivationRewards];
        this.updateConfig(values);
      }
    });
  };

  jsonValidator = async (rule, value) => {
    // this will throw error for invalid JSON
    JSON.parse(value);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const config = this.state.config || {};

    return (
      <Card className="page-container" title="Reactivation Rewards Config">
        {/* {isEmpty(config) && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <Spin size="large" />
          </div>
        )} */}

        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Form.Item label={<span>Country</span>}>
            {getFieldDecorator('countryCode', {
              rules: [
                {
                  required: true,
                  message: ' ',
                  whitespace: true
                }
              ]
            })(
              <Select
                showSearch
                onSelect={e => this.selectCountry(e)}
                style={{ width: '100%' }}
                placeholder="Select country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {CountryList}
              </Select>
            )}
          </Form.Item>
          {this.state.loaded && (
            <>
              {config.hasOwnProperty('reactivationRewardsActive') && (
                <Form.Item label="reactivationRewardsActive">
                  {getFieldDecorator('reactivationRewardsActive', {
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        message: 'This field is required'
                      }
                    ],
                    initialValue: config.reactivationRewardsActive
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={true}>true</Radio.Button>
                      <Radio.Button value={false}>false</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              )}

              {config.reactivationRewards &&
              config.reactivationRewards.length ? (
                <Card title="reactivationRewards" size="small">
                  {config.reactivationRewards.map((reward, idx) => (
                    <Card
                      size="small"
                      key={idx}
                      title={'reactivationRewards[' + idx + ']'}
                    >
                      <Form.Item label="enabled">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].enabled`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'boolean',
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].enabled
                          }
                        )(
                          <Radio.Group buttonStyle="solid">
                            <Radio.Button value={true}>true</Radio.Button>
                            <Radio.Button value={false}>false</Radio.Button>
                          </Radio.Group>
                        )}
                      </Form.Item>
                      <Form.Item label="minAgeInMins">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].minAgeInMins`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'number',
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].minAgeInMins
                          }
                        )(<InputNumber min={0} precision={0} />)}
                      </Form.Item>
                      <Form.Item label="maxAgeInMins">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].maxAgeInMins`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'number',
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].maxAgeInMins
                          }
                        )(<InputNumber min={0} precision={0} />)}
                      </Form.Item>
                      <Form.Item label="segmentId">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].segmentId`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'string',
                                whitespace: true,
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].segmentId
                          }
                        )(<Input placeholder="Enter segmentId value" />)}
                      </Form.Item>
                      <Form.Item label="rewardType">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].rewardType`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'string',
                                whitespace: true,
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].rewardType
                          }
                        )(<Input placeholder="Enter rewardType value" />)}
                      </Form.Item>
                      <Form.Item label="ticketType">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].ticketType`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'string',
                                whitespace: true,
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].ticketType
                          }
                        )(<Input placeholder="Enter ticketType value" />)}
                      </Form.Item>
                      <Form.Item label="rewardAmount">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].rewardAmount`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'number',
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].rewardAmount
                          }
                        )(<InputNumber min={0} precision={0} />)}
                      </Form.Item>
                      <Form.Item label="rewardCurrency">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].rewardCurrency`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'string',
                                whitespace: true,
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].rewardCurrency
                          }
                        )(<Input placeholder="Enter rewardCurrency value" />)}
                      </Form.Item>
                      <Form.Item label="expiryTimeInMins">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].expiryTimeInMins`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'number',
                                message: 'This field is required'
                              }
                            ],
                            initialValue:
                              config.reactivationRewards[idx].expiryTimeInMins
                          }
                        )(<InputNumber min={0} precision={0} />)}
                      </Form.Item>
                      <Form.Item label="couponData">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].couponData`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'string',
                                whitespace: true,
                                validator: this.jsonValidator
                              }
                            ],
                            initialValue: JSON.stringify(
                              config.reactivationRewards[idx].couponData,
                              null,
                              2
                            )
                          }
                        )(
                          <TextArea
                            autoSize={{ minRows: 2, maxRows: 10 }}
                            placeholder="Enter couponData value"
                          />
                        )}
                      </Form.Item>
                      <Form.Item label="extraData">
                        {getFieldDecorator(
                          `reactivationRewards[${idx}].extraData`,
                          {
                            rules: [
                              {
                                required: true,
                                type: 'string',
                                whitespace: true,
                                validator: this.jsonValidator
                              }
                            ],
                            initialValue: JSON.stringify(
                              config.reactivationRewards[idx].extraData,
                              null,
                              2
                            )
                          }
                        )(
                          <TextArea
                            autoSize={{ minRows: 2, maxRows: 10 }}
                            placeholder="Enter extraData value"
                          />
                        )}
                      </Form.Item>
                    </Card>
                  ))}

                  <Row>
                    <Col offset={8} span={14}>
                      <Button type="primary" htmlType="submit">
                        Update
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ) : null}
            </>
          )}
        </Form>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getActivationRewardsConfigResponse:
      state.reactivationRewards.getActivationRewardsConfigResponse,
    updateActivationRewardsConfigResponse:
      state.reactivationRewards.updateActivationRewardsConfigResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(reactivationRewardsConfigActions, dispatch)
  };
};

const ReactivationRewardsConfig = Form.create()(ReactivationRewardsConfigForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactivationRewardsConfig);
