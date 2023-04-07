import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Upload, Button, Icon, Spin, Col } from 'antd';
import * as storageActions from '../../actions/storageActions';

class UploadSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileList: []
    };
  }
  componentDidMount() {
    if (this.props.fileList) {
      this.setState({
        previewImage: this.props.previewImage,
        fileList: [...this.props.fileList]
      });
    }
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    if (fileList.length === 0) {
      this.props.callbackFromParent({ id: '-1' });
    }
  };
  returnToParent = () => {
    this.props.callbackFromParent(this.state.imageObject);
  };

  render() {
    const { fileList } = this.state;
    const beforeUpload = file => {
      this.setState({ loading: true });
      let data = {
        contentType: file.type,
        extension:
          '.' + file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      this.props.actions.getCustomUserCsvUrl(data).then(() => {
        fetch(this.props.getCustomUserCsvUrlResponse.uploadUrl, {
          body: file,
          method: 'PUT'
        }).then(result => {
          if (result.status === 200) {
            this.setState({
              imageObject: this.props.getCustomUserCsvUrlResponse.object,
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
          <Col>
            <Spin spinning={this.state.loading}>
              <Upload
                multiple={false}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={this.handleChange}
              >
                {fileList.length == 0 && (
                  <Button>
                    <Icon type="plus" /> Upload
                  </Button>
                )}
              </Upload>
            </Spin>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    getCustomUserCsvUrlResponse:
      state.tournamentConfig.getCustomUserCsvUrlResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...storageActions }, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadSegment);
