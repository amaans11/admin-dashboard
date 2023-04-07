import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Card, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../actions/authActions';
import logo from '../assets/logo.svg';
import '../styles/components/login.css';
import config from '../auth/config';

const { Meta } = Card;
let auth2;
/* global gapi */

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };
  constructor(props) {
    super(props);
    // this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = () => {
      gapi.load('auth2', () => {
        auth2 = gapi.auth2.init(config);
      });
    };

    document.body.appendChild(script);
  }

  signIn = () => {
    auth2.signIn().then(googleUser => {
      let authResponse = googleUser.getAuthResponse();
      let basicProfile = googleUser.getBasicProfile();
      if (!(authResponse && authResponse.id_token)) {
        message.error('Could not fetch id token from google api servers');
        return;
      }

      let user = {
        name: basicProfile.getName(),
        fName: basicProfile.getGivenName(),
        email: basicProfile.getEmail(),
        displayPic: basicProfile.getImageUrl(),
        googleToken: authResponse.id_token
      };

      this.props.actions.loginUser(user).then(() => {
        const { currentUser } = this.props;
        if (currentUser && currentUser.accessToken) {
          message.success('Login success!');
          // Not needed because we are cehcking from props
          // this.setState({ redirectToReferrer: true });
        }
      });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    let { redirectToReferrer } = this.state;
    const { currentUser } = this.props;

    if (currentUser && currentUser.accessToken) {
      redirectToReferrer = true;
    }

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div id="login-outer">
        <Card
          className="login"
          cover={<img className="logo" src={logo} />}
        >
          <Meta
            title="Login via Google Apps"
          />
          <Button
            onClick={this.signIn}
            type="primary"
            icon="google"
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(AuthActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
