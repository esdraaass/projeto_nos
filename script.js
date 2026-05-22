// ==========================================================================
// 1. INICIALIZAÇÃO DINÂMICA DO SUCESSO (CÉREBRO DO "NÓS")
// ==========================================================================

// Validação de segurança para garantir que o config.js foi carregado
if (typeof NOS_CONFIG === 'undefined') {
    console.error("Erro crítico: O arquivo 'config.js' não foi encontrado ou não foi carregado corretamente.");
}

// Inicialização do Supabase usando as variáveis do arquivo de configuração
const S_URL = NOS_CONFIG.integracoes.supabaseUrl;
const S_KEY = NOS_CONFIG.integracoes.supabaseKey;
const supabaseClient = supabase.createClient(S_URL, S_KEY);

// Constantes globais obtidas dinamicamente
const numeroWhatsApp = NOS_CONFIG.contato.numeroWhatsApp;
const senhaCorreta = NOS_CONFIG.seguranca.senhaSite;

// ==========================================
// 2. FUNÇÕES DO MURAL (GLOBAIS)
// ==========================================

async function buscarMensagens() {
    const { data, error } = await supabaseClient
        .from('mensagens')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar mensagens:', error.message);
        return;
    }

    const mural = document.getElementById('mural');
    if (!mural) return;

    mural.innerHTML = ''; 

    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === 'true';

    data.forEach(item => {
        const dataOriginal = new Date(item.created_at);
        const dataFormatada = dataOriginal.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const horaFormatada = dataOriginal.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const botaoDelete = isAdmin 
            ? `<button onclick="apagarMensagem(${item.id})" class="btn-delete">🗑️ Apagar</button>` 
            : '';

        mural.innerHTML += `
            <div class="message-card">
                <div class="card-header">
                    <h4>${item.nome}</h4>
                    <span class="message-date">${dataFormatada} às ${horaFormatada}</span>
                </div>
                <p>"${item.mensagem}"</p>
                ${botaoDelete}
            </div>
        `;
    });
}

async function apagarMensagem(id) {
    if (confirm("Deseja realmente remover esta mensagem do mural?")) {
        const { error } = await supabaseClient
            .from('mensagens')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Não foi possível apagar a mensagem.');
            console.error(error);
        } else {
            buscarMensagens();
        }
    }
}

