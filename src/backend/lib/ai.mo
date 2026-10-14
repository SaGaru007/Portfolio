import Char "mo:core/Char";
import List "mo:core/List";
import Text "mo:core/Text";
import Common "../types/common";
import ProjectTypes "../types/projects";
import CertTypes "../types/certificates";

module {
  // IC management canister type for http_request (HTTP outcalls)
  type HttpHeader = { name : Text; value : Text };
  type HttpResponse = { status : Nat; headers : [HttpHeader]; body : Blob };
  type IC = actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [HttpHeader];
      body : ?Blob;
      transform : ?{
        function : shared query ({ response : HttpResponse; context : Blob }) -> async HttpResponse;
        context : Blob;
      };
      is_replicated : ?Bool;
    }) -> async HttpResponse;
  };

  let ic : IC = actor "aaaaa-aa";

  // Sagar M H full profile context (static, embedded in canister)
  let SAGAR_PROFILE : Text = "Name: Sagar M H\nTitle: Java Developer & Spring Boot Engineer\nLocation: Bangalore, India\nGitHub: https://github.com/SaGaru007\nLinkedIn: https://www.linkedin.com/in/sagar-m-h-ba29322a6\n\nSummary:\nPassionate Java and Spring Boot developer with hands-on experience building scalable microservices, RESTful APIs, and cloud-native applications. Strong foundation in backend engineering with exposure to AWS cloud services, containerisation with Docker/Kubernetes, and event-driven architectures using Kafka and RabbitMQ. Enthusiastic about clean code, design patterns, and delivering business value through reliable software engineering.\n\nSkills:\n- Languages: Java (primary), Python, SQL, JavaScript\n- Frameworks: Spring Boot, Spring Cloud, Spring MVC, Spring Security, Hibernate/JPA\n- Cloud & DevOps: AWS (EC2, S3, RDS, Lambda), Docker, Kubernetes, Jenkins CI/CD\n- Databases: PostgreSQL, MySQL, MongoDB, Redis\n- Messaging: Apache Kafka, RabbitMQ\n- Architecture: Microservices, REST APIs, Event-Driven, CQRS, Saga Pattern\n- Tools: Git, Maven, Gradle, Postman, IntelliJ IDEA, VS Code\n\nEducation:\n- Bachelor of Engineering, Computer Science\n\nExperience:\n- Java Backend Developer (Fresher/Junior level)\n- Built microservices architectures using Spring Boot and Spring Cloud\n- Worked with relational and NoSQL databases for high-performance data access\n- Deployed and managed applications on AWS infrastructure\n- Implemented messaging pipelines with Kafka for real-time data processing\n";

  public func buildPortfolioContext(
    projects : List.List<ProjectTypes.Project>,
    certificates : List.List<CertTypes.Certificate>,
    resumeAssetId : ?Text,
  ) : Text {
    let projectLines = projects.foldLeft(
      "",
      func(acc : Text, p : ProjectTypes.Project) : Text {
        acc # "- " # p.title # ": " # p.description # " Tech: " # p.techStack.values().join(", ") # "\n"
      },
    );

    let certLines = certificates.foldLeft(
      "",
      func(acc : Text, c : CertTypes.Certificate) : Text {
        acc # "- " # c.title # " by " # c.issuer # " (" # c.date # ")\n"
      },
    );

    let resumeSection = switch (resumeAssetId) {
      case (?_) "Resume: Available for download\n";
      case null "Resume: Not yet uploaded\n";
    };

    SAGAR_PROFILE #
    "\nProjects:\n" # projectLines #
    "\nCertifications:\n" # certLines #
    "\n" # resumeSection
  };

  // Minimal JSON string escaping
  func escapeJson(s : Text) : Text {
    var result = "";
    for (c in s.toIter()) {
      let code = c.toNat32();
      if (code == 92) { result := result # "\\\\" }      // backslash
      else if (code == 34) { result := result # "\\\"" } // double-quote
      else if (code == 10) { result := result # "\\n" }  // newline
      else if (code == 9) { result := result # "\\t" }   // tab
      else { result := result # Text.fromChar(c) };
    };
    result
  };

  // Build OpenAI-compatible JSON request body
  func buildRequestBody(systemPrompt : Text, userMessages : [{ role : Text; content : Text }]) : Blob {
    var msgJson = "";
    for (msg in userMessages.values()) {
      if (msgJson != "") { msgJson := msgJson # "," };
      msgJson := msgJson # "{\"role\":\"" # msg.role # "\",\"content\":\"" # escapeJson(msg.content) # "\"}";
    };
    let body = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"system\",\"content\":\"" #
      escapeJson(systemPrompt) # "\"}," # msgJson # "],\"max_tokens\":800,\"temperature\":0.7}";
    body.encodeUtf8()
  };

  // Extract the content value from an OpenAI JSON response.
  // Looks for "content":"<value>" and extracts the first non-empty <value>.
  func parseContent(json : Text) : Text {
    let marker = "\"content\":\"";
    let segments = json.split(#text marker);
    // Convert to array so we can index
    let parts = segments.toArray();
    // parts[0] is before first marker, parts[1+] start with the content value
    if (parts.size() < 2) {
      return "I'm sorry, I couldn't generate a response. Please try again.";
    };
    // Use the last content segment (final assistant message)
    let seg = parts[parts.size() - 1];
    let chars = seg.toArray();
    var i = 0;
    var escaped = false;
    var content = "";
    label reading while (i < chars.size()) {
      let c = chars[i];
      let code = c.toNat32();
      if (escaped) {
        if (code == 92) { content := content # "\\" }      // backslash
        else if (code == 34) { content := content # "\"" } // double-quote
        else if (code == 110) { content := content # "\n" } // n -> newline
        else if (code == 116) { content := content # "\t" } // t -> tab
        else { content := content # Text.fromChar(c) };
        escaped := false;
      } else if (code == 92) {
        escaped := true;
      } else if (code == 34) {
        break reading;
      } else {
        content := content # Text.fromChar(c);
      };
      i += 1;
    };
    if (content == "") {
      "I'm sorry, I couldn't generate a response. Please try again."
    } else { content }
  };

  public func generateSummary(portfolioContext : Text) : async Text {
    let systemPrompt = "You are an expert technical recruiter assistant. Given a developer's portfolio profile, " #
      "generate a concise, engaging 3-4 paragraph professional summary suitable for recruiters. " #
      "Highlight key technical strengths, notable projects, and career trajectory. Be specific and factual.";

    let reqBody = buildRequestBody(
      systemPrompt,
      [{ role = "user"; content = "Generate a professional recruiter summary for this developer:\n\n" # portfolioContext }],
    );

    let response = await ic.http_request({
      url = "https://api.openai.com/v1/chat/completions";
      max_response_bytes = ?10000;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer sk-placeholder-replace-with-real-key" },
      ];
      body = ?reqBody;
      transform = null;
      is_replicated = ?false;
    });

    switch (response.body.decodeUtf8()) {
      case (?json) parseContent(json);
      case null "Unable to decode AI response.";
    }
  };

  public func chat(
    history : [Common.ChatMessage],
    question : Text,
    portfolioContext : Text,
  ) : async Text {
    let systemPrompt = "You are an AI assistant representing Sagar M H's professional portfolio. " #
      "Answer recruiter questions accurately based on his profile. Be concise, professional, and helpful. " #
      "Only answer questions related to his skills, experience, projects, and professional background. " #
      "Here is his full profile:\n\n" # portfolioContext;

    // Build message array from history + new question
    var messages : [{ role : Text; content : Text }] = [];
    for (msg in history.values()) {
      let role = switch (msg.role) { case (#user) "user"; case (#assistant) "assistant" };
      messages := messages.concat([{ role; content = msg.content }]);
    };
    messages := messages.concat([{ role = "user"; content = question }]);

    let reqBody = buildRequestBody(systemPrompt, messages);

    let response = await ic.http_request({
      url = "https://api.openai.com/v1/chat/completions";
      max_response_bytes = ?10000;
      method = #post;
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer sk-placeholder-replace-with-real-key" },
      ];
      body = ?reqBody;
      transform = null;
      is_replicated = ?false;
    });

    switch (response.body.decodeUtf8()) {
      case (?json) parseContent(json);
      case null "Unable to decode AI response.";
    }
  };
};
