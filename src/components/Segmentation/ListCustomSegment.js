import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as segmentationActions from '../../actions/segmentationActions';
import {
  Card,
  Table,
  Button,
  Modal,
  Row,
  Col,
  message,
  Divider,
  Badge,
  Popconfirm,
  Input,
  Tag
} from 'antd';
import moment from 'moment';

const UploadStatus = [
  'FILE_NOT_UPLOADED',
  'FILE_UPLOADED',
  'FILE_UPLOAD_FAILED',
  'FILE_UPLOAD_NOT_SUPPORTED'
];

class ListCustomSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      showModal: false,
      selectedSegment: {},
      tableData: [],
      showInformationModal: false,
      showUserSegmentsModal: false,
      userSegmentsList: []
    };
    this.fetchList = this.fetchList.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.toggleState = this.toggleState.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchList();
  }

  fetchList() {
    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment
      ) {
        this.setState(
          {
            tableData:
              this.props.getCustomSegmentListResponse.segment.length > 0
                ? [...this.props.getCustomSegmentListResponse.segment]
                : []
          },
          () => this.setState({ showTable: true })
        );
      } else {
        message.info('No records found');
        this.setState({ showTable: true, tableData: [] });
      }
    });
  }

  showDetails(record) {
    this.setState({ selectedSegment: { ...record }, showModal: true });
  }

  toggleState(record, newStatus) {
    let data = { ...record };
    data['startTime'] = moment(record.startTime, 'x').unix() * 1000;
    data['endTime'] = moment(record.endTime, 'x').unix() * 1000;
    data['isActive'] = newStatus;
    this.props.actions.updateCustomSegment(data).then(() => {
      if (
        this.props.updateCustomSegmentResponse &&
        this.props.updateCustomSegmentResponse.error
      ) {
        if (this.props.updateCustomSegmentResponse.error.message) {
          message.error(this.props.updateCustomSegmentResponse.error.message);
          return;
        } else {
          message.error('Could not update the segment');
          return;
        }
      } else {
        message.success('Updated Successfully', 1).then(() => this.fetchList());
      }
    });
  }

  editUploadSegment(record, actionType) {
    this.props.actions.editUploadCustomSegment(record, actionType);
    this.props.history.push('create');
  }

  getUserCount(record) {
    let data = {
      segmentId: record.segmentId
    };
    this.props.actions.getUserCountSegment(data).then(() => {
      if (this.props.getUserCountSegmentResponse) {
        let userCount = this.props.getUserCountSegmentResponse.userCount
          ? this.props.getUserCountSegmentResponse.userCount
          : 0;
        this.setState({
          selectedSegment: { ...record },
          userCount: userCount,
          showInformationModal: true
        });
      }
    });
  }

  closeInformationModal() {
    this.setState({
      showInformationModal: false,
      selectedSegment: {},
      userCount: 0
    });
  }

  deleteSegment(record) {
    let data = {
      segmentId: record.segmentId
    };
    this.props.actions.deleteCustomSegment(data).then(() => {
      if (this.props.deleteCustomSegmentResponse) {
        if (this.props.deleteCustomSegmentResponse.error) {
          message.error(
            this.props.deleteCustomSegmentResponse.error.message
              ? this.props.deleteCustomSegmentResponse.error.message
              : 'Could not delete the segment'
          );
        } else {
          message
            .success('Segment Deleted Successfully', 1.5)
            .then(() => window.location.reload());
        }
      }
    });
  }

  searchUserSegments(value) {
    let data = {
      userId: value
    };
    this.props.actions.getUserSegments(data).then(() => {
      if (this.props.getUserSegmentsResponse) {
        if (this.props.getUserSegmentsResponse.error) {
          message.error(
            this.props.getUserSegmentsResponse.error.message
              ? this.props.getUserSegmentsResponse.error.message
              : 'Could not fetch user segments'
          );
        } else {
          let userSegmentsList =
            this.props.getUserSegmentsResponse.segment &&
            this.props.getUserSegmentsResponse.segment.length > 0
              ? [...this.props.getUserSegmentsResponse.segment]
              : [];
          console.log('userSegmentsList', userSegmentsList);
          this.setState({
            userSegmentsList,
            showUserSegmentsModal: true
          });
        }
      }
    });
  }

  closeUserSegmentsModal() {
    this.setState({
      userSegmentsList: [],
      showUserSegmentsModal: false
    });
  }

  render() {
    const columns = [
      {
        title: 'Segment Id',
        key: 'segmentId',
        width: '20',
        render: (text, record) => (
          <span>
            <Badge
              count={'A'}
              status={record.isActive ? 'processing' : 'error'}
            />
            <span>{record.segmentId}</span>
          </span>
        )
      },
      {
        title: 'Segment Name',
        key: 'segmentName',
        dataIndex: 'segmentName',
        width: '10'
      },
      {
        title: 'Start Time',
        key: 'startTime',
        render: record => (
          <div
            style={{
              minWidth: '85px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            <div>{moment(record.startTime, 'x').format('YYYY-MM-DD')}</div>
            <div>{moment(record.startTime, 'x').format('HH:mm')}</div>
          </div>
        )
      },
      {
        title: 'End Time',
        key: 'endTime',
        render: record => (
          <div
            style={{
              minWidth: '85px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            <div>{moment(record.endTime, 'x').format('YYYY-MM-DD')}</div>
            <div>{moment(record.endTime, 'x').format('HH:mm')}</div>
          </div>
        )
      },
      {
        title: 'File Upload Status',
        key: 'fileUploadStatus',
        render: (text, record) => (
          <span>
            {record.fileUploadStatus
              ? UploadStatus[record.fileUploadStatus]
              : UploadStatus[0]}
          </span>
        )
      },
      {
        title: 'Modified By',
        key: 'modifiedBy',
        dataIndex: 'modifiedBy'
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <div style={{ minWidth: '150px' }}>
            <Button
              shape="circle"
              icon="info"
              size="small"
              onClick={() => this.getUserCount(record)}
              type="primary"
            />
            <Divider type="vertical" />
            <Button
              shape="circle"
              icon="edit"
              size="small"
              onClick={() => this.editUploadSegment(record, 'EDIT')}
              type="primary"
            />
            {(!record.fileUploadStatus ||
              (record.fileUploadStatus && record.fileUploadStatus !== 3)) && (
              <span>
                <Divider type="vertical" />
                <Button
                  style={{ margin: '5px' }}
                  size="small"
                  icon="upload"
                  onClick={() => this.editUploadSegment(record, 'UPLOAD')}
                />
              </span>
            )}
            <Divider type="horizontal" />
            {!record.isActive && (
              <span>
                <Button
                  size="small"
                  onClick={() => this.toggleState(record, true)}
                >
                  Activate
                </Button>
                <Divider type="vertical" />
                <Popconfirm
                  title="Are you sure ?"
                  onConfirm={() => this.deleteSegment(record)}
                >
                  <Button type="danger" size="small" icon="delete" />
                </Popconfirm>
              </span>
            )}
            {record.isActive && (
              <span>
                <Button
                  type="danger"
                  size="small"
                  onClick={() => this.toggleState(record, false)}
                >
                  Deactivate
                </Button>
              </span>
            )}
          </div>
        )
      }
    ];
    const hideModal = () => {
      this.setState({
        showModal: false
      });
    };
    return (
      <React.Fragment>
        {this.state.showTable ? (
          <Card
            title={'Custom Segment List'}
            extra={
              <Input.Search
                placeholder="Search for user segments"
                enterButton
                size="default"
                onSearch={value => this.searchUserSegments(value)}
              />
            }
          >
            <Table
              rowKey="segmentId"
              bordered
              dataSource={this.state.tableData}
              pagination={false}
              columns={columns}
              scroll={{ x: '100%' }}
            />
          </Card>
        ) : (
          ''
        )}

        <Modal
          title={'Segment Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeInformationModal()}
          onOk={() => this.closeInformationModal()}
          visible={this.state.showInformationModal}
          footer={[
            <Button key="back" onClick={() => this.closeInformationModal()}>
              Close
            </Button>
          ]}
        >
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                User Count: <strong>{this.state.userCount}</strong>
              </Col>
              <Col span={24}>
                Segment Id:{' '}
                <strong>{this.state.selectedSegment.segmentId}</strong>
              </Col>
              <Col span={24}>
                Segment Name:{' '}
                <strong>{this.state.selectedSegment.segmentName}</strong>
              </Col>
              <Col span={24}>
                Description:{' '}
                <strong>{this.state.selectedSegment.description}</strong>
              </Col>
              <Col span={24}>
                Priority:{' '}
                <strong>
                  {this.state.selectedSegment.priority
                    ? this.state.selectedSegment.priority
                    : 0}
                </strong>
              </Col>
              <Col span={24}>
                Is Active:{' '}
                <strong>
                  {this.state.selectedSegment.isActive ? 'Actice' : 'Inactive'}
                </strong>
              </Col>
              <Col span={24}>
                Start Time:{' '}
                <strong>
                  {moment(this.state.selectedSegment.startTime, 'x').format(
                    'YYYY-MM-DD HH:mm'
                  )}
                </strong>
              </Col>
              <Col span={24}>
                End Time:{' '}
                <strong>
                  {moment(this.state.selectedSegment.endTime, 'x').format(
                    'YYYY-MM-DD HH:mm'
                  )}
                </strong>
              </Col>
              <Col span={24}>
                Modified By:{' '}
                <strong>{this.state.selectedSegment.modifiedBy}</strong>
              </Col>
              <Col span={24}>
                File Upload Status:{' '}
                <strong>
                  {this.state.selectedSegment.fileUploadStatus
                    ? UploadStatus[this.state.selectedSegment.fileUploadStatus]
                    : UploadStatus[0]}
                </strong>
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title={'User Segment List'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeUserSegmentsModal()}
          onOk={() => this.closeUserSegmentsModal()}
          visible={this.state.showUserSegmentsModal}
          footer={[
            <Button key="back" onClick={() => this.closeUserSegmentsModal()}>
              Close
            </Button>
          ]}
        >
          <Card bordered={false}>
            <Row>
              {this.state.userSegmentsList &&
                this.state.userSegmentsList.length > 0 &&
                this.state.userSegmentsList.map(segment => (
                  <Tag key={segment} color="#108ee9">
                    {segment}
                  </Tag>
                ))}
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCustomSegmentListResponse:
      state.segmentation.getCustomSegmentListResponse,
    deleteCustomSegmentResponse: state.segmentation.deleteCustomSegmentResponse,
    getUserCountSegmentResponse: state.segmentation.getUserCountSegmentResponse,
    updateCustomSegmentResponse: state.segmentation.updateCustomSegmentResponse,
    getUserSegmentsResponse: state.segmentation.getUserSegmentsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...segmentationActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCustomSegment);
