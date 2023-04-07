import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Card,
  Form,
  message,
  Button,
  Spin,
  Radio,
  Select,
  Table,
  Modal,
  Row,
  Col,
  Input,
  InputNumber,
  Popconfirm
} from 'antd';
import * as superteamCricketFeedActions from '../../actions/SuperteamCricketFeedActions';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const CricketPositionOptions = [
  <Option key={'WK'} value={'WK'}>
    WK
  </Option>,
  <Option key={'BAT'} value={'BAT'}>
    BAT
  </Option>,
  <Option key={'BOW'} value={'BOW'}>
    BOW
  </Option>,
  <Option key={'AR'} value={'AR'}>
    AR
  </Option>
];

class SearchCricketFeedMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchType: 'MATCH_ID', // FEED_MATCH_ID
      matchDetail: {},
      matchDetailFetched: false,
      playerDetailsFetched: false,
      showPlayerModal: false,
      playerDetailList: [],
      playerDisplayList: [],
      searchString: ''
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {};
        switch (values.searchType) {
          case 'MATCH_ID':
            data = {
              matchId: values.matchId
            };
            this.props.actions.getFullMatchDetail(data).then(() => {
              if (this.props.getFeedsFullMatchDetailResponse) {
                this.setState({
                  matchDetail: {
                    ...this.props.getFeedsFullMatchDetailResponse
                  },
                  matchDetailFetched: true
                });
              } else {
                message.info('Could not fetch match details');
                this.setState({
                  matchDetail: {},
                  matchDetailFetched: true
                });
              }
            });
            break;
          case 'FEED_MATCH_ID':
            data = {
              feedMatchId: values.matchId
            };
            this.props.actions.getFullMatchDetailFeed(data).then(() => {
              if (this.props.getFeedsFullMatchDetailFeedResponse) {
                this.setState({
                  matchDetail: {
                    ...this.props.getFeedsFullMatchDetailFeedResponse
                  },
                  matchDetailFetched: true
                });
              } else {
                message.info('Could not fetch match details');
                this.setState({
                  matchDetail: {},
                  matchDetailFetched: true
                });
              }
            });
            break;
          default:
            break;
        }
      }
    });
  }

  getMatchRoster(record) {
    this.setState({ matchId: record.id, leagueId: record.leagueId });
    let data = {
      matchId: record.id
    };
    this.props.actions.getMatchRoster(data).then(() => {
      if (
        this.props.getFeedsMatchRosterResponse &&
        this.props.getFeedsMatchRosterResponse.playerDetails &&
        this.props.getFeedsMatchRosterResponse.playerDetails.length > 0
      ) {
        let playerDetailList = [
          ...this.props.getFeedsMatchRosterResponse.playerDetails
        ];
        this.setState({
          playerDetailList: [...playerDetailList],
          playerDetailsFetched: true,
          showPlayerModal: true,
          playerDisplayList: [...playerDetailList]
        });
      } else {
        message.info('No records fetched');
        this.setState({
          playerDetailList: [],
          playerDetailsFetched: true,
          playerDisplayList: []
        });
      }
    });
  }

  deleteAndUpdateRoster(record) {
    let data = {
      matchId: record.id
    };
    this.props.actions.deleteUpdateRoster(data).then(() => {
      if (this.props.deleteUpdateRosterResponse) {
        if (this.props.deleteUpdateRosterResponse.error) {
          message.error(
            this.props.deleteUpdateRosterResponse.error.message
              ? this.props.deleteUpdateRosterResponse.error.message
              : 'Could not delete and update match roster'
          );
        } else {
          message.success('Successfully deleted and updated match roster');
        }
      }
    });
  }

  closePlayerModal() {
    this.setState(
      {
        playerDetailList: [],
        searchString: '',
        playerDisplayList: []
      },
      () => {
        this.setState({
          showPlayerModal: false
        });
      }
    );
  }

  updateRoster() {
    let verified = true;
    this.setState({ loading: true });
    let playerDetailList = [...this.state.playerDetailList];
    let updatePlayerDetails = [];
    playerDetailList.forEach(element => {
      let cursor = {
        playerId: element.id,
        position: element.position,
        salary: element.salary,
        isActive: element.isActive ? element.isActive : false,
        fullName: element.fullName
      };
      if (element.isActive) {
        if (element.salary < 1 || element.salary > 19) {
          verified = false;
        }
      }
      updatePlayerDetails.push(cursor);
    });
    if (!verified) {
      message.error(
        'Active player salary should be greater than 0 and less than 20'
      );
      this.setState({ loading: false });
      return;
    }

    let data = {
      matchId: this.state.matchId,
      leagueId: this.state.leagueId,
      updatePlayerDetails: [...updatePlayerDetails]
    };
    this.props.actions.updateMatchRoster(data).then(() => {
      this.setState({ loading: false });
      if (this.props.updateFeedsMatchRosterResponse) {
        if (this.props.updateFeedsMatchRosterResponse.error) {
          message.error(
            this.props.updateFeedsMatchRosterResponse.error.message
              ? this.props.updateFeedsMatchRosterResponse.error.message
              : 'Could not update the roster'
          );
        } else {
          message
            .success('Successfully updated the roster', 1.5)
            .then(() => this.setState({ showPlayerModal: false }));
        }
      }
    });
  }

  salaryChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].salary = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  positionChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].position = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  playerStatusChanged(newValue, record) {
    let playerDetailList = [...this.state.playerDetailList];
    let editIndex = _.findIndex(playerDetailList, function(item) {
      return item.id === record.id;
    });
    playerDetailList[editIndex].isActive = newValue;
    this.setState({ playerDetailList: [...playerDetailList] });
  }

  searchPlayer(value) {
    let searchString = value;
    let playerDetailList = [...this.state.playerDetailList];
    let playerDisplayList = [];
    _.forEach(playerDetailList, function(item) {
      if (
        item.fullName &&
        item.fullName.toLowerCase().includes(searchString.toLowerCase())
      ) {
        playerDisplayList.push(item);
      }
    });
    this.setState({
      playerDisplayList: [...playerDisplayList],
      searchString: searchString
    });
  }

  updateMatchDetail() {
    let matchDetail = { ...this.state.matchDetail };
    this.props.actions.editCricketFeedMatchDetail(matchDetail);
    this.props.history.push('update-cricket-match-details');
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const playerColumns = [
      {
        title: 'Player Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Feed Player Id',
        dataIndex: 'feedPlayerUid',
        key: 'feedPlayerUid'
      },
      {
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName',
        sorter: (a, b) => {
          var nameA = a.fullName.toLowerCase();
          var nameB = b.fullName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
      {
        title: 'Is Active',
        key: 'isActive',
        render: (text, record) => (
          <RadioGroup
            style={{ minWidth: '120px' }}
            value={record.isActive ? true : false}
            onChange={e => this.playerStatusChanged(e.target.value, record)}
          >
            <RadioButton value={false}>No</RadioButton>
            <RadioButton value={true}>Yes</RadioButton>
          </RadioGroup>
        )
      },
      {
        title: 'Position',
        key: 'position',
        render: (text, record) => (
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="Select a position"
            optionFilterProp="children"
            value={record.position}
            onChange={e => this.positionChanged(e, record)}
            filterOption={(input, option) =>
              option.props.children
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {CricketPositionOptions}
          </Select>
        ),
        filters: [
          {
            text: 'WK',
            value: 'WK'
          },
          {
            text: 'BAT',
            value: 'BAT'
          },
          {
            text: 'BOW',
            value: 'BOW'
          },
          {
            text: 'AR',
            value: 'AR'
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.position.indexOf(value) === 0
      },
      {
        title: 'Salary',
        key: 'salary',
        render: (text, record) => (
          <Input
            onChange={e => this.salaryChanged(e.target.value, record)}
            value={record.salary}
            max={19}
          />
        ),
        sorter: (a, b) => a.salary - b.salary
      },
      {
        title: 'Team Name',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => {
          var nameA = a.teamName.toLowerCase();
          var nameB = b.teamName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      }
    ];

    const errors = {
      matchId: isFieldTouched('matchId') && getFieldError('matchId')
    };

    const matchDetail = this.state.matchDetail;

    return (
      <React.Fragment>
        <Card title="Cricket Feeds">
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormItem {...formItemLayout} label={'Search Type'}>
              {getFieldDecorator('searchType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: this.state.searchType
              })(
                <RadioGroup name="type">
                  <Radio value={'MATCH_ID'}>MATCH ID</Radio>
                  <Radio value={'FEED_MATCH_ID'}>FEED MATCH ID</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.matchId ? 'error' : ''}
              help={errors.matchId || ''}
              {...formItemLayout}
              label={'Match Id'}
            >
              {getFieldDecorator('matchId', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input match id!'
                  }
                ]
              })(<InputNumber style={{ width: '50%' }} min={0} />)}
            </FormItem>
            <Button type="primary" htmlType="submit">
              Get Match
            </Button>
          </Form>
        </Card>
        {this.state.matchDetailFetched && (
          <Card
            title={'Match Details'}
            extra={
              <Button onClick={() => this.updateMatchDetail()} type="primary">
                Update Match Details
              </Button>
            }
          >
            <Row
              style={{
                backgroundColor:
                  matchDetail.isVerified && matchDetail.verificationLevel === 2
                    ? '#b1bef9'
                    : ''
              }}
            >
              <Col span={12}>
                <strong>Match Id:</strong> {matchDetail.id}
              </Col>
              <Col span={12}>
                <strong>Feed Match Id:</strong> {matchDetail.feedMatchId}
              </Col>
              <Col span={12}>
                <strong>Title:</strong> {matchDetail.title}
              </Col>
              <Col span={12}>
                <strong>Season Scheduled Date: </strong>
                {moment(matchDetail.seasonScheduledDate).format(
                  'DD/MM/YYYY HH:mm'
                )}
              </Col>
              <Col span={12}>
                <strong>League Name:</strong> {matchDetail.leagueName}
              </Col>
              <Col span={12}>
                <strong>Home:</strong> {matchDetail.home}
              </Col>
              <Col span={12}>
                <strong>Away:</strong> {matchDetail.away}
              </Col>
              <Col span={12}>
                <strong>Status:</strong> {matchDetail.status}
              </Col>
              <Col span={12}>
                <strong>Status Overview:</strong> {matchDetail.statusOverview}
              </Col>
              <Col span={12}>
                <strong>Format:</strong>
                {matchDetail.format === '1'
                  ? 'ODI'
                  : matchDetail.format === '2'
                  ? 'TEST'
                  : matchDetail.format === '3'
                  ? 'T20'
                  : 'N/A'}
              </Col>
              <Col span={24}>
                <Button
                  onClick={() => this.getMatchRoster(matchDetail)}
                  type="primary"
                  size="small"
                >
                  Match Roster
                </Button>
                <Popconfirm
                  title="Are you sure to delete and update the roster for this match?"
                  onConfirm={() => this.deleteAndUpdateRoster(matchDetail)}
                >
                  <Button style={{ margin: '2px' }} size="small" type="danger">
                    Delete and Update Roster
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </Card>
        )}
        <Modal
          title={'Player Details'}
          closable={true}
          maskClosable={true}
          width={1100}
          onOk={() => this.updateRoster()}
          onCancel={() => this.closePlayerModal()}
          visible={this.state.showPlayerModal}
          okText="Update Roster"
          cancelText="Close"
        >
          <Spin spinning={this.state.loading}>
            <Card bordered={false}>
              {this.state.playerDetailsFetched && (
                <Card>
                  <Card type="inner">
                    <Input
                      value={this.state.searchString}
                      placeholder={'Search by player name'}
                      onChange={e => this.searchPlayer(e.target.value)}
                    />
                  </Card>
                  <Table
                    rowKey="playerId"
                    bordered
                    pagination={false}
                    dataSource={this.state.playerDisplayList}
                    columns={playerColumns}
                  />
                </Card>
              )}
            </Card>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getFeedsFullMatchDetailResponse:
      state.superteamCricketFeed.getFeedsFullMatchDetailResponse,
    getFeedsFullMatchDetailFeedResponse:
      state.superteamCricketFeed.getFeedsFullMatchDetailFeedResponse,
    getFeedsMatchRosterResponse:
      state.superteamCricketFeed.getFeedsMatchRosterResponse,
    updateFeedsMatchRosterResponse:
      state.superteamCricketFeed.updateFeedsMatchRosterResponse,
    deleteUpdateRosterResponse:
      state.superteamCricketFeed.deleteUpdateRosterResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamCricketFeedActions }, dispatch)
  };
}

const SearchCricketFeedMatchForm = Form.create()(SearchCricketFeedMatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchCricketFeedMatchForm);
