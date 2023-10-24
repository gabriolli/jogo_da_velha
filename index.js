const snd_click = './snd/click.mp3';
const snd_inicio = './snd/inicio.mp3';
const snd_risada = './snd/risada.mp3';
const snd_palmas = './snd/palmas.mp3';
let jogo = {
    matriz: [],  // matriz de jogo (contém 0, 1 ou 5)
    jogador: -1,  // jogador: 1 (usuário), 2 (cpu), 0 introdução e -1 pausa
    rodadas: 0,
    posvenc: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],  // Posição vencedora na matriz
              [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
    nrovenc: -1  // linha, coluna ou diagonal vencedora 0 a 7 (-1 empate ou em jogo)
}
let cron = {  // cronômetro
    min: 0,
    seg: 0,
    tempo: null  // armazena o ID da função cronometro para pausar o tempo
}  

const bts = document.getElementById('botoes');
bts.addEventListener('click', eventos);

function eventos(pev) {
    if (!(pev.target.nodeName === 'BUTTON')) {
        return;
    }
    if (pev.target.id === 'iniciar' && jogo.jogador !== 0) {
        clearInterval(cron.tempo);  // remove a função do cronômetro
        som(snd_inicio, 1, 1.2);
        jogo.jogador = 0;
        cron.min = cron.seg = 0;
        document.getElementById('cron').innerHTML = '00:00';
        for (let i = 0; i < 9; i++) {
            document.getElementById('b' + i).style.backgroundColor = 'orange';
        }
        inicio3();
    } else {
        if (jogo.jogador === 1) {
            let bt = pev.target.id[1];  // calcula o nro. do botão pressionado (0 a 8).
            let lin = Math.floor(bt / 3);  // calcula lin (matriz de jogo) do botão press.
            let col = bt % 3;  // calcula col (matriz de jogo) do botão press.
            if (jogo.matriz[lin][col] === 0) {
                som(snd_click, 1, 1.2);
                document.getElementById(pev.target.id).innerHTML = 'X';
                jogo.matriz[lin][col] = 1;  // insere na matriz (lin, col) o valor 1 (usuário)
                jogo.rodadas++;  // uma rodada a mais
                jogo.jogador = 2;  // cpu (2) é a próxima a jogar 
                fimJogo();  // verifica fim do jogo após a jogada do usuário
            }
        }
    }
}

