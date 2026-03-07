-- Add all missing fields to expediente_master table
ALTER TABLE expediente_master
  -- Antecedentes Patológicos (structured booleans + conditionals)
  ADD COLUMN IF NOT EXISTS padece_enfermedad boolean,
  ADD COLUMN IF NOT EXISTS cual_enfermedad text,
  ADD COLUMN IF NOT EXISTS toma_medicamentos boolean,
  ADD COLUMN IF NOT EXISTS cual_medicamento text,
  ADD COLUMN IF NOT EXISTS enfermedad_actual text,
  ADD COLUMN IF NOT EXISTS ha_sido_operada boolean,
  ADD COLUMN IF NOT EXISTS de_que_operacion text,

  -- Ultrasonido
  ADD COLUMN IF NOT EXISTS tiene_ultrasonido boolean,
  ADD COLUMN IF NOT EXISTS ultrasonido_acorde boolean,
  ADD COLUMN IF NOT EXISTS fpp date,

  -- Hábitos (booleans replacing text fields)
  ADD COLUMN IF NOT EXISTS hace_ejercicio boolean,
  ADD COLUMN IF NOT EXISTS fuma boolean,

  -- Preventivos
  ADD COLUMN IF NOT EXISTS gardasil boolean,
  ADD COLUMN IF NOT EXISTS mamografia boolean,

  -- Síntomas ginecológicos
  ADD COLUMN IF NOT EXISTS sinusorragia boolean,
  ADD COLUMN IF NOT EXISTS flujo_anormal boolean,
  ADD COLUMN IF NOT EXISTS dispareunia boolean,

  -- Pareja y anticoncepción
  ADD COLUMN IF NOT EXISTS tiene_pareja boolean,
  ADD COLUMN IF NOT EXISTS tiempo_con_pareja text,
  ADD COLUMN IF NOT EXISTS macp text,
  ADD COLUMN IF NOT EXISTS maca text,
  ADD COLUMN IF NOT EXISTS problemas_anticonceptivos text,
  ADD COLUMN IF NOT EXISTS riesgo text,

  -- Historial Ginecológico
  ADD COLUMN IF NOT EXISTS usa_anticonceptivo boolean,
  ADD COLUMN IF NOT EXISTS cual_anticonceptivo text,
  ADD COLUMN IF NOT EXISTS ha_estado_embarazada boolean,
  ADD COLUMN IF NOT EXISTS otros_embarazos text,
  ADD COLUMN IF NOT EXISTS ciclos_regulares boolean,
  ADD COLUMN IF NOT EXISTS descripcion_ciclos text,
  ADD COLUMN IF NOT EXISTS dismenorrea boolean,
  ADD COLUMN IF NOT EXISTS descripcion_dismenorrea text,
  ADD COLUMN IF NOT EXISTS partos_vaginales integer,

  -- Citología y VPH
  ADD COLUMN IF NOT EXISTS se_ha_hecho_citologia boolean,
  ADD COLUMN IF NOT EXISTS fecha_ultima_citologia date,
  ADD COLUMN IF NOT EXISTS citologia_alterada boolean,
  ADD COLUMN IF NOT EXISTS descripcion_citologia_alterada text,
  ADD COLUMN IF NOT EXISTS tratada_con text,
  ADD COLUMN IF NOT EXISTS prueba_vph_realizada boolean,

  -- Historia Clínica / Obstétrico
  ADD COLUMN IF NOT EXISTS pmf text,
  ADD COLUMN IF NOT EXISTS partos_preterminos text,
  ADD COLUMN IF NOT EXISTS complicaciones_embarazos text,
  ADD COLUMN IF NOT EXISTS desea_hijos text CHECK (desea_hijos IN ('Sí', 'No', 'No está segura')),
  ADD COLUMN IF NOT EXISTS tvp boolean,
  ADD COLUMN IF NOT EXISTS ca_mama boolean,
  ADD COLUMN IF NOT EXISTS endom boolean,
  ADD COLUMN IF NOT EXISTS hepatopatia boolean,
  ADD COLUMN IF NOT EXISTS sugerencias text,
  ADD COLUMN IF NOT EXISTS fecha_proximo_ultrasonido date,

  -- Vida sexual
  ADD COLUMN IF NOT EXISTS prs_anios integer,
  ADD COLUMN IF NOT EXISTS nps integer,

  -- Grupo sanguíneo
  ADD COLUMN IF NOT EXISTS grupo_sanguineo text,
  ADD COLUMN IF NOT EXISTS rh_paciente text,
  ADD COLUMN IF NOT EXISTS rh_pareja text;
