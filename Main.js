const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemonNames = [];
const fetchPromises = [];
const maxPokeDex = 1008;
const battle = document.querySelector(".battle");
const pokeCardsSection = document.querySelector(".poke-cards");
const start = document.querySelector("#startBt");
const buyBT = document.querySelector("#buy-Bt");
const fight = document.querySelector(".fight");
const oneSide = document.querySelector(".one-side");
const oponentNameElement = document.querySelector("#o-pokeNameMine");
const minePoke = document.querySelector(".mine-image");
const oponentPoke = document.querySelector(".o-image");
const pokeNameMine = document.querySelector("#pokeNameMine");
const oponentHealthInd = document.querySelector(".oponentHealth")
const healthBarAdd = document.querySelector(".healthBarAdd");
const audio = document.getElementById('audio');
const damageCount = document.querySelector('.damage');
const winScreen = document.querySelector('.win');
const restartBt = document.querySelector('.restartBt');
let oponentName = [];
let oponentLife = sorteador(250, 400);
let audioPlayed = false;
//criacao da barra de vida de cada pokemon
const healthBar = `
        <div class="barraFundo">
            <div class="barraVida">         
            </div>
        </div>
        `

//primeira letra do texto maiuscula
function maiuscula(x) {
    if (!x) {
        return x;
    }

    return x.charAt(0).toUpperCase() + x.slice(1);
}

