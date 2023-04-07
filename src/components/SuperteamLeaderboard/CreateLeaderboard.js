import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as superteamLeaderboardActions from '../../actions/SuperteamLeaderboardActions';
import * as footballActions from '../../actions/FootballActions';
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
  Row,
  Col,
  DatePicker,
  message,
  Popconfirm,
  Spin,
  Table,
  notification,
  Checkbox,
  Switch
} from 'antd';
import WinningTable from './WinningTable';
import ImageUploader from './ImageUploader';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const RadioButton = Radio.Button;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const CountryList = ['ID', 'IN', 'US'].map(country => (
  <RadioButton value={country} key={country}>
    {country}
  </RadioButton>
));

const LeaderboardTypeNames = [
  'RUN',
  'SIX',
  'WICKET',
  'EARNING',
  'POINT',
  'INVESTMENT'
];

const LeaderBoardType = [
  <Option key="POINT" value="POINT">
    POINT
  </Option>,
  <Option key="INVESTMENT" value="INVESTMENT">
    INVESTMENT
  </Option>
];

const LeaderBoardStatusCreate = [
  <Option key="LIVE" value="LIVE">
    LIVE
  </Option>
];

const LeaderBoardStatusEdit = [
  <Option key="LIVE" value="LIVE">
    LIVE
  </Option>,
  <Option key="COMPLETED" value="COMPLETED">
    COMPLETED
  </Option>
];

const FantasyGameOptions = [
  <Option key={0} value={0}>
    None
  </Option>,
  <Option key={7} value={7}>
    Cricket
  </Option>,
  <Option key={5} value={5}>
    Football
  </Option>,
  <Option key={8} value={8}>
    Kabaddi
  </Option>,
  <Option key={101} value={101}>
    Stock
  </Option>,
  <Option key={6} value={6}>
    Basketball
  </Option>,
  <Option key={3} value={3}>
    Baseball
  </Option>,
  <Option key={4} value={4}>
    Hockey
  </Option>
];

const ContestGroupList = [
  <Option key={'H2H'} value={'H2H'}>
    H2H
  </Option>,
  <Option key={'GL'} value={'GL'}>
    GL
  </Option>,
  <Option key={'SL'} value={'SL'}>
    SL
  </Option>
];

class CreateLeaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      contestWinnings: [],
      leagueDetailsFetched: false,
      leagueDetailOptions: [],
      leagueDetails: [],
      leagueMatchList: [],
      leagueMatchListFetched: false,
      startRank: 1,
      endRank: 1,
      cash: null,
      token: null,
      special: null,
      bonusCashPrize: null,
      loadImage: false,
      imageLoading: false,
      selectedRowKeys: [],
      dateCheckFlag: false,
      isEarningOrInvestment: false,
      contestCategoryList: [],
      countryCheckedValues: [],
      countryCode: ['IN'],
      selectedSportId: [],
      excludedMatchIds: {},
      selectedLeagueIds: [],
      updateLeagueIds: [],
      excludedIdList: [],
      includedMatchIds: {},
      gameCheckedValues: [],
      leagueValues: [],
      hasEditLeagueSelectDone: false
    };
    this.addToWinningsTable = this.addToWinningsTable.bind(this);
    this.getTotalWinners = this.getTotalWinners.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.leagueSelected = this.leagueSelected.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.getAllContestCategory();
    if (this.props.leaderboardDetails) {
      this.setState({ isEdit: true }, () => {
        this.cloneLeaderboardDetails();
      });
    } else {
      this.setState({ loadImage: true, isEdit: false });
    }
  }

  getAllContestCategory() {
    this.props.actions.getAllContestCategory().then(() => {
      if (
        this.props.getAllContestCategoryResponse &&
        this.props.getAllContestCategoryResponse.contestCategory &&
        this.props.getAllContestCategoryResponse.contestCategory.length > 0
      ) {
        let contestCategoryList = [];
        contestCategoryList.push(
          <Option key={'ALL'} value={'ALL'}>
            {'ALL'}
          </Option>
        );
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

  getGameNamebyId = id => {
    let gameName = '';
    switch (id) {
      case '7':
        gameName = 'Cricket';
        break;
      case '5':
        gameName = 'Football';
        break;
      case '8':
        gameName = 'Kabaddi';
        break;
      case '101':
        gameName = 'Stock';
        break;
      case '6':
        gameName = 'Basketball';
        break;
      case '3':
        gameName = 'Baseball';
        break;
      case '4':
        gameName = 'Hockey';
        break;
      default:
        gameName = 'Cricket';
        break;
    }
    return gameName;
  };

  getGameValues = leaderboardDetails => {
    const leagueRes = leaderboardDetails['includedLeagueIds'];
    let gameCheckedValues = [];
    let sportIds = [];
    if (leagueRes && Object.keys(leagueRes).length > 0) {
      sportIds = Object.keys(leagueRes);
    }
    if (sportIds && sportIds.length > 0) {
      sportIds.forEach(id => {
        const gameName = this.getGameNamebyId(id);
        gameCheckedValues.push(gameName);
      });
    }
    return gameCheckedValues;
  };

  getSelectedRowValueFromSportIdMatchId(sportId, matchId) {
    const { leagueMatchList } = this.state;
    let currentMatch = leagueMatchList.filter(
      match => match.seasonGameUid == matchId && match.sportId == sportId
    );
    return `${currentMatch.leagueId}:${matchId}:${sportId}`;
  }

  setExludeMatchIds(leaderboardDetails) {
    const excludeIds = leaderboardDetails['excludedMatchIds'];
    if (excludeIds && Object.keys(excludeIds).length > 0) {
      Object.keys(excludeIds).forEach(sportId => {
        const res = excludeIds[sportId]['matchIds'];
        if (res && res.length > 0) {
          res.forEach(el => {
            this.excludeMatchHandler({
              sportId: sportId,
              seasonGameUid: el
            });
          });
        }
      });
    }
  }

  getLeagueValues(leaderboardDetails) {
    let leagueValues = [];
    const leagueData = leaderboardDetails['includedLeagueIds'];
    if (leagueData && Object.keys(leagueData).length > 0) {
      let sportIds = Object.keys(leagueData);
      sportIds.forEach(sportId => {
        let leagueIds = leagueData[sportId]['leagueIds'];
        leagueIds.forEach(league => {
          leagueValues.push(`${league.id}:${sportId}`);
        });
      });
    }
    return leagueValues;
  }

  checkIsAutoUpdate(leaderboardDetails) {
    let autoUpdateIds = [];
    const leagueData = leaderboardDetails['includedLeagueIds'];
    if (leagueData && Object.keys(leagueData).length > 0) {
      let sportIds = Object.keys(leagueData);
      sportIds.forEach(sportId => {
        let leagueIds = leagueData[sportId]['leagueIds'];
        leagueIds.forEach(league => {
          if (league.autoUpdate) {
            autoUpdateIds.push(`${league.id}:${sportId}`);
          }
        });
      });
    }
    return autoUpdateIds.length > 0 ? true : false;
  }

  getAutoUpdateIds(leaderboardDetails) {
    let autoUpdateIds = [];
    const leagueData = leaderboardDetails['includedLeagueIds'];
    if (leagueData && Object.keys(leagueData).length > 0) {
      let sportIds = Object.keys(leagueData);
      sportIds.forEach(sportId => {
        let leagueIds = leagueData[sportId]['leagueIds'];
        leagueIds.forEach(league => {
          if (league.autoUpdate) {
            autoUpdateIds.push(`${league.id}:${sportId}`);
          }
        });
      });
    }
    return autoUpdateIds;
  }

  getSportIdFromName(sportName) {
    let sportId = 0;
    switch (sportName) {
      case 'Cricket':
        sportId = 7;
        break;
      case 'Football':
        sportId = 5;
        break;
      case 'Kabaddi':
        sportId = 8;
        break;
      case 'Stock':
        sportId = 101;
        break;
      case 'Basketball':
        sportId = 6;
        break;
      case 'Baseball':
        sportId = 3;
        break;
      case 'Hockey':
        sportId = 4;
        break;
      default:
        sportId = '';
        break;
    }
    return sportId;
  }

  async cloneLeaderboardDetails() {
    let leaderboardDetails = { ...this.props.leaderboardDetails };
    const gameCheckedValues = this.getGameValues(leaderboardDetails);
    for (let i = 0; i < gameCheckedValues.length; i++) {
      let sportId = this.getSportIdFromName(gameCheckedValues[i]);
      this.getAllLeague(sportId);
    }

    this.setExludeMatchIds(leaderboardDetails);

    this.setState(
      {
        countryCode: leaderboardDetails.countryCode,
        isEarningOrInvestment:
          leaderboardDetails.leaderBoardType === 3 ||
          leaderboardDetails.leaderBoardType === 5
            ? true
            : false,
        selectedLeaderboardType:
          LeaderboardTypeNames[
            leaderboardDetails.leaderBoardType
              ? leaderboardDetails.leaderBoardType
              : 0
          ],
        startDate: moment(leaderboardDetails.startDate),
        endDate: moment(leaderboardDetails.endDate),
        dateCheckFlag: true,
        contestWinnings: [...leaderboardDetails.rewardsBreakup.prizeBreakups],
        isAutoUpdate: this.checkIsAutoUpdate(leaderboardDetails),
        updateLeagueIds: this.getAutoUpdateIds(leaderboardDetails),
        // selectedLeagueIds: selectedLeagueIds,
        gameCheckedValues
      },
      () => {
        if (leaderboardDetails.image) {
          this.copyImage(leaderboardDetails.image);
        }
        this.props.form.setFieldsValue({
          sportId: leaderboardDetails.sportId ? leaderboardDetails.sportId : 0,
          title: leaderboardDetails.title,
          subtitle: leaderboardDetails.subtitle,
          isActive: leaderboardDetails.isActive
            ? leaderboardDetails.isActive
            : false,
          leaderBoardType:
            LeaderboardTypeNames[
              leaderboardDetails.leaderBoardType
                ? leaderboardDetails.leaderBoardType
                : 0
            ],
          status: leaderboardDetails.status,
          leagueId: leaderboardDetails.leagueId,
          timeArray: [
            moment(leaderboardDetails.startDate),
            moment(leaderboardDetails.endDate)
          ],
          terms: leaderboardDetails.terms
            ? leaderboardDetails.terms.join('#')
            : '',
          extraInfo: leaderboardDetails.extraInfo,
          startRank: leaderboardDetails.rewardsBreakup.totalWinners
            ? leaderboardDetails.rewardsBreakup.totalWinners
            : 1,
          endRank: leaderboardDetails.rewardsBreakup.totalWinners
            ? leaderboardDetails.rewardsBreakup.totalWinners
            : 1,
          minEntryFee: leaderboardDetails.minEntryFee
            ? leaderboardDetails.minEntryFee
            : 0,
          maxEntryFee: leaderboardDetails.maxEntryFee
            ? leaderboardDetails.maxEntryFee
            : 0,
          contestGroup:
            leaderboardDetails.contestGroup &&
            leaderboardDetails.contestGroup.length > 0
              ? [...leaderboardDetails.contestGroup]
              : [],
          countryCode: leaderboardDetails.countryCode[0],
          contestCategory: leaderboardDetails.contestCategory,
          gameCheckedValues: gameCheckedValues,
          leagueValues: this.getLeagueValues(leaderboardDetails),
          isAutoUpdate: this.checkIsAutoUpdate(leaderboardDetails),
          autoUpdateIds: this.getAutoUpdateIds(leaderboardDetails)
        });
      }
    );
  }

  componentWillUnmount() {
    this.props.actions.clearLeaderboardForm();
  }

  copyImage(image) {
    let url = '';
    this.setState({
      previewImage: image,
      fileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: image
        }
      ]
    });

    if (_.includes(image, '""')) {
      url = image.split('""/').pop();
    } else {
      url = image;
    }
    this.setState({
      image: url,
      loadImage: true
    });
  }

  async getAllLeague(sportId) {
    let leaderboardDetails = { ...this.props.leaderboardDetails };
    let startDate = this.state.startDate
      ? this.state.startDate
      : moment(leaderboardDetails.startDate);
    let endDate = this.state.endDate
      ? this.state.endDate
      : moment(leaderboardDetails.endDate);

    startDate = startDate.set({ hour: 0, minute: 1 });
    endDate = endDate.set({ hour: 23, minute: 59 });

    let data = {
      sportId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    await this.props.actions.getAllLeagueList(data).then(() => {
      if (
        this.props.getSlAllLeagueListResponse &&
        this.props.getSlAllLeagueListResponse.leagueDetails &&
        this.props.getSlAllLeagueListResponse.leagueDetails.length > 0
      ) {
        let leagueDetails = [
          ...this.props.getSlAllLeagueListResponse.leagueDetails
        ];
        let leagueDetailOptions = this.state.leagueDetailOptions;
        let res = [];
        leagueDetails.forEach(league => {
          leagueDetailOptions.push(
            <Option
              key={`${league.leagueId}:${sportId}`}
              value={`${league.leagueId}:${sportId}`}
            >
              {league.leagueName} ( {sportId} )
            </Option>
          );
          res.push({
            leagueName: league.leagueName,
            leagueId: league.leagueId,
            sportId: sportId,
            leagueSportId: `${league.leagueId}:${sportId}`
          });
        });
        this.setState(
          {
            leagueDetailOptions: [...leagueDetailOptions],
            leagueDetailsFetched: true,
            leagueDetails: [...this.state.leagueDetails, ...res]
          },
          () => {
            if (this.state.isEdit && !this.state.hasEditLeagueSelectDone) {
              this.setState(
                {
                  hasEditLeagueSelectDone: true
                },
                () => {
                  let leaderboardDetails = { ...this.props.leaderboardDetails };
                  if (
                    leaderboardDetails.includedLeagueIds &&
                    leaderboardDetails.includedLeagueIds[sportId] &&
                    leaderboardDetails.includedLeagueIds[sportId][
                      'leagueIds'
                    ] &&
                    leaderboardDetails.includedLeagueIds[sportId]['leagueIds']
                      .length > 0
                  ) {
                    let leagueIds =
                      leaderboardDetails.includedLeagueIds[sportId][
                        'leagueIds'
                      ];
                    leagueIds.forEach(league => {
                      this.leagueSelected(`${league.id}:${sportId}`);
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        message.error(
          'Unable to fetch leagues for sportID - ' + this.state.sportId
        );
      }
    });
  }

  updateCountrySelection(value) {
    this.setState({ countryCheckedValues: value.length > 0 ? [...value] : [] });
  }

  sportSelected(value) {
    this.setState({ sportId: value });
  }

  dateSelected(timeArray) {
    this.setState({
      startDate: timeArray[0],
      endDate: timeArray[1],
      dateCheckFlag: true
    });
  }

  leagueSelected(leagueId, sportId = null) {
    if (!this.state.dateCheckFlag && !this.state.isEdit) {
      message.error('Please select date first');
      return;
    }
    let { leaderboardDetails } = this.props;

    let leagueInfo = {};
    if (!sportId) {
      let tempLeagueIdSportIdArray = leagueId.split(':');
      let leagueObj = this.state.leagueDetails.find(
        league =>
          league.leagueId === Number(tempLeagueIdSportIdArray[0]) &&
          league.sportId === Number(tempLeagueIdSportIdArray[1])
      );
      let leagueName =
        leagueObj && leagueObj.leagueName ? leagueObj.leagueName : 'N/A';

      leagueInfo = {
        leagueSportId: leagueId,
        leagueId: Number(tempLeagueIdSportIdArray[0]),
        sportId: Number(tempLeagueIdSportIdArray[1]),
        leagueName: leagueName
      };

      if (leagueObj && leagueObj.leagueId) {
        let { selectedLeagueIds } = this.state;
        selectedLeagueIds.push(leagueInfo);
        this.setState({
          selectedLeagueIds
        });
      } else {
        return;
      }
    }

    let startDate = this.state.startDate
      ? this.state.startDate
      : moment(leaderboardDetails.startDate);
    let endDate = this.state.endDate
      ? this.state.endDate
      : moment(leaderboardDetails.endDate);
    startDate = startDate.set({ hour: 0, minute: 1 });
    endDate = endDate.set({ hour: 23, minute: 59 });
    let data = {
      sportId: leagueInfo.sportId,
      leagueId: leagueInfo.leagueId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    this.props.actions.getAllMatchLeague(data).then(() => {
      if (this.props.getSlAllMatchLeagueResponse) {
        if (this.props.getSlAllMatchLeagueResponse.error) {
          message.error(
            this.props.getSlAllMatchLeagueResponse.error.message
              ? this.props.getSlAllMatchLeagueResponse.error.message
              : 'Could not fetch match list'
          );
        } else {
          if (
            this.props.getSlAllMatchLeagueResponse &&
            this.props.getSlAllMatchLeagueResponse.matchDetailsList &&
            this.props.getSlAllMatchLeagueResponse.matchDetailsList.length > 0
          ) {
            const matchList = [
              ...this.props.getSlAllMatchLeagueResponse.matchDetailsList
            ];
            let result = [];
            result = matchList.map(match => {
              let matchRowKey = `${leagueInfo.leagueId}:${leagueInfo.sportId}:${match.seasonGameUid}`;
              let sportId = leagueInfo.sportId;
              return { matchRowKey, ...match, sportId };
            });
            console.log('-----result---------', result);
            if (this.state.isEdit) {
              if (
                leaderboardDetails.includedMatchIds &&
                leaderboardDetails.includedMatchIds[leagueInfo.sportId] &&
                leaderboardDetails.includedMatchIds[leagueInfo.sportId]
                  .matchIds &&
                leaderboardDetails.includedMatchIds[leagueInfo.sportId].matchIds
                  .length > 0
              ) {
                let rows = leaderboardDetails.includedMatchIds[
                  leagueInfo.sportId
                ].matchIds.map(matchId => {
                  if (
                    matchList.find(match => match.seasonGameUid == matchId) !==
                    undefined
                  ) {
                    return `${leagueInfo.leagueId}:${leagueInfo.sportId}:${matchId}`;
                  }
                });
                let { selectedRowKeys } = this.state;
                rows.forEach(row => {
                  if (!selectedRowKeys.includes(row) && row) {
                    selectedRowKeys.push(row);
                  }
                });
                this.setState({
                  selectedRowKeys
                });
              }
            }
            console.log(
              '-----this.state.leagueMatchList---------',
              this.state.leagueMatchList
            );
            console.log('-----final result---------', result);
            this.setState({
              leagueMatchList: [...this.state.leagueMatchList, ...result],
              leagueMatchListFetched: true
            });
          } else {
            message.info('Match List is empty for this league');
            this.setState({
              leagueMatchListFetched: true
            });
          }
        }
      }
    });
  }

  leagueDeselected(leagueSport) {
    let { leagueMatchList, selectedLeagueIds } = this.state;
    leagueMatchList = leagueMatchList.filter(
      row => !row.matchRowKey.includes(leagueSport)
    );
    selectedLeagueIds = selectedLeagueIds.filter(
      row => !row.leagueSportId.includes(leagueSport)
    );
    this.setState({
      leagueMatchList,
      selectedLeagueIds
    });
  }

  getIncludedMatchIds = () => {
    const { leagueMatchList, selectedRowKeys } = this.state;
    let includedMatchIds = {};
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      let sportId = '';
      selectedRowKeys.forEach(selectedRow => {
        let selectedRowArray = selectedRow.split(':');
        sportId = selectedRowArray[1];
        let matchId = Number(selectedRowArray[2]);
        if (
          includedMatchIds &&
          Object.keys(includedMatchIds).length > 0 &&
          includedMatchIds[sportId] &&
          Object.keys(includedMatchIds[sportId]).length > 0
        ) {
          const matchIds = includedMatchIds[sportId]['matchIds'];
          matchIds.push(matchId);

          includedMatchIds = {
            ...includedMatchIds,
            [sportId]: {
              matchIds: matchIds
            }
          };
        } else {
          includedMatchIds = {
            ...includedMatchIds,
            [sportId]: {
              matchIds: [matchId]
            }
          };
        }
      });
    }
    return includedMatchIds;
  };

  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  };

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
  updateLeagueOptions = async options => {
    let { gameCheckedValues } = this.state;
    this.setState({
      leagueDetailOptions: [],
      gameCheckedValues: options
    });
    if (options.length > 0) {
      options.forEach(option => {
        let sportId = '';
        switch (option) {
          case 'Cricket':
            sportId = 7;
            break;
          case 'Football':
            sportId = 5;
            break;
          case 'Kabaddi':
            sportId = 8;
            break;
          case 'Stock':
            sportId = 101;
            break;
          case 'Basketball':
            sportId = 6;
            break;
          case 'Baseball':
            sportId = 3;
            break;
          case 'Hockey':
            sportId = 4;
            break;
          default:
            sportId = '';
            break;
        }
        this.getAllLeague(sportId);
      });
    }
  };

  getImageUrl = data => {
    this.setState({
      image: data && data.id ? data.id : ''
    });
  };

  isImageLoading = data => {
    this.setState({
      imageLoading: data
    });
  };

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

  getTotalWinners() {
    let lastRow = this.state.contestWinnings.slice(-1).pop();
    if (lastRow) {
      return lastRow.endRank;
    } else {
      return 0;
    }
  }

  getTotalCash() {
    let cash = 0;
    this.state.contestWinnings.forEach(row => {
      if (row.cashPrize) {
        let numberOfUsers = row.endRank - row.startRank + 1;
        cash = cash + row.cashPrize * numberOfUsers;
      }
    });
    return cash;
  }

  getTotalToken() {
    let token = 0;
    this.state.contestWinnings.forEach(row => {
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

  selectLeaderboardType(value) {
    let isEarningOrInvestment = false;
    if (value === 'EARNING' || value === 'INVESTMENT') {
      isEarningOrInvestment = true;
    }
    this.setState({ isEarningOrInvestment, selectedLeaderboardType: value });
  }

  handleCountryChange = value => {
    let countryCode = [];
    countryCode.push(value);
    this.setState({
      countryCode
    });
  };

  excludeMatchHandler = record => {
    let { excludedMatchIds, excludedIdList, selectedRowKeys } = this.state;

    if (
      excludedMatchIds &&
      Object.keys(excludedMatchIds).length > 0 &&
      excludedMatchIds[record.sportId] &&
      Object.keys(excludedMatchIds[record.sportId]).length > 0
    ) {
      let matchIds = [...excludedMatchIds[record.sportId]['matchIds']];
      if (matchIds.includes(record.seasonGameUid)) {
        matchIds = matchIds.filter(match => match !== record.seasonGameUid);
      } else {
        matchIds.push(record.seasonGameUid);
      }

      excludedMatchIds = {
        ...excludedMatchIds,
        [record.sportId]: {
          matchIds: matchIds
        }
      };
    } else {
      excludedMatchIds = {
        ...excludedMatchIds,
        [record.sportId]: {
          matchIds: [record.seasonGameUid]
        }
      };
    }

    if (excludedIdList.includes(record.seasonGameUid)) {
      excludedIdList = excludedIdList.filter(
        item => item !== record.seasonGameUid
      );
    } else {
      selectedRowKeys = selectedRowKeys.filter(
        item => item !== record.matchRowKey
      );
      excludedIdList.push(record.seasonGameUid);
    }
    this.setState({
      excludedMatchIds,
      excludedIdList,
      selectedRowKeys
    });
  };

  handleAutoUpdate = value => {
    this.setState({
      updateLeagueIds: value
    });
  };

  getAutoUpdateLeagueIds = () => {
    let { updateLeagueIds, selectedLeagueIds } = this.state;
    updateLeagueIds = updateLeagueIds.map(item => {
      let itemArray = item.split(':');
      return Number(itemArray[0]);
    });
    let res = {};
    if (selectedLeagueIds && selectedLeagueIds.length > 0) {
      selectedLeagueIds.forEach(league => {
        const sportId = league.sportId;
        if (
          res &&
          Object.keys(res).length > 0 &&
          res[sportId] &&
          Object.keys(res[sportId]).length > 0
        ) {
          const leagueIds = res[sportId]['leagueIds'];
          leagueIds.push({
            id: league.leagueId,
            autoUpdate: updateLeagueIds.includes(league.leagueId) ? true : false
          });
          res = {
            ...res,
            [sportId]: {
              leagueIds: leagueIds
            }
          };
        } else {
          res = {
            ...res,
            [sportId]: {
              leagueIds: [
                {
                  id: league.leagueId,
                  autoUpdate: updateLeagueIds.includes(league.leagueId)
                    ? true
                    : false
                }
              ]
            }
          };
        }
      });
    }
    return res;
  };

  getLeagueName(leagueSportId) {
    const { leagueDetails } = this.state;
    let leagueInfo = leagueDetails.find(
      league => league.leagueSportId === leagueSportId
    );
    return leagueInfo && leagueInfo.leagueName ? leagueInfo.leagueName : 'N/A';
  }

  // ----- Handle Function ----- //
  handleSubmit(e) {
    e.preventDefault();
    const { countryCode, excludedMatchIds } = this.state;
    const updateLeagueIds = this.getAutoUpdateLeagueIds();
    const includedMatchIds = this.getIncludedMatchIds();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (countryCode.length == 0) {
          message.error('Please select country!');
          return;
        }
        if (this.state.image === '') {
          message.error('Please upload leaderboard image');
          return;
        }
        if (this.state.contestWinnings.length <= 0) {
          message.error('Winning Prize Distribution is mandatory');
          return;
        }

        if (
          !this.state.isEarningOrInvestment &&
          Object.keys(this.state.includedMatchIds).length === 0 < 1
        ) {
          message.error('At least one match should be selected', 1.5);
          return;
        }
        if (values.minEntryFee > values.maxEntryFee) {
          message.error(
            'Min Entry Fee should be less than or equal to Max Entry Fee'
          );
          return;
        }
        let totalWinners = this.getTotalWinners();
        let rewards = {
          prizeBreakups: this.state.contestWinnings,
          totalCash: this.getTotalCash(),
          totalToken: this.getTotalToken(),
          totalWinners: totalWinners
        };
        let terms = values.terms ? values.terms.split('#') : [];

        let data = {
          title: values.title,
          subtitle: values.subtitle,
          image: this.state.image,
          leaderBoardType: values.leaderBoardType,
          startDate: moment(values.timeArray[0])
            .startOf('day')
            .toISOString(),
          endDate: moment(values.timeArray[1])
            .endOf('day')
            .toISOString(),
          rewardsBreakup: rewards,
          status: values.status,
          isActive: values.isActive,
          terms: [...terms],
          minEntryFee: values.minEntryFee,
          maxEntryFee: values.maxEntryFee,
          countryCode: countryCode,
          extrainfo:
            values.extraInfo && values.extraInfo !== '{}'
              ? JSON.stringify(values.extraInfo)
              : JSON.stringify({}),
          contestCategory: values.contestCategory.includes('ALL')
            ? ['ALL']
            : values.contestCategory,
          includedMatchIds: includedMatchIds,
          excludedMatchIds: excludedMatchIds,
          includedLeagueIds: updateLeagueIds
        };

        if (
          this.props.editLeaderboardActionType &&
          this.props.editLeaderboardActionType === 'EDIT'
        ) {
          data['leaderBoardId'] = this.props.leaderboardDetails.leaderBoardId;
          this.props.actions.editLeaderboard(data).then(() => {
            if (this.props.editLeaderboardResponse) {
              if (this.props.editLeaderboardResponse.error) {
                message.error(
                  this.props.editLeaderboardResponse.error.message
                    ? this.props.editLeaderboardResponse.error.message
                    : 'Could not update leaderboard'
                );
              } else {
                this.props.history.push(
                  '/superteam-leaderboard/list-leaderboard'
                );
              }
            }
          });
        } else {
          this.props.actions.createLeaderboard(data).then(() => {
            if (this.props.createLeaderboardResponse) {
              if (this.props.createLeaderboardResponse.error) {
                message.error(
                  this.props.createLeaderboardResponse.error.message
                    ? this.props.createLeaderboardResponse.error.message
                    : 'Could not create leaderboard'
                );
              } else {
                this.props.history.push(
                  '/superteam-leaderboard/list-leaderboard'
                );
              }
            }
          });
        }
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
    const matchColumns = [
      {
        title: 'Match Id',
        key: 'seasonGameUid',
        dataIndex: 'seasonGameUid'
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Start Time',
        key: 'startTime',
        render: (text, record) => (
          <span>{moment(record.startTime).format('DD/MM/YYYY HH:mm')}</span>
        )
      },
      {
        title: 'League Name',
        dataIndex: 'leagueName',
        key: 'leagueName'
      },
      {
        title: 'Team1 Name',
        dataIndex: 'team1Name',
        key: 'team1Name'
      },
      {
        title: 'Team2 Name',
        dataIndex: 'team2Name',
        key: 'team2Name'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.excludeMatchHandler(record)}
              type={
                this.state.excludedIdList.includes(record.seasonGameUid)
                  ? 'primary'
                  : 'default'
              }
            >
              Exclude Match
            </Button>
          </span>
        )
      }
    ];

    const errors = {
      sportId: isFieldTouched('sportId') && getFieldError('sportId'),
      title: isFieldTouched('title') && getFieldError('title'),
      subtitle: isFieldTouched('subtitle') && getFieldError('subtitle'),
      leaderBoardType:
        isFieldTouched('leaderBoardType') && getFieldError('leaderBoardType'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray'),
      status: isFieldTouched('status') && getFieldError('status'),
      leagueId: isFieldTouched('leagueId') && getFieldError('leagueId'),
      terms: isFieldTouched('terms') && getFieldError('terms'),
      extraInfo: isFieldTouched('extraInfo') && getFieldError('extraInfo'),
      minEntryFee:
        isFieldTouched('minEntryFee') && getFieldError('minEntryFee'),
      maxEntryFee:
        isFieldTouched('maxEntryFee') && getFieldError('maxEntryFee'),
      contestGroup:
        isFieldTouched('contestGroup') && getFieldError('contestGroup'),
      contestCategory:
        isFieldTouched('contestCategory') && getFieldError('contestCategory')
    };

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Create Leaderboard| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card
            title={
              (this.props.editLeaderboardActionType &&
                this.props.editLeaderboardActionType) === 'EDIT'
                ? 'Edit Leaderboard'
                : 'Create Leaderboard'
            }
          >
            {/* <FormItem {...formItemLayout} label={<span>Country</span>}>
              {getFieldDecorator("countryCode", {
                rules: [
                  {
                    required: true,
                    type: "array",
                  },
                ],
              })(
                <CheckboxGroup
                  options={["ID", "IN", "US"]}
                  onChange={(e) => this.handleCountryChange(e)}
                />
              )}
            </FormItem> */}
            <FormItem {...formItemLayout} label={'Country Code'}>
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: 'IN'
              })(
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  onChange={e => this.handleCountryChange(e.target.value)}
                >
                  {CountryList}
                </Radio.Group>
              )}
            </FormItem>
            <React.Fragment>
              <FormItem
                validateStatus={errors.title ? 'error' : ''}
                help={errors.title || ''}
                {...formItemLayout}
                label={'Title'}
              >
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input title!',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={errors.subtitle ? 'error' : ''}
                help={errors.subtitle || ''}
                {...formItemLayout}
                label={'Sub Title'}
              >
                {getFieldDecorator('subtitle', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input sub title!',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>

              <FormItem {...formItemLayout} label={'Is Active'}>
                {getFieldDecorator('isActive', {
                  rules: [
                    {
                      required: true,
                      type: 'boolean',
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
                validateStatus={errors.leaderBoardType ? 'error' : ''}
                help={errors.leaderBoardType || ''}
                {...formItemLayout}
                label={'LeaderBoard Type'}
              >
                {getFieldDecorator('leaderBoardType', {
                  initialValue: 'POINT',
                  rules: [
                    {
                      required: true,
                      message: 'Please select leaderBoard type!'
                    }
                  ]
                })(
                  <Select
                    showSearch
                    style={{ width: '70%' }}
                    onSelect={e => this.selectLeaderboardType(e)}
                    placeholder="Select a leaderBoard type"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {LeaderBoardType}
                  </Select>
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.status ? 'error' : ''}
                help={errors.status || ''}
                {...formItemLayout}
                label={'Status'}
              >
                {getFieldDecorator('status', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select leaderboard status!'
                    }
                  ]
                })(
                  <Select
                    showSearch
                    style={{ width: '70%' }}
                    placeholder="Select a leaderboard status"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.editLeaderboardActionType &&
                    this.props.editLeaderboardActionType === 'EDIT'
                      ? LeaderBoardStatusEdit
                      : LeaderBoardStatusCreate}
                  </Select>
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.timeArray ? 'error' : ''}
                help={errors.timeArray || ''}
                {...formItemLayout}
                label={<span>Start Date and End Date</span>}
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
                    onChange={e => this.dateSelected(e)}
                    style={{ width: '70%' }}
                    allowClear="true"
                    format="YYYY-MM-DD"
                    placeholder={['Start Time', 'End Time']}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span>Select Game for leagues</span>}
              >
                {getFieldDecorator('gameCheckedValues', {
                  rules: [
                    {
                      required: true,
                      type: 'array',
                      message: 'Please select game!'
                    }
                  ],
                  initialValue: this.state.gameCheckedValues
                })(
                  <CheckboxGroup
                    options={[
                      'Cricket',
                      'Football',
                      'Kabaddi',
                      'Stock',
                      'Basketball',
                      'Baseball',
                      'Hockey'
                    ]}
                    onChange={e => this.updateLeagueOptions(e)}
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.leagueId ? 'error' : ''}
                help={errors.leagueId || ''}
                {...formItemLayout}
                label={'League'}
              >
                {getFieldDecorator(
                  'leagueValues',
                  {}
                )(
                  <Select
                    showSearch
                    mode="multiple"
                    onSelect={e => this.leagueSelected(e)}
                    onDeselect={e => this.leagueDeselected(e)}
                    style={{ width: '70%' }}
                    placeholder="Select a leaderboard league"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.leagueDetailOptions}
                  </Select>
                )}
              </FormItem>
              {this.state.leagueMatchListFetched && (
                <Card type="inner">
                  <Table
                    rowKey="matchRowKey"
                    bordered
                    pagination={false}
                    dataSource={this.state.leagueMatchList}
                    columns={matchColumns}
                    rowSelection={rowSelection}
                  />
                </Card>
              )}
              <FormItem
                {...formItemLayout}
                label={<span>Auto Update league</span>}
              >
                {getFieldDecorator('isAutoUpdate', {
                  initialValue: this.state.isAutoUpdate
                })(
                  <Switch
                    checked={this.state.isAutoUpdate}
                    onChange={e => this.setState({ isAutoUpdate: e })}
                  />
                )}
              </FormItem>
              {this.state.isAutoUpdate &&
                this.state.leagueDetails &&
                this.state.leagueDetails.length > 0 &&
                this.state.selectedLeagueIds &&
                this.state.selectedLeagueIds.length > 0 && (
                  <FormItem
                    validateStatus={errors.leagueId ? 'error' : ''}
                    help={errors.leagueId || ''}
                    {...formItemLayout}
                    label={'Auto Update League'}
                  >
                    {getFieldDecorator('autoUpdateIds', {
                      initialValue: this.state.updateLeagueIds
                    })(
                      <Select
                        showSearch
                        mode="multiple"
                        onChange={e => this.handleAutoUpdate(e)}
                        style={{ width: '70%' }}
                        placeholder="Select a leaderboard league"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.selectedLeagueIds.map(league => (
                          <Option
                            key={'SELECTED' + league.leagueSportId}
                            value={league.leagueSportId}
                          >
                            {this.getLeagueName(league.leagueSportId)}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                )}
              <FormItem
                validateStatus={errors.terms ? 'error' : ''}
                help={errors.terms || ''}
                {...formItemLayout}
                label={'Terms'}
              >
                {getFieldDecorator('terms', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input terms!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    placeholder="Please give terms seperated by #"
                    style={{ width: '70%' }}
                    rows={3}
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.minEntryFee ? 'error' : ''}
                help={errors.minEntryFee || ''}
                {...formItemLayout}
                label={'Min Entry Fee'}
              >
                {getFieldDecorator('minEntryFee', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input minEntryFee!',
                      whitespace: true
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.maxEntryFee ? 'error' : ''}
                help={errors.maxEntryFee || ''}
                {...formItemLayout}
                label={'Max Entry Fee'}
              >
                {getFieldDecorator('maxEntryFee', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input maxEntryFee!',
                      whitespace: true
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>

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
                    mode="multiple"
                    style={{ width: '70%' }}
                    placeholder="Select contest category"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.contestCategoryList}
                  </Select>
                )}
              </FormItem>
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
              <Row>
                {this.state.loadImage && (
                  <Col span={6} offset={6}>
                    <ImageUploader
                      callbackFromParent={this.getImageUrl}
                      header={'Leaderboard Image'}
                      previewImage={this.state.previewImage}
                      fileList={this.state.fileList}
                      isLoading={this.isImageLoading}
                    />
                  </Col>
                )}
              </Row>

              {/* REWARDS SECTION */}
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
              <Row type="flex" justify="center">
                <Col>
                  <Spin spinning={this.state.imageLoading}>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Spin>
                </Col>
              </Row>
            </React.Fragment>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    createLeaderboardResponse:
      state.superteamLeaderboard.createLeaderboardResponse,
    getSlAllLeagueListResponse:
      state.superteamLeaderboard.getSlAllLeagueListResponse,
    getSlAllMatchLeagueResponse:
      state.superteamLeaderboard.getSlAllMatchLeagueResponse,
    leaderboardDetails: state.superteamLeaderboard.leaderboardDetails,
    editLeaderboardActionType:
      state.superteamLeaderboard.editLeaderboardActionType,
    getLeaderboardMatchDetailResponse:
      state.superteamLeaderboard.getLeaderboardMatchDetailResponse,
    editLeaderboardResponse: state.superteamLeaderboard.editLeaderboardResponse,
    getAllContestCategoryResponse: state.football.getAllContestCategoryResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...superteamLeaderboardActions, ...footballActions },
      dispatch
    )
  };
}
const CreateLeaderboardForm = Form.create()(CreateLeaderboard);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateLeaderboardForm);
