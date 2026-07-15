/**
 * Urban Taste Digital Menu Website
 * Core Client-side Logic & Interactions
 */

// Application State
const state = {
  menuData: null,
  language: localStorage.getItem('urbantaste_lang') || 'en',
  theme: localStorage.getItem('urbantaste_theme') || 'dark',
  selectedCategory: 'all',
  searchQuery: ''
};

// DOM Cache
const dom = {
  html: document.documentElement,
  header: document.querySelector('.main-header'),
  langToggle: document.getElementById('lang-toggle'),
  langLabel: document.getElementById('lang-label'),
  themeToggle: document.getElementById('theme-toggle'),
  
  // Hero
  heroWelcome: document.getElementById('hero-welcome-badge'),
  heroTitleName: document.getElementById('hero-title-name'),
  heroDesc: document.getElementById('hero-desc'),
  heroCtaBtn: document.getElementById('hero-cta-btn'),
  heroCtaText: document.getElementById('hero-cta-text'),
  
  // Controls
  searchInput: document.getElementById('search-input'),
  searchClear: document.getElementById('search-clear'),
  categoriesNav: document.getElementById('categories-nav'),
  resultsCount: document.getElementById('results-count'),
  
  // Grid & Empty
  menuGrid: document.getElementById('menu-grid'),
  emptyState: document.getElementById('empty-state'),
  emptyTitle: document.getElementById('empty-title'),
  emptyDesc: document.getElementById('empty-desc'),
  
  // Footer
  footerTagline: document.getElementById('footer-tagline'),
  footerContactTitle: document.getElementById('footer-contact-title'),
  footerPhoneVal: document.getElementById('footer-phone-val'),
  footerEmailVal: document.getElementById('footer-email-val'),
  footerEmailLink: document.getElementById('footer-email-link'),
  footerAddressVal: document.getElementById('footer-address-val'),
  footerFollowTitle: document.getElementById('footer-follow-title'),
  footerCopyrightName: document.getElementById('footer-copyright-name'),
  
  // Social links
  linkFacebook: document.getElementById('link-facebook'),
  linkInstagram: document.getElementById('link-instagram'),
  linkWhatsapp: document.getElementById('link-whatsapp'),
  
  // Scroll to top
  scrollTopBtn: document.getElementById('scroll-top')
};

