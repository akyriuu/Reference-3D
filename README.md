# Reference 3D

Ferramenta de estudo de desenho: um manequim 3D posável de um lado, uma prancheta de
desenho do outro. Você gira a câmera em volta do boneco, ajusta a pose e desenha a
referência ao lado, na mesma tela.

## O que é

Sites de referência para desenho normalmente entregam fotos estáticas. O ângulo que
você precisa nunca é o que está disponível, e alternar entre a referência e o papel
quebra o ritmo do estudo.

<img width="590" height="537" alt="image" src="https://github.com/user-attachments/assets/8a70f066-7a37-4b08-842d-d1245d3e8676" />


<img width="1430" height="825" alt="image" src="https://github.com/user-attachments/assets/c37b7e6c-9679-484c-b7e4-0113227feb5c" />

<img width="509" height="312" alt="image" src="https://github.com/user-attachments/assets/e5a391e8-9dc8-4876-9103-6f2aec3c138f" />

<img width="319" height="291" alt="image" src="https://github.com/user-attachments/assets/a7a4e33c-04c2-4617-9ce5-1b4002104703" />



O reference3d resolve isso com um manequim construído a partir de primitivas (cápsulas
e esferas) que você posa diretamente: clica numa articulação e arrasta. A câmera orbita
livremente, então qualquer ângulo é acessível. E o painel de desenho fica lado a lado,
com um divisor arrastável para você equilibrar o espaço entre estudar a pose e desenhar.

Nada sai do navegador — não há conta, upload ou servidor envolvido no desenho.


<img width="1618" height="910" alt="image" src="https://github.com/user-attachments/assets/5c1703e6-4506-451b-ab30-8918c408ad83" />

<img width="378" height="481" alt="image" src="https://github.com/user-attachments/assets/a64bf3ca-2afe-4077-8842-abda21dee842" />




## Como funciona

Três decisões de arquitetura sustentam o projeto.

**O esqueleto é uma hierarquia de `<group>` do three.js.** O grupo do cotovelo vive
dentro do grupo do ombro, que vive dentro do tronco, que vive dentro do quadril. Girar
o ombro leva antebraço e mão junto, de graça, porque é o próprio grafo de cena que
propaga a transformação. Cada junta tem limites de flexão e torção próprios, definidos
em `skeleton.ts`, então não é possível dobrar o joelho para o lado errado.

**Os traços são guardados como dados, não como pixels.** Cada traço é um objeto com
seus pontos, cor, espessura e ferramenta. Desfazer é descartar o último e repintar;
exportar PNG é repintar num canvas maior. Nenhuma dessas operações precisa de código
próprio, todas saem da mesma estrutura.

**O desenho usa Pointer Events.** É isso que dá suporte a mouse, caneta e toque com um
único caminho de código, e o que permite capturar o ponteiro para o traço continuar
mesmo quando o cursor sai da área de desenho.

Para performance, os traços já finalizados vivem num canvas offscreen que só é
reconstruído quando o histórico muda. A cada movimento do ponteiro só são desenhados
esse cache mais o traço em andamento, em vez de repintar o desenho inteiro.

## O que está implementado

### Viewport 3D

- Manequim de 11 articulações: quadril, tronco, cabeça, ombros, cotovelos, coxas e joelhos.
- Pose por arraste direto: clique numa esfera e arraste — vertical dobra, horizontal gira.
- Limites anatômicos por junta, com eixo de torção escolhido por articulação (o tronco
  torce no próprio eixo, o ombro abre lateralmente).
- 5 presets de pose: Repouso, T, Contraposto, Corrida e Sentado.
- Câmera orbital com zoom entre 1.6 e 8 unidades e ângulo vertical limitado, para você
  não acabar embaixo do chão.
- Sombra de contato e grid infinito como apoio de perspectiva.
- Os manipuladores de junta ignoram teste de profundidade, então ficam visíveis e
  clicáveis mesmo atrás do corpo.

### Painel de desenho

- Lápis e borracha. A borracha é um traço normal com composição `destination-out`,
  portanto também entra no histórico e pode ser desfeita.
- Cor por paleta rápida ou seletor livre.
- Espessura de 1 a 48 px.
- Desfazer e refazer, com atalhos `Ctrl+Z` e `Ctrl+Shift+Z` (`Cmd` no macOS).
- Limpar tudo.
- Exportar PNG em 2× a resolução da tela, com fundo branco aplicado por composição para
  que a borracha apague tinta em vez de furar o fundo.
- Canvas ajustado ao `devicePixelRatio`, sem traço borrado em telas de alta densidade.

### Backend

