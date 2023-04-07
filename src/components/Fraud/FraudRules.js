import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as fraudActions from '../../actions/fraudActions';
import { Card, Form, Button, Input, message, Row, Col, Select } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class FraudRules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configJsonCheck: true,
      fetched: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getFraudRulesConfig();
  }

  async getFraudRulesConfig() {
    await this.props.actions.getFraudRules();
    if (this.props.getFraudRulesResponse) {
      let config = JSON.parse(this.props.getFraudRulesResponse);
      this.setState({
        config,
        fetched: true
      });
    } else {
      message.error('Could not load config');
    }
  }

  jsonCheck(value) {
    if (value) {
      try {
        JSON.parse(value);
        this.setState({ configJsonCheck: true });
        return true;
      } catch (error) {
        message.error('Invalid JSON Object', 0.5);
        this.setState({ configJsonCheck: false });
        return false;
      }
    } else {
      message.error('This field cannot be left blank', 0.5);
      this.setState({ configJsonCheck: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.state.configJsonCheck) {
          message.error('Invalid JSON object');
          return;
        }
        let data = {
          newConfig: JSON.parse(values.config)
        };
        this.props.actions.setFraudRules(data).then(() => {
          if (this.props.setFraudRulesResponse) {
            if (this.props.setFraudRulesResponse.error) {
              message.error('Could not update');
            } else {
              message.success('Data Uploaded Successfully', 1.5).then(() => {
                window.location.reload();
              });
            }
          }
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      config: isFieldTouched('config') && getFieldError('config')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Fraud Rules">
            {this.state.fetched && (
              <>
                <FormItem
                  validateStatus={
                    errors.config || !this.state.configJsonCheck ? 'error' : ''
                  }
                  help={errors.config || ''}
                  {...formItemLayout}
                  label={'Fraud Rules'}
                >
                  {getFieldDecorator('config', {
                    initialValue: JSON.stringify(this.state.config, null, 4),
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      rows={100}
                      onBlur={e => this.jsonCheck(e.target.value)}
                    />
                  )}
                </FormItem>
                <Row type="flex" justify="center">
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={hasErrors(getFieldsError())}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getFraudRulesResponse: state.fraud.getFraudRulesResponse,
    setFraudRulesResponse: state.fraud.setFraudRulesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fraudActions }, dispatch)
  };
}
const FraudRulesForm = Form.create()(FraudRules);
export default connect(mapStateToProps, mapDispatchToProps)(FraudRulesForm);
