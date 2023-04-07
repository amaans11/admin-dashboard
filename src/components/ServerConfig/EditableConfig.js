import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as serverActions from '../../actions/ServerConfigActions';
import {
  Button,
  Card,
  Form,
  Tooltip,
  Icon,
  Input,
  Row,
  Col,
  InputNumber
} from 'antd';

const FormItem = Form.Item;
class EditableConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyName: '',
      keyValue: null,
      editable: false,
      fetched: false,
      type: null,
      isKeyArray: false,
      loading: false,
      displayName: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setEditTrue = this.setEditTrue.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
    this.props.actions
      .getConsoleConfigFromUrl(this.props.config.url)
      .then(() => {
        let tempObj = JSON.parse(this.props.serverConfigUrl);
        var n = this.props.title.indexOf('/');
        if (n !== -1) {
          let tempArr = this.props.title.split('/');
          for (var i = 0; i < tempArr.length; i++) {
            if (i === 0) {
              var obj = tempObj[tempArr[i]];
            } else {
              obj = obj[tempArr[i]];
            }
          }
          this.setState({
            keyName: this.props.title,
            keyValue: obj,
            type: typeof obj,
            fetched: true,
            displayName: tempArr.slice(-1)[0]
          });
        } else {
          this.setState({
            keyName: this.props.title,
            keyValue: tempObj[this.props.title],
            type: typeof tempObj[this.props.title],
            fetched: true,
            displayName: this.props.title
          });
        }
      });
  }

  setEditTrue() {
    this.setState({ editable: true });
    console.log(this.state);
    if (Array.isArray(this.state.keyValue)) {
      this.setState({ isKeyArray: true });
    }
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let keyValues = [];
        this.setState({ loading: true });
        if (this.state.isKeyArray) {
          let temp = values.keyValue.split(',');
          temp.map(item => {
            if (isNaN(item)) {
              keyValues.push(item);
            } else {
              keyValues.push(Number(item));
            }
          });
          values.keyValue = keyValues.slice(0);
        }
        let data = {
          url: this.props.config.url,
          keyName: this.state.keyName,
          value: values.keyValue
        };
        this.props.actions.setServerConsoleConfig(data).then(() => {
          this.setState({ editable: false, loading: false });
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const error = {
      keyValue: isFieldTouched('keyValue') && getFieldError('keyValue')
    };

    return (
      <React.Fragment>
        {this.state.fetched && (
          <Card extra={<Icon type="info-circle" />}>
            <Form>
              {this.state.type === 'number' ? (
                <FormItem
                  validateStatus={error.keyValue ? 'error' : ''}
                  help={error.keyValue || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      {this.state.displayName}
                      <Tooltip title="Server config key">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      {getFieldDecorator('keyValue', {
                        rules: [
                          {
                            required: true,
                            message: 'Please enter a value!'
                          }
                        ],
                        initialValue: this.state.keyValue
                      })(<InputNumber disabled={!this.state.editable} />)}
                    </Col>
                    <Col span={12}>
                      {!this.state.editable ? (
                        <Button onClick={this.setEditTrue}>
                          <Icon type="edit" />
                        </Button>
                      ) : (
                        <Button onClick={this.handleSubmit}>
                          <Icon type="upload" />
                        </Button>
                      )}
                    </Col>
                  </Row>
                </FormItem>
              ) : (
                <FormItem
                  validateStatus={error.keyValue ? 'error' : ''}
                  help={error.keyValue || ''}
                  {...formItemLayout}
                  label={
                    <span>
                      {this.state.displayName}
                      <Tooltip title=" Min number of Days since Last Win">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      {getFieldDecorator('keyValue', {
                        rules: [
                          {
                            required: true,
                            message: 'Please enter a value!'
                          }
                        ],
                        initialValue: this.state.keyValue
                      })(<Input disabled={!this.state.editable} />)}
                    </Col>
                    <Col span={12}>
                      {!this.state.editable ? (
                        <Button onClick={this.setEditTrue}>
                          <Icon type="edit" />
                        </Button>
                      ) : (
                        <Button onClick={this.handleSubmit}>
                          {this.state.loading ? (
                            <Icon type="loading" />
                          ) : (
                            <Icon type="upload" />
                          )}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </FormItem>
              )}
            </Form>
          </Card>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { ...ownProps, serverConfigUrl: state.serverConfigs.serverConfigUrl };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(serverActions, dispatch)
  };
}
const EditableConfigForm = Form.create()(EditableConfig);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableConfigForm);
