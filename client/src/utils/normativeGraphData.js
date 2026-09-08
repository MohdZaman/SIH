/**
 * Normative Standards Knowledge Graph Data & Synthesizer
 * Provides high-fidelity domain graph models for BIS standards matching
 * the backend schema (Standard, StandardRelation, Recommendation, Evidence).
 */

export const DEFAULT_IS_1786_GRAPH = {
  standard: {
    _id: '6a97111aa6f943f6d0cfda73',
    code: 'IS 1786',
    fullCode: 'IS 1786:2008 / IS 1786:1985',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification',
    version: '2008',
    status: 'ACTIVE',
    standardFamily: 'IS 1786',
    category: 'Construction & Civil Engineering',
    subcategory: 'Reinforcement Steel',
    qcoStatus: 'Mandatory BIS Certification (QCO 2024)',
  },
  nodes: [
    {
      id: 'is-1786',
      label: 'IS 1786',
      sublabel: 'Standard',
      category: 'source',
      nodeType: 'standard',
      isRoot: true,
      x: 410,
      y: 235,
      radius: 60,
      title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
      typeLabel: 'Primary BIS Product Standard',
      description:
        'Governs technical specifications, chemical compositions, and mechanical strength requirements for hot-rolled and cold-worked thermo-mechanically treated (TMT) steel reinforcement bars used in structural concrete.',
      qcoMandate:
        'Mandatory under the Steel and Steel Products (Quality Control) Order, 2024. All public works and GeM tenders must strictly require ISI marked reinforcement bars with a valid BIS licence (CM/L).',
      clauseScope:
        'Clause 4.1: Chemical limits for Carbon (0.25% max), Sulphur (0.040% max), Phosphorus (0.040% max); Clause 8: Proof stress (500 MPa min), Tensile strength / Proof stress ratio (1.10 min), Elongation (12.0% min).',
      testingMethods: [
        'IS 1608 (Part 1): Tensile testing at ambient temperature',
        'IS 1599: Metallic materials — Bend and re-bend testing',
        'IS 228 (Various Parts): Chemical analysis of carbon and alloy steels',
      ],
      evidenceRequired:
        'Manufacturer Test Certificate (MTC) containing heat number, chemical composition, and mechanical properties, alongside third-party NABL accredited laboratory test reports.',
    },
    {
      id: 'is-1608',
      label: 'IS 1608',
      sublabel: 'Test method',
      category: 'source',
      nodeType: 'test_method',
      isRoot: false,
      x: 160,
      y: 135,
      radius: 46,
      title: 'Metallic Materials — Tensile Testing at Ambient Temperature',
      typeLabel: 'Normative Test Standard',
      description:
        'Specifies the international and national standard method for tensile testing of metallic materials and defines mechanical properties like yield strength, tensile strength, and percentage elongation.',
      qcoMandate:
        'Mandated normative testing standard by BIS for verifying 0.2% proof stress and tensile properties of all steel bars under IS 1786.',
      clauseScope:
        'Section 6: Test pieces geometry and gauge length; Section 10: Determination of yield strength and proof stress; Section 11: Determination of tensile strength and percentage elongation after fracture.',
      testingMethods: [
        'Universal Testing Machine (UTM) calibrated in accordance with IS 1828 (Part 1)',
        'Extensometer measurement for accurate 0.2% non-proportional elongation evaluation',
      ],
      evidenceRequired:
        'NABL accredited tensile test curve and stress-strain certificate displaying yield, ultimate tensile strength, and total elongation at maximum force (Ag).',
    },
    {
      id: 'is-432',
      label: 'IS 432',
      sublabel: 'Standard',
      category: 'source',
      nodeType: 'standard',
      isRoot: false,
      x: 160,
      y: 330,
      radius: 46,
      title: 'Mild Steel and Medium Tensile Steel Bars for Concrete Reinforcement',
      typeLabel: 'Alternative Standard',
      description:
        'Covers requirements for plain mild steel bars and medium tensile steel bars used for concrete reinforcement. In modern procurement, IS 1786 (high-strength deformed) is preferred over plain IS 432.',
      qcoMandate:
        'Superseded in structural applications by IS 1786 high-yield deformed bars, but remains an active reference for non-critical dowels and binding ties.',
      clauseScope:
        'Part 1: Mild steel and medium tensile steel bars; Part 2: Hard-drawn steel wire fabric.',
      testingMethods: [
        'Tensile and bend tests per IS 1608 & IS 1599',
        'Tolerance on nominal mass per meter per IS 1786 standards',
      ],
      evidenceRequired:
        'Mill test report confirming yield strength of Grade I (250 MPa) or Grade II (240 MPa) plain round bars.',
    },
    {
      id: 'fe-500d',
      label: 'Fe 500D',
      sublabel: 'Material rule',
      category: 'obligation',
      nodeType: 'material_rule',
      isRoot: false,
      x: 660,
      y: 135,
      radius: 48,
      title: 'Grade Fe 500D High Ductility Reinforcement Steel',
      typeLabel: 'Technical Material Rule',
      description:
        'Grade Fe 500D is the mandatory seismic grade rebar specified by the Bureau of Indian Standards and CPWD for earthquake zones III, IV, and V, requiring superior ductility and energy absorption capacity.',
      qcoMandate:
        'Mandated in National Building Code 2016 (Part 6) and IS 13920 (Ductile Design and Detailing of Reinforced Concrete Structures subject to Seismic Forces).',
      clauseScope:
        'Minimum yield strength: 500.0 N/mm²; Minimum tensile strength: 565.0 N/mm²; Ratio of UTS/YS ≥ 1.10; Total elongation at maximum force (Ag) ≥ 5%; Elongation ≥ 16.0%.',
      testingMethods: [
        'Chemical optical emission spectrometry (OES) for carbon equivalent: CE ≤ 0.42%',
        'Mandatory re-bend test around mandrel diameter 4d for nominal sizes up to 20mm.',
      ],
      evidenceRequired:
        'Third-party NABL certificate explicitly showing chemical composition (P ≤ 0.040%, S ≤ 0.040%, P+S ≤ 0.075%) and tensile ratio exceeding 1.10.',
    },
    {
      id: 'clause-4-2',
      label: 'Clause 4.2',
      sublabel: 'Tender clause',
      category: 'obligation',
      nodeType: 'clause',
      isRoot: false,
      x: 410,
      y: 380,
      radius: 46,
      title: 'Special Procurement Condition: Steel Reinforcement Standards',
      typeLabel: 'Tender Clause Specification',
      description:
        'Model procurement condition for GeM tenders and government public works contracts stipulating strict conformance to IS 1786 with mandatory BIS ISI certification and third-party laboratory verification.',
      qcoMandate:
        'Stipulated by Ministry of Finance Procurement Policy Division (PPD) and Central Public Works Department (CPWD) Works Manual.',
      clauseScope:
        '"All steel reinforcement used in the work shall be Thermo-Mechanically Treated (TMT) bars of Grade Fe 500D conforming to IS 1786 with valid BIS license. Bidders must submit manufacturer test certificates for every consignment along with independent NABL lab test verification."',
      testingMethods: [
        'Consignment-wise random sampling (1 sample per 50 tonnes or part thereof)',
        'Independent tensile and chemical verification at government-approved NABL test facility',
      ],
      evidenceRequired:
        'GeM vendor compliance undertaking, BIS CM/L certificate copy, and certified NABL test reports prior to dispatch.',
    },
    {
      id: 'qco-2024',
      label: 'QCO 2024',
      sublabel: 'QCO / Order',
      category: 'obligation',
      nodeType: 'qco',
      isRoot: false,
      x: 660,
      y: 330,
      radius: 48,
      title: 'Steel and Steel Products (Quality Control) Order, 2024',
      typeLabel: 'Statutory Quality Control Order',
      description:
        'Statutory notification issued by the Ministry of Steel under Section 16 of the Bureau of Indian Standards Act, 2016, making BIS certification mandatory for manufacture, import, and sale of reinforcing steel.',
      qcoMandate:
        'Statutory obligation: S.O. 1294(E). Prohibition of manufacture, import, distribution, sale, or stocking of reinforcement bars without Standard Mark (ISI). Procurement of non-BIS certified steel is illegal for government bodies.',
      clauseScope:
        'Paragraph 3: Compulsory use of Standard Mark; Paragraph 4: Certification and enforcement authority granted to BIS officers and authorized inspectors.',
      testingMethods: [
        'BIS factory surveillance auditing',
        'Periodic market sampling and testing in BIS recognized laboratory network',
      ],
      evidenceRequired:
        'Valid BIS License Number (CM/L), verification via BIS e-SUVIDHA portal, and valid customs clearance certificate for imported steel billets.',
    },
    {
      id: 'nabl-cert',
      label: 'NABL cert.',
      sublabel: 'Evidence',
      category: 'evidence',
      nodeType: 'evidence',
      isRoot: false,
      x: 890,
      y: 235,
      radius: 46,
      title: 'NABL Accredited Laboratory Test Certificate',
      typeLabel: 'Audit & Compliance Evidence',
      description:
        'Formal test report issued by a National Accreditation Board for Testing and Calibration Laboratories (NABL) accredited facility in conformance with ISO/IEC 17025.',
      qcoMandate:
        'Essential evidentiary requirement for tender compliance audit, milestone payments, and statutory safety certifications.',
      clauseScope:
        'Reports verified values for proof stress, ultimate tensile strength, elongation percentage, bend/re-bend integrity, and nominal mass per meter tolerance (IS 1786 Table 1 & 2).',
      testingMethods: [
        'ISO/IEC 17025 accredited mechanical and chemical testing procedures',
        'QR-code enabled digital verification with tamper-proof laboratory stamp',
      ],
      evidenceRequired:
        'Digitally verifiable NABL test certificate matching heat batch numbers with date of testing within 30 days of site delivery.',
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'is-1786',
      target: 'is-1608',
      label: 'test method',
      category: 'source',
      relationType: 'TEST_METHOD',
      description: 'IS 1786 specifies IS 1608 as the mandatory normative standard for tensile and proof stress testing.',
    },
    {
      id: 'e2',
      source: 'is-1786',
      target: 'is-432',
      label: 'alternative',
      category: 'source',
      relationType: 'RELATED',
      description: 'IS 432 is the historical mild steel alternative standard to IS 1786 deformed reinforcement.',
    },
    {
      id: 'e3',
      source: 'is-1786',
      target: 'fe-500d',
      label: 'defines',
      category: 'obligation',
      relationType: 'MATERIAL_RULE',
      description: 'IS 1786 defines the technical specification, chemical limits, and ductility criteria for Grade Fe 500D.',
    },
    {
      id: 'e4',
      source: 'is-1786',
      target: 'qco-2024',
      label: 'regulated by',
      category: 'obligation',
      relationType: 'SAFETY',
      description: 'IS 1786 steel reinforcement is statutory regulated under the Steel Quality Control Order 2024.',
    },
    {
      id: 'e5',
      source: 'clause-4-2',
      target: 'fe-500d',
      label: 'specified in',
      category: 'obligation',
      relationType: 'NORMATIVE_REFERENCE',
      description: 'Tender Clause 4.2 specifically specifies Grade Fe 500D as the mandatory structural steel grade.',
    },
    {
      id: 'e6',
      source: 'clause-4-2',
      target: 'qco-2024',
      label: 'enforced by',
      category: 'obligation',
      relationType: 'SAFETY',
      description: 'Tender Clause 4.2 enforces mandatory statutory compliance with the Steel QCO 2024.',
    },
    {
      id: 'e7',
      source: 'qco-2024',
      target: 'nabl-cert',
      label: 'evidenced by',
      category: 'evidence',
      relationType: 'NORMATIVE_REFERENCE',
      description: 'Compliance with QCO 2024 and tender stipulations is legally evidenced by an accredited NABL test report.',
    },
  ],
};

