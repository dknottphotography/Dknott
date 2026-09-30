import os

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/WeddingFilms.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

pill_menu_block = """</section>

<section className="section tight" style={{paddingBottom: "0"}}>
  <div className="wrap center reveal">
    <div className="pill-row" style={{justifyContent: "center", marginBottom: "0rem", paddingTop: "2rem"}}>
      <button className="pill active" data-filter="all">All Films</button>
      <button className="pill" data-filter="wedding">Weddings</button>
      <button className="pill" data-filter="teaser">Teasers</button>
      <button className="pill" data-filter="invitation">Invitations</button>
    </div>
  </div>
</section>"""

# Remove all instances of the pill menu block
content = content.replace(pill_menu_block, "</section>")

# Re-insert it exactly ONCE after the hero section
hero_marker = '</section>\n\n{/*  Film 1 (Light)  */}'
if hero_marker in content:
    content = content.replace(hero_marker, pill_menu_block + '\n\n{/*  Film 1 (Light)  */}', 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned up extra pill menus.")
