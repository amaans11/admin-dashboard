import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSVReader from 'react-csv-reader';
import { CSVLink } from 'react-csv';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  InputNumber,
  Row,
  Col,
  Icon,
  Radio,
  Tooltip,
  Button,
  Avatar,
  Typography,
  message,
  Divider,
  Modal,
  Input,
  Select,
  Table
} from 'antd';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';
import * as asnActions from '../../actions/asnActions';
import { SUPER_ADMIN, SOCIAL_ADMIN } from '../../auth/userPermission';

const { Paragraph, Title } = Typography;
const { Meta } = Card;
const FormItem = Form.Item;

const MONEY_TYPES = [
  { value: 'Winning', text: 'Winning' },
  // { value: 'Deposit', text: 'Deposit' },
  { value: 'Bonus', text: 'Bonus' },
  { value: 'Token', text: 'Token' }
];
export class ProcessBulkPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCsvRead: false,
      csvData: [],
      invalidCsv: false,
      isInvalidData: null,
      userAmount: {},
      processClicked: false,
      userAmoutTableData: [],
      sampleCsvData: [
        [696541, 20],
        [767579, 20],
        [707438, 30]
      ],
      transactionSuccess: false,
      transactionData: {}
    };
    this.columns = [
      { title: 'User Id', dataIndex: 'userId1' },
      { title: 'Amount', dataIndex: 'amount1' },
      { title: 'User Id', dataIndex: 'userId2' },
      { title: 'Amount', dataIndex: 'amount2' }
    ];
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleCsvUpload(data = [], file) {
    if (data && data.length) {
      let csvData = [];
      let invalidCsv = false;
      let userAmount = {};
      let processClicked = false;
      let userAmoutTableData = [];
      let idx = 0;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].length === 2 &&
          typeof data[i][0] == 'string' &&
          typeof data[i][1] == 'string' &&
          !isNaN(Number(data[i][0])) &&
          !isNaN(Number(data[i][1])) &&
          data[i][0] !== '' &&
          data[i][1] !== ''
        ) {
          csvData.push(data[i]);
          userAmount[Number(data[i][0])] = String(Number(data[i][1]));
          if (i % 2 == 0)
            userAmoutTableData[idx++] = {
              id: idx,
              userId1: data[i][0],
              amount1: data[i][1],
              userId2: data[i + 1] ? data[i + 1][0] : null,
              amount2: data[i + 1] ? data[i + 1][1] : null
            };
        } else {
          invalidCsv = true;
          csvData = null;
          break;
        }
      }
      this.setState({
        isCsvRead: !invalidCsv,
        csvData,
        invalidCsv,
        userAmount,
        processClicked,
        userAmoutTableData
      });
      if (!invalidCsv) {
        let tfileName = typeof file === 'string' ? file : file.name;
        const extension =
          '.' + tfileName.slice(((tfileName.lastIndexOf('.') - 1) >>> 0) + 2);
        let fileName = tfileName.split(' ').join('-');
        fileName = fileName.substring(0, fileName.length - extension.length);
        this.setState({
          csvFileInfo: {
            contentType: 'text/csv',
            extension,
            fileName
          }
        });
        this.processCsvData();
      }
    } else {
      this.setState({
        isCsvRead: false,
        invalidCsv: true
      });
    }
  }

  processCsvData = () => {
    if (!this.state.invalidCsv)
      this.setState(
        {
          processClicked: true
        },
        () => {
          this.props.form.validateFields();
        }
      );
  };

  writeAllowedUser = () => {
    return (
      this.props.currentUser.user_role.includes(SUPER_ADMIN) ||
      this.props.currentUser.user_role.includes(SOCIAL_ADMIN)
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = { ...values };
        data.userAmount = this.state.userAmount;
        data.csvData = this.state.csvData;
        data.csvFileInfo = this.state.csvFileInfo;
        data.transactionType = 'CREDIT';
        this.props.actions.processBulkPayment(data).then(() => {
          if (this.props.processBulkPaymentResponse) {
            if (this.props.processBulkPaymentResponse.isSuccess) {
              message.success('Amount processed successfully');
              this.setState({
                csvData: [],
                isCsvRead: false,
                invalidCsv: false,
                isInvalidData: null,
                userAmount: {},
                processClicked: false,
                userAmoutTableData: [],
                transactionSuccess: true,
                transactionData: { ...this.props.processBulkPaymentResponse }
              });
            } else {
              message.error(
                get(
                  this.props.processBulkPaymentResponse,
                  'error.message',
                  'Something went wrong'
                )
              );
            }
          } else {
            message.error('Could not process amount');
          }
        });
      } else {
        message.error('Please verify form first');
      }
    });
  };
  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
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

    const moneyTypeError =
      isFieldTouched('moneyType') && getFieldError('moneyType');
    const referenceTypeError =
      isFieldTouched('referenceType') && getFieldError('referenceType');
    const descriptionError =
      isFieldTouched('description') && getFieldError('description');
    return (
      <React.Fragment>
        <Helmet>
          <title>Process Amount | Admin Dashboard</title>
        </Helmet>
        <Card title="Upload Payment CSV File" style={{ margin: 20 }}>
          <Row type="flex" justify="center" align="middle">
            <Paragraph
              style={{ marginRight: 10, marginBottom: 0, textAlign: 'right' }}
            >
              Upload CSV file having <br /> user winnings information
            </Paragraph>
            <CSVReader
              cssClass="csv-reader-input"
              label={''}
              onFileLoaded={(e, file) => this.handleCsvUpload(e, file)}
            />
            {/* {this.state.isCsvRead && !this.state.invalidCsv ? (
              <React.Fragment>
                <Button
                  type="default"
                  onClick={this.processCsvData}
                  className="ml10"
                >
                  Process Data
                </Button>
              </React.Fragment>
            ) : (
              ''
            )} */}
          </Row>
          <Divider type="horizontal" />
          <Paragraph style={{ marginTop: 10 }}>
            <b>Note: </b>
            Please find the sample csv here{' '}
            <CSVLink data={this.state.sampleCsvData} filename={'sample-csv'}>
              <Button icon="download" style={{ marginLeft: 10 }}>
                Sample CSV
              </Button>
            </CSVLink>
          </Paragraph>
        </Card>
        {this.state.invalidCsv ? (
          <Card style={{ margin: 20 }}>
            <Typography>
              <Title level={3}>Invalid CSV Data. </Title>
              <Paragraph>
                The CSV file you uploaded is either invalid or corrupted.
                <br />
                CSV data should be 2 column csv file having userId and amount
                starting from first row.
              </Paragraph>
            </Typography>
          </Card>
        ) : this.state.isCsvRead && this.state.processClicked ? (
          <Card style={{ margin: 20 }}>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col span={24}>
                  <FormItem
                    validateStatus={moneyTypeError ? 'error' : ''}
                    help={moneyTypeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Money Type
                        <Tooltip title="Select Money Type for Credit">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('moneyType', {
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          message: 'Please select money type!'
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select Monye Type"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {MONEY_TYPES.map(moneyType => {
                          return (
                            <Select.Option
                              key={moneyType.value}
                              value={moneyType.value}
                            >
                              {moneyType.text}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={referenceTypeError ? 'error' : ''}
                    help={referenceTypeError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Reference Type
                        <Tooltip title="Input reference type, should use underscore('_') instead of space(' '), and in uppercase only">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('referenceType', {
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          message: 'Please input reference type!'
                        }
                      ],
                      initialValue: ''
                    })(
                      <Col>
                        <Input style={{ textTransform: 'uppercase' }}></Input>
                        <p className="help-text">
                          <i>
                            e.g. CONTEST_AUDIO_SHOW, hover help icon for more
                            info
                          </i>
                        </p>
                      </Col>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={descriptionError ? 'error' : ''}
                    help={descriptionError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Description
                        <Tooltip title="Input description, It will be shown in app">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('description', {
                      rules: [
                        {
                          type: 'string',
                          required: true,
                          message: 'Please input description!'
                        }
                      ],
                      initialValue: ''
                    })(<Input />)}
                  </FormItem>
                  <Row style={{ marginTop: 20 }}>
                    <Typography>
                      <Title level={4}>User Ids Affacted:</Title>
                    </Typography>
                    <Table
                      style={{ marginTop: 20 }}
                      id="user-amount-table"
                      bordered
                      rowKey="id"
                      dataSource={this.state.userAmoutTableData}
                      columns={this.columns}
                      size="small"
                    />
                  </Row>
                  <Row type="flex" justify="center">
                    <Button
                      type="primary"
                      disabled={
                        this.hasErrors(getFieldsError()) ||
                        !this.writeAllowedUser()
                      }
                      htmlType="submit"
                    >
                      Process Payment
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : this.state.transactionSuccess ? (
          <Card style={{ margin: 20 }} title="Transaction Response Data">
            {JSON.stringify(this.state.transactionData, null, 4)}
          </Card>
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  processBulkPaymentResponse: state.asn.processBulkPaymentResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...asnActions }, dispatch)
});
const ProcessBulkPaymentForm = Form.create()(ProcessBulkPayment);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessBulkPaymentForm);
