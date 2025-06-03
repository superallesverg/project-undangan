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
    }
    // Re-initialize AOS atau refresh setelah konten utama ditampilkan
    // agar animasi pada elemen yang baru muncul bisa berjalan
    AOS.refresh();
  });

  // Tombol Musik
  const tombolMusik = document.getElementById("tombol-musik");
  if (tombolMusik && backgroundMusic) {
    tombolMusik.addEventListener("click", function () {
      if (backgroundMusic.paused) {
        backgroundMusic.play();
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

  // Countdown Timer
  const tanggalPernikahan = new Date("2029-05-22T23:59:59").getTime(); // Format: YYYY-MM-DDTHH:mm:ss
  // Contoh: "2024-12-25T10:00:00"

  if (!isNaN(tanggalPernikahan)) {
    const countdownInterval = setInterval(function () {
      const sekarang = new Date().getTime();
      const selisih = tanggalPernikahan - sekarang;

      const days = Math.floor(selisih / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((selisih % (1000 * 60)) / 1000);

      document.getElementById("500").innerText = String(days).padStart(2, "0");
      document.getElementById("24").innerText = String(hours).padStart(2, "0");
      document.getElementById("00").innerText = String(minutes).padStart(
        2,
        "0"
      );
      document.getElementById("00").innerText = String(seconds).padStart(
        2,
        "0"
      );

      if (selisih < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML =
          "Acara Telah Berlangsung";
      }
    }, 1000);
  } else {
    console.error(
      "Format tanggal pernikahan untuk countdown tidak valid. Harap gunakan YYYY-MM-DDTHH:mm:ss"
    );
    if (document.getElementById("countdown")) {
      document.getElementById("countdown").innerHTML =
        "Pengaturan Tanggal Error";
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

      // Di sini Anda biasanya akan mengirim data ke server
      // Untuk contoh ini, kita hanya tampilkan pesan di halaman
      rsvpResponse.innerHTML = `Terima kasih, ${nama}! Konfirmasi Anda (${kehadiran}) telah kami catat.`;
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

  // Update tahun di footer
  document.getElementById("tahun").textContent = new Date().getFullYear();
});
