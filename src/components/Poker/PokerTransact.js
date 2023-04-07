// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Form, InputNumber, Button, message, Input, Radio } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import * as userDataActions from '../../actions/userDataActions';
import * as pokerOpsActions from '../../actions/pokerOpsActions';

const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class PokerTransact extends React.Component {
  componentDidMount() {
    this.props.form.validateFields();
    window.scrollTo(0, 0);
  }

  handleSubmit = e => {
    const { currentUser } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let datetime = moment().format('YYYYMMDD_HHmmss');
        let transactionId =
          'DASHBOARD_' +
          values.transactionType +
          '_' +
          values.userId +
          '_' +
          datetime;
        let data = {
          userId: values.userId,
          bonusAmount: values.bonusAmount,
          depositAmount: values.depositAmount,
          winningAmount: values.winningAmount,
          transactionId: transactionId,
          referenceType: values.referenceType,
          customDescription: values.customDescription
        };
        if (values.transactionType === 'DEBIT') {
          if (
            currentUser.user_role.includes('POKER_L2') &&
            values.bonusAmount + values.depositAmount + values.winningAmount >
              50000
          ) {
            message.error('Debit limit exceeds the max limit');
            return;
          }
          this.props.actions.pokerDebitWallet(data).then(() => {
            if (
              this.props.pokerDebitWalletResponse &&
              this.props.pokerDebitWalletResponse.balances
            ) {
              message
                .success('Successfully debited the amount', 1.5)
                .then(() => window.location.reload());
            } else {
              message.error(
                this.props.pokerDebitWalletResponse.error &&
                  this.props.pokerDebitWalletResponse.error.errorDescription
                  ? this.props.pokerDebitWalletResponse.error.errorDescription
                  : 'Could not debit the amount'
              );
            }
          });
        } else {
          if (
            currentUser.user_role.includes('POKER_L2') &&
            values.bonusAmount + values.depositAmount + values.winningAmount >
              10000
          ) {
            message.error('Credit limit exceeds the max limit');
            return;
          }
          this.props.actions.pokerCreditWallet(data).then(() => {
            if (
              this.props.pokerCreditWalletResponse &&
              this.props.pokerCreditWalletResponse.balances
            ) {
              message
                .success('Successfully credited the amount', 1.5)
                .then(() => window.location.reload());
            } else {
              message.error(
                this.props.pokerCreditWalletResponse.error &&
                  this.props.pokerCreditWalletResponse.error.errorDescription
                  ? this.props.pokerCreditWalletResponse.error.errorDescription
                  : 'Could not debit the amount'
              );
            }
          });
        }
      }
    });
  };
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
      userId: isFieldTouched('userId') && getFieldError('userId'),
      bonusAmount:
        isFieldTouched('bonusAmount') && getFieldError('bonusAmount'),
      depositAmount:
        isFieldTouched('depositAmount') && getFieldError('depositAmount'),
      winningAmount:
        isFieldTouched('winningAmount') && getFieldError('winningAmount'),
      referenceType:
        isFieldTouched('referenceType') && getFieldError('referenceType'),
      customDescription:
        isFieldTouched('customDescription') &&
        getFieldError('customDescription')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Poker Transact">
            <FormItem {...formItemLayout} label={'Transaction Type'}>
              {getFieldDecorator('transactionType', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: 'DEBIT'
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={'DEBIT'}>Debit</Radio.Button>
                  <Radio.Button value={'CREDIT'}>Credit</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.userId ? 'error' : ''}
              help={errors.userId || ''}
              {...formItemLayout}
              label={<span>User Id</span>}
            >
              {getFieldDecorator('userId', {
                rules: [
                  {
                    required: true,
                    message: 'Please input number!',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: 200 }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.bonusAmount ? 'error' : ''}
              help={errors.bonusAmount || ''}
              {...formItemLayout}
              label={<span>Bonus Amount</span>}
            >
              {getFieldDecorator('bonusAmount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input number!',
                    whitespace: true
                  }
                ]
              })(<InputNumber precision={2} style={{ width: 200 }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.depositAmount ? 'error' : ''}
              help={errors.depositAmount || ''}
              {...formItemLayout}
              label={<span>Deposit Amount</span>}
            >
              {getFieldDecorator('depositAmount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input number!',
                    whitespace: true
                  }
                ]
              })(<InputNumber precision={2} style={{ width: 200 }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.winningAmount ? 'error' : ''}
              help={errors.winningAmount || ''}
              {...formItemLayout}
              label={<span>Winning Amount</span>}
            >
              {getFieldDecorator('winningAmount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input number!',
                    whitespace: true
                  }
                ]
              })(<InputNumber precision={2} style={{ width: 200 }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.referenceType ? 'error' : ''}
              help={errors.referenceType || ''}
              {...formItemLayout}
              label={<span>Reference Type</span>}
            >
              {getFieldDecorator('referenceType', {
                rules: [
                  {
                    required: true,
                    message: 'Please input number!',
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: 200 }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.customDescription ? 'error' : ''}
              help={errors.customDescription || ''}
              {...formItemLayout}
              label={'Custom Description'}
            >
              {getFieldDecorator('customDescription', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field!',
                    whitespace: true
                  }
                ]
              })(<TextArea style={{ width: '70%' }} rows={4} />)}
            </FormItem>
            <FormItem {...formItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Submit
              </Button>
            </FormItem>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    pokerDebitWalletResponse: state.pokerOps.pokerDebitWalletResponse,
    pokerCreditWalletResponse: state.pokerOps.pokerCreditWalletResponse,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...userDataActions, ...pokerOpsActions },
      dispatch
    )
  };
}

const PokerTransactForm = Form.create()(PokerTransact);
export default connect(mapStateToProps, mapDispatchToProps)(PokerTransactForm);
