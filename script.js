// Cek status login
const role = localStorage.getItem("role");
if (!role) {
  window.location.href = "login.html";
}

const reportForm = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const countDisplay = document.getElementById("count");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const previewArea = document.getElementById("previewArea");
const logoutBtn = document.getElementById("logoutBtn");

let reports = JSON.parse(localStorage.getItem("reports")) || [];

// Fungsi render laporan
function renderReports() {
  reportsList.innerHTML = "";

  if (reports.length === 0) {
    reportsList.innerHTML = "<p>Belum ada laporan.</p>";
  } else {
    reports.forEach((report, index) => {
      const div = document.createElement("div");
      div.className = "report-item";
      div.innerHTML = `
        <strong>${report.nama}</strong> (${report.bagian})<br>
        <small>${report.tanggal}</small><br>
        <em>${report.jenis}</em><br>
        <p>${report.deskripsi}</p>
        ${report.foto ? `<img src="${report.foto}" alt="foto" class="preview">` : ""}
        ${role === "admin" ? `<button class="delete-btn" data-index="${index}">Hapus</button>` : ""}
        <hr>
      `;
      reportsList.appendChild(div);
    });
  }

  countDisplay.textContent = reports.length;
}

// Simpan ke localStorage
function saveReports() {
  localStorage.setItem("reports", JSON.stringify(reports));
}

// Tambah laporan baru
function tambahLaporan(nama, bagian, tanggal, jenis, deskripsi, foto) {
  reports.push({ nama, bagian, tanggal, jenis, deskripsi, foto });
  saveReports();
  renderReports();
  reportForm.reset();
  previewArea.innerHTML = "";
}

// Preview foto
document.getElementById("foto").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewArea.innerHTML = `<img src="${e.target.result}" class="preview">`;
    };
    reader.readAsDataURL(file);
  } else {
    previewArea.innerHTML = "";
  }
});

// Submit form
reportForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const bagian = document.getElementById("Bagian").value;
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const fotoInput = document.getElementById("foto");

  if (fotoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      tambahLaporan(nama, bagian, tanggal, jenis, deskripsi, e.target.result);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    tambahLaporan(nama, bagian, tanggal, jenis, deskripsi, "");
  }
});

// Hapus laporan
reportsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    reports.splice(index, 1);
    saveReports();
    renderReports();
  }
});

// Bersihkan form
clearBtn.addEventListener("click", () => {
  reportForm.reset();
  previewArea.innerHTML = "";
});

// Ekspor JSON
exportBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "laporan_apd.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

// Impor JSON
importBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          reports = imported;
          saveReports();
          renderReports();
        } else {
          alert("File tidak valid!");
        }
      } catch {
        alert("Gagal memuat file JSON!");
      }
    };
    reader.readAsText(file);
  };
  input.click();
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("role");
    window.location.href = "login.html";
  });
}

renderReports();
