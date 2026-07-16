# Prompt Frontend Desktop — Cinema em São Paulo

Você já conhece o backend e a estrutura de dados deste projeto. Agora sua tarefa é refazer o **frontend desktop** da home seguindo fielmente o design do PNG de referência.

Não modifique backend, parsing, APIs, store, TMDB ou estrutura de dados. Foque apenas na interface.

Não implemente mobile agora. Faça somente desktop.

---

## Objetivo visual

Criar uma página desktop para o site **Cinema em São Paulo** com estética de:

- agenda impressa de cinema;
- publicação editorial;
- calendário cultural;
- bilhete/programa de cinema;
- peça gráfica própria, não template.

O site **não** deve parecer:

- dashboard;
- SaaS;
- WordPress;
- Substack;
- site institucional genérico;
- layout com cards modernos;
- UI cheia de sombras e cantos arredondados.

Use o PNG de referência como guia principal de proporção, espaçamento, hierarquia e composição.

---

## Cores

Use exatamente:

```css
--bg: #F3F2ED;
--ink: #23211D;
--accent: #B18A3A;
```

Aplicação:

- fundo geral: `#F3F2ED`;
- texto principal: `#23211D`;
- hero e seção final “É programador de cinema?”: `#23211D`;
- detalhes dourado/mostarda: `#B18A3A`;
- bordas e linhas: `#23211D` com opacidade.

Evite criar novas cores.

---

## Fontes

Use:

- títulos: `Sora`;
- textos: `Source Sans Pro`.

Referência:

- título da hero: aproximadamente `54px`;
- texto normal: aproximadamente `20px`.

Ajuste proporcionalmente, mas não deixe tudo gigante.

---

## Layout geral

A página desktop tem duas colunas:

```txt
| sidebar sticky | conteúdo principal |
```

Medidas-base:

```txt
padding lateral geral: 48px
padding vertical geral: 56px
sidebar: aproximadamente 220px
hero: aproximadamente 318px de altura
```

O conteúdo principal começa imediatamente à direita da sidebar.

---

## Assets

Use:

```txt
/public/assets/logo.svg
/public/assets/poltronas.svg
```

Os ícones também estão em:

```txt
/public/assets/
```

Não use bibliotecas novas de ícones se já houver SVGs disponíveis.

---

## Sidebar

A sidebar fica à esquerda, largura aproximada de `220px`, fundo `#F3F2ED`.

Ela deve ter conteúdo sticky, acompanhando o scroll.

Estrutura:

```txt
logo

------------------  linha pontilhada

PROGRAMAÇÃO
SOBRE

------------------  linha pontilhada

SUBSTACK ↗
INSTAGRAM ↗
E-MAIL ↗

------------------  linha pontilhada
```

Visual:

- logo no topo usando `logo.svg`;
- texto pequeno, uppercase;
- item ativo em `#B18A3A`;
- divisórias pontilhadas;
- borda direita fina;
- sem sombra;
- sem aparência de menu de dashboard.

A sidebar deve parecer uma margem/canhoto de peça impressa.

---

## Hero

A hero fica no topo do conteúdo principal.

Altura aproximada:

```txt
318px
```

Fundo:

```txt
#23211D
```

Texto claro:

```txt
#F3F2ED
```

Conteúdo:

Título:

```txt
Cinema em São Paulo
```

Subtítulo:

```txt
Acompanhe a programação de cineclubes
e cinemas pela cidade.
```

À direita, dentro da hero, fica o seletor de semana:

```txt
[ícone calendário] SEMANA DE 6 A 12 DE JULHO [chevron]
```

Esse seletor deve ser um botão retangular com borda clara/transparente. Não deve parecer input moderno.

Na parte inferior direita da hero, usar:

```txt
/public/assets/poltronas.svg
```

As poltronas devem ficar parcialmente vazando da hero para a área clara abaixo.

Importante:

- a parte clara das poltronas fica sobre a hero preta;
- a parte preta das poltronas invade a área clara `#F3F2ED`;
- esse detalhe é essencial para a identidade visual.

---

## Componente de dias

Abaixo da hero vem o seletor horizontal de dias.

Ele deve parecer uma fita de ingressos/bilhetes.

Itens:

```txt
HOJE      9 JUL
AMANHÃ    10 JUL
SÁBADO    11 JUL
DOMINGO   12 JUL
SEGUNDA   13 JUL
[ícone calendário] ESCOLHER DATA
```

Visual:

- altura aproximada: `70px`;
- itens conectados, sem gaps;
- borda fina em `#23211D`;
- divisórias verticais pontilhadas;
- dia ativo com fundo `#B18A3A`;
- itens inativos com fundo `#F3F2ED`;
- último item “Escolher data” com recorte lateral estilo bilhete;
- não usar botões arredondados separados.

Esse componente é uma das partes mais importantes do design. Ele deve remeter a ingresso de cinema, mas de forma minimalista.

---

## Filtros

Abaixo dos dias:

```txt
[Buscar filme, diretor, cinema...]   [Todos os cinemas ▼]   [Qualquer horário ▼]
```

Visual:

- fundo `#F3F2ED`;
- borda fina;
- sem sombra;
- radius mínimo ou nenhum;
- aparência editorial, não dashboard.

---

## Agenda

A agenda é a parte principal do site.

Ela deve parecer uma grade editorial impressa, não cards.

### Estrutura do dia

Cada dia tem uma coluna à esquerda:

```txt
HOJE
9
JULHO
```

ou:

```txt
AMANHÃ
10
JULHO
```

Entre a coluna da data e as sessões há uma linha vertical pontilhada.

