import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as groupActions from '../actions/groupActions';
import { Table, Card, message } from 'antd';

class AllGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    message.loading("Group's loading in progress..", 0);
    this.props.actions.getGroups().then(() => {
      message.destroy();
    });
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
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: 'Added Tournament in order',
        dataIndex: 'configOrder',
        key: 'configOrder'
      }
    ];
    return (
      <React.Fragment>
        <Card title="List of All Groups">
          <Table
            rowKey="id"
            bordered
            dataSource={this.props.groupsList}
            columns={columns}
          />
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    groupsList: state.groups.allGroups
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(groupActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllGroups);
