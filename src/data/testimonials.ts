export interface Testimonial {
  id: number;
  name: string;
  textEs: string;
  textEn: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Daniela A.',
    textEs: 'Quiero recomendar ampliamente a la doctora Ekaterina. Es una profesional con una trayectoria sólida, vasta experiencia y un dominio excepcional de su campo. Sin embargo, lo que realmente la distingue es su calidad humana: su trato empático, cercano y lleno de sensibilidad. Con ella no solo se siente la seguridad de estar en manos expertas, sino también la tranquilidad de ser escuchada, comprendida y acompañada. Sus consultas van más allá de lo meramente médico; integra la parte emocional, psicológica y humana de una manera natural y respetuosa. Con la doctora se vive una experiencia cálida, confiable y amena, que brinda paz y confianza desde el primer momento.',
    textEn: 'I want to highly recommend Dr. Ekaterina. She is a professional with a solid track record, vast experience, and an exceptional command of her field. However, what truly sets her apart is her human quality: her empathetic, warm, and deeply sensitive approach. With her, you not only feel the assurance of being in expert hands, but also the peace of mind of being heard, understood, and accompanied. Her consultations go beyond the purely medical; she integrates the emotional, psychological, and human aspects in a natural and respectful way. With the doctor, you experience a warm, trustworthy, and pleasant visit that brings peace and confidence from the very first moment.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Noelia',
    textEs: 'Me realicé un ultrasonido a mis 16 semanas de embarazo con la doctora, el trato es excelente, me sentí súper cómoda durante toda la consulta. Mi bebé estaba dormida, de espalda, con las piernas cruzadas y el cordón en medio de las piernas y ella  hizo todo lo posible por revisarla bien y ver el sexo. Me dio un 80% de probabilidades de que era niña y lo acertó. Actualmente mi hija tiene 11 meses. Excelente profesional, a veces tengo algunas dudas que le realizo por mensaje y siempre me responde.',
    textEn: 'I had an ultrasound at 16 weeks of pregnancy with the doctor, the care is excellent, I felt super comfortable throughout the entire appointment. My baby was asleep, on her back, with her legs crossed and the cord between her legs, and she did everything possible to check her well and see the gender. She gave me an 80% chance it was a girl, and she got it right. My daughter is currently 11 months old. Excellent professional — sometimes I have questions that I send her by message and she always responds.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Fabiola',
    textEs: 'Considero que es la mejor aquí en la zona en gine, a parte de que es una excelente profesional, su forma de ser hace que uno se sienta con muchísima confianza y eso refleja mucho el amor que le tiene a su profesión 💖',
    textEn: 'I consider her the best gynecologist in the area. Besides being an excellent professional, her personality makes you feel so much trust, and that really reflects the love she has for her profession 💖',
    rating: 5,
  },
  {
    id: 4,
    name: 'Meli',
    textEs: 'Iba a la misma ginecóloga desde mis 18 años (hoy tengo 29), pero desde la semana 14 de mi embarazo comencé mi control con la Dra. Ekaterina y, sinceramente, ha sido una experiencia completamente distinta. Desde el primer día tanto mi esposo como yo nos hemos sentido sumamente bien y, sobre todo, escuchados y entendidos. En una etapa tan importante y sensible, la calidez y la empatía hacen toda la diferencia. La doctora tiene una forma muy especial de acompañar este proceso: nos explica cada detalle en los ultrasonidos, responde nuestras dudas con paciencia y nos hace sentir parte de cada momento. Eso para nosotros no tiene precio. Estamos demasiado agradecidos y siempre que puedo, la recomiendo con total confianza 🩷💐',
    textEn: 'I had been going to the same gynecologist since I was 18 (I\'m 29 now), but from week 14 of my pregnancy I started my care with Dr. Ekaterina, and honestly, it has been a completely different experience. From the very first day, both my husband and I have felt incredibly well, and above all, heard and understood. In such an important and sensitive stage, warmth and empathy make all the difference. The doctor has a very special way of accompanying this process: she explains every detail in the ultrasounds, answers our questions with patience, and makes us feel part of every moment. For us, that is priceless. We are so grateful, and whenever I can, I recommend her with total confidence 🩷💐',
    rating: 5,
  },
  {
    id: 5,
    name: 'Noelia Urpí',
    textEs: 'Desde el primer momento supe que estaba en las mejores manos. La doctora no solo es una excelente profesional, sino una persona con una calidad humana increíble. Tuve la bendición de conocerla antes de mi embarazo, y gracias a ella viví todo el proceso con muchísima tranquilidad y confianza. Cada cita era un momento especial. Ver a mi bebé crecer mes a mes y escuchar sus explicaciones tan detalladas nos llenaba el corazón de alegría y paz. Siempre nos hizo sentir acompañados, escuchados y seguros. La cesárea fue una experiencia muy positiva para mí. Gracias a Dios no tuve ninguna complicación, y el cuidado y seguimiento que la doctora me dio después fue impecable. Se preocupó por mí en todo momento, no solo como paciente, sino como persona. Estoy profundamente agradecida por haberla tenido en una etapa tan importante de mi vida. Sin duda la recomiendo con el corazón a cualquier futura mamá que quiera vivir su embarazo con confianza, calma y acompañamiento verdadero.',
    textEn: 'From the very first moment, I knew I was in the best hands. The doctor is not only an excellent professional but also a person with incredible compassion. I was blessed to meet her before my pregnancy, and thanks to her, I experienced the entire process with immense peace of mind and confidence. Every appointment was a special moment. Watching my baby grow month by month and listening to her detailed explanations filled our hearts with joy and peace. She always made us feel supported, heard, and safe. The cesarean section was a very positive experience for me. Thank God I had no complications, and the care and follow-up the doctor provided afterward was impeccable. She cared for me at all times, not only as a patient but as a person. I am deeply grateful to have had her during such an important stage of my life. I wholeheartedly recommend her to any expectant mother who wants to experience her pregnancy with confidence, calm, and genuine support.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Paola',
    textEs: 'Yo me hice 3 ultrasonidos. 14 semanas, 25 semanas, 34 semanas. Y quedamos encantados con el trato, el amor que le tiene a los bebés. Nos dio tranquilidad, seguridad y paz, todo lo explicas súper bien, revisa súper bien a los bebés 🥹 Sin duda alguna para mí es la mejor ginecóloga.',
    textEn: 'I had 3 ultrasounds: 14 weeks, 25 weeks, 34 weeks. And we were delighted with the care, the love she has for babies. She gave us peace of mind, security, and tranquility — you explain everything so well, she check the babies so thoroughly 🥹 Without a doubt, for me she is the best gynecologist.',
    rating: 5,
  },
  {
    id: 7,
    name: 'J.S.Z',
    textEs: 'La doc es un angel en esta tierra, ella me ayudo y estuvo cuando más la necesité en mi embarazo, ella descubrió que mi bebe venía con cositas, siempre me dio palabra de aliento me apoyó en todo lo que pudo, simpre trató de explicarme todo lo mejor que pudo para que entendiera todo, simplemente una profesional excepcional con su trabajo.',
    textEn: 'The doc is an angel on this earth — she helped me and was there when I needed her most during my pregnancy. She discovered that my baby had some issues, she always gave me words of encouragement, supported me in every way she could, and always tried to explain everything as best as possible so I could understand. Simply an exceptional professional in her work.',
    rating: 5,
  },
  {
    id: 8,
    name: 'T. R.',
    textEs: 'La súper recomiendo, excelente trato, súper paciente, un ser hermoso. Atendió mi primer embarazo y ahora deseo que lo haga en mi segundo. No he tenido la oportunidad de ir, pero si ustedes sí la tienen, créanme que no se van a arrepentir. Ya estoy deseando sacar mi cita para ver a mi bebé en las mejores manos.❤️',
    textEn: 'I highly recommend her — excellent care, super patient, a beautiful person. She attended my first pregnancy and now I want her for my second. I haven\'t had the chance to go yet, but if you do, believe me you won\'t regret it. I\'m already looking forward to booking my appointment to see my baby in the best hands.❤️',
    rating: 5,
  },
  {
    id: 9,
    name: 'Naty',
    textEs: 'La Doctora de las Girlies 🥹🩷 Recomendar a la Dra. Ekaterina es hacerlo desde la gratitud y la confianza plena. Desde el primer momento, su trato cálido, respetuoso y humano hace que cada consulta se sienta como un espacio seguro, donde una se siente escuchada, comprendida y cuidada. La Doc, no solo destaca por su gran profesionalismo y conocimiento, sino también por su sensibilidad y empatía. Se toma el tiempo necesario para explicar cada detalle con claridad, resolver dudas con paciencia y acompañar a sus pacientes con una dedicación genuina. Su enfoque va más allá de lo médico: se interesa verdaderamente por el bienestar integral de la mujer, transmitiendo tranquilidad, seguridad y apoyo en cada etapa. Ponerse en manos de ella, es elegir a una profesional comprometida, amorosa y profundamente ética, que ejerce su vocación con pasión y responsabilidad. Sin duda, es una ginecóloga que marca la diferencia.',
    textEn: 'The Girlies\' Doctor 🥹🩷 Recommending Dr. Ekaterina is doing so from gratitude and complete trust. From the very first moment, her warm, respectful, and humane care makes every appointment feel like a safe space, where you feel heard, understood, and cared for. The Doc not only stands out for her great professionalism and knowledge, but also for her sensitivity and empathy. She takes the time needed to explain every detail clearly, resolve doubts with patience, and accompany her patients with genuine dedication. Her approach goes beyond the medical: she truly cares about the overall well-being of women, conveying tranquility, security, and support at every stage. Putting yourself in her hands means choosing a committed, loving, and deeply ethical professional who practices her vocation with passion and responsibility. Without a doubt, she is a gynecologist who makes a difference.',
    rating: 5,
  },
  {
    id: 10,
    name: 'Mónica Guzmán',
    textEs: 'A la Doctora Ekaterina le agradezco desde el corazón. Es una profesional increíble, pero aún más, un ser humano maravilloso. Su carisma, paciencia y tacto profesional son realmente excepcionales. En cada consulta me he sentido escuchada, comprendida y acompañada, pero sobre todo segura y en excelentes manos. 🫶🏻 En un momento en el que me encontraba vulnerable, encontrar una doctora que me brindara tanta empatía hizo toda la diferencia en mi proceso. Su forma de ejercer la medicina no solo sana, sino que también reconforta.❤️‍🩹 Agradezco por el cuido con tanta dedicación y humanidad. Su trabajo deja una huella muy bonita en sus pacientes y en mí especialmente.',
    textEn: 'I thank Dr. Ekaterina from the bottom of my heart. She is an incredible professional, but even more so, a wonderful human being.. Your charisma, patience, and professional tact are truly exceptional. In every appointment I have felt heard, understood, and accompanied, but above all, safe and in excellent hands. 🫶🏻 At a time when I was feeling vulnerable, finding a doctor who offered me so much empathy made all the difference in my journey. Your way of practicing medicine doesn\'t just heal — it also comforts.❤️‍🩹 I am grateful for the care given with such dedication and humanity.. Her work leaves a beautiful mark on your patients, and especially on me.',
    rating: 5,
  },
  {
    id: 11,
    name: 'Cristel',
    textEs: 'Estoy sumamente agradecida porque cuando me refirieron con usted a las 14 semanas (las peores dos semanas de mi vida) porque mi bebé tenia un defecto a las 16 semanas me diste el diagnóstico de mi bebé (Gastroquisis) su profesionalismo, dedicación y seguridad me dieron mucha tranquilidad y fortaleza en el proceso 🩵✨ Agradezco por cada explicación y decisión oportuna, por cuidar y prepararme para recibir a mi bebesito, siempre la voy a recordar con mucho cariño y admiración. 🙏',
    textEn: 'I am incredibly grateful because when I was referred to you at 14 weeks (the worst two weeks of my life) because my baby had a birth defect, at 16 weeks you gave me my baby\'s diagnosis (gastroschisis). Your professionalism, dedication, and confidence gave me so much peace and strength throughout the process. 🩵✨ I appreciate every explanation and timely decision, for caring for me and preparing me to welcome my little one. I will always remember you with so much love and admiration. 🙏',
    rating: 5,
  },
];
