import re

file_path = 'c:/Users/Balu/Desktop/dknott/src/pages/Contact.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS
old_css = """      /* Sleek form styling */
      .elegant-field { margin-bottom: 2rem; position: relative; }
      .elegant-field label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--ink-soft); display: block; margin-bottom: 0.7rem; transition: color 0.3s; }
      .elegant-field input, .elegant-field textarea, .elegant-field select {
        width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--line-strong); padding: 0.6rem 0; font-family: var(--sans); font-size: 1.1rem; color: var(--ink); outline: none; transition: border-color 0.3s, background 0.3s;
      }
      .elegant-field input:focus, .elegant-field textarea:focus, .elegant-field select:focus { border-bottom: 1.5px solid var(--oxblood); }"""

new_css = """      /* Floating Label & Glassmorphism Form styling */
      .elegant-field { 
        position: relative; 
        margin-bottom: 2.5rem; 
      }
      .elegant-field input, .elegant-field textarea, .elegant-field select {
        width: 100%; 
        background: transparent; 
        border: none; 
        border-bottom: 1.5px solid var(--line-strong); 
        padding: 1.2rem 0 0.5rem 0; 
        font-family: var(--sans); 
        font-size: 1.1rem; 
        color: var(--ink); 
        outline: none; 
        transition: border-color 0.4s ease;
      }
      .elegant-field select {
        padding-top: 1rem;
        color: var(--ink);
      }
      .elegant-field label { 
        position: absolute;
        top: 1.2rem;
        left: 0;
        font-size: 1.05rem; 
        color: var(--ink-soft); 
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        text-transform: none;
        letter-spacing: normal;
      }
      .elegant-field input:focus, .elegant-field textarea:focus, .elegant-field select:focus { 
        border-bottom: 1.5px solid var(--oxblood); 
      }
      .elegant-field input:focus ~ label,
      .elegant-field.filled input ~ label,
      .elegant-field textarea:focus ~ label,
      .elegant-field.filled textarea ~ label {
        top: -0.4rem;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--oxblood);
      }
      .elegant-field select ~ label {
        top: -0.4rem;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--ink-soft);
      }
      
      .contact-container {
        background: linear-gradient(145deg, rgba(240,232,216,0.9), rgba(240,232,216,0.4));
        backdrop-filter: blur(12px);
        padding: clamp(2.5rem, 4vw, 4rem);
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(38,32,25,0.06), inset 0 1px 0 rgba(255,255,255,0.5);
        animation: fadeRight 1s ease-out forwards;
        animation-delay: 0.5s;
        opacity: 0;
        border: 1px solid rgba(255,255,255,0.3);
      }

      .spinner {
        animation: spin 1s linear infinite;
        width: 18px; height: 18px;
        margin-right: 10px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        display: inline-block;
      }
      @keyframes spin { 100% { transform: rotate(360deg); } }"""

content = content.replace(old_css, new_css)

# 2. Update Form HTML
old_form = """    <form id="inquiry-form" onSubmit={handleSubmit} style={{"background":"var(--paper-deep)","padding":"clamp(2rem, 4vw, 3.5rem)","borderRadius":"12px","boxShadow":"0 10px 30px rgba(38,32,25,0.04)","animation":"fadeRight 1s ease-out forwards","animationDelay":"0.5s","opacity":"0"}}>
      
      <div className="form-row">
        <div className="elegant-field">
          <label htmlFor="name1">Your name</label>
          <input type="text" id="name1" value={formData.name1} onChange={handleChange} required />
        </div>
        <div className="elegant-field">
          <label htmlFor="name2">Partner's name</label>
          <input type="text" id="name2" value={formData.name2} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="elegant-field">
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="elegant-field">
          <label htmlFor="phone">Mobile number</label>
          <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="elegant-field">
          <label htmlFor="date">Wedding date</label>
          <input type="date" id="date" value={formData.date} onChange={handleChange} />
        </div>
        <div className="elegant-field">
          <label htmlFor="city">City / venue</label>
          <input type="text" id="city" value={formData.city} onChange={handleChange} />
        </div>
      </div>
      <div className="elegant-field">
        <label htmlFor="interest">Interested in</label>
        <select id="interest" style={{"cursor":"pointer"}} value={formData.interest} onChange={handleChange}>
          <option>Photography only</option>
          <option>Films only</option>
          <option>Photography + Films</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="elegant-field">
        <label htmlFor="message">A little about your wedding</label>
        <textarea id="message" rows="3" placeholder="Number of functions, guest count, vibe..." value={formData.message} onChange={handleChange}></textarea>
      </div>
      <button type="submit" className="btn solid" style={{"width":"100%","justifyContent":"center","padding":"1.3rem","fontSize":"0.85rem","letterSpacing":"0.15em","marginTop":"1.5rem","borderRadius":"6px","boxShadow":"0 4px 15px rgba(122, 42, 42, 0.2)","transform":"translateY(0)","transition":"all 0.3s ease"}} onMouseOver={(e)=> {e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 25px rgba(122, 42, 42, 0.3)'}} onMouseOut={(e)=> {e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 15px rgba(122, 42, 42, 0.2)'}}>{isSubmitting ? "SENDING..." : submitStatus === "success" ? "SENT - THANK YOU" : submitStatus === "error" ? "ERROR - TRY AGAIN" : "SEND INQUIRY"}</button>
    </form>"""

