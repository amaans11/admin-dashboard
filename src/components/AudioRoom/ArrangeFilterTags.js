import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as audioRoomActions from '../../actions/AudioRoomActions';
import { Card, Form, Button, Row, Col, message, Icon } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const fixedLabelArray = ['Popular', 'Recent', 'All', 'Max Cash'];

const popularObj = {
  label: 'Popular',
  value: 'live',
  category: 'Popular'
};

const recentObj = {
  label: 'Recent',
  value: 'recent',
  category: 'topics'
};

const allObj = {
  label: 'All',
  value: 'ALL',
  category: 'all'
};

const maxCashObj = {
  label: 'Max Cash',
  value: 'maxcash',
  category: 'topics'
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
class ArrangeFilterTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      fixedComponents: [
        {
          label: 'Popular',
          value: 'live',
          category: 'Popular'
        },
        {
          label: 'Recent',
          value: 'recent',
          category: 'topics'
        },
        {
          label: 'All',
          value: 'ALL',
          category: 'all'
        },
        {
          label: 'Max Cash',
          value: 'maxcash',
          category: 'topics'
        }
      ]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.populateLists = this.populateLists.bind(this);
    this.removeFilterTag = this.removeFilterTag.bind(this);
  }

  componentDidMount() {
    this.props.actions.getAudioRoomTopics().then(() => {
      if (this.props.getAudioRoomTopicsResponse) {
        let config = JSON.parse(this.props.getAudioRoomTopicsResponse).config;
        let filterTags =
          config['podcast.configs'] && config['podcast.configs'].filterTags
            ? config['podcast.configs'].filterTags
            : [];
        this.setState(
          {
            filterTags: [...filterTags]
          },
          () => this.populateLists()
        );
      }
    });
  }

  removeFilterTag(item) {
    let fixedComponents = [...this.state.fixedComponents];
    let filterTags = [...this.state.filterTags];
    switch (item.label) {
      case 'Popular':
        fixedComponents.push(popularObj);
        filterTags = filterTags.filter(function(cursor) {
          return cursor.label != item.label;
        });
        break;
      case 'Recent':
        fixedComponents.push(recentObj);
        filterTags = filterTags.filter(function(cursor) {
          return cursor.label != item.label;
        });
        break;
      case 'All':
        fixedComponents.push(allObj);
        filterTags = filterTags.filter(function(cursor) {
          return cursor.label != item.label;
        });
        break;
      case 'Max Cash':
        fixedComponents.push(maxCashObj);
        filterTags = filterTags.filter(function(cursor) {
          return cursor.label != item.label;
        });
        break;
      default:
        break;
    }
    this.setState({
      fixedComponents: [...fixedComponents],
      filterTags: [...filterTags]
    });
  }

  populateLists() {
    let vm = this;
    let filteredList = [];
    this.state.fixedComponents.forEach(function(item) {
      let itemIndex = vm.state.filterTags.findIndex(
        obj => obj.label === item.label
      );
      if (itemIndex === -1) {
        filteredList.push(item);
      }
    });
    this.setState({ fixedComponents: [...filteredList], display: true });
  }

  handleSubmit() {
    let data = {
      filterTags: [...this.state.filterTags]
    };
    this.props.actions.setAudioRoomFilterOrder(data).then(() => {
      if (this.props.setAudioRoomFilterOrderResponse) {
        if (this.props.setAudioRoomFilterOrderResponse.error) {
          message.error('Could not update');
        } else {
          this.props.actions.setAudioRoomFilterOrderPs(data).then(() => {
            if (this.props.setAudioRoomFilterOrderResponsePs) {
              if (this.props.setAudioRoomFilterOrderResponsePs.error) {
                message.error('Could not update');
              } else {
                message
                  .success('Updated Successfully', 1.5)
                  .then(() => window.location.reload());
              }
            }
          });
        }
      }
    });
  }

  onDragEnd = result => {
    console.log(result);
    const { source, destination } = result;
    var vm = this;
    if (!destination) {
      message.info('This action is prohibited', 2);
      return;
    }
    console.log('source', source, 'desit', destination);
    // return;
    if (source.droppableId === destination.droppableId) {
      const filterTags = reorder(
        this.state.filterTags,
        source.index,
        destination.index
      );
      this.setState({
        filterTags
      });
    } else {
      const result = move(
        this.state.fixedComponents,
        this.state.filterTags,
        source,
        destination
      );
      this.setState({
        filterTags: result.droppable,
        fixedComponents: [...result.droppable2]
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.display && (
          <Card
            title={'Order Audio Room Filters'}
            extra={
              <Button onClick={() => this.handleSubmit()} type="primary">
                Save Order
              </Button>
            }
          >
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Row>
                <Col span={12}>
                  <Card title="Inactive List">
                    <Droppable isDropDisabled={true} droppableId="droppable2">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {this.state.fixedComponents.map((item, index) => (
                            // checkMainOrder()
                            <Draggable
                              key={item.label}
                              draggableId={item.label}
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
                                  {item.label}
                                </div>
                              )}
                            </Draggable>
                          ))}
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
                          {this.state.filterTags.map((item, index) => (
                            <Draggable
                              key={`${item.label}${index}`}
                              draggableId={item.label}
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
                                  {item.label}
                                  {fixedLabelArray.includes(item.label) && (
                                    <Icon
                                      type="delete"
                                      theme="twoTone"
                                      onClick={() => this.removeFilterTag(item)}
                                    />
                                  )}
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
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAudioRoomTopicsResponse: state.audioRoom.getAudioRoomTopicsResponse,
    setAudioRoomFilterOrderResponse:
      state.audioRoom.setAudioRoomFilterOrderResponse,
    setAudioRoomFilterOrderResponsePs:
      state.audioRoom.setAudioRoomFilterOrderResponsePs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...audioRoomActions }, dispatch)
  };
}
const ArrangeFilterTagsForm = Form.create()(ArrangeFilterTags);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArrangeFilterTagsForm);
