"""
Aplikasi Kriptografi Klasik (Flask)

Cipher:
1. Shift Cipher
2. Substitution Cipher
3. Affine Cipher
4. Vigenere Cipher
5. Hill Cipher
6. Permutation Cipher
7. One-Time Pad

Mode:
- Teks : menggunakan modulus 26
- File : menggunakan modulus 256 (byte)

Jalankan:
    pip install flask
    python app.py

Kemudian buka:
    http://127.0.0.1:5000
"""

import math
import random
import re
import secrets
import struct
from io import BytesIO
from urllib.parse import quote

from flask import Flask, jsonify, render_template, request, send_file


# ============================================================
# KONFIGURASI APLIKASI
# ============================================================

app = Flask(__name__)

MAGIC = b"CPH1"


# ============================================================
# CUSTOM ERROR
# ============================================================

class KeyError_(Exception):
    """Error khusus untuk kesalahan input atau kunci cipher."""
    pass


# ============================================================
# FUNGSI MATRIKS
# Digunakan oleh Hill Cipher
# ============================================================

def det_mod(matrix, modulus):
    """
    Menghitung determinan matriks dalam modulus tertentu.
    """
    n = len(matrix)

    if n == 1:
        return matrix[0][0] % modulus

    total = 0

    for j in range(n):
        minor = [
            row[:j] + row[j + 1:]
            for row in matrix[1:]
        ]

        total += (
            (-1) ** j
            * matrix[0][j]
            * det_mod(minor, modulus)
        )

    return total % modulus


def inv_matrix(matrix, modulus):
    """
    Menghitung invers matriks modulo modulus.
    Digunakan untuk proses dekripsi Hill Cipher.
    """
    n = len(matrix)

    determinant = det_mod(matrix, modulus)

    if math.gcd(determinant, modulus) != 1:
        raise KeyError_(
            f"Matriks tidak punya balikan modulo {modulus} "
            f"(determinan={determinant}, harus relatif prima dengan {modulus})."
        )

    determinant_inverse = pow(determinant, -1, modulus)

    adjoint = [[0] * n for _ in range(n)]

    for i in range(n):
        for j in range(n):
            minor = [
                row[:i] + row[i + 1:]
                for k, row in enumerate(matrix)
                if k != j
            ]

            if n > 1:
                minor_det = det_mod(minor, modulus)
            else:
                minor_det = 1

            adjoint[i][j] = (
                (-1) ** (i + j)
                * minor_det
            )

    return [
        [
            (determinant_inverse * adjoint[i][j]) % modulus
            for j in range(n)
        ]
        for i in range(n)
    ]


# ============================================================
# PARSING DAN VALIDASI KUNCI
# ============================================================

def parse_key(cipher, key, modulus, keyfile):
    """
    Membaca dan memvalidasi kunci berdasarkan jenis cipher.
    """

    key = key or ""

    # Huruf A-Z diubah menjadi angka 0-25
    letters = [
        ord(char) - 65
        for char in key.upper()
        if "A" <= char <= "Z"
    ]

    # Mengambil bilangan dari input kunci
    numbers = [
        int(value)
        for value in re.findall(r"-?\d+", key)
    ]

    # --------------------------------------------------------
    # SHIFT CIPHER
    # --------------------------------------------------------

    if cipher == "shift":

        if not numbers:
            raise KeyError_(
                "Kunci Shift berupa bilangan bulat."
            )

        return numbers[0] % modulus

    # --------------------------------------------------------
    # AFFINE CIPHER
    # --------------------------------------------------------

    if cipher == "affine":

        if len(numbers) < 2:
            raise KeyError_(
                "Kunci Affine: dua bilangan 'a,b'."
            )

        a = numbers[0] % modulus
        b = numbers[1] % modulus

        if math.gcd(a, modulus) != 1:
            raise KeyError_(
                f"a harus relatif prima dengan {modulus}."
            )

        return a, b

    # --------------------------------------------------------
    # VIGENERE CIPHER
    # --------------------------------------------------------

    if cipher == "vigenere":

        if modulus == 26:
            parsed_key = letters
        else:
            parsed_key = list(
                key.encode("utf-8")
            )

        if not parsed_key:
            raise KeyError_(
                "Kunci Vigenere tidak boleh kosong."
            )

        return parsed_key

    # --------------------------------------------------------
    # SUBSTITUTION CIPHER
    # --------------------------------------------------------

    if cipher == "substitution":

        # Mode teks
        if modulus == 26:

            seen = []

            for value in letters + list(range(26)):
                if value not in seen:
                    seen.append(value)

            if not letters:
                raise KeyError_(
                    "Isi kunci: 26 huruf permutasi atau kata kunci."
                )

            return seen

        # Mode file
        if (
            len(numbers) == 256
            and sorted(numbers) == list(range(256))
        ):
            return numbers

        if not key:
            raise KeyError_(
                "Kunci tidak boleh kosong."
            )

        # Untuk mode byte, kata kunci digunakan sebagai seed
        permutation = list(range(256))
        random.Random(key).shuffle(permutation)

        return permutation

    # --------------------------------------------------------
    # HILL CIPHER
    # --------------------------------------------------------

    if cipher == "hill":

        values = numbers if numbers else letters

        n = math.isqrt(len(values))

        if n < 2 or n * n != len(values):
            raise KeyError_(
                "Kunci Hill: n*n bilangan "
                "(mis. '3 3 2 5 7 1 2 3 4') "
                "atau n*n huruf "
                "(mis. 'GYBNQKURP')."
            )

        matrix = [
            [
                values[i * n + j] % modulus
                for j in range(n)
            ]
            for i in range(n)
        ]

        inverse = inv_matrix(
            matrix,
            modulus
        )

        return matrix, inverse

    # --------------------------------------------------------
    # PERMUTATION CIPHER
    # --------------------------------------------------------

    if cipher == "permutation":

        # Kunci berupa angka
        if numbers:

            if sorted(numbers) != list(
                range(1, len(numbers) + 1)
            ):
                raise KeyError_(
                    "Kunci permutasi angka harus "
                    "permutasi dari 1..n, "
                    "mis. '3 1 4 2'."
                )

            return [
                value - 1
                for value in numbers
            ]

        # Kunci berupa huruf
        if not letters:
            raise KeyError_(
                "Kunci permutasi: urutan angka atau kata kunci."
            )

        return sorted(
            range(len(letters)),
            key=lambda i: (letters[i], i)
        )

    # --------------------------------------------------------
    # ONE-TIME PAD
    # --------------------------------------------------------

    if cipher == "otp":

        if not keyfile:
            raise KeyError_(
                "Unggah file kunci One-Time Pad."
            )

        # Mode teks
        if modulus == 26:
            return [
                char - 65
                for char in keyfile.upper()
                if 65 <= char <= 90
            ]

        # Mode file
        return list(keyfile)

    raise KeyError_(
        "Cipher tidak dikenal."
    )


