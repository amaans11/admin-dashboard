import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as internalToolActions from '../../actions/internalToolActions';
import { Card, Table, Button, Modal, Popconfirm, message } from 'antd';
import moment from 'moment';

class ToolList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      tableData: []
    };
  }
  componentDidMount() {
    this.props.actions.getInternalToolList().then(() => {
      if (this.props.getInternalToolListResponse) {
        this.setState({
          tableData: [...this.props.getInternalToolListResponse],
          showTable: true
        });
      }
      this.setState({
        showTable: true
      });
    });
    let userRoles = this.props.currentUser
      ? this.props.currentUser.user_role
      : [];
    this.setState({ userRoles: [...userRoles] });
  }

  editDetails(record) {
    this.props.actions.editTool(record);
    this.props.history.push('/tools/add');
  }

  runTool(record) {
    let data = {
      id: record.id
    };
    this.props.actions.runInternalTool(data).then(() => {
      if (this.props.runInternalToolResponse) {
        message.info(this.props.runInternalToolResponse);
      }
    });
  }

  deleteTool(record) {
    let data = {
      id: record.id
    };
    this.props.actions.deleteInternalTool(data).then(() => {
      if (this.props.deleteInternalToolResponse) {
        message
          .info(this.props.deleteInternalToolResponse, 1.5)
          .then(() => window.location.reload());
      }
    });
  }

  render() {
    const columns = [
      {
        title: 'Id',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: 'Description',
        key: 'description',
        dataIndex: 'description'
      },
      {
        title: 'Jar',
        key: 'jar',
        dataIndex: 'jar'
      },
      {
        title: 'Param',
        key: 'param',
        dataIndex: 'param'
      },
      {
        title: 'Command',
        key: 'command',
        dataIndex: 'command'
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            {(this.state.userRoles.includes('SUPER_ADMIN') ||
              this.state.userRoles.includes('INTERNAL_TOOLS_WRITE') ||
              this.state.userRoles.includes('INTERNAL_TOOLS_ADMIN')) && (
              <Button
                icon="edit"
                type="primary"
                onClick={() => this.editDetails(record, 'EDIT')}
              />
            )}
            <Popconfirm
              title="Sure to run this tool?"
              onConfirm={() => this.runTool(record)}
            >
              <Button
                style={{
                  marginLeft: '20px',
                  backgroundColor: 'green',
                  color: 'white'
                }}
              >
                Run
              </Button>
            </Popconfirm>
            {(this.state.userRoles.includes('SUPER_ADMIN') ||
              this.state.userRoles.includes('INTERNAL_TOOLS_ADMIN')) && (
              <Popconfirm
                title="Sure to delete tool?"
                onConfirm={() => this.deleteTool(record)}
              >
                <Button
                  style={{
                    marginLeft: '20px',
                    backgroundColor: 'red',
                    color: 'white'
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Card title={'Internal Tools List'}>
          {this.state.showTable && (
            <Table
              rowKey="id"
              bordered
              dataSource={this.state.tableData}
              columns={columns}
            />
          )}
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getInternalToolListResponse: state.interalTools.getInternalToolListResponse,
    runInternalToolResponse: state.interalTools.runInternalToolResponse,
    deleteInternalToolResponse: state.interalTools.deleteInternalToolResponse,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...internalToolActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolList);
