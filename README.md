# GirliES | Garotas na Engenharia de Software

Landing page estática (HTML, CSS e JS), sem etapa de build. Mobile first.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo `girlies`) e envie o conteúdo desta pasta:
   ```bash
   git init
   git add .
   git commit -m "feat: landing page do GirliES"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/girlies.git
   git push -u origin main
   ```
2. No repositório: **Settings > Pages > Build and deployment**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/girlies/`.
4. Gere o QR code com **essa URL** e teste em um celular antes da apresentação.
5. Opcional: depois de publicar, troque `assets/og.jpg` e `og:image` no `index.html` por uma URL absoluta (`https://SEU-USUARIO.github.io/girlies/assets/og.jpg`) para a pré-visualização aparecer em redes sociais.

Para testar localmente: `python -m http.server 8765` dentro desta pasta e abra `http://localhost:8765`.

## Para a equipe validar antes de publicar

- Textos do hero e do fechamento (inclusive a frase de convite a outras universidades).
- Números do pitch: a página usa **23%** de mulheres (o pitch mostra 23,3% e o formulário 23,1%).
- Horário do curso (a página usa o plano de aulas: quartas, 19h às 22h). As datas das aulas não aparecem.
- Seção dos mascotes: o texto da saia (engrenagem) e da camiseta (símbolo de código) foi escrito a partir do desenho. Confirmar se é isso mesmo que a Ada representa.
- Fontes dos dados da seção "A realidade da TI": levantamento interno do campus (2026.1) e plataforma Nexus, conforme o formulário do edital. Um slide projetado no encontro de acolhimento cita média de 27% de mulheres; a página usa 23%. Conferir qual número vale.
- Grafia dos nomes na seção Equipe (Alexia/Aléxia, Lívia/Livia).
- Fontes: foram usadas fontes livres parecidas com as do pitch (Bodoni Moda, Pixelify Sans, Poppins, Pinyon Script). Se a equipe tiver os arquivos originais, substitua em `assets/fonts/` e ajuste os `@font-face` em `css/styles.css`.
- Seguidores do Instagram não aparecem na página de propósito, para não ficarem desatualizados.

## Como editar

- **Aulas**: cartões `<article class="aula">` em `index.html` (sem datas por enquanto).
- **Cores e tipografia**: variáveis no topo de `css/styles.css`.
- **Fotos**: `assets/img/` (WebP em duas larguras, `-sm` e `-lg`).
- **Movimento**: `js/main.js` (GSAP + ScrollTrigger). Quem ativa "reduzir movimento" no sistema vê a página estática.
