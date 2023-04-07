import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import Base from './layouts/Base';
import { hot } from 'react-hot-loader';
import { message, notification } from 'antd';
import { HOST_PATH, INT_API_URL } from './shared/actionTypes';
import axios from 'axios';
import { isEmpty } from 'lodash';

const store = configureStore();
let api_url = '';

axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    api_url = config.url;
    if (config.method === 'get') {
      message.loading('Getting data from server...', 1);
    } else if (config.method === 'post') {
      // config.data = JSON.stringify(config.data);
      message.loading('Updation of data in progress...', 1);
    } else {
      message.loading('Working on it...', 1);
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  async function(response) {
    // Do something with response data
    // Close all message toasts
    message.destroy();

    // Check for failed authorization custom code, not HTTP code
    if (
      response.data &&
      response.data.status &&
      response.data.status.code === 1001
    ) {
      // Get user token from localstorage
      const userData = localStorage.getItem('cred');
      const refreshLoginRes = await axios.post(
        INT_API_URL + 'auth/refresh-login',
        userData
      );
      if (
        refreshLoginRes.data &&
        refreshLoginRes.data.status &&
        refreshLoginRes.data.status.code === 200
      ) {
        localStorage.setItem('cred', JSON.stringify({}));
        localStorage.setItem(
          'cred',
          JSON.stringify(refreshLoginRes.data.payload)
        );

        const accessToken = refreshLoginRes.data.payload.accessToken;
        axios.defaults.headers.Authorization = `Bearer ${accessToken}`;

        const newReq = response.config;
        newReq.headers.Authorization = `Bearer ${accessToken}`;
        const res = await axios(newReq);
        return res;
      }

      // Return empty response so it doesn't break anything
      return { data: {} };
    }

    if (
      response.data &&
      response.data.status &&
      response.data.status.code === 1002
    ) {
      message.error(response.data.status.message, 2, () => {
        localStorage.removeItem('cred');
        window.location.href = '/login';

        // const currentPath = store.getState().router.location.pathname;
        // store.dispatch(push('/login', { from: currentPath }));
      });

      return { data: {} };
    }

    if (
      response.data &&
      response.data.status &&
      response.data.status.code === 440
    ) {
      localStorage.removeItem('cred');
      message.loading(
        'User Role has been changed, redirecting to Login Page..',
        3
      );
      window.location.reload();
    }

    if (
      response.data &&
      response.data.status &&
      response.data.status.code > 299
    ) {
      let err = response.data.status.message;
      try {
        const details = JSON.parse(response.data.payload.details) || {};
        err = `${err}: ${details.message}`;
      } catch (e) {
        err = err + '';
      }
      message.error(err, 3);
      return { data: {} };
    } else {
      return response;
    }
  },
  function(error) {
    let error_api = api_url.slice(HOST_PATH.length, api_url.length);
    message.destroy();
    notification.error({
      message: 'Api Error',
      description: `${error_api} => api from backend is not working, try refreshing the page. If problem persists, contact engineering team for ${error} `,
      duration: 5
    });
    return Promise.reject(error);
  }
);

function AuthenticatedRoute({ component: SubComp, authenticated, ...rest }) {
  const currentUser = store.getState().auth.currentUser;

  if (!isEmpty(currentUser) && currentUser.accessToken) {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${currentUser.accessToken}`;
  }

  return (
    <Route
      {...rest}
      render={props =>
        currentUser && currentUser.accessToken ? (
          <SubComp {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Switch>
              <Route exact path="/login" component={Login} />
              <AuthenticatedRoute path="/" component={Base} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
// export default App;
