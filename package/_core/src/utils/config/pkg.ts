import { karinDir } from '@/root'
import { requireFileSync } from '../fs/require'
import type { Package } from '@/types/config'

/** node-karin的package.json */
export const pkg = () => requireFileSync<Package>(`${karinDir}/package.json`)
