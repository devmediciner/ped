/**
 * Calculadora de Emergência Pediátrica | ABRAMEDE-MG 2022
 * Atualizada rigorosamente conforme a Folha de Parada Cardiorrespiratória e Emergência Pediátrica 2022
 */

// ==========================================================================
// Gerador Aleatório de Nomes Pediátricos com Sobrenome Composto
// ==========================================================================
function getRandomPatientName() {
  const firstNames = ['Enzo', 'Gael', 'Théo', 'Heitor', 'Ravi', 'Noah'];
  const compoundSurnames = [
    'Silva Santos',
    'Oliveira Costa',
    'Pereira Lima',
    'Souza Ribeiro',
    'Almeida Castro',
    'Miranda Carvalho',
    'Ferreira Gomes',
    'Rodrigues Alves',
    'Barbosa Martins',
    'Nascimento Ramos',
    'Cardoso Melo',
    'Moreira Dias'
  ];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const surname = compoundSurnames[Math.floor(Math.random() * compoundSurnames.length)];
  return `${first} ${surname}`;
}

// ==========================================================================
// Estado Global da Aplicação
// ==========================================================================
const AppState = {
  peso: 15.0,
  idadeAnos: 3,
  idadeMeses: 0,
  nome: getRandomPatientName(),
  searchQuery: ''
};

