import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';
import { Card, Select, message } from 'antd';

import * as i18nCMActions from '../../actions/i18nCMSActions';
import ConfigsListTable from './ConfigsListTable';

export class MissingCountryConfigs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList: [],
      selectedCountry: '',
      missingConfigs: []
    };
  }

  componentDidMount() {
    this.props.actions.getCountryList().then(() => {
      let { countryList } = this.props.countryListResponse;
      if (countryList && countryList.length) {
        countryList = countryList.filter(country => country.isActive);
        this.setState({
          countryList
        });
      }
    });
  }
  onCountryChange = countryCode => {
    // console.log('COUNTRY: ', country);
    this.props.actions.getMissingCountryConfigs({ countryCode }).then(() => {
      const {
        configList: missingConfigs,
        error
      } = this.props.missingConfigsResponse;
      if (!error) {
        if (missingConfigs && missingConfigs.length) {
          this.setState({
            missingConfigs,
            selectedCountry: countryCode
          });
          this.props.actions.updateMissingCountry(countryCode);
        } else {
          message.info('No Missing Config Found. ');
        }
      } else {
        message.error(error.message || 'Something went wrong.');
      }
    });
  };

  render() {
    const { countryList, missingConfigs, selectedCountry } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Missing Country Configs |  Dashboard</title>
        </Helmet>
        <Card title="Get Missing Configs by Country" className="mt10">
          <Select
            style={{ width: 250 }}
            showSearch
            placeholder="Select Country"
            optionFilterProp="children"
            onChange={this.onCountryChange}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {countryList.map(country => {
              return (
                <Select.Option key={country.countryCode}>
                  {country.countryName} - {country.countryCode}
                </Select.Option>
              );
            })}
          </Select>
        </Card>
        <ConfigsListTable
          dataSource={missingConfigs}
          copyConfigFlow={true}
          cardTitle={`Missing Configs for Country - ${selectedCountry}`}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  missingConfigsResponse: state.i18nCMS.missingConfigsResponse,
  countryListResponse: state.i18nCMS.countryListResponse
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(i18nCMActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MissingCountryConfigs);
