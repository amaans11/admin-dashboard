import React, { Component } from 'react';
import {
  Button,
  Form,
  Icon,
  Row,
  Input,
  InputNumber,
  Select,
  Table,
  Card,
  Popconfirm
} from 'antd';

const FormItem = Form.Item;

export class CustomRewardsTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Games',
        dataIndex: 'games'
      },
      {
        title: 'Rewards',
        dataIndex: 'reward'
      },
      {
        title: 'Money Type',
        dataIndex: 'moneyType'
      },
      {
        title: 'Actions',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.props.deleteReward(record.id)}
              >
                <Button type="danger" size="small">
                  Delete
                </Button>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.games) this.props.addReward(values);
      }
    });
  };

  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const {
      getFieldDecorator,
      getFieldValue,
      isFieldTouched,
      getFieldError,
      getFieldsError
    } = this.props.form;

    const errors = {
      games: isFieldTouched('games') && getFieldError('games'),
      reward: isFieldTouched('reward') && getFieldError('reward'),
      moneyType: isFieldTouched('moneyType') && getFieldError('moneyType')
    };
    return (
      <React.Fragment>
        <Card title="Rewards">
          <Form onSubmit={this.handleSubmit} layout="inline">
            <FormItem
              label="Games"
              validateStatus={errors.games ? 'error' : ''}
            >
              {getFieldDecorator('games', {
                rules: [{ required: true }],
                initialValue: 0
              })(
                <InputNumber
                  placeholder="Games"
                  style={{ width: 75, marginRight: 8 }}
                  min={0}
                />
              )}
            </FormItem>
            <FormItem
              label="Reward"
              validateStatus={errors.reward ? 'error' : ''}
            >
              {getFieldDecorator('reward', {
                rules: [{ required: true }],
                initialValue: 0
              })(
                <InputNumber
                  placeholder="Reward"
                  style={{ width: 75, marginRight: 8 }}
                  min={0}
                />
              )}
            </FormItem>
            <FormItem
              label="Money Type"
              validateStatus={errors.moneyType ? 'error' : ''}
            >
              {getFieldDecorator('moneyType', {
                rules: [{ required: true }],
                initialValue: 'Winning'
              })(
                <Select
                  placeholder="Money Type"
                  style={{ width: 100, marginRight: 8 }}
                >
                  <Select.Option value={'Deposit'}>Deposit</Select.Option>
                  <Select.Option value={'Winning'}>Winning</Select.Option>
                  <Select.Option value={'Bonus'}>Bonus</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.hasErrors(getFieldsError())}
              >
                Add
              </Button>
            </FormItem>
          </Form>
          <Table
            style={{ marginTop: 20 }}
            id="custom-reward-table"
            bordered
            rowKey="id"
            dataSource={this.props.rewardsTable}
            columns={this.columns}
            size="small"
          />
        </Card>
      </React.Fragment>
    );
  }
}

const CustomRewardsTableForm = Form.create()(CustomRewardsTable);
export default CustomRewardsTableForm;
