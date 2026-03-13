document.addEventListener('DOMContentLoaded', () => {
    const personaGrid = document.getElementById('personaGrid');
    const searchInput = document.getElementById('searchInput');
    const previewModal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const jsonPreview = document.getElementById('jsonPreview');
    const modalCopyBtn = document.getElementById('modalCopyBtn');
    const contributeModal = document.getElementById('contributeModal');
    const audioModal = document.getElementById('audioModal');
    const playAudioBtn = document.getElementById('playAudioBtn');
    const transmissionStatus = document.getElementById('transmissionStatus');
    
    let personas = [];
    let ggwave = null;
    let context = null;
    let instance = null;
    let currentPersonaJson = null;

    // Initialize GGWave
    if (typeof ggwave_factory !== 'undefined') {
        ggwave_factory().then((obj) => {
            ggwave = obj;
        });
    }

    function initAudio() {
        if (!context && ggwave) {
            context = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
            const parameters = ggwave.getDefaultParameters();
            parameters.sampleRateInp = context.sampleRate;
            parameters.sampleRateOut = context.sampleRate;
            instance = ggwave.init(parameters);
        }
    }

    // Skin Management
    window.setSkin = (skin) => {
        document.body.setAttribute('data-skin', skin);
        localStorage.setItem('ovos-persona-skin', skin);
        
        // Update active button state
        document.querySelectorAll('.skin-btn').forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick && onclick.includes(skin)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
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
        const jsonString = JSON.stringify(rawPersona); // Compact for audio
        const prettyJson = JSON.stringify(rawPersona, null, 2);
        
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
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="openPreview('${btoa(persona.name)}', '${btoa(prettyJson)}')" 
                            class="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 text-[10px] mono uppercase transition-all tracking-widest">
                            Preview
                        </button>
                        <button onclick="openAudioModal('${btoa(jsonString)}')" 
                            class="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 text-[10px] mono uppercase transition-all tracking-widest flex items-center justify-center gap-2">
                            <i data-lucide="volume-2" class="w-3 h-3"></i>
                            Audio
                        </button>
                    </div>
                    <button onclick="copyPersona('${btoa(prettyJson)}', this)" 
                        class="btn-accent w-full py-2 text-[10px] mono uppercase transition-all tracking-widest flex items-center justify-center gap-2">
                        <i data-lucide="copy" class="w-3 h-3"></i>
                        Copy JSON
                    </button>
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

    window.openAudioModal = (jsonBase64) => {
        currentPersonaJson = atob(jsonBase64);
        audioModal.style.display = 'flex';
        transmissionStatus.textContent = 'READY_FOR_TRANSMISSION';
        lucide.createIcons();
    };

    window.closeAudioModal = () => {
        audioModal.style.display = 'none';
    };

    function convertTypedArray(src, type) {
        const buffer = new ArrayBuffer(src.byteLength);
        new src.constructor(buffer).set(src);
        return new type(buffer);
    }

    playAudioBtn.onclick = () => {
        initAudio();
        if (!ggwave || !context || !currentPersonaJson) return;

        try {
            transmissionStatus.textContent = 'BROADCASTING_DATA...';
            // Prepend PIP: prefix as expected by the ggwave skill
            const payload = `PIP: ${currentPersonaJson}`;
            
            const waveform = ggwave.encode(
                instance,
                payload,
                ggwave.ProtocolId.GGWAVE_PROTOCOL_AUDIBLE_FAST,
                10
            );

            const buf = convertTypedArray(waveform, Float32Array);
            const buffer = context.createBuffer(1, buf.length, context.sampleRate);
            buffer.getChannelData(0).set(buf);

            const source = context.createBufferSource();
            source.buffer = buffer;

            const gainNode = context.createGain();
            gainNode.gain.value = 1.0;
            source.connect(gainNode).connect(context.destination);

            source.onended = () => {
                transmissionStatus.textContent = 'TRANSMISSION_COMPLETE';
            };

            source.start(0);
        } catch (error) {
            console.error("Error transmitting audio:", error);
            transmissionStatus.textContent = 'ERROR: TRANSMISSION_FAILED';
        }
    };

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === previewModal) closePreview();
        if (e.target === contributeModal) closeContribute();
        if (e.target === audioModal) closeAudioModal();
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
