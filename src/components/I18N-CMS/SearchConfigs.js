import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Form,
  Tooltip,
  Icon,
  Card,
  Select,
  Input,
  Button,
  message
} from 'antd';
import { Helmet } from 'react-helmet';

import * as i18nCMActions from '../../actions/i18nCMSActions';
import ConfigsListTable from './ConfigsListTable';

const FormItem = Form.Item;

const SEARCH_OPTIONS = [
  { text: 'Config Feature', value: 'CONFIG_FEATURE' },
  { text: 'Config Name', value: 'CONFIG_NAME' },
  { text: 'Config Label', value: 'CONFIG_LABEL' }
];
export class SearchConfigs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configList: []
    };
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  handleSearch = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.searchConfigByData(values).then(() => {
          const { configList } = this.props.searchConfigsResponse;
          if (configList && configList.length) {
            this.setState({
              configList
            });
          } else {
            message.info('No data found. Try other keywords.');
          }
        });
      }
    });
  };
  render() {
    const { configList } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const errors = {
      searchByData:
        isFieldTouched('searchByData') && getFieldError('searchByData'),
      dataValue: isFieldTouched('dataValue') && getFieldError('dataValue')
    };
    return (
      <React.Fragment>
        <Helmet>
          <title>Search Configs |  Dashboard</title>
        </Helmet>
        <Card title="Search for Config" className="mt10">
          <Form onSubmit={this.handleSearch} layout="inline">
            <FormItem
              label={
                <span>
                  Search By
                  <Tooltip title="Choose one key to search on">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              validateStatus={errors.searchByData}
              help={errors.searchByData || ''}
            >
              {getFieldDecorator('searchByData', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: 'Please select a search type'
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a label"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {SEARCH_OPTIONS.map(option => {
                    return (
                      <Select.Option key={option.value} value={option.value}>
                        {option.text}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.dataValue}
              help={errors.dataValue || ''}
              label={
                <span>
                  Search For
                  <Tooltip title="Input the data to search for">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('dataValue', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: 'Please input config feature'
                  }
                ]
              })(<Input placeholder="Enter Config Feature" />)}
            </FormItem>
            <FormItem>
              <Button
                htmlType="submit"
                type="primary"
                disabled={this.hasErrors(getFieldsError())}
              >
                Search
              </Button>
            </FormItem>
          </Form>
        </Card>
        <ConfigsListTable cardTitle="Search Results" dataSource={configList} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  searchConfigsResponse: state.i18nCMS.searchConfigsResponse
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(i18nCMActions, dispatch)
});

const SearchConfigsForm = Form.create({})(SearchConfigs);
export default connect(mapStateToProps, mapDispatchToProps)(SearchConfigsForm);