new_form = """    <form id="inquiry-form" onSubmit={handleSubmit} className="contact-container">
      
      <div className="form-row">
        <div className={`elegant-field ${formData.name1 ? 'filled' : ''}`}>
          <input type="text" id="name1" value={formData.name1} onChange={handleChange} required />
          <label htmlFor="name1">Your name</label>
        </div>
        <div className={`elegant-field ${formData.name2 ? 'filled' : ''}`}>
          <input type="text" id="name2" value={formData.name2} onChange={handleChange} />
          <label htmlFor="name2">Partner's name</label>
        </div>
      </div>
      <div className="form-row">
        <div className={`elegant-field ${formData.email ? 'filled' : ''}`}>
          <input type="email" id="email" value={formData.email} onChange={handleChange} required />
          <label htmlFor="email">Email address</label>
        </div>
        <div className={`elegant-field ${formData.phone ? 'filled' : ''}`}>
          <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required />
          <label htmlFor="phone">Mobile number</label>
        </div>
      </div>
      <div className="form-row">
        <div className={`elegant-field ${formData.date ? 'filled' : ''}`}>
          {/* Use onFocus to change type from text to date so placeholder label works nicely */}
          <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => {if(!e.target.value) e.target.type = 'text'}} id="date" value={formData.date} onChange={handleChange} />
          <label htmlFor="date">Wedding date</label>
        </div>
        <div className={`elegant-field ${formData.city ? 'filled' : ''}`}>
          <input type="text" id="city" value={formData.city} onChange={handleChange} />
          <label htmlFor="city">City / venue</label>
        </div>
      </div>
      <div className="elegant-field filled">
        <select id="interest" style={{"cursor":"pointer"}} value={formData.interest} onChange={handleChange}>
          <option>Photography only</option>
          <option>Films only</option>
          <option>Photography + Films</option>
          <option>Not sure yet</option>
        </select>
        <label htmlFor="interest">Interested in</label>
      </div>
      <div className={`elegant-field ${formData.message ? 'filled' : ''}`}>
        <textarea id="message" rows="3" value={formData.message} onChange={handleChange}></textarea>
        <label htmlFor="message">A little about your wedding (functions, guest count...)</label>
      </div>
      <button 
        type="submit" 
        className="btn solid" 
        disabled={isSubmitting}
        style={{
          "width":"100%",
          "justifyContent":"center",
          "padding":"1.3rem",
          "fontSize":"0.85rem",
          "letterSpacing":"0.15em",
          "marginTop":"1.5rem",
          "borderRadius":"8px",
          "boxShadow":"0 4px 15px rgba(122, 42, 42, 0.2)",
          "transform":"translateY(0)",
          "transition":"all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          "background": submitStatus === 'success' ? '#5C6B47' : (isSubmitting ? '#5E1F1F' : 'var(--oxblood)'),
          "borderColor": submitStatus === 'success' ? '#5C6B47' : (isSubmitting ? '#5E1F1F' : 'var(--oxblood)'),
          "cursor": isSubmitting ? 'not-allowed' : 'pointer'
        }} 
        onMouseOver={(e)=> { if(!isSubmitting && submitStatus !== 'success') { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 25px rgba(122, 42, 42, 0.35)'; } }} 
        onMouseOut={(e)=> { if(!isSubmitting && submitStatus !== 'success') { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 15px rgba(122, 42, 42, 0.2)'; } }}
      >
        {isSubmitting ? (
          <><span className="spinner"></span> SENDING...</>
        ) : submitStatus === "success" ? (
          <>✓ SENT - THANK YOU</>
        ) : submitStatus === "error" ? (
          "ERROR - TRY AGAIN"
        ) : (
          "SEND INQUIRY"
        )}
      </button>
    </form>"""

content = content.replace(old_form, new_form)

# 3. Logo alignment in Desktop Nav
# The logo has inline styling: style={{"display":"flex","alignItems":"center"}}
# We can adjust the top margin on desktop using standard CSS for .logo
old_nav_logo = """    <a href="/index" className="logo" style={{"display":"flex","alignItems":"center"}}>"""
new_nav_logo = """    <a href="/index" className="logo" style={{"display":"flex","alignItems":"center","marginTop":"-4px"}}>"""

content = content.replace(old_nav_logo, new_nav_logo)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Contact.jsx UI overhauled successfully!")
