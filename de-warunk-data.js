import input from 'readline-sync'
import clear from 'console-clear'

//TODO input non case sansitive

export function konfirmasi(judul = "") {
    let lanjut
    let jawaban = false

    do {
        if (judul != "") {
            console.log("==========================")
            console.log(judul)
            console.log("==========================")
        }

        lanjut = input.question("Lanjutkan (YA/BATAL): ").toLowerCase()
        console.log("")
    } while ((lanjut != "ya") && (lanjut != "batal"))

    if (lanjut == "ya") {
        jawaban = true
    }

    return jawaban
}

export class Member {
    kode
    nama
    noWA
    poin
    riwayatTransaksi = []

    constructor(kode, nama, noWA, poin) {
        this.kode = kode
        this.nama = nama
        this.noWA = noWA
        this.poin = poin
    }
}


export class Sesi {
    daftarMember
    valid
    member
    tag

    constructor(daftarMember) {
        this.daftarMember = daftarMember
        this.valid = false
        this.tag = ""
    }

    aktifkanCek(kondisiUlangi = "tidak", pertanyaan = "Kode member: ", cekSaja = false) {
        let hasil
        let ulangi

        do {
            console.log("X. Batal")
            console.log("------------------------------")
            this.tag = input.question(pertanyaan)

            if (this.tag.toLowerCase() == "x") {
                hasil = "batal"
            } else if (typeof this.daftarMember[this.tag] == "undefined") {
                hasil = "tiada"

                if (!cekSaja) {
                    this.valid = false
                }
            } else {
                hasil = "ada"

                if (!cekSaja) {
                    this.valid = true
                    this.member = this.daftarMember[this.tag]
                }
            }

            if (hasil == "ada" && kondisiUlangi == "jikaAda") {
                ulangi = true
                console.log("\n==Kode member sudah digunakan, silakan coba lagi==\n")
                console.log("==============================")
            } else if (hasil == "tiada" && kondisiUlangi == "jikaTiada") {
                ulangi = true
                console.log("\n==Kode member tidak ditemukan, coba lagi==\n")
                console.log("==============================")
            } else {
                ulangi = false
            }
        } while (ulangi)

        return hasil
    }

    nonaktifkan(hapusDaftarMember = false) {
        if (hapusDaftarMember) {
            this.daftarMember = false
        }

        this.member = false
        this.tag = ""
        this.valid = false
    }

    ubahKodeMember() {
        if (!this.valid) {
            this.aktifkanCek("jikaTiada")
        }

        if (this.valid) {
            console.log("===Ubah kode member===")

            let kodeLama = this.member.kode
            let status = this.aktifkanCek("jikaAda", "Kode member baru: ", true)

            if (status == "tiada") {
                this.member.kode = this.tag
                this.daftarMember[this.tag] = this.member
                delete this.daftarMember[kodeLama]
            }

            clear()
            console.log("===Kode member berhasil diubah===\n\n")
        }
    }

    ubahNamaMember() {
        if (!this.valid) {
            this.aktifkanCek("jikaTiada")
        }

        if (this.valid) {
            console.log("===Ubah nama===")
            this.member.nama = input.question("Nama baru: ")

            clear()
            console.log("===Nama berhasil diubah===\n\n")
        }
    }

    ubahNoWAMember() {
        if (!this.valid) {
            this.aktifkanCek("jikaTiada")
        }

        if (this.valid) {
            console.log("===Ubah no. WA===")
            this.member.noWA = input.question("No. WA baru: ")

            clear()
            console.log("===No. WA berhasil diubah===\n\n")
        }
    }

    tambahMember() {
        console.log("=================")
        console.log("Tambah member")
        console.log("=================")

        let status = this.aktifkanCek("jikaAda")

        if (status == "tiada") {
            let nama = input.question("Nama: ")

            if (nama.toLowerCase() != "x") {
                let noWA = input.question("No. WA: ")

                if (noWA.toLowerCase() != "x") {
                    this.daftarMember[this.tag] = new Member(this.tag, nama, noWA, 0)
                    clear()
                    console.log("====Member berhasil ditambah====\n\n")
                } else {
                    clear()
                }
            } else {
                clear()
            }
        } else {
            clear()
        }
    }

