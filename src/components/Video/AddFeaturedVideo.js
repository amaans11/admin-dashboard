// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Row,
  Input,
  InputNumber,
  Tooltip,
  message,
  Select,
  DatePicker,
  Col,
  Icon,
  Modal,
  Upload,
  Spin,
  Button
} from 'antd';
import moment from 'moment';
import * as videoActions from '../../actions/videoActions';
import * as storageActions from '../../actions/storageActions';

// type AddFeaturedVideo ={}
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const videoType = ['YOUTUBE', 'CDN', 'FACEBOOK'].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AddFeaturedVideo extends React.Component {
  state = {
    videoType: '',
    thumbnailPreviewVisible: false,
    profilePicPreviewVisible: false,
    thumbnailPreviewImage: '',
    profilePicPreviewImage: '',
    previewVisible: false,
    previewImage: '',
    loading: false,
    thumbnailFileList: [],
    profilePicFileList: []
  };
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    if (this.props.video.actionType) {
      if (this.props.video.actionType === 'EDIT') {
        this.setState({
          // videoType: this.props.video.video.videoType,
          disableField: true
        });
        this.props.form.setFieldsValue({
          title: this.props.video.video.title,
          index: this.props.video.video.index,
          profileName: this.props.video.video.profileName,
          views: this.props.video.video.views,
          likes: this.props.video.video.likes,
          whatsAppShare: this.props.video.video.whatsAppShare,
          description: this.props.video.video.description,
          videoType: this.props.video.video.videoType,
          videoId: this.props.video.video.videoId,
          sourceUrl: this.props.video.video.sourceUrl,
          iframeSource: this.props.video.video.iframeSource,
          timeArray: [
            moment(this.props.video.video.startTime),
            moment(this.props.video.video.endTime)
          ]
        });
      }
      if (this.props.video.actionType === 'GAMEPLAY') {
        this.setState({
          disableField: true
        });
      }
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.timeArray) {
          values.startTime = moment(values.timeArray[0]).toISOString(true);
          values.endTime = moment(values.timeArray[1]).toISOString(true);
          delete values.timeArray;
        } else {
          values.startTime = moment().toISOString(true);
          values.endTime = moment()
            .add(4, 'years')
            .toISOString(true);
        }
        console.log('Received values of form: ', values);
        if (this.state.thumbnailObj === undefined) {
          message.error('Upload thumbnail first!!', 3);
        } else if (this.state.profilePicObj === undefined) {
          message.error('Upload Profile Pic of user first!!', 3);
        } else {
          values.thumbnailUrl = this.state.thumbnailObj.id;
          values.profilePicUrl = this.state.profilePicObj.id;
          this.props.actions.addFeaturedVideo(values).then(() => {
            this.props.history.push('/video/featured/board');
          });
        }
      }
    });
  };
  handleThumbnailPreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleProfilePicPreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });
  handleThumbnailChange = ({ fileList }) => {
    this.setState({ thumbnailFileList: fileList });
  };

  handleProfilePicChange = ({ fileList }) => {
    this.setState({ profilePicFileList: fileList });
  };
  render() {
    function range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }

      return result;
    }

    function disabledRangeTime(dates, type) {
      if (type === 'start') {
        if (dates !== undefined && dates.length) {
          return {
            disabledHours:
              dates[0].format('DDMMYY') === moment().format('DDMMYY')
                ? disabledHours
                : () => [],
            disabledMinutes:
              dates[0].format('DDMMYY') === moment().format('DDMMYY')
                ? disabledMinutes
                : () => []
          };
        }
      }
    }
    function disabledHours() {
      return range(0, 24).splice(0, moment().hour());
    }
    function disabledMinutes(h) {
      if (h === moment().hour()) {
        return range(0, moment().minute());
      } else {
        return [];
      }
    }
    const beforeThumbnailUpload = file => {
      console.log(file);
      message.loading('Please wait while files get uploaded ', 0);
      this.setState({
        loading: true
      });

      let imageData = {
        contentType: file.type,
        extension:
          '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      this.props.actions
        .getVideoThumbnailUploadAssetsUrl(imageData)
        .then(() => {
          fetch(this.props.video.thumbnailUrl.uploadUrl, {
            body: file,
            method: 'PUT'
          }).then(result => {
            if (result.status === 200) {
              message.destroy();

              this.setState({
                thumbnailObj: this.props.video.thumbnailUrl.object,
                loading: false,
                file
              });
            }
          });
        });

      return false;
    };
    const beforeProfilePicUpload = file => {
      message.loading('Please wait while files get uploaded ', 0);
      this.setState({
        loading: true
      });

      let imageData = {
        contentType: file.type,
        extension:
          '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      this.props.actions
        .getVideoProfilePicUploadAssetsUrl(imageData)
        .then(() => {
          fetch(this.props.video.profilePicUrl.uploadUrl, {
            body: file,
            method: 'PUT'
          }).then(result => {
            if (result.status === 200) {
              message.destroy();

              this.setState({
                profilePicObj: this.props.video.profilePicUrl.object,
                loading: false,
                file
              });
            }
          });
        });

      return false;
    };
    const onVideoTypeChange = e => {
      this.setState({
        videoType: e
      });
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const {
      thumbnailFileList,
      profilePicFileList,
      previewVisible,
      previewImage
    } = this.state;
    // Only show error after a field is touched.
    const titleError = isFieldTouched('title') && getFieldError('title');
    const indexError = isFieldTouched('index') && getFieldError('index');
    const profileNameError =
      isFieldTouched('profileName') && getFieldError('profileName');
    const videoIdError = isFieldTouched('videoId') && getFieldError('videoId');
    const sourceUrlError =
      isFieldTouched('sourceUrl') && getFieldError('sourceUrl');
    const iframeSourceError =
      isFieldTouched('iframeSource') && getFieldError('iframeSource');

    // const viewsError = isFieldTouched('views') && getFieldError('views');
    const whatsAppShareError =
      isFieldTouched('whatsAppShare') && getFieldError('whatsAppShare');
    const likesError = isFieldTouched('likes') && getFieldError('likes');
    const videoTypeError =
      isFieldTouched('videoType') && getFieldError('videoType');
    const descriptionError =
      isFieldTouched('description') && getFieldError('description');
    const timeArrayError =
      isFieldTouched('timeArray') && getFieldError('timeArray');
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Form onSubmit={this.handleSubmit}>
            <Card bordered={false} title="Video Details">
              <FormItem
                validateStatus={titleError ? 'error' : ''}
                {...formItemLayout}
                label={
                  <span>
                    Title
                    <Tooltip title="Video Tilte">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input name!',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={descriptionError ? 'error' : ''}
                help={descriptionError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Video Description
                    <Tooltip title="Description for Video, internal purposes only">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: false,
                      message: 'Please input video description!',
                      whitespace: true
                    }
                  ],
                  initialValue: ''
                })(<TextArea rows={3} />)}
              </FormItem>
              <FormItem
                validateStatus={profileNameError ? 'error' : ''}
                {...formItemLayout}
                label={
                  <span>
                    Profile Name
                    <Tooltip title="Profile Name for Video">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('profileName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input name!',
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem
                validateStatus={videoTypeError ? 'error' : ''}
                help={videoTypeError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Select type for Video
                    <Tooltip title="Select type for App">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('videoType', {
                  rules: [
                    {
                      type: 'string',
                      required: true,
                      message: 'Please select app type!'
                    }
                  ]
                })(
                  <Select
                    disabled={this.state.disableField}
                    onChange={onVideoTypeChange}
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select type of app"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {videoType}
                  </Select>
                )}
              </FormItem>

              {this.state.videoType === 'YOUTUBE' ? (
                <FormItem
                  validateStatus={videoIdError ? 'error' : ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Video Id
                      <Tooltip title="Video Id for Video">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('videoId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input name!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              ) : (
                ''
              )}
              {this.state.videoType === 'CDN' ? (
                <FormItem
                  validateStatus={sourceUrlError ? 'error' : ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Video Url
                      <Tooltip title="Cdn Url">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('sourceUrl', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input name!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              ) : (
                ''
              )}
              {this.state.videoType === 'FACEBOOK' ? (
                <FormItem
                  validateStatus={iframeSourceError ? 'error' : ''}
                  {...formItemLayout}
                  label={
                    <span>
                      Iframe Url
                      <Tooltip title="Iframe Url">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('iframeSource', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input Url!',
                        whitespace: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
              ) : (
                ''
              )}
              <FormItem
                validateStatus={timeArrayError ? 'error' : ''}
                help={timeArrayError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Duration For Video
                    <Tooltip title="Date and time for video to be shown on feature section">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('timeArray', {
                  rules: [
                    {
                      required: false,
                      type: 'array',
                      message: 'Please input time duration!',
                      whitespace: false
                    }
                  ]
                })(
                  <RangePicker
                    disabledTime={disabledRangeTime}
                    allowClear="true"
                    showTime={{ format: 'hh:mm A', use12Hours: true }}
                    format="YYYY-MM-DD hh:mm A"
                    placeholder={['Start Time', 'End Time']}
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={indexError ? 'error' : ''}
                help={indexError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Index for Video
                    <Tooltip title="Reward amountv to be redeemable">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('index', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input Reward Amountn!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              {/* <FormItem
                validateStatus={viewsError ? 'error' : ''}
                help={viewsError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Views
                    <Tooltip title="Reward amountv to be redeemable">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('views', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input Reward Amountn!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>*/}
              <FormItem
                validateStatus={likesError ? 'error' : ''}
                help={likesError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Likes
                    <Tooltip title="Reward amountv to be redeemable">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('likes', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input Reward Amountn!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem
                validateStatus={whatsAppShareError ? 'error' : ''}
                help={whatsAppShareError || ''}
                {...formItemLayout}
                label={
                  <span>
                    Whats App Share
                    <Tooltip title="Reward amountv to be redeemable">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('whatsAppShare', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input Reward Amountn!',
                      whitespace: false
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
              <Row>
                <Col span={12}>
                  <label>Upload Thumbnail</label>
                  <Upload
                    multiple={false}
                    beforeUpload={beforeThumbnailUpload}
                    listType="picture-card"
                    fileList={thumbnailFileList}
                    onPreview={this.handleThumbnailPreview}
                    onChange={this.handleThumbnailChange}
                  >
                    {this.state.thumbnailFileList.length >= 1 ? null : (
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                      </div>
                    )}
                  </Upload>
                </Col>
                <Col span={12}>
                  <label>Upload Profile Pic</label>
                  <Upload
                    multiple={false}
                    beforeUpload={beforeProfilePicUpload}
                    listType="picture-card"
                    fileList={profilePicFileList}
                    onPreview={this.handleProfilePicPreview}
                    onChange={this.handleProfilePicChange}
                  >
                    {this.state.profilePicFileList.length >= 1 ? null : (
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                      </div>
                    )}
                  </Upload>
                </Col>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                </Modal>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Add
              </Button>
            </Card>
          </Form>
        </Spin>
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
    actions: bindActionCreators(
      { ...videoActions, ...storageActions },
      dispatch
    )
  };
}

const AddFeaturedVideoForm = Form.create()(AddFeaturedVideo);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFeaturedVideoForm);
