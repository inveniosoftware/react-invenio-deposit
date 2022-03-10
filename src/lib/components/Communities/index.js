import { CommunityHeaderComponent } from './CommunityHeader';
import { connect } from 'react-redux';
import { setCommunity } from '../../state/actions/communities';

const mapStateToProps = (state) => ({
  community: state.communities.defaultCommunity,
});

const mapDispatchToProps = (dispatch) => ({
  setCommunity: (community, draft) => dispatch(setCommunity(community, draft)),
});

export const CommunityHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityHeaderComponent);
