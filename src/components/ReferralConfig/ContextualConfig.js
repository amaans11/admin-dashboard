import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as referralConfigActions from '../../actions/referralConfigActions';
import * as websiteActions from '../../actions/websiteActions';
import { Card, Select, Form, Button, Input, message, Row, Col } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const OsTypeList = [
  <Option key="ANDROID" value="ANDROID">
    ANDROID
  </Option>,
  <Option key="IOS" value="IOS">
    IOS
  </Option>
];

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class ContextualConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      countrySelected: false,
      friendsConfigsJsonCheck: true,
      osType: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  selectCountry(value) {
    this.setState({
      countryCode: value,
      fetched: false,
      countrySelected: true,
      osType: undefined
    });
  }

  selectOsType(value) {
    this.setState(
      {
        osType: value,
        fetched: false
      },
      () => {
        this.getContextualConfigs();
      }
    );
  }

  getContextualConfigs() {
    let data = {
      countryCode: this.state.countryCode,
      osType: this.state.osType
    };
    this.props.actions.getReferralFrontendConfig(data).then(() => {
      if (this.props.getReferralFrontendResponse) {
        let config =
          JSON.parse(this.props.getReferralFrontendResponse).config || {};
        this.setState({
          friendsConfigs: config['friends.configs']
            ? JSON.stringify(config['friends.configs'])
            : '',
          fantasyUgcShareText: config['fantasy.ugc.shareText'],
          fantasyUgcShareImage: config['fantasy.ugc.shareImage'],
          uiTournamentShareText: config['ui.tournament.shareText'],
          uiTournamentShareImage: config['ui.tournament.shareImage'],
          uiLobbyShareText: config['ui.lobby.shareText'],
          uiLobbyShareImage: config['ui.lobby.shareImage'],
          uiUgtShareText: config['ui.ugt.shareText'],
          uiUgtShareImage: config['ui.ugt.shareImage'],
          uiContestShareText: config['ui.contest.shareText'],
          referralHowitworksBullets: config['referral.howitworks.bullets'],
          referralWalletSubtitleString:
            config['referral.wallet.subtitleString'],
          referralWidgetText: config['referral.widget.text'],
          referralV85GeneralShareMessage:
            config['referralV85.general.share.message'],
          referralV85GeneralShareMessageHindi:
            config['referralV85.general.share.message.hindi'],
          referralLocalShareImageWaGeneral:
            config['referral.localShareImage.wa.general'],
          referralLocalShareImageWaGeneralHindi:
            config['referral.localShareImage.wa.general.hindi'],
          referralLocalShareImageWaWinner:
            config['referral.localShareImage.wa.winner'],
          fetched: true
        });
      }
    });
  }

  jsonCheck(value) {
    if (value) {
      try {
        JSON.parse(value);
        this.setState({ friendsConfigsJsonCheck: true });
        return true;
      } catch (error) {
        this.setState({ friendsConfigsJsonCheck: false });
        return false;
      }
    } else {
      this.setState({ friendsConfigsJsonCheck: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.state.friendsConfigsJsonCheck) {
          message.error('Invlaid JSON');
          return;
        }

        let data = {
          osType: this.state.osType,
          countryCode: this.state.countryCode,
          friendsConfigs: JSON.parse(values.friendsConfigs),
          fantasyUgcShareText: values.fantasyUgcShareText,
          fantasyUgcShareImage: values.fantasyUgcShareImage,
          uiTournamentShareText: values.uiTournamentShareText,
          uiTournamentShareImage: values.uiTournamentShareImage,
          uiLobbyShareText: values.uiLobbyShareText,
          uiLobbyShareImage: values.uiLobbyShareImage,
          uiUgtShareText: values.uiUgtShareText,
          uiUgtShareImage: values.uiUgtShareImage,
          uiContestShareText: values.uiContestShareText,
          referralHowitworksBullets: values.referralHowitworksBullets,
          referralWalletSubtitleString: values.referralWalletSubtitleString,
          referralWidgetText: values.referralWidgetText,
          referralV85GeneralShareMessage: values.referralV85GeneralShareMessage,
          referralV85GeneralShareMessageHindi:
            values.referralV85GeneralShareMessageHindi,
          referralLocalShareImageWaGeneral:
            values.referralLocalShareImageWaGeneral,
          referralLocalShareImageWaGeneralHindi:
            values.referralLocalShareImageWaGeneralHindi,
          referralLocalShareImageWaWinner:
            values.referralLocalShareImageWaWinner
        };
        this.props.actions.setContextualConfig(data).then(() => {
          if (this.props.setContextualConfigResponse) {
            if (this.props.setContextualConfigResponse.error) {
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
      osType: getFieldError('osType'),
      friendsConfigs:
        isFieldTouched('friendsConfigs') && getFieldError('friendsConfigs'),
      fantasyUgcShareText:
        isFieldTouched('fantasyUgcShareText') &&
        getFieldError('fantasyUgcShareText'),
      fantasyUgcShareImage:
        isFieldTouched('fantasyUgcShareImage') &&
        getFieldError('fantasyUgcShareImage'),
      uiTournamentShareText:
        isFieldTouched('uiTournamentShareText') &&
        getFieldError('uiTournamentShareText'),
      uiTournamentShareImage:
        isFieldTouched('uiTournamentShareImage') &&
        getFieldError('uiTournamentShareImage'),
      uiLobbyShareText:
        isFieldTouched('uiLobbyShareText') && getFieldError('uiLobbyShareText'),
      uiLobbyShareImage:
        isFieldTouched('uiLobbyShareImage') &&
        getFieldError('uiLobbyShareImage'),
      uiUgtShareText:
        isFieldTouched('uiUgtShareText') && getFieldError('uiUgtShareText'),
      uiUgtShareImage:
        isFieldTouched('uiUgtShareImage') && getFieldError('uiUgtShareImage'),
      uiContestShareText:
        isFieldTouched('uiContestShareText') &&
        getFieldError('uiContestShareText'),
      referralHowitworksBullets:
        isFieldTouched('referralHowitworksBullets') &&
        getFieldError('referralHowitworksBullets'),
      referralWalletSubtitleString:
        isFieldTouched('referralWalletSubtitleString') &&
        getFieldError('referralWalletSubtitleString'),
      referralWidgetText:
        isFieldTouched('referralWidgetText') &&
        getFieldError('referralWidgetText'),
      referralV85GeneralShareMessage:
        isFieldTouched('referralV85GeneralShareMessage') &&
        getFieldError('referralV85GeneralShareMessage'),
      referralV85GeneralShareMessageHindi:
        isFieldTouched('referralV85GeneralShareMessageHindi') &&
        getFieldError('referralV85GeneralShareMessageHindi'),
      referralLocalShareImageWaGeneral:
        isFieldTouched('referralLocalShareImageWaGeneral') &&
        getFieldError('referralLocalShareImageWaGeneral'),
      referralLocalShareImageWaGeneralHindi:
        isFieldTouched('referralLocalShareImageWaGeneralHindi') &&
        getFieldError('referralLocalShareImageWaGeneralHindi'),
      referralLocalShareImageWaWinner:
        isFieldTouched('referralLocalShareImageWaWinner') &&
        getFieldError('referralLocalShareImageWaWinner')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Referral Frontend Config">
            <Card title="Select Country" type="inner">
              <Row>
                <Col span={6}>Country</Col>
                <Col span={18}>
                  <Select
                    showSearch
                    onSelect={e => this.selectCountry(e)}
                    style={{ width: 200 }}
                    placeholder="Select a country"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {CountryList}
                  </Select>
                </Col>
              </Row>
            </Card>
            {this.state.countrySelected && (
              <Card title="Select Os Type" type="inner">
                <Row>
                  <Col span={6}>Os Type</Col>
                  <Col span={18}>
                    <Select
                      showSearch
                      allowClear={true}
                      onSelect={e => this.selectOsType(e)}
                      style={{ width: 200 }}
                      placeholder="Select a os type"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      value={this.state.osType}
                    >
                      {OsTypeList}
                    </Select>
                  </Col>
                </Row>
              </Card>
            )}

            {this.state.fetched && (
              <Card title="Contextual Configs" type="inner">
                <FormItem
                  validateStatus={
                    errors.friendsConfigs || !this.state.friendsConfigsJsonCheck
                      ? 'error'
                      : ''
                  }
                  help={errors.friendsConfigs || ''}
                  {...formItemLayout}
                  label={'friends.configs'}
                >
                  {getFieldDecorator('friendsConfigs', {
                    initialValue: this.state.friendsConfigs,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field!',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      rows={3}
                      onBlur={e => this.jsonCheck(e.target.value)}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.fantasyUgcShareText ? 'error' : ''}
                  help={errors.fantasyUgcShareText || ''}
                  {...formItemLayout}
                  label={'fantasy.ugc.shareText'}
                >
                  {getFieldDecorator('fantasyUgcShareText', {
                    initialValue: this.state.fantasyUgcShareText,
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
                  validateStatus={errors.fantasyUgcShareImage ? 'error' : ''}
                  help={errors.fantasyUgcShareImage || ''}
                  {...formItemLayout}
                  label={'fantasy.ugc.shareImage'}
                >
                  {getFieldDecorator('fantasyUgcShareImage', {
                    initialValue: this.state.fantasyUgcShareImage,
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
                  validateStatus={errors.uiTournamentShareText ? 'error' : ''}
                  help={errors.uiTournamentShareText || ''}
                  {...formItemLayout}
                  label={'ui.tournament.shareText'}
                >
                  {getFieldDecorator('uiTournamentShareText', {
                    initialValue: this.state.uiTournamentShareText,
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
                  validateStatus={errors.uiTournamentShareImage ? 'error' : ''}
                  help={errors.uiTournamentShareImage || ''}
                  {...formItemLayout}
                  label={'ui.tournament.shareImage'}
                >
                  {getFieldDecorator('uiTournamentShareImage', {
                    initialValue: this.state.uiTournamentShareImage,
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
                  validateStatus={errors.uiLobbyShareText ? 'error' : ''}
                  help={errors.uiLobbyShareText || ''}
                  {...formItemLayout}
                  label={'ui.lobby.shareText'}
                >
                  {getFieldDecorator('uiLobbyShareText', {
                    initialValue: this.state.uiLobbyShareText,
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
                  validateStatus={errors.uiLobbyShareImage ? 'error' : ''}
                  help={errors.uiLobbyShareImage || ''}
                  {...formItemLayout}
                  label={'ui.lobby.shareImage'}
                >
                  {getFieldDecorator('uiLobbyShareImage', {
                    initialValue: this.state.uiLobbyShareImage,
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
                  validateStatus={errors.uiUgtShareText ? 'error' : ''}
                  help={errors.uiUgtShareText || ''}
                  {...formItemLayout}
                  label={'ui.ugt.shareText'}
                >
                  {getFieldDecorator('uiUgtShareText', {
                    initialValue: this.state.uiUgtShareText,
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
                  validateStatus={errors.uiUgtShareImage ? 'error' : ''}
                  help={errors.uiUgtShareImage || ''}
                  {...formItemLayout}
                  label={'ui.ugt.shareImage'}
                >
                  {getFieldDecorator('uiUgtShareImage', {
                    initialValue: this.state.uiUgtShareImage,
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
                  validateStatus={errors.uiContestShareText ? 'error' : ''}
                  help={errors.uiContestShareText || ''}
                  {...formItemLayout}
                  label={'ui.contest.shareText'}
                >
                  {getFieldDecorator('uiContestShareText', {
                    initialValue: this.state.uiContestShareText,
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
                  })(<Input />)}
                </FormItem>
                <FormItem
                  validateStatus={
                    errors.referralWalletSubtitleString ? 'error' : ''
                  }
                  help={errors.referralWalletSubtitleString || ''}
                  {...formItemLayout}
                  label={'referral.wallet.subtitleString'}
                >
                  {getFieldDecorator('referralWalletSubtitleString', {
                    initialValue: this.state.referralWalletSubtitleString,
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
                    errors.referralV85GeneralShareMessage ? 'error' : ''
                  }
                  help={errors.referralV85GeneralShareMessage || ''}
                  {...formItemLayout}
                  label={'referralV85.general.share.message'}
                >
                  {getFieldDecorator('referralV85GeneralShareMessage', {
                    initialValue: this.state.referralV85GeneralShareMessage,
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
                    errors.referralV85GeneralShareMessageHindi ? 'error' : ''
                  }
                  help={errors.referralV85GeneralShareMessageHindi || ''}
                  {...formItemLayout}
                  label={'referralV85.general.share.message.hindi'}
                >
                  {getFieldDecorator('referralV85GeneralShareMessageHindi', {
                    initialValue: this.state
                      .referralV85GeneralShareMessageHindi,
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
                    errors.referralLocalShareImageWaGeneral ? 'error' : ''
                  }
                  help={errors.referralLocalShareImageWaGeneral || ''}
                  {...formItemLayout}
                  label={'referral.localShareImage.wa.general'}
                >
                  {getFieldDecorator('referralLocalShareImageWaGeneral', {
                    initialValue: this.state.referralLocalShareImageWaGeneral,
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
                    errors.referralLocalShareImageWaGeneralHindi ? 'error' : ''
                  }
                  help={errors.referralLocalShareImageWaGeneralHindi || ''}
                  {...formItemLayout}
                  label={'referral.localShareImage.wa.general.hindi'}
                >
                  {getFieldDecorator('referralLocalShareImageWaGeneralHindi', {
                    initialValue: this.state
                      .referralLocalShareImageWaGeneralHindi,
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
                    errors.referralLocalShareImageWaWinner ? 'error' : ''
                  }
                  help={errors.referralLocalShareImageWaWinner || ''}
                  {...formItemLayout}
                  label={'referral.localShareImage.wa.winner'}
                >
                  {getFieldDecorator('referralLocalShareImageWaWinner', {
                    initialValue: this.state.referralLocalShareImageWaWinner,
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
    setContextualConfigResponse:
      state.referralConfig.setContextualConfigResponse,
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
const ContextualConfigForm = Form.create()(ContextualConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextualConfigForm);
