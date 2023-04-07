import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tierWidgetsActions from '../../actions/TierWidgetsActions';
import * as gameActions from '../../actions/gameActions';
import * as userProfileActions from '../../actions/UserProfileActions';
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
  Icon,
  Input
} from 'antd';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

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

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class Configure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      defaultConfig: {},
      maxIndexLimit: 0,
      inActiveList: [],
      items: [],
      parentDataFetched: false,
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
        gameBroadcast: true,
        homeSearchIA: true,
        inviteEarn: true,
        referEarn: true
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.populateDragList = this.populateDragList.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    // this.getGameList();
    this.getTierList();
  }

  getGameList(countryCode) {
    this.props.actions.getGameOrder('COMBINED', countryCode).then(() => {
      if (
        this.props.games &&
        this.props.games.gameOrder &&
        this.props.games.gameOrder.games
      ) {
        this.setState({
          inActiveList: [...this.props.games.gameOrder.games]
        });
      }
    });
  }

  getTierList() {
    this.props.actions.getTierList().then(() => {
      if (this.props.tierList) {
        let tierList = [];
        tierList.push(
          <Option key={99} value={'DEFAULT'}>
            {'Default'}
          </Option>
        );
        this.props.tierList.tiers.map((tier, index) => {
          tierList.push(
            <Option key={tier.tier} value={tier.tier.toUpperCase()}>
              {tier.tier}
            </Option>
          );
        });
        this.setState({
          tierList
        });
      }
    });
  }

  selectCountry(value) {
    this.setState({
      parentDataFetched: false,
      fetched: false,
      countryCode: value
    });
    this.getCurrentConfig(value);
    this.getGameList(value);
  }

  getCurrentConfig(countryCode) {
    let data = {
      countryCode: countryCode
    };
    this.props.actions.getCurrentConfig(data).then(() => {
      if (this.props.getCurrentConfigSuccess) {
        let tierConfig = JSON.parse(this.props.getCurrentConfigSuccess);
        this.setState({
          tierConfig: {
            ...tierConfig.tierConfigJson
          },
          parentDataFetched: true
        });
      }
    });
  }

  fetchFromTierSelected(e) {
    this.setState({ selectedTier: e });
    if (!this.state.tierConfig[e]) {
      message.error('Tier not configured');
      return;
    }
    this.populateDragList(e);
  }

  populateDragList(tier) {
    let items = [];
    let vm = this;
    let indexArray = [];
    let inActiveList = [...this.props.games.gameOrder.games];
    // let currentList = [...tierDetails.gamesConfig];
    inActiveList.forEach((item, index) => {
      if (vm.state.tierConfig[tier].gamesConfig.find(x => x.id === item.id)) {
        let tempObj = vm.state.tierConfig[tier].gamesConfig.find(
          x => x.id === item.id
        );
        item['inputIndex'] = tempObj.index;
        items.push(item);
        indexArray.push(index);
      }
    });

    let filteredArray = inActiveList.filter(function(item, index) {
      return !indexArray.includes(index);
    });
    items = _.orderBy(items, 'inputIndex', 'asc');
    this.setState({
      items: [...items],
      fetched: true,
      inActiveList: [...filteredArray]
    });
  }

  removeItem(item) {
    let items = [...this.state.items];
    let inActiveList = [...this.state.inActiveList];
    inActiveList.push(item);
    _.remove(items, function(x) {
      return x.id === item.id;
    });
    // console.log( items,  inActiveList);
    this.setState({ items: [...items], inActiveList: [...inActiveList] });
  }

  onDragEnd = result => {
    const { source, destination } = result;
    var vm = this;
    if (!destination) {
      return;
    }
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
      case 'GAME_BROADCAST':
        isJsonVerified.gameBroadcast = isJsonFlag;
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

        let gameBroadcast = {};
        gameBroadcast['show'] = values.gameBroadcastShow;
        gameBroadcast['index'] = values.gameBroadcastIndexValue;
        gameBroadcast['data'] = values.gameBroadcastData
          ? JSON.parse(values.gameBroadcastData)
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
            gameBroadcast: gameBroadcast,
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
            gameBroadcast: gameBroadcast,
            iaGameCategories: homeSearchIA,
            inviteEarn: inviteEarn,
            referEarn: referEarn
          };
        }

        let gamesConfig = [];
        this.state.items.forEach((item, index) => {
          let row = {};
          row['id'] = item.id;
          row['show'] = true;
          row['locked'] = false;
          row['index'] = index;
          gamesConfig.push(row);
        });

        let data = {
          applyToTiers: values.applyToTiers,
          countryCode: values.countryCode,
          config: config,
          gamesConfig: gamesConfig
        };
        this.props.actions.setTierWidget(data).then(() => {
          if (
            this.props.setTierWidgetConfigResponse &&
            this.props.setTierWidgetConfigResponse.success
          ) {
            this.props.history.push('/tier-widget/view');
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
      applyToTiers:
        isFieldTouched('applyToTiers') && getFieldError('applyToTiers'),
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
      gameBroadcastIndexValue:
        isFieldTouched('gameBroadcastIndexValue') &&
        getFieldError('gameBroadcastIndexValue'),
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

    let tierDetails = {};

    let selectedTier = this.state.selectedTier
      ? this.state.selectedTier
      : 'DEFAULT';

    if (this.state.parentDataFetched) {
      tierDetails = { ...this.state.tierConfig[selectedTier] };
    }

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Home Config">
            <Card>
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
              {this.state.parentDataFetched && (
                <FormItem
                  validateStatus={errors.fetchFromTier ? 'error' : ''}
                  help={errors.fetchFromTier || ''}
                  {...formItemLayout}
                  label={<span>Fetch From Tier</span>}
                >
                  {getFieldDecorator('fetchFromTier', {
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
                      onSelect={e => this.fetchFromTierSelected(e)}
                      style={{ width: '100%' }}
                      placeholder="Tier"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.tierList}
                    </Select>
                  )}
                </FormItem>
              )}
            </Card>

            {this.state.fetched && (
              <Row>
                <Card>
                  <FormItem
                    validateStatus={errors.applyToTiers ? 'error' : ''}
                    help={errors.applyToTiers || ''}
                    {...formItemLayout}
                    label={<span>Apply To Tiers</span>}
                  >
                    {getFieldDecorator('applyToTiers', {
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          message: 'Tier field is mandatory',
                          whitespace: false
                        }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Tier"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.tierList}
                      </Select>
                    )}
                  </FormItem>
                </Card>
                <Card title="Missions" type="inner">
                  <FormItem {...formItemLayout} label={'Missions Show'}>
                    {getFieldDecorator('missionsShow', {
                      initialValue:
                        tierDetails.config.missions &&
                        tierDetails.config.missions.show
                          ? tierDetails.config.missions.show
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
                        tierDetails.config.missions &&
                        tierDetails.config.missions.index
                          ? tierDetails.config.missions.index
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
                        tierDetails.config.missions &&
                        tierDetails.config.missions.data
                          ? JSON.stringify(tierDetails.config.missions.data)
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
                        tierDetails.config.iaGameCategories &&
                        tierDetails.config.iaGameCategories.show
                          ? tierDetails.config.iaGameCategories.show
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
                    validateStatus={errors.homeSearchIndexValue ? 'error' : ''}
                    help={errors.homeSearchIndexValue || ''}
                    {...formItemLayout}
                    label={'Game Category Index'}
                  >
                    {getFieldDecorator('homeSearchIndexValue', {
                      initialValue:
                        tierDetails.config.iaGameCategories &&
                        tierDetails.config.iaGameCategories.index
                          ? tierDetails.config.iaGameCategories.index
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
                        tierDetails.config.iaGameCategories &&
                        tierDetails.config.iaGameCategories.data
                          ? JSON.stringify(
                              tierDetails.config.iaGameCategories.data
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
                        tierDetails.config.inviteEarn &&
                        tierDetails.config.inviteEarn.show
                          ? tierDetails.config.inviteEarn.show
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
                    validateStatus={errors.inviteEarnIndexValue ? 'error' : ''}
                    help={errors.inviteEarnIndexValue || ''}
                    {...formItemLayout}
                    label={'Invite Earn Index'}
                  >
                    {getFieldDecorator('inviteEarnIndexValue', {
                      initialValue:
                        tierDetails.config.inviteEarn &&
                        tierDetails.config.inviteEarn.index
                          ? tierDetails.config.inviteEarn.index
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
                        tierDetails.config.inviteEarn &&
                        tierDetails.config.inviteEarn.data
                          ? JSON.stringify(tierDetails.config.inviteEarn.data)
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
                        tierDetails.config.referEarn &&
                        tierDetails.config.referEarn.show
                          ? tierDetails.config.referEarn.show
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
                        tierDetails.config.referEarn &&
                        tierDetails.config.referEarn.index
                          ? tierDetails.config.referEarn.index
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
                        tierDetails.config.referEarn &&
                        tierDetails.config.referEarn.data
                          ? JSON.stringify(tierDetails.config.referEarn.data)
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
                        tierDetails.config,
                        'story.show',
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
                        tierDetails.config,
                        'story.index',
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
                        _.get(tierDetails.config, 'story.data', {})
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
                  {tierDetails.config.banner.show}
                  <FormItem {...formItemLayout} label={'Banner Show'}>
                    {getFieldDecorator('bannerShow', {
                      initialValue: tierDetails.config.banner.show,
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
                      initialValue: tierDetails.config.banner.index,
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
                        tierDetails.config.banner &&
                        tierDetails.config.banner.data
                          ? JSON.stringify(tierDetails.config.banner.data)
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
                      initialValue: tierDetails.config.featured.show,
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
                      initialValue: tierDetails.config.featured.index,
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
                        tierDetails.config.featured &&
                        tierDetails.config.featured.data
                          ? JSON.stringify(tierDetails.config.featured.data)
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
                        tierDetails.config.recentlyPlayedGames &&
                        tierDetails.config.recentlyPlayedGames.show
                          ? tierDetails.config.recentlyPlayedGames.show
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
                        tierDetails.config.recentlyPlayedGames &&
                        tierDetails.config.recentlyPlayedGames.index
                          ? tierDetails.config.recentlyPlayedGames.index
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
                    help={!this.state.isJsonVerified.recentlyPlayedGames || ''}
                    {...formItemLayout}
                    label={'Recently Played Games Data'}
                  >
                    {getFieldDecorator('recentlyPlayedGamesData', {
                      initialValue:
                        tierDetails.config.recentlyPlayedGames &&
                        tierDetails.config.recentlyPlayedGames.data
                          ? JSON.stringify(
                              tierDetails.config.recentlyPlayedGames.data
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
                        tierDetails.config.configurableGameList &&
                        tierDetails.config.configurableGameList.show
                          ? tierDetails.config.configurableGameList.show
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
                        tierDetails.config.configurableGameList &&
                        tierDetails.config.configurableGameList.index
                          ? tierDetails.config.configurableGameList.index
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
                    help={!this.state.isJsonVerified.configurableGameList || ''}
                    {...formItemLayout}
                    label={'Configurable Game List Data'}
                  >
                    {getFieldDecorator('configurableGameListData', {
                      initialValue:
                        tierDetails.config.configurableGameList &&
                        tierDetails.config.configurableGameList.data
                          ? JSON.stringify(
                              tierDetails.config.configurableGameList.data
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
                        tierDetails.config.gameReel &&
                        tierDetails.config.gameReel.show
                          ? tierDetails.config.gameReel.show
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
                        tierDetails.config.gameReel &&
                        tierDetails.config.gameReel.index
                          ? tierDetails.config.gameReel.index
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
                        tierDetails.config.gameReel &&
                        tierDetails.config.gameReel.data
                          ? JSON.stringify(tierDetails.config.gameReel.data)
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
                      initialValue: tierDetails.config.games.show,
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
                      initialValue: tierDetails.config.games.index,
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
                        tierDetails.config.games &&
                        tierDetails.config.games.data
                          ? JSON.stringify(tierDetails.config.games.data)
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
                      initialValue: tierDetails.config.challenge.show,
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
                      initialValue: tierDetails.config.challenge.index,
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
                        tierDetails.config.challenge &&
                        tierDetails.config.challenge.data
                          ? JSON.stringify(tierDetails.config.challenge.data)
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
                        tierDetails.config.search &&
                        tierDetails.config.search.show
                          ? tierDetails.config.search.show
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
                        tierDetails.config.search &&
                        tierDetails.config.search.gameIndex
                          ? tierDetails.config.search.gameIndex
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
                        tierDetails.config.search &&
                        tierDetails.config.search.data
                          ? JSON.stringify(tierDetails.config.search.data)
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
                        tierDetails.config.explore &&
                        tierDetails.config.explore.show
                          ? tierDetails.config.explore.show
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
                        tierDetails.config.explore &&
                        tierDetails.config.explore.index
                          ? tierDetails.config.explore.index
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
                        tierDetails.config.explore &&
                        tierDetails.config.explore.data
                          ? JSON.stringify(tierDetails.config.explore.data)
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
                        tierDetails.config.tickets &&
                        tierDetails.config.tickets.show
                          ? tierDetails.config.tickets.show
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
                        tierDetails.config.tickets &&
                        tierDetails.config.tickets.gameIndex
                          ? tierDetails.config.tickets.gameIndex
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
                        tierDetails.config.tickets &&
                        tierDetails.config.tickets.data
                          ? JSON.stringify(tierDetails.config.tickets.data)
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
                      initialValue: tierDetails.config.collectable.show,
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
                    validateStatus={errors.collectableIndexValue ? 'error' : ''}
                    help={errors.collectableIndexValue || ''}
                    {...formItemLayout}
                    label={'Collectable Game Index'}
                  >
                    {getFieldDecorator('collectableIndexValue', {
                      initialValue: tierDetails.config.collectable.gameIndex,
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
                        tierDetails.config.collectable &&
                        tierDetails.config.collectable.data
                          ? JSON.stringify(tierDetails.config.collectable.data)
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
                      initialValue: tierDetails.config.starsV2.show,
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
                      initialValue: tierDetails.config.starsV2.gameIndex,
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
                        tierDetails.config.starsV2 &&
                        tierDetails.config.starsV2.data
                          ? JSON.stringify(tierDetails.config.starsV2.data)
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
                      initialValue: tierDetails.config.audio.show,
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
                      initialValue: tierDetails.config.audio.gameIndex,
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
                        tierDetails.config.audio &&
                        tierDetails.config.audio.data
                          ? JSON.stringify(tierDetails.config.audio.data)
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
                      initialValue: tierDetails.config.refer.show,
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
                      initialValue: tierDetails.config.refer.gameIndex,
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
                        tierDetails.config.refer &&
                        tierDetails.config.refer.data
                          ? JSON.stringify(tierDetails.config.refer.data)
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
                      initialValue: tierDetails.config.userGenerated.show,
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
                      initialValue: tierDetails.config.userGenerated.gameIndex,
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
                        tierDetails.config.userGenerated &&
                        tierDetails.config.userGenerated.data
                          ? JSON.stringify(
                              tierDetails.config.userGenerated.data
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
                          this.verifyJsonInput(e.target.value, 'USER_GENERATED')
                        }
                      />
                    )}
                  </FormItem>
                </Card>
                <Card title="Prime Widget" type="inner">
                  <FormItem {...formItemLayout} label={'Prime Widget Show'}>
                    {getFieldDecorator('primeWidgetShow', {
                      initialValue:
                        tierDetails.config.primeWidget &&
                        tierDetails.config.primeWidget.show
                          ? tierDetails.config.primeWidget.show
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
                    validateStatus={errors.primeWidgetIndexValue ? 'error' : ''}
                    help={errors.primeWidgetIndexValue || ''}
                    {...formItemLayout}
                    label={'Prime Widget Index'}
                  >
                    {getFieldDecorator('primeWidgetIndexValue', {
                      initialValue:
                        tierDetails.config.primeWidget &&
                        tierDetails.config.primeWidget.index
                          ? tierDetails.config.primeWidget.index
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
                        tierDetails.config.primeWidget &&
                        tierDetails.config.primeWidget.data
                          ? JSON.stringify(tierDetails.config.primeWidget.data)
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
                <Card title="Game Broadcast" type="inner">
                  <FormItem {...formItemLayout} label={'Game Broadcast Show'}>
                    {getFieldDecorator('gameBroadcastShow', {
                      initialValue:
                        tierDetails.config.gameBroadcast &&
                        tierDetails.config.gameBroadcast.show
                          ? tierDetails.config.gameBroadcast.show
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
                      errors.gameBroadcastIndexValue ? 'error' : ''
                    }
                    help={errors.gameBroadcastIndexValue || ''}
                    {...formItemLayout}
                    label={'Game Broadcast Index'}
                  >
                    {getFieldDecorator('gameBroadcastIndexValue', {
                      initialValue:
                        tierDetails.config.gameBroadcast &&
                        tierDetails.config.gameBroadcast.index
                          ? tierDetails.config.gameBroadcast.index
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
                      !this.state.isJsonVerified.gameBroadcast ? 'error' : ''
                    }
                    help={!this.state.isJsonVerified.gameBroadcast || ''}
                    {...formItemLayout}
                    label={'Game Broadcast Data'}
                  >
                    {getFieldDecorator('gameBroadcastData', {
                      initialValue:
                        tierDetails.config.gameBroadcast &&
                        tierDetails.config.gameBroadcast.data
                          ? JSON.stringify(
                              tierDetails.config.gameBroadcast.data
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
                          this.verifyJsonInput(e.target.value, 'GAME_BROADCAST')
                        }
                      />
                    )}
                  </FormItem>
                </Card>
                {this.state.countryCode && this.state.countryCode === 'ID' && (
                  <Card title="Wallet Banner" type="inner">
                    <FormItem {...formItemLayout} label={'Wallet Banner Show'}>
                      {getFieldDecorator('walletBannerShow', {
                        initialValue:
                          tierDetails.config.walletBanner &&
                          tierDetails.config.walletBanner.show
                            ? tierDetails.config.walletBanner.show
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
                          tierDetails.config.walletBanner &&
                          tierDetails.config.walletBanner.data
                            ? JSON.stringify(
                                tierDetails.config.walletBanner.data
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
                <Card>
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Row>
                      <Col span={12}>
                        <Card title="Inactive List">
                          {this.state.fetched ? (
                            <Droppable
                              isDropDisabled={true}
                              droppableId="droppable2"
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  style={getListStyle(snapshot.isDraggingOver)}
                                >
                                  {this.state.inActiveList.map(
                                    (item, index) => (
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
                                            <span>
                                              <img
                                                style={{
                                                  width: 'auto',
                                                  height: '40px',
                                                  borderRadius: '5px'
                                                }}
                                                src={
                                                  item.platforms &&
                                                  item.platforms.android &&
                                                  item.platforms.android
                                                    .assets &&
                                                  item.platforms.android.assets
                                                    .thumb
                                                    ? item.platforms.android
                                                        .assets.thumb
                                                    : ''
                                                }
                                                alt=""
                                              />
                                            </span>
                                            <span>{item.id}</span>
                                            <Tag
                                              style={{ fontSize: '16px' }}
                                              color="green"
                                            >
                                              {item.name}
                                            </Tag>
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  )}
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
                                        {item.platforms && (
                                          <span>
                                            <img
                                              style={{
                                                width: 'auto',
                                                height: '40px',
                                                borderRadius: '5px'
                                              }}
                                              src={
                                                item.platforms &&
                                                item.platforms.android &&
                                                item.platforms.android.assets &&
                                                item.platforms.android.assets
                                                  .thumb
                                                  ? item.platforms.android
                                                      .assets.thumb
                                                  : ''
                                              }
                                              alt=""
                                            />
                                          </span>
                                        )}
                                        <span>{item.id}</span>
                                        <Tag
                                          style={{ fontSize: '16px' }}
                                          color="green"
                                        >
                                          {item.name}
                                        </Tag>
                                        <Icon
                                          type="delete"
                                          onClick={() => this.removeItem(item)}
                                        />
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
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCurrentConfigSuccess: state.tierWidget.getCurrentConfigSuccess,
    gamesList: state.games.allGames,
    tierList: state.userProfile.tierList,
    games: _.cloneDeep(state.games),
    setTierWidgetConfigResponse: state.tierWidget.setTierWidgetConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...tierWidgetsActions, ...gameActions, ...userProfileActions },
      dispatch
    )
  };
}
const ConfigureForm = Form.create()(Configure);
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureForm);