// ==========================================
// 3. INICIALIZAÇÃO E INJEÇÃO DE CONTEÚDO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- INJEÇÃO DINÂMICA DE TEXTOS DO CASAL ---
    document.title = `${NOS_CONFIG.casal.sigla} | Nosso Casamento`;
    
    const h1Title = document.querySelector('.hero-content h1');
    if (h1Title) h1Title.innerText = `${NOS_CONFIG.casal.noiva} & ${NOS_CONFIG.casal.noivo}`;
    
    const tagline = document.querySelector('.tagline');
    if (tagline) tagline.innerText = NOS_CONFIG.casal.fraseEfeito;
    
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) navBrand.innerText = NOS_CONFIG.casal.sigla;

    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) footerLogo.innerText = NOS_CONFIG.casal.sigla;

    const enderecoBox = document.getElementById('endereco-entrega-texto');

    // --- INJEÇÃO DINÂMICA DA CERIMÔNIA ---
    if (NOS_CONFIG.evento.cerimonia) {
        const cData = document.getElementById('cerimonia-data');
        const cHora = document.getElementById('cerimonia-hora');
        const cLocal = document.getElementById('cerimonia-local');
        const cEndereco = document.getElementById('cerimonia-endereco');
        
        if (cData) cData.innerHTML = NOS_CONFIG.evento.cerimonia.dataExtenso;
        if (cHora) cHora.innerHTML = NOS_CONFIG.evento.cerimonia.horario;
        if (cLocal) cLocal.innerHTML = NOS_CONFIG.evento.cerimonia.local;
        if (cEndereco) cEndereco.innerHTML = NOS_CONFIG.evento.cerimonia.endereco;
    }
        
    if (enderecoBox) enderecoBox.innerHTML = `<strong>${NOS_CONFIG.evento.enderecoEntrega}</strong>`;

    // Atualiza links de créditos do fotógrafo de forma dinâmica
    const creditosLinks = document.querySelectorAll('.photo-credit, .modal-credit');
    creditosLinks.forEach(link => {
        link.href = NOS_CONFIG.evento.instagramFotografo;
        if(link.classList.contains('modal-credit')) {
            link.innerHTML = `📷 Fotografia por ${NOS_CONFIG.evento.arrobaFotografo}`;
        } else {
            link.innerHTML = `📷 ${NOS_CONFIG.evento.arrobaFotografo}`;
        }
    });

    // --- INJEÇÃO DINÂMICA DAS CITAÇÕES ---
    const containerCitacoes = document.getElementById('citacoes-dinamicas');    
    if (containerCitacoes && NOS_CONFIG.citacoes) {
        containerCitacoes.innerHTML = '';
        NOS_CONFIG.citacoes.forEach(citacao => {
            containerCitacoes.innerHTML += `
                <div class="card-citacao">
                    <span class="quote-mark">"</span>
                    <p class="citacao-texto">${citacao.texto}</p>
                    <span class="citacao-autor">- ${citacao.autor}</span>
                </div>
            `;
        });
    }

    // --- INJEÇÃO DINÂMICA DA GALERIA DE FOTOS ---
    const containerGaleria = document.getElementById('galeria-dinamica');
    if (containerGaleria && NOS_CONFIG.galeria) {
        containerGaleria.innerHTML = '';
        NOS_CONFIG.galeria.forEach(foto => {
            const classeOculta = foto.oculta ? 'photo-hidden' : '';
            containerGaleria.innerHTML += `
                <div class="gallery-item-wrapper ${classeOculta}">
                    <img src="${foto.src}" alt="${foto.alt}" class="gallery-item" loading="lazy" />
                    <a href="${NOS_CONFIG.evento.instagramFotografo}" target="_blank" class="photo-credit">📷 ${NOS_CONFIG.evento.arrobaFotografo}</a>
                </div>
            `;
        });
    }

    // Iniciar buscas iniciais
    buscarMensagens();

    // Inicialização do EmailJS com a chave dinâmica
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: NOS_CONFIG.integracoes.emailJsKey || "" });
    }

    // Envio de Mensagem no Mural
    const form = document.getElementById('form-mensagem');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-enviar');
            const nomeVal = document.getElementById('nome-convidado').value;
            const msgVal = document.getElementById('texto-mensagem').value;

            btn.innerText = 'Enviando...';
            const { error } = await supabaseClient.from('mensagens').insert([{ nome: nomeVal, mensagem: msgVal }]);

            if (error) {
                alert('Erro ao enviar!');
                console.error(error);
            } else {
                form.reset();
                buscarMensagens();
            }
            btn.innerText = 'Enviar Mensagem';
        });
    }

    // --- LÓGICA DA GALERIA (VER MAIS E LIGHTBOX) ---
    const loadMorePhotosBtn = document.getElementById('load-more-photos');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    let currentIndex = 0;

    const hiddenPhotos = document.querySelectorAll('.gallery-item-wrapper.photo-hidden');
    if (loadMorePhotosBtn) {
        if (hiddenPhotos.length > 0) {
            loadMorePhotosBtn.style.display = 'block';
        }
        
        loadMorePhotosBtn.addEventListener('click', () => {
            hiddenPhotos.forEach(photo => photo.classList.remove('photo-hidden'));
            loadMorePhotosBtn.style.display = 'none';
        });
    }

    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            if (galleryModal && modalImg) {
                galleryModal.style.display = 'flex';
                modalImg.src = img.src;
            }
        });
    });

    if (galleryModal) {
        galleryModal.querySelector('.close-modal').addEventListener('click', () => {
            galleryModal.style.display = 'none';
        });

        galleryModal.querySelector('.next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            modalImg.src = galleryItems[currentIndex].src;
        });

        galleryModal.querySelector('.prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            modalImg.src = galleryItems[currentIndex].src;
        });
    }

    // --- LÓGICA DE RSVP INTEGRAÇÃO ---
    const formBusca = document.getElementById('form-busca-convidado');
    const formConfirma = document.getElementById('form-confirma-convidado');
    const step1 = document.getElementById('rsvp-step-1');
    const step2 = document.getElementById('rsvp-step-2');
    const step3 = document.getElementById('rsvp-step-3');
    const rsvpErro = document.getElementById('rsvp-erro');
    const nomeEncontradoEl = document.getElementById('nome-encontrado');
    const msgSucesso = document.getElementById('rsvp-mensagem-sucesso');
    
    let convidadoAtual = null;

    if (formBusca) {
        formBusca.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnBusca = document.getElementById('btn-buscar');
            const nomeBusca = document.getElementById('busca-nome').value.trim();
            
            btnBusca.innerText = 'Buscando...';
            rsvpErro.style.display = 'none';

            const { data, error } = await supabaseClient
                .from('convidados')
                .select('*')
                .ilike('nome', nomeBusca);

            btnBusca.innerText = 'Buscar Convite';

            if (error) {
                console.error("Erro na busca:", error);
                rsvpErro.innerText = "Erro ao buscar. Tente novamente.";
                rsvpErro.style.display = 'block';
                return;
            }

            if (data && data.length > 0) {
                convidadoAtual = data[0];
                step1.style.display = 'none';
                step2.style.display = 'block';
                nomeEncontradoEl.innerText = `Olá, ${convidadoAtual.nome}!`;
            } else {
                rsvpErro.innerText = "Nome não encontrado. Digite exatamente como está no convite.";
                rsvpErro.style.display = 'block';
            }
        });
    }

    if (formConfirma) {
        formConfirma.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnConfirma = document.getElementById('btn-confirmar');
            const statusStr = document.querySelector('input[name="status_presenca"]:checked').value;
            const vaiComparecer = statusStr === 'sim';

            btnConfirma.innerText = 'Enviando...';

            const { error } = await supabaseClient
                .from('convidados')
                .update({ 
                    confirmado: vaiComparecer,
                    data_confirmacao: new Date().toISOString()
                })
                .eq('id', convidadoAtual.id);

            if (error) {
                alert("Erro: " + error.message);
                btnConfirma.innerText = 'Enviar Confirmação';
                return;
            }

            const templateParams = {
                nome_convidado: convidadoAtual.nome,
                status_presenca: vaiComparecer ? "✅ SIM, confirmou presença!" : "❌ NÃO, não poderá comparecer."
            };

            if (typeof emailjs !== 'undefined') {
                emailjs.send(NOS_CONFIG.integracoes.emailJsService, NOS_CONFIG.integracoes.emailJsTemplate, templateParams)
                    .then(response => console.log('Notificação enviada!'))
                    .catch(err => console.error('Erro EmailJS:', err));
            }

            step2.style.display = 'none';
            step3.style.display = 'block';
            
            msgSucesso.innerText = vaiComparecer 
                ? "Sua presença foi confirmada com sucesso! Mal podemos esperar para celebrar consigo."
                : "Agradecemos por nos avisar. É uma pena que não possa comparecer!";
        });
    }

    // --- CONTAGEM REGRESSIVA DINÂMICA ---
    const weddingDate = new Date(NOS_CONFIG.evento.dataHora).getTime();
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;
            if (distance < 0) {
                countdownElement.innerHTML = "O GRANDE DIA CHEGOU!";
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            countdownElement.innerHTML = `<span>${days}<div>Dias</div></span><span>${hours}<div>Horas</div></span><span>${minutes}<div>Minutos</div></span><span>${seconds}<div>Segundos</div></span>`;
        }, 1000);
    }

    // --- MENU INTELIGENTE E ROLAGEM ---
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navBarEl = document.querySelector('.navbar'); 

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navBarEl.classList.add('scrolled');
        } else {
            navBarEl.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').endsWith(current));
        });
    });

    // --- ANO ATUAL ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- SISTEMA DE LISTA DE PRESENTES DINÂMICO ---
    const gridPresentes = document.getElementById('grid-presentes-dinamico');
    
    // 1. Renderizar os presentes na tela
    if (gridPresentes && NOS_CONFIG.presentes) {
        gridPresentes.innerHTML = ''; // Limpa a grid
        
        NOS_CONFIG.presentes.forEach(presente => {
            const classIndisponivel = presente.indisponivel ? 'indisponivel' : '';
            const btnComprarHTML = presente.linkLoja 
                ? `<button class="btn-gift btn-comprar" data-link="${presente.linkLoja}">Comprar item</button>` 
                : '';

            const cardHTML = `
                <div class="gift-item ${classIndisponivel}">
                  <img src="${presente.imagem}" alt="${presente.nome}" class="gift-img" loading="lazy" />
                  <div class="gift-overlay">
                    <h3>${presente.nome}</h3>
                    <p>${presente.valor}</p>
                    <div class="gift-buttons">
                      <button class="btn-gift btn-pix">Pix</button>
                      ${btnComprarHTML}
                    </div>
                  </div>
                </div>
            `;
            gridPresentes.innerHTML += cardHTML;
        });
    }

    // 2. Ativar os botões (agora que os presentes existem na tela)
    const botoesPix = document.querySelectorAll('.btn-pix');
    const botoesComprar = document.querySelectorAll('.btn-comprar');
    const imagensPresentes = document.querySelectorAll('.gift-img'); // Para ampliar a foto
    const areaPix = document.getElementById('pix-info');
    const deliveryModal = document.getElementById('delivery-modal');
    const btnGoToStore = document.getElementById('btn-go-to-store');
    let linkLojaAtual = '';

    botoesPix.forEach(botao => {
        botao.addEventListener('click', () => {
            if (areaPix) {
                areaPix.style.display = 'block';
                areaPix.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    botoesComprar.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault(); 
            const nomePresente = this.closest('.gift-item').querySelector('h3').innerText;
            linkLojaAtual = this.getAttribute('data-link'); 
            
            const mensagem = `Oi ${NOS_CONFIG.casal.noiva} e ${NOS_CONFIG.casal.noivo}! Escolhi presentear-vos com: *${nomePresente}*! 🎁`;
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
            
            window.open(linkWhatsApp, '_blank');
            if (deliveryModal) deliveryModal.style.display = 'flex';
        });
    });

    if (btnGoToStore) {
        btnGoToStore.addEventListener('click', () => {
            if (linkLojaAtual && linkLojaAtual !== 'COLOQUE_O_LINK_AQUI') {
                window.open(linkLojaAtual, '_blank');
            }
            if (deliveryModal) deliveryModal.style.display = 'none';
        });
    }

    if (deliveryModal) {
        const fecharModal = deliveryModal.querySelector('.close-delivery-modal');
        if (fecharModal) {
            fecharModal.addEventListener('click', () => {
                deliveryModal.style.display = 'none';
            });
        }
    }

    // 3. Ativar o Modal de ampliar a imagem (Lightbox) para os presentes
    const modalGaleria = document.getElementById('gallery-modal');
    const modalImgGaleria = document.getElementById('modal-image');
    imagensPresentes.forEach(img => {
        img.addEventListener('click', () => {
            if (modalGaleria && modalImgGaleria && !img.closest('.gift-item').classList.contains('indisponivel')) {
                modalGaleria.style.display = 'flex';
                modalImgGaleria.src = img.src;
                // Esconde as setas da galeria de fotos normais
                document.querySelector('.modal .prev').style.display = 'none';
                document.querySelector('.modal .next').style.display = 'none';
            }
        });
    });

    // --- MENU MOBILE ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            navbar.classList.toggle('nav-open');
            document.body.classList.toggle('no-scroll'); 
        });
    }

    document.querySelectorAll('.nav-links ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            navbar.classList.remove('nav-open');
            document.body.classList.remove('no-scroll'); 
        });
    });

    // --- ANIMAÇÃO INTERSECTION OBSERVER ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.historia-video, .citacoes-wrapper, .gift-item, .gallery-item-wrapper').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ==========================================
