/**
 * 粉色妖精小姐的秘密基地 - 公共脚本 (优化版)
 * 改进：
 * - 花瓣改为纯 CSS 动画（不再 JS 创建 DOM + 内联样式）
 * - 移除 setInterval 轮询，改用 beforeunload + visibilitychange
 * - 音乐播放增加更好的用户交互引导
 * - 添加 IntersectionObserver disconnect
 * - 减少全局变量
 */

/* ============ 花瓣飘落 ============ */
function initPetals() {
    let container = document.getElementById('petal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'petal-container';
        container.className = 'petal-fall';
        // 创建 18 个花瓣（纯 CSS 控制动画，无需内联样式）
        container.innerHTML = Array.from({ length: 18 }, () => '<div class="petal"></div>').join('');
        document.body.prepend(container);
    }
}

/* ============ 导航栏 ============ */
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // 点击链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // 点击外部关闭菜单
    document.addEventListener('click', e => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('open');
        }
    });
}

/* ============ 音乐播放（跨页面同步） ============ */
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
            if (e.data === 'playing') audio.pause();
        };
    }

    function notifyPlaying() {
        if (bc) bc.postMessage('playing');
    }

    /* --- 静音状态 --- */
    function syncIcon() {
        const muted = localStorage.getItem(MUTE_KEY) === 'true';
        audio.muted = muted;
        icon.className = muted ? 'fas fa-volume-mute' : 'fas fa-music';
        btn.setAttribute('aria-label', muted ? '取消静音' : '静音');
    }

    btn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        localStorage.setItem(MUTE_KEY, audio.muted);
        syncIcon();
        // 如果取消静音且未在播放，尝试播放
        if (!audio.muted && audio.paused) {
            audio.play().then(notifyPlaying).catch(() => {});
        }
    });

    window.addEventListener('storage', e => {
        if (e.key === MUTE_KEY) syncIcon();
    });

    /* --- 播放位置同步（仅保存，不轮询） --- */
    function savePosition() {
        if (!audio.paused && audio.currentTime > 0) {
            sessionStorage.setItem(POS_KEY, String(audio.currentTime));
        }
    }

    function restorePosition() {
        const saved = sessionStorage.getItem(POS_KEY);
        if (saved) audio.currentTime = parseFloat(saved);
    }

    // 仅在页面卸载和隐藏时保存，不再用 setInterval
    window.addEventListener('beforeunload', savePosition);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) savePosition();
    });

    /* --- 初始化 --- */
    syncIcon();
    restorePosition();

    audio.play().then(() => {
        notifyPlaying();
    }).catch(() => {
        // 自动播放被阻止，等待用户交互
        const resume = () => {
            restorePosition();
            audio.play().then(() => notifyPlaying()).catch(() => {});
        };
        window.addEventListener('click', resume, { once: true });
        window.addEventListener('touchstart', resume, { once: true });
    });
}

/* ============ Manifest 加载工具 ============ */
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
 */
function renderCards(items, container, cardFn) {
    if (!items.length) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>暂无内容，敬请期待～</p></div>';
        return;
    }
    // 用 DocumentFragment 减少 reflow
    const fragment = document.createDocumentFragment();
    const temp = document.createElement('div');
    temp.innerHTML = items.map(cardFn).join('');
    while (temp.firstChild) {
        fragment.appendChild(temp.firstChild);
    }
    container.innerHTML = '';
    container.appendChild(fragment);
}

/* ============ 滚动动画 ============ */
function initScrollAnimations() {
    const targets = document.querySelectorAll('.card, .section-title');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });

    // 页面卸载时断开观察器
    window.addEventListener('beforeunload', () => observer.disconnect());
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