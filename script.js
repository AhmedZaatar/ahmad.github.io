const API_URL = 'https://script.google.com/macros/s/AKfycbzYORVsjwSYkABKFvKkoz7FC2wczyWv093tK1v6ZIr_HzmYXs9G0nNaXeNVpE0auF8IBw/exec';
const WHATSAPP_NUMBER = '+963993577995';

const fallbackProducts = [
    {
        id: 1,
        name: 'Midnight Rose',
        description: 'خلطة ساحرة تجمع بين الوردة الداكنة والعود والفانيلا.',
        price: '89.99',
        image: 'armazi.jpg'
    },
    {
        id: 2,
        name: 'Ocean Breeze',
        description: 'رائحة بحرية منعشة مع لمسات من الليمون وملح البحر.',
        price: '79.99',
        image: 'chanel_eau-de-perfum.jpg'
    },
    {
        id: 3,
        name: 'Golden Amber',
        description: 'درجات دافئة من العنبر والصندل والفانيلا الحلوة.',
        price: '99.99',
        image: 'fully-furnished-and-serviced-apartments8_midpageimg_.jpg'
    },
    {
        id: 4,
        name: 'Velvet Oud',
        description: 'عود غني مع الزعفران والجلد في تركيبة فاخرة.',
        price: '129.99',
        image: 'CitrusBloom.jpg'
    },
    {
        id: 5,
        name: 'Citrus Bloom',
        description: 'برتقال منعش مع الياسمين والمusk لإشعاع لطيف.',
        price: '69.99',
        image: 'dolce&gabbna.jpg'
    },
    {
        id: 6,
        name: 'Midnight Jasmine',
        description: 'ياسمين استوائي مع الجاردينيا والمسك الأبيض.',
        price: '160.99',
        image: 'pink-space.jpg'
    }
];

const productImages = {
    'Midnight Rose': 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80',
    'Ocean Breeze': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    'Golden Amber': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
    'Velvet Oud': 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80',
    'Citrus Bloom': 'https://images.unsplash.com/photo-1563170351-bc7fc0f3f2e7?auto=format&fit=crop&w=900&q=80',
    'Midnight Jasmine': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80'
};

const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    applyTheme(isDark ? 'light' : 'dark');
});

function buildWhatsAppLink(product) {
    const cleanName = product.name || 'العطر';
    const cleanPrice = product.price || '0';
    const message = `مرحباً، أود طلب عطر ${cleanName} بسعر ${cleanPrice} دولار. أرجو تزويدي بتفاصيل التوصيل.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function getProductImage(product) {
    const localPath = `images/${product.image || ''}`;
    const remote = productImages[product.name] || '';
    return remote || localPath;
}

function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (!Array.isArray(products) || !products.length) {
        container.innerHTML = '<div class="product-card" style="grid-column:1/-1;padding:24px;text-align:center;">لا توجد منتجات متاحة حالياً.</div>';
        return;
    }

    products.forEach((product) => {
        if (!product || !product.name) return;

        const card = document.createElement('article');
        card.className = 'product-card';

        const imageUrl = getProductImage(product);
        const productPrice = Number(product.price || 0).toFixed(2);

        card.innerHTML = `
                    <div class="product-image">
                        <span class="badge">مميز</span>
                        <img src="${imageUrl}" alt="${product.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80';" />
                    </div>
                    <div class="product-info">
                        <div class="product-meta">
                            <h3 class="product-name">${product.name}</h3>
                            <span class="product-price">${productPrice} $</span>
                        </div>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-actions">
                            <a class="secondary-btn" href="#home"><i class="fa-regular fa-heart"></i> مفضل</a>
                            <a class="whatsapp-btn" href="${buildWhatsAppLink(product)}" target="_blank" rel="noreferrer"><i class="fa-brands fa-whatsapp"></i> اطلب الآن</a>
                        </div>
                    </div>
                `;

        container.appendChild(card);
    });
}

async function loadProducts() {
    try {
        const response = await fetch(API_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
            renderProducts(data);
            return;
        }
        throw new Error('No products returned');
    } catch (error) {
        console.error('Error loading products:', error);
        renderProducts(fallbackProducts);
    }
}

loadProducts();
