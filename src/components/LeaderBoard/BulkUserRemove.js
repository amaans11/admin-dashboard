import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CSVReader from 'react-csv-reader';
import { CSVLink } from 'react-csv';
import {
  Card,
  Form,
  Button,
  Input,
  InputNumber,
  Radio,
  message,
  Row,
  Col,
  Select,
  Table
} from 'antd';
import { get } from 'lodash';
import { gameList } from '../../shared/util';
import * as leaderboardActions from '../../actions/leaderboardActions';

class BulkUserRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: [],
      loading: false,
      failedRecords: []
    };
    this.csvButtonRef = null;
  }

  handleFileUpload = data => {
    this.setState({
      csvData: [...data]
    });
  };

  processRecords = async () => {
    const { csvData } = this.state;
    const kickedOutBy = get(this.props.currentUser, 'email', '');
    if (csvData.length == 0) {
      message.error('Please upload csv file!');
    } else {
      this.setState({ loading: true });
      await this.props.actions.processKickUserRequest();
      let request = csvData.map(async item => {
        let userAmount = {};
        userAmount[item[0]] = item[1];
        let data = {
          userId: item[0],
          tournamentId: item[1],
          kickedOutBy
        };
        return await this.props.actions.bulkKickUser(data);
      });
      await Promise.all(request);

      if (this.props.failedRecords && this.props.failedRecords.length > 0) {
        this.setState(
          {
            failedRecords: [...this.props.failedRecords],
            loading: false
          },
          () => {
            this.csvButtonRef.click();
            message.error('Bulk Remove Failed for some records');
          }
        );
      } else {
        this.setState(
          {
            loading: false
          },
          () => {
            message.success('Bulk Remove success for all records', 5);
            window.location.reload();
          }
        );
      }
    }
  };

  render() {
    const { csvData } = this.state;
    const columns = [
      {
        title: 'User Id',
        key: 'userId',
        render: record => <span>{record[0]}</span>
      },
      {
        title: 'Tournament Id',
        key: 'tournamentId',
        render: record => <span>{record[1]}</span>
      }
    ];
    const headers = [
      { label: 'User ID', key: 'userId' },
      { label: 'Tournament Id', key: 'tournamentId' }
    ];

    return (
      <React.Fragment>
        <CSVLink
          data={this.state.failedRecords}
          headers={headers}
          filename={`Failed Request`}
        >
          <button
            style={{ display: 'none' }}
            ref={ref => (this.csvButtonRef = ref)}
          >
            Download Transactions
          </button>
        </CSVLink>
        <Card title={'Upload CSV'}>
          <CSVReader
            cssClass="csv-reader-input"
            label="Upload Users file"
            onFileLoaded={e => this.handleFileUpload(e)}
          />
          {csvData.length > 0 && (
            <Card type="inner" style={{ marginTop: '10px' }}>
              <Table
                rowKey="id"
                bordered
                pagination={false}
                dataSource={csvData}
                columns={columns}
              />
              <Button
                type="primary"
                onClick={this.processRecords}
                style={{ marginTop: 10 }}
              >
                Process Records
              </Button>
            </Card>
          )}
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    failedRecords: state.leaderboard.failedRecords,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...leaderboardActions
      },
      dispatch
    )
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(BulkUserRemove);
