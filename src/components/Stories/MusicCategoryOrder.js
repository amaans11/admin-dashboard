import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Button,
  message,
  Form,
  InputNumber,
  Row,
  Col,
  Empty,
  Modal,
  Tag
} from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';
import MusicCategoryForm from './MusicCategoryForm';

const formItemLayout = {
  labelCol: { span: 16 },
  wrapperCol: { span: 8 }
};
class MusicCategoryOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 20,
      musicCategoryList: [],
      visible: false,
      modalInfo: {}
    };

    this.musicCatFormRef = React.createRef();
  }

  componentDidMount() {
    this.getCdnLink();
    this.getMusicCategories();
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

  updateMusicCategory = catData => {
    this.props.actions.updateMusicCategory(catData).then(() => {
      if (
        this.props.updateMusicCategoryResponse &&
        this.props.updateMusicCategoryResponse.status.code === 200
      ) {
        message.success('Music category updated!');
        this.getMusicCategories();
        this.closeModal();
        this.resetMusicCatForm();
      } else {
        message.error('Unable to update music category!');
      }
    });
  };

  onStartValueChange = value => {
    this.setState({ start: value });
  };

  onCountValueChange = value => {
    this.setState({ count: value });
  };

  showModal = modalInfo => {
    this.setState({ modalInfo: cloneDeep(modalInfo), visible: true });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  handleValueChange = values => {
    this.setState({ modalInfo: values });
  };

  toggleStatus = catData => {
    const newCatData = cloneDeep(catData);
    newCatData.status = newCatData.status ? !newCatData.status : 'true';

    this.updateMusicCategory(newCatData);
  };

  resetMusicCatForm = () => {
    if (this.musicCatFormRef.current) {
      this.musicCatFormRef.current.resetForm();
    }
  };

  render() {
    return (
      <Card className="page-container" title="Manage Music Categories">
        <Row>
          <Col span={10}>
            <Form.Item
              {...formItemLayout}
              label="Number to start fetching data from"
            >
              <InputNumber
                min={0}
                defaultValue={this.state.start}
                onChange={this.onStartValueChange}
              ></InputNumber>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              {...formItemLayout}
              label="Total number of data to be fetched"
            >
              <InputNumber
                min={0}
                defaultValue={this.state.count}
                onChange={this.onCountValueChange}
              ></InputNumber>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item {...formItemLayout}>
              <Button type="primary" onClick={this.getMusicCategories}>
                Refresh
              </Button>
            </Form.Item>
          </Col>
        </Row>

        {this.state.musicCategoryList && this.state.musicCategoryList.length ? (
          <div>
            <div>
              <em>Showing {this.state.musicCategoryList.length} Items</em>
            </div>
            <div>
              <em>
                * Edit and update priority value to re-order category (Highest
                priority on top)
              </em>
            </div>

            {this.state.musicCategoryList.map((item, idx) => {
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
                      <strong>ID: </strong> {item.musicCategoryId}
                    </div>
                    <div>
                      <strong>Name: </strong> {item.displayName}
                    </div>
                    <div>
                      <strong>Description:</strong> {item.description}
                    </div>
                    <div>
                      <strong>Priority:</strong> {item.priority}
                    </div>
                  </div>

                  <div className="cat-action">
                    <Button
                      type={item.status ? 'danger' : 'primary'}
                      onClick={() => this.toggleStatus(item)}
                      style={{ marginRight: '1rem' }}
                    >
                      {item.status ? 'Disable' : 'Enable'}
                    </Button>

                    <Button onClick={() => this.showModal(item)}>Edit</Button>
                  </div>
                </div>
              );
            })}

            <Modal
              title="Music category Details"
              visible={this.state.visible}
              onOk={this.closeModal}
              onCancel={this.closeModal}
              footer={null}
              centered
              destroyOnClose={true}
              wrapClassName="music-cat-form-pop"
            >
              <MusicCategoryForm
                wrappedComponentRef={form =>
                  (this.musicCatFormRef.current = form)
                }
                categoryDetails={this.state.modalInfo}
                handleValueChange={this.handleValueChange}
                handleSubmit={this.updateMusicCategory}
                cdnPath={this.state.cdnPath}
              />
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
    updateMusicCategoryResponse: state.story.updateMusicCategoryResponse,
    updateTagsOrderResponse: state.story.updateTagsOrderResponse,
    getMusicCategoriesResponse: state.story.getMusicCategoriesResponse,
    getCdnPathResponse: state.story.getCdnPathForStoryUploadResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicCategoryOrder);
