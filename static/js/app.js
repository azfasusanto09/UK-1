// ============================================================
// DATA CIPHER
// ============================================================

const CIPHERS = [

    {
        id: "shift",
        name: "Shift",
        description: "Geser huruf",
        hint: "Satu bilangan bulat k. Contoh: 3",
        example: "3"
    },

    {
        id: "substitution",
        name: "Substitution",
        description: "Tukar 26 huruf",
        hint: "Kata kunci atau 26 huruf permutasi. Huruf sisa disusun berurutan.",
        example: "QWERTYUIOPASDFGHJKLZXCVBNM"
    },

    {
        id: "affine",
        name: "Affine",
        description: "C = aP + b",
        hint: "Dua bilangan a,b dengan a relatif prima terhadap 26. Contoh: 5,8",
        example: "5,8"
    },

    {
        id: "vigenere",
        name: "Vigenere",
        description: "Kunci berulang",
        hint: "Kata kunci bebas panjang, hanya huruf yang dipakai.",
        example: "SECRET"
    },

    {
        id: "hill",
        name: "Hill",
        description: "Matriks n x n",
        hint: "n*n bilangan atau huruf. Matriks harus punya balikan. Contoh 3x3: GYBNQKURP",
        example: "GYBNQKURP"
    },

    {
        id: "permutation",
        name: "Permutation",
        description: "Acak posisi",
        hint: "Urutan angka (3 1 4 2) atau kata kunci (ZEBRA).",
        example: "3 1 4 2"
    },

    {
        id: "otp",
        name: "One-Time Pad",
        description: "Kunci sekali pakai",
        hint: "",
        example: ""
    }

];


// ============================================================
// STATE APLIKASI
// ============================================================

const STATE = {

    cipher: "shift",

    mode: "encrypt",

    inputType: "text",

    lastResult: "",

    url: "",

    filename: "",

    blob: null

};


// ============================================================
// HELPER
// ============================================================

const $ = (id) => {

    return document.getElementById(id);

};


function currentCipher() {

    return CIPHERS.find(

        cipher => cipher.id === STATE.cipher

    );

}


// ============================================================
// MEMBUAT TAB CIPHER
// ============================================================

const tabs = $("tabs");

CIPHERS.forEach(cipher => {

    const button =
        document.createElement("button");

    button.className = "tab";

    button.dataset.id = cipher.id;

    button.innerHTML = `
        <b>${cipher.name}</b>
        <span>${cipher.description}</span>
    `;

    button.onclick = () => {

        STATE.cipher = cipher.id;

        updateUI();

    };

    tabs.appendChild(button);

});


// ============================================================
// MODE ENKRIPSI / DEKRIPSI
// ============================================================

function setupSegment(id, stateKey) {

    $(id).onclick = (event) => {

        if (!event.target.dataset.v) {

            return;

        }

        STATE[stateKey] =
            event.target.dataset.v;

        updateUI();

    };

}


setupSegment("segMode", "mode");

setupSegment("segType", "inputType");


// ============================================================
// UPDATE UI
// ============================================================

