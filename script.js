document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initTyping();
    initSmoothScroll();
    initProjectVideo();
    initSkills();
    initContact();
    initFooter();
});

/* ======================= NAV / MENU ======================= */
function initMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (!icon) return;
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
    });

    document.querySelectorAll("nav a").forEach((link) => {
        link.addEventListener("click", function () {
            navMenu.classList.remove("active");
            const icon = menuToggle.querySelector("i");
            if (!icon) return;
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-xmark");
        });
    });
}

/* ======================= TYPING EFFECT ======================= */
function initTyping() {
    const typingElement = document.querySelector(".typing-text");
    if (!typingElement) return;

    const texts = ["Frontend Developer", "Backend Developer", "DevOps"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingDelay = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingDelay = 500;
        }

        setTimeout(type, typingDelay);
    }
    setTimeout(type, 1000);
}

/* ======================= SMOOTH SCROLL ======================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: "smooth",
            });
        });
    });
}

/* ======================= PROJECT VIDEO (YouTube-like) ======================= */
function initProjectVideo() {
    const section = document.querySelector("#projects");
    if (!section) return;

    const mockup = section.querySelector(".mockup");
    const video = section.querySelector(".project-video");
    const centerBtn = section.querySelector(".center-toggle");
    const expandBtn = section.querySelector(".expand-toggle");
    if (!mockup || !video || !centerBtn || !expandBtn) return;

    let isExpanded = false;
    let hideTimer = null;
    const HIDE_DELAY = 1800;

    function showControls() {
        mockup.classList.add("show-controls");
        mockup.classList.remove("hide-cursor");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            mockup.classList.remove("show-controls");
            if (!video.paused) mockup.classList.add("hide-cursor");
        }, HIDE_DELAY);
    }
    function hideControlsNow() {
        clearTimeout(hideTimer);
        mockup.classList.remove("show-controls");
        if (!video.paused) mockup.classList.add("hide-cursor");
    }

    // Desktop: hiển thị theo mouse move/hover
    mockup.addEventListener("mousemove", showControls);
    mockup.addEventListener("mouseenter", showControls);
    mockup.addEventListener("mouseleave", hideControlsNow);

    // Mobile: tap vào vùng video để hiện controls (không toggle play)
    mockup.addEventListener("pointerdown", (e) => {
        const isTouchLike =
            e.pointerType === "touch" || window.matchMedia("(hover: none)").matches;
        if (!isTouchLike) return;
        if (e.target.closest?.(".vid-btn")) return;
        showControls();
    });

    // Play/Pause ở giữa (chỉ hiện khi controls bật)
    centerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play().catch(() => { });
            centerBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            video.pause();
            centerBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
        showControls();
    });

    function ensureBackdrop() {
        let bd = document.querySelector(".video-backdrop");
        if (!bd) {
            bd = document.createElement("div");
            bd.className = "video-backdrop";
            document.body.appendChild(bd);
        }
        return bd;
    }

    // FLIP mở rộng
    function openExpanded() {
        if (isExpanded) return;
        const first = mockup.getBoundingClientRect();

        mockup.classList.add("is-expanded");
        const backdrop = ensureBackdrop();
        requestAnimationFrame(() => backdrop.classList.add("show"));
        document.body.classList.add("modal-open");

        const last = mockup.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        const sy = first.height / last.height;

        mockup.animate(
            [
                { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
                { transform: `translate(0,0) scale(1.03)` },
                { transform: `translate(0,0) scale(1)` },
            ],
            { duration: 480, easing: "cubic-bezier(0.22,1,0.36,1)" }
        );

        isExpanded = true;
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        showControls(); // hiện 1 lúc rồi tự ẩn
    }

    // FLIP thu nhỏ
    function closeExpanded() {
        if (!isExpanded) return;

        const backdrop = document.querySelector(".video-backdrop");
        const first = mockup.getBoundingClientRect();

        mockup.style.visibility = "hidden";
        mockup.classList.remove("is-expanded");
        const last = mockup.getBoundingClientRect();
        mockup.classList.add("is-expanded");
        mockup.style.visibility = "visible";

        const dx = last.left - first.left;
        const dy = last.top - first.top;
        const sx = last.width / first.width;
        const sy = last.height / first.height;

        const anim = mockup.animate(
            [
                { transform: `translate(0,0) scale(1)` },
                { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
            ],
            { duration: 380, easing: "cubic-bezier(0.22,1,0.36,1)" }
        );

        backdrop?.classList.remove("show");
        anim.addEventListener("finish", () => {
            mockup.classList.remove("is-expanded");
            document.body.classList.remove("modal-open");
            backdrop?.remove();
            isExpanded = false;
            expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            hideControlsNow();
        });
    }

    expandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        isExpanded ? closeExpanded() : openExpanded();
    });

    // Click ra ngoài (backdrop) để đóng
    document.addEventListener("click", (e) => {
        const bd = document.querySelector(".video-backdrop");
        if (!isExpanded || !bd) return;
        if (e.target === bd) closeExpanded();
    });

    // ESC để đóng
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isExpanded) closeExpanded();
    });

    hideControlsNow(); // sạch UI khi load
}

