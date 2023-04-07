import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Card, Table } from 'antd';
import '../../styles/components/broadcast.css';
import {
  getBroadcasters,
  createBroadcasters
} from '../../actions/broadcastActions';
import AddBroadcastersModalForm from './CreateBroadcastersModalForm';

class GBBroadcasters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: '',
      name: '',
      isModalActive: false,
      isLoading: false
    };
  }

  componentDidMount() {
    // the get broadcaster API was gatting called at many pages, so if there was a previous call no need to request the info again
    if (!this.props.getBroadcastersResponse) {
      this.getBroadcastersFn();
    }
  }

  getBroadcastersFn = () => {
    this.setState({ isLoading: true });
    const { getBroadcasters } = this.props.actions;
    getBroadcasters().then(() => {
      this.setState({ isLoading: false });
    });
  };

  handleCancel = () => {
    this.setState({ isModalActive: false });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  createBroadcasters = () => {
    const { createBroadcasters } = this.props.actions;
    const { emailId, name } = this.state;
    const broadcasterDetails = { emailId, name };
    createBroadcasters({ broadcasterDetails }).then(() => {
      this.setState({ isModalActive: false }); // after the submit was clicked no need for the modal to keep appearing
      this.getBroadcastersFn();
    });
    // After creating new broadcaster it is important to see the broadcaster which is why calling the API
  };

  render() {
    const { isLoading, isModalActive, emailId, name } = this.state;
    const { handleCancel, createBroadcasters, handleInputChange } = this;
    const { broadcasters = [] } = this.props.getBroadcastersResponse || {};

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Email',
        dataIndex: 'emailId',
        key: 'emailId'
      }
    ];

    return (
      <Card
        className="page-container"
        title="Broadcasters"
        extra={
          <Button
            ghost
            type="primary"
            onClick={() => this.setState({ isModalActive: true })}
          >
            Create Broadcasters
          </Button>
        }
      >
        <Table
          bordered
          dataSource={broadcasters}
          columns={columns}
          rowKey={record => record.id}
          loading={isLoading}
        />

        <AddBroadcastersModalForm
          visible={isModalActive}
          handleCancel={handleCancel}
          createBroadcasters={createBroadcasters}
          emailId={emailId}
          name={name}
          handleInputChange={handleInputChange}
        />
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getBroadcastersResponse: state.broadcast.getBroadcastersResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ getBroadcasters, createBroadcasters }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GBBroadcasters);
