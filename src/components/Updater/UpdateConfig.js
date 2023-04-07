import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Icon,
  Radio,
  Switch,
  Button,
  notification,
  message,
  Select
} from 'antd';
import * as UpdaterActions from '../../actions/updaterActions';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));
class UpdateConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minVersionVal: 1,
      hideInstallMode: false,
      jsonError: false
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.createConfig(values);
      }
    });
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const updateTypeChange = e => {
      if (e.target.value === 'ANDROID_APK') {
        this.setState({
          minVersionVal: 1000000,
          hideInstallMode: true
        });
      } else if (e.target.value === 'ANDROID_APK_PS') {
        this.setState({
          minVersionVal: 1,
          hideInstallMode: true
        });
      } else {
        this.setState({
          minVersionVal: 1,
          hideInstallMode: false
        });
      }
    };
    // Validate description is JSON

    const validateJson = e => {
      let val = e.target.value;
      if (val !== '') {
        try {
          JSON.parse(val);
          this.setState({ jsonError: false });
        } catch (error) {
          notification['error']({
            message: 'Invalid Json',
            description: 'Json you entered is invalid',
            placement: 'topRight',
            top: 100
          });
          this.setState({ jsonError: true });
        }
      }
    };

    // Only show error after a field is touched.

    const installationModeError =
      isFieldTouched('installationMode') && getFieldError('installationMode');
    const typeError = isFieldTouched('type') && getFieldError('type');
    const titleError = isFieldTouched('title') && getFieldError('title');
    const descriptionError =
      (isFieldTouched('description') && getFieldError('description')) ||
      this.state.jsonError;
    const versionCodeError =
      isFieldTouched('versionCode') && getFieldError('versionCode');
    const countryCodeError =
      isFieldTouched('countryCode') && getFieldError('countryCode');
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Basic Details">
            <FormItem
              validateStatus={typeError ? 'error' : ''}
              help={typeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Type of Update
                  <Tooltip title="React or Android">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    type: 'string',
                    message: 'Please check type of update!',
                    whitespace: false
                  }
                ],
                initialValue: 'RN_ANDROID_BUNDLE'
              })(
                <RadioGroup onChange={updateTypeChange}>
                  <RadioButton value={'ANDROID_APK'}>
                    Android APK Pro
                  </RadioButton>
                  <RadioButton value={'RN_ANDROID_BUNDLE'}>
                    Android React BUNDLE
                  </RadioButton>
                  <RadioButton value={'RN_IOS_BUNDLE'}>
                    IOS React BUNDLE
                  </RadioButton>
                  <RadioButton value={'ANDROID_APK_PS'}>
                    Android APK PS
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
            {!this.state.hideInstallMode ? (
              <FormItem
                validateStatus={installationModeError ? 'error' : ''}
                help={installationModeError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Installation Mode
                    <Tooltip title=" Installation Mode for Android">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('installationMode', {
                  rules: [
                    {
                      required: true,
                      type: 'string',
                      message: 'Please check type of update!',
                      whitespace: false
                    }
                  ],
                  initialValue: 'IMMEDIATE'
                })(
                  <RadioGroup onChange={updateTypeChange}>
                    <RadioButton value={'IMMEDIATE'}>Immediate</RadioButton>
                    <RadioButton value={'AFTER_RESTART'}>
                      After Restart
                    </RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            ) : (
              ''
            )}
            <FormItem
              validateStatus={versionCodeError ? 'error' : ''}
              help={versionCodeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Version Code
                  <Tooltip title="Version code for update">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('versionCode', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message:
                      'Please enter version code in numbers only more than 1 million if Androd Update!',
                    whitespace: false
                  }
                ]
              })(
                <InputNumber
                  style={{ width: 200 }}
                  min={this.state.minVersionVal}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={titleError ? 'error' : ''}
              help={titleError || ''}
              {...formItemLayout}
              label={
                <span>
                  Title
                  <Tooltip title="Name of the update">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={descriptionError ? 'error' : ''}
              help={descriptionError || ''}
              {...formItemLayout}
              label={
                <span>
                  Description
                  <Tooltip title="Description for Update">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'Please input  description!',
                    whitespace: true
                  }
                ]
              })(<TextArea onBlur={validateJson} rows={3} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Critical Update
                  <Tooltip title="Check if critical update">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isCritical', {
                rules: [
                  {
                    required: false,
                    type: 'boolean',
                    message: 'Please input type of type!',
                    whitespace: false
                  }
                ],
                initialValue: false
              })(
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="cross" />}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={countryCodeError ? 'error' : ''}
              help={countryCodeError || ''}
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
    UpdateConfig: state.updater
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UpdaterActions, dispatch)
  };
}

const UpdateConfigForm = Form.create()(UpdateConfig);
export default connect(mapStateToProps, mapDispatchToProps)(UpdateConfigForm);
