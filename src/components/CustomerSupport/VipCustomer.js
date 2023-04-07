import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Table, Button, Modal, Select, Row, Col, Tag } from 'antd';
import moment from 'moment';
import * as crmActions from '../../actions/crmActions';
import { message } from 'antd';
import { result } from 'lodash';

const timeSlots = ['10am-1pm', '1pm-5pm', '5pm-8pm', '8pm-12am'];
const dateFilter = [
  {
    label: 'Today',
    value: moment().format('YYYY-MM-DD')
  },
  {
    label: 'Tomorrow',
    value: moment()
      .add(1, 'days')
      .format('YYYY-MM-DD')
  }
];
const { Option } = Select;
class VipCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callbackDetails: [],
      isRefundSupervisor: false,
      isModal: false,
      selectedCallback: {},
      callbackType: '',
      agentList: [],
      assignee: '',
      finalResponse: '',
      isFilter: false,
      selectedDate: '',
      selectedTimeSlot: ''
    };
  }
  componentDidMount = () => {
    const roles = this.props.currentUser.user_role;
    let isRefundSupervisor = false;
    if (roles.includes('REFUND_SUPERVISOR')) {
      isRefundSupervisor = true;
    }
    this.setState(
      {
        isRefundSupervisor: isRefundSupervisor
      },
      () => {
        this.fetchDetails();
      }
    );
  };
  fetchDetails = () => {
    let startDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let endDate = moment()
      .add(2, 'days')
      .format('YYYY-MM-DD');

    const data = {
      fromDate: startDate,
      toDate: endDate
    };
    this.props.actions.getScheduledCallbacks(data).then(() => {
      if (
        this.props.scheduledCallbacks &&
        this.props.scheduledCallbacks.error
      ) {
        message.error(this.props.scheduledCallbacks.error);
      } else {
        this.setState(
          {
            callbackDetails: this.props.scheduledCallbacks.callbackList
          },
          () => {
            message.success('VIP details fetched successfully!');
          }
        );
      }
    });
  };
  updateCallBack = (record, key) => {
    this.setState(
      {
        isModal: true,
        selectedCallback: record,
        callbackType: key
      },
      () => {
        this.props.actions.getVipAgentList().then(() => {
          if (this.props.agentList && this.props.agentList.length > 0) {
            this.setState({ agentList: this.props.agentList });
          } else {
            this.setState({ agentList: [] });
          }
        });
      }
    );
  };
  handleTimeSlotChange = value => {
    const { callbackDetails, selectedDate, selectedTimeSlot } = this.state;
    let result = [];
    if (callbackDetails.length > 0) {
      callbackDetails.map(detail => {
        if (!selectedDate) {
          if (detail.selectedSlot == value) {
            result.push(detail);
          }
        } else {
          if (detail.selectedSlot == value && detail.date === selectedDate) {
            result.push(detail);
          }
        }
      });
    }
    this.setState({
      filteredCallbackDetails: result,
      isFilter: true,
      selectedTimeSlot: value
    });
  };
  handleDateChange = value => {
    const { callbackDetails, selectedDate, selectedTimeSlot } = this.state;
    let result = [];
    if (callbackDetails.length > 0) {
      callbackDetails.map(detail => {
        if (!selectedTimeSlot) {
          if (detail.date == value) {
            result.push(detail);
          }
        } else {
          if (
            detail.date == value &&
            detail.selectedSlot === selectedTimeSlot
          ) {
            result.push(detail);
          }
        }
      });
    }
    this.setState({
      filteredCallbackDetails: result,
      isFilter: true,
      selectedDate: value
    });
  };
  cancelHandler = () => {
    this.setState({
      isModal: false,
      assignee: '',
      finalResponse: ''
    });
  };
  submitCallbackDetails = () => {
    const { selectedCallback, assignee, finalResponse } = this.state;
    const data = {
      id: selectedCallback.id.low,
      assignedTo: assignee,
      response: finalResponse
    };

    if (!assignee && !finalResponse) {
      message.error('Invalid inputs!');
    } else {
      this.props.actions.updateCallbackDetails(data).then(() => {
        if (this.props.updateCallback && this.props.updateCallback.error) {
          this.setState(
            {
              isModal: false
            },
            () => {
              message.error(this.props.updateCallBack.error);
            }
          );
        } else {
          this.setState(
            {
              isModal: false,
              assignee: '',
              finalResponse: ''
            },
            () => {
              this.fetchDetails();
            }
          );
        }
      });
    }
  };
  getColumns = () => {
    const { isRefundSupervisor } = this.state;
    const columns = [
      {
        title: 'User Id',
        key: 'userId',
        dataIndex: 'userId'
      },
      {
        title: 'Mobile Number',
        key: 'mobileNumber',
        dataIndex: 'mobileNumber'
      },
      {
        title: 'Date',
        key: 'date',
        render: (text, record) => (
          <div>{moment(record.date, 'YYYY-MM-DD').format('DD MMM YYYY')}</div>
        )
      },
      {
        title: 'Status',
        key: 'status',
        render: (text, record) => (
          <div>
            {record.status == '1' ? (
              <Tag color="#108ee9">active</Tag>
            ) : (
              <Tag color="#f50">inactive</Tag>
            )}
          </div>
        )
      },
      {
        title: 'Selected Slot',
        key: 'selectedSlot',
        dataIndex: 'selectedSlot'
      },
      {
        title: 'Assigned To',
        key: 'assignedTo',
        render: (text, record) => (record.assignedTo ? record.assignedTo : 'NA')
      },
      {
        title: 'Response',
        key: 'response',
        render: (text, record) => (record.response ? record.response : 'NA')
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <React.Fragment>
            {isRefundSupervisor && !record.assignedTo && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  this.updateCallBack(record, 'assign');
                }}
                style={{ marginBottom: 10 }}
              >
                Assign Agent
              </Button>
            )}
            {record.assignedTo && !record.response && (
              <Button
                size="small"
                onClick={() => {
                  this.updateCallBack(record, 'response');
                }}
              >
                Submit Response
              </Button>
            )}
          </React.Fragment>
        )
      }
    ];
    return columns;
  };
  handleChange = value => {
    const { callbackType } = this.state;
    if (callbackType === 'assign') {
      this.setState({
        assignee: value
      });
    } else {
      this.setState({
        finalResponse: value
      });
    }
  };
  getModalContent = () => {
    const {
      selectedCallback,
      agentList,
      callbackType,
      assignee,
      finalResponse
    } = this.state;
    const responses = [
      'First call completed',
      'Second call completed',
      'Call couldn’t be connected'
    ];
    const options = callbackType === 'assign' ? agentList : responses;
    return (
      <React.Fragment>
        <Row style={{ marginBottom: 5 }}>
          <Col span={10}>User Id:</Col>
          <Col span={10}>{selectedCallback.userId}</Col>
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <Col span={10}>Date</Col>
          <Col span={10}>
            {moment(selectedCallback.date).format('DD MMM YYYY')}
          </Col>
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <Col span={10}>Selected Slot:</Col>
          <Col span={10}>{selectedCallback.selectedSlot}</Col>
        </Row>
        <Row>
          <Col span={10}>
            {callbackType === 'assign' ? 'Assigned To' : 'Final Response'}
          </Col>
          <Col span={10}>
            <Select
              style={{ width: 200 }}
              onChange={this.handleChange}
              value={callbackType === 'assign' ? assignee : finalResponse}
            >
              {options.map(option => (
                <Option value={option}>{option}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </React.Fragment>
    );
  };
  render() {
    const {
      callbackDetails,
      isModal,
      callbackType,
      isFilter,
      filteredCallbackDetails
    } = this.state;
    const columns = this.getColumns();
    const modalContent = this.getModalContent();
    return (
      <React.Fragment>
        <Card title="VIP Details">
          <Row style={{ marginBottom: 10 }}>
            <Col span={8}></Col>
            <Col span={2}>Date:</Col>
            <Col sm={6}>
              <Select
                style={{ width: 200 }}
                onChange={this.handleDateChange}
                value={this.state.selectedDate}
              >
                {dateFilter.map(option => (
                  <Option value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Col>
            <Col span={2}>Time Slot:</Col>
            <Col sm={6}>
              <Select
                style={{ width: 200 }}
                onChange={this.handleTimeSlotChange}
                value={this.state.selectedTimeSlot}
              >
                {timeSlots.map(option => (
                  <Option value={option}>{option}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Table
            bordered
            dataSource={isFilter ? filteredCallbackDetails : callbackDetails}
            columns={columns}
            scroll={{ x: '100%' }}
          />
        </Card>
        <Modal
          title={callbackType === 'assign' ? 'Assign Agent' : 'Submit Response'}
          closable={true}
          maskClosable={true}
          width={500}
          onOk={this.submitCallbackDetails}
          onCancel={this.cancelHandler}
          visible={isModal}
        >
          {modalContent}
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    scheduledCallbacks: state.crm.scheduledCallbacks,
    currentUser: state.auth.currentUser,
    updateCallback: state.crm.updateCallback,
    agentList: state.crm.agentList
  };
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...crmActions }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VipCustomer);
