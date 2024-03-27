const pool = require(`../../db/pool`);
modules = {};

/*
CREATE TABLE public.`Roles`
(
    role_id serial NOT NULL,
    name character varying(256) NOT NULL,
    details character varying(256) NOT NULL,
    PRIMARY KEY (role_id)
);


CREATE TABLE public.`Permissions`
(
    permission_id serial NOT NULL,
    name character varying(256) NOT NULL,
    details character varying(256) NOT NULL,
    PRIMARY KEY (permission_id)
);

CREATE TABLE public.`Permission_Role`
(
    permission_id integer NOT NULL,
    role_id integer NOT NULL,
    PRIMARY KEY (permission_id, role_id),
    FOREIGN KEY (permission_id)
        REFERENCES public.`Permissions` (permission_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (role_id)
        REFERENCES public.`Roles` (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
*/
modules.existsRole = async (role_name) => {
    const query = `SELECT 1 FROM "Role" WHERE name = $1`;
    const result = await pool.query(query,[role_name]);
    return !!result.rows[0];
}

modules.createRole = async (role_name, description) => {
	const query = `INSERT INTO "Role" (name, details) VALUES($1, $2)`;
	const result = await pool.query(query,[role_name,description]);
	return;
}

modules.updateRole = async (old_role_name, new_role_name, role_desc) => {
	const query = `UPDATE "Role" SET name = $2, details = $3 WHERE name = $1`;
	const result = await pool.query(query,[old_role_name, new_role_name, role_desc]);
	return;
}

modules.updateRoleDescription = async (role_name, role_desc) => {
    const query = `UPDATE "Role" SET details = $2 WHERE name = $1`;
    const result = await pool.query(query,[role_name, role_desc]);
    return;
}

modules.deleteRole = async (role_name) => {
    // delete cascade
    const query = `DELETE FROM "Role" WHERE name = $1`;
    const result = await pool.query(query,[role_name]);
}

modules.existsPermission = async (permission_name) => {
    const query = `SELECT 1 FROM "Permission" WHERE name = $1`;
    const result = await pool.query(query, [permission_name]);
    return !!result.rows[0];
}

modules.createPermission = async (permission_name, description) => {
	const query = `INSERT INTO "Permission"(name, details) VALUES($1, $2)`;
    const result = await pool.query(query, [permission_name, description]);
	return;
}

modules.updatePermission = async (permission_id, permission) => {
	const query = `UPDATE "Permission" SET name = $2, details = $3 WHERE permission_id = $1`;
	const result = await pool.query(query,[permission_id, permission.name,permission.details]);
	return;
}

modules.deletePermission = async (permission_name) => {
    // delete cascade
    const query = `DELETE FROM "Permission" WHERE name = $1`;
    const result = await pool.query(query, [permission_name]);
}

// get permissions with pagination
modules.getPermissions = async (limit, offset) => {
    const query = `SELECT * FROM "Permission" LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
}

// get role permissions with pagination
modules.getRolePermissions = async (role_name, limit, offset) => {
    const query = `SELECT * FROM "Permission_Role" WHERE role_name = $1 LIMIT $2 OFFSET $3`;
    const result = await pool.query(query, [role_name, limit, offset]);
    return result.rows;
}

modules.assignPermission = async (role_name, permission_name) => {
    const query = `INSERT INTO "Permission_Role"(role_name, permission_name) VALUES($1, $2) RETURNING *`;
    const result = await pool.query(query, [role_name, permission_name]);
    return result.rows[0];
}

// revoke permission from a role
modules.revokePermission = async (role_name, permission_name) => {
    const query = `DELETE FROM "Permission_Role" WHERE role_name = $1 AND permission_name = $2`;
    const result = await pool.query(query, [role_name, permission_name]);
}

// check a user has a permission or not
modules.hasPermission = async (role_name, permission_name) => {

    // const query = `SELECT 1 FROM "Permission_Role" 
    // JOIN "Permission" on "Permission_Role".permission_id = "Permission".permission_id
    // WHERE "Permission_Role".role_id = $1 AND "Permission".name = $2`;
    const query = `select 1 from "Permission_Role"
    where role_name=$1 and permission_name=$2;`

    const result = await pool.query(query,[role_name, permission_name]);

    return !!result.rows[0];
}



module.exports = modules;