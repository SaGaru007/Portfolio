import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import ProjectTypes "../types/projects";
import ProjectLib "../lib/projects";

mixin (
  projects : List.List<ProjectTypes.Project>,
  nextProjectId : Nat,
) {
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
    let newId = nextProjectId + projects.size();
    ProjectLib.add(projects, newId, input, now)
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
};