# ============================================================
# PROSES CIPHER
# ============================================================

def run(cipher, data, key, modulus, encrypt):
    """
    Menjalankan proses enkripsi atau dekripsi.

    Parameters:
        cipher   : jenis cipher
        data     : data dalam bentuk list integer
        key      : kunci hasil parse_key()
        modulus  : 26 untuk teks, 256 untuk file
        encrypt  : True untuk enkripsi, False untuk dekripsi
    """

    direction = 1 if encrypt else -1

    # Padding:
    # X untuk teks
    # 0 untuk byte
    padding = 23 if modulus == 26 else 0

    # --------------------------------------------------------
    # SHIFT
    # --------------------------------------------------------

    if cipher == "shift":

        return [
            (value + direction * key) % modulus
            for value in data
        ]

    # --------------------------------------------------------
    # AFFINE
    # --------------------------------------------------------

    if cipher == "affine":

        a, b = key

        if encrypt:

            return [
                (a * value + b) % modulus
                for value in data
            ]

        a_inverse = pow(
            a,
            -1,
            modulus
        )

        return [
            (a_inverse * (value - b)) % modulus
            for value in data
        ]

    # --------------------------------------------------------
    # VIGENERE
    # --------------------------------------------------------

    if cipher == "vigenere":

        return [
            (
                value
                + direction * key[index % len(key)]
            ) % modulus
            for index, value in enumerate(data)
        ]

    # --------------------------------------------------------
    # SUBSTITUTION
    # --------------------------------------------------------

    if cipher == "substitution":

        if encrypt:

            return [
                key[value]
                for value in data
            ]

        # Membuat inverse substitution
        inverse = [0] * modulus

        for index, value in enumerate(key):
            inverse[value] = index

        return [
            inverse[value]
            for value in data
        ]

    # --------------------------------------------------------
    # HILL
    # --------------------------------------------------------

    if cipher == "hill":

        matrix = key[0] if encrypt else key[1]

        n = len(matrix)

        # Padding agar panjang data habis dibagi ukuran matriks
        data = data + [
            padding
        ] * (-len(data) % n)

        result = []

        for i in range(0, len(data), n):

            block = data[i:i + n]

            result += [
                sum(
                    matrix[row][column]
                    * block[column]
                    for column in range(n)
                ) % modulus
                for row in range(n)
            ]

        return result

    # --------------------------------------------------------
    # PERMUTATION
    # --------------------------------------------------------

    if cipher == "permutation":

        n = len(key)

        data = data + [
            padding
        ] * (-len(data) % n)

        result = []

        for i in range(0, len(data), n):

            block = data[i:i + n]

            if encrypt:

                result += [
                    block[key[j]]
                    for j in range(n)
                ]

            else:

                restored = [0] * n

                for j in range(n):
                    restored[key[j]] = block[j]

                result += restored

        return result

    # --------------------------------------------------------
    # ONE-TIME PAD
    # --------------------------------------------------------

    if cipher == "otp":

        if len(key) < len(data):
            raise KeyError_(
                f"File kunci terlalu pendek: "
                f"butuh {len(data)}, "
                f"tersedia {len(key)}."
            )

        return [
            (
                value
                + direction * key[index]
            ) % modulus
            for index, value in enumerate(data)
        ]

    raise KeyError_(
        "Cipher tidak dikenal."
    )


