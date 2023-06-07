import prisma from "@/app/libs/prismadb";
// lấy dữ liệu tin nhắn
const getMessages = async (
  conversationId: string
) => {
  // tìm tin nhắn trong 1 đoạn hội thoại thông qua conversationId
  // khi tìm đc đoạn nhắn sẽ bao gồm: người gửi và trạng thái seen
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