//funcao sortear numero
function sorteador(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//funcao sortear os pokemons pelo numero da pokedex
(function () {
    for (let i = 0; i < 4; i++) {
        const dexNum = sorteador(1, maxPokeDex);
        const fetchPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${dexNum}`)
            .then(response => response.json())
            .then(data => {
                if (i === 3) {
                    oponentDexNum = dexNum;
                    oponentName.push(data.name);
                } else {
                    pokemonNames.push(data.name);
                }
            })
            .catch(error => console.error(error));
        fetchPromises.push(fetchPromise);
    }
})();

//funcao para ficar em constante verificacao, para saber quando o oponente morrer
function verificarVariavel() {
    if (oponentLife <= 0 && !audioPlayed) {
        battle.style.display = 'none';
        winScreen.style.display = 'flex';
        audio.play(); //tocar musica de vitoria
        audioPlayed = true;
    }
    oponentHealthInd.innerHTML = oponentLife; //resetar barra de vida do oponente com a vida atual
    setTimeout(verificarVariavel, 700); //tempo para verificação
}

//funcao para aparecer a contagem de dano na tela
function damageCountAppear(x) {
    //para acontecer a animacao
    damageCount.style.color = x;
    damageCount.style.transition = '2s';
    damageCount.innerHTML = `-${tirandoVida}`;
    damageCount.style.marginTop = '-24vw';
    damageCount.style.opacity = '24%';
    //para resetar a animacao
    setTimeout(function () {
        damageCount.style.transition = '0s';
        setTimeout(function () {
            damageCount.innerHTML = ``;
            damageCount.style.marginTop = '0';
            damageCount.style.opacity = '100%';
        }, 10)
    }, 800)
}

//botao restart final do jogo
restartBt.addEventListener("click", function () {
    location.reload();
})

start.addEventListener("click", function () {
    start.style.display = "none";
    pokeCardsSection.style.display = 'flex';

    //gerar o inimigo
    oponentNameElement.innerHTML = oponentName;
    oponentPoke.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${oponentDexNum}.png`;

    //funcao para criar a carta com as informacoes dos pokemons
    function createCard(data) {
        const types = data.types.map((typeInfo) => typeInfo.type.name);
        const card = document.createElement('div');
        const dano1 = sorteador(10, 30);
        var mylife = sorteador(250, 400);
        const myLifeS = mylife;
        card.classList.add('poke-card');
        card.id = 'poke-card';

        //criacao da carta em si com elementos html
        card.innerHTML = `
    <div class="poke-card" id="poke-card">
    <div class="img-nome-pokemon" id="img-nome-pokemon">
        <div class="nome-vida">
            <div class="name-background" id="name-background">
                <h1 class="pokemonName" id="pokemonName">${maiuscula(data.name)}</h1>
            </div>
            <p class="vida" id="vida">hp${mylife}</p>
        </div>
        <div class="image-center"><img id="firstPokemonImage" src="${data.sprites.front_default}" alt=""></div>
    </div>
    <div class="scroll">
        <div class="centralizar-ataques">
            <div class="centralizar-items-ataque">
                <p class="energia-necessaria">${sorteador(1, 3)}</p>
                <p class="attackFonts" id="firstAttack">${maiuscula(data.moves[0].move.name)}</p>
                <p class="dano-ataque">${dano1}</p>
            </div>
            <div class="centralizar-items-ataque">
                <p class="typeShow">${types}</p>
            </div>
        </div>
    </div>
    `;

        //PEGAR ELEMENTOS DAS CARTAS PARA ALTERAR O ESTILO
        const pokeBackground = card.querySelector(".img-nome-pokemon");
        const nameBackground = card.querySelector(".name-background");
        const pokeName = card.querySelector(".pokemonName");
        const vida = card.querySelector('.vida');
        const typeShow = card.querySelector('.typeShow');
        const typeColorList = ['#5b6057', '#FDEE00', '#FF3800', '#00B9E8', '#8DB600', '#F0F8FF', '#B87333', '#7851A9', '#DC143C', '#50C878', '#FE6F5E', '#242124', '#FF7900', '#228B22', '#F56FA1', '#414A4C', '#708090', '#B87333']

        //CONDICOES PARA ALTERAR O ESTILO DE ACORDO COM O TIPO
        function typeStyle() {
            if (types.includes("normal")) {
                borderColor = '#5b6057 solid 1vh';
                vida.style.textShadow = '0 0 2px #5b6057, 0 0 2px #5b6057, 0 0 3px #5b6057, 0 0 4px #5b6057, 0 0 5px #5b6057, 0 0 6px #5b6057, 0 0 7px #5b6057';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #5b6057, 0 0 2px #5b6057, 0 0 3px #5b6057, 0 0 4px #5b6057, 0 0 5px #5b6057, 0 0 6px #5b6057, 0 0 7px #5b6057';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFFF';
                nameBackground.style.backgroundColor = '#5b6057';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/normal.jpg)';
            } else if (types.includes("electric")) {
                borderColor = '#FDEE00 solid 1vh';
                vida.style.textShadow = '0 0 2px #FDEE00, 0 0 2px #FDEE00, 0 0 3px #FDEE00, 0 0 4px #FDEE00, 0 0 5px #FDEE00, 0 0 6px #FDEE00, 0 0 7px #FDEE00';
                vida.style.color = '#000000';
                typeShow.style.textShadow = '0 0 2px #FDEE00, 0 0 2px #FDEE00, 0 0 3px #FDEE00, 0 0 4px #FDEE00, 0 0 5px #FDEE00, 0 0 6px #FDEE00, 0 0 7px #FDEE00';
                typeShow.style.color = '#000000';
                pokeName.style.color = '#000000';
                nameBackground.style.backgroundColor = '#FDEE00';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/eletrico.jpeg)';
            } else if (types.includes("fire")) {
                borderColor = '#FF3800 solid 1vh';
                vida.style.textShadow = '0 0 2px #FF3800, 0 0 2px #FF3800, 0 0 3px #FF3800, 0 0 4px #FF3800, 0 0 5px #FF3800, 0 0 6px #FF3800, 0 0 7px #FF3800';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #FF3800, 0 0 2px #FF3800, 0 0 3px #FF3800, 0 0 4px #FF3800, 0 0 5px #FF3800, 0 0 6px #FF3800, 0 0 7px #FF3800';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFFF';
                nameBackground.style.backgroundColor = '#FF3800';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/fire.jpeg)';
            } else if (types.includes("water")) {
                borderColor = '#00B9E8 solid 1vh';
                vida.style.textShadow = '0 0 2px #00B9E8, 0 0 2px #00B9E8, 0 0 3px #00B9E8, 0 0 4px #00B9E8, 0 0 5px #00B9E8, 0 0 6px #00B9E8, 0 0 7px #00B9E8';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #00B9E8, 0 0 2px #00B9E8, 0 0 3px #00B9E8, 0 0 4px #00B9E8, 0 0 5px #00B9E8, 0 0 6px #00B9E8, 0 0 7px #00B9E8';
                typeShow.style.color = '#FFFFFF';
                nameBackground.style.backgroundColor = '#00B9E8';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/water.jpeg)';
            } else if (types.includes("grass")) {
                borderColor = '#8DB600 solid 1vh';
                vida.style.textShadow = '0 0 2px #8DB600, 0 0 2px #8DB600, 0 0 3px #8DB600, 0 0 4px #8DB600, 0 0 5px #8DB600, 0 0 6px #8DB600, 0 0 7px #8DB600';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #8DB600, 0 0 2px #8DB600, 0 0 3px #8DB600, 0 0 4px #8DB600, 0 0 5px #8DB600, 0 0 6px #8DB600, 0 0 7px #8DB600';
                typeShow.style.color = '#FFFFFF';
                nameBackground.style.backgroundColor = '#8DB600';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/planta.jpeg)';
            } else if (types.includes("ice")) {
                borderColor = '#F0F8FF solid 1vh';
                vida.style.textShadow = '0 0 2px #F0F8FF, 0 0 2px #F0F8FF, 0 0 3px #F0F8FF, 0 0 4px #00B9E8, 0 0 5px #00B9E8, 0 0 6px #00B9E8, 0 0 7px #00B9E8';
                typeShow.style.textShadow = '0 0 2px #F0F8FF, 0 0 2px #F0F8FF, 0 0 3px #F0F8FF, 0 0 4px #00B9E8, 0 0 5px #00B9E8, 0 0 6px #00B9E8, 0 0 7px #00B9E8';
                pokeName.style.color = '#000000';
                nameBackground.style.backgroundColor = '#F0F8FF';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/ice.jpeg)';
            } else if (types.includes("flying")) {
                borderColor = '#B87333 solid 1vh';
                vida.style.textShadow = '0 0 2px #B87333, 0 0 2px #B87333, 0 0 3px #B87333, 0 0 4px #B87333, 0 0 5px #B87333, 0 0 6px #B87333, 0 0 7px #B87333';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #B87333, 0 0 2px #B87333, 0 0 3px #B87333, 0 0 4px #B87333, 0 0 5px #B87333, 0 0 6px #B87333, 0 0 7px #B87333';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFFF';
                nameBackground.style.backgroundColor = '#B87333';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/voador.jpeg)';
            } else if (types.includes("ghost")) {
                borderColor = '#7851A9 solid 1vh';
                vida.style.textShadow = '0 0 2px #7851A9, 0 0 2px #7851A9, 0 0 3px #7851A9, 0 0 4px #7851A9, 0 0 5px #7851A9, 0 0 6px #7851A9, 0 0 7px #7851A9';
                typeShow.style.textShadow = '0 0 2px #7851A9, 0 0 2px #7851A9, 0 0 3px #7851A9, 0 0 4px #7851A9, 0 0 5px #7851A9, 0 0 6px #7851A9, 0 0 7px #7851A9';
                pokeName.style.color = '#000000';
                nameBackground.style.backgroundColor = '#7851A9';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/fantasma.jpeg)';
            } else if (types.includes("fighting")) {
                borderColor = '#DC143C solid 1vh';
                vida.style.textShadow = '0 0 2px #DC143C, 0 0 2px #DC143C, 0 0 3px #DC143C, 0 0 4px #DC143C, 0 0 5px #DC143C, 0 0 6px #DC143C, 0 0 7px #DC143C';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #DC143C, 0 0 2px #DC143C, 0 0 3px #DC143C, 0 0 4px #DC143C, 0 0 5px #DC143C, 0 0 6px #DC143C, 0 0 7px #DC143C';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#DC143C';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/lutador.jpeg)';
            } else if (types.includes("bug")) {
                borderColor = '#50C878 solid 1vh';
                vida.style.textShadow = '0 0 2px #50C878, 0 0 2px #50C878, 0 0 3px #50C878, 0 0 4px #50C878, 0 0 5px #50C878, 0 0 6px #50C878, 0 0 7px #50C878';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #50C878, 0 0 2px #50C878, 0 0 3px #50C878, 0 0 4px #50C878, 0 0 5px #50C878, 0 0 6px #50C878, 0 0 7px #50C878';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#50C878';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/inseto.jpeg)';
            } else if (types.includes("psychic")) {
                borderColor = '#FE6F5E solid 1vh';
                vida.style.textShadow = '0 0 2px #FE6F5E, 0 0 2px #FE6F5E, 0 0 3px #FE6F5E, 0 0 4px #FE6F5E, 0 0 5px #FE6F5E, 0 0 6px #FE6F5E, 0 0 7px #FE6F5E';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #FE6F5E, 0 0 2px #FE6F5E, 0 0 3px #FE6F5E, 0 0 4px #FE6F5E, 0 0 5px #FE6F5E, 0 0 6px #FE6F5E, 0 0 7px #FE6F5E';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#FE6F5E';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/psiquico.jpeg)';
            } else if (types.includes("dark")) {
                borderColor = '#242124 solid 1vh';
                vida.style.textShadow = '0 0 2px #242124, 0 0 2px #242124, 0 0 3px #242124, 0 0 4px #242124, 0 0 5px #242124, 0 0 6px #242124, 0 0 7px #242124';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #242124, 0 0 2px #242124, 0 0 3px #242124, 0 0 4px #242124, 0 0 5px #242124, 0 0 6px #242124, 0 0 7px #242124';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#242124';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/sombrio.jpeg)';
            } else if (types.includes("dragon")) {
                borderColor = '#FF7900 solid 1vh';
                vida.style.textShadow = '0 0 2px #FF7900, 0 0 2px #FF7900, 0 0 3px #FF7900, 0 0 4px #FF7900, 0 0 5px #FF7900, 0 0 6px #FF7900, 0 0 7px #FF7900';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #FF7900, 0 0 2px #FF7900, 0 0 3px #FF7900, 0 0 4px #FF7900, 0 0 5px #FF7900, 0 0 6px #FF7900, 0 0 7px #FF7900';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#FF7900';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/dragao.jpeg)';
            } else if (types.includes("poison")) {
                borderColor = '#228B22 solid 1vh';
                vida.style.textShadow = '0 0 2px #228B22, 0 0 2px #228B22, 0 0 3px #228B22, 0 0 4px #228B22, 0 0 5px #228B22, 0 0 6px #228B22, 0 0 7px #228B22';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #228B22, 0 0 2px #228B22, 0 0 3px #228B22, 0 0 4px #228B22, 0 0 5px #228B22, 0 0 6px #228B22, 0 0 7px #228B22';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#228B22';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/venenoso.jpeg)';
            } else if (types.includes("fairy")) {
                borderColor = '#F56FA1 solid 1vh';
                vida.style.textShadow = '0 0 2px #F56FA1, 0 0 2px #F56FA1, 0 0 3px #F56FA1, 0 0 4px #F56FA1, 0 0 5px #F56FA1, 0 0 6px #F56FA1, 0 0 7px #F56FA1';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #F56FA1, 0 0 2px #F56FA1, 0 0 3px #F56FA1, 0 0 4px #F56FA1, 0 0 5px #F56FA1, 0 0 6px #F56FA1, 0 0 7px #F56FA1';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#F56FA1';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/fada.jpeg)';
            } else if (types.includes("steel")) {
                borderColor = '#414A4C solid 1vh';
                vida.style.textShadow = '0 0 2px #414A4C, 0 0 2px #414A4C, 0 0 3px #414A4C, 0 0 4px #414A4C, 0 0 5px #414A4C, 0 0 6px #414A4C, 0 0 7px #414A4C';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #414A4C, 0 0 2px #414A4C, 0 0 3px #414A4C, 0 0 4px #414A4C, 0 0 5px #414A4C, 0 0 6px #414A4C, 0 0 7px #414A4C';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#414A4C';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/aco.jpeg)';
            } else if (types.includes("rock")) {
                borderColor = '#708090 solid 1vh';
                vida.style.textShadow = '0 0 2px #708090, 0 0 2px #708090, 0 0 3px #708090, 0 0 4px #708090, 0 0 5px #708090, 0 0 6px #708090, 0 0 7px #708090';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #708090, 0 0 2px #708090, 0 0 3px #708090, 0 0 4px #708090, 0 0 5px #708090, 0 0 6px #708090, 0 0 7px #708090';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#708090';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/pedra.jpeg)';
            } else if (types.includes("ground")) {
                borderColor = '#B87333 solid 1vh';
                vida.style.textShadow = '0 0 2px #B87333, 0 0 2px #B87333, 0 0 3px #B87333, 0 0 4px #B87333, 0 0 5px #B87333, 0 0 6px #B87333, 0 0 7px #B87333';
                vida.style.color = '#FFFFFF';
                typeShow.style.textShadow = '0 0 2px #B87333, 0 0 2px #B87333, 0 0 3px #B87333, 0 0 4px #B87333, 0 0 5px #B87333, 0 0 6px #B87333, 0 0 7px #B87333';
                typeShow.style.color = '#FFFFFF';
                pokeName.style.color = '#FFFFF';
                nameBackground.style.backgroundColor = '#B87333';
                pokeBackground.style.backgroundImage = 'url(assets/images/pokeBackgrounds/terra.jpeg)';
            }
            card.style.border = borderColor;
        }
        typeStyle();

        verificarVariavel();
        //evento de click dentro da carta especifica
        card.addEventListener("click", function () {
            typeStyle()
            fight.style.display = "flex";
            minePoke.style.display = 'block';
            oponentPoke.style.display = 'block';
            minePoke.src = data.sprites.front_default;
            pokeNameMine.innerHTML = maiuscula(data.name);
            oneSide.style.transition = '2s';

            //adicionar a barra de vida a carta de um pokemon especifico
            healthBarAdd.innerHTML = healthBar;

            const barraVida = document.querySelector(".barraVida");
            (function () {
                var barSave = (mylife / myLifeS) * 100;
                var barDown = (barSave / 100) * 9.7;
                barraVida.style.width = `${barDown}vw`
            })();

            //logica dos ataques
            setTimeout(function () {
                oponentLife -= dano1;
                tirandoVida = dano1;
                console.log('dano no oponente');
                damageCountAppear('purple');
                //alert(oponentLife);
                if (mylife <= 0) {
                    card.style.display = 'none';
                }
            }, 2000);
            setTimeout(function () {
                console.log('dano tomado')
                tirandoVida = sorteador(40, 75);
                mylife -= tirandoVida;
                damageCountAppear('green');
            }, 4000);
        });
        return card;
    }

    // FUNCAO PRA CRIAR E ADICIONAR UMA CARTA PRA UM POKEMON
    function fetchAndDisplayPokemon(pokemonName) {
        fetch(apiUrl + pokemonName)
            .then(response => response.json())
            .then(data => {
                const pokeCardElement = createCard(data);
                pokeCardsSection.appendChild(pokeCardElement);
            })
            .catch(error => console.error(error));
    }

    // Iterar sobre os nomes dos pokémons e criar um card para cada um
    for (const pokemonName of pokemonNames) {
        fetchAndDisplayPokemon(pokemonName);
    }
});


