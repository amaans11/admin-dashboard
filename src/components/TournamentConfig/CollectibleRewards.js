import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import * as tournamentActions from '../../actions/tournamentActions';
import { bindActionCreators } from 'redux';

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
export class CollectibleRewards extends Component {
  state = {
    rewardData: [],
    startRankVal: 1,
    selectedCollectible: null
  };

  columns = [
    {
      title: 'Minimum Rank',
      dataIndex: 'minRank'
    },
    {
      title: 'Maximum Rank',
      dataIndex: 'maxRank'
    },
    {
      title: 'Collectible',
      dataIndex: 'collectible',
      render: (text, record) => <div>{record.collectible.name}</div>
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
  componentDidMount() {
    this.props.form.validateFields();
    const { gameId } = this.props;
    if (gameId) this.props.actions.getCollectiblesForGameId(gameId);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.gameId !== this.props.gameId) {
      this.props.actions.getCollectiblesForGameId(this.props.gameId);
      this.props.updateRewardsTable({ collectibleRewardData: [] });
      this.setState({ startRankVal: 1 });
    }
  };
  delete() {
    const { rewardData } = this.props;
    const data = cloneDeep(rewardData);
    const temp = data.splice(rewardData.length - 1, 1);
    this.setState({
      startRankVal: data.length > 0 ? temp[0].start : 1,
      rankRanges: data
    });
    this.props.updateRewardsTable({
      collectibleRewardData: data
    });
  }
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.minRank > values.maxRank) {
          message.warning("Min rank can't be greater than max rank");
          return;
        }
        const val = {
          minRank: values.minRank,
          maxRank: values.maxRank,
          collectible: find(
            this.props.collectiblesList,
            collectible => values.collectible === collectible.id.low
          )
        };
        const rewardData = cloneDeep(this.props.rewardData);
        rewardData.push(val);
        this.props.updateRewardsTable({
          collectibleRewardData: rewardData
        });
        this.props.form.resetFields(['minRank', 'maxRank', 'collectible']);
      }
    });
  };
  render() {
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
    const { rewardData } = this.props;
    const temp = rewardData[rewardData.length - 1];
    const startRankVal =
      rewardData.length > 0
        ? temp && temp.maxRank
          ? temp.maxRank + 1
          : this.state.startRankVal
        : 1;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const minRankError = isFieldTouched('minRank') && getFieldError('minRank');
    const maxRankError = isFieldTouched('maxRank') && getFieldError('maxRank');
    const collectibleError =
      isFieldTouched('collectible') && getFieldError('collectible');

    const collectibleList =
      this.props.collectiblesList && this.props.collectiblesList.length
        ? this.props.collectiblesList.map((collectible, index) => (
            <Option
              key={`collectible-${collectible.id.low}`}
              value={collectible.id.low}
            >
              {collectible.name}
            </Option>
          ))
        : null;

    return (
      <React.Fragment>
        {/* <Form onSubmit={this.handleSubmit}> */}
        <Row>
          <Col span={12}>
            <FormItem
              validateStatus={minRankError ? 'error' : ''}
              help={minRankError || ''}
              {...formItemLayout}
              label={
                <span>
                  Minimum Rank
                  <Tooltip title="Mininum Rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('minRank', {
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
              validateStatus={maxRankError ? 'error' : ''}
              help={maxRankError || ''}
              {...formItemLayout}
              label={
                <span>
                  Maximum Rank
                  <Tooltip title="Maximum Rank">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('maxRank', {
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
              validateStatus={collectibleError ? 'error' : ''}
              help={collectibleError || ''}
              {...formItemLayout}
              label={
                <span>
                  Collectible Reward
                  <Tooltip title="Select Collectible">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('collectible', {
                rules: [
                  {
                    required: true,
                    message: 'Please select a collectible'
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  onChange={e => {
                    this.setState({ selectedCollectible: e });
                  }}
                  placeholder="Select a collectible"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {collectibleList}
                </Select>
              )}
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
          rowKey="minRank"
          dataSource={rewardData}
          columns={columns}
          size="small"
          rowClassName="editable-row"
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  collectiblesList:
    state.tournaments.collectiblesList &&
    state.tournaments.collectiblesList.collectibles
      ? state.tournaments.collectiblesList.collectibles
      : []
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(tournamentActions, dispatch)
});
const CollectibleRewardsForm = Form.create()(CollectibleRewards);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectibleRewardsForm);