/* ==========================================================================
   INITIALIZATION & DATA FETCHING
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  fetchMenuData();
  setupEventListeners();
});

// Fallback menu data for local previews (when double-clicking index.html directly)
const DEFAULT_MENU_DATA = {
  "restaurant_name": {
    "en": "Urban Taste",
    "ar": "أوربان تيست"
  },
  "restaurant_subname": {
    "en": "Restaurant & Cafe",
    "ar": "مطعم ومقهى"
  },
  "restaurant_description": {
    "en": "A modern culinary experience offering gourmet meals, premium specialty coffee, artisanal drinks, and handcrafted desserts.",
    "ar": "تجربة طهي عصرية تقدم وجبات فاخرة، قهوة مختصة ممتازة، مشروبات مبتكرة، وحلويات مصنوعة يدويًا."
  },
  "contact": {
    "phone": "+966510571307",
    "email": "ahmedrefaat11996@gmail.com",
    "address": {
      "en": "Mansoura, Egypt",
      "ar": "المنصورة، مصر"
    },
    "socials": {
      "facebook": "https://facebook.com/urbantaste",
      "instagram": "https://instagram.com/urbantaste",
      "whatsapp": "https://wa.me/966510571307"
    }
  },
  "interface": {
    "search_placeholder": {
      "en": "Search our delicious menu...",
      "ar": "ابحث في قائمتنا الشهية..."
    },
    "all_categories": {
      "en": "All",
      "ar": "الكل"
    },
    "currency": {
      "en": "EGP",
      "ar": "ج.م"
    },
    "no_items_found": {
      "en": "No items found matching your search.",
      "ar": "لم يتم العثور على أطباق تطابق بحثك."
    },
    "view_menu_btn": {
      "en": "Explore Menu",
      "ar": "استكشف القائمة"
    },
    "footer_tagline": {
      "en": "Crafted with passion, served with love.",
      "ar": "صُنع بشغف، ويُقدّم بكل حب."
    },
    "footer_contact_title": {
      "en": "Contact Us",
      "ar": "اتصل بنا"
    },
    "footer_follow_title": {
      "en": "Follow Us",
      "ar": "تابعنا"
    },
    "hero_welcome_badge": {
      "en": "Welcome to",
      "ar": "مرحباً بكم في"
    },
    "empty_title": {
      "en": "No items found",
      "ar": "لم يتم العثور على أطباق"
    },
    "empty_desc": {
      "en": "Try checking your spelling or adjusting filters.",
      "ar": "حاول التحقق من الإملاء أو ضبط الفلاتر."
    }
  },
  "categories": [
    {
      "id": "hot-drinks",
      "name": {
        "en": "Hot Drinks",
        "ar": "مشروبات ساخنة"
      }
    },
    {
      "id": "cold-drinks",
      "name": {
        "en": "Cold Drinks",
        "ar": "مشروبات باردة"
      }
    },
    {
      "id": "main-meals",
      "name": {
        "en": "Main Meals",
        "ar": "وجبات رئيسية"
      }
    },
    {
      "id": "desserts",
      "name": {
        "en": "Desserts",
        "ar": "حلويات"
      }
    }
  ],
  "items": [
    {
      "id": "espresso",
      "category": "hot-drinks",
      "name": {
        "en": "Espresso",
        "ar": "إسبريسو"
      },
      "description": {
        "en": "Rich and bold single shot of espresso made from premium Arabica beans.",
        "ar": "جرعة إسبريسو غنية وقوية محضرة من حبوب أرابيكا الفاخرة."
      },
      "price": 50,
      "badge": {
        "en": "Pure",
        "ar": "نقي"
      }
    },
    {
      "id": "cappuccino",
      "category": "hot-drinks",
      "name": {
        "en": "Cappuccino",
        "ar": "كابوتشينو"
      },
      "description": {
        "en": "Perfect balance of espresso, steamed milk, and a thick layer of creamy foam.",
        "ar": "توازن مثالي بين الإسبريسو والحليب المبخر وطبقة غنية من الرغوة الكريمية."
      },
      "price": 70,
      "badge": null
    },
    {
      "id": "latte",
      "category": "hot-drinks",
      "name": {
        "en": "Latte",
        "ar": "لاتيه"
      },
      "description": {
        "en": "Smooth espresso combined with steamed milk and a light layer of microfoam.",
        "ar": "إسبريسو سلس ممزوج بالحليب المبخر وطبقة خفيفة من رغوة الحليب الدقيقة."
      },
      "price": 80,
      "badge": {
        "en": "Popular",
        "ar": "شائع"
      }
    },
    {
      "id": "iced-coffee",
      "category": "cold-drinks",
      "name": {
        "en": "Iced Coffee",
        "ar": "قهوة مثلجة"
      },
      "description": {
        "en": "Chilled espresso poured over ice and blended with cold milk and sweet syrup.",
        "ar": "إسبريسو مبرد يسكب فوق الثلج ويمزج مع الحليب البارد والشراب الحلو."
      },
      "price": 85,
      "badge": {
        "en": "Best Seller",
        "ar": "الأكثر مبيعاً"
      }
    },
    {
      "id": "mojito",
      "category": "cold-drinks",
      "name": {
        "en": "Mojito",
        "ar": "موهيتو"
      },
      "description": {
        "en": "Refreshing mocktail with fresh mint leaves, lime slices, sugar, and sparkling water.",
        "ar": "كوكتيل منعش مع أوراق النعناع الطازجة، شرائح الليمون، السكر، والمياه الفوارة."
      },
      "price": 75,
      "badge": {
        "en": "Refreshing",
        "ar": "منعش"
      }
    },
    {
      "id": "orange-juice",
      "category": "cold-drinks",
      "name": {
        "en": "Fresh Orange Juice",
        "ar": "عصير برتقال طازج"
      },
      "description": {
        "en": "100% freshly squeezed sweet and citrusy local oranges served chilled.",
        "ar": "عصير برتقال محلي طازج ومعصور بنسبة 100٪ يقدم مبرداً."
      },
      "price": 65,
      "badge": null
    },
    {
      "id": "classic-burger",
      "category": "main-meals",
      "name": {
        "en": "Classic Burger",
        "ar": "كلاسيك برجر"
      },
      "description": {
        "en": "Premium grilled beef patty topped with lettuce, tomatoes, onions, cheese, and our special sauce.",
        "ar": "شريحة لحم بقري فاخرة مشوية تعلوها خس، طماطم، بصل، جبنة، وصلصتنا الخاصة."
      },
      "price": 180,
      "badge": null
    },
    {
      "id": "chicken-burger",
      "category": "main-meals",
      "name": {
        "en": "Chicken Burger",
        "ar": "برجر دجاج"
      },
      "description": {
        "en": "Crispy golden fried chicken breast, pickles, shredded lettuce, and creamy ranch dressing.",
        "ar": "صدر دجاج مقلي ومقرمش ذهبي، مخلل، خس مبشور، وصلصة رانش كريمية."
      },
      "price": 170,
      "badge": {
        "en": "Crispy",
        "ar": "مقرمش"
      }
    },
    {
      "id": "margherita-pizza",
      "category": "main-meals",
      "name": {
        "en": "Margherita Pizza",
        "ar": "بيتزا مارغريتا"
      },
      "description": {
        "en": "Authentic stone-baked pizza topped with aromatic tomato sauce, fresh mozzarella, and fresh basil.",
        "ar": "بيتزا إيطالية أصلية مخبوزة على الحجر تعلوها صلصة طماطم عطرية، موزاريلا طازجة، وريحان طازج."
      },
      "price": 220,
      "badge": {
        "en": "Chef's Special",
        "ar": "مميز"
      }
    },
    {
      "id": "cheesecake",
      "category": "desserts",
      "name": {
        "en": "Cheesecake",
        "ar": "تشيز كيك"
      },
      "description": {
        "en": "Creamy New York-style cheesecake on a buttery graham cracker crust, topped with strawberry sauce.",
        "ar": "تشيز كيك نيويورك الكريمية على طبقة بسكويت غنية بالزبدة، مغطاة بصلصة الفراولة."
      },
      "price": 120,
      "badge": {
        "en": "New",
        "ar": "جديد"
      }
    },
    {
      "id": "chocolate-cake",
      "category": "desserts",
      "name": {
        "en": "Chocolate Cake",
        "ar": "كعكة الشوكولاتة"
      },
      "description": {
        "en": "Decadent and moist double chocolate fudge cake served warm with chocolate drizzle.",
        "ar": "كعكة شوكولاتة مضاعفة غنية ورطبة تقدم دافئة مع رذاذ الشوكولاتة اللذيذ."
      },
      "price": 110,
      "badge": {
        "en": "Indulgent",
        "ar": "فاخر"
      }
    }
  ]
};

// Fetch menu data from separate JSON file (with fallback for local file:// previews due to browser CORS rules)
async function fetchMenuData() {
  try {
    const response = await fetch('./menu.json');
    if (!response.ok) {
      throw new Error(`Failed to load menu data: ${response.statusText}`);
    }
    state.menuData = await response.json();
    console.log('Menu loaded successfully from menu.json');
  } catch (error) {
    console.warn('Unable to fetch menu.json (expected if opened directly via double-clicking index.html). Falling back to embedded menu data.', error);
    // Use embedded fallback data so the site works perfectly on file:// protocol
    state.menuData = DEFAULT_MENU_DATA;
  } finally {
    if (state.menuData) {
      // Initialize Interface Rendering
      updateLanguageInterface();
      renderCategories();
      renderMenu();
    } else {
      showErrorState();
    }
  }
}

// Show a fallback error state inside the menu grid if fetch fails
function showErrorState() {
  dom.menuGrid.innerHTML = '';
  dom.emptyState.style.display = 'flex';
  dom.emptyTitle.textContent = state.language === 'en' ? 'Unable to load menu' : 'تعذر تحميل القائمة';
  dom.emptyDesc.textContent = state.language === 'en' 
    ? 'Please check your connection and refresh the page.' 
    : 'يرجى التحقق من اتصالك وإعادة تحميل الصفحة.';
}

/* ==========================================================================
   THEME CONTROLLER
   ========================================================================== */

