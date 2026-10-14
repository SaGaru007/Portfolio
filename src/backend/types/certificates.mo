import Common "common";

module {
  public type CertificateId = Common.CertificateId;

  public type Certificate = {
    id : CertificateId;
    title : Text;
    issuer : Text;
    date : Text;
    fileAssetId : Text;
    createdAt : Common.Timestamp;
  };

  public type AddCertificateInput = {
    title : Text;
    issuer : Text;
    date : Text;
    fileAssetId : Text;
  };
};
