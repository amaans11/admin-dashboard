// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appOrderActions from '../../actions/appOrderActions';
import { fetchGames } from '../../actions/gameActions';
import * as groupActions from '../../actions/groupActions';
import * as tournamentActions from '../../actions/tournamentActions';
import moment from 'moment';
import {
  Card,
  Select,
  Row,
  Col,
  Tooltip,
  Button,
  Icon,
  Modal,
  message,
  Badge,
  DatePicker
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';

const { Option } = Select;

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

const checkMainOrder = (data, mainOrder) => {
  var check = mainOrder.filter(element => {
    if (data.id === element.id) {
      if (element.type === 'GROUP' && data.configOrder !== undefined) {
        return false;
      } else if (element.type === 'CONFIG' && data.configOrder === undefined) {
        return false;
      }
    } else {
      return true;
    }
    return true;
  });
  return check.length === mainOrder.length ? true : false;
};

// SOURCE is the list of all configs MAIN ORDER is the config shown on the app

const checkMainOrderData = (source, mainOrder) => {
  var newVal = [];
  if (source && source.length > 0) {
    source.forEach(el => {
      if (checkMainOrder(el, mainOrder)) {
        let newItem = {
          type: el.configOrder === undefined ? 'CONFIG' : 'GROUP',
          id: el.id,
          name: el.name,
          description: el.description ? el.description : '',
          isActive: el.isActive
        };
        newVal.push(newItem);
      }
    });
  }
  return newVal;
};

const checkMainOrderData2 = (source, mainOrder, existingData) => {
  var newVal = [...existingData];
  if (source && source.length > 0) {
    source.forEach(el => {
      if (checkMainOrder(el, mainOrder)) {
        let newItem = {
          type: el.configOrder === undefined ? 'CONFIG' : 'GROUP',
          id: el.id,
          name: el.name,
          description: el.description ? el.description : '',
          isActive: el.isActive
        };
        newVal.push(newItem);
      }
    });
  }
  return newVal;
};

class ConfigOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      newData: [],
      mainOrder: [],
      showOrder: false,
      showConfigModal: false,
      configDetails: {},
      parentList: {},
      selectedRecord: {}
    };
  }

  id2List = {
    droppable: 'items',
    droppable2: 'newData'
  };

  componentDidMount() {
    this.getGameList();
  }

  showConfig(record) {
    let selected = _.find(this.state.parentList, { id: record.id });
    this.setState({
      showConfigModal: true,
      configDetails: selected ? JSON.stringify(selected) : 'No details found'
    });
  }

  cloneConfig(record, editType) {
    let selected = _.find(this.state.parentList, { id: record.id });
    this.props.actions.cloneConfig(selected, editType);
    if (selected.type === 'NORMAL') {
      this.props.history.push('/config/create');
    } else {
      this.props.history.push('/battle/create');
    }
  }

  deactiveConfigTime(record) {
    let selected = _.find(this.state.parentList, { id: record.id });
    this.setState({
      showConfigModal: true,
      configDetails: null,
      selectedRecord: selected
    });
  }

  getGameList() {
    var gameList = [];
    if (!this.props.gameList && gameList.length === 0) {
      this.props.actions.fetchGames().then(() => {
        this.props.gamesList.map(game => {
          gameList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
      });
    }
    this.setState({
      gameList
    });
  }

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;
    var vm = this;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );
      let state = { items };

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      vm.setState({
        items: result.droppable,
        newData: result.droppable2
      });
    }
  };

  publish = () => {
    let data = {
      groupOrder: [...this.state.items],
      gameId: this.state.gameId
    };
    data.groupOrder.forEach(element => {
      if (element.type !== 'CONFIG') {
        element.type = 'CONFIG';
      }
      delete element.data;
    });
    this.props.actions.updateMainOrder(data).then(() => {
      this.props.actions.getMainOrder(this.state.gameId).then(() => {
        this.setState({
          items: this.props.appOrder.mainOrder.groups,
          showOrder: true,
          gameId: this.state.gameId
        });
      });
    });
  };

  getNewData = gameId => {
    this.setState({ gameId: gameId });
    this.props.actions.getConfigsBygroup(gameId, 0).then(() => {
      this.setState({
        parentList: this.props.groups.groupsList[gameId].configList[0]
      });
      var newData = checkMainOrderData(
        this.props.groups.groupsList[gameId].configList[0],
        this.state.items
      );
      this.setState({
        newData,
        showNewData: true,
        newDataType: 'config'
      });
    });
  };

  getNewData2 = gameId => {
    this.props.actions.getConfigsBygroup(gameId, 0).then(() => {
      let parentList = [...this.state.parentList];
      parentList = [
        ...parentList,
        ...this.props.groups.groupsList[gameId].configList[0]
      ];
      this.setState({
        parentList
      });
      let existingData = [...this.state.newData];
      var newData = checkMainOrderData2(
        this.props.groups.groupsList[gameId].configList[0],
        this.state.items,
        existingData
      );
      this.setState({
        newData,
        showNewData: true,
        newDataType: 'config'
      });
    });
  };

  render() {
    const gameSelected = gameId => {
      this.setState({
        showNewData: false
      });
      var vm = this;
      this.props.actions.getMainOrder(gameId).then(() => {
        vm.setState({
          items: vm.props.appOrder.mainOrder.groups,
          showOrder: true,
          gameId
        });
        this.getNewData(gameId);
      });
    };

    const gameSelected2 = gameId => {
      this.setState({
        showNewData: false
      });
      this.getNewData2(gameId);
    };

    const removeItem = (data, index) => {
      const sourceClone = Array.from(this.state.items);
      let removed = sourceClone.splice(index, 1);

      if (this.state.newData.length > 0) {
        if (
          removed[0].type.toUpperCase() ===
          this.state.newData[0].type.toUpperCase()
        ) {
          const destClone = Array.from(this.state.newData);
          destClone.push(removed[0]);
          this.setState({
            items: sourceClone,
            newData: destClone
          });
        } else {
          this.setState({
            items: sourceClone
          });
        }
      } else {
        this.setState({
          items: sourceClone
        });
      }
    };
    const parsedData = data => {
      if (!data.data) {
        return 'U';
      } else {
        let details = JSON.parse(data.data);
        if (details.tournamentType && details.tournamentType !== 'NORMAL') {
          return 'B';
        } else {
          return 'T';
        }
      }
    };
    const hideModal = () => {
      this.setState({
        showConfigModal: false
      });
    };
    const handleOk = () => {
      if (!this.state.configDetails) {
        if (this.state.deactivateConfigTime) {
          this.props.actions
            .deactivateTournamentConfig({
              id: this.state.selectedRecord.id,
              deactiveTime: moment(this.state.deactivateConfigTime).toISOString(
                true
              )
            })
            .then(() => {
              this.setState({
                showConfigModal: false
              });
              let newArray = this.state.newData;
              _.remove(newArray, { id: this.state.selectedRecord.id });
              this.setState({ newData: [...newArray] });
            });
        } else {
          message.error("You haven't selected time for deactivation", 3);
        }
      } else {
        this.setState({
          showConfigModal: false
        });
      }
    };
    const onDeactivateTimeChange = e => {
      this.setState({
        deactivateConfigTime: e
      });
    };
    return (
      <React.Fragment>
        <div>
          <Modal
            title={
              this.state.configDetails
                ? 'config Details'
                : 'Select Decativation Time'
            }
            closable={true}
            maskClosable={true}
            width={800}
            onCancel={hideModal}
            onOk={handleOk}
            visible={this.state.showConfigModal}
          >
            <Card bordered={false}>
              {this.state.configDetails ? (
                this.state.configDetails
              ) : (
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Select Time"
                  onChange={onDeactivateTimeChange}
                />
              )}
            </Card>
          </Modal>
        </div>
        <Card>
          <Row>
            <Col span={12}>
              <Select
                showSearch
                onSelect={gameSelected}
                style={{ width: 300 }}
                placeholder="Select a Game"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.gameList}
              </Select>
            </Col>
            {this.state.showOrder && (
              <Col span={12}>
                Select Another Game:{'  '}
                <Select
                  showSearch
                  onSelect={gameSelected2}
                  style={{ width: 300 }}
                  placeholder="Select a Game"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.gameList}
                </Select>
              </Col>
            )}
          </Row>
        </Card>

        {this.state.showOrder ? (
          <React.Fragment>
            <Card>
              <Row>
                <Col span={12}>
                  <div>
                    <h3>
                      Drag Items from Existing Configs to Main Group Order
                    </h3>
                  </div>
                </Col>
                <Col span={12}>
                  <Button type="primary" onClick={this.publish}>
                    <Icon type="cloud-upload" />
                    Save and Publish
                  </Button>
                </Col>
              </Row>
            </Card>
            <Card>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Row>
                  <Col span={12}>
                    <Card title="Existing Tournament Configs">
                      {this.state.showNewData ? (
                        <Droppable
                          isDropDisabled={true}
                          droppableId="droppable2"
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              style={getListStyle(snapshot.isDraggingOver)}
                            >
                              {this.state.newData.map((item, index) => (
                                // checkMainOrder()
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
                                        {item.type === 'NORMAL' && (
                                          <Badge count={'T'} />
                                        )}
                                        {item.type !== 'NORMAL' && (
                                          <Badge
                                            count={'B'}
                                            style={{
                                              backgroundColor: '#52c41a'
                                            }}
                                          />
                                        )}
                                      </span>
                                      <span>
                                        <div>{item.name}</div>
                                        <div className="description">
                                          {item.description}
                                        </div>
                                      </span>
                                      <span>
                                        <Tooltip
                                          placement="topLeft"
                                          title={
                                            <span>
                                              <Button
                                                shape="circle"
                                                icon="info"
                                                onClick={() =>
                                                  this.showConfig(item)
                                                }
                                                type="primary"
                                              />
                                              <Button
                                                shape="circle"
                                                icon="copy"
                                                onClick={() =>
                                                  this.cloneConfig(
                                                    item,
                                                    'clone'
                                                  )
                                                }
                                                type="primary"
                                              />
                                              <Button
                                                shape="circle"
                                                icon="edit"
                                                onClick={() =>
                                                  this.cloneConfig(item, 'edit')
                                                }
                                                type="primary"
                                              />
                                              {item.isActive ? (
                                                <Button
                                                  shape="circle"
                                                  icon="delete"
                                                  type="danger"
                                                  onClick={() =>
                                                    this.deactiveConfigTime(
                                                      item,
                                                      false
                                                    )
                                                  }
                                                />
                                              ) : (
                                                ''
                                              )}
                                            </span>
                                          }
                                          arrowPointAtCenter
                                        >
                                          <Button>Actions</Button>
                                        </Tooltip>
                                        <span />
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ) : (
                        ''
                      )}
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card title="Main Group Order">
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {this.state.items.map((item, index) => (
                              <Draggable
                                key={`${item.type}${item.id}`}
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
                                      <Tooltip
                                        placement="topLeft"
                                        title={
                                          <span>
                                            <Button
                                              shape="circle"
                                              icon="info"
                                              onClick={() =>
                                                this.showConfig(item)
                                              }
                                              type="primary"
                                            />
                                            <Button
                                              shape="circle"
                                              icon="copy"
                                              onClick={() =>
                                                this.cloneConfig(item, 'clone')
                                              }
                                              type="primary"
                                            />
                                            <Button
                                              shape="circle"
                                              icon="edit"
                                              onClick={() =>
                                                this.cloneConfig(item, 'edit')
                                              }
                                              type="primary"
                                            />
                                          </span>
                                        }
                                        arrowPointAtCenter
                                      >
                                        <Button>Actions</Button>
                                      </Tooltip>
                                    </span>
                                    <span>
                                      <div>{item.name}</div>
                                      <div className="description">
                                        {item.description}
                                      </div>
                                    </span>
                                    <span>
                                      <span>
                                        {parsedData(item) === 'T' && (
                                          <Badge count={parsedData(item)} />
                                        )}{' '}
                                        {parsedData(item) !== 'T' && (
                                          <Badge
                                            count={parsedData(item)}
                                            style={{
                                              backgroundColor: '#52c41a'
                                            }}
                                          />
                                        )}
                                      </span>
                                      <Button
                                        onClick={() => removeItem(item, index)}
                                        type="danger"
                                        icon="close"
                                        shape="circle"
                                      />
                                    </span>
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
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    appOrder: state.appOrder,
    gamesList: state.games.allGames,
    groups: state.groups,
    tournaments: state.tournaments
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...appOrderActions, fetchGames, ...groupActions, ...tournamentActions },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigOrder);
