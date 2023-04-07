import React from 'react';
import { Card, Tabs } from 'antd';
import MissionSegmentationConfig from './MissionSegmentationConfig';
import MissionEnabledSegments from './MissionEnabledSegments';

const TabPane = Tabs.TabPane;

class MissionSegmentation extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Card
        className="page-container"
        title="Product Infra Mission Segmentation Configurations"
      >
        <Tabs defaultActiveKey="0" onChange={this.callback} type="card">
          <TabPane tab="Mission Segmentation Config" key="0">
            <MissionSegmentationConfig />
          </TabPane>
          <TabPane tab="Mission Enabled Segments" key="1">
            <MissionEnabledSegments />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default MissionSegmentation;