function cpu() {
    if (jogo.jogador === 2) {
        if (trywin()) {
            jogo.jogador = 1;
            jogo.rodadas++;
            fimJogo();
            return;
        } else if (bloquearVitoriaJogador1()) {
            jogo.jogador = 1;
            jogo.rodadas++;
            fimJogo();
            return;  
        } else {
            // CPU não bloqueou, faça uma jogada aleatória.
            cpuAleatorio();
        }
    }
}
function bloquearVitoriaJogador1() {
  // Verificar todas as possíveis linhas verticais e horizontais
  for (let i = 0; i < 3; i++) {
    // Verificar linhas horizontais
    if (jogo.matriz[i][0] === 1 && jogo.matriz[i][1] === 1 && jogo.matriz[i][2] === 0) {
      // Bloquear a vitória do jogador 1
      jogo.matriz[i][2] = 5; // 5 representa a jogada da CPU
      document.getElementById('b' + (i * 3 + 2)).innerHTML = 'O'; // Marcar a posição na interface
      som(snd_click, 1, 1.2);
      return true;
    }
    if (jogo.matriz[i][0] === 1 && jogo.matriz[i][2] === 1 && jogo.matriz[i][1] === 0) {
      // Bloquear a vitória do jogador 1
      jogo.matriz[i][1] = 5; // 5 representa a jogada da CPU
      document.getElementById('b' + (i * 3 + 1)).innerHTML = 'O'; // Marcar a posição na interface
      som(snd_click, 1, 1.2);
      return true;
    }
    if (jogo.matriz[i][2] === 1 && jogo.matriz[i][1] === 1 && jogo.matriz[i][0] === 0) {
        // Bloquear a vitória do jogador 1
        jogo.matriz[i][1] = 5; // 5 representa a jogada da CPU
        document.getElementById('b' + (i * 3)).innerHTML = 'O'; // Marcar a posição na interface
        som(snd_click, 1, 1.2);
        return true;
      }

    // Verificar linhas verticais
    if (jogo.matriz[0][i] === 1 && jogo.matriz[1][i] === 1 && jogo.matriz[2][i] === 0) {
      jogo.matriz[2][i] = 5;
      document.getElementById('b' + (2 * 3 + i)).innerHTML = 'O';
      som(snd_click, 1, 1.2);
      return true;
    }
    if (jogo.matriz[0][i] === 1 && jogo.matriz[2][i] === 1 && jogo.matriz[1][i] === 0) {
      jogo.matriz[1][i] = 5;
      document.getElementById('b' + (1 * 3 + i)).innerHTML = 'O';
      som(snd_click, 1, 1.2);
      return true;
    }
    if (jogo.matriz[2][i] === 1 && jogo.matriz[1][i] === 1 && jogo.matriz[0][i] === 0) {
        // Bloquear a vitória do jogador 1
        jogo.matriz[i][1] = 5; // 5 representa a jogada da CPU
        document.getElementById('b' + (i * 3)).innerHTML = 'O'; // Marcar a posição na interface
        som(snd_click, 1, 1.2);
        return true;
      }
  }
// Verificar diagonais
    if (jogo.matriz[2][0] === 1 && jogo.matriz[1][1] === 1 && jogo.matriz[0][2] === 0) {
       jogo.matriz[0][2] = 5;
       document.getElementById('b2').innerHTML = 'O';
       som(snd_click, 1, 1.2);
       return true;
  }
    if (jogo.matriz[0][0] === 1 && jogo.matriz[1][1] === 1 && jogo.matriz[2][2] === 0) {
       jogo.matriz[2][2] = 5;
       document.getElementById('b8').innerHTML = 'O';
       som(snd_click, 1, 1.2);
       return true;
  }
    if (jogo.matriz[0][0] === 1 && jogo.matriz[2][2] === 1 && jogo.matriz[1][1] === 0) {
      jogo.matriz[1][1] = 5;
      document.getElementById('b4').innerHTML = 'O';
      som(snd_click, 1, 1.2);
      return true;
    }
    if (jogo.matriz[0][2] === 1 && jogo.matriz[1][1] === 1 && jogo.matriz[2][0] === 0) {
      jogo.matriz[2][0] = 5;
      document.getElementById('b6').innerHTML = 'O';
      som(snd_click, 1, 1.2);
      return true;
    }
    if (jogo.matriz[2][2] === 1 && jogo.matriz[1][1] === 1 && jogo.matriz[0][0] === 0) {
        jogo.matriz[0][0] = 5;
        document.getElementById('b0').innerHTML = 'O';
        som(snd_click, 1, 1.2);
        return true;
      }
  }


  function trywin() {
    // Verificar todas as possíveis linhas, colunas e diagonais
    for (let i = 0; i < 3; i++) {
        // Verificar linhas
        if (jogo.matriz[i][0] === 5 && jogo.matriz[i][1] === 5 && jogo.matriz[i][2] === 0) {
            // O CPU pode ganhar na próxima jogada
            jogo.matriz[i][2] = 5;
            document.getElementById('b' + (i * 3 + 2)).innerHTML = 'O'; // Atualiza a interface
            som(snd_click, 1, 1.2);
            return true;
        }
        if (jogo.matriz[i][0] === 5 && jogo.matriz[i][2] === 5 && jogo.matriz[i][1] === 0) {
            // O CPU pode ganhar na próxima jogada
            jogo.matriz[i][1] = 5;
            document.getElementById('b' + (i * 3 + 1)).innerHTML = 'O'; // Atualiza a interface
            som(snd_click, 1, 1.2);
            return true;
        }

        // Repetir o mesmo processo para colunas
        if (jogo.matriz[0][i] === 5 && jogo.matriz[1][i] === 5 && jogo.matriz[2][i] === 0) {
            // O CPU pode ganhar na próxima jogada
            jogo.matriz[2][i] = 5;
            document.getElementById('b' + (2 * 3 + i)).innerHTML = 'O'; // Atualiza a interface
            som(snd_click, 1, 1.2);
            return true;
        }
        if (jogo.matriz[0][i] === 5 && jogo.matriz[2][i] === 5 && jogo.matriz[1][i] === 0) {
            // O CPU pode ganhar na próxima jogada
            jogo.matriz[1][i] = 5;
            document.getElementById('b' + (1 * 3 + i)).innerHTML = 'O'; // Atualiza a interface
            som(snd_click, 1, 1.2);
            return true;
        }
        // Verificar o mesmo para as diagonais
        if (jogo.matriz[2][0] === 5 && jogo.matriz[1][1] === 5 && jogo.matriz[0][2] === 0) {
            jogo.matriz[0][2] = 5;
            document.getElementById('b2').innerHTML = 'O';
            som(snd_click, 1, 1.2);
            return true;
       }
         if (jogo.matriz[0][0] === 5 && jogo.matriz[1][1] === 5 && jogo.matriz[2][2] === 0) {
            jogo.matriz[2][2] = 5;
            document.getElementById('b8').innerHTML = 'O';
            som(snd_click, 1, 1.2);
            return true;
       }
         if (jogo.matriz[0][0] === 5 && jogo.matriz[2][2] === 5 && jogo.matriz[1][1] === 0) {
           jogo.matriz[1][1] = 5;
           document.getElementById('b4').innerHTML = 'O';
           som(snd_click, 1, 1.2);
           return true;
         }
         if (jogo.matriz[0][2] === 5 && jogo.matriz[1][1] === 5 && jogo.matriz[2][0] === 0) {
           jogo.matriz[2][0] = 5;
           document.getElementById('b6').innerHTML = 'O';
           som(snd_click, 1, 1.2);
           return true;
         }
         if (jogo.matriz[2][2] === 5 && jogo.matriz[1][1] === 5 && jogo.matriz[0][0] === 0) {
             jogo.matriz[0][0] = 5;
             document.getElementById('b0').innerHTML = 'O';
             som(snd_click, 1, 1.2);
             return true;
           }
    }

    // Verificar diagonais
    if (jogo.matriz[0][0] === 5 && jogo.matriz[1][1] === 5 && jogo.matriz[2][2] === 0) {
        // O CPU pode ganhar na próxima jogada
        jogo.matriz[2][2] = 5;
        document.getElementById('b0').innerHTML = 'O'; // Atualiza a interface
        som(snd_click, 1, 1.2);
        return true;
    }
    if (jogo.matriz[0][0] === 5 && jogo.matriz[2][2] === 5 && jogo.matriz[1][1] === 0) {
        // O CPU pode ganhar na próxima jogada
        jogo.matriz[1][1] = 5;
        document.getElementById('b4').innerHTML = 'O'; // Atualiza a interface
        som(snd_click, 1, 1.2);
        return true;
    }
    if (jogo.matriz[0][2] === 5 && jogo.matriz[1][1] === 5 && jogo.matriz[2][0] === 0) {
        // O CPU pode ganhar na próxima jogada
        jogo.matriz[2][0] = 5;
        document.getElementById('b6').innerHTML = 'O'; // Atualiza a interface
        som(snd_click, 1, 1.2);
        return true;
    }
    if (jogo.matriz[0][2] === 5 && jogo.matriz[2][0] === 5 && jogo.matriz[1][1] === 0) {
        // O CPU pode ganhar na próxima jogada
        jogo.matriz[1][1] = 5;
        document.getElementById('b4').innerHTML = 'O'; // Atualiza a interface
        som(snd_click, 1, 1.2);
        return true;
    }
}

  function cpuAleatorio() {
    let lin, col;
    do {   // gera na matriz (lin, col) uma posição vazia (0)
        lin = Math.floor(Math.random() * 3);  // gera uma linha de 0 a 2
        col = Math.floor(Math.random() * 3);  // gera uma coluna de 0 a 2
    } while (jogo.matriz[lin][col] !== 0);  // enquanto diferente de vazio (0)
    som(snd_click, 1, 1.2);
    let bt = lin * 3 + col;  // calcula qual botão foi "escolhido" pela cpu
    document.getElementById('b' + bt).innerHTML = 'O';  // insere círculo (O) na posição 
    jogo.matriz[lin][col] = 5;  // insere na matriz (lin, col) o valor 5 (cpu)
    jogo.jogador = 1;  // usuário (1) é o próximo a jogar
    jogo.rodadas++;  // uma rodada a mais
    fimJogo();  // verifica fim do jogo após a jogada da cpu
}

