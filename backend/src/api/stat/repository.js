const pool = require(`../../db/pool`);
modules = {};

modules.getStats = async () => {
  const query = `SELECT * FROM "Stats"`;
  const result = await pool.query(query);
  return result.rows;
};

modules.adminStats = async () => {
  const res = {};

  res.count = {};
  res.count.sts = (
    await pool.query(`SELECT COUNT(*) as count FROM "STS"`)
  ).rows[0].count;
  res.count.landfill = (
    await pool.query(`SELECT COUNT(*) as count FROM "Landfill"`)
  ).rows[0].count;
  res.count.vehicles = (
    await pool.query(`SELECT COUNT(*) as count FROM "Vehicle"`)
  ).rows[0].count;
  res.count.users = (
    await pool.query(`SELECT COUNT(*) as count FROM "User"`)
  ).rows[0].count;

  res.location = {};
  res.location.sts = (
    await pool.query(
      `SELECT sts_id, name, location, latitude, longitude FROM "STS"`
    )
  ).rows;
  res.location.landfill = (
    await pool.query(
      `SELECT landfill_id, name, latitude, longitude FROM "Landfill"`
    )
  ).rows;

  res.garbage = {};
  res.garbage.sts = (
    await pool.query(
      `SELECT COALESCE(SUM(volume), 0) as volume FROM "STS_Entry"`
    )
  ).rows[0].volume;
  res.garbage.landfill = (
    await pool.query(
      `SELECT COALESCE(SUM(volume), 0) as volume FROM "Landfill_Entry"`
    )
  ).rows[0].volume;
  res.garbage.vehicle =
    -(
      await pool.query(
        `SELECT COALESCE(SUM(volume), 0) as volume FROM "STS_Entry" where vehicle_id is not null`
      )
    ).rows[0].volume - res.garbage.landfill;

  return res;
};

module.exports = modules;