function updateUI() {

    const cipher =
        currentCipher();

    const encrypt =
        STATE.mode === "encrypt";

    const fileMode =
        STATE.inputType === "file";


    // TAB CIPHER

    document
        .querySelectorAll(".tab")
        .forEach(button => {

            button.classList.toggle(

                "on",

                button.dataset.id === STATE.cipher

            );

        });


    // MODE ENKRIPSI / DEKRIPSI

    document
        .querySelectorAll("#segMode button")
        .forEach(button => {

            button.classList.toggle(

                "on",

                button.dataset.v === STATE.mode

            );

        });


    // MODE TEKS / FILE

    document
        .querySelectorAll("#segType button")
        .forEach(button => {

            button.classList.toggle(

                "on",

                button.dataset.v === STATE.inputType

            );

        });


    // INFORMASI KUNCI

    $("khint").textContent =

        cipher.hint +

        (

            fileMode &&
            STATE.cipher !== "otp"

                ? " (Mode file memakai 256 nilai byte.)"

                : ""

        );


    // TAMPILKAN KUNCI

    $("keybox").classList.toggle(

        "hide",

        STATE.cipher === "otp"

    );


    $("otpbox").classList.toggle(

        "hide",

        STATE.cipher !== "otp"

    );


    // INPUT TEKS / FILE

    $("text").classList.toggle(

        "hide",

        fileMode

    );


    $("drop").classList.toggle(

        "hide",

        !fileMode

    );


    $("cnt").classList.toggle(

        "hide",

        fileMode

    );


    // JUDUL INPUT

    if (fileMode) {

        $("inTitle").textContent =

            encrypt

                ? "File asli"

                : "File terenkripsi (.dat)";

    }

    else {

        $("inTitle").textContent =

            encrypt

                ? "Plainteks"

                : "Cipherteks";

    }


    // JUDUL OUTPUT

    if (fileMode) {

        $("outTitle").textContent =
            "Hasil file";

    }

    else {

        $("outTitle").textContent =

            encrypt

                ? "Cipherteks"

                : "Plainteks";

    }


    // PILIHAN KELOMPOK HURUF

    $("group").classList.toggle(

        "hide",

        !(encrypt && !fileMode)

    );


    // TOMBOL OUTPUT

    $("oacts").classList.toggle(

        "hide",

        fileMode

    );


    // TOMBOL UTAMA

    $("go").textContent =

        encrypt

            ? "Enkripsi"

            : "Dekripsi";


    updateAlphabetStrip();

    updateCount();

    showCipherInfo();

}


// ============================================================
// ISI CONTOH KUNCI
// ============================================================

function fillExample() {

    $("key").value =
        currentCipher().example;

    updateAlphabetStrip();

}


// ============================================================
// HITUNG JUMLAH HURUF
// ============================================================

function updateCount() {

    const text =
        $("text").value;

    const total =
        (text.match(/[a-zA-Z]/g) || []).length;

    $("cnt").textContent =
        `${total} huruf diproses (angka dan simbol diabaikan)`;

}


// ============================================================
// GCD
// ============================================================

function gcd(a, b) {

    return b

        ? gcd(b, a % b)

        : Math.abs(a);

}


// ============================================================
// ALPHABET STRIP
// ============================================================

function updateAlphabetStrip() {

    const element =
        $("strip");

    const key =
        $("key").value;

    const cipher =
        STATE.cipher;

    let encryptFunction = null;


    // SHIFT

    if (

        STATE.inputType === "text" &&

        cipher === "shift"

    ) {

        const match =
            key.match(/-?\d+/);

        if (match) {

            const shift =
                Number(match[0]);

            encryptFunction =

                (i) =>

                    (
                        (i + shift) % 26 + 26
                    ) % 26;

        }

    }


    // AFFINE

    else if (

        STATE.inputType === "text" &&

        cipher === "affine"

    ) {

        const numbers =
            key.match(/-?\d+/g);

        if (

            numbers &&

            numbers.length > 1 &&

            gcd(Number(numbers[0]), 26) === 1

        ) {

            const a =
                Number(numbers[0]);

            const b =
                Number(numbers[1]);

            encryptFunction =

                (i) =>

                    (
                        (a * i + b) % 26 + 26
                    ) % 26;

        }

    }


    // SUBSTITUTION

    else if (

        STATE.inputType === "text" &&

        cipher === "substitution"

    ) {

        const letters =

            (

                key
                    .toUpperCase()
                    .match(/[A-Z]/g) || []

            )

            .map(

                char =>
                    char.charCodeAt(0) - 65

            );


        if (letters.length) {

            const seen = [];

            letters

                .concat([...Array(26).keys()])

                .forEach(value => {

                    if (!seen.includes(value)) {

                        seen.push(value);

                    }

                });


            encryptFunction =
                i => seen[i];

        }

    }


    // JIKA TIDAK ADA DATA

    if (!encryptFunction) {

        element.classList.add("hide");

        return;

    }


    element.classList.remove("hide");


    const letter =
        index =>
            String.fromCharCode(65 + index);


    const encrypted =

        [...Array(26).keys()]
            .map(encryptFunction);


    const decrypt =
        STATE.mode === "decrypt";


    let bottom =
        encrypted;


    if (decrypt) {

        bottom =
            Array(26);

        encrypted.forEach(

            (value, index) => {

                bottom[value] = index;

            }

        );

    }


    const topLetters =
        [...Array(26).keys()];


    element.innerHTML = `

        <table>

            <tr>

                <th>
                    ${decrypt ? "Cipher" : "Plain"}
                </th>

                ${topLetters

                    .map(

                        index =>

                            `<td>${letter(index)}</td>`

                    )

                    .join("")

                }

            </tr>


            <tr>

                <th>
                    ${decrypt ? "Plain" : "Cipher"}
                </th>

                ${bottom

                    .map(

                        index =>

                            `<td>${letter(index)}</td>`

                    )

                    .join("")

                }

            </tr>

        </table>

    `;

}


