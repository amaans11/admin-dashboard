import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as i18nCMActions from '../../actions/i18nCMSActions';
import {
  Form,
  Row,
  Card,
  Tooltip,
  Icon,
  Input,
  Select,
  Col,
  Radio,
  Button,
  Modal,
  message,
  Typography
} from 'antd';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import CountryWiseValueTable from './CountryWiseValueTable';
const { Paragraph } = Typography;
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
const FormItem = Form.Item;
const DATA_TYPES = ['STRING', 'NUMBER', 'BOOLEAN', 'JSON'];

export class CreateConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      availableCountries: [],
      countryWiseValue: [],
      selectedDataType: 'STRING',
      configsList: [],
      isGlobalEnabled: false,
      copyConfigForm: {
        configNode: '',
        configPath: ''
      },
      showCopyConfigModal: false
    };
  }

  addCountryWiseValue = data => {
    if (data.value === undefined || data.value === null) return;
    const { availableCountries, countryWiseValue, countryList } = this.state;
    const updatedAvailableCountries = availableCountries.filter(
      c => c.countryCode !== data.countryCode
    );
    const country = find(countryList, c => c.countryCode === data.countryCode);
    this.setState({
      countryWiseValue: [
        ...countryWiseValue,
        { ...country, value: data.value }
      ],
      availableCountries: updatedAvailableCountries
    });
  };

  deleteCountryWiseValue = countryCode => {
    let { countryList, countryWiseValue, availableCountries } = this.state;
    countryWiseValue = countryWiseValue.filter(
      data => data.countryCode !== countryCode
    );
    const removedCountry = find(
      countryList,
      c => c.countryCode === countryCode
    );
    availableCountries = [...availableCountries, removedCountry];
    availableCountries.sort();
    this.setState({
      countryWiseValue,
      availableCountries
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

  componentDidMount() {
    this.props.actions.getCountryList().then(() => {
      let countryList = get(this.props.countryListResponse, 'countryList', []);
      if (countryList.length) {
        countryList = countryList.filter(country => country.isActive);
        this.setState({
          countryList,
          availableCountries: [...countryList]
        });
      }
    });

    this.props.actions.getServiceConfigsList().then(() => {
      const configsList = get(
        this.props.configsListResponse,
        'serviceConfig',
        []
      );
      if (configsList.length) {
        this.setState({
          configsList
        });
      }
    });
  }

  onDataTypeChange = selectedDataType => {
    let { countryList, isGlobalEnabled, availableCountries } = this.state;
    availableCountries = countryList;
    if (isGlobalEnabled)
      availableCountries = countryList.filter(
        c => c.countryCode.toUpperCase() === 'ALL'
      );
    this.setState({
      selectedDataType,
      availableCountries,
      countryWiseValue: [],
      defaultValue: null
    });
  };

  onCountrySpecifiChange = e => {
    let { countryList, availableCountries, isGlobalEnabled } = this.state;
    if (!e.target.value) {
      availableCountries = countryList.filter(
        c => c.countryCode.toUpperCase() === 'ALL'
      );
      isGlobalEnabled = true;
    } else {
      availableCountries = countryList;
      isGlobalEnabled = false;
    }
    this.setState({
      availableCountries,
      countryWiseValue: [],
      isGlobalEnabled
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  showCopyConfigModal = () => {
    this.setState({
      showCopyConfigModal: true,
      copyConfigForm: {
        configNode: '',
        configPath: ''
      }
    });
  };

  hideCopyConfigModal = () => {
    this.setState({
      showCopyConfigModal: false
    });
  };

  handleCopyFormInputChange = (key, e) => {
    const { copyConfigForm } = this.state;
    this.setState({
      copyConfigForm: {
        ...copyConfigForm,
        [key]: e.target.value
      }
    });
  };

  getConfigFromData = () => {
    const {
      copyConfigForm: { configNode, configPath }
    } = this.state;
    this.props.actions.getServiceConfig({ configNode, configPath }).then(() => {
      const {
        error,
        config,
        countryWiseValue
      } = this.props.getServiceConfigResponse;
      if (!error) {
        if (config && countryWiseValue) {
          const { countryList } = this.state;
          const conutryWiseData = [];
          const unavailableCountryCodes = [];
          const keys = Object.keys(countryWiseValue);
          for (let i = 0; i < keys.length; i++) {
            const country = find(countryList, c => c.countryCode === keys[i]);
            if (country) {
              conutryWiseData.push({
                ...country,
                value: countryWiseValue[keys[i]]
              });
              unavailableCountryCodes.push(keys[i]);
            }
          }

          let availableCountries = cloneDeep(countryList);
          const countrySpecific = config.hasOwnProperty('countrySpecific')
            ? config.countrySpecific
            : false;
          if (!countrySpecific) {
            availableCountries = availableCountries.filter(
              c => c.countryCode.toUpperCase() === 'ALL'
            );
          }
          availableCountries = availableCountries.filter(
            c => !unavailableCountryCodes.includes(c.countryCode)
          );
          this.setState(
            {
              popupInputValue: cloneDeep(countryWiseValue.ALL),
              selectedDataType: config.valueType,
              countryWiseValue: conutryWiseData,
              availableCountries,
              isGlobalEnabled: !countrySpecific,
              showCopyConfigModal: false
            },
            () => {
              this.props.form.setFieldsValue({
                ...config,
                countrySpecific,
                approvalRequired: config.hasOwnProperty('approvalRequired')
                  ? config.approvalRequired
                  : false
              });
            }
          );
        } else {
          message.info(
            'Node Data not found. Check if Config Node and Config Path is correct.'
          );
        }
      } else {
        message.error(error.message || 'Something went wrong. Try Again.');
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const data = {};
        data.config = value;
        data.countryWiseValue = {};
        const { countryWiseValue, selectedDataType = '' } = this.state;
        const obj = {};
        const isJson = selectedDataType.toUpperCase() === 'JSON';
        for (let i = 0; i < countryWiseValue.length; i++) {
          let countryCode = countryWiseValue[i].countryCode;
          let value = countryWiseValue[i].value;
          if (isJson) value = JSON.stringify(JSON.parse(value));
          obj[countryCode] = value;
        }
        // data.config.defaultValue = defaultValue;
        // if (isJson)
        //   data.config.defaultValue = JSON.stringify(JSON.parse(defaultValue));
        data.countryWiseValue = obj;

        this.props.actions.createServiceConfig(data).then(() => {
          const response = this.props.createConfigResponse;

          if (response.error) {
            message.error(response.error.message || 'Something went wrong');
          } else if (response.config) {
            message.success('Config Created successfully.');
            this.props.history.push('/i18n-config/list');
          }
        });
      }
    });
  };

  isValueMapEmpty = () => {
    const { countryWiseValue = [] } = this.state;
    return !(countryWiseValue.length > 0);
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const errors = {
      config: {
        configName: isFieldTouched('configName') && getFieldError('configName'),
        configNode: isFieldTouched('configNode') && getFieldError('configNode'),
        configPath: isFieldTouched('configPath') && getFieldError('configPath'),
        configLabel:
          isFieldTouched('configLabel') && getFieldError('configLabel'),
        configFeature:
          isFieldTouched('configFeature') && getFieldError('configFeature'),
        countrySpecific:
          isFieldTouched('countrySpecific') && getFieldError('countrySpecific'),
        // defaultValue:
        //   isFieldTouched('defaultValue') && getFieldError('defaultValue'),
        valueType: isFieldTouched('valueType') && getFieldError('valueType'),
        isActive: isFieldTouched('isActive') && getFieldError('isActive'),
        approvalRequired:
          isFieldTouched('approvalRequired') &&
          getFieldError('approvalRequired')
      }
    };

    const {
      countryWiseValue,
      availableCountries,
      selectedDataType = '',
      configsList,
      copyConfigForm: { configNode, configPath },
      showCopyConfigModal
    } = this.state;
    console.log("ghhfj")
    return (
      <React.Fragment>
        <Helmet>
          <title>Create Zk Node |  Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card
            title="Create Zookeeper Config Node"
            extra={
              <Button onClick={this.showCopyConfigModal} type="primary">
                Click to get Data from Existing Config
              </Button>
            }
          >
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
                  validateStatus={errors.config.configNode}
                  help={errors.config.configNode || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Node of Config to be created
                      <Tooltip title="Enter the name for the node of Config to be created">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('configNode', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        message: 'Please input node name for the config'
                      }
                    ]
                  })(<Input placeholder="Enter Config Node Name" />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.config.configPath}
                  help={errors.config.configPath || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Exact Path of Config
                      <Tooltip title="Enter the exact path under which this node should get created">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('configPath', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        message: 'Please input config path'
                      }
                    ]
                  })(<Input placeholder="Enter Config Path" />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.config.configLabel}
                  help={errors.config.configLabel || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Config Label
                      <Tooltip title="Select the label for this config">
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
                        message: 'Please select config label'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      placeholder="Select a label"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {configsList.map(path => {
                        return (
                          <Select.Option key={path} value={path}>
                            {path}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
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
                  validateStatus={errors.config.countrySpecific ? 'error' : ''}
                  help={errors.config.countrySpecific || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Country Specific
                      <Tooltip title="Select yes if this config is country specific">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('countrySpecific', {
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        message: 'Please select option for country specific!'
                      }
                    ],
                    initialValue: true
                  })(
                    <Radio.Group
                      size="small"
                      buttonStyle="solid"
                      onChange={this.onCountrySpecifiChange}
                    >
                      <Radio.Button value={true}>Yes</Radio.Button>
                      <Radio.Button value={false}>No</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.config.valueType}
                  help={errors.config.valueType || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Type of Config Value
                      <Tooltip title="Select the datatype for this config's value">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('valueType', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        message: 'Please select config label'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      placeholder="Select a data type"
                      optionFilterProp="children"
                      onChange={this.onDataTypeChange}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {DATA_TYPES.map(type => {
                        return (
                          <Select.Option key={type} value={type.toUpperCase()}>
                            {type.toUpperCase()}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
                {/* <FormItem
                  validateStatus={errors.defaultValue ? 'error' : ''}
                  help={errors.defaultValue || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Default Value of the Config
                      <Tooltip title="Select the datatpye for this config's value">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('defaultValue', {
                    rules: [
                      {
                        required: false,

                        message: 'Please input defaultValue!',
                        whitespace: true
                      }
                    ],
                    initialValue: this.getInitialValueForField()
                  })(
                    <React.Fragment>
                      {this.renderValueField()}
                      {selectedDataType.toUpperCase() === 'JSON' &&
                      defaultValue ? (
                        <Button
                          type="primary"
                          onClick={() => this.showValueModal(defaultValue)}
                          style={{ marginLeft: 10 }}
                        >
                          View Default Value
                        </Button>
                      ) : null}
                    </React.Fragment>
                  )}
                </FormItem> */}
                <FormItem
                  validateStatus={errors.config.isActive ? 'error' : ''}
                  help={errors.config.isActive || ''}
                  {...formItemLayout}
                  className="hide"
                  label={
                    <span>
                      Is Active
                      <Tooltip title="Select true to enable the config">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('isActive', {
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        message: 'Please select option for active!'
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
                <FormItem
                  validateStatus={errors.config.approvalRequired ? 'error' : ''}
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
                        message: 'Please select option for approval required!'
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
                <CountryWiseValueTable
                  countryWiseValue={countryWiseValue}
                  deleteCountryWiseValue={this.deleteCountryWiseValue}
                  editCountryWiseValue={this.editCountryWiseValue}
                  addCountryWiseValue={this.addCountryWiseValue}
                  availableCountries={availableCountries}
                  dataType={selectedDataType}
                />
                <Row type="flex" justify="center">
                  <Button
                    type="primary"
                    disabled={
                      this.hasErrors(getFieldsError()) || this.isValueMapEmpty()
                    }
                    htmlType="submit"
                  >
                    Create ZK Config Node
                  </Button>
                </Row>
              </Col>
            </Row>
          </Card>
        </Form>
        <Modal
          visible={showCopyConfigModal}
          title="Copy Values From"
          closable={true}
          maskClosable={true}
          width={400}
          onCancel={this.hideCopyConfigModal}
          onOk={this.getConfigFromData}
          okText={'Get Data'}
        >
          <Typography>
            <Paragraph>Config Node:</Paragraph>
          </Typography>
          <Input
            value={configNode}
            placeholder="Enter Config Node"
            onChange={e => this.handleCopyFormInputChange('configNode', e)}
          />
          <Typography className="mt10">
            <Paragraph>Config Path:</Paragraph>
          </Typography>
          <Input
            value={configPath}
            placeholder="Enter Config Path"
            onChange={e => this.handleCopyFormInputChange('configPath', e)}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  createConfigResponse: state.i18nCMS.createServiceConfigResponse,
  countryListResponse: state.i18nCMS.countryListResponse,
  configsListResponse: state.i18nCMS.configsListResponse,
  getServiceConfigResponse: state.i18nCMS.getServiceConfigResponse,
  editType: state.i18nCMS.editType,
  cloneConfig: state.i18nCMS.cloneConfig
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(i18nCMActions, dispatch)
});

const CreateConfigForm = Form.create({})(CreateConfig);

export default connect(mapStateToProps, mapDispatchToProps)(CreateConfigForm);
