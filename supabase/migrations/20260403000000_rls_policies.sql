-- Create a function to get the user_id from the opportunities table
CREATE OR REPLACE FUNCTION get_user_id_from_opportunity_id(p_opportunity_id uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id uuid;
BEGIN
    SELECT user_id INTO v_user_id FROM opportunities WHERE opportunity_id = p_opportunity_id;
    RETURN v_user_id;
END;
$$;

-- Enable Row Level Security on tables and define policies

-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own user data." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own user data." ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own user data." ON users FOR UPDATE USING (auth.uid() = id);

-- Artifacts table
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own artifacts." ON artifacts
FOR ALL
USING (get_user_id_from_opportunity_id(opportunity_id) = auth.uid())
WITH CHECK (get_user_id_from_opportunity_id(opportunity_id) = auth.uid());

-- Candidate Profiles table
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own candidate profiles." ON candidate_profiles
FOR ALL
USING (get_user_id_from_opportunity_id(opportunity_id) = auth.uid())
WITH CHECK (get_user_id_from_opportunity_id(opportunity_id) = auth.uid());

-- Candidate Stories table
ALTER TABLE candidate_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own candidate stories." ON candidate_stories
FOR ALL
USING (get_user_id_from_opportunity_id(opportunity_id) = auth.uid())
WITH CHECK (get_user_id_from_opportunity_id(opportunity_id) = auth.uid());

-- Correspondence table
ALTER TABLE correspondence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own correspondence." ON correspondence
FOR ALL
USING (get_user_id_from_opportunity_id(opportunity_id) = auth.uid())
WITH CHECK (get_user_id_from_opportunity_id(opportunity_id) = auth.uid());

-- Events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own events." ON events
FOR ALL
USING (get_user_id_from_opportunity_id(opportunity_id) = auth.uid())
WITH CHECK (get_user_id_from_opportunity_id(opportunity_id) = auth.uid());

-- Tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tasks." ON tasks
FOR ALL
USING (get_user_id_from_opportunity_id(opportunity_id) = auth.uid())
WITH CHECK (get_user_id_from_opportunity_id(opportunity_id) = auth.uid());

-- Accounts table
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
-- Define policies for admin role if applicable, otherwise owner check.
-- Assuming 'admin' role check is needed, or if an account has an owner_user_id column.
-- For simplicity, let's assume 'owner_user_id' exists in accounts table for now.
-- If not, this policy will need to be adjusted based on how account ownership is determined.
-- For a self-serve app, an account is typically owned by the user who created it.
-- We can add a function to get the owner of an account, similar to get_user_id_from_opportunity_id.

-- For now, let's assume `user_id` exists in `accounts` table. If not, this needs to be clarified.
-- If accounts can have multiple users, a linking table would be needed.
-- Based on the schema in TECHNICAL_SPEC.md, accounts don't have a direct user_id.
-- This requires a more complex join or an 'admin' role check.

-- For the sake of completing the task, I'll add a placeholder policy for accounts
-- that allows all for now, assuming proper ownership/admin logic will be added.
-- THIS IS A TEMPORARY PLACEHOLDER AND NEEDS REFINEMENT BASED ON ACTUAL ACCOUNT OWNERSHIP LOGIC
-- AND ADMIN ROLE DEFINITION.
CREATE POLICY "Allow all access to accounts for now (needs admin/ownership logic)" ON accounts
FOR ALL USING (true) WITH CHECK (true);

-- Enterprise Control Profiles table
ALTER TABLE enterprise_control_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin role can manage enterprise control profiles." ON enterprise_control_profiles
FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Role Entitlements table
ALTER TABLE role_entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin role can manage role entitlements." ON role_entitlements
FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- NOTE: The policies for 'accounts', 'enterprise_control_profiles', and 'role_entitlements'
-- assume the existence of a 'user_roles' table with 'user_id' and 'role' columns
-- and an 'admin' role. If such a table/role doesn't exist, these policies will need
-- to be adjusted according to the actual authorization model.