// ============================================================
// TOAST / NOTIFIKASI
// ============================================================

function showToast(
    message,
    isError = false
) {

    const toast =
        $("toast");

    toast.textContent =
        message;

    toast.className =
        "show" +
        (isError ? " bad" : "");


    clearTimeout(toast.timer);


    toast.timer =

        setTimeout(

            () => {

                toast.className = "";

            },

            3200

        );

}


// ============================================================
// RUMUS CIPHER
// ============================================================

const FORMULAS = {

    shift:
        "C = (P + k) mod 26",

    substitution:
        "C = pi(P) | P = pi^-1(C)",

    affine:
        "C = (a*P + b) mod 26",

    vigenere:
        "Ci = (Pi + K[i mod m]) mod 26",

    hill:
        "C = K * P (mod 26)",

    permutation:
        "C = blok P diacak oleh urutan kunci",

    otp:
        "Ci = (Pi + Ki) mod 26"

};


const NOTES = [

    "Plainteks dan cipherteks ditampilkan di layar.",

    "Cipherteks bisa tanpa spasi atau kelompok 5 huruf.",

    "Kunci dimasukkan pengguna, panjang bebas.",

    "File apa pun dienkripsi per byte, lalu bisa didekripsi kembali ke file asli."

];


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)

        .replace(

            /[&<>"]/g,

            character => {

                const replacements = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;"

                };

                return replacements[character];

            }

        );

}


// ============================================================
// TAMPILKAN HASIL
// ============================================================

function makePair(
    label1,
    value1,
    label2,
    value2
) {

    // Hanya tampilkan hasil akhir.
    // Judul "Cipherteks" sudah ada di panel kanan.

    return `
        <div class="term">
            ${escapeHTML(value2)}
        </div>
    `;

}


// ============================================================
// INFORMASI CIPHER
// ============================================================

function showCipherInfo() {

    const cipher =
        currentCipher();

    const fileMode =
        STATE.inputType === "file";


    let formula =
        FORMULAS[cipher.id];


    if (fileMode) {

        formula =
            formula.replace(
                /mod 26/g,
                "mod 256"
            );

    }


    $("infoBox").innerHTML = `

        <div>

            <b>
                ${cipher.name} Cipher
            </b>

            <code>
                ${formula}
            </code>

        </div>


        <ul>

            ${NOTES

                .map(

                    note =>
                        `<li>${note}</li>`

                )

                .join("")

            }

        </ul>

    `;


    // Tombol generate substitution

    $("genSub").classList.toggle(

        "hide",

        STATE.cipher !== "substitution"

    );


    $("genSub").textContent =

        fileMode

            ? "Generate substitution byte key"

            : "Generate kunci 26 huruf";


    // Penjelasan tambahan mode file

    if (

        fileMode &&

        STATE.cipher === "substitution"

    ) {

        $("khint").textContent +=

            " Mode file: 256 angka permutasi 0-255 " +

            "(tombol Generate) atau kata kunci sebagai seed.";

    }

}


// ============================================================
// GENERATE SUBSTITUTION KEY
// ============================================================

function generateSubstitutionKey() {

    const fileMode =
        STATE.inputType === "file";


    const length =
        fileMode
            ? 256
            : 26;


    const values =
        [...Array(length).keys()];


    // Fisher-Yates Shuffle

    for (

        let i = length - 1;

        i > 0;

        i--

    ) {

        const random =

            crypto.getRandomValues(

                new Uint32Array(1)

            )[0];


        const j =
            random % (i + 1);


        [
            values[i],
            values[j]

        ] = [

            values[j],
            values[i]

        ];

    }


    if (fileMode) {

        $("key").value =
            values.join(" ");

    }

    else {

        $("key").value =

            values

                .map(

                    value =>

                        String.fromCharCode(
                            65 + value
                        )

                )

                .join("");

    }


    updateAlphabetStrip();


    showToast(
        "Kunci acak dibuat. Simpan kunci ini untuk dekripsi."
    );

}


