import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tierWidgetsActions from '../../actions/TierWidgetsActions';
import * as gameActions from '../../actions/gameActions';
import * as userProfileActions from '../../actions/UserProfileActions';
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
  Input,
  Spin
} from 'antd';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class SegmentTierConfigure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      segmentsFetched: false,
      selectedSegmentId: '',
      segmentSelectedFlag: false,
      selectedConfig: {},
      showMainSegment: false,
      isJsonVerified: {
        banner: true,
        audio: true,
        featured: true,
        games: true,
        refer: true,
        userGenerated: true,
        challenge: true,
        starsV2: true,
        story: true,
        collectable: true,
        search: true,
        explore: true,
        missions: true,
        recentlyPlayedGames: true,
        configurableGameList: true,
        gameReel: true,
        tickets: true,
        walletBanner: true,
        primeWidget: true,
        homeSearchIA: true,
        inviteEarn: true,
        referEarn: true
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState({
      segmentsFetched: false,
      selectedSegmentId: '',
      segmentSelectedFlag: false,
      showMainSegment: false,
      countryCode: value
    });
    this.getCurrentHomeConfig(value);
    this.getCustomSegmentList();
  }

  getCurrentHomeConfig(countryCode) {
    let data = {
      countryCode: countryCode
    };
    this.props.actions.getCurrentHomeConfig(data).then(() => {
      if (this.props.getCurrentHomeConfigResponse) {
        let homeSegmentConfig = JSON.parse(
          this.props.getCurrentHomeConfigResponse
        );
        this.setState({
          homeSegmentConfig: { ...homeSegmentConfig.homeSegmentConfig }
        });
      }
    });
  }

  getCustomSegmentList() {
    let customSegmentList = [];
    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment
      ) {
        this.props.getCustomSegmentListResponse.segment.map(segment => {
          customSegmentList.push(
            <Option key={segment.segmentId} value={segment.segmentId}>
              {segment.segmentId}
            </Option>
          );
        });
        this.setState({
          customSegmentList,
          segmentsFetched: true
        });
      } else {
        customSegmentList.push(
          <Option key={'DEFAULT##DEFAULT'} value={'DEFAULT##DEFAULT'}>
            {'DEFAULT##DEFAULT'}
          </Option>
        );
        this.setState({ customSegmentList, segmentsFetched: true });
      }
    });
  }

  segmentSelected(value) {
    this.setState(
      {
        selectedSegmentId: value,
        segmentSelectedFlag: true,
        loading: true,
        showMainSegment: false
      },
      () => {
        this.checkForExistingConfig();
      }
    );
  }

  checkForExistingConfig() {
    let selectedConfig = {};
    if (
      this.state.homeSegmentConfig &&
      this.state.homeSegmentConfig[this.state.selectedSegmentId] &&
      this.state.homeSegmentConfig[this.state.selectedSegmentId]['DEFAULT']
    ) {
      selectedConfig = {
        ...this.state.homeSegmentConfig[this.state.selectedSegmentId]['DEFAULT']
      };
    } else if (
      this.state.homeSegmentConfig &&
      this.state.homeSegmentConfig['DEFAULT##DEFAULT'] &&
      this.state.homeSegmentConfig['DEFAULT##DEFAULT']['DEFAULT']
    ) {
      message.info(
        'No zookeeper config found for the segment. Prepopulating data by taking DEFAULT custom segment',
        2
      );
      selectedConfig = {
        ...this.state.homeSegmentConfig['DEFAULT##DEFAULT']['DEFAULT']
      };
    } else {
      message.error('No configs found');
      selectedConfig = { config: {} };
    }
    this.setState({
      selectedConfig: { ...selectedConfig },
      showMainSegment: true,
      loading: false
    });
  }

  jsonCheck(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      message.error('Invalid JSON object', 1);
      return false;
    }
  }

  verifyJsonInput(value, configType) {
    let isJsonFlag = false;
    if (value === null || value === '') {
      isJsonFlag = true;
    } else {
      isJsonFlag = this.jsonCheck(value);
    }
    let isJsonVerified = { ...this.state.isJsonVerified };
    switch (configType) {
      case 'BANNER':
        isJsonVerified.banner = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'AUDIO':
        isJsonVerified.audio = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'FEATURED':
        isJsonVerified.featured = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'GAMES':
        isJsonVerified.games = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'REFER':
        isJsonVerified.refer = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'USER_GENERATED':
        isJsonVerified.userGenerated = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'CHALLENGE':
        isJsonVerified.challenge = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'STARS_V2':
        isJsonVerified.starsV2 = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'STORY':
        isJsonVerified.story = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'COLLECTABLE':
        isJsonVerified.collectable = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'EXPLORE':
        isJsonVerified.explore = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'MISSIONS':
        isJsonVerified.missions = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'SEARCH':
        isJsonVerified.search = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'RECENTLY_PLAYED_GAMES':
        isJsonVerified.recentlyPlayedGames = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'CONFIGURABLE_GAME_LIST':
        isJsonVerified.configurableGameList = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'GAME_REEL':
        isJsonVerified.gameReel = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'TICKETS':
        isJsonVerified.tickets = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'WALLET_BANNER':
        isJsonVerified.walletBanner = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'PRIME_WIDGET':
        isJsonVerified.primeWidget = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'HOME_SEARCH':
        isJsonVerified.homeSearchIA = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'INVITE_EARN':
        isJsonVerified.inviteEarn = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'REFER_EARN':
        isJsonVerified.referEarn = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      default:
        break;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let banner = {};
        banner['show'] = values.bannerShow;
        banner['index'] = values.bannerIndexValue;
        banner['data'] = values.bannerData ? JSON.parse(values.bannerData) : {};

        let audio = {};
        audio['show'] = values.audioShow;
        audio['gameIndex'] = values.audioIndexValue;
        audio['data'] = values.audioData ? JSON.parse(values.audioData) : {};

        let featured = {};
        featured['show'] = values.featuredShow;
        featured['index'] = values.featuredIndexValue;
        featured['data'] = values.featuredData
          ? JSON.parse(values.featuredData)
          : {};

        let games = {};
        games['show'] = values.gamesShow;
        games['index'] = values.gamesIndexValue;
        games['data'] = values.gamesData ? JSON.parse(values.gamesData) : {};

        let refer = {};
        refer['show'] = values.referShow;
        refer['gameIndex'] = values.referIndexValue;
        refer['data'] = values.referData ? JSON.parse(values.referData) : {};

        let userGenerated = {};
        userGenerated['show'] = values.userGeneratedShow;
        userGenerated['gameIndex'] = values.userGeneratedIndexValue;
        userGenerated['data'] = values.userGeneratedData
          ? JSON.parse(values.userGeneratedData)
          : {};

        let challenge = {};
        challenge['show'] = values.challengeShow;
        challenge['index'] = values.challengeIndexValue;
        challenge['data'] = values.challengeData
          ? JSON.parse(values.challengeData)
          : {};

        let stars = {};
        stars['show'] = values.starsShow;
        stars['gameIndex'] = values.starsIndexValue;
        stars['data'] = values.starsData ? JSON.parse(values.starsData) : {};

        let story = {};
        story['show'] = values.storyShow;
        story['index'] = values.storyIndexValue;
        story['data'] = values.storyData ? JSON.parse(values.storyData) : {};

        let collectable = {};
        collectable['show'] = values.collectableShow;
        collectable['gameIndex'] = values.collectableIndexValue;
        collectable['data'] = values.collectableData
          ? JSON.parse(values.collectableData)
          : {};

        let search = {};
        search['show'] = values.searchShow;
        search['gameIndex'] = values.searchIndexValue;
        search['data'] = values.searchData ? JSON.parse(values.searchData) : {};

        let explore = {};
        explore['show'] = values.exploreShow;
        explore['index'] = values.exploreIndexValue;
        explore['data'] = values.exploreData
          ? JSON.parse(values.exploreData)
          : {};

        let missions = {};
        missions['show'] = values.missionsShow;
        missions['index'] = values.missionsIndexValue;
        missions['data'] = values.missionsData
          ? JSON.parse(values.missionsData)
          : {};

        let homeSearchIA = {};
        homeSearchIA['show'] = values.homeSearchShow;
        homeSearchIA['index'] = values.homeSearchIndexValue;
        homeSearchIA['data'] = values.homeSearchData
          ? JSON.parse(values.homeSearchData)
          : {};

        let inviteEarn = {};
        inviteEarn['show'] = values.inviteEarnShow;
        inviteEarn['index'] = values.inviteEarnIndexValue;
        inviteEarn['data'] = values.inviteEarnData
          ? JSON.parse(values.inviteEarnData)
          : {};

        let referEarn = {};
        referEarn['show'] = values.referEarnShow;
        referEarn['index'] = values.referEarnIndexValue;
        referEarn['data'] = values.referEarnData
          ? JSON.parse(values.referEarnData)
          : {};

        let recentlyPlayedGames = {};
        recentlyPlayedGames['show'] = values.recentlyPlayedGamesShow;
        recentlyPlayedGames['index'] = values.recentlyPlayedGamesIndexValue;
        recentlyPlayedGames['data'] = values.recentlyPlayedGamesData
          ? JSON.parse(values.recentlyPlayedGamesData)
          : {};

        let configurableGameList = {};
        configurableGameList['show'] = values.configurableGameListShow;
        configurableGameList['index'] = values.configurableGameListIndexValue;
        configurableGameList['data'] = values.configurableGameListData
          ? JSON.parse(values.configurableGameListData)
          : {};

        let gameReel = {};
        gameReel['show'] = values.gameReelShow;
        gameReel['index'] = values.gameReelIndexValue;
        gameReel['data'] = values.gameReelData
          ? JSON.parse(values.gameReelData)
          : {};

        let tickets = {};
        tickets['show'] = values.ticketsShow;
        tickets['gameIndex'] = values.ticketsIndexValue;
        tickets['data'] = values.ticketsData
          ? JSON.parse(values.ticketsData)
          : {};

        let walletBanner = {};
        walletBanner['show'] = values.walletBannerShow;
        // walletBanner['index'] = values.walletBannerIndexValue;
        walletBanner['data'] = values.walletBannerData
          ? JSON.parse(values.walletBannerData)
          : {};

        let primeWidget = {};
        primeWidget['show'] = values.primeWidgetShow;
        primeWidget['index'] = values.primeWidgetIndexValue;
        primeWidget['data'] = values.primeWidgetData
          ? JSON.parse(values.primeWidgetData)
          : {};

        let config = {};

        if (this.state.countryCode === 'ID') {
          config = {
            banner: banner,
            audio: audio,
            featured: featured,
            games: games,
            refer: refer,
            userGenerated: userGenerated,
            challenge: challenge,
            starsV2: stars,
            story: story,
            collectable: collectable,
            search: search,
            explore: explore,
            missions: missions,
            recentlyPlayedGames: recentlyPlayedGames,
            configurableGameList: configurableGameList,
            gameReel: gameReel,
            tickets: tickets,
            walletBanner: walletBanner,
            primeWidget: primeWidget,
            iaGameCategories: homeSearchIA,
            inviteEarn: inviteEarn,
            referEarn: referEarn
          };
        } else {
          config = {
            banner: banner,
            audio: audio,
            featured: featured,
            games: games,
            refer: refer,
            userGenerated: userGenerated,
            challenge: challenge,
            starsV2: stars,
            story: story,
            collectable: collectable,
            search: search,
            explore: explore,
            missions: missions,
            recentlyPlayedGames: recentlyPlayedGames,
            configurableGameList: configurableGameList,
            gameReel: gameReel,
            tickets: tickets,
            primeWidget: primeWidget,
            iaGameCategories: homeSearchIA,
            inviteEarn: inviteEarn,
            referEarn: referEarn
          };
        }

        let data = {
          segmentId: this.state.selectedSegmentId,
          countryCode: values.countryCode,
          config: { ...config }
        };
        this.props.actions.updateSegmentHomeConfig(data).then(() => {
          if (
            this.props.updateSegmentHomeConfigResponse &&
            this.props.updateSegmentHomeConfigResponse.success
          ) {
            if (this.props.updateSegmentHomeConfigResponse.success) {
              message
                .success('Updated the segment game order configuration', 1.5)
                .then(() => {
                  window.location.reload();
                });
            } else {
              message.error('Could not update the config');
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
      bannerIndexValue:
        isFieldTouched('bannerIndexValue') && getFieldError('bannerIndexValue'),
      audioIndexValue:
        isFieldTouched('audioIndexValue') && getFieldError('audioIndexValue'),
      featuredIndexValue:
        isFieldTouched('featuredIndexValue') &&
        getFieldError('featuredIndexValue'),
      gamesIndexValue:
        isFieldTouched('gamesIndexValue') && getFieldError('gamesIndexValue'),
      referIndexValue:
        isFieldTouched('referIndexValue') && getFieldError('referIndexValue'),
      userGeneratedIndexValue:
        isFieldTouched('userGeneratedIndexValue') &&
        getFieldError('userGeneratedIndexValue'),
      challengeIndexValue:
        isFieldTouched('challengeIndexValue') &&
        getFieldError('challengeIndexValue'),
      starsIndexValue:
        isFieldTouched('starsIndexValue') && getFieldError('starsIndexValue'),
      storyIndexValue:
        isFieldTouched('storyIndexValue') && getFieldError('storyIndexValue'),
      collectableIndexValue:
        isFieldTouched('collectableIndexValue') &&
        getFieldError('collectableIndexValue'),
      searchIndexValue:
        isFieldTouched('searchIndexValue') && getFieldError('searchIndexValue'),
      exploreIndexValue:
        isFieldTouched('exploreIndexValue') &&
        getFieldError('exploreIndexValue'),
      missionsIndexValue:
        isFieldTouched('missionsIndexValue') &&
        getFieldError('missionsIndexValue'),
      recentlyPlayedGamesIndexValue:
        isFieldTouched('recentlyPlayedGamesIndexValue') &&
        getFieldError('recentlyPlayedGamesIndexValue'),
      configurableGameListIndexValue:
        isFieldTouched('configurableGameListIndexValue') &&
        getFieldError('configurableGameListIndexValue'),
      gameReelIndexValue:
        isFieldTouched('gameReelIndexValue') &&
        getFieldError('gameReelIndexValue'),
      ticketsIndexValue:
        isFieldTouched('ticketsIndexValue') &&
        getFieldError('ticketsIndexValue'),
      walletBannerIndexValue:
        isFieldTouched('walletBannerIndexValue') &&
        getFieldError('walletBannerIndexValue'),
      primeWidgetIndexValue:
        isFieldTouched('primeWidgetIndexValue') &&
        getFieldError('primeWidgetIndexValue'),
      homeSearchIndexValue:
        isFieldTouched('homeSearchIndexValue') &&
        getFieldError('homeSearchIndexValue'),
      inviteEarnIndexValue:
        isFieldTouched('inviteEarnIndexValue') &&
        getFieldError('inviteEarnIndexValue'),
      referEarnIndexValue:
        isFieldTouched('referEarnIndexValue') &&
        getFieldError('referEarnIndexValue')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Home Config">
            <FormItem
              validateStatus={errors.countryCode ? 'error' : ''}
              help={errors.countryCode || ''}
              {...formItemLayout}
              label={<span>Country</span>}
            >
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                    whitespace: true
                  }
                ]
              })(
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
              )}
            </FormItem>
            {this.state.segmentsFetched && (
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
                  Select Segment:
                </Col>
                <Col span={14}>
                  <Select
                    showSearch
                    onSelect={e => this.segmentSelected(e)}
                    style={{ width: '80%' }}
                    placeholder="Segment"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.customSegmentList}
                  </Select>
                </Col>
              </Row>
            )}
            {this.state.showMainSegment && (
              <Spin spinning={this.state.loading}>
                <Row>
                  <Card title="Missions" type="inner">
                    <FormItem {...formItemLayout} label={'Missions Show'}>
                      {getFieldDecorator('missionsShow', {
                        initialValue:
                          this.state.selectedConfig.config.missions &&
                          this.state.selectedConfig.config.missions.show
                            ? this.state.selectedConfig.config.missions.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.missionsIndexValue ? 'error' : ''}
                      help={errors.missionsIndexValue || ''}
                      {...formItemLayout}
                      label={'Missions Index'}
                    >
                      {getFieldDecorator('missionsIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.missions &&
                          this.state.selectedConfig.config.missions.index
                            ? this.state.selectedConfig.config.missions.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.missions ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.missions || ''}
                      {...formItemLayout}
                      label={'Missions Data'}
                    >
                      {getFieldDecorator('missionsData', {
                        initialValue:
                          this.state.selectedConfig.config.missions &&
                          this.state.selectedConfig.config.missions.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.missions.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'MISSIONS')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Game Categories" type="inner">
                    <FormItem {...formItemLayout} label={'Game Category Show'}>
                      {getFieldDecorator('homeSearchShow', {
                        initialValue:
                          this.state.selectedConfig.config.iaGameCategories &&
                          this.state.selectedConfig.config.iaGameCategories.show
                            ? this.state.selectedConfig.config.iaGameCategories
                                .show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.homeSearchIndexValue ? 'error' : ''
                      }
                      help={errors.homeSearchIndexValue || ''}
                      {...formItemLayout}
                      label={'Game Category Index'}
                    >
                      {getFieldDecorator('homeSearchIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.iaGameCategories &&
                          this.state.selectedConfig.config.iaGameCategories
                            .index
                            ? this.state.selectedConfig.config.iaGameCategories
                                .index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.homeSearchIA ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.homeSearchIA || ''}
                      {...formItemLayout}
                      label={'Game Category Data'}
                    >
                      {getFieldDecorator('homeSearchData', {
                        initialValue:
                          this.state.selectedConfig.config.iaGameCategories &&
                          this.state.selectedConfig.config.iaGameCategories.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config
                                  .iaGameCategories.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'HOME_SEARCH')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Invite Earn" type="inner">
                    <FormItem {...formItemLayout} label={'Invite Earn Show'}>
                      {getFieldDecorator('inviteEarnShow', {
                        initialValue:
                          this.state.selectedConfig.config.inviteEarn &&
                          this.state.selectedConfig.config.inviteEarn.show
                            ? this.state.selectedConfig.config.inviteEarn.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.inviteEarnIndexValue ? 'error' : ''
                      }
                      help={errors.inviteEarnIndexValue || ''}
                      {...formItemLayout}
                      label={'Invite Earn Index'}
                    >
                      {getFieldDecorator('inviteEarnIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.inviteEarn &&
                          this.state.selectedConfig.config.inviteEarn.index
                            ? this.state.selectedConfig.config.inviteEarn.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.inviteEarn ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.inviteEarn || ''}
                      {...formItemLayout}
                      label={'Invite Earn Data'}
                    >
                      {getFieldDecorator('inviteEarnData', {
                        initialValue:
                          this.state.selectedConfig.config.inviteEarn &&
                          this.state.selectedConfig.config.inviteEarn.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.inviteEarn.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'INVITE_EARN')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Refer Earn" type="inner">
                    <FormItem {...formItemLayout} label={'Refer Earn Show'}>
                      {getFieldDecorator('referEarnShow', {
                        initialValue:
                          this.state.selectedConfig.config.referEarn &&
                          this.state.selectedConfig.config.referEarn.show
                            ? this.state.selectedConfig.config.referEarn.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.referEarnIndexValue ? 'error' : ''}
                      help={errors.referEarnIndexValue || ''}
                      {...formItemLayout}
                      label={'Refer Earn Index'}
                    >
                      {getFieldDecorator('referEarnIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.referEarn &&
                          this.state.selectedConfig.config.referEarn.index
                            ? this.state.selectedConfig.config.referEarn.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.referEarn ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.referEarn || ''}
                      {...formItemLayout}
                      label={'Refer Earn Data'}
                    >
                      {getFieldDecorator('referEarnData', {
                        initialValue:
                          this.state.selectedConfig.config.referEarn &&
                          this.state.selectedConfig.config.referEarn.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.referEarn.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'REFER_EARN')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Story" type="inner">
                    <FormItem {...formItemLayout} label={'Story Show'}>
                      {getFieldDecorator('storyShow', {
                        initialValue: _.get(
                          this.state.selectedConfig,
                          'config.story.show',
                          false
                        ),
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.storyIndexValue ? 'error' : ''}
                      help={errors.storyIndexValue || ''}
                      {...formItemLayout}
                      label={'Story Index'}
                    >
                      {getFieldDecorator('storyIndexValue', {
                        initialValue: _.get(
                          this.state.selectedConfig,
                          'config.story.index',
                          null
                        ),
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.story ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.story || ''}
                      {...formItemLayout}
                      label={'Story Data'}
                    >
                      {getFieldDecorator('storyData', {
                        initialValue: JSON.stringify(
                          _.get(
                            this.state.selectedConfig,
                            'config.story.data',
                            {}
                          )
                        ),
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'STORY')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Banner" type="inner">
                    {this.state.selectedConfig.config.banner.show}
                    <FormItem {...formItemLayout} label={'Banner Show'}>
                      {getFieldDecorator('bannerShow', {
                        initialValue: this.state.selectedConfig.config.banner
                          .show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.bannerIndexValue ? 'error' : ''}
                      help={errors.bannerIndexValue || ''}
                      {...formItemLayout}
                      label={'Banner Index'}
                    >
                      {getFieldDecorator('bannerIndexValue', {
                        initialValue: this.state.selectedConfig.config.banner
                          .index,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.banner ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.banner || ''}
                      {...formItemLayout}
                      label={'Banner Data'}
                    >
                      {getFieldDecorator('bannerData', {
                        initialValue:
                          this.state.selectedConfig.config.banner &&
                          this.state.selectedConfig.config.banner.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.banner.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'BANNER')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Featured" type="inner">
                    <FormItem {...formItemLayout} label={'Featured Show'}>
                      {getFieldDecorator('featuredShow', {
                        initialValue: this.state.selectedConfig.config.featured
                          .show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.featuredIndexValue ? 'error' : ''}
                      help={errors.featuredIndexValue || ''}
                      {...formItemLayout}
                      label={'Featured Index'}
                    >
                      {getFieldDecorator('featuredIndexValue', {
                        initialValue: this.state.selectedConfig.config.featured
                          .index,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.featured ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.featured || ''}
                      {...formItemLayout}
                      label={'Featured Data'}
                    >
                      {getFieldDecorator('featuredData', {
                        initialValue:
                          this.state.selectedConfig.config.featured &&
                          this.state.selectedConfig.config.featured.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.featured.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'FEATURED')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Recently Played Games" type="inner">
                    <FormItem
                      {...formItemLayout}
                      label={'Recently Played Games Show'}
                    >
                      {getFieldDecorator('recentlyPlayedGamesShow', {
                        initialValue:
                          this.state.selectedConfig.config
                            .recentlyPlayedGames &&
                          this.state.selectedConfig.config.recentlyPlayedGames
                            .show
                            ? this.state.selectedConfig.config
                                .recentlyPlayedGames.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.recentlyPlayedGamesIndexValue ? 'error' : ''
                      }
                      help={errors.recentlyPlayedGamesIndexValue || ''}
                      {...formItemLayout}
                      label={'Recently Played Games Index'}
                    >
                      {getFieldDecorator('recentlyPlayedGamesIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config
                            .recentlyPlayedGames &&
                          this.state.selectedConfig.config.recentlyPlayedGames
                            .index
                            ? this.state.selectedConfig.config
                                .recentlyPlayedGames.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.recentlyPlayedGames
                          ? 'error'
                          : ''
                      }
                      help={
                        !this.state.isJsonVerified.recentlyPlayedGames || ''
                      }
                      {...formItemLayout}
                      label={'Recently Played Games Data'}
                    >
                      {getFieldDecorator('recentlyPlayedGamesData', {
                        initialValue:
                          this.state.selectedConfig.config
                            .recentlyPlayedGames &&
                          this.state.selectedConfig.config.recentlyPlayedGames
                            .data
                            ? JSON.stringify(
                                this.state.selectedConfig.config
                                  .recentlyPlayedGames.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(
                              e.target.value,
                              'RECENTLY_PLAYED_GAMES'
                            )
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Configurable Game List" type="inner">
                    <FormItem
                      {...formItemLayout}
                      label={'Configurable Game List Show'}
                    >
                      {getFieldDecorator('configurableGameListShow', {
                        initialValue:
                          this.state.selectedConfig.config
                            .configurableGameList &&
                          this.state.selectedConfig.config.configurableGameList
                            .show
                            ? this.state.selectedConfig.config
                                .configurableGameList.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.configurableGameListIndexValue ? 'error' : ''
                      }
                      help={errors.configurableGameListIndexValue || ''}
                      {...formItemLayout}
                      label={'Configurable Game List Index'}
                    >
                      {getFieldDecorator('configurableGameListIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config
                            .configurableGameList &&
                          this.state.selectedConfig.config.configurableGameList
                            .index
                            ? this.state.selectedConfig.config
                                .configurableGameList.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.configurableGameList
                          ? 'error'
                          : ''
                      }
                      help={
                        !this.state.isJsonVerified.configurableGameList || ''
                      }
                      {...formItemLayout}
                      label={'Configurable Game List Data'}
                    >
                      {getFieldDecorator('configurableGameListData', {
                        initialValue:
                          this.state.selectedConfig.config
                            .configurableGameList &&
                          this.state.selectedConfig.config.configurableGameList
                            .data
                            ? JSON.stringify(
                                this.state.selectedConfig.config
                                  .configurableGameList.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(
                              e.target.value,
                              'CONFIGURABLE_GAME_LIST'
                            )
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Game Reel" type="inner">
                    <FormItem {...formItemLayout} label={'Game Reel Show'}>
                      {getFieldDecorator('gameReelShow', {
                        initialValue:
                          this.state.selectedConfig.config.gameReel &&
                          this.state.selectedConfig.config.gameReel.show
                            ? this.state.selectedConfig.config.gameReel.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.gameReelIndexValue ? 'error' : ''}
                      help={errors.gameReelIndexValue || ''}
                      {...formItemLayout}
                      label={'Game Reel Index'}
                    >
                      {getFieldDecorator('gameReelIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.gameReel &&
                          this.state.selectedConfig.config.gameReel.index
                            ? this.state.selectedConfig.config.gameReel.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.gameReel ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.gameReel || ''}
                      {...formItemLayout}
                      label={'Game Reel Data'}
                    >
                      {getFieldDecorator('gameReelData', {
                        initialValue:
                          this.state.selectedConfig.config.gameReel &&
                          this.state.selectedConfig.config.gameReel.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.gameReel.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'GAME_REEL')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Games" type="inner">
                    <FormItem {...formItemLayout} label={'Games Show'}>
                      {getFieldDecorator('gamesShow', {
                        initialValue: this.state.selectedConfig.config.games
                          .show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.gamesIndexValue ? 'error' : ''}
                      help={errors.gamesIndexValue || ''}
                      {...formItemLayout}
                      label={'Games Index'}
                    >
                      {getFieldDecorator('gamesIndexValue', {
                        initialValue: this.state.selectedConfig.config.games
                          .index,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.games ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.games || ''}
                      {...formItemLayout}
                      label={'Games Data'}
                    >
                      {getFieldDecorator('gamesData', {
                        initialValue:
                          this.state.selectedConfig.config.games &&
                          this.state.selectedConfig.config.games.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.games.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'GAMES')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Challenge" type="inner">
                    <FormItem {...formItemLayout} label={'Challenge Show'}>
                      {getFieldDecorator('challengeShow', {
                        initialValue: this.state.selectedConfig.config.challenge
                          .show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.challengeIndexValue ? 'error' : ''}
                      help={errors.challengeIndexValue || ''}
                      {...formItemLayout}
                      label={'Challenge Index'}
                    >
                      {getFieldDecorator('challengeIndexValue', {
                        initialValue: this.state.selectedConfig.config.challenge
                          .index,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.challenge ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.challenge || ''}
                      {...formItemLayout}
                      label={'Challenge Data'}
                    >
                      {getFieldDecorator('challengeData', {
                        initialValue:
                          this.state.selectedConfig.config.challenge &&
                          this.state.selectedConfig.config.challenge.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.challenge.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'CHALLENGE')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Search" type="inner">
                    <FormItem {...formItemLayout} label={'Search Show'}>
                      {getFieldDecorator('searchShow', {
                        initialValue:
                          this.state.selectedConfig.config.search &&
                          this.state.selectedConfig.config.search.show
                            ? this.state.selectedConfig.config.search.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.searchIndexValue ? 'error' : ''}
                      help={errors.searchIndexValue || ''}
                      {...formItemLayout}
                      label={'Search Game Index'}
                    >
                      {getFieldDecorator('searchIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.search &&
                          this.state.selectedConfig.config.search.gameIndex
                            ? this.state.selectedConfig.config.search.gameIndex
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.search ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.search || ''}
                      {...formItemLayout}
                      label={'Search Data'}
                    >
                      {getFieldDecorator('searchData', {
                        initialValue:
                          this.state.selectedConfig.config.search &&
                          this.state.selectedConfig.config.search.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.search.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'SEARCH')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Explore" type="inner">
                    <FormItem {...formItemLayout} label={'Explore Show'}>
                      {getFieldDecorator('exploreShow', {
                        initialValue:
                          this.state.selectedConfig.config.explore &&
                          this.state.selectedConfig.config.explore.show
                            ? this.state.selectedConfig.config.explore.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.exploreIndexValue ? 'error' : ''}
                      help={errors.exploreIndexValue || ''}
                      {...formItemLayout}
                      label={'Explore Index'}
                    >
                      {getFieldDecorator('exploreIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.explore &&
                          this.state.selectedConfig.config.explore.index
                            ? this.state.selectedConfig.config.explore.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.explore ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.explore || ''}
                      {...formItemLayout}
                      label={'Explore Data'}
                    >
                      {getFieldDecorator('exploreData', {
                        initialValue:
                          this.state.selectedConfig.config.explore &&
                          this.state.selectedConfig.config.explore.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.explore.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'EXPLORE')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Tickets" type="inner">
                    <FormItem {...formItemLayout} label={'Tickets Show'}>
                      {getFieldDecorator('ticketsShow', {
                        initialValue:
                          this.state.selectedConfig.config.tickets &&
                          this.state.selectedConfig.config.tickets.show
                            ? this.state.selectedConfig.config.tickets.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.ticketsIndexValue ? 'error' : ''}
                      help={errors.ticketsIndexValue || ''}
                      {...formItemLayout}
                      label={'Tickets Game Index'}
                    >
                      {getFieldDecorator('ticketsIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.tickets &&
                          this.state.selectedConfig.config.tickets.gameIndex
                            ? this.state.selectedConfig.config.tickets.gameIndex
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.tickets ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.tickets || ''}
                      {...formItemLayout}
                      label={'Tickets Data'}
                    >
                      {getFieldDecorator('ticketsData', {
                        initialValue:
                          this.state.selectedConfig.config.tickets &&
                          this.state.selectedConfig.config.tickets.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.tickets.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'TICKETS')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Collectable" type="inner">
                    <FormItem {...formItemLayout} label={'Collectable Show'}>
                      {getFieldDecorator('collectableShow', {
                        initialValue: this.state.selectedConfig.config
                          .collectable.show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.collectableIndexValue ? 'error' : ''
                      }
                      help={errors.collectableIndexValue || ''}
                      {...formItemLayout}
                      label={'Collectable Game Index'}
                    >
                      {getFieldDecorator('collectableIndexValue', {
                        initialValue: this.state.selectedConfig.config
                          .collectable.gameIndex,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.collectable ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.collectable || ''}
                      {...formItemLayout}
                      label={'Collectable Data'}
                    >
                      {getFieldDecorator('collectableData', {
                        initialValue:
                          this.state.selectedConfig.config.collectable &&
                          this.state.selectedConfig.config.collectable.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.collectable
                                  .data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'COLLECTABLE')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Stars" type="inner">
                    <FormItem {...formItemLayout} label={'Stars V2 Show'}>
                      {getFieldDecorator('starsShow', {
                        initialValue: this.state.selectedConfig.config.starsV2
                          .show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.starsIndexValue ? 'error' : ''}
                      help={errors.starsIndexValue || ''}
                      {...formItemLayout}
                      label={'Stars V2 Game Index'}
                    >
                      {getFieldDecorator('starsIndexValue', {
                        initialValue: this.state.selectedConfig.config.starsV2
                          .gameIndex,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.starsV2 ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.starsV2 || ''}
                      {...formItemLayout}
                      label={'Stars V2 Data'}
                    >
                      {getFieldDecorator('starsData', {
                        initialValue:
                          this.state.selectedConfig.config.starsV2 &&
                          this.state.selectedConfig.config.starsV2.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.starsV2.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'STARS_V2')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>

                  <Card title="Audio" type="inner">
                    <FormItem {...formItemLayout} label={'Audio Show'}>
                      {getFieldDecorator('audioShow', {
                        initialValue: this.state.selectedConfig.config.audio
                          .show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.audioIndexValue ? 'error' : ''}
                      help={errors.audioIndexValue || ''}
                      {...formItemLayout}
                      label={'Audio Game Index'}
                    >
                      {getFieldDecorator('audioIndexValue', {
                        initialValue: this.state.selectedConfig.config.audio
                          .gameIndex,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.audio ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.audio || ''}
                      {...formItemLayout}
                      label={'Audio Data'}
                    >
                      {getFieldDecorator('audioData', {
                        initialValue:
                          this.state.selectedConfig.config.audio &&
                          this.state.selectedConfig.config.audio.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.audio.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'AUDIO')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>

                  <Card title="Refer" type="inner">
                    <FormItem {...formItemLayout} label={'Refer Show'}>
                      {getFieldDecorator('referShow', {
                        initialValue: this.state.selectedConfig.config.refer
                          .show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.referIndexValue ? 'error' : ''}
                      help={errors.referIndexValue || ''}
                      {...formItemLayout}
                      label={'Refer Games Index'}
                    >
                      {getFieldDecorator('referIndexValue', {
                        initialValue: this.state.selectedConfig.config.refer
                          .gameIndex,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.refer ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.refer || ''}
                      {...formItemLayout}
                      label={'Refer Data'}
                    >
                      {getFieldDecorator('referData', {
                        initialValue:
                          this.state.selectedConfig.config.refer &&
                          this.state.selectedConfig.config.refer.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.refer.data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'REFER')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>

                  <Card title="User Generated" type="inner">
                    <FormItem {...formItemLayout} label={'User Generated Show'}>
                      {getFieldDecorator('userGeneratedShow', {
                        initialValue: this.state.selectedConfig.config
                          .userGenerated.show,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.userGeneratedIndexValue ? 'error' : ''
                      }
                      help={errors.userGeneratedIndexValue || ''}
                      {...formItemLayout}
                      label={'User Generated Game Index'}
                    >
                      {getFieldDecorator('userGeneratedIndexValue', {
                        initialValue: this.state.selectedConfig.config
                          .userGenerated.gameIndex,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.userGenerated ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.userGenerated || ''}
                      {...formItemLayout}
                      label={'User Generated Data'}
                    >
                      {getFieldDecorator('userGeneratedData', {
                        initialValue:
                          this.state.selectedConfig.config.userGenerated &&
                          this.state.selectedConfig.config.userGenerated.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.userGenerated
                                  .data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(
                              e.target.value,
                              'USER_GENERATED'
                            )
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="Prime Widget" type="inner">
                    <FormItem {...formItemLayout} label={'Prime Widget Show'}>
                      {getFieldDecorator('primeWidgetShow', {
                        initialValue:
                          this.state.selectedConfig.config.primeWidget &&
                          this.state.selectedConfig.config.primeWidget.show
                            ? this.state.selectedConfig.config.primeWidget.show
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.primeWidgetIndexValue ? 'error' : ''
                      }
                      help={errors.primeWidgetIndexValue || ''}
                      {...formItemLayout}
                      label={'Prime Widget Index'}
                    >
                      {getFieldDecorator('primeWidgetIndexValue', {
                        initialValue:
                          this.state.selectedConfig.config.primeWidget &&
                          this.state.selectedConfig.config.primeWidget.index
                            ? this.state.selectedConfig.config.primeWidget.index
                            : 0,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'This is a mandatory field!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        !this.state.isJsonVerified.primeWidget ? 'error' : ''
                      }
                      help={!this.state.isJsonVerified.primeWidget || ''}
                      {...formItemLayout}
                      label={'Prime Widget Data'}
                    >
                      {getFieldDecorator('primeWidgetData', {
                        initialValue:
                          this.state.selectedConfig.config.primeWidget &&
                          this.state.selectedConfig.config.primeWidget.data
                            ? JSON.stringify(
                                this.state.selectedConfig.config.primeWidget
                                  .data
                              )
                            : '{}',
                        rules: [
                          {
                            required: false,
                            message:
                              'Please enter a valid json object or leave it empty',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          style={{ width: '70%' }}
                          rows={4}
                          placeholder="Meta data in JSON format"
                          onBlur={e =>
                            this.verifyJsonInput(e.target.value, 'PRIME_WIDGET')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  {this.state.countryCode && this.state.countryCode === 'ID' && (
                    <Card title="Wallet Banner" type="inner">
                      <FormItem
                        {...formItemLayout}
                        label={'Wallet Banner Show'}
                      >
                        {getFieldDecorator('walletBannerShow', {
                          initialValue:
                            this.state.selectedConfig.config.walletBanner &&
                            this.state.selectedConfig.config.walletBanner.show
                              ? this.state.selectedConfig.config.walletBanner
                                  .show
                              : false,
                          rules: [
                            {
                              required: true,
                              message: 'Please select an option',
                              whitespace: false,
                              type: 'boolean'
                            }
                          ]
                        })(
                          <RadioGroup size="small" buttonStyle="solid">
                            <RadioButton value={true}>True</RadioButton>
                            <RadioButton value={false}>False</RadioButton>
                          </RadioGroup>
                        )}
                      </FormItem>
                      <FormItem
                        validateStatus={
                          !this.state.isJsonVerified.walletBanner ? 'error' : ''
                        }
                        help={!this.state.isJsonVerified.walletBanner || ''}
                        {...formItemLayout}
                        label={'Wallet Banner Data'}
                      >
                        {getFieldDecorator('walletBannerData', {
                          initialValue:
                            this.state.selectedConfig.config.walletBanner &&
                            this.state.selectedConfig.config.walletBanner.data
                              ? JSON.stringify(
                                  this.state.selectedConfig.config.walletBanner
                                    .data
                                )
                              : '{}',
                          rules: [
                            {
                              required: false,
                              message:
                                'Please enter a valid json object or leave it empty',
                              whitespace: true
                            }
                          ]
                        })(
                          <TextArea
                            style={{ width: '70%' }}
                            rows={4}
                            placeholder="Meta data in JSON format"
                            onBlur={e =>
                              this.verifyJsonInput(
                                e.target.value,
                                'WALLET_BANNER'
                              )
                            }
                          />
                        )}
                      </FormItem>
                    </Card>
                  )}
                  <Row>
                    <Col span={12} offset={12}>
                      <Button
                        style={{ float: 'none' }}
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Spin>
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
    games: state.games
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...tierWidgetsActions,
        ...gameActions,
        ...userProfileActions,
        ...segmentationActions
      },
      dispatch
    )
  };
}
const SegmentTierConfigureForm = Form.create()(SegmentTierConfigure);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SegmentTierConfigureForm);
