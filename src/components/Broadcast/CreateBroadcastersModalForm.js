import React, { Component } from 'react';
import { Modal, Button, Form, Input, Icon } from 'antd';
const { Item, create } = Form;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

class CreateBroadcastersModal extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = e => {
    e.preventDefault();
    const { createBroadcasters } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        createBroadcasters();
      }
    });
  };
  render() {
    const {
      visible,
      handleCancel,
      emailId,
      name,
      handleInputChange
    } = this.props;
    const { handleSubmit } = this;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="Add Broadcasters"
          visible={visible}
          onCancel={handleCancel}
          footer={false}
          width={720}
        >
          <Form onSubmit={handleSubmit} {...formItemLayout}>
            <Item label="Name">
              {getFieldDecorator('Name', {
                rules: [{ required: true, message: 'Please input your Name!' }]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  setfieldsvalue={name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  name="name"
                />
              )}
            </Item>
            <Item label="Email Id">
              {getFieldDecorator('Email ID', {
                rules: [
                  { required: true, message: 'Please input your Email ID!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  setfieldsvalue={emailId}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Email ID"
                  name="emailId"
                />
              )}
            </Item>
            <Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const CreateBroadcastersModalForm = create({})(CreateBroadcastersModal);
export default CreateBroadcastersModalForm;
