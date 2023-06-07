import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
// lấy thông tin conversation từ database
const getConversationById = async (
  conversationId: string
) => {
  try {
    // gán currentUser = user mình đang đăng nhập hiện tại
    const currentUser = await getCurrentUser();
    // nếu email của currentUser khác với email của user minh đang đăng nhập
    // trả về null
    if (!currentUser?.email) {
      return null;
    }
    // tìm thông tin đoạn hội thoai ở database
    // với điều kiện là id = conversationId
    // bao gồm toàn bộ thông tin người dùng như avt, tên, ...
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true,
      },
    });
    // trả về thông tin conversation
    return conversation;
  } catch (error: any) {
    console.log(error, 'SERVER_ERROR')
    return null;
  }
};

export default getConversationById;
