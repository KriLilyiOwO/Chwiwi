// --- CONFIGURATION ---
const PH_API_BASE = 'https://psgc.gitlab.io/api';
const SHIPPING_FEE = 100;

// --- DOM ELEMENTS ---
const provinceSelect = document.getElementById('province-dropdown');
const citySelect = document.getElementById('city-dropdown');
const checkoutForm = document.getElementById('checkout-form');

// --- 1. INITIALIZE PAGE ---
document.addEventListener('DOMContentLoaded', () => {
    fetchProvinces();
    loadCartSummary();
});

// --- 2. LOCATION LOGIC (API) ---
async function fetchProvinces() {
    try {
        const response = await fetch(`${PH_API_BASE}/provinces`);
        const provinces = await response.json();
        
        // Sort Alphabetically
        provinces.sort((a, b) => a.name.localeCompare(b.name));

        provinceSelect.innerHTML = '<option value="" selected disabled>Select Province</option>';
        provinces.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.code; // We use code to fetch cities later
            opt.textContent = p.name;
            provinceSelect.appendChild(opt);
        });
    } catch (error) {
        console.error("Error fetching provinces:", error);
        provinceSelect.innerHTML = '<option disabled>Error loading provinces</option>';
    }
}

provinceSelect.addEventListener('change', async function() {
    const provinceCode = this.value;
    
    // Reset and enable city dropdown
    citySelect.disabled = false;
    citySelect.innerHTML = '<option value="" selected disabled>Loading cities...</option>';

    try {
        const response = await fetch(`${PH_API_BASE}/provinces/${provinceCode}/cities-municipalities`);
        const cities = await response.json();
        
        cities.sort((a, b) => a.name.localeCompare(b.name));

        citySelect.innerHTML = '<option value="" selected disabled>Select City</option>';
        cities.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            citySelect.appendChild(opt);
        });
    } catch (error) {
        console.error("Error fetching cities:", error);
    }
});

// --- 3. CART SUMMARY LOGIC ---
function loadCartSummary() {
    // Assuming you have items stored in localStorage from your shop page
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryContainer = document.getElementById('summary-items');
    let subtotal = 0;

    summaryContainer.innerHTML = '';

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        summaryContainer.innerHTML += `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.name} (x${item.quantity})</span>
                <span>₱${item.price * item.quantity}</span>
            </div>
        `;
    });

    document.getElementById('subtotal-val').textContent = `₱${subtotal}`;
    document.getElementById('final-total').textContent = `₱${subtotal + SHIPPING_FEE}`;
}

// --- 4. FORM SUBMISSION ---
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Gather simple data for preview
    const customerName = document.getElementById('cust-name').value;
    const selectedCity = citySelect.value;
    
    alert(`Order received for ${customerName}! Shipping to ${selectedCity}.`);
    
    // Optional: Clear cart and redirect
    // localStorage.removeItem('cart');
    // window.location.href = 'thankyou.html';
});