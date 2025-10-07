import fs from "fs";
import path from "path";

const mdxPath = path.join(process.cwd(), "src/app/admin/Docs/mdx");

export function getAllMdxFiles() {
  const files = fs.readdirSync(mdxPath).filter((file) => file.endsWith(".mdx"));
  return files.map((file) => path.join(mdxPath, file));
}