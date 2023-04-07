import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as referralConfigActions from '../../actions/referralConfigActions';
import { Card, Select, Form, Button, Input, message, Row, Col } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const appTypeList = [
  <Option key="CASH" value="cash">
    Cash
  </Option>,
  <Option key="PS" value="play-store">
    Play Store
  </Option>,
  <Option key="IOS" value="ios">
    IOS
  </Option>,
  <Option key="PHONEPE" value="phone-pe">
    Phone pe
  </Option>
];

class FrontendConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      rootSignupBonusCurrency: null,
      rootSignupBonusCash: null,
      rootSignupBonusToken: null,
      referralJoiningBonusCash: null,
      referralJoiningBonusToken: null,
      referralNewUserBonusCash: null,
      referralNewUserBonusToken: null,
      referbannerTournamentlistEnabled: null,
      referralEarningShowTotal: null,
      referralShowBanner: null,
      referralTournamentIndex: null,
      referralContestListShow: null,
      referralContestIndex: null,
      referralCondition: null,
      referralWidgetText: null,
      referralHowitworksBullets: null,
      referralRewardTitleString: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.appTypeSelect = this.appTypeSelect.bind(this);
  }

  appTypeSelect(e) {
    let data = {
      appType: e
    };
    this.props.actions.getReferralFrontendConfig(data).then(() => {
      if (this.props.getReferralFrontendResponse) {
        let config = JSON.parse(this.props.getReferralFrontendResponse).config;
        this.setState({
          rootSignupBonusCurrency: config['root.signupBonus.currency'],
          rootSignupBonusCash: config['root.signupBonus.cash'],
          rootSignupBonusToken: config['root.signupBonus.token'],
          referralJoiningBonusCash: config['referral.joiningBonus.cash'],
          referralJoiningBonusToken: config['referral.joiningBonus.token'],
          referralNewUserBonusCash: config['referral.newUserBonus.cash'],
          referralNewUserBonusToken: config['referral.newUserBonus.token'],
          referbannerTournamentlistEnabled:
            config['referbanner.tournamentlist.enabled'],
          referralEarningShowTotal: config['referral.earning.showTotal'],
          referralShowBanner: config['referral.showBanner'],
          referralTournamentIndex: config['referral.tournamentIndex'],
          referralContestListShow: config['referral.contestListShow'],
          referralContestIndex: config['referral.contestIndex'],
          referralCondition: config['referral.condition'],
          referralWidgetText: config['referral.widget.text'],
          referralHowitworksBullets: config['referral.howitworks.bullets'],
          referralRewardTitleString: config['referral.reward.titleString'],
          fetched: true
        });
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = { ...values };
        this.props.actions.setReferralFrontendConfig(data).then(() => {
          if (this.props.setReferralFrontendResponse) {
            if (this.props.setReferralFrontendResponse.error) {
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
      applyToApps: getFieldError('applyToApps'),
      rootSignupBonusCurrency:
        isFieldTouched('rootSignupBonusCurrency') &&
        getFieldError('rootSignupBonusCurrency'),
      rootSignupBonusCash:
        isFieldTouched('rootSignupBonusCash') &&
        getFieldError('rootSignupBonusCash'),
      rootSignupBonusToken:
        isFieldTouched('rootSignupBonusToken') &&
        getFieldError('rootSignupBonusToken'),
      referralJoiningBonusCash:
        isFieldTouched('referralJoiningBonusCash') &&
        getFieldError('referralJoiningBonusCash'),
      referralJoiningBonusToken:
        isFieldTouched('referralJoiningBonusToken') &&
        getFieldError('referralJoiningBonusToken'),
      referralNewUserBonusCash:
        isFieldTouched('referralNewUserBonusCash') &&
        getFieldError('referralJoiningBonusToken'),
      referralNewUserBonusToken:
        isFieldTouched('referralNewUserBonusToken') &&
        getFieldError('referralNewUserBonusToken'),
      referbannerTournamentlistEnabled:
        isFieldTouched('referbannerTournamentlistEnabled') &&
        getFieldError('referbannerTournamentlistEnabled'),
      referralEarningShowTotal:
        isFieldTouched('referralEarningShowTotal') &&
        getFieldError('referralEarningShowTotal'),
      referralShowBanner:
        isFieldTouched('referralShowBanner') &&
        getFieldError('referralShowBanner'),
      referralTournamentIndex:
        isFieldTouched('referralTournamentIndex') &&
        getFieldError('referralTournamentIndex'),
      referralContestListShow:
        isFieldTouched('referralContestListShow') &&
        getFieldError('referralContestListShow'),
      referralContestIndex:
        isFieldTouched('referralContestIndex') &&
        getFieldError('referralContestIndex'),
      referralCondition:
        isFieldTouched('referralCondition') &&
        getFieldError('referralCondition'),
      referralWidgetText:
        isFieldTouched('referralWidgetText') &&
        getFieldError('referralWidgetText'),
      referralHowitworksBullets:
        isFieldTouched('referralHowitworksBullets') &&
        getFieldError('referralHowitworksBullets'),
      referralRewardTitleString:
        isFieldTouched('referralRewardTitleString') &&
        getFieldError('referralRewardTitleString')
      //
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Referral Frontend Config">
            <Card title="Select App to Fetch Current Config" type="inner">
              <Row>
                <Col span={6}>App Type</Col>
                <Col span={18}>
                  <Select
                    showSearch
                    onSelect={this.appTypeSelect}
                    style={{ width: 200 }}
                    placeholder="Select a App Type"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {appTypeList}
                  </Select>
                </Col>
              </Row>
            </Card>
            {this.state.fetched && (
              <Card title="Frontend Configs" type="inner">
                <FormItem
                  validateStatus={errors.applyToApps ? 'error' : ''}
                  help={errors.applyToApps || ''}
                  {...formItemLayout}
                  label={'Apply To Apps'}
                >
                  {getFieldDecorator('applyToApps', {
                    rules: [
                      {
                        required: true,
                        type: 'array',
                        message: 'Apps field is mandatory',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      showSearch
                      style={{ width: '70%' }}
                      placeholder="Applicable apps ( Select multiple )"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {appTypeList}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.rootSignupBonusCurrency ? 'error' : ''}
                  help={errors.rootSignupBonusCurrency || ''}
                  {...formItemLayout}
                  label={'root.signupBonus.currency'}
                >
                  {getFieldDecorator('rootSignupBonusCurrency', {
                    initialValue: this.state.rootSignupBonusCurrency,
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
                  validateStatus={errors.rootSignupBonusCash ? 'error' : ''}
                  help={errors.rootSignupBonusCash || ''}
                  {...formItemLayout}
                  label={'root.signupBonus.cash'}
                >
                  {getFieldDecorator('rootSignupBonusCash', {
                    initialValue: this.state.rootSignupBonusCash,
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
                  validateStatus={errors.rootSignupBonusToken ? 'error' : ''}
                  help={errors.rootSignupBonusToken || ''}
                  {...formItemLayout}
                  label={'root.signupBonus.token'}
                >
                  {getFieldDecorator('rootSignupBonusToken', {
                    initialValue: this.state.rootSignupBonusToken,
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
                    errors.referralJoiningBonusCash ? 'error' : ''
                  }
                  help={errors.referralJoiningBonusCash || ''}
                  {...formItemLayout}
                  label={'referral.joiningBonus.cash'}
                >
                  {getFieldDecorator('referralJoiningBonusCash', {
                    initialValue: this.state.referralJoiningBonusCash,
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
                    errors.referralJoiningBonusToken ? 'error' : ''
                  }
                  help={errors.referralJoiningBonusToken || ''}
                  {...formItemLayout}
                  label={'referral.joiningBonus.token'}
                >
                  {getFieldDecorator('referralJoiningBonusToken', {
                    initialValue: this.state.referralJoiningBonusToken,
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
                    errors.referralNewUserBonusCash ? 'error' : ''
                  }
                  help={errors.referralNewUserBonusCash || ''}
                  {...formItemLayout}
                  label={'referral.newUserBonus.cash'}
                >
                  {getFieldDecorator('referralNewUserBonusCash', {
                    initialValue: this.state.referralNewUserBonusCash,
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
                    errors.referralNewUserBonusToken ? 'error' : ''
                  }
                  help={errors.referralNewUserBonusToken || ''}
                  {...formItemLayout}
                  label={'referral.newUserBonus.token'}
                >
                  {getFieldDecorator('referralNewUserBonusToken', {
                    initialValue: this.state.referralNewUserBonusToken,
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
                    errors.referbannerTournamentlistEnabled ? 'error' : ''
                  }
                  help={errors.referbannerTournamentlistEnabled || ''}
                  {...formItemLayout}
                  label={'referbanner.tournamentlist.enabled'}
                >
                  {getFieldDecorator('referbannerTournamentlistEnabled', {
                    initialValue: this.state.referbannerTournamentlistEnabled,
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
                    errors.referralEarningShowTotal ? 'error' : ''
                  }
                  help={errors.referralEarningShowTotal || ''}
                  {...formItemLayout}
                  label={'referral.earning.showTotal'}
                >
                  {getFieldDecorator('referralEarningShowTotal', {
                    initialValue: this.state.referralEarningShowTotal,
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
                  validateStatus={errors.referralShowBanner ? 'error' : ''}
                  help={errors.referralShowBanner || ''}
                  {...formItemLayout}
                  label={'referral.showBanner'}
                >
                  {getFieldDecorator('referralShowBanner', {
                    initialValue: this.state.referralShowBanner,
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
                  validateStatus={errors.referralTournamentIndex ? 'error' : ''}
                  help={errors.referralTournamentIndex || ''}
                  {...formItemLayout}
                  label={'referral.tournamentIndex'}
                >
                  {getFieldDecorator('referralTournamentIndex', {
                    initialValue: this.state.referralTournamentIndex,
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
                  validateStatus={errors.referralContestListShow ? 'error' : ''}
                  help={errors.referralContestListShow || ''}
                  {...formItemLayout}
                  label={'referral.contestListShow'}
                >
                  {getFieldDecorator('referralContestListShow', {
                    initialValue: this.state.referralContestListShow,
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
                  validateStatus={errors.referralContestIndex ? 'error' : ''}
                  help={errors.referralContestIndex || ''}
                  {...formItemLayout}
                  label={'referral.contestIndex'}
                >
                  {getFieldDecorator('referralContestIndex', {
                    initialValue: this.state.referralContestIndex,
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
                  validateStatus={errors.referralCondition ? 'error' : ''}
                  help={errors.referralCondition || ''}
                  {...formItemLayout}
                  label={'referral.condition'}
                >
                  {getFieldDecorator('referralCondition', {
                    initialValue: this.state.referralCondition,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem>
                <FormItem
                  validateStatus={errors.referralWidgetText ? 'error' : ''}
                  help={errors.referralWidgetText || ''}
                  {...formItemLayout}
                  label={'referral.widget.text'}
                >
                  {getFieldDecorator('referralWidgetText', {
                    initialValue: this.state.referralWidgetText,
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
                    errors.referralHowitworksBullets ? 'error' : ''
                  }
                  help={errors.referralHowitworksBullets || ''}
                  {...formItemLayout}
                  label={'referral.howitworks.bullets'}
                >
                  {getFieldDecorator('referralHowitworksBullets', {
                    initialValue: this.state.referralHowitworksBullets,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<TextArea autosize={{ minRows: 3, maxRows: 6 }} />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.referralRewardTitleString ? 'error' : ''
                  }
                  help={errors.referralRewardTitleString || ''}
                  {...formItemLayout}
                  label={'referral.reward.titleString'}
                >
                  {getFieldDecorator('referralRewardTitleString', {
                    initialValue: this.state.referralRewardTitleString,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
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
              </Card>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    getReferralFrontendResponse:
      state.referralConfig.getReferralFrontendResponse,
    setReferralFrontendResponse:
      state.referralConfig.setReferralFrontendResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...referralConfigActions }, dispatch)
  };
}
const FrontendConfigForm = Form.create()(FrontendConfig);
export default connect(mapStateToProps, mapDispatchToProps)(FrontendConfigForm);
