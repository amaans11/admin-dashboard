import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../../styles/components/stories.css';
import * as storyActions from '../../actions/storyActions';
import {
  Card,
  Form,
  Icon,
  Select,
  Button,
  Tooltip,
  message,
  Upload
} from 'antd';
import Axios from 'axios';
import { INT_API_URL } from '../../shared/actionTypes';

const { Option } = Select;
const { Dragger } = Upload;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 }
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 10,
    offset: 6
  }
};

class MusicUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musicCategoryList: [],
      count: 40,
      offset: 0,
      fileList: [],
      musicFileList: []
    };
  }

  componentDidMount() {
    this.getCdnLink();
    this.getMusicCategories();
    this.props.form.validateFields();
  }

  getCdnLink = () => {
    this.props.actions.getCdnPathForStoryUpload().then(() => {
      if (this.props.getCdnPathResponse) {
        const cdnPath = JSON.parse(this.props.getCdnPathResponse).CDN_PATH;
        this.setState({ cdnPath });
      }
    });
  };

  getMusicCategories = () => {
    const params = {
      offset: this.state.start,
      count: this.state.count,
      includeDisabled: true
    };

    this.props.actions.getMusicCategories(params).then(() => {
      if (
        this.props.getMusicCategoriesResponse &&
        this.props.getMusicCategoriesResponse.musicCategory
      ) {
        this.setState({
          musicCategoryList: this.props.getMusicCategoriesResponse.musicCategory
        });
      }
    });
  };

  createMusicData = (musics, categoryId) => {
    const data = { musics, categoryId };
    this.props.actions.bulkMusicUpload(data).then(() => {
      if (
        this.props.bulkMusicUploadResponse &&
        this.props.bulkMusicUploadResponse.status.code === 200
      ) {
        message.success('Music data created!');
        this.props.form.resetFields();
        this.setState({ fileList: [], musicFileList: [] });
      } else {
        message.error('Unable to create music data!');
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { fileList } = this.state;
        if (values.categoryId && fileList.length) {
          // Attach music category in musicData files
          const musicFileList = fileList.map(fl => {
            const musicData = {};
            let nameArr = fl.name.split('.');
            nameArr.splice(nameArr.length - 1, 1);
            musicData.title = nameArr.join('.');
            musicData.fileUrl = fl.url;
            musicData.categoryId = values.categoryId;
            return musicData;
          });

          this.createMusicData(musicFileList, values.categoryId);
        } else if (!values.categoryId) {
          message.warning('Please select a music category!');
        } else {
          message.warning('Please upload some files!');
        }
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  beforeUpload = file => {
    const fileData = {
      contentType: file.type,
      extension:
        '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
    };

    Axios.post(INT_API_URL + `api/asn/stories/story-music-url`, fileData).then(
      res => {
        const { uploadUrl, object } = res.data.payload;
        // Update file status to show loading
        const loadingFileList = this.state.fileList.map(fl => {
          if (fl.uid === file.uid) {
            fl.status = 'uploading';
          }
          return fl;
        });

        // Upload file on upload URL
        this.setState({ fileList: loadingFileList });
        fetch(uploadUrl, {
          body: file,
          method: 'PUT'
        })
          .then(result => {
            if (result.status === 200) {
              const fileUrl = `${this.state.cdnPath}${object.id}`;
              const { fileList, musicFileList } = this.state;

              musicFileList.push({
                title: file.name,
                fileUrl: fileUrl
              });

              const newFileList = fileList.map(fl => {
                if (fl.uid === file.uid) {
                  fl.status = 'done';
                  fl.url = fileUrl;
                  fl.name = file.name;
                }
                return fl;
              });

              this.setState({
                fileList: newFileList,
                musicFileList
              });
            }
          })
          .catch(() => {
            const failedFileList = this.state.fileList.map(fl => {
              if (fl.uid === file.uid) {
                fl.status = 'error';
              }
              return fl;
            });

            this.setState({ fileList: failedFileList });
          });
      }
    );

    return false;
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const categoryIdError =
      isFieldTouched('categoryId') && getFieldError('categoryId');

    return (
      <div className="page-container">
        <Card title="Music Upload">
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item
              validateStatus={categoryIdError ? 'error' : ''}
              help={categoryIdError || ''}
              label={
                <span>
                  Music Category
                  <Tooltip title="Music Category">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('categoryId', {
                rules: [
                  {
                    required: true,
                    message: 'Please select a music category!'
                  }
                ]
              })(
                <Select
                  showSearch
                  placeholder="Select a music category"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.musicCategoryList.map((cat, idx) => (
                    <Option key={idx} value={cat.musicCategoryId}>
                      {cat.displayName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Music File
                  <Tooltip title="Browse and upload multiple files at a time (.mp3)">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              <Dragger
                multiple={true}
                beforeUpload={this.beforeUpload}
                fileList={this.state.fileList}
                onChange={this.handleChange}
                accept=".mp3"
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="upload" />
                </p>
                <p className="ant-upload-text">
                  Click or drag file (.mp3) to this area to upload
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.hasErrors(getFieldsError())}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getCdnPathResponse: state.story.getCdnPathForStoryUploadResponse,
    getMusicCategoriesResponse: state.story.getMusicCategoriesResponse,
    bulkMusicUploadResponse: state.story.bulkMusicUploadResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(storyActions, dispatch)
  };
};

const MusicSetupForm = Form.create({
  name: 'music-upload-form'
})(MusicUpload);

export default connect(mapStateToProps, mapDispatchToProps)(MusicSetupForm);
