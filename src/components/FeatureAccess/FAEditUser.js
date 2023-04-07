import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  InputNumber,
  Input,
  Tooltip,
  Icon,
  Radio,
  Button,
  Row,
  Col,
  Select,
  message
} from 'antd';
import * as userDataActions from '../../actions/userDataActions';
import { SUPER_ADMIN, SOCIAL_ADMIN } from '../../auth/userPermission';
const Option = Select.Option;
// type AddUser ={}
const FormItem = Form.Item;

export class FAEditUser extends Component {
  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, values) => {
      this.props.handleSubmit(values);
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  componentDidMount() {
    this.props.form.setFieldsValue({
      user: this.props.user,
      featuresAccess: this.props.featuresAccess
    });

    this.props.form.validateFields();
  }

  checkPermission = () => {
    return [SUPER_ADMIN, SOCIAL_ADMIN].filter(e =>
      this.props.currentUser.user_role.includes(e)
    ).length
      ? true
      : false;
  };
  render() {
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const {
      disableEditMode,
      searchMode = 'mobile',
      allFeatures,
      isMultiEditMode,
      isDeleteAccessFlow
    } = this.props;
    return (
      <Card
        style={{ margin: 20 }}
        title={'Edit User Feature Access'}
        extra={
          <Button onClick={() => disableEditMode(false)} type="primary">
            Back to User Search
          </Button>
        }
      >
        <Form onSubmit={this.handleSubmit}>
          {!isMultiEditMode ? (
            <FormItem
              {...formItemLayout2}
              label={
                <span>
                  {searchMode === 'userId' ? 'User Id' : 'Mobile Number'}
                  <Tooltip
                    title={`${
                      searchMode === 'userId' ? 'User Id' : 'Mobile Number'
                    } against which the data will be saved`}
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('user', {
                rules: [
                  {
                    type: 'number',
                    required: true,
                    message: `User Id can't be empty`,
                    whitespace: true
                  }
                ],
                initialValue: ''
              })(
                <Input
                  placeholder="Enter User Mobile Number / UserId!"
                  disabled={true}
                />
              )}
            </FormItem>
          ) : null}
          <FormItem
            {...formItemLayout2}
            label={
              <span>
                {isMultiEditMode
                  ? isDeleteAccessFlow
                    ? 'Features to delete'
                    : 'Features to add'
                  : 'Features'}
                <Tooltip
                  title={
                    isMultiEditMode
                      ? isDeleteAccessFlow
                        ? 'Select all the features to delete for all users'
                        : 'Select all the features to add for all users'
                      : 'Select all the features to apply to this user'
                  }
                >
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('featuresAccess', {
              rules: [
                {
                  type: 'array',
                  required: false,
                  message: 'Please select at least one feature',
                  whitespace: true
                }
              ]
            })(
              <Select
                mode="multiple"
                showSearch
                placeholder="Select all Feature that apply"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {[...allFeatures].map((feature, idx) => {
                  return (
                    <Select.Option key={'feature' + idx} value={feature}>
                      {feature}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <Row type="flex" justify="center">
            <Button
              type={isDeleteAccessFlow ? 'danger' : 'primary'}
              disabled={
                this.hasErrors(getFieldsError()) || !this.checkPermission()
              }
              htmlType="submit"
            >
              {isMultiEditMode
                ? isDeleteAccessFlow
                  ? 'Remove Features'
                  : 'Update Features'
                : 'Update'}
            </Button>
          </Row>
        </Form>
      </Card>
    );
  }
}

const FAEditUserForm = Form.create()(FAEditUser);

export default FAEditUserForm;
