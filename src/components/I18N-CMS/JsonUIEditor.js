import React, { Component } from 'react';
import {
  Card,
  Menu,
  Row,
  Col,
  Breadcrumb,
  Empty,
  Typography,
  InputNumber,
  Radio,
  Input,
  notification,
  message
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const { Paragraph } = Typography;
const { TextArea } = Input;

const FROM_TOP_LEVEL = 'FROM_TOP_LEVEL';
const FROM_MIDDLE_LEVEL = 'FROM_MIDDLE_LEVEL';
const INIT = 'INIT';

export class JsonUIEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originalObj: {},
      editedObj: {},
      currentObj: {},
      mainSectionMenu: [],
      middleSectionMenu: [],
      editSectionData: [],
      currentSelectedPath: [],
      isMiddleNested: false,
      isJsonError: false
    };
  }

  componentDidMount() {
    const { initJson } = this.props;
    this.initData(initJson, true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isParentChanged) {
      this.initData(nextProps.initJson, false);
    }
  }

  initData = (initJson, showToast = false) => {
    let parsedJson = initJson;
    if (typeof initJson !== 'object') {
      try {
        parsedJson = JSON.parse(initJson);
      } catch (e) {
        if (showToast)
          message.error(
            'Invalid Json to edit it in UI. Please provide a valid JSON first.'
          );
        return;
      }
    }
    const { currentSelectedPath } = this.state;
    const editedObj = cloneDeep(parsedJson);
    const originalObj = cloneDeep(parsedJson);
    const result = this.dataFromPathList(currentSelectedPath, editedObj);
    if (result)
      this.setState({
        editedObj,
        originalObj,
        currentObj: editedObj,
        mainSectionMenu: this.getSeparateKeysFromObj(editedObj).object,
        editSectionData: result.data
      });
  };

  getSeparateKeysFromObj = obj => {
    if (typeof obj === 'object' && obj != null) {
      const keys = Object.keys(obj);
      const resultMap = { data: [], object: [] };
      for (let i = 0; i < keys.length; i++) {
        const data = obj[keys[i]];
        if (Array.isArray(data) && typeof data[0] !== 'object')
          resultMap.data.push({
            [keys[i]]: data
          });
        else if (typeof data === 'object' && data != null)
          resultMap.object.push(keys[i]);
        else resultMap.data.push({ [keys[i]]: data });
      }
      return resultMap;
    }
    return null;
  };

  handleMenuClick = (e, origin) => {
    let {
      editedObj,
      middleSectionMenu,
      currentSelectedPath,
      isMiddleNested
    } = this.state;
    if (origin === FROM_TOP_LEVEL) {
      const currentObj = editedObj[e.key];
      const result = this.getSeparateKeysFromObj(currentObj);
      if (result)
        this.setState({
          currentObj,
          middleSectionMenu: result.object,
          isMiddleNested: result.object.length > 0,
          editSectionData: result.data,
          currentSelectedPath: [e.key]
        });
    } else {
      const updatedPathList = !isMiddleNested
        ? [
            ...currentSelectedPath.slice(0, currentSelectedPath.length - 1),
            e.key
          ]
        : [...currentSelectedPath, e.key];
      const result = this.dataFromPathList(updatedPathList, editedObj);
      if (result)
        this.setState({
          currentObj: result.currentObj,
          middleSectionMenu: result.object.length
            ? result.object
            : middleSectionMenu,
          isMiddleNested: result.object.length > 0,
          currentSelectedPath: updatedPathList,
          editSectionData: result.data
        });
    }
  };

  dataFromPathList = (updatedPathList, editedObj) => {
    let currentObj = editedObj;
    for (let i = 0; i < updatedPathList.length; i++) {
      currentObj = currentObj[updatedPathList[i]];
    }
    return { ...this.getSeparateKeysFromObj(currentObj), currentObj };
  };

  onPathClick = (key, number) => {
    const { currentSelectedPath, middleSectionMenu, editedObj } = this.state;
    const isHome = key === INIT && number === 0;
    const updatedPathList = isHome ? [] : currentSelectedPath.slice(0, number);
    const result = this.dataFromPathList(updatedPathList, editedObj);
    if (result)
      this.setState({
        currentObj: result.currentObj,
        middleSectionMenu: !isHome
          ? result.object.length
            ? result.object
            : middleSectionMenu
          : [],
        isMiddleNested: result.object.length > 0,
        currentSelectedPath: updatedPathList,
        editSectionData: result.data
      });
  };

  onChange = (e, type, key, value, position) => {
    let { currentObj, editSectionData, editedObj } = this.state;
    let input = type === 'number' ? e : e.target.value;

    currentObj[key] = input;
    editSectionData[position][key] = input;

    this.setState(
      {
        currentObj,
        editSectionData
      },
      () => {
        this.props.onChange(editedObj);
      }
    );
  };

  onBlur = (e, type, key, value) => {
    const {
      currentObj,
      originalObj,
      currentSelectedPath,
      editedObj
    } = this.state;
    const jsonPath = [...currentSelectedPath, key].join(' > ');
    try {
      const finalValue = JSON.parse(value);
      let originalData = originalObj;
      for (let i = 0; i < currentSelectedPath.length; i++) {
        originalData = originalData[currentSelectedPath[i]];
      }

      const originalValue = originalData[key];
      currentObj[key] =
        typeof originalValue === 'object'
          ? finalValue
          : JSON.stringify(finalValue);
      this.setState(
        {
          currentObj,
          isJsonError: false
        },
        () => {
          this.props.updateJsonErrorStatus(false, jsonPath);
          this.props.onChange(editedObj);
        }
      );
    } catch {
      notification['error']({
        message: `Invalid JSON at ${key}`,
        description:
          'Value is not a valid json object/array. Please fix it by updating correct value',
        placement: 'topRight'
      });
      this.setState({ isJsonError: true });
      this.props.updateJsonErrorStatus(true, jsonPath);
    }
  };

  getFormField = (key, value, type, position) => {
    switch (type) {
      case 'boolean':
        return (
          <div className="json-viewer-input">
            <Radio.Group
              size="small"
              buttonStyle="solid"
              value={value}
              onChange={e => this.onChange(e, type, key, value, position)}
            >
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </div>
        );
      case 'number':
        return (
          <div className="json-viewer-input">
            <InputNumber
              style={{ width: 200 }}
              value={value}
              placeholder="Input Value"
              onChange={e => this.onChange(e, type, key, value, position)}
            />
          </div>
        );
      case 'array':
      case 'object':
      case 'arraystr':
      case 'objectstr':
        return (
          <div className="json-viewer-input">
            <TextArea
              value={value}
              autoSize={{ minRows: 3, maxRows: 8 }}
              onChange={e => this.onChange(e, type, key, value, position)}
              onBlur={e => this.onBlur(e, type, key, value, position)}
            />
          </div>
        );
      case 'string':
      default:
        return (
          <div className="json-viewer-input">
            <Input
              placeholder="Enter Value"
              value={value}
              onChange={e => this.onChange(e, type, key, value, position)}
            />
          </div>
        );
    }
  };

  renderFormItemFromObj = (data, isReadOnlyFlow, idx) => {
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length) {
        const key = keys[0];
        let value = data[key];
        let type = 'string';
        try {
          value = JSON.parse(value);
          type = typeof value;
          if (type === 'object') {
            if (Array.isArray(value)) type = 'arraystr';
            else type = 'objectstr';
            value = JSON.stringify(value);
          }
        } catch (e) {
          if (typeof value === 'object') {
            if (Array.isArray(value)) type = 'array';
            else type = 'object';
            value = JSON.stringify(value);
          } else {
            value = data[key];
            if (value[0] === '[' || value[0] === '{') {
              type = value[0] === '[' ? 'arraystr' : 'objectstr';
            }
          }
        }
        return (
          <React.Fragment key={`${key}-${idx}`}>
            <Row>
              <Col span={23} offset={1}>
                <b>{key}</b>
              </Col>
              <Col
                span={isReadOnlyFlow ? 22 : 23}
                offset={isReadOnlyFlow ? 2 : 1}
              >
                {isReadOnlyFlow ? (
                  <Typography
                    style={{ padding: '2px 4px', overflow: 'scroll' }}
                  >
                    <Paragraph>
                      {type === 'array' || type === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                    </Paragraph>
                  </Typography>
                ) : (
                  this.getFormField(key, value, type, idx)
                )}
              </Col>
            </Row>
          </React.Fragment>
        );
      }
    }
  };

  onSaveClicked = e => {
    e.preventDefault();
    const { editedObj, originalObj, isJsonError } = this.state;
    if (isJsonError) {
      message.error('JSON error in page. Please fix that first.');
      return;
    }

    if (isEqual(originalObj, editedObj)) {
      message.info('No change detected.');
      return;
    }
    this.props.onValueSave(editedObj);
    // this.props.handleSaveSubmit(editedObj);
  };

  getDataKeyName = () => {
    const { currentSelectedPath } = this.state;
    const length = currentSelectedPath.length;
    if (typeof currentSelectedPath[length - 1] === 'number')
      return `${currentSelectedPath[length - 2]}[${
        currentSelectedPath[length - 1]
      }]`;
    return currentSelectedPath[length - 1];
  };
  render() {
    const {
      mainSectionMenu,
      middleSectionMenu,
      editSectionData,
      currentSelectedPath
    } = this.state;

    const { isReadOnlyFlow } = this.props;
    return (
      <React.Fragment>
        <Card title={'JSON Ui Editor'} style={{ margin: 20 }}>
          <Card bordered={true}>
            <Row>
              <Breadcrumb>
                <Breadcrumb.Item
                  key={'Home'}
                  onClick={() => this.onPathClick(INIT, 0)}
                >
                  Home
                </Breadcrumb.Item>
                {currentSelectedPath.map((path, number) => (
                  <Breadcrumb.Item
                    key={`${path}-${number}`}
                    onClick={() => this.onPathClick(path, number + 1)}
                  >
                    {path}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </Row>
          </Card>
          <Row className="mt10">
            <Col span={7} className="json-viewer-column">
              <Menu
                selectedKeys={[currentSelectedPath[0]]}
                mode="inline"
                onClick={e => this.handleMenuClick(e, FROM_TOP_LEVEL)}
              >
                {mainSectionMenu.map(menu => (
                  <Menu.Item key={menu}>{menu}</Menu.Item>
                ))}
              </Menu>
            </Col>
            <Col
              span={middleSectionMenu.length ? 7 : 0}
              className="json-viewer-column"
            >
              <Menu
                mode="inline"
                selectedKeys={[
                  currentSelectedPath[currentSelectedPath.length - 1]
                ]}
                onClick={e => this.handleMenuClick(e, FROM_MIDDLE_LEVEL)}
              >
                {middleSectionMenu.map(menu => (
                  <Menu.Item key={menu}>{menu}</Menu.Item>
                ))}
              </Menu>
            </Col>
            <Col span={10} className="json-viewer-column">
              {editSectionData.length ? (
                editSectionData.map((obj, idx) => {
                  return this.renderFormItemFromObj(obj, isReadOnlyFlow, idx);
                })
              ) : (
                <Empty description={<span>Select Item from Left</span>} />
              )}
            </Col>
          </Row>
        </Card>
      </React.Fragment>
    );
  }
}

export default JsonUIEditor;