function cronometro() {
    cron.seg++;  // incrementa os segundos
    if (cron.seg === 60) {  // verifica se seg chegou a 60
        cron.min++;  // incrementa os minutos
        cron.seg = 0;  // reinicia os segundos (zero)
    }
    m = cron.min < 10 ? '0' + cron.min : '' + cron.min;  // acrescenta um 0 à esq. se < 10
    s = cron.seg < 10 ? '0' + cron.seg : '' + cron.seg;
    document.getElementById('cron').innerHTML = m + ':' + s;
}

function fimJogo() {
    let fim = false;
    // Somas das linhas, colunas e diagonais
    let somas = [];
    somas.push(jogo.matriz[0][0] + jogo.matriz[0][1] + jogo.matriz[0][2]);
    somas.push(jogo.matriz[1][0] + jogo.matriz[1][1] + jogo.matriz[1][2]);
    somas.push(jogo.matriz[2][0] + jogo.matriz[2][1] + jogo.matriz[2][2]);
    somas.push(jogo.matriz[0][0] + jogo.matriz[1][0] + jogo.matriz[2][0]);
    somas.push(jogo.matriz[0][1] + jogo.matriz[1][1] + jogo.matriz[2][1]);
    somas.push(jogo.matriz[0][2] + jogo.matriz[1][2] + jogo.matriz[2][2]);
    somas.push(jogo.matriz[0][0] + jogo.matriz[1][1] + jogo.matriz[2][2]);
    somas.push(jogo.matriz[0][2] + jogo.matriz[1][1] + jogo.matriz[2][0]);
    for (let i = 0; i < 8; i++) {
        if (somas[i] === 3) {  // soma 3 indica X como ganhador
            som(snd_palmas, 0.8, 1);
            jogo.nrovenc = i;  // armazena a linha, coluna ou diagonal do vencedor (usuário)
            fim = true;
        } else if (somas[i] === 15) {  // soma 15 indica O como ganhador
            som(snd_risada, 1, 1.4);
            jogo.nrovenc = i;  // armazena a linha, coluna ou diagonal do vencedor (cpu)
            fim = true;
        }
    } 
    if (jogo.rodadas === 9)  // verifica se foi a última rodada e termina o jogo
        fim = true;
    if (fim) {
        resultado();  // mostra o resultado
        clearInterval(cron.tempo);  // pausa o cronômetro
        jogo.jogador = -1;  // jogo é pausado
    }
    else if (jogo.jogador == 2)  // verifica se o próximo jogador é a cpu
        setTimeout(cpu, 2000);  // agenda a jogada da CPU para 2 segundos a partir desse momento
}

