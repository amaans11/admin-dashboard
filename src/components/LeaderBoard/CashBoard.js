// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as leaderboardActions from '../../actions/leaderboardActions';
import { Card, Table, Avatar } from 'antd';

// type index ={}

class CashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lb: [],
      gameOrder: [],
      gameIndex: 0,
      previewVisible: false
    };
  }
  componentDidMount() {
    var vm = this;

    this.props.actions.getCashLeaderboard().then(() => {
      let cashLb = [...vm.props.leaderboard.cashLb.cashBoard];
      cashLb.forEach((element, index) => {
        element.profile = vm.props.leaderboard.cashLb.data[index].profile;
      });
      vm.setState({
        cashLb,
        showTable: true
      });
    });
  }
  handleCancel = () => this.setState({ previewVisible: false });

  getUser(user) {
    var vm = this;
    this.props.actions.getUserProfile(user.userId).then(() => {
      vm.setState({
        userProfile: vm.props.leaderboard.userProfile,
        previewVisible: true
      });
    });
  }

  render() {
    const columns = [
      {
        title: 'R',
        dataIndex: 'rank',
        width: 70
      },
      {
        title: 'User Id',
        dataIndex: 'userId'
      },
      {
        title: 'Mobile',
        dataIndex: 'profile.mobileNumber'
      },

      {
        title: 'Name',
        dataIndex: 'name',
        width: 200
      },
      {
        title: 'Avatar',
        dataIndex: 'avatar',
        render: (text, record) => (
          <span>
            <Avatar style={{ marginRight: 20 }} src={record.avatar} />
            <a href={record.avatar}>Download</a>
          </span>
        )
      },
      {
        title: 'Total Cash',
        dataIndex: 'totalCash'
      }

      // {
      //   title: "Prize",
      //   render: (text, record) => (
      //     <React.Fragment>
      //       {record.reward.cash ? (
      //         <span>
      //           C:
      //           {record.reward.cash}
      //         </span>
      //       ) : (
      //         ""
      //       )}
      //       {record.reward.tokens ? (
      //         <span>
      //           T:
      //           {record.reward.tokens}
      //         </span>
      //       ) : (
      //         ""
      //       )}
      //     </React.Fragment>
      //   )
      // },
    ];
    return (
      <React.Fragment>
        {this.state.showTable ? (
          <React.Fragment>
            <div>
              <Card title="Yesterday's Cash Leaderboard">
                <Table
                  rowKey="userId"
                  bordered
                  dataSource={this.state.cashLb}
                  columns={columns}
                />
              </Card>
            </div>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    leaderboard: state.leaderboard,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(leaderboardActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashBoard);
