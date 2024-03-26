const pool = require(`../../db/pool`);

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

const createRole = async (role) => {
	const query = `INSERT INTO "Role"(name, details) VALUES($1, $2)`;
	const result = await pool.query(query,[role.name,role.details]);
	return;
}

const updateRole = async (role_id, role) => {
	const query = `UPDATE "Role" SET name = $2, details = $3 WHERE role_id = $1`;
	const result = await pool.query(query,[role_id, role.name, role.details]);
	return;
}

const createPermission = async (permission) => {
	const query = `INSERT INTO "Permission"(name, details) VALUES($1, $2)`;
	const result = await pool.query(query,[permission.name,permission.details]);
	return;
}

const updatePermission = async (permission_id, permission) => {
	const query = `UPDATE "Permission" SET name = $2, details = $3 WHERE permission_id = $1`;
	const result = await pool.query(query,[permission_id, permission.name,permission.details]);
	return;
}

const addRolePermission = async (role_id, permission_id) => {
	const query = `INSERT INTO permission_role(role_id, permission_id) VALUES($1, $2)`;
}

// check a user has a permission or not
const hasPermission = async (role_name, permission_name) => {

    // const query = `SELECT 1 FROM "Permission_Role" 
    // JOIN "Permission" on "Permission_Role".permission_id = "Permission".permission_id
    // WHERE "Permission_Role".role_id = $1 AND "Permission".name = $2`;
    const query = `select 1 from "Permission_Role"
    where role_name=$1 and permission_name=$2;`

    const result = await pool.query(query,[role_name, permission_name]);

    return !!result.rows[0];
}



module.exports = {
    createRole,
    updateRole,
    createPermission,
    updatePermission,
    addRolePermission,
    hasPermission,
};