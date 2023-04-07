// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import {
  Card,
  Form,
  message,
  Button,
  Input,
  Radio,
  Spin,
  InputNumber,
  Row,
  Col,
  Tag,
  Tabs,
  Select,
  Modal,
  Table
} from 'antd';
import moment from 'moment';
import { get } from 'lodash';
import * as crmActions from '../../actions/crmActions';
import * as userProfileActions from '../../actions/UserProfileActions';
import * as referralActions from '../../actions/ReferralActions';
import * as supportPaymentActions from '../../actions/SupportPaymentActions';
import * as userDataActions from '../../actions/userDataActions';
import * as accountActions from '../../actions/accountsActions';
import * as fraudActions from '../../actions/fraudActions';
import GameSelection from './GameSelection';
import FantasySelection from './FantasySelection';
import PaymentSelection from './PaymentSelection';
import ReferralSelection from './ReferralSelection';
import KYCSelection from './KYCSelection';
import RummySelection from './RummySelection';
import CallbreakSelection from './CallbreakSelection';
import CollectibleSelection from './CollectibleSelection';
import FraudSelection from './FraudSelection';
import RefundSelection from './RefundSelection';
import SearchBattle from './SearchBattle';
import PrimeSelection from './PrimeSelection';
import SSNSelection from './SSNSelection';
import AccountClosureSelection from './AccountClosureSelection';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;

const userBattleStateList = ['WAITING', 'FINISHED', 'CANCELLED'];
const winningStateList = ['WINNER', 'LOSER', 'TIED', 'PENDING', 'REFUNDED'];

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

