import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userDataActions from '../../actions/userDataActions';
import { Card, Table, Button, Form, InputNumber, Modal } from 'antd';
import { forEach, find } from 'lodash';

class FollowerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      tableData: [],
      showDetails: false,
      limitCount: 10,
      userDetailModal: false,
      userDetails: []
    };
    this.getDetatils = this.getDetatils.bind(this);
    this.fetchBasicProfiles = this.fetchBasicProfiles.bind(this);
    this.getUserList = this.getUserList.bind(this);
    this.setLimit = this.setLimit.bind(this);
  }

  getDetatils(record) {
    let data = {
      userId: record.id.low
    };
    this.props.actions.getUserDetailProfile(data).then(() => {
      if (this.props.getUserDetailProfileResponse) {
        this.setState({
          userDetailModal: true,
          userDetails: this.props.getUserDetailProfileResponse
        });
      }
    });
  }

  fetchBasicProfiles(userIds) {
    let data = {
      userIds: userIds
    };
    this.props.actions.getUserBasicProfileList(data).then(() => {
      if (this.props.getBasicUserDetailListResponse) {
        let csvData = [];
        let details = [];
        let main = this;
        forEach(this.props.getBasicUserDetailListResponse.profiles, function(
          item
        ) {
          let userObj = find(main.state.users, function(user) {
            return user.userId === item.id.low;
          });
          item['follower'] = userObj.followerCount;
          item['following'] = userObj.followingCount;
          details.push(item);
        });
        this.setState({ tableData: [...details] });
      }
      this.setState({
        showTable: true
      });
    });
  }

  getUserList(e) {
    e.preventDefault();
    let data = {
      relationType: 'follower_count',
      count: this.state.limitCount
    };
    this.props.actions.getFollowerUserList(data).then(() => {
      if (this.props.getFollowerListResponse) {
        let userIds = [];
        this.setState({
          users: { ...this.props.getFollowerListResponse.users }
        });
        forEach(this.props.getFollowerListResponse.users, function(item) {
          userIds.push(item.userId);
        });
        this.fetchBasicProfiles(userIds);
      }
    });
  }

  setLimit(newValue) {
    this.setState({ limitCount: newValue });
  }

  render() {
    const columns = [
      {
        title: 'Id',
        key: 'id',
        render: record => <span>{record.id.low}</span>
      },
      {
        title: 'Mobile Number',
        key: 'mobileNumber',
        dataIndex: 'mobileNumber'
      },
      {
        title: 'Display Name',
        key: 'displayName',
        dataIndex: 'displayName'
      },
      {
        title: 'Avatar',
        key: 'avatarUrl',
        render: record => (
          <span>
            {record.avatarUrl && (
              <span>
                <img className="baner-list-img" src={record.avatarUrl} alt="" />
              </span>
            )}
          </span>
        )
      },
      {
        title: 'Is Pro',
        key: 'isPro',
        render: record => <span>{record.isPro ? 'PRO' : 'PS'}</span>
      },
      {
        title: 'Tier',
        key: 'tier',
        dataIndex: 'tier'
      },
      {
        title: 'Follower',
        key: 'follower',
        dataIndex: 'follower'
      },
      {
        title: 'Following',
        key: 'following',
        dataIndex: 'following'
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            <Button
              shape="circle"
              icon="info"
              onClick={() => this.getDetatils(record)}
              type="primary"
            />
          </span>
        )
      }
    ];
    const hideModal = () => {
      this.setState({
        userDetailModal: false
      });
    };
    const handleOk = () => {
      this.setState({
        userDetailModal: false
      });
    };
    return (
      <React.Fragment>
        <Card>
          <Form onSubmit={this.getUserList}>
            <Form.Item
              label="Total Count"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14, offset: 4 }}
            >
              <InputNumber
                onChange={this.setLimit}
                value={this.state.limitCount}
                min={1}
              />
            </Form.Item>
            {/* <Button type="primary" icon="save" onClick={() => this.getUserList()}>
              Get User List
            </Button> */}
            <Button type="primary" htmlType="submit">
              Get User List
            </Button>
          </Form>
        </Card>
        {this.state.showTable ? (
          <Card>
            <Table
              bordered
              dataSource={this.state.tableData}
              columns={columns}
            />
          </Card>
        ) : (
          ''
        )}
        <Modal
          title={'Raw Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal}
          onOk={handleOk}
          visible={this.state.userDetailModal}
        >
          <Card>{JSON.stringify(this.state.userDetails)}</Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getBasicUserDetailListResponse:
      state.userData.getBasicUserDetailListResponse,
    getFollowerListResponse: state.userData.getFollowerListResponse,
    //getFollowerListResponse: state.userData.getFollowerListResponse,
    getUserDetailProfileResponse: state.userData.getUserDetailProfileResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...userDataActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowerList);
