# 🏥 Emergência Pediátrica | ABRAMEDE-MG

Aplicação web moderna, responsiva e de alta precisão para emergências pediátricas, desenvolvida e atualizada rigorosamente conforme a **Folha de Atendimento de Emergência em Pediatria e Parada Cardiorrespiratória (ABRAMEDE-MG / Hospital Infantil João Paulo II)**.

---

## 📋 Características e Funcionalidades

1. **Interface Limpa e Objetiva**:
   - Cabeçalho minimalista com título **Emergência Pediátrica**.
   - Barra compacta com apenas **Nome**, **Peso (kg)** e **Idade (anos e meses)**.
   - Barra de **Pesquisa em Tempo Real** para filtrar rapidamente qualquer medicamento pelo nome, apresentação ou dose.

2. **Ceftriaxona 1g (Primeira Linha da Tabela)**:
   - Duas sub-linhas: **50 mg/Kg** (infecções graves/sepse) e **100 mg/Kg** (meningite/neuroinfecção).
   - Considera o deslocamento de **0,7 ml do pó** por frasco (cada frasco de 1g com 9,3 ml de ABD resulta em 10 ml a 100 mg/ml).
   - Prescrição pronta: *"Reconstituir [X] frasco(s) de 1g em [Y] ml de ABD e injetar lentamente [Z] ml EV"*.

3. **Versão Desktop & Mobile**:
   - **Desktop / Web:** 4 colunas perfeitamente distribuídas (`DROGA E APRESENTAÇÃO`, `DOSE`, `PRESCRIÇÃO`, `Doses menores 1ml`).
   - **Mobile (Smartphones):** 100% vertical, sem necessidade de rolagem lateral (`overflow-x: hidden`), exibindo a dose por kg ao lado do nome da medicação em cards individuais.

4. **Impressão em A4 Otimizada (2 Páginas)**:
   - **Página 1:** Cabeçalho do paciente e Bloco completo de Drogas em Bólus / Reanimação / RSI.
   - **Página 2:** Começa exatamente com **Drogas para Infusão Contínua**, seguida pela Tabela de Equipamentos de Via Aérea / Acessos e a Faixa de Terapia Elétrica (Desfibrilação e Cardioversão).

5. **Equipamentos e Terapia Elétrica**:
   - Tubo traqueal (com e sem cuff), lâmina laringoscópio, fixação gengival, sonda de aspiração, bougie (6 Fr), jelco de descompressão torácica, dreno de tórax, cateter venoso central (CVC), jelco para PIA e sonda vesical de demora (SVD).
   - Desfibrilação (1ª dose a 2 J/kg, 2ª dose a 4 J/kg) e cardioversão sincronizada (1 J/kg).

---

## 🚀 Como Executar

- Abra diretamente o arquivo [`index.html`](file:///c:/Users/roger/Downloads/calculadora%20ped/index.html) em qualquer navegador web;
- Ou acesse via servidor local ativo em: `http://localhost:8080`.
