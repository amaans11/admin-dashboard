import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as referralConfigActions from '../../actions/referralConfigActions';
import { Card, Form, Button, Input, message, Row, Col, Select } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class ClientConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientConfigJsonCheck: true,
      fetched: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState({ fetched: false });
    this.getReferralClientConfig(value);
  }

  getReferralClientConfig(countryCode) {
    let data = {
      countryCode: countryCode
    };
    this.props.actions.getReferralClientConfig(data).then(() => {
      if (this.props.getReferralClientConfigResponse) {
        let clientConfig = JSON.parse(
          this.props.getReferralClientConfigResponse
        ).clientConfig;
        this.setState({ clientConfig, fetched: true });
      } else {
        message.error('Could not load config');
      }
    });
  }

  jsonCheck(value) {
    if (value) {
      try {
        JSON.parse(value);
        this.setState({ clientConfigJsonCheck: true });
        return true;
      } catch (error) {
        message.error('Invalid JSON Object', 0.5);
        this.setState({ clientConfigJsonCheck: false });
        return false;
      }
    } else {
      message.error('This field cannot be left blank', 0.5);
      this.setState({ clientConfigJsonCheck: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.state.clientConfigJsonCheck) {
          message.error('Invalid JSON object');
          return;
        }
        let data = {
          countryCode: values.countryCode,
          config: JSON.parse(values.clientConfig)
        };
        this.props.actions.setReferralClientConfig(data).then(() => {
          if (this.props.setReferralClientConfigResponse) {
            if (this.props.setReferralClientConfigResponse.error) {
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
      clientConfig:
        isFieldTouched('clientConfig') && getFieldError('clientConfig'),
      countryCode: isFieldTouched('countryCode') && getFieldError('countryCode')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Referral Client Config">
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
            {this.state.fetched && (
              <>
                <FormItem
                  validateStatus={
                    errors.clientConfig || !this.state.clientConfigJsonCheck
                      ? 'error'
                      : ''
                  }
                  help={errors.clientConfig || ''}
                  {...formItemLayout}
                  label={'Client Config'}
                >
                  {getFieldDecorator('clientConfig', {
                    initialValue: JSON.stringify(
                      this.state.clientConfig,
                      null,
                      2
                    ),
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
    getReferralClientConfigResponse:
      state.referralConfig.getReferralClientConfigResponse,
    setReferralClientConfigResponse:
      state.referralConfig.setReferralClientConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...referralConfigActions }, dispatch)
  };
}
const ClientConfigForm = Form.create()(ClientConfig);
export default connect(mapStateToProps, mapDispatchToProps)(ClientConfigForm);
