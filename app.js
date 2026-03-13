document.addEventListener('DOMContentLoaded', () => {
    const personaGrid = document.getElementById('personaGrid');
    const searchInput = document.getElementById('searchInput');
    const previewModal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const jsonPreview = document.getElementById('jsonPreview');
    const modalCopyBtn = document.getElementById('modalCopyBtn');
    const contributeModal = document.getElementById('contributeModal');
    
    let personas = [];

    // Skin Management
    window.setSkin = (skin) => {
        document.body.setAttribute('data-skin', skin);
        localStorage.setItem('ovos-persona-skin', skin);
        
        // Update active button state
        document.querySelectorAll('.skin-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('onclick').includes(skin));
        });
    };

    // Load saved skin
    const savedSkin = localStorage.getItem('ovos-persona-skin') || 'redline';
    setSkin(savedSkin);

    // Fetch and parse JSONL
    async function loadPersonas() {
        try {
            const response = await fetch('personas.jsonl');
            const text = await response.text();
            personas = text.trim().split('\n')
                .filter(line => line.trim() !== '')
                .map(line => JSON.parse(line));
            
            renderPersonas(personas);
        } catch (error) {
            console.error('Error loading personas:', error);
            personaGrid.innerHTML = `<p class="text-red-500 mono col-span-full text-center tracking-tighter uppercase">ERROR: FAILED_TO_LOAD_IDENTITY_DATABASE</p>`;
        }
    }

    function createPersonaCard(persona, index) {
        const { description, ...rawPersona } = persona;
        const jsonString = JSON.stringify(rawPersona, null, 2);
        
        const solversList = persona.solvers.map(s => 
            `<span class="bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] mono uppercase opacity-70">${s.replace('ovos-solver-', '').replace('-plugin', '')}</span>`
        ).join(' ');

        return `
            <div class="glass-card flex flex-col h-full animate-fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="chip-header p-4 flex justify-between items-center opacity-40">
                    <span class="mono text-[10px] uppercase tracking-tighter font-bold">NODE // 0x${Math.random().toString(16).substr(2, 6).toUpperCase()}</span>
                    <i data-lucide="cpu" class="w-4 h-4"></i>
                </div>
                
                <div class="p-6 flex-grow">
                    <h3 class="syncopate text-xl font-bold mb-2 tracking-tighter">${persona.name.toUpperCase()}</h3>
                    <p class="opacity-50 text-sm mb-6 leading-relaxed mono uppercase tracking-tight">${persona.description || 'NO_DATA_DESCRIPTION_AVAILABLE'}</p>
                    
                    <div class="mb-6">
                        <p class="mono text-[10px] opacity-30 uppercase mb-2 font-bold tracking-widest">Logic_Chains</p>
                        <div class="flex flex-wrap gap-2">
                            ${solversList}
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-white/5 border-t border-white/5 mt-auto flex flex-col gap-3">
                    <div class="flex justify-between items-center gap-2">
                        <button onclick="openPreview('${btoa(persona.name)}', '${btoa(jsonString)}')" 
                            class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 text-[10px] mono uppercase transition-all tracking-widest">
                            Preview
                        </button>
                        <button onclick="copyPersona('${btoa(jsonString)}', this)" 
                            class="flex-1 btn-accent px-4 py-2 text-[10px] mono uppercase transition-all tracking-widest flex items-center justify-center gap-2">
                            <i data-lucide="copy" class="w-3 h-3"></i>
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderPersonas(items) {
        personaGrid.innerHTML = items.map((p, i) => createPersonaCard(p, i)).join('');
        lucide.createIcons();
    }

    // Search logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = personas.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query)) ||
            p.solvers.some(s => s.toLowerCase().includes(query))
        );
        renderPersonas(filtered);
    });

    // Modal Functions
    window.openPreview = (nameBase64, jsonBase64) => {
        const name = atob(nameBase64);
        const json = atob(jsonBase64);
        
        modalTitle.textContent = `PREVIEW // ${name.toUpperCase()}`;
        jsonPreview.textContent = json;
        previewModal.style.display = 'flex';
        
        modalCopyBtn.onclick = (e) => copyPersona(jsonBase64, e.target);
        lucide.createIcons();
    };

    window.closePreview = () => {
        previewModal.style.display = 'none';
    };

    window.openContribute = () => {
        contributeModal.style.display = 'flex';
        lucide.createIcons();
    };

    window.closeContribute = () => {
        contributeModal.style.display = 'none';
    };

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === previewModal) closePreview();
        if (e.target === contributeModal) closeContribute();
    });

    window.copyPersona = (base64Json, btn) => {
        const json = atob(base64Json);
        navigator.clipboard.writeText(json).then(() => {
            const originalContent = btn.innerHTML;
            btn.innerHTML = `<i data-lucide="check" class="w-3 h-3"></i> COPIED!`;
            lucide.createIcons();
            
            setTimeout(() => {
                btn.innerHTML = originalContent;
                lucide.createIcons();
            }, 2000);
        });
    };

    loadPersonas();
});
