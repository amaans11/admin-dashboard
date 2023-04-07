import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../../styles/components/stories.css';
import { Card, Form, message, Row, Col } from 'antd';
import * as storyActions from '../../actions/storyActions';
import MusicCategoryForm from './MusicCategoryForm';
import { isEmpty } from 'lodash';

class CreateMusicCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cdnPath: ''
    };

    this.musicCatFormRef = React.createRef();
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

  createMusicCategory = musicData => {
    this.props.actions.createMusicCategory(musicData).then(() => {
      if (
        this.props.createMusicCategoryResponse &&
        this.props.createMusicCategoryResponse.status.code === 200
      ) {
        this.musicCatFormRef.resetForm();
        message.success('Music category created!');
      } else {
        message.error('Unable to create music category');
      }
    });
  };

  render() {
    return (
      <Card className="page-container" title="Create Music Category">
        <Row>
          <Col span={16}>
            <MusicCategoryForm
              wrappedComponentRef={form => (this.musicCatFormRef = form)}
              cdnPath={this.state.cdnPath}
              handleSubmit={this.createMusicCategory}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    createMusicCategoryResponse: state.story.createMusicCategoryResponse,
    getCdnPathResponse: state.story.getCdnPathForStoryUploadResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(storyActions, dispatch)
  };
};

const CreateMusicCategoryForm = Form.create({
  name: 'create-music-category-form'
})(CreateMusicCategory);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateMusicCategoryForm);
