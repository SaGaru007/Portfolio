module {
  public type ProjectId = Nat;
  public type CertificateId = Nat;
  public type Timestamp = Int;

  public type ChatRole = { #user; #assistant };

  public type ChatMessage = {
    role : ChatRole;
    content : Text;
  };
};
