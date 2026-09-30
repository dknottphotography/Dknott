import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

header_html = '''    <header className="flex w-screen h-[25vh] md:h-[45vh] overflow-hidden">
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder border-r-[2px] md:border-r-[6px] border-white bg-cover bg-center" style={{"backgroundImage": url()}}></div>
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder border-r-[2px] md:border-r-[6px] border-white bg-cover bg-center" style={{"backgroundImage": url()}}></div>
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder border-r-[2px] md:border-r-[6px] border-white bg-cover bg-center" style={{"backgroundImage": url()}}></div>
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder border-r-[2px] md:border-r-[6px] border-white bg-cover bg-center" style={{"backgroundImage": url()}}></div>
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder border-r-[2px] md:border-r-[6px] border-white bg-cover bg-center" style={{"backgroundImage": url()}}></div>
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder border-r-[2px] md:border-r-[6px] border-white bg-cover bg-center" style={{"backgroundImage": url()}}></div>
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder border-r-[2px] md:border-r-[6px] border-white bg-cover bg-center" style={{"backgroundImage": url()}}></div>
        <div className="flex-1 hover:flex-[1.5] hover:brightness-110 transition-all duration-500 cursor-pointer bg-brand-placeholder bg-cover bg-center" style={{"backgroundImage": url()}}></div>
    </header>'''

content = re.sub(r'<header className="flex w-screen.*?</header>', header_html, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
