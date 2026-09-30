const fs = require('fs');
let fileContent = fs.readFileSync('src/pages/Contact.jsx', 'utf8');

// 1. Remove vanilla form event listener
fileContent = fileContent.replace(/\/\/ contact form: placeholder submit[\s\S]*?\}\);[\s\S]*?\}/, '// contact form handled by react');

// 2. Inject React hooks and submit handler
const reactStateAndHandler = `export default function Contact() {
  const [formData, setFormData] = React.useState({
    name1: '', name2: '', email: '', phone: '', date: '', city: '', interest: 'Photography only', message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
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
  };
`;

fileContent = fileContent.replace('export default function Contact() {', reactStateAndHandler);

// 3. Replace the form opening tag
fileContent = fileContent.replace('<form id="inquiry-form" style', '<form id="inquiry-form" onSubmit={handleSubmit} style');

// 4. Update the submit button text based on status
fileContent = fileContent.replace('SEND INQUIRY</button>', '{isSubmitting ? "SENDING..." : submitStatus === "success" ? "SENT - THANK YOU" : submitStatus === "error" ? "ERROR - TRY AGAIN" : "SEND INQUIRY"}</button>');

// 5. Add value and onChange to inputs
const idsToUpdate = ['name1', 'name2', 'email', 'phone', 'date', 'city', 'interest', 'message'];
for (const id of idsToUpdate) {
  if (id === 'message') {
    fileContent = fileContent.replace(
      new RegExp(\`<textarea id="\${id}"\`), 
      \`<textarea id="\${id}" value={formData.\${id}} onChange={handleChange}\`
    );
  } else if (id === 'interest') {
    fileContent = fileContent.replace(
      new RegExp(\`<select id="\${id}"\`), 
      \`<select id="\${id}" value={formData.\${id}} onChange={handleChange}\`
    );
  } else {
    fileContent = fileContent.replace(
      new RegExp(\`<input type="([^"]+)" id="\${id}"\`), 
      \`<input type="$1" id="\${id}" value={formData.\${id}} onChange={handleChange}\`
    );
  }
}

fs.writeFileSync('src/pages/Contact.jsx', fileContent);
console.log("Contact.jsx successfully updated with React state and fetch logic!");
