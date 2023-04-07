import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import { Card, Form, message, Spin, Row, Col, Tag } from 'antd';
import * as kycActions from '../../actions/kycActions';

class SSNSelection extends React.Component {
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
    this.getKycDetails();
  }

  getKycDetails() {
    this.setState({ loading: true });
    let data = {
      userId: this.props.userId
    };
    this.props.actions.getKycResponse(data).then(() => {
      if (this.props.kycRes) {
        this.setState({
          kycDetails: { ...this.props.kycRes },
          loading: false,
          dataFetched: true
        });
      } else {
        message.error('Could not fetch details', 1);
        this.setState({ loading: false, dataFetched: false });
      }
    });
  }

  render() {
    console.log('state>>', this.state);
    return (
      <Spin spinning={this.state.loading}>
        {this.state.dataFetched && (
          <Card>
            <Row>
              <Col span={24}>
                <strong>Status: </strong>
                <Tag style={{ marginLeft: '20px' }}>
                  {Object.keys(this.state.kycDetails.extraKycDetails).length ==
                    0 ||
                  this.state.kycDetails.extraKycDetails.ssnNeeded == 'false'
                    ? 'SSN NOT FOUND'
                    : this.state.kycDetails.kycVerificationStatus}
                </Tag>
              </Col>
              <Col span={24}>
                <strong>Upload Time: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.uploadedTime
                    ? moment(this.state.kycDetails.uploadedTime).format(
                        'DD MMM YYYY hh:mm a'
                      )
                    : 'N/A'}
                </span>
              </Col>
              <Col span={24}>
                <strong>Rejection Reason / Comments: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.reason
                    ? this.state.kycDetails.reason
                    : 'N/A'}{' '}
                </span>
              </Col>
              <Col span={24}>
                <strong>ID Type: </strong>
                <span style={{ marginLeft: '20px' }}>
                  {this.state.kycDetails.kycDetails &&
                  this.state.kycDetails.kycDetails.kycIdType
                    ? this.state.kycDetails.kycDetails.kycIdType
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
    kycRes: state.kyc.kycRes
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...kycActions }, dispatch)
  };
}

const SSNSelectionForm = Form.create()(SSNSelection);
export default connect(mapStateToProps, mapDispatchToProps)(SSNSelectionForm);
