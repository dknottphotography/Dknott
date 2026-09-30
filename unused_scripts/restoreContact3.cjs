const fs = require('fs');
let fileContent = fs.readFileSync('src/pages/Contact.jsx', 'utf8');

const replacement = `      </button>
    </div>
  </div>
</header>

<section className="section" style={{"paddingTop":"5rem"}}>
  <div className="wrap center max-56 mx-auto" style={{"marginBottom":"4.5rem"}}>
    <span className="eyebrow" style={{"animation":"slideDown 0.8s ease-out forwards"}}>Contact</span>
    <h1 style={{"fontSize":"clamp(2.5rem,5vw,3.8rem)","animation":"slideUp 1s ease-out forwards","animationDelay":"0.1s","opacity":"0","fillMode":"forwards"}}>Tell us about your day.</h1>
    <p style={{"animation":"fadeUp 1s ease-out forwards","animationDelay":"0.3s","opacity":"0","marginTop":"1.5rem","fontSize":"1.05rem"}}>Fill in the details below and we'll get back to you within 24–48 hours with availability and a custom quote.</p>
  </div>
  
  <div className="wrap grid-2" style={{"alignItems":"flex-start","gap":"clamp(3rem, 5vw, 6rem)"}}>
    
    {/*  LEFT: FORM  */}
    <form id="inquiry-form" style={{"background":"var(--paper-deep)","padding":"clamp(2rem, 4vw, 3.5rem)","borderRadius":"12px","boxShadow":"0 10px 30px rgba(38,32,25,0.04)","animation":"fadeRight 1s ease-out forwards","animationDelay":"0.5s","opacity":"0"}}>
      
      <div className="form-row">
        <div className="elegant-field">
          <label htmlFor="name1">Your name</label>
          <input type="text" id="name1" required />
        </div>
        <div className="elegant-field">
          <label htmlFor="name2">Partner's name</label>
          <input type="text" id="name2" />
        </div>
      </div>
      <div className="form-row">
        <div className="elegant-field">
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" required />
        </div>
        <div className="elegant-field">
          <label htmlFor="phone">Mobile number</label>
          <input type="tel" id="phone" required />
        </div>
      </div>
      <div className="form-row">
        <div className="elegant-field">
          <label htmlFor="date">Wedding date</label>
          <input type="date" id="date" />
        </div>
        <div className="elegant-field">
          <label htmlFor="city">City / venue</label>
          <input type="text" id="city" />
        </div>
      </div>
      <div className="elegant-field">
        <label htmlFor="interest">Interested in</label>
        <select id="interest" style={{"cursor":"pointer"}}>
          <option>Photography only</option>
          <option>Films only</option>
          <option>Photography + Films</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="elegant-field">
        <label htmlFor="message">A little about your wedding</label>
        <textarea id="message" rows="3" placeholder="Number of functions, guest count, vibe..."></textarea>
      </div>
      <button type="submit" className="btn solid" style={{"width":"100%","justifyContent":"center","padding":"1.3rem","fontSize":"0.85rem","letterSpacing":"0.15em","marginTop":"1.5rem","borderRadius":"6px","boxShadow":"0 4px 15px rgba(122, 42, 42, 0.2)","transform":"translateY(0)","transition":"all 0.3s ease"}} onMouseOver={(e)=> {e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 25px rgba(122, 42, 42, 0.3)'}} onMouseOut={(e)=> {e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 15px rgba(122, 42, 42, 0.2)'}}>SEND INQUIRY</button>
    </form>

    {/*  RIGHT: INFO & MAP  */}
    <div style={{"animation":"fadeLeft 1s ease-out forwards","animationDelay":"0.7s","opacity":"0","display":"flex","flexDirection":"column","gap":"2.5rem"}}>
      <div style={{"background":"transparent"}}>
        <h3 style={{"fontSize":"2rem","marginBottom":"2rem","color":"var(--ink)","fontWeight":"400"}}>Reach us directly</h3>
        <div style={{"display":"flex","flexDirection":"column","gap":"1.8rem"}}>
          <div>
            <strong style={{"color":"var(--oxblood)","fontSize":"0.7rem","textTransform":"uppercase","letterSpacing":"0.15em","display":"block","marginBottom":"0.4rem"}}>Email</strong>
            <a href="mailto:hello@dknottphotography.com" style={{"fontSize":"1.15rem","borderBottom":"1px solid transparent","transition":"border-color 0.3s"}} onMouseOver={(e)=>e.currentTarget.style.borderColor='var(--ink)'} onMouseOut={(e)=>e.currentTarget.style.borderColor='transparent'}>hello@dknottphotography.com</a>
          </div>
          <div>
            <strong style={{"color":"var(--oxblood)","fontSize":"0.7rem","textTransform":"uppercase","letterSpacing":"0.15em","display":"block","marginBottom":"0.4rem"}}>Phone / Whatsapp</strong>
            <a href="tel:+910000000000"`;

const newFile = fileContent.replace(/<\/button>\s*<a href="tel:\+910000000000"/, replacement);
fs.writeFileSync('src/pages/Contact.jsx', newFile);
console.log("Restored via regex!");
