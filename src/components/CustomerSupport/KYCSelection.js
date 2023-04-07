import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import { Card, Form, message, Spin, Row, Col, Tag } from 'antd';
import * as crmActions from '../../actions/crmActions';
import * as kycActions from '../../actions/kycActions';

class KYCSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      loading: false,
      dataFetched: false
    };
    this.getKycDetails = this.getKycDetails.bind(this);
  }

  componentDidMount() {
    this.setState({ userId: this.props.userId }, () => this.getKycDetails());
  }

  getKycDetails() {
    this.setState({ loading: true });
    let data = {
      userId: this.state.userId
    };
    if (this.props.countryCode == 'US') {
      this.props.actions.getKycResponse(data, 'kyc-search').then(() => {
        if (this.props.details) {
          const { details } = this.props;

          console.log('details>>', details);
          const kycDetails = {
            status: details.aadharStatus,
            createdDate: details.aadharCreatedAt,
            updatedDate: details.aadharUpdatedAt,
            idType: details.idType,
            comments: details.aadharComments,
            verifiedOn: ''
          };
          this.setState({
            kycDetails: { ...kycDetails },
            loading: false,
            dataFetched: true
          });
        } else {
          message.error('Could not fetch details', 1);
          this.setState({ loading: false, dataFetched: false });
        }
      });
    } else {
      this.props.actions.getCsKycDetails(data).then(() => {
        if (this.props.getCsKycDetailsResponse) {
          this.setState({
            kycDetails: { ...this.props.getCsKycDetailsResponse },
            loading: false,
            dataFetched: true
          });
        } else {
          message.error('Could not fetch details', 1);
          this.setState({ loading: false, dataFetched: false });
        }
      });
    }
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
        {this.state.dataFetched && (
          <Card>
            <Row>
              <Col span={24}>
                <strong>Status: </strong>
                <Tag
                  style={{ marginLeft: '20px' }}
                  color={
                    this.state.kycDetails.status &&
                    this.state.kycDetails.status === 'VERIFIED'
                      ? 'green'
                      : this.state.kycDetails.status
                      ? 'red'
                      : ''
                  }
                >
                  {this.state.kycDetails.status
                    ? this.state.kycDetails.status
                    : 'N/A'}{' '}
                </Tag>
              </Col>
              <Col span={24}>
                <strong>Created Date: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.createdDate
                    ? moment(this.state.kycDetails.createdDate).format(
                        'DD MMM YYYY hh:mm a'
                      )
                    : 'N/A'}{' '}
                </span>
              </Col>
              <Col span={24}>
                <strong>Updated Date: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.updatedDate
                    ? moment(this.state.kycDetails.updatedDate).format(
                        'DD MMM YYYY hh:mm a'
                      )
                    : 'N/A'}{' '}
                </span>
              </Col>
              <Col span={24}>
                <strong>ID Type: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.idType
                    ? this.state.kycDetails.idType
                    : 'N/A'}{' '}
                </span>
              </Col>
              <Col span={24}>
                <strong>Verified On: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.verifiedOn
                    ? moment(this.state.kycDetails.verifiedOn).format(
                        'DD MMM YYYY hh:mm a'
                      )
                    : 'N/A'}{' '}
                </span>
              </Col>
              <Col span={24}>
                <strong>Comments: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.comments
                    ? this.state.kycDetails.comments
                    : 'N/A'}{' '}
                </span>
              </Col>
            </Row>
          </Card>
        )}
      </Spin>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getCsKycDetailsResponse: state.crm.getCsKycDetailsResponse,
    kycRes: state.kyc.kycRes,
    details: state.kyc.details
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...crmActions, ...kycActions }, dispatch)
  };
}

const KYCSelectionForm = Form.create()(KYCSelection);
export default connect(mapStateToProps, mapDispatchToProps)(KYCSelectionForm);
