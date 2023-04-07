import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  InputNumber,
  Row,
  Col,
  Icon,
  Radio,
  Button,
  Avatar,
  Typography,
  message,
  Divider,
  Modal,
  Popconfirm
} from 'antd';
import {
  FORM_ITEM_LAYOUT,
  FORM_ITEM_LAYOUT_WITHOUT_LABEL
} from '../HomeDiscoveryWidget/constants';
import * as userProfileActions from '../../actions/UserProfileActions';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Meta } = Card;
const { Paragraph } = Typography;
export class WipeUserProfile extends Component {
  state = {
    searchMode: 'mobile',
    userFound: false,
    userData: {},
    showModal: false
  };
  setSearchMode = mode => {
    this.setState({ searchMode: mode }, () => {
      this.props.form.setFieldsValue({
        searchFor: null
      });
    });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  showModal = user => {
    this.setState({ selectedUser: user, showModal: true });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };
  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isUserIdSearch = this.state.searchMode === 'userId';
        const d = {
          method: isUserIdSearch ? 'getProfileById' : 'getProfileByMobile',
          data: isUserIdSearch
            ? { userId: values.searchFor }
            : { mobileNumber: values.searchFor },
          responseType: isUserIdSearch
            ? 'getProfileByIdResponse'
            : 'getProfileByMobileResponse'
        };
        // if (!isUserIdSearch && !/^\d{10}$/.test(values.searchFor)) {
        //   message.info('Invalid Mobile Number');
        //   return;
        // }
        this.setState({
          userFound: false,
          userData: {}
        });
        this.props.actions[d.method](d.data).then(() => {
          let response = this.props[d.responseType];
          if (response && response.profile) {
            this.setState({
              userFound: true,
              userData: response.profile
            });
          } else {
            this.setState({ userFound: true, userData: {} });
          }
        });
        return;
      } else {
        message.error('Error in form, please check again.');
        return;
      }
    });
  };

  wipeUserData = user => {
    let userId = typeof user.id === 'object' ? user.id.low : user.id;
    this.props.actions.wipeUserProfile(userId).then(() => {
      if (this.props.wipeUserProfileResponse) {
        const { error, profile } = this.props.wipeUserProfileResponse;
        if (!error) {
          message.success('Profile Wiped successfully.');
          this.setState({
            userFound: true,
            userData: profile
          });
        } else {
          message.error(error.message || 'Error while wiping profile.');
        }
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

    const errors = {
      searchType: isFieldTouched('searchType') && getFieldError('searchType'),
      searchFor: isFieldTouched('searchFor') && getFieldError('searchFor')
    };

    const { userData, userFound } = this.state;
    return (
      <React.Fragment>
        <Card title="Search for User" style={{ margin: 20 }}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...FORM_ITEM_LAYOUT}
              label={'Search By'}
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
                <RadioGroup
                  name="type"
                  onChange={e => this.setSearchMode(e.target.value)}
                >
                  <Radio.Button value={'userId'}>User Id</Radio.Button>
                  <Radio.Button value={'mobile'}>Mobile Number</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.searchFor ? 'error' : ''}
              {...FORM_ITEM_LAYOUT}
              label={
                <span>
                  {this.state.searchMode === 'userId' ? 'User ID' : 'Mobile'}
                </span>
              }
            >
              {getFieldDecorator('searchFor', {
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
            <FormItem {...FORM_ITEM_LAYOUT_WITHOUT_LABEL}>
              <Row type="flex" justify="start">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError())}
                >
                  {'Search User'}
                </Button>
              </Row>
            </FormItem>
          </Form>
        </Card>
        {userFound ? (
          <Card title="User Search Result" style={{ margin: 20 }}>
            {Object.keys(userData).length ? (
              <Card
                style={{ width: 290 }}
                key={userData.id === 'object' ? userData.id.low : userData.id}
                actions={[
                  <Popconfirm
                    title="Are you sure that you want to wipe this user's data?"
                    onConfirm={() => this.wipeUserData(userData)}
                  >
                    <Button size="small" type="danger">
                      Wipe User Data
                    </Button>
                  </Popconfirm>
                ]}
              >
                <Meta
                  avatar={
                    <Avatar
                      src={
                        userData.avatarUrl
                          ? userData.avatarUrl
                          : // : Object.keys(userData.avatars).length
                            // ? userData.avatars.regular || userData.avatars.small
                            ''
                      }
                      size="large"
                    />
                  }
                  title={
                    <span>
                      <Row type="flex" justify="space-between">
                        <div>{userData.displayName}</div>
                        <div>
                          <Icon
                            style={{ fontSize: '20px' }}
                            type="info-circle"
                            theme="twoTone"
                            onClick={() => this.showModal(userData)}
                          />
                        </div>
                      </Row>
                    </span>
                  }
                  description={
                    <span>
                      <div>
                        <b>User ID: </b>
                        {userData.id === 'object'
                          ? userData.id.low
                          : userData.id}
                      </div>
                      <div>
                        <b>Mobile: </b>
                        {userData.mobileNumber}
                      </div>
                      <div>
                        <b>Is Pro: </b>
                        {String(userData.isPro)}
                      </div>
                    </span>
                  }
                />
              </Card>
            ) : (
              <Typography>
                <Paragraph>No User Found</Paragraph>
              </Typography>
            )}
          </Card>
        ) : null}
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
            {JSON.stringify(this.state.selectedUser, null, 8)}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  getProfileByMobileResponse: state.userProfile.getProfileByMobileResponse,
  getProfileByIdResponse: state.userProfile.getProfileByIdResponse,
  wipeUserProfileResponse: state.userProfile.wipeUserProfileResponse
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userProfileActions, dispatch)
  };
}

const WipeUserProfileForm = Form.create()(WipeUserProfile);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WipeUserProfileForm);
