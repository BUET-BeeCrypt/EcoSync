const repository = require("./repository");
const stsRepository = require("../sts/repository");
const modules = {};

modules.getStats = async (req, res) => {
  const role = req.user.role;

  try {
    if (role === "SYSTEM_ADMIN") {
      const stats = await repository.adminStats();
      return res.status(200).json(stats);
    } else if (role === "STS_MANAGER") {
      const sts_id = await stsRepository.getSTSIDfromManagerID(req.user.user_id);
      if (!sts_id) {
        return res.status(404).json({ message: "STS not found" });
      }
      const stats = await repository.stsManagerStats(sts_id);
      return res.status(200).json(stats);
    } else if (role === "LANDFILL_MANAGER") {
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json(req.user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = modules;
