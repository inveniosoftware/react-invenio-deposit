import { CommunityHeaderComponent } from './CommunityHeader';
import { connect } from 'react-redux';
import { setCommunity } from '../../state/actions/communities';

const mapStateToProps = (state) => ({
  community: state.communities.defaultCommunity,
});

const mapDispatchToProps = (dispatch) => ({
  setCommunity: (community) => dispatch(setCommunity(community)),
});

export const CommunityHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityHeaderComponent);
