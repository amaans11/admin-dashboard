// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Button,
  Tag,
  Table,
  Popconfirm,
  message,
  Input,
  Select,
  Modal,
  Row,
  Col,
  Tooltip,
  Icon
} from 'antd';
import _ from 'lodash';
import * as userActions from '../../actions/userActions';
import ExternalUserPwdForm from './ExternalUserPwdForm';

const Option = Select.Option;

const ApplicableRoles = [
  'L1',
  'L1_ESCALATION',
  'L2',
  'VIP_AGENT',
  'MANAGER',
  'FRAUD_DETECTION',
  'ASN_AGENT',
  'ASN_LEAD',
  'VIP_AGENT',
  'US_L1',
  'US_L2',
  'US_L1_ESCALATION',
  'US_VIP_AGENT',
  'US_MANAGER',
  'US_FRAUD_DETECTION'
].map(role => (
  <Option value={role} key={role}>
    {role}
  </Option>
));

class ExternalUserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      selectedRecord: {},
      isPwdModalOpen: false
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.getExternalUsers();
  }

  getExternalUsers() {
    this.props.actions.getExternalUserList().then(() => {
      if (
        this.props.getExternalUserListResponse &&
        this.props.getExternalUserListResponse.length > 0
      ) {
        this.setState({
          userList: [...this.props.getExternalUserListResponse],
          displayList: [...this.props.getExternalUserListResponse],
          showTable: true
        });
      } else {
        message.info('No records found');
        this.setState({ userList: [], displayList: [], showTable: true });
      }
    });
  }

  searchTable(searchString) {
    let userList = [...this.state.userList];
    let displayList = [];
    _.forEach(userList, function(item) {
      if (
        (item.user_name &&
          item.user_name.toLowerCase().includes(searchString.toLowerCase())) ||
        (item.email &&
          item.email.toLowerCase().includes(searchString.toLowerCase()))
      ) {
        displayList.push(item);
      }
    });
    this.setState({ displayList: [...displayList] });
  }

  deleteUser(record) {
    let data = {
      userName: record.user_name
    };
    this.props.actions.deleteExternalUser(data).then(() => {
      if (this.props.deleteExternalUserResponse) {
        if (this.props.deleteExternalUserResponse.error) {
          message.error('Could not delete the record');
        } else {
          message.success('Successfully delete the record', 1).then(() => {
            this.getExternalUsers();
          });
        }
      }
    });
  }

  openAddEditModal(record, actionType) {
    if (actionType === 'EDIT') {
      this.setState({
        selectedRecord: record,
        actionType: actionType,
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
    this.setState({ selectedRecord: {} });
  }

  closeAddEditModal() {
    this.resetFields();
    this.setState({ showAddEditModal: false });
  }

  updateValues(value, valueType) {
    let selectedRecord = _.isEmpty(this.state.selectedRecord)
      ? {}
      : { ...this.state.selectedRecord };
    switch (valueType) {
      case 'USER_NAME':
        selectedRecord['user_name'] = value;
        this.setState({ selectedRecord: { ...selectedRecord } });
        break;
      case 'PASSWORD':
        selectedRecord['user_password'] = value;
        this.setState({ selectedRecord: { ...selectedRecord } });
        break;
      case 'EMAIL':
        selectedRecord['email'] = value;
        this.setState({ selectedRecord: { ...selectedRecord } });
        break;
      case 'USER_ROLE':
        if (value.length < 1) {
          message.error('Please select at least one role');
          return;
        }
        let role = [...value];
        selectedRecord['user_role'] = role;
        this.setState({ selectedRecord: { ...selectedRecord } });
        break;
      default:
        break;
    }
  }

  saveChanges() {
    let data = {};
    let selectedRecord = { ...this.state.selectedRecord };

    if (this.state.actionType === 'EDIT') {
      data = {
        userRole: selectedRecord.user_role,
        email: selectedRecord.email
      };
      this.props.actions.updateExternalUser(data).then(() => {
        if (this.props.updateExternalUserResponse) {
          if (this.props.updateExternalUserResponse.error) {
            message.error('Could not update the record');
          } else {
            message.success('Successfully updated the user', 1).then(() => {
              this.closeAddEditModal();
              this.getExternalUsers();
            });
          }
        }
      });
    } else {
      if (
        !selectedRecord.user_name ||
        !selectedRecord.user_password ||
        !selectedRecord.email ||
        !selectedRecord.user_role
      ) {
        message.error('All fields are mandatory');
        return;
      }

      let emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;

      if (!emailRegEx.test(selectedRecord.email)) {
        message.error('Invalid Email address');
        return;
      }

      data = {
        username: selectedRecord.user_name,
        // password: sha256(selectedRecord.user_password), // sha256(values.password);
        password: selectedRecord.user_password,
        email: selectedRecord.email,
        role: selectedRecord.user_role
      };
      this.props.actions.createExternalUser(data).then(() => {
        if (this.props.createExternalUserResponse) {
          if (this.props.createExternalUserResponse.error) {
            message.error(
              this.props.createExternalUserResponse.error
                ? this.props.createExternalUserResponse.error
                : 'Could not create the record'
            );
          } else {
            message.success('Successfully created the user', 1).then(() => {
              this.closeAddEditModal();
              this.getExternalUsers();
            });
          }
        }
      });
    }
  }

  openPasswordModal = record => {
    this.setState({
      isPwdModalOpen: true,
      selectedRecord: record
    });
  };

  closePasswordModal = () => {
    this.setState({
      isPwdModalOpen: false
    });
  };

  updatePassword = data => {
    this.props.actions.updateExternalUserPwd(data).then(() => {
      if (
        this.props.updateExternalUserPwdResponse &&
        this.props.updateExternalUserPwdResponse.status &&
        this.props.updateExternalUserPwdResponse.status.code === 200
      ) {
        message.success('Password updated');
        this.closePasswordModal();
      }
    });
  };

  render() {
    const columns = [
      {
        title: 'User Name',
        dataIndex: 'user_name',
        key: 'user_name',
        render: (text, record) => (
          <span>
            {record.active ? (
              <Tag color="green">ACTIVE</Tag>
            ) : (
              <Tag color="green">INACTIVE</Tag>
            )}{' '}
            {'  '}
            {record.user_name}
          </span>
        )
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text, record) => <span>{record.email}</span>
      },
      {
        title: 'Role',
        dataIndex: 'user_role',
        key: 'user_role',
        render: (text, record) => <span>{record.user_role.join(', ')}</span>
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            {(this.props.currentUser.user_role.includes('REFUND_SUPERVISOR') ||
              this.props.currentUser.user_role.includes('SUPER_ADMIN')) && (
              <Button
                shape="circle"
                icon="edit"
                type="primary"
                onClick={() => this.openAddEditModal(record, 'EDIT')}
              />
            )}
            {(this.props.currentUser.user_role.includes('REFUND_SUPERVISOR') ||
              this.props.currentUser.user_role.includes('SUPER_ADMIN')) && (
              <Tooltip title="Update password for user">
                <Button
                  shape="circle"
                  icon="key"
                  type="primary"
                  onClick={() => this.openPasswordModal(record, 'EDIT')}
                />
              </Tooltip>
            )}
            {(this.props.currentUser.user_role.includes('REFUND_SUPERVISOR') ||
              this.props.currentUser.user_role.includes('SUPER_ADMIN')) && (
              <Popconfirm
                title="Are you sure to delete this user permanently?"
                onConfirm={() => this.deleteUser(record)}
              >
                <Button
                  style={{ marginLeft: '5px' }}
                  shape="circle"
                  icon="delete"
                  type="danger"
                />
              </Popconfirm>
            )}
          </span>
        )
      }
    ];
    return (
      <React.Fragment>
        {this.state.showTable && (
          <Card
            title="List of External Users"
            extra={
              <Button
                type="default"
                icon="user"
                onClick={() => this.openAddEditModal({}, 'NEW')}
              >
                Add New User
              </Button>
            }
          >
            <Card type="inner">
              <Input
                placeholder={'Search by username or email'}
                onChange={e => this.searchTable(e.target.value)}
              />
            </Card>
            <Table
              rowKey="email"
              bordered
              dataSource={this.state.displayList}
              columns={columns}
            />
          </Card>
        )}
        <Modal
          title={'User Modal'}
          closable={true}
          maskClosable={true}
          width={900}
          onCancel={() => this.closeAddEditModal()}
          onOk={() => this.saveChanges()}
          okText="Save"
          visible={this.state.showAddEditModal}
        >
          <Card>
            <Row>
              {this.state.actionType === 'NEW' && (
                <>
                  <Col
                    span={24}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '20px'
                    }}
                  >
                    <Col span={6}>User Name:</Col>
                    <Col span={14}>
                      <Input
                        value={
                          this.state.selectedRecord &&
                          this.state.selectedRecord.user_name
                            ? this.state.selectedRecord.user_name
                            : null
                        }
                        onChange={e =>
                          this.updateValues(e.target.value, 'USER_NAME')
                        }
                        style={{ width: '80%' }}
                        placeholder="Enter username"
                      />
                    </Col>
                  </Col>
                  <Col
                    span={24}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '20px'
                    }}
                  >
                    <Col span={6}>Password:</Col>
                    <Col span={14}>
                      <Input
                        value={
                          this.state.selectedRecord &&
                          this.state.selectedRecord.user_password
                            ? this.state.selectedRecord.user_password
                            : null
                        }
                        onChange={e =>
                          this.updateValues(e.target.value, 'PASSWORD')
                        }
                        style={{ width: '80%' }}
                        placeholder="Enter a strong password"
                        suffix={
                          <Tooltip title="Password should be 8 chars long with atleast 1 Capital, 1 small, 1 number and 1 special cahracter from (! @ # $ % ^ &  *)">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        }
                      />
                    </Col>
                  </Col>
                  <Col
                    span={24}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '20px'
                    }}
                  >
                    <Col span={6}>Email:</Col>
                    <Col span={14}>
                      <Input
                        value={
                          this.state.selectedRecord &&
                          this.state.selectedRecord.email
                            ? this.state.selectedRecord.email
                            : null
                        }
                        onChange={e =>
                          this.updateValues(e.target.value, 'EMAIL')
                        }
                        style={{ width: '80%' }}
                        placeholder="Enter email"
                      />
                    </Col>
                  </Col>
                </>
              )}
              <Col
                span={24}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '20px'
                }}
              >
                <Col span={6}>Select Roles:</Col>
                <Col span={14}>
                  <Select
                    value={
                      this.state.selectedRecord &&
                      this.state.selectedRecord.user_role
                        ? this.state.selectedRecord.user_role
                        : []
                    }
                    mode="multiple"
                    showSearch
                    onChange={e => this.updateValues(e, 'USER_ROLE')}
                    style={{ width: '80%' }}
                    placeholder="Select User roles"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {ApplicableRoles}
                  </Select>
                </Col>
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title="Update password for user"
          closable={true}
          maskClosable={true}
          width={900}
          onCancel={() => this.closePasswordModal()}
          onOk={() => this.closePasswordModal()}
          footer={null}
          visible={this.state.isPwdModalOpen}
          centered
          destroyOnClose={true}
        >
          <ExternalUserPwdForm
            formData={this.state.selectedRecord}
            handleSubmit={this.updatePassword}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    getExternalUserListResponse: state.user.getExternalUserListResponse,
    deleteExternalUserResponse: state.user.deleteExternalUserResponse,
    updateExternalUserResponse: state.user.updateExternalUserResponse,
    createExternalUserResponse: state.user.createExternalUserResponse,
    updateExternalUserPwdResponse: state.user.updateExternalUserPwdResponse,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExternalUserList);
