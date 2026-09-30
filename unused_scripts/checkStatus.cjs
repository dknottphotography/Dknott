async function checkStatus() {
  try {
    const res = await fetch('http://localhost:3001/api/status');
    const data = await res.json();
    console.log("Status:", data);
  } catch(e) {
    console.log("Server not reachable on port 3001:", e.message);
  }
}
checkStatus();
