import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message } from 'antd';
import SearchComponent from '../HomeDiscoveryWidget/SearchComponent';
import * as userProfileActions from '../../actions/UserProfileActions';

export class ResetUserAvatar extends Component {
  resetUserAvatar = (type, id) => {
    this.props.actions.wipeUserAvatar(id).then(() => {
      const { error, profile } = this.props.wipeUserAvatarResponse;
      if (!error && profile) {
        message.success('User Avatar Wiped successfully.');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        message.error(error ? error.message : 'Error while wiping profile.');
      }
    });
  };
  render() {
    return (
      <SearchComponent
        searchType={'users'}
        cardTitle={'User to Reset User Avatar'}
        addData={this.resetUserAvatar}
        hideCsv={true}
        searchUserActionCta="Reset User Avatar"
      />
    );
  }
}

const mapStateToProps = state => ({
  wipeUserAvatarResponse: state.userProfile.wipeUserAvatarResponse
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userProfileActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ResetUserAvatar);
