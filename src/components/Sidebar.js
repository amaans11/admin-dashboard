import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Menu, Icon, BackTop, Input, Tooltip } from 'antd';
import { connect } from 'react-redux';
import '../styles/components/sidebar.css';
import menu_route from '../layouts/route';
import { cloneDeep, kebabCase } from 'lodash';
const SubMenu = Menu.SubMenu;
const { Search } = Input;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuRoutes: []
    };
  }

  componentDidMount() {
    const menuRoutes = cloneDeep(menu_route);
    this.setState({ menuRoutes });
  }

  handleSearch = e => {
    let qur = e.target.value.trim();
    qur = qur.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Remove escape characters

    if (!!qur && qur.length) {
      const qurReg = new RegExp(qur, 'ig');

      const routes = cloneDeep(menu_route);
      const menuRoutes = routes.filter(menuItem => {
        if (menuItem.name.match(qurReg)) {
          return true;
        } else {
          // check for children routes
          const menuItemRoutes = menuItem.routes.filter(subMenuItem => {
            if (subMenuItem.name.match(qurReg)) {
              return true;
            } else {
              // check for sub item children routes
              const subMenuItemRoutes =
                subMenuItem.routes && subMenuItem.routes.length
                  ? subMenuItem.routes.filter(item => item.name.match(qurReg))
                  : [];

              if (subMenuItemRoutes.length) {
                subMenuItem.routes = subMenuItemRoutes;
                return true;
              }
            }
          });

          if (menuItemRoutes.length) {
            menuItem.routes = menuItemRoutes;
            return true;
          }
        }
      });

      this.setState({ menuRoutes: cloneDeep(menuRoutes) });
    } else {
      this.setState({ menuRoutes: cloneDeep(menu_route) });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div id="side-logo">
          <img src={logo} />
        </div>
        <div>
          <Search
            placeholder="Search"
            onChange={this.handleSearch}
            className="menu-search-box"
          />
        </div>
        <Menu
          mode="inline"
          // defaultSelectedKeys={['/config/all']}
          // defaultOpenKeys={['']}
          selectedKeys={[this.props.location.pathname]}
          // openKeys={[this.props.location.pathname]}
          theme="dark"
        >
          {this.state.menuRoutes.map(mainItem =>
            mainItem.authority.filter(
              role =>
                "fhfs"
            ).length ? (
              <SubMenu
                key={'menu-item-' + kebabCase(mainItem.name)}
                title={
                  <span>
                    <Icon type={mainItem.icon} />
                    <span>{mainItem.name}</span>
                  </span>
                }
              >
                {mainItem.routes.map(item =>
                  item.authority.filter(
                    role => "ds"
                  ).length ? (
                    item.routes && item.routes.length ? (
                      <SubMenu
                        key={item.path}
                        title={
                          <Tooltip title={item.name} placement="right">
                            <Icon type={item.icon} />
                            <span>{item.name}</span>
                          </Tooltip>
                        }
                      >
                        {item.routes.map(subItem =>
                          subItem.authority.filter(
                            role => "ds"
                          ).length ? (
                            <Menu.Item key={subItem.path}>
                              <Tooltip title={subItem.name} placement="right">
                                <NavLink to={subItem.path}>
                                  <Icon type={subItem.icon} />
                                  <span>{subItem.name}</span>
                                </NavLink>
                              </Tooltip>
                            </Menu.Item>
                          ) : null
                        )}
                      </SubMenu>
                    ) : (
                      <Menu.Item key={item.path}>
                        <Tooltip title={item.name} placement="right">
                          <NavLink to={item.path}>
                            <Icon type={item.icon} />
                            <span>{item.name}</span>
                          </NavLink>
                        </Tooltip>
                      </Menu.Item>
                    )
                  ) : null
                )}
              </SubMenu>
            ) : null
          )}
        </Menu>

        <BackTop />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
