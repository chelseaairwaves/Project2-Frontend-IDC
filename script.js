const API_URL = "https://api-listfilm.vercel.app/movies";

// 🔹 Fungsi untuk mengambil dan menampilkan semua film
document.addEventListener("DOMContentLoaded", function () {
    fetchMovies(); // Ambil daftar film saat halaman pertama kali dimuat
});

function fetchMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log("Data Film:", data);
            const moviesList = document.getElementById("movies-list");
            moviesList.innerHTML = ""; // Kosongkan daftar sebelum ditampilkan ulang

            if (!Array.isArray(data)) {
                console.error("Data dari API tidak berupa array:", data);
                return;
            }

            data.forEach(movie => {
                const movieItem = document.createElement("div");
                movieItem.classList.add("col-md-4");

                movieItem.innerHTML = `
                    <div class="card p-3 shadow-lg">
                        <h5 class="font-bold">${movie.title} (${movie.year})</h5>
                        <p>🎬 Sutradara: ${movie.director}</p>
                        <p>📽️ Genre: ${movie.genre}</p>
                        <p>⭐ Rating: ${movie.rating}</p>
                        <button onclick="deleteMovie('${movie._id}')" class="btn btn-danger btn-sm">Hapus</button>
                    </div>
                `;

                moviesList.appendChild(movieItem);
            });
        })
        .catch(error => console.error("Gagal mengambil data:", error));
}


// 🔹 Fungsi untuk menambahkan film baru
function addMovie() {
    const title = document.getElementById("title").value.trim();
    const director = document.getElementById("director").value.trim();
    const year = document.getElementById("year").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const rating = document.getElementById("rating").value.trim();

    if (!title || !director || !year || !genre || !rating) {
        alert("Harap isi semua kolom!");
        return;
    }

    const newMovie = {
        title,
        director,
        year: parseInt(year),
        genre,
        rating: parseFloat(rating)
    };

    console.log("Data yang dikirim ke API:", newMovie); // Debugging

    fetch("https://api-listfilm.vercel.app/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respon API setelah menambahkan:", data);
        addMovieToUI(data); // Tambahkan langsung ke tampilan
        alert("Film berhasil ditambahkan!");
    })
    .catch(error => console.error("Gagal menambah film:", error));
}


// 🔹 Fungsi untuk langsung menampilkan film baru tanpa refresh
function addMovieToUI(movie) {
    const moviesList = document.getElementById("movies-list");
    const movieItem = document.createElement("div");
    movieItem.classList.add("col-md-4");

    movieItem.innerHTML = `
        <div class="card p-3 shadow-lg">
            <h5 class="font-bold">${movie.title} (${movie.year})</h5>
            <p>🎬 Sutradara: ${movie.director}</p>
            <p>📽️ Genre: ${movie.genre}</p>
            <p>⭐ Rating: ${movie.rating}</p>
            <button onclick="deleteMovie('${movie._id}')" class="btn btn-danger btn-sm">Hapus</button>
        </div>
    `;

    moviesList.appendChild(movieItem); // Tambahkan film baru ke daftar
}


// 🔹 Fungsi untuk menghapus film berdasarkan ID
let lastDeletedMovie = null; // Menyimpan data film yang terakhir dihapus

function deleteMovie(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(movie => {
            lastDeletedMovie = movie; // Simpan data film sebelum dihapus

            return fetch(`${API_URL}/${id}`, { method: "DELETE" });
        })
        .then(response => {
            if (!response.ok) throw new Error("Gagal menghapus film");
            return response.json();
        })
        .then(() => {
            alert("Film berhasil dihapus! Klik 'Undo' untuk mengembalikannya.");
            fetchMovies(); // Refresh daftar film
            showUndoButton(); // Tampilkan tombol Undo
        })
        .catch(error => console.error("Gagal menghapus film:", error));
}

// 🔹 Fungsi untuk mengembalikan data film yang terhapus
function restoreLastDeletedMovie() {
    if (!lastDeletedMovie) {
        alert("Tidak ada film yang bisa dikembalikan!");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastDeletedMovie),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Film dikembalikan:", data);
        lastDeletedMovie = null; // Hapus data dari variabel
        fetchMovies(); // Refresh daftar film
        hideUndoButton(); // Sembunyikan tombol Undo
    })
    .catch(error => console.error("Gagal mengembalikan film:", error));
}

// 🔹 Fungsi untuk menampilkan tombol Undo
function showUndoButton() {
    document.getElementById("undoButton").style.display = "block";
}

// 🔹 Fungsi untuk menyembunyikan tombol Undo
function hideUndoButton() {
    document.getElementById("undoButton").style.display = "none";
}

