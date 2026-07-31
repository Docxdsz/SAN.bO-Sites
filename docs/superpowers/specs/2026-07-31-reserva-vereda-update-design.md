# Reserva Vereda — Atualização de Identidade Visual, Header e Localização

Fonte do pedido: `C:\Users\Doc\Desktop\ReservaVereda\Planejamento de Atualização_ Reserva Vereda.md`

## Contexto

O site atual (`site/index.html` + `css/style.css` + `js/`) é uma landing page estática de pré-lançamento, com seções: hero, promessa, localizacao, diferenciais, galeria, amenidades, form, footer. O plano de atualização do cliente cobre 4 frentes (visual, navegação, copy, técnico). Três itens dependem de insumos externos ainda não disponíveis (texto final do hero — aguardando a Mari; tracking — aguardando código da Elleven; e-mail `contato@reservavereda.com.br` — aguardando ativação do Gui) e ficam fora desta rodada. A reescrita de copy de Galeria/Amenidades no "tom de redes sociais" também fica fora — o usuário vai ajustar esse texto por último, numa rodada futura.

Este spec cobre tudo que **não** depende desses bloqueios: identidade visual, header com dual-CTA, matriz de distâncias/localização, e remoção/integração da seção Diferenciais.

## 1. Identidade Visual

**Fontes — hospedagem local via `@font-face`:**
- Copiar `Fonts/FahKwang.ttc` e `Fonts/Montserrat-VariableFont_wght.ttf` para `site/assets/fonts/`.
- Declarar `@font-face` em `css/style.css`; `FahKwang` mapeada para `font-serif` (usada em todos os títulos h1–h3 que hoje usam Playfair Display), `Montserrat` (variável) mapeada para `font-sans` (corpo), em `js/tailwind-config.js`.
- Remover o `<link>` do Google Fonts (Playfair Display + Montserrat CDN) do `<head>` de `index.html` e `privacy.html`.
- `Fonts/MyriadPro-Regular.otf` não é usada nesta rodada — fica documentada como pendência caso o cliente peça no futuro.

**Logo:**
- Substituir `site/assets/logo.svg` pelo conteúdo de `C:\Users\Doc\Desktop\ReservaVereda\V1.svg` (wordmark horizontal, cor `#DEBA8F`), usado no header e no hero. Mesma paleta do site — apenas troca do desenho.

**Selo Elleven (sticky):**
- Novo elemento `position: fixed`, canto inferior esquerdo (simétrico ao botão de WhatsApp que já ocupa o canto inferior direito), usando `LOGO_ELLEVEN ENGENHARIA_PRINCIPAL.png` (copiado para `site/assets/images/`).
- Tamanho pequeno (~32–40px de altura), com leve fundo semitransparente/blur para manter legibilidade sobre qualquer seção. Segue o mesmo padrão de transição/fade-in do botão de WhatsApp existente.

**Formas orgânicas:**
- Aumentar o `border-radius` das imagens/cards que hoje usam `rounded-lg` (seções Promessa, Galeria) para um raio mais generoso.
- Os 4 blocos retos da seção Diferenciais deixam de existir (seção removida — ver item 3). Não há outro elemento retangular relevante a redesenhar nesta rodada além do ajuste de raio acima.
- Manter a estrutura de seções e os divisores em onda (SVG) já existentes — sem redesenho de grid/composição assimétrica.

**Contraste da seção Amenidades:**
- Ajustar o gradiente de fundo atual (`from-[#B98F5D] to-[#DEBA8F]`) escurecendo os tons e/ou reforçando o overlay escuro atrás do texto/ícones, para melhorar legibilidade e sofisticação sem perder a identidade dourada da seção.

## 2. Header e Navegação — Dual CTA

- O único CTA atual ("Peça informações", presente no header e no hero) vira dois botões:
  - **"Sou cliente e quero garantir meu espaço no Reserva Vereda"** → `#form`, com `data-profile="Cliente"`.
  - **"Sou incorporador/imobiliária e quero vender este projeto extraordinário"** → `#form`, com `data-profile="Parceiro"`.
- No mobile os dois botões empilham; no desktop ficam lado a lado (header) ou empilhados centralizados (hero, se não couber lado a lado).
- Estilo dos botões segue o padrão visual atual (borda dourada, hover preenchido) — sem dropdown ou mega-menu.
- `lead-form` ganha um campo `<select id="field-perfil" name="perfil">` com as opções "Cliente" e "Parceiro/Imobiliária". `js/main.js` ganha um listener nos 4 CTAs (header × 2, hero × 2) que lê o `data-profile` do botão clicado e pré-seleciona esse campo antes do scroll até `#form`.
- O valor de `perfil` vai junto no POST ao Formspree — aparece na notificação por e-mail como parte dos dados do lead, sem mudança de backend.

## 3. Localização e Conteúdo

**Matriz de distâncias**, nova dentro de `#localizacao`, como lista de linhas com divisórias douradas finas (não uma `<table>` HTML crua), consistente com o fundo escuro/texto offwhite-gold da seção:

| Destino | Distância | Tempo estimado |
| :--- | :--- | :--- |
| Cotia | 8 km | 7 min |
| Aldeia da Serra | 15 km | 20 min |
| Alphaville | 19 km | 25 min |
| São Paulo | 25 km | 37 min |

**Imagem principal da seção:** substituir `assets/images/location-bg.jpg` por uma versão tratada de `C:\Users\Doc\Desktop\ReservaVereda\Asset 1@2x-100.jpg`, mantendo o overlay escuro atual (`bg-forest-950/75`) para legibilidade do texto sobre a imagem.

**Imagens do Panfleto:** extrair 1–2 imagens adicionais de mapa/entorno de `C:\Users\Doc\Desktop\ReservaVereda\Reserva Vereda - Panfleto 2 dobras 64,5x26cm.pdf` (renderizar páginas via poppler `pdftoppm`, mesmo processo já usado com o brand book) para complementar a seção, se o panfleto tiver conteúdo de mapa aproveitável. Páginas específicas a confirmar durante a implementação.

**Remoção da seção "Diferenciais":**
- A seção inteira (4 blocos: Natureza preservada, Localização privilegiada, Segurança 24h, Lazer completo) é removida de `index.html`.
- O conteúdo existente é realocado (reaproveitando as frases atuais, sem reescrita no "tom redes sociais"):
  - *Natureza preservada* → parágrafo da seção **Promessa**.
  - *Localização privilegiada* + *Segurança 24h* → parágrafo da seção **Localização**, junto da nova matriz de distâncias.
  - *Lazer completo* → subtítulo de abertura da seção **Galeria**.

## Fora de escopo nesta rodada

- Texto final do Hero (aguardando a Mari) — mantém o texto atual como placeholder.
- Tracking da Elleven — nenhum stub criado; anotar no código onde vai entrar quando o snippet chegar.
- Ativação de `contato@reservavereda.com.br` (aguardando o Gui) — placeholders de `js/config.js` continuam como estão.
- Reescrita de copy de Galeria/Amenidades no "tom de redes sociais" — deixado para uma rodada futura a pedido do usuário.

## Testes / Verificação

- Revisão visual estática (sharp/composites), já que automação de browser está pausada neste projeto até o incidente do Chrome ser resolvido (ver memória do projeto).
- Conferir que o formulário ainda envia corretamente com o novo campo `perfil` (teste manual do fluxo JS, sem submissão real ao Formspree já que o endpoint ainda é placeholder).
- Conferir contraste de texto na seção Amenidades após o ajuste de gradiente (critério: legibilidade AA aproximada a olho, dado que não há ferramenta de contraste automatizada no projeto).
