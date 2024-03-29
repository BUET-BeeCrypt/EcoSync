const repository = require("./repository");
const modules = {};

modules.getStats = async (req, res) => {
  const role = req.user.role;

  try {
    if (role === "SYSTEM_ADMIN") {
      const stats = await repository.adminStats();
      return res.status(200).json(stats);
    } else if (role === "STS_MANAGER") {
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
