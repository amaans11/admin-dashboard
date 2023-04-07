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
  Tag,
  message,
  Divider
} from 'antd';
import moment from 'moment';

const StageTypeList = ['COLLEGE', 'CITY', 'ZONE', 'NATIONAL'];

class ListEsportsLeagueStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      selectedRecord: {},
      showModal: false
    };
    this.fetchList = this.fetchList.bind(this);
    this.editDetails = this.editDetails.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchList();
  }

  fetchList() {
    this.props.actions.getAllEsportsLeagueStages().then(() => {
      if (
        this.props.getAllEsportsLeagueStagesResponse &&
        this.props.getAllEsportsLeagueStagesResponse.leagueStage
      ) {
        this.setState(
          {
            tableData:
              this.props.getAllEsportsLeagueStagesResponse.leagueStage.length >
              0
                ? [...this.props.getAllEsportsLeagueStagesResponse.leagueStage]
                : []
          },
          () => this.setState({ showTable: true })
        );
      }
    });
  }

  showDetails(record) {
    this.setState({
      selectedRecord: { ...record },
      showModal: true
    });
  }

  editDetails(record) {
    this.props.actions.editEsportsLeagueStage(record);
    this.props.history.push('/esports/create-league-stage');
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
        title: 'Color Code',
        key: 'colorCode',
        dataIndex: 'colorCode',
        render: (text, record) => (
          <div
            style={{
              minWidth: '100px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            <Tag color={record.colorCode}>{record.colorCode}</Tag>
          </div>
        )
      },
      {
        title: 'League Id',
        key: 'leagueId',
        dataIndex: 'leagueId',
        render: (text, record) => (
          <div
            style={{
              maxWidth: '75px',
              wordWrap: 'break-word',
              wordBreak: 'break-all'
            }}
          >
            {record.leagueId}
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
        title: 'Stage Type',
        key: 'stageType',
        render: record => <div>{record.stageType}</div>
      },
      {
        title: 'Start Time',
        render: record => (
          <span>{moment(record.startTime).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'End Time',
        render: record => (
          <span>{moment(record.endTime).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'Top Image',
        key: 'topImageUrl',
        render: record => (
          <span>
            {record.topImageUrl && (
              <span>
                <img
                  style={{ width: '60px', height: 'auto' }}
                  src={record.topImageUrl}
                  alt=""
                />
              </span>
            )}
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
              icon="info"
              type="primary"
              size="small"
              onClick={() => this.showDetails(record)}
            />
            <Divider type="vertical" />
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
        <Modal
          title={'Stage Details'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() =>
            this.setState({ showModal: false, selectedRecord: {} })
          }
          onOk={() => this.setState({ showModal: false, selectedRecord: {} })}
          visible={this.state.showModal}
        >
          <Card bordered={false}>
            <Row>
              <Col span={24}>{JSON.stringify(this.state.selectedRecord)}</Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAllEsportsLeagueStagesResponse:
      state.esports.getAllEsportsLeagueStagesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...esportsLeagueActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListEsportsLeagueStage);
