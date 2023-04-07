import React, { Component } from 'react';
import {
  Card,
  Spin,
  Typography,
  Popconfirm,
  InputNumber,
  Button,
  Avatar,
  message,
  Row,
  Icon,
  Modal,
  Form,
  Radio,
  Divider,
  Select,
  Input
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as asnActions from '../../actions/asnActions';
import * as userProfileActions from '../../actions/UserProfileActions';
import { isEmpty } from 'lodash';
const { Meta } = Card;
const RadioGroup = Radio.Group;
const { Title } = Typography;
const FormItem = Form.Item;
const { Option } = Select;

export class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannedUsersList: [],
      showBannedUsersList: false,
      showModal: false,
      selectedUser: {},
      showSearchedUser: false,
      searchedUser: null
    };
  }

  componentDidMount() {
    this.getBannedUsersList();
    this.props.form.validateFields();
  }

  getBannedUsersList = () => {
    this.props.actions.getLiveStreamBlockedUserList().then(() => {
      if (this.props.getLsBlockedUsersResponse.users) {
        this.setState({
          showBannedUsersList: true,
          bannedUsersList: this.props.getLsBlockedUsersResponse.users
        });
      } else {
        this.setState({
          showBannedUsersList: true,
          bannedUsersList: []
        });
      }
    });
  };

  updateUserBanStatus = (userId, isBlock = true) => {
    this.props.actions
      .updateLSBlockUserStatus({
        userId,
        isBlock
      })
      .then(() => {
        if (this.props.updateLsBlockUserResponse.responseCode === 200) {
          message.success(
            `User ${isBlock ? 'Banned' : 'Unbanned'} Successfully`,
            1.5
          );
          this.setState({
            searchedUser: null,
            showSearchedUser: false
          });
          this.getBannedUsersList();
        } else {
          message.error('Error while blocking. Try again.');
        }
      });
  };

  showModal = selectedUser => {
    this.setState({
      showModal: true,
      selectedUser
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false,
      selectedUser: {}
    });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  renderUser = (user, isBanFlow) => {
    const userId = typeof user.id === 'object' ? user.id.low : user.id;
    return (
      <Card
        style={{ width: 290, margin: 10 }}
        key={userId}
        actions={[
          <Popconfirm
            title={`Are you sure to ${isBanFlow ? 'ban' : 'unban'} this user?`}
            onConfirm={() => this.updateUserBanStatus(userId, isBanFlow)}
          >
            <Button type={isBanFlow ? 'danger' : 'primary'} size="small">
              {isBanFlow ? 'Ban' : 'Unban'}&nbsp;User
            </Button>
          </Popconfirm>
        ]}
      >
        <Meta
          avatar={
            <Avatar
              src={
                user.avatarUrl
                  ? user.avatarUrl
                  : user.avatars &&
                    !isEmpty(user.avatars) &&
                    Object.keys(user.avatars).length
                  ? user.avatars.regular || user.avatars.small
                  : ''
              }
              size="large"
              icon="user"
            />
          }
          title={
            <span>
              <Row type="flex" justify="space-between">
                <div>{user.displayName}</div>
                <div>
                  <Icon
                    style={{ fontSize: '20px' }}
                    type="info-circle"
                    theme="twoTone"
                    onClick={() => this.showModal(user)}
                  />
                </div>
              </Row>
            </span>
          }
          description={
            <span>
              <div>
                <b>User ID: </b>
                {userId}
              </div>
              <div>
                <b>Mobile: </b>
                {user.mobileNumber}
              </div>
              <div>
                <b>Is Pro: </b>
                {String(user.isPro)}
              </div>
            </span>
          }
        />
      </Card>
    );
  };

  // setSearchMode = searchMode => {
  //   this.setState({
  //     searchMode,
  //     showSearchedUser: false,
  //     searchedUser: {}
  //   });
  // };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isUserIdSearch = values.searchType === 'userId';
        const d = {
          method: isUserIdSearch ? 'getProfileById' : 'getProfileByMobile',
          data: isUserIdSearch
            ? { userId: values.input }
            : { mobileNumber: values.countryCode + values.input },
          responseType: isUserIdSearch
            ? 'getProfileByIdResponse'
            : 'getProfileByMobileResponse'
        };

        if (!isUserIdSearch && !/^\d{10}$/.test(values.input)) {
          message.info('Invalid Mobile Number');
          return;
        }

        this.props.actions[d.method](d.data).then(() => {
          if (
            this.props[d.responseType] &&
            this.props[d.responseType].profile
          ) {
            this.setState({
              showSearchedUser: true,
              searchedUser: this.props[d.responseType].profile
            });
          } else {
            this.setState({
              showSearchedUser: true,
              searchedUser: null
            });
          }
        });
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const { searchMode } = this.state;

    const errors = {
      searchType: isFieldTouched('searchType') && getFieldError('searchType'),
      input: isFieldTouched('input') && getFieldError('input'),
      [searchMode]: isFieldTouched(searchMode) && getFieldError(searchMode)
    };

    // Country code options
    const prefixSelector = getFieldDecorator('countryCode', {
      initialValue: '+91'
    })(
      <Select style={{ width: 85 }}>
        <Option value="+91">+91 🇮🇳 </Option>
        <Option value="+62">+62 🇮🇩 </Option>
        <Option value="+1">+1 🇺🇸 </Option>
      </Select>
    );

    return (
      <React.Fragment>
        <Card title="Search User for Banning" style={{ margin: 20 }}>
          <Row type="flex" justify="center">
            <Form onSubmit={e => this.handleSubmit(e)} layout="inline">
              <FormItem
                label={'By'}
                validateStatus={errors.searchType ? 'error' : ''}
              >
                {getFieldDecorator('searchType', {
                  rules: [
                    {
                      required: true
                    }
                  ],
                  initialValue: 'mobile'
                })(
                  <RadioGroup name="type">
                    <Radio.Button value={'userId'}>User Id</Radio.Button>
                    <Radio.Button value={'mobile'}>Mobile</Radio.Button>
                  </RadioGroup>
                )}
              </FormItem>
              {this.state.searchMode === 'userId' ? (
                <FormItem
                  validateStatus={errors[searchMode] ? 'error' : ''}
                  help={errors[searchMode] || ''}
                  label="User ID"
                >
                  {getFieldDecorator('input', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input value!',
                        whitespace: false,
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} style={{ width: 250 }} />)}
                </FormItem>
              ) : (
                <FormItem
                  validateStatus={errors[searchMode] ? 'error' : ''}
                  help={errors[searchMode] || ''}
                  label="Mobile"
                >
                  {getFieldDecorator('input', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter mobile no!',
                        whitespace: false,
                        type: 'string'
                      },
                      {
                        min: 9,
                        max: 14,
                        message: 'Please enter a valid mobile no!'
                      }
                    ]
                  })(
                    <Input
                      addonBefore={prefixSelector}
                      style={{ width: 250 }}
                      placeholder="Enter mobile no"
                    />
                  )}
                </FormItem>
              )}
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError())}
                  style={{ float: 'unset' }}
                >
                  Search
                </Button>
              </FormItem>
            </Form>
          </Row>
          {this.state.showSearchedUser ? (
            <>
              <Divider />
              {this.state.searchedUser ? (
                <>{this.renderUser(this.state.searchedUser, true)}</>
              ) : (
                'User Not found'
              )}
            </>
          ) : null}
        </Card>
        <Card title="Banned Users" style={{ margin: 20 }}>
          {this.state.showBannedUsersList ? (
            this.state.bannedUsersList.length ? (
              <Row type="flex">
                {this.state.bannedUsersList.map(user =>
                  this.renderUser(user, false)
                )}
              </Row>
            ) : (
              <Typography>
                <Title level={3}>No Banned User Found.</Title>
              </Typography>
            )
          ) : (
            <Row type="flex" justify="center">
              <Spin />
            </Row>
          )}
        </Card>
        <Modal
          title={'User Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          visible={this.state.showModal}
        >
          <Card bordered={false}>
            {JSON.stringify(this.state.selectedUser, null, 4)}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  getProfileByMobileResponse: state.userProfile.getProfileByMobileResponse,
  getProfileByIdResponse: state.userProfile.getProfileByIdResponse,
  getLsBlockedUsersResponse: state.asn.getLsBlockedUsersResponse,
  updateLsBlockUserResponse: state.asn.updateLsBlockUserResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...userProfileActions, ...asnActions },
    dispatch
  )
});

const UserManagementForm = Form.create()(UserManagement);

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementForm);
