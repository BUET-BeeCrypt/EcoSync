const pool = require(`../../db/pool`);
const landfills = require(`../landfill/repository`);
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

modules.stsManagerStats = async (sts_id) => {
  const res = {};

  res.vehicles = (
    await pool.query(`SELECT * FROM "Vehicle" WHERE sts_id = $1`, [sts_id])
  ).rows;

  res.sts = (
    await pool.query(`SELECT * FROM "STS" WHERE sts_id = $1`, [sts_id])
  ).rows[0];

  res.fleet = (
    await pool.query(
      `with last_fleets_sts as (
        select vr.sts_id, MAX(f.time_stamp) as "time_stamp" from "Fleet" f natural join "Vehicle_Route" vr 
        where vr.sts_id = $1 group by (vr.sts_id)
      ), fleet_sts as (
        select f.fleet_id, lfs.sts_id from last_fleets_sts lfs join "Vehicle_Route" vr using (sts_id) join "Fleet" f using (route_id, time_stamp)
      ) select * from "Trip" natural join fleet_sts natural join "Vehicle" v`,
      [sts_id]
    )
  ).rows;

  return res;
};

modules.landfillManagerStats = async (landfill_id) => {
  const res = {};

  res.landfill = await landfills.getLandfill(landfill_id);
  res.fleet = await landfills.getVehiclesOfLandfill(landfill_id);
  res.entries_count = (
    await pool.query(
      `SELECT COUNT(*) as count FROM "Landfill_Entry" WHERE landfill_id = $1`,
      [landfill_id]
    )
  ).rows[0].count;
  res.bills_count = (
    await pool.query(
      `SELECT COUNT(*) as count FROM "Bill" WHERE landfill_id = $1`,
      [landfill_id]
    )
  ).rows[0].count;

  return res;
};

module.exports = modules;
