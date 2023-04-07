import React from 'react';
import '../../styles/components/stories.css';
import { Form, Input, Icon, Button, Tooltip, InputNumber, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { INT_API_URL } from '../../shared/actionTypes';
import FileUploader from './FileUploader';

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

const ICON_UPLOAD_REQ_URL =
  INT_API_URL + 'api/asn/stories/sticker-category-icon-url';

class StickerCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickerTypeList: STICKER_TYPE
    };

    this.iconUploaderRef = React.createRef();
  }

  componentDidMount() {}

  updateFormField = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // TODO: validate fields
        values.previewUrl = values.iconUrl ? values.iconUrl : '';
        // values.status = true;

        this.props.handleSubmit(values);
      }
    });
  };

  resetForm = () => {
    this.props.form.resetFields();
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

    const nameError = isFieldTouched('name') && getFieldError('name');
    const descriptionError =
      isFieldTouched('description') && getFieldError('description');
    const iconUrlError = isFieldTouched('iconUrl') && getFieldError('iconUrl');
    const priorityError =
      isFieldTouched('priority') && getFieldError('priority');
    const statusError = isFieldTouched('status') && getFieldError('status');

    return (
      <div className="page-container">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {formData.id ? (
            <Form.Item label="Category ID">
              {getFieldDecorator('id', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter category ID!'
                  }
                ],
                initialValue: formData.id
              })(<Input placeholder="Enter sticker category ID" disabled />)}
            </Form.Item>
          ) : null}

          <Form.Item
            validateStatus={nameError ? 'error' : ''}
            help={nameError || ''}
            label={
              <span>
                Category Name
                <Tooltip title="Category name to display">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please enter category name!',
                  whitespace: true
                }
              ],
              initialValue: formData.name
            })(<Input placeholder="Enter category name" />)}
          </Form.Item>

          <Form.Item
            validateStatus={descriptionError ? 'error' : ''}
            help={descriptionError || ''}
            label={
              <span>
                Description
                <Tooltip title="Description of category">
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
              <Radio.Group buttonStyle="solid">
                {this.state.stickerTypeList.map((tp, idx) => (
                  <Radio.Button key={idx} value={idx}>
                    {tp}
                  </Radio.Button>
                ))}
              </Radio.Group>
            )}
          </Form.Item>

          {/* <Form.Item
            label={
              <span>
                Preview URL
                <Tooltip title="Preview url sticker category">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('previewUrl', {
              rules: [
                {
                  required: false,
                  message: 'Please enter Preview Url!'
                }
              ],
              initialValue: categoryDetails.previewUrl
            })(<Input placeholder="Enter preview " />)}
          </Form.Item> */}

          <Form.Item
            validateStatus={iconUrlError ? 'error' : ''}
            help={iconUrlError || ''}
            label={
              <span>
                Icon
                <Tooltip title="Icon for sticker category">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('iconUrl', {
              rules: [
                {
                  required: true,
                  message: 'Please upload icon!'
                }
              ],
              initialValue: formData.iconUrl
            })(<Input placeholder="Enter icon url value" disabled />)}
            <FileUploader
              ref={this.iconUploaderRef}
              callbackFromParent={fileUrl => {
                this.updateFormField('iconUrl', fileUrl);
              }}
              cdnPath={this.props.cdnPath}
              fileType="image"
              uploadReqUrl={ICON_UPLOAD_REQ_URL}
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
                <Tooltip title="Priority/OrderIndex of sticker category">
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
            validateStatus={statusError ? 'error' : ''}
            help={statusError || ''}
            label={
              <span>
                Status
                <Tooltip title="Status of category">
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
              initialValue: formData.hasOwnProperty('status')
                ? formData.status
                : false
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

const StickerCategoryForm = Form.create({})(StickerCategory);

export default StickerCategoryForm;
