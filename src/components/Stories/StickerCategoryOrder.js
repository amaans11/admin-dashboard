import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Button,
  message,
  Row,
  Col,
  Empty,
  Modal,
  Tag,
  Radio
} from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';
import StickerCategoryForm from './StickerCategoryForm';

const STICKER_TYPE = ['FACE_STICKER', 'EDITING_STICKER', 'CAPTIONS_STICKER'];

class StickerCategoryOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 20,
      categoryType: 0,
      stickerTypeList: STICKER_TYPE,
      stickerCategoryList: [],
      visible: false,
      activeStickerCategory: {},
      isStickerModalVisible: false,
      stickerCategoryId: '',
      fontsList: []
    };
  }

  componentDidMount() {
    this.getCdnLink();
    this.getStickerCategories();
    this.getFonts();
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
      if (
        this.props.getStickerCategoriesResponse &&
        this.props.getStickerCategoriesResponse.stickerCategories
      ) {
        this.setState({
          stickerCategoryList: this.props.getStickerCategoriesResponse
            .stickerCategories
        });
      }
    });
  };

  updateStickerCategory = catData => {
    this.props.actions.updateStickerCategory(catData).then(() => {
      if (
        this.props.updateStickerCategoryResponse &&
        this.props.updateStickerCategoryResponse.status.code === 200
      ) {
        message.success('Updated!');
        this.closeEditCategoryModal();
        this.getStickerCategories();
      } else {
        message.error('Unable to update category!');
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
    const { stickerCategoryId } = this.state;
    const params = {
      categoryId: stickerCategoryId
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
    this.setState({ categoryType: value }, () => {
      this.getStickerCategories();
    });
  };

  showEditCategoryModal = activeStickerCategory => {
    this.setState({ activeStickerCategory, visible: true });
  };

  closeEditCategoryModal = () => {
    this.setState({ visible: false });
  };

  showStickerModal = activeStickerCategory => {
    this.setState(
      {
        activeStickerCategory,
        isStickerModalVisible: true,
        stickersList: [],
        stickerCategoryId: activeStickerCategory.id
      },
      () => {
        this.getStickers();
      }
    );
  };

  closeStickerModal = () => {
    this.setState({ isStickerModalVisible: false });
  };

  handleValueChange = values => {
    this.setState({ activeStickerCategory: values });
  };

  toggleStatus = catData => {
    const newCatData = cloneDeep(catData);
    newCatData.status = newCatData.status ? !newCatData.status : 'true';

    this.updateStickerCategory(newCatData);
  };

  render() {
    return (
      <Card className="page-container" title="Manage Sticker Categories">
        <Row>
          <Col span={24} style={{ marginBottom: '1rem' }}>
            Sticker Type:{' '}
            <Radio.Group
              buttonStyle="solid"
              onChange={e => {
                this.onCategoryTypeChange(e.target.value);
              }}
              value={this.state.categoryType}
            >
              {this.state.stickerTypeList.map((tp, idx) => (
                <Radio.Button key={idx} value={idx}>
                  {tp}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Col>
        </Row>

        {this.state.stickerCategoryList &&
        this.state.stickerCategoryList.length ? (
          <div>
            <div>
              <em>
                * Edit and update priority value to re-order category (Highest
                priority on top)
              </em>
            </div>
            {this.state.stickerCategoryList.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    'music-cat-item ' + (item.status ? '' : 'disabled')
                  }
                >
                  <div className="music-cat-icon">
                    <img src={item.iconUrl} />
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
                    {/* <div>
                      <strong>Preview URL:</strong>{' '}
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {item.previewUrl}
                      </a>
                    </div> */}
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
                        ghost
                        type="primary"
                        icon="edit"
                        onClick={() => this.showEditCategoryModal(item)}
                      >
                        Edit
                      </Button>
                    </div>

                    <div style={{ margin: '.5rem 0' }}>
                      <Button
                        ghost
                        type="primary"
                        icon="eye"
                        onClick={() => this.showStickerModal(item)}
                      >
                        View Stickers
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            <Modal
              title="Edit Sticker Category Details"
              visible={this.state.visible}
              onOk={this.closeEditCategoryModal}
              onCancel={this.closeEditCategoryModal}
              footer={null}
              centered
              destroyOnClose={true}
              wrapClassName="sticker-cat-form-pop"
            >
              <StickerCategoryForm
                categoryDetails={this.state.activeStickerCategory}
                handleValueChange={this.handleValueChange}
                handleSubmit={this.updateStickerCategory}
                cdnPath={this.state.cdnPath}
              />
            </Modal>

            <Modal
              title="Stickers List"
              visible={this.state.isStickerModalVisible}
              onOk={this.closeStickerModal}
              onCancel={this.closeStickerModal}
              footer={null}
              // centered
              destroyOnClose={true}
              wrapClassName="stickers-list-pop"
              style={{ top: 10 }}
            >
              {/* <StickerList
                stickersList={this.state.stickersList}
                stickerCategoryList={this.state.stickerCategoryList}
                onCategoryTypeChange={this.onCategoryTypeChange}
                cdnPath={this.state.cdnPath}
                fontsList={this.state.fontsList}
              /> */}
            </Modal>
          </div>
        ) : (
          <Empty />
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    updateStickerCategoryResponse: state.story.updateStickerCategoryResponse,
    updateTagsOrderResponse: state.story.updateTagsOrderResponse,
    getStickerCategoriesResponse: state.story.getStickerCategoriesResponse,
    getCdnPathResponse: state.story.getCdnPathForStoryUploadResponse,
    getStickersResponse: state.story.getStickersResponse,
    getFontsResponse: state.story.getFontsResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StickerCategoryOrder);
