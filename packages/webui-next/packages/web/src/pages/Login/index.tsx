import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Checkbox, InputGroup, Label, Tabs, TextField } from '@heroui/react'
import { gsap } from 'gsap'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiGlobe, FiLock, FiLogIn, FiMapPin, FiMoon, FiSun } from 'react-icons/fi'
import requestClient from '@/api/request'

type ProtocolType = 'http' | 'https'

const resolveInitialProtocol = (): ProtocolType => {
  if (typeof window === 'undefined') {
    return 'http'
  }
  return window.location.protocol === 'https:' ? 'https' : 'http'
}

const resolveInitialHostname = (): string => {
  if (typeof window === 'undefined') {
    return 'localhost'
  }
  return window.location.hostname || 'localhost'
}

const resolveInitialPort = (): string => {
  if (typeof window === 'undefined') {
    return '80'
  }
  if (window.location.port) {
    return window.location.port
  }
  return window.location.protocol === 'https:' ? '443' : '80'
}

const resolveDefaultPortByProtocol = (protocol: ProtocolType): string => {
  return protocol === 'https' ? '443' : '80'
}

const Login = () => {
  const navigate = useNavigate()
  const { toggleTheme, isDark } = useTheme()
  const [protocol, setProtocol] = useState<ProtocolType>(resolveInitialProtocol)
  const [hostname, setHostname] = useState<string>(resolveInitialHostname)
  const [portValue, setPortValue] = useState<string>(resolveInitialPort)
  const [keyValue, setKeyValue] = useState<string>('')
  const [isKeyVisible, setIsKeyVisible] = useState<boolean>(false)
  const [enableCustomServer, setEnableCustomServer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const customServerRef = useRef<HTMLDivElement | null>(null)
  const trimmedPortValue = useMemo<string>(() => {
    return portValue.trim()
  }, [portValue])

  useEffect(() => {
    if (!customServerRef.current) {
      return
    }
    gsap.killTweensOf(customServerRef.current)
    if (enableCustomServer) {
      const targetHeight = customServerRef.current.scrollHeight
      gsap.set(customServerRef.current, { display: 'block' })
      gsap.fromTo(customServerRef.current, { opacity: 0, y: -10, height: 0 }, {
        opacity: 1,
        y: 0,
        height: targetHeight,
        duration: 0.28,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(customServerRef.current, { height: 'auto' })
        }
      })
      return
    }
    gsap.to(customServerRef.current, {
      opacity: 0,
      y: -10,
      height: 0,
      duration: 0.22,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(customServerRef.current, { display: 'none' })
      }
    })
  }, [enableCustomServer])

  const handleLogin = async () => {
    if (!keyValue.trim()) {
      alert('请输入 HTTP 鉴权秘钥')
      return
    }

    setIsLoading(true)
    try {
      const response = await requestClient.post('/login', {
        key: keyValue
      })

      if (response.code === 0 && response.data?.token) {
        // 保存 token
        localStorage.setItem('token', response.data.token)
        // 跳转到仪表盘
        navigate('/dashboard')
      } else {
        alert(response.message || '登录失败，请检查鉴权秘钥')
      }
    } catch (error) {
      console.error('登录错误:', error)
      alert('登录失败，请检查服务器连接')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <main className="relative z-10 min-h-screen px-6 py-10 flex items-center justify-center">
        <Card className="relative w-full max-w-135 rounded-3xl border border-border bg-surface shadow-[0_24px_72px_rgba(10,20,40,0.10)]">
          <Card.Content className="p-8 md:p-9 space-y-6">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              aria-label={isDark ? '切换浅色模式' : '切换深色模式'}
              className="absolute right-5 top-5 rounded-full text-default-500"
              onPress={toggleTheme}
            >
              {isDark ? <FiSun className="size-4" /> : <FiMoon className="size-4" />}
            </Button>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Karin WebUI 登录</h1>
              <p className="text-default-500 text-base leading-7">输入 HTTP 鉴权秘钥即可登录。秘钥来自 Karin 后端的 HTTP_AUTH_KEY 环境变量。</p>
            </div>

            <div ref={customServerRef} className="hidden opacity-0 h-0 overflow-hidden">
              <div className="space-y-2.5 pb-1">
                <p className="text-xs uppercase tracking-[0.16em] font-bold text-default-500">协议</p>
                <Tabs
                  selectedKey={protocol}
                  onSelectionChange={(key) => {
                    const nextProtocol: ProtocolType = key === 'https' ? 'https' : 'http'
                    const previousDefaultPort = resolveDefaultPortByProtocol(protocol)
                    const nextDefaultPort = resolveDefaultPortByProtocol(nextProtocol)
                    setProtocol(nextProtocol)
                    if (!trimmedPortValue || trimmedPortValue === previousDefaultPort) {
                      setPortValue(nextDefaultPort)
                    }
                  }}
                >
                  <Tabs.ListContainer>
                    <Tabs.List aria-label="协议选择" className=" *:font-semibold">
                      <Tabs.Tab id="http" className="justify-center">
                        HTTP
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="https" className="justify-center">
                        HTTPS
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-1 pt-3">
                <TextField className="w-full" name="address">
                  <Label className="text-[11px] uppercase tracking-[0.14em] font-bold text-default-500">地址</Label>
                  <InputGroup variant="secondary" className="w-full h-13">
                    <InputGroup.Prefix>
                      <FiMapPin className="size-4 text-default-400" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      value={hostname}
                      onChange={(event) => setHostname(event.target.value)}
                      placeholder="例如：localhost"
                      type="text"
                      className="text-base"
                    />
                  </InputGroup>
                </TextField>
                <TextField className="w-full" name="port">
                  <Label className="text-[11px] uppercase tracking-[0.14em] font-bold text-default-500">端口</Label>
                  <InputGroup variant="secondary" className="w-full h-13">
                    <InputGroup.Prefix>
                      <FiGlobe className="size-4 text-default-400" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      value={portValue}
                      onChange={(event) => setPortValue(event.target.value)}
                      type="number"
                      min={1}
                      max={65535}
                      placeholder={resolveDefaultPortByProtocol(protocol)}
                      className="text-base"
                    />
                  </InputGroup>
                </TextField>
              </div>
            </div>

            <div className="space-y-1.5">
              <TextField className="w-full" name="key">
                <Label className="text-[11px] tracking-[0.14em] uppercase font-bold text-default-500">HTTP 鉴权秘钥</Label>
                <InputGroup variant="secondary" className="w-full h-13">
                  <InputGroup.Prefix>
                    <FiLock className="size-4 text-default-400" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    value={keyValue}
                    onChange={(event) => setKeyValue(event.target.value)}
                    onKeyPress={handleKeyPress}
                    type={isKeyVisible ? 'text' : 'password'}
                    placeholder="输入 HTTP_AUTH_KEY"
                    className="text-base"
                    disabled={isLoading}
                  />
                  <InputGroup.Suffix className="pr-0">
                    <Button
                      isIconOnly
                      aria-label={isKeyVisible ? '隐藏秘钥' : '显示秘钥'}
                      size="sm"
                      variant="ghost"
                      onPress={() => setIsKeyVisible((previousVisible) => !previousVisible)}
                      disabled={isLoading}
                    >
                      {isKeyVisible ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                    </Button>
                  </InputGroup.Suffix>
                </InputGroup>
              </TextField>
              <div className="flex items-center justify-between">
                <Checkbox className='text-muted' isSelected={enableCustomServer} onChange={setEnableCustomServer} disabled={isLoading}>
                  自定义服务器
                </Checkbox>
                <Button variant="ghost" size="sm" className="h-auto px-0 text-muted font-normal" disabled={isLoading}>
                  需要帮助？
                </Button>
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full h-12 rounded-full text-base font-bold gap-2"
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <FiLogIn size={16} />
              即刻开始
            </Button>
          </Card.Content>
        </Card>
      </main>
    </div>
  )
}

export default Login
