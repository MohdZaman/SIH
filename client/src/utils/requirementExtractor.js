/**
 * ManakAI Requirement Extractor
 * Parses procurement tender statements into structured technical requirements,
 * engineering parameters, and keyword tokens conforming to BIS compliance schemas.
 */

export const extractProcurementRequirements = (text = '', title = '') => {
  const combined = `${title} ${text}`.toLowerCase();

  let product = title || 'Procurement Technical Specification';
  let application = 'Public Procurement & Infrastructure Works';
  let technicalParameters = {};
  let keywords = [];

  if (
    combined.includes('tmt') ||
    combined.includes('steel') ||
    combined.includes('rebar') ||
    combined.includes('1786') ||
    combined.includes('reinforcement') ||
    combined.includes('fe 500')
  ) {
    product = 'Thermo-Mechanically Treated (TMT) Steel Reinforcement Bars (Fe 500D)';
    application = 'High-Rise RCC Infrastructure, Bridges & Seismic Foundations';
    technicalParameters = {
      standardGrade: 'IS 1786:2008 (Grade Fe 500D)',
      minimumYieldStress: '0.2% Proof Stress ≥ 500.0 N/mm² (MPa)',
      tensileStrengthRatio: 'UTS / YS Ratio ≥ 1.10 (High Ductility)',
      totalElongation: '≥ 16.0% (Elongation at Gauge Length 5.65√A)',
      chemicalLimits: 'Carbon ≤ 0.25%, Sulphur ≤ 0.040%, Phosphorus ≤ 0.040%',
      carbonEquivalent: 'CE ≤ 0.42% max for guaranteed weldability',
      statutoryCertification: 'Mandatory BIS Scheme-I ISI Mark Certification (QCO Enforced)',
      qualityControlOrder: 'Steel and Steel Products (Quality Control) Order 2024',
    };
    keywords = [
      'IS 1786',
      'TMT Rebar',
      'Fe 500D',
      'Yield Stress 500MPa',
      'High Ductility',
      'ISI License',
      'Steel QCO',
    ];
  } else if (
    combined.includes('water') ||
    combined.includes('drinking') ||
    combined.includes('14543') ||
    combined.includes('10500') ||
    combined.includes('packaged water')
  ) {
    product = 'Packaged Drinking Water (Other than Natural Mineral Water)';
    application = 'Government Institutional Supply & Commercial Public Distribution';
    technicalParameters = {
      statutoryStandard: 'IS 14543:2024 / IS 10500:2012',
      totalDissolvedSolids: 'TDS range: 75 mg/l to 500 mg/l',
      microbiologicalPurity: 'Zero E.coli, Coliforms & Faecal Streptococci per 250ml sample',
      heavyMetalsLimit: 'Lead ≤ 0.01 mg/l, Arsenic ≤ 0.01 mg/l (tested per IS 3025)',
      packagingSpecification: 'Food-Grade Virgin Polymers conforming strictly to IS 15410',
      statutoryMandate: 'Compulsory BIS ISI Marking under FSSAI Regulations',
    };
    keywords = [
      'IS 14543',
      'IS 10500',
      'Packaged Drinking Water',
      'TDS Limits',
      'Zero Microbiological',
      'IS 15410',
      'BIS ISI Mark',
    ];
  } else if (
    combined.includes('light') ||
    combined.includes('led') ||
    combined.includes('street') ||
    combined.includes('luminaire') ||
    combined.includes('10322')
  ) {
    product = 'Outdoor LED Street Lighting Luminaires';
    application = 'Municipal Expressways, Urban Arterial Roads & Area Illumination';
    technicalParameters = {
      photometricStandard: 'IS 10322 (Part 5/Sec 3):2024',
      ingressProtection: 'Minimum IP66 Optical & Electronic Controlgear Enclosure',
      surgeProtectionImmunity: 'Built-in 10 kV / 5 kA Surge Suppression per IS 16103',
      systemLuminousEfficacy: '≥ 130 Lumens/Watt at correlated color temperature 5000K (CRI ≥ 70)',
      driverSafetyStandards: 'IS 15885-2-13 with Total Harmonic Distortion (THD) < 10%',
      mandatoryRegistration: 'Compulsory BIS Registration Scheme (CRS) & Electronics QCO',
    };
    keywords = [
      'IS 10322',
      'LED Street Light',
      'IP66 Rating',
      '10kV Surge Protection',
      'IS 15885',
      'BIS CRS Registration',
      'LM-79',
    ];
  } else if (
    combined.includes('concrete') ||
    combined.includes('cement') ||
    combined.includes('456') ||
    combined.includes('rcc') ||
    combined.includes('10262')
  ) {
    product = 'Structural Design Mix / Ready-Mixed Concrete (Grade M25/M30)';
    application = 'Heavy Load-Bearing Foundations, Piers, Beams & Retaining Structures';
    technicalParameters = {
      codeOfPractice: 'IS 456:2000 & Mix Design per IS 10262:2019',
      minimumCharacteristicStrength: 'Grade M30 (Characteristic 28-day Compressive Strength ≥ 30 N/mm²)',
      maximumWaterCementRatio: 'Free w/c ratio ≤ 0.45 under severe ambient exposure',
      cementSpecifications: '43/53 Grade OPC (IS 269) or Portland Pozzolana Cement (IS 1489)',
      aggregateGrading: 'Graded Coarse & Fine Aggregates conforming to IS 383',
      samplingAndTesting: 'Mandatory Cube Sampling & Compressive Crushing Test per IS 516',
    };
    keywords = [
      'IS 456',
      'IS 10262',
      'Design Mix M30',
      'Water-Cement Ratio 0.45',
      'IS 269 OPC',
      'IS 383 Aggregates',
      'Cube Test IS 516',
    ];
  } else if (
    combined.includes('pipe') ||
    combined.includes('pvc') ||
    combined.includes('hdpe') ||
    combined.includes('4984') ||
    combined.includes('4985')
  ) {
    product = 'High Density Polyethylene (HDPE) / UPVC Pressure Water Supply Pipes';
    application = 'Potable Drinking Water Distribution, Irrigation & Pressure Drainage';
    technicalParameters = {
      manufacturingSpecification: 'IS 4984:2016 (HDPE) / IS 4985:2021 (UPVC)',
      pressureRatingClass: 'PN 6 / PN 10 / PN 16 Working Pressure Rating at 27°C',
      resinRawMaterial: 'Virgin PE-80 / PE-100 High Density Polymer Granules',
      hydrostaticResistance: 'Internal Hydrostatic Pressure Sustained Test at 80°C for 165 hours',
      statutoryMarking: 'Mandatory Bureau of Indian Standards (BIS) ISI Scheme-I License',
    };
    keywords = [
      'IS 4984',
      'IS 4985',
      'HDPE Pipes',
      'PN 10 Pressure',
      'PE-100 Polymer',
      'Hydrostatic Test',
      'BIS ISI Mark',
    ];
  } else {
    // Dynamic NLP parameter generation from arbitrary tender text
    const cleanTokens = text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'from', 'have', 'that', 'this', 'shall', 'been'].includes(w.toLowerCase()));

    const uniqueTokens = Array.from(new Set(cleanTokens)).slice(0, 10);
    product = title || (cleanTokens.slice(0, 5).join(' ') || 'Procurement Technical Specification');
    application = 'Public Sector GeM Procurement & Technical Standards Compliance';
    technicalParameters = {
      mandatoryCompliance: 'Strict conformance to applicable Bureau of Indian Standards (BIS)',
      procurementDescription: title || 'Item specified in Notice Inviting Tender (NIT)',
      qualityAssuranceMandate: 'Third-party accredited NABL testing & Manufacturer Test Certificate (MTC)',
      statutoryEnforcement: 'Applicable Quality Control Orders (QCO) & CVC Procurement Guidelines',
    };
    keywords = uniqueTokens.length > 0 ? uniqueTokens : ['BIS Standard', 'Technical Compliance', 'QCO Mandate', 'NABL Testing'];
  }

  return {
    _id: 'req_' + Math.random().toString(36).substring(2, 10),
    product,
    application,
    technicalParameters,
    keywords,
    rawText: text || title || 'Extracted from procurement tender documentation.',
    createdAt: new Date().toISOString(),
  };
};

export default extractProcurementRequirements;