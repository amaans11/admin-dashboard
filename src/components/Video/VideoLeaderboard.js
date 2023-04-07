// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as videoActions from '../../actions/videoActions';
import {
  Card,
  Row,
  Form,
  Col,
  Avatar,
  Icon,
  Tooltip,
  Popconfirm,
  InputNumber,
  Badge,
  DatePicker,
  Modal,
  Button,
  message
} from 'antd';
import GameplayVideoFilter from './GameplayVideoFilter';
import moment from 'moment';
const { Meta } = Card;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
// type VideoLeaderboard ={}
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class VideoLeaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      visible: false,
      confirmLoading: false
    };
  }

  showModal = video => {
    console.log(video);
    this.setState({
      visible: true,
      video
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        values.videoType = 'GAMEPLAY';
        values.tableId = this.state.video.videoDetails.id;
        if (values.timeArray) {
          values.startTime = moment(values.timeArray[0]).toISOString(true);
          values.endTime = moment(values.timeArray[1]).toISOString(true);
          delete values.timeArray;
        } else {
          values.startTime = moment().toISOString(true);
          values.endTime = moment()
            .add(4, 'years')
            .toISOString(true);
        }
        this.props.actions.addGameplayToFeaturedVideo(values).then(() => {
          this.setState({
            visible: false
          });
        });
      }
    });
  };
  changeStatus = video => {
    console.log(video);
    this.props.actions
      .changeStatus('BLOCK', video.videoDetails.id, 'GAMEPLAY', 'LEADERBOARD')
      .then(() => {
        message.success(
          'Video is blocked, it will be updated on next leaderboard',
          3
        );
      });
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false
    });
  };
  componentDidMount() {
    this.props.form.validateFields();
    // this.props.actions.getVideoLeaderboard().then(() => {
    //   console.log(this.props.video);
    //   console.log(this.state.showTable);
    //   this.setState({ showTable: true });
    // });
  }
  addFeaturedVideo = video => {
    this.props.actions.addFeaturedVideoAction(video, 'GAMEPLAY');
    this.props.history.push('/video/featured/add');
  };
  render() {
    function range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }

      return result;
    }
    function disabledRangeTime(dates, type) {
      if (type === 'start') {
        if (dates !== undefined && dates.length) {
          return {
            disabledHours:
              dates[0].format('DDMMYY') === moment().format('DDMMYY')
                ? disabledHours
                : () => [],
            disabledMinutes:
              dates[0].format('DDMMYY') === moment().format('DDMMYY')
                ? disabledMinutes
                : () => []
          };
        }
      }
    }
    function disabledHours() {
      return range(0, 24).splice(0, moment().hour());
    }
    function disabledMinutes(h) {
      if (h === moment().hour()) {
        return range(0, moment().minute());
      } else {
        return [];
      }
    }
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

    const indexError = isFieldTouched('index') && getFieldError('index');
    const timeArrayError =
      isFieldTouched('timeArray') && getFieldError('timeArray');
    return (
      <React.Fragment>
        <GameplayVideoFilter />
        <Row>
          {this.state.showTable
            ? this.props.video.lb.videos.map((video, index) => (
                <Col span={5} key={index} offset={1} style={{ marginTop: 30 }}>
                  <Badge count={index + 1}>
                    <Card
                      actions={[
                        <Tooltip title="Add to Feature Board">
                          <Button
                            icon="reconciliation"
                            onClick={() => this.showModal(video)}
                          />
                        </Tooltip>,
                        <Tooltip title="Block Video">
                          <Popconfirm
                            placement="bottom"
                            title="Are you sure？"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => this.changeStatus(video)}
                          >
                            <Button type="danger" icon="close" />
                          </Popconfirm>
                        </Tooltip>,
                        <Button icon="info" />
                      ]}
                      key={video.videoDetails.id}
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        <iframe
                          src={`https://www.facebook.com/plugins/video.php?href=${video.videoDetails.iframeSource}`}
                          scrolling="no"
                          frameBorder="0"
                          title={'iframe'}
                        />
                      }
                    >
                      <Meta
                        avatar={<Avatar src={video.avatar} />}
                        title={video.name}
                        description={
                          <span>
                            <span>{video.videoDetails.tournamentName}</span>
                            <div>
                              {video.reactionCount ? video.reactionCount : 0}
                              <Icon
                                style={{ marginLeft: 5 }}
                                type="heart"
                                theme="twoTone"
                                twoToneColor="#eb2f96"
                              />
                              <span> | Score </span>
                              {video.videoDetails.score}
                            </div>
                          </span>
                        }
                      />
                    </Card>
                  </Badge>
                </Col>
              ))
            : ''}
        </Row>
        <Modal
          width={700}
          style={{ height: 400 }}
          title="Add to Feature Board"
          onOk={this.handleOk}
          footer={null}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          visible={this.state.visible}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={timeArrayError ? 'error' : ''}
              help={timeArrayError || ''}
              {...formItemLayout}
              label={
                <span>
                  Duration For Video
                  <Tooltip title="Date and time for video to be shown on feature section">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('timeArray', {
                rules: [
                  {
                    required: false,
                    type: 'array',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(
                <RangePicker
                  disabledTime={disabledRangeTime}
                  allowClear="true"
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  format="YYYY-MM-DD hh:mm A"
                  placeholder={['Start Time', 'End Time']}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={indexError ? 'error' : ''}
              help={indexError || ''}
              {...formItemLayout}
              label={
                <span>
                  Index for Video
                  <Tooltip title="Reward amountv to be redeemable">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('index', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input Reward Amountn!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Add
            </Button>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    video: state.video
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(videoActions, dispatch)
  };
}
const VideoLeaderboardForm = Form.create()(VideoLeaderboard);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoLeaderboardForm);
