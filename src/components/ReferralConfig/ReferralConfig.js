import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as referralConfigActions from '../../actions/referralConfigActions';
import * as websiteActions from '../../actions/websiteActions';
import { cloneDeep, includes } from 'lodash';
import {
  Card,
  Form,
  Button,
  Input,
  InputNumber,
  Radio,
  message,
  Row,
  Col,
  Select
} from 'antd';
import ImageUploader from './ImageUploader';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

function hasErrors(fieldsError) {
  let isError = false;
  Object.keys(fieldsError).forEach(field => {
    // Check for nested fields, undefined for no errors
    if (typeof fieldsError[field] === 'object') {
      isError = isError || hasErrors(fieldsError[field]);
      // isError = !!Object.keys(fieldsError[field]).some(fl => fieldsError[field][fl]);
    } else {
      isError = isError || !!fieldsError[field];
    }
  });
  return isError;
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class ReferralConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      referralBoosterV2Rewards: false,
      notificationJsonError: {
        loginRewards: false,
        loginRewardsNx: false,
        loginRewardsV2Nx: false,
        playXGames: false,
        depositMoney: false,
        superReferralRewards: false,
        boosterBannerUrl: '',
        loadBoosterBannerUrl: false,
        config: {},
        referralBoosterV2Rewards: false,
        referralSnackbar: false
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState({ loaded: false });
    this.getReferralConfig(value);
  }

  getReferralConfig(countryCode) {
    let data = {
      countryCode: countryCode
    };
    this.props.actions.getReferralConfig(data).then(() => {
      if (this.props.getReferralConfigResponse) {
        let config = JSON.parse(this.props.getReferralConfigResponse);
        if (config.boosterBannerUrl) {
          this.copyBoosterUrl(config.boosterBannerUrl);
        } else {
          this.setState({ loadBoosterBannerUrl: true });
        }
        this.setState({
          config,
          loaded: true
        });
      } else {
        message.error('Could not load the configs');
      }
    });
  }

  getBoosterBannerUrl = data => {
    this.setState({
      boosterBannerUrl: data && data.id ? data.id : ''
    });
  };

  copyBoosterUrl(imageUrl) {
    let url = '';
    this.setState({
      previewBoosterBannerUrl: imageUrl,
      boosterBannerUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    if (includes(imageUrl, '""')) {
      url = imageUrl.split('""/').pop();
    } else {
      url = imageUrl;
    }
    this.setState({
      boosterBannerUrl: url,
      loadBoosterBannerUrl: true
    });
  }

  jsonCheck(value, type) {
    let notificationJsonError = { ...this.state.notificationJsonError };
    if (value) {
      switch (type) {
        case 'LOGIN_REWARDS':
          try {
            JSON.parse(value);
            notificationJsonError.loginRewards = false;
          } catch (error) {
            notificationJsonError.loginRewards = true;
          }
          break;
        case 'WEEKLY_LIMIT_CROSSED':
          try {
            JSON.parse(value);
            notificationJsonError.weeklyLimit = false;
          } catch (error) {
            notificationJsonError.weeklyLimit = true;
          }
          break;
        case 'LOGIN_REWARDS_NX':
          try {
            JSON.parse(value);
            notificationJsonError.loginRewardsNx = false;
          } catch (error) {
            notificationJsonError.loginRewardsNx = true;
          }
          break;
        case 'LOGIN_REWARDS_V2_NX':
          try {
            JSON.parse(value);
            notificationJsonError.loginRewardsV2Nx = false;
          } catch (error) {
            notificationJsonError.loginRewardsV2Nx = true;
          }
          break;
        case 'PLAY_X_GAMES':
          try {
            JSON.parse(value);
            notificationJsonError.playXGames = false;
          } catch (error) {
            notificationJsonError.playXGames = true;
          }
          break;
        case 'DEPOSIT_MONEY':
          try {
            JSON.parse(value);
            notificationJsonError.depositMoney = false;
          } catch (error) {
            notificationJsonError.depositMoney = true;
          }
          break;
        case 'SUPER_REFERRAL_REWARDs':
          try {
            JSON.parse(value);
            notificationJsonError.superReferralRewards = false;
          } catch (error) {
            notificationJsonError.superReferralRewards = true;
          }
          break;
        case 'REFERRAL_BOOSTER_V2_REWARDS':
          try {
            JSON.parse(value);
            notificationJsonError.referralBoosterV2Rewards = false;
          } catch (error) {
            notificationJsonError.referralBoosterV2Rewards = true;
          }
          break;
        case 'REFERRAL_SNACKBAR':
          try {
            JSON.parse(value);
            notificationJsonError.referralSnackbar = false;
          } catch (error) {
            notificationJsonError.referralSnackbar = true;
          }
          break;
        default:
          break;
      }
      this.setState({ notificationJsonError: { ...notificationJsonError } });
    } else {
      switch (type) {
        case 'LOGIN_REWARDS':
          notificationJsonError.loginRewards = true;
          break;
        case 'WEEKLY_LIMIT_CROSSED':
          notificationJsonError.weeklyLimit = true;
          break;
        case 'LOGIN_REWARDS_NX':
          notificationJsonError.loginRewardsNx = true;
          break;
        case 'LOGIN_REWARDS_V2_NX':
          notificationJsonError.loginRewardsV2Nx = true;
          break;
        case 'PLAY_X_GAMES':
          notificationJsonError.playXGames = true;
          break;
        case 'DEPOSIT_MONEY':
          notificationJsonError.depositMoney = true;
          break;
        case 'SUPER_REFERRAL_REWARDS':
          notificationJsonError.superReferralRewards = true;
          break;
        case 'REFERRAL_BOOSTER_V2_REWARDS':
          notificationJsonError.referralBoosterV2Rewards = true;
          break;
        case 'REFERRAL_SNACKBAR':
          notificationJsonError.referralSnackbar = true;
          break;
        default:
          break;
      }
      this.setState({ notificationJsonError: { ...notificationJsonError } });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (Object.values(this.state.notificationJsonError).includes(true)) {
          message.error('Please check the JSON objects');
          return;
        }
        if (!this.state.boosterBannerUrl) {
          message.error('Image object cannot be empty');
          return;
        }

        let data = {
          ...values,
          countryCode: values.countryCode,
          depositLimitCap: values.depositLimitCap,
          maxAllowedReferralCount: values.maxAllowedReferralCount,
          flockNotificationReferralNumber:
            values.flockNotificationReferralNumber,
          flockNotificationTimeInMinutes: values.flockNotificationTimeInMinutes,
          autoBlockEnabled: values.autoBlockEnabled,
          autoBlockReferralNumber: values.autoBlockReferralNumber,
          autoBlockTimePeriod: values.autoBlockTimePeriod,
          boosterEnabled: values.boosterEnabled,
          boosterDurationInMins: values.boosterDurationInMins,
          boosterMultiplier: values.boosterMultiplier,
          boosterBannerUrl: this.state.boosterBannerUrl,
          weeklyReferralLimit: values.weeklyReferralLimit,
          weeklyReferralLimitEnabled: values.weeklyReferralLimitEnabled,
          referralRewardReferrerCash: {
            IOS: values.referralRewardReferrerCashIos,
            CASH: values.referralRewardReferrerCashPro,
            PLAY_STORE: values.referralRewardReferrerCashPs
          },
          referralRewardReferrerToken: {
            IOS: values.referralRewardReferrerTokenIos,
            CASH: values.referralRewardReferrerTokenPro,
            PLAY_STORE: values.referralRewardReferrerTokenPs
          },
          referralRewardNewUserToken: {
            IOS: values.referralRewardNewUserTokenIos,
            CASH: values.referralRewardNewUserTokenPro,
            PLAY_STORE: values.referralRewardNewUserTokenPs
          },
          referralRewardNewUserCash: {
            IOS: values.referralRewardNewUserCashIos,
            CASH: values.referralRewardNewUserCashPro,
            PLAY_STORE: values.referralRewardNewUserCashPs
          },
          referralRewardNewUserDepositCash: {
            IOS: values.referralRewardNewUserDepositCashIos,
            CASH: values.referralRewardNewUserDepositCashPro,
            PLAY_STORE: values.referralRewardNewUserDepositCashPs
          },
          referralRewardNewUserCurrency: values.referralRewardNewUserCurrency,
          newUserSignUpCurrency: values.newUserSignUpCurrency,
          newUserSignUpAmount: values.newUserSignUpAmount,
          boosterV2Enabled: values.boosterV2Enabled,
          referralBoosterV2Rewards: cloneDeep(
            JSON.parse(values.referralBoosterV2Rewards)
          ),
          referralSnackbar: JSON.parse(values.referralSnackbar),
          notifications: {
            WEEKLY_LIMIT_CROSSED: {
              enabled: values.weeklyLimitEnabled,
              numberReferred: values.weeklyLimitNumberReferred,
              timeInMinutes: values.weeklyLimitTimeInMinutes,
              notificationContent: JSON.parse(
                values.weeklyLimitNotificationContent
              )
            },
            LOGIN_REWARDS: {
              enabled: values.loginRewardsEnabled,
              numberReferred: values.loginRewardsNumberReferred,
              timeInMinutes: values.loginRewardsTimeInMinutes,
              notificationContent: JSON.parse(
                values.loginRewardsNotificationContent
              )
            },
            LOGIN_REWARDS_NX: {
              enabled: values.loginRewardsNxEnabled,
              numberReferred: values.loginRewardsNxNumberReferred,
              timeInMinutes: values.loginRewardsNxTimeInMinutes,
              notificationContent: JSON.parse(
                values.loginRewardsNxNotificationContent
              )
            },
            LOGIN_REWARDS_V2_NX: {
              enabled: values.loginRewardsNxV2Enabled,
              numberReferred: values.loginRewardsNxV2NumberReferred,
              timeInMinutes: values.loginRewardsNxV2TimeInMinutes,
              notificationContent: JSON.parse(
                values.loginRewardsNxV2NotificationContent
              )
            },
            PLAY_X_GAMES: {
              enabled: values.playXGamesEnabled,
              numberReferred: values.playXGamesNumberReferred,
              timeInMinutes: values.playXGamesTimeInMinutes,
              notificationContent: JSON.parse(
                values.playXGamesNotificationContent
              )
            },
            DEPOSIT_MONEY: {
              enabled: values.depositMoneyEnabled,
              numberReferred: values.depositMoneyNumberReferred,
              timeInMinutes: values.depositMoneyTimeInMinutes,
              notificationContent: JSON.parse(
                values.depositMoneyNotificationContent
              )
            },
            SUPER_REFERRAL_REWARDS: {
              enabled: values.superReferralRewardsEnabled,
              numberReferred: values.superReferralRewardsNumberReferred,
              timeInMinutes: values.superReferralRewardsTimeInMinutes,
              notificationContent: JSON.parse(
                values.superReferralRewardsNotificationContent
              )
            }
          }
        };

        this.props.actions.setReferralConfig(data).then(() => {
          if (this.props.setReferralConfigResponse) {
            if (this.props.setReferralConfigResponse.error) {
              message.error('Could not update');
            } else {
              message.success('Data Uploaded Successfully', 1.5).then(() => {
                window.location.reload();
              });
            }
          }
        });
      }
    });
  }

  jsonValidator = async (rule, value) => {
    JSON.parse(value);
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    const formItemLayoutInner = {
      labelCol: {
        span: 12
      },
      wrapperCol: {
        span: 12
      }
    };

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      newUserSignUpCurrency:
        isFieldTouched('newUserSignUpCurrency') &&
        getFieldError('newUserSignUpCurrency'),
      newUserSignUpAmount:
        isFieldTouched('newUserSignUpAmount') &&
        getFieldError('newUserSignUpAmount'),
      referralRewardNewUserCurrency:
        isFieldTouched('referralRewardNewUserCurrency') &&
        getFieldError('referralRewardNewUserCurrency'),

      referralRewardNewUserCash: {
        IOS:
          isFieldTouched('referralRewardNewUserCash.IOS') &&
          getFieldError('referralRewardNewUserCash.IOS'),
        CASH:
          isFieldTouched('referralRewardNewUserCash.CASH') &&
          getFieldError('referralRewardNewUserCash.CASH'),
        PLAY_STORE:
          isFieldTouched('referralRewardNewUserCash.PLAY_STORE') &&
          getFieldError('referralRewardNewUserCash.PLAY_STORE')
      },
      referralRewardNewUserDepositCash: {
        IOS:
          isFieldTouched('referralRewardNewUserDepositCash.IOS') &&
          getFieldError('referralRewardNewUserDepositCash.IOS'),
        CASH:
          isFieldTouched('referralRewardNewUserDepositCash.CASH') &&
          getFieldError('referralRewardNewUserDepositCash.CASH'),
        PLAY_STORE:
          isFieldTouched('referralRewardNewUserDepositCash.PLAY_STORE') &&
          getFieldError('referralRewardNewUserDepositCash.PLAY_STORE')
      },
      referralRewardNewUserToken: {
        IOS:
          isFieldTouched('referralRewardNewUserToken.IOS') &&
          getFieldError('referralRewardNewUserToken.IOS'),
        CASH:
          isFieldTouched('referralRewardNewUserToken.CASH') &&
          getFieldError('referralRewardNewUserToken.CASH'),
        PLAY_STORE:
          isFieldTouched('referralRewardNewUserToken.PLAY_STORE') &&
          getFieldError('referralRewardNewUserToken.PLAY_STORE')
      },
      depositLimitCap:
        isFieldTouched('depositLimitCap') && getFieldError('depositLimitCap'),
      maxAllowedReferralCount:
        isFieldTouched('maxAllowedReferralCount') &&
        getFieldError('maxAllowedReferralCount'),
      flockNotificationReferralNumber:
        isFieldTouched('flockNotificationReferralNumber') &&
        getFieldError('flockNotificationReferralNumber'),
      flockNotificationTimeInMinutes:
        isFieldTouched('flockNotificationTimeInMinutes') &&
        getFieldError('flockNotificationTimeInMinutes'),
      autoBlockReferralNumber:
        isFieldTouched('autoBlockReferralNumber') &&
        getFieldError('autoBlockReferralNumber'),
      autoBlockTimePeriod:
        isFieldTouched('autoBlockTimePeriod') &&
        getFieldError('autoBlockTimePeriod'),
      boosterDurationInMins:
        isFieldTouched('boosterDurationInMins') &&
        getFieldError('boosterDurationInMins'),
      boosterMultiplier:
        isFieldTouched('boosterMultiplier') &&
        getFieldError('boosterMultiplier'),
      loginRewardsNumberReferred:
        isFieldTouched('loginRewardsNumberReferred') &&
        getFieldError('loginRewardsNumberReferred'),
      loginRewardsTimeInMinutes:
        isFieldTouched('loginRewardsTimeInMinutes') &&
        getFieldError('loginRewardsTimeInMinutes'),
      loginRewardsNotificationContent:
        isFieldTouched('loginRewardsNotificationContent') &&
        getFieldError('loginRewardsNotificationContent'),
      weeklyLimitNumberReferred:
        isFieldTouched('weeklyLimitNumberReferred') &&
        getFieldError('weeklyLimitNumberReferred'),
      weeklyLimitTimeInMinutes:
        isFieldTouched('weeklyLimitTimeInMinutes') &&
        getFieldError('weeklyLimitTimeInMinutes'),
      weeklyLimitNotificationContent:
        isFieldTouched('weeklyLimitNotificationContent') &&
        getFieldError('weeklyLimitNotificationContent'),

      loginRewardsNxNumberReferred:
        isFieldTouched('loginRewardsNxNumberReferred') &&
        getFieldError('loginRewardsNxNumberReferred'),
      loginRewardsNxTimeInMinutes:
        isFieldTouched('loginRewardsNxTimeInMinutes') &&
        getFieldError('loginRewardsNxTimeInMinutes'),
      loginRewardsNxNotificationContent:
        isFieldTouched('loginRewardsNxNotificationContent') &&
        getFieldError('loginRewardsNxNotificationContent'),
      loginRewardsNxV2NumberReferred:
        isFieldTouched('loginRewardsNxV2NumberReferred') &&
        getFieldError('loginRewardsNxV2NumberReferred'),
      loginRewardsNxV2TimeInMinutes:
        isFieldTouched('loginRewardsNxV2TimeInMinutes') &&
        getFieldError('loginRewardsNxV2TimeInMinutes'),
      loginRewardsNxV2NotificationContent:
        isFieldTouched('loginRewardsNxV2NotificationContent') &&
        getFieldError('loginRewardsNxV2NotificationContent'),
      playXGamesNumberReferred:
        isFieldTouched('playXGamesNumberReferred') &&
        getFieldError('playXGamesNumberReferred'),
      playXGamesTimeInMinutes:
        isFieldTouched('playXGamesTimeInMinutes') &&
        getFieldError('playXGamesTimeInMinutes'),
      playXGamesNotificationContent:
        isFieldTouched('playXGamesNotificationContent') &&
        getFieldError('playXGamesNotificationContent'),
      depositMoneyNumberReferred:
        isFieldTouched('depositMoneyNumberReferred') &&
        getFieldError('depositMoneyNumberReferred'),
      depositMoneyTimeInMinutes:
        isFieldTouched('depositMoneyTimeInMinutes') &&
        getFieldError('depositMoneyTimeInMinutes'),
      depositMoneyNotificationContent:
        isFieldTouched('depositMoneyNotificationContent') &&
        getFieldError('depositMoneyNotificationContent'),
      superReferralRewardsNumberReferred:
        isFieldTouched('superReferralRewardsNumberReferred') &&
        getFieldError('superReferralRewardsNumberReferred'),
      superReferralRewardsTimeInMinutes:
        isFieldTouched('superReferralRewardsTimeInMinutes') &&
        getFieldError('superReferralRewardsTimeInMinutes'),
      superReferralRewardsNotificationContent:
        isFieldTouched('superReferralRewardsNotificationContent') &&
        getFieldError('superReferralRewardsNotificationContent'),
      countryCode:
        isFieldTouched('countryCode') && getFieldError('countryCode'),
      referralRewardReferrerCashPro:
        isFieldTouched('referralRewardReferrerCashPro') &&
        getFieldError('referralRewardReferrerCashPro'),
      referralRewardReferrerCashIos:
        isFieldTouched('referralRewardReferrerCashIos') &&
        getFieldError('referralRewardReferrerCashIos'),
      referralRewardReferrerCashPs:
        isFieldTouched('referralRewardReferrerCashPs') &&
        getFieldError('referralRewardReferrerCashPs'),
      referralRewardReferrerTokenPro:
        isFieldTouched('referralRewardReferrerTokenPro') &&
        getFieldError('referralRewardReferrerTokenPro'),
      referralRewardReferrerTokenIos:
        isFieldTouched('referralRewardReferrerTokenIos') &&
        getFieldError('referralRewardReferrerTokenIos'),
      referralRewardReferrerTokenPs:
        isFieldTouched('referralRewardReferrerTokenPs') &&
        getFieldError('referralRewardReferrerTokenPs'),
      referralRewardNewUserTokenPro:
        isFieldTouched('referralRewardNewUserTokenPro') &&
        getFieldError('referralRewardNewUserTokenPro'),
      referralRewardNewUserTokenIos:
        isFieldTouched('referralRewardNewUserTokenIos') &&
        getFieldError('referralRewardNewUserTokenIos'),
      referralRewardNewUserTokenPs:
        isFieldTouched('referralRewardNewUserTokenPs') &&
        getFieldError('referralRewardNewUserTokenPs'),
      referralRewardNewUserCashPro:
        isFieldTouched('referralRewardNewUserCashPro') &&
        getFieldError('referralRewardNewUserCashPro'),
      referralRewardNewUserCashIos:
        isFieldTouched('referralRewardNewUserCashIos') &&
        getFieldError('referralRewardNewUserCashIos'),
      referralRewardNewUserCashPs:
        isFieldTouched('referralRewardNewUserCashPs') &&
        getFieldError('referralRewardNewUserCashPs'),
      referralRewardNewUserDepositCashPro:
        isFieldTouched('referralRewardNewUserDepositCashPro') &&
        getFieldError('referralRewardNewUserDepositCashPro'),
      referralRewardNewUserDepositCashIos:
        isFieldTouched('referralRewardNewUserDepositCashIos') &&
        getFieldError('referralRewardNewUserDepositCashIos'),
      referralRewardNewUserDepositCashPs:
        isFieldTouched('referralRewardNewUserDepositCashPs') &&
        getFieldError('referralRewardNewUserDepositCashPs'),
      referralBoosterV2Rewards:
        isFieldTouched('referralBoosterV2Rewards') &&
        getFieldError('referralBoosterV2Rewards'),
      weeklyReferralLimit:
        isFieldTouched('weeklyReferralLimit') &&
        getFieldError('weeklyReferralLimit'),
      weeklyReferralLimitEnabled:
        isFieldTouched('weeklyReferralLimitEnabled') &&
        getFieldError('weeklyReferralLimitEnabled'),
      referralSnackbar:
        isFieldTouched('referralSnackbar') && getFieldError('referralSnackbar')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Card title={'Referral Backend Configuration'}>
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
                  style={{ width: '100%' }}
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
            {this.state.loaded && (
              <>
                <FormItem
                  validateStatus={errors.depositLimitCap ? 'error' : ''}
                  help={errors.depositLimitCap || ''}
                  {...formItemLayout}
                  label={'depositLimitCap'}
                >
                  {getFieldDecorator('depositLimitCap', {
                    initialValue:
                      this.state.config && this.state.config.depositLimitCap
                        ? this.state.config.depositLimitCap
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.maxAllowedReferralCount ? 'error' : ''}
                  help={errors.maxAllowedReferralCount || ''}
                  {...formItemLayout}
                  label={'maxAllowedReferralCount'}
                >
                  {getFieldDecorator('maxAllowedReferralCount', {
                    initialValue:
                      this.state.config &&
                      this.state.config.maxAllowedReferralCount
                        ? this.state.config.maxAllowedReferralCount
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.flockNotificationReferralNumber ? 'error' : ''
                  }
                  help={errors.flockNotificationReferralNumber || ''}
                  {...formItemLayout}
                  label={'flockNotificationReferralNumber'}
                >
                  {getFieldDecorator('flockNotificationReferralNumber', {
                    initialValue:
                      this.state.config &&
                      this.state.config.flockNotificationReferralNumber
                        ? this.state.config.flockNotificationReferralNumber
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.flockNotificationTimeInMinutes ? 'error' : ''
                  }
                  help={errors.flockNotificationTimeInMinutes || ''}
                  {...formItemLayout}
                  label={'flockNotificationTimeInMinutes'}
                >
                  {getFieldDecorator('flockNotificationTimeInMinutes', {
                    initialValue:
                      this.state.config &&
                      this.state.config.flockNotificationTimeInMinutes
                        ? this.state.config.flockNotificationTimeInMinutes
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'autoBlockEnabled'}>
                  {getFieldDecorator('autoBlockEnabled', {
                    initialValue:
                      this.state.config && this.state.config.autoBlockEnabled
                        ? this.state.config.autoBlockEnabled
                        : false,
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ]
                  })(
                    <RadioGroup size="small" buttonStyle="solid">
                      <RadioButton value={true}>True</RadioButton>
                      <RadioButton value={false}>False</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.autoBlockReferralNumber ? 'error' : ''}
                  help={errors.autoBlockReferralNumber || ''}
                  {...formItemLayout}
                  label={'autoBlockReferralNumber'}
                >
                  {getFieldDecorator('autoBlockReferralNumber', {
                    initialValue:
                      this.state.config &&
                      this.state.config.autoBlockReferralNumber
                        ? this.state.config.autoBlockReferralNumber
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.autoBlockTimePeriod ? 'error' : ''}
                  help={errors.autoBlockTimePeriod || ''}
                  {...formItemLayout}
                  label={'autoBlockTimePeriod'}
                >
                  {getFieldDecorator('autoBlockTimePeriod', {
                    initialValue:
                      this.state.config && this.state.config.autoBlockTimePeriod
                        ? this.state.config.autoBlockTimePeriod
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'boosterEnabled'}>
                  {getFieldDecorator('boosterEnabled', {
                    initialValue:
                      this.state.config && this.state.config.boosterEnabled
                        ? this.state.config.boosterEnabled
                        : false,
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ]
                  })(
                    <RadioGroup size="small" buttonStyle="solid">
                      <RadioButton value={true}>True</RadioButton>
                      <RadioButton value={false}>False</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.boosterDurationInMins ? 'error' : ''}
                  help={errors.boosterDurationInMins || ''}
                  {...formItemLayout}
                  label={'boosterDurationInMins'}
                >
                  {getFieldDecorator('boosterDurationInMins', {
                    initialValue:
                      this.state.config &&
                      this.state.config.boosterDurationInMins
                        ? this.state.config.boosterDurationInMins
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.boosterMultiplier ? 'error' : ''}
                  help={errors.boosterMultiplier || ''}
                  {...formItemLayout}
                  label={'boosterMultiplier'}
                >
                  {getFieldDecorator('boosterMultiplier', {
                    initialValue:
                      this.state.config && this.state.config.boosterMultiplier
                        ? this.state.config.boosterMultiplier
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>

                <FormItem
                  validateStatus={
                    errors.referralRewardReferrerCashPro ? 'error' : ''
                  }
                  help={errors.referralRewardReferrerCashPro || ''}
                  {...formItemLayout}
                  label={'referralRewardReferrerCashPro'}
                >
                  {getFieldDecorator('referralRewardReferrerCashPro', {
                    initialValue:
                      this.state.config &&
                      this.state.config.referralRewardReferrerCash &&
                      this.state.config.referralRewardReferrerCash.CASH
                        ? this.state.config.referralRewardReferrerCash.CASH
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.weeklyReferralLimit ? 'error' : ''}
                  help={errors.weeklyReferralLimit || ''}
                  {...formItemLayout}
                  label={'Weekly Referral Limit'}
                >
                  {getFieldDecorator('weeklyReferralLimit', {
                    initialValue:
                      this.state.config && this.state.config.weeklyReferralLimit
                        ? this.state.config.weeklyReferralLimit
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={'Weekly Referral Limit Enabled'}
                >
                  {getFieldDecorator('weeklyReferralLimitEnabled', {
                    initialValue:
                      this.state.config &&
                      this.state.config.weeklyReferralLimitEnabled
                        ? this.state.config.weeklyReferralLimitEnabled
                        : false,
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ]
                  })(
                    <RadioGroup size="small" buttonStyle="solid">
                      <RadioButton value={true}>True</RadioButton>
                      <RadioButton value={false}>False</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="referralRewardReferrerCash">
                  <Row>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardReferrerCashIos ? 'error' : ''
                        }
                        help={errors.referralRewardReferrerCashIos || ''}
                        {...formItemLayoutInner}
                        label={'IOS'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardReferrerCashIos', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardReferrerCash &&
                            this.state.config.referralRewardReferrerCash.IOS
                              ? this.state.config.referralRewardReferrerCash.IOS
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardReferrerCashPs ? 'error' : ''
                        }
                        help={errors.referralRewardReferrerCashPs || ''}
                        {...formItemLayoutInner}
                        label={'PLAY_STORE'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardReferrerCashPs', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardReferrerCash &&
                            this.state.config.referralRewardReferrerCash
                              .PLAY_STORE
                              ? this.state.config.referralRewardReferrerCash
                                  .PLAY_STORE
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardReferrerCashPro ? 'error' : ''
                        }
                        help={errors.referralRewardReferrerCashPro || ''}
                        {...formItemLayoutInner}
                        label={'CASH'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardReferrerCashPro', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardReferrerCash &&
                            this.state.config.referralRewardReferrerCash.CASH
                              ? this.state.config.referralRewardReferrerCash
                                  .CASH
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>

                <FormItem label="referralRewardReferrerToken">
                  <Row>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardReferrerTokenIos ? 'error' : ''
                        }
                        help={errors.referralRewardReferrerTokenIos || ''}
                        {...formItemLayoutInner}
                        label={'IOS'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardReferrerTokenIos', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardReferrerToken &&
                            this.state.config.referralRewardReferrerToken.IOS
                              ? this.state.config.referralRewardReferrerToken
                                  .IOS
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardReferrerTokenPs ? 'error' : ''
                        }
                        help={errors.referralRewardReferrerTokenPs || ''}
                        {...formItemLayoutInner}
                        label={'PLAY_STORE'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardReferrerTokenPs', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardReferrerToken &&
                            this.state.config.referralRewardReferrerToken
                              .PLAY_STORE
                              ? this.state.config.referralRewardReferrerToken
                                  .PLAY_STORE
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardReferrerTokenPro ? 'error' : ''
                        }
                        help={errors.referralRewardReferrerTokenPro || ''}
                        {...formItemLayoutInner}
                        label={'CASH'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardReferrerTokenPro', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardReferrerToken &&
                            this.state.config.referralRewardReferrerToken.CASH
                              ? this.state.config.referralRewardReferrerToken
                                  .CASH
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>

                <FormItem label="referralRewardNewUserCash">
                  <Row>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserCashIos ? 'error' : ''
                        }
                        help={errors.referralRewardNewUserCashIos || ''}
                        {...formItemLayoutInner}
                        label={'IOS'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardNewUserCashIos', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardNewUserCash &&
                            this.state.config.referralRewardNewUserCash.IOS
                              ? this.state.config.referralRewardNewUserCash.IOS
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserCashPs ? 'error' : ''
                        }
                        help={errors.referralRewardNewUserCashPs || ''}
                        {...formItemLayoutInner}
                        label={'PLAY_STORE'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardNewUserCashPs', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardNewUserCash &&
                            this.state.config.referralRewardNewUserCash
                              .PLAY_STORE
                              ? this.state.config.referralRewardNewUserCash
                                  .PLAY_STORE
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserCashPro ? 'error' : ''
                        }
                        help={errors.referralRewardNewUserCashPro || ''}
                        {...formItemLayoutInner}
                        label={'CASH'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardNewUserCashPro', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardNewUserCash &&
                            this.state.config.referralRewardNewUserCash.CASH
                              ? this.state.config.referralRewardNewUserCash.CASH
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>

                <FormItem label="referralRewardNewUserToken">
                  <Row>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserTokenIos ? 'error' : ''
                        }
                        help={errors.referralRewardNewUserTokenIos || ''}
                        {...formItemLayoutInner}
                        label={'IOS'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardNewUserTokenIos', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardNewUserToken &&
                            this.state.config.referralRewardNewUserToken.IOS
                              ? this.state.config.referralRewardNewUserToken.IOS
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserTokenPs ? 'error' : ''
                        }
                        help={errors.referralRewardNewUserTokenPs || ''}
                        {...formItemLayoutInner}
                        label={'PLAY_STORE'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardNewUserTokenPs', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardNewUserToken &&
                            this.state.config.referralRewardNewUserToken
                              .PLAY_STORE
                              ? this.state.config.referralRewardNewUserToken
                                  .PLAY_STORE
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserTokenPro ? 'error' : ''
                        }
                        help={errors.referralRewardNewUserTokenPro || ''}
                        {...formItemLayoutInner}
                        label={'CASH'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator('referralRewardNewUserTokenPro', {
                          initialValue:
                            this.state.config &&
                            this.state.config.referralRewardNewUserToken &&
                            this.state.config.referralRewardNewUserToken.CASH
                              ? this.state.config.referralRewardNewUserToken
                                  .CASH
                              : 0,
                          rules: [
                            {
                              required: true,
                              message: 'This is a mandatory field!',
                              type: 'number'
                            }
                          ]
                        })(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>

                <FormItem label="referralRewardNewUserDepositCash">
                  <Row>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserDepositCashIos
                            ? 'error'
                            : ''
                        }
                        help={errors.referralRewardNewUserDepositCashIos || ''}
                        {...{ ...formItemLayoutInner }}
                        label={'IOS'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator(
                          'referralRewardNewUserDepositCashIos',
                          {
                            initialValue:
                              this.state.config &&
                              this.state.config
                                .referralRewardNewUserDepositCash &&
                              this.state.config.referralRewardNewUserDepositCash
                                .IOS
                                ? this.state.config
                                    .referralRewardNewUserDepositCash.IOS
                                : 0,
                            rules: [
                              {
                                required: true,
                                message: 'This is a mandatory field!',
                                type: 'number'
                              }
                            ]
                          }
                        )(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserDepositCashPs
                            ? 'error'
                            : ''
                        }
                        help={errors.referralRewardNewUserDepositCashPs || ''}
                        {...{ ...formItemLayoutInner }}
                        label={'PLAY_STORE'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator(
                          'referralRewardNewUserDepositCashPs',
                          {
                            initialValue:
                              this.state.config &&
                              this.state.config
                                .referralRewardNewUserDepositCash &&
                              this.state.config.referralRewardNewUserDepositCash
                                .PLAY_STORE
                                ? this.state.config
                                    .referralRewardNewUserDepositCash.PLAY_STORE
                                : 0,
                            rules: [
                              {
                                required: true,
                                message: 'This is a mandatory field!',
                                type: 'number'
                              }
                            ]
                          }
                        )(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem
                        validateStatus={
                          errors.referralRewardNewUserDepositCashPro
                            ? 'error'
                            : ''
                        }
                        help={errors.referralRewardNewUserDepositCashPro || ''}
                        {...{ ...formItemLayoutInner }}
                        label={'CASH'}
                        style={{ marginBottom: 0 }}
                      >
                        {getFieldDecorator(
                          'referralRewardNewUserDepositCashPro',
                          {
                            initialValue:
                              this.state.config &&
                              this.state.config
                                .referralRewardNewUserDepositCash &&
                              this.state.config.referralRewardNewUserDepositCash
                                .CASH
                                ? this.state.config
                                    .referralRewardNewUserDepositCash.CASH
                                : 0,
                            rules: [
                              {
                                required: true,
                                message: 'This is a mandatory field!',
                                type: 'number'
                              }
                            ]
                          }
                        )(<InputNumber min={0} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>

                <FormItem
                  validateStatus={
                    errors.referralRewardNewUserCurrency ? 'error' : ''
                  }
                  help={errors.referralRewardNewUserCurrency || ''}
                  {...formItemLayout}
                  label={'referralRewardNewUserCurrency'}
                >
                  {getFieldDecorator('referralRewardNewUserCurrency', {
                    initialValue:
                      this.state.config &&
                      this.state.config.referralRewardNewUserCurrency
                        ? this.state.config.referralRewardNewUserCurrency
                        : '',
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!'
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.newUserSignUpCurrency ? 'error' : ''}
                  help={errors.newUserSignUpCurrency || ''}
                  {...formItemLayout}
                  label={'newUserSignUpCurrency'}
                >
                  {getFieldDecorator('newUserSignUpCurrency', {
                    initialValue:
                      this.state.config &&
                      this.state.config.newUserSignUpCurrency
                        ? this.state.config.newUserSignUpCurrency
                        : '',
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!'
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.newUserSignUpAmount ? 'error' : ''}
                  help={errors.newUserSignUpAmount || ''}
                  {...formItemLayout}
                  label={'newUserSignUpAmount'}
                >
                  {getFieldDecorator('newUserSignUpAmount', {
                    initialValue:
                      this.state.config && this.state.config.newUserSignUpAmount
                        ? this.state.config.newUserSignUpAmount
                        : 0,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        type: 'number'
                      }
                    ]
                  })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem {...formItemLayout} label={'boosterV2Enabled'}>
                  {getFieldDecorator('boosterV2Enabled', {
                    initialValue:
                      this.state.config && this.state.config.boosterV2Enabled
                        ? this.state.config.boosterV2Enabled
                        : false,
                    rules: [
                      {
                        required: true,
                        message: 'Please select an option',
                        whitespace: false,
                        type: 'boolean'
                      }
                    ]
                  })(
                    <RadioGroup size="small" buttonStyle="solid">
                      <RadioButton value={true}>True</RadioButton>
                      <RadioButton value={false}>False</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.referralBoosterV2Rewards ||
                    this.state.notificationJsonError.referralBoosterV2Rewards
                      ? 'error'
                      : ''
                  }
                  help={errors.referralBoosterV2Rewards || ''}
                  {...formItemLayout}
                  label={'referralBoosterV2Rewards'}
                >
                  {getFieldDecorator('referralBoosterV2Rewards', {
                    initialValue:
                      this.state.config &&
                      this.state.config.referralBoosterV2Rewards
                        ? JSON.stringify(
                            this.state.config.referralBoosterV2Rewards,
                            null,
                            2
                          )
                        : [],
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true,
                        validator: this.jsonValidator
                      }
                    ]
                  })(
                    <TextArea
                      rows={10}
                      onBlur={e =>
                        this.jsonCheck(
                          e.target.value,
                          'REFERRAL_BOOSTER_V2_REWARDS'
                        )
                      }
                    />
                  )}
                </FormItem>
                {this.state.loadBoosterBannerUrl && (
                  <FormItem label="Booster Banner URL">
                    <ImageUploader
                      callbackFromParent={this.getBoosterBannerUrl}
                      header={'Booster Banner URL'}
                      previewImage={this.state.previewBoosterBannerUrl}
                      fileList={this.state.boosterBannerUrlFileList}
                      isMandatory={true}
                    />
                  </FormItem>
                )}
                <FormItem
                  validateStatus={
                    errors.referralSnackbar ||
                    this.state.notificationJsonError.referralSnackbar
                      ? 'error'
                      : ''
                  }
                  help={errors.referralSnackbar || ''}
                  {...formItemLayout}
                  label={'referralSnackbar'}
                >
                  {getFieldDecorator('referralSnackbar', {
                    initialValue:
                      this.state.config && this.state.config.referralSnackbar
                        ? JSON.stringify(
                            this.state.config.referralSnackbar,
                            null,
                            2
                          )
                        : [],
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true,
                        validator: this.jsonValidator
                      }
                    ]
                  })(
                    <TextArea
                      rows={10}
                      onBlur={e =>
                        this.jsonCheck(e.target.value, 'REFERRAL_SNACKBAR')
                      }
                    />
                  )}
                </FormItem>
                <Card title="Notifications">
                  <Card title="LOGIN_REWARDS" type="inner" size="small">
                    <FormItem {...formItemLayout} label={'loginRewardsEnabled'}>
                      {getFieldDecorator('loginRewardsEnabled', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS &&
                          this.state.config.notifications.LOGIN_REWARDS.enabled
                            ? this.state.config.notifications.LOGIN_REWARDS
                                .enabled
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNumberReferred ? 'error' : ''
                      }
                      help={errors.loginRewardsNumberReferred || ''}
                      {...formItemLayout}
                      label={'loginRewardsNumberReferred'}
                    >
                      {getFieldDecorator('loginRewardsNumberReferred', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS &&
                          this.state.config.notifications.LOGIN_REWARDS
                            .numberReferred
                            ? this.state.config.notifications.LOGIN_REWARDS
                                .numberReferred
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsTimeInMinutes ? 'error' : ''
                      }
                      help={errors.loginRewardsTimeInMinutes || ''}
                      {...formItemLayout}
                      label={'loginRewardsTimeInMinutes'}
                    >
                      {getFieldDecorator('loginRewardsTimeInMinutes', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS &&
                          this.state.config.notifications.LOGIN_REWARDS
                            .timeInMinutes
                            ? this.state.config.notifications.LOGIN_REWARDS
                                .timeInMinutes
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNotificationContent ||
                        this.state.notificationJsonError.loginRewards
                          ? 'error'
                          : ''
                      }
                      help={errors.loginRewardsNotificationContent || ''}
                      {...formItemLayout}
                      label={'loginRewardsNotificationContent'}
                    >
                      {getFieldDecorator('loginRewardsNotificationContent', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS &&
                          this.state.config.notifications.LOGIN_REWARDS
                            .notificationContent
                            ? JSON.stringify(
                                this.state.config.notifications.LOGIN_REWARDS
                                  .notificationContent,
                                null,
                                2
                              )
                            : '',
                        rules: [
                          {
                            required: false,
                            message: 'This is a mandatory field!',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          rows={11}
                          onBlur={e =>
                            this.jsonCheck(e.target.value, 'LOGIN_REWARDS')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="WEEKLY_LIMIT_CROSSED" type="inner" size="small">
                    <FormItem {...formItemLayout} label={'weeklyLimitEnabled'}>
                      {getFieldDecorator('weeklyLimitEnabled', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications
                            .WEEKLY_LIMIT_CROSSED &&
                          this.state.config.notifications.WEEKLY_LIMIT_CROSSED
                            .enabled
                            ? this.state.config.notifications
                                .WEEKLY_LIMIT_CROSSED.enabled
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.weeklyLimitNumberReferred ? 'error' : ''
                      }
                      help={errors.weeklyLimitNumberReferred || ''}
                      {...formItemLayout}
                      label={'weeklyLimitNumberReferred'}
                    >
                      {getFieldDecorator('weeklyLimitNumberReferred', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications
                            .WEEKLY_LIMIT_CROSSED &&
                          this.state.config.notifications.WEEKLY_LIMIT_CROSSED
                            .numberReferred
                            ? this.state.config.notifications
                                .WEEKLY_LIMIT_CROSSED.numberReferred
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.weeklyLimitTimeInMinutes ? 'error' : ''
                      }
                      help={errors.weeklyLimitTimeInMinutes || ''}
                      {...formItemLayout}
                      label={'weeklyLimitTimeInMinutes'}
                    >
                      {getFieldDecorator('weeklyLimitTimeInMinutes', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications
                            .WEEKLY_LIMIT_CROSSED &&
                          this.state.config.notifications.WEEKLY_LIMIT_CROSSED
                            .timeInMinutes
                            ? this.state.config.notifications
                                .WEEKLY_LIMIT_CROSSED.timeInMinutes
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.weeklyLimitNotificationContent ||
                        this.state.notificationJsonError.weeklyLimit
                          ? 'error'
                          : ''
                      }
                      help={errors.weeklyLimitNotificationContent || ''}
                      {...formItemLayout}
                      label={'weeklyLimitNotificationContent'}
                    >
                      {getFieldDecorator('weeklyLimitNotificationContent', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications
                            .WEEKLY_LIMIT_CROSSED &&
                          this.state.config.notifications.WEEKLY_LIMIT_CROSSED
                            .notificationContent
                            ? JSON.stringify(
                                this.state.config.notifications
                                  .WEEKLY_LIMIT_CROSSED.notificationContent,
                                null,
                                2
                              )
                            : '',
                        rules: [
                          {
                            required: false,
                            message: 'This is a mandatory field!',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          rows={11}
                          onBlur={e =>
                            this.jsonCheck(
                              e.target.value,
                              'WEEKLY_LIMIT_CROSSED'
                            )
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="LOGIN_REWARDS_NX" type="inner" size="small">
                    <FormItem
                      {...formItemLayout}
                      label={'loginRewardsNxEnabled'}
                    >
                      {getFieldDecorator('loginRewardsNxEnabled', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS_NX &&
                          this.state.config.notifications.LOGIN_REWARDS_NX
                            .enabled
                            ? this.state.config.notifications.LOGIN_REWARDS_NX
                                .enabled
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNxNumberReferred ? 'error' : ''
                      }
                      help={errors.loginRewardsNxNumberReferred || ''}
                      {...formItemLayout}
                      label={'loginRewardsNxNumberReferred'}
                    >
                      {getFieldDecorator('loginRewardsNxNumberReferred', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS_NX &&
                          this.state.config.notifications.LOGIN_REWARDS_NX
                            .numberReferred
                            ? this.state.config.notifications.LOGIN_REWARDS_NX
                                .numberReferred
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNxTimeInMinutes ? 'error' : ''
                      }
                      help={errors.loginRewardsNxTimeInMinutes || ''}
                      {...formItemLayout}
                      label={'loginRewardsNxTimeInMinutes'}
                    >
                      {getFieldDecorator('loginRewardsNxTimeInMinutes', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS_NX &&
                          this.state.config.notifications.LOGIN_REWARDS_NX
                            .timeInMinutes
                            ? this.state.config.notifications.LOGIN_REWARDS_NX
                                .timeInMinutes
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNxNotificationContent ||
                        this.state.notificationJsonError.loginRewardsNx
                          ? 'error'
                          : ''
                      }
                      help={errors.loginRewardsNxNotificationContent || ''}
                      {...formItemLayout}
                      label={'loginRewardsNxNotificationContent'}
                    >
                      {getFieldDecorator('loginRewardsNxNotificationContent', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS_NX &&
                          this.state.config.notifications.LOGIN_REWARDS_NX
                            .notificationContent
                            ? JSON.stringify(
                                this.state.config.notifications.LOGIN_REWARDS_NX
                                  .notificationContent,
                                null,
                                2
                              )
                            : '',
                        rules: [
                          {
                            required: false,
                            message: 'This is a mandatory field!',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          rows={11}
                          onBlur={e =>
                            this.jsonCheck(e.target.value, 'LOGIN_REWARDS_NX')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>

                  <Card title="LOGIN_REWARDS_V2_NX" type="inner">
                    <FormItem
                      {...formItemLayout}
                      label={'loginRewardsNxV2Enabled'}
                    >
                      {getFieldDecorator('loginRewardsNxV2Enabled', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS_V2_NX &&
                          this.state.config.notifications.LOGIN_REWARDS_V2_NX
                            .enabled
                            ? this.state.config.notifications
                                .LOGIN_REWARDS_V2_NX.enabled
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNxV2NumberReferred ? 'error' : ''
                      }
                      help={errors.loginRewardsNxV2NumberReferred || ''}
                      {...formItemLayout}
                      label={'loginRewardsNxV2NumberReferred'}
                    >
                      {getFieldDecorator('loginRewardsNxV2NumberReferred', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS_V2_NX &&
                          this.state.config.notifications.LOGIN_REWARDS_V2_NX
                            .numberReferred
                            ? this.state.config.notifications
                                .LOGIN_REWARDS_V2_NX.numberReferred
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNxV2TimeInMinutes ? 'error' : ''
                      }
                      help={errors.loginRewardsNxV2TimeInMinutes || ''}
                      {...formItemLayout}
                      label={'loginRewardsNxV2TimeInMinutes'}
                    >
                      {getFieldDecorator('loginRewardsNxV2TimeInMinutes', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.LOGIN_REWARDS_V2_NX &&
                          this.state.config.notifications.LOGIN_REWARDS_V2_NX
                            .timeInMinutes
                            ? this.state.config.notifications
                                .LOGIN_REWARDS_V2_NX.timeInMinutes
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.loginRewardsNxV2NotificationContent ||
                        this.state.notificationJsonError.loginRewardsNxV2
                          ? 'error'
                          : ''
                      }
                      help={errors.loginRewardsNxV2NotificationContent || ''}
                      {...formItemLayout}
                      label={'loginRewardsNxV2NotificationContent'}
                    >
                      {getFieldDecorator(
                        'loginRewardsNxV2NotificationContent',
                        {
                          initialValue:
                            this.state.config &&
                            this.state.config.notifications &&
                            this.state.config.notifications
                              .LOGIN_REWARDS_V2_NX &&
                            this.state.config.notifications.LOGIN_REWARDS_V2_NX
                              .notificationContent
                              ? JSON.stringify(
                                  this.state.config.notifications
                                    .LOGIN_REWARDS_V2_NX.notificationContent,
                                  null,
                                  2
                                )
                              : '',
                          rules: [
                            {
                              required: false,
                              message: 'This is a mandatory field!',
                              whitespace: true
                            }
                          ]
                        }
                      )(
                        <TextArea
                          rows={11}
                          onBlur={e =>
                            this.jsonCheck(
                              e.target.value,
                              'LOGIN_REWARDS_V2_NX'
                            )
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="PLAY_X_GAMES" type="inner">
                    <FormItem {...formItemLayout} label={'playXGamesEnabled'}>
                      {getFieldDecorator('playXGamesEnabled', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.PLAY_X_GAMES &&
                          this.state.config.notifications.PLAY_X_GAMES.enabled
                            ? this.state.config.notifications.PLAY_X_GAMES
                                .enabled
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.playXGamesNumberReferred ? 'error' : ''
                      }
                      help={errors.playXGamesNumberReferred || ''}
                      {...formItemLayout}
                      label={'playXGamesNumberReferred'}
                    >
                      {getFieldDecorator('playXGamesNumberReferred', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.PLAY_X_GAMES &&
                          this.state.config.notifications.PLAY_X_GAMES
                            .numberReferred
                            ? this.state.config.notifications.PLAY_X_GAMES
                                .numberReferred
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.playXGamesTimeInMinutes ? 'error' : ''
                      }
                      help={errors.playXGamesTimeInMinutes || ''}
                      {...formItemLayout}
                      label={'playXGamesTimeInMinutes'}
                    >
                      {getFieldDecorator('playXGamesTimeInMinutes', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.PLAY_X_GAMES &&
                          this.state.config.notifications.PLAY_X_GAMES
                            .timeInMinutes
                            ? this.state.config.notifications.PLAY_X_GAMES
                                .timeInMinutes
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.playXGamesNotificationContent ||
                        this.state.notificationJsonError.playXGames
                          ? 'error'
                          : ''
                      }
                      help={errors.playXGamesNotificationContent || ''}
                      {...formItemLayout}
                      label={'playXGamesNotificationContent'}
                    >
                      {getFieldDecorator('playXGamesNotificationContent', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.PLAY_X_GAMES &&
                          this.state.config.notifications.PLAY_X_GAMES
                            .notificationContent
                            ? JSON.stringify(
                                this.state.config.notifications.PLAY_X_GAMES
                                  .notificationContent,
                                null,
                                2
                              )
                            : '',
                        rules: [
                          {
                            required: false,
                            message: 'This is a mandatory field!',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          rows={11}
                          onBlur={e =>
                            this.jsonCheck(e.target.value, 'PLAY_X_GAMES')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card title="DEPOSIT_MONEY" type="inner" size="small">
                    <FormItem {...formItemLayout} label={'depositMoneyEnabled'}>
                      {getFieldDecorator('depositMoneyEnabled', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.DEPOSIT_MONEY &&
                          this.state.config.notifications.DEPOSIT_MONEY.enabled
                            ? this.state.config.notifications.DEPOSIT_MONEY
                                .enabled
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.depositMoneyNumberReferred ? 'error' : ''
                      }
                      help={errors.depositMoneyNumberReferred || ''}
                      {...formItemLayout}
                      label={'depositMoneyNumberReferred'}
                    >
                      {getFieldDecorator('depositMoneyNumberReferred', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.DEPOSIT_MONEY &&
                          this.state.config.notifications.DEPOSIT_MONEY
                            .numberReferred
                            ? this.state.config.notifications.DEPOSIT_MONEY
                                .numberReferred
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.depositMoneyTimeInMinutes ? 'error' : ''
                      }
                      help={errors.depositMoneyTimeInMinutes || ''}
                      {...formItemLayout}
                      label={'depositMoneyTimeInMinutes'}
                    >
                      {getFieldDecorator('depositMoneyTimeInMinutes', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.DEPOSIT_MONEY &&
                          this.state.config.notifications.DEPOSIT_MONEY
                            .timeInMinutes
                            ? this.state.config.notifications.DEPOSIT_MONEY
                                .timeInMinutes
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.depositMoneyNotificationContent ||
                        this.state.notificationJsonError.depositMoney
                          ? 'error'
                          : ''
                      }
                      help={errors.depositMoneyNotificationContent || ''}
                      {...formItemLayout}
                      label={'depositMoneyNotificationContent'}
                    >
                      {getFieldDecorator('depositMoneyNotificationContent', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications.DEPOSIT_MONEY &&
                          this.state.config.notifications.DEPOSIT_MONEY
                            .notificationContent
                            ? JSON.stringify(
                                this.state.config.notifications.DEPOSIT_MONEY
                                  .notificationContent,
                                null,
                                2
                              )
                            : '',
                        rules: [
                          {
                            required: false,
                            message: 'This is a mandatory field!',
                            whitespace: true
                          }
                        ]
                      })(
                        <TextArea
                          rows={11}
                          onBlur={e =>
                            this.jsonCheck(e.target.value, 'DEPOSIT_MONEY')
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  <Card
                    title="SUPER_REFERRAL_REWARDS"
                    type="inner"
                    size="small"
                  >
                    <FormItem
                      {...formItemLayout}
                      label={'superReferralRewardsEnabled'}
                    >
                      {getFieldDecorator('superReferralRewardsEnabled', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications
                            .SUPER_REFERRAL_REWARDS &&
                          this.state.config.notifications.SUPER_REFERRAL_REWARDS
                            .enabled
                            ? this.state.config.notifications
                                .SUPER_REFERRAL_REWARDS.enabled
                            : false,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>True</RadioButton>
                          <RadioButton value={false}>False</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.superReferralRewardsNumberReferred ? 'error' : ''
                      }
                      help={errors.superReferralRewardsNumberReferred || ''}
                      {...formItemLayout}
                      label={'superReferralRewardsNumberReferred'}
                    >
                      {getFieldDecorator('superReferralRewardsNumberReferred', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications
                            .SUPER_REFERRAL_REWARDS &&
                          this.state.config.notifications.SUPER_REFERRAL_REWARDS
                            .numberReferred
                            ? this.state.config.notifications
                                .SUPER_REFERRAL_REWARDS.numberReferred
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.superReferralRewardsTimeInMinutes ? 'error' : ''
                      }
                      help={errors.superReferralRewardsTimeInMinutes || ''}
                      {...formItemLayout}
                      label={'superReferralRewardsTimeInMinutes'}
                    >
                      {getFieldDecorator('superReferralRewardsTimeInMinutes', {
                        initialValue:
                          this.state.config &&
                          this.state.config.notifications &&
                          this.state.config.notifications
                            .SUPER_REFERRAL_REWARDS &&
                          this.state.config.notifications.SUPER_REFERRAL_REWARDS
                            .timeInMinutes
                            ? this.state.config.notifications
                                .SUPER_REFERRAL_REWARDS.timeInMinutes
                            : 0,
                        rules: [
                          {
                            required: true,
                            message: 'This is a mandatory field!',
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} />)}
                    </FormItem>
                    <FormItem
                      validateStatus={
                        errors.superReferralRewardsNotificationContent ||
                        this.state.notificationJsonError.superReferralRewards
                          ? 'error'
                          : ''
                      }
                      help={
                        errors.superReferralRewardsNotificationContent || ''
                      }
                      {...formItemLayout}
                      label={'superReferralRewardsNotificationContent'}
                    >
                      {getFieldDecorator(
                        'superReferralRewardsNotificationContent',
                        {
                          initialValue:
                            this.state.config &&
                            this.state.config.notifications &&
                            this.state.config.notifications
                              .SUPER_REFERRAL_REWARDS &&
                            this.state.config.notifications
                              .SUPER_REFERRAL_REWARDS.notificationContent
                              ? JSON.stringify(
                                  this.state.config.notifications
                                    .SUPER_REFERRAL_REWARDS.notificationContent,
                                  null,
                                  2
                                )
                              : '',
                          rules: [
                            {
                              required: false,
                              message: 'This is a mandatory field!',
                              whitespace: true
                            }
                          ]
                        }
                      )(
                        <TextArea
                          rows={11}
                          onBlur={e =>
                            this.jsonCheck(
                              e.target.value,
                              'SUPER_REFERRAL_REWARDS'
                            )
                          }
                        />
                      )}
                    </FormItem>
                  </Card>
                  {/*  */}
                </Card>

                <Row>
                  <Col span={12} offset={12}>
                    <Button
                      style={{ float: 'none' }}
                      type="primary"
                      htmlType="submit"
                      disabled={hasErrors(getFieldsError())}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    getReferralConfigResponse: state.referralConfig.getReferralConfigResponse,
    setReferralConfigResponse: state.referralConfig.setReferralConfigResponse,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...referralConfigActions, ...websiteActions },
      dispatch
    )
  };
}
const ReferralConfigForm = Form.create()(ReferralConfig);
export default connect(mapStateToProps, mapDispatchToProps)(ReferralConfigForm);
