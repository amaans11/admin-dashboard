import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tierWidgetsActions from '../../actions/HomeConfigActions';
import * as gameActions from '../../actions/gameActions';
import * as userProfileActions from '../../actions/UserProfileActions';
import * as segmentationActions from '../../actions/segmentationActions';
import {
  Card,
  Select,
  Form,
  Button,
  InputNumber,
  Input,
  message,
  Row,
  Col,
  Radio,
  Tag,
  Icon,
  Spin
} from 'antd';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
  // });
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
/////////////////Check for replications//////////////
const checkMainOrder = (data, mainOrder) => {
  var check = mainOrder.filter(element => {
    if (data.id === element.id) {
      return false;
    } else {
      return true;
    }
  });

  return check.length === mainOrder.length ? true : false;
};

const checkMainOrderData = (source, mainOrder) => {
  var newVal = [];
  source.forEach(el => {
    // checkMainOrder(el, mainOrder);
    if (checkMainOrder(el, mainOrder)) {
      newVal.push(el);
    }
  });

  return newVal;
};

class ConfigurableHomeConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      segmentsFetched: false,
      selectedSegmentId: '',
      segmentSelectedFlag: false,
      selectedConfig: {},
      inActiveList: [],
      items: [],
      showMainSegment: false,
      isNew: false,
      showHelpIcon: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.populateDragList = this.populateDragList.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getConfigurableHomeConfig();
    this.getCustomSegmentList();
    this.getGamesList();
  }

  getConfigurableHomeConfig() {
    this.props.actions.getConfigurableHomeConfig().then(() => {
      if (this.props.getConfigurableHomeConfigResponse) {
        let configurableGameConfig = JSON.parse(
          this.props.getConfigurableHomeConfigResponse
        ).configurableGameConfig;
        this.setState({ configurableGameConfig }, () => {
          console.log(this.state.configurableGameConfig);
        });
      }
    });
  }

  getCustomSegmentList() {
    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment
      ) {
        let customSegmentList = [];
        this.props.getCustomSegmentListResponse.segment.map(segment => {
          customSegmentList.push(
            <Option key={segment.segmentId} value={segment.segmentId}>
              {segment.segmentId}
            </Option>
          );
        });
        this.setState({
          customSegmentList,
          segmentsFetched: true
        });
      } else {
        message.info('No records found');
        this.setState({ customSegmentList: [] });
      }
    });
  }

  getGamesList() {
    this.props.actions.getGameOrder('COMBINED', 'GLOBAL').then(() => {
      if (
        this.props.games &&
        this.props.games.gameOrder &&
        this.props.games.gameOrder.games
      ) {
        this.setState({
          inActiveList: [...this.props.games.gameOrder.games]
        });
      }
    });
  }

  segmentSelected(value) {
    this.setState(
      {
        selectedSegmentId: value,
        segmentSelectedFlag: true,
        inActiveList: [...this.props.games.gameOrder.games],
        loading: true,
        showMainSegment: false
      },
      () => {
        this.checkForExistingConfig();
      }
    );
  }

  checkForExistingConfig() {
    let selectedConfig = {};
    let isNew = false;
    if (
      this.state.configurableGameConfig &&
      this.state.configurableGameConfig[this.state.selectedSegmentId]
    ) {
      selectedConfig = {
        ...this.state.configurableGameConfig[this.state.selectedSegmentId]
      };
      isNew = false;
    } else if (
      this.state.configurableGameConfig &&
      this.state.configurableGameConfig['DEFAULT##DEFAULT']
    ) {
      message.info(
        'No zookeeper config found for the segment. Prepopulating data by taking DEFAULT custom segment',
        2
      );
      selectedConfig = {
        ...this.state.configurableGameConfig['DEFAULT##DEFAULT']
      };
      isNew = true;
    } else {
      message.error('No configs found');
      selectedConfig = { recentlyPlayedGames: {}, configurableGameList: {} };
    }
    this.setState(
      {
        selectedConfig: { ...selectedConfig },
        isNew: isNew,
        showHelpIcon: selectedConfig.configurableGameList.data.showHelpIcon
          ? true
          : false
      },
      () => this.populateDragList()
    );
  }

  populateDragList() {
    let items = [];
    let gamesList = [...this.state.inActiveList];
    let selectedConfig = { ...this.state.selectedConfig };
    let filteredArray = [];
    if (
      selectedConfig.configurableGameList &&
      selectedConfig.configurableGameList.data &&
      selectedConfig.configurableGameList.data.gameIds &&
      selectedConfig.configurableGameList.data.gameIds.length > 0
    ) {
      _.forEach(selectedConfig.configurableGameList.data.gameIds, function(
        item
      ) {
        let gameObj = _.find(gamesList, { id: item });
        if (gameObj) {
          items.push(gameObj);
        }
      });
      filteredArray = _.filter(gamesList, function(item) {
        return !selectedConfig.configurableGameList.data.gameIds.includes(
          item.id
        );
      });
    } else {
      filteredArray = [...gamesList];
    }

    this.setState({
      items: [...items],
      inActiveList: [...filteredArray],
      showMainSegment: true,
      loading: false
    });
  }

  removeItem(item) {
    let items = [...this.state.items];
    let inActiveList = [...this.state.inActiveList];
    inActiveList.push(item);
    _.remove(items, function(x) {
      return x.id === item.id;
    });
    this.setState({ items: [...items], inActiveList: [...inActiveList] });
  }

  onDragEnd = result => {
    const { source, destination } = result;
    var vm = this;
    if (!destination) {
      return;
    }
    // return;
    if (source.droppableId === destination.droppableId) {
      const items = reorder(this.state.items, source.index, destination.index);
      this.setState({
        items
      });
    } else {
      const result = move(
        this.state.inActiveList,
        this.state.items,
        source,
        destination
      );
      this.setState({
        items: result.droppable,
        inActiveList: [...result.droppable2]
      });
    }
  };

  showHelpIconChanged(value) {
    this.setState({ showHelpIcon: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let gameIds = this.state.items.map(item => item.id);
        if (gameIds.length > values.maxNumberOfGames) {
          message.error(
            'Number of games selected are more than maximum number of games specified'
          );
          return;
        }
        if (gameIds.length < values.minNumberOfGames) {
          message.error(
            'Number of games selected is less than minimum number of games specified'
          );
          return;
        }

        let recentlyPlayedGames = {};
        recentlyPlayedGames['show'] = values.recentlyPlayedGamesShow;
        recentlyPlayedGames['index'] = values.recentlyPlayedGamesIndexValue;

        let configurableGameList = {};
        configurableGameList['show'] = values.configurableGameListShow;
        configurableGameList['index'] = values.configurableGameListIndexValue;

        let configData = {
          gameIds: [...gameIds],
          title: values.title,
          subtitle: values.subtitle,
          gameTileInfo: values.gameTileInfo,
          showHelpIcon: values.showHelpIcon,
          helpModalTitle: values.helpModalTitle ? values.helpModalTitle : '',
          helpModalMessage: values.helpModalMessage
            ? values.helpModalMessage
            : '',
          minNumberOfGames: values.minNumberOfGames,
          maxNumberOfGames: values.maxNumberOfGames
        };

        configurableGameList['data'] = { ...configData };

        let config = {
          recentlyPlayedGames: recentlyPlayedGames,
          configurableGameList: configurableGameList
        };

        let data = {
          segmentId: this.state.selectedSegmentId,
          config: { ...config },
          isNew: this.state.isNew
        };
        this.props.actions.setConfigurableHomeConfig(data).then(() => {
          if (
            this.props.setConfigurableHomeConfigResponse &&
            this.props.setConfigurableHomeConfigResponse.success
          ) {
            if (this.props.setConfigurableHomeConfigResponse.success) {
              message
                .success(
                  'Updated the segment configurable game configuration',
                  1.5
                )
                .then(() => {
                  window.location.reload();
                });
            } else {
              message.error('Could not update the config');
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
      recentlyPlayedGamesIndexValue:
        isFieldTouched('recentlyPlayedGamesIndexValue') &&
        getFieldError('recentlyPlayedGamesIndexValue'),
      configurableGameListIndexValue:
        isFieldTouched('configurableGameListIndexValue') &&
        getFieldError('configurableGameListIndexValue'),
      title: isFieldTouched('title') && getFieldError('title'),
      subtitle: isFieldTouched('subtitle') && getFieldError('subtitle'),
      helpModalTitle:
        isFieldTouched('helpModalTitle') && getFieldError('helpModalTitle'),
      helpModalMessage:
        isFieldTouched('helpModalMessage') && getFieldError('helpModalMessage'),
      minNumberOfGames:
        isFieldTouched('minNumberOfGames') && getFieldError('minNumberOfGames'),
      maxNumberOfGames:
        isFieldTouched('maxNumberOfGames') && getFieldError('maxNumberOfGames')
    };
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Configurable Home Config">
            {this.state.segmentsFetched && (
              <Row>
                <Col
                  span={6}
                  style={{
                    textAlign: 'right',
                    lineHeight: '30px',
                    color: 'rgba(0, 0, 0, .85)',
                    paddingRight: '10px'
                  }}
                >
                  Select Segment:
                </Col>
                <Col span={14}>
                  <Select
                    showSearch
                    onSelect={e => this.segmentSelected(e)}
                    style={{ width: '80%' }}
                    placeholder="Segment"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.customSegmentList}
                  </Select>
                </Col>
              </Row>
            )}
            {this.state.showMainSegment && (
              <Spin spinning={this.state.loading}>
                <Row>
                  <Card title="Recently Played Games" type="inner">
                    {this.state.selectedConfig.recentlyPlayedGames.show}
                    <FormItem
                      {...formItemLayout}
                      label={'Recently Played Games Show'}
                    >
                      {getFieldDecorator('recentlyPlayedGamesShow', {
                        initialValue: this.state.selectedConfig
                          .recentlyPlayedGames.show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.recentlyPlayedGamesIndexValue ? 'error' : ''
                      }
                      help={errors.recentlyPlayedGamesIndexValue || ''}
                      {...formItemLayout}
                      label={'Recently Played Games Index'}
                    >
                      {getFieldDecorator('recentlyPlayedGamesIndexValue', {
                        initialValue: this.state.selectedConfig
                          .recentlyPlayedGames.index,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                  </Card>

                  <Card title="Configurable Game List" type="inner">
                    <FormItem
                      {...formItemLayout}
                      label={'Configurable Game List Show'}
                    >
                      {getFieldDecorator('configurableGameListShow', {
                        initialValue: this.state.selectedConfig
                          .configurableGameList.show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.configurableGameListIndexValue ? 'error' : ''
                      }
                      help={errors.configurableGameListIndexValue || ''}
                      {...formItemLayout}
                      label={'Configurable Game List Index'}
                    >
                      {getFieldDecorator('configurableGameListIndexValue', {
                        initialValue: this.state.selectedConfig
                          .configurableGameList.index,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <Card title="Configuration Data" type="inner">
                      <FormItem
                        validateStatus={errors.title ? 'error' : ''}
                        help={errors.title || ''}
                        {...formItemLayout}
                        label={'Title'}
                      >
                        {getFieldDecorator('title', {
                          initialValue: this.state.selectedConfig
                            .configurableGameList.data.title,
                          rules: [
                            {
                              required: true,
                              message: 'This is a manadatory field',
                              whitespace: true
                            }
                          ]
                        })(<Input />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.subtitle ? 'error' : ''}
                        help={errors.subtitle || ''}
                        {...formItemLayout}
                        label={'Sub title'}
                      >
                        {getFieldDecorator('subtitle', {
                          initialValue:
                            this.state.selectedConfig.configurableGameList
                              .data &&
                            this.state.selectedConfig.configurableGameList.data
                              .subtitle
                              ? this.state.selectedConfig.configurableGameList
                                  .data.subtitle
                              : '',
                          rules: [
                            {
                              required: false,
                              whitespace: true
                            }
                          ]
                        })(<Input />)}
                      </FormItem>
                      <FormItem {...formItemLayout} label={'Game Tile Info'}>
                        {getFieldDecorator('gameTileInfo', {
                          initialValue: this.state.selectedConfig
                            .configurableGameList.data.gameTileInfo,
                          rules: [
                            {
                              required: true,
                              message: 'Please select an option',
                              whitespace: true
                            }
                          ]
                        })(
                          <RadioGroup size="small" buttonStyle="solid">
                            <RadioButton value={'cash'}>
                              Total Cash Won
                            </RadioButton>
                            <RadioButton value={'winnings'}>
                              Total Cash Winners
                            </RadioButton>
                            <RadioButton value={'none'}>None</RadioButton>
                          </RadioGroup>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label={'Show Help Icon'}>
                        {getFieldDecorator('showHelpIcon', {
                          initialValue: this.state.selectedConfig
                            .configurableGameList.data.showHelpIcon,
                          rules: [
                            {
                              required: true,
                              message: 'Please select an option',
                              whitespace: false,
                              type: 'boolean'
                            }
                          ]
                        })(
                          <RadioGroup
                            onChange={e =>
                              this.showHelpIconChanged(e.target.value)
                            }
                            size="small"
                            buttonStyle="solid"
                          >
                            <RadioButton value={true}>True</RadioButton>
                            <RadioButton value={false}>False</RadioButton>
                          </RadioGroup>
                        )}
                      </FormItem>
                      {this.state.showHelpIcon && (
                        <>
                          <FormItem
                            validateStatus={
                              errors.helpModalTitle ? 'error' : ''
                            }
                            help={errors.helpModalTitle || ''}
                            {...formItemLayout}
                            label={'Help Modal Title'}
                          >
                            {getFieldDecorator('helpModalTitle', {
                              initialValue: this.state.selectedConfig
                                .configurableGameList.data.helpModalTitle,
                              rules: [
                                {
                                  required: true,
                                  message: 'This is a manadatory field',
                                  whitespace: true
                                }
                              ]
                            })(<Input />)}
                          </FormItem>
                          <FormItem
                            validateStatus={
                              errors.helpModalMessage ? 'error' : ''
                            }
                            help={errors.helpModalMessage || ''}
                            {...formItemLayout}
                            label={'Help Modal Message'}
                          >
                            {getFieldDecorator('helpModalMessage', {
                              initialValue: this.state.selectedConfig
                                .configurableGameList.data.helpModalMessage,
                              rules: [
                                {
                                  required: true,
                                  message: 'This is a manadatory field',
                                  whitespace: true
                                }
                              ]
                            })(<Input />)}
                          </FormItem>
                        </>
                      )}

                      <FormItem
                        validateStatus={errors.minNumberOfGames ? 'error' : ''}
                        help={errors.minNumberOfGames || ''}
                        {...formItemLayout}
                        label={'minNumberOfGames'}
                      >
                        {getFieldDecorator('minNumberOfGames', {
                          initialValue:
                            this.state.selectedConfig.configurableGameList
                              .data &&
                            this.state.selectedConfig.configurableGameList.data
                              .minNumberOfGames
                              ? this.state.selectedConfig.configurableGameList
                                  .data.minNumberOfGames
                              : '',
                          rules: [
                            {
                              required: true,
                              type: 'number',
                              message:
                                'This is a manadatory field and should be a number',
                              whitespace: false
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.maxNumberOfGames ? 'error' : ''}
                        help={errors.maxNumberOfGames || ''}
                        {...formItemLayout}
                        label={'maxNumberOfGames'}
                      >
                        {getFieldDecorator('maxNumberOfGames', {
                          initialValue:
                            this.state.selectedConfig.configurableGameList
                              .data &&
                            this.state.selectedConfig.configurableGameList.data
                              .maxNumberOfGames
                              ? this.state.selectedConfig.configurableGameList
                                  .data.maxNumberOfGames
                              : '',
                          rules: [
                            {
                              required: true,
                              type: 'number',
                              message:
                                'This is a manadatory field and should be a number',
                              whitespace: false
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Card>
                  </Card>
                  <Card>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                      <Row>
                        <Col span={12}>
                          <Card title="In Active List">
                            <Droppable
                              isDropDisabled={true}
                              droppableId="droppable2"
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  style={getListStyle(snapshot.isDraggingOver)}
                                >
                                  {this.state.inActiveList.map(
                                    (item, index) => (
                                      <Draggable
                                        key={item.id}
                                        draggableId={item.id}
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
                                            <span>
                                              <img
                                                style={{
                                                  width: 'auto',
                                                  height: '40px',
                                                  borderRadius: '5px'
                                                }}
                                                src={
                                                  item.platforms.android.assets
                                                    .thumb
                                                }
                                                alt=""
                                              />
                                            </span>
                                            <span>{item.id}</span>
                                            <Tag
                                              style={{ fontSize: '16px' }}
                                              color="green"
                                            >
                                              {item.name}
                                            </Tag>
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </Card>
                        </Col>

                        <Col span={12}>
                          <Card title="Active List">
                            <Droppable droppableId="droppable">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  style={getListStyle(snapshot.isDraggingOver)}
                                >
                                  {this.state.items.map((item, index) => (
                                    <Draggable
                                      key={`${item.id}`}
                                      draggableId={item.id}
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
                                          {item.platforms && (
                                            <span>
                                              <img
                                                style={{
                                                  width: 'auto',
                                                  height: '40px',
                                                  borderRadius: '5px'
                                                }}
                                                src={
                                                  item.platforms.android.assets
                                                    .thumb
                                                }
                                                alt=""
                                              />
                                            </span>
                                          )}
                                          <span>{item.id}</span>
                                          <Tag
                                            style={{ fontSize: '16px' }}
                                            color="green"
                                          >
                                            {item.name}
                                          </Tag>
                                          <Icon
                                            type="delete"
                                            style={{ color: 'red' }}
                                            onClick={() =>
                                              this.removeItem(item)
                                            }
                                          />
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>{' '}
                          </Card>
                        </Col>
                      </Row>
                    </DragDropContext>
                  </Card>
                  <Row>
                    <Col span={12} offset={12}>
                      <Button
                        style={{ float: 'none' }}
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Spin>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getConfigurableHomeConfigResponse:
      state.homeConfig.getConfigurableHomeConfigResponse,
    getCustomSegmentListResponse:
      state.segmentation.getCustomSegmentListResponse,
    setConfigurableHomeConfigResponse:
      state.homeConfig.setConfigurableHomeConfigResponse,
    gamesList: state.games.allGames,
    games: state.games
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...tierWidgetsActions,
        ...gameActions,
        ...userProfileActions,
        ...segmentationActions
      },
      dispatch
    )
  };
}
const ConfigurableHomeConfigForm = Form.create()(ConfigurableHomeConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigurableHomeConfigForm);
