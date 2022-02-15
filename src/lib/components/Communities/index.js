import { CommunityHeaderComponent } from './CommunityHeader';
import { connect } from 'react-redux';
import { setCommunity } from '../../state/actions/communities';

const mapStateToProps = (state) => ({
  communityRedux: state.communities.community,
});

const mapDispatchToProps = (dispatch) => ({
  setCommunity: (community) => dispatch(setCommunity(community)),
});

export const CommunityHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityHeaderComponent);
