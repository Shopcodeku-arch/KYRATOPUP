// ===============================
// KONFIGURASI SUPABASEE
// ===============================
const supabaseUrl = 'https://tynclkichqdswtofnvfi.supabase.co';
const supabaseKey = 'sb_publishable_sH-Nodx2cIbQJADwbN4NRg_4lWe_cEm';

const { createClient } = window.supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// ===============================
// LOGIN DISCORD
// ===============================
async function loginDiscord() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
    });
    if (error) console.error('Error login:', error.message);
}

// ===============================
// LOGOUT
// ===============================
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) window.location.reload();
}

// ===============================
// UPDATE: DROPDOwN MENU LOGIC
// ===============================
function toggleMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Menutup dropdown jika klik di luar area
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const profilePic = document.querySelector('.profile-pic');
    
    // Jika klik terjadi diluar profile pic dan dropdown, tutup menu
    if (dropdown && profilePic && !dropdown.contains(e.target) && !profilePic.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ===============================
// CEK SESSION USER (Persistent Login)
// ===============================
async function checkUser() {
    // Supabase secara otomatis menyimpan session di localStorage,
    // getSession akan mengambil data tersebut jika user sudah login sebelumnya (refresh).
    const { data: { session } } = await supabaseClient.auth.getSession();
    const userArea = document.getElementById('user-area');

    if (session) {
        // User Login: Tampilkan Profile + Dropdown Menu
        const avatarUrl = session.user.user_metadata.avatar_url;
        
        userArea.innerHTML = `
            <div class="user-container" style="position: relative;">
                <div class="profile-pic" 
                     style="background-image: url('${avatarUrl}')" 
                     onclick="toggleMenu()" 
                     title="Klik untuk Menu">
                </div>
                
                <div id="userDropdown" class="user-dropdown">
    <div class="dropdown-item" onclick="window.location.href='../id/transaksi/'">
        <i class="fas fa-history"></i> Riwayat Transaksi
    </div>
                    <div class="dropdown-item logout" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Keluar
                    </div>
                </div>
            </div>`;
    } else {
        // User Belum Login: Tampilkan Tombol Login
        userArea.innerHTML = `<button id="login-btn" class="btn-login">Login Discord</button>`;
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.addEventListener('click', loginDiscord);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Jalankan cek user segera setelah DOM siap
    checkUser();

    // ===============================
    // UPDATE: LOADING SHIMMER LOGIC
    // ===============================
    const skeletonGrid = document.getElementById('skeleton-loading');
    const productGrid = document.getElementById('product-list');

    // Menyesuaikan waktu loading (5 detik)
    setTimeout(() => {
        if (skeletonGrid) skeletonGrid.style.display = 'none';
        if (productGrid) productGrid.style.display = 'grid';
    }, 5000);

    // ===============================
    // POPUP
    // ===============================
    setTimeout(() => {
        const popup = document.getElementById('popupOverlay');
        if (popup) popup.style.display = 'flex';
    }, 1500);

    // ===============================
    // SLIDER
    // ===============================
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const wrapper = document.getElementById('sliderWrapper');
    const container = document.getElementById('sliderContainer');
    let autoSlideInterval;

    function updateSlidePosition() {
        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;

        if (wrapper) {
            wrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
        }

        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[slideIndex]) dots[slideIndex].classList.add('active');
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            slideIndex++;
            updateSlidePosition();
        }, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    let touchStartX = 0;
    let touchEndX = 0;

    if (container) {
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide(); 
        });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide(); 
        });
    }

    function handleSwipe() {
        const sensitivity = 50; 
        if (touchEndX < touchStartX - sensitivity) {
            slideIndex++;
        }
        if (touchEndX > touchStartX + sensitivity) {
            slideIndex--;
        }
        updateSlidePosition();
    }

    updateSlidePosition();
    startAutoSlide();
});

// ===============================
// CLOSE POPUP
// ===============================
function closePopup() {
    const popup = document.getElementById('popupOverlay');
    if (popup) popup.style.display = 'none';
}
// ===============================
// UPDATE: ROBLOX POPUP LOGIC
// ===============================

function openRobloxPopup() {
    const modal = document.getElementById('robloxModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeRobloxPopup() {
    const modal = document.getElementById('robloxModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Logic: Tutup popup jika user klik di area gelap (overlay)
// Kita tambahkan event listener ke window
window.addEventListener('click', function(event) {
    const robloxModal = document.getElementById('robloxModal');
    // Jika yang diklik adalah background overlay (bukan isi popupnya)
    if (event.target === robloxModal) {
        robloxModal.style.display = "none";
    }
});
