import { getProjects } from "lib/stemcorner";
export default async function handler(req, res) {
  const { cursor } = req.query;
  const projects = await getProjects(cursor);

  res.status(201).json(projects);
}
