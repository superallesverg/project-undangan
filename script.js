document.addEventListener("DOMContentLoaded", function () {
  // Inisialisasi AOS (Animate On Scroll)
  AOS.init({
    duration: 1000, // durasi animasi
    once: true, // animasi hanya sekali
  });

  // Overlay Awal dan Tombol Buka Undangan
  const overlayAwal = document.getElementById("overlay-awal");
  const bukaUndanganButton = document.getElementById("buka-undangan");
  const kontenUtama = document.getElementById("konten-utama");
  const backgroundMusic = document.getElementById("background-music");
  const guestNameElement = document.getElementById("guest-name");

  // Ambil nama tamu dari URL query parameter 'to'
  const urlParams = new URLSearchParams(window.location.search);
  const guestTo = urlParams.get("to");
  if (guestTo) {
    guestNameElement.textContent = decodeURIComponent(
      guestTo.replace(/\+/g, " ")
    );
  }

  bukaUndanganButton.addEventListener("click", function () {
    overlayAwal.style.display = "none";
    kontenUtama.style.display = "block";
    // Putar musik jika ada dan belum diputar
    if (backgroundMusic && backgroundMusic.paused) {
      backgroundMusic
        .play()
        .catch((error) => console.log("Autoplay music error:", error));
      updateTombolMusikIcon();
      startCountdown();
    }
    // Re-initialize AOS atau refresh setelah konten utama ditampilkan
    // agar animasi pada elemen yang baru muncul bisa berjalan
    AOS.refresh();
  });

  // Tombol Musik

  backgroundMusic
    .play()
    .then(() => {
      iconMusik.classList.remove("fa-play");
      iconMusik.classList.add("fa-pause");
    })
    .catch((error) => {
      console.error("Musik gagal diputar secara otomatis:", error);
      // Anda bisa membiarkan icon tetap 'play' jika gagal,
      // atau memberi notifikasi bahwa musik perlu di-tap manual
    });

  const tombolMusik = document.getElementById("tombol-musik");
  if (tombolMusik) {
    iconMusik = tombolMusik.querySelector("i"); // Beri nilai pada iconMusik
    if (!iconMusik) {
      console.error("Elemen <i> di dalam tombol musik tidak ditemukan!");
    }
  } else {
    console.error("Tombol dengan ID 'tombol-musik' tidak ditemukan!");
  }
  if (tombolMusik && backgroundMusic) {
    tombolMusik.addEventListener("click", function () {
      if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
      } else {
        backgroundMusic.pause();
      }
      updateTombolMusikIcon();
    });
  }

  function updateTombolMusikIcon() {
    if (tombolMusik && backgroundMusic) {
      if (backgroundMusic.paused) {
        tombolMusik.innerHTML = '<i class="fas fa-play"></i>';
      } else {
        tombolMusik.innerHTML = '<i class="fas fa-pause"></i>';
      }
    }
  }
  // RSVP Form Submission (Contoh Front-end)
  const rsvpForm = document.getElementById("rsvp-form");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nama = document.getElementById("nama").value;
      const kehadiran = document.getElementById("kehadiran").value;
      const jumlah = document.getElementById("jumlah").value;
      const pesan = document.getElementById("pesan").value;
      const rsvpResponse = document.getElementById("rsvp-response");

      const newEntry = {
        nama: nama,
        kehadiran: kehadiran,
        jumlah: kehadiran === "hadir" ? jumlah : "-", // Simpan jumlah hanya jika hadir
        pesan: pesan,
        timestamp: new Date().toLocaleString("id-ID"), // Tambahkan waktu submit
      };

      let rsvpEntries = JSON.parse(localStorage.getItem("rsvpEntries")) || [];
      rsvpEntries.push(newEntry);
      console.log("Semua entri yang akan disimpan:", rsvpEntries);
      localStorage.setItem("rsvpEntries", JSON.stringify(rsvpEntries));
      // === AKHIR BAGIAN localStorage ===

      // Di sini Anda biasanya akan mengirim data ke server
      // Untuk contoh ini, kita hanya tampilkan pesan di halaman
      rsvpResponse.innerHTML = `Terima kasih, ${nama}! Konfirmasi Anda (${kehadiran.replace(
        "_",
        " "
      )}) telah kami catat.`; // Pesan yang lebih baik
      rsvpResponse.style.color = "green";
      rsvpForm.reset();

      // Untuk integrasi nyata, Anda perlu AJAX/Fetch untuk mengirim ke backend
      // atau layanan seperti Google Sheets via API Gateway, Formspree, dll.
      // fetch('URL_BACKEND_ANDA', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ nama, kehadiran, jumlah, pesan })
      // })
      // .then(response => response.json())
      // .then(data => {
      //     rsvpResponse.innerHTML = `Terima kasih, ${nama}! Konfirmasi Anda telah terkirim.`;
      //     rsvpForm.reset();
      // })
      // .catch(error => {
      //     rsvpResponse.innerHTML = `Maaf, terjadi kesalahan. Silakan coba lagi.`;
      //     rsvpResponse.style.color = 'red';
      // });
    });
  }

  // Salin Nomor Rekening
  const tombolSalin = document.querySelectorAll(".salin-rekening");
  tombolSalin.forEach((tombol) => {
    tombol.addEventListener("click", function () {
      const nomorRekening = this.dataset.rekening;
      navigator.clipboard
        .writeText(nomorRekening)
        .then(() => {
          const originalText = this.textContent;
          this.textContent = "Tersalin!";
          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Gagal menyalin: ", err);
          alert("Gagal menyalin nomor rekening.");
        });
    });
  });
  // --- Bagian Countdown ---
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const tanggalPernikahanElement = document.querySelector(
    ".tanggal-pernikahan"
  );
  let countdownInterval;

  function parseWeddingDate(dateString) {
    // Hilangkan kurung siku dan spasi ekstra: "[22 MEI 2029]" -> "22 MEI 2029"
    let normalizedDateString = dateString.replace(/\[|\]/g, "").trim();

    const monthMap = {
      JANUARI: "January",
      FEBRUARI: "February",
      MARET: "March",
      APRIL: "April",
      MEI: "May",
      JUNI: "June",
      JULI: "July",
      AGUSTUS: "August",
      SEPTEMBER: "September",
      OKTOBER: "October",
      NOVEMBER: "November",
      DESEMBER: "December",
    };

    const parts = normalizedDateString.split(" "); // ["22", "MEI", "2029"]
    if (parts.length === 3) {
      const day = parts[0];
      const monthKey = parts[1].toUpperCase(); // "MEI"
      const year = parts[2];
      const monthEnglish = monthMap[monthKey]; // "May"

      if (monthEnglish) {
        // Format yang lebih aman untuk new Date(): "May 22, 2029 00:00:00"
        return new Date(`${monthEnglish} ${day}, ${year} 00:00:00`);
      }
    }
    console.error("Format tanggal pernikahan tidak valid di HTML:", dateString);
    return null; // Kembalikan null jika parsing gagal
  }

  // Ambil tanggal pernikahan dari HTML
  const weddingDateString = tanggalPernikahanElement
    ? tanggalPernikahanElement.textContent
    : "[22 MEI 2029]"; // Fallback jika elemen tidak ada
  const targetDate = parseWeddingDate(weddingDateString);

  function updateCountdown() {
    if (!targetDate) {
      // Jika tanggal pernikahan gagal diparsing
      daysEl.textContent = "N/A";
      hoursEl.textContent = "N/A";
      minutesEl.textContent = "N/A";
      secondsEl.textContent = "N/A";
      if (countdownInterval) clearInterval(countdownInterval);
      return;
    }

    const now = new Date().getTime();
    const timeLeft = targetDate.getTime() - now;

    if (timeLeft < 0) {
      clearInterval(countdownInterval);
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      // Anda bisa mengubah seluruh div countdown menjadi pesan, contoh:
      const countdownDiv = document.getElementById("countdown");
      if (countdownDiv)
        countdownDiv.innerHTML =
          "<p style='font-size: 1.5rem;'>Acara Telah Berlangsung</p>";
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  function startCountdown() {
    if (targetDate) {
      updateCountdown(); // Panggil sekali agar tidak ada delay 1 detik
      countdownInterval = setInterval(updateCountdown, 1000);
    } else {
      // Tampilkan N/A jika tanggal tidak valid
      daysEl.textContent = "N/A";
      hoursEl.textContent = "N/A";
      minutesEl.textContent = "N/A";
      secondsEl.textContent = "N/A";
    }
  }

  // Update tahun di footer
  document.getElementById("tahun").textContent = new Date().getFullYear();
});
