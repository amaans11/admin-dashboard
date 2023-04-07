// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Radio
} from 'antd';
import * as leaderboardActions from '../../actions/leaderboardActions';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class RestoreUser extends React.Component {
  componentDidMount() {
    this.props.form.validateFields();
    window.scrollTo(0, 0);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          userId: values.userId,
          lobbyId: values.lobbyId
        };
        if (values.type === 'TOURNAMENT') {
          this.props.actions.restoreUserTournament(data).then(() => {
            if (
              this.props.restoreUserTournamentResponse &&
              this.props.restoreUserTournamentResponse.success
            ) {
              console.log(this.props.restoreUserTournamentResponse);
              message.success('Successfully restored user', 1.5).then(() => {
                window.location.reload();
              });
            } else {
              message.error(
                this.props.restoreUserTournamentResponse.error &&
                  this.props.restoreUserTournamentResponse.error.message
                  ? this.props.restoreUserTournamentResponse.error.message
                  : 'Could not process the request'
              );
            }
          });
        } else {
          this.props.actions.restoreUserLobby(data).then(() => {
            if (
              this.props.restoreUserLobbyResponse &&
              this.props.restoreUserLobbyResponse.success
            ) {
              message.success('Successfully restored user', 1.5).then(() => {
                window.location.reload();
              });
            } else {
              message.error(
                this.props.restoreUserLobbyResponse.error &&
                  this.props.restoreUserLobbyResponse.error.message
                  ? this.props.restoreUserLobbyResponse.error.message
                  : 'Could not process the request'
              );
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
      userId: isFieldTouched('userId') && getFieldError('userId'),
      lobbyId: isFieldTouched('lobbyId') && getFieldError('lobbyId')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Restore User">
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label={'Type'}>
                  {getFieldDecorator('type', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false
                      }
                    ],
                    initialValue: 'TOURNAMENT'
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={'TOURNAMENT'}>
                        Tournament
                      </Radio.Button>
                      <Radio.Button value={'BATTLE'}>Battle</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.userId ? 'error' : ''}
                  help={errors.userId || ''}
                  {...formItemLayout}
                  label={<span>User Id</span>}
                >
                  {getFieldDecorator('userId', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input number!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: 200 }} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.lobbyId ? 'error' : ''}
                  help={errors.lobbyId || ''}
                  {...formItemLayout}
                  label={<span>Tournament/Lobby Id</span>}
                >
                  {getFieldDecorator('lobbyId', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input number!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: 200 }} />)}
                </FormItem>
              </Col>
              <Col span={6} offset={6}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Restore User
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    restoreUserLobbyResponse: state.leaderboard.restoreUserLobbyResponse,
    restoreUserTournamentResponse:
      state.leaderboard.restoreUserTournamentResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...leaderboardActions }, dispatch)
  };
}

const RestoreUserForm = Form.create()(RestoreUser);
export default connect(mapStateToProps, mapDispatchToProps)(RestoreUserForm);
