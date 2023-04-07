import React, { Component } from 'react';
import { Card, Modal, Tag, Tooltip, Button, Divider, Table } from 'antd';
import ReactJson from 'react-json-view';
import moment from 'moment';
import * as i18nCMActions from '../../actions/i18nCMSActions';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
export class ConfigsListTable extends Component {
  state = {
    configToShow: {},
    showConfigModal: false
  };
  columns = [
    {
      title: 'Config Name',
      dataIndex: 'configName',
      key: 'configName'
    },
    {
      title: 'Config Node',
      dataIndex: 'configNode',
      key: 'configNode'
    },
    {
      title: 'Config Path',
      dataIndex: 'configPath',
      key: 'configPath'
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, record) => (
        <Tag color={text ? 'Green' : 'Red'}>{text ? 'Active' : 'Inactive'}</Tag>
      )
    },
    {
      title: 'Last Modified',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: text => <span>{moment(text).format('DD/MM/YYYY HH:mm A')}</span>
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Tooltip
            placement="topLeft"
            title="View Config Details"
            arrowPointAtCenter
          >
            <Button
              shape="circle"
              icon="info"
              type="primary"
              onClick={() => this.showConfigModal(record)}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip
            placement="topLeft"
            title={`${this.props.copyConfigFlow ? 'Copy' : 'Edit'} Config`}
            arrowPointAtCenter
          >
            <Button
              shape="circle"
              icon={this.props.copyConfigFlow ? 'copy' : 'edit'}
              type="primary"
              onClick={() =>
                this.cloneConfig(
                  record,
                  this.props.copyConfigFlow ? 'copy' : 'edit'
                )
              }
            />
          </Tooltip>
        </span>
      )
    }
  ];

  cloneConfig = (config, editType) => {
    this.props.actions.cloneZkConfig(config, editType);
    this.props.history.push('/i18n-config/edit');
  };

  showConfigModal = config => {
    const configToShow = cloneDeep(config);
    if (
      get(configToShow, 'valueType', '').toUpperCase() === 'JSON' &&
      typeof configToShow.defaultValue === 'string'
    ) {
      configToShow.defaultValue = JSON.parse(configToShow.defaultValue);
    }
    this.setState({
      showConfigModal: true,
      configToShow
    });
  };

  hideModal = () => {
    this.setState({
      showConfigModal: false,
      configToShow: {}
    });
  };

  render() {
    const { cardTitle, dataSource = [] } = this.props;
    const { configToShow, showConfigModal } = this.state;
    return (
      <React.Fragment>
        {dataSource.length ? (
          <Card title={cardTitle} style={{ marginTop: 20 }}>
            <Table
              rowKey="configId"
              bordered
              dataSource={dataSource}
              columns={this.columns}
              scroll={{ x: '100%' }}
            />
          </Card>
        ) : null}
        <Modal
          title="Config Node Detail"
          closable={true}
          maskClosable={true}
          width={'80vw'}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          visible={showConfigModal}
        >
          <Card bordered={false}>
            <ReactJson
              src={configToShow}
              name={false}
              displayObjectSize={false}
            />
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(i18nCMActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConfigsListTable)
);