const referenceTypes = [
  'AUDIO_CS_REFUND',
  'BATTLE_ENTRY_FEE_CS_REFUND',
  'BATTLES_CS_REFUND',
  'BATTLE_WINNINGS_CS_REFUND',
  'CHALLENGES_CS_REFUND',
  'CRICKET_FANTASY_CS_REFUND',
  'FOOTBALL_FANTASY_CS_REFUND',
  'KABADDI_FANTASY_CS_REFUND',
  'OTHERS_CS_REFUND',
  'RUMMY_CS_REFUND',
  'STOCK_FANTASY_CS_REFUND',
  'TOURNAMENT_PARTICIPATION_CS_REFUND',
  'TOURNAMENTS_CS_REFUND',
  'TOURNAMENT_WINNINGS_CS_REFUND',
  'WELCOME_BONUS_CS_REFUND'
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const getRefundRole = userRoles => {
  let userGroupType = '';
  if (userRoles && userRoles.length > 0) {
    if (userRoles.includes('L1')) {
      userGroupType = 'L1';
    }
    if (
      userRoles.includes('L1_ESCALATION') ||
      userRoles.includes('L1_ESCALATIONS')
    ) {
      userGroupType = 'L1 ESCALATION';
    }
    if (userRoles.includes('FRAUD_DETECTION')) {
      userGroupType = 'FRAUD DETECTION';
    }

    if (userRoles.includes('VIP_AGENT')) {
      userGroupType = 'VIP AGENT';
    }

    if (userRoles.includes('L2') || userRoles.includes('CRM_ADMIN')) {
      userGroupType = 'L2';
    }
    if (
      userRoles.includes('REFUND_SUPERVISOR') ||
      userRoles.includes('MANAGER')
    ) {
      userGroupType = 'Refund Supervisor';
    }
    if (userRoles.includes('US_L1')) {
      userGroupType = 'US L1';
    }
    if (userRoles.includes('US_L2')) {
      userGroupType = 'US L2';
    }
  }
  return userGroupType;
};
class CRM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCriteria: 'MOBILE_NUMBER',
      loading: false,
      mobileNumber: '',
      transactionId: '',
      userId: '',
      referredId: '',
      loggedInTime: '',
      userWinnings: {},
      isRefund: false,
      createdOn: moment(),
      cumulativeWinnings: 0,
      deviceInfo: {},
      followDetails: {},
      appInfo: {},
      battleList: [],
      disabledAgents: [],
      primeStatus: '',
      subscriptionExpiryDate: '',
      autoRenew: false,
      transactionData: [],
      transactionCount: 1,
      dialog: false,
      currentTab: '1',
      battleDetails: [],
      category: '',
      disconnectionDetails: {},
      fraudDetails: {},
      refundEligibleConfig: false,
      gameDataList: [],
      showGameDataModal: false,
      isModalDetails: false,
      gameDataModal: {}
    };
    this.getCredibility = this.getCredibility.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    let userRoles = this.props.currentUser.user_role;
    this.props.actions.getDisabledRefundAgentList().then(() => {
      const refundRole = getRefundRole(userRoles);
      if (this.props.disabledRefundAgents) {
        this.setState({
          disabledAgents: this.props.disabledRefundAgents,
          refundRole: refundRole,
          refundEligibleConfig: this.props.refundEligibleConfig
        });
      }
    });
    if (
      userRoles.includes('SUPER_ADMIN') ||
      userRoles.includes('CRM_ADMIN') ||
      userRoles.includes('CRM_WRITE')
    ) {
      this.setState({ isRefund: true });
    } else {
      this.setState({ isRefund: false });
    }
    window.scrollTo(0, 0);
  }

  updateSearchCriteria(e) {
    let value = e.target.value;
    this.props.form.setFieldsValue({
      searchFor: null
    });
    this.setState({
      searchCriteria: value,
      basicProfile: null,
      userDashboardDetails: null,
      battleList: [],
      countryCode: ''
    });
  }
  getBattleState = value => {
    return userBattleStateList[value];
  };
  getWinningState(value) {
    return winningStateList[value];
  }
  selectCountry(value) {
    this.setState({
      countryCode: value
    });
  }
  getBattleByBattleId = data => {
    this.props.actions.getPlayerLobbyHistory(data).then(() => {
      if (
        this.props.getPlayerLobbyHistoryResponse &&
        Object.keys(this.props.getPlayerLobbyHistoryResponse).length > 0
      ) {
        let battleList = [];
        if (
          this.props.getPlayerLobbyHistoryResponse.finishedBattles &&
          this.props.getPlayerLobbyHistoryResponse.finishedBattles.length > 0
        ) {
          battleList = [
            ...this.props.getPlayerLobbyHistoryResponse.finishedBattles
          ];
        } else {
          message.error('Battle Not found ! Please enter a valid battle id!');
        }
        this.setState({
          battleList: [...battleList],
          loading: false
        });
      } else {
        message.error('Battle Not found ! Please enter a valid battle id!');
        this.setState({ battleList: [], loading: false, isSubmitted: true });
      }
    });
  };
  getBattleGameData(record) {
    let data = {
      battleId: record.battleId
    };
    this.props.actions.getBattleGameData(data).then(() => {
      if (
        this.props.getBattleGameDataResponse &&
        this.props.getBattleGameDataResponse.userBattleGameData
      ) {
        let gameDataList = [];
        let gameDataListKeys = Object.keys(
          this.props.getBattleGameDataResponse.userBattleGameData
        );
        let gameDataListValues = Object.values(
          this.props.getBattleGameDataResponse.userBattleGameData
        );
        gameDataListKeys.forEach((element, index) => {
          let cursor = {};
          cursor['userId'] = element;
          cursor['battleData'] = gameDataListValues[index]
            ? JSON.parse(gameDataListValues[index])
            : {};
          gameDataList.push(cursor);
        });
        this.setState({
          gameDataList: [...gameDataList],
          showGameDataModal: true,
          category: 'GAME_DATA'
        });
      } else {
        message.info('Battle game data could not be fetched');
      }
    });
  }
  getGameDataColumns = () => {
    const { category } = this.state;
    const gameDataColumns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => {
          if (category === 'GAME_DATA') {
            return (
              <span>
                <Button onClick={() => this.showGameDataDetials(record)}>
                  Show Details
                </Button>
              </span>
            );
          }
        }
      }
    ];
    return gameDataColumns;
  };
  showGameDataDetials(record) {
    this.setState({
      gameDataModal: { ...record },
      isModalDetails: true
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      userDetailsFetched: false,
      basicProfile: null,
      userDashboardDetails: null
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // if (
        //   values.searchCriteria === 'MOBILE_NUMBER' &&
        //   values.searchFor &&
        //   values.searchFor.toString().length > 15
        // ) {
        //   message.warning('Mobile number should not be of greater than 10 digits');
        //   return;
        // }
        switch (values.searchCriteria) {
          case 'BATTLE_ID':
            this.setState({ loading: true });
            const data = {
              start: 0,
              count: 30,
              gameId: 0,
              battleId: values.searchFor.trim(),
              startTimeStamp: 0,
              endTimeStamp: 0
            };
            this.getBattleByBattleId(data);
            break;
          case 'TRANSACTION_ID':
            this.setState({
              loading: true,
              transactionId: values.searchFor,
              mobileNumber: '',
              userId: ''
            });
            let referenceData = {
              referenceId: values.searchFor,
              countryCode: this.state.countryCode
            };
            this.props.actions
              .getUserIdFromReferenceId(referenceData)
              .then(() => {
                if (this.props.getUserIdFromReferenceIdResponse) {
                  if (this.props.getUserIdFromReferenceIdResponse.error) {
                    message.error('Could not find user id');
                    this.setState({ loading: false });
                  } else {
                    let userId = this.props.getUserIdFromReferenceIdResponse
                      .userId
                      ? this.props.getUserIdFromReferenceIdResponse.userId.low
                      : 0;
                    let profileRequestData = {
                      userId: userId
                    };
                    this.props.actions
                      .getProfileById(profileRequestData)
                      .then(() => {
                        if (
                          this.props.getProfileByIdResponse &&
                          this.props.getProfileByIdResponse.profile
                        ) {
                          let basicProfile = {
                            ...this.props.getProfileByIdResponse.profile
                          };
                          this.setState({ basicProfile: { ...basicProfile } });
                          let balanceRequestData = {
                            userId: basicProfile.id,
                            countryCode: basicProfile.countryCode
                          };
                          this.props.actions
                            .getDashboardUserBalance(balanceRequestData)
                            .then(() => {
                              if (
                                this.props.getUserDashboardBalanceResponse &&
                                this.props.getUserDashboardBalanceResponse.error
                              ) {
                                this.setState({ loading: false });
                                message.error(
                                  this.props.getUserDashboardBalanceResponse
                                    .error.message
                                );
                              } else {
                                let userDashboardDetails = {
                                  ...this.props.getUserDashboardBalanceResponse
                                };
                                this.setState({
                                  userDashboardDetails: {
                                    ...userDashboardDetails
                                  },
                                  loading: false
                                });
                                this.getCredibility(basicProfile.id);
                              }
                            });
                        } else {
                          this.setState({ loading: false }, () => {
                            message.error(
                              'Could not fetch the basic profile details'
                            );
                          });
                        }
                      });
                  }
                }
              });
            break;
          case 'MOBILE_NUMBER':
            this.setState({
              loading: true,
              mobileNumber: values.searchFor,
              transactionId: '',
              userId: ''
            });
            let inputData = {
              mobileNumber: values.searchFor
            };
            this.props.actions.getProfileByMobile(inputData).then(() => {
              if (
                this.props.getProfileByMobileResponse &&
                this.props.getProfileByMobileResponse.profile
              ) {
                let basicProfile = {
                  ...this.props.getProfileByMobileResponse.profile
                };
                this.setState({
                  basicProfile: {
                    ...basicProfile
                  }
                });
                let balanceRequestData = {
                  userId: basicProfile.id,
                  countryCode: basicProfile.countryCode
                };
                this.props.actions
                  .getDashboardUserBalance(balanceRequestData)
                  .then(() => {
                    if (
                      this.props.getUserDashboardBalanceResponse &&
                      this.props.getUserDashboardBalanceResponse.error
                    ) {
                      this.setState({ loading: false });
                      message.error(
                        this.props.getUserDashboardBalanceResponse.error.message
                      );
                    } else {
                      let userDashboardDetails = {
                        ...this.props.getUserDashboardBalanceResponse
                      };
                      this.setState({
                        userDashboardDetails: { ...userDashboardDetails },
                        loading: false
                      });
                      this.getCredibility(basicProfile.id);
                    }
                    this.props.actions
                      .getReferredUserDetails({
                        referrerId: basicProfile.id
                      })
                      .then(() => {
                        if (
                          this.props.referredUserDetails &&
                          this.props.referredUserDetails.referredUser
                        ) {
                          this.setState({
                            referredId: this.props.referredUserDetails
                              .referredUser.userId,
                            loggedInTime: this.props.referredUserDetails
                              .referredUser.loggedInTime
                          });
                        } else {
                          this.setState({
                            referredId: '',
                            loggedInTime: ''
                          });
                        }
                      });
                    const data = {
                      userId: basicProfile.id,
                      transactionType: 'CREDIT',
                      startDateTimestamp: moment()
                        .subtract(7, 'days')
                        .format('x'),
                      endDateTimestamp: moment().format('x'),
                      referenceType: [...referenceTypes]
                    };
                    this.props.actions.getUserWinnings(data).then(() => {
                      if (this.props.getUserWinningsResponse.error) {
                        message.error('Cannot fetch User winnings');
                      } else {
                        this.setState({
                          userWinnings: {
                            ...this.props.getUserWinningsResponse
                          }
                        });
                      }
                    });
                    this.props.actions
                      .getAppInfo(balanceRequestData)
                      .then(() => {
                        if (this.props.appInfo.error) {
                          message.error('Cannot fetch App Info!');
                        } else {
                          this.setState({
                            appInfo: {
                              ...this.props.appInfo.appInfo
                            }
                          });
                        }
                      });
                    this.props.actions
                      .getFollowDetails(balanceRequestData)
                      .then(() => {
                        if (this.props.followDetails.error) {
                          message.error('Cannot fetch User follow details');
                        } else {
                          this.setState({
                            followDetails: {
                              ...this.props.followDetails
                            }
                          });
                        }
                      });
                    this.props.actions
                      .getDeviceInfo(balanceRequestData)
                      .then(() => {
                        if (this.props.deviceInfo.error) {
                          message.error('Cannot fetch User Device info!');
                        } else {
                          let info =
                            Object.keys(this.props.deviceInfo).length > 0 &&
                            this.props.deviceInfo.devices.length > 0
                              ? JSON.parse(
                                  this.props.deviceInfo.devices[0].deviceInfo
                                )
                              : {};

                          this.setState({
                            deviceInfo: info
                          });
                        }
                      });
                    this.props.actions
                      .getUserInfo({ userId: basicProfile.id })
                      .then(() => {
                        if (this.props.userInfoResponse.error) {
                          this.setState({
                            loading: false
                          });
                        } else {
                          this.setState({
                            createdOn: this.props.userInfoResponse
                              .createdOnString,
                            loading: false
                          });
                        }
                      });
                    this.props.actions
                      .getCumulativeWinnings({
                        userId: basicProfile.id,
                        countryCode: basicProfile.countryCode
                      })
                      .then(() => {
                        if (this.props.cumulativeWinnings.error) {
                          this.setState({
                            loading: false
                          });
                        } else {
                          this.setState({
                            cumulativeWinnings: this.props.cumulativeWinnings
                              .cumulativeWinnings,
                            loading: false
                          });
                        }
                      });
                    this.props.actions.checkUserPrimeStatus({
                      userId: basicProfile.id,
                      countryCode: basicProfile.countryCode
                    });
                    this.props.actions
                      .checkUserPrimeStatus({
                        userId: basicProfile.id,
                        countryCode: basicProfile.countryCode
                      })
                      .then(() => {
                        if (this.props.userPrimeRes.error) {
                          this.setState({
                            loading: false
                          });
                        } else {
                          this.setState({
                            primeStatus: this.props.userPrimeRes.primeStatus
                              ? this.props.userPrimeRes.primeStatus
                              : '',
                            autoRenew: this.props.userPrimeRes.autoRenew
                              ? this.props.userPrimeRes.autoRenew
                              : false,
                            subscriptionExpiryDate: this.props.userPrimeRes
                              .subscriptionExpiryDate
                              ? this.props.userPrimeRes.subscriptionExpiryDate
                              : '',
                            loading: false
                          });
                        }
                      });
                  });
              } else {
                this.setState({ loading: false }, () => {
                  message.error('Could not fetch the basic profile details');
                });
              }
            });
            break;
          case 'USER_ID':
            this.setState({
              loading: true,
              userId: values.searchFor,
              mobileNumber: '',
              transactionId: ''
            });
            let userIdData = {
              userId: values.searchFor
            };
            this.props.actions.getProfileById(userIdData).then(() => {
              if (
                this.props.getProfileByIdResponse &&
                this.props.getProfileByIdResponse.profile
              ) {
                let basicProfile = {
                  ...this.props.getProfileByIdResponse.profile
                };
                this.setState({
                  basicProfile: {
                    ...basicProfile
                  }
                });
                let balanceRequestData = {
                  userId: basicProfile.id,
                  countryCode: basicProfile.countryCode
                };
                this.props.actions
                  .getDashboardUserBalance(balanceRequestData)
                  .then(() => {
                    if (
                      this.props.getUserDashboardBalanceResponse &&
                      this.props.getUserDashboardBalanceResponse.error
                    ) {
                      this.setState({ loading: false });
                      message.error(
                        this.props.getUserDashboardBalanceResponse.error.message
                      );
                    } else {
                      let userDashboardDetails = {
                        ...this.props.getUserDashboardBalanceResponse
                      };
                      this.setState({
                        userDashboardDetails: { ...userDashboardDetails },
                        loading: false
                      });
                      this.getCredibility(basicProfile.id);
                    }
                    this.props.actions
                      .getReferredUserDetails({
                        referrerId: basicProfile.id
                      })
                      .then(() => {
                        if (
                          this.props.referredUserDetails &&
                          this.props.referredUserDetails.referredUser
                        ) {
                          this.setState({
                            referredId: this.props.referredUserDetails
                              .referredUser.userId,
                            loggedInTime: this.props.referredUserDetails
                              .referredUser.loggedInTime
                          });
                        } else {
                          this.setState({
                            referredId: '',
                            loggedInTime: ''
                          });
                        }
                      });
                    const data = {
                      userId: basicProfile.id,
                      transactionType: 'CREDIT',
                      startDateTimestamp: moment()
                        .subtract(7, 'days')
                        .format('x'),
                      endDateTimestamp: moment().format('x'),
                      referenceType: [...referenceTypes]
                    };
                    this.props.actions.getUserWinnings(data).then(() => {
                      if (
                        this.props.getUserWinningsResponse &&
                        this.props.getUserWinningsResponse.error
                      ) {
                        message.error('Cannot fetch User winnings');
                      } else {
                        this.setState({
                          userWinnings: {
                            ...this.props.getUserWinningsResponse
                          }
                        });
                      }
                    });
                    this.props.actions
                      .getAppInfo(balanceRequestData)
                      .then(() => {
                        if (this.props.appInfo.error) {
                          message.error('Cannot fetch User App Info!');
                        } else {
                          this.setState({
                            appInfo: {
                              ...this.props.appInfo.appInfo
                            }
                          });
                        }
                      });
                    this.props.actions
                      .getFollowDetails(balanceRequestData)
                      .then(() => {
                        if (this.props.followDetails.error) {
                          message.error('Cannot fetch User follow details');
                        } else {
                          this.setState({
                            followDetails: {
                              ...this.props.followDetails
                            }
                          });
                        }
                      });
                    this.props.actions
                      .getDeviceInfo(balanceRequestData)
                      .then(() => {
                        if (this.props.deviceInfo.error) {
                          message.error('Cannot fetch User Device info!');
                        } else {
                          const deviceInfo =
                            Object.keys(this.props.deviceInfo).length > 0 &&
                            this.props.deviceInfo.devices.length > 0
                              ? JSON.parse(
                                  this.props.deviceInfo.devices[0].deviceInfo
                                )
                              : {};

                          this.setState({
                            deviceInfo: {
                              ...deviceInfo
                            }
                          });
                        }
                      });
                    this.props.actions
                      .getUserInfo({ userId: values.searchFor })
                      .then(() => {
                        if (this.props.userInfoResponse.error) {
                          this.setState({
                            loading: false
                          });
                        } else {
                          this.setState({
                            createdOn: this.props.userInfoResponse
                              .createdOnString,
                            loading: false
                          });
                        }
                      });
                    this.props.actions
                      .getCumulativeWinnings({
                        userId: basicProfile.id,
                        countryCode: basicProfile.countryCode
                      })
                      .then(() => {
                        if (this.props.cumulativeWinnings.error) {
                          this.setState({
                            loading: false
                          });
                        } else {
                          this.setState({
                            cumulativeWinnings: this.props.cumulativeWinnings
                              .cumulativeWinnings,
                            loading: false
                          });
                        }
                      });
                    this.props.actions
                      .checkUserPrimeStatus({
                        userId: basicProfile.id,
                        countryCode: basicProfile.countryCode
                      })
                      .then(() => {
                        if (this.props.userPrimeRes.error) {
                          this.setState({
                            loading: false
                          });
                        } else {
                          this.setState({
                            primeStatus: this.props.userPrimeRes.primeStatus
                              ? this.props.userPrimeRes.primeStatus
                              : '',
                            autoRenew: this.props.userPrimeRes.autoRenew
                              ? this.props.userPrimeRes.autoRenew
                              : '',
                            subscriptionExpiryDate: this.props.userPrimeRes
                              .subscriptionExpiryDate
                              ? this.props.userPrimeRes.subscriptionExpiryDate
                              : '',
                            loading: false
                          });
                        }
                      });
                  });
              } else {
                this.setState({ loading: false }, () => {
                  message.error('Could not fetch the basic profile details');
                });
              }
            });
            break;
          case 'HASHED_UID':
            this.setState({
              loading: true,
              userId: values.searchFor,
              suid: '',
              transactionId: ''
            });
            let suidData = {
              suid: values.searchFor
            };
            this.props.actions.getUserIdSuid(suidData).then(() => {
              if (this.props.userIdSuid) {
                let userId = this.props.userIdSuid.userId;

                this.props.actions
                  .getProfileById({ userId: userId })
                  .then(() => {
                    if (
                      this.props.getProfileByIdResponse &&
                      this.props.getProfileByIdResponse.profile
                    ) {
                      let basicProfile = {
                        ...this.props.getProfileByIdResponse.profile
                      };
                      this.setState({
                        basicProfile: {
                          ...basicProfile
                        }
                      });
                      let balanceRequestData = {
                        userId: basicProfile.id,
                        countryCode: basicProfile.countryCode
                      };
                      this.props.actions
                        .getDashboardUserBalance(balanceRequestData)
                        .then(() => {
                          if (
                            this.props.getUserDashboardBalanceResponse &&
                            this.props.getUserDashboardBalanceResponse.error
                          ) {
                            this.setState({ loading: false });
                            message.error(
                              this.props.getUserDashboardBalanceResponse.error
                                .message
                            );
                          } else {
                            let userDashboardDetails = {
                              ...this.props.getUserDashboardBalanceResponse
                            };
                            this.setState({
                              userDashboardDetails: { ...userDashboardDetails },
                              loading: false
                            });
                            this.getCredibility(basicProfile.id);
                          }
                          this.props.actions
                            .getReferredUserDetails({
                              referrerId: basicProfile.id
                            })
                            .then(() => {
                              if (this.props.referredUserDetails.referredUser) {
                                this.setState({
                                  referredId: this.props.referredUserDetails
                                    .referredUser.userId,
                                  loggedInTime: this.props.referredUserDetails
                                    .referredUser.loggedInTime
                                });
                              } else {
                                this.setState({
                                  referredId: '',
                                  loggedInTime: ''
                                });
                              }
                            });
                          const data = {
                            userId: basicProfile.id,
                            transactionType: 'CREDIT',
                            startDateTimestamp: moment()
                              .subtract(7, 'days')
                              .format('x'),
                            endDateTimestamp: moment().format('x'),
                            referenceType: [...referenceTypes]
                          };
                          this.props.actions.getUserWinnings(data).then(() => {
                            if (
                              this.props.getUserWinningsResponse &&
                              this.props.getUserWinningsResponse.error
                            ) {
                              message.error('Cannot fetch User winnings');
                            } else {
                              this.setState({
                                userWinnings: {
                                  ...this.props.getUserWinningsResponse
                                }
                              });
                            }
                          });
                          this.props.actions
                            .getAppInfo(balanceRequestData)
                            .then(() => {
                              if (this.props.appInfo.error) {
                                message.error('Cannot fetch User App Info!');
                              } else {
                                this.setState({
                                  appInfo: {
                                    ...this.props.appInfo.appInfo
                                  }
                                });
                              }
                            });
                          this.props.actions
                            .getFollowDetails(balanceRequestData)
                            .then(() => {
                              if (this.props.followDetails.error) {
                                message.error(
                                  'Cannot fetch User follow details'
                                );
                              } else {
                                this.setState({
                                  followDetails: {
                                    ...this.props.followDetails
                                  }
                                });
                              }
                            });
                          this.props.actions
                            .getDeviceInfo(balanceRequestData)
                            .then(() => {
                              if (this.props.deviceInfo.error) {
                                message.error('Cannot fetch User Device info!');
                              } else {
                                const deviceInfo =
                                  Object.keys(this.props.deviceInfo).length >
                                    0 &&
                                  this.props.deviceInfo.devices.length > 0
                                    ? JSON.parse(
                                        this.props.deviceInfo.devices[0]
                                          .deviceInfo
                                      )
                                    : {};

                                this.setState({
                                  deviceInfo: {
                                    ...deviceInfo
                                  }
                                });
                              }
                            });
                          this.props.actions
                            .getUserInfo({ userId: basicProfile.id })
                            .then(() => {
                              if (this.props.userInfoResponse.error) {
                                this.setState({
                                  loading: false
                                });
                              } else {
                                this.setState({
                                  createdOn: this.props.userInfoResponse
                                    .createdOnString,
                                  loading: false
                                });
                              }
                            });
                          this.props.actions
                            .getCumulativeWinnings({
                              userId: basicProfile.id,
                              countryCode: basicProfile.countryCode
                            })
                            .then(() => {
                              if (this.props.cumulativeWinnings.error) {
                                this.setState({
                                  loading: false
                                });
                              } else {
                                this.setState({
                                  cumulativeWinnings: this.props
                                    .cumulativeWinnings.cumulativeWinnings,
                                  loading: false
                                });
                              }
                            });
                        });
                    } else {
                      this.setState({ loading: false }, () => {
                        message.error(
                          'Could not fetch the basic profile details'
                        );
                      });
                    }
                  });
              } else {
                this.setState({ loading: false }, () => {
                  message.error('Could not fetch the basic profile details');
                });
              }
            });
            break;
          default:
            break;
        }
      }
    });
  };
  checkCredibilityStatus = () => {
    const { credibilityRating, userWinnings } = this.state;

    const depositCash = get(userWinnings, 'depositCash', 0);
    const bonusCash = get(userWinnings, 'bonusCash', 0);
    const winningCash = get(userWinnings, 'winningCash', 0);

    const totalCash = depositCash + bonusCash + winningCash;

    let status = '';
    if (totalCash >= 1000 && credibilityRating === 'HIGH') {
      status = false;
    } else if (totalCash >= 500 && credibilityRating === 'MEDIUM') {
      status = false;
    } else if (totalCash >= 200 && credibilityRating === 'LOW') {
      status = false;
    } else {
      status = true;
    }
    return status;
  };
  getCredibility(userId) {
    let data = {
      userId
    };
    this.props.actions.getUserCredibility(data).then(() => {
      if (
        this.props.getUserCredibilityResponse &&
        this.props.getUserCredibilityResponse.credibilityRating
      ) {
        this.setState({
          credibilityRating: this.props.getUserCredibilityResponse
            .credibilityRating
        });
      } else {
        message.error('Could not fetch credibility');
      }
    });
  }
  fetchTransactions = (userId, countryCode) => {
    const data = {
      phoneNumber: '',
      startTime: moment()
        .subtract(5, 'days')
        .format('x')
        .slice(0, 10),
      endTime: moment()
        .format('x')
        .slice(0, 10),
      pageNumber: 1,
      pageSize: 10,
      userId: userId,
      countryCode: countryCode
    };
    this.props.actions.getUserTransactionList(data).then(() => {
      if (
        this.props.transactionList.transactionHistory &&
        this.props.transactionList.transactionHistory.length > 0
      ) {
        this.setState({
          transactionData: this.props.transactionList.transactionHistory,
          transactionCount: 10,
          loading: false,
          dialog: true,
          userId: userId
        });
      } else {
        this.setState({
          transactionData: [],
          transactionCount: 1,
          loading: false,
          dialog: true,
          userId: userId
        });
      }
    });
  };
  closeModal = () => {
    this.setState({
      dialog: false,
      category: '',
      disconnectionDetails: {},
      fraudDetails: {},
      battleDetails: [],
      transactionData: [],
      currentTab: '1'
    });
  };

  closeGameModal = () => {
    this.setState({
      gameDataList: [],
      showGameDataModal: false,
      isModalDetails: false,
      gameDataModal: {}
    });
  };

  getRecentInfo = e => {
    e.preventDefault();
    this.setState({
      userDetailsFetched: false,
      basicProfile: null,
      userDashboardDetails: null
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let userId = '';
        let countryCode = 'IN';

        this.setState({
          loading: true
        });

        switch (values.searchCriteria) {
          case 'MOBILE_NUMBER':
            let inputData = {
              mobileNumber: values.searchFor
            };
            this.props.actions.getProfileByMobile(inputData).then(() => {
              if (
                this.props.getProfileByMobileResponse &&
                this.props.getProfileByMobileResponse.profile
              ) {
                let basicProfile = {
                  ...this.props.getProfileByMobileResponse.profile
                };
                userId = basicProfile.id;
                countryCode = basicProfile.countryCode;

                this.fetchTransactions(userId, countryCode);
              } else {
                this.setState({ loading: false }, () => {
                  message.error('Unable to find user!');
                });
              }
            });
            break;
          case 'HASHED_UID':
            let suidData = {
              suid: values.searchFor
            };
            this.props.actions.getUserIdSuid(suidData).then(() => {
              if (this.props.userIdSuid) {
                userId = this.props.userIdSuid.userId;
                countryCode = 'US';

                this.fetchTransactions(userId, countryCode);
              } else {
                this.setState({ loading: false }, () => {
                  message.error('Unable to find user!');
                });
              }
            });
            break;
          case 'USER_ID':
            let userIdData = {
              userId: values.searchFor
            };
            this.props.actions.getProfileById(userIdData).then(() => {
              if (
                this.props.getProfileByIdResponse &&
                this.props.getProfileByIdResponse.profile
              ) {
                let basicProfile = {
                  ...this.props.getProfileByIdResponse.profile
                };
                userId = basicProfile.id;
                countryCode = basicProfile.countryCode;

                this.fetchTransactions(userId, countryCode);
              } else {
                this.setState({ loading: false }, () => {
                  message.error('Unable to find user!');
                });
              }
            });
          default:
            break;
        }
      }
    });
  };
  getUserGameDetails = () => {
    const data = {
      userId: this.state.userId,
      start: 1,
      // count: 10,
      gameId: '',
      startTimeStamp: moment()
        .subtract(5, 'days')
        .format('x'),
      endTimeStamp: moment().format('x')
    };
    this.props.actions.getPlayerLobbyHistory(data).then(() => {
      let battleList = [];
      if (this.props.getPlayerLobbyHistoryResponse) {
        if (
          this.props.getPlayerLobbyHistoryResponse.finishedBattles &&
          this.props.getPlayerLobbyHistoryResponse.finishedBattles.length > 0
        ) {
          battleList = [
            ...this.props.getPlayerLobbyHistoryResponse.finishedBattles
          ];
          if (
            this.props.getPlayerLobbyHistoryResponse.pendingBattles &&
            this.props.getPlayerLobbyHistoryResponse.pendingBattles.length > 0
          ) {
            battleList = [
              ...this.props.getPlayerLobbyHistoryResponse.pendingBattles,
              ...battleList
            ];
          }
        }
        this.setState({ battleDetails: battleList });
      }
    });
  };
  onTabChangeHandler = key => {
    this.setState(
      {
        currentTab: key
      },
      () => {
        if (key == '2') {
          this.setState(
            {
              category: '',
              disconnectionDetails: {},
              fraudDetails: {},
              gameDataList: []
            },
            () => {
              this.getUserGameDetails();
            }
          );
        }
      }
    );
  };
  checkFraud = record => {
    const { userId } = this.state;
    const data = {
      callerUserId: userId,
      gameId: record.gameId,
      gameSessionId: record.battleId
    };
    this.props.actions.checkGameFraud(data).then(() => {
      if (this.props.gameFraud.fraudServiceError) {
        message.error(this.props.gameFraud.fraudServiceError.message);
      } else {
        const response = this.props.gameFraud;
        const fraudConfirmed = get(response, 'fraudConfirmed', false);
        let status = '';
        if (fraudConfirmed == 1) {
          status = 'No';
        } else if (fraudConfirmed == 2) {
          status = 'May-Be';
        } else {
          status = 'Yes';
        }
        const fraudDetails = {
          requestStatus:
            response.requestStatus && response.requestStatus === 1
              ? 'Failure'
              : 'Success',
          fraudConfirmed: status,
          isCallerVictim: response.isCallerVictim
            ? response.isCallerVictim
            : 'false',
          fraudReason: response.fraudReason,
          actionTaken: response.actionTaken,
          refundStatus: response.refundStatus
        };
        this.setState({
          category: 'fraud',
          fraudDetails: { ...fraudDetails }
        });
      }
    });
  };
  checkDisconnection = record => {
    const { userId } = this.state;
    const data = {
      userId: userId,
      gameId: record.gameId,
      battleId: record.battleId
    };
    this.props.actions.getDisconnectionData(data).then(() => {
      this.setState({
        disconnectionDetails: { ...this.props.getDisconnectionDataResponse },
        category: 'disconnection'
      });
    });
  };
  getTransactionDetailsColumns() {
    const columns = [
      {
        title: 'Transaction Id',
        key: 'transactionId',
        dataIndex: 'transactionId'
      },
      {
        title: 'Transaction type',
        key: 'transactionType',
        dataIndex: 'transactionType'
      },
      {
        title: 'Reference Id',
        key: 'referenceId',
        dataIndex: 'referenceId'
      },
      {
        title: 'Reference type',
        key: 'referenceType',
        dataIndex: 'referenceType'
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        render: (text, record) => <div>{record.amount}</div>
      },
      {
        title: 'Money Type',
        key: 'moneyType',
        dataIndex: 'moneyType'
      },
      {
        title: 'Transaction Date',
        key: 'date',
        dataIndex: 'date',
        render: (text, record) => (
          // this.state.moneyType === 'all' ? (
          <div>{moment(record.date, 'x').format('DD MMM YYYY hh:mm:ss A')}</div>
        )
        // ) : (
        //   <div>{moment(record.date).format('DD MMM YYYY hh:mm:ss A')}</div>
        // )
      },
      {
        title: 'Description',
        key: 'description',
        dataIndex: 'description'
      }
    ];
    return columns;
  }
  getGameColumns = () => {
    const columns = [
      {
        title: 'Game Name',
        key: 'gameName',
        dataIndex: 'gameName'
      },
      {
        title: 'Lobby Id',
        key: 'lobbyId',
        dataIndex: 'lobbyId'
      },
      {
        title: 'Battle Id',
        key: 'battleId',
        dataIndex: 'battleId'
      },
      {
        title: 'Battle Start Time',
        key: 'battleStartTime',
        dataIndex: 'battleStartTime',
        render: (text, record) => (
          <div>
            {moment(record.battleStartTime).format('DD-MM-YYYY hh:mm:ss A')}
          </div>
        )
      },
      {
        title: 'Opponent User Id',
        key: 'battlePlayers',
        dataIndex: 'battlePlayers',
        render: (text, record) => (
          <div>
            {record.battlePlayers && record.battlePlayers.length > 0
              ? record.battlePlayers[0].userId
              : ''}
          </div>
        )
      },
      {
        title: 'Fraud ',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => {
                this.checkFraud(record);
              }}
            >
              Check Fraud
            </Button>
          </span>
        )
      },
      {
        title: 'Disconnection',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => {
                this.checkDisconnection(record);
              }}
            >
              Check Disconnection
            </Button>
          </span>
        )
      },
      {
        title: 'Battle Game Data',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => {
                this.getBattleGameData(record);
              }}
            >
              Check Battle Game Data
            </Button>
          </span>
        )
      }
    ];
    return columns;
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const credibilityStatus = this.checkCredibilityStatus();
    const transactionColumns = this.getTransactionDetailsColumns();
    const gameColumns = this.getGameColumns();
    const gameDataColumns = this.getGameDataColumns();


    const {
      mobileNumber,
      searchCriteria,
      transactionId,
      cumulativeWinnings,
      deviceInfo,
      followDetails,
      appInfo,
      battleList,
      disabledAgents,
      refundRole,
      countryCode,
      primeStatus,
      autoRenew,
      subscriptionExpiryDate,
      category,
      fraudDetails,
      disconnectionDetails,
      battleDetails,
      gameDataList,
      isModalDetails,
      gameDataModal
    } = this.state;

    const errors = {
      searchFor: isFieldTouched('searchFor') && getFieldError('searchFor'),
      countryCode: isFieldTouched('countryCode') && getFieldError('countryCode')
    };
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Form onSubmit={this.handleSubmit}>
            <Card bordered={false} title="Customer Support">
              <FormItem {...formItemLayout} label={'Search Criteria'}>
                {getFieldDecorator('searchCriteria', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select an option',
                      whitespace: false
                    }
                  ],
                  initialValue: this.state.searchCriteria
                })(
                  <Radio.Group
                    onChange={e => this.updateSearchCriteria(e)}
                    size="small"
                    buttonStyle="solid"
                  >
                    <Radio.Button value={'MOBILE_NUMBER'}>
                      Mobile Number
                    </Radio.Button>
                    <Radio.Button value={'USER_ID'}>User ID</Radio.Button>
                    <Radio.Button value={'HASHED_UID'}>Hashed UID</Radio.Button>
                    <Radio.Button value={'TRANSACTION_ID'}>
                      Transaction ID
                    </Radio.Button>
                    <Radio.Button value={'BATTLE_ID'}>Battle ID</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
              {this.state.searchCriteria === 'HASHED_UID' ? (
                <FormItem
                  validateStatus={errors.searchFor ? 'error' : ''}
                  {...formItemLayout}
                  label={<span>Search For</span>}
                >
                  {getFieldDecorator('searchFor', {
                    rules: [
                      {
                        required: true,
                        message: ' ',
                        whitespace: false
                      }
                    ]
                  })(<Input style={{ width: '400px' }} />)}
                </FormItem>
              ) : this.state.searchCriteria === 'TRANSACTION_ID' ? (
                <>
                  <FormItem
                    validateStatus={errors.searchFor ? 'error' : ''}
                    {...formItemLayout}
                    label={<span>Search For</span>}
                  >
                    {getFieldDecorator('searchFor', {
                      rules: [
                        {
                          required: true,
                          message: ' ',
                          whitespace: false
                        }
                      ]
                    })(<Input style={{ width: '400px' }} />)}
                  </FormItem>
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
                        style={{ width: '400px' }}
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
                </>
              ) : this.state.searchCriteria === 'BATTLE_ID' ? (
                <React.Fragment>
                  <FormItem
                    validateStatus={errors.searchFor ? 'error' : ''}
                    {...formItemLayout}
                    label={<span>Search For</span>}
                  >
                    {getFieldDecorator('searchFor', {
                      rules: [
                        {
                          required: true,
                          message: ' ',
                          whitespace: false
                        }
                      ]
                    })(<Input style={{ width: '400px' }} />)}
                  </FormItem>
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
                        style={{ width: '400px' }}
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
                </React.Fragment>
              ) : (
                <FormItem
                  validateStatus={errors.searchFor ? 'error' : ''}
                  {...formItemLayout}
                  label={<span>Search For</span>}
                >
                  {getFieldDecorator('searchFor', {
                    rules: [
                      {
                        required: true,
                        message: ' ',
                        whitespace: false,
                        type: 'integer'
                      }
                    ]
                  })(<InputNumber style={{ width: '400px' }} />)}
                </FormItem>
              )}
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Search
              </Button>
              {(searchCriteria === 'USER_ID' ||
                searchCriteria === 'MOBILE_NUMBER' ||
                searchCriteria === 'HASHED_UID') && (
                <Button
                  htmlType="submit"
                  onClick={this.getRecentInfo}
                  disabled={hasErrors(getFieldsError())}
                >
                  Get Recent Info
                </Button>
              )}
            </Card>
          </Form>

          {this.state.searchCriteria === 'BATTLE_ID' && battleList.length > 0
            ? battleList.map(item => (
                <SearchBattle
                  item={item}
                  countryCode={this.state.countryCode}
                  disabledAgents={disabledAgents}
                  refundRole={refundRole}
                />
              ))
            : this.state.basicProfile &&
              this.state.userDashboardDetails && (
                <Card style={{ margin: '20px' }}>
                  <Row>
                    <Col span={12}>
                      <Row>
                        <Col span={24}>
                          Name:{' '}
                          <strong>
                            {this.state.basicProfile.displayName
                              ? this.state.basicProfile.displayName
                              : 'N/A'}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Mobile Number:{' '}
                          <strong>
                            {this.state.basicProfile.mobileNumber
                              ? this.state.basicProfile.mobileNumber
                              : 'N/A'}
                          </strong>
                        </Col>
                        <Col span={24}>
                          User ID:{' '}
                          <strong>
                            {this.state.basicProfile.id
                              ? this.state.basicProfile.id
                              : 'N/A'}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Tier:{' '}
                          <strong>
                            {this.state.basicProfile.tier
                              ? this.state.basicProfile.tier
                              : 'N/A'}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Payer / Non Payer:{' '}
                          {this.state.userDashboardDetails.isPayer ? (
                            <Tag color="#87d068"> PAYER </Tag>
                          ) : (
                            <Tag color="#f50"> Non Payer </Tag>
                          )}
                        </Col>
                        <Col span={24}>
                          Deposit Balance:{' '}
                          <strong>
                            {this.state.userDashboardDetails.depositBalance
                              ? this.state.userDashboardDetails.depositBalance
                              : 0}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Winning Balance:{' '}
                          <strong>
                            {this.state.userDashboardDetails.winningBalance
                              ? Number(
                                  this.state.userDashboardDetails.winningBalance
                                ).toFixed(2)
                              : 0}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Bonus Cash Balance:{' '}
                          <strong>
                            {this.state.userDashboardDetails.bonusBalance
                              ? Number(
                                  this.state.userDashboardDetails.bonusBalance
                                ).toFixed(2)
                              : 0}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Token Balance:{' '}
                          <strong>
                            {this.state.userDashboardDetails.tokenBalance
                              ? Number(
                                  this.state.userDashboardDetails.tokenBalance
                                ).toFixed(2)
                              : 0}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Total Balance:{' '}
                          <strong>
                            {this.state.userDashboardDetails.totalBalance
                              ? Number(
                                  this.state.userDashboardDetails.totalBalance
                                ).toFixed(2)
                              : 0}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Transit Balance:{' '}
                          <strong>
                            {this.state.userDashboardDetails.transitBalance
                              ? Number(
                                  this.state.userDashboardDetails.transitBalance
                                ).toFixed(2)
                              : 0}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Referred By:{' '}
                          <strong>
                            {this.state.referredId
                              ? this.state.referredId
                              : 'NA'}
                          </strong>
                        </Col>
                        <Col span={24}>
                          First Login Time:{' '}
                          <strong>
                            {this.state.createdOn
                              ? moment(this.state.createdOn, 'x').format(
                                  'DD-MM-YYYY hh:mm:ss A'
                                )
                              : 'NA'}
                          </strong>
                        </Col>

                        <Col span={24}>
                          Followers Count :
                          <strong>
                            {followDetails.followers
                              ? followDetails.followers
                              : 0}
                          </strong>
                        </Col>
                        <Col span={24}>
                          Cumulative Winnings :
                          <strong>
                            {Number(cumulativeWinnings).toFixed(2)}
                          </strong>
                        </Col>
                        <Col span={24}>
                          VIP User:{' '}
                          <strong>
                            {primeStatus == 'ACTIVE' ? (
                              <Tag color="#87d068"> Active </Tag>
                            ) : primeStatus == 'NON_PRIME' ? (
                              <Tag color="#096dd9">Non Prime</Tag>
                            ) : (
                              <Tag color="#f50">Inactive</Tag>
                            )}
                          </strong>
                        </Col>
                        {primeStatus == 'ACTIVE' && (
                          <Col span={24}>
                            Auto Renew:
                            <strong>
                              {autoRenew ? (
                                <Tag color="#87d068"> true </Tag>
                              ) : (
                                <Tag color="#f50">false</Tag>
                              )}
                            </strong>
                          </Col>
                        )}
                        {primeStatus == 'ACTIVE' && (
                          <Col span={24}>
                            Subscription Expiry Date:
                            <strong>
                              {subscriptionExpiryDate
                                ? moment(subscriptionExpiryDate, 'x').format(
                                    'DD-MM-YYYY hh:mm:ss A'
                                  )
                                : 'NA'}
                            </strong>
                          </Col>
                        )}
                      </Row>
                    </Col>
                    <Col span={12}>
                      {this.state.credibilityRating && (
                        <Row>
                          <Col span={24}>
                            Credibility Rating:{' '}
                            <strong>{this.state.credibilityRating}</strong>
                          </Col>
                        </Row>
                      )}
                      <Col span={24}>
                        AGE :<strong>{age} days</strong>
                      </Col>
                      <h4 style={{ marginTop: 10 }}>App Details</h4>
                      <Col span={24}>
                        App Version :
                        <strong>
                          {appInfo.reactVersion ? appInfo.reactVersion : 'NA'}
                        </strong>
                      </Col>
                      <Col span={24}>
                        OS Version :
                        <strong>
                          {appInfo.osVersion ? appInfo.osVersion : 'NA'}
                        </strong>
                      </Col>
                      <Col span={24}>
                        OS Type :
                        <strong>
                          {appInfo.osType ? appInfo.osType : 'NA'}{' '}
                        </strong>
                      </Col>
                      <h4>Device Details</h4>
                      <Col span={24}>
                        Device Name :
                        <strong>
                          {deviceInfo &&
                          Object.keys(deviceInfo).length > 0 &&
                          deviceInfo['manufacturer']
                            ? deviceInfo['manufacturer']
                            : 'NA'}
                        </strong>
                      </Col>
                      <Col span={24}>
                        Model :
                        <strong>
                          {deviceInfo &&
                          Object.keys(deviceInfo).length > 0 &&
                          deviceInfo['model']
                            ? deviceInfo['model']
                            : 'NA'}
                        </strong>
                      </Col>
                      <h3>Last 7 days Refund Details</h3>
                      <Col
                        span={24}
                        className={
                          !credibilityStatus ? 'credibility-highlight' : ''
                        }
                      >
                        Deposit Cash:{' '}
                        <strong>
                          {this.state.userWinnings &&
                          this.state.userWinnings.depositCash
                            ? Number(
                                this.state.userWinnings.depositCash
                              ).toFixed(2)
                            : 0}
                        </strong>
                      </Col>
                      <Col
                        span={24}
                        className={
                          !credibilityStatus ? 'credibility-highlight' : ''
                        }
                      >
                        Bonus Cash:{' '}
                        <strong>
                          {this.state.userWinnings &&
                          this.state.userWinnings.bonusCash
                            ? Number(this.state.userWinnings.bonusCash).toFixed(
                                2
                              )
                            : 0}
                        </strong>
                      </Col>
                      <Col
                        span={24}
                        className={
                          !credibilityStatus ? 'credibility-highlight' : ''
                        }
                      >
                        Winning Cash:{' '}
                        <strong>
                          {this.state.userWinnings &&
                          this.state.userWinnings.winningCash
                            ? Number(
                                this.state.userWinnings.winningCash
                              ).toFixed(2)
                            : 0}
                        </strong>
                      </Col>
                    </Col>
                  </Row>

                  <Card style={{ marginTop: '20px' }} type="inner">
                    <Tabs type="card">
                      <TabPane tab="GAMES" key="1">
                        <GameSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                          disabledAgents={disabledAgents}
                          refundRole={refundRole}
                          isPayer={this.state.userDashboardDetails.isPayer}
                          age={age}
                          refundEligibleConfig={this.state.refundEligibleConfig}
                          primeStatus={this.state.primeStatus}
                        />
                      </TabPane>
                      <TabPane tab="FANTASY" key="2">
                        <FantasySelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                          disabledAgents={disabledAgents}
                          refundRole={refundRole}
                        />
                      </TabPane>
                      <TabPane tab="PAYMENTS" key="3">
                        <PaymentSelection
                          mobileNumber={mobileNumber}
                          // mobileNumber={this.state.basicProfile.mobileNumber.substring(
                          //   3,
                          //   this.state.basicProfile.mobileNumber.length
                          // )}
                          searchCriteria={searchCriteria}
                          transactionId={transactionId}
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                        />
                      </TabPane>
                      {searchCriteria !== 'TRANSACTION_ID' && (
                        <TabPane tab="REFERRAL" key="4">
                          <ReferralSelection
                            userId={
                              this.state.basicProfile.id
                                ? this.state.basicProfile.id
                                : null
                            }
                            countryCode={this.state.basicProfile.countryCode}
                          />
                        </TabPane>
                      )}
                      <TabPane tab="KYC" key="5">
                        <KYCSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                        />
                      </TabPane>
                      <TabPane tab="RUMMY" key="6">
                        <RummySelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                          disabledAgents={disabledAgents}
                          refundRole={refundRole}
                        />
                      </TabPane>
                      <TabPane tab="CALLBREAK" key="7">
                        <CallbreakSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                          disabledAgents={disabledAgents}
                          refundRole={refundRole}
                        />
                      </TabPane>
                      <TabPane tab="COLLECTIBLES" key="8">
                        <CollectibleSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                        />
                      </TabPane>
                      <TabPane tab="FRAUD" key="9">
                        <FraudSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                        />
                      </TabPane>
                      {this.state.isRefund && (
                        <TabPane tab="REFUND" key="10">
                          <RefundSelection
                            userId={this.state.basicProfile.id}
                            countryCode={this.state.basicProfile.countryCode}
                          />
                        </TabPane>
                      )}
                      <TabPane tab="VIP" key="11">
                        <PrimeSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                        />
                      </TabPane>
                      <TabPane tab="SSN" key="12">
                        <SSNSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                        />
                      </TabPane>
                      <TabPane tab="Account Closure" key="13">
                        <AccountClosureSelection
                          userId={this.state.basicProfile.id}
                          countryCode={this.state.basicProfile.countryCode}
                        />
                      </TabPane>
                    </Tabs>
                  </Card>
                </Card>
              )}
        </Spin>
        <Modal
          title="Recent Details"
          closable={true}
          maskClosable={true}
          width={1300}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          visible={this.state.dialog}
          footer={[<Button onClick={this.closeModal}>Close</Button>]}
        >
          <Tabs
            defaultActiveKey={this.state.currentTab}
            activeKey={this.state.currentTab}
            onChange={this.onTabChangeHandler}
          >
            <TabPane tab="Transaction Details" key="1">
              <Table
                rowKey="transactionId"
                bordered
                pagination={false}
                dataSource={this.state.transactionData}
                columns={transactionColumns}
                style={{ overflowY: 'scroll', height: '60vh' }}
              />
            </TabPane>
            <TabPane tab="Game Details" key="2">
              <Table
                rowKey="transactionId"
                bordered
                pagination={false}
                dataSource={battleDetails}
                columns={gameColumns}
                style={{ overflowY: 'scroll', height: '55vh' }}
              />
              {category ? (
                category === 'fraud' ? (
                  <Row style={{ marginTop: 20 }}>
                    <Col sm={12}>
                      <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                        Request Status
                      </span>
                      <span>
                        {fraudDetails.requestStatus === 'Failure' ? (
                          <Tag color="#f50">Failure</Tag>
                        ) : (
                          <Tag color="#87d068">Success</Tag>
                        )}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                        Fraud Status:
                      </span>
                      <span>
                        {fraudDetails.fraudConfirmed == 'No' ? (
                          <Tag color="#f50">No</Tag>
                        ) : fraudDetails.fraudConfirmed == 'May-Be' ? (
                          <Tag color="#2db7f5">May-Be</Tag>
                        ) : (
                          <Tag color="#87d068">Yes</Tag>
                        )}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span style={{ fontWeight: 'bold', marginRight: 5 }}>
                        isCallerVictim:
                      </span>
                      <span>
                        {fraudDetails.isCallerVictim == true ? (
                          <Tag color="#87d068">True</Tag>
                        ) : (
                          <Tag color="#f50">False</Tag>
                        )}
                      </span>
                    </Col>
                  </Row>
                ) : (
                  <Row style={{ marginTop: 20 }}>
                    <Col span={12}>
                      {' '}
                      <strong> Game End Reason: </strong>{' '}
                      {this.state.disconnectionDetails.gameEndReason
                        ? this.state.disconnectionDetails.gameEndReason
                        : 'N/A'}
                    </Col>
                    <Col span={12}>
                      {' '}
                      <strong> Eligible For Disconnection Refund: </strong>{' '}
                      {this.state.disconnectionDetails
                        .eligibleForDisconnectionRefund
                        ? 'Yes'
                        : 'No'}
                    </Col>
                    <Col span={12}>
                      {' '}
                      <strong>Disconnection: </strong>{' '}
                      {this.state.disconnectionDetails.mplDisconnection
                        ? 'Yes'
                        : 'No'}
                    </Col>
                  </Row>
                )
              ) : null}
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          title={'Game Data'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={this.closeGameModal}
          onCancel={this.closeGameModal}
          visible={this.state.showGameDataModal}
          footer={[<Button onClick={this.closeGameModal}>Close</Button>]}
        >
          <Table
            rowKey="userId"
            bordered
            pagination={false}
            dataSource={this.state.gameDataList}
            columns={gameDataColumns}
          />
          {isModalDetails && <Card>{JSON.stringify(gameDataModal)}</Card>}
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getProfileByMobileResponse: state.userProfile.getProfileByMobileResponse,
    getUserIdFromReferenceIdResponse:
      state.crm.getUserIdFromReferenceIdResponse,
    getUserDashboardBalanceResponse: state.crm.getUserDashboardBalanceResponse,
    getProfileByIdResponse: state.userProfile.getProfileByIdResponse,
    referredUserDetails: state.referral.referredUserDetails,
    getUserCredibilityResponse: state.crm.getUserCredibilityResponse,
    getUserWinningsResponse: state.supportPayment.getUserWinningsResponse,
    currentUser: state.auth.currentUser,
    userInfoResponse: state.userProfile.userInfoResponse,
    cumulativeWinnings: state.crm.cumulativeWinnings,
    followDetails: state.crm.followDetails,
    appInfo: state.crm.appInfo,
    deviceInfo: state.crm.deviceInfo,
    getPlayerLobbyHistoryResponse: state.crm.getPlayerLobbyHistoryResponse,
    getBattleGameDataResponse: state.crm.getBattleGameDataResponse,
    disabledRefundAgents: state.crm.disabledRefundAgents,
    userPrimeRes: state.crm.userPrimeRes,
    userIdSuid: state.userData.userIdSuid,
    transactionList: state.accounts.transactionList,
    gameFraud: state.fraud.gameFraud,
    getDisconnectionDataResponse: state.crm.getDisconnectionDataResponse,
    refundEligibleConfig: state.crm.checkRefundEligibility,
    userIdSuid: state.userData.userIdSuid
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...crmActions,
        ...userProfileActions,
        ...referralActions,
        ...supportPaymentActions,
        ...userDataActions,
        ...accountActions,
        ...fraudActions
      },
      dispatch
    )
  };
}

const CRMForm = Form.create()(CRM);
export default connect(mapStateToProps, mapDispatchToProps)(CRMForm);
