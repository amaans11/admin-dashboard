import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as kabaddiActions from '../../actions/KabaddiActions';
import { Helmet } from 'react-helmet';
import ImageUploader from './ImageUploader';
import _ from 'lodash';
import { Card, Form, Button, Row, Col, message, Input } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class EditMatchDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeTeamImage: null,
      awayTeamImage: null,
      seasonGameUid: null,
      fileList1: [],
      fileList2: [],
      loadImage: false,
      loadImage2: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (
      this.props.fantasy.editMatchDetails &&
      this.props.fantasy.editMatchDetails.record
    ) {
      let record = this.props.fantasy.editMatchDetails.record;
      this.props.form.setFieldsValue({
        title: record.title,
        subTitle: record.subTitle ? record.subTitle : null,
        matchVenue: record.matchVenue ? record.matchVenue : null,
        leagueName: record.leagueName
      });
      this.setState({
        seasonGameUid: record.seasonGameUid
      });
      // HOME TEAM IMAGE
      let url1 = '';
      let url2 = '';
      if (record.team1Image) {
        this.setState({
          previewImage1: record.team1Image,
          fileList1: [
            {
              uid: -1,
              name: 'image.png',
              status: 'done',
              url: record.team1Image
            }
          ]
        });

 
        this.setState({
          homeTeamImage: url1,
          loadImage: true
        });
      } else {
        this.setState({ loadImage: true });
      }
      // AWAY TEAM IMAGE
      if (record.team2Image) {
        this.setState({
          previewImage2: record.team2Image,
          fileList2: [
            {
              uid: -1,
              name: 'image2.png',
              status: 'done',
              url: record.team2Image
            }
          ]
        });

   
        this.setState({
          awayTeamImage: url2,
          loadImage2: true
        });
      } else {
        this.setState({ loadImage2: true });
      }
    }
  }

  getHomeTeamImage = data => {
    this.setState({
      homeTeamImage: data && data.id ? data.id : null
    });
  };

  getAwayTeamImage = data => {
    this.setState({
      awayTeamImage: data && data.id ? data.id : null
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          title: values.title,
          subTitle: values.subTitle ? values.subTitle : null,
          homeTeamImage: this.state.homeTeamImage,
          awayTeamImage: this.state.awayTeamImage,
          matchVenue: values.matchVenue ? values.matchVenue : null,
          leagueName: values.leagueName,
          seasonGameUid: this.state.seasonGameUid
        };
        this.props.actions.editMatchDetailsCall(data).then(() => {
          if (
            this.props.fantasy.editMatchDetailsResponse &&
            this.props.fantasy.editMatchDetailsResponse.error
          ) {
            if (this.props.fantasy.editMatchDetailsResponse.error.message) {
              message.error(
                this.props.fantasy.editMatchDetailsResponse.error.message
              );
              return;
            } else {
              message.error('Could not update the match details');
              return;
            }
          } else {
            this.props.history.push('/kabaddi/match-list');
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

    const errors = {
      title: isFieldTouched('title') && getFieldError('title'),
      subTitle: isFieldTouched('subTitle') && getFieldError('subTitle'),
      matchVenue: isFieldTouched('matchVenue') && getFieldError('matchVenue'),
      leagueName: isFieldTouched('leagueName') && getFieldError('leagueName')
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>Edit Match Details| Admin Dashboard</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit}>
          <Card title="Edit Match Details">
            <FormItem
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title || ''}
              {...formItemLayout}
              label={<span>Title</span>}
            >
              {getFieldDecorator('title', {
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
              validateStatus={errors.subTitle ? 'error' : ''}
              help={errors.subTitle || ''}
              {...formItemLayout}
              label={<span>Sub Title</span>}
            >
              {getFieldDecorator('subTitle', {
                rules: [
                  {
                    required: false,
                    message: ' ',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.matchVenue ? 'error' : ''}
              help={errors.matchVenue || ''}
              {...formItemLayout}
              label={<span>Match Venue</span>}
            >
              {getFieldDecorator('matchVenue', {
                rules: [
                  {
                    required: false,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              validateStatus={errors.leagueName ? 'error' : ''}
              help={errors.leagueName || ''}
              {...formItemLayout}
              label={<span>League Name</span>}
            >
              {getFieldDecorator('leagueName', {
                rules: [
                  {
                    required: true,
                    message: 'This is a mandatory field',
                    whitespace: true
                  }
                ]
              })(<Input />)}
            </FormItem>
            <Row>
              {this.state.loadImage && (
                <Col span={6} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.getHomeTeamImage}
                    header={'Home Team Image'}
                    actions={this.props.actions}
                    previewImage={this.state.previewImage1}
                    fileList={this.state.fileList1}
                  />
                </Col>
              )}
              {this.state.loadImage2 && (
                <Col span={6}>
                  <ImageUploader
                    callbackFromParent={this.getAwayTeamImage}
                    header={'Away Team Image'}
                    actions={this.props.actions}
                    previewImage={this.state.previewImage2}
                    fileList={this.state.fileList2}
                  />
                </Col>
              )}
            </Row>
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fantasy: state.kabaddi
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...kabaddiActions }, dispatch)
  };
}
const EditMatchDetailsForm = Form.create()(EditMatchDetails);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMatchDetailsForm);
