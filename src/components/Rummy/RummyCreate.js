import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as tournamentConfigActions from '../../actions/tournamentConfigActions';
import * as tournamentActions from '../../actions/tournamentActions';
import * as storageActions from '../../actions/storageActions';
import * as segmentActions from '../../actions/segmentActions';
import * as sponsorActions from '../../actions/sponsorActions';
import { getCdnPathForUpload } from '../../actions/websiteActions';
import { fetchGames } from '../../actions/gameActions';
import humanizeDuration from 'humanize-duration';
import UploadConfig from './UploadConfig';
import moment from 'moment';
import { find } from 'lodash';
import UploadSegment from './UploadSegment';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Icon,
  DatePicker,
  message,
  Radio,
  Checkbox,
  Select,
  Button,
  Alert,
  Row,
  Col,
  notification,
  Upload,
  Modal
} from 'antd';
import { Helmet } from 'react-helmet';
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const styleList = [];
class RummyCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      durationInfoVisible: false,
      humanDuration: '',
      durationbut1Focus: '',
      durationbut2Focus: '',
      durationbut3Focus: '',
      durationMin: 0,
      maxPlayers: 1,
      maxRanks: 0,
      isRecurringFlag: true,
      selectedTime: {},
      selectedData: {},
      totalCash: 0,
      totalTokens: 0,
      rankRanges: [],
      disableField: false,
      sponsorConfig: false,
      enableChat: true,
      selectSegment: true,
      // autoFinish: true,
      tournamentType: 'NORMAL',
      isFeaturedLobby: false,
      flPreviewVisible: false,
      flPreviewImage: '',
      loading: false,
      cdnPath: '',
      flFileList: [],
      flImageUrl: '',
      styleFileList: [],
      styleImageUrl: '',
      stylePreviewVisible: false,
      stylePreviewImage: '',
      selectedStyle: 'NORMAL',
      gameList: [],
      customPrizeString: '',
      sponsorId: null,
      sponsorDescription: '',
      shareText: '',
      checkedValues: ['CASH', 'IOS'],
      isPooled: false,
      isDynamicTableValidated: false,
      thresholdRanges: [],
      segmentList: [],
      selectedGameId: null,
      isDiscounted: false,
      gameType: null,
      dealsMultiWinner: false,
      maxRake: 20,
      defaultMaxRake: 20,
      maxBonusLimit: 15,
      defaultMaxBonusLimit: 15,
      isSummaryVerified: false,
      showSummaryModal: false,
      summaryData: {}
    };
    this.getGameList = this.getGameList.bind(this);
    this.validateJson = this.validateJson.bind(this);
    this.getSegmentList = this.getSegmentList.bind(this);
    this.enableSegmentSelection = this.enableSegmentSelection.bind(this);
  }
  getGameList() {
    var gameList = [];
    if (!this.props.gameList && gameList.length === 0) {
      this.props.actions.fetchGames().then(() => {
        this.props.gamesList.map(game => {
          if (game.gameType.includes('RUMMY')) {
            gameList.push(
              <Option key={'game' + game.id} value={game.id}>
                {game.name} ( {game.id} )
              </Option>
            );
          }
          //   if (this.props.location.pathname.search("config") === 1) {
          //     if (game.tournamentSupported) {
          //       gameList.push(
          //         <Option key={"game" + game.id} value={game.id}>
          //           {game.name} ( {game.id} )
          //         </Option>
          //       );
          //     }
          //   } else {
          //     if (game.battleSupported) {
          //       gameList.push(
          //         <Option key={"game" + game.id} value={game.id}>
          //           {game.name} ( {game.id} )
          //         </Option>
          //       );
          //     }
          //   }
          return true;
        });
      });
    }
    this.setState({
      gameList
    });
  }

  getSegmentList() {
    if (this.state.segmentList && this.state.segmentList.length === 0) {
      this.props.actions.getSegmentList('active').then(() => {
        if (this.props.segment.list.length) {
          let segmentList = [];
          this.props.segment.list.map(segment => {
            segmentList.push(
              <Option key={'segment' + segment.id} value={segment.id}>
                {segment.name}
              </Option>
            );
            return true;
          });
          this.setState({ segmentList });
        }
      });
    }
  }

  async getRummyConfigs() {
    let gameType = '';
    let type = this.state.gameType;
    switch (type) {
      case 'DEALS_RUMMY':
        gameType = 'config-deals';
        break;
      case 'POOL_RUMMY':
        gameType = 'config-pool';
        break;
      case 'POINTS_RUMMY':
        gameType = 'config-point';
        break;
      default:
        break;
    }
    let data = {
      gameType
    };
    await this.props.actions.getZkRummyConfig(data);
    if (this.props.getZkRummyConfigResponse) {
      try {
        let gameInputData = JSON.parse(this.props.getZkRummyConfigResponse);
        this.props.form.setFieldsValue({
          gameInputData: JSON.stringify(gameInputData)
        });
      } catch (error) {
        message.error('Zookeeper value is not in correct JSON format');
      }
    } else {
      message.error(
        'Could not fetch game config. Please enter it manually',
        1.5
      );
    }
  }

  enableSegmentSelection(e) {
    this.setState({ selectSegment: e.target.value });
  }

  componentDidMount() {
    this.getGameList();
    this.getSegmentList();
    this.props.form.validateFields();

    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
    // ------------------------- Cloned ------------------------- //
    if (this.props.tournament.cloneConfig) {
      const gameType = (
        find(this.props.gamesList, {
          id: this.props.tournament.cloneConfig.gameId
        }) || {}
      ).gameType;
      this.setState({
        selectedGameId: this.props.tournament.cloneConfig.gameId,
        gameType
      });
      const formValues = {
        name: this.props.tournament.cloneConfig.name,
        description: this.props.tournament.cloneConfig.description,
        gameId: this.props.tournament.cloneConfig.gameId,
        gameConfigName: this.props.tournament.cloneConfig.gameConfigName,
        gameInputData: this.props.tournament.cloneConfig.gameInputData,
        duration: this.props.tournament.cloneConfig.duration,
        maxBonusPercentage: JSON.parse(
          this.props.tournament.cloneConfig.extraInfo
        ).maxBonusPercentage,
        currency: this.props.tournament.cloneConfig.currency,
        moneyEntryFee: this.props.tournament.cloneConfig.moneyEntryFee
          ? this.props.tournament.cloneConfig.moneyEntryFee
          : 0,
        currencyFactor: JSON.parse(
          this.props.tournament.cloneConfig.gameInputData
        ).CurrencyFactor,
        segmentId:
          JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds &&
          JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds
            .length > 0
            ? JSON.parse(
                this.props.tournament.cloneConfig.extraInfo
              ).segmentIds.split(',')
            : [],
        applyAnyOfSegment: JSON.parse(
          this.props.tournament.cloneConfig.extraInfo
        ).applyAnyOfSegment
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo)
              .applyAnyOfSegment
          : false,
        rake: JSON.parse(this.props.tournament.cloneConfig.gameInputData).Rake,
        startTime: moment(this.props.tournament.cloneConfig.startTime),
        isFeaturedLobby: JSON.parse(
          this.props.tournament.cloneConfig.extraInfo || '{}'
        ).hasOwnProperty('bgImage'),
        style: this.props.tournament.cloneConfig.style,
        title: this.props.tournament.cloneConfig.title,
        subtitle: this.props.tournament.cloneConfig.subtitle
      };

      if (this.props.tournament.cloneConfig) {
        const { gameInputData } = this.props.tournament.cloneConfig;
        try {
          const parsedData = JSON.parse(gameInputData);
          formValues.Collusion = parsedData.Collusion;
          formValues.CollusionDetection = parsedData.CollusionDetection;
          formValues.callToFraudServiceEnabled =
            parsedData.callToFraudServiceEnabled;
          formValues.InGameMaxPlayers = parsedData.MaxPlayers;
          formValues.InGameMinPlayers = parsedData.MinPlayers;
          formValues.extraVariable =
            parsedData[
              this.getGameInputExtraVariableFieldDetails(gameType).key
            ];
        } catch (e) {
          message.error('JSON PARSING ERROR: ', e);
        }
      }

      setTimeout(() => {
        this.props.form.setFieldsValue(formValues);
      }, 3);

      if (this.props.tournament.editType === 'edit') {
        this.setState({
          disableField: true
        });
      }
    }

    if (
      this.props.tournament.cloneConfig &&
      this.props.tournament.cloneConfig.extraInfo
    ) {
      let extraInfo = JSON.parse(this.props.tournament.cloneConfig.extraInfo);
      if (extraInfo.supportedAppTypes) {
        this.props.form.setFieldsValue({
          appType: extraInfo.supportedAppTypes
            ? [...extraInfo.supportedAppTypes]
            : this.state.checkedValues
        });
      }
      if (extraInfo.minReactVersion) {
        this.props.form.setFieldsValue({
          minReactVersion: extraInfo.minReactVersion
        });
      }
      if (extraInfo.expressTable) {
        this.props.form.setFieldsValue({
          expressTable: extraInfo.expressTable
        });
      }
      if (extraInfo.actualEntryFee) {
        this.setState({ isDiscounted: true }, () => {
          this.props.form.setFieldsValue({
            actualEntryFee: extraInfo.actualEntryFee
          });
        });
      }
      if (extraInfo.dealRummyConfig) {
        this.props.form.setFieldsValue({
          // minPlayers: extraInfo.dealRummyConfig.minPlayers
          //   ? extraInfo.dealRummyConfig.minPlayers
          //   : 2,
          // maxPlayers: extraInfo.dealRummyConfig.maxPlayers
          //   ? extraInfo.dealRummyConfig.maxPlayers
          //   : 2,
          trc: extraInfo.dealRummyConfig.trc ? extraInfo.dealRummyConfig.trc : 0
        });
        if (extraInfo.dealRummyConfig.dealsMultiWinner) {
          this.setState(
            {
              dealsMultiWinner: true
            },
            () => {
              this.props.form.setFieldsValue({
                dealsMultiWinner: true,
                firstWinnerPrice: extraInfo.dealRummyConfig.firstWinnerPrice
                  ? extraInfo.dealRummyConfig.firstWinnerPrice
                  : 0,
                secondWinnerPrice: extraInfo.dealRummyConfig.secondWinnerPrice
                  ? extraInfo.dealRummyConfig.secondWinnerPrice
                  : 0
              });
            }
          );
        }
      }
      if (extraInfo.hasOwnProperty('bgImage')) {
        this.setState({
          isFeaturedLobby: true,
          flImageUrl: extraInfo.bgImage,
          flFileList: [
            {
              uid: -1,
              name: 'file.png',
              status: 'done',
              url: extraInfo.bgImage
            }
          ]
        });
      }
    }

    if (this.props.tournament.cloneConfig) {
      const { style, imageUrl } = this.props.tournament.cloneConfig;
      const state = { selectedStyle: style };
      if (style === 'SPECIAL') {
        state.styleImageUrl = imageUrl;
        state.styleFileList = [
          {
            uid: -11,
            name: 'tournament-style.png',
            status: 'done',
            url: imageUrl
          }
        ];
      }
      this.setState(state);
    }

    if (!this.props.tournament.styleList && styleList.length === 0) {
      this.props.actions.getStyles().then(() => {
        if (this.props.tournament.styles.length) {
          this.props.tournament.styles.map(style => {
            if (!['normal', 'special'].includes(style.name.toLowerCase()))
              return false;
            styleList.push(
              <Option key={style.name} value={style.name}>
                {style.name}
              </Option>
            );
            return true;
          });
        }
      });
    }

    this.props.form.setFieldsValue({
      extraInfo: '{}'
    });
  }

  validateJson(e, inputType) {
    let val = {};
    if (e.target && e.target.value) {
      val = e.target.value;
    } else {
      val = e;
    }
    if (val !== '') {
      try {
        JSON.parse(val);
        switch (inputType) {
          case 'GAME_INPUT_DATA':
            this.setState({ gameInputDataJsonError: false });
            return true;
          case 'EXTRA_INFO':
            this.setState({ extraInfoJsonError: false });
            return true;
          case 'COUNTRY_SPECIFIC_CONFIG':
            this.setState({ countrySpecificConfigsJsonError: false });
            return true;
          default:
            break;
        }
      } catch (error) {
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topRight',
          top: 100
        });
        switch (inputType) {
          case 'GAME_INPUT_DATA':
            this.setState({ gameInputDataJsonError: true });
            return false;
          case 'EXTRA_INFO':
            this.setState({ extraInfoJsonError: true });
            return false;
          case 'COUNTRY_SPECIFIC_CONFIG':
            this.setState({ countrySpecificConfigsJsonError: true });
            return false;
          default:
            break;
        }
      }
    }
  }

  gameSelected(gameId) {
    let gameList = [...this.props.gamesList];
    let gameObj = find(gameList, { id: gameId });
    let gameType = gameObj.gameType;
    this.setState({ selectedGameId: gameId, gameType: gameType }, () => {
      this.getRummyConfigs();
    });
  }

  toggleDiscounted(value) {
    this.setState({ isDiscounted: value });
  }

  dealsMultiWinnerChanged(value) {
    this.setState({ dealsMultiWinner: value });
  }

  changeMaxRake(value) {
    const { defaultMaxRake } = this.state;
    if (value) {
      this.setState({ maxRake: 50 });
    } else {
      this.setState({ maxRake: defaultMaxRake });
    }
  }

  getMaxRake() {
    return this.state.maxRake;
  }

  changeMaxBonusLimit(value) {
    const { defaultMaxBonusLimit } = this.state;
    if (value) {
      this.setState({ maxBonusLimit: 100 });
    } else {
      this.setState({ maxBonusLimit: defaultMaxBonusLimit });
    }
  }

  getMaxBonusLimit() {
    return this.state.maxBonusLimit;
  }

  getGameInputExtraVariableFieldDetails = (gameType = this.state.gameType) => {
    switch (gameType) {
      case 'DEALS_RUMMY':
        return {
          fieldName: 'In Game No of Deals',
          fieldInfo: 'The no of deals which should be allowed in this lobby',
          key: 'Round_count',
          minLimit: 2,
          maxLimit: 10
        };
      case 'POOL_RUMMY':
        return {
          fieldName: 'Pool In game Format',
          fieldInfo: 'The no of points in game format',
          key: 'maxPoints',
          minLimit: 101,
          maxLimit: 201
        };
      // case "POINTS_RUMMY":
      //   return {
      //     fieldName: "Current Rummy Wallet",
      //     fieldInfo: "The value for key CurrentrummyWallet",
      //     key: "CurrentrummyWallet",
      //     minLimit: 2,
      //   };
    }
    return { fieldInfo: '', key: '', fieldName: '', minLimit: 0 };
  };

  openSummaryModal() {
    const {
      name,
      rake,
      maxBonusPercentage,
      InGameMinPlayers,
      InGameMaxPlayers,
      moneyEntryFee,
      extraVariable,
      Collusion,
      specificCountry,
      startTime,
      duration
    } = this.props.form.getFieldsValue();

    const supportedCountries =
      specificCountry === 'ALL' ? ['IN', 'ID', 'US'] : [specificCountry];
    const grossMargin = rake - maxBonusPercentage;

    const endTime = moment(startTime).add(duration, 'minutes');

    let summaryData = {
      name,
      rake,
      maxBonusPercentage,
      InGameMinPlayers,
      InGameMaxPlayers,
      moneyEntryFee,
      extraVariable,
      Collusion,
      supportedCountries,
      grossMargin,
      startTime,
      endTime
    };

    this.setState({
      summaryData,
      showSummaryModal: true
    });
  }

  closeSummaryModal() {
    this.setState({
      summaryData: {},
      showSummaryModal: false
    });
  }

  confirmSummaryInformation() {
    this.setState({
      showSummaryModal: false,
      isSummaryVerified: true,
      summaryData: {}
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.isFeaturedLobby && !this.state.flImageUrl) {
          message.error(
            'Please upload feature image file before going forward'
          );
          return;
        }

        if (
          this.state.maxBonusLimit !== 100 &&
          values.maxBonusPercentage >= values.rake
        ) {
          message.error('Rake should be higher than bonus cash');
          return;
        }
        // ------------ Segment ------------- //
        if (!this.state.selectSegment) {
          delete values.selectSegment;
          delete values.segmentId;
        }
        // ------------ Modify game input data ------------- //
        let gameInputData = JSON.parse(values.gameInputData);
        if (this.state.gameType !== 'DEALS_RUMMY') {
          gameInputData['CurrencyFactor'] = values.currencyFactor;
        }

        gameInputData['Rake'] = values.rake;
        gameInputData['EntryFee'] = values.moneyEntryFee;

        if (this.state.gameType === 'POOL_RUMMY') {
          gameInputData['ESP'] = values.ESP;
          gameInputData['MP'] = values.MP;
          gameInputData['SP'] = values.SP;
        }

        if (values.InGameMinPlayers > values.InGameMaxPlayers) {
          message.error(
            'In game min players can not be greater than In game max players. Please fix that to continue'
          );
          return;
        }

        gameInputData['MaxPlayers'] = values.InGameMaxPlayers;
        gameInputData['MinPlayers'] = values.InGameMinPlayers;
        gameInputData['Min_player_count'] = values.InGameMinPlayers;
        gameInputData['Max_player_count'] = values.InGameMaxPlayers;
        values['minPlayers'] = values.InGameMinPlayers;
        values['maxPlayers'] = values.InGameMaxPlayers;

        if (
          this.state.gameType === 'DEALS_RUMMY'
          // this.state.selectedGameId === 1000106
        ) {
          // DEALS

          gameInputData['dealsMultiWinner'] = values.dealsMultiWinner;
          gameInputData['multiWinnerCount'] = values.multiWinnerCount;
          gameInputData['firstWinnerPrice'] = values.firstWinnerPrice;
          gameInputData['secondWinnerPrice'] = values.secondWinnerPrice;
        }

        gameInputData['Collusion'] = values.Collusion;
        gameInputData['CollusionDetection'] = values.Collusion;
        gameInputData['callToFraudServiceEnabled'] = values.Collusion;
        // gameInputData['CollusionDetection'] = values.CollusionDetection;
        // gameInputData['callToFraudServiceEnabled'] =
        //   values.callToFraudServiceEnabled;

        gameInputData[this.getGameInputExtraVariableFieldDetails().key] =
          values.extraVariable;

        if (this.state.gameType === 'POINTS_RUMMY') {
          gameInputData['CurrentrummyWallet'] = values.moneyEntryFee;
        }

        gameInputData['HideProfile'] = values.HideProfile;
        gameInputData['ShowLeaderboard'] = values.ShowLeaderboard;

        delete values.Collusion;
        delete values.CollusionDetection;
        delete values.callToFraudServiceEnabled;
        delete values.extraVariable;

        values.gameInputData = JSON.stringify(gameInputData);

        // ------------ Addtional Extra info ------------- //
        if (values.extraInfo) {
          values.extraInfo = JSON.parse(values.extraInfo);
        } else {
          values.extraInfo = {};
        }
        // ------------ supportedAppTypes ------------- //
        values.extraInfo['supportedAppTypes'] = this.state.checkedValues;

        if (values.minReactVersion && values.minReactVersion > 0) {
          values.extraInfo['minReactVersion'] = values.minReactVersion;
        }
        // UPLOAD SEGMENT
        if (
          this.state.customSegmentFilePath &&
          this.state.customSegmentFilePath !== '-1'
        ) {
          values.extraInfo[
            'customSegmentFilePath'
          ] = this.state.customSegmentFilePath;
        }

        values.extraInfo['hasTicket'] = values.hasTicket;

        if (this.state.gameType === 'POOL_RUMMY') {
          values.extraInfo['ESP'] = values.ESP;
          values.extraInfo['MP'] = values.MP;
          values.extraInfo['SP'] = values.SP;
          values.extraInfo['poolRummyConfig'] = {
            minPlayers: values.InGameMinPlayers,
            maxPlayers: values.InGameMaxPlayers
          };
        }

        if (this.state.isDiscounted) {
          values.extraInfo['actualEntryFee'] = values.actualEntryFee;
        }

        if (this.state.selectSegment && values.segmentId) {
          values.extraInfo['segmentIds'] = values.segmentId.join();
          values.extraInfo['applyAnyOfSegment'] = values.applyAnyOfSegment;
        }

        if (this.state.isFeaturedLobby) {
          values.extraInfo['bgImage'] = this.state.flImageUrl;
        }

        if (this.state.selectedStyle === 'SPECIAL') {
          values.imageUrl = this.state.styleImageUrl;
        }

        if (this.state.gameType === 'DEALS_RUMMY') {
          if (values.dealsMultiWinner) {
            if (values.firstWinnerPrice + values.secondWinnerPrice > 100) {
              message.error(
                'First prize winner and second prize winner sum can not exceed 100'
              );
              return;
            }
            values.extraInfo['dealRummyConfig'] = {
              minPlayers: values.InGameMinPlayers,
              maxPlayers: values.InGameMaxPlayers,
              trc: values.trc,
              dealsMultiWinner: values.dealsMultiWinner,
              multiWinnerCount: values.multiWinnerCount,
              firstWinnerPrice: values.firstWinnerPrice,
              secondWinnerPrice: values.secondWinnerPrice
            };
          } else {
            values.extraInfo['dealRummyConfig'] = {
              minPlayers: values.InGameMinPlayers,
              maxPlayers: values.InGameMaxPlayers,
              trc: values.trc,
              dealsMultiWinner: false
            };
          }
        }

        if (this.state.gameType === 'POINTS_RUMMY') {
          values.extraInfo['pointsRummyConfig'] = {
            minPlayers: values.InGameMinPlayers,
            maxPlayers: values.InGameMaxPlayers
          };
        }

        // Country Specific Configs
        if (values.specificCountry !== 'ALL') {
          if (
            values.countrySpecificConfigs === null ||
            values.countrySpecificConfigs === '' ||
            values.countrySpecificConfigs === undefined
          ) {
            message.error(
              'Please enter a valid country specific configs JSON object',
              1.5
            );
            return;
          }

          let selectedCountry = [];
          selectedCountry.push(values.specificCountry);
          values.extraInfo['supportedCountries'] = selectedCountry;
          values.extraInfo['countrySpecificConfigs'] = {};
          values.extraInfo['countrySpecificConfigs'][
            values.specificCountry
          ] = JSON.parse(values.countrySpecificConfigs);
        } else {
          values.extraInfo['supportedCountries'] = ['IN', 'ID', 'US'];
        }

        values.applyBonusLimit = true;
        values.endTime = moment(values.startTime).add(
          values.duration,
          'minutes'
        );

        values['type'] = 'BATTLE_V1';
        values.startTime = values.startTime.toISOString();
        values.endTime = values.endTime.toISOString();

        // Supported Formats
        let supportedFormats = [];
        if (this.state.gameType === 'POOL_RUMMY') {
          let spiltObject = {
            symbol: values.SP === 'none' ? 'SP-NONE' : 'SP-M',
            name: values.SP === 'none' ? 'No Split' : 'Split Manual',
            description:
              values.SP === 'none'
                ? 'There will be no Split for this table.'
                : 'Players have a choice to split Winning amount as per table format.'
          };
          supportedFormats.push(spiltObject);
        }

        let maxPlayerObject = {
          description: `Maximum ${values.InGameMaxPlayers} Players on each table.`,
          name: `${values.InGameMaxPlayers} Players`,
          symbol: `${values.InGameMaxPlayers}P`
        };
        supportedFormats.push(maxPlayerObject);
        values.extraInfo['supportedFormats'] = [...supportedFormats];

        values.extraInfo = JSON.stringify(values.extraInfo);

        if (this.props.tournament.editType === 'edit') {
          values.id = this.props.tournament.cloneConfig.id;
          this.props.actions.editTournamentConfig(values).then(() => {
            this.props.form.resetFields();
            this.props.history.push('/rummy/all');
          });
        } else {
          this.props.actions.createTournamentConfig(values).then(() => {
            this.props.form.resetFields();
            this.props.history.push('/rummy/all');
          });
        }
      }
    });
  };

  closeFLPreview = () => {
    this.setState({ flPreviewVisible: false });
  };

  handleFLPreview = (imgKey, visibleKey) => file => {
    this.setState({
      [imgKey]: file.url || file.thumbUrl,
      [visibleKey]: true
    });
  };
  handleFLFileChange = key => ({ fileList }) => {
    this.setState({ [key]: fileList });
  };

  beforeFLUpload = key => file => {
    message.loading('Please wait while image gets uploaded ', 0);
    this.setState({
      loading: true
    });

    let imageData = {
      contentType: file.type,
      extension:
        '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
    };

    this.props.actions.getStyleImageUploadUrl(imageData).then(() => {
      fetch(this.props.tournament.assetUrl.uploadUrl, {
        body: file,
        method: 'PUT'
      }).then(result => {
        if (result.status === 200) {
          message.destroy();

          this.setState({
            [key]:
              key === 'styleImageUrl'
                ? this.props.tournament.assetUrl.object.id
                : this.state.cdnPath.concat(
                    this.props.tournament.assetUrl.object.id
                  ),
            loading: false,
            file
          });
        }
      });
    });

    return false;
  };

  handleCollusionChange(value) {
    if (!value) {
      this.props.form.setFieldsValue({
        CollusionDetection: false,
        callToFraudServiceEnabled: false
      });
    }
  }

  segmentUrlCallback = data => {
    this.setState({ customSegmentFilePath: data.id });
  };

  render() {
    const {
      durationInfoVisible,
      humanDuration,
      durationMin,
      selectedTime,
      flFileList,
      flPreviewImage,
      flPreviewVisible,
      styleFileList,
      stylePreviewVisible,
      stylePreviewImage
    } = this.state;

    //////// Game Duration Checks///////////////////////////////////////
    const durationChange = e => {
      if (typeof e === 'number') {
        durationInfoAlert(e * 60000, 'num');
        this.props.form.resetFields(['durationRadio']);
      }
    };
    const onDurationChange = e => {
      this.props.form.setFieldsValue({ duration: e.target.value });

      this.setState({ durationInfoVisible: false });
    };

    const durationInfoAlert = (e, ref) => {
      if (ref === 'but') {
        this.setState({
          durationMin: e
        });
      }
      if (!durationInfoVisible) {
        this.setState({ durationInfoVisible: true });
      }

      this.setState({
        humanDuration: humanizeDuration(e, { delimiter: ' and ' }),
        durationMin: e
      });
    };
    /////////////////////Check for game Json////////////
    const getConfig = e => {
      if (this.validateJson(e, 'GAME_INPUT_DATA')) {
        this.props.form.setFieldsValue({ gameInputData: e });
      }
    };

    /////////////////Disable pass date////////////////
    function disabledDate(current) {
      // Can not select days before today
      return current && current < moment().startOf('day');
    }
    const onDateChange = e => {
      let startDate = e[0] !== undefined ? e[0] : e;
      this.setState({
        selectedDate: startDate
      });
      //not recurring check
      if (
        startDate.format('DDMMYY') === moment().format('DDMMYY') &&
        selectedTime < moment()
      ) {
        message.warning(
          "Start time of today's tournament of can't be less than current time. Resetting Tournament Start Time",
          2
        );
        this.props.form.resetFields(['startTime']);
      }
    };
    const onTimeChange = e => {
      this.setState({
        selectedTime: e
      });
    };

    // ------------- App type ------------- //
    const appTypeSelection = checkedValues => {
      this.setState({ checkedValues: [...checkedValues] });
    };

    const appTypeOptions = [
      { label: 'ANDRIOD', value: 'CASH' },
      { label: 'IOS', value: 'IOS' }
    ];

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        lg: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };

    const {
      fieldInfo,
      fieldName,
      minLimit,
      maxLimit
    } = this.getGameInputExtraVariableFieldDetails();

    const { summaryData } = this.state;

    const errors = {
      gameId: isFieldTouched('gameId') && getFieldError('gameId'),
      name: isFieldTouched('name') && getFieldError('name'),
      gameConfigName:
        isFieldTouched('gameConfigName') && getFieldError('gameConfigName'),
      gameInputData:
        (isFieldTouched('gameInputData') && getFieldError('gameInputData')) ||
        this.state.gameInputDataJsonError,
      gameInput: {
        Collusion: isFieldTouched('Collusion') && getFieldError('Collusion'),
        CollusionDetection:
          isFieldTouched('CollusionDetection') &&
          getFieldError('CollusionDetection'),
        callToFraudServiceEnabled:
          isFieldTouched('callToFraudServiceEnabled') &&
          getFieldError('callToFraudServiceEnabled'),
        InGameMaxPlayers:
          isFieldTouched('InGameMaxPlayers') &&
          getFieldError('InGameMaxPlayers'),
        InGameMinPlayers:
          isFieldTouched('InGameMinPlayers') &&
          getFieldError('InGameMinPlayers'),
        // it will be one of ["CurrentrummyWallet","maxPoints","Round_count"]
        extraVariable:
          isFieldTouched('extraVariable') && getFieldError('extraVariable'),
        HideProfile:
          isFieldTouched('HideProfile') && getFieldError('HideProfile'),
        HideProfile:
          isFieldTouched('HideProfile') && getFieldError('HideProfile'),
        ShowLeaderboard:
          isFieldTouched('ShowLeaderboard') && getFieldError('ShowLeaderboard')
      },
      currency: isFieldTouched('currency') && getFieldError('currency'),
      moneyEntryFee:
        isFieldTouched('moneyEntryFee') && getFieldError('moneyEntryFee'),
      currencyFactor:
        isFieldTouched('currencyFactor') && getFieldError('currencyFactor'),
      rake: isFieldTouched('rake') && getFieldError('rake'),
      duration: isFieldTouched('duration') && getFieldError('duration'),
      startTime: isFieldTouched('startTime') && getFieldError('startTime'),
      description:
        isFieldTouched('description') && getFieldError('description'),
      maxBonusPercentage:
        isFieldTouched('maxBonusPercentage') &&
        getFieldError('maxBonusPercentage'),
      minReactVersion:
        isFieldTouched('minReactVersion') && getFieldError('minReactVersion'),
      extraInfo:
        (isFieldTouched('extraInfo') && getFieldError('extraInfo')) ||
        this.state.extraInfoJsonError,
      segmentId: isFieldTouched('segmentId') && getFieldError('segmentId'),
      actualEntryFee:
        isFieldTouched('actualEntryFee') && getFieldError('actualEntryFee'),
      // minPlayers: isFieldTouched("minPlayers") && getFieldError("minPlayers"),
      // maxPlayers: isFieldTouched("maxPlayers") && getFieldError("maxPlayers"),
      trc: isFieldTouched('trc') && getFieldError('trc'),
      multiWinnerCount:
        isFieldTouched('multiWinnerCount') && getFieldError('multiWinnerCount'),
      firstWinnerPrice:
        isFieldTouched('firstWinnerPrice') && getFieldError('firstWinnerPrice'),
      secondWinnerPrice:
        isFieldTouched('secondWinnerPrice') &&
        getFieldError('secondWinnerPrice'),
      countrySpecificConfigs:
        (isFieldTouched('countrySpecificConfigs') &&
          getFieldError('countrySpecificConfigs')) ||
        this.state.countrySpecificConfigsJsonError,
      style: isFieldTouched('style') && getFieldError('style'),
      title: isFieldTouched('title') && getFieldError('title'),
      subtitle: isFieldTouched('subtitle') && getFieldError('subtitle')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Create Rummy Table | Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Game Info">
            <Row>
              <Col span={12}>
                <FormItem
                  validateStatus={errors.gameId ? 'error' : ''}
                  help={errors.gameId || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Game for Tournament
                      <Tooltip title="Select Game for Tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('gameId', {
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
                      onSelect={e => this.gameSelected(e)}
                      showSearch
                      style={{ width: 250 }}
                      placeholder="Select a Game"
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
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.gameConfigName ? 'error' : ''}
                  help={errors.gameConfigName || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Game Config Name
                      <Tooltip
                        title="Name of the Configuration Setting. 
For Dashboard purposes."
                      >
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('gameConfigName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input group title!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.gameInputData ? 'error' : ''}
                  help={errors.gameInputData || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Game Config in Json
                      <Tooltip title="Paste json config here">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('gameInputData', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input json config!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      onBlur={e => this.validateJson(e, 'GAME_INPUT_DATA')}
                      rows={3}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <UploadConfig getConfig={getConfig} />
              </Col>
            </Row>
            <FormItem
              validateStatus={errors.gameInput.Collusion ? 'error' : ''}
              help={errors.gameInput.Collusion || ''}
              {...formItemLayout}
              label={
                <span>
                  Collusion
                  <Tooltip title="Select Yes if collusion should be allowed in the lobby">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('Collusion', {
                rules: [
                  {
                    required: true,
                    type: 'boolean'
                  }
                ],
                initialValue: true
              })(
                <RadioGroup
                  onChange={e => this.handleCollusionChange(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            {/* <FormItem
              validateStatus={
                errors.gameInput.CollusionDetection ? 'error' : ''
              }
              help={errors.gameInput.CollusionDetection || ''}
              {...formItemLayout}
              label={
                <span>
                  Collusion Detection
                  <Tooltip title="Select Yes if collusion detection should be enabled for this lobby">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('CollusionDetection', {
                rules: [
                  {
                    required: false,
                    type: 'boolean'
                  }
                ],
                initialValue: true
              })(
                <RadioGroup size="small" buttonStyle="solid">
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={
                errors.gameInput.callToFraudServiceEnabled ? 'error' : ''
              }
              help={errors.gameInput.callToFraudServiceEnabled || ''}
              {...formItemLayout}
              label={
                <span>
                  Call to Fraud Service
                  <Tooltip title="Select Yes if call to fraud service should be enabled">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('callToFraudServiceEnabled', {
                rules: [
                  {
                    required: true,
                    type: 'boolean'
                  }
                ],
                initialValue: true
              })(
                <RadioGroup size="small" buttonStyle="solid">
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem> */}
            <FormItem
              validateStatus={errors.gameInput.InGameMinPlayers ? 'error' : ''}
              help={errors.gameInput.InGameMinPlayers || ''}
              {...formItemLayout}
              label={
                <span>
                  In Game Min Players
                  <Tooltip title="Min allowed Players in a game">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('InGameMinPlayers', {
                initialValue: 2,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input a number between 2 and 5!',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled min={2} max={5} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.gameInput.InGameMaxPlayers ? 'error' : ''}
              help={errors.gameInput.InGameMaxPlayers || ''}
              {...formItemLayout}
              label={
                <span>
                  In Game Max Players
                  <Tooltip title="Max allowed Players in a game">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('InGameMaxPlayers', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input a number between 2 and 5!',
                    whitespace: false
                  }
                ],
                initialValue: 5
              })(
                <RadioGroup size="small" buttonStyle="solid">
                  <Radio.Button value={2}>2</Radio.Button>
                  <Radio.Button value={5}>5</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            {this.state.selectedGameId &&
              this.state.gameType !== 'POINTS_RUMMY' && (
                <FormItem
                  validateStatus={errors.gameInput.extraVariable ? 'error' : ''}
                  help={errors.gameInput.extraVariable || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      {fieldName}
                      <Tooltip title={fieldInfo}>
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('extraVariable', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input a number between 2 and 5!',
                        whitespace: false
                      }
                    ]
                  })(<InputNumber min={minLimit} max={maxLimit} />)}
                </FormItem>
              )}
            <FormItem
              validateStatus={errors.gameInput.HideProfile ? 'error' : ''}
              help={errors.gameInput.HideProfile || ''}
              {...formItemLayout}
              label={<span>Hide Profile ( Masking )</span>}
            >
              {getFieldDecorator('HideProfile', {
                rules: [
                  {
                    required: false,
                    type: 'boolean'
                  }
                ],
                initialValue: true
              })(
                <RadioGroup disabled size="small" buttonStyle="solid">
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.gameInput.ShowLeaderboard ? 'error' : ''}
              help={errors.gameInput.ShowLeaderboard || ''}
              {...formItemLayout}
              label={<span>Show Leaderboard</span>}
            >
              {getFieldDecorator('ShowLeaderboard', {
                rules: [
                  {
                    required: false,
                    type: 'boolean'
                  }
                ],
                initialValue: true
              })(
                <RadioGroup size="small" buttonStyle="solid">
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
          </Card>
          <Card title="Reward Info">
            <FormItem
              validateStatus={errors.currency ? 'error' : ''}
              help={errors.currency || ''}
              {...formItemLayout}
              label={
                <span>
                  Entry Currency
                  <Tooltip title="Cash or Token">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('currency', {
                rules: [
                  {
                    required: true,
                    type: 'string',
                    message: 'Please select the Currency!',
                    whitespace: false
                  }
                ]
              })(
                <RadioGroup>
                  <Radio value="CASH">Cash</Radio>
                  <Radio value="TOKEN">Token</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.moneyEntryFee ? 'error' : ''}
              help={errors.moneyEntryFee || ''}
              {...formItemLayout}
              label={
                <span>
                  Entry Fee
                  <Tooltip title="Entry Fee for the Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('moneyEntryFee', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please entry fee!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            {this.state.gameType === 'POINTS_RUMMY' && (
              <FormItem
                validateStatus={errors.currencyFactor ? 'error' : ''}
                help={errors.currencyFactor || ''}
                {...formItemLayout}
                label={
                  <span>
                    Currency Factor
                    <Tooltip title="Entry Fee for the Tournament">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('currencyFactor', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please entry fee!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} step={0.1} />)}
              </FormItem>
            )}

            <FormItem
              validateStatus={errors.rake ? 'error' : ''}
              help={errors.rake || ''}
              {...formItemLayout}
              label={<span>Rake (in %)</span>}
            >
              {getFieldDecorator('rake', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please entry fee!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} max={this.getMaxRake()} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<span>To enter Rake value more than 20</span>}
            >
              {getFieldDecorator('removeRakeLimitFlag', {
                initialValue: false,
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select!',
                    whitespace: false
                  }
                ]
              })(
                <RadioGroup
                  onChange={e => this.changeMaxRake(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'Discounted'}>
              {getFieldDecorator('isDiscounted', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false,
                    type: 'boolean'
                  }
                ],
                initialValue: this.state.isDiscounted
              })(
                <Radio.Group
                  onChange={e => this.toggleDiscounted(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={true}>YES</Radio.Button>
                  <Radio.Button value={false}>NO</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.isDiscounted && (
              <FormItem
                validateStatus={errors.actualEntryFee ? 'error' : ''}
                help={errors.actualEntryFee || ''}
                {...formItemLayout}
                label={
                  <span>
                    Actual Entry Fee
                    <Tooltip title="Original Price">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('actualEntryFee', {
                  initialValue: this.state.actualEntryFee,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message:
                        'This is a manadatory field and should be a number',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
            )}
            <FormItem
              validateStatus={errors.maxBonusPercentage ? 'error' : ''}
              help={errors.maxBonusPercentage || ''}
              {...formItemLayout}
              label={
                <span>
                  Bonus Cash Used ( % )
                  <Tooltip title="Maximum Bonus Percentage">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('maxBonusPercentage', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input maximum number of players!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} max={this.getMaxBonusLimit()} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<span>To enter Bonus value more than 15</span>}
            >
              {getFieldDecorator('bonusLimitChange', {
                initialValue: false,
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select!',
                    whitespace: false
                  }
                ]
              })(
                <RadioGroup
                  onChange={e => this.changeMaxBonusLimit(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
          </Card>
          <Card title="Timing Info">
            <FormItem
              validateStatus={errors.duration ? 'error' : ''}
              help={errors.duration || ''}
              {...formItemLayout}
              label={
                <span>
                  Duration in Minutes
                  <Tooltip title="Duration for which the tournament is active">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('duration', {
                rules: [
                  {
                    required: !durationMin ? true : false,
                    type: 'number',
                    message: 'Please input time duration in numbers!',
                    whitespace: false
                  }
                ]
              })(
                <InputNumber
                  disabled={this.state.disableField}
                  min={1}
                  onChange={durationChange}
                />
              )}
            </FormItem>
            <Row>
              <Col offset={10}>
                <FormItem>
                  {getFieldDecorator(
                    'durationRadio',
                    {}
                  )(
                    <RadioGroup
                      disabled={this.state.disableField}
                      onChange={onDurationChange}
                    >
                      <RadioButton value={60}>1 Hour</RadioButton>
                      <RadioButton value={180}>3 Hours</RadioButton>
                      <RadioButton value={360}>6 Hours</RadioButton>
                      <RadioButton value={720}>12 Hours</RadioButton>
                      <RadioButton value={1440}>24 Hour</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            {durationInfoVisible && (
              <Alert message={humanDuration} type="info" showIcon />
            )}

            <FormItem
              validateStatus={errors.startTime ? 'error' : ''}
              help={errors.startTime || ''}
              {...formItemLayout}
              label={
                <span>
                  Select Date
                  <Tooltip title="Date for Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    type: 'object',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(
                <DatePicker
                  disabledDate={disabledDate}
                  allowClear="true"
                  disabled={this.state.disableField}
                  onChange={onDateChange}
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  format="YYYY-MM-DD hh:mm A"
                  placeholder={'Select Date and Time'}
                />
              )}
            </FormItem>
          </Card>
          <Card title="Config Info">
            {this.state.gameType === 'POOL_RUMMY' && (
              <>
                <FormItem
                  {...formItemLayout}
                  label={<span>Format Selector</span>}
                >
                  {getFieldDecorator('ESP', {
                    rules: [
                      {
                        required: false,
                        type: 'number',
                        message: 'Please select format!',
                        whitespace: false
                      }
                    ],
                    initialValue: 101
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={101}>101</Radio.Button>
                      <Radio.Button value={201}>201</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={<span>Min player selector</span>}
                >
                  {getFieldDecorator('MP', {
                    rules: [
                      {
                        required: false,
                        type: 'number',
                        message: 'Please select format!',
                        whitespace: false
                      }
                    ],
                    initialValue: 2
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={2}>2</Radio.Button>
                      <Radio.Button value={3}>3</Radio.Button>
                      <Radio.Button value={5}>5</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={<span>Split</span>}>
                  {getFieldDecorator('SP', {
                    rules: [
                      {
                        required: false,
                        message: 'Please select format!',
                        whitespace: false
                      }
                    ],
                    initialValue: 'none'
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={'none'}>none</Radio.Button>
                      <Radio.Button value={'manual'}>manual</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </>
            )}
            <FormItem
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name || ''}
              {...formItemLayout}
              label={
                <span>
                  Table Name
                  <Tooltip title="Name of the Table">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description || ''}
              {...formItemLayout}
              label={
                <span>
                  Table Description
                  <Tooltip title="Description for table, internal purposes only">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: false,
                    message: 'Please input group description!',
                    whitespace: true
                  }
                ],
                initialValue: ''
              })(<TextArea rows={3} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  App Type
                  <Tooltip title="App type">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('appType', {
                rules: [
                  {
                    required: false,
                    type: 'array',
                    message: 'Please select option for app type!'
                  }
                ],
                initialValue: this.state.checkedValues
              })(
                <CheckboxGroup
                  options={appTypeOptions}
                  onChange={appTypeSelection}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Enable Segment Selection
                  <Tooltip title="Enable Segement selection ">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('selectSegment', {
                rules: [
                  {
                    required: false,
                    type: 'boolean',
                    message: 'Please select option for Segment selection!',
                    whitespace: false
                  }
                ],
                initialValue: this.state.selectSegment
              })(
                <Radio.Group
                  onChange={e => this.enableSegmentSelection(e)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>OFF</Radio.Button>
                  <Radio.Button value={true}>ON</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.selectSegment && (
              <>
                <FormItem
                  validateStatus={errors.segmentId ? 'error' : ''}
                  help={errors.segmentId || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Select Segment
                      <Tooltip title="Select Segment for Tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('segmentId', {
                    rules: [
                      {
                        type: 'array',
                        required: false,
                        message: 'Please select segment for config!'
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      disabled={this.state.disableField}
                      showSearch
                      style={{ width: 500 }}
                      placeholder="Select Segment"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.segmentList}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Apply any of Segment
                      <Tooltip title="Apply if user belongs to any of the segments">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('applyAnyOfSegment', {
                    initialValue: true,
                    rules: [
                      {
                        required: false,
                        type: 'boolean',
                        message: 'Please select option for Segment selection!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Radio.Group size="small" buttonStyle="solid">
                      <Radio.Button value={false}>OFF</Radio.Button>
                      <Radio.Button value={true}>ON</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </>
            )}
            <FormItem
              validateStatus={errors.minReactVersion ? 'error' : ''}
              help={errors.minReactVersion || ''}
              {...formItemLayout}
              label={
                <span>
                  Min React Version
                  <Tooltip title="Minimum React Version for this tournament to show">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('minReactVersion', {
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            {/* <FormItem
              validateStatus={errors.minPlayers ? "error" : ""}
              help={errors.minPlayers || ""}
              {...formItemLayout}
              label={
                <span>
                  Min Players
                  <Tooltip title="Minimum Players">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("minPlayers", {
                rules: [
                  {
                    required: true,
                    type: "number",
                    message: "Please input a number between 2 and 5!",
                    whitespace: false,
                  },
                ],
              })(<InputNumber min={2} max={5} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.maxPlayers ? "error" : ""}
              help={errors.maxPlayers || ""}
              {...formItemLayout}
              label={
                <span>
                  Max Players
                  <Tooltip title="Max Players">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator("maxPlayers", {
                rules: [
                  {
                    required: true,
                    type: "number",
                    message: "Please input a number between 2 and 5!",
                    whitespace: false,
                  },
                ],
              })(<InputNumber min={2} max={5} />)}
            </FormItem> */}
            <FormItem {...formItemLayout} label={<span>Has Ticket</span>}>
              {getFieldDecorator('hasTicket', {
                initialValue: true,
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select option for Segment selection!',
                    whitespace: false
                  }
                ]
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={false}>NO</Radio.Button>
                  <Radio.Button value={true}>YES</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'Upload Segment File'}>
              <UploadSegment callbackFromParent={this.segmentUrlCallback} />
            </FormItem>
            {this.state.gameType === 'DEALS_RUMMY' && (
              <>
                <FormItem
                  validateStatus={errors.trc ? 'error' : ''}
                  help={errors.trc || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Number of Deals
                      <Tooltip title="Max Players">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('trc', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input a number!',
                        whitespace: false
                      }
                    ]
                  })(<InputNumber min={2} />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'Multi Winner Eligible'}>
                  {getFieldDecorator('dealsMultiWinner', {
                    initialValue: false,
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        whitespace: false
                      }
                    ]
                  })(
                    <Radio.Group
                      onChange={e =>
                        this.dealsMultiWinnerChanged(e.target.value)
                      }
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button value={false}>OFF</Radio.Button>
                      <Radio.Button value={true}>ON</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                {this.state.dealsMultiWinner && (
                  <>
                    <FormItem
                      validateStatus={errors.multiWinnerCount ? 'error' : ''}
                      help={errors.multiWinnerCount || ''}
                      {...formItemLayout}
                      label={'Multi Winner Count'}
                    >
                      {getFieldDecorator('multiWinnerCount', {
                        initialValue: 2,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'Please input a number between 1 and 2!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={1} max={2} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.firstWinnerPrice ? 'error' : ''}
                      help={errors.firstWinnerPrice || ''}
                      {...formItemLayout}
                      label={'First Winner Price ( % )'}
                    >
                      {getFieldDecorator('firstWinnerPrice', {
                        initialValue: 70,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'Please input first price!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} max={100} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.secondWinnerPrice ? 'error' : ''}
                      help={errors.secondWinnerPrice || ''}
                      {...formItemLayout}
                      label={'Second Winner Price ( % )'}
                    >
                      {getFieldDecorator('secondWinnerPrice', {
                        initialValue: 30,
                        rules: [
                          {
                            required: true,
                            type: 'number',
                            message: 'Please input a second price!',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} max={100} />)}
                    </FormItem>
                  </>
                )}
              </>
            )}
            <FormItem
              {...formItemLayout}
              label={<span>Country Specific Selection</span>}
            >
              {getFieldDecorator('specificCountry', {
                rules: [
                  {
                    required: true,
                    message: 'Please select!',
                    whitespace: false
                  }
                ],
                initialValue: 'IN'
              })(
                <RadioGroup>
                  <Radio value="ALL">All</Radio>
                  <Radio value="IN">India</Radio>
                  <Radio value="ID">Indonesia</Radio>
                  <Radio value="US">US</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.countrySpecificConfigs ? 'error' : ''}
              help={errors.countrySpecificConfigs || ''}
              {...formItemLayout}
              label={
                <span>
                  Country Specific Configs
                  <Tooltip title="countrySpecificConfigs in json format">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('countrySpecificConfigs', {
                rules: [
                  {
                    required: false,
                    message:
                      'Please provide country specific configs in json format',
                    whitespace: true
                  }
                ]
              })(
                <TextArea
                  onBlur={e => this.validateJson(e, 'COUNTRY_SPECIFIC_CONFIG')}
                  rows={3}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.extraInfo ? 'error' : ''}
              help={errors.extraInfo || ''}
              {...formItemLayout}
              label={
                <span>
                  Entra Info
                  <Tooltip title="Description for Sponsor to be shown under tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('extraInfo', {
                rules: [
                  {
                    required: false,
                    message: 'Please extra info',
                    whitespace: true
                  }
                ],
                initialValue: this.state.extraInfo
              })(
                <TextArea
                  onBlur={e => this.validateJson(e, 'EXTRA_INFO')}
                  rows={3}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Is Featured Lobby
                  <Tooltip title="Select Yes if this lobby should be marked as featured lobby">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isFeaturedLobby', {
                rules: [
                  {
                    required: false,
                    type: 'boolean'
                  }
                ],
                initialValue: this.state.isFeaturedLobby
              })(
                <RadioGroup
                  onChange={e =>
                    this.setState({
                      isFeaturedLobby: e.target.value
                    })
                  }
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </RadioGroup>
              )}
            </FormItem>
            {this.state.isFeaturedLobby ? (
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    Upload Image
                    <Tooltip title="Please upload an image">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('featuredLobbyImg')(
                  <React.Fragment>
                    <Upload
                      multiple={false}
                      beforeUpload={this.beforeFLUpload('flImageUrl')}
                      listType="picture-card"
                      fileList={flFileList}
                      onPreview={this.handleFLPreview(
                        'flPreviewImage',
                        'flPreviewVisible'
                      )}
                      onChange={this.handleFLFileChange('flFileList')}
                    >
                      {flFileList && flFileList.length >= 1 ? null : (
                        <div>
                          <Icon type="plus" />
                          <div className="ant-upload-text">Upload</div>
                        </div>
                      )}
                    </Upload>
                    <Modal
                      visible={flPreviewVisible}
                      footer={null}
                      onCancel={this.closeFLPreview}
                    >
                      <img
                        alt="feature-lobby-preview-iamge"
                        style={{ width: '100%' }}
                        src={flPreviewImage}
                      />
                    </Modal>
                  </React.Fragment>
                )}
              </FormItem>
            ) : null}
            <FormItem
              validateStatus={errors.style ? 'error' : ''}
              help={errors.style || ''}
              {...formItemLayout}
              label={
                <span>
                  Tournament Style
                  <Tooltip title="Select card for Tournament Style">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('style', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: 'Please select card to display!'
                  }
                ]
                // initialValue: "NORMAL"
              })(
                <Select
                  onChange={selectedStyle => {
                    this.setState({ selectedStyle });
                  }}
                  style={{ width: '100%' }}
                  placeholder="Select a tournament style"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {styleList}
                </Select>
              )}
            </FormItem>
            {this.state.selectedStyle === 'SPECIAL' ? (
              <React.Fragment>
                <Form.Item
                  {...formItemLayout}
                  label={
                    <span>
                      Tournament Image
                      <Tooltip title="Upload a Image for tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  <Upload
                    multiple={false}
                    beforeUpload={this.beforeFLUpload('styleImageUrl')}
                    listType="picture-card"
                    fileList={styleFileList}
                    onPreview={this.handleFLPreview(
                      'stylePreviewImage',
                      'stylePreviewVisible'
                    )}
                    onChange={this.handleFLFileChange('styleFileList')}
                  >
                    {styleFileList && styleFileList.length >= 1 ? null : (
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                      </div>
                    )}
                  </Upload>
                  <Modal
                    visible={stylePreviewVisible}
                    footer={null}
                    onCancel={() =>
                      this.setState({ stylePreviewVisible: false })
                    }
                  >
                    <img
                      alt="example"
                      style={{ width: '100%' }}
                      src={stylePreviewImage}
                    />
                  </Modal>
                </Form.Item>
                <FormItem
                  validateStatus={errors.title ? 'error' : ''}
                  help={errors.title || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Title
                      <Tooltip title="Title of extra info">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: false,
                        message: 'text is expected here',
                        whitespace: true
                      }
                    ]
                  })(<TextArea rows={1} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.subtitle ? 'error' : ''}
                  help={errors.subtitle || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Sub Title
                      <Tooltip title="Sub title of extra info">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('subtitle', {
                    rules: [
                      {
                        required: false,
                        message: 'text is expected here',
                        whitespace: true
                      }
                    ]
                  })(<TextArea rows={1} />)}
                </FormItem>
              </React.Fragment>
            ) : (
              ''
            )}
          </Card>
          <Card>
            <Row>
              {this.state.isSummaryVerified && (
                <Col span={12} offset={12}>
                  <Button
                    type="primary"
                    disabled={hasErrors(getFieldsError())}
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Col>
              )}
              {!this.state.isSummaryVerified && (
                <Col span={12} offset={12}>
                  <Button
                    // disabled={hasErrors(getFieldsError())}
                    onClick={() => this.openSummaryModal()}
                  >
                    Verify Configs
                  </Button>
                </Col>
              )}
            </Row>
          </Card>
        </Form>
        <Modal
          title={'Summary'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeSummaryModal()}
          onOk={() => this.confirmSummaryInformation()}
          okText="Confirm"
          visible={this.state.showSummaryModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Table Name:</strong>
                <span style={{ marginLeft: '5px' }}>{summaryData.name}</span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Rake %:</strong>
                <span style={{ marginLeft: '5px' }}>{summaryData.rake}</span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Bonus %:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {summaryData.maxBonusPercentage}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Min Players:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {summaryData.InGameMinPlayers}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Max Players:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {summaryData.InGameMaxPlayers}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Entry Fee:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {summaryData.moneyEntryFee}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>
                  {
                    this.getGameInputExtraVariableFieldDetails(
                      this.state.gameType
                    ).fieldName
                  }
                </strong>
                <span style={{ marginLeft: '5px' }}>
                  {summaryData.extraVariable}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Collusion:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {summaryData.Collusion ? 'True' : 'False'}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Supported Countries:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {JSON.stringify(summaryData.supportedCountries)}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Gross Margin:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {summaryData.grossMargin}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>Start Date & Time:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {moment(summaryData.startTime).format('DD-MMM-YYYY HH:mm')}
                </span>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <strong>End Date & Time:</strong>
                <span style={{ marginLeft: '5px' }}>
                  {moment(summaryData.endTime).format('DD-MMM-YYYY HH:mm')}
                </span>
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames,
    tournamentConfig: state.tournamentConfig.createConfig,
    tournament: state.tournaments,
    sponsorList: state.sponsor.list,
    segment: state.segment,
    validatePooledResponse: state.tournamentConfig.validatePooledResponse,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse,
    getZkRummyConfigResponse: state.tournamentConfig.getZkRummyConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        tournamentConfigActions,
        tournamentActions,
        sponsorActions,
        segmentActions,
        storageActions,
        { fetchGames, getCdnPathForUpload }
      ),
      dispatch
    )
  };
}
const RummyCreateForm = Form.create()(RummyCreate);

export default connect(mapStateToProps, mapDispatchToProps)(RummyCreateForm);
