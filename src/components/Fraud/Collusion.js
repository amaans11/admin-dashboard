import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import {
  DatePicker,
  Select,
  Button,
  message,
  Pagination,
  Row,
  Col,
  Table,
  Modal,
  Radio,
  Input
} from 'antd';
import * as fraudActions from '../../actions/fraudActions';

const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class Collusion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startLimit: 1,
      endLimit: 10,
      startTime: '',
      endTime: '',
      category: 'Games',
      actionTaken: false,
      tableData: [],
      totalCount: 1,
      recordFetched: false,
      updateStatusModal: false,
      selectedRecord: {},
      newStatus: '',
      description: '',
      pageNumber: 1,
      csvCollusionData: []
    };
  }

  fetchAllData = () => {
    const {
      category,
      startTime,
      endTime,
      actionTaken,
      totalCount
    } = this.state;

    const data = {
      category,
      actionTaken,
      startTime,
      endTime,
      startLimit: 1,
      endLimit: totalCount
    };

    this.props.actions.getCollusionData(data).then(() => {
      if (
        this.props.collusionData.users &&
        this.props.collusionData.users.length > 0
      ) {
        let users = this.props.collusionData.users;

        let userData = users.map(el => ({
          ...el,
          ['createdOn']: moment(el.createdOn).format('DD-MM-YYYY hh:mm:ss A'),
          ['modifiedOn']: moment(el.modifiedOn).format('DD-MM-YYYY hh:mm:ss A'),
          ['actionTaken']: el.actionTaken || 'NA',
          ['actionTakenBy']: el.actionTakenBy || 'NA'
        }));
        this.setState({
          csvCollusionData: userData
        });
      } else {
        this.setState({
          csvCollusionData: []
        });
      }
    });
  };

  fetchData = (startLimit, endLimit) => {
    const { category, startTime, endTime, actionTaken } = this.state;

    const data = {
      category,
      actionTaken,
      startTime,
      endTime,
      startLimit,
      endLimit
    };
    if (!startTime || !endTime) {
      message.error('Please select time!');
      return;
    }
    this.props.actions.getCollusionData(data).then(() => {
      if (this.props.collusionData.error) {
        message.error(this.props.collusionData.error.message);
      } else {
        if (
          this.props.collusionData.users &&
          this.props.collusionData.users.length > 0
        ) {
          this.setState({
            tableData: this.props.collusionData.users,
            totalCount: this.props.collusionData.totalUserCount,
            recordFetched: true
          });
          message.success('Records Fetched Successfully!!');
        } else {
          this.setState({
            tableData: [],
            totalCount: 9,
            recordFetched: false
          });
          message.success('No Records Found');
        }
      }
    });
  };
  handleSubmit = () => {
    const { startLimit, endLimit } = this.state;

    this.fetchData(startLimit, endLimit);

    setTimeout(this.fetchAllData, 1000);
  };
  updateStatus = () => {
    const { newStatus, selectedRecord, description, category } = this.state;
    const email = get(this.props.currentUser, 'email', '');

    if (!newStatus || (newStatus == 'BLOCKED' && !description)) {
      message.error('Missing inputs!');
      return;
    }
    const data = {
      userIdOne: selectedRecord.userIdOne,
      userIdTwo: selectedRecord.userIdTwo,
      actionTaken: newStatus,
      actionTakenBy: email,
      description: description,
      category: category
    };
    this.props.actions.updateCollusionData(data).then(() => {
      if (this.props.updateCollusion.error) {
        message.error(this.props.updateCollusion.error.message);
      } else {
        this.setState(
          {
            updateStatusModal: false,
            newStatus: '',
            selectedRecord: {},
            description: ''
          },
          () => {
            message.success('Status Updated successfully!');
            this.fetchData(1, 100);
          }
        );
      }
    });
  };

  onChangePage = page => {
    this.setState(
      {
        pageNumber: page,
        startLimit: page * 10 - 9,
        endLimit: page * 10
      },
      () => {
        this.fetchData(page * 10 - 9, page * 10);
      }
    );
  };

  closeModal = () => {
    this.setState({
      updateStatusModal: false,
      newStatus: '',
      selectedRecord: {},
      description: ''
    });
  };
  getColumns() {
    const columns = [
      {
        title: 'UserId One',
        key: 'userIdOne',
        dataIndex: 'userIdOne'
      },
      {
        title: 'UserId Two',
        key: 'userIdTwo',
        dataIndex: 'userIdTwo'
      },
      {
        title: 'Timestamp',
        key: 'createdOn',
        dataIndex: 'createdOn',
        render: (text, record) => (
          <div>{moment(record.createdOn).format('DD-MM-YYYY hh:mm:ss A')}</div>
        )
      },
      {
        title: 'Game Play Count',
        key: 'gamePlay',
        dataIndex: 'gamePlay'
      },
      {
        title: 'Flag Count',
        key: 'count',
        dataIndex: 'count',
        render: (text, record) => <div>{record.count ? record.count : 0}</div>
      },

      {
        title: 'Total Wins(UserId 1)',
        key: 'userOneWins',
        dataIndex: 'userOneWins'
      },
      {
        title: 'Total Wins(UserId 2)',
        key: 'userTwoWins',
        dataIndex: 'userTwoWins'
      },
      {
        title: 'Total Winnings(UserId 1)',
        key: 'overallWinningsUserOne',
        dataIndex: 'overallWinningsUserOne'
      },
      {
        title: 'Total Winnings(UserId 2)',
        key: 'overallWinningsUserTwo',
        dataIndex: 'overallWinningsUserTwo'
      },
      {
        title: 'Action Taken',
        key: 'actionTaken',
        dataIndex: 'actionTaken',
        render: (text, record) => (
          <div>{record.actionTaken ? record.actionTaken : 'NA'}</div>
        )
      },
      {
        title: 'Action Taken By',
        key: 'actionTakenBy',
        dataIndex: 'actionTakenBy',
        render: (text, record) => (
          <div>{record.actionTakenBy ? record.actionTakenBy : 'NA'}</div>
        )
      },
      {
        title: 'Modified On',
        key: 'modifiedOn',
        dataIndex: 'modifiedOn',
        render: (text, record) => (
          <div>{moment(record.modifiedOn).format('DD-MM-YYYY hh:mm:ss A')}</div>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <React.Fragment>
            {!this.state.actionTaken && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  this.setState({
                    updateStatusModal: true,
                    selectedRecord: record
                  });
                }}
              >
                <small>Update Status</small>
              </Button>
            )}
          </React.Fragment>
        )
      }
    ];

    return columns;
  }

  render() {
    const {
      category,
      actionTaken,
      tableData,
      endLimit,
      totalCount,
      recordFetched,
      updateStatusModal,
      selectedRecord,
      newStatus,
      description,
      csvCollusionData
    } = this.state;
    const columns = this.getColumns();

    const headers = [
      { label: 'User Id One', key: 'userIdOne' },
      { label: 'User Id two', key: 'userIdTwo' },
      { label: 'Timestamp', key: 'createdOn' },
      { label: 'Game Play Count', key: 'gamePlay' },
      { label: 'Flag Count', key: 'count' },
      { label: 'Total Wins (User Id 1)', key: 'userOneWins' },
      { label: 'Total Wins (User Id 2)', key: 'userTwoWins' },
      { label: 'Total Winnings (User Id 1)', key: 'overallWinningsUserOne' },
      { label: 'Total Winnings (User Id 2)', key: 'overallWinningsUserTwo' },
      { label: 'Action Taken', key: 'actionTaken' },
      { label: 'Action Taken By', key: 'actionTakenBy' },
      { label: 'Modified On', key: 'modifiedOn' }
    ];

    return (
      <React.Fragment>
        <Row style={{ margin: 20 }}>
          <Col item xs={4}>
            <label style={{ marginLeft: 5 }}>Category : </label>

            <Select
              style={{ width: 160 }}
              onChange={value => {
                this.setState({ category: value });
              }}
              value={category}
              defaultValue="all"
            >
              <Option value="Games">GAMES</Option>
              <Option value="Rummy">RUMMY</Option>
              <Option value="Poker">POKER</Option>
            </Select>
          </Col>
          <Col item xs={5}>
            <label style={{ marginLeft: 5 }}>Start Time : </label>
            <DatePicker
              allowClear="true"
              showTime={{ format: 'hh:mm A', use12Hours: true }}
              format="YYYY-MM-DD hh:mm A"
              onChange={value => {
                this.setState({
                  startTime: value.format('x').substring(0, value.valueOf())
                });
              }}
            />
          </Col>
          <Col item xs={5}>
            <label style={{ marginLeft: 5 }}>End Time : </label>
            <DatePicker
              allowClear="true"
              showTime={{ format: 'hh:mm A', use12Hours: true }}
              format="YYYY-MM-DD hh:mm A"
              onChange={value => {
                this.setState({
                  endTime: value.format('x').substring(0, value.valueOf())
                });
              }}
            />
          </Col>
          <Col item xs={3}>
            <label style={{ marginLeft: 5 }}>Action Taken : </label>
            <RadioGroup
              onChange={e => {
                this.setState({ actionTaken: e.target.value });
              }}
              value={actionTaken}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </RadioGroup>
          </Col>
          <Col item xs={2}>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              style={{ marginTop: 20 }}
            >
              Submit
            </Button>
          </Col>
          {recordFetched && (
            <Col item xs={2}>
              <CSVLink
                data={csvCollusionData}
                headers={headers}
                filename={'collusion-data'}
              >
                <Button
                  type="primary"
                  // onClick= {this.fetchAllData}
                  style={{ marginTop: 20, marginLeft: 20 }}
                >
                  Download
                </Button>
              </CSVLink>
            </Col>
          )}
        </Row>
        {recordFetched && (
          <React.Fragment>
            <Table
              bordered
              dataSource={tableData}
              columns={columns}
              pagination={false}
              scroll={{ x: '100%' }}
              style={{ margin: 20 }}
            />
            <Pagination
              current={this.state.pageNumber}
              defaultCurrent={this.state.pageNumber}
              onChange={page => this.onChangePage(page)}
              total={totalCount ? totalCount : 9}
              pageSize="20"
            />
          </React.Fragment>
        )}
        <Modal
          title="Update Status"
          closable={true}
          maskClosable={true}
          width={800}
          onOk={this.updateStatus}
          onCancel={this.closeModal}
          visible={this.state.updateStatusModal}
        >
          <Row style={{ marginBottom: 20 }}>
            <Col span={4}>Select Status</Col>
            <Col span={12}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select Status"
                onSelect={value => {
                  this.setState({ newStatus: value });
                }}
                value={newStatus}
              >
                <Option value="BLOCKED">Blocked</Option>
                <Option value="CHECKED">Checked</Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginBottom: 20 }}>
            <Col span={4}>Description</Col>
            <Col span={12}>
              <TextArea
                rows={3}
                value={description}
                onChange={e => {
                  this.setState({ description: e.target.value });
                }}
              />
            </Col>
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    collusionData: state.fraud.collusionData,
    updateCollusion: state.fraud.updateCollusion,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fraudActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collusion);
