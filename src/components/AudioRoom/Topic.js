import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as audioRoomActions from '../../actions/AudioRoomActions';
import { Card, Form, Button, Tag, Input, Icon, Row, Col, message } from 'antd';

class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      inputVisible: false,
      inputTopic: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.showInput = this.showInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputConfirm = this.handleInputConfirm.bind(this);
  }

  componentDidMount() {
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
        this.setState({
          existingList: [...existingList],
          filterTags: [...filterTags],
          fetched: true
        });
      }
    });
  }

  removeTag(tag) {
    let existingList = [...this.state.existingList];
    existingList = existingList.filter(function(item) {
      return item !== tag;
    });
    console.log(existingList);
    this.setState({ existingList: [...existingList] });
  }

  showInput() {
    this.setState({ inputVisible: true });
  }

  handleInputChange(e) {
    let inputValue = e.target.value;
    this.setState({ inputTopic: inputValue });
  }

  handleInputConfirm() {
    let existingList = [...this.state.existingList];
    if (existingList.includes(this.state.inputTopic)) {
      message.error('This topic already exists');
    } else {
      existingList.push(this.state.inputTopic);
    }
    this.setState({
      existingList: [...existingList],
      inputVisible: false,
      inputTopic: ''
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let filterTags = [...this.state.filterTags];
        let topicList = [...this.state.existingList];

        topicList.forEach(function(item) {
          let itemIndex = filterTags.findIndex(obj => obj.label === item);
          if (itemIndex === -1) {
            let entryObj = {
              label: item,
              value: item,
              category: 'topics'
            };
            filterTags.push(entryObj);
          }
        });

        filterTags.forEach(function(filter) {
          if (filter.category === 'topics') {
            let filterIndex = topicList.findIndex(
              topic => topic === filter.label
            );
            if (filterIndex === -1) {
              let removeIndex = filterTags.findIndex(
                filterItem => filter.label === filterItem.label
              );
              let removed = filterTags.splice(removeIndex, 1);
            }
          }
        });

        let data = {
          topics: [...topicList],
          filterTags: [...filterTags]
        };

        this.props.actions.setAudioRoomTopics(data).then(() => {
          if (this.props.setAudioRoomTopicsResponse) {
            if (this.props.setAudioRoomTopicsResponse.error) {
              message.error('Could not update');
            } else {
              this.props.actions.setAudioRoomTopicsPs(data).then(() => {
                if (this.props.setAudioRoomTopicsPsResponse) {
                  if (this.props.setAudioRoomTopicsPsResponse.error) {
                    message.error('Could not update');
                  } else {
                    message
                      .success('Updated Successfully', 1.5)
                      .then(() => window.location.reload());
                  }
                }
              });
            }
          }
        });
      }
    });
  }

  render() {
    const fixedFeildLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const fixedFeildLayoutHalf = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <React.Fragment>
        <Card title="Topics">
          <Form onSubmit={this.handleSubmit}>
            {this.state.fetched &&
              this.state.existingList.map(item => (
                <Tag
                  key={item}
                  closable={true}
                  onClose={() => this.removeTag(item)}
                >
                  {item}
                </Tag>
              ))}
            {!this.state.inputVisible && (
              <Tag
                onClick={() => this.showInput()}
                style={{ background: '#fff', borderStyle: 'dashed' }}
              >
                <Icon type="plus" /> New Topic
              </Tag>
            )}
            {this.state.inputVisible && (
              <Input
                type="text"
                size="small"
                style={{ width: 100 }}
                value={this.state.inputTopic}
                onChange={e => this.handleInputChange(e)}
                onBlur={() => this.handleInputConfirm()}
                onPressEnter={() => this.handleInputConfirm()}
              />
            )}

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAudioRoomTopicsResponse: state.audioRoom.getAudioRoomTopicsResponse,
    setAudioRoomTopicsResponse: state.audioRoom.setAudioRoomTopicsResponse,
    setAudioRoomTopicsPsResponse: state.audioRoom.setAudioRoomTopicsPsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...audioRoomActions }, dispatch)
  };
}
const TopicForm = Form.create()(Topic);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicForm);
