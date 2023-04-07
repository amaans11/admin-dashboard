// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as bannerActions from '../../actions/bannerActions';
import * as segmentationActions from '../../actions/segmentationActions';
import * as gameActions from '../../actions/gameActions';
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
import moment from 'moment';

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

class BannerOrderNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBanners: false,
      segmentList: [],
      inActiveList: [],
      activeList: [],
      segmentListFetched: false,
      selectedSegment: 'DEFAULT##DEFAULT',
      selectedLocation: null,
      selectedGame: null,
      selectedAppType: null,
      countryCode: null,
      showModal: false,
      bannerDetails: {}
    };
    this.getBannerOrder = this.getBannerOrder.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchSegmentList();
  }

  fetchSegmentList() {
    let segmentList = [];
    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment &&
        this.props.getCustomSegmentListResponse.segment.length > 0
      ) {
        this.props.getCustomSegmentListResponse.segment.map(segment => {
          segmentList.push(
            <Option key={segment.segmentId} value={segment.segmentId}>
              {segment.segmentName}
            </Option>
          );
        });
        this.setState({ segmentList, segmentListFetched: true });
      } else {
        segmentList.push(
          <Option key={'DEFAULT##DEFAULT'} value={'DEFAULT##DEFAULT'}>
            DEFAULT
          </Option>
        );
        this.setState({ segmentList, segmentListFetched: true });
      }
    });
  }

  selectAppType(appType) {
    this.setState({ selectedAppType: appType });
  }

  selectLocation(location) {
    if (location === 'GAMES') {
      this.getAllGames();
    }
    this.setState({ selectedLocation: location });
  }

  selectSegment(value) {
    this.setState({ selectedSegment: value });
  }

  selectGame(value) {
    this.setState({ selectedGame: value });
  }

  changeCountryCode(value) {
    this.setState({ countryCode: value });
  }

  getAllGames() {
    var gameList = [];
    this.props.actions.fetchGames().then(() => {
      this.props.gamesList.map(game => {
        gameList.push(
          <Option key={'game' + game.id} value={game.id}>
            {game.name}( {game.id} )
          </Option>
        );
      });
    });
    this.setState({
      gameList
    });
  }

  showDetails(item) {
    this.setState({
      showModal: true,
      bannerDetails: item ? JSON.stringify(item) : 'No details found'
    });
  }

  getBannerOrder() {
    this.setState({
      activeList: [],
      inActiveList: [],
      showBanners: false
    });
    if (
      !this.state.selectedAppType ||
      !this.state.selectedLocation ||
      !this.state.countryCode
    ) {
      message.error(
        'Please select App Type, Location and country code to fetch list of banners'
      );
    } else {
      let data = {
        segmentId: this.state.selectedSegment,
        locationType: this.state.selectedLocation,
        gameId: this.state.selectedGame ? this.state.selectedGame : 0,
        appType: this.state.selectedAppType,
        countryCode: this.state.countryCode
      };
      this.props.actions.getBannerOrder(data).then(() => {
        if (this.props.getBannerOrderResponse) {
          let inActiveList =
            this.props.getBannerOrderResponse.inActive &&
            this.props.getBannerOrderResponse.inActive.length > 0
              ? [...this.props.getBannerOrderResponse.inActive]
              : [];
          let activeList =
            this.props.getBannerOrderResponse.active &&
            this.props.getBannerOrderResponse.active.length > 0
              ? [...this.props.getBannerOrderResponse.active]
              : [];
          this.setState({
            activeList: [...activeList],
            inActiveList: [...inActiveList],
            showBanners: true
          });
        }
      });
    }
  }

  onDragEnd = result => {
    const { source, destination } = result;
    var vm = this;
    if (!destination) {
      message.info('This action is prohibited', 2);
      return;
    } // return;
    if (source.droppableId === destination.droppableId) {
      const activeList = reorder(
        this.state.activeList,
        source.index,
        destination.index
      );
      this.setState({
        activeList
      });
    } else {
      const result = move(
        this.state.inActiveList,
        this.state.activeList,
        source,
        destination
      );
      this.setState({
        activeList: result.droppable,
        inActiveList: [...result.droppable2]
      });
    }
  };

  removeItem(index) {
    const sourceClone = [...this.state.activeList];
    let removed = sourceClone.splice(index, 1);
    const destClone =
      this.state.inActiveList.length > 0 ? [...this.state.inActiveList] : [];
    destClone.push(removed[0]);
    this.setState({
      activeList: sourceClone,
      inActiveList: destClone
    });
  }

  publish() {
    let active =
      this.state.activeList.length > 0
        ? this.state.activeList.map(item => item.id)
        : [];
    let inActive =
      this.state.inActiveList.length > 0
        ? this.state.inActiveList.map(item => item.id)
        : [];
    let bannerOrdering = {
      active: active,
      inActive: inActive
    };
    let data = {
      segmentId: this.state.selectedSegment,
      locationType: this.state.selectedLocation,
      gameId: this.state.selectedGame ? this.state.selectedGame : 0,
      appType: this.state.selectedAppType,
      countryCode: this.state.countryCode,
      bannerOrdering: { ...bannerOrdering }
    };

    this.props.actions.updateBannerOrder(data).then(() => {
      if (
        this.props.updateBannerOrderResponse &&
        this.props.updateBannerOrderResponse.error
      ) {
        message.error(
          this.props.updateBannerOrderResponse.error.message
            ? this.props.updateBannerOrderResponse.error.message
            : 'Could not update banner ordering'
        );
      } else {
        message.success('Updated Successfully', 1.5).then(() => {
          this.getBannerOrder();
        });
      }
    });
  }

  render() {
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
        <Card title="Select Segment, App Type and Location">
          {this.state.segmentListFetched && (
            <Row>
              <Col span={8}>
                <Select
                  showSearch
                  defaultValue={this.state.selectedSegment}
                  onSelect={e => this.selectSegment(e)}
                  style={{ width: '90%', margin: '5px' }}
                  placeholder="Select a segment"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.segmentList}
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  showSearch
                  onSelect={e => this.selectLocation(e)}
                  style={{ width: '90%', margin: '5px' }}
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
              <Col span={4}>
                <Select
                  showSearch
                  onSelect={e => this.selectAppType(e)}
                  style={{ width: '90%', margin: '5px' }}
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
              {this.state.selectedLocation &&
                this.state.selectedLocation === 'GAMES' && (
                  <Col span={4}>
                    <Select
                      showSearch
                      onSelect={e => this.selectGame(e)}
                      style={{ width: '90%', margin: '5px' }}
                      placeholder="Select a game"
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
              <Col span={4}>
                <Input
                  style={{ width: '90%', margin: '5px' }}
                  placeholder="Country Code"
                  onChange={e => this.changeCountryCode(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={() => this.getBannerOrder()}>
                  Get Banners
                </Button>
              </Col>
            </Row>
          )}
        </Card>
        {this.state.showBanners && (
          <React.Fragment>
            <Card>
              <Row>
                <Col span={12}>
                  <Button type="primary" onClick={() => this.publish()}>
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
                                            height: '55px',
                                            borderRadius: '5px'
                                          }}
                                          src={item.imageUrl}
                                          alt=""
                                        />
                                      </div>
                                      <span>
                                        <Button
                                          size="small"
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
                            {this.state.activeList.map((item, index) => (
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
                                          height: '55px',
                                          borderRadius: '5px'
                                        }}
                                        src={item.imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <span>
                                      <Button
                                        size="small"
                                        shape="circle"
                                        icon="info"
                                        onClick={() => this.showDetails(item)}
                                        type="primary"
                                      />
                                      <Button
                                        style={{ marginLeft: '5px' }}
                                        size="small"
                                        shape="circle"
                                        icon="delete"
                                        onClick={() => this.removeItem(index)}
                                        type="danger"
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
        )}
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCustomSegmentListResponse:
      state.segmentation.getCustomSegmentListResponse,
    getBannerOrderResponse: state.banner.getBannerOrderResponse,
    updateBannerOrderResponse: state.banner.updateBannerOrderResponse,
    gamesList: state.games.allGames
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...bannerActions, ...segmentationActions, ...gameActions },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BannerOrderNew);
