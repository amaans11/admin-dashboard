// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as videoActions from '../../actions/videoActions';
import {
  Card,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  Icon,
  Button,
  message,
  Popconfirm
} from 'antd';

const { Meta } = Card;
// type TrendingLeaderboard ={}

class FeaturedVideoLeaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.actions.getFeaturedVideos().then(() => {
      this.setState({
        showBoard: true
      });
    });
  }
  changeStatus = video => {
    let videoDetails = {};
    switch (video.videoType) {
      case 0:
        videoDetails.videoType = 'GAMEPLAY';
        video.tableId = video.gameplay.videoDetails.id;
        break;
      case 1:
        videoDetails.videoType = 'YOUTUBE';
        video.tableId = video.featured.id;
        break;
      case 2:
        videoDetails.videoType = 'CDN';
        video.tableId = video.featured.id;
        break;
      case 3:
        videoDetails.videoType = 'FACEBOOK';
        video.tableId = video.featured.id;
        break;
      default:
        break;
    }
    this.props.actions
      .changeStatus(
        !video.isActive,
        video.tableId,
        videoDetails.videoType,
        'FEATURED'
      )
      .then(() => {
        message.success(
          'Operation Successful, it will be updated on next leaderboard',
          3
        );
      });
  };
  editVideo = video => {
    this.props.actions.addFeaturedVideoAction(video, 'EDIT');
    this.props.history.push('/video/featured/add');
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          {this.state.showBoard
            ? this.props.video.featuredBoard.videos.map((video, index) => (
                <Col key={index} span={5} offset={1} style={{ marginTop: 30 }}>
                  <Badge count={index + 1}>
                    <Card
                      actions={[
                        // <Tooltip title="Edit Video">
                        //   <Button
                        //     icon="edit"
                        //     onClick={() => this.editVideo(video)}
                        //   />
                        // </Tooltip>,
                        <Tooltip title="Activate/Deactivate Video">
                          <Popconfirm
                            placement="bottom"
                            title="Are you sure？"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => {
                              this.changeStatus(video);
                            }}
                          >
                            {video.isActive ? (
                              <Button type="danger" icon="close" />
                            ) : (
                              <Button type="primary" icon="check" />
                            )}
                          </Popconfirm>
                        </Tooltip>,
                        <Button icon="info" />
                      ]}
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        video.videoType === 0 ||
                        video.videoType === 1 ||
                        video.videoType === 2 ||
                        video.videoType === 3 ? (
                          <iframe
                            src={
                              video.videoType === 0 || video.videoType === 3
                                ? `https://www.facebook.com/plugins/video.php?href=${
                                    video.videoType === 0
                                      ? video.gameplay.videoDetails.iframeSource
                                      : video.featured.iframeSource
                                  }`
                                : `https://www.youtube.com/embed/${video.featured.videoId}`
                            }
                            scrolling="no"
                            frameBorder="0"
                            title={'iframe'}
                          />
                        ) : (
                          <video width="400" controls>
                            <source
                              src={video.featured.sourceUrl}
                              type="video/mp4"
                            />
                          </video>
                        )
                      }
                    >
                      <Meta
                        avatar={
                          <Avatar
                            src={
                              video.videoType === 0
                                ? video.gameplay.user.coverPhotos.small
                                : video.featured.profilePicUrl
                            }
                          />
                        }
                        title={
                          video.videoType === 0
                            ? video.gameplay.user.displayName
                            : video.featured.title
                        }
                        description={
                          <span>
                            <span>
                              {video.videoType === 0
                                ? video.gameplay.user.displayName
                                : video.featured.profileName}
                            </span>
                            <br />
                            <span>
                              {video.videoType === 0
                                ? video.gameplay.user.displayName
                                : video.featured.description}
                            </span>
                            <Icon
                              style={{ marginLeft: 5 }}
                              type="heart"
                              theme="twoTone"
                              twoToneColor="#eb2f96"
                            />
                          </span>
                        }
                      />
                    </Card>
                  </Badge>
                </Col>
              ))
            : ''}
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    video: state.video
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(videoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeaturedVideoLeaderboard);
