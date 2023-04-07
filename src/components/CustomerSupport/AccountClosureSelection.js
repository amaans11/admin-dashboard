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
  Tag,
  Row,
  Col,
  Select,
  Table,
  DatePicker,
  Modal,
  Input,
  Popconfirm
} from 'antd';
import * as accountClosureActions from '../../actions/AccountClosureActions';

const DELINKED_STATUS = ['NOT_FOUND', 'INITIATED', 'DELINKED', 'FRAUD_USER'];

class AccountClosureSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeLinkedDataFetched: false,
      showDeleteConfirmationModal: false,
      reason: null
    };
  }

  componentDidMount() {
    this.setState(
      {
        userId: this.props.userId,
        countryCode: this.props.countryCode
      },
      () => {
        this.deLinkUser();
      }
    );
  }

  async deLinkUser() {
    let data = {
      idType: 'USER_ID',
      id: this.state.userId
    };
    let deLinkStatusDetails = {};
    await this.props.actions.getUserDelinkedStatus(data);
    if (this.props.getUserDelinkedStatusResponse) {
      deLinkStatusDetails = {
        status: this.props.getUserDelinkedStatusResponse.status
          ? DELINKED_STATUS[this.props.getUserDelinkedStatusResponse.status]
          : DELINKED_STATUS[0],
        delinkedStatus:
          this.props.getUserDelinkedStatusResponse.delinkedUserDetails &&
          this.props.getUserDelinkedStatusResponse.delinkedUserDetails
            .delinkedStatus
            ? this.props.getUserDelinkedStatusResponse.delinkedUserDetails
                .delinkedStatus
            : 'NOT_FOUND'
      };
    } else {
      message.error('Could not fetch User de-linked status');
      deLinkStatusDetails = {
        status: 'N/A',
        delinkedStatus: 'N/A'
      };
    }
    this.setState({ deLinkStatusDetails, isDeLinkedDataFetched: true });
  }

  openDeleteConfirmationModal() {
    this.setState({
      showDeleteConfirmationModal: true
    });
  }

  closeDeleteConfirmationModal() {
    this.setState({
      showDeleteConfirmationModal: false
    });
  }

  updateReason(value) {
    this.setState({ reason: value });
  }

  async submitDeleteRequest() {
    const { reason, userId } = this.state;
    let data = {
      userId,
      reason
    };
    await this.props.actions.submitDelinkUserRequest(data);
    if (
      this.props.submitDelinkUserRequestResponse &&
      this.props.submitDelinkUserRequestResponse.error
    ) {
      message.error(
        this.props.submitDelinkUserRequestResponse.error.message
          ? this.props.submitDelinkUserRequestResponse.error.message
          : 'Could not process the request'
      );
    } else {
      let newStatus =
        this.props.submitDelinkUserRequestResponse &&
        this.props.submitDelinkUserRequestResponse.status
          ? DELINKED_STATUS[this.props.submitDelinkUserRequestResponse.status]
          : DELINKED_STATUS[0];
      message.success(
        `Request placed successfully. Updated status is ${newStatus}`
      );
    }
    this.setState({
      reason: null,
      showDeleteConfirmationModal: false
    });
  }

  async updateStatusToDeLink() {
    let data = {
      userId: this.state.userId,
      delinkedStatus: 'DELINKED'
    };
    await this.props.actions.updateDelinkingStatus(data);
    if (
      this.props.updateDelinkingStatusResponse &&
      this.props.updateDelinkingStatusResponse.error
    ) {
      message.error(
        this.props.updateDelinkingStatusResponse.error.message
          ? this.props.updateDelinkingStatusResponse.error.message
          : 'Could not process the request'
      );
    } else {
      let newStatus =
        this.props.updateDelinkingStatusResponse &&
        this.props.updateDelinkingStatusResponse.status
          ? DELINKED_STATUS[this.props.updateDelinkingStatusResponse.status]
          : DELINKED_STATUS[0];
      message.success(
        `Request placed successfully. Updated status is ${newStatus}`
      );
    }
  }

  shouldShowDelinkButton() {
    const { deLinkStatusDetails } = this.state;
    if (
      deLinkStatusDetails.status === 'INITIATED' ||
      deLinkStatusDetails.status === 'FRAUD_USER'
    )
      return true;
    return false;
  }

  render() {
    const { deLinkStatusDetails, isDeLinkedDataFetched, reason } = this.state;
    return (
      <React.Fragment>
        {isDeLinkedDataFetched && (
          <Card>
            <Row>
              <Col span={24}>
                <strong>Status: </strong>
                <Tag style={{ marginLeft: '20px' }}>
                  {deLinkStatusDetails.status}
                </Tag>
              </Col>
              <Col span={24}>
                <strong>De-linked Status: </strong>
                <Tag style={{ marginLeft: '20px' }}>
                  {deLinkStatusDetails.delinkedStatus}
                </Tag>
              </Col>
            </Row>
            <Row>
              {deLinkStatusDetails.status === 'NOT_FOUND' && (
                <Col span={24}>
                  <Button
                    style={{ marginTop: '20px' }}
                    type="danger"
                    onClick={() => this.openDeleteConfirmationModal()}
                  >
                    Initiate De-Link Account
                  </Button>
                </Col>
              )}
              {this.shouldShowDelinkButton() && (
                <Popconfirm
                  title="Are you sure to de-link the account of the user"
                  onConfirm={() => this.updateStatusToDeLink()}
                >
                  <Button style={{ marginTop: '20px' }} type="danger">
                    De-Link Account
                  </Button>
                </Popconfirm>
              )}
            </Row>
          </Card>
        )}

        <Modal
          title={'Delete Confirmation Modal'}
          closable={true}
          maskClosable={true}
          width={1000}
          onOk={() => this.submitDeleteRequest()}
          onCancel={() => this.closeDeleteConfirmationModal()}
          visible={this.state.showDeleteConfirmationModal}
          okText={'Delete Account'}
          cancelText={'Cancel'}
          okButtonProps={{ type: 'danger', disabled: !reason ? true : false }}
        >
          <Card>
            Are you sure about deleting this user's account? If yes, then please
            give the reason for the same.
            <Row>
              <Col span={24}>
                <strong>Reason:</strong>
                <Input
                  value={reason}
                  onChange={e => this.updateReason(e.target.value)}
                />
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
    getUserDelinkedStatusResponse:
      state.accountClosure.getUserDelinkedStatusResponse,
    submitDelinkUserRequestResponse:
      state.accountClosure.submitDelinkUserRequestResponse,
    updateDelinkingStatusResponse:
      state.accountClosure.updateDelinkingStatusResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...accountClosureActions }, dispatch)
  };
}

const AccountClosureSelectionForm = Form.create()(AccountClosureSelection);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountClosureSelectionForm);
