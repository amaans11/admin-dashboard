import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as layoutActions from '../actions/layoutActions';
import * as authActions from '../actions/authActions';
import { withRouter } from 'react-router-dom';
import { Menu, Dropdown, Avatar, Icon, Row, Col, message } from 'antd';
import '../styles/components/header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.sideBarToggle = this.sideBarToggle.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.state = {
      isProduction: false,
      currentUser: props.currentUser
    };
  }

  sideBarToggle() {
    this.props.actions.sideBarToggle(this.props.toggleButton);
  }

  logoutUser = () => {
    this.props.actions.logoutUser().then(() => {
      if (
        this.props.logoutUserResponse &&
        this.props.logoutUserResponse.status &&
        this.props.logoutUserResponse.status.code === 200
      ) {
        message.success('User logged out! redirecting to login');
        localStorage.removeItem('cred');
        window.location.href = '/login';
        // this.props.history.push('/login');
      }
    });
  };

  render() {
    const { currentUser } = this.props;
    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={this.logoutUser}>Sign Out</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Row justify={'center'}>
          <Col span={2}>
            <Icon
              type={this.props.toggleButton ? 'menu-unfold' : 'menu-fold'}
              style={{ cursor: 'pointer' }}
              onClick={this.sideBarToggle}
            />
          </Col>
          <Col span={16} push={8}>
            {this.state.isProduction && (
              <h1 style={{ color: '#8c2f2f' }}>PRODUCTION</h1>
            )}
          </Col>
          <Col span={6}>
            <div id="search">
              <Dropdown className="user" overlay={menu} placement="bottomRight">
                <span>
                  <Avatar size="small" src={currentUser.displayPic} />
                  <span>{currentUser.fName}</span>
                </span>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    toggleButton: state.layout.sideMenuShow,
    currentUser: state.auth.currentUser,
    logoutUserResponse: state.auth.logoutUserResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign({}, layoutActions, authActions),
      dispatch
    )
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Header)
);
