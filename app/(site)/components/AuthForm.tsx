'use client';

import axios from "axios";
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle  } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

import Input from "@/app/components/inputs/Input";
import AuthSocialButton from './AuthSocialButton';
import Button from "@/app/components/Button";
import { toast } from "react-hot-toast";
// Form đăng nhập/đăng kí
type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  // useSesion: là 1 React hook trong thư viện next-auth là 1 trong những cách để kiểm tra xem người dùng đã đăng nhập hay chưa
  const session = useSession();
  // useRouter laf 1 hook cho phép bạn có thể thay đổi các route bên trong client components
  const router = useRouter();
  // useState là 1 react hook cho phép bạn thêm 1 state variable trong component
  const [variant, setVariant] = useState<Variant>('LOGIN');// tình trạng mặc định là LOGIN
  const [isLoading, setIsLoading] = useState(false);// mặc đình là false
  // là 1 react hook cho phép bạn đồng bộ hóa 1 component với hệ thống xét ở bên ngoài
  // có 3 trường hợp : 
  // useEffect(callback, [])
  // useEffect(callback)
  // useEffect(callback, [dependencies])
  useEffect(() => {
    //Nếu trạng thái của người dùng là authenticated
    //router sẽ xử lý và đưa bạn sang page của conversation
    // ở đây useEffect phụ thuộc vào 2 yếu tố là : trạng thái và router
    if (session?.status === 'authenticated') {
      router.push('/conversations')
    }
  }, [session?.status, router]);
  //useCallback là 1 react hook cho phép bạn tạo ra 1 hàm định nghĩa giữa việc re-rendering
  //tạo biến tooglevariant với useCallback
  //nếu variatn là login thì setVariant bằng register và ngược lại
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);
  //useForm: 1 một hook của thư viện react-hook-form để quản lý các form
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });
  //hàm submit để xử lý dữ liệu của người dùng khi submit data 
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    //Nếu variant là đăng kí
    //đưa dũ liệu của người dùng lên database 
    //sau đó ko đc để chuyển hưởng về trang sign in
    //sau đó nếu đăng nhập lỗi -> thông báo lỗi và ngược lại
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
      .then(() => signIn('credentials', {
        ...data,
        redirect: false,
      })) 
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
        }
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
    }
    // Nếu là LOGIN
    // duyệt data trong model user
    // và ko để bị chuyển hướng sang singih
    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,//duyet cac phan tu trong data
        redirect: false//mac dinh chuyen trang la false. Neu nhap dung thong tin thi redirect thanh true
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }
        // nếu status = ok => sang trang conversatións
        if (callback?.ok) {
          router.push('/conversations')
        }
      })
      .finally(() => setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations')
        }
      })
      .finally(() => setIsLoading(false));
  } 

  return ( 
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div 
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
        >
          {variant === 'REGISTER' && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name" 
              label="Name"
            />
          )}
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="email" 
            label="Email address" 
            type="email"
          />
          <Input 
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password" 
            label="Password" 
            type="password"
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div 
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton 
              icon={BsGithub} 
              onClick={() => socialAction('github')} 
            />
            <AuthSocialButton 
              icon={BsGoogle} 
              onClick={() => socialAction('google')} 
            />
          </div>
        </div>
        <div 
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'} 
          </div>
          <div 
            onClick={toggleVariant} 
            className="underline cursor-pointer"
          >
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default AuthForm;
