import embarazadaImg from '@/assets/embarazada.png';
import ecoUteroImg from '@/assets/eco-utero.png';
import ecografiaImg from '@/assets/ecografia.png';
import consultaImg from '@/assets/consulta.png';
import citologiaImg from '@/assets/citologia.png';
import dispositivoImg from '@/assets/dispositivo.png';

export interface ServiceNode {
  type: 'service';
  serviceId: string;
}

export interface ChoiceOption {
  labelEs: string;
  labelEn: string;
  icon?: string;
  next: TreeNode;
}

export interface QuestionNode {
  type: 'question';
  id: string;
  questionEs: string;
  questionEn: string;
  icon?: string;
  choices: ChoiceOption[];
}

export type TreeNode = QuestionNode | ServiceNode;

// ─── ULTRASONIDO sub-trees ────────────────────────────────────────────────────

const us_embarazada_si: QuestionNode = {
  type: 'question',
  id: 'us-embarazada-si',
  questionEs: '¿Qué necesitas?',
  questionEn: 'What do you need?',
  choices: [
    {
      labelEs: 'Consulta + Ultrasonido',
      labelEn: 'Consultation + Ultrasound',
      next: { type: 'service', serviceId: 'control-prenatal' },
    },
    {
      labelEs: 'Ultrasonido en 3D y 4D',
      labelEn: '3D and 4D Ultrasound',
      next: { type: 'service', serviceId: 'us-embarazo-3d4d' },
    },
    {
      labelEs: 'Ultrasonido de embarazo (normal)',
      labelEn: 'Pregnancy Ultrasound (normal)',
      next: { type: 'service', serviceId: 'us-embarazo' },
    },
  ],
};

const us_seguimiento_diu: QuestionNode = {
  type: 'question',
  id: 'us-seguimiento-diu',
  questionEs: '¿Qué tipo de seguimiento necesitas?',
  questionEn: 'What type of follow-up do you need?',
  choices: [
    {
      labelEs: 'Ultrasonido de control de DIU — 1ª vez post colocación',
      labelEn: 'IUD Control Ultrasound — 1st post-placement',
      next: { type: 'service', serviceId: 'us-diu-primera' },
    },
    {
      labelEs: 'Ultrasonido Control de DIU — Control después',
      labelEn: 'IUD Control Ultrasound — Follow-up',
      next: { type: 'service', serviceId: 'us-diu-control' },
    },
  ],
};

const us_embarazada_no: QuestionNode = {
  type: 'question',
  id: 'us-embarazada-no',
  questionEs: '¿Qué tipo de ultrasonido necesitas?',
  questionEn: 'What type of ultrasound do you need?',
  choices: [
    {
      labelEs: 'Ultrasonido ginecológico pélvico',
      labelEn: 'Pelvic gynecological ultrasound',
      next: { type: 'service', serviceId: 'us-ginecologico' },
    },
    {
      labelEs: 'Ultrasonido ginecológico transvaginal',
      labelEn: 'Transvaginal gynecological ultrasound',
      next: { type: 'service', serviceId: 'us-ginecologico' },
    },
    {
      labelEs: 'Ultrasonido ginecológico + consulta',
      labelEn: 'Gynecological ultrasound + consultation',
      next: { type: 'service', serviceId: 'consulta-us' },
    },
    {
      labelEs: 'Seguimiento de dispositivo intrauterino',
      labelEn: 'Intrauterine device follow-up',
      next: us_seguimiento_diu,
    },
  ],
};

const us_embarazada: QuestionNode = {
  type: 'question',
  id: 'us-embarazada',
  questionEs: '¿Está embarazada?',
  questionEn: 'Are you pregnant?',
  icon: embarazadaImg,
  choices: [
    {
      labelEs: 'Sí, estoy embarazada',
      labelEn: 'Yes, I am pregnant',
      next: us_embarazada_si,
    },
    {
      labelEs: 'No estoy embarazada o no lo sé',
      labelEn: 'I am not pregnant or I don\'t know',
      next: us_embarazada_no,
    },
  ],
};

// ─── CONSULTA sub-trees ───────────────────────────────────────────────────────

const control_ginecologico: QuestionNode = {
  type: 'question',
  id: 'control-ginecologico',
  questionEs: '¿Qué deseas incluir en tu consulta?',
  questionEn: 'What would you like included in your consultation?',
  choices: [
    {
      labelEs: 'Con Ultrasonido (- 20 años)',
      labelEn: 'With Ultrasound (under 20)',
      next: { type: 'service', serviceId: 'consulta-us' },
    },
    {
      labelEs: 'Con Citología (+ 20 años)',
      labelEn: 'With Cytology (over 20)',
      next: { type: 'service', serviceId: 'consulta-pap' },
    },
    {
      labelEs: 'Con Citología + Ultrasonido (+ 20 años)',
      labelEn: 'With Cytology + Ultrasound (over 20)',
      next: { type: 'service', serviceId: 'consulta-completa' },
    },
    {
      labelEs: 'Con Citología + Prueba de VPH (+30 años)',
      labelEn: 'With Cytology + HPV Test (over 30)',
      next: { type: 'service', serviceId: 'consulta-pap-vph' },
    },
    {
      labelEs: 'Con Citología + Ultrasonido + Prueba de VPH (+30 años)',
      labelEn: 'With Cytology + Ultrasound + HPV Test (over 30)',
      next: { type: 'service', serviceId: 'completa-vph-30' },
    },
    {
      labelEs: 'Citología + Ultrasonido + Colposcopía',
      labelEn: 'Cytology + Ultrasound + Colposcopy',
      next: { type: 'service', serviceId: 'completa-colpo' },
    },
  ],
};

