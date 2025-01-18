import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { title } from '@/components/primitives'
import { Image } from '@heroui/image'
import { request } from '@/lib/request'
import { useLocalStorageState } from 'ahooks'
import key from '@/consts/key.ts'
import { Controller, useForm } from 'react-hook-form'
import { loginSchema } from '@/schema/user'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Form } from '@/components/form'
import { useNavigate } from 'react-router-dom'
export default function LoginPage() {
  const navigate = useNavigate()
  const [_, setToken] = useLocalStorageState<string>(key.token, {
    defaultValue: '',
  })
  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      token: '',
    },
    resolver: zodResolver(loginSchema),
  })
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setToken(data.token)
    try {
      await request.post('/api/v1/login')
      toast.success('登录成功')
      navigate('/')
    } catch (error) {
      const err = error as Error
      toast.error(`登录失败: ${err.message}`)
    }
  }
  return (
    <div className="w-full h-screen flex justify-center items-center pt-0">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="flex flex-col items-center">
            <h1
              className={title({
                color: 'violet',
                size: 'sm',
              })}
            >
              KarinJS WebUI Login
            </h1>
            <Image src="/web/karin.png" className="w-32" alt="logo" />
          </div>
          <div className="mt-5">
            <Form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full items-stretch gap-4"
              errors={form.formState.errors}
            >
              <Controller
                render={({ field }) => <Input type="password" label="密码" {...field} />}
                name="token"
                control={form.control}
              />

              <Button type="submit" size="lg" color="primary" variant="shadow">
                登录
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
