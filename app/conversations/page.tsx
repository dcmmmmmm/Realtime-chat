'use client';
// giao dien doan hoi thoai
import clsx from "clsx";

import useConversation from "../hooks/useConversation";
import EmptyState from "../components/EmptyState";

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <div className={clsx(
      'lg:pl-80 h-full lg:block', 
      isOpen ? 'block' : 'hidden' // neu click vao icon thi hien thi giao dien khong thi an
    )}>
      <EmptyState />
    </div>
  )
}

export default Home;
