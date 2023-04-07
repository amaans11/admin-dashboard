import React from 'react';
import { Steps, Card } from 'antd';
import UpdateConfig from './UpdateConfig';
import UploadFiles from './UploadFiles';
import UpdateState from './UpdateState';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
const Step = Steps.Step;
const steps = [
  {
    title: 'Details',
    content: <UpdateConfig />
  },
  {
    title: 'Upload ',
    content: <UploadFiles />
  },
  {
    title: 'Finish',
    content: <UpdateState />
  }
];
class Updater extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Updater</title>
        </Helmet>
        <Card>
          <Steps size="small" current={this.props.updater.step}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
        </Card>
        <Card>
          <div className="steps-content">
            {steps[this.props.updater.step].content}
          </div>
        </Card>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    updater: state.updater
  };
}

export default connect(mapStateToProps)(Updater);
