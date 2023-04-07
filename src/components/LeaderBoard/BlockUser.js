// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import {
  Card,
  Form,
  Tooltip,
  message,
  Icon,
  Button,
  Input,
  Row,
  Col,
  InputNumber,
  Tag
} from 'antd';
import * as leaderboardActions from '../../actions/leaderboardActions';
import * as userDataActions from '../../actions/userDataActions';
import * as userProfileActions from '../../actions/UserProfileActions';
// type BlockPlayer ={}
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class BlockUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceIdPresent: false,
      userDetails: {}
    };
    this.fetchDeviceIds = this.fetchDeviceIds.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getDeviceIdList = this.getDeviceIdList.bind(this);
  }
  componentDidMount() {
    this.props.form.validateFields();
  }

  fetchDeviceIds() {
    let userId = this.props.form.getFieldValue('userId');
    let mobileNumber = this.props.form.getFieldValue('mobileNumber');
    if (!userId && !mobileNumber) {
      message.error('Please enter either userId or mobile number');
      return;
    } else {
      if (userId) {
        this.getDeviceIdList(userId);
      } else {
        let data = {
          mobileNumber: mobileNumber
        };
        this.props.actions.getProfileByMobile(data).then(() => {
          if (
            this.props.getProfileByMobileResponse &&
            this.props.getProfileByMobileResponse.profile
          ) {
            this.props.form.setFieldsValue({
              userId: this.props.getProfileByMobileResponse.profile.id
            });
            this.getDeviceIdList(
              this.props.getProfileByMobileResponse.profile.id
            );
          } else {
            message.error('Could not fetch user profile');
          }
        });
      }
    }
  }

  getDeviceIdList(userId) {
    let userData = {
      userId: userId
    };
    this.props.actions.getUserStatusDetails(userData).then(() => {
      if (
        this.props.getUserStatusDetailsResponse &&
        this.props.getUserStatusDetailsResponse.payload &&
        this.props.getUserStatusDetailsResponse.payload.deviceIds
      ) {
        let deviceIdList = [
          ...this.props.getUserStatusDetailsResponse.payload.deviceIds
        ];

        deviceIdList = _.orderBy(deviceIdList, ['latestRecorded'], ['desc']);
        this.setState(
          {
            deviceIdList: [...deviceIdList]
          },
          () => this.setState({ deviceIdPresent: true })
        );
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!values.userId) {
          message.error('Please enter userId or mobile number');
          return;
        }
        this.props.actions
          .blockUserDevice(values.userId, values.deviceId)
          .then(() => {
            message.info('User Blocked successfully!');
          });
      }
    });
  };

  render() {
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

    const errors = {
      userId: isFieldTouched('userId') && getFieldError('userId'),
      mobileNumber:
        isFieldTouched('mobileNumber') && getFieldError('mobileNumber'),
      deviceId: isFieldTouched('deviceId') && getFieldError('deviceId')
    };
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="User Details">
            <Row>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.userId ? 'error' : ''}
                  {...formItemLayout}
                  label={<span>User Id</span>}
                >
                  {getFieldDecorator('userId', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input user id (number) !',
                        whitespace: false,
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} style={{ width: 200 }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.mobileNumber ? 'error' : ''}
                  {...formItemLayout}
                  label={<span>Mobile Number</span>}
                >
                  {getFieldDecorator('mobileNumber', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input mobile number ( number ) !',
                        whitespace: false,
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} style={{ width: 200 }} />)}
                </FormItem>
              </Col>
              <Col span={16} offset={3}>
                <Tag color="cyan">
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {' '}
                    Search is performed based on USER ID even though both fields
                    are filled
                  </span>
                </Tag>
              </Col>
              <Col span={8} offset={16}>
                <Button
                  style={{
                    backgroundColor: '#050a05',
                    marginTop: '10px',
                    color: '#fff'
                  }}
                  onClick={() => this.fetchDeviceIds()}
                >
                  Fetch Device Id
                </Button>
              </Col>
            </Row>
            {this.state.deviceIdPresent && (
              <Card>
                {this.state.deviceIdList.map((item, index) => (
                  <Row key={index}>
                    <Col span={8}>
                      Device Id: <strong>{item.id} </strong>
                    </Col>
                    <Col span={8}>
                      Time:{' '}
                      <strong>
                        {moment(item.latestRecorded, 'x').format(
                          'DD-MMM-YYYY HH:mm'
                        )}
                      </strong>
                    </Col>
                    <Col span={8}>
                      Blocked Status:{' '}
                      <strong>
                        {item.blocked ? 'Blocked' : 'Not Blocked'}
                      </strong>
                    </Col>
                  </Row>
                ))}
              </Card>
            )}
            <Row>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.deviceId ? 'error' : ''}
                  help={errors.deviceId || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Device ID
                      <Tooltip title="Enter the user device id">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('deviceId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input device id!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Block
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
    leaderboard: state.leaderboard,
    getProfileByMobileResponse: state.userProfile.getProfileByMobileResponse,
    getUserExtendedProfileResponse:
      state.userData.getUserExtendedProfileResponse,
    getUserStatusDetailsResponse: state.userData.getUserStatusDetailsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...leaderboardActions, ...userDataActions, ...userProfileActions },
      dispatch
    )
  };
}

const BlockUserForm = Form.create()(BlockUser);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockUserForm);
