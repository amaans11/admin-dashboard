import React from 'react';
import { Card, Tabs } from 'antd';
import AppLevelBlockV2 from './AppLevelBlockV2';
import BulkBlock from './BulkBlock';

const TabPane = Tabs.TabPane;

class AppLevelBlockV2Main extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Card className="page-container" title="App Level Block V2">
        <Tabs defaultActiveKey="0" onChange={this.callback} type="card">
          <TabPane tab="Single Block" key="0">
            <AppLevelBlockV2 />
          </TabPane>
          <TabPane tab="Bulk Block" key="1">
            <BulkBlock />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default AppLevelBlockV2Main;
