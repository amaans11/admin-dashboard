import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Card,
  Form,
  message,
  Button,
  Input,
  Row,
  Col,
  Table,
  Radio,
  InputNumber,
  Tooltip,
  Divider,
  Modal
} from 'antd';
import * as fraudActions from '../../actions/fraudActions';
import { CSVLink } from 'react-csv';
import CSVReader from 'react-csv-reader';

const FormItem = Form.Item;

const Headers = [
  { label: 'id', key: 'id' },
  { label: 'entryFee', key: 'entryFee' },
  { label: 'startDate', key: 'startDate' },
  { label: 'userId', key: 'userId' },
  { label: 'userJson', key: 'userJson' },
  { label: 'opponent1Id', key: 'opponent1Id' },
  { label: 'opponent1Json', key: 'opponent1Json' },
  { label: 'opponent2Id', key: 'opponent2Id' },
  { label: 'opponent2Json', key: 'opponent2Json' },
  { label: 'opponent3Id', key: 'opponent3Id' },
  { label: 'opponent3Json', key: 'opponent3Json' },
  { label: 'opponent4Id', key: 'opponent4Id' },
  { label: 'opponent4Json', key: 'opponent4Json' },
  { label: 'opponent5Id', key: 'opponent5Id' },
  { label: 'opponent5Json', key: 'opponent5Json' },
  { label: 'errorMessage', key: 'errorMessage' }
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class FraudInvestigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      detailsList: [],
      showInputTable: false,
      csvSectionOnly: false,
      showModal: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleFileUpload(data) {
    let inputCsvData = [];
    _.forEach(data, function(item) {
      let cursor = {
        id: item[0].trim(),
        userId: item[1].trim(),
        type: item[2].trim()
      };
      inputCsvData.push(cursor);
    });
    this.setState({
      showInputTable: true,
      inputCsvData,
      csvSectionOnly: true
    });
  }

  fetchDetails() {
    let requestArray = [...this.state.inputCsvData];
    let data = {
      requestArray
    };
    this.props.actions.getInvestigationDetails(data).then(() => {
      if (
        this.props.getInvestigationDetailsResponse &&
        this.props.getInvestigationDetailsResponse.tournamentAndBattleDetails &&
        this.props.getInvestigationDetailsResponse.tournamentAndBattleDetails
          .length > 0
      ) {
        let rawData = [
          ...this.props.getInvestigationDetailsResponse
            .tournamentAndBattleDetails
        ];
        let detailsList = [];
        _.forEach(rawData, function(item) {
          // ------- EACH ROW -------- //
          let userId = item.userId;
          let userObject = _.find(item.playerInfo, { userId: userId });

          let opponentArray = _.filter(item.playerInfo, function(o) {
            return o.userId != userId;
          });
          console.log(opponentArray);

          let cursor = {
            id: item.id ? item.id : 'NA',
            entryFee: item.entryFee ? item.entryFee : 0,
            startDate: item.startDateTime
              ? moment(item.startDateTime).format('DD/MM/YY hh:mm A')
              : 'N/A',
            userId: item.userId,
            userJson:
              userObject && userObject.userJson
                ? userObject.userJson.replace(/[,]/g, ';')
                : 'NA',
            opponent1Id:
              opponentArray && opponentArray[0] && opponentArray[0].userId
                ? opponentArray[0].userId
                : 'NA',
            opponent1Json:
              opponentArray && opponentArray[0] && opponentArray[0].userJson
                ? opponentArray[0].userJson.replace(/[,]/g, ';')
                : 'NA',
            opponent2Id:
              opponentArray && opponentArray[1] && opponentArray[1].userId
                ? opponentArray[1].userId
                : 'NA',
            opponent2Json:
              opponentArray && opponentArray[1] && opponentArray[1].userJson
                ? opponentArray[1].userJson.replace(/[,]/g, ';')
                : 'NA',
            opponent3Id:
              opponentArray && opponentArray[2] && opponentArray[2].userId
                ? opponentArray[2].userId
                : 'NA',
            opponent3Json:
              opponentArray && opponentArray[2] && opponentArray[2].userJson
                ? opponentArray[2].userJson.replace(/[,]/g, ';')
                : 'NA',
            opponent4Id:
              opponentArray && opponentArray[3] && opponentArray[3].userId
                ? opponentArray[3].userId
                : 'NA',
            opponent4Json:
              opponentArray && opponentArray[3] && opponentArray[3].userJson
                ? opponentArray[3].userJson.replace(/[,]/g, ';')
                : 'NA',
            opponent5Id:
              opponentArray && opponentArray[4] && opponentArray[4].userId
                ? opponentArray[4].userId
                : 'NA',
            opponent5Json:
              opponentArray && opponentArray[4] && opponentArray[4].userJson
                ? opponentArray[4].userJson.replace(/[,]/g, ';')
                : 'NA',
            errorMessage: item.errorMessage ? item.errorMessage : 'NA'
          };
          detailsList.push(cursor);

          // ------- EACH ROW -------- //
        });
        this.setState({ detailsList, showTable: true });
      } else {
        message.info('No records found');
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let requestArray = [];
        let cursor = {
          id: values.id,
          userId: values.userId,
          type: values.type
        };
        requestArray.push(cursor);
        let data = {
          requestArray
        };
        this.props.actions.getInvestigationDetails(data).then(() => {
          if (
            this.props.getInvestigationDetailsResponse &&
            this.props.getInvestigationDetailsResponse
              .tournamentAndBattleDetails &&
            this.props.getInvestigationDetailsResponse
              .tournamentAndBattleDetails.length > 0
          ) {
            let rawData = [
              ...this.props.getInvestigationDetailsResponse
                .tournamentAndBattleDetails
            ];
            let detailsList = [];
            _.forEach(rawData, function(item) {
              // ------- EACH ROW -------- //
              let userId = item.userId;
              let userObject = _.find(item.playerInfo, { userId: userId });

              let opponentArray = _.filter(item.playerInfo, function(o) {
                return o.userId != userId;
              });
              console.log(opponentArray);

              let cursor = {
                id: item.id ? item.id : 'NA',
                entryFee: item.entryFee ? item.entryFee : 0,
                startDate: moment(item.startDateTime).format(
                  'DD/MM/YY hh:mm A'
                ),
                userId: item.userId,
                userJson:
                  userObject && userObject.userJson
                    ? userObject.userJson.replace(/[,]/g, ';')
                    : 'NA',
                opponent1Id:
                  opponentArray && opponentArray[0] && opponentArray[0].userId
                    ? opponentArray[0].userId
                    : 'NA',
                opponent1Json:
                  opponentArray && opponentArray[0] && opponentArray[0].userJson
                    ? opponentArray[0].userJson.replace(/[,]/g, ';')
                    : 'NA',
                opponent2Id:
                  opponentArray && opponentArray[1] && opponentArray[1].userId
                    ? opponentArray[1].userId
                    : 'NA',
                opponent2Json:
                  opponentArray && opponentArray[1] && opponentArray[1].userJson
                    ? opponentArray[1].userJson.replace(/[,]/g, ';')
                    : 'NA',
                opponent3Id:
                  opponentArray && opponentArray[2] && opponentArray[2].userId
                    ? opponentArray[2].userId
                    : 'NA',
                opponent3Json:
                  opponentArray && opponentArray[2] && opponentArray[2].userJson
                    ? opponentArray[2].userJson.replace(/[,]/g, ';')
                    : 'NA',
                opponent4Id:
                  opponentArray && opponentArray[3] && opponentArray[3].userId
                    ? opponentArray[3].userId
                    : 'NA',
                opponent4Json:
                  opponentArray && opponentArray[3] && opponentArray[3].userJson
                    ? opponentArray[3].userJson.replace(/[,]/g, ';')
                    : 'NA',
                opponent5Id:
                  opponentArray && opponentArray[4] && opponentArray[4].userId
                    ? opponentArray[4].userId
                    : 'NA',
                opponent5Json:
                  opponentArray && opponentArray[4] && opponentArray[4].userJson
                    ? opponentArray[4].userJson.replace(/[,]/g, ';')
                    : 'NA',
                errorMessage: item.errorMessage ? item.errorMessage : 'NA'
              };
              detailsList.push(cursor);

              // ------- EACH ROW -------- //
            });
            this.setState({ detailsList, showTable: true });
          } else {
            message.info('No records found');
          }
        });
        // getInvestigationDetails
      }
    });
  }

  openModal(data) {
    this.setState({
      modalContent: data,
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      modalContent: '',
      showModal: false
    });
  }

  render() {
    const columns = [
      {
        title: 'Id',
        key: 'id',
        render: (text, record) => <span>{record.id}</span>
      },
      {
        title: 'User Id & JSON',
        key: 'userId',
        render: (text, record) => (
          <span>
            {record.errorMessage != 'NA' ? record.errorMessage : record.userId}
            <Button
              size="small"
              style={{ margin: '2px' }}
              onClick={() => this.openModal(record.userJson)}
            >
              Details
            </Button>
          </span>
        )
      },
      {
        title: 'Opponent1 Details',
        key: 'opponent1',
        render: (text, record) => (
          <span>
            {record.opponent1Id}
            <Button
              size="small"
              style={{ margin: '2px' }}
              onClick={() => this.openModal(record.opponent1Json)}
            >
              Details
            </Button>
          </span>
        )
      },
      {
        title: 'Opponent2 Details',
        key: 'opponent2',
        render: (text, record) => (
          <span>
            {record.opponent2Id}
            <Button
              size="small"
              style={{ margin: '2px' }}
              onClick={() => this.openModal(record.opponent2Json)}
            >
              Details
            </Button>
          </span>
        )
      },
      {
        title: 'Opponent3 Details',
        key: 'opponent3',
        render: (text, record) => (
          <span>
            {record.opponent3Id}
            <Button
              size="small"
              style={{ margin: '2px' }}
              onClick={() => this.openModal(record.opponent3Json)}
            >
              Details
            </Button>
          </span>
        )
      },
      {
        title: 'Opponent4 Details',
        key: 'opponent4',
        render: (text, record) => (
          <span>
            {record.opponent4Id}
            <Button
              size="small"
              style={{ margin: '2px' }}
              onClick={() => this.openModal(record.opponent4Json)}
            >
              Details
            </Button>
          </span>
        )
      },
      {
        title: 'Opponent5 Details',
        key: 'opponent5',
        render: (text, record) => (
          <span>
            {record.opponent5Id}
            <Button
              size="small"
              style={{ margin: '2px' }}
              onClick={() => this.openModal(record.opponent5Json)}
            >
              Details
            </Button>
          </span>
        )
      },
      {
        title: 'Entry Fee',
        dataIndex: 'entryFee',
        key: 'entryFee'
      },
      {
        title: 'Start Date/Time',
        dataIndex: 'startDate',
        key: 'startDate'
      }
    ];

    const inputCsvColumns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
      }
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      type: isFieldTouched('type') && getFieldError('type'),
      userId: isFieldTouched('userId') && getFieldError('userId'),
      id: isFieldTouched('id') && getFieldError('id')
    };
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card
            title="Fraud Investigation Team"
            extra={
              this.state.csvSectionOnly && (
                <Button
                  type="primary"
                  onClick={() =>
                    this.setState({
                      csvSectionOnly: false
                    })
                  }
                >
                  Show
                </Button>
              )
            }
          >
            {!this.state.csvSectionOnly && (
              <>
                <FormItem {...formItemLayout} label={'Type'}>
                  {getFieldDecorator('type', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false
                      }
                    ],
                    initialValue: 'Tournament'
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={'Tournament'}>
                        Tournament
                      </Radio.Button>
                      <Radio.Button value={'Battle'}>Battle</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.userId ? 'error' : ''}
                  help={errors.userId || ''}
                  {...formItemLayout}
                  label={<span>User Id</span>}
                >
                  {getFieldDecorator('userId', {
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field',
                        whitespace: true,
                        type: 'number'
                      }
                    ]
                  })(<InputNumber style={{ width: '50%' }} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.id ? 'error' : ''}
                  help={errors.id || ''}
                  {...formItemLayout}
                  label={<span>Id</span>}
                >
                  {getFieldDecorator('id', {
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field',
                        whitespace: true
                      }
                    ]
                  })(<Input style={{ width: '70%' }} />)}
                </FormItem>
                <Row type="flex" justify="center">
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={hasErrors(getFieldsError())}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Form>
        <Divider type="horizontal" />
        <Card style={{ margin: '20px' }}>
          <CSVReader
            label="Upload file"
            onFileLoaded={e => this.handleFileUpload(e)}
          />
          {this.state.showInputTable && (
            <Card
              title="Input file details"
              style={{ margin: '20px' }}
              extra={
                <Button type="primary" onClick={() => this.fetchDetails()}>
                  Submit Request
                </Button>
              }
            >
              <Table
                rowKey="userId"
                bordered
                pagination={false}
                dataSource={this.state.inputCsvData}
                columns={inputCsvColumns}
              />
            </Card>
          )}
        </Card>
        {this.state.showTable && (
          <Card
            style={{ margin: '20px' }}
            title="Details"
            extra={
              <CSVLink
                data={this.state.detailsList}
                enclosingCharacter={`"`}
                headers={Headers}
                separator={'\t'}
                filename={'Investigation.tsv'}
              >
                <Button>Download</Button>
              </CSVLink>
            }
          >
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.detailsList}
              columns={columns}
            />
          </Card>
        )}
        <Modal
          title={'JSON Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeModal()}
          onCancel={() => this.closeModal()}
          visible={this.state.showModal}
          footer={[<Button onClick={() => this.closeModal()}>Close</Button>]}
        >
          <Card>{this.state.modalContent}</Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getInvestigationDetailsResponse: state.fraud.getInvestigationDetailsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fraudActions }, dispatch)
  };
}

const FraudInvestigationForm = Form.create()(FraudInvestigation);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FraudInvestigationForm);
