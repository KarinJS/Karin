import { User } from '@/model/user.model'
import { useEffect, useState } from 'react'

const useUser = (uid: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [user, setUser] = useState<User>(new User(uid))
  const fetchUser = async () => {
    setLoading(true)
    try {
      const user = new User(uid)
      await user.refresh()
      setUser(user)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser().catch(error => {
      console.error(error)
    })
  }, [uid])

  return {
    loading,
    user,
    error,
  }
}

export default useUser
