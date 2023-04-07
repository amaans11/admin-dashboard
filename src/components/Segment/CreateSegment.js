// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  InputNumber,
  Radio,
  Input,
  Select,
  Tooltip,
  Icon,
  Button
} from 'antd';
import * as segmentActions from '../../actions/segmentActions';
import * as userProfileActions from '../../actions/UserProfileActions';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const SegmentTypes = [
  'USER_WON_SEGMENT',
  'USER_TIER_SEGMENT',
  'USER_LOCATION_SEGMENT',
  'USER_LOST_SEGMENT',
  'USER_GAME_WINS',
  'USER_GAME_ENTRY_FEE',
  'USER_GAME_CASH_WON',
  'USER_GAME_NET_CASH_WON',
  'USER_GAME_ATTEMPTS',
  'USER_GAME_NET_CASH_POSITIVE_WIN',
  'USER_GAME_HIGHSCORE',
  'USER_GAME_RATING'
].map(val => (
  <Option value={val} key={val}>
    {val}
  </Option>
));

const GameTypes = ['COMBINED', 'TOURNAMENT', 'BATTLE'].map(val => (
  <Option value={val} key={val}>
    {val}
  </Option>
));

const CurrencyTypes = ['BOTH', 'CASH', 'TOKEN'].map(val => (
  <Option value={val} key={val}>
    {val}
  </Option>
));

