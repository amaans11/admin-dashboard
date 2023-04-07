import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Card,
  Form,
  message,
  Button,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Radio
} from 'antd';
import * as fraudActions from '../../actions/fraudActions';
import * as gameActions from '../../actions/gameActions';
import * as userDataActions from '../../actions/userDataActions';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class IsolatedBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getRequestType: null,
      gameId: null,
      fraudActivityData: [],
      fraudActivityDataFetched: false,
      blockingInfoData: [],
      blockingInfoDataFetched: false,
      showContentModal: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.makeBackendCall = this.makeBackendCall.bind(this);
  }

  componentDidMount() {
    this.getGamesList();
  }

  getGamesList() {
    var gamesList = [];
    this.props.actions.fetchGames().then(() => {
      if (this.props.gamesList) {
        this.props.gamesList.map(game => {
          gamesList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
      }
    });
    this.setState({
      gamesList
    });
  }

  selectDates(dates) {
    this.setState({
      startDate: moment(dates[0]).toISOString(true),
      endDate: moment(dates[1]).toISOString(true)
    });
  }

  makeBackendCall(data) {
    this.props.actions.blockUserDashboard(data).then(() => {
      if (this.props.blockUserDashboardResponse) {
        console.log(this.props.blockUserDashboardResponse);
        if (this.props.blockUserDashboardResponse.fraudServiceError) {
          message.error(
            this.props.blockUserDashboardResponse.fraudServiceError.message
              ? this.props.blockUserDashboardResponse.fraudServiceError.message
              : 'Could not block the user'
          );
        } else {
          message
            .success(
              this.props.blockUserDashboardResponse.message
                ? this.props.blockUserDashboardResponse.message
                : 'User blocked',
              1.5
            )
            .then(() => window.location.reload());
        }
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.searchCriteria == 'USER_ID') {
          if (values.searchFor.toString().length > 9) {
            message.error('UserId can not be of more than 9 digits');
            return;
          }
          let data = {
            userId: values.searchFor,
            gameId: values.gameId,
            reason: values.reason,
            startDate: moment(values.timeArray[0]).toISOString(true),
            endDate: moment(values.timeArray[1]).toISOString(true)
          };
          this.makeBackendCall(data);
        } else {
          let mobileNumberData = {
            mobileNumber: values.searchFor
          };
          this.props.actions.getUserByMobile(mobileNumberData).then(() => {
            if (this.props.getUserByMobileResponse) {
              if (
                this.props.getUserByMobileResponse.profile &&
                this.props.getUserByMobileResponse.profile.id
              ) {
                let data = {
                  userId: this.props.getUserByMobileResponse.profile.id,
                  gameId: values.gameId,
                  reason: values.reason,
                  startDate: moment(values.timeArray[0]).toISOString(true),
                  endDate: moment(values.timeArray[1]).toISOString(true)
                };
                this.makeBackendCall(data);
              } else {
                message.error(
                  this.props.getUserByMobileResponse.error &&
                    this.props.getUserByMobileResponse.error.message
                    ? this.props.getUserByMobileResponse.error.message
                    : 'Could not fetch userId'
                );
                return;
              }
            } else {
              message.error('Unable to fetch details for the mobile number');
              return;
            }
          });
        }
      }
    });
  }

  render() {
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
      searchFor: isFieldTouched('searchFor') && getFieldError('searchFor'),
      gameId: isFieldTouched('gameId') && getFieldError('gameId'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray'),
      reason: isFieldTouched('reason') && getFieldError('reason')
    };
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Isolated Game Block">
            <FormItem {...formItemLayout} label={'Search Criteria'}>
              {getFieldDecorator('searchCriteria', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: 'MOBILE_NUMBER'
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={'MOBILE_NUMBER'}>
                    Mobile Number
                  </Radio.Button>
                  <Radio.Button value={'USER_ID'}>User Id</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.searchFor ? 'error' : ''}
              help={errors.searchFor || ''}
              {...formItemLayout}
              label={<span>User Id/ Mobile Number</span>}
            >
              {getFieldDecorator('searchFor', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true,
                    type: 'number'
                  }
                ]
              })(<InputNumber style={{ width: 200 }} min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.gameId ? 'error' : ''}
              help={errors.gameId || ''}
              {...formItemLayout}
              label={<span>Game</span>}
            >
              {getFieldDecorator('gameId', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true,
                    type: 'number'
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: 500 }}
                  placeholder="Select a Game"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.gamesList}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              validateStatus={errors.timeArray ? 'error' : ''}
              help={errors.timeArray || ''}
              label={<span>Time Period</span>}
            >
              {getFieldDecorator('timeArray', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true,
                    type: 'array'
                  }
                ]
              })(
                <RangePicker
                  style={{ width: 500 }}
                  allowClear="true"
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  format="YYYY-MM-DD hh:mm A"
                  onChange={e => this.selectDates(e)}
                  placeholder={['Start Time', 'End Time']}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.reason ? 'error' : ''}
              help={errors.reason || ''}
              {...formItemLayout}
              label={<span>Reason</span>}
            >
              {getFieldDecorator('reason', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<TextArea rows={2} />)}
            </FormItem>
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
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames,
    blockUserDashboardResponse: state.fraud.blockUserDashboardResponse,
    getUserByMobileResponse: state.userData.getUserByMobileResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...fraudActions, ...gameActions, ...userDataActions },
      dispatch
    )
  };
}

const IsolatedBlockForm = Form.create()(IsolatedBlock);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IsolatedBlockForm);
