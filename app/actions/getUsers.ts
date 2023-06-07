import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
// lấy thông tin người dùng
const getUsers = async () => {
  const session = await getSession();
  // kiểm tra xem nếu ko có email của người dùng trong session => trả về mảng rỗng
  if (!session?.user?.email) {
    return [];
  }

  try {
    // tìm toàn bộ thông tin người dùng trong database
    // với điều kiện là có email khác với email người dùng chưa đăng nhập
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: session.user.email
        } 
      }
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
