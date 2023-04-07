// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../../actions/gameActions';
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Icon,
  notification,
  Select
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const { Option } = Select;
const openNotificationWithIcon = type => {
  notification[type]({
    message: 'No records found for the game type',
    description: 'No records found for the game type'
  });
};

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

  // let newIteam = {
  //   type: removed.configOrder === undefined ? 'CONFIG' : 'GROUP',
  //   id: removed.id,
  //   name: removed.name,
  //   description: removed.description ? removed.description : ''
  // };
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
  // });
};

const grid = 8;
const COUNTRY_CODE_LIST = ['GLOBAL', 'IN', 'ID', 'US'];

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

class GameOrderList extends React.Component {
  state = {
    items: [],
    newData: [],
    mainOrder: [],
    showOrder: false,
    gameType: 'COMBINED',
    countryCode: undefined
  };
  id2List = {
    droppable: 'items',
    droppable2: 'newData'
  };
  getGameList(gameOrder = []) {
    var gameList = [];
    // if (!this.props.gameList && gameList.length === 0) {
    this.props.actions.getAllGames({ combined: true }).then(() => {
      this.props.games.getAllGamesResponse.map(game => {
        gameList.push(game);
        // return true;
      });
      var newData = checkMainOrderData(gameList, gameOrder);

      this.setState({
        newData,
        showNewData: true
      });
    });
    // }
    this.setState({
      gameList
    });
  }

  getGameOrder = countryCode => {
    this.props.actions
      .getGameOrder(this.state.gameType, countryCode)
      .then(() => {
        if (
          this.props.games.gameOrder.games &&
          this.props.games.gameOrder.games.length > 0
        ) {
          this.setState({
            items: this.props.games.gameOrder.games,
            showOrder: true
          });
          this.getGameList(this.props.games.gameOrder.games);
        } else {
          openNotificationWithIcon('error');
          this.getGameList();
          this.setState({
            items: [],
            showOrder: true
          });
        }
      });
  };
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
      // var check = checkMainOrder(
      //   this.getList(source.droppableId),
      //   source.index,
      //   this.state.items
      // );
      // //   val => {
      // if (check) {
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
      // } else {
      //   return;
      // }
    }
  };
  publish = () => {
    let gameIds = [];
    let gameOrder = [...this.state.items];
    gameOrder.forEach(element => {
      gameIds.push(element.id);
    });

    this.props.actions
      .setGameOrder(gameIds, this.state.gameType, this.state.countryCode)
      .then(() => {
        // this.props.actions.getMainOrder(this.state.gameId).then(() => {
        //   this.setState({
        //     items: this.props.appOrder.mainOrder.groups,
        //     showOrder: true,
        //     gameId: this.state.gameId
        //   });
        // });
        window.location.reload();
      });
  };
  getNewData = (e, gameId = this.state.gameId) => {
    if (e === 'group') {
      this.props.actions.getGroupsByGame(gameId).then(() => {
        var newData = checkMainOrderData(
          this.props.groups.groupsList[gameId].allGroups,
          this.state.items
        );
        this.setState({
          newData,
          showNewData: true,
          newDataType: 'group'
        });
      });
    } else {
      this.props.actions.getConfigsBygroup(gameId, 0).then(() => {
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
    }
  };

  onCountryChange = countryCode => {
    this.setState({ countryCode, showOrder: false }, () => {
      this.getGameOrder(countryCode);
    });
  };
  render() {
    // const gameSelected = gameId => {
    //   this.setState({
    //     showNewData: false
    //   });
    //   var vm = this;
    //   this.props.actions.getMainOrder(gameId).then(() => {
    //     vm.setState({
    //       items: vm.props.appOrder.mainOrder.groups,
    //       showOrder: true,
    //       gameId
    //     });
    //   });
    //   if (this.state.newDataType) {
    //     this.getNewData(this.state.newDataType, gameId);
    //   }
    // };

    const removeItem = (data, index) => {
      const sourceClone = Array.from(this.state.items);
      let removed = sourceClone.splice(index, 1);

      // if (this.state.newData.length > 0) {
      //   if (
      //     removed[0].type.toUpperCase() ===
      //     this.state.newData[0].type.toUpperCase()
      //   ) {
      const destClone = Array.from(this.state.newData);
      destClone.push(removed[0]);
      this.setState({
        items: sourceClone,
        newData: destClone
      });
      // } else {
      //   this.setState({
      //     items: sourceClone
      //   });
      // }
      // } else {
      //   this.setState({
      //     items: sourceClone
      //   });
      // }
    };
    return (
      <React.Fragment>
        {/* s */}
        <Card>
          <Row>
            <Col span={12}>
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder="Select a Country Code"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.countryCode}
                onChange={data => this.onCountryChange(data)}
              >
                {COUNTRY_CODE_LIST.map((code, idx) => (
                  <Option key={idx} value={code}>
                    {code}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>
        {this.state.showOrder ? (
          <React.Fragment>
            <Card style={{ marginTop: 32 }}>
              <Row>
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
                    <Card title="Drag Items from here">
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
                                        <div>{item.name}</div>
                                        <div className="description">
                                          {item.description}
                                        </div>
                                      </span>
                                      <span>
                                        <Badge
                                          count={
                                            item.tournamentSupported ? 'T' : ''
                                          }
                                        />
                                        <span> </span>
                                        <Badge
                                          count={
                                            item.battleSupported ? 'B' : ''
                                          }
                                          style={{ backgroundColor: '#52c41a' }}
                                        />
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
                    <Card title="Game Order">
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
                                      <Badge
                                        count={
                                          item.tournamentSupported ? 'T' : ''
                                        }
                                      />
                                      <span> </span>
                                      <Badge
                                        count={item.battleSupported ? 'B' : ''}
                                        style={{ backgroundColor: '#52c41a' }}
                                      />
                                    </span>
                                    <span>
                                      <div>{item.name}</div>
                                      <div className="description">
                                        {item.description}
                                      </div>
                                    </span>
                                    <span>
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
    games: state.games
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...gameActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOrderList);
