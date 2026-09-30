import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/WeddingFilms.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add pill menu
if 'data-filter="all"' not in content:
    hero_end = '</section>\n\n{/*  Film 1'
    pill_menu = """</section>

<section className="section tight" style={{paddingBottom: "0"}}>
  <div className="wrap center reveal">
    <div className="pill-row" style={{justifyContent: "center", marginBottom: "0rem", paddingTop: "2rem"}}>
      <button className="pill active" data-filter="all">All Films</button>
      <button className="pill" data-filter="wedding">Weddings</button>
      <button className="pill" data-filter="teaser">Teasers</button>
      <button className="pill" data-filter="invitation">Invitations</button>
    </div>
  </div>
</section>

{/*  Film 1"""
    content = content.replace(hero_end, pill_menu)

# 2. Add data-tags to all film sections.
tags_map = {
    "Film 1": "wedding",
    "Film 2": "wedding",
    "Film 3": "wedding",
    "Film 4": "wedding",
    "Film 5": "wedding",
    "Film 6": "teaser",
    "Film 7": "teaser",
    "Film 8": "teaser",
    "Film 9": "invitation",
    "Film 10": "invitation",
    "Film 11": "invitation",
    "Film 12": "wedding",
    "Film 13": "wedding",
    "Film 14": "wedding",
}

for i in range(1, 15):
    film_marker = f"{{/*  Film {i} "
    idx = content.find(film_marker)
    if idx != -1:
        # Find the next <section> tag
        section_idx = content.find('<section', idx)
        if section_idx != -1:
            # Check if it already has data-tags
            end_bracket = content.find('>', section_idx)
            section_tag = content[section_idx:end_bracket+1]
            if 'data-tags' not in section_tag:
                tag = tags_map.get(f"Film {i}", "wedding")
                # Insert data-tags
                new_section_tag = section_tag.replace('<section', f'<section data-tags="{tag}"')
                content = content[:section_idx] + new_section_tag + content[end_bracket+1:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("WeddingFilms.jsx updated with filter buttons and data-tags.")
