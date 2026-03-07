
-- Fix RLS policies: drop restrictive and recreate as permissive

-- pacientes
DROP POLICY IF EXISTS "Admin/doctora full access pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Secretaria read pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Secretaria insert pacientes" ON public.pacientes;
DROP POLICY IF EXISTS "Secretaria update pacientes" ON public.pacientes;

CREATE POLICY "Admin/doctora full access pacientes" ON public.pacientes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'));

CREATE POLICY "Secretaria read pacientes" ON public.pacientes
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'secretaria'));

CREATE POLICY "Secretaria insert pacientes" ON public.pacientes
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'secretaria'));

CREATE POLICY "Secretaria update pacientes" ON public.pacientes
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'secretaria'));

-- citas
DROP POLICY IF EXISTS "Admin/doctora full access citas" ON public.citas;
DROP POLICY IF EXISTS "Secretaria full access citas" ON public.citas;

CREATE POLICY "Admin/doctora full access citas" ON public.citas
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'));

CREATE POLICY "Secretaria full access citas" ON public.citas
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'secretaria'))
  WITH CHECK (has_role(auth.uid(), 'secretaria'));

-- consultas
DROP POLICY IF EXISTS "Admin/doctora full access consultas" ON public.consultas;

CREATE POLICY "Admin/doctora full access consultas" ON public.consultas
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'));

-- control_prenatal
DROP POLICY IF EXISTS "Admin/doctora full access control_prenatal" ON public.control_prenatal;

CREATE POLICY "Admin/doctora full access control_prenatal" ON public.control_prenatal
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'));

-- expediente_master
DROP POLICY IF EXISTS "Admin/doctora full access expediente" ON public.expediente_master;

CREATE POLICY "Admin/doctora full access expediente" ON public.expediente_master
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'));

-- profiles
DROP POLICY IF EXISTS "Admin/doctora read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Admin/doctora read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'doctora'));

CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
