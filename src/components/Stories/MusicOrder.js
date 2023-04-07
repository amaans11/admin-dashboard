import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  message,
  Select,
  Divider,
  Row,
  Col,
  InputNumber,
  Button,
  Empty,
  Popconfirm
} from 'antd';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';

const { Option } = Select;

class MusicOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 20,
      musicCategoryList: [],
      musicsList: [],
      categoryId: undefined
    };
  }

  componentDidMount() {
    this.getMusicCategories();
  }

  getMusicCategories = () => {
    const params = {
      count: 100,
      offset: 0,
      includeDisableCategories: true
    };

    this.props.actions.getMusicCategories(params).then(() => {
      if (this.props.getMusicCategoriesResponse) {
        const musicCategoryList = this.props.getMusicCategoriesResponse
          .musicCategory
          ? this.props.getMusicCategoriesResponse.musicCategory
          : [];
        this.setState({ musicCategoryList });
      }
    });
  };

  getMusics = () => {
    const { categoryId, count, offset } = this.state;
    const params = { categoryId, count, offset };

    if (categoryId) {
      this.props.actions.getMusics(params).then(() => {
        if (
          this.props.getMusicsResponse &&
          this.props.getMusicsResponse.musics
        ) {
          this.setState({
            musicsList: this.props.getMusicsResponse.musics
          });
        }
      });
    } else {
      message.warning('Please select a music category!');
    }
  };

  deleteMusic = musicId => {
    const params = { musicId };
    this.props.actions.deleteMusic(params).then(() => {
      if (
        this.props.deleteMusicResponse &&
        this.props.deleteMusicResponse.status.code === 200
      ) {
        message.success('Music Deleted!');
        this.getMusics();
      } else {
        message.error('Unable to delete music!');
      }
    });
  };

  onStartValueChange = value => {
    this.setState({ start: value });
  };

  onCountValueChange = value => {
    this.setState({ count: value });
  };

  onMusicCategoryChange = value => {
    this.setState({ categoryId: value, musicsList: [] }, () => {
      this.getMusics();
    });
  };

  render() {
    const { musicCategoryList, categoryId, musicsList } = this.state;

    return (
      <Card className="page-container" title="Manage Musics">
        <Row>
          <Col span={10}>
            Music Category:{' '}
            <Select
              value={categoryId}
              onChange={e => this.onMusicCategoryChange(e)}
              style={{ width: '300px' }}
              placeholder="Select music category"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {musicCategoryList.map(cat => (
                <Option key={cat.musicCategoryId} value={cat.musicCategoryId}>
                  {cat.displayName}
                </Option>
              ))}
            </Select>
          </Col>
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
            <Button type="primary" onClick={this.getMusics}>
              Refresh
            </Button>
          </Col>
        </Row>

        <Divider dashed />

        {musicsList.length ? (
          musicsList.map((music, idx) => (
            <div key={idx} className="music-card">
              <div className="music-details">
                <div className="music-title">{music.title}</div>

                <div>
                  <audio controls src={music.fileUrl}>
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                </div>
              </div>

              <div>
                <Popconfirm
                  title="Are you sure to delete this music?"
                  onConfirm={() => this.deleteMusic(music.musicId)}
                  okText="Confirm"
                  okType="danger"
                  cancelText="Cancel"
                >
                  <Button type="danger" icon="delete" ghost>
                    {music.delete ? 'Deleting...' : 'Delete'}
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getMusicCategoriesResponse: state.story.getMusicCategoriesResponse,
    getMusicsResponse: state.story.getMusicsResponse,
    deleteMusicResponse: state.story.deleteMusicResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicOrder);
