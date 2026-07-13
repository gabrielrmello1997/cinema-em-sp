# Prompt de refinamento visual — Cinema em São Paulo

A implementação atual ficou próxima do design, mas ainda há diferenças importantes de proporção, espaçamento, alinhamento e detalhes.  
Agora a tarefa NÃO é recriar o site do zero. A tarefa é **ajustar o frontend existente para ficar fiel ao design do Figma**.

Você não precisa mexer no backend. Você já conhece o backend e a estrutura de dados.  
Não modifique parser, APIs, store, TMDB ou fluxo de dados.

Não implemente mobile agora. Foque apenas no desktop.

O arquivo SVG do Figma foi analisado e estas são as medidas e relações visuais que devem guiar o ajuste.

---

## 1. Frame geral

O frame do Figma tem:

```txt
largura: 1440px
altura: 3085px
background geral: #F3F2ED
```

A página é dividida em:

```txt
sidebar: 208px de largura
conteúdo principal: começa em x = 208px
conteúdo principal: 1232px de largura
```

A sidebar ocupa toda a altura da página.

O conteúdo principal começa imediatamente depois da sidebar, sem gap.

---

## 2. Cores

Use exatamente:

```css
--bg: #F3F2ED;
--ink: #23211D;
--accent: #B18A3A;
--line: #66625D;
```

Aplicação:

- fundo geral: `#F3F2ED`
- hero e faixa final: `#23211D`
- texto principal: `#23211D`
- texto claro na hero/faixa final: `#F3F2ED`
- detalhes dourados: `#B18A3A`
- bordas de inputs/tickets: `#66625D`
- linhas pontilhadas: `#23211D`

Não inventar novas cores.

---

## 3. Fontes

Use:

```txt
títulos: Sora
textos: Source Sans Pro
```

O visual atual não pode ficar gigante. A referência do Figma é grande, mas controlada.

Referência:

```txt
título hero: ~54px
subtitle hero: ~20px
texto geral: ~16–20px dependendo do contexto
labels e links pequenos: ~12–14px
```

---

## 4. Sidebar

A sidebar tem largura exata de aproximadamente:

```txt
208px
```

Ela deve ficar à esquerda com fundo `#F3F2ED`.

Existe uma borda vertical entre sidebar e conteúdo:

```txt
x = 207.5px
altura: página inteira
stroke: #23211D
1px
```

### Posição das divisórias da sidebar

As linhas pontilhadas horizontais têm:

```txt
x inicial: 34.5px
x final: 173.5px
stroke: #23211D
dash: 4 4
```

Y das linhas:

```txt
159.5px
311.5px
517.5px
```

### Conteúdo da sidebar

Estrutura:

```txt
logo

linha pontilhada

PROGRAMAÇÃO
SOBRE

linha pontilhada

SUBSTACK ↗
INSTAGRAM ↗
E-MAIL ↗

linha pontilhada
```

Use os assets:

```txt
/public/assets/logo.svg
/public/assets/substack.svg
/public/assets/contato-instagram.svg
/public/assets/email.svg
```

O logo fica no topo, alinhado dentro da sidebar, com bastante respiro.  
Não aumentar demais o logo.

Os links devem parecer parte de uma peça impressa, não menu de dashboard.

---

## 5. Hero

A hero fica no conteúdo principal.

Medidas:

```txt
x: 208px
y: 0
width: 1232px
height: 317px
background: #23211D
```

O conteúdo interno da hero começa em:

```txt
x: 256px
```

Ou seja: `48px` de padding interno a partir do início do conteúdo principal.

### Título da hero

Texto:

```txt
Cinema em São Paulo
```

Posição visual aproximada:

```txt
x: 256px
y: 55–65px
```

Tamanho:

```txt
~54px
```

Cor:

```txt
#F3F2ED
```

### Subtítulo da hero

Texto:

```txt
Acompanhe a programação de cineclubes
e cinemas pela cidade.
```

Fica abaixo do título, alinhado ao mesmo x.

