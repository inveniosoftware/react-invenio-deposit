import React from "react";
import PropTypes from "prop-types";
import { ProtectionButtons } from "./ProtectionButtons";
import { i18next } from "@translations/i18next";

export const MetadataAccess = ({ recordAccess, communityAccess }) => {
  const publicMetadata = recordAccess === "public";
  const publicCommunity = communityAccess === "public";

  return (
    <>
      {i18next.t("Full record")}
      <ProtectionButtons
        active={publicMetadata && publicCommunity}
        disabled={!publicCommunity}
        fieldPath="access.record"
      />
    </>
  );
};

MetadataAccess.propTypes = {
  recordAccess: PropTypes.string.isRequired,
  communityAccess: PropTypes.string.isRequired,
};
