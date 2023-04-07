import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import CSVReader from 'react-csv-reader';
import { CSVLink } from 'react-csv';
import {
  Card,
  Button,
  message,
  Table,
  Spin,
  Select,
  Row,
  Col,
  Typography
} from 'antd';
import * as accountsActions from '../../actions/accountsActions';

const { Option } = Select;
const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));
class CreditPokerWinning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFileRead: false,
      refundData: [],
      csvGameData: [],
      loading: false,
      countryCode: 'IN',
      sampleCsvData: [
        [743444, 200, 'Winning', 'FANTASY_LEADERBOARD', 'description test'],
        [743444, 200, 'Bonus', 'FANTASY_LEADERBOARD', 'description test'],
        [743444, 200, 'Deposit', 'FANTASY_LEADERBOARD', 'description test']
      ]
    };
    this.csvButtonRef = null;
  }

  handleFileUpload(data) {
    this.setState({
      fileRead: true,
      refundData: [...data]
    });
  }
  selectCountry = event => {
    this.setState({
      countryCode: event
    });
  };
  processRecords = async () => {
    const { refundData, countryCode } = this.state;

    if (refundData.length > 0) {
      await this.props.actions.processPokerRequest();
      this.setState({ loading: true });
      let request = refundData.map(async item => {
        let userAmount = {};
        userAmount[item[0]] = item[1];
        let data = {
          userAmount: userAmount,
          transactionType: 'CREDIT',
          moneyType: item[2],
          referenceId: item[0] + '_' + moment().format('YYYY-MM-DD_HH:mm:ss'),
          referenceType: item[3],
          description: item[4],
          countryCode: countryCode
        };
        return await this.props.actions.procesPokerWinnings(data);
      });
      await Promise.all(request);

      if (
        this.props.failedPokerRefunds &&
        this.props.failedPokerRefunds.length > 0
      ) {
        this.setState(
          {
            csvGameData: [...this.props.failedPokerRefunds],
            loading: false
          },
          () => {
            this.csvButtonRef.click();
            message.error('Refund Failed for some records');
          }
        );
      } else {
        this.setState(
          {
            loading: false
          },
          () => {
            message.success('Refund Successful for all records', 5);
          }
        );
      }
    }
  };

  render() {
    const { loading, countryCode } = this.state;
    const columns = [
      {
        title: 'User Id',
        key: 'userId',
        render: record => <span>{record[0]}</span>
      },
      {
        title: 'Amount',
        key: 'amount',
        render: record => <span>{record[1]}</span>
      },
      {
        title: 'Account Type',
        key: 'accountType',
        render: record => <span>{record[2]}</span>
      },
      {
        title: 'Reference Type',
        key: 'referencetype',
        render: record => <span>{record[3]}</span>
      },
      {
        title: 'Description',
        key: 'description',
        render: record => <span>{record[4]}</span>
      }
    ];
    const headers = [
      { label: 'User ID', key: 'userId' },
      { label: 'Amount', key: 'amount' },
      { label: 'Account Type', key: 'accountType' },
      { label: 'Reason for fail', key: 'failedReason' }
    ];

    return (
      <React.Fragment>
        <Card title={'Upload CSV'}>
          <CSVLink
            data={this.state.csvGameData}
            headers={headers}
            filename={`Failed Refunds`}
          >
            <button
              style={{ display: 'none' }}
              ref={ref => (this.csvButtonRef = ref)}
            >
              Download Transactions
            </button>
          </CSVLink>
          <Row>
            <Col sm={8}>
              <CSVReader
                cssClass="csv-reader-input"
                label="Upload Users file"
                onFileLoaded={e => this.handleFileUpload(e)}
              />
            </Col>
            <Col sm={8}>
              <label>Select Country : </label>
              <Select
                showSearch
                onSelect={this.selectCountry}
                style={{ width: 200 }}
                placeholder="Select country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                value={countryCode}
              >
                {CountryList}
              </Select>
            </Col>
          </Row>
          Note : Pls make sure all user ids belong to one country as selected
          above. If you have selected India or “IN”, winnings will only be
          processed for user ids from India
          <div style={{ fontSize: 16, paddingTop: 10 }}>Sample csv </div>
          <CSVLink data={this.state.sampleCsvData} filename={'sample-csv'}>
            <Button icon="download">Sample CSV</Button>
          </CSVLink>
          {this.state.fileRead && (
            <Card type="inner" style={{ marginTop: '10px' }}>
              <Table
                rowKey="id"
                bordered
                pagination={false}
                dataSource={this.state.refundData}
                columns={columns}
              />
              <Button
                type="primary"
                onClick={this.processRecords}
                style={{ width: 150, height: 40 }}
                disabled={loading}
              >
                {loading ? <Spin /> : 'Process Records'}
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
    failedPokerRefunds: state.accounts.failedPokerRefunds
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...accountsActions
      },
      dispatch
    )
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditPokerWinning);
