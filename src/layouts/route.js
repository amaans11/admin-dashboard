import * as roles from '../auth/userPermission';
import AllTournaments from '../components/AllTournaments';
import Updater from '../components/Updater';
import ListUpdates from '../components/Updater/ListUpdates';
import CreateConfig from '../components/TournamentConfig/CreateConfig';
import CreateBanner from '../components/Banner/CreateBanner';
import CreateBannerWebsite from '../components/Banner/CreateBannerWebsite';
import KycList from '../components/Kyc/KycList';
import KycDetails from '../components/Kyc/KycDetails';
import BulkKycSearch from '../components/Kyc/BulkKycSearch';
import AddUser from '../components/User/AddUser';
import UserDetails from '../components/User/UserDetails';
import LeaderBoard from '../components/LeaderBoard';
import SearchLeaderBoard from '../components/LeaderBoard/SearchLeaderBoard';
import CashBoard from '../components/LeaderBoard/CashBoard';
import UnBlockUser from '../components/LeaderBoard/UnBlockPlayer';
import CreateLimiter from '../components/Limiter/createLimiter';
import ListLimiter from '../components/Limiter/ListLimiter';
import CreateSegment from '../components/Segment/CreateSegment';
import ListSegment from '../components/Segment/ListSegment';
import ListBanner from '../components/Banner/ListBanners';
import ListSponsor from '../components/Sponsor/ListSponsor';
import CreateSponsor from '../components/Sponsor/CreateSponsor';
import CreateCoupon from '../components/coupon/CreateCoupon';
import SearchCoupon from '../components/coupon/SearchCoupon';
import ConfigTournament from '../components/Sponsor/ConfigTournament';
import GameOrderIndex from '../components/Game/GameOrderIndex';
import GameOrderDetails from '../components/Game/GameOrderDetails';
import ConfigOrder from '../components/Order/ConfigOrder';
import GameOrderList from '../components/Order/GameOrderList';
import ServerConfig from '../components/ServerConfig';
import SpinWheel from '../components/SpinWheel';
import CreateQuiz from '../components/HourlyQuiz/CreateQuiz';
import QuizList from '../components/HourlyQuiz/QuizList';
import Payment from '../components/Payment';
import CreateContest from '../components/Fantasy/CreateContest';
import CreateMatch from '../components/Fantasy/CreateMatch';
import MatchList from '../components/Fantasy/MatchList';
import ContestOrder from '../components/Fantasy/ContestOrder';
import CreateContestKabaddi from '../components/Kabaddi/CreateContest';
import CreateMatchKabaddi from '../components/Kabaddi/CreateMatch';
import MatchListKabaddi from '../components/Kabaddi/MatchList';
import ContestOrderKabaddi from '../components/Kabaddi/ContestOrder';
import SearchLobby from '../components/LeaderBoard/SearchLobby';
import CreateOffer from '../components/Offer/CreateOffer';
import ListOffer from '../components/Offer/ListOffer';
import SearchConfig from '../components/SearchConfig/SearchConfig';
import BackendConfig from '../components/ReferralConfig/BackendConfig';
import VerifyUser from '../components/VerifyUser/VerifyUser';
import BannerOrder from '../components/Banner/BannerOrder';
import UnfinishedTournament from '../components/LeaderBoard/UnfinishedTournament';
import AudioRoomList from '../components/AudioRoom/AudioRoomList';
import InfluencerList from '../components/Influencer/InfluencerList';
import Configure from '../components/TierWidget/Configure';
import TierWidgetView from '../components/TierWidget/TierWidgetView';
import SearchUser from '../components/User/SearchUser';
import RummyCreate from '../components/Rummy/RummyCreate';
import CreateContestFootball from '../components/Football/CreateContest';
import CreateMatchFootball from '../components/Football/CreateMatch';
import MatchListFootball from '../components/Football/MatchList';
import ContestOrderFootball from '../components/Football/ContestOrder';
import CreateMasterContest from '../components/Fantasy/CreateMasterContest';
import MasterContestList from '../components/Fantasy/MasterContestList';
import CreateMasterContestKabaddi from '../components/Kabaddi/CreateMasterContest';
import MasterContestListKabaddi from '../components/Kabaddi/MasterContestList';
import CreateMasterContestFootball from '../components/Football/CreateMasterContest';
import MasterContestListFootball from '../components/Football/MasterContestList';
import CreateProduct from '../components/Product/CreateProduct';
import ListProduct from '../components/Product/ListProduct';
import CreateDeal from '../components/Product/CreateDeal';
import ListDeal from '../components/Product/ListDeal';
import ListOrder from '../components/Product/ListOrder';
import RefundDashboard from '../components/RefundDashboard/RefundDashboard';
import LobbyLeaderboard from '../components/LeaderBoard/LobbyLeaderboard';
import SearchDetail from '../components/LeaderBoard/SearchDetail';
import CreateContestStock from '../components/Stock/CreateContest';
import CreateMatchStock from '../components/Stock/CreateMatch';
import MatchListStock from '../components/Stock/MatchList';
import ContestOrderStock from '../components/Stock/ContestOrder';
import CreateMasterContestStock from '../components/Stock/CreateMasterContest';
import MasterContestListStock from '../components/Stock/MasterContestList';
import RummyCustomerSupport from '../components/CustomerSupport/RummyCustomerSupport';
import Topic from '../components/AudioRoom/Topic';
import ArrangeFilterTags from '../components/AudioRoom/ArrangeFilterTags';
import CreateVoucher from '../components/Product/CreateVoucher';
import ListVoucher from '../components/Product/ListVoucher';
import UploadApk from '../components/Website/UploadApk';
import ReassignApk from '../components/Website/ReassignApk';
import FinishLobby from '../components/FinishLobby/FinishLobby';
import UserSearch from '../components/UserSearch/UserSearch';
import CRM from '../components/CustomerSupport/CRM';
import WipeUserProfile from '../components/CustomerSupport/WipeUserProfile';
import CreateContestBasketball from '../components/Basketball/CreateContest';
import CreateMatchBasketball from '../components/Basketball/CreateMatch';
import MatchListBasketball from '../components/Basketball/MatchList';
import ContestOrderBasketball from '../components/Basketball/ContestOrder';
import CreateMasterContestBasketball from '../components/Basketball/CreateMasterContest';
import MasterContestListBasketball from '../components/Basketball/MasterContestList';
import CreateAuction from '../components/Product/CreateAuction';
import ListAuction from '../components/Product/ListAuction';
import CreateWithdrawableVoucher from '../components/Product/CreateWithdrawableVoucher';
import ListWithdrawableVoucher from '../components/Product/ListWithdrawableVoucher';
import DebitDashboard from '../components/RefundDashboard/DebitDashboard';
import MarketingUploadApk from '../components/Website/MarketingUploadApk';
import MasterOrder from '../components/Fantasy/MasterOrder';
import MasterOrderKabaddi from '../components/Kabaddi/MasterOrder';
import MasterOrderFootball from '../components/Football/MasterOrder';
import MasterOrderStock from '../components/Stock/MasterOrder';
import MasterOrderBasketball from '../components/Basketball/MasterOrder';
import SuperteamFeed from '../components/SuperteamFeed/SuperteamFeed';
import League from '../components/SuperteamFeed/League';
import SLBanner from '../components/SuperteamLeaderboard/SLBanner';
import ListSLBanner from '../components/SuperteamLeaderboard/ListSLBanner';
import CreateLeaderboard from '../components/SuperteamLeaderboard/CreateLeaderboard';
import ListLeaderboard from '../components/SuperteamLeaderboard/ListLeaderboard';
import FraudCheck from '../components/Payment/FraudCheck';
import ApprovedWithdrawalRequest from '../components/Payment/ApprovedWithdrawalRequest';
import RejectedWithdrawalRequest from '../components/Payment/RejectedWithdrawalRequest';
import PendingWithdrawalRequest from '../components/Payment/PendingWithrawalRequest';
import TransactionDetails from '../components/Payment/TransactionDetails';
import DownloadTransactionDetails from '../components/Payment/DownloadTransactionDetails';
import SearchDevice from '../components/LeaderBoard/SearchDevice';
import CreateContestHockey from '../components/Hockey/CreateContest';
import CreateMatchHockey from '../components/Hockey/CreateMatch';
import MatchListHockey from '../components/Hockey/MatchList';
import ContestOrderHockey from '../components/Hockey/ContestOrder';
import CreateMasterContestHockey from '../components/Hockey/CreateMasterContest';
import MasterContestListHockey from '../components/Hockey/MasterContestList';
import MasterOrderHockey from '../components/Hockey/MasterOrder';
import SearchMatch from '../components/Fantasy/SearchMatch';
import KabaddiSearchMatch from '../components/Kabaddi/SearchMatch';
import FootballSearchMatch from '../components/Football/SearchMatch';
import StockSearchMatch from '../components/Stock/SearchMatch';
import BasketballSearchMatch from '../components/Basketball/SearchMatch';
import HockeySearchMatch from '../components/Hockey/SearchMatch';
import FileUploader from '../components/FileUploader/FileUploader';
import ZooUI from '../components/Zookeeper/ZooUI';
import BotMessage from '../components/Bot/BotMessage';
import SuperteamCricketFeed from '../components/SuperteamFeed/SuperteamCricketFeed';
import LeagueCricket from '../components/SuperteamFeed/LeagueCricket';
import SearchFeedMatch from '../components/SuperteamFeed/SearchFeedMatch';
import SearchCricketFeedMatch from '../components/SuperteamFeed/SearchCricketFeedMatch';
import Clevertap from '../components/CleverTap/Clevertap';
import Collectibles from '../components/Collectibles/Config';
import CreateCustomSegment from '../components/Segmentation/CreateCustomSegment';
import ListCustomSegment from '../components/Segmentation/ListCustomSegment';
import CustomSegmentOrder from '../components/Segmentation/CustomSegmentOrder';
import SegmentTierConfigure from '../components/Segmentation/SegmentTierConfigure';
import FeaturedEventConfigure from '../components/Segmentation/FeaturedEventConfigure';
import FeaturedEventOrder from '../components/Segmentation/FeaturedEventOrder';
import BannerOrderNew from '../components/Banner/BannerOrderNew';
import FeaturedEventNew from '../components/Segmentation/FeaturedEventNew';
import UpdateGame from '../components/Game/UpdateGame';
import DUCreateOffer from '../components/DynamicUpselling/DUCreateOffer';
import DUListOffers from '../components/DynamicUpselling/DUListOffers';
import ConfigurableHomeConfig from '../components/ConfigurableHomeConfig/ConfigurableHomeConfig';
import CommonUploader from '../components/FileUploader/CommonUploader';
import HomeWidgetConfig from '../components/HomeDiscoveryWidget/HomeWidgetConfig';
import DiscoveryWidgetConfig from '../components/HomeDiscoveryWidget/DiscoveryWidgetConfig';
import WidgetOrder from '../components/HomeDiscoveryWidget/WidgetOrder';
import LiveStreamList from '../components/LiveStream/LiveStreamList';
import UserManagement from '../components/LiveStream/UserManagement';
import FASearchUser from '../components/FeatureAccess/FASearchUser';
import FeaturedConfigure from '../components/FeaturedEvent/FeaturedConfigure';
import FeaturedOrder from '../components/FeaturedEvent/FeaturedOrder';
import RummyCustomerSupportV2 from '../components/CustomerSupport/RummyCustomerSupportV2';
import CreateContestBaseball from '../components/Baseball/CreateContest';
import CreateMatchBaseball from '../components/Baseball/CreateMatch';
import MatchListBaseball from '../components/Baseball/MatchList';
import ContestOrderBaseball from '../components/Baseball/ContestOrder';
import CreateMasterContestBaseball from '../components/Baseball/CreateMasterContest';
import MasterContestListBaseball from '../components/Baseball/MasterContestList';
import MasterOrderBaseball from '../components/Baseball/MasterOrder';
import BaseballSearchMatch from '../components/Baseball/SearchMatch';
import ProcessBulkPayment from '../components/Social/ProcessBulkPayment';
import IsolatedBlock from '../components/Fraud/IsolatedBlock';
import BlockUnblockUser from '../components/FeatureAccess/BlockUnblockUser';
import ResetUserAvatar from '../components/FeatureAccess/ResetUserAvatar';
import I18nCreateConfig from '../components/I18N-CMS/CreateConfig';
import I18nConfigsList from '../components/I18N-CMS/ConfigsList';
import I18nSearchConfigs from '../components/I18N-CMS/SearchConfigs';
import I18nPendingApprovalsList from '../components/I18N-CMS/PendingApprovalsList';
import I18nMissingCountryConfigs from '../components/I18N-CMS/MissingCountryConfigs';
import WebsiteCMS from '../components/Website/WebsiteCMS';
import WebsiteCMSPageHistory from '../components/Website/WebsiteCMSPageHistory';
import ClientConfig from '../components/ReferralConfig/ClientConfig';
import ReferralConfig from '../components/ReferralConfig/ReferralConfig';
import GoldenSpinWheel from '../components/SpinWheel/GoldenSpinWheel';
import OtherSpinConfig from '../components/SpinWheel/OtherSpinConfig';
import DayWiseUserSegment from '../components/Segmentation/DayWiseUserSegment';
import ReferralTesting from '../components/ReferralTesting/ReferralTesting';
import RummyTournament from '../components/Rummy/RummyTournament';
import CreateKnockout from '../components/TournamentConfig/CreateKnockout';
import ExternalUserList from '../components/CustomerSupport/ExternalUserList';
import FraudInvestigation from '../components/Fraud/FraudInvestigation';
import CreditWinning from '../components/CreditWinnings/CreditPokerWinning';
import VipCustomer from '../components/CustomerSupport/VipCustomer';
import CreateHashtag from '../components/Stories/CreateHashtag';
import HashtagOrder from '../components/Stories/HashtagOrder';
import ViewStory from '../components/Stories/ViewStory';
import CreateMusicCategory from '../components/Stories/CreateMusicCategory';
import MusicUpload from '../components/Stories/MusicUpload';
import MusicCategoryOrder from '../components/Stories/MusicCategoryOrder';
import CreateSticker from '../components/Stories/CreateSticker';
import ManualModeration from '../components/Stories/ManualModeration';
import AppLevelBlockV2 from '../components/Fraud/AppLevelBlockV2';
import PromoDashboard from '../components/PromoDashboard/PromoDashboard';
import OfficialHandleStory from '../components/Stories/OfficialHandleStory';
import StickerOrder from '../components/Stories/StickerOrder';
import TournamentTickets from '../components/TournamentTickets';
import CreateTournamentTickets from '../components/TournamentTickets/CreateTicket';
import CreateUserTournamentTicket from '../components/TournamentTickets/CreateUserTicket';
import MusicOrder from '../components/Stories/MusicOrder';
import RestoreUser from '../components/LeaderBoard/RestoreUser';
import AnnouncementPopup from '../components/Announcement/AnnouncementPopup';
import ContextualConfig from '../components/ReferralConfig/ContextualConfig';
import DUOfferNameList from '../components/DynamicUpselling/DUOfferNameList';
import PokerBalance from '../components/Poker/PokerBalance';
import PokerTransact from '../components/Poker/PokerTransact';
import PendingWithdrawalList from '../components/Payment/PendingWithdrawalList';
import HashtagLBExternal from '../components/Stories/HashtagLBExternal';
import ReactivationRewardsConfig from '../components/ProductInfra/ReactivationRewardsConfig';
import CommonUploaderBase64 from '../components/FileUploader/CommonUploaderBase64';
import MLConfig from '../components/ProductInfra/MLConfig';
import UserProfileConfig from '../components/ReferralConfig/UserProfileConfig';
import StickerUploadBulk from '../components/Stories/StickerUploadBulk';
import BulkUserCoupon from '../components/coupon/BulkUserCoupon';
import GameAssetUpload from '../components/Game/GameAssetUpload';
import BanStoryCreation from '../components/Stories/BanStoryCreation';
import UnbanStoryCreation from '../components/Stories/UnbanStoryCreation';
import TrendingHashtagConfig from '../components/Stories/TrendingHashtagConfig';
import MissionConfig from '../components/ProductInfra/MissionConfig';
import CreateLeague from '../components/EsportsLeague/CreateLeague';
import CreateLeagueStage from '../components/EsportsLeague/CreateLeagueStage';
import ListEsportsLeague from '../components/EsportsLeague/ListEsportsLeague';
import ListEsportsLeagueStage from '../components/EsportsLeague/ListEsportsLeagueStage';
import DeclutterHomepage from '../components/ProductInfra/DeclutterHomepage';
import BulkUserRemove from '../components/LeaderBoard/BulkUserRemove';
import GBLivePage from '../components/Broadcast/GBLivePage';
import GBBattles from '../components/Broadcast/GBBattles';
import GBGameSlates from '../components/Broadcast/GBGameSlates';
import GBBroadcasts from '../components/Broadcast/GBBroadcasts';
import GBSchedule from '../components/Broadcast/GBSchedule';
import GBVod from '../components/Broadcast/GBVod';
import GBKillBroadcast from '../components/Broadcast/GBKillBroadcast';
import GBBroadcasters from '../components/Broadcast/GBBroadcasters';
import KoTournament from '../components/LiveKO/KoTournament';
import ProductInfraClientConfig from '../components/ProductInfra/ProductInfraClientConfig';
import HomeManagement from '../components/ProductInfra/HomeManagement';
import Hamburger from '../components/ProductInfra/Hamburger';
import WebsiteCMSConfig from '../components/Website/WebsiteCMSConfig';
import FinishTournament from '../components/LeaderBoard/FinishTournament';
import DepositFraud from '../components/Payment/DepositFraud';
import AppLevelBlockV2Main from '../components/Fraud/AppLevelBlockV2Main';
import MissionSegmentation from '../components/ProductInfra/MissionSegmentation';
import PaymentsAutoResolution from '../components/Payment/PaymentsAutoResolution/index';
import Collusion from '../components/Fraud/Collusion';
import CreateGameStreakChallenge from '../components/GameStreak/CreateGameStreakChallenge';
import ListGameStreakChallenges from '../components/GameStreak/ListGameStreakChallenges';
import FraudRules from '../components/Fraud/FraudRules';
import CollusionWithdrawl from '../components/Fraud/CollusionWithdrawl';
import SuperteamFantasyAssistant from '../components/SuperteamFeed/SuperteamFantasyAssistant';
import Upload from '../components/SuperteamFeed/Upload';