// ============================================================
// GENERATE OTP
// ============================================================

function generateOTP() {

    const length =

        Math.max(

            1,

            parseInt(
                $("otpn").value
            ) || 10000

        );


    window.location =
        `/genkey?n=${length}`;

}


// ============================================================
// DOWNLOAD FILE
// ============================================================

function downloadProcessedFile() {

    if (!STATE.url) {

        return;

    }


    const link =
        document.createElement("a");


    link.href =
        STATE.url;


    link.download =
        STATE.filename;


    link.click();

}


// ============================================================
// PROSES ENKRIPSI / DEKRIPSI
// ============================================================

async function processData() {

    const formData =
        new FormData();


    const button =
        $("go");


    const oldText =
        button.textContent;


    const encrypt =
        STATE.mode === "encrypt";


    // FORM DATA

    formData.append(
        "mode",
        STATE.mode
    );


    formData.append(
        "cipher",
        STATE.cipher
    );


    formData.append(
        "input_type",
        STATE.inputType
    );


    formData.append(
        "key",
        $("key").value
    );


    formData.append(
        "text",
        $("text").value
    );


    formData.append(
        "group",
        $("group").value
    );


    // FILE

    if ($("file").files[0]) {

        formData.append(
            "file",
            $("file").files[0]
        );

    }


    // FILE KUNCI OTP

    if ($("keyfile").files[0]) {

        formData.append(
            "keyfile",
            $("keyfile").files[0]
        );

    }


    // LOADING

    button.disabled = true;


    button.innerHTML =
        '<span class="spin"></span>Memproses';


    try {

        const response =

            await fetch(

                "/process",

                {

                    method: "POST",

                    body: formData

                }

            );


        // ERROR DARI SERVER

        if (!response.ok) {

            const result =
                await response.json();


            showToast(
                result.error,
                true
            );


            return;

        }


        // ====================================================
        // MODE FILE
        // ====================================================

        if (STATE.inputType === "file") {

            const blob =
                await response.blob();


            const filenameHeader =
                response.headers.get(
                    "X-Filename"
                );


            const filename =

                filenameHeader

                    ? decodeURIComponent(
                        filenameHeader
                    )

                    : "hasil.bin";


            const sourceFile =
                $("file").files[0];


            // Hapus URL lama

            if (STATE.url) {

                URL.revokeObjectURL(
                    STATE.url
                );

            }


            STATE.blob =
                blob;


            STATE.filename =
                filename;


            STATE.url =
                URL.createObjectURL(
                    blob
                );


            const isImage =

                !encrypt &&

                /\.(png|jpe?g|gif|webp|bmp)$/i
                    .test(filename);


            const sourceSize =

                sourceFile

                    ? (
                        sourceFile.size / 1024
                    ).toFixed(1)

                    : "?";


            const resultSize =

                (
                    blob.size / 1024
                ).toFixed(1);


            $("out").className =
                "res";


            $("out").innerHTML = `

                <div class="ok">

                    ${encrypt
                        ? "Enkripsi"
                        : "Dekripsi"}

                    berhasil

                </div>


                <div class="lb">

                    ${escapeHTML(filename)}

                    <br>

                    ${sourceSize} KB

                    menjadi

                    ${resultSize} KB

                </div>


                ${

                    isImage

                        ? `

                            <img

                                class="prev"

                                src="${STATE.url}"

                            >

                        `

                        : ""

                }


                <button

                    class="btn"

                    onclick="downloadProcessedFile()"

                >

                    Simpan File

                </button>

            `;


            showToast(
                "File berhasil diproses"
            );


            return;

        }


        // ====================================================
        // MODE TEKS
        // ====================================================

        const result =
            await response.json();


        STATE.lastResult =
            result.output;


        $("out").className =
            "res";


        // Tampilkan HANYA ciphertext/plaintext
        // tanpa label tambahan

        $("out").innerHTML =

            makePair(

                "",

                "",

                "",

                result.output

            );

    }


    catch (error) {

        console.error(error);


        showToast(

            "Gagal terhubung ke server",

            true

        );

    }


    finally {

        button.disabled = false;

        button.textContent =
            oldText;

    }

}


