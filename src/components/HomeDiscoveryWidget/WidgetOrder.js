import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as asnActions from '../../actions/asnActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Card,
  Row,
  Icon,
  Button,
  Col,
  message,
  Form,
  Tooltip,
  Input,
  Typography
} from 'antd';
import DynamicForm from './DynamicForm';
import SearchComponent from './SearchComponent';
import get from 'lodash/get';
import {
  spreadKeys,
  hasErrorsInForm,
  getMobileNumberFromData
} from './constants';
import { CONFIG_HOME_DISCOVERY_WIDGET_READ } from '../../auth/userPermission';

// a little function to help us with reordering the result
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
  background: isDragging ? 'lightgreen' : '',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 400
});

const REC_CHANNEL_KEY = 'recommendationChannels';
export class WidgetOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widgetOrder: [],
      newWidgetOrder: [],
      isLoaded: false,
      mobileNumbersData: {},
      dataMap: {}
    };
  }

  componentDidMount() {
    this.getNodeData();
  }

  getNodeData = () => {
    this.setState({ isLoaded: false });
    this.props.actions.getAsnZkConfig().then(() => {
      if (this.props.getAsnPcZkResponse) {
        let nodeData =
          this.props.getAsnPcZkResponse.nodeData &&
          this.props.getAsnPcZkResponse.nodeData !== ''
            ? JSON.parse(this.props.getAsnPcZkResponse.nodeData)
            : {};
        let widgetOrder = nodeData.widgetOrder;
        this.setState({
          nodeData: { ...nodeData },
          widgetOrder: [...widgetOrder],
          isLoaded: true,
          newWidgetOrder: [...widgetOrder]
        });
        this.props.form.setFieldsValue({
          defaultChannelCreatorPopUpMsg: nodeData.defaultChannelCreatorPopUpMsg,
          additionalChannelCreatorPopUpMsg:
            nodeData.additionalChannelCreatorPopUpMsg,
          recommendationChannels: nodeData.recommendationChannels,
          ...spreadKeys(
            'recommendationChannels',
            get(nodeData, 'recommendationChannels', [])
          )
        });
      }
    });
  };

  postNodeData = nodeData => {
    this.props.actions.postAsnZkConfig(nodeData).then(() => {
      if (
        this.props.postAsnPcZkResponse &&
        this.props.postAsnPcZkResponse.success
      ) {
        this.setState({
          nodeData: { ...nodeData }
        });
        message.success('Successfully updated the data');
        this.getNodeData();
      }
    });
  };

  onDragEnd = result => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    const newWidgetOrder = reorder(
      this.state.newWidgetOrder,
      source.index,
      destination.index
    );

    this.setState({ newWidgetOrder });
  };

  isOrderChanged = () => {
    const { widgetOrder, newWidgetOrder } = this.state;
    for (let i = 0; i < widgetOrder.length; i++) {
      if (widgetOrder[i] !== newWidgetOrder[i]) return true;
    }
    return false;
  };

  publish = () => {
    if (this.isOrderChanged()) {
      const { nodeData, newWidgetOrder } = this.state;
      nodeData.widgetOrder = newWidgetOrder;
      this.postNodeData(nodeData);
      // message.info('Changes were made in the widget order.');
    } else {
      message.info('No changes were made in the widget order.');
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error('Error in form, please verify again.');
        return;
      }
      const { nodeData } = this.state;
      nodeData.defaultChannelCreatorPopUpMsg =
        values.defaultChannelCreatorPopUpMsg;
      nodeData.additionalChannelCreatorPopUpMsg =
        values.additionalChannelCreatorPopUpMsg;
      nodeData[REC_CHANNEL_KEY] = values[REC_CHANNEL_KEY];
      this.postNodeData(nodeData);
    });
  };

  removeDataItem = (fieldKey, data) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    let dataArr = getFieldValue(fieldKey);
    setFieldsValue({
      [fieldKey]: dataArr.filter(item => item !== data)
    });
  };

  addSearchData = (searchType, data, extraData) => {
    const { form } = this.props;
    const values = form.getFieldValue(searchType);
    if (values.includes(data)) return;
    let mobile = getMobileNumberFromData(searchType, extraData);
    this.props.form.setFieldsValue({
      [searchType]: [...values, data],
      [`${searchType}-${data}`]: data
    });
    this.setState({
      mobileNumbersData: {
        ...this.state.mobileNumbersData,
        [data]: mobile
      },
      dataMap: {
        ...this.state.dataMap,
        [data]: extraData
      }
    });
  };

  isReadOnlyUser = () => {
    return this.props.currentUser.user_role.includes(
      CONFIG_HOME_DISCOVERY_WIDGET_READ
    );
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
        sm: { span: 10 },
        lg: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };

    const dformItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        lg: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        lg: { span: 10 }
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 10 },
        lg: { span: 11, offset: 10 }
      }
    };

    const defaultMessageError =
      isFieldTouched('defaultChannelCreatorPopUpMsg') &&
      getFieldError('defaultChannelCreatorPopUpMsg');
    const additionalMessageError =
      isFieldTouched('additionalChannelCreatorPopUpMsg') &&
      getFieldError('additionalChannelCreatorPopUpMsg');
    const recommendedChannelsError =
      isFieldTouched('recommendationChannels') &&
      getFieldError('recommendationChannels');
    return (
      <React.Fragment>
        {this.state.isLoaded ? (
          <React.Fragment>
            <Card
              title="Widget Order"
              bordered="true"
              actions={[
                <Button
                  type="primary"
                  onClick={this.publish}
                  disabled={this.isReadOnlyUser()}
                >
                  <Icon type="cloud-upload" />
                  Save and Publish
                </Button>
              ]}
            >
              <Row type="flex" justify="center">
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="widgetOrderDroppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {this.state.newWidgetOrder.map((item, index) => (
                          <Draggable
                            key={String('wdorder' + index)}
                            draggableId={item}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="drag-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {item}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Row>
            </Card>
            <Card title="Other Zk Config" className="mt40">
              <Form onSubmit={this.handleSubmit}>
                <DynamicForm
                  form={this.props.form}
                  fieldError={recommendedChannelsError}
                  fieldKey={REC_CHANNEL_KEY}
                  removeDataItem={this.removeDataItem}
                  mobileNumbersData={this.state.mobileNumbersData}
                  dataMap={this.state.dataMap}
                  activeStatusData={{}}
                  formItemLayout={dformItemLayout}
                  formItemLayoutWithOutLabel={formItemLayoutWithOutLabel}
                />
                <Row type="flex" justify="center">
                  <Typography>
                    <Row type="flex" justify="start">
                      <Col>
                        <Typography.Paragraph>
                          * Note:&nbsp;
                        </Typography.Paragraph>
                      </Col>
                      <Col>
                        <Typography.Paragraph>
                          1. You can drag and drop the items above to manage
                          their order.
                          <br />
                          2. Use the below search option to add Recommendation
                          Channels
                        </Typography.Paragraph>
                      </Col>
                    </Row>
                  </Typography>
                </Row>
                <SearchComponent
                  searchType={REC_CHANNEL_KEY}
                  cardTitle={'Recommendation Channels'}
                  addData={this.addSearchData}
                />
                <Form.Item
                  validateStatus={defaultMessageError ? 'error' : ''}
                  {...formItemLayout}
                  help={defaultMessageError || ''}
                  label={
                    <span>
                      Default Channel Creator Popup Message
                      <Tooltip title="Default Channel Creator Popup Message">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('defaultChannelCreatorPopUpMsg', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        message: 'Please enter the message'
                      }
                    ],
                    initialValue: ''
                  })(<Input placeholder="Enter Message" />)}
                </Form.Item>
                <Form.Item
                  validateStatus={additionalMessageError ? 'error' : ''}
                  {...formItemLayout}
                  help={additionalMessageError || ''}
                  label={
                    <span>
                      Additional Channel Creator Popup Message
                      <Tooltip title="Additional Channel Creator Popup Message">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('additionalChannelCreatorPopUpMsg', {
                    rules: [
                      {
                        type: 'string',
                        required: true,
                        message: 'Please enter the message'
                      }
                    ],
                    initialValue: ''
                  })(<Input placeholder="Enter Message" />)}
                </Form.Item>
                <Row type="flex" justify="center">
                  <Button
                    type="primary"
                    disabled={
                      hasErrorsInForm(getFieldsError()) || this.isReadOnlyUser()
                    }
                    htmlType="submit"
                  >
                    Update Config
                  </Button>
                </Row>
              </Form>
            </Card>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  getAsnPcZkResponse: state.asn.getAsnPcZkResponse,
  postAsnPcZkResponse: state.asn.postAsnPcZkResponse,
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...asnActions }, dispatch)
});
const WidgetOrderForm = Form.create()(WidgetOrder);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetOrderForm);
