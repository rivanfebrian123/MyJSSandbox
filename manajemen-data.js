/* manajemen-data.js
 *
 * Copyright 2021 De Warunk Team <rivanfebrian123@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Modul tentang "templat" kelas Data dan keturunan2nya yang digunakan di
 * kelas Manajemen/Sesi<br><br>
 *
 * PERHATIAN:<br>
 * Setiap tipe/kelas di sini wajib mewarisi kelas "Data" dan
 * semua constructor itu wajib memiliki parameter "daftarData" yang berupa
 * list data hasil parse dari fungsi tanyaDataItem(kodePertanyaan) di fungsi
 * tambahItem() di kelas Sesi<br><br>
 *
 * Jangan lupa juga untuk memanggil "super(daftarData)" dalam constructor2 itu.
 * Omong2, indeks dimulai dari 2 karena index 0 dan satu sudah dipakai untuk
 * "kode" dan "nama"<br><br>
 *
 * Daftar pertanyaan berupa list dengan indeks sesuai dengan nama variabel
 * yang bersangkutan. Isi pertanyaan berformat: TIPE|Isi<br><br>
 *
 * Setiap daftarPertanyaan di sini tidak perlu menanyakan kode, karena itu adalah
 * urusan Sesi<br><br>
 *
 * Kelas2 di sini menggunakan duplikasi data untuk transaksi karena kita
 * tidak menggunakan server SQL dan jika kita menggunakan referensi kelas aslinya
 * pada daftar item, nanti data akan ikut berubah pada riwayat item jika kita
 * mengubah aslinya
 *
 * @module de-warunk/manajemen-data
 */

import clear from 'console-clear'

import {
    jeda,
    tampilkanJudul
} from './utilitas.js'

/**
 * "Templat" kelas2 yang digunakan oleh masing2 sesi (Member, Promo, dan Jualan)
 * di Manajemen
 */
class Data {
    kode
    nama
    daftarData

    /**
     * Membuat instansi Data
     *
     * @param {TipeApaAja[]} daftarData - Daftar data hasil parse
     *     "tanyaDataItem(kodePertanyaan)"
     */
    constructor(daftarData) {
        this.daftarData = daftarData
        this.kode = daftarData[0]
        this.nama = daftarData[1]
    }

    /**
     * "Templat" fungsi yang wajib ada untuk digunakan di suatu Sesi.<br>
     * Fungsi ini digunakan untuk menampilkan info suatu kelas keturunan kelas
     * ini, misal Member
     */
    tampilkanInfo() {
        throw new Error("Fungsi 'tampilkanInfo()' harus diimplementasikan")
    }

    /**
     * "Templat" fungsi yang wajib ada untuk digunakan di suatu Sesi.<br>
     * Fungsi ini digunakan untuk membuat instansi baru dengan data yang sama.
     * Fungsi ini hanya digunakan pada keturunan2 kelas ini
     */
    duplikat() {
        throw new Error("Fungsi 'duplikat()' harus diimplementasikan")
    }
}

export let daftarPertanyaanMember = []
daftarPertanyaanMember["nama"] = "STR|Nama member: "
daftarPertanyaanMember["noWA"] = "STR|No. WA: "

/**
 * Kelas untuk menyimpan dan mengolah data member.
 *
 * @extends Data
 */
export class Member extends Data {
    noWA
    poin
    riwayatTransaksi = []
    daftarPromoDiklaim = []

    /**
     * Membuat instansi Member
     *
     * @param {TipeApaAja[]} daftarData - Daftar data hasil parse
     *     "tanyaDataItem(kodePertanyaan)"
     */
    constructor(daftarData) {
        super(daftarData)
        this.noWA = daftarData[2]
        this.poin = 0
    }

    /**
     * Membuat instansi kelas Member baru dengan data yang sama dengan
     * instansi kelas ini
     *
     * @return {Member} Member baru dengan data yang sama dengan instansi
     *     kelas ini
     */
    duplikat() {
        return new Member(this.daftarData)
    }

    /** Tampilkan info member */
    tampilkanInfo() {
        console.log(`| ${this.kode}  -  ${this.nama}  -  ${this.poin} poin`)
        console.log(`| No. WA: ${this.noWA}`)
    }

    /** Menghapus klaim promo kadaluarsa */
    bersihkanKlaimPromoLama() {
        let waktu = new Date()

        for (const kode in this.daftarPromoDiklaim) {
            if (this.daftarPromoDiklaim[kode].batasAkhir < waktu) {
                delete this.daftarPromoDiklaim[kode]
            }
        }
    }

