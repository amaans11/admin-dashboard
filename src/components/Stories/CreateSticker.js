import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../../styles/components/stories.css';
import * as storyActions from '../../actions/storyActions';
import { Card, message, Row, Col } from 'antd';
import StickerForm from './StickerForm';
import { isEmpty } from 'lodash';

class CreateSticker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 40,
      offset: 0,
      stickerCategoryList: [],
      categoryType: 0,
      fontsList: []
    };
    this.stickerFormRef = React.createRef();
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
      if (this.props.getStickerCategoriesResponse) {
        const stickerCategoryList = this.props.getStickerCategoriesResponse
          .stickerCategories
          ? this.props.getStickerCategoriesResponse.stickerCategories
          : [];
        this.setState({ stickerCategoryList });
      }
    });
  };

  onCategoryTypeChange = value => {
    this.setState({ categoryType: value }, () => {
      this.getStickerCategories();
    });
  };

  createStickerData = stickerData => {
    this.props.actions.createSticker(stickerData).then(() => {
      if (
        this.props.createStickerResponse &&
        this.props.createStickerResponse.status.code === 200
      ) {
        // Using ref to reset child form
        this.stickerFormRef.resetForm();
        message.success('Sticker created!');
      } else {
        message.error('Unable to update sticker!');
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

  render() {
    return (
      <Card title="Create Sticker" className="page-container">
        <Row>
          <Col span={16}>
            <StickerForm
              wrappedComponentRef={form => (this.stickerFormRef = form)}
              cdnPath={this.state.cdnPath}
              stickerCategoryList={this.state.stickerCategoryList}
              onCategoryTypeChange={this.onCategoryTypeChange}
              handleSubmit={this.createStickerData}
              fontsList={this.state.fontsList}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getCdnPathResponse: state.story.getCdnPathForStoryUploadResponse,
    getStickerCategoriesResponse: state.story.getStickerCategoriesResponse,
    createStickerResponse: state.story.createStickerResponse,
    getFontsResponse: state.story.getFontsResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(storyActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSticker);
