/**
 * BÁNH XÈO TÔM NHẢY BA THI - ĐẶC SẢN BÌNH ĐỊNH
 * Main JavaScript (script.js) - Vanilla JS, Clean, No Framework
 * Compatible with standard HTML5, WordPress, Elementor, and Gutenberg
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ==========================================================================
     1. THIẾT LẬP CẤU HÌNH & TRACKING ADS (DỄ THAY ĐỔI)
     ========================================================================== */
  const BA_THI_CONFIG = {
    // Hotline chính
    HOTLINE_PRIMARY: '0984475767',
    HOTLINE_BRANCH_1: '0984475767',
    HOTLINE_BRANCH_2: '0989410677',
    
    // Placeholder liên kết Zalo (Bạn có thể thay URL Zalo tại đây)
    ZALO_URL: 'ZALO_LINK_HERE', // Thay bằng link Zalo thật: ví dụ https://zalo.me/0984475767
    
    // Mạng xã hội chính thức
    FACEBOOK_URL: 'https://www.facebook.com/thibang.banhxeo/',
    TIKTOK_URL: 'https://www.tiktok.com/@baconnhaongthi/',
    EMAIL: 'chiaki1409@gmail.com',

    // Placeholder mã tracking quảng cáo (Meta Ads / TikTok Ads / Google GA4)
    META_PIXEL_ID: 'META_PIXEL_ID',
    TIKTOK_PIXEL_ID: 'TIKTOK_PIXEL_ID',
    GA4_MEASUREMENT_ID: 'GA4_MEASUREMENT_ID'
  };

  /**
   * Bộ theo dõi sự kiện chuyển đổi (Tracking Conversion Hook)
   * Tự động gửi event sang GA4, Meta Pixel và TikTok Pixel nếu đã tích hợp mã
   */
  function trackConversionEvent(eventName, eventData) {
    // Log console để nhà quảng cáo kiểm tra
    console.log(`[BaThi Tracking] Event: ${eventName}`, eventData);

    // 1. Google Analytics 4 (GA4)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventData);
    }

    // 2. Meta Pixel (Facebook)
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, eventData);
    }

    // 3. TikTok Pixel
    if (typeof window.ttq === 'object' && typeof window.ttq.track === 'function') {
      window.ttq.track(eventName, eventData);
    }
  }

  /* ==========================================================================
     2. GẮN SỰ KIỆN CLICK CHO CÁC CLASS CTA (.cta-call, .cta-zalo, ...)
     ========================================================================== */
  // CTA Gọi điện (Hotline)
  const callButtons = document.querySelectorAll('.cta-call');
  callButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      trackConversionEvent('Click_Call_Hotline', {
        label: this.getAttribute('data-branch') || 'General_Hotline',
        phone: this.getAttribute('href') || 'tel:' + BA_THI_CONFIG.HOTLINE_PRIMARY
      });
    });
  });

  // CTA Chat Zalo
  const zaloButtons = document.querySelectorAll('.cta-zalo');
  zaloButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      trackConversionEvent('Click_Chat_Zalo', {
        source: this.getAttribute('data-source') || 'CTA_Button'
      });

      // Nếu đang dùng placeholder ZALO_LINK_HERE, hiện thông báo hướng dẫn
      if (BA_THI_CONFIG.ZALO_URL === 'ZALO_LINK_HERE') {
        e.preventDefault();
        showToast('Đang kết nối Zalo quán (Placeholder: ZALO_LINK_HERE)...');
        // Mở fallback hotline Zalo nếu cần
        setTimeout(() => {
          window.open('https://zalo.me/' + BA_THI_CONFIG.HOTLINE_PRIMARY, '_blank');
        }, 600);
      }
    });
  });

  // CTA Facebook
  const fbButtons = document.querySelectorAll('.cta-facebook');
  fbButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      trackConversionEvent('Click_Social_Facebook', {
        url: BA_THI_CONFIG.FACEBOOK_URL
      });
    });
  });

  // CTA TikTok
  const tiktokButtons = document.querySelectorAll('.cta-tiktok');
  tiktokButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      trackConversionEvent('Click_Social_TikTok', {
        url: BA_THI_CONFIG.TIKTOK_URL
      });
    });
  });

  /* ==========================================================================
     3. MENU DI ĐỘNG (MOBILE HAMBURGER & DRAWER)
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggleBtn && mobileDrawer) {
    function toggleDrawer() {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        mobileDrawer.classList.remove('is-open');
        menuToggleBtn.classList.remove('is-active');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileDrawer.classList.add('is-open');
        menuToggleBtn.classList.add('is-active');
        menuToggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    }

    menuToggleBtn.addEventListener('click', toggleDrawer);

    // Đóng drawer khi nhấn vào link bất kỳ
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link, .btn');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (mobileDrawer.classList.contains('is-open')) {
          toggleDrawer();
        }
      });
    });

    // Đóng khi nhấn phím ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleDrawer();
      }
    });
  }

  /* ==========================================================================
     4. LỌC DANH MỤC THỰC ĐƠN (MENU CATEGORY TABS)
     ========================================================================== */
  const menuTabs = document.querySelectorAll('.menu-tab-btn');
  const foodItems = document.querySelectorAll('.food-card-item');

  if (menuTabs.length && foodItems.length) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        // Cập nhật trạng thái tab
        menuTabs.forEach(t => t.classList.remove('is-active'));
        this.classList.add('is-active');

        const category = this.getAttribute('data-category');

        // Lọc hiển thị món ăn
        foodItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });

        trackConversionEvent('Filter_Menu_Category', { category: category });
      });
    });
  }

  /* ==========================================================================
     5. HIỆU ỨNG HEADER STICKY KHI CUỘN TRANG
     ========================================================================== */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     6. SMOOTH SCROLL KÈM TRỪ HAO CHIỀU CAO HEADER
     ========================================================================== */
  const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  internalLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     7. TOAST THÔNG BÁO TIỆN ÍCH (TƯƠNG TÁC NHẸ NHÀNG)
     ========================================================================== */
  let toastTimeout = null;
  function showToast(message) {
    let toast = document.getElementById('siteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.className = 'site-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Khởi tạo trạng thái ban đầu
  console.log('Bánh Xèo Tôm Nhảy Ba Thi website script loaded successfully.');
});
