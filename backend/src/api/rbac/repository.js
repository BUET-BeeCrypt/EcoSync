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





module.exports = {
    createRole,
    updateRole,
    createPermission,
    updatePermission,
    addRolePermission,

};