import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as superteamFeedActions from '../../actions/SuperteamFeedActions';
import { Helmet } from 'react-helmet';
import ImageUploader from './ImageUploader';
import _ from 'lodash';
import { Card, Form, Button, Row, Col, message, Input } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class UpdateMatchDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seasonGameUid: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.feedMatchDetails) {
      let feedMatchDetails = { ...this.props.feedMatchDetails };
      this.setState({ feedMatchDetails });
      this.props.form.setFieldsValue({
        title: feedMatchDetails.title,
        subTitle: feedMatchDetails.subTitle ? feedMatchDetails.subTitle : null,
        home: feedMatchDetails.home,
        away: feedMatchDetails.away,
        matchVenue: feedMatchDetails.matchVenue
          ? feedMatchDetails.matchVenue
          : null,
        leagueName: feedMatchDetails.leagueName
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          matchId: this.state.feedMatchDetails.id,
          title: values.title,
          subTitle: values.subTitle ? values.subTitle : null,
          home: values.home,
          away: values.away,
          matchVenue: values.matchVenue,
          leagueName: values.leagueName
        };
        this.props.actions.updateFootballFeedMatchDetail(data).then(() => {
          if (
            this.props.updateFootballFeedMatchDetailResponse &&
            this.props.updateFootballFeedMatchDetailResponse.error
          ) {
            message.error(
              this.props.updateFootballFeedMatchDetailResponse.error.message
                ? this.props.updateFootballFeedMatchDetailResponse.error.message
                : 'Could not update'
            );
          } else {
            this.props.history.push('/superteam-feeds/search');
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
      title: isFieldTouched('title') && getFieldError('title'),
      subTitle: isFieldTouched('subTitle') && getFieldError('subTitle'),
      home: isFieldTouched('home') && getFieldError('home'),
      away: isFieldTouched('away') && getFieldError('away'),
      matchVenue: isFieldTouched('matchVenue') && getFieldError('matchVenue'),
      leagueName: isFieldTouched('leagueName') && getFieldError('leagueName')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Update Match Details| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card
            title={
              <span>
                Edit Match Details:{' '}
                {this.state.feedMatchDetails &&
                  this.state.feedMatchDetails.matchId}
              </span>
            }
          >
            <FormItem
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title || ''}
              {...formItemLayout}
              label={<span>Title</span>}
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.subTitle ? 'error' : ''}
              help={errors.subTitle || ''}
              {...formItemLayout}
              label={<span>Sub Title</span>}
            >
              {getFieldDecorator('subTitle', {
                rules: [
                  {
                    required: false,
                    message: ' ',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.home ? 'error' : ''}
              help={errors.home || ''}
              {...formItemLayout}
              label={<span>Home</span>}
            >
              {getFieldDecorator('home', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.away ? 'error' : ''}
              help={errors.away || ''}
              {...formItemLayout}
              label={<span>Away</span>}
            >
              {getFieldDecorator('away', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.matchVenue ? 'error' : ''}
              help={errors.matchVenue || ''}
              {...formItemLayout}
              label={<span>Match Venue</span>}
            >
              {getFieldDecorator('matchVenue', {
                rules: [
                  {
                    required: false,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.leagueName ? 'error' : ''}
              help={errors.leagueName || ''}
              {...formItemLayout}
              label={<span>League Name</span>}
            >
              {getFieldDecorator('leagueName', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
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
    feedMatchDetails: state.superteamFeed.feedMatchDetails,
    updateFootballFeedMatchDetailResponse:
      state.superteamFeed.updateFootballFeedMatchDetailResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamFeedActions }, dispatch)
  };
}
const UpdateMatchDetailsForm = Form.create()(UpdateMatchDetails);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateMatchDetailsForm);
