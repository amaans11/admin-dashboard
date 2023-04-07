import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UpdaterActions from '../../actions/updaterActions';
import {
  Card,
  Radio,
  Table,
  message,
  Divider,
  Tag,
  Button,
  Icon,
  Modal,
  InputNumber,
  Row,
  Col,
  Popconfirm,
  Pagination,
  Select
} from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;

let update_states = [
  'CONFIG_CREATED',
  'DEPLOYED_INTERNALLY',
  'DEPLOYED',
  'DEPRECATED',
  'CANCELLED',
  'PARTIAL_DEPLOY'
];

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class ListUpdates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      visible: false,
      initialPercent: null,
      rollOutPercent: null,
      selectedRecord: {},
      rollOutVisible: false,
      pageNum: 1,
      type: 'RN_ANDROID_BUNDLE',
      start: 0,
      count: 100,
      countryCode: 'ID'
    };
    this.clearCache = this.clearCache.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  componentDidMount() {
    this.fetchList();
  }

  selectCountry(value) {
    this.setState({ countryCode: value }, () => {
      this.fetchList();
    });
  }

  fetchList() {
    let data = {
      type: this.state.type,
      start: this.state.start,
      countryCode: this.state.countryCode,
      count: this.state.count
    };
    this.props.actions.listUpdates(data).then(() => {
      this.setState({
        showTable: true
      });
    });
  }

  updateTypeSelected(value) {
    message.loading('update list loading in progress..', 0);
    this.setState(
      {
        type: value,
        pageNum: 1,
        start: 0,
        count: 100
      },
      () => {
        this.fetchList();
      }
    );
  }

  onPageChange(page) {
    let start = (page - 1) * 20;
    this.setState({ pageNum: page, start: start }, () => {
      this.fetchList();
    });
  }

  deployState(record, state) {
    var vm = this;
    this.props.actions
      .publishUpdate(record, {
        updateId: record.id,
        newState: state
      })
      .then(() => {
        vm.fetchList();
      });
  }

  uploadFiles(record) {
    let config = { ...record };
    config.type = this.state.type;
    this.props.actions.createConfigSuccess(config);
    this.props.history.push('/updater/add');
  }

  rollOut = record => {
    console.log('ROLL OUT ', record);
    this.setState({
      rollOutVisible: true,
      selectedRecord: record,
      rollOutPercent: record.rollOutPercent ? record.rollOutPercent : 0
    });
  };

  handleRollOutCancel = () => {
    this.setState({
      rollOutVisible: false,
      rollOutPercent: null,
      selectedRecord: {}
    });
  };

  handleRollOutOk = () => {
    this.setState({
      confirmRollOutLoading: true
    });
    let data = {
      id: this.state.selectedRecord.id,
      newPercent: this.state.rollOutPercent
    };
    this.props.actions.updateRollOutPercentage(data).then(() => {
      this.setState({ confirmRollOutLoading: false, selectedRecord: {} });
      window.location.reload();
    });
  };

  showModal = record => {
    this.setState({
      visible: true,
      selectedRecord: record,
      rollOutPercent: record.rollOutPercent ? record.rollOutPercent : null,
      initialPercent: record.rollOutPercent ? record.rollOutPercent : null
    });
  };

  handleOk = () => {
    if (this.state.initialPercent >= this.state.rollOutPercent) {
      message.error(
        'The new roll out percentage should be greater than the previous value'
      );
    } else {
      this.setState({
        confirmLoading: true
      });
      let data = {
        id: this.state.selectedRecord.id,
        newPercent: this.state.rollOutPercent
      };
      this.props.actions.updateRollOutPercentage(data).then(() => {
        this.setState({ confirmLoading: false, selectedRecord: {} });
        window.location.reload();
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      rollOutPercent: null,
      selectedRecord: {}
    });
  };

  updatePercentage = value => {
    this.setState({ rollOutPercent: value });
  };

  haltConfirm = record => {
    let getHaltRequest = {
      id: record.id,
      currentState: record.state
    };

    this.props.actions.haltDeploy(getHaltRequest).then(() => {
      window.location.reload();
    });
  };

  fullRollOut = record => {
    let data = {
      id: record.id,
      newPercent: 100
    };
    this.props.actions.updateRollOutPercentage(data).then(() => {
      window.location.reload();
    });
  };

  changeState(record, newState) {
    let data = {
      updateId: record.id,
      newState: newState
    };
    this.props.actions.changeState(data).then(() => {
      if (this.props.updateUpdaterStateResponse) {
        if (this.props.updateUpdaterStateResponse.error) {
          message.error(this.props.updateUpdaterStateResponse.error.message);
        } else {
          message.success('Redployed successfully', 1.5).then(() => {
            window.location.reload();
          });
        }
      }
    });
  }

  clearCache() {
    this.props.actions.clearCache().then(() => {
      message.info('Cache Cleared');
    });
  }

  render() {
    var { pageNum } = this.state;

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Version',
        key: 'verisons',
        width: 100,
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.versionCode - b.versionCode,
        render: (text, record) => (
          <span>
            <span>{record.versionCode}</span>

            {record.critical ? (
              <React.Fragment>
                <Divider type="vertical" /> <Tag color="red">Critical</Tag>
              </React.Fragment>
            ) : (
              ''
            )}
          </span>
        )
      },
      {
        title: 'Modified By',
        dataIndex: 'modifiedBy',
        key: 'modifiedBy'
      },
      {
        title: 'Last Modified',
        dataIndex: 'modifiedOn',
        key: 'modifiedOn',
        defaultSortOrder: 'descend',
        sorter: (a, b) => Date.parse(a.modifiedOn) - Date.parse(b.modifiedOn)
      },
      {
        title: 'Current State',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => (
          <span>
            <Tag color="cyan">
              {update_states[record.state ? record.state : 0]}
            </Tag>
          </span>
        )
      },
      {
        title: 'Roll out percentage',
        dataIndex: 'rollOutPercent',
        key: 'rollOutPercent',
        render: (text, record) => (
          <span>
            <span>
              <Tag color="cyan">
                {record.rollOutPercent ? record.rollOutPercent : 0}
              </Tag>
            </span>
            <span>
              {record.rollOutPercent !== 100 && record.state === 5 ? (
                <Button
                  onClick={() => this.showModal(record)}
                  type="primary"
                  size="small"
                >
                  <Icon type="edit" />
                </Button>
              ) : (
                ''
              )}
            </span>
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            {record.state === undefined || record.state === 0 ? (
              <span>
                <Button
                  onClick={() => this.uploadFiles(record)}
                  type="primary"
                  size="small"
                >
                  Upload Files
                </Button>
                <Button
                  style={{ marginTop: '10px' }}
                  onClick={() =>
                    this.deployState(record, 'DEPLOYED_INTERNALLY')
                  }
                  type="primary"
                  size="small"
                >
                  Deploy Internally
                </Button>
              </span>
            ) : (
              ''
            )}
            {record.state === 1 ? (
              <span>
                <Button
                  onClick={() => this.rollOut(record)}
                  type="primary"
                  size="small"
                >
                  Roll Out
                </Button>
                <Popconfirm
                  title="Are you sure to deprecate this deploy?"
                  onConfirm={() => this.haltConfirm(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    style={{ marginLeft: '10px' }}
                    type="danger"
                    size="small"
                  >
                    Halt
                  </Button>
                </Popconfirm>
              </span>
            ) : (
              ''
            )}
            {record.state === 5 ? (
              <span>
                <Popconfirm
                  title="Are you sure you want to fully deploy this version?"
                  onConfirm={() => this.fullRollOut(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger" size="small">
                    Full Roll out
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Are you sure to deprecate this deploy?"
                  onConfirm={() => this.haltConfirm(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    style={{ marginLeft: '10px' }}
                    type="danger"
                    size="small"
                  >
                    Halt
                  </Button>
                </Popconfirm>
              </span>
            ) : (
              ''
            )}
            {record.state === 3 && (
              <Popconfirm
                title="Are you sure to redeploy this version?"
                onConfirm={() =>
                  this.changeState(record, 'DEPLOYED_INTERNALLY')
                }
                okText="Yes"
                cancelText="No"
              >
                <Button
                  style={{
                    marginLeft: '10px',
                    color: 'white',
                    backgroundColor: 'red'
                  }}
                  size="small"
                >
                  Re Deploy
                </Button>
              </Popconfirm>
            )}
          </span>
        )
      }
    ];
    const {
      visible,
      confirmLoading,
      rollOutVisible,
      confirmRollOutLoading
    } = this.state;
    return (
      <React.Fragment>
        <Modal
          title={`Edit Percentage ${this.state.selectedRecord.versionCode}`}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col span={8}>Roll out percentage</Col>
            <Col span={16}>
              <InputNumber
                min={0}
                max={100}
                value={this.state.rollOutPercent}
                onChange={this.updatePercentage}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          title={`Roll out ${this.state.selectedRecord.versionCode}`}
          visible={rollOutVisible}
          onOk={this.handleRollOutOk}
          confirmLoading={confirmRollOutLoading}
          onCancel={this.handleRollOutCancel}
        >
          <Row>
            <Col span={8}>Roll out percentage</Col>
            <Col span={16}>
              <InputNumber
                min={0}
                max={100}
                value={this.state.rollOutPercent}
                onChange={this.updatePercentage}
              />
            </Col>
          </Row>
        </Modal>

        <Card
          style={{ textAlign: 'center' }}
          extra={
            <Popconfirm
              title="Are you sure to clear cache?"
              onConfirm={() => this.clearCache()}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ backgroundColor: '#ad2d33', color: 'white' }}>
                Clear Cache
              </Button>
            </Popconfirm>
          }
        >
          <Row>
            <label style={{ marginRight: '10px' }}>Country:</label>
            <Select
              showSearch
              onSelect={e => this.selectCountry(e)}
              style={{ width: '40%' }}
              placeholder="Select country"
              optionFilterProp="children"
              value={this.state.countryCode}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {CountryList}
            </Select>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <label style={{ marginRight: '10px' }}>
              Choose the type of Update
            </label>
            <RadioGroup
              onChange={e => this.updateTypeSelected(e.target.value)}
              defaultValue={'RN_ANDROID_BUNDLE'}
            >
              <RadioButton value={'RN_ANDROID_BUNDLE'}>
                Android React Bundle
              </RadioButton>
              <RadioButton value={'ANDROID_APK'}>Android APK Pro</RadioButton>
              <RadioButton value={'RN_IOS_BUNDLE'}>
                IOS React Bundle
              </RadioButton>
              <RadioButton value={'ANDROID_APK_PS'}>Android APK PS</RadioButton>
            </RadioGroup>
          </Row>
        </Card>
        {this.state.showTable ? (
          <Card>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.props.updateState.list}
              columns={columns}
            />
            <Pagination
              style={{ float: 'right' }}
              current={this.state.pageNum}
              defaultCurrent={this.state.pageNum}
              onChange={(page, pageSize) => this.onPageChange(page, pageSize)}
              total={
                this.props.updateState.totalCount
                  ? this.props.updateState.totalCount
                  : 20
              }
              pageSize={20}
            />
          </Card>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    updateState: state.updater,
    updateUpdaterStateResponse: state.updater.updateUpdaterStateResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UpdaterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUpdates);
