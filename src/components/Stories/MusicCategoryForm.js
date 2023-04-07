import React from 'react';
import '../../styles/components/stories.css';
import { Form, Input, Icon, Button, Tooltip, InputNumber, Radio } from 'antd';

import { INT_API_URL } from '../../shared/actionTypes';
import FileUploader from './FileUploader';

const { TextArea } = Input;
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

const ICON_UPLOAD_REQ_URL =
  INT_API_URL + 'api/asn/stories/music-category-icon-url';
class MusicCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // Refs for FileUploader
    this.iconUploaderRef = React.createRef();
  }

  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  updateFormField = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value });
  };

  // Will be calling from parent using ref
  resetForm = () => {
    this.props.form.resetFields();

    // Clear files in FileUploader using ref
    this.iconUploaderRef.current.resetFileList();
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const formData = this.props.categoryDetails
      ? this.props.categoryDetails
      : {};

    const displayNameError =
      isFieldTouched('displayName') && getFieldError('displayName');
    const descriptionError =
      isFieldTouched('description') && getFieldError('description');
    const iconUrlError = isFieldTouched('iconUrl') && getFieldError('iconUrl');
    const priorityError =
      isFieldTouched('priority') && getFieldError('priority');

    return (
      <div className="page-container">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {formData.musicCategoryId ? (
            <Form.Item label="Category ID">
              {getFieldDecorator('musicCategoryId', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter category ID!'
                  }
                ],
                initialValue: formData.musicCategoryId
              })(<Input placeholder="Enter new music category ID" disabled />)}
            </Form.Item>
          ) : null}

          <Form.Item
            validateStatus={displayNameError ? 'error' : ''}
            help={displayNameError || ''}
            label={
              <span>
                Category Name
                <Tooltip title="Category name to display">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('displayName', {
              rules: [
                {
                  required: true,
                  message: 'Please enter category name!',
                  whitespace: true
                }
              ],
              initialValue: formData.displayName
            })(<Input placeholder="Enter new music category name" />)}
          </Form.Item>

          <Form.Item
            validateStatus={descriptionError ? 'error' : ''}
            help={descriptionError || ''}
            label={
              <span>
                Description
                <Tooltip title="Description of music category">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('description', {
              rules: [
                {
                  required: false,
                  message: 'Please enter  description!',
                  whitespace: true
                }
              ],
              initialValue: formData.description
            })(
              <TextArea
                autoSize={{ minRows: 2, maxRows: 8 }}
                placeholder="Enter description"
              />
            )}
          </Form.Item>

          <Form.Item
            validateStatus={iconUrlError ? 'error' : ''}
            help={iconUrlError || ''}
            label={
              <span>
                Icon
                <Tooltip title="Icon for music category (.jpg, .png, .webp)">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('iconUrl', {
              rules: [
                {
                  required: false,
                  message: 'Please upload icon!'
                }
              ],
              initialValue: formData.iconUrl
            })(<Input placeholder={`Enter icon url value`} disabled />)}
            <FileUploader
              ref={this.iconUploaderRef}
              callbackFromParent={fileUrl => {
                this.updateFormField('iconUrl', fileUrl);
              }}
              cdnPath={this.props.cdnPath}
              uploadReqUrl={ICON_UPLOAD_REQ_URL}
              fileType="image"
              accept=".jpg,.png,.webp"
              fileUrl={formData.iconUrl}
            />
          </Form.Item>

          <Form.Item
            validateStatus={priorityError ? 'error' : ''}
            help={priorityError || ''}
            label={
              <span>
                Priority
                <Tooltip title="Priority/OrderIndex of music category">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('priority', {
              rules: [
                {
                  required: false,
                  type: 'number',
                  message: 'Please enter  priority!',
                  whitespace: false
                }
              ],
              initialValue: formData.priority || 1
            })(<InputNumber min={1} placeholder="Enter priority" />)}
          </Form.Item>

          <Form.Item
            label={
              <span>
                Status
                <Tooltip title="Status of music category">
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

const MusicCategoryForm = Form.create({})(MusicCategory);
export default MusicCategoryForm;
