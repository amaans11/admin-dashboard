// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {
  Card,
  Form,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Popconfirm,
  Radio,
  Table,
  Input,
  Modal,
  Select
} from 'antd';

import * as fraudActions from '../../actions/fraudActions';
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
class SearchDetail extends React.Component {
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
    this.getAllDetails = this.getAllDetails.bind(this);
    this.updateSearchCriteria = this.updateSearchCriteria.bind(this);
    this.blockUser = this.blockUser.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    window.scrollTo(0, 0);
    if (this.props.location.pathname.search('search-user') === 1) {
      this.setState({ isSearch: true });
    } else {
      this.setState({ isSearch: false });
    }
  }

  getAllDetails(userId) {
    let data = {
      userId: userId
    };
    this.props.actions.getUserBasicProfile(data).then(() => {
      if (this.props.getUserBasicProfileResponse) {
        this.setState({
          userDetail: { ...this.props.getUserBasicProfileResponse.profile },
          showDetail: true
        });
      }
    });
  }

  updateSearchCriteria = e => {
    this.props.form.setFieldsValue({
      searchFor: null
    });
    this.setState({
      userDetail: {},
      showDetail: false,
      deviceList: [],
      showTable: false
    });
  };

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
      .blockUser(vm.state.blockUserId, 1, 'DIRECT', vm.state.blockReason)
      .then(() => {
        this.setState({ blockUserId: null, blockReason: '' });
        message.info('User is blocked');
      });
  }

  blockUser(userId) {
    this.setState({
      blockUserId: userId,
      showBlockUserModal: true
    });
  }

  addToCug(userId) {
    //console.log(userId);
    let data = {
      userId: userId
    };
    this.props.actions.addToCug(data).then(() => {
      if (this.props.addToCugResponse) {
        if (this.props.addToCugResponse.success) {
          message.success('User added to CUG list successfully', 1).then(() => {
            window.location.reload();
          });
        } else {
          message.error('Could not update the CUG list');
        }
      }
    });
  }

  sortTheDeviceList(data) {
    let sortedData = data.sort(function(a, b) {
      if (a[1] < b[1]) {
        return 1;
      }
      if (a[1] > b[1]) {
        return -1;
      }
      return 0;
    });

    return sortedData;
  }

  objectToArray(data, userId) {
    let arr = Object.entries(data.deviceIdList);
    let sortedData = this.sortTheDeviceList(arr);

    let obj = {};
    let arrayOfDeviceIds = sortedData.map(el => ({
      ...obj,
      ['userId']: userId.userId,
      ['deviceId']: el[0],
      ['time']: moment(el[1]).format('DD/MM/YY hh:mm A')
    }));

    return arrayOfDeviceIds;
  }

  getAllDeviceIds() {
    let data = {
      // userId: this.state.userDetail.id.low
      userId:
        typeof this.state.userDetail.id === 'object'
          ? this.state.userDetail.id.low
          : this.state.userDetail.id
    };
    this.props.actions.getAllDeviceId(data).then(() => {
      let response = this.objectToArray(
        this.props.getAllDeviceIdResponse,
        data.userId
      );
      if (response) {
        this.setState({
          deviceList: [...response],
          showTable: true
        });
      } else {
        message.info('No device id found for the user');
      }
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
        if (values.searchCriteria === 'USER_ID') {
          this.getAllDetails(values.searchFor);
        } else {
          let data = {
            mobileNumber: values.searchFor
          };
          this.props.actions.getUserByMobile(data).then(() => {
            if (this.props.getUserByMobileResponse) {
              if (this.props.getUserByMobileResponse.error) {
                message.error(this.props.getUserByMobileResponse.error.message);
                return;
              } else {
                this.getAllDetails(
                  this.props.getUserByMobileResponse.profile.id
                );
              }
            } else {
              message.error('Unable to fetch details for the mobile number');
              return;
            }
          });
        }
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
        title: 'Device Id',
        dataIndex: 'deviceId',
        key: 'deviceId'
      },
      {
        title: 'Login Time',
        dataIndex: 'time',
        key: 'loginTime'
      }
      //Action Column
      // {
      //   title: 'Actions',
      //   key: 'actions',
      //   render: (text, record) => (
      //     <span>
      //       <Popconfirm
      //         title="Are you sure you want to block this user and device?"
      //         onConfirm={() => this.blockDevice(record)}
      //       >
      //         <Button type="danger">Block Device</Button>
      //       </Popconfirm>
      //     </span>
      //   )
      // }
    ];

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="User Details">
            <Row>
              <Col span={20}>
                <FormItem {...formItemLayout} label={'Search Criteria'}>
                  {getFieldDecorator('searchCriteria', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false
                      }
                    ],
                    initialValue: 'MOBILE_NUMBER'
                  })(
                    <Radio.Group
                      onChange={e => this.updateSearchCriteria(e)}
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button value={'MOBILE_NUMBER'}>
                        Mobile Number
                      </Radio.Button>
                      <Radio.Button value={'USER_ID'}>User Id</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.searchFor ? 'error' : ''}
                  help={errors.searchFor || ''}
                  {...formItemLayout}
                  {...formItemLayout}
                  label={<span>Search For</span>}
                >
                  {getFieldDecorator('searchFor', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input number!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: 150 }} />)}
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
                <Button type="primary" onClick={() => this.getAllDeviceIds()}>
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
                  User Id:{' '}
                  <strong>
                    {typeof this.state.userDetail.id === 'object'
                      ? this.state.userDetail.id.low
                      : this.state.userDetail.id}
                  </strong>
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
                <Col style={{ marginTop: '10px' }} span={24}>
                  {!this.state.isSearch && (
                    <Button
                      onClick={() =>
                        this.blockUser(
                          typeof this.state.userDetail.id === 'object'
                            ? this.state.userDetail.id.low
                            : this.state.userDetail.id
                        )
                      }
                      type="danger"
                    >
                      Block User
                    </Button>
                  )}
                  {this.state.isSearch && (
                    <Popconfirm
                      title="Are you sure you want to add this user to CUG?"
                      onConfirm={() =>
                        this.addToCug(
                          typeof this.state.userDetail.id === 'object'
                            ? this.state.userDetail.id.low
                            : this.state.userDetail.id
                        )
                      }
                    >
                      <Button style={{ marginLeft: '10px' }}>Add to CUG</Button>
                    </Popconfirm>
                  )}
                </Col>
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
    getAllDeviceIdResponse: state.fraud.getAllDeviceIdResponse,
    blockUserDeviceResponse: state.leaderboard.blockUserDeviceResponse,
    addToCugResponse: state.userData.addToCugResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...fraudActions, ...userDataActions, ...leaderboardActions },
      dispatch
    )
  };
}

const SearchDetailForm = Form.create()(SearchDetail);
export default connect(mapStateToProps, mapDispatchToProps)(SearchDetailForm);
