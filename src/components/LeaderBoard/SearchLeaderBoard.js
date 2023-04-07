// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import moment from "moment";
import * as leaderboardActions from '../../actions/leaderboardActions';
import {
  Card,
  Table,
  Form,
  InputNumber,
  Tooltip,
  Popconfirm,
  Button,
  Avatar,
  message,
  Icon,
  Modal,
  Divider,
  Input,
  Row,
  Col
} from 'antd';

import * as user_role from '../../auth/userPermission';
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
// type index ={}
const FormItem = Form.Item;
// const { Meta } = Card;
const permitted_roles = [
  user_role.LEADERBOARD_ADMIN,
  user_role.LEADERBOARD_WRITE,
  user_role.LEADERBOARD_READ,
  user_role.SUPER_ADMIN
];
class SearchLeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lb: [],
      gameOrder: [],
      gameIndex: 0,
      previewVisible: false,
      blockReason: '',
      showBlockUserModal: false
    };
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    var vm = this;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.getLeaderboardById(values.tId).then(() => {
          if (vm.props.leaderboard.lbById.length === 0) {
            message.info(
              'Tournaments leader is not available this time, Try next one'
            );
          } else {
            this.setState({
              lb: vm.props.leaderboard.lbById
            });
            // let lb = vm.props.leaderboard.lb.slice();
            // this.passUserInfo(lb);
          }
        });
      }
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

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
      .blockUser(
        vm.state.blockUserId,
        vm.state.tournamentId,
        'TOURNAMENT',
        vm.state.blockReason
      )
      .then(() => {
        this.setState({
          blockUserId: null,
          blockReason: '',
          showBlockUserModal: false
        });
      });
  }

  blockUser(user) {
    this.setState({
      blockUserId: user.userId,
      tournamentId: user.tournament.tournamentId,
      showBlockUserModal: true
    });
  }

  getGamePlay(e, record) {
    var vm = this;
    this.props.actions.getUserGamePlay(record).then(() => {
      vm.setState({
        userProfile: vm.props.leaderboard.userProfile,
        previewVisible: true,
        showUser: false,
        showGamePlay: true
      });
    });
  }
  getUser(user) {
    var vm = this;
    this.props.actions.getUserProfile(user.userId).then(() => {
      vm.setState({
        gamePlayInfo: vm.props.leaderboard.userGamePlay,
        previewVisible: true,
        showUser: true,
        showGamePlay: false
      });
    });
  }
  gameChanged(game, index) {
    var vm = this;

    if (game.groups) {
      this.props.actions.getLeaderboardByGame(game, index).then(() => {
        // let lb = vm.props.leaderboard.lb.slice();
        // this.passUserInfo(lb);
        vm.setState({
          gameIndex: index,
          lb: vm.props.leaderboard.lb,
          game: game
        });
      });
    } else {
      message.info('No Tournaments are runing in this game. Try next one');
    }
  }

  kickUser(record) {
    console.log(record);
    let data = {
      tournamentId: record.tournament.tournamentId,
      userId: record.userId
    };
    this.props.actions.kickUser(data).then(() => {
      if (this.props.kickUserResponse && this.props.kickUserResponse.success) {
        message.success('User kicked out successfully');
      } else {
        message.error('Failed to kick out the user');
      }
    });
  }

  render() {
    const columns = [
      {
        title: 'R',
        dataIndex: 'rank',
        width: 70
      },
      {
        title: 'User Id',
        dataIndex: 'userId'
      },

      {
        title: 'Name',
        dataIndex: 'name',
        width: 100
      },

      {
        title: 'Score',
        dataIndex: 'score'
      },

      {
        title: 'Actions',
        dataIndex: 'action',
        width: 180,
        key: 'action',
        render: (text, record) =>
          permitted_roles.filter(e =>
            this.props.currentUser.user_role.includes(e)
          ).length ? (
            <span>
              <Tooltip
                placement="topLeft"
                title="Get User Details"
                arrowPointAtCenter
              >
                <Button
                  style={{ marginLeft: 5 }}
                  shape="circle"
                  icon="user"
                  onClick={() => this.getUser(record)}
                  type="primary"
                />
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip
                placement="topLeft"
                title="Get Score Details"
                arrowPointAtCenter
              >
                <Button
                  style={{ marginLeft: 5 }}
                  shape="circle"
                  icon="book"
                  onClick={e => this.getGamePlay(e, record)}
                  type="primary"
                />
              </Tooltip>
              <Divider type="vertical" />
              <Popconfirm
                title="Sure to kick user?"
                onConfirm={() => this.kickUser(record)}
              >
                <Button shape="circle" icon="logout" type="danger" />
              </Popconfirm>
            </span>
          ) : (
            ''
          )
      }
    ];
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        lg: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };
    const tIdError = isFieldTouched('tId') && getFieldError('tId');
    return (
      <React.Fragment>
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
                <Input
                  showSearch
                  onChange={e => this.updateBlockReason(e.target.value)}
                  placeholder="Please enter block reason"
                />
              </Col>
            </Row>
          </Card>
        </Modal>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={tIdError ? 'error' : ''}
              help={tIdError || ''}
              {...formItemLayout}
              label={
                <span>
                  Enter Tournament Id
                  <Tooltip title="Enter the id of tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('tId', {
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'Please input maximum number of game play!',
                    whitespace: false
                  }
                ],
                initialValue: 1000
              })(<InputNumber min={-1} style={{ width: '70%' }} />)}
            </FormItem>
            <Button
              type="primary"
              disabled={hasErrors(getFieldsError())}
              htmlType="submit"
            >
              Search
            </Button>
          </Form>
        </Card>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {this.props.leaderboard.userProfile && this.state.showUser ? (
            <div>
              <Avatar
                src={
                  this.props.leaderboard.userProfile &&
                  this.props.leaderboard.userProfile.profile &&
                  this.props.leaderboard.userProfile.profile.avatars &&
                  this.props.leaderboard.userProfile.profile.avatars.small
                    ? this.props.leaderboard.userProfile.profile.avatars.small
                    : ''
                }
              />
              <span style={{ marginLeft: 10 }}>
                {this.props.leaderboard.userProfile
                  ? this.props.leaderboard.userProfile.profile.displayName
                  : ''}
              </span>
              <div>
                Mobile:{' '}
                {this.props.leaderboard.userProfile
                  ? this.props.leaderboard.userProfile.profile.mobileNumber
                  : ''}
              </div>
              {/* <div>{JSON.stringify(this.state.userProfile.profile)}</div> */}
            </div>
          ) : (
            ''
          )}
          {this.props.leaderboard.userGamePlay && this.state.showGamePlay ? (
            <div>{this.props.leaderboard.userGamePlay}</div>
          ) : (
            ''
          )}
        </Modal>
        {this.state.lb.length ? (
          <React.Fragment>
            <Card>
              <Table
                rowKey="userId"
                bordered
                dataSource={this.state.lb}
                columns={columns}
              />
            </Card>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    leaderboard: state.leaderboard,
    currentUser: state.auth.currentUser,
    kickUserResponse: state.leaderboard.kickUserResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(leaderboardActions, dispatch)
  };
}
const SearchLeaderBoardForm = Form.create()(SearchLeaderBoard);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchLeaderBoardForm);
