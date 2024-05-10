const pool = require(`../../db/pool`);

const modules = {};

/**
CREATE TABLE public."Contractor_Company"
(
    contract_company_id serial NOT NULL,
    name character varying(256) NOT NULL,
    contract_id character varying(256) NOT NULL,
    registration_date timestamp NOT NULL,
    tin character varying(256) NOT NULL,
    contact_number character varying(256) NOT NULL,
    workforce_size integer NOT NULL,
    ton_payment_rate double precision NOT NULL,
    required_ton double precision NOT NULL,
    contract_duration integer NOT NULL,
    collection_area character varying(256) NOT NULL,
    sts_id integer NOT NULL,
    PRIMARY KEY (contract_company_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public."Contractor_Manager"
(
    contract_company_id integer NOT NULL,
    user_id integer NOT NULL UNIQUE,
    PRIMARY KEY (contract_company_id, user_id),
    FOREIGN KEY (contract_company_id)
        REFERENCES public."Contractor_Company" (contract_company_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public."Contractor_Worker"
(
    contract_worker_id serial NOT NULL,
    contract_company_id integer NOT NULL,
    name character varying(256) NOT NULL,
    contact_number character varying(256) NOT NULL,
    PRIMARY KEY (contract_worker_id),
    FOREIGN KEY (contract_company_id)
        REFERENCES public."Contractor_Company" (contract_company_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public."Contractor_Worker_Log"
(
    contract_worker_log_id serial NOT NULL,
    contract_worker_id integer NOT NULL,
    entry_time timestamp NOT NULL,
    departure_time timestamp,
    PRIMARY KEY (contract_worker_log_id),
    FOREIGN KEY (contract_worker_id)
        REFERENCES public."Contractor_Worker" (contract_worker_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
 */

modules.createContractorCompany = async (contractorCompany) => {
  const {
    name,
    contract_id,
    registration_date,
    tin,
    contact_number,
    workforce_size,
    ton_payment_rate,
    required_ton,
    contract_duration,
    collection_area,
    sts_id,
  } = contractorCompany;

  const query = `INSERT INTO "Contractor_Company" (
    name,
    contract_id,
    registration_date,
    tin,
    contact_number,
    workforce_size,
    ton_payment_rate,
    required_ton,
    contract_duration,
    collection_area,
    sts_id
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;

  const values = [
    name,
    contract_id,
    registration_date,
    tin,
    contact_number,
    workforce_size,
    ton_payment_rate,
    required_ton,
    contract_duration,
    collection_area,
    sts_id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.existsContractorCompany = async (contractor_company_id) => {

  const query = `SELECT * FROM "Contractor_Company" WHERE contract_company_id = $1`;
  const values = [contractor_company_id];

  const { rows } = await pool.query(query, values);
  return rows.length > 0;
};

modules.getContractorCompanys = async () => {
  const query = `SELECT *,
  (SELECT COUNT(*) FROM public."Contractor_Worker" WHERE contract_company_id = "Contractor_Company".contract_company_id) AS worker_count,
    (SELECT COUNT(*) FROM public."Contractor_Manager" WHERE contract_company_id = "Contractor_Company".contract_company_id) AS manager_count
  FROM "Contractor_Company"`;
  const { rows } = await pool.query(query);
  return rows;
};

modules.getContractorCompany = async (contract_company_id) => {
  const query = `SELECT *,
    (SELECT COUNT(*) FROM public."Contractor_Worker" WHERE contract_company_id = "Contractor_Company".contract_company_id) AS worker_count,
        (SELECT COUNT(*) FROM public."Contractor_Manager" WHERE contract_company_id = "Contractor_Company".contract_company_id) AS manager_count
    FROM "Contractor_Company" WHERE contract_company_id = $1`;
  const { rows } = await pool.query(query, [contract_company_id]);
  return rows[0];
};

modules.updateContractorCompany = async (
  contract_company_id,
  contractorCompany
) => {
  const {
    name,
    contract_id,
    registration_date,
    tin,
    contact_number,
    workforce_size,
    ton_payment_rate,
    required_ton,
    contract_duration,
    collection_area,
    sts_id,
  } = contractorCompany;

  const query = `UPDATE "Contractor_Company" SET
        name = $1,
        contract_id = $2,
        registration_date = $3,
        tin = $4,
        contact_number = $5,
        workforce_size = $6,
        ton_payment_rate = $7,
        required_ton = $8,
        contract_duration = $9,
        collection_area = $10,
        sts_id = $11
        WHERE contract_company_id = $12 RETURNING *`;

  const values = [
    name,
    contract_id,
    registration_date,
    tin,
    contact_number,
    workforce_size,
    ton_payment_rate,
    required_ton,
    contract_duration,
    collection_area,
    sts_id,
    contract_company_id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.deleteContractorCompany = async (contract_company_id) => {
  const query = `DELETE FROM "Contractor_Company" WHERE contract_company_id = $1`;
  await pool.query(query, [contract_company_id]);
};

modules.addContractorManager = async (contract_company_id, user_id) => {
  const query = `INSERT INTO "Contractor_Manager" (contract_company_id, user_id) VALUES ($1, $2) RETURNING *`;
  const values = [contract_company_id, user_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.getContractorManagers = async (contract_company_id) => {
  const query = `SELECT user_id, "name", username, email
  FROM public."User" WHERE user_id IN (SELECT user_id FROM public."Contractor_Manager" WHERE contract_company_id = $1)`;
    const { rows } = await pool.query(query, [contract_company_id]);
    return rows;
}

modules.isManagerOfContractorCompany = async (contract_company_id, user_id) => {
    const query = `SELECT * FROM public."Contractor_Manager" WHERE contract_company_id = $1 AND user_id = $2`;
    const values = [contract_company_id, user_id];
    const { rows } = await pool.query(query, values);
    return rows.length > 0;
    }

modules.removeContractorManager = async (contract_company_id, user_id) => {
    const query = `DELETE FROM public."Contractor_Manager" WHERE contract_company_id = $1 AND user_id = $2`;
    const values = [contract_company_id, user_id];
    await pool.query(query, values);
}

module.exports = modules;

