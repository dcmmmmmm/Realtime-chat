import Image from "next/image";
import AuthForm from "./components/AuthForm";
// Login / register page
const Auth = () => {
  return (
    /* div cha: 
     min-heigh: 100% <=> chiếm toàn bộ màn hình
     padding: 48px 0px
     flex: giao diện web chuyển sang flex 
     flex-direction: column => hiển thi theo trục tung
     justify-content: center => hiện thị các phân tử trong div cha ở center
     nếu thiết bị có min-width = 640 => padding: 0px 24px
     nếu thiết bị có min-width = 1024 => padding: px 32px
     background-color: gray-100
    */         
    <div 
      className=" 
        flex  
        min-h-full 
        flex-col 
        justify-center 
        py-12 
        sm:px-6 
        lg:px-8 
        bg-gray-100
      "
    >
      {/* responsive mobile: center, width:100%, max-with: 448px*/}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          height="48"
          width="48"
          className="mx-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
        {/* margin-top: 24px text-align:center font-size: 30px line-height: 36px font-weight: 700 text-color:gray*/}
        <h2 
          className="
            mt-6 
            text-center 
            text-3xl 
            font-bold 
            tracking-tight 
            text-gray-900
          "
          >
            Sign in to your account
        </h2>
      </div>
      <AuthForm />      
  </div>
  )
}

export default Auth;
