export type Message = {
  // id: string;

  role: "assistant" | "user";
  content: string;
};

export type MessageBody = {
  message: string;
  run_id: string;
  user_id: string;
};
