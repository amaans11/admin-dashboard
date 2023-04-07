import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dynamicUpsellingActions from '../../actions/dynamicUpsellingActions';
import {
  Table,
  Button,
  Card,
  Modal,
  message,
  Divider,
  Tooltip,
  Select
} from 'antd';
import OfferNameForm from './OfferNameForm';
import { Helmet } from 'react-helmet';

export class DUOfferNameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabledGamesList: [],
      upsellOfferNames: [],
      offerDetails: {},
      isInfoVisible: false,
      isEditVisible: false,
      isCloneVisible: false,
      countryCodeList: []
    };

    this.offerFormRef = React.createRef();
  }

  componentDidMount() {
    this.getUpsellSupportedCountries();
    // this.getDynamicUpsellConfig();
    // this.getUpsellOfferNames();
  }

  getUpsellSupportedCountries() {
    this.props.actions.getUpsellAllSupportedCountries().then(() => {
      if (
        this.props.getUpsellAllSupportedCountriesResponse &&
        this.props.getUpsellAllSupportedCountriesResponse.countryCode
      ) {
        this.setState({
          countryCodeList: [
            ...this.props.getUpsellAllSupportedCountriesResponse.countryCode
          ]
        });
      }
    });
  }

  selectCountry(value) {
    this.setState({ countryCode: value, countrySelected: true }, () => {
      this.getDynamicUpsellConfig();
      this.getUpsellOfferNames();
    });
  }

  getDynamicUpsellConfig = () => {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getDynamicUpsellingConfig(data).then(() => {
      if (
        this.props.dynamicUpselling.config &&
        this.props.dynamicUpselling.config.enabledGames
      ) {
        const enabledGamesList = this.props.dynamicUpselling.config
          .enabledGames;
        this.setState({ enabledGamesList });
      }
    });
  };

  getUpsellOfferNames = () => {
    let data = {
      countryCode: this.state.countryCode
    };
    this.props.actions.getUpsellOfferNames(data).then(() => {
      if (
        this.props.dynamicUpselling.getUpsellOfferNamesResponse &&
        this.props.dynamicUpselling.getUpsellOfferNamesResponse.upsellOfferNames
      ) {
        this.setState({
          upsellOfferNames:
            this.props.dynamicUpselling.getUpsellOfferNamesResponse
              .upsellOfferNames || []
        });
      }
    });
  };

  cloneOffer = (record, editType) => {
    this.props.actions.cloneDynamicUpsellingOffer(record, editType);
    this.props.history.push('/dynamic-upselling/create');
  };

  showConfig = offerDetails => {
    this.setState({ offerDetails, isInfoVisible: true });
  };

  hideModal = () => {
    this.setState({ isInfoVisible: false });
  };

  showEditModal = offerDetails => {
    this.setState({ offerDetails, isEditVisible: true });
  };

  closeEditModal = () => {
    this.setState({ isEditVisible: false });
  };

  updateOfferName = nameData => {
    nameData['countryCode'] = this.state.countryCode;
    this.props.actions.updateUpsellOfferName(nameData).then(() => {
      if (this.props.dynamicUpselling.updateUpsellOfferNameResponse) {
        this.resetOfferForm();
        this.closeEditModal();
        this.getUpsellOfferNames();
        message.success('Offer name updated!');
      } else {
        message.error('Unable to update offer name!');
      }
    });
  };

  showCloneModal = offerDetails => {
    this.setState({ offerDetails, isCloneVisible: true });
  };

  closeCloneModal = () => {
    this.setState({ isCloneVisible: false });
  };

  createOfferName = nameData => {
    nameData['countryCode'] = this.state.countryCode;
    this.props.actions.createUpsellOfferName(nameData).then(() => {
      if (this.props.dynamicUpselling.createUpsellOfferNameResponse) {
        this.resetOfferForm();
        this.closeCloneModal();
        this.getUpsellOfferNames();
        message.success('Offer name updated!');
      } else {
        message.error('Unable to update offer name!');
      }
    });
  };

  resetOfferForm = () => {
    if (this.offerFormRef.current) {
      this.offerFormRef.current.resetForm();
    }
  };

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Game ID',
        dataIndex: 'gameId',
        key: 'gameId'
      },
      {
        title: 'Game Name',
        dataIndex: 'gameName',
        key: 'gameName'
      },
      {
        title: 'Short Offer Text',
        dataIndex: 'shortOfferText',
        key: 'shortOfferText'
      },
      {
        title: 'Long Offer Text',
        dataIndex: 'longOfferText',
        key: 'longOfferText'
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Tooltip
              placement="topLeft"
              title="Show offer Details"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="info"
                onClick={() => this.showConfig(record)}
                type="primary"
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip
              placement="topLeft"
              title="Clone offer to create new offer"
              arrowPointAtCenter
            >
              <Button
                shape="circle"
                icon="copy"
                onClick={() => this.showCloneModal(record)}
                type="primary"
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip placement="topLeft" title="Edit Offer" arrowPointAtCenter>
              <Button
                shape="circle"
                icon="edit"
                onClick={() => this.showEditModal(record)}
                type="primary"
              />
            </Tooltip>
          </span>
        )
      }
    ];

    return (
      <div style={{ padding: '.5rem' }}>
        <Helmet>
          <title>Dynamic Upselling Offer Names | Admin Dashboard</title>
        </Helmet>
        <Card>
          <Select
            showSearch
            style={{ width: 300 }}
            onSelect={e => this.selectCountry(e)}
            placeholder="Select a country"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.countryCodeList.map(countryCode => {
              return (
                <Select.Option
                  key={'countryCode' + countryCode}
                  value={countryCode}
                >
                  {countryCode}
                </Select.Option>
              );
            })}
          </Select>
        </Card>

        {this.state.countrySelected && (
          <Card title="Dynamic Upselling Offer Names">
            <Table
              rowKey="id"
              bordered
              dataSource={this.state.upsellOfferNames}
              columns={columns}
              footer={() => (
                <Button
                  onClick={() => this.showCloneModal({})}
                  icon="plus"
                  type="primary"
                  ghost
                >
                  Create New
                </Button>
              )}
            />
          </Card>
        )}
        <Modal
          title="Offer Name Details"
          closable={true}
          maskClosable={true}
          width={800}
          onCancel={this.hideModal}
          onOk={this.hideModal}
          visible={this.state.isInfoVisible}
          footer={null}
        >
          <Card bordered={false}>
            <pre>
              {this.state.offerDetails
                ? JSON.stringify(this.state.offerDetails, null, 2)
                : ''}
            </pre>
          </Card>
        </Modal>

        <Modal
          title="Edit Offer Name"
          visible={this.state.isEditVisible}
          onOk={this.closeEditModal}
          onCancel={this.closeEditModal}
          footer={null}
          destroyOnClose={true}
          width={800}
        >
          <OfferNameForm
            currentUser={this.props.currentUser}
            wrappedComponentRef={form => (this.offerFormRef.current = form)}
            enabledGamesList={this.state.enabledGamesList}
            handleSubmit={this.updateOfferName}
            offerDetails={this.state.offerDetails}
            countryCode={this.state.countryCode}
            isEditing={true}
          />
        </Modal>

        <Modal
          title="Create Offer Name"
          visible={this.state.isCloneVisible}
          onOk={this.closeCloneModal}
          onCancel={this.closeCloneModal}
          footer={null}
          destroyOnClose={true}
          width={800}
        >
          <OfferNameForm
            currentUser={this.props.currentUser}
            wrappedComponentRef={form => (this.offerFormRef.current = form)}
            enabledGamesList={this.state.enabledGamesList}
            handleSubmit={this.createOfferName}
            offerDetails={this.state.offerDetails}
            countryCode={this.state.countryCode}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dynamicUpselling: state.dynamicUpselling,
    currentUser: state.auth.currentUser,
    getUpsellAllSupportedCountriesResponse:
      state.dynamicUpselling.getUpsellAllSupportedCountriesResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...dynamicUpsellingActions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DUOfferNameList);
