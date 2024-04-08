import __project_dir from "./_project_dir.js";
import readFile from "./readFile.js";

const readJSON = (file, localToProject = true) => {
  const json = JSON.parse(readFile(file, localToProject));

  return json;
};

export default readJSON;
