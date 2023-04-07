import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as tournamentConfigActions from '../../actions/tournamentConfigActions';
import * as tournamentActions from '../../actions/tournamentActions';
import * as storageActions from '../../actions/storageActions';
import * as segmentActions from '../../actions/segmentActions';
import * as sponsorActions from '../../actions/sponsorActions';
import * as gameActions from '../../actions/gameActions';
import humanizeDuration from 'humanize-duration';
import UploadConfig from './UploadConfig';
import RewardTable from './RewardTable';
import UploadSegment from './UploadSegment';
import moment from 'moment';
import _ from 'lodash';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Icon,
  TimePicker,
  DatePicker,
  message,
  Switch,
  Radio,
  Divider,
  Checkbox,
  Upload,
  Modal,
  Select,
  Button,
  Alert,
  Row,
  Col,
  notification,
  Tag,
  Table
} from 'antd';
import { Helmet } from 'react-helmet';
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const format = 'hh:mm A';
const minuteStep = 5;

const sponsorList = [];
const segmentList = [];
const styleList = [];
const imageStyles = ['TJ', 'SPECIAL', 'LUCKY_RANKS', 'TOKENS', 'LEADERBOARD'];

const levelArray = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30
].map(item => (
  <Option value={item} key={item}>
    {item}
  </Option>
));

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class RummyTournament extends React.Component {
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
      tournamentType: 'NORMAL',
      previewVisible: false,
      previewImage: '',
      loadImage: false,
      loading: false,
      fileList: [],
      gameList: [],
      customPrizeString: '',
      sponsorId: null,
      sponsorDescription: '',
      shareText: '',
      checkedValues: ['CASH', 'PLAY_STORE', 'IOS'],
      isDynamicTableValidated: false,
      thresholdRanges: [],
      applyBonusLimit: false,
      selectedStyle: 'NORMAL',
      showDynamicWinningsSection: false,
      dynamicWinnings: [],
      isBuyIn: true,
      showLevelTable: false
    };
    this.populateSegmentList = this.populateSegmentList.bind(this);
    this.populateTournamentStyles = this.populateTournamentStyles.bind(this);
    this.cloneConfigDetails = this.cloneConfigDetails.bind(this);
    this.copyImage = this.copyImage.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.setState({ tournamentType: 'NORMAL' });

    this.getGameList();
    this.populateSegmentList();
    this.populateTournamentStyles();
    this.getSponsorList();

    if (this.props.tournament.cloneConfig) {
      this.cloneConfigDetails();
    } else {
      this.setState({
        tableData: {
          rankRanges: [],
          totalCash: 0,
          totalTokens: 0
        }
      });
    }
  }

  getGameList() {
    let data = {
      combined: true
    };
    this.props.actions.getAllGames(data).then(() => {
      if (this.props.getAllGamesResponse) {
        let gameList = [];
        this.props.getAllGamesResponse.map(game => {
          if (game.gameType == 'RUMMY_TOURNAMENT') {
            gameList.push(
              <Option key={'game' + game.id} value={game.id}>
                {game.name} ( {game.id} )
              </Option>
            );
          }
        });
        this.setState({
          gameList
        });
      } else {
        message.error('Could not fetch game list');
      }
    });
  }

  populateSegmentList() {
    if (!this.props.segment.list && segmentList.length === 0) {
      this.props.actions.getSegmentList('active').then(() => {
        if (this.props.segment.list.length) {
          this.props.segment.list.map(segment => {
            segmentList.push(
              <Option key={'segment' + segment.id} value={segment.id}>
                {segment.name}
              </Option>
            );
          });
        }
      });
    }
  }

  populateTournamentStyles() {
    if (!this.props.tournament.styleList && styleList.length === 0) {
      this.props.actions.getStyles().then(() => {
        if (this.props.tournament.styles.length) {
          this.props.tournament.styles.map(style => {
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
  }

  cloneConfigDetails() {
    if (this.props.tournament.editType === 'edit') {
      this.setState({ disableField: true });
    }
    let configDetails = { ...this.props.tournament.cloneConfig };
    let extraInfo = this.props.tournament.cloneConfig.extraInfo
      ? { ...JSON.parse(this.props.tournament.cloneConfig.extraInfo) }
      : {};

    this.props.form.setFieldsValue({
      rewardConfigName: configDetails.rewards.name,
      minPlayers: configDetails.minPlayers ? configDetails.minPlayers : 0,
      maxPlayers: configDetails.maxPlayers,
      currency: configDetails.currency,
      moneyEntryFee: configDetails.moneyEntryFee
        ? configDetails.moneyEntryFee
        : 0
    });

    if (configDetails.specialRewards) {
      this.setState(
        {
          addSpecialReward: true,
          specialRankRanges: configDetails.specialRewards.rankRanges,
          specialTotalCash: configDetails.specialRewards.totalCash,
          specialTotalTokens: configDetails.specialRewards.totalTokens
        },
        () => {
          this.props.form.setFieldsValue({
            specialRewardConfigName: configDetails.specialRewards.name
          });
        }
      );
    }

    this.setState(
      {
        isRecurringFlag: configDetails.isRecurring
          ? configDetails.isRecurring
          : false
      },
      () => {
        if (this.state.isRecurringFlag) {
          this.props.form.setFieldsValue({
            isRecurring: true,
            tournamentDay: [
              moment(configDetails.startTime),
              moment(configDetails.endTime)
            ],
            timeGap: configDetails.recurringProperties.timeGap,
            blackOutTimeStart: configDetails.recurringProperties
              .blackOutTimeStart
              ? moment(configDetails.recurringProperties.blackOutTimeStart)
              : null,
            blackOutTimeEnd: configDetails.recurringProperties.blackOutTimeEnd
              ? moment(configDetails.recurringProperties.blackOutTimeEnd)
              : null,
            endTime: moment(configDetails.endTime)
          });
        } else {
          this.props.form.setFieldsValue({
            tournamentDay: moment(configDetails.startTime),
            isRecurring: false
          });
        }
      }
    );

    if (JSON.parse(configDetails.extraInfo).applyBonusLimit) {
      this.setState({ applyBonusLimit: true }, () => {
        this.props.form.setFieldsValue({
          applyBonusLimit: true,
          maxBonusPercentage: JSON.parse(configDetails.extraInfo)
            .maxBonusPercentage
            ? JSON.parse(configDetails.extraInfo).maxBonusPercentage
            : 0
        });
      });
    }

    if (
      configDetails.segmentId ||
      (JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds &&
        JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds
          .length > 0)
    ) {
      this.setState(
        {
          selectSegment: true
        },
        () => {
          this.props.form.setFieldsValue({
            selectSegment: true,
            segmentId: JSON.parse(
              this.props.tournament.cloneConfig.extraInfo
            ).segmentIds.split(',')
          });
        }
      );
    } else {
      this.setState({ selectSegment: false });
      this.props.form.setFieldsValue({ selectSegment: false });
    }

    if (imageStyles.includes(configDetails.style)) {
      this.setState({ selectedStyle: configDetails.style }, () => {
        this.copyImage(configDetails.imageUrl);
        this.props.form.setFieldsValue({
          style: configDetails.style
        });
        if (configDetails.style === 'LEADERBOARD') {
          this.props.form.setFieldsValue({
            metric:
              configDetails.extraInfo &&
              JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig &&
              JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig.metric
                ? JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig
                    .metric
                : 'GAMES_PLAYED',
            gameType:
              configDetails.extraInfo &&
              JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig &&
              JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig
                .gameType
                ? JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig
                    .gameType
                : 'POINTS_RUMMY_LEADERBOARD',
            pointValues:
              configDetails.extraInfo &&
              JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig &&
              JSON.parse(configDetails.extraInfo).rummyLeaderboardConfig
                .pointValues
                ? JSON.parse(
                    configDetails.extraInfo
                  ).rummyLeaderboardConfig.pointValues.join(', ')
                : null
          });
        }
      });
    } else if (configDetails.style === 'SPONSOR') {
      this.setState(
        { selectedStyle: configDetails.style, sponsorConfig: true },
        () => {
          this.props.form.setFieldsValue({
            style: configDetails.style,
            sponsorId:
              JSON.parse(configDetails.extraInfo).sponsor &&
              JSON.parse(configDetails.extraInfo).sponsor.id
                ? JSON.parse(configDetails.extraInfo).sponsor.id
                : null,
            customPrizeString: JSON.parse(configDetails.extraInfo)
              .customPrizeString
              ? JSON.parse(configDetails.extraInfo).customPrizeString
              : '',
            sponsorDescription:
              JSON.parse(configDetails.extraInfo).sponsor &&
              JSON.parse(configDetails.extraInfo).sponsor.tournamentText
                ? JSON.parse(configDetails.extraInfo).sponsor.tournamentText
                : '',
            shareText:
              JSON.parse(configDetails.extraInfo).sponsor &&
              JSON.parse(configDetails.extraInfo).sponsor.shareText
                ? JSON.parse(configDetails.extraInfo).sponsor.shareText
                : ''
          });
        }
      );
    } else {
      this.props.form.setFieldsValue({ style: configDetails.style });
    }

    if (configDetails.rewards) {
      this.setState({
        rankRanges:
          configDetails.rewards.rankRanges &&
          configDetails.rewards.rankRanges.length > 0
            ? [...configDetails.rewards.rankRanges]
            : [],
        totalCash: configDetails.rewards.totalCash
          ? configDetails.rewards.totalCash
          : 0,
        totalTokens: configDetails.rewards.totalTokens
          ? configDetails.rewards.totalTokens
          : 0
      });
    }

    this.props.form.setFieldsValue({
      gameId: configDetails.gameId,
      gameConfigName: configDetails.gameConfigName,
      gameInputData: configDetails.gameInputData,
      gamePlaysPerUser: configDetails.gamePlaysPerUser,
      duration: configDetails.duration,
      startTime: moment(configDetails.startTime),
      foreShadowTime: configDetails.foreShadowTime
        ? configDetails.foreShadowTime
        : 0,
      registrationHardStop: configDetails.registrationHardStop
        ? configDetails.registrationHardStop
        : 0,

      name: configDetails.name,
      description: configDetails.description,
      isGuaranteed: configDetails.isGuaranteed
        ? configDetails.isGuaranteed
        : false,
      enableChat: configDetails.enableChat ? configDetails.enableChat : false,
      autoFinish: configDetails.autoFinish ? configDetails.autoFinish : false,
      extraMessage: JSON.parse(configDetails.extraInfo).message
        ? JSON.parse(configDetails.extraInfo).message
        : null,
      extraDescription: JSON.parse(configDetails.extraInfo).description
        ? JSON.parse(configDetails.extraInfo).description
        : null,
      minReactVersion: JSON.parse(configDetails.extraInfo).minReactVersion
        ? JSON.parse(configDetails.extraInfo).minReactVersion
        : 0,
      segmentId:
        JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds &&
        JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds
          .length > 0
          ? JSON.parse(
              this.props.tournament.cloneConfig.extraInfo
            ).segmentIds.split(',')
          : []
    });

    // Delete used keys from extraInfo

    delete extraInfo.battleAgainDisabled;
    delete extraInfo.enableAudioChat;
    delete extraInfo.applyBonusLimit;
    delete extraInfo.maxBonusPercentage;
    delete extraInfo.sponsor;
    delete extraInfo.customPrizeString;
    delete extraInfo.message;
    delete extraInfo.description;
    delete extraInfo.minReactVersion;
    delete extraInfo.supportedAppTypes;
    delete extraInfo.enableChat;
    delete extraInfo.autoFinish;
    delete extraInfo.segmentId;
    delete extraInfo.bonusLimit;
    delete extraInfo.recurring;

    this.props.form.setFieldsValue({
      extraInfo: JSON.stringify(extraInfo)
    });

    if (extraInfo.customSegmentFilePath) {
      this.setState({ customSegmentFilePath: extraInfo.customSegmentFilePath });
    }
    this.setState({
      maxPlayers: configDetails.maxPlayers ? configDetails.maxPlayers : 0
    });
  }

  copyImage(imageUrl) {
    if (imageUrl) {
      this.setState({
        previewImage: imageUrl,
        fileList: [
          {
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: imageUrl
          }
        ],
        styleImg: imageUrl.split('""/').pop()
      });
    }
  }

  isGuaranteedSelect(e) {
    this.setState({
      isGuaranteed: e.target.value
    });
  }

  getDynamicRewardsTable = e => {
    this.setState({
      thresholdRanges: e,
      isDynamicTableValidated: false
    });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });
  handleChange = ({ fileList }) => this.setState({ fileList });

  segmentUrlCallback = data => {
    this.setState({ customSegmentFilePath: data.id });
  };

  setMaxPlayers(value) {
    this.setState({ maxPlayers: value });
  }

  showDynamicWinnings() {
    this.setState({ showDynamicWinningsSection: true });
  }

  getDynamicWinnigsSection() {
    let maxPlayers = this.state.maxPlayers;
    let dynamicWinnings = [];
    for (let i = 2; i <= maxPlayers; i++) {
      dynamicWinnings.push(
        <tr key={'dynamicWinnings' + i}>
          <td>Player Count {i}: </td>
          <td>
            <Input onChange={e => this.updatePlayerCount(e.target.value, i)} />
          </td>
        </tr>
      );
    }
    return dynamicWinnings;
  }

  updatePlayerCount(value, index) {
    let dynamicWinnings =
      this.state.dynamicWinnings.length > 0
        ? [...this.state.dynamicWinnings]
        : [];
    let changeIndex = _.findIndex(dynamicWinnings, { playerCount: index });
    if (changeIndex === -1) {
      let obj = {
        playerCount: index,
        rankWinning: value
      };
      dynamicWinnings.push(obj);
    } else {
      dynamicWinnings[changeIndex]['rankWinning'] = value;
    }
    this.setState({ dynamicWinnings: [...dynamicWinnings] });
  }

  // submit form////////////////////////////////////////////////////////////////////////////////
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // If segment selection is No
        if (!this.state.selectSegment) {
          delete values.selectSegment;
          delete values.segmentId;
        }
        // ////////////Reward Data////////////////////////
        if (this.state.rankRanges.length > 0) {
          if (values.style === 'SPONSOR') {
            let sponserInfo = {
              sponsor: {
                id: values.sponsorId,
                tournamentText: values.sponsorDescription,
                shareText: values.shareText
              },
              customPrizeString: values.customPrizeString
                ? values.customPrizeString
                : null
            };
            if (!values.extraInfo) {
              delete values.customPrizeString;
              delete values.shareText;
              delete values.sponsorId;
              delete values.sponsorDescription;
              delete values.customPrizeString;
              values.extraInfo = sponserInfo;
            } else {
              values.extraInfo = JSON.parse(values.extraInfo);
              values.extraInfo.sponsor = sponserInfo.sponsor;
              values.extraInfo.customPrizeString = sponserInfo.customPrizeString
                ? sponserInfo.customPrizeString
                : null;
            }
            values.extraInfo = JSON.stringify(values.extraInfo);
          }
          // ------------ Addtional Extra info ------------- //
          if (values.extraInfo) {
            values.extraInfo = JSON.parse(values.extraInfo);
          } else {
            values.extraInfo = {};
          }
          values.extraInfo.message = values.extraMessage
            ? values.extraMessage
            : '';
          if (values.extraInfo.message === '') {
            delete values.extraInfo.message;
          }
          values.extraInfo.description = values.extraDescription
            ? values.extraDescription
            : '';
          if (values.extraInfo.description === '') {
            delete values.extraInfo.description;
          }
          values.extraInfo.enableAudioChat = values.enableAudioChat
            ? values.enableAudioChat
            : false;
          values.extraInfo['supportedAppTypes'] = this.state.checkedValues;
          // Min React version
          if (values.minReactVersion && values.minReactVersion > 0) {
            values.extraInfo['minReactVersion'] = values.minReactVersion;
          }
          // -----  Custom segment id -------- //
          if (
            this.state.customSegmentFilePath &&
            this.state.customSegmentFilePath !== '-1'
          ) {
            values.extraInfo[
              'customSegmentFilePath'
            ] = this.state.customSegmentFilePath;
          }

          // -------- Rummy leaderboard ------- //

          if (this.state.selectedStyle === 'LEADERBOARD') {
            let pointsRawArray = values.pointValues.split(',');
            let pointsArray = pointsRawArray.map(item => Number(item));
            let rummyLeaderboardConfig = {
              metric: values.metric,
              gameType: values.gameType,
              pointValues: [...pointsArray]
            };
            values.extraInfo['rummyLeaderboardConfig'] = {
              ...rummyLeaderboardConfig
            };
          }

          values.extraInfo = JSON.stringify(values.extraInfo);
          ////////////////////Reward table////////////////
          values.rewards = {};
          values.rewards.name = values.rewardConfigName;
          // values.rewards.maxRanks = values.maxRanks;
          values.rewards.totalCash = this.state.totalCash;
          values.rewards.totalTokens = this.state.totalTokens;
          values.rewards.rankRanges = this.state.rankRanges
            ? this.state.rankRanges
            : [];

          if (this.state.showDynamicWinningsSection) {
            let dynamicWinnings = [...this.state.dynamicWinnings];
            let finalArray = [];
            if (dynamicWinnings.length < values.maxPlayers - 1) {
              message.error('Please fill dynamic winnings completely');
              return;
            }
            dynamicWinnings.forEach(element => {
              let cursor = {};
              let rankWinningArray = element.rankWinning.split(',');
              cursor['playerCount'] = element.playerCount;
              cursor['rankWinning'] = [...rankWinningArray];
              finalArray.push(cursor);
            });
            values.rewards.rankRanges[0].dynamicWinnings = [...finalArray];
          }

          delete values.rewardConfigName;
          delete values.maxRanks;

          if (this.state.isRecurringFlag) {
            values.recurringProperties = {};
            values.recurringProperties.timeGap = values.timeGap;
            if (values.blackOutTimeEnd && values.blackOutTimeEnd) {
              if (
                moment(values.blackOutTimeStart).isSame(values.blackOutTimeEnd)
              ) {
                notification.warning({
                  message: 'Blackout Time Period Error',
                  description:
                    "Your blackout time start time and end period can't be same."
                });
                return false;
              } else {
                values.recurringProperties.blackOutTimeEnd = moment(
                  values.blackOutTimeEnd
                ).toISOString(true);
                values.recurringProperties.blackOutTimeStart = moment(
                  values.blackOutTimeStart
                ).toISOString(true);
              }
            }

            values.startTime = values.tournamentDay[0].set({
              hour: values.startTime.hour(),
              minute: values.startTime.minute()
            });
            values.endTime = moment(values.tournamentDay[1]).set({
              hour: values.endTime.hour(),
              minute: values.endTime.minute()
            });
            delete values.timeGap;
            delete values.blackOutTimeEnd;
            delete values.blackOutTimeStart;
          } else {
            values.startTime = values.tournamentDay.set({
              hour: values.startTime.hour(),
              minute: values.startTime.minute()
            });
            values.endTime = moment(values.startTime).add(
              values.duration,
              'minutes'
            );
          }
          if (this.state.styleImg) {
            values.imageUrl = this.state.styleImg;
          }
          values.applyBonusLimit = this.state.applyBonusLimit;
          values.type = this.state.tournamentType;

          delete values.tournamentDay;
          delete values.durationRadio;
          values.startTime = values.startTime.toISOString(true);
          values.endTime = values.endTime.toISOString(true);
          values.isActive = true;

          // ----- RUMMY Tournament ----- //
          let levelInfo = [...this.state.levelInfo];
          let gameInputData = JSON.parse(values.gameInputData);
          values.extraInfo = JSON.parse(values.extraInfo);
          let rummyTournamentConfig = {};
          gameInputData['BuyInChips'] = values.buyInChips;
          gameInputData['MP'] = values.mp;
          gameInputData['TotalRoundsInLevel'] = values.totalRoundsInLevel;
          gameInputData['TotalLevelNumber'] = values.totalLevel;
          gameInputData['Threshold'] = levelInfo.map(item => item.threshold);
          gameInputData['Multipliers'] = levelInfo.map(item => item.multiplier);

          rummyTournamentConfig['startingChips'] = values.buyInChips;
          let levelInfoObj = {};
          levelInfoObj['totalLevels'] = values.totalLevel;
          let levels = [];
          for (let i = 0; i < values.totalLevel; i++) {
            let cursor = {};
            cursor['level'] = levelInfo[i].level;
            cursor['threshold'] = levelInfo[i].threshold;
            cursor['pointValue'] = levelInfo[i].multiplier;
            cursor['hands'] = values.totalRoundsInLevel;
            levels.push(cursor);
          }
          levelInfoObj['levels'] = [...levels];
          rummyTournamentConfig['levelInfo'] = { ...levelInfoObj };

          try {
            JSON.parse(values.currentLevelTableInfo);
          } catch (error) {
            message.error('currentLevelTableInfo is not in valid JSON format');
            return;
          }
          rummyTournamentConfig['currentLevelTableInfo'] = {
            ...values.currentLevelTableInfo
          };

          if (values.isBuyIn) {
            gameInputData['isBuyIn'] = true;
            gameInputData['MaxBuyIns'] = values.maxBuyIn;
            gameInputData['LastBuyInLevel'] = values.lastBuyInLevel;
            gameInputData['ReBuyInAmount'] = values.reBuyEntryFee;
            gameInputData['ReBuyInChips'] = values.reBuyChips;
            gameInputData['chipsThreshold'] = values.chipsThreshold;

            rummyTournamentConfig['reBuyConfig'] = {
              allowed: true,
              maxCount: values.maxBuyIn,
              maxLevelAllowed: values.lastBuyInLevel,
              chipsThreshold: values.chipsThreshold,
              chipsPerBuy: values.reBuyChips,
              cost: values.reBuyEntryFee
            };
          } else {
            gameInputData['isBuyIn'] = false;
            rummyTournamentConfig['reBuyConfig'] = {
              allowed: false
            };
          }
          values.extraInfo['rummyTournamentConfig'] = {
            ...rummyTournamentConfig
          };

          values.gameInputData = JSON.stringify(gameInputData);
          values.extraInfo = JSON.stringify(values.extraInfo);

          // ---------- //

          if (this.props.tournament.editType === 'edit') {
            values.id = this.props.tournament.cloneConfig.id;
            this.props.actions.editTournamentConfig(values).then(() => {
              this.props.form.resetFields();
              this.props.history.push('/config/all');
            });
          } else {
            this.props.actions.createTournamentConfig(values).then(() => {
              this.props.form.resetFields();
              this.props.history.push('/config/all');
            });
          }
        } else {
          notification.warning({
            message: 'Reward Table error',
            description: 'Your Reward Table is empty'
          });
        }
      }
    });
  };

  getSponsorList() {
    this.props.actions.getSponsorList('active').then(() => {
      if (this.props.sponsorList.length) {
        sponsorList.length = 0;
        this.props.sponsorList.map(sponsor => {
          sponsorList.push(
            <Option key={'sponsor' + sponsor.id} value={sponsor.id}>
              {sponsor.name}
            </Option>
          );
          return true;
        });
      }
      // this.setState({
      //   sponsorConfig: true,
      //   selectedStyle: 'SPONSOR'
      // });
    });
  }

  updateBuyIn(value) {
    this.setState({ isBuyIn: value });
  }

  totalLevelChanged(value) {
    let levelInfo = [];
    for (let index = 1; index <= value; index++) {
      let row = {};
      row['level'] = index;
      row['threshold'] = 0;
      row['multiplier'] = 0;
      levelInfo.push(row);
    }
    this.setState({ levelInfo: [...levelInfo], showLevelTable: true });
  }

  thresholdChanged(value, record) {
    let levelInfo = [...this.state.levelInfo];
    let editIndex = _.findIndex(levelInfo, function(item) {
      return item.level === record.level;
    });
    levelInfo[editIndex].threshold = value;
    this.setState({ levelInfo: [...levelInfo] });
  }

  multiplierChanged(value, record) {
    let levelInfo = [...this.state.levelInfo];
    let editIndex = _.findIndex(levelInfo, function(item) {
      return item.level === record.level;
    });
    levelInfo[editIndex].multiplier = value;
    this.setState({ levelInfo: [...levelInfo] });
  }

  render() {
    const {
      durationInfoVisible,
      humanDuration,
      durationMin,
      isRecurringFlag,
      selectedTime,
      previewVisible,
      previewImage,
      fileList
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
      if (validate_json(e)) {
        this.props.form.setFieldsValue({ gameInputData: e });
      }
    };
    const validateJson = e => {
      if (!validate_json(e.target.value)) {
        // e.target.value = '';
      }
    };

    const validate_json = val => {
      if (val !== '') {
        try {
          JSON.parse(val);
          return true;
        } catch (error) {
          notification['error']({
            message: 'Invalid Json',
            description: 'Json you entered is invalid',
            placement: 'topLeft'
          });
          return false;
        }
      }
    };
    ///////////////?Check Tournament Type////////////////
    const tournamentConfigType = e => {
      this.setState({
        // tournamentType: e.target.value,
        isRecurringFlag: e.target.value
      });
      if (e.target.value) {
        this.props.form.resetFields(['tournamentDay']);
      } else {
        this.props.form.resetFields(['tournamentDay']);
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

    /////////////////////Reward table Data///////////////////
    const getRewardsTable = e => {
      this.setState({
        rankRanges: e.rankRanges,
        totalCash: e.totalCash,
        totalTokens: e.totalTokens
      });
    };

    const getSpecialRewardsTable = e => {
      this.setState({
        specialRankRanges: e.rankRanges,
        specialTotalCash: e.totalCash,
        specialTotalTokens: e.totalTokens
      });
    };

    const onStyleChange = e => {
      if (e === 'SPONSOR') {
        this.setState({
          sponsorConfig: true,
          selectedStyle: e
        });
      } else {
        this.setState({
          sponsorConfig: false,
          selectedStyle: e
        });
      }
    };
    /////////////////Enable Chat//////////////////////
    const enableChatChange = e => {
      this.setState({
        enableChat: e
      });
    };
    //////////// Enable Audio chat ///////////
    const enableAudioChatChange = e => {
      this.setState({
        enableAudioChat: e
      });
    };
    ////////////App type ///////////
    const appTypeSelection = checkedValues => {
      this.setState({ checkedValues: [...checkedValues] });
    };
    const appTypeOptions = [
      { label: 'Pro', value: 'CASH' },
      { label: 'Play Store', value: 'PLAY_STORE' },
      { label: 'IOS', value: 'IOS' }
    ];
    /////////////////enableSegmentSelection//////////////////////
    const enableSegmentSelection = e => {
      this.setState({
        selectSegment: e.target.value
      });
    };

    /////////////Auto Finish/////////////////////
    const autoFinishChange = e => {
      this.setState({
        autoFinish: !e
      });
    };
    ////////////////////Style Image////////////////////
    const beforeUpload = (file, fileList) => {
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
              styleImg: this.props.tournament.assetUrl.object.id,
              loading: false,
              file
            });
          }
        });
      });

      return false;
    };

    /////////////////////////Bonus Limit Chnage/////////////
    const bonuslimitFlagChange = e => {
      this.setState({
        applyBonusLimit: e.target.value
      });
    };
    //////////////////Add Special Reward////////////////////
    const addSpecialRewardChange = e => {
      this.setState({
        addSpecialReward: e
      });
    };

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
    const errors = {
      name: isFieldTouched('name') && getFieldError('name'),
      customPrizeString:
        isFieldTouched('customPrizeString') &&
        getFieldError('customPrizeString'),
      style: isFieldTouched('style') && getFieldError('style'),
      segmentId: isFieldTouched('segmentId') && getFieldError('segmentId'),
      sponsorId: isFieldTouched('sponsorId') && getFieldError('sponsorId'),
      shareText: isFieldTouched('shareText') && getFieldError('shareText'),
      description:
        isFieldTouched('description') && getFieldError('description'),
      sponsorDescription:
        isFieldTouched('sponsorDescription') &&
        getFieldError('sponsorDescription'),
      gameId: isFieldTouched('gameId') && getFieldError('gameId'),
      duration: isFieldTouched('duration') && getFieldError('duration'),
      gameConfigName:
        isFieldTouched('gameConfigName') && getFieldError('gameConfigName'),
      gameInputData:
        isFieldTouched('gameInputData') && getFieldError('gameInputData'),
      minPlayers: isFieldTouched('minPlayers') && getFieldError('minPlayers'),
      maxPlayers: isFieldTouched('maxPlayers') && getFieldError('maxPlayers'),
      gamePlaysPerUser:
        isFieldTouched('gamePlaysPerUser') && getFieldError('gamePlaysPerUser'),
      isRecurring:
        isFieldTouched('isRecurring') && getFieldError('isRecurring'),
      tournamentDay:
        isFieldTouched('tournamentDay') && getFieldError('tournamentDay'),
      startTime: isFieldTouched('startTime') && getFieldError('startTime'),
      endTime: isFieldTouched('endTime') && getFieldError('endTime'),
      timeGap: isFieldTouched('timeGap') && getFieldError('timeGap'),
      blackOutTimeStart:
        isFieldTouched('blackOutTimeStart') &&
        getFieldError('blackOutTimeStart'),
      blackOutTimeEnd:
        isFieldTouched('blackOutTimeEnd') && getFieldError('blackOutTimeEnd'),
      registrationHardStop:
        isFieldTouched('registrationHardStop') &&
        getFieldError('registrationHardStop'),
      foreShadowTime:
        isFieldTouched('foreShadowTime') && getFieldError('foreShadowTime'),
      currency: isFieldTouched('currency') && getFieldError('currency'),
      moneyEntryFee:
        isFieldTouched('moneyEntryFee') && getFieldError('moneyEntryFee'),
      rewardConfigName:
        isFieldTouched('rewardConfigName') && getFieldError('rewardConfigName'),
      maxBonusPercentage:
        isFieldTouched('maxBonusPercentage') &&
        getFieldError('maxBonusPercentage'),
      battleAgainDisabled:
        isFieldTouched('battleAgainDisabled') &&
        getFieldError('battleAgainDisabled'),
      specialRewardConfigName:
        isFieldTouched('specialRewardConfigName') &&
        getFieldError('specialRewardConfigName'),
      extraMessage:
        isFieldTouched('extraMessage') && getFieldError('extraMessage'),
      extraDescription:
        isFieldTouched('extraDescription') && getFieldError('extraDescription'),
      minReactVersion:
        isFieldTouched('minReactVersion') && getFieldError('minReactVersion'),
      winnerPercentage:
        isFieldTouched('winnerPercentage') && getFieldError('winnerPercentage'),
      expectedMarginPercentage:
        isFieldTouched('expectedMarginPercentage') &&
        getFieldError('expectedMarginPercentage'),
      pointValues:
        isFieldTouched('pointValues') && getFieldError('pointValues'),
      extraInfo: isFieldTouched('extraInfo') && getFieldError('extraInfo'),
      title: isFieldTouched('title') && getFieldError('title'),
      subtitle: isFieldTouched('subtitle') && getFieldError('subtitle'),
      buyInChips: isFieldTouched('buyInChips') && getFieldError('buyInChips'),
      mp: isFieldTouched('mp') && getFieldError('mp'),
      maxBuyIn: isFieldTouched('maxBuyIn') && getFieldError('maxBuyIn'),
      lastBuyInLevel:
        isFieldTouched('lastBuyInLevel') && getFieldError('lastBuyInLevel'),
      reBuyEntryFee:
        isFieldTouched('reBuyEntryFee') && getFieldError('reBuyEntryFee'),
      reBuyChips: isFieldTouched('reBuyChips') && getFieldError('reBuyChips'),
      chipsThreshold:
        isFieldTouched('chipsThreshold') && getFieldError('chipsThreshold'),
      totalRoundsInLevel:
        isFieldTouched('totalRoundsInLevel') &&
        getFieldError('totalRoundsInLevel'),
      currentLevelTableInfo:
        isFieldTouched('currentLevelTableInfo') &&
        getFieldError('currentLevelTableInfo')
    };

    const levelInfoColumns = [
      {
        title: 'Level',
        key: 'level',
        dataIndex: 'level'
      },
      {
        title: 'Threshold',
        key: 'threshold',
        render: (text, record) => (
          <InputNumber
            onChange={e => this.thresholdChanged(e, record)}
            value={record.threshold}
          />
        )
      },
      {
        title: 'Multipliers',
        key: 'multiplier',
        render: (text, record) => (
          <InputNumber
            precision={1}
            onChange={e => this.multiplierChanged(e, record)}
            value={record.multiplier}
          />
        )
      }
    ];

    return (
      <React.Fragment>
        <Helmet>
          <title>Create Config | Admin Dashboard</title>
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
                      showSearch
                      style={{ width: 300 }}
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
                      <Tooltip title="Name of the Configuration Setting. For Dashboard purposes.">
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
                  })(<TextArea onBlur={validateJson} rows={3} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.gamePlaysPerUser ? 'error' : ''}
                  help={errors.gamePlaysPerUser || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Game Sessions Limit
                      <Tooltip title="Total number of times a user can play the game within the time duration of the tournament. Could be infinite,Defaut is infinite">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('gamePlaysPerUser', {
                    rules: [
                      {
                        required: false,
                        type: 'number',
                        message: 'Please input maximum number of game play!',
                        whitespace: false
                      }
                    ],
                    initialValue: 1000
                  })(<InputNumber min={-1} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <UploadConfig getConfig={getConfig} />
              </Col>
            </Row>
          </Card>

          <Card title="Reward Info">
            <FormItem
              validateStatus={errors.rewardConfigName ? 'error' : ''}
              help={errors.rewardConfigName || ''}
              {...formItemLayout}
              label={
                <span>
                  Rewards Config Name
                  <Tooltip title="Name of the Rewards Configuration as defined by PM">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('rewardConfigName', {
                rules: [
                  {
                    required: false,
                    message: 'Please input name!',
                    whitespace: true
                  }
                ],
                initialValue: ''
              })(<Input disabled={this.state.disableField} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.minPlayers ? 'error' : ''}
              help={errors.minPlayers || ''}
              {...formItemLayout}
              label={
                <span>
                  Minimum Players
                  <Tooltip title="Minimum number of players for tournament to happen">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('minPlayers', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input minimum number of players!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} disabled={this.state.disableField} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.maxPlayers ? 'error' : ''}
              help={errors.maxPlayers || ''}
              {...formItemLayout}
              label={
                <span>
                  Maximum Player
                  <Tooltip title="Number of open slots in a tournament ">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('maxPlayers', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input maximum number of players!',
                    whitespace: false
                  }
                ]
              })(
                <InputNumber
                  onChange={e => this.setMaxPlayers(e)}
                  min={1}
                  disabled={this.state.disableField}
                />
              )}
            </FormItem>
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
                <RadioGroup disabled={this.state.disableField}>
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
              })(<InputNumber min={0} disabled={this.state.disableField} />)}
            </FormItem>
            <RewardTable
              tableData={this.state.tableData}
              rewardsTable={getRewardsTable}
            />
            {this.state.tournamentType === 'BATTLE_V1' &&
              this.state.maxPlayers > 2 &&
              this.state.rankRanges.length > 0 && (
                <Button onClick={() => this.showDynamicWinnings()}>
                  Add Dynamic Winnings
                </Button>
              )}
            {this.state.showDynamicWinningsSection && (
              <div>
                <table>
                  <tbody>{this.getDynamicWinnigsSection()}</tbody>
                </table>
                <Tag color="blue">Dynamic winnings for rank 1</Tag>
              </div>
            )}
          </Card>

          <Card title="Timing Info">
            <FormItem
              validateStatus={errors.isRecurring ? 'error' : ''}
              help={errors.isRecurring || ''}
              {...formItemLayout}
              label={
                <span>
                  Recurrence
                  <Tooltip title="True - if recurring (same duration + entry fee) False - if non-recurring">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isRecurring', {
                initialValue: this.state.isRecurringFlag,
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please input type of Tournament'
                  }
                ]
              })(
                <RadioGroup
                  disabled={this.state.disableField}
                  name="isRecurring"
                  onChange={tournamentConfigType}
                >
                  <Radio value={true}>Recurring Tournament</Radio>
                  <Radio value={false}>Non-Recurring Tournament</Radio>
                </RadioGroup>
              )}
            </FormItem>
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
            {durationInfoVisible ? (
              <Alert message={humanDuration} type="info" showIcon />
            ) : (
              ''
            )}
            {isRecurringFlag ? (
              <FormItem
                validateStatus={errors.tournamentDay ? 'error' : ''}
                help={errors.tournamentDay || ''}
                {...formItemLayout}
                label={
                  <span>
                    Select Date ranges
                    <Tooltip title="Date and time for Tournament Duration">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('tournamentDay', {
                  rules: [
                    {
                      required: true,
                      type: 'array',
                      message: 'Please input time duration!',
                      whitespace: false
                    }
                  ]
                })(
                  <RangePicker
                    disabledDate={disabledDate}
                    allowClear="true"
                    onChange={onDateChange}
                    format="YYYY-MM-DD"
                    disabled={this.state.disableField}
                    placeholder={['Start Day', 'End Day']}
                  />
                )}
              </FormItem>
            ) : (
              <FormItem
                validateStatus={errors.tournamentDay ? 'error' : ''}
                help={errors.tournamentDay || ''}
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
                {getFieldDecorator('tournamentDay', {
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
                    format="YYYY-MM-DD"
                    disabled={this.state.disableField}
                    onChange={onDateChange}
                    placeholder={'Select Date'}
                  />
                )}
              </FormItem>
            )}
            <FormItem
              validateStatus={errors.startTime ? 'error' : ''}
              help={errors.startTime || ''}
              {...formItemLayout}
              label={
                <span>
                  Tournament Start Time
                  <Tooltip title="Start Time for tounament, end time will be taken from game duration">
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
                    message: 'Please input start time for Tournament',
                    whitespace: false
                  }
                ]
              })(
                <TimePicker
                  minuteStep={minuteStep}
                  onChange={onTimeChange}
                  use12Hours
                  disabled={this.state.disableField}
                  placeholder="Start Time"
                  format={format}
                />
              )}
            </FormItem>
            {isRecurringFlag ? (
              <React.Fragment>
                <FormItem
                  validateStatus={errors.endTime ? 'error' : ''}
                  help={errors.endTime || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Tournament End Time
                      <Tooltip title="End Time for recurring tounament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('endTime', {
                    rules: [
                      {
                        required: true,
                        type: 'object',
                        message: 'Please input end time for Tournament',
                        whitespace: false
                      }
                    ]
                  })(
                    <TimePicker
                      minuteStep={minuteStep}
                      onChange={onTimeChange}
                      use12Hours
                      placeholder="End Time"
                      format={format}
                      disabled={this.state.disableField}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.timeGap ? 'error' : ''}
                  help={errors.timeGap || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Time Gap
                      <Tooltip title="Gap between two successive tournaments of a recurring tournament config">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('timeGap', {
                    rules: [
                      {
                        type: 'number',
                        message: 'Please input resting time duration!',
                        whitespace: false
                      }
                    ],
                    initialValue: 0
                  })(
                    <InputNumber min={0} disabled={this.state.disableField} />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.blackOutTimeStart ? 'error' : ''}
                  help={errors.blackOutTimeStart || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Black Out Start Time
                      <Tooltip title="Black Out Start time">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('blackOutTimeStart', {
                    rules: [
                      {
                        required: false,
                        type: 'object',
                        message: 'Please input date for Recurring Tournament',
                        whitespace: false
                      }
                    ]
                  })(
                    <TimePicker
                      minuteStep={minuteStep}
                      use12Hours
                      disabled={this.state.disableField}
                      placeholder="Start Time"
                      format={format}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.blackOutTimeEnd ? 'error' : ''}
                  help={errors.blackOutTimeEnd || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Black Out End Time
                      <Tooltip title="Black Out End Time">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('blackOutTimeEnd', {
                    rules: [
                      {
                        required: false,
                        type: 'object',
                        message: 'Please input date for Recurring Tournament',
                        whitespace: false
                      }
                    ]
                  })(
                    <TimePicker
                      minuteStep={minuteStep}
                      use12Hours
                      disabled={this.state.disableField}
                      placeholder="End Time"
                      format={format}
                    />
                  )}
                </FormItem>
              </React.Fragment>
            ) : (
              ''
            )}
            <FormItem
              validateStatus={errors.foreShadowTime ? 'error' : ''}
              help={errors.foreShadowTime || ''}
              {...formItemLayout}
              label={
                <span>
                  ForeShadow Time
                  <Tooltip title="Time in minutes before Tournament End Time when users can start registering">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('foreShadowTime', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled={this.state.disableField} min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.registrationHardStop ? 'error' : ''}
              help={errors.registrationHardStop || ''}
              {...formItemLayout}
              label={
                <span>
                  Registration Stop
                  <Tooltip title="Time in minutes since start of tournament when the last registration is accepted">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('registrationHardStop', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
          </Card>
          <Card title="Config Info">
            <FormItem
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name || ''}
              {...formItemLayout}
              label={
                <span>
                  Tournament Name
                  <Tooltip title="Name of the Tournament">
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
                  Tournament Description
                  <Tooltip title="Description for Tournament, internal purposes only">
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
                  Guaranteed Tournament
                  <Tooltip title="Select option for guarantee the tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isGuaranteed', {
                rules: [
                  {
                    required: false,
                    type: 'boolean',
                    whitespace: false
                  }
                ],
                initialValue: true
              })(
                <Radio.Group
                  onChange={e => this.isGuaranteedSelect(e)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Enable Chat
                  <Tooltip title="Enable Chat in tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('enableChat', {
                rules: [
                  {
                    required: false,
                    type: 'boolean',
                    message: 'Please select option for Chat!',
                    whitespace: false
                  }
                ],
                initialValue: true
              })(
                <Radio.Group
                  onChange={enableChatChange}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>OFF</Radio.Button>
                  <Radio.Button value={true}>ON</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Apply Bonus Limit
                  <Tooltip title="Enable Bonus limit in tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('applyBonusLimit', {
                rules: [
                  {
                    required: false,
                    type: 'boolean',
                    message: 'Please select option for  bonus limit!',
                    whitespace: false
                  }
                ],
                initialValue: false
              })(
                <Radio.Group
                  size="small"
                  onChange={bonuslimitFlagChange}
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>OFF</Radio.Button>
                  <Radio.Button value={true}>ON</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.applyBonusLimit ? (
              <FormItem
                validateStatus={errors.maxBonusPercentage ? 'error' : ''}
                help={errors.maxBonusPercentage || ''}
                {...formItemLayout}
                label={
                  <span>
                    Maximum Bonus Percentage
                    <Tooltip title="Maximum Bonus Percentage">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('maxBonusPercentage', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input maximum number of players!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
            ) : (
              ''
            )}
            {/* AUTO FINISH ENABLED */}
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Auto Finish
                  <Tooltip title="Enable Auto finish in tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('autoFinish', {
                rules: [
                  {
                    required: false,
                    type: 'boolean',
                    message: 'Please select option for auto Finish!',
                    whitespace: false
                  }
                ],
                initialValue: true
              })(
                <Radio.Group
                  size="small"
                  onChange={autoFinishChange}
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>OFF</Radio.Button>
                  <Radio.Button value={true}>ON</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.tournamentType !== 'NORMAL' && (
              <FormItem
                validateStatus={errors.battleAgainDisabled ? 'error' : ''}
                help={errors.battleAgainDisabled || ''}
                {...formItemLayout}
                label={
                  <span>
                    Disable Battle Again
                    <Tooltip title="Enable Bonus limit in tournament">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('battleAgainDisabled', {
                  rules: [
                    {
                      required: false,
                      type: 'boolean',
                      message: 'Please select option for  bonus limit!',
                      whitespace: false
                    }
                  ],
                  initialValue: false
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>OFF</Radio.Button>
                    <Radio.Button value={true}>ON</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
            )}
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
                  onChange={enableSegmentSelection}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>OFF</Radio.Button>
                  <Radio.Button value={true}>ON</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.selectSegment && (
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
                      message: 'Please select segments for config!'
                    }
                  ]
                })(
                  <Select
                    disabled={this.state.disableField}
                    mode="multiple"
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
                    {segmentList}
                  </Select>
                )}
              </FormItem>
            )}
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
                  onChange={onStyleChange}
                  showSearch
                  style={{ width: 500 }}
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
            {imageStyles.includes(this.state.selectedStyle) && (
              // <ImageUploader
              //   callbackFromParent={this.getImage}
              //   header={'Image'}
              //   actions={this.props.actions}
              //   previewImage={this.state.previewImage}
              //   fileList={this.state.fileList}
              //   isMandatory={true}
              // />
              <React.Fragment>
                <Upload
                  multiple={false}
                  beforeUpload={beforeUpload}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  )}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                </Modal>
              </React.Fragment>
            )}
            {this.state.sponsorConfig && (
              <React.Fragment>
                <FormItem
                  validateStatus={errors.sponsorId ? 'error' : ''}
                  help={errors.sponsorId || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Select Sponsor
                      <Tooltip title="Select Game for Tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('sponsorId', {
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: 'Please select your Game!'
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Select Sponsor"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {sponsorList}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.customPrizeString ? 'error' : ''}
                  help={errors.customPrizeString || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Custom Prize
                      <Tooltip title="Custom Prize in tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('customPrizeString', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input name!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>

                <FormItem
                  validateStatus={errors.sponsorDescription ? 'error' : ''}
                  help={errors.sponsorDescription || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Sponsor Description
                      <Tooltip title="Description for Sponsor to be shown under tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('sponsorDescription', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input group description!',
                        whitespace: true
                      }
                    ]
                  })(<TextArea rows={3} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.shareText ? 'error' : ''}
                  help={errors.shareText || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Share Text Description
                      <Tooltip title="Description for shareText in Sponsor to be shown under tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('shareText', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input shareText description!',
                        whitespace: true
                      }
                    ]
                  })(<TextArea rows={3} />)}
                </FormItem>
              </React.Fragment>
            )}
            {(this.state.selectedStyle === 'SPECIAL' ||
              this.state.selectedStyle === 'SPONSOR') && (
              <>
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
                    initialValue: this.state.title,
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
                    initialValue: this.state.subtitle,
                    rules: [
                      {
                        required: false,
                        message: 'text is expected here',
                        whitespace: true
                      }
                    ]
                  })(<TextArea rows={1} />)}
                </FormItem>
              </>
            )}
            <FormItem
              validateStatus={errors.extraMessage ? 'error' : ''}
              help={errors.extraMessage || ''}
              {...formItemLayout}
              label={
                <span>
                  Message
                  <Tooltip title="Message field of extra info">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('extraMessage', {
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
              validateStatus={errors.extraDescription ? 'error' : ''}
              help={errors.extraDescription || ''}
              {...formItemLayout}
              label={
                <span>
                  Description
                  <Tooltip title="Description field of extra info">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('extraDescription', {
                rules: [
                  {
                    required: false,
                    message: 'text is expected here',
                    whitespace: true
                  }
                ]
              })(<TextArea rows={2} />)}
            </FormItem>
            {this.state.tournamentType !== 'NORMAL' && (
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    Enable Audio Chat
                    <Tooltip title="Enable Audio Chat in battle">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('enableAudioChat', {
                  rules: [
                    {
                      required: false,
                      type: 'boolean',
                      message: 'Please select option for audio Chat!',
                      whitespace: false
                    }
                  ]
                })(
                  <Radio.Group
                    onChange={enableAudioChatChange}
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={false}>OFF</Radio.Button>
                    <Radio.Button value={true}>ON</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
            )}
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
            <FormItem {...formItemLayout} label={'Upload Segment File'}>
              <UploadSegment callbackFromParent={this.segmentUrlCallback} />
            </FormItem>
            {this.state.selectedStyle === 'LEADERBOARD' && (
              <>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Metric
                      <Tooltip title="Rummy Leaderboard Config metric">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('metric', {
                    rules: [
                      {
                        required: true,
                        type: 'string',
                        message: 'Please select!',
                        whitespace: false
                      }
                    ],
                    initialValue: 'GAMES_PLAYED'
                  })(
                    <RadioGroup>
                      <Radio value="GAMES_PLAYED">GAMES_PLAYED</Radio>
                      <Radio value="CASH_WON">CASH_WON</Radio>
                      <Radio value="GAMES_WON">GAMES_WON</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Game Type
                      <Tooltip title="Rummy Leaderboard Config game type">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('gameType', {
                    rules: [
                      {
                        required: true,
                        type: 'string',
                        message: 'Please select!',
                        whitespace: false
                      }
                    ],
                    initialValue: 'POINTS_RUMMY_LEADERBOARD'
                  })(
                    <RadioGroup>
                      <Radio value="POINTS_RUMMY_LEADERBOARD">
                        POINTS_RUMMY_LEADERBOARD
                      </Radio>
                      <Radio value="POOL_RUMMY_LEADERBOARD">
                        POOL_RUMMY_LEADERBOARD
                      </Radio>
                      <Radio value="DEALS_RUMMY_LEADERBOARD">
                        DEALS_RUMMY_LEADERBOARD
                      </Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.pointValues ? 'error' : ''}
                  help={errors.pointValues || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Point Values
                      <Tooltip title="point values array comma seperated">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('pointValues', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input pointValues!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              </>
            )}
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
              })(<TextArea onBlur={validateJson} rows={3} />)}
            </FormItem>
          </Card>
          <Card title="Rummy Tournament Info">
            <FormItem
              validateStatus={errors.buyInChips ? 'error' : ''}
              help={errors.buyInChips || ''}
              {...formItemLayout}
              label={
                <span>
                  Buy In Chips
                  <Tooltip title="buyInChips">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('buyInChips', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input buyInChips!',
                    whitespace: true
                  }
                ]
              })(<InputNumber style={{ width: '200px' }} min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.mp ? 'error' : ''}
              help={errors.mp || ''}
              {...formItemLayout}
              label={
                <span>
                  MP
                  <Tooltip title="mp">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('mp', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input mp!',
                    whitespace: true
                  }
                ]
              })(<InputNumber style={{ width: '200px' }} min={0} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Is Buy In
                  <Tooltip title="Is buy in enabled">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isBuyIn', {
                initialValue: this.state.isBuyIn,
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select option for isBuyIn!',
                    whitespace: false
                  }
                ]
              })(
                <Radio.Group
                  onChange={e => this.updateBuyIn(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>False</Radio.Button>
                  <Radio.Button value={true}>True</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.isBuyIn && (
              <>
                <FormItem
                  validateStatus={errors.maxBuyIn ? 'error' : ''}
                  help={errors.maxBuyIn || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Max Buy In
                      <Tooltip title="maxBuyIn">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('maxBuyIn', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input maxBuyIn!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: '200px' }} min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.lastBuyInLevel ? 'error' : ''}
                  help={errors.lastBuyInLevel || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Last Buy In Level
                      <Tooltip title="lastBuyInLevel">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('lastBuyInLevel', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input lastBuyInLevel!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: '200px' }} min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.reBuyEntryFee ? 'error' : ''}
                  help={errors.reBuyEntryFee || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Re Buy Entry Fee
                      <Tooltip title="reBuyEntryFee">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('reBuyEntryFee', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input reBuyEntryFee!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: '200px' }} min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.reBuyChips ? 'error' : ''}
                  help={errors.reBuyChips || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Re Buy Chips
                      <Tooltip title="reBuyChips">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('reBuyChips', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input reBuyChips!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: '200px' }} min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.chipsThreshold ? 'error' : ''}
                  help={errors.chipsThreshold || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Chips Threshold
                      <Tooltip title="chipsThreshold">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('chipsThreshold', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'Please input chipsThreshold!',
                        whitespace: true
                      }
                    ]
                  })(<InputNumber style={{ width: '200px' }} min={0} />)}
                </FormItem>
              </>
            )}
            <FormItem
              validateStatus={errors.totalRoundsInLevel ? 'error' : ''}
              help={errors.totalRoundsInLevel || ''}
              {...formItemLayout}
              label={
                <span>
                  Total Rounds In Level
                  <Tooltip title="totalRoundsInLevel">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('totalRoundsInLevel', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input totalRoundsInLevel!',
                    whitespace: true
                  }
                ]
              })(<InputNumber style={{ width: '200px' }} min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.totalLevel ? 'error' : ''}
              help={errors.totalLevels || ''}
              {...formItemLayout}
              label={
                <span>
                  Total Levels
                  <Tooltip title="total levels">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('totalLevel', {
                rules: [
                  {
                    type: 'number',
                    required: true,
                    message: ' '
                  }
                ]
              })(
                <Select
                  onChange={e => this.totalLevelChanged(e)}
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Total Level"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {levelArray}
                </Select>
              )}
            </FormItem>
            {this.state.showLevelTable && (
              <Table
                rowKey="level"
                bordered
                pagination={false}
                dataSource={this.state.levelInfo}
                columns={levelInfoColumns}
              />
            )}
            <FormItem
              validateStatus={errors.currentLevelTableInfo ? 'error' : ''}
              help={errors.currentLevelTableInfo || ''}
              {...formItemLayout}
              label={'Current Level Table Info'}
            >
              {getFieldDecorator('currentLevelTableInfo', {
                rules: [
                  {
                    required: true,
                    message: 'Please extra info',
                    whitespace: true
                  }
                ],
                initialValue: this.state.currentLevelTableInfo
              })(<TextArea onBlur={validateJson} rows={3} />)}
            </FormItem>
          </Card>
          <Card>
            <Row>
              <Col span={19}>
                <Button
                  type="primary"
                  disabled={hasErrors(getFieldsError())}
                  htmlType="submit"
                >
                  Create
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
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
    getAllGamesResponse: state.games.getAllGamesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...tournamentConfigActions,
        ...tournamentActions,
        ...sponsorActions,
        ...segmentActions,
        ...storageActions,
        ...gameActions
      },
      dispatch
    )
  };
}
const RummyTournamentForm = Form.create()(RummyTournament);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RummyTournamentForm);
