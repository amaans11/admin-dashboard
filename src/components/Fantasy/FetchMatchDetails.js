// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Form, Row, Input, Tooltip, Col, Icon, Button } from 'antd';
import * as fantasyActions from '../../actions/FantasyActions';
// type FetchMatchDetails ={}
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class FetchMatchDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
    // Only show error after a field is touched.
    const tNameError = isFieldTouched('tName') && getFieldError('tName');
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Basic Details">
            <FormItem
              validateStatus={tNameError ? 'error' : ''}
              {...formItemLayout}
              label={
                <span>
                  Some Name
                  <Tooltip title="Some Name tooltip">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('tName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Register
            </Button>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    FetchMatchDetails: state.FetchMatchDetails
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fantasyActions, dispatch)
  };
}

const FetchMatchDetailsForm = Form.create()(FetchMatchDetails);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FetchMatchDetailsForm);
