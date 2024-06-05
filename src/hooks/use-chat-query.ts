import { useQuery } from "@tanstack/react-query";
import axiosClient from "../axios-client";

const api = {
  getMessages: () =>
    axiosClient.get("v1/message", {
      // params: {
      //   thread_id: "thread_UaiMYsqSHL5GnaFxkPDyNCA4",
      // },
    }),

  getThread: () =>
    axiosClient.get("v1/thread", {
      // params: {
      //   thread_id: "thread_UaiMYsqSHL5GnaFxkPDyNCA4",
      // },
    }),
};

const useMessage = () => {
  return useQuery({
    queryKey: ["message"],
    queryFn: api.getMessages,
  });
};

const useThread = () => {
  return useQuery({
    queryKey: ["thread"],
    queryFn: api.getThread,
  });
};

export const chatQuery = {
  useMessage,
  useThread,
};
