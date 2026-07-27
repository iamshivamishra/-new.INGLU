import Candidate from "../models/Candidate.js";
import Interview from "../models/Interview.js";
import Offer from "../models/Offer.js";
import { crudFactory } from "../utils/crudFactory.js";

const candidateBase = crudFactory(Candidate);
export const listCandidates = candidateBase.list;
export const getCandidate = candidateBase.getOne;
export const createCandidate = candidateBase.create;
export const removeCandidate = candidateBase.remove;

export async function updateCandidateStage(req, res) {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, { stage: req.body.stage }, { new: true });
  if (!candidate) return res.status(404).json({ message: "Not found" });
  res.json(candidate);
}

export async function addEvaluation(req, res) {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) return res.status(404).json({ message: "Not found" });
  candidate.evaluation.push(...req.body.evaluation);
  await candidate.save();
  res.json(candidate);
}

export async function scheduleInterview(req, res) {
  const interview = await Interview.create(req.body);
  res.status(201).json(interview);
}

export async function createOffer(req, res) {
  const offer = await Offer.create(req.body);
  res.status(201).json(offer);
}

export async function sendOffer(req, res) {
  const offer = await Offer.findByIdAndUpdate(req.params.id, { status: "Sent" }, { new: true });
  if (!offer) return res.status(404).json({ message: "Not found" });
  res.json(offer);
}

export async function pipeline(req, res) {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  const candidates = await Candidate.find(filter);
  const stages = ["Applied","Screened","Interview","Assignment","Offer","Hired","Rejected"];
  const grouped = Object.fromEntries(stages.map((s) => [s, candidates.filter((c) => c.stage === s)]));
  res.json(grouped);
}
