import React from 'react';
import '../../styles/components/stories.css';
import { Form, Button, Radio } from 'antd';

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

class TrendingOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickerTypeList: STICKER_TYPE,
      previewVisible: false,
      previewImage: '',
      catType: 0
    };
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
  };

  onCategoryTypeChange = catType => {
    this.setState({ catType });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const formData = this.props.orderDetails ? this.props.orderDetails : {};

    return (
      <div className="page-container">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="hashTagState">
            {getFieldDecorator('hashTagState', {
              rules: [{ required: true }],
              initialValue: formData.hashTagState || 'ACTIVE'
            })(
              <Radio.Group>
                <Radio.Button value="ACTIVE">ACTIVE</Radio.Button>
                <Radio.Button value="INACTIVE">INACTIVE</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item label="storyType">
            {getFieldDecorator('storyType', {
              rules: [{ required: true }],
              initialValue: formData.storyType || 'SHORT_VIDEO'
            })(
              <Radio.Group>
                <Radio.Button value="SHORT_VIDEO">SHORT_VIDEO</Radio.Button>
                <Radio.Button value="AUDIO_STREAM">AUDIO_STREAM</Radio.Button>
                <Radio.Button value="LIVE_STREAM">LIVE_STREAM</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item label="hashTagType">
            {getFieldDecorator('hashTagType', {
              rules: [{ required: true }],
              initialValue: formData.hashTagType || 'REGULAR'
            })(
              <Radio.Group>
                <Radio.Button value="REGULAR">REGULAR</Radio.Button>
                <Radio.Button value="NEW_CREATOR">NEW_CREATOR</Radio.Button>
                <Radio.Button value="EXCLUSIVE">EXCLUSIVE</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item label="increasingOrder">
            {getFieldDecorator('increasingOrder', {
              rules: [{ required: true }],
              initialValue: formData.increasingOrder || true
            })(
              <Radio.Group>
                <Radio.Button value={true}>true</Radio.Button>
                <Radio.Button value={false}>false</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item label="hide">
            {getFieldDecorator('hide', {
              rules: [{ required: true }],
              initialValue: formData.hide || false
            })(
              <Radio.Group>
                <Radio.Button value={true}>true</Radio.Button>
                <Radio.Button value={false}>false</Radio.Button>
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

const TrendingOrderForm = Form.create({})(TrendingOrder);
export default TrendingOrderForm;
