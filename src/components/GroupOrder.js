import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as groupActions from '../actions/groupActions';
import * as gamesListActions from '../actions/gameActions';
import * as tournamentActions from '../actions/tournamentActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { message, Card, Select, Icon, Radio, Row, Col, Button } from 'antd';

const { Option } = Select;
const gameList = [];
const groupList = [];

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

class GroupOrder extends React.Component {
  state = {
    gameSelectedFlag: false,

    tournamentsList: [],
    selectedGameId: 0,
    configList: [],
    configListRender: [],
    targetKeys: [],
    items: [],
    newData: []
  };
  id2List = {
    droppable: 'items',
    droppable2: 'newData'
  };
  componentDidMount() {
    // Select game and popup list for Groups and list for all tournaments for that game
    if (!this.props.gameList && gameList.length === 0) {
      this.props.actions.fetchGames().then(() => {
        this.props.gamesList.map(game => {
          gameList.push(
            <Option key={game.id} value={game.id}>
              {game.name}
            </Option>
          );
          return true;
        });
      });
    }
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
    let group = { ...this.state.selectedGroup };

    let configOrder = [];
    this.state.items.forEach(element => {
      configOrder.push(element.id);
      // Check for id already added in group///////////////////////
    });
    group.configOrder = [...configOrder];

    this.props.actions.udateGroupOrder(group).then(() => {
      // this.props.history.push("/group/all");
    });
  };

  render() {
    const gameSelected = gameId => {
      groupList.length = [];
      this.props.actions.getGroupsByGame(gameId).then(() => {
        this.props.groupsList[gameId].allGroups.map((group, index) => {
          groupList.push(
            <Option key={index} value={group.id}>
              {group.name}
            </Option>
          );
          return true;
        });
        this.setState({
          gameSelectedFlag: true,
          selectedGameId: gameId
        });
      });
    };
    const groupSelected = (groupId, val) => {
      //  tournaments without any group

      this.setState({
        selectedGroup: this.props.groupsList[this.state.selectedGameId]
          .allGroups[val.key]
      });
      this.props.actions
        .getTournamentConfigsByGame(this.state.selectedGameId)
        .then(() => {
          this.setState({
            newData: this.props.configsList[this.state.selectedGameId],
            showNewData: true
          });
        });
      // Active tounrmaent Configs for a group for selected
      this.props.actions
        .getConfigsBygroup(this.state.selectedGameId, groupId)
        .then(() => {
          this.setState({
            items: this.props.groupsList[this.state.selectedGameId].configList[
              groupId
            ],
            showNewData: true
          });
        });
    };
    const existingGroupSelected = groupId => {
      if (groupId === this.state.selectedGroup.id) {
        message.info('This is same group for ordering, select any other group');
      } else {
        this.props.actions
          .getConfigsBygroup(this.state.selectedGameId, groupId)
          .then(() => {
            this.setState({
              newData: this.props.groupsList[this.state.selectedGameId]
                .configList[groupId],
              showNewData: true
            });
          });
      }
    };

    const removeItem = (data, index) => {
      const sourceClone = Array.from(this.state.items);
      let removed = sourceClone.splice(index, 1);
      const destClone = Array.from(this.state.newData);

      if (this.state.newData.length > 0) {
        if (removed[0].groupId === destClone[0].groupId) {
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
    const getNewData = e => {
      if (e.target.value === 'group') {
        this.props.actions
          .getGroupsByGame(this.state.selectedGameId)
          .then(() => {
            this.setState({
              typeSelectedFlag: true
            });
          });
      } else {
        // this.props.actions;
        // .getConfigsBygroup(this.state.selectedGameId, 0)
        // .then(() => {
        // var newData = checkMainOrderData(
        //   this.props.groups.groupsList[this.state.gameId].configList[0],
        //   this.state.items
        // );
        this.setState({
          newData: this.props.configsList[this.state.selectedGameId],
          showNewData: true
        });
        // });
      }
    };
    return (
      <React.Fragment>
        <Card title="Game and Group Selection">
          <Row>
            <Col span={12}>
              <Select
                showSearch
                onSelect={gameSelected}
                style={{ width: 200 }}
                placeholder="Select a Game"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {gameList}
              </Select>
            </Col>
            <Col span={12}>
              <Select
                disabled={!this.state.gameSelectedFlag}
                showSearch
                onSelect={groupSelected}
                style={{ width: 200 }}
                placeholder="Select a Group"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {groupList}
              </Select>
            </Col>
          </Row>
        </Card>
        {this.state.gameSelectedFlag ? (
          <Card title="Select Group for existing Config or Selcet Configs without group">
            <Row>
              <Col span={8}>
                <Radio.Group
                  onChange={getNewData}
                  defaultValue={'config'}
                  buttonStyle="solid"
                >
                  <Radio.Button value="config">
                    Tournament Configs without any Group
                  </Radio.Button>
                  <Radio.Button value="group">Existing Groups</Radio.Button>
                </Radio.Group>
              </Col>
              <Col span={6}>
                <Select
                  disabled={!this.state.typeSelectedFlag}
                  showSearch
                  onSelect={existingGroupSelected}
                  style={{ width: 200 }}
                  placeholder="Select a Group"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {groupList}
                </Select>
              </Col>
              <Col span={10}>
                <Button type="primary" onClick={this.publish}>
                  <Icon type="cloud-upload" />
                  Save and Publish
                </Button>
              </Col>
            </Row>
          </Card>
        ) : (
          ''
        )}
        {this.state.showNewData ? (
          <Card>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Row>
                <Col span={12}>
                  <Card title="Drag Items from here">
                    {this.state.showNewData ? (
                      <Droppable isDropDisabled={true} droppableId="droppable2">
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
                  <Card title="Group Order">
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
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    groupsList: state.groups.groupsList,
    gamesList: state.games.allGames,
    configsList: state.tournaments.configsList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...groupActions, ...gamesListActions, ...tournamentActions },
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupOrder);
