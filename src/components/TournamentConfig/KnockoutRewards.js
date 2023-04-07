import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Row,
  InputNumber,
  Radio,
  Col,
  Icon,
  Input,
  Button,
  Popconfirm,
  Table,
  Divider
} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class KnockoutRewards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roundsData: [],
      loaded: false
    };
  }

  componentDidMount() {
    this.props.form.validateFields();
    if (this.props.roundsData && this.props.roundsData.length > 0) {
      this.setState({
        roundsData: [...this.props.roundsData]
      });
    }
    this.setState({ loaded: true });
  }

  delete(record) {
    console.log(record);
    let roundsData = this.state.roundsData.filter(
      item => item.name !== record.name
    );
    this.setState(
      {
        roundsData: roundsData.length > 0 ? [...roundsData] : []
      },
      () => {
        this.props.rewardsTable({
          roundsData
        });
      }
    );
  }
  //////////////////////Add to Table////////////////////
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let val = {
          name: values.name,
          duration: values.duration,
          prize: values.prize,
          moneyType: values.moneyType,
          players: values.players,
          matches: values.matches,
          perMatchTime: values.perMatchTime,
          secondPrize: values.secondPrize
        };

        if (values.parallelMatches && values.parallelMatches > 0) {
          val['parallelMatches'] = values.parallelMatches;
        }
        if (values.gapTime && values.gapTime > 0) {
          val['gapTime'] = values.gapTime;
        }
        if (values.startBufferTime && values.startBufferTime > 0) {
          val['startBufferTime'] = values.startBufferTime;
        }

        let roundsData = [...this.state.roundsData];
        roundsData.push(val);

        this.setState(
          {
            roundsData
          },
          () => {
            this.props.rewardsTable({
              roundsData
            });
          }
        );

        this.props.form.resetFields([
          'name',
          'duration',
          'prize',
          'moneyType',
          'players',
          'matches',
          'perMatchTime',
          'secondPrize',
          'parallelMatches',
          'gapTime',
          'startBufferTime'
        ]);
      }
    });
    return false;
  };
  render() {
    const columns = [
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: 'Duration',
        key: 'duration',
        dataIndex: 'duration'
      },
      {
        title: 'Prize',
        key: 'prize',
        dataIndex: 'prize'
      },
      {
        title: 'Money Type',
        key: 'moneyType',
        dataIndex: 'moneyType'
      },
      {
        title: 'Players',
        key: 'players',
        dataIndex: 'players'
      },
      {
        title: 'Matches',
        key: 'matches',
        dataIndex: 'matches'
      },
      {
        title: 'Per Match Time',
        key: 'perMatchTime',
        dataIndex: 'perMatchTime'
      },
      {
        title: 'Second Prize',
        key: 'secondPrize',
        dataIndex: 'secondPrize'
      },
      {
        title: 'Parallel Matches',
        key: 'parallelMatches',
        dataIndex: 'parallelMatches'
      },
      {
        title: 'Gap Time',
        key: 'gapTime',
        dataIndex: 'gapTime'
      },
      {
        title: 'Start Buffer Time',
        key: 'startBufferTime',
        dataIndex: 'startBufferTime'
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        render: (text, record) => (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => this.delete(record)}
          >
            <Icon style={{ color: 'red' }} type="delete" />
          </Popconfirm>
        )
      }
    ];

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

    const errors = {
      name: isFieldTouched('name') && getFieldError('name'),
      duration: isFieldTouched('duration') && getFieldError('duration'),
      prize: isFieldTouched('prize') && getFieldError('prize'),
      moneyType: isFieldTouched('moneyType') && getFieldError('moneyType'),
      players: isFieldTouched('players') && getFieldError('players'),
      matches: isFieldTouched('matches') && getFieldError('matches'),
      perMatchTime:
        isFieldTouched('perMatchTime') && getFieldError('perMatchTime'),
      secondPrize:
        isFieldTouched('secondPrize') && getFieldError('secondPrize'),
      parallelMatches:
        isFieldTouched('parallelMatches') && getFieldError('parallelMatches'),
      gapTime: isFieldTouched('gapTime') && getFieldError('gapTime'),
      startBufferTime:
        isFieldTouched('startBufferTime') && getFieldError('startBufferTime')
    };

    return (
      <React.Fragment>
        {/* <Form onSubmit={this.handleSubmit}> */}
        <Row>
          <Col span={12}>
            <FormItem
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name || ''}
              {...formItemLayout}
              label={'Name'}
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Name!',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.duration ? 'error' : ''}
              help={errors.duration || ''}
              {...formItemLayout}
              label={'Duration'}
            >
              {getFieldDecorator('duration', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'duration!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.prize ? 'error' : ''}
              help={errors.prize || ''}
              {...formItemLayout}
              label={'Prize'}
            >
              {getFieldDecorator('prize', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'prize!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.moneyType ? 'error' : ''}
              help={errors.moneyType || ''}
              {...formItemLayout}
              label={'Money Type'}
            >
              {getFieldDecorator('moneyType', {
                initialValue: 'Deposit',
                rules: [
                  {
                    required: true,
                    message: 'moneyType!',
                    whitespace: true
                  }
                ]
              })(
                <RadioGroup>
                  <Radio value={'Deposit'}>Deposit</Radio>
                  <Radio value={'Winnings'}>Winnings</Radio>
                  <Radio value={'Bonus'}>Bonus</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.players ? 'error' : ''}
              help={errors.players || ''}
              {...formItemLayout}
              label={'Players'}
            >
              {getFieldDecorator('players', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'players!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.matches ? 'error' : ''}
              help={errors.matches || ''}
              {...formItemLayout}
              label={'Matches'}
            >
              {getFieldDecorator('matches', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'matches!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.perMatchTime ? 'error' : ''}
              help={errors.perMatchTime || ''}
              {...formItemLayout}
              label={'Per Match Time'}
            >
              {getFieldDecorator('perMatchTime', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'perMatchTime!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.secondPrize ? 'error' : ''}
              help={errors.secondPrize || ''}
              {...formItemLayout}
              label={'Second Prize'}
            >
              {getFieldDecorator('secondPrize', {
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'secondPrize!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.parallelMatches ? 'error' : ''}
              help={errors.parallelMatches || ''}
              {...formItemLayout}
              label={'Parallel Matches'}
            >
              {getFieldDecorator('parallelMatches', {
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'parallelMatches!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.gapTime ? 'error' : ''}
              help={errors.gapTime || ''}
              {...formItemLayout}
              label={'Gap Time'}
            >
              {getFieldDecorator('gapTime', {
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'gapTime!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateStatus={errors.startBufferTime ? 'error' : ''}
              help={errors.startBufferTime || ''}
              {...formItemLayout}
              label={'Start Buffer Time'}
            >
              {getFieldDecorator('startBufferTime', {
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'startBufferTime!',
                    whitespace: true
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={10}>
            <Button
              type="primary"
              disabled={hasErrors(getFieldsError())}
              onClick={this.handleSubmit}
              icon="plus-circle-o"
              htmlType="button"
            >
              Add to Table
            </Button>
          </Col>
        </Row>
        <Divider />
        {this.state.loaded && (
          <Table
            id="rounds-data"
            bordered
            rowKey="name"
            dataSource={this.state.roundsData}
            columns={columns}
            size="small"
            scroll={{ x: '100%' }}
          />
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(ownProps) {
  return { ...ownProps };
}

const KnockoutRewardsForm = Form.create()(KnockoutRewards);
export default connect(mapStateToProps)(KnockoutRewardsForm);
