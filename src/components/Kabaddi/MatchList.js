import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as kabaddiActions from '../../actions/KabaddiActions';
import { Helmet } from 'react-helmet';
import MatchCard from './MatchCard';
import {
  Card,
  Tabs,
  Button,
  Modal,
  DatePicker,
  message,
  Input,
  Row,
  Col,
  Radio
} from 'antd';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchList: [],
      currentTab: '0',
      showEditClone: true,
      addMatchModal: false,
      startTime: '',
      endTime: '',
      leagueId: '',
      pageSize: 30,
      pageOffset: 1,
      showNext: true,
      countryCode: 'ALL'
    };
    this.callback = this.callback.bind(this);
    this.getAllMatches = this.getAllMatches.bind(this);
    this.addMatches = this.addMatches.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onLeagueIdChange = this.onLeagueIdChange.bind(this);
  }

  componentDidMount() {
    this.getAllMatches(this.state.currentTab, this.state.pageOffset);
  }

  selectCountry(value) {
    this.setState(
      {
        countryCode: value
      },
      () => {
        this.getAllMatches(this.state.currentTab, this.state.pageOffset);
      }
    );
  }

  getAllMatches(key, pageOffset) {
    let pageSize = this.state.pageSize;
    if (key === 0) {
      pageSize = 100;
    }
    let inputData = {
      type: key,
      pageSize: pageSize,
      pageOffset: pageOffset,
      countryCode:
        this.state.countryCode === 'ALL' ? null : this.state.countryCode
    };
    this.props.actions.getAllMatches(inputData).then(() => {
      if (this.props.matchList) {
        this.setState({ matchList: this.props.matchList });
        let rowCount = this.props.matchList.length;
        if (rowCount < this.state.pageSize) {
          this.setState({ showNext: false, rowCount });
        } else {
          this.setState({ showNext: true, rowCount });
        }
      } else {
        this.setState({ matchList: [] });
      }
    });
    this.props.actions.getMatchCountCountryWise(inputData).then(() => {
      if (this.props.getMatchCountCountryWiseResponse) {
        this.setState({
          totalCount: this.props.getMatchCountCountryWiseResponse.totalMatches
            ? this.props.getMatchCountCountryWiseResponse.totalMatches
            : 0,
          totalIndia:
            this.props.getMatchCountCountryWiseResponse.countryWiseMatchCount &&
            this.props.getMatchCountCountryWiseResponse.countryWiseMatchCount.IN
              ? this.props.getMatchCountCountryWiseResponse
                  .countryWiseMatchCount.IN
              : 0,
          totalIndonesia:
            this.props.getMatchCountCountryWiseResponse.countryWiseMatchCount &&
            this.props.getMatchCountCountryWiseResponse.countryWiseMatchCount.ID
              ? this.props.getMatchCountCountryWiseResponse
                  .countryWiseMatchCount.ID
              : 0
        });
      }
    });
  }

  addMatches() {
    this.setState({ addMatchModal: true });
  }

  onDateChange(date, dateString) {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1]
    });
  }

  onLeagueIdChange(event) {
    this.setState({
      leagueId: event.target.value
    });
  }

  callback(key) {
    if (key !== '0') {
      this.setState({ showEditClone: false });
    }
    this.setState({ currentTab: key, pageOffset: 1 }, () => {
      this.getAllMatches(this.state.currentTab, this.state.pageOffset);
    });
  }

  getPreviousPage() {
    let currentOffset = this.state.pageOffset;
    this.setState({ pageOffset: currentOffset - 1 }, () => {
      this.getAllMatches(this.state.currentTab, this.state.pageOffset);
    });
  }

  getNextPage() {
    let currentOffset = this.state.pageOffset;
    this.setState({ pageOffset: currentOffset + 1 }, () => {
      this.getAllMatches(this.state.currentTab, this.state.pageOffset);
    });
  }

  render() {
    const hideModal = () => {
      this.setState({
        addMatchModal: false
      });
    };
    const handleOk = () => {
      if (this.state.startTime === '' && this.state.endTime === '') {
        message.error('Please select start and end time');
      } else {
        let inputData = {
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          leagueId: this.state.leagueId ? this.state.leagueId : ''
        };
        this.props.actions.addMatchDetails(inputData).then(() => {
          if (
            this.props.fantasy &&
            this.props.fantasy.addMatchDetailsResponse
          ) {
            if (this.props.fantasy.addMatchDetailsResponse.isSuccess) {
              message.success('Added successfully');
              this.setState({
                addMatchModal: false
              });
            } else {
              message.error('Failed to add matches');
            }
          } else {
            message.error('Error while adding matches');
          }
        });
      }
    };
    return (
      <React.Fragment>
        <Helmet>
          <title>Match List| Admin Dashboard</title>
        </Helmet>
        <Card id="match-list">
          {(this.state.pageOffset > 1 || this.state.showNext) && (
            <Card style={{ textAlign: 'end' }}>
              {this.state.pageOffset > 1 && (
                <Button onClick={() => this.getPreviousPage()} type="default">
                  Previous
                </Button>
              )}
              {this.state.showNext && (
                <Button
                  onClick={() => this.getNextPage()}
                  style={{ marginLeft: '10px' }}
                  type="primary"
                >
                  Next
                </Button>
              )}
            </Card>
          )}
          <Tabs defaultActiveKey="0" onChange={this.callback} type="card">
            <TabPane tab="Upcoming" key="0">
              <Card>
                <RadioGroup
                  buttonStyle="solid"
                  onChange={e => this.selectCountry(e.target.value)}
                  value={this.state.countryCode}
                >
                  <RadioButton value="ALL">ALL</RadioButton>
                  <RadioButton value="IN">IN</RadioButton>
                  <RadioButton value="ID">ID</RadioButton>
                  <RadioButton value="US">US</RadioButton>
                </RadioGroup>
              </Card>
              {this.state.matchList && (
                <Card
                  title={
                    <span>
                      Count of Matches:
                      {this.state.totalCount ? this.state.totalCount : 0} {', '}{' '}
                      Count of Matches India:
                      {this.state.totalIndia ? this.state.totalIndia : 0}
                      {', '} Count of Matches Indonesia:
                      {this.state.totalIndonesia
                        ? this.state.totalIndonesia
                        : 0}{' '}
                    </span>
                  }
                  extra={
                    <span>
                      <Button type="primary" onClick={() => this.addMatches()}>
                        Add Match
                      </Button>
                    </span>
                  }
                >
                  {this.state.matchList.map((match, index) => (
                    <MatchCard
                      key={index}
                      matchDetail={match}
                      showEditClone={true}
                      matchLevelEdit={true}
                      refundMatchFlag={false}
                      editConfigFlag={true}
                      tabType={'UPCOMING'}
                    />
                  ))}
                </Card>
              )}
            </TabPane>
            <TabPane tab="Live" key="1">
              {this.state.matchList && (
                <Card
                  title={
                    <span>
                      Count of Matches in the page:{' '}
                      {this.state.rowCount ? this.state.rowCount : 0}{' '}
                    </span>
                  }
                  extra={
                    <span>
                      <Button type="primary" onClick={() => this.addMatches()}>
                        Add Match
                      </Button>
                    </span>
                  }
                >
                  {this.state.matchList.map((match, index) => (
                    <MatchCard
                      key={index}
                      matchDetail={match}
                      showEditClone={false}
                      matchLevelEdit={false}
                      refundMatchFlag={false}
                      editConfigFlag={true}
                      tabType={'LIVE'}
                    />
                  ))}
                </Card>
              )}
            </TabPane>
            <TabPane tab="Ended" key="2">
              {this.state.matchList && (
                <Card
                  title={
                    <span>
                      Count of Matches in the page:{' '}
                      {this.state.rowCount ? this.state.rowCount : 0}{' '}
                    </span>
                  }
                  extra={
                    <span>
                      <Button onClick={() => this.addMatches()}>
                        Add Match
                      </Button>
                    </span>
                  }
                >
                  {this.state.matchList.map((match, index) => (
                    <MatchCard
                      key={index}
                      matchDetail={match}
                      showEditClone={this.state.showEditClone}
                      matchLevelEdit={false}
                      refundMatchFlag={true}
                      editConfigFlag={false}
                      tabType={'END'}
                    />
                  ))}
                </Card>
              )}
            </TabPane>
          </Tabs>
        </Card>
        <Modal
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal}
          onOk={handleOk}
          visible={this.state.addMatchModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={8}>Start Time & End Time {'   '}</Col>
              <Col span={16}>
                <RangePicker onChange={this.onDateChange} />
              </Col>
              <Col span={8}>League Id</Col>
              <Col span={16}>
                <Input onChange={e => this.onLeagueIdChange(e)} />
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
    matchList: state.kabaddi.matches,
    fantasy: state.kabaddi,
    getMatchCountCountryWiseResponse:
      state.kabaddi.getMatchCountCountryWiseResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...kabaddiActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchList);
