// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tournamentConfigActions from '../../actions/tournamentConfigActions';
import _ from 'lodash';
import {
  Form,
  Row,
  InputNumber,
  Tooltip,
  Col,
  Icon,
  Input,
  Button,
  message,
  Popconfirm,
  Table,
  Divider
} from 'antd';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class DynamicRewardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threshold: 1,
      rankSlab: null,
      thresholdRanges: [],
      invalidPrizeEntry: false
    };
    this.columns = [
      {
        title: 'Threshold',
        dataIndex: 'threshold'
      },
      {
        title: 'Rank Slab',
        dataIndex: 'rankSlab'
      },
      {
        title: 'Prizes',
        dataIndex: 'prizes',
        render: (text, record) => {
          return <span>{record.prizes ? record.prizes.join(', ') : null}</span>;
        }
      },
      {
        title: 'Actions',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.delete(record)}
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
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    // For Clone and Edit
    let thresholdRanges = [];
    if (this.props.tableData && this.props.tableData.length > 0) {
      this.props.tableData.map(item => {
        let cursor = {};
        cursor['threshold'] = item.threshold ? item.threshold : 1;
        cursor['rankSlab'] = item.rankSlab ? item.rankSlab : 0;
        cursor['prizes'] = item.prizes ? item.prizes : [];
        thresholdRanges.push(cursor);
      });
      this.props.rewardsTable([...thresholdRanges]);
      this.setState({ thresholdRanges: thresholdRanges });
    }
  }
  // On prize entry
  onPrizeChange(e) {
    let isInvalid = false;
    let prizeString = e.target.value;
    let inputArray = _.split(prizeString, ',');

    if (!(inputArray[0] === '' && inputArray.length === 1)) {
      for (var i = 0; i < inputArray.length; i++) {
        if (!inputArray[i]) {
          isInvalid = true;
        }
        if (
          (inputArray[i] && inputArray[i].includes('.')) ||
          (inputArray[i] && isNaN(inputArray[i]))
        ) {
          isInvalid = true;
        }
        if (inputArray[i] && !isNaN(inputArray[i])) {
          if (Number(inputArray[i]) < 0) {
            isInvalid = true;
          }
        }
      }
    }
    if (!isInvalid) {
      let rankSlab = 0;
      if (inputArray[0] === '' && inputArray.length === 1) {
        rankSlab = 0;
      } else {
        rankSlab = inputArray.length;
      }
      this.props.form.setFieldsValue({
        rankSlab: rankSlab
      });
      this.setState({ prizes: inputArray });
    }
    this.setState({ invalidPrizeEntry: isInvalid });
  }

  // ------------ Clear table ------------- //
  clearTable() {
    this.setState({
      threshold: 1,
      rankSlab: null,
      thresholdRanges: []
    });
    this.props.form.setFieldsValue({
      threshold: 1,
      prizes: ''
    });
    this.props.rewardsTable([]);
  }
  // ------------  Delete Row ------------- //
  delete(record) {
    let thresholdRanges = this.state.thresholdRanges;
    let newArray = _.filter(thresholdRanges, function(item) {
      return item !== record;
    });
    this.setState({ thresholdRanges: [...newArray] });
  }

  // ------------ Add to Table ------------- //
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.invalidPrizeEntry) {
          message.error('Prizes entered is not in correct format');
          return;
        }
        let val = {
          threshold: values.threshold,
          rankSlab: values.rankSlab,
          prizes: this.state.prizes
        };
        let thresholdRanges = [...this.state.thresholdRanges];
        thresholdRanges.push(val);
        this.setState({ thresholdRanges: [...thresholdRanges] });
        this.props.rewardsTable([...thresholdRanges]);
        this.props.form.setFieldsValue({
          threshold: val.threshold + 1,
          rankSlab: 0,
          prizes: ''
        });
        this.setState({ prizes: [] });
      }
    });
    return false;
  };
  render() {
    // ------------ Colums ------------- //
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
    const errors = {
      threshold: isFieldTouched('threshold') && getFieldError('threshold'),
      prizes: this.state.invalidPrizeEntry
    };
    return (
      <React.Fragment>
        {/* <Form onSubmit={this.handleSubmit}> */}
        <Row>
          <Col span={6}>
            <FormItem
              validateStatus={errors.threshold ? 'error' : ''}
              help={errors.threshold || ''}
              {...formItemLayout}
              label={
                <span>
                  Threshold
                  <Tooltip title="Threshold">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('threshold', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Threshold is mandatory',
                    whitespace: false
                  }
                ],
                initialValue: this.state.threshold
              })(<InputNumber min={this.state.threshold} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Rank Slabs
                  <Tooltip title="Rank Slabs">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('rankSlab', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'End Rank!',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              validateStatus={errors.prizes ? 'error' : ''}
              help={errors.prizes || ''}
              {...formItemLayout}
              label={
                <span>
                  Prizes
                  <Tooltip title="Prizes (comma seperated)">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('prizes', {
                rules: [
                  {
                    required: false,
                    whitespace: true
                  }
                ]
              })(<Input onBlur={e => this.onPrizeChange(e)} />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={6} offset={8}>
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
          <Col span={6} offset={4}>
            <Button type="danger" onClick={() => this.clearTable()}>
              Clear Table
            </Button>
          </Col>
        </Row>
        <Divider />
        <Table
          id="reward-table"
          bordered
          rowKey="start"
          dataSource={this.state.thresholdRanges}
          columns={columns}
          size="small"
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    state: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...tournamentConfigActions }, dispatch)
  };
}

const DynamicRewardTableForm = Form.create()(DynamicRewardTable);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DynamicRewardTableForm);
// export default DynamicRewardTableForm;
