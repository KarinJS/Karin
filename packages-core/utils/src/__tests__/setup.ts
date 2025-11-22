import { vi } from 'vitest'
vi.spyOn(process, 'cwd').mockReturnValue(process.cwd())
