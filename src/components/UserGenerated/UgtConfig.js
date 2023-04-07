import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userGeneratedActions from '../../actions/userGeneratedActions';
import {
  Card,
  Form,
  Button,
  Input,
  InputNumber,
  Icon,
  message,
  Row,
  Col,
  Switch,
  Select
} from 'antd';

const { Option } = Select;

const tierList = [
  'STEEL',
  'COPPER',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'PEARL',
  'ONYX',
  'JADE',
  'OPAL',
  'TOPAZ',
  'SAPPHIRE',
  'EMERALD',
  'RUBY'
].map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));

class UgtConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      allowedDurations: [],
      allowedEntryfees: [],
      allowedMaxPlayers: [],
      minHostTournamentTier: '',
      allowRepeatedFollowerInvitations: false,
      defaultHostType: '',
      offersActive: false,
      offers: [],
      ugtOffersActive: false,
      ugtOffers: [],
      // activeGamesList: [],
      // allowedHosts: [],
      marginPercentage: 0,
      defaultHostPercentage: 0,
      forceJoin: false,
      rateLimiters: '',
      dndFilter: false,
      eligibilityCriteria: ''
    };
  }

  componentDidMount() {
    this.props.actions.getUgtConfigs().then(() => {
      if (this.props.getUgtConfigResponse) {
        let configDetails = JSON.parse(this.props.getUgtConfigResponse);
        this.setState(
          {
            allowedDurations: [...configDetails.allowedDurations],
            allowedEntryfees: [...configDetails.allowedEntryfees],
            allowedMaxPlayers: [...configDetails.allowedMaxPlayers],
            minHostTournamentTier: configDetails.minHostTournamentTier,
            allowRepeatedFollowerInvitations:
              configDetails.allowRepeatedFollowerInvitations,
            defaultHostType: configDetails.defaultHostType,
            offersActive: configDetails.offersActive,
            offers: [...configDetails.offers],
            ugtOffersActive: configDetails.ugtOffersActive,
            ugtOffers: [...configDetails.ugtOffers],
            // activeGamesList: [...configDetails.activeGamesList],
            // allowedHosts: [...configDetails.allowedHosts],
            marginPercentage: configDetails.marginPercentage,
            defaultHostPercentage: configDetails.defaultHostPercentage,
            forceJoin: configDetails.forceJoin,
            rateLimiters: configDetails.rateLimiters,
            dndFilter: configDetails.dndFilter,
            eligibilityCriteria: configDetails.eligibilityCriteria
          },
          () => this.setState({ loaded: true })
        );
      } else {
        this.setState({ loaded: true });
      }
    });
  }

  arrayInputChanged(value, stateObject, index) {
    let obj = [];
    switch (stateObject) {
      case 'allowedDurations':
        obj = [...this.state.allowedDurations];
        obj[index] = value;
        this.setState({ allowedDurations: [...obj] });
        break;
      case 'allowedEntryfees':
        obj = [...this.state.allowedEntryfees];
        obj[index] = value;
        this.setState({ allowedEntryfees: [...obj] });
        break;
      case 'allowedMaxPlayers':
        obj = [...this.state.allowedMaxPlayers];
        obj[index] = value;
        this.setState({ allowedMaxPlayers: [...obj] });
        break;
      case 'offers':
        obj = [...this.state.offers];
        obj[index] = value;
        this.setState({ offers: [...obj] });
        break;
      case 'ugtOffers':
        obj = [...this.state.ugtOffers];
        obj[index] = value;
        this.setState({ ugtOffers: [...obj] });
        break;
      case 'activeGamesList':
        obj = [...this.state.activeGamesList];
        obj[index] = value;
        this.setState({ activeGamesList: [...obj] });
      case 'allowedHosts':
        obj = [...this.state.allowedHosts];
        obj[index] = value;
        this.setState({ allowedHosts: [...obj] });
        break;
      default:
        break;
    }
  }

  addRow(stateObject) {
    let obj = [];
    switch (stateObject) {
      case 'allowedDurations':
        obj = [...this.state.allowedDurations];
        obj.push(0);
        this.setState({ allowedDurations: [...obj] });
        break;
      case 'allowedEntryfees':
        obj = [...this.state.allowedEntryfees];
        obj.push(0);
        this.setState({ allowedEntryfees: [...obj] });
        break;
      case 'allowedMaxPlayers':
        obj = [...this.state.allowedMaxPlayers];
        obj.push(0);
        this.setState({ allowedMaxPlayers: [...obj] });
        break;
      case 'offers':
        obj = [...this.state.offers];
        obj.push(0);
        this.setState({ offers: [...obj] });
        break;
      case 'ugtOffers':
        obj = [...this.state.ugtOffers];
        obj.push(0);
        this.setState({ ugtOffers: [...obj] });
        break;
      case 'activeGamesList':
        obj = [...this.state.activeGamesList];
        obj.push(0);
        this.setState({ activeGamesList: [...obj] });
      case 'allowedHosts':
        obj = [...this.state.allowedHosts];
        obj.push(0);
        this.setState({ allowedHosts: [...obj] });
        break;
      default:
        break;
    }
  }

  removeRow(stateObject) {
    let obj = [];
    switch (stateObject) {
      case 'allowedDurations':
        obj = [...this.state.allowedDurations];
        obj.pop();
        this.setState({ allowedDurations: [...obj] });
        break;
      case 'allowedEntryfees':
        obj = [...this.state.allowedEntryfees];
        obj.pop();
        this.setState({ allowedEntryfees: [...obj] });
        break;
      case 'allowedMaxPlayers':
        obj = [...this.state.allowedMaxPlayers];
        obj.pop();
        this.setState({ allowedMaxPlayers: [...obj] });
        break;
      case 'offers':
        obj = [...this.state.offers];
        obj.pop();
        this.setState({ offers: [...obj] });
        break;
      case 'ugtOffers':
        obj = [...this.state.ugtOffers];
        obj.pop();
        this.setState({ ugtOffers: [...obj] });
        break;
      case 'activeGamesList':
        obj = [...this.state.activeGamesList];
        obj.pop();
        this.setState({ activeGamesList: [...obj] });
      case 'allowedHosts':
        obj = [...this.state.allowedHosts];
        obj.pop();
        this.setState({ allowedHosts: [...obj] });
        break;
      default:
        break;
    }
  }

  inputChanged(value, stateObject) {
    switch (stateObject) {
      case 'minHostTournamentTier':
        this.setState({ minHostTournamentTier: value });
        break;
      case 'allowRepeatedFollowerInvitations':
        this.setState({ allowRepeatedFollowerInvitations: value });
        break;
      case 'defaultHostType':
        this.setState({ defaultHostType: value });
        break;
      case 'offersActive':
        this.setState({ offersActive: value });
        break;
      case 'ugtOffersActive':
        this.setState({ ugtOffersActive: value });
        break;
      case 'marginPercentage':
        this.setState({ marginPercentage: value });
        break;
      case 'defaultHostPercentage':
        this.setState({ defaultHostPercentage: value });
        break;
      case 'forceJoin':
        this.setState({ forceJoin: value });
        break;
      case 'rateLimiters':
        this.setState({ rateLimiters: value });
        break;
      case 'dndFilter':
        this.setState({ dndFilter: value });
        break;
      case 'eligibilityCriteria':
        this.setState({ eligibilityCriteria: value });
        break;
      default:
        break;
    }
  }
  saveToZookeeper() {
    let data = {
      allowedDurations: [...this.state.allowedDurations],
      allowedEntryfees: [...this.state.allowedEntryfees],
      allowedMaxPlayers: [...this.state.allowedMaxPlayers],
      minHostTournamentTier: this.state.minHostTournamentTier,
      allowRepeatedFollowerInvitations: this.state
        .allowRepeatedFollowerInvitations,
      defaultHostType: this.state.defaultHostType,
      offersActive: this.state.offersActive,
      offers: [...this.state.offers],
      ugtOffersActive: this.state.ugtOffersActive,
      ugtOffers: [...this.state.ugtOffers],
      marginPercentage: this.state.marginPercentage,
      defaultHostPercentage: this.state.defaultHostPercentage,
      forceJoin: this.state.forceJoin,
      rateLimiters: this.state.rateLimiters,
      dndFilter: this.state.dndFilter,
      eligibilityCriteria: this.state.eligibilityCriteria
    };
    this.props.actions.setUgtConfigs(data).then(() => {
      if (this.props.setUgtConfigResponse) {
        if (this.props.setUgtConfigResponse.success) {
          message
            .success('Successfully updated the zookeeper config', 1.5)
            .then(() => {
              window.location.reload();
            });
        } else {
          message.error('Could not update the zookeeper configs');
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loaded && (
          <Form onSubmit={this.handleSubmit}>
            <Card title={'UGT Configuration'}>
              <Card type="inner">
                <Col span={4}>Allowed Durations: </Col>
                <Col span={20}>
                  {this.state.allowedDurations.map((item, index) => (
                    <span style={{ margin: '5px' }}>
                      <InputNumber
                        onChange={value =>
                          this.arrayInputChanged(
                            value,
                            'allowedDurations',
                            index
                          )
                        }
                        value={item}
                      />
                      {index === this.state.allowedDurations.length - 1 && (
                        <Icon
                          key={'ADD_ICON_allowedDurations'}
                          style={{
                            margin: '5px',
                            color: 'green'
                          }}
                          type="plus-circle"
                          onClick={() => this.addRow('allowedDurations')}
                        />
                      )}
                      {index === this.state.allowedDurations.length - 1 &&
                        this.state.allowedDurations.length > 1 && (
                          <Icon
                            key={'REMOVE_ICON_allowedDurations'}
                            style={{ margin: '5px', color: 'red' }}
                            type="minus-circle"
                            onClick={() => this.removeRow('allowedDurations')}
                          />
                        )}
                    </span>
                  ))}
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Allowed Entry Fees: </Col>
                <Col span={20}>
                  {this.state.allowedEntryfees.map((item, index) => (
                    <span style={{ margin: '5px' }}>
                      <InputNumber
                        onChange={value =>
                          this.arrayInputChanged(
                            value,
                            'allowedEntryfees',
                            index
                          )
                        }
                        value={item}
                      />
                      {index === this.state.allowedEntryfees.length - 1 && (
                        <Icon
                          key={'ADD_ICON_allowedEntryfees'}
                          style={{ margin: '5px', color: 'green' }}
                          type="plus-circle"
                          onClick={() => this.addRow('allowedEntryfees')}
                        />
                      )}
                      {index === this.state.allowedEntryfees.length - 1 &&
                        this.state.allowedEntryfees.length > 1 && (
                          <Icon
                            key={'REMOVE_ICON_allowedEntryfees'}
                            style={{ margin: '5px', color: 'red' }}
                            type="minus-circle"
                            onClick={() => this.removeRow('allowedEntryfees')}
                          />
                        )}
                    </span>
                  ))}
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Allowed Max Players: </Col>
                <Col span={20}>
                  {this.state.allowedMaxPlayers.map((item, index) => (
                    <span style={{ margin: '5px' }}>
                      <InputNumber
                        onChange={value =>
                          this.arrayInputChanged(
                            value,
                            'allowedMaxPlayers',
                            index
                          )
                        }
                        value={item}
                      />
                      {index === this.state.allowedMaxPlayers.length - 1 && (
                        <Icon
                          key={'ADD_ICON_allowedMaxPlayers'}
                          style={{ margin: '5px', color: 'green' }}
                          type="plus-circle"
                          onClick={() => this.addRow('allowedMaxPlayers')}
                        />
                      )}
                      {index === this.state.allowedMaxPlayers.length - 1 &&
                        this.state.allowedMaxPlayers.length > 1 && (
                          <Icon
                            key={'REMOVE_ICON_allowedMaxPlayers'}
                            style={{ margin: '5px', color: 'red' }}
                            type="minus-circle"
                            onClick={() => this.removeRow('allowedMaxPlayers')}
                          />
                        )}
                    </span>
                  ))}
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Min Host Tournament Tier: </Col>
                <Col span={20}>
                  {/* <Input
                    style={{ width: '80%' }}
                    size="small"
                    value={this.state.minHostTournamentTier}
                    onChange={e =>
                      this.inputChanged(e.target.value, 'minHostTournamentTier')
                    }
                  /> */}
                  <Select
                    size="small"
                    style={{ width: '200px' }}
                    value={this.state.minHostTournamentTier}
                    onChange={e =>
                      this.inputChanged(e, 'minHostTournamentTier')
                    }
                  >
                    {tierList}
                  </Select>
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Allow Repeated Follower Invitations: </Col>
                <Col span={20}>
                  <Switch
                    checked={this.state.allowRepeatedFollowerInvitations}
                    onChange={e =>
                      this.inputChanged(e, 'allowRepeatedFollowerInvitations')
                    }
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Default Host Type: </Col>
                <Col span={20}>
                  <Input
                    style={{ width: '80%' }}
                    size="small"
                    value={this.state.defaultHostType}
                    onChange={e =>
                      this.inputChanged(e.target.value, 'defaultHostType')
                    }
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Offers Active: </Col>
                <Col span={20}>
                  <Switch
                    checked={this.state.offersActive}
                    onChange={e => this.inputChanged(e, 'offersActive')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Offers: </Col>
                <Col span={20}>
                  {this.state.offers.map((item, index) => (
                    <div style={{ margin: '5px' }}>
                      <Input
                        style={{ margin: '5px' }}
                        size="small"
                        style={{ width: '80%' }}
                        value={item}
                        onChange={e =>
                          this.arrayInputChanged(
                            e.target.value,
                            'offers',
                            index
                          )
                        }
                      />
                      {index === this.state.offers.length - 1 && (
                        <Icon
                          key={'ADD_ICON_offers'}
                          style={{ margin: '5px', color: 'green' }}
                          type="plus-circle"
                          onClick={() => this.addRow('offers')}
                        />
                      )}
                      {index === this.state.offers.length - 1 &&
                        this.state.offers.length > 1 && (
                          <Icon
                            key={'REMOVE_ICON_offers'}
                            style={{ margin: '5px', color: 'red' }}
                            type="minus-circle"
                            onClick={() => this.removeRow('offers')}
                          />
                        )}
                    </div>
                  ))}
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>UGT Offers Active: </Col>
                <Col span={20}>
                  <Switch
                    checked={this.state.ugtOffersActive}
                    onChange={e => this.inputChanged(e, 'ugtOffersActive')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>UGT Offers: </Col>
                <Col span={20}>
                  {this.state.ugtOffers.map((item, index) => (
                    <div style={{ margin: '5px' }}>
                      <Input
                        style={{ margin: '5px' }}
                        size="small"
                        style={{ width: '80%' }}
                        value={item}
                        onChange={e =>
                          this.arrayInputChanged(
                            e.target.value,
                            'ugtOffers',
                            index
                          )
                        }
                      />
                      {index === this.state.ugtOffers.length - 1 && (
                        <Icon
                          key={'ADD_ICON_ugtOffers'}
                          style={{ margin: '5px', color: 'green' }}
                          type="plus-circle"
                          onClick={() => this.addRow('ugtOffers')}
                        />
                      )}
                      {index === this.state.ugtOffers.length - 1 &&
                        this.state.ugtOffers.length > 1 && (
                          <Icon
                            key={'REMOVE_ICON_ugtOffers'}
                            style={{ margin: '5px', color: 'red' }}
                            type="minus-circle"
                            onClick={() => this.removeRow('ugtOffers')}
                          />
                        )}
                    </div>
                  ))}
                </Col>
              </Card>
              {/* <Card type="inner">
                <Col span={4}>Active Games List: </Col>
                <Col span={20}>
                  {this.state.activeGamesList.map((item, index) => (
                    <span style={{ margin: '5px' }}>
                      <InputNumber
                        key={'A' + index}
                        onChange={value =>
                          this.arrayInputChanged(
                            value,
                            'activeGamesList',
                            index
                          )
                        }
                        value={item}
                      />
                      {index === this.state.activeGamesList.length - 1 && (
                        <Icon
                          key={'ADD_ICON_activeGamesList'}
                          style={{ margin: '5px', color: 'green' }}
                          type="plus-circle"
                          onClick={() => this.addRow('activeGamesList')}
                        />
                      )}
                      {index === this.state.activeGamesList.length - 1 &&
                        this.state.activeGamesList.length > 1 && (
                          <Icon
                            key={'REMOVE_ICON_activeGamesList'}
                            style={{ margin: '5px', color: 'red' }}
                            type="minus-circle"
                            onClick={() => this.removeRow('activeGamesList')}
                          />
                        )}
                    </span>
                  ))}
                </Col>
              </Card> */}
              <Card type="inner">
                <Col span={4}>Margin Percentage: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.marginPercentage}
                    onChange={e => this.inputChanged(e, 'marginPercentage')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Default Host Percentage: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.defaultHostPercentage}
                    onChange={e =>
                      this.inputChanged(e, 'defaultHostPercentage')
                    }
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Force Join: </Col>
                <Col span={20}>
                  <Switch
                    checked={this.state.forceJoin}
                    onChange={e => this.inputChanged(e, 'forceJoin')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Rate Limiters: </Col>
                <Col span={20}>
                  <Input
                    style={{ width: '80%' }}
                    size="small"
                    value={this.state.rateLimiters}
                    onChange={e =>
                      this.inputChanged(e.target.value, 'rateLimiters')
                    }
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>DND Filter: </Col>
                <Col span={20}>
                  <Switch
                    checked={this.state.dndFilter}
                    onChange={e => this.inputChanged(e, 'dndFilter')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Eligibility Criteria: </Col>
                <Col span={20}>
                  <Input
                    style={{ width: '80%' }}
                    size="small"
                    value={this.state.eligibilityCriteria}
                    onChange={e =>
                      this.inputChanged(e.target.value, 'eligibilityCriteria')
                    }
                  />
                </Col>
              </Card>
              <Row style={{ marginTop: '20px' }}>
                <Col span={12} offset={12}>
                  <Button
                    style={{ float: 'none' }}
                    type="primary"
                    onClick={() => this.saveToZookeeper()}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Card>
          </Form>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getUgtConfigResponse: state.ug.getUgtConfigResponse,
    setUgtConfigResponse: state.ug.setUgtConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...userGeneratedActions }, dispatch)
  };
}
const UgtConfigForm = Form.create()(UgtConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UgtConfigForm);
