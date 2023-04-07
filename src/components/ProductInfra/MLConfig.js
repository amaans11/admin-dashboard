import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mlBasedConfigActions from '../../actions/mlBasedConfigActions';
import {
  Card,
  Form,
  Button,
  Input,
  InputNumber,
  Radio,
  Row,
  Col,
  Empty,
  message
} from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

class MLConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {}
    };
  }

  componentDidMount() {
    this.getConfig();
  }

  getConfig = () => {
    this.props.actions.getMlBasedConfig().then(() => {
      if (
        this.props.getMlBasedConfigResponse &&
        this.props.getMlBasedConfigResponse.config
      ) {
        const { config } = this.props.getMlBasedConfigResponse;
        this.setState({ config });
      }
    });
  };

  setConfig = data => {
    this.props.actions.setMlBasedConfig(data).then(() => {
      if (
        this.props.setMlBasedConfigResponse &&
        this.props.setMlBasedConfigResponse.success
      ) {
        message.success('Config updated! Reloading page!', 1.5).then(() => {
          window.location.reload();
        });
      } else {
        message.error('Failed to udpate config!');
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setConfig(values);
      }
    });
  };

  // Check for nested fields, undefined for no errors
  hasErrors = fieldsError => {
    let isError = false;
    Object.keys(fieldsError).forEach(field => {
      if (typeof fieldsError[field] === 'object') {
        isError = isError || this.hasErrors(fieldsError[field]);
      } else {
        isError = isError || !!fieldsError[field];
      }
    });
    return isError;
  };

  getFormHtml = (formItemKey, evKey, evVal) => {
    const { getFieldDecorator } = this.props.form;

    if (typeof evVal === 'boolean') {
      return (
        <FormItem {...formItemLayout} key={formItemKey} label={evKey}>
          {getFieldDecorator(formItemKey, {
            initialValue: evVal,
            rules: [
              {
                required: true,
                message: 'This is a mandatory field!',
                type: 'boolean'
              }
            ]
          })(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={true}>true</Radio.Button>
              <Radio.Button value={false}>false</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
      );
    } else if (typeof evVal === 'number') {
      return (
        <FormItem {...formItemLayout} key={formItemKey} label={evKey}>
          {getFieldDecorator(formItemKey, {
            initialValue: evVal,
            rules: [
              {
                required: true,
                message: 'This is a mandatory field (number)!',
                type: 'number'
              }
            ]
          })(<InputNumber min={0} precision={0} />)}
        </FormItem>
      );
    } else {
      return (
        <FormItem {...formItemLayout} key={formItemKey} label={evKey}>
          {getFieldDecorator(formItemKey, {
            initialValue: evVal,
            rules: [
              {
                required: true,
                message: 'This is a mandatory field!',
                type: 'string'
              }
            ]
          })(<Input />)}
        </FormItem>
      );
    }
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    padding: '5px',
    background: '#fff',
    border: isDragging ? '2px dashed #aaa' : '1px solid #ddd',
    opacity: isDragging ? '.6' : '',
    marginBottom: '.5rem',
    borderRadius: '3px',
    ...draggableStyle
  });

  getListStyle = isDraggingOver => ({
    backgroundColor: isDraggingOver ? 'lightblue' : '#f0f0f0',
    padding: '5px',
    width: '100%'
  });

  onDragEnd = (result, dtKey) => {
    const { source, destination } = result;
    if (!destination || source.draggableId != destination.draggableId) return;
    const arrayList = this.props.form.getFieldValue(dtKey);
    this.props.form.setFieldsValue({
      [dtKey]: this.reorderElements(arrayList, source.index, destination.index)
    });
  };

  reorderElements = (list, startIndex, endIndex) => {
    const result = cloneDeep(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const { config } = this.state;

    const errors = {
      categorySortOrder:
        isFieldTouched('categorySortOrder') &&
        getFieldError('categorySortOrder'),
      mlOrderEnabled:
        isFieldTouched('mlOrderEnabled') && getFieldError('mlOrderEnabled'),
      progressiveFeatureEnabled:
        isFieldTouched('progressiveFeatureEnabled') &&
        getFieldError('progressiveFeatureEnabled')
    };

    return (
      <Card title="ML Config" style={{ margin: '.5rem' }}>
        {!isEmpty(config) ? (
          <Form onSubmit={this.handleSubmit} {...formItemLayout}>
            <FormItem
              validateStatus={errors.categorySortOrder ? 'error' : ''}
              help={errors.categorySortOrder || ''}
              label={'categorySortOrder'}
            >
              {getFieldDecorator('categorySortOrder', {
                initialValue:
                  config && config.categorySortOrder
                    ? config.categorySortOrder
                    : 0,
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field!',
                    type: 'string'
                  }
                ]
              })(<Input />)}
            </FormItem>

            <FormItem
              validateStatus={errors.mlOrderEnabled ? 'error' : ''}
              help={errors.mlOrderEnabled || ''}
              label={'mlOrderEnabled'}
            >
              {getFieldDecorator('mlOrderEnabled', {
                initialValue:
                  config && config.hasOwnProperty('mlOrderEnabled')
                    ? config.mlOrderEnabled
                    : 0,
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field!',
                    type: 'boolean'
                  }
                ]
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={true}>true</Radio.Button>
                  <Radio.Button value={false}>false</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem
              validateStatus={errors.progressiveFeatureEnabled ? 'error' : ''}
              help={errors.progressiveFeatureEnabled || ''}
              label={'progressiveFeatureEnabled'}
            >
              {getFieldDecorator('progressiveFeatureEnabled', {
                initialValue:
                  config && config.hasOwnProperty('progressiveFeatureEnabled')
                    ? config.progressiveFeatureEnabled
                    : 0,
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field!',
                    type: 'boolean'
                  }
                ]
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={true}>true</Radio.Button>
                  <Radio.Button value={false}>false</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            <Card
              size="small"
              title="oldUserProgressiveFeaturedEvents"
              bodyStyle={{ padding: 0 }}
            >
              <DragDropContext
                onDragEnd={result => {
                  this.onDragEnd(result, 'oldUserProgressiveFeaturedEvents');
                }}
              >
                <Droppable droppableId={'oldUserProgressiveFeaturedEventsDrop'}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={this.getListStyle(snapshot.isDraggingOver)}
                    >
                      {config.oldUserProgressiveFeaturedEvents &&
                      config.oldUserProgressiveFeaturedEvents.length ? (
                        config.oldUserProgressiveFeaturedEvents.map(
                          (event, idx) => {
                            const dragableKey = `oldUserProgressiveFeaturedEvents.${idx}`;
                            return (
                              <Draggable
                                key={idx}
                                draggableId={dragableKey}
                                index={idx}
                              >
                                {(providedInner, snapshotInner) => (
                                  <div
                                    ref={providedInner.innerRef}
                                    {...providedInner.draggableProps}
                                    {...providedInner.dragHandleProps}
                                    style={this.getItemStyle(
                                      snapshotInner.isDragging,
                                      providedInner.draggableProps.style
                                    )}
                                  >
                                    {Object.keys(event).map(evKey => {
                                      const formItemKey = `oldUserProgressiveFeaturedEvents[${idx}].${evKey}`;
                                      return this.getFormHtml(
                                        formItemKey,
                                        evKey,
                                        event[evKey]
                                      );
                                    })}
                                  </div>
                                )}
                              </Draggable>
                            );
                          }
                        )
                      ) : (
                        <Empty />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>

            <Card
              size="small"
              title="newUserProgressiveFeaturedEvents"
              bodyStyle={{ padding: 0 }}
            >
              <DragDropContext
                onDragEnd={result => {
                  this.onDragEnd(result, 'newUserProgressiveFeaturedEvents');
                }}
              >
                <Droppable droppableId={'newUserProgressiveFeaturedEventsDrop'}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={this.getListStyle(snapshot.isDraggingOver)}
                    >
                      {config.newUserProgressiveFeaturedEvents &&
                      config.newUserProgressiveFeaturedEvents.length ? (
                        config.newUserProgressiveFeaturedEvents.map(
                          (event, idx) => {
                            const dragableKey = `newUserProgressiveFeaturedEventsDrop.${idx}`;

                            return (
                              <Draggable
                                key={idx}
                                draggableId={dragableKey}
                                index={idx}
                              >
                                {(providedInner, snapshotInner) => (
                                  <div
                                    ref={providedInner.innerRef}
                                    {...providedInner.draggableProps}
                                    {...providedInner.dragHandleProps}
                                    style={this.getItemStyle(
                                      snapshotInner.isDragging,
                                      providedInner.draggableProps.style
                                    )}
                                  >
                                    {Object.keys(event).map(evKey => {
                                      const formItemKey = `newUserProgressiveFeaturedEvents[${idx}].${evKey}`;
                                      return this.getFormHtml(
                                        formItemKey,
                                        evKey,
                                        event[evKey]
                                      );
                                    })}
                                  </div>
                                )}
                              </Draggable>
                            );
                          }
                        )
                      ) : (
                        <Empty />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>

            <Row>
              <Col span={14} offset={8}>
                <Button
                  style={{ float: 'unset' }}
                  type="primary"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError())}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        ) : (
          <Empty />
        )}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    getMlBasedConfigResponse: state.mlBasedConfig.getMlBasedConfigResponse,
    setMlBasedConfigResponse: state.mlBasedConfig.setMlBasedConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...mlBasedConfigActions }, dispatch)
  };
}
const MLConfig = Form.create()(MLConfigForm);
export default connect(mapStateToProps, mapDispatchToProps)(MLConfig);
