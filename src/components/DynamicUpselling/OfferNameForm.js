import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Select, Button, Row, Col } from 'antd';
import { DYNAMIC_UPSELLING_READ } from '../../auth/userPermission';
import { ADD_TO_CUG_SUCCESS } from '../../shared/actionTypes';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};

export class OfferName extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  componentDidMount() {
    // this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const game = this.props.enabledGamesList.find(
          gm => gm.id === values.gameId
        );
        values.gameName = game.name;

        this.props.handleSubmit(values);
      }
    });
  };

  resetForm = () => {
    this.props.form.resetFields();
  };

  readOnlyUser = () => {
    return this.props.currentUser.user_role.includes(DYNAMIC_UPSELLING_READ);
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const formData = this.props.offerDetails ? this.props.offerDetails : {};
    const { isEditing, enabledGamesList = [] } = this.props;

    const shortOfferTextError =
      isFieldTouched('shortOfferText') && getFieldError('shortOfferText');
    const longOfferTextError =
      isFieldTouched('longOfferText') && getFieldError('longOfferText');
    const gameIdError = isFieldTouched('gameId') && getFieldError('gameId');

    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout}>
        {isEditing && formData.id ? (
          <Form.Item label="Category ID">
            {getFieldDecorator('id', {
              rules: [
                {
                  required: true,
                  message: 'Please enter category ID!'
                }
              ],
              initialValue: formData.id
            })(<Input placeholder="Enter sticker category ID" disabled />)}
          </Form.Item>
        ) : null}

        <FormItem
          validateStatus={gameIdError ? 'error' : ''}
          help={gameIdError || ''}
          label={
            <span>
              Game for Offer
              <Tooltip title="Select Game to create Dynamic Upselling Offer for">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('gameId', {
            rules: [
              {
                type: 'number',
                required: true,
                message: 'Please select your Game!'
              }
            ],
            initialValue: formData.gameId
          })(
            <Select
              disabled={this.state.disableField}
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a Game"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {enabledGamesList.map(game => {
                return (
                  <Select.Option key={'game' + game.id} value={game.id}>
                    {game.name + ' (' + game.id + ')'}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </FormItem>

        <FormItem
          validateStatus={shortOfferTextError ? 'error' : ''}
          help={shortOfferTextError || ''}
          {...formItemLayout}
          label={
            <span>
              Short Offer Text
              <Tooltip title="Short Offer Text">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('shortOfferText', {
            rules: [
              {
                required: true,
                message: 'Please input Short Offer Text!',
                whitespace: true
              }
            ],
            initialValue: formData.shortOfferText
          })(<Input placeholder="Enter Short Offer Text" />)}
        </FormItem>

        <FormItem
          validateStatus={longOfferTextError ? 'error' : ''}
          help={longOfferTextError || ''}
          {...formItemLayout}
          label={
            <span>
              Long Offer Text
              <Tooltip title="Enter long Offer text">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('longOfferText', {
            rules: [
              {
                required: true,
                message: 'Please input long Offer text!',
                whitespace: true
              }
            ],
            initialValue: formData.longOfferText
          })(
            <TextArea
              placeholder="Enter long Offer text"
              autoSize={{ minRows: 2, maxRows: 8 }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<span>Country Code</span>}>
          {getFieldDecorator('countryCode', {
            rules: [
              {
                required: true,
                message: 'Please input long Offer text!',
                whitespace: true
              }
            ],
            initialValue: this.props.countryCode
          })(<Input disabled />)}
        </FormItem>

        <Row>
          <Col offset={8} span={10}>
            <Button
              style={{ float: 'unset' }}
              type="primary"
              disabled={this.hasErrors(getFieldsError()) || this.readOnlyUser()}
              htmlType="submit"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const OfferNameForm = Form.create()(OfferName);
export default OfferNameForm;
