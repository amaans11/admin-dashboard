import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../../actions/gameActions';
import * as segmentationActions from '../../actions/segmentationActions';
import {
  Card,
  Select,
  Form,
  Button,
  InputNumber,
  message,
  Row,
  Col,
  Radio,
  Tag,
  Icon
} from 'antd';
import _ from 'lodash';

const { Option } = Select;
class AddGameToCustomSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameListFetched: false,
      selectedGameId: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getCurrentHomeConfig();
    this.getGamesList();
  }

  getCurrentHomeConfig() {
    this.props.actions.getCurrentHomeConfig().then(() => {
      if (this.props.getCurrentHomeConfigResponse) {
        let homeSegmentConfig = JSON.parse(
          this.props.getCurrentHomeConfigResponse
        );
        this.setState(
          { homeSegmentConfig: { ...homeSegmentConfig.homeSegmentConfig } },
          () => {
            let list = Object.keys(this.state.homeSegmentConfig);
            let segmentListOption = [];
            list.map(item => {
              segmentListOption.push(
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            });
            this.setState({ segmentListOption, segmentList: [...list] });
          }
        );
      }
    });
  }

  getGamesList() {
    this.props.actions.getGameOrder('COMBINED').then(() => {
      if (
        this.props.games &&
        this.props.games.gameOrder &&
        this.props.games.gameOrder.games
      ) {
        let gameList = [];
        this.props.games.gameOrder.games.map(game => {
          gameList.push(
            <Option key={game.id} value={game.id}>
              {game.name} ({game.id})
            </Option>
          );
        });
        this.setState({
          gameList,
          gameListFetched: true
        });
      }
    });
  }

  selectGame(value) {
    this.setState({ selectedGameId: value });
  }

  selectSegments(value) {
    this.setState({ selectedSegmentIds: [...value] });
  }

  inputGameIndex(value) {
    this.setState({ gameIndex: value });
  }

  selectAllSegments() {
    this.setState({ selectedSegmentIds: [...this.state.segmentList] });
  }

  handleSubmit() {
    let homeSegmentConfig = { ...this.state.homeSegmentConfig };
    let vm = this;
    _.forEach(this.state.selectedSegmentIds, function(item) {
      let currentActiveGames = [
        ...vm.state.homeSegmentConfig[item]['DEFAULT']['activeGames']
      ];
      if (currentActiveGames.includes(vm.state.selectedGameId)) {
        currentActiveGames = currentActiveGames.filter(
          item => item !== vm.state.selectedGameId
        );
        currentActiveGames.splice(
          vm.state.gameIndex,
          0,
          vm.state.selectedGameId
        );
      } else {
        currentActiveGames.splice(
          vm.state.gameIndex,
          0,
          vm.state.selectedGameId
        );
      }
      homeSegmentConfig[item]['DEFAULT']['activeGames'] = [
        ...currentActiveGames
      ];
    });
    let data = {
      homeSegmentConfig: { ...homeSegmentConfig }
    };
    this.props.actions.addGameToAllCustomSegment(data).then(() => {
      if (
        this.props.addGameToAllCustomSegmentResponse &&
        this.props.addGameToAllCustomSegmentResponse.success
      ) {
        message
          .success(
            'Successfully updated the game index for all the segments',
            1.5
          )
          .then(() => {
            window.location.reload();
          });
      } else {
        message.error('Could not update the segments');
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Form>
          <Card title="Add Game to Segments">
            {this.state.gameListFetched && (
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
                  Select Game:
                </Col>
                <Col span={14}>
                  <Select
                    showSearch
                    onSelect={e => this.selectGame(e)}
                    style={{ width: '80%' }}
                    placeholder="Select a game"
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
              </Row>
            )}
            {this.state.selectedGameId && (
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
                    Game Index:
                  </Col>
                  <Col span={14}>
                    <InputNumber
                      style={{ width: '80%' }}
                      min={0}
                      onChange={e => this.inputGameIndex(e)}
                    />
                  </Col>
                  <Col
                    span={6}
                    style={{
                      marginTop: '20px',
                      textAlign: 'right',
                      lineHeight: '30px',
                      color: 'rgba(0, 0, 0, .85)',
                      paddingRight: '10px'
                    }}
                  >
                    Select Segments:
                  </Col>
                  <Col
                    span={14}
                    style={{
                      marginTop: '20px'
                    }}
                  >
                    <Select
                      allowClear={true}
                      showSearch
                      mode="multiple"
                      onChange={e => this.selectSegments(e)}
                      value={this.state.selectedSegmentIds}
                      style={{ width: '80%' }}
                      placeholder="Select applicable segments"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.segmentListOption}
                    </Select>
                    <Button
                      style={{ marginLeft: '5px' }}
                      size="small"
                      onClick={() => this.selectAllSegments()}
                    >
                      Select All
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} offset={12} style={{ marginTop: '20px' }}>
                    <Button
                      style={{ float: 'none' }}
                      type="primary"
                      onClick={() => this.handleSubmit()}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCurrentHomeConfigResponse:
      state.segmentation.getCurrentHomeConfigResponse,
    getCustomSegmentListResponse:
      state.segmentation.getCustomSegmentListResponse,
    updateSegmentHomeConfigResponse:
      state.segmentation.updateSegmentHomeConfigResponse,
    gamesList: state.games.allGames,
    games: state.games,
    addGameToAllCustomSegmentResponse:
      state.segmentation.addGameToAllCustomSegmentResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...gameActions,
        ...segmentationActions
      },
      dispatch
    )
  };
}
const AddGameToCustomSegmentForm = Form.create()(AddGameToCustomSegment);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGameToCustomSegmentForm);
