import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../actions/userActions'; // To be changed
import {
  Form,
  Input,
  Icon,
  Button,
  Row,
  Col,
  Card,
  InputNumber,
  Tooltip,
  message
} from 'antd';
import ImageUploader from './ImageUploader';

let id = 0;

class SpecialRewardConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      imageUrlList: []
    };
  }
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    this.setState({ disabled: false });
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let imageErrorFlag = false;
        values.specialRewards.map((item, index) => {
          if (!this.state.imageUrlList[index]) {
            imageErrorFlag = true;
          }
          item['imageUrl'] = this.state.imageUrlList[index];
          if (item.generateOn) {
            item.generateOn = item.generateOn.split(',');
          }
        });
        if (imageErrorFlag) {
          message.error('Images are mandatory in special rewards');
          return;
        }
        this.setState({ disabled: true });
        this.props.callbackFromParent(values.specialRewards);
      }
    });
  };

  imageCallback = (data, k) => {
    let list = [...this.state.imageUrlList];
    list[k] = data.id;
    this.setState({ imageUrlList: [...list] });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Card key={index}>
        <Row>
          <Col span={8}>
            <Form.Item {...formItemLayout} label={'ID'} required={true} key={k}>
              {getFieldDecorator(`specialRewards[${k}][id]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please input id.'
                  }
                ]
              })(<Input placeholder="Id" disabled={this.state.disabled} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Display Name'}
              required={true}
              key={k}
            >
              {getFieldDecorator(`specialRewards[${k}][displayName]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please Input Display name.'
                  }
                ]
              })(
                <Input
                  placeholder="Display Name"
                  disabled={this.state.disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'DL Action'}
              required={true}
              key={k}
            >
              {getFieldDecorator(`specialRewards[${k}][dlAction]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'DL Action'
                  }
                ]
              })(
                <Input placeholder="DL Action" disabled={this.state.disabled} />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'DL Action Param'}
              required={false}
              key={k}
            >
              {getFieldDecorator(`specialRewards[${k}][dlActionParam]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    whitespace: true,
                    message: 'dlActionParam is needed'
                  }
                ]
              })(
                <Input
                  placeholder="DL Action param"
                  disabled={this.state.disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Primary Message'}
              required={false}
              key={k}
            >
              {getFieldDecorator(`specialRewards[${k}][primaryMessage]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    whitespace: true,
                    message: 'primaryMessage is needed'
                  }
                ]
              })(
                <Input
                  placeholder="Primary Message"
                  disabled={this.state.disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Secondary Message'}
              required={false}
              key={k}
            >
              {getFieldDecorator(`specialRewards[${k}][secondaryMessage]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    whitespace: true,
                    message: 'secondaryMessage is needed'
                  }
                ]
              })(
                <Input
                  placeholder="Secondary Message"
                  disabled={this.state.disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div>
              <ImageUploader
                callbackFromParent={this.imageCallback}
                header={'Image URL'}
                actions={this.props.actions}
                banner={this.props.banner}
                indexVal={k}
                isMandatory={true}
              />
            </div>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Angle on Wheel'}
              required={true}
              key={k}
            >
              {getFieldDecorator(`specialRewards[${k}][angleOnWheel]`, {
                validateTrigger: ['onChange'],
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true,
                    message: 'angleOnWheel is needed'
                  }
                ]
              })(<InputNumber disabled={this.state.disabled} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={
                <span>
                  Generate On
                  <Tooltip title="Enter comma seperated dates in YYYYMMDD-HHmm format">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              required={false}
              key={k}
            >
              {getFieldDecorator(`specialRewards[${k}][generateOn]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    whitespace: true,
                    message: 'generateOn is needed'
                  }
                ]
              })(
                <Input
                  placeholder="YYYYMMDD-HHmm"
                  disabled={this.state.disabled}
                />
              )}
              {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.remove(k)}
                />
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </Card>
    ));
    return (
      <div>
        {formItems}
        <Form.Item>
          <Row justify="end">
            <Col span={12} push={8}>
              <Button type="dashed" onClick={this.add}>
                <Icon type="plus" /> Add Row
              </Button>
            </Col>
            <Col span={12}>
              {!this.state.disabled ? (
                <Button type="primary" onClick={this.handleSubmit}>
                  <Icon type="unlock" />
                  Save
                </Button>
              ) : (
                <Button disabled type="disabled">
                  <Icon type="lock" />
                  Saved
                </Button>
              )}
            </Col>
          </Row>
        </Form.Item>
      </div>
    );
  }
}

const SpecialRewardConfigForm = Form.create()(SpecialRewardConfig);

function mapStateToProps(state, ownProps) {
  return {
    state: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch) // To be changed
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialRewardConfigForm);
