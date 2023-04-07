// @flow

import React from 'react';
// import { connect } from 'react-redux';
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
import { cloneDeep } from 'lodash';

const FormItem = Form.Item;
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
class RewardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rewardData: [],
      totalCash: 0,
      totalTokens: 0,
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
        dataIndex: 'moneyCash'
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
            this.props.rewardData[this.props.rewardData.length - 1].start
              ? true
              : false;

          return (
            <div>
              {editable && (
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => this.delete(record.key)}
                >
                  <Button type="danger" size="small">
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

    // if (this.props.tableData !== 'SPECIAL') {
    //   if (
    //     this.props.tournament.cloneConfig &&
    //     this.props.tournament.cloneConfig.rewards &&
    //     this.props.tournament.cloneConfig.rewards.rankRanges
    //   ) {
    //     const rewards = this.props.tournament.cloneConfig.rewards;

    //     this.setState({
    //       rewardData: rewards.rankRanges,
    //       totalCash: rewards.totalCash,
    //       totalTokens: rewards.totalTokens,
    //       startRankVal:
    //         rewards.rankRanges[rewards.rankRanges.length - 1].end + 1
    //     });
    //     this.props.form.setFieldsValue({
    //       start: rewards.rankRanges[rewards.rankRanges.length - 1].end + 1,
    //       end: rewards.rankRanges[rewards.rankRanges.length - 1].end + 1,
    //       extReward: rewards.rankRanges[rewards.rankRanges.length - 1].extReward
    //     });
    //   }
    // }
  }

  /////////////////Delete Row from Table//////////////
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  delete() {
    const rewardData = cloneDeep(this.props.rewardData);
    const temp = rewardData.splice(this.props.rewardData.length - 1, 1);
    let totalCash = this.props.totalCash;
    let totalTokens = this.props.totalTokens ? this.props.totalTokens : 0;

    this.setState({
      startRankVal: rewardData.length > 0 ? temp[0].start : 1,
      totalCash: Number(
        totalCash - temp[0].moneyCash * (temp[0].end - temp[0].start + 1)
      ).toFixed(2),
      totalTokens:
        temp[0].tokens &&
        totalTokens - temp[0].tokens * (temp[0].end - temp[0].start + 1),
      rankRanges: rewardData,
      marginIn:
        ((this.state.currencyIn -
          (totalCash - temp[0].moneyCash * (temp[0].end - temp[0].start + 1))) *
          100) /
        this.state.currencyIn
    });
    this.props.form.setFieldsValue({
      start: temp[0].start,
      end: temp[0].start
    });
    this.props.rewardsTable({
      rankRanges: rewardData,
      totalCash: Number(
        totalCash -
          parseFloat(temp[0].moneyCash) * (temp[0].end - temp[0].start + 1)
      ).toFixed(2),
      totalTokens:
        temp[0].tokens &&
        totalTokens - temp[0].tokens * (temp[0].end - temp[0].start + 1)
    });
  }

  //////////////////////Add to Table////////////////////
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        const val = {
          start: values.start,
          end: values.end,
          moneyCash: values.moneyCash,
          tokens: values.tokens,
          extReward: values.extReward
        };
        const rewardData = cloneDeep(this.props.rewardData);
        rewardData.push(val);
        let totalCash = this.props.totalCash;
        let totalTokens = this.props.totalTokens ? this.props.totalTokens : 0;
        this.setState({
          showInfo: false,
          submitConfig: true,
          totalCash: Number(
            parseFloat(totalCash) +
              values.moneyCash * (values.end - values.start + 1)
          ).toFixed(2),
          totalTokens: Number(
            totalTokens + values.tokens * (values.end - values.start + 1)
          ).toFixed(2),
          rewardData,
          startRankVal: values.end + 1,
          maxRank_min: rewardData[rewardData.length - 1].end,
          marginIn:
            ((this.state.currencyIn -
              (totalCash +
                values.moneyCash * (values.end - values.start + 1))) *
              100) /
            this.state.currencyIn
        });
        this.props.rewardsTable({
          rankRanges: rewardData,
          totalCash: Number(
            parseFloat(totalCash) +
              values.moneyCash * (values.end - values.start + 1)
          ).toFixed(2),
          totalTokens: Number(
            totalTokens + values.tokens * (values.end - values.start + 1)
          ).toFixed(2)
        });
        this.props.form.resetFields([
          'start',
          'end',
          'moneyCash',
          'tokens',
          'extReward'
        ]);
      }
    });
    return false;
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
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

    // Data from porps
    const { rewardData, totalCash, totalTokens } = this.props;
    const temp = rewardData[rewardData.length - 1];
    const startRankVal =
      rewardData.length > 0
        ? temp && temp.end
          ? temp.end + 1
          : this.state.startRankVal
        : 1;

    // Form handeling props
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const startError = isFieldTouched('start') && getFieldError('start');
    const endError = isFieldTouched('end') && getFieldError('end');
    const moneyCashError =
      isFieldTouched('moneyCash') && getFieldError('moneyCash');
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
              validateStatus={moneyCashError ? 'error' : ''}
              help={moneyCashError || ''}
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
              {getFieldDecorator('moneyCash', {
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
            <Button
              type="primary"
              disabled={
                this.hasErrors(getFieldsError()) ||
                startRankVal > this.state.endRank_max
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

        <Table
          id="reward-table"
          bordered
          rowKey="start"
          dataSource={rewardData}
          columns={columns}
          size="small"
          rowClassName="editable-row"
          footer={() => (
            <div>
              <Tag color="green">{totalCash} Cash in Table</Tag>
              <Tag color="gold">{totalTokens} Tokens in Table</Tag>
            </div>
          )}
        />
      </React.Fragment>
    );
  }
}

// function mapStateToProps(state, ownProps) {
//   return { ...ownProps, tournament: state.tournaments };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(RewardTableActions, dispatch)
//   };
// }

const RewardTableForm = Form.create()(RewardTable);
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(RewardTableForm);
export default RewardTableForm;
