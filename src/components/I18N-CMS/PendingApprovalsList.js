import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import * as i18nCMActions from '../../actions/i18nCMSActions';
import {
  message,
  Card,
  Spin,
  Row,
  Table,
  Tooltip,
  Divider,
  Button,
  Modal,
  Input,
  Typography,
  Tag
} from 'antd';
import ReactJson from 'react-json-view';
const { Paragraph } = Typography;
const { TextArea } = Input;

export class PendingApprovalsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      pendingRequests: [],
      showDiffModal: false,
      showDiffOnly: false,
      currentDataType: '',
      currentOldValue: '',
      currentNewValue: '',
      showRequestModal: false,
      requestToShow: null,
      showUpdateRequestModal: false,
      comments: '',
      isApproveFlow: false
    };
    this.columns = [
      {
        title: 'Config Name',
        dataIndex: 'configName',
        width: '15%',
        key: 'configName'
      },
      {
        title: 'Config Node',
        dataIndex: 'configNode',
        width: '15%',
        key: 'configNode'
      },
      {
        title: 'Config Path',
        dataIndex: 'configPath',
        width: '27%',
        key: 'configPath'
      },
      {
        title: 'Country Code',
        dataIndex: 'countryCode',
        key: 'countryCode',
        width: '10%',
        render: text => <Tag>{text}</Tag>
      },
      {
        title: 'Requested By',
        dataIndex: 'requestedBy',
        key: 'requestedBy',
        render: (text, record) => <a>{text}</a>
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        width: '12%',
        render: (text, record) => (
          <span>
            <Tooltip
              title="View Request details"
              placement="topLeft"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="info"
                type="primary"
                onClick={() => this.showRequestModal(record)}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip
              placement="topLeft"
              title="Check Difference"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="diff"
                type="primary"
                onClick={() => this.showDiffModal(record)}
              />
            </Tooltip>
            <Divider type="horizontal" style={{ margin: 5 }} />
            <Tooltip
              placement="bottom"
              title="Approve Request"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="check"
                type="primary"
                onClick={() => this.updateRequest(record, true)}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip
              placement="bottom"
              title="Reject Request"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="delete"
                type="danger"
                onClick={() => this.updateRequest(record, false)}
              />
            </Tooltip>
          </span>
        )
      }
    ];
  }

  updateRequest = (request, isApproveFlow) => {
    this.setState({
      showUpdateRequestModal: true,
      requestToUpdate: request,
      isApproveFlow
    });
  };

  hideUpdateRequestModal = () => {
    this.setState({
      showUpdateRequestModal: false
    });
  };
  showRequestModal = requestToShow => {
    this.setState({
      showRequestModal: true,
      requestToShow
    });
  };

  hideRequestModal = () => {
    this.setState({
      showRequestModal: false
    });
  };

  showDiffModal = data => {
    this.setState({
      showDiffModal: true,
      currentOldValue: data.oldValue,
      currentNewValue: data.newValue,
      currentDataType: data.valueType
    });
  };
  hideDiffModal = () => {
    this.setState({ showDiffModal: false });
  };
  componentDidMount() {
    this.fetchPendingApprovals();
  }
  handleCommentsChange = e => {
    this.setState({
      comments: e.target.value
    });
  };

  updateShowDiffType = () => {
    const { showDiffOnly } = this.state;
    this.setState({ showDiffOnly: !showDiffOnly });
  };

  fetchPendingApprovals = () => {
    this.setState({
      isLoading: true,
      comments: '',
      requestToUpdate: null
    });
    this.props.actions.getPendingRequests().then(() => {
      const {
        error,
        pendingConfigDetails
      } = this.props.pendingRequestsResponse;
      if (error) {
        message.error(error.message || 'Something went wrong. Try again.');
      } else {
        this.setState({
          isLoading: false,
          pendingRequests: pendingConfigDetails
        });
      }
    });
  };
  handleUpdateRequestSubmit = e => {
    e.preventDefault();
    let { isApproveFlow, comments, requestToUpdate } = this.state;
    comments = comments.trim();
    if (comments.length) {
      this.setState(
        {
          showUpdateRequestModal: false
        },
        () => {
          const data = {};
          data.isApproved = isApproveFlow;
          data.configUpdateId = requestToUpdate.configUpdateId;
          data.comments = comments;

          this.props.actions.updateRequest(data).then(() => {
            const { error, config } = this.props.approveRequestsResponse;
            if (error) {
              message.error(
                error.message || 'Something went wrong. Try again.'
              );
            } else {
              message.success(
                `Request ${
                  isApproveFlow ? 'approved' : 'rejected'
                } successfully.`
              );
            }
            this.fetchPendingApprovals();
          });
        }
      );
    } else {
      message.info('Please enter comments first');
    }
  };
  render() {
    const {
      isLoading,
      pendingRequests,
      showDiffModal,
      showDiffOnly = false,
      currentOldValue,
      currentNewValue,
      currentDataType = '',
      showRequestModal,
      requestToShow,
      showUpdateRequestModal,
      comments,
      isApproveFlow
    } = this.state;
    return (
      <React.Fragment>
        {isLoading ? (
          <Row
            style={{ height: 'calc(100vh - 60px)' }}
            type="flex"
            align="middle"
            justify="center"
          >
            <Spin />
          </Row>
        ) : (
          <Card title="Pending Requests">
            <Table
              rowKey="configUpdateId"
              dataSource={pendingRequests}
              columns={this.columns}
              scroll={{ x: '100%' }}
            />
          </Card>
        )}
        <Modal
          title={isApproveFlow ? 'Approve Request' : 'Reject Request'}
          closable={true}
          maskClosable={true}
          width={'450px'}
          onCancel={this.hideUpdateRequestModal}
          onOk={this.handleUpdateRequestSubmit}
          okText={isApproveFlow ? 'Approve' : 'Reject'}
          okType={isApproveFlow ? 'primary' : 'danger'}
          visible={showUpdateRequestModal}
        >
          <Typography>
            <Paragraph>
              Reason for {isApproveFlow ? 'Approval' : 'Rejection'}:
            </Paragraph>
          </Typography>
          <TextArea
            placeholder="Enter your comments"
            value={comments}
            onChange={this.handleCommentsChange}
            rows={3}
          />
        </Modal>
        <Modal
          title="Request Viewer"
          closable={true}
          maskClosable={true}
          width={'800px'}
          onCancel={this.hideRequestModal}
          onOk={this.hideRequestModal}
          visible={showRequestModal}
        >
          <ReactJson
            src={requestToShow}
            name={false}
            displayObjectSize={false}
          />
        </Modal>
        <Modal
          title="Diff Viewer"
          closable={true}
          maskClosable={true}
          width={'90vw'}
          onCancel={this.hideDiffModal}
          onOk={this.hideDiffModal}
          visible={showDiffModal}
          footer={[
            <Button type="link" onClick={this.updateShowDiffType}>
              {showDiffOnly ? 'Show Whole Data' : 'Show Diff Only'}
            </Button>,
            <Button onClick={this.hideDiffModal} type="default">
              Close
            </Button>
          ]}
        >
          <ReactDiffViewer
            oldValue={
              currentDataType.toUpperCase() === 'JSON'
                ? JSON.stringify(JSON.parse(currentOldValue), null, 4)
                : typeof currentOldValue !== 'string'
                ? String(currentOldValue)
                : currentOldValue
            }
            compareMethod={DiffMethod.WORDS}
            newValue={
              currentDataType.toUpperCase() === 'JSON'
                ? JSON.stringify(JSON.parse(currentNewValue), null, 4)
                : typeof currentNewValue !== 'string'
                ? String(currentNewValue)
                : currentNewValue
            }
            splitView={true}
            extraLinesSurroundingDiff={1}
            showDiffOnly={showDiffOnly}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  pendingRequestsResponse: state.i18nCMS.pendingRequestsResponse,
  approveRequestsResponse: state.i18nCMS.approveRequestsResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(i18nCMActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingApprovalsList);
