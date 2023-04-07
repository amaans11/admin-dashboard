import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as dynamicUpsellingActions from '../../actions/dynamicUpsellingActions';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Icon,
  TimePicker,
  DatePicker,
  message,
  Radio,
  Select,
  Button,
  Row,
  Col,
  notification
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import RadioGroup from 'antd/lib/radio/group';
import { DYNAMIC_UPSELLING_READ } from '../../auth/userPermission';
import CustomRewardsTable from './CustomRewardsTable';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const minuteStep = 5;
const format = 'hh:mm A';
const { TextArea } = Input;

const daysOfTheWeek = [
  { value: 'Monday', text: 'Monday' },
  { value: 'Tuesday', text: 'Tuesday' },
  { value: 'Wednesday', text: 'Wednesday' },
  { value: 'Thursday', text: 'Thursday' },
  { value: 'Friday', text: 'Friday' },
  { value: 'Saturday', text: 'Saturday' },
  { value: 'Sunday', text: 'Sunday' },
  { value: 'None', text: 'None' }
];
const repeats = [
  { value: 'DAILY', text: 'Daily' },
  { value: 'WEEKLY', text: 'Weekly' },
  { value: 'None', text: 'None' }
];

const currencyType = [
  { value: 'CASH', text: 'Cash' },
  { value: 'TOKEN', text: 'Token' }
];

