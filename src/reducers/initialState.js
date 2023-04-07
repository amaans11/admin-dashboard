// let tournamentConfig;
// localForage.getItem("tournamentConfig").then(res => {
//   tournamentConfig = res;
// });
export default {
  layout: { sideMenuShow: false },
  auth: {
    currentUser: localStorage.getItem('cred')
      ? JSON.parse(localStorage.getItem('cred'))
      : {}
  },
  allGames: [],
  updater: {
    config: {},
    step: 0
  },
  sponsor: {},
  segment: {},
  limiter: {},
  kyc: {
    newList: []
  },
  groups: {
    groupsList: {}
  },
  banners: {},
  leaderboard: {
    lb: []
  },
  tournamentConfig: {
    configsList: {},
    createConfig: localStorage.getItem('createConfig')
      ? JSON.parse(localStorage.getItem('createConfig'))
      : {
          step: 0,
          val: {}
        }
  },
  dynamicUpselling: {
    config: {},
    offersByGameResponse: undefined,
    createOfferResponse: { id: undefined },
    updateOfferResponse: { id: undefined }
  }
};
