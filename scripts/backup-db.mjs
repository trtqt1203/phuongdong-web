import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const source = path.resolve(process.env.DATABASE_PATH || "data/phuong-dong.sqlite");
if (!existsSync(source)) throw new Error(`Chưa có cơ sở dữ liệu tại ${source}`);
const folder = path.resolve("backups");
mkdirSync(folder, { recursive: true });
const stamp = new Date().toISOString().replaceAll(":", "-").replace("T", "_").slice(0, 19);
const destination = path.join(folder, `phuong-dong_${stamp}.sqlite`);
const db = new DatabaseSync(source);
db.exec(`VACUUM INTO '${destination.replaceAll("'", "''")}'`);
db.close();
console.log(destination);
