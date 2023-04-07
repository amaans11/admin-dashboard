// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Card } from 'antd';
import * as limiterActions from '../../actions/limiterActions';
// type ListLimiter ={}

class ListLimiter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false
    };
  }
  componentDidMount() {
    this.props.actions.getLimiterList().then(() => {
      this.setState({
        showList: true
      });
      console.log(this.props.limiter.list);
    });
  }
  deployState = (record, state) => {
    let limiter = { ...record };
    limiter.active = state;
    this.props.actions.updateLimiter(limiter).then(() => {
      this.props.actions.getLimiterList().then(() => {
        this.setState({
          showList: true
        });
        console.log(this.props.limiter.list);
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
        title: 'Limiter Id',
        dataIndex: 'id',
        key: 'id',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id
      },

      {
        title: 'Limit',
        dataIndex: 'limit',
        key: 'limit',
        defaultSortOrder: 'descend',

        sorter: (a, b) => a.limit - b.limit
      },

      {
        title: 'Currency Type',
        dataIndex: 'currencyType',
        key: 'currencyType'
      },
      {
        title: 'Currency Amount',
        dataIndex: 'moneyCurrencyAmount',
        key: 'moneyCurrencyAmount',
        render: (text, record) => (
          <span>
            {record.moneyCurrencyAmount ? record.moneyCurrencyAmount : 0}
          </span>
        )
      },
      {
        title: 'Duration(Hours)',
        dataIndex: 'periodInHours',
        key: 'periodInHours'
      },
      {
        title: 'Style',
        dataIndex: 'style',
        key: 'style'
      },
      {
        title: 'Country Code',
        dataIndex: 'countryCode',
        key: 'countryCode'
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
          <Card title="Limiter List">
            <Table
              rowKey="id"
              bordered
              dataSource={this.props.limiter.list.rules}
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
    limiter: state.limiter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(limiterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListLimiter);
