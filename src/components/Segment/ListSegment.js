// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Card } from 'antd';
import * as segmentActions from '../../actions/segmentActions';

const SegmentTypes = [
  'USER_WON_SEGMENT',
  'USER_TIER_SEGMENT',
  'USER_LOCATION_SEGMENT',
  'USER_LOST_SEGMENT',
  'USER_GAME_WINS',
  'USER_GAME_ENTRY_FEE',
  'USER_GAME_CASH_WON',
  'USER_GAME_NET_CASH_WON',
  'USER_GAME_ATTEMPTS',
  'USER_GAME_NET_CASH_POSITIVE_WIN',
  'USER_GAME_HIGHSCORE',
  'USER_GAME_RATING'
];

const GameTypes = ['COMBINED', 'TOURNAMENT', 'BATTLE'];
const CurrencyTypes = ['BOTH', 'CASH', 'TOKEN'];
const GameRelatedSegments = [
  'USER_GAME_WINS',
  'USER_GAME_ENTRY_FEE',
  'USER_GAME_CASH_WON',
  'USER_GAME_NET_CASH_WON',
  'USER_GAME_ATTEMPTS',
  'USER_GAME_NET_CASH_POSITIVE_WIN',
  'USER_GAME_HIGHSCORE',
  'USER_GAME_RATING'
];
class ListSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false
    };
  }
  componentDidMount() {
    this.props.actions.getSegmentList('all').then(() => {
      this.setState({
        showList: true
      });
    });
  }
  deployState = (record, state) => {
    let limiter = { ...record };
    limiter.active = state;
    this.props.actions.updateSegment(limiter).then(() => {
      this.props.actions.getSegmentList().then(() => {
        this.setState({
          showList: true
        });
      });
    });
  };
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Segment Id',
        dataIndex: 'id',
        key: 'id',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id
      },

      {
        title: 'Segment Type',
        dataIndex: 'segmentType',
        key: 'segmentType',
        render: (text, record) => (
          <span>
            {record.segmentType ? (
              <span>{SegmentTypes[record.segmentType]}</span>
            ) : (
              <span>{SegmentTypes[0]}</span>
            )}
          </span>
        )
      },
      {
        title: 'Segment Values',

        render: (text, record) => {
          let segmentIndex = record.segmentType ? record.segmentType : 0;
          let params = {};
          if (GameRelatedSegments.includes(SegmentTypes[segmentIndex])) {
            params = {
              min: record.segmentParams.min ? record.segmentParams.min : 0,
              max: record.segmentParams.max ? record.segmentParams.max : 0,
              gameType: record.segmentParams.gameTpe
                ? GameTypes[record.segmentParams.gameTpe]
                : GameTypes[0],
              currencyType: record.segmentParams.currencyType
                ? CurrencyTypes[record.segmentParams.currencyType]
                : CurrencyTypes[0]
            };
          }
          return (
            <span>
              {!record.segmentType
                ? JSON.stringify(record.userWonSegment)
                : record.segmentType === 1
                ? JSON.stringify(record.userTierSegment)
                : JSON.stringify(params)}
            </span>
          );
        }
      },

      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            {record.active ? (
              <Button
                onClick={() => this.deployState(record, false)}
                type="danger"
                size="small"
              >
                Deactivate
              </Button>
            ) : (
              <Button
                onClick={() => this.deployState(record, true)}
                type="primary"
                size="small"
              >
                Activate
              </Button>
            )}
          </span>
        )
      }
    ];
    return (
      <React.Fragment>
        {this.state.showList ? (
          <Card title="Segment List">
            <Table
              rowKey="id"
              bordered
              dataSource={this.props.segment.list}
              columns={columns}
            />
          </Card>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    segment: state.segment
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(segmentActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListSegment);
