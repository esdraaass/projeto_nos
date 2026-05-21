// ==========================================
// 1. CONFIGURAÇÃO DO SUPABASE (O CÉREBRO)
// ==========================================
const S_URL = 'https://vkvxiujrqeazpvwxgyqu.supabase.co';
const S_KEY = 'sb_publishable_UQvFvpcaH3AniT8bDqmPCw_mha0tPCO';
const supabaseClient = supabase.createClient(S_URL, S_KEY);

// ==========================================
// 2. FUNÇÕES DO MURAL (GLOBAIS)
// ==========================================

async function buscarMensagens() {
    const { data, error } = await supabaseClient
        .from('mensagens')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar:', error.message);
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
// 3. INICIALIZAÇÃO E LÓGICA DE INTERAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // Iniciar Mural
    buscarMensagens();

    // Envio de Mensagem
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

    // --- LÓGICA DA GALERIA (VER MAIS E MODAL) ---
    const loadMorePhotosBtn = document.getElementById('load-more-photos');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('caption'); // Seleciona a legenda
    let currentIndex = 0;

    // Verifica se deve mostrar o botão "Ver Mais"
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

    // Função que atualiza a imagem e a legenda no Modal
    function atualizarModal(index) {
        if (!galleryItems[index]) return;
        
        modalImg.src = galleryItems[index].src;
        
        // Busca a caixa (wrapper) da imagem atual para pegar o crédito
        const wrapper = galleryItems[index].closest('.gallery-item-wrapper');
        if (wrapper && modalCaption) {
            const creditSpan = wrapper.querySelector('.photo-credit');
            // Alterado de innerText para outerHTML para carregar o link (tag <a>) para dentro do modal
            modalCaption.innerHTML = creditSpan ? creditSpan.outerHTML : '';
        }
    }

    // Abre o Modal ao clicar na foto
    galleryItems.forEach((img, index) => {
        const wrapper = img.closest('.gallery-item-wrapper');
        if (wrapper) {
            wrapper.addEventListener('click', (e) => {
                // Se o clique foi em cima do link do instagram, para a execução e NÃO abre a foto
                if (e.target.classList.contains('photo-credit')) {
                    return; 
                }
                
                currentIndex = index;
                galleryModal.style.display = 'flex';
                atualizarModal(currentIndex);
            });
        }
    });

    // Controles do Modal (Fechar, Próxima, Anterior)
    if (galleryModal) {
        galleryModal.querySelector('.close-modal').addEventListener('click', () => {
            galleryModal.style.display = 'none';
        });

        galleryModal.querySelector('.next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            atualizarModal(currentIndex);
        });

        galleryModal.querySelector('.prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            atualizarModal(currentIndex);
        });
    }

    // --- LÓGICA DE RSVP (CONFIRMAÇÃO DE PRESENÇA) ---
    const formBusca = document.getElementById('form-busca-convidado');
    const formConfirma = document.getElementById('form-confirma-convidado');
    const step1 = document.getElementById('rsvp-step-1');
    const step2 = document.getElementById('rsvp-step-2');
    const step3 = document.getElementById('rsvp-step-3');
    const rsvpErro = document.getElementById('rsvp-erro');
    const nomeEncontradoEl = document.getElementById('nome-encontrado');
    const msgSucesso = document.getElementById('rsvp-mensagem-sucesso');
    const radiosPresenca = document.getElementsByName('status_presenca');

    let convidadoAtual = null;

    // PASSO 1: Buscar convidado
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
                rsvpErro.innerText = "Erro ao buscar no banco de dados. Tente novamente ou entre em contato com os noivos.";
                rsvpErro.style.display = 'block';
                return;
            }

            if (data && data.length > 0) {
                // Nome exato encontrado!
                convidadoAtual = data[0];
                step1.style.display = 'none';
                step2.style.display = 'block';
                nomeEncontradoEl.innerText = `Olá, ${convidadoAtual.nome}!`;
            } else {
                // Nome não encontrado (ou incompleto)
                rsvpErro.innerText = "Nome não encontrado. Por favor, digite seu nome exatamente como consta no convite ou entre em contato com os noivos.";
                rsvpErro.style.display = 'block';
            }
        });
    }

    // PASSO 2: Enviar a confirmação para o banco
    if (formConfirma) {
        formConfirma.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnConfirma = document.getElementById('btn-confirmar');
            const statusStr = document.querySelector('input[name="status_presenca"]:checked').value;
            
            const vaiComparecer = statusStr === 'sim';

            btnConfirma.innerText = 'Enviando...';

            // 1. Salva no Supabase primeiro
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
                console.error(error);
                return;
            }

            // 2. Prepara os dados para o EmailJS
            const templateParams = {
                nome_convidado: convidadoAtual.nome,
                status_presenca: vaiComparecer ? "✅ SIM, confirmou presença!" : "❌ NÃO, não poderá comparecer."
            };

            // 3. Dispara o E-mail de notificação
            // ATENÇÃO: Substitua pelos seus IDs gerados no EmailJS
            emailjs.send('service_ys6h05j', 'template_pvlr358', templateParams)
                .then(function(response) {
                    console.log('E-mail enviado com sucesso!', response.status, response.text);
                }, function(error) {
                    console.error('Erro ao enviar e-mail de notificação:', error);
                });

            // 4. Mostra a tela de sucesso para o convidado
            step2.style.display = 'none';
            step3.style.display = 'block';
            
            if (vaiComparecer) {
                msgSucesso.innerText = "Sua presença foi confirmada com sucesso! Mal podemos esperar para celebrar com você.";
            } else {
                msgSucesso.innerText = "Que pena que não poderá ir! Agradecemos por nos avisar.";
            }
        });
    }

    // --- CONTAGEM REGRESSIVA ---
    const weddingDate = new Date('2026-12-19T17:00:00').getTime();
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

    // --- MENU INTELIGENTE E NAVEGAÇÃO ATIVA ---
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navBarEl = document.querySelector('.navbar'); // Seleciona o menu

    window.addEventListener('scroll', () => {
        // 1. Efeito do Menu Inteligente (Transparente -> Escuro)
        if (window.scrollY > 50) {
            navBarEl.classList.add('scrolled');
        } else {
            navBarEl.classList.remove('scrolled');
        }

        // 2. Navegação Ativa (Destaca onde o usuário está)
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

    // --- ANO RODAPÉ ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

// ==========================================
    // SISTEMA DE RESERVA VIA WHATSAPP (PRESENTES)
    // ==========================================
    
    // 🔥 COLOQUE SEU NÚMERO DE WHATSAPP AQUI (Apenas números, com o DDI 55)
    const numeroWhatsApp = "5577988745909"; 

    const botoesPix = document.querySelectorAll('.btn-pix');
    const botoesComprar = document.querySelectorAll('.btn-comprar');
    const areaPix = document.getElementById('pix-info');
    
    const deliveryModal = document.getElementById('delivery-modal');
    const btnGoToStore = document.getElementById('btn-go-to-store');
    let linkLojaAtual = '';

    // 1. Quando clicar no botão PIX (Volta ao normal, APENAS mostra o QR Code)
    botoesPix.forEach(botao => {
        botao.addEventListener('click', function() {
            if (areaPix) {
                areaPix.style.display = 'block';
                areaPix.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 2. Quando clicar no botão COMPRAR ITEM (Envia mensagem no WhatsApp)
    botoesComprar.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault(); // Evita que a página pule
            
            const nomePresente = this.closest('.gift-item').querySelector('h3').innerText;
            linkLojaAtual = this.getAttribute('data-link'); 
            
            const mensagem = `Oi Vanessa e Esdras! Estou no site do casamento e acabei de escolher presentear vocês com: *${nomePresente}* (Vou comprar na loja)! 🎁`;
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
            
            // Abre o WhatsApp para vocês saberem que alguém vai comprar este item
            window.open(linkWhatsApp, '_blank');
            
            // Em seguida, abre o Pop-up com os dados de entrega para o convidado
            if (deliveryModal) {
                deliveryModal.style.display = 'flex';
            }
        });
    });

    // 3. Quando clicar no botão "Ir para a loja" dentro do Modal de Entrega
    if (btnGoToStore) {
        btnGoToStore.addEventListener('click', () => {
            if (linkLojaAtual && linkLojaAtual !== 'COLOQUE_O_LINK_AQUI') {
                window.open(linkLojaAtual, '_blank');
            } else if (linkLojaAtual === 'COLOQUE_O_LINK_AQUI') {
                alert('Atenção: Cadastre o link do produto no HTML (atributo data-link)');
            }
            if (deliveryModal) {
                deliveryModal.style.display = 'none';
            }
        });
    }

    // Fechar o modal de entrega
    if (deliveryModal) {
        const closeDeliveryModal = deliveryModal.querySelector('.close-delivery-modal');
        if (closeDeliveryModal) {
            closeDeliveryModal.addEventListener('click', () => {
                deliveryModal.style.display = 'none';
            });
        }
        deliveryModal.addEventListener('click', (e) => {
            if (e.target === deliveryModal) {
                deliveryModal.style.display = 'none';
            }
        });
    }

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

    const mobileLinks = document.querySelectorAll('.nav-links ul li a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            navbar.classList.remove('nav-open');
            document.body.classList.remove('no-scroll'); 
        });
    });

    // --- ANIMAÇÃO FADE-IN ---
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
// EFEITO ROLETA 3D (Citações)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.citacoes-wrapper');
    const cards = document.querySelectorAll('.card-citacao');

    if (wrapper && cards.length > 0) {
        function updateRoulette() {
            const wrapperCenter = wrapper.getBoundingClientRect().top + (wrapper.clientHeight / 2);

            cards.forEach(card => {
                const cardCenter = card.getBoundingClientRect().top + (card.clientHeight / 2);
                const distance = wrapperCenter - cardCenter;
                
                let rotateX = (distance / wrapper.clientHeight) * 50; 
                rotateX = Math.max(-60, Math.min(60, rotateX));

                let scale = 1 - Math.abs(distance / wrapper.clientHeight) * 0.2;
                let opacity = 1 - Math.abs(distance / wrapper.clientHeight) * 0.9;

                card.style.transform = `perspective(600px) rotateX(${rotateX}deg) scale(${scale})`;
                card.style.opacity = Math.max(0, opacity);
            });
        }

        wrapper.addEventListener('scroll', updateRoulette);
        window.addEventListener('resize', updateRoulette);
        setTimeout(updateRoulette, 100); 
    }
});

