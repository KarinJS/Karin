import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button, Card, CardBody, Avatar } from "@heroui/react"
import { Download, CheckCircle2, ChevronRight, Check } from 'lucide-react'
import type { Plugin } from '../../types/plugin'
import { stringToColor } from './utils'

interface PluginCardProps {
  plugin: Plugin
  index?: number
  onCardClick: (plugin: Plugin) => void
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95 
  },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
      mass: 0.8,
      delay: i * 0.06
    }
  }),
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 } 
  },
  hover: {
    y: -6,
    scale: 1.01,
    transition: { 
      type: "spring" as const, 
      stiffness: 400, 
      damping: 25 
    }
  },
  tap: { 
    scale: 0.97,
    transition: { duration: 0.1 }
  }
}

export const PluginCard = ({ plugin, index = 0, onCardClick }: PluginCardProps) => {
  const { t } = useTranslation()
  const primaryColor = stringToColor(plugin.name)

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      layout
      className="group h-full"
    >
      <Card 
        isPressable
        onPress={() => onCardClick(plugin)}
        className="h-full w-full border border-slate-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-sm transition-colors duration-300 overflow-hidden backdrop-blur-sm"
        style={{
          // @ts-expect-error custom property
          '--card-primary': primaryColor.color,
          '--card-primary-bg': `hsla(${primaryColor.raw.h}, ${primaryColor.raw.s}%, 95%, 1)`,
        }}
      >
        {/* Modern Hover Glow Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 100%) var(--mouse-y, 0), ${primaryColor.color}10, transparent 40%)`
          }}
        />

        {/* Subtle top border highlight on hover */}
        <div 
          className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-left scale-x-0 group-hover:scale-x-100"
          style={{ backgroundColor: primaryColor.color }}
        />

        <CardBody className="p-5 flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <Avatar 
                  src={plugin.icon || plugin.authors.avatarUrl}
                  name={plugin.name.charAt(0)}
                  className="w-11 h-11 text-base font-bold shadow-sm transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `var(--card-primary-bg)`,
                    color: primaryColor.color
                  }}
                />
                {plugin.installed && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5 shadow-sm border-2 border-white dark:border-zinc-900"
                  >
                    <CheckCircle2 size={12} className="text-emerald-500" fill="currentColor" fillOpacity={0.2} />
                  </motion.div>
                )}
              </div>
              <div className="min-w-0 flex flex-col pt-0.5">
                <h3 
                  className="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-tight truncate transition-colors group-hover:text-(--card-primary)"
                >
                  {plugin.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-400 font-medium">
                    {plugin.authors.name || t('plugins.unknown_author', 'Unknown')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="shrink-0">
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100/50 dark:bg-zinc-800/50 text-slate-500 border border-slate-200/50 dark:border-zinc-700/50 backdrop-blur-md">
                v{plugin.version}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-12 mb-4">
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
              {plugin.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 mr-4">
              {plugin.tags?.slice(0, 3).map(tag => {
                const colors = stringToColor(tag)
                return (
                  <span 
                    key={tag} 
                    className="text-[11px] font-medium px-2 py-1 rounded-md transition-colors leading-none border bg-opacity-50"
                    style={{
                      backgroundColor: `${colors.bg}50`,
                      color: colors.color,
                      borderColor: `${colors.border}40`
                    }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>

            {/* Action Area */}
            <div className="shrink-0 flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {!plugin.installed ? (
                  <Button 
                    isIconOnly
                    radius="full"
                    size="sm" 
                    color="primary"
                    variant="flat"
                    title={t('plugins.install', '安装')}
                  >
                    <Download size={16} strokeWidth={2.5} />
                  </Button>
                ) : (
                  <Button 
                    isIconOnly
                    radius="full"
                    size="sm"
                    color="success"
                    variant="flat"
                    className="cursor-default"
                    title={t('plugins.tabs.installed', '已安装')}
                  >
                    <Check size={16} />
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
          
          {/* Touch Ripple / Hover Indicator */}
          <div className="absolute right-3 top-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-(--card-primary)">
             <ChevronRight size={16} />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}
