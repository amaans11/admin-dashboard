import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as esportsLeagueActions from '../../actions/esportsLeagueActions';
import _ from 'lodash';
import {
  Card,
  Table,
  Button,
  Modal,
  Popconfirm,
  Pagination,
  Row,
  Col,
  Badge,
  message,
  Divider
} from 'antd';
import moment from 'moment';

class ListEsportsLeague extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      selectedVoucher: {}
    };
    this.fetchList = this.fetchList.bind(this);
    this.editDetails = this.editDetails.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchList();
  }

  fetchList() {
    this.props.actions.getAllEsportsLeagues().then(() => {
      if (
        this.props.getAllEsportsLeagueResponse &&
        this.props.getAllEsportsLeagueResponse.epsortsLeague
      ) {
        this.setState(
          {
            tableData:
              this.props.getAllEsportsLeagueResponse.epsortsLeague.length > 0
                ? [...this.props.getAllEsportsLeagueResponse.epsortsLeague]
                : []
          },
          () => this.setState({ showTable: true })
        );
      }
    });
  }

  editDetails(record) {
    this.props.actions.editEsportsLeague(record);
    this.props.history.push('/esports/create-league');
  }

  render() {
    const columns = [
      {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '75px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.id}
          </div>
        )
      },
      {
        title: 'League Game Id',
        key: 'leagueGameId',
        dataIndex: 'leagueGameId',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '75px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.leagueGameId}
          </div>
        )
      },
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '75px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.name}
          </div>
        )
      },
      {
        title: 'Header',
        key: 'header',
        dataIndex: 'header',
        render: (text, record) => (
          <div
            style={{
              minWidth: '100px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.header}
          </div>
        )
      },
      {
        title: 'Sub Header',
        key: 'subHeader',
        dataIndex: 'subHeader'
      },
      {
        title: 'Entry Fee',
        key: 'entryFee',
        render: record => <div>{record.entryFee ? record.entryFee : 0}</div>
      },
      {
        title: 'Registration Start Time',
        render: record => (
          <span>
            {moment(record.registrationStartTime).format('YYYY-MM-DD HH:mm')}
          </span>
        )
      },
      {
        title: 'Registration End Time',
        render: record => (
          <span>
            {moment(record.registrationEndTime).format('YYYY-MM-DD HH:mm')}
          </span>
        )
      },
      {
        title: 'Bg Image',
        key: 'bgImageUrl',
        render: record => (
          <span>
            {record.bgImageUrl && (
              <span>
                <img
                  style={{ width: '60px', height: 'auto' }}
                  src={record.bgImageUrl}
                  alt=""
                />
              </span>
            )}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <div style={{ minWidth: '150px' }}>
            <Button
              icon="edit"
              type="primary"
              size="small"
              onClick={() => this.editDetails(record)}
            />
          </div>
        )
      }
    ];
    const hideModal = () => {
      this.setState({
        showModal: false
      });
    };
    return (
      <React.Fragment>
        {this.state.showTable && (
          <Card title={'Esports League List'}>
            <Table
              rowKey="id"
              bordered
              dataSource={this.state.tableData}
              columns={columns}
              scroll={{ x: '100%' }}
            />
          </Card>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAllEsportsLeagueResponse: state.esports.getAllEsportsLeagueResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...esportsLeagueActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListEsportsLeague);