    /**
     * Membersihkan riwayat transaksi kadaluarsa / paling dahulu
     * (jumlah melebihi 25)
     */
    bersihkanRiwayatTransaksiLama() {
        let banyak = this.riwayatTransaksi.length
        let sisa

        if (banyak > 25) {
            sisa = banyak - 25

            for (let i = 1; i <= sisa; i++) {
                this.riwayatTransaksi.shift()
            }
        }
    }

    /** Tampilkan riwayat transaksi member */
    tampilkanRiwayatTransaksi() {
        let n = 0

        tampilkanJudul(`Riwayat transaksi si ${this.nama}`)
        console.log("")

        this.bersihkanRiwayatTransaksiLama()
        n = 0

        for (const i in this.riwayatTransaksi) {
            this.riwayatTransaksi[i].tampilkanPerbarui(false, false)
            console.log("")
            n++
        }

        if (n == 0) {
            tampilkanJudul("(Belum ada riwayat transaksi)", "pemberitahuanGagal", null, " ")
            console.log("")
        }

        jeda()
    }
}

export let daftarPertanyaanPromo = []
daftarPertanyaanPromo["nama"] = "STR|Nama promo/hadiah: "
daftarPertanyaanPromo["poinDiharapkan"] = "INT|Poin diharapkan: "
daftarPertanyaanPromo["batasAkhir"] = "DATE|Batas akhir (TTTT/BB/HH): "
daftarPertanyaanPromo["syaratTambahan"] = "STR|Syarat tambahan (ketik '-' jika tiada): "

/**
 * Kelas untuk menyimpan dan mengolah data promo.
 *
 * @extends Data
 */
export class Promo extends Data {
    poinDiharapkan
    batasAkhir
    syaratTambahan

    /**
     * Membuat instansi Promo
     *
     * @param {TipeApaAja[]} daftarData - Daftar data hasil parse
     *     "tanyaDataItem(kodePertanyaan)"
     */
    constructor(daftarData) {
        super(daftarData)
        this.poinDiharapkan = daftarData[2]
        this.batasAkhir = daftarData[3]

        if (!daftarData[4] || daftarData[4] == "-") {
            this.syaratTambahan = null
        } else {
            this.syaratTambahan = daftarData[4]
        }
    }

    /**
     * Membuat instansi kelas Promo baru dengan data yang sama dengan instansi
     * kelas ini
     *
     * @return {Promo} Promo baru dengan data yang sama dengan instansi kelas ini
     */
    duplikat() {
        return new Promo(this.daftarData)
    }

    /** Tampilkan info promo */
    tampilkanInfo() {
        console.log(`| ${this.kode}  -  ${this.nama}`)
        console.log(`| Poin diharapkan: ${this.poinDiharapkan}`)
        console.log(`| Batas waktu akhir: ${this.batasAkhir.toLocaleString("id-ID")}`)

        if (this.syaratTambahan) {
            console.log(`| Syarat tambahan: ${this.syaratTambahan}`)
        }
    }
}

export let daftarPertanyaanJualan = []
daftarPertanyaanJualan["nama"] = "STR|Nama jualan: "
daftarPertanyaanJualan["biayaProduksi"] = "INT|Biaya produksi per hari (Rp.): "
daftarPertanyaanJualan["lamaProduksi"] = "INT|Lama produksi per hari (jam): "
daftarPertanyaanJualan["hargaJual"] = "INT|Harga jual satuan (Rp.): "
daftarPertanyaanJualan["persenDiskon"] = "INT|Persen diskon (%): "

/**
 * Kelas untuk menyimpan dan mengolah data jualan.
 *
 * @extends Data
 */
export class Jualan extends Data {
    biayaProduksi
    lamaProduksi
    hargaJual
    persenDiskon

    /** Membuat instansi Jualan
     *
     * @param {TipeApaAja[]} daftarData - Daftar data hasil parse
     *     "tanyaDataItem(kodePertanyaan)"
     */
    constructor(daftarData) {
        super(daftarData)
        this.biayaProduksi = daftarData[2]
        this.lamaProduksi = daftarData[3]
        this.hargaJual = daftarData[4]
        this.persenDiskon = daftarData[5]
    }

    /**
     * Membuat instansi kelas Jualan baru dengan data yang sama dengan
     * instansi kelas ini
     *
     * @return {Jualan} Jualan baru dengan data yang sama dengan instansi kelas ini
     */
    duplikat() {
        return new Jualan(this.daftarData)
    }

    /** Tampilkan info jualan */
    tampilkanInfo() {
        console.log(`| ${this.kode}  -  ${this.nama}`)
        console.log(`| Harga jual satuan: Rp.${this.hargaJual}    Diskon: ${this.persenDiskon}% (Rp.${this.hargaJual * this.persenDiskon / 100})`)
        console.log(`| Biaya produksi: Rp.${this.biayaProduksi}/hari    Lama produksi: ${this.lamaProduksi} jam/hari`)
    }
}