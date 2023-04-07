import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as productInfraActions from '../../actions/ProductInfraActions';
import { Card, Tabs } from 'antd';
import HamburgerConfig from './HamburgerConfig';
import HamburgerGameWidgets from './HamburgerGameWidgets';

const TabPane = Tabs.TabPane;

class Hamburger extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Card
        className="page-container"
        title="Product Infra Hamburger Configurations"
      >
        <Tabs defaultActiveKey="0" onChange={this.callback} type="card">
          <TabPane tab="Hamburger Config" key="0">
            <HamburgerConfig />
          </TabPane>
          <TabPane tab="Hamburger Game Widgets" key="1">
            <HamburgerGameWidgets />
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

export default connect(mapStateToProps, mapDispatchToProps)(Hamburger);
