// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Popconfirm,
  Table,
  Modal,
  Select
} from 'antd';
import * as userDataActions from '../../actions/userDataActions';
import * as leaderboardActions from '../../actions/leaderboardActions';

const FormItem = Form.Item;
const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const FraudCheckCategories = [
  'GENERIC',
  'GAME SCORE MODIFICATION',
  'GAME FIELD MODIFICATION',
  'TIME MODIFICATION',
  'SCORE SEQUENCE MODIFICATION',
  'RESULT MODIFICATION',
  'DASHBOARD_BLOCKED'
].map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));
class SearchDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: {},
      showDetail: false,
      deviceList: [],
      showTable: false,
      blockReason: '',
      showBlockUserModal: false
    };
    this.getUserFromDevice = this.getUserFromDevice.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  updateBlockReason(value) {
    this.setState({ blockReason: value });
  }

  closeBlockUserModal() {
    this.setState({ blockReason: '', showBlockUserModal: false });
  }

  makeBlockUserCall() {
    let vm = this;
    if (vm.state.blockReason === '') {
      message.error('Block Reason cannot be empty');
      return;
    }
    this.props.actions
      .blockUserDevice(
        vm.state.blockUserId,
        vm.state.deviceId,
        vm.state.blockReason
      )
      .then(() => {
        if (this.props.blockUserDeviceResponse) {
          if (this.props.blockUserDeviceResponse.error) {
            message.error('Could not block the device');
          } else {
            message.success('Successfully blocked');
            this.setState({
              blockUserId: null,
              blockReason: '',
              showBlockUserModal: false
            });
          }
        }
      });
  }

  blockDevice(record) {
    this.setState({
      blockUserId: record.userId,
      deviceId: record.deviceId,
      showBlockUserModal: true
    });
  }

  blockDevice(record) {
    this.props.actions
      .blockUserDevice(record.userId, record.deviceId)
      .then(() => {
        if (this.props.blockUserDeviceResponse) {
          if (this.props.blockUserDeviceResponse.error) {
            message.error('Could not block the device');
          } else {
            message.success('Successfully blocked');
          }
        }
      });
  }

  getUserFromDevice(deviceId) {
    let data = {
      deviceId: deviceId
    };
    this.props.actions.getUsersFromDeviceId(data).then(() => {
      if (
        this.props.getUsersFromDeviceIdResponse &&
        this.props.getUsersFromDeviceIdResponse.userDevices &&
        this.props.getUsersFromDeviceIdResponse.userDevices.length > 0
      ) {
        this.setState({
          deviceList: [...this.props.getUsersFromDeviceIdResponse.userDevices],
          showTable: true
        });
      } else {
        message.info('No users found for the device id');
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      userDetail: {},
      showDetail: false,
      deviceList: [],
      showTable: false
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.getUserFromDevice(values.searchFor);
      }
    });
  };
  render() {
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
      searchFor: isFieldTouched('searchFor') && getFieldError('searchFor')
    };

    const columns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Device Id',
        dataIndex: 'deviceId',
        key: 'deviceId'
      },
      {
        title: 'Mobile Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber'
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Are you sure you want to block this user and device?"
              onConfirm={() => this.blockDevice(record)}
            >
              <Button type="danger">Block Device</Button>
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="User Details">
            <Row>
              <Col span={20}>
                <FormItem
                  validateStatus={errors.searchFor ? 'error' : ''}
                  help={errors.searchFor || ''}
                  {...formItemLayout}
                  {...formItemLayout}
                  label={<span>Device Id</span>}
                >
                  {getFieldDecorator('searchFor', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input device id!',
                        whitespace: true
                      }
                    ]
                  })(<Input style={{ width: '60%' }} />)}
                </FormItem>
              </Col>
              <Col span={6} offset={6}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Card>
          {this.state.showDetail && (
            <Card
              type="inner"
              title="Details"
              extra={
                <Button type="primary" onClick={() => this.getUserDeviceIds()}>
                  Get Device Id
                </Button>
              }
            >
              <Row>
                <Col span={24}>
                  Display Name:{' '}
                  <strong>{this.state.userDetail.displayName}</strong>
                </Col>
                <Col span={24}>
                  Mobile Number:{' '}
                  <strong>{this.state.userDetail.mobileNumber}</strong>
                </Col>
                <Col span={24}>
                  User Id: <strong>{this.state.userDetail.id.low}</strong>
                </Col>
                <Col span={24}>
                  Tier: <strong>{this.state.userDetail.tier}</strong>
                </Col>
                <Col span={24}>
                  App Type:{' '}
                  <strong>{this.state.userDetail.isPro ? 'CASH' : 'PS'}</strong>
                </Col>
                <Col span={24}>
                  Avatar Id:{' '}
                  <strong>
                    {this.state.userDetail.avatarId
                      ? this.state.userDetail.avatarId
                      : ''}
                  </strong>
                </Col>
                <Popconfirm
                  title="Sure to Block user?"
                  onConfirm={() => this.blockUser(this.state.userDetail.id.low)}
                >
                  <Button type="danger">Block User</Button>
                </Popconfirm>
              </Row>
            </Card>
          )}
          {this.state.showTable && (
            <Card type="inner" title="Device List">
              <Table
                rowKey="deviceId"
                bordered
                pagination={false}
                dataSource={this.state.deviceList}
                columns={columns}
              />
            </Card>
          )}
        </Form>
        <Modal
          closable={true}
          maskClosable={true}
          width={800}
          onOk={() => this.makeBlockUserCall()}
          onCancel={() => this.closeBlockUserModal()}
          okText="Block"
          visible={this.state.showBlockUserModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={6}>
                <strong>Block Reason:</strong>
              </Col>
              <Col span={18}>
                <Select
                  showSearch
                  style={{ width: 500 }}
                  placeholder="Please enter block reason"
                  optionFilterProp="children"
                  onSelect={e => this.updateBlockReason(e)}
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {FraudCheckCategories}
                </Select>
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
    getUserBasicProfileResponse: state.userData.getUserBasicProfileResponse,
    getUserByMobileResponse: state.userData.getUserByMobileResponse,
    getUsersFromDeviceIdResponse: state.userData.getUsersFromDeviceIdResponse,
    blockUserDeviceResponse: state.leaderboard.blockUserDeviceResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...userDataActions, ...leaderboardActions },
      dispatch
    )
  };
}

const SearchDeviceForm = Form.create()(SearchDevice);
export default connect(mapStateToProps, mapDispatchToProps)(SearchDeviceForm);
