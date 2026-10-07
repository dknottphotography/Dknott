import React, { useEffect } from 'react';
import { cloudinaryUrl, handleImageError } from '../lib/cloudinary';
import { commonImages, weddingGalleries } from '../data/images';
import { useSanityDoc } from '../lib/useSanityDoc';
import { sanityImg } from '../lib/sanityContent';

export default function Index() {
  const { data: settings } = useSanityDoc('siteSettings');
  const { data: pageData } = useSanityDoc('linkTreePage');
  useEffect(() => {
    if (window.__IndexScriptLoaded) return;
    window.__IndexScriptLoaded = true;

    
        setTimeout(() => {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const headerDivs = document.querySelectorAll('header > div');
            
            headerDivs.forEach(div => {
                div.addEventListener('click', () => {
                    const bg = div.style.backgroundImage;
                    if (!bg || bg === 'none') return;
                    
                    // Extract URL from 'url("...")' or 'url(...)'
                    const url = bg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                    
                    if(url) {
                        modalImg.src = url;
                        modal.classList.remove('hidden');
                        modal.classList.add('flex');
                        // Small timeout to allow CSS transition to trigger
                        setTimeout(() => modalImg.classList.replace('scale-95', 'scale-100'), 10);
                    }
                });
            });

            // Close modal when clicking anywhere on it
            modal.addEventListener('click', () => {
                modalImg.classList.replace('scale-100', 'scale-95');
                // Wait for scale transition before hiding
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }, 200);
            });
        });
    

  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `` }} />
      <div className="bg-brand-bg font-sans text-brand-title text-center overflow-x-hidden m-0 p-0 min-h-screen">


    <header className="flex w-screen h-[25vh] md:h-[45vh] overflow-hidden">
        {(pageData?.stripImages?.length ? pageData.stripImages.map((img, i) => sanityImg(img) || '') : ['gallery_1.jpg', commonImages.instagram[0], commonImages.instagram[3], commonImages.instagram[1], commonImages.instagram[4], commonImages.instagram[2], 'gallery_7.jpg', 'gallery_8.jpg'].map((k) => cloudinaryUrl(k))).map((url, i, arr) => (
          <div key={i} className={`flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder bg-cover bg-center${i < arr.length - 1 ? ' border-r-[2px] md:border-r-[6px] border-white' : ''}`} style={{"backgroundImage": `url(${url})`}}></div>
        ))}
    </header>

    <div className="relative z-10 flex justify-center -mt-[60px] md:-mt-[80px]">
        <img src={sanityImg(settings?.logo) || cloudinaryUrl(commonImages.logos.large)} onError={handleImageError} alt="D Knott Photography" className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full object-cover border-[3px] border-white bg-brand-logo shadow-md hover:scale-105 transition-transform duration-300" />
    </div>

    <main className="px-5 pt-6 pb-12 max-w-[600px] mx-auto">
        <h1 className="font-serif font-normal text-[1.5rem] md:text-[1.8rem] text-brand-title tracking-[2px] mb-3">{`${settings?.title || 'DKNOTT'} ${settings?.description || 'PHOTOGRAPHY'}`.toUpperCase()}</h1>
        <p className="text-[0.65rem] tracking-[2px] leading-relaxed mb-11 font-medium text-brand-subtitle uppercase">{pageData?.tagline || 'DOCUMENTARY WEDDING PHOTOGRAPHY & FILMS. 350+ WEDDINGS ACROSS INDIA & ABROAD.'}</p>

        <div className="flex flex-col gap-4 items-center">
            {(pageData?.links?.length ? pageData.links : [
              {label: 'ABOUT US', href: '/about'},
              {label: 'DKNOTT UNIVERSE', href: '/universe'},
              {label: 'WEDDING FILMS', href: '/wedding_films'},
              {label: 'WEDDING BLOGS', href: '/real_weddings'},
              {label: 'WEBSITE', href: '/home'},
              {label: 'INSTAGRAM', href: settings?.instagramUrl || 'https://www.instagram.com/dknottphotography'},
            ]).map((l, i) => (
              <a key={i} href={l.href} className="block w-[90%] md:w-full max-w-[480px] bg-brand-btnbg text-white no-underline py-4 px-5 rounded-full text-[0.75rem] font-semibold tracking-[2px] transition-all duration-300 shadow-sm hover:bg-brand-btnhov hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm">{l.label}</a>
            ))}
        </div>
    </main>

    {/*  Image Modal  */}
    <div id="imageModal" className="fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-pointer transition-opacity duration-300">
        <button className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 z-[110]">&times;</button>
        <img id="modalImage" src="" alt="Full size image" className="max-h-[90vh] max-w-[95vw] object-contain rounded shadow-2xl scale-95 transition-transform duration-300" />
    </div>

    

</div>
    </>
  );
}
