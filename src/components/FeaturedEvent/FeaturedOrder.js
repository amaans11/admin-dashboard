import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as featuredConfigActions from '../../actions/featuredConfigActions';
import _ from 'lodash';
import { Helmet } from 'react-helmet';
import { Card, Form, message, Button, Row, Col, Select, Empty } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 850,
  margin: 'auto'
});

const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));
class FeaturedOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      countryCode: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState(
      { items: [], showOrderSetion: false, countryCode: value },
      () => {
        this.getFeaturedEvent();
      }
    );
  }

  getFeaturedEvent() {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getFeaturedEvent(data).then(() => {
      if (this.props.getFeaturedEventResponse) {
        let featuredConfig = JSON.parse(this.props.getFeaturedEventResponse)
          .featuredConfigOrder;
        let tableData = [];
        _.forEach(featuredConfig, function(item, index) {
          let cursor = {};
          cursor['id'] = index + 1;
          cursor['type'] = item.type;
          cursor['configId'] = item.configId ? item.configId : 0;
          cursor['contestId'] = item.contestId ? item.contestId : 0;
          cursor['matchId'] = item.matchId ? item.matchId : 0;
          cursor['sportId'] = item.sportId ? item.sportId : 0;
          cursor['roomId'] = item.roomId ? item.roomId : null;
          cursor['hostData'] = item.hostData ? item.hostData : null;
          cursor['streamId'] = item.streamId ? item.streamId : null;
          cursor['gameId'] = item.gameId ? item.gameId : 0;
          cursor['category'] = item.category ? item.category : null;
          cursor['entryFee'] = item.entryFee ? item.entryFee : 0;
          cursor['startTime'] = item.startTime ? item.startTime : 0;
          cursor['endTime'] = item.endTime ? item.endTime : 0;
          cursor['eventType'] = item.eventType ? item.eventType : '';
          tableData.push(cursor);
        });
        this.setState({
          items: [...tableData],
          showOrderSetion: true
        });
      }
    });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        let configData = [];
        let selectedConfig = [...this.state.items];
        _.forEach(selectedConfig, function(item) {
          let cursor = {};
          cursor['type'] = item.type;
          cursor['configId'] = item.configId ? item.configId : 0;
          cursor['contestId'] = item.contestId ? item.contestId : 0;
          cursor['matchId'] = item.matchId ? item.matchId : 0;
          cursor['sportId'] = item.sportId ? item.sportId : 0;
          cursor['roomId'] = item.roomId ? item.roomId : null;
          cursor['hostData'] = item.hostData ? item.hostData : null;
          cursor['streamId'] = item.streamId ? item.streamId : null;
          cursor['gameId'] = item.gameId ? item.gameId : 0;
          cursor['category'] = item.category ? item.category : null;
          cursor['entryFee'] = item.entryFee ? item.entryFee : 0;
          cursor['startTime'] = item.startTime ? item.startTime : 0;
          cursor['endTime'] = item.endTime ? item.endTime : 0;
          cursor['eventType'] = item.eventType ? item.eventType : '';
          configData.push(cursor);
        });

        let data = {
          config: [...configData],
          countryCode: this.state.countryCode
        };

        this.props.actions.updateFeaturedEvent(data).then(() => {
          if (
            this.props.updateFeaturedEventResponse &&
            this.props.updateFeaturedEventResponse.success
          ) {
            if (this.props.updateFeaturedEventResponse.success) {
              message
                .success('Updated the featured event configuration', 1.5)
                .then(() => {
                  window.location.reload();
                });
            } else {
              message.error('Could not update the featured event');
            }
          }
        });
      }
    });
  }

  render() {
    const { getFieldsError } = this.props.form;
    const { countryCode } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>Featured Event Order| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={12} style={{ margin: '20px', marginBottom: 0 }}>
              <Select
                showSearch
                onSelect={e => this.selectCountry(e)}
                style={{ width: '100%' }}
                placeholder="Select country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {CountryList}
              </Select>
            </Col>

            {countryCode ? (
              <Col span={24}>
                <Card
                  title="Featured Event Order"
                  extra={
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={hasErrors(getFieldsError())}
                    >
                      Save
                    </Button>
                  }
                >
                  {this.state.items &&
                  this.state.items.length &&
                  this.state.showOrderSetion ? (
                    <DragDropContext onDragEnd={this.onDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {this.state.items.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    <Row>
                                      <Col span={8}>Type: {item.type}</Col>
                                      <Col span={8}>
                                        Config Id:{item.configId}
                                      </Col>
                                      <Col span={8}>
                                        Contest Id:{item.contestId}
                                      </Col>
                                      <Col span={8}>
                                        Match Id:{item.matchId}
                                      </Col>
                                      <Col span={8}>
                                        Sport Id:{item.sportId}
                                      </Col>
                                      <Col span={8}>Room Id:{item.roomId}</Col>
                                      <Col span={8}>
                                        Host Data:{item.hostData}
                                      </Col>
                                      <Col span={8}>
                                        Stream ID:{item.streamId}
                                      </Col>
                                      <Col span={8}>
                                         HashTag Id:{item.HashTagId}
                                      </Col>
                                      <Col span={8}>Game Id:{item.gameId}</Col>
                                      <Col span={8}>
                                        Category:{item.category}
                                      </Col>
                                      <Col span={8}>
                                        Entry Fee:{item.entryFee}
                                      </Col>
                                      <Col span={8}>
                                        Start Time:
                                        {item.startTime
                                          ? moment(item.startTime).format(
                                              'YYYY-MM-DD hh:mm:ss A'
                                            )
                                          : ''}
                                      </Col>
                                      <Col span={8}>
                                        End Time:
                                        {item.endTime
                                          ? moment(item.endTime).format(
                                              'YYYY-MM-DD hh:mm:ss A'
                                            )
                                          : ''}
                                      </Col>
                                      <Col span={8}>
                                        Event Type: {item.eventType}
                                      </Col>
                                    </Row>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <Empty />
                  )}
                </Card>
              </Col>
            ) : (
              <Col span={24} style={{ margin: '20px' }}>
                Select a country from above
              </Col>
            )}
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    getFeaturedEventResponse: state.featuredConfig.getFeaturedEventResponse,
    updateFeaturedEventResponse:
      state.featuredConfig.updateFeaturedEventResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...featuredConfigActions }, dispatch)
  };
}
const FeaturedOrderForm = Form.create()(FeaturedOrder);
export default connect(mapStateToProps, mapDispatchToProps)(FeaturedOrderForm);
