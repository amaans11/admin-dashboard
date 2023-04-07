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

class UgcConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      allowedEntryfees: [],
      defaultHostPercentage: 0,
      forceJoin: false,
      eligibilityCriteria: '',
      marginPercentage: 0,
      supportedSportIds: [],
      defaultMatchDurationHour: 0,
      displayHardstopInMin: 0,
      maxMultipleTeams: 0,
      maxTotalSlots: 0,
      minHostContestTier: '',
      ugcOffersActive: false,
      registrationHardstopInMin: 0,
      ugcOffers: '',
      defaultEntryfeesIndex: 0
    };
  }

  componentDidMount() {
    this.props.actions.getUgcConfigs().then(() => {
      if (this.props.getUgcConfigResponse) {
        let configDetails = JSON.parse(this.props.getUgcConfigResponse);
        this.setState(
          {
            allowedEntryfees: [...configDetails.allowedEntryfees],
            defaultHostPercentage: configDetails.defaultHostPercentage,
            forceJoin: configDetails.forceJoin,
            eligibilityCriteria: configDetails.eligibilityCriteria,
            marginPercentage: configDetails.marginPercentage,
            supportedSportIds: [...configDetails.supportedSportIds],
            defaultMatchDurationHour: configDetails.defaultMatchDurationHour,
            displayHardstopInMin: configDetails.displayHardstopInMin,
            maxMultipleTeams: configDetails.maxMultipleTeams,
            maxTotalSlots: configDetails.maxTotalSlots,
            minHostContestTier: configDetails.minHostContestTier,
            ugcOffersActive: configDetails.ugcOffersActive,
            registrationHardstopInMin: configDetails.registrationHardstopInMin,
            ugcOffers: configDetails.ugcOffers,
            defaultEntryfeesIndex: configDetails.defaultEntryfeesIndex
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
      case 'allowedEntryfees':
        obj = [...this.state.allowedEntryfees];
        obj[index] = value;
        this.setState({ allowedEntryfees: [...obj] });
        break;
      case 'supportedSportIds':
        obj = [...this.state.supportedSportIds];
        obj[index] = value;
        this.setState({ supportedSportIds: [...obj] });
        break;
      default:
        break;
    }
  }

  addRow(stateObject) {
    let obj = [];
    switch (stateObject) {
      case 'allowedEntryfees':
        obj = [...this.state.allowedEntryfees];
        obj.push(0);
        this.setState({ allowedEntryfees: [...obj] });
        break;
      case 'supportedSportIds':
        obj = [...this.state.supportedSportIds];
        obj.push(0);
        this.setState({ supportedSportIds: [...obj] });
        break;
      default:
        break;
    }
  }

  removeRow(stateObject) {
    let obj = [];
    switch (stateObject) {
      case 'allowedEntryfees':
        obj = [...this.state.allowedEntryfees];
        obj.pop();
        this.setState({ allowedEntryfees: [...obj] });
        break;
      case 'supportedSportIds':
        obj = [...this.state.supportedSportIds];
        obj.pop();
        this.setState({ supportedSportIds: [...obj] });
        break;
      default:
        break;
    }
  }

  inputChanged(value, stateObject) {
    switch (stateObject) {
      case 'defaultHostPercentage':
        this.setState({ defaultHostPercentage: value });
        break;
      case 'forceJoin':
        this.setState({ forceJoin: value });
        break;
      case 'eligibilityCriteria':
        this.setState({ eligibilityCriteria: value });
        break;
      case 'marginPercentage':
        this.setState({ marginPercentage: value });
        break;
      case 'defaultMatchDurationHour':
        this.setState({ defaultMatchDurationHour: value });
        break;
      case 'displayHardstopInMin':
        this.setState({ displayHardstopInMin: value });
        break;
      case 'maxMultipleTeams':
        this.setState({ maxMultipleTeams: value });
        break;
      case 'maxTotalSlots':
        this.setState({ maxTotalSlots: value });
        break;
      case 'minHostContestTier':
        this.setState({ minHostContestTier: value });
        break;
      case 'ugcOffersActive':
        this.setState({ ugcOffersActive: value });
        break;
      case 'registrationHardstopInMin':
        this.setState({ registrationHardstopInMin: value });
        break;
      case 'ugcOffers':
        this.setState({ ugcOffers: value });
        break;
      case 'defaultEntryfeesIndex':
        this.setState({ defaultEntryfeesIndex: value });
        break;
      default:
        break;
    }
  }
  saveToZookeeper() {
    let data = {
      allowedEntryfees: [...this.state.allowedEntryfees],
      defaultHostPercentage: this.state.defaultHostPercentage,
      forceJoin: this.state.forceJoin,
      eligibilityCriteria: this.state.eligibilityCriteria,
      marginPercentage: this.state.marginPercentage,
      supportedSportIds: [...this.state.supportedSportIds],
      defaultMatchDurationHour: this.state.defaultMatchDurationHour,
      displayHardstopInMin: this.state.displayHardstopInMin,
      maxMultipleTeams: this.state.maxMultipleTeams,
      maxTotalSlots: this.state.maxTotalSlots,
      minHostContestTier: this.state.minHostContestTier,
      ugcOffersActive: this.state.ugcOffersActive,
      registrationHardstopInMin: this.state.registrationHardstopInMin,
      ugcOffers: this.state.ugcOffers,
      defaultEntryfeesIndex: this.state.defaultEntryfeesIndex
    };
    this.props.actions.setUgcConfigs(data).then(() => {
      if (this.props.setUgcConfigResponse) {
        if (this.props.setUgcConfigResponse.success) {
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
          <Form>
            <Card title={'UGC Configuration'}>
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
                <Col span={4}>Supported Sport Ids: </Col>
                <Col span={20}>
                  {this.state.supportedSportIds.map((item, index) => (
                    <span style={{ margin: '5px' }}>
                      <InputNumber
                        onChange={value =>
                          this.arrayInputChanged(
                            value,
                            'supportedSportIds',
                            index
                          )
                        }
                        value={item}
                      />
                      {index === this.state.supportedSportIds.length - 1 && (
                        <Icon
                          key={'ADD_ICON_supportedSportIds'}
                          style={{ margin: '5px', color: 'green' }}
                          type="plus-circle"
                          onClick={() => this.addRow('supportedSportIds')}
                        />
                      )}
                      {index === this.state.supportedSportIds.length - 1 &&
                        this.state.supportedSportIds.length > 1 && (
                          <Icon
                            key={'REMOVE_ICON_supportedSportIds'}
                            style={{ margin: '5px', color: 'red' }}
                            type="minus-circle"
                            onClick={() => this.removeRow('supportedSportIds')}
                          />
                        )}
                    </span>
                  ))}
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Default Match Duration Hour: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.defaultMatchDurationHour}
                    onChange={e =>
                      this.inputChanged(e, 'defaultMatchDurationHour')
                    }
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Display Hardstop In Min: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.displayHardstopInMin}
                    onChange={e => this.inputChanged(e, 'displayHardstopInMin')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Max Multiple Teams: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.maxMultipleTeams}
                    onChange={e => this.inputChanged(e, 'maxMultipleTeams')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Max Total Slots: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.maxTotalSlots}
                    onChange={e => this.inputChanged(e, 'maxTotalSlots')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Min Host Contest Tier: </Col>
                <Col span={20}>
                  <Select
                    size="small"
                    style={{ width: '200px' }}
                    value={this.state.minHostContestTier}
                    onChange={e => this.inputChanged(e, 'minHostContestTier')}
                  >
                    {tierList}
                  </Select>
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>UGC Offers Active: </Col>
                <Col span={20}>
                  <Switch
                    checked={this.state.ugcOffersActive}
                    onChange={e => this.inputChanged(e, 'ugcOffersActive')}
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Registration Hardstop In Min: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.registrationHardstopInMin}
                    onChange={e =>
                      this.inputChanged(e, 'registrationHardstopInMin')
                    }
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Ugc Offers: </Col>
                <Col span={20}>
                  <Input
                    style={{ width: '80%' }}
                    size="small"
                    value={this.state.ugcOffers}
                    onChange={e =>
                      this.inputChanged(e.target.value, 'ugcOffers')
                    }
                  />
                </Col>
              </Card>
              <Card type="inner">
                <Col span={4}>Default Entryfees Index: </Col>
                <Col span={20}>
                  <InputNumber
                    value={this.state.defaultEntryfeesIndex}
                    onChange={e =>
                      this.inputChanged(e, 'defaultEntryfeesIndex')
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
    getUgcConfigResponse: state.ug.getUgcConfigResponse,
    setUgcConfigResponse: state.ug.setUgcConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...userGeneratedActions }, dispatch)
  };
}
const UgcConfigForm = Form.create()(UgcConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UgcConfigForm);
