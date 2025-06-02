// Apple 네비게이션 메뉴 인터랙션 - 충돌 방지 버전
class AppleNavigation {
  constructor() {
    this.globalnav = document.getElementById('globalnav');
    this.backdrop = document.getElementById('globalnav-backdrop');
    this.mainContent = document.querySelector('main');
    this.searchToggle = document.getElementById('search-toggle');
    this.bagToggle = document.getElementById('bag-toggle');
    this.searchFlyout = document.getElementById('search-flyout');
    this.bagFlyout = document.getElementById('bag-flyout');

    this.activeMenu = null;
    this.hoverTimeout = null;
    this.isNavigationActive = false;

    this.init();
  }

  init() {
    this.setupHoverMenus();
    this.setupClickMenus();
    this.setupEvents();
  }

  setupHoverMenus() {
    const hoverItems = document.querySelectorAll('.globalnav-item.has-dropdown');

    hoverItems.forEach(item => {
      // 마우스 진입 시
      item.addEventListener('mouseenter', () => {
        if (this.activeMenu === null && !this.isNavigationActive) {
          this.clearHoverTimeout();
          this.showHoverMenu();
          this.isNavigationActive = true;
        }
      });

      // 마우스 이탈 시
      item.addEventListener('mouseleave', () => {
        if (this.activeMenu === null) {
          this.setHoverTimeout(() => {
            this.hideHoverMenu();
            this.isNavigationActive = false;
          }, 150);
        }
      });
    });

    // 전체 네비게이션 영역 이탈 시
    if (this.globalnav) {
      this.globalnav.addEventListener('mouseleave', () => {
        if (this.activeMenu === null) {
          this.setHoverTimeout(() => {
            this.hideHoverMenu();
            this.isNavigationActive = false;
          }, 150);
        }
      });
    }
  }

  setupClickMenus() {
    if (this.searchToggle && this.searchFlyout) {
      this.searchToggle.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleClickMenu('search');
      });
    }

    if (this.bagToggle && this.bagFlyout) {
      this.bagToggle.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleClickMenu('bag');
      });
    }
  }

  setupEvents() {
    // ESC 키
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeAllMenus();
      }
    });

    // 배경 클릭
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => {
        this.closeAllMenus();
      });
    }

    // 외부 클릭
    document.addEventListener('click', e => {
      if (this.globalnav && !this.globalnav.contains(e.target)) {
        this.closeAllMenus();
      }
    });
  }

  showHoverMenu() {
    // 이미 활성화되어 있으면 중복 실행 방지
    if (
      this.isNavigationActive &&
      this.mainContent &&
      this.mainContent.classList.contains('blurred')
    ) {
      return;
    }

    // 메인 컨텐츠 블러
    if (this.mainContent && !this.mainContent.classList.contains('blurred')) {
      this.mainContent.classList.add('blurred');
    }

    // 배경 오버레이
    if (this.backdrop && !this.backdrop.classList.contains('active')) {
      this.backdrop.classList.add('active');
    }
  }

  hideHoverMenu() {
    // 클릭 메뉴가 활성화되어 있으면 블러 유지
    if (this.activeMenu !== null) {
      return;
    }

    // 메인 컨텐츠 블러 제거
    if (this.mainContent && this.mainContent.classList.contains('blurred')) {
      this.mainContent.classList.remove('blurred');
    }

    // 배경 오버레이 제거
    if (this.backdrop && this.backdrop.classList.contains('active')) {
      this.backdrop.classList.remove('active');
    }
  }

  toggleClickMenu(type) {
    if (this.activeMenu === type) {
      this.closeAllMenus();
      return;
    }

    this.closeAllMenus();

    if (type === 'search' && this.searchFlyout) {
      this.searchFlyout.classList.add('active');
      this.activeMenu = 'search';
      this.isNavigationActive = true;

      if (this.mainContent && !this.mainContent.classList.contains('blurred')) {
        this.mainContent.classList.add('blurred');
      }

      if (this.backdrop && !this.backdrop.classList.contains('active')) {
        this.backdrop.classList.add('active');
      }

      setTimeout(() => {
        const input = this.searchFlyout.querySelector('.globalnav-search-input');
        if (input) input.focus();
      }, 300);
    } else if (type === 'bag' && this.bagFlyout) {
      this.bagFlyout.classList.add('active');
      this.activeMenu = 'bag';
      this.isNavigationActive = true;

      if (this.mainContent && !this.mainContent.classList.contains('blurred')) {
        this.mainContent.classList.add('blurred');
      }

      if (this.backdrop && !this.backdrop.classList.contains('active')) {
        this.backdrop.classList.add('active');
      }
    }
  }

  closeAllMenus() {
    this.hideHoverMenu();

    if (this.searchFlyout) {
      this.searchFlyout.classList.remove('active');
    }
    if (this.bagFlyout) {
      this.bagFlyout.classList.remove('active');
    }

    this.activeMenu = null;
    this.isNavigationActive = false;

    // 강제로 블러 제거
    if (this.mainContent) {
      this.mainContent.classList.remove('blurred');
    }

    if (this.backdrop) {
      this.backdrop.classList.remove('active');
    }

    this.clearHoverTimeout();
  }

  setHoverTimeout(callback, delay) {
    this.clearHoverTimeout();
    this.hoverTimeout = setTimeout(callback, delay);
  }

  clearHoverTimeout() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }
}

