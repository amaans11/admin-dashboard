import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  InputNumber,
  Radio,
  Button,
  Row,
  Col,
  Select,
  message,
  Typography,
  Avatar,
  Icon,
  Divider,
  Modal
} from 'antd';
import * as userDataActions from '../../actions/userDataActions';
import { Helmet } from 'react-helmet';
import FAEditUser from './FAEditUser';
import { SUPER_ADMIN, SOCIAL_ADMIN } from '../../auth/userPermission';
import { getArrFromObj } from '../HomeDiscoveryWidget/constants';
import CSVReader from 'react-csv-reader';
// type AddUser ={}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Paragraph, Title } = Typography;
const { Meta } = Card;

export class FASearchUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      searchMode: 'mobile',
      userFound: {},
      user: '',
      showUserFound: false,
      featuresList: [
        'TEAM_TRADING_SELLER',
        'TEAM_TRADING_ENABLED',
        'OPEN_GROUP_CREATION_ENABLED',
        'AUDIO_ENABLED',
        'LIVE_STREAM_ENABLED'
      ],
      showModal: false,
      isCsvRead: false,
      csvData: [],
      showProfilesList: false,
      profilesList: [],
      isMultiEditMode: false,
      isDeleteAccessFlow: false,
      selectedUser: {}
    };
  }

  componentDidMount() {
    this.props.actions.getFetureAccessConfig().then(() => {
      if (this.props.getFetureAccessConfigResponse) {
        let nodeData =
          this.props.getFetureAccessConfigResponse.nodeData &&
          this.props.getFetureAccessConfigResponse.nodeData !== ''
            ? JSON.parse(this.props.getFetureAccessConfigResponse.nodeData)
            : {
                channelPermissions: [
                  'TEAM_TRADING_SELLER',
                  'TEAM_TRADING_ENABLED',
                  'OPEN_GROUP_CREATION_ENABLED',
                  'AUDIO_ENABLED',
                  'LIVE_STREAM_ENABLED'
                ]
              };
        this.setState({
          featuresList: nodeData.channelPermissions
        });
      }
    });
  }

  setSearchMode = mode => {
    this.setState({
      searchMode: mode,
      userFound: {},
      showUserFound: false,
      showProfilesList: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, values) => {
      // if (
      //   this.state.searchMode !== 'userId' &&
      //   !/^\d{10}$/.test(values.mobile)
      // ) {
      //   message.info('Invalid Mobile Number');
      //   return;
      // }
      this.props.actions
        .getUserFeatureAccess(
          this.state.searchMode === 'userId'
            ? { userId: values.userId }
            : { mobileNumber: values.mobile }
        )
        .then(() => {
          if (
            this.props.getUserFeatureAccessResponse &&
            this.props.getUserFeatureAccessResponse.userId
          ) {
            this.setState({
              user:
                this.state.searchMode === 'userId'
                  ? values.userId
                  : values.mobile,
              userId: this.props.getUserFeatureAccessResponse.userId,
              showUserFound: true,
              showProfilesList: false,
              userFound: {
                ...this.props.getUserFeatureAccessResponse,
                featuresAccess: [
                  ...new Set(
                    this.props.getUserFeatureAccessResponse.featuresAccess
                  )
                ].filter(
                  access =>
                    !(
                      access.toUpperCase().includes('POWER_USER') ||
                      access.toUpperCase().includes('TEAM_TRADING_BUYER')
                    )
                )
              },
              isCsvRead: false,
              csvData: []
            });
          }
        });
    });
  };

  getUserIds = () => {
    const {
      isEditMode,
      isMultiEditMode,
      profilesList,
      userId,
      csvData
    } = this.state;
    if (isEditMode) return [userId];
    if (isMultiEditMode) {
      // return profilesList.map(user => user.userId);
      return csvData;
    }
  };

  handleSaveSubmit = values => {
    const { isDeleteAccessFlow, isMultiEditMode, userFound = {} } = this.state;
    let isDeleteFlow = isDeleteAccessFlow;
    if (!isMultiEditMode) {
      isDeleteFlow =
        userFound.featuresAccess.length > values.featuresAccess.length;
    }
    this.props.actions
      .saveUserFeatureAccess({
        userId: this.getUserIds(),
        updatedFeaturesAccess:
          isDeleteFlow && !isMultiEditMode
            ? userFound.featuresAccess.filter(
                access => !values.featuresAccess.includes(access)
              )
            : values.featuresAccess,
        isDeleteFlow
      })
      .then(() => {
        if (
          this.props.saveUserFeatureAccessResponse &&
          this.props.saveUserFeatureAccessResponse.success
        ) {
          message.success('Successfully updated feature access');
          this.disableEditMode();
          this.setState({ csvData: [], isCsvRead: false });
        } else {
          message.error('Could not update data');
        }
      });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  enableEditMode = e => {
    this.setState({
      isEditMode: true
    });
  };

  disableEditMode = (requireUpdate = true) => {
    const { userId = undefined, isMultiEditMode } = this.state;
    if (requireUpdate) {
      if (isMultiEditMode) {
        // this.processCsvData();
      } else if (userId) {
        this.props.actions.getUserFeatureAccess({ userId }).then(() => {
          if (
            this.props.getUserFeatureAccessResponse &&
            this.props.getUserFeatureAccessResponse.userId
          ) {
            this.setState({
              showUserFound: true,
              showProfilesList: false,
              userFound: {
                ...this.props.getUserFeatureAccessResponse,
                featuresAccess: [
                  ...new Set(
                    this.props.getUserFeatureAccessResponse.featuresAccess
                  )
                ].filter(
                  access =>
                    !(
                      access.toUpperCase().includes('POWER_USER') ||
                      access.toUpperCase().includes('TEAM_TRADING_BUYER')
                    )
                )
              },
              isCsvRead: false,
              csvData: []
            });
            if (
              this.props.getUserFeatureAccessResponse.message &&
              this.props.getUserFeatureAccessResponse.message
                .toLowerCase()
                .includes('you need at least')
            )
              message.info('User does not have enough followers/permissions.');
          }
        });
      }
    }
    this.setState({
      isEditMode: false,
      isMultiEditMode: false,
      isDeleteAccessFlow: false
    });
  };

  checkPermission = () => {
    return [SUPER_ADMIN, SOCIAL_ADMIN].filter(e =>
      this.props.currentUser.user_role.includes(e)
    ).length
      ? true
      : false;
  };

  handleFileUpload(data = []) {
    if (data && data.length) {
      let csvData = [];
      for (let i = 0; i < data.length; i++) {
        csvData.push(...data[i]);
      }
      this.setState({
        isCsvRead: true,
        csvData,
        showUserFound: false
      });
    }
  }

  processCsvData = () => {
    const { csvData } = this.state;
    if (csvData && csvData.length) {
      this.props.actions
        .getBulkUserFeatureAccesses({
          userIds: csvData
        })
        .then(() => {
          if (this.props.getBulkUserFeatureAccessResponse) {
            const { profiles } = this.props.getBulkUserFeatureAccessResponse;
            if (profiles) {
              this.setState({
                showProfilesList: true,
                showUserFound: false,
                profilesList: getArrFromObj(profiles)
              });
            } else {
              this.setState({
                showProfilesList: true,
                showUserFound: false,
                profilesList: []
              });
            }
          } else {
            this.setState({
              showProfilesList: true,
              showUserFound: false,
              profilesList: []
            });
          }
        });
    }
  };

  handleBulkEdit = isDelete => {
    this.setState({
      isMultiEditMode: true,
      isDeleteAccessFlow: isDelete
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  showModal = user => {
    this.setState({
      showModal: true,
      selectedUser: user
    });
  };

  render() {
    const {
      searchMode,
      isEditMode,
      showUserFound,
      userFound,
      user,
      featuresList,
      showProfilesList,
      profilesList,
      isMultiEditMode,
      isDeleteAccessFlow
    } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const errors = {
      [searchMode]: isFieldTouched(searchMode) && getFieldError(searchMode),
      searchType: isFieldTouched('searchType') && getFieldError('searchType')
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        lg: { span: 11 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 10 }
      }
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Feature Access Management | Admin Dashboard</title>
        </Helmet>
        {!(isEditMode || isMultiEditMode) ? (
          <React.Fragment>
            <Row>
              <Col span={24}>
                <Card title={'Search User'} style={{ margin: 20 }}>
                  <Form onSubmit={this.handleSubmit}>
                    <FormItem
                      {...formItemLayout}
                      label={'Search Using'}
                      validateStatus={errors.searchType ? 'error' : ''}
                    >
                      {getFieldDecorator('searchType', {
                        rules: [
                          {
                            required: true
                          }
                        ],
                        initialValue: 'mobile'
                      })(
                        <RadioGroup
                          name="type"
                          onChange={e => this.setSearchMode(e.target.value)}
                        >
                          <Radio.Button value={'userId'}>User Id</Radio.Button>
                          <Radio.Button value={'mobile'}>Mobile</Radio.Button>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      validateStatus={errors[searchMode] ? 'error' : ''}
                      label={
                        <span>
                          {searchMode === 'userId' ? 'User ID' : 'Mobile'}
                        </span>
                      }
                    >
                      {getFieldDecorator(searchMode, {
                        rules: [
                          {
                            required: true,
                            message: 'Please input value!',
                            whitespace: false,
                            type: 'number'
                          }
                        ]
                      })(<InputNumber min={0} style={{ width: 200 }} />)}
                    </FormItem>
                    <Row type="flex" justify="center">
                      <Button
                        type="primary"
                        disabled={
                          this.hasErrors(getFieldsError()) ||
                          !this.checkPermission()
                        }
                        htmlType="submit"
                      >
                        Search
                      </Button>
                    </Row>
                  </Form>
                  <Row type="flex" justify="center" className="mt10">
                    <Paragraph>&nbsp;&nbsp;OR&nbsp;&nbsp;</Paragraph>
                  </Row>
                  <Row
                    type="flex"
                    justify="start"
                    align="center"
                    style={{ alignItems: 'center' }}
                  >
                    <CSVReader
                      cssClass="csv-reader-input"
                      label={`Upload User Ids CSV file`}
                      onFileLoaded={e => this.handleFileUpload(e)}
                    />
                  </Row>
                  {this.state.isCsvRead ? (
                    <React.Fragment>
                      <Row
                        type="flex"
                        justify="center"
                        align="middle"
                        style={{ marginTop: 20 }}
                      >
                        <Button
                          type="danger"
                          icon="delete"
                          onClick={() => this.handleBulkEdit(true)}
                        >
                          Bulk Delete
                        </Button>
                        <Button
                          style={{ marginLeft: 10 }}
                          type="primary"
                          icon="edit"
                          onClick={() => this.handleBulkEdit(false)}
                        >
                          Bulk Update
                        </Button>
                      </Row>
                      {/* <Button
                          type="default"
                          onClick={this.processCsvData}
                          className="ml10"
                        >
                          Process Data
                        </Button> */}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </Card>
              </Col>
            </Row>
            {showUserFound ? (
              <Row>
                <Col span={24}>
                  <Card
                    style={{ margin: 20 }}
                    title="User Access Details"
                    extra={
                      <Row type="flex" justify="end" align="middle">
                        <Icon
                          style={{ fontSize: '20px' }}
                          type="info-circle"
                          theme="twoTone"
                          onClick={() => this.showModal(userFound)}
                        />
                        <Button
                          style={{ marginLeft: 15 }}
                          disabled={!this.checkPermission()}
                          onClick={() => this.enableEditMode()}
                          icon="edit"
                          type="primary"
                        />
                      </Row>
                    }
                  >
                    <Row>
                      <Col span={24}>
                        Features Access:&nbsp;
                        {userFound.featuresAccess &&
                        userFound.featuresAccess.length ? (
                          <strong>{userFound.featuresAccess.join(', ')}</strong>
                        ) : (
                          'No Feature Access Available'
                        )}
                      </Col>
                      <Col span={24}>
                        Seller Sport Ids:&nbsp;
                        {userFound.sellerSportIds &&
                        userFound.sellerSportIds.length ? (
                          <strong>{userFound.sellerSportIds.join(', ')}</strong>
                        ) : (
                          'No Seller Sport Available'
                        )}
                      </Col>
                      <Col span={24}>
                        Groups Info:&nbsp;
                        {userFound.groups && userFound.groups.length
                          ? userFound.groups.map((group, index) => (
                              <React.Fragment key={group.channelUrl}>
                                <span
                                  style={{
                                    marginLeft: index === 0 ? 0 : 10
                                  }}
                                >
                                  <strong>
                                    {index + 1}.&nbsp;{group.groupName}
                                  </strong>
                                </span>
                              </React.Fragment>
                            ))
                          : 'No Group Available'}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            ) : null}
          </React.Fragment>
        ) : (
          <FAEditUser
            disableEditMode={this.disableEditMode}
            handleSubmit={this.handleSaveSubmit}
            user={user}
            searchMode={searchMode}
            isMultiEditMode={isMultiEditMode}
            isDeleteAccessFlow={isDeleteAccessFlow}
            currentUser={this.props.currentUser}
            featuresAccess={isEditMode ? userFound.featuresAccess : []}
            allFeatures={[
              ...new Set([
                ...(isEditMode ? userFound.featuresAccess : []),
                ...featuresList
              ])
            ]}
          />
        )}
        {showProfilesList && !showUserFound ? (
          <>
            <Card
              style={{ margin: 20 }}
              title={
                isMultiEditMode
                  ? 'Users to be Affacted'
                  : 'All Users Features Access'
              }
              extra={
                !isMultiEditMode && profilesList.length ? (
                  <Row type="flex" justify="end" align="middle">
                    <Button
                      type="danger"
                      icon="delete"
                      onClick={() => this.handleBulkEdit(true)}
                    >
                      Bulk Delete
                    </Button>
                    <Button
                      style={{ marginLeft: 10 }}
                      type="primary"
                      icon="edit"
                      onClick={() => this.handleBulkEdit(false)}
                    >
                      Bulk Update
                    </Button>
                  </Row>
                ) : null
              }
            >
              <Row type="flex">
                {profilesList.length ? (
                  profilesList.map((user, index) => {
                    return (
                      <React.Fragment key={user.userId}>
                        <Row style={{ marginBottom: 20 }}>
                          <Col span={24}>
                            <Row type="flex" justify="start" align="middle">
                              <Avatar
                                src={
                                  user.avatarUrl
                                    ? user.avatarUrl
                                    : typeof user.avatars == 'object' &&
                                      Object.keys(user.avatars).length
                                    ? user.avatars.regular || user.avatars.small
                                    : ''
                                }
                                size="large"
                                style={{ marginRight: 10, marginBottom: 6 }}
                              />
                              <Typography>
                                <Title
                                  level={4}
                                  style={{ color: 'rgba(0,0,0,0.65)' }}
                                >
                                  {user.displayName}
                                </Title>
                              </Typography>
                              <Icon
                                style={{
                                  fontSize: '20px',
                                  marginLeft: 20,
                                  marginBottom: 6
                                }}
                                type="info-circle"
                                theme="twoTone"
                                onClick={() => this.showModal(user)}
                              />
                            </Row>
                          </Col>
                          <Col span={24} style={{ marginBottom: 6 }}>
                            <Row type="flex">
                              <Col span={8}>
                                <div>
                                  <b>User ID: </b>
                                  {user.userId}
                                </div>
                              </Col>
                              <Col span={8}>
                                <div>
                                  <b>Mobile: </b>
                                  {user.mobileNumber}
                                </div>
                              </Col>
                              <Col span={8}>
                                <div>
                                  <b>Is Pro: </b>
                                  {user.hasOwnProperty('isPro')
                                    ? String(user.isPro)
                                    : 'false'}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            Features Access:&nbsp;
                            {user.featuresAccess &&
                            user.featuresAccess.length ? (
                              <strong>
                                {user.featuresAccess
                                  .filter(
                                    access =>
                                      !(
                                        access
                                          .toUpperCase()
                                          .includes('POWER_USER') ||
                                        access
                                          .toUpperCase()
                                          .includes('TEAM_TRADING_BUYER')
                                      )
                                  )
                                  .join(', ')}
                              </strong>
                            ) : (
                              'No Feature Access Available'
                            )}
                          </Col>
                          <Col span={24}>
                            Seller Sport Ids:&nbsp;
                            {user.sellerSportIds &&
                            user.sellerSportIds.length ? (
                              <strong>{user.sellerSportIds.join(', ')}</strong>
                            ) : (
                              'No Seller Sport Available'
                            )}
                          </Col>
                          <Col span={24}>
                            Groups Info:&nbsp;
                            {user.groups && user.groups.length
                              ? user.groups.map((group, index) => (
                                  <React.Fragment key={group.channelUrl}>
                                    <span
                                      style={{
                                        marginLeft: index === 0 ? 0 : 10
                                      }}
                                    >
                                      <strong>
                                        {index + 1}.&nbsp;{group.groupName}
                                      </strong>
                                    </span>
                                  </React.Fragment>
                                ))
                              : 'No Group Available'}
                          </Col>
                        </Row>
                        {profilesList.length == index + 1 ? null : (
                          <Divider type="horizontal"></Divider>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Typography>
                    <Paragraph>No User Found</Paragraph>
                  </Typography>
                )}
              </Row>
            </Card>
          </>
        ) : null}
        <Modal
          title={'User Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          visible={this.state.showModal}
        >
          <Card bordered={false}>
            {JSON.stringify(this.state.selectedUser, null, 4)}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

const FASearchUserForm = Form.create()(FASearchUser);
const mapStateToProps = state => ({
  getUserFeatureAccessResponse: state.userData.getUserFeatureAccessResponse,
  saveUserFeatureAccessResponse: state.userData.saveUserFeatureAccessResponse,
  getBulkUserFeatureAccessResponse:
    state.userData.getBulkUserFeatureAccessResponse,
  getFetureAccessConfigResponse: state.userData.getFetureAccessConfigResponse,
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userDataActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(FASearchUserForm);
