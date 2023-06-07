import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";
// goi du lieu nguoi dung khac len giao dien
const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);
    // loc doan thoi thoai ma nguoi dung trong doan hoi thoai khac nguoi dung hien tai
    return otherUser[0]; // lay thong tin cua 1 nguoi dung
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