/**
 * Builds dynamic normative graph data from backend API response or fallback standards
 */
export const buildNormativeGraphFromBackend = (backendResponse, targetCode = 'IS 1786') => {
  const normCode = (targetCode || '').toUpperCase().trim();

  // If query is for IS 1786 or related reinforcement steel, use the high-fidelity flagship graph
  if (
    normCode.includes('1786') ||
    normCode.includes('STEEL') ||
    normCode.includes('TMT') ||
    normCode.includes('REBAR')
  ) {
    if (backendResponse?.standard) {
      return {
        ...DEFAULT_IS_1786_GRAPH,
        standard: {
          ...DEFAULT_IS_1786_GRAPH.standard,
          ...backendResponse.standard,
        },
      };
    }
    return DEFAULT_IS_1786_GRAPH;
  }

  // If backend provided populated nodes and edges from StandardRelation collection:
  const rawNodes = backendResponse?.graph?.nodes || [];
  const rawEdges = backendResponse?.graph?.edges || [];
  const standard = backendResponse?.standard || {
    code: targetCode,
    title: `Indian Standard ${targetCode}`,
    version: '2024',
  };

  if (rawNodes.length > 0 && rawEdges.length > 0) {
    // Dynamically lay out nodes around the root standard
    const rootId = standard._id || 'root-node';
    const nodes = [
      {
        id: rootId,
        label: standard.code || targetCode,
        sublabel: 'Standard',
        category: 'source',
        nodeType: 'standard',
        isRoot: true,
        x: 410,
        y: 235,
        radius: 60,
        title: standard.title,
        typeLabel: 'Primary BIS Standard',
        description: standard.description || standard.title,
        qcoMandate: 'Quality Control Order compliance verified',
        clauseScope: 'Applicable BIS scope and clauses',
      },
    ];

    // Distribute subordinate nodes radially
    const angleStep = (2 * Math.PI) / rawNodes.length;
    rawNodes.forEach((rn, idx) => {
      if (rn.id === rootId) return;
      const angle = idx * angleStep;
      const distance = 260;
      const x = 410 + Math.cos(angle) * distance;
      const y = 235 + Math.sin(angle) * (distance * 0.6);

      const isTest = (rn.relationType || '').toLowerCase().includes('test');
      const isSafety = (rn.relationType || '').toLowerCase().includes('safety');

      nodes.push({
        id: rn.id,
        label: rn.code || rn.title?.slice(0, 10) || 'Normative Node',
        sublabel: isTest ? 'Test method' : isSafety ? 'Safety rule' : 'Standard',
        category: isTest ? 'source' : isSafety ? 'obligation' : 'evidence',
        nodeType: isTest ? 'test_method' : 'standard',
        isRoot: false,
        x: Math.round(x),
        y: Math.round(y),
        radius: 46,
        title: rn.title || rn.code,
        typeLabel: rn.standardFamily || 'Normative Reference',
        description: rn.description || rn.title || 'Referenced normative Indian standard.',
      });
    });

    const edges = rawEdges.map((re, idx) => ({
      id: re.id || `edge-${idx}`,
      source: re.source,
      target: re.target,
      label: (re.relationType || 'normative').toLowerCase().replace(/_/g, ' '),
      category: 'source',
      relationType: re.relationType,
    }));

    return {
      standard,
      nodes,
      edges,
    };
  }

  // Domain Synthesizer for other major BIS Standards when relations are not pre-seeded in DB:
  return generateDomainGraphForStandard(standard, targetCode);
};

