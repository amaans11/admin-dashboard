import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Icon,
  Select,
  Button,
  message,
  Switch,
  Steps,
  Row,
  Col
} from 'antd';
import moment from 'moment';
import ImageUploader from './ImageUploader';
import * as offerActions from '../../actions/offerActions';
import _ from 'lodash';

const FormItem = Form.Item;
const { Step } = Steps;
const Option = Select.Option;
const { TextArea } = Input;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const CountryList = ['ID', 'IN', 'US'].map(country => (
  <Option value={country} key={country}>
    {country}
  </Option>
));

const couponTypes = [
  {
    label: 'Tournament Ticket Coupon',
    value: 'TOURNAMENT_TICKET_COUPON'
  },
  {
    label: 'Tournament Ticket Voucher',
    value: 'TOURNAMENT_TICKET_VOUCHER'
  },
  {
    label: 'Season Pass',
    value: 'SEASON_PASS'
  },
  {
    label: 'Prime Tournament Ticket',
    value: 'PRIME_TOURNAMENT_TICKET_COUPON'
  }
];
const businessDomains = ['RUMMY', 'POKER', 'FANTASY', 'GAMES'];

const stringifyDescList = data => {
  let result = '';
  if (data && data.length > 0) {
    let newData = data.map(el => el.desc);
    result = JSON.stringify(newData);
  }

  return result;
};

const stringifyTermsAndConditions = data => {
  let result = '';
  if (data && data.length > 0) {
    let newData = data.map(el => el.term);
    result = JSON.stringify(newData);
  }

  return result;
};

