import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
// Update người dùng
export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      name,
      image,
    } = body;
    // kiểm tra xem người dùng có tồn tại không
    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // cập nhật người dùng
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        image: image,
        name: name
      },
    });

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}