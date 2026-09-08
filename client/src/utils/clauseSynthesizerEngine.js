/**
 * ManakAI Clause Synthesizer Engine
 * Generates concise, authoritative, dispute-proof specification clauses
 * conforming to BIS standards, mandatory QCOs, and GeM procurement rules.
 */

export const synthesizeManakAIClause = (promptText = '') => {
  const text = promptText.toLowerCase();

  // Extract specific product name if explicitly provided in prompt
  const productMatch = promptText.match(/(?:clause for|specification for|tender for|supply and technical specification for|supply of)\s+([^.,;\n]+)/i);
  const detectedProduct = productMatch ? productMatch[1].trim() : '';

  // 1. TMT Bars / Steel Rebar
  if (text.includes('1786') || text.includes('tmt') || text.includes('steel') || text.includes('rebar') || text.includes('reinforcement')) {
    return {
      standardCode: 'IS 1786:2008 (Grade Fe 500D)',
      standardTitle: 'High Strength Deformed Steel Bars for Concrete Reinforcement',
      materialRule: 'Yield Strength ≥ 500 MPa, UTS/YS ratio ≥ 1.10, Elongation ≥ 16%',
      qcoMandate: 'Steel & Steel Products (Quality Control) Order 2024',
      evidence: 'Manufacturer Test Certificate (MTC) + NABL lab chemical & tensile test report',
      shortExplanation:
        'Mandates earthquake-resistant Grade Fe 500D rebar with compulsory BIS ISI marking. Prohibits rerolled or non-licensed steel under statutory QCO regulations.',
      clauseText:
        'The contractor shall supply only Thermo-Mechanically Treated (TMT) high-strength deformed steel bars conforming strictly to IS 1786 (Grade Fe 500D) bearing valid BIS certification mark (ISI License). Each consignment must be accompanied by the primary manufacturer test certificate verifying chemical composition (C ≤ 0.25%, S ≤ 0.040%, P ≤ 0.040%) and mechanical properties (0.2% proof stress ≥ 500 N/mm²). Third-party testing shall be conducted through an approved NABL accredited laboratory per IS 1608 (Part 1). Any non-ISI marked or rerolled steel shall result in immediate rejection under CVC guidelines.',
      checklist: [
        'Mandatory BIS Scheme-I ISI Mark (CM/L license verification)',
        'Chemical composition limits: Carbon ≤ 0.25%, S+P ≤ 0.075%',
        'Tensile proof stress ≥ 500 MPa tested in accordance with IS 1608',
        'Consignment-wise NABL third-party test verification < 30 days old',
      ],
    };
  }

  // 2. LED Street Lighting & Luminaires
  if (text.includes('10322') || text.includes('light') || text.includes('street') || text.includes('luminaire') || text.includes('led')) {
    return {
      standardCode: 'IS 10322 (Part 5/Sec 3):2024',
      standardTitle: 'Luminaires for Road and Street Lighting (Safety & Performance)',
      materialRule: 'IP66 Ingress Protection, 10kV / 5kA Surge Immunity, Efficacy ≥ 130 lm/W',
      qcoMandate: 'Electronics & IT Goods (Compulsory Registration) Order & BIS CRS Scheme',
      evidence: 'NABL accredited LM-79 & LM-80 photometric report + 10kV surge test certificate',
      shortExplanation:
        'Enforces BIS-certified IP66 LED luminaires with 10kV surge suppression and BIS registration. Mandates class-I local content and 5-year replacement guarantee.',
      clauseText:
        'All outdoor LED luminaires shall conform strictly to IS 10322 (Part 5/Sec 3):2024 with valid Bureau of Indian Standards (BIS) registration and ISI mark. Controlgear must comply with IS 15885-2-13, incorporating built-in surge protection up to 10kV tested per IS 16103 at an accredited NABL testing facility. Luminaires shall feature high-pressure die-cast aluminum housing providing minimum IP66 ingress and IK08 impact protection, with minimum system efficacy of 130 lm/W and CRI ≥ 70. Bidders must provide a comprehensive 5-year on-site replacement warranty and DPIIT Class-I local content declaration.',
      checklist: [
        'BIS registration under Compulsory Registration Scheme (CRS)',
        'Built-in 10kV surge protection tested per IS 16103 (Part 1)',
        'Ingress protection verified as IP66 per IS 12063 at NABL lab',
        'LM-79 and LM-80 certified LED performance reports',
      ],
    };
  }

  // 3. Concrete & Cement
  if (text.includes('456') || text.includes('concrete') || text.includes('cement') || text.includes('rcc')) {
    return {
      standardCode: 'IS 456:2000 & IS 10262:2019',
      standardTitle: 'Plain and Reinforced Concrete — Code of Practice & Mix Design',
      materialRule: 'Design Mix Concrete (Minimum Grade M25/M30), w/c ratio ≤ 0.45',
      qcoMandate: 'Cement (Quality Control) Order 2024 for all constituent cements',
      evidence: '28-day cube compressive strength report from accredited laboratory',
      shortExplanation:
        'Specifies design mix concrete per IS 10262 using certified constituent cements and graded aggregates with verified water-cement ratios.',
      clauseText:
        'All reinforced concrete work shall strictly conform to IS 456:2000. Concrete shall be Design Mix conforming to IS 10262 with characteristic compressive strength of Grade M30 (minimum 30 N/mm² at 28 days) and maximum free water-cement ratio of 0.45. Constituent cement shall be 43/53 grade OPC or PPC bearing mandatory BIS standard mark conforming to IS 269 or IS 1489. Aggregates shall satisfy IS 383. Mandatory site sampling and 7/28-day crushing tests shall be performed in accordance with IS 516 with statistical acceptance criteria per Table 11 of IS 456.',
      checklist: [
        'Design mix proportioning in compliance with IS 10262:2019',
        'All constituent cement ISI marked under Cement QCO',
        'Graded coarse and fine aggregates tested per IS 383',
        'Daily cube sampling and testing per IS 516',
      ],
    };
  }

  // 4. Packaged Drinking Water
  if (text.includes('water') || text.includes('drinking') || text.includes('14543') || text.includes('10500')) {
    return {
      standardCode: 'IS 14543:2024 / IS 10500:2012',
      standardTitle: 'Packaged Drinking Water / Drinking Water Specifications',
      materialRule: 'TDS 75-500 mg/l, Zero E.coli/coliforms, pesticide residues below detection limits',
      qcoMandate: 'Food Safety and Standards (Packaging) & Mandatory BIS Certification Order',
      evidence: 'NABL complete chemical, heavy metals, and microbiological test report',
      shortExplanation:
        'Requires mandatory BIS certification for packaged drinking water and strict microbiological compliance under FSSAI and BIS Act regulations.',
      clauseText:
        'The packaged drinking water supplied shall strictly conform to IS 14543:2024 and bear the mandatory Bureau of Indian Standards (BIS) ISI Certification Mark with a valid CM/L license number printed on every container. Containers shall be made of food-grade virgin polymers conforming to IS 15410. Water must be tested for microbiological purity (zero E.coli, coliform, and faecal streptococci) and chemical parameters in accordance with IS 3025 at an accredited NABL laboratory. Dispatch without a valid BIS license is strictly prohibited under statutory regulations.',
      checklist: [
        'Mandatory BIS ISI Certification Mark (Scheme-I)',
        'Containers made of certified food-grade polymer per IS 15410',
        'Microbiological and heavy metals test report per IS 3025',
        'Batch testing records and FSSAI manufacturing license',
      ],
    };
  }

  // 5. HDPE / UPVC Pipes
  if (text.includes('pipe') || text.includes('hdpe') || text.includes('pvc') || text.includes('4984') || text.includes('4985')) {
    return {
      standardCode: 'IS 4984:2016 / IS 4985:2021',
      standardTitle: 'High Density Polyethylene (HDPE) & UPVC Pipes for Water Supply',
      materialRule: 'PN 6 / PN 10 / PN 16 Pressure Rating, Virgin PE-80 / PE-100 polymer granules',
      qcoMandate: 'Pipes and Fittings (Quality Control) Order 2024 & BIS Act 2016',
      evidence: 'Manufacturer Test Certificate + Hydrostatic pressure test reports from NABL lab',
      shortExplanation:
        'Mandates prime virgin resin polymer pipes conforming to IS 4984 with valid BIS ISI license and verified 100-hour hydrostatic test proof.',
      clauseText:
        'All pipes and fittings shall conform strictly to IS 4984:2016 (HDPE) or IS 4985:2021 (UPVC) bearing the valid Bureau of Indian Standards (BIS) ISI mark. Pipes shall be manufactured strictly from virgin grade PE-80/PE-100 polymers with declared hydrostatic design basis. Reworked or scrap plastic materials are strictly prohibited. Each lot must be tested for dimensions, ovality, carbon black content, and internal hydrostatic pressure resistance per IS 4984 at an approved NABL testing facility before dispatch.',
      checklist: [
        'Mandatory BIS Scheme-I ISI License on each pipe length',
        'Virgin polymer declaration without reprocessed materials',
        'Hydrostatic internal pressure test report per IS 4984',
        'Wall thickness and outside diameter tolerance verification',
      ],
    };
  }

  // 6. Cables & Electrical Wiring
  if (text.includes('cable') || text.includes('wire') || text.includes('694') || text.includes('7098') || text.includes('conductor')) {
    return {
      standardCode: 'IS 694:2010 / IS 7098 (Part 1):1988',
      standardTitle: 'PVC & XLPE Insulated Armoured / Unarmoured Cables for Working Voltages up to 1100V',
      materialRule: 'Class-2/Class-5 High Conductivity Electrolytic Copper/Aluminium, Oxygen Index ≥ 29%',
      qcoMandate: 'Cables & Conductors (Quality Control) Order 2024',
      evidence: 'Conductor resistance test report, insulation resistance & spark test certificate',
      shortExplanation:
        'Enforces BIS ISI-certified cables with electrolytic grade copper/aluminum conductors and flame-retardant low-smoke (FRLS) insulation.',
      clauseText:
        'The cables supplied shall strictly conform to IS 694:2010 or IS 7098 (Part 1) and bear the Bureau of Indian Standards (BIS) ISI certification mark. Conductors shall be manufactured from 99.97% high-conductivity electrolytic grade annealed copper or EC-grade aluminium conforming to IS 8130. Insulation shall be virgin flame-retardant (FRLS) PVC compound with minimum temperature index of 250°C and oxygen index ≥ 29%. Sequential metre marking and valid CM/L license number must be embossed on outer sheath.',
      checklist: [
        'Valid BIS Scheme-I ISI Certification License (CML)',
        'Conductor electrical resistance test per IS 8130',
        'Insulation resistance and high-voltage spark test reports',
        'Flame retardant low smoke (FRLS) performance certificate',
      ],
    };
  }

  // Generic Intelligent Fallback
  const detectedKeywords = promptText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['synthesize', 'airtight', 'dispute', 'proof', 'technical', 'tender', 'specification', 'clause', 'mandatory', 'compliance'].includes(w.toLowerCase()))
    .slice(0, 5)
    .join(', ');

  const titleName = detectedProduct || detectedKeywords || 'Procurement Goods';

  return {
    standardCode: 'Applicable Bureau of Indian Standards (BIS) Code',
    standardTitle: `Technical Specification for ${titleName}`,
    materialRule: 'Conformance to latest Bureau of Indian Standards (BIS) statutory criteria & quality mandates',
    qcoMandate: 'Mandatory Government Quality Control Orders (QCO) & BIS Act 2016',
    evidence: 'Third-party NABL accredited laboratory test report & Manufacturer Test Certificate (MTC)',
    shortExplanation:
      `Synthesizes an authoritative tender clause requiring valid BIS certification, verified test parameters, and strict third-party laboratory evidence for ${titleName}.`,
    clauseText:
      `The contractor/supplier shall supply ${titleName} conforming strictly to applicable Bureau of Indian Standards (BIS) specifications bearing the valid ISI certification mark as on the date of bid opening. The material must satisfy all mechanical, electrical, and chemical performance limits established under statutory Quality Control Orders (QCOs). Every consignment shall be accompanied by the manufacturer test certificate (MTC) and independent test reports from an accredited NABL testing facility. Any submission of substandard or non-conforming items shall result in technical disqualification under CVC procurement guidelines.`,
    checklist: [
      'Valid Bureau of Indian Standards (BIS) License / Registration',
      'Mandatory adherence to statutory Quality Control Orders (QCO)',
      'Consignment test report from accredited NABL laboratory',
      'CVC-compliant anti-deviation tender clause formulation',
    ],
  };
};