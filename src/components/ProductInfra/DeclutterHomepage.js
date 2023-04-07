import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tierWidgetsActions from '../../actions/TierWidgetsActions';
import * as gameActions from '../../actions/gameActions';
import * as userProfileActions from '../../actions/UserProfileActions';
import {
  Card,
  Select,
  Form,
  Button,
  InputNumber,
  message,
  Row,
  Col,
  Radio,
  Tag,
  Icon,
  Input
} from 'antd';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class DeclutterHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      tierConfigJsonCheck: true,
      selectedTierConfig: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getTierList();
  }

  selectCountry(value) {
    this.setState(
      {
        parentDataFetched: false,
        tierSelected: false,
        countryCode: value
      },
      () => {
        this.getCurrentConfig();
      }
    );
  }

  getTierList() {
    this.props.actions.getTierList().then(() => {
      if (this.props.tierList) {
        let tierList = [];
        tierList.push(
          <Option key={99} value={'DEFAULT'}>
            {'Default'}
          </Option>
        );
        this.props.tierList.tiers.map((tier, index) => {
          tierList.push(
            <Option key={tier.tier} value={tier.tier.toUpperCase()}>
              {tier.tier}
            </Option>
          );
        });
        this.setState({
          tierList
        });
      }
    });
  }

  getCurrentConfig() {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getHomeManagementConfig(data).then(() => {
      if (this.props.getHomeManagementConfigResponse) {
        let tierConfig = JSON.parse(this.props.getHomeManagementConfigResponse);
        this.setState({
          tierConfig: {
            ...tierConfig.tierConfig
          },
          parentDataFetched: true
        });
      }
    });
  }

  selectTier(tier) {
    let selectedTierConfig = this.state.tierConfig[tier]
      ? this.state.tierConfig[tier]
      : {};
    if (_.isEmpty(selectedTierConfig)) {
      message.error('Tier not configured');
    }
    this.setState({
      selectedTier: tier,
      selectedTierConfig,
      tierSelected: true
    });
  }

  jsonCheck(value) {
    if (value) {
      try {
        JSON.parse(value);
        this.setState({ tierConfigJsonCheck: true });
        return true;
      } catch (error) {
        message.error('Invalid JSON Object', 0.5);
        this.setState({ tierConfigJsonCheck: false });
        return false;
      }
    } else {
      message.error('This field cannot be left blank', 0.5);
      this.setState({ tierConfigJsonCheck: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          countryCode: this.state.countryCode,
          applyToTiers: values.applyToTiers,
          newConfig: JSON.parse(values.tierConfig)
        };
        this.props.actions.setHomeManagementConfig(data).then(() => {
          if (
            this.props.setHomeManagementConfigResponse &&
            this.props.setHomeManagementConfigResponse.success
          ) {
            window.location.reload();
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
      applyToTiers:
        isFieldTouched('applyToTiers') && getFieldError('applyToTiers'),
      tierConfig: isFieldTouched('tierConfig') && getFieldError('tierConfig')
    };

    let tierDetails = {};

    let selectedTier = this.state.selectedTier
      ? this.state.selectedTier
      : 'DEFAULT';

    if (this.state.parentDataFetched) {
      tierDetails = { ...this.state.tierConfig[selectedTier] };
    }

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Declutter Home Config">
            <Card>
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
              {this.state.parentDataFetched && (
                <FormItem
                  validateStatus={errors.fetchFromTier ? 'error' : ''}
                  help={errors.fetchFromTier || ''}
                  {...formItemLayout}
                  label={<span>Fetch From Tier</span>}
                >
                  {getFieldDecorator('fetchFromTier', {
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
                      onSelect={e => this.selectTier(e)}
                      style={{ width: '100%' }}
                      placeholder="Tier"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.tierList}
                    </Select>
                  )}
                </FormItem>
              )}
            </Card>
            {this.state.tierSelected && (
              <Row>
                <Card>
                  <FormItem
                    validateStatus={errors.applyToTiers ? 'error' : ''}
                    help={errors.applyToTiers || ''}
                    {...formItemLayout}
                    label={<span>Apply To Tiers</span>}
                  >
                    {getFieldDecorator('applyToTiers', {
                      rules: [
                        {
                          required: true,
                          type: 'array',
                          message: 'Tier field is mandatory',
                          whitespace: false
                        }
                      ]
                    })(
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Tier"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.tierList}
                      </Select>
                    )}
                  </FormItem>
                </Card>
                <Card title="Tier Config" type="inner">
                  <FormItem
                    validateStatus={
                      errors.tierConfig || !this.state.tierConfigJsonCheck
                        ? 'error'
                        : ''
                    }
                    help={errors.tierConfig || ''}
                    {...formItemLayout}
                    label={'Client Config'}
                  >
                    {getFieldDecorator('tierConfig', {
                      initialValue: JSON.stringify(
                        this.state.selectedTierConfig,
                        null,
                        2
                      ),
                      rules: [
                        {
                          required: false,
                          message: 'This is a mandatory field!',
                          whitespace: true
                        }
                      ]
                    })(
                      <TextArea
                        rows={30}
                        onBlur={e => this.jsonCheck(e.target.value)}
                      />
                    )}
                  </FormItem>
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
              </Row>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getHomeManagementConfigResponse:
      state.tierWidget.getHomeManagementConfigResponse,
    tierList: state.userProfile.tierList,
    setHomeManagementConfigResponse:
      state.tierWidget.setHomeManagementConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...tierWidgetsActions, ...gameActions, ...userProfileActions },
      dispatch
    )
  };
}
const DeclutterHomepageForm = Form.create()(DeclutterHomepage);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeclutterHomepageForm);
