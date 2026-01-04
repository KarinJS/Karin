import { useMemo } from 'react'
import {
  Globe, Wifi, Film, HelpCircle, Eye, EyeOff,
  Settings, User, Lock, Mail, Phone, Calendar,
  Clock, Search, Plus, Minus, Trash, Edit,
  Check, X, AlertCircle, Info, AlertTriangle,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Folder, File, Database, Server, Cpu, Terminal,
  Code, GitBranch, Package, Layers, List, Grid,
  type LucideIcon
} from 'lucide-react'
import type { IconName } from './types'

const iconMap: Record<IconName, LucideIcon> = {
  'globe': Globe,
  'wifi': Wifi,
  'film': Film,
  'help-circle': HelpCircle,
  'eye': Eye,
  'eye-off': EyeOff,
  'settings': Settings,
  'user': User,
  'lock': Lock,
  'mail': Mail,
  'phone': Phone,
  'calendar': Calendar,
  'clock': Clock,
  'search': Search,
  'plus': Plus,
  'minus': Minus,
  'trash': Trash,
  'edit': Edit,
  'check': Check,
  'x': X,
  'alert-circle': AlertCircle,
  'info': Info,
  'alert-triangle': AlertTriangle,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'folder': Folder,
  'file': File,
  'database': Database,
  'server': Server,
  'cpu': Cpu,
  'terminal': Terminal,
  'code': Code,
  'git-branch': GitBranch,
  'package': Package,
  'layers': Layers,
  'list': List,
  'grid': Grid,
}

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export function Icon ({ name, size = 20, className }: IconProps) {
  const IconComponent = useMemo(() => iconMap[name], [name])

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return <IconComponent size={size} className={className} />
}

export function GetIconComponent (name: IconName): LucideIcon | undefined {
  return iconMap[name]
}
