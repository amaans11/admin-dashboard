import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as internalToolActions from '../../actions/internalToolActions';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import _ from 'lodash';
import { Card, Form, Button, Row, Col, message, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class CreateTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editType: 'CLONE'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    if (this.props.toolDetails && this.props.editType) {
      let toolDetails = { ...this.props.toolDetails };
      this.setState({ editType: this.props.editType });
      this.props.form.setFieldsValue({
        name: toolDetails.name,
        description: toolDetails.description,
        jar: toolDetails.jar,
        param: toolDetails.param,
        command: toolDetails.command
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.clearToolForm();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          name: values.name,
          description: values.description,
          jar: values.jar,
          param: values.param,
          command: values.command
        };

        if (this.state.editType !== 'EDIT') {
          this.props.actions.createInternalTool(data).then(() => {
            if (
              this.props.createInternalToolResponse &&
              this.props.createInternalToolResponse.error
            ) {
              message.error('Could not create the tool');
            } else {
              this.props.history.push('/tools/list');
            }
          });
        } else {
          data['id'] = this.props.toolDetails.id;
          this.props.actions.updateInternalTool(data).then(() => {
            if (
              this.props.updateInternalToolResponse &&
              this.props.updateInternalToolResponse.error
            ) {
              message.error('Could not update the tool');
            } else {
              this.props.history.push('/tools/list');
            }
          });
        }
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
      name: isFieldTouched('name') && getFieldError('name'),
      description:
        isFieldTouched('description') && getFieldError('description'),
      jar: isFieldTouched('jar') && getFieldError('jar'),
      param: isFieldTouched('param') && getFieldError('param'),
      command: isFieldTouched('command') && getFieldError('command')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title> Dashboard | Internal Tools</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Internal Tool">
            <FormItem
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name || ''}
              {...formItemLayout}
              label={<span>Name</span>}
            >
              {getFieldDecorator('name', {
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
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description || ''}
              {...formItemLayout}
              label={<span>Description</span>}
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<TextArea rows={3} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.jar ? 'error' : ''}
              help={errors.jar || ''}
              {...formItemLayout}
              label={<span>Jar</span>}
            >
              {getFieldDecorator('jar', {
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
              validateStatus={errors.param ? 'error' : ''}
              help={errors.param || ''}
              {...formItemLayout}
              label={<span>Param</span>}
            >
              {getFieldDecorator('param', {
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
              validateStatus={errors.command ? 'error' : ''}
              help={errors.command || ''}
              {...formItemLayout}
              label={<span>Command</span>}
            >
              {getFieldDecorator('command', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    editType: state.interalTools.editType,
    toolDetails: state.interalTools.toolDetails,
    createInternalToolResponse: state.interalTools.createInternalToolResponse,
    editType: state.interalTools.editType,
    updateInternalToolResponse: state.interalTools.updateInternalToolResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...internalToolActions }, dispatch)
  };
}
const CreateToolForm = Form.create()(CreateTool);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateToolForm);
