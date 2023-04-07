import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as missionConfigActions from '../../actions/MissionConfigActions';
import * as segmentationActions from '../../actions/segmentationActions';
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

class MissionSegmentationConfig extends React.Component {
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
    this.getSegmentationList();
  }

  getSegmentationList() {
    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment &&
        this.props.getCustomSegmentListResponse.segment.length > 0
      ) {
        this.setState({
          listOfSegments: [...this.props.getCustomSegmentListResponse.segment],
          segmentsFetchedFromBackend: true
        });
      } else {
        this.setState({
          listOfSegments: [],
          segmentsFetchedFromBackend: false
        });
      }
    });
  }

  selectCountry(value) {
    this.setState(
      {
        loaded: false,
        showMainSegment: false,
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
    this.props.actions.getMissionSegmentationConfig(data).then(() => {
      if (
        this.props.getMissionSegmentationConfigResponse &&
        this.props.getMissionSegmentationConfigResponse.segmentMap
      ) {
        const { segmentsFetchedFromBackend } = this.state;
        this.setState(
          {
            config: { ...this.props.getMissionSegmentationConfigResponse },
            segmentMap: {
              ...this.props.getMissionSegmentationConfigResponse.segmentMap
            },
            loaded: segmentsFetchedFromBackend ? true : false
          },
          () => {
            if (!segmentsFetchedFromBackend) {
              this.populateDefaultSegments();
            }
          }
        );
      } else {
        message.error('Could not load config');
      }
    });
  };

  selectSegment(value) {
    let { segmentMap } = this.state;
    if (value in segmentMap) {
      let {
        dailyMissionConfigs,
        validApkTypes,
        mqttDisabledBuckets,
        disabledMissionsBuckets
      } = segmentMap[value];
      this.setState({
        dailyMissionConfigs,
        validApkTypes,
        mqttDisabledBuckets,
        disabledMissionsBuckets,
        selectedSegment: value,
        showMainSegment: true
      });
    } else {
      this.setState({
        dailyMissionConfigs: {},
        validApkTypes: [],
        mqttDisabledBuckets: [],
        disabledMissionsBuckets: [],
        selectedSegment: value,
        showMainSegment: true
      });
    }
  }

  populateDefaultSegments() {
    let segmentIdList = Object.keys(this.state.segmentMap);

    let listOfSegments = segmentIdList.map(item => {
      let returnObj = {};
      returnObj['segmentId'] = item;
      return returnObj;
    });

    listOfSegments.unshift({
      segmentId: 'DEFAULT##DEFAULT'
    });

    this.setState({
      listOfSegments,
      loaded: true
    });
  }

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
        let segmentMap =
          Object.keys(this.state.segmentMap).length === 0
            ? {}
            : { ...this.state.segmentMap };

        segmentMap[values.segment] = {
          dailyMissionConfigs: {
            header: values.header,
            days: values.days,
            timeDiff: values.timeDiff
          },
          validApkTypes: JSON.parse(values.validApkTypes),
          mqttDisabledBuckets: JSON.parse(values.mqttDisabledBuckets),
          disabledMissionsBuckets: JSON.parse(values.disabledMissionsBuckets)
        };
        if (!isEmpty(values.games)) {
          segmentMap[values.segment]['dailyMissionConfigs'][
            'games'
          ] = JSON.parse(values.games);
        }
        if (!isEmpty(values.fantasy)) {
          segmentMap[values.segment]['dailyMissionConfigs'][
            'fantasy'
          ] = JSON.parse(values.fantasy);
        }
        if (!isEmpty(values.wallet)) {
          segmentMap[values.segment]['dailyMissionConfigs'][
            'wallet'
          ] = JSON.parse(values.wallet);
        }
        if (!isEmpty(values.rummy)) {
          segmentMap[values.segment]['dailyMissionConfigs'][
            'rummy'
          ] = JSON.parse(values.rummy);
        }

        let data = {
          countryCode: this.state.countryCode,
          editValue: 'SEGMENT_MAP',
          segmentMap: { ...segmentMap }
        };

        this.props.actions.setMissionSegmentationConfig(data).then(() => {
          if (this.props.setMissionSegmentationConfigResponse) {
            if (this.props.setMissionSegmentationConfigResponse.error) {
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
      <Card className="page-container" title="Mission Segmentation Configs">
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
          {this.state.loaded && (
            <FormItem label={<span>Segments</span>}>
              {getFieldDecorator('segment', {
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
                  onSelect={e => this.selectSegment(e)}
                  style={{ width: '100%' }}
                  placeholder="Select segment"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.listOfSegments &&
                    this.state.listOfSegments.map(segment => (
                      <Option value={segment.segmentId} key={segment.segmentId}>
                        {segment.segmentId}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          )}

          {this.state.showMainSegment && (
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
          )}
        </Form>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getMissionSegmentationConfigResponse:
    state.missions.getMissionSegmentationConfigResponse,
  setMissionSegmentationConfigResponse:
    state.missions.setMissionSegmentationConfigResponse,
  getCustomSegmentListResponse: state.segmentation.getCustomSegmentListResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...missionConfigActions, ...segmentationActions },
    dispatch
  )
});

const MissionSegmentationConfigForm = Form.create()(MissionSegmentationConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MissionSegmentationConfigForm);
