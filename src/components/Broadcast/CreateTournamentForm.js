import React from 'react';
import { Form, Input, Icon, Button, Tooltip } from 'antd';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

const tailFormItemLayout = {
  wrapperCol: {
    offset: 8,
    span: 14
  }
};

class CreateTournament extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  // Will be calling from parent using ref
  resetForm = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
          label={
            <span>
              Tournament Name
              <Tooltip title="Tournament Name to display">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please enter Tournament Title!'
              }
            ]
          })(<Input placeholder="Enter Tournament Name" />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
            style={{ float: 'unset' }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const CreateTournamentForm = Form.create({})(CreateTournament);
export default CreateTournamentForm;
