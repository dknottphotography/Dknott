import re

with open(r'c:\Users\Balu\Desktop\Dknott\src\pages\Home.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variables below setWeddings
state_add = """  const [weddings, setWeddings] = useState([]);
  const [currentTesti, setCurrentTesti] = useState(0);
  const [testiFading, setTestiFading] = useState(false);"""
content = content.replace("  const [weddings, setWeddings] = useState([]);", state_add)

# 2. Extract testimonials array
testi_match = re.search(r'(const testimonials = \[\s*\{.*?\}\s*\];)', content, re.DOTALL)
if testi_match:
    testi_array = testi_match.group(1)
else:
    print("Testimonials array not found")
    exit(1)

# 3. Remove vanilla JS testimonial logic from useEffect
start_idx = content.find("const testimonials = [")
end_idx = content.find("setTimeout(() => {\n  // mobile nav toggle")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]
else:
    print("Could not find bounds of vanilla JS logic")
    exit(1)

# 4. Insert testimonials array before return
insert_pos = content.find("  return (")
content = content[:insert_pos] + testi_array + "\n\n" + """  const handleTestiChange = (direction) => {
    if (testiFading) return;
    setTestiFading(true);
    setTimeout(() => {
      setCurrentTesti(prev => {
        if (direction === 'next') return (prev + 1) % testimonials.length;
        return (prev - 1 + testimonials.length) % testimonials.length;
      });
      setTestiFading(false);
    }, 400);
  };

""" + content[insert_pos:]


# 5. Update JSX
jsx_bg = """<img id="testi-bg" src={testimonials[currentTesti].image} onError={handleImageError} alt="Testimonials Background" style={{"position":"absolute","top":"0","left":"0","width":"100%","height":"100%","objectFit":"cover","zIndex":"0","filter":"brightness(0.5)","transition":"opacity 0.4s ease-in-out","opacity": testiFading ? 0 : 1}} />"""
content = re.sub(r'<img id="testi-bg".*?/>', jsx_bg, content, flags=re.DOTALL)

jsx_container = """<div id="testimonial-container" style={{"minHeight":"350px","display":"flex","flexDirection":"column","justifyContent":"center","transition":"opacity 0.4s ease-in-out","opacity": testiFading ? 0 : 1}}>
      <h2 id="testimonial-author" style={{"color":"var(--paper)","fontFamily":"var(--serif)","fontSize":"clamp(2rem, 4vw, 2.8rem)","fontWeight":"400","marginBottom":"1.5rem"}}>
        {testimonials[currentTesti].author}
      </h2>
      <div id="testimonial-text" style={{"fontFamily":"var(--sans)","fontSize":"0.95rem","lineHeight":"1.8","color":"rgba(255,255,255,0.95)","fontWeight":"300"}} dangerouslySetInnerHTML={{__html: testimonials[currentTesti].text}}>
      </div>
    </div>"""

# Need to accurately replace the whole container.
c_start = content.find('<div id="testimonial-container"')
c_end = content.find('</div>\n    \n    {/*  Knot Divider replacing hr  */}')

if c_start != -1 and c_end != -1:
    content = content[:c_start] + jsx_container + "\n" + content[c_end+7:]
else:
    print("Could not find container bounds")
    exit(1)


# Update arrows and counter
content = content.replace('id="testi-prev"', 'onClick={() => handleTestiChange("prev")}')
content = content.replace('id="testi-next"', 'onClick={() => handleTestiChange("next")}')
content = re.sub(r'<span id="testi-counter">.*?</span>', '<span id="testi-counter">{currentTesti + 1} &nbsp;/&nbsp; {testimonials.length}</span>', content)

with open(r'c:\Users\Balu\Desktop\Dknott\src\pages\Home.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully refactored testimonials!")
