
// ===============================
// GENERATE DESKRIPSI PRODUK
// ===============================
function generateDeskripsi() {

    const namaProduk = document.getElementById("namaProduk").value.trim();
    const kategori = document.getElementById("kategori").value;
    const fitur = document.getElementById("fitur").value.trim();
    const harga = document.getElementById("harga").value.trim();
    const targetPasar = document.getElementById("targetPasar").value.trim();

    if (
        namaProduk === "" ||
        kategori === "" ||
        fitur === "" ||
        harga === "" ||
        targetPasar === ""
    ) {
        alert("Silakan lengkapi semua data!");
        return;
    }

    const hargaFormat = Number(harga).toLocaleString("id-ID");

    const deskripsi =
        namaProduk +
        " merupakan produk kategori " +
        kategori +
        " yang dirancang khusus untuk " +
        targetPasar +
        ". Produk ini memiliki berbagai keunggulan seperti " +
        fitur +
        ". Dengan kualitas terbaik dan desain modern, produk ini memberikan pengalaman penggunaan yang nyaman dan maksimal. Dengan harga Rp" +
        hargaFormat +
        ", produk ini menawarkan nilai yang sangat baik untuk kebutuhan sehari-hari. Segera miliki " +
        namaProduk +
        " sekarang juga dan rasakan manfaatnya.";

    document.getElementById("hasilDeskripsi").innerText = deskripsi;
}

// ===============================
// COPY HASIL DESKRIPSI
// ===============================
function copyDeskripsi() {

    const hasil =
        document.getElementById("hasilDeskripsi").innerText;

    if (
        hasil === "" ||
        hasil === "Deskripsi produk akan muncul di sini setelah tombol Generate ditekan."
    ) {
        alert("Belum ada deskripsi yang dapat disalin.");
        return;
    }

    navigator.clipboard.writeText(hasil);

    alert("Deskripsi berhasil disalin!");
}

// ===============================
// RESET FORM
// ===============================
function resetForm() {

    document.getElementById("namaProduk").value = "";
    document.getElementById("kategori").selectedIndex = 0;
    document.getElementById("fitur").value = "";
    document.getElementById("harga").value = "";
    document.getElementById("targetPasar").value = "";

    document.getElementById("hasilDeskripsi").innerText =
        "Deskripsi produk akan muncul di sini setelah tombol Generate ditekan.";
}

function simpanKeGoogleSheets() {

    const data = {
        namaProduk: document.getElementById("namaProduk").value,
        kategori: document.getElementById("kategori").value,
        fitur: document.getElementById("fitur").value,
        harga: document.getElementById("harga").value,
        targetPasar: document.getElementById("targetPasar").value,
        deskripsi: document.getElementById("hasilDeskripsi").innerText
    };

    fetch("https://script.google.com/macros/s/AKfycbwLoTmfX5z-C35IQ5Mf1PrWdGrBY3eV4FaieS00cMnzSOWbo-uBC8lsh_LSFcbSLc0j/exec", {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert("✅ Data berhasil disimpan ke Google Sheets!");
    })
    .catch(error => {
        console.error(error);
        alert("❌ Gagal menyimpan data.");
    });

}

