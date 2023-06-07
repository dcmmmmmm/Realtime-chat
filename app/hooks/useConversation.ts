//hooks de goi api conversation
//useMemo: la 1 React hooks cho phep ban lưu lại kết quả của hàm  và những giá trị nào sẽ làm thay đổi kết quả đó.
//useParams: là 1 client component hook cho phép đọc 1 dynamic route trong URL hiện tại
import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }

    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(() => ({
    isOpen,
    conversationId
  }), [isOpen, conversationId]);
};

export default useConversation;
