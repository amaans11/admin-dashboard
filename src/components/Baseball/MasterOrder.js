import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseballActions from '../../actions/BaseballActions';
import _ from 'lodash';
import TOKEN from '../../assets/ic_coins.png';
import CASH from '../../assets/ic_cash.png';
import { Helmet } from 'react-helmet';
import {
  Card,
  Form,
  Select,
  Tooltip,
  Icon,
  Button,
  Row,
  Col,
  message
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FormItem = Form.Item;
const Option = Select.Option;
// a little function to help us with reordering the result
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

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class MasterOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchList: [],
      contestList: [],
      showContests: false,
      items: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMasterContestDetails = this.getMasterContestDetails.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.orderListAsc = this.orderListAsc.bind(this);
    this.orderListDesc = this.orderListDesc.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.getMasterContestDetails();
  }

  getMasterContestDetails() {
    this.props.actions.getMasterContestDetails().then(() => {
      if (this.props.getMasterContestsDetailsResponse) {
        if (
          this.props.getMasterContestsDetailsResponse &&
          this.props.getMasterContestsDetailsResponse.error
        ) {
          message.error(
            this.props.getMasterContestsDetailsResponse.error.message
          );
        } else {
          if (
            this.props.getMasterContestsDetailsResponse &&
            this.props.getMasterContestsDetailsResponse.contestDetailDashboard
          ) {
            this.setState({
              contestList: [
                ...this.props.getMasterContestsDetailsResponse
                  .contestDetailDashboard
              ],
              items: _.sortBy(
                Array.from(
                  this.props.getMasterContestsDetailsResponse
                    .contestDetailDashboard
                ),
                ['orderId'],
                ['asc']
              ),
              showContests: true
            });
          }
        }
      }
    });
    this.setState({ showContests: true });
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

  orderListAsc() {
    let list = [...this.state.items];
    let sortedList = _.orderBy(list, [
      function(item) {
        return item.slotsFilled - item.totalSlots === 0;
      },
      'registrationFeesType',
      function(item) {
        return item.registrationFees || 0;
      }
    ]);
    this.setState({ items: sortedList });
  }
  orderListDesc() {
    let list = [...this.state.items];
    let sortedList = _.orderBy(
      list,
      [
        function(item) {
          return item.slotsFilled - item.totalSlots === 0;
        },
        'registrationFeesType',
        function(item) {
          return item.registrationFees || 0;
        }
      ],
      ['asc', 'asc', 'desc']
    );
    this.setState({ items: sortedList });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let orderMap = {};
        this.state.items.forEach(function(item, index) {
          orderMap[item.id] = index + 11;
        });
        let data = {
          orderMap: orderMap
        };
        this.props.actions.updateMasterContestOrder(data).then(() => {
          if (this.props.updateMasterContestOrderResponse) {
            if (this.props.updateMasterContestOrderResponse.error) {
              message.error('Could not update the order');
            } else {
              message.success('Updated Successfully');
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
      matchId: isFieldTouched('matchId') && getFieldError('matchId')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Create Contest| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Create Match Contest">
            <Row>
              <Col span={6}>
                <Button onClick={() => this.orderListAsc()}>Order Asc</Button>
              </Col>
              <Col span={6}>
                <Button onClick={() => this.orderListDesc()}>Order Desc</Button>
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Save
                </Button>
              </Col>
            </Row>
            <Card>
              {this.state.showContests && (
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
                                className={
                                  item.slotsFilled === item.totalSlots
                                    ? 'contest-full fantasy-order'
                                    : 'fantasy-order'
                                }
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <div>{item.name}</div>
                                <div>Teams Allowed:{item.totalSlots}</div>
                                <div>
                                  Slots:{' '}
                                  {item.slotsFilled ? item.slotsFilled : 0}/
                                  {item.totalSlots}
                                </div>
                                <div>
                                  Bonus Limit:
                                  {item.bonusCapPercentage
                                    ? item.bonusCapPercentage
                                    : 0}
                                </div>
                                <div>
                                  <span>
                                    {item.registrationFees
                                      ? item.registrationFees
                                      : 0}
                                  </span>
                                  <span>
                                    <img
                                      src={
                                        item.registrationFeesType === 'Token'
                                          ? TOKEN
                                          : CASH
                                      }
                                      alt=""
                                    />
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </Card>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getMasterContestsDetailsResponse:
      state.baseball.getMasterContestsDetailsResponse,
    updateMasterContestOrderResponse:
      state.baseball.updateMasterContestOrderResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...baseballActions }, dispatch)
  };
}
const MasterOrderForm = Form.create()(MasterOrder);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MasterOrderForm);
