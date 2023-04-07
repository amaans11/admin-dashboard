// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../../actions/gameActions';
import * as videoActions from '../../actions/videoActions';
import moment from 'moment';
import {
  Table,
  Button,
  Card,
  Modal,
  message,
  Row,
  Col,
  Input,
  Icon,
  InputNumber,
  Select,
  Divider,
  Tooltip,
  Tag,
  DatePicker,
  Avatar,
  Radio,
  Popconfirm
} from 'antd';
import LimelightPlayerComp from './LimelightPlayerComp';
const gameList = [];
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// type GameplayVideoFilter ={}

class GameplayVideoFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: 'SCORE',
      start: 0,
      count: 10,
      filterValue: 'desc',
      startDate: moment().toISOString(),
      endDate: moment()
        .add(1, 'day')
        .toISOString()
    };
  }
  getGameList() {
    var gameList = [];
    if (!this.props.gameList && gameList.length === 0) {
      this.props.actions.fetchGames().then(() => {
        this.props.gamesList.map(game => {
          //   if (this.props.location.pathname.search("config") === 1) {
          if (game.tournamentSupported) {
            gameList.push(
              <Option key={'game' + game.id} value={game.id}>
                {game.name}
              </Option>
            );
          }
          //   } else {
          //     if (game.battleSupported) {
          //       gameList.push(
          //         <Option key={"game" + game.id} value={game.id}>
          //           {game.name}
          //         </Option>
          //       );
          //     }
          //   }
          // return true;
        });
      });
    }
    this.setState({
      gameList
    });
  }
  getVideos = () => {
    if (!this.state.gameId) {
      message.error('Select Game First', 2);
    } else {
      this.props.actions
        .getGameplayVideoByGame({
          gameId: this.state.gameId,
          start: this.state.start,
          count: this.state.count,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          filterType: this.state.filterType,
          filterValue: this.state.filterValue
        })
        .then(() => {});
    }
  };
  componentDidMount() {
    this.getGameList();
  }
  onChange(valType, val) {
    console.log(val);
    this.setState({
      [valType]: val
    });
  }
  render() {
    const gameSelected = gameId => {
      this.setState({
        gameId: gameId
      });
    };
    const onDateChange = (valType, val) => {
      this.setState({
        [valType]: val.toISOString()
      });
      // this.showBanners(
      //   e.toISOString(true).replace('+', '%2B'),
      //   this.state.appType,
      //   this.state.location
      // );
    };
    const onOrderChange = e => {
      this.setState({
        filterValue: e.target.value
      });
    };
    const onFilterChange = e => {
      this.setState({
        filterType: e.target.value
      });
    };
    return (
      <Card>
        <Row>
          <Col span={5}>
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
              {this.state.gameList}
            </Select>
          </Col>
          <Col span={12}>
            {/* filter Type */}
            <label>Filter Type: </label>
            <RadioGroup defaultValue="SCORE" onChange={onFilterChange}>
              <RadioButton value={'SCORE'}>Score</RadioButton>
              <RadioButton value={'REACTION'}>Reactions</RadioButton>
              <RadioButton value={'SHARE'}>Share</RadioButton>
              <RadioButton value={'USER'}>UserId</RadioButton>
              <RadioButton value={'TOURNAMENT'}>TournamnetId</RadioButton>
            </RadioGroup>
          </Col>{' '}
          <Col span={7}>
            {/* Filter Value */}
            {this.state.filterType === 'SCORE' ||
            this.state.filterType === 'REACTION' ||
            this.state.filterType === 'SHARE' ? (
              <React.Fragment>
                <label>Order Type: </label>
                <RadioGroup defaultValue="desc" onChange={onOrderChange}>
                  <RadioButton value={'asc'}>Ascending</RadioButton>
                  <RadioButton value={'desc'}>Descending</RadioButton>
                </RadioGroup>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Input
                  placeholder={'Enter Value'}
                  onChange={val => this.onChange(this.state.filterType, val)}
                />
              </React.Fragment>
            )}
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={5}>
            <DatePicker
              defaultValue={moment()}
              showTime
              format="YYYY-MM-DD HH:mm A"
              placeholder="Start Date/Time"
              onChange={val => onDateChange('endDate', val)}
            />
          </Col>
          <Col span={6}>
            <label>End Date: </label>
            <DatePicker
              showTime
              defaultValue={moment().add(1, 'day')}
              format="YYYY-MM-DD HH:mm A"
              placeholder="End Date/Time"
              onChange={val => onDateChange('endDate', val)}
            />
          </Col>
          <Col span={4}>
            <label>Start: </label>
            <InputNumber
              value={this.state.start}
              onChange={val => this.onChange('start', val)}
            />
          </Col>
          <Col span={4}>
            <label>Count : </label>
            <InputNumber
              value={this.state.count}
              onChange={val => this.onChange('count', val)}
            />
          </Col>
          <Col span={5}>
            <Button onClick={this.getVideos} type="primary">
              Get Leaderboard
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    video: state.video,
    gamesList: state.games.allGames
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...videoActions, ...gameActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameplayVideoFilter);
