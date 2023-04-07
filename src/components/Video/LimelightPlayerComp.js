// // @flow

// import React from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// // import LimelightPlayerCompActions from "../actions/LimelightPlayerCompActions";
// // type LimelightPlayerComp ={}

// class LimelightPlayerComp extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   componentDidMount() {
//     const script = document.createElement('script');
//     script.src =
//       'https://video.limelight.com/player/limelightjs-player.js?orgId=de7aaac2e36847a8889198a6c5259b0d';
//     script.onload = () => {
//       LimelightPlayerUtil.embed({
//         mediaId: this.props.videoDetails.mediaId, //portrait
//         //    "mediaId": "31be42784daf403cb88b243b24d01efa", //landscape
//         //"mediaId": "${mediaId}", //landscape
//         playerId: 'limelight_player_947596',
//         playerForm: 'LVPPlayerStandard'
//       });
//     };
//     document.body.appendChild(script);
//   }
//   render() {
//     return (
//       <React.Fragment>
//         <div id="limelight_player_947596" />
//       </React.Fragment>
//     );
//   }
// }

// function mapStateToProps(state, ownProps) {
//   return {
//     video: state.video
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     // actions: bindActionCreators(LimelightPlayerCompActions, dispatch)
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(LimelightPlayerComp);