const GameRelatedSegments = [
  'USER_GAME_WINS',
  'USER_GAME_ENTRY_FEE',
  'USER_GAME_CASH_WON',
  'USER_GAME_NET_CASH_WON',
  'USER_GAME_ATTEMPTS',
  'USER_GAME_NET_CASH_POSITIVE_WIN',
  'USER_GAME_HIGHSCORE',
  'USER_GAME_RATING'
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class createSegment extends React.Component {
  state = {
    segmentType: '',
    durationInfoVisible: false,
    humanDuration: '',
    durationbut1Focus: '',
    durationbut2Focus: '',
    durationbut3Focus: '',
    durationMin: 0,
    disableField: true,
    maxTierProfileList: [],
    minTierProfileList: [],
    maxTierDisableField: [],
    minTierDisableField: []
  };
  componentDidMount() {
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.active = false;
        if (values.segmentType === 'USER_TIER_SEGMENT') {
          values.userTierSegment = {};
          values.userTierSegment.minTier = this.props.userProfile.tierList.tiers[
            values.minTier
          ].tier;
          values.userTierSegment.maxTier = this.props.userProfile.tierList.tiers[
            values.maxTier
          ].tier;
          delete values.minTier;
          delete values.maxTier;
        } else if (values.segmentType === 'USER_WON_SEGMENT') {
          values.userWonSegment = {};
          values.userWonSegment.userWonMinHours = values.userWonMinHours;
          values.userWonSegment.userWonMaxHours = values.userWonMaxHours;
          delete values.userWonMinHours;
          delete values.userWonMaxHours;
        } else {
          values.segmentParams = {};
          values.segmentParams.min = values.min;
          values.segmentParams.max = values.max;
          if (GameRelatedSegments.includes(values.segmentType)) {
            values.segmentParams.gameTpe = values.gameTpe;
            values.segmentParams.currencyType = values.currencyType;
            delete values.gameTpe;
            delete values.currencyType;
          }
          delete values.min;
          delete values.max;
        }
        this.props.actions.createSegment(values).then(() => {
          this.props.history.push('/segment/list');
        });
      }
    });
  };

  segmentSelected(value) {
    this.setState({
      segmentType: value
    });
    if (value === 'USER_TIER_SEGMENT') {
      this.props.actions.getTierList().then(() => {
        var minTierProfileList = [];
        this.props.userProfile.tierList.tiers.map((tier, index) => {
          minTierProfileList.push(
            <Option key={tier.tier} value={index}>
              {tier.tier}
            </Option>
          );
        });
        this.setState({
          minTierProfileList
        });
      });
    }
  }

  render() {
    const minTierChange = e => {
      var maxTierProfileList = [];
      this.state.minTierProfileList.map((tier, index) => {
        if (index < e) {
          maxTierProfileList.push(
            <Option key={'tier' + tier.tier} disabled={true} value={index}>
              {tier.key}
            </Option>
          );
        } else {
          maxTierProfileList.push(
            <Option key={'tier' + tier.tier} disabled={false} value={index}>
              {tier.key}
            </Option>
          );
        }
      });

      this.setState({
        disableField: false,
        maxTierProfileList
      });
    };
    const minHoursChanged = e => {
      console.log(e);
      this.setState({
        minHours: e
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
    const nameError = isFieldTouched('name') && getFieldError('name');
    const maxTierError = isFieldTouched('maxTier') && getFieldError('maxTier');
    const minTierError = isFieldTouched('minTier') && getFieldError('minTier');
    const segmentTypeError =
      isFieldTouched('segmentType') && getFieldError('segmentType');

    const userWonMinHoursError =
      isFieldTouched('userWonMinHours') && getFieldError('userWonMinHours');
    const userWonMaxHoursError =
      isFieldTouched('userWonMaxHours') && getFieldError('userWonMaxHours');
    const minError = isFieldTouched('min') && getFieldError('min');
    const maxError = isFieldTouched('max') && getFieldError('max');
    const gameTpeError = isFieldTouched('gameTpe') && getFieldError('gameTpe');
    const currencyTypeError =
      isFieldTouched('currencyType') && getFieldError('currencyType');

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Basic Details">
            <FormItem
              validateStatus={nameError ? 'error' : ''}
              help={nameError || ''}
              {...formItemLayout}
              label={
                <span>
                  Segment Name
                  <Tooltip title="Name of the Segment">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={segmentTypeError ? 'error' : ''}
              help={segmentTypeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Segment Type
                  <Tooltip title="True - if recurring (same duration + entry fee) False - if non-recurring">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('segmentType', {
                rules: [
                  {
                    required: true,
                    message: 'Please input segment type'
                  }
                ]
              })(
                <Select
                  onChange={e => this.segmentSelected(e)}
                  showSearch
                  style={{ width: 400 }}
                  placeholder="Segment Type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {SegmentTypes}
                </Select>
              )}
            </FormItem>
            {this.state.segmentType === 'USER_WON_SEGMENT' ? (
              <React.Fragment>
                <FormItem
                  validateStatus={userWonMinHoursError ? 'error' : ''}
                  help={userWonMinHoursError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Min number of Hours
                      <Tooltip title=" Min number of Hours since Last Win">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('userWonMinHours', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please enter the min hours',
                        whitespace: false
                      }
                    ]
                  })(<InputNumber min={0} onChange={minHoursChanged} />)}
                </FormItem>
                <FormItem
                  validateStatus={userWonMaxHoursError ? 'error' : ''}
                  help={userWonMaxHoursError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Max number of Hours
                      <Tooltip title=" Max number of Hours since Last Win">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('userWonMaxHours', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please enter the max hours !',
                        whitespace: false
                      }
                    ]
                  })(<InputNumber min={this.state.minHours} />)}
                </FormItem>
              </React.Fragment>
            ) : (
              ''
            )}
            {this.state.segmentType === 'USER_TIER_SEGMENT' ? (
              <React.Fragment>
                <FormItem
                  validateStatus={minTierError ? 'error' : ''}
                  help={minTierError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Min Tier
                      <Tooltip title="Limit for the Tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('minTier', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please enter the userWonMaxDays fee!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      onChange={minTierChange}
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Min Tier"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.minTierProfileList}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={maxTierError ? 'error' : ''}
                  help={maxTierError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Max Tier
                      <Tooltip title="Limit for the Tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('maxTier', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please select tier!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      disabled={this.state.disableField}
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Max Tier"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.maxTierProfileList}
                    </Select>
                  )}
                </FormItem>
              </React.Fragment>
            ) : (
              ''
            )}
            {this.state.segmentType !== 'USER_WON_SEGMENT' &&
              this.state.segmentType !== 'USER_TIER_SEGMENT' &&
              this.state.segmentType !== '' && (
                <>
                  <FormItem
                    validateStatus={minError ? 'error' : ''}
                    help={minError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Min
                        <Tooltip title="Min value">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('min', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message: 'Please enter the min hours !',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber />)}
                  </FormItem>
                  <FormItem
                    validateStatus={maxError ? 'error' : ''}
                    help={maxError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Max
                        <Tooltip title="max value">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('max', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message: 'Please enter the max hours !',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber />)}
                  </FormItem>
                </>
              )}
            {GameRelatedSegments.includes(this.state.segmentType) && (
              <>
                <FormItem
                  validateStatus={gameTpeError ? 'error' : ''}
                  help={gameTpeError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Game Type
                      <Tooltip title="Limit for the Tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('gameTpe', {
                    initialValue: 'COMBINED',
                    rules: [
                      {
                        required: true,
                        message: 'Please select game type!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Game Type"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {GameTypes}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={currencyTypeError ? 'error' : ''}
                  help={currencyTypeError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Currency Type
                      <Tooltip title="Limit for the Tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('currencyType', {
                    initialValue: 'BOTH',
                    rules: [
                      {
                        required: true,
                        message: 'Please select currency type!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Currency Type"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {CurrencyTypes}
                    </Select>
                  )}
                </FormItem>
              </>
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
    userProfile: state.userProfile
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...segmentActions, ...userProfileActions },
      dispatch
    )
  };
}

const createSegmentForm = Form.create()(createSegment);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(createSegmentForm);
