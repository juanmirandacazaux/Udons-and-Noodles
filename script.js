
    // Sample menu data (replace with your own)
    const menuData = [
      { id: 'u1', title: 'Classic Udon', category: 'udon', price: 8.5, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop&crop=entropy', desc: 'Thick udon noodles in clear dashi broth, scallions and tempura bits.' },
      { id: 'u2', title: 'Beef Udon', category: 'udon', price: 12.0, img: 'https://images.unsplash.com/photo-1604908177522-2b7b0da0a5df?q=80&w=1400&auto=format&fit=crop&crop=entropy', desc: 'Slow cooked beef slices with a savory broth.' },
      { id: 't1', title: 'Tempura Shrimp', category: 'tempura', price: 6.5, img: 'https://images.unsplash.com/photo-1604908177748-9a0ca3ae2a72?q=80&w=1400&auto=format&fit=crop&crop=entropy', desc: 'Light and crispy tempura prawns.' },
      { id: 's1', title: 'Cucumber Sunomono', category: 'sides', price: 3.5, img: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=1400&auto=format&fit=crop&crop=entropy', desc: 'Refreshing pickled cucumber salad.' },
      { id: 'u3', title: 'Spicy Miso Udon', category: 'udon', price: 9.5, img: 'https://images.unsplash.com/photo-1597300329355-5d5d4f3b8f2b?q=80&w=1400&auto=format&fit=crop&crop=entropy', desc: 'Miso flavored broth with spicy kick.' },
      { id: 't2', title: 'Vegetable Tempura', category: 'tempura', price: 5.5, img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1400&auto=format&fit=crop&crop=entropy', desc: 'Seasonal vegetables, lightly fried.' }
    ];

    // DOM references
    const menuGrid = document.getElementById('menuGrid');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const overlay = document.getElementById('overlay');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCategory = document.getElementById('modalCategory');
    const modalPrice = document.getElementById('modalPrice');
    const closeModalBtn = document.getElementById('closeModal');
    const addCartBtn = document.getElementById('addCart');
    const qtyInput = document.getElementById('qty');
    const yearSpan = document.getElementById('year');

    // Render menu
    function renderMenu(items) {
      menuGrid.innerHTML = '';
      if(items.length === 0){
        menuGrid.innerHTML = '<div class="muted">No items found.</div>';
        return;
      }
      items.forEach(item => {
        const el = document.createElement('article');
        el.className = 'menu-item';
        el.innerHTML = `
          <img class="menu-thumb" src="${item.img}" alt="${item.title}">
          <div class="item-body">
            <h4>${item.title}</h4>
            <div class="muted">${item.desc}</div>
            <div class="price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="item-actions">
            <button class="btn btn-ghost" data-action="view" data-id="${item.id}">View</button>
            <button class="btn btn-primary" data-action="order" data-id="${item.id}">Order</button>
          </div>
        `;
        menuGrid.appendChild(el);
      });
    }

    // Initial render
    renderMenu(menuData);

    // Filter logic
    function applyFilters(){
      const q = searchInput.value.trim().toLowerCase();
      const category = filterSelect.value;
      const filtered = menuData.filter(it => {
        const matchesQ = q === '' || it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q);
        const matchesC = category === 'all' || it.category === category;
        return matchesQ && matchesC;
      });
      renderMenu(filtered);
    }
    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);

    // Delegated clicks for view/order
    menuGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = menuData.find(x => x.id === id);
      if(!item) return;
      if(action === 'view') openModal(item);
      if(action === 'order') {
        openModal(item);
        qtyInput.value = 1;
        // Auto add? We'll let user add
      }
    });

    // Modal open/close
    function openModal(item){
      modalImg.src = item.img;
      modalTitle.textContent = item.title;
      modalDesc.textContent = item.desc;
      modalCategory.textContent = item.category.toUpperCase();
      modalPrice.textContent = '$' + item.price.toFixed(2);
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden','false');
      // store current
      overlay.dataset.itemId = item.id;
    }

    function closeModal(){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden','true');
      overlay.dataset.itemId = '';
    }
    closeModalBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

    // Cart (simple example - stores in localStorage)
    function getCart(){ return JSON.parse(localStorage.getItem('uh_cart') || '[]'); }
    function saveCart(cart){ localStorage.setItem('uh_cart', JSON.stringify(cart)); }

    addCartBtn.addEventListener('click', () => {
      const id = overlay.dataset.itemId;
      if(!id) return;
      const item = menuData.find(x=>x.id === id);
      const qty = Math.max(1, parseInt(qtyInput.value || 1, 10));
      const cart = getCart();
      const existing = cart.find(c => c.id === id);
      if(existing) existing.qty += qty;
      else cart.push({ id: item.id, title: item.title, price: item.price, qty });
      saveCart(cart);
      closeModal();
      alert(`${item.title} added to cart (${qty})`);
    });

    // Order Now handlers
    document.getElementById('orderNowBtn').addEventListener('click', ()=> {
      location.hash = '#menu';
      window.scrollTo({top:document.getElementById('menu').offsetTop - 20, behavior:'smooth'});
    });
    document.getElementById('orderHero').addEventListener('click', ()=> {
      // open first item modal as example
      openModal(menuData[0]);
    });
    document.getElementById('viewMenu').addEventListener('click', ()=> {
      location.hash = '#menu';
      window.scrollTo({top:document.getElementById('menu').offsetTop - 20, behavior:'smooth'});
    });

    

    // small misc
    yearSpan.textContent = new Date().getFullYear();

    // Accessibility: focus trap suggestion - minimal
    // (For production, use a full focus trap library for modals.)
 