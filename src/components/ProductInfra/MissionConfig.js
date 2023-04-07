import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as missionConfigActions from '../../actions/MissionConfigActions';
import {
  Card,
  Form,
  Button,
  Input,
  message,
  Row,
  Col,
  InputNumber,
  Select
} from 'antd';
import { isEmpty } from 'lodash';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
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

const COUNTRY_OPTIONS = ['ID', 'IN', 'US'];

class MissionConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJsonVerified: {
        games: true,
        fantasy: true,
        wallet: true,
        rummy: true,
        validApkTypes: true,
        mqttDisabledBuckets: true,
        disabledMissionsBuckets: true
      },
      countryCode: '',
      dailyMissionConfigs: {}
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
    this.props.actions.getMissionConfig(data).then(() => {
      if (this.props.getMissionConfigResponse) {
        const {
          dailyMissionConfigs,
          validApkTypes,
          mqttDisabledBuckets,
          disabledMissionsBuckets
        } = this.props.getMissionConfigResponse;
        this.setState({
          dailyMissionConfigs,
          validApkTypes,
          mqttDisabledBuckets,
          disabledMissionsBuckets
        });
      } else {
        message.error('Could not load config');
      }
    });
  };

  jsonCheck(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      message.error('Invalid JSON object', 1);
      return false;
    }
  }

  jsonValidator = async (rule, value) => {
    // this will throw error for invalid JSON
    JSON.parse(value);
  };

  verifyJsonInput(value, configType) {
    let isJsonFlag;
    if (configType !== 'APK_TYPES') {
      if (value === null || value === '') {
        isJsonFlag = true;
      } else {
        isJsonFlag = this.jsonCheck(value);
      }
    } else {
      if (value === null || value === '') {
        isJsonFlag = false;
      } else {
        isJsonFlag = this.jsonCheck(value);
      }
    }

    let isJsonVerified = { ...this.state.isJsonVerified };
    switch (configType) {
      case 'GAMES':
        isJsonVerified.games = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'FANTASY':
        isJsonVerified.fantasy = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'WALLET':
        isJsonVerified.wallet = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'RUMMY':
        isJsonVerified.rummy = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'APK_TYPES':
        isJsonVerified.validApkTypes = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'APK_TYPES':
        isJsonVerified.validApkTypes = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'MQTT_DISABLED':
        isJsonVerified.mqttDisabledBuckets = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'DISABLED_MISSONS':
        isJsonVerified.disabledMissionsBuckets = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      default:
        break;
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          dailyMissionConfigs: {
            header: values.header,
            days: values.days,
            timeDiff: values.timeDiff
          },
          validApkTypes: JSON.parse(values.validApkTypes),
          mqttDisabledBuckets: JSON.parse(values.mqttDisabledBuckets),
          disabledMissionsBuckets: JSON.parse(values.disabledMissionsBuckets),
          countryCode: this.state.countryCode
        };
        if (!isEmpty(values.games)) {
          data['dailyMissionConfigs']['games'] = JSON.parse(values.games);
        }
        if (!isEmpty(values.fantasy)) {
          data['dailyMissionConfigs']['fantasy'] = JSON.parse(values.fantasy);
        }
        if (!isEmpty(values.wallet)) {
          data['dailyMissionConfigs']['wallet'] = JSON.parse(values.wallet);
        }
        if (!isEmpty(values.rummy)) {
          data['dailyMissionConfigs']['rummy'] = JSON.parse(values.rummy);
        }
        this.props.actions.setMissionConfig(data).then(() => {
          if (this.props.setMissionConfigResponse) {
            if (this.props.setMissionConfigResponse.error) {
              message.error('Could not update');
            } else {
              message.success('Data Uploaded Successfully', 1.5).then(() => {
                window.location.reload();
              });
            }
          }
        });
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      header: isFieldTouched('header') && getFieldError('header'),
      days: isFieldTouched('days') && getFieldError('days'),
      timeDiff: isFieldTouched('timeDiff') && getFieldError('timeDiff')
    };

    const { dailyMissionConfigs } = this.state;

    return (
      <Card className="page-container" title="Mission Configs">
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
                {COUNTRY_OPTIONS.map(country => (
                  <Option value={country} key={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          {dailyMissionConfigs && !isEmpty(dailyMissionConfigs) ? (
            <>
              <Card type="inner" title="Daily Mission Configs">
                <FormItem
                  validateStatus={errors.header ? 'error' : ''}
                  help={errors.header || ''}
                  label={'Header'}
                >
                  {getFieldDecorator('header', {
                    initialValue:
                      this.state.dailyMissionConfigs &&
                      this.state.dailyMissionConfigs.header
                        ? this.state.dailyMissionConfigs.header
                        : '',
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.days ? 'error' : ''}
                  help={errors.days || ''}
                  label={'Days'}
                >
                  {getFieldDecorator('days', {
                    initialValue:
                      this.state.dailyMissionConfigs &&
                      this.state.dailyMissionConfigs.days
                        ? this.state.dailyMissionConfigs.days
                        : 0,
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'This is a mandatory field!',
                        whitespace: false
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>

                <FormItem
                  validateStatus={errors.timeDiff ? 'error' : ''}
                  help={errors.timeDiff || ''}
                  label={'Time Diff'}
                >
                  {getFieldDecorator('timeDiff', {
                    initialValue:
                      this.state.dailyMissionConfigs &&
                      this.state.dailyMissionConfigs.timeDiff
                        ? this.state.dailyMissionConfigs.timeDiff
                        : 0,
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'This is a mandatory field!',
                        whitespace: false
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>

                <FormItem
                  validateStatus={
                    !this.state.isJsonVerified.games ? 'error' : ''
                  }
                  label="Games"
                >
                  {getFieldDecorator('games', {
                    initialValue: JSON.stringify(
                      this.state.dailyMissionConfigs.games,
                      null,
                      2
                    ),
                    rules: [
                      {
                        required: false,
                        type: 'string',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 20 }}
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'GAMES')
                      }
                    />
                  )}
                </FormItem>

                <FormItem
                  validateStatus={
                    !this.state.isJsonVerified.fantasy ? 'error' : ''
                  }
                  label="Fantasy"
                >
                  {getFieldDecorator('fantasy', {
                    initialValue: JSON.stringify(
                      this.state.dailyMissionConfigs.fantasy,
                      null,
                      2
                    ),
                    rules: [
                      {
                        required: false,
                        type: 'string',
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 20 }}
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'FANTASY')
                      }
                    />
                  )}
                </FormItem>

                <FormItem
                  validateStatus={
                    !this.state.isJsonVerified.wallet ? 'error' : ''
                  }
                  label="Wallet"
                >
                  {getFieldDecorator('wallet', {
                    initialValue: JSON.stringify(
                      this.state.dailyMissionConfigs.wallet,
                      null,
                      2
                    ),
                    rules: [
                      {
                        required: false,
                        type: 'string',
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 20 }}
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'WALLET')
                      }
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={
                    !this.state.isJsonVerified.rummy ? 'error' : ''
                  }
                  label="Rummy"
                >
                  {getFieldDecorator('rummy', {
                    initialValue: JSON.stringify(
                      this.state.dailyMissionConfigs.rummy,
                      null,
                      2
                    ),
                    rules: [
                      {
                        required: false,
                        type: 'string',
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 20 }}
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'RUMMY')
                      }
                    />
                  )}
                </FormItem>
              </Card>

              <Card type="inner" title="Valid Apk Types">
                <FormItem label="Valid Apk Types">
                  {getFieldDecorator('validApkTypes', {
                    initialValue: JSON.stringify(
                      this.state.validApkTypes,
                      null,
                      2
                    ),
                    rules: [
                      {
                        required: true,
                        type: 'string',
                        message: 'This is a mandatory field!',
                        whitespace: true
                      },
                      { validator: this.jsonValidator }
                    ]
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 20 }}
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'APK_TYPES')
                      }
                    />
                  )}
                </FormItem>
              </Card>
              <Card type="inner" title="MQTT Disabled Buckets">
                <FormItem label="MQTT Disabled Buckets">
                  {getFieldDecorator('mqttDisabledBuckets', {
                    initialValue: JSON.stringify(
                      this.state.mqttDisabledBuckets,
                      null,
                      2
                    ),
                    rules: [
                      {
                        required: true,
                        type: 'string',
                        message: 'This is a mandatory field!',
                        whitespace: true
                      },
                      { validator: this.jsonValidator }
                    ]
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 20 }}
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'MQTT_DISABLED')
                      }
                    />
                  )}
                </FormItem>
              </Card>
              <Card type="inner" title="Disabled Missions Buckets">
                <FormItem label="Disabled Missions Buckets">
                  {getFieldDecorator('disabledMissionsBuckets', {
                    initialValue: JSON.stringify(
                      this.state.disabledMissionsBuckets,
                      null,
                      2
                    ),
                    rules: [
                      {
                        required: true,
                        type: 'string',
                        message: 'This is a mandatory field!',
                        whitespace: true
                      },
                      { validator: this.jsonValidator }
                    ]
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 20 }}
                      onBlur={e =>
                        this.verifyJsonInput(e.target.value, 'DISABLED_MISSONS')
                      }
                    />
                  )}
                </FormItem>
              </Card>
              <Row type="flex" justify="center">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={this.hasErrors(getFieldsError())}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </>
          ) : null}
        </Form>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getMissionConfigResponse: state.missions.getMissionConfigResponse,
  setMissionConfigResponse: state.missions.setMissionConfigResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...missionConfigActions }, dispatch)
});

const MissionConfigForm = Form.create()(MissionConfig);
export default connect(mapStateToProps, mapDispatchToProps)(MissionConfigForm);
