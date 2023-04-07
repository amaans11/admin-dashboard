import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as kabaddiActions from '../../actions/KabaddiActions';
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
  message,
  Radio
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
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
class ContestOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchList: [],
      contestList: [],
      showContests: false,
      items: [],
      countryCode: 'ALL'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMatchList = this.getMatchList.bind(this);
    this.matchSelected = this.matchSelected.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.orderListAsc = this.orderListAsc.bind(this);
    this.orderListDesc = this.orderListDesc.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.getMatchList();
  }

  getMatchList() {
    let inputData = {
      type: '0'
    };
    let list = [];
    // Fetch existing configurations
    this.props.actions.getAllMatches(inputData).then(() => {
      if (this.props.matchList) {
        this.props.matchList.map(match => {
          list.push(
            <Option key={match.seasonGameUid} value={match.seasonGameUid}>
              {match.title}
            </Option>
          );
        });
      }
      this.setState({ matchList: list });
    });
  }

  selectCountry(value) {
    this.setState(
      {
        countryCode: value
      },
      () => {
        this.fetchDetails();
      }
    );
  }

  matchSelected(seasonGameUid) {
    this.setState(
      {
        seasonGameUid
      },
      () => {
        this.fetchDetails();
      }
    );
  }

  fetchDetails() {
    let data = {
      seasonGameUid: this.state.seasonGameUid,
      countryCode:
        this.state.countryCode === 'ALL' ? null : this.state.countryCode
    };
    this.props.actions.getMatchesOrdering(data).then(() => {
      if (
        this.props.getMatchesOrderingResponse &&
        this.props.getMatchesOrderingResponse.contests
      ) {
        this.setState({
          contestList: this.props.getMatchesOrderingResponse.contests,
          items: _.sortBy(
            Array.from(this.props.getMatchesOrderingResponse.contests),
            ['orderId'],
            ['asc']
          )
        });
        this.setState({ showContests: true });
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
    console.log('items', items);
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
    console.log('a', sortedList);
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
          matchId: values.matchId,
          orderMap: orderMap
        };
        this.props.actions.updateContestOrder(data).then(() => {
          message.info('Updated Successfully');
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
          <title>Create Contest|  Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Create Match Contest">
            <Row>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.matchId ? 'error' : ''}
                  help={errors.matchId || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Select Match
                      <Tooltip title="Select match for contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('matchId', {
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: 'Please select your Game!'
                      }
                    ]
                  })(
                    <Select
                      disabled={this.state.disableField}
                      showSearch
                      style={{ width: '100%' }}
                      onSelect={this.matchSelected}
                      placeholder="Select a Match"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.matchList}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <RadioGroup
                  buttonStyle="solid"
                  onChange={e => this.selectCountry(e.target.value)}
                  value={this.state.countryCode}
                >
                  <RadioButton value="ALL">ALL</RadioButton>
                  <RadioButton value="IN">IN</RadioButton>
                  <RadioButton value="ID">ID</RadioButton>
                  <RadioButton value="US">US</RadioButton>
                </RadioGroup>
              </Col>
              <Col span={2}>
                <Button onClick={() => this.orderListAsc()}>Order Asc</Button>
              </Col>
              <Col span={2}>
                <Button onClick={() => this.orderListDesc()}>Order Desc</Button>
              </Col>
              <Col span={2}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Save
                </Button>
              </Col>
            </Row>
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
                              <div>
                                Teams Allowed:
                                {item.teamLimit ? item.teamLimit : 0}
                              </div>
                              <div>
                                Slots: {item.slotsFilled ? item.slotsFilled : 0}
                                /{item.totalSlots}
                              </div>
                              <div>
                                Bonus Limit:
                                {item.bonusLimit ? item.bonusLimit : 0}
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
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    matchList: state.kabaddi.matches,
    allLineFormats: state.kabaddi.lineFormats,
    contests: state.kabaddi.contests,
    contestData: state.kabaddi.contestData,
    getMatchesOrderingResponse: state.kabaddi.getMatchesOrderingResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...kabaddiActions }, dispatch)
  };
}
const ContestOrderForm = Form.create()(ContestOrder);
export default connect(mapStateToProps, mapDispatchToProps)(ContestOrderForm);
