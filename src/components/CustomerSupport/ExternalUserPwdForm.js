import React from 'react';
import { Form, Input, Button, message } from 'antd';
import '../../styles/components/stories.css';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const formTailLayout = {
  // labelCol: { span: 8 },
  wrapperCol: { offset: 8, span: 16 }
};

class ExternalUserPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.password !== values.confirmPassword) {
          message.error("Password doesn't match");
        } else {
          this.props.handleSubmit(values);
        }
      }
    });
  };

  updateFormField = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value });
  };

  // Will be calling from parent using ref
  resetForm = () => {
    this.props.form.resetFields();
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const { formData } = this.props;
    console.log(formData);

    const isEditing = true;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <FormItem label="Email">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Please enter email!',
                  whitespace: true
                }
              ],
              initialValue: formData.email
            })(<Input placeholder="email" disabled={isEditing} />)}
          </FormItem>

          <FormItem label="Username">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please enter username!',
                  whitespace: true
                }
              ],
              initialValue: formData.user_name
            })(<Input placeholder="Username" disabled={isEditing} />)}
          </FormItem>

          <FormItem label="Password">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please enter password!',
                  whitespace: true
                }
              ]
            })(<Input.Password placeholder="password" />)}
          </FormItem>

          <FormItem label="Confirm Password">
            {getFieldDecorator('confirmPassword', {
              rules: [
                {
                  required: true,
                  message: 'Please enter confirm password!',
                  whitespace: true
                }
              ]
            })(<Input.Password placeholder="confirmPassword" />)}
          </FormItem>

          <FormItem
            {...formTailLayout}
            help="Password must be 8 chars long with atleast 1 Capital, 1 small, 1
                number and 1 special cahracter from (! @ # $ % ^ & *)"
          ></FormItem>

          <FormItem {...formTailLayout}>
            <Button
              type="primary"
              disabled={this.hasErrors(getFieldsError())}
              htmlType="submit"
              style={{ float: 'unset' }}
            >
              Submit
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const ExternalUserPwdForm = Form.create()(ExternalUserPwd);
export default ExternalUserPwdForm;
