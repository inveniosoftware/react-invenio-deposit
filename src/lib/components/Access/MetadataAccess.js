import React from "react";
import PropTypes from "prop-types";
import { ProtectionButtons } from "./ProtectionButtons";
import { i18next } from "@translations/i18next";
import Overridable from "react-overridable";

export const MetadataAccess = (props) => {
  const { recordAccess, communityAccess } = props;
  const publicMetadata = recordAccess === "public";
  const publicCommunity = communityAccess === "public";

  return (
    <Overridable id="ReactInvenioDeposit.MetadataAccess.layout" {...props}>
      <>
        {i18next.t("Full record")}
        <ProtectionButtons
          active={publicMetadata && publicCommunity}
          disabled={!publicCommunity}
          fieldPath="access.record"
        />
      </>
    </Overridable>
  );
};

MetadataAccess.propTypes = {
  recordAccess: PropTypes.string.isRequired,
  communityAccess: PropTypes.string.isRequired,
};
