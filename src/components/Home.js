import React from 'react';
import mainImg from '../assets/img-mpl-01-play@3x.png';
import configImg from '../assets/img-mpl-02-compete@3x.png';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { Card, Icon, Avatar, Row, Col } from 'antd';
import '../styles/components/home.css';
const { Meta } = Card;
export default class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Card title="Internal Dashboard">
          <Row>
            <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={<img alt="example" src={configImg} />}
                actions={[
                  <Link to="/config/add">
                    <Icon type="edit" />
                  </Link>,
                  <Link to="/config/all">
                    <Icon type="table" />
                  </Link>,
                  <Link to="">
                    <Icon type="ellipsis" />
                  </Link>
                ]}
              >
                <Meta
                  avatar={<Avatar src={logo} />}
                  title="Config"
                  description="Tournament configs to generate tournaments"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={<img alt="" src={mainImg} />}
                actions={[
                  <Link to="">
                    <Icon type="edit" />
                  </Link>,
                  <Link to="">
                    <Icon type="table" />
                  </Link>,
                  <Link to="">
                    <Icon type="ellipsis" />
                  </Link>
                ]}
              >
                <Meta
                  avatar={<Avatar src={logo} />}
                  title="Order tournaments"
                  description="Order tournament configs for App home page or group"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={<img alt="example" src={logo} />}
                actions={[
                  <Link to="/updater/add">
                    <Icon type="edit" />
                  </Link>,
                  <Link to="/updater/all">
                    <Icon type="table" />
                  </Link>,
                  <Link to="">
                    <Icon type="ellipsis" />
                  </Link>
                ]}
              >
                <Meta
                  avatar={<Avatar src={logo} />}
                  title="Update App"
                  description="App Updater react or apk"
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </React.Fragment>
    );
  }
}