/* ======================= SKILLS (bars + tabs) ======================= */
function initSkills() {
    const section = document.querySelector("#skills");
    if (!section) return;
    // Bars animation on view
    const bars = section.querySelectorAll(".bar");
    const barsObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const bar = entry.target;
                const pct = Math.max(
                    0,
                    Math.min(100, Number(bar.dataset.percent || 0))
                );
                const fill = bar.querySelector(".bar-fill");
                if (!fill) return;
                fill.animate(
                    [{ width: "0%" }, { width: pct + "%" }],
                    {
                        duration: 900,
                        easing: "cubic-bezier(0.22,1,0.36,1)",
                        fill: "forwards",
                    }
                );
                obs.unobserve(bar);
            });
        },
        { threshold: 0.35 }
    );
    bars.forEach((b) => barsObserver.observe(b));

    // Tabs filter
    const tabs = section.querySelectorAll('.skills-tab');
    const cols = section.querySelectorAll('.skills-col');

    let tabTimer = null;
    const DIM_DELAY = 140; // ms: mờ trước rồi mới nổi

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Cập nhật trạng thái nút
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');

            const filter = tab.dataset.filter; // 'all' | 'frontend' | 'backend' | 'devops' | 'ai'

            // Hủy timer cũ nếu người dùng bấm nhanh
            clearTimeout(tabTimer);

            // Bật cờ switching để chặn hover
            const container = section.querySelector('.skills-columns');
            container?.classList.add('is-switching');

            // Bước 1: mờ tất cả & bỏ active cũ
            cols.forEach(col => {
                col.classList.add('is-dimmed');
                col.classList.remove('is-active');
            });

            // Bước 2: sau một nhịp ngắn, làm nổi nhóm được chọn
            tabTimer = setTimeout(() => {
                cols.forEach(col => {
                    const match = (filter === 'all') || (col.dataset.group === filter);
                    if (match) {
                        col.classList.remove('is-dimmed');
                        // delay nhỏ để đảm bảo transition diễn ra sau khi bỏ mờ
                        requestAnimationFrame(() => col.classList.add('is-active'));
                    }
                });

                // Nếu là "All": không giữ active lâu – trả về trạng thái bình thường
                if (filter === 'all') {
                    // cho hiệu ứng “nổi” xuất hiện một chút rồi hạ xuống
                    setTimeout(() => {
                        cols.forEach(col => col.classList.remove('is-active'));
                    }, 220);
                }

                // Kết thúc chuyển tab
                setTimeout(() => container?.classList.remove('is-switching'), 260);
            }, DIM_DELAY);
        });
    });
}

