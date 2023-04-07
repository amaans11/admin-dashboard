import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as referralConfigActions from '../../actions/referralConfigActions';
import * as websiteActions from '../../actions/websiteActions';
import _ from 'lodash';
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
const { Option } = Select;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));
class BackendConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loginRewards: {},
      playXGames: {},
      depositMoney: {},
      loginImageUrl: '',
      previewLoginImageUrl: null,
      loginImageUrlFileList: [],
      loadLoginImageUrl: false,
      playImageUrl: '',
      previewPlayImageUrl: null,
      playImageUrlFileList: [],
      loadPlayImageUrl: false,
      depositImageUrl: '',
      previewDepositImageUrl: null,
      depositImageUrlFileList: [],
      loadDepositImageUrl: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getWinning = this.getWinning.bind(this);
  }

  componentDidMount() {
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
  }

  selectCountry(value) {
    this.setState({
      loaded: false,
      loadLoginImageUrl: false,
      loadPlayImageUrl: false,
      loadDepositImageUrl: false
    });
    this.getReferralBackendConfig(value);
  }

  getReferralBackendConfig(countryCode) {
    let data = {
      countryCode: countryCode
    };
    this.props.actions.getReferralBackendConfig(data).then(() => {
      if (this.props.getReferralBackendResponse) {
        let referralPipeline = JSON.parse(this.props.getReferralBackendResponse)
          .referralPipeline;
        this.setState({
          loginRewards: { ...referralPipeline.LOGIN_REWARDS },
          playXGames: { ...referralPipeline.PLAY_X_GAMES },
          depositMoney: { ...referralPipeline.DEPOSIT_MONEY }
        });
        if (referralPipeline.LOGIN_REWARDS.imageUrl) {
          this.copyLoginImageUrl(referralPipeline.LOGIN_REWARDS.imageUrl);
        }
        if (referralPipeline.PLAY_X_GAMES.imageUrl) {
          this.copyPlayImageUrl(referralPipeline.PLAY_X_GAMES.imageUrl);
        }
        if (referralPipeline.DEPOSIT_MONEY.imageUrl) {
          this.copyDepositImageUrl(referralPipeline.DEPOSIT_MONEY.imageUrl);
        }
        this.setState({ loaded: true });
      } else {
        this.setState({
          loaded: true,
          loadLoginImageUrl: true,
          loadPlayImageUrl: true,
          loadDepositImageUrl: true
        });
      }
    });
  }

  copyLoginImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewLoginImageUrl: imageUrl,
      loginImageUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    if (_.includes(imageUrl, '""')) {
      url = imageUrl.split('""/').pop();
    } else {
      url = imageUrl;
    }
    this.setState({
      loginImageUrl: url,
      loadLoginImageUrl: true
    });
  }

  getLoginImageUrl = data => {
    this.setState({
      loginImageUrl: data && data.id ? data.id : ''
    });
  };

  copyPlayImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewPlayImageUrl: imageUrl,
      playImageUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    if (_.includes(imageUrl, '""')) {
      url = imageUrl.split('""/').pop();
    } else {
      url = imageUrl;
    }
    this.setState({
      playImageUrl: url,
      loadPlayImageUrl: true
    });
  }

  getPlayImageUrl = data => {
    this.setState({
      playImageUrl: data && data.id ? data.id : ''
    });
  };

  copyDepositImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewDepositImageUrl: imageUrl,
      depositImageUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    if (_.includes(imageUrl, '""')) {
      url = imageUrl.split('""/').pop();
    } else {
      url = imageUrl;
    }
    this.setState({
      depositImageUrl: url,
      loadDepositImageUrl: true
    });
  }

  getDepositImageUrl = data => {
    this.setState({
      depositImageUrl: data && data.id ? data.id : ''
    });
  };

  getWinning(parentObj, rewardKey) {
    let searchObj = { ...this.state[parentObj] };
    let obj = _.find(searchObj.rewardDetails, { currency: rewardKey });
    return obj.amount;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (
          this.state.loginImageUrl === '' ||
          this.state.playImageUrl === '' ||
          this.state.depositImageUrl === ''
        ) {
          message.error('Please upload the images');
          return;
        }
        let data = {
          countryCode: values.countryCode,
          loginRewards: {
            id: values.loginId,
            title: values.loginTitle,
            subTitle: values.loginSubTitle,
            reward: values.loginReward,
            enabled: values.loginEnabled,
            eventCount: values.loginEventCount,
            imageUrl: this.state.cdnPath + this.state.loginImageUrl,
            rewardDetails: [
              {
                currency: 'Bonus',
                amount: values.loginBonus
              },
              {
                currency: 'Winning',
                amount: values.loginWinning
              },
              {
                currency: 'Token',
                amount: values.loginToken
              },
              {
                currency: 'Deposit',
                amount: values.loginDeposit
              }
            ]
          },
          playXGames: {
            id: values.playId,
            title: values.playTitle,
            subTitle: values.playSubTitle,
            reward: values.playReward,
            enabled: values.playEnabled,
            eventCount: values.playEventCount,
            imageUrl: this.state.cdnPath + this.state.playImageUrl,
            rewardDetails: [
              {
                currency: 'Bonus',
                amount: values.playBonus
              },
              {
                currency: 'Winning',
                amount: values.playWinning
              },
              {
                currency: 'Token',
                amount: values.playToken
              },
              {
                currency: 'Deposit',
                amount: values.playDeposit
              }
            ]
          },
          deponsitMoney: {
            id: values.depositId,
            title: values.depositTitle,
            subTitle: values.depositSubTitle,
            reward: values.depositReward,
            enabled: values.depositEnabled,
            eventCount: values.depositEventCount,
            imageUrl: this.state.cdnPath + this.state.depositImageUrl,
            rewardDetails: [
              {
                currency: 'Bonus',
                amount: values.depositBonus
              },
              {
                currency: 'Winning',
                amount: values.depositWinning
              },
              {
                currency: 'Token',
                amount: values.depositToken
              },
              {
                currency: 'Deposit',
                amount: values.depositDeposit
              }
            ]
          }
        };
        this.props.actions.setReferralBackendConfig(data).then(() => {
          if (this.props.setReferralBackendResponse) {
            if (this.props.setReferralBackendResponse.error) {
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

    const errors = {
      loginId: isFieldTouched('loginId') && getFieldError('loginId'),
      loginTitle: isFieldTouched('loginTitle') && getFieldError('loginTitle'),
      loginSubTitle:
        isFieldTouched('loginSubTitle') && getFieldError('loginSubTitle'),
      loginReward:
        isFieldTouched('loginReward') && getFieldError('loginReward'),
      loginEnabled:
        isFieldTouched('loginEnabled') && getFieldError('loginEnabled'),
      loginEventCount:
        isFieldTouched('loginEventCount') && getFieldError('loginEventCount'),
      loginBonus: isFieldTouched('loginBonus') && getFieldError('loginBonus'),
      loginWinning:
        isFieldTouched('loginWinning') && getFieldError('loginWinning'),
      loginToken: isFieldTouched('loginToken') && getFieldError('loginToken'),
      loginDeposit:
        isFieldTouched('loginDeposit') && getFieldError('loginDeposit'),
      playId: isFieldTouched('playId') && getFieldError('playId'),
      playTitle: isFieldTouched('playTitle') && getFieldError('playTitle'),
      playSubTitle:
        isFieldTouched('playSubTitle') && getFieldError('playSubTitle'),
      playReward: isFieldTouched('playReward') && getFieldError('playReward'),
      playEnabled:
        isFieldTouched('playEnabled') && getFieldError('playEnabled'),
      playEventCount:
        isFieldTouched('playEventCount') && getFieldError('playEventCount'),
      playBonus: isFieldTouched('playBonus') && getFieldError('playBonus'),
      playWinning:
        isFieldTouched('playWinning') && getFieldError('playWinning'),
      playToken: isFieldTouched('playToken') && getFieldError('playToken'),
      playDeposit:
        isFieldTouched('playDeposit') && getFieldError('playDeposit'),
      depositId: isFieldTouched('depositId') && getFieldError('depositId'),
      depositTitle:
        isFieldTouched('depositTitle') && getFieldError('depositTitle'),
      depositSubTitle:
        isFieldTouched('depositSubTitle') && getFieldError('depositSubTitle'),
      depositReward:
        isFieldTouched('depositReward') && getFieldError('depositReward'),
      depositEnabled:
        isFieldTouched('depositEnabled') && getFieldError('depositEnabled'),
      depositEventCount:
        isFieldTouched('depositEventCount') &&
        getFieldError('depositEventCount'),
      depositBonus:
        isFieldTouched('depositBonus') && getFieldError('depositBonus'),
      depositWinning:
        isFieldTouched('depositWinning') && getFieldError('depositWinning'),
      depositToken:
        isFieldTouched('depositToken') && getFieldError('depositToken'),
      depositDeposit:
        isFieldTouched('depositDeposit') && getFieldError('depositDeposit'),
      superteamId:
        isFieldTouched('superteamId') && getFieldError('superteamId'),
      superteamTitle:
        isFieldTouched('superteamTitle') && getFieldError('superteamTitle'),
      superteamSubTitle:
        isFieldTouched('superteamSubTitle') &&
        getFieldError('superteamSubTitle'),
      superteamReward:
        isFieldTouched('superteamReward') && getFieldError('superteamReward'),
      superteamEnabled:
        isFieldTouched('superteamEnabled') && getFieldError('superteamEnabled'),
      superteamEventCount:
        isFieldTouched('superteamEventCount') &&
        getFieldError('superteamEventCount'),
      superteamBonus:
        isFieldTouched('superteamBonus') && getFieldError('superteamBonus'),
      superteamWinning:
        isFieldTouched('superteamWinning') && getFieldError('superteamWinning'),
      superteamToken:
        isFieldTouched('superteamToken') && getFieldError('superteamToken'),
      countryCode:
        isFieldTouched('countryCode') && getFieldError('superteamToken')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
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
                {/* LOGIN REWARDS */}
                <Card title="Login Rewards" type="inner">
                  <FormItem
                    validateStatus={errors.loginId ? 'error' : ''}
                    help={errors.loginId || ''}
                    {...formItemLayout}
                    label={'Login Rewards Id'}
                  >
                    {getFieldDecorator('loginId', {
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ],
                      initialValue: this.state.loginRewards.id
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.loginTitle ? 'error' : ''}
                    help={errors.loginTitle || ''}
                    {...formItemLayout}
                    label={'Login Rewards Title'}
                  >
                    {getFieldDecorator('loginTitle', {
                      initialValue: this.state.loginRewards.title,
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
                    validateStatus={errors.loginSubTitle ? 'error' : ''}
                    help={errors.loginSubTitle || ''}
                    {...formItemLayout}
                    label={'Login Rewards Sub Title'}
                  >
                    {getFieldDecorator('loginSubTitle', {
                      initialValue: this.state.loginRewards.subTitle,
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
                    validateStatus={errors.loginReward ? 'error' : ''}
                    help={errors.loginReward || ''}
                    {...formItemLayout}
                    label={'Login Rewards Reward'}
                  >
                    {getFieldDecorator('loginReward', {
                      initialValue: this.state.loginRewards.reward,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'Login Rewards Enabled'}>
                    {getFieldDecorator('loginEnabled', {
                      initialValue: this.state.loginRewards.enabled,
                      rules: [
                        {
                          required: true,
                          message: 'Please select an option',
                          whitespace: false,
                          type: 'boolean'
                        }
                      ]
                      // initialValue: this.state.isGuaranteed
                    })(
                      <RadioGroup size="small" buttonStyle="solid">
                        <RadioButton value={true}>Yes</RadioButton>
                        <RadioButton value={false}>No</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.loginBonus ? 'error' : ''}
                    help={errors.loginBonus || ''}
                    {...formItemLayout}
                    label={'Login Rewards Bonus'}
                  >
                    {getFieldDecorator('loginBonus', {
                      initialValue: this.getWinning('loginRewards', 'Bonus'),
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
                    validateStatus={errors.loginWinning ? 'error' : ''}
                    help={errors.loginWinning || ''}
                    {...formItemLayout}
                    label={'Login Rewards Winning'}
                  >
                    {getFieldDecorator('loginWinning', {
                      initialValue: this.getWinning('loginRewards', 'Winning'),
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
                    validateStatus={errors.loginToken ? 'error' : ''}
                    help={errors.loginToken || ''}
                    {...formItemLayout}
                    label={'Login Rewards Token'}
                  >
                    {getFieldDecorator('loginToken', {
                      initialValue: this.getWinning('loginRewards', 'Token'),
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
                    validateStatus={errors.loginDeposit ? 'error' : ''}
                    help={errors.loginDeposit || ''}
                    {...formItemLayout}
                    label={'Login Rewards Deposit'}
                  >
                    {getFieldDecorator('loginDeposit', {
                      initialValue: this.getWinning('loginRewards', 'Deposit'),
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
                    validateStatus={errors.loginEventCount ? 'error' : ''}
                    help={errors.loginEventCount || ''}
                    {...formItemLayout}
                    label={'Login Rewards Event Count'}
                  >
                    {getFieldDecorator('loginEventCount', {
                      initialValue: this.state.loginRewards.eventCount,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          type: 'number'
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                  {this.state.loadLoginImageUrl && (
                    <ImageUploader
                      callbackFromParent={this.getLoginImageUrl}
                      header={'Login Image URL'}
                      previewImage={this.state.previewLoginImageUrl}
                      fileList={this.state.loginImageUrlFileList}
                      isMandatory={true}
                    />
                  )}
                </Card>
                {/* PLAY X REWARDS */}
                <Card title="Play X Games" type="inner">
                  <FormItem
                    validateStatus={errors.playId ? 'error' : ''}
                    help={errors.playId || ''}
                    {...formItemLayout}
                    label={'Play X Games Id'}
                  >
                    {getFieldDecorator('playId', {
                      initialValue: this.state.playXGames.id,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.playTitle ? 'error' : ''}
                    help={errors.playTitle || ''}
                    {...formItemLayout}
                    label={'Play X Games Title'}
                  >
                    {getFieldDecorator('playTitle', {
                      initialValue: this.state.playXGames.title,
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
                    validateStatus={errors.playSubTitle ? 'error' : ''}
                    help={errors.playSubTitle || ''}
                    {...formItemLayout}
                    label={'Play X Games Sub Title'}
                  >
                    {getFieldDecorator('playSubTitle', {
                      initialValue: this.state.playXGames.subTitle,
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
                    validateStatus={errors.playReward ? 'error' : ''}
                    help={errors.playReward || ''}
                    {...formItemLayout}
                    label={'Play X Games Reward'}
                  >
                    {getFieldDecorator('playReward', {
                      initialValue: this.state.playXGames.reward,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'Play X Games Enabled'}>
                    {getFieldDecorator('playEnabled', {
                      initialValue: this.state.playXGames.enabled,
                      rules: [
                        {
                          required: true,
                          message: 'Please select an option',
                          whitespace: false,
                          type: 'boolean'
                        }
                      ]
                      // initialValue: this.state.isGuaranteed
                    })(
                      <RadioGroup size="small" buttonStyle="solid">
                        <RadioButton value={true}>Yes</RadioButton>
                        <RadioButton value={false}>No</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.playBonus ? 'error' : ''}
                    help={errors.playBonus || ''}
                    {...formItemLayout}
                    label={'Play Rewards Bonus'}
                  >
                    {getFieldDecorator('playBonus', {
                      initialValue: this.getWinning('playXGames', 'Bonus'),
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
                    validateStatus={errors.playWinning ? 'error' : ''}
                    help={errors.playWinning || ''}
                    {...formItemLayout}
                    label={'Play Rewards Winning'}
                  >
                    {getFieldDecorator('playWinning', {
                      initialValue: this.getWinning('playXGames', 'Winning'),
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
                    validateStatus={errors.playToken ? 'error' : ''}
                    help={errors.playToken || ''}
                    {...formItemLayout}
                    label={'Play Rewards Token'}
                  >
                    {getFieldDecorator('playToken', {
                      initialValue: this.getWinning('playXGames', 'Token'),
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
                    validateStatus={errors.playDeposit ? 'error' : ''}
                    help={errors.playDeposit || ''}
                    {...formItemLayout}
                    label={'Play Rewards Deposit'}
                  >
                    {getFieldDecorator('playDeposit', {
                      initialValue: this.getWinning('playXGames', 'Deposit'),
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
                    validateStatus={errors.playEventCount ? 'error' : ''}
                    help={errors.playEventCount || ''}
                    {...formItemLayout}
                    label={'Play X Games Event Count'}
                  >
                    {getFieldDecorator('playEventCount', {
                      initialValue: this.state.playXGames.eventCount,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          type: 'number'
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                  {this.state.loadPlayImageUrl && (
                    <ImageUploader
                      callbackFromParent={this.getPlayImageUrl}
                      header={'Play Image URL'}
                      previewImage={this.state.previewPlayImageUrl}
                      fileList={this.state.playImageUrlFileList}
                      isMandatory={true}
                    />
                  )}
                </Card>
                {/* DEPOSIT MONEY */}
                <Card title="Deposit Money" type="inner">
                  <FormItem
                    validateStatus={errors.playId ? 'error' : ''}
                    help={errors.playId || ''}
                    {...formItemLayout}
                    label={'Deposit Money Id'}
                  >
                    {getFieldDecorator('depositId', {
                      initialValue: this.state.depositMoney.id,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(<Input disabled />)}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.depositTitle ? 'error' : ''}
                    help={errors.depositTitle || ''}
                    {...formItemLayout}
                    label={'Deposit Money Title'}
                  >
                    {getFieldDecorator('depositTitle', {
                      initialValue: this.state.depositMoney.title,
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
                    validateStatus={errors.depositSubTitle ? 'error' : ''}
                    help={errors.depositSubTitle || ''}
                    {...formItemLayout}
                    label={'Deposit Money Sub Title'}
                  >
                    {getFieldDecorator('depositSubTitle', {
                      initialValue: this.state.depositMoney.subTitle,
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
                    validateStatus={errors.depositReward ? 'error' : ''}
                    help={errors.depositReward || ''}
                    {...formItemLayout}
                    label={'Deposit Money Reward'}
                  >
                    {getFieldDecorator('depositReward', {
                      initialValue: this.state.depositMoney.reward,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={'Deposit Money Enabled'}>
                    {getFieldDecorator('depositEnabled', {
                      initialValue: this.state.depositMoney.enabled,
                      rules: [
                        {
                          required: true,
                          message: 'Please select an option',
                          whitespace: false,
                          type: 'boolean'
                        }
                      ]
                      // initialValue: this.state.isGuaranteed
                    })(
                      <RadioGroup size="small" buttonStyle="solid">
                        <RadioButton value={true}>Yes</RadioButton>
                        <RadioButton value={false}>No</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={errors.depositBonus ? 'error' : ''}
                    help={errors.depositBonus || ''}
                    {...formItemLayout}
                    label={'Deposit Rewards Bonus'}
                  >
                    {getFieldDecorator('depositBonus', {
                      initialValue: this.getWinning('depositMoney', 'Bonus'),
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
                    validateStatus={errors.depositWinning ? 'error' : ''}
                    help={errors.depositWinning || ''}
                    {...formItemLayout}
                    label={'Deposit Rewards Winning'}
                  >
                    {getFieldDecorator('depositWinning', {
                      initialValue: this.getWinning('depositMoney', 'Winning'),
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
                    validateStatus={errors.depositToken ? 'error' : ''}
                    help={errors.depositToken || ''}
                    {...formItemLayout}
                    label={'Deposit Rewards Token'}
                  >
                    {getFieldDecorator('depositToken', {
                      initialValue: this.getWinning('depositMoney', 'Token'),
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
                    validateStatus={errors.depositDeposit ? 'error' : ''}
                    help={errors.depositDeposit || ''}
                    {...formItemLayout}
                    label={'Deposit Rewards Deposit'}
                  >
                    {getFieldDecorator('depositDeposit', {
                      initialValue: this.getWinning('depositMoney', 'Deposit'),
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
                    validateStatus={errors.depositEventCount ? 'error' : ''}
                    help={errors.depositEventCount || ''}
                    {...formItemLayout}
                    label={'Deposit Money Event Count'}
                  >
                    {getFieldDecorator('depositEventCount', {
                      initialValue: this.state.depositMoney.eventCount,
                      rules: [
                        {
                          required: true,
                          message: 'This is a mandatory field!',
                          type: 'number'
                        }
                      ]
                    })(<InputNumber min={0} />)}
                  </FormItem>
                  {this.state.loadDepositImageUrl && (
                    <ImageUploader
                      callbackFromParent={this.getDepositImageUrl}
                      header={'Deposit Image URL'}
                      previewImage={this.state.previewDepositImageUrl}
                      fileList={this.state.depositImageUrlFileList}
                      isMandatory={true}
                    />
                  )}
                </Card>
                <Card title="Notifications">
                  <Card title="LOGIN_REWARDS" type="inner">
                    <FormItem
                      {...formItemLayout}
                      label={'Login Rewards Enabled'}
                    >
                      {getFieldDecorator('loginEnabled', {
                        initialValue: this.state.loginRewards.enabled,
                        rules: [
                          {
                            required: true,
                            message: 'Please select an option',
                            whitespace: false,
                            type: 'boolean'
                          }
                        ]
                        // initialValue: this.state.isGuaranteed
                      })(
                        <RadioGroup size="small" buttonStyle="solid">
                          <RadioButton value={true}>Yes</RadioButton>
                          <RadioButton value={false}>No</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Card>
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

function mapStateToProps(state, ownProps) {
  return {
    getReferralBackendResponse: state.referralConfig.getReferralBackendResponse,
    setReferralBackendResponse: state.referralConfig.setReferralBackendResponse,
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
const BackendConfigForm = Form.create()(BackendConfig);
export default connect(mapStateToProps, mapDispatchToProps)(BackendConfigForm);
