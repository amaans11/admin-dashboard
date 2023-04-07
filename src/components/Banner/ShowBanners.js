// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as bannerActions from '../../actions/bannerActions';
import { Link } from 'react-router-dom';
import { DatePicker, Icon, Switch, Select, Row, Col, Card, Button } from 'antd';
// type ShowBanners ={}
var bannerList = [];
const Option = Select.Option;

// type ListBanners ={}
const appType = ['CASH', 'PLAY_STORE', 'IOS', 'PWA_NDTV', 'WEBSITE'].map(
  (val, index) => (
    <Option value={val} key={val}>
      {val}
    </Option>
  )
);
const location = [
  'HOME',
  '1V1_HOME',
  'FANTASY_HOME',
  'GL',
  'GL_CASH',
  'GL_TOKEN',
  'GL_GAMES_PLAYED',
  'GL_REFERRERS'
].map((val, index) => (
  <Option value={val} key={val}>
    {val}
  </Option>
));
class ShowBanners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList,
      date: new Date().toISOString(true).replace('+', '%2B'),
      appType: 'CASH',
      location: 'HOME'
    };
  }
  componentDidMount() {
    this.showBanners(
      new Date().toISOString(true).replace('+', '%2B'),
      'CASH',
      'HOME'
    );
  }

  showBanners = (date, appType, location) => {
    this.props.actions.previewBanners(date, appType, location).then(() => {
      bannerList.length = 0;

      this.showBannersList(this.props.banner.previewBanners.banners);
      this.setState({
        show: true
      });
    });
  };
  showBannersList = banners => {
    bannerList = [];
    banners.map(banner =>
      bannerList.push(<img key={banner.id} src={banner.imageUrl} alt="" />)
    );
    this.setState({
      bannerList
    });
  };
  showActive = e => {
    if (e) {
      let filteredBanner = this.props.banner.previewBanners.banners.filter(
        banner => banner.isActive === true
      );
      this.showBannersList(filteredBanner);
    } else {
      this.showBannersList(this.props.banner.previewBanners.banners);
    }
  };
  render() {
    const onDateChange = e => {
      this.setState({
        date: e.toISOString(true).replace('+', '%2B')
      });
      this.showBanners(
        e.toISOString(true).replace('+', '%2B'),
        this.state.appType,
        this.state.location
      );
    };
    const onLocationChange = e => {
      this.setState({
        location: e
      });
      this.showBanners(this.state.date, this.state.appType, e);
    };
    const onAppTypeChange = e => {
      this.setState({
        appType: e
      });
      this.showBanners(this.state.date, e, this.state.location);
    };
    return (
      <React.Fragment>
        <Card>
          <Row>
            <Col span={6}>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm A"
                placeholder="Select Time"
                onChange={onDateChange}
                onOk={this.showBanners}
              />
            </Col>

            <Col span={6}>
              <label>Location: </label>
              <Select
                defaultValue={['HOME']}
                showSearch
                onChange={onLocationChange}
                style={{ width: 200 }}
                placeholder="Select location of banner"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {location}
              </Select>
            </Col>
            <Col span={6}>
              <label>App Type: </label>
              <Select
                showSearch
                defaultValue={['CASH']}
                onChange={onAppTypeChange}
                style={{ width: 200 }}
                placeholder="Select type of app"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {appType}
              </Select>
            </Col>
            <Col span={4}>
              <span style={{ marginRight: '20px' }}>Show only active</span>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="cross" />}
                defaultChecked={false}
                onChange={this.showActive}
              />
            </Col>
            <Col span={2}>
              <Link to="/banner/add">
                <Button size="small" type="primary">
                  <Icon type="form" />
                  Create New
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
        <div className="banner-wrapper">
          {this.state.show ? (
            <div style={{ width: 300 * bannerList.length + `px` }}>
              {this.state.bannerList}
            </div>
          ) : (
            'Loading Banners '
          )}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    banner: state.banner
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(bannerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowBanners);
