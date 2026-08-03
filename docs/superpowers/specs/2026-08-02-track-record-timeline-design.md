# Reserva Vereda — Seção Track Record (Timeline Horizontal)

Fonte do pedido: `C:\Users\Doc\Desktop\ReservaVereda\TRACK RECORD (1).pdf` (infográfico único, 2196.85×629.76pt, ~3.5:1, exportado do Illustrator pela Elleven/CS Empreendimentos).

## Contexto

O PDF é um infográfico timeline pronto, com todos os empreendimentos da Elleven Engenharia de 2010 a 2027 (incluindo o próprio Reserva Vereda), alternando cards acima/abaixo de uma linha do tempo central com dots. O visual do PDF usa a identidade da Elleven (fontes/paleta próprias), diferente da identidade dourado/verde-floresta serifada do site.

Decisão (confirmada com o usuário): a seção é **refeita em HTML/CSS no estilo visual do site**, não inserida como imagem — e usa **scroll pinado** (scroll-jacking) no desktop.

## 1. Estrutura e posição

Nova `<section id="trajetoria">` inserida entre `#form` e `<footer id="site-footer">` em `site/index.html`. Fundo sólido `bg-forest-950` (alterna com o `bg-forest-900` do form). Sem wave-divider nas bordas — segue o mesmo padrão flat-to-flat de galeria→form (waves só existem onde a seção vizinha tem imagem de fundo, como conectividade).

Cabeçalho da seção segue o padrão já estabelecido (`js-divider` dourado, eyebrow, `h2` serifado, subtítulo):
- Eyebrow: "Track Record"
- H2: "Uma trajetória de resultados." (copy exata a confirmar/ajustar na implementação — placeholder aceitável, mesma categoria de pendência que o hero)
- Subtítulo: uma linha sobre a solidez da Elleven Engenharia como incorporadora.

## 2. Dados

Todos os empreendimentos listados no PDF, na ordem cronológica em que aparecem (alternando acima/abaixo da linha central), extraídos com precisão do arquivo fonte (não aproximados de memória — segue o padrão já usado neste projeto de renderizar a página em alta resolução via `pdftoppm` e ler/recortar exatamente o que está lá).

Campos por card:
- Nome do empreendimento (logo/wordmark quando existir no PDF, senão nome em texto serifado)
- Foto (1 ou 2 imagens, conforme o card no PDF)
- Selo de status: **Entregue** / **Lançamento** / **Em obras** (cor distinta por status — ex. `gold-400` para lançamento, um verde/offwhite mais neutro para entregue, um tom intermediário para em obras)
- Mês/ano do marcador na linha (o PDF usa mês em fonte cursiva + ano em destaque — replicar essa hierarquia: ano grande, mês em itálico/script menor)
- Localização (cidade/UF)
- Unidades (ou "Casas" no caso do Reserva Vereda — usar o rótulo exato do PDF por card, não assumir "Unidades" para todos)
- Torres (quando aplicável — nem todo card tem)
- VGV (R$)

O card do **Reserva Vereda Granja Viana** recebe destaque visual (borda/glow dourado mais forte que os demais) por ser o empreendimento da página atual.

Extração de assets: novo script único `tools/extract-track-record.js` (sharp), renderizando o PDF em alta resolução (300dpi+) e recortando cada foto/logo individualmente para `site/assets/images/track/`. Segue o padrão do projeto de um script dedicado por necessidade de imagem nova, sem reaproveitar/sobrecarregar scripts antigos.

Dados textuais (nome, datas, localização, números, status) ficam num array JS de configuração (novo arquivo `site/js/track-record-data.js` ou bloco no topo de um novo `site/js/track-record.js`) — os cards são renderizados por template a partir desse array em vez de HTML repetido manualmente ~17x, para facilitar correções futuras de números/datas.

## 3. Visual

- Linha central horizontal dourada (`gold-400`), com dots marcando cada card, replicando a estrutura de alternância acima/abaixo do PDF.
- Cards: `font-serif` para o nome, `gold-400` para números/selo de status, `organic-frame`/`organic-frame-b`/`organic-frame-c` (alternando, mesmo padrão já usado na galeria) para as fotos.
- Ícones de localização/unidades/torres/VGV no mesmo estilo linear já usado na lista de distâncias da seção Conectividade (não ícones novos/genéricos).
- Largura total da faixa de cards é maior que a viewport — é o que justifica o scroll horizontal.

## 4. Interação — scroll pinado

**Desktop (`lg:` / ≥1024px):**
GSAP ScrollTrigger com `pin: true` no container da seção. Scroll vertical do usuário é convertido em `translateX` da faixa de cards (scrub, não animação por tempo) até a faixa terminar, aí o pin libera e a página volta a rolar verticalmente. Altura de scroll "consumida" pelo pin é proporcional à largura total da faixa de cards (`(larguraFaixa - larguraViewport)`).

**Mobile/tablet (abaixo de `lg`):**
Sem pin — a faixa vira scroll horizontal nativo (`overflow-x-auto`, `scroll-snap-type: x mandatory`, cada card com `scroll-snap-align`), navegável por arraste/swipe. Scroll-jacking horizontal em touch é evitado deliberadamente (comportamento ruim/confuso em touchscreens).

**Acessibilidade:** com `prefers-reduced-motion: reduce`, o pin é desativado mesmo no desktop — cai no mesmo comportamento de scroll horizontal nativo do mobile.

Implementação em `initTrackRecordScroll()` (novo, em `site/js/main.js` ou `site/js/track-record.js`), seguindo o mesmo padrão de organização de outras features de scroll do site (`initTrail()`, `initHeroSealDock()`, `initAnchorScroll()`).

## Fora de escopo nesta rodada

- Adicionar `#trajetoria` à nav âncora do header (Início/Promessa/Localização/Conectividade/Contato) — não pedido; pode ser feito depois se o usuário quiser.
- Copy final do H2/subtítulo da seção — placeholder na mesma categoria de pendência do hero (aguardando o cliente, se quiser revisar).
- QR code / tracking pixel — já são pendências gerais do projeto, não específicas desta seção.

## Testes / Verificação

- Servidor estático local (`npx --yes serve site -p <porta>`) + Playwright (consentimento já concedido neste projeto para verificação read-only) para:
  - Conferir o comportamento de pin/scrub no desktop (scroll incremental, não fullPage screenshot — GSAP ScrollTrigger não dispara sem eventos de scroll reais).
  - Conferir o fallback de scroll horizontal nativo em viewport mobile (emulação de viewport + swipe simulado).
  - Conferir que os dados extraídos (datas, números, VGV) batem com o PDF fonte, célula a célula.
- Sem submissão real ao Formspree/mudança na seção de formulário — esta seção não interage com o form.
