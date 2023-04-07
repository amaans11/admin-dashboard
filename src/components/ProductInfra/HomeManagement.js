import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as productInfraActions from '../../actions/ProductInfraActions';
import { Card, Tabs } from 'antd';
import MasterConfig from './MasterConfig';
import Progressions from './Progressions';
import PrimeWidget from './PrimeWidget';

const TabPane = Tabs.TabPane;

class HomeManagement extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Card className="page-container" title="Product Infra Home Management">
        <Tabs defaultActiveKey="0" onChange={this.callback} type="card">
          <TabPane tab="Master Config" key="0">
            <MasterConfig />
          </TabPane>
          <TabPane tab="Progressions" key="1">
            <Progressions />
          </TabPane>
          <TabPane tab="Prime Program" key="2">
            <PrimeWidget />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...productInfraActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeManagement);