# ============================================================
# ROUTE: PROSES ENKRIPSI / DEKRIPSI
# ============================================================

@app.route("/process", methods=["POST"])
def process():

    form = request.form

    cipher = form.get("cipher")
    encrypt = form.get("mode") == "encrypt"

    try:

        # ----------------------------------------------------
        # BACA FILE KUNCI OTP
        # ----------------------------------------------------

        key_file_upload = request.files.get("keyfile")

        if (
            key_file_upload
            and key_file_upload.filename
        ):
            key_file = key_file_upload.read()
        else:
            key_file = None

        # ----------------------------------------------------
        # MODE FILE
        # ----------------------------------------------------

        if form.get("input_type") == "file":

            upload = request.files.get("file")

            if not upload or not upload.filename:
                raise KeyError_(
                    "Pilih file terlebih dahulu."
                )

            raw_data = upload.read()
            original_name = upload.filename

            key = parse_key(
                cipher,
                form.get("key"),
                256,
                key_file
            )

            # ----------------------------------------------
            # ENKRIPSI FILE
            # ----------------------------------------------

            if encrypt:

                name_bytes = original_name.encode(
                    "utf-8"
                )

                encrypted_body = bytes(
                    run(
                        cipher,
                        list(raw_data),
                        key,
                        256,
                        True
                    )
                )

                # Format file:
                #
                # MAGIC
                # panjang nama
                # nama file
                # panjang file asli
                # ciphertext
                #

                blob = (
                    MAGIC
                    + struct.pack(
                        ">H",
                        len(name_bytes)
                    )
                    + name_bytes
                    + struct.pack(
                        ">Q",
                        len(raw_data)
                    )
                    + encrypted_body
                )

                output_name = (
                    original_name + ".dat"
                )

            # ----------------------------------------------
            # DEKRIPSI FILE
            # ----------------------------------------------

            else:

                if raw_data[:4] != MAGIC:
                    raise KeyError_(
                        "File bukan ciphertext dari aplikasi ini."
                    )

                name_length = struct.unpack(
                    ">H",
                    raw_data[4:6]
                )[0]

                output_name = raw_data[
                    6:6 + name_length
                ].decode("utf-8")

                original_length = struct.unpack(
                    ">Q",
                    raw_data[
                        6 + name_length:
                        14 + name_length
                    ]
                )[0]

                encrypted_body = list(
                    raw_data[
                        14 + name_length:
                    ]
                )

                blob = bytes(
                    run(
                        cipher,
                        encrypted_body,
                        key,
                        256,
                        False
                    )
                )[:original_length]

            # Kirim file hasil
            response = send_file(
                BytesIO(blob),
                mimetype="application/octet-stream",
                as_attachment=True,
                download_name="hasil.bin"
            )

            response.headers["X-Filename"] = quote(
                output_name
            )

            response.headers[
                "Access-Control-Expose-Headers"
            ] = "X-Filename"

            return response

        # ----------------------------------------------------
        # MODE TEKS
        # ----------------------------------------------------

        text = form.get("text", "")

        # Hanya mengambil huruf A-Z
        data = [
            ord(char) - 65
            for char in text.upper()
            if "A" <= char <= "Z"
        ]

        if not data:
            raise KeyError_(
                "Tidak ada huruf alfabet pada input."
            )

        key = parse_key(
            cipher,
            form.get("key"),
            26,
            key_file
        )

        result = run(
            cipher,
            data,
            key,
            26,
            encrypt
        )

        output = "".join(
            chr(value + 65)
            for value in result
        )

        # Input bersih untuk ditampilkan
        clean_input = "".join(
            chr(value + 65)
            for value in data
        )

        # Kelompok 5 huruf
        if (
            encrypt
            and form.get("group") == "5"
        ):
            output = " ".join(
                output[i:i + 5]
                for i in range(0, len(output), 5)
            )

        return jsonify(
            ok=True,
            input=clean_input,
            output=output
        )

    except KeyError_ as error:

        return jsonify(
            ok=False,
            error=str(error)
        ), 400

    except Exception as error:

        return jsonify(
            ok=False,
            error=f"Kesalahan: {error}"
        ), 400


# ============================================================
# ROUTE: GENERATE OTP
# ============================================================

@app.route("/genkey")
def generate_key():

    try:
        length = int(
            request.args.get(
                "n",
                50000
            )
        )

    except ValueError:
        length = 50000

    length = min(
        max(length, 1),
        2_000_000
    )

    key = "".join(
        secrets.choice(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        )
        for _ in range(length)
    )

    return send_file(
        BytesIO(
            key.encode()
        ),
        mimetype="text/plain",
        as_attachment=True,
        download_name="otp_key.txt"
    )


# ============================================================
# ROUTE: HALAMAN UTAMA
# ============================================================

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# ============================================================
# MENJALANKAN SERVER
# ============================================================

if __name__ == "__main__":
    app.run(
        debug=True
    )