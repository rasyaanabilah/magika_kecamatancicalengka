import { Application } from "../../types";

/**
 * Memunculkan inisial nama untuk avatar fallback
 */
export function getInitials(name: string): string {
  if (!name) return "C";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

/**
 * Ekspor data pendaftar terfilter ke berkas CSV (Excel)
 */
export function handleExportCSV(filteredApps: Application[]): void {
  if (filteredApps.length === 0) return;

  const headers = [
    "ID Pendaftaran",
    "Nama Lengkap",
    "Email",
    "Instansi Pendidikan",
    "No HP",
    "Status Pendaftaran",
  ];
  const rows = filteredApps.map((app) => [
    app.id,
    `"${app.namaLengkap}"`,
    `"${app.userEmail}"`,
    `"${app.instansiPendidikan ?? ""}"`,
    `"${app.noHp}"`,
    `"${app.status}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `rekap_pendaftaran_magika_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Cetak lembar rekapitulasi data pendaftar dalam bentuk jendela cetak HTML
 */
export function handlePrintRekap(filteredApps: Application[]): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Rekapitulasi Pendaftaran MAGIKA</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h2 { text-align: center; margin-bottom: 5px; }
          p.subtitle { text-align: center; font-size: 12px; color: #666; margin-top: 0; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .badge { padding: 3px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; text-align: center; }
          .lulus { background-color: #d1fae5; color: #065f46; }
          .ditolak { background-color: #ffe4e6; color: #9f1239; }
          .menunggu { background-color: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <h2>REKAPITULASI DATA PENDAFTAR MAGANG - KECAMATAN CICALENGKA</h2>
        <p class="subtitle">Dicetak pada: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Nama Lengkap</th>
              <th>Email / No HP</th>
              <th>Universitas / Instansi</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredApps
              .map(
                (app, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${app.id}</strong></td>
                <td>${app.namaLengkap}</td>
                <td>${app.userEmail}<br/><small>${app.noHp}</small></td>
                <td>${app.instansiPendidikan ?? "-"}</td>
                <td><span class="badge ${app.status === "Lulus" ? "lulus" : app.status === "Ditolak" ? "ditolak" : "menunggu"}">${app.status}</span></td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
