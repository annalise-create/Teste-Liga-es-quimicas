/*
 * Arquivo: script.js
 * Função: Contém a lógica JavaScript para interagir com a API Gemini e manipular a interface.
 */

// ----------------------------------------------------------------------
// CONFIGURAÇÕES DA API GEMINI
// ----------------------------------------------------------------------
const apiKey = ""; // Deixe em branco; o ambiente Canvas fornece a chave em tempo de execução.
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

// ----------------------------------------------------------------------
// ELEMENTOS DA DOM
// ----------------------------------------------------------------------
const promptInput = document.getElementById('promptInput');
const generateButton = document.getElementById('generateButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const outputContainer = document.getElementById('outputContainer');
const responseText = document.getElementById('responseText');
const messageBox = document.getElementById('messageBox');

// ----------------------------------------------------------------------
// FUNÇÕES DE UTILIDADE
// ----------------------------------------------------------------------

/**
 * Exibe mensagens de erro ou sucesso para o usuário.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - 'error' ou 'success'.
 */
function showMessage(message, type = 'error') {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');
    
    // Remove classes anteriores e aplica as novas classes Tailwind
    if (type === 'error') {
        // Classes para erro (vermelho)
        messageBox.classList.add('bg-red-100', 'text-red-800', 'border-red-400');
        messageBox.classList.remove('bg-green-100', 'text-green-800', 'border-green-400');
    } else if (type === 'success') {
        // Classes para sucesso (verde)
        messageBox.classList.add('bg-green-100', 'text-green-800', 'border-green-400');
        messageBox.classList.remove('bg-red-100', 'text-red-800', 'border-red-400');
    }
    
    messageBox.classList.remove('hidden');
}

// ----------------------------------------------------------------------
// LÓGICA PRINCIPAL DA API
// ----------------------------------------------------------------------

async function generateText() {
    const userQuery = promptInput.value.trim();

    if (!userQuery) {
        showMessage("Por favor, digite um prompt para gerar o texto.");
        return;
    }

    // 1. Configurar o estado de carregamento
    responseText.textContent = '';
    outputContainer.classList.add('hidden');
    messageBox.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    generateButton.disabled = true;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
    };

    // 2. Tentar chamar a API com Backoff Exponencial
    const maxRetries = 5;
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Erro API ${response.status}: ${errorBody.error?.message || response.statusText}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            // 3. Processar o resultado
            if (text) {
                responseText.textContent = text;
                outputContainer.classList.remove('hidden');
                showMessage("Geração concluída com sucesso!", 'success');
            } else {
                showMessage("A IA não retornou um texto. Tente reformular seu prompt.");
            }
            
            // Sucesso, sair do loop
            break; 

        } catch (error) {
            console.error("Erro na geração de texto:", error);
            
            if (currentRetry < maxRetries - 1) {
                // Se não for o último retry, espera e tenta novamente
                const delay = Math.pow(2, currentRetry) * 1000; 
                await new Promise(resolve => setTimeout(resolve, delay));
                currentRetry++;
            } else {
                // Último retry falhou
                showMessage(`Falha ao conectar ou gerar texto após ${maxRetries} tentativas. Verifique o console para mais detalhes.`);
                break;
            }
        }
    }

    // 4. Limpar o estado de carregamento
    loadingIndicator.classList.add('hidden');
    generateButton.disabled = false;
}

// ----------------------------------------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------------------------------------
generateButton.addEventListener('click', generateText);