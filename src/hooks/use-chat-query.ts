import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../axios-client";
import { Message, MessageBody } from "../services/types";

const api = {
  getMessages: (): Promise<{
    data: {
      data: Message[];
      has_more: boolean;
    };
  }> =>
    axiosClient.get("v1/message", {
      params: {
        thread_id: "thread_pxfPwS4fH0I6zWwlgM3nMqLS",
        limit: 100,
      },
    }),

  createMessage: (body: MessageBody) => axiosClient.post("v1/message", body),
};

const useMessage = () => {
  return useQuery({
    queryKey: ["message"],
    queryFn: api.getMessages,
    select: ({ data }) =>
      data.data
        .map((message) => {
          const { content, role, id } = message;
          return {
            id,
            message: content[0].text.value,
            sender: role === "assistant" ? "Chatbot" : "User",
            direction: role === "assistant" ? "incoming" : "outgoing",
          };
        })
        .reverse(),
  });
};

const useCreateMessage = () => {
  return useMutation({
    mutationFn: api.createMessage,
  });
};

export const chatQuery = {
  useMessage,
  mutation: {
    useCreateMessage,
  },
};
