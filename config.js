// ==========================================
// CONFIGURAÇÃO GLOBAL DO SITE (NÓS - Casamentos)
// ==========================================

const NOS_CONFIG = {
    // 1. Dados do Casal
    casal: {
        noiva: "Maria",
        noivo: "João",
        sigla: "M | J", // Usado no logo e no rodapé
        fraseEfeito: "Eu gosto da ideia de envelhecer com você..."
    },

    // 2. Dados do Evento
    evento: {
        // Data no formato YYYY-MM-DDTHH:MM:SS para o cronômetro
        dataHora: "2026-12-19T17:00:00",

        enderecoEntrega: `Rua Maiquinique, 87, Bairro Presidente Médici - Referência: Black Joia<br>Itarantim - BA<br>CEP: 45780-000`,

        instagramFotografo: "https://www.instagram.com/solucaslima/",
        arrobaFotografo: "@solucaslima",

        // ADICIONE ESTE NOVO BLOCO AQUI:
        cerimonia: {
            dataExtenso: "Sábado, 19 de Dezembro de 2026",
            horario: "Às 17:00 Horas",
            local: "Igreja Matriz de Itarantim",
            endereco: "Praça Central, Centro — Itarantim - BA"
        }
    },


    // 3. Contatos e Pagamentos
    contato: {
        // WhatsApp para receber avisos de presentes comprados (Apenas números, com 55)
        numeroWhatsApp: "5577988745909",

        // Chave PIX para a lista de presentes
        chavePix: "5d5c610e-dbc4-4c2e-8ecc-9ce151b6e605"
    },

    // 4. Configurações de Acesso (Segurança)
    seguranca: {
        senhaSite: "123" // Senha para acessar o site (pode ser alterada conforme necessário)
    },

    // 5. Integrações (Supabase e EmailJS)
    integracoes: {
        supabaseUrl: "https://xrmmsqdowaebhjplhugz.supabase.co",
        supabaseKey: "sb_publishable_lexKwQvGl-_B5woWqvIJpQ_HOG5v6vy",

        emailJsService: "service_ys6h05j",
        emailJsTemplate: "template_pvlr358"
    },

    // ... suas configurações anteriores de contato, segurança, etc ...

    // 6. Lista Dinâmica de Presentes
    presentes: [
        {
            nome: "Primeiro mês de jantar do casal",
            valor: "R$ 500,00",
            imagem: "img/gift-almoco.webp",
            linkLoja: "", // Deixe vazio se for apenas PIX
            indisponivel: false // Mude para true quando alguém comprar
        },
        {
            nome: "Airfryer",
            valor: "R$ 250,00",
            imagem: "img/gift-airfryer.webp",
            linkLoja: "https://a.co/d/08rOPhQh",
            indisponivel: false
        },

        {
            nome: "Kit de emergência para discussões (Chocolates)",
            valor: "R$ 70,00",
            imagem: "img/gift-discussao.jpg",
            linkLoja: "",
            indisponivel: false // Exemplo de um presente que já foi dado!
        },
        // Você pode adicionar quantos quiser aqui para cada novo casal

        {
            nome: "Jogo de Cama",
            valor: "R$ 180,00",
            imagem: "https://images.tcdn.com.br/img/img_prod/775325/jogo_de_cama_lencol_queen_4_pecas_austin_estampado_grid_micropercal_200_fios_653_variacao_3237_1_2740747a116b2ad7b808fe041c7dfa02.jpg",
            linkLoja: "",
            indisponivel: false // Exemplo de um presente que já foi dado!
        },

        {
            nome: "Microondas",
            valor: "R$ 542,00",
            imagem: "img/gift-microondas.webp",
            linkLoja: "",
            indisponivel: true // Exemplo de um presente que já foi dado!
        },
    ],

    // ... suas configurações de presentes ...

    // 7. Citações (Roleta 3D da História)
    citacoes: [
        {
            texto: "\"O Amor é a única coisa que transcende o tempo e o espaço [...]\"",
            autor: "Interestelar"
        },
        {
            texto: "\"Ainda bem que você vive comigo<br />Porque senão como seria esta vida?\"",
            autor: "Vanessa da Mata"
        },
        {
            texto: "\"Luz das estrelas, laço do infinito<br />Gosto tanto dela assim\"",
            autor: "Djavan"
        },
        {
            texto: "\"Quero ter você nos dias mais incertos<br />Só pra me esconder na paz de um abraço teu\"",
            autor: "Lorena Chaves"
        },
        {
            texto: "\"Em você eu tenho o que falta em mim<br />E descubro o que tenho de melhor pra lhe oferecer\"",
            autor: "Crombie"
        },
        {
            texto: "\"Eu digo olá pro futuro<br />Só de saber que você vai estar em meus planos\"",
            autor: "Supercombo"
        },
        {
            texto: "\"Quem um dia irá dizer<br />Que existe razão nas coisas feitas pelo coração? <br />E quem irá dizer que não existe razão?\"",
            autor: "Renato Russo"
        },
        {
            texto: "\"Meu amor é teu<br />Mas dou-te mais uma vez. Meu bem!\"",
            autor: "Marcelo Camelo"
        },
        {
            texto: "\"Eu me sinto à vontade<br />Pois partilhamos noites, ruas e sonhos <br />Como se fossemos iguais\"",
            autor: "Chorão"
        },
        {
            texto: "\"De vez em quando na vida se pode encontrar<br />Raro mas não impossível, de fato, é amar\"",
            autor: "O Terno"
        },
        {
            texto: "\"Eu e você e mais nada e não sobra e não falta e não tem lugar<br />Onde mais eu queira estar\"",
            autor: "5 a Seco"
        },
        {
            texto: "\"Tudo em volta tem me confirmado, bebê<br />Que eu e você somos coisa de alma\"",
            autor: "Tim Bernardes"
        },
        {
            texto: "\"Ó meu bem quero estar ao seu lado<br />Quando amanhecer, quero estar ao seu lado\"",
            autor: "Scalene"
        },
        {
            texto: "\"Meu amor, eu agradeço<br />Para sempre o dia que eu te conheci\"",
            autor: "Tim Bernardes"
        },
        {
            texto: "\"Eu nasci pra você, cê nasceu pra mim<br />E a gente junto é descomplicado\"",
            autor: "Teago Oliveira"
        }
    ],

    // 8. Galeria de Fotos
    galeria: [
        // Coloque "oculta: true" nas fotos que só devem aparecer ao clicar em "Ver Mais"
        { src: "https://images.unsplash.com/photo-1719499683843-721331f2495f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D", alt: "Ensaio Praia 1", oculta: false },
        { src: "https://images.unsplash.com/photo-1646096303391-ecd2436d4ac7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D", alt: "Ensaio Praia 2", oculta: false },
        { src: "https://images.unsplash.com/photo-1624228652376-d4faa602b278?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZW5zYWlvJTIwY2FzYWwlMjBuZWdyb3xlbnwwfHwwfHx8Mg%3D%3D", alt: "Ensaio Praia 3", oculta: false },
        { src: "https://images.unsplash.com/photo-1730342754572-1d1f426e40e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZW5zYWlvJTIwY2FzYWwlMjBuZWdyb3xlbnwwfHwwfHx8Mg%3D%3D", alt: "Ensaio Campo 1", oculta: true },
        { src: "https://images.unsplash.com/photo-1655759738542-7249f691f27d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZW5zYWlvJTIwY2FzYWwlMjBtaW5pbWFsaXN0YXxlbnwwfHwwfHx8Mg%3D%3D", alt: "Ensaio Campo 2", oculta: true },
        { src: "https://images.unsplash.com/photo-1655759738542-7249f691f27d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZW5zYWlvJTIwY2FzYWwlMjBtaW5pbWFsaXN0YXxlbnwwfHwwfHx8Mg%3D%3D", alt: "Ensaio Campo 3", oculta: true },
        { src: "https://images.unsplash.com/photo-1724086574968-94cef43f3d8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVuc2FpbyUyMGNhc2FsJTIwbWluaW1hbGlzdGF8ZW58MHx8MHx8fDI%3D", alt: "Ensaio Campo 4", oculta: true },
        { src: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FzYWx8ZW58MHwxfDB8fHwy", alt: "Ensaio Campo 4", oculta: true },
        { src: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FzYWx8ZW58MHwxfDB8fHwy", alt: "Ensaio Campo 4", oculta: true },
    ]

};