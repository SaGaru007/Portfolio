import List "mo:core/List";
import Types "../types/certificates";
import Common "../types/common";

module {
  // Seed data: 2 initial certificates for Sagar M H
  public let seedCertificates : [Types.AddCertificateInput] = [
    {
      title = "Salesforce Certified Administrator";
      issuer = "Salesforce";
      date = "2024-03";
      fileAssetId = "";
    },
    {
      title = "Spring Boot Microservices with Spring Cloud";
      issuer = "Udemy";
      date = "2023-11";
      fileAssetId = "";
    },
  ];

  public func listAll(certificates : List.List<Types.Certificate>) : [Types.Certificate] {
    certificates.toArray()
  };

  public func getById(certificates : List.List<Types.Certificate>, id : Types.CertificateId) : ?Types.Certificate {
    certificates.find(func(c) { c.id == id })
  };

  public func add(
    certificates : List.List<Types.Certificate>,
    nextId : Nat,
    input : Types.AddCertificateInput,
    now : Common.Timestamp,
  ) : Types.Certificate {
    let cert : Types.Certificate = {
      id = nextId;
      title = input.title;
      issuer = input.issuer;
      date = input.date;
      fileAssetId = input.fileAssetId;
      createdAt = now;
    };
    certificates.add(cert);
    cert
  };

  public func delete(certificates : List.List<Types.Certificate>, id : Types.CertificateId) : Bool {
    let sizeBefore = certificates.size();
    let kept = certificates.filter(func(c) { c.id != id });
    certificates.clear();
    certificates.append(kept);
    certificates.size() < sizeBefore
  };
};
