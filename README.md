# Chess Game

Este é um jogo de xadrez básico para dois jogadores, implementado usando apenas HTML, CSS e JavaScript. O objetivo é fornecer uma base funcional de um jogo de xadrez com validação de movimentos e detecção de xeque, ideal para quem está aprendendo desenvolvimento web ou quer um projeto para colocar no portfólio.

---

## Funcionalidades

* **Tabuleiro Interativo:** Interface visual clara com casas de cores alternadas e peças de xadrez em Unicode.
* **Seleção e Destaque:** Ao clicar em uma peça, o quadrado é destacado em verde.
* **Movimentos Válidos:** Os quadrados para onde a peça selecionada pode se mover legalmente são destacados em azul claro. Se o movimento resultar em uma captura, o quadrado de destino é destacado em vermelho.
* **Validação de Regras:**
    * **Peões:** Movimento de uma ou duas casas para frente no primeiro lance, e captura diagonal.
    * **Torres, Bispos, Rainhas:** Movimentos em linha reta ou diagonal, sem pular peças.
    * **Cavalos:** Movimento em "L".
    * **Reis:** Movem uma casa em qualquer direção.
    * **Capturas:** Peças inimigas podem ser capturadas.
    * **Xeque:** O jogo detecta quando um rei está sob ataque ("em xeque") e exibe uma mensagem de aviso, além de destacar o rei. Movimentos que colocariam o próprio rei em xeque são **impedidos**.
* **Promoção de Peão:** Automaticamente promove um peão para Rainha ao atingir a última fileira.
* **Alternância de Turnos:** O turno é automaticamente passado para o próximo jogador após cada movimento válido.
* **Reiniciar Jogo:** Um botão permite reiniciar o tabuleiro para a posição inicial a qualquer momento.

---

## Como Usar

Para executar este jogo em seu ambiente local, siga estes passos simples:

1.  **Clone ou Baixe o Repositório:** Obtenha os arquivos do projeto.
2.  **Estrutura de Arquivos:** Certifique-se de que os arquivos `index.html` e `script.js` estejam na **mesma pasta**.
3.  **Abra no Navegador:** Basta abrir o arquivo `index.html` em qualquer navegador web moderno.

---

## Estrutura do Projeto

* `index.html`: Contém a estrutura HTML do jogo e todo o CSS para estilização.
* `script.js`: Contém toda a lógica JavaScript, incluindo a renderização do tabuleiro, manipulação de eventos, validação de movimentos e detecção de xeque.

---

## Próximos Passos (Possíveis Melhorias)

Este jogo serve como um excelente ponto de partida. Se você deseja aprimorá-lo, considere implementar as seguintes funcionalidades:

* **Xeque-mate e Afogamento (Stalemate):** Implementar a lógica para determinar o fim do jogo por xeque-mate ou afogamento.
* **Roque:** Adicionar o movimento especial de roque para o rei e a torre.
* ***En Passant*:** Implementar a regra de captura especial para peões.
* **Interface de Promoção de Peão:** Permitir que o jogador escolha qual peça (Rainha, Torre, Bispo ou Cavalo) o peão será promovido.
* **Histórico de Movimentos:** Manter e exibir uma lista de todos os movimentos realizados durante a partida.
* **Sons:** Adicionar efeitos sonoros para movimentos, capturas e xeque.
* **Design Responsivo:** Otimizar o layout para diferentes tamanhos de tela.

---

Sinta-se à vontade para explorar o código, fazer modificações e adicionar novas funcionalidades!