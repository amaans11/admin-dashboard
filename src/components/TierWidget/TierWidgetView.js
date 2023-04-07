import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tierWidgetsActions from '../../actions/TierWidgetsActions';
import * as userProfileActions from '../../actions/UserProfileActions';
import { Card, Select, Row, Col, Icon, Popconfirm, message } from 'antd';

const { Option } = Select;

const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

class TierWidgetView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      tierList: [],
      tierConfig: {},
      selectedTierDetails: {},
      allTiers: []
    };
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    this.getTierList();
  }

  getTierList() {
    this.props.actions.getTierList().then(() => {
      if (this.props.tierList) {
        let tierList = [];
        let allTiers = [];
        tierList.push(
          <Option key={99} value={'DEFAULT'}>
            {'Default'}
          </Option>
        );
        allTiers.push('DEFAULT');
        this.props.tierList.tiers.map((tier, index) => {
          tierList.push(
            <Option key={tier.tier} value={tier.tier.toUpperCase()}>
              {tier.tier}
            </Option>
          );
          allTiers.push(tier.tier.toUpperCase());
        });
        this.setState({
          tierList: [...tierList],
          allTiers: [...allTiers]
        });
      }
    });
  }

  selectCountry(value) {
    this.setState({ tierDataFetched: false, countryCode: value });
    this.getCurrentConfig(value);
  }

  getCurrentConfig(countryCode) {
    let data = {
      countryCode: countryCode
    };
    this.props.actions.getCurrentConfig(data).then(() => {
      if (this.props.getCurrentConfigSuccess) {
        let tierConfig = JSON.parse(this.props.getCurrentConfigSuccess);
        this.setState({
          tierConfig: {
            ...tierConfig.tierConfigJson
          },
          tierDataFetched: true
        });
      }
    });
  }

  removeItem(item) {
    let tierConfig = { ...this.state.tierConfig };
    delete tierConfig[item];
    let data = {
      tierConfig: tierConfig,
      countryCode: this.state.countryCode
    };
    this.props.actions.deleteTierWidgetConfig(data).then(() => {
      if (
        this.props.deleteTierWidgetConfigResponse &&
        this.props.deleteTierWidgetConfigResponse.success
      ) {
        window.location.reload();
      } else {
        message.error('Could not update the details');
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Card>
          <Row>
            <Col span={12}>
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
            </Col>
            {this.state.tierDataFetched && (
              <Col span={24} style={{ marginTop: '20px' }}>
                {this.state.allTiers.map((item, index) => {
                  if (this.state.tierConfig[item]) {
                    return (
                      <Col key={index} span={8}>
                        <Card
                          type="inner"
                          title={item}
                          extra={
                            item !== 'DEFAULT' && (
                              <Popconfirm
                                title="Are you sure you want to delete this config?"
                                onConfirm={() => this.removeItem(item)}
                              >
                                <Icon type="delete" />
                              </Popconfirm>
                            )
                          }
                        >
                          {JSON.stringify(this.state.tierConfig[item])}
                        </Card>
                      </Col>
                    );
                  }
                })}
              </Col>
            )}
          </Row>
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCurrentConfigSuccess: state.tierWidget.getCurrentConfigSuccess,
    tierList: state.userProfile.tierList,
    deleteTierWidgetConfigResponse:
      state.tierWidget.deleteTierWidgetConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...tierWidgetsActions, ...userProfileActions },
      dispatch
    )
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TierWidgetView);
