/**
 * 粉色妖精小姐的秘密基地 - 公共脚本
 * 提供：导航栏、花瓣背景、音乐播放、manifest 加载
 */

/* ============ 花瓣飘落 ============ */
function initPetals() {
    let container = document.getElementById('petal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'petal-container';
        container.className = 'petal-fall';
        document.body.prepend(container);
    }
    const count = window.innerWidth < 768 ? 8 : 18;
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = Math.random() * 18 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 10 + 12) + 's';
        petal.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(petal);
    }
}

/* ============ 导航栏 ============ */
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
        // 点击链接后关闭菜单
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }
}

/* ============ 音乐播放（跨页面同步） ============
 * sessionStorage  → 同标签页内续播（保存播放位置）
 * localStorage    → 跨标签页共享静音状态
 * BroadcastChannel → 跨标签页互斥播放（同一时间只有一个标签页放音乐）
 */
function initMusic() {
    const audio = document.getElementById('bgm');
    const btn = document.getElementById('volumeBtn');
    if (!audio || !btn) return;

    const icon = btn.querySelector('i');
    const POS_KEY = 'bgmPosition';
    const MUTE_KEY = 'bgmMuted';

    /* --- BroadcastChannel: 跨标签页互斥 --- */
    let bc = null;
    try { bc = new BroadcastChannel('bgm_sync'); } catch(e) {}

    if (bc) {
        bc.onmessage = e => {
            if (e.data === 'playing') {
                /* 其他标签页开始播放了，本页暂停 */
                audio.pause();
            }
        };
    }

    function notifyPlaying() {
        if (bc) bc.postMessage('playing');
    }

    /* --- 静音状态（localStorage，跨标签页） --- */
    function syncIcon() {
        const muted = localStorage.getItem(MUTE_KEY) === 'true';
        audio.muted = muted;
        icon.className = muted ? 'fas fa-volume-mute' : 'fas fa-music';
    }

    btn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        localStorage.setItem(MUTE_KEY, audio.muted);
        syncIcon();
    });

    window.addEventListener('storage', e => {
        if (e.key === MUTE_KEY) syncIcon();
    });

    /* --- 播放位置同步（sessionStorage，同标签页） --- */
    function savePosition() {
        if (!audio.paused && audio.currentTime > 0) {
            sessionStorage.setItem(POS_KEY, String(audio.currentTime));
        }
    }

    function restorePosition() {
        const saved = sessionStorage.getItem(POS_KEY);
        if (saved) audio.currentTime = parseFloat(saved);
    }

    window.addEventListener('beforeunload', savePosition);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) savePosition();
    });
    setInterval(savePosition, 3000);

    /* --- 初始化 --- */
    syncIcon();
    restorePosition();

    audio.play().then(() => {
        notifyPlaying();
    }).catch(() => {
        const resume = () => {
            restorePosition();
            audio.play().then(() => notifyPlaying()).catch(() => {});
        };
        window.addEventListener('click', resume, { once: true });
        window.addEventListener('touchstart', resume, { once: true });
    });
}

/* ============ Manifest 加载工具 ============ */

/**
 * 加载 manifest.json 并返回数据
 * @param {string} url - manifest.json 的路径
 * @returns {Promise<Array>} 条目数组
 */
async function loadManifest(url) {
    try {
        const resp = await fetch(url + '?t=' + Date.now());
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        return Array.isArray(data) ? data : (data.items || []);
    } catch (e) {
        console.warn('加载 manifest 失败:', url, e);
        return [];
    }
}

/**
 * 通用卡片渲染器
 * @param {Array} items - 条目数组
 * @param {HTMLElement} container - 容器元素
 * @param {Function} cardFn - (item) => HTMLString
 */
function renderCards(items, container, cardFn) {
    if (!items.length) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>暂无内容，敬请期待～</p></div>';
        return;
    }
    container.innerHTML = items.map(cardFn).join('');
}

/* ============ 滚动动画 ============ */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .section-title').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

/* ============ Canvas roundRect polyfill ============ */
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
        const r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
    };
}

/* ============ 初始化 ============ */
document.addEventListener('DOMContentLoaded', () => {
    initPetals();
    initNavbar();
    initMusic();
    initScrollAnimations();
});