    hapusMember() {
        if (!this.valid) {
            this.aktifkanCek("jikaTiada")
        }

        if (this.valid) {
            if (konfirmasi("Hapus member")) {
                let notif = `===Member "${this.member.nama}" (${this.member.kode}) berhasil dihapus===\n\n`
                delete this.daftarMember[this.member.kode]
                this.nonaktifkan()

                clear()
                console.log(notif)
            } else {
                clear()
            }
        }
    }
}


export class ItemJualan {
    kode
    nama
    biayaProduksi
    lamaProduksi
    hargaJual
    persenDiskon

    constructor(kode, nama, biayaProduksi, lamaProduksi, hargaJual, persenDiskon) {
        this.kode = kode
        this.nama = nama
        this.biayaProduksi = biayaProduksi
        this.lamaProduksi = lamaProduksi
        this.hargaJual = hargaJual
        this.persenDiskon = persenDiskon
    }
}


export class Jualan {
    daftarJualan = []

    tampilkan() {
        console.log("==========================")
        console.log("Jualanku")
        console.log("==========================")
        console.log("No\t\tKode\t\tNama\t\tBiaya produksi\t\tLama produksi\t\tHarga jual\t\tPersen diskon")
        console.log("------------------------------------------------------------------------------------------")

        for (const [i, item] of this.daftarJualan.entries()) {
            console.log(`${i}\t\t${item.kode}\t\t${item.nama}\t\t${item.biayaProduksi}\t\t${item.lamaProduksi}\t\t${item.hargaJual}\t\t${item.persenDiskon}`)
        }
    }

    tambahJualan() {

    }
}


export class ItemTransaksi {
    itemJualan
    banyak
    totalDiskon
    totalHarga

    constructor(itemJualan, banyak, totalDiskon, totalHarga) {
        this.itemJualan = itemJualan
        this.banyak = banyak
        this.totalDiskon = totalDiskon
        this.totalHarga = totalHarga
    }
}


export class Transaksi {
    // istilah "item" di sini adalah item dari kelas ini, sedangkan "itemJualan"
    // adalah item dari kelas Jualan
    waktu
    daftarItem = []
    jualan
    sesi
    totalBelanja = 0
    poin

    constructor(jualan, sesi) {
        this.waktu = new Date()
        this.jualan = jualan
        this.sesi = sesi
    }

    hitungTotalDiskonHarga(itemJualan, banyak, i = 0) {
        let totalDiskon = itemJualan.hargaJual * itemJualan.persenDiskon / 100
        let totalHarga = (itemJualan.hargaJual - totalDiskon) * banyak

        if (i != -1) {
            let notif = `${itemJualan.nama}`

            if (i >= 1) {
                notif = `${i}. ` + notif

                if (notif.length < 8) {
                    notif += "\t\t"
                } else if (notif.length < 16) {
                    notif += "\t"
                }
            }

            notif += `\tRp.${itemJualan.hargaJual} (diskon Rp.${totalDiskon}) x ${banyak} = Rp.${totalHarga}`

            console.log(notif)
        }

        return [totalDiskon, totalHarga]
    }