Não deixar o subtítulo gigante. Ele deve ser secundário.

### Seletor de semana

O seletor de semana fica à direita dentro da hero.

Medidas do retângulo no Figma:

```txt
x: 972.5px
y: 104.5px
width: 403px
height: 55px
stroke: #66625D
```

Texto:

```txt
SEMANA DE 6 A 12 DE JULHO
```

Ícone de calendário à esquerda e chevron à direita.

Use:

```txt
/public/assets/calendar.svg
```

Esse seletor deve parecer um botão/etiqueta editorial, não um input moderno.

---

## 6. Poltronas da hero

Use:

```txt
/public/assets/poltronas.svg
```

No Figma, as poltronas da hero são quatro unidades.

Medidas e posição aproximadas de cada poltrona:

```txt
primeira poltrona:
x: 956px
y: 279px
width: 94px
height total visível: ~64px

segunda:
x: 1070px

terceira:
x: 1184px

quarta:
x: 1298px
```

Cada poltrona tem:

```txt
parte clara:
x: mesmo da poltrona
y: 279px
width: 94px
height: 51px
rx: 8px
fill: #F3F2ED

parte preta:
y: 317px
width: 94px
height: 26px
fill: #23211D
```

A hero termina em:

```txt
y: 317px
```

Portanto:

- a parte clara da poltrona aparece dentro da hero preta;
- a parte preta começa exatamente na transição da hero para o fundo claro;
- a base preta invade a área clara abaixo.

Esse detalhe precisa ficar fiel. Não deixar as poltronas flutuando nem totalmente dentro da hero.

---

## 7. Seletor de dias / ticket

Abaixo da hero fica o componente de dias, estilo fita de ingressos.

No Figma, ele começa em:

```txt
x: 256px
y: 380px
```

Altura:

```txt
94px
```

Largura total aproximada:

```txt
de x = 256px até x = 1392px
```

Ou seja:

```txt
width: ~1136px
```

O primeiro item ativo tem:

```txt
x: 256px
y: 380px
width: 182px
height: 94px
fill: #B18A3A
```

Os outros dias seguem conectados, sem gaps.

Estrutura visual:

```txt
[ HOJE / 9 JUL ] [ AMANHÃ / 10 JUL ] [ SÁBADO / 11 JUL ] [ DOMINGO / 12 JUL ] [ SEGUNDA / 13 JUL ] [ ÍCONE / ESCOLHER DATA ]
```

Importante:

- é uma única faixa de ticket, não vários botões separados;
- divisórias verticais são pontilhadas;
- borda fina em `#66625D`;
- último item tem recorte lateral de bilhete;
- não usar border-radius moderno;
- não usar sombra.

Use o asset:

```txt
/public/assets/borda-ticket.svg
```

Se for mais fácil, construa a estrutura com CSS, mas o resultado deve ser visualmente igual ao Figma.

---

## 8. Filtros

Abaixo do ticket, existem três controles.

### Busca

Medidas:

```txt
x: 256.5px
y: 510.5px
width: 377px
height: 49px
stroke: #66625D
```

Placeholder:

```txt
Buscar filme, diretor, cinema...
```

### Filtro de cinema

Medidas:

```txt
x: 862.5px
y: 510.5px
width: 253px
height: 49px
stroke: #66625D
```

Texto:

```txt
Todos os cinemas
```

### Filtro de horário

Medidas:

```txt
x: 1138.5px
y: 510.5px
width: 253px
height: 49px
stroke: #66625D
```

Texto:

```txt
Qualquer horário
```

Não deixar esses inputs altos demais, arredondados demais ou com cara de formulário SaaS.

---

## 9. Agenda

A agenda começa logo abaixo dos filtros.

Ela deve parecer uma grade editorial impressa.

Não usar cards.

Não usar sombra.

Não usar caixas brancas.

### Coluna da data

A coluna da data começa em:

```txt
x: 256px
```

A linha vertical pontilhada que separa a data das sessões fica em:

```txt
x: 346.5px
```

Ela começa aproximadamente em:

