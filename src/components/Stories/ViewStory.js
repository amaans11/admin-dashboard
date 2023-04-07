import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';
import {
  Card,
  Input,
  message,
  Button,
  Popconfirm,
  Radio,
  Col,
  Row,
  InputNumber,
  Divider,
  Select
} from 'antd';
import StoryDetails from './StoryDetails';

const { Option } = Select;
class ViewStory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storyId: '',
      userId: '',
      mobileNumber: '',
      storyList: [],
      visible: false,
      isLoading: false,
      count: 20,
      searchBy: 'STORY',
      countryCode: '+91'
    };
  }

  componentDidMount() {}

  handleSearchByChange = val => {
    this.setState({ searchBy: val });
  };

  refreshData = () => {
    const { searchBy } = this.state;
    if (searchBy === 'STORY') {
      this.setState({ storyList: [], storyId: '' });
    } else if (searchBy === 'USER') {
      this.handleUserIdSearch();
    } else if (searchBy === 'MOBILE') {
      this.handleMobileSearch();
    } else {
      message.warning('Please refresh page!');
    }
  };

  handleStoryIdChange = e => {
    this.setState({ storyId: e.target.value });
  };

  handleUserIDChange = e => {
    this.setState({ userId: e.target.value });
  };

  handleMobileChange = e => {
    this.setState({ mobileNumber: e.target.value });
  };

  handleStoryIdSearch = () => {
    const { storyId } = this.state;
    const searchQur = storyId.trim();
    if (searchQur) {
      this.getStory(searchQur);
    } else {
      message.warning('Please provide story ID!');
    }
  };

  handleUserIdSearch = () => {
    const { userId } = this.state;
    const searchQur = userId.trim();
    if (searchQur) {
      const params = { userId: searchQur, count: this.state.count };
      this.getUserStory(params);
    } else {
      message.warning('Please provide User ID!');
    }
  };

  handleMobileSearch = () => {
    const { mobileNumber, countryCode } = this.state;
    const searchQur = countryCode + mobileNumber.trim();
    if (searchQur) {
      const params = { mobileNumber: searchQur, count: this.state.count };
      this.getUserStory(params);
    } else {
      message.warning('Please provide Mobile No!');
    }
  };

  confirmDelete = storyId => {
    this.deleteStory(storyId);
  };

  cancelDelete = () => {
    message.error('Click on No');
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onCountValueChange = value => {
    this.setState({ count: value });
  };

  onCountryCodeChange = value => {
    this.setState({ countryCode: value });
  };

  getStory = storyId => {
    const params = { storyId };
    this.setState({ isLoading: true, storyList: [] });
    this.props.actions.getStoryById(params).then(() => {
      if (
        this.props.getStoryByIdResponse &&
        this.props.getStoryByIdResponse.story
      ) {
        this.setState({ storyList: [this.props.getStoryByIdResponse.story] });
      } else {
        let errMsg = '';
        try {
          errMsg = JSON.parse(this.props.getStoryByIdResponse.details).message;
        } catch (e) {
          errMsg = this.props.getStoryByIdResponse.details;
        }
        errMsg = 'Unable to load story: ' + errMsg + '!';
        message.error(errMsg);
      }
      this.setState({ isLoading: false });
    });
  };

  getUserStory = params => {
    this.setState({ isLoading: true, storyList: [] });
    this.props.actions.getStoriesByUserId(params).then(() => {
      if (
        this.props.getStoriesByUserIdResponse &&
        this.props.getStoriesByUserIdResponse.stories
      ) {
        this.setState({
          storyList: this.props.getStoriesByUserIdResponse.stories
        });
      } else {
        let errMsg = '';
        const { details } = this.props.getStoriesByUserIdResponse;
        try {
          errMsg = JSON.parse(details).message;
        } catch (e) {
          errMsg = details;
        }
        errMsg = 'Unable to load story: ' + (errMsg || '') + '!';
        message.error(errMsg);
      }
      this.setState({ isLoading: false });
    });
  };

  deleteStory = storyId => {
    const params = { storyId };
    this.props.actions.deleteStoryById(params).then(() => {
      if (this.props.deleteStoryByIdResponse.status.code === 200) {
        message.success('Story deleted!');
        this.refreshData();
      } else {
        message.error('Unable to delete story!');
      }
    });
  };

  render() {
    const { storyList, searchBy } = this.state;

    // Country code options
    const prefixSelector = (
      <Select
        style={{ width: 85 }}
        defaultValue={this.state.countryCode}
        onChange={this.onCountryCodeChange}
      >
        <Option value="+91">+91 🇮🇳 </Option>
        <Option value="+62">+62 🇮🇩 </Option>
        <Option value="+1">+1 🇺🇸 </Option>
      </Select>
    );
    return (
      <Card className="page-container" title="View Story">
        <div style={{ marginBottom: '1rem' }}>
          Search By:{' '}
          <Radio.Group
            defaultValue={searchBy}
            buttonStyle="solid"
            onChange={e => this.handleSearchByChange(e.target.value)}
          >
            <Radio.Button value="STORY">Story ID</Radio.Button>
            <Radio.Button value="USER">User ID</Radio.Button>
            <Radio.Button value="MOBILE">Mobile No</Radio.Button>
          </Radio.Group>
        </div>

        {searchBy === 'STORY' ? (
          <Row style={{ marginBottom: '1rem' }}>
            <Col span={10}>
              <Input
                defaultValue={this.state.storyId}
                placeholder="Enter Story ID"
                onChange={this.handleStoryIdChange}
              />
            </Col>
            <Col span={4} offset={1}>
              <Button type="primary" onClick={this.handleStoryIdSearch}>
                Search
              </Button>
            </Col>
          </Row>
        ) : null}

        {searchBy === 'USER' ? (
          <Row style={{ marginBottom: '1rem' }}>
            <Col span={10}>
              <Input
                defaultValue={this.state.userId}
                onChange={this.handleUserIDChange}
                placeholder="Enter User ID"
              />
            </Col>
            <Col span={4} offset={1}>
              Count:{' '}
              <InputNumber
                min={1}
                defaultValue={this.state.count}
                onChange={this.onCountValueChange}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.handleUserIdSearch}>
                Search
              </Button>
            </Col>
          </Row>
        ) : null}

        {searchBy === 'MOBILE' ? (
          <Row style={{ marginBottom: '1rem' }}>
            <Col span={10}>
              <Input
                addonBefore={prefixSelector}
                defaultValue={this.state.mobileNumber}
                onChange={this.handleMobileChange}
                placeholder="Enter Mobile no, e.g 99XXXXXXXX without country code"
              />
            </Col>
            <Col span={4} offset={1}>
              Count:{' '}
              <InputNumber
                min={1}
                defaultValue={this.state.count}
                onChange={this.onCountValueChange}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.handleMobileSearch}>
                Search
              </Button>
            </Col>
          </Row>
        ) : null}

        <Divider dashed />

        {storyList.map((story, idx) => (
          <Card key={idx} size="small" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex' }}>
              <StoryDetails storyDetails={story} />

              <div>
                <div style={{ marginBottom: '.5rem' }}>
                  <a
                    href={story.video.fileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    download
                  >
                    <Button type="primary" icon="download">
                      Download Story
                    </Button>
                  </a>
                </div>
                <Popconfirm
                  title="Are you sure delete this story?"
                  onConfirm={() => this.confirmDelete(story.storyId)}
                  onCancel={this.cancelDelete}
                  okText="Confirm"
                  okType="danger"
                  cancelText="Cancel"
                >
                  <Button type="danger" icon="delete">
                    Delete Story
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </Card>
        ))}
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getStoryByIdResponse: state.story.getStoryByIdResponse,
    getStoriesByUserIdResponse: state.story.getStoriesByUserIdResponse,
    deleteStoryByIdResponse: state.story.deleteStoryByIdResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewStory);
