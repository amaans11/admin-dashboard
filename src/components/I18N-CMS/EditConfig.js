import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as i18nCMActions from '../../actions/i18nCMSActions';
import {
  Card,
  Button,
  message,
  Typography,
  Row,
  Tabs,
  Form,
  Col,
  Input,
  Tooltip,
  Radio,
  Icon
} from 'antd';
import get from 'lodash/get';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import CountryWiseValueTable from './CountryWiseValueTable';

const { Paragraph } = Typography;
const { TabPane } = Tabs;
const FormItem = Form.Item;
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
export class EditConfig extends Component {
  state = {
    countryList: [],
    initialCountryWiseValue: [],
    countryWiseValue: []
  };
  componentDidMount() {
    this.props.actions.getCountryList().then(() => {
      let countryList = get(this.props.countryListResponse, 'countryList', []);
      if (countryList.length) {
        countryList = countryList.filter(country => country.isActive);

        if (this.props.cloneConfig && this.props.cloneConfig.configId) {
          const {
            cloneConfig: { configNode, configPath },
            editType,
            missingCountryCode
          } = this.props;
          this.props.actions
            .getServiceConfig({ configNode, configPath })
            .then(() => {
              const {
                error,
                config,
                countryWiseValue
              } = this.props.getServiceConfigResponse;
              if (!error) {
                let conutryWiseData = [];
                const keys = Object.keys(countryWiseValue);
                for (let i = 0; i < keys.length; i++) {
                  const country = find(
                    countryList,
                    c => c.countryCode === keys[i]
                  );
                  if (country) {
                    conutryWiseData.push({
                      ...country,
                      value: countryWiseValue[keys[i]]
                    });
                  }
                }

                const initialCountryWiseValue = cloneDeep(conutryWiseData);
                const isMissingConfigFlow = editType === 'copy';
                // If Missing Config Flow, add new Config
                if (isMissingConfigFlow) {
                  const missingCountry = find(
                    countryList,
                    c => c.countryCode === missingCountryCode
                  );
                  if (missingCountry) {
                    conutryWiseData.push({
                      ...missingCountry,
                      value: countryWiseValue[keys[0]]
                    });
                  }
                }

                const initConfig = {
                  configName: config.configName,
                  configLabel: config.configLabel,
                  configFeature: config.configFeature || '',
                  approvalRequired: config.hasOwnProperty('approvalRequired')
                    ? config.approvalRequired
                    : false
                };
                this.setState(
                  {
                    countryList,
                    popupInputValue: cloneDeep(countryWiseValue.ALL),
                    selectedDataType: config.valueType,
                    configId: config.configId,
                    countryWiseValue: conutryWiseData,
                    initialCountryWiseValue,
                    isMissingConfigFlow,
                    missingCountryCode,
                    initConfig
                  },
                  () => {
                    this.props.form.setFieldsValue({
                      ...initConfig
                    });
                  }
                );
              } else {
                message.error(
                  error.message || 'Something went wrong. Try Again.'
                );
              }
            });
        }
      } else {
        message.error('Error while fetching data. Reload the tab.');
      }
    });
  }

  componentWillUnmount() {
    this.props.actions.clearZkConfigCloneData();
    this.props.actions.resetMissingCountry();
  }

  deleteCountryWiseValue = countryCode => {
    let { countryWiseValue } = this.state;
    countryWiseValue = countryWiseValue.filter(
      data => data.countryCode !== countryCode
    );
    this.setState({
      countryWiseValue
    });
  };

  editCountryWiseValue = (countryCode, value) => {
    const { countryWiseValue: oldValue } = this.state;
    const countryWiseValue = cloneDeep(oldValue);
    const country = find(countryWiseValue, c => c.countryCode === countryCode);
    country.value = value;
    this.setState({
      countryWiseValue
    });
  };

  checkIfNotChanged = () => {
    const { initialCountryWiseValue, countryWiseValue } = this.state;
    return isEqual(initialCountryWiseValue, countryWiseValue);
  };

  handleEditSubmit = e => {
    e.preventDefault();
    if (this.checkIfNotChanged()) {
      message.info('No data change is found.');
      return;
    }
    const { configId, countryWiseValue, selectedDataType = '' } = this.state;
    const isJson = selectedDataType.toUpperCase() === 'JSON';
    const obj = {};
    for (let i = 0; i < countryWiseValue.length; i++) {
      let countryCode = countryWiseValue[i].countryCode;
      let value = countryWiseValue[i].value;
      if (isJson) value = JSON.stringify(JSON.parse(value));
      obj[countryCode] = value;
    }

    this.props.actions
      .requestUpdate({ configId, countryWiseValue: obj })
      .then(() => {
        const { error } = this.props.requestUpdateResponse;
        if (error) {
          message.error(error.message || 'Something went wrong. Try again.');
        } else {
          message.success('Update request sent successfully.');
          this.props.history.push('/i18n-config/list');
        }
      });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleMetaSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { initConfig, configId } = this.state;
        if (!isEqual(values, initConfig)) {
          this.props.actions
            .editConfigMetaData({ configId, ...values })
            .then(() => {
              const { error, config } = this.props.editMetaDataResponse;
              if (!error && config && config.configId) {
                message.success('Config Meta Data Updated Successfully.');
                this.props.history.push('/i18n-config/list');
              } else {
                message.error(error.message || 'Something went wrong.');
              }
            });
        } else {
          message.info('No change detected.');
        }
      }
    });
  };

  render() {
    const {
      selectedDataType = '',
      countryWiseValue,
      isMissingConfigFlow,
      missingCountryCode
    } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      config: {
        configName: isFieldTouched('configName') && getFieldError('configName'),
        configLabel:
          isFieldTouched('configLabel') && getFieldError('configLabel'),
        configFeature:
          isFieldTouched('configFeature') && getFieldError('configFeature'),
        approvalRequired:
          isFieldTouched('approvalRequired') &&
          getFieldError('approvalRequired')
      }
    };
    return (
      <React.Fragment>
        <div id="edit-i18n-config-root">
          <Tabs type="card" defaultActiveKey="1" className="mt10">
            <TabPane
              tab="Country Wise Value"
              key="1"
              disabled={isMissingConfigFlow}
            >
              <Card title="Edit Country Wise Values">
                <CountryWiseValueTable
                  hideForm={true}
                  showCustomEditor={true}
                  editDisabled={isMissingConfigFlow}
                  countryToIgnore={missingCountryCode}
                  deleteCountryWiseValue={this.deleteCountryWiseValue}
                  editCountryWiseValue={this.editCountryWiseValue}
                  dataType={selectedDataType}
                  countryWiseValue={countryWiseValue}
                />
                <Row>
                  <Row type="flex" justify="center" className="mt40">
                    <Button type="primary" onClick={this.handleEditSubmit}>
                      {isMissingConfigFlow
                        ? 'Add Config to Country'
                        : 'Submit Request'}
                    </Button>
                  </Row>
                  <Row type="flex" justify="center">
                    <Typography className="mt10">
                      <Paragraph>
                        <b>* Note: </b>If the approval is required to update
                        this config, the request will go thorugh an approver,
                        otherwise it will be reflected directly.
                      </Paragraph>
                    </Typography>
                  </Row>
                </Row>
              </Card>
            </TabPane>
            <TabPane
              tab="Config Meta Data"
              key="2"
              disabled={isMissingConfigFlow}
            >
              <Card title="Edit Config Meta Data">
                <Form onSubmit={this.handleMetaSubmit}>
                  <Row>
                    <Col span={24}>
                      <FormItem
                        validateStatus={errors.config.configName}
                        help={errors.config.configName || ''}
                        {...formItemLayout}
                        label={
                          <span>
                            Name of Config
                            <Tooltip title="Enter name for the config">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </span>
                        }
                      >
                        {getFieldDecorator('configName', {
                          rules: [
                            {
                              type: 'string',
                              required: true,
                              message: 'Please input name for config'
                            }
                          ]
                        })(<Input placeholder="Enter Config Name" />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.config.configLabel}
                        help={errors.config.configLabel || ''}
                        {...formItemLayout}
                        label={
                          <span>
                            Config Label
                            <Tooltip title="Input the label for this config">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </span>
                        }
                      >
                        {getFieldDecorator('configLabel', {
                          rules: [
                            {
                              type: 'string',
                              required: true,
                              message: 'Please input config label'
                            }
                          ]
                        })(<Input placeholder="Enter Config Name" />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.config.configFeature}
                        help={errors.config.configFeature || ''}
                        {...formItemLayout}
                        label={
                          <span>
                            Config Feature
                            <Tooltip title="Enter the value for config feature">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </span>
                        }
                      >
                        {getFieldDecorator('configFeature', {
                          rules: [
                            {
                              type: 'string',
                              required: false,
                              message: 'Please input config feature'
                            }
                          ]
                        })(<Input placeholder="Enter Config Feature" />)}
                      </FormItem>
                      <FormItem
                        validateStatus={
                          errors.config.approvalRequired ? 'error' : ''
                        }
                        help={errors.config.approvalRequired || ''}
                        {...formItemLayout}
                        label={
                          <span>
                            Approval Required
                            <Tooltip title="Select true if approval required to edit this config">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </span>
                        }
                      >
                        {getFieldDecorator('approvalRequired', {
                          rules: [
                            {
                              required: true,
                              type: 'boolean',
                              message:
                                'Please select option for approval required!'
                            }
                          ],
                          initialValue: true
                        })(
                          <Radio.Group size="small" buttonStyle="solid">
                            <Radio.Button value={true}>True</Radio.Button>
                            <Radio.Button value={false}>False</Radio.Button>
                          </Radio.Group>
                        )}
                      </FormItem>
                      <Row type="flex" justify="center">
                        <Button
                          type="primary"
                          disabled={this.hasErrors(getFieldsError())}
                          htmlType="submit"
                        >
                          Update Meta Data
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </TabPane>
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  countryListResponse: state.i18nCMS.countryListResponse,
  getServiceConfigResponse: state.i18nCMS.getServiceConfigResponse,
  editType: state.i18nCMS.editType,
  cloneConfig: state.i18nCMS.cloneConfig,
  requestUpdateResponse: state.i18nCMS.requestUpdateResponse,
  editMetaDataResponse: state.i18nCMS.editMetaDataResponse,
  missingCountryCode: state.i18nCMS.missingCountryCode
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(i18nCMActions, dispatch)
});

const EditConfigForm = Form.create({})(EditConfig);
export default connect(mapStateToProps, mapDispatchToProps)(EditConfigForm);
