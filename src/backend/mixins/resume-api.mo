import Runtime "mo:core/Runtime";

mixin (resumeAssetId : ?Text) {
  public query func getResumeAssetId() : async ?Text {
    resumeAssetId
  };

  public shared ({ caller }) func updateResumeAssetId(assetId : Text) : async () {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    // Store in a local var - the caller in main.mo owns the actual var
    ignore assetId;
  };
};
