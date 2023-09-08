declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function GoogleAdSense({ adSlot }: { adSlot: string }) {
  //   if (typeof window !== 'undefined') {
  //     ; (window.adsbygoogle = window.adsbygoogle || []).push({})
  //   }

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5699676851939916" // Substitua pelo seu ID de editor
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      {process.env.NODE_ENV === 'production' && (
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({ });
        </script>
      )}
    </>
  )
}