// AppleTVCarousel과의 충돌 방지를 위한 초기화
// document.addEventListener('DOMContentLoaded', () => {
//   // AppleTVCarousel 초기화 (기존 코드 유지)
//   if (typeof AppleTVCarousel !== 'undefined') {
//     try {
//       new AppleTVCarousel();
//     } catch (error) {
//       console.log('AppleTVCarousel initialization skipped:', error);
//     }
//   }

//   // Apple 네비게이션 초기화 (약간의 지연을 두어 충돌 방지)
//   setTimeout(() => {
//     window.appleNav = new AppleNavigation();
//   }, 100);
// });

class AppleTVCarousel {
  constructor() {
    this.currentIndex = 0;
    this.items = document.querySelectorAll('.tv-item');
    this.indicators = document.querySelectorAll('.indicator');
    this.playToggle = document.getElementById('playToggle');
    this.navPrev = document.getElementById('navPrev');
    this.navNext = document.getElementById('navNext');
    this.isPlaying = true;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateSlides();
    this.startAutoPlay();
  }

  setupEventListeners() {
    // 인디케이터 클릭
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });

    // 재생/일시정지 토글
    this.playToggle.addEventListener('click', () => {
      this.togglePlay();
    });

    // 네비게이션 화살표
    this.navPrev.addEventListener('click', () => {
      this.previousSlide();
    });

    this.navNext.addEventListener('click', () => {
      this.nextSlide();
    });

    // 키보드 네비게이션
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        this.previousSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlides();
    this.updateIndicators();
    this.resetAutoPlay();
  }

  updateSlides() {
    this.items.forEach((item, index) => {
      // 모든 클래스 제거
      item.classList.remove('active', 'left', 'right', 'far-left', 'far-right');

      const diff = index - this.currentIndex;
      const totalItems = this.items.length;

      if (diff === 0) {
        item.classList.add('active');
      } else if (diff === -1 || (this.currentIndex === 0 && index === totalItems - 1)) {
        item.classList.add('left');
      } else if (diff === 1 || (this.currentIndex === totalItems - 1 && index === 0)) {
        item.classList.add('right');
      } else if (diff < -1 || (this.currentIndex <= 1 && index >= totalItems - 1)) {
        item.classList.add('far-left');
      } else {
        item.classList.add('far-right');
      }
    });
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateSlides();
    this.updateIndicators();
    this.resetAutoPlay();
  }

  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateSlides();
    this.updateIndicators();
    this.resetAutoPlay();
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;

    const pauseIcon = this.playToggle.querySelector('.pause-icon');
    const playIcon = this.playToggle.querySelector('.play-icon');

    if (this.isPlaying) {
      pauseIcon.classList.remove('hidden');
      playIcon.classList.add('hidden');
      this.startAutoPlay();
    } else {
      pauseIcon.classList.add('hidden');
      playIcon.classList.remove('hidden');
      this.stopAutoPlay();
    }
  }

  startAutoPlay() {
    if (this.autoPlayInterval || !this.isPlaying) return;

    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    if (this.isPlaying) {
      setTimeout(() => {
        this.startAutoPlay();
      }, 2000);
    }
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  new AppleTVCarousel();
});
