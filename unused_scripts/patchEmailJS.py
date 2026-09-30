import os

file_path = 'c:/Users/Balu/Desktop/dknott/src/pages/Contact.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_web3 = """      // 2. Send Email via Web3Forms
      const web3FormsPayload = {
        access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
        subject: `New Wedding Inquiry from ${formData.name1}`,
        from_name: "DKNOTT Photography Site",
        replyto: formData.email,
        name: formData.name1,
        partner: formData.name2 || 'N/A',
        email: formData.email,
        phone: formData.phone,
        wedding_date: formData.date || 'N/A',
        city: formData.city || 'N/A',
        interest: formData.interest,
        message: formData.message || 'N/A'
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(web3FormsPayload)
      });
      const data = await response.json();
      
      if (data.success) {"""

new_emailjs = """      // 2. Send Email via EmailJS
      const emailJsPayload = {
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: formData.name1,
          reply_to: formData.email,
          name: formData.name1,
          partner: formData.name2 || 'N/A',
          email: formData.email,
          phone: formData.phone,
          wedding_date: formData.date || 'N/A',
          city: formData.city || 'N/A',
          interest: formData.interest,
          message: formData.message || 'N/A'
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailJsPayload)
      });
      
      if (response.ok) {"""

content = content.replace(old_web3, new_emailjs)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Contact.jsx patched for EmailJS")
