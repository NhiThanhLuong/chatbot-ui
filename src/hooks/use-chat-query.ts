import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../axios-client";
import { Message, MessageBody } from "../services/types";

const api = {
  createAssistant: (body: {
    user_id: string;
  }): Promise<{
    run_id: string;
    user_id: string;
  }> =>
    axiosClient.post("assistants/create", {
      ...body,
      assistant: "RAG_PDF",
    }),

  getMessages: (
    body: Partial<{ run_id: string | null; user_id: string | null }>
  ): Promise<Message[]> =>
    axiosClient.post("assistants/history", {
      ...body,
      assistant: "RAG_PDF",
    }),

  createMessage: (body: MessageBody) =>
    axiosClient.post("assistants/chat", {
      ...body,
      stream: true,
      assistant: "RAG_PDF",
    }),
};

const useMessage = (
  body: Partial<{ run_id: string | null; user_id: string | null }>
) => {
  return useQuery({
    queryKey: ["message", body],
    queryFn: () => api.getMessages(body),
    enabled: !!body.run_id && !!body.user_id,
    select(data) {
      return data.map((message) => {
        const { content, role } = message;

        return {
          message: content,
          sender: role === "assistant" ? "Chatbot" : "User",
          direction: role === "assistant" ? "incoming" : "outgoing",
        };
      });
    },
  });
};

const useCreateMessage = () => {
  return useMutation({
    mutationFn: api.createMessage,
  });
};

const useCreateAssistant = () => {
  return useMutation({
    mutationFn: api.createAssistant,
  });
};

export const chatQuery = {
  useMessage,
  mutation: {
    useCreateMessage,
    useCreateAssistant,
  },
};
