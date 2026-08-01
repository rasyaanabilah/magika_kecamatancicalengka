// @ts-ignore
import logoKabBandung from '../assets/images/logo_kab_bandung.png';
// @ts-ignore
import ttdCamat from '../assets/images/ttd_camat.png';
// @ts-ignore
import ttdUmpeg from '../assets/images/ttd_umpeg.png';
// @ts-ignore
import capStempel from '../assets/images/cap_stempel.png';

export interface PrintLetterOptions {
  tipeSurat?: 'balasan' | 'keterangan_magang';
  nomorSurat?: string;
  tanggalKeluar?: string;
  perihal?: string;
  sifat?: string;
  lampiran?: string;
  
  // Data Peserta / Penerima
  namaPeserta?: string;
  nimNisn?: string;
  prodiJurusan?: string;
  instansiPendidikan?: string;
  
  // Tanggal Magang (Khusus Surat Keterangan Magang)
  tanggalMulai?: string;
  tanggalSelesai?: string;
  
  // Data Pejabat Penandatangan
  penandatanganNama?: string;
  penandatanganNip?: string;
  penandatanganJabatan?: string;
  penandatanganInstansi?: string;
  penandatanganPangkat?: string;
  
  // Data Tambahan untuk Surat Balasan (Tipe A)
  kepadaJabatan?: string;
  kepadaInstansi?: string;
  tempat?: string;
  rujukanPengirim?: string;
  rujukanInstansi?: string;
  rujukanNo?: string;
  rujukanTgl?: string;
  rujukanPerihal?: string;
  isiSurat?: string;
  tembusan?: string;
  
  // Bulk peserta untuk Surat Balasan
  daftarPesertaSurat?: Array<{
    nama: string;
    nimNisn?: string;
    jurusan?: string;
    instansi?: string;
  }>;
  
  kategoriPendaftar?: string;
}

/**
 * Utility untuk melakukan pencetakan PDF / Pratinjau Cetak Surat Resmi Kecamatan Cicalengka
 */
export function printLetter(data: PrintLetterOptions) {
  const isKeteranganMagang = data.tipeSurat === 'keterangan_magang';

  if (isKeteranganMagang) {
    printSuratKeteranganMagang(data);
  } else {
    printSuratBalasan(data);
  }
}

/**
 * Function untuk cetak Tipe B: Surat Keterangan Magang Kerja
 */
