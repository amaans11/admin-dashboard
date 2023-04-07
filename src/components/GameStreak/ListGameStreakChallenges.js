import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameStreakActions from '../../actions/gameStreakActions';
import {
  Card,
  Table,
  Button,
  Modal,
  Popconfirm,
  Pagination,
  Row,
  Col,
  message,
  Divider,
  Badge,
  Select
} from 'antd';
import moment from 'moment';

class ListGameStreakChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCountryListLoaded: false,
      streakChallenges: []
    };
    this.editDetails = this.editDetails.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getSupportedCountries();
  }

  async getSupportedCountries() {
    await this.props.actions.getStreakSupportedCountries();
    if (
      this.props.getStreakSupportedCountriesResponse &&
      this.props.getStreakSupportedCountriesResponse.country &&
      this.props.getStreakSupportedCountriesResponse.country.length > 0
    ) {
      this.setState({
        countryList: [
          ...this.props.getStreakSupportedCountriesResponse.country
        ],
        isCountryListLoaded: true
      });
    } else {
      message.error('Could not fetch supported country list');
    }
  }

  selectCountry(value) {
    this.setState(
      {
        selectedCountryCode: value,
        isCountrySelected: true,
        streakChallenges: []
      },
      () => {
        this.getAllStreakChallenges();
      }
    );
  }

  async getAllStreakChallenges() {
    let { selectedCountryCode } = this.state;
    let data = {
      country: selectedCountryCode
    };
    await this.props.actions.getAllStreakChallenges(data);
    if (
      this.props.getAllStreakChallengesResponse &&
      this.props.getAllStreakChallengesResponse.challenges &&
      this.props.getAllStreakChallengesResponse.challenges.length
    ) {
      let streakChallenges = [
        ...this.props.getAllStreakChallengesResponse.challenges
      ];
      this.setState({
        streakChallenges,
        isListLoaded: true
      });
    } else {
      message.info('Could not fetch game streak list', 1.5);
    }
  }

  editDetails(record) {
    this.props.actions.editStreakChallenge(record);
    this.props.history.push('/game-streak/create');
  }

  render() {
    const columns = [
      {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '75px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.active ? (
              <Badge status="processing" />
            ) : (
              <Badge status="error" />
            )}{' '}
            {record.id}
          </div>
        )
      },
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '75px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.name}
          </div>
        )
      },
      {
        title: 'Description',
        key: 'description',
        dataIndex: 'description',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '75px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.description}
          </div>
        )
      },
      {
        title: 'Entry Fee',
        key: 'entryFee',
        render: record => <div>{record.entryFee ? record.entryFee : 0}</div>
      },
      {
        title: 'Start Date',
        render: record => (
          <span>{moment(record.startDate).format('DD-MMM-YYYY')}</span>
        )
      },
      {
        title: 'End Date',
        render: record => (
          <span>{moment(record.endDate).format('DD-MMM-YYYY')}</span>
        )
      },
      {
        title: 'No Of Days',
        key: 'noOfDays',
        render: record => <div>{record.noOfDays ? record.noOfDays : 0}</div>
      },
      {
        title: 'Game Play sPer Day',
        key: 'gamePlaysPerDay',
        render: record => (
          <div>{record.gamePlaysPerDay ? record.gamePlaysPerDay : 0}</div>
        )
      },
      {
        title: 'Attempts Cap',
        key: 'attemptsCap',
        render: record => (
          <div>{record.attemptsCap ? record.attemptsCap : 0}</div>
        )
      },
      {
        title: 'Wins Cap',
        key: 'winsCap',
        render: record => <div>{record.winsCap ? record.winsCap : 0}</div>
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <div style={{ minWidth: '150px' }}>
            <Button
              icon="edit"
              type="primary"
              size="small"
              onClick={() => this.editDetails(record)}
            />
          </div>
        )
      }
    ];

    const hideModal = () => {
      this.setState({
        showModal: false
      });
    };

    return (
      <Card>
        {this.state.isCountryListLoaded && (
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
            {this.state.countryList.map(countryCode => {
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
        )}
        {this.state.isListLoaded && (
          <Card title={'Game Streak Challenges List'}>
            <Table
              rowKey="id"
              bordered
              dataSource={this.state.streakChallenges}
              columns={columns}
              scroll={{ x: '100%' }}
            />
          </Card>
        )}
      </Card>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAllStreakChallengesResponse:
      state.gameStreak.getAllStreakChallengesResponse,
    getStreakSupportedCountriesResponse:
      state.gameStreak.getStreakSupportedCountriesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...gameStreakActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListGameStreakChallenges);
