import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import Button from '@/components/common/Button'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [spaceName, setSpaceName] = useState('')
  const [spaceTime, setSpaceTime] = useState('')

  return (
    <div className='flex items-center justify-center h-[100vh]'>
      <div className='flex flex-col gap-4 rounded-lg bg-custom-3 border p-8'>
      <input type='text' className='text-xl font-bold text-center text-gray-800' onChange={(e) => setSpaceName(e.target.value)} />
      <input type='time' className='text-xl font-bold text-center text-gray-800' onChange={(e) => setSpaceTime(e.target.value)} />
      <Button type='submit' onClick={() => console.log(spaceName, spaceTime)}> Submit </Button>  
      </div>
    </div>
  )
}
