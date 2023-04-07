import { combineReducers } from 'redux';
import layout from './layoutReducer';
import auth from './authReducer';
import games from './gamesReducer';
import groups from './groupReducer';
import tournaments from './tournamentReducer';
import tournamentConfig from './tournamentConfigReducer';
import updater from './updaterReducer';
import banner from './bannersReducer';
import appOrder from './appOrderReducer';
import kyc from './kycReducer';
import user from './userReducer';
import leaderboard from './leaderboardReducer';
import limiter from './limiterReducer';
import sponsor from './sponsorReducer';
import segment from './segmentReducer';
import video from './videoReducer';
import coupon from './couponReducer';
import userProfile from './userProfileReducer';
import serverConfigs from './ServerConfigReducer';
import spinWheel from './SpinWheelReducer';
import hourlyQuiz from './HourlyQuizReducer';
import supportPayment from './SupportPaymentReducer';
import fantasy from './FantasyReducer';
import offers from './OffersReducer';
import userData from './UserDataReducer';
import searchConfig from './SearchConfigReducer';
import referralConfig from './ReferralConfigReducer';
import audioRoom from './AudioRoomReducer';
import influencer from './influencerReducer';
import tierWidget from './TierWidgetReducer';
import kabaddi from './KabaddiReducer';
import football from './FootballReducer';
import deal from './DealReducer';
import accounts from './AccountsReducer';
import rummyCustomer from './RummyCustomerReducer';
import lobbyLeaderboard from './lobbyLeaderboardReducer.js';
import stock from './StockReducer';
import fantasyConfig from './FantasyConfigReducer';
import interalTools from './InternalToolReducer';
import website from './websiteReducer';
import ug from './UserGeneratedReducer';
import basketball from './BasketballReducer';
import crm from './CrmReducer';
import superteamFeed from './SuperteamFeedReducer';
import zookeeper from './ZookeeperReducer';
import segmentation from './segmentationReducer';
import superteamLeaderboard from './SuperteamLeaderboardReducer';
import hockey from './HockeyReducer';
import notification from './NotificationReducer';
import superteamCricketFeed from './SuperteamCricketFeedReducer';
import referral from './ReferralReducer';
import clevertap from './ClevertapReducer';
import fraud from './fraudReducer';
import collectibles from './CollectiblesReducer';
import dynamicUpselling from './DynamicUpsellingReducer';
import homeConfig from './HomeConfigReducer';
import asn from './asnReducer';
import featuredConfig from './featuredConfigReducer';
import baseball from './BaseballReducer';
import i18nCMS from './I18nCMSReducer';
import story from './storyReducer';
import announcement from './AnnouncementReducer';
import pokerOps from './PokerOpsReducer';
import reactivationRewards from './reactivationRewardsConfigReducer';
import mlBasedConfig from './mlBasedConfigReducer';
import missions from './MissionConfigReducer';
import esports from './EsportsLeagueReducer';
import storage from './storageReducer';
import broadcast from './broadcastReducer';
import liveKo from './LiveKoReducer';
import prodInfra from './ProductInfraReducer';
import gameStreak from './GameStreakReducer';
import accountClosure from './AccountClosureReducer';

const reducers = {
  layout,
  auth,
  games,
  groups,
  tournaments,
  tournamentConfig,
  updater,
  limiter,
  banner,
  appOrder,
  kyc,
  user,
  segment,
  sponsor,
  leaderboard,
  video,
  userProfile,
  coupon,
  serverConfigs,
  spinWheel,
  hourlyQuiz,
  supportPayment,
  fantasy,
  offers,
  userData,
  searchConfig,
  referralConfig,
  audioRoom,
  influencer,
  tierWidget,
  kabaddi,
  football,
  deal,
  accounts,
  rummyCustomer,
  lobbyLeaderboard,
  stock,
  fantasyConfig,
  interalTools,
  website,
  ug,
  basketball,
  crm,
  superteamFeed,
  zookeeper,
  segmentation,
  superteamLeaderboard,
  hockey,
  notification,
  superteamCricketFeed,
  referral,
  clevertap,
  fraud,
  collectibles,
  dynamicUpselling,
  homeConfig,
  asn,
  featuredConfig,
  baseball,
  i18nCMS,
  story,
  announcement,
  pokerOps,
  reactivationRewards,
  mlBasedConfig,
  missions,
  esports,
  storage,
  broadcast,
  liveKo,
  prodInfra,
  gameStreak,
  accountClosure
};

const rootReducer = combineReducers({ ...reducers });

export default rootReducer;

// const createRootReducer = history =>
//   combineReducers({
//     router: connectRouter(history),
//     ...reducers
//   });
// export default createRootReducer;
