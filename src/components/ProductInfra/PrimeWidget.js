import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as productInfraActions from '../../actions/ProductInfraActions';
import { Card, Select, Form, Button, message, Row, Col, Input } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class PrimeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      isValidJson: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getCurrentConfig();
  }

  getCurrentConfig() {
    this.props.actions.getProdInfraHomeManagementConfig().then(() => {
      if (this.props.getProdInfraHomeManagementConfigResponse) {
        let config = JSON.parse(
          this.props.getProdInfraHomeManagementConfigResponse
        );
        this.setState({
          primeWidgetData:
            config && config.primeWidgetData
              ? {
                  ...config.primeWidgetData
                }
              : {},
          fetched: true
        });
      } else {
      }
    });
  }

  jsonCheck(value) {
    if (value) {
      try {
        JSON.parse(value);
        this.setState({ isValidJson: true });
        return true;
      } catch (error) {
        message.error('Invalid JSON Object', 0.5);
        this.setState({ isValidJson: false });
        return false;
      }
    } else {
      message.error('This field cannot be left blank', 0.5);
      this.setState({ isValidJson: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          primeWidgetData: JSON.parse(values.primeWidgetData)
        };
        this.props.actions.setProdInfraPrimeWidgetData(data).then(() => {
          if (
            this.props.setProdInfraPrimeWidgetDataResponse &&
            this.props.setProdInfraPrimeWidgetDataResponse.success
          ) {
            message.success('Successfully updated the config');
          } else {
            message.error('Could not update the prime widget configs');
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
      primeWidgetData:
        isFieldTouched('primeWidgetData') && getFieldError('primeWidgetData')
    };

    const { primeWidgetData } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Product Infra Prime Widget">
            {this.state.fetched && (
              <Row>
                <Card title="Prime Widget" type="inner">
                  <FormItem
                    validateStatus={
                      errors.primeWidgetData || !this.state.isValidJson
                        ? 'error'
                        : ''
                    }
                    help={errors.primeWidgetData || ''}
                    {...formItemLayout}
                    label={'Prime Widget'}
                  >
                    {getFieldDecorator('primeWidgetData', {
                      initialValue: JSON.stringify(primeWidgetData, null, 2),
                      rules: [
                        {
                          required: false,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(
                      <TextArea
                        rows={30}
                        onBlur={e => this.jsonCheck(e.target.value)}
                      />
                    )}
                  </FormItem>
                </Card>

                <Row>
                  <Col span={12} offset={12}>
                    <Button
                      style={{ float: 'none' }}
                      type="primary"
                      htmlType="submit"
                      disabled={hasErrors(getFieldsError())}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </Row>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getProdInfraHomeManagementConfigResponse:
      state.prodInfra.getProdInfraHomeManagementConfigResponse,
    setProdInfraPrimeWidgetDataResponse:
      state.prodInfra.setProdInfraPrimeWidgetDataResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...productInfraActions }, dispatch)
  };
}
const PrimeWidgetForm = Form.create()(PrimeWidget);
export default connect(mapStateToProps, mapDispatchToProps)(PrimeWidgetForm);