```txt
y: 602.5px
```

E segue até:

```txt
y: 1992.5px
```

No primeiro bloco do dia, a data fica assim:

```txt
HOJE
9
JULHO
```

O número `9` deve ser grande e dourado `#B18A3A`.

Para o segundo dia:

```txt
AMANHÃ
10
JULHO
```

A data do segundo dia começa visualmente em torno de:

```txt
y: 1552px
```

### Linhas separadoras da agenda

Linhas horizontais pontilhadas principais:

```txt
x inicial: 375.5px
x final: 1391.5px
stroke: #23211D
dash: 4 4
```

Y principais:

```txt
809.5px
1045.5px
1759.5px
```

Linha de separação entre dias:

```txt
x inicial: 256.5px
x final: 1391.5px
y: 1523.5px
```

Linha antes do Sobre:

```txt
x inicial: 209.5px
x final: 1391.5px
y: 1992.5px
```

Sessão múltipla: há uma linha pontilhada curta entre filmes:

```txt
x inicial: 461.5px
x final: 755.5px
y: 1286.5px
```

Ou seja: dentro de sessão múltipla, o separador é menor e não atravessa a tela inteira.

---

## 10. Colunas da sessão

A sessão segue esta lógica:

```txt
[data] | [horário] [texto do filme] [poster] [cinema]
```

### Horário

O horário fica logo à direita da linha vertical da data.

Cor:

```txt
#B18A3A
```

Exemplos:

```txt
16h20
19h30
20h30
```

### Bloco de texto do filme

A mostra aparece acima do título.

Exemplo:

```txt
Retrospectiva Glauber Rocha
Terra em Transe (1967)
Brasil, 110'
Direção: Glauber Rocha
```

A mostra é dourada, menor que o título.

O título é preto, com peso forte.

Os metadados são menores.

### Pôster

No Figma, os pôsteres têm aproximadamente:

```txt
x: 752px
width: 120px
height: 180px
```

O primeiro pôster:

```txt
x: 752px
y: 602px
width: 120px
height: 180px
```

O segundo:

```txt
x: 753px
y: 838px
width: 120px
height: 180px
```

O terceiro:

```txt
x: 753px
y: 1077px
width: 120px
height: 180px
```

Demais pôsteres seguem essa escala.

Se não houver pôster:

- não exibir placeholder;
- manter a coluna vazia;
- não deixar o cinema ou o texto pularem de lugar.

### Cinema

O cinema fica na coluna direita.

Exemplo:

```txt
CINEMATECA BRASILEIRA
Largo Senador Raul Cardoso, 207 Vila Clementino
Mais informações ↗
```

Nome do cinema em uppercase/negrito.

Endereço menor.

Link discreto e sublinhado.

---

## 11. Sessões múltiplas

O layout deve agrupar sessões com mesmo:

- dia;
- horário;
- cinema;
- mostra.

Nesse caso:

- horário aparece uma vez;
- mostra aparece uma vez;
- cinema aparece uma vez;
- os filmes ficam empilhados;
- cada filme pode ter seu próprio pôster;
- se um filme não tiver pôster, o espaço fica vazio.

Exemplo visual:

```txt
20h30   Fotografia Agnès Varda Cinema
        Os três botões (2015)
        França, 11'
        Direção: Agnès Varda

        [poster]

        -------------------------------- linha curta

        Ulisses (1983)
        França, 22'
        Direção: Agnès Varda

        [poster]
```

Não repetir o cinema em cada filme da sessão múltipla.

Não repetir o horário.

---

## 12. Sobre

A seção Sobre começa depois da linha pontilhada em:

```txt
y: 1992.5px
```

Ela fica no fundo claro `#F3F2ED`.

À esquerda:

```txt
SOBRE

Não perca
mais nenhuma
sessão.

[ASSINAR NEWSLETTER ↗]
```

O botão da newsletter tem no Figma:

```txt
x: 256px
y: 2373px
width: 280px
height: 57px
```

Visual:

