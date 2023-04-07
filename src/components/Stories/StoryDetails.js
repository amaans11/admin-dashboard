import React from 'react';
import moment from 'moment';
import '../../styles/components/stories.css';
import { Icon, Tag, Tooltip, Button, Modal } from 'antd';

export default class StoryDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { storyDetails } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <div>
          <video
            controls
            width="300"
            poster={storyDetails.video.coverUrl}
            src={storyDetails.video.fileUrl}
          ></video>
        </div>

        <div style={{ padding: '.5rem 1rem', width: '300px' }}>
          <div>
            <strong>
              Tag: {storyDetails.tag ? storyDetails.tag : '<empty>'}
            </strong>
          </div>

          <div style={{ padding: '.5rem 0' }}>
            <strong>Creator:</strong> {storyDetails.creator.displayName}
          </div>

          <div style={{ padding: '.5rem 0', fontSize: '1.1rem' }}>
            <Tooltip title="Viewes">
              <span style={{ marginRight: '1rem' }}>
                <Icon type="eye" />{' '}
                {storyDetails.uniqueViewCount
                  ? storyDetails.uniqueViewCount
                  : 0}
              </span>
            </Tooltip>
            <Tooltip title="Reactions">
              <span style={{ marginRight: '1rem' }}>
                <Icon type="like" />{' '}
                {storyDetails.reactionCount ? storyDetails.reactionCount : 0}
              </span>
            </Tooltip>
            <Tooltip title="Comments">
              <span style={{ marginRight: '1rem' }}>
                <Icon type="message" />{' '}
                {storyDetails.commentCount ? storyDetails.commentCount : 0}
              </span>
            </Tooltip>
            <Tooltip title="Share">
              <span style={{ marginRight: '1rem' }}>
                <Icon type="share-alt" />{' '}
                {storyDetails.shareCount ? storyDetails.shareCount : 0}
              </span>
            </Tooltip>
          </div>

          <div style={{ padding: '.5rem 0' }}>
            User Tags:{' '}
            {storyDetails.userTags && storyDetails.userTags.length > 0
              ? storyDetails.userTags.map((tag, idx) => (
                  <Tag key={idx} color="blue">
                    {tag}
                  </Tag>
                ))
              : '<empty>'}
          </div>

          <div>
            Created: {moment(parseInt(storyDetails.createdOn, 10)).fromNow()}
          </div>
          <div>
            Expired: {moment(parseInt(storyDetails.expireOn, 10)).fromNow()}
          </div>

          <div style={{ margin: '1rem 0' }}>
            <Button onClick={this.showModal}>View More Details</Button>
            <Modal
              title="Story Details"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={null}
            >
              <pre>{JSON.stringify(storyDetails, null, 2)}</pre>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
