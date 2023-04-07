import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as segmentationActions from '../../actions/segmentationActions';
import {
  Card,
  Select,
  Button,
  InputNumber,
  Input,
  message,
  Row,
  Col,
  Modal,
  Tag,
  Icon,
  Table,
  Divider,
  Popconfirm,
  Radio
} from 'antd';
import _ from 'lodash';

const { TextArea } = Input;

const labelStyle = {
  textAlign: 'right',
  lineHeight: '30px',
  color: 'rgba(0, 0, 0, .85)',
  paddingRight: '10px',
  marginTop: '12px'
};

const fieldStyle = { marginTop: '12px', width: '80%' };

const mandatoryStyle = {
  fontSize: '14px',
  color: '#f5222d',
  marginRight: '4px',
  fontFamily: 'SimSun, sans-serif'
};
class DayWiseUserSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddEditModal: false,
      selectedRecord: {},
      modalErrors: {
        name: false,
        enabled: false,
        lifeTimeInMinutes: false,
        apkName: false,
        cohorts: false
      }
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getDayWiseUserSegmentConfig();
  }

  getDayWiseUserSegmentConfig() {
    this.props.actions.getDayWiseUserSegmentConfig().then(() => {
      if (this.props.getDayWiseUserSegmentConfigResponse) {
        let dayWiseConfigRaw = JSON.parse(
          this.props.getDayWiseUserSegmentConfigResponse
        ).dayWiseNewUserSegment;
        let dayWiseConfig = [];
        _.forEach(dayWiseConfigRaw, function(item, index) {
          let cursor = {};
          cursor['id'] = index;
          cursor['name'] = item.name;
          cursor['enabled'] = item.enabled;
          cursor['lifeTimeInMinutes'] = item.lifeTimeInMinutes;
          cursor['apkName'] = item.apkName;
          cursor['cohorts'] = item.cohorts ? JSON.stringify(item.cohorts) : '';
          dayWiseConfig.push(cursor);
        });
        this.setState({ dayWiseConfig: [...dayWiseConfig] });
      }
    });
  }

  openAddEditModal(actionType, record) {
    if (actionType === 'EDIT') {
      this.setState({
        actionType: actionType,
        selectedRecord: { ...record },
        showAddEditModal: true
      });
    } else {
      this.setState({
        actionType: actionType,
        showAddEditModal: true
      });
    }
  }

  resetFields() {
    this.setState({
      selectedRecord: {},
      modalErrors: {
        name: false,
        enabled: false,
        lifeTimeInMinutes: false,
        apkName: false,
        cohorts: false
      }
    });
  }

  closeAddEditModal() {
    this.resetFields();
    this.setState({ showAddEditModal: false });
  }

  jsonCheck(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  updateValues(value, valueType) {
    let selectedRecord = { ...this.state.selectedRecord };
    switch (valueType) {
      case 'name':
        selectedRecord.name = value;
        break;
      case 'enabled':
        selectedRecord.enabled = value;
        break;
      case 'lifeTimeInMinutes':
        selectedRecord.lifeTimeInMinutes = value;
        break;
      case 'apkName':
        selectedRecord.apkName = value;
        break;
      case 'cohorts':
        selectedRecord.cohorts = value;
        break;
      default:
        break;
    }
    this.setState({
      selectedRecord: { ...selectedRecord }
    });
  }

  saveChanges() {
    let selectedRecord = { ...this.state.selectedRecord };
    let tableData =
      this.state.dayWiseConfig.length > 0 ? [...this.state.dayWiseConfig] : [];
    let modalErrors = {
      name: false,
      lifeTimeInMinutes: false,
      apkName: false,
      cohorts: false
    };
    if (!selectedRecord.name) {
      modalErrors.name = true;
    } else {
      modalErrors.name = false;
    }

    if (
      !selectedRecord.lifeTimeInMinutes &&
      selectedRecord.lifeTimeInMinutes !== 0
    ) {
      modalErrors.lifeTimeInMinutes = true;
    } else {
      modalErrors.lifeTimeInMinutes = false;
    }

    if (!selectedRecord.apkName) {
      modalErrors.apkName = true;
    } else {
      modalErrors.apkName = false;
    }

    if (selectedRecord.cohorts != '') {
      if (!this.jsonCheck(selectedRecord.cohorts)) {
        modalErrors.cohorts = true;
      } else {
        modalErrors.cohorts = false;
      }
    } else {
      modalErrors.cohorts = false;
    }

    this.setState({ modalErrors });
    if (
      modalErrors.name ||
      modalErrors.lifeTimeInMinutes ||
      modalErrors.apkName ||
      modalErrors.cohorts
    ) {
      return;
    }

    if (this.state.actionType === 'EDIT') {
      let objIndex = _.findIndex(tableData, function(item) {
        return item.id === selectedRecord.id;
      });
      if (objIndex > -1) {
        tableData[objIndex]['id'] = selectedRecord.id;
        tableData[objIndex]['name'] = selectedRecord.name;
        tableData[objIndex]['enabled'] = selectedRecord.enabled;
        tableData[objIndex]['lifeTimeInMinutes'] =
          selectedRecord.lifeTimeInMinutes;
        tableData[objIndex]['apkName'] = selectedRecord.apkName;
        tableData[objIndex]['cohorts'] = selectedRecord.cohorts;
      }
    } else {
      let newRecord = {
        id: tableData.length + 1,
        name: selectedRecord.name,
        enabled: selectedRecord.enabled,
        lifeTimeInMinutes: selectedRecord.lifeTimeInMinutes,
        apkName: selectedRecord.apkName,
        cohorts: selectedRecord.cohorts
      };
      tableData.push(newRecord);
    }
    this.setState({
      dayWiseConfig: [...tableData],
      showAddEditModal: false
    });
    this.resetFields();
  }

  deleteRow(record) {
    let tableData =
      this.state.dayWiseConfig.length > 0 ? [...this.state.dayWiseConfig] : [];
    let objIndex = _.findIndex(tableData, function(item) {
      return item.id === record.id;
    });
    if (objIndex > -1) {
      tableData.splice(objIndex, 1);
    }
    let dayWiseConfig = [];
    _.forEach(tableData, function(item, index) {
      let cursor = {};
      cursor['id'] = index;
      cursor['name'] = item.name;
      cursor['enabled'] = item.enabled;
      cursor['lifeTimeInMinutes'] = item.lifeTimeInMinutes;
      cursor['apkName'] = item.apkName;
      cursor['cohorts'] = item.cohorts;

      dayWiseConfig.push(cursor);
    });
    this.setState({
      dayWiseConfig: [...dayWiseConfig]
    });
  }

  publishFeaturedEvents() {
    if (this.state.dayWiseConfig && this.state.dayWiseConfig.length < 1) {
      message.error('There should be at least one config setting to update');
      return;
    }
    let configData = [];
    let dayWiseConfig = [...this.state.dayWiseConfig];
    _.forEach(dayWiseConfig, function(item) {
      let cursor = {};
      let cohorts = item.cohorts != '' ? JSON.parse(item.cohorts) : [];
      cursor['name'] = item.name;
      cursor['enabled'] = item.enabled;
      cursor['lifeTimeInMinutes'] = item.lifeTimeInMinutes;
      cursor['apkName'] = item.apkName;
      cursor['cohorts'] = cohorts;
      configData.push(cursor);
    });
    let data = {
      config: [...configData]
    };
    this.props.actions.setDayWiseUserSegmentConfig(data).then(() => {
      if (
        this.props.setDayWiseUserSegmentConfigResponse &&
        this.props.setDayWiseUserSegmentConfigResponse.success
      ) {
        if (this.props.setDayWiseUserSegmentConfigResponse.success) {
          message.success('Updated configuration', 1.5).then(() => {
            window.location.reload();
          });
        } else {
          message.error('Could not update configuration');
        }
      }
    });
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Enabled',
        key: 'enabled',
        width: '10%',
        render: (text, record) => (
          <span>
            {record.enabled ? (
              <Tag color="green">True</Tag>
            ) : (
              <Tag color="red">False</Tag>
            )}
          </span>
        )
      },
      {
        title: 'Life Time In Minutes',
        dataIndex: 'lifeTimeInMinutes',
        key: 'lifeTimeInMinutes',
        width: '10%'
      },
      {
        title: 'Apk Name',
        dataIndex: 'apkName',
        key: 'apkName'
      },
      {
        title: 'Cohorts',
        key: 'cohorts',
        width: '40%',
        render: (text, record) => (
          <span
            style={{
              maxWidth: '20%',
              wordBreak: true,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.cohorts}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        width: '10%',
        render: (text, record) => (
          <span>
            <Button
              icon="edit"
              type="primary"
              onClick={() => this.openAddEditModal('EDIT', record)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete this record?"
              onConfirm={() => this.deleteRow(record)}
            >
              <Button icon="delete" type="danger" />
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Card
          title="Day Wise New User Segment"
          extra={
            <Popconfirm
              title="Save and publish the new configs?"
              onConfirm={() => this.publishFeaturedEvents()}
            >
              <Button style={{ backgroundColor: '#447d43', color: 'white' }}>
                Save and Publish
              </Button>
            </Popconfirm>
          }
        >
          <Button onClick={() => this.openAddEditModal('NEW')} type="primary">
            {' '}
            Add New Config
          </Button>
          <Table
            rowKey="id"
            style={{ marginTop: '20px' }}
            bordered
            pagination={false}
            dataSource={this.state.dayWiseConfig}
            columns={columns}
            scroll={{ x: '100%' }}
          />
        </Card>

        <Modal
          title={'Day Wise New User Segment Modal'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeAddEditModal()}
          onOk={() => this.saveChanges()}
          okText="Save"
          visible={this.state.showAddEditModal}
        >
          <Card>
            <Row>
              {/* <Col span={24}></Col> */}
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>
                Name:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.name ? 'red' : 'grey'
                  }}
                  value={this.state.selectedRecord.name}
                  onChange={e => this.updateValues(e.target.value, 'name')}
                />
              </Col>
              <Col span={24}>
                <Col span={6} style={{ ...labelStyle }}>
                  <span style={{ ...mandatoryStyle }}>*</span>Enabled:
                </Col>
                <Col span={18}>
                  <Radio.Group
                    style={{
                      ...fieldStyle,
                      borderColor: this.state.modalErrors.enabled
                        ? 'red'
                        : 'grey'
                    }}
                    value={
                      this.state.selectedRecord.enabled
                        ? this.state.selectedRecord.enabled
                        : false
                    }
                    onChange={e => this.updateValues(e.target.value, 'enabled')}
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={true}>True</Radio.Button>
                    <Radio.Button value={false}>False</Radio.Button>
                  </Radio.Group>
                </Col>
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>Life Time In
                Minutes:
              </Col>
              <Col span={18}>
                <InputNumber
                  min={0}
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.lifeTimeInMinutes
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedRecord.lifeTimeInMinutes}
                  onChange={e => this.updateValues(e, 'lifeTimeInMinutes')}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>
                Apk Name:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.apkName ? 'red' : 'grey'
                  }}
                  value={this.state.selectedRecord.apkName}
                  onChange={e => this.updateValues(e.target.value, 'apkName')}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                Cohorts
              </Col>
              <Col span={18}>
                <TextArea
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.cohorts ? 'red' : 'grey'
                  }}
                  rows={2}
                  value={this.state.selectedRecord.cohorts}
                  onChange={e => this.updateValues(e.target.value, 'cohorts')}
                />
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getDayWiseUserSegmentConfigResponse:
      state.segmentation.getDayWiseUserSegmentConfigResponse,
    setDayWiseUserSegmentConfigResponse:
      state.segmentation.setDayWiseUserSegmentConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...segmentationActions
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DayWiseUserSegment);
