import Common "../types/common";
import List "mo:core/List";
import ProjectTypes "../types/projects";
import CertTypes "../types/certificates";
import AiLib "../lib/ai";

mixin (
  projects : List.List<ProjectTypes.Project>,
  certificates : List.List<CertTypes.Certificate>,
  resumeAssetId : ?Text,
) {
  public shared func generateRecruiterSummary() : async Text {
    let ctx = AiLib.buildPortfolioContext(projects, certificates, resumeAssetId);
    await AiLib.generateSummary(ctx)
  };

  public shared func sendChatMessage(history : [Common.ChatMessage], question : Text) : async Text {
    let ctx = AiLib.buildPortfolioContext(projects, certificates, resumeAssetId);
    await AiLib.chat(history, question, ctx)
  };
};
