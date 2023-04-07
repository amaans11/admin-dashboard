import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as segmentationActions from '../../actions/segmentationActions';
import _ from 'lodash';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { Card, Form, message, Button, Row, Col, Modal } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 850,
  margin: 'auto'
});

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const UploadStatus = [
  'FILE_NOT_UPLOADED',
  'FILE_UPLOADED',
  'FILE_UPLOAD_FAILED',
  'FILE_UPLOAD_NOT_SUPPORTED'
];
class CustomSegmentOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchList: [],
      contestList: [],
      showSegments: false,
      items: [],
      showInformationModal: false,
      selectedSegment: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.fetchList();
  }

  fetchList() {
    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment &&
        this.props.getCustomSegmentListResponse.segment.length > 0
      ) {
        let segmentList = [...this.props.getCustomSegmentListResponse.segment];
        segmentList = _.filter(segmentList, function(item) {
          return !(
            item.segmentId === 'DEFAULT##DEFAULT' ||
            item.segmentId === 'NEW_USER##NEW_USER'
          );
        });
        this.setState(
          {
            items: _.sortBy(segmentList, function(item) {
              return item.priority ? item.priority : 0;
            })
          },
          () => this.setState({ showSegments: true })
        );
      } else {
        message.error('No custom segment exist for ordering', 1);
      }
    });
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

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let orderMap = {};
        this.state.items.forEach(function(item, index) {
          orderMap[item.segmentId] = index;
        });
        let data = {
          priorities: { ...orderMap }
        };
        this.props.actions.updateSegmentPriorities(data).then(() => {
          if (this.props.updateSegmentPrioritiesResponse) {
            if (this.props.updateSegmentPrioritiesResponse.error) {
              message
                .error(
                  this.props.updateSegmentPrioritiesResponse.error.message
                    ? this.props.updateSegmentPrioritiesResponse.error.message
                    : 'Could not update priorities'
                )
                .then(() => window.location.reload());
            } else {
              message.info('Updated Successfully');
            }
          }
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      matchId: isFieldTouched('matchId') && getFieldError('matchId')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Segment Order| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card
            title="Custom Segment Order"
            extra={
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Save
              </Button>
            }
          >
            {this.state.showSegments && (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {this.state.items.map((item, index) => (
                        <Draggable
                          key={item.segmentId}
                          draggableId={item.segmentId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <Row>
                                <Col span={20}>
                                  <div>
                                    <strong>Segment Id:</strong>{' '}
                                    {item.segmentId}
                                  </div>
                                  <div>
                                    <strong>Segment Name:</strong>
                                    {item.segmentName}
                                  </div>
                                </Col>
                                <Col span={4} style={{ textAlign: 'right' }}>
                                  <Button
                                    shape="circle"
                                    icon="info"
                                    size="small"
                                    onClick={() => this.getUserCount(item)}
                                    type="primary"
                                  />
                                </Col>
                              </Row>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Card>
        </Form>
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCustomSegmentListResponse:
      state.segmentation.getCustomSegmentListResponse,
    updateSegmentPrioritiesResponse:
      state.segmentation.updateSegmentPrioritiesResponse,
    getUserCountSegmentResponse: state.segmentation.getUserCountSegmentResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...segmentationActions }, dispatch)
  };
}
const CustomSegmentOrderForm = Form.create()(CustomSegmentOrder);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomSegmentOrderForm);
