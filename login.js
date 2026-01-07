document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const spinner = document.getElementById("spinner");
    const btnText = document.getElementById("btnText");
    const loginBtn = document.getElementById("loginBtn");

    if (!form) {
        alert("Form login tidak ditemukan");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
        alert("Email dan password wajib diisi");
        return;
        }

        // === UI loading ===
        spinner.classList.remove("d-none");
        btnText.textContent = "Memverifikasi...";
        loginBtn.disabled = true;

        try {
        // ambil CSV (relative ke halaman HTML di root proyek)
        const response = await fetch("pj.csv");
        if (!response.ok) throw new Error("CSV tidak ditemukan");

        const csvText = await response.text();
        const rows = csvText
            .trim()
            .split(/\r?\n/)
            .slice(1); // skip header

        let isValid = false;

        for (const row of rows) {
            if (!row) continue;

            const [csvEmail, csvPassword] = row
            .split(",")
            .map(v => v.trim());

            if (csvEmail === email && csvPassword === password) {
            isValid = true;
            break;
            }
        }

            if (isValid) {
            sessionStorage.setItem("loggedIn", "true");
            sessionStorage.setItem("userEmail", email);

            // GANTI PESAN LOGIN
            const msg = document.getElementById("loginMessage");
            msg.textContent = "Login berhasil. Mengalihkan ke dashboard...";
            msg.style.color = "#198754"; // hijau
            msg.style.fontWeight = "500";

            // DELAY AGAR KELIHATAN
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1200);
            }


        } catch (err) {
        console.error(err);
        alert("⚠️ Terjadi kesalahan saat membaca data login");
        } finally {
        spinner.classList.add("d-none");
        btnText.textContent = "LOGIN";
        loginBtn.disabled = false;
        }
    });
});
