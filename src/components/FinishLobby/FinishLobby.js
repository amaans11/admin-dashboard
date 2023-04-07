// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import moment from "moment";
import * as tournamentActions from '../../actions/tournamentActions';
import { Card, Form, InputNumber, Button, message, Icon } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const FormItem = Form.Item;

class FinishLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: null
    };
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          lobbyId: values.lobbyId
        };
        this.props.actions.finishLobby(data).then(() => {
          if (this.props.finishLobbyResponse) {
            if (this.props.finishLobbyResponse.status) {
              message.success('Lobby finished successfully', 1.5).then(() => {
                window.location.reload();
              });
            } else {
              message.error('Could not finish lobby');
            }
          }
        });
      }
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  render() {
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
    const errors = {
      lobbyId: isFieldTouched('lobbyId') && getFieldError('lobbyId')
    };
    return (
      <React.Fragment>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={errors.lobbyId ? 'error' : ''}
              help={errors.lobbyId || ''}
              {...formItemLayout}
              label={'Lobby Id'}
            >
              {getFieldDecorator('lobbyId', {
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
              Finish Lobby
            </Button>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    finishLobbyResponse: state.tournaments.finishLobbyResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(tournamentActions, dispatch)
  };
}
const FinishLobbyForm = Form.create()(FinishLobby);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinishLobbyForm);
