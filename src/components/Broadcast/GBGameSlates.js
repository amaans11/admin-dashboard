import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Card, Col, message, Row, Select } from 'antd';
import '../../styles/components/broadcast.css';
import * as storageActions from '../../actions/storageActions';
import * as broadcastActions from '../../actions/broadcastActions';
import FileUploader from './FileUploader';
import { INT_API_URL } from '../../shared/actionTypes';

const { Option } = Select;

const PRE_GAME_SLATE_UPLOAD_REQ_URL =
  INT_API_URL + 'api/game-broadcast/get-pre-game-slate-upload-url';
const POST_GAME_SLATE_UPLOAD_REQ_URL =
  INT_API_URL + 'api/game-broadcast/get-post-game-slate-upload-url';

class GBGameSlates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cdnPath: '',
      gameList: [],
      preGameSlateUrl: '',
      postGameSlateUrl: '',
      gameId: '',
      gameName: ''
    };

    // Refs for FileUploader
    this.preGameSlateUploaderRef = React.createRef();
    this.postGameSlateUploaderRef = React.createRef();
  }

  componentDidMount() {
    this.getCdnLink();
    this.getGamesList();
  }

  getCdnLink = () => {
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        const cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
  };

  getGamesList = () => {
    this.props.actions.getGamesForGB().then(() => {
      const { gameObj = [] } = this.props.getGamesForGBResponse || {};
      this.setState({ gameList: gameObj });
    });
  };

  onGameChange = gameId => {
    this.setState({ gameId });
    this.getGameSlates(gameId);
  };

  updatePreGameSlateUrl = preGameSlateUrl => {
    this.setState({ preGameSlateUrl });
  };

  updatePostGameSlateUrl = postGameSlateUrl => {
    this.setState({ postGameSlateUrl });
  };

  getGameSlates = gameId => {
    this.props.actions.getGameSlatesForGB({ gameId }).then(() => {
      const { slates = {} } = this.props.getGameSlatesForGBResponse || {};
      const { preGameSlateUrl, postGameSlateUrl, gameName } = slates;
      this.setState({ preGameSlateUrl, postGameSlateUrl, gameName });
    });
  };

  updateGameSlates = () => {
    const { preGameSlateUrl, postGameSlateUrl, gameId } = this.state;

    if (!preGameSlateUrl || !postGameSlateUrl) {
      message.error('Please upload both slates');
      return;
    }

    this.props.actions
      .updateGameSlatesForGB({ preGameSlateUrl, postGameSlateUrl, gameId })
      .then(() => {
        this.getGameSlates(gameId);
      });
  };

  render() {
    const {
      gameList,
      cdnPath,
      preGameSlateUrl,
      postGameSlateUrl,
      gameId
    } = this.state;

    return (
      <Card className="page-container" title="Slates">
        <Row className="ant-form-item">
          <Col
            span={6}
            className="ant-form-item-label"
            style={{ marginRight: '1rem' }}
          >
            Select Game:
          </Col>
          <Col span={8} className="ant-form-item-control">
            <Select
              style={{ width: '100%' }}
              placeholder="Select game"
              onChange={this.onGameChange}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {gameList.map((game, idx) => (
                <Option key={'gameOpt-' + idx} value={game.gameId}>
                  {game.gameName}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {!!gameId ? (
          <>
            <Row className="ant-form-item">
              <Col
                span={6}
                className="ant-form-item-label"
                style={{ marginRight: '1rem' }}
              >
                Pre Game Slate:
              </Col>
              <Col span={8} className="ant-form-item-control">
                <FileUploader
                  cdnPath={cdnPath}
                  uploadReqUrl={PRE_GAME_SLATE_UPLOAD_REQ_URL}
                  ref={this.preGameSlateUploaderRef}
                  fileUrl={preGameSlateUrl}
                  callbackFromParent={this.updatePreGameSlateUrl}
                />
              </Col>
            </Row>

            <Row className="ant-form-item">
              <Col
                span={6}
                className="ant-form-item-label"
                style={{ marginRight: '1rem' }}
              >
                Post Game Slate:
              </Col>
              <Col span={8} className="ant-form-item-control">
                <FileUploader
                  cdnPath={cdnPath}
                  uploadReqUrl={POST_GAME_SLATE_UPLOAD_REQ_URL}
                  ref={this.postGameSlateUploaderRef}
                  fileUrl={postGameSlateUrl}
                  callbackFromParent={this.updatePostGameSlateUrl}
                />
              </Col>
            </Row>

            <Row className="ant-form-item">
              <Col span={8} offset={6} className="ant-form-item-control">
                <em>Delete existing files to add new and update</em>
              </Col>
            </Row>

            <Row className="ant-form-item">
              <Col span={8} offset={6} className="ant-form-item-control">
                <Button
                  type="primary"
                  onClick={this.updateGameSlates}
                  style={{ marginLeft: '1rem' }}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <Row className="ant-form-item">
            <Col span={8} offset={6} className="ant-form-item-control">
              <em>Select a game from above</em>
            </Col>
          </Row>
        )}
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getCdnPathForUploadResponse: state.storage.getCdnPathForUploadResponse,
  getGamesForGBResponse: state.broadcast.getGamesForGBResponse,
  getGameSlatesForGBResponse: state.broadcast.getGameSlatesForGBResponse,
  updateGameSlatesForGBResponse: state.broadcast.updateGameSlatesForGBResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...storageActions, ...broadcastActions },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(GBGameSlates);
