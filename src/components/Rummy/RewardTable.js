// @flow

import React from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
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
  Divider
} from 'antd';
// type RewardTable ={}
const FormItem = Form.Item;
const rewardData = [];
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class RewardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rewardData,
      tableCash: 0,
      tableTokens: 0,
      startRankVal: 1
    };
    this.columns = [
      {
        title: 'Start Rank',
        dataIndex: 'start'
      },
      {
        title: 'End Rank',
        dataIndex: 'end'
      },
      {
        title: 'Cash',
        dataIndex: 'cash'
      },
      {
        title: 'Token',
        dataIndex: 'tokens'
      },
      {
        title: 'Extra',
        dataIndex: 'extReward'
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable =
            record.start ===
            this.state.rewardData[this.state.rewardData.length - 1].start
              ? true
              : false;

          return (
            <div>
              {editable && (
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => this.delete(record.key)}
                >
                  <Button type="primary" size="small">
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </div>
          );
        }
      }
    ];
  }

  componentDidMount() {
    this.props.form.validateFields();
    if (this.props.tableData !== 'SPECIAL') {
      if (
        this.props.tournament.cloneConfig &&
        this.props.tournament.cloneConfig.rewards &&
        this.props.tournament.cloneConfig.rewards.rankRanges
      ) {
        this.setState({
          rewardData: this.props.tournament.cloneConfig.rewards.rankRanges,
          tableCash: this.props.tournament.cloneConfig.rewards.totalCash,
          tableTokens: this.props.tournament.cloneConfig.rewards.totalTokens,
          startRankVal:
            this.props.tournament.cloneConfig.rewards.rankRanges[
              this.props.tournament.cloneConfig.rewards.rankRanges.length - 1
            ].end + 1
        });
        this.props.form.setFieldsValue({
          start:
            this.props.tournament.cloneConfig.rewards.rankRanges[
              this.props.tournament.cloneConfig.rewards.rankRanges.length - 1
            ].end + 1,
          end:
            this.props.tournament.cloneConfig.rewards.rankRanges[
              this.props.tournament.cloneConfig.rewards.rankRanges.length - 1
            ].end + 1,
          extReward: this.props.tournament.cloneConfig.rewards.rankRanges[
            this.props.tournament.cloneConfig.rewards.rankRanges.length - 1
          ].extReward
        });
      }
    } else {
    }
  }

  /////////////////Delete Row from Table//////////////
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  delete() {
    let rewardData = this.state.rewardData;
    var temp = rewardData.splice(this.state.rewardData.length - 1, 1);
    let tableCash = this.state.tableCash;
    let tableTokens = this.state.tableTokens;

    this.setState({
      startRankVal: temp[0].start,
      tableCash: tableCash - temp[0].cash * (temp[0].end - temp[0].start + 1),
      tableTokens:
        tableTokens - temp[0].tokens * (temp[0].end - temp[0].start + 1),
      rewardData,
      marginIn:
        ((this.state.currencyIn -
          (tableCash - temp[0].cash * (temp[0].end - temp[0].start + 1))) *
          100) /
        this.state.currencyIn
    });
    this.props.form.setFieldsValue({
      start: temp[0].start,
      end: temp[0].start
    });
    this.props.rewardsTable({
      rankRanges: rewardData,
      totalCash: tableCash - temp[0].cash * (temp[0].end - temp[0].start + 1),
      totalTokens: tableCash - temp[0].cash * (temp[0].end - temp[0].start + 1)
    });
  }
  //////////////////////Add to Table////////////////////
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let val = {
          start: values.start,
          end: values.end,
          cash: values.cash,
          tokens: values.tokens,
          extReward: values.extReward
        };
        let rewardData = [...this.state.rewardData];
        rewardData.push(val);
        let tableCash = this.state.tableCash;
        let tableTokens = this.state.tableTokens;
        this.setState({
          showInfo: false,
          submitConfig: true,
          tableCash: tableCash + values.cash * (values.end - values.start + 1),
          tableTokens:
            tableTokens + values.tokens * (values.end - values.start + 1),
          rewardData,
          startRankVal: values.end + 1,
          maxRank_min: rewardData[rewardData.length - 1].end,
          marginIn:
            ((this.state.currencyIn -
              (tableCash + values.cash * (values.end - values.start + 1))) *
              100) /
            this.state.currencyIn
        });
        this.props.rewardsTable({
          rankRanges: rewardData,
          totalCash: tableCash + values.cash * (values.end - values.start + 1),
          totalTokens:
            tableTokens + values.tokens * (values.end - values.start + 1)
        });
        this.props.form.resetFields(['start', 'end', 'cash', 'tokens']);
      }
    });
    return false;
  };
  render() {
    //////////////////Colums/////////////////////////
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'number',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });
    const { startRankVal } = this.state;
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
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    // Only show error after a field is touched.
    const startError = isFieldTouched('start') && getFieldError('start');
    const endError = isFieldTouched('end') && getFieldError('end');
    const cashError = isFieldTouched('cash') && getFieldError('cash');
    const tokensError = isFieldTouched('tokens') && getFieldError('tokens');
    const extRewardError =
      isFieldTouched('extReward') && getFieldError('extReward');
    return (
      <React.Fragment>
        {/* <Form onSubmit={this.handleSubmit}> */}
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
              {getFieldDecorator('start', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Starting Rank!',
                    whitespace: false
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
              {getFieldDecorator('end', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'End Rank!',
                    whitespace: false
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
                  <Tooltip title="End Rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('cash', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please enter cash amount!',
                    whitespace: false
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
              {getFieldDecorator('tokens', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input token amounts!',
                    whitespace: false
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
              validateStatus={extRewardError ? 'error' : ''}
              help={extRewardError || ''}
              {...formItemLayout}
              label={
                <span>
                  Extra Reward
                  <Tooltip title="Extra reward to be distributed for the rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('extReward', {
                rules: [
                  {
                    required: false,
                    message: 'Please input extra reward!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset={4} span={10}>
            <Tag color="green">{this.state.tableCash} Cash in Table</Tag>
            <Tag color="gold">{this.state.tableTokens} Tokens in Table</Tag>
          </Col>
          <Col span={10}>
            <Button
              type="primary"
              disabled={
                hasErrors(getFieldsError()) ||
                this.state.startRankVal > this.state.endRank_max
              }
              onClick={this.handleSubmit}
              icon="plus-circle-o"
              htmlType="button"
            >
              Add to Table
            </Button>
          </Col>
        </Row>
        <Divider />
        {/* </Form> */}

        {/* <div>
          <InputNumber disabled min={startRankVal} />
          <InputNumber min={0} />
        </div> */}

        <Table
          id="reward-table"
          bordered
          rowKey="start"
          dataSource={this.state.rewardData}
          columns={columns}
          size="small"
          rowClassName="editable-row"
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { ...ownProps, tournament: state.tournaments };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(RewardTableActions, dispatch)
//   };
// }

const RewardTableForm = Form.create()(RewardTable);
export default connect(
  mapStateToProps
  // mapDispatchToProps
)(RewardTableForm);
// export default RewardTableForm;
