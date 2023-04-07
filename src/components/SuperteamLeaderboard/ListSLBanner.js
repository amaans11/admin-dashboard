import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as superteamLeaderboardActions from '../../actions/SuperteamLeaderboardActions';
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
import _ from 'lodash';

class ListSLBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      sportId: 5
    };
    this.fetchList = this.fetchList.bind(this);
    this.toggleState = this.toggleState.bind(this);
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList() {
    let data = {
      sportId: this.state.sportId
    };
    this.props.actions.getAllDefaultBanner(data).then(() => {
      if (
        this.props.getAllDefaultBannerResponse &&
        this.props.getAllDefaultBannerResponse.bannerObjects &&
        this.props.getAllDefaultBannerResponse.bannerObjects.length > 0
      ) {
        this.setState(
          {
            tableData: [...this.props.getAllDefaultBannerResponse.bannerObjects]
          },
          () => this.setState({ showTable: true })
        );
      } else {
        message.info('No records found');
        this.setState({ showTable: true });
      }
    });
  }

  editSlBanner(record, actionType) {
    this.props.actions.editSlBanner(record, actionType);
    this.props.history.push('/superteam-leaderboard/create-banner');
  }

  toggleState(record, newStatus) {
    let data = { ...record };
    let image = '';
    if (data.image !== '') {
      if (_.includes(data.image, '""')) {
        image = data.image.split('""/').pop();
      } else {
        image = data.image;
      }
      data.image = image;
    }
    data['isActive'] = newStatus;
    this.props.actions.editDefaultBanner(data).then(() => {
      if (this.props.editDefaultBannerResponse) {
        if (this.props.editDefaultBannerResponse.error) {
          message.error(
            this.props.editDefaultBannerResponse.error.message
              ? this.props.editDefaultBannerResponse.error.message
              : 'Could not update banner status'
          );
        } else {
          window.location.reload();
        }
      }
    });
  }

  render() {
    const columns = [
      {
        title: 'Banner Id',
        key: 'bannerId',
        dataIndex: 'bannerId'
      },
      {
        title: 'Title',
        key: 'title',
        render: (text, record) => (
          <div>
            <span>
              <Badge
                count={'A'}
                status={record.isActive ? 'processing' : 'error'}
              />
            </span>
            <span>{record.title}</span>
          </div>
        )
      },
      {
        title: 'Sub Title',
        key: 'subtitle',
        dataIndex: 'subtitle'
      },
      {
        title: 'Sport Id',
        key: 'sportId',
        dataIndex: 'sportId'
      },
      {
        title: 'Preview',
        dataIndex: 'image',
        key: 'image',
        render: (text, record) => (
          <span>
            <img
              className="baner-list-img"
              src={record.image}
              alt={record.image ? 'Could not load image' : 'No image uploaded'}
            />
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
              onClick={() => this.editSlBanner(record, 'EDIT')}
            />
            <Divider type="vertical" />
            {!record.isActive && (
              <Button
                size="small"
                onClick={() => this.toggleState(record, true)}
              >
                Activate
              </Button>
            )}
            {record.isActive && (
              <Button
                type="danger"
                size="small"
                onClick={() => this.toggleState(record, false)}
              >
                Deactivate
              </Button>
            )}
          </div>
        )
      }
    ];
    return (
      <React.Fragment>
        {this.state.showTable && (
          <Card title={'List Banners'}>
            <Table
              rowKey="title"
              bordered
              dataSource={this.state.tableData}
              pagination={false}
              columns={columns}
            />
          </Card>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAllDefaultBannerResponse:
      state.superteamLeaderboard.getAllDefaultBannerResponse,
    editDefaultBannerResponse:
      state.superteamLeaderboard.editDefaultBannerResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamLeaderboardActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListSLBanner);
