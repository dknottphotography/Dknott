import os

file_path = 'src/pages/Contact.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Restore the dangerouslySetInnerHTML style tag if it was deleted
if "<style dangerouslySetInnerHTML={{ __html: `" not in content:
    content = content.replace("  return (\n    <>", "  return (\n    <>\n      <style dangerouslySetInnerHTML={{ __html: `")

# 2. Add onSubmit to the form
content = content.replace('<form id="inquiry-form" style', '<form id="inquiry-form" onSubmit={handleSubmit} style')

# 3. Add values to inputs
content = content.replace('<input type="text" id="name1" required />', '<input type="text" id="name1" value={formData.name1} onChange={handleChange} required />')
content = content.replace('<input type="text" id="name2" />', '<input type="text" id="name2" value={formData.name2} onChange={handleChange} />')
content = content.replace('<input type="email" id="email" required />', '<input type="email" id="email" value={formData.email} onChange={handleChange} required />')
content = content.replace('<input type="tel" id="phone" required />', '<input type="tel" id="phone" value={formData.phone} onChange={handleChange} required />')
content = content.replace('<input type="date" id="date" />', '<input type="date" id="date" value={formData.date} onChange={handleChange} />')
content = content.replace('<input type="text" id="city" />', '<input type="text" id="city" value={formData.city} onChange={handleChange} />')
content = content.replace('<select id="interest" style={{"cursor":"pointer"}}>', '<select id="interest" style={{"cursor":"pointer"}} value={formData.interest} onChange={handleChange}>')
content = content.replace('<textarea id="message" rows="3" placeholder="Number of functions, guest count, vibe..."></textarea>', '<textarea id="message" rows="3" placeholder="Number of functions, guest count, vibe..." value={formData.message} onChange={handleChange}></textarea>')

# 4. Button update
content = content.replace('SEND INQUIRY</button>', '{isSubmitting ? "SENDING..." : submitStatus === "success" ? "SENT - THANK YOU" : submitStatus === "error" ? "ERROR - TRY AGAIN" : "SEND INQUIRY"}</button>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Contact form updated successfully via python")