// ==========================================================================
// Base de Conhecimento Atualizada (ABRAMEDE-MG 2022)
// ==========================================================================
const DRUGS_DATABASE = [
  // ------------------------------------------------------------------------
  // BLOCO 1: DROGA E APRESENTAÇÃO (BÓLUS, INDUÇÃO, REANIMAÇÃO)
  // ------------------------------------------------------------------------
  {
    key: 'ceftriaxona',
    name: 'Ceftriaxona 1g',
    section: 'bolus',
    doseDesc: '50 mg/Kg<br>100 mg/Kg',
    isMultiRow: true,
    calculate: (peso) => {
      const fmtVol = (val) => {
        const rounded = Math.round(val * 100) / 100;
        return (rounded % 1 === 0) ? rounded.toString() : rounded.toString().replace('.', ',');
      };

      // 50 mg/kg (infecções graves/sepse, máx 2000 mg)
      const dose50 = Math.min(peso * 50, 2000);
      const frascos50 = Math.max(1, Math.ceil(dose50 / 1000));
      // Cada frasco de 1g de pó (0,7 ml) recebe 9,3 ml de SF 0,9% -> 10 ml total (100 mg/ml)
      const sf50Num = frascos50 * 9.3;
      const sf50 = (Math.round(sf50Num * 10) / 10).toString().replace('.', ',');
      const vol50Num = dose50 / 100.0;
      const vol50 = fmtVol(vol50Num);
      const ue50 = vol50Num < 1.0 ? Math.round(vol50Num * 100) : null;
      const fl50 = frascos50 === 1 ? 'frasco' : 'frascos';

      // 100 mg/kg (meningite/neuroinfecção, máx 4000 mg)
      const dose100 = Math.min(peso * 100, 4000);
      const frascos100 = Math.max(1, Math.ceil(dose100 / 1000));
      const sf100Num = frascos100 * 9.3;
      const sf100 = (Math.round(sf100Num * 10) / 10).toString().replace('.', ',');
      const vol100Num = dose100 / 100.0;
      const vol100 = fmtVol(vol100Num);
      const ue100 = vol100Num < 1.0 ? Math.round(vol100Num * 100) : null;
      const fl100 = frascos100 === 1 ? 'frasco' : 'frascos';

      return {
        rows: [
          {
            dose: '50 mg/Kg',
            presc: `Reconstituir <span class="num-bold">${frascos50}</span> ${fl50} de 1g em <span class="num-bold">${sf50}</span> ml de ABD e injetar lentamente <span class="num-bold">${vol50}</span> ml EV`,
            ue: ue50 ? `${ue50} ue100` : '',
            ueNum: ue50,
            prescText: `Ceftriaxona 1g (50 mg/kg): Reconstituir ${frascos50} ${fl50} de 1g em ${sf50} ml de ABD e injetar lentamente ${vol50} ml EV (${dose50} mg).`
          },
          {
            dose: '100 mg/Kg',
            presc: `Reconstituir <span class="num-bold">${frascos100}</span> ${fl100} de 1g em <span class="num-bold">${sf100}</span> ml de ABD e injetar lentamente <span class="num-bold">${vol100}</span> ml EV`,
            ue: ue100 ? `${ue100} ue100` : '',
            ueNum: ue100,
            prescText: `Ceftriaxona 1g (100 mg/kg): Reconstituir ${frascos100} ${fl100} de 1g em ${sf100} ml de ABD e injetar lentamente ${vol100} ml EV (${dose100} mg).`
          }
        ],
        prescricaoText: `Ceftriaxona 1g: 50 mg/kg -> Reconstituir ${frascos50} ${fl50} de 1g em ${sf50} ml de ABD e injetar lentamente ${vol50} ml EV; 100 mg/kg -> Reconstituir ${frascos100} ${fl100} de 1g em ${sf100} ml de ABD e injetar lentamente ${vol100} ml EV.`
      };
    }
  },
  {
    key: 'adrenalina_pcr',
    name: 'Adrenalina 1:1.000',
    section: 'bolus',
    doseDesc: '0.1 ml/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.1).toFixed(2).replace('.00', '').replace(/0$/, '');
      const ue = (peso * 0.1 < 1.0) ? Math.round(peso * 10) : null;
      return {
        prescricaoHtml: `EV ou IO: Diluir 1 ml em 9 ml de ABD e fazer <span class="num-bold">${vol}</span> ml<br>ET: Fazer <span class="num-bold">${vol}</span> ml de 5 em 5 min.`,
        prescricaoText: `Adrenalina 1:1000 - EV/IO: Diluir 1 ml em 9 ml ABD e fazer ${vol} ml (0,01 mg/kg). ET: Fazer ${vol} ml sem diluir a cada 3-5 min.`,
        volumeMl: parseFloat(vol),
        ue100: ue,
        doseDisplay: '0.1 ml/Kg'
      };
    }
  },
  {
    key: 'atropina',
    name: 'Atropina 0,5mg/ml',
    section: 'bolus',
    doseDesc: '0,02 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.04).toFixed(2).replace(/0$/, '');
      const ue = Math.round(peso * 4);
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml sem diluir EV, ET ,IO`,
        prescricaoText: `Atropina 0,5mg/ml: Fazer ${vol} ml sem diluir EV, ET, IO (${(peso*0.02).toFixed(2)} mg).`,
        volumeMl: parseFloat(vol),
        ue100: ue,
        doseDisplay: '0,02 mg/Kg'
      };
    }
  },
  {
    key: 'bicarbonato',
    name: 'Bicarbonato de Sódio 8,4%',
    section: 'bolus',
    doseDesc: '1 ml/Kg',
    calculate: (peso) => {
      const vol = peso.toFixed(0);
      const total = (peso * 2).toFixed(0);
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${vol}</span> ml em <span class="num-bold">${vol}</span> ml de ABD e fazer <span class="num-bold">${total}</span> ml EV`,
        prescricaoText: `Bicarbonato de Sódio 8,4%: Diluir ${vol} ml em ${vol} ml de ABD e fazer ${total} ml EV lento (1 mEq/kg).`,
        volumeMl: parseFloat(vol),
        ue100: null,
        doseDisplay: '1 ml/Kg'
      };
    }
  },
  {
    key: 'glicose50',
    name: 'Glicose a 50 %',
    section: 'bolus',
    doseDesc: '0,5 g/Kg',
    calculate: (peso) => {
      const vol = peso.toFixed(0);
      const abd = (peso * 4).toFixed(0);
      const total = (peso * 5).toFixed(0);
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${vol}</span> ml em <span class="num-bold">${abd}</span> ml de ABD e fazer <span class="num-bold">${total}</span> ml EV`,
        prescricaoText: `Glicose 50%: Diluir ${vol} ml em ${abd} ml de ABD e fazer ${total} ml EV (solução a 10%).`,
        volumeMl: parseFloat(vol),
        ue100: null,
        doseDisplay: '0,5 g/Kg'
      };
    }
  },
  {
    key: 'cloreto_calcio',
    name: 'Cloreto de Cálcio 10 %',
    section: 'bolus',
    doseDesc: '5,4 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.2).toFixed(1).replace('.0', '');
      const abd = (peso * 0.6).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${vol}</span> ml em <span class="num-bold">${abd}</span> ml de ABD e fazer EV`,
        prescricaoText: `Cloreto de Cálcio 10%: Diluir ${vol} ml em ${abd} ml de ABD e fazer EV lento.`,
        volumeMl: parseFloat(vol),
        ue100: null,
        doseDisplay: '5,4 mg/Kg'
      };
    }
  },
  {
    key: 'gluconato_calcio',
    name: 'Gluconato de Cálcio 10 %',
    section: 'bolus',
    doseDesc: '5,4 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.6).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${vol}</span> ml em <span class="num-bold">${vol}</span> ml de ABD e fazer EV`,
        prescricaoText: `Gluconato de Cálcio 10%: Diluir ${vol} ml em ${vol} ml de ABD e fazer EV lento em 5-10 min.`,
        volumeMl: parseFloat(vol),
        ue100: null,
        doseDisplay: '5,4 mg/Kg'
      };
    }
  },
  {
    key: 'adenosina',
    name: 'Adenosina (6mg/2ml)',
    section: 'bolus',
    doseDesc: '0,1mg/kg<br>0,2mg/kg',
    isMultiRow: true,
    calculate: (peso) => {
      const vol1 = ((0.1 * peso) / 3.0).toFixed(2);
      const ue1 = Math.round(parseFloat(vol1) * 100);

      const vol2 = ((0.2 * peso) / 3.0).toFixed(2);
      const ue2 = parseFloat(vol2) < 1.0 ? Math.round(parseFloat(vol2) * 100) : null;

      return {
        rows: [
          {
            dose: '0,1mg/kg',
            presc: `Fazer <span class="num-bold">${vol1}</span> ml EV em bolus rápido 1ª Dose`,
            ue: `${ue1} ue100`,
            ueNum: ue1,
            prescText: `Adenosina 1ª dose: Fazer ${vol1} ml EV em bolus rápido + flush 5-10 ml SF.`
          },
          {
            dose: '0,2mg/kg',
            presc: `Fazer <span class="num-bold">${vol2}</span> ml EV em bolus rápido 2ª Dose`,
            ue: ue2 ? `${ue2} ue100` : '',
            ueNum: ue2,
            prescText: `Adenosina 2ª dose: Fazer ${vol2} ml EV em bolus rápido + flush 5-10 ml SF.`
          }
        ],
        prescricaoText: `Adenosina (3mg/ml): 1ª dose 0.1 mg/kg: ${vol1} ml; 2ª dose 0.2 mg/kg: ${vol2} ml EV bolus rápido.`
      };
    }
  },
  {
    key: 'amiodarona',
    name: 'Amiodarona (50mg/ml)',
    section: 'bolus',
    doseDesc: '5mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.1).toFixed(2).replace(/0$/, '');
      const abd = (peso * 2.0).toFixed(0);
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${vol}</span> ml em <span class="num-bold">${abd}</span> ml de ABD e fazer EV ou IO`,
        prescricaoText: `Amiodarona (50mg/ml): Diluir ${vol} ml em ${abd} ml de ABD (ou SG5%) e fazer EV ou IO.`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '5mg/Kg'
      };
    }
  },
  {
    key: 'naloxona',
    name: 'Naloxona (0,4mg/ml)',
    section: 'bolus',
    doseDesc: '0,1mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.25).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV - IO - IN - IM - BÓLUS`,
        prescricaoText: `Naloxona (0,4mg/ml): Fazer ${vol} ml EV-IO-IN-IM em bólus (0,1 mg/kg).`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '0,1mg/Kg'
      };
    }
  },
  {
    key: 'lidocaina',
    name: 'Lidocaína 1%',
    section: 'bolus',
    doseDesc: '1mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.1).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV- IO`,
        prescricaoText: `Lidocaína 1% (10mg/ml): Fazer ${vol} ml EV-IO lento (1 mg/kg).`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '1mg/Kg'
      };
    }
  },
  {
    key: 'midazolam_bolus',
    name: 'Midazolam (15 mg/3 ml)',
    section: 'bolus',
    doseDesc: '0,2 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.04).toFixed(2).replace(/0$/, '');
      const ue = Math.round(peso * 4);
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV - ET - IO - IN - SL lento - BÓLUS`,
        prescricaoText: `Midazolam (5mg/ml) BÓLUS: Fazer ${vol} ml EV-ET-IO-IN-SL lento.`,
        volumeMl: parseFloat(vol),
        ue100: ue,
        doseDisplay: '0,2 mg/Kg'
      };
    }
  },
  {
    key: 'fentanil_bolus',
    name: 'Fentanil (50 mcg/ml)',
    section: 'bolus',
    doseDesc: '2 mcg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.04).toFixed(2).replace(/0$/, '');
      const ue = Math.round(peso * 4);
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml + 3ml de ABD EV lento - BÓLUS`,
        prescricaoText: `Fentanil (50 mcg/ml) BÓLUS: Fazer ${vol} ml + 3 ml de ABD EV lento em 2 a 3 min.`,
        volumeMl: parseFloat(vol),
        ue100: ue,
        doseDisplay: '2 mcg/Kg'
      };
    }
  },
  {
    key: 'morfina',
    name: 'Morfina (10mg/ml)',
    section: 'bolus',
    doseDesc: '0,1 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.01).toFixed(2);
      const ue = Math.round(peso * 1);
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV- IO - IM - SC`,
        prescricaoText: `Morfina (10mg/ml): Fazer ${vol} ml EV-IO-IM-SC (${(peso*0.1).toFixed(2)} mg).`,
        volumeMl: parseFloat(vol),
        ue100: ue,
        doseDisplay: '0,1 mg/Kg'
      };
    }
  },
  {
    key: 'cetamina_bolus',
    name: 'Cetamina (50mg/ml)',
    section: 'bolus',
    doseDesc: '2 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.04).toFixed(2).replace(/0$/, '');
      const ue = Math.round(peso * 4);
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml IV - IM`,
        prescricaoText: `Cetamina (50mg/ml) BÓLUS: Fazer ${vol} ml IV-IM (${(peso*2).toFixed(1)} mg).`,
        volumeMl: parseFloat(vol),
        ue100: ue,
        doseDisplay: '2 mg/Kg'
      };
    }
  },
  {
    key: 'etomidato',
    name: 'Etomidato (2mg/ml)',
    section: 'bolus',
    doseDesc: '0,2mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.1).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV- IO`,
        prescricaoText: `Etomidato (2mg/ml): Fazer ${vol} ml EV-IO lento em 30 a 60 seg.`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '0,2mg/Kg'
      };
    }
  },
  {
    key: 'propofol',
    name: 'Propofol (200mg/20ml)',
    section: 'bolus',
    doseDesc: '2,5mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.25).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV`,
        prescricaoText: `Propofol 1% (10mg/ml): Fazer ${vol} ml EV lento.`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '2,5mg/Kg'
      };
    }
  },
  {
    key: 'rocuronio',
    name: 'Rocurônio (10mg/ml)',
    section: 'bolus',
    doseDesc: '1 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.1).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV - IO`,
        prescricaoText: `Rocurônio (10mg/ml): Fazer ${vol} ml EV-IO em bolus rápido para SRI.`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '1 mg/Kg'
      };
    }
  },
  {
    key: 'succinilcolina',
    name: 'Succinilcolina (100mg/10ml)',
    section: 'bolus',
    doseDesc: '1 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.1).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV - IO`,
        prescricaoText: `Succinilcolina (10mg/ml): Fazer ${vol} ml EV-IO rápido.`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '1 mg/Kg'
      };
    }
  },
  {
    key: 'cisatracurio',
    name: 'Cisatracúrio (2mg/ml)',
    section: 'bolus',
    doseDesc: '0,15 mg/Kg',
    calculate: (peso) => {
      const vol = (peso * 0.075).toFixed(3).replace(/0$/, '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV - IO BÓLUS`,
        prescricaoText: `Cisatracúrio (2mg/ml): Fazer ${vol} ml EV-IO em bólus.`,
        volumeMl: parseFloat(vol),
        ue100: (parseFloat(vol) < 1.0) ? Math.round(parseFloat(vol) * 100) : null,
        doseDisplay: '0,15 mg/Kg'
      };
    }
  },
  {
    key: 'fenitoina',
    name: 'Fenitoína 50mg/ml',
    section: 'bolus',
    doseDesc: '15 mg/Kg',
    calculate: (peso) => {
      const volDrog = (peso * 0.3).toFixed(1).replace('.0', '');
      const volDil = (50.0 - (peso * 0.3)).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${volDrog}</span> ml em <span class="num-bold">${volDil}</span> ml de ABD e fazer EV em 15min`,
        prescricaoText: `Fenitoína 50mg/ml: Diluir ${volDrog} ml em ${volDil} ml de ABD (Total 50 ml) e fazer EV em 15 min.`,
        volumeMl: parseFloat(volDrog),
        ue100: null,
        doseDisplay: '15 mg/Kg'
      };
    }
  },
  {
    key: 'fenobarbital',
    name: 'FENObarbital 100mg/ml',
    section: 'bolus',
    doseDesc: '15 mg/Kg',
    calculate: (peso) => {
      const volDrog = (peso * 0.15).toFixed(2).replace(/0$/, '');
      const volDil = (20.0 - (peso * 0.15)).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${volDrog}</span> ml em <span class="num-bold">${volDil}</span> ml de ABD e fazer EV em 15min`,
        prescricaoText: `FENObarbital 100mg/ml: Diluir ${volDrog} ml em ${volDil} ml de ABD (Total 20 ml) e fazer EV em 15 min.`,
        volumeMl: parseFloat(volDrog),
        ue100: null,
        doseDisplay: '15 mg/Kg'
      };
    }
  },
  {
    key: 'manitol',
    name: 'Manitol 20%',
    section: 'bolus',
    doseDesc: '0,5 g/Kg',
    calculate: (peso) => {
      const vol = (peso * 2.5).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Fazer <span class="num-bold">${vol}</span> ml EV lento em 2h`,
        prescricaoText: `Manitol 20%: Fazer ${vol} ml EV lento (em 2h ou em 20 min no TCE grave com herniação).`,
        volumeMl: parseFloat(vol),
        ue100: null,
        doseDisplay: '0,5 g/Kg'
      };
    }
  },
  {
    key: 'precedex_inducao',
    name: 'PRECEDEX 100MCG/ML (2ML)',
    subType: 'indução',
    section: 'bolus',
    doseDesc: '0,5 a 1<br>mcg/kg (bólus)',
    calculate: (peso) => {
      const minVol = (peso * 0.25).toFixed(2).replace(/0$/, '');
      const maxVol = (peso * 0.50).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir 2ml em 48ml de SF. Fazer BÓLUS de <span class="num-bold">${minVol}</span> até <span class="num-bold">${maxVol}</span> ml EV`,
        prescricaoText: `Precedex (Dexmedetomidina) Indução: Diluir 2ml em 48ml SF (4 mcg/ml). Fazer bólus de ${minVol} a ${maxVol} ml EV.`,
        volumeMl: parseFloat(minVol),
        ue100: null,
        doseDisplay: '0,5 a 1<br>mcg/kg (bólus)'
      };
    }
  },
  {
    key: 'ketamina_inducao',
    name: 'KETAMINA 50MG/ML (2ML)',
    subType: 'indução',
    section: 'bolus',
    doseDesc: '1 a 4<br>mg/kg',
    calculate: (peso) => {
      const minVol = (peso * 1).toFixed(0);
      const maxVol = (peso * 4).toFixed(0);
      const maxPrecedex = (peso * 1).toFixed(0);
      return {
        prescricaoHtml: `DILUIR 2ml + 98ML de SF (1MG/ML). Fazer <span class="num-bold">${minVol}</span> ATÉ <span class="num-bold">${maxVol}</span> ml EV (${maxPrecedex} MÁX se precedex)`,
        prescricaoText: `Ketamina Indução: Diluir 2ml em 98ml SF (1 mg/ml). Fazer de ${minVol} a ${maxVol} ml EV (Máx ${maxPrecedex} ml se associado a Precedex).`,
        volumeMl: parseFloat(minVol),
        ue100: null,
        doseDisplay: '1 a 4<br>mg/kg'
      };
    }
  },
  {
    key: 'nacl_3',
    name: 'Cloreto de sódio 10% diluída (3%)',
    section: 'bolus',
    doseDesc: '3%<br>(2,5 mEq/kg)',
    calculate: (peso) => {
      const total = (peso * 5.0).toFixed(0);
      return {
        prescricaoHtml: `Diluir 30 ml em 70 ml de ABD e fazer <span class="num-bold">${total}</span> mL EV em 15 min`,
        prescricaoText: `Salina 3% (Diluir 30ml de NaCl 10% em 70ml de ABD): Fazer ${total} ml EV em 15 min (5 ml/kg).`,
        volumeMl: parseFloat(total),
        ue100: null,
        doseDisplay: '3%<br>(2,5 mEq/kg)'
      };
    }
  },

  // ------------------------------------------------------------------------
  // BLOCO 2: DROGAS PARA INFUSÃO CONTÍNUA
  // ------------------------------------------------------------------------
  {
    key: 'precedex_cont',
    name: 'PRECEDEX',
    subType: 'Contínuo',
    section: 'continuo',
    doseDesc: '0,2 a 0,7<br>mcg/kg/h',
    calculate: (peso) => {
      const minRate = (peso * 0.25).toFixed(2).replace(/0$/, '');
      const maxRate = (peso * 0.40).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `DILUIR 2ML em 48ML SF. VNI em BIC, correr de <span class="num-bold">${minRate}</span> ATÉ <span class="num-bold">${maxRate}</span> ml/h EV`,
        prescricaoText: `Precedex Contínuo: Diluir 2ml em 48ml SF. Correr em BIC de ${minRate} a ${maxRate} ml/h EV.`,
        volumeMl: null,
        ue100: null,
        doseDisplay: '0,2 a 0,7<br>mcg/kg/h'
      };
    }
  },
  {
    key: 'midazolam_manutencao',
    name: 'MIDAZOLAM (15 mg/3 ml)',
    subType: 'Manutenção 1mg/ml',
    section: 'continuo',
    doseDesc: '1 mg/ml<br>(pós diluição)',
    calculate: (peso) => {
      const minRate = (peso * 0.01).toFixed(2).replace(/0$/, '');
      const maxRate = (peso * 0.20).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `DILUIR 10ML em 490ML SF. MANUTENÇÃO-> DE <span class="num-bold">${minRate}</span> ATÉ <span class="num-bold">${maxRate}</span> ml/h EV`,
        prescricaoText: `Midazolam Manutenção (1mg/ml): Diluir 10ml em 490ml SF. Correr de ${minRate} até ${maxRate} ml/h EV.`,
        volumeMl: null,
        ue100: null,
        doseDisplay: '1 mg/ml<br>(pós diluição)'
      };
    }
  },
  {
    key: 'ketamina_manutencao',
    name: 'KETAMINA 50MG/ML - 2ML',
    subType: 'Manutenção 1mg/ml',
    section: 'continuo',
    doseDesc: '1 mg/ml<br>(pós diluição)',
    calculate: (peso) => {
      const minRate = (peso * 0.5).toFixed(1).replace('.0', '');
      const maxRate = (peso * 2.0).toFixed(0);
      return {
        prescricaoHtml: `DILUIR 2ML em 98ML SF. MANUTENÇÃO-> DE <span class="num-bold">${minRate}</span> ATÉ <span class="num-bold">${maxRate}</span> ml/h EV`,
        prescricaoText: `Ketamina Manutenção (1mg/ml): Diluir 2ml em 98ml SF. Correr de ${minRate} até ${maxRate} ml/h EV.`,
        volumeMl: null,
        ue100: null,
        doseDisplay: '1 mg/ml<br>(pós diluição)'
      };
    }
  },
  {
    key: 'midazolam_50ml',
    name: 'Midazolam (15 mg/3 ml)',
    subType: 'Solução 50ml SGI',
    section: 'continuo',
    doseDesc: '1 µg/Kg<br>/min',
    calculate: (peso) => {
      const volDrog = (peso * 0.6).toFixed(1).replace('.0', '');
      const volDil = (50.0 - (peso * 0.6)).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${volDrog}</span> ml em <span class="num-bold">${volDil}</span> ml de SGI e correr a <span class="num-bold">1</span> ml/h EV`,
        prescricaoText: `Midazolam Contínuo (50ml): Diluir ${volDrog} ml em ${volDil} ml de SGI e correr a 1 ml/h EV (1 mcg/kg/min).`,
        volumeMl: parseFloat(volDrog),
        ue100: null,
        doseDisplay: '1 µg/Kg<br>/min'
      };
    }
  },
  {
    key: 'fentanil_50ml',
    name: 'Fentanil (50 mcg/ml)',
    subType: 'Solução 50ml SGI',
    section: 'continuo',
    doseDesc: '1 µg/Kg<br>/h',
    calculate: (peso) => {
      const volDrog = peso.toFixed(1).replace('.0', '');
      const volDil = (50.0 - peso).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${volDrog}</span> ml em <span class="num-bold">${volDil}</span> ml de SGI e correr a <span class="num-bold">1</span> ml/h EV`,
        prescricaoText: `Fentanil Contínuo (50ml): Diluir ${volDrog} ml em ${volDil} ml de SGI e correr a 1 ml/h EV (1 mcg/kg/h).`,
        volumeMl: parseFloat(volDrog),
        ue100: null,
        doseDisplay: '1 µg/Kg<br>/h'
      };
    }
  },
  {
    key: 'dobutamina_50ml',
    name: 'Dobutamina (250mg/20ml)',
    subType: 'Solução 50ml SGI',
    section: 'continuo',
    doseDesc: '5 µg/Kg<br>/min',
    calculate: (peso) => {
      const volDrog = (peso * 0.5).toFixed(1).replace('.0', '');
      const volDil = (50.0 - (peso * 0.5)).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${volDrog}</span> ml em <span class="num-bold">${volDil}</span> ml de SGI e correr a <span class="num-bold">2.5</span> ml/h EV (1875 µg/ml)`,
        prescricaoText: `Dobutamina (50ml): Diluir ${volDrog} ml em ${volDil} ml de SGI e correr a 2.5 ml/h EV (5 mcg/kg/min). Concentração: 1875 mcg/ml.`,
        volumeMl: parseFloat(volDrog),
        ue100: null,
        doseDisplay: '5 µg/Kg<br>/min'
      };
    }
  },
  {
    key: 'adrenalina_nora_50ml',
    name: 'Adrenalina/Nora (1mg/ml)',
    subType: 'Solução 50ml SGI',
    section: 'continuo',
    doseDesc: '0,2 µg/Kg<br>/min',
    calculate: (peso) => {
      const volDrog = (peso * 0.3).toFixed(1).replace('.0', '');
      const volDil = (50.0 - (peso * 0.3)).toFixed(1).replace('.0', '');
      return {
        prescricaoHtml: `Diluir <span class="num-bold">${volDrog}</span> ml em <span class="num-bold">${volDil}</span> ml de SGI e correr a <span class="num-bold">2</span> ml/h EV (90 µg/ml)`,
        prescricaoText: `Adrenalina ou Nora (50ml): Diluir ${volDrog} ml em ${volDil} ml de SGI e correr a 2 ml/h EV (0,2 mcg/kg/min). Concentração: 90 mcg/ml.`,
        volumeMl: parseFloat(volDrog),
        ue100: null,
        doseDisplay: '0,2 µg/Kg<br>/min'
      };
    }
  },
  {
    key: 'fenilefrina',
    name: 'Fenilefrina (10mg/ml) (Neosinefrina)',
    section: 'continuo',
    doseDesc: '0,1 mg/Kg IM<br>5 µg/Kg EV<br>0,1 µg/Kg/min',
    isMultiRow: true,
    calculate: (peso) => {
      const volIm = (peso * 0.01).toFixed(2);
      const ueIm = Math.round(peso * 1);

      const volEvBolus = ((5 * peso) / 1000.0).toFixed(3);
      const ueEvBolus = (peso * 0.5).toFixed(1).replace('.0', '');

      const rateCont = (peso * 0.12).toFixed(2);

      return {
        rows: [
          {
            dose: '0,1 mg/Kg<br>IM',
            presc: `Fazer <span class="num-bold">${volIm}</span> ml IM ou SC`,
            ue: `${ueIm} ue100`,
            ueNum: ueIm,
            prescText: `Fenilefrina IM/SC: Fazer ${volIm} ml (${ueIm} ue100).`
          },
          {
            dose: '5 µg/Kg<br>EV',
            presc: `Diluir 1ml em 9ml de ABD e fazer <span class="num-bold">${volEvBolus}</span> ml EV`,
            ue: `${ueEvBolus} ue100`,
            ueNum: parseFloat(ueEvBolus),
            prescText: `Fenilefrina EV Bólus: Diluir 1 ml em 9ml ABD e fazer ${volEvBolus} ml (${ueEvBolus} ue100).`
          },
          {
            dose: '0,1 µg/Kg<br>/min',
            presc: `Diluir 5ml da solução 1:9 em 100ml de SGI e correr a <span class="num-bold">${rateCont}</span> ml/h EV`,
            ue: '',
            ueNum: null,
            prescText: `Fenilefrina Contínuo: Diluir 5ml sol 1:9 em 100ml SGI, correr a ${rateCont} ml/h EV.`
          }
        ],
        prescricaoText: `Fenilefrina (10mg/ml): IM: ${volIm} ml (${ueIm} ue100); EV bólus: diluir 1:9 e fazer ${volEvBolus} ml; Contínuo: correr a ${rateCont} ml/h.`
      };
    }
  },
  {
    key: 'milrinona',
    name: 'Milrinona (1mg/ml)',
    section: 'continuo',
    doseDesc: '0,25 mcg/Kg<br>/min',
    calculate: (peso) => {
      const rate = (peso * 0.15).toFixed(2).replace(/0$/, '');
      return {
        prescricaoHtml: `Diluir 10ml em 90ml de SGI e fazer correr a <span class="num-bold">${rate}</span> ml/h EV`,
        prescricaoText: `Milrinona (1mg/ml): Diluir 10ml em 90ml de SGI (Total 100 ml) e correr a ${rate} ml/h EV (0,25 mcg/kg/min).`,
        volumeMl: null,
        ue100: null,
        doseDisplay: '0,25 mcg/Kg<br>/min'
      };
    }
  },
  {
    key: 'acido_tranexamico',
    name: 'Ácido tranexâmico 50mg/ml',
    section: 'continuo',
    doseDesc: '15 mg/Kg Bólus<br>15 mg/Kg em 8h',
    isMultiRow: true,
    calculate: (peso) => {
      const volBolus = (peso * 0.3).toFixed(1).replace('.0', '');
      const volDiluent = (peso * 1.2).toFixed(1).replace('.0', '');
      const rate8h = ((peso * 1.5) / 8.0).toFixed(2);

      return {
        rows: [
          {
            dose: '15 mg/Kg<br>Bólus',
            presc: `Fazer <span class="num-bold">${volBolus}</span> ml EV ou IO`,
            ue: '',
            ueNum: null,
            prescText: `Ácido tranexâmico Bólus: Fazer ${volBolus} ml EV ou IO.`
          },
          {
            dose: '15 mg/Kg<br>em 8h',
            presc: `Diluir <span class="num-bold">${volBolus}</span> ml em <span class="num-bold">${volDiluent}</span> ml de NaCl 0,9% e correr a <span class="num-bold">${rate8h}</span> ml/h EV`,
            ue: '',
            ueNum: null,
            prescText: `Ácido tranexâmico Contínuo: Diluir ${volBolus} ml em ${volDiluent} ml de SF 0,9% e correr a ${rate8h} ml/h EV em 8h.`
          }
        ],
        prescricaoText: `Ácido tranexâmico (50mg/ml): Bólus: ${volBolus} ml; Contínuo 8h: diluir em ${volDiluent} ml SF a ${rate8h} ml/h.`
      };
    }
  }
];

// ==========================================================================
// Parâmetros de Via Aérea, Equipamentos e Terapia Elétrica
// ==========================================================================
function calculateEquipments(peso, anos, meses) {
  const totalMonths = anos * 12 + meses;

  // 1. Tubo Traqueal (TET)
  let tuboComCuff = '';
  let tuboSemCuff = '';

  if (totalMonths < 1) {
    tuboComCuff = '3,0';
    tuboSemCuff = peso < 1.0 ? '2,5' : peso < 2.0 ? '3,0' : '3,5';
  } else if (totalMonths < 6) {
    tuboComCuff = '3,0-3,5';
    tuboSemCuff = '3,5-4,0';
  } else if (totalMonths < 12) {
    tuboComCuff = '3,5';
    tuboSemCuff = '4,0';
  } else if (totalMonths <= 24) {
    tuboComCuff = '3,5-4,0';
    tuboSemCuff = '4,0-4,5';
  } else {
    // Fórmulas pediátricas consagradas PALS
    const baseComCuff = (anos / 4) + 3.5;
    const baseSemCuff = (anos / 4) + 4.0;
    tuboComCuff = `${baseComCuff.toFixed(1).replace('.', ',')}`;
    tuboSemCuff = `${(baseSemCuff - 0.25).toFixed(1).replace('.', ',')}-${(baseSemCuff + 0.25).toFixed(1).replace('.', ',')}`;
  }

  // 2. Lâmina Laringoscópio
  let lamina = 'curva 1-2';
  if (totalMonths < 1) lamina = 'reta 0';
  else if (totalMonths <= 6) lamina = 'reta 1';
  else if (totalMonths <= 24) lamina = 'reta 1-2';
  else if (anos <= 4) lamina = 'curva 1-2';
  else if (anos <= 8) lamina = 'curva 2';
  else lamina = 'curva 3';

  // 3. Fixação Gengiva / Rima Labial (cm)
  let fixacao = 11;
  if (totalMonths < 1) {
    fixacao = Math.round(peso + 6);
  } else if (totalMonths < 12) {
    fixacao = 10;
  } else if (anos <= 3) {
    fixacao = 11;
  } else if (anos <= 5) {
    fixacao = 14;
  } else {
    fixacao = Math.round((anos / 2) + 12);
  }

  // 4. Sonda de Aspiração Traqueal (Fr)
  let sondaAsp = 8;
  if (totalMonths < 6) sondaAsp = 6;
  else if (anos <= 3) sondaAsp = 8;
  else if (anos <= 7) sondaAsp = 10;
  else if (anos <= 11) sondaAsp = 12;
  else sondaAsp = 14;

  // 5. Bougie
  let bougie = '6 Fr';
  if (anos > 8 || peso > 25) bougie = '10 Fr';

  // 6. Jelco Descompressão Torácica
  let jelcoDesc = 18;
  if (totalMonths < 12 || peso < 12) jelcoDesc = 18;
  else if (peso <= 25) jelcoDesc = 16;
  else jelcoDesc = 14;

  // 7. Dreno de Tórax (Fr)
  let drenoTorax = '16-20';
  if (totalMonths < 6) drenoTorax = '10-12';
  else if (totalMonths <= 12) drenoTorax = '12-16';
  else if (anos <= 4) drenoTorax = '16-20';
  else if (anos <= 8) drenoTorax = '20-28';
  else drenoTorax = '24-32';

  // 8. Cateter Venoso Central (CVC)
  let cvc = '4F/20-22G';
  if (peso < 5) cvc = '3F/22G';
  else if (peso < 18) cvc = '4F/20-22G';
  else if (peso <= 30) cvc = '5F/18G';
  else cvc = '7F/16G';

  // 9. Jelco PIA
  let jelcoPia = '22-24';
  if (peso < 5) jelcoPia = '24';
  else if (peso <= 25) jelcoPia = '22-24';
  else jelcoPia = '20';

  // 10. SVD (Sonda Vesical de Demora)
  let svd = '8-10';
  if (totalMonths < 12) svd = '6-8';
  else if (anos <= 5) svd = '8-10';
  else if (anos <= 10) svd = '10-12';
  else svd = '12-14';

  // Terapia Elétrica
  const desfib1 = Math.round(peso * 2);
  const desfib2 = Math.round(peso * 4);
  const cardioversao = Math.round(peso * 1);

  return {
    tuboComCuff,
    tuboSemCuff,
    lamina,
    fixacao,
    sondaAsp,
    bougie,
    jelcoDesc,
    drenoTorax,
    cvc,
    jelcoPia,
    svd,
    desfib1,
    desfib2,
    cardioversao
  };
}

// ==========================================================================
// Renderização das Duas Telas
// ==========================================================================
function renderAll() {
  const peso = AppState.peso;
  const anos = AppState.idadeAnos;
  const meses = AppState.idadeMeses;

  // Formatação de idade
  let idadeTexto = `${anos} anos`;
  if (anos === 0) idadeTexto = `${meses} meses`;
  else if (meses > 0) idadeTexto = `${anos} anos e ${meses} m`;

  const equip = calculateEquipments(peso, anos, meses);

  // 1. Atualizar Header da Folha Impressa (Aba 1)
  document.getElementById('sheetNome').textContent = AppState.nome || 'PACIENTE NÃO INFORMADO';
  document.getElementById('sheetPeso').textContent = `${peso.toFixed(2).replace('.', ',')} Kg`;
  document.getElementById('sheetIdade').textContent = idadeTexto;

  // Equipamentos da Folha Impressa
  document.getElementById('tblTubo').textContent = `${equip.tuboComCuff} com cuff`;
  document.getElementById('tblLamina').textContent = equip.lamina;
  document.getElementById('tblFixacao').textContent = equip.fixacao;
  document.getElementById('tblSonda').textContent = equip.sondaAsp;
  document.getElementById('tblBougie').textContent = equip.bougie;
  document.getElementById('tblJelcoDesc').textContent = equip.jelcoDesc;
  document.getElementById('tblDreno').textContent = equip.drenoTorax;
  document.getElementById('tblCvc').textContent = equip.cvc;
  document.getElementById('tblJelcoPia').textContent = equip.jelcoPia;
  document.getElementById('tblSvd').textContent = equip.svd;

  // Choque da Folha Impressa
  document.getElementById('tblDesfib1').textContent = `${equip.desfib1} J`;
  document.getElementById('tblDesfib2').textContent = `${equip.desfib2} J`;
  document.getElementById('tblCardioversao').textContent = `${equip.cardioversao} J`;

  // Tabela de Drogas da Folha Impressa
  renderOfficialTable(peso);
}

function renderOfficialTable(peso) {
  const tbody = document.getElementById('officialTableBody');
  if (!tbody) return;

  const query = (AppState.searchQuery || '').toLowerCase().trim();
  let html = '';
  let lastSection = '';
  let totalVisible = 0;

  DRUGS_DATABASE.forEach(drug => {
    const calc = drug.calculate(peso);

    if (drug.isMultiRow) {
      // Filtrar sub-linhas se houver busca
      const matchingRows = calc.rows.filter(subRow => {
        if (!query) return true;
        const text = `${drug.name} ${subRow.dose} ${subRow.prescText || ''}`.toLowerCase();
        return text.includes(query);
      });

      if (matchingRows.length === 0) return;

      // Separador visual para Infusões Contínuas
      if (drug.section !== lastSection) {
        if (drug.section === 'continuo') {
          html += `
            <tr class="table-section-row">
              <td colspan="3" class="td-section-title">DROGAS PARA INFUSÃO CONTÍNUA</td>
            </tr>
          `;
        }
        lastSection = drug.section;
      }

      matchingRows.forEach(subRow => {
        totalVisible++;
        let drugTitle = `<strong>${drug.name}</strong>`;
        if (drug.subType) {
          drugTitle += ` <span class="sub-tag">${drug.subType}</span>`;
        }
        html += `
          <tr>
            <td class="td-drug" data-label="Droga">${drugTitle}</td>
            <td class="td-dose" data-label="Dose">${subRow.dose}</td>
            <td class="td-presc" data-label="Prescrição">${subRow.presc}</td>
          </tr>
        `;
      });
    } else {
      const doseText = calc.doseDisplay || drug.doseDesc || '';
      if (query) {
        const fullSearch = `${drug.name} ${drug.subType || ''} ${doseText} ${calc.prescricaoText || ''}`.toLowerCase();
        if (!fullSearch.includes(query)) return;
      }

      // Separador visual para Infusões Contínuas
      if (drug.section !== lastSection) {
        if (drug.section === 'continuo') {
          html += `
            <tr class="table-section-row">
              <td colspan="3" class="td-section-title">DROGAS PARA INFUSÃO CONTÍNUA</td>
            </tr>
          `;
        }
        lastSection = drug.section;
      }

      totalVisible++;
      let drugTitle = `<strong>${drug.name}</strong>`;
      if (drug.subType) {
        drugTitle += ` <span class="sub-tag">${drug.subType}</span>`;
      }

      html += `
        <tr>
          <td class="td-drug" data-label="Droga">${drugTitle}</td>
          <td class="td-dose" data-label="Dose">${doseText}</td>
          <td class="td-presc" data-label="Prescrição">${calc.prescricaoHtml}</td>
        </tr>
      `;
    }
  });

  if (totalVisible === 0) {
    html = `
      <tr>
        <td colspan="3" style="text-align: center; padding: 2rem 1rem; color: #6b7280; font-size: 0.95rem;">
          Nenhum medicamento encontrado para "<strong>${AppState.searchQuery}</strong>".
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = html;
}

// ==========================================================================
// Inicialização de Eventos
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Ouvinte de Peso
  const inputPeso = document.getElementById('inputPeso');
  inputPeso.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      AppState.peso = val;
      renderAll();
    }
  });

  // 2. Ouvinte de Idade
  const inputAnos = document.getElementById('inputIdadeAnos');
  const inputMeses = document.getElementById('inputIdadeMeses');

  inputAnos.addEventListener('input', (e) => {
    const anos = parseInt(e.target.value) || 0;
    AppState.idadeAnos = Math.max(0, Math.min(18, anos));
    renderAll();
  });

  inputMeses.addEventListener('input', (e) => {
    const meses = parseInt(e.target.value) || 0;
    AppState.idadeMeses = Math.max(0, Math.min(11, meses));
    renderAll();
  });

  // 3. Ouvinte de Nome
  const inputNome = document.getElementById('inputNome');
  if (inputNome) {
    inputNome.value = AppState.nome;
    inputNome.addEventListener('input', (e) => {
      AppState.nome = e.target.value;
      document.getElementById('sheetNome').textContent = AppState.nome || 'PACIENTE NÃO INFORMADO';
    });
  }

  // 4. Barra de Pesquisa de Medicamentos na Folha
  const sheetSearchInput = document.getElementById('sheetSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (sheetSearchInput) {
    sheetSearchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.trim();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', !AppState.searchQuery);
      }
      renderOfficialTable(AppState.peso);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (sheetSearchInput) {
        sheetSearchInput.value = '';
        AppState.searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderOfficialTable(AppState.peso);
        sheetSearchInput.focus();
      }
    });
  }

  // 5. Botão Imprimir Folha A4
  document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
  });

  // 6. Alternador de Tema Claro / Escuro
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeMoon = document.getElementById('themeMoon');
  const themeSun = document.getElementById('themeSun');

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('theme-dark');
    if (isDark) {
      themeMoon.classList.add('hidden');
      themeSun.classList.remove('hidden');
    } else {
      themeMoon.classList.remove('hidden');
      themeSun.classList.add('hidden');
    }
  });

  // Render inicial
  renderAll();
});
