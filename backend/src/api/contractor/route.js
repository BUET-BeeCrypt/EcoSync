const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

router.get("/sts", controller.getSTS);

router.get("/workforce/worker/:worker_id",controller.getContractorWorker);
router.get("/workforce",controller.getContractorWorkers);
router.post("/workforce",controller.createContractorWorker);
router.put("/workforce",controller.createOrUpdateWorkers);
router.put("/workforce/worker/:worker_id",controller.updateContractorWorker);
router.delete("/workforce/:worker_id",controller.deleteContractorWorker);
router.delete("/workforce/route/:worker_id",controller.deleteContractorWorkerRoute);

router.post("/logging",controller.createContractorWorkerLog);
router.get("/logging/:contract_company_id",controller.getContractorWorkerLogsRunning);
router.put("/logging/:log_id",controller.updateContractorWorkerLog);
router.post("/", controller.createContractorCompany);
router.get("/", controller.getContractorCompanys);
router.get("/:contract_company_id", controller.getContractorCompany);
router.put("/:contract_company_id", controller.updateContractorCompany);
router.delete("/:contract_company_id", controller.deleteContractorCompany);

// Manager
router.post("/:contract_company_id/managers", controller.assignManagaerToContractorCompany);
router.get("/:contract_company_id/managers", controller.getManagersOfContractorCompany);
router.delete("/:contract_company_id/managers/:user_id", controller.removeManagerFromContractorCompany);


module.exports = router;