import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as footballActions from '../../actions/FootballActions';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import {
  Card,
  Form,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  Icon,
  Button,
  Row,
  Col,
  notification,
  message,
  Input,
  Checkbox
} from 'antd';
import ImageUploader from './ImageUploader';
import _ from 'lodash';
import * as websiteActions from '../../actions/websiteActions';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class CreateMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league: null,
      name: null, // String
      startTime: null, // datetime
      foreshadowTime: null, // Integer
      hardStopTime: null, // Integer
      teamLimit: null, // Integer
      matchDropdownList: [],
      autoFinish: true,
      existingLeagueConfigs: [],
      loading: false,
      isActive: false,
      isInvalidJson: false,
      noEligibleMatch: false,
      editFlag: false,
      createDefaultContests: false,
      orderId: 10,
      masterOptionList: [],
      segmentOptionList: [],
      seasonPassOptionList: [],
      isRakeBack: false,
      editOnlyMessage: false,
      checkedValues: [],
      countryListFetched: false,
      listBannerImage: '',
      loadImage: false,
      imageLoading: false,
      detailBannerImage: '',
      detailBannerLoadImage: false,
      detailBannerImageLoading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.validateJson = this.validateJson.bind(this);
    this.getAllMasterContestType = this.getAllMasterContestType.bind(this);
    this.getAllSegmentType = this.getAllSegmentType.bind(this);
    this.getAllSeasonPass = this.getAllSeasonPass.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.getAllMasterContestType();
    this.getAllSegmentType();
    this.getCountryCode();
    this.getAllSeasonPass();
    let inputData = {
      type: '-1'
    };
    let list = [];
    // Fetch existing configurations
    this.props.actions.getAllMatches(inputData).then(() => {
      if (this.props.matchList) {
        this.props.matchList.map(match => {
          if (moment().isBefore(match.startTime)) {
            if (!match.foreshadowmins && !match.teamsAllowed) {
              list.push(
                <Option key={match.seasonGameUid} value={match.seasonGameUid}>
                  {match.title} ( {moment(match.startTime).format('YYYY-MM-DD')}{' '}
                  ) ({match.seasonGameUid})
                </Option>
              );
            }
          }
        });
        if (list.length === 0) {
          this.setState({ noEligibleMatch: true });
        } else {
          this.setState({ noEligibleMatch: false });
        }
      }
    });

    this.setState({ matchDropdownList: list });
    // EDIT
    if (this.props.matchConfig && this.props.matchConfig.record) {
      let record = { ...this.props.matchConfig.record };
      let editOnlyMessage =
        this.props.matchConfig.matchStatus &&
        this.props.matchConfig.matchStatus === 'END'
          ? true
          : false;
      this.setState({
        editFlag: true,
        disableField: true,
        editOnlyMessage: editOnlyMessage
      });
      this.props.actions.getCdnPathForUpload().then(() => {
        if (this.props.getCdnPathForUploadResponse) {
          let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
            .CDN_PATH;
          cdnPath = cdnPath.endsWith('/') ? cdnPath : cdnPath.concat('/');
          this.setState({ cdnPath });
          if (JSON.parse(record.extraInfo).contestListBanner) {
            this.copyImage(JSON.parse(record.extraInfo).contestListBanner);
          } else {
            this.setState({
              loadImage: true
            });
          }

          if (JSON.parse(record.extraInfo).contestDetailBanner) {
            this.copyDetailImage(
              JSON.parse(record.extraInfo).contestDetailBanner
            );
          } else {
            this.setState({
              detailBannerLoadImage: true
            });
          }
        }
      });
      this.setState(
        {
          checkedValues:
            JSON.parse(record.extraInfo).countryLevelMapping &&
            JSON.parse(record.extraInfo).countryLevelMapping.allowedCountry
              ? [
                  ...JSON.parse(record.extraInfo).countryLevelMapping
                    .allowedCountry
                ]
              : [],
          createDefaultContest: record.matchType ? true : false,
          isRakeBack:
            record.extraInfo &&
            JSON.parse(record.extraInfo).rakeBackDetails &&
            JSON.parse(record.extraInfo).rakeBackDetails.isRakeBack
              ? true
              : false
        },
        () => {
          this.props.form.setFieldsValue(
            {
              match: record.seasonGameUid,
              foreshadowTime: record.foreshadowmins / 60,
              hardStopTime: record.hardstopmins ? record.hardstopmins : 0,
              teamLimit: record.teamsAllowed,
              orderId: record.orderId,
              isActive: record.isActive ? record.isActive : false,
              autoFinish: record.autoFinish ? record.autoFinish : false,
              createDefaultContests: record.createDefaultContests
                ? record.createDefaultContests
                : false,
              matchType: record.matchType ? record.matchType : null,
              isRakeBack: this.state.isRakeBack,
              rakeBackMoneyType: this.state.isRakeBack
                ? JSON.parse(record.extraInfo).rakeBackDetails.rakeBackMoneyType
                : 'winning',
              maxRackBackAmount: this.state.isRakeBack
                ? JSON.parse(record.extraInfo).rakeBackDetails.maxRackBackAmount
                : null,
              minInvestmentValue: this.state.isRakeBack
                ? JSON.parse(record.extraInfo).rakeBackDetails
                    .minInvestmentValue
                : null,
              rakeBackPercentage: this.state.isRakeBack
                ? JSON.parse(record.extraInfo).rakeBackDetails
                    .rakeBackPercentage
                : null,
              matchDisplayMessageIN:
                record.extraInfo &&
                JSON.parse(record.extraInfo).countryLevelMapping &&
                JSON.parse(record.extraInfo).countryLevelMapping.IN &&
                JSON.parse(record.extraInfo).countryLevelMapping.IN
                  .matchDisplayMessage
                  ? JSON.parse(record.extraInfo).countryLevelMapping.IN
                      .matchDisplayMessage
                  : null,
              matchDisplayMessageID:
                record.extraInfo &&
                JSON.parse(record.extraInfo).countryLevelMapping &&
                JSON.parse(record.extraInfo).countryLevelMapping.ID &&
                JSON.parse(record.extraInfo).countryLevelMapping.ID
                  .matchDisplayMessage
                  ? JSON.parse(record.extraInfo).countryLevelMapping.ID
                      .matchDisplayMessage
                  : null,
              quickJoinEnabled:
                record.extraInfo &&
                JSON.parse(record.extraInfo).quickJoinEnabled
                  ? JSON.parse(record.extraInfo).quickJoinEnabled
                  : false,
              isPassEligibleContestAvailable:
                record.extraInfo &&
                JSON.parse(record.extraInfo).isPassEligibleContestAvailable
                  ? JSON.parse(record.extraInfo).isPassEligibleContestAvailable
                  : false,
              matchTier:
                record.extraInfo && JSON.parse(record.extraInfo).matchTier
                  ? JSON.parse(record.extraInfo).matchTier
                  : null,
              megaContestTagIN:
                record.extraInfo &&
                JSON.parse(record.extraInfo).countryLevelMapping &&
                JSON.parse(record.extraInfo).countryLevelMapping.IN &&
                JSON.parse(record.extraInfo).countryLevelMapping.IN
                  .megaContestTag
                  ? JSON.parse(record.extraInfo).countryLevelMapping.IN
                      .megaContestTag
                  : null,
              megaContestTagID:
                record.extraInfo &&
                JSON.parse(record.extraInfo).countryLevelMapping &&
                JSON.parse(record.extraInfo).countryLevelMapping.ID &&
                JSON.parse(record.extraInfo).countryLevelMapping.ID
                  .megaContestTag
                  ? JSON.parse(record.extraInfo).countryLevelMapping.ID
                      .megaContestTag
                  : null,
              megaContestPrizeIN:
                record.extraInfo &&
                JSON.parse(record.extraInfo).countryLevelMapping &&
                JSON.parse(record.extraInfo).countryLevelMapping.IN &&
                JSON.parse(record.extraInfo).countryLevelMapping.IN
                  .megaContestPrize
                  ? JSON.parse(record.extraInfo).countryLevelMapping.IN
                      .megaContestPrize
                  : null,
              megaContestPrizeID:
                record.extraInfo &&
                JSON.parse(record.extraInfo).countryLevelMapping &&
                JSON.parse(record.extraInfo).countryLevelMapping.ID &&
                JSON.parse(record.extraInfo).countryLevelMapping.ID
                  .megaContestPrize
                  ? JSON.parse(record.extraInfo).countryLevelMapping.ID
                      .megaContestPrize
                  : null,
              seasonPassApplicables:
                record.extraInfo &&
                JSON.parse(record.extraInfo).seasonPassApplicables
                  ? JSON.parse(record.extraInfo).seasonPassApplicables
                  : []
            },
            () => {
              let extraInfo = record.extraInfo
                ? JSON.parse(record.extraInfo)
                : {};
              delete extraInfo.rakeBackDetails;
              delete extraInfo.matchDisplayMessage;
              delete extraInfo.quickJoinEnabled;
              delete extraInfo.megaContestTag;
              delete extraInfo.megaContestPrize;
              delete extraInfo.isPassEligibleContestAvailable;
              delete extraInfo.matchTier;
              delete extraInfo.countryLevelMapping;
              this.props.form.setFieldsValue({
                extraInfo: JSON.stringify(extraInfo)
              });
            }
          );
        }
      );
    } else {
      this.setState({
        loadImage: true,
        detailBannerLoadImage: true
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.clearMatchConfigForm();
  }

  removeRow(record) {
    var tempArray = [...this.state.existingLeagueConfigs];
    var index = tempArray.indexOf(record);
    if (index !== -1) {
      tempArray.splice(index, 1);
      this.setState({ existingLeagueConfigs: tempArray });
    }
  }

  resetForm() {
    this.props.form.resetFields();
    this.setState({
      league: null,
      foreshadowTime: null,
      hardStopTime: null,
      teamLimit: null
    });
  }

  validateJson(e) {
    let inputValue = e.target.value;
    if (inputValue !== '') {
      try {
        JSON.parse(inputValue);
        this.setState({ isInvalidJson: false });
        return true;
      } catch (error) {
        this.setState({ isInvalidJson: true });
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topLeft'
        });
        return false;
      }
    }
  }

  updateCreateDefaultContest(value) {
    this.setState({ createDefaultContest: value });
  }

  updateIsRakeBack(value) {
    this.setState({ isRakeBack: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.isInvalidJson) {
          message.error('Extra Info field contains JSON in invalid format');
          return;
        }
        let extraInfo = values.extraInfo ? JSON.parse(values.extraInfo) : {};
        if (this.state.isRakeBack) {
          extraInfo['rakeBackDetails'] = {
            isRakeBack: this.state.isRakeBack,
            rakeBackMoneyType: values.rakeBackMoneyType,
            minInvestmentValue: values.minInvestmentValue,
            maxRackBackAmount: values.maxRackBackAmount,
            rakeBackPercentage: values.rakeBackPercentage
          };
        }

        extraInfo['quickJoinEnabled'] = values.quickJoinEnabled;
        extraInfo['isPassEligibleContestAvailable'] =
          values.isPassEligibleContestAvailable;

        if (values.matchTier && values.matchTier != '') {
          extraInfo['matchTier'] = values.matchTier;
        }
        if (this.state.checkedValues.length < 1) {
          message.error('Please select at least one applicable country');
          return;
        } else {
          extraInfo['countryLevelMapping'] = {
            allowedCountry: [...this.state.checkedValues]
          };
          if (this.state.checkedValues.includes('IN')) {
            extraInfo['countryLevelMapping']['IN'] = {};
            if (values.megaContestTagIN && values.megaContestTagIN != '') {
              extraInfo['countryLevelMapping']['IN']['megaContestTag'] =
                values.megaContestTagIN;
            }
            if (values.megaContestPrizeIN && values.megaContestPrizeIN != '') {
              extraInfo['countryLevelMapping']['IN']['megaContestPrize'] =
                values.megaContestPrizeIN;
            }
            if (
              values.matchDisplayMessageIN &&
              values.matchDisplayMessageIN != ''
            ) {
              extraInfo['countryLevelMapping']['IN']['matchDisplayMessage'] =
                values.matchDisplayMessageIN;
            }
          }

          if (this.state.checkedValues.includes('ID')) {
            extraInfo['countryLevelMapping']['ID'] = {};
            if (values.megaContestTagID && values.megaContestTagID != '') {
              extraInfo['countryLevelMapping']['ID']['megaContestTag'] =
                values.megaContestTagID;
            }
            if (values.megaContestPrizeID && values.megaContestPrizeID != '') {
              extraInfo['countryLevelMapping']['ID']['megaContestPrize'] =
                values.megaContestPrizeID;
            }
            if (
              values.matchDisplayMessageID &&
              values.matchDisplayMessageID != ''
            ) {
              extraInfo['countryLevelMapping']['ID']['matchDisplayMessage'] =
                values.matchDisplayMessageID;
            }
          }
          extraInfo['contestListBanner'] = this.state.listBannerImage;
          extraInfo['contestDetailBanner'] = this.state.detailBannerImage;

          if (
            values.seasonPassApplicables &&
            values.seasonPassApplicables !== ''
          ) {
            extraInfo['seasonPassApplicables'] = [
              ...values.seasonPassApplicables
            ];
          }
        }

        let data = {
          matchId: values.match,
          foreshadowTime: values.foreshadowTime * 60,
          hardStopTime: values.hardStopTime,
          teamLimit: values.teamLimit,
          orderId: values.orderId,
          isActive: values.isActive, // ADD IS ACTIVE FILTER
          extraInfo: JSON.stringify(extraInfo),
          autoFinish: values.autoFinish,
          createDefaultContests: values.createDefaultContests,
          matchType: values.matchType ? values.matchType : [],
          segmentType: values.segmentType,
          notificationBody: values.notificationBody
            ? values.notificationBody
            : null,
          notificationTitle: values.notificationTitle
            ? values.notificationTitle
            : null
        };
        if (this.state.editFlag) {
          this.props.actions.editMatchConfigDetails(data).then(() => {
            if (
              this.props.fantasy.editMatchConfigResponse &&
              this.props.fantasy.editMatchConfigResponse.error
            ) {
              if (this.props.fantasy.editMatchConfigResponse.error.message) {
                message.error(
                  this.props.fantasy.editMatchConfigResponse.error.message
                );
                return;
              } else {
                message.error('The config could not be updated');
                return;
              }
            } else {
              this.props.history.push('/football/match-list');
            }
          });
        } else {
          this.props.actions.createMatchConfig(data).then(() => {
            if (
              this.props.fantasy.createMatchConfigResponse &&
              this.props.fantasy.createMatchConfigResponse.error
            ) {
              if (this.props.fantasy.createMatchConfigResponse.error.message) {
                message.error(
                  this.props.fantasy.createMatchConfigResponse.error.message
                );
                return;
              } else {
                message.error('The match config could not be created');
                return;
              }
            } else {
              this.props.history.push('/football/match-list');
            }
          });
        }
      }
    });
  }
  getAllSeasonPass() {
    this.props.actions.getAllSeasonPass({ sportId: 5 }).then(() => {
      if (
        this.props.getAllSeasonPassResponse &&
        this.props.getAllSeasonPassResponse.seasonPass &&
        this.props.getAllSeasonPassResponse.seasonPass.length > 0
      ) {
        let seasonPassOptionList = [];

        this.props.getAllSeasonPassResponse.seasonPass.map(item => {
          seasonPassOptionList.push(
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        });
        this.setState({ seasonPassOptionList });
      } else {
        message.info('No season pass found');
      }
    });
  }

  getAllMasterContestType() {
    this.props.actions.getAllMasterContestType().then(() => {
      if (
        this.props.getAllMasterContestTypeResponse &&
        this.props.getAllMasterContestTypeResponse.masterType &&
        this.props.getAllMasterContestTypeResponse.masterType.length > 0
      ) {
        let masterOptionList = [];
        this.props.getAllMasterContestTypeResponse.masterType.map(item => {
          masterOptionList.push(
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        });
        this.setState({ masterOptionList });
      } else {
        message.info('No master contest type found');
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

  getCountryCode() {
    this.props.actions
      .getAllCountryCode()
      .then(() => {
        if (
          this.props.getAllCountryCodeResponse &&
          this.props.getAllCountryCodeResponse.countryCode &&
          this.props.getAllCountryCodeResponse.countryCode.length > 0
        ) {
          if (this.state.editFlag) {
            this.setState({
              countryOptions: [
                ...this.props.getAllCountryCodeResponse.countryCode
              ],
              countryListFetched: true
            });
          } else {
            this.setState({
              checkedValues: [
                ...this.props.getAllCountryCodeResponse.countryCode
              ],
              countryOptions: [
                ...this.props.getAllCountryCodeResponse.countryCode
              ],
              countryListFetched: true
            });
          }
        } else {
          if (this.state.editFlag) {
            this.setState({
              countryOptions: ['IN', 'ID', 'US'],
              countryListFetched: true
            });
          } else {
            this.setState({
              checkedValues: [],
              countryOptions: ['IN', 'ID', 'US'],
              countryListFetched: true
            });
          }
        }
      })
      .catch(() => {
        if (this.state.editFlag) {
          this.setState({
            countryOptions: ['IN', 'ID', 'US'],
            countryListFetched: true
          });
        } else {
          this.setState({
            checkedValues: [],
            countryOptions: ['IN', 'ID', 'US'],
            countryListFetched: true
          });
        }
      });
  }

  updateCountrySelection(value) {
    this.setState({ checkedValues: value.length > 0 ? [...value] : [] });
  }
  getListBannerImageUrl = data => {
    this.setState({
      listBannerImage: data && data.id ? data.id : ''
    });
  };

  getDetailBannerImageUrl = data => {
    this.setState({
      detailBannerImage: data && data.id ? data.id : ''
    });
  };
  copyImage(image) {
    let url = image;
    image = this.state.cdnPath + image;
    this.setState({
      previewListBannerImage: image,
      fileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: image
        }
      ],
      loadImage: true
    });

  }
  copyDetailImage(image) {
    let url = image;
    image = this.state.cdnPath + image;

    this.setState({
      previewDetailBannerImage: image,
      fileListDetail: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: image
        }
      ]
    });

    this.setState({
      detailBannerLoadImage: true
    });
  }

  isImageLoading = data => {
    this.setState({
      imageLoading: data
    });
  };
  isDetailImageLoading = data => {
    this.setState({
      detailBannerImageLoading: data
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      match: isFieldTouched('match') && getFieldError('match'),
      foreshadowTime:
        isFieldTouched('foreshadowTime') && getFieldError('foreshadowTime'),
      hardStopTime:
        isFieldTouched('hardStopTime') && getFieldError('hardStopTime'),
      teamLimit: isFieldTouched('teamLimit') && getFieldError('teamLimit'),
      extraInfo: isFieldTouched('extraInfo') && getFieldError('extraInfo'),
      autoFinish: isFieldTouched('autoFinish') && getFieldError('autoFinish'),
      orderId: isFieldTouched('orderId') && getFieldError('orderId'),
      matchType: isFieldTouched('matchType') && getFieldError('matchType'),
      segmentType:
        isFieldTouched('segmentType') && getFieldError('segmentType'),
      seasonPassApplicables:
        isFieldTouched('seasonPassApplicables') &&
        getFieldError('seasonPassApplicables'),
      notificationBody:
        isFieldTouched('notificationBody') && getFieldError('notificationBody'),
      notificationTitle:
        isFieldTouched('notificationTitle') &&
        getFieldError('notificationTitle'),
      rakeBackMoneyType:
        isFieldTouched('rakeBackMoneyType') &&
        getFieldError('rakeBackMoneyType'),
      minInvestmentValue:
        isFieldTouched('minInvestmentValue') &&
        getFieldError('minInvestmentValue'),
      maxRackBackAmount:
        isFieldTouched('maxRackBackAmount') &&
        getFieldError('maxRackBackAmount'),
      rakeBackPercentage:
        isFieldTouched('rakeBackPercentage') &&
        getFieldError('rakeBackPercentage'),
      matchDisplayMessageIN:
        isFieldTouched('matchDisplayMessageIN') &&
        getFieldError('matchDisplayMessageIN'),
      matchDisplayMessageID:
        isFieldTouched('matchDisplayMessageID') &&
        getFieldError('matchDisplayMessageID'),
      megaContestTagIN:
        isFieldTouched('megaContestTagIN') && getFieldError('megaContestTagIN'),
      megaContestPrizeIN:
        isFieldTouched('megaContestPrizeIN') &&
        getFieldError('megaContestPrizeIN'),
      megaContestTagID:
        isFieldTouched('megaContestTagID') && getFieldError('megaContestTagID'),
      megaContestPrizeID:
        isFieldTouched('megaContestPrizeID') &&
        getFieldError('megaContestPrizeID'),
      matchTier: isFieldTouched('matchTier') && getFieldError('matchTier')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Create Match Config| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Create Match Config">
            <FormItem
              validateStatus={errors.match ? 'error' : ''}
              help={errors.match || ''}
              {...formItemLayout}
              label={
                <span>
                  Match
                  <Tooltip title="Select match to create config for the same">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('match', {
                rules: [
                  {
                    required: true,
                    message: 'Please select match!'
                  }
                ]
              })(
                <Select
                  disabled={this.state.disableField}
                  showSearch
                  style={{ width: '70%' }}
                  placeholder="Select match"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children[0]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.matchDropdownList}
                </Select>
              )}
            </FormItem>
            {this.state.noEligibleMatch && (
              <Col offset={8}>
                <small style={{ color: '#faad14' }}>
                  Match Configs for all the available match is already created
                </small>
              </Col>
            )}
            <FormItem
              validateStatus={errors.foreshadowTime ? 'error' : ''}
              help={errors.foreshadowTime || ''}
              {...formItemLayout}
              label={
                <span>
                  Foreshadow Time ( in hours )
                  <Tooltip title="Time before the start of the match when Match should become visible to the users">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('foreshadowTime', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message:
                      'Qualifying Amount is a mandatory field and should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled={this.state.editOnlyMessage} min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.hardStopTime ? 'error' : ''}
              help={errors.hardStopTime || ''}
              {...formItemLayout}
              label={
                <span>
                  Hard Stop Time ( in mins)
                  <Tooltip title="Time before Match Time when registration or team additions/modifications should end">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('hardStopTime', {
                initialValue: 0,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message:
                      'Qualifying Amount is a mandatory field and should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled={this.state.editOnlyMessage} min={0} />)}
            </FormItem>

            <FormItem
              validateStatus={errors.teamLimit ? 'error' : ''}
              help={errors.teamLimit || ''}
              {...formItemLayout}
              label={
                <span>
                  Team Limit
                  <Tooltip title="For a given match, how many teams a user can create for use across all contests">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('teamLimit', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'This is a mandatory field and should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled={this.state.editOnlyMessage} min={0} />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Is Active
                  <Tooltip title="Is this configuration active">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isActive', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select!'
                  }
                ],
                initialValue: this.state.isActive
              })(
                <Radio.Group
                  disabled={this.state.editOnlyMessage}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>Inactive</Radio.Button>
                  <Radio.Button value={true}>Active</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.orderId ? 'error' : ''}
              help={errors.orderId || ''}
              {...formItemLayout}
              label={
                <span>
                  Order Id
                  <Tooltip title="Show order">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('orderId', {
                initialValue: this.state.orderId,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'This is a mandatory field and should be a number',
                    whitespace: false
                  }
                ]
              })(<InputNumber disabled={this.state.editOnlyMessage} min={0} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Auto Finish
                  <Tooltip title="Set auto finish">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('autoFinish', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select!'
                  }
                ],
                initialValue: this.state.autoFinish
              })(
                <Radio.Group
                  disabled={this.state.editOnlyMessage}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value={false}>False</Radio.Button>
                  <Radio.Button value={true}>True</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {!this.state.editFlag && (
              <>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Create Default Contests
                      <Tooltip title="Set Create Default Contests">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('createDefaultContests', {
                    rules: [
                      {
                        required: true,
                        type: 'boolean',
                        message: 'Please select!'
                      }
                    ],
                    initialValue: this.state.createDefaultContests
                  })(
                    <Radio.Group
                      disabled={this.state.editOnlyMessage}
                      size="small"
                      buttonStyle="solid"
                      onChange={e =>
                        this.updateCreateDefaultContest(e.target.value)
                      }
                    >
                      <Radio.Button value={false}>False</Radio.Button>
                      <Radio.Button value={true}>True</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                {this.state.createDefaultContest && (
                  <FormItem
                    validateStatus={errors.matchType ? 'error' : ''}
                    help={errors.matchType || ''}
                    {...formItemLayout}
                    label={<span>Match Type</span>}
                  >
                    {getFieldDecorator('matchType', {
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          message: 'Please input master contest types!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Select
                        disabled={this.state.editOnlyMessage}
                        showSearch
                        mode="multiple"
                        style={{ width: '70%' }}
                        placeholder="Select master contest type"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.masterOptionList}
                      </Select>
                    )}
                  </FormItem>
                )}
                <FormItem
                  validateStatus={errors.segmentType ? 'error' : ''}
                  help={errors.segmentType || ''}
                  {...formItemLayout}
                  label={<span>Segment Type</span>}
                >
                  {getFieldDecorator('segmentType', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input segment type!',
                        whitespace: true
                      }
                    ]
                  })(
                    <Select
                      disabled={this.state.editOnlyMessage}
                      showSearch
                      style={{ width: '70%' }}
                      placeholder="Select segment"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children[0]
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.segmentOptionList}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.notificationTitle ? 'error' : ''}
                  help={errors.notificationTitle || ''}
                  {...formItemLayout}
                  label={<span>Notification Title</span>}
                >
                  {getFieldDecorator('notificationTitle', {
                    rules: [
                      {
                        required: false,
                        message: 'Please enter notification title',
                        whitespace: true
                      }
                    ]
                  })(
                    <Input
                      disabled={this.state.editOnlyMessage}
                      style={{ width: '70%' }}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.notificationBody ? 'error' : ''}
                  help={errors.notificationBody || ''}
                  {...formItemLayout}
                  label={<span>Notification Body</span>}
                >
                  {getFieldDecorator('notificationBody', {
                    rules: [
                      {
                        required: false,
                        message: 'Please enter notification body',
                        whitespace: true
                      }
                    ]
                  })(
                    <TextArea
                      disabled={this.state.editOnlyMessage}
                      style={{ width: '70%' }}
                      rows={3}
                    />
                  )}
                </FormItem>
              </>
            )}
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Is Rake Back
                  <Tooltip title="Is match enabled with rake back">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('isRakeBack', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select!'
                  }
                ],
                initialValue: this.state.isRakeBack
              })(
                <Radio.Group
                  disabled={this.state.editOnlyMessage}
                  size="small"
                  buttonStyle="solid"
                  onChange={e => this.updateIsRakeBack(e.target.value)}
                >
                  <Radio.Button value={false}>False</Radio.Button>
                  <Radio.Button value={true}>True</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.isRakeBack && (
              <>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      Rake Back Money Type
                      <Tooltip title="Minimum contest entry fee for rake back matches">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('rakeBackMoneyType', {
                    initialValue: 'winning',
                    rules: [
                      {
                        required: true,
                        message: 'Please select!'
                      }
                    ]
                  })(
                    <Radio.Group
                      disabled={this.state.editOnlyMessage}
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button value={'winning'}>Winning</Radio.Button>
                      <Radio.Button value={'deposit'}>Deposit</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.minInvestmentValue ? 'error' : ''}
                  help={errors.minInvestmentValue || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Min Investment Value
                      <Tooltip title="Minimum investment value for rake back matches">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('minInvestmentValue', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'mandatory field and should be a number',
                        whitespace: false
                      }
                    ]
                  })(
                    <InputNumber
                      disabled={this.state.editOnlyMessage}
                      min={1}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.maxRackBackAmount ? 'error' : ''}
                  help={errors.maxRackBackAmount || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Max Rack Back Amount
                      <Tooltip title="Maximum rake back amount for rake back matches">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('maxRackBackAmount', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'mandatory field and should be a number',
                        whitespace: false
                      }
                    ]
                  })(
                    <InputNumber
                      disabled={this.state.editOnlyMessage}
                      min={0}
                      max={5000}
                    />
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.rakeBackPercentage ? 'error' : ''}
                  help={errors.rakeBackPercentage || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Rake Back Percentage
                      <Tooltip title="Maximum rake back percentage for rake back matches">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('rakeBackPercentage', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: 'mandatory field and should be a number',
                        whitespace: false
                      }
                    ]
                  })(
                    <InputNumber
                      disabled={this.state.editOnlyMessage}
                      min={0}
                      precision={1}
                      max={10}
                    />
                  )}
                </FormItem>
              </>
            )}
            <FormItem
              validateStatus={errors.matchDisplayMessageIN ? 'error' : ''}
              help={errors.matchDisplayMessageIN || ''}
              {...formItemLayout}
              label={<span>Match Display Message ( IN )</span>}
            >
              {getFieldDecorator('matchDisplayMessageIN', {
                rules: [
                  {
                    required: false,
                    message: 'Please enter match display message',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.matchDisplayMessageID ? 'error' : ''}
              help={errors.matchDisplayMessageID || ''}
              {...formItemLayout}
              label={<span>Match Display Message ( ID )</span>}
            >
              {getFieldDecorator('matchDisplayMessageID', {
                rules: [
                  {
                    required: false,
                    message: 'Please enter match display message',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'Quick Join Enabled'}>
              {getFieldDecorator('quickJoinEnabled', {
                initialValue: false,
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select!'
                  }
                ]
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {this.state.countryListFetched && (
              <FormItem
                {...formItemLayout}
                label={<span>Applicalble Countries</span>}
              >
                {getFieldDecorator('allowedCountry', {
                  rules: [
                    {
                      required: true,
                      type: 'array',
                      message: 'Please select option for app type!'
                    }
                  ],
                  initialValue: this.state.checkedValues
                })(
                  <CheckboxGroup
                    options={this.state.countryOptions}
                    onChange={e => this.updateCountrySelection(e)}
                  />
                )}
              </FormItem>
            )}
            <FormItem
              validateStatus={errors.megaContestTagIN ? 'error' : ''}
              help={errors.megaContestTagIN || ''}
              {...formItemLayout}
              label={<span>Mega Contest Tag ( IN )</span>}
            >
              {getFieldDecorator('megaContestTagIN', {
                rules: [
                  {
                    required: false,
                    message: 'Please enter match display message',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.megaContestPrizeIN ? 'error' : ''}
              help={errors.megaContestPrizeIN || ''}
              {...formItemLayout}
              label={<span>Mega Contest Prize ( IN )</span>}
            >
              {getFieldDecorator('megaContestPrizeIN', {
                rules: [
                  {
                    required: false,
                    message: 'Please enter match display message',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.megaContestTagID ? 'error' : ''}
              help={errors.megaContestTagID || ''}
              {...formItemLayout}
              label={<span>Mega Contest Tag ( ID )</span>}
            >
              {getFieldDecorator('megaContestTagID', {
                rules: [
                  {
                    required: false,
                    message: 'Please enter match display message',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.megaContestPrizeID ? 'error' : ''}
              help={errors.megaContestPrizeID || ''}
              {...formItemLayout}
              label={<span>Mega Contest Prize ( ID )</span>}
            >
              {getFieldDecorator('megaContestPrizeID', {
                rules: [
                  {
                    required: false,
                    message: 'Please enter match display message',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={'Is Pass Eligible Contest Available'}
            >
              {getFieldDecorator('isPassEligibleContestAvailable', {
                initialValue: false,
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select!'
                  }
                ]
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.matchTier ? 'error' : ''}
              help={errors.matchTier || ''}
              {...formItemLayout}
              label={<span>Match Tier</span>}
            >
              {getFieldDecorator('matchTier', {
                rules: [
                  {
                    required: false,
                    message: 'Please enter match tier',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <Row>
              {this.state.loadImage && (
                <Col span={6} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.getListBannerImageUrl}
                    header={'List Banner Image'}
                    previewImage={this.state.previewListBannerImage}
                    fileList={this.state.fileList}
                    isLoading={this.isImageLoading}
                  />
                </Col>
              )}
            </Row>
            <Row>
              {this.state.detailBannerLoadImage && (
                <Col span={6} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.getDetailBannerImageUrl}
                    header={'Detail Banner Image'}
                    previewImage={this.state.previewDetailBannerImage}
                    fileList={this.state.fileListDetail}
                    isLoading={this.isDetailImageLoading}
                  />
                </Col>
              )}
            </Row>
            <FormItem
              validateStatus={errors.seasonPassApplicables ? 'error' : ''}
              help={errors.seasonPassApplicables || ''}
              {...formItemLayout}
              label={<span>Season Pass</span>}
            >
              {getFieldDecorator('seasonPassApplicables', {
                rules: [
                  {
                    type: 'array',
                    required: false,
                    message: 'Please Select Season Pass!'
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  showSearch
                  style={{ width: '70%' }}
                  placeholder="Select Season Pass"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children[0]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.seasonPassOptionList}
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.extraInfo ? 'error' : ''}
              help={errors.extraInfo || ''}
              {...formItemLayout}
              label={
                <span>
                  Entra Info
                  <Tooltip title="Extra Info in JSON format">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('extraInfo', {
                rules: [
                  {
                    required: false,
                    message: 'Please extra info',
                    whitespace: true
                  }
                ],
                initialValue: '{}'
              })(
                <TextArea
                  disabled={this.state.editOnlyMessage}
                  style={{ width: '70%' }}
                  onBlur={e => this.validateJson(e)}
                  rows={3}
                />
              )}
            </FormItem>
            <Row type="flex" justify="center">
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    matchList: state.football.matches,
    allLineFormats: state.football.lineFormats,
    matchConfig: state.football.matchConfig,
    fantasy: state.football,
    getAllMasterContestTypeResponse:
      state.football.getAllMasterContestTypeResponse,
    getAllSegmentTypeResponse: state.football.getAllSegmentTypeResponse,
    getAllCountryCodeResponse: state.football.getAllCountryCodeResponse,
    getAllSeasonPassResponse: state.football.getAllSeasonPassResponse,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...footballActions, ...websiteActions },
      dispatch
    )
  };
}
const CreateMatchForm = Form.create()(CreateMatch);
export default connect(mapStateToProps, mapDispatchToProps)(CreateMatchForm);
