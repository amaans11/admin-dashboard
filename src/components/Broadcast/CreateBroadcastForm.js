import React from 'react';
import {
  Form,
  Input,
  Icon,
  Button,
  Tooltip,
  Select,
  DatePicker,
  Checkbox
} from 'antd';
import { INT_API_URL } from '../../shared/actionTypes';
import FileUploader from './FileUploader';
import moment from 'moment';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

const tailFormItemLayout = {
  wrapperCol: {
    offset: 8,
    span: 14
  }
};

const TILE_IMAGE_UPLOAD_REQ_URL =
  INT_API_URL + 'api/game-broadcast/get-tile-image-upload-url';
const THUMB_IMAGE_UPLOAD_REQ_URL =
  INT_API_URL + 'api/game-broadcast/get-thumb-image-upload-url';

class CreateBroadcast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrlId: null,
      tileUrlID: null
    };

    // Refs for FileUploader
    this.tileImageUploaderRef = React.createRef();
    this.thumbnailImageUploaderRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isEditing) {
      // when the broadcast data was updated without changing the images, the thumbnailUrlId and tileUrlId will be null, so splitting the url and getting only the id
      const { thumbnailUrl, tileUrl } = this.props.broadcastDetails;
      let idThumbnail = thumbnailUrl
        .split('/')
        .slice(3, thumbnailUrl.length)
        .join('/');

      let idTile = tileUrl
        .split('/')
        .slice(3, tileUrl.length)
        .join('/');

      this.setState({ thumbnailUrlId: idThumbnail, tileUrlID: idTile });
    }
  }

  hasErrors = fieldsError =>
    Object.keys(fieldsError).some(field => fieldsError[field]);

  updateFormField = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // Change moment date into timestamo (EPOCH)
        values.publishedAt = values.publishedAt.format('x');
        this.props.handleSubmit(values, this.state);
      }
    });
  };

  // Will be calling from parent using ref
  resetForm = () => {
    this.props.form.resetFields();
    this.setState({
      thumbnailUrlId: null,
      tileUrlID: null
    });
    // Clear files in FileUploader using ref
    this.tileImageUploaderRef.current.resetFileList();
    this.thumbnailImageUploaderRef.current.resetFileList();
  };

  disabledDate = current => current && current < moment().startOf('day');

  checkBroadcasterSlot = e => {
    console.log(e);
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const formData = this.props.broadcastDetails
      ? this.props.broadcastDetails
      : {};
    const isEditing = this.props.isEditing || false;
    const { broadcasters, tournaments } = this.props;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        {isEditing && formData.gameBroadcastId ? (
          <Form.Item label="Broadcast Id">
            {getFieldDecorator('gameBroadcastId', {
              rules: [
                {
                  required: true,
                  message: 'Please enter ID!'
                }
              ],
              initialValue: formData.gameBroadcastId
            })(<Input placeholder="Enter ID" disabled />)}
          </Form.Item>
        ) : null}
        <Form.Item
          label={
            <span>
              Broadcast Name
              <Tooltip title="Broadcast Name to display">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please enter broadcast Title!'
              }
            ],
            initialValue: formData.title
          })(<Input placeholder="Enter broadcast Name" />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Round Name
              <Tooltip title="Broadcast Round Name to display">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('displayRoundName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please enter broadcast displayRoundName!'
              }
            ],
            initialValue: formData.displayRoundName
          })(<Input placeholder="Enter broadcast displayRoundName" />)}
        </Form.Item>
        {!isEditing && (
          <Form.Item
            label={
              <span>
                Tournament Name
                <Tooltip title="Broadcast Tournament Name to display">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('tournament', {
              rules: [
                {
                  required: true,
                  message: 'Please select a Tournament!'
                }
              ],
              initialValue: formData.tournament
            })(
              <Select
                showSearch
                placeholder="Select a Tournament"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                disabled={isEditing}
                getPopupContainer={trigger => trigger.parentNode}
              >
                {tournaments.map((type, idx) => (
                  <Option key={'tournamentOpt-' + idx} value={type.id}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )}
        <Form.Item
          label={
            <span>
              Game Name
              <Tooltip title="Broadcast Game Name to display">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('displayGameName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please enter broadcast displayGameName!'
              }
            ],
            initialValue: formData.displayGameName
          })(<Input placeholder="Enter broadcast displayGameName" />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Stage Name
              <Tooltip title="Broadcast Stage Name to display">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('displayStageName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please enter broadcast displayStageName!'
              }
            ],
            initialValue: formData.displayStageName
          })(<Input placeholder="Enter broadcast displayStageName" />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Broadcaster
              <Tooltip title="Broadcaster">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('broadcasterId', {
            rules: [
              {
                required: true,
                message: 'Please select a broadcaster!'
              }
            ],
            initialValue: formData.broadcasterId
          })(
            <Select
              showSearch
              placeholder="Select a broadcaster"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              getPopupContainer={trigger => trigger.parentNode}
              onChange={this.checkBroadcasterSlot}
            >
              {broadcasters.map((type, idx) => (
                <Option key={'broadcasterOpt-' + idx} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Publish At
              <Tooltip title="Publish At">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('publishedAt', {
            rules: [
              {
                required: true,
                message: 'Please select publish at datetime!'
              }
            ],
            initialValue: formData.publishAt
              ? moment(parseInt(formData.publishAt, 10))
              : null
          })(
            <DatePicker
              showTime
              disabledDate={this.disabledDate}
              allowClear="true"
              format="YYYY-MMM-Do hh:mm:ss A"
              placeholder="Publish at"
              disabled={isEditing}
              style={{ width: '100%' }}
              getCalendarContainer={trigger => trigger.parentNode}
            />
          )}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Tile Image
              <Tooltip title="Tile image for broadcast (.jpg, .png, .webp)">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('tileUrl', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please upload tile image!'
              }
            ],
            initialValue: formData.tileUrl
          })(
            <Input
              placeholder="Enter tile image url value"
              disabled
              className="hide"
            />
          )}
          <FileUploader
            ref={this.tileImageUploaderRef}
            callbackFromParent={(fileUrl, objectId) => {
              this.updateFormField('tileUrl', fileUrl);
              this.setState({ tileUrlID: objectId });
            }}
            cdnPath={this.props.cdnPath}
            fileType="image"
            uploadReqUrl={TILE_IMAGE_UPLOAD_REQ_URL}
            accept=".jpg,.png,.webp,.jpeg"
            fileUrl={formData.tileUrl}
          />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Thumbnail Image
              <Tooltip title="Thumbnail Image (.jpg, .png, .webp)">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('thumbnailUrl', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please upload thumbnail Image file!'
              }
            ],
            initialValue: formData.thumbnailUrl
          })(
            <Input
              placeholder="Enter thumbnail Image url"
              disabled
              className="hide"
            />
          )}
          <FileUploader
            ref={this.thumbnailImageUploaderRef}
            callbackFromParent={(fileUrl, objectId) => {
              this.updateFormField('thumbnailUrl', fileUrl);
              this.setState({ thumbnailUrlId: objectId });
            }}
            cdnPath={this.props.cdnPath}
            fileType="image"
            uploadReqUrl={THUMB_IMAGE_UPLOAD_REQ_URL}
            accept=".jpg,.png,.webp,.jpeg"
            fileUrl={formData.thumbnailUrl}
          />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Broadcast Destination
              <Tooltip title="Broadcast Destination">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          <Form.Item>
            {getFieldDecorator('isYoutubeEnable', {
              valuePropName: 'checked',
              rules: [
                {
                  required: false,
                  message: 'Please select youtube!'
                }
              ],
              initialValue: formData.isYoutubeEnable || false
            })(<Checkbox> Youtube </Checkbox>)}
          </Form.Item>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={this.hasErrors(getFieldsError())}
            style={{ float: 'unset' }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const CreateBroadcastForm = Form.create({})(CreateBroadcast);
export default CreateBroadcastForm;
