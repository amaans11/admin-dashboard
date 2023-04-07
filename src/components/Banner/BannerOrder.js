// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as bannerActions from '../../actions/bannerActions';
import {
  Card,
  Select,
  Row,
  Col,
  message,
  Button,
  Icon,
  Modal,
  Input
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';

const { Option } = Select;

const locationList = [
  'HOME',
  'FANTASY_HOME',
  'RUMMY',
  'GAMES',
  'DISCOVERY_WIDGET',
  'SUPPORT',
  'DEPOSIT',
  'WITHDRAWAL'
].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));

const appTypeList = ['CASH', 'PLAY_STORE', 'IOS', 'PWA_NDTV'].map(
  (val, index) => (
    <Option value={val} key={val}>
      {val}
    </Option>
  )
);

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

class BannerOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBanners: false,
      inActiveList: [],
      activeList: [],
      selectedLocation: null,
      selectedAppType: null,
      showModal: false,
      bannerDetails: {}
    };
    this.getBannerList = this.getBannerList.bind(this);
    this.selectAppType = this.selectAppType.bind(this);
    this.selectLocation = this.selectLocation.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  showDetails(item) {
    console.log(item);
    this.setState({
      showModal: true,
      bannerDetails: item ? JSON.stringify(item) : 'No details found'
    });
  }

  getBannerList() {
    this.setState({
      activeList: [],
      inActiveList: [],
      showBanners: false
    });
    if (!this.state.selectedAppType || !this.state.selectedLocation) {
      message.error(
        'Please select App Type and Location to fetch list of banners'
      );
    } else {
      this.props.actions
        .listBanners(
          this.state.selectedAppType,
          this.state.selectedLocation,
          false,
          0,
          1000,
          true,
          this.state.countryCode
        )
        .then(() => {
          if (this.props.bannerList) {
            let bannerList = [...this.props.bannerList];
            let inActiveList = [];
            let activeList = [];
            _.forEach(bannerList, function(item) {
              if (!item.index) {
                item.index = 0;
              }
              if (item.isActive) {
                activeList.push(item);
              } else {
                inActiveList.push(item);
              }
            });
            inActiveList = _.orderBy(inActiveList, 'index', 'asc');
            activeList = _.orderBy(activeList, 'index', 'asc');
            let items = [...activeList];
            this.setState({
              activeList: [...activeList],
              inActiveList: [...inActiveList],
              items: [...items],
              showBanners: true
            });
          }
        });
    }
  }

  selectAppType(appType) {
    this.setState({ selectedAppType: appType });
  }
  selectLocation(location) {
    this.setState({ selectedLocation: location });
  }

  changeCountryCode(value) {
    this.setState({ countryCode: value });
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

  publish = () => {
    let orderMap = {};
    this.state.items.forEach(function(item, index) {
      orderMap[item.id] = index;
    });
    let data = {
      bannerIdIndicesMap: orderMap
    };
    this.props.actions.updateBannerIndices(data).then(() => {
      if (
        this.props.updateBannerIndicesResponse &&
        this.props.updateBannerIndicesResponse.error
      ) {
        message.error(this.props.updateBannerIndicesResponse.error.message);
      } else {
        message.success('Updated Successfully', 1.5).then(() => {
          window.location.reload();
        });
      }
    });

    // gameOrder.forEach(element => {
    //   gameIds.push(element.id);
    // });
    // this.props.actions.setGameOrder(gameIds, this.state.gameType).then(() => {
    //   window.location.reload();
    // });
  };

  render() {
    const removeItem = (data, index) => {
      const sourceClone = Array.from(this.state.items);
      let removed = sourceClone.splice(index, 1);
      const destClone = Array.from(this.state.newData);
      destClone.push(removed[0]);
      this.setState({
        items: sourceClone,
        newData: destClone
      });
    };
    const hideModal = () => {
      this.setState({
        showModal: false
      });
    };
    const handleOk = () => {
      this.setState({
        showModal: false
      });
    };
    return (
      <React.Fragment>
        <Modal
          title={'Banner Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal}
          onOk={handleOk}
          visible={this.state.showModal}
        >
          <Card bordered={false}>{this.state.bannerDetails}</Card>
        </Modal>
        <Card title="Select App Type and Location">
          <Row>
            <Col span={8}>
              <Select
                showSearch
                onSelect={this.selectLocation}
                style={{ width: 200 }}
                placeholder="Select a location"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {locationList}
              </Select>
            </Col>
            <Col span={8}>
              <Select
                showSearch
                onSelect={this.selectAppType}
                style={{ width: 200 }}
                placeholder="Select a app type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {appTypeList}
              </Select>
            </Col>
            <Col span={4}>
              <Input
                style={{ width: '90%', margin: '5px' }}
                placeholder="Country Code"
                onChange={e => this.changeCountryCode(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={() => this.getBannerList()}>
                Get Banners
              </Button>
            </Col>
          </Row>
        </Card>
        {this.state.showBanners ? (
          <React.Fragment>
            <Card>
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
                    <Card title="Inactive List">
                      {this.state.showBanners ? (
                        <Droppable
                          isDropDisabled={true}
                          droppableId="droppable2"
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              style={getListStyle(snapshot.isDraggingOver)}
                            >
                              {this.state.inActiveList.map((item, index) => (
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
                                      <div>
                                        <img
                                          style={{
                                            width: 'auto',
                                            height: '65px',
                                            borderRadius: '5px'
                                          }}
                                          src={item.imageUrl}
                                          alt=""
                                        />
                                      </div>
                                      <div>{item.tier}</div>
                                      <span>
                                        <Button
                                          shape="circle"
                                          icon="info"
                                          onClick={() => this.showDetails(item)}
                                          type="primary"
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
                    <Card title="Active List">
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
                                    <div>
                                      <img
                                        style={{
                                          width: 'auto',
                                          height: '65px',
                                          borderRadius: '5px'
                                        }}
                                        src={item.imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <div>{item.tier}</div>

                                    <span>
                                      <Button
                                        shape="circle"
                                        icon="info"
                                        onClick={() => this.showDetails(item)}
                                        type="primary"
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
    bannerList: state.banner.list,
    updateBannerIndicesResponse: state.banner.updateBannerIndicesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bannerActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BannerOrder);
