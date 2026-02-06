export interface Service {
  id: string;
  nameEs: string;
  nameEn: string;
  duration: string;
  price: number;
  priceNote?: { es: string; en: string };
  category: 'consultas' | 'ultrasonidos' | 'dispositivos' | 'colposcopia';
  infoKey?: string;
}

export const services: Service[] = [
  // CONSULTAS
  {
    id: 'consulta-sola',
    nameEs: 'Consulta Sola',
    nameEn: 'Consultation Only',
    duration: '45 min (1ª vez) / 30 min',
    price: 55000,
    category: 'consultas',
    infoKey: 'consulta-general',
  },
  {
    id: 'consulta-completa',
    nameEs: 'Consulta Completa (PAP y US)',
    nameEn: 'Complete Consultation (PAP & US)',
    duration: '45 min',
    price: 90000,
    category: 'consultas',
    infoKey: 'consulta-completa',
  },
  {
    id: 'completa-colpo',
    nameEs: 'Completa + Colpo',
    nameEn: 'Complete + Colpo',
    duration: '45 min',
    price: 110000,
    category: 'consultas',
    infoKey: 'consulta-completa',
  },
  {
    id: 'consulta-us',
    nameEs: 'Consulta con US',
    nameEn: 'Consultation with US',
    duration: '45 min',
    price: 80000,
    category: 'consultas',
    infoKey: 'ultrasonido-ginecologico',
  },
  {
    id: 'consulta-pap',
    nameEs: 'Consulta con PAP',
    nameEn: 'Consultation with PAP',
    duration: '45 min',
    price: 70000,
    category: 'consultas',
    infoKey: 'citologia',
  },
  {
    id: 'consulta-pap-vph',
    nameEs: 'Consulta con PAP + VPH (todo incluido)',
    nameEn: 'Consultation with PAP + HPV (all included)',
    duration: '45 min',
    price: 140000,
    category: 'consultas',
    infoKey: 'vph',
  },
  {
    id: 'completa-vph-30',
    nameEs: 'Consulta Completa más VPH (+30 años)',
    nameEn: 'Complete Consultation + HPV (+30 years)',
    duration: '45 min',
    price: 105000,
    priceNote: { es: '55+50', en: '55+50' },
    category: 'consultas',
    infoKey: 'vph',
  },
  {
    id: 'consulta-vph-30',
    nameEs: 'Consulta con VPH (+30 años)',
    nameEn: 'Consultation with HPV (+30 years)',
    duration: '45 min',
    price: 80000,
    priceNote: { es: '1ª cita / ₡65.000 seguimiento', en: '1st visit / ₡65,000 follow-up' },
    category: 'consultas',
    infoKey: 'vph',
  },
  {
    id: 'control-prenatal',
    nameEs: 'Control Prenatal',
    nameEn: 'Prenatal Care',
    duration: '45 min',
    price: 80000,
    priceNote: { es: '1ª cita / ₡65.000 seguimiento', en: '1st visit / ₡65,000 follow-up' },
    category: 'consultas',
    infoKey: 'control-prenatal',
  },
  
  // ULTRASONIDOS
  {
    id: 'us-embarazo',
    nameEs: 'Ultrasonido de Embarazo (normal)',
    nameEn: 'Pregnancy Ultrasound (normal)',
    duration: '30 min',
    price: 55000,
    category: 'ultrasonidos',
    infoKey: 'ultrasonido-embarazo',
  },
  {
    id: 'us-embarazo-3d4d',
    nameEs: 'Ultrasonido de Embarazo 3D-4D',
    nameEn: 'Pregnancy Ultrasound 3D-4D',
    duration: '30 min',
    price: 60000,
    category: 'ultrasonidos',
    infoKey: 'ultrasonido-embarazo',
  },
  {
    id: 'us-ginecologico',
    nameEs: 'Ultrasonido Ginecológico (Pélvico/Transvaginal)',
    nameEn: 'Gynecological Ultrasound (Pelvic/Transvaginal)',
    duration: '30 min',
    price: 55000,
    category: 'ultrasonidos',
    infoKey: 'ultrasonido-ginecologico',
  },
  {
    id: 'us-diu-primera',
    nameEs: 'US Control de DIU — 1ª vez post colocación',
    nameEn: 'IUD Control US — 1st post-placement',
    duration: '15 min',
    price: 27500,
    category: 'ultrasonidos',
    infoKey: 'dispositivos',
  },
  {
    id: 'us-diu-control',
    nameEs: 'Ultrasonido Control de DIU — Control después',
    nameEn: 'IUD Control Ultrasound — Follow-up',
    duration: '30 min',
    price: 50000,
    category: 'ultrasonidos',
    infoKey: 'dispositivos',
  },
  
  // COLOCACIÓN DE DISPOSITIVOS
  {
    id: 'mirena',
    nameEs: 'Mirena (8 años)',
    nameEn: 'Mirena (8 years)',
    duration: '45 min',
    price: 230000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 'jaydess',
    nameEs: 'Jaydess (3 años)',
    nameEn: 'Jaydess (3 years)',
    duration: '45 min',
    price: 230000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 't-cobre',
    nameEs: 'T de Cobre (10 años)',
    nameEn: 'Copper IUD (10 years)',
    duration: '45 min',
    price: 120000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 't-cobre-plata',
    nameEs: 'T de Cobre con Plata (5 años)',
    nameEn: 'Copper + Silver IUD (5 years)',
    duration: '45 min',
    price: 170000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 'implanon',
    nameEs: 'Colocación de Implanon',
    nameEn: 'Implanon Placement',
    duration: '45 min',
    price: 170000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 'retiro-diu',
    nameEs: 'Retiro de Dispositivo (Intrauterino)',
    nameEn: 'IUD Removal',
    duration: '30 min',
    price: 55000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 'retiro-implanon',
    nameEs: 'Retiro de Implanon',
    nameEn: 'Implanon Removal',
    duration: '30 min',
    price: 80000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 'retiro-coloca-implanon',
    nameEs: 'Retiro de Implanon y Colocación de Otro',
    nameEn: 'Implanon Removal & New Placement',
    duration: '45 min',
    price: 200000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  {
    id: 'coloca-propio',
    nameEs: 'Colocación de Dispositivo que trae la paciente',
    nameEn: 'Placement of Patient\'s Own Device',
    duration: '45 min',
    price: 120000,
    category: 'dispositivos',
    infoKey: 'dispositivos',
  },
  
  // COLPOSCOPIA
  {
    id: 'colpo-sola',
    nameEs: 'Colposcopia Sola',
    nameEn: 'Colposcopy Only',
    duration: '45 min (1ª vez) / 30 min',
    price: 60000,
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
  {
    id: 'colpo-biopsia',
    nameEs: 'Colpo + Biopsia',
    nameEn: 'Colpo + Biopsy',
    duration: '45 min (1ª vez) / 30 min',
    price: 90000,
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
  {
    id: 'colpo-vph',
    nameEs: 'Colpo + VPH',
    nameEn: 'Colpo + HPV',
    duration: '45 min (1ª vez) / 30 min',
    price: 110000,
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
  {
    id: 'completa-colpo-2',
    nameEs: 'Completa + Colpo',
    nameEn: 'Complete + Colpo',
    duration: '45 min',
    price: 110000,
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
  {
    id: 'colpo-pap-vph',
    nameEs: 'Colpo + PAP + VPH',
    nameEn: 'Colpo + PAP + HPV',
    duration: '45 min',
    price: 120000,
    priceNote: { es: '70+50', en: '70+50' },
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
  {
    id: 'tratamiento-acido',
    nameEs: 'Tratamiento de Lesiones con Ácido',
    nameEn: 'Acid Treatment for Lesions',
    duration: '45 min (1ª vez) / 15 min',
    price: 55000,
    priceNote: { es: '1ª vez / ₡30.000 siguientes', en: '1st time / ₡30,000 follow-up' },
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
  {
    id: 'cauterizacion',
    nameEs: 'Cauterización de Lesiones',
    nameEn: 'Lesion Cauterization',
    duration: '45 min',
    price: 80000,
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
  {
    id: 'leep',
    nameEs: 'LEEP',
    nameEn: 'LEEP',
    duration: '45 min',
    price: 230000,
    category: 'colposcopia',
    infoKey: 'colposcopia',
  },
];

export const serviceInfoEs: Record<string, string> = {
  'consulta-completa': `📋 **CONSULTA GINECOLÓGICA COMPLETA:**

✅ Se puede hacer SOLO si ya inició relaciones sexuales.
✅ Si no ha iniciado puede hacerse consulta con ultrasonido y para eso DEBE TENER LA VEJIGA LLENA (bastante ganas de orinar).

🔍 Se realiza la historia clínica, se toman signos vitales. Se hace el examen manual de los senos, ultrasonido ginecológico (pélvico y transvaginal, donde revisamos útero y ovarios) con su respectivo informe entregado en físico y digital, y se toma la muestra para la citología (papanicolaou) que es para tamizaje de cáncer de cuello uterino.

💰 Tiene un costo de ₡90.000. Se aconseja este chequeo anualmente.

👩‍⚕️ Si tiene 30 o más años, se recomienda además de la citología realizar la prueba de detección del VPH (virus de papiloma humano). Esta prueba tiene un costo adicional de ₡50.000 y es una prueba recomendada actualmente según nueva norma nacional para tamizaje de cáncer de cérvix (no es suficiente SOLO hacerse la citología).

📅 Si los resultados de esta prueba son negativos se hace cada 5 años. Si es positiva el manejo será individualizado para cada paciente.

📝 (Esta prueba se hace de la misma muestra que se toma para la citología)`,

  'ultrasonido-ginecologico': `🔬 **ULTRASONIDO GINECOLÓGICO:**

⚠️ Para ultrasonido ginecológico si Ud NO HA INICIADO RELACIONES SEXUALES debe tener la VEJIGA BIEN LLENA.

💧 Para eso DEBE TOMARSE 1 LITRO DE AGUA 1 HORA ANTES DE LA CITA y no orinar. De lo contrario no se podrá hacer el estudio.

📋 Se puede hacer de 2 maneras:
• **Pélvico** (por el abdomen, necesita vejiga llena)
• **Transvaginal** (imágenes más nítidas, solo si ya inició relaciones sexuales, no duele)

🩸 Se puede hacer con sangrado (regla), no hay que esperar que se quite.

📧 Los resultados se entregan en físico y también se envían al correo electrónico.

💰 Costo: ₡50.000. Si necesita consulta médica más ultrasonido: ₡80.000.`,

  'dispositivos': `💊 **DISPOSITIVOS INTRAUTERINOS E IMPLANTE:**

📌 **Mirena:** duración 8 años, costo ₡210.000
📌 **Jaydess:** duración 3 años, costo ₡210.000
📌 **T de cobre:** duración 10 años, ₡120.000
📌 **T de Cobre con plata (normal y mini):** duración 5 años, ₡170.000
📌 **Implanon (el del brazo):** duración 3 años, costo ₡170.000

💬 En la consulta se le explican las diferencias de cada dispositivo.

🗓️ Se colocan con la menstruación (cualquier día) o con prueba de embarazo negativa en mujeres que amamantan y no menstrúan.

✨ Esta colocación incluye la consulta, la explicación de efectos secundarios, aclaración de dudas, el ultrasonido antes e inmediatamente después de la colocación.

🎁 Como adicional a la promoción el ultrasonido control en 2 meses sale a mitad de precio: ₡25.000.

⚠️ Si por alguna razón no se puede colocar el dispositivo se cobraría solo la consulta y ultrasonido (₡80.000), esto pasa pocas veces pero podría pasar, y se aconsejaría sobre otro método anticonceptivo.

💊 Se recomienda venir acompañada y tomarse un analgésico de su preferencia antes del procedimiento (ibuprofeno, dalivium, enantyum).`,

  'ultrasonido-embarazo': `🤰 **ULTRASONIDO DE EMBARAZO:**

📅 El embarazo es visible por ultrasonido después de 5 semanas contadas desde el primer día de la Fecha de Última Regla.

🔍 A las 5 semanas solo vemos una bolsita de agua dentro del útero.

💓 Si queremos ver y escuchar el corazón del bebé (embrión) es preferible esperar al menos tener 7 semanas.

📊 Ultrasonidos importantes:
• **Primer trimestre:** entre las 12 y 14 semanas
• **Sexo/género con 100% seguridad:** después de las 15-16 semanas
• **Morfológico:** entre las 20 y 24 semanas
• **Siguiente recomendado:** entre las 30 y 34 semanas

💰 Costo: ₡50.000 (normal), ₡55.000 (con 3D-4D si se logran buenas imágenes).

📧 Resultados se envían por correo electrónico incluyendo imágenes y videos cortos.

👨‍👩‍👧 Puede venir acompañada de sus familiares (2-5 personas recomendado).

📷 Instagram: @dra_ekaterina_gine (historias destacadas: Bebes...)`,

  'colposcopia': `🔬 **LA COLPOSCOPIA:**

📋 Estudio para ver de manera agrandada el cuello uterino, vulva y vagina.

👩‍⚕️ Se realiza por recomendación del médico, usualmente si hay alteración de citología o prueba de VPH positiva.

⚠️ No es un estudio rutinario para todas las mujeres.

📝 El resultado de la colposcopia lo tenemos de inmediato. Si se toma biopsia, resultado en 10-15 días.

🎯 Objetivo: detectar lesiones PRE-CANCEROSAS para tratamiento oportuno.

😌 Es un estudio incómodo pero no debe ser doloroso.

💰 Costo colposcopia: ₡60.000. Biopsia adicional: ₡30.000.`,

  'citologia': `📋 **LA CITOLOGÍA (Papanicolaou):**

👩 Se realiza a las mujeres a partir de los 20 años, si ya iniciaron relaciones sexuales.

🎯 Se hace para tamizaje de cáncer de cérvix.

😌 Incómodo pero no doloroso.

✨ No es necesario estar depilada.

🩸 Se puede realizar incluso durante la menstruación (mejor sin sangrado abundante).

📅 Se recomienda de manera anual de 20 a 30 años.

👩‍⚕️ A partir de los 30 años se recomienda también prueba de detección de VPH de alto riesgo.

💰 Costo consulta con citología: ₡70.000 (incluye historia clínica, revisión de senos y ultrasonido por "barrido").
💰 Consulta completa (con ultrasonido transvaginal): ₡90.000.`,

  'vph': `🦠 **PRUEBA DE VPH:**

👩 Recomendada a partir de 30 años o más.

💰 Costo adicional de ₡50.000.

📅 Si resultados negativos se hace cada 5 años (ya no es necesario citología anual).

⚠️ Si positiva, manejo individualizado.

💉 Se recomienda la vacunación contra el VPH.

📷 Instagram: @dra_ekaterina_gine (historias destacadas: Vacuna de VPH).

📝 No se hace sola, siempre como parte de la consulta.`,

  'consulta-general': `👩‍⚕️ **CONSULTA GINECOLÓGICA:**

📋 Puede hacerse por cualquier molestia ginecológica.

✅ Incluye: historia clínica, signos vitales, examen físico.

🔍 Motivos frecuentes: asesoría anticonceptiva, trastornos de regla, dolor, sangrado, molestias vaginales.

🩸 Se puede acudir con menstruación.

💊 Si molestia vaginal: no colocarse óvulos ni cremas vaginales antes.

✨ No es indispensable depilarse la zona íntima.

💰 Costo consulta sola: ₡55.000. Con ultrasonido vaginal: ₡80.000. Consulta completa: ₡90.000.`,

  'control-prenatal': `🤰 **CONTROL DE EMBARAZO (Control Prenatal):**

📅 Consultas mensuales durante todo el embarazo.

✅ Incluye historia clínica, signos vitales, peso, revisión de laboratorios y ultrasonido con informe.

💰 Costo: ₡80.000 (primera consulta), ₡60.000 (consultas siguientes).

📋 Diferente a solo venir a ultrasonido, ya que incluye consulta médica en cada cita.

✅ Es válido llevar Control Prenatal en el Ebais y venir solo a ultrasonidos.`,
};

export const serviceInfoEn: Record<string, string> = {
  'consulta-completa': `📋 **COMPLETE GYNECOLOGICAL CONSULTATION:**

✅ Can only be done if you have already started sexual relations.
✅ If you haven't started, you can have a consultation with ultrasound, and for that you MUST HAVE A FULL BLADDER (needing to urinate).

🔍 Medical history is taken, vital signs are measured. Manual breast examination is performed, gynecological ultrasound (pelvic and transvaginal, where we check uterus and ovaries) with its respective report delivered in physical and digital format, and a sample is taken for cytology (Pap smear) which is for cervical cancer screening.

💰 Cost is ₡90,000. This checkup is recommended annually.

👩‍⚕️ If you are 30 years or older, in addition to cytology, HPV (human papillomavirus) detection test is recommended. This test has an additional cost of ₡50,000 and is currently recommended according to the new national cervical cancer screening standard (cytology ALONE is not enough).

📅 If test results are negative, it's done every 5 years. If positive, management will be individualized for each patient.

📝 (This test is done from the same sample taken for cytology)`,

  'ultrasonido-ginecologico': `🔬 **GYNECOLOGICAL ULTRASOUND:**

⚠️ For gynecological ultrasound, if you HAVE NOT STARTED SEXUAL RELATIONS, you must have a VERY FULL BLADDER.

💧 For this, you MUST DRINK 1 LITER OF WATER 1 HOUR BEFORE THE APPOINTMENT and not urinate. Otherwise, the study cannot be performed.

📋 It can be done in 2 ways:
• **Pelvic** (through the abdomen, requires full bladder)
• **Transvaginal** (clearer images, only if you've started sexual relations, not painful)

🩸 Can be done during bleeding (period), no need to wait for it to stop.

📧 Results are delivered in physical form and also sent via email.

💰 Cost: ₡50,000. If you need medical consultation plus ultrasound: ₡80,000.`,

  'dispositivos': `💊 **INTRAUTERINE DEVICES AND IMPLANT:**

📌 **Mirena:** duration 8 years, cost ₡210,000
📌 **Jaydess:** duration 3 years, cost ₡210,000
📌 **Copper IUD:** duration 10 years, ₡120,000
📌 **Copper + Silver IUD (normal and mini):** duration 5 years, ₡170,000
📌 **Implanon (arm implant):** duration 3 years, cost ₡170,000

💬 During the consultation, the differences of each device are explained.

🗓️ They are placed during menstruation (any day) or with a negative pregnancy test in breastfeeding women who don't menstruate.

✨ This placement includes the consultation, explanation of side effects, clarification of doubts, ultrasound before and immediately after placement.

🎁 As an added promotion, the follow-up ultrasound in 2 months is half price: ₡25,000.

⚠️ If for any reason the device cannot be placed, only the consultation and ultrasound (₡80,000) would be charged. This rarely happens but could occur, and advice about another contraceptive method would be given.

💊 It's recommended to come accompanied and take a painkiller of your choice before the procedure (ibuprofen, dalivium, enantyum).`,

  'ultrasonido-embarazo': `🤰 **PREGNANCY ULTRASOUND:**

📅 Pregnancy is visible by ultrasound after 5 weeks counted from the first day of the Last Menstrual Period.

🔍 At 5 weeks we only see a small water sac inside the uterus.

💓 If we want to see and hear the baby's heart (embryo), it's preferable to wait at least 7 weeks.

📊 Important ultrasounds:
• **First trimester:** between 12 and 14 weeks
• **Gender with 100% certainty:** after 15-16 weeks
• **Morphological:** between 20 and 24 weeks
• **Next recommended:** between 30 and 34 weeks

💰 Cost: ₡50,000 (normal), ₡55,000 (with 3D-4D if good images are achieved).

📧 Results are sent via email including images and short videos.

👨‍👩‍👧 You can come accompanied by your family members (2-5 people recommended).

📷 Instagram: @dra_ekaterina_gine (highlighted stories: Babies...)`,

  'colposcopia': `🔬 **COLPOSCOPY:**

📋 Study to see the cervix, vulva and vagina in an enlarged view.

👩‍⚕️ Performed by doctor's recommendation, usually if there's an abnormal cytology or positive HPV test.

⚠️ It is not a routine study for all women.

📝 Colposcopy results are available immediately. If a biopsy is taken, results in 10-15 days.

🎯 Objective: detect PRE-CANCEROUS lesions for timely treatment.

😌 It's an uncomfortable study but shouldn't be painful.

💰 Colposcopy cost: ₡60,000. Additional biopsy: ₡30,000.`,

  'citologia': `📋 **CYTOLOGY (Pap Smear):**

👩 Performed for women from 20 years old, if they've started sexual relations.

🎯 Done for cervical cancer screening.

😌 Uncomfortable but not painful.

✨ No need to be waxed/shaved.

🩸 Can be done even during menstruation (better without heavy bleeding).

📅 Recommended annually from 20 to 30 years.

👩‍⚕️ From 30 years old, high-risk HPV detection test is also recommended.

💰 Consultation with cytology cost: ₡70,000 (includes medical history, breast examination and "sweep" ultrasound).
💰 Complete consultation (with transvaginal ultrasound): ₡90,000.`,

  'vph': `🦠 **HPV TEST:**

👩 Recommended from 30 years or older.

💰 Additional cost of ₡50,000.

📅 If results are negative, it's done every 5 years (annual cytology is no longer necessary).

⚠️ If positive, individualized management.

💉 HPV vaccination is recommended.

📷 Instagram: @dra_ekaterina_gine (highlighted stories: HPV Vaccine).

📝 Not done alone, always as part of the consultation.`,

  'consulta-general': `👩‍⚕️ **GYNECOLOGICAL CONSULTATION:**

📋 Can be done for any gynecological discomfort.

✅ Includes: medical history, vital signs, physical exam.

🔍 Common reasons: contraceptive advice, period disorders, pain, bleeding, vaginal discomfort.

🩸 You can come during menstruation.

💊 If vaginal discomfort: don't apply vaginal suppositories or creams beforehand.

✨ Intimate area waxing/shaving is not required.

💰 Consultation only cost: ₡55,000. With vaginal ultrasound: ₡80,000. Complete consultation: ₡90,000.`,

  'control-prenatal': `🤰 **PREGNANCY CONTROL (Prenatal Care):**

📅 Monthly consultations throughout pregnancy.

✅ Includes medical history, vital signs, weight, lab review and ultrasound with report.

💰 Cost: ₡80,000 (first consultation), ₡60,000 (follow-up consultations).

📋 Different from just coming for an ultrasound, as it includes medical consultation at each appointment.

✅ It's valid to have Prenatal Care at the Ebais and come only for ultrasounds.`,
};

export const formatPrice = (price: number): string => {
  return `₡${price.toLocaleString('es-CR')}`;
};

export const getCategoryServices = (category: Service['category']): Service[] => {
  return services.filter(s => s.category === category);
};