/* ======================= CONTACT ======================= */
function initContact() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // TODO: đổi thành email của bạn
    const RECEIVER = "vandaihk17@gmail.com";

    // hiển thị email ở khối bên phải + nút copy
    const emailSpan = document.querySelector("[data-email]");
    if (emailSpan) emailSpan.textContent = RECEIVER;
    document.querySelector("[data-copy-email]")?.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(RECEIVER); toast("Copied!"); }
        catch { toast("Copy failed", true); }
    });

    const status = form.querySelector(".form-status");
    const msg = form.querySelector("#message");
    const count = document.getElementById("msgCount");
    const MAX = 1000;

    msg?.addEventListener("input", () => {
        count.textContent = String(msg.value.length);
    });

    // mở app mail trống
    document.getElementById("openMail")?.addEventListener("click", () => {
        window.location.href = `mailto:${RECEIVER}`;
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Honeypot
        if (form.querySelector('input[name="website"]').value.trim() !== "") return;

        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());

        // Validate email
        const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || "");
        if (!emailOk) return setStatus("Please enter a valid email.", true);

        // Compose mailto
        const subject = `Portfolio contact from ${data.name || "Recruiter"} – ${data.subject || "Inquiry"}`;
        const body = [
            `Name: ${data.name || ""}`,
            `Email: ${data.email || ""}`,
            data.company ? `Company: ${data.company}` : "",
            "",
            `${data.message || ""}`,
        ]
            .filter(Boolean)
            .join("\n");

        const url = `mailto:${RECEIVER}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open default mail client
        window.location.href = url;

        setStatus("Opening your email app…", false);
        form.reset();
        count.textContent = "0";
    });

    function setStatus(msg, isErr) {
        if (!status) return;
        status.textContent = msg;
        status.classList.toggle("err", !!isErr);
        status.classList.toggle("ok", !isErr);
    }

    // mini toast
    function toast(text, isErr = false) {
        setStatus(text, isErr);
        setTimeout(() => setStatus("", false), 1500);
    }
}
/* ======================= FOOTER ======================= */
function initFooter() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const btt = document.querySelector(".back-to-top");
    const THRESHOLD = 380;

    function toggleBtt() {
        if (!btt) return;
        if (window.scrollY > THRESHOLD) btt.classList.add("show");
        else btt.classList.remove("show");
    }
    window.addEventListener("scroll", toggleBtt, { passive: true });
    toggleBtt();

    btt?.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
    );
}

//Experience
document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.querySelector('.experience .exp-cards');
    if (!viewport) return;

    // Tránh build lại nếu đã có track (HMR/rehydrate)
    if (viewport.querySelector('.exp-track')) return;

    const speed = parseFloat(viewport.dataset.speed || '1.0'); // nhanh hơn một chút

    // Lấy các card ban đầu
    const cards = Array.from(viewport.children).filter(el => el.classList.contains('exp-card'));
    if (cards.length === 0) return;

    // Tạo track & chuyển card vào
    const track = document.createElement('div');
    track.className = 'exp-track';
    cards.forEach(c => track.appendChild(c));
    // Nhân đôi để loop mượt
    cards.forEach(c => track.appendChild(c.cloneNode(true)));
    viewport.appendChild(track);

    let paused = false;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = media.matches;
    media.addEventListener?.('change', e => { reduceMotion = e.matches; });

    const loop = () => {
        if (!paused && !reduceMotion) {
            viewport.scrollLeft += speed;
            const half = track.scrollWidth / 2;
            if (viewport.scrollLeft >= half) viewport.scrollLeft -= half;
        }
        requestAnimationFrame(loop);
    };
    loop();

    const hold = () => { paused = true; viewport.classList.add('is-holding'); };
    const release = () => { paused = false; viewport.classList.remove('is-holding'); };
    viewport.addEventListener('pointerdown', hold);
    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointerleave', release);
    viewport.addEventListener('pointercancel', release);

    document.addEventListener('visibilitychange', () => {
        paused = document.hidden ? true : false;
        viewport.classList.toggle('is-holding', paused);
    });
});
// ===== About: Read More toggle =====
(function () {
    const btn = document.getElementById('aboutToggle');
    const panel = document.getElementById('about-extra');
    if (!btn || !panel) return;

    // helper: mở panel với height mượt
    const openPanel = () => {
        panel.hidden = false;              // cho phép đo height
        panel.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.btn-label').textContent = 'Show Less';
    };

    const closePanel = () => {
        // set height hiện tại để tạo hiệu ứng đóng mượt
        panel.style.maxHeight = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
            panel.classList.remove('is-open');
            panel.style.maxHeight = '0px';
            btn.setAttribute('aria-expanded', 'false');
            btn.querySelector('.btn-label').textContent = 'Read More';
        });

        // sau khi transition xong mới hidden để không nhảy layout
        panel.addEventListener('transitionend', function onEnd(e) {
            if (e.propertyName === 'max-height' && !panel.classList.contains('is-open')) {
                panel.hidden = true;
                panel.removeEventListener('transitionend', onEnd);
            }
        });
    };

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            closePanel();
        } else {
            openPanel();
        }
    });

    // Nếu viewport đổi kích thước khi đang mở → cập nhật maxHeight
    window.addEventListener('resize', () => {
        if (btn.getAttribute('aria-expanded') === 'true') {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
    });
})();

// ===== YouTube Embed (custom controls) =====
(function () {
    const mockup = document.getElementById('yt-mockup');
    const playerEl = document.getElementById('yt-player');
    const btnPlay = document.getElementById('yt-center');
    const btnExp = document.getElementById('yt-expand');
    if (!mockup || !playerEl) return;

    // Tạo/đảm bảo backdrop sẵn sàng
    function ensureBackdrop() {
        // Ưu tiên dùng cái có sẵn trong DOM (class .video-backdrop)
        let bd = document.querySelector('.video-backdrop');
        if (!bd) {
            bd = document.createElement('div');
            bd.className = 'video-backdrop';
            document.body.appendChild(bd);
        }
        return bd;
    }

    // Nạp YT API nếu thiếu
    function loadYT(cb) {
        if (window.YT && window.YT.Player) return cb();
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onload = () => {
            const t = setInterval(() => {
                if (window.YT && window.YT.Player) { clearInterval(t); cb(); }
            }, 50);
        };
        document.head.appendChild(tag);
    }

    let ytPlayer;
    function initPlayer() {
        ytPlayer = new YT.Player('yt-player', {
            playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 0 },
            events: {
                onReady: () => setPlayIcon(true),
                onStateChange: (e) => {
                    if (e.data === YT.PlayerState.PLAYING) setPlayIcon(false);
                    if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) setPlayIcon(true);
                }
            }
        });
    }

    function setPlayIcon(paused) {
        const i = btnPlay?.querySelector('i');
        if (!i) return;
        i.className = paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    }

    function togglePlay() {
        if (!ytPlayer || !ytPlayer.getPlayerState) return;
        const st = ytPlayer.getPlayerState();
        if (st !== YT.PlayerState.PLAYING) {
            ytPlayer.mute();      // giúp auto-play inline mượt
            ytPlayer.playVideo();
        } else {
            ytPlayer.pauseVideo();
        }
    }

    btnPlay?.addEventListener('click', (e) => { e.preventDefault(); togglePlay(); });

    // Expand/Compress an toàn dù backdrop có/không
    function openExpand() {
        const backdrop = ensureBackdrop();
        mockup.classList.add('is-expanded');
        document.body.classList.add('modal-open');
        backdrop.classList.add('show');
        btnExp?.setAttribute('aria-label', 'Compress video');
        btnExp && (btnExp.innerHTML = '<i class="fa-solid fa-compress"></i>');

        // click backdrop để đóng
        backdrop.onclick = closeExpand;
    }

    function closeExpand() {
        const backdrop = document.querySelector('.video-backdrop');
        mockup.classList.remove('is-expanded');
        document.body.classList.remove('modal-open');
        backdrop?.classList.remove('show');
        btnExp?.setAttribute('aria-label', 'Expand video');
        btnExp && (btnExp.innerHTML = '<i class="fa-solid fa-expand"></i>');
        // xoá backdrop tạo động (chỉ khi nó không phải bản trong HTML)
        if (backdrop && !document.getElementById('yt-backdrop')) {
            // nếu bạn không giữ id cố định trong HTML thì backdrop do JS tạo
            setTimeout(() => backdrop.remove(), 250);
        }
    }

    btnExp?.addEventListener('click', (e) => {
        e.preventDefault();
        mockup.classList.contains('is-expanded') ? closeExpand() : openExpand();
    });

    // Hover: FIX mouseleave dùng remove (không để class dính)
    mockup.addEventListener('mouseenter', () => mockup.classList.add('show-controls'));
    mockup.addEventListener('mouseleave', () => mockup.classList.remove('show-controls'));

    loadYT(initPlayer);
})();





