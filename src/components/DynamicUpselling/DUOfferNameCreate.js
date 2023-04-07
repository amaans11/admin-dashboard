import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as dynamicUpsellingActions from '../../actions/dynamicUpsellingActions';
import { message, Card } from 'antd';
import { Helmet } from 'react-helmet';
import OfferNameForm from './OfferNameForm';

export class DUOfferNameCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabledGamesList: [],
      gameWiseSegments: {}
    };

    this.offerFormRef = React.createRef();
  }

  componentDidMount() {
    this.getDynamicUpsellConfig();
  }

  getDynamicUpsellConfig = () => {
    this.props.actions.getDynamicUpsellingConfig().then(() => {
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

  createOfferName = nameData => {
    this.props.actions.createUpsellOfferName(nameData).then(() => {
      if (this.props.dynamicUpselling.createUpsellOfferNameResponse) {
        this.resetOfferForm();
        message.success('Offer name created!');
      } else {
        message.error('Unable to create offer name!');
      }
    });
  };

  resetOfferForm = () => {
    if (this.offerFormRef.current) {
      this.offerFormRef.current.resetForm();
    }
  };

  render() {
    return (
      <div style={{ margin: '.5rem' }}>
        <Helmet>
          <title>Create Upselling Offer Name | Admin Dashboard</title>
        </Helmet>

        <Card title="Create Dynamic Upselling Offer Name">
          <OfferNameForm
            currentUser={this.props.currentUser}
            wrappedComponentRef={form => (this.offerFormRef.current = form)}
            enabledGamesList={this.state.enabledGamesList}
            handleSubmit={this.createOfferName}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dynamicUpselling: state.dynamicUpselling,
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...dynamicUpsellingActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DUOfferNameCreate);
