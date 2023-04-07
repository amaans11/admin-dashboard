import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Tooltip,
  message,
  Icon,
  Button,
  InputNumber,
  Radio,
  Select,
  Input,
  Col,
  Row
} from 'antd';
import * as leaderboardActions from '../../actions/leaderboardActions';
import * as gameActions from '../../actions/gameActions';
import * as userProfileActions from '../../actions/UserProfileActions';
import * as userDataActions from '../../actions/userDataActions';
import UploadProofFile from '../Fraud/UploadProofFile';

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class UnBlockPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unblockCriteria: 'APP_LEVEL',
      loading: false,
      type: 'MOBILE_NUMBER'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.form.validateFields();
    this.getGameList();
  }

  getGameList() {
    let gameList = [];
    this.props.actions.getAllGames().then(() => {
      if (this.props.gameList && this.props.gameList.length > 0) {
        this.props.gameList.map(game => {
          gameList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
        this.setState({ gameList });
      } else {
        message.error('Could not fetch games list');
        this.setState({ gameList: [] });
      }
    });
  }

  updateUnblockCriteria(value) {
    this.setState({ unblockCriteria: value });
  }

  segmentUrlCallback = data => {
    this.setState({
      unblockDoc: data && data.id ? data.id : ''
    });
  };

  unblockUser = (userId, values) => {
    if (this.state.unblockCriteria === 'APP_LEVEL_V2') {
      let data = {
        userId: [userId],
        reason: values.reason,
        unblockDevice: values.unblockDevice,
        unblockDoc: this.state.unblockDoc ? this.state.unblockDoc : null
      };
      this.props.actions.unblockUserNew(data).then(() => {
        if (this.props.unblockUserNewResponse) {
          if (!this.props.unblockUserNewResponse.isSuccess) {
            message.error('Could not unblock the user');
          } else if (this.props.unblockUserNewResponse.fraudServiceError) {
            message.error(
              this.props.unblockUserNewResponse.fraudServiceError.message
                ? this.props.unblockUserNewResponse.fraudServiceError.message
                : 'Could not complete the request'
            );
          } else {
            message.success('Unblocked the user successfully', 1.5).then(() => {
              window.location.reload();
            });
          }
        }
      });
    } else {
      let data = {
        userId: [userId],
        gameId:
          values.gameId && values.gameId.length > 0 ? [...values.gameId] : [],
        unblockForAllGames:
          this.state.unblockCriteria === 'GAME_LEVEL' ? false : true,
        unblockCategory:
          this.state.unblockCriteria === 'APP_LEVEL'
            ? 'APP_LEVEL'
            : 'GAME_LEVEL'
      };
      this.props.actions.unblockUserGame(data).then(() => {
        if (this.props.unblockUserGameResponse) {
          if (
            this.props.unblockUserGameResponse.requestStatus ||
            this.props.unblockUserGameResponse.error
          ) {
            message.error('Could not unblock the user');
          } else if (this.props.unblockUserGameResponse.fraudServiceError) {
            message.error(
              this.props.unblockUserGameResponse.fraudServiceError.message
                ? this.props.unblockUserGameResponse.fraudServiceError.message
                : 'Could not complete the request'
            );
          } else {
            message.success('Unblocked the user successfully', 1.5).then(() => {
              window.location.reload();
            });
          }
        }
      });
    }
  };

  handleSubmit(e) {
    const { type } = this.state;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (type == 'MOBILE_NUMBER') {
          this.props.actions
            .getProfileByMobile({ mobileNumber: values.mobileNumber })
            .then(() => {
              if (
                this.props.getProfileByMobileResponse &&
                this.props.getProfileByMobileResponse.profile
              ) {
                console.log(
                  'this.props.getProfileByMobileResponse',
                  this.props.getProfileByMobileResponse
                );
                let basicProfile = {
                  ...this.props.getProfileByMobileResponse.profile
                };
                this.unblockUser(basicProfile.id, values);
              }
            });
        } else if (type === 'SUID') {
          this.props.actions.getUserIdSuid({ suid: values.suid }).then(() => {
            if (this.props.userIdSuid) {
              this.unblockUser(this.props.userIdSuid.userId, values);
            }
          });
        } else {
          this.unblockUser(values.userId, values);
        }
      } else {
        message.error('User Not Found!');
      }
    });
  }

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
      mobileNumber:
        isFieldTouched('mobileNumber') && getFieldError('mobileNumber'),
      gameId: isFieldTouched('gameId') && getFieldError('gameId'),
      reason: isFieldTouched('reason') && getFieldError('reason'),
      suid: isFieldTouched('suid') && getFieldError('suid'),
      userId: isFieldTouched('userId') && getFieldError('userId')
    };
    const { type } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Unblock User">
            <FormItem {...formItemLayout} label={'Unblock Criteria'}>
              {getFieldDecorator('unblockCriteria', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: this.state.unblockCriteria
              })(
                <Radio.Group
                  onChange={e => this.updateUnblockCriteria(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={'APP_LEVEL'}>App Level</Radio.Button>
                  <Radio.Button value={'APP_LEVEL_V2'}>
                    App Level V2
                  </Radio.Button>
                  <Radio.Button value={'ALL_GAMES'}>All Games</Radio.Button>
                  <Radio.Button value={'GAME_LEVEL'}>Game Level</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <Row style={{ marginBottom: 20 }}>
              <Col span={5}></Col>
              <Col span={5}>
                <Radio.Group
                  onChange={e => {
                    this.setState({ type: e.target.value });
                  }}
                  value={type}
                >
                  <Radio value="MOBILE_NUMBER">Mobile Number</Radio>
                  <Radio value="USER_ID">User ID</Radio>
                  <Radio value="SUID">Hashed UID</Radio>
                </Radio.Group>
              </Col>
            </Row>
            {type == 'MOBILE_NUMBER' ? (
              <FormItem
                validateStatus={errors.mobileNumber ? 'error' : ''}
                {...formItemLayout}
                label={
                  <span>
                    Mobile Number
                    <Tooltip title="unblock user">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('mobileNumber', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input number!',
                      whitespace: true,
                      type: 'number'
                    }
                  ]
                })(<InputNumber style={{ width: 300 }} />)}
              </FormItem>
            ) : type == 'USER_ID' ? (
              <FormItem
                validateStatus={errors.userId ? 'error' : ''}
                {...formItemLayout}
                label={<span>User ID</span>}
              >
                {getFieldDecorator('userId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input user id!',
                      message: ' ',
                      whitespace: false
                    }
                  ]
                })(<Input style={{ width: '400px' }} />)}
              </FormItem>
            ) : (
              <FormItem
                validateStatus={errors.suid ? 'error' : ''}
                {...formItemLayout}
                label={<span>Hashed UID</span>}
              >
                {getFieldDecorator('suid', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input hashed uid!',
                      message: ' ',
                      whitespace: false
                    }
                  ]
                })(<Input style={{ width: '400px' }} />)}
              </FormItem>
            )}
            {this.state.unblockCriteria === 'GAME_LEVEL' && (
              <FormItem
                validateStatus={errors.gameId ? 'error' : ''}
                help={errors.gameId || ''}
                {...formItemLayout}
                label={<span>Games</span>}
              >
                {getFieldDecorator('gameId', {
                  rules: [
                    {
                      type: 'array',
                      required: true,
                      message: 'Please select games!'
                    }
                  ]
                })(
                  <Select
                    showSearch
                    mode="multiple"
                    style={{ width: 600 }}
                    placeholder="Select games"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.gameList}
                  </Select>
                )}
              </FormItem>
            )}
            {this.state.unblockCriteria === 'APP_LEVEL_V2' && (
              <>
                <FormItem
                  validateStatus={errors.reason ? 'error' : ''}
                  {...formItemLayout}
                  label={'Reason'}
                >
                  {getFieldDecorator('reason', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input number!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'Unblock Device'}>
                  {getFieldDecorator('unblockDevice', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ],
                    initialValue: false
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={false}>No</Radio.Button>
                      <Radio.Button value={true}>Yes</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={<span>Unblock Doc</span>}>
                  {getFieldDecorator('unblockDoc', {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(
                    <UploadProofFile
                      callbackFromParent={this.segmentUrlCallback}
                    />
                  )}
                </FormItem>
              </>
            )}
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Unblock
            </Button>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    BlockPlayer: state.BlockPlayer,
    gameList: state.games.getAllGamesResponse,
    unblockUserGameResponse: state.leaderboard.unblockUserGameResponse,
    unblockUserNewResponse: state.leaderboard.unblockUserNewResponse,
    getProfileByMobileResponse: state.userProfile.getProfileByMobileResponse,
    userIdSuid: state.userData.userIdSuid
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...leaderboardActions,
        ...gameActions,
        ...userProfileActions,
        ...userDataActions
      },
      dispatch
    )
  };
}

const UnBlockPlayerForm = Form.create()(UnBlockPlayer);
export default connect(mapStateToProps, mapDispatchToProps)(UnBlockPlayerForm);
