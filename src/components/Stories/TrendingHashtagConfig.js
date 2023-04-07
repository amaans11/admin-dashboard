import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';
import { Button, Card, Empty, message, Modal, Radio } from 'antd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { cloneDeep } from 'lodash';
import TrendingOrderForm from './TrendingOrderForm';

class TrendingHashtagConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trendingHashTagSortingOrder: []
    };
  }

  componentDidMount() {
    this.getTrendingConfig();
  }

  confirmDelete = storyId => {
    this.deleteStory(storyId);
  };

  cancelDelete = () => {
    message.error('Click on No');
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onCountValueChange = value => {
    this.setState({ count: value });
  };

  getTrendingConfig = () => {
    this.props.actions.getTrendingTagOrderConfig().then(() => {
      if (
        this.props.getTrendingTagOrderConfigResponse &&
        this.props.getTrendingTagOrderConfigResponse.trendingHashTagSortingOrder
      ) {
        this.setState({
          trendingHashTagSortingOrder: cloneDeep(
            this.props.getTrendingTagOrderConfigResponse
              .trendingHashTagSortingOrder
          )
        });
      } else {
        message.error('Unable to get data!');
      }
    });
  };

  updateConfig = () => {
    const { trendingHashTagSortingOrder } = this.state;

    this.props.actions
      .setTrendingTagOrderConfig(trendingHashTagSortingOrder)
      .then(() => {
        console.log(this.props.setTrendingTagOrderConfigResponse);
        if (
          this.props.setTrendingTagOrderConfigResponse &&
          this.props.setTrendingTagOrderConfigResponse.status.code === 200
        ) {
          message.success('Config Updated!');
          this.getTrendingConfig();
        } else {
          message.error('Unable to update data!');
        }
      });
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    // userSelect: 'none',
    padding: '10px',
    marginBottom: '5px',
    backgroundColor: isDragging ? 'lightgreen' : '#fff',
    border: isDragging ? '2px dashed green' : '',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...draggableStyle
  });

  getListStyle = isDraggingOver => ({
    backgroundColor: isDraggingOver ? 'lightblue' : '#eee',
    padding: '5px',
    // width: '100%',
    borderRadius: '5px'
  });

  handleDragEnd = result => {
    const { source, destination } = result;
    if (!destination || source.draggableId !== destination.draggableId) {
      return;
    }

    this.setState({
      trendingHashTagSortingOrder: this.reorderElements(
        this.state.trendingHashTagSortingOrder,
        source.index,
        destination.index
      )
    });
  };

  reorderElements = (list, startIndex, endIndex) => {
    const result = cloneDeep(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  handleItemPropChange = (itemIndex, key, value) => {
    // console.log( itemIndex, key, value);
    const { trendingHashTagSortingOrder } = this.state;
    const newOrder = trendingHashTagSortingOrder.map((it, idx) => {
      if (idx === itemIndex) it[key] = value;
      return it;
    });
    this.setState({ trendingHashTagSortingOrder: newOrder });
  };

  addNewOrder = values => {
    const { trendingHashTagSortingOrder } = this.state;
    trendingHashTagSortingOrder.push(values);
    this.setState({ trendingHashTagSortingOrder });
    this.closeModal();
  };

  deleteItem = itemIndex => {
    const { trendingHashTagSortingOrder } = this.state;
    trendingHashTagSortingOrder.splice(itemIndex, 1);
    this.setState({ trendingHashTagSortingOrder });
  };

  render() {
    const { trendingHashTagSortingOrder } = this.state;
    const dataKey = 'treandingHashtagOrderDropKey';

    return (
      <Card className="page-container" title="Trending Hashtag Sorting Order">
        {trendingHashTagSortingOrder.length ? (
          <div>
            <div
              style={{
                marginBottom: '.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <em> *Drag-drop to re-order </em>
              <Button type="primary" ghost onClick={this.showModal}>
                Add New Item
              </Button>
            </div>

            <DragDropContext onDragEnd={this.handleDragEnd}>
              <Droppable droppableId={dataKey}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={this.getListStyle(snapshot.isDraggingOver)}
                  >
                    {trendingHashTagSortingOrder.map((item, idx) => {
                      const itemKey = dataKey + '[' + idx + ']';
                      const draggableId = `draggable-id-${idx}`;
                      return (
                        <Draggable
                          key={itemKey}
                          draggableId={draggableId}
                          index={idx}
                        >
                          {(dgProvided, dgSnapshot) => (
                            <div
                              ref={dgProvided.innerRef}
                              {...dgProvided.draggableProps}
                              {...dgProvided.dragHandleProps}
                              style={this.getItemStyle(
                                dgSnapshot.isDragging,
                                dgProvided.draggableProps.style
                              )}
                            >
                              <strong>{idx + 1}</strong>
                              <div>
                                <strong>hashTagState:</strong>{' '}
                                <span>{item.hashTagState}</span>
                              </div>
                              <div>
                                <strong>storyType:</strong>{' '}
                                <span>{item.storyType}</span>
                              </div>
                              <div>
                                <strong>hashTagType:</strong>{' '}
                                <span>{item.hashTagType}</span>
                              </div>
                              <div>
                                <strong>increasingOrder:</strong>{' '}
                                <Radio.Group
                                  size="small"
                                  value={item.increasingOrder}
                                  onChange={ev =>
                                    this.handleItemPropChange(
                                      idx,
                                      'increasingOrder',
                                      ev.target.value
                                    )
                                  }
                                >
                                  <Radio.Button value={true}>true</Radio.Button>
                                  <Radio.Button value={false}>
                                    false
                                  </Radio.Button>
                                </Radio.Group>
                              </div>
                              <div>
                                <strong>hide:</strong>{' '}
                                <Radio.Group
                                  size="small"
                                  value={item.hide}
                                  onChange={ev =>
                                    this.handleItemPropChange(
                                      idx,
                                      'hide',
                                      ev.target.value
                                    )
                                  }
                                >
                                  <Radio.Button value={true}>true</Radio.Button>
                                  <Radio.Button value={false}>
                                    false
                                  </Radio.Button>
                                </Radio.Group>
                              </div>

                              <div>
                                <Button
                                  size="small"
                                  type="danger"
                                  ghost
                                  onClick={() => this.deleteItem(idx)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Button type="primary" onClick={this.updateConfig}>
                Update Config
              </Button>
            </div>
          </div>
        ) : (
          <Empty />
        )}

        <Modal
          title="Add new config"
          visible={this.state.visible}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          footer={null}
          centered
          destroyOnClose={true}
          wrapClassName="stickers-list-pop"
        >
          <TrendingOrderForm
            // wrappedComponentRef={form => (this.stickerFormRef = form)}
            orderDetails={this.state.activeOrderDetails}
            handleSubmit={this.addNewOrder}
          />
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    getTrendingTagOrderConfigResponse:
      state.story.getTrendingTagOrderConfigResponse,
    setTrendingTagOrderConfigResponse:
      state.story.setTrendingTagOrderConfigResponse
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendingHashtagConfig);
