import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Contact.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the section tag starting right after </header>
start_pattern = r'<section className="section" style=\{\{"paddingTop":"5rem", "backgroundColor": "#F4EFE6", "minHeight": "100vh"\}\}>'

# Find the end of this section (right before <footer)
end_pattern = r'</section>\s*<footer'

replacement = """{/*  HERO  */}
<section className="contact-hero" style={{"position":"relative","minHeight":"65vh","display":"flex","alignItems":"center","justifyContent":"center","overflow":"hidden","marginTop":"-85px"}}>
  <img src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_4.jpeg" alt="Contact Hero" style={{"position":"absolute","top":"0","left":"0","width":"100%","height":"100%","objectFit":"cover","objectPosition":"center 30%","zIndex":"1","filter":"brightness(0.6)"}} />
  <div style={{"position":"relative","zIndex":"2","textAlign":"center","color":"white","paddingTop":"85px","textShadow":"0 4px 15px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)"}}>
    <h1 className="reveal" style={{"fontSize":"clamp(2.8rem, 6vw, 4.2rem)","fontFamily":"var(--serif)","letterSpacing":"0.02em","marginBottom":"1rem","color":"white"}}>Tell us about your day.</h1>
    <p className="reveal" style={{"animationDelay":"0.2s","fontFamily":"var(--sans)","fontSize":"0.85rem","letterSpacing":"0.2em","textTransform":"uppercase","color":"#DFBB7B","maxWidth":"600px","margin":"0 auto","lineHeight":"1.6"}}>Fill in the details below and we'll get back to you within 24–48 hours.</p>
  </div>
</section>

{/*  MAIN  */}
<section className="section" style={{"backgroundColor": "var(--paper)", "paddingTop":"6rem", "paddingBottom":"8rem"}}>
  <div className="wrap" style={{"maxWidth": "1200px", "margin": "0 auto"}}>
    
    <div style={{"display": "flex", "flexDirection": "column", "gap": "5rem"}} className="md-flex-row">
      <style>{`
        @media (min-width: 900px) {
          .md-flex-row { flex-direction: row !important; }
          .left-col { flex: 1.1; padding-right: 2rem; }
          .right-col { flex: 0.9; padding-left: 2rem; }
        }
        @media (max-width: 899px) {
          .contact-container { padding: 2rem !important; }
        }
        .left-col { flex: 1; }
        .right-col { flex: 1; }
        
        .contact-container {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 3.5rem 4rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 20px 40px rgba(38,32,25,0.05), inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .ref-field { margin-bottom: 2.2rem; position: relative; }
        .ref-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-soft); display: block; margin-bottom: 0.6rem; font-weight: 600; }
        .ref-input { 
          width: 100%; 
          background: rgba(255,255,255,0.6); 
          border: 1px solid rgba(38,32,25,0.1); 
          border-bottom: 2px solid rgba(38,32,25,0.2);
          padding: 0.9rem 1rem; 
          font-family: var(--sans); 
          font-size: 0.95rem; 
          color: var(--ink); 
          outline: none; 
          transition: all 0.3s ease;
          border-radius: 4px 4px 0 0;
        }
        .ref-input::placeholder { color: rgba(38,32,25,0.3); font-style: italic; }
        .ref-input:focus { 
          background: rgba(255,255,255,0.9);
          border-bottom-color: var(--oxblood); 
          box-shadow: 0 4px 15px rgba(122,42,42,0.05);
        }
        
        .ref-pill { 
          padding: 0.7rem 1.4rem; 
          border-radius: 999px; 
          border: 1px solid rgba(38,32,25,0.2); 
          font-size: 0.75rem; 
          letter-spacing: 0.05em;
          background: transparent; 
          color: var(--ink-soft); 
          cursor: pointer; 
          transition: all 0.3s ease; 
          margin-right: 0.6rem; 
          margin-bottom: 0.6rem; 
        }
        .ref-pill.active { 
          border-color: var(--oxblood); 
          color: var(--paper); 
          background: var(--oxblood); 
          box-shadow: 0 4px 10px rgba(122,42,42,0.2);
        }
        .ref-pill:hover:not(.active) { border-color: var(--oxblood); color: var(--oxblood); }

        .btn-submit {
          width: 100%;
          background: var(--ink);
          color: var(--paper);
          border: none;
          padding: 1.2rem 2rem;
          border-radius: 4px;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.3s ease;
          font-family: var(--sans);
          font-weight: 500;
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--gold);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(199,163,105,0.3);
        }

        .info-block { margin-bottom: 2rem; }
        .info-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-soft); display: block; margin-bottom: 0.5rem; font-weight: 600; }
        .info-text { font-family: var(--sans); font-size: 1.1rem; color: var(--ink); display: inline-block; transition: color 0.3s; position: relative; text-decoration: none; }
        .info-text::after { content: ''; position: absolute; width: 100%; transform: scaleX(0); height: 1px; bottom: -2px; left: 0; background-color: var(--gold); transform-origin: bottom right; transition: transform 0.3s ease-out; }
        .info-text:hover::after { transform: scaleX(1); transform-origin: bottom left; }
        .info-text:hover { color: var(--gold); }
        
        .map-container {
          margin-top: 3rem;
          border-radius: 12px;
          overflow: hidden;
          height: 280px;
          border: 1px solid rgba(38,32,25,0.1);
          box-shadow: 0 10px 30px rgba(38,32,25,0.05);
          position: relative;
        }
        .map-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
          filter: grayscale(0.2) contrast(1.1) sepia(0.2);
          transition: filter 0.5s ease;
        }
        .map-container:hover iframe {
          filter: grayscale(0) contrast(1) sepia(0);
        }
      `}</style>

      {/* LEFT COLUMN: FORM */}
      <div className="left-col reveal">
        <div className="contact-container">
          <h2 style={{"fontSize": "1.6rem", "fontFamily": "var(--serif)", "color": "var(--ink)", "marginBottom": "2.5rem"}}>Send an Inquiry</h2>
          
          <form id="inquiry-form" onSubmit={handleSubmit}>
            <div className="grid-2" style={{"gap": "1.5rem", "marginBottom": "0"}}>
              <div className="ref-field">
                <label className="ref-label">Your name</label>
                <input type="text" className="ref-input" placeholder="Ananya" value={formData.name1} onChange={(e) => setFormData({...formData, name1: e.target.value})} required />
              </div>
              <div className="ref-field">
                <label className="ref-label">Partner's name</label>
                <input type="text" className="ref-input" placeholder="Rohan" value={formData.name2} onChange={(e) => setFormData({...formData, name2: e.target.value})} />
              </div>
            </div>
            
            <div className="grid-2" style={{"gap": "1.5rem", "marginBottom": "0"}}>
              <div className="ref-field">
                <label className="ref-label">Email address</label>
                <input type="email" className="ref-input" placeholder="you@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="ref-field">
                <label className="ref-label">Mobile number</label>
                <input type="tel" className="ref-input" placeholder="+91 00000 00000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              </div>
            </div>
            
            <div className="grid-2" style={{"gap": "1.5rem", "marginBottom": "0"}}>
              <div className="ref-field">
                <label className="ref-label">Wedding date</label>
                <input type="text" className="ref-input" placeholder="e.g. 14 Feb 2027" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="ref-field">
                <label className="ref-label">City / venue</label>
                <input type="text" className="ref-input" placeholder="Hyderabad" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>
            
            <div className="ref-field" style={{"marginTop": "0.5rem"}}>
              <label className="ref-label">Interested in</label>
              <div style={{"display": "flex", "flexWrap": "wrap"}}>
                <button type="button" className={`ref-pill ${formData.interest === 'Photography only' || !formData.interest ? 'active' : ''}`} onClick={() => setFormData({...formData, interest: 'Photography only'})}>Photography only</button>
                <button type="button" className={`ref-pill ${formData.interest === 'Films only' ? 'active' : ''}`} onClick={() => setFormData({...formData, interest: 'Films only'})}>Films only</button>
                <button type="button" className={`ref-pill ${formData.interest === 'Photography + Films' ? 'active' : ''}`} onClick={() => setFormData({...formData, interest: 'Photography + Films'})}>Photography + Films</button>
              </div>
            </div>
            
            <div className="ref-field" style={{"marginTop": "1.5rem"}}>
              <label className="ref-label">A little about your wedding</label>
              <textarea className="ref-input" placeholder="Functions, guest count, what matters most to you..." rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{"resize": "none", "lineHeight": "1.6"}}></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
              style={{
                "background": submitStatus === 'success' ? 'var(--olive)' : '',
                "cursor": isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {isSubmitting ? "SENDING..." : submitStatus === "success" ? "SENT - THANK YOU" : "SUBMIT INQUIRY"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: DIRECT CONTACT */}
      <div className="right-col reveal" style={{"animationDelay": "0.2s"}}>
        <h2 style={{"fontSize": "2.2rem", "fontWeight": "400", "fontFamily": "var(--serif)", "color": "var(--ink)", "marginBottom": "3rem", "letterSpacing": "-0.01em"}}>Reach us directly</h2>
        
        <div className="info-block">
          <span className="info-label">Email</span>
          <a href="mailto:dknottphotography3@gmail.com" className="info-text">dknottphotography3@gmail.com</a>
        </div>
        
        <div className="info-block">
          <span className="info-label">Phone / Whatsapp</span>
          <a href="tel:+919110708256" className="info-text">+91 91107 08256</a>
        </div>
        
        <div className="info-block">
          <span className="info-label">Instagram</span>
          <a href="https://instagram.com/dknottphotography" target="_blank" rel="noreferrer" className="info-text">@dknottphotography</a>
        </div>
        
        <div className="map-container">
          {/* Default to a nice map of Hyderabad, India */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d121825.86470355104!2d78.36109968413155!3d17.412497645163352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana%2C%20India!5e0!3m2!1sen!2sus!4v1716945892558!5m2!1sen!2sus" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Studio Location"
          ></iframe>
        </div>
        
        <div style={{"marginTop": "2rem", "display": "flex", "alignItems": "center", "gap": "1rem"}}>
          <div style={{"width": "40px", "height": "1px", "background": "var(--gold)"}}></div>
          <p style={{"fontFamily": "var(--sans)", "fontSize": "0.75rem", "color": "var(--ink-soft)", "letterSpacing": "0.1em", "textTransform": "uppercase", "marginBottom": "0"}}>
            Based in India, available worldwide.
          </p>
        </div>
      </div>
      
    </div>
  </div>
</section>
"""

# Perform replacement
match1 = re.search(start_pattern, content)
match2 = re.search(end_pattern, content)

if match1 and match2:
    start_idx = match1.start()
    end_idx = match2.start() + len('</section>')
    
    new_content = content[:start_idx] + replacement + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced contact form section.")
else:
    print("Could not find patterns.")
    if not match1:
        print("Failed to find start_pattern")
    if not match2:
        print("Failed to find end_pattern")
