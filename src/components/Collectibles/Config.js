import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
  Select,
  Table,
  Row,
  Col,
  Button,
  Modal,
  Input,
  Popconfirm,
  Card,
  message,
  Switch,
  Radio,
  Tag
} from 'antd';
import { connect } from 'react-redux';
import { map, get, set } from 'lodash';
import * as collectiblesActions from '../../actions/CollectiblesActions';

const { Option } = Select;
const redemptionTypes = [
  { label: 'All', value: 0, text: 'ALL' },
  { label: 'Same Category', value: 2, text: 'SAME_CATEGORY' },
  { label: 'Combination', value: 1, text: 'COMBINATION' }
];
const styles = {
  margin: {
    marginBottom: 20
  }
};

const getRedemptionType = value => {
  let text = '';
  map(redemptionTypes, type => {
    if (type.value === value) {
      text = type.text;
    }
  });
  return text;
};
const stringifyJson = data => {
  let result = {};
  if (
    data &&
    data.redemptionDetailsJson &&
    Object.keys(data.redemptionDetailsJson).length > 0
  ) {
    const cardDetails = JSON.stringify(data.redemptionDetailsJson);
    delete data.redemptionDetailsJson;
    result = { ...data, redemptionDetailsJson: cardDetails };
  }
  return result;
};