O número do dia deve ter destaque em `#B18A3A`.

### Estrutura da sessão

Cada sessão segue esta ordem visual:

```txt
horário | conteúdo do filme | pôster | cinema
```

Na prática:

```txt
16h20

Retrospectiva Glauber Rocha
Terra em Transe (1967)
Brasil, 110'
Direção: Glauber Rocha

[pôster]

CINEMATECA BRASILEIRA
Largo Senador Raul Cardoso, 207
Mais informações ↗
```

### Horário

- em `#B18A3A`;
- destacado;
- alinhado à esquerda da sessão.

### Mostra

Se existir, fica acima do título do filme.

Exemplo:

```txt
Retrospectiva Glauber Rocha
Terra em Transe (1967)
```

Visual:

- cor `#B18A3A`;
- menor que o título;
- não deve parecer botão.

Se não existir mostra, não exibir nada.

### Filme

Título em destaque:

```txt
Terra em Transe (1967)
```

Abaixo:

```txt
Brasil, 110'
Direção: Glauber Rocha
```

Texto menor e mais discreto.

### Pôster

Se houver pôster:

- exibir na coluna de pôster;
- tamanho médio/pequeno;
- não deve dominar a sessão.

Se **não** houver pôster:

- não mostrar placeholder;
- não mostrar imagem default;
- manter a coluna vazia para a grid não quebrar.

### Cinema

Na coluna direita:

```txt
CINEMATECA BRASILEIRA
Largo Senador Raul Cardoso, 207
Mais informações ↗
```

Nome do cinema em uppercase/negrito.

Endereço menor.

Link discreto.

---

## Sessões múltiplas

Muito importante.

É comum haver várias sessões/filmes no mesmo horário, como sessões de curtas ou sessões duplas.

Quando houver várias sessões com:

- mesmo dia;
- mesmo horário;
- mesmo cinema;
- mesma mostra;

elas devem ser agrupadas em um único bloco visual.

Nesse caso:

- horário aparece uma vez;
- mostra aparece uma vez;
- cinema aparece uma vez;
- filmes aparecem empilhados;
- cada filme tem título, ano, país, duração e diretor;
- cada filme pode ter seu próprio pôster;
- se um filme não tiver pôster, deixar o espaço vazio.

Exemplo:

```txt
20h30

Fotografia Agnès Varda Cinema

Os três botões (2015)
França, 11'
Direção: Agnès Varda

[pôster]

Ulisses (1983)
França, 22'
Direção: Agnès Varda

[pôster]

Viva Varda! (2023)
França, 67'
Direção: Pierre-Henri Gibert

[pôster]

INSTITUTO MOREIRA SALLES
Avenida Paulista, 2424 - Bela Vista
Mais informações ↗
```

Dentro da sessão múltipla, use separadores pontilhados mais curtos entre filmes.

Entre sessões diferentes, use linha pontilhada horizontal longa.

---

## Seção Sobre

Depois da agenda vem a seção `SOBRE`.

Ela não deve parecer um card. Deve parecer continuação da página impressa.

Estrutura:

À esquerda:

```txt
SOBRE

Não perca
mais nenhuma
sessão.

[ASSINAR NEWSLETTER ↗]
```

À direita, texto corrido:

```txt
Divulgamos a programação das salas de repertório e dos cineclubes da cidade de São Paulo.

Organizamos e enviamos por email os horários e principais informações das sessões programadas por salas de cinema como as do Cinesesc, do IMS, do CINUSP, do CCSP e outras.

Focamos sempre nos filmes que já não estão mais na sua janela de exibição, mas são programados em sessões especiais.

Nosso trabalho é feito manualmente a oito mãos.
Toda ajuda é bem vinda. :)
```

O botão `ASSINAR NEWSLETTER ↗` é apenas um link estilizado para o Substack.

Não usar embed.

Não usar input de e-mail.

---

## Seção final: É programador de cinema?

Abaixo do Sobre, criar uma faixa escura com fundo `#23211D`.

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

No canto inferior direito dessa faixa, usar novamente:

```txt
/public/assets/poltronas.svg
```

As poltronas devem vazar da faixa preta para o rodapé claro, repetindo o gesto da hero.

---

## Rodapé

Abaixo da faixa preta, rodapé pequeno com fundo `#F3F2ED`.

À esquerda:

```txt
© 2026 Cinema em São Paulo. Todos os direitos reservados.
```

À direita:

```txt
Desenvolvido pela Moddulo.
```

Discreto, pequeno, sem aparência de footer institucional pesado.

---

## Cuidados importantes

1. Não criar cards brancos grandes.
2. Não usar sombras pesadas.
3. Não usar radius exagerado.
4. Não transformar a agenda em dashboard.
5. Não deixar tudo gigante.
6. Não usar placeholder de pôster.
7. Não quebrar a grid quando não houver pôster.
8. Não repetir cinema em sessão múltipla.
9. Não repetir horário em sessão múltipla.
10. Não inventar novas seções.
11. Não implementar mobile agora.
12. Priorizar fidelidade ao PNG.

---

## Resultado esperado

Uma página desktop fiel ao PNG de referência, com:

- sidebar sticky à esquerda;
- hero preta;
- seletor de semana;
- poltronas vazando;
- componente de dias estilo bilhete;
- filtros discretos;
- agenda editorial com linhas pontilhadas;
- sessões simples e múltiplas;
- Sobre integrado;
- faixa final para programadores;
- rodapé discreto.

O mais importante é respeitar proporção, espaçamento e hierarquia visual do PNG.
