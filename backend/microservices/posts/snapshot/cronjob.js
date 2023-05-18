const pool = require("../database/db");

const copyPostsToSnapshotTable = async () => {
  try {
    const client = await pool.connect();

    await client.query("BEGIN");

    const query = "SELECT * posts";
    const result = await client.query(query);

    const insertQuery =
      "INSERT INTO posts_snapshots(user_id, title, image, created_at, name, profilepic, community_id, text, id, post_id, snapshot_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const snapshotDate = new Date();
    for (const row of result.rows) {
      await client.query(insertQuery, [
        row.user_id,
        row.title,
        row.image,
        row.created_at,
        row.name,
        row.profilepic,
        row.community_id,
        row.text,
        row.id,
        row.post_id,
        snapshotDate,
      ]);
    }

    // Commit transaktionen
    await client.query("COMMIT");

    client.release();
  } catch (error) {
    console.error("Fejl under kopiering af indlæg til snapshot-tabel:", error);

    // Rollback transaktionen i tilfælde af fejl
    await client.query("ROLLBACK");
    client.release();
  }
};

// Planlæg en daglig kørsel af funktionen
const schedule = require("node-schedule");
const job = schedule.scheduleJob("0 0 * * *", copyPostsToSnapshotTable);

console.log(
  "Job til kopiering af indlæg til snapshot-tabel er planlagt til at køre hver dag."
);
