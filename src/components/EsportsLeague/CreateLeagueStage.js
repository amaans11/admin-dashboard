import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as esportsLeagueActions from '../../actions/esportsLeagueActions';
import * as gameActions from '../../actions/gameActions';
import moment from 'moment';
import _ from 'lodash';
import ImageUploader from './ImageUploader';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  notification,
  message,
  Input,
  InputNumber,
  Select,
  Radio,
  DatePicker,
  Spin,
  Table
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateLeagueStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      imageLoading: false,
      isInvalidExtraInfo: false,
      orgListFetched: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.form.validateFields();
    this.getAllLeagues();
    if (this.props.esportsLeagueStageDetails && this.props.editStageType) {
      let esportsLeagueStageDetails = {
        ...this.props.esportsLeagueStageDetails
      };
      this.setState(
        {
          editFlag: true
        },
        () => {
          this.props.form.setFieldsValue({
            name: esportsLeagueStageDetails.name,
            leagueId: esportsLeagueStageDetails.leagueId,
            parentStageId: esportsLeagueStageDetails.parentStageId
              ? esportsLeagueStageDetails.parentStageId
              : null,
            colorCode: esportsLeagueStageDetails.colorCode,
            startTime: moment(esportsLeagueStageDetails.startTime),
            endTime: moment(esportsLeagueStageDetails.endTime),
            stageType: esportsLeagueStageDetails.stageType,
            orgId: esportsLeagueStageDetails.orgId
              ? esportsLeagueStageDetails.orgId
              : null,
            active: esportsLeagueStageDetails.active
              ? esportsLeagueStageDetails.active
              : false,
            extraInfo: esportsLeagueStageDetails.extraInfo
          });
          if (esportsLeagueStageDetails.bgImageUrl) {
            this.copyBgImageUrl(esportsLeagueStageDetails.bgImageUrl);
          } else {
            this.setState({
              loadBgImageUrl: true
            });
          }
          if (esportsLeagueStageDetails.topImageUrl) {
            this.copyTopImageUrl(esportsLeagueStageDetails.topImageUrl);
          } else {
            this.setState({
              loadTopImageUrl: true
            });
          }
        }
      );
    } else {
      this.setState({
        loadBgImageUrl: true,
        loadTopImageUrl: true
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.clearLeagueStageForm();
  }

  getAllLeagues() {
    this.props.actions.getAllEsportsLeagues().then(() => {
      if (
        this.props.getAllEsportsLeagueResponse &&
        this.props.getAllEsportsLeagueResponse.epsortsLeague
      ) {
        let epsortsLeagueOptions = [];
        if (this.props.getAllEsportsLeagueResponse.epsortsLeague.length > 0) {
          this.props.getAllEsportsLeagueResponse.epsortsLeague.map(
            epsortsLeague => {
              epsortsLeagueOptions.push(
                <Option
                  key={'league' + epsortsLeague.id}
                  value={epsortsLeague.id}
                >
                  {epsortsLeague.name} ( {epsortsLeague.id} )
                </Option>
              );
            }
          );
          this.setState(
            {
              epsortsLeagueOptions,
              epsortsLeagueList: [
                ...this.props.getAllEsportsLeagueResponse.epsortsLeague
              ]
            },
            () => {
              if (this.props.editStageType) {
                this.leagueSelected(
                  this.props.esportsLeagueStageDetails.leagueId
                );
              }
            }
          );
        }
      }
    });
  }

  leagueSelected(leagueId) {
    let epsortsLeagueList = [...this.state.epsortsLeagueList];
    let gameTableData = [];
    let leagueData = _.find(epsortsLeagueList, { id: leagueId });
    _.forEach(leagueData.supportedGameIds, function(gameId) {
      let row = {
        gameId: gameId,
        tournamentId: ''
      };
      gameTableData.push(row);
    });

    if (this.props.editStageType) {
      let tournaments =
        this.props.esportsLeagueStageDetails.tournaments &&
        this.props.esportsLeagueStageDetails.tournaments.length > 0
          ? [...this.props.esportsLeagueStageDetails.tournaments]
          : [];
      _.forEach(tournaments, function(tournament) {
        let editIndex = _.findIndex(gameTableData, function(item) {
          return item.gameId === tournament.gameId;
        });
        if (editIndex !== -1) {
          gameTableData[editIndex].tournamentId = tournament.tournamentId
            ? tournament.tournamentId
            : '';
        }
      });
    }

    let stagesOrder = [];
    if (
      leagueData.extraInfo &&
      JSON.parse(leagueData.extraInfo).stagesOrder &&
      JSON.parse(leagueData.extraInfo).stagesOrder.length > 0
    ) {
      JSON.parse(leagueData.extraInfo).stagesOrder.map(stageType => {
        stagesOrder.push(
          <Option key={'stagesOrder' + stageType} value={stageType}>
            {stageType}
          </Option>
        );
      });
    } else {
      stagesOrder = [];
    }

    this.setState({
      gameTableData: [...gameTableData],
      parentStageOptions: [],
      parentListFetched: false,
      stagesOrder: stagesOrder
    });

    // stagesOrder

    let data = {
      leagueId: leagueId
    };
    this.props.actions.getEsportsStagesByLeagues(data).then(() => {
      if (
        this.props.getEsportsStagesByLeagueResponse &&
        this.props.getEsportsStagesByLeagueResponse.leagueStage &&
        this.props.getEsportsStagesByLeagueResponse.leagueStage.length > 0
      ) {
        let parentStageOptions = [];
        this.props.getEsportsStagesByLeagueResponse.leagueStage.map(
          leagueStage => {
            parentStageOptions.push(
              <Option
                key={'leagueStage' + leagueStage.id}
                value={leagueStage.id}
              >
                {leagueStage.name} ( {leagueStage.id} )
              </Option>
            );
          }
        );

        this.setState({ parentListFetched: true, parentStageOptions });
      }

      if (
        this.props.getEsportsStagesByLeagueResponse &&
        this.props.getEsportsStagesByLeagueResponse.orgs &&
        this.props.getEsportsStagesByLeagueResponse.orgs.length > 0
      ) {
        let orgOptions = [];
        this.props.getEsportsStagesByLeagueResponse.orgs.map(org => {
          orgOptions.push(
            <Option key={'org' + org.id} value={org.id}>
              {org.name} ( {org.id} )
            </Option>
          );
        });

        this.setState({ orgListFetched: true, orgOptions });
      } else {
        this.setState({ orgListFetched: false, orgOptions: [] });
      }
    });
  }

  updateTournament(value, record) {
    let gameTableData = [...this.state.gameTableData];
    let editIndex = _.findIndex(gameTableData, function(item) {
      return item.gameId === record.gameId;
    });
    gameTableData[editIndex].tournamentId = value;
    this.setState({ gameTableData: [...gameTableData] });
  }

  validateJson(value) {
    try {
      JSON.parse(value);
      this.setState({ isInvalidExtraInfo: false });
      return true;
    } catch (error) {
      this.setState({ isInvalidExtraInfo: true });
      notification['error']({
        message: 'Invalid Json',
        description: 'Json you entered is invalid',
        placement: 'topRight'
      });
      return false;
    }
  }

  copyBgImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewBgImageUrl: imageUrl,
      bgImageUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    this.setState({
      bgImageUrl: url,
      loadBgImageUrl: true
    });
  }

  copyTopImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewTopImageUrl: imageUrl,
      topImageUrlFileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    this.setState({
      topImageUrl: url,
      loadTopImageUrl: true
    });
  }

  uploadBgImageUrl = data => {
    this.setState({
      bgImageUrl: data && data.id ? data.id : ''
    });
  };

  uploadTopImageUrl = data => {
    this.setState({
      topImageUrl: data && data.id ? data.id : ''
    });
  };

  isImageLoading = data => {
    this.setState({
      imageLoading: data
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.state.bgImageUrl || this.state.bgImageUrl === '') {
          message.error('Please upload the bg image');
          return;
        }
        if (!this.state.topImageUrl || this.state.topImageUrl === '') {
          message.error('Please upload the top image');
          return;
        }
        let tournamentPresentFlag = true;
        let gameTableData = [...this.state.gameTableData];
        _.forEach(gameTableData, function(item) {
          if (!item.tournamentId) {
            tournamentPresentFlag = false;
          }
        });
        if (!tournamentPresentFlag) {
          message.error('Please enter tournament id for all the games');
          return;
        }

        let extraInfo =
          values.extraInfo === '{}' ? {} : JSON.parse(values.extraInfo);

        let data = {
          name: values.name,
          leagueId: values.leagueId,
          parentStageId: values.parentStageId ? values.parentStageId : 0,
          topImageUrl: this.state.topImageUrl,
          bgImageUrl: this.state.bgImageUrl,
          colorCode: values.colorCode,
          startTime: moment(values.startTime).toISOString(true),
          endTime: moment(values.endTime).toISOString(true),
          tournaments: [...this.state.gameTableData],
          extraInfo: JSON.stringify(extraInfo),
          stageType: values.stageType,
          active: values.active,
          orgId: values.orgId,
          id:
            this.props.esportsLeagueStageDetails &&
            this.props.esportsLeagueStageDetails.id
              ? this.props.esportsLeagueStageDetails.id
              : null
        };

        this.props.actions.createOrUpdateLeagueStage(data).then(() => {
          if (
            this.props.createUpdateLeagueStageResponse &&
            this.props.createUpdateLeagueStageResponse.error
          ) {
            if (this.props.createUpdateLeagueStageResponse.error.message) {
              message.error(
                this.props.createUpdateLeagueStageResponse.error.message
              );
              return;
            } else {
              message.error('Could not create the league');
              return;
            }
          } else {
            this.props.history.push('/esports/list-league-stage');
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

    const columns = [
      {
        title: 'Game Id',
        dataIndex: 'gameId',
        key: 'gameId'
      },
      {
        title: 'Tournament Id',
        key: 'tournamentId',
        render: (text, record) => (
          <InputNumber
            style={{ width: 400 }}
            onChange={e => this.updateTournament(e, record)}
            value={record.tournamentId}
          />
        )
      }
    ];

    const errors = {
      name: isFieldTouched('name') && getFieldError('name'),
      leagueId: isFieldTouched('leagueId') && getFieldError('leagueId'),
      parentStageId:
        isFieldTouched('parentStageId') && getFieldError('parentStageId'),
      colorCode: isFieldTouched('colorCode') && getFieldError('colorCode'),
      startTime: isFieldTouched('startTime') && getFieldError('startTime'),
      endTime: isFieldTouched('endTime') && getFieldError('endTime'),
      extraInfo: isFieldTouched('extraInfo') && getFieldError('extraInfo'),
      stageType: isFieldTouched('stageType') && getFieldError('stageType'),
      orgId: isFieldTouched('orgId') && getFieldError('orgId'),
      active: isFieldTouched('active') && getFieldError('active')
    };

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="League">
            <FormItem
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name || ''}
              {...formItemLayout}
              label={<span>Name</span>}
            >
              {getFieldDecorator('name', {
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
              validateStatus={errors.leagueId ? 'error' : ''}
              help={errors.leagueId || ''}
              {...formItemLayout}
              label={<span>League</span>}
            >
              {getFieldDecorator('leagueId', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true,
                    type: 'number'
                  }
                ]
              })(
                <Select
                  disabled={this.state.editFlag}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select a league"
                  optionFilterProp="children"
                  onChange={e => this.leagueSelected(e)}
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.epsortsLeagueOptions}
                </Select>
              )}
            </FormItem>
            {this.state.parentListFetched && (
              <FormItem
                validateStatus={errors.parentStageId ? 'error' : ''}
                help={errors.parentStageId || ''}
                {...formItemLayout}
                label={<span>Parent Stage</span>}
              >
                {getFieldDecorator('parentStageId', {
                  rules: [
                    {
                      required: false,
                      message: 'This is a mandatory field',
                      whitespace: true,
                      type: 'number'
                    }
                  ]
                })(
                  <Select
                    disabled={this.state.editFlag}
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select a parent"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.parentStageOptions}
                  </Select>
                )}
              </FormItem>
            )}
            <FormItem
              validateStatus={errors.colorCode ? 'error' : ''}
              help={errors.colorCode || ''}
              {...formItemLayout}
              label={<span>Color Code</span>}
            >
              {getFieldDecorator('colorCode', {
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
              validateStatus={errors.startTime ? 'error' : ''}
              help={errors.startTime || ''}
              {...formItemLayout}
              label={'Start Time'}
            >
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field!',
                    whitespace: true,
                    type: 'object'
                  }
                ]
              })(
                <DatePicker
                  disabled={this.state.editFlag}
                  style={{ width: '300px' }}
                  format="DD-MMM-YYYY HH:mm:ss"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.endTime ? 'error' : ''}
              help={errors.endTime || ''}
              {...formItemLayout}
              label={'End Time'}
            >
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field!',
                    whitespace: true,
                    type: 'object'
                  }
                ]
              })(
                <DatePicker
                  disabled={this.state.editFlag}
                  style={{ width: '300px' }}
                  format="DD-MMM-YYYY HH:mm:ss"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              )}
            </FormItem>
            {/* <FormItem
              validateStatus={errors.stageType ? 'error' : ''}
              help={errors.stageType || ''}
              {...formItemLayout}
              label={<span>Stage Type</span>}
            >
              {getFieldDecorator('stageType', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem> */}
            <FormItem
              validateStatus={errors.stageType ? 'error' : ''}
              help={errors.stageType || ''}
              {...formItemLayout}
              label={<span>Stage Type</span>}
            >
              {getFieldDecorator('stageType', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select a stage type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.stagesOrder}
                </Select>
              )}
            </FormItem>
            {this.state.orgListFetched && (
              <FormItem
                validateStatus={errors.orgId ? 'error' : ''}
                help={errors.orgId || ''}
                {...formItemLayout}
                label={<span>Org</span>}
              >
                {getFieldDecorator('orgId', {
                  rules: [
                    {
                      required: false,
                      message: 'This is a mandatory field',
                      whitespace: true,
                      type: 'number'
                    }
                  ]
                })(
                  <Select
                    disabled={this.state.editFlag}
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select an org"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.orgOptions}
                  </Select>
                )}
              </FormItem>
            )}
            <FormItem
              validateStatus={errors.active ? 'error' : ''}
              help={errors.active || ''}
              {...formItemLayout}
              label={'Active'}
            >
              {getFieldDecorator('active', {
                rules: [
                  {
                    required: true,
                    message: 'Please select'
                  }
                ],
                initialValue: false
              })(
                <RadioGroup>
                  <Radio value={false}>No</Radio>
                  <Radio value={true}>Yes</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={
                errors.extraInfo || this.state.isInvalidExtraInfo ? 'error' : ''
              }
              help={errors.extraInfo || ''}
              {...formItemLayout}
              label={<span>Entra Info</span>}
            >
              {getFieldDecorator('extraInfo', {
                rules: [
                  {
                    required: false,
                    message: 'Please extra info',
                    whitespace: true
                  }
                ],
                initialValue: '{}'
              })(
                <TextArea
                  // style={{ width: '70%' }}
                  disabled={this.state.editFlag}
                  onBlur={e => this.validateJson(e.target.value)}
                  rows={3}
                />
              )}
            </FormItem>
            {this.state.gameTableData && this.state.gameTableData.length > 0 && (
              <Card type="inner">
                <Table
                  rowKey="gameId"
                  bordered
                  pagination={false}
                  dataSource={this.state.gameTableData}
                  columns={columns}
                />
              </Card>
            )}
            <Row>
              {this.state.loadBgImageUrl && (
                <Col span={6} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.uploadBgImageUrl}
                    header={'Bg Image Url'}
                    actions={this.props.actions}
                    previewImage={this.state.previewBgImageUrl}
                    fileList={this.state.bgImageUrlFileList}
                    isMandatory={true}
                    isLoading={this.isImageLoading}
                  />
                </Col>
              )}
              {this.state.loadTopImageUrl && (
                <Col span={6} offset={3}>
                  <ImageUploader
                    callbackFromParent={this.uploadTopImageUrl}
                    header={'Top Image Url'}
                    actions={this.props.actions}
                    previewImage={this.state.previewTopImageUrl}
                    fileList={this.state.topImageUrlFileList}
                    isMandatory={true}
                    isLoading={this.isImageLoading}
                  />
                </Col>
              )}
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <Spin spinning={this.state.imageLoading}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      hasErrors(getFieldsError()) || this.state.imageLoading
                    }
                  >
                    Submit
                  </Button>
                </Spin>
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
    esportsLeagueStageDetails: state.esports.esportsLeagueStageDetails,
    editStageType: state.esports.editStageType,
    createUpdateLeagueStageResponse:
      state.esports.createUpdateLeagueStageResponse,
    getAllEsportsLeagueResponse: state.esports.getAllEsportsLeagueResponse,
    getEsportsStagesByLeagueResponse:
      state.esports.getEsportsStagesByLeagueResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...esportsLeagueActions, ...gameActions },
      dispatch
    )
  };
}
const CreateLeagueStageForm = Form.create()(CreateLeagueStage);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateLeagueStageForm);