// ============================================================
// COPY OUTPUT
// ============================================================

function copyOutput() {

    if (!STATE.lastResult) {

        showToast(
            "Belum ada hasil",
            true
        );

        return;

    }


    navigator.clipboard

        .writeText(
            STATE.lastResult
        )

        .then(

            () => {

                showToast(
                    "Hasil disalin"
                );

            }

        );

}


// ============================================================
// SIMPAN OUTPUT TEKS
// ============================================================

function saveOutput() {

    if (!STATE.lastResult) {

        showToast(
            "Belum ada hasil",
            true
        );

        return;

    }


    const blob =

        new Blob(

            [
                STATE.lastResult
            ],

            {
                type: "text/plain"
            }

        );


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(blob);


    link.download =

        STATE.mode === "encrypt"

            ? "cipherteks.txt"

            : "plainteks.txt";


    link.click();

}


// ============================================================
// PINDAHKAN OUTPUT KE INPUT
// ============================================================

function swapInputOutput() {

    if (!STATE.lastResult) {

        showToast(
            "Belum ada hasil",
            true
        );

        return;

    }


    $("text").value =
        STATE.lastResult;


    STATE.mode =

        STATE.mode === "encrypt"

            ? "decrypt"

            : "encrypt";


    STATE.lastResult = "";


    $("out").className =
        "res empty";


    $("out").textContent =
        "Hasil akan muncul di sini.";


    updateUI();


    showToast(
        "Hasil dipindah ke kolom input"
    );

}


// ============================================================
// FILE INPUT
// ============================================================

const dropZone =
    $("drop");


const fileInput =
    $("file");


fileInput.onchange =
    updateSelectedFile;


// ============================================================
// TAMPILKAN FILE YANG DIPILIH
// ============================================================

function updateSelectedFile() {

    const file =
        fileInput.files[0];


    if (!file) {

        return;

    }


    let preview = "";


    // Preview gambar

    if (

        file.type.startsWith(
            "image/"
        )

    ) {

        preview = `

            <img

                class="prev"

                src="${URL.createObjectURL(file)}"

            >

        `;

    }


    $("dtxt").innerHTML = `

        <b>

            ${escapeHTML(file.name)}

        </b>


        <br>


        ${(file.size / 1024).toFixed(1)}

        KB


        ${preview}

    `;

}


// ============================================================
// DRAG & DROP
// ============================================================

[
    "dragover",
    "dragenter"

].forEach(

    eventName => {

        dropZone.addEventListener(

            eventName,

            event => {

                event.preventDefault();

                dropZone.classList.add(
                    "over"
                );

            }

        );

    }

);


[
    "dragleave",
    "drop"

].forEach(

    eventName => {

        dropZone.addEventListener(

            eventName,

            event => {

                event.preventDefault();

                dropZone.classList.remove(
                    "over"
                );

            }

        );

    }

);


dropZone.addEventListener(

    "drop",

    event => {

        if (

            event.dataTransfer.files.length

        ) {

            fileInput.files =
                event.dataTransfer.files;

            updateSelectedFile();

        }

    }

);


// ============================================================
// EVENT LISTENER TOMBOL
// ============================================================

$("key").addEventListener(

    "input",

    updateAlphabetStrip

);


$("text").addEventListener(

    "input",

    updateCount

);


// ============================================================
// INISIALISASI
// ============================================================

updateUI();


// Input key

window.strip =
    updateAlphabetStrip;


// Input plaintext

window.cnt =
    updateCount;


// Tombol Isi contoh

window.ex =
    fillExample;


// Tombol Generate Substitution

window.genSub =
    generateSubstitutionKey;


// Tombol Generate OTP

window.genOtp =
    generateOTP;


// Tombol Enkripsi / Dekripsi

window.run =
    processData;


// Tombol Copy

window.copyO =
    copyOutput;


// Tombol Simpan File

window.saveO =
    saveOutput;


// Tombol Pakai sebagai input

window.swap =
    swapInputOutput;


// Tombol Simpan File hasil

window.dl =
    downloadProcessedFile;


// Update UI

window.ui =
    updateUI;