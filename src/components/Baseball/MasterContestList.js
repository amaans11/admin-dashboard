import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import TOKEN from '../../assets/ic_coins.png';
import CASH from '../../assets/ic_cash.png';
import _ from 'lodash';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Popconfirm,
  message,
  Modal,
  Select
} from 'antd';
import * as baseballActions from '../../actions/BaseballActions';
import moment from 'moment';

const Option = Select.Option;
class MasterContestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContests: false,
      contestsList: [],
      masterContestTypeList: [],
      filteredContestList: [],
      selectedRowKeys: [],
      showMultipleCreateModal: false,
      matchIds: [],
      sportsOptionList: [],
      sportIdToBeCloned: [],
      showCloneMasterContestModal: false,
      selectedMasterType: null,
      showDeleteOption: false
    };
    this.getMasterContestDetails = this.getMasterContestDetails.bind(this);
    this.showConfig = this.showConfig.bind(this);
    this.cloneEditContest = this.cloneEditContest.bind(this);
  }
  componentDidMount() {
    this.getMasterContestDetails();
    this.getAllMasterContestType();
  }

  getAllMasterContestType() {
    this.props.actions.getAllMasterContestType().then(() => {
      if (
        this.props.getAllMasterContestTypeResponse &&
        this.props.getAllMasterContestTypeResponse.masterType &&
        this.props.getAllMasterContestTypeResponse.masterType.length > 0
      ) {
        let masterContestTypeList = [];
        this.props.getAllMasterContestTypeResponse.masterType.map(item => {
          masterContestTypeList.push(
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        });
        this.setState({ masterContestTypeList });
      } else {
        message.info('No master contest type found');
      }
    });
  }

  getMasterContestDetails() {
    this.props.actions.getMasterContestDetails().then(() => {
      if (this.props.getMasterContestsDetailsResponse) {
        if (
          this.props.getMasterContestsDetailsResponse &&
          this.props.getMasterContestsDetailsResponse.error
        ) {
          message.error(
            this.props.getMasterContestsDetailsResponse.error.message
          );
        } else {
          if (
            this.props.getMasterContestsDetailsResponse &&
            this.props.getMasterContestsDetailsResponse.contestDetailDashboard
          ) {
            this.setState({
              contestsList: [
                ...this.props.getMasterContestsDetailsResponse
                  .contestDetailDashboard
              ],
              showContests: true,
              filteredContestList: [
                ...this.props.getMasterContestsDetailsResponse
                  .contestDetailDashboard
              ]
            });
          }
        }
      }
    });
    this.setState({ showContests: true });
  }

  masterTypeSelected(value) {
    let contestsList = [...this.state.contestsList];
    let filteredContestList = _.filter(contestsList, function(item) {
      return item.masterType === value;
    });
    this.setState({
      filteredContestList: [...filteredContestList],
      selectedMasterType: value,
      showDeleteOption: true
    });
  }

  clearFilter() {
    let contestsList = [...this.state.contestsList];
    this.setState({
      filteredContestList: [...contestsList],
      selectedMasterType: null,
      showDeleteOption: false
    });
  }

  showConfig(record) {
    this.setState({
      showConfigModal: true,
      configDetails: JSON.stringify(record)
    });
  }

  cloneEditContest(record, actionType) {
    this.props.actions.cloneEditMasterContest(record, actionType);
    this.props.history.push('create-master-contest');
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  openMultipleCreateModal() {
    let inputData = {
      type: '0'
    };
    let list = [];
    this.props.actions.getAllMatches(inputData).then(() => {
      if (this.props.matchList) {
        this.props.matchList.map(match => {
          list.push(
            <Option key={match.seasonGameUid} value={match.seasonGameUid}>
              {match.title} ( {moment(match.startTime).format('YYYY-MM-DD')} )
            </Option>
          );
        });
      }
    });
    this.setState({ matchList: list, showMultipleCreateModal: true });
  }

  openCloneMasterContestModal() {
    let sportList = [
      {
        name: 'CRICKET',
        sportId: 7
      },
      {
        name: 'KABADDI',
        sportId: 8
      },
      {
        name: 'FOOTBALL',
        sportId: 5
      },
      {
        name: 'STOCK',
        sportId: 101
      },
      {
        name: 'BASKETBALL',
        sportId: 6
      },
      {
        name: 'HOCKEY',
        sportId: 4
      }
    ];
    let sportsOptionList = [];
    sportList.map(sport => {
      sportsOptionList.push(
        <Option key={sport.sportId} value={sport.sportId}>
          {sport.name}
        </Option>
      );
    });
    this.setState({ sportsOptionList, showCloneMasterContestModal: true });
  }

  closeMultipleCreateModal() {
    this.setState({ showMultipleCreateModal: false });
  }

  saveMultipleCreateModal() {
    let data = {
      matchIds: [...this.state.matchIds],
      contestIds: [...this.state.selectedRowKeys]
    };
    this.props.actions.createMultipleMatchMultipleContest(data).then(() => {
      if (this.props.createMultipleMatchMultipleMasterContestResponse) {
        if (this.props.createMultipleMatchMultipleMasterContestResponse.error) {
          message.error(
            this.props.createMultipleMatchMultipleMasterContestResponse.error
              .message
              ? this.props.createMultipleMatchMultipleMasterContestResponse
                  .error.message
              : 'Request errored out'
          );
        } else {
          message
            .success('Successfully created multiple contests', 1)
            .then(() => {
              this.setState({
                showMultipleCreateModal: false,
                matchIds: [],
                selectedRowKeys: []
              });
            });
        }
      }
    });
  }

  closeCloneMasterContestModal() {
    this.setState({
      showCloneMasterContestModal: false,
      sportIdToBeCloned: []
    });
  }

  saveCloneMasterContestModal() {
    let data = {
      sportIdToBeCloned: [...this.state.sportIdToBeCloned],
      masterContestIds: [...this.state.selectedRowKeys]
    };
    this.props.actions.createMasterContestFromSportToSport(data).then(() => {
      if (this.props.createMasterContestFromSportToSportResponse) {
        if (this.props.createMasterContestFromSportToSportResponse.error) {
          message.error(
            this.props.createMasterContestFromSportToSportResponse.error.message
              ? this.props.createMasterContestFromSportToSportResponse.error
                  .message
              : 'Request errored out'
          );
        } else {
          message
            .success(
              'Successfully cloned multiple contests to multiple sports',
              1
            )
            .then(() => {
              this.setState({
                showCloneMasterContestModal: false,
                sportIdToBeCloned: [],
                selectedRowKeys: []
              });
            });
        }
      }
    });
  }

  handleMultipleSelect(value) {
    this.setState({ matchIds: [...value] });
  }

  handleMultipleSportSelect(value) {
    this.setState({ sportIdToBeCloned: [...value] });
  }

  deleteAllMasterContest() {
    let data = {
      masterType: this.state.selectedMasterType
    };
    this.props.actions.deleteMasterContestByMasterType(data).then(() => {
      if (this.props.deleteMasterContestByMasterTypeResponse) {
        if (this.props.deleteMasterContestByMasterTypeResponse.error) {
          message.error(
            this.props.deleteMasterContestByMasterTypeResponse.error.message
              ? this.props.deleteMasterContestByMasterTypeResponse.error.message
              : 'Could not delete the master contests'
          );
        } else {
          message
            .success('Successfully deleted the master contests', 1)
            .then(() => {
              window.location.reload();
            });
        }
      }
    });
  }

  render() {
    const columns = [
      {
        title: 'Contest Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Order Id',
        key: 'orderId',
        sorter: (a, b) => {
          if (a.orderId < b.orderId) {
            return -1;
          }
          if (a.orderId > b.orderId) {
            return 1;
          }
          return 0;
        },
        render: (text, record) => (
          <span>
            <span>{record.orderId ? record.orderId : 0}</span>{' '}
          </span>
        )
      },
      {
        title: 'Name',
        key: 'name',
        sorter: (a, b) => {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        },
        render: (text, record) => (
          <span>
            <Badge
              count={'A'}
              status={record.isActive ? 'processing' : 'error'}
            />
            <span>{record.name}</span>
          </span>
        )
      },
      {
        title: 'Slots Filled',
        key: 'totalSlots',
        render: (text, record) => (
          <span>
            <span>{record.slotsFilled ? record.slotsFilled : 0}</span>{' '}
            <span>/</span> <span>{record.totalSlots}</span>
          </span>
        )
      },
      {
        title: 'Fill Ratio',
        key: 'fillRatio',
        render: (text, record) =>
          record.slotsFilled
            ? ((record.slotsFilled * 100) / record.totalSlots).toFixed(2)
            : 0
      },
      {
        title: 'Teams Allowed',
        dataIndex: 'teamsAllowed',
        key: 'teamsAllowed'
      },
      {
        title: 'Entry Fees',
        key: 'registrationFees',
        filters: [
          {
            text: 'Token',
            value: 'Token'
          },
          {
            text: 'Cash',
            value: 'Cash'
          }
        ],
        onFilter: (value, record) =>
          record.registrationFeesType.indexOf(value) === 0,
        sorter: (a, b) => {
          var nameA = a.registrationFeesType.toUpperCase(); // ignore upper and lowercase
          var nameB = b.registrationFeesType.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        },
        render: (text, record) => (
          <span>
            <span>{record.registrationFees ? record.registrationFees : 0}</span>
            <span>
              <img
                style={{ width: '15px', marginLeft: 5 }}
                src={record.registrationFeesType === 'Token' ? TOKEN : CASH}
                alt=""
              />
            </span>
          </span>
        )
      },
      {
        title: 'App Type',
        key: 'appType',
        render: (text, record) => (
          <div style={{ maxWidth: '100px' }}>
            <span>{record.appType.join(', ')}</span>
          </div>
        )
      },
      {
        title: 'Master Type',
        key: 'masterType',
        onFilter: (value, record) => record.masterType.indexOf(value) === 0,
        sorter: (a, b) => {
          var nameA = a.masterType ? a.masterType.toUpperCase() : '';
          var nameB = b.masterType ? b.masterType.toUpperCase() : '';
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        },
        render: (text, record) => (
          <span>
            <span>{record.masterType ? record.masterType : 'N/A'}</span>
          </span>
        )
      },
      {
        title: 'Bonus Limit',
        key: 'bonusCapPercentage',
        render: (text, record) =>
          record.bonusCapPercentage ? record.bonusCapPercentage : 0
      },
      {
        title: 'Start Time',
        key: 'startTime',
        render: record => (
          <span>{moment(record.startTime).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'Registration End Time',
        key: 'registrationEndTime',
        render: record => (
          <span>
            {moment(record.registrationEndTime).format('YYYY-MM-DD HH:mm')}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              shape="circle"
              icon="edit"
              onClick={() => this.cloneEditContest(record, 'EDIT')}
              type="primary"
            />

            <Button
              shape="circle"
              icon="copy"
              onClick={() => this.cloneEditContest(record, 'COPY')}
              type="primary"
            />
            <Button
              shape="circle"
              icon="info"
              onClick={() => this.showConfig(record)}
              type="primary"
            />
            {!record.isActive && (
              <Popconfirm
                title="Sure to activate this contest?"
                onConfirm={() => this.activateContest(record)}
              >
                <Button shape="circle" icon="check" type="primary" />
              </Popconfirm>
            )}
          </span>
        )
      }
    ];

    const hideShowConfigModal = () => {
      this.setState({
        showConfigModal: false
      });
    };

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <React.Fragment>
        {this.state.showContests ? (
          <Card
            title={
              <>
                <Select
                  showSearch
                  onSelect={e => this.masterTypeSelected(e)}
                  style={{ width: '40%' }}
                  placeholder="Select master contest type"
                  optionFilterProp="children"
                  value={this.state.selectedMasterType}
                  filterOption={(input, option) =>
                    option.props.value
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.masterContestTypeList}
                </Select>
                <Button
                  type="dashed"
                  size="small"
                  style={{ marginLeft: '5px' }}
                  onClick={() => this.clearFilter()}
                >
                  Clear filter
                </Button>
                {this.state.selectedRowKeys &&
                  this.state.selectedRowKeys.length > 0 && (
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginLeft: '5px' }}
                      onClick={() => this.openMultipleCreateModal()}
                    >
                      Create Multiple Match Master Contest
                    </Button>
                  )}
                {this.state.selectedRowKeys &&
                  this.state.selectedRowKeys.length > 0 && (
                    <Button
                      size="small"
                      style={{ marginLeft: '5px', backgroundColor: 'orange' }}
                      onClick={() => this.openCloneMasterContestModal()}
                    >
                      Clone To Other Sports
                    </Button>
                  )}
                {this.state.showDeleteOption && (
                  <Popconfirm
                    title="Are you sure that you want to delete all master contest for the selected master type?"
                    onConfirm={() => this.deleteAllMasterContest()}
                  >
                    <Button
                      type="danger"
                      size="small"
                      style={{ marginLeft: '5px' }}
                    >
                      Delete All Contests
                    </Button>
                  </Popconfirm>
                )}
              </>
            }
          >
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.filteredContestList}
              columns={columns}
              scroll={{ x: '100%' }}
              rowSelection={rowSelection}
            />
          </Card>
        ) : (
          ''
        )}
        <Modal
          title={
            this.state.configDetails
              ? 'config Details'
              : 'Select Decativation Time'
          }
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideShowConfigModal}
          onOk={hideShowConfigModal}
          visible={this.state.showConfigModal}
        >
          <Card bordered={false}>{this.state.configDetails}</Card>
        </Modal>
        <Modal
          title={'Multple Cloning'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeMultipleCreateModal()}
          onOk={() => this.saveMultipleCreateModal()}
          okText="Save"
          visible={this.state.showMultipleCreateModal}
        >
          <Card>
            Select Matches
            <Select
              mode="multiple"
              style={{ width: '70%' }}
              placeholder="Please select"
              onChange={e => this.handleMultipleSelect(e)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children[0]
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.matchList}
            </Select>
          </Card>
        </Modal>
        <Modal
          title={'Multple Cloning to multiple sports'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeCloneMasterContestModal()}
          onOk={() => this.saveCloneMasterContestModal()}
          okText="Save"
          visible={this.state.showCloneMasterContestModal}
        >
          <Card>
            Select Sports
            <Select
              mode="multiple"
              style={{ width: '70%' }}
              placeholder="Please select"
              onChange={e => this.handleMultipleSportSelect(e)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children[0]
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.sportsOptionList}
            </Select>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getMasterContestsDetailsResponse:
      state.baseball.getMasterContestsDetailsResponse,
    getAllMasterContestTypeResponse:
      state.baseball.getAllMasterContestTypeResponse,
    matchList: state.baseball.matches,
    createMultipleMatchMultipleMasterContestResponse:
      state.baseball.createMultipleMatchMultipleMasterContestResponse,
    createMasterContestFromSportToSportResponse:
      state.baseball.createMasterContestFromSportToSportResponse,
    deleteMasterContestByMasterTypeResponse:
      state.baseball.deleteMasterContestByMasterTypeResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...baseballActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MasterContestList);
