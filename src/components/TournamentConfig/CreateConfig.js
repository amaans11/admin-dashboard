import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as tournamentConfigActions from '../../actions/tournamentConfigActions';
import * as tournamentActions from '../../actions/tournamentActions';
import * as storageActions from '../../actions/storageActions';
import * as segmentActions from '../../actions/segmentActions';
import * as sponsorActions from '../../actions/sponsorActions';
import { fetchGames, getAllGames } from '../../actions/gameActions';
import humanizeDuration from 'humanize-duration';
import UploadConfig from './UploadConfig';
import RewardTable from './RewardTable';
import SpecialRewardTable from './SpecialRewardTable';
import DynamicRewardTable from './DynamicRewardTable';
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
import CollectibleRewards from './CollectibleRewards';
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
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class CreateConfig extends React.Component {
  getGameList() {
    const gameList = [];
    if (!this.props.gameList && gameList.length === 0) {
      this.props.actions.fetchGames().then(() => {
        this.props.gamesList && this.props.gamesList.length > 0 && this.props.gamesList.map(game => {
          if (this.props.location.pathname.search('config') === 1) {
            if (game.tournamentSupported) {
              gameList.push(
                <Option key={'game' + game.id} value={game.id}>
                  {game.name} ( {game.id} )
                </Option>
              );
            }
          } else {
            if (game.battleSupported) {
              gameList.push(
                <Option key={'game' + game.id} value={game.id}>
                  {game.name}
                </Option>
              );
            }
          }
          // return true;
        });
      });
    }
    this.setState({
      gameList
    });
  }
  componentDidMount() {
    ////config
    if (this.props.location.pathname.search('config') === 1) {
      this.setState({
        tournamentType: 'NORMAL',
        isRecurringFlag: true
      });
    } else {
      this.setState({
        tournamentType: 'BATTLE_V1',
        isRecurringFlag: false
      });
    }
    this.getGameList();

    // get games call for collecitble rewards games
    this.props.actions.getAllGames();

    this.props.form.validateFields();

    if (!this.props.segment.list && segmentList.length === 0) {
      this.props.actions.getSegmentList('active').then(() => {
        if (this.props.segment.list && this.props.segment.list.length) {
          this.props.segment.list.map(segment => {
            segmentList.push(
              <Option key={'segment' + segment.id} value={segment.id}>
                {segment.name}
              </Option>
            );
            return true;
          });
        }
      });
    }
    ///////////////////////////////////////////////////////////////////////////////////
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
    ///////////////////////////////if Cloned///////////////////////////////////////////
    if (this.props.tournament.cloneConfig) {
      // this.setState({
      //   autoFinish: this.props.tournament.cloneConfig.autoFinish ? false : true
      // });
      // console.log("props",this.props.tournament.cloneConfig);
      this.props.form.setFieldsValue({
        name: this.props.tournament.cloneConfig.name,
        description: this.props.tournament.cloneConfig.description,
        gameId: this.props.tournament.cloneConfig.gameId,
        gameConfigName: this.props.tournament.cloneConfig.gameConfigName,
        gameInputData: this.props.tournament.cloneConfig.gameInputData,
        minPlayers: this.props.tournament.cloneConfig.minPlayers
          ? this.props.tournament.cloneConfig.minPlayers
          : 0,
        maxPlayers: this.props.tournament.cloneConfig.maxPlayers,
        duration: this.props.tournament.cloneConfig.duration,
        isGuaranteed: this.props.tournament.cloneConfig.isGuaranteed
          ? this.props.tournament.cloneConfig.isGuaranteed
          : false,
        enableChat: JSON.parse(this.props.tournament.cloneConfig.extraInfo)
          .enableChat,
        segmentId:
          JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds &&
            JSON.parse(this.props.tournament.cloneConfig.extraInfo).segmentIds
              .length > 0
            ? JSON.parse(
              this.props.tournament.cloneConfig.extraInfo
            ).segmentIds.split(',')
            : [],
        autoFinish: this.props.tournament.cloneConfig.autoFinish
          ? this.props.tournament.cloneConfig.autoFinish
          : false,
        battleAgainDisabled: JSON.parse(
          this.props.tournament.cloneConfig.extraInfo
        ).battleAgainDisabled,
        maxBonusPercentage: JSON.parse(
          this.props.tournament.cloneConfig.extraInfo
        ).maxBonusPercentage,
        applyBonusLimit: JSON.parse(this.props.tournament.cloneConfig.extraInfo)
          .applyBonusLimit,
        currency: this.props.tournament.cloneConfig.currency,
        entryFee: this.props.tournament.cloneConfig.entryFee
          ? this.props.tournament.cloneConfig.entryFee
          : 0,
        foreShadowTime: this.props.tournament.cloneConfig.foreShadowTime
          ? this.props.tournament.cloneConfig.foreShadowTime
          : 0,
        registrationHardStop: this.props.tournament.cloneConfig
          .registrationHardStop
          ? this.props.tournament.cloneConfig.registrationHardStop
          : 0,
        maxGameplaysPerPlayer: this.props.tournament.cloneConfig
          .maxGameplaysPerPlayer,
        isRecurring: this.props.tournament.cloneConfig.isRecurring
          ? this.props.tournament.cloneConfig.isRecurring
          : false,
        startTime: moment(this.props.tournament.cloneConfig.startTime),
        endTime: moment(this.props.tournament.cloneConfig.endTime),
        timeGap: this.props.tournament.cloneConfig.recurringProperties.timeGap,
        // maxRanks: this.props.tournament.cloneConfig.rewards.maxRanks,
        rewardConfigName: this.props.tournament.cloneConfig.rewards.name,
        // specialRewardConfigName: this.props.tournament.cloneConfig.specialRewards.name ? this.props.tournament.cloneConfig.specialRewards.name : ''
        // Extra Info fields
        extraMessage: JSON.parse(this.props.tournament.cloneConfig.extraInfo)
          .message
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo).message
          : null,
        extraDescription: JSON.parse(
          this.props.tournament.cloneConfig.extraInfo
        ).description
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo).description
          : null,
        title: JSON.parse(this.props.tournament.cloneConfig.extraInfo).title
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo).title
          : null,
        subtitle: JSON.parse(this.props.tournament.cloneConfig.extraInfo)
          .subtitle
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo).subtitle
          : null,
        // DYNAMIC REWARDS
        dynamicRewardName: this.props.tournament.cloneConfig.dynamicRewards.name
          ? this.props.tournament.cloneConfig.dynamicRewards.name
          : '',
        winnerPercentage: this.props.tournament.cloneConfig.dynamicRewards
          .winnerPercentage
          ? this.props.tournament.cloneConfig.dynamicRewards.winnerPercentage
          : null,
        expectedMarginPercentage: this.props.tournament.cloneConfig
          .dynamicRewards.expectedMarginPercentage
          ? this.props.tournament.cloneConfig.dynamicRewards
            .expectedMarginPercentage
          : null
      });
      //////////////Check for Sponsered Tournament////////////////////////////////
      this.setState({
        selectedStyle: this.props.tournament.cloneConfig.style,
        maxPlayers: this.props.tournament.cloneConfig.maxPlayers
          ? this.props.tournament.cloneConfig.maxPlayers
          : 0,
        title: JSON.parse(this.props.tournament.cloneConfig.extraInfo).title
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo).title
          : null,
        subtitle: JSON.parse(this.props.tournament.cloneConfig.extraInfo)
          .subtitle
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo).subtitle
          : null
      });
      if (this.props.tournament.cloneConfig.style !== 'SPONSOR') {
        // Set style
        this.props.form.setFieldsValue({
          style: this.props.tournament.cloneConfig.style
        });
        // Remove used field from extra configs enableChat, autoFinish, segmentId, applyBonusLimit, battlePlayAgainDisabled
        let extraInfo = this.props.tournament.cloneConfig.extraInfo
          ? JSON.parse(this.props.tournament.cloneConfig.extraInfo)
          : {};
        if (
          JSON.parse(this.props.tournament.cloneConfig.extraInfo)
            .applyBonusLimit
        ) {
          this.setState({
            applyBonusLimit: JSON.parse(
              this.props.tournament.cloneConfig.extraInfo
            ).applyBonusLimit
          });
        }
        delete extraInfo.segmentId;
        delete extraInfo.segmentIds;
        delete extraInfo.enableChat;
        delete extraInfo.autoFinish;
        delete extraInfo.applyBonusLimit;
        delete extraInfo.battlePlayAgainDisabled;

        extraInfo = JSON.stringify(extraInfo);

        this.props.form.setFieldsValue({
          extraInfo: extraInfo
        });

        // Check for image

        if (this.props.tournament.cloneConfig.imageUrl) {
          this.setState({
            previewImage: this.props.tournament.cloneConfig.imageUrl,
            fileList: [
              {
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: this.props.tournament.cloneConfig.imageUrl
              }
            ],
            styleImg: this.props.tournament.cloneConfig.imageUrl
              .split('""/')
              .pop()
          });
        }
      }
      if (this.props.tournament.cloneConfig.style === 'SPONSOR') {
        this.getSponsorList();
        // Set initial values for Tournament style, Sponsor, Custom Prize, Sponsor Description & Share Text Description
        this.props.form.setFieldsValue({
          style: this.props.tournament.cloneConfig.style
        });
        this.setState({
          customPrizeString: JSON.parse(
            this.props.tournament.cloneConfig.extraInfo
          ).customPrizeString,
          sponsorId: JSON.parse(this.props.tournament.cloneConfig.extraInfo)
            .sponsor.id,
          sponsorDescription: JSON.parse(
            this.props.tournament.cloneConfig.extraInfo
          ).sponsor.tournamentText,
          shareText: JSON.parse(this.props.tournament.cloneConfig.extraInfo)
            .sponsor.shareText
        });
        // Remove keys from extraInfo & set initial value of extraInfo
        let extraInfo = JSON.parse(this.props.tournament.cloneConfig.extraInfo);

        delete extraInfo.customPrizeString;
        delete extraInfo.sponsor;
        delete extraInfo.segmentId;
        delete extraInfo.enableChat;
        delete extraInfo.autoFinish;
        delete extraInfo.applyBonusLimit;
        delete extraInfo.battlePlayAgainDisabled;

        extraInfo = JSON.stringify(extraInfo, undefined, 4);

        this.props.form.setFieldsValue({
          extraInfo: extraInfo
        });
      }

      if (this.props.tournament.cloneConfig.type === 'NORMAL') {
        this.setState({
          tournamentType: 'NORMAL',
          isRecurringFlag: true
        });
      } else {
        this.setState({
          tournamentType: 'BATTLE_V1',
          isRecurringFlag: false
        });
      }

      //////////Set Time and Date fields
      if (this.props.tournament.cloneConfig.isRecurring) {
        this.props.form.setFieldsValue({
          tournamentDay: [
            moment(this.props.tournament.cloneConfig.startTime),
            moment(this.props.tournament.cloneConfig.endTime)
          ],
          timeGap: this.props.tournament.cloneConfig.recurringProperties.timeGap
        });
        if (
          this.props.tournament.cloneConfig.blackOutTimeEnd &&
          this.props.tournament.cloneConfig.blackOutTimeStart
        ) {
          this.props.form.setFieldsValue({
            blackOutTimeStart: moment(
              this.props.tournament.cloneConfig.recurringProperties
                .blackOutTimeStart
            ),
            blackOutTimeEnd: moment(
              this.props.tournament.cloneConfig.recurringProperties
                .blackOutTimeEnd
            )
          });
        }
      } else {
        this.props.form.setFieldsValue({
          tournamentDay: moment(this.props.tournament.cloneConfig.startTime)
        });
      }
      this.setState({
        enableChatFlag: this.props.tournament.cloneConfig.enableChat,
        isRecurringFlag: this.props.tournament.cloneConfig.isRecurring
          ? this.props.tournament.cloneConfig.isRecurring
          : false,

        rankRanges: this.props.tournament.cloneConfig.rewards.rankRanges,
        totalCash: this.props.tournament.cloneConfig.rewards.moneyTotalCash,
        totalTokens: this.props.tournament.cloneConfig.rewards.totalTokens
      });

      // Special configs
      if (this.props.tournament.cloneConfig.specialRewards) {
        this.setState({
          addSpecialReward: true,
          specialRankRanges: this.props.tournament.cloneConfig.specialRewards
            .rankRanges,
          specialTotalCash: this.props.tournament.cloneConfig.specialRewards
            .moneyTotalCash,
          specialTotalTokens: this.props.tournament.cloneConfig.specialRewards
            .totalTokens
        });
      }

      if (this.props.tournament.editType === 'edit') {
        // starttime,minplayer,duration,forshadow time,gauranteed, recurring properties,
        this.setState({
          disableField: true
        });
      }
    } else {
      this.setState({
        tableData: {
          rankRanges: [],
          totalCash: 0,
          totalTokens: 0
        }
      });
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
      // CLONE DYNAMIC REWARDS
      if (extraInfo.pooled) {
        this.setState({
          dynamicRewardName: this.props.tournament.cloneConfig.dynamicRewards
            .name,
          winnerPercentage: this.props.tournament.cloneConfig.dynamicRewards
            .winnerPercentage,
          expectedMarginPercentage: this.props.tournament.cloneConfig
            .dynamicRewards.expectedMarginPercentage
        });
        this.props.form.setFieldsValue({
          isPooled: true,
          dynamicRewardName: this.props.tournament.cloneConfig.dynamicRewards
            .name,
          winnerPercentage: this.props.tournament.cloneConfig.dynamicRewards
            .winnerPercentage,
          expectedMarginPercentage: this.props.tournament.cloneConfig
            .dynamicRewards.expectedMarginPercentage
        });
        this.setState({ isPooled: true });
      }

      if (
        extraInfo.leaderboardConfig &&
        extraInfo.leaderboardConfig.rankToCollectible &&
        extraInfo.leaderboardConfig.rankToCollectible.length
      ) {
        this.setState(
          {
            enableCollectibleReward: true,
            collectibleRewardGameId: extraInfo.leaderboardConfig.gameId,
            collectibleRewardData: extraInfo.leaderboardConfig.rankToCollectible.map(
              reward => ({
                ...reward,
                collectible: {
                  id: { low: reward.collectibleId },
                  name: reward.name,
                  imageUrl: reward.imageUrl
                }
              })
            )
          },
          () => {
            const {
              gameId,
              currency,
              type,
              minEntryFee,
              maxEntryFee,
              metric
            } = extraInfo.leaderboardConfig;
            setTimeout(() => {
              this.props.form.setFieldsValue({
                collectibleRewardGameId: gameId,
                collectibleRewardCurrency: currency,
                collectibleRewardType: type,
                collectibleRewardMinEntryFee: minEntryFee,
                collectibleRewardMaxEntryFee: maxEntryFee,
                collectibleRewardMetric: metric
              });
            }, 300);
          }
        );
      }
      if (this.props.tournament.cloneConfig.gameId)
        this.props.actions.getCollectiblesForGameId(
          this.props.tournament.cloneConfig.gameId
        );

      // ------------- Setting fields for e-IPL from extraInfo ---------------//
      if (extraInfo.format === 'IPL_MATCH') {
        // console.log(extraInfo);
        const leaderboardConfig = extraInfo.leaderboardConfig
          ? extraInfo.leaderboardConfig
          : {};

        const eIPLTeams = Object.keys(leaderboardConfig.iplTeamMapping).map(
          k => {
            return { teamKey: k, teamId: leaderboardConfig.iplTeamMapping[k] };
          }
        );
        const eIPLTeamMapping = eIPLTeams.map(team => team.teamKey);

        const extraInfoType = 'eIPL';

        const eIPLTotalCash = extraInfo.iplRewardsArray[0].totalRealCash;
        const eIPLTotalTokens = extraInfo.iplRewardsArray[0].totalTokens;
        const eIPLRankRanges = extraInfo.iplRewardsArray[0].allRankRanges.map(
          range => {
            return {
              start: range.startRank,
              end: range.endRank,
              cash: range.cash,
              tokens: range.tokens,
              extReward: range.extReward ? range.extReward : '',
              dynamicWinnings: range.dynamicWinnings
                ? range.dynamicWinnings
                : []
            };
          }
        );

        this.setState({
          eIPLTeams,
          extraInfoType,
          eIPLTotalCash,
          eIPLTotalTokens,
          eIPLRankRanges
        });

        // because of conditional rendering, Let form fields render, then set value
        setTimeout(() => {
          this.props.form.setFieldsValue({
            extraInfoType,
            eIPLFormat: leaderboardConfig.format,
            eIPLMetric: leaderboardConfig.metric,
            eIPLType: leaderboardConfig.type,
            eIPLGameId: leaderboardConfig.gameId,
            eIPLCurrency: leaderboardConfig.currency,
            eIPLMinEntryFee: leaderboardConfig.minEntryFee,
            eIPLMaxEntryFee: leaderboardConfig.maxEntryFee,
            eIPLTeamMapping: eIPLTeamMapping
          });
        }, 300);
      } else {
        setTimeout(() => {
          this.props.form.setFieldsValue({
            extraInfo: '{}'
          });
        }, 300);
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  state = {
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
    previewVisible: false,
    previewImage: '',
    loading: false,
    fileList: [],
    gameList: [],
    customPrizeString: '',
    sponsorId: undefined,
    sponsorDescription: '',
    shareText: '',
    checkedValues: ['CASH', 'PLAY_STORE', 'IOS'],
    isPooled: false,
    isDynamicTableValidated: false,
    thresholdRanges: [],
    showDynamicWinningsSection: false,
    dynamicWinnings: [],
    title: '',
    subtitle: '',
    extraInfoType: 'NORMAL',
    eIPLTeams: [],
    newTeamKey: null,
    newTeamId: null,
    eIPLRewardsData: {},
    eIPLTotalCash: 0,
    eIPLTotalTokens: 0,
    eIPLRankRanges: [],
    extraInfo: '{}',
    enableCollectibleReward: false,
    collectibleRewardData: [],
    collectibleRewardGameId: null,
    rummyLbGroupsData: [],
    currencyId: 'INR'
  };

  isPooledChanged(e) {
    if (e.target.value) {
      this.props.form.setFieldsValue({ minPlayers: 2, isGuaranteed: false });
    } else {
      this.props.form.setFieldsValue({ minPlayers: 0, isGuaranteed: true });
    }
    this.setState({
      isPooled: e.target.value
    });
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

  validateDynamicTable() {
    let dynamicRewards = {
      name: this.props.form.getFieldValue('dynamicRewardName'),
      winnerPercentage: this.props.form.getFieldValue('winnerPercentage'),
      expectedMarginPercentage: this.props.form.getFieldValue(
        'expectedMarginPercentage'
      ),
      thresholdRanges: this.state.thresholdRanges
    };
    let data = {
      moneyEntryFee: this.props.form.getFieldValue('moneyEntryFee'),
      minPlayers: this.props.form.getFieldValue('minPlayers'),
      maxPlayers: this.props.form.getFieldValue('maxPlayers'),
      dynamicRewards: dynamicRewards
    };
    this.props.actions.validatePooledRewards(data).then(() => {
      if (
        this.props.validatePooledResponse &&
        this.props.validatePooledResponse.error
      ) {
        message.error(this.props.validatePooledResponse.error.message);
        this.setState({ isDynamicTableValidated: false });
      } else {
        this.setState({ isDynamicTableValidated: true });
      }
    });
  }

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

  jsonCheck(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      message.error('Invalid JSON object', 1);
      return false;
    }
  }

  // submit form////////////////////////////////////////////////////////////////////////////////
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // ------------- Generate extra info for e-IPL ---------------- //
        const currencyId = values.currencyId ? values.currencyId : 'INR';

        if (values.extraInfoType === 'eIPL') {
          const eIPLExtraInfo = {
            format: values.eIPLFormat
          };

          const teamMapping = this.state.eIPLTeams.reduce((acc, team) => {
            if (values.eIPLTeamMapping.indexOf(team.teamKey) >= 0) {
              acc[team.teamKey] = team.teamId;
            }
            return acc;
          }, {});

          const leaderboardConfig = {
            format: values.eIPLFormat,
            metric: values.eIPLMetric,
            type: values.eIPLType,
            gameId: values.eIPLGameId,
            currency: values.eIPLCurrency,
            minEntryFee: values.eIPLMinEntryFee,
            maxEntryFee: values.eIPLMaxEntryFee,
            iplTeamMapping: teamMapping
          };

          eIPLExtraInfo.leaderboardConfig = leaderboardConfig;

          const allRankRanges = this.state.eIPLRankRanges.map(range => {
            return {
              startRank: range.start,
              endRank: range.end,
              cash: range.cash,
              tokens: range.tokens,
              extReward: range.extReward ? range.extReward : '',
              dynamicWinnings: range.dynamicWinnings
                ? range.dynamicWinnings
                : []
            };
          });
          console.log('allRankRanges', allRankRanges);

          const rewards = {
            totalRealCash: this.state.eIPLTotalCash,
            totalTokens: this.state.eIPLTotalTokens,
            allRankRanges
          };

          eIPLExtraInfo.iplRewardsArray = [rewards];
          values.extraInfo = JSON.parse(values.extraInfo);
          values.extraInfo = JSON.stringify({
            ...values.extraInfo,
            ...eIPLExtraInfo
          });

          delete values.extraInfoType;
          delete values.eIPLFormat;
          delete values.eIPLMetric;
          delete values.eIPLType;
          delete values.eIPLGameId;
          delete values.eIPLCurrency;
          delete values.eIPLMinEntryFee;
          delete values.eIPLMaxEntryFee;
          delete values.eIPLTeamMapping;
        }

        //-------------- Collectible Reward config ------------------ //
        if (
          this.state.enableCollectibleReward &&
          values.extraInfoType !== 'eIPL'
        ) {
          const rankToCollectible = [];
          this.state.collectibleRewardData &&
            this.state.collectibleRewardData.length &&
            this.state.collectibleRewardData.map(reward => {
              rankToCollectible.push({
                minRank: reward.minRank,
                maxRank: reward.maxRank,
                collectibleId: reward.collectible.id.low,
                name: reward.collectible.name,
                imageUrl: reward.collectible.imageUrl
              });
            });

          const leaderboardConfig = { rankToCollectible };
          leaderboardConfig.gameId = values.collectibleRewardGameId;
          leaderboardConfig.currency = values.collectibleRewardCurrency;
          leaderboardConfig.type = values.collectibleRewardType;
          leaderboardConfig.minEntryFee = values.collectibleRewardMinEntryFee;
          leaderboardConfig.maxEntryFee = values.collectibleRewardMaxEntryFee;
          leaderboardConfig.metric = values.collectibleRewardMetric;
          try {
            values.extraInfo = JSON.parse(values.extraInfo);
            values.extraInfo = JSON.stringify({
              ...values.extraInfo,
              leaderboardConfig: values.extraInfo.hasOwnProperty(
                'leaderboardConfig'
              )
                ? {
                  ...values.extraInfo.leaderboardConfig,
                  ...leaderboardConfig
                }
                : leaderboardConfig
            });

            delete values.collectibleRewardGameId;
            delete values.collectibleRewardCurrency;
            delete values.collectibleRewardType;
            delete values.collectibleRewardMinEntryFee;
            delete values.collectibleRewardMaxEntryFee;
            delete values.collectibleRewardMetric;
          } catch (er) {
            console.error('SHOULD NOT BE HERE: ', er);
          }
        }

        // ------------- Validation for pooled tournaments ------------ //
        if (this.state.isPooled) {
          if (!this.state.isDynamicTableValidated) {
            message.error(
              'Please validate the dynamic table before proceeding to create the tournament config'
            );
            return;
          }
        }
        // If segment selection is No
        if (!this.state.selectSegment) {
          delete values.selectSegment;
          delete values.segmentId;
        }
        // ////////////Reward Data////////////////////////
        if (
          (!this.state.isPooled && this.state.rankRanges.length > 0) ||
          this.state.isPooled
        ) {
          if (values.style === 'SPONSOR') {
            let sponserInfo = {
              sponsor: {
                id: values.sponsorId,
                tournamentText: values.sponsorDescription,
                shareText: values.shareText
              }
            };

            if (!values.extraInfo) {
              delete values.shareText;
              delete values.sponsorId;
              delete values.sponsorDescription;
              values.extraInfo = sponserInfo;
            } else {
              values.extraInfo = JSON.parse(values.extraInfo);
              values.extraInfo.sponsor = sponserInfo.sponsor;
            }

            if (!!values.customPrizeString) {
              values.extraInfo.customPrizeString = values.customPrizeString;
              delete values.customPrizeString;
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
          values.extraInfo.title = values.title ? values.title : '';
          values.extraInfo.subtitle = values.subtitle ? values.subtitle : '';

          if (values.extraInfo.description === '') {
            delete values.extraInfo.description;
          }
          values.extraInfo.enableAudioChat = values.enableAudioChat
            ? values.enableAudioChat
            : false;
          values.extraInfo['supportedAppTypes'] = this.state.checkedValues;
          // Is Pooled and Min React version
          if (this.state.isPooled) {
            values.extraInfo['pooled'] = this.state.isPooled;
          }
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
            let groups = [];
            let weighedLeaderboard = true;

            if (this.state.rummyLbGroupsData.length < 1) {
              // message.error('Leaderboard group can not be empty');
              // return;

              // instead of blocking creation
              weighedLeaderboard = false;
            }

            let rummyLbGroupsData = [...this.state.rummyLbGroupsData];
            _.forEach(rummyLbGroupsData, function (item) {
              let row = {
                gameType: item.gameType,
                metricValue: item.metricValue,
                weightMultiplier: item.weightMultiplier
              };
              groups.push(row);
            });

            let rummyLeaderboardConfig = {
              weighedLeaderboard,
              groups: [...groups],
              metric: 'GAMES_PLAYED'
            };

            values.extraInfo['rummyLeaderboardConfig'] = {
              ...rummyLeaderboardConfig
            };
          }

          if (this.state.selectSegment && values.segmentId) {
            values.extraInfo['segmentIds'] = values.segmentId.join();
          }

          // Country Specific Configs
          if (values.specificCountry !== 'ALL') {
            if (
              values.countrySpecificConfigs === null ||
              values.countrySpecificConfigs === ''
            ) {
              message.error(
                'Please enter a valid countrySpecificConfigs JSON object'
              );
              return;
            }
            let isJsonFlag = this.jsonCheck(values.countrySpecificConfigs);
            if (!isJsonFlag) {
              message.error('countrySpecificConfigs is not a JSON object');
              return;
            }
            values.extraInfo['countrySpecificConfigs'] = {};
            values.extraInfo['countrySpecificConfigs'][
              values.specificCountry
            ] = JSON.parse(values.countrySpecificConfigs);
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
          ////////////////////Dynamic Reward table////////////////
          values.dynamicRewards = {};
          values.dynamicRewards.name = values.dynamicRewardName;
          values.dynamicRewards.winnerPercentage = values.winnerPercentage;
          values.dynamicRewards.expectedMarginPercentage =
            values.expectedMarginPercentage;
          values.dynamicRewards.thresholdRanges = this.state.thresholdRanges;
          //////////////////special Rewards Table//////////
          if (this.state.addSpecialReward) {
            values.specialRewards = {};
            values.specialRewards.moneyTotalCash = this.state.specialTotalCash;
            values.specialRewards.totalTokens = this.state.specialTotalTokens;
            values.specialRewards.rankRanges = this.state.specialRankRanges;
            values.specialRewards.name = values.specialRewardConfigName;
            values.specialRewardsPresent = true;
            delete values.addSpecialReward;
            delete values.specialRewardConfigName;
          }
          //////////////////////////////////////////////
          if (this.state.isRecurringFlag) {
            values.recurringProperties = {};
            values.recurringProperties.timeGap = values.timeGap;
            if (values.blackOutTimeStart && values.blackOutTimeEnd) {
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
          // values.enableChat = this.state.enableChat;

          // values.autoFinish = this.state.autoFinish ? true : false;
          delete values.tournamentDay;
          delete values.durationRadio;
          values.startTime = values.startTime.toISOString(true);
          values.endTime = values.endTime.toISOString(true);
          // values.gameInputData = JSON.parse(values.gameInputData);
          // values.gameInputData = JSON.parse(values.gameInputData);
          // values.gameInputData = JSON.stringify(values.gameInputData);
          values.isActive = true;

          values.countryInfo = {
            currency: {
              currencyId: currencyId
            }
          };
          delete values.currencyId;

          values.rewards.countryInfo = {
            currency: {
              currencyId: currencyId
            }
          };

          if (this.props.tournament.editType === 'edit') {
            // values.gameInputData = values.gameInputData;
            values.id = this.props.tournament.cloneConfig.id;
            this.props.actions.editTournamentConfig(values).then(() => {
              // this.prop.history.push("/config/all");
              this.props.form.resetFields();
              this.props.history.push('/config/all');
            });
          } else {
            this.props.actions.createTournamentConfig(values).then(() => {
              // TODO: check for success, error
              this.props.form.resetFields();
              this.state.tournamentType === 'NORMAL'
                ? this.props.history.push('/config/all')
                : this.props.history.push('/battle/all');
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
      this.setState({
        sponsorConfig: true,
        selectedStyle: 'SPONSOR'
      });
    });
  }

  selectGame(value) {
    this.setState({ selectedGameId: value });
  }

  handleExtraInfoTypeChange = extraInfoType => {
    this.setState({ extraInfoType });
  };

  handleNewTeamKey = newTeamKey => {
    this.setState({ newTeamKey });
  };

  handleNewTeamId = newTeamId => {
    this.setState({ newTeamId });
  };

  addIPLTeam = () => {
    const { newTeamKey, newTeamId, eIPLTeams } = this.state;
    if (!!newTeamKey && !!newTeamId) {
      const newTeam = {
        teamKey: newTeamKey,
        teamId: newTeamId
      };
      eIPLTeams.push(newTeam);
      this.setState({
        eIPLTeams,
        newTeamKey: undefined,
        newTeamId: undefined
      });

      const eIPLTeamMapping =
        this.props.form.getFieldValue('eIPLTeamMapping') || [];
      eIPLTeamMapping.push(newTeamKey);
      this.props.form.setFieldsValue({ eIPLTeamMapping });
    } else {
      message.warning(
        'Please provide valid team fields value (Team Key, TeamID)!'
      );
    }
  };

  getExtraInfoRewardsTable = e => {
    this.setState({
      eIPLRankRanges: e.rankRanges,
      eIPLTotalCash: e.totalCash,
      eIPLTotalTokens: e.totalTokens
    });
  };

  selectCollectibleRewardGame = e => {
    this.setState({
      collectibleRewardGameId: e
    });
  };

  addGroupData() {
    let rummyLbGroupsData =
      this.state.rummyLbGroupsData.length > 0
        ? [...this.state.rummyLbGroupsData]
        : [];
    let index = this.state.rummyLbGroupsData.length;
    let row = {
      index: index,
      gameType: null,
      metricValue: null,
      weightMultiplier: null
    };
    rummyLbGroupsData.push(row);
    this.setState({ rummyLbGroupsData });
  }

  gameTypeChanged(record, value) {
    let rummyLbGroupsData = [...this.state.rummyLbGroupsData];
    let editIndex = _.findIndex(rummyLbGroupsData, function (item) {
      return item.index === record.index;
    });
    rummyLbGroupsData[editIndex].gameType = value;
    this.setState({ rummyLbGroupsData: [...rummyLbGroupsData] });
  }

  weightMultiplierChanged(record, value) {
    let rummyLbGroupsData = [...this.state.rummyLbGroupsData];
    let editIndex = _.findIndex(rummyLbGroupsData, function (item) {
      return item.index === record.index;
    });
    rummyLbGroupsData[editIndex].weightMultiplier = value;
    this.setState({ rummyLbGroupsData: [...rummyLbGroupsData] });
  }

  metricValueChanged(record, value) {
    let rummyLbGroupsData = [...this.state.rummyLbGroupsData];
    let editIndex = _.findIndex(rummyLbGroupsData, function (item) {
      return item.index === record.index;
    });
    rummyLbGroupsData[editIndex].metricValue = value;
    this.setState({ rummyLbGroupsData: [...rummyLbGroupsData] });
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
      fileList,
      isPooled
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
      this.props.form.resetFields(['tournamentDay']);
      // if (e.target.value) {
      //   this.props.form.resetFields(['tournamentDay']);
      // } else {
      //   this.props.form.resetFields(['tournamentDay']);
      // }
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

    const getSpecialRewardsTable = result => {
      const { currencyId } = this.state;
      const res = { ...result };
      let response = [];

      const currencyObj = {
        currency: {
          currencyId: currencyId
        }
      };
      if (res['rankRanges'] && res['rankRanges'].length > 0) {
        res['rankRanges'].map(el => {
          response.push({
            start: el['start'],
            end: el['end'],
            moneyCash: el['cash'],
            countryInfo: currencyObj
          });
        });
      }

      res.moneyTotalCash = res.totalCash;
      res.countryInfo = { ...currencyObj };
      delete res.totalCash;
      res['rankRanges'] = response;
      this.setState({
        specialRankRanges: res.rankRanges,
        specialTotalCash: res.moneyTotalCash,
        specialTotalTokens: res.totalTokens
      });
    };

    const onStyleChange = e => {
      if (e === 'SPONSOR') {
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
          this.setState({
            sponsorConfig: true,
            selectedStyle: e
          });
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
    const beforeUpload = file => {
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

    const enableCollectibleRewardChange = e => {
      this.setState({
        enableCollectibleReward: e
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
        lg: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 12 }
      }
    };
    const formItemTailLayout = {
      wrapperCol: {
        offset: 8,
        span: 16
      }
    };

    const rummyLbGroupsColumns = [
      {
        title: 'Game Type',
        key: 'gameType',
        render: (text, record) => (
          <Radio.Group
            onChange={e => this.gameTypeChanged(record, e.target.value)}
            size="small"
            buttonStyle="solid"
            value={record.gameType}
          >
            <Radio.Button value="POINTS_RUMMY_LEADERBOARD">
              POINTS_RUMMY_LEADERBOARD
            </Radio.Button>
            <Radio.Button value="POOL_RUMMY_LEADERBOARD">
              POOL_RUMMY_LEADERBOARD
            </Radio.Button>
            <Radio.Button value="DEALS_RUMMY_LEADERBOARD">
              DEALS_RUMMY_LEADERBOARD
            </Radio.Button>
          </Radio.Group>
        )
      },
      {
        title: 'Metric Value',
        key: 'metricValue',
        render: (text, record) => (
          <InputNumber
            precision={2}
            onChange={e => this.metricValueChanged(record, e)}
            value={record.metricValue}
          />
        )
      },
      {
        title: 'Weight Multiplier',
        key: 'weightMultiplier',
        render: (text, record) => (
          <InputNumber
            precision={1}
            onChange={e => this.weightMultiplierChanged(record, e)}
            value={record.weightMultiplier}
          />
        )
      }
    ];

    const nameError = isFieldTouched('name') && getFieldError('name');
    // const typeError = isFieldTouched("type") && getFieldError("type");
    const customPrizeStringError =
      isFieldTouched('customPrizeString') && getFieldError('customPrizeString');
    const styleError = isFieldTouched('style') && getFieldError('style');
    const segmentIdError =
      isFieldTouched('segmentId') && getFieldError('segmentId');
    const sponsorIdError =
      isFieldTouched('sponsorId') && getFieldError('sponsorId');
    const currencyIdError =
      isFieldTouched('currencyId') && getFieldError('currencyId');

    const shareTextError =
      isFieldTouched('shareText') && getFieldError('shareText');
    const descriptionError =
      isFieldTouched('description') && getFieldError('description');
    const sponsorDescriptionError =
      isFieldTouched('sponsorDescription') &&
      getFieldError('sponsorDescription');
    const gameIdError = isFieldTouched('gameId') && getFieldError('gameId');
    const durationError =
      isFieldTouched('duration') && getFieldError('duration');
    const gameConfigNameError =
      isFieldTouched('gameConfigName') && getFieldError('gameConfigName');
    const gameInputDataError =
      isFieldTouched('gameInputData') && getFieldError('gameInputData');
    const minPlayersError =
      isFieldTouched('minPlayers') && getFieldError('minPlayers');
    const maxPlayersError =
      isFieldTouched('maxPlayers') && getFieldError('maxPlayers');
    const gamePlaysPerUserError =
      isFieldTouched('gamePlaysPerUser') && getFieldError('gamePlaysPerUser');
    const isRecurringError =
      isFieldTouched('isRecurring') && getFieldError('isRecurring');
    const tournamentDayError =
      isFieldTouched('tournamentDay') && getFieldError('tournamentDay');
    const startTimeError =
      isFieldTouched('startTime') && getFieldError('startTime');
    const endTimeError = isFieldTouched('endTime') && getFieldError('endTime');
    const timeGapError = isFieldTouched('timeGap') && getFieldError('timeGap');
    const blackOutTimeStartError =
      isFieldTouched('blackOutTimeStart') && getFieldError('blackOutTimeStart');
    const blackOutTimeEndError =
      isFieldTouched('blackOutTimeEnd') && getFieldError('blackOutTimeEnd');
    const registrationHardStopError =
      isFieldTouched('registrationHardStop') &&
      getFieldError('registrationHardStop');
    const foreShadowTimeError =
      isFieldTouched('foreShadowTime') && getFieldError('foreShadowTime');
    const currencyError =
      isFieldTouched('currency') && getFieldError('currency');
    const moneyEntryFeeError =
      isFieldTouched('moneyEntryFee') && getFieldError('moneyEntryFee');
    const extraInfoTypeError =
      isFieldTouched('extraInfoType') && getFieldError('extraInfoType');
    const extraInfoError =
      isFieldTouched('extraInfo') && getFieldError('extraInfo');
    // const maxRanksError =
    //   isFieldTouched("maxRanks") && getFieldError("maxRanks");
    // const startRankError =
    //   isFieldTouched("startRank") && getFieldError("startRank");
    // const endRankError = isFieldTouched("endRank") && getFieldError("endRank");
    // const realCashError =
    //   isFieldTouched("realCash") && getFieldError("realCash");
    // const tokensError = isFieldTouched("tokens") && getFieldError("tokens");
    const rewardConfigNameError =
      isFieldTouched('rewardConfigName') && getFieldError('rewardConfigName');
    const maxBonusPercentageError =
      isFieldTouched('maxBonusPercentage') &&
      getFieldError('maxBonusPercentage');
    const battleAgainDisabledError =
      isFieldTouched('battleAgainDisabled') &&
      getFieldError('battleAgainDisabled');
    const specialRewardConfigNameError =
      isFieldTouched('specialRewardConfigName') &&
      getFieldError('specialRewardConfigName');
    const extraMessageError =
      isFieldTouched('extraMessage') && getFieldError('extraMessage');
    const titleError = isFieldTouched('title') && getFieldError('title');
    const subtitleError =
      isFieldTouched('subtitle') && getFieldError('subtitle');
    const extraDescriptionError =
      isFieldTouched('extraDescription') && getFieldError('extraDescription');
    const minReactVersionError =
      isFieldTouched('minReactVersion') && getFieldError('minReactVersion');
    const winnerPercentageError =
      isFieldTouched('winnerPercentage') && getFieldError('winnerPercentage');
    const expectedMarginPercentageError =
      isFieldTouched('expectedMarginPercentage') &&
      getFieldError('expectedMarginPercentage');
    const countrySpecificConfigsError =
      isFieldTouched('countrySpecificConfigs') &&
      getFieldError('countrySpecificConfigs');
    // E-IPL fields
    const eIPLFormatError =
      isFieldTouched('eIPLFormat') && getFieldError('eIPLFormat');
    const eIPLMetricError =
      isFieldTouched('eIPLMetric') && getFieldError('eIPLMetric');
    const eIPLTypeError =
      isFieldTouched('eIPLType') && getFieldError('eIPLType');
    const eIPLGameIdError =
      isFieldTouched('eIPLGameId') && getFieldError('eIPLGameId');
    const eIPLCurrencyError =
      isFieldTouched('eIPLCurrency') && getFieldError('eIPLCurrency');
    const eIPLMinEntryFeeError =
      isFieldTouched('eIPLMinEntryFee') && getFieldError('eIPLMinEntryFee');
    const eIPLMaxEntryFeeError =
      isFieldTouched('eIPLMaxEntryFee') && getFieldError('eIPLMaxEntryFee');
    const eIPLTeamMappingError =
      isFieldTouched('eIPLTeamMapping') && getFieldError('eIPLTeamMapping');
    const collectibleRewardGameIdError =
      isFieldTouched('collectibleRewardGameId') &&
      getFieldError('collectibleRewardGameId');
    const collectibleRewardTypeError =
      isFieldTouched('collectibleRewardType') &&
      getFieldError('collectibleRewardType');
    const collectibleRewardMinEntryFeeError =
      isFieldTouched('collectibleRewardMinEntryFee') &&
      getFieldError('collectibleRewardMinEntryFee');
    const collectibleRewardCurrencyError =
      isFieldTouched('collectibleRewardCurrency') &&
      getFieldError('collectibleRewardCurrency');
    const collectibleRewardMaxEntryFeeError =
      isFieldTouched('collectibleRewardMaxEntryFee') &&
      getFieldError('collectibleRewardMaxEntryFee');
    const collectibleRewardMetricError =
      isFieldTouched('collectibleRewardMetric') &&
      getFieldError('collectibleRewardMetric');

    return (
      <React.Fragment>
        <Helmet>
          <title>Create Config | Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Card title="Game Info">
            <Row>
              <Col span={12}>
                <FormItem
                  validateStatus={gameIdError ? 'error' : ''}
                  help={gameIdError || ''}
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
                      style={{ width: '100%' }}
                      onSelect={e => this.selectGame(e)}
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
                  validateStatus={gameConfigNameError ? 'error' : ''}
                  help={gameConfigNameError || ''}
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
                  validateStatus={gameInputDataError ? 'error' : ''}
                  help={gameInputDataError || ''}
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
                  validateStatus={gamePlaysPerUserError ? 'error' : ''}
                  help={gamePlaysPerUserError || ''}
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
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Is Pooled
                      <Tooltip title="Enable Chat in tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('isPooled', {
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        message: 'Please select option for pooled!',
                        whitespace: false
                      }
                    ],
                    initialValue: isPooled
                  })(
                    <Radio.Group
                      onChange={e => this.isPooledChanged(e)} // enableChatChange
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button value={false}>No</Radio.Button>
                      <Radio.Button value={true}>Yes</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <UploadConfig getConfig={getConfig} />
              </Col>
            </Row>
          </Card>
          {!isPooled ? (
            <Card title="Reward Info">
              <FormItem
                validateStatus={rewardConfigNameError ? 'error' : ''}
                help={rewardConfigNameError || ''}
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
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={minPlayersError ? 'error' : ''}
                help={minPlayersError || ''}
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
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={maxPlayersError ? 'error' : ''}
                help={maxPlayersError || ''}
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
                  <InputNumber onChange={e => this.setMaxPlayers(e)} min={1} />
                )}
              </FormItem>
              <FormItem
                validateStatus={currencyError ? 'error' : ''}
                help={currencyError || ''}
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
                validateStatus={currencyIdError ? 'error' : ''}
                help={currencyIdError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Currency Type
                    <Tooltip title="Currency">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('currencyId', {
                  rules: [
                    {
                      type: 'string',
                      required: true,
                      message: 'Please select the Currency id!',
                      whitespace: false
                    }
                  ]
                })(
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select currency"
                    optionFilterProp="children"
                    onSelect={e => {
                      this.setState({ currencyId: e });
                    }}
                  >
                    <Option value="INR">INR</Option>
                    <Option value="USD">USD</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                validateStatus={moneyEntryFeeError ? 'error' : ''}
                help={moneyEntryFeeError || ''}
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

              <RewardTable
                tableData={this.state.tableData}
                rewardsTable={getRewardsTable}
                rewardData={this.state.rankRanges}
                totalCash={this.state.totalCash}
                totalTokens={this.state.totalTokens}
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
          ) : (
            <Card title="Dynamic Reward Info">
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    Rewards Name
                    <Tooltip title="Name of the Rewards Configuration as defined by PM">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('dynamicRewardName', {
                  initialValue: this.state.dynamicRewardName,
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
                validateStatus={minPlayersError ? 'error' : ''}
                help={minPlayersError || ''}
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
                  initialValue: 2,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input minimum number of players!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={maxPlayersError ? 'error' : ''}
                help={maxPlayersError || ''}
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
                })(<InputNumber min={1} />)}
              </FormItem>
              <FormItem
                validateStatus={winnerPercentageError ? 'error' : ''}
                help={winnerPercentageError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Winner Percentage
                    <Tooltip title="Winner percentage ">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('winnerPercentage', {
                  initialValue: this.state.winnerPercentage,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please enter winner percentage',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={expectedMarginPercentageError ? 'error' : ''}
                help={expectedMarginPercentageError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Expected Margin Percentage
                    <Tooltip title="Expected Margin percentage ">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('expectedMarginPercentage', {
                  initialValue: this.state.expectedMarginPercentage,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please enter expected margin percentage',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={currencyError ? 'error' : ''}
                help={currencyError || ''}
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
                validateStatus={moneyEntryFeeError ? 'error' : ''}
                help={moneyEntryFeeError || ''}
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
              <DynamicRewardTable
                tableData={this.state.thresholdRanges}
                rewardsTable={this.getDynamicRewardsTable} //getRewardsTable
              />
              {!this.state.isDynamicTableValidated ? (
                <Button
                  type="primary"
                  onClick={() => this.validateDynamicTable()}
                >
                  Validate
                </Button>
              ) : (
                <Icon
                  style={{ fontSize: '25px' }}
                  type="check-square"
                  theme="twoTone"
                />
              )}
            </Card>
          )}

          <Card title="Timing Info">
            <FormItem
              validateStatus={isRecurringError ? 'error' : ''}
              help={isRecurringError || ''}
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
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please input type of Tournament'
                  }
                ],
                initialValue: true
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
              validateStatus={durationError ? 'error' : ''}
              help={durationError || ''}
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
                validateStatus={tournamentDayError ? 'error' : ''}
                help={tournamentDayError || ''}
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
                validateStatus={tournamentDayError ? 'error' : ''}
                help={tournamentDayError || ''}
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
              validateStatus={startTimeError ? 'error' : ''}
              help={startTimeError || ''}
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
                  validateStatus={endTimeError ? 'error' : ''}
                  help={endTimeError || ''}
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
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={timeGapError ? 'error' : ''}
                  help={timeGapError || ''}
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
                  validateStatus={blackOutTimeStartError ? 'error' : ''}
                  help={blackOutTimeStartError || ''}
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
                  validateStatus={blackOutTimeEndError ? 'error' : ''}
                  help={blackOutTimeEndError || ''}
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
              validateStatus={foreShadowTimeError ? 'error' : ''}
              help={foreShadowTimeError || ''}
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
              validateStatus={registrationHardStopError ? 'error' : ''}
              help={registrationHardStopError || ''}
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
              validateStatus={nameError ? 'error' : ''}
              help={nameError || ''}
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
              validateStatus={descriptionError ? 'error' : ''}
              help={descriptionError || ''}
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
                validateStatus={maxBonusPercentageError ? 'error' : ''}
                help={maxBonusPercentageError || ''}
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
                validateStatus={battleAgainDisabledError ? 'error' : ''}
                help={battleAgainDisabledError || ''}
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
                validateStatus={segmentIdError ? 'error' : ''}
                help={segmentIdError || ''}
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
                    disabled={this.state.disableField}
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
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
              validateStatus={styleError ? 'error' : ''}
              help={styleError || ''}
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
                  {/* <Option key={1} value={"MEGA"}>
                    MEGA
                  </Option>
                  <Option key={2} value={"NORMAL"}>
                    NORMAL
                  </Option>
                  <Option key={3} value={"USER_SPECIFIC"}>
                    USER_SPECIFIC
                  </Option>
                  <Option key={4} value={"SPONSOR"}>
                    SPONSOR
                  </Option> */}
                  {/* <Option key={3} value={"FREE"}>
                    FREE
                  </Option> */}
                </Select>
              )}
            </FormItem>
            {this.state.selectedStyle === 'TJ' ||
              this.state.selectedStyle === 'SPECIAL' ||
              this.state.selectedStyle === 'LUCKY_RANKS' ||
              this.state.selectedStyle === 'TOKENS' ||
              this.state.selectedStyle === 'LEADERBOARD' ? (
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
              </Form.Item>
            ) : (
              ''
            )}
            {this.state.sponsorConfig ? (
              <React.Fragment>
                <FormItem
                  validateStatus={sponsorIdError ? 'error' : ''}
                  help={sponsorIdError || ''}
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
                    initialValue: this.state.sponsorId,
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
                  validateStatus={customPrizeStringError ? 'error' : ''}
                  help={customPrizeStringError || ''}
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
                    initialValue: this.state.customPrizeString,
                    rules: [
                      {
                        required: false,
                        message: 'Please input custom prize!'
                      }
                    ]
                  })(<Input />)}
                </FormItem>

                <FormItem
                  validateStatus={sponsorDescriptionError ? 'error' : ''}
                  help={sponsorDescriptionError || ''}
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
                    initialValue: this.state.sponsorDescription,
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
                  validateStatus={shareTextError ? 'error' : ''}
                  help={shareTextError || ''}
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
                    initialValue: this.state.shareText,
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
            ) : (
              ''
            )}
            {(this.state.selectedStyle === 'SPECIAL' ||
              this.state.selectedStyle === 'SPONSOR' ||
              this.state.selectedStyle === 'LEADERBOARD') && (
                <React.Fragment>
                  <FormItem
                    validateStatus={titleError ? 'error' : ''}
                    help={titleError || ''}
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
                    validateStatus={subtitleError ? 'error' : ''}
                    help={subtitleError || ''}
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
                </React.Fragment>
              )}
            <FormItem
              validateStatus={extraMessageError ? 'error' : ''}
              help={extraMessageError || ''}
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
                initialValue: this.state.extraMessage,
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
              validateStatus={extraDescriptionError ? 'error' : ''}
              help={extraDescriptionError || ''}
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
                initialValue: this.state.extraDescription,
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
                  ],
                  initialValue: false
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
              validateStatus={minReactVersionError ? 'error' : ''}
              help={minReactVersionError || ''}
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
                <Button onClick={() => this.addGroupData()}>
                  Add Group Info
                </Button>
                <Table
                  rowKey="index"
                  bordered
                  pagination={false}
                  dataSource={this.state.rummyLbGroupsData}
                  columns={rummyLbGroupsColumns}
                />
              </>
            )}
            {this.state.selectedGameId && this.state.selectedGameId === 83 && (
              <></>
            )}

            <FormItem
              validateStatus={extraInfoTypeError ? 'error' : ''}
              help={extraInfoTypeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Entra Info Type
                  <Tooltip title="Type of extra info">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('extraInfoType', {
                rules: [
                  {
                    required: false,
                    message: 'Please select extra info type',
                    whitespace: true
                  }
                ],
                initialValue: this.state.extraInfoType
              })(
                <Radio.Group
                  onChange={e => this.handleExtraInfoTypeChange(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="NORMAL">Normal</Radio.Button>
                  <Radio.Button value="eIPL">e-IPL</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            {this.state.extraInfoType === 'eIPL' ? (
              <Card size="small" title="e-IPL details">
                <FormItem
                  validateStatus={eIPLFormatError ? 'error' : ''}
                  help={eIPLFormatError || ''}
                  label={
                    <span>
                      Format
                      <Tooltip title="Format of the contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLFormat', {
                    rules: [
                      {
                        required: true,
                        whitespace: true
                      }
                    ],
                    initialValue: 'IPL_MATCH'
                  })(<Input placeholder="Enter e-IPL format" />)}
                </FormItem>

                <FormItem
                  validateStatus={eIPLMetricError ? 'error' : ''}
                  help={eIPLMetricError || ''}
                  label={
                    <span>
                      Metric
                      <Tooltip title="Metric of the contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLMetric', {
                    rules: [
                      {
                        required: true,
                        whitespace: true
                      }
                    ],
                    initialValue: 'GAMES_WON'
                  })(<Input />)}
                </FormItem>

                <FormItem
                  validateStatus={eIPLTypeError ? 'error' : ''}
                  help={eIPLTypeError || ''}
                  label={
                    <span>
                      Type
                      <Tooltip title="Type of the contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLType', {
                    rules: [
                      {
                        required: true,
                        whitespace: true
                      }
                    ],
                    initialValue: 'BATTLE'
                  })(<Input />)}
                </FormItem>

                <FormItem
                  validateStatus={eIPLGameIdError ? 'error' : ''}
                  help={eIPLGameIdError || ''}
                  label={
                    <span>
                      Game ID
                      <Tooltip title="Game ID of the contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLGameId', {
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: 'Please provide Game ID (number)'
                      }
                    ]
                  })(<InputNumber min={0} placeholder="1000117" />)}
                </FormItem>

                <FormItem
                  validateStatus={eIPLCurrencyError ? 'error' : ''}
                  help={eIPLCurrencyError || ''}
                  label={
                    <span>
                      Currency
                      <Tooltip title="Currency type">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLCurrency', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select currency'
                      }
                    ],
                    initialValue: 'CASH'
                  })(
                    <Radio.Group size="small" buttonStyle="solid" disabled>
                      <Radio.Button value="CASH">CASH</Radio.Button>
                      {/* <Radio.Button value="TOKEN">TOKEN</Radio.Button>
                      <Radio.Button value="BONOUS_CASH">
                        BONOUS_CASH
                      </Radio.Button> */}
                    </Radio.Group>
                  )}
                </FormItem>

                <FormItem
                  validateStatus={eIPLMinEntryFeeError ? 'error' : ''}
                  help={eIPLMinEntryFeeError || ''}
                  label={
                    <span>
                      Min Entry Fee
                      <Tooltip title="Min Entry Fee of the contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLMinEntryFee', {
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: 'Please provide Min Entry Fee (number)'
                      }
                    ]
                  })(<InputNumber min={0} placeholder="100" />)}
                </FormItem>

                <FormItem
                  validateStatus={eIPLMaxEntryFeeError ? 'error' : ''}
                  help={eIPLMaxEntryFeeError || ''}
                  label={
                    <span>
                      Max Entry Fee
                      <Tooltip title="Max Entry Fee of the contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLMaxEntryFee', {
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: 'Please provide Max Entry Fee (number)'
                      }
                    ]
                  })(<InputNumber min={0} placeholder="100" />)}
                </FormItem>

                <FormItem
                  validateStatus={eIPLTeamMappingError ? 'error' : ''}
                  help={eIPLTeamMappingError || ''}
                  label={
                    <span>
                      IPL Team Mapping
                      <Tooltip title="IPL Team Mapping of the contest">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('eIPLTeamMapping', {
                    rules: [
                      {
                        type: 'array',
                        required: true
                      }
                    ]
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select Teams"
                      mode="multiple"
                    >
                      {this.state.eIPLTeams.map((team, idx) => (
                        <Option key={idx} value={team.teamKey}>
                          {team.teamKey + ': ' + team.teamId}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <Form.Item {...formItemTailLayout}>
                  <Row>
                    <Col span={24}>
                      Add new team option in above list, Team Key(string), Team
                      ID(number)
                    </Col>
                    <Col span={10}>
                      <Input
                        size="small"
                        value={this.state.newTeamKey}
                        placeholder="Team Key, e.g. MUM"
                        onChange={e => this.handleNewTeamKey(e.target.value)}
                      />
                    </Col>
                    <Col offset={1} span={10}>
                      <InputNumber
                        size="small"
                        value={this.state.newTeamId}
                        placeholder="Team ID, e.g. 1102441434 (number only)"
                        onChange={e => this.handleNewTeamId(e)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                    <Col offset={1} span={2}>
                      <Button
                        size="small"
                        ghost
                        type="primary"
                        onClick={this.addIPLTeam}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>

                <Divider />

                <RewardTable
                  tableData={this.state.eIPLRewardsData}
                  rewardsTable={this.getExtraInfoRewardsTable}
                  rewardData={this.state.eIPLRankRanges}
                  totalCash={this.state.eIPLTotalCash}
                  totalTokens={this.state.eIPLTotalTokens}
                />
              </Card>
            ) : (
              <React.Fragment>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Add Collectible Rewards
                      <Tooltip title="Enable collectible rewards for this leaderboard">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('enableCollectibleRewards', {
                    rules: [
                      {
                        required: false,
                        type: 'boolean',
                        message: 'Please choose whether to enable or not',
                        whitespace: false
                      }
                    ]
                  })(
                    <Switch
                      onChange={enableCollectibleRewardChange}
                      defaultChecked={this.state.enableCollectibleReward}
                      checked={this.state.enableCollectibleReward}
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                    />
                  )}
                </FormItem>
              </React.Fragment>
            )}

            {this.state.enableCollectibleReward ? (
              <React.Fragment>
                <Card size="small" title="Collectible Rewards Details">
                  <FormItem
                    validateStatus={collectibleRewardGameIdError ? 'error' : ''}
                    help={collectibleRewardGameIdError || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Game for Rewards
                        <Tooltip title="Select Game for Rewards">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('collectibleRewardGameId', {
                      rules: [
                        {
                          type: 'number',
                          required: true
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        onSelect={e => this.selectCollectibleRewardGame(e)}
                        placeholder="Select a Game"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.props.allGamesV2 && this.props.allGamesV2.length
                          ? this.props.allGamesV2.map(game => (
                            <Option
                              key={'collecitble-reward-game' + game.id}
                              value={game.id}
                            >
                              {[game.name, ' ( ', game.id, ' ) '].join('')}
                            </Option>
                          ))
                          : null}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={collectibleRewardTypeError ? 'error' : ''}
                    help={collectibleRewardTypeError || ''}
                    label={
                      <span>
                        Type
                        <Tooltip title="Type of the contest">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('collectibleRewardType', {
                      rules: [
                        {
                          required: true,
                          whitespace: true
                        }
                      ],
                      initialValue: 'TOURNAMENT'
                    })(<Input />)}
                  </FormItem>
                  <FormItem
                    validateStatus={
                      collectibleRewardCurrencyError ? 'error' : ''
                    }
                    help={collectibleRewardCurrencyError || ''}
                    label={
                      <span>
                        Currency
                        <Tooltip title="Currency type">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('collectibleRewardCurrency', {
                      rules: [
                        {
                          required: true,
                          message: 'Please select currency'
                        }
                      ],
                      initialValue: 'CASH'
                    })(
                      <Radio.Group size="small" buttonStyle="solid">
                        <Radio.Button value="CASH">CASH</Radio.Button>
                        <Radio.Button value="TOKEN">TOKEN</Radio.Button>
                        <Radio.Button value="BONUS_CASH">
                          BONUS_CASH
                        </Radio.Button>
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={
                      collectibleRewardMinEntryFeeError ? 'error' : ''
                    }
                    help={collectibleRewardMinEntryFeeError || ''}
                    label={
                      <span>
                        Min Entry Fee
                        <Tooltip title="Min Entry Fee of the contest">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('collectibleRewardMinEntryFee', {
                      rules: [
                        {
                          type: 'number',
                          required: true,
                          message: 'Please provide Min Entry Fee (number)'
                        }
                      ]
                    })(<InputNumber min={0} placeholder="100" />)}
                  </FormItem>

                  <FormItem
                    validateStatus={
                      collectibleRewardMaxEntryFeeError ? 'error' : ''
                    }
                    help={collectibleRewardMaxEntryFeeError || ''}
                    label={
                      <span>
                        Max Entry Fee
                        <Tooltip title="Max Entry Fee of the contest">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('collectibleRewardMaxEntryFee', {
                      rules: [
                        {
                          type: 'number',
                          required: true,
                          message: 'Please provide Max Entry Fee (number)'
                        }
                      ]
                    })(<InputNumber min={0} placeholder="100" />)}
                  </FormItem>
                  <FormItem
                    validateStatus={collectibleRewardMetricError ? 'error' : ''}
                    help={collectibleRewardMetricError || ''}
                    label={
                      <span>
                        Metric
                        <Tooltip title="Metric of the contest">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('collectibleRewardMetric', {
                      rules: [
                        {
                          required: true,
                          whitespace: true
                        }
                      ],
                      initialValue: 'GAMES_PLAYED'
                    })(<Input />)}
                  </FormItem>
                  <CollectibleRewards
                    rewardData={this.state.collectibleRewardData}
                    gameId={this.state.collectibleRewardGameId}
                    updateRewardsTable={data => {
                      this.setState({
                        collectibleRewardData: data.collectibleRewardData
                      });
                    }}
                  />
                </Card>
              </React.Fragment>
            ) : null}
            <FormItem
              validateStatus={extraInfoError ? 'error' : ''}
              help={extraInfoError || ''}
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
                initialValue: 'ALL'
              })(
                <RadioGroup>
                  <Radio value="ALL">All</Radio>
                  <Radio value="IND">India</Radio>
                  <Radio value="ID">Indonesia</Radio>
                  <Radio value="US">US</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={countrySpecificConfigsError ? 'error' : ''}
              help={countrySpecificConfigsError || ''}
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
              })(<TextArea onBlur={validateJson} rows={3} />)}
            </FormItem>
            {this.state.tournamentType !== 'NORMAL' ? (
              <React.Fragment>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Add Special Rewards
                      <Tooltip title="Enable Bonus limit in tournament">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('addSpecialReward', {
                    rules: [
                      {
                        required: false,
                        type: 'boolean',
                        message: 'Please select option for  bonus limit!',
                        whitespace: false
                      }
                    ]
                  })(
                    <Switch
                      onChange={addSpecialRewardChange}
                      defaultChecked={this.state.addSpecialReward}
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                    />
                  )}
                </FormItem>
                {/* <Divider>Special Table</Divider>
                <RewardTable
                  rewardsTable={getSpecialRewardsTable}
                  tableData="SPECIAL"
                /> */}
              </React.Fragment>
            ) : (
              ''
            )}
            {this.state.addSpecialReward ? (
              <React.Fragment>
                <Divider>Special Reward Table</Divider>
                <FormItem
                  validateStatus={specialRewardConfigNameError ? 'error' : ''}
                  help={specialRewardConfigNameError || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Special Rewards Config Name
                      <Tooltip title="Name of the Rewards Configuration as defined by PM">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('specialRewardConfigName', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input name!',
                        whitespace: true
                      }
                    ],
                    initialValue: this.state.specialRewardConfigName
                  })(<Input />)}
                </FormItem>
                <SpecialRewardTable
                  rewardsTable={getSpecialRewardsTable}
                  tableData="SPECIAL"
                // tableData={this.state.tableData}
                />
              </React.Fragment>
            ) : (
              ''
            )}
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
function mapStateToProps(state) {
  return {
    gamesList: state.games.allGames,
    tournamentConfig: state.tournamentConfig.createConfig,
    tournament: state.tournaments,
    sponsorList: state.sponsor.list,
    segment: state.segment,
    validatePooledResponse: state.tournamentConfig.validatePooledResponse,
    allGamesV2: state.games.getAllGamesResponse
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
        { fetchGames, getAllGames }
      ),
      dispatch
    )
  };
}
const CreateConfigForm = Form.create()(CreateConfig);

export default connect(mapStateToProps, mapDispatchToProps)(CreateConfigForm);