const control_prenatal: QuestionNode = {
  type: 'question',
  id: 'control-prenatal',
  questionEs: '¿Qué tipo de control prenatal necesitas?',
  questionEn: 'What type of prenatal care do you need?',
  choices: [
    {
      labelEs: 'Consulta + Ultrasonido (1ª vez)',
      labelEn: 'Consultation + Ultrasound (1st time)',
      next: { type: 'service', serviceId: 'control-prenatal' },
    },
    {
      labelEs: 'Consulta + Ultrasonido de seguimiento mensual',
      labelEn: 'Consultation + Monthly follow-up ultrasound',
      next: { type: 'service', serviceId: 'control-prenatal' },
    },
  ],
};

const presenta_malestar: QuestionNode = {
  type: 'question',
  id: 'presenta-malestar',
  questionEs: '¿Qué deseas incluir en tu consulta?',
  questionEn: 'What would you like included in your consultation?',
  choices: [
    {
      labelEs: 'Consulta',
      labelEn: 'Consultation',
      next: { type: 'service', serviceId: 'consulta-sola' },
    },
    {
      labelEs: 'Consulta + Ultrasonido',
      labelEn: 'Consultation + Ultrasound',
      next: { type: 'service', serviceId: 'consulta-us' },
    },
    {
      labelEs: 'Consulta con Citología + Ultrasonido (+ 20 años)',
      labelEn: 'Consultation with Cytology + Ultrasound (over 20)',
      next: { type: 'service', serviceId: 'consulta-completa' },
    },
    {
      labelEs: 'Consulta con Citología + Ultrasonido + Prueba de VPH (+30 años)',
      labelEn: 'Consultation with Cytology + Ultrasound + HPV Test (over 30)',
      next: { type: 'service', serviceId: 'completa-vph-30' },
    },
    {
      labelEs: 'Consulta con VPH (+30 años)',
      labelEn: 'Consultation with HPV Test (over 30)',
      next: { type: 'service', serviceId: 'consulta-vph-30' },
    },
  ],
};

const citologia_alterada: QuestionNode = {
  type: 'question',
  id: 'citologia-alterada',
  questionEs: '¿Qué procedimiento te indicaron?',
  questionEn: 'What procedure were you recommended?',
  choices: [
    {
      labelEs: 'Colposcopía Sola',
      labelEn: 'Colposcopy Only',
      next: { type: 'service', serviceId: 'colpo-sola' },
    },
    {
      labelEs: 'Colposcopía + Biopsia',
      labelEn: 'Colposcopy + Biopsy',
      next: { type: 'service', serviceId: 'colpo-biopsia' },
    },
    {
      labelEs: 'Colposcopía + Prueba de VPH',
      labelEn: 'Colposcopy + HPV Test',
      next: { type: 'service', serviceId: 'colpo-vph' },
    },
    {
      labelEs: 'Colposcopía + Citología + Prueba de VPH',
      labelEn: 'Colposcopy + Cytology + HPV Test',
      next: { type: 'service', serviceId: 'colpo-pap-vph' },
    },
    {
      labelEs: 'LEEP',
      labelEn: 'LEEP',
      next: { type: 'service', serviceId: 'leep' },
    },
  ],
};

const metodos_consulta_orientacion: QuestionNode = {
  type: 'question',
  id: 'metodos-consulta-orientacion',
  questionEs: '¿Qué deseas incluir en tu consulta de orientación?',
  questionEn: 'What would you like included in your orientation consultation?',
  choices: [
    {
      labelEs: 'Consulta',
      labelEn: 'Consultation',
      next: { type: 'service', serviceId: 'consulta-sola' },
    },
    {
      labelEs: 'Con Citología (+ 20 años)',
      labelEn: 'With Cytology (over 20)',
      next: { type: 'service', serviceId: 'consulta-pap' },
    },
    {
      labelEs: 'Con Ultrasonido',
      labelEn: 'With Ultrasound',
      next: { type: 'service', serviceId: 'consulta-us' },
    },
    {
      labelEs: 'Con Citología + Ultrasonido',
      labelEn: 'With Cytology + Ultrasound',
      next: { type: 'service', serviceId: 'consulta-completa' },
    },
  ],
};

