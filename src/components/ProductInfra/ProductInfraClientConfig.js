import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as productInfraActions from '../../actions/ProductInfraActions';
import {
  Card,
  Form,
  Button,
  Input,
  message,
  Row,
  Col,
  InputNumber,
  Select
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

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

const COUNTRY_OPTIONS = ['ID', 'IN', 'US'];
const APP_TYPE_LIST = ['ANDROID', 'IOS'];

class ProductInfraClientConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJsonVerified: {
        rtueGameIds: true,
        homeMissionBannerConfig: true,
        homeSeasonPassBannerConfigv2: true,
        homeSeasonPassBannerConfig: true,
        wtmBattleConfig: true,
        crossSellPopupConfig: true,
        homeTooltipEnabledApktype: true,
        nowtmConfig: true,
        homeTooltipConfig: true,
        referralNudgeConfigs: true
      },
      countrySelected: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState({
      loaded: false,
      countrySelected: true,
      countryCode: value
    });
  }

  selectAppType(value) {
    this.setState(
      {
        loaded: false,
        appType: value
      },
      () => {
        this.getConfig();
      }
    );
  }

  getConfig = () => {
    let data = {
      countryCode: this.state.countryCode,
      appType: this.state.appType
    };
    this.props.actions.getProdInfraClientConfigs(data).then(() => {
      if (this.props.getProdInfraClientConfigsResponse) {
        let mainConfig =
          JSON.parse(this.props.getProdInfraClientConfigsResponse) &&
          JSON.parse(this.props.getProdInfraClientConfigsResponse).config
            ? JSON.parse(this.props.getProdInfraClientConfigsResponse).config
            : {};
        this.setState({
          config: {
            rtueGameIds: mainConfig['rtue.gameIds']
              ? [...mainConfig['rtue.gameIds']]
              : [],
            vipExpiryDays: mainConfig['vip.expiry.days'],
            loginIndiaBg: mainConfig['login.india.bg'],
            homeMissionBannerConfig: mainConfig['home.mission.banner.config']
              ? {
                  ...mainConfig['home.mission.banner.config']
                }
              : {},
            homeSeasonPassBannerConfigv2: mainConfig[
              'home.seasonPass.banner.configv2'
            ]
              ? {
                  ...mainConfig['home.seasonPass.banner.configv2']
                }
              : {},
            homeSeasonPassBannerConfig: mainConfig[
              'home.seasonPass.banner.config'
            ]
              ? {
                  ...mainConfig['home.seasonPass.banner.config']
                }
              : {},
            maximumRecentlyGames: mainConfig['maximum.recently.games'],
            minimumUniqueGames: mainConfig['minimum.unique.games'],
            maximumUniqueGames: mainConfig['maximum.unique.games'],
            thumbsTournamentInterval: mainConfig['thumbs.tournament.interval'],
            thumbsBattleInterval: mainConfig['thumbs.battle.interval'],
            wtmBattleConfig: mainConfig['wtm.battle.config']
              ? { ...mainConfig['wtm.battle.config'] }
              : {},
            crossSellPopupConfig: mainConfig['crossSell.popup.config']
              ? { ...mainConfig['crossSell.popup.config'] }
              : {},
            footerReferAndEarn: mainConfig['footer.referAndEarn'],
            homeTooltipEnabledApktype: mainConfig[
              'home.tooltip.enabled.apktype'
            ]
              ? [...mainConfig['home.tooltip.enabled.apktype']]
              : [],
            nowtmConfig: mainConfig['nowtm.config']
              ? { ...mainConfig['nowtm.config'] }
              : {},
            homeTooltipConfig: mainConfig['home.tooltip.config']
              ? { ...mainConfig['home.tooltip.config'] }
              : {},
            referralNudgeConfigs: mainConfig['referral.nudge.configs']
              ? { ...mainConfig['referral.nudge.configs'] }
              : {}
          },
          loaded: true
        });
      } else {
        message.error('Could not load config');
      }
    });
  };

  jsonCheck(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      message.error('Invalid JSON object', 1);
      return false;
    }
  }

  verifyJsonInput(value, configType) {
    let isJsonFlag = false;
    if (value === null || value === '') {
      isJsonFlag = false;
    } else {
      isJsonFlag = this.jsonCheck(value);
    }
    let isJsonVerified = { ...this.state.isJsonVerified };
    switch (configType) {
      case 'RTUE_GAME_IDS':
        isJsonVerified.rtueGameIds = isJsonFlag;
        console.log({ isJsonVerified });
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'HOME_MISSION_BANNER_CONFIG':
        isJsonVerified.homeMissionBannerConfig = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'HOME_SEASON_PASS_BANNER_CONFIG_V2':
        isJsonVerified.homeSeasonPassBannerConfigv2 = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'HOME_SEASON_PASS_BANNER_CONFIG':
        isJsonVerified.homeSeasonPassBannerConfig = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'WTM_BATTLE_CONFIG':
        isJsonVerified.wtmBattleConfig = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'CROSS_SELL_POPUP_CONFIG':
        isJsonVerified.crossSellPopupConfig = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'HOME_TOOLTIP_ENABLED_APKTYPE':
        isJsonVerified.homeTooltipEnabledApktype = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'NOWTM_CONFIG':
        isJsonVerified.nowtmConfig = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'HOME_TOOLTIP_CONFIG':
        isJsonVerified.homeTooltipConfig = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'REFERRAL_NUDGE_CONFIGS':
        isJsonVerified.referralNudgeConfigs = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      default:
        break;
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          appType: this.state.appType,
          countryCode: this.state.countryCode,
          rtueGameIds: JSON.parse(values.rtueGameIds),
          vipExpiryDays: values.vipExpiryDays,
          loginIndiaBg: values.loginIndiaBg,
          homeMissionBannerConfig: JSON.parse(values.homeMissionBannerConfig),
          homeSeasonPassBannerConfigv2: JSON.parse(
            values.homeSeasonPassBannerConfigv2
          ),
          homeSeasonPassBannerConfig: JSON.parse(
            values.homeSeasonPassBannerConfig
          ),
          maximumRecentlyGames: values.maximumRecentlyGames,
          minimumUniqueGames: values.minimumUniqueGames,
          maximumUniqueGames: values.maximumUniqueGames,
          thumbsTournamentInterval: values.thumbsTournamentInterval,
          thumbsBattleInterval: values.thumbsBattleInterval,
          wtmBattleConfig: JSON.parse(values.wtmBattleConfig),
          crossSellPopupConfig: JSON.parse(values.crossSellPopupConfig),
          footerReferAndEarn: values.footerReferAndEarn,
          homeTooltipEnabledApktype: JSON.parse(
            values.homeTooltipEnabledApktype
          ),
          nowtmConfig: JSON.parse(values.nowtmConfig),
          homeTooltipConfig: JSON.parse(values.homeTooltipConfig),
          referralNudgeConfigs: JSON.parse(values.referralNudgeConfigs)
        };
        this.props.actions.setProdInfraClientConfigs(data).then(() => {
          if (this.props.setProdInfraClientConfigsResponse) {
            if (this.props.setProdInfraClientConfigsResponse.error) {
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
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      rtueGameIds:
        isFieldTouched('rtueGameIds') && getFieldError('rtueGameIds'),
      vipExpiryDays:
        isFieldTouched('vipExpiryDays') && getFieldError('vipExpiryDays'),
      loginIndiaBg:
        isFieldTouched('loginIndiaBg') && getFieldError('loginIndiaBg'),
      homeMissionBannerConfig:
        isFieldTouched('homeMissionBannerConfig') &&
        getFieldError('homeMissionBannerConfig'),
      homeSeasonPassBannerConfigv2:
        isFieldTouched('homeSeasonPassBannerConfigv2') &&
        getFieldError('homeSeasonPassBannerConfigv2'),
      homeSeasonPassBannerConfig:
        isFieldTouched('homeSeasonPassBannerConfig') &&
        getFieldError('homeSeasonPassBannerConfig'),
      maximumRecentlyGames:
        isFieldTouched('maximumRecentlyGames') &&
        getFieldError('maximumRecentlyGames'),
      minimumUniqueGames:
        isFieldTouched('minimumUniqueGames') &&
        getFieldError('minimumUniqueGames'),
      maximumUniqueGames:
        isFieldTouched('maximumUniqueGames') &&
        getFieldError('maximumUniqueGames'),
      thumbsTournamentInterval:
        isFieldTouched('thumbsTournamentInterval') &&
        getFieldError('thumbsTournamentInterval'),
      thumbsBattleInterval:
        isFieldTouched('thumbsBattleInterval') &&
        getFieldError('thumbsBattleInterval'),
      wtmBattleConfig:
        isFieldTouched('wtmBattleConfig') && getFieldError('wtmBattleConfig'),
      crossSellPopupConfig:
        isFieldTouched('crossSellPopupConfig') &&
        getFieldError('crossSellPopupConfig'),
      footerReferAndEarn:
        isFieldTouched('footerReferAndEarn') &&
        getFieldError('footerReferAndEarn'),
      homeTooltipEnabledApktype:
        isFieldTouched('homeTooltipEnabledApktype') &&
        getFieldError('homeTooltipEnabledApktype'),
      nowtmConfig:
        isFieldTouched('nowtmConfig') && getFieldError('nowtmConfig'),
      homeTooltipConfig:
        isFieldTouched('homeTooltipConfig') &&
        getFieldError('homeTooltipConfig'),
      referralNudgeConfigs:
        isFieldTouched('referralNudgeConfigs') &&
        getFieldError('referralNudgeConfigs')
    };

    const { config, isJsonVerified } = this.state;

    return (
      <Card className="page-container" title="Product Infra Client Configs">
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <FormItem label={<span>Country</span>}>
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
                {COUNTRY_OPTIONS.map(country => (
                  <Option value={country} key={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {this.state.countrySelected && (
            <FormItem label={<span>App Type</span>}>
              {getFieldDecorator('appType', {
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
                  onSelect={e => this.selectAppType(e)}
                  style={{ width: '100%' }}
                  placeholder="Select app type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {APP_TYPE_LIST.map(appType => (
                    <Option value={appType} key={appType}>
                      {appType}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )}
          {this.state.countrySelected && this.state.loaded && (
            <Card>
              <FormItem
                validateStatus={
                  errors.rtueGameIds || !isJsonVerified.rtueGameIds
                    ? 'error'
                    : ''
                }
                help={errors.rtueGameIds || ''}
                {...formItemLayout}
                label={'rtueGameIds'}
              >
                {getFieldDecorator('rtueGameIds', {
                  initialValue:
                    config && config.rtueGameIds
                      ? JSON.stringify(config.rtueGameIds)
                      : [],
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={2}
                    onBlur={e =>
                      this.verifyJsonInput(e.target.value, 'RTUE_GAME_IDS')
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.vipExpiryDays ? 'error' : ''}
                help={errors.vipExpiryDays || ''}
                label={'Vip Expiry Days'}
              >
                {getFieldDecorator('vipExpiryDays', {
                  initialValue:
                    config && config.vipExpiryDays ? config.vipExpiryDays : 0,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'This is a mandatory field!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.loginIndiaBg ? 'error' : ''}
                help={errors.loginIndiaBg || ''}
                label={'loginIndiaBg'}
              >
                {getFieldDecorator('loginIndiaBg', {
                  initialValue:
                    config && config.loginIndiaBg ? config.loginIndiaBg : 0,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'This is a mandatory field!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.homeMissionBannerConfig ||
                  !isJsonVerified.homeMissionBannerConfig
                    ? 'error'
                    : ''
                }
                help={errors.homeMissionBannerConfig || ''}
                {...formItemLayout}
                label={'homeMissionBannerConfig'}
              >
                {getFieldDecorator('homeMissionBannerConfig', {
                  initialValue:
                    config && config.homeMissionBannerConfig
                      ? JSON.stringify(config.homeMissionBannerConfig, null, 2)
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={8}
                    onBlur={e =>
                      this.verifyJsonInput(
                        e.target.value,
                        'HOME_MISSION_BANNER_CONFIG'
                      )
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.homeSeasonPassBannerConfigv2 ||
                  !isJsonVerified.homeSeasonPassBannerConfigv2
                    ? 'error'
                    : ''
                }
                help={errors.homeSeasonPassBannerConfigv2 || ''}
                {...formItemLayout}
                label={'homeSeasonPassBannerConfigv2'}
              >
                {getFieldDecorator('homeSeasonPassBannerConfigv2', {
                  initialValue:
                    config && config.homeSeasonPassBannerConfigv2
                      ? JSON.stringify(
                          config.homeSeasonPassBannerConfigv2,
                          null,
                          2
                        )
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={8}
                    onBlur={e =>
                      this.verifyJsonInput(
                        e.target.value,
                        'HOME_SEASON_PASS_BANNER_CONFIG_V2'
                      )
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.homeSeasonPassBannerConfig ||
                  !isJsonVerified.homeSeasonPassBannerConfig
                    ? 'error'
                    : ''
                }
                help={errors.homeSeasonPassBannerConfig || ''}
                {...formItemLayout}
                label={'homeSeasonPassBannerConfig'}
              >
                {getFieldDecorator('homeSeasonPassBannerConfig', {
                  initialValue:
                    config && config.homeSeasonPassBannerConfig
                      ? JSON.stringify(
                          config.homeSeasonPassBannerConfig,
                          null,
                          2
                        )
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={8}
                    onBlur={e =>
                      this.verifyJsonInput(
                        e.target.value,
                        'HOME_SEASON_PASS_BANNER_CONFIG'
                      )
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.maximumRecentlyGames ? 'error' : ''}
                help={errors.maximumRecentlyGames || ''}
                label={'maximumRecentlyGames'}
              >
                {getFieldDecorator('maximumRecentlyGames', {
                  initialValue:
                    config && config.maximumRecentlyGames
                      ? config.maximumRecentlyGames
                      : 0,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'This is a mandatory field!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.minimumUniqueGames ? 'error' : ''}
                help={errors.minimumUniqueGames || ''}
                label={'minimumUniqueGames'}
              >
                {getFieldDecorator('minimumUniqueGames', {
                  initialValue:
                    config && config.minimumUniqueGames
                      ? config.minimumUniqueGames
                      : 0,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'This is a mandatory field!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.maximumUniqueGames ? 'error' : ''}
                help={errors.maximumUniqueGames || ''}
                label={'maximumUniqueGames'}
              >
                {getFieldDecorator('maximumUniqueGames', {
                  initialValue:
                    config && config.maximumUniqueGames
                      ? config.maximumUniqueGames
                      : 0,
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'This is a mandatory field!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={errors.thumbsTournamentInterval ? 'error' : ''}
                help={errors.thumbsTournamentInterval || ''}
                label={'thumbsTournamentInterval'}
              >
                {getFieldDecorator('thumbsTournamentInterval', {
                  initialValue:
                    config && config.thumbsTournamentInterval
                      ? config.thumbsTournamentInterval
                      : '',
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={errors.thumbsBattleInterval ? 'error' : ''}
                help={errors.thumbsBattleInterval || ''}
                label={'thumbsBattleInterval'}
              >
                {getFieldDecorator('thumbsBattleInterval', {
                  initialValue:
                    config && config.thumbsBattleInterval
                      ? config.thumbsBattleInterval
                      : '',
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.wtmBattleConfig || !isJsonVerified.wtmBattleConfig
                    ? 'error'
                    : ''
                }
                help={errors.wtmBattleConfig || ''}
                {...formItemLayout}
                label={'wtmBattleConfig'}
              >
                {getFieldDecorator('wtmBattleConfig', {
                  initialValue:
                    config && config.wtmBattleConfig
                      ? JSON.stringify(config.wtmBattleConfig, null, 2)
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={15}
                    onBlur={e =>
                      this.verifyJsonInput(e.target.value, 'WTM_BATTLE_CONFIG')
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.crossSellPopupConfig ||
                  !isJsonVerified.crossSellPopupConfig
                    ? 'error'
                    : ''
                }
                help={errors.crossSellPopupConfig || ''}
                {...formItemLayout}
                label={'crossSellPopupConfig'}
              >
                {getFieldDecorator('crossSellPopupConfig', {
                  initialValue:
                    config && config.crossSellPopupConfig
                      ? JSON.stringify(config.crossSellPopupConfig, null, 2)
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={10}
                    onBlur={e =>
                      this.verifyJsonInput(
                        e.target.value,
                        'CROSS_SELL_POPUP_CONFIG'
                      )
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={errors.footerReferAndEarn ? 'error' : ''}
                help={errors.footerReferAndEarn || ''}
                label={'footerReferAndEarn'}
              >
                {getFieldDecorator('footerReferAndEarn', {
                  initialValue:
                    config && config.footerReferAndEarn
                      ? config.footerReferAndEarn
                      : '',
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.homeTooltipEnabledApktype ||
                  !isJsonVerified.homeTooltipEnabledApktype
                    ? 'error'
                    : ''
                }
                help={errors.homeTooltipEnabledApktype || ''}
                {...formItemLayout}
                label={'homeTooltipEnabledApktype'}
              >
                {getFieldDecorator('homeTooltipEnabledApktype', {
                  initialValue:
                    config && config.homeTooltipEnabledApktype
                      ? JSON.stringify(config.homeTooltipEnabledApktype)
                      : [],
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={2}
                    onBlur={e =>
                      this.verifyJsonInput(
                        e.target.value,
                        'HOME_TOOLTIP_ENABLED_APKTYPE'
                      )
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.nowtmConfig || !isJsonVerified.nowtmConfig
                    ? 'error'
                    : ''
                }
                help={errors.nowtmConfig || ''}
                {...formItemLayout}
                label={'nowtmConfig'}
              >
                {getFieldDecorator('nowtmConfig', {
                  initialValue:
                    config && config.nowtmConfig
                      ? JSON.stringify(config.nowtmConfig, null, 2)
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={6}
                    onBlur={e =>
                      this.verifyJsonInput(e.target.value, 'NOWTM_CONFIG')
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.homeTooltipConfig || !isJsonVerified.homeTooltipConfig
                    ? 'error'
                    : ''
                }
                help={errors.homeTooltipConfig || ''}
                {...formItemLayout}
                label={'homeTooltipConfig'}
              >
                {getFieldDecorator('homeTooltipConfig', {
                  initialValue:
                    config && config.homeTooltipConfig
                      ? JSON.stringify(config.homeTooltipConfig, null, 2)
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={6}
                    onBlur={e =>
                      this.verifyJsonInput(
                        e.target.value,
                        'HOME_TOOLTIP_CONFIG'
                      )
                    }
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={
                  errors.referralNudgeConfigs ||
                  !isJsonVerified.referralNudgeConfigs
                    ? 'error'
                    : ''
                }
                help={errors.referralNudgeConfigs || ''}
                {...formItemLayout}
                label={'referralNudgeConfigs'}
              >
                {getFieldDecorator('referralNudgeConfigs', {
                  initialValue:
                    config && config.referralNudgeConfigs
                      ? JSON.stringify(config.referralNudgeConfigs, null, 2)
                      : {},
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field!',
                      whitespace: true
                    }
                  ]
                })(
                  <TextArea
                    rows={6}
                    onBlur={e =>
                      this.verifyJsonInput(
                        e.target.value,
                        'REFERRAL_NUDGE_CONFIGS'
                      )
                    }
                  />
                )}
              </FormItem>
              <Row type="flex" justify="center">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={this.hasErrors(getFieldsError())}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </Form>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getProdInfraClientConfigsResponse:
    state.prodInfra.getProdInfraClientConfigsResponse,
  setProdInfraClientConfigsResponse:
    state.prodInfra.setProdInfraClientConfigsResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...productInfraActions }, dispatch)
});

const ProductInfraClientConfigForm = Form.create()(ProductInfraClientConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInfraClientConfigForm);
