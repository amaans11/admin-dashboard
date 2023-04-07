import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dynamicUpsellingActions from '../../actions/dynamicUpsellingActions';
import moment from 'moment';
import _ from 'lodash';
import {
  Table,
  Button,
  Card,
  Modal,
  message,
  Select,
  Divider,
  Tooltip
} from 'antd';

export class DUListOffers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabledGamesList: [],
      showConfig: false,
      showConfigModal: false,
      offerDetails: {},
      selectedRecord: {},
      loading: true,
      gameId: undefined,
      countryCodeList: [],
      isGameSelected: false
    };
  }

  cloneOffer = (record, editType) => {
    this.props.actions.cloneDynamicUpsellingOffer(record, editType);
    this.props.history.push('/dynamic-upselling/create');
  };
  showConfig = record => {
    this.setState({
      showConfigModal: true,
      offerDetails: JSON.stringify(record)
    });
  };

  componentDidMount() {
    this.getUpsellSupportedCountries();
  }

  getUpsellSupportedCountries() {
    this.props.actions.getUpsellAllSupportedCountries().then(() => {
      if (
        this.props.getUpsellAllSupportedCountriesResponse &&
        this.props.getUpsellAllSupportedCountriesResponse.countryCode
      ) {
        this.setState({
          countryCodeList: [
            ...this.props.getUpsellAllSupportedCountriesResponse.countryCode
          ]
        });
      }
    });
  }

  getUpsellingConfigs() {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getDynamicUpsellingConfig(data).then(response => {
      const { config = {} } = this.props.dynamicUpselling;
      let enabledGamesList = [];
      if (Object.keys(config).length) {
        _.get(config, 'enabledGames', []).map(game => {
          enabledGamesList.push(game);
        });
      } else {
        const { enabledGames = [] } = response.data.payload;
        enabledGames.map(game => {
          enabledGamesList.push(game);
        });
      }
      this.setState({ loading: false, enabledGamesList }, () => {
        if (this.state.isGameSelected) {
          this.getDynamicSellingOffers();
        }
      });
    });
  }

  selectCountry(value) {
    this.setState(
      { countryCode: value, countrySelected: true, showConfig: false },
      () => this.getUpsellingConfigs()
    );
  }

  componentWillUnmount() {
    message.destroy();
  }

  gameSelected = gameId => {
    this.setState(
      {
        showConfig: false,
        gameId,
        isGameSelected: true
      },
      () => {
        this.getDynamicSellingOffers();
      }
    );
  };

  getDynamicSellingOffers() {
    let data = {
      gameId: this.state.gameId,
      countryCode: this.state.countryCode
    };
    this.props.actions.getDynamicUpsellingOffersByGame(data).then(() => {
      this.setState({
        showConfig: true,
        isGameSelected: true
      });
    });
  }

  hideModal = () => {
    this.setState({
      showConfigModal: false
    });
  };
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: 'Segments',
        dataIndex: 'segments',
        key: 'segments',
        render: (text, record) => (
          <span>
            {record.segments.length ? record.segments.join(', ') : ''}
          </span>
        )
      },
      {
        title: 'Day of the week',
        dataIndex: 'dayOfTheWeek',
        key: 'dayOfTheWeek'
      },
      {
        title: 'Entry Fee',
        dataIndex: 'entryFeeStart',
        key: 'entryFeeStart',
        render: (text, record) =>
          record.entryFeeStart ? (
            <span>
              {text}&nbsp;{record.currencyType}
            </span>
          ) : (
            'Free'
          )
      },
      {
        title: 'Start and End Time',
        // dataIndex: "startTime",
        // key: "startTime",
        // defaultSortOrder: "descend",
        render: (text, record) => (
          <span>
            <div>{moment(record.startTime).format('DD/MM/YY hh:mm A')}</div>
            <Divider style={{ margin: 2 }} type="horizontal" />
            <div>{moment(record.endTime).format('DD/MM/YY hh:mm A')}</div>
          </span>
        )
        // sorter: (a, b) => a.startTime - b.startTime
      },
      {
        title: 'Rewards',
        dataIndex: 'rewards',
        key: 'rewards'
      },
      {
        title: 'Offer Actions',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Tooltip
              placement="topLeft"
              title="Show offer Details"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="info"
                onClick={() => this.showConfig(record)}
                type="primary"
              />
            </Tooltip>
            <Divider type="vertical" />

            <Tooltip
              placement="topLeft"
              title="Clone offer to create new offer"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="copy"
                onClick={() => this.cloneOffer(record, 'clone')}
                type="primary"
              />
            </Tooltip>
            <Divider style={{ margin: 5 }} type="horizontal" />

            <Tooltip placement="topLeft" title="Edit Offer" arrowPointAtCenter>
              <Button
                shape="circle"
                icon="edit"
                onClick={() => this.cloneOffer(record, 'edit')}
                type="primary"
              />
            </Tooltip>
            {/* <Divider type="vertical" />
            {record.active ? (
              <Button
                shape="circle"
                icon="delete"
                type="danger"
                onClick={() => this.deactiveOffer(record, false)}
              />
            ) : (
              <Popconfirm
                title="Sure to activate offer?"
                onConfirm={() => this.activateOffer(record, true)}
              >
                <Button shape="circle" icon="check" type="danger" />
              </Popconfirm>
            )} */}

            <span />
          </span>
        )
      }
    ];
    return (
      <div style={{ margin: '.5rem' }}>
        <Card>
          <Select
            showSearch
            style={{ width: 300 }}
            onSelect={e => this.selectCountry(e)}
            placeholder="Select a country"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.countryCodeList.map(countryCode => {
              return (
                <Select.Option
                  key={'countryCode' + countryCode}
                  value={countryCode}
                >
                  {countryCode}
                </Select.Option>
              );
            })}
          </Select>
          {this.state.countrySelected && (
            <Select
              showSearch
              onSelect={this.gameSelected}
              style={{ width: 300, marginLeft: '20px' }}
              placeholder="Select a Game"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.enabledGamesList.map(game => {
                return (
                  <Select.Option key={'game' + game.id} value={game.id}>
                    {game.name + ' (' + game.id + ')'}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </Card>
        {this.state.showConfig ? (
          <React.Fragment>
            <Card title="Game wise offer list">
              <Table
                rowKey="id"
                bordered
                dataSource={_.get(
                  this.props.dynamicUpselling,
                  'offersByGameResponse',
                  []
                )}
                columns={columns}
                scroll={{ x: '100%' }}
              />
            </Card>
            <Modal
              title="Offer Details"
              closable={true}
              maskClosable={true}
              width={800}
              onCancel={this.hideModal}
              onOk={this.hideModal}
              visible={this.state.showConfigModal}
            >
              <Card bordered={false}>
                {this.state.offerDetails ? this.state.offerDetails : ''}
              </Card>
            </Modal>
          </React.Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dynamicUpselling: state.dynamicUpselling,
    currentUser: state.auth.currentUser,
    getUpsellAllSupportedCountriesResponse:
      state.dynamicUpselling.getUpsellAllSupportedCountriesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...dynamicUpsellingActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DUListOffers);
