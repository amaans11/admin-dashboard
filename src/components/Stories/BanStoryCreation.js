import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as storyActions from '../../actions/storyActions';
import '../../styles/components/stories.css';
import { Card, Input, message, Button, Radio, Col, Row, Select } from 'antd';

const { Option } = Select;

class BanStoryCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      mobileNumber: '',
      searchBy: 'USER',
      userFeatureAccessList: [],
      countryCode: '+91'
    };
  }

  componentDidMount() {}

  handleSearchByChange = val => {
    this.setState({ searchBy: val });
  };

  handleUserIDChange = e => {
    this.setState({ userId: e.target.value.trim() });
  };

  handleMobileChange = e => {
    this.setState({ mobileNumber: e.target.value.trim() });
  };

  handleUserIdSearch = () => {
    const { userId } = this.state;
    const searchQur = userId.trim();
    this.getUserAccessByUserId(searchQur);
  };

  handleMobileSearch = () => {
    const { mobileNumber } = this.state;
    const searchQur = mobileNumber.trim();
    this.getUserAccessByMobileNumber(searchQur);
  };

  banUserStoryCreationByUserid = userId => {
    const params = { userId };
    this.props.actions.blockStoryCreationByUserid(params).then(() => {
      console.log(this.props.blockStoryCreationByUseridResponse);
      if (
        this.props.blockStoryCreationByUseridResponse &&
        this.props.blockStoryCreationByUseridResponse.status.code === 200
      ) {
        message.success('Story Creation access blocked for user!');
        // this.getAccessStatus();
      } else {
        let errMsg;
        const errDetails = this.props.blockStoryCreationByUseridResponse.payload
          .details;
        try {
          errMsg = JSON.parse(errDetails).message;
        } catch (e) {
          errMsg = errDetails;
        }
        errMsg = 'Unable to ban user: ' + errMsg + '!';
        message.error(errMsg);
      }
    });
  };

  banUserStoryCreationByMobile = mobileNumber => {
    const params = { mobileNumber };
    this.props.actions.blockStoryCreationByMobile(params).then(() => {
      console.log(this.props.blockStoryCreationByMobileResponse);
      if (
        this.props.blockStoryCreationByMobileResponse &&
        this.props.blockStoryCreationByMobileResponse.status.code === 200
      ) {
        message.success('Story Creation access blocked for user!');
        // this.getAccessStatus();
      } else {
        let errMsg;
        const errDetails = this.props.blockStoryCreationByMobileResponse.payload
          .details;
        try {
          errMsg = JSON.parse(errDetails).message;
        } catch (e) {
          errMsg = errDetails;
        }
        errMsg = 'Unable to ban user: ' + errMsg + '!';
        message.error(errMsg);
      }
    });
  };

  getUserAccess = params => {
    this.props.actions.getUserAccessStatus(params).then(() => {
      if (
        this.props.getUserAccessStatusResponse &&
        this.props.getUserAccessStatusResponse.featuresAccess
      ) {
        this.setState({
          userFeatureAccessList: this.props.getUserAccessStatusResponse
            .featuresAccess
        });
      }
    });
  };

  getUserAccessByUserId = userId => {
    const params = { userId };
    this.getUserAccess(params);
  };

  getUserAccessByMobileNumber = mobileNumber => {
    const params = { mobileNumber };
    this.getUserAccess(params);
  };

  banUser = () => {
    if (this.state.searchBy === 'USER') {
      this.banUserStoryCreationByUserid(this.state.userId);
    } else if (this.state.searchBy === 'MOBILE') {
      const { mobileNumber, countryCode } = this.state;
      const searchQur = countryCode + mobileNumber.trim();
      this.banUserStoryCreationByMobile(searchQur);
    } else {
      message.warning('Unable to perform an action!');
    }
  };

  getAccessStatus = () => {
    if (this.state.searchBy === 'USER') {
      this.getUserAccess(this.state.userId);
    } else if (this.state.searchBy === 'MOBILE') {
      const { mobileNumber, countryCode } = this.state;
      const searchQur = countryCode + mobileNumber.trim();
      this.getUserAccess(searchQur);
    } else {
      message.warning('Unable to perform an action!');
    }
  };

  onCountryCodeChange = value => {
    this.setState({ countryCode: value });
  };

  render() {
    const { searchBy } = this.state;

    // Country code options
    const prefixSelector = (
      <Select
        style={{ width: 85 }}
        defaultValue={this.state.countryCode}
        onChange={this.onCountryCodeChange}
      >
        <Option value="+91">+91 🇮🇳 </Option>
        <Option value="+62">+62 🇮🇩 </Option>
        <Option value="+1">+1 🇺🇸 </Option>
      </Select>
    );

    return (
      <Card className="page-container" title="Ban User Story Creation">
        <div style={{ marginBottom: '1rem' }}>
          Search User By:{' '}
          <Radio.Group
            defaultValue={searchBy}
            onChange={e => this.handleSearchByChange(e.target.value)}
          >
            <Radio.Button value="USER">User ID</Radio.Button>
            <Radio.Button value="MOBILE">Mobile No</Radio.Button>
          </Radio.Group>
        </div>

        {searchBy === 'USER' ? (
          <Row>
            <Col span={10}>
              <Input
                defaultValue={this.state.userId}
                onChange={this.handleUserIDChange}
                placeholder="Enter User ID"
              />
            </Col>
          </Row>
        ) : null}

        {searchBy === 'MOBILE' ? (
          <Row>
            <Col span={10}>
              <Input
                addonBefore={prefixSelector}
                defaultValue={this.state.mobileNumber}
                onChange={this.handleMobileChange}
                placeholder="Enter Mobile no, e.g 99XXXXXXXX without country code"
              />
            </Col>
          </Row>
        ) : null}

        <Row>
          <Col span={24} style={{ marginTop: '1rem' }}>
            <Button type="danger" onClick={this.banUser}>
              Ban User
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    getStoryByIdResponse: state.story.getStoryByIdResponse,
    getStoriesByUserIdResponse: state.story.getStoriesByUserIdResponse,
    deleteStoryByIdResponse: state.story.deleteStoryByIdResponse,
    blockStoryCreationByUseridResponse:
      state.story.blockStoryCreationByUseridResponse,
    blockStoryCreationByMobileResponse:
      state.story.blockStoryCreationByMobileResponse,
    getUserAccessStatusResponse: state.story.getUserAccessStatusResponse,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(storyActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BanStoryCreation);
