import React from 'react';
import '../../styles/components/stories.css';
import {
  Form,
  Input,
  Icon,
  Button,
  Tooltip,
  InputNumber,
  Radio,
  Select,
  Divider
} from 'antd';
import { INT_API_URL } from '../../shared/actionTypes';
import FileUploader from './FileUploader';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const tailFormItemLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};

const STICKER_TYPE = ['FACE_STICKER', 'EDITING_STICKER', 'CAPTIONS_STICKER'];

const ICON_UPLOAD_REQ_URL = INT_API_URL + 'api/asn/stories/sticker-icon-url';
const MAT_UPLOAD_REQ_URL = INT_API_URL + 'api/asn/stories/sticker-mat-url';
const PREVIEW_UPLOAD_REQ_URL =
  INT_API_URL + 'api/asn/stories/sticker-preview-url';

class Sticker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickerTypeList: STICKER_TYPE,
      previewVisible: false,
      previewImage: '',
      catType: 0
    };

    // Refs for FileUploader
    this.iconUploaderRef = React.createRef();
    this.matUploaderRef = React.createRef();
    this.previewUploaderRef = React.createRef();
  }

  componentDidMount() {}

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  updateFormField = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  // Will be calling from parent using ref
  resetForm = () => {
    this.props.form.resetFields();

    // Clear files in FileUploader using ref
    this.iconUploaderRef.current.resetFileList();
    this.matUploaderRef.current.resetFileList();
    this.previewUploaderRef.current.resetFileList();
  };

  onCategoryTypeChange = catType => {
    this.setState({ catType });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { fontsList } = this.props;
    const formData = this.props.stickerDetails ? this.props.stickerDetails : {};
    const catType = formData.type ? formData.type : this.state.catType;
    const isEditing = this.props.isEditing || false;

    return (
      <div className="page-container">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {isEditing && (
            <Form.Item>
              <em>* Some fields are not editable</em>
            </Form.Item>
          )}

          {isEditing && formData.id ? (
            <Form.Item label="ID">
              {getFieldDecorator('id', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter ID!'
                  }
                ],
                initialValue: formData.id
              })(<Input placeholder="Enter ID" disabled />)}
            </Form.Item>
          ) : null}

          <Form.Item
            label={
              <span>
                Sticker Type
                <Tooltip title="Type of sticker category">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: 'Please select type!'
                }
              ],
              initialValue: formData.type || 0
            })(
              <Radio.Group
                buttonStyle="solid"
                onChange={e => this.onCategoryTypeChange(e.target.value)}
              >
                {this.state.stickerTypeList.map((tp, idx) => (
                  <Radio.Button key={idx} value={idx}>
                    {tp}
                  </Radio.Button>
                ))}
              </Radio.Group>
            )}
          </Form.Item>

          {catType ===
          this.state.stickerTypeList.indexOf('CAPTIONS_STICKER') ? (
            <Form.Item
              label={
                <span>
                  Caption Font
                  <Tooltip title="Font for Caption sticker">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('fontId', {
                rules: [
                  {
                    required: true,
                    message: 'Please select a font!'
                  }
                ],
                initialValue: formData.fontId
              })(
                <Select
                  placeholder="Select font"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {fontsList.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name + ' (ID: ' + item.id + ')'}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : null}

          <Form.Item
            label={
              <span>
                Name
                <Tooltip title="Name to display">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please enter sticker name!',
                  whitespace: true
                }
              ],
              initialValue: formData.name
            })(<Input placeholder="Enter sticker name" />)}
          </Form.Item>

          <Form.Item
            label={
              <span>
                Icon
                <Tooltip title="Icon image for sticker (.jpg, .png, .webp)">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('icon', {
              rules: [
                {
                  required: true,
                  message: 'Please upload icon image!'
                }
              ],
              initialValue: formData.icon
            })(
              <Input
                placeholder="Enter icon url value"
                disabled
                className="hide"
              />
            )}
            <FileUploader
              ref={this.iconUploaderRef}
              callbackFromParent={fileUrl => {
                this.updateFormField('icon', fileUrl);
              }}
              cdnPath={this.props.cdnPath}
              fileType="image"
              uploadReqUrl={ICON_UPLOAD_REQ_URL}
              accept=".jpg,.png,.webp"
              fileUrl={formData.icon}
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Mat File
                <Tooltip title="Mat file upload (.mat)">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('url', {
              rules: [
                {
                  required: false,
                  message: 'Please enter url!'
                }
              ],
              initialValue: formData.url
            })(
              <Input placeholder="Enter url value" disabled className="hide" />
            )}
            <FileUploader
              ref={this.matUploaderRef}
              callbackFromParent={fileUrl => {
                this.updateFormField('url', fileUrl);
              }}
              cdnPath={this.props.cdnPath}
              uploadReqUrl={MAT_UPLOAD_REQ_URL}
              accept=".mat"
              fileUrl={formData.url}
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Preview
                <Tooltip title="Preview sticker (.gif)">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('preview', {
              rules: [
                {
                  required: false,
                  message: 'Please upload Preview file!'
                }
              ],
              initialValue: formData.preview
            })(
              <Input
                placeholder="Enter preview url"
                disabled
                className="hide"
              />
            )}
            <FileUploader
              ref={this.previewUploaderRef}
              callbackFromParent={fileUrl => {
                this.updateFormField('preview', fileUrl);
              }}
              cdnPath={this.props.cdnPath}
              fileType="image"
              uploadReqUrl={PREVIEW_UPLOAD_REQ_URL}
              accept=".gif"
              fileUrl={formData.preview}
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Priority
                <Tooltip title="Priority/OrderIndex of sticker">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('priority', {
              rules: [
                {
                  required: true,
                  type: 'number',
                  message: 'Please enter  priority!'
                }
              ],
              initialValue: formData.priority || 1
            })(<InputNumber min={1} placeholder="Enter priority" />)}
          </Form.Item>

          <Form.Item
            label={
              <span>
                Status
                <Tooltip title="Status of Sticker">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('status', {
              rules: [
                {
                  required: true,
                  message: 'Please select status!'
                }
              ],
              initialValue: formData.status || false
            })(
              <Radio.Group buttonStyle="solid">
                <Radio.Button value={true}>Enabled</Radio.Button>
                <Radio.Button value={false}>Disabled</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Divider />

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
      </div>
    );
  }
}

const StickerForm = Form.create({})(Sticker);
export default StickerForm;
