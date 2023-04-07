// @flow

import React from 'react';
import {
  Form,
  Row,
  InputNumber,
  Tooltip,
  Col,
  Icon,
  Input,
  Button,
  Tag,
  Popconfirm,
  Table,
  Divider,
  Select,
  message
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

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

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class StreakReward extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reward: []
    };
  }

  componentDidMount() {
    this.props.form.validateFields();
    if (this.props.tableData && this.props.tableData.length > 0) {
      this.setState({
        reward: [...this.props.tableData]
      });
    }
  }

  addItem() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { reward } = this.state;
        let streakRewardId = reward ? reward.length : 0;
        let row = {
          streakRewardId,
          amount: values.amount,
          moneyType: values.moneyType,
          currency: values.currency
        };
        reward.push(row);
        this.setState({ reward }, () => {
          this.props.form.resetFields();
          let returnObj =
            this.state.reward.length > 0 &&
            this.state.reward.map(row => {
              return {
                amount: row.amount,
                moneyType: row.moneyType,
                currency: row.currency
              };
            });
          this.props.getTableData(returnObj);
        });
      } else {
        message.error('All the reward fields are mandatory');
      }
    });
  }

  removeItem(record) {
    let { reward } = this.state;
    reward = _.filter(reward, function(row) {
      return row.streakRewardId !== record.streakRewardId;
    });
    this.setState(
      {
        reward
      },
      () => {
        let returnObj =
          this.state.reward.length > 0 &&
          this.state.reward.map(row => {
            return {
              amount: row.amount,
              moneyType: row.moneyType,
              currency: row.currency
            };
          });
        this.props.getTableData(returnObj);
      }
    );
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const columns = [
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount'
      },
      {
        title: 'Money Type',
        dataIndex: 'moneyType',
        key: 'moneyType'
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency'
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.removeItem(record)}
              shape="circle"
              icon="delete"
              type="danger"
            />
          </span>
        )
      }
    ];

    const errors = {
      amount: isFieldTouched('amount') && getFieldError('amount'),
      moneyType: isFieldTouched('moneyType') && getFieldError('moneyType'),
      currency: isFieldTouched('currency') && getFieldError('currency')
    };
    return (
      <React.Fragment>
        <Row>
          <Col span={8}>
            <FormItem
              validateStatus={errors.amount ? 'error' : ''}
              help={errors.amount || ''}
              {...formItemLayout}
              label={<span>Amount</span>}
            >
              {getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: false,
                    type: 'number'
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              validateStatus={errors.moneyType ? 'error' : ''}
              help={errors.moneyType || ''}
              {...formItemLayout}
              label={<span>Money Type</span>}
            >
              {getFieldDecorator('moneyType', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select money type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {['Bonus', 'Deposit', 'Winning'].map(moneyType => (
                    <Option key={'moneyType-' + moneyType} value={moneyType}>
                      {moneyType}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              validateStatus={errors.currency ? 'error' : ''}
              help={errors.currency || ''}
              {...formItemLayout}
              label={<span>Currency</span>}
            >
              {getFieldDecorator('currency', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select currency"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {['INR', 'IDR', 'USD'].map(currency => (
                    <Option key={'currency-' + currency} value={currency}>
                      {currency}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <Button onClick={() => this.addItem()}>Add Item</Button>
          </Col>
        </Row>
        <Divider />

        {this.state.reward && (
          <Table
            bordered
            rowKey="streakRewardId"
            dataSource={this.state.reward}
            columns={columns}
          />
        )}
      </React.Fragment>
    );
  }
}

const StreakRewardForm = Form.create()(StreakReward);
export default StreakRewardForm;
