import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Card,
  DatePicker,
  message,
  Modal,
  Select,
  Table,
  Tooltip,
  Input,
  Icon
} from 'antd';
import CreateBroadcastForm from './CreateBroadcastForm';
import '../../styles/components/broadcast.css';
import * as storageActions from '../../actions/storageActions';
import * as broadcastActions from '../../actions/broadcastActions';
import moment from 'moment';
import { stringSort } from '../../shared/util';
import CreateTournamentForm from './CreateTournamentForm';
import Highlighter from 'react-highlight-words';

const { Option } = Select;
const { RangePicker } = DatePicker;

const START_TIME_OFFSET = 0;
const END_TIME_OFFSET = 0;

class GBBattles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cdnPath: '',
      dashboardBattle: [],
      broadcasters: [],
      selectedRowKeys: [],
      selectedRows: [],
      isCreateBroadcastModal: false,
      isError: false,
      isCreateTournamentModal: false,
      tournaments: [],
      supportedGames: [],
      activeGameId: '',
      startTime: '',
      endTime: '',
      isInfoModalVisible: false,
      infoRecord: {},
      isLoading: false,
      roundFilters: [],
      filteredInfo: null,
      searchText: '',
      searchedColumn: '',
      index: 0
    };
    this.resetSearchButton = React.createRef();
    // ref to ceate broadcast form
    this.broadcastFormRef = React.createRef();
    this.tournamentFormRef = React.createRef();
  }

  componentDidMount() {
    // Set default startTime and endTime
    const startTime = moment()
      // .subtract(START_TIME_OFFSET, 'day')
      // .startOf('day')
      .format('x')
      .toString();
    const endTime = moment()
      .add(END_TIME_OFFSET, 'day')
      .endOf('day')
      .format('x')
      .toString();

    this.setState({ startTime, endTime });

    this.getCdnLink();
    this.getBroadcastersList();
    this.getTournaments();
    this.getSupportedGames();
  }

  getCdnLink = () => {
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        const cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
  };

  getSupportedGames = () => {
    this.props.actions.getGamesForGB().then(() => {
      const { gameObj = [] } = this.props.getGamesForGBResponse || {};
      this.setState({ supportedGames: gameObj });
    });
  };

  filterOriginalRoundname = searchArray => {
    let originalRounds = {};
    searchArray.forEach(({ koRoundName }) => {
      if (!(koRoundName in originalRounds)) {
        originalRounds[koRoundName] = 1;
      } else {
        originalRounds[koRoundName] += 1;
      }
    });
    let roundFilters = [];
    for (let key in originalRounds) {
      roundFilters.push({ text: key, value: key });
    }
    return roundFilters;
  };

  getDashbaordBattles = () => {
    const { activeGameId, startTime, endTime } = this.state;
    this.setState({ isLoading: true });
    if (activeGameId !== '') {
      this.props.actions
        .getBattlesForGB({ gameIds: [activeGameId], startTime, endTime })
        .then(() => {
          const { dashboardBattle = [] } =
            this.props.getBattlesForGBResponse || {};
          if (dashboardBattle.length) {
            let roundFilters = this.filterOriginalRoundname(dashboardBattle);
            this.setState({
              roundFilters,
              dashboardBattle,
              isError: false,
              isLoading: false
            });
          } else if (!dashboardBattle.length) {
            this.setState({
              dashboardBattle,
              isError: false,
              isLoading: false
            });
          } else {
            this.setState({ isError: true, isLoading: false });
          }
        });
    } else {
      this.setState({
        dashboardBattle: [],
        isError: false,
        isLoading: false
      });
    }
  };

  getBroadcastersList = () => {
    this.props.actions.getBroadcasters().then(() => {
      const { broadcasters = [] } = this.props.getBroadcastersResponse || {};
      this.setState({ broadcasters });
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  showCreateBroadcast = () => {
    this.setState({ isCreateBroadcastModal: true });
  };

  closeCreateBroadcast = () => {
    this.setState({ isCreateBroadcastModal: false });
  };

  handleSubmit = (values, idValues) => {
    const { selectedRows, broadcasters, tournaments } = this.state;
    values.selectedBattles = [...selectedRows];

    const foundBrod = broadcasters.find(bd => bd.id === values.broadcasterId);
    const broadcaster = {
      broadcasterId: foundBrod.id,
      broadcasterName: foundBrod.name,
      broadcasterEmailId: foundBrod.emailId
    };
    values.broadcaster = broadcaster;

    const startTimeArr = selectedRows.map(row => parseInt(row.startTime, 10));
    const endTimeArr = selectedRows.map(row => parseInt(row.endTime, 10));
    values.scheduledStartTime = Math.min(...startTimeArr).toString();
    values.scheduledEndTime = Math.max(...endTimeArr).toString();

    values.tournament = tournaments.find(tr => tr.id === values.tournament);

    // uploading the url id instead of entire url.
    values.thumbnailUrl = idValues.thumbnailUrlId;
    values.tileUrl = idValues.tileUrlID;
    if (idValues.thumbnailUrlId !== null && idValues.tileUrlID !== null) {
      // console.log(values)
      this.createBroadcast(values);
    } else {
      if (idValues.thumbnailUrlId === null) {
        message.error(
          'Thumbnail Image was not properly uploaded, re-upload again'
        );
      } else if (idValues.tileUrlID === null) {
        message.error('Tile image was not properly uploaded, re-upload again');
      }
    }
  };

  createBroadcast = broadcastDetails => {
    this.props.actions.createBroadcast({ broadcastDetails }).then(() => {
      if (
        this.props.createBroadcastResponse.status &&
        this.props.createBroadcastResponse.status.code === 200
      ) {
        message.success('Broadcast Created!');
        this.broadcastFormRef.resetForm();
        this.closeCreateBroadcast();
        this.setState({ selectedRowKeys: [], scheduledStartTime: [] });
        this.getDashbaordBattles();
      } else {
        message.error('Broadcast Creation failed!');
      }
    });
  };

  showCreateTournament = () => {
    this.setState({ isCreateTournamentModal: true });
  };

  closeCreateTournament = () => {
    this.setState({ isCreateTournamentModal: false });
  };

  createTournament = data => {
    this.props.actions.createTournamentGB(data).then(() => {
      if (
        this.props.createTournamentGBResponse.status &&
        this.props.createTournamentGBResponse.status.code === 200
      ) {
        message.success('Tournament Created!');
        this.tournamentFormRef.resetForm();
        this.closeCreateTournament();
        this.getTournaments();
      } else {
        message.error('Tournament Creation failed!');
      }
    });
  };

  getTournaments = () => {
    this.props.actions.getTournamentsGB().then(() => {
      const { tournament = [] } = this.props.getTournamentsGBResponse || {};
      this.setState({ tournaments: tournament });
    });
  };

  handleGameChange = activeGameId => {
    this.setState(
      {
        activeGameId,
        roundFilters: [],
        searchText: '',
        filteredInfo: null,
        searchedColumn: '',
        index: this.state.index + 1
      },
      () => {
        this.getDashbaordBattles();
      }
    );
  };

  onDateChange = date => {
    let [startTime, endTime] = date;
    if (startTime && endTime) {
      startTime = startTime.format('x').toString();
      endTime = endTime.format('x').toString();
    }
    this.setState({ startTime, endTime });
  };

  disabledDate = current => current && current < moment().startOf('day');

  showInfoModal = infoRecord => {
    this.setState({
      isInfoModalVisible: true,
      infoRecord
    });
  };

  hideInfoModal = () => {
    this.setState({
      isInfoModalVisible: false
    });
  };

  handleTableChangeInfo = (pagination, filters) => {
    this.setState({
      filteredInfo: filters
    });
  };

  getColumnSearchProps = dataIndex =>
    this.state.dashboardBattle.length > 0 && {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon
          type="search"
          style={{ color: filtered ? '#1890ff' : undefined }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: text =>
        this.state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        )
    };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    let searchMatching = [];
    this.state.dashboardBattle.forEach(value => {
      let present = value.koTournamentName
        .toString()
        .toLowerCase()
        .includes(selectedKeys[0].toLowerCase());
      if (present) {
        searchMatching.push(value);
      }
    });
    let roundFilters = this.filterOriginalRoundname(searchMatching);
    this.setState({
      roundFilters,
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    let roundFilters = this.filterOriginalRoundname(this.state.dashboardBattle);
    this.setState({ searchText: '', roundFilters });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };
  render() {
    const {
      selectedRows,
      selectedRowKeys,
      dashboardBattle,
      broadcasters,
      isCreateBroadcastModal,
      cdnPath,
      isCreateTournamentModal,
      tournaments,
      activeGameId,
      supportedGames,
      startTime,
      endTime,
      isInfoModalVisible,
      infoRecord,
      isLoading
    } = this.state;

    let { filteredInfo, roundFilters } = this.state;

    filteredInfo = filteredInfo || {};

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.broadcastCreated,
        name: record.derivedRoundId
      })
    };

    const hasSelected = selectedRows.length > 0;

    const columns = [
      {
        title: 'Game',
        dataIndex: 'gameName',
        key: 'gameName',
        sorter: (a, b) => stringSort(a.gameName, b.gameName)
      },
      {
        title: 'Tournament',
        dataIndex: 'koTournamentName',
        key: 'koTournamentName',
        ...this.getColumnSearchProps('koTournamentName'),
        sorter: (a, b) => stringSort(a.koTournamentName, b.koTournamentName)
      },
      {
        title: 'Tournament ID',
        dataIndex: 'koTournamentId',
        key: 'koTournamentId',
        sorter: (a, b) => a.koTournamentId - b.koTournamentId
      },
      {
        title: 'Round',
        dataIndex: 'koRoundName',
        key: 'koRoundName',
        filters: roundFilters,
        filteredValue: filteredInfo.koRoundName || null,
        onFilter: (value, record) => record.koRoundName === value,
        sorter: (a, b) => stringSort(a.koRoundName, b.koRoundName)
      },
      {
        title: 'KO Battle ID',
        dataIndex: 'koBattleId',
        key: 'koBattleId',
        sorter: (a, b) => a.koBattleId - b.koBattleId
      },
      {
        title: 'Starts At',
        dataIndex: 'startTime',
        key: 'startAt',
        render: text => (
          <span>
            {moment(parseInt(text, 10)).format('YYYY-MMM-Do hh:mm:ss A')}
          </span>
        ),
        sorter: (a, b) => stringSort(a.startTime, b.startTime)
      },
      {
        title: 'End At',
        dataIndex: 'endTime',
        key: 'endTime',
        render: text => (
          <span>
            {moment(parseInt(text, 10)).format('YYYY-MMM-Do hh:mm:ss A')}
          </span>
        ),
        sorter: (a, b) => stringSort(a.endTime, b.endTime)
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Tooltip
              placement="topLeft"
              title="Show more details"
              arrowPointAtCenter
            >
              <Button
                icon="info-circle"
                type="primary"
                ghost
                onClick={() => this.showInfoModal(record)}
              />
            </Tooltip>
          </span>
        )
      }
    ];

    return (
      <Card
        className="page-container"
        title="Battles"
        extra={
          <div>
            <Select
              showSearch
              style={{ minWidth: '200px', marginRight: '1rem' }}
              placeholder="Select a game"
              optionFilterProp="children"
              onChange={this.handleGameChange}
              loading={isLoading}
              disabled={isLoading}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {supportedGames.map((game, idx) => (
                <Option key={'gameOpt-' + idx} value={game.gameId}>
                  {game.gameName + ' (' + game.gameId + ')'}
                </Option>
              ))}
            </Select>

            <RangePicker
              showTime
              allowClear="true"
              format="YYYY-MMM-DD HH:mm:ss A"
              placeholder={['Start Date/Time', 'End Date/Time']}
              onChange={this.onDateChange}
              style={{ width: '450px' }}
              value={
                startTime && endTime
                  ? [
                      moment(parseInt(startTime, 10)),
                      moment(parseInt(endTime, 10))
                    ]
                  : []
              }
              onOk={this.getDashbaordBattles}
              disabledDate={this.disabledDate}
            />
          </div>
        }
      >
        {activeGameId !== '' ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '.5rem'
              }}
            >
              <div>
                <em style={{ marginLeft: 8 }}>
                  {hasSelected
                    ? `Selected ${selectedRowKeys.length} items`
                    : 'Select battles to create broadcast'}
                </em>
              </div>

              <div>
                <Button
                  ghost
                  type="primary"
                  onClick={this.showCreateTournament}
                  style={{ marginRight: '1rem' }}
                >
                  Create Tournament
                </Button>
                <Button
                  type="primary"
                  disabled={!hasSelected}
                  onClick={this.showCreateBroadcast}
                >
                  Create Broadcast
                </Button>
              </div>
            </div>

            <Table
              bordered
              rowSelection={rowSelection}
              dataSource={dashboardBattle}
              columns={columns}
              rowKey={record => record.derivedBattleId}
              loading={isLoading}
              onChange={this.handleTableChangeInfo}
              rowClassName={record =>
                record.broadcastCreated ? 'disabled-row' : ''
              }
              key={this.state.index}
            />
          </>
        ) : (
          'Select a game from above to load battles'
        )}

        <Modal
          style={{ top: 10 }}
          title="Create Broadcast"
          visible={isCreateBroadcastModal}
          onOk={this.closeCreateBroadcast}
          onCancel={this.closeCreateBroadcast}
          footer={null}
          wrapClassName="create-broadcast-pop"
          destroyOnClose={true}
        >
          <CreateBroadcastForm
            wrappedComponentRef={form => (this.broadcastFormRef = form)}
            cdnPath={cdnPath}
            broadcasters={broadcasters}
            tournaments={tournaments}
            selectedBattles={selectedRows}
            handleSubmit={this.handleSubmit}
          />
        </Modal>

        <Modal
          style={{ top: 10 }}
          title="Create Trournament"
          visible={isCreateTournamentModal}
          onOk={this.closeCreateTournament}
          onCancel={this.closeCreateTournament}
          footer={null}
          wrapClassName="create-broadcast-pop"
          destroyOnClose={true}
        >
          <CreateTournamentForm
            wrappedComponentRef={form => (this.tournamentFormRef = form)}
            handleSubmit={this.createTournament}
          />
        </Modal>

        <Modal
          title="Battle - Round Info"
          visible={isInfoModalVisible}
          onOk={this.hideInfoModal}
          onCancel={this.hideInfoModal}
          footer={null}
          wrapClassName="create-broadcast-pop"
          destroyOnClose={true}
        >
          <pre>
            <code>{JSON.stringify(infoRecord, null, 2)}</code>
          </pre>
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getCdnPathForUploadResponse: state.storage.getCdnPathForUploadResponse,
  getBattlesForGBResponse: state.broadcast.getBattlesForGBResponse,
  getBroadcastersResponse: state.broadcast.getBroadcastersResponse,
  createBroadcastResponse: state.broadcast.createBroadcastResponse,
  createTournamentGBResponse: state.broadcast.createTournamentGBResponse,
  getTournamentsGBResponse: state.broadcast.getTournamentsGBResponse,
  getGamesForGBResponse: state.broadcast.getGamesForGBResponse,
  checkBroadcasterSlotResponse: state.broadcast.checkBroadcasterSlotResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...storageActions, ...broadcastActions },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GBBattles);