/**
 * Domain generator for standards like IS 456, IS 10322, IS 6909, IS 302
 */
const generateDomainGraphForStandard = (standard, targetCode) => {
  const code = (standard.code || targetCode || 'IS 456').toUpperCase();

  if (code.includes('456')) {
    return {
      standard: {
        _id: standard._id || 'is-456',
        code: 'IS 456',
        fullCode: 'IS 456:2000',
        title: 'Plain and Reinforced Concrete — Code of Practice (Fourth Revision)',
        version: '2000',
        status: 'ACTIVE',
        standardFamily: 'IS 456',
        category: 'Construction',
      },
      nodes: [
        {
          id: 'is-456',
          label: 'IS 456',
          sublabel: 'Standard',
          category: 'source',
          isRoot: true,
          x: 410,
          y: 235,
          radius: 60,
          title: 'Plain and Reinforced Concrete — Code of Practice',
          description: 'Fundamental structural standard governing design, materials, workmanship, and testing of plain and reinforced concrete structures.',
          qcoMandate: 'Foundational standard referenced across National Building Code and Central Works manuals.',
          clauseScope: 'Section 2: Materials & Concrete mix design (M20 to M80); Section 3: General design considerations.',
        },
        {
          id: 'is-516',
          label: 'IS 516',
          sublabel: 'Test method',
          category: 'source',
          isRoot: false,
          x: 160,
          y: 135,
          radius: 46,
          title: 'Hardened Concrete — Methods of Testing (Compressive Strength)',
          description: 'Standard test methods for 28-day cube compressive strength and flexural strength of concrete.',
        },
        {
          id: 'is-383',
          label: 'IS 383',
          sublabel: 'Standard',
          category: 'source',
          isRoot: false,
          x: 160,
          y: 330,
          radius: 46,
          title: 'Coarse and Fine Aggregate for Concrete — Specification',
          description: 'Specification for natural, manufactured, and recycled coarse and fine aggregates used in concrete production.',
        },
        {
          id: 'grade-m30',
          label: 'Grade M30',
          sublabel: 'Material rule',
          category: 'obligation',
          isRoot: false,
          x: 660,
          y: 135,
          radius: 48,
          title: 'Minimum Characteristic Strength: 30 MPa at 28 Days',
          description: 'Mandatory structural concrete grade for reinforced structural elements exposed to severe environmental conditions.',
        },
        {
          id: 'clause-5-1',
          label: 'Clause 5.1',
          sublabel: 'Tender clause',
          category: 'obligation',
          isRoot: false,
          x: 410,
          y: 380,
          radius: 46,
          title: 'Mix Design & Workmanship Specification',
          description: 'Tender clause requiring design mix concrete per IS 10262 with minimum cement content and water-cement ratio.',
        },
        {
          id: 'qco-concrete',
          label: 'QCO 2024',
          sublabel: 'QCO / Order',
          category: 'obligation',
          isRoot: false,
          x: 660,
          y: 330,
          radius: 48,
          title: 'Cement & Aggregates Mandatory Quality Control Orders',
          description: 'Mandatory BIS certification for all constituent hydraulic cements conforming to IS 269/IS 8112/IS 12269.',
        },
        {
          id: 'nabl-cube',
          label: 'NABL cert.',
          sublabel: 'Evidence',
          category: 'evidence',
          isRoot: false,
          x: 890,
          y: 235,
          radius: 46,
          title: '28-Day Concrete Cube Test Certificate',
          description: 'NABL lab certified crushing strength verification report with statistical compliance per Table 11 of IS 456.',
        },
      ],
      edges: [
        { id: 'e1', source: 'is-456', target: 'is-516', label: 'test method', category: 'source' },
        { id: 'e2', source: 'is-456', target: 'is-383', label: 'alternative', category: 'source' },
        { id: 'e3', source: 'is-456', target: 'grade-m30', label: 'defines', category: 'obligation' },
        { id: 'e4', source: 'is-456', target: 'qco-concrete', label: 'regulated by', category: 'obligation' },
        { id: 'e5', source: 'clause-5-1', target: 'grade-m30', label: 'specified in', category: 'obligation' },
        { id: 'e6', source: 'clause-5-1', target: 'qco-concrete', label: 'enforced by', category: 'obligation' },
        { id: 'e7', source: 'qco-concrete', target: 'nabl-cube', label: 'evidenced by', category: 'evidence' },
      ],
    };
  }

  if (code.includes('10322')) {
    return {
      standard: {
        _id: standard._id || 'is-10322',
        code: 'IS 10322',
        fullCode: 'IS 10322 (Part 5/Sec 3):2012',
        title: 'Luminaires: Part 5 Particular Requirements, Section 3 Luminaires for Road and Street Lighting',
        version: '2012',
        status: 'ACTIVE',
        standardFamily: 'IS 10322',
        category: 'Electronics & Lighting',
      },
      nodes: [
        {
          id: 'is-10322',
          label: 'IS 10322',
          sublabel: 'Standard',
          category: 'source',
          isRoot: true,
          x: 410,
          y: 235,
          radius: 60,
          title: 'Luminaires for Road and Street Lighting',
          description: 'Comprehensive Indian standard specifying electrical safety, ingress protection (IP66), and structural thermal limits for outdoor luminaires.',
        },
        {
          id: 'is-16102',
          label: 'IS 16102',
          sublabel: 'Test method',
          category: 'source',
          isRoot: false,
          x: 160,
          y: 135,
          radius: 46,
          title: 'Self-Ballasted LED Lamps for General Lighting Services',
          description: 'Performance and safety test methods for LED light sources and electrical drivers.',
        },
        {
          id: 'is-12063',
          label: 'IS 12063',
          sublabel: 'Standard',
          category: 'source',
          isRoot: false,
          x: 160,
          y: 330,
          radius: 46,
          title: 'Classification of Degrees of Protection Provided by Enclosures (IP Code)',
          description: 'Specifies ingress protection testing for dust tightness and high-pressure water jet resistance.',
        },
        {
          id: 'ip66-rule',
          label: 'IP66 Spec',
          sublabel: 'Material rule',
          category: 'obligation',
          isRoot: false,
          x: 660,
          y: 135,
          radius: 48,
          title: 'IP66 & Surge Protection: 10kV / 5kA Rule',
          description: 'Mandatory environmental and surge protection requirement for municipal road and highway streetlights.',
        },
        {
          id: 'clause-3-4',
          label: 'Clause 3.4',
          sublabel: 'Tender clause',
          category: 'obligation',
          isRoot: false,
          x: 410,
          y: 380,
          radius: 46,
          title: 'Municipal Streetlighting Technical Clause',
          description: 'Tender clause specifying luminaire efficacy > 120 lm/W, CRI > 70, CCT 4000K-5700K with BIS registration.',
        },
        {
          id: 'qco-cro',
          label: 'QCO 2024',
          sublabel: 'QCO / Order',
          category: 'obligation',
          isRoot: false,
          x: 660,
          y: 330,
          radius: 48,
          title: 'Electronics & IT Goods (Compulsory Registration) Order',
          description: 'MeitY & BIS CRO mandate: Fixed LED luminaires must be registered under BIS CRS scheme.',
        },
        {
          id: 'nabl-photometry',
          label: 'NABL cert.',
          sublabel: 'Evidence',
          category: 'evidence',
          isRoot: false,
          x: 890,
          y: 235,
          radius: 46,
          title: 'NABL Photometric & Electrical Test Report',
          description: 'Type test report verifying LM-79 luminous flux, chromaticity, and harmonic distortion (THD < 10%).',
        },
      ],
      edges: [
        { id: 'e1', source: 'is-10322', target: 'is-16102', label: 'test method', category: 'source' },
        { id: 'e2', source: 'is-10322', target: 'is-12063', label: 'alternative', category: 'source' },
        { id: 'e3', source: 'is-10322', target: 'ip66-rule', label: 'defines', category: 'obligation' },
        { id: 'e4', source: 'is-10322', target: 'qco-cro', label: 'regulated by', category: 'obligation' },
        { id: 'e5', source: 'clause-3-4', target: 'ip66-rule', label: 'specified in', category: 'obligation' },
        { id: 'e6', source: 'clause-3-4', target: 'qco-cro', label: 'enforced by', category: 'obligation' },
        { id: 'e7', source: 'qco-cro', target: 'nabl-photometry', label: 'evidenced by', category: 'evidence' },
      ],
    };
  }

  // Generic standard synthesis
  return {
    standard: {
      _id: standard._id || 'std-root',
      code: standard.code || targetCode,
      fullCode: standard.code || targetCode,
      title: standard.title || `Indian Standard ${targetCode}`,
      version: standard.version || '2024',
      status: 'ACTIVE',
      standardFamily: standard.code || targetCode,
      category: standard.category || 'Standards',
    },
    nodes: [
      {
        id: 'std-root',
        label: standard.code || targetCode,
        sublabel: 'Standard',
        category: 'source',
        isRoot: true,
        x: 410,
        y: 235,
        radius: 60,
        title: standard.title || `Indian Standard ${targetCode}`,
        description: standard.description || standard.title || 'National standard published by Bureau of Indian Standards.',
      },
      {
        id: 'test-method-std',
        label: 'IS Test',
        sublabel: 'Test method',
        category: 'source',
        isRoot: false,
        x: 160,
        y: 135,
        radius: 46,
        title: 'Normative Testing Protocol',
        description: 'Mandatory sampling and laboratory testing protocol.',
      },
      {
        id: 'related-std',
        label: 'Alt IS',
        sublabel: 'Standard',
        category: 'source',
        isRoot: false,
        x: 160,
        y: 330,
        radius: 46,
        title: 'Referenced Cross Standard',
        description: 'Normative standard referenced in clauses and test methods.',
      },
      {
        id: 'rule-spec',
        label: 'Rule Spec',
        sublabel: 'Material rule',
        category: 'obligation',
        isRoot: false,
        x: 660,
        y: 135,
        radius: 48,
        title: 'Statutory Technical Parameter',
        description: 'Mandatory physical, chemical, or performance threshold.',
      },
      {
        id: 'clause-spec',
        label: 'Clause 1.1',
        sublabel: 'Tender clause',
        category: 'obligation',
        isRoot: false,
        x: 410,
        y: 380,
        radius: 46,
        title: 'Procurement Specification Clause',
        description: 'Government procurement tender clause enforcing standard compliance.',
      },
      {
        id: 'qco-mandate',
        label: 'QCO Order',
        sublabel: 'QCO / Order',
        category: 'obligation',
        isRoot: false,
        x: 660,
        y: 330,
        radius: 48,
        title: 'Statutory Quality Control Order',
        description: 'Official Gazette QCO notification making BIS standard mandatory.',
      },
      {
        id: 'nabl-evidence',
        label: 'NABL cert.',
        sublabel: 'Evidence',
        category: 'evidence',
        isRoot: false,
        x: 890,
        y: 235,
        radius: 46,
        title: 'Accredited NABL Test Report',
        description: 'Valid test evidence from NABL accredited testing laboratory.',
      },
    ],
    edges: [
      { id: 'e1', source: 'std-root', target: 'test-method-std', label: 'test method', category: 'source' },
      { id: 'e2', source: 'std-root', target: 'related-std', label: 'alternative', category: 'source' },
      { id: 'e3', source: 'std-root', target: 'rule-spec', label: 'defines', category: 'obligation' },
      { id: 'e4', source: 'std-root', target: 'qco-mandate', label: 'regulated by', category: 'obligation' },
      { id: 'e5', source: 'clause-spec', target: 'rule-spec', label: 'specified in', category: 'obligation' },
      { id: 'e6', source: 'clause-spec', target: 'qco-mandate', label: 'enforced by', category: 'obligation' },
      { id: 'e7', source: 'qco-mandate', target: 'nabl-evidence', label: 'evidenced by', category: 'evidence' },
    ],
  };
};