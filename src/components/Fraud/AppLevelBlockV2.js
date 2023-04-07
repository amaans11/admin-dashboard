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
import * as gameActions from '../../actions/gameActions';
import * as userDataActions from '../../actions/userDataActions';
import UploadProofFile from './UploadProofFile';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

const FraudCheckCategoriesPermanent = ['DASHBOARD_BLOCKED'].map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));

const FraudCheckCategories = [
  'GENERIC',
  'GAME SCORE MODIFICATION',
  'GAME FIELD MODIFICATION',
  'TIME MODIFICATION',
  'SCORE SEQUENCE MODIFICATION',
  'RESULT MODIFICATION',
  'FAKE KYC',
  'CYBER CRIME',
  'PAYMENT FRAUD'
].map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AppLevelBlockV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getRequestType: null,
      gameId: null,
      fraudActivityData: [],
      fraudActivityDataFetched: false,
      blockingInfoData: [],
      blockingInfoDataFetched: false,
      showContentModal: false,
      blockReasonsOptions: [],
      permanentBlock: false,
      showExtraReason: false,
      showModal: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.makeBackendCall = this.makeBackendCall.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getGamesList();
    this.getAppLevelBlokReasons();
  }

  getGamesList() {
    var gamesList = [];
    this.props.actions.fetchGames().then(() => {
      if (this.props.gamesList) {
        gamesList.push(
          <Option key={'game' + 0} value={0}>
            Not Available
          </Option>
        );
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

  getAppLevelBlokReasons() {
    this.props.actions.getAppLevelBlokReasons().then(() => {
      if (this.props.getAppLevelBlockReasonsResponse) {
        let blockReasons = JSON.parse(
          this.props.getAppLevelBlockReasonsResponse
        ).BlockingReason;
        let blockReasonsOptions = blockReasons.map(item => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ));
        this.setState({ blockReasonsOptions });
      }
    });
  }

  changePermanentBlock(value) {
    this.setState({
      permanentBlock: value,
      showExtraReason: false
    });
    this.props.form.setFieldsValue({
      fraudCheckCategory: null
    });
  }

  selectBlockReason(value) {
    console.log(value);
    let showExtraReason = null;
    if (toUpper(value) === 'OTHERS') {
      showExtraReason = true;
    } else {
      showExtraReason = false;
    }
    this.setState({
      permanentBlock: value,
      showExtraReason
    });
  }

  makeBackendCall(data) {
    this.props.actions.blockOnAppLevelV2(data).then(() => {
      if (this.props.blockOnAppLevelV2Response) {
        console.log(this.props.blockOnAppLevelV2Response);
        if (this.props.blockOnAppLevelV2Response.fraudServiceError) {
          message.error(
            this.props.blockOnAppLevelV2Response.fraudServiceError.message
              ? this.props.blockOnAppLevelV2Response.fraudServiceError.message
              : 'Could not block the user'
          );
        } else {
          if (
            this.props.blockOnAppLevelV2Response.error &&
            this.props.blockOnAppLevelV2Response.error.message
          ) {
            this.setState({
              modalMessage: this.props.blockOnAppLevelV2Response.error.message,
              showModal: true
            });
          } else {
            message.success('User blocked', 1.5).then(() => {
              window.location.reload();
            });
          }
        }
      }
    });
  }

  segmentUrlCallback = data => {
    this.setState({
      blockDoc: data && data.id ? data.id : ''
    });
  };

  increaseBlockSeverity() {
    let values = this.props.form.getFieldsValue();
    if (values.searchCriteria == 'USER_ID') {
      if (values.searchFor.toString().length > 9) {
        message.error('UserId can not be of more than 9 digits');
        return;
      }
      let data = {
        userId: values.searchFor,
        gameId: values.gameId,
        gamePlayId: values.gamePlayId ? values.gamePlayId : 'NA',
        fraudCheckCategory: values.fraudCheckCategory,
        isDashboardBlocked: values.permanentBlock ? true : false,
        reason: values.reason ? values.reason : null,
        extraReason: values.extraReason ? values.extraReason : null,
        reportedBy: values.reportedBy ? values.reportedBy : null,
        blockDoc: this.state.blockDoc ? this.state.blockDoc : null,
        IncreaseSeverity: true
      };
      this.makeBackendCall(data);
    } else {
      let mobileNumberData = {
        mobileNumber: values.searchFor
      };
      this.props.actions.getUserByMobile(mobileNumberData).then(() => {
        if (this.props.getUserByMobileResponse) {
          if (
            this.props.getUserByMobileResponse.profile &&
            this.props.getUserByMobileResponse.profile.id
          ) {
            let data = {
              userId: this.props.getUserByMobileResponse.profile.id,
              gameId: values.gameId,
              gamePlayId: values.gamePlayId ? values.gamePlayId : 'NA',
              fraudCheckCategory: values.fraudCheckCategory,
              isDashboardBlocked: values.permanentBlock ? true : false,
              reason: values.reason ? values.reason : null,
              extraReason: values.extraReason ? values.extraReason : null,
              reportedBy: values.reportedBy ? values.reportedBy : null,
              blockDoc: this.state.blockDoc ? this.state.blockDoc : null,
              IncreaseSeverity: true
            };
            this.makeBackendCall(data);
          } else {
            message.error(
              this.props.getUserByMobileResponse.error &&
                this.props.getUserByMobileResponse.error.message
                ? this.props.getUserByMobileResponse.error.message
                : 'Could not fetch userId'
            );
            return;
          }
        } else {
          message.error('Unable to fetch details for the mobile number');
          return;
        }
      });
    }
  }

  closeModal() {
    this.setState({ modalMessage: '', showModal: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.searchCriteria == 'USER_ID') {
          if (values.searchFor.toString().length > 9) {
            message.error('UserId can not be of more than 9 digits');
            return;
          }
          let data = {
            userId: values.searchFor,
            gameId: values.gameId,
            gamePlayId: values.gamePlayId ? values.gamePlayId : 'NA',
            fraudCheckCategory: values.fraudCheckCategory,
            isDashboardBlocked: values.permanentBlock ? true : false,
            reason: values.reason ? values.reason : null,
            extraReason: values.extraReason ? values.extraReason : null,
            reportedBy: values.reportedBy ? values.reportedBy : null,
            blockDoc: this.state.blockDoc ? this.state.blockDoc : null,
            IncreaseSeverity: this.state.IncreaseSeverity
              ? this.state.IncreaseSeverity
              : null,
            description: values.description
          };
          this.makeBackendCall(data);
        } else {
          let mobileNumberData = {
            mobileNumber: values.searchFor
          };
          this.props.actions.getUserByMobile(mobileNumberData).then(() => {
            if (this.props.getUserByMobileResponse) {
              if (
                this.props.getUserByMobileResponse.profile &&
                this.props.getUserByMobileResponse.profile.id
              ) {
                let data = {
                  userId: this.props.getUserByMobileResponse.profile.id,
                  gameId: values.gameId,
                  gamePlayId: values.gamePlayId ? values.gamePlayId : 'NA',
                  fraudCheckCategory: values.fraudCheckCategory,
                  isDashboardBlocked: values.permanentBlock ? true : false,
                  reason: values.reason ? values.reason : null,
                  extraReason: values.extraReason ? values.extraReason : null,
                  reportedBy: values.reportedBy ? values.reportedBy : null,
                  blockDoc: this.state.blockDoc ? this.state.blockDoc : null,
                  IncreaseSeverity: this.state.IncreaseSeverity
                    ? this.state.IncreaseSeverity
                    : null,
                  description: values.description
                };
                this.makeBackendCall(data);
              } else {
                message.error(
                  this.props.getUserByMobileResponse.error &&
                    this.props.getUserByMobileResponse.error.message
                    ? this.props.getUserByMobileResponse.error.message
                    : 'Could not fetch userId'
                );
                return;
              }
            } else {
              message.error('Unable to fetch details for the mobile number');
              return;
            }
          });
        }
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
      searchFor: isFieldTouched('searchFor') && getFieldError('searchFor'),
      gameId: isFieldTouched('gameId') && getFieldError('gameId'),
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray'),
      gamePlayId: isFieldTouched('gamePlayId') && getFieldError('gamePlayId'),
      fraudCheckCategory:
        isFieldTouched('fraudCheckCategory') &&
        getFieldError('fraudCheckCategory'),
      reason: isFieldTouched('reason') && getFieldError('reason'),
      extraReason:
        isFieldTouched('extraReason') && getFieldError('extraReason'),
      reportedBy: isFieldTouched('reportedBy') && getFieldError('reportedBy'),
      description: isFieldTouched('description') && getFieldError('description')
    };
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Card title="App Level Block V2">
            <FormItem {...formItemLayout} label={'Search Criteria'}>
              {getFieldDecorator('searchCriteria', {
                rules: [
                  {
                    required: true,
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: 'MOBILE_NUMBER'
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={'MOBILE_NUMBER'}>
                    Mobile Number
                  </Radio.Button>
                  <Radio.Button value={'USER_ID'}>User Id</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.searchFor ? 'error' : ''}
              help={errors.searchFor || ''}
              {...formItemLayout}
              label={<span>User Id/ Mobile Number</span>}
            >
              {getFieldDecorator('searchFor', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true,
                    type: 'number'
                  }
                ]
              })(<InputNumber style={{ width: 200 }} min={0} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'Permanent Block'}>
              {getFieldDecorator('permanentBlock', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select an option',
                    whitespace: false
                  }
                ],
                initialValue: false
              })(
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  onChange={e => this.changePermanentBlock(e.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Yes</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.gameId ? 'error' : ''}
              help={errors.gameId || ''}
              {...formItemLayout}
              label={<span>Game</span>}
            >
              {getFieldDecorator('gameId', {
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
                  showSearch
                  style={{ width: 500 }}
                  placeholder="Select a Game"
                  optionFilterProp="children"
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
            {!this.state.permanentBlock && (
              <FormItem
                validateStatus={errors.gamePlayId ? 'error' : ''}
                help={errors.gamePlayId || ''}
                {...formItemLayout}
                label={<span>Game Play Id</span>}
              >
                {getFieldDecorator('gamePlayId', {
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field',
                      whitespace: true
                    }
                  ]
                })(
                  <Input
                    placeholder="Please enter gameplay id"
                    style={{ width: 500 }}
                  />
                )}
              </FormItem>
            )}
            {this.state.permanentBlock ? (
              <FormItem
                validateStatus={errors.fraudCheckCategory ? 'error' : ''}
                help={errors.fraudCheckCategory || ''}
                {...formItemLayout}
                label={<span>Fraud Check Category</span>}
              >
                {getFieldDecorator('fraudCheckCategory', {
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
                    style={{ width: 500 }}
                    placeholder="Select a category"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {FraudCheckCategoriesPermanent}
                  </Select>
                )}
              </FormItem>
            ) : (
              <FormItem
                validateStatus={errors.fraudCheckCategory ? 'error' : ''}
                help={errors.fraudCheckCategory || ''}
                {...formItemLayout}
                label={<span>Fraud Check Category</span>}
              >
                {getFieldDecorator('fraudCheckCategory', {
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
                    style={{ width: 500 }}
                    placeholder="Select a category"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {FraudCheckCategories}
                  </Select>
                )}
              </FormItem>
            )}
            {this.state.permanentBlock && (
              <FormItem
                validateStatus={errors.reason ? 'error' : ''}
                help={errors.reason || ''}
                {...formItemLayout}
                label={<span>Reason</span>}
              >
                {getFieldDecorator('reason', {
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
                    style={{ width: 500 }}
                    placeholder="Select a reason"
                    optionFilterProp="children"
                    onSelect={e => this.selectBlockReason(e)}
                    filterOption={(input, option) =>
                      option.props.children
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.blockReasonsOptions}
                  </Select>
                )}
              </FormItem>
            )}
            {this.state.showExtraReason && this.state.permanentBlock && (
              <FormItem
                validateStatus={errors.extraReason ? 'error' : ''}
                help={errors.extraReason || ''}
                {...formItemLayout}
                label={<span>Other Reason</span>}
              >
                {getFieldDecorator('extraReason', {
                  rules: [
                    {
                      required: true,
                      message: 'This is a mandatory field',
                      whitespace: true
                    }
                  ]
                })(
                  <Input
                    placeholder="Please enter the reason"
                    style={{ width: 500 }}
                  />
                )}
              </FormItem>
            )}
            <FormItem
              validateStatus={errors.reportedBy ? 'error' : ''}
              help={errors.reportedBy || ''}
              {...formItemLayout}
              label={<span>Reported By</span>}
            >
              {getFieldDecorator('reportedBy', {
                rules: [
                  {
                    required: false,
                    message: 'This is a non mandatory field',
                    whitespace: true
                  }
                ]
              })(
                <Input
                  placeholder="Please enter if it is reported by someone"
                  style={{ width: 500 }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<span>Upload proof</span>}>
              {getFieldDecorator('blockDoc', {
                rules: [
                  {
                    required: false
                  }
                ]
              })(
                <UploadProofFile callbackFromParent={this.segmentUrlCallback} />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description || ''}
              {...formItemLayout}
              label={'Description'}
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field!',
                    whitespace: true
                  }
                ]
              })(<TextArea rows={4} />)}
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
        <Modal
          title={'Response Message'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={() => this.closeModal()}
          onOk={() => this.closeModal()}
          visible={this.state.showModal}
          footer={[
            <Button key="close-seve-modal" onClick={() => this.closeModal()}>
              Close
            </Button>
          ]}
        >
          <Card bordered={false}>{this.state.modalMessage}</Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames,
    blockOnAppLevelV2Response: state.fraud.blockOnAppLevelV2Response,
    getUserByMobileResponse: state.userData.getUserByMobileResponse,
    getAppLevelBlockReasonsResponse: state.fraud.getAppLevelBlockReasonsResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...fraudActions, ...gameActions, ...userDataActions },
      dispatch
    )
  };
}

const AppLevelBlockV2Form = Form.create()(AppLevelBlockV2);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLevelBlockV2Form);
