import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as fantasyConfigActions from '../../actions/fantasyConfigActions';
import { Card, Select, Form, Button, Input, message, Row, Col } from 'antd';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const appTypeList = [
  <Option key="CASH" value="cash">
    Cash
  </Option>,
  <Option key="PS" value="play-store">
    Play Store
  </Option>,
  <Option key="IOS" value="ios">
    IOS
  </Option>,
  <Option key="PHONEPE" value="phone-pe">
    Phone pe
  </Option>
];

const sportIdList = [
  <Option key="5" value="5">
    5
  </Option>,
  <Option key="7" value="7">
    7
  </Option>,
  <Option key="8" value="8">
    8
  </Option>,
  <Option key="101" value="101">
    101
  </Option>
];

class DefaultSportSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      defaultSelectedSportId: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.appTypeSelect = this.appTypeSelect.bind(this);
  }

  appTypeSelect(e) {
    let data = {
      appType: e
    };
    this.props.actions.getFantasyConfig(data).then(() => {
      if (this.props.getFantasyResponse) {
        let config = JSON.parse(this.props.getFantasyResponse).config;
        this.setState({
          defaultSelectedSportId: config['superteam.defaultSelectedSportId']
        });
        this.setState({ fetched: true });
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = { ...values };
        this.props.actions.setFantasyConfig(data).then(() => {
          if (this.props.setFantasyResponse) {
            if (this.props.setFantasyResponse.error) {
              message.error('Could not update');
            } else {
              message.success('Data Uploaded Successfully', 1.5).then(() => {
                window.location.reload();
              });
            }
          }
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      applyToApps:
        isFieldTouched('applyToApps') && getFieldError('applyToApps'),
      defaultSelectedSportId:
        isFieldTouched('defaultSelectedSportId') &&
        getFieldError('defaultSelectedSportId')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Fantasy Config">
            <Card title="Select App to Fetch Current Config" type="inner">
              <Row>
                <Col span={6}>App Type</Col>
                <Col span={18}>
                  <Select
                    showSearch
                    onSelect={this.appTypeSelect}
                    style={{ width: 200 }}
                    placeholder="Select a App Type"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {appTypeList}
                  </Select>
                </Col>
              </Row>
            </Card>
            {this.state.fetched && (
              <Card title="Configs" type="inner">
                <FormItem
                  validateStatus={errors.applyToApps ? 'error' : ''}
                  help={errors.applyToApps || ''}
                  {...formItemLayout}
                  label={'Apply To Apps'}
                >
                  {getFieldDecorator('applyToApps', {
                    rules: [
                      {
                        required: true,
                        type: 'array',
                        message: 'Apps field is mandatory',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      showSearch
                      style={{ width: '70%' }}
                      placeholder="Applicable apps ( Select multiple )"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {appTypeList}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  validateStatus={errors.defaultSelectedSportId ? 'error' : ''}
                  help={errors.defaultSelectedSportId || ''}
                  {...formItemLayout}
                  label={'Apply To Apps'}
                >
                  {getFieldDecorator('defaultSelectedSportId', {
                    initialValue: this.state.defaultSelectedSportId,
                    rules: [
                      {
                        required: true,
                        message: 'This is a mandatory field',
                        whitespace: false
                      }
                    ]
                  })(
                    <Select
                      showSearch
                      style={{ width: '70%' }}
                      placeholder="Select default sport"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {sportIdList}
                    </Select>
                  )}
                </FormItem>
                <Row>
                  <Col span={12} offset={12}>
                    <Button
                      style={{ float: 'none' }}
                      type="primary"
                      htmlType="submit"
                      disabled={hasErrors(getFieldsError())}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getFantasyResponse: state.fantasyConfig.getFantasyResponse,
    setFantasyResponse: state.fantasyConfig.setFantasyResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fantasyConfigActions }, dispatch)
  };
}
const DefaultSportSelectionForm = Form.create()(DefaultSportSelection);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultSportSelectionForm);
