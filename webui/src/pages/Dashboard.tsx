import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Settings, Box, Zap, Github, BookOpen, ArrowRight, Activity, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'

interface Hitokoto {
  id: number
  hitokoto: string
  from: string
  from_who: string | null
  creator: string
}

export function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [hitokoto, setHitokoto] = useState<Hitokoto | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    
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
    return () => clearTimeout(timer)
  }, [])

  const guideCards = [
    {
      title: t('dashboard.guide.basicConfig.title'),
      id: "01",
      description: t('dashboard.guide.basicConfig.desc'),
      icon: Settings,
      path: '/basic-config',
      // Styles for the "Cinematic" look
      accent: "bg-blue-500",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: t('dashboard.guide.plugins.title'),
      id: "02",
      description: t('dashboard.guide.plugins.desc'),
      icon: Box,
      path: '/plugins',
      accent: "bg-purple-500",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: t('dashboard.guide.schemaDemo.title'),
      id: "03",
      description: t('dashboard.guide.schemaDemo.desc'),
      icon: Zap,
      path: '/schema-demo',
      accent: "bg-amber-500",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    }
  ]

  const links = [
    { label: "Docs", url: 'https://github.com/KarinJS/Karin', icon: BookOpen },
    { label: "Github", url: 'https://github.com/KarinJS/Karin', icon: Github }
  ]

  return (
    <div className="h-full w-full bg-[#fcfcfc] dark:bg-[#09090b] overflow-y-auto overflow-x-hidden relative font-sans selection:bg-rose-500/20 scrollbar-hide">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@300;500;700&display=swap');
        .font-calligraphy { font-family: 'Ma Shan Zheng', cursive; }
        .font-serif-sc { font-family: 'Noto Serif SC', serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-blue-500/5 rounded-full blur-[100px] opacity-70" />
         <div className="absolute bottom-[-10%] left-[-5%] w-125 h-125 bg-rose-500/5 rounded-full blur-[100px] opacity-70" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12 md:py-20 flex flex-col gap-12 min-h-[calc(100vh-4rem)]">
        
        {/* Header Section */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-8 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="space-y-8 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm">
               <Sparkles size={12} className="text-amber-500 fill-amber-500" />
               <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 tracking-wider uppercase font-serif-sc">System Preview 0.0.1</span>
            </div>

            {/* Title Block */}
            <div className="relative">
              {/* Decorative ink splash behind title (optional, css only) */}
              <h1 className="text-6xl md:text-8xl text-slate-900 dark:text-slate-100 font-calligraphy leading-tight -ml-1">
                {t('dashboard.welcome')}
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-slate-600 dark:text-zinc-400 font-serif-sc font-light tracking-wide opacity-90 max-w-2xl">
                {t('dashboard.description')}
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {links.map((link, i) => (
                <a 
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest"
                >
                  <span className="w-6 h-px bg-slate-300 dark:bg-zinc-700 group-hover:bg-slate-900 dark:group-hover:bg-zinc-200 transition-colors" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separator - Fade line */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent" />

        {/* Cards Grid - The "Cinematic" Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guideCards.map((card, index) => (
             <div 
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(card.path)}
            >
              {/* Gradient Border Effect */}
              <div 
                className={clsx(
                  "absolute -inset-px rounded-3xl bg-linear-to-b from-slate-200 to-transparent dark:from-zinc-700 dark:to-transparent opacity-0 transition-opacity duration-500",
                  hoveredCard === index && "opacity-100"
                )} 
              />
              
              <div 
                className={`relative h-full flex flex-col p-8 rounded-[22px] bg-white dark:bg-[#0c0c0e] border border-slate-100 dark:border-zinc-800/50 transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                
                {/* Decoration blob inside card */}
                <div className={clsx(
                  "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700",
                  card.accent
                )} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                     <div className={clsx(
                       "p-4 rounded-2xl transition-colors duration-300",
                       card.bgColor,
                       card.iconColor
                     )}>
                       <card.icon size={28} strokeWidth={1.5} />
                     </div>
                     <span className="font-serif-sc text-sm text-slate-300 dark:text-zinc-700 select-none">0{index + 1}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-light grow">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-zinc-800/50 group-hover:border-slate-100 dark:group-hover:border-zinc-700/50 transition-colors">
                    <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Aciton</span>
                    <div className={clsx(
                      "transition-all duration-300 transform translate-x-0 opacity-50 group-hover:translate-x-1 group-hover:opacity-100",
                      card.iconColor
                    )}>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
           <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <Activity size={16} />
             <span className="text-xs font-mono font-medium">Karin Project</span>
           </div>

           {hitokoto && (
             <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 dark:text-zinc-500 font-serif-sc">
               <span className="italic">“{hitokoto.hitokoto}”</span>
               <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
               <span className="opacity-70">{hitokoto.from_who || hitokoto.creator}</span>
             </div>
           )}
        </div>

      </div>
    </div>
  )
}
