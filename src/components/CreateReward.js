import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as tournamentActions from '../actions/tournamentActions';
import {
  Table,
  Tooltip,
  Icon,
  InputNumber,
  Divider,
  Popconfirm,
  Form,
  Button,
  Card,
  Row,
  Input,
  Col,
  Tag
} from 'antd';
import '../styles/components/reward.css';
const rewardData = [];

const FormItem = Form.Item;
// const EditableContext = React.createContext();

// const EditableRow = ({ form, index, ...props }) => (
//   <EditableContext.Provider value={form}>
//     <tr {...props} />
//   </EditableContext.Provider>
// );

// const EditableFormRow = Form.create()(EditableRow);

// class EditableCell extends React.Component {
//   getInput = () => {
//     if (this.props.inputType === "number" && this.props.dataIndex === "cash") {
//       return <InputNumber min={0} />;
//     } else if (
//       this.props.inputType === "number" &&
//       this.props.dataIndex === "token"
//     ) {
//       return <InputNumber min={0} />;
//     } else {
//       return <InputNumber />;
//     }
//   };

//   render() {
//     const {
//       editing,
//       dataIndex,
//       title,
//       inputType,
//       record,
//       index,
//       ...restProps
//     } = this.props;
//     return (
//       <EditableContext.Consumer>
//         {form => {
//           const { getFieldDecorator } = form;
//           return (
//             <td {...restProps}>
//               {editing ? (
//                 <FormItem style={{ margin: 0 }}>
//                   {getFieldDecorator(dataIndex, {
//                     rules: [
//                       {
//                         required: true,
//                         message: `Please Input ${title}!`
//                       }
//                     ],
//                     initialValue: record[dataIndex]
//                   })(this.getInput())}
//                 </FormItem>
//               ) : (
//                 restProps.children
//               )}
//             </td>
//           );
//         }}
//       </EditableContext.Consumer>
//     );
//   }
// }
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateReward extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  componentWillUnmount() {
    this.setState({
      rewardData: []
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      rewardData,
      maxRanks: 0,
      maxCash: 0,
      maxTokens: 0,
      tableCash: 0,
      tableToken: 0,
      startRankVal: 1,
      rewardInfoAlert: '',
      showInfo: false,
      showInfoType: '',
      startRankForm: 1,
      endRankForm: 1,
      endRank_max: 1
    };
    this.columns = [
      {
        title: 'Start Rank',
        dataIndex: 'startRank'
      },
      {
        title: 'End Rank',
        dataIndex: 'endRank'
      },
      {
        title: 'Cash',
        dataIndex: 'realCash'
      },
      {
        title: 'Token',
        dataIndex: 'tokens'
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          // const editable = this.isEditing(record);
          const editable =
            record.key === this.state.data.length - 1 ? true : false;

          return (
            <div>
              {editable ? (
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => this.delete(record.key)}
                >
                  <a>Delete</a>
                </Popconfirm>
              ) : (
                ''
                // <React.Fragment>
                //    <a onClick={() => this.edit(record.key)}>Edit</a>
                //   <Divider type="vertical" /> */}
                //   <Popconfirm
                //     title="Sure to delete?"
                //     onConfirm={() => this.delete(record.key)}
                //   >
                //     <a>Delete</a>
                //   </Popconfirm>
                // </React.Fragment>
              )}
            </div>
          );
        }
      }
    ];
  }

  // isEditing = record => {
  //   return record.key === this.state.editingKey;
  // };

  // edit(key) {
  //   this.setState({ editingKey: key });
  // }

  // save(form, key) {
  //   form.validateFields((error, row) => {
  //     if (error) {
  //       return;
  //     }
  //     const newData = [...this.state.data];

  //     if (
  //       this.state.maxCash + this.state.data[key].cash <
  //       this.state.tableCash + row.cash
  //     ) {
  //       this.setState({
  //         // cashAvail: cashAvail - e,
  //         showInfo: true,
  //         showInfoType: "error",
  //         rewardInfoAlert: `you don't have enough cash to set new value`
  //       });
  //       return;
  //     }
  //     if (
  //       this.state.maxTokens + this.state.data[key].token <
  //       this.state.tableToken + row.token
  //     ) {
  //       this.setState({
  //         // cashAvail: cashAvail - e,
  //         showInfo: true,
  //         showInfoType: "error",
  //         rewardInfoAlert: `you don't have enough tokens to set new value`
  //       });
  //       return;
  //     }

  //     const index = newData.findIndex(item => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row
  //       });
  //       this.setState({ data: newData, editingKey: "" });
  //     } else {
  //       newData.push(data);
  //       this.setState({ data: newData, editingKey: "" });
  //     }
  //     this.setState({
  //       // cashAvail: cashAvail - e,
  //       showInfo: false
  //     });
  //   });
  // }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  delete(key) {
    if (key > -1) {
      let data = this.state.data;
      var temp = rewardData.splice(key, 1);
      let tableCash = this.state.tableCash;
      let tableToken = this.state.tableToken;

      this.setState({
        startRankVal: temp[0].startRank,
        tableCash:
          tableCash -
          temp[0].realCash * (temp[0].endRank - temp[0].startRank + 1),
        tableToken:
          tableToken -
          temp[0].tokens * (temp[0].endRank - temp[0].startRank + 1),
        data: data
      });
    }

    let rewardTableData = {
      data: rewardData,
      maxTokens: this.state.tableToken,
      maxCash: this.state.tableCash,
      maxRanks: this.state.maxRanks
      // rewardConfigName: this.state.rewardConfigName
    };

    this.props.rewardsTable(rewardTableData);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // let data = [...this.state.data];
        let val = {
          startRank: values.startRank,
          endRank: values.endRank,
          realCash: values.realCash,
          tokens: values.tokens,
          key: rewardData.length
        };
        rewardData.push(val);
        let tableCash = this.state.tableCash;
        let tableToken = this.state.tableToken;

        this.setState({
          showInfo: false,
          tableCash:
            tableCash +
            values.realCash * (values.endRank - values.startRank + 1),
          tableToken:
            tableToken +
            values.tokens * (values.endRank - values.startRank + 1),
          data: rewardData,
          startRankVal: values.endRank + 1
        });

        this.props.form.resetFields([
          'startRank',
          'endRank',
          'realCash',
          'tokens'
        ]);
        // let data = [...this.state.data];
        let rewardTableData = {
          data: rewardData,
          maxTokens:
            this.state.tableToken +
            values.tokens * (values.endRank - values.startRank + 1),
          maxCash:
            this.state.tableCash +
            values.realCash * (values.endRank - values.startRank + 1),
          maxRanks: this.state.maxRanks
          // rewardConfigName: this.state.rewardConfigName
        };

        this.props.rewardsTable(rewardTableData);

        // this.props.actions.addGroup(values);
      }
    });
  };
  render() {
    // const components = {
    //   body: {
    //     row: EditableFormRow,
    //     cell: EditableCell
    //   }
    // };

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
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const { startRankVal, endRank_max } = this.state;
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

    // const totalCash = e => {
    //   if (typeof e === "number") {
    //     this.setState({
    //       maxCash: e
    //     });
    //   }
    // };
    // const totalToken = e => {
    //   if (typeof e === "number") {
    //     this.setState({
    //       maxTokens: e
    //     });
    //   }
    // };
    // const realCashSpend = e => {
    //   if (
    //     typeof e === "number" &&
    //     e * (endRankForm - startRankForm + 1) + tableCash <= maxCash
    //   ) {
    //     this.setState({
    //       // realCashAvail: realCashAvail - e,
    //       showInfo: true,
    //       showInfoType: "info",
    //       rewardInfoAlert: `${maxCash -
    //         (tableCash +
    //           e *
    //             (endRankForm -
    //               startRankForm +
    //               1))} realCash will be left after using ${e} realCash per user`
    //     });
    //   } else if (
    //     typeof e === "number" &&
    //     e * (endRankForm - startRankForm + 1) + tableCash > maxCash
    //   ) {
    //     this.setState({
    //       // realCashAvail: realCashAvail - e,
    //       showInfo: true,
    //       showInfoType: "error",
    //       rewardInfoAlert: `You have already exhaust realCash available.`
    //     });
    //   } else {
    //     this.setState({
    //       // realCashAvail: realCashAvail - e,
    //       showInfo: true,
    //       showInfoType: "error",
    //       rewardInfoAlert: `You have to fill only numbers here.`
    //     });
    //   }
    // };
    // const tokenSpend = e => {
    //   if (
    //     typeof e === "number" &&
    //     e * (endRankForm - startRankForm + 1) + tableToken <= maxTokens
    //   ) {
    //     this.setState({
    //       showInfo: true,
    //       showInfoType: "info",
    //       rewardInfoAlert: `${maxTokens -
    //         (tableToken +
    //           e *
    //             (endRankForm -
    //               startRankForm +
    //               1))} tokens will be left after using ${e} tokens per user`
    //     });
    //   } else if (
    //     typeof e === "number" &&
    //     e * (endRankForm - startRankForm + 1) + tableToken > maxTokens
    //   ) {
    //     this.setState({
    //       // realCashAvail: realCashAvail - e,
    //       showInfo: true,
    //       showInfoType: "error",
    //       rewardInfoAlert: `You have already exhaust token available.`
    //     });
    //   } else {
    //     this.setState({
    //       // realCashAvail: realCashAvail - e,
    //       showInfo: true,
    //       showInfoType: "error",
    //       rewardInfoAlert: `You have to fill only numbers here.`
    //     });
    //   }
    // };
    const winnerPercent_onChange = e => {
      if (typeof e === 'number' && this.props.refMaxPlayers) {
        this.setState({
          endRank_max: e,
          maxRanks: e
          // ,endRank_max: Math.round((this.props.refMaxPlayers * e) / 100)
        });
      }
      let rewardTableData = {
        data: rewardData,
        maxTokens: this.state.tableToken,
        maxCash: this.state.tableCash,
        maxRanks: this.state.maxRanks
        // rewardConfigName: this.state.rewardConfigName
      };

      this.props.rewardsTable(rewardTableData);
    };
    // Check for end rank always more than or equal to start rnak
    const startRank_onChange = e => {
      if (typeof e === 'number') {
        this.setState({
          startRankForm: e
        });
      }
    };
    const endRank_onChange = e => {
      if (typeof e === 'number') {
        this.setState({
          endRankForm: e
        });
      }
    };
    const rewardConfigNameChange = e => {
      this.setState({
        rewardConfigName: e.target.value
      });
    };
    const maxRanksError =
      isFieldTouched('maxRanks') && getFieldError('maxRanks');
    const startRankError =
      isFieldTouched('startRank') && getFieldError('startRank');
    const endRankError = isFieldTouched('endRank') && getFieldError('endRank');
    const realCashError =
      isFieldTouched('realCash') && getFieldError('realCash');
    const tokensError = isFieldTouched('tokens') && getFieldError('tokens');
    // const totalRealCashError =
    //   isFieldTouched("totalRealCash") && getFieldError("totalRealCash");
    // const totalTokensError =
    //   isFieldTouched("totalTokens") && getFieldError("totalTokens");
    const rewardConfigNameError =
      isFieldTouched('rewardConfigName') && getFieldError('rewardConfigName');
    return (
      <React.Fragment>
        <Card bordered={false} title="Rewards Details">
          <FormItem
            validateStatus={rewardConfigNameError ? 'error' : ''}
            help={rewardConfigNameError || ''}
            {...formItemLayout}
            label={
              <span>
                Rewards Config Name
                <Tooltip title="Name of the Rewards Configuration as defined by PM">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('rewardConfigName', {
              rules: [
                {
                  required: true,
                  message: 'Please input name!',
                  whitespace: true
                }
              ]
            })(<Input onChange={rewardConfigNameChange} />)}
          </FormItem>
          <FormItem
            validateStatus={maxRanksError ? 'error' : ''}
            help={maxRanksError || ''}
            {...formItemLayout}
            label={
              <span>
                Max. Winner Rank
                <Tooltip title="Max. Rank of Winner of a tournament">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('maxRanks', {
              rules: [
                {
                  required: true,
                  type: 'number',
                  message: 'Please input Max. Rank of Winner of a tournament!',
                  whitespace: false
                }
              ]
            })(<InputNumber min={1} onChange={winnerPercent_onChange} />)}
          </FormItem>
          {/* <Row>
            <Col span={12}>
              <FormItem
                validateStatus={totalRealCashError ? "error" : ""}
                help={totalRealCashError || ""}
                {...formItemLayout}
                label={
                  <span>
                    Cash Prize Offered
                    <Tooltip title="Total Cash Prizes on offer">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator("totalRealCash", {
                  rules: [
                    {
                      required: true,
                      type: "number",
                      message: "Please input realCash to distribute!",
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} onChange={totalCash} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateStatus={totalTokensError ? "error" : ""}
                help={totalTokensError || ""}
                {...formItemLayout}
                label={
                  <span>
                    Token Prize Offered
                    <Tooltip title="Total Token Prizes on offer">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator("totalTokens", {
                  rules: [
                    {
                      required: true,
                      type: "number",
                      message: "Please input token to distribute!",
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} onChange={totalToken} />)}
              </FormItem>
            </Col>
          </Row> */}
          <Divider>Pricing Table</Divider>

          {/* {showInfo ? (
            <Alert message={rewardInfoAlert} type={showInfoType} showIcon />
          ) : (
            ""
          )} */}
          <Row>
            <Col span={12}>
              <FormItem
                validateStatus={startRankError ? 'error' : ''}
                help={startRankError || ''}
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
                      type: 'number',
                      message: 'Starting Rank!',
                      whitespace: false
                    }
                  ],
                  initialValue: startRankVal
                })(
                  <InputNumber
                    disabled
                    onChange={startRank_onChange}
                    min={startRankVal}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateStatus={endRankError ? 'error' : ''}
                help={endRankError || ''}
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
                      type: 'number',
                      message: 'End Rank!',
                      whitespace: false
                    }
                  ]
                })(
                  <InputNumber
                    disabled={
                      startRankVal === endRank_max || startRankVal > endRank_max
                        ? true
                        : false
                    }
                    min={startRankVal}
                    max={endRank_max}
                    onChange={endRank_onChange}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                validateStatus={realCashError ? 'error' : ''}
                help={realCashError || ''}
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
                {getFieldDecorator('realCash', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please enter cash amount!',
                      whitespace: false
                    }
                  ]
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
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset={4} span={10}>
              <Tag color="green">{this.state.tableCash} Cash in Table</Tag>
              <Tag color="gold">{this.state.tableToken} Tokens in Table</Tag>
            </Col>
            <Col span={10}>
              <Button
                type="primary"
                icon="plus-circle-o"
                disabled={hasErrors(getFieldsError())}
                htmlType="button"
                onClick={this.handleSubmit}
              >
                Add to Table
              </Button>
            </Col>
          </Row>
          <Table
            id="reward-table"
            bordered
            dataSource={this.state.data}
            columns={columns}
            size="small"
            rowClassName="editable-row"
          />
        </Card>
      </React.Fragment>
    );
  }
}

const CreateRewardForm = Form.create()(CreateReward);
// export default CreateRewardForm;
function mapStateToProps(state, ownProps) {
  return {
    resetData: state.tournaments.addedTournament
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(tournamentActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRewardForm);
