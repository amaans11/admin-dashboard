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
import { convertByteToSize } from '../../shared/util';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateLeague extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: false,
      imageLoading: false,
      isInvalidExtraInfo: false,
      items: [],
      isJsonVerified: {
        leagueFormat: true,
        leagueRules: true,
        leagueFAQS: true,
        pointsSection: true,
        pointsSection: true,
        prizesInfo: true
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.form.validateFields();
    this.getGamesList();
    if (this.props.esportsLeagueDetails && this.props.editType) {
      let esportsLeagueDetails = { ...this.props.esportsLeagueDetails };
      let extraInfo = { ...JSON.parse(esportsLeagueDetails.extraInfo) };
      this.setState(
        {
          items:
            esportsLeagueDetails.item && esportsLeagueDetails.item.length > 0
              ? [...esportsLeagueDetails.item]
              : [],
          editFlag: true
        },
        () => {
          this.props.form.setFieldsValue(
            {
              name: esportsLeagueDetails.name,
              header: esportsLeagueDetails.header,
              subHeader: esportsLeagueDetails.subHeader,
              entryFee: esportsLeagueDetails.entryFee
                ? esportsLeagueDetails.entryFee
                : 0,
              supportedGameIds: [...esportsLeagueDetails.supportedGameIds],
              registrationStartTime: moment(
                esportsLeagueDetails.registrationStartTime
              ),
              registrationEndTime: moment(
                esportsLeagueDetails.registrationEndTime
              ),
              leagueFormat: JSON.stringify(extraInfo.leagueFormat),
              leagueRules: JSON.stringify(extraInfo.leagueRules),
              leagueFAQS: JSON.stringify(extraInfo.leagueFAQS),
              pointsSection: JSON.stringify(extraInfo.pointsSection),
              prizesInfo: JSON.stringify(extraInfo.prizesInfo)
              // extraInfo: esportsLeagueDetails.extraInfo
            },
            () => {
              delete extraInfo.leagueFormat;
              delete extraInfo.leagueRules;
              delete extraInfo.leagueFAQS;
              delete extraInfo.pointsSection;
              delete extraInfo.prizesInfo;
              this.props.form.setFieldsValue({
                extraInfo: JSON.stringify(extraInfo)
              });
            }
          );
          if (esportsLeagueDetails.bgImageUrl) {
            this.copyBgImageUrl(esportsLeagueDetails.bgImageUrl);
          } else {
            this.setState({
              loadBgImageUrl: true
            });
          }
        }
      );
    } else {
      this.setState({
        loadBgImageUrl: true
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.clearEsportsForm();
  }

  getGamesList() {
    var gamesList = [];
    this.props.actions.fetchGames().then(() => {
      if (this.props.gamesList) {
        this.props.gamesList.map(game => {
          gamesList.push(
            <Option key={'game' + game.id} value={game.id}>
              {game.name} ( {game.id} )
            </Option>
          );
        });
      }
    });
    this.setState({
      gamesList
    });
  }

  gameSelected(value) {
    if (value.length >= 4) {
      message.info('Max level Reached');
    }
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

  jsonCheck(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      message.error('Invalid JSON object', 1);
      return false;
    }
  }

  verifyJsonInput(value, configType) {
    let isJsonFlag = false;
    if (value === null || value === '') {
      isJsonFlag = false;
    } else {
      isJsonFlag = this.jsonCheck(value);
    }
    let isJsonVerified = { ...this.state.isJsonVerified };
    switch (configType) {
      case 'leagueFormat':
        isJsonVerified.leagueFormat = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'leagueRules':
        isJsonVerified.leagueRules = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'leagueFAQS':
        isJsonVerified.leagueFAQS = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'pointsSection':
        isJsonVerified.pointsSection = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      case 'prizesInfo':
        isJsonVerified.prizesInfo = isJsonFlag;
        this.setState({ isJsonVerified: { ...isJsonVerified } });
        break;
      default:
        break;
    }
  }

  updateItemCount(value) {
    this.setState({ itemCount: value });
  }

  updateItemName(value) {
    this.setState({ itemName: value });
  }

  addItem() {
    let { itemName, itemCount, items } = this.state;
    let row = {
      name: itemName,
      count: itemCount
    };
    items.push(row);
    this.setState({ items, itemName: '', itemCount: 0 }, () => {
      this.props.form.setFieldsValue({ itemName: '', itemCount: 0 });
    });
  }

  removeItem(record) {
    let items = [...this.state.items];
    items = _.filter(items, function(item) {
      return item.name !== record.name;
    });
    this.setState({
      items
    });
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

  uploadBgImageUrl = data => {
    this.setState({
      bgImageUrl: data && data.id ? data.id : ''
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
          message.error('Please upload the image');
          return;
        }
        if (values.supportedGameIds.length > 4) {
          message.error('Maximum games allowed is 4');
          return;
        }
        if (this.state.items.length > 4) {
          message.error('Maximum items allowed is 4');
          return;
        }

        let extraInfo =
          values.extraInfo === '{}' ? {} : JSON.parse(values.extraInfo);
        extraInfo['leagueFormat'] = JSON.parse(values.leagueFormat);
        extraInfo['leagueRules'] = JSON.parse(values.leagueRules);
        extraInfo['leagueFAQS'] = JSON.parse(values.leagueFAQS);
        extraInfo['pointsSection'] = JSON.parse(values.pointsSection);
        extraInfo['prizesInfo'] = JSON.parse(values.prizesInfo);

        let data = {
          name: values.name,
          bgImageUrl: this.state.bgImageUrl,
          header: values.header,
          subHeader: values.subHeader,
          items:
            this.state.items && this.state.items.length > 0
              ? [...this.state.items]
              : [],
          entryFee: values.entryFee,
          registrationStartTime: moment(
            values.registrationStartTime
          ).toISOString(true),
          registrationEndTime: moment(values.registrationEndTime).toISOString(
            true
          ),
          supportedGameIds: [...values.supportedGameIds],
          extraInfo: JSON.stringify(extraInfo),
          id:
            this.props.esportsLeagueDetails &&
            this.props.esportsLeagueDetails.id
              ? this.props.esportsLeagueDetails.id
              : null
        };

        this.props.actions.createOrUpdateEsportsLeague(data).then(() => {
          if (
            this.props.createUpdateEsportsLeagueResponse &&
            this.props.createUpdateEsportsLeagueResponse.error
          ) {
            if (this.props.createUpdateEsportsLeagueResponse.error.message) {
              message.error(
                this.props.createUpdateEsportsLeagueResponse.error.message
              );
              return;
            } else {
              message.error('Could not create the league');
              return;
            }
          } else {
            this.props.history.push('/esports/list-league');
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

    const itemColumns = [
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button
              onClick={() => this.removeItem(record)}
              shape="circle"
              icon="delete"
              type="danger"
            />
          </span>
        )
      }
    ];

    const errors = {
      name: isFieldTouched('name') && getFieldError('name'),
      header: isFieldTouched('header') && getFieldError('header'),
      subHeader: isFieldTouched('subHeader') && getFieldError('subHeader'),
      entryFee: isFieldTouched('entryFee') && getFieldError('entryFee'),
      registrationStartTime:
        isFieldTouched('registrationStartTime') &&
        getFieldError('registrationStartTime'),
      registrationEndTime:
        isFieldTouched('registrationEndTime') &&
        getFieldError('registrationEndTime'),
      extraInfo: isFieldTouched('extraInfo') && getFieldError('extraInfo'),
      numberOfItems:
        isFieldTouched('numberOfItems') && getFieldError('numberOfItems')
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
              validateStatus={errors.header ? 'error' : ''}
              help={errors.header || ''}
              {...formItemLayout}
              label={<span>Header</span>}
            >
              {getFieldDecorator('header', {
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
              validateStatus={errors.subHeader ? 'error' : ''}
              help={errors.subHeader || ''}
              {...formItemLayout}
              label={<span>Sub Header</span>}
            >
              {getFieldDecorator('subHeader', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <Card type="inner">
              <Row>
                <Col span={24}>
                  <Col span={10}>
                    <FormItem
                      validateStatus={errors.itemCount ? 'error' : ''}
                      help={errors.itemCount || ''}
                      {...formItemLayout}
                      label={<span>Item Count</span>}
                    >
                      {getFieldDecorator('itemCount', {
                        rules: [
                          {
                            required: false,
                            message: 'This is a mandatory field',
                            whitespace: false,
                            type: 'number'
                          }
                        ]
                      })(
                        <InputNumber
                          onChange={e => this.updateItemCount(e)}
                          style={{ width: '300px' }}
                          min={0}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem
                      validateStatus={errors.itemName ? 'error' : ''}
                      help={errors.itemName || ''}
                      {...formItemLayout}
                      label={<span>Name</span>}
                    >
                      {getFieldDecorator('itemName', {
                        rules: [
                          {
                            required: false,
                            message: 'This is a mandatory field',
                            whitespace: true
                          }
                        ]
                      })(
                        <Input
                          onChange={e => this.updateItemName(e.target.value)}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <Button onClick={() => this.addItem()}>Add Item</Button>
                  </Col>
                </Col>
              </Row>
              <Table
                rowKey="name"
                bordered
                pagination={false}
                dataSource={this.state.items}
                columns={itemColumns}
              />
            </Card>
            <FormItem
              validateStatus={errors.entryFee ? 'error' : ''}
              help={errors.entryFee || ''}
              {...formItemLayout}
              label={<span>Entry Fee</span>}
            >
              {getFieldDecorator('entryFee', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: false,
                    type: 'number'
                  }
                ]
              })(
                <InputNumber
                  disabled={this.state.editFlag}
                  style={{ width: '300px' }}
                  min={0}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.registrationStartTime ? 'error' : ''}
              help={errors.registrationStartTime || ''}
              {...formItemLayout}
              label={'Registration Start Time'}
            >
              {getFieldDecorator('registrationStartTime', {
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
              validateStatus={errors.registrationEndTime ? 'error' : ''}
              help={errors.registrationEndTime || ''}
              {...formItemLayout}
              label={'Registration End Time'}
            >
              {getFieldDecorator('registrationEndTime', {
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
              validateStatus={errors.supportedGameIds ? 'error' : ''}
              help={errors.supportedGameIds || ''}
              {...formItemLayout}
              label={<span>Supported Game Ids</span>}
            >
              {getFieldDecorator('supportedGameIds', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true,
                    type: 'array'
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  disabled={this.state.editFlag}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select games"
                  optionFilterProp="children"
                  onChange={e => this.gameSelected(e)}
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.gamesList}
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={
                !this.state.isJsonVerified.leagueFormat ? 'error' : ''
              }
              help={!this.state.isJsonVerified.leagueFormat || ''}
              {...formItemLayout}
              label={'League Format'}
            >
              {getFieldDecorator('leagueFormat', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter a valid json object',
                    whitespace: true
                  }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder="League format"
                  onBlur={e =>
                    this.verifyJsonInput(e.target.value, 'leagueFormat')
                  }
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={
                !this.state.isJsonVerified.leagueRules ? 'error' : ''
              }
              help={!this.state.isJsonVerified.leagueRules || ''}
              {...formItemLayout}
              label={'League Rules'}
            >
              {getFieldDecorator('leagueRules', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter a valid json object',
                    whitespace: true
                  }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder="League Rules"
                  onBlur={e =>
                    this.verifyJsonInput(e.target.value, 'leagueRules')
                  }
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={
                !this.state.isJsonVerified.leagueFAQS ? 'error' : ''
              }
              help={!this.state.isJsonVerified.leagueFAQS || ''}
              {...formItemLayout}
              label={'League FAQs'}
            >
              {getFieldDecorator('leagueFAQS', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter a valid json object',
                    whitespace: true
                  }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder="League FAQs"
                  onBlur={e =>
                    this.verifyJsonInput(e.target.value, 'leagueFAQS')
                  }
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={
                !this.state.isJsonVerified.pointsSection ? 'error' : ''
              }
              help={!this.state.isJsonVerified.pointsSection || ''}
              {...formItemLayout}
              label={'Points Section'}
            >
              {getFieldDecorator('pointsSection', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter a valid json object',
                    whitespace: true
                  }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder="Points Section"
                  onBlur={e =>
                    this.verifyJsonInput(e.target.value, 'pointsSection')
                  }
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={
                !this.state.isJsonVerified.prizesInfo ? 'error' : ''
              }
              help={!this.state.isJsonVerified.prizesInfo || ''}
              {...formItemLayout}
              label={'Prizes Info'}
            >
              {getFieldDecorator('prizesInfo', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter a valid json object',
                    whitespace: true
                  }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder="Prizes Info"
                  onBlur={e =>
                    this.verifyJsonInput(e.target.value, 'prizesInfo')
                  }
                />
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
                  onBlur={e => this.validateJson(e.target.value)}
                  rows={3}
                />
              )}
            </FormItem>
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
    gamesList: state.games.allGames,
    esportsLeagueDetails: state.esports.esportsLeagueDetails,
    editType: state.esports.editType,
    createUpdateEsportsLeagueResponse:
      state.esports.createUpdateEsportsLeagueResponse
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
const CreateLeagueForm = Form.create()(CreateLeague);
export default connect(mapStateToProps, mapDispatchToProps)(CreateLeagueForm);
