import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as kabaddiActions from '../../actions/KabaddiActions';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import _ from 'lodash';
import { Card, Form, Button, Row, Col, message, Input, DatePicker } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class ExtendMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchStartTime: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (
      this.props.fantasy.editMatchDetails &&
      this.props.fantasy.editMatchDetails.record
    ) {
      let record = this.props.fantasy.editMatchDetails.record;
      this.props.form.setFieldsValue({
        matchStartTime: record.startTime ? moment(record.startTime) : ''
      });
      this.setState({
        seasonGameUid: record.seasonGameUid
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let matchStartTime = moment(values.matchStartTime).toISOString();
        let data = {
          matchStartTime: matchStartTime,
          seasonGameUid: this.state.seasonGameUid
        };
        this.props.actions.extendMatch(data).then(() => {
          if (
            this.props.fantasy.extendMatchResponse &&
            this.props.fantasy.extendMatchResponse.error
          ) {
            if (this.props.fantasy.extendMatchResponse.error.message) {
              message.error(
                this.props.fantasy.extendMatchResponse.error.message
              );
              return;
            } else {
              message.error('Could not update the match details');
              return;
            }
          } else {
            this.props.history.push('/kabaddi/match-list');
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

    const errors = {
      matchStartTime:
        isFieldTouched('matchStartTime') && getFieldError('matchStartTime')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Edit Match Details|  Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card
            title={
              <span>
                {this.props.fantasy.editMatchDetails.record.title} ({' '}
                {this.state.seasonGameUid} ){' '}
              </span>
            }
          >
            <FormItem
              validateStatus={errors.matchStartTime ? 'error' : ''}
              help={errors.matchStartTime || ''}
              {...formItemLayout}
              label={<span>Match Start Time</span>}
            >
              {getFieldDecorator('matchStartTime', {
                rules: [
                  {
                    type: 'object',
                    required: true,
                    message: 'Please select start time!'
                  }
                ]
              })(
                <DatePicker
                  allowClear="true"
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  format="YYYY-MM-DD hh:mm A"
                />
              )}
            </FormItem>
            <Row type="flex" justify="center">
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
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
    fantasy: state.kabaddi
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...kabaddiActions }, dispatch)
  };
}
const ExtendMatchForm = Form.create()(ExtendMatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExtendMatchForm);
