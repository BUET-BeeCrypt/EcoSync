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
    date_of_birth character varying(32),
    date_of_hire character varying(32),
    job_title character varying(32),
    payement_per_hour double precision,
    assigned_route text,
    assigned_markers text,
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
};

modules.isManagerOfContractorCompany = async (contract_company_id, user_id) => {
  const query = `SELECT * FROM public."Contractor_Manager" WHERE contract_company_id = $1 AND user_id = $2`;
  const values = [contract_company_id, user_id];
  const { rows } = await pool.query(query, values);
  return rows.length > 0;
};

modules.removeContractorManager = async (contract_company_id, user_id) => {
  const query = `DELETE FROM public."Contractor_Manager" WHERE contract_company_id = $1 AND user_id = $2`;
  const values = [contract_company_id, user_id];
  await pool.query(query, values);
};

modules.createContractorWorker = async (contractorWorker) => {
  const {
    contract_company_id,
    name,
    contact_number,
    date_of_birth,
    date_of_hire,
    job_title,
    payement_per_hour,
  } = contractorWorker;

  const query = `INSERT INTO "Contractor_Worker" (
    contract_company_id,
    name,
    contact_number,
    date_of_birth,
    date_of_hire,
    job_title,
    payement_per_hour
  ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

  const values = [
    contract_company_id,
    name,
    contact_number,
    date_of_birth,
    date_of_hire,
    job_title,
    payement_per_hour,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.getContractorWorkers = async (contract_company_id) => {
  const query = `SELECT * FROM "Contractor_Worker" WHERE contract_company_id = $1`;
  const { rows } = await pool.query(query, [contract_company_id]);
  return rows;
};

modules.getContractorWorker = async (contract_worker_id) => {
  const query = `SELECT * FROM "Contractor_Worker" WHERE contract_worker_id = $1`;
  const { rows } = await pool.query(query, [contract_worker_id]);
  return rows[0];
};

modules.updateContractorWorker = async (
  contract_worker_id,
  contractorWorker
) => {
  const {
    name,
    contact_number,
    date_of_birth,
    date_of_hire,
    job_title,
    payement_per_hour,
  } = contractorWorker;

  const query = `UPDATE "Contractor_Worker" SET
    name = $1,
    contact_number = $2,
    date_of_birth = $3,
    date_of_hire = $4,
    job_title = $5,
    payement_per_hour = $6
    WHERE contract_worker_id = $7 RETURNING *`;

  const values = [
    name,
    contact_number,
    date_of_birth,
    date_of_hire,
    job_title,
    payement_per_hour,
    contract_worker_id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.updateContractorWorkerRoute = async (
  contract_worker_id,
  assigned_route,
  assigned_markers
) => {
  const query = `UPDATE "Contractor_Worker" SET assigned_route = $1, assigned_markers = $2 WHERE contract_worker_id = $3 RETURNING *`;
  const values = [assigned_route, assigned_markers, contract_worker_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.deleteContractorWorker = async (contract_worker_id) => {
  const query = `DELETE FROM "Contractor_Worker" WHERE contract_worker_id = $1`;
  await pool.query(query, [contract_worker_id]);
};

modules.createContractorWorkerLog = async (contract_worker_id, start_time) => {
  console.log(contract_worker_id, start_time);
  const query = `INSERT INTO "Contractor_Worker_Log" (contract_worker_id, entry_time) VALUES ($1, $2) RETURNING *`;
  const values = [contract_worker_id, new Date(start_time)];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.updateContractorWorkerLog = async (
  contract_worker_log_id,
  end_time
) => {
  const query = `UPDATE "Contractor_Worker_Log" SET departure_time = $2 WHERE contract_worker_log_id = $1 RETURNING *`;
  const values = [contract_worker_log_id, new Date(end_time)];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

modules.getUnfinishedContractorWorkerLogs = async (contract_company_id) => {
  const query = `SELECT * FROM "Contractor_Worker_Log" NATURAL JOIN "Contractor_Worker"  WHERE departure_time IS NULL AND contract_company_id = $1`;
  const values = [contract_company_id];
  const { rows } = await pool.query(query, values);
  return rows;
};

modules.getContructorIdFromUserId = async (user_id) => {
  const query = `SELECT contract_company_id FROM public."Contractor_Manager" WHERE user_id = $1`;
  const values = [user_id];
  const { rows } = await pool.query(query, values);
  return rows.length > 0 ? rows[0].contract_company_id : null;
};

modules.updateOrCreateWorkerFromArray = async (workers, user_id) => {
  const constructor_id = await modules.getContructorIdFromUserId(user_id);

  if (!constructor_id) {
    return;
  }

  const createOrReplace = `INSERT INTO "Contractor_Worker" (
    contract_worker_id,
    contract_company_id,
    name,
    contact_number,
    date_of_birth,
    date_of_hire,
    job_title,
    payement_per_hour
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (contract_worker_id) DO UPDATE SET
    contract_company_id = $2,
    name = $3,
    contact_number = $4,
    date_of_birth = $5,
    date_of_hire = $6,
    job_title = $7,
    payement_per_hour = $8
  `;

  for (const worker of workers) {
    const values = [
      worker.contract_worker_id,
      constructor_id,
      worker.name,
      worker.contact_number,
      worker.date_of_birth,
      worker.date_of_hire,
      worker.job_title,
      worker.payement_per_hour,
    ];

    await pool.query(createOrReplace, values);

    // if any worker is not in the array, delete it
    const query = `DELETE FROM "Contractor_Worker" WHERE contract_company_id = $1 AND contract_worker_id NOT IN (${workers
      .map((w) => w.contract_worker_id)
      .join(",")})`;
    await pool.query(query, [constructor_id]);

    return;
  }
};

module.exports = modules;
