// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import moment from "moment";
import * as leaderboardActions from '../../actions/leaderboardActions';
import { Card, Form, InputNumber, Button, message } from 'antd';

const FormItem = Form.Item;

class FinishTournament extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          id: values.id
        };
        this.props.actions.finishTournamentDirect(data).then(() => {
          if (
            this.props.finishTournamentDirectResponse &&
            this.props.finishTournamentDirectResponse.success
          ) {
            message
              .success('Tournament finished successfully', 1.5)
              .then(() => {
                window.location.reload();
              });
          } else {
            message.error(
              this.props.finishTournamentDirectResponse.message
                ? this.props.finishTournamentDirectResponse.message
                : 'Could not finish the tournament'
            );
          }
        });
      }
    });
  };

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
        lg: { span: 10 }
      }
    };

    const errors = {
      id: isFieldTouched('id') && getFieldError('id')
    };

    return (
      <React.Fragment>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={errors.id ? 'error' : ''}
              help={errors.id || ''}
              {...formItemLayout}
              label={<span>Enter Tournament Id</span>}
            >
              {getFieldDecorator('id', {
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
            <Button type="primary" htmlType="submit">
              Finish Tournament
            </Button>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    finishTournamentDirectResponse:
      state.leaderboard.finishTournamentDirectResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(leaderboardActions, dispatch)
  };
}
const FinishTournamentForm = Form.create()(FinishTournament);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinishTournamentForm);
