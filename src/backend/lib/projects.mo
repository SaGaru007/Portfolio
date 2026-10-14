import List "mo:core/List";
import Types "../types/projects";
import Common "../types/common";

module {
  // Seed data: 3 initial projects for Sagar M H
  public let seedProjects : [Types.AddProjectInput] = [
    {
      title = "Fintech Payment Platform";
      description = "A high-throughput, microservices-based payment processing platform built with Spring Boot and Java. Supports multi-currency transactions, real-time fraud detection, and PCI-DSS compliance. Deployed on AWS with auto-scaling and 99.9% uptime SLA.";
      techStack = ["Java", "Spring Boot", "Microservices", "AWS", "PostgreSQL", "Kafka", "Docker", "Kubernetes"];
      demoLink = null;
      githubLink = ?("https://github.com/SaGaru007");
      imageAssetId = null;
    },
    {
      title = "AI Plant Detection System";
      description = "A deep learning application that identifies plant species and detects diseases from images using convolutional neural networks. Built with Python and TensorFlow, exposed via a Spring Boot REST API, and integrated with a React dashboard for field agronomists.";
      techStack = ["Python", "TensorFlow", "Spring Boot", "React", "REST API", "Docker", "AWS S3"];
      demoLink = null;
      githubLink = ?("https://github.com/SaGaru007");
      imageAssetId = null;
    },
    {
      title = "Microservices Demo Platform";
      description = "A reference microservices architecture demonstrating service discovery, circuit breaking, distributed tracing, and centralized configuration. Implements patterns like Saga and CQRS using Spring Cloud, Eureka, and RabbitMQ.";
      techStack = ["Java", "Spring Cloud", "Eureka", "RabbitMQ", "Docker Compose", "Zipkin", "Spring Boot"];
      demoLink = null;
      githubLink = ?("https://github.com/SaGaru007");
      imageAssetId = null;
    },
  ];

  public func listAll(projects : List.List<Types.Project>) : [Types.Project] {
    projects.toArray()
  };

  public func getById(projects : List.List<Types.Project>, id : Types.ProjectId) : ?Types.Project {
    projects.find(func(p) { p.id == id })
  };

  public func add(
    projects : List.List<Types.Project>,
    nextId : Nat,
    input : Types.AddProjectInput,
    now : Common.Timestamp,
  ) : Types.Project {
    let project : Types.Project = {
      id = nextId;
      title = input.title;
      description = input.description;
      techStack = input.techStack;
      demoLink = input.demoLink;
      githubLink = input.githubLink;
      imageAssetId = input.imageAssetId;
      createdAt = now;
      updatedAt = now;
    };
    projects.add(project);
    project
  };

  public func update(
    projects : List.List<Types.Project>,
    input : Types.UpdateProjectInput,
    now : Common.Timestamp,
  ) : Bool {
    var found = false;
    projects.mapInPlace(
      func(p) {
        if (p.id == input.id) {
          found := true;
          {
            p with
            title = input.title;
            description = input.description;
            techStack = input.techStack;
            demoLink = input.demoLink;
            githubLink = input.githubLink;
            imageAssetId = input.imageAssetId;
            updatedAt = now;
          };
        } else { p };
      }
    );
    found
  };

  public func delete(projects : List.List<Types.Project>, id : Types.ProjectId) : Bool {
    let sizeBefore = projects.size();
    let kept = projects.filter(func(p) { p.id != id });
    projects.clear();
    projects.append(kept);
    projects.size() < sizeBefore
  };
};
