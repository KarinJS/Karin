import { SandboxContext } from '@/contexts/sandbox'
import { useContext } from 'react'

function useSandbox () {
  const sandbox = useContext(SandboxContext)
  if (!sandbox) {
    throw new Error('useSandbox must be used within a SandboxProvider')
  }
  return sandbox
}

export default useSandbox
