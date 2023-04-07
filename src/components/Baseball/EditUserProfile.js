import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseballActions from '../../actions/BaseballActions';
import { Helmet } from 'react-helmet';
import ImageUploader from './ImageUploader';
import _ from 'lodash';
import { Card, Form, Button, Row, Col, message, Input } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class EditUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchId: null,
      playerImage: null,
      playerId: null,
      loadImage: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.playerInfo) {
      this.props.form.setFieldsValue({
        battingStyle: this.props.playerInfo.battingStyle,
        bowlingStyle: this.props.playerInfo.bowlingStyle,
        title: this.props.playerInfo.title,
        playingRole: this.props.playerInfo.playingRole,
        teamName: this.props.playerInfo.teamName
      });

      this.setState({
        matchId: this.props.matchId,
        playerId: this.props.playerInfo.id
      });

      let url = '';
      if (this.props.playerInfo.playerImage) {
        this.setState({
          previewImage: this.props.playerInfo.playerImage,
          fileList: [
            {
              uid: -1,
              name: 'image.png',
              status: 'done',
              url: this.props.playerInfo.playerImage
            }
          ]
        });
        this.setState({
          playerImage: url,
          loadImage: true
        });
      } else {
        this.setState({ loadImage: true });
      }
    }
  }

  getPlayerImage = data => {
    this.setState({
      playerImage: data.id
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          battingStyle: values.battingStyle,
          bowlingStyle: values.bowlingStyle,
          matchId: this.state.matchId,
          title: values.title,
          playingRole: values.playingRole,
          teamName: values.teamName,
          playerImage: this.state.playerImage,
          playerId: this.state.playerId
        };
        this.props.actions.updatePlayerProfile(data).then(() => {
          if (
            this.props.fantasy.updatePlayerProfileResponse &&
            this.props.fantasy.updatePlayerProfileResponse.error
          ) {
            if (this.props.fantasy.updatePlayerProfileResponse.error.message) {
              message.error(
                this.props.fantasy.updatePlayerProfileResponse.error.message
              );
              return;
            } else {
              message.error('Could not update the match details');
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
      battingStyle:
        isFieldTouched('battingStyle') && getFieldError('battingStyle'),
      bowlingStyle:
        isFieldTouched('bowlingStyle') && getFieldError('bowlingStyle'),
      title: isFieldTouched('title') && getFieldError('title'),
      playingRole:
        isFieldTouched('playingRole') && getFieldError('playingRole'),
      teamName: isFieldTouched('teamName') && getFieldError('teamName')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Edit Match Details| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Edit Match Details">
            <FormItem
              validateStatus={errors.battingStyle ? 'error' : ''}
              help={errors.battingStyle || ''}
              {...formItemLayout}
              label={<span>Batting Style</span>}
            >
              {getFieldDecorator('battingStyle', {
                rules: [
                  {
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.bowlingStyle ? 'error' : ''}
              help={errors.bowlingStyle || ''}
              {...formItemLayout}
              label={<span>Bowling Style</span>}
            >
              {getFieldDecorator('bowlingStyle', {
                rules: [
                  {
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title || ''}
              {...formItemLayout}
              label={<span>Title</span>}
            >
              {getFieldDecorator('title', {
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
              validateStatus={errors.playingRole ? 'error' : ''}
              help={errors.playingRole || ''}
              {...formItemLayout}
              label={<span>Playing Role</span>}
            >
              {getFieldDecorator('playingRole', {
                rules: [
                  {
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.teamName ? 'error' : ''}
              help={errors.teamName || ''}
              {...formItemLayout}
              label={<span>Team Name</span>}
            >
              {getFieldDecorator('teamName', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <Row>
              {this.state.loadImage && (
                <Col span={6} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.getPlayerImage}
                    header={'Player Image'}
                    actions={this.props.actions}
                    previewImage={this.state.previewImage}
                    fileList={this.state.fileList}
                  />
                </Col>
              )}
            </Row>
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
const EditUserProfileForm = Form.create()(EditUserProfile);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserProfileForm);