const { TextArea } = Input;
const defaultFieldValue = [{ cardId: '' }];

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRedemptionType: '',
      collectibles: [],
      cardList: [],
      cardData: [],
      addCollectibleModal: false,
      addCollectibleData: {},
      isEditable: false,
      isRedemptionIdValid: '',
      isSubmitted: false
    };
  }
  handleChange = value => {
    this.setState({ selectedRedemptionType: value }, () => {
      this.fetchRedemptionData();
    });
  };
  isRedemptionIdValidHandler = () => {
    const {
      collectibles,
      addCollectibleData,
      isEditable,
      selectedRedemptionType
    } = this.state;
    const redemptionId = addCollectibleData.redemptionId;
    let isValid = false;

    if (isEditable) {
      return true;
    } else {
      if (redemptionId) {
        let ids = [];
        if (collectibles && collectibles.length > 0) {
          map(collectibles, collectible => {
            ids.push(collectible.redemptionId);
          });
        }
        isValid = ids.length > 0 && ids.includes(redemptionId) ? false : true;
      }
    }
    return isValid;
  };
  isAddCollectibleDataValid = () => {
    const redemptionIdValid = this.isRedemptionIdValidHandler();
    const { addCollectibleData } = this.state;

    if (
      redemptionIdValid &&
      addCollectibleData.title &&
      addCollectibleData.subtitle &&
      addCollectibleData.description &&
      addCollectibleData.winningCash &&
      !isNaN(addCollectibleData.winningCash) &&
      addCollectibleData.maxRedemptionInDay &&
      !isNaN(addCollectibleData.maxRedemptionInDay)
    ) {
      return true;
    } else {
      return false;
    }
  };
  getCardNameById = cardId => {
    const { cardList } = this.state;
    let cardName = '';

    if (cardList.length > 0) {
      map(cardList, list => {
        if (list.cardId == cardId) {
          cardName = list.cardName;
        }
      });
    }
    return cardName;
  };
  fetchRedemptionData = () => {
    const { selectedRedemptionType } = this.state;
    this.setState({ loading: true });
    this.props.actions.getCollectiblesRedemption().then(() => {
      let collectibles = [];
      if (
        this.props.collectiblesRedmption.collectibleRedemptionData &&
        this.props.collectiblesRedmption.collectibleRedemptionData.length > 0
      )
        map(
          this.props.collectiblesRedmption.collectibleRedemptionData,
          redemption => {
            if (redemption.redemptionType) {
              if (
                redemption.redemptionType == selectedRedemptionType &&
                !redemption.isDeleted
              ) {
                let record = { ...redemption };
                record = {
                  ...record,
                  redemptionDetailsJson: JSON.parse(
                    record.redemptionDetailsJson
                  )
                };
                collectibles.push(record);
              }
            } else {
              if (selectedRedemptionType == 0 && !redemption.isDeleted) {
                let record = { ...redemption };
                record = {
                  ...record,
                  redemptionDetailsJson: JSON.parse(
                    record.redemptionDetailsJson
                  )
                };
                collectibles.push(record);
              }
            }
          }
        );
      this.setState({
        collectibles,
        loading: false
      });
    });
  };
  cancelAddModalHandler = () => {
    this.setState({
      cardData: []
    });
  };
  handleCardChange = (value, index, type) => {
    const { cardData } = this.state;
    let card = [...cardData];
    const obj = card[index];

    let newObj = {};
    let number = value ? parseInt(value) : '';
    if (type === 'cardId') {
      newObj = { ...obj, cardId: value };
    } else {
      newObj = { ...obj, number: number };
    }

    card[index] = newObj;
    this.setState({ cardData: card });
  };
  addMoreCards = () => {
    const { cardData } = this.state;
    const fields = [...cardData];
    fields.push({ cardId: '', number: '' });
    this.setState({ cardData: fields });
  };
  getCardList = (record = {}, type = null) => {
    this.props.actions.getCollectibleCards().then(() => {
      if (
        this.props.collectibleCards &&
        this.props.collectibleCards.userCollectibleCards &&
        this.props.collectibleCards.userCollectibleCards.length > 0
      ) {
        if (type === 'addCollectible') {
          this.setState({
            cardList: [...this.props.collectibleCards.userCollectibleCards],
            selectedRecord: { ...record }
          });
        } else {
          this.setState({
            cardList: [...this.props.collectibleCards.userCollectibleCards],
            selectedRecord: { ...record }
          });
        }
      } else {
        if (type === 'addCollectible') {
          this.setState({
            cardList: [],
            selectedRecord: { ...record }
          });
        } else {
          this.setState({
            cardList: [],
            selectedRecord: { ...record }
          });
        }
      }
    });
  };
  addCollectibleCard = () => {
    const { selectedRecord, cardData } = this.state;

    let cardDetails = get(
      selectedRecord.redemptionDetailsJson,
      'cardDetails',
      []
    );
    if (cardDetails.length > 0) {
      cardDetails = cardDetails.push(...cardData);
    }
    const data = stringifyJson(selectedRecord);
    this.props.actions.updateColectibleRedemption(data).then(() => {
      if (
        this.props.updateCollectibleResponse &&
        this.props.updateCollectibleResponse.error
      ) {
        this.setState({
          cardData: []
        });
        message.error(this.props.updateCollectibleResponse.error.message);
      } else {
        this.setState({
          cardData: []
        });
        message.success('Cards Added  Successfully');
      }
    });
  };
  handleRedemptionActiveChange = record => {
    let selectedRecord = { ...record, isActive: !record.isActive };
    const data = stringifyJson(selectedRecord);
    this.props.actions.updateColectibleRedemption(data).then(() => {
      if (
        this.props.updateCollectibleResponse &&
        this.props.updateCollectibleResponse.error
      ) {
        message.error(this.props.updateCollectibleResponse.error.message);
      } else {
        message.success('Redemption Status Changed Successfully');
        this.fetchRedemptionData();
      }
    });
  };
  deleteCardRedemption = record => {
    let selectedRecord = { ...record, isDeleted: true };
    const data = stringifyJson(selectedRecord);
    this.props.actions.updateColectibleRedemption(data).then(() => {
      if (
        this.props.updateCollectibleResponse &&
        this.props.updateCollectibleResponse.error
      ) {
        message.error(this.props.updateCollectibleResponse.error.message);
      } else {
        message.success('Collectible Redemption Deleted Successfully');
        this.fetchRedemptionData();
      }
    });
  };
  handleAddRedemption = () => {
    const { selectedRedemptionType, collectibles } = this.state;

    if (selectedRedemptionType === 0 && collectibles.length > 0) {
      message.error('Collectibles cannot be added for this redemption Type!');
    } else {
      this.setState({ addCollectibleModal: true }, () => {
        this.getCardList({}, 'addCollectible');
      });
    }
  };
  handleInputChange = (type, value) => {
    this.setState({
      addCollectibleData: {
        ...this.state.addCollectibleData,
        [type]: value
      }
    });
  };
  onCloseAddRedemptionHandler = () => {
    this.setState({
      addCollectibleModal: false,
      isEditable: false,
      addCollectibleData: {}
    });
  };

  addCollectibleRedemption = () => {
    const { addCollectibleData, cardData, selectedRedemptionType } = this.state;
    const validation = this.isRedemptionIdValidHandler();
    const type = getRedemptionType(selectedRedemptionType);
    let result = {
      redemptionId: addCollectibleData.redemptionId,
      redemptionType: type,
      isActive: true,
      isDeleted: false
    };
    delete addCollectibleData.redemptionId;
    result = {
      ...result,
      redemptionDetailsJson: { ...addCollectibleData, cardDetails: cardData }
    };
    const data = stringifyJson(result);
    if (validation) {
      this.props.actions.updateColectibleRedemption(data).then(() => {
        if (
          this.props.updateCollectibleResponse &&
          this.props.updateCollectibleResponse.error
        ) {
          this.setState({
            addCollectibleModal: false,
            isEditable: false,
            addCollectibleData: {},
            isRedemptionIdValid: true,
            cardData: []
          });
          message.error(this.props.updateCollectibleResponse.error.message);
        } else {
          this.setState({
            addCollectibleModal: false,
            isEditable: false,
            addCollectibleData: {},
            isRedemptionIdValid: true,
            cardData: []
          });
          message.success('Collection Redemption Added  Successfully');
          this.fetchRedemptionData();
        }
      });
    } else {
      this.setState({ isRedemptionIdValid: false });
    }
  };
  deleteCardHandler = (record, index) => {
    let cardData = get(record.redemptionDetailsJson, 'cardDetails', []);
    cardData.splice(index, 1);
    let result = set(record, 'redemptionDetailsJson.cardDetails', cardData);

    const data = stringifyJson(result);
    this.props.actions.updateColectibleRedemption(data).then(() => {
      if (
        this.props.updateCollectibleResponse &&
        this.props.updateCollectibleResponse.error
      ) {
        this.setState({
          addCollectibleData: {},
          cardData: []
        });
        message.error('Unable to delete the card!Try Again');
      } else {
        this.setState({
          addCollectibleData: {},
          cardData: []
        });
        message.success('Card Deleted  Successfully');
        this.fetchRedemptionData();
      }
    });
  };

  editCollectibleHandler = record => {
    const redemptionDetailsJson = get(record, 'redemptionDetailsJson', {});
    const cardDetails = get(record.redemptionDetailsJson, 'cardDetails', []);
    const data = {
      redemptionId: record.redemptionId ? record.redemptionId : '',
      title:
        redemptionDetailsJson && redemptionDetailsJson.title
          ? redemptionDetailsJson.title
          : '',
      subtitle:
        redemptionDetailsJson && redemptionDetailsJson.subtitle
          ? redemptionDetailsJson.subtitle
          : '',
      description:
        redemptionDetailsJson && redemptionDetailsJson.description
          ? redemptionDetailsJson.description
          : '',
      winningCash:
        redemptionDetailsJson && redemptionDetailsJson.winningCash
          ? redemptionDetailsJson.winningCash
          : '',
      maxRedemptionInDay:
        redemptionDetailsJson && redemptionDetailsJson.maxRedemptionInDay
          ? redemptionDetailsJson.maxRedemptionInDay
          : '',
      forNewUser:
        redemptionDetailsJson && redemptionDetailsJson.forNewUser
          ? redemptionDetailsJson.forNewUser
          : false
    };
    this.setState(
      {
        addCollectibleData: { ...data },
        addCollectibleModal: true,
        isEditable: true,
        cardData: cardDetails
      },
      () => {
        this.getCardList({}, 'addCollectible');
      }
    );
  };
  getCollectiblesColumns = () => {
    const columns = [
      {
        title: 'Redemption Id',
        key: 'redemptionId',
        width: 80,
        dataIndex: 'redemptionId'
      },
      {
        title: 'Title',
        key: 'title',
        width: 120,
        render: (text, record) => {
          const title = get(record.redemptionDetailsJson, 'title', null);
          return <div>{title ? title : 'NA'}</div>;
        }
      },
      {
        title: 'Sub Title',
        key: 'subTitle',
        width: 120,
        render: (text, record) => {
          const subtitle = get(record.redemptionDetailsJson, 'subtitle', null);
          return <div>{subtitle ? subtitle : 'NA'}</div>;
        }
      },
      {
        title: 'Description',
        key: 'description',
        width: 150,
        render: (text, record) => {
          const description = get(
            record.redemptionDetailsJson,
            'description',
            null
          );
          return <div>{description ? description : 'NA'}</div>;
        }
      },
      {
        title: 'Winning Cash',
        key: 'winningCash',
        width: 80,
        render: (text, record) => {
          const winningCash = get(
            record.redemptionDetailsJson,
            'winningCash',
            null
          );
          return <div>{winningCash ? winningCash : 0}</div>;
        }
      },
      {
        title: 'Max Redemption Allowed in Day',
        key: 'maxRedemptionInDay',
        width: 100,
        render: (text, record) => {
          const maxRedemptionInDay = get(
            record.redemptionDetailsJson,
            'maxRedemptionInDay',
            null
          );
          return <div>{maxRedemptionInDay ? maxRedemptionInDay : 0}</div>;
        }
      },
      {
        title: 'New User',
        key: 'forNewUser',
        width: 100,
        render: (text, record) => {
          const isNewUser = get(
            record.redemptionDetailsJson,
            'forNewUser',
            null
          );
          return (
            <div>
              {isNewUser ? (
                <Tag color="#108ee9">true</Tag>
              ) : (
                <Tag color="#f50">false</Tag>
              )}
            </div>
          );
        }
      },
      {
        title: 'Active',
        key: 'active',
        width: 80,
        render: (text, record) => {
          let active = get(record, 'isActive', false);
          return (
            <Switch
              checked={active}
              onChange={() => this.handleRedemptionActiveChange(record)}
            />
          );
        }
      },
      {
        title: 'Card Details',
        key: 'cardDetails',
        render: (text, record) => {
          const cardDetails = get(
            record.redemptionDetailsJson,
            'cardDetails',
            []
          );
          if (cardDetails.length > 0) {
            return map(cardDetails, (card, index) => (
              <React.Fragment>
                {index === 0 && (
                  <Row>
                    <Col sm={8}>
                      <h4>Card Id</h4>
                    </Col>
                    <Col sm={12}>
                      <h4>Card Redemption</h4>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col sm={8}>
                    <div>{card.cardId}</div>
                  </Col>
                  <Col sm={12}>
                    <div>{card.number}</div>
                  </Col>
                  <Col sm={4}>
                    <Popconfirm
                      title="Are you sure want to delete this card"
                      onConfirm={() => {
                        this.deleteCardHandler(record, index);
                      }}
                    >
                      <Button
                        type="primary"
                        icon="delete"
                        size="small"
                        style={{ marginBottom: 5 }}
                      />
                    </Popconfirm>
                  </Col>
                </Row>
              </React.Fragment>
            ));
          }
        }
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        render: (text, record) => {
          return (
            <React.Fragment>
              <Button
                type="success"
                onClick={() => this.editCollectibleHandler(record)}
                style={{ marginBottom: 10 }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Are you sure want to delete this collectible redemption?"
                onConfirm={() => this.deleteCardRedemption(record)}
              >
                <Button type="danger">Delete</Button>
              </Popconfirm>
            </React.Fragment>
          );
        }
      }
    ];
    return columns;
  };
  addCardDetailsContent = ({ index }) => {
    const { cardList, cardData, isEditable } = this.state;

    let cardName =
      cardData && cardData.length > 0 && cardData[index] !== undefined
        ? this.getCardNameById(cardData[index].cardId)
        : '';
    let number =
      cardData && cardData.length > 0 && cardData[index] != 'NaN'
        ? cardData[index].number
        : '';

    return (
      <Row>
        <Col sm={14}>
          <div>
            <div>Select Card Type</div>
            <Select
              style={{ width: 120 }}
              onChange={value => this.handleCardChange(value, index, 'cardId')}
              value={cardName}
            >
              {cardList &&
                cardList.length > 0 &&
                cardList.map(card => (
                  <Option value={card.cardId}>{card.cardName}</Option>
                ))}
            </Select>
          </div>
        </Col>
        <Col sm={10}>
          <div>Number of cards</div>
          <Input
            onChange={event => {
              this.handleCardChange(event.target.value, index, 'number');
            }}
            value={number}
          />
        </Col>
      </Row>
    );
  };
  getAddCardModalContent = () => {
    const { cardData } = this.state;
    const CardContent = this.addCardDetailsContent;
    return (
      <React.Fragment>
        {cardData.length > 0
          ? cardData.map((el, index) => <CardContent index={index} />)
          : defaultFieldValue.map((el, index) => <CardContent index={index} />)}
        <Button
          type="primary"
          size="small"
          onClick={() => this.addMoreCards()}
          style={{ marginTop: 20 }}
        >
          Add More Cards
        </Button>
      </React.Fragment>
    );
  };
  getaddCollectibleRedemptionContent = () => {
    const addCardContent = this.getAddCardModalContent();
    const { addCollectibleData } = this.state;
    return (
      <React.Fragment>
        <Row style={styles.margin}>
          <Col sm={8}>
            Redemption Id
            <div style={{ fontSize: 10, color: '#faad14' }}>
              (Redemption Id must be Valid)
            </div>
          </Col>
          <Col sm={16}>
            <Input
              onChange={e =>
                this.handleInputChange('redemptionId', e.target.value)
              }
              value={addCollectibleData.redemptionId}
              disabled={this.state.isEditable}
            />
          </Col>
        </Row>
        <Row style={styles.margin}>
          <Col sm={8}>Title</Col>
          <Col sm={16}>
            <Input
              onChange={e => this.handleInputChange('title', e.target.value)}
              value={addCollectibleData.title}
            />
          </Col>
        </Row>
        <Row style={styles.margin}>
          <Col sm={8}>Sub Title</Col>
          <Col sm={16}>
            <Input
              onChange={e => this.handleInputChange('subtitle', e.target.value)}
              value={addCollectibleData.subtitle}
            />
          </Col>
        </Row>
        <Row style={styles.margin}>
          <Col sm={8}>Description</Col>
          <Col sm={16}>
            <TextArea
              onChange={e =>
                this.handleInputChange('description', e.target.value)
              }
              value={addCollectibleData.description}
            />
          </Col>
        </Row>
        <Row style={styles.margin}>
          <Col sm={8}>Winning Cash</Col>
          <Col sm={16}>
            <Input
              onChange={e =>
                this.handleInputChange('winningCash', e.target.value)
              }
              value={addCollectibleData.winningCash}
            />
          </Col>
        </Row>
        <Row style={styles.margin}>
          <Col sm={8}>Max Redemption in Day</Col>
          <Col sm={16}>
            <Input
              onChange={e =>
                this.handleInputChange('maxRedemptionInDay', e.target.value)
              }
              value={addCollectibleData.maxRedemptionInDay}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col sm={8}>New User</Col>
          <Radio.Group
            onChange={e => this.handleInputChange('forNewUser', e.target.value)}
            value={
              addCollectibleData.forNewUser
                ? addCollectibleData.forNewUser
                : false
            }
          >
            <Radio value={true}>true</Radio>
            <Radio value={false}>false</Radio>
          </Radio.Group>
        </Row>
        <Row>
          Card Details
          {addCardContent}
        </Row>
      </React.Fragment>
    );
  };
  render() {
    const {
      collectibles,
      selectedRedemptionType,
      addCollectibleModal,
      isEditable
    } = this.state;

    const collectiblesColumns = this.getCollectiblesColumns();
    const addCollectibleRedemptionContent = this.getaddCollectibleRedemptionContent();
    const addCollectibleValidation = this.isAddCollectibleDataValid();

    return (
      <React.Fragment>
        <Card>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20
            }}
          >
            <div>
              <h4>Select Redemption Type</h4>
              <Select
                style={{ width: 200 }}
                onChange={this.handleChange}
                placeholder="SELECT"
              >
                {redemptionTypes &&
                  redemptionTypes.map(type => (
                    <Option value={type.value}>{type.label}</Option>
                  ))}
              </Select>
            </div>
            <div>
              {selectedRedemptionType !== '' && (
                <Button type="primary" onClick={this.handleAddRedemption}>
                  Add Colectibles
                </Button>
              )}
            </div>
          </div>
          {collectibles && collectibles.length > 0 && (
            <Table
              rowKey="redemptionId"
              bordered
              dataSource={collectibles}
              columns={collectiblesColumns}
              pagination={false}
              scroll={{ x: '100%' }}
              style={{ margin: 10 }}
            />
          )}
        </Card>
        <Modal
          title="Add Collectible Redemption"
          closable={true}
          maskClosable={true}
          width={500}
          visible={addCollectibleModal}
          onCancel={this.onCloseAddRedemptionHandler}
          footer={[
            <React.Fragment>
              <Button type="default" onClick={this.onCloseAddRedemptionHandler}>
                Cancel
              </Button>
              <Button
                type="primary"
                disabled={!addCollectibleValidation}
                onClick={this.addCollectibleRedemption}
              >
                {isEditable ? 'Update' : 'Add'}
              </Button>
            </React.Fragment>
          ]}
        >
          {addCollectibleRedemptionContent}
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const {
    collectiblesRedmption,
    collectibleCards,
    updateCollectibleResponse
  } = state.collectibles;
  return {
    collectiblesRedmption: collectiblesRedmption,
    collectibleCards: collectibleCards,
    updateCollectibleResponse: updateCollectibleResponse
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...collectiblesActions }, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Config);
