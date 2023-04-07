import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as serverActions from '../../actions/ServerConfigActions';
import { Card, Select, Row, Col } from 'antd';
import EditableConfig from './EditableConfig';

const { Option } = Select;

class ServerConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      selected: false,
      serverConfigObj: {},
      serverList: [],
      selectedConfig: {}
    };
    this.createOptions = this.createOptions.bind(this);
    this.serverSelected = this.serverSelected.bind(this);
  }

  componentDidMount() {
    this.props.actions.getServerConfigs().then(() => {
      this.setState({
        serverConfigObj: JSON.parse(this.props.serverConfig),
        fetched: true
      });
      this.createOptions();
    });
  }

  createOptions() {
    this.state.serverConfigObj.editConfigs.map(config => {
      this.state.serverList.push(
        <Option key={config.name} value={config.name}>
          {config.name}
        </Option>
      );
    });
  }

  serverSelected(name) {
    this.setState({
      selectedConfig: this.state.serverConfigObj.editConfigs.find(
        item => item.name === name
      ),
      selected: true
    });
  }

  render() {
    return (
      <React.Fragment>
        <Card title="Server Configurations">
          {this.state.fetched && (
            <Select
              showSearch
              onSelect={this.serverSelected}
              style={{ width: 200 }}
              placeholder="Select a Server config"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.serverList}
            </Select>
          )}

          {this.state.selected && (
            <Card type="inner" title={'Server'} style={{ marginTop: '16px' }}>
              <Row>
                <Col span={8}>Name:</Col>
                <Col span={16}>
                  <b>{this.state.selectedConfig.name}</b>
                </Col>
              </Row>

              <Card type="inner" title="Editable Fields">
                {this.state.selectedConfig.editableKeys.map(item => (
                  <EditableConfig
                    key={item}
                    title={item}
                    config={this.state.selectedConfig}
                  />
                ))}
              </Card>
            </Card>
          )}
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    serverConfig: state.serverConfigs.serverConfig
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(serverActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerConfig);
