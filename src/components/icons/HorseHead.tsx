import Image from 'next/image'

export function HorseHead({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src="/horse-logo.png"
        alt="My Stables Logo"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  )
}
