import input from 'readline-sync'
import clear from 'console-clear'
import {
    Member,
    Sesi,
    Jualan,
    ItemJualan,
    Transaksi
} from './de-warunk-data.js'


class DWTransaksi {
    sesi
    jualan
    transaksi

    constructor(sesi, jualan) {
        this.sesi = sesi
        this.jualan = jualan
    }

    mulai() {
        //TODO
        if (!this.sesi.valid) {
            console.log("====Transaksi baru===")
            let status = this.sesi.aktifkan("==Kode member tidak ditemukan, coba lagi==", "jikaTiada")

            if (status == "ada") {
                this.transaksi = new Transaksi(this.jualan)
            }
        }

        if (this.sesi.valid) {

            console.log(`==Eh, si ${this.sesi.member.nama} balik lagi!==`)
            console.log("=====================")
            console.log("Transaksi baru")
            console.log("=====================")
            console.log("1. Tambah item")
            console.log("2. Kurangi item")
            console.log("3. Proses dan cetak transaksi")
            console.log("4. Cek poin dan promo")
            console.log("X. Batalkan transaksi")

            let menu = input.question("Pilih menu: ")
            clear()

            switch (menu) {
            case "1":
                this.transaksi.tambahItem()
                break
            case "2":
                this.transaksi.kurangiItem()
                break
            case "3":
                this.transaksi.prosesCetak()
                this.sesi.member.riwayatTransaksi.push(this.transaksi)
                delete this.transaksi
                this.sesi.nonaktifkan()
                break
            case "4":
                break
            case "X":
                delete this.transaksi
                this.sesi.nonaktifkan()
                break
            }

            if (menu != "X") {
                this.mulai()
            }
        }
    }
}


class DWMember {
    sesi

    constructor(sesi) {
        this.sesi = sesi
    }

    mulai() {
        console.log("===================")
        console.log("Member")
        console.log("===================")
        console.log("1. Tambah member")
        console.log("2. Edit / hapus member")
        console.log("3. Cek poin dan promo member")
        console.log("4. Cek riwayat transaksi member")
        console.log("5. Lihat semua daftar member")
        console.log("0. Kembali")

        let menu = input.question("Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.sesi.tambahMember()
            break
        case "2":
            this.sesi.nonaktifkan()
            this.editMember()
            break
        case "3":
            this.sesi.cekPoinPromoMember()
            break
        }

        if (menu != "0") {
            this.mulai()
        }
    }

    editMember() {
        if (!this.sesi.valid) {
            console.log("===Edit / hapus member===")
            this.sesi.aktifkan("==Member tidak ditemukan, coba lagi==", "jikaTiada")
        }

        if (this.sesi.valid) {
            console.log("=====================")
            console.log("Edit / hapus member")
            console.log("=====================")
            console.log(`1. Ubah kode member (${this.sesi.member.kode})`)
            console.log(`2. Ubah nama (${this.sesi.member.nama})`)
            console.log(`3. Ubah no. WA (${this.sesi.member.noWA})`)
            console.log(`4. Hapus member (${this.sesi.member.kode}. ${this.sesi.member.nama})`)
            console.log("0. Kembali")

            let notif = ""
            let menu = input.question("Pilih menu: ")

            switch (menu) {
            case "1":
                this.sesi.ubahKodeMember()
                break
            case "2":
                this.sesi.ubahNamaMember()
                break
            case "3":
                this.sesi.ubahNoWAMember()
                break
            case "4":
                this.sesi.hapusMember()
                break
            case "0":
                this.sesi.nonaktifkan()
                break
            }

            clear()

            if (menu != "0") {
                this.editMember()
            }
        }
    }
}


class DeWarunk {
    dwTransaksi
    dwMember

    daftarMember = []
    jualan = []
    sesi
    transaksi

    constructor() {
        this.daftarMember["RV"] = new Member("RV", "Rivan", "087767777733", 30)

        this.sesi = new Sesi(this.daftarMember)
        this.sesi.nonaktifkan()

        this.jualan = new Jualan()
        this.jualan.daftarJualan["KJ"] = new ItemJualan(
            "KJ", "Kopi Jahe", 50000, 2, 4000, 10)
        this.jualan.daftarJualan["SB"] = new ItemJualan(
            "SB", "Kopi Starbak", 70000, 2, 30000, 5)
        this.jualan.daftarJualan["WJ"] = new ItemJualan(
            "WJ", "Wedang Jahe", 30000, 2, 2000, 0)
        this.dwTransaksi = new DWTransaksi(this.sesi, this.jualan)
        this.dwMember = new DWMember(this.sesi)
    }

    mulai() {
        console.log("=====================")
        console.log("DeWarunk - Kafe Gen-Z")
        console.log("=====================")
        console.log("1. Transaksi")
        console.log("2. Member")
        console.log("3. Jualan")
        console.log("0. Keluar")

        let menu = input.question("Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.dwTransaksi.mulai(this.sesi)
            break
        case "2":
            this.dwMember.mulai()
            break
        }

        if (menu != "0") {
            this.mulai()
        }
    }
}


const apl = new DeWarunk()
clear()
apl.mulai()
