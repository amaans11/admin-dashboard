import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseballActions from '../../actions/BaseballActions';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  message,
  Input,
  InputNumber
} from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class EditPlayerScore extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.playerScoreInfo) {
      this.setState({
        seasonGameUid: this.props.seasonGameUid,
        firstName: this.props.playerScoreInfo.firstName,
        lastName: this.props.playerScoreInfo.lastName,
        fullName: this.props.playerScoreInfo.fullName,
        playerUid: this.props.playerScoreInfo.playerUid,
        playerTeamId: this.props.playerScoreInfo.playerTeamId,
        score: this.props.playerScoreInfo.score,
        playerTeamName: this.props.playerScoreInfo.playerTeamName
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    let updateFlag = false;
    if (!state) {
      updateFlag = true;
    } else if (!state.playerUid) {
      updateFlag = true;
    } else if (props.playerScoreInfo.playerUid !== state.playerUid) {
      updateFlag = true;
    }
    if (updateFlag) {
      return {
        seasonGameUid: props.seasonGameUid,
        firstName: props.playerScoreInfo.firstName,
        lastName: props.playerScoreInfo.lastName,
        fullName: props.playerScoreInfo.fullName,
        playerUid: props.playerScoreInfo.playerUid,
        playerTeamId: props.playerScoreInfo.playerTeamId,
        score: props.playerScoreInfo.score,
        playerTeamName: props.playerScoreInfo.playerTeamName
      };
    } else {
      return null;
    }
  }

  componentWillUnmount() {
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          matchPlayerScores: [
            {
              firstName: values.firstName,
              lastName: values.lastName,
              fullName: values.fullName,
              playerUid: values.playerUid,
              playerTeamId: values.playerTeamId,
              score: values.score,
              playerTeamName: values.playerTeamName
            }
          ],
          seasonGameUid: this.state.seasonGameUid
        };
        this.props.actions.updateMatchPlayerScore(data).then(() => {
          if (
            this.props.fantasy.updateMatchPlayingScoreResponse &&
            this.props.fantasy.updateMatchPlayingScoreResponse.error
          ) {
            if (
              this.props.fantasy.updateMatchPlayingScoreResponse.error.message
            ) {
              message.error(
                this.props.fantasy.updateMatchPlayingScoreResponse.error.message
              );
              return;
            } else {
              message.error('Could not update the player score');
              return;
            }
          } else {
            message.success('Updated Successfully.');
            return;
          }
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
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
      firstName: isFieldTouched('firstName') && getFieldError('firstName'),
      lastName: isFieldTouched('lastName') && getFieldError('lastName'),
      fullName: isFieldTouched('fullName') && getFieldError('fullName'),
      playerUid: isFieldTouched('playerUid') && getFieldError('playerUid'),
      playerTeamId:
        isFieldTouched('playerTeamId') && getFieldError('playerTeamId'),
      score: isFieldTouched('score') && getFieldError('score'),
      playerTeamName:
        isFieldTouched('playerTeamName') && getFieldError('playerTeamName')
    };
    return (
      <React.Fragment>
        {this.state.playerUid && (
          <Form onSubmit={this.handleSubmit}>
            <Card title="Edit Player Score">
              <FormItem
                validateStatus={errors.firstName ? 'error' : ''}
                help={errors.firstName || ''}
                {...formItemLayout}
                label={'First Name'}
              >
                {getFieldDecorator('firstName', {
                  initialValue: this.state.firstName,
                  rules: [
                    {
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={errors.lastName ? 'error' : ''}
                help={errors.lastName || ''}
                {...formItemLayout}
                label={'Last Name'}
              >
                {getFieldDecorator('lastName', {
                  initialValue: this.state.lastName,
                  rules: [
                    {
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={errors.fullName ? 'error' : ''}
                help={errors.fullName || ''}
                {...formItemLayout}
                label={<span>Full Name</span>}
              >
                {getFieldDecorator('fullName', {
                  initialValue: this.state.fullName,
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={errors.playerUid ? 'error' : ''}
                help={errors.playerUid || ''}
                {...formItemLayout}
                label={'Player Uid'}
              >
                {getFieldDecorator('playerUid', {
                  initialValue: this.state.playerUid,
                  rules: [
                    {
                      type: 'number',
                      whitespace: true
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.playerTeamId ? 'error' : ''}
                help={errors.playerTeamId || ''}
                {...formItemLayout}
                label={'Player Team Id'}
              >
                {getFieldDecorator('playerTeamId', {
                  initialValue: this.state.playerTeamId,
                  rules: [
                    {
                      type: 'number',
                      whitespace: true
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.score ? 'error' : ''}
                help={errors.score || ''}
                {...formItemLayout}
                label={'Score'}
              >
                {getFieldDecorator('score', {
                  initialValue: this.state.score,
                  rules: [
                    {
                      type: 'number',
                      whitespace: true
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.playerTeamName ? 'error' : ''}
                help={errors.playerTeamName || ''}
                {...formItemLayout}
                label={'Player Team Name'}
              >
                {getFieldDecorator('playerTeamName', {
                  initialValue: this.state.playerTeamName,
                  rules: [
                    {
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <Row type="flex" justify="center">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Card>
          </Form>
        )}
      </React.Fragment>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return { ...ownProps, fantasy: state.baseball };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...baseballActions }, dispatch)
  };
}
const EditPlayerScoreForm = Form.create()(EditPlayerScore);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPlayerScoreForm);
