import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../../styles/components/stories.css';
import * as storyActions from '../../actions/storyActions';
import { Card, Form, Icon, Button, Tooltip, message, Radio } from 'antd';
import { INT_API_URL } from '../../shared/actionTypes';
import FileUploader from './FileUploader';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 10,
    offset: 6
  }
};

const STICKER_TYPE = ['FACE_STICKER', 'EDITING_STICKER', 'CAPTIONS_STICKER'];
const ICON_UPLOAD_REQ_URL = INT_API_URL + 'api/asn/stories/sticker-icon-url';

class StickerUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musicCategoryList: [],
      count: 40,
      offset: 0,
      fileList: [],
      stickerList: [],
      stickerTypeList: STICKER_TYPE,
      cdnPath: '',
      categoryType: 1
    };

    this.imageUploaderRef = React.createRef();
  }

  componentDidMount() {
    this.getCdnLink();
  }

  getCdnLink = () => {
    this.props.actions.getCdnPathForStoryUpload().then(() => {
      if (this.props.getCdnPathResponse) {
        const cdnPath = JSON.parse(this.props.getCdnPathResponse).CDN_PATH;
        this.setState({ cdnPath });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        const { stickerList } = this.state;
        if (stickerList.length) {
          const stickers = stickerList.map(fl => {
            const stickerObj = {};
            let nameArr = fl.name.split('.');
            nameArr.splice(nameArr.length - 1, 1);
            stickerObj.name = nameArr.join('.');
            stickerObj.icon = fl.icon;
            stickerObj.priority = 10;
            stickerObj.type = this.state.categoryType;
            return stickerObj;
          });
          this.createStickersData(stickers);
        } else {
          message.warning('Please upload sticker icons!');
        }
      }
    });
  };

  createStickersData = stickers => {
    const data = { stickers, type: this.state.categoryType };
    this.props.actions.bulkStickerUpload(data).then(() => {
      if (
        this.props.bulkStickerUploadResponse &&
        this.props.bulkStickerUploadResponse.status.code === 200
      ) {
        message.success('Stickers created!');
        this.setState({ stickerList: [] });
        this.props.form.resetFields();
        this.imageUploaderRef.current.resetFileList();
      } else {
        message.error('Unable to create stickers!');
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  updateFormField = (icon, name) => {
    let { stickerList } = this.state;
    if (icon) {
      stickerList.push({ name, icon });
    } else {
      stickerList = stickerList.filter(fl => fl.name !== name);
    }
    this.setState({ stickerList });
  };

  onCategoryTypeChange = value => {
    this.setState({ categoryType: value });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { categoryType } = this.state;

    return (
      <div className="page-container">
        <Card title="Bulk Sticker Upload">
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item
              label={
                <span>
                  Sticker Type
                  <Tooltip title="Type of sticker ">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              help="* Only Editing Stickers can be bulk uploaded"
            >
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: 'Please select type!'
                  }
                ],
                initialValue: categoryType
              })(
                <Radio.Group
                  buttonStyle="solid"
                  onChange={e => {
                    this.onCategoryTypeChange(e.target.value);
                  }}
                >
                  {this.state.stickerTypeList.map((tp, idx) => (
                    <Radio.Button
                      key={idx}
                      value={idx}
                      disabled={idx !== categoryType}
                    >
                      {tp}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Sticker Icons
                  <Tooltip
                    title="Browse and upload multiple files at a time (.jpg, .png, .webp). 
                  Rename files before upload to set sticker name"
                  >
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              help="* Rename files before upload to set sticker name, accept multiple files (.jpg, .png, .webp)"
            >
              <FileUploader
                ref={this.imageUploaderRef}
                multiple={true}
                fileType="image"
                callbackFromParent={(fileUrl, objectId, fileName) => {
                  this.updateFormField(fileUrl, fileName);
                }}
                cdnPath={this.state.cdnPath}
                uploadReqUrl={ICON_UPLOAD_REQ_URL}
                accept=".jpg,.png,.webp"
              />
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
    bulkStickerUploadResponse: state.story.bulkStickerUploadResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(storyActions, dispatch)
  };
};

const StickerUploadBulk = Form.create({
  name: 'music-upload-form'
})(StickerUpload);

export default connect(mapStateToProps, mapDispatchToProps)(StickerUploadBulk);
