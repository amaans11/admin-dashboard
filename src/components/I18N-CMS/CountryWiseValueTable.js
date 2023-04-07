import React, { Component } from 'react';
import {
  Button,
  Form,
  Select,
  Table,
  Card,
  Popconfirm,
  Input,
  InputNumber,
  Radio,
  Modal,
  notification,
  Tabs
} from 'antd';
import ReactJson from 'react-json-view';
import JsonUIEditor from './JsonUIEditor';
const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

const LOCAL = 'LOCAL';
const UI = 'UI';
export class CountryWiseValueTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Country',
        dataIndex: 'countryCode',
        render: (text, record) => (
          <span>{`${record.countryName} (${text})`}</span>
        )
      },
      {
        title: 'Value',
        dataIndex: 'value',
        render: (text, record) => {
          const { isInEditMode, editCountryCode } = this.state;
          if (isInEditMode && editCountryCode === record.countryCode) {
            return this.renderValueField(text);
          }
          return typeof text === 'boolean' ? (
            <span>{text ? 'True' : 'False'}</span>
          ) : (
            <span>
              {text.length > 50 ? `${text.substring(0, 50)}...` : text}
            </span>
          );
        }
      },
      {
        title: 'Actions',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editCountryCode } = this.state;
          const { countryToIgnore, editDisabled } = this.props;
          return (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  this.props.deleteCountryWiseValue(record.countryCode)
                }
              >
                <Button type="danger" size="small" disabled={editDisabled}>
                  Delete
                </Button>
              </Popconfirm>
              {record.value && record.value.length > 50 ? (
                <Button
                  className="ml10"
                  size="small"
                  onClick={() => this.showModal('view', record.value)}
                >
                  View
                </Button>
              ) : null}
              {editCountryCode !== record.countryCode ? (
                <Button
                  size="small"
                  className="ml10"
                  onClick={() => this.switchToEditMode(record)}
                  disabled={
                    editDisabled && countryToIgnore !== record.countryCode
                  }
                >
                  Edit
                </Button>
              ) : (
                <span>
                  <Button
                    size="small"
                    className="ml10"
                    onClick={() => this.saveEditedValue(record)}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    className="ml10"
                    onClick={() => this.disableEditMode()}
                  >
                    Cancel
                  </Button>
                </span>
              )}
            </div>
          );
        }
      }
    ];
    this.state = {
      showModal: false,
      modalType: '',
      valueToShow: '',
      inputValue: '',
      editCountryCode: '',
      isInEditMode: '',
      isLocalChanged: false,
      isJsonError: false,
      jsonPath: ''
    };
  }

  showModal = (modalType, valueToShow) => {
    this.setState({
      showModal: true,
      modalType,
      valueToShow
    });
  };

  hideModal = () => {
    this.setState({
      modalType: '',
      showModal: false,
      valueToShow: '',
      isInEditMode: false,
      editCountryCode: ''
    });
  };

  handlePopupInputChange = (e, source) => {
    let obj = source === UI ? e : undefined;
    try {
      obj = source === LOCAL ? JSON.parse(e.target.value) : e;
    } catch (e) {}
    this.setState({
      inputValue: obj ? JSON.stringify(obj, null, 4) : e.target.value,
      isLocalChanged: source === LOCAL
    });
  };

  setJsonError = (isJsonError, jsonPath) => {
    this.setState({
      isJsonError,
      jsonPath
    });
  };

  componentWillReceiveProps(nextProps) {
    const { dataType: newDataType } = nextProps;
    const { dataType } = this.props;
    if (dataType !== newDataType) {
      const inputValue = this.getInitialInputValue(newDataType);
      this.setState({
        inputValue
      });
      this.props.form.setFieldsValue({ value: inputValue });
    }
  }

  getInitialInputValue = dataType => {
    switch (dataType.toUpperCase()) {
      case 'BOOLEAN':
        return false;
      case 'NUMBER':
        return 0;
      case 'JSON':
      case 'STRING':
      default:
        return '';
    }
  };

  renderValueField = initValue => {
    const { dataType } = this.props;
    switch (dataType.toUpperCase()) {
      case 'BOOLEAN':
        return (
          <Radio.Group
            size="small"
            buttonStyle="solid"
            defaultValue={initValue ? JSON.parse(initValue) : ''}
            onChange={e => this.onChange(e, 'Radio')}
          >
            <Radio.Button value={true}>True</Radio.Button>
            <Radio.Button value={false}>False</Radio.Button>
          </Radio.Group>
        );
      case 'NUMBER':
        return (
          <InputNumber
            style={{ width: 200 }}
            defaultValue={initValue}
            placeholder="Input Value"
            onChange={e => this.onChange(e, 'Number')}
          />
        );
      case 'JSON':
        return (
          <Button onClick={() => this.showModal('edit')}>
            Click to Input JSON
          </Button>
        );
      case 'STRING':
      default:
        return (
          <Input
            placeholder="Enter Value"
            defaultValue={initValue}
            onChange={e => this.onChange(e, 'String')}
          />
        );
    }
  };

  onChange = (e, type) => {
    this.setState({
      inputValue: type === 'Number' ? e : e.target.value
    });
  };

  verifyJson = data => {
    try {
      const obj = JSON.parse(data);
      return obj;
    } catch (e) {
      notification['error']({
        message: 'Invalid JSON',
        description: 'Value is not a valid json object/array.',
        placement: 'topRight'
      });
    }
    return null;
  };

  onModalOk = () => {
    const {
      modalType,
      inputValue,
      isInEditMode,
      editCountryCode,
      isJsonError,
      jsonPath
    } = this.state;
    if (modalType === 'edit') {
      const verified = this.verifyJson(inputValue);
      if (isJsonError) {
        notification['error']({
          message: `Invalid JSON`,
          description: `Please the JSON using JSON UI. This error is because of an error in UI Json Data filling at ${jsonPath}`,
          placement: 'topRight'
        });
        return;
      }
      if (verified) {
        const value = JSON.stringify(verified);
        if (isInEditMode) {
          this.props.editCountryWiseValue(editCountryCode, value);
        }
        this.setState({
          inputValue: JSON.stringify(verified),
          showModal: false,
          isInEditMode: false,
          editCountryCode: ''
        });
      }
    } else {
      this.setState({
        showModal: false
      });
    }
  };

  switchToEditMode = data => {
    const { dataType } = this.props;
    const isJson = dataType.toUpperCase() === 'JSON';
    this.setState(
      {
        editCountryCode: data.countryCode,
        isInEditMode: true,
        inputValue: isJson
          ? JSON.stringify(JSON.parse(data.value), null, 4)
          : data.value
      },
      () => {
        if (isJson) {
          this.showModal('edit');
        }
      }
    );
    // this.props.setData(data, true);
  };
  disableEditMode = () => {
    this.setState({
      editCountryCode: '',
      isInEditMode: false
    });
  };

  saveEditedValue = data => {
    let { inputValue } = this.state;
    const { dataType } = this.props;
    if (dataType.toUpperCase() === 'JSON')
      inputValue = JSON.stringify(JSON.parse(inputValue));
    else inputValue = String(inputValue);
    this.setState({
      editCountryCode: '',
      isInEditMode: false
    });
    this.props.editCountryWiseValue(data.countryCode, inputValue);
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    const { inputValue } = this.state;
    const { dataType } = this.props;
    this.props.form.setFieldsValue({
      value: inputValue
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.countryCode) this.props.addCountryWiseValue(values);
        this.props.form.setFieldsValue({
          countryCode: null,
          value: null
        });
        this.setState({
          inputValue:
            dataType.toUpperCase() === 'JSON'
              ? JSON.stringify(JSON.parse(inputValue), null, 4)
              : inputValue
        });
        this.props.form.validateFields();
      }
    });
  };

  componentDidMount() {
    this.props.form.validateFields();
  }

  getDataType = () => {
    const { dataType } = this.props;
    return dataType.toLowerCase() === 'json'
      ? 'string'
      : dataType.toLowerCase();
  };
  render() {
    const {
      getFieldDecorator,
      isFieldTouched,
      getFieldError,
      getFieldsError
    } = this.props.form;

    const errors = {
      countryCode:
        isFieldTouched('countryCode') && getFieldError('countryCode'),
      value: isFieldTouched('value') && getFieldError('value')
    };

    const { hideForm, dataType = '', showCustomEditor = false } = this.props;
    const {
      valueToShow,
      showModal,
      modalType,
      inputValue,
      isInEditMode,
      isLocalChanged
    } = this.state;
    return (
      <React.Fragment>
        <Card title="Country Wise Values">
          {!hideForm ? (
            <Form onSubmit={this.handleSubmit} layout="inline">
              <FormItem
                label="Country"
                validateStatus={errors.countryCode ? 'error' : ''}
                help={errors.countryCode || ''}
              >
                {getFieldDecorator('countryCode', {
                  rules: [{ required: true }]
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a Country"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      return (
                        option.props.children
                          .join('')
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {this.props.availableCountries.map(country => {
                      return (
                        <Select.Option key={`${country.countryCode}`}>
                          {country.countryName} - {country.countryCode}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.value ? 'error' : ''}
                help={errors.value || ''}
                label="Value"
              >
                {getFieldDecorator('value', {
                  rules: [
                    {
                      type: this.getDataType(),
                      required: false,
                      message: 'Please input value!',
                      whitespace: false
                    }
                  ]
                })(this.renderValueField())}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError())}
                >
                  Add Value
                </Button>
              </FormItem>
            </Form>
          ) : null}
          <Table
            style={{ marginTop: 20 }}
            id="country-wise-value-table"
            bordered
            rowKey="countryCode"
            dataSource={this.props.countryWiseValue}
            columns={this.columns}
            size="small"
          />
        </Card>
        <Modal
          visible={showModal}
          title={
            modalType === 'view'
              ? 'Data Viewer'
              : modalType === 'edit'
              ? 'Enter JSON Object/Array'
              : 'Modal'
          }
          closable={true}
          maskClosable={true}
          width={showCustomEditor ? '90vw' : 800}
          onCancel={this.hideModal}
          onOk={this.onModalOk}
          okText={isInEditMode ? 'Update' : 'OK'}
        >
          {modalType === 'view' ? (
            dataType.toUpperCase() === 'JSON' ? (
              <Tabs type="card" defaultActiveKey="2">
                <TabPane key="1" tab="Tree View">
                  <ReactJson
                    name={false}
                    displayObjectSize={false}
                    src={
                      valueToShow && valueToShow != ''
                        ? JSON.parse(valueToShow)
                        : {}
                    }
                  />
                </TabPane>
                <TabPane key="2" tab="Simplefied View">
                  <JsonUIEditor
                    initJson={
                      valueToShow && valueToShow != ''
                        ? JSON.parse(valueToShow)
                        : {}
                    }
                    isReadOnlyFlow={true}
                  />
                </TabPane>
              </Tabs>
            ) : (
              valueToShow
            )
          ) : modalType === 'edit' ? (
            showCustomEditor ? (
              <Tabs type="card" defaultActiveKey="1">
                <TabPane tab="JSON Input" key="1">
                  <TextArea
                    rows={20}
                    value={inputValue}
                    onChange={e => this.handlePopupInputChange(e, LOCAL)}
                  ></TextArea>
                </TabPane>
                <TabPane tab="JSON UI Editor" key="2">
                  <JsonUIEditor
                    initJson={inputValue}
                    onValueSave={this.updateInputValue}
                    isReadOnlyFlow={false}
                    isParentChanged={isLocalChanged}
                    updateJsonErrorStatus={this.setJsonError}
                    onChange={e => this.handlePopupInputChange(e, UI)}
                  />
                </TabPane>
              </Tabs>
            ) : (
              <TextArea
                rows={20}
                value={inputValue}
                onChange={e => this.handlePopupInputChange(e, LOCAL)}
              ></TextArea>
            )
          ) : (
            ''
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

const CountryWiseValueTableForm = Form.create()(CountryWiseValueTable);
export default CountryWiseValueTableForm;
