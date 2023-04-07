import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as UpdaterActions from '../../actions/updaterActions';
import MD5 from '../../shared/hashCalculation';
import { Upload, Icon, message, Row, Col, Button, Spin } from 'antd';

const Dragger = Upload.Dragger;

class uploadFiles extends React.Component {
  state = {
    acceptType: '',
    multiple: false,
    info: [],
    fileType: '',
    loading: false,
    fatApkstatus: false,
    slimApkstatus: false
  };
  componentDidMount() {
    switch (this.props.updater.config.type) {
      case 'ANDROID_APK':
        this.setState({
          acceptType: 'application/vnd.android.package-archive',
          info: [{ assetType: 'ANDROID_APK_FAT', msg: 'Upload fat file here' }]
        });
        break;
      case 'RN_ANDROID_BUNDLE':
        this.setState({
          acceptType: 'application/x-zip-compressed',
          info: [
            {
              assetType: 'ANDROID_BUNDLE',
              msg: 'Upload Android React native zip bundle here'
            }
          ]
        });
        break;
      case 'RN_IOS_BUNDLE':
        this.setState({
          acceptType: 'application/x-zip-compressed',
          info: [
            {
              assetType: 'IOS_BUNDLE',
              msg: 'Upload IOS React native zip bundle here'
            }
          ]
        });
        break;
      case 'ANDROID_APK_PS':
        this.setState({
          acceptType: 'application/vnd.android.package-archive',
          info: [
            {
              assetType: 'ANDROID_APK_FAT_PS',
              msg: 'Upload android bundle ps file here'
            }
          ]
        });
        break;
      default:
        break;
    }
  }
  setFileType(e) {
    this.setState({
      fileType: e
    });
  }
  // application/vnd.android.package-archive
  // application/x-zip-compressed
  render() {
    const skip = () => {
      this.props.history.push('/listupdates');
    };

    const beforeUpload = file => {
      var vm = this;

      message.loading('Please wait while hash gets calculated', 0);
      this.setState({
        loading: true
      });
      var reader = new FileReader();
      reader.onloadend = function(e) {
        MD5(e.target.result, function(hash) {
          let fileData = {
            assetType: vm.state.fileType,
            assetHash: hash,
            updateId: vm.props.updater.config.id,
            countryCode: vm.props.updater.config.countryCode
          };
          message.destroy();

          vm.props.actions.createAssetUrl(fileData).then(() => {
            message.loading(
              'Please wait while file gets uploaded, you will be redirected afterwards',
              0
            );
            fetch(vm.props.updater.uploads.uploadUrl, {
              body: file,
              method: 'PUT'
            })
              .then(result => {
                if (result.status === 200) {
                  message.destroy();
                  vm.setState({
                    loading: false
                  });
                  switch (vm.state.fileType) {
                    case 'ANDROID_APK_FAT':
                      vm.setState({
                        fatApkstatus: true
                      });
                      break;

                    default:
                      break;
                  }
                  if (vm.props.updater.config.type === 'ANDROID_APK') {
                    if (vm.state.fatApkstatus) vm.props.actions.uploadSucsess();
                  } else {
                    vm.props.actions.uploadSucsess();
                  }
                }
              })
              .catch(error => {
                throw error;
              });
          });
        });
      };
      reader.readAsBinaryString(file);

      return false;
    };
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Row gutter={50}>
            {this.state.info.map(fileInfo => {
              return (
                <Col key={fileInfo.msg} span={24 / this.state.info.length}>
                  <Dragger
                    onChange={() => this.setFileType(fileInfo.assetType)}
                    className={fileInfo.assetType}
                    multiple={false}
                    accept={this.state.acceptType}
                    beforeUpload={beforeUpload}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">{fileInfo.msg}</p>
                    <p className="ant-upload-hint">
                      Click or drag file to this area to upload.
                    </p>
                  </Dragger>
                </Col>
              );
            })}
          </Row>
          <Button onClick={skip} type="primary" htmlType="button">
            Skip for Now
          </Button>
        </Spin>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    updater: state.updater
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UpdaterActions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(uploadFiles)
);