    tampilkan(tampilkanItemBelumDibeli) {
        let i = 1
        let iAsli = [""]
        let totalBelanja = 0

        if (tampilkanItemBelumDibeli) {
            console.log("---------Item2 belum dibeli-----------")
            for (const kode in this.jualan.daftarJualan) {
                if ((typeof kode != "undefined") && (typeof this.daftarItem[kode] == "undefined")) {
                    this.hitungTotalDiskonHarga(this.jualan.daftarJualan[kode], 0, i)
                    iAsli[i] = kode
                    i++
                }
            }
        }

        console.log("---------Item2 sudah dibeli-----------")
        for (const kode in this.daftarItem) {
            if (typeof kode != "undefined") {
                let item = this.daftarItem[kode]

                let totalDiskonHarga = this.hitungTotalDiskonHarga(item.itemJualan, item.banyak, i)
                item.totalDiskon = totalDiskonHarga[0]
                item.totalHarga = totalDiskonHarga[1]

                totalBelanja += item.totalHarga
                iAsli[i] = item.itemJualan.kode
                i++
            }
        }

        console.log("--------------------------------------")
        console.log("0. Kembali")
        console.log("--------------------------------------")
        console.log(`===Total belanja kamu: Rp.${totalBelanja}===`)
        console.log(`===Poin belanja kamu: ${parseInt(totalBelanja/1000/2)}===\n`)

        return iAsli
    }

    tambahItem() {
        console.log("======================================")
        console.log("Tambah item")
        console.log("======================================")
        let iAsli = this.tampilkan(true)

        let banyak
        let menu = parseInt(input.question("Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.jualan.daftarJualan[kodeItem]

        if (menu == 0) {
            clear()
        } else if (typeof itemJualan != "undefined") {
            banyak = parseInt(input.question("Banyaknya yang ditambahkan: "))
            clear()

            if (banyak > 0) {
                let totalDiskonHarga

                if (typeof this.daftarItem[kodeItem] == "undefined") {
                    console.log("-------------Item baru------------")
                    totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak)
                    this.daftarItem[kodeItem] = new ItemTransaksi(itemJualan, banyak, totalDiskonHarga[0], totalDiskonHarga[1])
                } else {
                    let item = this.daftarItem[kodeItem]

                    console.log("--------------Dari----------------")
                    totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                    item.banyak += banyak
                    item.totalDiskon += totalDiskonHarga[0]
                    item.totalHarga += totalDiskonHarga[1]

                    console.log("-------------Menjadi--------------")
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                }

                console.log("====Item berhasil ditambahkan====\n\n")
            }

            this.tambahItem()
        } else {
            clear()
            this.tambahItem()
        }
    }

    kurangiItem() {
        console.log("=====================")
        console.log("Kurangi item")
        console.log("=====================")
        let iAsli = this.tampilkan(false)

        let banyak
        let menu = parseInt(input.question("Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.jualan.daftarJualan[kodeItem]

        if (menu == 0) {
            clear()
        } else if ((typeof itemJualan != "undefined") && (typeof this.daftarItem[kodeItem] != "undefined")) {
            let item = this.daftarItem[kodeItem]
            banyak = parseInt(input.question("Banyaknya yang dikurangi: "))
            clear()

            if ((banyak > 0) && (banyak < item.banyak)) {
                console.log("--------------Dari----------------")
                let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                item.banyak -= banyak
                item.totalDiskon -= totalDiskonHarga[0]
                item.totalHarga -= totalDiskonHarga[1]

                console.log("-------------Menjadi--------------")
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                console.log("====Item berhasil dikurangi====\n\n")
            } else if (banyak >= item.banyak) {
                delete this.daftarItem[kodeItem]
                console.log(`====Item ${itemJualan.nama} (${itemJualan.kode}) berhasil dihapus====\n\n`)
            }

            this.kurangiItem()
        } else {
            clear()
            this.kurangiItem()
        }
    }

    prosesCetak() {
        let lanjut

        console.log("==========================")
        console.log("Proses dan cetak transaksi")
        console.log("==========================")
        this.tampilkan(false)

        if (konfirmasi()) {
            this.sesi.member.riwayatTransaksi.push(this)
            this.sesi.nonaktifkan()

            clear()
            console.log("====Transaksi berhasil diproses====\n\n")
        } else {
            clear()
        }
    }

    batalkan() {
        let jadi = false
        let lanjut

        if (konfirmasi("Batalkan transaksi")) {
            jadi = true
            this.sesi.nonaktifkan()

            clear()
            console.log("====Transaksi dibatalkan====\n\n")
        } else {
            clear()
        }

        return jadi
    }
}
