import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as missionConfigActions from '../../actions/MissionConfigActions';
import * as segmentationActions from '../../actions/segmentationActions';
import {
  Card,
  Form,
  Button,
  Input,
  message,
  Table,
  Popconfirm,
  Modal,
  Select,
  Row,
  Col
} from 'antd';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const COUNTRY_OPTIONS = ['ID', 'IN', 'US'];

class MissionEnabledSegments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: '',
      enabledSegments: [],
      showAddSegmentModal: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getSegmentationList();
  }

  getSegmentationList() {
    this.props.actions.getCustomSegmentList().then(() => {
      if (
        this.props.getCustomSegmentListResponse &&
        this.props.getCustomSegmentListResponse.segment &&
        this.props.getCustomSegmentListResponse.segment.length > 0
      ) {
        this.setState({
          listOfSegments: [...this.props.getCustomSegmentListResponse.segment],
          segmentsFetchedFromBackend: true
        });
      } else {
        this.setState({
          listOfSegments: [],
          segmentsFetchedFromBackend: false
        });
      }
    });
  }

  selectCountry(value) {
    this.setState(
      {
        loaded: false,
        showMainSegment: false,
        countryCode: value
      },
      () => {
        this.getConfig();
      }
    );
  }

  getConfig = () => {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getMissionSegmentationConfig(data).then(() => {
      if (
        this.props.getMissionSegmentationConfigResponse &&
        this.props.getMissionSegmentationConfigResponse.enabledSegments
      ) {
        const { segmentsFetchedFromBackend } = this.state;
        this.setState(
          {
            enabledSegments: [
              ...this.props.getMissionSegmentationConfigResponse.enabledSegments
            ],
            loaded: segmentsFetchedFromBackend ? true : false
          },
          () => {
            if (!segmentsFetchedFromBackend) {
              this.populateDefaultSegments();
            }
          }
        );
      } else {
        message.error('Could not load config');
      }
    });
  };

  openAddSegmentModal() {
    this.setState({ showAddSegmentModal: true });
  }

  closeAddSegmentModal() {
    this.setState({ selectedSegment: null, showAddSegmentModal: false });
  }

  addToEnabledList() {
    let { enabledSegments, selectedSegment } = this.state;
    if (enabledSegments.includes(selectedSegment)) {
      message
        .error('The segment is already present in the list', 1)
        .then(() => {
          this.setState({
            showAddSegmentModal: false
          });
        });
    } else {
      enabledSegments.push(selectedSegment);
      this.setState({
        enabledSegments,
        showAddSegmentModal: false,
        selectedSegment: null
      });
    }
  }

  selectSegment(value) {
    this.setState({
      selectedSegment: value
    });
  }

  populateDefaultSegments() {
    let segmentIdList = [...this.state.enabledSegments];

    let listOfSegments = segmentIdList.map(item => {
      let returnObj = {};
      returnObj['segmentId'] = item;
      return returnObj;
    });

    listOfSegments.unshift({
      segmentId: 'DEFAULT##DEFAULT'
    });

    this.setState({
      listOfSegments,
      loaded: true
    });
  }

  deleteRow(record) {
    let { enabledSegments } = this.state;
    enabledSegments = enabledSegments.filter(segment => segment !== record);
    this.setState({
      enabledSegments
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {
          countryCode: this.state.countryCode,
          editValue: 'ENABLED_SEGMENT',
          enabledSegments: [...this.state.enabledSegments]
        };
        this.props.actions.setMissionSegmentationConfig(data).then(() => {
          if (this.props.setMissionSegmentationConfigResponse) {
            if (this.props.setMissionSegmentationConfigResponse.error) {
              message.error('Could not update');
            } else {
              message.success('Data Uploaded Successfully', 1.5);
            }
          }
        });
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const segmentColumns = [
      {
        title: 'Segment',
        key: 'segment',
        render: (text, record) => <span>{record}</span>
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => (
          <Popconfirm
            title="Sure to delete this record?"
            onConfirm={() => this.deleteRow(record)}
          >
            <Button icon="delete" type="danger" />
          </Popconfirm>
        )
      }
    ];
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const errors = {
      header: isFieldTouched('header') && getFieldError('header'),
      days: isFieldTouched('days') && getFieldError('days'),
      timeDiff: isFieldTouched('timeDiff') && getFieldError('timeDiff')
    };

    return (
      <Card className="page-container" title="Mission Configs">
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Form.Item label={<span>Country</span>}>
            {getFieldDecorator('countryCode', {
              rules: [
                {
                  required: true,
                  message: ' ',
                  whitespace: true
                }
              ]
            })(
              <Select
                showSearch
                onSelect={e => this.selectCountry(e)}
                style={{ width: '100%' }}
                placeholder="Select country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {COUNTRY_OPTIONS.map(country => (
                  <Option value={country} key={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {this.state.loaded && (
            <>
              <Card
                title="Segments"
                extra={
                  <Button
                    style={{ marginTop: '20px' }}
                    onClick={() => this.openAddSegmentModal()}
                    type="primary"
                  >
                    {' '}
                    Add Segment
                  </Button>
                }
              >
                <Table
                  rowKey="segment"
                  style={{ marginTop: '20px' }}
                  bordered
                  pagination={false}
                  dataSource={this.state.enabledSegments}
                  columns={segmentColumns}
                />
              </Card>
            </>
          )}
          <Row type="flex" justify="center">
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.hasErrors(getFieldsError())}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal
          title={'Add Segment Modal'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeAddSegmentModal()}
          onOk={() => this.addToEnabledList()}
          okText="Add to Enabled Segments"
          visible={this.state.showAddSegmentModal}
        >
          <Card>
            <Row>
              <Col
                span={6}
                style={{
                  textAlign: 'right',
                  lineHeight: '30px',
                  color: 'rgba(0, 0, 0, .85)',
                  paddingRight: '10px'
                }}
              >
                Select Segment:
              </Col>
              <Col span={14}>
                <Select
                  showSearch
                  allowClear={true}
                  value={this.state.selectedSegment}
                  onSelect={e => this.selectSegment(e)}
                  style={{ width: '100%' }}
                  placeholder="Select segment"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.listOfSegments &&
                    this.state.listOfSegments.map(segment => (
                      <Option value={segment.segmentId} key={segment.segmentId}>
                        {segment.segmentId}
                      </Option>
                    ))}
                </Select>
              </Col>
            </Row>
          </Card>
        </Modal>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  getMissionSegmentationConfigResponse:
    state.missions.getMissionSegmentationConfigResponse,
  setMissionSegmentationConfigResponse:
    state.missions.setMissionSegmentationConfigResponse,
  getCustomSegmentListResponse: state.segmentation.getCustomSegmentListResponse
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...missionConfigActions, ...segmentationActions },
    dispatch
  )
});

const MissionEnabledSegmentsForm = Form.create()(MissionEnabledSegments);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MissionEnabledSegmentsForm);
