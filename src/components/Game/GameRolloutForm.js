import React, { Component } from 'react';
import {
  Button,
  Col,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Radio
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class GameRollout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidJson: false
    };
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  jsonCheck(value) {
    if (value) {
      const invalidJson = this.isJsonInvalid(value);
      this.setState({ invalidJson });
    }
  }

  isJsonInvalid = json => {
    try {
      JSON.parse(json);
      return false;
    } catch (error) {
      message.warning('Game info JSON is invalid!');
      return true;
    }
  };

  handleZkConfigSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //   check for JSON value
        if (!this.isJsonInvalid(values.zkGameInfo)) {
          this.props.updateZkConfig(values);
        }
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const selectedGameDetails = this.props.selectedGameDetails || {};
    const gameDetailsArray = this.props.gameDetailsArray || [];

    const errors = {
      zkGameInfo: isFieldTouched('zkGameInfo') && getFieldError('zkGameInfo')
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleZkConfigSubmit}>
        <Form.Item label={'Game'}>
          {getFieldDecorator('zkGameId', {
            rules: [
              {
                required: true,
                message: 'Please select game!'
              }
            ],
            initialValue: selectedGameDetails.id
          })(
            <Select
              disabled
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a game to update"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {gameDetailsArray.map(game => (
                <Select.Option key={'game' + game.id} value={game.id}>
                  {game.name} ( {game.id} )
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          validateStatus={
            errors.zkGameInfo || this.state.invalidJson ? 'error' : ''
          }
          help={errors.zkGameInfo || this.state.invalidJson || ''}
          label="Game Info"
        >
          {getFieldDecorator('zkGameInfo', {
            initialValue: JSON.stringify(this.props.gameInfo),
            rules: [
              {
                required: true,
                message: 'This is a mandatory field!',
                whitespace: true
              }
            ]
          })(
            <TextArea
              autoSize={{ minRows: 3, maxRows: 10 }}
              onBlur={e => this.jsonCheck(e.target.value)}
            />
          )}
        </Form.Item>

        <Form.Item label="% Roll Out">
          {getFieldDecorator('percentValue', {
            rules: [
              {
                required: true,
                type: 'number',
                message: 'This is a mandatory field!'
              }
            ],
            initialValue: this.props.percentValue
          })(<InputNumber min={0} max={100} />)}
        </Form.Item>
        <Form.Item label="For Internal Users Only">
          {getFieldDecorator('isInternal', {
            rules: [
              {
                required: true,
                type: 'boolean',
                message: 'This is a mandatory field!'
              }
            ],
            initialValue: this.props.isInternalRollout
          })(
            <Radio.Group size="small" buttonStyle="solid">
              <Radio.Button value={false}>NO</Radio.Button>
              <Radio.Button value={true}>YES</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        <Row>
          <Col offset={8} span={12}>
            <Button
              style={{ float: 'unset' }}
              type="primary"
              htmlType="submit"
              disabled={this.hasErrors(getFieldsError())}
            >
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const GameRolloutForm = Form.create()(GameRollout);
export default GameRolloutForm;
