import React from 'react';
import { Form, Icon, Button, Row, Col, InputNumber, Divider } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

class ReplaceUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roundUsers: [{ userId: null, seeding: null }]
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values.roundUsers);
      }
    });
  };

  resetForm = () => {
    this.props.form.resetFields();
  };

  handleFirstTime = isSpecialHashtag => {
    this.setState({ isSpecialHashtag, selectedContestType: '' });
  };

  hasErrors = fieldsError => {
    let isError = false;
    Object.keys(fieldsError).forEach(field => {
      // Check for nested fields, undefined for no errors
      if (typeof fieldsError[field] === 'object') {
        isError = isError || this.hasErrors(fieldsError[field]);
      } else {
        isError = isError || !!fieldsError[field];
      }
    });
    return isError;
  };

  deleteItem = itemIdx => {
    let { roundUsers } = this.state;
    roundUsers.splice(itemIdx, 1);
    this.setState({ roundUsers }, () => {
      this.props.form.validateFields();
    });
  };

  addItem = () => {
    const { roundUsers } = this.state;
    roundUsers.push({ userId: null, seeding: null });
    this.setState({ roundUsers });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const { roundUsers } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          {roundUsers.map((player, idx) => (
            <Row key={idx}>
              <Col span={10}>
                <FormItem label="userId" {...formItemLayout}>
                  {getFieldDecorator(`roundUsers[${idx}].userId`, {
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: 'Please enter userId!'
                      }
                    ],
                    initialValue: player.userId
                  })(<InputNumber placeholder="Player ID" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="seeding" {...formItemLayout}>
                  {getFieldDecorator(`roundUsers[${idx}].seeding`, {
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: 'Please enter seeding value!'
                      }
                    ],
                    initialValue: player.seeding
                  })(<InputNumber placeholder="seeding Value" />)}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem {...formItemLayout}>
                  <Button
                    type="danger"
                    ghost
                    onClick={() => this.deleteItem(idx)}
                  >
                    <Icon type="delete" />
                  </Button>
                </FormItem>
              </Col>
            </Row>
          ))}

          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button type="primary" ghost size="small" onClick={this.addItem}>
                Add new player info
              </Button>
            </Col>
          </Row>

          <Divider />

          <Row>
            <Col span={10} offset={10}>
              <Button
                type="primary"
                disabled={this.hasErrors(getFieldsError())}
                htmlType="submit"
                style={{ float: 'unset' }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

const ReplaceUserForm = Form.create()(ReplaceUser);
export default ReplaceUserForm;
