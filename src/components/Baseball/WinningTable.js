// @flow

import React from 'react';
import { Table } from 'antd';

class WinningTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Start Rank',
          dataIndex: 'startRank'
        },
        {
          title: 'End Rank',
          dataIndex: 'endRank'
        },
        {
          title: 'Cash',
          dataIndex: 'cashPrize'
        },
        {
          title: 'Token',
          dataIndex: 'tokenPrize'
        },
        {
          title: 'Bonus',
          dataIndex: 'bonusCashPrize'
        },
        {
          title: 'Special',
          dataIndex: 'specialPrize'
        }
      ]
    };
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <Table
          id="winnings-table"
          bordered
          rowKey="start"
          dataSource={this.props.contestWinnings}
          columns={this.state.columns}
          size="small"
          rowClassName="editable-row"
        />
      </React.Fragment>
    );
  }
}

export default WinningTable;
