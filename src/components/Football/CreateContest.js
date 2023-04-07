import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as footballActions from '../../actions/FootballActions';
import * as storageActions from '../../actions/storageActions';
import * as superteamLeaderboardActions from '../../actions/SuperteamLeaderboardActions';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import _ from 'lodash';
import {
  Card,
  Form,
  InputNumber,
  Radio,
  Input,
  Select,
  Tooltip,
  Icon,
  Button,
  Modal,
  Upload,
  Row,
  Col,
  notification,
  message,
  Popconfirm,
  Checkbox,
  DatePicker
} from 'antd';
import WinningTable from './WinningTable';
import DynamicRewardTable from './DynamicRewardTable';
import CountryBonusUtilization from '../CountryBonusUtilization';
import ImageUploader from './ImageUploader';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const contestTypeList = [
  <Option key="NORMAL" value="NORMAL">
    Normal
  </Option>,
  <Option key="POOLED" value="POOLED">
    POOLED
  </Option>,
  <Option key="P_AJ" value="P_AJ">
    P_AJ
  </Option>,
  <Option key="WTM" value="WTM">
    WTM
  </Option>,
  <Option key="LEADERBOARD" value="LEADERBOARD">
    LEADERBOARD
  </Option>
];

class CreateContest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchId: null,
      contestName: null,
      isGuaranteed: false, // Guaranteed or Non Guaranteed
      entryCurrency: null, // Free ,Tokens ,Cash (Real + Bonus)
      entryFee: null,
      bonusCapPercentage: 0, // Optional for Cash
      contestWinnings: [], // Free ,Tokens ,Cash (Real + Bonus) RANKS prize distribution
      totalSlots: null, // Slots
      totalPrizeMoney: null, // Prize Pool
      isRecurring: true, // Recurring or Non-recurring
      teamLimit: 6, // Current Config
      contestCommission: null, // Auto calculated - formula needed
      startRank: 1,
      endRank: 1,
      cash: null,
      fileList: [],
      token: null,
      special: null,
      actionType: null,
      sponsored: false,
      imageUrl: '',
      checkedValues: [
        'CASH',
        'PLAY_STORE',
        'IOS'
      ],
      bonusCapPercentageError: false,
      isPooled: false,
      winnerPercentageError: false,
      expectedMarginPercentageError: false,
      isDiscounted: false,
      discountText: '',
      originalPrice: 0,
      minPlayers: 2,
      bonusUtilizationObj: {},
      bannerImage: null,
      fileListBannerImage: [],
      loadBannerDataImage: false,
      joinContestWithSeasonPass: false,
      segmentList: [],
      isInvalidDynamicPrice: false,
      isInvalidMlExtraConfig: false,
      contestCategoryList: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMatchList = this.getMatchList.bind(this);
    this.entryCurrencyChange = this.entryCurrencyChange.bind(this);
    this.selectContestType = this.selectContestType.bind(this);
    this.addToWinningsTable = this.addToWinningsTable.bind(this);
    this.matchSelected = this.matchSelected.bind(this);
    this.validateJson = this.validateJson.bind(this);
    this.getTotalCash = this.getTotalCash.bind(this);
    this.getTotalToken = this.getTotalToken.bind(this);
    this.getTotalWinners = this.getTotalWinners.bind(this);
    this.getTierList = this.getTierList.bind(this);
    this.clearTable = this.clearTable.bind(this);
    this.checkBonusCap = this.checkBonusCap.bind(this);
    this.checkWinnerPercentage = this.checkWinnerPercentage.bind(this);
    this.checkExpectedMargin = this.checkExpectedMargin.bind(this);
    this.toggleDiscounted = this.toggleDiscounted.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValueFromExtraInfo(extraInfo, key, defaultValue) {
    let parsedExtraInfo = JSON.parse(extraInfo);
    return parsedExtraInfo[key] ? parsedExtraInfo[key] : defaultValue;
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.getTierList();
    this.getMatchList();
    this.getSegments();
    this.getAllContestCategory();
    this.getMlModels();
    // EDIT OR CLONE
    if (this.props.contestData) {
      this.setState({ actionType: this.props.contestData.actionType });
      if (this.props.contestData.record.seasonGameUid) {
        this.props.form.setFieldsValue({
          matchId: this.props.contestData.record.seasonGameUid
        });
      }
      // Populate all fields
      this.props.form.setFieldsValue({
        contestName: this.props.contestData.record.name,
        totalSlots: this.props.contestData.record.totalSlots,

        entryFee: this.props.contestData.record.registrationFees
          ? this.props.contestData.record.registrationFees
          : 0,
        bonusCapPercentage: this.props.contestData.record.bonusCapPercentage
          ? this.props.contestData.record.bonusCapPercentage
          : 0,
        entryCurrency: this.props.contestData.record.registrationFeesType,
        contestStyle: this.props.contestData.record.contestStyle
          ? this.props.contestData.record.contestStyle
          : null,
        // lineupFormatId: this.props.contestData.record.lineFormatId,
        tournamentType: this.props.contestData.record.tournamentType
          ? this.props.contestData.record.tournamentType
          : 'Normal',
        foreshadowTimeMins:
          this.props.contestData.record.foreShadowTimeMins / 60,
        hardstopTimeMins: this.props.contestData.record.hardStopTimeMins
          ? this.props.contestData.record.hardStopTimeMins
          : 0,
        teamLimit: this.props.contestData.record.teamsAllowed,
        orderId: this.props.contestData.record.orderId
          ? this.props.contestData.record.orderId
          : 1,
        isGuaranteed: this.props.contestData.record.isGuaranteed ? true : false,
        autoFinish: this.props.contestData.record.autoFinish,
        minTier: this.props.contestData.record.startTier
          ? this.props.contestData.record.startTier
          : null,
        maxTier: this.props.contestData.record.endTier
          ? this.props.contestData.record.endTier
          : null,
        isActive: this.props.contestData.record.isActive
          ? this.props.contestData.record.isActive
          : false,
        recurOnFull: this.props.contestData.record.recurOnFull
          ? this.props.contestData.record.recurOnFull
          : false,
        recurEndTimeInMins: this.props.contestData.record.recurInMins
          ? this.props.contestData.record.recurInMins
          : 0,
        startRank: this.props.contestData.record.rewards.totalWinners + 1,
        endRank: this.props.contestData.record.rewards.totalWinners + 1,
        appType: this.props.contestData.record.appType
          ? [...this.props.contestData.record.appType]
          : [],
        contestType: this.props.contestData.record.contestType,
        appVersion: this.props.contestData.record.appVersion
          ? this.props.contestData.record.appVersion
          : 0,
        bonusUtilization:
          JSON.parse(this.props.contestData.record.extraInfo)
            .countryLevelMapping &&
          JSON.parse(this.props.contestData.record.extraInfo)
            .countryLevelMapping.bonusUtilization
            ? JSON.parse(this.props.contestData.record.extraInfo)
                .countryLevelMapping.bonusUtilization
            : 0,
        segmentation:
          this.props.contestData.record.segmentation &&
          this.props.contestData.record.segmentation.length > 0
            ? this.props.contestData.record.segmentation
            : []
      });

      if (this.props.contestData.record.extraInfo) {
        let extraInfo = JSON.parse(this.props.contestData.record.extraInfo);
        this.setState(
          {
            isMlContest: JSON.parse(this.props.contestData.record.extraInfo)
              .isMLEntryFeeContest
              ? JSON.parse(this.props.contestData.record.extraInfo)
                  .isMLEntryFeeContest
              : false,
            isFlashSale: this.getValueFromExtraInfo(
              this.props.contestData.record.extraInfo,
              'isFlashSale',
              false
            )
          },
          () => {
            this.props.form.setFieldsValue({
              maxChangeForML: JSON.parse(
                this.props.contestData.record.extraInfo
              ).maxChangeForML
                ? JSON.parse(this.props.contestData.record.extraInfo)
                    .maxChangeForML
                : 0,
              minChangeForML: JSON.parse(
                this.props.contestData.record.extraInfo
              ).minChangeForML
                ? JSON.parse(this.props.contestData.record.extraInfo)
                    .minChangeForML
                : 0,
              isFlashSale: this.getValueFromExtraInfo(
                this.props.contestData.record.extraInfo,
                'isFlashSale',
                false
              ),
              timeArray: [
                JSON.parse(this.props.contestData.record.extraInfo)
                  .flashSaleStartTime
                  ? moment(
                      JSON.parse(this.props.contestData.record.extraInfo)
                        .flashSaleStartTime,
                      'X'
                    )
                  : null,
                JSON.parse(this.props.contestData.record.extraInfo)
                  .flashSaleEndTime
                  ? moment(
                      JSON.parse(this.props.contestData.record.extraInfo)
                        .flashSaleEndTime,
                      'X'
                    )
                  : null
              ],
              flashSaleSlots: this.getValueFromExtraInfo(
                this.props.contestData.record.extraInfo,
                'flashSaleSlots',
                0
              ),
              flashPrice: this.getValueFromExtraInfo(
                this.props.contestData.record.extraInfo,
                'flashPrice',
                0
              ),
              model: this.getValueFromExtraInfo(
                this.props.contestData.record.extraInfo,
                'model',
                'default'
              ),
              progressiveDiscountPercent: this.getValueFromExtraInfo(
                this.props.contestData.record.extraInfo,
                'progressiveDiscountPercent',
                0
              ),
              mlExtraConfig: JSON.stringify(
                this.getValueFromExtraInfo(
                  this.props.contestData.record.extraInfo,
                  'mlExtraConfig',
                  {}
                )
              ),
              mlRollOutPercentage: this.getValueFromExtraInfo(
                this.props.contestData.record.extraInfo,
                'mlRollOutPercentage',
                0
              )
            });
          }
        );
        if (
          JSON.parse(this.props.contestData.record.extraInfo).contestType ===
          'SPONSORED'
        ) {
          this.setState({
            sponsored: true
          });
          this.props.form.setFieldsValue({
            sponsored: true
          });
          delete extraInfo.contestType;
          if (
            JSON.parse(this.props.contestData.record.extraInfo)
              .isSpecialRewardsContest
          ) {
            this.setState({ isSpecialRewardsContest: true }, () => {
              this.props.form.setFieldsValue({
                isSpecialRewardsContest: true,
                specialRewardTitle:
                  JSON.parse(this.props.contestData.record.extraInfo)
                    .specialRewardsDetails &&
                  JSON.parse(this.props.contestData.record.extraInfo)
                    .specialRewardsDetails.title
                    ? JSON.parse(this.props.contestData.record.extraInfo)
                        .specialRewardsDetails.title
                    : '',
                specialRewardSubTitle:
                  JSON.parse(this.props.contestData.record.extraInfo)
                    .specialRewardsDetails &&
                  JSON.parse(this.props.contestData.record.extraInfo)
                    .specialRewardsDetails.subTitle
                    ? JSON.parse(this.props.contestData.record.extraInfo)
                        .specialRewardsDetails.subTitle
                    : ''
              });
            });
            delete extraInfo.isSpecialRewardsContest;
            delete extraInfo.specialRewardsDetails;
          }
        }
        if (JSON.parse(this.props.contestData.record.extraInfo).imageUrl) {
          this.setState({
            previewImage: JSON.parse(this.props.contestData.record.extraInfo)
              .imageUrl,
            fileList: [
              {
                uid: -1,
                name: 'image.png',
                status: 'done',
                url: JSON.parse(this.props.contestData.record.extraInfo)
                  .imageUrl
              }
            ],
            imageUrl: JSON.parse(this.props.contestData.record.extraInfo)
              .imageUrl
          });
          delete extraInfo.imageUrl;
        }

        if (JSON.parse(this.props.contestData.record.extraInfo).pooled) {
          this.setState({
            dynamicRewardName: this.props.contestData.record
              .dynamicRewardsConfig.name,
            winnerPercentage: this.props.contestData.record.dynamicRewardsConfig
              .winnerPercentage,
            expectedMarginPercentage: this.props.contestData.record
              .dynamicRewardsConfig.expectedMarginPercentage,
            minPlayers: JSON.parse(this.props.contestData.record.extraInfo)
              .min_players
              ? JSON.parse(this.props.contestData.record.extraInfo).min_players
              : 2
          });

          this.props.form.setFieldsValue({
            dynamicRewardName: this.props.contestData.record
              .dynamicRewardsConfig.name,
            winnerPercentage: this.props.contestData.record.dynamicRewardsConfig
              .winnerPercentage,
            expectedMarginPercentage: this.props.contestData.record
              .dynamicRewardsConfig.expectedMarginPercentage,
            minPlayers: JSON.parse(this.props.contestData.record.extraInfo)
              .min_players
              ? JSON.parse(this.props.contestData.record.extraInfo).min_players
              : 2
          });
          this.setState({ isPooled: true });
          delete extraInfo.pooled;
          delete extraInfo.canceled;
          delete extraInfo.min_players;
        } else {
          if (!this.props.contestData.record.isGuaranteed) {
            this.setState({ isGuaranteed: false }, () => {
              this.props.form.setFieldsValue({
                minPlayers: JSON.parse(this.props.contestData.record.extraInfo)
                  .min_players
                  ? JSON.parse(this.props.contestData.record.extraInfo)
                      .min_players
                  : 2
              });
            });
            delete extraInfo.min_players;
          }
        }
        // -- Discounted -- //
        if (JSON.parse(this.props.contestData.record.extraInfo).originalPrice) {
          this.props.form.setFieldsValue({
            originalPrice: JSON.parse(this.props.contestData.record.extraInfo)
              .originalPrice,
            discountedMargin: JSON.parse(
              this.props.contestData.record.extraInfo
            ).discountedMargin
              ? JSON.parse(this.props.contestData.record.extraInfo)
                  .discountedMargin
              : 0
          });
          this.setState({
            originalPrice: JSON.parse(this.props.contestData.record.extraInfo)
              .originalPrice,
            discountedMargin: JSON.parse(
              this.props.contestData.record.extraInfo
            ).discountedMargin
              ? JSON.parse(this.props.contestData.record.extraInfo)
                  .discountedMargin
              : 0
          });
          delete extraInfo.originalPrice;
          delete extraInfo.discountedMargin;
          if (JSON.parse(this.props.contestData.record.extraInfo).offers) {
            let mainScope = this;
            _.forEach(
              JSON.parse(this.props.contestData.record.extraInfo).offers,
              function(item) {
                if (item.type === 'DISCOUNT') {
                  mainScope.props.form.setFieldsValue({
                    discountText: item.text ? item.text : ''
                  });
                  mainScope.setState({
                    discountText: item.text ? item.text : ''
                  });
                }
              }
            );
          }
          if (
            this.props.contestData.record.registrationFees !==
            JSON.parse(this.props.contestData.record.extraInfo).originalPrice
          ) {
            this.props.form.setFieldsValue({
              isDiscounted: true
            });
            this.setState({ isDiscounted: true });
          }
        }

        if (
          JSON.parse(this.props.contestData.record.extraInfo)
            .joinContestWithTicket
        ) {
          this.setState(
            {
              joinContestWithTicket: true
            },
            () => {
              this.props.form.setFieldsValue({
                joinContestWithTicket: JSON.parse(
                  this.props.contestData.record.extraInfo
                ).joinContestWithTicket
              });
            }
          );
        }

        if (
          JSON.parse(this.props.contestData.record.extraInfo).isTicketContest
        ) {
          let ticketText = '';
          if (JSON.parse(this.props.contestData.record.extraInfo).offers) {
            let mainScope = this;
            _.forEach(
              JSON.parse(this.props.contestData.record.extraInfo).offers,
              function(item) {
                if (item.type === 'TICKET') {
                  ticketText = item.text ? item.text : '';
                }
              }
            );
          }
          this.setState(
            {
              isTicketContest: true
            },
            () => {
              this.props.form.setFieldsValue({
                isTicketContest: JSON.parse(
                  this.props.contestData.record.extraInfo
                ).isTicketContest,
                ticketAmount: JSON.parse(
                  this.props.contestData.record.extraInfo
                ).ticketAmount
                  ? JSON.parse(this.props.contestData.record.extraInfo)
                      .ticketAmount
                  : 0,
                ticketExpiryInMinutes: JSON.parse(
                  this.props.contestData.record.extraInfo
                ).ticketExpiryInMinutes
                  ? JSON.parse(this.props.contestData.record.extraInfo)
                      .ticketExpiryInMinutes
                  : 0,
                ticketText: ticketText
              });
            }
          );
        }

        _.remove(extraInfo.offers, {
          type: 'DISCOUNT'
        });
        _.remove(extraInfo.offers, {
          type: 'TICKET'
        });

        if (
          JSON.parse(this.props.contestData.record.extraInfo)
            .joinContestWithSeasonPass
        ) {
          this.setState(
            {
              joinContestWithSeasonPass: true
            },
            () => {
              this.copyBannerImage();
              this.props.form.setFieldsValue({
                joinContestWithSeasonPass: true,
                seasonPassType: JSON.parse(
                  this.props.contestData.record.extraInfo
                ).seasonPassType,
                bannerDataTitle:
                  JSON.parse(this.props.contestData.record.extraInfo)
                    .bannerData &&
                  JSON.parse(this.props.contestData.record.extraInfo).bannerData
                    .title
                    ? JSON.parse(this.props.contestData.record.extraInfo)
                        .bannerData.title
                    : '',
                bannerDataSubtitle:
                  JSON.parse(this.props.contestData.record.extraInfo)
                    .bannerData &&
                  JSON.parse(this.props.contestData.record.extraInfo).bannerData
                    .subTitle
                    ? JSON.parse(this.props.contestData.record.extraInfo)
                        .bannerData.subTitle
                    : ''
              });
            }
          );
        }

        if (
          JSON.parse(this.props.contestData.record.extraInfo).isLoyaltyContest
        ) {
          this.props.form.setFieldsValue({
            isLoyaltyContest: true
          });
        } else {
          this.props.form.setFieldsValue({
            isLoyaltyContest: false
          });
        }

        if (JSON.parse(this.props.contestData.record.extraInfo).dynamicPrice) {
          this.props.form.setFieldsValue({
            dynamicPrice: JSON.stringify(
              JSON.parse(this.props.contestData.record.extraInfo).dynamicPrice
            )
          });
        }

        this.props.form.setFieldsValue({
          isMLEntryFeeContest: JSON.parse(
            this.props.contestData.record.extraInfo
          ).isMLEntryFeeContest
            ? JSON.parse(this.props.contestData.record.extraInfo)
                .isMLEntryFeeContest
            : false,
          isFullContestToBeShown: JSON.parse(
            this.props.contestData.record.extraInfo
          ).isFullContestToBeShown
            ? JSON.parse(this.props.contestData.record.extraInfo)
                .isFullContestToBeShown
            : false,
          contestCategory: JSON.parse(this.props.contestData.record.extraInfo)
            .contestCategory
            ? JSON.parse(this.props.contestData.record.extraInfo)
                .contestCategory
            : null,
          primeOnlyContest: JSON.parse(this.props.contestData.record.extraInfo)
            .primeOnlyContest
            ? JSON.parse(this.props.contestData.record.extraInfo)
                .primeOnlyContest
            : false,
          joinContestWithOnlySeasonPass: JSON.parse(
            this.props.contestData.record.extraInfo
          ).joinContestWithOnlySeasonPass
            ? JSON.parse(this.props.contestData.record.extraInfo)
                .joinContestWithOnlySeasonPass
            : false
        });

        if (this.props.contestData.record.contestType === 'NORMAL') {
          let isStopLossEnabled = this.getValueFromExtraInfo(
            this.props.contestData.record.extraInfo,
            'isStopLossEnabled',
            false
          );
          if (isStopLossEnabled) {
            this.setState(
              {
                showStopLoss: true,
                isStopLossEnabled: true
              },
              () => {
                this.props.form.setFieldsValue({
                  isStopLossEnabled: isStopLossEnabled,
                  stopLossThreshold: this.getValueFromExtraInfo(
                    this.props.contestData.record.extraInfo,
                    'stopLossThreshold',
                    0
                  )
                });
              }
            );
          } else {
            this.setState(
              {
                showStopLoss: true,
                isStopLossEnabled: false
              },
              () => {
                this.props.form.setFieldsValue({
                  isStopLossEnabled: false
                });
              }
            );
          }
        }

        delete extraInfo.isTicketContest;
        delete extraInfo.ticketAmount;
        delete extraInfo.ticketExpiryInMinutes;
        delete extraInfo.joinContestWithSeasonPass;
        delete extraInfo.seasonPassType;
        delete extraInfo.bannerData;
        delete extraInfo.isLoyaltyContest;
        delete extraInfo.dynamicPrice;
        delete extraInfo.isMLEntryFeeContest;
        delete extraInfo.isFullContestToBeShown;
        delete extraInfo.contestCategory;
        delete extraInfo.primeOnlyContest;
        delete extraInfo.maxChangeForML;
        delete extraInfo.minChangeForML;
        delete extraInfo.joinContestWithOnlySeasonPass;
        delete extraInfo.isFlashSale;
        delete extraInfo.flashSaleStartTime;
        delete extraInfo.flashSaleEndTime;
        delete extraInfo.flashSaleSlots;
        delete extraInfo.flashPrice;
        delete extraInfo.model;
        delete extraInfo.progressiveDiscountPercent;
        delete extraInfo.mlExtraConfig;
        delete extraInfo.mlRollOutPercentage;
        delete extraInfo.isStopLossEnabled;
        delete extraInfo.stopLossThreshold;

        if (extraInfo.min_players) {
          delete extraInfo.min_players;
        }
        this.props.form.setFieldsValue({
          extraInfo: JSON.stringify(extraInfo)
        });
      }

      if (this.props.contestData.record.dynamicRewardsConfig) {
        this.setState({
          thresholdRanges: this.props.contestData.record.dynamicRewardsConfig
            .thresholdRanges
        });
      }
      // let rewards = {
      //   prizeBreakups: this.state.contestWinnings,
      //   totalCash: this.getTotalCash(),
      //   totalToken: this.getTotalToken(),
      //   totalWinners: totalWinners
      // };

      this.setState({
        leagueId: this.props.contestData.record.leagueId,
        sportsId: this.props.contestData.record.sportsId,
        contestWinnings: this.props.contestData.record.rewards.prizeBreakups,
        checkedValues: [...this.props.contestData.record.appType],
        countryCheckedValues:
          JSON.parse(this.props.contestData.record.extraInfo)
            .countryLevelMapping &&
          JSON.parse(this.props.contestData.record.extraInfo)
            .countryLevelMapping.allowedCountry
            ? [
                ...JSON.parse(this.props.contestData.record.extraInfo)
                  .countryLevelMapping.allowedCountry
              ]
            : ['IN'],
        orderId: this.props.contestData.record.orderId
          ? this.props.contestData.record.orderId
          : 1
      });
    }
    this.getCountryCode();
  }

  componentWillUnmount() {
    this.props.actions.clearContestForm();
  }

  copyBannerImage() {
    if (
      JSON.parse(this.props.contestData.record.extraInfo).bannerData &&
      JSON.parse(this.props.contestData.record.extraInfo).bannerData.image
    ) {
      let image = JSON.parse(this.props.contestData.record.extraInfo).bannerData
        .image;
      this.setState({
        previewBannerImage: image,
        fileListBannerImage: [
          {
            uid: -1,
            name: 'image.png',
            status: 'done',
            url: image
          }
        ],
        bannerImage: url,
        loadBannerDataImage: true
      });
    } else {
      this.setState({
        loadBannerDataImage: true
      });
    }
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
              {match.title} ( {moment(match.startTime).format('YYYY-MM-DD')} )
            </Option>
          );
        });
      }
      this.setState({ matchList: list });
    });
  }

  getSegments() {
    let data = {
      sportId: 5
    };
    this.props.actions.getStSegmentList(data).then(() => {
      if (
        this.props.getStSegmentListResponse &&
        this.props.getStSegmentListResponse.segment &&
        this.props.getStSegmentListResponse.segment.length > 0
      ) {
        let segmentList = [];
        _.forEach(this.props.getStSegmentListResponse.segment, function(
          segment
        ) {
          segmentList.push(
            <Option key={segment} value={segment}>
              {segment}
            </Option>
          );
        });
        this.setState({ segmentList });
      } else {
        message.error('No segments found');
        this.setState({ segmentList: [] });
      }
    });
  }

  getAllContestCategory() {
    this.props.actions.getAllContestCategory().then(() => {
      if (
        this.props.getAllContestCategoryResponse &&
        this.props.getAllContestCategoryResponse.contestCategory &&
        this.props.getAllContestCategoryResponse.contestCategory.length > 0
      ) {
        let contestCategoryList = [];
        _.forEach(
          this.props.getAllContestCategoryResponse.contestCategory,
          function(category) {
            contestCategoryList.push(
              <Option key={category} value={category}>
                {category}
              </Option>
            );
          }
        );
        this.setState({ contestCategoryList });
      } else {
        message.error('No contest category found');
        this.setState({ contestCategoryList: [] });
      }
    });
  }

  getMlModels() {
    this.props.actions.getMlModelList().then(() => {
      if (
        this.props.getMlModelListResponse &&
        this.props.getMlModelListResponse.countryCode &&
        this.props.getMlModelListResponse.countryCode.length > 0
      ) {
        let modelListOptions = this.props.getMlModelListResponse.countryCode.map(
          model => (
            <Option key={model} value={model}>
              {model}
            </Option>
          )
        );
        this.setState({ modelListOptions });
      } else {
        this.setState({
          modelListOptions: [
            <Option key={'default'} value={'default'}>
              {'default'}
            </Option>
          ]
        });
      }
    });
  }

  getTierList() {
    this.props.actions.getTierList().then(() => {
      let tierList = [];
      if (this.props.tierList && this.props.tierList.tiers) {
        this.props.tierList.tiers.map((tier, index) => {
          tierList.push(
            <Option key={tier.tierNumber} value={tier.tierNumber}>
              {tier.tierName}
            </Option>
          );
        });
      } else {
        message.error('Could not fetch tiers');
      }

      this.setState({
        tierList
      });
    });
  }

  entryCurrencyChange(e) {
    this.setState({
      entryCurrency: e.target.value
    });
  }

  addToWinningsTable() {
    let fieldsValue = this.props.form.getFieldsValue([
      'startRank',
      'endRank',
      'cash',
      'token',
      'special',
      'bonusCashPrize'
    ]);
    let contestWinnings = this.state.contestWinnings;
    let newData = {
      startRank: fieldsValue.startRank,
      endRank: fieldsValue.endRank,
      cashPrize: fieldsValue.cash ? fieldsValue.cash : null,
      tokenPrize: fieldsValue.token ? fieldsValue.token : null,
      specialPrize: fieldsValue.special ? fieldsValue.special : null,
      bonusCashPrize: fieldsValue.bonusCashPrize
        ? fieldsValue.bonusCashPrize
        : null
    };
    contestWinnings.push(newData);
    this.setState({ contestWinnings: [...contestWinnings] });
    let newRank = this.props.form.getFieldsValue(['endRank']).endRank + 1;
    this.props.form.setFieldsValue({
      startRank: newRank,
      endRank: newRank,
      cash: null,
      token: null,
      special: null,
      bonusCashPrize: null
    });
  }

  matchSelected(seasonGameUid) {
    this.setState({
      selectedMatch: this.props.matchList.find(
        item => item.seasonGameUid === seasonGameUid
      )
    });
  }

  validateJson(e) {
    let inputValue = e.target.value;
    if (inputValue !== '') {
      try {
        JSON.parse(inputValue);
        this.setState({ isInvalidJson: false });
        return true;
      } catch (error) {
        this.setState({ isInvalidJson: true });
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topLeft'
        });
        return false;
      }
    }
  }

  validateDynamicPrice(value) {
    if (value !== '') {
      try {
        JSON.parse(value);
        this.setState({ isInvalidDynamicPrice: false });
        return true;
      } catch (error) {
        this.setState({ isInvalidDynamicPrice: true });
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topLeft'
        });
        return false;
      }
    }
  }

  validateMlExtraConfig(value) {
    if (value !== '') {
      try {
        JSON.parse(value);
        this.setState({ isInvalidMlExtraConfig: false });
        return true;
      } catch (error) {
        this.setState({ isInvalidMlExtraConfig: true });
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topLeft'
        });
        return false;
      }
    }
  }

  getTotalCash() {
    let cash = 0;
    this.state.contestWinnings.map(row => {
      if (row.cashPrize) {
        let numberOfUsers = row.endRank - row.startRank + 1;
        cash = cash + row.cashPrize * numberOfUsers;
      }
    });
    return cash;
  }

  getTotalWinners() {
    let lastRow = this.state.contestWinnings.slice(-1).pop();
    if (lastRow) {
      return lastRow.endRank;
    } else {
      return 0;
    }
  }

  getTotalToken() {
    let token = 0;
    this.state.contestWinnings.map(row => {
      if (row.tokenPrize) {
        let numberOfUsers = row.endRank - row.startRank + 1;
        token = token + row.tokenPrize * numberOfUsers;
      }
    });
    return token;
  }

  clearTable() {
    this.setState({ contestWinnings: [] });
  }
  //////////////////////////////////////////////
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    if (fileList.length === 0) {
      this.setState({ imageUrl: '' });
    }
  };

  checkBonusCap(value) {
    if (value < 0 || value > 100) {
      this.setState({ bonusCapPercentageError: true });
    } else {
      this.setState({ bonusCapPercentageError: false });
    }
  }
  checkWinnerPercentage(value) {
    if (value < 0 || value > 100) {
      this.setState({ winnerPercentageError: true });
    } else {
      this.setState({ winnerPercentageError: false });
    }
  }
  checkExpectedMargin(value) {
    if (value < 0 || value > 100) {
      this.setState({ expectedMarginPercentageError: true });
    } else {
      this.setState({ expectedMarginPercentageError: false });
    }
  }
  // ---- Toggle Discounted ---- //
  toggleDiscounted(e) {
    this.setState({ isDiscounted: e.target.value });
  }

  selectContestType(value) {
    switch (value) {
      case 'NORMAL':
        this.setState({
          showStopLoss: true,
          contentType: value
        });
        break;
      case 'POOLED':
        this.setState({
          contestType: value,
          isPooled: true,
          showStopLoss: false
        });
        break;
      case 'LEADERBOARD':
        this.setState(
          {
            sponsored: true,
            contentType: value,
            isPooled: false,
            isSpecialRewardsContest: true,
            showStopLoss: false
          },
          () => {
            this.props.form.setFieldsValue({
              sponsored: true,
              isSpecialRewardsContest: true
            });
          }
        );
        break;
      default:
        this.setState({
          contestType: value,
          isPooled: false,
          showStopLoss: false
        });
        break;
    }
  }

  // ----- Dynamic table callback function ----- //
  getDynamicRewardsTable = e => {
    this.setState({
      thresholdRanges: e
    });
  };

  toggleGuarantee(value) {
    this.setState({ isGuaranteed: value });
  }

  isTicketContestChanged(value) {
    this.setState({ isTicketContest: value });
  }

  joinContestWithTicketChanged(value) {
    this.setState({ joinContestWithTicket: value });
  }

  isStopLossEnabledChanged(value) {
    let isGuaranteed = this.state.isGuaranteed;
    let isPooled = this.state.isPooled;
    if (value) {
      isGuaranteed = false;
      isPooled = false;
    }
    this.setState(
      {
        isStopLossEnabled: value,
        isGuaranteed,
        isPooled
      },
      () => {
        this.props.form.setFieldsValue({
          isGuaranteed: isGuaranteed
        });
      }
    );
  }

  getCountryCode() {
    // actionType
    this.props.actions
      .getAllCountryCode()
      .then(() => {
        if (
          this.props.getAllCountryCodeResponse &&
          this.props.getAllCountryCodeResponse.countryCode &&
          this.props.getAllCountryCodeResponse.countryCode.length > 0
        ) {
          if (this.state.actionType) {
            let bonusUtilizationObj = {};
            let countryLevelMapping = JSON.parse(
              this.props.contestData.record.extraInfo
            ).countryLevelMapping
              ? JSON.parse(this.props.contestData.record.extraInfo)
                  .countryLevelMapping
              : {};
            _.forEach(
              this.props.getAllCountryCodeResponse.countryCode,
              function(item) {
                bonusUtilizationObj[item] =
                  countryLevelMapping[item] &&
                  countryLevelMapping[item]['bonusUtilization']
                    ? countryLevelMapping[item]['bonusUtilization']
                    : 0;
              }
            );
            this.setState({
              bonusUtilizationObj,
              countryOptions: [
                ...this.props.getAllCountryCodeResponse.countryCode
              ],
              countryListFetched: true
            });
          } else {
            this.setState({
              countryCheckedValues: [
                ...this.props.getAllCountryCodeResponse.countryCode
              ],
              countryOptions: [
                ...this.props.getAllCountryCodeResponse.countryCode
              ],
              countryListFetched: true
            });
          }
        } else {
          if (this.state.actionType) {
            let bonusUtilizationObj = {};
            let countryLevelMapping = JSON.parse(
              this.props.contestData.record.extraInfo
            ).countryLevelMapping
              ? JSON.parse(this.props.contestData.record.extraInfo)
                  .countryLevelMapping
              : {};
            _.forEach(['IN', 'ID'], function(item) {
              console.log('2 getAllCountryCodeResponse item', item);
              bonusUtilizationObj[item] =
                countryLevelMapping[item] &&
                countryLevelMapping[item]['bonusUtilization']
                  ? countryLevelMapping[item]['bonusUtilization']
                  : 0;
            });
            this.setState({
              bonusUtilizationObj,
              countryOptions: ['IN', 'ID', 'US'],
              countryListFetched: true
            });
          } else {
            this.setState({
              countryCheckedValues: ['IN', 'ID', 'US'],
              countryOptions: ['IN', 'ID', 'US'],
              countryListFetched: true
            });
          }
        }
      })
      .catch(() => {
        if (this.state.actionType) {
          let bonusUtilizationObj = {};
          let countryLevelMapping = JSON.parse(
            this.props.contestData.record.extraInfo
          ).countryLevelMapping
            ? JSON.parse(this.props.contestData.record.extraInfo)
                .countryLevelMapping
            : {};
          _.forEach(['IN', 'ID'], function(item) {
            bonusUtilizationObj[item] =
              countryLevelMapping[item] &&
              countryLevelMapping[item]['bonusUtilization']
                ? countryLevelMapping[item]['bonusUtilization']
                : 0;
          });
          this.setState({
            bonusUtilizationObj,
            countryOptions: ['IN', 'ID', 'US'],
            countryListFetched: true
          });
        } else {
          this.setState({
            countryCheckedValues: ['IN', 'ID', 'US'],
            countryOptions: ['IN', 'ID', 'US'],
            countryListFetched: true
          });
        }
      });
  }

  updateCountrySelection(value) {
    this.setState({ countryCheckedValues: value.length > 0 ? [...value] : [] });
  }

  getValue = item => {
    let bonusUtilizationObj = { ...this.state.bonusUtilizationObj };
    return bonusUtilizationObj[item];
  };

  getBonusUtilizationForCountry = (countryCode, value) => {
    let bonusUtilizationObj = { ...this.state.bonusUtilizationObj };
    bonusUtilizationObj[countryCode] = value;
    this.setState({
      bonusUtilizationObj: { ...bonusUtilizationObj }
    });
  };

  joinContestWithSeasonPassChanged(value) {
    this.setState({
      joinContestWithSeasonPass: value,
      loadBannerDataImage: value
    });
  }

  getBannerImage = data => {
    this.setState({
      bannerImage: data && data.id ? data.id : null
    });
  };

  setMlContest = value => {
    this.setState({
      isMlContest: value
    });
  };

  setFlashSale = value => {
    this.setState({
      isFlashSale: value
    });
  };

  // ----- Handle Function ----- //
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.minPlayers > values.totalSlots) {
          message.error('Minimum players can not be greater than total slots');
          return;
        }
        if (this.state.bonusCapPercentageError) {
          message.error('Bonus Cap Percentage should be between 0 and 100');
          return;
        }
        if (this.state.winnerPercentageError) {
          message.error('Winner Percentage should be between 0 and 100');
          return;
        }
        if (this.state.expectedMarginPercentageError) {
          message.error(
            'Expected Margin Percentage should be between 0 and 100'
          );
          return;
        }
        if (this.state.contestWinnings.length <= 0 && !this.state.isPooled) {
          message.error('Winning Prize Distribution is mandatory');
          return;
        }
        let totalWinners = this.getTotalWinners();
        if (totalWinners > values.totalSlots) {
          message.error(
            'Total number of winners cannot be greater than total slots'
          );
          return;
        }
        if (
          values.recurOnFull &&
          values.recurEndTimeInMins < values.hardstopTimeMins
        ) {
          message.error(
            'Recur End Time should be greater than or equal to Hard Stop Time'
          );
          return;
        }
        if (values.contestType === 'P_AJ' && values.recurOnFull) {
          message.error(
            'P_AJ contests can only be made with recur on full as false'
          );
          return;
        }
        let rewards = {
          prizeBreakups: this.state.contestWinnings,
          totalCash: this.getTotalCash(),
          totalToken: this.getTotalToken(),
          totalWinners: totalWinners
        };
        let leagueId = null;
        let sportsId = null;
        let seasonGameUid = null;
        if (this.state.selectedMatch) {
          leagueId = this.state.selectedMatch.leagueId;
          sportsId = 5;
          seasonGameUid = this.state.selectedMatch.seasonGameUid;
        } else {
          leagueId = this.state.leagueId;
          sportsId = this.state.sportsId;
          seasonGameUid = values.matchId;
        }
        // ----- Handle EXTRAINFO Block ----- //
        if (values.extraInfo) {
          values.extraInfo = JSON.parse(values.extraInfo);
        } else {
          values.extraInfo = JSON.parse({});
        }
        if (this.state.sponsored) {
          if (this.state.imageUrl === '') {
            message.error('Please upload an image');
            return;
          }

          let url = '';
          values.extraInfo['contestType'] = 'SPONSORED';
          values.extraInfo['imageUrl'] = url;
          values.extraInfo['isSpecialRewardsContest'] =
            values.isSpecialRewardsContest;
          if (values.isSpecialRewardsContest) {
            let specialRewardsDetails = {
              title: values.specialRewardTitle,
              subTitle: values.specialRewardSubTitle
                ? values.specialRewardSubTitle
                : ''
            };
            values.extraInfo['specialRewardsDetails'] = {
              ...specialRewardsDetails
            };
          }
        }
        if (this.state.checkedValues && this.state.checkedValues.length < 1) {
          message.error('Please select at least one app type');
          return;
        }
        let orderId = 11;
        if (this.state.actionType && this.state.actionType === 'EDIT') {
          orderId = this.state.orderId ? this.state.orderId : 1;
        }
        // --- Is pooled changes
        if (this.state.isPooled) {
          values.extraInfo['min_players'] = values.minPlayers;
          values.extraInfo['pooled'] = true;
          var dynamicRewardsConfig = {};
          dynamicRewardsConfig.name = values.dynamicRewardName;
          dynamicRewardsConfig.winnerPercentage = values.winnerPercentage;
          dynamicRewardsConfig.expectedMarginPercentage =
            values.expectedMarginPercentage;
          dynamicRewardsConfig.thresholdRanges = this.state.thresholdRanges;
          rewards = {
            prizeBreakups: [
              {
                startRank: 1,
                endRank: 1,
                cashPrize: 1,
                tokenPrize: null,
                specialPrize: null
              }
            ],
            totalCash: 1,
            totalToken: 0,
            totalWinners: 1
          };
        } else {
          // -------- Min player assignment if Is Guaranteed is false and not pooled ------- //
          if (!this.state.isGuaranteed) {
            values.extraInfo['min_players'] = values.minPlayers;
          }
        }
        // --- Is Discounted --- //
        if (values.isDiscounted) {
          values.extraInfo['originalPrice'] = values.originalPrice;
          values.extraInfo['discountedMargin'] = values.discountedMargin;
          if (
            values.extraInfo &&
            values.extraInfo.offers &&
            values.extraInfo.offers.length
          ) {
            let discountUpdatedFlag = false;
            _.forEach(values.extraInfo.offers, function(item) {
              if (item.type === 'DISCOUNT') {
                item.text = values.discountText;
                discountUpdatedFlag = true;
              }
            });
            if (!discountUpdatedFlag) {
              let discountOfferObj = {
                type: 'DISCOUNT',
                text: values.discountText
              };
              values.extraInfo['offers'].push(discountOfferObj);
            }
          } else {
            values.extraInfo['offers'] = [];
            let discountOfferObj = {
              type: 'DISCOUNT',
              text: values.discountText
            };
            values.extraInfo['offers'].push(discountOfferObj);
          }
        }

        values.extraInfo['joinContestWithTicket'] =
          values.joinContestWithTicket;
        values.extraInfo['isLoyaltyContest'] = values.isLoyaltyContest;
        // -- Is Ticket Enabled -- //
        if (values.isTicketContest) {
          values.extraInfo['isTicketContest'] = true;
          values.extraInfo['ticketAmount'] = values.ticketAmount;
          values.extraInfo['ticketExpiryInMinutes'] =
            values.ticketExpiryInMinutes;

          if (
            values.extraInfo &&
            values.extraInfo.offers &&
            values.extraInfo.offers.length
          ) {
            let ticketUpdatedFlag = false;
            _.forEach(values.extraInfo.offers, function(item) {
              if (item.type === 'TICKET') {
                item.text = values.ticketText;
                ticketUpdatedFlag = true;
              }
            });
            if (!ticketUpdatedFlag) {
              let ticketOfferObj = {
                type: 'TICKET',
                text: values.ticketText
              };
              values.extraInfo['offers'].push(ticketOfferObj);
            }
          } else {
            values.extraInfo['offers'] = [];
            let ticketOfferObj = {
              type: 'TICKET',
              text: values.ticketText
            };
            values.extraInfo['offers'].push(ticketOfferObj);
          }
        } else {
          values.extraInfo['isTicketContest'] = false;
        }
        // -- handle country conde and bonus utilization -- //
        if (this.state.countryCheckedValues.length < 1) {
          message.error('Please select at least one applicable country');
          return;
        } else {
          values.extraInfo['countryLevelMapping'] = {
            allowedCountry: [...this.state.countryCheckedValues],
            bonusUtilization: values.bonusUtilization
          };
          if (Object.keys(this.state.bonusUtilizationObj).length > 0) {
            let countryCodes = [...this.state.countryCheckedValues];
            let bonusUtilizationObj = { ...this.state.bonusUtilizationObj };
            for (let x = 0; x < countryCodes.length; x++) {
              if (
                !bonusUtilizationObj[countryCodes[x]] &&
                bonusUtilizationObj[countryCodes[x]] !== 0
              ) {
                message.error(
                  'Please fill bonus utilization field for: ' + countryCodes[x]
                );
                return;
              }
              values.extraInfo['countryLevelMapping'][countryCodes[x]] = {
                bonusUtilization: bonusUtilizationObj[countryCodes[x]]
              };
            }
          }
        }

        // ---  joinContestWithSeasonPass  --- //
        if (values.joinContestWithSeasonPass) {
          if (!this.state.bannerImage) {
            message.error('Please upload banner data image');
            return;
          }
          values.extraInfo['joinContestWithSeasonPass'] = true;
          values.extraInfo['seasonPassType'] = values.seasonPassType;
          values.extraInfo['bannerData'] = {
            title: values.bannerDataTitle,
            subTitle: values.bannerDataSubtitle,
            type: values.seasonPassType,
            image: this.state.bannerImage
          };
        } else {
          values.extraInfo['joinContestWithSeasonPass'] = false;
        }
        // ---  Segmentation and Dyamic Price  --- //

        values.extraInfo['dynamicPrice'] = JSON.parse(values.dynamicPrice);

        // -- ML Related changes -- //

        values.extraInfo['isMLEntryFeeContest'] = values.isMLEntryFeeContest;
        values.extraInfo['contestCategory'] = values.contestCategory;
        values.extraInfo['isFullContestToBeShown'] =
          values.isFullContestToBeShown;
        if (values.isMLEntryFeeContest) {
          values.extraInfo['maxChangeForML'] = values.maxChangeForML;
          values.extraInfo['minChangeForML'] = values.minChangeForML;
          values.extraInfo['isFlashSale'] = values.isFlashSale;
          if (values.isFlashSale) {
            values.extraInfo['flashSaleStartTime'] = values.timeArray[0].unix();
            values.extraInfo['flashSaleEndTime'] = values.timeArray[1].unix();
            values.extraInfo['flashSaleSlots'] = values.flashSaleSlots;
            values.extraInfo['flashPrice'] = values.flashPrice;
          }
          values.extraInfo['model'] = values.model;
          values.extraInfo['progressiveDiscountPercent'] =
            values.progressiveDiscountPercent;
          values.extraInfo['mlExtraConfig'] = JSON.parse(values.mlExtraConfig);
          values.extraInfo['mlRollOutPercentage'] = values.mlRollOutPercentage;
        }
        values.extraInfo['primeOnlyContest'] = values.primeOnlyContest;
        values.extraInfo['joinContestWithOnlySeasonPass'] =
          values.joinContestWithOnlySeasonPass;

        if (values.contestType === 'NORMAL') {
          values.extraInfo['isStopLossEnabled'] = values.isStopLossEnabled;
          values.extraInfo['stopLossThreshold'] = values.stopLossThreshold;
        }
        // ---     --- //
        let data = {
          contestName: values.contestName,
          leagueId: leagueId,
          totalSlots: values.totalSlots,
          seasonGameUid: seasonGameUid,
          sportsId: sportsId,
          entryFee: values.entryFee,
          bonusCapPercentage: values.bonusCapPercentage,
          entryCurrency: values.entryCurrency,
          rewardsBreakup: rewards,
          contestStyle: null,
          // lineupFormatId: values.lineupFormatId,
          tournamentType: 'Normal',
          foreshadowTimeMins: values.foreshadowTimeMins * 60,
          hardstopTimeMins: values.hardstopTimeMins,
          teamLimit: values.teamLimit,
          orderId: orderId,
          isGuaranteed: values.isGuaranteed,
          autoFinish: values.autoFinish,
          startTier: values.minTier,
          endTier: values.maxTier,
          appType: this.state.checkedValues,
          contestType: values.contestType,
          extraInfo:
            values.extraInfo && values.extraInfo !== '{}'
              ? JSON.stringify(values.extraInfo)
              : JSON.stringify({}),
          isActive: values.isActive,
          recurOnFull: values.recurOnFull,
          recurEndTimeInMins: values.recurEndTimeInMins,
          recuringNumber: values.recuringNumber ? values.recuringNumber : 1,
          dynamicRewardsConfig: dynamicRewardsConfig
            ? dynamicRewardsConfig
            : {},
          appVersion: values.appVersion ? values.appVersion : 0,
          segmentation: values.segmentation
        };

        if (this.state.actionType && this.state.actionType === 'EDIT') {
          data.contestId = this.props.contestData.record.id;
          this.props.actions.editMatchContest(data).then(() => {
            if (
              this.props.fantasy.editMatchContestResponse &&
              this.props.fantasy.editMatchContestResponse.error
            ) {
              if (this.props.fantasy.editMatchContestResponse.error.message) {
                message.error(
                  this.props.fantasy.editMatchContestResponse.error.message
                );
                return;
              } else {
                message.error('Errored out with unknown response from backend');
                return;
              }
            } else {
              this.props.form.resetFields();
              this.props.history.push('/football/match-list');
            }
          });
        } else {
          this.props.actions.createMatchContest(data).then(() => {
            if (
              this.props.fantasy.createMatchContestResponse &&
              this.props.fantasy.createMatchContestResponse.error
            ) {
              if (this.props.fantasy.createMatchContestResponse.error.message) {
                message.error(
                  this.props.fantasy.createMatchContestResponse.error.message
                );
                return;
              } else {
                message.error('Errored out with unknown response from backend');
                return;
              }
            } else {
              this.props.form.resetFields();
              this.props.history.push('/football/match-list');
            }
          });
        }

        //
      }
    });
  }

  render() {
    ////////////App type ///////////
    const appTypeSelection = checkedValues => {
      this.setState({ checkedValues: [...checkedValues] });
    };
    const appTypeOptions = [
      { label: 'CASH', value: 'CASH' },
      { label: 'PLAY_STORE', value: 'PLAY_STORE' },
      { label: 'IOS', value: 'IOS' }
    ];

    // ---------     Sponsored        --- //
    const toggleSponsor = e => {
      this.setState({
        sponsored: e.target.value
      });
    };

    const toggleRewardSurfacing = e => {
      this.setState({
        isSpecialRewardsContest: e.target.value
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

      this.props.actions.getFantasyImageUploadUrl(imageData).then(() => {
        fetch(this.props.fantasyMain.assetUrl.uploadUrl, {
          body: file,
          method: 'PUT'
        }).then(result => {
          if (result.status === 200) {
            message.destroy();
            this.setState(
              {
                imageUrl: this.props.fantasyMain.assetUrl.object.id,
                loading: false,
                file
              },
              () => console.log(this.state.imageUrl)
            );
          }
        });
      });

      return false;
    };
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
    const { previewVisible, previewImage, fileList } = this.state;
    const errors = {
      matchId: isFieldTouched('matchId') && getFieldError('matchId'),
      contestName:
        isFieldTouched('contestName') && getFieldError('contestName'),
      isGuaranteed:
        isFieldTouched('isGuaranteed') && getFieldError('isGuaranteed'),
      entryCurrency:
        isFieldTouched('entryCurrency') && getFieldError('entryCurrency'),
      entryFee: isFieldTouched('entryFee') && getFieldError('entryFee'),
      // bonusCapPercentage:
      //   (isFieldTouched('bonusCapPercentage') &&
      //     getFieldError('bonusCapPercentage')) ||
      //   this.state.bonusCapPercentageError,
      totalSlots: isFieldTouched('totalSlots') && getFieldError('totalSlots'),
      autoFinish: isFieldTouched('autoFinish') && getFieldError('autoFinish'),
      teamLimit: isFieldTouched('teamLimit') && getFieldError('teamLimit'),
      // lineupFormatId:
      //   isFieldTouched('lineupFormatId') && getFieldError('lineupFormatId'),
      foreshadowTimeMins:
        isFieldTouched('foreshadowTimeMins') &&
        getFieldError('foreshadowTimeMins'),
      hardstopTimeMins:
        isFieldTouched('hardstopTimeMins') && getFieldError('hardstopTimeMins'),
      extraInfo: isFieldTouched('extraInfo') && getFieldError('extraInfo'),
      minTier: isFieldTouched('minTier') && getFieldError('minTier'),
      maxTier: isFieldTouched('maxTier') && getFieldError('maxTier'),
      isActicve: isFieldTouched('isActicve') && getFieldError('isActicve'),
      recurOnFull:
        isFieldTouched('recurOnFull') && getFieldError('recurOnFull'),
      recurEndTimeInMins:
        isFieldTouched('recurEndTimeInMins') &&
        getFieldError('recurEndTimeInMins'),
      recuringNumber:
        isFieldTouched('recuringNumber') && getFieldError('recuringNumber'),
      contestType:
        isFieldTouched('contestType') && getFieldError('contestType'),
      minPlayers: isFieldTouched('minPlayers') && getFieldError('minPlayers'),
      winnerPercentage:
        (isFieldTouched('winnerPercentage') &&
          getFieldError('winnerPercentage')) ||
        this.state.winnerPercentageError,
      expectedMarginPercentage:
        (isFieldTouched('expectedMarginPercentage') &&
          getFieldError('expectedMarginPercentage')) ||
        this.state.expectedMarginPercentageError,
      originalPrice:
        isFieldTouched('originalPrice') && getFieldError('originalPrice'),
      discountText:
        isFieldTouched('discountText') && getFieldError('discountText'),
      discountedMargin:
        isFieldTouched('discountedMargin') && getFieldError('discountedMargin'),
      appVersion: isFieldTouched('appVersion') && getFieldError('appVersion'),
      ticketAmount:
        isFieldTouched('ticketAmount') && getFieldError('ticketAmount'),
      ticketExpiryInMinutes:
        isFieldTouched('ticketExpiryInMinutes') &&
        getFieldError('ticketExpiryInMinutes'),
      ticketText: isFieldTouched('ticketText') && getFieldError('ticketText'),
      seasonPassType:
        isFieldTouched('seasonPassType') && getFieldError('seasonPassType'),
      bannerDataTitle:
        isFieldTouched('bannerDataTitle') && getFieldError('bannerDataTitle'),
      bannerDataSubtitle:
        isFieldTouched('bannerDataSubtitle') &&
        getFieldError('bannerDataSubtitle'),
      segmentation:
        isFieldTouched('segmentation') && getFieldError('segmentation'),
      dynamicPrice:
        isFieldTouched('dynamicPrice') && getFieldError('dynamicPrice'),
      contestCategory:
        isFieldTouched('contestCategory') && getFieldError('contestCategory'),
      maxChangeForML:
        isFieldTouched('maxChangeForML') && getFieldError('maxChangeForML'),
      minChangeForML:
        isFieldTouched('minChangeForML') && getFieldError('minChangeForML'),
      flashSaleSlots:
        isFieldTouched('flashSaleSlots') && getFieldError('flashSaleSlots'),
      flashPrice: isFieldTouched('flashPrice') && getFieldError('flashPrice'),
      model: isFieldTouched('model') && getFieldError('model'),
      progressiveDiscountPercent:
        isFieldTouched('progressiveDiscountPercent') &&
        getFieldError('progressiveDiscountPercent'),
      mlExtraConfig:
        isFieldTouched('mlExtraConfig') && getFieldError('mlExtraConfig'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray'),
      mlRollOutPercentage:
        isFieldTouched('mlRollOutPercentage') &&
        getFieldError('mlRollOutPercentage')
    };

    const minTierChange = e => {
      let maxTierProfileList = [];
      this.props.tierList.tiers.map((tier, index) => {
        if (tier.tierNumber < e) {
          maxTierProfileList.push(
            <Option
              key={'tier' + index}
              disabled={true}
              value={tier.tierNumber}
            >
              {tier.tierName}
            </Option>
          );
        } else {
          maxTierProfileList.push(
            <Option
              key={'tier' + index}
              disabled={false}
              value={tier.tierNumber}
            >
              {tier.tierName}
            </Option>
          );
        }
      });

      this.setState({
        disableField: false,
        maxTierProfileList
      });
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Create Contest| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card
            title={
              this.state.actionType === 'EDIT'
                ? 'Edit Contest'
                : 'Create Match Contest'
            }
          >
            <FormItem
              validateStatus={errors.matchId ? 'error' : ''}
              help={errors.matchId || ''}
              {...formItemLayout}
              label={
                <span>
                  Match for contest
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
                  disabled={this.state.actionType === 'EDIT'}
                  showSearch
                  style={{ width: '70%' }}
                  onSelect={this.matchSelected}
                  placeholder="Select a Match"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.matchList}
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.contestName ? 'error' : ''}
              help={errors.contestName || ''}
              {...formItemLayout}
              label={
                <span>
                  Contest Name
                  <Tooltip title="Contest Name">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('contestName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input contest name!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Is Guaranteed
                  <Tooltip title="Is Contest Guaranteed">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isGuaranteed', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false,
                    type: 'boolean'
                  }
                ],
                initialValue: this.state.isGuaranteed
              })(
                <Radio.Group
                  onChange={e => this.toggleGuarantee(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                  disabled={this.state.isStopLossEnabled}
                >
                  <Radio.Button value={true}>YES</Radio.Button>
                  <Radio.Button value={false}>NO</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.entryCurrency ? 'error' : ''}
              help={errors.entryCurrency || ''}
              {...formItemLayout}
              label={
                <span>
                  Entry Currency type
                  <Tooltip title="Select cashback type">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('entryCurrency', {
                rules: [
                  {
                    required: true,
                    message: 'Please input cashback type'
                  }
                ],
                initialValue: this.state.entryCurrency
              })(
                <RadioGroup name="type" onChange={this.entryCurrencyChange}>
                  <Radio value={'Cash'}>CASH</Radio>
                  <Radio value={'Token'}>TOKEN</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem
              validateStatus={errors.entryFee ? 'error' : ''}
              help={errors.entryFee || ''}
              {...formItemLayout}
              label={
                <span>
                  Entry Fee
                  <Tooltip title="Entry Fee">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('entryFee', {
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
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Discounted
                  <Tooltip title="Is Contest Discount offer applied">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
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
                  onChange={this.toggleDiscounted}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={true}>YES</Radio.Button>
                  <Radio.Button value={false}>NO</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.isDiscounted && (
              <>
                <FormItem
                  validateStatus={errors.originalPrice ? 'error' : ''}
                  help={errors.originalPrice || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Original Price
                      <Tooltip title="Original Price">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('originalPrice', {
                    initialValue: this.state.originalPrice,
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
                <FormItem
                  validateStatus={errors.discountText ? 'error' : ''}
                  help={errors.discountText || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Discount Offer Text
                      <Tooltip title="Discount Offer Text">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('discountText', {
                    initialValue: this.state.discountText,
                    rules: [
                      {
                        required: true,
                        message: 'This is a manadatory field',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.discountedMargin ? 'error' : ''}
                  help={errors.discountedMargin || ''}
                  {...formItemLayout}
                  label={<span>Discounted Margin</span>}
                >
                  {getFieldDecorator('discountedMargin', {
                    initialValue: this.state.discountedMargin
                      ? this.state.discountedMargin
                      : 0,
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message:
                          'This is a manadatory field and should be a number',
                        whitespace: false
                      }
                    ]
                  })(<InputNumber />)}
                </FormItem>
              </>
            )}
            {/* <FormItem
              validateStatus={errors.bonusCapPercentage ? 'error' : ''}
              help={errors.bonusCapPercentage || ''}
              {...formItemLayout}
              label={
                <span>
                  Bonus Cap Percentage
                  <Tooltip title="Bonus Cap Percentage">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('bonusCapPercentage', {
                initialValue: 0,
                rules: [
                  {
                    required: false,
                    type: 'number',
                    message: 'This should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber onChange={value => this.checkBonusCap(value)} />)}
            </FormItem> */}
            <FormItem
              validateStatus={errors.totalSlots ? 'error' : ''}
              help={errors.totalSlots || ''}
              {...formItemLayout}
              label={
                <span>
                  Max Total Team/ Slots
                  <Tooltip title="Max Total Team/ Slots">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('totalSlots', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'This is a mandatory field',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            {/* <FormItem
              validateStatus={errors.totalPrizeMoney ? 'error' : ''}
              help={errors.totalPrizeMoney || ''}
              {...formItemLayout}
              label={
                <span>
                  Contest Prize pool / Total Prize money
                  <Tooltip title="Contest Prize pool / Total Prize money">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('totalPrizeMoney', {
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
            </FormItem> */}
            <FormItem
              validateStatus={errors.teamLimit ? 'error' : ''}
              help={errors.teamLimit || ''}
              {...formItemLayout}
              label={
                <span>
                  Max Team Per User
                  <Tooltip title="Max Team Per User">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('teamLimit', {
                initialValue: this.state.teamLimit,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'This is a mandatory field',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            {/* <FormItem
              validateStatus={errors.lineupFormatId ? 'error' : ''}
              help={errors.lineupFormatId || ''}
              {...formItemLayout}
              label={
                <span>
                  Lineup Format Id
                  <Tooltip title="Select lineupFormatId to create config for the same">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('lineupFormatId', {
                rules: [
                  {
                    required: true,
                    message: 'Please select match!'
                  }
                ]
              })(
                <Select
                  disabled={this.state.disableField}
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a line up format"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.lineDropdownList}
                </Select>
              )}
            </FormItem> */}
            <FormItem
              validateStatus={errors.foreshadowTimeMins ? 'error' : ''}
              help={errors.foreshadowTimeMins || ''}
              {...formItemLayout}
              label={
                <span>
                  Foreshadow Time ( in hours )
                  <Tooltip title="Time before the start of the match when Match should become visible to the users">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('foreshadowTimeMins', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message:
                      'Qualifying Amount is a mandatory field and should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.hardstopTimeMins ? 'error' : ''}
              help={errors.hardstopTimeMins || ''}
              {...formItemLayout}
              label={
                <span>
                  Hard Stop Time ( in mins )
                  <Tooltip title="Time before Match Time when registration or team additions/modifications should end">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('hardstopTimeMins', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message:
                      'Qualifying Amount is a mandatory field and should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Auto Finish
                  <Tooltip title="Auto finish flag">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('autoFinish', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select option for auto finish',
                    whitespace: false
                  }
                ],
                initialValue: true
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={false}>OFF</Radio.Button>
                  <Radio.Button value={true}>ON</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Is Active
                  <Tooltip title="Auto finish flag">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isActive', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select option for auto finish',
                    whitespace: false
                  }
                ],
                initialValue: false
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={false}>NO</Radio.Button>
                  <Radio.Button value={true}>YES</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Recur On Full
                  <Tooltip title="Auto finish flag">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('recurOnFull', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select option',
                    whitespace: false
                  }
                ],
                initialValue: false
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={false}>NO</Radio.Button>
                  <Radio.Button value={true}>YES</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.recurEndTimeInMins ? 'error' : ''}
              help={errors.recurEndTimeInMins || ''}
              {...formItemLayout}
              label={
                <span>
                  Recur End Time ( in mins )
                  <Tooltip title="Recurring will stop these many minutes before contest starts">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              extra={'This should be greater than hard stop time'}
            >
              {getFieldDecorator('recurEndTimeInMins', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please enter a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.minTier ? 'error' : ''}
              help={errors.minTier || ''}
              {...formItemLayout}
              label={
                <span>
                  Min Tier
                  <Tooltip title="Limit for the Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('minTier', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please enter the userWonMaxDays fee!',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  onChange={minTierChange}
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Min Tier"
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
            <FormItem
              validateStatus={errors.maxTier ? 'error' : ''}
              help={errors.maxTier || ''}
              {...formItemLayout}
              label={
                <span>
                  Max Tier
                  <Tooltip title="Limit for the Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('maxTier', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please select tier!',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  disabled={this.state.disableField}
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Max Tier"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.maxTierProfileList}
                </Select>
              )}
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
              validateStatus={errors.contestType ? 'error' : ''}
              help={errors.contestType || ''}
              {...formItemLayout}
              label={
                <span>
                  Contest Type
                  <Tooltip title="Contest type">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('contestType', {
                rules: [
                  {
                    required: true,
                    message: 'Please select one!',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  disabled={
                    this.state.actionType && this.state.actionType === 'EDIT'
                  }
                  showSearch
                  onChange={e => this.selectContestType(e)}
                  style={{ width: 200 }}
                  placeholder="Contest Type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {contestTypeList}
                </Select>
              )}
            </FormItem>
            {this.state.showStopLoss && (
              <>
                <FormItem {...formItemLayout} label={'Is Stop Loss Enabled'}>
                  {getFieldDecorator('isStopLossEnabled', {
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        message: 'Please select option for stop loss!',
                        whitespace: false
                      }
                    ],
                    initialValue: this.state.isStopLossEnabled
                      ? this.state.isStopLossEnabled
                      : false
                  })(
                    <Radio.Group
                      onChange={e =>
                        this.isStopLossEnabledChanged(e.target.value)
                      }
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button value={false}>No</Radio.Button>
                      <Radio.Button value={true}>Yes</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                {this.state.isStopLossEnabled && (
                  <FormItem
                    validateStatus={errors.stopLossThreshold ? 'error' : ''}
                    help={errors.stopLossThreshold || ''}
                    {...formItemLayout}
                    label={<span>Stop Loss Threshold</span>}
                  >
                    {getFieldDecorator('stopLossThreshold', {
                      initialValue: 0,
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message: 'mandatory field and should be a number',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={0} max={100} />)}
                  </FormItem>
                )}
              </>
            )}
            <FormItem
              validateStatus={errors.appVersion ? 'error' : ''}
              help={errors.appVersion || ''}
              {...formItemLayout}
              label={<span>App Version</span>}
            >
              {getFieldDecorator('appVersion', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'mandatory field and should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            {/* <div>{this.state.checkedValues[1]}</div> */}
            <FormItem
              validateStatus={errors.extraInfo ? 'error' : ''}
              help={errors.extraInfo || ''}
              {...formItemLayout}
              label={
                <span>
                  Entra Info
                  <Tooltip title="Extra Info in JSON format">
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
                initialValue: '{}'
              })(
                <TextArea
                  style={{ width: '70%' }}
                  onBlur={e => this.validateJson(e)}
                  rows={3}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.minPlayers ? 'error' : ''}
              help={errors.minPlayers || ''}
              {...formItemLayout}
              label={
                <span>
                  Minimum Players
                  <Tooltip title="Minimum number of players for contest to happen">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('minPlayers', {
                initialValue: this.state.minPlayers,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input minimum number of players!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={2} />)}
            </FormItem>
            {this.state.isPooled && (
              <React.Fragment>
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
                  validateStatus={errors.winnerPercentage ? 'error' : ''}
                  help={errors.winnerPercentage || ''}
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
                  })(
                    <InputNumber
                      min={0}
                      onChange={value => this.checkWinnerPercentage(value)}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.expectedMarginPercentage ? 'error' : ''
                  }
                  help={errors.expectedMarginPercentage || ''}
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
                  })(
                    <InputNumber
                      min={0}
                      onChange={value => this.checkExpectedMargin(value)}
                    />
                  )}
                </FormItem>
                <DynamicRewardTable
                  tableData={this.state.thresholdRanges}
                  rewardsTable={this.getDynamicRewardsTable}
                />
              </React.Fragment>
            )}
            <Row>
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    Sponsored
                    <Tooltip title="Enable Segement selection ">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('sponsored', {
                  rules: [
                    {
                      required: false,
                      type: 'boolean',
                      message: 'Please select option for Segment selection!',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.sponsored
                })(
                  <Radio.Group
                    onChange={toggleSponsor}
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              {this.state.sponsored && (
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label={<span>Special Rewards Surfacing</span>}
                  >
                    {getFieldDecorator('isSpecialRewardsContest', {
                      rules: [
                        {
                          required: false,
                          type: 'boolean',
                          message:
                            'Please select option for Segment selection!',
                          whitespace: false
                        }
                      ]
                    })(
                      <Radio.Group
                        onChange={toggleRewardSurfacing}
                        size="small"
                        buttonStyle="solid"
                      >
                        <Radio.Button value={false}>No</Radio.Button>
                        <Radio.Button value={true}>Yes</Radio.Button>
                      </Radio.Group>
                    )}
                  </FormItem>
                  {this.state.isSpecialRewardsContest && (
                    <Col>
                      <FormItem
                        {...formItemLayout}
                        label={<span>Special Rewards Title</span>}
                      >
                        {getFieldDecorator('specialRewardTitle', {
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
                        {...formItemLayout}
                        label={<span>Special Rewards SubTitle</span>}
                      >
                        {getFieldDecorator('specialRewardSubTitle', {
                          rules: [
                            {
                              required: false,
                              message: 'Please input name!',
                              whitespace: true
                            }
                          ]
                        })(<Input />)}
                      </FormItem>
                    </Col>
                  )}
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
                </Col>
              )}
              <FormItem {...formItemLayout} label={'Join Contest With Ticket'}>
                {getFieldDecorator('joinContestWithTicket', {
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select option for ticket enable!',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.joinContestWithTicket
                    ? this.state.joinContestWithTicket
                    : false
                })(
                  <Radio.Group
                    onChange={e =>
                      this.joinContestWithTicketChanged(e.target.value)
                    }
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'Is Loyalty Contest'}>
                {getFieldDecorator('isLoyaltyContest', {
                  initialValue: false,
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select option for is loyalty contest!',
                      whitespace: false
                    }
                  ]
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    Ticket Contest
                    <Tooltip title="Ticket option">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('isTicketContest', {
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select option for ticket enable!',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.isTicketContest
                    ? this.state.isTicketContest
                    : false
                })(
                  <Radio.Group
                    onChange={e => this.isTicketContestChanged(e.target.value)}
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              {this.state.isTicketContest && (
                <>
                  <FormItem
                    validateStatus={errors.ticketAmount ? 'error' : ''}
                    help={errors.ticketAmount || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Ticket Amount
                        <Tooltip title="Ticket Amount">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('ticketAmount', {
                      initialValue: 0,
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message:
                            'Qualifying Amount is a mandatory field and should be a number',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.ticketExpiryInMinutes ? 'error' : ''}
                    help={errors.ticketExpiryInMinutes || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Ticket Expiry In Minutes
                        <Tooltip title="ticketExpiryInMinutes">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('ticketExpiryInMinutes', {
                      initialValue: 0,
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message:
                            'Qualifying Amount is a mandatory field and should be a number',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={100} />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.ticketText ? 'error' : ''}
                    help={errors.ticketText || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Ticket Offer Text
                        <Tooltip title="Ticket Offer Text">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('ticketText', {
                      rules: [
                        {
                          required: true,
                          message: 'This is a manadatory field',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                </>
              )}
              {/* JOIN CONTEST WITH SEASON PASS */}
              <FormItem
                {...formItemLayout}
                label={<span>Join Contest With Season Pass</span>}
              >
                {getFieldDecorator('joinContestWithSeasonPass', {
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select option for ticket enable!',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.joinContestWithSeasonPass
                    ? this.state.joinContestWithSeasonPass
                    : false
                })(
                  <Radio.Group
                    onChange={e =>
                      this.joinContestWithSeasonPassChanged(e.target.value)
                    }
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              {this.state.joinContestWithSeasonPass && (
                <>
                  <FormItem
                    validateStatus={errors.seasonPassType ? 'error' : ''}
                    help={errors.seasonPassType || ''}
                    {...formItemLayout}
                    label={<span>Season Pass Type</span>}
                  >
                    {getFieldDecorator('seasonPassType', {
                      rules: [
                        {
                          required: true,
                          message: 'season pass type',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.bannerDataTitle ? 'error' : ''}
                    help={errors.bannerDataTitle || ''}
                    {...formItemLayout}
                    label={
                      <span>
                        Banner Data Title
                        <Tooltip title="bannerDataTitle">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('bannerDataTitle', {
                      rules: [
                        {
                          required: true,
                          message: 'Banner data titke',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.bannerDataSubtitle ? 'error' : ''}
                    help={errors.bannerDataSubtitle || ''}
                    {...formItemLayout}
                    label={<span>Banner Data Subtitle</span>}
                  >
                    {getFieldDecorator('bannerDataSubtitle', {
                      rules: [
                        {
                          required: true,
                          message: 'This is a manadatory field',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                  {this.state.loadBannerDataImage && (
                    <FormItem
                      {...formItemLayout}
                      label={<span>Banner Image</span>}
                    >
                      {getFieldDecorator(
                        'bannerImage',
                        {}
                      )(
                        <ImageUploader
                          callbackFromParent={this.getBannerImage}
                          header={'Banner Image'}
                          actions={this.props.actions}
                          previewImage={this.state.previewBannerImage}
                          fileList={this.state.fileListBannerImage}
                        />
                      )}
                    </FormItem>
                  )}
                </>
              )}
              <FormItem
                validateStatus={errors.contestCategory ? 'error' : ''}
                help={errors.contestCategory || ''}
                {...formItemLayout}
                label={<span>Contest Category</span>}
              >
                {getFieldDecorator('contestCategory', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select your Game!'
                    }
                  ]
                })(
                  <Select
                    showSearch
                    style={{ width: '70%' }}
                    placeholder="Select contest category"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.contestCategoryList}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'Is ML Entry Fee Contest'}>
                {getFieldDecorator('isMLEntryFeeContest', {
                  initialValue: false,
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message:
                        'Please select option for is ML Entry Fee Contest!',
                      whitespace: false
                    }
                  ]
                })(
                  <Radio.Group
                    onChange={e => this.setMlContest(e.target.value)}
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              {this.state.isMlContest && (
                <>
                  <FormItem
                    validateStatus={errors.minChangeForML ? 'error' : ''}
                    help={errors.minChangeForML || ''}
                    {...formItemLayout}
                    label={<span>Min Change For ML</span>}
                  >
                    {getFieldDecorator('minChangeForML', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message:
                            'minChangeForML is a mandatory field and should be a number',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.maxChangeForML ? 'error' : ''}
                    help={errors.maxChangeForML || ''}
                    {...formItemLayout}
                    label={<span>Max Change For ML</span>}
                  >
                    {getFieldDecorator('maxChangeForML', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message:
                            'maxChangeForML is a mandatory field and should be a number',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'Is Flash Sale'}>
                    {getFieldDecorator('isFlashSale', {
                      initialValue: false,
                      rules: [
                        {
                          required: true,
                          type: 'boolean',
                          message: 'Please select option for is Flash Sale!',
                          whitespace: false
                        }
                      ]
                    })(
                      <Radio.Group
                        size="small"
                        buttonStyle="solid"
                        onChange={e => this.setFlashSale(e.target.value)}
                      >
                        <Radio.Button value={false}>No</Radio.Button>
                        <Radio.Button value={true}>Yes</Radio.Button>
                      </Radio.Group>
                    )}
                  </FormItem>
                  {this.state.isFlashSale && (
                    <>
                      <FormItem
                        validateStatus={errors.timeArray ? 'error' : ''}
                        help={errors.timeArray || ''}
                        {...formItemLayout}
                        label={'Flash Sale Start and End Time'}
                      >
                        {getFieldDecorator('timeArray', {
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
                            allowClear="true"
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['Start Date', 'End Date']}
                            showTime={true}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.flashSaleSlots ? 'error' : ''}
                        help={errors.flashSaleSlots || ''}
                        {...formItemLayout}
                        label={<span>Flash Sale Slots</span>}
                      >
                        {getFieldDecorator('flashSaleSlots', {
                          rules: [
                            {
                              required: true,
                              type: 'number',
                              message:
                                'flashSaleSlots is a mandatory field and should be a number',
                              whitespace: false
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                      <FormItem
                        validateStatus={errors.flashPrice ? 'error' : ''}
                        help={errors.flashPrice || ''}
                        {...formItemLayout}
                        label={<span>Flash Price</span>}
                      >
                        {getFieldDecorator('flashPrice', {
                          rules: [
                            {
                              required: true,
                              type: 'number',
                              message:
                                'flashPrice is a mandatory field and should be a number',
                              whitespace: false
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </>
                  )}
                  <FormItem
                    validateStatus={errors.model ? 'error' : ''}
                    help={errors.model || ''}
                    {...formItemLayout}
                    label={'Model'}
                  >
                    {getFieldDecorator('model', {
                      rules: [
                        {
                          required: true,
                          message: 'Please select model!'
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        style={{ width: '70%' }}
                        placeholder="Select a ml model"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.modelListOptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={
                      errors.progressiveDiscountPercent ? 'error' : ''
                    }
                    help={errors.progressiveDiscountPercent || ''}
                    {...formItemLayout}
                    label={<span>Progressive Discount Percent</span>}
                  >
                    {getFieldDecorator('progressiveDiscountPercent', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message:
                            'progressiveDiscountPercent is a mandatory field and should be a number',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.mlRollOutPercentage ? 'error' : ''}
                    help={errors.mlRollOutPercentage || ''}
                    {...formItemLayout}
                    label={<span>Ml Roll Out Percentage</span>}
                  >
                    {getFieldDecorator('mlRollOutPercentage', {
                      rules: [
                        {
                          required: true,
                          type: 'number',
                          message:
                            'Ml Roll Out Percentage is a mandatory field and should be a number',
                          whitespace: false
                        }
                      ]
                    })(<InputNumber min={0} max={100} />)}
                  </FormItem>
                  <FormItem
                    validateStatus={
                      errors.mlExtraConfig || this.state.isInvalidMlExtraConfig
                        ? 'error'
                        : ''
                    }
                    help={
                      errors.mlExtraConfig || this.state.isInvalidMlExtraConfig
                        ? errors.mlExtraConfig
                        : ''
                    }
                    {...formItemLayout}
                    label={<span>ML Extra Config</span>}
                  >
                    {getFieldDecorator('mlExtraConfig', {
                      rules: [
                        {
                          required: false,
                          message: 'Please enter valid json',
                          whitespace: true
                        }
                      ],
                      initialValue: '{}'
                    })(
                      <TextArea
                        style={{ width: '70%' }}
                        onBlur={e => this.validateMlExtraConfig(e.target.value)}
                        rows={3}
                      />
                    )}
                  </FormItem>
                </>
              )}
              <FormItem
                {...formItemLayout}
                label={'Is Full Contest To Be Shown'}
              >
                {getFieldDecorator('isFullContestToBeShown', {
                  initialValue: false,
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message:
                        'Please select option for is full contest to be shown!',
                      whitespace: false
                    }
                  ]
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'Prime Only Contest'}>
                {getFieldDecorator('primeOnlyContest', {
                  initialValue: false,
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select option for prime only contest!',
                      whitespace: false
                    }
                  ]
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={'Join Contest With Only Season Pass'}
              >
                {getFieldDecorator('joinContestWithOnlySeasonPass', {
                  initialValue: false,
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
                      message: 'Please select option for prime only contest!',
                      whitespace: false
                    }
                  ]
                })(
                  <Radio.Group size="small" buttonStyle="solid">
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Yes</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.segmentation ? 'error' : ''}
                help={errors.segmentation || ''}
                {...formItemLayout}
                label={<span>Segments</span>}
              >
                {getFieldDecorator('segmentation', {
                  rules: [
                    {
                      type: 'array',
                      required: false,
                      message: 'Please select your Game!'
                    }
                  ]
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '70%' }}
                    placeholder="Select segments"
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
                validateStatus={
                  errors.dynamicPrice || this.state.isInvalidDynamicPrice
                    ? 'error'
                    : ''
                }
                help={
                  errors.dynamicPrice || this.state.isInvalidDynamicPrice
                    ? errors.dynamicPrice
                    : ''
                }
                {...formItemLayout}
                label={<span>Dynamic Price</span>}
              >
                {getFieldDecorator('dynamicPrice', {
                  rules: [
                    {
                      required: false,
                      message: 'Please enter valid json',
                      whitespace: true
                    }
                  ],
                  initialValue: '{}'
                })(
                  <TextArea
                    style={{ width: '70%' }}
                    onBlur={e => this.validateDynamicPrice(e.target.value)}
                    rows={3}
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.bonusUtilization ? 'error' : ''}
                help={errors.bonusUtilization || ''}
                {...formItemLayout}
                label={<span>Bonus Utilization</span>}
              >
                {getFieldDecorator('bonusUtilization', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message:
                        'bonusUtilization is a mandatory field and should be a number',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              {this.state.countryListFetched && (
                <FormItem
                  {...formItemLayout}
                  label={<span>Applicalble Countries</span>}
                >
                  {getFieldDecorator('allowedCountry', {
                    rules: [
                      {
                        required: true,
                        type: 'array',
                        message: 'Please select option for app type!'
                      }
                    ],
                    initialValue: this.state.countryCheckedValues
                  })(
                    <CheckboxGroup
                      options={this.state.countryOptions}
                      onChange={e => this.updateCountrySelection(e)}
                    />
                  )}
                </FormItem>
              )}
              {this.state.countryListFetched &&
                this.state.countryOptions &&
                this.state.countryOptions.map(item => {
                  return (
                    <CountryBonusUtilization
                      key={'country' + item}
                      countryCode={item}
                      initialValue={this.getValue(item)}
                      updateParentComponent={this.getBonusUtilizationForCountry}
                    />
                  );
                })}
            </Row>
            {/* REWARDS SECTION */}
            {!this.state.isPooled && (
              <Card type="inner">
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          Start Rank
                          <Tooltip title="Start Rank">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('startRank', {
                        initialValue: this.state.startRank,
                        rules: [
                          {
                            required: false,
                            type: 'number',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={1} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          End Rank
                          <Tooltip title="End Rank">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('endRank', {
                        initialValue: this.state.endRank,
                        rules: [
                          {
                            required: false,
                            type: 'number',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={1} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row justify="center">
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          Cash
                          <Tooltip title="Cash Prize">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('cash', {
                        initialValue: this.state.cash,
                        rules: [
                          {
                            required: false,
                            type: 'number',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          Token
                          <Tooltip title="Token Prize">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('token', {
                        initialValue: this.state.token,
                        rules: [
                          {
                            required: false,
                            type: 'number',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          Bonus
                          <Tooltip title="Bonus Cash Prize">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('bonusCashPrize', {
                        initialValue: this.state.bonusCashPrize,
                        rules: [
                          {
                            required: false,
                            type: 'number',
                            whitespace: false
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          Special
                          <Tooltip title="Special">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('special', {
                        initialValue: this.state.special,
                        rules: [
                          {
                            required: false,
                            whitespace: true
                          }
                        ]
                      })(<Input />)}
                    </FormItem>
                  </Col>
                  <Col offset={10} span={10}>
                    <Button
                      onClick={this.addToWinningsTable}
                      type="primary"
                      size="large"
                    >
                      <Icon type="plus-circle" />
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Popconfirm
                      title="Are you sure to clear the rewards table?"
                      onConfirm={() => this.clearTable()}
                    >
                      <Button type="danger">Clear Rewards Table</Button>
                    </Popconfirm>
                  </Col>
                </Row>
                <WinningTable contestWinnings={this.state.contestWinnings} />
              </Card>
            )}
            <Card type="inner">
              <Row>
                <Col span={8}>
                  <strong>Contest commission:</strong>
                </Col>
                <Col span={16}>{this.state.contestCommission}</Col>
              </Row>
            </Card>
            <FormItem
              validateStatus={errors.recuringNumber ? 'error' : ''}
              help={errors.recuringNumber || ''}
              {...formItemLayout}
              label={
                <span>
                  Number of clones
                  <Tooltip title="Total bulk clone number">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('recuringNumber', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'This should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={1} max={100} />)}
            </FormItem>
            <Row type="flex" justify="center">
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Save
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
    matchList: state.football.matches,
    allLineFormats: state.football.lineFormats,
    tierList: state.football.tierList,
    contestData: state.football.contestData,
    fantasy: state.football,
    fantasyMain: state.fantasy,
    getStSegmentListResponse:
      state.superteamLeaderboard.getStSegmentListResponse,
    getAllContestCategoryResponse: state.football.getAllContestCategoryResponse,
    getMlModelListResponse: state.football.getMlModelListResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...footballActions, ...storageActions, ...superteamLeaderboardActions },
      dispatch
    )
  };
}
const CreateContestForm = Form.create()(CreateContest);
export default connect(mapStateToProps, mapDispatchToProps)(CreateContestForm);
