import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as gameActions from '../../actions/gameActions';

import { Button, Card, message, Form, InputNumber, Tooltip, Icon } from 'antd';

const gameList = [];
const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class GameOrderIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfig: false,
      gameList,
      showConfigModal: false,
      configDetails: {}
    };
  }
  getCurrentCount() {
    this.props.actions.getConsoleConfig().then(() => {
      this.setState({
        currentCount: JSON.parse(this.props.games.consoleConfig).fixedGameCount
      });
    });
  }
  componentDidMount() {
    this.props.form.validateFields();
    // if (!this.props.gameList && gameList.length === 0) {
    //   this.props.actions.fetchGames().then(() => {
    //     this.props.gamesList.map(game => {
    //       gameList.push(
    //         <Option key={game.id} value={game.id}>
    //           {game.currentCount}
    //         </Option>
    //       );
    //       return true;
    //     });
    //     this.props.actions.getConsoleConfig().then(() => {
    //       let activeGame = this.props.gamesList.filter(el => {
    //         let game;
    //         if (
    //           el.id === JSON.parse(this.props.games.consoleConfig).fixedGameId
    //         )
    //           game = el;

    //         return game;
    //       });

    //       this.setState({
    //         activeGame: activeGame[0]
    //       });
    //     });
    //   });
    // }
    this.getCurrentCount();
  }
  componentWillUnmount() {
    message.destroy();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.setConsoleConfig(values.currentCount).then(() => {
          this.getCurrentCount();
        });
      }
    });
  };

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
    const currentCountError =
      isFieldTouched('currentCount') && getFieldError('currentCount');

    return (
      <React.Fragment>
        <Card title="Current Fixed Game Count">
          {this.state.currentCount ? <div>{this.state.currentCount}</div> : ''}
        </Card>
        <Card title="Modify First Index Game">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={currentCountError ? 'error' : ''}
              help={currentCountError || ''}
              {...formItemLayout}
              label={
                <span>
                  New Number of Fixed Games
                  <Tooltip title=" Min number of Days since Last Win">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('currentCount', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please enter the currentCount fee!',
                    whitespace: false
                  }
                ]
              })(<InputNumber min={0} />)}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Register
            </Button>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gamesList: state.games.allGames,
    games: state.games
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
}
const GameOrderIndexForm = Form.create()(GameOrderIndex);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameOrderIndexForm);
