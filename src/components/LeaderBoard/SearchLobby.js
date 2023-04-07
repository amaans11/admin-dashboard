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
  message,
  Icon,
  Modal,
  Row,
  Col,
  Input
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
class SearchLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyLeaderboard: [],
      lobbyId: null,
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
        this.setState({ lobbyId: values.tId });
        this.props.actions.getLobbyLeaderboard(values.tId).then(() => {
          if (
            this.props.leaderboard &&
            this.props.leaderboard.lobbyLeaderBoardDetails &&
            this.props.leaderboard.lobbyLeaderBoardDetails.leaderboard
              .lobbyLeaderboard
          ) {
            this.setState({
              lobbyLeaderboard: [
                ...this.props.leaderboard.lobbyLeaderBoardDetails.leaderboard
                  .lobbyLeaderboard
              ]
            });
          } else {
            message.info('Leaderboard is empty');
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
        vm.state.lobbyId,
        'LOBBY',
        vm.state.blockReason
      )
      .then(() => {
        this.setState({
          blockUserId: null,
          blockReason: '',
          showBlockUserModal: false
        });
        window.location.reload();
      });
  }

  blockUser(user) {
    this.setState({
      blockUserId: user.userId,
      lobbyId: this.state.lobbyId,
      showBlockUserModal: true
    });
  }

  getGamePlay(e, record) {
    console.log(record);
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
      this.props.actions.getLeaderboardByGame(game.groups, index).then(() => {
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
        title: 'Wins',
        dataIndex: 'wins'
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
        lg: { span: 14 }
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
                  Lobby Id
                  <Tooltip title="Enter the id of tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('tId', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Mandatory field!',
                    whitespace: false
                  }
                ],
                initialValue: null
              })(<InputNumber style={{ width: '30%' }} min={-1} />)}
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

        {this.state.lobbyLeaderboard && this.state.lobbyLeaderboard.length ? (
          <React.Fragment>
            <Card>
              <Table
                rowKey="userId"
                bordered
                dataSource={this.state.lobbyLeaderboard}
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
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(leaderboardActions, dispatch)
  };
}
const SearchLobbyForm = Form.create()(SearchLobby);
export default connect(mapStateToProps, mapDispatchToProps)(SearchLobbyForm);
