const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

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