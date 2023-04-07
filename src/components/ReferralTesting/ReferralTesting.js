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
  Tag,
  Table,
  Radio,
  Icon,
  Popconfirm
} from 'antd';

import * as userProfileActions from '../../actions/UserProfileActions';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class ReferralTesting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getRequestType: null,
      deviceDetails: [],
      showDeleteModal: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ deviceDetails: [] }, () => {
          let data = {
            searchCriteria: values.searchCriteria,
            searchFor: values.searchFor
          };
          this.props.actions.getDeviceDetails(data).then(() => {
            if (
              this.props.getDeviceDetailsResponse &&
              this.props.getDeviceDetailsResponse.devices &&
              this.props.getDeviceDetailsResponse.devices.length > 0
            ) {
              this.setState({
                deviceDetails: [...this.props.getDeviceDetailsResponse.devices]
              });
            } else {
              message.error('No devices found');
            }
          });
        });
      }
    });
  }

  deleteRecord(record, type) {
    let data = {};
    let searchCriteria = type;
    switch (searchCriteria) {
      case 'USER_ID':
        if (!record.userId) {
          message.error(
            "Can't delete using userId when userId is not present "
          );
          return;
        }
        data = {
          searchCriteria: searchCriteria,
          searchFor: record.userId
        };
        break;
      case 'IMEI':
        if (!record.imei1) {
          message.error("Can't delete using IMEI when IMEI is not present ");
          return;
        }
        data = {
          searchCriteria: searchCriteria,
          searchFor: record.imei1
        };
        break;
      case 'DEVICE_ID':
        if (!record.deviceId) {
          message.error(
            "Can't delete using deviceId when deviceId is not present "
          );
          return;
        }
        data = {
          searchCriteria: searchCriteria,
          searchFor: record.deviceId
        };
        break;
      case 'IOVATION_ID':
        if (!record.iovationId) {
          message.error(
            "Can't delete using iovationId when iovationId is not present "
          );
          return;
        }
        if (record.iovationId == '0') {
          message.error("Can't delete for iovationId 0 ");
          return;
        }
        data = {
          searchCriteria: searchCriteria,
          searchFor: record.iovationId
        };
        break;
      case 'MOBILE_NUMBER':
        if (!record.mobileNumber) {
          message.error(
            "Can't delete using mobileNumber when mobileNumber is not present "
          );
          return;
        }
        data = {
          searchCriteria: searchCriteria,
          searchFor: record.mobileNumber
        };
        break;
      default:
        break;
    }
    this.props.actions.deleteDeviceDetails(data).then(() => {
      if (
        this.props.deleteDeviceDetailsResponse &&
        this.props.deleteDeviceDetailsResponse.error
      ) {
        message.error(
          this.props.deleteDeviceDetailsResponse.error.message
            ? this.props.deleteDeviceDetailsResponse.error.message
            : 'Could not delete record'
        );
      } else {
        message
          .success(
            this.props.deleteDeviceDetailsResponse.numberOfDevicesDeleted
              ? 'Successfully deleted the records: ' +
                  this.props.deleteDeviceDetailsResponse.numberOfDevicesDeleted
              : 'Successfully deleted the records: 0',
            2
          )
          .then(() => this.setState({ deviceDetails: [] }));
      }
    });
  }

  render() {
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

    const columns = [
      {
        title: 'User Id',
        key: 'userId',
        render: (text, record) => (
          <span>
            {record.userId ? record.userId : 'N/A'}
            <Popconfirm
              title={'Sure to delete using user id'}
              onConfirm={() => this.deleteRecord(record, 'USER_ID')}
            >
              <Icon
                style={{ color: 'red', marginLeft: '10px' }}
                type="delete"
              />
            </Popconfirm>
          </span>
        )
      },
      {
        title: 'Mobile Number',
        key: 'mobileNumber',
        render: (text, record) => (
          <span>
            {record.mobileNumber ? record.mobileNumber : 'N/A'}
            <Popconfirm
              title={'Sure to delete using mobile number'}
              onConfirm={() => this.deleteRecord(record, 'MOBILE_NUMBER')}
            >
              <Icon
                style={{ color: 'red', marginLeft: '10px' }}
                type="delete"
              />
            </Popconfirm>
          </span>
        )
      },
      {
        title: 'IMEI',
        key: 'IMEI',
        render: (text, record) => (
          <span>
            {record.imei1 ? record.imei1 : 'N/A'}
            <Popconfirm
              title={'Sure to delete using IMEI'}
              onConfirm={() => this.deleteRecord(record, 'IMEI')}
            >
              <Icon
                style={{ color: 'red', marginLeft: '10px' }}
                type="delete"
              />
            </Popconfirm>
          </span>
        )
      },
      {
        title: 'Device Id',
        key: 'deviceId',
        render: (text, record) => (
          <span>
            {record.deviceId ? record.deviceId : 'N/A'}
            <Popconfirm
              title={'Sure to delete using device id'}
              onConfirm={() => this.deleteRecord(record, 'DEVICE_ID')}
            >
              <Icon
                style={{ color: 'red', marginLeft: '10px' }}
                type="delete"
              />
            </Popconfirm>
          </span>
        )
      },
      {
        title: 'Iovation Id',
        key: 'iovationId',
        render: (text, record) => (
          <span>
            {record.iovationId ? record.iovationId : 'N/A'}
            <Popconfirm
              title={'Sure to delete using iovation id'}
              onConfirm={() => this.deleteRecord(record, 'IOVATION_ID')}
            >
              <Icon
                style={{ color: 'red', marginLeft: '10px' }}
                type="delete"
              />
            </Popconfirm>
          </span>
        )
      }
    ];

    const errors = {
      searchFor: isFieldTouched('searchFor') && getFieldError('searchFor')
    };
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Seach for Device Ids">
            <FormItem {...formItemLayout} label={'Search Criteria'}>
              {getFieldDecorator('searchCriteria', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: 'USER_ID'
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={'USER_ID'}>User Id</Radio.Button>
                  <Radio.Button value={'IMEI'}>IMEI</Radio.Button>
                  <Radio.Button value={'DEVICE_ID'}>Device Id</Radio.Button>
                  <Radio.Button value={'IOVATION_ID'}>Iovation Id</Radio.Button>
                  <Radio.Button value={'MOBILE_NUMBER'}>
                    Mobile Number
                  </Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.searchFor ? 'error' : ''}
              help={errors.searchFor || ''}
              {...formItemLayout}
              label={<span>Search Value</span>}
            >
              {getFieldDecorator('searchFor', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
              <Tag style={{ color: '#4287f5' }}>
                Mobile number should include country code
              </Tag>
            </FormItem>
            {this.state.deviceDetails.length > 0 && (
              <Table
                rowKey="id"
                bordered
                pagination={false}
                dataSource={this.state.deviceDetails}
                columns={columns}
              />
            )}

            <Row style={{ marginTop: '20px' }} type="flex" justify="center">
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
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getDeviceDetailsResponse: state.userProfile.getDeviceDetailsResponse,
    deleteDeviceDetailsResponse: state.userProfile.deleteDeviceDetailsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...userProfileActions }, dispatch)
  };
}

const ReferralTestingForm = Form.create()(ReferralTesting);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralTestingForm);
