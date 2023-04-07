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
  Select,
  message
} from 'antd';

let id = 0;
const { Option } = Select;
class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      currencyOptions: []
    };
    this.validateJson = this.validateJson.bind(this);
  }
  componentDidMount() {
    let currencyOptions = [];
    currencyOptions.push(
      <Option key={'CASH'} value={'CASH'}>
        {'CASH'}
      </Option>
    );
    currencyOptions.push(
      <Option key={'TOKEN'} value={'TOKEN'}>
        {'TOKEN'}
      </Option>
    );
    currencyOptions.push(
      <Option key={'COUPON'} value={'COUPON'}>
        {'COUPON'}
      </Option>
    );
    this.setState({ currencyOptions: [...currencyOptions] });
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    this.setState({ disabled: false });
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  validateJson(e) {
    let val = e.target.value;
    if (val) {
      try {
        JSON.parse(val);
        return true;
      } catch (error) {
        message.error('Invalid JSON object');
        return false;
      }
    } else {
      return true;
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ disabled: true });
        this.props.callbackFromParent(values.generalRewards);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Card key={index}>
        <Row>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Amount'}
              required={true}
              key={k}
            >
              {getFieldDecorator(`generalRewards[${k}][amount]`, {
                validateTrigger: ['onChange'],
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true,
                    message: 'Please input amount.'
                  }
                ]
              })(<InputNumber disabled={this.state.disabled} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Currency'}
              required={true}
              key={k}
            >
              {getFieldDecorator(`generalRewards[${k}][currency]`, {
                validateTrigger: ['onChange'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please choose currency.'
                  }
                ]
              })(
                <Select
                  disabled={this.state.disabled}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Currency"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.currencyOptions}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Probability'}
              required={true}
              key={k}
            >
              {getFieldDecorator(`generalRewards[${k}][probability]`, {
                validateTrigger: ['onChange'],
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true,
                    message: 'Probability should be between 0 and 1'
                  }
                ]
              })(
                <InputNumber
                  min={0}
                  max={1}
                  step={0.01}
                  disabled={this.state.disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label={'Angle On Wheel'}
              required={true}
              key={k}
            >
              {getFieldDecorator(`generalRewards[${k}][angleOnWheel]`, {
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
          <Col span={16}>
            <Form.Item
              {...formItemLayout}
              label={'Extra Parameters'}
              required={false}
              key={k}
            >
              {getFieldDecorator(`generalRewards[${k}][extraParameters]`, {
                validateTrigger: ['onChange'],
                rules: [
                  {
                    whitespace: true,
                    message: 'Please input extra parameters.'
                  }
                ]
              })(
                <Input
                  onBlur={e => this.validateJson(e)}
                  style={{ width: '90%' }}
                  disabled={this.state.disabled}
                />
              )}
              {keys.length > 1 && (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.remove(k)}
                />
              )}
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

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(
  DynamicFieldSet
);

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
)(WrappedDynamicFieldSet);
