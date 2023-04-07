// @flow

import React from 'react';
import { Form, InputNumber, Tooltip, Icon } from 'antd';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class CountryBonusUtilization extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.form.validateFields();
    if (this.props.initialValue) {
      this.props.form.setFieldsValue({
        bonusUtilization: this.props.initialValue
      });
    }
  }

  updateBonusUtilization(value) {
    this.props.updateParentComponent(this.props.countryCode, value);
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      bonusUtilization:
        isFieldTouched('bonusUtilization') && getFieldError('bonusUtilization')
    };
    return (
      <React.Fragment>
        <FormItem
          validateStatus={errors.bonusUtilization ? 'error' : ''}
          help={errors.bonusUtilization || ''}
          {...formItemLayout}
          label={
            <span>
              Bonus Utilization - {this.props.countryCode}
              <Tooltip title="bonusUtilization">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('bonusUtilization', {
            rules: [
              {
                required: false,
                type: 'number',
                whitespace: false
              }
            ]
          })(
            <InputNumber
              min={0}
              max={100}
              onChange={e => this.updateBonusUtilization(e)}
            />
          )}
        </FormItem>
      </React.Fragment>
    );
  }
}

const CountryBonusUtilizationForm = Form.create()(CountryBonusUtilization);
export default CountryBonusUtilizationForm;
