import { getServerSession } from "next-auth";
// kiểm tra trạng thái người dùng
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function getSession() {
  return await getServerSession(authOptions);
}
