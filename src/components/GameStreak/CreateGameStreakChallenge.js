import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameStreakActions from '../../actions/gameStreakActions';
import moment from 'moment';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  notification,
  message,
  Input,
  InputNumber,
  Select,
  Radio,
  DatePicker,
  Spin,
  Table,
  Typography,
  Divider,
  Popconfirm
} from 'antd';
import _ from 'lodash';
// import StreakReward from "./StreakReward";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Text } = Typography;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateGameStreakChallenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      isCountryListLoaded: false,
      isCountrySelected: false,
      reward: {},
      loadPage: false,
      active: false,
      bannerIndexing: []
    };
    this.columns = [
      {
        title: 'Page',
        dataIndex: 'page'
      },
      {
        title: 'Index',
        dataIndex: 'order'
      },
      {
        title: 'Actions',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.delete(record)}
              >
                <Button type="danger" size="small">
                  Delete
                </Button>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.form.validateFields();
    this.getSupportedCountries();
    if (this.props.streakChallengeDetails && this.props.editType) {
      this.populateFormData();
    } else {
      this.setState({ loadPage: true });
    }
  }

  componentWillUnmount() {
    this.props.actions.clearStreakChallengeForm();
  }

  populateFormData() {
    let { streakChallengeDetails } = this.props;
    let reward = streakChallengeDetails.reward
      ? JSON.parse(streakChallengeDetails.reward)
      : { reward: 0, moneyType: 'Bonus', currency: 'INR' };
    this.getSegments(streakChallengeDetails.countryCode).then(() => {
      let existingPages = this.props.streakChallengeDetails.bannerIndex.map(
        item => item.page
      );
      this.setState({
        pages: this.state.pages.filter(page => !existingPages.includes(page))
      });
    });
    let timeArray = [];
    timeArray.push(moment(streakChallengeDetails.startDate));
    timeArray.push(moment(streakChallengeDetails.endDate));
    this.setState({
      editFlag: true,
      selectedCountryCode: streakChallengeDetails.countryCode,
      isCountrySelected: true,
      countryCode: streakChallengeDetails.countryCode,
      name: streakChallengeDetails.name,
      description: streakChallengeDetails.description
        ? streakChallengeDetails.description
        : null,
      timeArray: timeArray,
      entryFee: streakChallengeDetails.entryFee
        ? Number(streakChallengeDetails.entryFee)
        : 0,
      noOfDays: streakChallengeDetails.noOfDays
        ? streakChallengeDetails.noOfDays
        : 0,
      gamePlaysPerDay: streakChallengeDetails.gamePlaysPerDay
        ? streakChallengeDetails.gamePlaysPerDay
        : 0,
      active: streakChallengeDetails.active ? true : false,
      segments: streakChallengeDetails.segments,
      attemptsCap: streakChallengeDetails.attemptsCap
        ? streakChallengeDetails.attemptsCap
        : 0,
      winsCap: streakChallengeDetails.winsCap
        ? streakChallengeDetails.winsCap
        : 0,
      bannerImageId: streakChallengeDetails.bannerImageId,
      bannerImageTag: streakChallengeDetails.bannerImageTag,
      bannerIndexing: streakChallengeDetails.bannerIndex,
      amount: reward.reward,
      moneyType: reward.moneyType,
      currency: reward.currency,
      loadPage: true
    });
  }

  async getSupportedCountries() {
    await this.props.actions.getStreakSupportedCountries();
    if (
      this.props.getStreakSupportedCountriesResponse &&
      this.props.getStreakSupportedCountriesResponse.country &&
      this.props.getStreakSupportedCountriesResponse.country.length > 0
    ) {
      this.setState({
        countryList: [
          ...this.props.getStreakSupportedCountriesResponse.country
        ],
        isCountryListLoaded: true
      });
    } else {
      message.error('Could not fetch supported country list');
    }
  }

  async getSegments(countryCode) {
    let data = {
      countryCode
    };
    await this.props.actions.getStreakSegments(data);
    if (
      this.props.getStreakSegmentsResponse &&
      this.props.getStreakSegmentsResponse.segments &&
      this.props.getStreakSegmentsResponse.segments.length > 0 &&
      this.props.getStreakSegmentsResponse.pages &&
      this.props.getStreakSegmentsResponse.pages.length > 0
    ) {
      this.setState({
        segmentsList: [...this.props.getStreakSegmentsResponse.segments],
        pages: [...this.props.getStreakSegmentsResponse.pages]
      });
    }
  }

  selectCountry(value) {
    this.getSegments(value);
    this.setState({ selectedCountryCode: value, isCountrySelected: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.bannerIndexing && this.state.bannerIndexing.length !== 0) {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let reward = {
            amount: values.amount,
            moneyType: values.moneyType,
            currency: values.currency
          };

          let data = {
            name: values.name,
            description: values.description ? values.description : null,
            startDate: moment(values.timeArray[0]).toISOString(true),
            endDate: moment(values.timeArray[1]).toISOString(true),
            entryFee: values.entryFee,
            noOfDays: values.noOfDays,
            gamePlaysPerDay: values.gamePlaysPerDay,
            segments: values.segments,
            active: values.active,
            reward: reward,
            countryCode: values.countryCode,
            attemptsCap: values.attemptsCap ? values.attemptsCap : null,
            winsCap: values.winsCap ? values.winsCap : null,
            bannerImageId: values.bannerImageId,
            bannerImageTag: values.bannerImageTag,
            bannerIndex: this.state.bannerIndexing
          };

          if (this.state.editFlag) {
            data['id'] = this.props.streakChallengeDetails.id;
          }
          this.props.actions.createOrUpdateStreakChallenge(data).then(() => {
            if (
              this.props.createUpdateStreakChallengeResponse &&
              this.props.createUpdateStreakChallengeResponse.success
            ) {
              message
                .success('Game Streak created/updated Successfully', 1.5)
                .then(() => {
                  this.props.history.push('/game-streak/list');
                });
            } else {
              message.error(
                this.props.createUpdateStreakChallengeResponse.error
              );
            }
          });
        }
      });
    } else {
      notification.open({
        message: 'There should be at least one entry in Indexing table'
      });
    }
  }

  delete = record => {
    let bannerIndexing = this.state.bannerIndexing;
    let newArray = _.filter(bannerIndexing, function(item) {
      return item !== record;
    });
    this.setState({
      bannerIndexing: [...newArray],
      pages: [...this.state.pages, record.page]
    });
  };

  handleAddToTable = () => {
    if (this.state.index !== undefined && this.state.selectedPage) {
      let val = {
        page: this.state.selectedPage,
        order: this.state.index
      };
      let bannerIndexing = [...this.state.bannerIndexing, val];
      let newPages = this.state.pages.filter(
        page => page !== this.state.selectedPage
      );
      this.setState({
        pages: newPages,
        selectedPage: null,
        index: null,
        bannerIndexing
      });
    } else {
      notification.open({
        message: 'Please check the Page and Index'
      });
    }
  };

  render() {
    // ------------ Colums ------------- //
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'number',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
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

    const errors = {
      countryCode:
        isFieldTouched('countryCode') && getFieldError('countryCode'),
      name: isFieldTouched('name') && getFieldError('name'),
      description:
        isFieldTouched('description') && getFieldError('description'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray'),
      entryFee: isFieldTouched('entryFee') && getFieldError('entryFee'),
      noOfDays: isFieldTouched('noOfDays') && getFieldError('noOfDays'),
      gamePlaysPerDay:
        isFieldTouched('gamePlaysPerDay') && getFieldError('gamePlaysPerDay'),
      segments: isFieldTouched('segments') && getFieldError('segments'),
      pages: isFieldTouched('pages') && getFieldError('pages'),
      attemptsCap:
        isFieldTouched('attemptsCap') && getFieldError('attemptsCap'),
      winsCap: isFieldTouched('winsCap') && getFieldError('winsCap'),
      amount: isFieldTouched('amount') && getFieldError('amount'),
      moneyType: isFieldTouched('moneyType') && getFieldError('moneyType'),
      currency: isFieldTouched('currency') && getFieldError('currency'),
      bannerImageId:
        isFieldTouched('bannerImageId') && getFieldError('bannerImageId'),
      bannerImageTag:
        isFieldTouched('bannerImageTag') && getFieldError('bannerImageTag')
    };

    return (
      <React.Fragment>
        {this.state.loadPage && (
          <Form onSubmit={e => this.handleSubmit(e)}>
            <Card
              title={
                this.state.editFlag
                  ? 'Edit Game Streak Challenge'
                  : 'Create Game Streak Challenge'
              }
            >
              {this.state.isCountryListLoaded && (
                <>
                  <FormItem
                    validateStatus={errors.countryCode ? 'error' : ''}
                    help={errors.countryCode || ''}
                    {...formItemLayout}
                    label={<span>Country Code</span>}
                  >
                    {getFieldDecorator('countryCode', {
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field',
                          whitespace: true
                        }
                      ],
                      initialValue: this.state.countryCode
                    })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select country"
                        optionFilterProp="children"
                        onSelect={e => this.selectCountry(e)}
                        filterOption={(input, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.countryList.map(country => (
                          <Option key={'country-' + country} value={country}>
                            {country}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  {this.state.isCountrySelected && (
                    <>
                      <FormItem
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name || ''}
                        {...formItemLayout}
                        label={<span>Name</span>}
                      >
                        {getFieldDecorator('name', {
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field',
                              whitespace: true
                            }
                          ],
                          initialValue: this.state.name
                        })(<Input />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.description ? 'error' : ''}
                        help={errors.description || ''}
                        {...formItemLayout}
                        label={'Description'}
                      >
                        {getFieldDecorator('description', {
                          rules: [
                            {
                              required: false,
                              message: 'Descriptopm',
                              whitespace: true
                            }
                          ],
                          initialValue: this.state.description
                        })(<TextArea rows={3} placeholder="Description" />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.timeArray ? 'error' : ''}
                        help={errors.timeArray || ''}
                        {...formItemLayout}
                        label={<span>Select Start and End Date</span>}
                      >
                        {getFieldDecorator('timeArray', {
                          rules: [
                            {
                              required: true,
                              type: 'array',
                              message: 'Please input time duration!',
                              whitespace: false
                            }
                          ],
                          initialValue: this.state.timeArray
                            ? this.state.timeArray
                            : []
                        })(
                          <RangePicker
                            allowClear="true"
                            format="DD-MMM-YYYY"
                            placeholder={['Start Date', 'End Date']}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.entryFee ? 'error' : ''}
                        help={errors.entryFee || ''}
                        {...formItemLayout}
                        label={'Entry Fee'}
                      >
                        {getFieldDecorator('entryFee', {
                          rules: [
                            {
                              required: true,
                              type: 'number',
                              message: 'Please input entry fee!',
                              whitespace: false
                            }
                          ],
                          initialValue: this.state.entryFee
                        })(<InputNumber style={{ width: '300px' }} min={0} />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.noOfDays ? 'error' : ''}
                        help={errors.noOfDays || ''}
                        {...formItemLayout}
                        label={'No Of Days'}
                      >
                        {getFieldDecorator('noOfDays', {
                          rules: [
                            {
                              required: true,
                              type: 'number',
                              message: 'Please input noOfDays!',
                              whitespace: false
                            }
                          ],
                          initialValue: this.state.noOfDays
                        })(<InputNumber style={{ width: '300px' }} min={0} />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.gamePlaysPerDay ? 'error' : ''}
                        help={errors.gamePlaysPerDay || ''}
                        {...formItemLayout}
                        label={'Game Plays Per Day'}
                      >
                        {getFieldDecorator('gamePlaysPerDay', {
                          rules: [
                            {
                              required: true,
                              type: 'number',
                              message: 'Please input gamePlaysPerDay!',
                              whitespace: false
                            }
                          ],
                          initialValue: this.state.gamePlaysPerDay
                        })(<InputNumber style={{ width: '300px' }} min={0} />)}
                      </FormItem>
                      {this.state.segmentsList &&
                        this.state.segmentsList.length > 0 && (
                          <FormItem
                            validateStatus={errors.segments ? 'error' : ''}
                            help={errors.segments || ''}
                            {...formItemLayout}
                            label={<span>segments</span>}
                          >
                            {getFieldDecorator('segments', {
                              rules: [
                                {
                                  required: true,
                                  message: 'This is a mandatory field',
                                  whitespace: true,
                                  type: 'array'
                                }
                              ],
                              initialValue: this.state.segments
                            })(
                              <Select
                                showSearch
                                mode={'multiple'}
                                style={{ width: '100%' }}
                                placeholder="Select segments"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toString()
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {this.state.segmentsList.map(segment => (
                                  <Option
                                    key={'segment-' + segment.name}
                                    value={segment.name}
                                  >
                                    {segment.name}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </FormItem>
                        )}
                      <FormItem {...formItemLayout} label={'Is Active'}>
                        {getFieldDecorator('active', {
                          rules: [
                            {
                              required: true,
                              type: 'boolean',
                              whitespace: false
                            }
                          ],
                          initialValue: this.state.active
                        })(
                          <Radio.Group size="small" buttonStyle="solid">
                            <Radio.Button value={false}>No</Radio.Button>
                            <Radio.Button value={true}>Yes</Radio.Button>
                          </Radio.Group>
                        )}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.attemptsCap ? 'error' : ''}
                        help={errors.attemptsCap || ''}
                        {...formItemLayout}
                        label={'Attempts Cap'}
                      >
                        {getFieldDecorator('attemptsCap', {
                          rules: [
                            {
                              required: false,
                              type: 'number',
                              message: 'Please input attemptsCap!',
                              whitespace: false
                            }
                          ],
                          initialValue: this.state.attemptsCap
                        })(<InputNumber style={{ width: '300px' }} min={0} />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.winsCap ? 'error' : ''}
                        help={errors.winsCap || ''}
                        {...formItemLayout}
                        label={'Wins Cap'}
                      >
                        {getFieldDecorator('winsCap', {
                          rules: [
                            {
                              required: false,
                              type: 'number',
                              message: 'Please input winsCap!',
                              whitespace: false
                            }
                          ],
                          initialValue: this.state.winsCap
                        })(<InputNumber style={{ width: '300px' }} min={0} />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.bannerImageId ? 'error' : ''}
                        help={errors.bannerImageId || ''}
                        {...formItemLayout}
                        label={<span>Banner Image Id</span>}
                      >
                        {getFieldDecorator('bannerImageId', {
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field',
                              whitespace: true
                            }
                          ],
                          initialValue: this.state.bannerImageId
                        })(<Input />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.bannerImageTag ? 'error' : ''}
                        help={errors.bannerImageTag || ''}
                        {...formItemLayout}
                        label={<span>Banner Image Tag</span>}
                      >
                        {getFieldDecorator('bannerImageTag', {
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field',
                              whitespace: true
                            }
                          ],
                          initialValue: this.state.bannerImageTag
                        })(<Input />)}
                      </FormItem>

                      <Card type="inner" title={'Indexing'}>
                        {this.state.pages && this.state.pages.length > 0 && (
                          <>
                            <div
                              style={{
                                textAlign: 'center',
                                marginBottom: '2em'
                              }}
                            >
                              <Text level={4}>Page: </Text>
                              <Select
                                showSearch
                                style={{ width: '40%' }}
                                placeholder="Select Page"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toString()
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                value={this.state.selectedPage}
                                onSelect={value =>
                                  this.setState({ selectedPage: value })
                                }
                              >
                                {this.state.pages.map(page => (
                                  <Option key={'page-' + page} value={page}>
                                    {page}
                                  </Option>
                                ))}
                              </Select>
                              <Divider type="vertical" />
                              <Text level={4}>Index: </Text>
                              <InputNumber
                                value={this.state.index}
                                onChange={value =>
                                  this.setState({ index: value })
                                }
                              />
                              <Divider type="vertical" />
                              <Button
                                type="primary"
                                onClick={this.handleAddToTable}
                              >
                                Add to Table
                              </Button>
                            </div>
                          </>
                        )}
                        <Table
                          id="indexing-table"
                          bordered
                          rowKey="page"
                          dataSource={this.state.bannerIndexing}
                          columns={columns}
                          size="small"
                        />
                      </Card>
                      <Card type="inner" title={'Reward'}>
                        {/* <StreakReward
                tableData={this.state.reward}
                getTableData={this.getTableData}
              /> */}
                        <FormItem
                          validateStatus={errors.amount ? 'error' : ''}
                          help={errors.amount || ''}
                          {...formItemLayout}
                          label={<span>Amount</span>}
                        >
                          {getFieldDecorator('amount', {
                            rules: [
                              {
                                required: true,
                                message: 'This is a mandatory field',
                                whitespace: false,
                                type: 'number'
                              }
                            ],
                            initialValue: this.state.amount
                          })(<InputNumber min={0} />)}
                        </FormItem>
                        <FormItem
                          validateStatus={errors.moneyType ? 'error' : ''}
                          help={errors.moneyType || ''}
                          {...formItemLayout}
                          label={<span>Money Type</span>}
                        >
                          {getFieldDecorator('moneyType', {
                            rules: [
                              {
                                required: true,
                                message: 'This is a mandatory field',
                                whitespace: true
                              }
                            ],
                            initialValue: this.state.moneyType
                          })(
                            <Select
                              showSearch
                              placeholder="Select money type"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.props.children
                                  .toString()
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {['Bonus', 'Deposit', 'Winning'].map(
                                moneyType => (
                                  <Option
                                    key={'moneyType-' + moneyType}
                                    value={moneyType}
                                  >
                                    {moneyType}
                                  </Option>
                                )
                              )}
                            </Select>
                          )}
                        </FormItem>
                        <FormItem
                          validateStatus={errors.currency ? 'error' : ''}
                          help={errors.currency || ''}
                          {...formItemLayout}
                          label={<span>Currency</span>}
                        >
                          {getFieldDecorator('currency', {
                            rules: [
                              {
                                required: true,
                                message: 'This is a mandatory field',
                                whitespace: true
                              }
                            ],
                            initialValue: this.state.currency
                          })(
                            <Select
                              showSearch
                              placeholder="Select currency"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.props.children
                                  .toString()
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {['INR', 'IDR', 'USD'].map(currency => (
                                <Option
                                  key={'currency-' + currency}
                                  value={currency}
                                >
                                  {currency}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Card>
                      <Row type="flex" justify="center">
                        <Col>
                          <Button
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
            </Card>
          </Form>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    streakChallengeDetails: state.gameStreak.streakChallengeDetails,
    getAllStreakChallengesResponse:
      state.gameStreak.getAllStreakChallengesResponse,
    editType: state.gameStreak.editType,
    getStreakSegmentsResponse: state.gameStreak.getStreakSegmentsResponse,
    getStreakSupportedCountriesResponse:
      state.gameStreak.getStreakSupportedCountriesResponse,
    createUpdateStreakChallengeResponse:
      state.gameStreak.createUpdateStreakChallengeResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...gameStreakActions }, dispatch)
  };
}
const CreateGameStreakChallengeForm = Form.create()(CreateGameStreakChallenge);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGameStreakChallengeForm);
