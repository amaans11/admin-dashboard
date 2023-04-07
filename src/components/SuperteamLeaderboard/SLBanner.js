import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  Form,
  message,
  Button,
  Select,
  Col,
  Row,
  Input,
  Spin,
  Radio,
  Checkbox
} from 'antd';
import * as superteamLeaderboardActions from '../../actions/SuperteamLeaderboardActions';
import ImageUploader from './ImageUploader';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const FantasyGameOptions = [
  <Option key={7} value={7}>
    Cricket
  </Option>,
  <Option key={5} value={5}>
    Football
  </Option>,
  <Option key={8} value={8}>
    Kabaddi
  </Option>,
  <Option key={101} value={101}>
    Stock
  </Option>,
  <Option key={6} value={6}>
    Basketball
  </Option>,
  <Option key={3} value={3}>
    Baseball
  </Option>,
  <Option key={4} value={4}>
    Hockey
  </Option>
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SLBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sportId: 5,
      image: '',
      loadImage: false,
      imageLoading: false,
      countryCode: []
    };
    this.copyImage = this.copyImage.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.form.validateFields();
    if (this.props.slBannerDetails) {
      this.fillEditFields();
    } else {
      this.setState({ loadImage: true });
    }
  }
  handleCountryChange = value => {
    this.setState({
      countryCode: value
    });
  };

  fillEditFields() {
    let slBannerDetails = { ...this.props.slBannerDetails };
    this.props.form.setFieldsValue({
      sportId: slBannerDetails.sportId,
      title: slBannerDetails.title,
      subtitle: slBannerDetails.subtitle,
      isActive: slBannerDetails.isActive ? slBannerDetails.isActive : false,
      countryCode: slBannerDetails.countryCode
    });
    this.copyImage(slBannerDetails.image);

    this.setState({
      countryCode: slBannerDetails.countryCode
    });
  }

  copyImage(image) {
    let url = '';
    this.setState({
      previewImage: image,
      fileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: image
        }
      ]
    });

    if (_.includes(image, '""')) {
      url = image.split('""/').pop();
    } else {
      url = image;
    }
    this.setState({
      iamge: url,
      loadImage: true
    });
  }

  sportSelected(value) {
    this.setState({ sportId: value });
  }

  getImageUrl = data => {
    this.setState({
      image: data && data.id ? data.id : ''
    });
  };

  isImageLoading = data => {
    this.setState({
      imageLoading: data
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.image === '') {
          message.error('Please upload a banner image');
        }
        if (this.state.countryCode.length == 0) {
          message.error('Please select a country');
        }
        if (this.props.actionType && this.props.actionType === 'EDIT') {
          let editData = {
            title: values.title,
            subtitle: values.subtitle,
            image: this.state.image,
            sportId: values.sportId,
            isActive: values.isActive,
            bannerId: this.props.slBannerDetails.bannerId
              ? this.props.slBannerDetails.bannerId
              : 0,
            enabled: this.props.slBannerDetails.enabled
              ? this.props.slBannerDetails.enabled
              : false,
            countryCode: this.state.countryCode
          };
          this.props.actions.editDefaultBanner(editData).then(() => {
            if (this.props.editDefaultBannerResponse) {
              if (this.props.editDefaultBannerResponse.error) {
                message.error(
                  this.props.editDefaultBannerResponse.error.message
                    ? this.props.editDefaultBannerResponse.error.message
                    : 'Could not update banner'
                );
              } else {
                this.props.history.push('/superteam-leaderboard/list-banner');
              }
            }
          });
        } else {
          let data = {
            title: values.title,
            subtitle: values.subtitle,
            image: this.state.image,
            sportId: values.sportId,
            isActive: values.isActive,
            countryCode: this.state.countryCode
          };
          this.props.actions.createDefaultBanner(data).then(() => {
            if (this.props.createDefaultBannerResponse) {
              if (this.props.createDefaultBannerResponse.error) {
                message.error(
                  this.props.createDefaultBannerResponse.error.message
                    ? this.props.createDefaultBannerResponse.error.message
                    : 'Could not create banner'
                );
              } else {
                this.props.history.push('/superteam-leaderboard/list-banner');
              }
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
        sm: { span: 8 }
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
      sportId: isFieldTouched('sportId') && getFieldError('sportId'),
      title: isFieldTouched('title') && getFieldError('title'),
      subtitle: isFieldTouched('subtitle') && getFieldError('subtitle')
    };

    return (
      <React.Fragment>
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Card>
            <FormItem
              validateStatus={errors.sportId ? 'error' : ''}
              help={errors.sportId || ''}
              {...formItemLayout}
              label={<span>Sports Id</span>}
            >
              {getFieldDecorator('sportId', {
                initialValue: this.state.sportId,
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please select a sport',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  showSearch
                  style={{ width: '70%' }}
                  placeholder="Select a fantasy sport"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {FantasyGameOptions}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<span>Country</span>}>
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: false,
                    type: 'array'
                  }
                ]
              })(
                <CheckboxGroup
                  options={['ID', 'IN', 'US']}
                  onChange={e => this.handleCountryChange(e)}
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title || ''}
              {...formItemLayout}
              label={'Title'}
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem
              validateStatus={errors.subtitle ? 'error' : ''}
              help={errors.subtitle || ''}
              {...formItemLayout}
              label={'Sub title'}
            >
              {getFieldDecorator('subtitle', {
                rules: [
                  {
                    required: true,
                    whitespace: true
                  }
                ]
              })(<Input style={{ width: '70%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={'Is Active'}>
              {getFieldDecorator('isActive', {
                rules: [
                  {
                    required: true,
                    type: 'boolean',
                    message: 'Please select option for auto finish',
                    whitespace: false
                  }
                ],
                initialValue: false
              })(
                <Radio.Group size="small" buttonStyle="solid">
                  <Radio.Button value={false}>NO</Radio.Button>
                  <Radio.Button value={true}>YES</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            <Row>
              {this.state.loadImage && (
                <Col span={6} offset={6}>
                  <ImageUploader
                    callbackFromParent={this.getImageUrl}
                    header={'Banner Image'}
                    previewImage={this.state.previewImage}
                    fileList={this.state.fileList}
                    isLoading={this.isImageLoading}
                  />
                </Col>
              )}
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <Spin spinning={this.state.imageLoading}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                  >
                    Save
                  </Button>
                </Spin>
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
    createDefaultBannerResponse:
      state.superteamLeaderboard.createDefaultBannerResponse,
    slBannerDetails: state.superteamLeaderboard.slBannerDetails,
    actionType: state.superteamLeaderboard.actionType,
    editDefaultBannerResponse:
      state.superteamLeaderboard.editDefaultBannerResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...superteamLeaderboardActions }, dispatch)
  };
}

const SLBannerForm = Form.create()(SLBanner);
export default connect(mapStateToProps, mapDispatchToProps)(SLBannerForm);
