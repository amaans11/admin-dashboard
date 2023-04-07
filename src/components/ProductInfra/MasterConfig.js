import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as productInfraActions from '../../actions/ProductInfraActions';
import { Card, Select, Form, Button, message, Row, Col, Input } from 'antd';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class MasterConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      isValidJson: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  selectCountry(value) {
    this.setState(
      {
        fetched: false,
        countryCode: value
      },
      () => {
        this.getCurrentConfig();
      }
    );
  }

  getCurrentConfig() {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions
      .getProdInfraCountryHomeManagementConfig(data)
      .then(() => {
        if (this.props.getProdInfraCountryHomeManagementConfigResponse) {
          let config = JSON.parse(
            this.props.getProdInfraCountryHomeManagementConfigResponse
          );
          this.setState({
            masterConfig:
              config && config.masterConfig
                ? {
                    ...config.masterConfig
                  }
                : {},
            fetched: true
          });
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
          countryCode: this.state.countryCode,
          masterConfig: JSON.parse(values.masterConfig)
        };
        this.props.actions.setProdInfraMasterConfig(data).then(() => {
          if (
            this.props.setProdInfraMasterConfigResponse &&
            this.props.setProdInfraMasterConfigResponse.success
          ) {
            message.success('Successfully updated the config');
          } else {
            message.error('Could not update the master configs');
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
      masterConfig:
        isFieldTouched('masterConfig') && getFieldError('masterConfig')
    };

    const { masterConfig } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Product Infra Master Config">
            <Card>
              <FormItem
                validateStatus={errors.countryCode ? 'error' : ''}
                help={errors.countryCode || ''}
                {...formItemLayout}
                label={<span>Country</span>}
              >
                {getFieldDecorator('countryCode', {
                  rules: [
                    {
                      required: true,
                      message: ' ',
                      whitespace: true
                    }
                  ]
                })(
                  <Select
                    showSearch
                    onSelect={e => this.selectCountry(e)}
                    style={{ width: '100%' }}
                    placeholder="Select country"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {CountryList}
                  </Select>
                )}
              </FormItem>
            </Card>
            {this.state.fetched && (
              <Row>
                <Card title="Master Config" type="inner">
                  <FormItem
                    validateStatus={
                      errors.masterConfig || !this.state.isValidJson
                        ? 'error'
                        : ''
                    }
                    help={errors.masterConfig || ''}
                    {...formItemLayout}
                    label={'Master Config'}
                  >
                    {getFieldDecorator('masterConfig', {
                      initialValue: JSON.stringify(masterConfig, null, 2),
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
    getProdInfraCountryHomeManagementConfigResponse:
      state.prodInfra.getProdInfraCountryHomeManagementConfigResponse,
    setProdInfraMasterConfigResponse:
      state.prodInfra.setProdInfraMasterConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...productInfraActions }, dispatch)
  };
}
const MasterConfigForm = Form.create()(MasterConfig);
export default connect(mapStateToProps, mapDispatchToProps)(MasterConfigForm);
