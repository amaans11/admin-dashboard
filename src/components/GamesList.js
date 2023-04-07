import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gamesListActions from '../actions/gameActions';
import { Table, Card, message } from 'antd';
class GamesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (!this.props.gamesList) {
      this.props.actions.fetchGames().then(() => {});
    }
  }
  componentWillUnmount() {
    message.destroy();
  }
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Android Version',
        dataIndex: 'platforms.android.version',
        key: 'platforms.android.version'
      },
      {
        title: 'Assets(Thumbnail)',
        dataIndex: 'platforms.android.assets.thumbnail',
        key: 'platforms.android.assets.thumbnail'
      }
    ];
    return (
      <React.Fragment>
        <Card title="List of android games">
          <Table
            rowKey="id"
            bordered
            dataSource={this.props.gamesList}
            columns={columns}
          />
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(gamesListActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamesList);
