import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(
  request: Request,
) {
  try {
    // lấy thông tin của người dùng hiện tại
    const currentUser = await getCurrentUser();
    // gọi dữ liệu 
    const body = await request.json(); 
    // gán object cho phần tywr body
    const {
      userId,
      isGroup,
      members,
      name
    } = body;
    // kiểm tra id người dùng hoặc email người dùng hiện tại
    // nếu ko phải thì in ra thông báo => chưa đăng nhập
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 400 });
    }
    // kiểm tra xem đoạn hội thoại có phải là group hay ko
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    } 
    // Nếu là group
    if (isGroup) { 
      // tạo 1 group conversation trong database
      // bao gồm: tên, nhóm, nguời tham gia nhóm
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({  
                id: member.value 
              })),
              {
                id: currentUser.id
              }
            ]
          }
        },
        include: {
          users: true,
        }
      });

       // Update all connections with new conversation
      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }
    // kiểm tra đoạn hội thoại đã có trong database chưa
    // điều kiện : kiểm tra qua userIds của người dùng 
    const existingConversations = await prisma.conversation.findMany({ 
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    });
    //
    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }
    // tạo đoạn hội thoại mới trong database
    // trong đó connect giữa người dùng hiện tại và người dùng khác 
    const newConversation = await prisma.conversation.create({ // tao 1 doan hoi rieng giua 2 user ket noi vs nhau thong qua id
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      } 
    });

    // Update all connections with new conversation
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}