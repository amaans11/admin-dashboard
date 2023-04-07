import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import TOKEN from '../../assets/ic_coins.png';
import CASH from '../../assets/ic_cash.png';
import _ from 'lodash';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Popconfirm,
  message,
  Modal,
  Pagination,
  Avatar,
  Input,
  InputNumber,
  Select,
  Form,
  Icon,
  Tag,
  Radio
} from 'antd';
import * as fantasyActions from '../../actions/FantasyActions';
import * as superteamLeaderboardActions from '../../actions/SuperteamLeaderboardActions';
import * as superteamCricketFeedActions from '../../actions/SuperteamCricketFeedActions';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import EditUserProfile from './EditUserProfile';
import EditPlayerScore from './EditPlayerScore';

const { Meta } = Card;
const Option = Select.Option;
const ContestStatus = ['ACTIVE', 'INACTIVE', 'CANCELLED'].map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));

class MatchCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContests: false,
      contestsList: [],
      showMatchDetailModal: false,
      showRosterModal: false,
      playerDetailsList: [],
      csvContestList: [],
      pageNum: 1,
      totalContests: 30,
      fetchRecurring: false,
      showTeamCountModal: false,
      totalRegisteredTeamcount: null,
      totalRegisteredTokenTeamcount: null,
      totalRegisteredCashTeamcount: null,
      totalRegisteredFreeTeamcount: null,
      totalRegisteredUGCTeamcount: null,
      showPlayerStat: false,
      csvData: null,
      playerStat: {},
      selectedRowKeys: [],
      selectedRowKeysContest: [],
      cancelContestModal: false,
      isUserProfileEdit: false,
      showMultipleSelectionModal: false,
      selectedMatches: [],
      showContestCountModal: false,
      showRefundMatchModal: false,
      searchContestFlag: false,
      showDownloadModal: false,
      leaderboardData: [],
      showPlayerScoreModal: false,
      showPlayerScoreEditModal: false,
      searchName: '',
      showCreateDefaultContestModal: false,
      selectedMasterContestType: [],
      showPlayerScoreDetailModal: false,
      playerScoreDetailList: [],
      showPlayerPointsModal: false,
      playerScorePointsList: [],
      showMultiContestDetailModal: false,
      newContestStatus: '',
      showPasswordField: false,
      isAdmin: false,
      showCancelMatchModal: false,
      matchNotificationsFetched: false,
      showMatchNotificationModal: false,
      showEditNotificationModal: false,
      segmentOptionList: [],
      showSendManualModal: false,
      mobileNumbers: '',
      showCreateMasterContestModal: false,
      showUpdateAllContestModal: false,
      updateAllContestStatus: '',
      showMoneyDetailsModal: false,
      moneyDetails: {},
      searchContestByIdFlag: false,
      contestDetail: {},
      showContestDetailModal: false,
      moneyDetailType: 'MATCH_LEVEL',
      mlPrice: '',
      showFantasyAssistantModel: false,
      isFantasyAssistant: true,
      fantasyAssistantMatchId: '',
      fantasyAssistantData: {}
    };
    this.fetchContests = this.fetchContests.bind(this);
    this.cloneEditContest = this.cloneEditContest.bind(this);
    this.deleteContest = this.deleteContest.bind(this);
    this.activateContest = this.activateContest.bind(this);
    this.editMatchConfig = this.editMatchConfig.bind(this);
    this.showMatchDetails = this.showMatchDetails.bind(this);
    this.activateMatch = this.activateMatch.bind(this);
    this.deActivateMatch = this.deActivateMatch.bind(this);
    this.showRoster = this.showRoster.bind(this);
    this.hideContests = this.hideContests.bind(this);
    this.editMatchDetails = this.editMatchDetails.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.showCount = this.showCount.bind(this);
    this.getAllContests = this.getAllContests.bind(this);
    this.updateMatchDetails = this.updateMatchDetails.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.updatePlayingStatus = this.updatePlayingStatus.bind(this);
    this.cancelContest = this.cancelContest.bind(this);
    this.updateUserProfileModal = this.updateUserProfileModal.bind(this);
    this.cloneMultpleContests = this.cloneMultpleContests.bind(this);
    this.handleMultipleSelect = this.handleMultipleSelect.bind(this);
    this.showContestCount = this.showContestCount.bind(this);
    this.refundMatch = this.refundMatch.bind(this);
    this.extendMatch = this.extendMatch.bind(this);
    this.searchContest = this.searchContest.bind(this);
    this.searchContestCall = this.searchContestCall.bind(this);
    this.downloadLeaderboard = this.downloadLeaderboard.bind(this);
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this);
    this.openPlayScoreModal = this.openPlayScoreModal.bind(this);
    this.initiateWinnings = this.initiateWinnings.bind(this);
    this.openPlayerScoreEditModal = this.openPlayerScoreEditModal.bind(this);
    this.searchTable = this.searchTable.bind(this);
    this.getAllMasterContestType = this.getAllMasterContestType.bind(this);
    this.closePlayerPointsModal = this.closePlayerPointsModal.bind(this);
    this.getAllSegmentType = this.getAllSegmentType.bind(this);
    this.handleSubmitFantasyAssistant = this.handleSubmitFantasyAssistant.bind(
      this
    );
  }

  componentDidMount() {
    if (
      this.props.currentUser.user_role.includes('SUPER_ADMIN') ||
      this.props.currentUser.user_role.includes('FANTASY_ADMIN')
    ) {
      this.setState({ isAdmin: true });
    } else {
      this.setState({ isAdmin: false });
    }
  }

  isShowEditContestButton(record) {
    if (
      (record.contestType && record.contestType === 'POOLED') ||
      (record.contestType && record.contestType === 'UGC')
    ) {
      return false;
    } else {
      return true;
    }
  }

  searchTable(e) {
    let searchString = e.target.value;
    let playerDetailMasterList = [...this.state.playerDetailsMasterList];
    let displayList = [];
    _.forEach(playerDetailMasterList, function(item) {
      if (
        (item.name &&
          item.name.toLowerCase().includes(searchString.toLowerCase())) ||
        (item.firstName &&
          item.firstName.toLowerCase().includes(searchString.toLowerCase())) ||
        (item.lastName &&
          item.lastName.toLowerCase().includes(searchString.toLowerCase())) ||
        (item.fullName &&
          item.fullName.toLowerCase().includes(searchString.toLowerCase()))
      ) {
        displayList.push(item);
      }
    });
    this.setState({ playerDetailsList: [...displayList] });
  }

  openPlayScoreModal(record) {
    this.setState({ playerScoreSeasonGameUid: record.seasonGameUid });
    let data = {
      seasonGameUid: record.seasonGameUid
    };
    this.props.actions.getMatchPlayerScore(data).then(() => {
      if (
        this.props.getMatchPlayerScoreResponse &&
        this.props.getMatchPlayerScoreResponse.matchPlayerScores
      ) {
        let countOfPointPlayer = this.props.getMatchPlayerScoreResponse.matchPlayerScores.filter(
          function(user) {
            return user.score;
          }
        ).length;
        this.setState({
          playerScoreList: [
            ...this.props.getMatchPlayerScoreResponse.matchPlayerScores
          ],
          showPlayerScoreModal: true,
          countOfPointPlayer: countOfPointPlayer
        });
      } else {
        if (
          this.props.getMatchPlayerScoreResponse &&
          this.props.getMatchPlayerScoreResponse.error
        ) {
          message.error(this.props.getMatchPlayerScoreResponse.error.message);
        } else {
          message.info('Player score list is empty');
        }
      }
    });
  }

  initiateWinnings(record) {
    let data = {
      seasonGameUid: record.seasonGameUid
    };
    this.props.actions.initiatePrizeDistribution(data).then(() => {
      if (
        this.props.initiatePrizeDistributionResponse &&
        this.props.initiatePrizeDistributionResponse.error
      ) {
        if (this.props.initiatePrizeDistributionResponse.error.message) {
          message.error(
            this.props.initiatePrizeDistributionResponse.error.message
          );
        } else {
          message.error('Could not initiate prize distribution');
        }
      } else if (
        this.props.initiatePrizeDistributionResponse &&
        !this.props.initiatePrizeDistributionResponse.error
      ) {
        message
          .success('Prize Distribution initialized successfully', 1.5)
          .then(() => {
            window.location.reload();
          });
      }
    });
  }

  openPlayerScoreEditModal(record) {
    this.setState({
      selectedPlayerScore: { ...record },
      showPlayerScoreEditModal: true
    });
  }

  fetchLeaderboard() {
    let data = {
      contestId: this.state.leaderboardDownloadContestId,
      limit: this.state.limit ? this.state.limit : 10,
      matchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.getLeaderboard(data).then(() => {
      if (
        this.props.fantasy.getLeaderboardResponse &&
        this.props.fantasy.getLeaderboardResponse
          .getFullLeaderBoardDetailsDashbaord
      ) {
        this.setState({
          leaderboardData: [
            ...this.props.fantasy.getLeaderboardResponse
              .getFullLeaderBoardDetailsDashbaord
          ]
        });
      }
    });
  }

  downloadLeaderboard(record) {
    this.setState({
      leaderboardDownloadContestId: record.id,
      showDownloadModal: true
    });
  }

  searchContest() {
    this.setState({ searchContestFlag: true });
  }

  searchContestCall(value) {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      contestName: value
    };
    this.props.actions.searchContest(data).then(() => {
      if (this.props.contests && this.props.contests.contestDetailDashboard) {
        this.setState({
          contestsList: this.props.contests.contestDetailDashboard,
          totalContests: this.props.contests.totalContest,
          showContests: true
        });
      } else {
        this.setState({ showContests: true });
      }
    });
  }

  refundMatch() {
    this.setState({ showRefundMatchModal: true });
  }

  refundMatchCall() {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      password: this.state.password
    };
    // alert(JSON.stringify(data));
    this.props.actions.refundMatch(data).then(() => {
      if (
        this.props.refundMatchResponse &&
        this.props.refundMatchResponse.error
      ) {
        message.error(this.props.refundMatchResponse.error.message);
        this.setState({ password: '' });
      } else if (this.props.refundMatchResponse) {
        message.info('Match Cancelled');
        this.setState({ password: '' });
      } else {
        message.error('Something went wrong');
        this.setState({ password: '' });
      }
    });
  }

  cancelMatch() {
    this.setState({ showCancelMatchModal: true });
  }

  moveToUpcoming() {
    let data = {
      seasonGameUid: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.moveMatchFromLiveToUpcoming(data).then(() => {
      if (
        this.props.moveMatchFromLiveToUpcomingResponse &&
        this.props.moveMatchFromLiveToUpcomingResponse.error
      ) {
        message.error(
          this.props.moveMatchFromLiveToUpcomingResponse.error.message
            ? this.props.moveMatchFromLiveToUpcomingResponse.error.message
            : 'Could not move the match'
        );
      } else {
        message.info('Match moved to upcoming');
      }
    });
  }

  cancelMatchCall() {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      password: this.state.password
    };
    // alert(JSON.stringify(data));
    this.props.actions.cancelMatch(data).then(() => {
      if (
        this.props.cancelMatchResponse &&
        this.props.cancelMatchResponse.error
      ) {
        message.error(
          this.props.cancelMatchResponse.error.message
            ? this.props.cancelMatchResponse.error.message
            : 'Could not cancel the match'
        );
        this.setState({ password: '' });
      } else {
        message.info('Match Cancelled');
        this.setState({ password: '' });
      }
    });
  }

  handleMultipleSelect(value) {
    this.setState({ selectedMatches: [...value] });
  }

  cloneMultpleContests() {
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
    });
    this.setState({ matchList: list, showMultipleSelectionModal: true });
  }

  openMultiContestDetailModal() {
    this.setState({ showMultiContestDetailModal: true });
  }

  closeMultiContestDetailModal() {
    this.setState({
      showMultiContestDetailModal: false,
      newContestStatus: '',
      multiPassword: ''
    });
  }

  openCreateMasterContestModal() {
    this.getAllMasterContestType();
    this.setState({
      showCreateMasterContestModal: true
    });
  }

  closeCreateMasterContestModal() {
    this.setState({
      showCreateMasterContestModal: false
    });
  }

  saveCreateMasterContestModal() {
    let selectedMasterContestTypeSingle = this.state
      .selectedMasterContestTypeSingle;
    if (!selectedMasterContestTypeSingle) {
      message.error('Please select master type');
      return;
    }
    let data = {
      currentMatchId: this.props.matchDetail.seasonGameUid,
      contestIds: [...this.state.selectedRowKeysContest],
      masterType: selectedMasterContestTypeSingle
    };

    this.props.actions.createMasterContestFromMatchContest(data).then(() => {
      if (this.props.createMasterContestFromMatchContestResponse) {
        if (this.props.createMasterContestFromMatchContestResponse.error) {
          message.error(
            this.props.createMasterContestFromMatchContestResponse.error.message
              ? this.props.createMasterContestFromMatchContestResponse.error
                  .message
              : 'Could not create default contests'
          );
        } else {
          message
            .success('Successfully created default contests', 1)
            .then(() => {
              this.setState({
                showCreateMasterContestModal: false,
                selectedMasterContestTypeSingle: null
              });
            });
        }
      }
    });
  }

  selectNewContestStatus(value) {
    let showPasswordField = false;
    if (value === 'CANCELLED') {
      showPasswordField = true;
    }
    this.setState({
      newContestStatus: value,
      showPasswordField: showPasswordField
    });
  }

  changeMultiPassword(value) {
    this.setState({
      multiPassword: value
    });
  }

  updateMultiContestDetail() {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      contestIds: [...this.state.selectedRowKeysContest],
      contestStatus: this.state.newContestStatus,
      password: this.state.multiPassword
    };
    this.props.actions.updateMultiContestDetail(data).then(() => {
      if (
        this.props.updateMultiContestDetailResponse &&
        this.props.updateMultiContestDetailResponse.error
      ) {
        message.error(
          this.props.updateMultiContestDetailResponse.error.message
            ? this.props.updateMultiContestDetailResponse.error.message
            : 'Could not update multiple contests'
        );
      } else {
        message.success('Contests updated successfully');
        this.setState({
          showMultiContestDetailModal: false,
          multiPassword: ''
        });
        window.location.reload();
      }
    });
  }

  updateUserProfileModal() {
    let data = {
      id: this.state.playerStat.id
    };
    this.getUserProfile(data);
    this.setState({ isUserProfileEdit: false });
  }

  changePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  changeLimit = e => {
    this.setState({
      limit: e.target.value
    });
  };

  cancelContest(record) {
    this.setState({ cancelContestModal: true, cancelContestId: record.id });
  }

  createMultipleContests() {
    let data = {
      matchIds: [...this.state.selectedMatches],
      contestIds: [...this.state.selectedRowKeysContest],
      currentMatchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.createMultipleMatchContests(data).then(() => {
      if (this.props.fantasy.createMultipleMatchContestResponse) {
        message.success('Multiple contests created successfully');
        window.location.reload();
      } else {
        message.success('Could not create multiple contests');
      }
    });
  }

  cancelContestCall() {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      contestId: this.state.cancelContestId,
      password: this.state.password
    };
    this.props.actions.refundContest(data).then(() => {
      if (
        this.props.fantasy.refundContestResponse &&
        this.props.fantasy.refundContestResponse.error
      ) {
        message.error(
          this.props.fantasy.refundContestResponse.error.message
            ? this.props.fantasy.refundContestResponse.error.message
            : 'Could not process refund contest action'
        );
      } else {
        message.success('Processed the request');
      }
      this.setState({ password: '' });
    });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
    let parentArray = [...this.state.playerDetailsList];
    let nonPlayingListRaw = _.difference(parentArray, selectedRows);
    let playingList = [...selectedRowKeys];
    let nonPlayingList = nonPlayingListRaw.map(item => item.id);
    this.setState({
      playingList,
      nonPlayingList
    });
  };

  onSelectContestChange = (selectedRowKeysContest, selectedRowsContest) => {
    this.setState({ selectedRowKeysContest });
  };

  updatePlayingStatus() {
    if (this.state.playingList && this.state.playingList.length > 0) {
      let data = {
        matchId: this.props.matchDetail.seasonGameUid,
        playingList: this.state.playingList,
        nonPlayingList: this.state.nonPlayingList
      };
      this.props.actions.updatePlayingStatus(data).then(() => {
        if (this.props.fantasy.updatePlayingStatusResponse) {
          console.log('--->', this.props.fantasy.updatePlayingStatusResponse);
        } else {
          console.log('asdasd');
        }
      });
    } else {
      message.error(
        'Playing list is empty, hence can not proceed with the request'
      );
      return;
    }
  }

  markAllAsNonPlaying() {
    let parentArray = [...this.state.playerDetailsList];
    let playingList = [];
    let nonPlayingList = parentArray.map(item => item.id);
    this.setState(
      {
        playingList,
        nonPlayingList
      },
      () => {
        let data = {
          matchId: this.props.matchDetail.seasonGameUid,
          playingList: this.state.playingList,
          nonPlayingList: this.state.nonPlayingList
        };
        this.props.actions.updatePlayingStatus(data).then(() => {
          if (
            this.props.fantasy.updatePlayingStatusResponse &&
            this.props.fantasy.updatePlayingStatusResponse.error
          ) {
            message.error(
              this.props.fantasy.updatePlayingStatusResponse.error.message
                ? this.props.fantasy.updatePlayingStatusResponse.error.message
                : 'Could not process the request'
            );
          } else {
            message.success('Request successfully processed');
            this.setState({ showRosterModal: false });
          }
        });
      }
    );
  }

  getUserProfile(record) {
    let data = {
      playerId: record.id,
      matchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.getPlayerStats(data).then(() => {
      if (this.props.fantasy && this.props.fantasy.getPlayerStatsResponse) {
        if (this.props.fantasy.getPlayerStatsResponse.error) {
          message.error('Unable to fetch players stats');
        } else {
          let result = this.props.fantasy.getPlayerStatsResponse;
          let playerStat = {
            id: record.id,
            title: result.title,
            teamName: result.teamName,
            totalPoint: result.totalPoint ? result.totalPoint : 0,
            playingRole: result.playingRole ? result.playingRole : '',
            battingStyle: result.battingStyle ? result.battingStyle : '',
            bowlingStyle: result.bowlingStyle ? result.bowlingStyle : '',
            playerStatHistory: result.playerStatHistory
              ? [...result.playerStatHistory]
              : [],
            playerImage: result.playerImage ? result.playerImage : ''
          };
          this.setState({
            playerStat: { ...playerStat },
            showPlayerStat: true
          });
        }
      }
    });
  }

  updateMatchDetails() {
    let matchTime = moment(this.props.matchDetail.startTime);
    let startTime = matchTime.subtract(3, 'd').toDate();
    let endTime = matchTime.add(6, 'd').toDate();
    let data = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      leagueId: this.props.matchDetail.leagueId
        ? this.props.matchDetail.leagueId
        : '',
      matchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.updateMatchDetails(data).then(() => {
      if (this.props.fantasy && this.props.fantasy.updateMatchDetailsResponse) {
        if (this.props.fantasy.updateMatchDetailsResponse.error) {
          message.error('Unable to update the match details');
        } else {
          window.location.reload();
        }
      }
    });
  }

  getAllContests() {
    let data = {
      seasonGameUId: this.props.matchDetail.seasonGameUid,
      isRecuring: false,
      pageSize: 100000,
      pageOffset: 1,
      isAllContest: true
    };

    this.props.actions.getMatchContests(data).then(() => {
      if (this.props.contests && this.props.contests.contestDetailDashboard) {
        // CSV Download
        let rawArray = [...this.props.contests.contestDetailDashboard];
        let csvContestList = [];
        rawArray.forEach(el => {
          let item = { ...el };
          item['rewardTotalCash'] = item.rewards.totalCash
            ? item.rewards.totalCash
            : 0;
          item['rewardTotalWinners'] = item.rewards.totalWinners
            ? item.rewards.totalWinners
            : 0;
          delete item.rewards;
          delete item.extraInfo;
          delete item.dynamicRewardsConfig;
          delete item.chatChannelId;
          csvContestList.push(item);
        });
        this.setState({
          csvData: csvContestList
        });
      }
    });
  }

  showCount() {
    let data = {
      seasonGameUid: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.getRegisteredCount(data).then(() => {
      if (
        this.props.fantasy &&
        this.props.fantasy.getRegisteredCountResponse.error
      ) {
        message.error(
          this.props.fantasy.getRegisteredCountResponse.error.message
        );
      } else if (
        this.props.fantasy &&
        this.props.fantasy.getRegisteredCountResponse
      ) {
        this.setState({
          totalRegisteredTeamcount: this.props.fantasy
            .getRegisteredCountResponse.totalRegisteredTeamcount
            ? this.props.fantasy.getRegisteredCountResponse
                .totalRegisteredTeamcount
            : 0,
          totalRegisteredTokenTeamcount: this.props.fantasy
            .getRegisteredCountResponse.totalRegisteredTokenTeamcount
            ? this.props.fantasy.getRegisteredCountResponse
                .totalRegisteredTokenTeamcount
            : 0,
          totalRegisteredCashTeamcount: this.props.fantasy
            .getRegisteredCountResponse.totalRegisteredCashTeamcount
            ? this.props.fantasy.getRegisteredCountResponse
                .totalRegisteredCashTeamcount
            : 0,
          totalRegisteredFreeTeamcount: this.props.fantasy
            .getRegisteredCountResponse.totalRegisteredFreeTeamcount
            ? this.props.fantasy.getRegisteredCountResponse
                .totalRegisteredFreeTeamcount
            : 0,
          totalRegisteredUGCTeamcount: this.props.fantasy
            .getRegisteredCountResponse.totalRegisteredUGCTeamcount
            ? this.props.fantasy.getRegisteredCountResponse
                .totalRegisteredUGCTeamcount
            : 0,
          totalRegisteredChallengeTeamcount: this.props.fantasy
            .getRegisteredCountResponse.totalRegisteredChallengeTeamcount
            ? this.props.fantasy.getRegisteredCountResponse
                .totalRegisteredChallengeTeamcount
            : 0
        });
      }
    });
    this.setState({
      showTeamCountModal: true
    });
  }

  showContestCount() {
    let data = {
      seasonGameUid: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.getContestCount(data).then(() => {
      if (
        this.props.fantasy &&
        this.props.fantasy.getContestCountResponse.error
      ) {
        message.error(this.props.fantasy.getContestCountResponse.error.message);
      } else if (
        this.props.fantasy &&
        this.props.fantasy.getContestCountResponse
      ) {
        this.setState({
          totalCashContestCount: this.props.fantasy.getContestCountResponse
            .totalCashContestCount
            ? {
                ...this.props.fantasy.getContestCountResponse
                  .totalCashContestCount
              }
            : {},
          totalContestCount: this.props.fantasy.getContestCountResponse
            .totalContestCount
            ? {
                ...this.props.fantasy.getContestCountResponse.totalContestCount
              }
            : {},
          totalFreeContestCount: this.props.fantasy.getContestCountResponse
            .totalFreeContestCount
            ? {
                ...this.props.fantasy.getContestCountResponse
                  .totalFreeContestCount
              }
            : {},
          totalUGCContestCount: this.props.fantasy.getContestCountResponse
            .totalUGCContestCount
            ? {
                ...this.props.fantasy.getContestCountResponse
                  .totalUGCContestCount
              }
            : {},
          groupContestCount:
            this.props.fantasy.getContestCountResponse.groupContestCount &&
            this.props.fantasy.getContestCountResponse.groupContestCount
              .length > 0
              ? [
                  ...this.props.fantasy.getContestCountResponse
                    .groupContestCount
                ]
              : []
        });
      }
    });
    this.setState({
      showContestCountModal: true
    });
  }

  onPageChange(page, pageSize) {
    this.setState({ pageNum: page });
    this.fetchContests(
      page,
      this.state.fetchRecurring,
      this.state.isAllContest,
      this.state.isFiltered1V1,
      this.state.isUGC,
      this.state.isPAJ,
      this.state.isNotNGC
    );
  }

  fetchContests(
    page,
    flag,
    isAllContest,
    isFiltered1V1,
    isUGC,
    isPAJ,
    isNotNGC
  ) {
    this.setState({
      fetchRecurring: flag,
      contestsList: [],
      isAllContest: isAllContest,
      isFiltered1V1: isFiltered1V1,
      isUGC: isUGC,
      isPAJ: isPAJ,
      isNotNGC: isNotNGC
    });
    let data = {
      seasonGameUId: this.props.matchDetail.seasonGameUid,
      isRecuring: flag,
      pageSize: 30,
      pageOffset: page,
      isAllContest: isAllContest ? isAllContest : false,
      isFiltered1V1: isFiltered1V1 ? isFiltered1V1 : false,
      isUGC: isUGC ? isUGC : false,
      isPAJ: isPAJ ? isPAJ : false,
      isNotNGC: isNotNGC ? isNotNGC : false
    };
    this.props.actions.getMatchContests(data).then(() => {
      if (this.props.contests && this.props.contests.contestDetailDashboard) {
        this.setState({
          contestsList: this.props.contests.contestDetailDashboard,
          totalContests: this.props.contests.totalContest,
          showContests: true
        });
      } else {
        this.setState({ showContests: true });
      }
    });
  }

  hideContests() {
    this.setState({ showContests: false });
  }

  cloneEditContest(record, actionType) {
    this.props.actions.cloneEditContest(record, actionType);
    // this.props.history.push(`fantasy/create-contest`);
    this.props.history.push('create-contest');
  }

  deleteContest(record) {
    let data = {
      contestId: record.id,
      matchId: record.seasonGameUid
    };
    this.props.actions.deleteMatchContest(data).then(() => {
      if (
        this.props.fantasy.deleteMatchContestResponse &&
        this.props.fantasy.deleteMatchContestResponse.error
      ) {
        if (this.props.fantasy.deleteMatchContestResponse.error.message) {
          message.error(
            this.props.fantasy.deleteMatchContestResponse.error.message
          );
          return;
        } else {
          message.error('Errored out with unknown response from backend');
          return;
        }
      } else {
        window.location.reload();
      }
    });
  }

  activateContest(record) {
    let data = {
      contestId: record.id,
      matchId: record.seasonGameUid
    };
    this.props.actions.activateMatchContest(data).then(() => {
      if (
        this.props.fantasy.activateMatchContestResponse &&
        this.props.fantasy.activateMatchContestResponse.error
      ) {
        if (this.props.fantasy.activateMatchContestResponse.error.message) {
          message.error(
            this.props.fantasy.activateMatchContestResponse.error.message
          );
          return;
        } else {
          message.error('Errored out with unknown response from backend');
          return;
        }
      } else {
        window.location.reload();
      }
    });
  }

  editMatchConfig() {
    this.props.actions.editMatchConfig(
      this.props.matchDetail,
      this.props.tabType
    );
    this.props.history.push('create-match');
  }

  editMatchDetails() {
    this.props.actions.editMatchDetails(this.props.matchDetail);
    this.props.history.push('edit-match-detail');
  }
  extendMatch() {
    this.props.actions.editMatchDetails(this.props.matchDetail);
    this.props.history.push('extend-match-detail');
  }

  activateMatch() {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.activateMatchConfig(data).then(() => {
      if (
        this.props.fantasy.activateMatchConfigResponse &&
        this.props.fantasy.activateMatchConfigResponse.error
      ) {
        if (this.props.fantasy.activateMatchConfigResponse.error.message) {
          message.error(
            this.props.fantasy.activateMatchConfigResponse.error.message
          );
          return;
        } else {
          message.error('Errored out with unknown response from backend');
          return;
        }
      } else {
        window.location.reload();
      }
    });
  }
  deActivateMatch() {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.deActivateMatchConfig(data).then(() => {
      if (
        this.props.fantasy.deActivateMatchConfigResponse &&
        this.props.fantasy.deActivateMatchConfigResponse.error
      ) {
        if (this.props.fantasy.deActivateMatchConfigResponse.error.message) {
          message.error(
            this.props.fantasy.deActivateMatchConfigResponse.error.message
          );
          return;
        } else {
          message.error('Could not deactivate the config');
          return;
        }
      } else {
        window.location.reload();
      }
    });
  }

  showConfig(record) {
    this.setState({
      showConfigModal: true,
      configDetails: JSON.stringify(record)
    });
  }

  showMatchDetails() {
    var text = JSON.stringify(this.props.matchDetail);
    var result = _.replace(text, new RegExp(',', 'g'), '\n');
    this.setState({
      showMatchDetailModal: true,
      matchDetail: result
    });
  }

  showRoster() {
    let data = {
      seasonGameUid: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.getMatchRoster(data).then(() => {
      if (
        this.props.fantasy.matchRoster &&
        this.props.fantasy.matchRoster.playerDetailsList
      ) {
        let playingList = [];
        this.setState({
          playerDetailsList: this.props.fantasy.matchRoster.playerDetailsList,
          playerDetailsMasterList: this.props.fantasy.matchRoster
            .playerDetailsList
        });
        this.props.fantasy.matchRoster.playerDetailsList.forEach(item => {
          if (item.isPlaying) {
            playingList.push(item.id);
          }
        });
        this.setState({ selectedRowKeys: [...playingList] });
      } else {
        message.error('Player Details not found');
      }
    });

    this.setState({
      showRosterModal: true
    });
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchName: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchName: '' });
  };

  createDefaultContests() {
    this.getAllMasterContestType();
    this.setState({ showCreateDefaultContestModal: true });
  }

  getAllMasterContestType() {
    this.props.actions.getAllMasterContestType().then(() => {
      if (
        this.props.getAllMasterContestTypeResponse &&
        this.props.getAllMasterContestTypeResponse.masterType &&
        this.props.getAllMasterContestTypeResponse.masterType.length > 0
      ) {
        let masterContestTypeList = [];
        this.props.getAllMasterContestTypeResponse.masterType.map(item => {
          masterContestTypeList.push(
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        });
        this.setState({ masterContestTypeList });
      } else {
        message.info('No master contest type found');
      }
    });
  }

  selectMasterContestType(value) {
    this.setState({ selectedMasterContestType: [...value] });
  }

  selectMasterContestTypeSingle(value) {
    this.setState({ selectedMasterContestTypeSingle: value });
  }

  openPlayerScoreDetailModal(record) {
    let data = {
      matchId: record.seasonGameUid
    };
    this.props.actions.getPlayerScoreDetail(data).then(() => {
      if (
        this.props.getPlayerScoreDetailResponse &&
        this.props.getPlayerScoreDetailResponse.playerScoreDetails &&
        this.props.getPlayerScoreDetailResponse.playerScoreDetails.length > 0
      ) {
        this.setState({
          playerScoreDetailList: [
            ...this.props.getPlayerScoreDetailResponse.playerScoreDetails
          ],
          showPlayerScoreDetailModal: true
        });
      } else {
        if (
          this.props.getPlayerScoreDetailResponse &&
          this.props.getPlayerScoreDetailResponse.error
        ) {
          message.error(this.props.getPlayerScoreDetailResponse.error.message);
        } else {
          message.info('Player score list is empty');
        }
      }
    });
  }

  closePlayerScoreDetailModal() {
    this.setState({
      playerScoreDetailList: [],
      showPlayerScoreDetailModal: false
    });
  }

  showPlayerScorePoints(record, type) {
    let pointsPlayerName = record.name;
    let playerScorePointsList = [];
    if (type == 'admin') {
      playerScorePointsList =
        record.playerScorePointDetails &&
        record.playerScorePointDetails.length > 0
          ? [...record.playerScorePointDetails]
          : [];
      this.setState({
        playerScorePointsList: [...playerScorePointsList],
        showPlayerPointsModal: true,
        pointsPlayerName: pointsPlayerName,
        editPlayerScoreDetailPlayerId: record.playerUid
      });
    } else {
      playerScorePointsList =
        record.dreamPlayerScorePointDetails &&
        record.dreamPlayerScorePointDetails.length > 0
          ? [...record.dreamPlayerScorePointDetails]
          : [];
      this.setState({
        playerScorePointsList: [...playerScorePointsList],
        showPlayerPointsModal: true,
        pointsPlayerName: pointsPlayerName,
        editPlayerScoreDetailPlayerId: record.playerUid
      });
    }
  }

  closePlayerPointsModal() {
    this.setState({
      playerScorePointsList: [],
      pointsPlayerName: '',
      showPlayerPointsModal: false,
      editPlayerScoreDetailPlayerId: null
    });
  }

  recurrenceChanged(newValue, record) {
    let playerScorePointsList = [...this.state.playerScorePointsList];
    let editIndex = _.findIndex(playerScorePointsList, function(item) {
      return item.eventName === record.eventName;
    });
    playerScorePointsList[editIndex].recurrence = newValue;
    this.setState({ playerScorePointsList: [...playerScorePointsList] });
  }

  pointsChanged(newValue, record) {
    let playerScorePointsList = [...this.state.playerScorePointsList];
    let editIndex = _.findIndex(playerScorePointsList, function(item) {
      return item.eventName === record.eventName;
    });
    playerScorePointsList[editIndex].points = newValue;
    this.setState({ playerScorePointsList: [...playerScorePointsList] });
  }

  savePlayerPoints() {
    let score = 0;
    this.state.playerScorePointsList.forEach(function(item) {
      if (item.points) {
        score = score + item.points;
      }
    });
    let getPlayerScoreDetail = {
      playerId: this.state.editPlayerScoreDetailPlayerId,
      playerScorePointDetails: [...this.state.playerScorePointsList],
      score: score
    };
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      getPlayerScoreDetail: { ...getPlayerScoreDetail }
    };
    this.props.actions.updatePlayerScoreDetail(data).then(() => {
      if (
        this.props.updatePlayerScoreDetailResponse &&
        this.props.updatePlayerScoreDetailResponse.error
      ) {
        message.error(
          this.props.updatePlayerScoreDetailResponse.error.message
            ? this.props.updatePlayerScoreDetailResponse.error.message
            : 'could not update the player points'
        );
      } else {
        let getPlayerScoreData = {
          seasonGameUid: this.state.playerScoreSeasonGameUid
        };
        this.props.actions.getMatchPlayerScore(getPlayerScoreData).then(() => {
          if (
            this.props.getMatchPlayerScoreResponse &&
            this.props.getMatchPlayerScoreResponse.matchPlayerScores
          ) {
            this.setState({
              playerScoreList: [
                ...this.props.getMatchPlayerScoreResponse.matchPlayerScores
              ]
            });
          } else {
            if (
              this.props.getMatchPlayerScoreResponse &&
              this.props.getMatchPlayerScoreResponse.error
            ) {
              message.error(
                this.props.getMatchPlayerScoreResponse.error.message
              );
            } else {
              message.info('Player score list is empty');
            }
          }
          message.success('Successfully updated the player points details');
          this.closePlayerPointsModal();
        });
      }
    });
  }

  getAllSegmentType() {
    this.props.actions.getAllSegmentType().then(() => {
      if (
        this.props.getAllSegmentTypeResponse &&
        this.props.getAllSegmentTypeResponse.masterType &&
        this.props.getAllSegmentTypeResponse.masterType.length > 0
      ) {
        let segmentOptionList = [];
        this.props.getAllSegmentTypeResponse.masterType.map(item => {
          segmentOptionList.push(
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        });
        this.setState({ segmentOptionList });
      } else {
        message.info('No master contest type found');
      }
    });
  }

  updateLatestScoreFromFeed(matchDetail) {
    let data = {
      seasonGameUid: matchDetail.seasonGameUid
    };
    this.props.actions.updateLatestScoreFromFeed(data).then(() => {
      if (
        this.props.updateLatestScoreFromFeedResponse &&
        this.props.updateLatestScoreFromFeedResponse.error
      ) {
        message.error(
          this.props.updateLatestScoreFromFeedResponse.error.message
            ? this.props.updateLatestScoreFromFeedResponse.error.message
            : 'Could not update'
        );
      } else {
        message.success('Successfully fetch latest score from the feed', 1.5);
      }
    });
  }

  getNotifications(matchDetail) {
    this.getAllSegmentType();
    let data = {
      seasonGameUid: matchDetail.seasonGameUid
    };
    this.props.actions.getMatchNotificationDetail(data).then(() => {
      if (
        this.props.getMatchNotificationDetailResponse &&
        this.props.getMatchNotificationDetailResponse.matchNotifications &&
        this.props.getMatchNotificationDetailResponse.matchNotifications
          .length > 0
      ) {
        this.setState({
          matchNotifications: [
            ...this.props.getMatchNotificationDetailResponse.matchNotifications
          ],
          matchNotificationsFetched: true,
          showMatchNotificationModal: true
        });
      } else {
        message.info('No notifications detail found');
      }
    });
  }

  closeMatchNotificationModal() {
    this.setState({
      showMatchNotificationModal: false
    });
  }

  editNotification(record) {
    this.setState({
      selectedNotification: { ...record },
      showEditNotificationModal: true
    });
  }

  closeEditNotificatioModal() {
    this.setState({
      showEditNotificationModal: false,
      selectedNotification: {}
    });
  }

  setSegment(value) {
    let selectedNotification = { ...this.state.selectedNotification };
    selectedNotification.segmentType = value;
    this.setState({ selectedNotification: { ...selectedNotification } });
  }
  setNotificationTitle(value) {
    let selectedNotification = { ...this.state.selectedNotification };
    selectedNotification.notificationTitle = value;
    this.setState({ selectedNotification: { ...selectedNotification } });
  }
  setNotificationBody(value) {
    let selectedNotification = { ...this.state.selectedNotification };
    selectedNotification.notificationBody = value;
    this.setState({ selectedNotification: { ...selectedNotification } });
  }

  saveNotificationChanges() {
    let selectedNotification = { ...this.state.selectedNotification };
    let data = {
      matchNotificationId: selectedNotification.matchNotificationId,
      matchId: selectedNotification.matchId,
      segmentType: selectedNotification.segmentType,
      notificationTitle: selectedNotification.notificationTitle,
      notificationBody: selectedNotification.notificationBody
    };
    this.props.actions.editMatchNotification(data).then(() => {
      if (this.props.editMatchNotficationResponse) {
        if (this.props.editMatchNotficationResponse.error) {
          message.error(
            this.props.editMatchNotficationResponse.error.message
              ? this.props.editMatchNotficationResponse.error.message
              : 'Could not edit notification'
          );
        } else {
          message.success('Successfully updated the notification');
          this.setState({
            selectedNotification: {},
            showEditNotificationModal: false,
            showMatchNotificationModal: false
          });
        }
      }
    });
  }

  openSendManualModal(record) {
    this.setState({
      selectedNotification: { ...record },
      showSendManualModal: true
    });
  }

  closeSendManualModal() {
    this.setState({ showSendManualModal: false, selectedNotification: {} });
  }

  setMobileNumbers(value) {
    this.setState({ mobileNumbers: value });
  }

  sendManualNotification() {
    let selectedNotification = { ...this.state.selectedNotification };
    let mobileNumbers = this.state.mobileNumbers;
    let mobileNumberArray = mobileNumbers.split(',');
    let data = {
      matchNotificationId: selectedNotification.matchNotificationId,
      matchId: selectedNotification.matchId,
      mobileNumbers: [...mobileNumberArray]
    };
    this.props.actions.sendMatchNotificationManually(data).then(() => {
      if (this.props.sendMatchNotficationManuallyResponse) {
        if (this.props.sendMatchNotficationManuallyResponse.error) {
          message.error(
            this.props.sendMatchNotficationManuallyResponse.error.message
              ? this.props.sendMatchNotficationManuallyResponse.error.message
              : 'Could not send notification'
          );
        } else {
          message.success('Successfully sent the notification');
          this.setState({
            selectedNotification: {},
            showSendManualModal: false,
            showMatchNotificationModal: false
          });
        }
      }
    });
  }

  openUpdateAllContestModal() {
    this.setState({ showUpdateAllContestModal: true });
  }

  closeUpdateAllContestModal() {
    this.setState({
      showUpdateAllContestModal: false,
      updateAllContestStatus: '',
      updateAllPassword: ''
    });
  }

  selectUpdateAllContestStatus(value) {
    this.setState({
      updateAllContestStatus: value
    });
  }

  changeUpdateAllPassword(value) {
    this.setState({
      updateAllPassword: value
    });
  }

  makeUpdateAllContestCall() {
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      contestStatus: this.state.updateAllContestStatus,
      password: this.state.updateAllPassword
    };
    this.props.actions.updateAllContests(data).then(() => {
      if (
        this.props.updateAllContestsForMatchResponse &&
        this.props.updateAllContestsForMatchResponse.error
      ) {
        message.error(
          this.props.updateAllContestsForMatchResponse.error.message
            ? this.props.updateAllContestsForMatchResponse.error.message
            : 'Could not update multiple contests'
        );
      } else {
        message.success('Contests updated successfully');
        this.setState({
          showUpdateAllContestModal: false,
          updateAllPassword: ''
        });
        window.location.reload();
      }
    });
  }

  showMoneyDetails() {
    let data = {
      sportId: 7,
      matchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.getMatchLevelMoney(data).then(() => {
      if (this.props.getMatchLevelMoneyResponse) {
        if (this.props.getMatchLevelMoneyResponse.error) {
          message.error(
            this.props.getMatchLevelMoneyResponse.error.message
              ? this.props.getMatchLevelMoneyResponse.error.message
              : 'Could not fetch money details'
          );
        } else {
          let moneyDetails = {};
          let moneyTableData = [];
          if (this.props.getMatchLevelMoneyResponse) {
            moneyDetails = { ...this.props.getMatchLevelMoneyResponse };
            moneyTableData[0] = {
              type: 'Participation',
              deposit:
                moneyDetails.participation && moneyDetails.participation.deposit
                  ? moneyDetails.participation.deposit
                  : 0,
              winning:
                moneyDetails.participation && moneyDetails.participation.Winning
                  ? moneyDetails.participation.Winning
                  : 0,
              bonus:
                moneyDetails.participation && moneyDetails.participation.Bonus
                  ? moneyDetails.participation.Bonus
                  : 0,
              total:
                moneyDetails.participation && moneyDetails.participation.total
                  ? moneyDetails.participation.total
                  : 0,
              calculations:
                moneyDetails.participation &&
                moneyDetails.participation.calculations
                  ? moneyDetails.participation.calculations
                  : 0
            };
            moneyTableData[1] = {
              type: 'Refund',
              deposit:
                moneyDetails.refund && moneyDetails.refund.deposit
                  ? moneyDetails.refund.deposit
                  : 0,
              winning:
                moneyDetails.refund && moneyDetails.refund.Winning
                  ? moneyDetails.refund.Winning
                  : 0,
              bonus:
                moneyDetails.refund && moneyDetails.refund.Bonus
                  ? moneyDetails.refund.Bonus
                  : 0,
              total:
                moneyDetails.refund && moneyDetails.refund.total
                  ? moneyDetails.refund.total
                  : 0,
              calculations:
                moneyDetails.refund && moneyDetails.refund.calculations
                  ? moneyDetails.refund.calculations
                  : 0
            };
            moneyTableData[2] = {
              type: 'Winning',
              deposit:
                moneyDetails.winning && moneyDetails.winning.deposit
                  ? moneyDetails.winning.deposit
                  : 0,
              winning:
                moneyDetails.winning && moneyDetails.winning.Winning
                  ? moneyDetails.winning.Winning
                  : 0,
              bonus:
                moneyDetails.winning && moneyDetails.winning.Bonus
                  ? moneyDetails.winning.Bonus
                  : 0,
              total:
                moneyDetails.winning && moneyDetails.winning.total
                  ? moneyDetails.winning.total
                  : 0,
              calculations:
                moneyDetails.winning && moneyDetails.winning.calculations
                  ? moneyDetails.winning.calculations
                  : 0
            };
            moneyTableData[3] = {
              type: 'Entry Fee Back',
              deposit:
                moneyDetails.entryFeeBack && moneyDetails.entryFeeBack.deposit
                  ? moneyDetails.entryFeeBack.deposit
                  : 0,
              winning:
                moneyDetails.entryFeeBack && moneyDetails.entryFeeBack.Winning
                  ? moneyDetails.entryFeeBack.Winning
                  : 0,
              bonus:
                moneyDetails.entryFeeBack && moneyDetails.entryFeeBack.Bonus
                  ? moneyDetails.entryFeeBack.Bonus
                  : 0,
              total:
                moneyDetails.entryFeeBack && moneyDetails.entryFeeBack.total
                  ? moneyDetails.entryFeeBack.total
                  : 0,
              calculations:
                moneyDetails.entryFeeBack &&
                moneyDetails.entryFeeBack.calculations
                  ? moneyDetails.entryFeeBack.calculations
                  : 0
            };
            moneyTableData[4] = {
              type: 'Entry Fee Crawl Back',
              deposit:
                moneyDetails.entryFeeCrawlBack &&
                moneyDetails.entryFeeCrawlBack.deposit
                  ? moneyDetails.entryFeeCrawlBack.deposit
                  : 0,
              winning:
                moneyDetails.entryFeeCrawlBack &&
                moneyDetails.entryFeeCrawlBack.Winning
                  ? moneyDetails.entryFeeCrawlBack.Winning
                  : 0,
              bonus:
                moneyDetails.entryFeeCrawlBack &&
                moneyDetails.entryFeeCrawlBack.Bonus
                  ? moneyDetails.entryFeeCrawlBack.Bonus
                  : 0,
              total:
                moneyDetails.entryFeeCrawlBack &&
                moneyDetails.entryFeeCrawlBack.total
                  ? moneyDetails.entryFeeCrawlBack.total
                  : 0,
              calculations:
                moneyDetails.entryFeeCrawlBack &&
                moneyDetails.entryFeeCrawlBack.calculations
                  ? moneyDetails.entryFeeCrawlBack.calculations
                  : 0
            };
            moneyTableData[5] = {
              type: '',
              deposit: '',
              winning: 'P&L',
              bonus: '',
              total: moneyDetails.profitAndLostAmount
                ? moneyDetails.profitAndLostAmount
                : 0,
              calculations: moneyDetails.profitAndLostPercentage
                ? moneyDetails.profitAndLostPercentage
                : 0
            };
            moneyTableData[6] = {
              type: '',
              deposit: '',
              winning: 'Bonus Cash Utilization',
              bonus: '',
              total: moneyDetails.bonusUtilizedAmount
                ? moneyDetails.bonusUtilizedAmount
                : 0,
              calculations: moneyDetails.bonusUtilizedPercentage
                ? moneyDetails.bonusUtilizedPercentage
                : 0
            };
          }
          this.setState({
            moneyDetails,
            moneyTableData,
            showMoneyDetailsModal: true,
            moneyDetailType: 'MATCH_LEVEL'
          });
        }
      }
    });
  }

  closeMoneyDetailsModal() {
    this.setState({
      showMoneyDetailsModal: false,
      moneyDetails: {},
      participationAmountDetails: [],
      winningAmountDetails: [],
      refundAmountDetails: [],
      entryFeeBackAmountDetails: []
    });
  }

  showContestMoneyDetails(record) {
    let data = {
      sportId: 7,
      matchId: this.props.matchDetail.seasonGameUid,
      contestId: record.id
    };
    this.props.actions.getContestLevelMoney(data).then(() => {
      if (this.props.getContestLevelMoneyResponse) {
        if (this.props.getContestLevelMoneyResponse.error) {
          message.error(
            this.props.getContestLevelMoneyResponse.error.message
              ? this.props.getContestLevelMoneyResponse.error.message
              : 'Could not fetch money details'
          );
        } else {
          let moneyDetails = {};
          let participationAmountDetails = [];
          let winningAmountDetails = [];
          let refundAmountDetails = [];
          let entryFeeBackAmountDetails = [];
          if (
            this.props.getContestLevelMoneyResponse.totalParticipation ||
            this.props.getContestLevelMoneyResponse.totalWinning
          ) {
            moneyDetails = { ...this.props.getContestLevelMoneyResponse };
            if (moneyDetails.participationAmountDetails) {
              participationAmountDetails = Object.entries(
                moneyDetails.participationAmountDetails
              );
            }
            if (moneyDetails.winningAmountDetails) {
              winningAmountDetails = Object.entries(
                moneyDetails.winningAmountDetails
              );
            }
            if (moneyDetails.RefundAmountDetails) {
              refundAmountDetails = Object.entries(
                moneyDetails.RefundAmountDetails
              );
            }
            if (moneyDetails.entryFeeBackAmountDetails) {
              entryFeeBackAmountDetails = Object.entries(
                moneyDetails.entryFeeBackAmountDetails
              );
            }
          }
          this.setState({
            moneyDetails,
            participationAmountDetails,
            winningAmountDetails,
            refundAmountDetails,
            entryFeeBackAmountDetails,
            showMoneyDetailsModal: true,
            moneyDetailType: 'CONTEST_LEVEL'
          });
        }
      }
    });
  }

  searchContestById() {
    this.setState({ searchContestByIdFlag: true });
  }

  searchContestByIdCall(value) {
    let data = {
      contestId: value,
      matchId: this.props.matchDetail.seasonGameUid
    };
    this.props.actions.getContestDetailById(data).then(() => {
      if (
        this.props.getContestDetailByIdResponse &&
        this.props.getContestDetailByIdResponse.contestDetailDashboard
      ) {
        this.setState({
          contestsList: this.props.getContestDetailByIdResponse
            .contestDetailDashboard,
          totalContests: 1,
          showContests: true
        });
      } else {
        message.error('Could not fetch the details');
      }
    });
  }

  closeContestDetailModal() {
    this.setState({
      contestDetails: {},
      showContestDetailModal: false
    });
  }

  openCreditWinningModal(record) {
    this.setState({
      showCreditWinningModal: true,
      creditWinningContestId: record.id
    });
  }

  closeCreditWinningModal() {
    this.setState({
      showCreditWinningModal: false,
      creditWinningContestId: null,
      creditWinningToken: false,
      creditWinningCash: false,
      creditWinningBonus: false,
      creditPassword: ''
    });
  }

  updateCreditWinningToken(value) {
    this.setState({ creditWinningToken: value });
  }

  updateCreditWinningCash(value) {
    this.setState({ creditWinningCash: value });
  }

  updateCreditWinningBonus(value) {
    this.setState({ creditWinningBonus: value });
  }

  updateCreditPassword(value) {
    this.setState({ creditPassword: value });
  }

  processCreditWinnings() {
    let data = {
      contestId: this.state.creditWinningContestId,
      matchId: this.props.matchDetail.seasonGameUid,
      creditTokenPrize: this.state.creditWinningToken,
      creditCashPrize: this.state.creditWinningCash,
      creditBonusCashPrize: this.state.creditWinningBonus,
      password: this.state.creditPassword
    };
    this.props.actions.creditContestWinnings(data).then(() => {
      if (this.props.creditContestWinningsResponse) {
        if (this.props.creditContestWinningsResponse.error) {
          message.error(
            this.props.creditContestWinningsResponse.error.message
              ? this.props.creditContestWinningsResponse.error.message
              : 'Could not process credit winnings'
          );
        } else {
          message.success('Successfully processed the constest winnings');
          this.closeCreditWinningModal();
        }
      }
    });
  }

  openMLPriceModal(record) {
    let data = {
      sportId: 7,
      matchId: this.props.matchDetail.seasonGameUid,
      contestId: record.id
    };
    this.props.actions.getContestMlPrice(data).then(() => {
      if (this.props.getContestMlPriceResponse) {
        if (this.props.getContestMlPriceResponse.error) {
          message.error(
            this.props.getContestMlPriceResponse.error.message
              ? this.props.getContestMlPriceResponse.error.message
              : 'Could not fetch contest ml price'
          );
        } else {
          this.setState({
            showMlPriceModal: true,
            mlResponse: this.props.getContestMlPriceResponse.response
              ? this.props.getContestMlPriceResponse.response
              : 'Not Available'
          });
        }
      }
    });
  }

  closeMLPriceModal() {
    this.setState({
      showMlPriceModal: false,
      mlResponse: ''
    });
  }

  openSetMlPriceModal(record) {
    this.setState({
      mlContestId: record.id,
      showSetMlPriceModal: true
    });
  }

  updateSetMlPrice(value) {
    this.setState({
      mlPrice: value
    });
  }

  setMlPrice() {
    let pricePoints = this.state.mlPrice ? this.state.mlPrice.split(',') : [];
    let data = {
      matchId: this.props.matchDetail.seasonGameUid,
      contestId: this.state.mlContestId,
      pricePoints: [...pricePoints]
    };
    this.props.actions.setContestMlPrice(data).then(() => {
      if (this.props.setContestMlPriceResponse) {
        if (this.props.setContestMlPriceResponse.error) {
          message.error(
            this.props.setContestMlPriceResponse.error.message
              ? this.props.setContestMlPriceResponse.error.message
              : 'Could not set contest ml price'
          );
        } else {
          message.success('Successfully updated the ml price', 1).then(() => {
            this.setState({
              showSetMlPriceModal: false,
              mlContestId: null
            });
          });
        }
      }
    });
  }

  closeSetMlPriceModal() {
    this.setState({
      showSetMlPriceModal: false,
      mlContestId: null
    });
  }

  attachFantasyAssistant() {
    this.setState({
      showFantasyAssistantModel: true
    });
  }
  closeFantasyAssistantModal() {
    this.setState({
      showFantasyAssistantModel: false,
      fantasyAssistantMatchId: '',
      isFantasyAssistant: true
    });
  }
  handleChangeFantasyAssistant(e) {
    this.setState({
      fantasyAssistantMatchId: e,
      isFantasyAssistant: true
    });
  }
  handleSubmitFantasyAssistant() {
    this.props.actions
      .getFantasyAssistantMatchDetailById({
        matchId: this.state.fantasyAssistantMatchId
      })
      .then(() => {
        this.presentFantasyAssistDetail();
      });
  }
  presentFantasyAssistDetail() {
    if (
      this.props.getAssistantMatchDetailResponse &&
      this.props.getAssistantMatchDetailResponse.assistantMatchDetail
    ) {
      this.setState({
        isFantasyAssistant: false,
        fantasyAssistantData: this.props.getAssistantMatchDetailResponse
          .assistantMatchDetail
      });
    } else {
      message.success('No Record Found');
    }
  }
  setFantasyAssistant(matchId) {
    this.props.actions
      .attachFantasyAssistantMatchId({
        matchId: matchId,
        assistantMatchId: this.state.fantasyAssistantMatchId
      })
      .then(() => {
        message.success('Done');
        this.setState({
          showFantasyAssistantModel: false,
          fantasyAssistantMatchId: '',
          isFantasyAssistant: true
        });
        window.location.reload();
      });
  }

  render() {
    const hideModal = () => {
      this.setState({
        showConfigModal: false,
        showMatchDetailModal: false,
        showRosterModal: false
      });
    };
    const handleOk = () => {
      this.setState({
        showConfigModal: false,
        showMatchDetailModal: false
      });
    };
    const hideModal2 = () => {
      this.setState({
        showRosterModal: false
      });
    };
    const handleOk2 = () => {
      this.setState({
        showRosterModal: false
      });
    };
    const hideModal3 = () => {
      this.setState({
        showTeamCountModal: false
      });
    };
    const handleOk3 = () => {
      this.setState({
        showTeamCountModal: false
      });
    };
    const hideModal4 = () => {
      this.setState({
        showPlayerStat: false,
        isUserProfileEdit: false
      });
    };
    const handleOk4 = () => {
      this.setState({
        showPlayerStat: false,
        isUserProfileEdit: false
      });
    };
    const hideModal5 = () => {
      this.setState({
        cancelContestModal: false,
        password: ''
      });
    };
    const handleOk5 = () => {
      this.cancelContestCall();
      this.setState({
        cancelContestModal: false,
        password: ''
      });
    };
    const hideModal6 = () => {
      this.setState({
        showMultipleSelectionModal: false,
        selectedMatches: []
      });
    };
    const handleOk6 = () => {
      this.createMultipleContests();
      this.setState({
        showMultipleSelectionModal: false,
        selectedMatches: []
      });
    };
    const hideModal7 = () => {
      this.setState({
        showContestCountModal: false
      });
    };
    const handleOk7 = () => {
      this.setState({
        showContestCountModal: false
      });
    };
    const hideModal8 = () => {
      this.setState({
        showRefundMatchModal: false,
        password: ''
      });
    };
    const handleOk8 = () => {
      this.refundMatchCall();
      this.setState({
        showRefundMatchModal: false,
        password: ''
      });
    };
    const hideCancelModal = () => {
      this.setState({
        showCancelMatchModal: false,
        password: ''
      });
    };
    const handleCancelModal = () => {
      this.cancelMatchCall();
      this.setState({
        showCancelMatchModal: false,
        password: ''
      });
    };
    const hideModal9 = () => {
      this.setState({
        leaderboardData: [],
        showDownloadModal: false
      });
    };
    const handleOk9 = () => {
      this.setState({
        leaderboardData: [],
        showDownloadModal: false
      });
    };
    const hidePlayerScoreModal = () => {
      this.setState({
        playerScoreList: [],
        showPlayerScoreModal: false,
        countOfPointPlayer: 0
      });
    };
    const handlePlayerScoreModalOk = () => {
      this.setState({
        playerScoreList: [],
        showPlayerScoreModal: false,
        countOfPointPlayer: 0
      });
    };

    const handleEditPlayerScoreModalOk = () => {
      let data = {
        seasonGameUid: this.state.playerScoreSeasonGameUid
      };
      this.props.actions.getMatchPlayerScore(data).then(() => {
        if (
          this.props.getMatchPlayerScoreResponse &&
          this.props.getMatchPlayerScoreResponse.matchPlayerScores
        ) {
          this.setState({
            playerScoreList: [
              ...this.props.getMatchPlayerScoreResponse.matchPlayerScores
            ]
          });
        } else {
          if (
            this.props.getMatchPlayerScoreResponse &&
            this.props.getMatchPlayerScoreResponse.error
          ) {
            message.error(this.props.getMatchPlayerScoreResponse.error.message);
          } else {
            message.info('Player score list is empty');
          }
        }
      });
      this.setState({
        selectedPlayerScore: {},
        showPlayerScoreEditModal: false
      });
    };

    const hideCreateDefaultContestModal = () => {
      this.setState({
        showCreateDefaultContestModal: false
      });
    };

    const handleCreateDefaultContestModalOk = () => {
      let selectedMasterContestType = [...this.state.selectedMasterContestType];
      if (selectedMasterContestType.length < 1) {
        message.error('Please select at least one master type');
        return;
      }
      let data = {
        seasonGameUId: this.props.matchDetail.seasonGameUid,
        matchType: [...selectedMasterContestType]
      };

      this.props.actions.createDefaultContest(data).then(() => {
        if (this.props.createDefaultContestResponse) {
          if (this.props.createDefaultContestResponse.error) {
            message.error('Could not create default contests');
          } else {
            message
              .success('Successfully created default contests', 1)
              .then(() => {
                this.setState({
                  showCreateDefaultContestModal: false,
                  selectedMasterContestType: []
                });
              });
          }
        }
      });

      this.setState({
        selectedMasterContestType: [],
        showCreateDefaultContestModal: false
      });
    };

    const verifyRoster = () => {
      let data = {
        matchId: this.props.matchDetail.seasonGameUid
      };
      this.props.actions.verifyMatchRoster(data).then(() => {
        if (this.props.fantasy.verifyMatchRoster) {
          // this.setState({
          //   playerDetailsList: this.props.fantasy.matchRoster.playerDetailsList
          // });
        } else {
          message.error('Player Details not found');
        }
      });

      this.setState({
        showRosterModal: false
      });
    };
    const refreshRoster = () => {
      let data = {
        matchId: this.props.matchDetail.seasonGameUid
      };
      this.props.actions.updateMatchRoster(data).then(() => {
        if (
          this.props.fantasy.updateMatchRoster &&
          this.props.fantasy.updateMatchRoster.playerDetailsList
        ) {
          this.setState({
            playerDetailsList: this.props.fantasy.updateMatchRoster
              .playerDetailsList
          });
        } else {
          message.error('Error in fetching the roster');
        }
      });
    };

    const matchDetail = this.props.matchDetail;

    const contestColumns = [
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count'
      },
      {
        title: 'Entry Fee',
        dataIndex: 'entryFee',
        key: 'entryFee'
      },
      {
        title: 'Entry Type',
        dataIndex: 'entryType',
        key: 'entryType',
        render: (text, record) => (
          <span>
            <span>
              <img
                style={{ width: '15px', marginLeft: 5 }}
                src={record.entryType === 'Token' ? TOKEN : CASH}
                alt=""
              />
            </span>
          </span>
        )
      },
      {
        title: 'Total Slots',
        dataIndex: 'totalSlots',
        key: 'totalSlots'
      },
      {
        title: 'Country Code',
        key: 'countryCode',
        render: (text, record) => (
          <span>{JSON.stringify(record.countryCode)}</span>
        )
      }
    ];

    const leaderboardColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Team Id',
        dataIndex: 'teamId',
        key: 'teamId'
      },
      {
        title: 'Team Name',
        dataIndex: 'teamName',
        key: 'teamName'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score'
      },
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank'
      },
      {
        title: 'Cash Prize',
        dataIndex: 'cashPrize',
        key: 'cashPrize'
      },
      {
        title: 'Token Prize',
        dataIndex: 'tokenPrize',
        key: 'tokenPrize'
      },
      {
        title: 'Special Prize',
        dataIndex: 'specialPrize',
        key: 'specialPrize'
      },
      {
        title: 'Tie Count',
        dataIndex: 'tieCount',
        key: 'tieCount'
      },
      {
        title: 'Tier',
        dataIndex: 'userTier',
        key: 'userTier'
      },
      {
        title: 'Is Pro',
        dataIndex: 'isPro',
        key: 'isPro'
      }
    ];

    const rosterColumns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search Name`}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon
            type="search"
            style={{ color: filtered ? '#1890ff' : undefined }}
          />
        ),
        onFilter: (value, record) =>
          record['name']
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        }
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search firstName`}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon
            type="search"
            style={{ color: filtered ? '#1890ff' : undefined }}
          />
        ),
        onFilter: (value, record) =>
          record['firstName']
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        }
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search lastName`}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon
            type="search"
            style={{ color: filtered ? '#1890ff' : undefined }}
          />
        ),
        onFilter: (value, record) =>
          record['lastName']
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        }
      },
      {
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName',
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search fullName`}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon
            type="search"
            style={{ color: filtered ? '#1890ff' : undefined }}
          />
        ),
        onFilter: (value, record) =>
          record['fullName']
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        }
      },
      {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.teamId - b.teamId
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Credit',
        dataIndex: 'credit',
        key: 'credit'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              icon="user"
              onClick={() => this.getUserProfile(record)}
              type="primary"
            />
          </span>
        )
      }
    ];

    const playerScoreColumns = [
      {
        title: 'Player Uid',
        key: 'playerUid',
        render: (text, record) => (
          <span>
            {record.isPlaying ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}
            {record.playerUid}
          </span>
        )
      },
      {
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        sorter: (a, b) => {
          var nameA = a.score ? a.score : 0;
          var nameB = b.score ? b.score : 0;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Dream Score',
        dataIndex: 'dreamScore',
        key: 'dreamScore',
        sorter: (a, b) => {
          var nameA = a.dreamScore ? a.dreamScore : 0;
          var nameB = b.dreamScore ? b.dreamScore : 0;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Player Role',
        dataIndex: 'playerRole',
        key: 'playerRole'
      },
      {
        title: 'Team',
        dataIndex: 'playerTeamName',
        key: 'playerTeamName',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.playerTeamId - b.playerTeamId
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              type="primary"
              onClick={() => this.showPlayerScorePoints(record, 'MPL')}
            >
              Details
            </Button>
            <Button
              style={{ margin: '3px' }}
              size="small"
              onClick={() => this.showPlayerScorePoints(record, 'DREAM')}
            >
              Dream Details
            </Button>
          </span>
        )
      }
    ];

    const columns = [
      {
        title: 'Contest Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Name',
        key: 'name',
        sorter: (a, b) => {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        },
        render: (text, record) => (
          <span>
            <Badge
              count={'A'}
              status={record.isActive ? 'processing' : 'error'}
            />
            <span>{record.name}</span>
          </span>
        )
      },
      {
        title: 'Slots Filled',
        key: 'totalSlots',
        render: (text, record) => (
          <span>
            <span>{record.slotsFilled ? record.slotsFilled : 0}</span>{' '}
            <span>/</span> <span>{record.totalSlots}</span>
          </span>
        )
      },
      {
        title: 'Fill Ratio',
        key: 'fillRatio',
        sorter: (a, b) => {
          var nameA = a.slotsFilled
            ? ((a.slotsFilled * 100) / a.totalSlots).toFixed(2)
            : 0;
          var nameB = b.slotsFilled
            ? ((b.slotsFilled * 100) / b.totalSlots).toFixed(2)
            : 0;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        },
        render: (text, record) =>
          record.slotsFilled
            ? ((record.slotsFilled * 100) / record.totalSlots).toFixed(2)
            : 0
      },
      {
        title: 'Teams Allowed',
        dataIndex: 'teamsAllowed',
        key: 'teamsAllowed'
      },
      {
        title: 'Entry Fees',
        key: 'registrationFees',
        filters: [
          {
            text: 'Token',
            value: 'token'
          },
          {
            text: 'Cash',
            value: 'cash'
          }
        ],
        onFilter: (value, record) =>
          record.registrationFeesType.toLowerCase().indexOf(value) === 0,
        sorter: (a, b) => {
          var nameA = a.registrationFees ? a.registrationFees : 0;
          var nameB = b.registrationFees ? b.registrationFees : 0;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        },
        render: (text, record) => (
          <span>
            <span>{record.registrationFees ? record.registrationFees : 0}</span>
            <span>
              <img
                style={{ width: '15px', marginLeft: 5 }}
                src={record.registrationFeesType === 'Token' ? TOKEN : CASH}
                alt=""
              />
            </span>
          </span>
        )
      },
      {
        title: 'App Type',
        key: 'appType',
        render: (text, record) => (
          <span>
            <span>{record.appType.join(', ')}</span>
          </span>
        )
      },
      {
        title: 'Bonus Limit',
        key: 'bonusLimit',
        render: (text, record) => (record.bonusLimit ? record.bonusLimit : 0)
      },
      {
        title: 'Registration End Time',
        key: 'registrationEndTime',
        render: record => (
          <span>
            {moment(record.registrationEndTime).format('YYYY-MM-DD HH:mm')}
          </span>
        )
      },
      {
        title: 'Is NGC',
        key: 'isNgc',
        render: (text, record) =>
          record.isNgc ? (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          ) : (
            <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
          )
      },
      {
        title: 'Min Players',
        key: 'minPlayers',
        render: (text, record) => (record.minPlayers ? record.minPlayers : 0)
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            {this.props.showEditClone &&
              this.isShowEditContestButton(record) && (
                <Button
                  shape="circle"
                  icon="edit"
                  onClick={() => this.cloneEditContest(record, 'EDIT')}
                  type="primary"
                />
              )}
            <Button
              shape="circle"
              icon="copy"
              onClick={() => this.cloneEditContest(record, 'COPY')}
              type="primary"
            />
            <Button
              shape="circle"
              icon="info"
              onClick={() => this.showConfig(record)}
              type="primary"
            />
            {/* {this.props.showEditClone && (
              <Popconfirm
                title="Sure to delete this contest?"
                onConfirm={() => this.deleteContest(record)}
              >
                <Button shape="circle" icon="delete" type="danger" />
              </Popconfirm>
            )} */}
            {!record.isActive && (
              <Popconfirm
                title="Sure to activate this contest?"
                onConfirm={() => this.activateContest(record)}
              >
                <Button shape="circle" icon="check" type="primary" />
              </Popconfirm>
            )}
            <Button
              shape="circle"
              icon="close-circle"
              onClick={() => this.cancelContest(record)}
              type="danger"
            />
            {this.props.refundMatchFlag && (
              <Button
                shape="circle"
                icon="download"
                type="primary"
                onClick={() => this.downloadLeaderboard(record)}
              />
            )}
            <Button
              size="small"
              onClick={() => this.showContestMoneyDetails(record)}
              style={{ fontSize: '8px' }}
            >
              Money Details
            </Button>
            {this.state.isAdmin && (
              <Button
                onClick={() => this.openCreditWinningModal(record)}
                size="small"
                type="dashed"
                style={{ fontSize: '8px' }}
              >
                Credit Winning
              </Button>
            )}
            <Button
              onClick={() => this.openMLPriceModal(record)}
              size="small"
              type="dashed"
              style={{ fontSize: '8px', color: 'blue' }}
            >
              Get ML Price
            </Button>
            <Button
              onClick={() => this.openSetMlPriceModal(record)}
              size="small"
              type="dashed"
              style={{ fontSize: '8px', color: 'green' }}
            >
              Set ML Price
            </Button>
          </span>
        )
      }
    ];

    const playerScoreDetailColumns = [
      {
        title: 'Player Id',
        dataIndex: 'playerId',
        key: 'playerId'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Player Type',
        dataIndex: 'playerType',
        key: 'playerType'
      },
      {
        title: 'Team',
        dataIndex: 'team',
        key: 'team'
      },
      {
        title: 'Credit',
        dataIndex: 'credit',
        key: 'credit'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score'
      },
      {
        title: 'Total Points',
        dataIndex: 'totalPoints',
        key: 'totalPoints'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button onClick={() => this.showPlayerScorePoints(record)}>
              Player Score Point Details
            </Button>
          </span>
        )
      }
    ];

    const playerScorePointsColumns = [
      {
        title: 'Event Name',
        dataIndex: 'eventName',
        key: 'eventName'
      },
      {
        title: 'Recurrence',
        key: 'recurrence',
        render: (text, record) => (
          <Input
            onChange={e => this.recurrenceChanged(e.target.value, record)}
            value={record.recurrence}
            disabled={
              (this.props.tabType === 'LIVE' && !matchDetail.autoFinish) ||
              (this.props.tabType === 'END' &&
                matchDetail.matchFinalStatus === 'WAITING_FOR_LEADERBOARD')
                ? false
                : true
            }
          />
        )
      },
      {
        title: 'Points',
        key: 'points',
        render: (text, record) => (
          <InputNumber
            onChange={e => this.pointsChanged(e, record)}
            value={record.points}
            precision={1}
            disabled={
              (this.props.tabType === 'LIVE' && !matchDetail.autoFinish) ||
              (this.props.tabType === 'END' &&
                matchDetail.matchFinalStatus === 'WAITING_FOR_LEADERBOARD')
                ? false
                : true
            }
          />
        )
      }
    ];

    const matchNotificationColumns = [
      {
        title: 'Notif Id',
        dataIndex: 'matchNotificationId',
        key: 'matchNotificationId'
      },
      {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId'
      },
      {
        title: 'Notification Type',
        dataIndex: 'notificationType',
        key: 'notificationType'
      },
      {
        title: 'Segment Type',
        dataIndex: 'segmentType',
        key: 'segmentType'
      },
      {
        title: 'Notification Title',
        dataIndex: 'notificationTitle',
        key: 'notificationTitle'
      },
      {
        title: 'Notification Body',
        dataIndex: 'notificationBody',
        key: 'notificationBody'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button size="small" onClick={() => this.editNotification(record)}>
              Edit Notification
            </Button>
            <Button
              size="small"
              style={{ marginLeft: '5px' }}
              onClick={() => this.openSendManualModal(record)}
            >
              Send Notif Manually
            </Button>
          </span>
        )
      }
    ];

    const matchLevelTableColumns = [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Deposit',
        dataIndex: 'deposit',
        key: 'deposit'
      },
      {
        title: 'Bonus',
        dataIndex: 'bonus',
        key: 'bonus'
      },
      {
        title: 'Winning',
        dataIndex: 'winning',
        key: 'winning'
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total'
      },
      {
        title: 'Calculations',
        dataIndex: 'calculations',
        key: 'calculations'
      }
    ];

    const { selectedRowKeys, selectedRowKeysContest } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection
    };

    const rowSelectionContest = {
      selectedRowKeysContest,
      onChange: this.onSelectContestChange,
      onSelection: this.onContestSelection
    };

    return (
      <React.Fragment>
        <Card
          type="inner"
          title={
            <span
              className={
                (!matchDetail.autoFinish && !this.props.refundMatchFlag) ||
                (!matchDetail.autoFinish &&
                  this.props.refundMatchFlag &&
                  matchDetail.statusOverview === 5)
                  ? 'highlight-non-autofinish-card'
                  : ''
              }
            >
              {' '}
              <Badge
                count={'A'}
                status={matchDetail.isActive ? 'processing' : 'error'}
              />
              {matchDetail.title} ({matchDetail.seasonGameUid})
            </span>
          }
          extra={
            this.props.matchLevelEdit ? (
              <span>
                <Popconfirm
                  title="Sure to update the match details with data from vinfo?"
                  onConfirm={() => this.updateMatchDetails()}
                >
                  <Button>Update Match</Button>
                </Popconfirm>
                <Button
                  style={{ marginLeft: '5px' }}
                  onClick={() => this.editMatchDetails()}
                >
                  Edit Match
                </Button>
                <Button
                  style={{ marginLeft: '5px' }}
                  onClick={() => this.extendMatch()}
                >
                  Extend Match
                </Button>
                {!this.props.matchDetail.isActive ? (
                  <Button
                    style={{ color: 'green', marginLeft: '5px' }}
                    onClick={() => this.activateMatch()}
                  >
                    Activate
                  </Button>
                ) : (
                  <Popconfirm
                    title="Sure to deactivate this config?"
                    onConfirm={() => this.deActivateMatch()}
                  >
                    <Button style={{ color: 'red', marginLeft: '5px' }}>
                      Deactivate
                    </Button>
                  </Popconfirm>
                )}
                <Button
                  onClick={() => this.showMatchDetails()}
                  style={{ marginLeft: '5px' }}
                >
                  Match Details
                </Button>
                <Button
                  onClick={() => this.editMatchConfig()}
                  style={{ marginLeft: '5px' }}
                >
                  Edit Config
                </Button>
                <Button
                  onClick={() => this.showRoster()}
                  style={{ marginLeft: '5px' }}
                >
                  Roster
                </Button>
              </span>
            ) : (
              <span>
                <Button
                  onClick={() => this.editMatchConfig()}
                  style={{ marginLeft: '5px' }}
                >
                  Edit Config
                </Button>
                <Button
                  onClick={() => this.showMatchDetails()}
                  style={{ marginLeft: '5px' }}
                >
                  Match Details
                </Button>
                <Button
                  onClick={() => this.showRoster()}
                  style={{ marginLeft: '5px' }}
                >
                  Roster
                </Button>
                {matchDetail.matchFinalStatus === 'CANCELLED' && (
                  <Popconfirm
                    title="Sure to refund for the match?"
                    onConfirm={() => this.refundMatch()}
                  >
                    <Button style={{ marginLeft: '5px' }} type="danger">
                      Refund Match
                    </Button>
                  </Popconfirm>
                )}
              </span>
            )
          }
        >
          {/* editConfigFlag={true} */}
          <Row>
            <Col span={24} style={{ width: '80%' }}>
              <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Col span={6}>
                  <Button
                    style={{ backgroundColor: '#c75858' }}
                    size="small"
                    onClick={() => this.openUpdateAllContestModal()}
                  >
                    Update All Contests
                  </Button>
                </Col>
                <Col span={6}>
                  {matchDetail.isInningsMatch && matchDetail.inningNumber && (
                    <Tag color="#2db7f5">
                      Innings: {matchDetail.inningNumber}
                    </Tag>
                  )}
                  {matchDetail.isLineUpFormatShout &&
                    matchDetail.lineUpPlayerCount && (
                      <Tag style={{ marginLeft: '2px' }} color="#87d068">
                        Line Up Count: {matchDetail.lineUpPlayerCount}
                      </Tag>
                    )}
                </Col>
                <Col span={6}>
                  {JSON.parse(matchDetail.extraInfo)
                    .fantasyAssistantAvailable &&
                    (JSON.parse(matchDetail.extraInfo)
                      .fantasyAssistantMatchId ||
                      JSON.parse(matchDetail.extraInfo)
                        .fantasyAssistantInternalUrl) && (
                      <Tag style={{ marginLeft: '2px' }} color="#87d068">
                        Fantasy Assistant:{' '}
                        {JSON.parse(matchDetail.extraInfo)
                          .fantasyAssistantMatchId != ''
                          ? JSON.parse(matchDetail.extraInfo)
                              .fantasyAssistantMatchId
                          : 'Url'}
                      </Tag>
                    )}
                </Col>
                <Col span={6}>
                  {matchDetail.extraInfo &&
                    JSON.parse(matchDetail.extraInfo).rakeBackDetails &&
                    JSON.parse(matchDetail.extraInfo).rakeBackDetails
                      .isRakeBack && <Tag color="green">RAKE BACK ENABLED</Tag>}
                </Col>
                <Col span={6} style={{ paddingRight: '200px' }}>
                  <Button
                    size="small"
                    onClick={() => this.getNotifications(matchDetail)}
                  >
                    Edit Notification
                  </Button>
                  <Button
                    size="small"
                    style={{ marginTop: '10px' }}
                    onClick={() => this.attachFantasyAssistant(matchDetail)}
                  >
                    Attach Fantasy Assistant
                  </Button>
                  {matchDetail.matchFinalStatus ===
                    'WAITING_FOR_LEADERBOARD' && (
                    <Popconfirm
                      title="Sure to update latest score from feed?"
                      onConfirm={() =>
                        this.updateLatestScoreFromFeed(matchDetail)
                      }
                    >
                      <Button
                        style={{ marginLeft: '5px', color: '#7c2a7d' }}
                        type="dashed"
                        size="small"
                      >
                        Update Latest Score From Feed
                      </Button>
                    </Popconfirm>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={12} style={{}}>
              Match Id: <strong>{matchDetail.seasonGameUid}</strong>
            </Col>
            <Col span={12} style={{}}>
              Feed Game Uid:{' '}
              <strong>
                {matchDetail.feedGameUid ? matchDetail.feedGameUid : 'N/A'}
              </strong>
            </Col>
            <Col span={12} style={{}}>
              Match Format:{' '}
              <strong>
                {matchDetail.matchFormat ? matchDetail.matchFormat : 'N/A'}
              </strong>
            </Col>
            <Col span={12}>
              Match Registration Live Time:
              <strong
                style={{
                  backgroundColor: moment(matchDetail.startTime).isSame(
                    moment(matchDetail.hardstopTime)
                  )
                    ? 'white'
                    : 'yellow'
                }}
              >
                {' '}
                {moment(matchDetail.startTime).format('YYYY-MM-DD HH:mm')}
              </strong>
            </Col>
            <Col span={12}>
              Sub Title: <strong>{matchDetail.subTitle}</strong>
            </Col>
            <Col span={12}>
              Match Registration Start Time:{' '}
              <strong>
                {' '}
                {moment(matchDetail.foreshadowTime).format('YYYY-MM-DD HH:mm')}
              </strong>
            </Col>
            <Col span={12}>
              Match Venue: <strong>{matchDetail.matchVenue}</strong>
            </Col>
            <Col span={12}>
              Match Registration End Time:
              <strong
                style={{
                  backgroundColor: moment(matchDetail.startTime).isSame(
                    moment(matchDetail.hardstopTime)
                  )
                    ? 'white'
                    : 'yellow'
                }}
              >
                {' '}
                {moment(matchDetail.hardstopTime).format('YYYY-MM-DD HH:mm')}
              </strong>
            </Col>
            <Col span={12}>
              Teams Allowed: <strong>{matchDetail.teamsAllowed}</strong>
            </Col>
            <Col span={12}>
              Teams Registered:{' '}
              <Button
                size={'small'}
                type="dashed"
                style={{ color: 'green' }}
                onClick={() => this.showCount()}
              >
                Show Count
              </Button>
            </Col>
            <Col span={12}>
              Match Final Status:{' '}
              <strong>{matchDetail.matchFinalStatus}</strong>
            </Col>
            <Col span={12}>
              Total Contests:{' '}
              <Button
                size={'small'}
                type="dashed"
                style={{ color: 'blue' }}
                onClick={() => this.showContestCount()}
              >
                Contest Count
              </Button>
            </Col>
            <Col span={12}>
              League Name: <strong>{matchDetail.leagueName}</strong>
            </Col>
            <Col span={12}>
              Money Details:{' '}
              <Button
                size={'small'}
                type="dashed"
                style={{ color: '#bd9e4a' }}
                onClick={() => this.showMoneyDetails()}
              >
                Money Details
              </Button>
            </Col>
            <Col span={12}>
              Order Id: <strong>{matchDetail.orderId}</strong>
            </Col>
            <Col span={12}>
              Country Name:{' '}
              <strong>
                {matchDetail.extraInfo &&
                JSON.parse(matchDetail.extraInfo).countryLevelMapping &&
                JSON.parse(matchDetail.extraInfo).countryLevelMapping
                  .allowedCountry
                  ? JSON.stringify(
                      JSON.parse(matchDetail.extraInfo).countryLevelMapping
                        .allowedCountry
                    )
                  : 'N/A'}
              </strong>
            </Col>
            <Col span={12}>
              Cadence Type:{' '}
              <strong>
                {matchDetail.extraInfo &&
                JSON.parse(matchDetail.extraInfo).masterContestType
                  ? JSON.stringify(
                      JSON.parse(matchDetail.extraInfo).masterContestType
                    )
                  : 'N/A'}
              </strong>
            </Col>
            {this.props.tabType === 'UPCOMING' && (
              <Col span={12}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => this.createDefaultContests()}
                >
                  Create Default Contests
                </Button>
              </Col>
            )}
            {this.state.isAdmin && (
              <Col span={12}>
                <Button
                  onClick={() => this.cancelMatch()}
                  type="danger"
                  size="small"
                  style={{ marginLeft: '5px' }}
                >
                  Cancel Match
                </Button>
              </Col>
            )}
            {this.props.tabType === 'LIVE' && (
              <Col span={12}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => this.moveToUpcoming()}
                >
                  Move to Upcoming
                </Button>
              </Col>
            )}
            <Col style={{ marginTop: '5px' }} span={24}>
              <Col span={14}>
                <Button
                  onClick={() =>
                    this.fetchContests(
                      this.state.pageNum,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false
                    )
                  }
                >
                  Non-Recurring Contests
                </Button>
                <Button
                  onClick={() =>
                    this.fetchContests(
                      this.state.pageNum,
                      true,
                      false,
                      false,
                      false,
                      false,
                      false
                    )
                  }
                >
                  Recurring Contests
                </Button>
                <Button
                  onClick={() =>
                    this.fetchContests(
                      this.state.pageNum,
                      false,
                      false,
                      true,
                      false,
                      false
                    )
                  }
                >
                  {'Total Slots < 6'}
                </Button>
                <Button
                  onClick={() =>
                    this.fetchContests(
                      this.state.pageNum,
                      false,
                      false,
                      false,
                      true,
                      false,
                      false
                    )
                  }
                >
                  {'UGC'}
                </Button>
                <Button
                  onClick={() =>
                    this.fetchContests(
                      this.state.pageNum,
                      false,
                      false,
                      false,
                      false,
                      true,
                      false
                    )
                  }
                >
                  {'PAJ'}
                </Button>
                <Button
                  onClick={() =>
                    this.fetchContests(
                      this.state.pageNum,
                      false,
                      false,
                      false,
                      false,
                      false,
                      true
                    )
                  }
                >
                  {'Is Not NGC'}
                </Button>
                <Button onClick={() => this.searchContest()}>{'Search'}</Button>
                <Button onClick={() => this.searchContestById()}>
                  {'Search By Id'}
                </Button>
              </Col>
              <Col span={10}>
                <Col span={4}>
                  <Button size="small" onClick={() => this.hideContests()}>
                    Hide List
                  </Button>
                </Col>
                {this.props.tabType !== 'UPCOMING' && (
                  <Col span={12}>
                    <Button
                      size="small"
                      onClick={() => this.openPlayScoreModal(matchDetail)}
                    >
                      Get Score
                    </Button>
                    {/* <Button
                      style={{ marginLeft: '2px' }}
                      size='small'
                      onClick={() =>
                        this.openPlayerScoreDetailModal(matchDetail)
                      }
                    >
                      Score Detail
                    </Button> */}
                  </Col>
                )}
                {matchDetail.matchFinalStatus === 'WAITING_FOR_LEADERBOARD' && (
                  <Col span={4}>
                    <Popconfirm
                      title="Sure to initiate winnings?"
                      onConfirm={() => this.initiateWinnings(matchDetail)}
                    >
                      <Button size="small">Initiate Winnings</Button>
                    </Popconfirm>
                  </Col>
                )}
                {this.state.selectedRowKeysContest.length > 0 && (
                  <Col span={4}>
                    <Button
                      size="small"
                      style={{ backgroundColor: 'orange', marginLeft: '1px' }}
                      type="dashed"
                      onClick={() => this.cloneMultpleContests()}
                    >
                      Clone Multiple
                    </Button>
                  </Col>
                )}
              </Col>
              {this.state.selectedRowKeysContest.length > 0 && (
                <Col span={4}>
                  <Button
                    size="small"
                    style={{ marginTop: '5px' }}
                    type="primary"
                    onClick={() => this.openMultiContestDetailModal()}
                  >
                    Update Contests
                  </Button>
                  <Button
                    size="small"
                    style={{ marginTop: '5px', color: 'green' }}
                    onClick={() => this.openCreateMasterContestModal()}
                  >
                    Create Master Contests
                  </Button>
                </Col>
              )}
            </Col>
            {this.state.searchContestFlag && (
              <Col style={{ marginTop: '16px' }} span={14}>
                <Col span={4}>Search Contest:</Col>
                <Col span={10}>
                  <Input.Search
                    placeholder="contest name"
                    enterButton
                    size="medium"
                    onSearch={value => this.searchContestCall(value)}
                  />
                </Col>
              </Col>
            )}
            {this.state.searchContestByIdFlag && (
              <Col style={{ marginTop: '16px' }} span={14}>
                <Col span={4}>Search Contest By Id:</Col>
                <Col span={10}>
                  <Input.Search
                    placeholder="contest by id"
                    enterButton
                    onSearch={value => this.searchContestByIdCall(value)}
                  />
                </Col>
              </Col>
            )}
            {this.state.showContests && (
              <Col span={24}>
                <div style={{ marginTop: '5px' }}>
                  {this.state.selectedRowKeysContest &&
                    this.state.selectedRowKeysContest.length > 0 && (
                      <Tag color="green">
                        NUMBER OF SELECTED CONTESTS:{' '}
                        {this.state.selectedRowKeysContest.length}
                      </Tag>
                    )}
                </div>
                <Table
                  rowKey="id"
                  bordered
                  pagination={false}
                  dataSource={this.state.contestsList}
                  columns={columns}
                  rowClassName={(record, index) =>
                    record.recurOnFull ? 'highlight-contest-row' : ''
                  }
                  rowSelection={rowSelectionContest}
                  scroll={{ x: '100%' }}
                />
                <Pagination
                  current={this.state.pageNum}
                  defaultCurrent={this.state.pageNum}
                  onChange={(page, pageSize) =>
                    this.onPageChange(page, pageSize)
                  }
                  total={
                    this.state.totalContests ? this.state.totalContests : 30
                  }
                  pageSize={30}
                />
                {this.state.csvData ? (
                  <CSVLink
                    data={this.state.csvData}
                    filename={matchDetail.seasonGameUid.toString()}
                  >
                    <Button>Download CSV</Button>
                  </CSVLink>
                ) : (
                  <Button onClick={() => this.getAllContests()}>
                    Load Data for CSV Download
                  </Button>
                )}
              </Col>
            )}
          </Row>
        </Card>
        <Modal
          title={
            this.state.configDetails
              ? 'config Details'
              : 'Select Decativation Time'
          }
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal}
          onOk={handleOk}
          visible={this.state.showConfigModal}
        >
          <Card bordered={false}>{this.state.configDetails}</Card>
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal}
          onOk={handleOk}
          visible={this.state.showMatchDetailModal}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            {this.state.matchDetail}
          </Card>
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={1200}
          onCancel={hideModal2}
          onOk={handleOk2}
          visible={this.state.showRosterModal}
          footer={
            this.props.matchLevelEdit && [
              <Button onClick={() => this.updatePlayingStatus()}>
                Update Playing List
              </Button>,
              <Button onClick={refreshRoster}>Update</Button>,
              <Popconfirm
                title="Sure to verify this roster?"
                onConfirm={verifyRoster}
              >
                <Button type="primary">Verify Roster</Button>
              </Popconfirm>,
              <Popconfirm
                title="Sure to mark all the players as non-playing?"
                onConfirm={() => this.markAllAsNonPlaying()}
              >
                <Button type="danger">Mark All As Non Playing</Button>
              </Popconfirm>
            ]
          }
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Card type="inner">
              <Input
                placeholder={'Search'}
                onChange={e => this.searchTable(e)}
              />
            </Card>
            <div style={{ marginTop: '5px' }}>
              {this.state.selectedRowKeys &&
                this.state.selectedRowKeys.length > 0 && (
                  <Tag color="green">
                    NUMBER OF SELECTED PLAYERS:{' '}
                    {this.state.selectedRowKeys.length}
                  </Tag>
                )}
            </div>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.playerDetailsList}
              columns={rosterColumns}
              rowSelection={rowSelection}
            />
          </Card>
        </Modal>
        <Modal
          title={'Team Registered Counts'}
          closable={true}
          maskClosable={true}
          width={900}
          onCancel={hideModal3}
          onOk={handleOk3}
          visible={this.state.showTeamCountModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                Total Registered Team: {this.state.totalRegisteredTeamcount}
              </Col>
              <Col span={24}>
                Total Registered Token Team:{' '}
                {this.state.totalRegisteredTokenTeamcount}
              </Col>
              <Col span={24}>
                Total Registered Cash Team:{' '}
                {this.state.totalRegisteredCashTeamcount}
              </Col>
              <Col span={24}>
                Total Registered Free Team:{' '}
                {this.state.totalRegisteredFreeTeamcount}
              </Col>
              <Col span={24}>
                Total Registered UGC Team:{' '}
                {this.state.totalRegisteredUGCTeamcount}
              </Col>
              <Col span={24}>
                Total Registered Challenge Team:{' '}
                {this.state.totalRegisteredChallengeTeamcount}
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title={'Player Stats'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal4}
          onOk={handleOk4}
          visible={this.state.showPlayerStat}
        >
          {this.state.isUserProfileEdit ? (
            <Card
              title="Player information"
              extra={
                <Button
                  onClick={() => this.updateUserProfileModal()}
                  icon="up"
                />
              }
            >
              <EditUserProfile
                playerInfo={this.state.playerStat}
                matchId={this.props.matchDetail.seasonGameUid}
              />
            </Card>
          ) : (
            <Card
              title="Player information"
              extra={
                <Button
                  onClick={() => this.setState({ isUserProfileEdit: true })}
                  icon="edit"
                />
              }
            >
              <Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={100}
                    src={this.state.playerStat.playerImage}
                  />
                }
                title={this.state.playerStat.title}
                description={
                  <Row>
                    <Col span={12}>
                      Team Name:{' '}
                      <strong>{this.state.playerStat.teamName}</strong>
                    </Col>
                    <Col span={12}>
                      Total Point:{' '}
                      <strong>{this.state.playerStat.totalPoint}</strong>
                    </Col>
                    <Col span={12}>
                      Playing Role:{' '}
                      <strong>{this.state.playerStat.playingRole}</strong>
                    </Col>
                    <Col span={12}>
                      Batting Style:
                      <strong>{this.state.playerStat.battingStyle}</strong>
                    </Col>
                    <Col span={12}>
                      Bowling Style:
                      <strong>{this.state.playerStat.bowlingStyle}</strong>
                    </Col>
                    <Col span={24}>Player Stat History:</Col>
                    <Table
                      rowKey="id"
                      bordered
                      pagination={false}
                      dataSource={this.state.playerStat.playerStatHistory}
                      columns={[
                        {
                          title: 'Match Start Date',
                          dataIndex: 'matchStartDate',
                          key: 'matchStartDate',
                          render: (text, record) => (
                            <span>
                              <span>
                                {moment(record.matchStartDate).format(
                                  'YYYY-MM-DD HH:mm'
                                )}
                              </span>
                            </span>
                          )
                        },
                        {
                          title: 'Match Title',
                          dataIndex: 'matchTitle',
                          key: 'matchTitle'
                        },
                        {
                          title: 'Point',
                          dataIndex: 'point',
                          key: 'point'
                        }
                      ]}
                    />
                  </Row>
                }
              />
            </Card>
          )}
        </Modal>
        <Modal
          title={'Refund Contest'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal5}
          onOk={handleOk5}
          visible={this.state.cancelContestModal}
        >
          <Card>
            Enter Password
            <Input.Password
              value={this.state.password}
              onChange={this.changePassword}
              placeholder="input password"
            />
          </Card>
        </Modal>
        <Modal
          title={'Multple Cloning'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal6}
          onOk={handleOk6}
          visible={this.state.showMultipleSelectionModal}
        >
          <Card>
            Select Matches
            <Select
              mode="multiple"
              style={{ width: '70%' }}
              placeholder="Please select"
              onChange={this.handleMultipleSelect}
            >
              {this.state.matchList}
            </Select>
          </Card>
        </Modal>
        <Modal
          title={'Total Contest Count'}
          closable={true}
          maskClosable={true}
          width={900}
          onCancel={hideModal7}
          onOk={handleOk7}
          visible={this.state.showContestCountModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={8}>
                Total Contest Count:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalContestCount &&
                    this.state.totalContestCount.TOTAL}
                </strong>
              </Col>
              <Col span={8}>
                Total Contest Count IN:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalContestCount &&
                    this.state.totalContestCount.IN}
                </strong>
              </Col>
              <Col span={8}>
                Total Contest Count ID:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalContestCount &&
                    this.state.totalContestCount.ID}
                </strong>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                Total Cash Contest Count:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalCashContestCount &&
                    this.state.totalCashContestCount.TOTAL}
                </strong>
              </Col>
              <Col span={8}>
                Total Cash Contest Count IN:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalCashContestCount &&
                    this.state.totalCashContestCount.IN}
                </strong>
              </Col>
              <Col span={8}>
                Total Cash Contest Count ID:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalCashContestCount &&
                    this.state.totalCashContestCount.ID}
                </strong>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                Total Free Contest Count:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalFreeContestCount &&
                    this.state.totalFreeContestCount.TOTAL}
                </strong>
              </Col>
              <Col span={8}>
                Total Free Contest Count IN:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalFreeContestCount &&
                    this.state.totalFreeContestCount.IN}
                </strong>
              </Col>
              <Col span={8}>
                Total Free Contest Count ID:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalFreeContestCount &&
                    this.state.totalFreeContestCount.ID}
                </strong>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                Total UGC Contest Count:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalUGCContestCount &&
                    this.state.totalUGCContestCount.TOTAL}
                </strong>
              </Col>
              <Col span={8}>
                Total UGC Contest Count IN:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalUGCContestCount &&
                    this.state.totalUGCContestCount.IN}
                </strong>
              </Col>
              <Col span={8}>
                Total UGC Contest Count ID:{' '}
                <strong style={{ color: '#f47d42' }}>
                  {this.state.totalUGCContestCount &&
                    this.state.totalUGCContestCount.ID}
                </strong>
              </Col>
            </Row>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.groupContestCount}
              columns={contestColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={'Refund Match'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal8}
          onOk={handleOk8}
          visible={this.state.showRefundMatchModal}
        >
          <Card>
            Enter Password
            <Input.Password
              value={this.state.password}
              onChange={this.changePassword}
              placeholder="input password"
            />
          </Card>
        </Modal>
        <Modal
          title={'Download Leaderboard'}
          closable={true}
          maskClosable={true}
          width={900}
          onCancel={hideModal9}
          onOk={handleOk9}
          visible={this.state.showDownloadModal}
        >
          <Card bordered={false}>
            Limit:{' '}
            <Input
              style={{ width: 200 }}
              onChange={this.changeLimit}
              placeholder={'Enter limit'}
            />
            <Button onClick={() => this.fetchLeaderboard()}>Submit</Button>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.leaderboardData}
              columns={leaderboardColumns}
            />
            {this.state.leaderboardData.length > 0 && (
              <CSVLink
                data={this.state.leaderboardData}
                filename={'Leaderboard'}
              >
                <Button>Download CSV</Button>
              </CSVLink>
            )}
          </Card>
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={1200}
          onCancel={hidePlayerScoreModal}
          onOk={handlePlayerScoreModalOk}
          visible={this.state.showPlayerScoreModal}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <div style={{ marginTop: '5px' }}>
              <Tag color="green">
                NUMBER OF PLAYERS WITH POINTS: {this.state.countOfPointPlayer}
              </Tag>
            </div>
            <Table
              rowKey="playerUid"
              bordered
              pagination={false}
              dataSource={this.state.playerScoreList}
              columns={playerScoreColumns}
              // rowSelection={rowSelection}
            />
          </Card>
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={handleEditPlayerScoreModalOk}
          onOk={handleEditPlayerScoreModalOk}
          visible={this.state.showPlayerScoreEditModal}
        >
          <EditPlayerScore
            playerScoreInfo={this.state.selectedPlayerScore}
            seasonGameUid={this.props.matchDetail.seasonGameUid}
          />
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={hideCreateDefaultContestModal}
          onOk={handleCreateDefaultContestModalOk}
          okText="Save"
          visible={this.state.showCreateDefaultContestModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                <strong>Season Game UId:</strong>{' '}
                {this.props.matchDetail.seasonGameUid}
              </Col>
              <Col style={{ marginTop: '10px' }} span={24}>
                <Select
                  showSearch
                  mode="multiple"
                  onChange={e => this.selectMasterContestType(e)}
                  style={{ width: '70%' }}
                  placeholder="Select master contest type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.masterContestTypeList}
                </Select>{' '}
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closePlayerScoreDetailModal()}
          onOk={() => this.closePlayerScoreDetailModal()}
          visible={this.state.showPlayerScoreDetailModal}
          footer={[
            <Button
              key="back"
              onClick={() => this.closePlayerScoreDetailModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="playerId"
              bordered
              pagination={false}
              dataSource={this.state.playerScoreDetailList}
              columns={playerScoreDetailColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={this.state.pointsPlayerName}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closePlayerPointsModal()}
          onOk={() => this.savePlayerPoints()}
          okText="Save"
          visible={this.state.showPlayerPointsModal}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="eventName"
              bordered
              pagination={false}
              dataSource={this.state.playerScorePointsList}
              columns={playerScorePointsColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={'Update Multiple Contests'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeMultiContestDetailModal()}
          onOk={() => this.updateMultiContestDetail()}
          visible={this.state.showMultiContestDetailModal}
        >
          <Card>
            <Row>
              <Col span={24}>
                Select Status: {'  '}
                <Select
                  value={this.state.newContestStatus}
                  style={{ width: '70%' }}
                  placeholder="Please select"
                  onChange={e => this.selectNewContestStatus(e)}
                >
                  {ContestStatus}
                </Select>
              </Col>
              {this.state.showPasswordField && (
                <Col span={24}>
                  Password: {'  '}
                  <Input.Password
                    style={{ width: '70%' }}
                    value={this.state.multiPassword}
                    onChange={e => this.changeMultiPassword(e.target.value)}
                    placeholder="input password"
                  />
                </Col>
              )}
            </Row>
          </Card>
        </Modal>
        <Modal
          title={'Cancel Match'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideCancelModal}
          onOk={handleCancelModal}
          visible={this.state.showCancelMatchModal}
        >
          <Card>
            Enter Password
            <Input.Password
              value={this.state.password}
              onChange={this.changePassword}
              placeholder="input password"
            />
          </Card>
        </Modal>
        <Modal
          title={'Match Notification Modal: ' + matchDetail.seasonGameUid}
          closable={true}
          maskClosable={true}
          width={1200}
          onCancel={() => this.closeMatchNotificationModal()}
          onOk={() => this.closeMatchNotificationModal()}
          visible={this.state.showMatchNotificationModal}
          footer={[
            <Button
              key="back"
              onClick={() => this.closeMatchNotificationModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            <Table
              rowKey="matchNotificationId"
              bordered
              pagination={false}
              dataSource={this.state.matchNotifications}
              columns={matchNotificationColumns}
            />
          </Card>
        </Modal>
        <Modal
          title={'Edit Notification: ' + matchDetail.seasonGameUid}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeEditNotificatioModal()}
          onOk={() => this.saveNotificationChanges()}
          visible={this.state.showEditNotificationModal}
          okText={'Save'}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            {this.state.selectedNotification &&
              this.state.selectedNotification.matchNotificationId && (
                <Row>
                  <Col span={24}>
                    <Col span={6}>
                      <strong>Segment Type: </strong>
                    </Col>
                    <Col span={18}>
                      <Select
                        value={this.state.selectedNotification.segmentType}
                        style={{ width: '70%' }}
                        onSelect={e => this.setSegment(e)}
                      >
                        {this.state.segmentOptionList}
                      </Select>
                    </Col>
                  </Col>
                  <Col span={24} style={{ marginTop: '10px' }}>
                    <Col span={6}>
                      <strong>Notification Title: </strong>
                    </Col>
                    <Col span={18}>
                      <Input
                        value={
                          this.state.selectedNotification.notificationTitle
                        }
                        style={{ width: '70%' }}
                        onChange={e =>
                          this.setNotificationTitle(e.target.value)
                        }
                      />
                    </Col>
                  </Col>
                  <Col span={24} style={{ marginTop: '10px' }}>
                    <Col span={6}>
                      <strong>Notification Body: </strong>
                    </Col>
                    <Col span={18}>
                      <Input
                        value={this.state.selectedNotification.notificationBody}
                        style={{ width: '70%' }}
                        onChange={e => this.setNotificationBody(e.target.value)}
                      />
                    </Col>
                  </Col>
                </Row>
              )}
          </Card>
        </Modal>
        <Modal
          title={'Send Notification Manually: ' + matchDetail.seasonGameUid}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeSendManualModal()}
          onOk={() => this.sendManualNotification()}
          visible={this.state.showSendManualModal}
          okText={'Send'}
        >
          <Card style={{ whiteSpace: 'pre-wrap' }} bordered={false}>
            {this.state.selectedNotification &&
              this.state.selectedNotification.matchNotificationId && (
                <Row>
                  <Col span={24} style={{ marginTop: '10px' }}>
                    <Col span={6}>
                      <strong>Enter Mobile Numbers: </strong>
                    </Col>
                    <Col span={18}>
                      <Input
                        placeholder="Multiple numbers seperated by comma"
                        value={this.state.mobileNumbers}
                        style={{ width: '70%' }}
                        onChange={e => this.setMobileNumbers(e.target.value)}
                      />
                    </Col>
                  </Col>
                </Row>
              )}
          </Card>
        </Modal>
        <Modal
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.saveCreateMasterContestModal()}
          onCancel={() => this.closeCreateMasterContestModal()}
          okText="Save"
          visible={this.state.showCreateMasterContestModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                <strong>Season Game UId:</strong>{' '}
                {this.props.matchDetail.seasonGameUid}
              </Col>
              <Col style={{ marginTop: '10px' }} span={24}>
                <Select
                  showSearch
                  onChange={e => this.selectMasterContestTypeSingle(e)}
                  style={{ width: '70%' }}
                  placeholder="Select master contest type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.masterContestTypeList}
                </Select>{' '}
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title={'Update All Contests'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeUpdateAllContestModal()}
          onOk={() => this.makeUpdateAllContestCall()}
          visible={this.state.showUpdateAllContestModal}
        >
          <Card>
            <Row>
              <Col span={24}>
                Select Status: {'  '}
                <Select
                  value={this.state.updateAllContestStatus}
                  style={{ width: '70%' }}
                  placeholder="Please select"
                  onChange={e => this.selectUpdateAllContestStatus(e)}
                >
                  {ContestStatus}
                </Select>
              </Col>
              <Col span={24}>
                Password: {'  '}
                <Input.Password
                  style={{ width: '70%' }}
                  value={this.state.updateAllPassword}
                  onChange={e => this.changeUpdateAllPassword(e.target.value)}
                  placeholder="input password"
                />
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title={'Money Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeMoneyDetailsModal()}
          onOk={() => this.closeMoneyDetailsModal()}
          visible={this.state.showMoneyDetailsModal}
          footer={[
            <Button
              key="close-money-details"
              onClick={() => this.closeMoneyDetailsModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card bordered={false}>
            {this.state.moneyDetailType == 'MATCH_LEVEL' ? (
              <Table
                rowKey="type"
                bordered
                pagination={false}
                dataSource={this.state.moneyTableData}
                columns={matchLevelTableColumns}
              />
            ) : (
              <Row>
                <Col span={24}>
                  Total Participation:{' '}
                  {this.state.moneyDetails.totalParticipation
                    ? this.state.moneyDetails.totalParticipation
                    : 0}
                </Col>
                <Col span={24}>
                  Total Winning:{' '}
                  {this.state.moneyDetails.totalWinning
                    ? this.state.moneyDetails.totalWinning
                    : 0}
                </Col>
                <Col span={24}>
                  Total Refund:{' '}
                  {this.state.moneyDetails.totalRefund
                    ? this.state.moneyDetails.totalRefund
                    : 0}
                </Col>
                <Col span={24}>
                  Total Entry Fee Back:{' '}
                  {this.state.moneyDetails.totalEntryFeeBack
                    ? this.state.moneyDetails.totalEntryFeeBack
                    : 0}
                </Col>
                {this.state.participationAmountDetails &&
                  this.state.participationAmountDetails.length > 0 && (
                    <Col span={24}>
                      {this.state.participationAmountDetails.map(
                        participationAmountDetail => {
                          return (
                            <span
                              style={{ marginRight: '5px' }}
                              key={
                                'participationAmountDetail' +
                                participationAmountDetail[0]
                              }
                            >
                              Participation {participationAmountDetail[0]}:{' '}
                              {participationAmountDetail[1]}
                            </span>
                          );
                        }
                      )}
                    </Col>
                  )}
                {this.state.winningAmountDetails &&
                  this.state.winningAmountDetails.length > 0 && (
                    <Col span={24}>
                      {this.state.winningAmountDetails.map(
                        winningAmountDetail => {
                          return (
                            <span
                              style={{ marginRight: '5px' }}
                              key={
                                'winningAmountDetail' + winningAmountDetail[0]
                              }
                            >
                              Winning {winningAmountDetail[0]}:{' '}
                              {winningAmountDetail[1]}
                            </span>
                          );
                        }
                      )}
                    </Col>
                  )}
                {this.state.refundAmountDetails &&
                  this.state.refundAmountDetails.length > 0 && (
                    <Col span={24}>
                      {this.state.refundAmountDetails.map(
                        refundAmountDetail => {
                          return (
                            <span
                              style={{ marginRight: '5px' }}
                              key={'refundAmountDetail' + refundAmountDetail[0]}
                            >
                              Refund {refundAmountDetail[0]}:{' '}
                              {refundAmountDetail[1]}
                            </span>
                          );
                        }
                      )}
                    </Col>
                  )}
                {this.state.entryFeeBackAmountDetails &&
                  this.state.entryFeeBackAmountDetails.length > 0 && (
                    <Col span={24}>
                      {this.state.entryFeeBackAmountDetails.map(
                        entryFeeBackAmountDetail => {
                          return (
                            <span
                              style={{ marginRight: '5px' }}
                              key={
                                'entryFeeBackAmountDetail' +
                                entryFeeBackAmountDetail[0]
                              }
                            >
                              Entry Fee BacK {entryFeeBackAmountDetail[0]}:{' '}
                              {entryFeeBackAmountDetail[1]}
                            </span>
                          );
                        }
                      )}
                    </Col>
                  )}
              </Row>
            )}
          </Card>
        </Modal>
        <Modal
          title={'Contest Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeContestDetailModal()}
          onOk={() => this.closeContestDetailModal()}
          visible={this.state.showContestDetailModal}
          footer={[
            <Button
              key="close-money-details"
              onClick={() => this.closeContestDetailModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card bordered={false}>
            {this.state.contestDetail.id && (
              <Row>
                <Col span={12}>
                  <strong>Id:</strong> {this.state.contestDetail.id}
                </Col>
                <Col span={12}>
                  <strong>Name:</strong>{' '}
                  {this.state.contestDetail.name
                    ? this.state.contestDetail.name
                    : 'Not Available'}
                </Col>
                <Col span={12}>
                  <strong>Slots Filled:</strong>{' '}
                  {this.state.contestDetail.slotsFilled
                    ? this.state.contestDetail.slotsFilled
                    : 0}
                </Col>
                <Col span={12}>
                  <strong>Total Slots:</strong>{' '}
                  {this.state.contestDetail.totalSlots
                    ? this.state.contestDetail.totalSlots
                    : 0}
                </Col>
                <Col span={12}>
                  <strong>Fill Ratio:</strong>{' '}
                  {this.state.contestDetail.slotsFilled
                    ? (
                        (this.state.contestDetail.slotsFilled * 100) /
                        this.state.contestDetail.totalSlots
                      ).toFixed(2)
                    : 0}
                </Col>
                <Col span={12}>
                  <strong>Teams Allowed:</strong>{' '}
                  {this.state.contestDetail.teamsAllowed
                    ? this.state.contestDetail.teamsAllowed
                    : 0}
                </Col>
                <Col span={12}>
                  <strong>Entry Fee Type:</strong>{' '}
                  {this.state.contestDetail.registrationFeesType
                    ? this.state.contestDetail.registrationFeesType
                    : 'Not Available'}
                </Col>
                <Col span={12}>
                  <strong>Entry Fee:</strong>{' '}
                  {this.state.contestDetail.registrationFees
                    ? this.state.contestDetail.registrationFees
                    : 0}
                </Col>
                <Col span={12}>
                  <strong>Registraion End time:</strong>{' '}
                  {this.state.contestDetail.registrationEndTime
                    ? moment(
                        this.state.contestDetail.registrationEndTime
                      ).format('YYYY-MM-DD HH:mm')
                    : 'Not Available'}
                </Col>
                <Col span={12}>
                  <strong>Match Id:</strong>{' '}
                  {this.state.contestDetail.seasonGameUid
                    ? this.state.contestDetail.seasonGameUid
                    : 'Not Available'}
                </Col>
                <Col span={24}>
                  <strong>App Type:</strong>{' '}
                  {this.state.contestDetail.appType
                    ? this.state.contestDetail.appType.join(', ')
                    : 'Not Available'}
                </Col>
              </Row>
            )}
          </Card>
        </Modal>
        <Modal
          title={
            'Process Credit Winnings: ' + this.state.creditWinningContestId
          }
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeCreditWinningModal()}
          onOk={() => this.processCreditWinnings()}
          visible={this.state.showCreditWinningModal}
        >
          <Card>
            <Row>
              <Col span={24} style={{ margin: '10px' }}>
                Credit Token Prize: {'  '}
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  value={
                    this.state.creditWinningToken
                      ? this.state.creditWinningToken
                      : false
                  }
                  onChange={e => this.updateCreditWinningToken(e.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </Radio.Group>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                Credit Cash Prize: {'  '}
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  value={
                    this.state.creditWinningCash
                      ? this.state.creditWinningCash
                      : false
                  }
                  onChange={e => this.updateCreditWinningCash(e.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </Radio.Group>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                Credit Bonus Cash Prize: {'  '}
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  value={
                    this.state.creditWinningBonus
                      ? this.state.creditWinningBonus
                      : false
                  }
                  onChange={e => this.updateCreditWinningBonus(e.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </Radio.Group>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                Password {'  '}
                <Input.Password
                  value={this.state.creditPassword}
                  onChange={e => this.updateCreditPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title={'Get ML Price'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeMLPriceModal()}
          onOk={() => this.closeMLPriceModal()}
          visible={this.state.showMlPriceModal}
          footer={[
            <Button
              key="close-ml-modal"
              onClick={() => this.closeMLPriceModal()}
            >
              Close
            </Button>
          ]}
        >
          <Card bordered={false}>
            {this.state.mlResponse ? this.state.mlResponse : 'Not available'}
          </Card>
        </Modal>
        <Modal
          title={'Set ML Price'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeSetMlPriceModal()}
          onOk={() => this.setMlPrice()}
          okText="Save"
          visible={this.state.showSetMlPriceModal}
        >
          <Card bordered={false}>
            <Input
              value={this.state.mlPrice}
              onChange={e => this.updateSetMlPrice(e.target.value)}
            />
            <Tag color="green">Note: Enter price points separated by comma</Tag>
          </Card>
        </Modal>
        <Modal
          title={'Match Id: ' + matchDetail.seasonGameUid}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeFantasyAssistantModal()}
          visible={this.state.showFantasyAssistantModel}
          onOk={() => this.setFantasyAssistant(matchDetail.seasonGameUid)}
          okText="Submit"
          okButtonProps={{ disabled: this.state.isFantasyAssistant }}
        >
          <Form>
            <span style={{ marginLeft: '100px' }}>Assistant Match Id:</span>{' '}
            <InputNumber
              style={{ width: '30%', margin: '5px' }}
              placeholder="Enter Match Id"
              value={this.state.fantasyAssistantMatchId}
              onChange={e => this.handleChangeFantasyAssistant(e)}
            ></InputNumber>
            <Button
              type="primary"
              style={{ margin: '50px' }}
              onClick={() => this.handleSubmitFantasyAssistant()}
            >
              Search
            </Button>
            {this.state.isFantasyAssistant == false && (
              <Card style={{ whiteSpace: 'pre-wrap' }} bordered={true}>
                <Row>
                  {' '}
                  Match Id :- {this.state.fantasyAssistantData[0].matchId}
                </Row>
                <Row>
                  {' '}
                  Away Team Name :-
                  {this.state.fantasyAssistantData[0].awayTeamName}
                </Row>
                <Row>
                  {' '}
                  Home Team Name :-
                  {this.state.fantasyAssistantData[0].homeTeamName}
                </Row>
                <Row>
                  {' '}
                  Match Date :- {this.state.fantasyAssistantData[0].matchDate}
                </Row>
              </Card>
            )}
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    contests: state.fantasy.contests,
    fantasy: state.fantasy,
    matchList: state.fantasy.matches,
    getMatchPlayerScoreResponse: state.fantasy.getMatchPlayerScoreResponse,
    initiatePrizeDistributionResponse:
      state.fantasy.initiatePrizeDistributionResponse,
    getAllMasterContestTypeResponse:
      state.fantasy.getAllMasterContestTypeResponse,
    createDefaultContestResponse: state.fantasy.createDefaultContestResponse,
    getPlayerScoreDetailResponse: state.fantasy.getPlayerScoreDetailResponse,
    updateMultiContestDetailResponse:
      state.fantasy.updateMultiContestDetailResponse,
    updatePlayerScoreDetailResponse:
      state.fantasy.updatePlayerScoreDetailResponse,
    refundMatchResponse: state.fantasy.refundMatchResponse,
    cancelMatchResponse: state.fantasy.cancelMatchResponse,
    currentUser: state.auth.currentUser,
    getAllSegmentTypeResponse: state.fantasy.getAllSegmentTypeResponse,
    getMatchNotificationDetailResponse:
      state.fantasy.getMatchNotificationDetailResponse,
    editMatchNotficationResponse: state.fantasy.editMatchNotficationResponse,
    sendMatchNotficationManuallyResponse:
      state.fantasy.sendMatchNotficationManuallyResponse,
    createMasterContestFromMatchContestResponse:
      state.fantasy.createMasterContestFromMatchContestResponse,
    updateAllContestsForMatchResponse:
      state.fantasy.updateAllContestsForMatchResponse,
    getMatchLevelMoneyResponse:
      state.superteamLeaderboard.getMatchLevelMoneyResponse,
    getContestDetailByIdResponse: state.fantasy.getContestDetailByIdResponse,
    getContestLevelMoneyResponse:
      state.superteamLeaderboard.getContestLevelMoneyResponse,
    updateLatestScoreFromFeedResponse:
      state.fantasy.updateLatestScoreFromFeedResponse,
    creditContestWinningsResponse: state.fantasy.creditContestWinningsResponse,
    getContestMlPriceResponse: state.fantasy.getContestMlPriceResponse,
    setContestMlPriceResponse: state.fantasy.setContestMlPriceResponse,
    moveMatchFromLiveToUpcomingResponse:
      state.fantasy.moveMatchFromLiveToUpcomingResponse,
    getAssistantMatchDetailResponse:
      state.superteamCricketFeed.getAssistantMatchDetailResponse
  };
}

function mapDispatchToProps(dispatch) {
  const { getFantasyAssistantMatchDetailById } = superteamCricketFeedActions;
  return {
    actions: bindActionCreators(
      {
        ...fantasyActions,
        ...superteamLeaderboardActions,
        getFantasyAssistantMatchDetailById
      },
      dispatch
    )
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MatchCard)
);
