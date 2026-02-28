import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

actor {
  // Core Types
  type Message = {
    id : Nat;
    text : Text;
    timestamp : Time.Time;
    fromUser : Bool;
    requestType : {
      #textRequest;
      #imageRequest;
      #imageResponse : Nat;
      #videoRequest;
      #videoResponse : Nat;
    };
  };

  module Message {
    public func compare(message1 : Message, message2 : Message) : Order.Order {
      Int.compare(message1.timestamp, message2.timestamp);
    };
  };

  type MessageInput = {
    text : Text;
    fromUser : Bool;
    requestType : {
      #textRequest;
      #imageRequest;
      #imageResponse : Nat;
      #videoRequest;
      #videoResponse : Nat;
    };
  };

  type Conversation = {
    title : Text;
    id : Text;
    createdAt : Time.Time;
    messages : [Message];
  };

  module Conversation {
    public func compare(conversation1 : Conversation, conversation2 : Conversation) : Order.Order {
      Int.compare(conversation1.createdAt, conversation2.createdAt);
    };
  };

  let conversations = Map.empty<Principal, Map.Map<Text, Conversation>>();

  func getInitConvoMap(userId : Principal) : Map.Map<Text, Conversation> {
    switch (conversations.get(userId)) {
      case (null) {
        let map = Map.empty<Text, Conversation>();
        conversations.add(userId, map);
        map;
      };
      case (?map) { map };
    };
  };

  func getGenesisMessage() : Message {
    {
      id = 0;
      timestamp = Time.now();
      text = "Hi, how can I help you today?";
      fromUser = false;
      requestType = #textRequest;
    };
  };

  func getNewConversation(title : Text) : Conversation {
    {
      title;
      id = title;
      createdAt = Time.now();
      messages = [getGenesisMessage()];
    };
  };

  public func addConversation(userId : Principal, title : Text) : async () {
    let convoMap = getInitConvoMap(userId);
    let conversation = getNewConversation(title);
    convoMap.add(conversation.id, conversation);
  };

  public func deleteConversation(userId : Principal, conversationId : Text) : async () {
    switch (conversations.get(userId)) {
      case (null) { Runtime.trap("User does not exist. Can't delete conversation") };
      case (?convoMap) {
        if (not convoMap.containsKey(conversationId)) {
          Runtime.trap("Conversation does not exist. Can't delete");
        };
        convoMap.remove(conversationId);
        conversations.add(userId, convoMap);
      };
    };
  };

  func getNextMessageId(conversation : Conversation) : Nat {
    var maxId = 0;
    for (message in conversation.messages.values()) {
      if (message.id > maxId) { maxId := message.id };
    };
    maxId + 1;
  };

  func getMessageFromInput(messageInput : MessageInput, conversation : Conversation) : Message {
    {
      id = getNextMessageId(conversation);
      timestamp = Time.now();
      text = messageInput.text;
      fromUser = messageInput.fromUser;
      requestType = messageInput.requestType;
    };
  };

  public func addMessage(userId : Principal, conversationId : Text, messageInput : MessageInput) : async () {
    switch (conversations.get(userId)) {
      case (null) {
        Runtime.trap("User does not exist. Can't add message");
      };
      case (?convoMap) {
        switch (convoMap.get(conversationId)) {
          case (null) {
            Runtime.trap("Conversation does not exist. Can't add message");
          };
          case (?conversation) {
            let message = getMessageFromInput(messageInput, conversation);
            let messages = conversation.messages.concat([message]);
            let updatedConversation = {
              conversation with
              messages
            };
            convoMap.add(conversationId, updatedConversation);
          };
        };
      };
    };
  };

  public func setMessages(userId : Principal, conversationId : Text, newMessages : [Message]) : async () {
    switch (conversations.get(userId)) {
      case (null) {
        Runtime.trap("User does not exist. Can't set messages");
      };
      case (?convoMap) {
        switch (convoMap.get(conversationId)) {
          case (null) {
            Runtime.trap("Conversation does not exist. Can't set messages");
          };
          case (?conversation) {
            let updatedConversation = {
              conversation with
              messages = newMessages;
            };
            convoMap.add(conversationId, updatedConversation);
            conversations.add(userId, convoMap);
          };
        };
      };
    };
  };

  func getMessage(message : Message) : Message {
    message;
  };

  public query ({ caller }) func getMessagesWithNRows(conversationId : Text, numRows : Nat) : async [Message] {
    switch (conversations.get(caller)) {
      case (null) { [] };
      case (?convoMap) {
        switch (convoMap.get(conversationId)) {
          case (null) { [] };
          case (?conversation) {
            let messagesLength = conversation.messages.size();
            if (numRows >= messagesLength) {
              return conversation.messages.reverse();
            };
            conversation.messages.sliceToArray(messagesLength - numRows, messagesLength).reverse();
          };
        };
      };
    };
  };

  public query ({ caller }) func getConversation(_userId : Principal, conversationId : Text) : async ?Conversation {
    switch (conversations.get(caller)) {
      case (null) { null };
      case (?convoMap) {
        convoMap.get(conversationId);
      };
    };
  };

  public query ({ caller }) func getAllConversations(_userId : Principal) : async [Conversation] {
    switch (conversations.get(caller)) {
      case (null) { [] };
      case (?convoMap) {
        convoMap.values().toArray().sort();
      };
    };
  };

  public query ({ caller }) func getLastNConversations(_userId : Principal, n : Nat) : async [Conversation] {
    // Use only the top-level conversations map if no convoMap exists for the caller.
    switch (conversations.get(caller)) {
      case (null) { [] };
      case (?convoMap) {
        let totalSize = convoMap.size();
        let startIndex = if (totalSize > n) { totalSize - n } else { 0 };
        let convos = convoMap.values().toArray().sliceToArray(startIndex, totalSize).reverse();
        convos;
      };
    };
  };

  public func titleExists(_userId : Principal, title : Text) : async Bool {
    title == "Untitled";
  };

  public func renameConversation(_userId : Principal, from : Text, to : Text) : async () {
    if (from == "Untitled" and to == "Untitled") { return () };
    ();
  };

  public func clearErrorMessages(userId : Principal, conversationId : Text) : async () {
    switch (conversations.get(userId)) {
      case (null) {
        Runtime.trap("User does not exist. Can't clear error messages");
      };
      case (?convoMap) {
        switch (convoMap.get(conversationId)) {
          case (null) {
            Runtime.trap("Conversation does not exist. Can't clear error messages");
          };
          case (?conversation) {
            let retainedMessages = conversation.messages.filter(
              func(message) {
                message.requestType != #textRequest and message.requestType != #imageRequest and message.requestType != #videoRequest
              }
            );
            let updatedConversation = {
              conversation with
              messages = retainedMessages
            };
            convoMap.add(conversationId, updatedConversation);
          };
        };
      };
    };
  };
};
