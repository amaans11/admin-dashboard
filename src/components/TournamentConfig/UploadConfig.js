import React from 'react';
import { Upload, Icon } from 'antd';
const Dragger = Upload.Dragger;

export default class UploadConfig extends React.Component {
  render() {
    const beforeUpload = (file, fileList) => {
      var vm = this;
      var reader = new FileReader();
      reader.onloadend = function() {
        vm.props.getConfig(reader.result);
      };
      reader.readAsText(file);
      return false;
    };

    return (
      <React.Fragment>
        <Dragger
          multiple={false}
          accept={'application/json'}
          beforeUpload={beforeUpload}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">
            Click or drag Game Config to this area to upload
          </p>
        </Dragger>
      </React.Fragment>
    );
  }
}
