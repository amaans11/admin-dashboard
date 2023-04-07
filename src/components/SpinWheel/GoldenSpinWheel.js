import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as websiteActions from '../../actions/websiteActions';
import * as spinWheelActions from '../../actions/SpinWheelActions';
import {
  Card,
  Select,
  Icon,
  Form,
  Input,
  Button,
  Tooltip,
  Switch,
  notification,
  Row,
  Col,
  message,
  Tag,
  Table,
  Divider,
  Popconfirm,
  Modal,
  InputNumber
} from 'antd';
import ImageUploader from './ImageUploader';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const CountryList = ['IN', 'ID', 'US'].map((item, index) => (
  <Option key={index} value={item}>
    {item}
  </Option>
));

const AppTypeList = ['CASH', 'IOS', 'PLAY_STORE'].map((item, index) => (
  <Option key={index} value={item}>
    {item}
  </Option>
));

const CurrencyList = ['CASH', 'TOKEN', 'COUPON', 'REFERRAL_BOOSTER'].map(
  (item, index) => (
    <Option key={index} value={item}>
      {item}
    </Option>
  )
);

const labelStyle = {
  textAlign: 'right',
  lineHeight: '30px',
  color: 'rgba(0, 0, 0, .85)',
  paddingRight: '10px',
  marginTop: '12px'
};

const fieldStyle = { marginTop: '12px', width: '80%' };

const mandatoryStyle = {
  fontSize: '14px',
  color: '#f5222d',
  marginRight: '4px',
  fontFamily: 'SimSun, sans-serif'
};

class GoldenSpinWheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpecialRewards: false,
      wheelImageUrl: '',
      wheelBoltImageUrl: '',
      wheelNeedleImageUrl: '',
      wheelHeaderImageUrl: '',
      rewardPopupImageUrl: '',
      generalRewards: [],
      specialRewards: [],
      appTypeList: [],
      spinWheelData: [],
      generalRewardValidation: false,
      isAppTypeSelected: false,
      selectedGeneralReward: {},
      showAddEditRewardModal: false,
      selectedSpecialReward: {},
      showAddEditSpecialRewardModal: false,
      showModalImageUploader: false,
      isCountrySelected: false,
      modalErrors: {
        amount: false,
        currency: false,
        probability: false,
        angleOnWheel: false,
        extraParameters: false
      },
      specialModalErrors: {
        id: false,
        displayName: false,
        dlAction: false,
        dlActionParam: false,
        primaryMessage: false,
        secondaryMessage: false,
        imageUrl: false,
        angleOnWheel: false,
        generateOn: false
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSpecialRewards = this.toggleSpecialRewards.bind(this);
    this.appTypeSelected = this.appTypeSelected.bind(this);
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  countryCodeSelected(value) {
    this.setState({
      countryCode: value,
      isCountrySelected: true,
      isAppTypeSelected: false
    });
  }

  appTypeSelected(appType) {
    let data = {
      countryCode: this.state.countryCode,
      appType: appType
    };
    this.props.actions.getCdnPathForUpload().then(() => {
      if (this.props.getCdnPathForUploadResponse) {
        let cdnPath = JSON.parse(this.props.getCdnPathForUploadResponse)
          .CDN_PATH;
        this.setState({ cdnPath });
      }
    });
    this.props.actions.getGoldenSpinWheelConfigs(data).then(() => {
      if (
        this.props.goldenSpinWheelConfigResponse &&
        this.props.goldenSpinWheelConfigResponse
      ) {
        let spinWheelData = JSON.parse(
          this.props.goldenSpinWheelConfigResponse
        );
        spinWheelData = spinWheelData[0];
        let generalRewards = [];
        _.forEach(spinWheelData['generalRewards'], function(item, index) {
          let cursor = {};
          cursor['id'] = index + 1;
          cursor['amount'] = item.amount;
          cursor['angleOnWheel'] = item.angleOnWheel;
          cursor['currency'] = item.currency;
          cursor['probability'] = item.probability;
          cursor['extraParameters'] = item.extraParameters
            ? JSON.stringify(item.extraParameters)
            : null;
          generalRewards.push(cursor);
        });

        if (
          spinWheelData.specialRewards &&
          spinWheelData.specialRewards.length > 0
        ) {
          let specialRewards = [];
          _.forEach(spinWheelData['specialRewards'], function(item, index) {
            let cursor = {};
            cursor['number'] = index + 1;
            cursor['id'] = item.id;
            cursor['displayName'] = item.displayName;
            cursor['dlAction'] = item.dlAction;
            cursor['dlActionParam'] = item.dlActionParam;
            cursor['primaryMessage'] = item.primaryMessage;
            cursor['secondaryMessage'] = item.secondaryMessage;
            cursor['imageUrl'] = item.imageUrl;
            cursor['angleOnWheel'] = item.angleOnWheel;
            cursor['generateOn'] =
              item.generateOn && item.generateOn.length > 0
                ? item.generateOn.join(',')
                : '';
            specialRewards.push(cursor);
          });
          this.setState({ specialRewards, isSpecialRewards: true });
        }

        if (spinWheelData.wheelImageUrl) {
          this.copyWheelImageUrl(spinWheelData.wheelImageUrl);
        } else {
          this.setState({ loadWheelImageUrl: true });
        }
        if (spinWheelData.wheelBoltImageUrl) {
          this.copyWheelBoltImageUrl(spinWheelData.wheelBoltImageUrl);
        } else {
          this.setState({ loadWheelBoltImageUrl: true });
        }
        if (spinWheelData.wheelNeedleImageUrl) {
          this.copyWheelNeedleImageUrl(spinWheelData.wheelNeedleImageUrl);
        } else {
          this.setState({ loadWheelNeedleImageUrl: true });
        }
        if (spinWheelData.wheelHeaderImageUrl) {
          this.copyWheelHeaderImageUrl(spinWheelData.wheelHeaderImageUrl);
        } else {
          this.setState({ loadWheelHeaderImageUrl: true });
        }
        if (spinWheelData.rewardPopupImageUrl) {
          this.copyRewardPopupImageUrl(spinWheelData.rewardPopupImageUrl);
        } else {
          this.setState({ loadRewardPopupImageUrl: true });
        }
        this.setState(
          {
            spinWheelData: { ...spinWheelData },
            generalRewards,
            isAppTypeSelected: true
          },
          () => {
            this.props.form.setFieldsValue({
              titleString: spinWheelData.titleString,
              subtitleString: spinWheelData.subtitleString,
              rewardPopupImageDeeplink: spinWheelData.rewardPopupImageDeeplink
                ? spinWheelData.rewardPopupImageDeeplink
                : null
            });
          }
        );
      } else {
        message.error('Coould Not fetch spinwheel details');
      }
    });
  }

  copyWheelImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewWheelImageUrl: imageUrl,
      wheelImageUrlFileList: [
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
      wheelImageUrl: url,
      loadWheelImageUrl: true
    });
  }

  copyWheelBoltImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewWheelBoltImageUrl: imageUrl,
      wheelBoltImageUrlFileList: [
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
      wheelBoltImageUrl: url,
      loadWheelBoltImageUrl: true
    });
  }

  copyWheelNeedleImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewWheelNeedleImageUrl: imageUrl,
      wheelNeedleImageUrlFileList: [
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
      wheelNeedleImageUrl: url,
      loadWheelNeedleImageUrl: true
    });
  }

  copyWheelHeaderImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewWheelHeaderImageUrl: imageUrl,
      wheelHeaderImageUrlFileList: [
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
      wheelHeaderImageUrl: url,
      loadWheelHeaderImageUrl: true
    });
  }

  copyRewardPopupImageUrl(imageUrl) {
    let url = '';
    this.setState({
      previewRewardPopupImageUrl: imageUrl,
      rewardPopupImageUrlFileList: [
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
      rewardPopupImageUrl: url,
      loadRewardPopupImageUrl: true
    });
  }

  wheelImageUrlCallback = data => {
    this.setState({
      wheelImageUrl: data && data.id ? data.id : ''
    });
  };

  wheelBoltImageUrlCallback = data => {
    this.setState({
      wheelBoltImageUrl: data && data.id ? data.id : ''
    });
  };

  wheelNeedleImageUrlCallback = data => {
    this.setState({
      wheelNeedleImageUrl: data && data.id ? data.id : ''
    });
  };

  wheelHeaderImageUrlCallback = data => {
    this.setState({
      wheelHeaderImageUrl: data && data.id ? data.id : ''
    });
  };

  rewardPopupImageUrlCallback = data => {
    this.setState({
      rewardPopupImageUrl: data && data.id ? data.id : ''
    });
  };

  isImageLoading = data => {
    this.setState({
      imageLoading: data
    });
  };

  openAddEditEventModal(actionType, record) {
    if (actionType === 'EDIT') {
      this.setState({
        actionType: actionType,
        selectedGeneralReward: { ...record },
        showAddEditRewardModal: true
      });
    } else {
      this.setState({
        actionType: actionType,
        showAddEditRewardModal: true
      });
    }
  }

  resetFields() {
    this.setState({
      selectedGeneralReward: {}
    });
  }

  closeAddEditEventModal() {
    this.resetFields();
    this.setState({ showAddEditRewardModal: false });
  }

  updateValues(value, valueType) {
    let selectedGeneralReward = { ...this.state.selectedGeneralReward };
    switch (valueType) {
      case 'AMOUNT':
        selectedGeneralReward.amount = value;
        break;
      case 'CURRENCY':
        selectedGeneralReward.currency = value;
        break;
      case 'PROBABILITY':
        selectedGeneralReward.probability = value;
        break;
      case 'ANGLE':
        selectedGeneralReward.angleOnWheel = value;
        break;
      case 'EXTRA_PARAM':
        selectedGeneralReward.extraParameters = value;
        break;
      default:
        break;
    }
    this.setState({
      selectedGeneralReward: { ...selectedGeneralReward }
    });
  }

  saveChanges() {
    let selectedGeneralReward = { ...this.state.selectedGeneralReward };
    let tableData =
      this.state.generalRewards.length > 0
        ? [...this.state.generalRewards]
        : [];
    let modalErrors = {
      amount: false,
      currency: false,
      probability: false,
      angleOnWheel: false,
      extraParameters: false
    };
    if (!selectedGeneralReward.amount && selectedGeneralReward.amount !== 0) {
      modalErrors.amount = true;
    } else {
      modalErrors.amount = false;
    }

    if (!selectedGeneralReward.currency) {
      modalErrors.currency = true;
    } else {
      modalErrors.currency = false;
    }

    if (
      !selectedGeneralReward.probability &&
      selectedGeneralReward.probability !== 0
    ) {
      modalErrors.probability = true;
    } else {
      modalErrors.probability = false;
    }

    if (
      !selectedGeneralReward.angleOnWheel &&
      selectedGeneralReward.angleOnWheel !== 0
    ) {
      modalErrors.angleOnWheel = true;
    } else {
      modalErrors.angleOnWheel = false;
    }

    if (selectedGeneralReward.extraParameters) {
      try {
        JSON.parse(selectedGeneralReward.extraParameters);
        modalErrors.extraParameters = false;
      } catch (error) {
        modalErrors.extraParameters = true;
      }
    }
    this.setState({ modalErrors });
    if (
      modalErrors.amount ||
      modalErrors.currency ||
      modalErrors.probability ||
      modalErrors.angleOnWheel ||
      modalErrors.extraParameters
    ) {
      return;
    }

    if (this.state.actionType === 'EDIT') {
      let objIndex = _.findIndex(tableData, function(item) {
        return item.id === selectedGeneralReward.id;
      });
      if (objIndex > -1) {
        tableData[objIndex]['amount'] = selectedGeneralReward.amount;
        tableData[objIndex]['currency'] = selectedGeneralReward.currency;
        tableData[objIndex]['probability'] = selectedGeneralReward.probability;
        tableData[objIndex]['angleOnWheel'] =
          selectedGeneralReward.angleOnWheel;
        tableData[objIndex][
          'extraParameters'
        ] = selectedGeneralReward.extraParameters
          ? selectedGeneralReward.extraParameters
          : null;
      }
    } else {
      let newRecord = {
        id: tableData.length + 1,
        amount: selectedGeneralReward.amount,
        currency: selectedGeneralReward.currency,
        probability: selectedGeneralReward.probability,
        angleOnWheel: selectedGeneralReward.angleOnWheel,
        extraParameters: selectedGeneralReward.extraParameters
          ? selectedGeneralReward.extraParameters
          : null
      };
      tableData.push(newRecord);
    }
    this.setState({
      generalRewards: [...tableData],
      showAddEditRewardModal: false
    });
    this.resetFields();
  }

  deleteRow(record) {
    let tableData =
      this.state.generalRewards.length > 0
        ? [...this.state.generalRewards]
        : [];
    let objIndex = _.findIndex(tableData, function(item) {
      return item.id === record.id;
    });
    if (objIndex > -1) {
      tableData.splice(objIndex, 1);
    }
    let generalRewards = [];
    _.forEach(tableData, function(item, index) {
      let cursor = {};
      cursor['id'] = index + 1;
      cursor['amount'] = item.amount;
      cursor['angleOnWheel'] = item.angleOnWheel;
      cursor['currency'] = item.currency;
      cursor['probability'] = item.probability;
      cursor['extraParameters'] = item.extraParameters
        ? JSON.stringify(item.extraParameters)
        : null;
      generalRewards.push(cursor);
    });
    this.setState({
      generalRewards: [...generalRewards]
    });
  }

  openAddEditSpecialRewardModal(actionType, record) {
    if (actionType === 'EDIT') {
      this.setState({
        actionType: actionType,
        selectedSpecialReward: { ...record },
        showAddEditSpecialRewardModal: true,
        specialRewardImageUrlFileList: [
          {
            uid: -1,
            name: 'image.png',
            status: 'done',
            url: record.imageUrl
          }
        ]
      });
    } else {
      this.setState({
        actionType: actionType,
        showAddEditSpecialRewardModal: true,
        showModalImageUploader: true
      });
    }
  }

  resetSpecialFields() {
    this.setState({
      selectedSpecialReward: {},
      showModalImageUploader: false
    });
  }

  closeAddEditSpecialRewardModal() {
    this.resetSpecialFields();
    this.setState({ showAddEditSpecialRewardModal: false });
  }

  updateSpecialValues(value, valueType) {
    let selectedSpecialReward = { ...this.state.selectedSpecialReward };
    switch (valueType) {
      case 'ID':
        selectedSpecialReward.id = value;
        break;
      case 'DISPLAY_NAME':
        selectedSpecialReward.displayName = value;
        break;
      case 'DL_ACTION':
        selectedSpecialReward.dlAction = value;
        break;
      case 'DL_ACTION_PARAM':
        selectedSpecialReward.dlActionParam = value;
        break;
      case 'PRIMARY_MESSAGE':
        selectedSpecialReward.primaryMessage = value;
        break;
      case 'SECONDARY_MESSAGE':
        selectedSpecialReward.secondaryMessage = value;
        break;
      case 'ANGLE':
        selectedSpecialReward.angleOnWheel = value;
        break;
      case 'GENERATED_ON':
        selectedSpecialReward.generateOn = value;
        break;
      default:
        break;
    }
    this.setState({
      selectedSpecialReward: { ...selectedSpecialReward }
    });
  }

  saveSpecialChanges() {
    let selectedSpecialReward = { ...this.state.selectedSpecialReward };
    let tableData =
      this.state.specialRewards.length > 0
        ? [...this.state.specialRewards]
        : [];
    let specialModalErrors = {
      id: false,
      displayName: false,
      dlAction: false,
      dlActionParam: false,
      primaryMessage: false,
      secondaryMessage: false,
      angleOnWheel: false
    };
    if (!selectedSpecialReward.imageUrl) {
      message.error('Image is mandatory');
      return;
    }

    if (!selectedSpecialReward.id) {
      specialModalErrors.id = true;
    } else {
      specialModalErrors.id = false;
    }

    if (!selectedSpecialReward.displayName) {
      specialModalErrors.displayName = true;
    } else {
      specialModalErrors.displayName = false;
    }

    if (!selectedSpecialReward.dlAction) {
      specialModalErrors.dlAction = true;
    } else {
      specialModalErrors.dlAction = false;
    }

    if (selectedSpecialReward.dlActionParam) {
      try {
        JSON.parse(selectedSpecialReward.dlActionParam);
        specialModalErrors.dlActionParam = false;
      } catch (error) {
        specialModalErrors.dlActionParam = true;
      }
    }

    if (!selectedSpecialReward.primaryMessage) {
      specialModalErrors.primaryMessage = true;
    } else {
      specialModalErrors.primaryMessage = false;
    }

    if (!selectedSpecialReward.secondaryMessage) {
      specialModalErrors.secondaryMessage = true;
    } else {
      specialModalErrors.secondaryMessage = false;
    }

    if (
      !selectedSpecialReward.angleOnWheel &&
      selectedSpecialReward.angleOnWheel !== 0
    ) {
      specialModalErrors.angleOnWheel = true;
    } else {
      specialModalErrors.angleOnWheel = false;
    }

    this.setState({ specialModalErrors });

    if (
      specialModalErrors.id ||
      specialModalErrors.displayName ||
      specialModalErrors.dlAction ||
      specialModalErrors.dlActionParam ||
      specialModalErrors.primaryMessage ||
      specialModalErrors.secondaryMessage ||
      specialModalErrors.angleOnWheel
    ) {
      return;
    }

    if (this.state.actionType === 'EDIT') {
      let objIndex = _.findIndex(tableData, function(item) {
        return item.number === selectedSpecialReward.number;
      });
      if (objIndex > -1) {
        tableData[objIndex]['id'] = selectedSpecialReward.id;
        tableData[objIndex]['displayName'] = selectedSpecialReward.displayName;
        tableData[objIndex]['dlAction'] = selectedSpecialReward.dlAction;
        tableData[objIndex]['dlActionParam'] =
          selectedSpecialReward.dlActionParam;
        tableData[objIndex]['primaryMessage'] =
          selectedSpecialReward.primaryMessage;
        tableData[objIndex]['secondaryMessage'] =
          selectedSpecialReward.secondaryMessage;
        tableData[objIndex]['imageUrl'] = selectedSpecialReward.imageUrl;
        tableData[objIndex]['angleOnWheel'] =
          selectedSpecialReward.angleOnWheel;
        tableData[objIndex]['generateOn'] = selectedSpecialReward.generateOn;
      }
    } else {
      let newRecord = {
        number: tableData.length + 1,
        id: selectedSpecialReward.id,
        displayName: selectedSpecialReward.displayName,
        dlAction: selectedSpecialReward.dlAction,
        dlActionParam: selectedSpecialReward.dlActionParam,
        primaryMessage: selectedSpecialReward.primaryMessage,
        secondaryMessage: selectedSpecialReward.secondaryMessage,
        imageUrl: selectedSpecialReward.imageUrl,
        angleOnWheel: selectedSpecialReward.angleOnWheel,
        generateOn: selectedSpecialReward.generateOn
      };
      tableData.push(newRecord);
    }
    this.setState({
      specialRewards: [...tableData],
      showAddEditSpecialRewardModal: false
    });
    this.resetSpecialFields();
  }

  deleteSpecialRow(record) {
    let tableData =
      this.state.specialRewards.length > 0
        ? [...this.state.specialRewards]
        : [];
    let objIndex = _.findIndex(tableData, function(item) {
      return item.number === record.number;
    });
    if (objIndex > -1) {
      tableData.splice(objIndex, 1);
    }
    let specialRewards = [];
    _.forEach(tableData, function(item, index) {
      let cursor = {};
      cursor['number'] = index + 1;
      cursor['id'] = item.id;
      cursor['displayName'] = item.displayName;
      cursor['dlAction'] = item.dlAction;
      cursor['dlActionParam'] = item.dlActionParam;
      cursor['primaryMessage'] = item.primaryMessage;
      cursor['secondaryMessage'] = item.secondaryMessage;
      cursor['imageUrl'] = item.imageUrl;
      cursor['angleOnWheel'] = item.angleOnWheel;
      cursor['generateOn'] = item.generateOn;
      specialRewards.push(cursor);
    });
    this.setState({
      specialRewards: [...specialRewards]
    });
  }

  getSpecialRewardImageUrl = data => {
    if (data && data.id) {
      let imageUrl = this.state.cdnPath + data.id;
      let selectedSpecialReward = { ...this.state.selectedSpecialReward };
      selectedSpecialReward.imageUrl = imageUrl;
      this.setState({
        selectedSpecialReward: { ...selectedSpecialReward }
      });
    }
  };

  toggleSpecialRewards(e) {
    this.setState({
      isSpecialRewards: !this.state.isSpecialRewards
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (
          values.rewardPopupImageDeeplink &&
          values.rewardPopupImageDeeplink != ''
        ) {
          try {
            JSON.parse(values.rewardPopupImageDeeplink);
          } catch (error) {
            message.error('Reward popup image deeplink is not a JSON object');
            return;
          }
        }
        let generalTableRewards =
          this.state.generalRewards && this.state.generalRewards.length > 0
            ? [...this.state.generalRewards]
            : [];

        if (generalTableRewards.length < 1) {
          message.error('General Rewards can not be empty');
          return;
        }
        let generalRewards = [];
        _.forEach(generalTableRewards, function(item) {
          let cursor = {};
          cursor['amount'] = item.amount;
          cursor['angleOnWheel'] = item.angleOnWheel;
          cursor['currency'] = item.currency;
          cursor['probability'] = item.probability;
          cursor['extraParameters'] = item.extraParameters
            ? JSON.parse(item.extraParameters)
            : null;
          generalRewards.push(cursor);
        });

        let specialRewards = [];
        let specialTableData =
          this.state.specialRewards && this.state.specialRewards.length > 0
            ? [...this.state.specialRewards]
            : [];
        if (specialTableData.length > 0) {
          _.forEach(specialTableData, function(item) {
            let cursor = {};
            cursor['id'] = item.id;
            cursor['displayName'] = item.displayName;
            cursor['dlAction'] = item.dlAction;
            cursor['dlActionParam'] = item.dlActionParam
              ? JSON.stringify(JSON.parse(item.dlActionParam))
              : '';
            cursor['primaryMessage'] = item.primaryMessage
              ? item.primaryMessage
              : '';
            cursor['secondaryMessage'] = item.secondaryMessage
              ? item.secondaryMessage
              : '';
            cursor['imageUrl'] = item.imageUrl;
            cursor['angleOnWheel'] = item.angleOnWheel;
            cursor['generateOn'] = item.generateOn
              ? item.generateOn.split(',')
              : [];
            specialRewards.push(cursor);
          });
        }

        let obj = {
          applyToTiers: ['DEFAULT'],
          wheelImageUrl: this.state.cdnPath + this.state.wheelImageUrl,
          wheelBoltImageUrl:
            this.state.wheelBoltImageUrl !== ''
              ? this.state.cdnPath + this.state.wheelBoltImageUrl
              : '',
          wheelNeedleImageUrl:
            this.state.wheelNeedleImageUrl !== ''
              ? this.state.cdnPath + this.state.wheelNeedleImageUrl
              : '',
          wheelHeaderImageUrl:
            this.state.wheelHeaderImageUrl !== ''
              ? this.state.cdnPath + this.state.wheelHeaderImageUrl
              : '',
          rewardPopupImageUrl:
            this.state.rewardPopupImageUrl !== ''
              ? this.state.cdnPath + this.state.rewardPopupImageUrl
              : '',
          rewardPopupImageDeeplink: values.rewardPopupImageDeeplink
            ? JSON.stringify(JSON.parse(values.rewardPopupImageDeeplink))
            : '',
          titleString: values.titleString ? values.titleString : '',
          titleStringColor: values.titleStringColor
            ? values.titleStringColor
            : '',
          subtitleString: values.subtitleString ? values.subtitleString : '',
          subtitleStringColor: values.subtitleStringColor
            ? values.subtitleStringColor
            : '',
          rewardBotImages: [...this.state.spinWheelData.rewardBotImages],
          generalRewards: [...generalRewards],
          specialRewards: specialRewards.length > 0 ? [...specialRewards] : null
        };

        if (specialRewards.length < 1) {
          delete obj.specialRewards;
        }

        let data = {
          appType: values.appType,
          countryCode: values.countryCode,
          obj: obj
        };

        // return;
        this.props.actions.setGoldenSpinWheelConfig(data).then(() => {
          window.location.reload();
        });
      }
    });
  }

  validateJson(e) {
    let val = e.target.value;
    if (val !== '') {
      try {
        JSON.parse(val);
        this.setState({ isInvalidJson: false });
        return true;
      } catch (error) {
        this.setState({ isInvalidJson: true });
        notification['error']({
          message: 'Invalid Json',
          description: 'Json you entered is invalid',
          placement: 'topLeft'
        });
        return false;
      }
    }
  }

  render() {
    const fixedFeildLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue
    } = this.props.form;

    const errors = {
      appType: isFieldTouched('appType') && getFieldError('appType'),
      rewardPopupImageDeeplink:
        isFieldTouched('rewardPopupImageDeeplink') &&
        getFieldError('rewardPopupImageDeeplink'),
      titleString:
        isFieldTouched('titleString') && getFieldError('titleString'),
      subtitleString:
        isFieldTouched('subtitleString') && getFieldError('subtitleString')
    };

    const generalRewardColumns = [
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        width: '5%'
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: '8%'
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        width: '8%'
      },
      {
        title: 'Probability',
        dataIndex: 'probability',
        key: 'probability',
        width: '8%'
      },
      {
        title: 'Angle',
        dataIndex: 'angleOnWheel',
        key: 'angleOnWheel',
        width: '8%'
      },
      {
        title: 'Extra Parameters',
        key: 'extraParameters',
        width: '43%',
        render: (text, record) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {record.extraParameters}
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        width: '20%',
        render: (text, record) => (
          <span>
            <Button
              icon="edit"
              type="primary"
              onClick={() => this.openAddEditEventModal('EDIT', record)}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete this record?"
              onConfirm={() => this.deleteRow(record)}
            >
              <Button icon="delete" type="danger" />
            </Popconfirm>
          </span>
        )
      }
    ];

    const specialRewardColumns = [
      {
        title: '#',
        dataIndex: 'number',
        key: 'number',
        width: '5%'
      },
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '9%',
        render: (text, record) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {record.id}
          </span>
        )
      },
      {
        title: 'Display Name',
        dataIndex: 'displayName',
        key: 'displayName',
        width: '9%',
        render: (text, record) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {record.displayName}
          </span>
        )
      },
      {
        title: 'Dl Action',
        dataIndex: 'dlAction',
        key: 'dlAction',
        width: '6%',
        render: (text, record) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {record.dlAction}
          </span>
        )
      },
      {
        title: 'DL Action Param',
        dataIndex: 'dlActionParam',
        key: 'dlActionParam',
        width: '14%',
        render: (text, record) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {record.dlActionParam}
          </span>
        )
      },
      {
        title: 'Primary Message',
        dataIndex: 'primaryMessage',
        key: 'primaryMessage',
        width: '9%',
        render: (text, record) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {record.primaryMessage}
          </span>
        )
      },
      {
        title: 'Secondary Message',
        dataIndex: 'secondaryMessage',
        key: 'secondaryMessage',
        width: '9%',
        render: (text, record) => (
          <span style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
            {record.secondaryMessage}
          </span>
        )
      },
      {
        title: 'Angle',
        dataIndex: 'angleOnWheel',
        key: 'angleOnWheel',
        width: '6%'
      },
      {
        title: 'Generate On',
        dataIndex: 'generateOn',
        key: 'generateOn',
        width: '9%'
      },
      {
        title: 'Preview',
        key: 'imageUrl',
        width: '15%',
        render: (text, record) => (
          <span>
            <img className="baner-list-img" src={record.imageUrl} alt="" />
          </span>
        )
      },
      {
        title: 'Actions',
        key: 'action',
        width: '9%',
        render: (text, record) => (
          <span>
            <Button
              icon="edit"
              type="primary"
              onClick={() => this.openAddEditSpecialRewardModal('EDIT', record)}
            />
            <Divider type="horizontal" />
            <Popconfirm
              title="Sure to delete this record?"
              onConfirm={() => this.deleteSpecialRow(record)}
            >
              <Button icon="delete" type="danger" />
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Card title="Spin Wheel Configuration">
          <Tag color={'red'}>Tier: DEFAULT</Tag>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={errors.countryCode ? 'error' : ''}
              help={errors.countryCode || ''}
              {...fixedFeildLayout}
              label={<span>Country Code</span>}
              extra={'Please select a country code to proceed'}
            >
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: true,
                    type: 'string',
                    message: 'App Type field is mandatory',
                    whitespace: false
                  }
                ]
              })(
                <Select
                  onSelect={e => this.countryCodeSelected(e)}
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select country"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {CountryList}
                </Select>
              )}
            </FormItem>
            {this.state.isCountrySelected && (
              <FormItem
                validateStatus={errors.appType ? 'error' : ''}
                help={errors.appType || ''}
                {...fixedFeildLayout}
                label={
                  <span>
                    App Type
                    <Tooltip title="Applicable to app type">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
                extra={'Please select App type before proceeding further'}
              >
                {getFieldDecorator('appType', {
                  rules: [
                    {
                      required: true,
                      type: 'string',
                      message: 'App Type field is mandatory',
                      whitespace: false
                    }
                  ]
                })(
                  <Select
                    onChange={this.appTypeSelected}
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="App type"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {AppTypeList}
                  </Select>
                )}
              </FormItem>
            )}
            {this.state.isAppTypeSelected && (
              <Row>
                <Card>
                  <Row>
                    <Col span={5}>
                      <div>
                        {this.state.loadWheelImageUrl && (
                          <ImageUploader
                            callbackFromParent={this.wheelImageUrlCallback}
                            header={'Wheel Image URL'}
                            previewImage={this.state.previewWheelImageUrl}
                            fileList={this.state.wheelImageUrlFileList}
                            isMandatory={true}
                            isLoading={this.isImageLoading}
                          />
                        )}
                      </div>
                    </Col>
                    <Col span={5}>
                      <div>
                        {this.state.loadWheelBoltImageUrl && (
                          <ImageUploader
                            callbackFromParent={this.wheelBoltImageUrlCallback}
                            header={'Wheel Bolt Image URL'}
                            previewImage={this.state.previewWheelBoltImageUrl}
                            fileList={this.state.wheelBoltImageUrlFileList}
                            isMandatory={false}
                            isLoading={this.isImageLoading}
                          />
                        )}
                      </div>
                    </Col>
                    <Col span={5}>
                      <div>
                        {this.state.loadWheelNeedleImageUrl && (
                          <ImageUploader
                            callbackFromParent={
                              this.wheelNeedleImageUrlCallback
                            }
                            header={'Wheel Needle Image URL'}
                            previewImage={this.state.previewWheelNeedleImageUrl}
                            fileList={this.state.wheelNeedleImageUrlFileList}
                            isMandatory={false}
                            isLoading={this.isImageLoading}
                          />
                        )}
                      </div>
                    </Col>
                    <Col span={5}>
                      <div>
                        {this.state.loadWheelHeaderImageUrl && (
                          <ImageUploader
                            callbackFromParent={
                              this.wheelHeaderImageUrlCallback
                            }
                            header={'Wheel Header Image URL'}
                            previewImage={this.state.previewWheelHeaderImageUrl}
                            fileList={this.state.wheelHeaderImageUrlFileList}
                            isMandatory={false}
                            isLoading={this.isImageLoading}
                          />
                        )}
                      </div>
                    </Col>
                    <Col span={4}>
                      <div>
                        {this.state.loadRewardPopupImageUrl && (
                          <ImageUploader
                            callbackFromParent={
                              this.rewardPopupImageUrlCallback
                            }
                            header={'Reward Popup Image URL'}
                            previewImage={this.state.previewRewardPopupImageUrl}
                            fileList={this.state.RewardPopupImageUrlFileList}
                            isMandatory={false}
                            isLoading={this.isImageLoading}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Row>
                  <Col span={24}>
                    <FormItem
                      validateStatus={
                        errors.rewardPopupImageDeeplink ? 'error' : ''
                      }
                      help={errors.rewardPopupImageDeeplink || ''}
                      {...fixedFeildLayout}
                      label={
                        <span>
                          Reward Popup Image Deep Link
                          <Tooltip title="Json details for deep link">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('rewardPopupImageDeeplink', {
                        rules: [
                          {
                            required: false
                          }
                        ]
                      })(
                        <TextArea onBlur={e => this.validateJson(e)} rows={3} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      validateStatus={errors.titleString ? 'error' : ''}
                      help={errors.titleString || ''}
                      {...fixedFeildLayout}
                      label={
                        <span>
                          Title String
                          <Tooltip title="Title String">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('titleString', {
                        intialValue: this.state.spinWheelData.titleString
                          ? this.state.spinWheelData.titleString
                          : '',
                        rules: [
                          {
                            required: false
                          }
                        ]
                      })(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      validateStatus={errors.subtitleString ? 'error' : ''}
                      help={errors.subtitleString || ''}
                      {...fixedFeildLayout}
                      label={
                        <span>
                          Sub Title String
                          <Tooltip title="Sub Title String">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('subtitleString', {
                        intialValue: this.state.spinWheelData.subtitleString
                          ? this.state.spinWheelData.subtitleString
                          : '',
                        rules: [
                          {
                            required: false
                          }
                        ]
                      })(<Input />)}
                    </FormItem>
                  </Col>
                </Row>

                <Card
                  type="inner"
                  title={
                    <span>
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#f5222d',
                          marginRight: '4px',
                          fontFamily: 'SimSun, sans-serif'
                        }}
                      >
                        *
                      </span>
                      <span>
                        General Rewards ( at least one row should be entered ){' '}
                      </span>
                    </span>
                  }
                >
                  <Table
                    rowKey="id"
                    bordered
                    pagination={false}
                    dataSource={this.state.generalRewards}
                    columns={generalRewardColumns}
                  />
                  <Button
                    style={{ marginTop: '20px' }}
                    onClick={() => this.openAddEditEventModal('NEW')}
                    type="primary"
                  >
                    {' '}
                    Add Reward
                  </Button>
                </Card>
                <FormItem
                  validateStatus={errors.isSpecialRewards ? 'error' : ''}
                  help={errors.isSpecialRewards || ''}
                  {...fixedFeildLayout}
                  label={
                    <span>
                      Special Rewards
                      <Tooltip title="Enable it to add special rewards information">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('isSpecialRewards', {
                    rules: [
                      {
                        required: false
                      }
                    ]
                  })(
                    <Switch
                      onChange={e => this.toggleSpecialRewards(e)}
                      checked={this.state.isSpecialRewards ? true : false}
                    />
                  )}
                </FormItem>
                {this.state.isSpecialRewards && (
                  <Card type="inner" title="Special Rewards">
                    <Table
                      rowKey="number"
                      bordered
                      pagination={false}
                      dataSource={this.state.specialRewards}
                      columns={specialRewardColumns}
                    />
                    <Button
                      style={{ marginTop: '20px' }}
                      onClick={() => this.openAddEditSpecialRewardModal('NEW')}
                      type="primary"
                    >
                      {' '}
                      Add Special Reward
                    </Button>
                  </Card>
                )}
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Row>
            )}
          </Form>
        </Card>
        <Modal
          title={'Reward change modal'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeAddEditEventModal()}
          onOk={() => this.saveChanges()}
          okText="Save"
          visible={this.state.showAddEditRewardModal}
        >
          <Card>
            <Row>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>
                Amount:
              </Col>
              <Col span={18}>
                <InputNumber
                  min={0}
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.amount ? 'red' : 'grey'
                  }}
                  value={this.state.selectedGeneralReward.amount}
                  onChange={e => this.updateValues(e, 'AMOUNT')}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>Currency:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.currency
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedGeneralReward.currency}
                  onChange={e => this.updateValues(e.target.value, 'CURRENCY')}
                />
                {/* <Select
                  showSearch
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.currency
                      ? 'red'
                      : 'grey'
                  }}
                  placeholder="Currency"
                  optionFilterProp="children"
                  value={this.state.selectedGeneralReward.currency}
                  onSelect={e => this.updateValues(e, 'CURRENCY')}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {CurrencyList}
                </Select> */}
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>Probability:
              </Col>
              <Col span={18}>
                <InputNumber
                  min={0}
                  max={1}
                  step={0.01}
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.probability
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedGeneralReward.probability}
                  onChange={e => this.updateValues(e, 'PROBABILITY')}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>Angle On Wheel:
              </Col>
              <Col span={18}>
                <InputNumber
                  min={0}
                  max={360}
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.angleOnWheel
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedGeneralReward.angleOnWheel}
                  onChange={e => this.updateValues(e, 'ANGLE')}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                Extra Parameters:
              </Col>
              <Col span={18}>
                <TextArea
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.modalErrors.extraParameters
                      ? 'red'
                      : 'grey'
                  }}
                  onChange={e =>
                    this.updateValues(e.target.value, 'EXTRA_PARAM')
                  }
                  onBlur={e => this.validateJson(e)}
                  value={this.state.selectedGeneralReward.extraParameters}
                  rows={3}
                />
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title={'Special Reward Change modal'}
          closable={true}
          maskClosable={true}
          width={1000}
          onCancel={() => this.closeAddEditSpecialRewardModal()}
          onOk={() => this.saveSpecialChanges()}
          okText="Save"
          visible={this.state.showAddEditSpecialRewardModal}
        >
          <Card>
            <Row>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>
                ID:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.id
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedSpecialReward.id}
                  onChange={e => this.updateSpecialValues(e.target.value, 'ID')}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>
                Display Name:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.displayName
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedSpecialReward.displayName}
                  onChange={e =>
                    this.updateSpecialValues(e.target.value, 'DISPLAY_NAME')
                  }
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>
                DL Action:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.dlAction
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedSpecialReward.dlAction}
                  onChange={e =>
                    this.updateSpecialValues(e.target.value, 'DL_ACTION')
                  }
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                DL Action Param:
              </Col>
              <Col span={18}>
                <TextArea
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.dlActionParam
                      ? 'red'
                      : 'grey'
                  }}
                  onChange={e =>
                    this.updateSpecialValues(e.target.value, 'DL_ACTION_PARAM')
                  }
                  onBlur={e => this.validateJson(e)}
                  value={this.state.selectedSpecialReward.dlActionParam}
                  rows={3}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                Primary Message:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.primaryMessage
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedSpecialReward.primaryMessage}
                  onChange={e =>
                    this.updateSpecialValues(e.target.value, 'PRIMARY_MESSAGE')
                  }
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                Secondary Message:
              </Col>
              <Col span={18}>
                <Input
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.secondaryMessage
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedSpecialReward.secondaryMessage}
                  onChange={e =>
                    this.updateSpecialValues(
                      e.target.value,
                      'SECONDARY_MESSAGE'
                    )
                  }
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                <span style={{ ...mandatoryStyle }}>*</span>Angle On Wheel:
              </Col>
              <Col span={18}>
                <InputNumber
                  min={0}
                  max={360}
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.angleOnWheel
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedSpecialReward.angleOnWheel}
                  onChange={e => this.updateSpecialValues(e, 'ANGLE')}
                />
              </Col>
              <Col span={6} style={{ ...labelStyle }}>
                Generate On:
              </Col>
              <Col span={18}>
                <Input
                  placeholder="YYYYMMDD-HHmm"
                  style={{
                    ...fieldStyle,
                    borderColor: this.state.specialModalErrors.generateOn
                      ? 'red'
                      : 'grey'
                  }}
                  value={this.state.selectedSpecialReward.generateOn}
                  onChange={e =>
                    this.updateSpecialValues(e.target.value, 'GENERATED_ON')
                  }
                />
                <Tag color="orange">
                  Enter comma seperated dates in YYYYMMDD-HHmm format
                </Tag>
              </Col>
              <Col span={12} offset={12}>
                {((this.state.selectedSpecialReward &&
                  this.state.selectedSpecialReward.imageUrl) ||
                  this.state.showModalImageUploader) && (
                  <ImageUploader
                    callbackFromParent={this.getSpecialRewardImageUrl}
                    header={'Image URL'}
                    previewImage={this.state.selectedSpecialReward.imageUrl}
                    fileList={this.state.specialRewardImageUrlFileList}
                    isMandatory={true}
                    isLoading={this.isImageLoading}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goldenSpinWheelConfigResponse:
      state.spinWheel.goldenSpinWheelConfigResponse,
    getCdnPathForUploadResponse: state.website.getCdnPathForUploadResponse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...spinWheelActions,
        ...websiteActions
      },
      dispatch
    )
  };
}
const GoldenSpinWheelForm = Form.create()(GoldenSpinWheel);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoldenSpinWheelForm);
