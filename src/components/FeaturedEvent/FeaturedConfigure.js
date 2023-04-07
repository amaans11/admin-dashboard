import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as featuredConfigActions from '../../actions/featuredConfigActions';
import * as gameActions from '../../actions/gameActions';
import {
  Card,
  Select,
  Button,
  InputNumber,
  Input,
  message,
  Row,
  Col,
  Modal,
  Table,
  Divider,
  Popconfirm,
  DatePicker
} from 'antd';
import _ from 'lodash';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const EventTypes = [
  'TOURNAMENT_CONFIG',
  'FANTASY_CONTEST',
  'FANTASY_MATCH',
  'AUDIO_ROOM',
  'AUDIO_SHOW',
  'AUDIO_HOST',
  'LIVE_STREAM',
].map(val => (
  <Option value={val} key={val}>
    {val}
  </Option>
));

const CategoryList = ['CROSS_SELL_EVENT', 'UPSELL_EVENT', 'BUSINESS_EVENT'].map(
  val => (
    <Option value={val} key={val}>
      {val}
    </Option>
  )
);

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class FeaturedConfigure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedConfig: [],
      showAddEditEventModal: false,
      selectedRecord: {},
      showTable: false,
      gamesList: [],
      startTime: 0,
      endTime: 0,
      eventType: ''
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // this.getFeaturedEvent();
    this.getGamesList();
  }

  selectCountry(value) {
    this.setState(
      {
        showTable: false,
        selectedConfig: [],
        featuredConfig: {},
        countryCode: value
      },
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
        console.log(featuredConfig);
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
          selectedConfig: [...tableData],
          showTable: true,
          featuredConfig: { ...featuredConfig }
        });
      }
    });
  }

  getGamesList() {
    const gamesList = [];
    this.props.actions.fetchGames().then(() => {
      if (this.props.gamesList) {
        gamesList.push(
          <Option key={'game' + 0} value={0}>
            None
          </Option>
        );
        this.props.gamesList.map(game => {
          gamesList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
      }
    });
    this.setState({
      gamesList
    });
  }

  deleteRow(record) {
    let tableData =
      this.state.selectedConfig.length > 0
        ? [...this.state.selectedConfig]
        : [];
    let objIndex = _.findIndex(tableData, function(item) {
      return item.id === record.id;
    });
    if (objIndex > -1) {
      tableData.splice(objIndex, 1);
    }
    let configData = [];
    _.forEach(tableData, function(item, index) {
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
      configData.push(cursor);
    });
    this.setState({ selectedConfig: [...configData] });
  }

  openAddEditEventModal(actionType, record) {
    if (actionType === 'EDIT') {
      this.setState({
        id: record.id,
        type: record.type,
        configId: record.configId ? record.configId : 0,
        contestId: record.contestId ? record.contestId : 0,
        matchId: record.matchId ? record.matchId : 0,
        sportId: record.sportId ? record.sportId : 0,
        roomId: record.roomId ? record.roomId : null,
        hostData: record.hostData ? record.hostData : null,
        streamId: record.streamId ? record.streamId : null,
        gameId: record.gameId ? record.gameId : 0,
        category: record.category ? record.category : null,
        entryFee: record.entryFee ? record.entryFee : 0,
        startTime: record.startTime ? record.startTime : 0,
        endTime: record.endTime ? record.endTime : 0,
        eventType: record.eventType ? record.eventType : '',
        actionType: actionType,
        showAddEditEventModal: true
      });
    } else {
      this.setState({
        actionType: actionType,
        showAddEditEventModal: true
      });
    }
  }

  resetFields() {
    this.setState({
      id: null,
      type: null,
      configId: null,
      contestId: null,
      matchId: null,
      sportId: null,
      roomId: null,
      hostData: null,
      streamId: null,
      gameId: 0,
      category: null,
      entryFee: 0,
      actionType: null,
      startTime: 0,
      endTime: 0,
      eventType: ''
    });
  }

  closeAddEditEventModal() {
    this.resetFields();
    this.setState({ showAddEditEventModal: false });
  }

  saveChanges() {
    if (!this.state.type || !this.state.category) {
      message.error('Category and type are mandatory fields');
      return;
    }
    let tableData =
      this.state.selectedConfig.length > 0
        ? [...this.state.selectedConfig]
        : [];
    if (this.state.actionType === 'EDIT') {
      let id = this.state.id;
      let objIndex = _.findIndex(tableData, function(item) {
        return item.id === id;
      });
      if (objIndex !== -1) {
        tableData[objIndex].id = this.state.id;
        tableData[objIndex].type = this.state.type;
        tableData[objIndex].configId = this.state.configId;
        tableData[objIndex].contestId = this.state.contestId;
        tableData[objIndex].matchId = this.state.matchId;
        tableData[objIndex].sportId = this.state.sportId;
        tableData[objIndex].roomId = this.state.roomId;
        tableData[objIndex].hostData = this.state.hostData;
        tableData[objIndex].streamId = this.state.streamId;
        tableData[objIndex].gameId = this.state.gameId;
        tableData[objIndex].category = this.state.category;
        tableData[objIndex].entryFee = this.state.entryFee;
        tableData[objIndex].startTime = this.state.startTime;
        tableData[objIndex].endTime = this.state.endTime;
        tableData[objIndex].eventType = this.state.eventType;
      }
    } else {
      let newRecord = {
        id: tableData.length + 1,
        type: this.state.type,
        configId: this.state.configId ? this.state.configId : 0,
        contestId: this.state.contestId ? this.state.contestId : 0,
        matchId: this.state.matchId ? this.state.matchId : 0,
        sportId: this.state.sportId ? this.state.sportId : 0,
        roomId: this.state.roomId ? this.state.roomId : null,
        hostData: this.state.hostData ? this.state.hostData : null,
        streamId: this.state.streamId ? this.state.streamId : null,
        gameId: this.state.gameId ? this.state.gameId : null,
        category: this.state.category ? this.state.category : null,
        entryFee: this.state.entryFee ? this.state.entryFee : null,
        startTime: this.state.startTime ? this.state.startTime : 0,
        endTime: this.state.endTime ? this.state.endTime : 0,
        eventType: this.state.eventType ? this.state.eventType : ''
      };
      tableData.push(newRecord);
      this.setState({ currentId: newRecord.id });
    }
    this.setState({
      selectedConfig: [...tableData],
      showAddEditEventModal: false,
      showTable: true
    });
    this.resetFields();
  }

  updateValues(value, valueType) {
    console.log(value, valueType);
    switch (valueType) {
      case 'TYPE':
        this.setState({ type: value });
        break;
      case 'CONFIG_ID':
        this.setState({ configId: value });
        break;
      case 'CONTEST_ID':
        this.setState({ contestId: value });
        break;
      case 'MATCH_ID':
        this.setState({ matchId: value });
        break;
      case 'SPORT_ID':
        this.setState({ sportId: value });
        break;
      case 'ROOM_ID':
        this.setState({ roomId: value });
        break;
      case 'HOST_DATA':
        this.setState({ hostData: value });
        break;
      case 'STREAM_ID':
        this.setState({ streamId: value });
        break;
      case 'GAME_ID':
        this.setState({ gameId: value });
        break;
      case 'CATEGORY':
        this.setState({ category: value });
        break;
      case 'ENTRY_FEE':
        this.setState({ entryFee: value });
        break;
      case 'DATE_RANGE':
        let startTime = value[0] ? value[0].format('x').toString() : 0;
        let endTime = value[1] ? value[1].format('x').toString() : 0;
        startTime = Number(startTime);
        endTime = Number(endTime);
        this.setState({ startTime, endTime });
        break;
      case 'EVENT_TYPE':
        this.setState({ eventType: value });
        break;
      default:
        break;
    }
  }

  updateFeaturedEvent() {
    let configData = [];
    let selectedConfig = [...this.state.selectedConfig];
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

  disabledDate = current => {
    // Can not select days before today
    return current && current < moment().startOf('day');
  };

  render() {
    const configColumns = [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Config Id',
        key: 'configId',
        render: (text, record) => <span>{record.configId}</span>
      },
      {
        title: 'Contest Id',
        key: 'contestId',
        render: (text, record) => <span>{record.contestId}</span>
      },
      {
        title: 'Match Id',
        key: 'matchId',
        render: (text, record) => <span>{record.matchId}</span>
      },
      {
        title: 'Sport Id',
        key: 'sportId',
        render: (text, record) => <span>{record.sportId}</span>
      },
      {
        title: 'Room Id',
        key: 'roomId',
        render: (text, record) => <span>{record.roomId}</span>
      },
      {
        title: 'Host Data',
        key: 'hostData',
        render: (text, record) => <span>{record.hostData}</span>
      },
      {
        title: 'Stream Id',
        key: 'streamId',
        render: (text, record) => <span>{record.streamId}</span>
      },
      {
        title: 'Game Id',
        key: 'gameId',
        render: (text, record) => <span>{record.gameId}</span>
      },
      {
        title: 'Category',
        key: 'category',
        render: (text, record) => <span>{record.category}</span>
      },
      {
        title: 'Entry Fee',
        key: 'entryFee',
        render: (text, record) => <span>{record.entryFee}</span>
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              icon="edit"
              type="primary"
              onClick={() => this.openAddEditEventModal('EDIT', record)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete this record?"
              onConfirm={() => this.deleteRow(record)}
            >
              <Button icon="delete" type="danger" />
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Card title="Featured Config">
          <Row style={{ marginBottom: '1rem' }}>
            <Col span={12}>
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
          </Row>

          {this.state.showTable && (
            <Card
              title="Featured Events"
              extra={
                <Button
                  type="primary"
                  onClick={() => this.updateFeaturedEvent()}
                >
                  Save and Publish
                </Button>
              }
            >
              <Button
                onClick={() => this.openAddEditEventModal('NEW')}
                style={{ backgroundColor: '#39bf5e' }}
              >
                {' '}
                Add Event
              </Button>
              <Table
                rowKey="id"
                style={{ marginTop: '20px' }}
                bordered
                pagination={false}
                dataSource={this.state.selectedConfig}
                columns={configColumns}
                scroll={{ x: '100%' }}
              />
            </Card>
          )}
        </Card>
        <Modal
          title={'Config change modal'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeAddEditEventModal()}
          onOk={() => this.saveChanges()}
          okText="Save"
          visible={this.state.showAddEditEventModal}
        >
          <Card>
            <Row>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px'
                }}
              >
                Select type:
              </Col>
              <Col span={14}>
                <Select
                  value={this.state.type ? this.state.type : null}
                  showSearch
                  onSelect={e => this.updateValues(e, 'TYPE')}
                  style={{ width: '80%' }}
                  placeholder="Event types"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {EventTypes}
                </Select>
              </Col>
              {this.state.type === 'TOURNAMENT_CONFIG' && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Config Id:
                  </Col>
                  <Col span={14}>
                    <InputNumber
                      style={{ marginTop: '12px', width: '80%' }}
                      value={this.state.configId ? this.state.configId : null}
                      onChange={e => this.updateValues(e, 'CONFIG_ID')}
                    />
                  </Col>
                </>
              )}
              {this.state.type === 'FANTASY_CONTEST' && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Contest Id:
                  </Col>
                  <Col span={14}>
                    <InputNumber
                      style={{ marginTop: '12px', width: '80%' }}
                      value={this.state.contestId ? this.state.contestId : null}
                      onChange={e => this.updateValues(e, 'CONTEST_ID')}
                    />
                  </Col>
                </>
              )}
              {(this.state.type === 'FANTASY_CONTEST' ||
                this.state.type === 'FANTASY_MATCH') && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Match Id:
                  </Col>
                  <Col span={14}>
                    <InputNumber
                      style={{ marginTop: '12px', width: '80%' }}
                      value={this.state.matchId ? this.state.matchId : null}
                      onChange={e => this.updateValues(e, 'MATCH_ID')}
                    />
                  </Col>
                </>
              )}
              {(this.state.type === 'FANTASY_CONTEST' ||
                this.state.type === 'FANTASY_MATCH') && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Sport Id:
                  </Col>
                  <Col span={14}>
                    <InputNumber
                      style={{ marginTop: '12px', width: '80%' }}
                      value={this.state.sportId ? this.state.sportId : null}
                      onChange={e => this.updateValues(e, 'SPORT_ID')}
                    />
                  </Col>
                </>
              )}
              {this.state.type === 'AUDIO_ROOM' && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Room Id:
                  </Col>
                  <Col span={14}>
                    <Input
                      style={{ marginTop: '12px', width: '80%' }}
                      value={this.state.roomId ? this.state.roomId : null}
                      onChange={e =>
                        this.updateValues(e.target.value, 'ROOM_ID')
                      }
                    />
                  </Col>
                </>
              )}

              {(this.state.type === 'AUDIO_SHOW' ||
                this.state.type === 'AUDIO_HOST') && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Host Data:
                  </Col>
                  <Col span={14}>
                    <Input
                      style={{ marginTop: '12px', width: '80%' }}
                      value={this.state.hostData ? this.state.hostData : null}
                      onChange={e =>
                        this.updateValues(e.target.value, 'HOST_DATA')
                      }
                    />
                  </Col>
                </>
              )}
              {this.state.type === 'LIVE_STREAM' && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                    Stream Id:
                  </Col>
                  <Col span={14}>
                    <Input
                      style={{ marginTop: '12px', width: '80%' }}
                      value={this.state.streamId ? this.state.streamId : null}
                      onChange={e =>
                        this.updateValues(e.target.value, 'STREAM_ID')
                      }
                    />
                  </Col>
                </>
              )}
              {this.state.type === 'Hashtag' && (
                <>
                  <Col
                    span={6}
                    style={{
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px',
                      marginTop: '12px'
                    }}
                  >
                     HashTag Id:
                  </Col>
                  <Col span={14}>
                    <Input
                      style={{ marginTop: '12px', width: '80%' }}
                      value={
                        this.state.HashTagId ? this.state.HashTagId : null
                      }
                      onChange={e =>
                        this.updateValues(e.target.value, 'HASHTAG')
                      }
                    />
                  </Col>
                </>
              )}
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '12px'
                }}
              >
                Game:
              </Col>
              <Col span={14}>
                <Select
                  value={this.state.gameId ? this.state.gameId : 0}
                  showSearch
                  onSelect={e => this.updateValues(e, 'GAME_ID')}
                  style={{ marginTop: '12px', width: '80%' }}
                  placeholder="Game list"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.gamesList}
                </Select>
              </Col>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '12px'
                }}
              >
                Category:
              </Col>
              <Col span={14}>
                <Select
                  value={this.state.category ? this.state.category : null}
                  showSearch
                  onSelect={e => this.updateValues(e, 'CATEGORY')}
                  style={{ marginTop: '12px', width: '80%' }}
                  placeholder="Select Category"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {CategoryList}
                </Select>
              </Col>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '12px'
                }}
              >
                Entry Fee:
              </Col>
              <Col span={14}>
                <InputNumber
                  style={{ marginTop: '12px', width: '80%' }}
                  value={this.state.entryFee ? this.state.entryFee : 0}
                  onChange={e => this.updateValues(e, 'ENTRY_FEE')}
                />
              </Col>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '12px'
                }}
              >
                Start/End Time:
              </Col>
              <Col span={14}>
                <RangePicker
                  style={{ marginTop: '12px', width: '80%' }}
                  disabledDate={this.disabledDate}
                  allowClear="true"
                  format="YYYY-MM-DD hh:mm:ss A"
                  placeholder={['Start date-time', 'End date-time']}
                  onChange={e => this.updateValues(e, 'DATE_RANGE')}
                  showTime
                  value={
                    this.state.startTime && this.state.endTime
                      ? [
                          moment(parseInt(this.state.startTime, 10)),
                          moment(parseInt(this.state.endTime, 10))
                        ]
                      : []
                  }
                />
              </Col>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px',
                  marginTop: '12px'
                }}
              >
                Event Type:
              </Col>
              <Col span={14}>
                <Input
                  style={{ marginTop: '12px', width: '80%' }}
                  value={this.state.eventType ? this.state.eventType : ''}
                  onChange={e =>
                    this.updateValues(e.target.value, 'EVENT_TYPE')
                  }
                  placeholder="Enter event type"
                />
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    getFeaturedEventResponse: state.featuredConfig.getFeaturedEventResponse,
    updateFeaturedEventResponse:
      state.featuredConfig.updateFeaturedEventResponse,
    gamesList: state.games.allGames
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...featuredConfigActions,
        ...gameActions
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedConfigure);
