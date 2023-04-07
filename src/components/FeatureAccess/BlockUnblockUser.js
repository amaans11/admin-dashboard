import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CSVReader from 'react-csv-reader';
import {
  Card,
  Form,
  InputNumber,
  Radio,
  Button,
  Row,
  Col,
  Select,
  message,
  Input
} from 'antd';

import * as userDataActions from '../../actions/userDataActions';
import * as asnActions from '../../actions/asnActions';
import { SUPER_ADMIN, SOCIAL_ADMIN } from '../../auth/userPermission';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const countryOptions = ['IN', 'ID', 'US'];

const BLOCK_UNIT = ['hours', 'days', 'weeks', 'years'];

export class BlockUnblockUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUnblockUserFlow: window.location.href.includes(
        '/user-features/unblock'
      ),
      blockType: 'userId',
      featuresList: [],
      blockDuration: 0,
      blockUnit: 'hours',
      selectedCountry: 'IN'
    };
  }

  componentDidMount() {
    this.props.actions.getFetureAccessConfig().then(() => {
      if (this.props.getFetureAccessConfigResponse) {
        let nodeData =
          this.props.getFetureAccessConfigResponse.nodeData &&
          this.props.getFetureAccessConfigResponse.nodeData !== ''
            ? JSON.parse(this.props.getFetureAccessConfigResponse.nodeData)
            : {
                blockFeaturesList: ['LIVE_STREAM_CREATE', 'LIVE_STREAM_JOIN']
              };
        this.setState({
          featuresList: nodeData.blockFeaturesList
        });
      }
    });
    // this.props.form.validateFields();
  }

  onBlockDurationChange = blockDuration => {
    this.setState({ blockDuration });
  };
  onBlockUnitChange = blockUnit => {
    this.setState({ blockUnit });
  };
  setBlockType = blockType => {
    this.setState({ blockType, csvData: [], isCsvRead: false });
  };
  checkPermission = () => {
    return [SUPER_ADMIN, SOCIAL_ADMIN].filter(e =>
      this.props.currentUser.user_role.includes(e)
    ).length
      ? true
      : false;
  };

  checkForCsvData = () => {
    const { blockType, isCsvRead, csvData } = this.state;
    if (blockType !== 'bulk') return false;
    else return !(isCsvRead && csvData.length > 0);
  };
  handleFileUpload(data = []) {
    if (data && data.length) {
      let csvData = [];
      for (let i = 0; i < data.length; i++) {
        csvData.push(...data[i]);
      }
      this.setState({
        isCsvRead: true,
        csvData,
        showUserFound: false
      });
    } else {
      message.info('Empty CSV File uploaded, please upload correct file.');
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          blockType,
          csvData,
          isCsvRead,
          isUnblockUserFlow,
          blockDuration,
          blockUnit
        } = this.state;
        const data = { ...values };
        if (blockType === 'userId') data.userId = [values.blockValue];
        else if (blockType === 'mobile') data.mobile = values.blockValue;
        else if (blockType === 'bulk' && isCsvRead) {
          data.userId = [...csvData];
        }

        if (!isUnblockUserFlow) {
          if (blockDuration)
            data.blockExpiry = moment()
              .add({ [blockUnit]: blockDuration })
              .valueOf();
          else {
            message.warning('Enter block duration first');
            return;
          }
        }

        delete data.blockType;
        delete data.blockValue;
        let methodToCall = '';
        let responseKey = '';

        if (isUnblockUserFlow) {
          methodToCall = 'unblockUserFeature';
          responseKey = 'unblockUserFeatureResponse';
        } else {
          methodToCall = 'blockUserFeature';
          responseKey = 'blockUserFeatureResponse';
        }

        this.props.actions[methodToCall](data).then(() => {
          if (this.props[responseKey] && this.props[responseKey].isSuccess) {
            message.success(
              `User(s) ${isUnblockUserFlow ? 'un' : ''}blocked Successfully.`
            );
          } else {
            message.error(
              this.props[responseKey].message ||
                'An error occurred. Please try again.'
            );
          }
        });
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const errors = {
      blockValue: isFieldTouched('blockValue') && getFieldError('blockValue'),
      blockType: isFieldTouched('blockType') && getFieldError('blockType'),
      feature: isFieldTouched('feature') && getFieldError('feature'),
      reason: isFieldTouched('reason') && getFieldError('reason')
    };

    const {
      blockType,
      featuresList,
      isUnblockUserFlow,
      userTableData
    } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        lg: { span: 11 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };
    return (
      <React.Fragment>
        <Helmet>
          <title>Feature Access Management | Admin Dashboard</title>
        </Helmet>
        <Row>
          <Col span={24}>
            <Card
              title={`${isUnblockUserFlow ? 'Unblock' : 'Block'} User(s)`}
              style={{ margin: 20 }}
            >
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label={isUnblockUserFlow ? 'Unblock Using' : 'block Using'}
                  validateStatus={errors.blockType ? 'error' : ''}
                >
                  {getFieldDecorator('blockType', {
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue: 'userId'
                  })(
                    <RadioGroup
                      name="type"
                      type="solid"
                      onChange={e => this.setBlockType(e.target.value)}
                    >
                      <Radio.Button value={'userId'}>User Id</Radio.Button>
                      <Radio.Button value={'mobile'}>Mobile</Radio.Button>
                      <Radio.Button value={'bulk'}>CSV File</Radio.Button>
                    </RadioGroup>
                  )}
                </FormItem>
                {this.state.blockType === 'mobile' && (
                  <FormItem {...formItemLayout} label={<span>Country</span>}>
                    {getFieldDecorator('countryCode', {
                      initialValue: this.state.selectedCountry
                    })(
                      <Radio.Group
                        options={countryOptions}
                        onChange={e => {
                          this.setState({ selectedCountry: e.target.value });
                        }}
                        value={this.state.selectedCountry}
                      />
                    )}
                  </FormItem>
                )}
                <FormItem
                  {...formItemLayout}
                  validateStatus={errors.blockValue ? 'error' : ''}
                  label={
                    <span>
                      {blockType === 'bulk'
                        ? 'Select CSV'
                        : blockType === 'userId'
                        ? 'User ID'
                        : 'Mobile'}
                    </span>
                  }
                >
                  {getFieldDecorator('blockValue', {
                    rules: [
                      {
                        message: 'Please input value!',
                        whitespace: false,
                        type: 'number',
                        required: blockType !== 'bulk' ? true : false
                      }
                    ]
                  })(
                    blockType === 'bulk' ? (
                      <CSVReader
                        cssClass="csv-reader-input"
                        label={`Upload User Ids CSV file`}
                        onFileLoaded={e => this.handleFileUpload(e)}
                      />
                    ) : (
                      <InputNumber min={0} style={{ width: 200 }} />
                    )
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  validateStatus={errors.feature ? 'error' : ''}
                  label={`Feature to ${
                    isUnblockUserFlow ? 'un' : ''
                  }block from`}
                >
                  {getFieldDecorator('feature', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        message: 'Please select a feature',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      placeholder="Select a Feature that apply"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {featuresList.map((feature, idx) => {
                        return (
                          <Select.Option key={`feature@${idx}`} value={feature}>
                            {feature}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
                {!isUnblockUserFlow ? (
                  <FormItem {...formItemLayout} label="Block For">
                    {getFieldDecorator('blockExpiry', {
                      rules: [
                        {
                          type: 'string',
                          message: 'Please select a period',
                          whitespace: false
                        }
                      ]
                    })(
                      <Row type="flex" justify="space-between" align="middle">
                        <InputNumber
                          style={{ width: '33%' }}
                          min={0}
                          onChange={this.onBlockDurationChange}
                        />
                        <Select
                          showSearch
                          placeholder="Select a period"
                          optionFilterProp="children"
                          onChange={this.onBlockUnitChange}
                          style={{ width: '65%' }}
                          defaultValue={'hours'}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {BLOCK_UNIT.map((unit, idx) => {
                            return (
                              <Select.Option
                                key={`blockunit@${idx}`}
                                value={unit}
                              >
                                {unit}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Row>
                    )}
                  </FormItem>
                ) : null}
                <FormItem
                  {...formItemLayout}
                  validateStatus={errors.reason ? 'error' : ''}
                  label="Reason"
                >
                  {getFieldDecorator('reason', {
                    rules: [
                      {
                        required: true,
                        type: 'string',
                        message: 'Please input reason',
                        whitespace: false
                      }
                    ]
                  })(<Input placeholder="Enter Reason" />)}
                </FormItem>

                <Row type="flex" justify="center">
                  <Button
                    type="primary"
                    disabled={
                      this.hasErrors(getFieldsError()) ||
                      !this.checkPermission() ||
                      this.checkForCsvData()
                    }
                    htmlType="submit"
                  >
                    {isUnblockUserFlow ? 'Unblock User(s)' : 'Block User(s)'}
                  </Button>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const BlockUnblockUserForm = Form.create()(BlockUnblockUser);
const mapStateToProps = state => ({
  blockUserFeatureResponse: state.asn.blockUserFeatureResponse,
  unblockUserFeatureResponse: state.asn.unblockUserFeatureResponse,
  getFetureAccessConfigResponse: state.userData.getFetureAccessConfigResponse,
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...userDataActions, ...asnActions }, dispatch)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockUnblockUserForm);
