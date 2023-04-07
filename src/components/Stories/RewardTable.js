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
  message,
  Card
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    lg: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    lg: { span: 14 }
  }
};

const ruleLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

class RewardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startRankVal: 1
    };

    this.columns = [
      {
        title: 'Start Rank',
        dataIndex: 'startRank',
        key: 'startRank'
      },
      {
        title: 'End Rank',
        dataIndex: 'endRank',
        key: 'endRank'
      },
      {
        title: 'cashPrize',
        dataIndex: 'cashPrize',
        key: 'cashPrize'
      },
      {
        title: 'Token',
        dataIndex: 'tokenPrize',
        key: 'tokenPrize'
      },
      {
        title: 'Special Prize',
        dataIndex: 'specialPrize',
        key: 'specialPrize'
      },
      {
        title: 'Bonus Cash',
        dataIndex: 'bonusCashPrize',
        key: 'bonusCashPrize'
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            {record.startRank ===
            this.props.prizeBreakups[this.props.prizeBreakups.length - 1]
              .startRank ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deleteRow()}
              >
                <Button type="danger" size="small">
                  Delete
                </Button>
              </Popconfirm>
            ) : (
              ''
            )}
          </span>
        )
      }
    ];
  }

  componentDidMount() {}

  deleteRow() {
    const { prizeBreakups } = this.props;
    const temp = prizeBreakups.splice(prizeBreakups.length - 1, 1);

    if (prizeBreakups.length) {
      const winners = temp[0].endRank - temp[0].startRank + 1;
      const totalWinners = this.props.totalWinners - winners;
      const totalCash =
        this.props.totalCash - (temp[0].cashPrize * winners || 0);
      const totalToken =
        this.props.totalToken - (temp[0].tokenPrize * winners || 0);
      const totalBonusCash =
        this.props.totalBonusCash - (temp[0].bonusCashPrize * winners || 0);

      this.props.rewardsTable({
        totalCash,
        totalToken,
        totalBonusCash,
        prizeBreakups,
        totalWinners
      });
    } else {
      this.props.rewardsTable({
        totalCash: 0,
        totalToken: 0,
        totalBonusCash: 0,
        prizeBreakups: [],
        totalWinners: 0
      });
    }

    this.setState({
      startRankVal: prizeBreakups.length > 0 ? temp[0].startRank : 1
    });

    this.props.form.setFieldsValue({
      startRank: temp[0].startRank,
      endRank: temp[0].endRank,
      cashPrize: temp[0].cashPrize || 0,
      tokenPrize: temp[0].tokenPrize || 0,
      bonusCashPrize: temp[0].bonusCashPrize || 0,
      specialPrize: temp[0].specialPrize || ''
    });
  }

  //////////////////////Add to Table////////////////////
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(
      [
        'startRank',
        'endRank',
        'cashPrize',
        'tokenPrize',
        'specialPrize',
        'bonusCashPrize'
      ],
      (err, values) => {
        if (!err) {
          // rank validation
          if (values.endRank < values.startRank) {
            message.warning("End rank can't be less then start rank");
          } else {
            const totalCash =
              this.props.totalCash +
              values.cashPrize * (values.endRank - values.startRank + 1);
            const totalToken =
              this.props.totalToken +
              values.tokenPrize * (values.endRank - values.startRank + 1);
            const totalBonusCash =
              this.props.totalBonusCash +
              values.bonusCashPrize * (values.endRank - values.startRank + 1);
            const totalWinners =
              this.props.totalWinners + (values.endRank - values.startRank + 1);
            const prizeBreakups = [...this.props.prizeBreakups];
            prizeBreakups.push(values);

            this.props.rewardsTable({
              totalCash,
              totalToken,
              totalBonusCash,
              prizeBreakups,
              totalWinners
            });

            this.setState({
              startRankVal: values.endRank + 1
            });

            this.props.form.resetFields([
              'startRank',
              'endRank',
              'cashPrize',
              'tokenPrize',
              'specialPrize',
              'bonusCashPrize'
            ]);
          }
        }
      }
    );
  };

  handleRuleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(['ruleText'], (err, values) => {
      if (!err) {
        const rules = [...this.props.rules];
        rules.push(values.ruleText);
        this.props.updateRewardRules(rules);
        this.props.form.resetFields(['ruleText']);
      }
    });
  };

  deleteRewardRule = deleteIdx => {
    const rules = [...this.props.rules];
    rules.splice(deleteIdx, 1);
    this.props.updateRewardRules(rules);
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const columns = this.columns;

    const { prizeBreakups } = this.props;
    const temp = prizeBreakups[prizeBreakups.length - 1];
    let { startRankVal } = this.state;
    startRankVal =
      prizeBreakups.length > 0
        ? temp && temp.endRank
          ? temp.endRank + 1
          : startRankVal
        : 1;

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const startError =
      isFieldTouched('startRank') && getFieldError('startRank');
    const endError = isFieldTouched('endRank') && getFieldError('endRank');
    const cashError = isFieldTouched('cashPrize') && getFieldError('cashPrize');
    const tokensError =
      isFieldTouched('tokenPrize') && getFieldError('tokenPrize');
    const bonusCashPrizeError =
      isFieldTouched('bonusCashPrize') && getFieldError('bonusCashPrize');
    const specialPrizeError =
      isFieldTouched('specialPrize') && getFieldError('specialPrize');

    return (
      <Card size="small" style={{ margin: 0 }}>
        <Row>
          <Col span={12}>
            <FormItem
              validateStatus={startError ? 'error' : ''}
              help={startError || ''}
              {...formItemLayout}
              label={
                <span>
                  Start Rank
                  <Tooltip title="Start Rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('startRank', {
                rules: [
                  {
                    required: true,
                    type: 'number'
                  }
                ],
                initialValue: startRankVal
              })(<InputNumber min={startRankVal} />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              validateStatus={endError ? 'error' : ''}
              help={endError || ''}
              {...formItemLayout}
              label={
                <span>
                  End Rank
                  <Tooltip title="End Rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('endRank', {
                rules: [
                  {
                    required: true,
                    type: 'number'
                  }
                ],
                initialValue: startRankVal
              })(<InputNumber min={startRankVal} />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem
              validateStatus={cashError ? 'error' : ''}
              help={cashError || ''}
              {...formItemLayout}
              label={
                <span>
                  Cash
                  <Tooltip title="CAsh to be distributed for the rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('cashPrize', {
                rules: [
                  {
                    required: true,
                    type: 'number'
                  }
                ],
                initialValue: 0
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              validateStatus={tokensError ? 'error' : ''}
              help={tokensError || ''}
              {...formItemLayout}
              label={
                <span>
                  Tokens
                  <Tooltip title="Token to be distributed for the rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('tokenPrize', {
                rules: [
                  {
                    required: true,
                    type: 'number'
                  }
                ],
                initialValue: 0
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <FormItem
              validateStatus={bonusCashPrizeError ? 'error' : ''}
              help={bonusCashPrizeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Bonus Cash Prize
                  <Tooltip title="Bonus cash prize to be distributed for the rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('bonusCashPrize', {
                rules: [
                  {
                    required: false,
                    type: 'number'
                  }
                ],
                initialValue: 0
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={specialPrizeError ? 'error' : ''}
              help={specialPrizeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Special Prize
                  <Tooltip title="Special prize to be distributed for the rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('specialPrize', {
                rules: [
                  {
                    required: false,
                    whitespace: true
                  }
                ]
              })(<Input placeholder="Enter special prize" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset={5} span={8}>
            <Button
              type="primary"
              disabled={this.hasErrors(getFieldsError())}
              onClick={this.handleSubmit}
              icon="plus-circle-o"
              htmlType="button"
            >
              Add to Table
            </Button>
          </Col>
        </Row>

        <Divider dashed />

        <Table
          bordered
          size="small"
          rowKey="startRank"
          dataSource={this.props.prizeBreakups}
          columns={columns}
          footer={() => (
            <div>
              <Tag color="red">{this.props.totalWinners} Winners in Table</Tag>
              <Tag color="green">{this.props.totalCash} Cash in Table</Tag>
              <Tag color="gold">{this.props.totalToken} Tokens in Table</Tag>
              <Tag color="blue">
                {this.props.totalBonusCash} Bonus Cash in Table
              </Tag>
            </div>
          )}
        />

        <Divider dashed />

        <Row>
          <Col offset={1} span={20}>
            <ul>
              <h4> Reward Rules </h4>
              {this.props.rules && this.props.rules.length ? (
                this.props.rules.map((rule, idx) => (
                  <li key={idx}>
                    <div className="rule-item">
                      <span>{rule}</span>
                      <Button
                        type="danger"
                        ghost
                        size="small"
                        onClick={() => this.deleteRewardRule(idx)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <p>
                  <em>Empty</em>
                </p>
              )}
            </ul>
          </Col>
          <Col span={18}>
            <FormItem
              {...ruleLayout}
              label={
                <span>
                  Rule
                  <Tooltip title="Reward rule, add to above list">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('ruleText', {
                rules: [
                  {
                    required: true,
                    whitespace: true
                  }
                ]
              })(
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 10 }}
                  placeholder="Enter reward rule"
                />
              )}
            </FormItem>
          </Col>
          <Col offset={1} span={2}>
            <Button
              size="small"
              ghost
              type="primary"
              onClick={this.handleRuleSubmit}
            >
              Add Rule
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

const RewardTableForm = Form.create()(RewardTable);
export default RewardTableForm;
