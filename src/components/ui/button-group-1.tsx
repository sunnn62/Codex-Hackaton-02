"use client"

import { FiPlus } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

type ButtonGroup1Props = {
  readonly actionLabel: string
  readonly countLabel: string
  readonly onClick: () => void
}

const ButtonGroup1 = ({ actionLabel, countLabel, onClick }: ButtonGroup1Props) => {
  return (
    <div className='inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse'>
      <Button
        type='button'
        onClick={onClick}
        variant='outline'
        className='h-12 gap-2 rounded-none rounded-l-full border-[#0a1b33] bg-[#0a1b33] px-4 text-white shadow-none hover:bg-[#19345e] hover:text-white focus-visible:z-10'
      >
        <FiPlus className='size-4' />
        {actionLabel}
      </Button>
      <span className='flex h-12 items-center rounded-r-full border border-[#0a1b33] bg-white px-3 text-xs font-semibold text-[#526071]'>
        {countLabel}
      </span>
    </div>
  )
}

export default ButtonGroup1
