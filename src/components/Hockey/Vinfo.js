import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hockeyActions from '../../actions/HockeyActions';
import { Helmet } from 'react-helmet';
import {
  Card,
  InputNumber,
  Icon,
  Button,
  Row,
  Col,
  message,
  Modal,
  Popconfirm
} from 'antd';

class Vinfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRosterModal: false,
      leagueId: null
    };
    this.showRunRosterModal = this.showRunRosterModal.bind(this);
    this.getNewLeagues = this.getNewLeagues.bind(this);
    this.runRosterScheduler = this.runRosterScheduler.bind(this);
    this.changeLeagueId = this.changeLeagueId.bind(this);
  }

  showRunRosterModal() {
    this.setState({ showRosterModal: true });
  }

  getNewLeagues() {
    this.props.actions.getNewLeague().then(() => {
      if (this.props.fantasy.getNewLeagueResponse) {
        if (
          this.props.fantasy.getNewLeagueResponse &&
          this.props.fantasy.getNewLeagueResponse.error
        ) {
          message.error(this.props.fantasy.getNewLeagueResponse.error.message);
        } else {
          message.success('Successfully fetched new league');
        }
      }
    });
  }

  runRosterScheduler() {
    console.log(this.state.leagueId);
    if (!this.state.leagueId) {
      return false;
    } else {
      let data = {
        leagueId: this.state.leagueId
      };
      this.props.actions.runRosterScheduler(data).then(() => {
        if (this.props.fantasy.runRosterSchedulerResponse) {
          if (
            this.props.fantasy.runRosterSchedulerResponse &&
            this.props.fantasy.runRosterSchedulerResponse.error
          ) {
            message.error(
              this.props.fantasy.runRosterSchedulerResponse.error.message
            );
            this.setState({ showRosterModal: true });
          } else {
            message.success('Successfully ran roster scheduler');
            return true;
          }
        }
      });
    }
  }

  changeLeagueId(leagueId) {
    this.setState({
      leagueId: leagueId
    });
  }

  render() {
    const closeRunRosterModal = () => {
      this.setState({
        showRosterModal: false,
        leagueId: null
      });
    };

    const runRoster = () => {
      if (this.state.leagueId === null) {
        message.error('Please provide league id');
      } else {
        this.runRosterScheduler();
        this.setState({
          showRosterModal: false,
          leagueId: null
        });
      }
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Vinfo |  Dashboard</title>
        </Helmet>
        <Card title="Vinfo Schedulers">
          <Row type="flex">
            <Col span={12}>
              <Button type="primary" onClick={() => this.showRunRosterModal()}>
                RUN ROSTER SCHEDULER
              </Button>
            </Col>
            <Col span={12}>
              <Popconfirm
                title="Sure to get new leagues?"
                onConfirm={() => this.getNewLeagues()}
              >
                <Button type="primary">GET NEW LEAGUE</Button>
              </Popconfirm>
            </Col>
          </Row>
        </Card>
        <Modal
          title={'RUN ROSTER SCHEDULER'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={closeRunRosterModal}
          onOk={runRoster}
          visible={this.state.showRosterModal}
        >
          <Card>
            League Id: {'  '}
            <InputNumber
              value={this.state.leagueId}
              onChange={e => this.changeLeagueId(e)}
            />
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fantasy: state.hockey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...hockeyActions }, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vinfo);
