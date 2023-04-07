import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Input,
  Tooltip,
  DatePicker,
  Icon,
  Select,
  Button,
  InputNumber,
  message,
  Row,
  Col,
  Tag,
  Switch
} from 'antd';
import moment from 'moment';
import UploadSegment from '../../components/FileUploader/UploadSegment';
import * as offerActions from '../../actions/offerActions';

const FormItem = Form.Item;
const Option = Select.Option;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const businessDomains = ['RUMMY', 'POKER', 'FANTASY', 'GAMES'];

const styles = {
  notif: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20
  }
};
class CreateUserTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendNotification: false,
      csvFilePath: '',
      isPrimeUserList: false,
      creditToAllPrimeUser: false
    };
  }

  handleNotifChange = value => {
    this.setState({
      sendNotification: value
    });
  };
  segmentUrlCallback = data => {
    this.setState({ csvFilePath: data.id, csvUploaded: true });
  };
  handleSubmit = e => {
    const {
      csvFilePath,
      sendNotification,
      isPrimeUserList,
      creditToAllPrimeUser
    } = this.state;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(moment().diff(moment(values.ticketExpireAt), 'minutes'));
        if (moment().diff(moment(values.ticketExpireAt), 'minutes') >= 0) {
          message.error('Please enter a valid ticket expiry date!');
          return;
        }
        const data = {
          userIds: [],
          businessDomain: values.businessDomain,
          ticketExpireAt: moment(values.ticketExpireAt).format('x'),
          ticketValue: values.ticketValue,
          referenceId: values.referenceId,
          sendNotification: sendNotification,
          csvFilePath: !creditToAllPrimeUser ? csvFilePath : '',
          ticketCreatedSource: 'CSV',
          isPrimeUserList: isPrimeUserList,
          creditToAllPrimeUser: creditToAllPrimeUser,
          visibleAt:
            isPrimeUserList || creditToAllPrimeUser
              ? moment(values.visibleAt).format('x')
              : ''
        };
        this.props.actions.createUserTournamentTicket(data).then(() => {
          if (this.props.createUserTicketResponse.error) {
            message.error(this.props.createTicketResponse);
          } else {
            this.setState(
              {
                sendNotification: false
              },
              () => {
                window.location.reload();
                message.success('User Ticket uploaded successfully!', 10);
              }
            );
          }
        });
      }
    });
  };
  render() {
    const {
      sendNotification,
      isPrimeUserList,
      creditToAllPrimeUser
    } = this.state;
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
    const businessDomainError =
      isFieldTouched('businessDomain') && getFieldError('businessDomain');
    const ticketValueError =
      isFieldTouched('ticketValue') && getFieldError('ticketValue');
    const ticketExpireAtError =
      isFieldTouched('ticketExpireAt') && getFieldError('ticketExpireAt');
    const referenceIdError =
      isFieldTouched('referenceId') && getFieldError('referenceId');
    const visibleAtError =
      isFieldTouched('visibleAt') && getFieldError('visibleAt');

    console.log('state>>>', this.state);

    let domains = [...businessDomains];

    if (isPrimeUserList || creditToAllPrimeUser) {
      domains = [...businessDomains, 'GENERIC'];
    }
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Add Ticket">
            <FormItem {...formItemLayout} label={'User File'}>
              {getFieldDecorator('csvFile')(
                <UploadSegment callbackFromParent={this.segmentUrlCallback} />
              )}
            </FormItem>
            <Row style={{ marginBottom: 20 }}>
              <Col sm={8} style={styles.notif}>
                Is Prime User List
              </Col>
              <Col>
                <Switch
                  checked={isPrimeUserList}
                  onChange={e => this.setState({ isPrimeUserList: e })}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 20 }}>
              <Col sm={8} style={styles.notif}>
                Credit To All Prime User
              </Col>
              <Col>
                <Switch
                  checked={creditToAllPrimeUser}
                  onChange={e => {
                    this.setState({ creditToAllPrimeUser: e });
                  }}
                />
              </Col>
            </Row>
            <FormItem
              validateStatus={businessDomainError ? 'error' : ''}
              help={businessDomainError || ''}
              {...formItemLayout}
              label={
                <span>
                  Business Domain
                  <Tooltip title="Business Domain">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('businessDomain', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: 'Please select business domain!'
                  }
                ]
              })(
                <Select
                  style={{ width: 200 }}
                  placeholder="Select business domain"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {domains.map(type => (
                    <Option value={type}>{type}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={ticketExpireAtError ? 'error' : ''}
              help={ticketExpireAtError || ''}
              {...formItemLayout}
              label={
                <span>
                  Ticket Expiry
                  <Tooltip title="Ticket Expiry">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('ticketExpireAt', {
                rules: [
                  {
                    required: true,
                    type: 'object',
                    message: 'Please input ticket expiry!',
                    whitespace: false
                  }
                ]
              })(
                <DatePicker
                  allowClear="true"
                  showTime
                  format="YYYY-MM-DD hh:mm A"
                  placeholder={'Select Coupon Expiry'}
                />
              )}
            </FormItem>

            <FormItem
              validateStatus={ticketValueError ? 'error' : ''}
              help={ticketValueError || ''}
              {...formItemLayout}
              label={
                <span>
                  Ticket Value
                  <Tooltip title="Ticket Value">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('ticketValue', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input ticket value!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={referenceIdError ? 'error' : ''}
              help={referenceIdError || ''}
              {...formItemLayout}
              label={
                <span>
                  Reference Id
                  <Tooltip title="Reference Id">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('referenceId', {
                rules: [
                  {
                    required: true,
                    message: 'Please input Reference Id!',
                    whitespace: false
                  }
                ]
              })(<Input />)}
            </FormItem>

            {(isPrimeUserList || creditToAllPrimeUser) && (
              <FormItem
                validateStatus={visibleAtError ? 'error' : ''}
                help={visibleAtError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Visible At
                    <Tooltip title="Visible At">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('visibleAt', {
                  rules: [
                    {
                      required: true,
                      type: 'object',
                      message: 'Please input Visible At!',
                      whitespace: false
                    }
                  ]
                })(
                  <DatePicker
                    allowClear="true"
                    showTime
                    format="YYYY-MM-DD hh:mm A"
                    placeholder={'Select Visible At'}
                  />
                )}
              </FormItem>
            )}

            <Row>
              <Col sm={8} style={styles.notif}>
                Send Notification
              </Col>
              <Col>
                <Switch
                  checked={sendNotification}
                  onChange={e => this.handleNotifChange(e)}
                />
              </Col>
            </Row>
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
    createUserTicketResponse: state.offers.createUserTicketResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(offerActions, dispatch)
  };
}

const CreateUserTicketForm = Form.create()(CreateUserTicket);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUserTicketForm);