// 4. EFEITOS ESPECIAIS (3D E AUDIO)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Roleta 3D
    const wrapper = document.querySelector('.citacoes-wrapper');
    const cards = document.querySelectorAll('.card-citacao');

    if (wrapper && cards.length > 0) {
        function updateRoulette() {
            const wrapperCenter = wrapper.getBoundingClientRect().top + (wrapper.clientHeight / 2);
            cards.forEach(card => {
                const cardCenter = card.getBoundingClientRect().top + (card.clientHeight / 2);
                const distance = wrapperCenter - cardCenter;
                let rotateX = Math.max(-60, Math.min(60, (distance / wrapper.clientHeight) * 50));
                let scale = 1 - Math.abs(distance / wrapper.clientHeight) * 0.2;
                let opacity = 1 - Math.abs(distance / wrapper.clientHeight) * 0.9;
                card.style.transform = `perspective(600px) rotateX(${rotateX}deg) scale(${scale})`;
                card.style.opacity = Math.max(0, opacity);
            });
        };
        wrapper.addEventListener('scroll', updateRoulette);
        setTimeout(updateRoulette, 100); 
    }

    // Player de música flutuante
    const audio = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const playerWrapper = document.getElementById('player-wrapper'); 
    const volumeSlider = document.getElementById('volume-slider'); 

    const playSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d=\"M8 5v14l11-7z\"/></svg>`;
    const pauseSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d=\"M6 19h4V5H6v14zm8-14v14h4V5h-4z\"/></svg>`;

    if (audio && volumeSlider) audio.volume = volumeSlider.value;

    if (musicToggle && audio) {
        musicToggle.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => {
                    if(musicIcon) musicIcon.innerHTML = pauseSVG; 
                    if(playerWrapper) playerWrapper.classList.add('playing');
                }).catch(err => console.log("Autoplay bloqueado", err));
            } else {
                audio.pause();
                if(musicIcon) musicIcon.innerHTML = playSVG; 
                if(playerWrapper) playerWrapper.classList.remove('playing');
            }
        });
    }

    if (volumeSlider && audio) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
        });
    }
});

// ==========================================
// 5. TELA DE BLOQUEIO (SEGURANÇA POR SENHA)
// ==========================================
const accessModal = document.getElementById('access-modal');
const btnAccess = document.getElementById('btn-access');
const passInput = document.getElementById('access-password');
const errorMsg = document.getElementById('access-error');

if (accessModal) {
    document.body.classList.add('locked');
    accessModal.style.display = 'flex';
    accessModal.style.opacity = '1';
}

function verificarSenha() {
    if (passInput.value.trim() === senhaCorreta) {
        accessModal.style.opacity = '0';
        setTimeout(() => {
            accessModal.style.display = 'none';
            document.body.classList.remove('locked');
        }, 500);
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
        passInput.value = '';
        passInput.focus();
    }
}

if (btnAccess) btnAccess.addEventListener('click', verificarSenha);
if (passInput) {
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verificarSenha();
    });
}
