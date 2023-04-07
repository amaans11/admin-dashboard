import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Card,
  message,
  Button,
  Spin,
  Table,
  Badge,
  DatePicker,
  Modal,
  Input,
  InputNumber,
  Divider,
  Row,
  Col,
  Switch
} from 'antd';
import * as superteamFeedActions from '../../actions/SuperteamFeedActions';

class League extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      leagueList: [],
      showMatchModal: false,
      matchDetailList: [],
      matchDetailsLoaded: false,
      searchString: '',
      showEditLeagueModal: false
    };
    this.getAllLeague = this.getAllLeague.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAllLeague();
  }

  getAllLeague() {
    this.props.actions
      .getAllLeague()
      .then(() => {
        this.setState({ loading: false });
        if (
          this.props.getFeedsAllLeagueResponse &&
          this.props.getFeedsAllLeagueResponse.leagueDetails &&
          this.props.getFeedsAllLeagueResponse.leagueDetails.length > 0
        ) {
          this.setState({
            leagueList: [...this.props.getFeedsAllLeagueResponse.leagueDetails]
          });
        } else {
          message.info('No records found');
          this.setState({ leagueList: [] });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  openGetMatchModal(record) {
    let data = {
      leagueId: record.id
    };
    this.props.actions.getAllMatchesOfLeague(data).then(() => {
      if (
        this.props.getFeedsLeagueMatchesResponse &&
        this.props.getFeedsLeagueMatchesResponse.matchDetails &&
        this.props.getFeedsLeagueMatchesResponse.matchDetails.length > 0
      ) {
        this.setState({
          matchDetailList: [
            ...this.props.getFeedsLeagueMatchesResponse.matchDetails
          ],
          matchDetailDisplayList: [
            ...this.props.getFeedsLeagueMatchesResponse.matchDetails
          ],
          matchDetailsLoaded: true,
          showMatchModal: true
        });
      } else {
        this.setState({
          matchDetailList: [],
          matchDetailsLoaded: true,
          showMatchModal: true
        });
      }
    });
  }

  closeMatchModal() {
    this.setState({
      matchDetailList: [],
      matchDetailsLoaded: false,
      showMatchModal: false
    });
  }

  searchMatch(value) {
    let searchString = value;
    let matchDetailList = [...this.state.matchDetailList];
    let matchDetailDisplayList = [];
    _.forEach(matchDetailList, function(item) {
      if (
        (item.matchId &&
          item.matchId
            .toString()
            .toLowerCase()
            .includes(searchString.toLowerCase())) ||
        (item.title &&
          item.title.toLowerCase().includes(searchString.toLowerCase()))
      ) {
        matchDetailDisplayList.push(item);
      }
    });
    this.setState({
      matchDetailDisplayList: [...matchDetailDisplayList],
      searchString: searchString
    });
  }

  openCreateEditLeagueModal(record, mode) {
    if (mode === 'EDIT') {
      this.setState({
        leagueId: record.id,
        leagueName: record.name,
        leagueIsActive: record.isActive ? record.isActive : false,
        leagueSeasonId: record.leagueSeasonId ? record.leagueSeasonId : 0,
        leagueStartDate: moment(record.leagueStartDate),
        leagueEndDate: moment(record.leagueEndDate),
        showEditLeagueModal: true,
        createEditMode: mode
      });
    } else {
      this.setState({
        showEditLeagueModal: true,
        createEditMode: mode
      });
    }
  }

  closeEditLeagueModal() {
    this.setState({
      leagueId: null,
      leagueName: null,
      leagueIsActive: null,
      leagueSeasonId: null,
      leagueStartDate: null,
      leagueEndDate: null,
      showEditLeagueModal: false,
      showEditLeagueModal: false
    });
  }

  saveEditLeagueChanges() {
    if (this.state.leagueEndDate < this.state.leagueStartDate) {
      message.error('End date can not be less than start date');
    }
    let leagueDetail = {
      id: this.state.leagueId,
      name: this.state.leagueName,
      isActive: this.state.leagueIsActive,
      leagueSeasonId: this.state.leagueSeasonId,
      leagueStartDate: moment(this.state.leagueStartDate).toISOString(),
      leagueEndDate: moment(this.state.leagueEndDate).toISOString()
    };
    let data = {
      leagueDetail: { ...leagueDetail }
    };
    if (this.state.createEditMode === 'EDIT') {
      this.props.actions.editLeague(data).then(() => {
        if (this.props.getFeedsEditLeagueResponse) {
          if (this.props.getFeedsEditLeagueResponse.error) {
            message.error(
              this.props.getFeedsEditLeagueResponse.error.message
                ? this.props.getFeedsEditLeagueResponse.error.message
                : 'Could not update league details'
            );
          } else {
            message.info('League updated Successfully');
            this.getAllLeague();
            this.setState({
              leagueId: null,
              leagueName: null,
              leagueIsActive: null,
              leagueSeasonId: null,
              leagueStartDate: null,
              leagueEndDate: null,
              showEditLeagueModal: false
            });
          }
        }
      });
    } else {
      this.props.actions.createLeague(data).then(() => {
        if (this.props.feedsCreateLeagueResponse) {
          if (this.props.feedsCreateLeagueResponse.error) {
            message.error(
              this.props.feedsCreateLeagueResponse.error.message
                ? this.props.feedsCreateLeagueResponse.error.message
                : 'Could not create league'
            );
          } else {
            message.info('League created Successfully');
            this.getAllLeague();
            this.setState({
              leagueId: null,
              leagueName: null,
              leagueIsActive: null,
              leagueSeasonId: null,
              leagueStartDate: null,
              leagueEndDate: null,
              showEditLeagueModal: false
            });
          }
        }
      });
    }

    // this.setState({ showEditLeagueModal: false });
  }

  updateFormFields(value, fieldName) {
    switch (fieldName) {
      case 'LEAGUE_ID':
        this.setState({ leagueId: value });
        break;
      case 'LEAGUE_NAME':
        this.setState({ leagueName: value });
        break;
      case 'LEAGUE_IS_ACTIVE':
        this.setState({ leagueIsActive: value });
        break;
      case 'LEAGUE_START_DATE':
        this.setState({ leagueStartDate: value });
        break;
      case 'LEAGUE_END_DATE':
        this.setState({ leagueEndDate: value });
        break;
      case 'LEAGUE_SEASON_ID':
        this.setState({ leagueSeasonId: value });
        break;
      default:
        break;
    }
  }

  render() {
    const columns = [
      {
        title: 'League Id',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => (
          <span>
            <Badge status={record.isActive ? 'processing' : 'error'} />
            <span>{record.id}</span>
          </span>
        ),
        sorter: (a, b) => a.id - b.id
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Start Date',
        key: 'leagueStartDate',
        render: (text, record) => (
          <span>
            {moment(record.leagueStartDate).format('DD/MM/YYYY HH:mm')}
          </span>
        ),
        sorter: (a, b) => {
          var dateA = moment(a.leagueStartDate);
          var dateB = moment(b.leagueStartDate);
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'End Date',
        key: 'leagueEndDate',
        render: (text, record) => (
          <span>{moment(record.leagueEndDate).format('DD/MM/YYYY HH:mm')}</span>
        ),
        sorter: (a, b) => {
          var dateA = moment(a.leagueEndDate);
          var dateB = moment(b.leagueEndDate);
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.openGetMatchModal(record)}
              type="primary"
              size="small"
            >
              League Matches
            </Button>
            <Divider type="vertical" />
            <Button
              onClick={() => this.openCreateEditLeagueModal(record, 'EDIT')}
              type="primary"
              size="small"
              icon="edit"
            />
          </span>
        )
      }
    ];

    const matchColumns = [
      {
        title: 'Match Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Feed Match Id',
        dataIndex: 'feedMatchId',
        key: 'feedMatchId'
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Season Scheduled Date',
        key: 'seasonScheduledDate',
        render: (text, record) => (
          <span>
            {moment(record.seasonScheduledDate).format('DD/MM/YYYY HH:mm')}
          </span>
        ),
        sorter: (a, b) => {
          var dateA = moment(a.seasonScheduledDate);
          var dateB = moment(b.seasonScheduledDate);
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'League Name',
        dataIndex: 'leagueName',
        key: 'leagueName'
      },
      {
        title: 'Home',
        dataIndex: 'home',
        key: 'home'
      },
      {
        title: 'Away',
        dataIndex: 'away',
        key: 'away'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Status Overview',
        dataIndex: 'statusOverview',
        key: 'statusOverview'
      }
    ];

    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Card
            title={'League List'}
            extra={
              <Button
                icon="plus-circle"
                onClick={() => this.openCreateEditLeagueModal({}, 'CREATE')}
              >
                Create League
              </Button>
            }
          >
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.leagueList}
              columns={columns}
            />
          </Card>
        </Spin>
        <Modal
          title={'Match Details'}
          closable={true}
          maskClosable={true}
          width={1100}
          onCancel={() => this.closeMatchModal()}
          visible={this.state.showMatchModal}
          footer={[
            <Button key="back" onClick={() => this.closeMatchModal()}>
              Close
            </Button>
          ]}
        >
          <Spin spinning={this.state.loading}>
            <Card>
              <Card type="inner">
                <Input
                  value={this.state.searchString}
                  placeholder={'Search by match id or title'}
                  onChange={e => this.searchMatch(e.target.value)}
                />
              </Card>
              <Table
                rowKey="matchId"
                bordered
                pagination={false}
                dataSource={this.state.matchDetailDisplayList}
                rowClassName={(record, index) =>
                  record.isVerified && record.verificationLevel === 2
                    ? 'highlight-contest-row'
                    : ''
                }
                columns={matchColumns}
              />
            </Card>
          </Spin>
        </Modal>
        <Modal
          title={'Edit League Details'}
          closable={true}
          maskClosable={true}
          width={1100}
          onCancel={() => this.closeEditLeagueModal()}
          visible={this.state.showEditLeagueModal}
          footer={[
            <Button key="editBack" onClick={() => this.closeEditLeagueModal()}>
              Close
            </Button>,
            <Button
              type="primary"
              key="save"
              onClick={() => this.saveEditLeagueChanges()}
            >
              Save
            </Button>
          ]}
        >
          <Card>
            <Row>
              <Col span={24} style={{ margin: '10px' }}>
                <Col span={6}>
                  <strong>League Id:</strong>
                </Col>
                <Col span={18}>
                  <InputNumber
                    min={0}
                    disabled={this.state.createEditMode === 'EDIT'}
                    precision={0}
                    style={{ width: '60%' }}
                    value={this.state.leagueId}
                    placeholder={'League Id'}
                    onChange={e => this.updateFormFields(e, 'LEAGUE_ID')}
                  />
                </Col>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                <Col span={6}>
                  <strong>Name:</strong>
                </Col>
                <Col span={18}>
                  <Input
                    style={{ width: '60%' }}
                    value={this.state.leagueName}
                    placeholder={'League Name'}
                    onChange={e =>
                      this.updateFormFields(e.target.value, 'LEAGUE_NAME')
                    }
                  />
                </Col>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                <Col span={6}>
                  <strong>Is Active:</strong>
                </Col>
                <Col span={18}>
                  <Switch
                    checked={this.state.leagueIsActive}
                    onChange={e => this.updateFormFields(e, 'LEAGUE_IS_ACTIVE')}
                  />
                </Col>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                <Col span={6}>
                  <strong>League Season Id:</strong>
                </Col>
                <Col span={18}>
                  <InputNumber
                    min={0}
                    precision={0}
                    style={{ width: '60%' }}
                    value={this.state.leagueSeasonId}
                    placeholder={'League Season Id'}
                    onChange={e => this.updateFormFields(e, 'LEAGUE_SEASON_ID')}
                  />
                </Col>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                <Col span={6}>
                  <strong>Start Date:</strong>
                </Col>
                <Col span={18}>
                  <DatePicker
                    showTime
                    style={{ width: '60%' }}
                    value={this.state.leagueStartDate}
                    placeholder="Select Start Date"
                    onChange={e =>
                      this.updateFormFields(e, 'LEAGUE_START_DATE')
                    }
                  />
                </Col>
              </Col>
              <Col span={24} style={{ margin: '10px' }}>
                <Col span={6}>
                  <strong>End Date:</strong>
                </Col>
                <Col span={18}>
                  <DatePicker
                    showTime
                    style={{ width: '60%' }}
                    value={this.state.leagueEndDate}
                    placeholder="Select End Date"
                    onChange={e => this.updateFormFields(e, 'LEAGUE_END_DATE')}
                  />
                </Col>
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getFeedsAllLeagueResponse: state.superteamFeed.getFeedsAllLeagueResponse,
    getFeedsLeagueMatchesResponse:
      state.superteamFeed.getFeedsLeagueMatchesResponse,
    getFeedsEditLeagueResponse: state.superteamFeed.getFeedsEditLeagueResponse,
    feedsCreateLeagueResponse: state.superteamFeed.feedsCreateLeagueResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamFeedActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(League);
