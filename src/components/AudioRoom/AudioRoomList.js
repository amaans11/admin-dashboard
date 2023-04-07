import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as audioActions from '../../actions/AudioRoomActions';
import CASH from '../../assets/ic_cash.png';
import {
  Card,
  Button,
  message,
  Popconfirm,
  Avatar,
  Row,
  Col,
  Icon,
  Modal,
  Tag
} from 'antd';

const { Meta } = Card;

class AudioRoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      pageSize: 10,
      pageNum: 1,
      audioRoomList: [],
      fetchMoreFlag: true,
      showModal: false,
      selectedRoom: {},
      selectedTag: {}
    };
    this.closeRoom = this.closeRoom.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
    this.goBack = this.goBack.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.getAudioRoomTopic = this.getAudioRoomTopic.bind(this);
    this.selectTag = this.selectTag.bind(this);
  }
  componentDidMount() {
    this.getAudioRoomTopic();
  }

  selectTag(item) {
    // console.log(item);
    this.setState(
      { selectedTag: { ...item }, pageNum: 1, showList: false },
      () => this.getAudioRoomList()
    );
  }

  getAudioRoomTopic() {
    this.props.actions.getAudioRoomTopics().then(() => {
      if (this.props.getAudioRoomTopicsResponse) {
        let config = JSON.parse(this.props.getAudioRoomTopicsResponse).config;
        let existingList =
          config['podcast.configs'] && config['podcast.configs'].topics
            ? config['podcast.configs'].topics
            : [];
        let filterTags =
          config['podcast.configs'] && config['podcast.configs'].filterTags
            ? config['podcast.configs'].filterTags
            : [];
        this.setState(
          {
            existingList: [...existingList],
            filterTags: [...filterTags],
            fetched: true,
            selectedTag: { ...filterTags[0] }
          },
          () => this.getAudioRoomList()
        );
      }
    });
  }

  fetchMore() {
    let currentCount = this.state.pageNum;
    this.setState(
      {
        pageNum: currentCount + 1
      },
      () => {
        this.getAudioRoomList();
      }
    );
  }

  showDetails(item) {
    this.setState({ selectedRoom: { ...item }, showModal: true });
  }

  goBack() {
    let currentCount = this.state.pageNum;
    this.setState(
      {
        pageNum: currentCount - 1
      },
      () => {
        this.getAudioRoomList();
      }
    );
  }

  getAudioRoomList() {
    let data = {
      userId: 1000000,
      start: (this.state.pageNum - 1) * this.state.pageSize,
      count: this.state.pageSize,
      type: this.state.selectedTag.value.trim()
    };
    this.props.actions.getAudioRoomList(data).then(() => {
      if (this.props.getAudioRoomListResponse.rooms) {
        this.setState({
          audioRoomList: [...this.props.getAudioRoomListResponse.rooms],
          showList: true
        });
        if (this.props.getAudioRoomListResponse.rooms.length >= 10) {
          this.setState({ fetchMoreFlag: true });
        } else {
          this.setState({ fetchMoreFlag: false });
        }
      }
    });
  }

  closeRoom(id) {
    let data = {
      userId: 1000000,
      roomId: id
    };
    this.props.actions.closeAudioRoom(data).then(() => {
      console.log(this.props.closeAudioRoomResponse);
      if (!this.props.getAudioRoomListResponse.error) {
        message
          .success('Closed Successfulluy', 1.5)
          .then(() => window.location.reload());
      }
    });
  }

  render() {
    const hideModal = () => {
      this.setState({
        showModal: false
      });
    };
    return (
      <React.Fragment>
        {this.state.fetched && (
          <Card>
            {this.state.filterTags.map((item, index) => (
              <span
                key={item.label + index}
                onClick={() => this.selectTag(item)}
              >
                <Tag
                  key={item}
                  color={
                    item.label === this.state.selectedTag.label ? '#108ee9' : ''
                  }
                >
                  {item.label}
                </Tag>
              </span>
            ))}
          </Card>
        )}
        {this.state.showList ? (
          <Row type="flex">
            {this.state.audioRoomList.map(item => (
              <Col key={item.id} style={{ margin: '10px' }} span={6}>
                <Card
                  title={
                    <span>
                      <span>{item.displayName}</span>
                      <span
                        style={{
                          background: item.theme,
                          width: '16px',
                          height: '16px',
                          color: '#fff',
                          marginLeft: 10
                        }}
                      >
                        {item.theme}
                      </span>
                    </span>
                  }
                  actions={[
                    <Popconfirm
                      title="Are you sure that you want to close the room?"
                      onConfirm={() => this.closeRoom(item.id)}
                    >
                      <Button type="danger" size="small">
                        Close Room
                      </Button>
                    </Popconfirm>
                  ]}
                  extra={
                    <Icon
                      style={{ fontSize: '20px' }}
                      type="info-circle"
                      theme="twoTone"
                      onClick={() => this.showDetails(item)}
                    />
                  }
                >
                  <Meta
                    avatar={<Avatar src={item.host.profile.avatarUrl} />}
                    title={item.host.profile.displayName}
                    description={
                      <span>
                        {' '}
                        <img style={{ width: '24px' }} src={CASH} alt="" />{' '}
                        <span>
                          {item.host.cashEarned ? item.host.cashEarned : 0}{' '}
                          Earned
                        </span>{' '}
                      </span>
                    }
                  />
                </Card>
              </Col>
            ))}
            <Col style={{ margin: '16px' }} span={24}>
              {this.state.pageNum > 1 && (
                <Button
                  style={{ backgroundColor: '#323334', color: 'white' }}
                  onClick={() => this.goBack()}
                >
                  Last
                </Button>
              )}
              {this.state.fetchMoreFlag && (
                <Button onClick={() => this.fetchMore()}>Next</Button>
              )}
            </Col>
          </Row>
        ) : (
          ''
        )}
        <Modal
          title={'Room Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal}
          onOk={hideModal}
          visible={this.state.showModal}
        >
          <Card bordered={false}>
            {JSON.stringify(this.state.selectedRoom, null, 4)}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAudioRoomListResponse: state.audioRoom.getAudioRoomListResponse,
    closeAudioRoomResponse: state.audioRoom.closeAudioRoomResponse,
    getAudioRoomTopicsResponse: state.audioRoom.getAudioRoomTopicsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...audioActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioRoomList);
