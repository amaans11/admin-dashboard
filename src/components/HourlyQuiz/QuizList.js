import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hourlyQuizActions from '../../actions/HourlyQuizActions';
import { Card, Table, Button, Modal, DatePicker, Popconfirm } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
class QuizList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      startTime: moment(),
      endTime: moment().add(1, 'days'),
      tableData: [],
      showDetails: false,
      questionDetails: {}
    };
    this.editDetails = this.editDetails.bind(this);
    this.toggle = this.toggle.bind(this);
    this.fetchList = this.fetchList.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }
  componentDidMount() {
    let data = {
      startDate: moment.utc(this.state.startTime).format('YYYY-MM-DD'),
      endDate: moment.utc(this.state.endTime).format('YYYY-MM-DD')
    };
    this.props.actions.getHourlyQuiz(data).then(() => {
      if (this.props.hourlyQuizList && this.props.hourlyQuizList.questions) {
        this.setState({
          tableData: [...this.props.hourlyQuizList.questions]
        });
      }
      this.setState({
        showTable: true
      });
    });
  }

  editDetails(record, editType) {
    this.props.actions.cloneDetails(record, editType);
    this.props.history.push('/hourly/add');
  }

  toggle(record, flag) {
    let data = record;
    if (data.startTime && data.endTime) {
      data.startTime = moment(data.startTime).toISOString();
      data.endTime = moment(data.endTime).toISOString();
    }

    data.isActive = flag;
    this.props.actions.updateHourlyQuiz(data).then(() => {
      window.location.reload();
    });
  }

  fetchList(field, value) {
    console.log('field', field);
    let data = {
      startDate: field[0].format('YYYY-MM-DD'),
      endDate: field[1].format('YYYY-MM-DD')
    };
    console.log('data', data);
    this.props.actions.getHourlyQuiz(data).then(() => {
      if (this.props.hourlyQuizList && this.props.hourlyQuizList.questions) {
        this.setState({
          tableData: [...this.props.hourlyQuizList.questions]
        });
      }
      this.setState({
        showTable: true
      });
    });
  }

  showDetails(record) {
    this.setState({
      showDetails: true,
      questionDetails: JSON.stringify(record)
    });
  }

  render() {
    const columns = [
      {
        title: 'Id',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: 'Question',
        key: 'question',
        dataIndex: 'question'
      },
      {
        title: 'Question Type',
        key: 'questionType',
        dataIndex: 'questionType'
      },
      {
        title: 'Start Time',
        key: 'startTime',
        render: record => (
          <span>{moment(record.startTime).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'End time',
        key: 'endTime',
        render: record => (
          <span>{moment(record.endTime).format('YYYY-MM-DD HH:mm')}</span>
        )
      },
      {
        title: 'Preview',
        key: 'imageUrl',
        render: record => (
          <span>
            {record.imgOptions && record.imgOptions[0] && (
              <span>
                <img
                  className="baner-list-img"
                  src={record.imgOptions[0].imgUrl}
                  alt=""
                />
                <div>{record.imgOptions[0].title}</div>
              </span>
            )}
            {record.imgOptions && record.imgOptions[1] && (
              <span>
                <img
                  className="baner-list-img"
                  src={record.imgOptions[1].imgUrl}
                  alt=""
                />
                <div>{record.imgOptions[1].title}</div>
              </span>
            )}
            {/* {record.imgOptions && record.imgOptions[0] &&  (
              <span>
                <img
                  className="baner-list-img"
                  src={record.imgOptions[0].imgUrl}
                  alt=""
                />
              </span>
            }
            { record.imgOptions && record.imgOptions[1] &&
                <span>
                <img
                className="baner-list-img"
                src={record.imgOptions[1].imgUrl}
                alt=""
              />
                </span>
            }   */}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        render: record => (
          <span>
            <Button
              shape="circle"
              icon="info"
              onClick={() => this.showDetails(record)}
              type="primary"
            />
            <Button
              style={{ marginLeft: '20px' }}
              icon="edit"
              type="primary"
              onClick={() => this.editDetails(record, 'EDIT')}
            />
            {/* <Button
              style={{ marginLeft: '20px' }}
              icon="copy"
              type="primary"
              onClick={() => this.editDetails(record, 'CLONE')}
            /> */}
            {!record.isActive ? (
              <Button
                style={{ marginLeft: '20px', backgroundColor: '#32CD32' }}
                onClick={() => this.toggle(record, true)}
              >
                Activate
              </Button>
            ) : (
              <Popconfirm
                title="Sure to deactivate this question?"
                onConfirm={() => this.toggle(record, false)}
              >
                <Button
                  style={{
                    marginLeft: '20px',
                    backgroundColor: '#d62a2a',
                    color: 'white'
                  }}
                >
                  Deactivate
                </Button>
              </Popconfirm>
            )}
          </span>
        )
      }
    ];
    const hideModal = () => {
      this.setState({
        showDetails: false
      });
    };
    return (
      <React.Fragment>
        {this.state.showTable ? (
          <Card
            extra={
              <RangePicker
                defaultValue={[this.state.startTime, this.state.endTime]}
                format={dateFormat}
                onChange={this.fetchList}
              />
            }
          >
            <Table
              rowKey="id"
              bordered
              dataSource={this.state.tableData}
              columns={columns}
            />
          </Card>
        ) : (
          ''
        )}

        <Modal
          title={'Question Details'}
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={hideModal}
          onOk={hideModal}
          visible={this.state.showDetails}
        >
          <Card bordered={false}>{this.state.questionDetails}</Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    hourlyQuizList: state.hourlyQuiz.hourlyQuizList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...hourlyQuizActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizList);
