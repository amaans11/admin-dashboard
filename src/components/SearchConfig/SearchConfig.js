import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as searchConfigActions from '../../actions/searchConfigActions';
import * as gameActions from '../../actions/gameActions';
import * as userDataActions from '../../actions/userDataActions';
import {
  Card,
  Select,
  Form,
  Button,
  Input,
  InputNumber,
  Table,
  message,
  Row,
  Col
} from 'antd';
import { forEach, find, orderBy } from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const typesList = [
  // <Option key="CUSTOM" value="CUSTOM">
  //   Custom List
  // </Option>,
  <Option key="ORDERED" value="ORDERED">
    Ordered List
  </Option>,
  <Option key="HEROES" value="HEROES">
    Heroes Leaderboard
  </Option>
];

const parameterTypeList = [
  <Option key="TOTAL_CASH_WON" value="TOTAL_CASH_WON">
    Total Cash Won
  </Option>,
  <Option key="FOLLOWER_COUNT" value="FOLLOWER_COUNT">
    Follower Count
  </Option>,
  <Option key="UGT_COUNT" value="UGT_COUNT">
    UGT Count
  </Option>,
  <Option key="UGC_COUNT" value="UGC_COUNT">
    UGC Count
  </Option>
  // <Option key="VERIFIED_COUNT" value="VERIFIED_COUNT">
  //   Verified Count
  // </Option>,
  // <Option key="AUDIO_SHOW_COUNT" value="AUDIO_SHOW_COUNT">
  //   Audio Show Count
  // </Option>
];

class SearchConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      numberOfProfiles: 12,
      configureType: 'ORDERED',
      showTable: false,
      tableData: [],
      selectedRowKeys: [],
      selectedRows: [],
      selectedCount: 0,
      profilesToFetch: 12
    };
    this.configureTypeSelected = this.configureTypeSelected.bind(this);
    this.parameterSelected = this.parameterSelected.bind(this);
    this.getGameList = this.getGameList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchBasicProfiles = this.fetchBasicProfiles.bind(this);
    this.getFollowerCountList = this.getFollowerCountList.bind(this);
    this.changeProfileCount = this.changeProfileCount.bind(this);
    this.getCashList = this.getCashList.bind(this);
    this.changeProfileFetchCount = this.changeProfileFetchCount.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.getUGList = this.getUGList.bind(this);
    this.getList = this.getList.bind(this);
  }

  componentDidMount() {
    this.props.actions.getSearchConfig().then(() => {
      if (this.props.getSearchConfigResponse) {
        let configData = JSON.parse(this.props.getSearchConfigResponse).config;
        if (configData['search.default.title']) {
          this.props.form.setFieldsValue({
            title: configData['search.default.title']
          });
        }
        if (configData['search.default.numberOfHeroes']) {
          this.props.form.setFieldsValue({
            numberOfProfiles: configData['search.default.numberOfHeroes'],
            profilesToFetch: configData['search.default.numberOfHeroes']
          });
        }
        if (
          !configData['search.default.dataSource'] ||
          configData['search.default.dataSource'] === 'HERO_TAB'
        ) {
          console.log(configData['search.default.gameId']);
          this.getGameList();
          this.setState({
            configureType: 'HEROES',
            gameId: Number(configData['search.default.gameId'])
          });
        } else {
          this.setState({ configureType: 'ORDERED' });
        }
      }
    });
  }

  getGameList() {
    let gamesList = [];

    this.props.actions.fetchGames().then(() => {
      // --- All Games --- //
      gamesList.push(
        <Option key={'game999'} value={999}>
          All Games
        </Option>
      );
      this.props.gamesList.map(game => {
        gamesList.push(
          <Option key={'game' + game.id} value={game.id}>
            {game.name}
          </Option>
        );
      });
      this.setState({ gamesList: [...gamesList], showGameList: true });
    });
  }

  configureTypeSelected(option) {
    if (option === 'HEROES') {
      this.getGameList();
    }
    this.setState({ configureType: option });
  }

  parameterSelected(option) {
    this.setState({ selectedParameter: option });
    // if (this.state.configureType === 'ORDERED') {
    //   switch (option) {
    //     case 'TOTAL_CASH_WON':
    //       this.getCashList();
    //       break;
    //     case 'FOLLOWER_COUNT':
    //       this.getFollowerCountList();
    //       break;
    //     case 'UGT_COUNT':
    //       this.getUGList('TOURNAMENT');
    //       break;
    //     case 'UGC_COUNT':
    //       this.getUGList('CONTEST');
    //       break;
    //     case 'VERIFIED_COUNT':
    //       // TODO: api call for verified
    //       break;
    //     case 'AUDIO_SHOW_COUNT':
    //       // TODO: api call for audio show
    //       break;

    //     default:
    //       break;
    //   }
    // }
  }

  fetchBasicProfiles(userIds) {
    let data = {
      userIds: userIds
    };
    this.props.actions.getUserBasicProfileList(data).then(() => {
      if (this.props.getBasicUserDetailListResponse) {
        let details = [];
        let main = this;
        forEach(this.props.getBasicUserDetailListResponse.profiles, function(
          item
        ) {
          let userObj = find(main.state.users, function(user) {
            return user.userId === item.id.low;
          });
          switch (main.state.selectedParameter) {
            case 'TOTAL_CASH_WON':
              item['count'] = userObj.winningAmount;
              break;
            case 'FOLLOWER_COUNT':
              item['count'] = userObj.followerCount;
              break;
            case 'UGC_COUNT':
              item['count'] = userObj.count;
              break;
            case 'UGT_COUNT':
              item['count'] = userObj.count;
              break;
            default:
              break;
          }
          details.push(item);
        });
        details = orderBy(details, 'count', 'desc');
        this.setState({ tableData: [...details] });
      }
      this.setState({
        showTable: true
      });
    });
  }

  getFollowerCountList() {
    let data = {
      relationType: 'follower_count',
      count: this.state.profilesToFetch
    };
    this.props.actions.getFollowerUserList(data).then(() => {
      if (this.props.getFollowerListResponse) {
        let userIds = [];
        this.setState({
          users: [...this.props.getFollowerListResponse.users]
        });
        forEach(this.props.getFollowerListResponse.users, function(item) {
          userIds.push(item.userId);
        });
        this.fetchBasicProfiles(userIds);
      }
    });
  }

  getCashList() {
    let data = {
      totalUsers: this.state.profilesToFetch
    };
    this.props.actions.getCashUserList(data).then(() => {
      if (this.props.getCashListResponse) {
        let userIds = [];
        this.setState({
          users: [...this.props.getCashListResponse.users]
        });
        forEach(this.props.getCashListResponse.users, function(item) {
          userIds.push(item.userId);
        });
        this.fetchBasicProfiles(userIds);
      }
    });
  }

  getUGList(type) {
    // Type is 'UGC' or 'UGT'
    let data = {
      eventType: type,
      count: this.state.profilesToFetch
    };
    this.props.actions.getUGUserList(data).then(() => {
      if (this.props.getUGListResponse) {
        if (this.props.getUGListResponse.error) {
          message.error(
            'Could not fetch UG details. Error code: ' +
              this.props.getUGListResponse.error.reason
          );
        } else {
          let userIds = [];
          this.setState({
            users: [...this.props.getUGListResponse.userCounts]
          });
          forEach(this.props.getUGListResponse.userCounts, function(item) {
            userIds.push(item.userId);
          });
          this.fetchBasicProfiles(userIds);
        }
      }
    });
  }

  changeProfileCount(value) {
    this.setState({ numberOfProfiles: value });
  }
  changeProfileFetchCount(value) {
    this.setState({ profilesToFetch: value });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    let selectedCount = selectedRowKeys ? selectedRowKeys.length : 0;
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
      selectedCount: selectedCount
    });
  };

  getList() {
    let option = this.state.selectedParameter;
    switch (option) {
      case 'TOTAL_CASH_WON':
        this.getCashList();
        break;
      case 'FOLLOWER_COUNT':
        this.getFollowerCountList();
        break;
      case 'UGT_COUNT':
        this.getUGList('TOURNAMENT');
        break;
      case 'UGC_COUNT':
        this.getUGList('CONTEST');
        break;
      case 'VERIFIED_COUNT':
        // TODO: api call for verified
        break;
      case 'AUDIO_SHOW_COUNT':
        // TODO: api call for audio show
        break;

      default:
        break;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.configureType === 'HEROES') {
          let data = {
            dataSource: 'HERO_TAB',
            title: values.title,
            gameId: values.gameId,
            numberOfProfiles: values.numberOfProfiles
          };
          this.props.actions.setSearchConfig(data).then(() => {
            if (this.props.setSearchConfigResponse) {
              message.success('Updated Successfully');
            } else {
              console.log('ERROR');
            }
          });
        } else if (this.state.configureType === 'ORDERED') {
          if (values.numberOfProfiles !== this.state.selectedCount) {
            message.error(
              "The number of profiles entry and selected profile count doesn't match"
            );
            return;
          }
          let profiles = {};
          // let users = { ...this.state.users };
          let main = this;
          forEach(main.state.selectedRows, function(item) {
            let rowObj = {
              paramValue: item.count,
              paramType: main.state.selectedParameter
            };
            profiles[item.id.low] = rowObj;
          });
          let data = {
            profiles: profiles
          };
          this.props.actions.setSearchCustomConfig(data).then(() => {
            if (this.props.setSearchCustomConfigResponse) {
              message.success('Updated Successfully');
            } else {
              console.log('ERROR');
            }
          });
          let data1 = {
            dataSource: 'SERVICE',
            title: values.title,
            numberOfProfiles: values.numberOfProfiles
          };
          this.props.actions.setSearchConfig(data1).then(() => {
            if (this.props.setSearchConfigResponse) {
              message.success('Updated Successfully');
            } else {
              console.log('ERROR');
            }
          });
        }
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
      title: isFieldTouched('title') && getFieldError('title'),
      parameter: isFieldTouched('parameter') && getFieldError('parameter'),
      numberOfProfiles:
        isFieldTouched('numberOfProfiles') && getFieldError('numberOfProfiles'),
      profilesToFetch:
        isFieldTouched('profilesToFetch') && getFieldError('profilesToFetch')
    };

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection
    };

    const columns = [
      {
        title: 'Id',
        key: 'id',
        render: record => <span>{record.id.low}</span>
      },
      {
        title: 'Mobile Number',
        key: 'mobileNumber',
        dataIndex: 'mobileNumber'
      },
      {
        title: 'Display Name',
        key: 'displayName',
        dataIndex: 'displayName'
      },
      {
        title: 'Avatar',
        key: 'avatarUrl',
        render: record => (
          <span>
            {record.avatarUrl && (
              <span>
                <img className="baner-list-img" src={record.avatarUrl} alt="" />
              </span>
            )}
          </span>
        )
      },
      {
        title: 'Is Pro',
        key: 'isPro',
        render: record => <span>{record.isPro ? 'PRO' : 'PS'}</span>
      },
      {
        title: 'Tier',
        key: 'tier',
        dataIndex: 'tier'
      },
      {
        title: 'Count',
        key: 'count',
        dataIndex: 'count'
      }
    ];
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Search Profile Configurations">
            <FormItem
              validateStatus={errors.configureType ? 'error' : ''}
              help={errors.configureType || ''}
              {...formItemLayout}
              label={'Configuration Type'}
            >
              {getFieldDecorator('configureType', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option!'
                  }
                ],
                initialValue: this.state.configureType
              })(
                <Select
                  showSearch
                  onSelect={this.configureTypeSelected}
                  style={{ width: 200 }}
                  placeholder="Select a search configuration"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {typesList}
                </Select>
              )}
            </FormItem>

            <FormItem
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title || ''}
              {...formItemLayout}
              label={'Title'}
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please input contest name!',
                    whitespace: true
                  }
                ]
              })(<Input placeholder={'List Title'} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.numberOfProfiles ? 'error' : ''}
              help={errors.numberOfProfiles || ''}
              {...formItemLayout}
              label={'Number Of Profiles'}
            >
              {getFieldDecorator('numberOfProfiles', {
                rules: [
                  {
                    required: true,
                    message: 'Please input number of profiles!',
                    type: 'number'
                  }
                ],
                initialValue: this.state.numberOfProfiles
              })(
                <InputNumber
                  onChange={value => this.changeProfileCount(value)}
                  min={1}
                />
              )}
            </FormItem>
          </Card>
          {this.state.configureType && (
            <React.Fragment>
              <Card
                title={
                  this.state.actionType === 'EDIT'
                    ? 'Edit Contest'
                    : 'Create Match Contest'
                }
              >
                {this.state.configureType === 'CUSTOM' && (
                  <Card type="inner" title="Custom List">
                    <FormItem
                      validateStatus={errors.parameter ? 'error' : ''}
                      help={errors.parameter || ''}
                      {...formItemLayout}
                      label={'Paramter Type to surface'}
                    >
                      {getFieldDecorator('parameter', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select a parameter!'
                          }
                        ]
                      })(
                        <Select
                          showSearch
                          style={{ width: '70%' }}
                          onSelect={this.parameterSelected}
                          placeholder="Select a parameter"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {parameterTypeList}
                        </Select>
                      )}
                    </FormItem>
                  </Card>
                )}
                {this.state.configureType === 'ORDERED' && (
                  <Card type="inner" title="Ordered List">
                    <FormItem
                      validateStatus={errors.profilesToFetch ? 'error' : ''}
                      help={errors.profilesToFetch || ''}
                      {...formItemLayout}
                      label={'Total Profiles to select from'}
                    >
                      {getFieldDecorator('profilesToFetch', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input number of profiles!',
                            type: 'number'
                          }
                        ],
                        initialValue: this.state.profilesToFetch
                      })(
                        <InputNumber
                          onChange={value =>
                            this.changeProfileFetchCount(value)
                          }
                          min={1}
                        />
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={errors.parameter ? 'error' : ''}
                      help={errors.parameter || ''}
                      {...formItemLayout}
                      label={'Parameter Type to surface'}
                    >
                      {getFieldDecorator('parameter', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select a parameter!'
                          }
                        ]
                      })(
                        <Select
                          showSearch
                          style={{ width: '70%' }}
                          onSelect={this.parameterSelected}
                          placeholder="Select a parameter"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {parameterTypeList}
                        </Select>
                      )}
                      <Button
                        style={{ backgroundColor: '#FFDAB9' }}
                        onClick={() => this.getList()}
                      >
                        Get List
                      </Button>
                    </FormItem>

                    {this.state.showTable && (
                      <Card>
                        <Table
                          bordered
                          pagination={false}
                          dataSource={this.state.tableData}
                          columns={columns}
                          rowSelection={rowSelection}
                        />
                      </Card>
                    )}
                  </Card>
                )}
                {this.state.configureType === 'HEROES' && (
                  <Card type="inner" title="Heroes List">
                    {this.state.showGameList && (
                      <FormItem
                        validateStatus={errors.gameId ? 'error' : ''}
                        help={errors.gameId || ''}
                        {...formItemLayout}
                        label={'Select Game'}
                      >
                        {getFieldDecorator('gameId', {
                          rules: [
                            {
                              required: true,
                              message: 'Please select a parameter!'
                            }
                          ],
                          initialValue: this.state.gameId
                        })(
                          <Select
                            showSearch
                            style={{ width: '70%' }}
                            // onSelect={this.parameterSelected}
                            placeholder="Select a game"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {this.state.gamesList}
                          </Select>
                        )}
                      </FormItem>
                    )}
                  </Card>
                )}
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
              </Card>
            </React.Fragment>
          )}
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    setSearchConfigResponse: state.searchConfig.setSearchConfigResponse,
    gamesList: state.games.allGames,
    getBasicUserDetailListResponse:
      state.userData.getBasicUserDetailListResponse,
    getFollowerListResponse: state.userData.getFollowerListResponse,
    getCashListResponse: state.userData.getCashListResponse,
    setSearchCustomConfigResponse:
      state.searchConfig.setSearchCustomConfigResponse,
    getUGListResponse: state.userData.getUGListResponse,
    getSearchConfigResponse: state.searchConfig.getSearchConfigResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...searchConfigActions, ...gameActions, ...userDataActions },
      dispatch
    )
  };
}
const SearchConfigForm = Form.create()(SearchConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchConfigForm);
