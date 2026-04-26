-- =============================================
-- UNBRIDALED — Initial Schema Migration
-- All tables prefixed with ub_
-- Run in Supabase SQL editor or via supabase db push
-- =============================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- ub_users — extended profile for authenticated users
-- =============================================
CREATE TABLE IF NOT EXISTS ub_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  state TEXT CHECK (state IN ('CA', 'TX', 'NY')),
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'frontend', 'core')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  scenarios_run INTEGER DEFAULT 0,
  plaid_connected BOOLEAN DEFAULT FALSE,
  explicit_advice_disclaimer_accepted BOOLEAN DEFAULT FALSE,
  explicit_advice_disclaimer_accepted_at TIMESTAMPTZ,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  account_deletion_requested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: users can only read/write their own row
ALTER TABLE ub_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ub_users_self_access" ON ub_users
  USING (auth_user_id = auth.uid());

-- =============================================
-- ub_scenarios — saved scenario runs
-- =============================================
CREATE TABLE IF NOT EXISTS ub_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES ub_users(id) ON DELETE CASCADE,
  state TEXT CHECK (state IN ('CA', 'TX', 'NY')),
  inputs JSONB NOT NULL, -- HouseholdFinancials (no PII beyond financial figures)
  outputs JSONB NOT NULL, -- ScenarioResult
  version TEXT DEFAULT '1.0', -- engine version for schema migrations
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ub_scenarios_user_id ON ub_scenarios (user_id);

ALTER TABLE ub_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ub_scenarios_self_access" ON ub_scenarios
  USING (user_id IN (SELECT id FROM ub_users WHERE auth_user_id = auth.uid()));

-- =============================================
-- ub_state_formulas — formula version registry (for audit/sourcing)
-- =============================================
CREATE TABLE IF NOT EXISTS ub_state_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL CHECK (state IN ('CA', 'TX', 'NY')),
  formula_type TEXT NOT NULL, -- 'spousal_support', 'child_support', 'property_division'
  formula_version TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_date TEXT NOT NULL, -- YYYY-MM-DD when source was fetched
  formula_description TEXT NOT NULL,
  verified_against TEXT, -- URL of worked example used for verification
  verified_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial formula registry
INSERT INTO ub_state_formulas (state, formula_type, formula_version, source_url, source_date, formula_description, active)
VALUES
  ('CA', 'spousal_support', '1.0',
   'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4320.',
   '2026-04-26',
   'Santa Clara temporary formula: 40% higher net income - 50% lower net income. Long-term: FC § 4320 factors (judicial discretion).',
   TRUE),
  ('CA', 'child_support', '1.0',
   'https://childsupport.ca.gov/guideline-calculator/',
   '2026-04-26',
   'CA FC § 4055 guideline: CS = K[HN - (H%)(TN)]. K approximated; official calculator required for exact amount.',
   TRUE),
  ('CA', 'property_division', '1.0',
   'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=760.',
   '2026-04-26',
   'Community property: equal (50/50) division of all marital assets and debts per CA FC § 760, § 2550.',
   TRUE),
  ('TX', 'spousal_support', '1.0',
   'https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf',
   '2026-04-26',
   'TX FC §§ 8.051-8.059: lesser of $5,000/mo or 20% of payor gross income. Eligibility gates: marriage ≥10yr, family violence, disability. Duration: 5/7/10 years.',
   TRUE),
  ('TX', 'child_support', '1.0',
   'https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125',
   '2026-04-26',
   'TX FC § 154.125: 20/25/30/35/40% of obligor net monthly resources. Cap: $11,700/mo (updated Sept 1, 2025).',
   TRUE),
  ('TX', 'property_division', '1.0',
   'https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=7.001',
   '2026-04-26',
   'TX FC § 7.001: just and right division of community property. Not guaranteed 50/50; fault and circumstances considered.',
   TRUE),
  ('NY', 'spousal_support', '1.0',
   'https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml',
   '2026-04-26',
   'NY DRL § 236(B): Step 1: 30% higher income - 20% lower income. Step 2: 40% combined - lower income. Use lesser. Cap: $228,000 gross annual.',
   TRUE),
  ('NY', 'child_support', '1.0',
   'https://childsupport.ny.gov/pdfs/CSSA.pdf',
   '2026-04-26',
   'CSSA NY DRL § 240(1-b): 17/25/29/31/35% of combined income up to $183,000 cap (Mar 2024-Feb 2026). Self-support reserve $21,128/yr (Mar 1, 2025).',
   TRUE),
  ('NY', 'property_division', '1.0',
   'https://www.nysenate.gov/legislation/laws/DOM/236',
   '2026-04-26',
   'NY DRL § 236(B)(5): equitable distribution, 14 factors. Not necessarily 50/50.',
   TRUE);

-- =============================================
-- ub_pdf_exports — track PDF exports (for paywall enforcement)
-- =============================================
CREATE TABLE IF NOT EXISTS ub_pdf_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES ub_users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES ub_scenarios(id) ON DELETE SET NULL,
  exported_at TIMESTAMPTZ DEFAULT NOW(),
  file_size_bytes INTEGER
);

ALTER TABLE ub_pdf_exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ub_pdf_exports_self_access" ON ub_pdf_exports
  USING (user_id IN (SELECT id FROM ub_users WHERE auth_user_id = auth.uid()));

-- =============================================
-- ub_leads — email capture (landing page)
-- =============================================
CREATE TABLE IF NOT EXISTS ub_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  state TEXT CHECK (state IN ('CA', 'TX', 'NY')),
  source TEXT DEFAULT 'landing',
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table: admin-only (no user-facing RLS needed; service role access only)

-- =============================================
-- ub_audit_log — all data access events (G2 compliance)
-- =============================================
CREATE TABLE IF NOT EXISTS ub_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT, -- 'plaid_token', 'scenario', 'pdf_export', 'account_deletion'
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ub_audit_log_user_id ON ub_audit_log (user_id);
CREATE INDEX idx_ub_audit_log_created_at ON ub_audit_log (created_at);

-- Audit log: insert-only via service role, no user-facing reads

-- =============================================
-- ub_plaid_items — encrypted Plaid item storage (G2 compliance)
-- Access tokens stored in Supabase Vault, never plaintext
-- This table stores metadata only; the actual access_token is in vault.secrets
-- =============================================
CREATE TABLE IF NOT EXISTS ub_plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES ub_users(id) ON DELETE CASCADE,
  plaid_item_id TEXT NOT NULL,
  plaid_institution_name TEXT,
  vault_secret_id UUID, -- reference to vault.secrets row containing encrypted access_token
  environment TEXT DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'development', 'production')),
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  disconnected_at TIMESTAMPTZ -- set on account deletion, token revoked
);

ALTER TABLE ub_plaid_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ub_plaid_items_self_access" ON ub_plaid_items
  USING (user_id IN (SELECT id FROM ub_users WHERE auth_user_id = auth.uid()));

-- =============================================
-- Functions
-- =============================================

-- Auto-update updated_at on ub_users
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ub_users_updated_at
  BEFORE UPDATE ON ub_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
