import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Form, message, Button, DatePicker, Row, Col, Table } from 'antd';
import { get } from 'lodash';
import * as accountActions from '../../actions/accountsActions';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row'
  }
};
class RefundSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRefundDetails: [],
      totalRefundAmount: 0,
      totalRefundCount: 0,
      startDate: moment()
        .subtract(7, 'days')
        .format('x'),
      endDate: moment().format('x')
    };
  }
  componentDidMount = () => {
    const userId = get(this.props, 'userId', '');
    this.setState(
      {
        userId: userId
      },
      () => {
        this.fetchRefundDetails();
      }
    );
  };
  getDetails = refundDetails => {
    let result = [];
    if (refundDetails && refundDetails.length > 0) {
      refundDetails.map(refund => {
        result.push({
          date: moment(refund.date, 'YYYY-MM-DD').format('DD MMM YYYY'),
          rummy: refund.referenceTypeAmount.RUMMY_CS_REFUND
            ? refund.referenceTypeAmount.RUMMY_CS_REFUND
            : 0,
          battle: refund.referenceTypeAmount.BATTLE_WINNINGS_CS_REFUND
            ? refund.referenceTypeAmount.BATTLE_WINNINGS_CS_REFUND
            : 0,
          tournament: refund.referenceTypeAmount.TOURNAMENT_WINNINGS_CS_REFUND
            ? refund.referenceTypeAmount.TOURNAMENT_WINNINGS_CS_REFUND
            : 0,
          poker: refund.referenceTypeAmount.POKER_CS_REFUND
            ? refund.referenceTypeAmount.POKER_CS_REFUND
            : 0,
          fantasy: refund.referenceTypeAmount.FANTASY_CS_REFUND
            ? refund.referenceTypeAmount.FANTASY_CS_REFUND
            : 0
        });
      });
    }
    return result;
  };
  fetchRefundDetails = () => {
    const { userId, startDate, endDate } = this.state;

    const data = {
      userId,
      startDate: startDate.substring(0, 10),
      endDate: endDate.substring(0, 10),
      countryCode: this.props.countryCode
    };
    this.props.actions.getUserRefundDetails(data).then(() => {
      if (this.props.userRefundDetails.error) {
        message.error(this.props.userRefundDetails.error.message);
      } else {
        const {
          refundDetails,
          totalRefundedAmount,
          totalRefundCount
        } = this.props.userRefundDetails;
        const result = this.getDetails(refundDetails);
        this.setState({
          userRefundDetails: result,
          totalRefundAmount: totalRefundedAmount,
          totalRefundCount: totalRefundCount
        });
      }
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const startDate = values.timeArray[0].format('x');

      const endDate = values.timeArray[1].format('x');

      this.setState(
        {
          startDate: startDate,
          endDate: endDate
        },
        () => {
          const diff = moment(this.state.endDate, 'x').diff(
            moment(this.state.startDate, 'x'),
            'days'
          );
          if (diff <= 15) {
            this.fetchRefundDetails();
          } else {
            message.error('Date Range must be less than or equal to 15 days');
          }
        }
      );
    });
  };
  getColumns = () => {
    const columns = [
      {
        title: 'Date',
        key: 'date',
        dataIndex: 'date'
      },
      {
        title: 'Battle',
        key: 'battle',
        dataIndex: 'battle'
      },
      {
        title: 'Tournament',
        key: 'tournament',
        dataIndex: 'tournament'
      },
      {
        title: 'Rummy',
        key: 'rummy',
        dataIndex: 'rummy'
      },
      {
        title: 'Poker',
        key: 'poker',
        dataIndex: 'poker'
      },
      {
        title: 'Fantasy',
        key: 'fantasy',
        dataIndex: 'fantasy'
      }
    ];
    return columns;
  };
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
      timeArray: isFieldTouched('timeArray') && getFieldError('timeArray')
    };
    const columns = this.getColumns();
    const {
      totalRefundAmount,
      totalRefundCount,
      userRefundDetails
    } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <div style={styles.container}>
            <FormItem
              validateStatus={errors.timeArray ? 'error' : ''}
              help={errors.timeArray || ''}
              {...formItemLayout}
              label={'Duration'}
            >
              {getFieldDecorator('timeArray', {
                rules: [
                  {
                    required: true,
                    type: 'array',
                    message: 'Please input time duration!',
                    whitespace: false
                  }
                ]
              })(
                <RangePicker
                  style={{ width: '80%' }}
                  allowClear={true}
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['Start Date', 'End Date']}
                />
              )}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginBottom: 20 }}
            >
              Get Refund Details
            </Button>
          </div>
        </Form>
        <div style={{ margin: 20 }}>
          <Row>
            <Col sm={6}>
              <h4>Total Amount Refunded:{totalRefundAmount}</h4>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <h4>Total Refund Count:{totalRefundCount}</h4>
            </Col>
          </Row>
        </div>
        <Table
          rowKey="teamId"
          bordered
          dataSource={userRefundDetails}
          columns={columns}
          pagination={false}
          scroll={{ x: '100%' }}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    userRefundDetails: state.accounts.userRefundDetails
  };
};
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...accountActions }, dispatch)
  };
}
const RefundSelectionForm = Form.create()(RefundSelection);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RefundSelectionForm);
