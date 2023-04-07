// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as hockeyActions from '../../actions/HockeyActions';
import {
  Card,
  Form,
  InputNumber,
  Badge,
  Popconfirm,
  Button,
  message,
  Row,
  Col,
  Radio
} from 'antd';
import moment from 'moment';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class SearchMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      searchType: 'MATCH_ID',
      matchDetail: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          matchId: values.searchType === 'MATCH_ID' ? values.matchId : null,
          feedMatchId:
            values.searchType === 'FEED_MATCH_ID' ? values.matchId : null,
          isSearchByMatchId: values.searchType === 'MATCH_ID' ? true : false,
          isSearchByFeedMatchId:
            values.searchType === 'FEED_MATCH_ID' ? true : false
        };
        this.props.actions.getMatchDetailById(data).then(() => {
          if (this.props.getMatchDetailByIdResponse) {
            if (_.isEmpty(this.props.getMatchDetailByIdResponse)) {
              message.error('No record found');
              this.setState({
                matchDetail: {},
                fetched: false
              });
            } else {
              this.setState({
                matchDetail: { ...this.props.getMatchDetailByIdResponse },
                fetched: true
              });
            }
          }
        });
      }
    });
  }

  updateMatchDetails() {
    let matchTime = moment(this.state.matchDetail.startTime);
    let startTime = matchTime.subtract(3, 'd').toDate();
    let endTime = matchTime.add(6, 'd').toDate();
    let data = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      leagueId: this.state.matchDetail.leagueId
        ? this.state.matchDetail.leagueId
        : '',
      matchId: this.state.matchDetail.seasonGameUid
    };
    this.props.actions.updateMatchDetails(data).then(() => {
      if (this.props.fantasy && this.props.fantasy.updateMatchDetailsResponse) {
        if (this.props.fantasy.updateMatchDetailsResponse.error) {
          message.error('Unable to update the match details');
        } else {
          message.success('Updated Successfully');
        }
      }
    });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        lg: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };

    const errors = {
      matchId: isFieldTouched('matchId') && getFieldError('matchId')
    };

    const matchDetail = this.state.matchDetail;

    return (
      <React.Fragment>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label={'Search Type'}>
              {getFieldDecorator('searchType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: this.state.searchType
              })(
                <RadioGroup name="type">
                  <Radio value={'MATCH_ID'}>MATCH ID</Radio>
                  <Radio value={'FEED_MATCH_ID'}>FEED MATCH ID</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.matchId ? 'error' : ''}
              help={errors.matchId || ''}
              {...formItemLayout}
              label={'Match Id'}
            >
              {getFieldDecorator('matchId', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please provide match id!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} style={{ width: '50%' }} />)}
            </FormItem>
            <Button
              type="primary"
              disabled={hasErrors(getFieldsError())}
              htmlType="submit"
            >
              Search
            </Button>
          </Form>
        </Card>
        {this.state.fetched && (
          <Card
            type="inner"
            title={
              <span>
                {' '}
                <Badge
                  count={'A'}
                  status={matchDetail.isActive ? 'processing' : 'error'}
                />
                {matchDetail.title} ({matchDetail.seasonGameUid})
              </span>
            }
            extra={
              <Popconfirm
                title="Sure to update the match details with data from vinfo?"
                onConfirm={() => this.updateMatchDetails()}
              >
                <Button>Update Match</Button>
              </Popconfirm>
            }
          >
            <Row>
              <Col span={12} style={{}}>
                Match Id: <strong>{matchDetail.seasonGameUid}</strong>
              </Col>
              <Col span={12} style={{}}>
                Feed Match Id: <strong>{matchDetail.feedGameUid}</strong>
              </Col>
              <Col span={12}>
                Match Registration Live Time:
                <strong
                  style={{
                    backgroundColor: moment(matchDetail.startTime).isSame(
                      moment(matchDetail.hardstopTime)
                    )
                      ? 'white'
                      : 'yellow'
                  }}
                >
                  {' '}
                  {moment(matchDetail.startTime).format('YYYY-MM-DD HH:mm')}
                </strong>
              </Col>
              <Col span={12}>
                Sub Title: <strong>{matchDetail.subTitle}</strong>
              </Col>
              <Col span={12}>
                Match Registration Start Time:{' '}
                <strong>
                  {' '}
                  {moment(matchDetail.foreshadowTime).format(
                    'YYYY-MM-DD HH:mm'
                  )}
                </strong>
              </Col>
              <Col span={12}>
                Match Venue: <strong>{matchDetail.matchVenue}</strong>
              </Col>
              <Col span={12}>
                Match Registration End Time:
                <strong
                  style={{
                    backgroundColor: moment(matchDetail.startTime).isSame(
                      moment(matchDetail.hardstopTime)
                    )
                      ? 'white'
                      : 'yellow'
                  }}
                >
                  {' '}
                  {moment(matchDetail.hardstopTime).format('YYYY-MM-DD HH:mm')}
                </strong>
              </Col>
              <Col span={12}>
                Teams Allowed: <strong>{matchDetail.teamsAllowed}</strong>
              </Col>
              <Col span={12}>
                Match Final Status:{' '}
                <strong>{matchDetail.matchFinalStatus}</strong>
              </Col>
              <Col span={12}>
                League Name: <strong>{matchDetail.leagueName}</strong>
              </Col>
              <Col span={12}>
                Order Id: <strong>{matchDetail.orderId}</strong>
              </Col>
            </Row>
          </Card>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fantasy: state.hockey,
    getMatchDetailByIdResponse: state.hockey.getMatchDetailByIdResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(hockeyActions, dispatch)
  };
}
const SearchMatchForm = Form.create()(SearchMatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchMatchForm);
