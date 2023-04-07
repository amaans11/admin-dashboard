import React from 'react';
import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as layoutActions from '../actions/layoutActions';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import NotFound from '../components/NotFound';
import menu_route from '../layouts/route';
import EditMatchDetails from '../components/Fantasy/EditMatchDetails';
import ExtendMatch from '../components/Fantasy/ExtendMatch';
import EditMatchDetailsKabaddi from '../components/Kabaddi/EditMatchDetails';
import ExtendMatchKabaddi from '../components/Kabaddi/ExtendMatch';
import EditMatchDetailsFootball from '../components/Football/EditMatchDetails';
import ExtendMatchFootball from '../components/Football/ExtendMatch';
import EditMatchDetailsStock from '../components/Stock/EditMatchDetails';
import ExtendMatchStock from '../components/Stock/ExtendMatch';
import EditMatchDetailsBasketball from '../components/Basketball/EditMatchDetails';
import ExtendMatchBasketball from '../components/Basketball/ExtendMatch';
import EditMatchDetailsHockey from '../components/Hockey/EditMatchDetails';
import ExtendMatchHockey from '../components/Hockey/ExtendMatch';
import EditMatchDetailsBaseball from '../components/Baseball/EditMatchDetails';
import ExtendMatchBaseball from '../components/Baseball/ExtendMatch';
import UpdateMatchDetails from '../components/SuperteamFeed/UpdateMatchDetails';
import I18nEditConfig from '../components/I18N-CMS/EditConfig';
import UpdateCricketMatchDetails from '../components/SuperteamFeed/UpdateCricketMatchDetails';

const { Header, Footer, Sider, Content } = Layout;

class Base extends React.Component {
  render() {
    const { toggleButton, currentUser } = this.props;

    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={toggleButton}
          className="base-sider"
          width="260"
        >
          <Sidebar collapsed={toggleButton} />
        </Sider>
        <Layout
          className="base-content"
          style={{ marginLeft: toggleButton ? '80px' : '260px' }}
        >
          <Header
            className="header"
            style={{ left: toggleButton ? '80px' : '260px' }}
          >
            <Header />
          </Header>
          <Content style={{ marginTop: '64px' }}>
            <Switch>
              {menu_route.map((mainItem, index) =>
                mainItem.routes.map((item, id) =>
                  item.authority.filter(
                    role => "gh"
                  ).length ? (
                    <Route
                      key={index + id}
                      exact
                      path={item.path}
                      component={item.component}
                    />
                  ) : (
                    ''
                  )
                )
              )}
              <Route
                key={1000}
                exact
                path={'/i18n-config/edit'}
                component={I18nEditConfig}
              />
              <Route
                key={999}
                exact
                path={'/fantasy/edit-match-detail'}
                component={EditMatchDetails}
              />
              <Route
                key={998}
                exact
                path={'/fantasy/extend-match-detail'}
                component={ExtendMatch}
              />
              <Route
                key={997}
                exact
                path={'/kabaddi/edit-match-detail'}
                component={EditMatchDetailsKabaddi}
              />
              <Route
                key={996}
                exact
                path={'/kabaddi/extend-match-detail'}
                component={ExtendMatchKabaddi}
              />
              <Route
                key={995}
                exact
                path={'/football/edit-match-detail'}
                component={EditMatchDetailsFootball}
              />
              <Route
                key={994}
                exact
                path={'/football/extend-match-detail'}
                component={ExtendMatchFootball}
              />
              <Route
                key={993}
                exact
                path={'/stock/edit-match-detail'}
                component={EditMatchDetailsStock}
              />
              <Route
                key={992}
                exact
                path={'/stock/extend-match-detail'}
                component={ExtendMatchStock}
              />
              <Route
                key={991}
                exact
                path={'/basketball/edit-match-detail'}
                component={EditMatchDetailsBasketball}
              />
              <Route
                key={990}
                exact
                path={'/basketball/extend-match-detail'}
                component={ExtendMatchBasketball}
              />
              <Route
                key={989}
                exact
                path={'/hockey/edit-match-detail'}
                component={EditMatchDetailsHockey}
              />
              <Route
                key={988}
                exact
                path={'/hockey/extend-match-detail'}
                component={ExtendMatchHockey}
              />
              <Route
                key={987}
                exact
                path={'/superteam-feeds/update-match-details'}
                component={UpdateMatchDetails}
              />
              <Route
                key={986}
                exact
                path={'/baseball/edit-match-detail'}
                component={EditMatchDetailsBaseball}
              />
              <Route
                key={985}
                exact
                path={'/baseball/extend-match-detail'}
                component={ExtendMatchBaseball}
              />
              <Route
                key={984}
                exact
                path={'/superteam-cricket-feeds/update-cricket-match-details'}
                component={UpdateCricketMatchDetails}
              />
              <Redirect exact from="/" to="/home" />
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}
function mapStateToProps(state) {
  return {
    toggleButton: state.layout.sideMenuShow,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(layoutActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Base);