export class DUCreateOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabledGamesList: [],
      disableField: false,
      gameWiseSegments: {},
      selectedGameId: null,
      active: false,
      offerAgain: false,
      selectedStartTime: null,
      selectedEndTime: null,
      isEditOfferFlow: false,
      rewardsTable: [],
      countryCodeList: []
    };
  }
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  selectGame = game => {
    this.setState({
      selectedGameId: game
    });
  };

  deleteReward = id => {
    let rewards = this.state.rewardsTable;
    let newRewards = rewards.filter(reward => reward.id !== id);
    this.setState({
      rewardsTable: newRewards
    });
  };

  addReward = reward => {
    this.setState({
      rewardsTable: [
        ...this.state.rewardsTable,
        { id: this.state.rewardsTable.length, ...reward }
      ]
    });
  };

  componentDidMount() {
    this.getUpsellSupportedCountries();
    this.props.form.validateFields();
    if (this.props.dynamicUpselling.cloneOffer) {
      this.cloneOffer();
    }
  }

  getUpsellSupportedCountries() {
    this.props.actions.getUpsellAllSupportedCountries().then(() => {
      if (
        this.props.getUpsellAllSupportedCountriesResponse &&
        this.props.getUpsellAllSupportedCountriesResponse.countryCode
      ) {
        this.setState({
          countryCodeList: [
            ...this.props.getUpsellAllSupportedCountriesResponse.countryCode
          ]
        });
      }
    });
  }

  selectCountry(value) {
    this.setState({ countryCode: value, countrySelected: true }, () =>
      this.getDynamicUpsellConfig()
    );
  }

  getDynamicUpsellConfig() {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getDynamicUpsellingConfig(data).then(response => {
      const { config = {} } = this.props.dynamicUpselling;
      let enabledGamesList = [];
      let gameWiseSegments = {};
      if (Object.keys(config).length) {
        _.get(config, 'enabledGames', []).map(game => {
          enabledGamesList.push(game);
        });
        _.get(config, 'gameUpsellSegments', []).map(segments => {
          gameWiseSegments[segments.gameId] = segments.segments;
        });
      } else {
        const { enabledGames = [], gameUpsellSegments = [] } =
          response.data && response.data.payload;
        enabledGames.map(game => {
          enabledGamesList.push(game);
        });
        gameUpsellSegments.map(segments => {
          gameWiseSegments[segments.gameId] = segments.segments;
        });
      }
      this.setState({
        loading: false,
        enabledGamesList,
        gameWiseSegments
      });
    });
  }

  cloneOffer() {
    // call getDynamicUpsellConfig based on cuurent country code
    const {
      name,
      description,
      gameId,
      startTime,
      endTime,
      dayOfTheWeek,
      repeat,
      noOfRepeats,
      segments,
      entryFeeStart,
      entryFeeEnd,
      currencyType,
      rewards,
      active,
      offerAgainFactor = 0,
      coolDownPeriod,
      extraInfo,
      countryCode
    } = this.props.dynamicUpselling.cloneOffer;

    this.setState({ countryCode: countryCode, countrySelected: true }, () => {
      this.getDynamicUpsellConfig();
      this.setState({
        selectedGameId: gameId,
        rewardsTable: JSON.parse(rewards)
      });
      this.props.form.setFieldsValue({
        countryCode,
        name,
        description,
        gameId,
        startTime: moment(startTime),
        endTime: moment(endTime),
        tournamentDay: [moment(startTime), moment(endTime)],
        dayOfTheWeek,
        repeat,
        noOfRepeats,
        segments,
        entryFeeStart,
        entryFeeEnd,
        currencyType,
        rewards,
        active,
        offerAgainFactor,
        coolDownPeriod,
        extraInfo
      });

      if (this.props.dynamicUpselling.editType === 'edit') {
        this.setState({
          disableField: true,
          isEditOfferFlow: true
        });
      }
    });
  }

  componentWillUnmount = () => {
    this.props.form.resetFields();
    this.props.actions.resetCloneOffer();
  };
  disabledDate = current => {
    // Can not select days before today
    return current && current < moment().startOf('day');
  };
  onDateChange = e => {
    let startDate = e[0] !== undefined ? e[0] : e;
    this.setState({
      selectedStartDate: startDate
    });
    //not recurring check
    if (
      startDate.format('DDMMYY') === moment().format('DDMMYY') &&
      this.state.selectedStartDate < moment()
    ) {
      message.warning(
        "Start time of today's tournament of can't be less than current time. Resetting Tournament Start Time",
        2
      );
      this.props.form.resetFields(['startTime']);
    }
  };
  onTimeChange = (e, key) => {
    this.setState({
      [key]: e
    });
  };

  offerAgainChange = e => {
    this.setState({
      offerAgain: e.target.value
    });
  };

  validateJson = val => {
    if (val !== '') {
      try {
        JSON.parse(val);
        return true;
      } catch (error) {
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topLeft'
        });
        return false;
      }
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let valid1;

        if (!this.state.rewardsTable.length) {
          notification['error']({
            message: 'Rewards Required',
            description:
              'Rewards table cannot be empty. Please add reward config.',
            placement: 'topLeft'
          });
          return;
        }
        values.startTime = values.tournamentDay[0].set({
          hour: values.startTime.hour(),
          minute: values.startTime.minute()
        });
        values.endTime = values.tournamentDay[1].set({
          hour: values.endTime.hour(),
          minute: values.endTime.minute()
        });
        if (moment(values.startTime).isAfter(moment(values.endTime))) {
          notification['error']({
            message: 'Date Time Error',
            description:
              "Start time of offer can't be greater than end time. Change either of the start time or end time",
            placement: 'topLeft'
          });
          return;
        }
        values.startTime = values.startTime.toISOString(true);
        values.endTime = values.endTime.toISOString(true);
        delete values.tournamentDay;
        if (values.extraInfo !== '') {
          valid1 = this.validateJson(values.extraInfo);
        } else {
          values.extraInfo = '{}';
          valid1 = true;
        }
        let rewards = this.state.rewardsTable.map(item => ({
          games: item.games,
          reward: item.reward,
          moneyType: item.moneyType
        }));
        values.rewards = JSON.stringify(rewards);
        let methodToCall = this.state.isEditOfferFlow
          ? this.props.actions.updateDynamicUpsellOffer
          : this.props.actions.createDynamicUpsellOffer;

        if (valid1) {
          const { id = undefined } = _.get(
            this.props.dynamicUpselling,
            'cloneOffer',
            {}
          );

          if (values.dayOfTheWeek === 'None') delete values.dayOfTheWeek;
          if (values.repeat === 'None') delete values.repeat;
          if (id && this.props.dynamicUpselling.editType === 'edit')
            values.id = id;
          values.entryFeeEnd = 0;
          methodToCall(values).then(() => {
            if (
              this.props.dynamicUpselling.createOfferResponse.id ||
              this.props.dynamicUpselling.updateOfferResponse.id
            ) {
              message.success(
                `Dynamic Offer ${
                  this.state.isEditOfferFlow ? 'Updated' : 'Created'
                } Successfully.`
              );
            } else {
              message.error('Something went wrong');
            }
            this.props.form.resetFields();
            this.props.history.push('/dynamic-upselling/offers');
          });
        }
      }
    });
  };

  readOnlyUser = () => {
    return this.props.currentUser.user_role.includes(DYNAMIC_UPSELLING_READ);
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        lg: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };

    const nameError = isFieldTouched('name') && getFieldError('name');
    const descriptionError =
      isFieldTouched('description') && getFieldError('description');
    const countryCodeError =
      isFieldTouched('countryCode') && getFieldError('countryCode');
    const gameIdError = isFieldTouched('gameId') && getFieldError('gameId');
    const startTimeError =
      isFieldTouched('startTime') && getFieldError('startTime');
    const tournamentDayError =
      isFieldTouched('tournamentDay') && getFieldError('tournamentDay');
    const endTimeError = isFieldTouched('endTime') && getFieldError('endTime');
    const dayOfTheWeekError =
      isFieldTouched('dayOfTheWeek') && getFieldError('dayOfTheWeek');
    const repeatError = isFieldTouched('repeat') && getFieldError('repeat');
    const noOfRepeatsError =
      isFieldTouched('noOfRepeats') && getFieldError('noOfRepeats');
    const segmentsError =
      isFieldTouched('segments') && getFieldError('segments');
    const entryFeeStartError =
      isFieldTouched('entryFeeStart') && getFieldError('entryFeeStart');
    const entryFeeEndError =
      isFieldTouched('entryFeeEnd') && getFieldError('entryFeeEnd');
    const currencyTypeError =
      isFieldTouched('currencyType') && getFieldError('currencyType');
    const activeError = isFieldTouched('active') && getFieldError('active');
    const offerAgainFactorError =
      isFieldTouched('offerAgainFactor') && getFieldError('offerAgainFactor');
    const coolDownPeriodError =
      isFieldTouched('coolDownPeriod') && getFieldError('coolDownPeriod');
    const extraInfoError =
      isFieldTouched('extraInfo') && getFieldError('extraInfo');

    return (
      <div style={{ margin: '.5rem' }}>
        <Helmet>
          <title>Create Upselling Offer | Admin Dashboard</title>
        </Helmet>
        <Card title="Create Dynamic Upselling Offer">
          <Form onSubmit={this.handleSubmit} {...formItemLayout}>
            <FormItem
              validateStatus={countryCodeError ? 'error' : ''}
              help={countryCodeError || ''}
              {...formItemLayout}
              label={<span>Country Code</span>}
            >
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: true,
                    message: 'Please select a country!'
                  }
                ]
              })(
                <Select
                  disabled={this.state.disableField}
                  showSearch
                  style={{ width: '100%' }}
                  onSelect={e => this.selectCountry(e)}
                  placeholder="Select a country"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.countryCodeList.map(countryCode => {
                    return (
                      <Select.Option
                        key={'countryCode' + countryCode}
                        value={countryCode}
                      >
                        {countryCode}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            {this.state.countrySelected && (
              <Row>
                <Col span={24}>
                  <FormItem
                    validateStatus={gameIdError ? 'error' : ''}
                    help={gameIdError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Game for Offer
                        <Tooltip title="Select Game to create Dynamic Upselling Offer for">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('gameId', {
                      rules: [
                        {
                          type: 'number',
                          required: true,
                          message: 'Please select your Game!'
                        }
                      ]
                    })(
                      <Select
                        disabled={this.state.disableField}
                        showSearch
                        style={{ width: '100%' }}
                        onSelect={e => this.selectGame(e)}
                        placeholder="Select a Game"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.enabledGamesList.map(game => {
                          return (
                            <Select.Option
                              key={'game' + game.id}
                              value={game.id}
                            >
                              {game.name + ' (' + game.id + ')'}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={nameError ? 'error' : ''}
                    help={nameError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Name
                        <Tooltip title="Name of the Offer Configuration">
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
                      ],
                      initialValue: ''
                    })(<Input placeholder="Enter name" />)}
                  </FormItem>
                  <FormItem
                    validateStatus={descriptionError ? 'error' : ''}
                    help={descriptionError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Description
                        <Tooltip title="Enter description">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('description', {
                      rules: [
                        {
                          required: false,
                          message: 'Please input description!',
                          whitespace: true
                        }
                      ],
                      initialValue: ''
                    })(<Input placeholder="Enter description" />)}
                  </FormItem>
                  <FormItem
                    validateStatus={tournamentDayError ? 'error' : ''}
                    help={tournamentDayError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Select Date ranges
                        <Tooltip title="Date and time for Tournament Duration">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('tournamentDay', {
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          message: 'Please input time duration!',
                          whitespace: false
                        }
                      ]
                    })(
                      <RangePicker
                        disabledDate={this.disabledDate}
                        allowClear="true"
                        onChange={this.onDateChange}
                        format="YYYY-MM-DD"
                        disabled={this.state.disableField}
                        placeholder={['Start Day', 'End Day']}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={startTimeError ? 'error' : ''}
                    help={startTimeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Start Time
                        <Tooltip title="Start Time for offer">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('startTime', {
                      rules: [
                        {
                          required: true,
                          type: 'object',
                          message: 'Please input start time for offer',
                          whitespace: false
                        }
                      ]
                    })(
                      <TimePicker
                        minuteStep={minuteStep}
                        onChange={e =>
                          this.onTimeChange(e, 'selectedStartTime')
                        }
                        use12Hours
                        disabled={this.state.disableField}
                        placeholder="Start Time"
                        format={format}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={endTimeError ? 'error' : ''}
                    help={endTimeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        End Time
                        <Tooltip title="End Time for offer">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('endTime', {
                      rules: [
                        {
                          required: true,
                          type: 'object',
                          message: 'Please input end time for Tournament',
                          whitespace: false
                        }
                      ]
                    })(
                      <TimePicker
                        minuteStep={minuteStep}
                        onChange={e => this.onTimeChange(e, 'selectedEndTime')}
                        use12Hours
                        placeholder="End Time"
                        format={format}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={dayOfTheWeekError ? 'error' : ''}
                    help={dayOfTheWeekError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Day of the Week
                        <Tooltip title="Select the day of the week">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('dayOfTheWeek', {
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          message: 'Please select the day of the week!',
                          whitespace: false
                        }
                      ]
                    })(
                      <RadioGroup name={'daysOfTheWeek'}>
                        {daysOfTheWeek.map(item => (
                          <Radio value={item.value}>{item.text}</Radio>
                        ))}
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={repeatError ? 'error' : ''}
                    help={repeatError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Repeat
                        <Tooltip title="Select the repeat frequency">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('repeat', {
                      rules: [
                        {
                          required: false,
                          type: 'string',
                          message: 'Please select the repeat frequency!',
                          whitespace: false
                        }
                      ]
                    })(
                      <RadioGroup
                        name={'repeats'}
                        disabled={this.state.disableField}
                      >
                        {repeats.map(item => (
                          <Radio value={item.value}>{item.text}</Radio>
                        ))}
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={noOfRepeatsError ? 'error' : ''}
                    help={noOfRepeatsError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        No Of Repeats
                        <Tooltip title="Enter the number of repeats">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('noOfRepeats', {
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          message: 'Please input number of repeats!',
                          whitespace: true
                        }
                      ],
                      initialValue: ''
                    })(
                      <InputNumber
                        min={0}
                        disabled={this.state.disableField}
                        placeholder="Enter Number of Repeats"
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={segmentsError ? 'error' : ''}
                    help={segmentsError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Segments for Offer
                        <Tooltip title="Select all required segments">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('segments', {
                      rules: [
                        {
                          type: 'array',
                          required: true,
                          message: 'Please select at least on segment!'
                        }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        disabled={this.state.disableField}
                        showSearch
                        placeholder="Select a Segment"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {_.get(
                          this.state.gameWiseSegments,
                          this.state.selectedGameId,
                          []
                        ).map((segment, idx) => {
                          return (
                            <Select.Option
                              key={'segment' + idx}
                              value={segment.name}
                            >
                              {`${segment.name} (${_.get(
                                segment,
                                'entryFeeStart',
                                '-'
                              )} - ${_.get(segment, 'entryFeeEnd', '-')})`}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={entryFeeStartError ? 'error' : ''}
                    help={entryFeeStartError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Entry Fee
                        <Tooltip title="Enter the entry fee">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('entryFeeStart', {
                      rules: [
                        {
                          type: 'number',
                          required: true,
                          message: 'Please input entry fee start value!',
                          whitespace: true
                        }
                      ],
                      initialValue: ''
                    })(
                      <InputNumber
                        min={0}
                        placeholder="Enter Entry Fee Start"
                      />
                    )}
                  </FormItem>
                  <FormItem
                    className="hide"
                    validateStatus={entryFeeEndError ? 'error' : ''}
                    help={entryFeeEndError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Entry Fee End
                        <Tooltip title="Enter the entry fee end">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('entryFeeEnd', {
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          message: 'Please inputentry fee end value!',
                          whitespace: true
                        }
                      ],
                      initialValue: 0
                    })(
                      <InputNumber min={0} placeholder="Enter Entry Fee End" />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={currencyTypeError ? 'error' : ''}
                    help={currencyTypeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Currency Type
                        <Tooltip title="Select the currency type">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('currencyType', {
                      rules: [
                        {
                          required: true,
                          type: 'string',
                          message: 'Please select currency type!',
                          whitespace: false
                        }
                      ]
                    })(
                      <RadioGroup name={'currencyType'}>
                        {currencyType.map(item => (
                          <Radio value={item.value}>{item.text}</Radio>
                        ))}
                      </RadioGroup>
                    )}
                  </FormItem>
                  <CustomRewardsTable
                    rewardsTable={this.state.rewardsTable}
                    addReward={this.addReward}
                    deleteReward={this.deleteReward}
                  />
                  {/* <FormItem
                  validateStatus={rewardsError ? 'error' : ''}
                  help={rewardsError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Rewards
                      <Tooltip title="Name of the Rewards Configuration as defined by PM">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('rewards', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input reward json!',
                        whitespace: true
                      }
                    ],
                    initialValue: ''
                  })(
                    <TextArea
                      rows={3}
                      placeholder="Enter reward in JSON string, enter empty {} if not applicable"
                    />
                  )}
                </FormItem> */}
                  <FormItem
                    validateStatus={activeError ? 'error' : ''}
                    help={activeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Is Active
                        <Tooltip title="Enable active in offer">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('active', {
                      rules: [
                        {
                          required: true,
                          type: 'boolean',
                          message: 'Please select option for active!',
                          whitespace: false
                        }
                      ],
                      initialValue: false
                    })(
                      <Radio.Group
                        size="small"
                        onChange={this.activeChange}
                        buttonStyle="solid"
                      >
                        <Radio.Button value={false}>OFF</Radio.Button>
                        <Radio.Button value={true}>ON</Radio.Button>
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        Offer Again
                        <Tooltip title="Enable offer again">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('offerAgain', {
                      rules: [
                        {
                          required: true,
                          type: 'boolean',
                          message: 'Please select option for offer again!',
                          whitespace: false
                        }
                      ],
                      initialValue: false
                    })(
                      <Radio.Group
                        size="small"
                        onChange={this.offerAgainChange}
                        buttonStyle="solid"
                      >
                        <Radio.Button value={false}>OFF</Radio.Button>
                        <Radio.Button value={true}>ON</Radio.Button>
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={offerAgainFactorError ? 'error' : ''}
                    help={offerAgainFactorError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Offer Again Factor
                        <Tooltip title="Enter the offer again factor in numbers">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('offerAgainFactor', {
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          message: 'Please input offer again factor!',
                          whitespace: false
                        }
                      ],
                      initialValue: 0
                    })(
                      <InputNumber
                        min={0}
                        placeholder="Enter offer again factor"
                        disabled={
                          this.state.disableField || !this.state.offerAgain
                        }
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={coolDownPeriodError ? 'error' : ''}
                    help={coolDownPeriodError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Cooldown Period (In days)
                        <Tooltip title="Enter the offer again factor in numbers">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('coolDownPeriod', {
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          message: 'Please input cooldown period!',
                          whitespace: false
                        }
                      ],
                      initialValue: 0
                    })(
                      <InputNumber
                        min={0}
                        placeholder="Enter cool down period"
                        disabled={
                          this.state.disableField || !this.state.offerAgain
                        }
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={extraInfoError ? 'error' : ''}
                    help={extraInfoError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Extra Info
                        <Tooltip title="Enter the offer again factor in numbers">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('extraInfo', {
                      rules: [
                        {
                          type: 'string',
                          required: false,
                          message: 'Please input extra info json, if any!',
                          whitespace: true
                        }
                      ],
                      initialValue: '{}'
                    })(
                      <TextArea
                        rows={3}
                        placeholder="Enter extra info json, if any!"
                      />
                    )}
                  </FormItem>
                  <Row type="flex" justify="center">
                    <Button
                      type="primary"
                      disabled={
                        this.hasErrors(getFieldsError()) || this.readOnlyUser()
                      }
                      htmlType="submit"
                    >
                      {this.state.isEditOfferFlow
                        ? 'Update Offer'
                        : 'Create Offer'}
                    </Button>
                  </Row>
                </Col>
              </Row>
            )}
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dynamicUpselling: state.dynamicUpselling,
  currentUser: state.auth.currentUser,
  getUpsellAllSupportedCountriesResponse:
    state.dynamicUpselling.getUpsellAllSupportedCountriesResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...dynamicUpsellingActions }, dispatch)
});
const DUCreateOfferForm = Form.create()(DUCreateOffer);
export default connect(mapStateToProps, mapDispatchToProps)(DUCreateOfferForm);