function initTheme() {
  // Apply saved theme state
  dom.html.setAttribute('data-theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  dom.html.setAttribute('data-theme', state.theme);
  localStorage.setItem('urbantaste_theme', state.theme);
}

/* ==========================================================================
   TRANSLATION & LANGUAGE CONTROLLER
   ========================================================================== */

function toggleLanguage() {
  state.language = state.language === 'en' ? 'ar' : 'en';
  localStorage.setItem('urbantaste_lang', state.language);
  
  // Update view
  updateLanguageInterface();
  renderCategories();
  renderMenu();
}

function updateLanguageInterface() {
  const data = state.menuData;
  if (!data) return;

  const lang = state.language;
  const isRtl = lang === 'ar';

  // Apply LTR/RTL attributes
  dom.html.setAttribute('lang', lang);
  dom.html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

  // Document Title
  document.title = `${data.restaurant_name[lang]} | ${data.restaurant_subname[lang]}`;

  // Logo Split
  const nameParts = data.restaurant_name[lang].split(' ');
  const firstPart = nameParts[0] || '';
  const secondPart = nameParts.slice(1).join(' ') || '';
  
  const accentEl = document.getElementById('nav-brand-accent');
  const mainEl = document.getElementById('nav-brand-main');
  if (accentEl) accentEl.textContent = firstPart + ' ';
  if (mainEl) mainEl.textContent = secondPart;

  // Language Switch Label (Shows the OTHER language name)
  dom.langLabel.textContent = isRtl ? 'English' : 'العربية';
  dom.langToggle.setAttribute('data-next-lang', isRtl ? 'en' : 'ar');

  // Hero Section
  dom.heroWelcome.textContent = data.interface.hero_welcome_badge[lang];
  dom.heroTitleName.textContent = data.restaurant_name[lang];
  dom.heroDesc.textContent = data.restaurant_description[lang];
  dom.heroCtaText.textContent = data.interface.view_menu_btn[lang];

  // Search Input placeholder
  dom.searchInput.placeholder = data.interface.search_placeholder[lang];

  // Footer Details
  dom.footerTagline.textContent = data.interface.footer_tagline[lang];
  dom.footerContactTitle.textContent = data.interface.footer_contact_title[lang];
  dom.footerPhoneVal.textContent = data.contact.phone;
  if (dom.footerEmailVal && data.contact.email) dom.footerEmailVal.textContent = data.contact.email;
  dom.footerAddressVal.textContent = data.contact.address[lang];
  dom.footerFollowTitle.textContent = data.interface.footer_follow_title[lang];
  dom.footerCopyrightName.textContent = data.restaurant_name[lang];

  // Empty State translations
  dom.emptyTitle.textContent = data.interface.empty_title[lang];
  dom.emptyDesc.textContent = data.interface.empty_desc[lang];

  // Links href updates from metadata
  dom.footerPhoneVal.parentElement.setAttribute('href', `tel:${data.contact.phone}`);
  if (dom.footerEmailLink && data.contact.email) dom.footerEmailLink.setAttribute('href', `mailto:${data.contact.email}`);
  dom.footerAddressVal.parentElement.setAttribute('href', `https://maps.google.com/?q=${encodeURIComponent(data.contact.address[lang])}`);
  dom.linkFacebook.setAttribute('href', data.contact.socials.facebook);
  dom.linkInstagram.setAttribute('href', data.contact.socials.instagram);
  dom.linkWhatsapp.setAttribute('href', data.contact.socials.whatsapp);
}

/* ==========================================================================
   CATEGORIES RENDER
   ========================================================================== */

function renderCategories() {
  const data = state.menuData;
  if (!data) return;

  const lang = state.language;
  dom.categoriesNav.innerHTML = '';

  // Create 'All' category button
  const allBtn = document.createElement('button');
  allBtn.className = `category-pill ${state.selectedCategory === 'all' ? 'active' : ''}`;
  allBtn.textContent = data.interface.all_categories[lang];
  allBtn.setAttribute('data-category', 'all');
  allBtn.addEventListener('click', () => selectCategory('all'));
  dom.categoriesNav.appendChild(allBtn);

  // Create button for each category in config
  data.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-pill ${state.selectedCategory === cat.id ? 'active' : ''}`;
    btn.textContent = cat.name[lang];
    btn.setAttribute('data-category', cat.id);
    btn.addEventListener('click', () => selectCategory(cat.id));
    dom.categoriesNav.appendChild(btn);
  });
  
  // Automatically adjust scroll inside category strip to active pill
  scrollActiveCategoryIntoView();
}

function selectCategory(categoryId) {
  state.selectedCategory = categoryId;
  
  // Highlight active pill
  const pills = dom.categoriesNav.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    if (pill.getAttribute('data-category') === categoryId) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  scrollActiveCategoryIntoView();
  renderMenu();
}

function scrollActiveCategoryIntoView() {
  const activePill = dom.categoriesNav.querySelector('.category-pill.active');
  if (activePill) {
    activePill.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
}

/* ==========================================================================
   MENU RENDER
   ========================================================================== */

function renderMenu() {
  const data = state.menuData;
  if (!data) return;

  const lang = state.language;
  const grid = dom.menuGrid;
  const emptyState = dom.emptyState;
  const countEl = dom.resultsCount;

  // Clear existing items / shimmer skeletons
  grid.innerHTML = '';

  // Filter logic
  const filteredItems = data.items.filter(item => {
    // Category check
    const matchesCategory = state.selectedCategory === 'all' || item.category === state.selectedCategory;
    
    // Search query check
    const query = state.searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const name = (item.name[lang] || '').toLowerCase();
    const desc = (item.description[lang] || '').toLowerCase();
    const matchesSearch = name.includes(query) || desc.includes(query);

    return matchesCategory && matchesSearch;
  });

  // Render results meta information
  if (state.searchQuery || state.selectedCategory !== 'all') {
    const total = filteredItems.length;
    let countText = '';
    if (lang === 'en') {
      countText = `Showing ${total} item${total !== 1 ? 's' : ''}`;
    } else {
      if (total === 0) {
        countText = 'لا توجد أطباق تطابق بحثك';
      } else if (total === 1) {
        countText = 'عرض طبق واحد';
      } else if (total === 2) {
        countText = 'عرض طبقين';
      } else if (total >= 3 && total <= 10) {
        countText = `عرض ${total} أطباق`;
      } else {
        countText = `عرض ${total} طبقاً`;
      }
    }
    countEl.textContent = countText;
    countEl.style.display = 'block';
  } else {
    countEl.style.display = 'none';
  }

  // Handle empty state
  if (filteredItems.length === 0) {
    emptyState.style.display = 'flex';
    return;
  }
  emptyState.style.display = 'none';

  // Build and render cards with cascading entrance stagger
  filteredItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    
    // Check for custom tags/badges
    const badgeText = item.badge ? item.badge[lang] : null;
    
    // Get translated category label
    const itemCatObj = data.categories.find(c => c.id === item.category);
    const categoryName = itemCatObj ? itemCatObj.name[lang] : '';

    card.innerHTML = `
      <div class="card-top">
        <span class="card-category-badge">${categoryName}</span>
        ${badgeText ? `<span class="card-badge">${badgeText}</span>` : ''}
      </div>
      <div class="card-header-main">
        <div class="card-title-row">
          <h3 class="card-title">${item.name[lang]}</h3>
          <span class="card-price">${item.price} ${data.interface.currency[lang]}</span>
        </div>
        <p class="card-description" title="${item.description[lang]}">${item.description[lang]}</p>
      </div>
    `;

    grid.appendChild(card);

    // Staggered entrance animation trigger
    setTimeout(() => {
      card.classList.add('show');
    }, index * 50);
  });
}

/* ==========================================================================
   EVENT LISTENERS & HANDLERS
   ========================================================================== */

function setupEventListeners() {
  // Theme Switching
  dom.themeToggle.addEventListener('click', toggleTheme);

  // Language Toggling
  dom.langToggle.addEventListener('click', toggleLanguage);

  // Search input typing handler
  dom.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    
    // Toggle Search Clear Button visibility
    if (state.searchQuery.length > 0) {
      dom.searchClear.style.display = 'flex';
    } else {
      dom.searchClear.style.display = 'none';
    }
    
    renderMenu();
  });

  // Clear search query
  dom.searchClear.addEventListener('click', () => {
    dom.searchInput.value = '';
    state.searchQuery = '';
    dom.searchClear.style.display = 'none';
    dom.searchInput.focus();
    renderMenu();
  });

  // Scroll details (Sticky headers styling + Back to top button visibility)
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Header shadow on scroll
    if (scrollY > 50) {
      dom.header.classList.add('scrolled');
    } else {
      dom.header.classList.remove('scrolled');
    }

    // Scroll to top button display
    if (scrollY > 400) {
      dom.scrollTopBtn.classList.add('visible');
    } else {
      dom.scrollTopBtn.classList.remove('visible');
    }
  });

  // Scroll to top action
  dom.scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Smooth scroll to menu on Hero CTA click
  dom.heroCtaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSection = document.querySelector(dom.heroCtaBtn.getAttribute('href'));
    
    if (targetSection) {
      // Calculate layout offset of header
      const headerHeight = dom.header.offsetHeight;
      const targetPos = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
      
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
}
