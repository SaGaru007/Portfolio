import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import CertTypes "../types/certificates";
import CertLib "../lib/certificates";

mixin (
  certificates : List.List<CertTypes.Certificate>,
  nextCertId : Nat,
) {
  public query func listCertificates() : async [CertTypes.Certificate] {
    CertLib.listAll(certificates)
  };

  public query func getCertificate(id : CertTypes.CertificateId) : async ?CertTypes.Certificate {
    CertLib.getById(certificates, id)
  };

  public shared ({ caller }) func addCertificate(input : CertTypes.AddCertificateInput) : async CertTypes.Certificate {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    let now = Time.now();
    let newId = nextCertId + certificates.size();
    CertLib.add(certificates, newId, input, now)
  };

  public shared ({ caller }) func deleteCertificate(id : CertTypes.CertificateId) : async Bool {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    CertLib.delete(certificates, id)
  };
};
