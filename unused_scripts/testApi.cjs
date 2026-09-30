const fetch = require('node-fetch'); // wait, node 18+ has global fetch

async function testApi() {
  try {
    const res = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name1: "Test Name",
        email: "test@example.com",
        phone: "1234567890",
        interest: "Photography"
      })
    });
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testApi();
