// ----------------------------
// LOGIN
// ----------------------------
function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();

  if (!email) {
    document.getElementById("error").innerText = "Email is required";
    return;
  }

  localStorage.setItem("user_email", email);
  window.location.href = "dashboard.html";
}

// ----------------------------
// LOGOUT
// ----------------------------
function logout() {
  localStorage.removeItem("user_email");
  window.location.href = "index.html";
}

// ----------------------------
// DASHBOARD LOAD
// ----------------------------
async function loadDashboard() {
  const email = localStorage.getItem("user_email");

  if (!email) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("user-info").innerHTML =
    `Login sebagai: <b>${email}</b>`;

  const res = await fetch("pj.csv");
  const text = await res.text();

  const rows = text.split("\n").map(r => r.split(","));
  const headers = rows.shift().map(h => h.trim());

  const data = rows
    .map(r => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = r[i]?.trim());
      return obj;
    })
    .filter(r => r.email?.toLowerCase() === email);

  if (data.length === 0) {
    document.getElementById("table-container").innerHTML =
      "<p>No data for this user.</p>";
    return;
  }

  renderTable(headers, data);
  renderChart(data);
}

// ----------------------------
// TABLE
// ----------------------------
function renderTable(headers, data) {
  let html = "<table><thead><tr>";

  headers.forEach(h => {
    if (!["_nilai", "Kategori"].includes(h)) {
      html += `<th>${h}</th>`;
    }
  });

  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    headers.forEach(h => {
      if (!["_nilai", "Kategori"].includes(h)) {
        html += `<td>${row[h] || ""}</td>`;
      }
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  document.getElementById("table-container").innerHTML = html;
}

// ----------------------------
// CHART
// ----------------------------
function renderChart(data) {
  if (!data[0]._nilai || !data[0].Desa) return;

  const labels = data.map(d => d.Desa);
  const values = data.map(d => Number(d._nilai));

  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Nilai",
        data: values
      }]
    }
  });
}

// Auto-load dashboard
if (window.location.pathname.includes("dashboard")) {
  loadDashboard();
}
