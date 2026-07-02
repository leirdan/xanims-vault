#set document(title: "Xanim's Vault - Relatório Final", author: "Andriel Vinicius de Medeiros Fernandes, Lucas Vinicius Dantas de Medeiros, María Paz Marcato")
#set page(paper: "a4", margin: (x: 2.5cm, y: 2.5cm), numbering: "1", number-align: center)
#set text(font: "New Computer Modern", size: 11pt, lang: "pt")
#set par(justify: true, leading: 0.65em, first-line-indent: (amount: 1.25cm, all: true))
#set heading(numbering: "1.1")

#show heading.where(level: 1): it => {
  v(0.6cm)
  text(size: 16pt, weight: "bold")[#it]
  v(0.3cm)
}
#show heading.where(level: 2): it => {
  v(0.4cm)
  text(size: 13pt, weight: "bold")[#it]
  v(0.2cm)
}

// ==========================================================
// CAPA
// ==========================================================
#align(center)[
  #v(1.5cm)
  #text(size: 12pt)[UNIVERSIDADE FEDERAL DO RIO GRANDE DO NORTE]
  #v(0.1cm)
  #text(size: 12pt)[DEPARTAMENTO DE INFORMÁTICA E MATEMÁTICA APLICADA]
  #v(2cm)

  #text(size: 26pt, weight: "bold")[XANIM'S VAULT]
  #v(0.3cm)
  #text(size: 14pt, style: "italic")[Sistema automatizado de alimentação para felinos]

  #v(4cm)
  #text(size: 12pt)[
    Relatório final apresentado à disciplina de \
    DIM0616 - Sistemas Embarcados, \
    Docente Mônica Magalhães Pereira.
  ]

  #v(3cm)
  #text(size: 12pt)[
    Andriel Vinicius de Medeiros Fernandes \
    Lucas Vinicius Dantas de Medeiros \
    María Paz Marcato
  ]

  #v(1fr)
  #text(size: 12pt)[Natal/RN #h(1cm) 2026]
]

#pagebreak()

#outline(title: "Sumário", indent: auto)

#pagebreak()

#include "sections/01_introducao.typ"
#include "sections/02_descricao.typ"
#include "sections/03_estado_da_arte.typ"
#include "sections/04_requisitos.typ"
#include "sections/05_modelagem.typ"
#include "sections/06_implementacao.typ"
#include "sections/07_conclusao.typ"

#pagebreak()
#include "sections/08_referencias.typ"