- Serve o build do frontend em produção.
- `GET /api/health` para checagem de saúde.

O backend ainda não participa do desenho nem da pose. Ele existe preparado para as
funcionalidades de referências 2D do roadmap, que precisam de persistência.

## Compatibilidade de entrada

Todo o desenho passa por Pointer Events, então os três tipos de entrada funcionam sem
código separado:

| Entrada | Situação |
| --- | --- |
| Mouse | Suportado. Apenas o botão esquerdo inicia traço. |
| Mesa digitalizadora / caneta | Suportado para posição, com captura de ponteiro durante o traço. |
| Toque / touchscreen | Suportado. `touch-action: none` impede que o arraste role a página. |

A **pressão da caneta ainda não é aplicada** — os pontos guardam apenas coordenadas, e a
espessura vem do controle da barra de ferramentas. O modelo de dados já acomoda pressão
sem mudança estrutural; falta ler `event.pressure` e usar na renderização do traço.

## Stack

| Camada | Tecnologia |
| --- | --- |
| 3D | three.js, React Three Fiber, drei |
| Desenho | Canvas 2D nativo, Pointer Events |
| Frontend | React 19, TypeScript, Vite |
| Backend | NestJS 12, Express 5 |

## Rodando localmente

Requer Node 20 ou superior.

    # dependências da API e do frontend
    npm install
    npm --prefix client install

    # sobe API (3000) e frontend (5173) juntos
    npm run dev

Abra `http://localhost:5173`. O Vite faz proxy de `/api` para o Nest, então
`http://localhost:5173/api/health` já responde.

Para rodar como em produção, com o Nest servindo o build:

    npm run client:build
    npm run build
    npm run start:prod

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | API e frontend em watch, em paralelo |
| `npm run client:dev` | Só o frontend |
| `npm run start:dev` | Só a API |
| `npm run client:build` | Build do frontend em `client/dist` |
| `npm run build` | Build da API em `dist` |
| `npm run start:prod` | Serve API e frontend a partir dos builds |
| `npm test` | Testes da API |
| `npm run lint` | Lint da API |

## Estrutura

    src/                      API NestJS
    client/src/
      viewport/               manequim 3D
        skeleton.ts           juntas, limites e presets de pose
        usePose.ts            estado da pose
        Joint.tsx             pivô articulado + manipulador arrastável
        Mannequin.tsx         hierarquia do corpo
        Viewport.tsx          cena, luzes e câmera
        PosePanel.tsx         presets e status da seleção
      drawing/
        paint.ts              renderização de traço, replay e exportação
        useStrokes.ts         histórico de desfazer e refazer
        DrawingPanel.tsx      canvas e eventos de ponteiro
        Toolbar.tsx           ferramentas, cor e espessura
      layout/SplitPane.tsx    divisor arrastável
      types.ts                tipos compartilhados

## API

| Método | Rota | Resposta |
| --- | --- | --- |
| `GET` | `/api/health` | `{ status: 'ok', uptime: number }` |

## Roadmap

- [ ] **Referências 2D** — biblioteca de imagens de referência (fotos de pose, anatomia,
      panos, mãos) exibíveis no viewport ao lado do manequim, para cruzar o boneco com
      referência real.
- [ ] **Barra de pesquisa de referências** — busca por tags, parte do corpo, ângulo e
      tipo de pose sobre a biblioteca 2D.
- [ ] **Adicionar referências manualmente** — envio de imagens pela comunidade, com tags
      e atribuição de autoria, para o acervo crescer de forma colaborativa. É o primeiro
      recurso que exige de fato o backend: upload, armazenamento, moderação e
      persistência das tags.
- [ FEITO ] **Mais juntas no manequim** — pescoço separado da cabeça, coluna em dois ou três
      segmentos, pulsos, tornozelos, clavículas e dedos simplificados, para poses com
      leitura anatômica melhor.
- [ ] **Personalização do manequim** — proporções ajustáveis (altura, largura de ombro e
      quadril, comprimento de membros), tipos de corpo, alternância entre manequim
      simplificado e malha mais anatômica.
- [ ] **Deploy** — publicar a aplicação, com build do frontend servido pelo Nest e
      pipeline de deploy automatizado.

Ideias menores na fila: pressão da caneta, sliders de eixo para controle fino da junta,
salvar e compartilhar poses, temporizador de gesto com rotação automática, camadas no
painel de desenho e espelhamento de pose.

## Contribuindo

Issues e pull requests são bem-vindos. Os itens do roadmap acima são bons pontos de
partida; o acervo colaborativo de referências em particular depende de contribuição da
comunidade para ter valor.

## Licença

MIT. Veja [LICENSE](LICENSE).
