import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __project_dir = join(dirname(fileURLToPath(import.meta.url)), "../..");

export default __project_dir;
