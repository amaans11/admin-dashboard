// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Icon,
  Popconfirm,
  Tag
} from 'antd';
import * as userDataActions from '../../actions/userDataActions';
import * as influencerActions from '../../actions/influencerActions';
import { forEach, isEqual, remove } from 'lodash';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class InfluencerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      influencerList: [],
      showDetail: false,
      userDetail: {},
      showUserDetail: false
    };
    this.fetchBasicProfiles = this.fetchBasicProfiles.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.getAllDetails = this.getAllDetails.bind(this);
    this.addToList = this.addToList.bind(this);
    this.publish = this.publish.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.props.actions.getInfluencerConfig().then(() => {
      if (this.props.getInfluencerConfigResponse) {
        let influencerIds = JSON.parse(this.props.getInfluencerConfigResponse)
          .influencerUserIds;
        this.fetchBasicProfiles(influencerIds);
      }
    });
  }

  fetchBasicProfiles(userIds) {
    let data = {
      userIds: userIds
    };
    console.log('data', data);
    this.props.actions.getUserBasicProfileList(data).then(() => {
      if (this.props.getBasicUserDetailListResponse) {
        let influencerList = [];
        forEach(this.props.getBasicUserDetailListResponse.profiles, function(
          item
        ) {
          influencerList.push(item);
        });
        this.setState({
          influencerList: [...influencerList],
          showDetail: true
        });
      }
    });
  }

  removeItem(item, index) {
    let currentList = [...this.state.influencerList];
    remove(currentList, function(obj) {
      // return obj.id.low === item.id.low;
      return isEqual(obj.id === item.id);
    });
    this.setState({ influencerList: [...currentList] });
  }

  addToList(item) {
    let currentList = [...this.state.influencerList];
    currentList.push(item);
    this.setState({ influencerList: [...currentList] });
  }

  getAllDetails(userId) {
    let data = {
      userId: userId
    };
    this.props.actions.getUserBasicProfile(data).then(() => {
      if (this.props.getUserBasicProfileResponse) {
        this.setState({
          userDetail: { ...this.props.getUserBasicProfileResponse.profile },
          showUserDetail: true
        });
      }
    });
  }

  publish() {
    let userIdArray = this.state.influencerList.map(item => {
      return typeof item.id === 'object' ? item.id.low : item.id;
    });
    let userIdList = Array.from(new Set(userIdArray));
    let data = {
      influencerUserIds: userIdList
    };
    this.props.actions.setInfluencerConfig(data).then(() => {
      if (
        this.props.setInfluencerConfigResponse &&
        this.props.setInfluencerConfigResponse.success
      ) {
        window.location.reload();
      } else {
        message.error('Could not update the influencer list');
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!values.userId && !values.mobileNumber) {
          message.error('Please enter either UserId or Mobile Number');
          return;
        }
        if (values.userId) {
          this.getAllDetails(values.userId);
        } else {
          let data = {
            mobileNumber: values.mobileNumber
          };
          this.props.actions.getUserByMobile(data).then(() => {
            if (this.props.getUserByMobileResponse) {
              if (this.props.getUserByMobileResponse.error) {
                message.error(this.props.getUserByMobileResponse.error.message);
                return;
              } else {
                this.getAllDetails(
                  this.props.getUserByMobileResponse.profile.id
                );
              }
            } else {
              message.error('Unable to fetch details for the mobile number');
              return;
            }
          });
        }
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
        isFieldTouched('mobileNumber') && getFieldError('mobileNumber')
    };

    const { userDetail } = this.state;

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
                        message: 'Please input user id!',
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
                        message: 'Please input user id!',
                        whitespace: false,
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} style={{ width: 200 }} />)}
                </FormItem>
              </Col>
              <Col span={16} offset={8}>
                <Tag color="cyan">
                  PS: Preference will be given to UserId if both UserId and
                  Mobile Number is entered
                </Tag>
              </Col>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Search
              </Button>
            </Row>
          </Card>
          {this.state.showUserDetail && (
            <Card type="inner" title="User Details">
              <Row>
                <Col span={24}>
                  Display Name:{' '}
                  <strong>{this.state.userDetail.displayName}</strong>
                </Col>
                <Col span={24}>
                  Mobile Number:{' '}
                  <strong>{this.state.userDetail.mobileNumber}</strong>
                </Col>
                <Col span={24}>
                  User Id:{' '}
                  <strong>
                    {typeof userDetail.id === 'object'
                      ? userDetail.id.low
                      : userDetail.id}
                  </strong>
                </Col>
                <Col span={24}>
                  Tier: <strong>{this.state.userDetail.tier}</strong>
                </Col>
                <Col span={24}>
                  App Type:{' '}
                  <strong>{this.state.userDetail.isPro ? 'CASH' : 'PS'}</strong>
                </Col>
                <Col span={24}>
                  Avatar Id:{' '}
                  <strong>
                    {this.state.userDetail.avatarId
                      ? this.state.userDetail.avatarId
                      : ''}
                  </strong>
                </Col>
                <Col span={24}>
                  <img
                    style={{ width: '100px', height: 'auto' }}
                    src={this.state.userDetail.avatarUrl}
                    alt=""
                  />
                </Col>
                <Col style={{ marginTop: '10px' }} span={24}>
                  <Button
                    onClick={() => this.addToList(this.state.userDetail)}
                    type="primary"
                  >
                    Add To List
                  </Button>
                </Col>
              </Row>
            </Card>
          )}

          {this.state.showDetail && (
            <Card>
              <Button
                type="primary"
                size="large"
                onClick={() => this.publish()}
              >
                Save and Publish
              </Button>
              <Row>
                {this.state.influencerList.map((item, index) => {
                  return (
                    <Col key={index} span={6}>
                      <Card
                        type="inner"
                        title={item.displayName}
                        extra={
                          <Popconfirm
                            title="Are you sure you want to remove this user?"
                            onConfirm={() => this.removeItem(item, index)}
                          >
                            <Icon type="delete" />
                          </Popconfirm>
                        }
                      >
                        <Row>
                          <Col span={24}>
                            Display Name: <strong>{item.displayName}</strong>
                          </Col>
                          <Col span={24}>
                            Mobile Number: <strong>{item.mobileNumber}</strong>
                          </Col>
                          <Col span={24}>
                            User Id:{' '}
                            <strong>
                              {typeof item.id === 'object'
                                ? item.id.low
                                : item.id}
                            </strong>
                          </Col>
                          <Col span={24}>
                            Tier: <strong>{item.tier}</strong>
                          </Col>
                          <Col span={24}>
                            App Type:{' '}
                            <strong>{item.isPro ? 'CASH' : 'PS'}</strong>
                          </Col>
                          <Col span={24}>
                            <img
                              style={{ width: 'auto', height: '60px' }}
                              src={item.avatarUrl}
                              alt=""
                            />
                          </Col>
                          {item.acr && (
                            <div>
                              <Col span={24}>
                                ACR State:{' '}
                                <strong>{JSON.parse(item.acr).state}</strong>
                              </Col>
                              <Col span={24}>
                                ACR Id:{' '}
                                <strong>{JSON.parse(item.acr).roomId}</strong>
                              </Col>
                              <Col span={24}>
                                ACR Name:{' '}
                                <strong>{JSON.parse(item.acr).roomName}</strong>
                              </Col>
                              <Col span={24}>
                                ACR Language:{' '}
                                <strong>
                                  {JSON.parse(item.acr).roomLanguage}
                                </strong>
                              </Col>
                              <Col span={24}>
                                ACR Tag:{' '}
                                <strong>{JSON.parse(item.acr).roomTag}</strong>
                              </Col>
                            </div>
                          )}
                        </Row>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          )}
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getBasicUserDetailListResponse:
      state.userData.getBasicUserDetailListResponse,
    getInfluencerConfigResponse: state.influencer.getInfluencerConfigResponse,
    getUserBasicProfileResponse: state.userData.getUserBasicProfileResponse,
    getUserByMobileResponse: state.userData.getUserByMobileResponse,
    setInfluencerConfigResponse: state.influencer.setInfluencerConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...userDataActions, ...influencerActions },
      dispatch
    )
  };
}

const InfluencerListForm = Form.create()(InfluencerList);
export default connect(mapStateToProps, mapDispatchToProps)(InfluencerListForm);
