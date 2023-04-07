// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  Row,
  InputNumber,
  Alert,
  Select,
  Radio,
  Input,
  Tooltip,
  Col,
  Icon,
  Button
} from 'antd';

import * as limiterActions from '../../actions/limiterActions';
import * as gameActions from '../../actions/gameActions';
import * as tournamentActions from '../../actions/tournamentActions';
// import humanizeDuration from "humanize-duration";
const Option = Select.Option;
// type createLimiter ={}
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const COUNTRY_OPTIONS = ['GLOBAL', 'IN', 'ID', 'US'];

class createLimiter extends React.Component {
  state = {
    durationInfoVisible: false,
    humanDuration: '',
    durationbut1Focus: '',
    durationbut2Focus: '',
    durationbut3Focus: '',
    durationMin: 0,
    disableField: false,
    gameListOptions: [],
    styleList: [],
    countryOptions: COUNTRY_OPTIONS
  };
  componentDidMount() {
    this.props.form.validateFields();
    this.getGameList();
    this.getStyleList();
  }

  getGameList() {
    var gameList = [];
    if (!this.props.gameList && gameList.length === 0) {
      this.props.actions.getAllGames().then(() => {
        console.log('props>>>', this.props.gamesList);
        this.props.gamesList.map(game => {
          gameList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
        this.setState(
          {
            gameList: [...this.props.gamesList]
          },
          () => this.populateGameOptions('TOURNAMENT')
        );
      });
    }
  }

  getStyleList() {
    let styleList = [];
    this.props.actions.getStyles().then(() => {
      if (this.props.tournament.styles.length) {
        this.props.tournament.styles.map(style => {
          styleList.push(
            <Option key={style.name} value={style.name}>
              {style.name}
            </Option>
          );
        });
        this.setState({ styleList });
      }
    });
  }

  populateGameOptions(gameType) {
    let gameList = [...this.state.gameList];
    let gameListOptions = [];
    //Push an option for selecting All Games
    gameListOptions.push(
      <Option key={'game' + 0} value={0}>
        All Games
      </Option>
    );
    if (gameType === 'TOURNAMENT') {
      gameList.map(game => {
        if (!game.battleSupported) {
          gameListOptions.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        }
      });
    } else {
      gameList.map(game => {
        if (game.battleSupported) {
          gameListOptions.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        }
      });
    }
    this.setState({ gameListOptions });
  }

  tournamentTypeChanged(value) {
    this.populateGameOptions(value);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.active = false;
        delete values.durationRadio;
        delete values.tournamentType;
        this.props.actions.createLimiter(values).then(() => {
          this.props.history.push('/limiter/list');
        });
      }
    });
  };
  render() {
    const {
      durationInfoVisible,
      humanDuration,
      durationMin,
      countryOptions
    } = this.state;
    //////// Duration Checks///////////////////////////////////////
    const durationChange = e => {
      if (typeof e === 'number') {
        this.props.form.resetFields(['durationRadio']);
      }
    };
    const onDurationChange = e => {
      this.props.form.setFieldsValue({ periodInHours: e.target.value });

      this.setState({ durationInfoVisible: false });
    };

    // const durationInfoAlert = (e, ref) => {
    //   if (ref === "but") {
    //     this.setState({
    //       durationMin: e
    //     });
    //   }
    //   if (!durationInfoVisible) {
    //     this.setState({ durationInfoVisible: true });
    //   }

    //   this.setState({
    //     humanDuration: humanizeDuration(e, { delimiter: " and " }),
    //     durationMin: e
    //   });
    // };
    //////////////////////////////////////
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
    // Only show error after a field is touched.
    const nameError = isFieldTouched('name') && getFieldError('name');
    const styleError = isFieldTouched('style') && getFieldError('style');
    const currencyTypeError =
      isFieldTouched('currencyType') && getFieldError('currencyType');
    const periodInHoursError =
      isFieldTouched('periodInHours') && getFieldError('periodInHours');
    const moneyCurrencyAmountError =
      isFieldTouched('moneyCurrencyAmount') &&
      getFieldError('moneyCurrencyAmount');
    const limitError = isFieldTouched('limit') && getFieldError('limit');
    const gameIdError = isFieldTouched('gameId') && getFieldError('gameId');
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card bordered={false} title="Basic Details">
            <FormItem
              validateStatus={nameError ? 'error' : ''}
              help={nameError || ''}
              {...formItemLayout}
              label={
                <span>
                  Limiter Name
                  <Tooltip title="Name of the Limiter">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input name!',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={limitError ? 'error' : ''}
              help={limitError || ''}
              {...formItemLayout}
              label={
                <span>
                  Limit
                  <Tooltip title="Limit for the Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('limit', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please enter the limit fee!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={periodInHoursError ? 'error' : ''}
              help={periodInHoursError || ''}
              {...formItemLayout}
              label={
                <span>
                  Duration in Hours
                  <Tooltip title="Duration for which the tournament is active">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('periodInHours', {
                rules: [
                  {
                    required: !durationMin ? true : false,
                    type: 'number',
                    message: 'Please input time duration in numbers!',
                    whitespace: false
                  }
                ]
              })(
                <InputNumber
                  disabled={this.state.disableField}
                  min={1}
                  onChange={durationChange}
                />
              )}
            </FormItem>
            <Row>
              <Col offset={10}>
                <FormItem>
                  {getFieldDecorator(
                    'durationRadio',
                    {}
                  )(
                    <RadioGroup
                      disabled={this.state.disableField}
                      onChange={onDurationChange}
                    >
                      <RadioButton value={1}>1 Hour</RadioButton>
                      <RadioButton value={3}>3 Hours</RadioButton>
                      <RadioButton value={6}>6 Hours</RadioButton>
                      <RadioButton value={12}>12 Hours</RadioButton>
                      <RadioButton value={24}>24 Hour</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            {durationInfoVisible ? (
              <Alert message={humanDuration} type="info" showIcon />
            ) : (
              ''
            )}
            <FormItem
              validateStatus={currencyTypeError ? 'error' : ''}
              help={currencyTypeError || ''}
              {...formItemLayout}
              label={
                <span>
                  Entry Currency
                  <Tooltip title="Cash or Token">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('currencyType', {
                rules: [
                  {
                    required: true,
                    type: 'string',
                    message: 'Please select the Currency!',
                    whitespace: false
                  }
                ]
              })(
                <RadioGroup>
                  <Radio value="CASH">Cash</Radio>
                  <Radio value="TOKEN">Token</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={moneyCurrencyAmountError ? 'error' : ''}
              help={moneyCurrencyAmountError || ''}
              {...formItemLayout}
              label={
                <span>
                  Entry Fee
                  <Tooltip title="Entry Fee for the Tournament">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('moneyCurrencyAmount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please entry fee!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <FormItem
              validateStatus={styleError ? 'error' : ''}
              help={styleError || ''}
              {...formItemLayout}
              label={
                <span>
                  Tournament Style
                  <Tooltip title="Select card for Tournament Style">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('style', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: 'Please select card to display!'
                  }
                ],
                initialValue: 'NORMAL'
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a tournament style"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.styleList}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'Tournament Type'}>
              {getFieldDecorator('tournamentType', {
                rules: [
                  {
                    required: false,
                    type: 'string',
                    whitespace: false
                  }
                ],
                initialValue: 'TOURNAMENT'
              })(
                <RadioGroup
                  onChange={e => this.tournamentTypeChanged(e.target.value)}
                >
                  <Radio value="TOURNAMENT">Tournament</Radio>
                  <Radio value="BATTLE">Battle</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Country">
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: false,
                    type: 'string'
                  }
                ],
                initialValue: 'GLOBAL'
              })(
                <RadioGroup>
                  {countryOptions.map(cn => (
                    <Radio value={cn} key={cn}>
                      {cn}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              validateStatus={gameIdError ? 'error' : ''}
              help={gameIdError || ''}
              {...formItemLayout}
              label={<span>Game</span>}
            >
              {getFieldDecorator('gameId', {
                rules: [
                  {
                    type: 'number',
                    required: true,
                    message: 'Please select a game!'
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: 400 }}
                  placeholder="Select a game"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.gameListOptions}
                </Select>
              )}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Register
            </Button>
          </Card>
        </Form>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    limiter: state.limiter,
    gamesList: state.games.getAllGamesResponse,
    tournament: state.tournaments
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...limiterActions, ...gameActions, ...tournamentActions },
      dispatch
    )
  };
}

const createLimiterForm = Form.create()(createLimiter);
export default connect(mapStateToProps, mapDispatchToProps)(createLimiterForm);
