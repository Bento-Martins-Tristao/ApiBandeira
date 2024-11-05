let correctCountry;
let options = [];
let totalJogadas = 0;
let maxJogadas = 10;
let score = 0; // Inicializando a pontuação


function getCountryNameInPortuguese(country) {
    return country.translations && country.translations.por ? 
        country.translations.por.common : country.name.common;
};

// Função para buscar e exibir uma nova bandeira
function getRandomCountries() {
    // Pega uma bandeira aleatória da API
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            const randomIndex = Math.floor(Math.random() * data.length);
            correctCountry = data[randomIndex];
            options = [correctCountry];

            // Verifica se o país existe na API
            if (!correctCountry.flags) {
                console.log("Bandeira não encontrada para este país.");
                return; // Se não houver bandeira, tenta outro país
            }

            // Adiciona 3 opções aleatórias de países
            while (options.length < 4) {
                const randomOption = data[Math.floor(Math.random() * data.length)];
                if (!options.includes(randomOption) && randomOption.flags) {
                    options.push(randomOption);
                }
            }

            options.sort(() => Math.random() - 0.5); // Embaralha as opções
            displayQuestion(); // Exibe a questão
        })
        .catch(error => {
            console.error('Erro ao buscar dados de países:', error);
            displayErrorMessage(); // Exibe uma mensagem de erro caso a API não seja acessível
        });
}

// Função para exibir a pergunta e a bandeira
function displayQuestion() {
    const flagImage = document.getElementById('flagImage');
    flagImage.src = correctCountry.flags.png;  // Atribui a URL ou o caminho da imagem
    flagImage.style.display = 'block';  // Torna a imagem visível

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = getCountryNameInPortuguese(option);
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

// Função para verificar se a resposta está correta
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    totalJogadas++; // Incrementa o contador de jogadas

    if (selected.name.common === correctCountry.name.common) {
        score++; // Incrementa a pontuação se a resposta for correta
        resultDiv.innerHTML = `<p style="color: green; font-weight: bold;">Correto! Pontuação: ${score}/${totalJogadas}</p>`;
    } else {
        resultDiv.innerHTML = `<p style="color: red; font-weight: bold;">Incorreto!<br>O país correto era: ${getCountryNameInPortuguese(correctCountry)}.<br>Pontuação: ${score}/${totalJogadas}</p>`;
    }

    // Aguardar 1,5 segundo e carregar a próxima bandeira
    setTimeout(() => {
        document.getElementById('result').innerHTML = ''; // Limpa o resultado
        if (totalJogadas < maxJogadas) {
            getRandomCountries(); // Carrega uma nova bandeira automaticamente
        } else {
            endGame(); // Se atingiu o limite de jogadas, encerra o jogo
        }
    }, 1500);
}

// Função de fim de jogo
function endGame() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p style="font-size: 24px; color: blue;">Fim do jogo! Você completou ${maxJogadas} jogadas.</p>`;
    resultDiv.innerHTML += `<p>Você acertou ${score} de ${maxJogadas} perguntas!</p>`;
}

// Função para exibir uma mensagem de erro caso a API não esteja disponível ou algum erro ocorra
function displayErrorMessage() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p style="color: red; font-weight: bold;">Erro ao carregar dados da API. Tente novamente mais tarde.</p>';
    setTimeout(() => {
        window.location.reload(); // Recarrega a página após um erro
    }, 3000); // Recarrega após 3 segundos
}

// Inicia o jogo
getRandomCountries();