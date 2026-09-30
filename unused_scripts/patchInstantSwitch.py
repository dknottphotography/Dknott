import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/RealWeddings.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_modal_layout = """<div className="masonry-grid">
                      {galleryData[activeTab]?.map((url, i) => (
                          <img key={i} src={url} alt={`${selectedWedding.title} photo ${i+1}`} loading="lazy" />
                      ))}
                  </div>"""

new_modal_layout = """{Object.keys(galleryData).map(tab => (
                      <div key={tab} className="masonry-grid" style={{ display: activeTab === tab ? 'block' : 'none' }}>
                          {galleryData[tab]?.map((url, i) => (
                              <img key={`${tab}-${i}`} src={url} alt={`${selectedWedding.title} ${tab} photo ${i+1}`} loading="lazy" />
                          ))}
                      </div>
                  ))}"""

if old_modal_layout in content:
    content = content.replace(old_modal_layout, new_modal_layout)
else:
    print("Could not find the target code block to replace. Please check manually.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("RealWeddings.jsx updated to retain DOM elements for instant tab switching.")
