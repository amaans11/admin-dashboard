import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';
import { Card, Select, Button, Row, Typography } from 'antd';

import * as i18nCMActions from '../../actions/i18nCMSActions';
import ConfigsListTable from './ConfigsListTable';

const { Paragraph } = Typography;
export class ConfigsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configsList: [],
      configsByPath: [],
      currentPath: '',
      isCoutrySpecificFlow: false
    };
  }

  componentDidMount() {
    this.props.actions.getServiceConfigsList().then(() => {
      const configsList = get(
        this.props.configsListResponse,
        'serviceConfig',
        []
      );
      if (configsList.length) {
        this.setState({
          configsList
        });
      }
    });
  }

  onConfigPathChange = path => {
    if (path === '') return;
    this.props.actions.getConfigsByPath(path).then(() => {
      const { configList: configsByPath } = this.props.configsByPathResponse;
      if (configsByPath && configsByPath.length) {
        this.setState({
          configsByPath,
          currentPath: path,
          isCoutrySpecificFlow: false
        });
      }
    });
  };

  onCountrySpecificListClick = () => {
    this.props.actions.getCountrySpecificConfigs().then(() => {
      const {
        configList: configsByPath
      } = this.props.countrySpecificListResponse;
      if (configsByPath && configsByPath.length) {
        this.setState({
          configsByPath,
          currentPath: '',
          isCoutrySpecificFlow: true
        });
      }
    });
  };
  render() {
    const {
      configsList = [],
      configsByPath = [],
      currentPath = '',
      isCoutrySpecificFlow = false
    } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Configs By Path List |  Dashboard</title>
        </Helmet>
        <Card title="Get Config by Path" className="mt10">
          <Row type="flex" justify="space" align="middle">
            <Select
              style={{ width: 250 }}
              showSearch
              placeholder="Select path to fetch config"
              optionFilterProp="children"
              onChange={this.onConfigPathChange}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {configsList.map(path => {
                return (
                  <Select.Option key={path} value={path}>
                    {path}
                  </Select.Option>
                );
              })}
            </Select>
            <Typography className="mh20">
              <Paragraph>OR</Paragraph>
            </Typography>
            <Button type="primary" onClick={this.onCountrySpecificListClick}>
              Click to get Country Specific Configs
            </Button>
          </Row>
        </Card>
        <ConfigsListTable
          cardTitle={
            isCoutrySpecificFlow
              ? 'Country Specific Configs'
              : `Configs For Path ${currentPath}`
          }
          dataSource={configsByPath}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  configsListResponse: state.i18nCMS.configsListResponse,
  configsByPathResponse: state.i18nCMS.configsByPathResponse,
  countrySpecificListResponse: state.i18nCMS.countrySpecificListResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(i18nCMActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ConfigsList);
