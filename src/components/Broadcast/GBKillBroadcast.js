import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Card, Col, Divider, Input, Row } from 'antd';
import {
  getBroadcastDetails,
  killBroadcast
} from '../../actions/broadcastActions';
import { isEmpty } from 'lodash';
const { Search } = Input;

class GBKillBroadcast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcastDetails: {}
    };
  }

  getBroadcast = gameBroadcastId => {
    this.props.actions.getBroadcastDetails({ gameBroadcastId }).then(() => {
      const { gameBroadcast = {}, battleDetails = [] } =
        this.props.getBroadcastDetailsResponse || {};
      const { broadcasterSendBirdUserId } = gameBroadcast;
      this.setState({
        broadcastDetails: gameBroadcast,
        battles: battleDetails,
        userId: broadcasterSendBirdUserId
      });
    });
  };

  killSurfacing = () => {
    const { gameBroadcastId } = this.state.broadcastDetails;
    this.props.actions.killBroadcast({ gameBroadcastId }).then(() => {
      this.getBroadcast(gameBroadcastId);
    });
  };

  render() {
    const { broadcastDetails } = this.state;

    return (
      <Card className="page-container" title="Kill Broadcast Surfacing">
        <Row>
          <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
            <strong>Broadcast ID: </strong>
            <Search
              placeholder="Enter game broadcast id"
              onSearch={this.getBroadcast}
              enterButton
              style={{ width: '500px', marginLeft: '.5rem' }}
            />
          </Col>

          {!isEmpty(broadcastDetails) && (
            <Col span={24}>
              <Divider />

              <pre>
                <code>
                  broadcastDetails: {JSON.stringify(broadcastDetails, null, 2)}
                </code>
              </pre>

              <Divider />

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Button type="danger" onClick={this.killSurfacing}>
                  Kill Surfacing
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getBroadcastDetailsResponse: state.broadcast.getBroadcastDetailsResponse,
  killBroadcastResponse: state.broadcast.killBroadcastResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ getBroadcastDetails, killBroadcast }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GBKillBroadcast);
