export type Message = {
  id: string;
  object: string;
  created_at: number;
  assistant_id: string;
  thread_id: string;
  run_id: string;
  role: "assistant" | "user";
  content: [
    {
      type: string;
      text: {
        value: string;
        annotations: [];
      };
    }
  ];
  //   attachments: null;
  //   metadata: {};
};

export type MessageBody = {
  thread_id: string;
  role: "user";
  content: string;
  assistant_id: string;
};