// ==========================================
// PROTEÇÃO POR SENHA DO SITE (Todo Acesso)
// ==========================================
const accessModal = document.getElementById('access-modal');
const btnAccess = document.getElementById('btn-access');
const passInput = document.getElementById('access-password');
const errorMsg = document.getElementById('access-error');

const senhaCorreta = "123456"; 

if (accessModal) {
    document.body.classList.add('locked');
    accessModal.style.display = 'flex';
    accessModal.style.opacity = '1';
}

function verificarSenha() {
    if (passInput.value.trim().toUpperCase() === senhaCorreta.toUpperCase()) {
        accessModal.style.opacity = '0';
        setTimeout(() => {
            accessModal.style.display = 'none';
            document.body.classList.remove('locked');
        }, 500);
    } else {
        errorMsg.style.display = 'block';
        passInput.value = '';
        passInput.focus();
    }
}

if (btnAccess) {
    btnAccess.addEventListener('click', verificarSenha);
}

if (passInput) {
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verificarSenha();
    });
}

// ==========================================
// AMPLIAR IMAGENS DOS PRESENTES
// ==========================================
const giftImages = document.querySelectorAll('.gift-img');
const modalGaleria = document.getElementById('gallery-modal');
const modalImgGaleria = document.getElementById('modal-image');
const legendaModal = document.getElementById('caption');
const setaAnterior = document.querySelector('.modal .prev');
const setaProxima = document.querySelector('.modal .next');

giftImages.forEach(img => {
    img.addEventListener('click', () => {
        if (modalGaleria && modalImgGaleria) {
            modalGaleria.style.display = 'flex';
            modalImgGaleria.src = img.src;
            if (legendaModal) legendaModal.innerHTML = img.alt;
            
            if (setaAnterior) setaAnterior.style.display = 'none';
            if (setaProxima) setaProxima.style.display = 'none';
        }
    });
});

const botaoFecharModal = document.querySelector('.close-modal');
if (botaoFecharModal) {
    botaoFecharModal.addEventListener('click', () => {
        if (setaAnterior) setaAnterior.style.display = 'block';
        if (setaProxima) setaProxima.style.display = 'block';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modalGaleria) {
        if (setaAnterior) setaAnterior.style.display = 'block';
        if (setaProxima) setaProxima.style.display = 'block';
    }
});