function resultado() {
    for (let i = 0; i < 9; i++) {  // define cinza para todos os botões (matriz de jogo)
        document.getElementById('b' + i).style.backgroundColor = 'gray';
    }
    if (jogo.nrovenc !== -1) {  // verifica se houve vencedor
        for (let bt of jogo.posvenc[jogo.nrovenc]) {  // altera a cor da lin, col ou diag vencedora
            document.getElementById('b' + bt).style.backgroundColor = 'orange';
        }
    }
}

function inicio3() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('b' + i).innerHTML = '3';
    }
    setTimeout(inicio2, 1000);  // agenda a função inicio2 para 1 seg depois
}

function inicio2() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('b' + i).innerHTML = '2';
    }
    setTimeout(inicio1, 1000);  // agenda a função inicio1 para 1 seg depois
}

function inicio1() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('b' + i).innerHTML = '1';
    }
    setTimeout(inicio, 1000);  // agenda a função inicio para 1 seg depois
}

function inicio() {
    cron.tempo = setInterval(cronometro, 1000);  // inicia a função cronometro a cada 1 seg.
    jogo.jogador = Math.floor(Math.random() * 2 + 1);  // sorteia quem inicia o jogo (1 ou 2)
    jogo.matriz = [[0, 0, 0], 
                   [0, 0, 0], 
                   [0, 0, 0]];  // 0: vazio, 1: X e 5: O
    jogo.rodadas = 0;
    jogo.nrovenc = -1;  // -1 indica empate ou em jogo
    for (let i = 0; i < 9; i++) {  // apaga o conteúdos dos botôes (matriz de jogo)
        document.getElementById('b' + i).innerHTML = '';
    }
    if (jogo.jogador === 2)  // se a cpu inicia, agenda a joga da cpu para 0,1 seg.
        setTimeout(cpu, 100);
}

function som(psom, pvol, pvel) {
	let snd = new Audio(psom);
	snd.playbackRate = pvel;
    snd.volume = pvol;
	snd.play();
}
