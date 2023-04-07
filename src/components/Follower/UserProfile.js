// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  InputNumber,
  message,
  Avatar
} from 'antd';
import * as userDataActions from '../../actions/userDataActions';
import _ from 'lodash';

const { Meta } = Card;

// type AddUser ={}
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class UserProfile extends React.Component {
  state = {
    userDetail: {},
    showDetail: false
  };
  componentDidMount() {
    this.props.form.validateFields();
  }

  editUser() {
    this.props.actions.editUserRole(this.state.userDetail);
    this.props.history.push('/user/create');
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          userId: values.userId
        };
        this.props.actions.getFollowerProfile(data).then(() => {
          if (this.props.getFollowerProfileResponse) {
            console.log('-->', this.props.getFollowerProfileResponse);
            if (this.props.getFollowerProfileResponse) {
              if (this.props.getFollowerProfileResponse.error) {
                message.error(
                  this.props.getFollowerProfileResponse.error.message
                );
              } else {
                console.log(this.props.getFollowerProfileResponse);
                this.setState({
                  showDetail: true,
                  userDetail: { ...this.props.getFollowerProfileResponse }
                });
              }
            } else {
              message.error(
                'Unable to process the request. Please get in touch with the backend team'
              );
            }
          }
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

    const userIdError = isFieldTouched('userId') && getFieldError('userId');
    const userDetail = this.state.userDetail;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="User Details">
            <Row>
              <FormItem
                validateStatus={userIdError ? 'error' : ''}
                help={userIdError || ''}
                {...formItemLayout}
                label={<span>User Id:</span>}
              >
                {getFieldDecorator('userId', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input userId!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber />)}
              </FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Search
              </Button>
            </Row>
          </Card>
          {this.state.showDetail && (
            <Card type="inner" title="User Details">
              <Row>
                <Col>{JSON.stringify(this.state.userDetail)}</Col>
                <Col span={4} />
                <Col span={8}>
                  <Card
                    style={{ width: 600 }}
                    cover={
                      <img
                        style={{ height: 200 }}
                        alt="example"
                        src={
                          userDetail.basicProfile.coverPhotos &&
                          userDetail.basicProfile.coverPhotos.regular
                            ? userDetail.basicProfile.coverPhotos.regular
                            : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                        }
                      />
                    }
                  >
                    <Row gutter={8}>
                      <Col span={8} />
                      <Col span={8}>
                        <Avatar
                          size={130}
                          src={
                            userDetail.basicProfile.avatars &&
                            userDetail.basicProfile.avatars.regular
                              ? userDetail.basicProfile.avatars.regular
                              : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                          }
                        />
                      </Col>
                      <Col span={4} />
                    </Row>
                  </Card>
                </Col>
                <Col span={8} />
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
    user: state.user,
    getFollowerProfileResponse: state.userData.getFollowerProfileResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userDataActions, dispatch)
  };
}

const UserProfileForm = Form.create()(UserProfile);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileForm);
