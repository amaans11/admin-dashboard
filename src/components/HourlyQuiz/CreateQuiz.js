import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as serverConfigActions from '../../actions/ServerConfigActions';
import * as hourlyQuizActions from '../../actions/HourlyQuizActions';
import { Helmet } from 'react-helmet';
import ImageUploader from './ImageUploader';
import moment from 'moment';
import {
  Card,
  Select,
  Form,
  Input,
  Button,
  Tooltip,
  Icon,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Radio
} from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      question: '',
      questionType: null,
      questionTypeOptions: [],
      txtOptions: [],
      firstImageUrl: '',
      secondImageUrl: '',
      startTime: null,
      endTime: null,
      duration: 1,
      edit: false,
      firstCashReward: 0,
      firstTokenReward: 0,
      majorityCashReward: 0,
      majorityTokenReward: 0,
      firstRewardType: 'Token',
      majorityRewardType: 'Token'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.questionTypeSelect = this.questionTypeSelect.bind(this);
    this.toggleFirstRewardType = this.toggleFirstRewardType.bind(this);
    this.toggleMajorityRewardType = this.toggleMajorityRewardType.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    let questionTypeOptions = [];
    questionTypeOptions.push(
      <Option key={1} value={'TEXT'}>
        {'Text'}
      </Option>
    );
    questionTypeOptions.push(
      <Option key={2} value={'IMAGE'}>
        {'Image'}
      </Option>
    );
    this.setState({ questionTypeOptions: [...questionTypeOptions] });
    // EDITING Values
    if (this.props.quizData) {
      this.setState({
        edit: this.props.editType === 'EDIT' ? true : false,
        id: this.props.quizData.id ? this.props.quizData.id : null,
        questionType: this.props.quizData.questionType
          ? this.props.quizData.questionType
          : null,
        txtOptions: this.props.quizData.txtOptions
          ? this.props.quizData.txtOptions
          : []
      });
      // Calculate duration and set it
      let duration = 1;
      if (this.props.quizData.startTime && this.props.quizData.endTime) {
        let startTime = moment(this.props.quizData.startTime);
        let endTime = moment(this.props.quizData.endTime);
        duration = endTime.diff(startTime, 'minutes');
      }
      console.log('Duration', duration);

      this.props.form.setFieldsValue({
        question: this.props.quizData.question
          ? this.props.quizData.question
          : 'A',
        questionType: this.props.quizData.questionType
          ? this.props.quizData.questionType
          : null,
        startTime: this.props.quizData.startTime
          ? moment(this.props.quizData.startTime)
          : null,
        duration: duration
      });
      // Initialize images
      if (this.props.quizData.imgOptions) {
        if (this.props.quizData.imgOptions[0]) {
          this.setState({
            previewImage1: this.props.quizData.imgOptions[0].imgUrl,
            fileList1: [
              {
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: this.props.quizData.imgOptions[0].imgUrl
              }
            ],
            firstImageTitle: this.props.quizData.imgOptions[0].title
              ? this.props.quizData.imgOptions[0].title
              : null
          });
        }
        if (this.props.quizData.imgOptions[1]) {
          this.setState({
            previewImage2: this.props.quizData.imgOptions[1].imgUrl,
            fileList2: [
              {
                uid: -2,
                name: 'yyy.png',
                status: 'done',
                url: this.props.quizData.imgOptions[1].imgUrl
              }
            ],
            secondImageTitle: this.props.quizData.imgOptions[1].title
              ? this.props.quizData.imgOptions[1].title
              : null
          });
        }
      }

      if (this.props.quizData.rewards) {
        this.props.form.setFieldsValue({
          firstCashReward: this.props.quizData.rewards[0].cash
            ? this.props.quizData.rewards[0].cash
            : 0,
          firstTokenReward: this.props.quizData.rewards[0].tokens
            ? this.props.quizData.rewards[0].tokens
            : 0,
          majorityCashReward: this.props.quizData.rewards[1].cash
            ? this.props.quizData.rewards[1].cash
            : 0,
          majorityTokenReward: this.props.quizData.rewards[1].tokens
            ? this.props.quizData.rewards[1].tokens
            : 0
        });
        this.setState({
          firstRewardType: this.props.quizData.rewards[0].currencyType
        });
        this.setState({
          majorityRewardType: this.props.quizData.rewards[1].currencyType
        });
      }
    }
  }

  questionTypeSelect(questionType) {
    this.setState({ questionType: questionType });
  }

  firstImage = data => {
    console.log('data', data);
    this.setState({
      firstImageUrl: data.id
    });
  };

  secondImage = data => {
    this.setState({
      secondImageUrl: data.id
    });
  };

  toggleFirstRewardType(e) {
    this.setState({ firstRewardType: e.target.value });
  }

  toggleMajorityRewardType(e) {
    this.setState({ majorityRewardType: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        // Set Start & End time
        let startTime = moment(values.startTime).toISOString();
        let endTime = moment(values.startTime)
          .add(values.duration, 'minutes')
          .toISOString();
        // Reward Details
        let firstCashReward = 0;
        let firstTokenReward = 0;
        let majorityCashReward = 0;
        let majorityTokenReward = 0;
        if (this.state.firstRewardType === 'Token') {
          firstCashReward = 0;
          firstTokenReward = values.firstTokenReward
            ? values.firstTokenReward
            : 0;
        } else {
          firstTokenReward = 0;
          firstCashReward = values.firstCashReward ? values.firstCashReward : 0;
        }

        if (this.state.majorityRewardType === 'Token') {
          majorityCashReward = 0;
          majorityTokenReward = values.majorityTokenReward
            ? values.majorityTokenReward
            : 0;
        } else {
          majorityTokenReward = 0;
          majorityCashReward = values.majorityCashReward
            ? values.majorityCashReward
            : 0;
        }

        let firstReward = {
          start: 1,
          end: 1,
          cash: firstCashReward,
          tokens: firstTokenReward,
          extReward: null,
          currencyType: this.state.firstRewardType,
          type: 'FIRST_WINNER'
        };
        let majorityReward = {
          start: 2,
          end: -1,
          cash: majorityCashReward,
          tokens: majorityTokenReward,
          extReward: null,
          currencyType: this.state.majorityRewardType,
          type: 'MAJORITY_WINNER'
        };
        let rewards = [];
        rewards.push(firstReward);
        rewards.push(majorityReward);
        let imgOptions = [];
        let txtOptions = [];
        // Image Options
        if (values.questionType === 'IMAGE') {
          let firstImageDetails = {
            imgUrl: this.state.firstImageUrl,
            title: values.firstImageTitle
          };
          let secondImageDetails = {
            imgUrl: this.state.secondImageUrl,
            title: values.secondImageTitle
          };
          imgOptions.push(firstImageDetails);
          imgOptions.push(secondImageDetails);
        } else {
          // Text Options
          txtOptions.push(values.textOption1);
          txtOptions.push(values.textOption2);
          txtOptions.push(values.textOption3);
          txtOptions.push(values.textOption4);
        }
        // Request Body
        let data = {
          question: values.question,
          questionType: values.questionType,
          txtOptions: txtOptions ? txtOptions : null,
          imgOptions: imgOptions ? imgOptions : null,
          startTime: startTime,
          endTime: endTime,
          rewards: rewards
        };

        if (this.state.edit) {
          data.id = this.state.id;
          this.props.actions.updateHourlyQuiz(data).then(() => {
            this.props.history.push('/hourly/all');
          });
        } else {
          console.log(data);
          this.props.actions.createHourlyQuiz(data).then(() => {
            this.props.history.push('/hourly/all');
          });
        }
      }
    });
  }

  render() {
    const fixedFeildLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
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
      question: isFieldTouched('question') && getFieldError('question'),
      questionType:
        isFieldTouched('questionType') && getFieldError('questionType'),
      startTime: isFieldTouched('startTime') && getFieldError('startTime'),
      duration: isFieldTouched('duration') && getFieldError('duration'),
      firstCashReward:
        isFieldTouched('firstCashReward') && getFieldError('firstCashReward'),
      majorityCashReward:
        isFieldTouched('majorityCashReward') &&
        getFieldError('majorityCashReward'),
      firstTokenReward:
        isFieldTouched('firstTokenReward') && getFieldError('firstTokenReward'),
      majorityTokenReward:
        isFieldTouched('majorityTokenReward') &&
        getFieldError('majorityTokenReward'),
      textOption1:
        isFieldTouched('textOption1') && getFieldError('textOption1'),
      textOption2:
        isFieldTouched('textOption2') && getFieldError('textOption2'),
      textOption3:
        isFieldTouched('textOption3') && getFieldError('textOption3'),
      textOption4:
        isFieldTouched('textOption4') && getFieldError('textOption4'),
      firstImageTitle:
        isFieldTouched('firstImageTitle') && getFieldError('firstImageTitle'),
      secondImageDetails:
        isFieldTouched('secondImageDetails') && getFieldError('question')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Hourly Quiz |  Dashboard</title>
        </Helmet>
        <Card title="Hourly Quiz">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={errors.question ? 'error' : ''}
              help={errors.question || ''}
              {...fixedFeildLayout}
              label={
                <span>
                  Question
                  <Tooltip title="Quiz Question">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('question', {
                initialValue: this.state.question,
                rules: [
                  {
                    required: true,
                    message:
                      'This is a mandatory field and should be at max of 55 characters',
                    whitespace: true,
                    max: 55
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.questionType ? 'error' : ''}
              help={errors.questionType || ''}
              {...fixedFeildLayout}
              label={
                <span>
                  Question Type
                  <Tooltip title="Question Type">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('questionType', {
                initialValue: this.state.questionType,
                rules: [
                  {
                    required: true,
                    type: 'string',
                    message: 'This field is mandatory',
                    whitespace: true
                  }
                ]
              })(
                <Select
                  onChange={this.questionTypeSelect}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Question Type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.questionTypeOptions}
                </Select>
              )}
            </FormItem>
            {this.state.questionType === 'TEXT' && (
              <div>
                <FormItem
                  {...fixedFeildLayout}
                  label={
                    <span>
                      Answer 1
                      <Tooltip title="Answer Option">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('textOption1', {
                    initialValue: this.state.txtOptions[0],
                    rules: [
                      {
                        required: false,
                        whitespace: true,
                        max: 20
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  {...fixedFeildLayout}
                  label={
                    <span>
                      Answer 2
                      <Tooltip title="Answer Option">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('textOption2', {
                    initialValue: this.state.txtOptions[1],
                    rules: [
                      {
                        required: false,
                        whitespace: true,
                        max: 20
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  {...fixedFeildLayout}
                  label={
                    <span>
                      Answer 3
                      <Tooltip title="Answer Option">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('textOption3', {
                    initialValue: this.state.txtOptions[2],
                    rules: [
                      {
                        required: false,
                        whitespace: true,
                        max: 20
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  {...fixedFeildLayout}
                  label={
                    <span>
                      Answer 4
                      <Tooltip title="Answer Option">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('textOption4', {
                    initialValue: this.state.txtOptions[3],
                    rules: [
                      {
                        required: false,
                        whitespace: true,
                        max: 20
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              </div>
            )}
            {this.state.questionType === 'IMAGE' && (
              <Row>
                <Col span={6} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.firstImage}
                    header={'First Image'}
                    actions={this.props.actions}
                    previewImage={this.state.previewImage1}
                    fileList={this.state.fileList1}
                  />
                  <FormItem {...fixedFeildLayout}>
                    {getFieldDecorator('firstImageTitle', {
                      initialValue: this.state.firstImageTitle,
                      rules: [
                        {
                          required: false,
                          whitespace: true,
                          max: 20
                        }
                      ]
                    })(<Input placeholder={'First Image Title'} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <ImageUploader
                    callbackFromParent={this.secondImage}
                    header={'Second Image'}
                    actions={this.props.actions}
                    previewImage={this.state.previewImage2}
                    fileList={this.state.fileList2}
                  />
                  <FormItem {...fixedFeildLayout}>
                    {getFieldDecorator('secondImageTitle', {
                      initialValue: this.state.secondImageTitle,
                      rules: [
                        {
                          required: false,
                          whitespace: true,
                          max: 20
                        }
                      ]
                    })(<Input placeholder={'Second Image Title'} />)}
                  </FormItem>
                </Col>
              </Row>
            )}
            <FormItem
              validateStatus={errors.startTime ? 'error' : ''}
              help={errors.startTime || ''}
              {...fixedFeildLayout}
              label={
                <span>
                  Select Start Time
                  <Tooltip title="Date and time for Quiz Question">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('startTime', {
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
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  format="YYYY-MM-DD hh:mm A"
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.duration ? 'error' : ''}
              help={errors.duration || ''}
              {...fixedFeildLayout}
              label={
                <span>
                  Duration In Minutes
                  <Tooltip title="Answer Option">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('duration', {
                initialValue: this.state.duration,
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <Card type="inner" title="First Answer Winner">
              <Row>
                <Col span={24}>
                  <Radio.Group
                    onChange={this.toggleFirstRewardType}
                    size="small"
                    buttonStyle="solid"
                    value={this.state.firstRewardType}
                  >
                    <Radio.Button value={'Winning'}>Winner Cash</Radio.Button>
                    <Radio.Button value={'Bonus'}>Winner Bonus</Radio.Button>
                    <Radio.Button value={'Token'}>Token</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col span={12}>
                  <FormItem
                    validateStatus={errors.firstCashReward ? 'error' : ''}
                    help={errors.firstCashReward || ''}
                    {...fixedFeildLayoutHalf}
                    label={
                      <span>
                        First Cash Reward
                        <Tooltip title="Winnings Cash">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('firstCashReward', {
                      initialValue: this.state.firstCashReward,
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          whitespace: true
                        }
                      ]
                    })(
                      <InputNumber
                        disabled={this.state.firstRewardType === 'Token'}
                        min={0}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    validateStatus={errors.firstTokenReward ? 'error' : ''}
                    help={errors.firstTokenReward || ''}
                    {...fixedFeildLayoutHalf}
                    label={
                      <span>
                        First Token Reward
                        <Tooltip title="Winnings token">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('firstTokenReward', {
                      initialValue: this.state.firstTokenReward,
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          whitespace: true
                        }
                      ]
                    })(
                      <InputNumber
                        disabled={this.state.firstRewardType !== 'Token'}
                        min={0}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="Majority Answer Winner">
              <Row>
                <Col span={24}>
                  <Radio.Group
                    onChange={this.toggleMajorityRewardType}
                    size="small"
                    buttonStyle="solid"
                    value={this.state.majorityRewardType}
                  >
                    <Radio.Button value={'Winning'}>Winner Cash</Radio.Button>
                    <Radio.Button value={'Bonus'}>Winner Bonus</Radio.Button>
                    <Radio.Button value={'Token'}>Token</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col span={12}>
                  <FormItem
                    validateStatus={errors.majorityCashReward ? 'error' : ''}
                    help={errors.majorityCashReward || ''}
                    {...fixedFeildLayoutHalf}
                    label={
                      <span>
                        Majority Cash Reward
                        <Tooltip title="Winnings Cash">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('majorityCashReward', {
                      initialValue: this.state.majorityCashReward,
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          whitespace: true
                        }
                      ]
                    })(
                      <InputNumber
                        disabled={this.state.majorityRewardType === 'Token'}
                        min={0}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    validateStatus={errors.majorityTokenReward ? 'error' : ''}
                    help={errors.majorityTokenReward || ''}
                    {...fixedFeildLayoutHalf}
                    label={
                      <span>
                        Majority Token Reward
                        <Tooltip title="Winnings token">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('majorityTokenReward', {
                      initialValue: this.state.majorityTokenReward,
                      rules: [
                        {
                          type: 'number',
                          required: false,
                          whitespace: true
                        }
                      ]
                    })(
                      <InputNumber
                        disabled={this.state.majorityRewardType !== 'Token'}
                        min={0}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Save
            </Button>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    state: state,
    quizData: state.hourlyQuiz.quizData,
    editType: state.hourlyQuiz.editType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...hourlyQuizActions,
        ...serverConfigActions
      },
      dispatch
    ) // To be changed
  };
}
const CreateQuizForm = Form.create()(CreateQuiz);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateQuizForm);
