import React from 'react'
import ASCIIText from '@/components/ASCIIText'

const NotFoundPage: React.FC = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <ASCIIText
        text='404'
        enableWaves
        asciiFontSize={8}
      />
    </div>

  )
}

export default NotFoundPage
