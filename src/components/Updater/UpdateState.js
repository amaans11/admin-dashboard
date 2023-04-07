import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as UpdaterActions from '../../actions/updaterActions';
import { Button, Row, Col } from 'antd';
class UpdateState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const skip = () => {
      this.props.history.push('/updater/all');
    };
    const publishUpdate = () => {
      var vm = this;
      this.props.actions
        .publishUpdate(vm.props.updater.config, {
          updateId: vm.props.updater.config.id,
          newState: 'DEPLOYED_INTERNALLY'
        })
        .then(() => {
          vm.props.history.push('/updater/all');
        });
    };
    return (
      <React.Fragment>
        <h3>Upload Finished</h3>

        <h4>You can publish this update internally or cancel this process!</h4>
        <Row>
          <Col span={12}>
            <Button onClick={skip} type="primary" htmlType="button">
              Skip for Now
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              icon="cloud-upload"
              onClick={publishUpdate}
              htmlType="button"
            >
              Publish Internally
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    updater: state.updater
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UpdaterActions, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UpdateState)
);