function printSuratKeteranganMagang(data: PrintLetterOptions) {
  // Format nomor surat
  let rawNo = data.nomorSurat || '271';
  let formattedNo = rawNo;
  if (!rawNo.toLowerCase().includes('sekret') && !rawNo.includes('400.14')) {
    formattedNo = `400.14.5.4/ ${rawNo} /sekret`;
  }

  const tglTerbit = data.tanggalKeluar || '3 Agustus 2026';
  
  // Data Peserta
  const pesertaNama = data.namaPeserta || (data.daftarPesertaSurat && data.daftarPesertaSurat[0]?.nama) || 'Ahmad Lazuardi';
  const pesertaNim = data.nimNisn || (data.daftarPesertaSurat && data.daftarPesertaSurat[0]?.nimNisn) || '2201010045';
  const pesertaProdi = data.prodiJurusan || (data.daftarPesertaSurat && data.daftarPesertaSurat[0]?.jurusan) || 'Teknik Informatika';
  const pesertaInstansi = data.instansiPendidikan || (data.daftarPesertaSurat && data.daftarPesertaSurat[0]?.instansi) || "Universitas Ma'soem";
  
  // Data Tanggal Magang
  const tglMulai = data.tanggalMulai || '1 Juli 2026';
  const tglSelesai = data.tanggalSelesai || '31 Agustus 2026';

  // Data Pejabat Penandatangan (Default: Kasubag Umum dan Kepegawaian)
  const pNama = data.penandatanganNama || 'Neni Runingdiyah, S.Kom';
  const pNamaUpper = pNama.toUpperCase();
  const pNip = data.penandatanganNip || '19810924 201004 2 001';
  const pJabatan = data.penandatanganJabatan || 'Kasubag Umum dan Kepegawaian';
  const pInstansi = data.penandatanganInstansi || 'Kecamatan Cicalengka';
  const pPangkat = data.penandatanganPangkat || 'Penata Tk.I';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <base href="${window.location.origin}/" />
        <title>Surat Keterangan Magang Kerja - ${pesertaNama}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 1.4cm 1.8cm;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          .double-line {
            border-bottom: 3px double #000;
            margin-top: 6px;
            margin-bottom: 16px;
          }
          .kop-link {
            color: #0056b3 !important;
            text-decoration: underline !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @media print {
            body {
              padding: 1.4cm 1.8cm !important;
              background-color: #fff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .kop-link {
              color: #0056b3 !important;
              text-decoration: underline !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <div style="max-width: 800px; margin: auto;">
          <!-- KOP SURAT -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
            <tr>
              <td style="width: 15%; text-align: left; vertical-align: middle; padding-right: 4px;">
                <img src="${logoKabBandung}" alt="Logo Kabupaten Bandung" style="width: 80px; height: auto; display: block;" />
              </td>
              <td style="width: 85%; text-align: center; vertical-align: middle;">
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #000; line-height: 1.2;">PEMERINTAH KABUPATEN BANDUNG</div>
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 22pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #000; line-height: 1.1; margin: 2px 0;">KECAMATAN CICALENGKA</div>
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; font-weight: normal; color: #000; line-height: 1.3; margin-top: 2px;">
                  Jln. Raya Timur No. 344 Cicalengka Telp/Fax (022) 7949205 Kode Pos 40395
                </div>
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; font-weight: normal; color: #000; margin-top: 2px;">
                  Email : <span class="kop-link">kec.cicalengka@bandungkab.go.id</span> website : <span class="kop-link">kecamatancicalengka.bandungkab.go.id</span>
                </div>
              </td>
            </tr>
          </table>

          <div class="double-line"></div>

          <!-- JUDUL SURAT -->
          <div style="text-align: center; margin-top: 18px; margin-bottom: 22px;">
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; letter-spacing: 0.5px; color: #000;">
              SURAT KETERANGAN MAGANG KERJA
            </div>
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11pt; font-weight: bold; margin-top: 4px; color: #000;">
              Nomor: ${formattedNo}
            </div>
          </div>

          <!-- ISI SURAT -->
          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.6; color: #000;">
            <p style="margin-bottom: 8px;">Yang bertanda tangan dibawah ini :</p>
            
            <table style="width: 100%; font-size: 12px; margin-bottom: 14px; border-collapse: collapse; margin-left: 15px;">
              <tr>
                <td style="width: 25%; padding: 3px 0; vertical-align: top;">Nama</td>
                <td style="width: 3%; padding: 3px 0; vertical-align: top;">:</td>
                <td style="width: 72%; padding: 3px 0; vertical-align: top; font-weight: bold;">${pNama}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; vertical-align: top;">NIP</td>
                <td style="padding: 3px 0; vertical-align: top;">:</td>
                <td style="padding: 3px 0; vertical-align: top; font-family: monospace; font-weight: bold;">${pNip}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; vertical-align: top;">Jabatan</td>
                <td style="padding: 3px 0; vertical-align: top;">:</td>
                <td style="padding: 3px 0; vertical-align: top;">${pJabatan}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; vertical-align: top;">Instansi</td>
                <td style="padding: 3px 0; vertical-align: top;">:</td>
                <td style="padding: 3px 0; vertical-align: top;">${pInstansi}</td>
              </tr>
            </table>

            <p style="margin-bottom: 8px;">Dengan ini menerangkan Bahwa :</p>

            <table style="width: 100%; font-size: 12px; margin-bottom: 16px; border-collapse: collapse; margin-left: 15px;">
              <tr>
                <td style="width: 25%; padding: 3px 0; vertical-align: top;">Nama</td>
                <td style="width: 3%; padding: 3px 0; vertical-align: top;">:</td>
                <td style="width: 72%; padding: 3px 0; vertical-align: top; font-weight: bold;">${pesertaNama}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; vertical-align: top;">NIM / NISN</td>
                <td style="padding: 3px 0; vertical-align: top;">:</td>
                <td style="padding: 3px 0; vertical-align: top; font-family: monospace;">${pesertaNim}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; vertical-align: top;">Program Studi</td>
                <td style="padding: 3px 0; vertical-align: top;">:</td>
                <td style="padding: 3px 0; vertical-align: top;">${pesertaProdi}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; vertical-align: top;">Perguruan Tinggi</td>
                <td style="padding: 3px 0; vertical-align: top;">:</td>
                <td style="padding: 3px 0; vertical-align: top;">${pesertaInstansi}</td>
              </tr>
            </table>

            <p style="text-align: justify; text-indent: 40px; margin-bottom: 12px; line-height: 1.6;">
              Bahwa yang bersangkutan telah melaksanakan kegiatan MAGANG KERJA di Kecamatan Cicalengka terhitung mulai tanggal ${tglMulai} sampai dengan ${tglSelesai}. Selama mengikuti kegiatan magang, yang bersangkutan menunjukkan sikap yang baik, disiplin, dan mampu menyelesaikan tugas yang diberikan dengan sangat baik.
            </p>

            <p style="text-align: justify; text-indent: 40px; margin-bottom: 30px; line-height: 1.6;">
              Demikian surat keterangan ini kami buat untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          <!-- TANDA TANGAN -->
          <div style="margin-top: 20px;">
            <div style="float: right; width: 260px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 11.5px; line-height: 1.35;">
              <div>Cicalengka, ${tglTerbit}</div>
              <div style="font-weight: bold; margin-top: 3px; margin-bottom: 4px;">${pJabatan}</div>
              
              <div style="position: relative; width: 260px; height: 115px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <img src="${capStempel}" alt="Cap Stempel Resmi" style="position: absolute; left: 5px; top: -5px; width: 120px; height: 120px; object-fit: contain; opacity: 0.85; z-index: 1;" />
                <img src="${ttdUmpeg}" alt="Tanda Tangan Kasubag Umpeg" style="position: relative; width: 250px; height: 110px; object-fit: contain; z-index: 2;" />
              </div>

              <div style="font-weight: bold; font-size: 12px; text-transform: uppercase; margin-top: 4px;">
                <u>${pNamaUpper}</u>
              </div>
              <div style="font-size: 11px; margin-top: 2px;">${pPangkat}</div>
              <div style="font-size: 11px; font-family: monospace; font-weight: bold; margin-top: 1px;">
                NIP. ${pNip}
              </div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

/**
 * Function untuk cetak Tipe A: Surat Balasan Permohonan Magang
 */
function printSuratBalasan(data: PrintLetterOptions) {
  let list = data.daftarPesertaSurat || [];
  if (list.length === 0 && data.namaPeserta) {
    list = [{
      nama: data.namaPeserta,
      nimNisn: data.nimNisn || '-',
      jurusan: data.prodiJurusan || '-',
      instansi: data.instansiPendidikan || '-'
    }];
  }

  const sNo = data.nomorSurat || '400.14.5.4/270/Sekret';
  const sTgl = data.tanggalKeluar || '31 Maret 2026';
  const sLampiran = data.lampiran || '-';
  const sPerihal = data.perihal || 'Balasan Permohonan Izin Praktik Adaptasi Lapangan';
  const sSifat = data.sifat || 'Biasa';
  const sNama = data.penandatanganNama || 'CUCU HIDAYAT, S.H., M.M.';
  const sJabatan = data.penandatanganJabatan || 'CAMAT';
  const sNip = data.penandatanganNip || '19710731 199811 1 001';
  
  const sKepadaJabatan = data.kepadaJabatan || 'Dekan / Pimpinan';
  const sKepadaInstansi = data.kepadaInstansi || 'Instansi';
  const sTempat = data.tempat || 'Tempat';
  
  const rPengirim = data.rujukanPengirim || 'Dekan / Kepala Sekolah';
  const rInstansi = data.rujukanInstansi || 'Instansi';
  const rNo = data.rujukanNo || '267/FKOM-UM/III/2026';
  const rTgl = data.rujukanTgl || '30 Maret 2026';
  const rPerihal = data.rujukanPerihal || 'Izin Praktik Adaptasi Lapangan';
  
  const sIsi = data.isiSurat || 'Sehubungan hal tersebut, pada prinsipnya kami tidak berkeberatan yang bersangkutan Melakukan Praktik Adaptasi Lapangan terhitung tanggal 1 Juli 2026 Sampai 28 Juli 2026 sepanjang memenuhi persyaratan normatif, tidak bertentangan dengan peraturan perundang-undangan yang berlaku serta tidak mengganggu ketentraman dan ketertiban umum.';
  const sTembusanList = data.tembusan || '1. Kepala Badan Kesbangpol Kabupaten Bandung.';

  const studentRowsHtml = list.map((st, i) => `
    <tr>
      <td style="border: 1px solid #000; padding: 6px 10px; text-align: center;">${i + 1}</td>
      <td style="border: 1px solid #000; padding: 6px 10px; font-weight: bold;">${st.nama}</td>
      <td style="border: 1px solid #000; padding: 6px 10px; text-align: center; font-family: monospace;">${st.nimNisn || '-'}</td>
      <td style="border: 1px solid #000; padding: 6px 10px;">${st.jurusan || '-'}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <base href="${window.location.origin}/" />
        <title>Surat Balasan - ${sNo}</title>
        <style>
          @page { size: A4 portrait; margin: 0; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.45;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 1.4cm 1.8cm;
          }
          table { width: 100%; border-collapse: collapse; }
          .double-line { border-bottom: 3px double #000; margin-top: 6px; margin-bottom: 12px; }
          .indent { text-indent: 40px; text-align: justify; margin-top: 6px; margin-bottom: 6px; }
          .table-students th, .table-students td { border: 1px solid #000; padding: 4px 8px; }
          .table-students th { background-color: #f2f2f2; }
          .kop-link {
            color: #0056b3 !important;
            text-decoration: underline !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @media print {
            body {
              padding: 1.4cm 1.8cm !important;
              background-color: #fff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .kop-link {
              color: #0056b3 !important;
              text-decoration: underline !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <div style="max-width: 800px; margin: auto;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
            <tr>
              <td style="width: 15%; text-align: left; vertical-align: middle; padding-right: 4px;">
                <img src="${logoKabBandung}" alt="Logo Kabupaten Bandung" style="width: 80px; height: auto; display: block;" />
              </td>
              <td style="width: 85%; text-align: center; vertical-align: middle;">
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #000; line-height: 1.2;">PEMERINTAH KABUPATEN BANDUNG</div>
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 22pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #000; line-height: 1.1; margin: 2px 0;">KECAMATAN CICALENGKA</div>
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; font-weight: normal; color: #000; line-height: 1.3; margin-top: 2px;">
                  Jln. Raya Timur No. 344 Cicalengka Telp/Fax (022) 7949205 Kode Pos 40395
                </div>
                <div style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; font-weight: normal; color: #000; margin-top: 2px;">
                  Email : <span class="kop-link">kec.cicalengka@bandungkab.go.id</span> website : <span class="kop-link">kecamatancicalengka.bandungkab.go.id</span>
                </div>
              </td>
            </tr>
          </table>
          <div class="double-line"></div>
          <div style="text-align: right; font-size: 12px; margin-bottom: 6px;">Cicalengka, ${sTgl}</div>
          <table style="width: 100%; font-size: 12px; margin-bottom: 10px;">
            <tr><td style="width: 12%; vertical-align: top;">Nomor</td><td style="width: 2%; vertical-align: top;">:</td><td style="width: 46%; vertical-align: top; font-family: monospace; font-weight: bold;">${sNo}</td><td style="width: 40%;" rowspan="4"></td></tr>
            <tr><td style="vertical-align: top;">Sifat</td><td style="vertical-align: top;">:</td><td style="vertical-align: top;">${sSifat}</td></tr>
            <tr><td style="vertical-align: top;">Lampiran</td><td style="vertical-align: top;">:</td><td style="vertical-align: top;">${sLampiran}</td></tr>
            <tr><td style="vertical-align: top;">Perihal</td><td style="vertical-align: top;">:</td><td style="vertical-align: top;"><b>${sPerihal}</b></td></tr>
          </table>
          <div style="font-size: 12px; margin-bottom: 10px;">
            <div>Kepada Yth.</div>
            <div style="font-weight: bold;">${sKepadaJabatan}</div>
            <div style="font-weight: bold; text-transform: uppercase;">${sKepadaInstansi}</div>
            <div>di</div>
            <div style="text-decoration: underline; font-weight: bold; padding-left: 15px;">${sTempat}</div>
          </div>
          <p class="indent">Menindaklanjuti surat dari ${rPengirim} ${rInstansi} Nomor : ${rNo} tanggal ${rTgl} perihal : ${rPerihal}, atas nama :</p>
          <table class="table-students">
            <thead>
              <tr>
                <th style="width: 8%; text-align: center;">No</th>
                <th style="width: 42%;">Nama Mahasiswa / Siswa</th>
                <th style="width: 22%; text-align: center;">NIM / NISN</th>
                <th style="width: 28%;">Program Studi / Jurusan</th>
              </tr>
            </thead>
            <tbody>${studentRowsHtml}</tbody>
          </table>
          <p class="indent">${sIsi}</p>
          <p class="indent">Demikian agar menjadi maklum, atas perhatian dan kerjasamanya kami haturkan terima kasih.</p>
          <div style="margin-top: 15px;">
            <div style="float: right; width: 260px; text-align: center; font-size: 11.5px; line-height: 1.35; margin-bottom: 15px;">
              <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">${sJabatan}</div>
              
              <div style="position: relative; width: 260px; height: 115px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <img src="${capStempel}" alt="Cap Stempel Resmi" style="position: absolute; left: 5px; top: -5px; width: 120px; height: 120px; object-fit: contain; opacity: 0.85; z-index: 1;" />
                <img src="${ttdCamat}" alt="Tanda Tangan Camat" style="position: relative; width: 250px; height: 110px; object-fit: contain; z-index: 2;" />
              </div>

              <div style="font-weight: bold; font-size: 12px; margin-top: 4px; text-transform: uppercase;"><u>${sNama}</u></div>
              <div style="font-size: 11px; margin-top: 2px;">Pembina Tk. I</div>
              <div style="font-size: 11px; font-family: monospace; font-weight: bold;">NIP. ${sNip}</div>
            </div>
            <div style="clear: both;"></div>
            <div style="margin-top: 10px; font-size: 10px; text-align: left; line-height: 1.35; max-width: 400px;">
              <div style="font-weight: bold; border-top: 1px solid #000; padding-top: 4px; display: inline-block; margin-bottom: 2px;">Tembusan disampaikan kepada Yth. :</div>
              <div style="white-space: pre-line; padding-left: 4px;">${sTembusanList}</div>
            </div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