- fundo claro;
- borda dourada;
- texto dourado;
- seta à direita;
- sem preenchimento dourado.

A coluna de texto da direita é separada por uma linha vertical pontilhada em:

```txt
x: 752.5px
y inicial: 2115.5px
y final: 2582.5px
stroke: #23211D
dash: 4 4
```

Texto à direita:

```txt
Divulgamos a programação das salas de repertório e dos cineclubes da cidade de São Paulo.

Organizamos e enviamos por email os horários e principais informações das sessões programadas por salas de cinema como as do Cinesesc, do IMS, do CINUSP, do CCSP e outras.

Focamos sempre nos filmes que já não estão mais na sua janela de exibição, mas são programados em sessões especiais.

Nosso trabalho é feito manualmente a oito mãos.
Toda ajuda é bem vinda. :)
```

---

## 13. Faixa final — É programador de cinema?

A faixa final escura começa em:

```txt
x: 208px
y: 2677px
width: 1232px
height: 326px
background: #23211D
```

À esquerda:

```txt
É programador
de cinema?
```

À direita:

```txt
A ajuda dos programadores é central para mantermos o nosso trabalho.

Se você é programador, curador ou membro de um cineclube, por favor, entre em contato conosco e compartilhe a sua programação via email:

cinemaemsaopaulo@gmail.com
```

A linha vertical pontilhada interna fica em:

```txt
x: 609.5px
y inicial: 2749.5px
y final: 2941.5px
stroke: #F3F2ED
dash: 4 4
```

### Poltronas finais

Repetir o mesmo gesto da hero.

Posições no Figma:

```txt
primeira poltrona:
x: 956px
y: 2965px
width: 94px

segunda:
x: 1070px

terceira:
x: 1184px

quarta:
x: 1298px
```

Parte clara:

```txt
y: 2965px
height: 51px
fill: #F3F2ED
rx: 8px
```

Parte preta:

```txt
y: 3003px
height: 26px
fill: #23211D
```

A faixa preta termina em:

```txt
y: 3003px
```

Então a base preta das poltronas invade o rodapé claro.

---

## 14. Rodapé

O rodapé fica abaixo da faixa final.

Começa em:

```txt
y: 3003px
```

Vai até o final do frame:

```txt
height final total: 3085px
```

Texto pequeno.

À esquerda:

```txt
© 2026 Cinema em São Paulo. Todos os direitos reservados.
```

À direita:

```txt
Desenvolvido pela Moddulo.
```

Não fazer um footer grande. É apenas uma linha discreta de crédito.

---

## 15. O que corrigir na implementação atual

A implementação atual está próxima, então faça apenas refinamentos.

Corrigir especialmente:

1. proporção geral;
2. sidebar com largura e espaçamentos do Figma;
3. hero com altura correta;
4. seletor de semana no x/y correto;
5. poltronas com escala e vazamento corretos;
6. ticket de dias com altura, largura e recorte corretos;
7. filtros com as dimensões do Figma;
8. agenda sem cards;
9. sessões com colunas iguais ao Figma;
10. pôsteres com 120x180;
11. linhas pontilhadas nas posições corretas;
12. Sobre com colunas e botão na posição correta;
13. faixa final com altura e poltronas corretas;
14. rodapé discreto.

---

## 16. Não fazer

Não recriar o layout.

Não mudar o design.

Não inventar componentes.

Não implementar mobile.

Não mexer no backend.

Não usar placeholders de pôster.

Não usar cards brancos.

Não usar sombras pesadas.

Não usar cantos arredondados grandes.

Não transformar a agenda em dashboard.

---

## Resultado esperado

Uma captura do navegador deve ficar muito próxima do Figma:

- frame 1440px;
- sidebar 208px;
- hero 317px;
- conteúdo começando em x=256px;
- ticket de dias em y=380px;
- filtros em y=510px;
- agenda começando em torno de y=600px;
- Sobre começando depois de y=1992px;
- faixa final em y=2677px;
- rodapé em y=3003px.

Use essas medidas como referência direta para ajustar CSS e componentes.
