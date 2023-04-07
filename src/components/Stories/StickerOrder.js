import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  message,
  Form,
  Radio,
  Tag,
  Popconfirm,
  Modal,
  Button
} from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';
import StickerForm from './StickerForm';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
const STICKER_TYPE = ['FACE_STICKER', 'EDITING_STICKER', 'CAPTIONS_STICKER'];

class StickerOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 20,
      categoryType: 0,
      stickerTypeList: STICKER_TYPE,
      stickerCategoryList: [],
      stickersList: [],
      visible: false,
      activeStickerDetails: {},
      stickerCategoryId: undefined,
      fontsList: [],
      isCreateVisible: false
    };

    this.stickerFormRef = React.createRef();
  }

  componentDidMount() {
    this.getFonts();
    this.getCdnLink();
    this.getStickers();
  }

  getCdnLink = () => {
    if (isEmpty(this.props.getCdnPathResponse)) {
      this.props.actions.getCdnPathForStoryUpload().then(() => {
        if (this.props.getCdnPathResponse) {
          const cdnPath = JSON.parse(this.props.getCdnPathResponse).CDN_PATH;
          this.setState({ cdnPath });
        }
      });
    } else {
      const cdnPath = JSON.parse(this.props.getCdnPathResponse).CDN_PATH;
      this.setState({ cdnPath });
    }
  };

  getStickerCategories = () => {
    const params = {
      categoryType: this.state.categoryType,
      includeDisableCategories: true
    };

    this.props.actions.getStickerCategories(params).then(() => {
      if (this.props.getStickerCategoriesResponse) {
        const stickerCategoryList = this.props.getStickerCategoriesResponse
          .stickerCategories
          ? this.props.getStickerCategoriesResponse.stickerCategories
          : [];
        this.setState({ stickerCategoryList });
      }
    });
  };

  getFonts = () => {
    this.props.actions.getFonts().then(() => {
      if (this.props.getFontsResponse && this.props.getFontsResponse.fonts) {
        this.setState({
          fontsList: this.props.getFontsResponse.fonts
        });
      }
    });
  };

  getStickers = () => {
    const { categoryType } = this.state;
    const params = {
      type: categoryType,
      includeDisableCategories: true
    };

    this.props.actions.getStickers(params).then(() => {
      if (
        this.props.getStickersResponse &&
        this.props.getStickersResponse.stickers
      ) {
        this.setState({
          stickersList: this.props.getStickersResponse.stickers
        });
      }
    });
  };

  onStartValueChange = value => {
    this.setState({ start: value });
  };

  onCountValueChange = value => {
    this.setState({ count: value });
  };

  onCategoryTypeChange = value => {
    this.setState(
      {
        categoryType: value,
        stickerCategoryList: [],
        stickerCategoryId: undefined,
        stickersList: []
      },
      () => {
        // this.getStickerCategories();
        this.getStickers();
      }
    );
  };

  showStickerModal = activeStickerDetails => {
    this.setState({ activeStickerDetails, visible: true });
  };

  closeStickerModal = () => {
    this.setState({ visible: false });
  };

  showCreateModal = () => {
    this.setState({ isCreateVisible: true });
  };

  closeCreateModal = () => {
    this.setState({ isCreateVisible: false });
  };

  handleValueChange = values => {
    this.setState({ activeStickerDetails: values });
  };

  toggleStatus = catData => {
    const newStData = cloneDeep(catData);
    newStData.status = newStData.hasOwnProperty('status')
      ? !newStData.status
      : 'true';

    this.updateStickerDetail(newStData);
  };

  updateStickerDetail = stickerData => {
    this.props.actions.createSticker(stickerData).then(() => {
      if (
        this.props.createStickerResponse &&
        this.props.createStickerResponse.status.code === 200
      ) {
        // Using ref to reset child form
        message.success('Sticker updated!');
        // this.stickerFormRef.resetForm();
        this.closeStickerModal();
        this.closeCreateModal();
        this.getStickers();
      } else {
        message.error('Unable to update sticker!');
      }
    });
  };

  deleteSticker = stickerId => {
    const params = { stickerId };
    this.props.actions.deleteSticker(params).then(() => {
      if (
        this.props.deleteStickerResponse.status &&
        this.props.deleteStickerResponse.status.code === 200
      ) {
        message.success('Sticker deleted!');
        this.getStickers();
      } else {
        message.error('Unable to delete sticker!');
      }
    });
  };

  render() {
    const { stickerTypeList, categoryType, stickersList } = this.state;

    return (
      <Card
        className="page-container"
        title="Manage Stickers"
        extra={
          <Button type="primary" ghost onClick={this.showCreateModal}>
            Create Sticker
          </Button>
        }
      >
        <Form.Item {...formItemLayout} label="Sticker Type">
          <Radio.Group
            buttonStyle="solid"
            onChange={e => {
              this.onCategoryTypeChange(e.target.value);
            }}
            value={categoryType}
          >
            {stickerTypeList.map((tp, idx) => (
              <Radio.Button key={idx} value={idx}>
                {tp}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {stickersList && stickersList.length ? (
          <div>
            <div>
              <em>
                * Edit and update priority value to re-order sticker (Highest
                priority on top)
              </em>
            </div>
            <div>
              <em>* Showing {stickersList.length} items</em>
            </div>

            {stickersList.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    'music-cat-item ' + (item.status ? '' : 'disabled')
                  }
                >
                  <div className="music-cat-icon">
                    <img src={item.icon} />
                  </div>

                  <div className="cat-details">
                    <div>
                      {item.status ? (
                        <Tag color="#40981a">Enabled</Tag>
                      ) : (
                        <Tag color="#aaa">Disabled</Tag>
                      )}
                    </div>
                    <div>
                      <strong>ID:</strong> {item.id}
                    </div>
                    <div>
                      <strong>Name:</strong> {item.name}
                    </div>
                    <div className="cat-desc">
                      <strong>Description:</strong> {item.description}
                    </div>

                    <div>
                      <strong>Priority:</strong> {item.priority}
                    </div>
                  </div>

                  <div className="cat-action">
                    <div style={{ margin: '.5rem 0' }}>
                      <Button
                        ghost
                        type={item.status ? 'danger' : 'primary'}
                        onClick={() => this.toggleStatus(item)}
                      >
                        {item.status ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                    <div style={{ margin: '.5rem 0' }}>
                      <Button
                        type="primary"
                        onClick={() => this.showStickerModal(item)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div>
                      <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={() => this.deleteSticker(item.id)}
                        okText="Confirm"
                        okType="danger"
                        cancelText="Cancel"
                      >
                        <Button type="danger">Delete</Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              );
            })}

            <Modal
              title="Edit Sticker Details"
              visible={this.state.visible}
              onOk={this.closeStickerModal}
              onCancel={this.closeStickerModal}
              footer={null}
              centered
              destroyOnClose={true}
              wrapClassName="sticker-cat-form-pop"
            >
              <StickerForm
                wrappedComponentRef={form => (this.stickerFormRef = form)}
                cdnPath={this.state.cdnPath}
                onCategoryTypeChange={this.onCategoryTypeChange}
                fontsList={this.state.fontsList}
                stickerDetails={this.state.activeStickerDetails}
                handleSubmit={this.updateStickerDetail}
                isEditing={true}
              />
            </Modal>

            <Modal
              title="Create Sticker"
              visible={this.state.isCreateVisible}
              onOk={this.closeCreateModal}
              onCancel={this.closeCreateModal}
              footer={null}
              centered
              destroyOnClose={true}
              wrapClassName="sticker-cat-form-pop"
            >
              <StickerForm
                wrappedComponentRef={form => (this.stickerFormRef = form)}
                cdnPath={this.state.cdnPath}
                onCategoryTypeChange={this.onCategoryTypeChange}
                fontsList={this.state.fontsList}
                handleSubmit={this.updateStickerDetail}
              />
            </Modal>
          </div>
        ) : null}
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getStickerCategoriesResponse: state.story.getStickerCategoriesResponse,
    updateStickerCategoryResponse: state.story.updateStickerCategoryResponse,
    getStickersResponse: state.story.getStickersResponse,
    getCdnPathResponse: state.story.getCdnPathForStoryUploadResponse,
    getFontsResponse: state.story.getFontsResponse,
    createStickerResponse: state.story.createStickerResponse,
    deleteStickerResponse: state.story.deleteStickerResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(StickerOrder);
