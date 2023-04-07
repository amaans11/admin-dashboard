// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as bannerActions from '../../actions/bannerActions';
import * as gameActions from '../../actions/gameActions';
import {
  message,
  Select,
  Divider,
  Switch,
  Icon,
  Button,
  Table,
  Pagination,
  Card,
  Badge,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Modal,
  Input
} from 'antd';
import moment from 'moment';
const Option = Select.Option;

// type ListBanners ={}
const appType = ['CASH', 'PLAY_STORE', 'IOS', 'PWA_NDTV', 'WEBSITE'].map(
  (val, index) => (
    <Option value={val} key={val}>
      {val}
    </Option>
  )
);
const location = [
  'ALL',
  'HOME',
  'FANTASY_HOME',
  'RUMMY',
  'GAMES',
  'DISCOVERY_WIDGET',
  'SUPPORT',
  'DEPOSIT',
  'WITHDRAWAL'
].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
class ListBanners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appType: 'CASH',
      location: 'ALL',
      currentPage: 1,
      activeOnly: false,
      gameList: [],
      showBannerDetailModal: false,
      newConfiguration: false,
      countryCode: 'IN'
    };
    this.deleteBanner = this.deleteBanner.bind(this);
    this.refreshCache = this.refreshCache.bind(this);
    this.getGame = this.getGame.bind(this);
  }
  componentDidMount() {
    this.showBannersList('CASH', 'ALL', false, 0, 10);
    this.getAllGames();
    this.setState({
      start: 0,
      count: 10
    });
  }

  getAllGames() {
    var gameList = [];
    this.props.actions.fetchGames().then(() => {
      if (this.props.gamesList) {
        this.setState({
          gameList: [...this.props.gamesList]
        });
      }
    });
  }

  getGame(record) {
    let gameList = [...this.state.gameList];
    if (record.gameId) {
      let gameObj = gameList.find(function(item) {
        return Number(record.gameId) === item.id;
      });
      return gameObj && gameObj.name ? gameObj.name : 'N/A';
    } else {
      return 'N/A';
    }
  }

  refreshCache() {
    this.props.actions.refreshCache().then(() => {
      if (this.props.refreshBannerCacheResponse) {
        if (
          this.props.refreshBannerCacheResponse &&
          this.props.refreshBannerCacheResponse.error
        ) {
          message.error(this.props.refreshBannerCacheResponse.error.message);
        } else {
          message.success('Successfully refreshed the banner cache');
        }
      }
    });
  }

  showBannersList(
    appType,
    location,
    activeOnly = false,
    start = 0,
    count = 10,
    isAllBanners = false
  ) {
    if (!this.props.banners) {
      message.loading('Banner loading in progress..', 0);
      this.props.actions
        .listBanners(
          appType,
          location,
          activeOnly,
          start,
          count,
          isAllBanners,
          this.state.countryCode,
          this.state.gameId
        )
        .then(() => {
          message.destroy();
          let pageNum = this.state.pageNum ? this.state.pageNum : 10;

          this.setState({
            showTable: true
          });
          if (
            this.props.banner.count === this.props.banner.list.length &&
            pageNum / 10 === this.state.currentPage
          ) {
            this.setState({
              pageNum: pageNum + 10
            });
          } else {
            this.setState({
              pageNum: pageNum
            });
          }
        });
    }
  }

  deployState(record, state) {
    this.props.actions.changeStateBanner(record.id, state).then(() => {
      message.success('Banner is updated successfully');
      this.showBannersList(
        this.state.appType,
        this.state.location,
        false,
        0,
        10
      );
    });
  }
  deleteBanner(record) {
    let data = {
      bannerId: record.id
    };
    this.props.actions.deleteBanner(data).then(() => {
      message.success('Banner is updated successfully');
      this.showBannersList(
        this.state.appType,
        this.state.location,
        false,
        0,
        10
      );
    });
  }

  actionBanner(record, actionType) {
    this.props.actions.actionBanner(record, actionType);
    this.props.history.push(`/banner/add`);
  }

  showBannerDetails(record) {
    this.setState({
      selectedBanner: { ...record },
      showBannerDetailModal: true
    });
  }

  closeBannerDetailModal() {
    this.setState({ selectedBanner: {}, showBannerDetailModal: false });
  }

  toggle() {
    let newConfiguration = this.state.newConfiguration;
    this.setState({ newConfiguration: !newConfiguration });
  }

  updateCountryCode(value) {
    this.setState({
      countryCode: value
    });
  }

  getGameList() {
    let gameList = [];
    gameList = this.state.gameList.map(game => (
      <Option key={'game' + game.id} value={game.id}>
        {game.name} ( {game.id} )
      </Option>
    ));
    gameList.unshift(
      <Option key={'game---1'} value={'-1'}>
        {'Clear Game Selection'}
      </Option>
    );
    return gameList;
  }

  updateGameId(gameId) {
    this.setState({ gameId });
  }

  render() {
    const columns = [
      {
        title: 'Tag',
        dataIndex: 'tag',
        key: 'tag',
        render: (text, record) => (
          <span>
            {!this.state.newConfiguration && (
              <>
                <Badge
                  count={'A'}
                  status={record.isActive ? 'processing' : 'error'}
                />
                <Divider type="vertical" />
              </>
            )}
            {record.tag}
          </span>
        )
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action'
      },
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        defaultSortOrder: 'descend',
        sorter: (a, b) => Date.parse(a.startTime) - Date.parse(b.startTime),
        render: (text, record) => (
          <span>
            {moment(record.startTime)
              .format('DD-MM-YY HH:mm A')
              .toString()}
          </span>
        )
      },
      {
        title: 'End Time',
        dataIndex: 'endTime',
        key: 'endTime',
        defaultSortOrder: 'descend',
        sorter: (a, b) => Date.parse(a.endTime) - Date.parse(b.endTime),
        render: (text, record) => (
          <span>
            {moment(record.endTime)
              .format('DD-MM-YY HH:mm A')
              .toString()}
          </span>
        )
      },
      {
        title: 'Index',
        dataIndex: 'index',
        key: 'index',
        render: (text, record) => <span>{record.index ? record.index : 0}</span>
      },
      {
        title: 'Preview',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (text, record) => (
          <span>
            <img className="baner-list-img" src={record.imageUrl} alt="" />
          </span>
        )
      },
      {
        title: 'Min App Version',
        key: 'minAppVersion',
        render: (text, record) => (
          <span>{record.minAppVersion ? record.minAppVersion : 0}</span>
        )
      },
      {
        title: 'Max App Version',
        key: 'maxAppVersion',
        render: (text, record) => (
          <span>{record.maxAppVersion ? record.maxAppVersion : 0}</span>
        )
      },
      {
        title: 'Game',
        key: 'gameId',
        render: (text, record) => <span>{this.getGame(record)}</span>
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <div style={{ minWidth: '150px' }}>
            {record.isActive ? (
              <Button
                onClick={() => this.deployState(record, false)}
                type="danger"
                size="small"
                disabled={this.state.newConfiguration}
              >
                Deactivate
              </Button>
            ) : (
              <span>
                <Button
                  onClick={() => this.deployState(record, true)}
                  type="primary"
                  size="small"
                  disabled={this.state.newConfiguration}
                >
                  Activate
                </Button>
                <Divider type="vertical" />

                <Button
                  onClick={() => this.deleteBanner(record)}
                  type="danger"
                  size="small"
                  disabled={this.state.newConfiguration}
                >
                  Delete
                </Button>
              </span>
            )}
            <Divider type="horizontal" />
            <Tooltip
              placement="topLeft"
              title="Edit banner config"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="edit"
                size="small"
                onClick={() => this.actionBanner(record, 'edit')}
                type="primary"
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip
              placement="topLeft"
              title="Copy config to create banner"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="copy"
                size="small"
                onClick={() => this.actionBanner(record, 'copy')}
                type="primary"
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip
              placement="topLeft"
              title="Banner Details"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="info-circle"
                size="small"
                onClick={() => this.showBannerDetails(record)}
                type="primary"
              />
            </Tooltip>
          </div>
        )
      }
    ];
    const onLocationChange = e => {
      this.setState({
        location: e
      });
      this.showBannersList(this.state.appType, e, this.state.activeOnly);
    };
    const onAppTypeChange = e => {
      this.setState({
        appType: e
      });
      this.showBannersList(e, this.state.location, this.state.activeOnly);
    };
    const onChange = val => {
      this.setState({
        currentPage: val
      });

      this.showBannersList(
        this.state.appType,
        this.state.location,
        this.state.activeOnly,
        (val - 1) * 10,
        10
      );

      // this.props.actions.kycPageNum(val);
    };
    return (
      <React.Fragment>
        {/* <ShowBanner /> */}
        <Card
          extra={
            <Popconfirm
              title="Are you sure that you want to refresh the cache?"
              onConfirm={() => this.refreshCache()}
            >
              <Button type="danger"> REFRESH CACHE </Button>{' '}
            </Popconfirm>
          }
        >
          <Row>
            <Col span={2}>
              <label>Filters: </label>
            </Col>
            <Col span={6}>
              <label>Location: </label>
              <Select
                defaultValue={['HOME']}
                showSearch
                onChange={onLocationChange}
                style={{ width: 200 }}
                placeholder="Select location of banner"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {location}
              </Select>
            </Col>
            <Col span={8}>
              <label>App Type: </label>
              <Select
                defaultValue={['CASH']}
                showSearch
                onChange={onAppTypeChange}
                style={{ width: 200 }}
                placeholder="Select type of app"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {appType}
              </Select>
            </Col>
            <Col span={8}>
              <span>
                <label>Country: </label>
                <Input
                  style={{ width: '50%' }}
                  value={this.state.countryCode}
                  onChange={e => this.updateCountryCode(e.target.value)}
                />
              </span>
            </Col>
            <Col span={2}>
              <label></label>
            </Col>
            {this.state.gameList && this.state.gameList.length > 0 && (
              <Col span={12}>
                <label>Game: </label>
                <Select
                  showSearch
                  value={this.state.gameId}
                  onSelect={e => this.updateGameId(e)}
                  style={{ width: 400 }}
                  placeholder="Select game"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.getGameList()}
                </Select>
              </Col>
            )}

            <Col span={8}>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  this.showBannersList(
                    this.state.appType,
                    this.state.location,
                    false,
                    0,
                    10
                  )
                }
              >
                Get List
              </Button>
            </Col>
            <Col span={24}>
              <span style={{ marginRight: '20px' }}>Toggle Old/New</span>
              <Switch
                checkedChildren={<span>New</span>}
                unCheckedChildren={<span>Old</span>}
                defaultChecked={this.state.newConfiguration}
                onChange={() => this.toggle()}
              />
            </Col>
          </Row>
        </Card>
        {this.state.showTable ? (
          <Card>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.props.banner.list}
              columns={columns}
            />
            <Pagination
              current={this.state.pageNum}
              defaultCurrent={this.state.pageNum}
              onChange={onChange}
              total={this.state.pageNum}
              pageSize={10}
            />
          </Card>
        ) : (
          ''
        )}
        <Modal
          title={'Banner Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.closeBannerDetailModal()}
          onCancel={() => this.closeBannerDetailModal()}
          visible={this.state.showBannerDetailModal}
          footer={[
            <Button
              key="close_button"
              onClick={() => this.closeBannerDetailModal()}
            >
              Close
            </Button>
          ]}
        >
          {this.state.selectedBanner && this.state.selectedBanner.id && (
            <Card>{JSON.stringify(this.state.selectedBanner)}</Card>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    banner: state.banner,
    deleteBannerResponse: state.banner.deleteBannerResponse,
    refreshBannerCacheResponse: state.banner.refreshBannerCacheResponse,
    gamesList: state.games.allGames
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bannerActions, ...gameActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBanners);
