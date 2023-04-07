import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {
  Card,
  Form,
  message,
  Button,
  Spin,
  Radio,
  Select,
  Table,
  Modal,
  DatePicker,
  Input,
  InputNumber,
  Popconfirm,
  Tag,
  Row,
  Col,
  Switch
} from 'antd';
import * as superteamCricketFeedActions from '../../actions/SuperteamCricketFeedActions';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class SuperteamFantasyAssistant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      matchList: [],
      matchListFetched: false,
      matchDisplayList: [],
      isAdmin: false,
      matchDetail: {},
      internalAssistantDetail: {},
      isInternalAssistantModel: false,
      searchType: 'DATE'
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (
      this.props.currentUser.user_role.includes('SUPER_ADMIN') ||
      this.props.currentUser.user_role.includes('FANTASY_ADMIN')
    ) {
      this.setState({ isAdmin: true });
    } else {
      this.setState({ isAdmin: false });
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.searchType == 'DATE') {
          let data = {
            startTime: moment(values.timeArray[0]).format('YYYY-MM-DD'),
            endTime: moment(values.timeArray[1]).format('YYYY-MM-DD')
          };
          this.props.actions
            .getFantasyAssistantMatchDetailByDate(data)
            .then(() => {
              if (
                this.props.getAssistantMatchResponse &&
                this.props.getAssistantMatchResponse.assistantMatchDetail &&
                this.props.getAssistantMatchResponse.assistantMatchDetail
                  .length > 0
              ) {
                this.setState({
                  matchList: [
                    ...this.props.getAssistantMatchResponse.assistantMatchDetail
                  ],
                  matchDisplayList: [
                    ...this.props.getAssistantMatchResponse.assistantMatchDetail
                  ],
                  matchListFetched: true
                });
              } else {
                message.info('No records found');
                this.setState({
                  matchList: [],
                  matchListFetched: true,
                  matchDisplayList: []
                });
              }
            });
        } else {
          this.props.actions
            .getFantasyAssistantMatchDetailById({ matchId: values.matchId })
            .then(() => {
              if (
                this.props.getAssistantMatchDetailResponse &&
                this.props.getAssistantMatchDetailResponse
                  .assistantMatchDetail &&
                this.props.getAssistantMatchDetailResponse.assistantMatchDetail
                  .length > 0
              ) {
                this.setState({
                  matchList: [
                    ...this.props.getAssistantMatchDetailResponse
                      .assistantMatchDetail
                  ],
                  matchDisplayList: [
                    ...this.props.getAssistantMatchDetailResponse
                      .assistantMatchDetail
                  ],
                  matchListFetched: true
                });
              } else {
                message.info('No records found');
                this.setState({
                  matchList: [],
                  matchListFetched: true,
                  matchDisplayList: []
                });
              }
            });
        }
      }
    });
  }
  setInternalAssistant(record) {
    this.setState({
      internalAssistantDetail: {
        ...JSON.parse(record.extraInfo),
        assistantMatchId: record.matchId
      },
      isInternalAssistantModel: true
    });
  }
  closeInternalAssistanModal() {
    this.setState({
      isInternalAssistantModel: false,
      internalAssistantDetail: {}
    });
  }
  handleSubmitInternalAssistant() {
    this.props.actions
      .createInternalFantasyAssistant(this.state.internalAssistantDetail)
      .then(() => {
        message.info('Success');
        this.setState({
          isInternalAssistantModel: false
        });
      });
  }
  internalAssistantChanged(value, name) {
    this.setState({
      internalAssistantDetail: {
        ...this.state.internalAssistantDetail,
        [name]: value
      }
    });
  }
  searchTypeSelected(value) {
    this.setState({
      searchType: value
    });
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

    const columns = [
      {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId'
      },
      {
        title: 'Away Team Name',
        dataIndex: 'awayTeamName',
        key: 'awayTeamName'
      },
      {
        title: 'Home Team Name',
        dataIndex: 'homeTeamName',
        key: 'homeTeamName'
      },
      {
        title: 'Match Date',
        dataIndex: 'matchDate',
        key: 'matchDate'
      },
      {
        title: 'Series Name',
        dataIndex: 'seriesName',
        key: 'seriesName'
      },
      {
        title: 'Extra Info',
        dataIndex: 'extraInfo',
        key: 'extraInfo'
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.setInternalAssistant(record)}
              type="primary"
              size="small"
            >
              Internal Fantasy
            </Button>
          </span>
        )
      }
    ];
    const errors = {
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray'),
      searchType: isFieldTouched('searchType') && getFieldError('searchType'),
      matchID: isFieldTouched('matchId') && getFieldError('matchId')
    };

    return (
      <React.Fragment>
        <Card title="Fantasy Assistant">
          <Form onSubmit={e => this.handleSubmit(e)}>
            <FormItem {...formItemLayout} label={'Search Type'}>
              {getFieldDecorator('searchType', {
                rules: [
                  {
                    required: true
                  }
                ],
                initialValue: this.state.searchType
              })(
                <RadioGroup
                  name="searchType"
                  onChange={e => this.searchTypeSelected(e.target.value)}
                >
                  <Radio value={'DATE'}>DATE</Radio>
                  <Radio value={'ID'}>ID</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {this.state.searchType == 'DATE' ? (
              <FormItem
                validateStatus={errors.timeArray ? 'error' : ''}
                help={errors.timeArray || ''}
                {...formItemLayout}
                label={'Duration'}
              >
                {getFieldDecorator('timeArray', {
                  rules: [
                    {
                      required: true,
                      type: 'array',
                      message: 'Please input time duration!',
                      whitespace: false
                    }
                  ]
                })(
                  <RangePicker
                    allowClear="true"
                    format="YYYY-MM-DD"
                    placeholder={['Start Date', 'End Date']}
                  />
                )}
              </FormItem>
            ) : (
              <FormItem
                validateStatus={errors.matchId ? 'error' : ''}
                help={errors.matchId || ''}
                label={'Match Id'}
                {...formItemLayout}
              >
                {getFieldDecorator('matchId', {
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: 'Please input Match ID!'
                    }
                  ]
                })(<InputNumber style={{ width: '50%' }} min={0} />)}
              </FormItem>
            )}

            <Button type="primary" htmlType="submit">
              Get Matches
            </Button>
          </Form>
        </Card>
        {this.state.matchListFetched && (
          <Card title={'Match List'}>
            <Table
              rowKey="id"
              bordered
              pagination={false}
              dataSource={this.state.matchDisplayList}
              columns={columns}
              rowClassName={(record, index) =>
                record.isVerified && record.verificationLevel === 2
                  ? 'highlight-contest-row'
                  : ''
              }
              scroll={{ x: '100%' }}
            />
          </Card>
        )}
        <Modal
          title={'Create Internal Assistant'}
          closable={true}
          maskClosable={true}
          width={1100}
          onCancel={() => this.closeInternalAssistanModal()}
          visible={this.state.isInternalAssistantModel}
          footer={[
            <Button
              key="editBack"
              onClick={() => this.closeInternalAssistanModal()}
            >
              Close
            </Button>,
            <Button
              type="primary"
              key="save"
              onClick={() => this.handleSubmitInternalAssistant()}
            >
              Submit
            </Button>
          ]}
        >
          <Card>
            <Row>
              <Col span={24} style={{ margin: '5px' }}>
                <Col span={6}>
                  <strong>Match Id</strong>
                </Col>
                <Col span={18}>
                  <Input
                    disabled
                    style={{ width: '60%' }}
                    type={'number'}
                    value={this.state.internalAssistantDetail.assistantMatchId}
                    placeholder={'Match Id'}
                    onChange={e =>
                      this.internalAssistantChanged(
                        e.target.value,
                        'assistantMatchId'
                      )
                    }
                  />
                </Col>
              </Col>

              <Col span={24} style={{ margin: '5px' }}>
                <Col span={6}>
                  <strong>Good For</strong>
                </Col>
                <Col span={18}>
                  <Select
                    style={{ width: '60%' }}
                    value={this.state.internalAssistantDetail.goodFor}
                    placeholder={'Good For'}
                    onChange={e => this.internalAssistantChanged(e, 'goodFor')}
                  >
                    <Option value="Pacers">Pacers</Option>
                    <Option value="Spinners">Spinners</Option>
                  </Select>
                </Col>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <Col span={6}>
                  <strong>Average Score</strong>
                </Col>
                <Col span={18}>
                  <Input
                    type={'number'}
                    style={{ width: '60%' }}
                    value={this.state.internalAssistantDetail.averageScore}
                    placeholder={'Average Score'}
                    onChange={e =>
                      this.internalAssistantChanged(
                        e.target.value,
                        'averageScore'
                      )
                    }
                  />
                </Col>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <Col span={6}>
                  <strong>Pitch Behaviour</strong>
                </Col>
                <Col span={18}>
                  <Select
                    style={{ width: '60%' }}
                    value={this.state.internalAssistantDetail.pitchBehaviour}
                    placeholder={'Pitch Behaviour'}
                    onChange={e =>
                      this.internalAssistantChanged(e, 'pitchBehaviour')
                    }
                  >
                    <Option value="Batting">Batting</Option>
                    <Option value="Bowling">Bowling</Option>
                    <Option value="Balanced">Balanced</Option>
                  </Select>
                </Col>
              </Col>
              <Col span={24} style={{ margin: '5px' }}>
                <Col span={6}>
                  <strong>Batting First Win Ratio (%)</strong>
                </Col>
                <Col span={18}>
                  <Input
                    style={{ width: '60%' }}
                    value={
                      this.state.internalAssistantDetail.battingFirstWinRatio
                    }
                    placeholder={'Win Ration'}
                    onChange={e =>
                      this.internalAssistantChanged(
                        e.target.value,
                        'battingFirstWinRatio'
                      )
                    }
                  />
                </Col>
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getAssistantMatchResponse:
      state.superteamCricketFeed.getAssistantMatchResponse,
    getAssistantMatchDetailResponse:
      state.superteamCricketFeed.getAssistantMatchDetailResponse,
    currentUser: state.auth.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamCricketFeedActions }, dispatch)
  };
}

const SuperteamFantasyAssistantForm = Form.create()(SuperteamFantasyAssistant);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuperteamFantasyAssistantForm);
