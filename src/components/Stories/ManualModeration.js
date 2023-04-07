import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';
import {
  Card,
  message,
  Button,
  Popconfirm,
  Modal,
  Empty,
  Row,
  Col,
  InputNumber,
  Divider
} from 'antd';
import StoryDetails from './StoryDetails';

const STORY_STATE = [
  'INITIALIZED',
  'STORY_CREATED',
  'MANUAL_MODERATION_REQUIRED',
  'STORY_LIVE',
  'STORY_BLOCKED',
  'STORY_EXPIRED',
  'STORY_DELETED'
];

const VIDEO_STATE = [
  'INITIALIZED',
  'UPLOADED',
  'NON_MODERATE',
  'MODERATION_SUSPECTED',
  'MODERATION_FAIL',
  'MODERATION_PASS',
  'APPROVED',
  'REJECTED'
];

const STORY_ACTION = ['APPROVED', 'REJECTED'];

class ManualModeration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storyId: '',
      visible: false,
      isLoading: false,
      storiesList: [],
      activeStory: {},
      start: 0,
      count: 20
    };
  }

  componentDidMount() {
    this.getModStories();
  }

  getModStories = () => {
    const params = {
      offset: this.state.start,
      count: this.state.count
    };
    this.props.actions.getManualModStories(params).then(() => {
      if (this.props.getManualModStoriesResponse) {
        const storiesList = this.props.getManualModStoriesResponse.stories
          ? this.props.getManualModStoriesResponse.stories
          : [];
        this.setState({ storiesList });
      }
    });
  };

  updateModStory = (storyId, action) => {
    const params = { storyId, action };
    this.props.actions.updateManualModStory(params).then(() => {
      if (
        this.props.updateManualModStoryResponse &&
        this.props.updateManualModStoryResponse.status.code === 200
      ) {
        message.success('Story MOD status updated!');
        // update story list
        this.getModStories();
      } else {
        message.error('Unable to update MOD status for story!');
      }
    });
  };

  confirmApprove = storyId => {
    this.updateModStory(storyId, STORY_ACTION.indexOf('APPROVED'));
  };

  cancelApprove = () => {
    message.error('Click on No');
  };

  confirmReject = storyId => {
    this.updateModStory(storyId, STORY_ACTION.indexOf('REJECTED'));
  };

  cancelReject = () => {
    message.error('Click on No');
  };

  showModal = activeStory => {
    this.setState({ activeStory, visible: true });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onStartValueChange = value => {
    this.setState({ start: value });
  };

  onCountValueChange = value => {
    this.setState({ count: value });
  };

  render() {
    return (
      <Card className="page-container" title="Manual Moderation">
        <Row>
          <Col span={4}>
            Start:{' '}
            <InputNumber
              min={0}
              defaultValue={this.state.start}
              onChange={this.onStartValueChange}
            ></InputNumber>
          </Col>
          <Col span={4}>
            Count:{' '}
            <InputNumber
              min={0}
              defaultValue={this.state.count}
              onChange={this.onCountValueChange}
            ></InputNumber>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={this.getModStories}>
              Refresh
            </Button>
          </Col>
        </Row>

        <Divider dashed />

        {this.state.storiesList.length ? (
          <em>Showing {this.state.storiesList.length} items</em>
        ) : null}

        {this.state.storiesList.length ? (
          this.state.storiesList.map((story, idx) => (
            <div key={idx} className="story-card">
              <div>
                <div>Story ID: {story.storyId}</div>
                <div>Story State: {STORY_STATE[story.state]}</div>
                <div>Video State: {VIDEO_STATE[story.video.videoState]}</div>
              </div>

              <div>
                <Button
                  style={{ marginRight: '1rem' }}
                  onClick={() => this.showModal(story)}
                  icon="eye"
                  type="primary"
                  ghost
                >
                  View Story
                </Button>

                <Popconfirm
                  title="Are you sure to approve this story?"
                  onConfirm={() => this.confirmApprove(story.storyId)}
                  // onCancel={this.cancelDelete}
                  okText="Confirm"
                  okType="danger"
                  cancelText="Cancel"
                >
                  <Button
                    type="primary"
                    style={{ marginRight: '1rem' }}
                    icon="check"
                  >
                    Approve
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Are you sure to reject this story?"
                  onConfirm={() => this.confirmReject(story.storyId)}
                  // onCancel={this.cancelDelete}
                  okText="Confirm"
                  okType="danger"
                  cancelText="Cancel"
                >
                  <Button type="danger" icon="close">
                    Reject
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )}

        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          centered
          wrapClassName="story-detail-pop"
        >
          {this.state.activeStory && this.state.activeStory.video ? (
            window &&
            window.location &&
            window.location.hostname === 'crm-dashboard.""' ? (
              <video
                controls
                width="400"
                poster={this.state.activeStory.video.coverUrl}
                src={this.state.activeStory.video.fileUrl}
              />
            ) : (
              <StoryDetails storyDetails={this.state.activeStory} />
            )
          ) : (
            <Empty />
          )}
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getManualModStoriesResponse: state.story.getManualModStoriesResponse,
    updateManualModStoryResponse: state.story.updateManualModStoryResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualModeration);
