import os
import glob

base_url = "https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/"
search_dir = "c:/Users/Balu/Desktop/dknott/src/pages"

for filepath in glob.glob(os.path.join(search_dir, "*.jsx")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace /img/ with the Supabase URL
    new_content = content.replace('"/img/', '"' + base_url)
    new_content = new_content.replace("'/img/", "'" + base_url)
    
    # Also replace in CSS url(/img/...)
    new_content = new_content.replace('url("/img/', 'url("' + base_url)
    new_content = new_content.replace("url('/img/", "url('" + base_url)
    new_content = new_content.replace('url(/img/', 'url(' + base_url)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

print("Replacement complete.")
