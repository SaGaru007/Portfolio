import Common "common";

module {
  public type ProjectId = Common.ProjectId;

  public type Project = {
    id : ProjectId;
    title : Text;
    description : Text;
    techStack : [Text];
    demoLink : ?Text;
    githubLink : ?Text;
    imageAssetId : ?Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type AddProjectInput = {
    title : Text;
    description : Text;
    techStack : [Text];
    demoLink : ?Text;
    githubLink : ?Text;
    imageAssetId : ?Text;
  };

  public type UpdateProjectInput = {
    id : ProjectId;
    title : Text;
    description : Text;
    techStack : [Text];
    demoLink : ?Text;
    githubLink : ?Text;
    imageAssetId : ?Text;
  };
};
