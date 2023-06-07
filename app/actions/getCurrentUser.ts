import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
// láy dữ liệu người dùng đã đăng nhập
const getCurrentUser = async () => {
  try {
    const session = await getSession();
    // nếu người email người dùng ko có trong databse
    // trả về null
    if (!session?.user?.email) {
      return null;
    }
    // tìm kiếm người dùng hiện tại trong database
    // với điều kiện là email = email người dùng đã đăng nhập
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
