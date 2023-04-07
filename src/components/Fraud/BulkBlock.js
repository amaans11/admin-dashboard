import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _, { toUpper } from 'lodash';
import moment from 'moment';
import {
  Card,
  Form,
  message,
  Button,
  Input,
  Row,
  Col,
  Select,
  Modal,
  InputNumber,
  Radio,
  Tag
} from 'antd';
import * as fraudActions from '../../actions/fraudActions';
import UploadProofFile from './UploadProofFile';

const FormItem = Form.Item;

class BulkBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bulkBlockFileId: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  bulkBlockUrl = data => {
    if (data)
      this.setState({
        bulkBlockFileId: data && data.id ? data.id : ''
      });
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { bulkBlockFileId } = this.state;
        if (!bulkBlockFileId) {
          message.error('Please upload file');
          return;
        }
        let data = {
          url: bulkBlockFileId
        };
        this.props.actions.bulkBlockOnAppLevelV2(data).then(() => {
          if (
            this.props.bulkBlockOnAppLevelV2Response &&
            this.props.bulkBlockOnAppLevelV2Response.isSuccess
          ) {
            message
              .success('Request successfully submitted', 1.5)
              .then(() => window.location.reload());
          } else {
            message.error('Request errored out at the backend');
          }
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
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

    return (
      <React.Fragment>
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Card title="App Level Block V2">
            <FormItem
              {...formItemLayout}
              label={<span>Upload Bulk Block File</span>}
            >
              {getFieldDecorator('blockDoc', {
                rules: [
                  {
                    required: false
                  }
                ]
              })(<UploadProofFile callbackFromParent={this.bulkBlockUrl} />)}
            </FormItem>
            <Row type="flex" justify="center">
              <Col>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    bulkBlockOnAppLevelV2Response: state.fraud.bulkBlockOnAppLevelV2Response
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...fraudActions }, dispatch)
  };
}

const BulkBlockForm = Form.create()(BulkBlock);
export default connect(mapStateToProps, mapDispatchToProps)(BulkBlockForm);