const styles = {
  mt20: {
    marginTop: 20
  },
  alignRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20
  },
  nextBtn: {
    float: 'right',
    marginTop: 20
  },
  flexView: {
    float: 'right',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20
  }
};
class CreateTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      isActive: false,
      currentStep: 0,
      couponCode: '',
      couponType: 'TOURNAMENT_TICKET_COUPON',
      businessDomain: '',
      error: false,
      minDepositAmount: '',
      couponExpiry: moment(),
      loadImage1: false,
      imageLoading: false,
      image1FileList: [],
      countryCode: 'IN',
      descriptionList: [{ desc: '' }],
      termsAndConditions: [{ term: '' }]
    };
  }
  componentDidMount() {
    this.props.form.validateFields();

    if (
      this.props.history.location.state &&
      this.props.history.location.state.record
    ) {
      const record = this.props.history.location.state.record;
      const countryCode = this.props.history.location.state.countryCode;

      console.log("record.offerDetails.descriptionList", record.offerDetails)
      console.log("record.offerDetails.descriptionList", JSON.parse(record.offerDetails.descriptionList))

      this.setState({
        edit: true,
        isActive: record.isActive,
        couponCode: record.offerCode,
        couponType: record.offerType,
        businessDomain: record.offerDetails.businessDomain,
        couponExpiry: moment(record.offerExpiry, 'x'),
        minDepositAmount: record.offerDetails.minDepositAmount
          ? parseInt(record.offerDetails.minDepositAmount)
          : '',
        ticketValue: record.offerDetails.ticketValue
          ? parseInt(record.offerDetails.ticketValue)
          : '',
        expiryInMinutes: record.offerDetails.expiryInMinutes
          ? parseInt(record.offerDetails.expiryInMinutes)
          : '',
        totalRedeemCount: record.offerDetails.totalRedeemCount
          ? parseInt(record.offerDetails.totalRedeemCount)
          : '',
        title: record.offerDetails.title ? record.offerDetails.title : '',
        subTitle: record.offerDetails.subtitle
          ? record.offerDetails.subtitle
          : '',
        description: record.offerDetails.description
          ? record.offerDetails.description
          : '',
        actualPrice:
          record.offerType === 'TOURNAMENT_TICKET_VOUCHER'
            ? record.offerDetails.actualPrice
              ? parseInt(record.offerDetails.actualPrice)
              : ''
            : record.offerDetails.price
              ? parseInt(record.offerDetails.price)
              : '',
        discountedPrice: record.offerDetails.discountedPrice
          ? parseInt(record.offerDetails.discountedPrice)
          : '',
        sportId: record.offerDetails.sportId
          ? parseInt(record.offerDetails.sportId)
          : '',
        leagueId: record.offerDetails.leagueId
          ? record.offerDetails.leagueId
          : '',
        modalDescription: record.offerDetails.modalDescription
          ? record.offerDetails.modalDescription
          : '',
        moneyTypeToBuy: record.offerDetails.moneyTypeToBuy
          ? record.offerDetails.moneyTypeToBuy
          : '',
        webViewLink: record.offerDetails.webViewLink
          ? record.offerDetails.webViewLink
          : '',
        additionalText: record.offerDetails.additionalText
          ? record.offerDetails.additionalText
          : '',
        descriptionList: record.offerDetails.descriptionList
          && record.offerDetails.descriptionList.length > 0
          && record.offerDetails.descriptionList[0]
          ? JSON.parse(record.offerDetails.descriptionList)
          : [{ desc: "" }],
        termsAndConditions: record.offerDetails.termsAndConditions
          ? JSON.parse(record.offerDetails.termsAndConditions)
          : [],
        countryCode: countryCode ? countryCode : 'IN',
        visibleAt: moment(record.visibleAt, 'x')
      });
    }
  }
  selectCountry(value) {
    this.setState({
      countryCode: value
    });
  }
  uploadImage1 = data => {
    this.setState({
      image1: data && data.id ? data.id : ''
    });
  };
  copyImage1(imageUrl) {
    let url = '';
    this.setState({
      previewImage1: imageUrl,
      image1FileList: [
        {
          uid: -1,
          name: 'image.png',
          status: 'done',
          url: imageUrl
        }
      ]
    });

    if (_.includes(imageUrl, '""')) {
      url = imageUrl.split('""/').pop();
    } else {
      url = imageUrl;
    }
    this.setState({
      image1: url,
      loadImage1: true
    });
  }
  onCouponCodeChange = e => {
    this.setState({
      couponCode: e.target.value
    });
  };
  onCouponTypeChange = value => {
    this.setState({
      couponType: value
    });
  };
  isImageLoading = data => {
    this.setState({
      imageLoading: data
    });
  };
  onBusinessDomainChange = value => {
    this.setState({
      businessDomain: value
    });
  };

  addNewDescriptionList = () => {
    const { descriptionList } = this.state;
    const fields = [...descriptionList];
    fields.push({ desc: '' });
    this.setState({ descriptionList: fields });
  };

  addNewTerms = () => {
    const { termsAndConditions } = this.state;
    const fields = [...termsAndConditions];
    fields.push({ term: '' });
    this.setState({ termsAndConditions: fields });
  };
  handleChangeDescription = (index, e) => {
    const { descriptionList } = this.state;
    const values = [...descriptionList];
    values[index]['desc'] = e.target.value;

    this.setState({
      descriptionList: values
    });
  };

  handleChangeTerms = (index, e) => {
    const { termsAndConditions } = this.state;
    const values = [...termsAndConditions];
    values[index]['term'] = e.target.value;

    this.setState({
      termsAndConditions: values
    });
  };

  validateRecord = () => {
    const {
      couponType,
      businessDomain,
      couponExpiry,
      minDepositAmount,
      ticketValue,
      expiryInMinutes,
      totalRedeemCount,
      title,
      subTitle,
      description,
      actualPrice,
      discountedPrice,
      sportId,
      leagueId,
      modalDescription,
      moneyTypeToBuy,
      visibleAt
    } = this.state;

    let isValid = false;

    switch (couponType) {
      case 'TOURNAMENT_TICKET_COUPON':
        if (
          couponExpiry &&
          totalRedeemCount &&
          ticketValue &&
          expiryInMinutes &&
          minDepositAmount
        ) {
          isValid = true;
        }
        break;
      case 'TOURNAMENT_TICKET_VOUCHER':
        if (
          couponExpiry &&
          totalRedeemCount &&
          ticketValue &&
          expiryInMinutes &&
          moneyTypeToBuy &&
          actualPrice &&
          discountedPrice
        ) {
          isValid = true;
        }
        break;
      case 'SEASON_PASS':
        if (couponExpiry && title && subTitle && description && actualPrice) {
          isValid = true;
          if (businessDomain === 'FANTASY') {
            if (sportId) {
              isValid = true;
            } else {
              isValid = false;
            }
          }
        }
        break;
      case 'PRIME_TOURNAMENT_TICKET_COUPON':
        if (couponExpiry && ticketValue && visibleAt) {
          isValid = true;
        }
        break;
      default:
        isValid = false;
    }
    return isValid;
  };
  handleChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      couponCode,
      isActive,
      couponType,
      businessDomain,
      couponExpiry,
      minDepositAmount,
      ticketValue,
      expiryInMinutes,
      totalRedeemCount,
      title,
      subTitle,
      description,
      actualPrice,
      discountedPrice,
      sportId,
      leagueId,
      modalDescription,
      moneyTypeToBuy,
      additionalText,
      descriptionList,
      termsAndConditions,
      webViewLink,
      image1,
      countryCode,
      visibleAt
    } = this.state;

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let payload = {};
        const data = {
          couponCode: couponCode,
          couponType: couponType,
          couponExpiry: moment(couponExpiry).format('x'),
          countryCode: countryCode,
          isActive: isActive ? isActive : false,
          couponDetails: {
            businessDomain: businessDomain,
            totalRedeemCount: totalRedeemCount
          }
        };
        if (couponType == 'PRIME_TOURNAMENT_TICKET_COUPON') {
          const couponDetails = {
            ...data.couponDetails,
            minDepositAmount: minDepositAmount,
            ticketValue: ticketValue,
            expiryInMinutes: expiryInMinutes,
            visibleAt: moment(visibleAt).format('x')
          };
          payload = {
            ...data,
            couponDetails: couponDetails
          };
        } else if (couponType === 'TOURNAMENT_TICKET_COUPON') {
          const couponDetails = {
            ...data.couponDetails,
            minDepositAmount: minDepositAmount,
            ticketValue: ticketValue,
            expiryInMinutes: expiryInMinutes
          };
          payload = {
            ...data,
            couponDetails: couponDetails
          };
        } else if (couponType === 'TOURNAMENT_TICKET_VOUCHER') {
          const couponDetails = {
            ...data.couponDetails,
            ticketValue: ticketValue,
            expiryInMinutes: expiryInMinutes,
            moneyTypeToBuy: moneyTypeToBuy,
            actualPrice: actualPrice,
            discountedPrice: discountedPrice ? discountedPrice : ''
          };
          payload = {
            ...data,
            couponDetails: couponDetails
          };
        } else {
          delete data.couponDetails.businessDomain;
          delete data.couponDetails.totalRedeemCount;

          const couponDetails = {
            ...data.couponDetails,
            title: title,
            subtitle: subTitle,
            description: description,
            modalDescription: modalDescription,
            price: actualPrice ? actualPrice : '',
            sportId: sportId ? sportId : '',
            leagueId: leagueId ? leagueId : '',
            businessDomain: businessDomain,
            additionalText: additionalText ? additionalText : '',
            descriptionList: descriptionList ? descriptionList : [],
            termsAndConditions: termsAndConditions ? termsAndConditions : [],
            webViewLink: webViewLink ? webViewLink : '',
            ticketImageUrl: image1 ? image1 : ''
          };

          const descList = stringifyDescList(couponDetails.descriptionList);
          const termList = stringifyTermsAndConditions(
            couponDetails.termsAndConditions
          );

          couponDetails.descriptionList = descList;
          couponDetails.termsAndConditions = termList;

          if (discountedPrice) {
            payload = {
              ...data,
              couponDetails: {
                ...couponDetails,
                discountedPrice: discountedPrice
              }
            };
          } else {
            payload = {
              ...data,
              couponDetails: couponDetails
            };
          }
        }

        this.props.actions.createTicket(payload).then(() => {
          if (this.props.createTicketResponse.error) {
            message.error('Invalid Inputs!Please try again');
          } else if (!this.props.createTicketResponse.isAdded) {
            message.error('Tournament Ticket cannot be created');
          } else {
            this.props.history.push('/tournament-ticket');
          }
        });
      }
    });
  };
  render() {
    const {
      edit,
      currentStep,
      couponCode,
      couponType,
      businessDomain,
      couponExpiry,
      minDepositAmount,
      ticketValue,
      expiryInMinutes,
      totalRedeemCount,
      title,
      subTitle,
      description,
      actualPrice,
      discountedPrice,
      sportId,
      leagueId,
      modalDescription,
      moneyTypeToBuy,
      additionalText,
      descriptionList,
      termsAndConditions,
      webViewLink,
      countryCode,
      visibleAt
    } = this.state;
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
    const isValid = this.validateRecord();

    console.log("state>>>", this.state.descriptionList)
    return (
      <React.Fragment>
        <div style={{ margin: 50 }}>
          <Steps current={currentStep} style={{ width: '80%' }}>
            <Step key="ticket_type" title="Ticket Type" />
            <Step key="business_domain" title="Business Domain" />
            <Step key="ticket_details" title="Ticket Details" />
          </Steps>
          {currentStep === 0 ? (
            <Card style={styles.mt20}>
              <Row style={styles.mt20}>
                <Col sm={6} style={styles.alignRight}>
                  Country:
                </Col>
                <Col sm={6}>
                  <Select
                    onSelect={e => this.selectCountry(e)}
                    style={{ width: 200 }}
                    placeholder="Select country"
                    value={countryCode}
                  >
                    {CountryList}
                  </Select>
                </Col>
              </Row>
              <Row style={styles.mt20}>
                <Col sm={6} style={styles.alignRight}>
                  Coupon Code:
                </Col>
                <Col sm={6}>
                  <Input
                    onChange={this.onCouponCodeChange}
                    value={couponCode}
                    disabled={edit}
                  />
                </Col>
              </Row>
              <Row style={styles.mt20}>
                <Col sm={6} style={styles.alignRight}>
                  Coupon Type:
                </Col>
                <Col sm={6}>
                  <Select
                    style={{ width: 300 }}
                    defaultValue="Tournament_Ticket_Coupon"
                    onChange={this.onCouponTypeChange}
                    value={couponType}
                  >
                    {couponTypes.map(type => (
                      <Option value={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Button
                type="primary"
                style={styles.nextBtn}
                disabled={!couponCode || !couponType}
                onClick={() => {
                  this.setState({ currentStep: 1 });
                }}
              >
                Next
              </Button>
            </Card>
          ) : currentStep === 1 ? (
            <Card style={styles.mt20}>
              <Row style={styles.mt20}>
                <Col sm={6} style={styles.alignRight}>
                  Business Domain:
                </Col>
                <Col sm={6}>
                  <Select
                    style={{ width: 200 }}
                    onChange={this.onBusinessDomainChange}
                    value={businessDomain}
                  >
                    {couponType === 'SEASON_PASS' ? (
                      <Option value="FANTASY">FANTASY</Option>
                    ) : couponType === 'PRIME_TOURNAMENT_TICKET_COUPON' ? (
                      [...businessDomains, 'GENERIC'].map(type => (
                        <Option value={type}>{type}</Option>
                      ))
                    ) : (
                      businessDomains.map(type => (
                        <Option value={type}>{type}</Option>
                      ))
                    )}
                  </Select>
                </Col>
              </Row>
              <div style={styles.flexView}>
                <Button
                  onClick={() => {
                    this.setState({ currentStep: 0 });
                  }}
                >
                  Previous
                </Button>
                <Button
                  type="primary"
                  disabled={!businessDomain}
                  onClick={() => {
                    this.setState({ currentStep: 2, error: true });
                  }}
                >
                  Next
                </Button>
              </div>
            </Card>
          ) : (
            <Card bordered={false}>
              <Row style={styles.mt20}>
                <Col sm={6} style={styles.alignRight}>
                  Coupon Expiry:
                </Col>
                <Col sm={6}>
                  <DatePicker
                    allowClear="true"
                    showTime
                    format="YYYY-MM-DD hh:mm A"
                    placeholder={'Select Coupon Expiry'}
                    onChange={value => this.handleChange('couponExpiry', value)}
                    value={couponExpiry}
                    format="DD-MM-YYYY HH:mm"
                  />
                </Col>
              </Row>
              {couponType === 'TOURNAMENT_TICKET_COUPON' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Min Deposit Amount:
                  </Col>
                  <Col sm={6}>
                    <Input
                      type="number"
                      onChange={e => {
                        this.handleChange('minDepositAmount', e.target.value);
                      }}
                      value={minDepositAmount}
                    />
                  </Col>
                </Row>
              )}

              {couponType !== 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Ticket Value:
                  </Col>
                  <Col sm={6}>
                    <Input
                      type="number"
                      onChange={e => {
                        this.handleChange('ticketValue', e.target.value);
                      }}
                      value={ticketValue}
                    />
                  </Col>
                </Row>
              )}
              {(couponType === 'TOURNAMENT_TICKET_COUPON' ||
                couponType === 'TOURNAMENT_TICKET_VOUCHER') && (
                  <Row style={styles.mt20}>
                    <Col sm={6} style={styles.alignRight}>
                      Expiry(in minutes)
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="number"
                        onChange={e => {
                          this.handleChange('expiryInMinutes', e.target.value);
                        }}
                        value={expiryInMinutes}
                      />
                    </Col>
                  </Row>
                )}
              {(couponType === 'TOURNAMENT_TICKET_COUPON' ||
                couponType === 'TOURNAMENT_TICKET_VOUCHER') && (
                  <Row style={styles.mt20}>
                    <Col sm={6} style={styles.alignRight}>
                      Total Redeem Count
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="number"
                        onChange={e => {
                          this.handleChange('totalRedeemCount', e.target.value);
                        }}
                        value={totalRedeemCount}
                      />
                    </Col>
                  </Row>
                )}
              {couponType == 'PRIME_TOURNAMENT_TICKET_COUPON' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Visible At :
                  </Col>
                  <Col sm={6}>
                    <DatePicker
                      allowClear="true"
                      showTime
                      format="YYYY-MM-DD hh:mm A"
                      placeholder={'Select Visible Date'}
                      onChange={value => this.handleChange('visibleAt', value)}
                      value={visibleAt}
                      format="DD-MM-YYYY HH:mm"
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'TOURNAMENT_TICKET_VOUCHER' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Money Type To Buy
                  </Col>
                  <Col sm={6}>
                    <Select
                      style={{ width: 200 }}
                      defaultValue="LP"
                      onChange={value => {
                        this.handleChange('moneyTypeToBuy', value);
                      }}
                      value={moneyTypeToBuy}
                    >
                      <Option value="LP">LP</Option>
                    </Select>
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Title
                  </Col>
                  <Col sm={6}>
                    <Input
                      onChange={e => {
                        this.handleChange('title', e.target.value);
                      }}
                      value={title}
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Sub Title:
                  </Col>
                  <Col sm={6}>
                    <Input
                      onChange={e => {
                        this.handleChange('subTitle', e.target.value);
                      }}
                      value={subTitle}
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Description
                  </Col>
                  <Col sm={6}>
                    <Input
                      onChange={e => {
                        this.handleChange('description', e.target.value);
                      }}
                      value={description}
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Additional Text:
                  </Col>
                  <Col sm={6}>
                    <TextArea
                      rows={3}
                      onChange={e => {
                        this.handleChange('additionalText', e.target.value);
                      }}
                      value={additionalText}
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row>
                  {descriptionList &&
                    descriptionList.length > 0 &&
                    descriptionList.map((description, index) => (
                      <Row style={styles.mt20} id={index}>
                        <Col sm={6} style={styles.alignRight}>
                          Description List:
                        </Col>
                        <Col sm={6}>
                          <TextArea
                            rows={3}
                            onChange={e => {
                              this.handleChangeDescription(index, e);
                            }}
                            name="desc"
                            value={description && description.desc}
                          />
                        </Col>
                      </Row>
                    ))}
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => this.addNewDescriptionList()}
                    style={{ marginTop: 20, marginLeft: 500 }}
                  >
                    Add Description List
                  </Button>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row>
                  {termsAndConditions &&
                    termsAndConditions.length > 0 &&
                    termsAndConditions.map((terms, index) => (
                      <Row style={styles.mt20} id={index}>
                        <Col sm={6} style={styles.alignRight}>
                          Terms And Conditions:
                        </Col>
                        <Col sm={6}>
                          <TextArea
                            rows={3}
                            onChange={e => {
                              this.handleChangeTerms(index, e);
                            }}
                            name="term"
                            value={terms.term}
                          />
                        </Col>
                      </Row>
                    ))}
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => this.addNewTerms()}
                    style={{ marginTop: 20, marginLeft: 500 }}
                  >
                    Add Terms And Conditions
                  </Button>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Web-View Link:
                  </Col>
                  <Col sm={6}>
                    <Input
                      onChange={e => {
                        this.handleChange('webViewLink', e.target.value);
                      }}
                      value={webViewLink}
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Modal Description
                  </Col>
                  <Col sm={6}>
                    <Input
                      onChange={e => {
                        this.handleChange('modalDescription', e.target.value);
                      }}
                      value={modalDescription}
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && businessDomain === 'FANTASY' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Sport Id
                  </Col>
                  <Col sm={6}>
                    <Input
                      type="number"
                      onChange={e => {
                        this.handleChange('sportId', e.target.value);
                      }}
                      value={sportId}
                    />
                  </Col>
                </Row>
              )}
              {couponType === 'SEASON_PASS' && businessDomain === 'FANTASY' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    League Id
                  </Col>
                  <Col sm={6}>
                    <Input
                      onChange={e => {
                        this.handleChange('leagueId', e.target.value);
                      }}
                      value={leagueId}
                    />
                  </Col>
                </Row>
              )}
              {!(
                couponType === 'TOURNAMENT_TICKET_COUPON' ||
                couponType === 'PRIME_TOURNAMENT_TICKET_COUPON'
              ) && (
                  <Row style={styles.mt20}>
                    <Col sm={6} style={styles.alignRight}>
                      Actual Price
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="number"
                        onChange={e => {
                          this.handleChange('actualPrice', e.target.value);
                        }}
                        value={actualPrice}
                      />
                    </Col>
                  </Row>
                )}
              {!(
                couponType === 'TOURNAMENT_TICKET_COUPON' ||
                couponType === 'PRIME_TOURNAMENT_TICKET_COUPON'
              ) && (
                  <Row style={styles.mt20}>
                    <Col sm={6} style={styles.alignRight}>
                      Discounted Price
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="number"
                        onChange={e => {
                          this.handleChange('discountedPrice', e.target.value);
                        }}
                        value={discountedPrice}
                      />
                    </Col>
                  </Row>
                )}
              <Row style={styles.mt20}>
                <Col sm={6} style={styles.alignRight}>
                  Active Status
                </Col>
                <Col sm={6}>
                  <Switch
                    onChange={value => {
                      this.setState({ isActive: value });
                    }}
                    checked={this.state.isActive}
                  />
                </Col>
              </Row>
              {couponType == 'SEASON_PASS' && (
                <Row style={styles.mt20}>
                  <Col sm={6} style={styles.alignRight}>
                    Ticket Image Url
                  </Col>
                  <Col sm={6}>
                    <ImageUploader
                      callbackFromParent={this.uploadImage1}
                      actions={this.props.actions}
                      previewImage={this.state.previewImage1}
                      fileList={this.state.image1FileList}
                      isMandatory={false}
                      isLoading={this.isImageLoading}
                    />
                  </Col>
                </Row>
              )}
              <div style={styles.flexView}>
                <Button
                  onClick={() => {
                    this.setState({ currentStep: 1 });
                  }}
                >
                  Previous
                </Button>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  disabled={!isValid}
                >
                  Submit
                </Button>
              </div>
            </Card>
          )}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    createTicketResponse: state.offers.createTicketResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(offerActions, dispatch)
  };
}

const CreateTicketForm = Form.create()(CreateTicket);
export default connect(mapStateToProps, mapDispatchToProps)(CreateTicketForm);
