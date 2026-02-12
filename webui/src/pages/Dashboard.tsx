import { useState, useEffect } from 'react'
import { Link, Button } from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Settings, Box, Zap, Github, BookOpen, ArrowRight, Sparkles, Copyright } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

interface Hitokoto {
  id: number
  hitokoto: string
  from: string
  from_who: string | null
  creator: string
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number], // Cubic bezier for smooth entry
    }
  })
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5 + (i * 0.15),
      duration: 1.0,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    }
  }),
  hover: {
    y: -8,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const
    }
  }
}

export function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [hitokoto, setHitokoto] = useState<Hitokoto | null>(null)
  
  useEffect(() => {
    const fetchHitokoto = async () => {
      try {
        const res = await fetch('https://v1.hitokoto.cn/?c=i')
        const data = await res.json()
        setHitokoto(data)
      } catch (e) {
        console.error('Failed to fetch hitokoto', e)
        setHitokoto({
          id: 0,
          hitokoto: "Life is what happens when you're busy making other plans.",
          from: "John Lennon",
          from_who: null,
          creator: "System"
        })
      }
    }
    fetchHitokoto()
  }, [])

  const guideCards = [
    {
      title: t('dashboard.guide.basicConfig.title'),
      id: "01",
      description: t('dashboard.guide.basicConfig.desc'),
      icon: Settings,
      path: '/basic-config',
      accent: "bg-blue-500",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50/50 dark:bg-blue-900/10",
      shadowColor: "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20"
    },
    {
      title: t('dashboard.guide.plugins.title'),
      id: "02",
      description: t('dashboard.guide.plugins.desc'),
      icon: Box,
      path: '/plugins',
      accent: "bg-purple-500",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50/50 dark:bg-purple-900/10",
      shadowColor: "hover:shadow-purple-200/50 dark:hover:shadow-purple-900/20"
    },
    {
      title: t('dashboard.guide.schemaDemo.title'),
      id: "03",
      description: t('dashboard.guide.schemaDemo.desc'),
      icon: Zap,
      path: '/schema-demo',
      accent: "bg-amber-500",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50/50 dark:bg-amber-900/10",
      shadowColor: "hover:shadow-amber-200/50 dark:hover:shadow-amber-900/20"
    }
  ]

  const links = [
    { label: "Docs", url: 'https://github.com/KarinJS/Karin', icon: BookOpen },
    { label: "Github", url: 'https://github.com/KarinJS/Karin', icon: Github }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <div className="h-full w-full bg-[#fcfcfc] dark:bg-[#09090b] overflow-y-auto overflow-x-hidden relative font-sans selection:bg-rose-500/20 scrollbar-hide">
      
      {/* Ambient Background with subtle pulse animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <motion.div 
           animate={{ 
             scale: [1, 1.1, 1],
             opacity: [0.5, 0.3, 0.5]
           }}
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-blue-500/5 rounded-full blur-[100px]" 
         />
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.5, 0.3]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute bottom-[-10%] left-[-5%] w-125 h-125 bg-rose-500/5 rounded-full blur-[100px]" 
         />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12 md:py-20 flex flex-col gap-12 min-h-[calc(100vh-4rem)]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-8 max-w-3xl">
            {/* Badge */}
            <motion.div 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={variants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
            >
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               >
                 <Sparkles size={12} className="text-amber-500 fill-amber-500" />
               </motion.div>
               <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 tracking-wider uppercase font-serif-sc">System Preview 0.0.1</span>
            </motion.div>

            {/* Title Block */}
            <div className="relative">
              <motion.h1 
                custom={1}
                initial="hidden"
                animate="visible"
                variants={variants}
                className="text-6xl md:text-8xl text-slate-900 dark:text-slate-100 font-calligraphy leading-tight -ml-1 select-none"
              >
                {t('dashboard.welcome')}
              </motion.h1>
              <motion.p 
                custom={2}
                initial="hidden"
                animate="visible"
                variants={variants}
                className="mt-4 text-xl md:text-2xl text-slate-600 dark:text-zinc-400 font-serif-sc font-light tracking-wide opacity-90 max-w-2xl"
              >
                {t('dashboard.description')}
              </motion.p>
            </div>
            
            {/* Quick Links */}
            <motion.div 
              custom={3}
              initial="hidden"
              animate="visible"
              variants={variants}
              className="flex flex-wrap gap-4 pt-4"
            >
              {links.map((link, i) => (
                <Button
                  key={i}
                  as={Link}
                  href={link.url}
                  isExternal
                  variant="bordered"
                  className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 font-medium px-6 h-10 hover:bg-white dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 active:scale-95 transition-all shadow-sm group"
                  startContent={<link.icon size={16} className="text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors" />}
                >
                  {link.label}
                </Button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Separator - Animated Draw */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          className="w-full h-px bg-linear-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent origin-left" 
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 content-center">
          <AnimatePresence>
          {guideCards.map((card, index) => (
             <motion.div 
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              onClick={() => navigate(card.path)}
              className="group relative cursor-pointer"
            >
              <div className="relative h-full flex flex-col p-8 rounded-[22px] bg-white dark:bg-[#0c0c0e] border border-slate-100 dark:border-zinc-800/50 transition-colors duration-500 overflow-hidden shadow-sm hover:shadow-2xl dark:shadow-none hover:border-slate-200 dark:hover:border-zinc-700"
              >
                {/* Internal Glow Effect on Hover */}
                <div className={clsx(
                  "absolute -right-20 -top-20 w-60 h-60 rounded-full blur-[80px] opacity-0 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none",
                  card.accent
                )} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                     <motion.div 
                       whileHover={{ scale: 1.1, rotate: 5 }}
                       transition={{ type: "spring", stiffness: 400, damping: 10 }}
                       className={clsx(
                         "p-4 rounded-2xl transition-colors duration-300",
                         card.bgColor,
                         card.iconColor
                       )}
                     >
                       <card.icon size={28} strokeWidth={1.5} />
                     </motion.div>
                     <span className="font-serif-sc text-sm text-slate-300 dark:text-zinc-700 select-none">0{index + 1}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-light grow">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-zinc-800/50 group-hover:border-slate-100 dark:group-hover:border-zinc-700/50 transition-colors">
                    <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors">Action</span>
                    <motion.div 
                      className={clsx("text-slate-300 dark:text-zinc-600", card.iconColor)}
                      variants={{
                        hover: { x: 5, color: "var(--token-color-foreground)" } 
                      }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="pt-8 border-t border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto"
        >
           <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-500">
               <Copyright size={12} />
               <span>{currentYear} Karin Project. All rights reserved.</span>
             </div>
             <div className="flex gap-3 text-[10px] text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
               <span>MIT License</span>
               <span>•</span>
               <span>Open Source</span>
             </div>
           </div>

           {hitokoto && (
             <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 dark:text-zinc-500 font-serif-sc group cursor-default">
               <span className="italic opacity-80 group-hover:opacity-100 transition-opacity">“{hitokoto.hitokoto}”</span>
               <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
               <span className="opacity-60 group-hover:opacity-100 transition-opacity">{hitokoto.from_who || hitokoto.creator}</span>
             </div>
           )}
        </motion.div>

      </div>
    </div>
  )
}
