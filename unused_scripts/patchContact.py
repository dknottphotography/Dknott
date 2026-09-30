import os

file_path = 'c:/Users/Balu/Desktop/dknott/src/pages/Contact.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add supabase import
if 'import { supabase } from' not in content:
    content = content.replace(
        "import React, { useEffect } from 'react';",
        "import React, { useEffect } from 'react';\nimport { supabase } from '../lib/supabaseClient';"
    )

# Replace handleSubmit
old_handle_submit = """  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSubmitStatus('success');
        setFormData({ name1: '', name2: '', email: '', phone: '', date: '', city: '', interest: 'Photography only', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };"""

new_handle_submit = """  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      // 1. Insert into Supabase
      const { error: supabaseError } = await supabase
        .from('inquiries')
        .insert([{ 
          name1: formData.name1,
          name2: formData.name2,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          city: formData.city,
          interest: formData.interest,
          message: formData.message
        }]);

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
      }

      // 2. Send Email via Web3Forms
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
      
      if (data.success) {
        setSubmitStatus('success');
        setFormData({ name1: '', name2: '', email: '', phone: '', date: '', city: '', interest: 'Photography only', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        console.error("Web3Forms Error:", data);
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };"""

content = content.replace(old_handle_submit, new_handle_submit)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Contact.jsx successfully updated!")
