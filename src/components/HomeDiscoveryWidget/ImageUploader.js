import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Upload, Modal, Icon } from 'antd';
import * as storageActions from '../../actions/storageActions';

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      loading: false,
      fileList: []
    };
  }

  componentDidMount() {
    if (this.props.previewImage && this.props.fileList) {
      this.setState({
        previewImage: this.props.previewImage,
        fileList: [...this.props.fileList]
      });
    }
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleRemove = ({ fileList }) => {
    this.setState({ imageObject: null }, () => this.returnToParent());
  };

  returnToParent = () => {
    this.props.callbackFromParent(this.state.imageObject);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const beforeUpload = file => {
      let imageData = {
        contentType: file.type,
        extension:
          '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      this.props.actions.getStyleImageUploadUrl(imageData).then(() => {
        fetch(this.props.tournament.assetUrl.uploadUrl, {
          body: file,
          method: 'PUT'
        }).then(result => {
          if (result.status === 200) {
            this.setState({
              imageObject: this.props.tournament.assetUrl.object,
              loading: false,
              file
            });
            this.returnToParent();
          }
        });
      });
      return false;
    };
    return (
      <React.Fragment>
        <Row>
          {this.props.isMandatory && (
            <span
              style={{
                fontSize: '14px',
                color: '#f5222d',
                marginRight: '4px',
                fontFamily: 'SimSun, sans-serif'
              }}
            >
              *
            </span>
          )}
          <strong>{this.props.header}</strong>
          <Upload
            multiple={false}
            beforeUpload={beforeUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.handleRemove}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
              </div>
            )}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { ...ownProps, state: state, tournament: state.tournaments };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...storageActions }, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader);
