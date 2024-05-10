const repository = require("./repository");
const userRepository = require("../user/repository");

const modules = {};

modules.createContractorCompany = async (req, res) => {
  const contractorCompany = req.body;

  let err_msg = "";

  if (!contractorCompany.name) err_msg += "Name is required. ";
  if (!contractorCompany.contract_id) err_msg += "Contract ID is required. ";
  if (!contractorCompany.registration_date)
    err_msg += "Registration date is required. ";
  if (!contractorCompany.tin) err_msg += "TIN is required. ";
  if (!contractorCompany.contact_number)
    err_msg += "Contact number is required. ";
  if (!contractorCompany.ton_payment_rate)
    err_msg += "Ton payment rate is required. ";
  if (!contractorCompany.required_ton) err_msg += "Required ton is required. ";
  if (!contractorCompany.contract_duration)
    err_msg += "Contract duration is required. ";

  if (!contractorCompany.collection_area)
    err_msg += "Collection area is required. ";

  if (!contractorCompany.sts_id) err_msg += "STS ID is required. ";

  if (isNaN(contractorCompany.ton_payment_rate))
    err_msg += "Ton payment rate must be a number. ";

  if (isNaN(contractorCompany.required_ton))
    err_msg += "Required ton must be a number. ";

  if (err_msg) {
    return res.status(400).json({ error: err_msg });
  }

  try {
    const result = await repository.createContractorCompany(contractorCompany);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.getContractorCompanys = async (req, res) => {
  try {
    const result = await repository.getContractorCompanys();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.getContractorCompany = async (req, res) => {
  const contract_company_id = req.params.contract_company_id;

  try {
    const result = await repository.getContractorCompany(contract_company_id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.updateContractorCompany = async (req, res) => {
  const contract_company_id = req.params.contract_company_id;
  const contractorCompany = req.body;

  let err_msg = "";

  if (!contractorCompany.name) err_msg += "Name is required. ";
  if (!contractorCompany.contract_id) err_msg += "Contract ID is required. ";
  if (!contractorCompany.registration_date)
    err_msg += "Registration date is required. ";
  if (!contractorCompany.tin) err_msg += "TIN is required. ";
  if (!contractorCompany.contact_number)
    err_msg += "Contact number is required. ";
  if (!contractorCompany.ton_payment_rate)
    err_msg += "Ton payment rate is required. ";
  if (!contractorCompany.required_ton) err_msg += "Required ton is required. ";
  if (!contractorCompany.contract_duration)
    err_msg += "Contract duration is required. ";

  if (!contractorCompany.collection_area)
    err_msg += "Collection area is required. ";

  if (!contractorCompany.sts_id) err_msg += "STS ID is required. ";

  if (isNaN(contractorCompany.ton_payment_rate))
    err_msg += "Ton payment rate must be a number. ";

  if (isNaN(contractorCompany.required_ton))
    err_msg += "Required ton must be a number. ";

  if (err_msg) {
    return res.status(400).json({ error: err_msg });
  }

  try {
    const result = await repository.updateContractorCompany(
      contract_company_id,
      contractorCompany
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.deleteContractorCompany = async (req, res) => {
  const contract_company_id = req.params.contract_company_id;

  try {
    await repository.deleteContractorCompany(contract_company_id);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.assignManagaerToContractorCompany = async (req, res) => {
  const contract_company_id = req.params.contract_company_id;
  const user_id = req.body.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (isNaN(user_id)) {
    return res.status(400).json({ error: "User ID must be a number." });
  }

  try {
    const exists = await repository.existsContractorCompany(
      contract_company_id
    );
    if (!exists) {
      return res.status(404).json({ error: "Contractor company not found." });
    }

    const user = await userRepository.getUser(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role_name !== "CONTRACTOR_MANAGER") {
      console.log(user);
      return res.status(400).json({ error: "User must be a manager." });
    }

    const result = await repository.addContractorManager(
      contract_company_id,
      user_id
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.getManagersOfContractorCompany = async (req, res) => {
  const contract_company_id = req.params.contract_company_id;

  try {
    const result = await repository.getContractorManagers(contract_company_id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.removeManagerFromContractorCompany = async (req, res) => {
  const contract_company_id = req.params.contract_company_id;
  const user_id = req.params.user_id;

  try {
    const exists = await repository.existsContractorCompany(
      contract_company_id
    );
    if (!exists) {
      return res.status(404).json({ error: "Contractor company not found." });
    }

    const user = await userRepository.getUser(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isManager = await repository.isManagerOfContractorCompany(
      contract_company_id,
      user_id
    );
    if (!isManager) {
      return res.status(404).json({ error: "User is not a manager." });
    }

    await repository.removeContractorManager(contract_company_id, user_id);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.createContractorWorker = async (req, res) => {
  const contractorWorker = req.body;

  let err_msg = "";

  if (!contractorWorker.name) err_msg += "Name is required. ";
    
  if (!contractorWorker.contact_number)
    err_msg += "Contact number is required. ";
  if (!contractorWorker.contract_company_id)
    err_msg += "Contract company ID is required. ";
  if (err_msg) {
    return res.status(400).json({ error: err_msg });
  }

  try {
    const result = await repository.createContractorWorker(contractorWorker);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.getContractorWorkers = async (req, res) => {
  try {
    const contract_company_id = req.params.contract_company_id;
    console.log(contract_company_id);
    const result = await repository.getContractorWorkers(contract_company_id);
    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: e.message });
  }
};

modules.getContractorWorker = async (req, res) => {
  const worker_id = req.params.worker_id;

  try {
    const result = await repository.getContractorWorker(worker_id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.updateContractorWorker = async (req, res) => {
  const worker_id = req.params.worker_id;
  const contractorWorker = req.body;

  let err_msg = "";

  if (!contractorWorker.name) err_msg += "Name is required. ";
  if (!contractorWorker.contact_number)
    err_msg += "Contact number is required. ";
  if (!contractorWorker.contract_company_id)
    err_msg += "Contract company ID is required. ";
  if (err_msg) {
    return res.status(400).json({ error: err_msg });
  }

  try {
    const result = await repository.updateContractorWorker(
      worker_id,
      contractorWorker
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

modules.deleteContractorWorker = async (req, res) => {
  const worker_id = req.params.worker_id;

  try {
    await repository.deleteContractorWorker(worker_id);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


modules.deleteContractorWorkerRoute = async (req, res) => {
  const contract_worker_id = req.params.contract_worker_id;

  try {
    await repository.updateContractorWorkerRoute(contract_worker_id, "[]","[]");
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

modules.createContractorWorkerLog = async (req, res) => {

  try{
    const contractorWorkerLog = req.body;
    const { contract_worker_id, entry_time } = contractorWorkerLog;
    
    await repository.createContractorWorkerLog(contract_worker_id, entry_time);
    res.status(201).end();
  }catch(e){
    res.status(500).json({ error: e.message });
  }
}

modules.updateContractorWorkerLogEndTime = async (req, res) => {
  try{
    const contractorWorkerLog = req.body;
    const { contract_worker_id, exit_time } = contractorWorkerLog;
    await repository.updateContractorWorkerLogEndTime(contract_worker_id, exit_time);
    res.status(200).end();
  }catch(e){
    res.status(500).json({ error: e.message });
  }
}

modules.getContractorWorkerLogsRunning = async (req, res) => {
  try{
    const contract_company_id = req.params.contract_company_id;
    const result = await repository.getUnfinishedContractorWorkerLogs(contract_company_id);
    res.json(result);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
}

modules.updateContractorWorkerLog = async (req, res) => {
  try{
    const contractorWorkerLog = req.body;
    const { contract_worker_id, exit_time } = contractorWorkerLog;
    await repository.updateContractorWorkerLog(contract_worker_id, exit_time);
    res.status(200).end();
  }catch(e){
    res.status(500).json({ error: e.message });
  }
}



module.exports = modules;
