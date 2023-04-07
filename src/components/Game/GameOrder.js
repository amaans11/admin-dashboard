// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../../actions/gameActions';
import { Card, Select, Row, Col, Radio, Button, Icon, Avatar } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import DropColumn from "../shared/DropColumn";
// type GameOrder ={}
// const gameList = [];
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

class GameOrder extends React.Component {
  state = {
    items: [],
    newData: [],
    mainOrder: [],
    showOrder: false
  };
  id2List = {
    droppable: 'items',
    droppable2: 'newData'
  };
  getGameList(gameOrder) {
    var gameList = [];
    // if (!this.props.gameList && gameList.length === 0) {
    this.props.actions.fetchGames().then(() => {
      this.props.games.allGames.map(game => {
        if (this.props.location.pathname.search('config') === 1) {
          if (game.tournamentSupported) {
            gameList.push(game);
          }
        } else {
          if (game.battleSupported) {
            gameList.push(game);
          }
        }

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
  componentDidMount() {
    // this.getGameList();

    let gameType =
      this.props.location.pathname.search('config') === 1
        ? 'NORMAL'
        : 'BATTLE_V1';
    // /////////////////Get Current Game Oredr/////////////////////////////////

    this.props.actions.getGameOrder(gameType).then(() => {
      this.setState({
        items: this.props.games.gameOrder.games,
        showOrder: true,
        gameType
      });
      this.getGameList(this.props.games.gameOrder.games);
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

    this.props.actions.setGameOrder(gameIds, this.state.gameType).then(() => {
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

        {this.state.showOrder ? (
          <React.Fragment>
            <Card>
              <Row>
                {/* <Col span={12}>
                  <Radio.Group
                    onChange={e => this.getNewData(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="group">Existing Groups</Radio.Button>
                    <Radio.Button value="config">
                      Existing Tournament Configs
                    </Radio.Button>
                  </Radio.Group>
                </Col> */}
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
                                      {item.type === 'GROUP' ? (
                                        <Avatar>G</Avatar>
                                      ) : (
                                        <Avatar>T</Avatar>
                                      )}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameOrder);