const metodos_colocacion: QuestionNode = {
  type: 'question',
  id: 'metodos-colocacion',
  questionEs: '¿Qué dispositivo deseas colocar?',
  questionEn: 'Which device would you like to have placed?',
  choices: [
    {
      labelEs: 'Colocación de Implanon',
      labelEn: 'Implanon Placement',
      next: { type: 'service', serviceId: 'implanon' },
    },
    {
      labelEs: 'Mirena (8 años)',
      labelEn: 'Mirena (8 years)',
      next: { type: 'service', serviceId: 'mirena' },
    },
    {
      labelEs: 'Jaydess (3 años)',
      labelEn: 'Jaydess (3 years)',
      next: { type: 'service', serviceId: 'jaydess' },
    },
    {
      labelEs: 'T de Cobre (10 años)',
      labelEn: 'Copper IUD (10 years)',
      next: { type: 'service', serviceId: 't-cobre' },
    },
    {
      labelEs: 'T de Cobre con Plata (5 años)',
      labelEn: 'Copper + Silver IUD (5 years)',
      next: { type: 'service', serviceId: 't-cobre-plata' },
    },
    {
      labelEs: 'Colocación de Dispositivo que trae la paciente',
      labelEn: 'Placement of Patient\'s Own Device',
      next: { type: 'service', serviceId: 'coloca-propio' },
    },
  ],
};

const metodos_retiro: QuestionNode = {
  type: 'question',
  id: 'metodos-retiro',
  questionEs: '¿Qué dispositivo deseas retirar?',
  questionEn: 'Which device would you like removed?',
  choices: [
    {
      labelEs: 'Retiro de Implanon',
      labelEn: 'Implanon Removal',
      next: { type: 'service', serviceId: 'retiro-implanon' },
    },
    {
      labelEs: 'Retiro de Dispositivo Intrauterino',
      labelEn: 'IUD Removal',
      next: { type: 'service', serviceId: 'retiro-diu' },
    },
    {
      labelEs: 'Retiro de Implanon y colocación de otro Implanon',
      labelEn: 'Implanon Removal & New Placement',
      next: { type: 'service', serviceId: 'retiro-coloca-implanon' },
    },
  ],
};

const metodos_seguimiento_diu: QuestionNode = {
  type: 'question',
  id: 'metodos-seguimiento-diu',
  questionEs: '¿Qué tipo de seguimiento necesitas?',
  questionEn: 'What type of follow-up do you need?',
  choices: [
    {
      labelEs: 'Ultrasonido de control de DIU — 1ª vez post colocación',
      labelEn: 'IUD Control Ultrasound — 1st post-placement',
      next: { type: 'service', serviceId: 'us-diu-primera' },
    },
    {
      labelEs: 'Ultrasonido Control de DIU — Control después',
      labelEn: 'IUD Control Ultrasound — Follow-up',
      next: { type: 'service', serviceId: 'us-diu-control' },
    },
  ],
};

const metodos_anticonceptivos: QuestionNode = {
  type: 'question',
  id: 'metodos-anticonceptivos',
  questionEs: '¿Qué necesitas?',
  questionEn: 'What do you need?',
  choices: [
    {
      labelEs: 'Consulta de orientación',
      labelEn: 'Orientation Consultation',
      next: metodos_consulta_orientacion,
    },
    {
      labelEs: 'Colocación de dispositivos',
      labelEn: 'Device Placement',
      next: metodos_colocacion,
    },
    {
      labelEs: 'Retiro de dispositivos',
      labelEn: 'Device Removal',
      next: metodos_retiro,
    },
    {
      labelEs: 'Seguimiento de dispositivo intrauterino',
      labelEn: 'Intrauterine device follow-up',
      next: metodos_seguimiento_diu,
    },
  ],
};

const consulta_motivo: QuestionNode = {
  type: 'question',
  id: 'consulta-motivo',
  questionEs: '¿Cuál es el motivo de tu visita?',
  questionEn: 'What is the reason for your visit?',
  choices: [
    {
      labelEs: 'Control ginecológico',
      labelEn: 'Gynecological checkup',
      icon: ecoUteroImg,
      next: control_ginecologico,
    },
    {
      labelEs: 'Control prenatal',
      labelEn: 'Prenatal care',
      icon: ecografiaImg,
      next: control_prenatal,
    },
    {
      labelEs: 'Presenta algún malestar',
      labelEn: 'I have a health concern',
      icon: consultaImg,
      next: presenta_malestar,
    },
    {
      labelEs: 'Por citología alterada',
      labelEn: 'Abnormal cytology result',
      icon: citologiaImg,
      next: citologia_alterada,
    },
    {
      labelEs: 'Métodos anticonceptivos',
      labelEn: 'Contraceptive methods',
      icon: dispositivoImg,
      next: metodos_anticonceptivos,
    },
  ],
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export const decisionTree: QuestionNode = {
  type: 'question',
  id: 'root',
  questionEs: '¿Qué tipo de servicio necesitas?',
  questionEn: 'What type of service do you need?',
  choices: [
    {
      labelEs: 'Ultrasonido',
      labelEn: 'Ultrasound',
      icon: ecografiaImg,
      next: us_embarazada,
    },
    {
      labelEs: 'Consulta',
      labelEn: 'Consultation',
      icon: consultaImg,
      next: consulta_motivo,
    },
  ],
};
