/* eslint-disable prettier/prettier */
import { useEffect } from 'react'

export function GoogleAdSense({ adSlot }: { adSlot: string }) {
  useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-5699676851939916" // Substitua pelo seu ID de editor
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  )
}
