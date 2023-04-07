import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../../styles/components/stories.css';
import { Card, message, Row, Col } from 'antd';
import * as storyActions from '../../actions/storyActions';
import StickerCategoryForm from './StickerCategoryForm';
import { isEmpty } from 'lodash';

class CreateStickerCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryDetails: {},
      cdnPath: ''
    };
    this.stickerFormRef = React.createRef();
  }

  componentDidMount() {
    this.getCdnLink();
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

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.createCategory(values);
      }
    });
  };

  createCategory = catData => {
    this.props.actions.createStickerCategory(catData).then(() => {
      if (
        this.props.createStickerCategoryResponse &&
        this.props.createStickerCategoryResponse.status.code === 200
      ) {
        // Using ref to reset child form
        this.stickerFormRef.resetForm();
        message.success('Sticker category created!');
      } else {
        message.error('Unable to create Sticker category!');
      }
    });
  };

  render() {
    return (
      <Card className="page-container" title="Create Sticker Category">
        <Row>
          <Col span={16}>
            <StickerCategoryForm
              wrappedComponentRef={form => (this.stickerFormRef = form)}
              cdnPath={this.state.cdnPath}
              categoryDetails={this.state.categoryDetails}
              handleSubmit={this.createCategory}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    createStickerCategoryResponse: state.story.createStickerCategoryResponse,
    getCdnPathResponse: state.story.getCdnPathForStoryUploadResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(storyActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateStickerCategory);
