import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../../actions/gameActions';
import { ChromePicker } from 'react-color';
import {
  Card,
  message,
  Select,
  Form,
  Input,
  Row,
  Col,
  Button,
  Icon
} from 'antd';

const gameList = [];
const { Option } = Select;

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class GameOrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      selectedGame: {},
      tagText: '',
      tagTextColor: '#FFFFF1',
      tagBgColor: '#FFFFF1',
      tagPsText: '',
      tagPsTextColor: '#FFFFF1',
      tagPsBgColor: '#FFFFF1',
      showConfig: false,
      gameList,
      showConfigModal: false,
      configDetails: {},
      countryCode: '',
      countrySelected: false
    };
    this.setTagTextColor = this.setTagTextColor.bind(this);
    this.setTagBgColor = this.setTagBgColor.bind(this);
    this.setTagPsTextColor = this.setTagPsTextColor.bind(this);
    this.setTagPsBgColor = this.setTagPsBgColor.bind(this);
    this.copyTagDetailsToTagPs = this.copyTagDetailsToTagPs.bind(this);
    this.resetTagDetails = this.resetTagDetails.bind(this);
    this.setTagText = this.setTagText.bind(this);
    this.setTagPsText = this.setTagPsText.bind(this);
    this.clearTagDetails = this.clearTagDetails.bind(this);
    this.clearTagPsDetails = this.clearTagPsDetails.bind(this);
  }

  clearTagDetails() {
    this.setState({ tagText: '' });
  }

  clearTagPsDetails() {
    this.setState({ tagPsText: '' });
  }

  setTagTextColor = (color, event) => {
    this.setState({ tagTextColor: color.hex });
  };

  setTagBgColor = (color, event) => {
    this.setState({ tagBgColor: color.hex });
  };

  setTagPsTextColor = (color, event) => {
    this.setState({ tagPsTextColor: color.hex });
  };

  setTagPsBgColor = (color, event) => {
    this.setState({ tagPsBgColor: color.hex });
  };

  setTagText = event => {
    this.setState({ tagText: event.target.value });
  };

  setTagPsText = event => {
    this.setState({ tagPsText: event.target.value });
  };

  copyTagDetailsToTagPs() {
    this.setState({
      tagPsText: this.state.tagText,
      tagPsTextColor: this.state.tagTextColor,
      tagPsBgColor: this.state.tagBgColor
    });
  }

  getGameList() {
    let gameList = [];
    let params = { combined: false, countryCode: this.state.countryCode };
    this.props.actions.getAllGames(params).then(() => {
      if (
        this.props.getAllGamesResponse &&
        this.props.getAllGamesResponse.length > 0
      ) {
        this.props.getAllGamesResponse.map(game => {
          gameList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
      }
    });

    this.setState({
      gameList
    });
  }

  resetTagDetails() {
    this.setState({
      tagText: '',
      tagTextColor: '#FFFFF1',
      tagBgColor: '#FFFFF1',
      tagPsText: '',
      tagPsTextColor: '#FFFFF1',
      tagPsBgColor: '#FFFFF1'
    });
  }

  saveChanges = async () => {
    let params = this.state.selectedGame;

    if (!this.state.countryCode) {
      message.error('Please select country code!');
      return;
    }

    let extraInfo = params.extraInfo ? JSON.parse(params.extraInfo) : {};
    if (this.state.tagText !== '') {
      extraInfo['tag'] = {
        text: this.state.tagText,
        textColor: this.state.tagTextColor,
        bgColor: this.state.tagBgColor
      };
    } else {
      delete extraInfo.tag;
    }
    if (this.state.tagPsText !== '') {
      extraInfo['tagPS'] = {
        text: this.state.tagPsText,
        textColor: this.state.tagPsTextColor,
        bgColor: this.state.tagPsBgColor
      };
    } else {
      delete extraInfo.tagPS;
    }
    // if (params.extraInfo) {
    //   params.extraInfo = JSON.stringify(extraInfo);
    // } else {
    //   params = Object.assign({ extraInfo: JSON.stringify(extraInfo) }, params);
    // }
    params.extraInfo = JSON.stringify(extraInfo);
    const data = {
      ...params,
      countryCode: this.state.countryCode
    };
    await this.props.actions.updateGame(data);
    this.setState(
      {
        selected: false,
        selectedGame: {}
      },
      () => {
        window.location.reload();
      }
    );
  };

  selectCountry = value => {
    this.setState(
      {
        countryCode: value,
        countrySelected: true
      },
      () => {
        this.getGameList();
      }
    );
  };

  render() {
    const gameSelected = gameId => {
      this.setState({
        selected: true
      });
      let selectedRow = this.props.getAllGamesResponse.find(
        item => item.id === gameId
      );
      this.setState({ selectedGame: selectedRow });
      this.resetTagDetails();
      // Initialize tag and tagPS if present
      if (selectedRow.extraInfo) {
        let parsedExtraInfo = JSON.parse(selectedRow.extraInfo);
        if (parsedExtraInfo.tag) {
          this.setState({
            tagText: parsedExtraInfo.tag.text,
            tagTextColor: parsedExtraInfo.tag.textColor,
            tagBgColor: parsedExtraInfo.tag.bgColor
          });
        }
        if (parsedExtraInfo.tagPS) {
          this.setState({
            tagPsText: parsedExtraInfo.tagPS.text,
            tagPsTextColor: parsedExtraInfo.tagPS.textColor,
            tagPsBgColor: parsedExtraInfo.tagPS.bgColor
          });
        }
      }
    };
    return (
      <React.Fragment>
        <Card>
          <Row>
            <label>Select Country:</label>
            <Select
              showSearch
              onSelect={e => this.selectCountry(e)}
              style={{ width: 200, margin: 20 }}
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
          </Row>

          {this.state.countrySelected && (
            <Row>
              <label>Select Game:</label>
              <Select
                showSearch
                onSelect={gameSelected}
                style={{ width: 400, margin: 20 }}
                placeholder="Select a Game"
                optionFilterProp="children"
              >
                {this.state.gameList}
              </Select>
            </Row>
          )}
        </Card>
        {this.state.selected && (
          <Card title="Game Details">
            <Card type="inner" title="Details">
              <Row>
                <Col span={8}>Name:</Col>
                <Col span={16}>{this.state.selectedGame.name}</Col>
                <Col span={8}>{this.state.selectedGame.name}</Col>
                <Col span={16}>
                  {this.state.selectedGame.active ? 'True' : 'False'}
                </Col>
                <Col span={8}>Android Supported:</Col>
                <Col span={16}>
                  {this.state.selectedGame.androidSupported ? 'True' : 'False'}
                </Col>
                <Col span={8}>Tournament Supported:</Col>
                <Col span={16}>
                  {this.state.selectedGame.tournamentSupported
                    ? 'True'
                    : 'False'}
                </Col>
              </Row>
            </Card>
            <Form>
              <Row>
                <Col span={12}>
                  <Card
                    type="inner"
                    title="Tag"
                    extra={
                      this.state.tagText !== '' && (
                        <Icon onClick={this.clearTagDetails} type="delete" />
                      )
                    }
                  >
                    <Form.Item
                      label="Tag Text"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14, offset: 4 }}
                    >
                      <Input
                        placeholder="Tag text"
                        onChange={this.setTagText}
                        value={this.state.tagText}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Tag Color"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14, offset: 4 }}
                    >
                      <ChromePicker
                        disableAlpha={true}
                        color={this.state.tagTextColor}
                        onChangeComplete={this.setTagTextColor}
                        onChange={this.setTagTextColor}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Tag Bg Color"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14, offset: 4 }}
                    >
                      <ChromePicker
                        disableAlpha={true}
                        color={this.state.tagBgColor}
                        onChangeComplete={this.setTagBgColor}
                      />
                    </Form.Item>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    type="inner"
                    title="Tag PS"
                    extra={
                      this.state.tagPsText !== '' ? (
                        <Icon onClick={this.clearTagPsDetails} type="delete" />
                      ) : (
                        <Button onClick={this.copyTagDetailsToTagPs}>
                          Copy Tag Details
                        </Button>
                      )
                    }
                  >
                    <Form.Item
                      label="Tag Text"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14, offset: 4 }}
                    >
                      <Input
                        placeholder="Tag PS text"
                        onChange={this.setTagPsText}
                        value={this.state.tagPsText}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Tag Color"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14, offset: 4 }}
                    >
                      <ChromePicker
                        disableAlpha={true}
                        color={this.state.tagPsTextColor}
                        onChangeComplete={this.setTagPsTextColor}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Tag Bg Color"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 14, offset: 4 }}
                    >
                      <ChromePicker
                        disableAlpha={true}
                        color={this.state.tagPsBgColor}
                        onChangeComplete={this.setTagPsBgColor}
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Form>
            <Button type="primary" icon="save" onClick={this.saveChanges}>
              Save
            </Button>
          </Card>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames,
    games: state.games,
    getAllGamesResponse: state.games.getAllGamesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
}
// const GameOrderIndexForm = Form.create()(GameOrderIndex);
export default connect(mapStateToProps, mapDispatchToProps)(GameOrderDetails);
