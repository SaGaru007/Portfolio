import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import ProjectTypes "types/projects";
import CertTypes "types/certificates";
import Common "types/common";
import ProjectLib "lib/projects";
import CertLib "lib/certificates";
import AiLib "lib/ai";

actor {
  let projects = List.empty<ProjectTypes.Project>();
  var nextProjectId : Nat = 1;

  let certificates = List.empty<CertTypes.Certificate>();
  var nextCertId : Nat = 1;

  var resumeAssetId : ?Text = null;

  // Seed initial data on first deploy (idempotent: only runs once)
  var seeded : Bool = false;

  if (not seeded) {
    let now = Time.now();
    for (input in ProjectLib.seedProjects.values()) {
      ignore ProjectLib.add(projects, nextProjectId, input, now);
      nextProjectId += 1;
    };
    for (input in CertLib.seedCertificates.values()) {
      ignore CertLib.add(certificates, nextCertId, input, now);
      nextCertId += 1;
    };
    seeded := true;
  };

  // ── Projects ──────────────────────────────────────────────────────────────

  public query func listProjects() : async [ProjectTypes.Project] {
    ProjectLib.listAll(projects)
  };

  public query func getProject(id : ProjectTypes.ProjectId) : async ?ProjectTypes.Project {
    ProjectLib.getById(projects, id)
  };

  public shared ({ caller }) func addProject(input : ProjectTypes.AddProjectInput) : async ProjectTypes.Project {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    let now = Time.now();
    let project = ProjectLib.add(projects, nextProjectId, input, now);
    nextProjectId += 1;
    project
  };

  public shared ({ caller }) func updateProject(input : ProjectTypes.UpdateProjectInput) : async Bool {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    ProjectLib.update(projects, input, Time.now())
  };

  public shared ({ caller }) func deleteProject(id : ProjectTypes.ProjectId) : async Bool {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    ProjectLib.delete(projects, id)
  };

  // ── Certificates ──────────────────────────────────────────────────────────

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
    let cert = CertLib.add(certificates, nextCertId, input, now);
    nextCertId += 1;
    cert
  };

  public shared ({ caller }) func deleteCertificate(id : CertTypes.CertificateId) : async Bool {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    CertLib.delete(certificates, id)
  };

  // ── Resume ────────────────────────────────────────────────────────────────

  public query func getResumeAssetId() : async ?Text {
    resumeAssetId
  };

  public shared ({ caller }) func updateResumeAssetId(assetId : Text) : async () {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: admin only");
    };
    resumeAssetId := ?assetId;
  };

  // ── AI / Chat ─────────────────────────────────────────────────────────────

  public shared func generateRecruiterSummary() : async Text {
    let ctx = AiLib.buildPortfolioContext(projects, certificates, resumeAssetId);
    await AiLib.generateSummary(ctx)
  };

  public shared func sendChatMessage(history : [Common.ChatMessage], question : Text) : async Text {
    let ctx = AiLib.buildPortfolioContext(projects, certificates, resumeAssetId);
    await AiLib.chat(history, question, ctx)
  };
};