const genericRole = [];
for (let role in roles) {
  genericRole.push(role);
}

const menu_route = [
  {
    name: 'Configs',
    icon: 'form',
    path: '/config',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN,
      roles.TOURNAMENT_READ
    ],
    routes: [
      {
        name: 'Add Config',
        icon: 'form',
        path: '/config/create',
        component: CreateConfig,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      },
      {
        name: 'Knockout',
        icon: 'form',
        path: '/config/knockout',
        component: CreateKnockout,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      },
      {
        name: 'Show Config',
        icon: 'table',
        path: '/config/all',
        component: AllTournaments,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_READ,
          roles.TOURNAMENT_ADMIN
        ]
      }
      // {
      //   name: 'Tournament Order',
      //   icon: 'database',
      //   path: '/config/order',
      //   component: AppOrder,
      //   componentPath: '../components/TournamentConfig/CreateConfig.js',
      //   authority: [
      //     roles.TOURNAMENT_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.TOURNAMENT_ADMIN
      //   ]
      // },
      // {
      //   name: 'Game Order',
      //   icon: 'database',
      //   path: '/config/game-order',
      //   component: GameOrder,
      //   authority: [
      //     roles.TOURNAMENT_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.TOURNAMENT_READ,
      //     roles.TOURNAMENT_ADMIN
      //   ]
      //// }
    ]
  },
  // {
  //   name: "Groups",
  //   icon: "form",
  //   path: "/group/add",
  //   authority: [
  //     roles.TOURNAMENT_WRITE,
  //     roles.SUPER_ADMIN,
  //     roles.TOURNAMENT_ADMIN,
  //     roles.TOURNAMENT_READ
  //   ],
  //   routes: [
  //     {
  //       name: "Add Group",
  //       icon: "form",
  //       path: "/group/add",
  //       component: AddTournamentGroup,
  //       authority: [
  //         roles.TOURNAMENT_WRITE,
  //         roles.SUPER_ADMIN,
  //         roles.TOURNAMENT_ADMIN
  //       ]
  //     },
  //     // {
  //     //   name: "List Groups",
  //     //   icon: "table",
  //     //   path: "/group/all",
  //     //   component: AllGroups,
  //     //   authority: [
  //     //     roles.TOURNAMENT_WRITE,
  //     //     roles.SUPER_ADMIN,
  //     //     roles.TOURNAMENT_READ,
  //     //     roles.TOURNAMENT_ADMIN
  //     //   ]
  //     // },
  //     {
  //       name: "List Config",
  //       icon: "database",
  //       path: "/group/order",
  //       component: GroupOrder,
  //       authority: [
  //         roles.TOURNAMENT_WRITE,
  //         roles.SUPER_ADMIN,
  //         roles.TOURNAMENT_READ,
  //         roles.TOURNAMENT_ADMIN
  //       ]
  //     }
  //   ]
  // },
  {
    name: 'Limiter',
    icon: 'exclamation-circle',
    path: '/limiter',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN,
      roles.TOURNAMENT_READ
    ],
    routes: [
      {
        name: 'Create Rule',
        icon: 'form',
        path: '/limiter/create',
        component: CreateLimiter,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      },
      {
        name: 'Show Rule',
        icon: 'table',
        path: '/limiter/list',
        component: ListLimiter,

        authority: [
          roles.TOURNAMENT_WRITE,
          roles.TOURNAMENT_READ,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      }
    ]
  },
  {
    name: '1V1 Battles',
    icon: 'team',
    path: '/battle',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN,
      roles.TOURNAMENT_READ
    ],
    routes: [
      {
        name: 'Create Battle',
        icon: 'form',
        path: '/battle/create',
        component: CreateConfig,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      },
      {
        name: 'Show Battles',
        icon: 'table',
        path: '/battle/all',
        component: AllTournaments,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_READ,
          roles.TOURNAMENT_ADMIN
        ]
      }
      // {
      //   name: 'Battle Order',
      //   icon: 'database',
      //   path: '/battle/order',
      //   component: AppOrder,
      //   componentPath: '../components/TournamentConfig/CreateConfig.js',
      //   authority: [
      //     roles.TOURNAMENT_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.TOURNAMENT_ADMIN
      //   ]
      // },
      // {
      //   name: 'Game Order',
      //   icon: 'database',
      //   path: '/battle/game-order',
      //   component: GameOrder,
      //   authority: [
      //     roles.TOURNAMENT_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.TOURNAMENT_READ,
      //     roles.TOURNAMENT_ADMIN
      //   ]
      // }
    ]
  },
  {
    name: 'Rummy',
    icon: 'table',
    path: '/rummy',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN,
      roles.TOURNAMENT_READ
    ],
    routes: [
      {
        name: 'Create',
        icon: 'form',
        path: '/rummy/create',
        component: RummyCreate,
        authority: [
          roles.RUMMY_DASHBOARD_WRITE,
          roles.SUPER_ADMIN,
          roles.RUMMY_DASHBOARD_ADMIN
        ]
      },
      {
        name: 'Tournament',
        icon: 'form',
        path: '/rummy/create-tournament',
        component: RummyTournament,
        authority: [
          roles.RUMMY_DASHBOARD_WRITE,
          roles.SUPER_ADMIN,
          roles.RUMMY_DASHBOARD_ADMIN
        ]
      },
      {
        name: 'Show Battles',
        icon: 'table',
        path: '/rummy/all',
        component: AllTournaments,
        authority: [
          roles.RUMMY_DASHBOARD_WRITE,
          roles.SUPER_ADMIN,
          roles.RUMMY_DASHBOARD_ADMIN
        ]
      }
    ]
  },
  {
    name: 'Order',
    icon: 'database',
    path: '/order',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN
    ],
    routes: [
      {
        name: 'Config Order',
        icon: 'ordered-list',
        path: '/order/config',
        component: ConfigOrder,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      }
    ]
  },
  {
    name: 'Sponsor',
    icon: 'bank',
    path: '/sponsor',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN,
      roles.TOURNAMENT_READ
    ],
    routes: [
      {
        name: 'Create',
        icon: 'form',
        path: '/sponsor/create',
        component: CreateSponsor,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      },
      {
        name: 'Show',
        icon: 'table',
        path: '/sponsor/list',
        component: ListSponsor,

        authority: [
          roles.TOURNAMENT_WRITE,
          roles.TOURNAMENT_READ,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      },
      {
        name: 'Configure',
        icon: 'table',
        path: '/sponsor/configure',
        component: ConfigTournament,

        authority: [
          roles.TOURNAMENT_WRITE,
          roles.TOURNAMENT_READ,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      }
    ]
  },
  {
    name: 'Segment',
    icon: 'appstore',
    path: '/segment',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN,
      roles.TOURNAMENT_READ
    ],
    routes: [
      {
        name: 'Create',
        icon: 'form',
        path: '/segment/create',
        component: CreateSegment,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      },
      {
        name: 'Show',
        icon: 'table',
        path: '/segment/list',
        component: ListSegment,

        authority: [
          roles.TOURNAMENT_WRITE,
          roles.TOURNAMENT_READ,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      }
    ]
  },
  {
    name: 'Tournament',
    icon: 'star',
    path: '/tournament',
    authority: [
      roles.SPECIAL_TOURNAMENT_ADMIN,
      roles.SUPER_ADMIN,
      roles.SPECIAL_TOURNAMENT_WRITE
    ],
    routes: [
      // Games Update
      {
        name: 'Edit Games Details',
        icon: 'edit',
        path: '/tournament/games/details',
        component: GameOrderDetails,
        authority: [
          roles.SPECIAL_TOURNAMENT_ADMIN,
          roles.SUPER_ADMIN,
          roles.SPECIAL_TOURNAMENT_WRITE
        ]
      }
    ]
  },
  {
    name: 'Game ',
    icon: 'database',
    path: '/app',
    authority: [
      roles.GAME_WRITE,
      roles.SUPER_ADMIN,
      roles.GAME_ADMIN,
      roles.GAME_READ,
      roles.GAME_UPDATE
    ],
    routes: [
      // {
      //   name: 'Tournament Order',
      //   icon: 'form',
      //   path: '/app/order',
      //   component: AppOrder,
      //   componentPath: '../components/TournamentConfig/CreateConfig.js',
      //   authority: [
      //     roles.TOURNAMENT_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.TOURNAMENT_ADMIN
      //   ]
      // },
      {
        name: 'Game Order',
        icon: 'ordered-list',
        path: '/order/game-order',
        component: GameOrderList,
        authority: [roles.GAME_WRITE, roles.SUPER_ADMIN, roles.GAME_ADMIN]
      },
      {
        name: 'Fixed Game Count',
        icon: 'table',
        path: '/app/games',
        component: GameOrderIndex,
        authority: [roles.GAME_ADMIN, roles.SUPER_ADMIN, roles.GAME_WRITE]
      },
      {
        name: 'Update Game',
        icon: 'edit',
        path: '/app/games/update',
        component: UpdateGame,
        authority: [
          roles.GAME_WRITE,
          roles.SUPER_ADMIN,
          roles.GAME_ADMIN,
          roles.GAME_UPDATE
        ]
      },
      {
        name: 'Game Asset Upload',
        icon: 'upload',
        path: '/app/games/asset',
        component: GameAssetUpload,
        authority: [
          roles.GAME_WRITE,
          roles.SUPER_ADMIN,
          roles.GAME_ADMIN,
          roles.GAME_UPDATE
        ]
      }
    ]
  },
  {
    name: 'Cricket',
    icon: 'fire',
    path: '/fantasy',
    authority: [
      roles.FANTASY_WRITE,
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Matches',
        icon: 'fire',
        path: '/fantasy/match-list',
        component: MatchList,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Contest',
        icon: 'fire',
        path: '/fantasy/create-contest',
        component: CreateContest,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Match Config',
        icon: 'fire',
        path: '/fantasy/create-match',
        component: CreateMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Contest Order',
        icon: 'fire',
        path: '/fantasy/contest-order',
        component: ContestOrder,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Master',
        icon: 'fire',
        path: '/fantasy/create-master-contest',
        component: CreateMasterContest,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master List',
        icon: 'fire',
        path: '/fantasy/master-list',
        component: MasterContestList,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master Order',
        icon: 'fire',
        path: '/fantasy/master-order',
        component: MasterOrder,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      // {
      //   name: 'Vinfo',
      //   icon: 'fire',
      //   path: '/fantasy/vinfo',
      //   component: Vinfo,
      //   authority: [
      //     roles.FANTASY_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.FANTASY_ADMIN,
      //     roles.FANTASY_READ
      //   ]
      // },
      {
        name: 'Search Match',
        icon: 'fire',
        path: '/fantasy/search',
        component: SearchMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Kabaddi',
    icon: 'fire',
    path: '/kabaddi',
    authority: [
      roles.FANTASY_WRITE,
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Matches',
        icon: 'fire',
        path: '/kabaddi/match-list',
        component: MatchListKabaddi,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Contest',
        icon: 'fire',
        path: '/kabaddi/create-contest',
        component: CreateContestKabaddi,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Match Config',
        icon: 'fire',
        path: '/kabaddi/create-match',
        component: CreateMatchKabaddi,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Contest Order',
        icon: 'fire',
        path: '/kabaddi/contest-order',
        component: ContestOrderKabaddi,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Master',
        icon: 'fire',
        path: '/kabaddi/create-master-contest',
        component: CreateMasterContestKabaddi,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master List',
        icon: 'fire',
        path: '/kabaddi/master-list',
        component: MasterContestListKabaddi,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master Order',
        icon: 'fire',
        path: '/kabaddi/master-order',
        component: MasterOrderKabaddi,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      // {
      //   name: 'Vinfo',
      //   icon: 'fire',
      //   path: '/kabaddi/vinfo',
      //   component: VinfoKabaddi,
      //   authority: [
      //     roles.FANTASY_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.FANTASY_ADMIN,
      //     roles.FANTASY_READ
      //   ]
      // },
      {
        name: 'Search Match',
        icon: 'fire',
        path: '/kabaddi/search',
        component: KabaddiSearchMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Football',
    icon: 'fire',
    path: '/football',
    authority: [
      roles.FANTASY_WRITE,
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Matches',
        icon: 'fire',
        path: '/football/match-list',
        component: MatchListFootball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Contest',
        icon: 'fire',
        path: '/football/create-contest',
        component: CreateContestFootball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Match Config',
        icon: 'fire',
        path: '/football/create-match',
        component: CreateMatchFootball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Contest Order',
        icon: 'fire',
        path: '/football/contest-order',
        component: ContestOrderFootball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Master',
        icon: 'fire',
        path: '/football/create-master-contest',
        component: CreateMasterContestFootball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master List',
        icon: 'fire',
        path: '/football/master-list',
        component: MasterContestListFootball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master Order',
        icon: 'fire',
        path: '/football/master-order',
        component: MasterOrderFootball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      // {
      //   name: 'Vinfo',
      //   icon: 'fire',
      //   path: '/football/vinfo',
      //   component: VinfoFootball,
      //   authority: [
      //     roles.FANTASY_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.FANTASY_ADMIN,
      //     roles.FANTASY_READ
      //   ]
      // },
      {
        name: 'Search Match',
        icon: 'fire',
        path: '/football/search',
        component: FootballSearchMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Stock',
    icon: 'fire',
    path: '/stock',
    authority: [
      roles.FANTASY_WRITE,
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Matches',
        icon: 'fire',
        path: '/stock/match-list',
        component: MatchListStock,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Contest',
        icon: 'fire',
        path: '/stock/create-contest',
        component: CreateContestStock,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Match Config',
        icon: 'fire',
        path: '/stock/create-match',
        component: CreateMatchStock,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Contest Order',
        icon: 'fire',
        path: '/stock/contest-order',
        component: ContestOrderStock,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Master',
        icon: 'fire',
        path: '/stock/create-master-contest',
        component: CreateMasterContestStock,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master List',
        icon: 'fire',
        path: '/stock/master-list',
        component: MasterContestListStock,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master Order',
        icon: 'fire',
        path: '/stock/master-order',
        component: MasterOrderStock,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      // {
      //   name: 'Vinfo',
      //   icon: 'fire',
      //   path: '/stock/vinfo',
      //   component: VinfoStock,
      //   authority: [
      //     roles.FANTASY_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.FANTASY_ADMIN,
      //     roles.FANTASY_READ
      //   ]
      // },
      {
        name: 'Search Match',
        icon: 'fire',
        path: '/stock/search',
        component: StockSearchMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Basketball',
    icon: 'fire',
    path: '/basketball',
    authority: [
      roles.FANTASY_WRITE,
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Matches',
        icon: 'fire',
        path: '/basketball/match-list',
        component: MatchListBasketball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Contest',
        icon: 'fire',
        path: '/basketball/create-contest',
        component: CreateContestBasketball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Match Config',
        icon: 'fire',
        path: '/basketball/create-match',
        component: CreateMatchBasketball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Contest Order',
        icon: 'fire',
        path: '/basketball/contest-order',
        component: ContestOrderBasketball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Master',
        icon: 'fire',
        path: '/basketball/create-master-contest',
        component: CreateMasterContestBasketball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master List',
        icon: 'fire',
        path: '/basketball/master-list',
        component: MasterContestListBasketball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master Order',
        icon: 'fire',
        path: '/basketball/master-order',
        component: MasterOrderBasketball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      // {
      //   name: 'Vinfo',
      //   icon: 'fire',
      //   path: '/basketball/vinfo',
      //   component: VinfoBasketball,
      //   authority: [
      //     roles.FANTASY_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.FANTASY_ADMIN,
      //     roles.FANTASY_READ
      //   ]
      // },
      {
        name: 'Search Match',
        icon: 'fire',
        path: '/basketball/search',
        component: BasketballSearchMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Hockey',
    icon: 'fire',
    path: '/hockey',
    authority: [
      roles.FANTASY_WRITE,
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Matches',
        icon: 'fire',
        path: '/hockey/match-list',
        component: MatchListHockey,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Contest',
        icon: 'fire',
        path: '/hockey/create-contest',
        component: CreateContestHockey,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Match Config',
        icon: 'fire',
        path: '/hockey/create-match',
        component: CreateMatchHockey,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Contest Order',
        icon: 'fire',
        path: '/hockey/contest-order',
        component: ContestOrderHockey,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Master',
        icon: 'fire',
        path: '/hockey/create-master-contest',
        component: CreateMasterContestHockey,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master List',
        icon: 'fire',
        path: '/hockey/master-list',
        component: MasterContestListHockey,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master Order',
        icon: 'fire',
        path: '/hockey/master-order',
        component: MasterOrderHockey,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      // {
      //   name: 'Vinfo',
      //   icon: 'fire',
      //   path: '/hockey/vinfo',
      //   component: VinfoHockey,
      //   authority: [
      //     roles.FANTASY_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.FANTASY_ADMIN,
      //     roles.FANTASY_READ
      //   ]
      // },
      {
        name: 'Search Match',
        icon: 'fire',
        path: '/hockey/search',
        component: HockeySearchMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Baseball',
    icon: 'fire',
    path: '/baseball',
    authority: [
      roles.FANTASY_WRITE,
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Matches',
        icon: 'fire',
        path: '/baseball/match-list',
        component: MatchListBaseball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Contest',
        icon: 'fire',
        path: '/baseball/create-contest',
        component: CreateContestBaseball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Match Config',
        icon: 'fire',
        path: '/baseball/create-match',
        component: CreateMatchBaseball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Contest Order',
        icon: 'fire',
        path: '/baseball/contest-order',
        component: ContestOrderBaseball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Master',
        icon: 'fire',
        path: '/baseball/create-master-contest',
        component: CreateMasterContestBaseball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master List',
        icon: 'fire',
        path: '/baseball/master-list',
        component: MasterContestListBaseball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Master Order',
        icon: 'fire',
        path: '/baseball/master-order',
        component: MasterOrderBaseball,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      },
      // {
      //   name: 'Vinfo',
      //   icon: 'fire',
      //   path: '/baseball/vinfo',
      //   component: VinfoBaseball,
      //   authority: [
      //     roles.FANTASY_WRITE,
      //     roles.SUPER_ADMIN,
      //     roles.FANTASY_ADMIN,
      //     roles.FANTASY_READ
      //   ]
      // },
      {
        name: 'Search Match',
        icon: 'fire',
        path: '/baseball/search',
        component: BaseballSearchMatch,
        authority: [
          roles.FANTASY_WRITE,
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Superteam Feeds',
    icon: 'fire',
    path: '/superteam-feeds',
    authority: [
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_WRITE,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Football Feeds',
        icon: 'fire',
        path: '/superteam-feeds/index',
        component: SuperteamFeed,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Football Leagues',
        icon: 'fire',
        path: '/superteam-feeds/league',
        component: League,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Football Search',
        icon: 'fire',
        path: '/superteam-feeds/search',
        component: SearchFeedMatch,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Cricket Feeds',
        icon: 'fire',
        path: '/superteam-cricket-feeds/index',
        component: SuperteamCricketFeed,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Cricket Leagues',
        icon: 'fire',
        path: '/superteam-cricket-feeds/league',
        component: LeagueCricket,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Cricket Search',
        icon: 'fire',
        path: '/superteam-cricket-feeds/search',
        component: SearchCricketFeedMatch,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Fantasy Assistant',
        icon: 'fire',
        path: '/superteam-team-feeds/assistant',
        component: SuperteamFantasyAssistant,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Upload',
        icon: 'fire',
        path: '/superteam-team-feeds/upload',
        component: Upload,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'ST Leaderboard',
    icon: 'fire',
    path: '/superteam-leaderboard',
    authority: [
      roles.SUPER_ADMIN,
      roles.FANTASY_ADMIN,
      roles.FANTASY_WRITE,
      roles.FANTASY_READ
    ],
    routes: [
      {
        name: 'Create Banner',
        icon: 'fire',
        path: '/superteam-leaderboard/create-banner',
        component: SLBanner,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'List Banner',
        icon: 'fire',
        path: '/superteam-leaderboard/list-banner',
        component: ListSLBanner,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'Create Leaderboard',
        icon: 'fire',
        path: '/superteam-leaderboard/create-leaderboard',
        component: CreateLeaderboard,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      },
      {
        name: 'List Leaderboard',
        icon: 'fire',
        path: '/superteam-leaderboard/list-leaderboard',
        component: ListLeaderboard,
        authority: [
          roles.SUPER_ADMIN,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.FANTASY_READ
        ]
      }
    ]
  },
  {
    name: 'Server Config',
    icon: 'database',
    path: '/app/server-config',
    authority: [roles.SUPER_ADMIN, roles.ZOO_CONFIG_ADMIN],
    routes: [
      {
        name: 'Server Config',
        icon: 'database',
        path: '/app/server-config',
        component: ServerConfig,
        authority: [roles.SUPER_ADMIN, roles.ZOO_CONFIG_ADMIN]
      }
    ]
  },
  {
    name: 'Spin Wheel',
    icon: 'bars',
    path: '/app/spin-wheel',
    authority: [
      roles.SPINWHEEL_ADMIN,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN
    ],
    routes: [
      {
        name: 'Spin Wheel',
        icon: 'bars',
        path: '/app/spin-wheel',
        component: SpinWheel,
        authority: [roles.SPINWHEEL_ADMIN, roles.SUPER_ADMIN]
      },
      {
        name: 'Golden Spin Wheel',
        icon: 'bars',
        path: '/app/golden-spin-wheel',
        component: GoldenSpinWheel,
        authority: [roles.SPINWHEEL_ADMIN, roles.SUPER_ADMIN]
      },
      {
        name: 'Other Configs',
        icon: 'bars',
        path: '/app/other-spin-wheel',
        component: OtherSpinConfig,
        authority: [roles.SPINWHEEL_ADMIN, roles.SUPER_ADMIN]
      }
    ]
  },
  {
    name: 'Updater',
    icon: 'android',
    path: '/updater',
    authority: [
      roles.UPDATER_WRITE,
      roles.SUPER_ADMIN,
      roles.UPDATER_ADMIN,
      roles.UPDATER_READ
    ],
    routes: [
      {
        name: 'Create Update',
        icon: 'form',
        path: '/updater/add',
        component: Updater,
        componentPath: '../components/TournamentConfig/CreateConfig.js',
        authority: [roles.UPDATER_WRITE, roles.SUPER_ADMIN, roles.UPDATER_ADMIN]
      },
      {
        name: 'Updates List',
        icon: 'table',
        path: '/updater/all',
        component: ListUpdates,
        componentPath: '../components/AllTournaments.js',
        authority: [
          roles.UPDATER_WRITE,
          roles.SUPER_ADMIN,
          roles.UPDATER_ADMIN,
          roles.UPDATER_READ
        ]
      }
    ]
  },
  {
    name: 'Banner',
    icon: 'picture',
    path: '/banner',
    authority: [
      roles.BANNER_WRITE,
      roles.SUPER_ADMIN,
      roles.BANNER_ADMIN,
      roles.BANNER_READ
    ],
    routes: [
      {
        name: 'Create Banner',
        icon: 'form',
        path: '/banner/add',
        component: CreateBanner,
        authority: [roles.BANNER_WRITE, roles.SUPER_ADMIN, roles.BANNER_ADMIN]
      },
      {
        name: 'Updates List',
        icon: 'table',
        path: '/banner/all',
        component: ListBanner,
        authority: [
          roles.BANNER_WRITE,
          roles.SUPER_ADMIN,
          roles.BANNER_ADMIN,
          roles.BANNER_READ
        ]
      },
      {
        name: 'Website Banner',
        icon: 'form',
        path: '/banner/add-website',
        component: CreateBannerWebsite,
        authority: [roles.BANNER_WRITE, roles.SUPER_ADMIN, roles.BANNER_ADMIN]
      },
      {
        name: 'Order',
        icon: 'ordered-list',
        path: '/banner/order',
        component: BannerOrder,
        authority: [roles.BANNER_WRITE, roles.SUPER_ADMIN, roles.BANNER_ADMIN]
      },
      {
        name: 'Order NEW',
        icon: 'ordered-list',
        path: '/banner/order-new',
        component: BannerOrderNew,
        authority: [roles.BANNER_WRITE, roles.SUPER_ADMIN, roles.BANNER_ADMIN]
      }
    ]
  },
  {
    name: 'Hourly Quiz',
    icon: 'question-circle',
    path: '/hourly',
    authority: [roles.SUPER_ADMIN, roles.QUIZ_ADMIN, roles.QUIZ_WRITE],
    routes: [
      {
        name: 'Create Hourly Quiz Question',
        icon: 'form',
        path: '/hourly/add',
        component: CreateQuiz,
        authority: [roles.SUPER_ADMIN, roles.QUIZ_ADMIN, roles.QUIZ_WRITE]
      },
      {
        name: 'Quiz List',
        icon: 'table',
        path: '/hourly/all',
        component: QuizList,
        authority: [roles.SUPER_ADMIN, roles.QUIZ_ADMIN, roles.QUIZ_WRITE]
      }
    ]
  },
  {
    name: 'Payment',
    icon: 'dollar',
    path: '/payment',
    authority: [
      roles.KYC_WRITE,
      roles.SUPER_ADMIN,
      roles.KYC_ADMIN,
      roles.KYC_READ,
      roles.FRAUD_CHECK_ADMIN,
      roles.CHECKER_1,
      roles.CHECKER_2,
      roles.CHECKER_3,
      roles.CHECKER_4,
      roles.CHECKER_5,
      roles.CHECKER_6,
      roles.CHECKER_7,
      roles.CHECKER_8,
      roles.CHECKER_9,
      roles.CHECKER_10,
      roles.CHECKER_11,
      roles.CHECKER_12,
      roles.CHECKER_13,
      roles.CHECKER_14,
      roles.CHECKER_15,
      roles.CHECKER_16,
      roles.CHECKER_17,
      roles.CHECKER_18,
      roles.CHECKER_19,
      roles.CHECKER_20,
      roles.TRANSACTION_READ,
      roles.PAYMENTS_ADMIN
    ],
    routes: [
      {
        name: 'Payments',
        icon: 'dollar',
        path: '/payment/details',
        component: Payment,
        authority: [
          roles.KYC_WRITE,
          roles.SUPER_ADMIN,
          roles.KYC_ADMIN,
          roles.KYC_READ,
          roles.FRAUD_CHECK_ADMIN,
          roles.CHECKER_1,
          roles.CHECKER_2,
          roles.CHECKER_3,
          roles.CHECKER_4,
          roles.CHECKER_5,
          roles.CHECKER_6,
          roles.CHECKER_7,
          roles.CHECKER_8,
          roles.CHECKER_9,
          roles.CHECKER_10,
          roles.CHECKER_11,
          roles.CHECKER_12,
          roles.CHECKER_13,
          roles.CHECKER_14,
          roles.CHECKER_15,
          roles.CHECKER_16,
          roles.CHECKER_17,
          roles.CHECKER_18,
          roles.CHECKER_19,
          roles.CHECKER_20
        ]
      },
      {
        name: 'Fraud Check',
        icon: 'dollar',
        path: '/payment/fraud-check',
        component: FraudCheck,
        authority: [
          roles.SUPER_ADMIN,
          roles.FRAUD_CHECK_ADMIN,
          roles.CHECKER_1,
          roles.CHECKER_2,
          roles.CHECKER_3,
          roles.CHECKER_4,
          roles.CHECKER_5,
          roles.CHECKER_6,
          roles.CHECKER_7,
          roles.CHECKER_8,
          roles.CHECKER_9,
          roles.CHECKER_10,
          roles.CHECKER_11,
          roles.CHECKER_12,
          roles.CHECKER_13,
          roles.CHECKER_14,
          roles.CHECKER_15,
          roles.CHECKER_16,
          roles.CHECKER_17,
          roles.CHECKER_18,
          roles.CHECKER_19,
          roles.CHECKER_20
        ]
      },
      {
        name: 'Pending Withdrawal',
        icon: 'dollar',
        path: '/payment/pending-withrawal',
        component: PendingWithdrawalRequest,
        authority: [roles.SUPER_ADMIN, roles.FRAUD_CHECK_ADMIN]
      },
      {
        name: 'Approved Withdrawal',
        icon: 'dollar',
        path: '/payment/approved-withrawal',
        component: ApprovedWithdrawalRequest,
        authority: [roles.SUPER_ADMIN, roles.FRAUD_CHECK_ADMIN]
      },
      {
        name: 'Rejected Withdrawal',
        icon: 'dollar',
        path: '/payment/rejected-withrawal',
        component: RejectedWithdrawalRequest,
        authority: [roles.SUPER_ADMIN, roles.FRAUD_CHECK_ADMIN]
      },
      {
        name: 'Transaction Details',
        icon: 'dollar',
        path: '/payment/transaction-details',
        component: TransactionDetails,
        authority: [
          roles.SUPER_ADMIN,
          roles.FRAUD_CHECK_ADMIN,
          roles.TRANSACTION_READ
        ]
      },
      {
        name: 'Download Transactions',
        icon: 'dollar',
        path: '/payment/transaction/download',
        component: DownloadTransactionDetails,
        authority: [roles.SUPER_ADMIN, roles.PAYMENTS_WRITE]
      },
      {
        name: 'Pending Withdrawal List',
        icon: 'dollar',
        path: '/payment/pending-withdrawal-list',
        component: PendingWithdrawalList,
        authority: [
          roles.SUPER_ADMIN,
          roles.PAYMENTS_ADMIN,
          roles.PAYMENTS_WRITE
        ]
      },
      {
        name: 'Deposit Fraud',
        icon: 'dollar',
        path: '/payment/deposit-fraud',
        component: DepositFraud,
        authority: [
          roles.SUPER_ADMIN,
          roles.PAYMENTS_ADMIN,
          roles.PAYMENTS_WRITE
        ]
      },
      {
        name: 'Auto Resolution',
        icon: 'dollar',
        path: '/payment/autoresolution',
        component: PaymentsAutoResolution,
        authority: [roles.SUPER_ADMIN, roles.PAYMENTS_AUTORESOLUTION]
      }
    ]
  },
  {
    name: 'Collectibles',
    icon: 'dollar',
    path: '/collectibles',
    authority: [
      roles.COLLECTIBLES_ADMIN,
      roles.COLLECTIBLES_READ,
      roles.COLLECTIBLES_WRITE,
      roles.SUPER_ADMIN
    ],
    routes: [
      {
        name: 'Config',
        icon: 'dollar',
        path: '/collectibles/config',
        component: Collectibles,
        authority: [
          roles.COLLECTIBLES_WRITE,
          roles.SUPER_ADMIN,
          roles.COLLECTIBLES_ADMIN
        ]
      }
    ]
  },
  {
    name: 'KYC',
    icon: 'idcard',
    path: '/kyc',
    authority: [
      roles.KYC_WRITE,
      roles.SUPER_ADMIN,
      roles.KYC_ADMIN,
      roles.KYC_READ,
      roles.KYC_LIST
    ],
    routes: [
      {
        name: 'KYC List',
        icon: 'table',
        path: '/kyc/list',
        component: KycList,
        authority: [
          roles.KYC_WRITE,
          roles.SUPER_ADMIN,
          roles.KYC_ADMIN,
          roles.KYC_LIST
        ]
      },
      {
        name: 'Kyc Details',
        icon: 'table',
        path: '/kyc/details',
        component: KycDetails,
        authority: [
          roles.KYC_WRITE,
          roles.SUPER_ADMIN,
          roles.KYC_ADMIN,
          roles.KYC_READ
        ]
      },
      {
        name: 'Bulk Kyc Search',
        icon: 'table',
        path: '/kyc/bulk-search',
        component: BulkKycSearch,
        authority: [
          roles.KYC_WRITE,
          roles.SUPER_ADMIN,
          roles.KYC_ADMIN,
          roles.KYC_READ
        ]
      }
    ]
  },
  {
    name: 'Manage Users',
    icon: 'user',
    path: '/user',
    authority: genericRole,
    routes: [
      {
        name: 'Add User',
        icon: 'form',
        path: '/user/create',
        component: AddUser,
        authority: genericRole
      },
      {
        name: 'User Details',
        icon: 'table',
        path: '/user/details',
        component: UserDetails,
        authority: genericRole
      },
      {
        name: 'Search User',
        icon: 'search',
        path: '/user/search',
        component: SearchUser,
        authority: genericRole
      }
    ]
  },
  // {
  //   name: 'Videos',
  //   icon: 'video-camera',
  //   path: '/video',
  //   authority: [
  //     roles.SUPER_ADMIN,
  //     roles.VIDEO_ADMIN,
  //     roles.VIDEO_READ,
  //     roles.VIDEO_WRITE
  //   ],
  //   routes: [
  //     {
  //       name: 'Add Featured',
  //       icon: 'form',
  //       path: '/video/featured/add',
  //       component: AddFeaturedVideo,
  //       authority: [roles.SUPER_ADMIN, roles.VIDEO_WRITE, roles.VIDEO_ADMIN]
  //     },
  //     {
  //       name: 'Leaderbord',
  //       icon: 'table',
  //       path: '/video/leaderboard',
  //       component: VideoLeaderboard,
  //       authority: [roles.SUPER_ADMIN, roles.VIDEO_WRITE, roles.VIDEO_ADMIN]
  //     },
  //     {
  //       name: 'Featured Board',
  //       icon: 'table',
  //       path: '/video/featured/board',
  //       component: FeaturedVideoLeaderboard,
  //       authority: [roles.SUPER_ADMIN, roles.VIDEO_WRITE, roles.VIDEO_ADMIN]
  //     }
  //   ]
  // },
  {
    name: 'Coupon',
    icon: 'gift',
    path: '/coupon',
    authority: [
      roles.SUPER_ADMIN,
      roles.COUPON_ADMIN,
      roles.COUPON_READ,
      roles.COUPON_WRITE
    ],
    routes: [
      {
        name: 'Add Coupon',
        icon: 'form',
        path: '/coupon/create',
        component: CreateCoupon,
        authority: [roles.SUPER_ADMIN, roles.COUPON_WRITE, roles.COUPON_ADMIN]
      },
      {
        name: 'Search',
        icon: 'table',
        path: '/coupon/search',
        component: SearchCoupon,
        authority: [roles.SUPER_ADMIN, roles.COUPON_WRITE, roles.COUPON_ADMIN]
      }
    ]
  },
  {
    name: 'Tournament Tickets',
    icon: 'gift',
    path: '/tournament-tickets',
    authority: [
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_TICKETS_ADMIN,
      roles.TOURNAMENT_TICKETS_READ,
      roles.TOURNAMENT_TICKETS_WRITE
    ],
    routes: [
      {
        name: 'Add Tickets',
        icon: 'form',
        path: '/tournament-ticket/create',
        component: CreateTournamentTickets,
        authority: [
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_TICKETS_ADMIN,
          roles.TOURNAMENT_TICKETS_WRITE
        ]
      },
      {
        name: 'List Tickets',
        icon: 'table',
        path: '/tournament-ticket',
        component: TournamentTickets,
        authority: [
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_TICKETS_WRITE,
          roles.TOURNAMENT_TICKETS_ADMIN
        ]
      },
      {
        name: 'Create User Tickets',
        icon: 'table',
        path: '/create-user-tournament-ticket',
        component: CreateUserTournamentTicket,
        authority: [
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_TICKETS_WRITE,
          roles.TOURNAMENT_TICKETS_ADMIN
        ]
      }
    ]
  },
  {
    name: 'Offers',
    icon: 'gift',
    path: '/offers',
    authority: [
      roles.SUPER_ADMIN,
      roles.OFFER_ADMIN,
      roles.OFFER_READ,
      roles.OFFER_WRITE,
      roles.BULK_COUPON_ADMIN
    ],
    routes: [
      {
        name: 'Create',
        icon: 'form',
        path: '/offers/create',
        component: CreateOffer,
        authority: [roles.SUPER_ADMIN, roles.OFFER_WRITE, roles.OFFER_ADMIN]
      },
      {
        name: 'List',
        icon: 'table',
        path: '/offers/list',
        component: ListOffer,
        authority: [roles.SUPER_ADMIN, roles.OFFER_WRITE, roles.OFFER_ADMIN]
      },
      {
        name: 'Bulk User Coupon',
        icon: 'table',
        path: '/offers/bulk-user',
        component: BulkUserCoupon,
        authority: [roles.SUPER_ADMIN, roles.BULK_COUPON_ADMIN]
      }
    ]
  },
  {
    name: 'Leaderboard',
    icon: 'table',
    path: '/lb',
    authority: [
      roles.LEADERBOARD_ADMIN,
      roles.LEADERBOARD_READ,
      roles.LEADERBOARD_WRITE,
      roles.SUPER_ADMIN
    ],
    routes: [
      {
        name: 'Show Board',
        icon: 'table',
        path: '/lb/home',
        component: LeaderBoard,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.LEADERBOARD_READ,
          roles.LEADERBOARD_WRITE,
          roles.SUPER_ADMIN
        ]
      },
      {
        name: 'Search Board',
        icon: 'table',
        path: '/lb/search',
        component: SearchLeaderBoard,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.LEADERBOARD_READ,
          roles.LEADERBOARD_WRITE,
          roles.SUPER_ADMIN
        ]
      },
      {
        name: 'Search Lobby',
        icon: 'table',
        path: '/lb/search-lobby',
        component: SearchLobby,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.LEADERBOARD_READ,
          roles.LEADERBOARD_WRITE,
          roles.SUPER_ADMIN
        ]
      },
      {
        name: 'Cash Board',
        icon: 'table',
        path: '/lb/cashboard',
        component: CashBoard,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.LEADERBOARD_READ,
          roles.LEADERBOARD_WRITE,
          roles.SUPER_ADMIN
        ]
      },
      {
        name: 'Unblock User',
        icon: 'form',
        path: '/lb/unblock',
        component: UnBlockUser,
        authority: [roles.LEADERBOARD_ADMIN, roles.SUPER_ADMIN]
      },
      // {
      //   name: 'Block User',
      //   icon: 'user',
      //   path: '/lb/block',
      //   component: BlockUser,
      //   authority: [
      //     roles.SUPER_ADMIN,
      //     roles.LEADERBOARD_ADMIN,
      //     roles.LEADERBOARD_WRITE
      //   ]
      // },
      {
        name: 'Manual Finish',
        icon: 'table',
        path: '/lb/manual',
        component: UnfinishedTournament,
        authority: [roles.LEADERBOARD_ADMIN, roles.SUPER_ADMIN]
      },
      {
        name: 'Finish Tournament Direct',
        icon: 'table',
        path: '/lb/finish-direct',
        component: FinishTournament,
        authority: [roles.LEADERBOARD_ADMIN, roles.SUPER_ADMIN]
      },
      {
        name: 'Lobby Leaderboard',
        icon: 'table',
        path: '/lb/lobby-leaderboard',
        component: LobbyLeaderboard,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.SUPER_ADMIN,
          roles.LEADERBOARD_WRITE
        ]
      },
      {
        name: 'Search',
        icon: 'table',
        path: '/lb/search-details',
        component: SearchDetail,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.SUPER_ADMIN,
          roles.LEADERBOARD_WRITE
        ]
      },
      {
        name: 'Search Device',
        icon: 'table',
        path: '/lb/search-device',
        component: SearchDevice,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.SUPER_ADMIN,
          roles.LEADERBOARD_WRITE
        ]
      },
      {
        name: 'Restore User',
        icon: 'table',
        path: '/lb/restore-user',
        component: RestoreUser,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.SUPER_ADMIN,
          roles.LEADERBOARD_WRITE
        ]
      },
      {
        name: 'Bulk User Remove',
        icon: 'table',
        path: '/lb/bulk-user-remove',
        component: BulkUserRemove,
        authority: [
          roles.LEADERBOARD_ADMIN,
          roles.SUPER_ADMIN,
          roles.LEADERBOARD_WRITE
        ]
      }
      // {
      //   name: "Block User",
      //   icon: "user",
      //   path: "/lb/block",
      //   component: UserDetails,
      //   authority: [
      //     roles.BANNER_ADMIN,
      //     roles.SUPER_ADMIN,
      //     roles.KYC_ADMIN,
      //     roles.UPDATER_ADMIN,
      //     roles.TOURNAMENT_ADMIN
      //   ]
      // }
    ]
  },
  {
    name: 'Search User',
    icon: 'user',
    path: '/search-user',
    authority: [roles.SUPER_ADMIN, roles.SEARCH_USER],
    routes: [
      {
        name: 'Search',
        icon: 'user',
        path: '/search-user/index',
        component: SearchDetail,
        authority: [roles.SUPER_ADMIN, roles.SEARCH_USER]
      }
    ]
  },
  // {
  //   name: 'Followers',
  //   icon: 'like',
  //   path: '/follower',
  //   authority: [roles.SUPER_ADMIN, roles.PROFILE_ADMIN, roles.PROFILE_WRITE],
  //   routes: [
  //     {
  //       name: 'List',
  //       icon: 'table',
  //       path: '/follower/list',
  //       component: FollowerList,
  //       authority: [roles.SUPER_ADMIN, roles.PROFILE_WRITE, roles.PROFILE_ADMIN]
  //     }
  //   ]
  // },
  {
    name: 'Search Config',
    icon: 'search',
    path: '/search-config',
    authority: [
      roles.SUPER_ADMIN,
      roles.SEARCH_CONFIG_ADMIN,
      roles.SEARCH_CONFIG_WRITE
    ],
    routes: [
      {
        name: 'List',
        icon: 'search',
        path: '/search-config/configure',
        component: SearchConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEARCH_CONFIG_ADMIN,
          roles.SEARCH_CONFIG_WRITE
        ]
      }
    ]
  },
  {
    name: 'Referral Config',
    icon: 'setting',
    path: '/referral-config',
    authority: [
      roles.SUPER_ADMIN,
      roles.REFERRAL_CONFIG_ADMIN,
      roles.REFERRAL_CONFIG_WRITE
    ],
    routes: [
      // {
      //   name: 'Frontend',
      //   icon: 'setting',
      //   path: '/referral-config/frontend',
      //   component: FrontendConfig,
      //   authority: [
      //     roles.SUPER_ADMIN,
      //     roles.REFERRAL_CONFIG_ADMIN,
      //     roles.REFERRAL_CONFIG_WRITE
      //   ]
      // },
      {
        name: 'Backend',
        icon: 'setting',
        path: '/referral-config/backend',
        component: BackendConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.REFERRAL_CONFIG_ADMIN,
          roles.REFERRAL_CONFIG_WRITE
        ]
      },
      // {
      //   name: 'Frontend V85',
      //   icon: 'setting',
      //   path: '/referral-config/frontend-v85',
      //   component: FrontendConfigV85,
      //   authority: [
      //     roles.SUPER_ADMIN,
      //     roles.REFERRAL_CONFIG_ADMIN,
      //     roles.REFERRAL_CONFIG_WRITE
      //   ]
      // },
      {
        name: 'Client Config',
        icon: 'setting',
        path: '/referral-config/client-config',
        component: ClientConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.REFERRAL_CONFIG_ADMIN,
          roles.REFERRAL_CONFIG_WRITE
        ]
      },
      {
        name: 'Config',
        icon: 'setting',
        path: '/referral-config/referral-config',
        component: ReferralConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.REFERRAL_CONFIG_ADMIN,
          roles.REFERRAL_CONFIG_WRITE
        ]
      },
      {
        name: 'Contextual Config',
        icon: 'setting',
        path: '/referral-config/contextual-config',
        component: ContextualConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.REFERRAL_CONFIG_ADMIN,
          roles.REFERRAL_CONFIG_WRITE
        ]
      },
      {
        name: 'User Profile Config',
        icon: 'setting',
        path: '/referral-config/user-profile-config',
        component: UserProfileConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.REFERRAL_CONFIG_ADMIN,
          roles.REFERRAL_CONFIG_WRITE
        ]
      }
    ]
  },
  {
    name: 'Verify User',
    icon: 'user',
    path: '/verify-user',
    authority: [
      roles.SUPER_ADMIN,
      roles.VERIFY_USER_ADMIN,
      roles.VERIFY_USER_WRITE,
      roles.VERIFY_USER_READ
    ],
    routes: [
      {
        name: 'Search',
        icon: 'search',
        path: '/verify-user/user',
        component: VerifyUser,
        authority: [
          roles.SUPER_ADMIN,
          roles.VERIFY_USER_ADMIN,
          roles.VERIFY_USER_WRITE,
          roles.VERIFY_USER_READ
        ]
      }
    ]
  },
  {
    name: 'Audio Room',
    icon: 'audio',
    path: '/audio',
    authority: [
      roles.SUPER_ADMIN,
      roles.VERIFY_USER_ADMIN,
      roles.VERIFY_USER_WRITE,
      roles.VERIFY_USER_READ
    ],
    routes: [
      {
        name: 'Audio Room List',
        icon: 'unordered-list',
        path: '/audio/list',
        component: AudioRoomList,
        authority: [
          roles.SUPER_ADMIN,
          roles.VERIFY_USER_ADMIN,
          roles.VERIFY_USER_WRITE,
          roles.VERIFY_USER_READ
        ]
      },
      {
        name: 'Influencer List',
        icon: 'search',
        path: '/influencer-user/user',
        component: InfluencerList,
        authority: [
          roles.SUPER_ADMIN,
          roles.VERIFY_USER_ADMIN,
          roles.VERIFY_USER_WRITE,
          roles.VERIFY_USER_READ
        ]
      },
      {
        name: 'Topics',
        icon: 'unordered-list',
        path: '/audio/topics',
        component: Topic,
        authority: [
          roles.SUPER_ADMIN,
          roles.VERIFY_USER_ADMIN,
          roles.VERIFY_USER_WRITE,
          roles.VERIFY_USER_READ
        ]
      },
      {
        name: 'Order Filters',
        icon: 'ordered-list',
        path: '/audio/order-filters',
        component: ArrangeFilterTags,
        authority: [
          roles.SUPER_ADMIN,
          roles.VERIFY_USER_ADMIN,
          roles.VERIFY_USER_WRITE,
          roles.VERIFY_USER_READ
        ]
      }
    ]
  },
  {
    name: 'Tier Widget',
    icon: 'setting',
    path: '/tier-widget',
    authority: [
      roles.SUPER_ADMIN,
      roles.TIER_WIDGET_ADMIN,
      roles.TIER_WIDGET_WRITE,
      roles.TIER_WIDGET_READ
    ],
    routes: [
      {
        name: 'Configure',
        icon: 'setting',
        path: '/tier-widget/configure',
        component: Configure,
        authority: [
          roles.SUPER_ADMIN,
          roles.TIER_WIDGET_ADMIN,
          roles.TIER_WIDGET_WRITE,
          roles.TIER_WIDGET_READ
        ]
      },
      {
        name: 'View',
        icon: 'eye',
        path: '/tier-widget/view',
        component: TierWidgetView,
        authority: [
          roles.SUPER_ADMIN,
          roles.TIER_WIDGET_ADMIN,
          roles.TIER_WIDGET_WRITE,
          roles.TIER_WIDGET_READ
        ]
      },
      {
        name: 'Declutter Homepage',
        icon: 'setting',
        path: '/tier-widget/declutter-homepage',
        component: DeclutterHomepage,
        authority: [
          roles.SUPER_ADMIN,
          roles.TIER_WIDGET_ADMIN,
          roles.TIER_WIDGET_WRITE
        ]
      }
    ]
  },
  // {
  //   name: 'Influencer',
  //   icon: 'user',
  //   path: '/influencer-user',
  //   authority: [
  //     roles.SUPER_ADMIN,
  //     roles.VERIFY_USER_ADMIN,
  //     roles.VERIFY_USER_WRITE,
  //     roles.VERIFY_USER_READ
  //   ],
  //   routes: [
  //     {
  //       name: 'List',
  //       icon: 'search',
  //       path: '/influencer-user/user',
  //       component: InfluencerList,
  //       authority: [
  //         roles.SUPER_ADMIN,
  //         roles.VERIFY_USER_ADMIN,
  //         roles.VERIFY_USER_WRITE,
  //         roles.VERIFY_USER_READ
  //       ]
  //     }
  //   ]
  // },
  {
    name: 'Deals',
    icon: 'user',
    path: '/deal',
    authority: [
      roles.SUPER_ADMIN,
      roles.OFFER_ADMIN,
      roles.OFFER_WRITE,
      roles.OFFER_READ
    ],
    routes: [
      {
        name: 'Create Product',
        icon: 'plus',
        path: '/deal/create-product',
        component: CreateProduct,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Product List',
        icon: 'unordered-list',
        path: '/deal/product-list',
        component: ListProduct,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Create Deal',
        icon: 'plus',
        path: '/deal/create-deal',
        component: CreateDeal,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Deal List',
        icon: 'unordered-list',
        path: '/deal/deal-list',
        component: ListDeal,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Order List',
        icon: 'unordered-list',
        path: '/deal/order-list',
        component: ListOrder,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Create Voucher',
        icon: 'plus',
        path: '/deal/create-voucher',
        component: CreateVoucher,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Voucher List',
        icon: 'unordered-list',
        path: '/deal/voucher-list',
        component: ListVoucher,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Create Auction',
        icon: 'plus',
        path: '/deal/create-auction',
        component: CreateAuction,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Auction List',
        icon: 'unordered-list',
        path: '/deal/auction-list',
        component: ListAuction,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Create Withdraw-Voucher',
        icon: 'plus',
        path: '/deal/create-withdrawable-voucher',
        component: CreateWithdrawableVoucher,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      },
      {
        name: 'Withdraw-Voucher List',
        icon: 'unordered-list',
        path: '/deal/withdrawable-voucher-list',
        component: ListWithdrawableVoucher,
        authority: [
          roles.SUPER_ADMIN,
          roles.OFFER_ADMIN,
          roles.OFFER_WRITE,
          roles.OFFER_READ
        ]
      }
    ]
  },
  {
    name: 'Refund',
    icon: 'user',
    path: '/refund',
    authority: [
      roles.SUPER_ADMIN,
      roles.POKER_FRAUD,
      roles.L2,
      roles.REFUND_SUPERVISOR,
      roles.POKER_LEADERBOARD,
      roles.US_REFUND_SUPERVISOR,
      roles.US_L2
    ],
    routes: [
      {
        name: 'Refund',
        icon: 'user',
        path: '/refund/dashboard',
        component: RefundDashboard,
        authority: [
          roles.SUPER_ADMIN,
          roles.REFUND_SUPERVISOR,
          roles.L2,
          roles.US_L2,
          roles.US_REFUND_SUPERVISOR
        ]
      },
      {
        name: 'Debit',
        icon: 'user',
        path: '/refund/debit-dashboard',
        component: DebitDashboard,
        authority: [
          roles.SUPER_ADMIN,
          roles.PROJECT_MANAGER_ADMIN,
          roles.PROJECT_MANAGER_WRITE,
          roles.CUSTOMER_SUPPORT_HEAD_ADMIN,
          roles.CUSTOMER_SUPPORT_HEAD_WRITE,
          roles.POKER_FRAUD,
          roles.REFUND_SUPERVISOR,
          roles.US_REFUND_SUPERVISOR
        ]
      }
    ]
  },
  {
    name: 'Credit Winning',
    icon: 'user',
    path: '/credit-winnings',
    authority: [roles.SUPER_ADMIN, roles.CREDIT_WINNING],
    routes: [
      {
        name: 'Poker',
        icon: 'user',
        path: '/credit-winnings/poker',
        component: CreditWinning,
        authority: [roles.SUPER_ADMIN, roles.CREDIT_WINNING]
      }
    ]
  },
  {
    name: 'Rummy Customer',
    icon: 'right-circle',
    path: '/rummy-customer',
    authority: [
      roles.SUPER_ADMIN,
      roles.RUMMY_CUSTOMER_SUPPORT_ADMIN,
      roles.RUMMY_CUSTOMER_SUPPORT_WRITE
    ],
    routes: [
      {
        name: 'Dashboard',
        icon: 'right-circle',
        path: '/rummy-customer/index',
        component: RummyCustomerSupport,
        authority: [
          roles.SUPER_ADMIN,
          roles.RUMMY_CUSTOMER_SUPPORT_ADMIN,
          roles.RUMMY_CUSTOMER_SUPPORT_WRITE
        ]
      },
      {
        name: 'Dashboard V2',
        icon: 'right-circle',
        path: '/rummy-customer/index-v2',
        component: RummyCustomerSupportV2,
        authority: [
          roles.SUPER_ADMIN,
          roles.RUMMY_CUSTOMER_SUPPORT_ADMIN,
          roles.RUMMY_CUSTOMER_SUPPORT_WRITE
        ]
      }
    ]
  },
  {
    name: 'Website Upload',
    icon: 'upload',
    path: '/website',
    authority: [
      roles.SUPER_ADMIN,
      roles.WEBSITE_APK_UPLOAD_ADMIN,
      roles.WEBSITE_APK_UPLOAD_WRITE,
      roles.MARKETING_APK_UPLOAD_ADMIN,
      roles.WEBSITE_ADMIN,
      roles.WEBSITE_WRITE
    ],
    routes: [
      {
        name: 'Upload',
        icon: 'upload',
        path: '/website/upload',
        component: UploadApk,
        authority: [
          roles.SUPER_ADMIN,
          roles.WEBSITE_APK_UPLOAD_ADMIN,
          roles.WEBSITE_APK_UPLOAD_WRITE
        ]
      },
      {
        name: 'Reassign',
        icon: 'upload',
        path: '/website/reassign',
        component: ReassignApk,
        authority: [
          roles.SUPER_ADMIN,
          roles.WEBSITE_APK_UPLOAD_ADMIN,
          roles.WEBSITE_APK_UPLOAD_WRITE
        ]
      },
      {
        name: 'Marketing Upload',
        icon: 'upload',
        path: '/website/marketing-upload',
        component: MarketingUploadApk,
        authority: [roles.SUPER_ADMIN, roles.MARKETING_APK_UPLOAD_ADMIN]
      },
      {
        name: 'CMS',
        icon: 'upload',
        path: '/website/cms',
        component: WebsiteCMS,
        authority: [roles.SUPER_ADMIN, roles.WEBSITE_ADMIN, roles.WEBSITE_WRITE]
      },
      {
        name: 'CMS Page History',
        icon: 'upload',
        path: '/website/cms-page-history',
        component: WebsiteCMSPageHistory,
        authority: [roles.SUPER_ADMIN, roles.WEBSITE_ADMIN, roles.WEBSITE_WRITE]
      },
      {
        name: 'CMS Config',
        icon: 'upload',
        path: '/website/cms-config',
        component: WebsiteCMSConfig,
        authority: [roles.SUPER_ADMIN, roles.WEBSITE_ADMIN]
      }
    ]
  },
  {
    name: 'Finish Lobby',
    icon: 'team',
    path: '/lobby',
    authority: [
      roles.SUPER_ADMIN,
      roles.FINISH_LOBBY_ADMIN,
      roles.FINISH_LOBBY_WRITE
    ],
    routes: [
      {
        name: 'Search',
        icon: 'search',
        path: '/lobby/finish',
        component: FinishLobby,
        authority: [
          roles.SUPER_ADMIN,
          roles.FINISH_LOBBY_ADMIN,
          roles.FINISH_LOBBY_WRITE
        ]
      }
    ]
  },
  {
    name: 'User Search',
    icon: 'search',
    path: '/user-search',
    authority: [
      roles.SUPER_ADMIN,
      roles.USER_SEARCH_ADMIN,
      roles.USER_SEARCH_WRITE
    ],
    routes: [
      {
        name: 'Search',
        icon: 'user',
        path: '/user-search/search',
        component: UserSearch,
        authority: [
          roles.SUPER_ADMIN,
          roles.USER_SEARCH_ADMIN,
          roles.USER_SEARCH_WRITE
        ]
      }
    ]
  },
  {
    name: 'CRM',
    icon: 'setting',
    path: '/crm',
    authority: [
      roles.SUPER_ADMIN,
      roles.REFUND_SUPERVISOR,
      roles.CRM_ADMIN,
      roles.CRM_WRITE,
      roles.US_REFUND_SUPERVISOR
    ],
    routes: [
      {
        name: 'Search',
        icon: 'search',
        path: '/crm/dashboard',
        component: CRM,
        authority: [roles.SUPER_ADMIN, roles.CRM_ADMIN, roles.CRM_WRITE]
      },
      {
        name: 'VIP Customer',
        icon: 'search',
        path: '/crm/vip-customer',
        component: VipCustomer,
        authority: [roles.SUPER_ADMIN, roles.REFUND_SUPERVISOR, roles.VIP_AGENT]
      },
      {
        name: 'Wipe User Profile',
        icon: 'search',
        path: '/crm/wipe-profile',
        component: WipeUserProfile,
        authority: [roles.SUPER_ADMIN, roles.REFUND_SUPERVISOR]
      },
      {
        name: 'Reset User Avatar',
        icon: 'setting',
        path: '/crm/reset-user-avatar',
        component: ResetUserAvatar,
        authority: [roles.SUPER_ADMIN, roles.REFUND_SUPERVISOR]
      },
      {
        name: 'External Users',
        icon: 'user',
        path: '/crm/external-users',
        component: ExternalUserList,
        authority: [roles.SUPER_ADMIN, roles.REFUND_SUPERVISOR]
      }
    ]
  },
  {
    name: 'Upload',
    icon: 'upload',
    path: '/upload',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN
    ],
    routes: [
      {
        name: 'Upload Files',
        icon: 'upload',
        path: '/upload/index',
        component: FileUploader,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN
        ]
      }
    ]
  },
  {
    name: 'Announcement',
    icon: 'bell',
    path: '/announcement',
    authority: [
      roles.SUPER_ADMIN,
      roles.ANNOUNCEMENT_ADMIN,
      roles.ANNOUNCEMENT_WRITE
    ],
    routes: [
      {
        name: 'Popup',
        icon: 'bell',
        path: '/announcement/popup',
        component: AnnouncementPopup,
        authority: [
          roles.SUPER_ADMIN,
          roles.ANNOUNCEMENT_ADMIN,
          roles.ANNOUNCEMENT_WRITE
        ]
      }
      // {
      //   name: 'New Depositor',
      //   icon: 'bell',
      //   path: '/announcement/new-depositor',
      //   component: AnnouncementNewDepositor,
      //   authority: [
      //     roles.SUPER_ADMIN,
      //     roles.ANNOUNCEMENT_ADMIN,
      //     roles.ANNOUNCEMENT_WRITE
      //   ]
      // }
    ]
  },
  {
    name: 'Zookeeper',
    icon: 'setting',
    path: '/zookeeper',
    authority: [
      roles.SUPER_ADMIN,
      roles.ZOOKEEPER_ADMIN,
      roles.ZOOKEEPER_WRITE,
      roles.ZOOKEEPER_READ
    ],
    routes: [
      {
        name: 'Configure',
        icon: 'search',
        path: '/zookeeper/dashboard',
        component: ZooUI,
        authority: [
          roles.SUPER_ADMIN,
          roles.ZOOKEEPER_ADMIN,
          roles.ZOOKEEPER_WRITE,
          roles.ZOOKEEPER_READ
        ]
      }
    ]
  },
  {
    name: 'BOT',
    icon: 'setting',
    path: '/bot',
    authority: [
      roles.SUPER_ADMIN,
      roles.BOT_MESSAGE_ADMIN,
      roles.BOT_MESSAGE_WRITE
    ],
    routes: [
      {
        name: 'Bot',
        icon: 'setting',
        path: '/bot/message',
        component: BotMessage,
        authority: [
          roles.SUPER_ADMIN,
          roles.BOT_MESSAGE_ADMIN,
          roles.BOT_MESSAGE_WRITE
        ]
      }
    ]
  },
  {
    name: 'Segmentation',
    icon: 'setting',
    path: '/segmentation',
    authority: [
      roles.SUPER_ADMIN,
      roles.SEGMENTATION_ADMIN,
      roles.SEGMENTATION_WRITE
    ],
    routes: [
      {
        name: 'Create',
        icon: 'plus',
        path: '/segmentation/create',
        component: CreateCustomSegment,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      },
      {
        name: 'List',
        icon: 'unordered-list',
        path: '/segmentation/list',
        component: ListCustomSegment,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      },
      {
        name: 'Order',
        icon: 'ordered-list',
        path: '/segmentation/order',
        component: CustomSegmentOrder,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      },
      {
        name: 'Home Config',
        icon: 'setting',
        path: '/segmentation/home-config',
        component: SegmentTierConfigure,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      },
      {
        name: 'Featured',
        icon: 'setting',
        path: '/segmentation/featured-config',
        component: FeaturedEventConfigure,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      },
      {
        name: 'Featured New',
        icon: 'setting',
        path: '/segmentation/featured-config-new',
        component: FeaturedEventNew,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      },
      {
        name: 'Featured Order',
        icon: 'ordered-list',
        path: '/segmentation/featured-order',
        component: FeaturedEventOrder,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      },
      // {
      //   name: 'Add Game',
      //   icon: 'plus',
      //   path: '/segmentation/add-game',
      //   component: AddGameToCustomSegment,
      //   authority: [
      //     roles.SUPER_ADMIN,
      //     roles.SEGMENTATION_ADMIN,
      //     roles.SEGMENTATION_WRITE,
      //   ],
      // },
      {
        name: 'Day Wise',
        icon: 'plus',
        path: '/segmentation/day-wise',
        component: DayWiseUserSegment,
        authority: [
          roles.SUPER_ADMIN,
          roles.SEGMENTATION_ADMIN,
          roles.SEGMENTATION_WRITE
        ]
      }
    ]
  },
  {
    name: 'Clevertap',
    icon: 'setting',
    path: '/clevertap',
    authority: [roles.SUPER_ADMIN, roles.CLEVERTAP_ADMIN],
    routes: [
      {
        name: 'Profile',
        icon: 'setting',
        path: '/clevertap/profile',
        component: Clevertap,
        authority: [roles.SUPER_ADMIN, roles.CLEVERTAP_ADMIN]
      }
    ]
  },
  {
    name: 'Dynamic Upselling',
    icon: 'gift',
    path: '/dynamic-upselling',
    authority: [
      roles.DYNAMIC_UPSELLING_ADMIN,
      roles.SUPER_ADMIN,
      roles.DYNAMIC_UPSELLING_READ,
      roles.DYNAMIC_UPSELLING_WRITE
    ],
    routes: [
      {
        name: 'Create Offer',
        icon: 'form',
        path: '/dynamic-upselling/create',
        component: DUCreateOffer,
        authority: [
          roles.DYNAMIC_UPSELLING_ADMIN,
          roles.SUPER_ADMIN,
          roles.DYNAMIC_UPSELLING_WRITE
        ]
      },
      {
        name: 'List Offers',
        icon: 'table',
        path: '/dynamic-upselling/offers',
        component: DUListOffers,
        authority: [
          roles.DYNAMIC_UPSELLING_ADMIN,
          roles.SUPER_ADMIN,
          roles.DYNAMIC_UPSELLING_WRITE,
          roles.DYNAMIC_UPSELLING_READ
        ]
      },
      {
        name: 'Offer Names',
        icon: 'table',
        path: '/dynamic-upselling/offer-name-list',
        component: DUOfferNameList,
        authority: [
          roles.DYNAMIC_UPSELLING_ADMIN,
          roles.SUPER_ADMIN,
          roles.DYNAMIC_UPSELLING_WRITE,
          roles.DYNAMIC_UPSELLING_READ
        ]
      }
    ]
  },
  {
    name: 'Home Screen P2',
    icon: 'setting',
    path: '/home-screen',
    authority: [
      roles.SUPER_ADMIN,
      roles.CONFIGURABLE_HOME_CONFIG_ADMIN,
      roles.CONFIGURABLE_HOME_CONFIG_WRITE
    ],
    routes: [
      {
        name: 'Configure',
        icon: 'setting',
        path: '/home-screen/configurable-home-config',
        component: ConfigurableHomeConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.CONFIGURABLE_HOME_CONFIG_ADMIN,
          roles.CONFIGURABLE_HOME_CONFIG_WRITE
        ]
      }
    ]
  },
  {
    name: 'Common Upload',
    icon: 'upload',
    path: '/common-upload',
    authority: [
      roles.TOURNAMENT_WRITE,
      roles.SUPER_ADMIN,
      roles.TOURNAMENT_ADMIN,
      roles.LEADERBOARD_ADMIN,
      roles.LEADERBOARD_WRITE,
      roles.BANNER_ADMIN,
      roles.BANNER_WRITE,
      roles.GAME_ADMIN,
      roles.GAME_WRITE,
      roles.FANTASY_ADMIN,
      roles.FANTASY_WRITE,
      roles.SPECIAL_TOURNAMENT_ADMIN,
      roles.SPECIAL_TOURNAMENT_WRITE,
      roles.GAME_UPDATE
    ],
    routes: [
      {
        name: 'Upload Files',
        icon: 'upload',
        path: '/common-upload/index',
        component: CommonUploader,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN,
          roles.LEADERBOARD_ADMIN,
          roles.LEADERBOARD_WRITE,
          roles.BANNER_ADMIN,
          roles.BANNER_WRITE,
          roles.GAME_ADMIN,
          roles.GAME_WRITE,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.SPECIAL_TOURNAMENT_ADMIN,
          roles.SPECIAL_TOURNAMENT_WRITE,
          roles.GAME_UPDATE
        ]
      },
      {
        name: 'Base 64',
        icon: 'upload',
        path: '/common-upload/base64',
        component: CommonUploaderBase64,
        authority: [
          roles.TOURNAMENT_WRITE,
          roles.SUPER_ADMIN,
          roles.TOURNAMENT_ADMIN,
          roles.LEADERBOARD_ADMIN,
          roles.LEADERBOARD_WRITE,
          roles.BANNER_ADMIN,
          roles.BANNER_WRITE,
          roles.GAME_ADMIN,
          roles.GAME_WRITE,
          roles.FANTASY_ADMIN,
          roles.FANTASY_WRITE,
          roles.SPECIAL_TOURNAMENT_ADMIN,
          roles.SPECIAL_TOURNAMENT_WRITE,
          roles.GAME_UPDATE
        ]
      }
    ]
  },
  {
    name: 'Home/Discover Widget config',
    icon: 'setting',
    path: '/config-hd-widget',
    authority: [
      roles.CONFIG_HOME_DISCOVERY_WIDGET_ADMIN,
      roles.SUPER_ADMIN,
      roles.CONFIG_HOME_DISCOVERY_WIDGET_READ,
      roles.CONFIG_HOME_DISCOVERY_WIDGET_WRITE
    ],
    routes: [
      {
        name: 'Home Widget',
        icon: 'form',
        path: '/config-hd-widget/home',
        component: HomeWidgetConfig,
        authority: [
          roles.CONFIG_HOME_DISCOVERY_WIDGET_ADMIN,
          roles.SUPER_ADMIN,
          roles.CONFIG_HOME_DISCOVERY_WIDGET_WRITE,
          roles.CONFIG_HOME_DISCOVERY_WIDGET_READ
        ]
      },
      {
        name: 'Discover Widget',
        icon: 'form',
        path: '/config-hd-widget/discovery',
        component: DiscoveryWidgetConfig,
        authority: [
          roles.CONFIG_HOME_DISCOVERY_WIDGET_ADMIN,
          roles.SUPER_ADMIN,
          roles.CONFIG_HOME_DISCOVERY_WIDGET_WRITE,
          roles.CONFIG_HOME_DISCOVERY_WIDGET_READ
        ]
      },
      {
        name: 'Widget Order',
        icon: 'form',
        path: '/config-hd-widget/order',
        component: WidgetOrder,
        authority: [
          roles.CONFIG_HOME_DISCOVERY_WIDGET_ADMIN,
          roles.SUPER_ADMIN,
          roles.CONFIG_HOME_DISCOVERY_WIDGET_WRITE,
          roles.CONFIG_HOME_DISCOVERY_WIDGET_READ
        ]
      }
    ]
  },
  {
    name: 'Live Streams',
    icon: 'video-camera',
    path: '/live-streams',
    authority: [
      roles.LIVE_STREAM_ADMIN,
      roles.SUPER_ADMIN,
      roles.LIVE_STREAM_READ,
      roles.LIVE_STREAM_WRITE
    ],
    routes: [
      {
        name: 'Streams List',
        icon: 'unordered-list',
        path: '/live-streams/list',
        component: LiveStreamList,
        authority: [
          roles.LIVE_STREAM_ADMIN,
          roles.SUPER_ADMIN,
          roles.LIVE_STREAM_WRITE,
          roles.LIVE_STREAM_READ
        ]
      },
      {
        name: 'Ban/Unban Users',
        icon: 'unordered-list',
        path: '/live-streams/manage-user',
        component: UserManagement,
        authority: [
          roles.LIVE_STREAM_ADMIN,
          roles.SUPER_ADMIN,
          roles.LIVE_STREAM_WRITE,
          roles.LIVE_STREAM_READ
        ]
      }
    ]
  },
  {
    name: 'User Feature Access',
    icon: 'setting',
    path: '/user-features',
    authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN],
    routes: [
      {
        name: 'Search User',
        icon: 'setting',
        path: '/user-features/manage',
        component: FASearchUser,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Block User(s)',
        icon: 'setting',
        path: '/user-features/block',
        component: BlockUnblockUser,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Unblock User(s)',
        icon: 'setting',
        path: '/user-features/unblock',
        component: BlockUnblockUser,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      }
    ]
  },
  {
    name: 'Featured Event',
    icon: 'setting',
    path: '/featured-event',
    authority: [roles.SUPER_ADMIN, roles.FEATURED_EVENT_ADMIN],
    routes: [
      {
        name: 'Configure',
        icon: 'plus',
        path: '/featured-event/configure',
        component: FeaturedConfigure,
        authority: [roles.SUPER_ADMIN, roles.FEATURED_EVENT_ADMIN]
      },
      {
        name: 'Order',
        icon: 'unordered-list',
        path: '/featured-event/offers',
        component: FeaturedOrder,
        authority: [roles.SUPER_ADMIN, roles.FEATURED_EVENT_ADMIN]
      }
    ]
  },
  {
    name: 'Process Earnings',
    icon: 'dollar',
    path: '/process-earnings',
    authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN],
    routes: [
      {
        name: 'Process',
        icon: 'dollar',
        path: '/process-earnings/process',
        component: ProcessBulkPayment,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      }
    ]
  },
  {
    name: 'Fraud',
    icon: 'form',
    path: '/fraud',
    authority: [roles.SUPER_ADMIN, roles.ISOLATED_BLOCK],
    routes: [
      {
        name: 'Isolated Block',
        icon: 'form',
        path: '/fraud/block',
        component: IsolatedBlock,
        authority: [roles.SUPER_ADMIN, roles.ISOLATED_BLOCK]
      },
      {
        name: 'Investigation',
        icon: 'form',
        path: '/fraud/investigation',
        component: FraudInvestigation,
        authority: [roles.SUPER_ADMIN, roles.ISOLATED_BLOCK]
      },
      {
        name: 'App Level Block V2',
        icon: 'form',
        path: '/isolated-block/app-level-block-v2',
        component: AppLevelBlockV2Main,
        authority: [roles.SUPER_ADMIN, roles.ISOLATED_BLOCK]
      },
      {
        name: 'Collusion',
        icon: 'form',
        path: '/fraud/collusion',
        component: Collusion,
        authority: [roles.SUPER_ADMIN, roles.ISOLATED_BLOCK]
      },
      {
        name: 'Collusion Withdrawl',
        icon: 'form',
        path: '/fraud/collusion-withdrawl',
        component: CollusionWithdrawl,
        authority: [roles.SUPER_ADMIN, roles.ISOLATED_BLOCK]
      },
      {
        name: 'Fraud Rules',
        icon: 'form',
        path: '/fraud/fraud-rules',
        component: FraudRules,
        authority: [roles.SUPER_ADMIN, roles.FRAUD_RULES_ADMIN]
      }
    ]
  },
  {
    name: 'Referral Device ID',
    icon: 'form',
    path: '/referral-device-id',
    authority: [roles.SUPER_ADMIN, roles.REFERRAL_DEVICE_ID],
    routes: [
      {
        name: 'Device',
        icon: 'form',
        path: '/referral-device-id/index',
        component: ReferralTesting,
        authority: [roles.SUPER_ADMIN, roles.REFERRAL_DEVICE_ID]
      }
    ]
  },
  {
    name: 'Stories',
    icon: 'form',
    path: '/stories',
    authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN],
    routes: [
      {
        name: 'Create Hashtag',
        icon: 'form',
        path: '/stories/create-hashtag',
        component: CreateHashtag,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Manage Hashtags',
        icon: 'control',
        path: '/stories/hashtag-order',
        component: HashtagOrder,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Hashtag LB (CRM)',
        icon: 'control',
        path: '/stories/hashtag-lb-external',
        component: HashtagLBExternal,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'View Story',
        icon: 'eye',
        path: '/stories/view-story',
        component: ViewStory,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Create Music Category',
        icon: 'form',
        path: '/stories/create-music-category',
        component: CreateMusicCategory,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Manage Music Category Order',
        icon: 'control',
        path: '/stories/music-category-order',
        component: MusicCategoryOrder,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Music Upload',
        icon: 'upload',
        path: '/stories/upload-music',
        component: MusicUpload,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Manage Music',
        icon: 'control',
        path: '/stories/manage-music',
        component: MusicOrder,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      // {
      //   name: 'Create Sticker Category',
      //   icon: 'form',
      //   path: '/stories/create-sticker-category',
      //   component: CreateStickerCategory,
      //   authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      // },
      // {
      //   name: 'Manage Sticker Category',
      //   icon: 'control',
      //   path: '/stories/manage-sticker-category',
      //   component: StickerCategoryOrder,
      //   authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      // },
      {
        name: 'Create Sticker',
        icon: 'form',
        path: '/stories/create-sticker',
        component: CreateSticker,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Create Bulk Sticker',
        icon: 'form',
        path: '/stories/create-bulk-sticker',
        component: StickerUploadBulk,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Manage Stickers',
        icon: 'form',
        path: '/stories/manage-stickers',
        component: StickerOrder,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Manual Moderation',
        icon: 'control',
        path: '/stories/manual-moderation',
        component: ManualModeration,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Ban User Story Creation',
        icon: 'control',
        path: '/stories/ban-story-creation',
        component: BanStoryCreation,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Unban Story Creation',
        icon: 'control',
        path: '/stories/unban-story-creation',
        component: UnbanStoryCreation,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      },
      {
        name: 'Trending Hashtag Config',
        icon: 'control',
        path: '/stories/trending-hashtag-config',
        component: TrendingHashtagConfig,
        authority: [roles.SUPER_ADMIN, roles.SOCIAL_ADMIN]
      }
    ]
  },
  {
    name: 'Promo Dashboard',
    icon: 'form',
    path: '/promo',
    authority: [roles.SUPER_ADMIN, roles.PROMO_DASHBOARD],
    routes: [
      {
        name: 'Promo Dashboard',
        icon: 'form',
        path: '/promo/dashboard',
        component: PromoDashboard,
        authority: [roles.SUPER_ADMIN, roles.PROMO_DASHBOARD]
      }
    ]
  },
  {
    name: 'i18n - Config Management',
    icon: 'dollar',
    path: '/i18n-config',
    authority: [roles.SUPER_ADMIN, roles.I18NCMS_ADMIN, roles.I18NCMS_WRITE],
    routes: [
      {
        name: 'Create Config Node',
        icon: 'setting',
        path: '/i18n-config/create',
        component: I18nCreateConfig,
        authority: [roles.SUPER_ADMIN, roles.I18NCMS_ADMIN, roles.I18NCMS_WRITE]
      },
      {
        name: 'List Configs',
        icon: 'unordered-list',
        path: '/i18n-config/list',
        component: I18nConfigsList,
        authority: [roles.SUPER_ADMIN, roles.I18NCMS_ADMIN, roles.I18NCMS_WRITE]
      },
      {
        name: 'Search Configs',
        icon: 'search',
        path: '/i18n-config/search',
        component: I18nSearchConfigs,
        authority: [roles.SUPER_ADMIN, roles.I18NCMS_ADMIN]
      },
      {
        name: 'Pending Requests',
        icon: 'unordered-list',
        path: '/i18n-config/pending-approvals',
        component: I18nPendingApprovalsList,
        authority: [roles.SUPER_ADMIN, roles.I18NCMS_ADMIN]
      },
      {
        name: 'Missing Configs',
        icon: 'search',
        path: '/i18n-config/missing-search',
        component: I18nMissingCountryConfigs,
        authority: [roles.SUPER_ADMIN, roles.I18NCMS_ADMIN]
      }
    ]
  },
  {
    name: 'Poker Ops',
    icon: 'form',
    path: '/poker',
    authority: [roles.SUPER_ADMIN, roles.POKER_ADMIN, roles.POKER_L2],
    routes: [
      {
        name: 'Wallet',
        icon: 'form',
        path: '/poker/balance',
        component: PokerBalance,
        authority: [roles.SUPER_ADMIN, roles.POKER_ADMIN, roles.POKER_L2]
      },
      {
        name: 'Transact',
        icon: 'form',
        path: '/poker/transact',
        component: PokerTransact,
        authority: [roles.SUPER_ADMIN, roles.POKER_ADMIN, roles.POKER_L2]
      }
    ]
  },
  {
    name: 'Product Infra',
    icon: 'control',
    path: '/prod-infra',
    authority: [
      roles.SUPER_ADMIN,
      roles.PRODUCT_INFRA_ADMIN,
      roles.PRODUCT_INFRA_WRITE,
      roles.PRODUCT_INFRA_READ
    ],
    routes: [
      {
        name: 'Reactivation Rewards',
        icon: 'form',
        path: '/prod-infra/reactivation-rewards',
        component: ReactivationRewardsConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE,
          roles.PRODUCT_INFRA_READ
        ]
      },
      {
        name: 'ML Config',
        icon: 'form',
        path: '/prod-infra/ml-config',
        component: MLConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE,
          roles.PRODUCT_INFRA_READ
        ]
      },
      {
        name: 'Mission Config',
        icon: 'form',
        path: '/prod-infra/mission',
        component: MissionConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE,
          roles.PRODUCT_INFRA_READ
        ],
        routes: []
      },
      {
        name: 'Client Config',
        icon: 'form',
        path: '/prod-infra/client-config',
        component: ProductInfraClientConfig,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE,
          roles.PRODUCT_INFRA_READ
        ]
      },
      {
        name: 'Home Management',
        icon: 'form',
        path: '/prod-infra/home-management',
        component: HomeManagement,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE,
          roles.PRODUCT_INFRA_READ
        ]
      },
      {
        name: 'Declutter Homepage',
        icon: 'setting',
        path: '/prod-infra/declutter-homepage',
        component: DeclutterHomepage,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE
        ]
      },
      {
        name: 'Hamburger',
        icon: 'setting',
        path: '/prod-infra/hamburger',
        component: Hamburger,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE
        ]
      },
      {
        name: 'Mission Segmentation',
        icon: 'setting',
        path: '/prod-infra/mission-segmentation',
        component: MissionSegmentation,
        authority: [
          roles.SUPER_ADMIN,
          roles.PRODUCT_INFRA_ADMIN,
          roles.PRODUCT_INFRA_WRITE
        ]
      }
    ]
  },
  {
    name: 'Esports League',
    icon: 'form',
    path: '/esports',
    authority: [roles.SUPER_ADMIN, roles.ESPORTS_ADMIN],
    routes: [
      {
        name: 'Create League',
        icon: 'form',
        path: '/esports/create-league',
        component: CreateLeague,
        authority: [roles.SUPER_ADMIN, roles.ESPORTS_ADMIN]
      },
      {
        name: 'List Esports League',
        icon: 'table',
        path: '/esports/list-league',
        component: ListEsportsLeague,
        authority: [roles.SUPER_ADMIN, roles.ESPORTS_ADMIN]
      },
      {
        name: 'Create League Stage',
        icon: 'form',
        path: '/esports/create-league-stage',
        component: CreateLeagueStage,
        authority: [roles.SUPER_ADMIN, roles.ESPORTS_ADMIN]
      },
      {
        name: 'List League Stage',
        icon: 'form',
        path: '/esports/list-league-stage',
        component: ListEsportsLeagueStage,
        authority: [roles.SUPER_ADMIN, roles.ESPORTS_ADMIN]
      }
    ]
  },
  {
    name: 'Game Broadcast',
    icon: 'play-square',
    path: '/game-broadcast',
    authority: [
      roles.SUPER_ADMIN,
      roles.GAME_BROADCAST_ADMIN,
      roles.GAME_BROADCAST_WRITE,
      roles.GAME_BROADCAST_READ
    ],
    routes: [
      {
        name: 'Battles',
        icon: 'table',
        path: '/game-broadcast/battles',
        component: GBBattles,
        authority: [roles.SUPER_ADMIN, roles.GAME_BROADCAST_ADMIN]
      },
      {
        name: 'Broadcasts',
        icon: 'table',
        path: '/game-broadcast/broadcasts',
        component: GBBroadcasts,
        authority: [roles.SUPER_ADMIN, roles.GAME_BROADCAST_ADMIN]
      },
      {
        name: 'VOD',
        icon: 'table',
        path: '/game-broadcast/vod',
        component: GBVod,
        authority: [roles.SUPER_ADMIN, roles.GAME_BROADCAST_ADMIN]
      },
      {
        name: 'Slates',
        icon: 'upload',
        path: '/game-broadcast/slates',
        component: GBGameSlates,
        authority: [roles.SUPER_ADMIN, roles.GAME_BROADCAST_ADMIN]
      },
      {
        name: 'Kill Broadcast',
        icon: 'delete',
        path: '/game-broadcast/kill-broadcast',
        component: GBKillBroadcast,
        authority: [roles.SUPER_ADMIN, roles.GAME_BROADCAST_ADMIN]
      },
      {
        name: 'Broadcasters',
        icon: 'user',
        path: '/game-broadcast/broadcasters',
        component: GBBroadcasters,
        authority: [roles.SUPER_ADMIN, roles.GAME_BROADCAST_ADMIN]
      },
      {
        name: 'Schedule',
        icon: 'table',
        path: '/game-broadcast/schedule',
        component: GBSchedule,
        authority: [
          roles.SUPER_ADMIN,
          roles.GAME_BROADCAST_ADMIN,
          roles.GAME_BROADCAST_READ
        ]
      },
      {
        name: 'Live Page',
        icon: 'form',
        path: '/game-broadcast/live',
        component: GBLivePage,
        authority: [roles.SUPER_ADMIN, roles.GAME_BROADCAST_ADMIN]
      }
    ]
  },
  {
    name: 'Live KO',
    icon: 'form',
    path: '/live-ko',
    authority: [roles.SUPER_ADMIN, roles.LIVE_KO_ADMIN],
    routes: [
      {
        name: 'Tournament',
        icon: 'form',
        path: '/live-ko/tournament',
        component: KoTournament,
        authority: [roles.SUPER_ADMIN, roles.LIVE_KO_ADMIN]
      }
    ]
  },
  {
    name: 'Game Streak',
    icon: 'form',
    path: '/game-streak',
    authority: [roles.SUPER_ADMIN, roles.GAME_STREAK_ADMIN],
    routes: [
      {
        name: 'Create Challenge',
        icon: 'form',
        path: '/game-streak/create',
        component: CreateGameStreakChallenge,
        authority: [roles.SUPER_ADMIN, roles.GAME_STREAK_ADMIN]
      },
      {
        name: 'List Challenge',
        icon: 'form',
        path: '/game-streak/list',
        component: ListGameStreakChallenges,
        authority: [roles.SUPER_ADMIN, roles.GAME_STREAK_ADMIN]
      }
    ]
  }
];
export default menu_route;
